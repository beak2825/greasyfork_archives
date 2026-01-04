// ==UserScript==
// @name         破解立知
// @namespace    https://ez118.github.io/
// @version      8.0.1
// @description  立知课堂破解工具，提供丰富功能（由上海市某中学的多位青年于2022上海疫情风控时期共同开发、支持、调试和维护）
// @author       ZZY_WISU
// @match        https://*.imlizhi.com/slive/pc/*
// @match        https://easilive.seewo.com/*
// @license      GPL3
// @icon         https://cstore-en-public-tx.seewo.com/easinote5_public/da0ab8b50ba740babd492b5aa6f2fc7f
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://unpkg.com/pako@1.0.6/dist/pako.min.js
// @downloadURL https://update.greasyfork.org/scripts/441933/%E7%A0%B4%E8%A7%A3%E7%AB%8B%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/441933/%E7%A0%B4%E8%A7%A3%E7%AB%8B%E7%9F%A5.meta.js
// ==/UserScript==

/* 自定义部分 */
let api = "https://s2.imlizhi.com/slive/pc/enow/thumbnail/api/v1/courseware";
let ReaderUrl = "https://easilive.seewo.com/ZZY_WISU/";
let MaxPageNum = 200;
let ShareReaderUrl = "https://pjlz.m-e.top/read/";
let AutoAnswerText = "老师好~😄😄😄";

function ajax(url, func, data) {
    let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) func(xhttp.responseText);
            else if (xhttp.status === 404) func("");
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(data);
};

function OpenExplorer(cid, title, ver) {
    if (GM_getValue('Settings')[1] === "1") {
        let WinTop = (window.screen.availHeight - 350) / 2;
        let WinLeft = (window.screen.availWidth - 640) / 2;
        window.open(
            `${ReaderUrl}@${cid}@${ver}@${encodeURI(title)}`,
            '',
            `width=640, height=400, top=${WinTop}, left=${WinLeft}`
        );
    } else {
        window.open(`${ReaderUrl}@${cid}@${ver}@${encodeURI(title)}`);
    }
};

function GetReplayList() {
    let uid = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    let ts = new Date().getTime();
    ajax(`../apis.json?actionName=GET_PLAYBACK_DETAIL&ts=${ts}`, restxt => {
        if (!restxt) { alert("Oh Shit! 失败了!"); return; }
        let jstr = eval(`(${restxt})`);
        if (jstr.error_code === 0) {
            let OPStr = "";
            [0,1,2,3,4,5,6,7,8,9,10].forEach(i => {
                try { OPStr += `${i+1}. ${jstr.data.capsuleDetail.cwList[i].cwName}\n`; } catch {}
            });
            let k = prompt(`请选择需要打开的课件（填数字编号）\n${OPStr}`, "1");
            let item = jstr.data.capsuleDetail.cwList[k-1];
            OpenExplorer(item.cwId, item.cwName, item.cwVersion);
        }
    }, `{"courseUid":"${uid}"}`);
};

function GetLiveList(){
    let uid = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    let ts = new Date().getTime();
    ajax(`./apis.json?actionName=GET_COURSE_ACCESS_CODE_LIST&t=${ts}`, restxt => {
        if (!restxt) { GetReplayList(); return; }
        let jstr = eval(`(${restxt})`);
        if (jstr.error_code === 0) {
            let OPStr = "";
            [0,1,2,3,4,5,6,7,8,9,10].forEach(i => {
                try { OPStr += `${i+1}. ${jstr.data[i].name}\n`; } catch {}
            });
            let k = prompt(`请选择需要打开的课件（填数字编号）\n${OPStr}`, "1");
            let item = jstr.data[k-1];
            OpenExplorer(item.cid, item.name, item.version);
        }
    }, `{"courseUid":"${uid}"}`);
};

const UnlockLimit = () => {
    try { document.getElementById('enow__non-interacte-hover').style.display = "none"; } catch {}
    try { document.getElementsByClassName("enow__teachingtool-hide")[0].className = "enow__teachingtool"; } catch {}
};

const MsgWordNumBreak = () => {
    try { document.getElementsByClassName("live-chat-send-msg-txt")[0].removeAttribute("maxlength"); } catch {}
};

const RemoveCover = () => {
    try { document.getElementsByClassName('live-poster live-pc-poster')[0].style.visibility = "hidden"; } catch {}
};

const RemoveHand = (mode = "HideHand") => {
    try {
        let hand = document.getElementsByClassName('live-raise-hand live-pc-raise-hand live-student-raise-hand')[0];
        if (mode === "HideHand") hand.style.visibility = "hidden";
        else {
            hand.style.cssText = "width:25px; height:25px; overflow:hidden; border-radius:10px;";
            document.getElementsByClassName('live-raise-hand-item')[0].style.cssText = "width:25px; height:25px;";
        }
    } catch {}
};

const Settings = () => {
    let oldStr = GM_getValue('Settings') || "1000";
    let promptText = `【欢迎使用偏好设置】
请依次填写每项（1 开 0 关）
1. 屏蔽广告
2. 弹窗打开课件
3. 骇客模式（解除限制）
4. 自动填充问候语`;
    let newStr = prompt(promptText, oldStr);
    if (newStr) GM_setValue('Settings', newStr);
};

const GetToken = () => {
    try {
        let head = document.head.innerHTML;
        let tokenStr = head.substring(head.indexOf("window['token']") + 15, head.indexOf("window['cloudAppId']"));
        tokenStr = tokenStr.replace(/[^\w]/g, '').trim();
        if (tokenStr.length === 32) GM_setValue('AuthToken', tokenStr);
        return tokenStr;
    } catch {
        alert("shit");
    }
};

