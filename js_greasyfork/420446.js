// ==UserScript==
// @name         游侠 下载免跳转
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  跳转来跳转去的，有意思吗？
// @author       cw2012
// @match        https://down.ali213.net/pcgame/*
// @match        https://patch.ali213.net/showpatch/*
// @match        https://dl.3dmgame.com/pc/*
// @icon         https://down.ali213.net/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/420446/%E6%B8%B8%E4%BE%A0%20%E4%B8%8B%E8%BD%BD%E5%85%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/420446/%E6%B8%B8%E4%BE%A0%20%E4%B8%8B%E8%BD%BD%E5%85%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url, id,btnQueryStrArray,eleToHideQueryStrArray, hotNewsQueryStrArray;
    let btnStyle;
    switch(location.href.split('/')[2]){
        case 'patch.ali213.net':
            downloadPatch();
            break;
        case 'down.ali213.net':
            downloadSoft();
            break;
        case 'dl.3dmgame.com':
            download3dm();
            break;
    }

    function downloadPatch(){
        id = location.href.match(/[\d]+/g)[1];
        url = `https://patch.soft128.com/down/${id}.html`;
        btnQueryStrArray=['a[class^="normalDownContainer"]'];
        eleToHideQueryStrArray=['div.box518', 'div.downAddressContainer.paddingStyle','#newsdl_st','.mainContentRight'];
        hotNewsQueryStrArray =['#newsdl_l', '#newsdl_r','gb0','.patchgame1.box248'];
        updateUI();
    }

    function downloadSoft(){
        hotNewsQueryStrArray =[ '#newsdl_l', '#newsdl_r','gb0','.detail_game_r.box202','#newsdl_st','.detail_body_left_xgxx'];
        const work = ()=>{
            id = downID;
            btnQueryStrArray=['a#xz', 'a.xzdz'];
            url = `http://www.soft5566.com/down/${id}-1.html`;
            eleToHideQueryStrArray=['#down_load', '.detail_game_l_r_down_r2.box510','.detail_body_right'];
        };
        if(typeof(downID)=='undefined'){
            let timer = setInterval(()=>{
                if(downID){
                    work();
                    clearInterval(timer);
                    updateUI();
                }
            },1000);
        }else{
            work();
            updateUI();
        }
    }

    function download3dm(){
        // https://dl.3dmgame.com/pc/133836.html
        id = location.href.split('/')[4].split('.')[0];
        url = `https://box.hyds360.com:4433/down/${id}-1.html`;
        btnQueryStrArray = ['div.Gmaeinfobtn > div > a.tab','a.tab.tab1.downl22.downwn'];
        eleToHideQueryStrArray=['div.Gmaeinfobtn > div > a.tab', 'div.GmL_5','a.tab.tab1.downl22.downwn>div>p>span'];
        btnStyle='background: linear-gradient(to right, rgb(64, 205, 111) 0%, rgb(64, 205, 111) 100%);';
        updateUI();
    }

    // 延迟加载的广告
    function hideHotNews(){
        if(hotNewsQueryStrArray){
            let hotNews;
            hotNews = setInterval(()=>{
                let ele = document.querySelector(hotNewsQueryStrArray[0]);
                if(ele){
                    clearInterval(hotNews);
                    hotNewsQueryStrArray.forEach(item =>{
                        ele = document.querySelector(item);
                        if(ele){
                            ele.remove();
                        }
                    });
                }
            },500);
        }
    }

    function updateUI(){
        let jump= ()=>{window.open(url);};
        btnQueryStrArray && btnQueryStrArray.forEach(item=>{
            let btn = document.querySelector(item);
            if(btn) {
                btn.onclick = null;
                btn.addEventListener('click',jump);
                if(typeof btnStyle !='undefined'){
                    btn.style = btnStyle;
                }
            }
        })
        eleToHideQueryStrArray && eleToHideQueryStrArray.forEach(item=>{
            let ele = document.querySelector(item);
            if(ele){
                ele.style.display='none';
                ele.remove();
            }
        })
        hideHotNews();
    }
})();