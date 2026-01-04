// ==UserScript==
// @name         自用-视频下载
// @namespace    mscststs
// @version      0.2
// @description  Download BiliBili
// @license      ISC
// @author       mscststs
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/476965/%E8%87%AA%E7%94%A8-%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/476965/%E8%87%AA%E7%94%A8-%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RemuxIframe = "https://tools.mscststs.com/tools/mp4-remux"

    async function getPlayInfo(aid, bvid, cid){
        let res = await fetch(`https://api.bilibili.com/x/player/wbi/playurl?avid=${aid}&bvid=${bvid}&cid=${cid}&qn=116&fnver=0&fnval=4048`, {
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        return await res.json();
    }

    function getIds (){
        if(unsafeWindow.__INITIAL_STATE__){
            const p = unsafeWindow.__INITIAL_STATE__.p;
            let {aid, bvid, cid,title} = unsafeWindow.__INITIAL_STATE__.videoData;
            if(unsafeWindow.__INITIAL_STATE__.videoData.pages.length !== 1){
                cid = unsafeWindow.__INITIAL_STATE__.videoData.pages[p-1].cid;
                title += "_"+unsafeWindow.__INITIAL_STATE__.videoData.pages[p-1].part;
            }
            //        const cid = cidMap[aid].cids[p];
            return {aid,bvid,cid, title};
        }else{
            const query = unsafeWindow.__NEXT_DATA__.props.pageProps.dehydratedState.queries[0];
            const isep = query.queryKey[1].startsWith("ep");
            if(isep){
                const ep = parseInt(query.queryKey[1].slice(2));
                const p = query.state.data.initEpList.find(item=>item.id == ep);
                const {aid,bvid,cid} = p;
                const title = p.share_copy;
                return {aid,bvid,cid,title};
            }else{

                const {aid,bvid,cid} = query.state.data.initEpList[0];
                const title = query.state.data.seasonList[0].season_title;
                return {aid,bvid,cid,title};
            }
        }
    }

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
        const {aid,bvid,cid,title} = getIds();
        const playInfo = await getPlayInfo(aid, bvid, cid);
        console.log(playInfo);
        const bestVideo = playInfo.data.dash.video[0];
        const bestAudio = playInfo.data.dash.audio[0];
        const port2 = await createFrame();

        const videoStream = await autoRangeFecth(bestVideo.baseUrl, bestVideo.segment_base.initialization);
        const audioStream = await autoRangeFecth(bestAudio.baseUrl, bestAudio.segment_base.initialization);
        //return;

        //const videoStream = (await fetch(bestVideo)).body;
        //const audioStream = (await fetch(bestAudio)).body;
        port2.postMessage(
            {
                type:"video",
                stream: videoStream
            },
            [videoStream]
        );
        port2.postMessage(
            {
                type:"audio",
                stream: audioStream
            },
            [audioStream]
        );
        port2.postMessage(
            {
                type:"remux",
                filename:title
            },
        )

    };


    GM_registerMenuCommand("下载当前视频",()=>{
        down();
    });



})();