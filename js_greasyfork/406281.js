// ==UserScript==
// @name         天津老师刷课（天津市专业技术人员继续教育网）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解除天津市专业技术人员继续教育网的视频暂停功能。可以最小化。干点别的
// @author       FAKE_DAVE
// @match        *://*.chinahrt.com/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/406281/%E5%A4%A9%E6%B4%A5%E8%80%81%E5%B8%88%E5%88%B7%E8%AF%BE%EF%BC%88%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/406281/%E5%A4%A9%E6%B4%A5%E8%80%81%E5%B8%88%E5%88%B7%E8%AF%BE%EF%BC%88%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    //去除视频失去焦点暂停限制
window.onfocus = function(){console.log('on focus')};
window.onblur = function(){console.log('on blur')};
//判断是课程预览界面
if(window.location.href.indexOf("course/preview?")!=-1){
    var sections = document.getElementsByClassName("fr menu-zt")
    var completed_number = 0
    for(var i = 0; i < sections.length; i ++){
        if(sections[i].innerText.indexOf("学习中") != -1){
            completed_number++
        }
    }
    document.getElementsByClassName("menu")[0].getElementsByTagName("a")[completed_number-1].click()
}
})();