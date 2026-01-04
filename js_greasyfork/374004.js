// ==UserScript==
// @name         lark-dev-helper
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  开发工具
// @author       150908
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @match        http://0.0.0.0:3000/*
// @match        *://localhost/*
// @match        *://larkportal.taobao.net/*
// @match        *://*.yuekeyun.com/*
// @match        *://*.yuekeyun.com/*
// @include      *://*
// @downloadURL https://update.greasyfork.org/scripts/374004/lark-dev-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/374004/lark-dev-helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 没办法匹配ip
    if(document.title.indexOf('凤凰云智') > -1 || document.title.indexOf('云智小二平台') > -1){
        function getRESTServer(tag = null) {
            if (tag == null) {
                return;
            }
            fetch(
                `https://mocks.alibaba-inc.com/mock/666/ysp/rest.json?_tag=${tag}`,
            ).then((res) => {
                if (res.ok && res.status == 200) {
                    res.text().then((data) => {
                        // console.log("receive= ", data,typeof (data));
                        data = JSON.parse(data);
                        if ('success' in data && 'code' in data) {
                            console.warn('加载rest服务器列表失败');
                            return;
                        }
                        switchENV(data);
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    });
                } else {
                    console.warn('加载rest服务器列表失败');
                }
            });
        }
        function changeRESTServer() {
            const config = prompt('切换到哪个REST配置？\n日常：aone-daily\n预发：pre\n生产：prod', 'aone-daily');
            config && getRESTServer(config);
        }
        function addNewTab(route = '', title) {
            const tabs = JSON.parse(sessionStorage.tabs || '[]');
            tabs.forEach(item => item.classname = '');// clean classname
            let to = route[0] === '/' ? route : `/${route}`; // if route start without / ,added
            to=to.split('');
            to[1] = to[1].toLowerCase();// the first letter of route must be lowcase
            to = to.join('');
            const target = tabs.find(item => item.to.includes(route));

            if (target) {
                target.classname = 'current';
            } else {
                tabs.push({
                    title: title || `调试Tab${moment().format('YYYYMMDDHHmmss')}`,
                    to,
                    classname: 'current',
                });
            }

            if(tabs.length > 10) {
                tabs.shift();
            }
            sessionStorage.tabs = JSON.stringify(tabs);
            setTimeout(() => {
                location.href= '/';
            }, 1000);
        }
        function askAddNewTab() {
            const config = prompt('输入路由添加Tab,如：/dashboard/index');
            config && addNewTab(config);
        }

        function forceReboot() {
            // incase of An emergency
            localStorage.clear();
            sessionStorage.clear();
            setTimeout(() => {
                location.reload(true);
            }, 50);
        }

        const aoneAPI2AppName = {
            'lark-biprod': ['biprod'],
            'lark-acl-2': ['acl'],
            'lark-itemprod': ['itemprod', 'filmmuseum'],
            'lark-umprod': ['umprod'],
            'lark-cinemaprod': ['cinemaprod'],
            'lark-tradeprod': ['tradeprod'],
            'lark-finance-2': ['finance'],
            'lark-larkportal': ['larkportal'],
            'lark-goodsprod': ['goodsprod'],
            'lark-adprod': ['adprod'],
            'lark-hoprod': ['hoprod'],
            'lark-bmng': ['bmng'],
        };

        function switchENV(o) {
            for (const a in o) {
                localStorage[a] = o[a];
            }
            console.log('覆盖REST配置完成✓');
        }

        function getAoneTestServer(tag = null) {
            if (tag == null) {
                return;
            }
            fetch(
                `https://larkportal.taobao.net/aone/machineConnector?id=${tag.trim()}`,
            ).then((res) => {
                if (res.ok && res.status == 200) {
                    res.text().then((data) => {
                        data = JSON.parse(data);
                        if (!data.ok) {
                            console.warn('加载aone环境失败');
                            return;
                        }
                        const envdata = {};
                        data.data.apps.map((item) => {
                            if (item.app_name in aoneAPI2AppName) {
                                aoneAPI2AppName[item.app_name].map((item2) => {
                                    envdata[item2] = `http://${item.addresses[0]}`;
                                });
                            }
                        });
                        console.log('envdata', envdata);
                        console.log(data.data.apps);

                        let targetFE = data.data.apps.find(item => item.app_name == 'lark-larkportal-front-2');
                        if (!targetFE) {
                            switchENV(envdata);
                            setTimeout(() => {
                                location.search.includes('a=') ? location.href = location.origin : location.reload();
                            }, 1000);
                            return;
                        }
                        targetFE = targetFE.addresses[0];
                        if (location.host == targetFE) {
                            switchENV(envdata);
                            setTimeout(() => {
                                location.search.includes('a=') ? location.href = location.origin : location.reload();
                            }, 1000);
                        } else if (confirm(`该联调标签的前端地址是：${targetFE} 点【确定】跳转到该地址，本地调试点【取消】`)) {
                            location.href = `http://${targetFE}?a=${tag}`;
                        } else {
                            switchENV(envdata);
                            setTimeout(() => {
                                location.search.includes('a=') ? location.href = location.origin : location.reload();
                            }, 1000);
                        }
                    });
                } else {
                    console.warn('加载aone环境失败');
                }
            });
        }

        function changeToken() {
            var token = prompt('输入accessToken');
            if(token){
                sessionStorage.access_token=token
                // sessionStorage.access_token = 'EB64BA13CF72F25E688F34E312F50D0BEB64BA13CF72F25E688F34E312F50D0B';
                sessionStorage.tabs='[{"title":"工作台","to":"/dashboard/index","classname":"current","tipType":"工作台","location":"工作台"}]';
                location.reload();
            }
        }
        function report(msg, file, line, column, error) {

            return;
            fetch('http://localhost:3000/tools/dingTalkProxy', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({msg,href: location.href, file, line, column, error}),
            });
        }

        window.addEventListener('unhandledrejection', (evt) => {
            console.log('=============2111')
            if (evt && evt.reason && evt.reason.toString().includes('getHostNode')) {
                report('getHostNode','','','',evt.reason);
                debugger;
            }
        });
        console.log('=============bind onerror')

        window.onerror = function(msg, file, line, column, error){
            console.log('=============error',msg, error)
            report(msg, file, line, column, error);
            clearInterval(window.timer);
        }

        function initOpenTabTest() {
            var items = $('.nav-list-outer span.item');
            var len = items.length;
            sessionStorage.setItem('helper-tabLen', len);
            sessionStorage.setItem('helper-tabIndex', 0);
            sessionStorage.setItem('helper-tabOpenTest', 'true');

        }
        function testOpenTab() {
            try {
                var tabLen = +sessionStorage.getItem('helper-tabLen');
                var tabIndex = +sessionStorage.getItem('helper-tabIndex');
                var items = $('.nav-list-outer span.item');

                if (tabIndex < tabLen && sessionStorage.getItem('helper-tabOpenTest')=== 'true'){
                    items[tabIndex].click();
                    sessionStorage.setItem('helper-tabIndex', tabIndex+1);
                    ctrlTabsLen();
                } else {
                    sessionStorage.setItem('helper-tabOpenTest', 'false');
                    clearInterval(window.timer);
                }
            } catch (e){
                sessionStorage.setItem('helper-tabOpenTest', 'false');
                clearInterval(window.timer);
            }
        }

        function ctrlTabsLen() {
            var tabs = sessionStorage.getItem('tabs') || '[]';
            tabs = JSON.parse(tabs);
            if(tabs.length > 2){
                $($('.tabs img').get(2)).click();
            }
        }

        var box = $('<div style="position: absolute;right: 0;top: 29px;z-index: 9999;padding: 2px;background-color: #ccc;"></div>');
        var toggleBtn=$('<div style="cursor:pointer;color:blue;">~~</div>');
        toggleBtn.bind('click', function(){
            var val = GM_getValue('helper-visible', false);
            GM_setValue('helper-visible', !val)
            $('button', box).toggle(!val);
        })



        var aoneDebugBtn = $('<div><button style="padding: 3px 5px;">aone联调</button></div>');
        aoneDebugBtn.bind('click', function () {
            var config = prompt('输入aone联调标签');
            config && getAoneTestServer(config);
        });
        var clearBtn = $('<div><button style="padding: 3px 5px;">清storage</button></div>');
        clearBtn.bind('click', function() {
            forceReboot();
        })
        var addTabBtn = $('<div><button style="padding: 3px 5px;">增加tab</button></div>');
        addTabBtn.bind('click', function(){
            askAddNewTab();
        })
        var restBtn = $('<div><button style="padding: 3px 5px;">切rest</button></div>');
        restBtn.bind('click', changeRESTServer);
        var tokenBtn = $('<div><button style="padding: 3px 5px;">换token</button></div>');
        tokenBtn.bind('click', changeToken);
        var openTabTestBtn = $('<div><button style="padding: 3px 5px;">测试一级路由</button></div>');
        openTabTestBtn.bind('click', function(){
            initOpenTabTest();
            clearInterval(window.timer);
            window.timer = setInterval(testOpenTab, 3000);
        });

        box.append(clearBtn);
        box.append(restBtn);
        box.append(aoneDebugBtn);
        box.append(addTabBtn);
        box.append(tokenBtn);
        box.append(openTabTestBtn);

        box.append(toggleBtn);

        $('body').append(box);

        var val = GM_getValue('helper-visible', false);
        $('button', box).toggle(val);
    }
})();
