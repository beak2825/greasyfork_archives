// ==UserScript==
// @license      MIT
// @name         halihali便携按钮
// @namespace    哈哩哈哩快速操作按钮
// @description  快速上一集下一集，快速跳到指定位，窗口化全屏功能，切源功能。
// @version      2.1
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener



// @downloadURL https://update.greasyfork.org/scripts/436811/halihali%E4%BE%BF%E6%90%BA%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/436811/halihali%E4%BE%BF%E6%90%BA%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //层key关键id
    // key: C1
    // key: C2
    // key: C3

    /*
       全自动流程 1.进入C2表示切换集数，自动全屏，自动跳片头，自动跳片尾

       1.层1-层2切换源 C1-C2.VideoResNext
       2.层1-层3跳片头 C1-C3.VdoProgressSet
       3.层3-层1自动下一集 C3-C1.NextVideo
       4.

    */
    let url = location.hostname;

    console.log("0.标签↓. " + url);


    if(url.indexOf("hali") != -1){
        //----------------------------------AD---------------------------------
        setTimeout(()=>{
            //AD清除广告
            if(document.querySelector("#HMRichBox")){
                document.querySelector("#HMRichBox").remove();
            }
            if(document.querySelector("#HMcoupletDivright")){
                document.querySelector("#HMcoupletDivright").remove();
            }
            if(document.querySelector("#HMcoupletDivleft")){
                document.querySelector("#HMcoupletDivleft").remove();
            }
        },"500");


        //------------------------------------C1-----------------------------------------------------------------------------
        if(document.querySelector("#player")){
            //主站外部框架
            console.log("1.哈哩哈哩播放器页面进入");

            let style = document.createElement("style");
            style.type = "text/css";
            let str = ``;
            //样式收缩
            if(true){
                str = `
            .MyFullscreen {
                position:fixed;
                top:0px;
                left:0px;
                z-index:9999;
                width:100%;
                height:100%;
            }
            .PlayerSettings{
                position:fixed;
                left:0;
                z-index:999999;
                top:50vh;
                transform: translate(0,-50%);
                background:rgba(0,0,0,0.8);
                width:72px;
                min-width:58px;
                min-height:240px;
                float:left;
                padding:14px;
                border-radius:10px;
                margin:2px;
                transition: all 0.2s;
            }
            .PlayerSettings>*{
                min-width:70px;
                min-height:30px;
                float:left;
            }
            .PlayerSettings>*+*{
                margin-left:0px;
            }
            .EditView{
                text-align:center;
                width:60px;
            }
            .Hide{
                opacity:0;
            }
            `;
            }

            style.innerHTML = str.split("\n").map(o => o.trim()).filter(o => o).join("");
            //console.log(style.innerHTML);
            document.head.appendChild(style);

            let layout = document.createElement("div");
            layout.className = "PlayerSettings";
            layout.classList.add("PlayerSettings", "Hide");
            document.body.appendChild(layout);
            layout.onmouseover = function () {
                layout.classList.remove("Hide");
            };
            layout.onmouseout = function () {
                layout.classList.add("Hide");
            };
            //上一集下一集
            let episodes = (add) => {
                localStorage.ifNextFullscreen = 1;

                let url = location.href;
                let index = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
                index = Number.parseInt(index) + add;
                url = url.substring(0, url.lastIndexOf("/") + 1) + index + url.substring(url.lastIndexOf("."));
                location.href = url;
            }
            //全屏按钮
            let fullscreens = () =>{
                localStorage.removeItem("ifNextFullscreen");

                let player = document.getElementById("player");
                player.classList.toggle("MyFullscreen", !player.classList.contains("MyFullscreen"));
            }
            //切换视频源
            let nextResVideo = () =>{
                GM_setValue("C1-C2.VideoResNext", URL.createObjectURL(new Blob()));//C1-C2.VideoResNext
            }
            //跳进度
            let progressVideo = (timme) =>{
                GM_setValue("C1-C3.VdoProgressSet", -1);//C1-C3.VdoProgressSet
                GM_setValue("C1-C3.VdoProgressSet", timme);//C1-C3.VdoProgressSet
            }


            //按钮界面收缩
            if(true){
                let items = [
                    {
                        label: "全屏",
                        click: () => {
                            fullscreens();
                        }
                    },
                    {
                        label: "上一集",
                        click: () => {
                            episodes(-1);
                        }
                    },
                    {
                        label: "下一集",
                        click: () => {
                            episodes(1);
                        }
                    },
                    {
                        label:"换源",
                        click:() => {
                            nextResVideo();
                        }
                    },
                    {
                        label:"progress"
                    },
                    {
                        label:"跳片头",
                        click:()=>{
                            let et = document.querySelector("#et_time").value;
                            let saveTime = (GM_getValue('headTime')) ? GM_getValue('headTime') : 90;
                            if(et != saveTime){
                                GM_setValue('headTime', et);
                            }

                            let etL = document.querySelector("#et_time2").value;
                            let save2Time = (GM_getValue('tailTime')) ? GM_getValue('tailTime') : 360;
                            if(etL != save2Time){
                                GM_setValue('tailTime', etL);
                            }

                            progressVideo(et);
                        }
                    },
                    {
                        label:"checkInput",
                        click:()=>{
                            //全自动按键触发
                            let all = document.querySelector("#ck_allAuto");
                            if(all.checked){
                                GM_setValue('allAuto3', 1);
                            }else{
                                GM_deleteValue('allAuto3');
                            }
                        }
                    }
                ]

                items.forEach(item => {
                    //进度栏
                    if(item.label == "progress"){
                        let dv = document.createElement("div");
                        dv.appendChild(document.createTextNode('头 '));
                        let el1Et = document.createElement("input");
                        el1Et.style.width = "49px";
                        el1Et.className = "EditView";
                        el1Et.id = "et_time";
                        el1Et.value = (GM_getValue('headTime')) ? GM_getValue('headTime'):90;
                        dv.appendChild(el1Et);
                        dv.appendChild(document.createTextNode('尾 '));
                        let el2Et = document.createElement("input");
                        el2Et.style.width = "49px";
                        el2Et.className = "EditView";
                        el2Et.id = "et_time2";
                        el2Et.value = (GM_getValue('tailTime')) ? GM_getValue('tailTime'):360;
                        dv.appendChild(el2Et);
                        layout.appendChild(dv);
                    }
                    //自动触发
                    else if(item.label == "checkInput"){
                        let dv = document.createElement("div");
                        let elCk = document.createElement("input");
                        elCk.id = "ck_allAuto";//全自动
                        elCk.type = "checkbox";
                        elCk.checked = (GM_getValue('allAuto3'));
                        elCk.addEventListener("click", item.click);
                        dv.appendChild(elCk);
                        dv.appendChild(document.createTextNode(' 全自动'));
                        layout.appendChild(dv);
                    }
                    //按钮
                    else{
                        let el = document.createElement("button");
                        el.innerText = item.label;
                        el.addEventListener("click", item.click);
                        layout.appendChild(el);
                    }
                })
            }

            //下一集触发自动全屏
            if(localStorage.ifNextFullscreen == 1){
                fullscreens();
            }

            //自动切换下一集
            GM_addValueChangeListener("C3-C1.NextVideo", (name, oldValue, newValue, remote)=>{
                episodes(1);
            });




            return;
        }
        //End---------------------------------C1-----------------------------------------------------------------------------

    }
    else{;
         if(document.querySelector("#divplay")){
             //----------------------------------------------C2---------------------------------------------------------------
             document.querySelector("#playiframe").style.height = "100%";
             //二级播放器容器中间件
             console.log("2.播放器中间件");

             //视频源列表
             let playroad = document.querySelector("#playroad");
             if(playroad){
                 playroad.style.position = "absolute";
                 playroad.style.left = "0px";
                 playroad.style.top = "0px";
                 playroad.style.width = "100%";
                 playroad.style.opacity = "0";
                 playroad.onmouseover = function () {
                     this.style.opacity = "1";
                 };
                 playroad.onmouseout = function () {
                     this.style.opacity = "0";
                 };
             }else{
                 return;
             }

             //切换视频源
             GM_addValueChangeListener("C1-C2.VideoResNext", (name, oldValue, newValue, remote)=>{
                 console.log("换源按钮触发");
                 let resLists = document.getElementById("playroad");
                 //优先备用线2（判断是否优先使用）
                 let beiTag = false;
                 let useBei = true;//暂时先true
                 if(useBei){
                     resLists.childNodes.forEach(item => {
                         if(item.innerText == "备用线2" && item.style.color != "rgb(47, 179, 255)"){//未选中
                             item.click();
                             beiTag = true;
                         }
                     });
                     if(beiTag){
                         return;
                     }
                 }
                 //下一个源
                 resLists.childNodes.forEach(item => {
                     if(item.tagName == 'A'){
                         if(item.style.color == "rgb(47, 179, 255)"){//选中 蓝色
                             beiTag = true;
                         }else if(item.style.color == "rgb(170, 170, 170)" && beiTag){//灰色
                             beiTag = false;
                             item.click();
                         }else if(item.style.color == "rgb(255, 0, 0)" && beiTag){//红色
                             beiTag = false;
                             item.click();
                         }
                     }
                 });
             });

             //自动播放
             setTimeout(()=>{
                 if(GM_getValue('allAuto3')){
                     GM_setValue("C1-C3.VdoProgressSet", -1);
                     GM_setValue("C1-C3.VdoProgressSet", (GM_getValue('headTime')) ? GM_getValue('headTime') : 90);
                 }else{
                     GM_setValue("C2-C3.AutoPlay", URL.createObjectURL(new Blob()));
                 }

             },"1000");

             return;
             //End-------------------------------------------C2---------------------------------------------------------------
         }

         //--------------------------------------------------------------C3---------------------------------------------------
         //a1:线1，2 video:线3，4  player1:备线1，2，线10
         if(document.querySelector('#a1') || document.querySelector("#player1") || document.querySelector("#video")){
             //播放器内层
             console.log("3.播放器层");

             //视频播放器监听
             setTimeout(()=>{
                 //console.log("vdp set time");
                 document.querySelector('video').addEventListener("ended", ()=>{
                     GM_setValue("C3-C1.NextVideo", URL.createObjectURL(new Blob()));
                 });
                 document.querySelector('video').ontimeupdate = ()=>{
                     if(GM_getValue('allAuto3')){//是否开启全自动
                         let tailT = (GM_getValue('tailTime')) ? GM_getValue('tailTime') : 360;
                         if(document.querySelector('video').currentTime > tailT){
                             GM_setValue("C3-C1.NextVideo", URL.createObjectURL(new Blob()));
                         }
                     }
                 };

             },(document.querySelector('video')?"0":"8000"));//如果搜索不到，延迟搜索


             //自动播放功能
             let autoPlay = () =>{
                 let vdo = document.querySelector('video');
                 if(vdo.paused){//如果已经暂停，那么就可能静音播放
                     vdo.muted = true;
                     vdo.play();
                 }

                 //静音后处理
                 if(vdo.muted){
                     //添加解除静音按钮
                     let bd = document.querySelector('body');
                     let btnSound = document.querySelector('#soundBtn');
                     if(!btnSound){
                         let el = document.createElement("button");
                         el.id = "soundBtn";
                         el.style.position = "absolute";
                         el.style.width = "100%";
                         el.style.height = "100%";
                         el.style.bottom = "0px";
                         el.style.top = "0px";
                         el.style.left = "0px";
                         el.style.right = "0px";
                         el.style.color = "rgb(255,255,255)";
                         el.style.background = "rgba(0,0,0,0.5)";
                         el.innerText = "音量点击";
                         el.addEventListener("click", ()=>{
                             document.querySelector('#soundBtn').remove();
                             document.querySelector('video').muted = false;
                         });
                         bd.appendChild(el);
                     }
                 }
             }

             //视频快进
             GM_addValueChangeListener("C1-C3.VdoProgressSet", (name, oldValue, newValue, remote)=>{
                 //快进
                 let vdo = document.querySelector('video');
                 if(oldValue == "-1" && vdo){
                     vdo.currentTime += +newValue;
                     autoPlay();
                 }
             });

             //自动播放
             GM_addValueChangeListener("C2-C3.AutoPlay", (name, oldValue, newValue, remote)=>{
                 if(document.querySelector('video')){
                     autoPlay();
                 }
             });

             return;
         }
         //--------------------------------------------------------------C3---------------------------------------------------

         console.log("4.其他:" + url);
        }
})();