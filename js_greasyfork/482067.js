// ==UserScript==
// @name         Buyin Explain Product106
// @namespace    BM Buyin
// @license      ISC
// @version      1.0.6
// @description  自动循环讲解百应商品
// @author       Liam
// @icon         https://lf1-fe.ecombdstatic.com/obj/eden-cn/upelogps/bitbug_favicon.ico
// @match        https://buyin.jinritemai.com/dashboard/live/control*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/482067/Buyin%20Explain%20Product106.user.js
// @updateURL https://update.greasyfork.org/scripts/482067/Buyin%20Explain%20Product106.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 引入bootstrap
  $("head").append($(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">`));

  // 数据
  const data = {
  index: 1,
  // 商品卡的高度
  productHeight: 132,
  // 讲解按钮
  btn: null,
  // 定时器id
  timeout: null,
  // 讲解时间(毫秒)
  explainDelay: 10000,
  // 取消讲解时间(毫秒),
  cancelExplainDelay: 2000,
  // 定时器间隔
  delay: 0
}
// 函数
const methods = {
  // 根据序号计算商品的scrollTop
  calcScrollTopByIndex(index) {
    // scrollTop = 商品卡高度 * (序号 - 1)，因为只需定位到目标商品的顶部即可
    return data.productHeight * (index - 1)
  },
  // 滚动到目标商品卡
  scrollIntoView(desiredScrollTop) {
    // 获取商品列表父盒子
    const container = document.querySelector('#live-control-goods-list-container')
    // 获取商品列表
    const list = container.firstChild
    // 滚动
    list.scrollTop = desiredScrollTop
  },
  // 获取目标商品卡
  getTargetProductByIndex(index) {
    // 当前渲染的商品列表
    const list = Array.from(document.querySelectorAll('.index__goodsItem___38cLa'))
    // 匹配目标商品卡
    return list.find((item) => {
      // 序号值的链路
      // 商品卡 => children[1]-indexWrapper => children[0]-span => children[0]-input
      const indexValue = item.children[1].children[0].children[0].value
      return Number(indexValue) === index
    })
  },
  // 开启讲解脚本
  start(product) {
    if (data.timeout) {
      console.log(
        `%c 🐵 %c 脚本重复！已取消原脚本 %c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent'
      )
      clearTimeout(data.timeout)
      data.timeout = null
    }
    console.log(
      `%c 🐵 %c 开启讲解脚本！ %c`,
      'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
      'background:transparent'
    )

    try {
      // 获取讲解按钮: 底部区域 => 右侧按钮区域 => 讲解按钮wrapper => button
      data.btn = product.children[3].children[1].lastChild.children[0]
      // 重置间隔秒数
      data.delay = 0
      methods.loop()
    } catch(e) {
      console.error(e)
      methods.refresh()
    }
  },
  // 终止讲解脚本
  stop() {
    console.log(
      `%c 🐵 %c 终止讲解脚本！ %c`,
      'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
      'background:transparent'
    )
    clearTimeout(data.timeout)
    data.timeout = null
    // 如果当前正在讲解，需要手动取消掉
    console.log(data.btn.classList)
    if (Array.from(data.btn.classList).includes('active')) {
      console.log('点一下取消')
      data.btn.click()
    }
  },
  loop() {
    if (!document.body.contains(data.btn)) {
      return methods.refresh()
    }
    data.delay = data.delay === data.explainDelay ? data.cancelExplainDelay : data.explainDelay
    data.btn.click()
    console.log(data.delay === data.explainDelay ? '讲解中' : '已取消讲解')
    // 调用自身
    data.timeout = setTimeout(methods.loop, data.delay)
  },
  refresh() {
    data.delay = 0
    data.timeout = null
    clearTimeout(data.timeout)
    explainProduct(data.index)
  },
  sleep(delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay)
    })
  },
  setStyle(dom, options) {
    for (let key in options){
      dom.style[key] = options[key];
    }
  }
}

/**
* @description 讲解商品函数
* @param {number} index 需要讲解的商品序号
* @return void
*/
async function explainProduct(index) {
  // 缓存序号
  data.index = Number(index) || data.index

  // 1.获取目标商品卡的scrollTop
  const scrollTop = methods.calcScrollTopByIndex(data.index)
  // 2.滚动到目标商品卡位置
  methods.scrollIntoView(scrollTop)

  await methods.sleep(1000)

  // 3.获取目标商品卡
  const target = methods.getTargetProductByIndex(data.index)
  // 4.开始讲解脚本
  methods.start(target)
}

// 创建表单
function createFrom() {
  // 输入框
  const input = document.createElement('input')
  input.type = 'number'
  input.style.width = '200px'
  input.className = 'form-control'
  input.placeholder = '请输入商品序号'

  // 讲解按钮
  const button = document.createElement('button')
  button.style.margin = '0px 4px'
  button.className = 'btn btn-primary'
  button.innerText = '讲解'
  button.onclick = () => {
    if (!input.value || isNaN(Number(input.value))) {
      alert('请输入商品序号')
    }
    explainProduct(input.value)
  }

  // 取消讲解按钮
  const stopButton = document.createElement('button')
  stopButton.className = 'btn btn-secondary'
  stopButton.innerText = '终止'
  stopButton.onclick = methods.stop

  // 插入DOM
  const div = document.createElement('div')
  div.style.display = 'flex'
  div.style.marginTop = '10px'
  div.style.position = 'absolute'
  div.style.right = '0'
  div.appendChild(input)
  div.appendChild(button)
  div.appendChild(stopButton)

  // const navHeader = document.querySelector('.index__navHeader___3Q-vW')
  const navHeader = document.querySelector('.newHeaderNav')
  console.log(navHeader)
  navHeader.appendChild(div)
}

// 创建贴边球
function createBall() {
  methods.setStyle(document.body, {
    margin: '0',
    overflow: 'hidden'
  })
  const ball = document.createElement('div')
  methods.setStyle(ball, {
    width: '90px',
    height: '35px',
    background: 'linear-gradient(140.91deg, #87a3ff 12.61%, #4c84ec 76.89%)',
    'border-top-left-radius': '36px',
    'border-bottom-left-radius': '36px',
    position: 'fixed',
    right: '-51px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    transition: 'right 0.3s ease'
  })

  let isHovered = false;
  ball.addEventListener('mouseenter', () => {
    isHovered = true;
    expandBall();
  });

  ball.addEventListener('mouseleave', () => {
    isHovered = false;
    collapseBall();
  });

  function expandBall() {
    ball.style.transition = 'right 0.3s ease';
    ball.style.right = '0px';
  }

  function collapseBall() {
    ball.style.transition = 'right 0.3s ease';
    ball.style.right = '-48px';
  }

  const span = document.createElement('span')
  span.innerText = '商品讲解'
  methods.setStyle(span, {
    display: 'block',
    padding: '7px 7px 7px 10px',
    color: '#fff',
    'font-size': '14px',
    overflow: 'hidden',
    'user-select': 'none'
  })

  ball.appendChild(span)
  document.body.appendChild(ball)
}

// 创建表单
window.onload = function(){
  setTimeout(createFrom, 6000)
};
// window.onload = createBall
// 销毁
window.onbeforeunload = methods.stop
})();