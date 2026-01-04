// ==UserScript==
// @name         知乎取消关注
// @namespace   https://greasyfork.org/users/831154
// @version      1.0.2
// @author       percy
// @description  知乎快速取消关注
// @match        *://www.zhihu.com/people/*/following*
// @match        https://www.zhihu.com/question/following
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @grant        window.onurlchange
// @license      GPL-3.0 License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457969/%E7%9F%A5%E4%B9%8E%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/457969/%E7%9F%A5%E4%B9%8E%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

'use strict';
let menu_ALL = [
    ['unfollow_members', '取消关注人', '取消关注人', true],
    ['unfollow_columns', '取消关注专栏', '取消关注专栏', true],
    ['unfollow_topics', '取消关注话题', '取消关注话题', true],
    ['unfollow_questions', '取消关注问题', '取消关注问题', true]
];
let menu_ID = [];
for (let i = 0; i < menu_ALL.length; i++) { // 如果读取到的值为 null 就写入默认值
    if (GM_getValue(menu_ALL[i][0]) == null) {
        GM_setValue(menu_ALL[i][0], menu_ALL[i][3])
    }
    ;
}
registerMenuCommand();

// 注册脚本菜单
function registerMenuCommand() {
    if (menu_ID.length > menu_ALL.length) { // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
        for (let i = 0; i < menu_ID.length; i++) {
            GM_unregisterMenuCommand(menu_ID[i]);
        }
    }
    for (let i = 0; i < menu_ALL.length; i++) { // 循环注册脚本菜单
        menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
        if (menu_ALL[i][0] === 'menu_customBlockUsers') {
            if (menu_value('menu_blockUsers')) menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                customBlockUsers()
            });
        } else if (menu_ALL[i][0] === 'menu_customBlockKeywords') {
            if (menu_value('menu_blockKeywords')) menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                customBlockKeywords()
            });
        } else if (menu_ALL[i][0] === 'menu_blockType') {
            menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                menu_setting('checkbox', menu_ALL[i][1], menu_ALL[i][2], true, [menu_ALL[i + 1], menu_ALL[i + 2], menu_ALL[i + 3], menu_ALL[i + 4], menu_ALL[i + 5]])
            });
        } else if (menu_ALL[i][0] != 'menu_blockTypeVideo' && menu_ALL[i][0] != 'menu_blockTypeArticle' && menu_ALL[i][0] != 'menu_blockTypeTopic' && menu_ALL[i][0] != 'menu_blockTypeSearch' && menu_ALL[i][0] != 'menu_blockYanXuan') {
            menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❌'} ${menu_ALL[i][1]}`, function () {
                menu_switch(`${menu_ALL[i][3]}`, `${menu_ALL[i][0]}`, `${menu_ALL[i][2]}`)
            });
        }
    }
    menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 反馈 & 建议', function () {
        window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/457969/feedback', {
            active: true,
            insert: true,
            setParent: true
        });
        window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/457969/feedback', {
            active: true,
            insert: true,
            setParent: true
        });
    });
}

// 菜单开关
function menu_switch(menu_status, Name, Tips) {
    if (menu_status == 'true') {
        GM_setValue(`${Name}`, false);
        GM_notification({
            text: `已关闭 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function () {
                location.reload();
            }
        });
    } else {
        GM_setValue(`${Name}`, true);
        GM_notification({
            text: `已开启 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function () {
                location.reload();
            }
        });
    }
    registerMenuCommand(); // 重新注册脚本菜单
};

// 返回菜单值
function menu_value(menuName) {
    for (let menu of menu_ALL) {
        if (menu[0] == menuName) {
            return menu[3]
        }
    }
}

