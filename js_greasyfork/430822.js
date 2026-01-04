// ==UserScript==
// @name         狄卡小幫手-圖片下載
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description 增加下載圖片按鈕
// @author       You
// @match        https://www.dcard.tw/f*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/430822/%E7%8B%84%E5%8D%A1%E5%B0%8F%E5%B9%AB%E6%89%8B-%E5%9C%96%E7%89%87%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/430822/%E7%8B%84%E5%8D%A1%E5%B0%8F%E5%B9%AB%E6%89%8B-%E5%9C%96%E7%89%87%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

// //把文章懸浮重載  進入文章網頁
// var body = document.body;
// body.addEventListener('keydown', logKey,false);
// var nex
// setInterval(()=>{
// nex =document.querySelector("body > div.__portal > div > div.pup2eh-0.eFqXDi > div.sc-1r2mqv7-1.gzUfJW > div > div");

// try{
// let path=window.location.pathname
// if (nex!=null){
// location.reload();
// }}catch{
// }
// },1000)

//按下按鈕滑到網頁底部
function logKey(e) {
 switch(e.keyCode){
    case 40:
window.scrollTo(0,document.body.scrollHeight);
    break;

}}



//關閉JS顯示文章  重新整理進入文章
// function close(){
// let a=document.querySelector("body > div.__portal > div.sc-efkcua.XaZHR.overlay-enter-done > div.pup2eh-0.eFqXDi > div.sc-1r2mqv7-1.gzUfJW > div > svg");
// if (a!=null|a!=undefined){location.reload();};
// }

// setInterval(function(){close();}, 800);

//setInterval(function(){document.querySelector("body > div.__portal > div").remove();}, 1100);

//製作下載按鈕

let r=document.createElement("button");
let check=document.querySelector("body > div.__portal > div.sc-efkcua.XaZHR.overlay-enter-done > div.pup2eh-0.eFqXDi > div.sc-qz0f8b.idVSLh.simplebar-scrollable-y > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div > article > div.sc-1eorkjw-1.cayCnR > div > h1")
if (check===null) {
	document.querySelector("#__next > div.bvk29r-0.jhIZYh > div.bvk29r-2.glwZhP > div > div > div > div > article > div.sc-1eorkjw-1.cayCnR > div > h1").append(r);
}else {
document.querySelector("body > div.__portal > div.sc-efkcua.XaZHR.overlay-enter-done > div.pup2eh-0.eFqXDi > div.sc-qz0f8b.idVSLh.simplebar-scrollable-y > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div > article > div.sc-1eorkjw-1.cayCnR > div > h1").append(r);
}

r.innerHTML="<div class=\"sc-wtfuxu laWUUI\">下載</div>"

r.style.fontSize="16px";
r.style.backgroundColor="green";
r.style.textAlign="center";
r.style.color="yellow";
r.style.margin="4px 2px";
r.style.margin="5px 5px";
r.style.padding="7px 7px";
r.style.borderRadius="12px";
r.style.border="none";
r.style.cursor="pointer";
r.style.border="3px solid white";

r.addEventListener('click',function(){clickevent();});



//等待函數
function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

let d=document,img="https://i.imgur.com/";

//下載函數
async function download(U,X,I){
//U="網址"
let r=d.createElement("a");
r.setAttribute("download",U);
r.setAttribute("href",U);r.referrerPolicy='no-referrer';
r.click();
//擷取網址"/"斜線最後一段的文字  通知下載
console.log(U.split("/")[U.split("/").length-1]+"已下載");
};

//找到網址
let float="body > div.__portal > div.sc-efkcua.XaZHR.overlay-enter-done > div.pup2eh-0.eFqXDi > div.sc-qz0f8b.idVSLh.simplebar-scrollable-y > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div > article > div.sc-1eorkjw-5.VIAMx > div "
let ariticle="#__next > div.bvk29r-0.jhIZYh > div.bvk29r-2.glwZhP > div > div > div > div > article > div.sc-1eorkjw-5.VIAMx > div"
let m;
if (check===null) {m=document.querySelector(ariticle).querySelectorAll("img");}
else {
m=document.querySelector(float).querySelectorAll("img"); //逐條以陣列方式把內容分項
}


console.log("共計"+m.length+"項需要下載");


async function clickevent(){
//以迴圈確認符合條件的標籤(<herf>或<src>等等)    再找尋每一項是否：合圖片的條件(.jpg .png等等)
for (let i=0;i<m.length;i++){
	if(m[i].src.search(/imgur/)>-1){
		let u=m[i].src;
		if (u.search(/jpg|png|gif|jpeg/)<0){
			u=img+u.split("/")[u.split("/").length-1]+".jpg";
		};
		//測試句console.log(u);
		download(u,m,i);await delay(1);
		if (i%10===0&i!=0){
			console.log("下載超過"+i+"項，等待"+i/10*5+"秒"); //每10項後  等待5,10,15.....秒
			await delay(i/10*5);};
	};
		};

console.log("共計"+m.length+"項下載已完成");
}


// //下載方法
// function downloadIamge(selector, name) {
//     var a = document.createElement('a');
//     var event = new MouseEvent('click');

//     a.download = name || '下載圖片名稱';
//     a.href = url;

//     a.dispatchEvent(event);
// }
//downloadIamge('canvas', '圖片名稱');

