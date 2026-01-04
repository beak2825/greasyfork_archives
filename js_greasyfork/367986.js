// ==UserScript==
// @name         helper.netdisk.baidu
// @namespace    https://greasyfork.org/users/367986
// @version      0.2
// @description  百度网盘批量离线辅助脚本
// @author       Orzm
// @match        http*://pan.baidu.com/disk/home*
// @match        http*://yun.baidu.com/disk/home*
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/367986/helpernetdiskbaidu.user.js
// @updateURL https://update.greasyfork.org/scripts/367986/helpernetdiskbaidu.meta.js
// ==/UserScript==


let savePath = "我的网盘/全部文件/我的资源";
let urls = [];
let i;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function show_batch_dialog(title, msg, w, h) {
  let bgObj = $(`<div style="position:absolute;left:0;top:0;width:100%;height:100%;opacity:0.3;background-color:#000;z-index:1000;"></div>`).appendTo('body');

  let msgObj = $("#offlinelist-dialog").clone().appendTo('body');
  msgObj.attr('id', 'batch-dialog');
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
  $('<span>保存到：</span><input type="text" id="save-path" />').appendTo(td1);
  $('#save-path').css("width", "80%");
  $('#save-path').val(savePath);

  tr1 = $('<tr></tr>').insertAfter(tr1);
  td1 = $('<td colspan="2" style="width:100%;padding:10px;"></td>').appendTo(tr1);
  $('<textarea id="multi_urls" style="width:100%;height:100px;border-radius:4px;border:1px solid rgb(196,196,196)"></textarea>;').appendTo(td1);
  $('head').append("<style>textarea:focus{border:1px solid rgb(192, 217, 255);}</style>");

  dialogbody.css('text-align', 'center');

  tr1 = $('<tr></tr>').insertAfter(tr1);
  td1 = $('<td style="padding-bottom:15px;"></td>').appendTo(tr1);
  let td2 = $('<td style="padding-bottom:15px;"></td>').insertAfter(td1);

  let btnConfirm = $(`<button class="mul-button" style="width:104px;height:34px;border-radius:4px;border:none;outline:none;cursor:pointer;font:normal normal normal normal 13px / 32px 'Microsoft YaHei': SimSun;"></button>`);
  let btnClose = btnConfirm.clone();
  btnConfirm.css('background-color', "rgb(59, 140, 255)").css('color', 'rgb(255,255,255)').text('确定');
  btnClose.css('border', '1px solid rgb(192, 217, 255)').css('background-color', "rgb(255,255,255)").css('color', 'rgb(59, 140, 255)').text('关闭');

  $('head').append("<style>button.mul-button:hover{opacity:0.7;}</style>");

  td1.append(btnConfirm);
  td2.append(btnClose);

  btnConfirm.click(function () {
  	savePath = $("#save-path").val();
    urls = $("#multi_urls").val().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split("\n");
    btnClose.click();
    batch_start();
    console.debug(urls);
  });

  btnClose.click(function () {
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

var init_btn_batch = async function() {
  while (!$("#offlinelist-dialog").is(":visible")) await sleep(100);

  $('#offlinelist-dialog').css('width', '720px');
  let btnLink = $("#_disk_id_2");
  let btnBatch = btnLink.clone();
  btnBatch.find('.text').text('批量任务');
  btnBatch.attr('id', 'batch-task');
  btnBatch.click(function () {
    show_batch_dialog('输入下载链接', '', 500, 500);
  });
  btnLink.after(btnBatch);
}

$('body').one('click', 'a.g-button:contains(离线下载)', init_btn_batch);


function batch_start() {
  i = 0;//清空计数器
  offline_download();//进入循环
}

async function offline_download() {
  $("span.text:contains(新建链接任务)").click();

  while (!$("#newoffline-dialog").is(":visible")) await sleep(100);

  $('#share-offline-link').val(urls[i]);
  $('#newoffline-dialog').find('span.text:contains(确定)').click();
  check_code();
}

async function check_code() {
  //上一步1.刚添加完一条url 2.刚输完一次验证码
  //下一步1.要求输验证码或直接通过 2.输错要重输，输对就通过
  while (!$("#offlinelist-dialog").is(":visible") && !$("#dialog1").is(":visible")) await sleep(100);

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
  while (!$('#offlinelist-dialog').is(':visible')) await sleep(100);
  ++i;
  if (i < urls.length) offline_download();//继续批量下载
  //if条件为假，则批量下载完成，脚本结束
}