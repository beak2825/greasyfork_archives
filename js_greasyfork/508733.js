// ==UserScript==
// @name           senpai-stream-plus
// @namespace      ssp
// @match          https://senpai-stream.net/episode/*
// @match          https://senpai-stream.net/movie/*
// @license        MIT
// @version        1.1.2
// @author         Mollomm1
// @description    Supprime les pubs et permet de télécharger depuis le site senpai stream.
// @grant          GM_addStyle
// @require        https://unpkg.com/plyr@3.7.8/dist/plyr.min.js
// @require        https://unpkg.com/hls.js@1.5.15/dist/hls.js
// @downloadURL https://update.greasyfork.org/scripts/508733/senpai-stream-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/508733/senpai-stream-plus.meta.js
// ==/UserScript==

// modified version of http://github.com/SuperZombi/m3u8-downloader-js, with multithreading to make dowload mush faster, i minified it to make the rest of the code easier to read.
function M3U8(){var e=this;function n(e,n,a,i){var s=this;this.aborted=!1,function e(n,a,i,d){Promise.all([fetch(n[i]),n[i+1]?fetch(n[i+1]):Promise.resolve()]).then((function(e){return r(function(e,n){for(var r=[],t=0;t<e.length;t++)n(e[t],t)&&r.push(e[t]);return r}(e,(function(e){return e&&e.blob})),(function(e){return e.blob()}))})).then((function(e){return Promise.all(e)})).then((function(l){var u=r(l,(function(e,a){return new Promise((function(l,u){var f=new FileReader;f.readAsArrayBuffer(new Blob([e],{type:"octet/stream"}));f.addEventListener("loadend",(function(e){l(f.result),s.onprogress&&s.onprogress({segment:i+a+1,total:n.length,percentage:Math.floor((i+a+1)/n.length*100),downloaded:o(+t(r(d,(function(e){return e.byteLength})),(function(e,n){return e+n}),0)),status:"Downloading..."})}))}))}));Promise.all(u).then((function(r){for(var t=0;t<r.length;t++)d.push(r[t]);var o=n[i+2]?2:1;if(s.aborted)return d=null,void s.aborted();n[i+o]?setTimeout((function(){e(n,a,i+o,d)}),s.ie?500:0):a(d)}))})).catch((function(e){s.onerror&&s.onerror("Something went wrong when downloading ts file, nr. "+i+": "+e)}))}(e,n,a,i)}function r(e,n){for(var r=e.slice(0),t=0;t<e.length;t++)r[t]=n(e[t],t);return r}function t(e,n,r){var t=r;return e.forEach((function(e,r){var o=+n(t,e,r);t=o})),t}function o(e){for(var n=[{divider:1e18,suffix:"EB"},{divider:1e15,suffix:"PB"},{divider:1e12,suffix:"TB"},{divider:1e9,suffix:"GB"},{divider:1e6,suffix:"MB"},{divider:1e3,suffix:"kB"}],r=0;r<n.length;r++){if(e>=n[r].divider)return(e/n[r].divider).toString().toString().split(".")[0]+n[r].suffix}return e.toString()}this.ie=navigator.appVersion.toString().indexOf(".NET")>0,this.ios=navigator.platform&&/iPad|iPhone|iPod/.test(navigator.platform),this.start=function(t,o){o||(o={});var a,i={progress:null,finished:null,error:null,aborted:null};function s(e,n){e&&i[e]&&i[e](n)}if(e.ios)return s("error","Downloading on IOS is not supported.");var d={on:function(e,n){switch(e){case"progress":i.progress=n;break;case"finished":i.finished=n;break;case"error":i.error=n;break;case"aborted":i.aborted=n}return d},abort:function(){a&&(a.aborted=function(){s("aborted")})}};new Promise((function(i,d){var l=new URL(t);fetch(t).then((function(e){return e.text()})).then((function(t){var u=r(t.match(/^(?!#)(.+)\.(.+)$/gm),(function(e,n){return new URL(e,l).href}));if(!u.length)return d("Invalid m3u8 playlist"),s("error","Invalid m3u8 playlist");(a=new n(u,(function(n){var r=new Blob(n,{type:"octet/stream"});if(s("progress",{status:"Processing..."}),o.returnBlob)s("finished",{status:"Successfully downloaded video",data:r}),i(r);else if(e.ios);else if(e.ie)s("progress",{status:"Sending video to Internet Explorer... this may take a while depending on your device's performance."}),window.navigator.msSaveBlob(r,o&&o.filename||"video.mp4");else{s("progress",{status:"Sending video to browser..."});var t=document.createElementNS("http://www.w3.org/1999/xhtml","a");t.href=URL.createObjectURL(r),t.download=o&&o.filename||"video.mp4",t.style.display="none",document.body.appendChild(t),t.click(),s("finished",{status:"Successfully downloaded video",data:r}),i(r)}}),0,[])).onprogress=function(e){s("progress",e)}})).catch((function(e){s("error","Something went wrong when downloading m3u8 playlist: "+e)}))}));return d}}function createWorker(){var e=new Blob(["\n        self.onmessage = function(e) {\n            var url = e.data.url;\n            fetch(url)\n                .then(response => response.blob())\n                .then(blob => {\n                    var reader = new FileReader();\n                    reader.readAsArrayBuffer(blob);\n                    reader.onloadend = function() {\n                        self.postMessage({\n                            url: url,\n                            data: reader.result\n                        });\n                    }\n                })\n                .catch(error => {\n                    self.postMessage({\n                        url: url,\n                        error: error.toString()\n                    });\n                });\n        }\n    "],{type:"application/javascript"});return new Worker(URL.createObjectURL(e))}function downloadSegments(e,n){var r=[],t=[],o=0,a=[];function i(i){if(i.data.error)console.error("Error downloading segment:",i.data.url,i.data.error);else{t.push(i.data.data),a.push(i.data.data);var s=new Blob(a,{type:"octet/stream"});if(navigator.userAgent.indexOf("MSIE ")>-1||navigator.userAgent.match(/Trident.*rv\:11\./))window.navigator.msSaveBlob(s,"video.mp4");else{var d=document.createElementNS("http://www.w3.org/1999/xhtml","a");d.href=URL.createObjectURL(s),d.download="video.mp4",d.style.display="none",document.body.appendChild(d),d.click()}}++o===e.length&&(n(t),r.forEach((e=>e.terminate())))}e.forEach((e=>{var n=createWorker();n.onmessage=i,n.postMessage({url:e}),r.push(n)}))}M3U8.prototype.start=function(e,n){n||(n={});var r={progress:null,finished:null,error:null,aborted:null},t={on:function(e,n){switch(e){case"progress":r.progress=n;break;case"finished":r.finished=n;break;case"error":r.error=n;break;case"aborted":r.aborted=n}return t},abort:function(){}};new Promise((function(t,o){var a=new URL(e);fetch(e).then((function(e){return e.text()})).then((function(e){var i=e.match(/^(?!#)(.+)\.(.+)$/gm).map((function(e){return new URL(e,a).href}));if(!i.length)return o("Invalid m3u8 playlist"),r.error("Invalid m3u8 playlist");downloadSegments(i,(function(e){var o=new Blob(e,{type:"octet/stream"});if(!n.returnBlob)if(navigator.userAgent.indexOf("MSIE ")>-1||navigator.userAgent.match(/Trident.*rv\:11\./))window.navigator.msSaveBlob(o,n&&n.filename||"video.mp4");else{var a=document.createElementNS("http://www.w3.org/1999/xhtml","a");a.href=URL.createObjectURL(o),a.download=n&&n.filename||"video.mp4",a.style.display="none",document.body.appendChild(a),a.click()}r.finished({status:"Successfully downloaded video",data:o}),t(o)}))})).catch((function(e){r.error("Something went wrong when downloading m3u8 playlist: "+e)}))}));return t};
// non-minified version: https://pastebin.com/sEr6XH4E

async function dl() {
    try {
        fetch(JSON.parse(document.getElementsByClassName("mb-6")[0].attributes[0].value)["data"]["videos"][0][0][0]["link"]).then(response => response.text())
            .then(function(response) {
                const match = "https://senpai-stream.net/m3u8/" + (response.toString().match(/(?<=https:\/\/senpai-stream\.net\/m3u8\/).*(?=" )/) || [])[0];
                const btn = document.querySelector("[data-plyr='download']");
                btn.classList.add("hide");
                const popup_ = document.createElement("div");
                popup_.innerHTML = "[HLS] Downloading Video (0%)";
                popup_.classList.add("popupdl");
                document.getElementsByClassName("plyr__controls")[0].appendChild(popup_);
                var popup = document.getElementsByClassName("popupdl")[0];
                const m3u8 = new M3U8();

                const download = m3u8.start(match);

                download.on("progress", progress => {
                    console.log(progress);
                    popup.innerHTML = "[HLS] Downloading Video (" + progress.percentage + "%)";
                }).on("finished", finished => {
                    console.log(finished);
                    popup.innerHTML = "[HLS] Done Downloading The Video!";
                    setTimeout(function() {
                        popup.remove();
                        btn.classList.remove("hide");
                    }, 2000)
                }).on("error", message => {
                    console.error(message);
                    alert("Download failed, please open the console.")
                }).on("aborted", () => {
                    console.log("Download aborted");
                    alert("Download aborted.");
                });
            });
    } catch (error) {
        console.error('Error fetching the page:', error);
    }
}

GM_addStyle(`
.plyr {
  z-index: 99 !important;
}
.hide {
  display: none !important;
}
.aspect-video {
  aspect-ratio: auto !important;
}

.popupdl {
  position: absolute;
  padding: 10px;
  z-index: 999;
  background-color: #e6e6e6;
  margin-bottom: 110px;
  color: #4a5464;
  left: 0;
  animation: plyr-popup .2s ease;
  box-shadow: 0 1px 2px #00000026;
  border-radius: 8px;
  margin-left: 14px;
  font-family: "Inter", sans-serif;
  font-size: 13px;
}
`);

setTimeout(() => {
    // Remplacement lecteur / Skip Pubs / Téléchargement
    (function() {
        'use strict';

        function StartVideoPlayer(link, ishls) {
            var video = document.querySelector('#player');

            if (ishls == false) {
                var controls = ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'download', 'fullscreen'];
                console.log(controls);
                const player = new Plyr(video, {
                    controls
                });
                video.src = link;
                window.player = player;
            } else {
                if (!Hls.isSupported()) {
                    video.src = link;
                } else {
                    var controls = ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'download', 'fullscreen'];
                    const player = new Plyr(video, {
                        controls
                    });
                    const hls = new Hls();
                    hls.loadSource(link);
                    hls.attachMedia(video);
                    window.hls = hls;
                    document.querySelector("[data-plyr='download']").addEventListener("click", dl);;
                }
            }
        }

        document.getElementsByClassName("aspect-video")[0].innerHTML = `<link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" /><video id="player" playsinline controls></video>`;
        const data = JSON.parse(document.getElementsByClassName("mb-6")[0].attributes[0].value)["data"]["videos"][0][0][0];
        console.log(data)
        if (data["type"] == "mp4") {
            fetch(data["link"]).then(response => response.text())
                .then(function(response) {
                    const parser = new DOMParser();
                    const dat = parser.parseFromString(response, "text/html").getElementById("player").src;
                    StartVideoPlayer(dat, false);
                })
        } else {
           fetch(data["link"]).then(response => response.text())
                .then(function(response) {
                    const match = "https://senpai-stream.net/m3u8/"+(response.toString().match(/(?<=https:\/\/senpai-stream\.net\/m3u8\/).*(?=" )/) || [])[0];StartVideoPlayer(match, true);
                })
        }
    })();
}, 500);