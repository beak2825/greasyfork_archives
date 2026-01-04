// ==UserScript==
// @name        复制粘贴填写成绩 - zknu.edu.cn
// @namespace   Violentmonkey Scripts
// @match       *://*.zknu.edu.cn/*
// @grant       none
// @version     2024.1.13.03
// @run-at      document-idle
// @author      -
// @license     MIT
// @description 代码从2018年开始建立，经过多次的修改，形成了稳定版本。
// @downloadURL https://update.greasyfork.org/scripts/484693/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%A1%AB%E5%86%99%E6%88%90%E7%BB%A9%20-%20zknueducn.user.js
// @updateURL https://update.greasyfork.org/scripts/484693/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%A1%AB%E5%86%99%E6%88%90%E7%BB%A9%20-%20zknueducn.meta.js
// ==/UserScript==
(function () {
    const msg = "粘贴学号和成绩";
    const hit = "自助版批量粘贴成绩";
    const pingshichengji = "input[name*=_pscj_]";
    const qimochengji = "input[name*=_mkcj_]";
    const re = /(\d{12})\D*([0-9\.]*)\D*([0-9\.]*)/;
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
                e.querySelector(qimochengji)]

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
                for (const eachd in dds) {
                    const matchs = re.exec(dds[eachd]);
                    if (matchs && matchs.length == 4) {
                        const xh = matchs[1]
                        const ps = matchs[2]
                        const qm = matchs[3]
                        if (dc["xs" + xh]) {
                            dc["xs" + xh][0].focus();
                            dc["xs" + xh][0].value = ps;
                            dc["xs" + xh][0].blur();
                            dc["xs" + xh][1].focus();
                            dc["xs" + xh][1].value = qm;
                            dc["xs" + xh][1].blur();
                        }
                    }
                }
            }
        }
    );
    pdoc.body.firstChild.before(ta);
    pdoc.getElementById("btnQry").before(
        createElement(
            "span",
            {
                id: "b" + uid, innerText: hit, type: 'button', style: "padding:6px 12px; border: 1px solid #0085C2;border-radius: 3px;background-color: #F5FAFF;color:red; margin-right: 5px; cursor: pointer; "
            },
            {
                click: () => {
                    ta.style.display = ta.style.display !== "none" ? "none" : "block";
                },

            }
        )
    );
})();
