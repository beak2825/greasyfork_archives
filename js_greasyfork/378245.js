// ==UserScript==
// @name         龙腾网自动跳转
// @version      1.0
// @description  龙腾网购买后自动跳转
// @namespace   https://space.bilibili.com/482343
// @author      超神越鬼
// @license     超神越鬼
// @include      http://translate.ltaaa.com/message**
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378245/%E9%BE%99%E8%85%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/378245/%E9%BE%99%E8%85%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


var next_page_text = ["5 秒后自动返回，或点击返回！"],i,ret;

function find_element_by_text(text){
    var elements = document.getElementsByTagName("a");
    for (var i=0;i<elements.length;i++){
        // if(elements[i].innerText == text){
        if(elements[i].innerText.toLowerCase().indexOf(text) != -1){
            return elements[i];
        }
    }
    return false;
}


        for(i in next_page_text){
            ret = find_element_by_text(next_page_text[i]);
            if(ret){
                ret.click();
                return true;
            }
        }


