// ==UserScript==
// @name        crazy download
// @namespace    http://tampermonkey.net/
// @version      1.987
// @description  try to take over the world!
// @author       You
// @match        https://airav.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430410/crazy%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/430410/crazy%20download.meta.js
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
  <span style="font-size:14px; color:rgb(100, 100, 100)">(快速鍵 「F8」)</span>


</div>
      `
var f,g;

     function gongneng(p,M) {
var v,a,b,c,d,e;
         a=document.querySelector("#testHcsticky > div > div.vedioarea > script").innerText;
         b=a.split("https://cdn-f")[2];
         c=b.split(".mp4")[0];
         d=c.replace("reems","https://cdn-freems");
         e=d+".mp4"
         cum=e;
         };

    function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


     //g=document.querySelector("#ContentPlaceHolder1_Label1").innerText.replace("下載影片! (快速鍵 「F8」)\n","");


    function addbtn(p,M){
        let pretag =document.querySelector("#ContentPlaceHolder1_Label1");
          p = pretag;
        let btn = document.createElement("div");
        btn.innerHTML = s_html;
        btn.onclick = ()=>{
            window.open(cum);
            //下面這行要在--disable-web-security --user-data-dir=C:\MyChromeDevUserData  的狀態使用
            // 首先在C盘目录下创建 MyChromeDevUserData  文件夹
            // 新建一个chrome快捷方式，右键--属性--快捷方式--选项卡里选择--目标--，exe 后面添加  --disable-web-security --user-data-dir=C:\MyChromeDevUserData
            //点击应用，然后确定就可以快乐的使用了
            //downloadURI(cum, g);
            //就是這麼機掰XD～
        }

        p.insertBefore(btn, p.childNodes[0]);

    }

    document.body.addEventListener("keydown", function (e) {
        if (e.keyCode == 119) { //F8
           window.open(cum);
        }
    });
    gongneng();

    addbtn();

//window.alert(cum);

});
