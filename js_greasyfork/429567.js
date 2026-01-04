// ==UserScript==
// @name         来游吧增强脚本
// @namespace    https://www.laiu8.cn/
// @version      230621
// @description 来游吧布局改善
// @author       Theworld_小老鼠
// @match        https://www.laiu8.cn/*
// @grant       GM_setClipboard
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/429567/%E6%9D%A5%E6%B8%B8%E5%90%A7%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429567/%E6%9D%A5%E6%B8%B8%E5%90%A7%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function(){
  'use strict';
  // 预设价格限制
  const maxPrice = 150
  // 预设用户信息
  // 修改此处信息即可自行对应填写
  const users = [
    {
      // 要检查的字段名称和对应的值，如果匹配就使用 data 中的数据进行填写
      check: {
        name: 'user_mobile',
        value: '13877994149'
      },
      // "user_name"  : 游客姓名
      // "user_mobile": 预定人手机
      // "book_mobile": 游客手机
      data: {
        "user_name"  : '泛北旅游',
        "book_mobile": '18877904537',
      }
    },
    {
      // 如果没有 check 字段，或者它的值为 false，则作为默认值
      // 默认值对象应该放在这个数组的最后一项
      check: false,
      // "user_name"  : 游客姓名
      // "user_mobile": 预定人手机
      // "book_mobile": 游客手机
      data: {
        "user_name"  : '泛北旅游',
        "book_mobile": '13877994149',
      }
    },
  ]
  window.addEventListener('load', function(){
    // 当前日期，随便整理了一下格式
    const nowDateString = (new Date()).toLocaleDateString().split('/').map(n=>+n<10?'0'+n:n).join('-')
    // 把日期放入导航的最后一项
    $('body > .index-nav > .nav-panel').append(`<div class="item date"><a>`+ nowDateString +`</a></div>`)

    const url = window.location.href
    // 验证网址，如果处于订单页面进行进一步操作
    if(/ship\/order\?/.test(url)){
      // 如果有订单标题这个元素，那么把它的文字内容换做今天的日期
      const calcBoxTitle = $('#calc-box > .title')
      if(calcBoxTitle){
        calcBoxTitle.text('今天日期：' + nowDateString)
      }
      // 先把去程信息放入数组
      const msgArr = [app._data.ship]
      // 如果有返程信息就也把它放入数组
      if(Object.keys(app._data.returnShip).length){
        msgArr.push(app._data.returnShip)
      }
      // 添加一个局部样式，应用于下面所添加的信息项
      $('#calc-box').append(`
        <style>
          #calc-box .msg-item {
            padding: 5px 15px 5px 15px;
            font-size: 14px;
          }
          #calc-box > .type-list.strong > .item > .h1.w1:first-child {
            font-size: 16px;
            color: #CC0000;
            font-weight: 600;
          }
        </style>
      `)
      // 对于右侧每一个航线名称进行操作
      // 航线名称相当于一个定位
      // 航线名称的数量应该是和上面数组的长度对应的，这样就可以把数据直接对应进去。
      $('#calc-box .name').each(function(i){
        const msg = msgArr[i]
        const intervalDate = String((new Date(msg.plannedDepartureDate) - new Date(nowDateString))/(24*60*60*1000))
        let intervalDateString = ''
        switch (intervalDate) {
          case '0':
            intervalDateString = ' (今天)'
            break;
          case '1':
            intervalDateString = ' (明天)'
            break;
          case '2':
            intervalDateString = ' (后天)'
            break;
          default:
            //intervalDateString = ' ('+intervalDate+'天后)'
            intervalDateString = ''
            break;
        }
        
        let typeNameString = ''
        if(msg.typeName !='常规'){
          typeNameString = '<strong>【' + msg.typeName + '】</strong>'
        }
        
        $(this).css('display', 'none').after(
            `<div class="msg-item"><strong>`+msg.lineName+`</strong> (`+msg.shipName+`)`+typeNameString+`</div>`
          // + `<div class="msg-item">航线船名：<strong>`+msg.shipName+`</div>`
          + `<div class="msg-item"><strong>`+msg.plannedDepartureDate+`</strong>`+intervalDateString+` <strong>`+msg.plannedDepartureTime.substr(0,5)+`</strong></div>`
          // + `<div class="msg-item"><strong>`+msg.plannedDepartureTime.substr(0,5)+`</strong></div>`
          + `<div class="msg-item"><strong>`+msg.cabinName+`</strong> (余:<strong>`+msg.availableSeatCount+`</strong>)</div>`
        )
      })
      // 对于票价的处理思路同上
      $('#calc-box .type-list > .item > .h1.w1').each(function(i){
        if(+msgArr[i].fullTicketPrice > maxPrice){
          console.log(this)
          $(this).parents('.type-list').addClass('strong')
        }
      })
      // 找到微信的输入框，然后模拟点击它后面的那个元素
      // 因为这部分是延迟加载的，所以暴力循环，直到点击成功为止
      // 这个地方我也想直接从底层进行修改，但网页数据绑定有问题，还是目前这种方法成本更低

//因来游吧改版不用微信扫码下单  2023-06-21
//      const toogleToWeixin = ()=>{
//        if($('input#radio_weixin').is(':checked')) { return }
//        $('input#radio_weixin').next().click()
//        window.setTimeout(toogleToWeixin, 500)
//      }
//      toogleToWeixin()
//因来游吧改版不用微信扫码下单  2023-06-21

      return
    }
    // 验证网址，如果处于门票下单页面进行下一步操作
    if(/ticket\/book\/\?/.test(url)){
      // 如果有订单标题这个元素，那么把它的文字内容换做今天的日期
      const calcBoxTitle = $('#calc-box > .title')
      if(calcBoxTitle){
        calcBoxTitle.text('今天日期：' + nowDateString)
      }
      // 处理表单
      // 网页中的 Vue 对象直接暴露，操作它就可以了
      const setUserData = data=>{
        for(const name in data){
          Vue.set(app.param, name, data[name])
          Vue.set(app.user, name, data[name])
        }
      }
      for(const user of users){
        if(user.check){
          if(app.user[user.check.name] === user.check.value){
            setUserData(user.data)
            break
          }
          continue
        }
        setUserData(user.data)
      }
      // 设置付款方式
      Vue.set(app.param, 'pay_type', 'wxpay')
      // Vue.set(app.param, 'pay_type', 'alipay')
      return
    }

    // 验证网址，如果处于日期查看页面进行下一步操作
    // 反引号（`）似乎无法被监听到，所以只保留了 Shift+C 的快捷键
    // 页面载入后的代码是要进行一定计算的，所以在载入后立刻复制得到的可能不是最终代码，所以注释掉了自动复制
    // 脚本管理器提供了复制到剪切板的 API, GM_setClipboard
    // jQuery 可以更方便的获取网页源码
    if(/my\/orderdetail\/id|\/ship/.test(url)){
      const copyAll = ()=>{
        const htmlCode = $('html').html()
        GM_setClipboard(htmlCode)
      }
      document.addEventListener('keydown',event=>{
        if(event.shiftKey&&event.code==='KeyC' || event.shiftKey&&event.code==='KeyX' || event.altKey&&event.code==='KeyQ'){
          copyAll();
        }
      })
      // copyAll()
      return
    }
  })
})()