// ==UserScript==
// @name         京东热自动跳转
// @namespace    http://liuzhixin.net/
// @version      0.1
// @description  京东热卖场自动跳转至京东商品页面
// @author       lzx
// @match        http://re.jd.com/*
// @grant         everyone，lucaslei
// @downloadURL https://update.greasyfork.org/scripts/11769/%E4%BA%AC%E4%B8%9C%E7%83%AD%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/11769/%E4%BA%AC%E4%B8%9C%E7%83%AD%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

 var findurl = document.getElementsByClassName("l_info_b")[0].children[0].href
 window.open(findurl,"_self");