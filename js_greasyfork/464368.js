// ==UserScript==
// @name         巴哈姆特動畫瘋輔助工具
// @namespace    https://github.com/maplelan/Maplelan_Tampermonkey_Script/blob/main/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E8%BC%94%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @version      1.1.2
// @description  顯示動畫瘋撥放時間於上架時間列 可開關[自動跳過開頭年齡認證 自動於結尾播放下一集] 可開關[在開始時自動切換至彈幕設定] 將滑鼠移上縮圖標題會以浮動方塊顯示完整標題
// @author       Maplelan
// @license MIT
// @match        *ani.gamer.com.tw/*
// @icon         https://ani.gamer.com.tw/apple-touch-icon-114.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464368/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E8%BC%94%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/464368/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E8%BC%94%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    let url = new URL(location.href).toString();
    if(url.indexOf("animeVideo.php?sn=") != -1){//播放頁面
        const PLAYBACK_RATE = 1.0;
        const VIDEO_TAG_NAME = 'VIDEO-JS';
        const NCC_CLASS_NAME = "video-cover-ncc";
        const LS_ITEM_NAME = "ani_gamer_com_tw_skip_all";
        const DM_ITEM_NAME = "ani_gamer_com_tw_DM_SHOW";

        let detail = document.evaluate('//*[@id="BH_background"]/div[2]/div[2]/div[1]/section[1]/div[2]/div', document).iterateNext();

        const item = document.createElement('div');
        item.id = 'always_TIME';
        item.className = 'newanime-count';
        item.style = "text-indent:1em;";
        item.innerHTML = `00:00 / 00:00　0%`;

        detail.append(item);

        let skip = false;
        switch(localStorage.getItem(LS_ITEM_NAME)){
            case "true":{
                skip = true;
                break;
            }
            case null:{
                localStorage.setItem(LS_ITEM_NAME,"false");
            }
            case "false":{
                skip = false;
                break;
            }
        }

        let show_dm = false;
        switch(localStorage.getItem(DM_ITEM_NAME)){
            case "true":{
                show_dm = true;
                break;
            }
            case null:{
                localStorage.setItem(DM_ITEM_NAME,"false");
            }
            case "false":{
                show_dm = false;
                break;
            }
        }

        let dis = document.createElement('div');
        dis.classList.add("btCon");

        const style = document.createElement('style');
        style.innerHTML = `
        .btCon{
            display: flex;
        }

        .sw_item{
        display: flex;
        flex-direction: row;
        align-content: center;
        flex-wrap: wrap;
        margin-right: 0.5em;
        }

        #hid{
        display: inline-block;
        margin-left: 1em;
        }

        .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 24px;
        }

        .switch input {
        opacity: 0;
        width: 0;
        height: 0;
        }

        .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 34px;
        }

        .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 2px;
        top: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
        }

        input:checked + .slider {
        background-color: #00B0B6;
        }

        input:checked + .slider:before {
        -webkit-transform: translateX(16px);
        -ms-transform: translateX(16px);
        transform: translateX(16px);
        }

        #auto_play{
        align-items: center;
        color: var(--text-default-color);
        font-size: 1.5em;
        }

        #auto_hid_dm{
        align-items: center;
        color: var(--text-default-color);
        font-size: 0.5em;
        line-height: 1.5;
        }

        .down{
         display:inline-block;
         -webkit-transform: translateY(20%);
         -ms-transform: translateY(20%);
         transform: translateY(20%);
        }

        .swText{
            align-content: center;
        text-indent: 0.5rem;
        }

        .hidde{
        display:none !important;
        }
        `;
        document.head.append(style);


        const sk_sw = document.createElement('div');
        sk_sw.classList.add("sw_item");
        sk_sw.innerHTML = `
    <label class="switch">
    <input type="checkbox" ${(skip?"checked":"") } onchange="if(this.checked){localStorage.setItem('${LS_ITEM_NAME}','true');}else{localStorage.setItem('${LS_ITEM_NAME}','false');}" id="skip_cb">
    <span class="slider">
    </label>
    </span>
    <span id="auto_play" class="swText">自動撥放
    </span>`;
        dis.append(sk_sw);

        //dis = document.evaluate('//*[@id="BH_background"]/div[2]/section[1]/div[2]/div[1]', document).iterateNext();

        const dm_sw = document.createElement('div');
        dm_sw.classList.add("ani-tabs__item");
        dm_sw.classList.add("sw_item");
        dm_sw.innerHTML = `
    <label class="switch">
    <input type="checkbox" ${(show_dm?"checked":"") } onchange="
    console.log(this.checked);
    if(this.checked){
        localStorage.setItem('${DM_ITEM_NAME}','true');
        document.getElementById('hid').classList.remove('hidde');
    }else{
        localStorage.setItem('${DM_ITEM_NAME}','false');
        document.getElementById('hid').classList.add('hidde');
    }" id="swdm_cb">
    <span class="slider">
    </span>
    </label>
    <span id="auto_hid_dm" class="swText">
    自動至彈幕設定<span id="hid">省的看那群SB發言</span>
    </span>`;
        dis.append(dm_sw);

        document.evaluate('//*[@id="BH_background"]/div[2]/div[2]/div[1]/section[1]/div[2]', document).iterateNext().append(dis);

        if(show_dm){
            document.evaluate('//*[@id="setting-danmu"]/a', document).iterateNext().click();
        }else{
            document.getElementById('hid').className = 'hidde';
            document.getElementById('sw_span').className = 'down';
        }



        const updateVideoPlaybackRate = node => {
            if (node.tagName !== VIDEO_TAG_NAME) {
                return;
            }

            node.player.defaultPlaybackRate(PLAYBACK_RATE);
        };

        const skipNCCTerm = (node) => {
            if ((!document.getElementById("skip_cb").checked) || (node.className !== NCC_CLASS_NAME)) {
                return;
            }

            const button = document.querySelector('#adult');
            button.click();
        }

        const mutationCallback = xs => {
            for(let j=0;j<xs.length;j++){
                switch(xs[j].target.className){
                    case "vjs-current-time-display":{
                        if(document.querySelector('.vjs-current-time-display') && document.querySelector('.vjs-duration-display')){
                            const now = document.querySelector('.vjs-current-time-display').textContent;
                            const all = document.querySelector('.vjs-duration-display').textContent;
                            if(now != "" && all != ""){
                                document.getElementById("always_TIME").innerHTML = now + " / " + all + "　" + (timetoper(now,all)*100).toFixed(2) + "%";
                            }
                        }
                        break;
                    }
                    case "nativeAD-skip-button enable":{
                        let AD_skip = document.getElementsByClassName("nativeAD-skip-button enable");
                        for(let i=0;i<AD_skip.length;i++){
                            let AD_item = AD_skip[i];
                            AD_item.click();
                        }
                        //console.log(xs);
                        break;
                    }
                    case "vjs-control-text":{
                        //console.log(xs[j].target);
                        if(document.getElementById("skip_cb").checked){
                            let anv = document.getElementById("ani_video");
                            if(anv.className.indexOf("vjs-ended") != -1){
                                console.log("end");
                                let divlist = anv.getElementsByClassName("replay");
                                for(let i=0;i<divlist.length;i++){
                                    let find = divlist[i];
                                    let a = find.getElementsByTagName("a");
                                    if(a.length >= 2){
                                        setTimeout(()=>{
                                            a[1].click();
                                        }, 500);
                                    }
                                }
                            }
                        }
                        break;
                    }
                        /*case "info":{
                    console.log("廣告開播");
                    let intervalID = setInterval(function() {
                        let iframe = document.querySelector("iframe");
                        console.log(iframe);
                        console.log(iframe.innerHTML);
                        //let idoc = iframe.contentWindow.document;
                        //console.log(idoc);
                        //console.log(document.evaluate('/html/body/div[3]/div[2]/section[1]/div[1]/div/div[1]/video-js/div[12]/div[1]/div/iframe[1]', document).iterateNext().contentWindow.document);
                        //console.log(idoc.getElementsByClassName("videoAdUiSkipButton videoAdUiAction videoAdUiRedesignedSkipButton"));
                    }, 500);
                    break;
                }*/
                }
            }
            //console.log(xs)
            xs.forEach(({ addedNodes }) => {
                addedNodes.forEach(node => {
                    updateVideoPlaybackRate(node);
                    skipNCCTerm(node);
                });
            });
        };

        const observer = new MutationObserver(mutationCallback);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
    //全部都做的
    //幫所有動畫標題加上滑鼠移上去即顯示的功能
    /*let theme_name = document.getElementsByClassName("theme-name");
    for(let i=0;i<theme_name.length;i++){
        let p = theme_name[i];
        p.setAttribute('title',p.innerText);
        console.log(p);
    }*/
})();

function timetoper(now,all){
    let now_sec = timeformatescend(now);
    let all_sec = timeformatescend(all);
    let per = now_sec / all_sec;
    return per;
}

function timeformatescend(t){
    let t_arr = t.split(":").reverse();
    let t_sec = 0;
    switch(t_arr.length){
        case 3:{
            t_sec += parseInt(t_arr[2],10)*3600;
        }
        case 2:{
            t_sec += parseInt(t_arr[1],10)*60;
        }
        case 1:{
            t_sec += parseInt(t_arr[0],10);
        }
    }
    return t_sec;
}