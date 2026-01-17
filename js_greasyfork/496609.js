// ==UserScript==
// @name         ✨微信公众号后台快捷工具✨
// @icon         https://res.wx.qq.com/a/fed_upload/9300e7ac-cec5-4454-b75c-f92260dd5b47/logo-mp.ico
// @namespace    https://greasyfork.org/zh-CN/users/1299634-weidingyi
// @version      1.3.1
// @description  在草稿箱文章列表标题后边追加醒目提示,快捷生成草稿文章~
// @author       weidingyi
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*action=list_card*
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*action=list*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      app.lfeet.asia
// @connect      localhost
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_cookie
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496609/%E2%9C%A8%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%E5%BF%AB%E6%8D%B7%E5%B7%A5%E5%85%B7%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/496609/%E2%9C%A8%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%E5%BF%AB%E6%8D%B7%E5%B7%A5%E5%85%B7%E2%9C%A8.meta.js
// ==/UserScript==


const window = unsafeWindow;

// document.querySelector("#js_listview").click(); //设置为列表排版

(function () {
    'use strict';
    const TK = window.wx ? window.wx.commonData.data.t : '';

    // 定时发表列表
    var time_send_list;

    var get_pub_tip = function (flag, title) {
        var txt = '';
        if (flag) {
            txt = "<span style='color:green'> [已发表]</span>";
        } else {
            // 检查是否在定时发表列表中
            txt = "<span style='color:red'> [未发表]</span>";
            title = filter_special_chars(title)
            let isEq = time_send_list.some(function (item) {
                item = filter_special_chars(item);
                return item == title;
            });
            if (isEq) {
                txt = "<span style='color:#f313d9'> [定时发表中]</span>"
            }
        }
        return txt;
    };

    var filter_special_chars = function (str) {
        return str.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
        // return str.replace(/[\s，。！？；：“”‘’（）《》【】、…—!@#$%^&*()+\-={}|;':",~～]/g, '');
    }

    /**
     * escape === false时, 为decode, 反之为encode
     */
    var escape = function (str, escape) {
        // 临时对nickname decode
        // var ar=['&','&amp;','<','&lt;','>','&gt;',' ','&nbsp;','"','&quot;',"'",'&#39;','\\r','<br>','\\n','<br>'];
        var ar = ['&', '&amp;', '<', '&lt;', '>', '&gt;', ' ', '&nbsp;', '"', '&quot;', '\'', '&#39;'];
        /*
            // 最新版的safari 12有一个BUG，如果使用字面量定义一个数组，var a = [1, 2, 3]
            // 当调用了 a.reverse() 方法把变量 a 元素顺序反转成 3, 2, 1 后，
            // 即使此页面刷新了， 或者此页面使用 A标签、 window.open 打开的页面，
            // 只要调用到同一段代码， 变量 a 的元素顺序都会变成 3, 2, 1
            // 所以这里不用 reverse 方法
            if (escape === false) {
              ar.reverse();
            }
        */
        var arReverse = ['&#39;', '\'', '&quot;', '"', '&nbsp;', ' ', '&gt;', '>', '&lt;', '<', '&amp;', '&'];
        var target;
        if (escape === false) {
            target = arReverse;
        } else {
            target = ar;
        }
        var r = str;
        for (var i = 0; i < target.length; i += 2) {
            r = r.replace(new RegExp(target[i], 'g'), target[1 + i]);
        }
        return r;
    }

    var get_time_send_list = function () {
        let api = "https://mp.weixin.qq.com/cgi-bin/home?t=home/index&token=" + TK + "&lang=zh_CN&f=json";
        return fetch(api)
            .then(s => s.json())
            .then(s => {
                let json_timesend_msg = JSON.parse(s.timesend_msg);
                if (json_timesend_msg.sent_list.length <= 0) {
                    return [];
                }
                let list = json_timesend_msg.sent_list[0].appmsg_info
                return list.map(item => {
                    return item.title;
                })
            })

    }

    var fetch_pub_tip = function () {
        let list = document.querySelectorAll(".weui-desktop-simple-appmsg__title")
        list.forEach(function (item, idx) {
            let tip = document.createElement("b");
            // 原始标题
            let title = item.firstElementChild.textContent;
            //去除标题中的特殊字符, 有特殊字符时,搜索不准确, 去之
            var keywords = filter_special_chars(item.textContent);
    
            let check_api_json = "https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=search&begin=0&count=10&token=" + TK + "&query=" + keywords + "&f=json";
            // 调用搜索api, 检查是否发表过 (某些情况下原模原样的标题就是搜索不出来, 腾讯的bug)
            fetch(check_api_json)
                .then(res => res.json())
                .then(res => {
                    let json_publish_page = JSON.parse(res.publish_page);
                    let span = '';
                    if (json_publish_page.total_count > 0) {
                        span = get_pub_tip(true, title);
                    } else {
                        span = get_pub_tip(false, title);
                    }
                    tip.innerHTML = span;
                    item.appendChild(tip);
                })
        })
    }

    get_time_send_list()
        .then(res => {
            time_send_list = res;
            fetch_pub_tip();
        })
})();

