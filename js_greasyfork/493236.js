// ==UserScript==
// @name         抖音视频下载
// @namespace    mscststs
// @version      0.2
// @description  抖音视频下载脚本
// @author       mscststs
// @license      ISC
// @match        https://www.douyin.com/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @match        https://www.douyin.com/?recommend=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @downloadURL https://update.greasyfork.org/scripts/493236/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/493236/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const RemuxIframe = "https://tools.mscststs.com/tools/mp4-remux"


    function createFrame(){
        return new Promise((resolve,reject)=>{
            const frame = document.createElement("iframe");
            frame.style.display = "none";
            frame.src = RemuxIframe;
            document.body.appendChild(frame);
            function handleMessage(event){
                console.log(event);
                const data = event.data;
                if(data === "Mp4Remux_loaded"){
                    const [port2] = event.ports;
                    unsafeWindow.removeEventListener("message", handleMessage)
                    resolve(port2);
                }
            }
            unsafeWindow.addEventListener("message", handleMessage)
        });

    }
    function splitSteps(step, max) {
        let result = [];
        let start = 0;
        while (start < max) {
            let end = Math.min(start + step, max);
            result.push([start, end]);
            start = end + 1;
        }
        return result;
    }

    async function autoRangeFecth(url, initial= "0-100"){
        const pos = 0;

        const step = 2097152 ; // 分片大小  2Mib
        let totalSize = 0;
        let controller = new AbortController();


        let res = await fetch(url, {
            headers:{
                //"range": "bytes="+initial,
            },
            "mode": "cors",
            signal: controller.signal

        });
        const range = res.headers.get('content-length');
        totalSize = parseInt(range);
        controller.abort(); // 中断


        const {readable, writable} = new TransformStream();

        const rangeFecth = async ()=>{
            const segments = splitSteps(step, totalSize);

            for(const seg of segments){
                const [start,end] = seg;
                const res = await fetch(url,{
                    headers:{
                        "range": `bytes=${start}-${end}`
                    }
                });
                await res.body.pipeTo(writable,{preventClose:true});
            }
            writable.close();
        }
        rangeFecth();
        return readable;
    }


    const down = async ()=>{

        let url = unsafeWindow.player.videoList[0].playApi;
        const playinfo = unsafeWindow.player.videoList[0];
        console.log(url);
        let name = `${playinfo.fileId}`;
        try{
            name = `【${unsafeWindow.player.innerContainer.parentElement.querySelector(".account-name").innerText}】${unsafeWindow.player.innerContainer.parentElement.querySelector(".title").innerText}`;
        }catch(e){
            console.error(e)
        }

        const port2 = await createFrame();

        const videoStream = await autoRangeFecth(url);
        //return;
        port2.postMessage(
            {
                type:"download",
                stream: videoStream,
                filename:name
            },
            [videoStream]
        );

    };


    GM_registerMenuCommand("下载当前视频",()=>{
        down();
    });
})();