// 脚本设置
function menu_setting(type, title, tips, line, menu) {
    let _br = '', _html = `<style class="zhihuE_SettingStyle">.zhihuE_SettingRoot {position: absolute;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);width: auto;min-width: 400px;max-width: 600px;height: auto;min-height: 150px;max-height: 400px;color: #535353;background-color: #fff;border-radius: 3px;}
.zhihuE_SettingBackdrop_1 {position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 203;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;overflow-x: hidden;overflow-y: auto;-webkit-transition: opacity .3s ease-out;transition: opacity .3s ease-out;}
.zhihuE_SettingBackdrop_2 {position: absolute;top: 0;right: 0;bottom: 0;left: 0;z-index: 0;background-color: rgba(18,18,18,.65);-webkit-transition: background-color .3s ease-out;transition: background-color .3s ease-out;}
.zhihuE_SettingRoot .zhihuE_SettingHeader {padding: 10px 20px;color: #fff;font-weight: bold;background-color: #3994ff;border-radius: 3px 3px 0 0;}
.zhihuE_SettingRoot .zhihuE_SettingMain {padding: 10px 20px;border-radius: 0 0 3px 3px;}
.zhihuE_SettingHeader span {float: right;cursor: pointer;}
.zhihuE_SettingMain input {margin: 10px 6px 10px 0;cursor: pointer;vertical-align:middle}
.zhihuE_SettingMain label {margin-right: 20px;user-select: none;cursor: pointer;vertical-align:middle}
.zhihuE_SettingMain hr {border: 0.5px solid #f4f4f4;}
[data-theme="dark"] .zhihuE_SettingRoot {color: #adbac7;background-color: #343A44;}
[data-theme="dark"] .zhihuE_SettingHeader {color: #d0d0d0;background-color: #2D333B;}
[data-theme="dark"] .zhihuE_SettingMain hr {border: 0.5px solid #2d333b;}</style>
        <div class="zhihuE_SettingBackdrop_1"><div class="zhihuE_SettingBackdrop_2"></div><div class="zhihuE_SettingRoot">
            <div class="zhihuE_SettingHeader">${title}<span class="zhihuE_SettingClose" title="点击关闭"><svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></span></div>
            <div class="zhihuE_SettingMain"><p>${tips}</p><hr>`
    if (line) _br = '<br>'
    for (let i = 0; i < menu.length; i++) {
        if (GM_getValue(menu[i][0])) {
            _html += `<label><input name="zhihuE_Setting" type="checkbox" value="${menu[i][0]}" checked="checked">${menu[i][1]}</label>${_br}`
        } else {
            _html += `<label><input name="zhihuE_Setting" type="checkbox" value="${menu[i][0]}">${menu[i][1]}</label>${_br}`
        }
    }
    _html += `</div></div></div>`
    document.body.insertAdjacentHTML('beforeend', _html); // 插入网页末尾
    setTimeout(function () { // 延迟 100 毫秒，避免太快
        // 关闭按钮 点击事件
        document.querySelector('.zhihuE_SettingClose').onclick = function () {
            this.parentElement.parentElement.parentElement.remove();
            document.querySelector('.zhihuE_SettingStyle').remove();
        }
        // 点击周围空白处 = 点击关闭按钮
        document.querySelector('.zhihuE_SettingBackdrop_2').onclick = function (event) {
            if (event.target == this) {
                document.querySelector('.zhihuE_SettingClose').click();
            }
            ;
        }
        // 复选框 点击事件
        document.getElementsByName('zhihuE_Setting').forEach(function (checkBox) {
            checkBox.addEventListener('click', function () {
                if (this.checked) {
                    GM_setValue(this.value, true);
                } else {
                    GM_setValue(this.value, false);
                }
            });
        })
    }, 100)
}

