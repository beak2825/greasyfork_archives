// ==UserScript==
// @name         百度网盘批量离线
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/zh-CN/scripts/37905
// @version      1.8.1
// @description  批量离线辅助脚本
// @author       fenghengzhi
// @match        http://pan.baidu.com/disk/home*
// @match        http://yun.baidu.com/disk/home*
// @match        https://pan.baidu.com/disk/home*
// @match        https://yun.baidu.com/disk/home*
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/babel-standalone/babel.min.js
// @require      https://unpkg.com/babel-polyfill/dist/polyfill.min.js
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @note         v1.6改用unpkg的库，可自动使用最新版本
// ==/UserScript==

/* jshint esnext: true */
/* jshint esversion: 6 */

// Your code here...

let urls = [];
let i;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function alertWin(title, msg, w, h) {
  //背景层
  let bgObj = $(`<div style="position:absolute;left:0;top:0;width:100%;height:100%;opacity:0.3;background-color:#000;z-index:1000;"></div>`).appendTo('body');


  //创建一个弹出层
  let msgObj = $("#offlinelist-dialog").clone().appendTo('body');
  msgObj.attr('id', 'mul-dialog');
  msgObj.css('z-index', '1001');


  msgObj.find('.dialog-drag').mousedown(function (e) {
    let left, top, $this;
    left = e.clientX;
    top = e.clientY;
    $this = $(this);
    if (this.setCapture) {
      this.setCapture();
      this.onmousemove = function (ev) {
        mouseMove(ev || event);
      };
      this.onmouseup = mouseUp;
    }
    else {
      $(document).on("mousemove", mouseMove).on("mouseup", mouseUp);
    }

    function mouseMove(e) {
      let target = msgObj;
      let l = e.clientX - left + Number(target.css('margin-left').replace(/px$/, '')) || 0;
      let t = e.clientY - top + Number(target.css('margin-top').replace(/px$/, '')) || 0;
      //l = Math.min(l, $(window).width() - target.width() - target.position().left);
      //t = Math.min(t, $(window).height() - target.height() - target.position().top);
      left = e.clientX;
      top = e.clientY;
      target.css({'margin-left': l, 'margin-top': t});
    }

    function mouseUp(e) {
      let el = $this.get(0);
      if (el.releaseCapture) {
        el.releaseCapture();
        el.onmousemove = el.onmouseup = null;
      }
      else {
        $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp);
      }
    }
  });
  msgObj.find('.dialog-control').click(function () {
    bgObj.remove();
    msgObj.remove();
  });


  let dialogbody = msgObj.find('.dialog-body');
  dialogbody.children().remove();
  let table1 = $('<table style="width:100%;"></table>').appendTo(dialogbody);
  let tr1 = $('<tr></tr>').appendTo(table1);
  let td1 = $('<td colspan="2" style="width:100%;padding:10px;"></td>').appendTo(tr1);
  let mullineinputbox = $('<textarea id="multi_urls" style="width:100%;height:100px;border-radius:4px;border:1px solid rgb(196,196,196)"></textarea>;').appendTo(td1);
  $('head').append("<style>textarea:focus{border:1px solid rgb(192, 217, 255);}</style>");
  dialogbody.css('text-align', 'center');
  tr1 = $('<tr></tr>').insertAfter(tr1);
  td1 = $('<td style="padding-bottom:15px;"></td>').appendTo(tr1);
  let td2 = $('<td style="padding-bottom:15px;"></td>').insertAfter(td1);
  let button1 = $(`<button class="mul-button" style="width:104px;height:34px;border-radius:4px;border:none;outline:none;cursor:pointer;font:normal normal normal normal 13px / 32px 'Microsoft YaHei': SimSun;"></button>`);


  let button2 = button1.clone();
  button1.css('background-color', "rgb(59, 140, 255)").css('color', 'rgb(255,255,255)').text('确定');
  button2.css('border', '1px solid rgb(192, 217, 255)').css('background-color', "rgb(255,255,255)").css('color', 'rgb(59, 140, 255)').text('关闭');
  $('head').append("<style>button.mul-button:hover{opacity:0.7;}</style>");

  td1.append(button1);
  td2.append(button2);
  button1.click(function () {
    urls = $("#multi_urls").val().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split("\n");
    button2.click();
    Multi_offline_start();
    console.debug(urls);
  });
  button2.click(function () {
    bgObj.remove();
    msgObj.remove();
  });
  msgObj.find('.select-text').text(title);
  msgObj.css('width', w);
  msgObj.css({
    'left': bgObj.width() / 2 - msgObj.width() / 2,
    'top': bgObj.height() / 2 - msgObj.height() / 2
  });

}

var add_multi_button = async function() {
  while ($("#offlinelist-dialog").is(":visible") === false) await sleep(100);
  //$("#offlinelist-dialog").find(".dialog-control").children().click();//点击关闭按钮
  if ($('#offlinelist-dialog span.text:contains(批量离线)').length === 0) {
    $('#offlinelist-dialog').css('width', '720px');
    let old_button = $("#_disk_id_2");
    let new_button = old_button.clone();
    new_button.find('.text').text('批量离线');
    new_button.attr('id', 'multi_download');
    new_button.click(function () {
      alertWin('输入链接', '', 500, 500);
    });
    old_button.after(new_button);
  }
}

$('body').one('click', 'a.g-button:contains(离线下载)', add_multi_button);


function Multi_offline_start() {
  //$("#_disk_id_2").click();
  i = 0;//清空计数器
  offline_download();//进入循环
}

async function offline_download() {
  $("span.text:contains(新建链接任务)").click();//点击新建按钮
  //等待新建窗口
  while ($("#newoffline-dialog").is(":visible") === false) await sleep(100);
  $('#share-offline-link').val(urls[i]);//输入一条url
  $('#newoffline-dialog').find('span.text:contains(确定)').click();//点击确定按钮
  check_code();
}

async function check_code() {
  //上一步1.刚添加完一条url 2.刚输完一次验证码
  //下一步1.要求输验证码或直接通过 2.输错要重输，输对就通过
  while ($("#offlinelist-dialog").is(":visible") === false && $("#dialog1").is(":visible") === false) await sleep(100);
  if ($("#dialog1").is(":visible")) {//弹出验证码
    wait_checkcode_input();
  }
  else if ($("#offlinelist-dialog").is(":visible")) wait_complete();//没有弹出验证码
  else alert('error');
}

function wait_checkcode_input() {
  $("#dialog1 .input-code").focus();
  $("#dialog1 .input-code").on('input', function () {
    if (this.value.length === 4) {
      $('#dialog1').find('span.text:contains(确定)').click();
      check_code();
    }
  });
}

async function wait_complete() {
  while ($('#offlinelist-dialog').is(':visible') === false) await sleep(100);
  ++i;
  if (i < urls.length) offline_download();//继续批量下载
  //if条件为假，则批量下载完成，脚本结束
}