(function() {
    'use strict';

    // 从存储中获取配置
    let CONFIG = {
        buttonText: '生成草稿',
        formTitle: '提交视频url资源',
        apiUrl: GM_getValue('apiUrl', 'https://app.lfeet.asia/preGenArticle'),
        cookie: GM_getValue('cookie', ''),
        token: window.wx ? window.wx.commonData.data.t : ''
    };

    // 创建按钮
    function createButton() {
        const container = document.querySelectorAll(".weui-desktop-global__extra")[1];
        if (!container) {
            console.error('未找到指定的DOM容器:');
            return;
        }

        const button = document.createElement('button');
        button.className = 'custom-run-button weui-desktop-btn weui-desktop-btn_primary';
        button.textContent = CONFIG.buttonText;
        button.addEventListener('click', toggleForm);

        container.appendChild(button);
    }

    // 创建表单
    function createForm() {
        const overlay = document.createElement('div');
        overlay.className = 'custom-form-overlay';
        overlay.innerHTML = `
            <div class="custom-form-container">
                <div class="custom-form-header">
                    <div class="custom-form-title">${CONFIG.formTitle}</div>
                    <div class="custom-form-close">&times;</div>
                </div>
                <div class="custom-form-body">
                    <div class="custom-form-field">
                        <label class="custom-form-label" for="content">歌曲地址</label>
                        <textarea class="custom-form-textarea" id="content" placeholder="请输入歌曲url链接, 多条按回车分割!"></textarea>
                    </div>
                    <div class="custom-form-message custom-form-message-content"></div>

                    <div class="custom-form-field">
                        <label class="custom-form-label" for="comic">小品地址</label>
                        <textarea class="custom-form-textarea" id="comic" placeholder="请输入小品url链接, 多条按回车分割!"></textarea>
                    </div>
                    <div class="custom-form-message custom-form-message-comic"></div>
                </div>
                <div class="custom-form-footer">
                    <button class="custom-form-button cancel">取消</button>
                    <button class="custom-form-button submit">提交</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 添加事件监听
        const closeBtn = overlay.querySelector('.custom-form-close');
        const cancelBtn = overlay.querySelector('.custom-form-button.cancel');
        const submitBtn = overlay.querySelector('.custom-form-button.submit');
        const textarea = overlay.querySelector('#content');

        const comicTextarea = overlay.querySelector('#comic');
        const messageBox = overlay.querySelector('.custom-form-message');

        // 关闭表单 - 改进版
        function closeForm() {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }

        closeBtn.addEventListener('click', closeForm);
        cancelBtn.addEventListener('click', closeForm);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeForm();
        });

        // 提交表单
        submitBtn.addEventListener('click', () => {
            const content = textarea.value.trim();
            const comicContent = comicTextarea.value.trim();
            if (!content && !comicContent) {
                showMessage('至少填写一项内容', 'error');
                return;
            }
            submitForm({"content": content, "comic": comicContent});
        });

        return overlay;
    }

    // 显示消息
    function showMessage(text, type = 'success') {
        const messageBox = document.querySelector('.custom-form-message');
        if (!messageBox) return;

        messageBox.innerHTML = text;
        messageBox.className = 'custom-form-message ' + (type === 'success' ? 'success' : 'error');
    }

    // 切换表单显示状态
    function toggleForm() {
        let overlay = document.querySelector('.custom-form-overlay');
        if (!overlay) {
            overlay = createForm();
        }
        overlay.classList.toggle('active');
    }


    // 提交表单数据到API
    function submitForm(contentObj) {
        showMessage('文章模板生成中✨ 保持天天输出~😋', 'success');
        const u = window.wx.commonData.data.user_name;
        let api = "https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&begin=0&count=10&token=" + CONFIG.token + "&lang=zh_CN&f=json";
        const content = contentObj.content
        const comicContent = contentObj.comic

        fetch(api)
            .then(s => s.json())
            .then(s => {
            if (s.base_resp.ret === 200040) {
                throw new Error(s.base_resp.err_msg);
            }

            let json_publish_page = JSON.parse(s.publish_page);
            if (json_publish_page.total_count <= 0) {
                throw new Error('没有找到最近发布的文章');
            }
            let list = [];
            json_publish_page.publish_list.forEach(item => {
                let itemObj = JSON.parse(item.publish_info);
                itemObj.appmsg_info.forEach(val => {
                    list.push({ cover: val.pic_cdn_url_235_1, title: val.title, link: val.content_url });
                });
            });

            // 生成草稿
            GM_xmlhttpRequest({
                url: CONFIG.apiUrl,
                method: 'POST',
                headers: {'Content-Type': 'application/json; charset=UTF-8', 'Referer': 'mp.weixin.qq.com'},
                data: JSON.stringify({
                    'c_list': comicContent,
                    'v_list': content,
                    'h_list': list,
                    'u': u,
                    'ck': CONFIG.cookie,
                    'tk': CONFIG.token
                }),
                responseType: "json",
                onload: obj => {
                    var data = obj.response;
                    console.log('remote-resp', data);
                    if (data.status == 0) {
                        let msgTips = '';
                        try {
                            var errDataList = JSON.parse(data.msg);
                            if (Array.isArray(errDataList)) {
                                errDataList.forEach((item, key) => {
                                    msgTips += 'url: ' + item.url + "<br> msg: " + item.msg + '<br><br>';
                                });
                            } else {
                                msgTips = errDataList;
                            }
                        } catch (e) {
                            msgTips = data.msg;
                        }
                        showMessage('生成草稿文章失败👻: <br>' + msgTips, 'error');
                    } else {
                        showMessage('生成草稿文章成功👌 保持天天输出~😋', 'success');

                        setTimeout(() => {
                            const closeBtn = document.querySelector('.custom-form-close');
                            if (closeBtn) {
                                closeBtn.click();
                                location.reload();
                            }
                        }, 1500);
                    }
                },
                onerror: err => {
                    showMessage('提交失败: ' + JSON.stringify(err), 'error');
                    console.error('send-err', err)
                }
            });

        }).catch(err => {
            showMessage('Error: ' + err.message, 'error');
        });

        // .finally(() => {
        //   showMessage('提交成功! 等待服务端生成草稿...', 'success');
        // })

    }

    // 注册菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand("设置API URL", setApiUrl);
        GM_registerMenuCommand("设置Cookie", setCookie);
    }

    // 设置Cookie
    function setCookie() {
        const currentValue = CONFIG.cookie;
        const newValue = prompt("设置Cookie:", currentValue);
        if (newValue !== null) {
            CONFIG.cookie = newValue;
            GM_setValue('cookie', newValue);
            alert("Cookie已更新");
        }
    }

    // 设置API URL
    function setApiUrl() {
        const currentValue = CONFIG.apiUrl;
        const newValue = prompt("设置API URL:", currentValue);
        if (newValue !== null) {
            CONFIG.apiUrl = newValue;
            GM_setValue('apiUrl', newValue);
            alert("API URL已更新");
        }
    }

    // 添加样式
    GM_addStyle(`
        .custom-form-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        }

        .custom-form-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 500px;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        .custom-form-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .custom-form-overlay.active .custom-form-container {
            transform: scale(1);
        }

        .custom-form-header {
            padding: 16px 24px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .custom-form-title {
            font-size: 18px;
            font-weight: 600;
        }

        .custom-form-close {
            font-size: 24px;
            cursor: pointer;
            color: #888;
            transition: color 0.2s;
        }

        .custom-form-close:hover {
            color: #333;
        }

        .custom-form-body {
            padding: 24px;
        }

        .custom-form-field {
            margin-bottom: 16px;
        }

        .custom-form-label {
            display: block;
            margin-bottom: 8px;
            //font-weight: 500;
        }

        .custom-form-textarea {
            width: 95%;
            min-height: 80px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            font-family: inherit;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .custom-form-textarea:focus {
            outline: none;
            border-color: #4a90e2;
        }

        .custom-form-footer {
            padding: 16px 24px;
            border-top: 1px solid #e5e5e5;
            display: flex;
            justify-content: flex-end;
        }

        .custom-form-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background-color: #4a90e2;
            color: white;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-left: 8px;
        }

        .custom-form-button:hover {
            background-color: #3a80d2;
        }

        .custom-form-button.cancel {
            background-color: #f5f5f5;
            color: #333;
        }

        .custom-form-button.cancel:hover {
            background-color: #e5e5e5;
        }

        .custom-run-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background-color: #4a90e2;
            color: white;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
            margin: 10px;
        }

        .custom-run-button:hover {
            background-color: #3a80d2;
        }

        .custom-form-message {
            margin-top: 12px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            display: none;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .custom-form-message.success {
            background-color: #e8f5e9;
            color: #2e7d32;
            display: block;
        }

        .custom-form-message.error {
            background-color: #ffebee;
            color: #c62828;
            display: block;
        }
    `);

    // 初始化
    registerMenuCommands();
    createButton();
})();