/* 注册菜单 */
GM_registerMenuCommand('浏览教师课件', GetLiveList, 'o');
GM_registerMenuCommand('解除操作课件限制', UnlockLimit, 'u');
GM_registerMenuCommand('解除讨论区字符限制', MsgWordNumBreak, 'm');
GM_registerMenuCommand('移除课前等待遮罩', RemoveCover, 'r');
GM_registerMenuCommand('隐藏举手按钮', () => RemoveHand("HideHand"), 'h');
GM_registerMenuCommand('讨论区刷屏', () => {
    const Send = (con, rid) => {
        let uid = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        let ts = new Date().getTime();
        ajax(`./apis.json?actionName=CHAT_SEND_QUESTION&t=${ts}`, str => {
            if (str) {
                let jstr = eval(`(${str})`);
                // 不做处理
            }
        }, `{"roomId":"${rid}","courseUid":"${uid}","text":"${con}"}`);
    };

    const GetRoomId = () => {
        let uid = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        let ts = new Date().getTime();
        ajax(`./apis.json?actionName=GET_TARGET_COURSE&t=${ts}`, restxt => {
            if (!restxt) return;
            let jstr = eval(`(${restxt})`);
            let rid = jstr.data.roomId;
            let con = prompt("请输入发送内容：", "");
            if (con === null) return;
            let times = parseInt(prompt("请输入发送次数：", "1"),10);
            [1,2,3,4,5,6,7,8,9,10].forEach(i => { if (i <= times) Send(con, rid) });
        }, `{"courseUid":"${uid}"}`);
    };

    GetRoomId();
}, 'g');

GM_registerMenuCommand('查看TOKEN（附说明）', () => {
    prompt("【查看TOKEN】\n复制以下 TOKEN：", GetToken());
}, 'v');

GM_registerMenuCommand('偏好设置', Settings, 's');

/* 主体自执行部分 */
(() => {
    'use strict';
    try { console.log(`Settings: ${GM_getValue('Settings')}`); } catch { GM_setValue('Settings', "1000"); }
    if (!GM_getValue('Settings')) GM_setValue('Settings', "1000");

    let href = window.location.href;
    if (href.startsWith(ReaderUrl)) {
        let [ , data, adds, title ] = href.split("@");
        let version = Number(adds);
        let dochtml = "";
        let obj = [];
        let PageCnt = 0;
        let ShareData = "";

        GM_xmlhttpRequest({
            method: "GET",
            url: `${api}?coursewareId=${data}&version=${version}&resolution=960_640`,
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
            onload: (res) => {
                let filelist = JSON.parse(res.responseText);
                MaxPageNum = filelist.data.length;
                filelist.data.forEach(item => { obj[item.pageIndex] = item.downloadUrl; });
                filelist.data.forEach((item, idx) => {
                    if (obj[idx]) {
                        dochtml += `<img src='${obj[idx]}' title='第${idx+1}页'><br>`;
                        PageCnt++;
                        ShareData += obj[idx].replace("https://cstore-private-bs.seewo.com/easinote/encloud-", "").split("?")[0] + ",";
                    }
                });
                ShareData = window.btoa(pako.gzip(ShareData.replace("undefined", ""), { to: "string" }));
                let script = `<script>function printmode(){
                            document.querySelector(\".msg\").remove();
                            document.querySelector(\".share\").remove();
                            document.querySelector(\"style\").innerText = \"img{ width:100%; margin-top:15px; }\"; setTimeout(window.print(),100);
                          }</script>`;
                let header = `<title>课件浏览器 | ${decodeURI(title)}</title>
                              <meta charset="utf-8">
                              <style>body{background-color:rgb(50,54,57);user-select:none;margin:0;}
                              .ctrl{font-size:14px;border-radius:15px;padding:5px 13px;background-color:rgb(51,51,51);color:#FFF;border:1px solid #CCC;}
                              .msg{position:fixed;top:15px;left:15px;z-index:5;}
                              .share{position:fixed;top:15px;right:15px;z-index:5;}
                              img{width:60%;min-width:600px;margin-top:10px;border-radius:4px;}
                              .printBtn{margin:10px;}a{color:#FFF;text-decoration:none;}</style>`;
                let body = `<body>
                              <div class="ctrl msg"> 共${PageCnt}页 </div>
                              <div class="ctrl share" title="右键此处，复制分享链接">
                                <a href="${ShareReaderUrl}#${ShareData}" target="_blank">分享</a>
                              </div>
                              <center>${dochtml}
                                <button onclick="this.remove();printmode();" class="ctrl printBtn">打印 & PDF 存储模式</button>
                              </center>
                            </body>`;

                document.write(header + script + body);
            },
            onerror: () => {
                document.write("<title>出现问题</title><h2>抱歉，无法获取课件</h2><hr><b>请专心听课吧。</b>");
            }
        });
    } else if (href.split("/")[3] === "preview" || href.split("/")[3] === "course") {
        if (GM_getValue('Settings')[0] === "1") {
            setTimeout(() => {
                try { document.getElementsByClassName('download-app-1s9WLH')[0].remove(); } catch {}
            }, 1000);
        }
    } else if (href.split("/")[3] === "slive" && href.split("/")[5].split("?")[0] === "room") {
        GetToken();
        setTimeout(() => {
            let s = GM_getValue('Settings');
            if (s[2] === "1") {
                UnlockLimit(); RemoveCover(); RemoveHand("MinimizeHand"); MsgWordNumBreak();
            }
            if (s[3] === "1") {
                let ta = document.getElementsByClassName("live-chat-send-msg-txt")[0];
                ta.innerText = AutoAnswerText; ta.focus();
            }
            if (s[0] === "1") {
                try { document.getElementsByClassName('live-download live-topbar-item')[0].style.display = "none"; } catch {}
            }
        }, 4000);
    }
})();
