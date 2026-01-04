// ==UserScript==
// @name         journal2自动保存全局css
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  journal2自动保存全局css，以备不时之需，以防万一按到重置，自动保存最近十次保存的样式代码到浏览器本地存储
// @author       Tams
// @match        *://*/admin/index.php?route=module/journal2&token=*
// @icon         https://wiki.greasespot.net/favicon.ico
// @grant        GM.registerMenuCommand
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443920/journal2%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%85%A8%E5%B1%80css.user.js
// @updateURL https://update.greasyfork.org/scripts/443920/journal2%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%85%A8%E5%B1%80css.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var _GM_registerMenuCommand;
  if (typeof GM_registerMenuCommand != 'undefined') {
    _GM_registerMenuCommand = GM_registerMenuCommand;
  } else if (typeof GM != 'undefined' && typeof GM.registerMenuCommand != 'undefined') {
    _GM_registerMenuCommand = GM.registerMenuCommand;
  } else {
    _GM_registerMenuCommand = (s, f) => {};
  }
  _GM_registerMenuCommand("还原", restore);
  document.addEventListener('click', function(e) {
    if (e.target == document.querySelector("#journal-body > div.sticky.ng-scope > div > div.module-buttons > a.btn.green")) {
      if (window.location.href.indexOf('/settings/custom_code/') != -1) {
        var list = localStorage.getItem("csslist") == null ? [] : [...JSON.parse(localStorage.getItem("csslist") == null ? [] : localStorage.getItem("csslist"))];
        if (list.length > 10) {
          list.shift()
        }
        var css_text = document.querySelector("#main-accordion > div > div:nth-child(1) > div.accordion-body.collapse > div > ul > li > span.module-create-option > div > textarea")
          .value;
        // .replaceAll('\n', '')
        var css_obj = {
          value: css_text,
          time: new Date().getTime()
        }
        list.push(css_obj)
        localStorage.setItem("csslist", JSON.stringify(list))
        var js_list = localStorage.getItem("jslist") == null ? [] : [...JSON.parse(localStorage.getItem("jslist") == null ? [] : localStorage.getItem("jslist"))];
        if (js_list.length > 10) {
          js_list.shift()
        }
        var js_text = document.querySelector("#main-accordion > div > div:nth-child(2) > div.accordion-body.collapse > div > ul > li > span.module-create-option > div > textarea")
          .value;
        // .replaceAll('\n', '')
        var js_obj = {
          value: js_text,
          time: new Date().getTime()
        }
        js_list.push(js_obj)
        localStorage.setItem("jslist", JSON.stringify(js_list))
      }
    }
  }, false);
  var css_style = document.createElement("style");
  css_style.innerHTML = "#restore_journal2{position:fixed;top:50%;left:50%;width:650px;height:500px;border-radius:10px;background-color:#fff;box-shadow:0 0 8px 3px #000;z-index:9999999999;transform:translate(-50%,-50%);box-sizing:border-box;padding:0 40px;font-size:0}#restore_journal2 .clear{position:absolute;top:5px;right:5px;width:20px;height:20px;text-align:center;line-height:20px;font-size:18px;color:#fff;border-radius:50%;background-color:red}#restore_journal2 ul{width:calc(50% - 10px);padding-top:30px;padding-left:0;display:inline-block;font-size:0;vertical-align:top}#restore_journal2 ul:nth-of-type(1){margin-right:20px}#restore_journal2 li{margin-bottom:10px;background-color:#ccc;line-height:28px;font-size:18px;list-style:none;padding-left:20px;border-radius:24px;box-sizing:border-box}#restore_journal2 li span{float:right;background-color:#007aff;border-radius:24px;padding:0 10px;color:#fff;cursor:pointer}#restore_journal2 h2{font-size:20px}"
  document.body.appendChild(css_style);

  var js_script = document.createElement("script");

  let js_html = ''
  js_html += 'function post_info(){let url_list=window.location.href.split("#");let theme_id=url_list[1].charAt((url_list[1].length)-1);let url_=url_list[0].split("?route=")[0];let token=url_list[0].split("&token=")[1];let url=url_+"?route=module/journal2/rest/settings/save&token="+token+"&category=custom_code&theme_id="+theme_id;let css_value=document.querySelector("#main-accordion > div > div:nth-child(1) > div.accordion-body.collapse > div > ul > li > span.module-create-option > div > textarea").value;let js_value=document.querySelector("#main-accordion > div > div:nth-child(2) > div.accordion-body.collapse > div > ul > li > span.module-create-option > div > textarea").value;let data_={settings:{custom_css:{value:{text:css_value}},custom_js:{value:{text:js_value}}}};doPost(url,data_)};';
  js_html += 'function doPost(url,data){$.ajax({url:url,method:"POST",contentType:"application/json; charset=utf-8",headers:{Accept:"application/json, text/plain, */*"},dataType:"json",data:JSON.stringify(data),success:(res)=>{if(res.status=="success")alert("还原成功！请手动刷新页面查看。")}})}';
  js_html += 'function clearCss(){document.querySelector("#restore_journal2").remove()};function css_restore_btn(index){let css_list=JSON.parse(localStorage.getItem("csslist"));let css_textarea=document.querySelector("#main-accordion > div > div:nth-child(1) > div.accordion-body.collapse > div > ul > li > span.module-create-option > div > textarea");css_textarea.value=css_list[index].value;post_info()};function js_restore_btn(index){let js_list=JSON.parse(localStorage.getItem("jslist"));let js_textarea=document.querySelector("#main-accordion > div > div:nth-child(2) > div.accordion-body.collapse > div > ul > li > span.module-create-option > div > textarea");js_textarea.value=js_list[index].value;post_info()};';
  js_script.innerHTML = js_html
  document.body.appendChild(js_script);

  function restore() {
    var div = document.createElement("div");
    div.id = "restore_journal2"
    var html_ = '<div class=clear onclick=clearCss()>X</div><ul id=css_list>'
    let css_list = JSON.parse(localStorage.getItem('csslist'))
    for (let i = 0; i < css_list.length; i++) {
      let d = new Date(css_list[i].time)
      let year = d.getFullYear();
      let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      let h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      let m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      let s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      let name = year + '/' + month + '/' + day + ' ' + h + ':' + m + ':' + s;
      html_ += '<li>css ' + name + '<span onclick=css_restore_btn(' + i + ')>还原</span></li>'
    }
    html_ += '</ul><ul id="js_list">'
    let js_list = JSON.parse(localStorage.getItem('jslist'))
    for (let i = 0; i < js_list.length; i++) {
      let d = new Date(js_list[i].time)
      let year = d.getFullYear();
      let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      let h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      let m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      let s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      let name = year + '/' + month + '/' + day + ' ' + h + ':' + m + ':' + s;
      html_ += '<li>js ' + name + '<span onclick=js_restore_btn(' + i + ')>还原</span></li>'
    }
    html_ += '</ul><h2>*点击还原会自动替换内容自动保存，并不记录。</h2>'
    div.innerHTML = html_
    document.body.appendChild(div);
  };
  document.onkeydown = function(event) {
    if (event.ctrlKey == true && event.keyCode == 83) { //Ctrl+S
      event.preventDefault();
      if (document.querySelector('#journal-body > div.sticky.ng-scope > div > div.module-buttons > a.btn.green')) {
        document.querySelector('#journal-body > div.sticky.ng-scope > div > div.module-buttons > a.btn.green').click();
      }
      if (document.querySelector('#content > div.page-header > div > div > button')) {
        document.querySelector('#content > div.page-header > div > div > button').click();
      }
    }
  }
})();
