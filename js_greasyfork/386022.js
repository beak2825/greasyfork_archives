// ==UserScript==
// @name WhatsApp Web Dark
// @namespace WhatsAppDarkMode
// @description  Dark Mode for WhatsApp Web
// @author       EternalParadox (Ikisora.com)
// @match https://web.whatsapp.com/
// @version      1.3.0
// @grant none
// @require https://code.jquery.com/jquery-1.7.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/386022/WhatsApp%20Web%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/386022/WhatsApp%20Web%20Dark.meta.js
// ==/UserScript==
console.log("WhatsApp Dark Mode Enabled!");
(function(){
  "use strict";
  var styleRoot = document.createElement("style");
  styleRoot.type = "text/css";
  styleRoot.id = "root";
  styleRoot.textContent = `
  :root { 
    --mainBg: #333; /* Includes message-in */
    --msgOut: #009c5e; 
    --darkGreen: #00564e; 
    --littleDarkGreen: #00655b; 
    --lightDarkGreen: #007b6f;
    --lighterDarkGreen: #008a7c;
    --accentGreen: #00796d;
    --accentLightGreen: #128c7e;
    --aColor: #19cad7;
    --white: #fff;
  }
  `;
  var style = document.createElement("style");
  style.type = "text/css";
  style.textContent = `
  body {
      background: #232323 !important;
  }
  html[dir] .iFKgT {
    background-color: var(--mainBg);
  }
  ._1cDWi {
    color: var(--littleDarkGreen);
  }
  [data-asset-chat-background] {
    /*background-image: url(http://www.tinybirdgames.com/wp-content/uploads/2017/04/tinybirdgames_telegram_background_03.jpg) !important;*/
  }
  html[dir=ltr] .message-out .tail-container.highlight, html[dir=ltr] .message-out .tail-container {
    background-image: url(https://ikisora.com/tail1.png) !important;
  }
  html[dir=ltr] .message-in .tail-container.highlight, html[dir=ltr] .message-in .tail-container {
    background-image: url(https://ikisora.com/tail.png) !important;
  }
  html[dir=ltr] .message-out.tail-override-left .tail-container {
    background-image: url(https://ikisora.com/tail.png) !important;
  }
  .fzCXy {
    opacity: 0.2;
  }
  [data-asset-intro-image] {
    background-image: url(https://ikisora.com/into_whatsapp_web_black.png) !important;
  }
  ._3mkas, ._3UQPd {
    color: var(--lighterDarkGreen);
  }
  html[dir] ._3ZVgT {
    background-color: #7d7d7d;
  }
  @media screen and (min-width: 1441px) {
    html[dir] ._1FPJ-:after {
        background-color: var(--littleDarkGreen);
    }
  }
  a {
    color: var(--aColor);
  }
  html[dir] ._2i7Ej {
    background-color: var(--mainBg);
  }
  html[dir] ._13mgZ {
    background-color: var(--littleDarkGreen);
    border: 1px solid var(--littleDarkGreen);
  }
  ._3FeAD .wjdTm {
    color: var(--white);
  }
  .hnQHL span[data-icon="send"] path, .hnQHL span[data-icon="ptt"] path  {
    fill: var(--accentGreen);
    fill-opacity: 1;
  }
  .web .-XQxp path {
    fill: var(--accentGreen);
  }
  html[dir] .kiodY {
    background-color: var(--darkGreen);
  }
  html[dir] .ZP8RM {
    background-color: var(--mainBg);
  }
  html[dir] ._1Kstu {
    background-color: var(--mainBg);
  }
  .kiodY .kyJvR {
    color: var(--white);
  }
  ._3u328.copyable-text.selectable-text {
    color: var(--white);
  }
  html[dir] ._1ebw2 {
    background-color: var(--mainBg);
  }
  html[dir] ._1RYPC {
      background-color: var(--mainBg);
  }
  html[dir] .NuujD {
    background-color: #5a5a5a;
  }
  html[dir] ._3Jvyf {
      background-color: var(--darkGreen);
  }
  html[dir] ._3fs0K {
    background-color: var(--darkGreen);
  }
  ._19vo_ {
    color: var(--white);
  }
  .i1XSV._3Q3ui {
    color: rgba(255, 255, 255, 0.6);
  }
  header svg > path {
    fill: var(--white);
    opacity: 0.8;
  }
  html[dir] .message-out {
    background-color: var(--msgOut) !important;
    color: var(--white);
  }
  html[dir] .message-in {
      background-color: var(--mainBg) !important;
      color: var(--white);
  }
  html[dir=ltr] .bg-color-1, html[dir=rtl] .bg-color-1 {
    background-color: var(--mainBg)!important;
  }
  html[dir=ltr] .message-in .color-1, html[dir=rtl] .message-in .color-1,  html[dir=ltr] .message-in .color-2, html[dir=rtl] .message-in .color-2 {
    color: var(--msgOut)!important;
  }
  html[dir=ltr] .message-in .bg-color-1, html[dir=rtl] .message-in .bg-color-1,  html[dir=ltr] .message-in .bg-color-2, html[dir=rtl] .message-in .bg-color-2 {
    background-color: var(--msgOut)!important;
  }
  html[dir=ltr] .color-1, html[dir=rtl] .color-1 {
    color: var(--mainBg)!important;
  }
  ._2HTIU._2I-yY .bg-color-1 {
    background-color: var(--msgOut)!important;
  }
  ._2HTIU._2I-yY .color-1 {
    color: var(--msgOut)!important;
  }
  html[dir] .OWYLS {
    background-color: var(--mainBg);
  }
  .OWYLS path {
    fill: var(--msgOut);
    opacity: 1;
  }
  html[dir=ltr] ._30sf0 {
    border-left: none;
  }
  html[dir=ltr] .bg-color-2, html[dir=rtl] .bg-color-2 {
    background-color: var(--mainBg)!important;
  }
  html[dir=ltr] .color-2, html[dir=rtl] .color-2 {
    color: var(--mainBg)!important;
  }
  html[dir=ltr] .message-out ._1QjgA.color-2, html[dir=rtl] ._1QjgA.color-2 {
    color: var(--mainBg)!important;
  }
  html[dir=ltr] .message-out ._1dvF4.bg-color-2, html[dir=rtl] ._1dvF4.bg-color-2 {
    background-color: var(--mainBg)!important;
  }
  ._2HHbr {
    color: rgb(208, 208, 208);
  }
  span[data-icon="msg-dblcheck-ack"] path {
    fill: #22daff;
  }
  span[data-icon="msg-dblcheck"] path, span[data-icon="msg-check"] path {
    fill: var(--white);
  }
  ._3MYI2 {
    color: rgba(255, 255, 255, 0.45);
  }
  html[dir] ._3Xx0y {
    background-color: hsla(0, 0%, 0%, 0.25);
  }
  html[dir] ._1lo-H {
    background-color: var(--msgOut);
    color: var(--white);
  }
  html[dir] ._2UaNq._3mMX1 {
    background-color: var(--darkGreen);
  }
  html[dir] ._2UaNq {
    background-color: var(--mainBg);
  }
  html[dir] ._2UaNq ._3H4MS {
    color: var(--white);
  }
  ._2UaNq .xD91K {
    color: #d6d6d6;
  }
  ._2UaNq._3mMX1 .xD91K {
    color: #d6d6d6;
  }
  ._0LqQ {
    color: rgba(255, 255, 255, 0.6);
  }
  span[data-icon="down"] path {
    fill: white;
    fill-opacity: 0.6;
  }
  html[dir] ._2UaNq._16_lP, html[dir] ._2UaNq:hover {
    background-color: var(--lightDarkGreen);
  }
  html[dir] ._2UaNq._3mMX1:after, html[dir] ._2UaNq._16_lP:after, html[dir] ._2UaNq:hover:after {
    border-top: none;
  }
  html[dir] ._2WP9Q {
    border-top: none;
  }
  span[data-icon="status-dblcheck"] path, span[data-icon="status-check"] path, span[data-icon="status-video"] path, span[data-icon="status-ptt-gray"] path, span[data-icon="status-image"] path {
    fill: var(--white);
  }
  ._2UaNq._2ko65 .xD91K {
    color: var(--white);
  }
  html[dir] ._2HS9r {
    background-color: var(--mainBg);
  }
  html[dir] ._2zCfw {
    background-color: var(--littleDarkGreen);
    color: var(--white);
  }
  html[dir] .r7sRK {
    background-color: var(--mainBg);
  }
  .r7sRK {
    font-weight: 500;
  }
  .r7sRK:after {
    background-color: hsla(0,0%,100%,.14);
    border-bottom: 1px solid rgba(0,0,0,.08);
    bottom: -1px;
    left: 0;
    content: "";
    height: 1px;
    position: absolute;
    width: 100%;
  }
  html[dir] .eiCXe {
    background-color: var(--littleDarkGreen);
  }
  span[data-icon="search"] path{
    fill: var(--white);
    fill-opacity: 1;
  }
  html[dir] .ZP8RM._19OGD {
    background-color: var(--mainBg);
  }
  html[dir] ._3KRbU {
    background-color: var(--mainBg);
  }
  ._3KRbU span[data-icon="down"] path {
    fill: var(--msgOut);
    fill-opacity: 1;
  }
  span[data-icon="ptt-out-gray"] path {
    fill: #b1b1b1;
  }
  span[data-icon="ptt-out-gray"] path:first-of-type, span[data-icon="ptt-out-blue"] path:first-of-type {
    fill: black;
    opacity: 0.6;
  }
  .message-in span[data-icon="audio-download"] path {
    fill: #09d261;
  }
  html[dir] ._3RQfg ._3a29n {
    background-color: var(--mainBg);
  }
  ._3-cgK {
    color: rgba(255, 255, 255, 0.8);
  }
  ._3waZq path, ._3waZq svg {
    fill: var(--white);
    fill-opacity: .5;
  }
  html[dir] ._3_nIn {
    background-color: #444343;
  }
  html[dir] ._3qblR._1SsXF {
    background-color: #444343;
  }
  ._3RQIp {
    color: rgb(223, 229, 231);
  }
  ._2cR8w {
    color: rgb(223, 229, 231);
  }
  ._17hud {
    color: rgb(223, 229, 231);
  }
  span[data-icon="audio-download"] path {
    fill-opacity: 1;
  }
  html[dir=ltr] ._15CAo._2Nkc4 {
    background: linear-gradient(90deg,hsla(0,0%,100%,0) 0,var(--mainBg) 50%);
  }
  ._2Nkc4._15CAo span[data-icon="down-context"] path {
    fill-opacity: 1;
    fill: var(--msgOut);
  }
  html[dir=ltr] ._15CAo._3EQsG{
    background: linear-gradient(90deg,hsla(0,0%,100%,0) 0,var(--msgOut) 50%);
  }
  ._15CAo._3EQsG span[data-icon="down-context"] path {
    fill-opacity: 1;
    fill: var(--mainBg);
  }
  ._1Ygsj path {
    fill: var(--white);
    fill-opacity: 1;
  }
  .message-out ._2bRZx span[data-icon="audio-play"] path {
    fill: var(--mainBg);
    fill-opacity: 1;
  }
  .message-in ._2bRZx span[data-icon="audio-play"] path {
    fill-opacity: 1;
    fill: var(--msgOut);
  }
  html[dir] ._2IpQY._3HDzI ._7sUPO {
    background-color: var(--mainBg);
  }

  html[dir] ._2IpQY._3HDzI .QLIwq::-webkit-slider-thumb {
    background-color: var(--mainBg);
  }

  html[dir] ._2IpQY._3HDzI .QLIwq::-moz-range-thumb {
    background-color: var(--mainBg);
  }

  html[dir] ._2SaRg._3HDzI ._7sUPO {
    background-color: var(--msgOut);
  }

  html[dir] ._2SaRg._3HDzI .QLIwq::-webkit-slider-thumb {
    background-color: var(--msgOut);
  }

  html[dir] ._2SaRg._3HDzI .QLIwq::-moz-range-thumb {
    background-color: var(--msgOut);
  }
  ._1QjgA.color-1._2q8oz {
    color: #35cd96!important;
  }
  footer .bg-color-2._1dvF4 {
    background-color: var(--msgOut)!important;
  }
  footer ._1QjgA.color-2 {
    color: var(--msgOut)!important;
  }
  ._1FWQp {
    color: rgba(255, 255, 255, 0.45);
  }
  html[dir] ._1AUdd._1SsXF, html[dir] ._2nZ2E.HNuTV {
    background-color: #444343;
  }
  ._2IHkF, ._23MBZ, ._3JxFB{
    color: #dfe5e7;
  }
  html[dir] .a81-s {
    background-color: transparent !important;
  }
  html[dir] .message-in ._2Hp95 ._3Mf7Z, html[dir] .message-in ._2Hp95 ._3qAvH {
    background-color: var(--mainBg);
  }
  html[dir] .message-out ._2Hp95 ._3Mf7Z, html[dir] .message-out ._2Hp95 ._3qAvH {
    background-color: var(--msgOut);
  }
  html[dir] ._2LSbZ {
    background-color: var(--mainBg);
  }
  html[dir] ._1KDYa {
    background-color: #232323;
  }
  ._1drsQ {
    color: var(--white);
  }
  ._6xQdq {
    color: var(--white);
  }
  html[dir] ._26JG5 {
    background-color: var(--darkGreen);
  }
  html[dir] ._26JG5:hover {
    background-color: var(--littleDarkGreen);
  }
  ._23Un5 {
    color: #ff6464;
  }
  ._26JG5 ._1tyVr span[data-icon="thumbs-down"] path, ._26JG5 ._1tyVr span[data-icon="delete-danger"] path, ._26JG5 ._1tyVr span[data-icon="settings-blocked"] path {
    fill: #ff6464;
  }
  html[dir] .DYUo1 ._3a29n {
    background-color: var(--msgOut);
  }
  html[dir] .Lhd3q.HNuTV {
    background-color: #444343;
  }
  html[dir] ._1WMT2._1lakC, html[dir] ._1WMT2._2nA3s {
    background-color: var(--littleDarkGreen);
  }
  .jLybP:before {
    color: var(--white);
  }
  span._3iZHE, span._3KF1B, ._3dcGh ._2V2qB {
    color: var(--white);
  }
  html[dir] ._3jHKU {
    background-color: var(--darkGreen);
  }
  ._1WMT2:before, ._1WMT2._1lakC:after, ._1WMT2._2nA3s:after, ._1WMT2._2V_Wj:after {
    content: none;
  }
  html[dir] ._3_-Si+._3_-Si ._2x2XP {
    border-top: none;
  }
  html[dir] ._1iNsf, html[dir] ._2KgjI, html[dir] ._3Fq9Y {
    background-color: hsla(0, 0%, 20%, .96);
  }
  html[dir] .s4BtI, html[dir] .cGLoy {
    background-color: var(--mainBg);
  }
  .s4BtI ._8icek span[data-icon="x-viewer"] path {
    fill: var(--white);
  }
  html[dir] .cGLoy ._1GdY6 path {
    fill: var(--littleDarkGreen);
  }
  .PjbL2 {
    color: var(--msgOut);
  }
  ._3I1_2 {
    color: rgba(255, 255, 255, 0.6);
  }
  ._26ydt {
    color: var(--white);
  }
  html[dir] ._27U_m {
    background-color: var(--littleDarkGreen);
  }
  html[dir] ._3yth3 {
    background-color: var(--littleDarkGreen);
  }
  .aymnx ._2Vo52 {
    color: var(--white);
  }
  html[dir] ._3RiLE {
    background-color: #403f3f;
  }
  html[dir] ._3PQ7V {
    background-color: var(--darkGreen);
  }
  ._23_1v {
    color: #00887b;
  }
  html[dir] ._23_1v:hover {
    background-color: #00887b;
  }
  ._23_1v:hover {
    color: var(--white);
  }
  html[dir] ._26pkE {
    background-color: var(--mainBg);
  }
  ._26pkE {
    color: rgba(255, 255, 255, 0.6);
  }
  html[dir] ._3PQ7V:hover {
    background-color: #00887b;
  }
  html[dir=ltr] .I72vi {
    padding: 0;
  }
  .rK2ei ._1ODlg {
    color: rgba(255, 255, 255, 0.6);
  }
  html[dir] ._26JG5+._26JG5 ._27Ie2 {
    border-top: 0;
  }
  html[dir] ._26JG5:hover+._26JG5:before {
    border-top: 0;
  }
  html[dir] ._3D31H {
    background-color: #006f65;
  }
  html[dir] .yrOIH {
    background-color: var(--darkGreen);
  }
  html[dir] ._70TS5 {
    background-color: var(--mainBg);
  }
  html[dir] ._2DxRd {
    border-top: 1px solid var(--mainBg);
  }
  html[dir] ._11p3Q {
    background-color: var(--mainBg);
  }
  html[dir] ._1w-mX {
    padding-left: 34px;
    padding-right: 34px;
    background-color: var(--mainBg);
  }
  html[dir] ._39cGk {
    background-color: var(--darkGreen);
    border-radius: 25px;
    border-bottom: 0;
    padding: 7px 0 6px 10px;
  }
  input._44uDJ.copyable-text.selectable-text {
    color: var(--white);
    padding: 2px 10px;
    width: 90% !important;
  }
  html[dir] ._2UaNq._27Ppf {
    background-color: #1c8b82;
  }
  html[dir] ._2UaNq._27Ppf:hover {
    background-color: #00b9a7;
  }
  ._1wt6r , .Am8s6 {
    color: rgba(255,255,255,.5);
  }
  ._7w-84 ._3hnO5 span[data-icon="emoji-input"] path, ._3ogpF ._3vWnP span[data-icon="emoji-input"] path {
    fill: var(--white);
  }
  html[dir] ._1g8sv {
    background-color: #299389;
  }
  ._3hnO5 ._30prC span[data-icon="pencil"] path {
    fill: var(--white);
  }
  html[dir] .NeQRT {
    background-color: var(--mainBg);
  }
  ._3qb2N {
    color: var(--white);
  }
  html[dir] ._2AJf5, html[dir] ._19xqi {
    background-color: var(--mainBg);
  }
  html[dir] ._2rGVQ {
    background: #5a5a5a;
  }
  ._3he1q {
    color: var(--accentLightGreen);
  }
  html[dir] .a7otO {
    background-color: var(--littleDarkGreen);
  }
  .a7otO {
    color: var(--white);
  }
  html[dir] ._2hHc6 {
    background-color: var(--mainBg);
  }
  .Sl-9e {
    color: var(--white);
    opacity: 0.8;
  }
  html[dir] ._3BqnP._3VXiW {
    background-color: var(--darkGreen);
  }
  html[dir] ._2avTY {
    background-color: var(--darkGreen);
  }
  html[dir] .RxbUw, html[dir] ._20KNO, html[dir] .QChXd, html[dir] ._2Qm0c {
    background-color: var(--mainBg); 
  }
  html[dir] ._2hMsh {
    background-color:  var(--littleDarkGreen);
  }
  html[dir] ._2gisX, html[dir=ltr] ._2GXNm {
    color: var(--white);
  }`;
  let documentHead = document.querySelector("head");
  if(documentHead){
      documentHead.appendChild(styleRoot);
      documentHead.appendChild(style);
  }
  else{
      return;//xml documents or something. At least it's not a place where the script can run
  }
  
})();

