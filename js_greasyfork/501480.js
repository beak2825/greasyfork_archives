// ==UserScript==
// @name         FANART2024 SauceNaoAuto
// @namespace    http://unlucky.ninja/
// @version      2024-07-22
// @description  Automatically use SauceNao to check source of images
// @author       UnluckyNinja
// @match        https://actff1.web.sdo.com/202407005_Contribute_Vote/index.html
// @license      MIT
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://update.greasyfork.org/scripts/498113/1395364/waitForKeyElements_mirror.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sdo.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/501480/FANART2024%20SauceNaoAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/501480/FANART2024%20SauceNaoAuto.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const iframes = new Map()

    async function createIframe(img, target) {
        if (iframes.has(img)){
            iframes.get(img).remove()
        }

        const formData  = new FormData
        const suffix = img.match(/\..*$/)[0]
        const blob = await (await fetch(img)).blob()

        formData.append('file', blob, 'to_upload'+suffix);

        const html = await xhrFetch('https://saucenao.com/search.php', 'POST', formData);

        // const html = await response.text()

        const iframe = document.createElement('iframe');
        iframe.src = 'about:blank'

        target.append(iframe)
        iframes.set(img, iframe)

        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);

        const base = iframe.contentWindow.document.createElement("base");
        base.setAttribute('href', 'https://saucenao.com')

        iframe.contentWindow.document.querySelector('head').appendChild(base)
        iframe.contentWindow.document.querySelector('#headerarea').remove()
        iframe.contentWindow.document.querySelector('#left').remove()

        iframe.contentWindow.document.close();
        return iframe
    }
    waitForKeyElements('.vote_list_cars .item', (node)=>{
        const img = node.find('img')[0]?.src
        if (!img) return
        let previewButton = document.createElement('button')
        previewButton.innerText = '查询图片'
        previewButton.style.margin = '0 0.5rem'
        previewButton.addEventListener('click', (e)=>{
            e.preventDefault(true)
            e.stopPropagation()
            createIframe(img, node)
        })
        node.prepend(previewButton)
    })
})();

function xhrFetch(url,send_type,data_ry) {
    let p = new Promise((resolve, reject)=> {
        GM_xmlhttpRequest({
            method: send_type,
            url: url,
            data:data_ry,
            onload: function(response){
                //console.log("请求成功");
                //console.log(response.responseText);
                resolve(response.responseText);
            },
            onerror: function(response){
                //console.log("请求失败");
                reject("请求失败");
            }
        });
    })
    return p;
}

