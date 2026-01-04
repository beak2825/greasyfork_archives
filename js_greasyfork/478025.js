// ==UserScript==
// @name         Gelbooru CTRL+S Binds
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Binds ctrl+s to a download on gelbooru
// @author       JFKennedy
// @match        https://gelbooru.com/*
// @icon         https://google.com/s2/favicons?sz=64&domain=gelbooru.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478025/Gelbooru%20CTRL%2BS%20Binds.user.js
// @updateURL https://update.greasyfork.org/scripts/478025/Gelbooru%20CTRL%2BS%20Binds.meta.js
// ==/UserScript==

document.addEventListener('keydown',e=>{
    const fetchWithTampermonkey = async (url, responseType = 'blob') => {
        return new Promise((resolve, reject) => {
            const loader = document.createElement('div');
            loader.style.height='4px';
            loader.style.width='100vw';
            loader.style.position='fixed';
            loader.style.top='0';
            loader.style.left='0';
            loader.style.display='block';
            loader.style.background='#1a1a1a00';
            const loaderInner = document.createElement('div');
            loaderInner.style.height=loader.style.height;
            loaderInner.style.width='0';
            loaderInner.style.position='fixed';
            loaderInner.style.top='0';
            loaderInner.style.left='0';
            loaderInner.style.display='block';
            loaderInner.style.background='#aa99ff';
            loader.appendChild(loaderInner);
            const loaderInner2 = document.createElement('div');
            loaderInner2.style.height=loader.style.height;
            loaderInner2.style.width=loader.style.height;
            loaderInner2.style.position='fixed';
            loaderInner2.style.top='0';
            loaderInner2.style.right='0';
            loaderInner2.style.display='block';
            loaderInner2.style.filter='blur(2px)';
            loaderInner2.style.background=loaderInner.style.background;
            loaderInner2.style.borderRadius='128px';
            loaderInner.appendChild(loaderInner2);
            document.body.appendChild(loader);
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType, // specify the desired responseType
                onload: (response) => {
                    if (response.status === 200) {
                        if (responseType === 'blob') {
                            resolve(new Blob([response.response], { type: response.responseHeaders.match(/content-type: (.*)/i)[1] }));
                        } else {
                            resolve(response.responseText);
                        }
                        loader.remove();
                    } else {
                        setTimeout(()=>loader.remove(),1000)
                        loaderInner.style.background='#ffaaaa'
                        loaderInner2.style.background='#ffaaaa'
                        reject(new Error('Request failed with status ' + response.status));
                    }
                },
                onprogress: function(progress) {
                    const percent = progress.lengthComputable ? (progress.position/progress.totalSize) : 100;
                    console.log(progress,percent);
                    loaderInner.style.width=`${percent*100}vw`
                    loaderInner2.style.left=loaderInner;
                },
                onerror: (error) => {
                    reject(error);
                },
            });
        });
    };


    const id = new URLSearchParams(location.search).get('id')
    if (e.key === 's' && e.ctrlKey && id) {
        e.preventDefault()
        document.querySelectorAll('a[href*="https://"][target="_blank"][rel="noopener"]').forEach(async v=>{
            if (v.textContent.includes('Original image')) {
                const url = v.href;
                const data = await fetchWithTampermonkey(url);
                const dlUrl = URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href=dlUrl;
                a.download = `${id}.${url.split('.').pop()}` || ('img-'+Date.now());
                document.body.appendChild(a)
                a.click()
            }
        })
    }
})