//sleep
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//取消关注的人
async function unfollow_members() {
    if (!menu_value('unfollow_members')) return;
    //users
    let elements = document.querySelectorAll('.ContentItem .ContentItem-main');
    for (let e of elements) {
        try {
            let user = e.querySelector('.ContentItem-image .UserLink-link');
            let userUrl = user.getAttribute("href");
            let userId = userUrl.substring(userUrl.lastIndexOf('/') + 1);
            let userName = user.querySelector('img').getAttribute('alt');
            console.log("user:%s,id:%s,http:%s", userName, userId, userUrl);

            let result = await createDialogue("取消关注的人", userName);
            if (result === -1) {
                // 关闭
                return;
            } else if (result === 0) {
                // 取消
                continue;
            } else if (result === 2) {
                // 查看
                window.open(userUrl);
                continue;
            }

            let button = e.querySelector('.ContentItem-extra button');
            if (button.innerText === '已关注') {
                button.click();
                await sleep(20);
            }
        } catch (e) {
            debugger
            console.error('parse user err:', e);
        }
    }
}

// 取消关注的话题
async function unfollow_topics() {
    if (!menu_value('unfollow_topics')) return;
    // topics
    let topics = document.querySelectorAll('.TopicLink');
    for (let topic of topics) {
        try {
            let topicUrl = topic.getAttribute('href');
            let topicId = topicUrl.substring(topicUrl.lastIndexOf('/') + 1);
            let topicText = topic.children[0].innerText;
            console.log("topic:%s,id:%s,http:%s", topicText, topicId, topicUrl);

            let result = await createDialogue("取消关注话题", topicText);
            if (result === -1) {
                // 关闭
                return;
            } else if (result === 0) {
                // 取消
                continue;
            } else if (result === 2) {
                // 查看
                window.open(topicUrl);
                continue;
            }
            fetch(`https://www.zhihu.com/api/v4/topics/${topicId}/followers`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors"
                },
                "referrer": window.location.href,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "DELETE",
                "mode": "cors",
                "credentials": "include"
            }).then(response => {
                let status = response.status;
                console.log("topicId:%s,api operate ret:%s", topicId, status);
            });
        } catch (e) {
            debugger
            console.error('parse topic err:', e);
        }
    }

    // page
    let pageElement = document.querySelector('.Pagination');
    let pageChildren = pageElement.children;
    // let innerText = pageChildren[pageChildren.length-2].innerText;
    // console.log("totalPage text:", innerText);

    let nextPageElement = pageChildren[pageChildren.length - 1];
    let nextText = nextPageElement.innerText;
    if (nextText === '下一页') {
        nextPageElement.click();
    }
}

let qustion_div_refresh = false;

let moreQuestionResolve = function () {
};

