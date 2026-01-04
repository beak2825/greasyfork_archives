// ==UserScript==
// @name         Greasy Fork广告狗屏蔽
// @namespace    https://greasyfork.org/zh-CN/users/76579-%E4%BB%99%E5%9C%A3
// @version      0.1
// @description  Greasy Fork官方不封广告狗，那么我们只能自己屏蔽
// @author       仙圣
// @include      *://greasyfork.org/*/scripts*
// @downloadURL https://update.greasyfork.org/scripts/415342/Greasy%20Fork%E5%B9%BF%E5%91%8A%E7%8B%97%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/415342/Greasy%20Fork%E5%B9%BF%E5%91%8A%E7%8B%97%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

//屏蔽词列表。
//屏蔽词的双引号为英文半角引号，逗号也是，请勿忘记加逗号。
    var blackList = [
        'dfwofeibi',
    ];
function 屏蔽某人(){
    var target = document.querySelectorAll("li");

    for (var i = 0;i < target.length; i++){
        if (target[i].querySelectorAll("dd.script-list-author>span>a")[0] != null){
            var node = target[i].querySelectorAll("dd.script-list-author>span>a")[0];

            for (var j = 0 ;j < blackList.length; j++){
                //用户名在黑名单中则删掉
                if (node.innerHTML.indexOf(blackList[j]) > -1){
                    target[i].remove();
                    console.log(node);
                }
            }
        }
    }
}
setTimeout(function(){屏蔽某人();}, 2000);