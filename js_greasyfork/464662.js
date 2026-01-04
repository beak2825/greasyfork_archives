// ==UserScript==
// @name         APPLE自动选中过期TF
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于自动勾选TF包注册时间超过90天的用户，注意：最好在点击编辑按钮后再进行勾选，选中后需要手动下滑来加载更多用户列表
// @author       xiangjuncheng
// @match        https://appstoreconnect.apple.com/apps/*/testflight/testers
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464662/APPLE%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E8%BF%87%E6%9C%9FTF.user.js
// @updateURL https://update.greasyfork.org/scripts/464662/APPLE%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E8%BF%87%E6%9C%9FTF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var startObserve = false;
    var observerList = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            select();
        });
    });
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 检查是否有新的节点被添加
            //console.log(mutation);
            if (mutation.addedNodes.length > 0) {
                // 遍历所有添加的节点
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var newNode = mutation.addedNodes[i];
                    //console.log(newNode);

                    // 检查新节点是否为我们想要的元素
                    if (newNode.className == "resize-triggers") {
                        // 在此处执行您的脚本
                        console.log("Element found!");
                        // 停止观察
                        observer.disconnect();
                        var checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = 'over-90-days-checkbox';

                        var label = document.createElement('label');
                        label.htmlFor = 'over-90-days-checkbox';
                        label.appendChild(document.createTextNode('选中超过90天用户'));

                        checkbox.addEventListener('change', function() {
                            if (this.checked) {
                                select();
                                var list = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
                                var config = { attributes: true, childList: true, characterData: true };
                                observerList.observe(list, config);
                            } else {
                                observerList.disconnect();
                            }
                        });

                        document.getElementsByClassName(
                            "tb-default-theme buttons___1H5xc"
                        )[0].insertAdjacentElement('afterbegin',label);
                        document.getElementsByClassName(
                            "tb-default-theme buttons___1H5xc"
                        )[0].insertAdjacentElement('afterbegin',checkbox);


                    }
                }
            }
        });
    });

    var event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    //选中超过90天的用户
    function select(){
        var target = document.getElementsByClassName(
            "ReactVirtualized__Table__row selectable"
        );
        for (var j = 0; j < target.length; j++) {
            var element = target[j];
            if(element.children[1].innerText=="公开链接" && element.className == "ReactVirtualized__Table__row selectable"){
                var date = element.children[3].children[0].children[0].children[1].innerText;
                if(isOver90Days(date)){
                    element.dispatchEvent(event);
                }
            }
        }
    }
    // 配置观察选项
    var config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
    };

    // 开始观察body元素
    observer.observe(document.body, config);


    function isOver90Days(dateString) {
        var dateParts = dateString.match(/(\d+)年(\d+)月(\d+)日/);
        var date = new Date(dateParts[1], dateParts[2] - 1, dateParts[3]);
        var today = new Date();
        var timeDiff = today.getTime() - date.getTime();
        var dayDiff = timeDiff / (1000 * 3600 * 24);
        return dayDiff > 90;
    }
})();