// ==UserScript==
// @name         半自动删除群发文章
// @namespace    https://mp.weixin.qq.com/
// @version      1.0.1
// @description  半自动删除群发文章 内部专用
// @author       
// @match        https://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403214/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E7%BE%A4%E5%8F%91%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/403214/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E7%BE%A4%E5%8F%91%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (window.location.origin !== 'https://mp.weixin.qq.com') return
  let userName = wx.commonData.data.user_name
  let qrCodeList = []
  let msgData = []
  let totalCount = 0
  let dayIndex = 0
  let itemIndex = 0
  let pageSize = 7
  let pageIndex = 0
  let timer = null
  let time = 1000
  let msk = $('<div></div>')
  let tips = $('<div></div>')
  tips.css({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    color: '#fff',
    lineHeight: '40px',
    textAlign: 'center'
  })
  function dateFormat(fmt, ts) {
    let date = new Date()
    if ((ts + '').length === 13) {
      date = new Date(ts)
    } else {
      date = new Date(ts * 1000)
    }
    let ret;
    const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  }
  function getUrlParam (name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if (!url) {
      url = window.location.search.substr(1)
    }
    var r = url.match(reg);
    if (r != null) return decodeURI(r[2]); return null;
  }
  let token = getUrlParam('token')
  function getData() {
    $.ajax({
      url: 'https://mp.weixin.qq.com/cgi-bin/newmasssendpage',
      type: 'get',
      data: {
        count: pageSize,
        begin: pageIndex * pageSize,
        token: token,
        lang: 'zh_CN',
        f: 'json',
        ajax: 1
      },
      success: function(res) {
        dayIndex = 0
        itemIndex = 0
        msgData = res.sent_list
        totalCount = res.total_count
        getImage()
      }
    })
  }
  function getTicket(msgId, item) {
    console.log(`获取${dayIndex}, ${itemIndex}`)
    $.ajax({
      url: 'https://mp.weixin.qq.com/cgi-bin/safeqrcode',
      type: 'post',
      async: false,
      data: {
        action: 'getticket',
        typeid: 65,
        extra: JSON.stringify({ msgid: msgId, idx: item.itemidx, i: item.itemidx - 1 }),
        token: token,
        lang: 'zh_CN',
        f: 'json',
        ajax: 1
      },
      success: function(res) {
        if (res.qrcheck_ticket) {
          let ticket = res.qrcheck_ticket
          let img = `https://mp.weixin.qq.com/cgi-bin/safeqrcode?action=getqrcode&qrcheck_ticket=${ticket}&size165&token=${token}`
          startScan(ticket, img, item)
        } else {
          let msg = $('<div>获取二维码失败，请稍后再试</div>')
          msk.append(msg)
        }
      }
    })
  }
  function getResult(ticket, msg, item) {
    $.ajax({
      url: 'https://mp.weixin.qq.com/cgi-bin/safeqrcode',
      type: 'get',
      data: {
        action: 'ask',
        qrcheck_ticket: ticket,
        token: token,
        lang: 'zh_CN',
        f: 'json',
        ajax: 1
      },
      success: function(res) {
        // status: 0>等待 1>成功 2>失败 4>待确认
        switch (res.status) {
          case 0:
            msg.text('等待扫码')
            break
          case 1:
            console.log('删除成功')
            clearInterval(timer)
            itemIndex++
            getImage()
            break
          case 2:
            console.log('扫码失败，请刷新')
            msg.text('扫码失败')
            msg.css({
              color: 'red'
            })
            clearInterval(timer)
            break
          case 4:
            msg.text('扫码成功，请确认')
            break
        }
      }
    })
  }
  function startScan(ticket, img, item) {
    let wrap = $('<div class="wrap"></div>')
    let msg = $('<div></div>')
    let date = $('<div></div>')
    let title = $(`<div>《${item.title}》</div>`)
    let currImg = $(`<img src="${img}"/>`)
    let link = $(`<a target="_blank" href="${item.content_url}">查看文章</a>`)
    link.css({
      color: 'blue'
    })
    title.css({
      color: '#fff'
    })
    msg.css({
      color: 'white'
    })
    wrap.css({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '300px',
      textAlign: 'center'
    })
    currImg.css({
      display: 'block',
      width: '165px',
      height: 'auto'
    })
    msg.css({
      textAlign: 'center'
    })
    date.css({
      color: '#fff',
      fontSize: '14px',
      textAlign: 'center'
    })
    date.text('发文日期: ' + dateFormat('YYYY-mm-dd', msgData[dayIndex].sent_info.time))
    tips.text(`总共${totalCount}天，当前第${pageSize * pageIndex + dayIndex + 1}天 第${itemIndex + 1}条。`)
    if (msk.find('.wrap')) {
      msk.find('.wrap').remove()
    }

    let next = $('<div class="next">下一篇</div>')
    next.css({
      color: 'green',
      cursor: 'pointer'
    })
    next.click(function () {
      timer && clearInterval(timer)
      itemIndex++
      getImage()
    })
    wrap.append(title)
    wrap.append(date)
    wrap.append(currImg)
    wrap.append(msg)
    wrap.append(link)
    wrap.append(next)
    msk.append(tips)
    msk.append(wrap)
    let progress = {
      pageIndex: pageIndex,
      dayIndex: dayIndex,
      itemIndex: itemIndex
    }
    console.log(progress)
    localStorage.setItem('REMOVE_PROGRESS' + userName, JSON.stringify(progress))
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    timer = setInterval(function () {
      getResult(ticket, msg)
    }, time)
  }
  function getImage() {
    if (msgData.length > dayIndex) {
      let msgId = msgData[dayIndex].msgid
      let msgList = msgData[dayIndex].appmsg_info
      if (((new Date() / 1000) - msgData[dayIndex].sent_info.time) < 3 * 24 * 60 * 60) {
        console.log('当前发文小于3天')
        dayIndex++
        itemIndex = 0
        getImage()
        return
      }
      if (msgData[dayIndex].sent_status.fail) {
        console.log('当前发文失败')
        dayIndex++
        itemIndex = 0
        getImage()
        return
      }
      if (msgList.length > itemIndex) {
        let item = msgList[itemIndex]
        if (!item.is_deleted) {
          getTicket(msgId, item)
        } else {
          itemIndex++
          getImage()
        }
      } else {
        console.log('下一天')
        dayIndex++
        itemIndex = 0
        getImage()
      }
    } else {
      pageIndex++
      getData()
    }
  }
  
  function main () {
    getData()
    msk.css({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.9)'
    })
    $('body').append(msk)
  }

  let button = $('<div class="plug_button weui-desktop-btn weui-desktop-btn_warn">删除文章</div>')
  button.css({
    position: 'fixed',
    right: 0,
    top: '100px'
  })
  $('body').append(button)
  button.on('click', function() {
    let store = localStorage.getItem('REMOVE_PROGRESS' + userName)
    if (store) {
      let storeData = JSON.parse(store)
      dayIndex = storeData.dayIndex || 0
      itemIndex = storeData.itemIndex || 0
      pageIndex = storeData.pageIndex || 0
    }
    console.log(store)
    main()
  })
})();