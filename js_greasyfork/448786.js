// ==UserScript==
// @name         Buff Tools 网易Buff助手
// @namespace    https://github.com/hanpanapn/buff-tools
// @version      0.6.4
// @description  buff tools
// @author       hanpanpan@outlook.com
// @match        https://buff.163.com/*
// @match        https://bbs.tampermonkey.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @run-at       document-end
// @grant        none
// @notice       2022-08-09 更新了steam服务器不稳定时的提示信息被隐藏的bug，优化了查询
// @downloadURL https://update.greasyfork.org/scripts/448786/Buff%20Tools%20%E7%BD%91%E6%98%93Buff%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/448786/Buff%20Tools%20%E7%BD%91%E6%98%93Buff%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //
    function addXMLRequestCallback(callback) {
        var oldSend, i;
        if (XMLHttpRequest.callbacks) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push(callback);
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function () {
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    XMLHttpRequest.callbacks[i](this);
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }
    let addMenuItem = () => {
        let nav = document.querySelector('.nav ul')

        if (!nav) {
            return
        }
        //增加一个菜单
        let marketName = document.createElement('li')
        marketName.id = 'u_title'
        let title = document.createElement('a')

        // 菜单里面的输入框
        let inT = document.createElement('input')
        inT.id = 'inT'
        inT.style.width = '260px'
        inT.value = getQueryVariable('search') ? decodeURI(getQueryVariable('search')) : (document.title.split('_')[0] == 'CS:GO饰品市场' ? '' : document.title.split('_')[0])
        title.appendChild(inT)
        // 菜单里面的按钮
        let btnSearch = document.createElement('button')
        btnSearch.innerText = 'GO'
        btnSearch.style.width = '51px'
        btnSearch.style.height = '29px'
        btnSearch.onclick = () => {
            if (location.href.indexOf('https://buff.163.com/market/csgo#tab=selling') != -1) {
                //列表页 点击调查询方法
                let sin = document.querySelector("input[name*='search']")
                sin.value = document.getElementById('inT').value
                let btnS = document.getElementById('search_btn_csgo')
                btnS && btnS.click()
            } else {
                //从其他页面调转过来，页面会直接刷新，不用手动调查询接口
                location.href = 'https://buff.163.com/market/csgo#tab=selling&page_num=1&search=' + document.getElementById('inT').value
            }

        }
        title.appendChild(btnSearch)
        // 菜单里面的按钮
        let btnSearchIGXE = document.createElement('button')
        btnSearchIGXE.innerText = 'IGXE'
        btnSearchIGXE.style.width = '51px'
        btnSearchIGXE.style.height = '29px'
        btnSearchIGXE.onclick = () => {
            window.open('https://www.igxe.cn/market/csgo?sort=3&keyword=' + document.getElementById('inT').value, '_blank')
        }
        title.appendChild(btnSearchIGXE)


        marketName.appendChild(title)
        let u_title = document.getElementById('u_title')
        if (u_title) {
            nav.removeChild(u_title)
        }
        nav.appendChild(marketName)
    }
    let setBtnPageFun = () => {
        let page = document.querySelector('.simple-pagination')

        let goodIdDom = document.querySelector('.btn-supply-buy')
        let nav = document.querySelector('.nav ul')

        if (!goodIdDom || !page) {
            return
        }





        let btn10 = document.createElement('li')
        if (getQueryVariable('page_num') == 10) {
            btn10.classList.add('active')
        }

        let goodId = goodIdDom.getAttribute('data-goodsid')
        btn10.innerHTML = '<a href="https://buff.163.com/goods/' + goodId + '?from=market#tab=selling&page_num=10">第10页</a>'
        page.appendChild(btn10)

        let btn20 = document.createElement('li')
        if (getQueryVariable('page_num') == 20) {
            btn20.classList.add('active')
        }
        btn20.innerHTML = '<a href="https://buff.163.com/goods/' + goodId + '?from=market#tab=selling&page_num=20">第20页</a>'
        page.appendChild(btn20)

        let btn30 = document.createElement('li')
        if (getQueryVariable('page_num') == 30) {
            btn30.classList.add('active')
        }
        btn30.innerHTML = '<a href="https://buff.163.com/goods/' + goodId + '?from=market#tab=selling&page_num=30">第30页</a>'
        page.appendChild(btn30)

        let btn50 = document.createElement('li')
        if (getQueryVariable('page_num') == 50) {
            btn50.classList.add('active')
        }
        btn50.innerHTML = '<a href="https://buff.163.com/goods/' + goodId + '?from=market#tab=selling&page_num=50">第50页</a>'
        page.appendChild(btn50)
    }
    let getQueryVariable = (variable) => {

        var query = window.location.href;

        var vars = query.split("&");

        for (var i = 0; i < vars.length; i++) {

            var pair = vars[i].split("=");

            if (pair[0] == variable) { return pair[1]; }

        }

        return (false);

    }

    let fixedHeader = () => {
        //所有游戏列表 不要切换其他游戏，隐藏调
        let switcher = document.getElementById('j_game-switcher')
        switcher && switcher.remove()

        let header = document.querySelector('.header')
        header.style.position = 'fixed'
        header.style.width = '100%'
        header.style.zIndex = '99'
        header.style.background = '#1a2132'

        let msg = document.getElementById('notice-wrapper')
        if (msg) {
            msg.style.position = 'fixed'
            msg.style.zIndex = '99'
            msg.style.top = '70px'
            msg.style.width = '100%'
            msg.style.backgroundColor = '#1a2132'
        }

        let logo = document.querySelector('.logo')
        if (logo) {
            logo.style.marginLeft = 'auto'
            logo.style.marginRight = 'auto'
        }

        //.market-list 微调
        let marketlist = document.querySelector('.market-list')
        if (marketlist) {
            marketlist.style.marginTop = '40px'
        }
    }

    let setBtnPage = () => {
        addXMLRequestCallback(function (xhr) {
            xhr.addEventListener("load", function () {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseURL.indexOf('https://buff.163.com/api/market/goods/sell_order?game=csgo') != -1) {
                    setBtnPageFun()
                }
            });
        });
    }

    setBtnPage()
    fixedHeader()
    addMenuItem()
    window.addEventListener('hashchange',
        function (e) {
            console.log('url change')
            setBtnPageFun()
        }, false);

    setTimeout(() => {
        addMenuItem()
        setBtnPageFun()
    }, 1000)


})();
