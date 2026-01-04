// ==UserScript==
// @name         验证码识别并回填
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      20251114
// @description  使用ddddocr识别验证码并回填
// @author       hukss
// @match        https://mall.recycloud.cn/
// @match http://mall.yap.dvp
// @match http://mall-admin.yap.dvp
// @include /^http:\/\/.*\:5210\/.*/
// @include /^http:\/\/.*\:5175\/.*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/546593/%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB%E5%B9%B6%E5%9B%9E%E5%A1%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/546593/%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB%E5%B9%B6%E5%9B%9E%E5%A1%AB.meta.js
// ==/UserScript==

(function() {
     /* 等待 JS 把真正的 base64 验证码写进 <img> */
    function waitForRealBase64Img(selector) {
        return new Promise((resolve) => {
            const check = () => {
                const img = document.querySelector(selector);
                if (img && img.src.startsWith('data:image/')) {
                    resolve(img);
                } else {
                    requestAnimationFrame(check); // 每帧检查一次
                }
            };
            check();
        });
    }




    /* ========= 主流程 ========= */
    (async () => {
             /* ------------ 创建按钮 ------------ */
    function addButton() {
        if (document.getElementById('gm-captcha-btn')) return; // 已存在
        const btn = document.createElement('button');
        btn.id = 'gm-captcha-btn';
        btn.textContent = '识别验证码';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            padding: '6px 12px',
            background: '#409eff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
        });
        document.body.appendChild(btn);
        btn.addEventListener('click', handleCaptcha);
    }


         /* ------------ 启动 ------------ */
    // 等 DOM 就绪后再加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButton);
    } else {
        addButton();
    }

         /* ------------ 识别逻辑 ------------ */
/* ------接口代码地址---https://github.com/gdlden/ddddocrDemo--- */
    function handleCaptcha() {
        const img = document.querySelector('.imgCode');
        if (!img || !img.src.startsWith('data:image/')) {
            alert('验证码图片尚未加载完成，请稍后再试');
            return;
        }

        const base64 = img.src;
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://localhost:8889/randomData/getImageCode',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ base64Image: base64 }),
            responseType: 'json',
            onload: (resp) => {
                const result = resp.response;
                if (result && result.data) {
                    const code = result.data.trim();
                    console.log(code);
                    const inputEl = document.querySelector('input[placeholder*="验证码"]');
                    if (inputEl) {
                        inputEl.value = code;
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                } else {
                    console.log(result);
                    alert('识别接口返回异常');
                }
            },
            onerror: () => alert('识别接口调用失败')
        });
    }
    })();
})();