// ==UserScript==
// @name YouTube™ Video Downloader (1440p Update)
// @description In just one page, you can now download your favorite videos on YouTube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       LazymanzoidYT (Design by Anpkal_Zuev)
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_xmlhttpRequest
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible edge
// @compatible brave
// @connect      googuu.xyz
// @connect      loader.to
// @connect      oceansaver.in
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438561/YouTube%E2%84%A2%20Video%20Downloader%20%281440p%20Update%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438561/YouTube%E2%84%A2%20Video%20Downloader%20%281440p%20Update%29.meta.js
// ==/UserScript==

// Copyright (c) 2021 Anpkal Zuev, LazymanzoidYT and others

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  window.onload = function() {
      var dark = !!document.getElementsByTagName("html")[0].getAttribute("dark");
      var downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" style="margin-top: 5px;"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M13 5v6h1.17L12 13.17 9.83 11H11V5h2m2-2H9v6H5l7 7 7-7h-4V3zm4 15H5v2h14v-2z"></path></svg>`;
      if(dark){
         downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z"/></svg>`
      }
      var programSTATUS = 0;
     function startload(){
       var format= document.getElementById("formatus").value;
       var f= format;
       if(f=="8k"||f=="4k"||f=="1080"||f=="720"||f=="480"||f=="360"){
        f="mp4";
       }
       getFORMVIDEO(format,f);
    }



    function updatepos(one,two){
      var reproz = 100/two;
      var ttproz = reproz*one;
        document.getElementById("download21").innerText = "Downloaded: "+Math.trunc(ttproz*10)/10+"%";
        if(Math.trunc(ttproz*10)/10 == 100){
            document.getElementById("download21").innerText="Download"
        }
    }

      function getFORMVIDEO(format,fff){
      var link = `https://loader.to/ajax/download.php?start=1&end=1&format=`+format+`&url=`+encodeURI(window.location.href);
          GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            responseType:"json",
            onload: function() {
                var ide = this.response.id;
                var gtitle = this.response.title

                checkStatus();
                function checkStatus(){
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: "https://loader.to/ajax/progress.php?id="+ide,
                        responseType:"json",
                        onload: function() {
                            document.getElementById("download21").innerText="Downloading video from server: " + ""+this.response.progress/10+"%";
                            if(this.response.text != "Downloaded."){
                                setTimeout(()=>{checkStatus();},800);
                            }else{
                                 download(this.response.download_url,gtitle,fff)
                            }
                        }
                    });
                }
            }
        });

      }
    function download(link,name,type){
        window.location.href = link;
        programSTATUS=0;
        document.getElementById("download21").innerText="Convert and Download ⬇️";
        /*
        GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            responseType:"blob",
            onload: function() {
                console.log(1);
                save([this.response], name+"."+type);
                },
            onprogress:function(r) {
                updatepos(r.loaded,r.totalSize)
            }
        });
        */
    }
    var save = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, name) { programSTATUS=0;
        var blob = new Blob(data, {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
        if(document.getElementById("ON125374").checked){
            showsettingsd();
            localStorage.setItem('ACLOSE154658', '1');
        }
    };
}());
var menu15 = `
<div style="
    width: 250px;
    height: 89px;
    background-color: white;
    margin-left: calc(100vw/2 - 250px/2);
    margin-top: calc(100vh/2 - 89px/2);
    outline: 2px solid #000;
    padding: 0px;
"><div style="height: 19px;">
<div style="
    width: 84px;
    float: left;
    margin-left: 4px;
    margin-top: 2px;
">YouTube™ Video Downloader by Lazymanzoid</div><div style="
    width: 50px;
    float: left;
    margin-left: 4px;
    margin-top: 2px;
    margin-left: 46px;
">auto close</div><input type="checkbox" id="ON125374" style="
    margin-left: -1px;
"><button id="slaves" style="
    border-radius: 0px;
    float: right;
    border-width: 2px;
    border: 0px;
    height: 19px;
    background-color: #e91e63;
">&nbsp;X&nbsp;</button></div><div style="
    height: 17px;
"><select id="formatus" style="
    width: 250px;
    border-width: 0px;
    background-color: #fff;
"><optgroup label="Audio">
<option value="mp3">MP3</option>
<option value="m4a">M4A</option>
<option value="webm">WEBM</option>
<option value="aac">AAC</option>
<option value="flac">FLAC</option>
<option value="opus">OPUS</option>
<option value="ogg">OGG</option>
<option value="wav">WAV</option>
</optgroup><optgroup label="Video">
<option value="360">MP4 (360 px)</option>
<option value="480">MP4 (480 px)</option>
<option value="720">MP4 (720p)</option>
<option value="1080" selected="selected">MP4 (1080p)</option>
<option value="1440">MP4 (1440p)</option>
<option value="4k">WEBM (4K)</option>
<option value="8k">WEBM (8K)</option></optgroup></select></div><button id="download21" style="
    border-radius: 0px;
    float: right;
    border-width: 2px;
    width: 100%;
    height: 53px;
    border: 0;
">Convert and Download ⬇️</button></div>
`;
function showsettingsd(){
    var lay = document.getElementsByClassName("15674821765123")[0];
    var pos = lay.style.display;
    lay.style.display = ( pos=="none" ? "block" : "none");
}
setListener();
 function setListener(){
  try{
  document.getElementById("slaves").onclick = function() {
    showsettingsd();
  };
  document.getElementsByClassName("14221212455")[0].onclick = function() {
    showsettingsd();
  };
  document.getElementById("download21").onclick = function() {
      if(!programSTATUS){
          startload();
          programSTATUS=1;
      }else{
          alert("The video is still loading..")
      }
  };
  document.getElementById("ON125374").onclick= function() {
       if(document.getElementById("ON125374").checked){
            localStorage.setItem('ACLOSE154658', '1');
        }else{
            localStorage.setItem('ACLOSE154658', '0');
        }
  };
  }catch{setTimeout(()=>{setListener();},500)}
 }
 let div = document.createElement("div");
 div.className = "14221212455";
 div.innerHTML = downloadIcon;
 try{setTimeout(()=>{document.getElementsByClassName("style-scope ytd-video-primary-info-renderer")[8].append(div);},1000);}
 catch{
     try{setTimeout(()=>{document.getElementsByClassName("style-scope ytd-video-primary-info-renderer")[8].append(div);},1000);}
     catch{
         setTimeout(()=>{document.getElementsByClassName("style-scope ytd-video-primary-info-renderer")[8].append(div);},1000);
     }
 }
  let div1 = document.createElement('div');
  div1.className = "15674821765123";
  div1.innerHTML = menu15;
  div1.style = `width: 100vw;background-color: #00000024;height: 100vh;position: fixed;right: 5px;display: none;z-index:99999999;`;
  document.body.prepend(div1);

  if(!!Number(localStorage.getItem("ACLOSE154658"))){
   document.getElementById("ON125374").click();
  }

}