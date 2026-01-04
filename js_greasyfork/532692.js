// ==UserScript==
// @name         Ripper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Cleverly download all images on a webpage
// @author       TetteDev
// @match        *://*/*
// @icon         https://icons.duckduckgo.com/ip2/tampermonkey.net.ico
// @license      MIT
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setValue
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/532692/Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/532692/Ripper.meta.js
// ==/UserScript==

const RenderGui = (selector = '') => {
    const highlightSelector = '4px dashed purple';

    const highlightElement = (element) => {
        element.style.border = highlightSelector;
    };
    const unhighlightElement = (element) => {
        element.style.border = '';
    }

    let container = null;
    const guiClassName = 'gui-container';
    if ((container = document.querySelector(`.${guiClassName}`))) {
        container.remove();
    }
    else {
        const style = document.createElement('style');
        style.textContent = `
            .gui-container {
                font-family: 'Segoe UI', Arial, sans-serif;
                max-width: 750px;
                margin: 20px auto;
                padding: 10px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);

                position: fixed;
                z-index: 9999;
                width: auto;
                height: auto;
                top: 15px;
                right: 15px;

                border: 1px solid black;
            }
            .input-group {
                display: flex;
                gap: 5px;
                margin-bottom: 10px;
            }
            .input-text {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                color: black !important;
            }
            .btn {
                padding: 8px 16px;
                background:rgb(250, 0, 0);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            .item-list {
                list-style: none;
                padding: 0;
                margin: 0 0 20px 0;
                max-height: 450px;
                overflow-y: auto;
                overflow-x: hidden;
            }
            .item-list li {
                display: flex;
                align-items: center;
                padding: 3px;
                border-bottom: 1px solid #eee;

                -webkit-user-select: none !important;
                -khtml-user-select: none !important;
                -moz-user-select: -moz-none !important;
                -o-user-select: none !important;
                user-select: none !important;
            }
            .item-list li:hover {
                background-color: yellow;
            }
            .checkbox-group {
                margin-bottom: 10px;
            }
            .checkbox-label {
                display: inline-flex;
                align-items: center;
                margin-right: 20px;
                cursor: pointer;
                color: black !important;
            }
            .download-btn {
                width: 100%;
                padding: 12px;
                background: rgb(250, 0, 0);
                color: white;
                font-weight: bold;
            }
        `;
        document.body.appendChild(style);
    }

    // Create GUI elements
    container = document.createElement('div');
    container.className = guiClassName;

    // Add dragging functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const dragStart = (e) => {
        if (e.target !== container) return; // Only drag from container itself
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === container) {
            isDragging = true;
            container.style.cursor = 'move';
        }
    };

    const dragEnd = () => {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        container.style.cursor = '';
    };

    const drag = (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        container.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };

    container.removeEventListener('mousedown', dragStart);
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);

    container.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Input group
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    
    const textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.className = 'input-text';
    textbox.placeholder = 'Enter a valid CSS selector';
    if (selector && typeof selector === 'string') textbox.value = selector;
    
    const getMatchesButton = document.createElement('button');
    getMatchesButton.className = 'btn';
    getMatchesButton.textContent = '⟳';
    getMatchesButton.style.fontWeight = 'bold';
    getMatchesButton.title = 'Execute the CSS Selector (or just press enter)';

    let matchedElements = [];

    textbox.addEventListener('keyup', (e) => {
        if (e.key !== 'Enter') return;
        getMatchesButton.dispatchEvent(new Event('click', { 'bubbles': true }));
    });
    getMatchesButton.onclick = () => {
        matchedElements.forEach(match => { unhighlightElement(match); });
        matchedElements = [];
        Array.from(document.querySelectorAll('.item-list > li')).forEach(li => { li.remove(); });
        const selector = textbox.value;
        if (!selector) return;

        try {
            const matches = Array.from(document.querySelectorAll(selector));
            matches.forEach((match, index) => {
                addListItem(`Match ${index + 1}`, match,
                    () => { 
                        matchedElements.forEach(match => { unhighlightElement(match); });
                        highlightElement(match);
                        match.scrollIntoView();

                        setTimeout(() => {
                            unhighlightElement(match);
                        }, 4000);
                    });
                matchedElements.push(match);
            });

            const lis = Array.from(document.querySelectorAll('.item-list > li'));
            const selected = matches.filter(match => {
                const cb = lis.find(li => li.ref.isEqualNode(match)).querySelector('input[type="checkbox"]');
                cb.onchange = () => {
                    const dlbtn = document.querySelector('.download-btn');
                    const lis = Array.from(document.querySelectorAll('.item-list > li'));
                    const selected = matches.filter(match => {
                        const cb = lis.find(li => li.ref.isEqualNode(match)).querySelector('input[type="checkbox"]');
                        return cb.checked;
                    });
                    dlbtn.textContent = `Download ${selected.length} Item(s)`;
                };
                return cb.checked;
            });
            document.querySelector('.download-btn').textContent = `Download ${selected.length} Item(s)`;

        } catch (err) { }
    };

    // List
    const itemList = document.createElement('ul');
    itemList.className = 'item-list';

    // Checkbox group
    const checkboxGroup = document.createElement('div');
    checkboxGroup.className = 'checkbox-group';
    
    const options = [['Humanize', 'checked'], ['Inherit HTTP Only Cookies', 'checked'], ['Preserve Original Filename'], ['(WIP) Support Video Elements'], 'Placeholder Normal'];
    options.forEach(opt => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        label.style.display = 'block';
        label.appendChild(checkbox);

        if (typeof opt === 'object') {
            const text = opt[0];
            label.appendChild(document.createTextNode(`  ${text}`));
            
            opt.slice(1).forEach(o => {
                switch (o) {
                    case 'checked':
                        checkbox.checked = true;
                        break;
                    case 'disabled':
                        checkbox.disabled = true;
                        break;
                    default:
                        console.warn(`Unrecognized checkbox opt: '${o}'`);
                        break;
                }
            })
        } else {
            label.appendChild(document.createTextNode(`  ${opt}`));
        }
        checkboxGroup.appendChild(label);
    });

    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn download-btn';
    downloadBtn.textContent = 'Download 0 Item(s)';

    downloadBtn.onclick = async () => {
        if (matchedElements.length === 0) return;

        const ResolveMediaElementUrl = (img) => {
            const lazyAttributes = [
                'data-src', 'data-pagespeed-lazy-src', 'srcset', 'src', 'zoomfile', 'file', 'original', 'load-src', '_src', 'imgsrc', 'real_src', 'src2', 'origin-src',
                'data-lazyload', 'data-lazyload-src', 'data-lazy-load-src',
                'data-ks-lazyload', 'data-ks-lazyload-custom', 'loading',
                'data-defer-src', 'data-actualsrc',
                'data-cover', 'data-original', 'data-thumb', 'data-imageurl', 'data-placeholder',
            ];
            const IsUrl = (url) => {
                // TODO: needs support for relative file paths also?
                const pattern = new RegExp(
                    '^(https?:\\/\\/)?'+ // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                    '(\\#[-a-z\\d_]*)?$','i');
                const isUrl = !!pattern.test(url);
                if (!isUrl) {
                    try {
                        new URL(url);
                        return true;
                    } catch(err) {
                        return false;
                    }
                }
                return true;
            };

            let possibleImageUrls = lazyAttributes.filter(attr => {
                let attributeValue = img.getAttribute(attr);
                if (!attributeValue) return false;
                attributeValue = attributeValue.replaceAll('\t', '').replaceAll('\n','');
                let ok = IsUrl(attributeValue.trim());
                if (!ok && attr === 'srcset') { 
                    // srcset usually contains a comma delimited string that is formatted like
                    // <URL1>, <WIDTH>w, <URL2>, <WIDTH>w, <URL3>, <WIDTH>w,
                    // TODO: handle this case
                    const srcsetItems = attributeValue.split(',').map(attr => attr.trim()).map(item => item.split(' '));
                    if (srcsetItems.length > 0) {
                        img.setAttribute('srcset', srcsetItems[srcsetItems.length - 1][0]);
                        ok = IsUrl(img.getAttribute('srcset'));
                    }
                }
                return ok;
            }).map(validAttr => img.getAttribute(validAttr).trim());

            if (!possibleImageUrls || possibleImageUrls.length < 1) {
                if (img.hasAttribute('src')) return img.src.trim();
                console.error('Could not resolve the image source URL from the image object', img);
                return '';
            }
            return possibleImageUrls.length > 1 ? [...new Set(possibleImageUrls)][0] : possibleImageUrls[0];
        };

        const lis = Array.from(document.querySelectorAll('.item-list > li'));
        let urls = matchedElements.map(match => {
            const matchCb = lis.find(li => li.ref.isEqualNode(match)).querySelector('input[type="checkbox"]');
            if (!(matchCb?.checked ?? true)) {
                console.warn('Skipping match ', match, ' cause it was unchecked in the match list');
                return '';
            }

            const opts = Array.from(document.querySelector('.checkbox-group').querySelectorAll('input[type="checkbox"]'));
            const optSupportVideoElements = opts.find(_ => _.parentElement.textContent.includes("Support Video Elements"))?.checked ?? false;

            const supportedTypes = optSupportVideoElements ? [[HTMLImageElement,"IMG"],[HTMLVideoElement,"VIDEO"]] : [[HTMLImageElement,"IMG"]];
            let actualMatch = 
                supportedTypes.some(supportedType => { const typeName = supportedType[0]; return match instanceof typeName; }) 
                    ? match 
                    : supportedTypes.map(supportedType => { const nodeName = supportedType[1]; return match.querySelector(nodeName); }).filter(res => res)[0];
                
            if (!actualMatch) {
                console.warn('Failed to find supported element type for parent match element: ', match);
                return '';
            }

            const src = ResolveMediaElementUrl(actualMatch);
            return src;
        }).filter(url => {
            return url.length > 0;
        });

        // TODO: filter out duplicates?
        await Download(urls);
    };

    // Add elements to container
    inputGroup.appendChild(textbox);
    inputGroup.appendChild(getMatchesButton);
    container.appendChild(inputGroup);
    //container.appendChild(itemListHeader);
    container.appendChild(itemList);
    container.appendChild(checkboxGroup);
    container.appendChild(downloadBtn);

    // Add to document
    document.body.appendChild(container);

    // Function to add new item to list
    function addListItem(text, elemRef, itemClickCallback = null) {
        const li = document.createElement('li');
        li.style.cssText = 'cursor: pointer; padding: 0px; color: black !important;'
        if (itemClickCallback && typeof itemClickCallback === 'function') {
            li.ondblclick = itemClickCallback;
        }
        if (elemRef) {
            li.ref = elemRef;
        }

        li.title = 'Double click an entry to scroll to it and highlight it';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        if (!elemRef && !itemClickCallback) checkbox.disabled = true;
        checkbox.style.marginRight = '10px';
        const textNode = document.createTextNode(text);
        li.appendChild(checkbox);
        li.appendChild(textNode);
        itemList.appendChild(li);
    }

    //addListItem('No matches', null, null);
};

