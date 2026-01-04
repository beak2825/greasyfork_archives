// ==UserScript==
// @name        赢火虫开发增强
// @namespace   Violentmonkey Scripts
// @match       https://twww.winhc.net/searchCompany/*
// @match       https://www.winhc.cn/searchCompany/*
// @match       https://yun.winhc.cn/searchCompany/*
// @match       https://yun.winhc.net/searchCompany/*
// @exclude     https://twww.winhc.net/searchCompany/list*
// @exclude     https://yun.winhc.cn/searchCompany/list*
// @exclude     https://yun.winhc.net/searchCompany/list*
// @exclude     https://www.winhc.cn/searchCompany/list*
// @grant       none
// @version     1.7.3
// @author      zzl221000
// @license     CC BY-NC-ND
// @require     https://greasyfork.org/scripts/426194-toast-js/code/toastjs.js?version=971661
// @description winhc exhance
// @downloadURL https://update.greasyfork.org/scripts/523619/%E8%B5%A2%E7%81%AB%E8%99%AB%E5%BC%80%E5%8F%91%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/523619/%E8%B5%A2%E7%81%AB%E8%99%AB%E5%BC%80%E5%8F%91%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const init = () => {
       const getFieldValue=(ele,fieldName) =>{
        const tds = ele.querySelectorAll('td');
        for (let td of tds) {
            if (td.textContent.trim() === fieldName) {
                const nextTd = td.nextElementSibling;
                if (nextTd) {
                    // 提取文本内容，并去掉子节点如 <span>复制</span>
                    return nextTd.innerText.trim().split('\n')[0].trim();
                }
            }
        }
        return null;
    }
        document.body.style.background = '#f2f6f9';

        const createCss = (css) => {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.textContent = css;
            document.head.appendChild(style);
        };

        createCss(`
            .gongshang-box td .span-copy {
                display: none;
                float: right;
            }
            td:hover .span-copy {
                display: inline-block;
                color: #128bed;
                cursor: pointer;
            }
        `);

        if (!document.querySelector('.name-tag .right-btn')) return;
        console.log('我的脚本加载了');

        const addCss = (css) => {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.insertBefore(style, document.head.firstChild);
        };
        const doc = document;
        var head = doc.head;

        var _css = doc.createElement("style");

        var cssStr = "\n[class|=coco],[class|=coco]::after,[class|=coco]::before{box-sizing:border-box;outline:0}.coco-msg-progress{width:14px;height:14px}.coco-msg__circle{stroke-width:2;stroke-linecap:square;fill:none;transform:rotate(-90deg);transform-origin:center}.coco-msg-stage:hover .coco-msg__circle{-webkit-animation-play-state:paused!important;animation-play-state:paused!important}.coco-msg__background{stroke-width:2;fill:none}.coco-msg-stage{position:fixed;top:20px;left:50%;width:auto;transform:translate(-50%,0);z-index:3000}.coco-msg-wrapper{position:relative;left:50%;transform:translate(-50%,0);transition:height .25s ease-out,padding .25s ease-out;transition:height .35s ease-out,padding .35s ease-out;padding:8px 0;will-change:transform,opacity}.coco-msg-content,.coco-msg-icon,.coco-msg-wait{display:inline-block}.coco-msg-icon{position:relative;width:13px;height:13px;border-radius:100%;display:flex;justify-content:center;align-items:center;opacity:.8}.coco-msg-icon svg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:11px;height:11px;box-sizing:content-box}.coco-msg-wait{width:20px;height:20px;position:relative}.coco-msg-wait svg{position:absolute;top:50%;right:-4px;transform:translate(0,-50%);fill:#b3b9b9}.coco-msg-close{width:16px;height:16px}.coco-msg-content{margin:0 10px;min-width:220px;text-align:left;font-size:14px;font-weight:400}.coco-msg.error .coco-msg-icon,.coco-msg.info .coco-msg-icon,.coco-msg.success .coco-msg-icon,.coco-msg.warning .coco-msg-icon{background-color:currentColor}.coco-msg{padding:13px 25px;border-radius:2px;position:relative;left:50%;transform:translate(-50%,0);display:flex;align-items:center}.coco-msg.info,.coco-msg.loading{color:#fff;background-color:#2980b9;box-shadow:0 0 1px 0 rgba(239,238,240,.3)}.coco-msg.success{color:#68c43b;background-color:#f0faeb;box-shadow:0 0 1px 0 rgba(145,194,126,.3)}.coco-msg.warning{color:#be820a;background-color:#faf4e1;box-shadow:0 0 1px 0 rgba(212,198,149,.3)}.coco-msg.error{color:#f74e60;background-color:#fee2e5;box-shadow:0 0 1px 0 rgba(218,163,163,.3)}.coco-msg.loading .coco-msg-icon{background-color:transparent}@keyframes coco-msg__circle{0%{stroke:#b3b9b9;stroke:currentColor}to{stroke:#b3b9b9;stroke:currentColor;stroke-dasharray:0 100}}.coco-msg_loading{flex-shrink:0;width:20px;height:20px;position:relative}.coco-msg-circular{-webkit-animation:coco-msg-rotate 2s linear infinite both;animation:coco-msg-rotate 2s linear infinite both;transform-origin:center center;height:18px!important;width:18px!important}.coco-msg-path{stroke-dasharray:1,200;stroke-dashoffset:0;stroke:currentColor;-webkit-animation:coco-msg-dash 1.5s ease-in-out infinite;animation:coco-msg-dash 1.5s ease-in-out infinite;stroke-linecap:round}@-webkit-keyframes coco-msg-rotate{100%{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes coco-msg-rotate{100%{transform:translate(-50%,-50%) rotate(360deg)}}@-webkit-keyframes coco-msg-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px}}@keyframes coco-msg-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px}}.coco-msg-pointer{cursor:pointer}.coco-msg-fade-in{-webkit-animation:coco-msg-fade .22s ease-out both;animation:coco-msg-fade .22s ease-out both}.coco-msg-fade-out{animation:coco-msg-fade .22s linear reverse both}@-webkit-keyframes coco-msg-fade{0%{opacity:0;transform:translate(-50%,0)}to{opacity:1;transform:translate(-50%,0)}}@keyframes coco-msg-fade{0%{opacity:0;transform:translate(-50%,-80%)}to{opacity:1;transform:translate(-50%,0)}}\n      ";
        _css.innerHTML = cssStr;
        if (head.children.length) {
            head.insertBefore(_css, head.children[0]);
        } else {
            head.appendChild(_css);
        }
        const createButton = (id, text, onClick) => {
            const button = document.createElement('button');
            button.id = id;
            button.textContent = text;
            button.style.cssText = `
                width: 116px; height: 38px; border-radius: 4px; background: rgba(0,0,0,0); border: 1px solid #3373fc;
                text-align: center; font-size: 14px; color: #3373fc; line-height: 36px; margin-left: 16px;
                display: inline; cursor: pointer; position: relative;
            `;
            button.onclick = onClick;
            return button;
        };

        const copyText = (text, successMsg = '复制成功', errorMsg = '不支持复制') => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => cocoMessage.success(500, successMsg)).catch(() => cocoMessage.error(500, errorMsg));
            } else {
                alert(errorMsg);
            }
        };

        const button1 = createButton('id001', '复制名称', () => copyText(document.querySelector('.name-tag .name').textContent.trim()));
        const button2 = createButton('id002', '搜企查查', () => window.open(`https://www.qcc.com/web/search?key=${document.querySelector('.name-tag .name').textContent.trim()}`, '_blank'));
        const button3 = createButton('id003', '复制ID', () => {
            const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop) });
            if (!params.no) return cocoMessage.error(500, '当前页没有公司ID');
            copyText(decodeURIComponent(escape(atob(decodeURIComponent(params.no)))));
        });
        const button4 = createButton('id004', '自动更新', () => {
            const gongshangBox = document.querySelector('.data-area.gongshang-box');
            if (!gongshangBox) return;
            const gongshangTable = gongshangBox.querySelector('table');
            const credit_code = getFieldValue(gongshangTable,'统一社会信用代码');
            const reg_number = getFieldValue(gongshangTable,'工商注册号');
            const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop) });
            const company_id = decodeURIComponent(escape(atob(decodeURIComponent(params.no))));
            const company_name = document.querySelector('.name-tag .name').textContent.trim();
            const body = {
                method: 'GET', company_name, credit_code , reg_number, company_id ,
                webhook: `https://bark.loom.run/94PANB6A7wMHhyCp7t7B4c/${company_name}/更新成功?icon=https://winhc.oss-cn-shanghai.aliyuncs.com/webImg/whc.ico`
            };
            fetch('https://matrix.loom.run/update_company?force=true', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            }).then(async res => {
                if (!res.ok) return cocoMessage.error(2000, '自动更新提交失败');
                const resp = await res.json();
                cocoMessage.success(2000, resp.success ? '自动更新已提交，请耐心等待' : '当前公司已经被更新辣');
            }).catch(() => cocoMessage.error(2000, '自动更新提交失败'));
        });

        const rightBtn = document.querySelector('.name-tag .right-btn');
        rightBtn.style.cssText = 'display: flex; flex-wrap: wrap; position: unset; justify-content: flex-end; flex-basis: 100%;';
        rightBtn.prepend(button4, button3, button2, button1);

        const nameTag = document.querySelector('.name-tag');
        nameTag.style.cssText = 'display: flex; flex-wrap: wrap; flex-direction: row; padding-right: 0;';

        const topMain = document.querySelector('.top-main');
        if (topMain) topMain.style.cssText = 'width: 1200px; margin: auto; margin-top: 15px;';
        const gongshangBox = document.querySelector('.data-area.gongshang-box');
        if (!gongshangBox) {
            setTimeout(() => {
                Array.from(document.querySelector('.data-area.gongshang-box').querySelectorAll('td')).forEach((td, idx) => {
                    if (idx % 2 === 0) return;
                    const span = document.createElement('span');
                    span.className = 'span-copy';
                    span.textContent = '复制';
                    span.onclick = () => copyText(td.textContent.trim().slice(0, -2));
                    td.appendChild(span);
                });
            }, 2000)
        } else {

            Array.from(gongshangBox.querySelectorAll('td')).forEach((td, idx) => {
                if (idx % 2 === 0) return;
                const span = document.createElement('span');
                span.className = 'span-copy';
                span.textContent = '复制';
                span.onclick = () => copyText(td.textContent.trim().slice(0, -2));
                td.appendChild(span);
            });

        };

    };

    window.addEventListener('load', init);
})();
