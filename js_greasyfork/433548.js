// ==UserScript==
// @name         大连东软校园网自动连接2
// @description  校园网自动连接脚本
// @author       BuKe, Class 19005, Department of Software Engineering, DNUI
// @email        66482504@qq.com 
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        https://aaa.neusoft.edu.cn/
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/433548/%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%8E%A52.user.js
// @updateURL https://update.greasyfork.org/scripts/433548/%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%8E%A52.meta.js
// ==/UserScript==
$(function() {
   setTimeout(function(){   while(document.querySelector('#root > div > section:nth-child(3) > div > div:nth-child(2) > div > div.card-body > form > div:nth-child(2) > div:nth-child(1) > label')==null &&
                                  document.querySelector('#root > div > section:nth-child(3) > div > div:nth-child(2) > div > div.card-body > form > button') == null) {
   location.reload();
  }
  if(document.querySelector('#root > div > section:nth-child(3) > div > div:nth-child(2) > div > div.card-body > form > div:nth-child(2) > div:nth-child(1) > label')==null) {
      document.querySelector('#root > div > section:nth-child(3) > div > div:nth-child(2) > div > div.card-body > form > button').click();
    }else{
    document.getElementById(document.querySelector('#root > div > section:nth-child(3) > div > div:nth-child(2) > div > div.card-body > form > div:nth-child(2) > div:nth-child(1) > label').attributes["for"].value).checked=true; 
      document.querySelector('#root > div > section:nth-child(3) > div > div:nth-child(2) > div > div.card-body > form > button').click();
  } }, 500);
   setTimeout(function() {window.close();},1000);
})