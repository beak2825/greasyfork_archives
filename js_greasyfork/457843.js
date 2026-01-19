// ==UserScript==
// @name         复制粘贴填写成绩
// @namespace    zknu.edu.cn
// @match        *://*.zknu.edu.cn/*
// @grant        none
// @version      2026.01.19.02
// @run-at       document-idle
// @author       -
// @license      MIT
// @description  v2026.01.18.01. 增加四舍五入和向下取整统计 v2026.01.17.01. 减少启动提示v2025.07.03.01. 修复缓考的学生带来的跳页v2025.07.02.01. 增加提示内容v2025.07.01.01. 对登分册四舍五入和系统的不一样带来的一分差异给与提示。v2024.1.13.03.代码从2018年开始建立，经过多次的修改，形成了稳定版本。
// @downloadURL https://update.greasyfork.org/scripts/457843/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%A1%AB%E5%86%99%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/457843/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%A1%AB%E5%86%99%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==

//   https://greasyfork.org/zh-CN/scripts/457843
//   https://scriptcat.org/zh-CN/script-show-page/5205
//   https://greasyfork.org/scripts/484693  旧版本
(async function () {

    const msg = "粘贴学号和成绩";
    const hit = "自助版批量粘贴成绩";
    const description = `
    v2026.01.19.02. 修改显示，增加安装和使用视频 https://www.bilibili.com/video/BV1SNkYBjEBa
    v2026.01.18.01. 增加四舍五入和向下取整统计
v2026.01.17.01. 减少启动提示
v2025.07.03.01. 修复缓考的学生带来的跳页
v2025.07.02.01. 增加提示内容
v2025.07.01.01. 对登分册四舍五入和系统的不一样带来的一分差异给与提示。
v2024.1.13.03.代码从2018年开始建立，经过多次的修改，形成了稳定版本。`
    const pingshichengji = "input[name*=_pscj_]";
    const qimochengji = "input[name*=_mkcj_]";
    const zonghechengji = "td[name*=zhcj]";
    const re = /(\d{12})\D*([0-9.]*)\D*([0-9.]*)\D*([0-9.]*)/;
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
    let roundcount = 0, notroundcount = 0, floorcount = 0, notfloorcount = 0,notround=[],notfloor=[]
    win.document.querySelectorAll(".datalist table tr").forEach(function (e) {
        const yhxh = e.querySelector("td[name=yhxh]")
        if (yhxh) {
            const d = dc["xs" + yhxh.innerText] =
                [e.querySelector(pingshichengji),
                e.querySelector(qimochengji),
                e.querySelector(zonghechengji)]
            if (d[0].value > 0) {
                const score = d[0].value * 0.4 + d[1].value * 0.6
                const d2 = d[2].textContent * 1
                if (Math.abs(d2 - Math.round(score, 0)) < 0.001)
                    roundcount += 1
                else
                { notroundcount += 1
                notround.push(yhxh.innerText)
                }
                if (Math.abs(d2 - Math.floor(score, 0)) < 0.001)
                    floorcount += 1
                else{ notfloorcount += 1
                notfloor.push(yhxh.innerText)}
            }
        }
    });

    let m = "";
    if(roundcount>0||notroundcount>0)
    m += (`使用四舍五入的数量:${roundcount},未使用四舍五入的数量${notroundcount}\n${notround.join(",")}\n`)
     if(floorcount>0||notfloorcount>0)
    m += (`使用向下取整的数量:${floorcount},未使用向下取整的数量${notfloorcount}\n${notfloor.join(", ")}\n`)
    if (m) alert(m)

    function createElement(type, attrs, events) {
        const ele = document.createElement(type);
        for (const attr in attrs) ele[attr] = attrs[attr];
        for (const event in events) ele.addEventListener(event, e => events[event](e));
        return ele;
    }
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
                        const [, xh, ps, qm, zh] = matchs
                        if (dc["xs" + xh] && dc["xs" + xh][0]) {
                            dc["xs" + xh][0].focus();
                            dc["xs" + xh][0].value = ps;
                            dc["xs" + xh][0].blur();
                            dc["xs" + xh][1].focus();
                            dc["xs" + xh][1].value = qm;
                            dc["xs" + xh][1].blur();
                            if (zh && dc["xs" + xh][2].innerText * 1 != zh * 1) {
                                msg += `${matchs[1]} 综合成绩存在差异：登分册：${zh * 1} 系统 ${dc["xs" + xh][2].innerText * 1} \n`
                                dc["xs" + xh][0].style.background = "yellow";
                                dc["xs" + xh][1].style.background = "yellow";
                                dc["xs" + xh][2].style.background = "yellow";
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
                id: "b" + uid, innerText: hit, type: 'button', title: description, style: "padding:6px 12px; border: 1px solid #0085C2;border-radius: 3px;background-color: #F5FAFF;color:red; margin-right: 5px; cursor: pointer; "
            },
            {
                click: () => {
                    ta.style.display = ta.style.display !== "none" ? "none" : "block";
                },

            }
        )
    );

    function showFixedPrompt(message, doc = document) {
        let countdown = 5, interval = null;
        const overlay = createElement('div', {
            style: `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.5); z-index: 9998;`
        }, { click: () => countdown > 2 && (countdown = 0) });
        doc.body.appendChild(overlay);
        const prompt = createElement('div', {
            style: `position: fixed; top: 10vh; left: 50vw; transform: translate(-50%,0);
                background: #333; color: #fff; padding: 20px 30px; border-radius: 10px;
                font-size: 16px; z-index: 9999; text-align: left; white-space: pre-wrap;`
        });
        doc.body.appendChild(prompt);
        const countdownEl = createElement('span');
        prompt.append(countdownEl, doc.createElement('br'), message);
        countdownEl.textContent = `剩余 ${countdown} 秒关闭`;
        interval = setInterval(() => {
            countdownEl.textContent = `剩余 ${--countdown} 秒关闭`;
            if (countdown <= 0) {
                clearInterval(interval);
                prompt.remove();
                overlay.remove();
            }
        }, 1000);
    }
    if (!localStorage.getItem("showFixedPromptAtStart") || Date.now() - parseInt(localStorage.getItem("showFixedPromptAtStart")) > 1000 * 3600 * 7) {
        showFixedPrompt("加载手动复制粘贴成绩成功\n" + description, pdoc);
        localStorage.setItem("showFixedPromptAtStart", Date.now())
    }

})();
