// ==UserScript==
// @name         youtube双语字幕
// @version      0.1
// @description  youtube中英双语字幕
// @author       wwh
// @match        https://www.youtube.com/watch*
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @grant        none
// @namespace https://greasyfork.org/users/293239
// @downloadURL https://update.greasyfork.org/scripts/382022/youtube%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/382022/youtube%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
xhook.after(function (request, response) {
    if (request.url.includes('/api/timedtext') && !request.url.includes('&tlang=')) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${request.url}&tlang=zh-Hans`, false);
        xhr.send();

        if (response.xml.querySelector('head pen')) {
            xhr.responseXML.querySelectorAll('p').forEach(e => {
                let p = response.xml.querySelector(`p[t='${e.getAttribute('t')}']`);
                if (p) {
                    if (p.childElementCount && e.previousElementSibling) {
                        let previous = e.previousElementSibling;
                        previous.setAttribute('d', e.getAttribute('t') - previous.getAttribute('t'));
                    }

                    e.textContent = [p.textContent.replace('\n', ' '), e.textContent.replace('\n', ' ')].join('\n');
                }
            });
        } else {
            xhr.responseXML.querySelector('body').innerHTML = response.xml.querySelector('body').innerHTML.replace(/\n/g, ' ') +
                xhr.responseXML.querySelector('body').innerHTML.replace(/\n/g, ' ');
        }

        response.text = new XMLSerializer().serializeToString(xhr.responseXML);
    }
});
})();