// 取消关注的问题
async function unfollow_questions() {
    if (!menu_value('unfollow_questions')) return;
    debugger
    if (window.location.href !== ('https://www.zhihu.com/question/following')) {
        let result = await createDialogue('批量取消关注问题', '即将打开新页面');
        if (result === -1 || result === 0) {
            return;
        }
        window.open('https://www.zhihu.com/question/following');
        return;
    }

    // window.scrollTo(0, 0);

    // 监听 [更多] 这个a标签
    let moreQuestionButton = document.querySelector('.zu-button-more');
    const config = {attributes: true, attributeOldValue: true};
    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('A child node has been added or removed.');
            } else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified. oldValue:' + mutation.oldValue);
                if (mutation.oldValue === 'zg-btn-white zu-button-more' || moreQuestionButton.getAttribute("class") === 'zg-btn-white zu-button-more') {
                    moreQuestionResolve();
                    qustion_div_refresh = true;
                    console.log('qustion_div_refresh:',qustion_div_refresh);
                    // followedQuesions = document.querySelectorAll('.zg-unfollow');
                } else if (mutation.oldValue === 'zg-btn-white zu-button-more') {
                    console.log("更多数据加载中...." + new Date().toLocaleString());
                }
            }
        }
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);
    // 以上述配置开始观察目标节点
    observer.observe(moreQuestionButton, config);


    let i = 0;
    let first = true;
    let followedQuesions = document.querySelectorAll('.zg-unfollow');
    async function do_unfollow_questions() {
        while (i < followedQuesions.length) {
            let question = followedQuesions[i];
            let qustionTop = question.getBoundingClientRect().top;
            i++;
            if (qustionTop < 80) {
                continue;
            }
            if (i === 1) {
                window.scrollTo(0, 10);
            }
            if (followedQuesions.length - i <= 2) {
                console.log("点击[更多]按钮,获取数据...");
                moreQuestionButton.click();
                await new Promise((resolve) => moreQuestionResolve = resolve);
                console.log("after click,data:{}",document.querySelectorAll('.zg-unfollow').length)
            }
            if (i % 10 === 0 || qustion_div_refresh) {
                console.log('qustion_div_refresh---->:',qustion_div_refresh);
                qustion_div_refresh = false;
                followedQuesions = document.querySelectorAll('.zg-unfollow');
            }
            let quesionLink = question.parentNode.parentNode.querySelector('.question_link');
            let questionText = quesionLink.innerText;
            let href = quesionLink.getAttribute('href');
            let quesionId = href.substring(href.lastIndexOf('/') + 1);
            let quesionUrl = `https://www.zhihu.com${href}`;
            let scrollHeight = window.scrollY + qustionTop;
            console.log("i:%s/%s,qustion:%s,id:%s,%s", i, followedQuesions.length, questionText, quesionId, quesionUrl);
            let onCreate = !first ? undefined : function () {
                console.log("scrollHeight:", scrollHeight);
                document.getElementById("percyMsgBox").children[0].style.top = scrollHeight + 150 + "px";
                first = false;
            };
            let result = await createDialogue('取消关注问题', questionText, false, onCreate);
            console.log("scrollHeight:",scrollHeight);
            document.getElementById("percyMsgBox").children[0].style.top = scrollHeight + 200 + "px";
            window.scrollTo(0, scrollHeight);
            if (result === -1) {
                // 关闭
                return;
            } else if (result === 0) {
                // 取消
                continue;
            } else if (result === 2) {
                // 查看
                window.open(quesionUrl);
                continue;
            }
            question.click();
        }
    }
    await do_unfollow_questions();
    console.log('取消关注问题结束....');
    observer.disconnect();
}

// 自定义 urlchange 事件（用来监听 URL 变化）
function addUrlChangeEvent() {
    history.pushState = (f => function pushState() {
        let ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('urlchange'));
        return ret;
    })(history.pushState);

    history.replaceState = (f => function replaceState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('urlchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('urlchange'))
    });
}


//region 对话框组件
/**
 * 初始化对话框
 */
