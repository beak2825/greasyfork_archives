// ==UserScript==
// @name         downloadNickJrVideoSubstitle
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  下载nickjr短片的字幕
// @author       You
// @match        http://www.nickjr.tv/*/videos/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407306/downloadNickJrVideoSubstitle.user.js
// @updateURL https://update.greasyfork.org/scripts/407306/downloadNickJrVideoSubstitle.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Your code here...

    // 等待视频开始播放
    await new Promise(r => {setTimeout(r, 3000);}); // 点击分页时，等待清理
    while( !EdgePlayer.activePlayer ) {
        await new Promise(r => {console.log("等待视频开始播放"); setTimeout(r, 1000);});
    }
    // insert element
    console.log("在cc按钮前插入下载按钮");
    let ccEl = document.querySelector("div.edge-gui-cc-button");
    ccEl.innerHTML= '<span style="width:3em;margin-left:-4em" title="油猴脚本，下载srt字幕">下载cc</span>'
    ccEl.lastElementChild.onclick = downloadVtt;

    console.log("在footer栏前插入下载按钮");
    let newEl = document.createElement("li");
    newEl.className="footer-item";
    newEl.innerHTML='<div class="footer-text">下载cc</div>';
    newEl.onclick = downloadVtt;
    let footerEl = document.querySelector("ul.footer-legal-items");
    footerEl.insertBefore(newEl, footerEl.firstElementChild);


    // 功能
    async function downloadVtt(){
        let mediaGenUrl = EdgePlayer.activePlayer.configModel.runTimeConfig.usedMediaGenUrl;
        let obj = await (await fetch(mediaGenUrl)).json();

        // merge and down
        // filename from url
        // let fn = location.pathname.replace("videos","_").replace(/\//g,"").replace(/\-/g," ")+".srt";
        // filename from title
        let h1El=document.querySelector("h1.module-about-title")
        let fn = h1El.nextElementSibling.querySelector("a").innerText + " " + h1El.innerText;

        let preDuration=0;
        let preLineCounter=0;
        let srtTextList = [];
        for( let videoItem of obj.package.video.item ){
            // srclang==="en"
            let enTranscript = videoItem.transcript.find(aTranscript=>aTranscript.srclang=="en");
            if( !enTranscript ){
                console.log("未找到“srclang=en”的字幕");
                continue;
            }
            // format==="vtt"
            let vttTypographic=enTranscript.typographic.find(a=>a.format==="vtt");
            if( !vttTypographic ){
                console.log("未找到“format=vtt”的字幕");
                continue;
            }
            // fetch vtt
            let vttText = await (await fetch(vttTypographic.src)).text();

            // vtt2srt
            let srtText = vtt2srt(vttText, '\n', preLineCounter+1, preDuration);
            srtTextList.push(srtText);

            // 累加时长
            preDuration = preDuration + videoItem.rendition[0].duration;
            preLineCounter = preLineCounter + (srtText.match(/\-\->/g) || []).length;
        }

        download(fn+".nickjr.srt", srtTextList.join("\n"));
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // base on https://cdn.jsdelivr.net/npm/vtt2srt@0.1.1/vtt2srt.js
    const vttRemoval = /(WEBVTT\s+)/mg;
    const timeMatcher = /^\d*\n(\d{2}:\d{2}:\d{2})\.(\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2})\.(\d{3}).*$/mg
    const htmlRemoval = /<\/?\w+>/g;

    function vtt2srt(vttString, separator = '\n', lineCounterStartValue=1, deltaTime=0) {
         // removes VTT header
        let srtString = vttString.replace(vttRemoval, '');
         // removes html tag
        srtString = srtString.replace(htmlRemoval, '');

        let lineCounter = lineCounterStartValue-1;
        srtString = srtString.replace(timeMatcher, function (match) {
            lineCounter++;
            if( deltaTime==0 ){
                return lineCounter + separator + match.replace(timeMatcher, '$1,$2 --> $3,$4');
            }else{
                // todo, change time by add deltaTime
                console.log("todo, 未实现字幕合并中的时间调整功能")
                return lineCounter + separator + match.replace(timeMatcher, '$1,$2 --> $3,$4');
            }
        });

        return srtString;
    }

})();