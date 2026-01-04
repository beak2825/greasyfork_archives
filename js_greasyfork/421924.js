// ==UserScript==
// @name         优学院查题
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  查题
// @author       fffkyxy
// @match        */umooc/user/study.do*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      ulearn.ga
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/421924/%E4%BC%98%E5%AD%A6%E9%99%A2%E6%9F%A5%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/421924/%E4%BC%98%E5%AD%A6%E9%99%A2%E6%9F%A5%E9%A2%98.meta.js
// ==/UserScript==

"use strict";
const set = {
    get_answer: "https://ulearn.ga/get_answer",
    upload_data: "https://ulearn.ga/upload_data",
    heartbeat: "https://ulearn.ga/heartbeat",
    dragging: false,
    left: 0,
    top: 0,
    uid: -1,
    timestamp: -1,
};
const ITF = {
    post_form: function (url, data, onload, onerror) {
        ITF.post(url, data, onload, onerror, { "Content-Type": "application/x-www-form-urlencoded" });
    },
    post: function (url, data, onload, onerror, headers) {
        let data_form = new FD();
        for (let value in data) {
            data_form.append(value, data[value]);
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            data: data_form.text,
            onload: onload,
            onerror: onerror,
        });
    },
    get: function (url, data, onload, onerror) {
        let data_form = new FD();
        for (let value in data) {
            data_form.append(value, data[value]);
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: url + "?" + data_form.text,
            onload: onload,
            onerror: onerror,
        });
    },
    upload_api: function (data) {
        if (set.uid == -1) {
            setTimeout(ITF.upload_api, 1000, data);
        }
        else {
            ITF.post_form(set.upload_data, {
                uid: "" + set.uid,
                data: JSON.stringify(data),
            });
        }
    },
    upload_eidpid: function (eid, pid) {
        ITF.upload_api({ type: 3, eid: eid, pid: pid });
    },
    upload_paper: function (paper, pid) {
        ITF.upload_api({ type: 4, pid: pid, paper: paper });
    },
    upload_answer: function (answer, pid) {
        ITF.upload_api({ type: 5, pid: pid, answer: answer });
    },
    upload_title: function (title, qid) {
        ITF.upload_api({ type: 6, qid: qid, title: title });
    },
    get_answer: function (qid, td) {
        ITF.get(set.get_answer, { uid: "" + set.uid, qid: qid }, function (xhr) {
            if (xhr.status == 200) {
                try {
                    let data = JSON.parse(xhr.responseText);
                    if (data.code == 1) {
                        td.innerText = data.answer;
                        td.addEventListener("click", function () {
                            GM_setClipboard(data.answer);
                        });
                        return;
                    }
                    else if (data.code == 0) {
                        td.innerText = "无答案";
                        return;
                    }
                }
                catch (e) { }
            }
            td.innerText = "服务器错误";
        }, function () {
            td.innerText = "服务器错误";
        });
    },
};
Re_Write();
Get_Uid();
Init();
function Re_Write() {
    const open = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function () {
        let url = arguments[1];
        if (url) {
            if (url.match(/getPaperForStudent/) && url.match(/examId=(\d+)/) && url.match(/paperID=(\d+)/)) {
                let examID = url.match(/examId=(\d+)/)[1];
                let paperID = url.match(/paperID=(\d+)/)[1];
                this.addEventListener('load', () => {
                    let data = JSON.parse(this.responseText);
                    ITF.upload_paper(data, paperID);
                });
                ITF.upload_eidpid(examID, paperID);
            }
            else if (url.match(/getCorrectAnswer/) && url.match(/examID=(\d+)/) && url.match(/paperID=(\d+)/)) {
                let examID = url.match(/examID=(\d+)/)[1];
                let paperID = url.match(/paperID=(\d+)/)[1];
                this.addEventListener('load', () => {
                    let data = JSON.parse(this.responseText);
                    ITF.upload_answer(data, paperID);
                });
                ITF.upload_eidpid(examID, paperID);
            }
        }
        return open.apply(this, arguments);
    };
}
function Init() {
    if (!document.body) {
        setTimeout(Init, 100);
        return;
    }
    let style = document.createElement("style");
    style.innerHTML = `
    #answer_key {
        min-height: 22px;
        max-height: 200px;
        overflow: auto;
    }
    .td_center {
        text-align: center;
    }
    .td_left {
        text-align: left;
    }
    .td_right {
        text-align: right;
    }
    .td_width {
        width: 125px;
    }`;
    let div = document.createElement("div");
    div.setAttribute("style", "background-color: #4fc8db; position: fixed; top: 54px; right: 10px; width: 270px; opacity: 0.75; border-style: dotted; border-width: 3px;");
    div.innerHTML = `
    <h3 style="text-align: center;">Ulearning 查题</h3>
    <table>
        <tbody>
            <tr>
                <td class="td_width td_center">
                    <button id="get_answer" style="background-color: #84f584; border-radius: 10px;">查询答案</button>
                </td>
                <td class="td_width td_center">
                    <button id="hide_show" style="background-color: #84f584; border-radius: 10px;">显示/隐藏答案</button>
                </td>
            </tr>
            <tr>
                <td class="td_width td_right">
                    服务器状态：
                </td>
                <td id="server_status" class="td_width td_left" style="font-color: blue;">
                    未知
                </td>
            </tr>
        </tbody>
    </table>
    <div id="answer_key" style="display: block;">
        <table border="1" id="answer_table">
            <tbody>
                <tr>
                    <th class="td_width td_center">题目</th>
                    <th class="td_width td_center">答案</th>
                </tr>
            </tbody>
        </table>
    </div>
    `;
    document.body.appendChild(style);
    document.body.appendChild(div);
    Bind();
    div.addEventListener("mousedown", function (e) {
        set.dragging = true;
        let mer = div.getBoundingClientRect();
        set.left = e.clientX - mer.left;
        set.top = e.clientY - mer.top;
    });
    div.addEventListener("mouseup", function () {
        set.dragging = false;
    });
    div.addEventListener("mousemove", function (e) {
        if (set.dragging) {
            let x = e.clientX - set.left;
            let y = e.clientY - set.top;
            div.style.left = x + "px";
            div.style.top = y + "px";
        }
    });
}
function Bind() {
    let get_answer = document.querySelector("#get_answer");
    get_answer && (function () {
        get_answer.addEventListener("click", Get_Answer, false);
    })();
    let hide_show = document.querySelector("#hide_show");
    hide_show && (function () {
        hide_show.addEventListener("click", function () {
            let answer_key = document.querySelector("#answer_key");
            answer_key && (function () {
                answer_key.getAttribute("style") === "display: block;" && (function () {
                    answer_key.setAttribute("style", "display: none;");
                    return true;
                })() || (function () {
                    answer_key.setAttribute("style", "display: block;");
                })();
            })();
        }, false);
    })();
}
function Get_Uid() {
    if (unsafeWindow.exam && unsafeWindow.exam.userID) {
        set.timestamp = new Date().getTime();
        set.uid = unsafeWindow.exam.userID;
        setInterval(Heart, 20000);
    }
    else {
        setTimeout(Get_Uid, 50);
    }
}
function Heart() {
    let server_status = document.querySelector("#server_status");
    if (server_status) {
        ITF.get(set.heartbeat, { uid: "" + set.uid, timestamp: "" + set.timestamp }, function (xhr) {
            try {
                let xhr_json = JSON.parse(xhr.responseText);
                if (xhr_json.code == 1) {
                    server_status.innerText = "正常";
                    return;
                }
            }
            catch (e) { }
            server_status.innerText = "异常";
        }, function () {
            server_status.innerText = "异常";
        });
    }
}
function Clear_Table() {
    let answer_table = document.querySelector("#answer_table");
    answer_table && (function () {
        while (answer_table.rows.length > 1) {
            answer_table.deleteRow(1);
        }
    })();
}
function Get_Answer() {
    Clear_Table();
    document.querySelectorAll(".cont").forEach(function (item) {
        item.childNodes.forEach(function (div) {
            if (div.className.indexOf("part-toggle") != -1) {
                return;
            }
            switch (div.className) {
                case "multiple-choices":
                case "judge":
                case "fill":
                case "match":
                case "sort":
                    t1(div);
                    break;
                case "blankFill":
                case "cloze":
                default:
                    t2(div);
            }
        });
    });
}
function t2(div) {
    let title = div.querySelector(".ques-item-title");
    let title_text = title && title.innerText || "";
    let answer_table = document.querySelector("#answer_table");
    answer_table && (function () {
        let tr = answer_table.insertRow();
        tr.insertCell().innerText = title_text;
        tr.insertCell();
        let items = div.querySelector(".ques-item-content");
        items && items.childNodes.forEach(function (item) {
            let qid = item.getAttribute("data-id") || "";
            let tr = answer_table.insertRow();
            tr.insertCell().innerText = get_title(item);
            let t = tr.insertCell();
            ITF.get_answer(qid, t);
        });
    })();
}
function t1(div) {
    let fC = div.firstChild;
    let qid = check_id(fC);
    if (!qid) {
        return;
    }
    let title = get_title(fC);
    let answer_table = document.querySelector("#answer_table");
    answer_table && (function () {
        let tr = answer_table.insertRow();
        tr.insertCell().innerText = title;
        let t = tr.insertCell();
        ITF.get_answer(qid, t);
        ITF.upload_title(title, qid);
    })();
}
function get_title(fC) {
    let title = fC.querySelector(".left");
    let title_text = title && title.innerText || "";
    return title_text;
}
function check_id(fC) {
    let qid = fC.getAttribute("data-id") || "";
    if (!qid || qid.match(/[^0-9]/)) {
        return false;
    }
    return qid;
}
class FD {
    constructor() {
        this.text = "";
        this.data = [];
    }
    append(k, v) {
        this.data.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
        this.text = this.data.join("&").replace(/%20/g, "+");
    }
}
