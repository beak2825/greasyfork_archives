// ==UserScript==
// @name         Anitoku.net Lấy link Hydra
// @namespace    0x4076696e63766e
// @version      0.2
// @description  Lấy link hydra cho website anitoku.net
// @author       0x4076696e63766e
// @match        *://*.anitoku.net/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/517609/Anitokunet%20L%E1%BA%A5y%20link%20Hydra.user.js
// @updateURL https://update.greasyfork.org/scripts/517609/Anitokunet%20L%E1%BA%A5y%20link%20Hydra.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ketQua = [];
    function validData(data){
        if(!data.link || !data.chapter) return false;
        for(let i = 0; i < ketQua.length; i++)
            if(ketQua[i].chapter == data.chapter && ketQua[i].link == data.link) return false;
        return true;
    }
    function quetDuLieu2(){
        let divs = document.querySelectorAll('div.DagPlayOpt');
        for (let div of divs) {
            let link = div.getAttribute('data-embed');
            if (!link.startsWith('https://playhydrax.com') && !link.startsWith('https://short.ink') && !link.startsWith('https://zplayer.io')) continue;
            let chapter = div.querySelector('span').textContent;
            let data = {
                chapter: chapter,
                link: link
            };
            if (!validData(data)) continue;
            ketQua.push(data);
        }
    }
    function quetDuLieu() {
        if (typeof videoUrls === 'undefined') {
            quetDuLieu2();
        }else{
            for (let chapter in videoUrls) {
                if (videoUrls[chapter]['4']) {
                    let data = {
                        chapter: chapter,
                        link: videoUrls[chapter]['4']
                    };
                    if (!validData(data)) continue;
                    ketQua.push(data);
                }
            }
        }
        if(ketQua.length == 0){
            alert('Không tìm thấy dữ liệu');
            return;
        }
        ketQua.sort((a, b) => {
            return parseInt(a.chapter) - parseInt(b.chapter);
        });
        let div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '10px';
        div.style.right = '10px';
        div.style.backgroundColor = 'rgba(0,0,0,0.8)';
        div.style.color = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.zIndex = '9999';
        div.innerHTML = `Tìm thấy ${ketQua.length} chapter có server HY`;
        document.body.appendChild(div);
        const copyContent = ketQua.map(item => `${item.chapter},${item.link}`).join('\n');
        navigator.clipboard.writeText(copyContent).then(() => {
            alert('Đã sao chép liên kết vào clipboard!');
        }).catch(err => {
            console.error('Không thể sao chép: ', err);
            alert('Không thể sao chép liên kết. Vui lòng thử lại.');
        });
        setTimeout(()=>{
            document.body.removeChild(div);
        }, 3000);
        return ketQua;
    }
    const copyButton = document.createElement('button');
    copyButton.textContent = `Chép link HY`;
    copyButton.style.position = 'fixed';
    copyButton.style.top = '40px';
    copyButton.style.right = '10px';
    copyButton.style.zIndex = '9999';
    copyButton.style.backgroundColor = 'rgba(0,0,0,0.8)';
    copyButton.style.color = 'white';
    copyButton.style.padding = '10px';
    document.body.appendChild(copyButton);
    copyButton.addEventListener('click', quetDuLieu);
})();