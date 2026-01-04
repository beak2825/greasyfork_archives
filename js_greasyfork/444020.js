// ==UserScript==
// @name         乙方宝供应商库数据抓取
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  try to take over the world!
// @author       glk
// @match        http://qiye.qianlima.com/yfbsite/*
// @grant        none
// @description   一个关于《乙方宝》http://qiye.qianlima.com 供应商库数据抓取的脚本
// @downloadURL https://update.greasyfork.org/scripts/444020/%E4%B9%99%E6%96%B9%E5%AE%9D%E4%BE%9B%E5%BA%94%E5%95%86%E5%BA%93%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444020/%E4%B9%99%E6%96%B9%E5%AE%9D%E4%BE%9B%E5%BA%94%E5%95%86%E5%BA%93%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 表固定头
  const KEY_ORDER = [
    "部门",
    "最后更新",
    "客户名称",
    "省份",
    "地区",
    "详细地址",
    "邮编",
    "联系人",
    "职位",
    "手机",
    "联系电话",
    "传真号码",
    "企业网站",
    "客户邮箱",
    "产品分类",
    "产品小类",
    "客户类型",
    "客户级别",
    "客户来源",
    "主营项目",
    "备注其它"
  ]

  // 空值应该写什么
  const NULL_VALUE = '-'

  // 最大字符长度
  const MAX_STR_LEN = 120

  // 头像备注
  function getAvatarRemarks(str='') {
    if (typeof str !== 'string') {
      str = str.toString()
    }
    if (str.includes('yfb_logo')) {
      return '联系人头像：默认头像'
    } else {
      return '联系人头像：自定义头像'
    }
  }

  // 单元格内容截取
  function cellContentCut (str='') {
    if (typeof str !== 'string') {
      str = str.toString()
    }
    if (str.length < MAX_STR_LEN) { 
      return str 
    } else {
      return `${str.substr(0, MAX_STR_LEN - 3)}...`
    }
  }

  // 默认公司名称
  function getDefaultCompany (suffix) {
    if (window.glk_company_num) {
      window.glk_company_num ++
    } else {
      window.glk_company_num = 1
    }
    return `公司${window.glk_company_num}${suffix}`
  }


  // 对象根据指定key排序
  function objKeySort (obj={}) {
    let _obj = {}
    KEY_ORDER.forEach(i => {
      _obj[i] = obj[i] || ''        
    })
    return _obj
  }

  // 表格数据转JSON
  function tabelToJson(tabelNode) {
    const tbody = tabelNode.children[1]
    let str = ''
    let arr = []
    Array.from(tbody.children).forEach((j, jIdx) => {
      window.glk_province // 省份
      window.glk_business

      let obj = {
        "省份": window.glk_province,
        "产品分类": window.glk_business,
        "客户来源": '千里马'
      }

      const timeSuffix = `-${Date.now()}`
      Array.from(j.children).forEach((k, kIdx) => {
        switch (kIdx) {
          case 0:
            const avatarSrc = k.children[0].getAttribute('src')
            str += `头像：${avatarSrc}

              `
            obj['备注其它'] = getAvatarRemarks(avatarSrc) // 头像
            break;
          case 1:
            const uName = k.innerText
            str += `用户名：${uName}

              `
            obj['联系人'] = uName || NULL_VALUE // 用户名
            break;
          case 2:
            const company = k.innerText
            str += `公司：${company}

              `
            obj['客户名称'] = company || getDefaultCompany(timeSuffix) // 公司
            break;
          case 3:
            const major = k.innerText
            str += `主营：${major}

              `
            obj['主营项目'] = cellContentCut(major) || NULL_VALUE // 主营
            break;
          case 4:
            const telContent = k.children[0].children[0].getAttribute('href')
            const tel = telContent.replace(/tel:/, '')
            str += `联系：${tel}



              `
            obj['联系电话'] = tel || NULL_VALUE // 联系
            break;
        }
      })
      arr.push(objKeySort(obj))
    })
    return arr
  }

  // 获取当前关键词下的总页数
  function getTotalPageCount() {
    let count = 0
    const iframe = document.getElementsByTagName('iframe')[0].contentDocument
    const aNodes = iframe.getElementsByClassName('pagination')[0].getElementsByTagName('a')
    Array.from(aNodes).forEach(i => {
      const innerText = i.innerText
      if (innerText.includes('当前')) {
        const matchReg = /(?<=\/).*?(?=页)/
        count = Number(innerText.match(matchReg)[0])
      }
    })
    return count
  }

  // 获取下一页节点
  function getNextPageNode() {
    return new Promise(async resolve => {
      let node = 0
      const iframe = document.getElementsByTagName('iframe')[0].contentDocument
      const pagination = iframe.getElementsByClassName('pagination')[0]
      if (!pagination) {
        console.log('没有找到翻页控件')
        await sleep(0.5)
        return getNextPageNode()
      } else {
        const aNodes = pagination.getElementsByTagName('a')
        Array.from(aNodes).forEach(i => {
          const innerText = i.innerText
          if (innerText.includes('下一页')) {
            node = i
          }
        })
        resolve(node)
      }
    })
  }

  // 休眠
  function sleep(duration = 3) {
    return new Promise(resolve => {
      setTimeout(resolve, duration * 1000)
    })
  }

  // 获取表格
  function getTableNode() {
    const iframe = document.getElementsByTagName('iframe')[0].contentDocument
    return iframe.getElementsByTagName('table')[0]
  }

  // table html 转 table 节点
  function createNode(htmlStr) {
    return document.createRange().createContextualFragment(htmlStr).children[0]
  }

  // 添加导出 excel 脚本
  function excelScript() {
    const script = document.createElement('script')
    script.src = 'http://demo.haoji.me/2017/02/08-js-xlsx/js/xlsx.core.min.js'
    document.head.appendChild(script)
  }

  // loading
  function loading(bool = true) {
    const maskContainer = document.getElementById('glk_mask')
    if (!maskContainer) {
      const maskContainer = document.createElement('div')
      maskContainer.id = 'glk_mask'
      maskContainer.innerHTML = `
        <div class="mask" style="width: 100%; height: 100%; background-color: #00000052;"></div>
        <p id="pending_text" style="position: absolute; top: 50%; left: 50%; transform:translate(-50%, -50%);">
            正在抓取数据😎 等着吧.......
        </p>
        <p class="success" style="display: none; position: absolute; top: 50%; left: 50%; transform:translate(-50%, -50%);">
            <span>数据抓取完成🤣</span>
            <button>导出Excle并关闭</button>
        </p>
      `
      const rightNode = document.getElementById('right')
      const { width, height } = getComputedStyle(rightNode)
      Object.assign(maskContainer.style, {
        position: 'absolute',
        right: 0,
        top: 0,
        width,
        height,
        lineHeight: height,
        textAlign: 'center',
        color: '#fff',
        fontSize: '25px',
        userSelect: 'none',
      })
      Object.assign(rightNode.style, {
        position: 'relative'
      })
      rightNode.appendChild(maskContainer)
      maskContainer.getElementsByTagName('button')[0].onclick = () => {
        // 复制到剪贴板
        // copyTextToClipboard(window.glk_str)
        // 导出excel
        jsonToExcel(window.glk_arr)
        maskContainer.style.display = 'none'
      }
    } else {
      if (bool) {
        maskContainer.style.display = 'block'
        maskContainer.children[1].style.display = 'block'
        maskContainer.children[2].style.display = 'none'
      } else {
        maskContainer.children[1].style.display = 'none'
        maskContainer.children[2].style.display = 'block'
      }
    }

  }

  // 轮询请求数据
  async function pollRequest() {
    console.log(`抓取第${window.glk_totalPageCount - window.glk_curPageNum + 1}页数据`)
    const pendingText = document.getElementById('pending_text')
    pendingText.innerText = `正在抓取第${window.glk_totalPageCount - window.glk_curPageNum + 1}页/${window.glk_totalPageCount}数据😎 等着吧.......`
    const nextPageNode = await getNextPageNode()
    const tableNode = getTableNode()
    // window.glk_str += tabelToJson(tableNode)
    window.glk_arr = window.glk_arr.concat(tabelToJson(tableNode))
    nextPageNode.click()
    window.glk_curPageNum--
    if (window.glk_curPageNum === 0) {
      console.log('不需要继续了 return')
      window.isloading = false
      loading(false)
      console.log(`%c ************************你要的数据***************************

`, `color: hotpink; font-size: 20px; font-weight: bold;`, window.glk_arr);
      console.log(`%c ************************你要的数据***************************`, `color: hotpink; font-size: 20px; font-weight: bold;`);
    }
  }

  // 创建一个按钮
  function createBtnNode(text = '按钮') {
    let node = document.createElement('button')
    Object.assign(node.style, {
      backgroundColor: '#429fff',
      fontSize: '14px',
      padding: '5px 10px',
      textAlign: 'center',
      color: '#fff',
      border: 'none'
    })
    node.innerText = text
    return node
  }

  // 数据抓取
  function dataCapture() {
    console.log('iframe-->', document.getElementsByTagName('iframe'))
    if (!document.getElementsByTagName('iframe').length) {
      setTimeout(() => {
        dataCapture()
      }, 1000)
      return
    }
    const iframe = document.getElementsByTagName('iframe')[0]
    iframe.onload = () => {
      const iframeDocu = iframe.contentDocument
      const href = iframeDocu.location.href
      console.log('iframe重新加载 href:', href)
      if (href.includes('productServiceSupplierLib')) {
        const pagination = iframeDocu.getElementsByClassName('pagination')[0]
        const searchBtn = iframeDocu.getElementById('btnSubmit2')
        console.log('searchBtn', searchBtn)
        const captureBtn = createBtnNode('数据抓取')
        searchBtn.parentNode.appendChild(captureBtn)
        captureBtn.onclick = () => {
          window.glk_str = ''
          window.glk_arr = []
          window.glk_province = iframeDocu.querySelector("select[name='province']").value
          window.glk_business = iframeDocu.querySelector("input[name='business']").value
          window.isloading = true
          window.glk_totalPageCount = getTotalPageCount()
          window.glk_curPageNum = window.glk_totalPageCount
          loading()
          pollRequest()
        }
        if (window.isloading) {
          console.log('还在获取数据中')
          pollRequest()
        }
      }
    }
  }

  // 复制文本到剪贴板(带格式)
  function copyTextToClipboard(text = '') {
    const textArea = document.createElement('textarea')
    const _text = String(text)
    textArea.setAttribute('readonly', 'readonly');
    textArea.value = _text;
    document.body.appendChild(textArea);
    textArea.select();;
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      console.log('复制成功');
      showTip('复制成功✔', 1)
    } else {
      console.log(`复制失败`);
      showTip('复制失败😒', 1)
    }
    document.body.removeChild(textArea);
  }

  // 小提示
  const showTip = (message, duration = 0.8, pos) => {
    let show_tip = document.getElementById('show_tip')
    if (show_tip) {
      document.body.removeChild(show_tip)
    }
    let tipDom = document.createElement('div')
    tipDom.id = 'show_tip'
    Object.assign(tipDom.style, {
      position: 'fixed',
      maxWidth: '80vw',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      lineHeight: '20px',
      zIndex: 9999,
      color: '#fff',
      backgroundColor: '#303133',
      borderRadius: ' 4px',
      padding: '10px',
      textAlign: 'center',
      opacity: 0.9,
      fontSize: '0.75rem',
      animation: `tipanimation ${duration}s 1`
    })
    if (pos) {
      const { left, top, offsetX = 0, offsetY = 0 } = pos
      Object.assign(tipDom.style, {
        top: (top + offsetY) + 'px',
        left: (left + offsetX) + 'px',
        transform: 'none'
      })
    }
    tipDom.innerText = message
    document.body.appendChild(tipDom)

    setTimeout(() => {
      let show_tip = document.getElementById('show_tip')
      if (show_tip) {
        document.body.removeChild(show_tip)
      }
    }, duration * 1000 - 100)
  }

  // json转excel
  function jsonToExcel(json) {
    var filename = `${window.glk_province}-${window.glk_business}-${Date.now()}.xls`;
    var ws_name = "client";
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(json);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
  }

  window.onload = function () {
    setTimeout(() => {
      // 1. 通过模拟用户操作获取数据
      excelScript()
      dataCapture()
      console.warn('执行glk脚本')
    }, 2000)

  }

  // 2. 通过接口获取数据
  // // 拿到HTML数据
  // fetch('http://qiye.qianlima.com/yfbsite/a/productServiceSupplierLib/list', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //       pageNo: 1,
  //       pageSize: 40,
  //       province: '',
  //       business: '展馆'
  //   })
  // }).then(res => res.text()).then(res => {
  //   // 拿到 table 数据组成 dom 
  //   res.match(/<table>(\s|\S)*<\/table>/g)[0].replace(/\n/g, '')
  //  // 后续修改 cookie 更改分页数目
  // })

})();