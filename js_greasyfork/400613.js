// ==UserScript==
// @name         THE SCRIPT FOR HACG.DOG
// @namespace    https://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       Just
// @match        https://llss.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400613/THE%20SCRIPT%20FOR%20HACGDOG.user.js
// @updateURL https://update.greasyfork.org/scripts/400613/THE%20SCRIPT%20FOR%20HACGDOG.meta.js
// ==/UserScript==

(function() {
    window.console.group("THE SCRIPT FOR HACG.DOG FROM THIRD PARTY");

    window.console.log("%c 脚本开始加载", "color: #03A9F4; font-weight: bold");
    var beginTime = +new Date();

    // 使部分图像正常显示
    document.querySelector("head").innerHTML += '<meta name="referrer" content="no-referrer" />';
    var _all = document.querySelectorAll("img");
    for(var _i=0;_i<_all.length;_i++){
        if(_all[_i].src.indexOf("sinaimg.cn") !== -1){
            _all[_i].src = _all[_i].src.replace(".jpg","").replace("large","middle").replace("ws1","ww1");
        }else if(_all[_i].src.indexOf("llss.me") !== -1){
            _all[_i].src = _all[_i].src.replace("llss.me","sinaimg.cn/middle");
        }
    }
    window.console.log("%c 尝试替换无法加载的图片，已完成", "color: #CDDC39; font-weight: bold");

    // 文字转磁力链接
    var _a_a = document.getElementsByClassName('entry-content');
    if (_a_a.length == 1 || _a_a.length == 2){
        var _a = _a_a[_a_a.length - 1];
        var _o = _a.childNodes;
        var takeMe, j;
        for (var i = _o.length - 1; i >= 0; i--){
            if (takeMe = _o[i].textContent.match(/(\w{40})|(([A-Za-z0-9]{2,39})( ?)[\u4e00-\u9fa5 ]{2,}( ?)+(\w{2,37})\b)/g)){
                for (j = 0; j < takeMe.length; j++) {
                    var hash = takeMe[j].toString().replace(/(\s|[\u4e00-\u9fa5])+/g, '').trim();
                    if (hash.length >= 40) {
                        var fuel = "<a href='magnet:?xt=urn:btih:" + hash + "' style='font-size: 20px;'>磁力链接</a>";
                        _o[i].innerHTML = _o[i].innerHTML.toString().replace(takeMe[j], fuel);
                    }
                }
            }
        }
    }
    window.console.log("%c 尝试将文字转为磁力链接，已完成", "color: #4CAF50; font-weight: bold");

    var endTime = +new Date();
    window.console.log("%c 脚本完成加载，用时："+(endTime-beginTime)+"ms","color: #03A9F4; font-weight: bold");

    window.console.groupEnd();
})();