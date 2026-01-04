// ==UserScript==
// @name         起点pc阅读全屏
// @license      Apache License 2.0
// @namespace    https://www.52dzd.com/
// @version      1.0
// @description  make qidian read with fullwidth
// @author       xyfy
// @match        https://read.qidian.com/chapter/*
// @match        https://www.qidian.com/chapter/*
// @match        https://vipreader.qidian.com/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466427/%E8%B5%B7%E7%82%B9pc%E9%98%85%E8%AF%BB%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/466427/%E8%B5%B7%E7%82%B9pc%E9%98%85%E8%AF%BB%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var oldContainer=document.getElementById("j-mainReadContainer");
    if(oldContainer){
        oldVersion();
    }
    else{
        setTimeout(()=>{
            dofit()
            // 选择需要观察变动的节点
            let sidesheet=document.querySelector("#side-sheet");
            //console.debug(sidesheet);
            // 观察器的配置（需要观察什么变动）
            const config = {attributes:false,childList: true,subtree:false};
            // 当观察到变动时执行的回调函数
            const callback = function(mutationsList, observer) {
                console.debug(mutationsList,observer)
                // Use traditional 'for loops' for IE 11
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        //for (const node of sidesheet.childNodes) {
                        //console.debug(node);
                        //console.debug(sidesheet.childNodes);
                        // Do something with each child as children[i]
                        // NOTE: List is live! Adding or removing children will change the list's `length`
                        //}
                        //console.debug('监听子节点新增删除',sidesheet.fistChild,sidesheet.firstElementChild);

                        if(sidesheet.firstElementChild===null){
                            dofit();
                        }
                    }
                    else if (mutation.type === 'attributes') {
                        console.debug(sidesheet.style.width)
                        console.debug('The ' + mutation.attributeName + ' attribute was modified.');
                    }
                }
            };

            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver(callback);
            // 以上述配置开始观察目标节点
            observer.observe(sidesheet, config);
        },1000);
    }
    function oldVersion(){
        document.getElementById("j_chapterBox").style.width='100%';
        document.getElementById("j-mainReadContainer").style.width='100%';
        document.getElementById("j_readMainWrap").style.width='100%';
        document.getElementById("j_leftBarList").style.left='0';
        document.getElementById("j_leftBarList").style.marginLeft='0';
        document.getElementById("j_rightBarList").style.right='0';
        document.getElementById("j_rightBarList").style.marginRight='0';

        var x = document.getElementsByClassName("guide-btn-wrap");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].remove();
        }
    }
    var isHidden = function(element) {
        return (element.offsetParent === null);
    };
    function dofit(){
        var left= document.getElementById("left-container");
        //console.debug(left);
        //left.remove();
        var reader=document.getElementById("reader");
        reader.style="--width: 90%; --side-width: 0px;";
        var chapterlist= document.getElementById("chapter-list");

        chapterlist.parentNode.style="width:1280px;display:none";
    }

})();