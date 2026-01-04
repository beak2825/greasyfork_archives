// ==UserScript==
// @name         虎扑引用楼层内容过长自动折叠
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  虎扑引用楼层内容过长自动折叠，v0.2增加展开和收起按钮，v0.3超过一定长度才会折叠,v0.4折叠标题内容
// @author       zerozz
// @match        https://bbs.hupu.com/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375157/%E8%99%8E%E6%89%91%E5%BC%95%E7%94%A8%E6%A5%BC%E5%B1%82%E5%86%85%E5%AE%B9%E8%BF%87%E9%95%BF%E8%87%AA%E5%8A%A8%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/375157/%E8%99%8E%E6%89%91%E5%BC%95%E7%94%A8%E6%A5%BC%E5%B1%82%E5%86%85%E5%AE%B9%E8%BF%87%E9%95%BF%E8%87%AA%E5%8A%A8%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function onClickExpand() {
        var ele = document.getElementById("expandBtn" + this.id.charAt(this.id.length - 1));
        if (this.innerText == "展开") {
            this.parentNode.previousElementSibling.style.maxHeight = "none";
            this.innerText = "收起";
        } else {
            this.parentNode.previousElementSibling.style.maxHeight = "100px";
            this.innerText = "展开";
        }
    }

    function reduceSize(bqEleArr, i, allsize) {
        var donesize = i;
        for (; i < allsize; i++) {
            var bqEle = bqEleArr[i - donesize];
            if (bqEle.offsetHeight && bqEle.offsetHeight > 200) {
                bqEle.style.cssText='max-height: 100px; overflow: hidden; transition: max-height 2s ease 0s;';

                var expandParentEle = document.createElement("div");
                expandParentEle.id = "expandParentEle" + i;
                expandParentEle.style.cssText = "text-align: center;padding: 10px;";

                var expandEle = document.createElement("span");
                expandEle.id = "expandBtn" + i;
                expandEle.style.cssText = "color:#108089;cursor: pointer;padding: 4px 7px;border-radius: 3px;border-width: 1px;border-style: solid;border-color: rgb(166, 166, 166);transition: all 0.1s ease 0s;";
                expandEle.innerText = "展开";
                expandEle.onclick = onClickExpand;
                expandParentEle.appendChild(expandEle);

                var parent = bqEle.parentNode;
                if (parent.lastChild == bqEle) {
                    parent.appendChild(expandParentEle);
                } else {
                    parent.insertBefore(expandParentEle, bqEle.nextSibling)
                }
            }
        }

        return i;
    }


    setTimeout(function() {
        var titleEleArr = document.getElementsByClassName("thread-content-detail") || [];
        var i = 0;
        var size = titleEleArr.length;
        i = reduceSize(titleEleArr, i, size);
    }, 1500);
})();