window.onload = function() {
  var z = document.createElement('div');
  z.className = '_3j8Pd';
  z.innerHTML =  `
  <div role="button" title="Cambiar colores" id="changeColors">
    <span data-icon="chat" class="">
      <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path opacity=".55" fill="#263238" d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"></path>
      </svg>
    </span>
  </div>`;
  let buttons = document.getElementsByClassName("_3lq69")[0];
  let butt = buttons.getElementsByTagName("span")[0];
  if(butt){
    butt.appendChild(z);
  } 
  
  document.getElementById("changeColors").addEventListener("click", function(){
    var sideBar = document.createElement('div');
    sideBar.id = 'changeColorsBar';
    sideBar.className = '_2t4Ic';
    sideBar.style.height = '100%';
    sideBar.style.transform = 'translateX(-100%)';
    sideBar.tabIndex = "-1";
    sideBar.innerHTML = `
        <div class="_1KDYa copyable-area">
         <header class="_3jHKU">
            <div class="kyJvR" data-animate-drawer-title="true">
               <div class="_2DP8_">
                  <button class="qfKkX" id="closeColors">
                     <span data-icon="back-light" class="">
                        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                           <path fill="#FFF" d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z"></path>
                        </svg>
                     </span>
                  </button>
               </div>
               <div class="_1pYs5">Cambiar Colores</div>
            </div>
         </header>
         <div class="rK2ei">
            <div class="PU7NO">
               <div class="MCTeI">
                  <div class="_3BYwr" dir="ltr">
                     <div class="BIM-V">
                        <div class="_3NteO">
                           <div style="width: 200px; height: 200px; top: 0px; left: 0px; position: absolute;"><img src="https://web.whatsapp.com/pp?e=https%3A%2F%2Fpps.whatsapp.net%2Fv%2Ft61.24694-24%2F56828274_2753081231431939_4805285178282868736_n.jpg%3Foe%3D5D080672%26oh%3D88e86be490ed246f29c8e1b09bf18324&amp;t=l&amp;u=34684006539%40c.us&amp;i=1545605955" class="" style="height: 100%; width: 100%; visibility: visible;"></div>
                        </div>
                     </div>
                     <span></span>
                  </div>
                  <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png" style="display: none;">
               </div>
            </div>
            <div class="_2LSbZ _2j5ir _2ZVEo">
               <div class="_3EN0l">
                  <div class="">
                     <div class="_1J99z">
                        <div class="_1kz4p VfNCr"><span class="_3he1q">Tu nombre</span></div>
                     </div>
                  </div>
               </div>
               <div tabindex="-1" class="_7w-84  _-3Ijj">
                  <div class="_3hnO5 _3K9Sw">
                     <div tabindex="-1" class="_3FeAD _2YgjU">
                        <div class="wjdTm" style="visibility: hidden;"></div>
                        <div class="_3u328 copyable-text selectable-text" contenteditable="false" dir="ltr">Albert C.H.</div>
                     </div>
                     <span class="_3F9q9"></span>
                     <span class="_2xHOS">
                        <div class="_30prC" title="Editar">
                           <span data-icon="pencil" class="">
                              <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                 <path fill="#263238" fill-opacity=".5" d="M3.95 16.7v3.4h3.4l9.8-9.9-3.4-3.4-9.8 9.9zm15.8-9.1c.4-.4.4-.9 0-1.3l-2.1-2.1c-.4-.4-.9-.4-1.3 0l-1.6 1.6 3.4 3.4 1.6-1.6z"></path>
                              </svg>
                           </span>
                        </div>
                     </span>
                  </div>
                  <div class="_3KUIv"></div>
               </div>
            </div>
            <div class="_1gK1Z"><span class="_1qWhd">Este no es tu nombre de usuario ni un PIN. Este nombre será visible para tus contactos de WhatsApp.</span></div>
            <div class="_2LSbZ _2j5ir _2ZVEo">
               <div class="_3EN0l">
                  <div class="">
                     <div class="_1J99z">
                        <div class="_1kz4p VfNCr"><span class="_3he1q">Info.</span></div>
                     </div>
                  </div>
               </div>
               <div tabindex="-1" class="_7w-84  _-3Ijj">
                  <div class="_3hnO5 _3K9Sw">
                     <div tabindex="-1" class="_3FeAD _2YgjU">
                        <div class="wjdTm" style="visibility: hidden;"></div>
                        <div class="_3u328 copyable-text selectable-text" contenteditable="false" dir="ltr">Se lo que aprendí de las&nbsp;lecciones que dio el tiempo,&nbsp;sé que me puedo ir&nbsp;y morir en cualquier momento.</div>
                     </div>
                     <span class="_3F9q9"></span>
                     <span class="_2xHOS">
                        <div class="_30prC" title="Editar">
                           <span data-icon="pencil" class="">
                              <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                 <path fill="#263238" fill-opacity=".5" d="M3.95 16.7v3.4h3.4l9.8-9.9-3.4-3.4-9.8 9.9zm15.8-9.1c.4-.4.4-.9 0-1.3l-2.1-2.1c-.4-.4-.9-.4-1.3 0l-1.6 1.6 3.4 3.4 1.6-1.6z"></path>
                              </svg>
                           </span>
                        </div>
                     </span>
                  </div>
                  <div class="_3KUIv"></div>
               </div>
            </div>
         </div>
      </div>
    `;
    let side = document.getElementsByClassName("o_uNe")[0];
    if(side){
      side.appendChild(sideBar);
      var elem =  document.getElementById("changeColorsBar");
      elem.style.transition = '1s';
      elem.style.transform = 'translateX(0%)';
    } 
  });
  $('#app').on('click', '#closeColors', handleClick);
  function handleClick(){
    var elem =  document.getElementById("changeColorsBar");
    elem.style.transition = '0.5s';
    elem.style.transform = 'translateX(-100%)';
    setTimeout(function () {
        elem.parentNode.removeChild(elem);
    }, 500);
  };
  
};
