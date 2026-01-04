// ==UserScript==
// @name         KAO#2:getitfree.cn
// @namespace    https://www.bennythink.com/
// @version      0.1
// @description  https://www.getitfree.cn/，不必关闭广告屏蔽器。
// @author       BennyThink
// @supportURL   https://github.com/BennyThink/KeepABPOn
// @license      MIT
// @match        *://www.getitfree.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411201/KAO2%3Agetitfreecn.user.js
// @updateURL https://update.greasyfork.org/scripts/411201/KAO2%3Agetitfreecn.meta.js
// ==/UserScript==

document.getElementsByClassName('notice')[0].parentNode.id=3
document.querySelector("script[src='https://www.getitfree.cn/wp-content/plugins/adunblocker/public/js/ygxwuqoni.js?ver=1.0.10']").remove()
document.querySelector("script[src='/wp-content/plugins/adunblocker/public/js/banner_ads_300_250.js']").remove()
document.querySelector("link[href='https://www.getitfree.cn/wp-content/plugins/adunblocker/public/css/ygxwuqoni.css?ver=1.0.10']").remove()



