// ==UserScript==
// @name         正方教务-选课时允许展开所有课程
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow all courses to be expanded during course selection
// @author       Teruteru
// @license      MIT
// @match        https://i.sjtu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbIndex.html*
// @match        https://i.sjtu.edu.cn/xsxk/tjxkbkk_cxTjxkBkkIndex.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481934/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1-%E9%80%89%E8%AF%BE%E6%97%B6%E5%85%81%E8%AE%B8%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481934/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1-%E9%80%89%E8%AF%BE%E6%97%B6%E5%85%81%E8%AE%B8%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function callback(mutationList, observer) {
        mutationList.forEach((mutation) => {
            switch(mutation.type) {
                case 'childList':
                    //console.log(mutation);
                    break;
                case 'attributes':
                    //console.log(mutation.target.className);
                    //var wrapper = document.querySelector('#practice-wrapper');
//                     if (mutation.target.className === "panel-body table-responsive" && mutation.attributeName === 'style')
//                     {
//                         if (mutation.target.style.display === 'none')
//                         {

//                         }
//                         mutation.target.style.display = "block";
//                         mutation.target.style.height = "";
//                         mutation.target.style['padding-top'] = "";
//                         mutation.target.style['padding-bottom'] = "";
//                     }
                    if (mutation.target.classList.contains('close1')) {
                        mutation.target.classList.remove('close1'); // 去掉close1类名
                    }
                    break;
            }
        });
    }
    function sleep(time){
        return new Promise(function(resolve){
            setTimeout(resolve, time);
        });
    }
    sleep(2000).then(function(){
        let targetNode = document.querySelector('#innerContainer');
        if (targetNode == null) targetNode = document.querySelector('.tjxk_list');
        if (targetNode == null) targetNode = document.querySelector('#courseGrid');
        let observerOptions = {
            childList: false, // 观察目标子节点的变化，添加或删除
            attributes: true, // 观察属性变动
            subtree: true, //默认是false，设置为true后可观察后代节点
        }
        let observer = new MutationObserver(callback);
        observer.observe(targetNode, observerOptions);

        // 获取所有带有"close1"类名的元素
        var elements = document.querySelectorAll('.close1');

        // 遍历所有匹配的元素并移除"close1"类名
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('close1');
        }
    });

})();