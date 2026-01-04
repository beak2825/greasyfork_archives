// ==UserScript==
// @name         自动打印白单脚本
// @namespace    http://tampermonkey.net/
// @version      2025-03-04
// @description  可以用来进行自动化的开单
// @author       小何
// @match        https://s.100svip.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js  
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529448/%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%B0%E7%99%BD%E5%8D%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/529448/%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%B0%E7%99%BD%E5%8D%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
const doorNo = {
  '7公分美川': { no: ['7004'], 96: 95, handle: '双活' },
  美川7公分: { no: ['7004'], 96: 95, handle: '双活' },
  A01: { no: ['库存门'], handle: '单活' },
  A02: { no: ['库存门'], handle: '单活' },
  A03: { no: ['库存门'], handle: '单活' },
  A06: { no: ['库存门'], handle: '单活' },
  K8: { no: ['7014', '70140'], 96: 95, handle: '单活' },
  一心一意: { no: ['1657'], 96: 95, handle: '单活' },
  一鸣惊人: { no: ['1656'], 96: 95, handle: '单活' },
  万国: { no: ['库存门&5555'], handle: '单活' },
  三王爷: { no: ['1806'], 96: 95, handle: '单活' },
  乐喜: { no: ['库存门&1019'], handle: '单活' },
  乐天: { no: ['库存门'], handle: '单活' },
  乐家: { no: ['库存门'], handle: '单活' },
  乐达: { no: ['库存门'], handle: '单活' },
  乐高: { no: ['库存门'], handle: '单活' },
  云端: { no: ['库存门'], handle: '单活' },
  伯学: { no: ['库存门&8816002'], handle: '单活' },
  伯涛: { no: ['库存门&8816372'], handle: '单活' },
  伯熙: { no: ['库存门&8816024'], handle: '单活' },
  伯爵: { no: ['库存门&8816313'], handle: '单活' },
  伯瑞: { no: ['库存门&8816003'], handle: '单活' },
  伯美: { no: ['库存门&8815995'], handle: '单活' },
  伯财: { no: ['库存门&8815993'], handle: '单活' },
  伯辉: { no: ['库存门&8816480'], handle: '单活' },
  伯通: { no: ['库存门&8815992'], handle: '单活' },
  伯金: { no: ['库存门&8816006'], handle: '单活' },
  光辉岁月: { no: ['8004'], 96: 95, handle: '单活' },
  出水芙蓉: { no: ['70030', '7003'], 96: 95, handle: '单活' },
  劳力士: { no: ['库存门&5566'], handle: '单活' },
  卡地亚: { no: ['库存门&1118'], handle: '单活' },
  古斯特: { no: ['1662'], 96: 95, handle: '单活' },
  国王: { no: ['8010'], 96: 95, handle: '单活' },
  巴黎春天: { no: ['库存门&8815948'], handle: '单活' },
  布加迪: { no: ['1665'], 96: 95, handle: '单活' },
  希腊神话: { no: ['库存门&8816469'], handle: '单活' },
  库里南: { no: ['1658'], 96: 95, handle: '单活' },
  总裁一号: { no: ['8001'], 96: 95, handle: '单活' },
  总裁壹号: { no: ['8001'], 96: 95, handle: '单活' },
  总裁1号: { no: ['8001'], 96: 95, handle: '单活' },
  总裁二号: { no: ['7005'], 96: 95, handle: '单活' },
  总裁2号: { no: ['7005'], 96: 95, handle: '单活' },
  总裁八号: { no: ['8002'], 96: 95, handle: '单活' },
  总裁8号: { no: ['8002'], 96: 95, handle: '单活' },
  时尚二方: { no: ['5009'], 96: 95, handle: '单活' },
  晴朗: { no: ['库存门'], handle: '单活' },
  朗格: { no: ['库存门&8816519'], handle: '单活' },
  望舒: { no: ['库存门&8816549'], handle: '单活' },
  未来: { no: ['库存门&8815988'], handle: '单活' },
  欧米茄: { no: ['库存门&6688'], handle: '单活' },
  江诗丹顿: { no: ['库存门&1113'], handle: '单活' },
  浪琴: { no: ['库存门&1112'], handle: '单活' },
  浮光: { no: ['库存门'], handle: '单活' },
  添越: { no: ['8008'], 96: 95, handle: '单活' },
  爱彼: { no: ['库存门&6655'], handle: '单活' },
  王者: { no: ['8012'], 96: 95, handle: '单活' },
  理查德: { no: ['库存门&8816513'], handle: '单活' },
  百达翡丽: { no: ['8003'], 96: 95, handle: '单活' },
  皇家橡树: { no: ['库存门&1120'], handle: '单活' },
  碧海蓝天: { no: ['8005'], 96: 95, handle: '单活' },
  纽约风情: { no: ['库存门&8815996'], handle: '单活' },
  罗马: { no: ['库存门&8816000'], handle: '单活' },
  美君: { no: ['7013'], 96: 95, handle: '单活' },
  '9cm美川': { no: ['9021', '90210'], 96: 95, handle: '单活' },
  美川9cm: { no: ['9021', '90210'], 96: 95, handle: '单活' },
  美川: { no: ['9021', '90210'], 96: 95, handle: '单活' },
  美康: { no: ['2652'], 96: 95, handle: '双活' },
  美成: { no: ['1653', '16530'], 96: 95, handle: '单活' },
  美晶晶: { no: ['库存门&8815980'], handle: '单活' },
  美福来: { no: ['2656'], 96: 95, handle: '双活' },
  美简: { no: ['库存门&8816056'], handle: '单活' },
  美荣: { no: ['库存门&8816470'], handle: '单活' },
  美虹: { no: ['库存门&8816009'], handle: '单活' },
  美闪: { no: ['库存门&8816057'], handle: '单活' },
  三太子: { no: ['6002', '6001'], 96: 95, handle: '双活' },
  '7公分美颜': { no: ['216600'], 96: 95, handle: '双活' },
  '7cm美颜': { no: ['216600'], 96: 95, handle: '双活' },
  美颜7公分: { no: ['216600'], 96: 95, handle: '双活' },
  美颜9公分: { no: ['21660'], 96: 95, handle: '单活' },
  '9公分美颜': { no: ['21660'], 96: 95, handle: '单活' },
  美颜10公分: { no: ['21660'], 96: 95, handle: '单活' },
  美颜真甲级: { no: ['21660'], 96: 95, handle: '单活' },
  美颜: { no: ['21660'], 96: 95, handle: '单活' },
  美高美: { no: ['1709'], 96: 95, handle: '单活' },
  翡翠: { no: ['库存门&8815960'], handle: '单活' },
  肖邦: { no: ['库存门&6666'], handle: '单活' },
  荣耀: { no: ['8011'], 96: 95, handle: '单活' },
  酷路泽: { no: ['库存门&5565'], handle: '单活' },
  顶上情怀: { no: ['7017'], 96: 95, handle: '单活' },
  飞驰: { no: ['8007'], 96: 95, handle: '单活' },
  飞黄腾达: { no: ['1663'], 96: 95, handle: '单活' },
  仙本那: { no: ['库存门&0003'], handle: '单活' },
  兰卡威: { no: ['库存门&1011'], handle: '单活' },
  加勒比: { no: ['库存门&1009'], handle: '单活' },
  古北一号: { no: ['1017'], 96: 95, handle: '单活' },
  古北壹号: { no: ['1017'], 96: 95, handle: '单活' },
  圣托里尼: { no: ['1003'], 96: 95, handle: '单活' },
  塞班: { no: ['库存门&1010'], handle: '单活' },
  夏威夷: { no: ['库存门&8815928'], handle: '单活' },
  威尼斯: { no: ['库存门&1016'], handle: '单活' },
  巴厘岛: { no: ['1018'], 96: 95, handle: '单活' },
  巴拉望: { no: ['1015'], 96: 95, handle: '单活' },
  斐济: { no: ['库存门&1012'], handle: '单活' },
  斯里兰卡: { no: ['1005'], 96: 95, handle: '单活' },
  海棠湾: { no: ['1001'], 96: 95, handle: '单活' },
  时尚巴黎: { no: ['库存门&1013'], handle: '单活' },
  普吉岛: { no: ['库存门&1008'], handle: '单活' },
  杭州湾: { no: ['1014'], 96: 95, handle: '单活' },
  潮流望族: { no: ['1002'], 96: 95, handle: '单活' },
  苏梅岛: { no: ['库存门&1006'], handle: '单活' },
  马尔代夫: { no: ['1004'], 96: 95, handle: '单活' },
  一见倾心: { no: ['库存门'], handle: '单活' },
  一路印象: { no: ['库存门&8816589'], handle: '单活' },
  一路暴富: { no: ['库存门&8816482'], handle: '单活' },
  一路相伴: { no: ['8006'], 96: 95, handle: '单活' },
  一鹿相伴: { no: ['8006'], 96: 95, handle: '单活' },
  万事如意: { no: ['库存门&8816366'], handle: '单活' },
  塞亚: { no: ['8009'], 96: 95, handle: '单活' },
  海之蓝: { no: ['库存门&8815875'], handle: '单活' },
  清风一号: { no: ['1708', '17080'], 96: 95, handle: '单活' },
  漫步云端: { no: ['库存门&8815942'], handle: '单活' },
  美丽祥乐: { no: ['库存门&8816838'], handle: '单活' },
  美丽祥和: { no: ['库存门'], handle: '单活' },
  美丽祥韵: { no: ['库存门&8816478'], handle: '单活' },
  美圆: { no: ['库存门&8815935'], handle: '单活' },
  美琴: { no: ['库存门&8816551'], handle: '单活' },
  美铜: { no: ['库存门&8816497'], handle: '单活' },
  自由女神: { no: ['库存门'], handle: '单活' },
  足甲长窗: { no: ['6011'], 96: 95, handle: '单活' },
  '9cm甲级长窗门中门': { no: ['6011'], 96: 95, handle: '单活' },
  甲级长窗门中门: { no: ['6011'], 96: 95, handle: '单活' },
  丁级短窗门中门: { no: ['6008'], 96: 95, handle: '单活' },
  '9cm丁级短窗门中门': { no: ['6008'], 96: 95, handle: '单活' },
  甲级短窗门中门: { no: ['6009'], 96: 95, handle: '单活' },
  '9cm甲级短窗门中门': { no: ['6009'], 96: 95, handle: '单活' },
  麦迪逊: { no: ['库存门&600301'], handle: '单活' },
  水曲柳: { no: ['9026'], 96: 95, handle: '单活' },
  '7cm二方白门': { no: ['9026'], 96: 95, handle: '单活' },
  白门二方: { no: ['7002', '7086'], 96: 95, handle: '双活' },
  细水长流: { no: ['1807'], 96: 95, handle: '双活' },
  二分明月: { no: ['2006'], 96: 95, handle: '双活' },
  开正: { no: ['库存门&8816556'], handle: '双活' },
  鹏程万里: { no: ['2654'], 96: 95, handle: '双活' },
  美辉: { no: ['1670'], 96: 95, handle: '双活' },
  美佳: { no: ['7001'], 96: 95, handle: '双活' },
  美风: { no: ['7065', '70650'], 96: 95, handle: '双活' },
  美洲: { no: ['7077'], 96: 95, handle: '双活' },
  美州: { no: ['7077'], 96: 95, handle: '双活' },
  兰灰: { no: ['7085'], 96: 95, handle: '双活' },
  美广: { no: ['库存门&8815958'], 96: 95, handle: '双活' },
  美轩: { no: ['库存门'], handle: '双活' },
  美尼亚: { no: ['库存门'], 96: 95, handle: '双活' },
  黑色八方块: { no: ['9002'], handle: '双活' },
  黑色八方格: { no: ['9002'], handle: '双活' },
  黑色八方卫浴门: { no: ['9002'], handle: '双活' },
  白色八方块: { no: ['9003'], handle: '双活' },
  白色八方格: { no: ['9003'], handle: '双活' },
  白色八方卫浴门: { no: ['9003'], handle: '双活' },
  三阳吉庆: { no: ['6007', '60070', '600700'], 96: 95, handle: '双活' },
  '201万年福': { no: ['2013'], 96: 95, handle: '双活' },
  '301万年福': { no: ['3013'], 96: 95, handle: '双活' },
  '304万年福': { no: ['3043'], 96: 95, handle: '双活' },
  '201六方块': { no: ['2014'], 96: 95, handle: '双活' },
  '301六方块': { no: ['3014'], 96: 95, handle: '双活' },
  '304六方块': { no: ['3044'], 96: 95, handle: '双活' },
  '201宫灯': { no: ['2012'], 96: 95, handle: '双活' },
  '301宫灯': { no: ['3012'], 96: 95, handle: '双活' },
  '304宫灯': { no: ['3042'], 96: 95, handle: '双活' },
}
const 开向 = {
  内包内右: {
    realName: '内包内右',
  },
  内包内左: {
    realName: '内包内左',
  },
  外包外左: {
    realName: '外包外左',
  },
  外左外包: {
    realName: '外包外左',
  },
  外包外右: {
    realName: '外包外右',
  },
  外右外包: {
    realName: '外包外右',
  },
  外包左内开: {
    realName: '外包内左',
  },
  外包右内开: {
    realName: '外包内右',
  },
  外左: {
    realName: '外包外左',
  },
  外右: {
    realName: '外包外右',
  },
  内左: {
    realName: '外包内左',
  },
  内右: {
    realName: '外包内右',
  },
}

