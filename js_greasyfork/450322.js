// ==UserScript==
// @name        知鸟自动答题-平安
// @namespace    xiaoming
// @version      1.0
// @description  平安-知鸟网页可以自动答题
// @author       xiaoming
// @include      *://*.zhi-niao.com/*
// @license MIT
// @icon         https://www.zhi-niao.com/static/images/logo_text-ecf4fa0b447982a63263842e91076b9d.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450322/%E7%9F%A5%E9%B8%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-%E5%B9%B3%E5%AE%89.user.js
// @updateURL https://update.greasyfork.org/scripts/450322/%E7%9F%A5%E9%B8%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-%E5%B9%B3%E5%AE%89.meta.js
// ==/UserScript==

(function () {
    console.log("知鸟答题脚本已经加载");

    function isNull(obj) {
        return "undefined" === typeof obj
            || obj === undefined
            || obj === 'undefined';
    }

    function notNull(obj) {
        return !isNull(obj);
    }


    function initCustomPanel() {
        if ("undefined" !== typeof courseWareJson) {
            console.log("找到答案");
            const courseIntroduction = courseWareJson.courseIntroduction;
            for (const page of courseWareJson.pageList) {
                if (page === undefined || page.componentList === undefined
                    || page.componentList === 'undefined'
                    || page.componentList.length === 0) {
                    continue
                }
                console.log("size:" + page.componentList.length)
                const list = page.componentList[0].list;
                let msg = '';
                for (const qu in list) {
                    for (const c in list[qu].choice) {
                        if (list[qu].choice[c].checked) {
                            msg += list[qu].choice[c].id;
                        }
                    }
                    msg += "; ";
                }
                let panel = document.createElement('div');
                panel.setAttribute("style", "position:fixed;left:10px;top:10px;background:rgba(51,133,255,0.4);padding:20px;box-shadow:0 0 10px #002761;border-radius:3px;color:white");
                panel.innerHTML = `
                    <div style="">
                        <a style="color: white;text-decoration: none;font-size: 16px" href="javascript:sendDaMessage('${courseIntroduction}','${msg}')">${courseIntroduction}</a><br>
                    </div>
                    
                    <div style="">
                        ${msg}
                    </div>
                `;
                document.body.appendChild(panel);
            }
        }
    }
    setTimeout(initCustomPanel, 2000)

})();