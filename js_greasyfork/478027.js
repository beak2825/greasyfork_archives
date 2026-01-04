// ==UserScript==
// @name         Reddl
// @version      0.2.4
// @description  Reddit Preview Ctrl+s Downloading Utility - also applies to a few other sites - Only tested on Firefox
// @author       JFKennedy
// @license      MIT
// @match        https://*.reddit.com/media?url=*
// @match        https://w.wallha.com/*
// @match        https://get.wallhere.com/*
// @match        https://c.wallhere.com/*
// @match        https://*.wallhere.com/*
// @match        https://*.pinterest.com/*
// @match        https://*.pinterest.co.uk/*
// below this line match only the ones that are direct img serving!!
// @match        https://wallpapersmug.com/download/*
// @match        https://wallpapersmug.com/large/*
// @match        https://1.bp.blogspot.com/*/*
// @match        https://p*.wallpaperbetter.com/*/*
// @match        https://*.pinimg.com/*
// @match        https://images*.alphacoders.com/*
// @match        https://wallpaperaccess.com/full/*
// @match        https://www.wallpaperaccess.com/full/*
// @match        https://*.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_xmlhttpRequest
// @connect      external-preview.redd.it
// @connect      i.redd.it
// @connect      *.redd.it
// @connect      *.reddit.com
// @connect      w.wallha.com
// @connect      get.wallhere.com
// @connect      c.wallhere.com
// @connect      *.pinimg.com
// @connect      i.pinimg.com
// @connect      wixmp.com
// @namespace    https://greasyfork.org/users/1202256
// @downloadURL https://update.greasyfork.org/scripts/478027/Reddl.user.js
// @updateURL https://update.greasyfork.org/scripts/478027/Reddl.meta.js
// ==/UserScript==

document.addEventListener('keydown', async e => {
    const fetchWithTampermonkey = async (url, responseType = 'blob') => {
        return new Promise((resolve, reject) => {
            const loader = document.createElement('div');
            loader.style.height = '4px';
            loader.style.width = '100vw';
            loader.style.position = 'fixed';
            loader.style.top = '0';
            loader.style.left = '0';
            loader.style.display = 'block';
            loader.style.background = '#1a1a1a00';
            const loaderInner = document.createElement('div');
            loaderInner.style.height = loader.style.height;
            loaderInner.style.width = '0';
            loaderInner.style.position = 'fixed';
            loaderInner.style.top = '0';
            loaderInner.style.left = '0';
            loaderInner.style.display = 'block';
            loaderInner.style.background = '#aa99ff';
            loader.appendChild(loaderInner);
            const loaderInner2 = document.createElement('div');
            loaderInner2.style.height = loader.style.height;
            loaderInner2.style.width = loader.style.height;
            loaderInner2.style.position = 'fixed';
            loaderInner2.style.top = '0';
            loaderInner2.style.right = '0';
            loaderInner2.style.display = 'block';
            loaderInner2.style.filter = 'blur(2px)';
            loaderInner2.style.background = loaderInner.style.background;
            loaderInner2.style.borderRadius = '128px';
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
                        setTimeout(() => loader.remove(), 1000)
                        loaderInner.style.background = '#ffaaaa'
                        loaderInner2.style.background = '#ffaaaa'
                        reject(new Error('Request failed with status ' + response.status));
                    }
                },
                onprogress: function (progress) {
                    const percent = progress.lengthComputable ? (progress.position / progress.totalSize) : 100;
                    console.log(progress, percent);
                    loaderInner.style.width = `${percent * 100}vw`
                    loaderInner2.style.left = loaderInner;
                },
                onerror: (error) => {
                    reject(error);
                },
            });
        });
    };
    const dl = async (url, filename) => {
        const data = await fetchWithTampermonkey(url);
        const dlUrl = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = filename || ('img-' + Date.now());
        document.body.appendChild(a);
        a.click();
        a.remove();
    }


    if (e.key === 's' && e.ctrlKey) {
        switch (location.hostname) {
            case 'reddit.com':
            case 'redd.it':
            case 'www.reddit.com':
            case 'www.redd.it':
            case 'i.redd.it':
                {
                    const url = new URLSearchParams(location.search).get('url')
                    if (!url) return;
                    e.preventDefault()
                    const fname = (url.split('-').pop() || '').split('.');
                    fname.pop();
                    dl(url, `reddit-${fname.join('.') || `unknown-${Date.now()}`}.${url.split('.').pop()}`);
                    break;
                }
            case 'wallhere.com':
            case 'www.wallhere.com':
                {
                    const img = document.querySelector('img[itemprop="contentURL"]')
                    if (!img) return;
                    const url = img.src;
                    if (!url) return;
                    e.preventDefault()
                    const fname = (url.split('-').pop() || '').split('.');
                    fname.pop();
                    dl(dlUrl, `wall-${fname.join('.') || `unknown-${Date.now()}`}.${url.split('.').pop()}`);
                    break;
                }
            case 'i.pinimg.com':
            case 'pinimg.com':
            case 'w.wallha.com':
            case 'i.wallha.com':
            case 'get.wallhere.com':
            case 'c.wallhere.com':
                {
                    const img = document.querySelector('img')
                    if (!img) return console.warn('No image');
                    e.preventDefault()
                    dl(img.src);
                    break;
                }
            case 'pinterest.com':
            case 'pinterest.co.uk':
            case 'www.pinterest.com':
            case 'www.pinterest.co.uk':
                {
                    const img = document.querySelector('img[src*="pinimg.com"][loading="auto"]')
                    if (!img) return console.warn('No image');
                    e.preventDefault()
                    dl(img.src);
                    break;
                }
            case 'deviantart.com':
            case 'www.deviantart.com':
                {
                    const img = document.querySelector('img[property="contentUrl"][src*="wixmp.com"]')
                    if (!img) return console.warn('No image');
                    e.preventDefault()
                    dl(img.src);
                    break;
                }
            default:
                {
                    const img = document.querySelector('body > img:first-child')
                    if (img) {
                        e.preventDefault();
                        dl(img.src);
                    }
                }
        }
    }
})

