// ==UserScript==
// @name         Mr.AV for FC2 & FANZA
// @name:ja      Mr.AV for FC2 & FANZA
// @namespace    https://greasyfork.org/ja/users/570127
// @version      2025.12.28.1
// @description  Mr.AV
// @description:ja FC2, FANZA(旧DMM)の行き来をしやすくします。
// @author       universato
// @match        https://adult.contents.fc2.com/article/*
// @match        https://ads.contents.fc2.com/article/*
// @match        https://www.dmm.co.jp/digital/*
// @match        https://www.dmm.co.jp/mono/*
// @match        https://www.dmm.co.jp/litevideo/-/detail/=/cid=*/*
// @match        https://www.dmm.co.jp/rental/-/detail/=/cid=*/*
// @match        https://video.dmm.co.jp/amateur/content/?id=*
// @match        https://video.dmm.co.jp/av/content/?id=*
// @match        https://www.mgstage.com/product/product_detail/*
// @match        https://missav.ai/*
// @match        https://missav.ws/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/8z1y7cp0vrm40gdis32qzmdpo5s2
// @license      MIT
// @grant        none
// @supportURL   https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/500693/MrAV%20for%20FC2%20%20FANZA.user.js
// @updateURL https://update.greasyfork.org/scripts/500693/MrAV%20for%20FC2%20%20FANZA.meta.js
// ==/UserScript==

console.log("【UserScript】Mr.AV for FC2 & FANZA");

(function() {
    'use strict';

    document.addEventListener('keydown', function (event) {
        const activeTagName = document.activeElement.tagName;
        const in_textarea = ['TEXTAREA', 'INPUT'].includes(activeTagName);
        const invalid_input = event.key.match(/[^dmnu]/);

        // テキストエリア内 or 無効な入力であれば、終了。
        if(in_textarea || invalid_input){ return; }
        if(event.ctrlKey || event.metaKey){ return; }

        console.log("[UserScript]ショートカットは有効判定[FC2<->MISSAV]");

        const hostname = window.location.hostname;
        const paths = location.pathname.split('/');
        let new_url = '';
        if(hostname === "adult.contents.fc2.com" || hostname === "ads.contents.fc2.com"){
            const article_id = paths[2];
            new_url = `https://missav.ai/ja/fc2-ppv-${article_id}`;
        }else if(hostname === "video.dmm.co.jp"){
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            const product_id = id.replace(/(\D+)(\d+)/, "$1-$2");
            new_url = `https://missav.ai/ja/${product_id}`;
        }else if(hostname === "www.dmm.co.jp"){
            let product_id;
            if(paths[1] === 'litevideo' || paths[1] === 'rental'){
                product_id = paths[5].split('=')[1];
            }else{
                product_id = paths[6].split('=')[1];
            }
            const maker = product_id.slice(0, 5);
            const id = product_id.slice(5);
            if(maker === 'uinac'){
                new_url = `https://missav.ai/ja/uinav-${id}`;
            }else if(maker === 'boinbb'){
                new_url = `https://missav.ai/ja/${maker}-${id}`;
            }else{
                new_url = `https://missav.ai/ja/${product_id}`;
            }
        }else if(hostname === "www.mgstage.com"){
            const product_id = paths[3];
            new_url = `https://missav.ai/ja/${product_id}`;
        }else if(hostname === "missav.ws"){
            const url = new URL(window.location.href);
            url.hostname = "missav.ai";
            window.location.href = url.toString();
            return;
        }else if(hostname === "missav.ai"){
            console.log("[UserScript]MISSAV -> ****");
            if(event.key === 'u'){
                if(paths[2].endsWith('-uncensored-leak')){
                    location.href = location.href.replace('-uncensored-leak', '');
                }else{
                    location.pathname = location.pathname + '-uncensored-leak';
                }
                return;
            }

            const missav_id = paths[paths.length - 1].split('-'); // ['fc2', 'ppv', '1234567'], ['pppe', '236', 'uncensored', 'leak']
            const maker = missav_id[0];
            console.log(`maker: ${maker}`);
            const mgstage_makers = /SIRO|ABF|maan/;
            if(maker === 'fc2'){
                const article_id = missav_id[2];
                new_url = `https://adult.contents.fc2.com/article/${article_id}/`;
            }else if(mgstage_makers.test(maker)){
                new_url = `https://www.mgstage.com/product/product_detail/${missav_id.slice(0,2).join('-').toUpperCase()}/`;
            }else if(maker === 'gana'){
                new_url = `https://www.mgstage.com/product/product_detail/200${missav_id.slice(0,2).join('-').toUpperCase()}/`;
            }else if(maker === 'boinbb' || maker === 'japorn'){
                new_url = `https://video.dmm.co.jp/amateur/content/?id=${maker}${missav_id[1]}`;
                new_url = `https://www.dmm.co.jp/litevideo/-/detail/=/cid=${maker}${missav_id[1]}/`;
            }else if(maker === 'ekdv'){
                missav_id[1] = missav_id[1].padStart(5, '0'); // ['pppe', '236'] -> ['pppe', '00236']
                new_url = `https://video.dmm.co.jp/av/content/?id=49${missav_id.slice(0,2).join('')}`;
            }else if(maker === 'spay'){
                new_url = `https://www.dmm.co.jp/digital/videoc/-/detail/=/cid=${maker}${missav_id[1]}/`;
            }else if(maker === 'uinav'){
                new_url = `https://www.dmm.co.jp/digital/videoc/-/detail/=/cid=uinac${missav_id[1]}/`;
            }else{
                missav_id[1] = missav_id[1].padStart(5, '0'); // ['pppe', '236'] -> ['pppe', '00236']
                new_url = `https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=${missav_id.slice(0,2).join('')}/`;
                new_url = `https://video.dmm.co.jp/av/content/?id=${missav_id.slice(0,2).join('')}`;
            }
        }

        console.log(`new_url: ${new_url}`);
        if(event.key === 'd'){
            console.log(new_url);
        }else if(event.key === 'm'){
            location.href = new_url;
        }else if(event.key === 'n'){
            try {
                navigator.clipboard.writeText(new_url);
                console.log('new_url copied');
            } catch (e) {
                console.error(e);
            }
            window.open(new_url, '_blank', 'noopener,noreferrer');
        }
    }, false);
})();
