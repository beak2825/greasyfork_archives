// ==UserScript==
// @name         lcap_tools
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  提供一些网页小工具，低代码开发专用
// @author       yuan longhui
// @match        *://local.zte.com.cn
// @match        *://*/*lcap*
// @match        *://*/*frontendcli*
// @match        *://*/*frontendrenderdemo*
// @match        *://*/*uac*
// @match        *://*/*ucs*
// @match        https://greasyfork.org/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAbCAYAAACJISRoAAAABHNCSVQICAgIfAhkiAAAAQtJREFUSInt1c1Kw0AUhuFTF8kFTJnAFFwKYrHQUjE0Fq2iOxG8Bn/vQ8SbEMX+oLhQ9+raXom9g0lI8roQBDdmFi0q5FsOfOdZDIdTAZAZZ27WQImUyC8ju3v7Ug1q0tva+fZ+dn4h1aAmYacreZ7/PISCPL+8orRBacPbeAyAtZaFxTpKG27v7otGUIgAbGxuo7Th4OgEgMFwhNKGVjskTdPpIA+PTyhtCMw875MJ671PtD8YudTdkCzLWFmNUNpweHyK0oZGs02SJNNDAG76w6+/UdpweXXtWnVH4jim3mihtGFpuYm11hlx3hPP86S7FomISNQJxfd91+ofWcZ/g1SgPL8lUiIF+QCIeCJE+P0wYgAAAABJRU5ErkJggg==
// @grant        GM_cookie
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/493940/lcap_tools.user.js
// @updateURL https://update.greasyfork.org/scripts/493940/lcap_tools.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(
        `.y-panel {
            width: 150px;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 32px;
            right: -150px;
            background-color: #a1d4e2;
            border-radius: 3px;
            transition: all 0.3s;
            cursor: pointer;
            z-index: 9999999999;
          }
        .y-panel:before {
            width: 50px;
            height: 50px;
            position: absolute;
            top: calc(50% - 24px);
            left: -25px;
            background-color: #a1d4e2;
            border-radius: 50px 0px 0px 50px;
            border: 1px solid #5ac6aa;
            border-right: none;
            content: \"\";
            opacity: 0.8;
            cursor: pointer;
            z-index: 9999999999;
        }
        .y-panel:hover {
            right: 0;
        }
        .y-panel > .y-panel-btn {
            position: relative;
            border: 1px solid #fff;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            margin: 4px 5px;
            padding: 2px 5px;
            text-align: center;
            user-select: none;
            background-color: #f0f0f0;
            z-index: 9999999999;
        }
        .y-panel-btn:hover {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
        }
        .y-panel-input {
            height: 24px;
            margin: 5px 4px;
            border-radius: 3px;
        }
        .y-panel ::-webkit-input-placeholder {
            color: rgba(0, 0, 0, 0.5);
            padding-left: 5px;
            font-size: 12px;
        }
        .y-panel-btn_delete {
            padding: 0px 3px;
            color: #000;
            font-size: 10px;
            position: absolute;
            right: 3px;
            top: 1px;
            background-color: #88befc;
        }
        .y-panel-btn_delete:hover {
            color: #fff;
            background-color: #F3629C;
        }`
    );

    /**
     * type BUTTON_TYPE = {
     *   text: string
     *   onclick: () => void
     *   type?: 'function' | 'normal'
     *   password?: string
     *   isStored?: boolean
     * }
     */

    // 可以在这里配置常用工号，例如：
    const name_map = ['袁龙辉10331290', '孟香君00268638', '郭绍云10286708']
    //const name_map = []
    // 本地存储的工号
    const stored_name_map = GM_listValues().map(item => GM_getValue(item))

    function register(btns) {
        const yPanel = document.querySelector('.y-panel')
        if (yPanel) {
            yPanel.parentNode.removeChild(yPanel)
        }
        const container = document.createElement("div");
        container.className = "y-panel";
        container.setAttribute('draggable', 'true');
        container.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', null); // 必须设置以启用拖动
        });
        container.addEventListener('dragend', (event) => {
            const screenHeight = window.innerHeight;
            const newTop = event.clientY - container.offsetHeight / 2;
            const topInVh = (newTop / screenHeight) * 100;
            // 限制 top 范围以防止超出视窗
            const clampedTopInVh = Math.min(Math.max(topInVh, 0), 100 - (container.offsetHeight / screenHeight) * 100);
            container.style.top = `${clampedTopInVh}vh`;
        });
        document.body.appendChild(container);
        // 生成基本功能的按钮
        generateBasicBtn(btns, container)
        // 添加跳转按钮
        addJumpBtn(container)
        // 添加创建员工信息输入框
        generateEmpInfoInput(container)
    };

    // 功能1 点击按钮清空cookie并刷新页面
    function func_clearCookies() {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0]);
        cookies.forEach(item => {
            GM_cookie.delete({ name: item });
        })
        location.reload();
    }

    // 功能2 切换cookie的语言
    function func_changeLang() {
        const currentUrl = new URL(window.location.href)
        const params = currentUrl.searchParams
        if (params.get('lang')) {
            params.set('lang', params.get('lang') === 'zh' ? 'en' : 'zh')
            window.history.replaceState({}, '', currentUrl)
        }
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=')
            if (name.includes('Language')) {
                GM_cookie.delete({ name });
                GM.cookie.set({
                    name,
                    value: value === 'zh_CN' ? 'en_US' : 'zh_CN'
                })
            }
        })
        location.reload();
    }

    // 功能3 登录
    function func_login(empInfo, password = '1') {
        const empNo = empInfo.match(/\d+/)?.[0] || empInfo // 取出工号，没有工号可能为admin等场景
        const empNoInput = document.getElementById('input-loginname')
        if (!empNoInput) return
        const passwordInput = document.getElementById('input-password')
        const login_btn = document.getElementsByClassName("el-button login-btn el-button--primary")[0]
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        empNoInput.value = empNo
        empNoInput.dispatchEvent(event);
        passwordInput.value = password
        passwordInput.dispatchEvent(event);
        login_btn.click()
    }

    // 在name新增删除后刷新面板
    function util_refreshPanel() {
        const current_stored_name_map = GM_listValues().map(item => GM_getValue(item))
        const current_btn_map = getBasicBtnMap(current_stored_name_map)
        register(current_btn_map)
    }

    // 添加跳转按钮
    function addJumpBtn(container) {
        // 主机名、端口号、路径、查询参数、hash
        const { hostname, port, pathname, searchParams, hash } = new URL(window.location.href);
        // 获取url中#之后的内容
        const hashParts = hash.slice(2).split('/')
        // 获取url中的app、bizObject、page
        const hashObject = {
            app: hashParts.indexOf('app') !== -1 ? hashParts[hashParts.indexOf('app') + 1] : null,
            bizObject: hashParts.indexOf('bizObject') !== -1 ? hashParts[hashParts.indexOf('bizObject') + 1] : null,
            page: hashParts.indexOf('page') !== -1 ? hashParts[hashParts.indexOf('page') + 1] : null
        }
        const host = port ? `${hostname}:${port}` : hostname
        // 微服务信息 如：zte-paas-lcap-frontendcli
        const microServiceInfo = pathname.slice(1).split('/')[0]
        // 设计态的微服务路径
        const design_path = microServiceInfo.includes('frontendrenderdemo')
            ? microServiceInfo.replace('frontendrenderdemo', 'frontendcli')
            : microServiceInfo
        // 布局、实体、应用主页url
        const layoutUrl = `https://${host}/${design_path}/layout-designer.html?lang=zh`
        const entityUrl = `https://${host}/${design_path}/entity-designer.html?lang=zh`
        const mainPageUrl = `https://${host}/${design_path}/index.html#/platform/applicationdevelopment`
        // 当前为布局设计器的运行态
        if (searchParams.get('bizObject') && searchParams.get('bizObject') !== 'null') {
            generateJumpBtn([
                {
                    text: 'to->当前布局',
                    title: '适用于表单页，列表页跳转之后需要切换一下布局',
                    toUrl: `${layoutUrl}${hash}/bizObject/${searchParams.get('bizObject')}`
                },
                {
                    text: 'to->当前实体',
                    toUrl: `${entityUrl}#/app/${hashObject.app}/bizObject/${searchParams.get('bizObject')}`
                }
            ], container)
        }
        // 当前为自定义页面的运行态
        else if (searchParams.get('bizObject') === 'null') {
            generateJumpBtn([
                {
                    text: 'to->当前页面设计',
                    toUrl: `${layoutUrl}#/app/${hashObject.app}/page/${hashObject.page}`
                }
            ], container)
        }
        // 当前为布局设计器的设计态
        else if (pathname.includes(`${design_path}/layout-designer.html`) && hashObject.bizObject) {
            generateJumpBtn([
                {
                    text: 'to->当前实体',
                    toUrl: `${entityUrl}#/app/${hashObject.app}/bizObject/${hashObject.bizObject}`
                }
            ], container)
        }
        // 当前为设计器的设计态或者运行态
        if (hashObject.app) {
            generateJumpBtn([
                { text: 'to->应用主页', toUrl: `${mainPageUrl}/${hashObject.app}` }
            ], container)
        }
        // 当前不是本地环境，需要跳转本地环境调试
        if (hostname !== 'local.zte.com.cn'
            && (pathname.includes('zte-paas-lcap-frontendcli')
                || pathname.includes('zte-paas-lcap-frontendrenderdemo')
                || pathname.includes('zte-paas-lcap-promgr')
                || pathname.includes('zte-paas-lcap-promc'))) {
            let url = new URL(window.location.href)
            url.host = 'local.zte.com.cn';
            if (pathname.includes('zte-paas-lcap-frontendcli')) {
                url.host += ':8080';
            } else if (pathname.includes('zte-paas-lcap-frontendrenderdemo')) {
                url.host += ':8081';
            } else if (pathname.includes('zte-paas-lcap-promgr')) {
                url.host += ':8086';
            } else if (pathname.includes('zte-paas-lcap-promc')) {
                url.host += ':8082';
            }
            generateJumpBtn([
                { text: '切换到本地调试', toUrl: url.toString() }
            ], container)
        }
    }

    // 创建基本的按钮（登录账号按钮等）
    function generateBasicBtn(btns, container) {
        btns.forEach(btn => {
            const button = document.createElement("button");
            button.textContent = btn.text;
            button.className = "y-panel-btn";
            button.onclick = btn.onclick;
            container.appendChild(button);
            if (btn.isStored) {
                const delete_btn = document.createElement("button");
                delete_btn.textContent = 'x';
                delete_btn.className = 'y-panel-btn_delete';
                delete_btn.onclick = (e) => {
                    e.stopPropagation()
                    GM_deleteValue(btn.text)
                    util_refreshPanel()
                };
                button.appendChild(delete_btn);
            }
            if (btn.password) {
                button.title = btn?.password
            }
            button.style.backgroundColor = btn.type === 'function' && '#5ac6aa'
        });
    }

    // 创建额外的按钮（跳转按钮等）
    function generateJumpBtn(btns, container) {
        btns.forEach(btn => {
            const button = document.createElement("button");
            button.textContent = btn.text;
            button.className = "y-panel-btn";
            button.style.backgroundColor = '#5ac6aa'
            button.onclick = () => {
                if (btn.toUrl) {
                    // 不能使用window.open，低代码项目的代码里有判断是否是通过这个api打开的页面的判断逻辑，会导致接口报错(-_-)
                    const a = document.createElement('a');
                    a.href = btn.toUrl;
                    a.target = '_blank';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            };
            if (btn.title) {
                button.title = btn.title
            }
            container.appendChild(button);
        })
    }

    // 创建员工信息输入框
    function generateEmpInfoInput(container) {
        const empInfo_input = document.createElement("input");
        empInfo_input.className = 'y-panel-input'
        empInfo_input.placeholder = '输入姓名+工号, 回车~'
        container.appendChild(empInfo_input);
        empInfo_input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                // TODO 校验格式
                GM_setValue(empInfo_input.value, empInfo_input.value)
                func_login(empInfo_input.value)
                util_refreshPanel()
            }
        });
    }

    // 构建基础按钮列表（基础功能+姓名）
    function getBasicBtnMap(stored_name_map) {
        return [
            {
                text: '清空Cookie并刷新',
                type: 'function',
                onclick: () => func_clearCookies()
            },
            {
                text: '切换cookie的语言',
                type: 'function',
                onclick: () => func_changeLang()
            },
            ...name_map.map(name => {
                return {
                    text: name,
                    password: '1',
                    onclick: () => func_login(name)
                }
            }),
            // 可以通过修改func_login的参数，添加自定义的工号和密码
            {
                text: 'admin',
                password: '123456@Zte',
                onclick: () => func_login('admin', '123456@Zte')
            },
            ...stored_name_map.map(name => {
                return {
                    text: name,
                    isStored: true,
                    password: '1',
                    onclick: () => func_login(name)
                }
            })
        ]
    }

    // 入口函数
    (function init() {
        const initial_btn_map = getBasicBtnMap(stored_name_map)
        register(initial_btn_map)
    })()

})();
