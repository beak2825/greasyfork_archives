// ==UserScript==
// @name          Discuz!论坛自动只看该作者
// @description Discuz!论坛自动只看该作者，按G切换
// @version      1.1
// @namespace   https://space.bilibili.com/482343
// @author      超神越鬼
// @license     超神越鬼
// @include      **/thread-**-1-1.html
// @include      **/forum.php?mod=viewthread&tid=**
// @exclude http://bbs.zhiyoo.net/**
// @run-at       document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/378244/Discuz%21%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%8F%AA%E7%9C%8B%E8%AF%A5%E4%BD%9C%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/378244/Discuz%21%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%8F%AA%E7%9C%8B%E8%AF%A5%E4%BD%9C%E8%80%85.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function keydown(event){
        if(event.keyCode == 71){
            iso=!iso;
            GM_setValue(key,iso);
            if (iso) {vk()}else qb();
            return true;
        }
    }
    const key = "DiscuzAO";
    var iso=GM_getValue(key,true);
    GM_setValue(key,iso);
    document.addEventListener('keydown', keydown, false);

    var str=location.href;
    if (str.indexOf("authorid=") > 2) {return true;}

    function vk(){
        var next_page_text = ["只看该作者","只看該作者"];
        function find_element_by_text(text){
            var elements = document.getElementsByTagName("a");
            for (var i=0;i<elements.length;i++){
                //  if(elements[i].innerText == text){
                if(elements[i].innerText.toLowerCase().indexOf(text) != -1){
                    location.href=elements[i].href;
                    return elements[i];
                }
            }
            return false;
        }
        var i,ret
        for(i in next_page_text){
            ret = find_element_by_text(next_page_text[i]);
            if(ret){
                // ret.click();
                return true;
            }
        }
    }
    function qb(){
        var next_page_text = ["显示全部楼层","顯示全部樓層"];
        function find_element_by_text(text){
            var elements = document.getElementsByTagName("a");
            for (var i=0;i<elements.length;i++){
                //  if(elements[i].innerText == text){
                if(elements[i].innerText.toLowerCase().indexOf(text) != -1){
                    location.href=elements[i].href;
                    return elements[i];
                }
            }
            return false;
        }
        var i,ret
        for(i in next_page_text){
            ret = find_element_by_text(next_page_text[i]);
            if(ret){
                // ret.click();
                return true;
            }
        }
    }
 if (iso) vk();

})();