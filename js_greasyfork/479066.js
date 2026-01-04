// ==UserScript==

// @name               巴哈姆特動畫瘋[Shift]+[→]跳過1m30s
// @description        巴哈姆特動畫瘋按下快捷鍵[Shift]+[→]跳過1分30秒
// @copyright          2023, HrJasn (https://greasyfork.org/zh-TW/users/142344-jasn-hr)
// @license            GPL3
// @license            Copyright HrJasn
// @icon               https://www.google.com/s2/favicons?domain=ani.gamer.com.tw
// @homepageURL        https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @supportURL         https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @version            1.4
// @namespace          https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @grant              none
// @match              http*://ani.gamer.com.tw/animeVideo.php?sn=*
// @exclude            http*://ani.gamer.com.tw/
// @run-at             document-start

// @downloadURL https://update.greasyfork.org/scripts/479066/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%5BShift%5D%2B%5B%E2%86%92%5D%E8%B7%B3%E9%81%8E1m30s.user.js
// @updateURL https://update.greasyfork.org/scripts/479066/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%5BShift%5D%2B%5B%E2%86%92%5D%E8%B7%B3%E9%81%8E1m30s.meta.js
// ==/UserScript==

let bahaobserver;
bahaobserver = new MutationObserver( (mutations) => {
    mutations.forEach((adNds)=>{
        adNds.addedNodes.forEach((adNde)=>{
            if( (adNde) && (adNde.querySelector) && (adNde.querySelector('video')) ){
                console.log('巴哈姆特動畫瘋快捷鍵跳過1m30s已讀入。');
                bahaobserver.disconnect();
                const videoe = document.querySelector('video');
                const videopne = videoe.parentNode;
                let keyDownHis = {};
                if (videopne.getAttribute('BHAJPTEvntSet') !== true) {
                    videopne.addEventListener('keydown', (evnt) => {
                        try{
                            evnt.target.setAttribute('BHAJPTEvntSet', true);
                            keyDownHis[evnt.key] = true;
                        }catch(err){console.log(evnt);};
                    });
                    videopne.addEventListener('keyup', (evnt) => {
                        try{
                            evnt.target.setAttribute('BHAJPTEvntSet', true);
                        }catch(err){console.log(evnt);};
                        switch(true){
                            case ( (keyDownHis.Shift) && (keyDownHis.ArrowRight) ) : {
                                let nt = evnt.target.querySelector('video').currentTime + 85;
                                let fwimgd = document.querySelector('img[src="https://i2.bahamut.com.tw/anime/forward.svg"]').nextElementSibling;
                                let evtv = evnt.target.querySelector('video');
                                fwimgd.innerHTML = '1m30s';
                                let chgtdevt = (tpevnt)=>{
                                    if(evtv.currentTime >= nt){
                                        fwimgd.innerHTML = '5s';
                                        tpevnt.target.removeEventListener('timeupdate',chgtdevt);
                                    };
                                };
                                evtv.addEventListener('timeupdate', chgtdevt);
                                evnt.target.querySelector('video').currentTime = nt;
                            } break;
                            case ( (keyDownHis.Shift) && (keyDownHis.ArrowLeft) ) : {
                                let nt = evnt.target.querySelector('video').currentTime - 85;
                                let bkimgd = document.querySelector('img[src="https://i2.bahamut.com.tw/anime/backward.svg"]').nextElementSibling;
                                let evtv = evnt.target.querySelector('video');
                                bkimgd.innerHTML = '1m30s';
                                let chgtdevt = (tpevnt)=>{
                                    if(evtv.currentTime >= nt){
                                        bkimgd.innerHTML = '5s';
                                        tpevnt.target.removeEventListener('timeupdate',chgtdevt);
                                    };
                                };
                                evtv.addEventListener('timeupdate', chgtdevt);
                                evnt.target.querySelector('video').currentTime = nt;
                            } break;
                            default :
                                break;
                        };
                        keyDownHis = {};
                    });
                };
            };
        });
    });
});
bahaobserver.observe(document, {attributes:true, childList:true, subtree:true});
