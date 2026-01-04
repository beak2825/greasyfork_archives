// ==UserScript==
// @name         中国药科大学网络接入认证系统自动登录
// @namespace    https://blog.ncbadboy.ml
// @version      1
// @description  中国药科大学网络接入认证系统-自动登录
// @author       南村群童 mail:xjlhq0096@gmail.com
// @match        192.168.199.21/*
// @match        http://www.msftconnecttest.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433601/%E4%B8%AD%E5%9B%BD%E8%8D%AF%E7%A7%91%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E6%8E%A5%E5%85%A5%E8%AE%A4%E8%AF%81%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/433601/%E4%B8%AD%E5%9B%BD%E8%8D%AF%E7%A7%91%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E6%8E%A5%E5%85%A5%E8%AE%A4%E8%AF%81%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

var username = "XXXXX"; //改成自己的账号，eg：2018502452
var password = "XXXXX"; //改成自己的密码，eg：password

function getElementsByXPath(xpath){
    console.log('xpath:', xpath);
    return document.evaluate(xpath, document , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
window.addEventListener ("load", pageFullyLoaded);
function pageFullyLoaded(){
    var name = getElementsByXPath("//input[contains(@class, 'edit_lobo_cell')][contains(@name, 'DDDDD')]")
    name.value = username
    name.dispatchEvent(new Event('input'));
    var pwd = getElementsByXPath("//input[contains(@class, 'edit_lobo_cell')][contains(@name, 'upass')]")
    pwd.value = password
    pwd.dispatchEvent(new Event('input'));
    var login_btn = getElementsByXPath("//input[contains(@class, 'edit_lobo_cell')][contains(@name, '0MKKey')]")
    login_btn.click()
}