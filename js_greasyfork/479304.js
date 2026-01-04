// ==UserScript==
// @name         css animation demo(archive)
// @description  rewind animation image
// @namespace    gamer_css_firework_6e1b1
// @author       Covenant
// @version      1.0
// @license      MIT
// @homepage
// @match        https://*.gamer.com.tw/*
// @exclude      https://www.gamer.com.tw/
// @exclude      https://www.gamer.com.tw/index2.php*
// @exclude      https://haha.gamer.com.tw/*
// @icon         data:image/svg+xml,<svg width='36' height='36' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='uil-default'><path fill='none' class='bk' d='M0 0h100v100H0z'/><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='translate(0 -30)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(30 105.98 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(60 75.98 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(90 65 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(120 58.66 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(150 54.02 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(180 50 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-150 45.98 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-120 41.34 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-90 35 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-60 24.02 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-30 -5.98 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s' repeatCount='indefinite'/></rect></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/479304/css%20animation%20demo%28archive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479304/css%20animation%20demo%28archive%29.meta.js
// ==/UserScript==
var baha_bg=GM_getValue('baha_bg', "2021");
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
var style_user_css;
if(document.body!=null){
    style_user_css=create_style("","gm_user_gamer_css_firework",["user_gm_css","css_gamer_css_firework"]);
    style_user_css.textContent+=`
.time2023:after{
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time.png');
    display: inline-block;
    position: fixed;
    top: 10%;
    left: 5%;
    z-index: 256;
    -webkit-animation: witch_2023 4s infinite;
    animation-timing-function: ease-out;
}
@-webkit-keyframes witch_2023 {
  0%{
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time.png');opacity: 0.8;
  }10% {
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time.png');opacity: 0.8;
  }50% {
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time_2.png');opacity: 0.8;
  }75%{
      content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time_3.png');opacity: 0.9;
  }100%{
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time_3.png');opacity: 0.9;
  }
}
.time2022:after{
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time.png');
    display: inline-block;
    position: fixed;
    top: 10%;
    left: 85%;
    z-index: 256;
    -webkit-animation: witch_2022 4s infinite;
    animation-timing-function: ease-out;
}
@-webkit-keyframes witch_2022 {
  0%{
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time.png');opacity: 0.8;
  }10% {
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time.png');opacity: 0.8;
  }50% {
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time_2.png');opacity: 0.8;
  }75%{
      content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time_3.png');opacity: 0.9;
  }100%{
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time_3.png');opacity: 0.9;
  }
}
.firework2023::after{
    content: "";
    display: block;
    position: fixed;
    left: 85%;
    bottom: 10%;
    width: 220px;
    height: 300px;
    background-image: url('https://i2.bahamut.com.tw/index/2023-firework.png');
    animation: play_firework2023 4s steps(10) infinite;
    z-index: 255;
    opacity: .8;
}
@keyframes play_firework2023 {
  0%   { background-position:    0px; }
  50%  { background-position: -2200px; }
  100% { background-position: -2200px; }
}
.firework2021::after{
  content: "";
  display: block;
  position: fixed;
  left: 0%;
  bottom: 0%;
  width: 110px;
  height: 150px;
  background-image: url('https://i2.bahamut.com.tw/index/2021-firework.png');
  animation: play_firework2019 3s steps(10) infinite;
  z-index: 255;
}
.firework2020::after{
  content: '';
  position: fixed;
  left: 0;
  bottom: 15%;
  width: 110px;
  height: 151px;
  background-image: url('https://i2.bahamut.com.tw/index/festival2020-fw1.png');
  animation: play_firework2019 3s steps(10) infinite;
  z-index: 255;
}
.BA_year_fw_2019{
  position: fixed;
  left: 10%;
  bottom: 0%;
  width: 110px;
  height: 151px;
  background-image: url("data:image/png;base64,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");
  animation: play_firework2019 2.5s steps(10) infinite;
  z-index: 255;
}
@keyframes play_firework2019{
  0%   { background-position:    0px; }
  50%  { background-position: -1100px; }
  100% { background-position: -1100px; }
}
.festival_2018_fw1::after{
  content: "";
  position: fixed;
  left: 1%;
  bottom: 66%;
  height: 150px;
  width: 107px;
  background: url('https://i2.bahamut.com.tw/index/festival-2018-fw1.png');
  animation: play3 3s steps(10) infinite;
  overflow: hidden;
  z-index: 255;
}
.festival_2018_fw2::after{
  content: "";
  position: fixed;
  left: 1%;
  bottom: 50%;
  height: 150px;
  width: 107px;
  background: url('https://i2.bahamut.com.tw/index/festival-2018-fw2.png');
  animation: play2 3s steps(10) infinite;
  overflow: hidden;
  z-index: 255;
}
.festival_2018_fw3::before{
  content: "";
  position: fixed;
  left: 1%;
  bottom: 33%;
  height: 150px;
  width: 107px;
  background: url('https://i2.bahamut.com.tw/index/festival-2018-fw3.png');
  animation: play 3s steps(10) infinite;
  overflow: hidden;
}
@keyframes play {
   0%   { background-position:    0px; }
   50%  { background-position: -1100px; }
   100% { background-position: -1100px; }
}@keyframes play2 {
   0%   { background-position:    0px; }
   20%  { background-position:    0px; }
   70%  { background-position: -1100px; }
   100% { background-position: -1100px; }
}@keyframes play3 {
   0%   { background-position:    0px; }
   40%  { background-position:    0px; }
   90%  { background-position: -1100px; }
   100% { background-position: -1100px; }
}
.building_2022{
    content: "";
    background: url(https://i2.bahamut.com.tw/index/2022-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2022-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed,fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
    animation: building_2022 3s infinite;
}
@keyframes building_2022 {
  0% {
    background: url(https://i2.bahamut.com.tw/index/2022-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2022-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
  50% {
    background: url(https://i2.bahamut.com.tw/index/2022-NewYear-background-building-on.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2022-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
  100% {
    background: url(https://i2.bahamut.com.tw/index/2022-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2022-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
}
.building_2021{
    content: "";
    background: url('https://i2.bahamut.com.tw/index/2021-NewYear-background-building-off.png') center no-repeat, url('https://i2.bahamut.com.tw/index/2021-NewYear-background.jpg') center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed,fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
    animation: building_2021 3s infinite;
}
@keyframes building_2021{
  0% {
    background: url('https://i2.bahamut.com.tw/index/2021-NewYear-background-building-off.png') center no-repeat, url('https://i2.bahamut.com.tw/index/2021-NewYear-background.jpg') center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }50% {
    background: url('https://i2.bahamut.com.tw/index/2021-NewYear-background-building-on.png') center no-repeat, url('https://i2.bahamut.com.tw/index/2021-NewYear-background.jpg') center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }100% {
    background: url('https://i2.bahamut.com.tw/index/2021-NewYear-background-building-off.png') center no-repeat, url('https://i2.bahamut.com.tw/index/2021-NewYear-background.jpg') center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
}
`;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}
    else{if(refNode==undefined){node.insertBefore(element,node.firstChild);}else{node.insertBefore(element,refNode);}}
    return element;
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
//console.log("break");
(function(){
    'use strict';
    if(document.body==null)return;
    let url=fn_url(document.location);
    if(url[0].host.search(new RegExp("home.gamer.com.tw", "i"))==0){
        GM_registerMenuCommand("bg 2021"+(baha_bg=="2021"?"✔️":""), () => {
            GM_setValue('baha_bg',"2021");
            window.location.reload();
        });
        GM_registerMenuCommand("bg 2022"+(baha_bg=="2022"?"✔️":""), () => {
            GM_setValue('baha_bg',"2022");
            window.location.reload();
        });
    }
    let BH_background=document.querySelectorAll('#BH-background,.creation-container');
    switch (url[0].host+url[0].pathname){
        case "home.gamer.com.tw/artwork_edit.php":
        case "home.gamer.com.tw/artwork.php":
        case "forum.gamer.com.tw/A.php":
        case "forum.gamer.com.tw/Bo.php":
        case "avatar1.gamer.com.tw/":
        case "avatar1.gamer.com.tw/shop.php":
        case "avatar1.gamer.com.tw/wardrobe.php":
        case "avatar1.gamer.com.tw/storeList.php":
        case "guild.gamer.com.tw/about.php":
        case "guild.gamer.com.tw/wikimenu.php":
        case "guild.gamer.com.tw/wiki.php":
            create_node("div",["time2023"],true,document.body);
            create_node("div",["time2022"],true,document.body);
            create_node("div",["firework2023"],true,document.body);
            create_node("div",["firework2021"],true,document.body);
            create_node("div",["firework2020"],true,document.body);
            create_node("div",["BA_year_fw_2019"],true,document.body);
            create_node("div",["festival_2018_fw1"],true,document.body);
            create_node("div",["festival_2018_fw2"],true,document.body);
            create_node("div",["festival_2018_fw3"],true,document.body);
            if(BH_background.length>0){BH_background[0].classList.add("building_"+baha_bg);}
    }
})();