const SleepRange = (min, max) => {
    const _min = Math.min(min, max);
    const _max = Math.max(min, max);
    const ms = Math.floor(Math.random() * (_max - _min + 1) + _min);
    if (ms <= 0) return;
    return new Promise(r => setTimeout(r, ms));
};

const GetBlob = (url, inheritHttpOnlyCookies = true) => {
    return new Promise(async (resolve, reject) => {
        // TODO: Handle blob urls?
        // const isBlobUrl = url.startsWith('blob:');
        // console.warn('Encountered a blob url but implementation is missing');
        // if (isBlobUrl) {
        //     try {
        //         const _res = await GM.xmlHttpRequest({method:'GET',url:url});
        //         debugger;
        //     } catch (err) { debugger; return reject(err); }
        // }

        const res = await GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'DNT': `${window.navigator.doNotTrack || '1'}`,

                'Referer':  document.location.href || url,
                'Origin': document.location.origin || url,

                'Host': window.location.host || window.location.hostname,
                'User-Agent': window.navigator.userAgent,
                'Priority': 'u=0, i',
                'Upgrade-Insecure-Requests': '1',
                'Connection': 'keep-alive',
                //'Cache-Control': 'no-cache',
                'Cache-Control': 'max-age=0',

                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-GPC': '1',
            },
            responseType: 'blob',
            cookiePartition: {
                topLevelSite: inheritHttpOnlyCookies ? location.origin : null
            }
        })
        .catch((error) => { debugger; return reject(error); });

        const allowedImageTypes = ['webp','png','jpg','jpeg','gif','bmp','webm'];
        const HTTP_OK_CODE = 200;
        const ok =
                res.readyState == res['DONE'] &&
                res.status === HTTP_OK_CODE &&
                //res.response && ['webp','image'].some(t => res.response.type.includes(t))
                res.response && (res.response.type.startsWith('image/') && allowedImageTypes.includes(res.response.type.split('/')[1].toLowerCase()));

        if (!ok) {
            debugger;
            return reject(error);
        }

        return resolve({
            blob: res.response,
            filetype: res.response.type.split('/')[1],
        });
    });
};
const SaveBlob = async (blob, fileName) => {
    const MakeAndClickATagAsync = async (blobUrl, fileName) => {
        try {
            let link;
            
            // Reuse existing element for sequential downloads
            if (!window._downloadLink) {
                window._downloadLink = document.createElement('a');
                window._downloadLink.style.cssText = 'display: none !important;';
                try {
                    document.body.appendChild(window._downloadLink);
                } catch (err) {
                    // Handle Trusted Types policy
                    if (window.trustedTypes && window.trustedTypes.createPolicy) {
                        const policy = window.trustedTypes.createPolicy('default', {
                            createHTML: (string) => string
                        });
                    }
                    document.body.appendChild(window._downloadLink);
                }
            }
            link = window._downloadLink;
    
            // Set attributes and trigger download
            link.href = blobUrl;
            link.download = fileName;
            await Promise.resolve(link.click());
    
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            await Promise.reject([false, error]);
        }
    };

    const blobUrl = window.URL.createObjectURL(blob)

    await MakeAndClickATagAsync(blobUrl, fileName)
    .catch(([state, errorMessage]) => { window.URL.revokeObjectURL(blobUrl); console.error(errorMessage); debugger; return reject([false, errorMessage, res]); });
    window.URL.revokeObjectURL(blobUrl);
};