const 拉手 = [
  '右方卡单活',
  '左方卡单货',
  '方卡单活',
  '右双活',
  '左双活',
  '双活',
  '右通用拉手',
  '左通用拉手',
  '通用拉手',
  '内置可视指纹锁',
  '大屏指纹锁',
]

const regex = /(\d+)\s*[*×＊]\s*(\d+)/

const regex1 = /(?<==)\s*(\d+)/

const regex2 = /([\u4e00-\u9fa5]{2,5})(1[3-9]\d{9})/g

const regex3 = /运费(\d+)/

;(function () {
  'use strict'

  // 创建多行文本框
  const textarea = document.createElement('textarea')
  textarea.placeholder = '请输入内容'
  textarea.style.position = 'fixed'
  textarea.style.bottom = '20px'
  textarea.style.right = '20px'
  textarea.style.width = '320px'
  textarea.style.height = '200px'
  textarea.style.zIndex = '9999'
  textarea.value =
    '施云飞18868245610	美成 梅枝	205*860=1外左 湖州吴兴	方卡单活   美康 205*960=1外右 双活'

  // 创建按钮
  const button = document.createElement('button')
  button.textContent = '点击开单'
  button.style.position = 'fixed'
  button.style.bottom = '230px' // 根据文本框高度调整按钮位置
  button.style.right = '20px'
  button.style.zIndex = '9999'

  // 创建外面的radio按钮
  const outsideRadio = document.createElement('input')
  outsideRadio.type = 'radio'
  outsideRadio.name = 'option'
  outsideRadio.id = 'outside'
  outsideRadio.style.position = 'fixed'
  outsideRadio.style.bottom = '230px' // 与点击开单按钮同一排
  outsideRadio.style.right = '220px' // 在文本框左上角
  outsideRadio.style.zIndex = '9999'
  outsideRadio.checked = true // 默认勾选

  // 创建外面的radio按钮的标签
  const outsideLabel = document.createElement('label')
  outsideLabel.htmlFor = 'outside'
  outsideLabel.textContent = '外面'
  outsideLabel.style.position = 'fixed'
  outsideLabel.style.bottom = '230px' // 与点击开单按钮同一排
  outsideLabel.style.right = '240px' // 在文本框左上角
  outsideLabel.style.zIndex = '9999'

  // 创建贴牌的radio按钮
  const oemRadio = document.createElement('input')
  oemRadio.type = 'radio'
  oemRadio.name = 'option'
  oemRadio.id = 'oem'
  oemRadio.style.position = 'fixed'
  oemRadio.style.bottom = '230px' // 与点击开单按钮同一排
  oemRadio.style.right = '300px' // 在文本框左上角
  oemRadio.style.zIndex = '9999'

  // 创建贴牌的radio按钮的标签
  const oemLabel = document.createElement('label')
  oemLabel.htmlFor = 'oem'
  oemLabel.textContent = '贴牌'
  oemLabel.style.position = 'fixed'
  oemLabel.style.bottom = '230px' // 与点击开单按钮同一排
  oemLabel.style.right = '320px' // 在文本框左上角
  oemLabel.style.zIndex = '9999'

  // 创建最小化按钮
  const minimizeButton = document.createElement('button')
  minimizeButton.textContent = '最小化'

  minimizeButton.style.position = 'fixed'
  minimizeButton.style.bottom = '230px' // 根据文本框高度调整按钮位置
  minimizeButton.style.right = '100px'
  minimizeButton.style.zIndex = '9999'

  let isMinimized = false

  // 最小化按钮点击事件处理函数
  minimizeButton.addEventListener('click', function () {
    if (isMinimized) {
      // 展开界面
      textarea.style.display = 'block'
      minimizeButton.textContent = '最小化'
      isMinimized = false
    } else {
      // 最小化界面
      textarea.style.display = 'none'
      minimizeButton.textContent = '展开'
      isMinimized = true
    }
  })

  // 将文本框、按钮、radio按钮和标签添加到页面的 body 元素中
  document.body.appendChild(textarea)
  document.body.appendChild(minimizeButton)
  document.body.appendChild(button)
  document.body.appendChild(outsideRadio)
  document.body.appendChild(outsideLabel)
  document.body.appendChild(oemRadio)
  document.body.appendChild(oemLabel)

  // 为按钮添加点击事件处理程序
  button.addEventListener('click', async function () {
    var inputValue = textarea.value

    var name = ''

    var yunfei = 0

    const match3 = inputValue.match(regex3)

    if (match3) {
      yunfei = match3[1]
    }

    // 执行匹配
    const names = []
    const matches = inputValue.matchAll(regex2)
    for (const match of matches) {
      // 将匹配到的姓名添加到 names 数组中
      names.push(match[1])
    }

    if (names.length > 1) {
      name = names[1] + '/' + names[0]
    } else {
      name = names[0]
    }

    // 判断当前路径是否为 https://s.100svip.com/v3/#/index/salesShipment/，如果不是则跳转
    const targetPath = 'https://s.100svip.com/v3/#/index/salesShipment//'
    if (window.location.href !== targetPath) {
      window.location.href = targetPath
    }

    async function addGoodsAndFillInput() {
      // 清除已添加的货品
      // 查找所有 ng-click 属性值为 "delProduct($index)" 的按钮
      const delButtons = document.querySelectorAll(
        'button[ng-click="delProduct($index)"]'
      )

      // 遍历找到的按钮并点击
      delButtons.forEach((button) => {
        const buttons = document.querySelectorAll(
          'button[ng-click="delProduct($index)"]'
        )
        buttons[0].click()
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
      var inputValue = textarea.value
      var temp = inputValue
      // 先确定门的总数量
      var doors = []
      for (const key in doorNo) {
        if (temp.includes(key)) {
          temp = temp.replace(key, '')
          doors.push(key)
        }
      }

      var handles = []
      for (const key of 拉手) {
        if (inputValue.includes(key)) {
          handles.push(key)
        }
      }

      const elementIndicesHandle = {}

      // 遍历数组，找出每个元素在文本中首次出现的索引
      handles.forEach((element) => {
        const index = inputValue.indexOf(element)

        if (index !== -1) {
          elementIndicesHandle[element] = index
        }
      })

      // 根据元素在文本中出现的索引进行倒序排序
      handles = handles.sort(
        (a, b) => elementIndicesHandle[b] - elementIndicesHandle[a]
      )

      const elementIndices = {}

      // 遍历数组，找出每个元素在文本中首次出现的索引
      doors.forEach((element) => {
        const index = inputValue.indexOf(element)
        if (index !== -1) {
          elementIndices[element] = index
        }
      })

      // 根据元素在文本中出现的索引进行倒序排序
      doors = doors.sort((a, b) => elementIndices[b] - elementIndices[a])

      let leftInput = inputValue

      var i = 0
      for (const oneDoor of doors) {
        var doorHeight = 0
        var doorWidth = 0
        var doorDirection = ''
        let doorNos = []
        var doorName = oneDoor
        var doorquantity = 0
        var doorhandle = ''

        if (handles.length == doors.length) {
          doorhandle = handles[i]
        }
        if (handles.length == 0) {
          doorhandle = doorNo[doorName]['handle']
        } else if (handles.length < doors.length) {
          doorhandle = handles[handles.length - 1]
        }

        i++

        doorNos = doorNo[doorName]['no']

        var splits = leftInput.split(doorName)

        leftInput = splits[0]
        var rightInput = splits[1]

        const matchResult = rightInput.match(regex)

        const totalNum = rightInput.match(regex1)

        if (matchResult) {
          const processHeight = (num) => {
            rightInput = rightInput.replace(num, '')
            if (num.length >= 4 && num.endsWith('0')) {
              return num.slice(0, -1)
            }
            return num
          }

          const processWidth = (num) => {
            rightInput = rightInput.replace(num, '')
            if (num.length == 4) {
              return num.slice(0, -1)
            }
            if (num.length == 3 && num > 320) {
              return num.slice(0, -1)
            }
            return num
          }

          doorHeight = processHeight(matchResult[1])
          doorWidth = processWidth(matchResult[2])
        } else {
          console.log('未找到尺寸')
          return
        }

        if (totalNum) {
          doorquantity = totalNum[0]
        } else {
          doorquantity = 1
        }

        outerLoop: for (const key in 开向) {
          if (rightInput.includes(key)) {
            doorDirection = 开向[key]['realName']
            rightInput = rightInput.replace(key, '')
            break outerLoop
          }
        }

        rightInput = rightInput.replace('*=' + doorquantity, '')
        rightInput = rightInput.replace('×=' + doorquantity, '')
        rightInput = rightInput.replace('＊=' + doorquantity, '')
        // console.log(leftInput + rightInput)

        // 获取所有按钮元素
        const buttons = document.querySelectorAll('button')
        let addGoodsButton = null

        // 遍历按钮，找到包含“+添加货品”文本的按钮
        for (const btn of buttons) {
          if (btn.textContent.includes('+添加货品')) {
            addGoodsButton = btn
            break
          }
        }

        // 如果找到按钮，则点击它
        if (addGoodsButton) {
          addGoodsButton.click()
        } else {
          console.log('未找到文字为“+添加货品”的按钮')
          return
        }

        // 获取货品输入框
        const huopinInput = document.querySelector(
          'input[placeholder="货品名/关键字/拼音首字母/条码"]'
        )

        if (huopinInput) {
          let found = false
          outloop0: for (const no of doorNos) {
            if (doorNo[doorName][doorWidth]) {
              doorWidth = doorNo[doorName][doorWidth]
            }
            if (no === '库存门') {
              huopinInput.value = '0001'
            } else if (no.includes('库存门')) {
              var result = no.split('&')
              huopinInput.value = result[1]
            } else {
              // 直接设置输入框的值
              huopinInput.value = no + doorHeight + doorWidth
            }

            // 等待 500 毫秒
            await new Promise((resolve) => setTimeout(resolve, 800))
            // 触发 input 事件模拟真实输入
            const inputEvent = new Event('input', { bubbles: false })
            huopinInput.dispatchEvent(inputEvent)

            await new Promise((resolve) => setTimeout(resolve, 500))
            // 遍历 tbody 下面的 tr，寻找有没有和开向一样的行
            const divElement = document.querySelector(
              'div.bombbox.add.productModel'
            )
            const tbodyElements = divElement.querySelectorAll('tbody')

            outerLoop: for (const tbody of tbodyElements) {
              const trElements = tbody.querySelectorAll('tr')
              for (const tr of trElements) {
                const tdElements = tr.querySelectorAll('td')
                outerLoop1: for (const td of tdElements) {
                  const textContent = td.textContent.trim()
                  // console.log(textContent)
                  if (
                    doorDirection.length == 0 &&
                    textContent === doorHeight + '0*' + doorWidth + '0'
                  ) {
                    console.log('未提供开向，仅匹配尺寸相同的记录')
                    break outloop0
                  }
                  if (textContent === '0') {
                    console.log('无库存跳过')
                    break outerLoop1
                  }
                  if (
                    (no === '库存门' && textContent === '库存门') ||
                    (no.includes('库存门') && no.length > 3)
                  ) {
                    td.click()
                    found = true
                    // 再点击确定按钮
                    const confirmButton = document.querySelector(
                      'button.btn.btn-w-m.btn-primary'
                    )

                    confirmButton.click()
                    const numInput = document.querySelectorAll(
                      '[ng-model="item.Count"]'
                    )

                    numInput[numInput.length - 1].value = doorquantity

                    // 触发 input 事件模拟真实输入
                    const inputEvent = new Event('input', { bubbles: false })
                    numInput[numInput.length - 1].dispatchEvent(inputEvent)

                    const descInput = document.querySelectorAll(
                      '[ng-model="item.Desc"]'
                    )

                    descInput[descInput.length - 1].value = doorhandle

                    const specInput =
                      document.querySelectorAll('[data="item.Spec"]')
                    console.log(specInput)
                    specInput[specInput.length - 1].value =
                      doorName +
                      ' ' +
                      doorHeight +
                      '×' +
                      doorWidth +
                      '=' +
                      doorDirection

                    // 触发 input 事件模拟真实输入
                    const specEvent = new Event('input', { bubbles: false })
                    specInput[specInput.length - 1].dispatchEvent(specEvent)
                  } else if (
                    textContent === doorDirection &&
                    doorDirection.length > 0
                  ) {
                    console.log('找到内容为 的单元格:', td)
                    // 点击该单元格所在的 tr 行
                    td.click()
                    found = true
                    // 再点击确定按钮
                    const confirmButton = document.querySelector(
                      'button.btn.btn-w-m.btn-primary'
                    )

                    if (confirmButton) {
                      // 点击“确定”按钮
                      confirmButton.click()

                      const numInput = document.querySelectorAll(
                        '[ng-model="item.Count"]'
                      )

                      numInput[numInput.length - 1].value = doorquantity

                      // 触发 input 事件模拟真实输入
                      const inputEvent = new Event('input', { bubbles: false })
                      numInput[numInput.length - 1].dispatchEvent(inputEvent)

                      const descInput = document.querySelectorAll(
                        '[ng-model="item.Desc"]'
                      )

                      descInput[descInput.length - 1].value = doorhandle
                    } else {
                      console.log('未找到“确定”按钮')
                    }
                    break outerLoop
                  }
                }
              }
            }
          }

          if (found == false && doorDirection.length > 0) {
            alert('无库存')
          }
        }
      }

      if (yunfei > 0) {
        // 获取所有按钮元素
        const buttons = document.querySelectorAll('button')
        let addGoodsButton = null

        // 遍历按钮，找到包含“+添加货品”文本的按钮
        for (const btn of buttons) {
          if (btn.textContent.includes('+添加货品')) {
            addGoodsButton = btn
            break
          }
        }

        // 如果找到按钮，则点击它
        if (addGoodsButton) {
          addGoodsButton.click()
        } else {
          console.log('未找到文字为“+添加货品”的按钮')
          return
        }

        // 获取货品输入框
        const huopinInput = document.querySelector(
          'input[placeholder="货品名/关键字/拼音首字母/条码"]'
        )

        if (huopinInput) {
          huopinInput.value = '8815870'

          // 等待 500 毫秒
          await new Promise((resolve) => setTimeout(resolve, 800))
          // 触发 input 事件模拟真实输入
          const inputEvent = new Event('input', { bubbles: false })
          huopinInput.dispatchEvent(inputEvent)

          await new Promise((resolve) => setTimeout(resolve, 500))
          // 遍历 tbody 下面的 tr，寻找有没有和开向一样的行
          const divElement = document.querySelector(
            'div.bombbox.add.productModel'
          )
          const tbodyElements = divElement.querySelectorAll('tbody')

          outerLoop: for (const tbody of tbodyElements) {
            const trElements = tbody.querySelectorAll('tr')
            for (const tr of trElements) {
              tr.click()
              break outerLoop
            }
          }

          const confirmButton = document.querySelector(
            'button.btn.btn-w-m.btn-primary'
          )

          if (confirmButton) {
            // 点击“确定”按钮
            confirmButton.click()
            await new Promise((resolve) => setTimeout(resolve, 300))
            const priceInput = document.querySelectorAll('[data="item.Price"]')

            priceInput[priceInput.length - 1].value = yunfei

            // 触发 input 事件模拟真实输入
            const inputEvent = new Event('input', { bubbles: false })
            priceInput[priceInput.length - 1].dispatchEvent(inputEvent)
          }
        }
      }
    }

    const retailCustomerElement = document.querySelector('[title="零售客户"]')
    if (retailCustomerElement && name != undefined) {
      retailCustomerElement.click()

      // 等待一段时间，确保弹窗已经打开（这里假设 200 毫秒足够）
      await new Promise((resolve) => setTimeout(resolve, 200))

      // 找到 placeholder 为 "请输入客户名称/电话号码" 的输入框
      const popupInput = document.querySelector(
        'input[placeholder="请输入客户名称/电话号码"]'
      )
      if (popupInput) {
        try {
          // 复制内容到剪贴板
          // await navigator.clipboard.writeText(name)

          // 直接设置输入框的值
          popupInput.value = name
          await new Promise((resolve) => setTimeout(resolve, 500))
          // 触发 input 事件模拟真实输入
          const inputEvent = new Event('input', { bubbles: false })
          popupInput.dispatchEvent(inputEvent)

          await new Promise((resolve) => setTimeout(resolve, 1000))
          // 遍历 tbody 下面的 tr，寻找有没有和施云飞一样的行
          const tbodyElements = document.querySelectorAll('tbody')
          let found = false
          outerLoop: for (const tbody of tbodyElements) {
            const trElements = tbody.querySelectorAll('tr')
            for (const tr of trElements) {
              const tdElements = tr.querySelectorAll('td')
              for (const td of tdElements) {
                const textContent = td.textContent.trim()
                if (textContent === name) {
                  // 点击该单元格所在的 tr 行
                  tr.click()
                  found = true
                  break outerLoop
                }
              }
            }
          }
          if (found) {
            addGoodsAndFillInput()
          } else {
            // 未能找到客户名字，开始添加客户
            // 新客户名字
            let newName = name

            const addButton = document.querySelector(
              '[ng-click="event.onAddCustomerHandler()"]'
            )
            addButton.click()
            await new Promise((resolve) => setTimeout(resolve, 500))
            const nameInput = document.querySelector(
              'input[ng-model="customer.Name"]'
            )
            nameInput.value = newName

            // 触发 input 事件模拟真实输入
            const inputEvent = new Event('input', { bubbles: false })
            nameInput.dispatchEvent(inputEvent)

            await new Promise((resolve) => setTimeout(resolve, 400))

            const submitButton = document.querySelector(
              '[ng-click="event.onSubmitAddCustomerHandler()"]'
            )
            submitButton.click()
            await new Promise((resolve) => setTimeout(resolve, 1400))

            const divElement = document.querySelector('div.bombbox')
            const tbodyElements = divElement.querySelectorAll('tbody')
            console.log(tbodyElements)
            for (const tbody of tbodyElements) {
              const trElements = tbody.querySelectorAll('tr')
              console.log(trElements)
              for (const tr of trElements) {
                tr.click()
                break
              }
            }

            await new Promise((resolve) => setTimeout(resolve, 400))
            addGoodsAndFillInput()
          }
        } catch (err) {
          console.error('异常: ', err)
        }
      } else {
        console.log('未找到客户名称/电话号码输入框')
      }
    } else {
      console.log('未找到"零售客户" 的元素')
      addGoodsAndFillInput()
    }
  })
  // Your code here...
})()
