// ==UserScript==
// @name         xvideo downloader
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  try to take over the world!
// @author       You
// @match        https://www.xvideos.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420023/xvideo%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/420023/xvideo%20downloader.meta.js
// ==/UserScript==

window.addEventListener('load', function(){
var cum
	var s_html = `
  <div class="ct_div">

  <style>
      /*最外層的框*/
      .ct_div {
          background-color: #FFF;
          padding: 5px;
          padding-left: 11px;
      }

      /*「截圖」按鈕*/
      .but_ct {
          margin-top: 10px;
          padding: 3px 7px;
          border: 2px solid #00B4D8;
          color: #00B4D8;
          display: inline-block;
          text-align: center;
          line-height: 27px;
          font-size: 1.4em;
          margin-right: 10px;
      }

      .but_ct:hover {
          background-color: #00B4D8;
          border: 1px solid #00B4D8;
          color: #FFF;
          display: inline-block;


  </style>
  <div class="but_ct" >下載影片!</div>


</div>
      `

     function gongneng(p,M) {
        var x,r,g,k,s,vid,Z;
        x = document.getElementsByTagName("div");
        r = x[14].textContent;
        r.match(/.mp4/).input;
        g = r.match(/.mp4/).input;
        k = g.split("{");
        try{
            s = k[42].match(/mp4/).input;
        }
        catch(e) {
            s = k[41].match(/mp4/).input;
        }
        vid = s.split(/VideoUrlHigh/)[1].split(/html5/)[0];
        Z = vid.replace("');", "");
        M = Z.replace("('", "");
       cum=M

     }


        function addbtn(p,M){
        let pretag = document.getElementsByTagName("div");
        p = pretag[14];
        let btn = document.createElement("div");
        btn.innerHTML = s_html;
        btn.onclick = ()=>{
            window.open(cum);
        }

        p.insertBefore(btn, p.childNodes[0]);

    }

gongneng();

    addbtn();


});
