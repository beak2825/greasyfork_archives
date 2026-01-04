// ==UserScript==
// @name         Ptt ImgurGet & Dwn
// @namespace    http://tampermonkey.net/
// @version      1.978778
// @description  I hate any err. And I love all useful funtions.
// @author       You
// @match       https://www.pttweb.cc/*
// @match       https://www.ptt.cc/bbs/*
// @icon         https://www.google.com/s2/favicons?domain=pttweb.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430733/Ptt%20ImgurGet%20%20Dwn.user.js
// @updateURL https://update.greasyfork.org/scripts/430733/Ptt%20ImgurGet%20%20Dwn.meta.js
// ==/UserScript==

window.addEventListener('load', function(){
    /*功能：
1.修正PTT連imgur圖片無法顯示問題
2.「快捷鍵F8」一鍵打包文章內.jpg的imgur圖片(註)
3.瀏覽原版Ptt網址，按下空白鍵「開啟web版(非官方)的連結」

註:因為chrome有禁止跨站污染，必須用以下方式開啟chrome才能使用此功能。
在桌面上設定一個chrome的捷徑。
右鍵在路徑之後貼上「--disable-web-security --user-data-dir=C:\MyChromeDevUserData」
---------------------------------------------------------------------------------------
範例：
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir=C:\MyChromeDevUserData
---------------------------------------------------------------------------------------
以後當你要使用下載功能，請點擊這個chrome使用。
*/
//===========================================
//設定變數，與需要簡化的字串
let o,x,d=document,im="https://i.imgur.com/",ptt="--※ 發信站: 批踢踢實業坊(ptt.cc)";
let l=location.href;
//===========================================
//判斷使用者在webptt或原版Ptt，此原版
if (l.search("www.ptt.cc")>-1){
console.log("你逛正版");
o="#main-content";
x=d.querySelector(o).innerText.replaceAll("\n","").split(ptt)[0].split(im);
//===========================================
//修正PTT圖片無法顯示
let z=x.length-1;

for (let i=1;i<z+1;i++){
let url;
url=im+x[i];

//根據網址創造圖片元素
let r=d.createElement("a");
r.setAttribute("href",url);
let s=d.createElement("img");
s.setAttribute("src",url);
s.referrerPolicy='no-referrer';//這句是解決問題的關鍵

//完成後把它丟在文章前面
r.append(s);
//有些文章要從五這個子項丟，有的六，目前先用try給他踹一踹
  try{
d.querySelector(o+"> a:nth-child(5)").appendChild(r);
  }
 catch(err){d.querySelector(o+"> a:nth-child(6)").appendChild(r);
        ;}

d.querySelector(o).querySelector("iframe").remove();
};}
//===========================================
//判斷使用者在webptt或原版Ptt，此webptt版(圖床正常)
if (l.search("www.pttweb.cc")>-1){
console.log("你逛webPTT版本");
o="#app > div > main";
x=d.querySelector(o).innerText.replaceAll("\n","").split(ptt)[0].split(im);
};

let g=x.length-1;

//下載函數  1.抓網址  2.建立a 3.利用屬性download 4.把元素附加在頁面上後click()啟動下載
function download() {
for (let i=1;i<g+1;i++){
let url;
url=im+x[i];
let r=d.createElement("a");
r.setAttribute("download",url);
r.setAttribute("href",url);r.referrerPolicy='no-referrer';
r.click();
};
};
//===========================================
//鍵盤監聽事件
d.body.addEventListener("keydown", function (e) {
//若按下空白鍵打開web的網頁
//轉換web版的網址
let newl=l.replace("https://www.ptt.cc","https://www.pttweb.cc");
let newl2=newl.replace(".html","");
if (e.keyCode == 32) {
try{
window.open(newl2);}
catch(err){};
};

//若按下F8:一鍵打包文章內圖片
if (e.keyCode == 119) {
download();
};
    });

//===========================================
//作者:PTT峽者（幹霖良寫錯一堆小東西，糙，debug超久囧rz~盡力惹XD）
//2021.08.13寫了應該五小時以上...ㄎㄎ真的好廢


     });