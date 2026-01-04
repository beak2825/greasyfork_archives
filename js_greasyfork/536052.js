// ==UserScript==
// @name         Torrent Result Ad Remover
// @namespace    http://tampermonkey.net/
// @description  Remove result containing specified ad keywords (support btdig and bt4gprx)
// @version      2025-05-15
// @author       russiavk
// @match        https://*.btdig.com/*
// @match        https://bt4gprx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btdig.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536052/Torrent%20Result%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/536052/Torrent%20Result%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywords = (GM_getValue('adKeywords', '[7sht.me],[7sht-me],[7sht me],[99u.me],[22y.me],[44x.me],[168x.me],zzpp06.com,avav66.xyz,avav121.com,aavv444.com,aavv333.com,avav55.xyz,bbsxv.xyz,aaxv.xyz,@Q.Q99_65※08_35,@Q.Q99.65※08.35,中文字幕-QQ2908607642,中文字幕-qq2908607642,㊥-Wen-字-幕-qq 761732719,㊥-Wen-字-幕-QQ 761732719,@qq1⑥2⑥⑺00⑧04,9.good88.top,@QQ822845675-大魔王日站代购(非诚勿扰),@9965※0835,Buy JAV QQ-39626-5275,QQ1489244611,Q_Q_1489244611,Q.20.46.11.919') || '')
    .split(',')
    .map(k => k.trim())
    .filter(k => k);
    function createMenu() {
        const id='ad-remover-menu';
        if(document.querySelector("#"+id)){
            return;
        }
        try {
            console.log('Attempting to create menu...');

            if (!document.body) {
                console.error('Document body not available');
                return;
            }


            // 創建菜單容器
            let menu = document.createElement('div');
            menu.id = id;

            menu.style.cssText = `
                background: white !important;
                padding: 20px !important;
                border-radius: 8px !important;
                box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
                z-index: 1000000 !important;
                min-width: 320px !important;
                max-width: 400px !important;
                top: 0px;
                right: 0px;
                position: absolute;
                display:block;
            `;

            // 創建標題
            let title = document.createElement('h2');
            title.textContent = 'edit ad keyword';
            title.style.cssText = 'margin: 0 0 10px !important; font-size: 1.5em !important;';

            // 創建文本框
            let textarea = document.createElement('textarea');
            textarea.style.cssText = `
                width: 100% !important;
                height: 150px !important;
                margin-bottom: 10px !important;
                resize: vertical !important;
                font-family: monospace !important;
            `;
            textarea.value = keywords.join('\n');

            let saveButton = document.createElement('button');
            saveButton.textContent = 'save';
            saveButton.style.cssText = `
                padding: 8px 16px !important;
                background: #4CAF50 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                margin-right: 10px !important;

            `;

            let closeButton = document.createElement('button');
            closeButton.textContent = 'close';
            closeButton.style.cssText = `
                padding: 8px 16px !important;
                background: #f44336 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
            `;

            // 保存按鈕事件
            saveButton.onclick = () => {
                let newKeywords = textarea.value.split('\n').map(k => k.trim()).filter(k => k);
                if (newKeywords.length === 0) {
                    alert('keyword is null！');
                    return;
                }
                GM_setValue('adKeywords', newKeywords.join(','));
                window.location.reload();
                console.log('Keywords saved:', newKeywords);
            };

            closeButton.onclick = () => {
                if (menu && menu.parentNode) {
                    menu.parentNode.removeChild(menu);
                    console.log('Menu closed');
                }
            };

            menu.appendChild(title);
            menu.appendChild(textarea);
            menu.appendChild(saveButton);
            menu.appendChild(closeButton);
            document.body.appendChild(menu);
            console.log('Menu created and appended successfully');

            // 確保可見
            setTimeout(() => {
                if (!menu.isConnected) {
                    console.error('Menu not in DOM');
                }
            }, 100);
        } catch (error) {
            console.error('Error creating menu:', error);
            alert('error ：' + error.message);
        }
    }

    function removeAds() {
        let items_css,title_css,floders_css,callback;
        if(location.hostname.endsWith('btdig.com')){
            items_css='.one_result';
            title_css='.torrent_name';
            floders_css='.fa-folder-open';
            callback=function(item,keyword){
                const video=item.querySelector('.fa-file-video-o');
                const image=item.querySelector('.fa-file-image-o');
                const text=item.querySelector('.fa-file-text-o');
                const link=item.querySelector('.fa-link');
                if (
                    (video&&video.innerText.includes(keyword))||
                    (image&&image.innerText.includes(keyword))||
                    (text&&text.innerText.includes(keyword))||
                    (link&&link.innerText.includes(keyword))
                ) {
                    return true;
                }return false;
            }
        }else if(location.hostname==='bt4gprx.com'){
            items_css='.result-item';
            title_css='h5 a';
            floders_css='li';
        }


        const items = document.querySelectorAll(items_css);
        outerLoop:
        for (const item of items) {
            const title_name=item.querySelector(title_css);
            console.log(`title_name ${title_name.innerText} !`);
            for (const keyword of keywords) {
                console.log(`keyword ${keyword} !`);
                if (title_name.innerText.includes(keyword)) {
                    item.style.display = 'none';
                    console.log(`${title_name.innerText} removed!`);
                    continue outerLoop;
                }
                const folders=item.querySelectorAll(floders_css);
                function remove(keyword){
                    item.style.display = 'none';
                    console.log(`${keyword} removed!`);
                }
                if(folders){
                    for (const folder of folders) {
                        if(folder.innerText.includes(keyword)){
                            remove();
                            continue outerLoop;
                        }
                    }
                }
                if(callback){
                    const is_remove=callback(item,keyword);
                    if(is_remove){
                        remove();
                        continue outerLoop;
                    }
                }
            }
        }
    }

    const observer = new MutationObserver(() => {
        removeAds();
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        removeAds();
        GM_registerMenuCommand('edit ad keyword', createMenu);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            removeAds();
            GM_registerMenuCommand('edit ad keyword', createMenu);
        });
    }
})();