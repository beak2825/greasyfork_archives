// ==UserScript==
// @name         百度新增常见搜索
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在百度中新增了常见搜索
// @author       bbbyqq
// @match        *://www.baidu.com/*
// @match        *://baidu.com/*
// @grant        GM_addStyle
// @license      bbbyqq
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/453697/%E7%99%BE%E5%BA%A6%E6%96%B0%E5%A2%9E%E5%B8%B8%E8%A7%81%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/453697/%E7%99%BE%E5%BA%A6%E6%96%B0%E5%A2%9E%E5%B8%B8%E8%A7%81%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  'use strict'

  $('#main-wrapper').css('margin', '30px 0 8px 18px');

  let btnList = []

  let localStorageBtnList = localStorage.getItem('btnList') ? JSON.parse(localStorage.getItem('btnList')) : ''

  if (!localStorageBtnList) {  // localStorage没有btnList，则使用上面写死的btnList
    localStorage.setItem('btnList', JSON.stringify(btnList))
    localStorageBtnList = JSON.parse(localStorage.getItem('btnList'))
  } else {
    btnList = localStorageBtnList
  }

  let div = `
    <div id="btn_list" style="width:1000px;position: absolute;"></div>`

  $('#form').before(div)

  localStorageBtnList.forEach(item => {
    $('#btn_list').append(`
      <button
        style="color: #fff;
               background-color: #1890ff;
               border: none #1890ff;
               line-height: 100%;
               position: relative;
               display: inline-block;
               font-weight: 400;
               white-space: nowrap;
               text-align: center;
               background-image: none;
               cursor: pointer;
               transition: all .3s cubic-bezier(.645,.045,.355,1);
               touch-action: manipulation;
               padding: 5px 15px;
               font-size: 16px;
               border-radius: 30px;"
        id="${item.id}">${item.text}</button>
    `)
  })

  $('#btn_list').append(`
    <button style="color: #fff;
                   background-color: #1890ff;
                   border: none #1890ff;
                   line-height: 100%;
                   position: relative;
                   display: inline-block;
                   font-weight: 400;
                   white-space: nowrap;
                   text-align: center;
                   background-image: none;
                   cursor: pointer;
                   transition: all .3s cubic-bezier(.645,.045,.355,1);
                   touch-action: manipulation;
                   padding: 5px 15px;
                   font-size: 16px;
                   border-radius: 30px;" id="more_btn">+</button>
  `)

  $('#result_logo').css('margin-top', '30px')
  $('#form').css('margin-top', '30px')
  setInterval(() => {
    $('#s_tab').css('padding-top', '80px') // tab栏
    if (!$('#content_left').length) { // 初始页
      if ($('#con-at').length) { // 广告
        $('#baidu_add_btn').css('bottom', '42px')
      } else {
        $('#baidu_add_btn').css('bottom', '125px')
      }
      if ($('#ent_sug').length) { // 初始页即将跳转搜索页
        $('#baidu_add_btn').css('bottom', '57px')
      }
    } else { // 搜索页
      if ($('#con-at').length) { // 广告
        $('#baidu_add_btn').css('bottom', '42px')
      } else {
        $('#baidu_add_btn').css('bottom', '57px')
      }
    }
  }, 100)

  readyClick()

  // 点击按钮事件
  function readyClick() {
    let inputVal = $('#kw')
    localStorageBtnList.forEach(item => {
      $(`#${item.id}`).unbind("click").bind("click", function () {
        let url = `${item.url + inputVal.val()}`
        window.open(url, '_blank')
      })
    })
  }

  // 点击更多，跳出弹窗
  let modal = `
  <div style="position: fixed;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 999;
              height: 100%;
              background-color: rgba(0,0,0,.45);" class="modal-mask">
    <div style="position: absolute;
                top: 15%;
                left: 50%;">
      <div style="width: 800px;
                  height: 400px;
                  background: #ffffff;
                  position: absolute;
                  top: 15%;
                  left: 50%;
                  transform: translateX(-50%);
                  z-index: 99;
                  border: 0;
                  border-radius: 4px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
        <div style="height: 10%;
                    color: rgba(0,0,0,.65);
                    background: #fff;
                    border-bottom: 1px solid #e8e8e8;
                    border-radius: 4px 4px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;">
          <div style="color: rgba(0,0,0,.85);
                      font-weight: 500;
                      font-size: 16px;">更多设置</div>
          <div style="cursor:pointer;" class="modal-close"><svg t="1673599630255" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2689" width="20" height="20"><path d="M544.448 499.2l284.576-284.576a32 32 0 0 0-45.248-45.248L499.2 453.952 214.624 169.376a32 32 0 0 0-45.248 45.248l284.576 284.576-284.576 284.576a32 32 0 0 0 45.248 45.248l284.576-284.576 284.576 284.576a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0-45.248L544.448 499.2z" fill="#000000" p-id="2690"></path></svg></div>
        </div>
        <div style="height: 80%;
                    font-size: 14px;
                    line-height: 1.5;
                    word-wrap: break-word;">
          <div style="height: 85%;padding: 24px">
            <div id="new_btn_list" style="text-align: left;"></div>
            <div style="margin-top: 40px;">
              <div style="margin-bottom: 20px;display: flex;align-items: center;">
                <span style="white-space: nowrap;">名称：</span>
                <input id="modal_text" type="text" style="outline-style: none ;border: 1px solid #ccc; border-radius: 3px;padding: 6px;width: 100%;font-size: 14px;box-sizing: border-box">
              </div>
              <div style="margin-bottom: 20px;display: flex;align-items: center;">
                <span style="white-space: nowrap;">URL：</span>
                <a href="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/4eb74635f55a56544a817b2bdf361cb7573cbc3155c48c5acc3d8d1b2a5a3896c8e691f588b7265ab9de757a543eca1e?pictype=scale&from=30013&version=3.3.3.3&fname=Snipaste_2023-03-27_17-52-10.png&size=750" target="_blank" style="display: flex;">
                  <svg t="1679909899172" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3888" width="20" height="20"><path d="M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m0 73.142857C323.486476 170.666667 170.666667 323.486476 170.666667 512s152.81981 341.333333 341.333333 341.333333 341.333333-152.81981 341.333333-341.333333S700.513524 170.666667 512 170.666667z m36.571429 268.190476v292.571428h-73.142858V438.857143h73.142858z m0-121.904762v73.142857h-73.142858v-73.142857h73.142858z" p-id="3889" fill="#333333"></path></svg>
                </a>
                <input id="modal_url" type="text" style="margin-left: 5px;outline-style: none ;border: 1px solid #ccc; border-radius: 3px;padding: 6px;width: 100%;font-size: 14px;box-sizing: border-box">
              </div>
              <div style="width: 100%;text-align: right;">
                <button id="modal_delete_btn" style="display: none;
                                                     margin-right: 10px;
                                                     font-weight: 400;
                                                     white-space: nowrap;
                                                     text-align: center;
                                                     background-image: none;
                                                     cursor: pointer;
                                                     transition: all .3s cubic-bezier(.645,.045,.355,1);
                                                     user-select: none;
                                                     touch-action: manipulation;
                                                     height: 25px;
                                                     padding: 0 15px;
                                                     font-size: 14px;
                                                     border-radius: 4px;
                                                     color: rgba(0,0,0,0.65);
                                                     background-color: #fff;
                                                     border: 1px solid #d9d9d9;">删除</button>
                <button id="modal_edit_btn" style="display: none;
                                                   margin-right: 10px;
                                                   font-weight: 400;
                                                   white-space: nowrap;
                                                   text-align: center;
                                                   background-image: none;
                                                   cursor: pointer;
                                                   transition: all .3s cubic-bezier(.645,.045,.355,1);
                                                   user-select: none;
                                                   touch-action: manipulation;
                                                   height: 25px;
                                                   padding: 0 15px;
                                                   font-size: 14px;
                                                   border-radius: 4px;
                                                   color: rgba(0,0,0,0.65);
                                                   color: #fff;
                                                   background-color: #1890ff;
                                                   border: 1px solid #1890ff;">修改</button>
                <button id="modal_add_btn" style="margin-right: 10px;
                                                  display: inline-block;
                                                  font-weight: 400;
                                                  white-space: nowrap;
                                                  text-align: center;
                                                  background-image: none;
                                                  cursor: pointer;
                                                  transition: all .3s cubic-bezier(.645,.045,.355,1);
                                                  user-select: none;
                                                  touch-action: manipulation;
                                                  height: 25px;
                                                  padding: 0 15px;
                                                  font-size: 14px;
                                                  border-radius: 4px;
                                                  color: rgba(0,0,0,0.65);
                                                  color: #fff;
                                                  background-color: #1890ff;
                                                  border: 1px solid #1890ff;">新增</button>
              </div>
          </div>
          </div>
        </div>
        <div style="height: 10%;
                    background: transparent;
                    border-top: 1px solid #e8e8e8;
                    border-radius: 0 0 4px 4px;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    justify-content: end;">
          <button style="margin-right: 10px;
                         display: inline-block;
                         font-weight: 400;
                         white-space: nowrap;
                         text-align: center;
                         background-image: none;
                         cursor: pointer;
                         transition: all .3s cubic-bezier(.645,.045,.355,1);
                         user-select: none;
                         touch-action: manipulation;
                         height: 25px;
                         padding: 0 15px;
                         font-size: 14px;
                         border-radius: 4px;
                         color: rgba(0,0,0,0.65);
                         background-color: #fff;
                         border: 1px solid #d9d9d9;" class="modal-close">取消</button>  
          <button style="margin-right: 10px;
                         display: inline-block;
                         font-weight: 400;
                         white-space: nowrap;
                         text-align: center;
                         background-image: none;
                         cursor: pointer;
                         transition: all .3s cubic-bezier(.645,.045,.355,1);
                         user-select: none;
                         touch-action: manipulation;
                         height: 25px;
                         padding: 0 15px;
                         font-size: 14px;
                         border-radius: 4px;
                         color: rgba(0,0,0,0.65);
                         color: #fff;
                         background-color: #1890ff;
                         border: 1px solid #1890ff;" class="modal-confirm">确定</button>
        </div>
      </div>
    </div>
  </div>`

  handleMoreClick()

  // 点击更多按钮
  function handleMoreClick() {
    $("#more_btn").unbind("click").bind("click", function () {
      // 弹出弹窗
      $('body').append(modal)
      localStorageBtnList.forEach(item => {
        $('#new_btn_list').append(`
          <button style="color: #fff;
                         background-color: #1890ff;
                         border: none #1890ff;
                         line-height: 100%;
                         position: relative;
                         display: inline-block;
                         font-weight: 400;
                         white-space: nowrap;
                         text-align: center;
                         background-image: none;
                         cursor: pointer;
                         transition: all .3s cubic-bezier(.645,.045,.355,1);
                         touch-action: manipulation;
                         padding: 5px 15px;
                         font-size: 16px;
                         border-radius: 30px;
                         border: none;
                         margin: 5px 5px 0 0;" class="${item.id}" id="${item.id}">${item.text}</button>
        `)
        handleClickBtn(item)
      })
      handleClose()
      handleModalAdd()
      handleConfirm()
      return
    })
  }

  // 点击弹窗按钮
  function handleClickBtn(item) {
    $(`.${item.id}`).unbind("click").bind("click", function () {
      // 把按钮信息赋值到输入框中
      $('#modal_text').val(item.text)
      $('#modal_url').val(item.url)
      // 隐藏新增按钮，显示删除，修改按钮
      $('#modal_add_btn').css('display', 'none')
      $('#modal_delete_btn').css('display', 'inline')
      $('#modal_edit_btn').css('display', 'inline')
      handleDelete(item)
      handleEdit(item)
    })
  }

  // 弹窗删除按钮
  function handleDelete(item) {
    $("#modal_delete_btn").unbind("click").bind("click", function () {
      // 清空输入框内容
      $('#modal_text').val("")
      $('#modal_url').val("")
      // 删除数组
      btnList = btnList.filter(iteml => {
        return iteml.id !== item.id
      })
      // 删除元素
      $(`.${item.id}`).remove()
      // 显示新增按钮，隐藏删除，修改按钮
      $('#modal_add_btn').css('display', 'inline')
      $('#modal_delete_btn').css('display', 'none')
      $('#modal_edit_btn').css('display', 'none')
    })
  }

  // 弹窗修改按钮
  function handleEdit(item) {
    $("#modal_edit_btn").unbind("click").bind("click", function () {
      btnList.forEach(iteml => {
        if (iteml.id === item.id) {
          iteml.text = $('#modal_text').val()
          iteml.url = $('#modal_url').val()
          $(`.${item.id}`).text($('#modal_text').val())
        }
      })
      // 清空输入框内容
      $('#modal_text').val("")
      $('#modal_url').val("")
      // 显示新增按钮，隐藏删除，修改按钮
      $('#modal_add_btn').css('display', 'inline')
      $('#modal_delete_btn').css('display', 'none')
      $('#modal_edit_btn').css('display', 'none')
    })
  }

  // 关闭弹窗
  function handleClose() {
    $(`.modal-close`).unbind("click").bind("click", function () {
      $('.modal-mask')[0].remove()
    })
  }

  // 确定弹窗
  function handleConfirm() {
    $(`.modal-confirm`).unbind("click").bind("click", function () {
      // 储存到localStorage
      localStorage.setItem('btnList', JSON.stringify(btnList))
      // 刷新页面
      location.reload()
    })
  }

  // 定义uuid
  function uuid() {
    let temp_url = URL.createObjectURL(new Blob())
    let uuid = temp_url.toString()
    URL.revokeObjectURL(temp_url)
    return uuid.substr(uuid.lastIndexOf("/") + 1)
  }

  // 新增
  function handleModalAdd() {
    $(`#modal_add_btn`).unbind("click").bind("click", function () {
      let obj = {
        id: uuid(),
        text: $('#modal_text').val(),
        url: $('#modal_url').val()
      }
      btnList.push(obj)
      // 弹窗新增元素
      $('#new_btn_list').append(`
        <button style="color: #fff;
                       background-color: #1890ff;
                       border: none #1890ff;
                       line-height: 100%;
                       position: relative;
                       display: inline-block;
                       font-weight: 400;
                       white-space: nowrap;
                       text-align: center;
                       background-image: none;
                       cursor: pointer;
                       transition: all .3s cubic-bezier(.645,.045,.355,1);
                       touch-action: manipulation;
                       padding: 5px 15px;
                       font-size: 16px;
                       border-radius: 30px;
                       border: none;
                       margin: 5px 5px 0 0;" class="${obj.id}" id="${obj.id}">${obj.text}</button>
      `)
      // 清空输入框内容
      $('#modal_text').val("")
      $('#modal_url').val("")
      handleClickBtn(obj)
    })
  }
})()
