// ==UserScript==
// @name         PGN Exporter
// @namespace    Exporter
// @version      0.1
// @description  adds option to download pgn and video to chessable
// @author       You
// @match        https://www.chessable.com/course/*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472485/PGN%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/472485/PGN%20Exporter.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    init()
})();

async function init(){
    loadAxios();
    await new Promise(r => setTimeout(r, 1000));
    await awaitFocus();

    while(document.getElementsByClassName("variation-card__moves").length == 0)
        await new Promise(r => setTimeout(r, 50));
    createPGNDownLoadLink()
    while(document.getElementsByClassName("wistia_embed").length == 0)
        await new Promise(r => setTimeout(r, 50));
    createVideoDownLoadLink();

    console.log("links created")
    recreateLinks()
}

async function recreateLinks(){
    while(document.getElementById("pgnDownloader") != null){
        await new Promise(r => setTimeout(r, 500));
    }
    init()
}

function createVideoDownLoadLink(){
    let alink = document.createElement("a");
    alink.href = "#";
    alink.text = "📀 Download Video";
    alink.onclick = function(){
        downloadVideo();
    };
    document.getElementById("courseOptionsBox").children[1].appendChild(alink)
}

function createPGNDownLoadLink(){
    let alink = document.createElement("a");
    alink.id = "pgnDownloader"
    alink.href = "#";
    alink.text = "📗 Download PGN";
    alink.onclick = function(){
        let str = printPgn();
        saveAsFile(document.getElementsByTagName("h1")[0].innerText.replaceAll(".", "") + ".pgn", "text/pgn", str)
    };
    document.getElementById("courseOptionsBox").children[1].appendChild(alink)
}

async function awaitFocus(){
    if(document.hasFocus())
        return;
    await new Promise(r => setTimeout(r, 1000));
    await awaitFocus();
}

function loadAxios(){
    function getScript(url, success) {
        var script = document.createElement('script');
        script.src = url;
        var head = document.getElementsByTagName('head')[0],
            done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState
                          || this.readyState == 'loaded'
                          || this.readyState == 'complete')) {
                done = true;
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    }
    getScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js',function() {
        // axios is ready
        console.log("axios loaded")
    });
}

function saveAsFile(filename, dataType, textInput) {
    var element = document.createElement('a');
    element.setAttribute('href','data:' + dataType + ';charset=utf-8, ' + encodeURIComponent(textInput));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
}

function printPgn(){
    let str = ""
    let header1 = '[Event ""]\n\n'
    for(let i = 0 ; i < document.getElementsByClassName("variation-card__moves").length; i++ ){
        str += header1 + document.getElementsByClassName("variation-card__moves")[i].innerText + "\n\n"
    }
    console.log(str)
    return str;
}

function getVideoJson(){
    return window['wistiajsonp-/embed/medias/' + document.getElementsByClassName("wistia_embed_initialized")[0].id.replace("wistia-","").replace("-1","") + ".jsonp"]
}
async function closeTab(){
    await new Promise(r => setTimeout(r, 5000));
}

function downloadVideo(filename = document.getElementsByTagName("h1")[0].innerText.replaceAll(".", "") + ".mp4", videoUrl = getVideoJson().media.assets[1].url){
    console.log(filename + " " + videoUrl);
    axios({
        url: videoUrl,
        method:'GET',
        responseType: 'blob'
    })
        .then((response) => {
        const url = window.URL
        .createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    })
}