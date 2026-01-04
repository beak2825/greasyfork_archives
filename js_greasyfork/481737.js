// ==UserScript==
// @name         show IP
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  提高效率
// @author       wz
// @match        https://*.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481737/show%20IP.user.js
// @updateURL https://update.greasyfork.org/scripts/481737/show%20IP.meta.js
// ==/UserScript==

(function () {
    console.log("hello-1");

    // 文件上传页面的函数
    setTimeout(clickShow, 600);
    setTimeout(showIp, 1000);
    // setTimeout(repeatFunction, 2000);
    //
    // // 轮询检查右侧标签页的更新
    // function repeatFunction() {
    //     refreshText();
    //     setTimeout(repeatFunction, 1000);
    // }

    var initialTabCount = 4;

    // 命令行页面的函数
    function refreshText() {
        var ul1 = document.querySelector("#AssetTree_1_ul");
        var ul2 = document.querySelector("#AssetTree_2_ul");
        if(ul1 != null){
            var liCount = ul1.querySelectorAll('li').length + ul2.querySelectorAll('li').length;

            for (var i = 1; i < 50; i++) {
                var rightTab = exist("#View_" + i + " > span");
                if (rightTab) {
                    var rightItem = exist("#View_" + i + " > span");
                    var rightTitle = rightItem.title;

                    for (var j = 1; j < liCount + 1; j++) {
                        var leftCss = "#AssetTree_" + j + "_a";
                        var leftNameCss = "#AssetTree_" + j + "_span";

                        var leftTitle = document.querySelector(leftNameCss).textContent;

                        var leftCssTitle = document.querySelector(leftCss).title;
                        if (leftTitle === rightTitle && document.querySelector("#View_" + i + " > span").innerHTML !== leftCssTitle) {
                            // console.log("rightTitle: "+rightTitle);
                            document.querySelector("#View_" + i + " > span").innerHTML = leftCssTitle;
                        }
                    }
                }

            }
        }

    }


    // 命令行页面的函数
    function replaceText() {

        var ul1 = document.querySelector("#AssetTree_1_ul");
        var ul2 = document.querySelector("#AssetTree_2_ul");
        if(ul1 != null){
            var liCount = ul1.querySelectorAll('li').length + ul2.querySelectorAll('li').length;

            // var ulTab = document.querySelector("#content > div.tab-bar > div.tabs > ul");
            // var tabCount = ulTab.querySelectorAll('elements-content-tab').length;
            // console.log(liCount);
            // console.log(tabCount);

            for (var i = 1; i < 50; i++) {
                var rightTab = exist("#View_" + i + " > span");
                if (rightTab) {
                    var rightItem = exist("#View_" + i + " > span");
                    var rightName = rightItem.textContent.trim();

                    for (var j = 1; j < liCount + 1; j++) {
                        var leftCss = "#AssetTree_" + j + "_a";
                        var leftNameCss = "#AssetTree_" + j + "_span";

                        var leftName = document.querySelector(leftNameCss).textContent;

                        if (leftName === rightName) {
                            console.log("leftName: "+leftName);
                            // 将右侧tab元素（带序号）的内容，替换为左侧某css（带序号）元素的title
                            document.querySelector("#View_" + i + " > span").innerHTML = document.querySelector(leftCss).title;
                        }
                    }
                }

            }
        }

    }

    function clickShow() {
        var elements = document.getElementsByClassName("ui-corner-all");
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute("title") === "Home/Default") {
                console.log(elements[i]);
                var list = document.getElementsByClassName("elfinder-navbar-wrapper");
                // 如果list不超过4个选项卡，则需点击展开，否则说明此前已点击过
                if (list.length <= initialTabCount) {
                    elements[i].click();

                }
            }
        }
    }

    function showIp() {
        // 列表整体
        var list = document.getElementsByClassName("elfinder-navbar-wrapper");
        for (var j = initialTabCount; j < list.length; j++) {
            //console.log(list[j]);
            // item是纯文字的上层span
            var item = list[j].getElementsByTagName('span')[0];
            var title = list[j].getElementsByTagName('span')[0].textContent;

            var ip = sessionStorage.getItem(title);

            if (ip) {
                var oldHtml = item.innerHTML;
                // item.innerHTML = oldHtml + ", " + ip;
            }
            //试验展开
            if (j == 5) {
                //item.click();
                //setTimeout(goto, 1000, item);
            }

        }
    }

    function bind() {

        const aaElements = document.querySelectorAll('.elfinder-navbar-wrapper');
        console.log("aaElements: " + aaElements.length);
        aaElements.forEach(element => {
            element.addEventListener('click', function (event) {
                if (event.target.classList.contains('ui-corner-all')) {
                    var len = this.querySelectorAll(".elfinder-navbar-wrapper").length;
                    console.log("len: " + len);
                    if (len > 5) {
                        console.log("clicked");

                        var item = this.parentNode;
                        console.log(item);
                        setTimeout(goto, 1000, item)
                        //event.stopPropagation();
                    }

                }
            });
        });
    }



    function recur(divs, objs) {
        console.log("divs: " + divs.length);
        console.log("objs: " + objs);

        var subDivs = divs;
        subDivs = divs.querySelector("div.elfinder-navbar-subtree").querySelectorAll("div.elfinder-navbar-wrapper");
        if (objs.length > 1 && divs !== undefined) {

            for (var i = 0; i < subDivs.length; i++) {
                var txt = subDivs[i].querySelector("span").textContent;
                if (txt === objs[0]) {
                    console.log("bingo! " + txt + "\n\n");
                    subDivs[i].querySelector("span").click();

                    objs.shift();
                    //setTimeout(recur, 500, subDivs[i], objs);
                }
            }
            console.log("over1");
        } else {
            console.log("over2");
        }
    }





