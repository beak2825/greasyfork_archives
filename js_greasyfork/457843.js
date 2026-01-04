// ==UserScript==
// @name        复制粘贴填写成绩
// @namespace   zknu.edu.cn
// @match       *://*.zknu.edu.cn/*
// @grant       none
// @version     2025.07.03.01
// @run-at      document-idle
// @author      -
// @license     MIT
// @description v2024.1.13.03.代码从2018年开始建立，经过多次的修改，形成了稳定版本。v2025.07.01.01. 对登分册四舍五入和系统的不一样带来的一分差异给与提示。导入完毕之后注意提示和红色的分数，在登分册上重新修改。
// @downloadURL https://update.greasyfork.org/scripts/457843/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%A1%AB%E5%86%99%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/457843/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%A1%AB%E5%86%99%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==
//   https://greasyfork.org/scripts/484693/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%A1%AB%E5%86%99%E6%88%90%E7%BB%A
(function () {
    const msg = "粘贴学号和成绩";
    const hit = "自助版批量粘贴成绩";
    const title = `v2024.1.13.03.代码从2018年开始建立，经过多次的修改，形成了稳定版本。
v2025.07.01.01. 对登分册四舍五入和系统的不一样带来的一分差异给与提示。
v2025.07.02.01. 增加提示内容
v2025.07.03.01. 修复缓考的学生带来的跳页`
    const pingshichengji = "input[name*=_pscj_]";
    const qimochengji = "input[name*=_mkcj_]";
    const zonghechengji = "td[name*=zhcj]";
    const re = /(\d{12})\D*([0-9\.]*)\D*([0-9\.]*)\D*([0-9\.]*)/;
    const uid = hit;

    const getwin = win => {
        if (win) {
            if (win.document.querySelector(pingshichengji)) {
                return win;
            }
            for (let i = 0; i < win.frames.length; i++) {
                const frame = getwin(win.frames[i]);
                if (frame) {
                    return frame;
                }
            }
        }
    };
    const win = getwin(window);
    if (!win) return;
    const pdoc = win.parent.document;
    if (pdoc.querySelector("#" + uid)) {
        pdoc.querySelector("#" + uid).remove();
        pdoc.querySelector("#b" + uid).remove();
    }

    const dc = {};
    win.document.querySelectorAll(".datalist table tr").forEach(function (e) {
        const yhxh = e.querySelector("td[name=yhxh]")
        if (yhxh) {
            dc["xs" + yhxh.innerText] =
                [e.querySelector(pingshichengji),
                e.querySelector(qimochengji),
                e.querySelector(zonghechengji)]

        };
    });
    const createElement = (type, attrs, events) => {
        const ele = document.createElement(type);
        for (const attr in attrs) ele[attr] = attrs[attr];
        for (const event in events) ele.addEventListener(event, e => events[event](e));
        return ele;
    };
    const ta = createElement(
        "textarea",
        { id: uid, innerText: msg, style: "width:100%;height:125px" },
        {
            change: () => {
                const txt = ta.value;
                const dds = txt.split("\n");
                let msg = ''
                for (const eachd in dds) {
                    const matchs = re.exec(dds[eachd]);
                    if (matchs && matchs.length > 4) {
                        const xh = matchs[1]
                        const ps = matchs[2]
                        const qm = matchs[3]
                        const zh = matchs[4]
                        if (dc["xs" + xh] && dc["xs" + xh][0]) {
                            dc["xs" + xh][0].focus();
                            dc["xs" + xh][0].value = ps;
                            dc["xs" + xh][0].blur();
                            dc["xs" + xh][1].focus();
                            dc["xs" + xh][1].value = qm;
                            dc["xs" + xh][1].blur();
                            if (zh && dc["xs" + xh][2].innerText * 1 != zh * 1) {
                                msg += `${matchs[1]} 综合成绩存在差异：登分册：${zh * 1} 系统 ${dc["xs" + xh][2].innerText * 1} \n`
                                dc["xs" + xh][0].style.background = "red";
                                dc["xs" + xh][1].style.background = "red";
                                dc["xs" + xh][2].style.background = "red";
                            } else {

                                dc["xs" + xh][0].style.background = "";
                                dc["xs" + xh][1].style.background = "";
                                dc["xs" + xh][2].style.background = "";
                            }
                        }
                    }
                }
                if (msg) {
                    setTimeout(function () { alert(msg) })

                }
            }
        }
    );
    pdoc.body.firstChild.before(ta);
    pdoc.getElementById("btnQry").before(
        createElement(
            "span",
            {
                id: "b" + uid, innerText: hit, type: 'button', title: title, style: "padding:6px 12px; border: 1px solid #0085C2;border-radius: 3px;background-color: #F5FAFF;color:red; margin-right: 5px; cursor: pointer; "
            },
            {
                click: () => {
                    ta.style.display = ta.style.display !== "none" ? "none" : "block";
                },

            }
        )
    );
    function showFixedPrompt(message, doc = document) {
        const overlay = doc.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.5)', zIndex: 9998
        });
        doc.body.appendChild(overlay);

        const prompt = doc.createElement('div');
        Object.assign(prompt.style, {
            position: 'fixed', top: '10vh', left: '50vw', transform: 'translate(-50%,0)',
            background: '#333', color: '#fff', padding: '20px 30px',
            borderRadius: '10px', fontSize: '20px', zIndex: 9999, textAlign: 'left',
            whiteSpace: 'pre-wrap'
        });
        doc.body.appendChild(prompt);

        const countdownEl = prompt.appendChild(doc.createElement('span'));
        prompt.appendChild(doc.createElement('br'));
        prompt.appendChild(doc.createTextNode(message));

        let countdown = 5;
        countdownEl.textContent = `剩余 ${countdown} 秒关闭`;

        const interval = setInterval(() => {
            countdown--;
            countdownEl.textContent = `剩余 ${countdown} 秒关闭`;
            if (countdown <= 0) {
                clearInterval(interval);
                prompt.remove();
                overlay.remove();
            }
        }, 1000);

        overlay.addEventListener('click', () => { if (countdown > 2) countdown = 2; });
    }

    showFixedPrompt("加载手动复制粘贴成绩成功\n" + title, pdoc);

})();
