// ==UserScript==
// @name         cnmooc 测验显示所有题目
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  无描述
// @author       Teruteru
// @match        https://www.cnmooc.org/examTest/stuExamList/*.mooc
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnmooc.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455981/cnmooc%20%E6%B5%8B%E9%AA%8C%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/455981/cnmooc%20%E6%B5%8B%E9%AA%8C%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let targetNode = document.querySelector('#examContentDiv');
    let observerOptions = {
        childList: true, // 观察目标子节点的变化，添加或删除
        attributes: true, // 观察属性变动
        subtree: true, //默认是false，设置为true后可观察后代节点
    }
    function callback(mutationList, observer) {
        mutationList.forEach((mutation) => {
            switch(mutation.type) {
                case 'childList':
                    //console.log(mutation);
                    break;
                case 'attributes':
                    //console.log(mutation.target.className);
                    var wrapper = document.querySelector('#practice-wrapper');
                    if (mutation.target.className === "practice-wrapper")
                    {
                        mutation.target.style.height = "auto";
                        mutation.target.addEventListener('scroll', function(e){e.stopPropagation()}, true);

                    }
                    if (mutation.target.className === "view-test practice-item"){
                        function addClass(obj, cls){
                            var obj_class = obj.className,
                                blank = (obj_class != '') ? ' ' : '';
                            obj.className = obj_class + blank + cls;
                        };
                        addClass(mutation.target, "current");
                    }
                    break;
            }
        });
    }

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);
})();