// ==UserScript==
// @name         Gartic Dark Mode Customizer (Modernized)
// @version      2.0
// @description  Applies modern dark mode and UI tweaks for Gartic.io
// @author       Qwyua
// @match        https://gartic.io/*
// @supportURL   https://discord.gg/FdRfk68xDm
// @run-at       document-end
// @namespace https://greasyfork.org/users/1442865
// @downloadURL https://update.greasyfork.org/scripts/529093/Gartic%20Dark%20Mode%20Customizer%20%28Modernized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529093/Gartic%20Dark%20Mode%20Customizer%20%28Modernized%29.meta.js
// ==/UserScript==

const asd = {
    rooms: true, // or false // set to false to hide old rooms
    draw: true, // or false // set to false to hide drawing
    drawOpacity: 1, // recommended value between 1 and 0 or 0.1
    drawDark: 0.4, // recommended value between 1 and 0 or 0.1
    background: "https://images.wallpaperscraft.com/image/single/starry_sky_space_open_space_129155_1920x1080.jpg",
    select: "https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif",
    loading: "https://avatars0.githubusercontent.com/u/44649257?s=400&v=4"
};

const css = `#popUp .content{background-color:rgb(0 0 0 / 37%)}#screenRoom .ctt .users-tools #tools{display:none}@media screen and (max-width:640px){#screenRoom.common .ctt #interaction #chat .history .msg>div:not(.avatar) strong{color:#f9c236;margin:0 0 3px 5px}#screenRoom.common .ctt #interaction #chat .history .msg>div:not(.avatar) span{background-color:#00000030;color:#FFBD4;line-height:15px;font-size:16px;font-family:NunitoBlack}.rooms .scroll .scrollElements .loading,.area,.join .infos .infosUsers .user .nick,.join .infos .infosRoom,#screenRoom.common,#screenRoom.common .ctt .users-tools,#screenRoom.common .ctt #interaction #answer{background-color:#0000}}#screenRoom.common .ctt .users-tools #users,#screenRoom .ctt .users-tools #users,.rooms .scroll .scrollElements .loading,#screens .title .filter .optionsFilter>div,#screenRoom.viewer .ctt #interaction,#screenRoom.common .ctt #interaction{background-color:#0000}#popUp>div.content{background-color:rgba(0,0,0,0.75)}.ctt #canvas{opacity:${asd.drawOpacity};${asd.draw ? "" : "display:none;"} }#screens .home .lastRooms{${asd.rooms ? "" : "display:none;"} }#events{background-color:rgba(0,0,0,${asd.drawDark});${asd.draw ? "" : "display:none;"} }::-webkit-scrollbar{display:none;visibility:hidden;opacity:0}#screens div div.content.bg.rooms div.scroll div.scrollElements a.selected{background-color:rgba(0,0,0,0.83);background-image:url(${asd.select});background-size:cover;box-shadow:0 0 140px 10px rgba(0,0,0,.5);border:5px solid rgba(204,204,0,0.9)}#screens>div{background-color:#0000;border-radius:10px}#screens .scrollElements a,#screens .lastRooms li{background-color:rgba(0,0,0,0.83);border:2px solid black}.home .lastRooms>div ul li:not(.emptyList):not(.empty)>span{background-color:rgba(0,0,0,0.83);background-image:url(${asd.select});background-position:center;background-size:cover;box-shadow:0 0 140px 10px rgba(0,0,0,.5);border:5px solid rgba(204,204,0,0.9)}#screens .rooms .scrollElements a:hover,#screens div div.content.home div.lastRooms div li:hover{background-color:rgba(0,0,0,0.83);border-radius:10px;transform:scale(1.05);border:4px solid rgba(0,0,0,0.9);transition:all .2s ease-out}#background:before,#interaction,#screens>div>div.content.home>div.anonymus>div.form>div.containerForm>div.fieldset.nick>span,#screens>div>div.content.home>div.anonymus>div.form>div.containerForm>div.fieldset.lang>span,#screens>div>div.title.mobileHide>span,#screens header,#screens footer,#screens .home div.or{display:none}input[type=text],#popUp .contentPopup.infoRoom span,#screens div div.title div.filter,#screens .home .lastRooms div,#answer form div input,#screens div div.content.bg.rooms,#screens>div>div.content.home>div.anonymus>div.form>div.containerForm{background-color:#0000}@keyframes animate8345{0%,100%{filter:hue-rotate(0deg)}50%{filter:hue-rotate(360deg)}}.clientstart{z-index:100000000;color:#000;background:linear-gradient(to right,#2d60ec,#3ccfda);font-size:24px;-webkit-text-fill-color:transparent;-webkit-background-clip:text;animation:animate8345 9s linear infinite;font-weight:bold}#popUp .loading:before{content:"";height:100px;width:100px;background:url(${asd.loading}) center/cover no-repeat;border-radius:50%}#popUp .loading .anima{position:relative;border:0 solid transparent;border-left-color:#ffd217;animation:load .8s infinite linear}`;
document.querySelector('div')?.prepend(Object.assign(new Image(),{
    src: asd.background,
    style: "width:100%;height:100%;z-index:6;position:absolute;top:0;left:0;",
    oncontextmenu: e => e.preventDefault(),
    onselectstart: e => e.preventDefault(),
    ondragstart: e => e.preventDefault()
}));
document.head.appendChild(Object.assign(document.createElement("style"),{textContent:css}));

setInterval(()=>{
    const e=document.querySelector("#events"),t=document.querySelector("#tools");
    t&&e&&(t.style.display={default:"none",crosshair:"contents"}[e.style.cursor]??t.style.display)
},500)