function initDialogueBox() {
    let percyMsgBoxDiv = document.getElementById("percyMsgBox");
    if (percyMsgBoxDiv != null) {
        return;
    }

    percyMsgBoxDiv = document.createElement("div");
    percyMsgBoxDiv.id = "percyMsgBox";

    percyMsgBoxDiv.style.display = 'none';

    let oDiv = document.createElement("div");

    /*div样式设置*/
    oDiv.style.backgroundColor = "#F0F0F0";
    oDiv.style.position = "absolute";
    oDiv.style.borderColor = "#AEC7E1";
    oDiv.style.borderWidth = "4px";
    oDiv.style.borderTopWidth = "30px";
    oDiv.style.borderStyle = "solid";
    oDiv.style.width = "250px";
    oDiv.style.height = "120px";

    /*根据网页宽度 和窗口大小 来调整左边和顶边,使其居中显示*/
    let w = parseInt(document.documentElement.scrollWidth || document.body.scrollWidth);
    let h = parseInt(document.documentElement.scrollHeight || document.body.scrollHeight);
// oDiv.style.left = (w - parseInt(oDiv.style.width)) / 5 * 2 + "px";
// oDiv.style.top = (h - parseInt(oDiv.style.height)) / 5 * 2 + "px";

    oDiv.style.left = (w - parseInt(oDiv.style.width)) / 5 * 2 + "px";
    oDiv.style.top = window.screen.availWidth / 6 + 'px';

//region 创建子元素
    /*创建标题*/
    let titleDiv = document.createElement("div");
    titleDiv.style = "text-align: center;position: relative;top: -26px;";
    let titleSpan = document.createElement("span");
    titleSpan.id = 'percyMsgBoxTitle';
    titleSpan.innerHTML = "title";
    titleSpan.style = "color:red";
    titleDiv.appendChild(titleSpan);
    oDiv.appendChild(titleDiv);

    /*创建关闭按钮*/
    let closeSpan = document.createElement('span');
    closeSpan.innerHTML = 'X';
    let span1style = "background-color:red;position:absolute;top:-27px;right:3px;color:#FFFFFF;";
    span1style += "width:26px;border-radius:3px;text-align:center;line-height:26px;cursor:pointer;position:absolute;";
    closeSpan.style = span1style;
    closeSpan.onclick = function () {
        percyMsgBoxDiv.style.display = "none";
        dialogueResolve(-1);
    };
    oDiv.appendChild(closeSpan);

    /*创建消息*/
    let msgDiv = document.createElement("div");
    msgDiv.style = "text-align:center";
    let msgSpan = document.createElement("span");
    msgSpan.id = 'percyMsg';
    msgSpan.innerHTML = 'message';
    msgSpan.style = "color:red";
    msgDiv.appendChild(msgSpan);
    oDiv.appendChild(msgDiv);

    /*创建确定按钮*/
    let confirmButton = document.createElement("input");
    confirmButton.style = "left:30px;bottom:20px;position:absolute;";
    confirmButton.type = "button";
    confirmButton.value = "确定";
    confirmButton.onclick = function () {
        document.getElementById("percyMsgBox").style.display = "none";
        dialogueResolve(1);
    };
    oDiv.appendChild(confirmButton);

    /*取消按钮*/
    let cancelButton = document.createElement("input");
    cancelButton.style = "right:30px;bottom:20px;position:absolute;";
    cancelButton.type = "button";
    cancelButton.value = "取消";
    cancelButton.onclick = function () {
        document.getElementById("percyMsgBox").style.display = "none";
        dialogueResolve(0);
    };
    oDiv.appendChild(cancelButton);

    /*查看按钮*/
    let detailButton = document.createElement("input");

    detailButton.style = "left:104px;bottom:20px;position:absolute;";
    detailButton.type = "button";
    detailButton.value = "查看";
    detailButton.onclick = function () {
        document.getElementById("percyMsgBox").style.display = "none";
        dialogueResolve(2);
    };
    oDiv.appendChild(detailButton);
//endregion

    percyMsgBoxDiv.appendChild(oDiv);
    document.body.appendChild(percyMsgBoxDiv);

    /*拖动事件处理*/
    oDiv.onmousedown = function (ev) {/*鼠标按下*/
        let disX = ev.clientX - oDiv.offsetLeft;
        let disY = ev.clientY - oDiv.offsetTop;
        // console.log(disY);
        if (disY > 30) {/*使其只拖动标题栏有效*/
            return;
        }
        document.onmousemove = function (ev) {
            let l = ev.clientX - disX;
            let t = ev.clientY - disY;

            oDiv.style.left = l + 'px';
            oDiv.style.top = t + 'px';
        };
        document.onmouseup = function () {/*鼠标松开*/
            document.onmousemove = null;
            document.onmouseup = null
        }
    };
}


let dialogueResolve = function () {
};

/**
 * 创建对话框
 * @param title
 * @param message
 * @param isTop 是否有遮罩
 * @param onCreate 对话框创建完成回调函数
 * @returns {Promise<int>} 返回 -1:关闭 0:取消 1:确定
 */
let initialWidth = null;
let initialHeight = null;

