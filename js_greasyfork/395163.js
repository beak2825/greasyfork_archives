// ==UserScript==
// @name         游戏蛮牛 - Unity手册页面增强
// @namespace    游戏蛮牛页面增强
// @version      1.2.1
// @icon         https://i.postimg.cc/8PX6jtxn/manual-Helper.png
// @description  Unity手册文档左侧导航添加红色标记，添加历史查看位置
// @author       曦源 <1724464648@qq.com>
// @match        *://docs.manew.com/Manual/index.htm
// @match        *://docs.manew.com/Components/index.htm
// @match        *://docs.manew.com/Script/index.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395163/%E6%B8%B8%E6%88%8F%E8%9B%AE%E7%89%9B%20-%20Unity%E6%89%8B%E5%86%8C%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/395163/%E6%B8%B8%E6%88%8F%E8%9B%AE%E7%89%9B%20-%20Unity%E6%89%8B%E5%86%8C%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //用户手册 Manual
    //组件手册 Components
    //脚本手册 Script

    //1. 左侧菜单点击标注逻辑
    //2. 根据右侧标题，查找左侧菜单位置，使用红色表明
    //3. 刷新导致页面回到 序言位置，使用本地存储添加上次查看位置
    //4. 搜索框点击按钮，对应上左侧菜单索引
    //5. 内容页面的链接点击，需要左侧菜单定位
    //6. 右侧菜单点击后，左侧有对应地址，但是右侧链接无效，帮助跳转到左侧菜单



    var menuFrame = frames["left"]; //左侧页面iframe
    var bodyFrame = frames["body"]; //右侧页面iframe

    var pageName = getPageName(); //手册类型
    var menuData = getMenuData(); //菜单列表

    var notfoundLink = ""; //临时存储 404 页面的地址，不确定左侧存不存在有效地址，需要点击一次来判断

    //左侧iframe
    var lf = document.getElementsByName("left")[0];
    lf.onload = function () {
        //临时存储，菜单 - 地址
        saveMenuData();

        //左侧菜单
        var menuDiv = menuFrame.document.getElementsByClassName("publicMenu")[0].getElementsByTagName("a");

        //添加点击事件
        menuBinding(menuDiv);

        //页面加载完，检查用户是否在页面记载前点击了菜单，如果点击了，右侧标题就不是序言
        var title = bodyFrame.document.getElementsByClassName("layout")[0].childNodes[1].textContent;
        if (title == "序言") {
            var cheatsheet = menuFrame.document.children[0].childNodes[2].childNodes[10].childNodes[2];
            //本次位置，添加颜色，添加标记
            cheatsheet.style.color = 'red';
            cheatsheet.classList.add('lastclick');
        }

        //搜索框点击事件
        var btnso = menuFrame.document.getElementById("butsoso");
        btnso.onclick = function () {
            var searchKey = menuFrame.document.getElementById("query").value;
            //根据关键字查询左侧菜单，非空检查
            if (searchKey.replace(/(^\s*)|(\s*$)/g, "") != "") {
                var keyUrl = searchKey + ".html";
                var menuValue = menuData[keyUrl];

                //搜索跳转定位
                bodyToLeftItem(menuValue, false);
            }
        };

        //获取上次阅读记录
        var lastReadUrl = getLastReadUrl();
        var lastReadText = getLastReadText();

        if (lastReadUrl != null) {
            var top = menuFrame.document.getElementById("closeAll").parentNode;

            //不能用 innerHTML 附加，会覆盖掉页面上折叠和关闭的事件
            var split = document.createElement('span');
            split.className = 'appentCotent';
            split.innerText = ' | ';
            top.appendChild(split);

            var a = document.createElement('a');
            a.className = 'appentCotent';
            a.href = lastReadUrl;
            a.title = lastReadText;
            a.target = "body";
            a.innerText = '上次查阅位置';
            a.id = 'targetLastRead';
            a.style.color = "blue";
            top.appendChild(a);

            var space = document.createElement('span');
            space.className = 'appentCotent';
            space.innerText = " ";
            top.appendChild(space);

            var clear = document.createElement('a');
            clear.className = 'appentCotent';
            clear.id = 'clearHistory';
            clear.href = 'javascript:void(0)';
            clear.innerText = "[清空]";
            clear.style.color = "blue";
            top.appendChild(clear);



            var lastRead = menuFrame.document.getElementById("targetLastRead");
            lastRead.onclick = function () {
                //上次阅读定位
                bodyToLeftItem(lastReadText, true);

            };

            var clearlink = menuFrame.document.getElementById("clearHistory");
            clearlink.onclick = function () {
                delHistory();
            };
        }


        //为序言添加点击事件，点击序言清空菜单项选中样式，清空上次浏览记录
        var cheatsheet2 = menuFrame.document.children[0].childNodes[2].childNodes[10].childNodes[2];
        cheatsheet2.onclick = function () {
            var lastClick = menuFrame.document.getElementsByClassName("lastclick")[0];
            if (lastClick != undefined) {
                //变回原来的颜色
                lastClick.style.color = '#333';
                //删除标记
                lastClick.classList.remove('lastclick');
                //删除上次浏览记录和标记
                delLastRead();

                //本次位置，添加颜色，添加标记
                cheatsheet2.style.color = 'red';
                cheatsheet2.classList.add('lastclick');

            }
        };
    }


    //右侧iframe
    var bd = document.getElementsByName("body")[0];
    bd.onload = function () {
        //右侧内容页面加载完毕
        //如果页面为 404 no found 点击左侧菜单
        var centers = bodyFrame.document.body.getElementsByTagName('center');
        if (centers != undefined && centers.length > 0) {
            var centertxt = centers[0].textContent;
            if (centertxt == '404 Not Found') {
                //右侧网页找不到
                var lefta = menuFrame.document.getElementsByClassName("lastclick")[0];
                var leftLink = lefta.href;
                if (checkLoseLink(leftLink)) {
                    //查找存储的失效链接，如果找到，直接 return
                    return;
                } else {
                    if (notfoundLink == '') {
                        //如果找不到，notfoundLink = '' , 左侧菜单再次点击一次，
                        lefta.click();
                    } else if (notfoundLink == leftLink) {
                        //如果 notfoundLink = 左侧菜单链接，存储的失效链接 notfoundLink = '' ，return
                        notfoundLink = '';
                        saveLoseLink(leftLink);
                        return;
                    }
                }
            }
        } else {
            notfoundLink = "";
            //内容页面内链接，如果能匹配到菜单，左侧菜单定位
            var aList = bodyFrame.document.getElementsByClassName("layout")[0].getElementsByTagName("a");
            for (let i = 0; i < aList.length; i++) {
                aList[i].onclick = function () {
                    //根据链接查询左侧菜单名称
                    var keyUrl = aList[i].href.replace('http://docs.manew.com/' + pageName + '/', '');
                    var menuValue = menuData[keyUrl];
                    if (menuValue != undefined) {
                        //一选方案
                        bodyToLeftItem(menuValue, false);
                    } else {
                        //二选方案
                        //部分情况下，右侧的链接 和 左侧菜单的链接不一致，但是两者的名称一样
                        var aName = aList[i].textContent;
                        bodyToLeftItem(aName, false);
                    }
                };
            }
        }


    };


    //删除附加内容和文字提示
    function delHistory() {
        //删除当前附加的内容
        var top = menuFrame.document.getElementById("closeAll").parentNode;
        var appendClass = menuFrame.document.getElementsByClassName("appentCotent");
        while (appendClass.length > 0) {
            top.removeChild(appendClass[0]);
        }

        //删除存储
        delLastRead();
    }


    //为菜单项添加点击事件，重置颜色，添加颜色，记录点击位置
    function menuBinding(menuDiv) {
        for (let i = 0; i < menuDiv.length; i++) {
            if (menuDiv[i].href != 'javascript:void(0)') {
                menuDiv[i].onclick = function () {
                    //找到上次点击的位置
                    var lastClick = menuFrame.document.getElementsByClassName("lastclick")[0];
                    if (lastClick != undefined) {
                        //变回原来的颜色
                        lastClick.style.color = '#333';
                        //删除标记
                        lastClick.classList.remove('lastclick');

                        //删除上次查看
                        delHistory();
                    }

                    //本次位置，添加颜色，添加标记
                    menuDiv[i].style.color = 'red';
                    menuDiv[i].classList.add('lastclick');

                    //todo 更新上次浏览
                    updateLastRead(menuDiv[i].href, menuDiv[i].innerText);


                }
            }
        }


    }

    //更新上次浏览位置
    function updateLastRead(lastReadUrl, title) {
        localStorage.setItem(pageName + "_PageHelper_lastRead_Url", lastReadUrl.replace('http://docs.manew.com/' + pageName + '/', ''));
        localStorage.setItem(pageName + "_PageHelper_lastRead_Text", title);
    }

    //删除上次浏览位置
    function delLastRead() {
        localStorage.removeItem(pageName + "_PageHelper_lastRead_Url");
        localStorage.removeItem(pageName + "_PageHelper_lastRead_Text");
    }

    //获取上次浏览记录地址
    function getLastReadUrl() {
        return localStorage.getItem(pageName + "_PageHelper_lastRead_Url");
    }

    //获取上次浏览记录名称
    function getLastReadText() {
        return localStorage.getItem(pageName + "_PageHelper_lastRead_Text");
    }

    //存储 菜单 - 地址
    function saveMenuData() {
        if (localStorage.getItem(pageName + "_menu_info") == null) {
            var menuDiv = menuFrame.document.getElementsByClassName("publicMenu")[0].getElementsByTagName("a");
            var data = {};
            for (let i = 0; i < menuDiv.length; i++) {
                if (menuDiv[i].href != 'javascript:void(0)') {
                    var k = menuDiv[i].href.replace('http://docs.manew.com/' + pageName + '/', '');
                    var v = menuDiv[i].textContent.replace('  ', ''); //去掉空白字符
                    data[k] = v;
                }
            }
            localStorage.setItem(pageName + "_menu_info", JSON.stringify(data));
            menuData = data;
        }
    }

    //获取 菜单 - 地址
    function getMenuData() {
        var str = localStorage.getItem(pageName + "_menu_info");
        return JSON.parse(str);
    }

    //根据跳转 定位 左侧菜单
    //1. 搜索后定位
    //2. 上次阅读定位
    function bodyToLeftItem(rightTitleName, delHistory) {
        //找到上次点击的位置
        var lastClick = menuFrame.document.getElementsByClassName("lastclick")[0];
        if (lastClick != undefined) {
            //变回原来的颜色
            lastClick.style.color = '#333';
            //删除标记
            lastClick.classList.remove('lastclick');
        }

        //全部折叠
        menuFrame.document.getElementById("closeAll").click();

        var top = menuFrame.document.getElementById("closeAll").parentNode;
        //标记红色，更新浏览记录
        var menuDiv = menuFrame.document.getElementsByClassName("publicMenu")[0].getElementsByTagName("a");

        var issuccess = false;
        for (let i = 0; i < menuDiv.length; i++) {
            var menuItem = menuDiv[i].textContent.replace('  ', ''); //去掉空格
            if (menuItem != '' && menuItem == rightTitleName) { //判断名称相同，或者关键字部分相同（个别情况）
                toLeftMenu(menuDiv[i], rightTitleName);
                issuccess = true;
                break;
            }
        }

        if (!issuccess) { //如果全文匹配失败，尝试关键字部分匹配
            for (let i = 0; i < menuDiv.length; i++) {
                var menuItem = menuDiv[i].textContent.replace('  ', ''); //去掉空格
                if (menuItem != '' && (menuItem.indexOf(rightTitleName) != -1 || rightTitleName.indexOf(menuItem) != -1)) { //判断名称相同，或者关键字部分相同（个别情况）
                    toLeftMenu(menuDiv[i], rightTitleName);
                    break;
                }
            }
        }


        //删除当前附加的内容
        var appendClass = menuFrame.document.getElementsByClassName("appentCotent");
        while (appendClass.length > 0) {
            top.removeChild(appendClass[0]);
        }

        if (delHistory) {
            //删除存储
            delLastRead();
        }

    }

    //左侧菜单定位的详细逻辑
    function toLeftMenu(menuItem, rightTitleName) {
        //本次位置，添加颜色，添加标记
        menuItem.style.color = 'red';
        menuItem.classList.add('lastclick');

        //更新上次浏览记录
        updateLastRead(menuItem.href, rightTitleName);

        //根据定位的位置，查找出对应节点，如果是父节点（最外级）不管，如果在子级，展开它的所有父级
        var parent = menuItem;
        var parentName = parent.className;
        while (parentName != "publicMenu") {
            parent = parent.parentNode;
            parentName = parent.className;
            var child = parent.childNodes;

            var checkIcon = false;
            for (let j = 0; j < child.length; j++) {
                if (child[j].nodeName == "I") {
                    checkIcon = true;
                    break;
                }
            }

            if (checkIcon) {
                for (let j = 0; j < child.length; j++) {
                    if (child[j].nodeName == "I") {
                        // 折叠按钮展开 i 中 a 中 img
                        child[j].childNodes[2].childNodes[0].setAttribute("src", "../images/minusbottom.gif");
                        continue;
                    }

                    if (child[j].nodeName == "IMG") {
                        //书展开
                        child[j].setAttribute("src", "../images/folderopen.gif");
                        continue;
                    }

                    if (child[j].nodeName == "UL") {
                        //子项展开
                        child[j].style.display = "block";
                        continue;
                    }

                }
            }

        };
    }

    //获取当前是哪种手册
    function getPageName() {
        var url = window.location.href;
        switch (url) {
            case "http://docs.manew.com/Manual/index.htm":
                return "Manual";
            case "http://docs.manew.com/Components/index.htm":
                return "Components";
            case "http://docs.manew.com/Script/index.htm":
                return "Script";
        }
    }

    //保存无效地址
    function saveLoseLink(lostLink) {
        var linkArray = getLoseLink();
        if (linkArray == null) {
            var array = [lostLink];
            localStorage.setItem(pageName + "_loseLink_Array", JSON.stringify(array));
        } else {
            linkArray.push(lostLink);
            localStorage.setItem(pageName + "_loseLink_Array", JSON.stringify(linkArray));
        }

    }

    //读取无效地址
    function getLoseLink() {
        var loaseLinkArrayStr = localStorage.getItem(pageName + "_loseLink_Array");
        return JSON.parse(loaseLinkArrayStr);
    }

    //判断无效地址是否存在
    function checkLoseLink(checkUrl) {
        var linkArray = getLoseLink();
        if (linkArray == null) { return false; }
        for (let i = 0; i < linkArray.length; i++) {
            if (linkArray[i] == checkUrl) {
                return true;
            }
        }
        return false;
    }

})();
