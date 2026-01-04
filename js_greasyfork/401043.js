// ==UserScript==
// @name         bilibili粉丝牌排序
// @namespace    https://github.com/sion-x
// @version      0.1
// @description  根据牌子等级对bilibili佩戴中心页面的粉丝牌子进行排序
// @author       Sion
// @include      /^https?://link.bilibili.com/p/center/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401043/bilibili%E7%B2%89%E4%B8%9D%E7%89%8C%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/401043/bilibili%E7%B2%89%E4%B8%9D%E7%89%8C%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getMedalList(){
        return document.getElementsByTagName("table")[0].tBodies[0];
    }
    function getMedalLevel(medal){
        return parseInt(medal.getElementsByClassName("level")[0].innerText)
    }

    function getMedalExp(medal){
        return parseInt(medal.cells[2].innerText.split('/')[0]);
    }

    function sort(){
        var medalList = getMedalList();

        var tableNew = [];

        for (var i=0; i<medalList.rows.length; i++ ) {
            tableNew[i] = medalList.rows[i];
        }

        tableNew.sort(function(a,b){
            if(getMedalLevel(a)==getMedalLevel(b))
            {
                return getMedalExp(b) - getMedalExp(a);
            }else
            {
                return getMedalLevel(b) - getMedalLevel(a);
            }
		})

        for (i=0; i<tableNew.length; i++ ) {
                    medalList.appendChild(tableNew[i]);
        }
    }

    function contentChanged(){
        if(document.getElementsByTagName("table").length!==0){
            observer.disconnect();
            sort();
            observer.observe(document.getElementsByTagName("body")[0], {
                attributes: true,
                childList: true,
                subtree: true,})
        }
    }

    var observer = new MutationObserver(contentChanged);
    observer.observe(document.getElementsByTagName("body")[0], {
    attributes: true,
    childList: true,
    subtree: true,})

    // Your code here...
})();