async function createDialogue(title, message, shade, onCreate) {
    if (shade === undefined) {
        shade = true;
    }
    initDialogueBox();
    let percyMsgBoxDiv = document.getElementById("percyMsgBox");
    percyMsgBoxDiv.style.display = "block";
    let div = percyMsgBoxDiv.children[0];
    if (shade) {
        percyMsgBoxDiv.style = "width:100%;height:100%;position:absolute;left:0;top:0;z-index:99;";
        percyMsgBoxDiv.style.height = document.body.clientHeight + "px";
    } else {
        percyMsgBoxDiv.style = "";
        div.style.zIndex = "99";
    }
    if (initialWidth == null || initialHeight == null) {
        initialWidth = parseInt(div.style.width.replace("px", ""));
        initialHeight = parseInt(div.style.height.replace("px", ""));
    }

    document.getElementById("percyMsgBoxTitle").innerText = title;
    document.getElementById("percyMsg").innerText = message;

    let q = Math.pow(message.length / 18, 1 / 5);
    if (q < 1) {
        q = 1;
    }

    div.style.width = initialWidth * q + "px";
    div.style.height = initialHeight * q + "px";

    console.log('q:%s,w:%,h:%s', q, div.style.width, div.style.height);

    // 调整查看按钮的位置
    let buttons = percyMsgBoxDiv.querySelectorAll('input[type=button]');
    let a = buttons[0].getClientRects()[0].x;
    let b = buttons[1].getClientRects()[0].x;

    let a_left = buttons[0].style.left;
    a_left = parseInt(a_left.replace("px", ''));
    a_left += ((b - a) / 2);

    // 查看按钮
    buttons[2].style.left = a_left + "px";

    if (onCreate !== null && onCreate !== undefined) {
        onCreate();
    }

    return new Promise(function (resolve) {
        dialogueResolve = resolve;
    });
}

//endregion

(function () {
    if (window.onurlchange === undefined) {
        addUrlChangeEvent();
    } // Tampermonkey v4.11 版本添加的 onurlchange 事件 grant，可以监控 pjax 等网页的 URL 变化
    window.addEventListener('urlchange', function () { // 针对的是从单个回答页跳转到完整回答页时
        // Violentmonkey 比 Tampermonkey 加载更早，会导致一些元素还没加载，因此需要延迟一会儿
        // Tampermonkey 4.18.0 版本可能需要延迟一会执行
        if (GM_info.scriptHandler === 'Violentmonkey' || (GM_info.scriptHandler === 'Tampermonkey' && parseFloat(GM_info.version.slice(0, 4)) >= 4.18)) {
            setTimeout(start, 300);
        } else {
            start();
        }
    });

    // Violentmonkey 比 Tampermonkey 加载更早，会导致一些元素还没加载，因此需要延迟一会儿
    // Tampermonkey 4.18.0 版本可能需要延迟一会执行
    if (GM_info.scriptHandler === 'Violentmonkey' || (GM_info.scriptHandler === 'Tampermonkey' && parseFloat(GM_info.version.slice(0, 4)) >= 4.18)) {
        setTimeout(start, 300);
    } else {
        start();
    }

    function start() {
        debugger
        let flag = location.pathname.startsWith('/people/');
        if (flag && (location.pathname.endsWith('/following') || location.pathname.includes('/following?page'))) { //       关注的人
            console.log('取消关注的人');
            unfollow_members().then(r => console.log(r)); //取消关注的人
            return;
        }
        if (flag && location.pathname.includes('/following/columns')) { // 关注的专栏
            console.log('取消关注的专栏');
            // unfollow_columns(); //  取消关注的专栏
            return;
        }
        if (flag && location.pathname.includes('/following/topics')) { //   关注的话题
            console.log('取消关注的话题');
            unfollow_topics().then(r => console.log(r)); // 取消关注的话题
            return;
        }
        if ((flag && location.pathname.includes('/following/questions')) || window.location.href === 'https://www.zhihu.com/question/following') { //    关注的问题
            console.log('取消关注的问题');
            unfollow_questions().then(r => console.log(r)); // 取消关注的问题
            return;
        }
    }
})();
