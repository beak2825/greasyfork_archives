// ==UserScript==
// @name         【樱落网】去他妈的印度
// @namespace    https://greasyfork.org/zh-CN/users/76579-%E4%BB%99%E5%9C%A3
// @version      0.2
// @description  屏蔽樱落网标题里含有印度的翻译文章
// @author       仙圣
// @include      *skyfall.ink*



// @downloadURL https://update.greasyfork.org/scripts/414009/%E3%80%90%E6%A8%B1%E8%90%BD%E7%BD%91%E3%80%91%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E5%8D%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/414009/%E3%80%90%E6%A8%B1%E8%90%BD%E7%BD%91%E3%80%91%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E5%8D%B0%E5%BA%A6.meta.js
// ==/UserScript==



//屏蔽词列表。
//屏蔽词的双引号为英文半角引号，逗号也是，请勿忘记加逗号。
    var blackList = [
        "印度",
    ];

(function(){
    var target = document.querySelectorAll("div.asmimgp5-m1");

    for (var i = 0;i < target.length; i++){
        if (target[i].querySelectorAll("div.txtbox>div.tt>h3>a")[0] != null){
            var node = target[i].querySelectorAll("div.txtbox>div.tt>h3>a")[0];

            for (var j = 0 ;j < blackList.length; j++){
                if (node.innerHTML.indexOf(blackList[j]) > -1){
                    target[i].remove();
                }
            }
        }
    }
})();