// 展示IP
    var domain = document.domain;
    if (domain.indexOf("jms") !== -1) {
        console.log("observe on");

        const observer = new MutationObserver((mutationsList, observer) => {

            // 遍历每个变化
            for (const mutation of mutationsList) {
                // replaceText();
                // 如果变化类型是childList，则表示有子元素添加或删除
                if (mutation.type === 'childList') {
                    // 检查是否有新的子元素添加到目标元素中
                    if (mutation.addedNodes.length > 0) {
                        // 遍历新添加的子元素
                        for (const addedNode of mutation.addedNodes) {

                            var pathName = window.location.pathname;
                            if (pathName === "/luna/") {
                                // 如果新添加的子元素具有目标ID，则执行相应的操作
                                if (addedNode.id === 'AssetTree_1') {
                                    clickIt('#AssetTree_1_a');
                                }
                                // 如果列表头出现，则点击，并写入文字
                                if (addedNode.id === 'AssetTree_2') {
                                    clickIt('#AssetTree_2_a');
                                    setTimeout(show, 300);
                                    // setTimeout(expand, 600);
                                }
                                // console.log(addedNode.id);
                                // console.log(addedNode.textContent);

                                if (addedNode.id != null && addedNode.textContent.indexOf('0') > -1) {
                                    replaceText();
                                }
                            }

                        }
                    }
                    if (mutation.removedNodes.length > 0) {
                        console.log("removedNodes");
                        // refreshText();
                        // 遍历删除的子元素
                        for (const removedNode of mutation.removedNodes) {
                            if (removedNode.textContent.indexOf('172') > -1) {
                            // if (removedNode.id != null && removedNode.textContent.indexOf('tabView') > -1) {
                                console.log("yes: "+removedNode.innerHTML);
                                refreshText();
                            }
                        }
                    }
                }
            }
        });

        // 开始观察指定的元素及其子元素的变化
        observer.observe(document.body, {
            childList: true, // 监听子元素的变化
            subtree: true, // 监听后代元素的变化
            characterData: true // 监听字符数据的变化
        });

    }


    function expand() {
        document.getElementById("left-side").style.flex = "0 0 calc(23%)";
    }


    function show() {
        for (var i = 1; i < 200; i++) {
            var item = $("#AssetTree_" + i + "_a");
            if (item) {
                var ip = item.attr("title");
                if (ip) {
                    var leftNameCss = "#AssetTree_" + i + "_span";
                    var leftName = document.querySelector(leftNameCss).textContent;

                    var parts = ip.split(".");
                    parts[2] = "*";
                    var newIp = parts.join(".");

                    sessionStorage.setItem(leftName, newIp);

                    const span = document.createElement('span');
                    span.innerText = ", " + ip;
                    span.style.color = "white";
                    // $("#AssetTree_"+i+"_span").after(span);
                }
            }

        }
    }

    function clickIt(obj) {
        var button1 = exist(obj);
        if (button1) {
            //console.log("click: "+obj);
            button1.click();
        }
    }


    function exist(css) {
        if (document.querySelector(css)) {
            return document.querySelector(css)
        } else {
            return false
        }
    }

})();
