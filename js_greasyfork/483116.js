// ==UserScript==
// @name         Boss助手
// @namespace
// @version      1.5.0
// @description  Boss助手方便操作
// @author       wanniwa
// @match        http://boss1-hw.yunzhangfang.com/bss/home.html
// @match        http://boss1-hw.yunzhangfang.com/bss/index.html
// @icon         data:image/png;base64,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
// @license      AGPL-3.0-or-later
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand

// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/483116/Boss%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483116/Boss%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //解析接口配置
    //showType=1(仅PC), showType=2(仅mobile), showType=3(同时显示)
    const originalInterfaceList = [];

    function commonFunction() {
        this.GMgetValue = function (name, value = null) {
            let storageValue = value;
            if (typeof GM_getValue === "function") {
                storageValue = GM_getValue(name, value);
            } else if (typeof GM.setValue === "function") {
                storageValue = GM.getValue(name, value);
            } else {
                var arr = window.localStorage.getItem(name);
                if (arr != null) {
                    storageValue = arr
                }
            }
            return storageValue;
        };
        this.GMsetValue = function (name, value) {
            if (typeof GM_setValue === "function") {
                GM_setValue(name, value);
            } else if (typeof GM.setValue === "function") {
                GM.setValue(name, value);
            } else {
                window.localStorage.setItem(name, value)
            }
        };
        this.GMaddStyle = function (css) {
            var myStyle = document.createElement('style');
            myStyle.textContent = css;
            var doc = document.head || document.documentElement;
            doc.appendChild(myStyle);
        };
        this.GMopenInTab = function (url, options = { "active": true, "insert": true, "setParent": true }) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, options);
            } else {
                GM.openInTab(url, options);
            }
        };
        this.addScript = function (url) {
            var s = document.createElement('script');
            s.setAttribute('src', url);
            document.body.appendChild(s);
        };
        this.randomNumber = function () {
            return Math.ceil(Math.random() * 100000000);
        };
        this.request = function (mothed, url, param) {   //网络请求
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    url: url,
                    method: mothed,
                    data: param,
                    onload: function (response) {
                        var status = response.status;
                        var playurl = "";
                        if (status == 200 || status == '200') {
                            var responseText = response.responseText;
                            resolve({ "result": "success", "data": responseText });
                        } else {
                            reject({ "result": "error", "data": null });
                        }
                    }
                });
            })
        };
        this.addCommonHtmlCss = function () {
            var cssText = `
				@keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@-webkit-keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@-moz-keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@-o-keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@-ms-keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				@-webkit-keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				@-moz-keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				@-o-keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				@-ms-keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				.web-toast-kkli9{
					position: fixed;
					background: rgba(0, 0, 0, 0.7);
					color: #fff;
					font-size: 14px;
					line-height: 1;
					padding:10px;
					border-radius: 3px;
					left: 50%;
					transform: translateX(-50%);
					-webkit-transform: translateX(-50%);
					-moz-transform: translateX(-50%);
					-o-transform: translateX(-50%);
					-ms-transform: translateX(-50%);
					z-index: 999999999999999999999999999;
					white-space: nowrap;
				}
				.fadeOut{
					animation: fadeOut .5s;
				}
				.fadeIn{
					animation:fadeIn .5s;
				}
                /* SQL管理器样式 */
                .sql-manager {
                    padding: 15px;
                }
                .sql-list {
                    margin-bottom: 15px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                .sql-item {
                    background: #f5f5f5;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    position: relative;
                }
                .sql-item input {
                    width: 200px;
                    margin-bottom: 10px;
                    padding: 5px;
                }
                .sql-item textarea {
                    width: 100%;
                    height: 100px;
                    margin-bottom: 10px;
                    padding: 5px;
                }
                .btn-save,
                .btn-add-sql {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                }
                .sql-option {
                    padding: 10px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .sql-option:hover {
                    background-color: #f5f5f5;
                }
				`;
            this.GMaddStyle(cssText);
        };
        this.webToast = function (params) {	//小提示框
            var time = params.time;
            var background = params.background;
            var color = params.color;
            var position = params.position;  //center-top, center-bottom
            var defaultMarginValue = 50;

            if (time == undefined || time == '') {
                time = 1500;
            }

            var el = document.createElement("div");
            el.setAttribute("class", "web-toast-kkli9");
            el.innerHTML = params.message;
            //背景颜色
            if (background != undefined && background != '') {
                el.style.backgroundColor = background;
            }
            //字体颜色
            if (color != undefined && color != '') {
                el.style.color = color;
            }

            //显示位置
            if (position == undefined || position == '') {
                position = "center-bottom";
            }

            //设置显示位置，当前有种两种形式
            if (position === "center-bottom") {
                el.style.bottom = defaultMarginValue + "px";
            } else {
                el.style.top = defaultMarginValue + "px";
            }
            el.style.zIndex = 999999;

            document.body.appendChild(el);
            el.classList.add("fadeIn");
            setTimeout(function () {
                el.classList.remove("fadeIn");
                el.classList.add("fadeOut");
                /*监听动画结束，移除提示信息元素*/
                el.addEventListener("animationend", function () {
                    document.body.removeChild(el);
                });
                el.addEventListener("webkitAnimationEnd", function () {
                    document.body.removeChild(el);
                });
            }, time);
        };
        this.queryUrlParamter = function (text, tag) { //查询GET请求url中的参数
            if (text.indexOf("?") != -1) { //选取?后面的字符串,兼容window.location.search，前面的?不能去掉
                var textArray = text.split("?");
                text = "?" + textArray[textArray.length - 1];
            }
            var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
            var a = text.substr(1).match(t);
            if (a != null) {
                return a[2];
            }
            return "";
        };
        this.isPC = function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        this.getBilibiliBV = function () {
            var pathname = window.location.pathname;
            var bv = pathname.replace("/video/", "").replace("/", "");
            return bv;
        };
        this.getSystemOS = function () {
            var u = navigator.userAgent;
            if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
                return 'windows';
            } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
                return 'macOS';
            } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
                return 'ios';
            } else if (!!u.match(/android/i)) {
                return 'android';
            } else {
                return 'other';
            }
        };
        this.getElementObject = function (selector, allowEmpty = true, delay = 200) {
            return new Promise((resolve, reject) => {
                let totalDelay = 0;
                let elementInterval = setInterval(() => {
                    if (totalDelay >= 3000) { //总共检查3s，如果还是没找到，则返回
                        reject(false);
                        clearInterval(elementInterval);
                    }
                    let element = document.querySelector(selector);
                    let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
                    if (result) {
                        clearInterval(elementInterval);
                        resolve(element);
                    } else {
                        totalDelay += delay;
                    }
                }, delay);
            });
        };
        /**
         * @param {Object} time
         * @param {Object} format
         * 时间格式化
         * DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss")
         */
        this.DateFormat = function (time, format) {
            var o = {
                "M+": time.getMonth() + 1, //月份
                "d+": time.getDate(), //日
                "h+": time.getHours(), //小时
                "m+": time.getMinutes(), //分
                "s+": time.getSeconds(), //秒
                "q+": Math.floor((time.getMonth() + 3) / 3), //季度
                "S": time.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return format;
        }
    }

    var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    var keyboard = isMac ? 'CTRL' : 'ALT';

    //全局弹窗对象
    const popup = (function () {
        class Popup {
            constructor() {
                this.mask = document.createElement('div')
                this.setStyle(this.mask, {
                    "width": '100%',
                    "height": '100%',
                    "backgroundColor": 'rgba(0, 0, 0, .6)',
                    "position": 'fixed',
                    "left": "0px",
                    "top": "0px",
                    "bottom": "0px",
                    "right": "0px",
                    "z-index": "99999"
                })
                // 创建中间显示内容的水平并垂直居中的div
                this.content = document.createElement('div')
                this.setStyle(this.content, {
                    "max-width": '1200px',
                    "width": "95%",
                    "backgroundColor": '#fff',
                    "boxShadow": '0 0 2px #999',
                    "position": 'absolute',
                    "left": '50%',
                    "top": '50%',
                    "transform": 'translate(-50%,-50%)',
                    "borderRadius": '3px'
                })
                // 将这个小div放在遮罩中
                this.mask.appendChild(this.content)
            }

            middleBox(param) {
                // 先清空中间小div的内容 - 防止调用多次，出现混乱
                this.content.innerHTML = ''
                let title = '默认标题内容';
                // 检测参数类型
                if ({}.toString.call(param) === '[object String]') {
                    title = param
                } else if ({}.toString.call(param) === '[object Object]') {
                    title = param.title
                }
                // 将遮罩放在body中显示
                document.body.appendChild(this.mask)
                // 给中间的小div设置默认的排版
                // 上面标题部分
                this.title = document.createElement('div')
                // 设置样式
                this.setStyle(this.title, {
                    "width": '100%',
                    "height": '40px',
                    "lineHeight": '40px',
                    "boxSizing": 'border-box',
                    "background-color": "#FF4D40",
                    "color": '#FFF',
                    "text-align": 'center',
                    "font-weight": "700",
                    "font-size": "16px"

                })
                // 设置默认标题内容
                this.title.innerText = title
                // 将标题部分放在中间div中
                this.content.appendChild(this.title)
                // 关闭按钮
                this.closeBtn = document.createElement('div')
                // 设置内容
                this.closeBtn.innerText = '×'
                // 设置样式
                this.setStyle(this.closeBtn, {
                    "textDecoration": 'none',
                    "position": 'absolute',
                    "right": '10px',
                    "top": '0px',
                    "fontSize": '25px',
                    "color": '#FFF',
                    "display": "inline-block",
                    "cursor": "pointer"
                })
                // 将关闭按钮放在中间小div中
                this.title.appendChild(this.closeBtn)
                this.closeBtn.onclick = () => this.close()
            }

            // 弹出提示框
            dialog(param) {
                this.middleBox(param);
                this.dialogContent = document.createElement('div')
                this.setStyle(this.dialogContent, {
                    "padding": "15px"
                    // "max-height": "400px"
                })
                this.dialogContent.innerHTML = param.content;
                this.content.appendChild(this.dialogContent)
                param.onContentReady(this);
            }

            close() {
                document.body.removeChild(this.mask)
                // window.location.reload();
            }

            setStyle(ele, styleObj) { // 设置样式的函数
                for (let attr in styleObj) {
                    ele.style[attr] = styleObj[attr]
                }
            }
        }

        return (function () {
            return new Popup();
        })()
    })();

    //全局统一方法对象
    const commonFunctionObject = new commonFunction();
    commonFunctionObject.addCommonHtmlCss();
    //统一接口
    let newOriginalInterfaceList = originalInterfaceList;

    // 全局用户名密码存储key
    const GLOBAL_LOGIN_KEY = 'globalLoginInfo';

    // 获取全局用户名密码
    function getGlobalLoginInfo() {
        let info = commonFunctionObject.GMgetValue(GLOBAL_LOGIN_KEY);
        if (typeof info === 'string') {
            try { info = JSON.parse(info); } catch (e) { info = {}; }
        }
        return info || {};
    }
    // 设置全局用户名密码
    function setGlobalLoginInfo(username, password) {
        commonFunctionObject.GMsetValue(GLOBAL_LOGIN_KEY, JSON.stringify({ username, password }));
    }

    //相关功能关闭控制
    var functionController = commonFunctionObject.GMgetValue("setingData");
    if (!functionController) {
        functionController = [
            {
                "keyboard": "b",
                "set": "fintax_proxy",
                "DBName": "fintax_task",
                "sqls": [{
                    name: "默认查询",
                    content: 'SELECT\n\t* \nFROM\n\ttask_master \nWHERE\n\tqy_id = \nORDER BY\n\tcreate_time DESC'
                }],
                "checked": true,
                "schema": "",
                "type": '1',
                "table": "",
                "username": "",
                "password": ""
            },
            {
                "keyboard": "1",
                "set": "明明中台服务",
                "DBName": "accounting_print",
                "checked": true,
                "schema": "accounting_company",
                "type": '2',
                "table": "yzf_company",
                "username": "",
                "password": ""
            }
        ]
        commonFunctionObject.GMsetValue("setingData", functionController);
    }


    function removeRow(element) {
        element.parentNode.remove();
    }


    //用户功能设置函数
    function usersSeting() {
        var setingData = functionController;
        var globalLogin = getGlobalLoginInfo();
        var content = `
            <style>
                .global-login-row { display: flex; align-items: center; margin-bottom: 10px; }
                .global-login-row label { margin-right: 5px; }
                .global-login-row input { margin-right: 10px; width: 120px; }
                .config-container {
                    padding: 15px;
                    height: 600px;
                    display: flex;
                    flex-direction: column;
                }
                .config-list {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 15px;
                    padding-right: 10px;
                }
                .config-row {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    background: #f5f5f5;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    position: relative;
                }
                .config-row > * {
                    vertical-align: middle;
                }
                .config-row input[type="text"],
                .config-row select,
                .config-row input[name="keyboard"] {
                    height: 32px;
                    line-height: 32px;
                    box-sizing: border-box;
                    margin-right: 5px;
                    display: inline-block;
                }
                .config-row input[name="keyboard"] {
                    width: 30px;
                    margin: 0 10px;
                    text-align: center;
                    padding: 5px;
                }
                .config-row input[type="checkbox"] {
                    margin-right: 10px;
                    width: 16px;
                    height: 16px;
                    margin-top: 0;
                }
                /* 统一所有按钮样式 */
                .config-row button,
                .button-group button,
                .global-login-row button,
                .btn-save {
                    height: 32px;
                    line-height: 32px;
                    padding: 0 18px;
                    font-size: 15px;
                    font-weight: 500;
                    border: none;
                    border-radius: 16px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 10px;
                    box-sizing: border-box;
                    transition: background 0.2s, color 0.2s;
                }
                .btn-remove {
                    background: #ff4d4d;
                    color: #fff;
                    min-width: 48px;
                }
                .btn-remove:hover {
                    background: #ff3333;
                }
                .btn-manage-sql {
                    background: #2196f3;
                    color: #fff;
                }
                .btn-manage-sql:hover {
                    background: #1976d2;
                }
                .btn-add {
                    background: #4CAF50;
                    color: #fff;
                }
                .btn-add:hover {
                    background: #388e3c;
                }
                .switch-wrapper {
                    display: flex;
                    align-items: center;
                    margin-right: 10px;
                }
                /* switch滑块样式 */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                    margin-right: 8px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: '';
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: #FF4D40;
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                /* 其余样式保持不变 ... */
            </style>
            <div class="global-login-row">
                <label>网站用户名</label>
                <input type="text" id="global-username" placeholder="用户名" value="${globalLogin.username || ''}" />
                <label>密码</label>
                <input type="password" id="global-password" placeholder="密码" value="${globalLogin.password || ''}" />
                <button type="button" id="save-global-login">保存登录信息</button>
            </div>
            <div class="config-container">
                <div class="config-list">
        `;

        // 添加现有配置
        setingData.forEach(function(one) {
            content += getConfigRowHtml(one);
        });

        content += `
                </div>
                <div class="button-group">
                    <button id="addButton" class="btn-add">添加配置</button>
                    <button id="saveButton" class="btn-save">保存配置</button>
                </div>
            </div>
        `;

        popup.dialog({
            "title": "功能开关",
            "content": content,
            "onContentReady": function ($that) {
                // 保存全局登录信息
                $that.dialogContent.querySelector('#save-global-login').addEventListener('click', function() {
                    const username = $that.dialogContent.querySelector('#global-username').value;
                    const password = $that.dialogContent.querySelector('#global-password').value;
                    setGlobalLoginInfo(username, password);
                    commonFunctionObject.webToast({ message: '登录信息已保存', time: 1200 });
                });
                // 添加配置按钮事件
                $that.dialogContent.querySelector("#addButton").addEventListener("click", function () {
                    var configList = $that.dialogContent.querySelector(".config-list");
                    var newRow = document.createElement("div");
                    newRow.innerHTML = getConfigRowHtml({
                        checked: false,
                        keyboard: "",
                        set: "",
                        DBName: "",
                        schema: "",
                        type: "1",
                        table: "",
                        username: "",
                        password: ""
                    });
                    configList.appendChild(newRow.firstElementChild);

                    // 滚动到底部
                    configList.scrollTop = configList.scrollHeight;
                });

                // 保存按钮事件
                $that.dialogContent.querySelector("#saveButton").addEventListener("click", function () {
                    var rows = document.getElementsByClassName('config-row');
                    var data = [];

                    for (var row of rows) {
                        var type = row.querySelector('select[name="type"]').value;
                        const rowIndex = Array.from(rows).indexOf(row);
                        var obj = {
                            checked: row.querySelector('input[type="checkbox"]').checked,
                            keyboard: row.querySelector('input[name="keyboard"]').value,
                            set: row.querySelector('input[name="set"]').value,
                            DBName: row.querySelector('input[name="DBName"]').value,
                            schema: row.querySelector('input[name="schema"]').value,
                            type: type,
                            table: row.querySelector('input[name="table"]').value,
                            sqls: type === '1' ? (functionController[rowIndex]?.sqls || []) : undefined
                        };

                        if ((obj.DBName == null || obj.DBName === '') && (obj.schema != null && obj.schema !== '')) {
                            alert('DBName必填');
                            return;
                        }

                        if ((obj.type === '2') && (obj.table == null || obj.table === '')) {
                            alert('菜单模式table必填');
                            return;
                        }
                        data.push(obj);
                    }
                    commonFunctionObject.GMsetValue("setingData", data);
                    window.location.reload();
                });

                // 为所有勾选框添加切换事件
                $that.dialogContent.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.addEventListener("change", function () {
                        const label = this.closest('.switch-wrapper').querySelector('.switch-label');
                        label.textContent = this.checked ? "启用" : "停用";
                    });
                });

                // 修改删除按钮事件绑定
                $that.dialogContent.addEventListener("click", function (e) {
                    if (e.target.classList.contains("btn-remove")) {
                        e.target.closest('.config-row').remove();
                    }
                });

                // 添加SQL管理功能的事件监听
                $that.dialogContent.addEventListener("click", function (e) {
                    if (e.target.classList.contains("btn-manage-sql")) {
                        const configRow = e.target.closest('.config-row');
                        const rowIndex = Array.from(document.getElementsByClassName('config-row')).indexOf(configRow);
                        const currentConfig = functionController[rowIndex] || { sqls: [] };

                        let sqlManagerContent = `
                            <div class="sql-manager">
                                <div class="sql-list">
                                    ${(currentConfig.sqls || []).map((sql, index) => `
                                        <div class="sql-item">
                                            <input type="text" class="sql-name" value="${sql.name}" placeholder="SQL名称">
                                            <textarea class="sql-content" placeholder="SQL内容">${sql.content}</textarea>
                                            <button type="button" class="btn-remove" data-index="${index}">×</button>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="button-group">
                                    <button type="button" class="btn-add-sql">添加SQL</button>
                                    <button type="button" class="btn-save">保存</button>
                                </div>
                            </div>
                        `;

                        popup.dialog({
                            title: "SQL管理",
                            content: sqlManagerContent,
                            onContentReady: function ($sqlManager) {
                                // 添加SQL按钮事件
                                $sqlManager.dialogContent.querySelector('.btn-add-sql').addEventListener('click', function () {
                                    const sqlList = $sqlManager.dialogContent.querySelector('.sql-list');
                                    const newSqlItem = document.createElement('div');
                                    newSqlItem.className = 'sql-item';
                                    newSqlItem.innerHTML = `
                                        <input type="text" class="sql-name" placeholder="SQL名称">
                                        <textarea class="sql-content" placeholder="SQL内容"></textarea>
                                        <button type="button" class="btn-remove" data-index="${sqlList.children.length}">×</button>
                                    `;
                                    sqlList.appendChild(newSqlItem);
                                });

                                // 保存按钮事件
                                $sqlManager.dialogContent.querySelector('.btn-save').addEventListener('click', function () {
                                    const sqlItems = $sqlManager.dialogContent.querySelectorAll('.sql-item');
                                    const sqls = Array.from(sqlItems).map(item => ({
                                        name: item.querySelector('.sql-name').value,
                                        content: item.querySelector('.sql-content').value
                                    })).filter(sql => sql.name && sql.content);

                                    if (sqls.length === 0) {
                                        alert('至少需要一个有效的SQL配置');
                                        return;
                                    }

                                    currentConfig.sqls = sqls;
                                    functionController[rowIndex] = currentConfig;
                                    commonFunctionObject.GMsetValue("setingData", functionController);

                                    $sqlManager.close();
                                });

                                // 删除SQL按钮事件
                                $sqlManager.dialogContent.addEventListener('click', function (e) {
                                    if (e.target.classList.contains('btn-remove')) {
                                        e.target.closest('.sql-item').remove();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    // 生成配置行HTML的辅助函数
    function getConfigRowHtml(one) {
        return `
            <div class="config-row">
                <button class="btn-remove" type="button" title="删除">删除</button>
                <div class="switch-wrapper">
                    <label class="switch">
                        <input type="checkbox" name="Checkbox" ${(one.checked ? "checked" : "")}> 
                        <span class="slider"></span>
                    </label>
                </div>
                ${keyboard}+<input name="keyboard" value="${one.keyboard}"/>
                <input type="text" name="set" placeholder="set" value="${one.set}"/>
                <select name="type" onchange="this.parentElement.querySelector('[name=table]').style.display = this.value === '2' ? '' : 'none'">
                    <option value="1" ${one.type === '1' ? "selected" : ""}>通用查询</option>
                    <option value="2" ${one.type === '2' ? "selected" : ""}>菜单</option>
                </select>
                <input type="text" name="DBName" placeholder="DBName(可选)" value="${one.DBName}"/>
                <input type="text" name="schema" placeholder="schema(可选)" value="${one.schema}"/>
                <input type="text" name="table" placeholder="table(可选)" value="${one.table}" style="display: ${one.type === '2' ? '' : 'none'}"/>
                ${one.type === '1' ? `
                    <button type="button" class="btn-manage-sql" style="margin-left: 5px;">管理SQL</button>
                ` : ''}
            </div>
        `;
    }

    GM_registerMenuCommand("功能开关", () => usersSeting());


    setTimeout(function () {
        // 检查是否在登录页
        if (window.location.pathname.endsWith('index.html')) {
            var loginInfo = getGlobalLoginInfo && getGlobalLoginInfo();
            if (
                loginInfo &&
                typeof loginInfo.username === 'string' &&
                typeof loginInfo.password === 'string' &&
                loginInfo.username.trim() !== '' &&
                loginInfo.password.trim() !== ''
            ) {
                // 先判断文档是否已加载
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function () {
                        console.log('[Boss助手] 检测到全局用户名密码，准备自动填充');
                        doAutoLogin();
                    });
                } else {
                    doAutoLogin();
                }
            } else {
                // 未配置用户名密码时，页面插入保存按钮
                document.addEventListener('DOMContentLoaded', function () {
                    var userInput = document.getElementById('username');
                    var passInput = document.getElementById('password');
                    var loginBtn = document.getElementById('login');
                    if (userInput && passInput && loginBtn) {
                        if (!document.getElementById('save-to-boss-helper')) {
                            var saveBtn = document.createElement('button');
                            saveBtn.id = 'save-to-boss-helper';
                            saveBtn.type = 'button';
                            saveBtn.textContent = '保存到Boss助手';
                            saveBtn.style.marginLeft = '10px';
                            loginBtn.parentNode.insertBefore(saveBtn, loginBtn.nextSibling);
                            saveBtn.addEventListener('click', function () {
                                var username = userInput.value.trim();
                                var password = passInput.value.trim();
                                if (!username || !password) {
                                    alert('请先输入用户名和密码');
                                    return;
                                }
                                setGlobalLoginInfo(username, password);
                                if (typeof commonFunctionObject !== 'undefined' && commonFunctionObject.webToast) {
                                    commonFunctionObject.webToast({ message: '登录信息已保存', time: 1200 });
                                } else {
                                    alert('登录信息已保存');
                                }
                            });
                        }
                    }
                });
            }
            return;
        }
        // 其他页面逻辑
        let comboboxText = $('#sets').combobox('getValue');
        if (comboboxText === '') {
            window.top.location = "index.html";
        }
    }, 500);

    // 修改键盘事件监听部分
    function addKeyboardListener(element) {
        element.addEventListener('keydown', function (event) {
            if (isMac) {
                if (!event.ctrlKey) {
                    return;
                }
            } else {
                if (!event.altKey) {
                    return;
                }
            }
            functionController.forEach(function (one) {
                if (one.checked) {
                    if (event.key === one.keyboard) {
                        event.preventDefault();
                        let comboboxText = $('#sets').combobox('getValue');
                        if (comboboxText !== one.set) {
                            $('#sets').combobox('setValue', one.set);
                        }
                        setTimeout(function () {
                            var targetNode = $('#menu').tree('getChildren')[17];
                            var roots = $('#menu').tree('getRoots')

                            if (one.type === '2') {
                                for (let i = 0; i < roots.length; i++) {
                                    if (one.DBName !== '' && one.DBName !== null) {
                                        if (roots[i].text === one.DBName) {
                                            var children = $('#menu').tree('getChildren', roots[i].target);
                                            for (let j = 0; j < children.length; j++) {
                                                if (one.table !== '' && one.table !== null) {
                                                    if (children[j].text === one.table && $('#menu').tree('isLeaf', children[j].target)) {
                                                        let parent = $('#menu').tree('getParent', children[j].target);
                                                        if (parent.text === one.schema) {
                                                            var func = $('#menu').tree('options').onClick;
                                                            if (func != null) {
                                                                func.call(this, children[j]);
                                                            }
                                                            return
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (one.type === '1') {
                                if (targetNode) {
                                    var func = $('#menu').tree('options').onClick;
                                    if (func != null) {
                                        func.call(this, targetNode);
                                    }
                                    if (one.DBName !== '' && one.DBName !== null) {
                                        setTimeout(function () {
                                            var iframe = document.querySelector('iframe');
                                            if (iframe != null) {
                                                if (one.sqls && one.sqls.length > 0) {
                                                    if (one.sqls.length === 1) {
                                                        iframe.contentDocument.getElementById('sql').value = one.sqls[0].content;
                                                    } else {
                                                        // 使用全局popup对象而不是创建新的实例
                                                        let sqlOptions = `
                                                            <style>
                                                                .sql-selector {
                                                                    display: flex;
                                                                    gap: 20px;
                                                                    height: 400px;
                                                                }
                                                                .sql-options {
                                                                    width: 300px;
                                                                    border-right: 1px solid #ddd;
                                                                    overflow-y: auto;
                                                                }
                                                                .sql-preview {
                                                                    flex: 1;
                                                                    overflow-y: auto;
                                                                }
                                                                .sql-option {
                                                                    padding: 10px;
                                                                    cursor: pointer;
                                                                    transition: background-color 0.3s;
                                                                    border-bottom: 1px solid #eee;
                                                                }
                                                                .sql-option:hover {
                                                                    background-color: #f5f5f5;
                                                                }
                                                                .sql-preview pre {
                                                                    margin: 0;
                                                                    padding: 10px;
                                                                    white-space: pre-wrap;
                                                                    word-wrap: break-word;
                                                                    font-family: monospace;
                                                                    font-size: 14px;
                                                                    line-height: 1.5;
                                                                }
                                                            </style>
                                                            <div class="sql-selector">
                                                                <div class="sql-options">
                                                                    ${one.sqls.map((sql, index) => `
                                                                        <div class="sql-option" data-index="${index}">
                                                                            ${sql.name}
                                                                        </div>
                                                                    `).join('')}
                                                                </div>
                                                                <div class="sql-preview">
                                                                    <pre></pre>
                                                                </div>
                                                            </div>`;

                                                        popup.dialog({  // 使用全局popup对象
                                                            title: "选择SQL",
                                                            content: sqlOptions,
                                                            onContentReady: function ($selector) {
                                                                const preview = $selector.dialogContent.querySelector('.sql-preview pre');

                                                                // 鼠标悬停时显示预览
                                                                $selector.dialogContent.querySelectorAll('.sql-option').forEach((option) => {
                                                                    option.addEventListener('mouseover', function () {
                                                                        const index = this.getAttribute('data-index');
                                                                        preview.textContent = one.sqls[index].content;
                                                                    });

                                                                    // 点击时选择并关闭
                                                                    option.addEventListener('click', function () {
                                                                        const index = this.getAttribute('data-index');
                                                                        iframe.contentDocument.getElementById('sql').value = one.sqls[index].content;
                                                                        $selector.close();
                                                                    });
                                                                });

                                                                // 默认显示第一个SQL的预览
                                                                if (one.sqls.length > 0) {
                                                                    preview.textContent = one.sqls[0].content;
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                                if (one.DBName !== '' && one.DBName !== null) {
                                                    iframe.contentWindow.$('#DBNAME').combobox('setValue', one.DBName);
                                                }
                                                if (one.schema !== '' && one.schema !== null) {
                                                    setTimeout(function () {
                                                        iframe.contentWindow.$('#SCHEMANAME').combobox('setValue', one.schema);
                                                    }, 200);
                                                }
                                            }
                                        }, 400);
                                    }
                                }
                            }
                        }, 500);
                        return;
                    }
                }
            });
        });
    }

    // 为主文档添加监听器
    addKeyboardListener(document);

    // 监听iframe的加载并添加事件监听器
    const observeIframes = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'IFRAME') {
                        node.addEventListener('load', () => {
                            try {
                                addKeyboardListener(node.contentDocument);
                            } catch (e) {
                                console.log('无法访问iframe内容:', e);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // 启动观察器
    observeIframes();

    function insertSaveBtnIfNeeded() {
        var userInput = document.getElementById('username');
        var passInput = document.getElementById('password');
        var loginBtn = document.getElementById('login');
        if (userInput && passInput && loginBtn && !document.getElementById('save-to-boss-helper')) {
            var saveBtn = document.createElement('button');
            saveBtn.id = 'save-to-boss-helper';
            saveBtn.type = 'button';
            saveBtn.textContent = '保存到Boss助手';
            saveBtn.style.marginLeft = '10px';
            loginBtn.parentNode.insertBefore(saveBtn, loginBtn.nextSibling);
            saveBtn.addEventListener('click', function () {
                var username = userInput.value.trim();
                var password = passInput.value.trim();
                if (!username || !password) {
                    alert('请先输入用户名和密码');
                    return;
                }
                setGlobalLoginInfo(username, password);
                if (typeof commonFunctionObject !== 'undefined' && commonFunctionObject.webToast) {
                    commonFunctionObject.webToast({ message: '登录信息已保存', time: 1200 });
                } else {
                    alert('登录信息已保存');
                }
            });
        }
    }

    // 动态检测
    if (window.location.pathname.endsWith('index.html')) {
        var loginInfo = getGlobalLoginInfo && getGlobalLoginInfo();
        if (
            !loginInfo ||
            typeof loginInfo.username !== 'string' ||
            typeof loginInfo.password !== 'string' ||
            loginInfo.username.trim() === '' ||
            loginInfo.password.trim() === ''
        ) {
            // 1. 先尝试直接插入
            insertSaveBtnIfNeeded();
            // 2. 监听DOM变化，表单一出现就插入
            var observer = new MutationObserver(insertSaveBtnIfNeeded);
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function doAutoLogin() {
        var userInput = document.getElementById('username');
        var passInput = document.getElementById('password');
        var loginBtn = document.getElementById('login');
        console.log('[Boss助手] username:', loginInfo.username, 'password:', loginInfo.password);
        console.log('[Boss助手] userInput:', userInput, 'passInput:', passInput, 'loginBtn:', loginBtn);
        if (userInput && passInput && loginBtn) {
            userInput.value = loginInfo.username;
            passInput.value = loginInfo.password;
            console.log('[Boss助手] 已自动填充用户名和密码，准备自动点击登录');
            loginBtn.click();
        } else {
            console.log('[Boss助手] 未找到登录表单元素，无法自动填充');
        }
    }
})
    ();
