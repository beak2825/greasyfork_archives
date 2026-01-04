// ==UserScript==
// @name         code-plus
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  解放鼠标，学码快人一步！ 代码随想录网站辅助工具, 支持快速跳转到指定语言类型, 跳转到leetcode对应题目, 首次打开跳转到上次位置，切换前后文章
// @author       righthan
// @license      MIT
// @match        https://*.programmercarl.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475548/code-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/475548/code-plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastKeyPressTime = 0; // 用于存储上一次按键的时间戳

    let page = document.querySelector('.page')
    let sider = document.querySelector('.page-sidebar')
    let siderLinks = document.querySelector('.sidebar-links')
    let isDoubleKeyG = false; // 标识是否是第一次按G键


    // 跳转到上次浏览的网页
    let historyPath = getCookie('history')
    // location.href条件:只在为根域名地址时跳转到历史(第一次打开的情况), 否则会导致无法跳转页面里的其他链接
    if (historyPath && location.href === 'https://www.programmercarl.com/') {
        location.href = historyPath // 因为默认不会加载侧边栏DOM, 所以第一次打开需要使用location.href来设定
        clickAndScrollNavLink(historyPath)
    } else {
        setCookie('history', location.href)
    }

    // 给导航容器列表添加监听器，检测网址变化
    siderLinks.addEventListener('click', (e) => { setCookie('history', e.target.href) })

    // 如果cookie中没有语言， 则需要设置
    let lang = getCookie('lang')
    if (!lang) {
        setCodeLanguage();
    }

    document.addEventListener("keyup", function (event) {
        // 检测是否快速连按了g开头的组合键
        const key = event.key
        if (key === 'g') {
            let currentTime = new Date().getTime(); // 更新第一次按g键的时间戳
            if (currentTime - lastKeyPressTime < 300) {
                isDoubleKeyG = true
            } else {
                isDoubleKeyG = false
            }
            lastKeyPressTime = currentTime
        }

        let currentTime = new Date().getTime(); // 获取当前时间戳
        let time = currentTime - lastKeyPressTime
        if (time < 400) { // 如果两次按键的时间间隔小于400毫秒，认为是快速连按
            switch (key) {
                case 'g':
                    lang = getCookie('lang')
                    if (isDoubleKeyG && lang) {
                        toCode(lang)
                        isDoubleKeyG = false
                    } else if (isDoubleKeyG && !lang) {
                        setCodeLanguage()
                    }
                    break
                case 'k':
                    // 跳转到上一篇文章
                    changeArticle(0)
                    break
                case 'j':
                    // 跳转到下一篇文章
                    changeArticle(1)
                    break
                case 'l':
                    toLeetCode()
                    break
                case 'c':
                    setCodeLanguage()
                    break
                case 'r':
                    toRelevant()
                    break
                case 't':
                    toTips()
                    break
                case 'h':
                    alert(`
                    code-plus是一款网页操作快捷辅助工具
                    按键及功能如下:
                    gg: 跳转到指定语言代码
                    gj: 跳转到下一篇
                    gk: 跳转到上一篇
                    gl: 跳转到leetcode页面
                    gt: 跳转到思路题目
                    gr: 跳转到相关题目
                    gc: 设置代码语言(保存在网站的cookie中)
                    gh: 显示本帮助页面
                    其他功能: 打开网页时恢复上次的进度
                    `)
                    break
            }
        }
    });

    // 跳转到指定语言的算法代码
    function toCode(langType) {
        // 获取对要滚动到的元素的引用
        let targetElement = page.querySelector('#' + langType);
        if (targetElement) { // 确保找到了元素
            // 使用scrollIntoView()方法将元素滚动到可见区域
            targetElement.scrollIntoView({
                behavior: "smooth", // 可选：使滚动平滑进行
                block: "start", // 可选：滚动到元素的顶部
            });
        } else {
            alert((langType !== 'c-2' ? langType : 'c#') + '语言的代码在此页面中不存在')
        }
    }

    // 文章跳转 flag:1表示下跳转到下一篇文章, 0表示上一篇文章
    function changeArticle(flag) {
        let optionButton = sider.querySelectorAll('div[title]')
        let path = optionButton[flag].childNodes[0].href
        setCookie('history', decodeURI(path)) // 记录路径
        clickAndScrollNavLink(decodeURI(path))
    }

    // 跳转到leetcode刷题网站
    function toLeetCode() {
        let link = page.querySelector('a[href*="leetcode"] ')
        if (link && link.href.includes('leetcode')) {
            link.click()
        } else {
            alert("当前页面可能没有LeetCode题目")
        }
    }

    // 设置代码语言
    function setCodeLanguage() {
        const supportLang = ['java', 'python', 'go', 'rust', 'javascript', 'typescript', 'swift', 'ruby', 'c', 'php', 'kotlin', 'scala', 'c#']
        let userInput = window.prompt("可能支持的语言:\n(一些语言代码不是每题都有, c++代码在靠前的位置, 不需要配置)\n" + supportLang.join('/') + "\n请输入需要快速跳转到的目标语言")

        if (userInput !== null) {
            if (supportLang.includes(userInput)) {
                // c#的id为c-2
                if (userInput === 'c#') { userInput = 'c-2' }
                setCookie('lang', userInput)
            } else {
                alert(userInput + "的语言类型似乎没有对应的代码, 请检查拼写, 并重新输入")
            }
        }
    }

    // 跳转到相关题目
    function toRelevant() {
        // 获取对要滚动到的元素的引用
        let targetElements = page.querySelectorAll('#相关题目, #相关题目推荐');
        if (targetElements.length > 0) { // 确保找到了元素
            // 使用scrollIntoView()方法将元素滚动到可见区域
            targetElements[0].scrollIntoView({
                behavior: "smooth", // 可选：使滚动平滑进行
                block: "start", // 可选：滚动到元素的顶部
            });
        } else {
            alert('无相关题目')
        }
    }

    // 跳转到思路
    function toTips() {
        // 获取对要滚动到的元素的引用
        let targetElements = page.querySelectorAll('#思路');
        if (targetElements.length > 0) { // 确保找到了元素
            // 使用scrollIntoView()方法将元素滚动到可见区域
            targetElements[0].scrollIntoView({
                behavior: "smooth", // 可选：使滚动平滑进行
                block: "start", // 可选：滚动到元素的顶部
            });
        } else {
            alert('当前页面没有思路内容')
        }
    }

    // 点击对应链接, 并且滚动侧边导航
    // 某次网站更新之后, 侧边栏导航的DOM不是加载全部, 所以只能在一个分类里面跳转了
    function clickAndScrollNavLink(path) {
        // 获取 https://www.programmercarl.com/kamacoder/xxx.html 中com之后的路径名
        const subPath = getPathAfterDomain(path)
        let targetElement = siderLinks.querySelector(`a[href*="${subPath}"]`)
        if (targetElement) { // 确保找到了元素
            targetElement.click()
            // 使用scrollIntoView() // 方法将元素滚动到可见区域
            targetElement.scrollIntoView({
                block: "start", // 可选：滚动到元素的顶部
            });
            document.querySelector('.sidebar').scrollBy({ top: -300 })
        }else{
            console.log(location.href)
            console.error('找不到目标元素')
            if( location.href !== 'https://www.programmercarl.com/'){
              alert('到达分类首部或末尾,或找不到目标元素');
            }
        }
    }

    // 获取域名之后的页面资源路径
    function getPathAfterDomain(url) {
        // 使用正则表达式匹配URL中的域名部分
        const domainRegex = /^https?:\/\/[^\/]+/;
        const match = url.match(domainRegex);

        // 如果没有匹配到域名部分,返回空字符串
        if (!match) {
            return '';
        }

        // 获取域名部分的长度
        const domainLength = match[0].length;

        // 返回URL中去除域名部分后的剩余路径
        return url.substring(domainLength);
    }

    // 解析特定的cookie值
    function getCookie(cookieName) {
        const allCookies = document.cookie;
        let name = cookieName + "=";
        let decodedCookie = decodeURIComponent(allCookies);
        let cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "";
    }

    function setCookie(key, val) {
        document.cookie = `${key}=${val}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
    }
})();