const cancelSignal = {cancelled:false};
async function Download(urls) {
    if (urls.length === 0) return;
    if (typeof urls === 'string') urls = [urls];
    cancelSignal.cancelled = false;

    const progressbar = document.createElement('div');
    progressbar.style.cssText = `position:fixed;z-index:9999;bottom:0px;right:0px;width:100%;max-height:30px;background-color:white;`;
    progressbar.innerHTML = `
        <span class="text" style="color:black;padding-right:5px;"></span>
        <button class="cancel">Stop</button
    `;
    document.body.appendChild(progressbar);

    const text = progressbar.querySelector('.text');
    const btn = progressbar.querySelector('.cancel');

    btn.onclick = () => { cancelSignal.cancelled = true; text.textContent = 'Aborting download, please wait ...'; };

    const opts = Array.from(document.querySelector('.checkbox-group').querySelectorAll('input[type="checkbox"]'));
    const optHttpOnlyCookies = opts.find(_ => _.parentElement.textContent.includes("Inherit HTTP Only Cookies"))?.checked ?? true;
    const optHumanize = opts.find(_ => _.parentElement.textContent.includes('Humanize'))?.checked ?? true;
    const optPreserveOriginalFilename = opts.find(_ => _.parentElement.textContent.includes('Preserve Original Filename'))?.checked ?? false;

    for (let i = 0; i < urls.length; i++) {
        if (cancelSignal.cancelled) break;

        const url = urls[i];
        text.textContent = `Downloading ${url} ... (${i+1}/${urls.length})`;

        try {
            const {blob, filetype} = await GetBlob(url, optHttpOnlyCookies);
            const filename = optPreserveOriginalFilename ? url.split('/').pop() : `${i}.${filetype}`;
            await SaveBlob(blob, filename);
        } catch (err) {
            console.error('Something went wrong downloading from url ', url);
            console.error(err);
        }

        if (optHumanize) await SleepRange(650, 850);
    }

    progressbar.remove();
}

const defaultSelector = GM_getValue(document.location.host, undefined);
if (typeof defaultSelector === 'undefined') {
    GM_registerMenuCommand('Show GUI', () => {
        RenderGui();
    });
    GM_registerMenuCommand(`Always show GUI for ${location.host}`, () => {
        GM_setValue(location.host, true);
        RenderGui();
    });
    // GM_registerMenuCommand(`Always show GUI for ${location.host} and save current selector`, () => {
    //     const selector = document.querySelector('.input-text')?.value ?? true;
    //     GM_setValue(selector);
    //     RenderGui();
    // });
}
else {
    RenderGui(typeof defaultSelector === 'string' ? defaultSelector : '');
    GM_registerMenuCommand(`Dont show GUI for ${location.host}`, () => {
        GM_deleteValue(location.host);
        // TODO: Remove the GUI
    });
}