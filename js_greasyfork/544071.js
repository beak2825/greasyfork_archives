// ==UserScript==
// @name         v2ex 刷新获取活跃
// @description  通过刷新页面，获取 v2ex 的活跃度
// @version      1.0.2
// @match        https://v2ex.com/
// @run-at       document-idle
// @icon         https://v2ex.com/static/favicon.ico
// @license MIT
// @namespace https://greasyfork.org/users/1363215
// @downloadURL https://update.greasyfork.org/scripts/544071/v2ex%20%E5%88%B7%E6%96%B0%E8%8E%B7%E5%8F%96%E6%B4%BB%E8%B7%83.user.js
// @updateURL https://update.greasyfork.org/scripts/544071/v2ex%20%E5%88%B7%E6%96%B0%E8%8E%B7%E5%8F%96%E6%B4%BB%E8%B7%83.meta.js
// ==/UserScript==

(function() {
    const timeout = 500
    function bootstrap() {
        let timer = null
        const toggleHuoyue = (e) => {
            const sign = Number(localStorage.getItem('V2EX_HUOYUE') || '0')
            const alreadyHuoyue = sign === 1
            if (e){
                localStorage.setItem('V2EX_HUOYUE', alreadyHuoyue ? 0 : 1)
                const $huoyueBtn = document.getElementById('huoyue')
                if(alreadyHuoyue){
                    $huoyueBtn.textContent = '活跃'
                    timer && clearTimeout(timer)
                } else {
                    $huoyueBtn.textContent = '停止'
                    timer = setTimeout(() => location.reload(), timeout)
                }
            } else if(alreadyHuoyue){
                timer = setTimeout(() => location.reload(), timeout)
            }
        }

        const parent = document.querySelector('#Top > div > div > div.tools');
        const _huoyue = document.createElement('a');
        _huoyue.setAttribute('id', 'huoyue')
        _huoyue.onclick = toggleHuoyue;
        _huoyue.textContent = Number(localStorage.getItem('V2EX_HUOYUE') || '0') === 0 ? '活跃' : '停止';

        const reference = parent.querySelector('a:nth-child(1)');
        parent.insertBefore(_huoyue, reference);
        toggleHuoyue()
    }

    if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
        bootstrap()
    } else {
        document.addEventListener('DOMContentLoaded', bootstrap, false)
    }
})();