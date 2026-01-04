// ==UserScript==
// @name         Państwa Miasta - Menu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Made by Norus
// @author       Norus
// @license MIT
// @match        https://panstwamiasta.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panstwamiasta.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441878/Pa%C5%84stwa%20Miasta%20-%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/441878/Pa%C5%84stwa%20Miasta%20-%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const style = document.createElement('style');
    const style_content = `
    *{    transition: 0.2s ease-in;}body.darkmode h1,body.darkmode h2{color: #fff;}    body.darkmode b,body.darkmode span{color: #fefefe;font-weight: 500;font-family: "open sans", sans-serif;}    body.darkmode p{color: #999999;}    body.darkmode{background: #111111 !important;}    body.darkmode .bg{background: #121212 !important;}    body.darkmode nav.nav,    body.darkmode nav.NavBar-module__nav{    background:  #161616;    border: none;    border-bottom: 1px solid #222222;    }    body.darkmode nav.NavBar-module__nav li.NavBar-module__logo a{    color: #fff;    }    body.darkmode nav.NavBar-module__nav li.NavBar-module__right a.NavBar-module__profile{    background: #202020;    }    nav.nav li.right a.profile{    color: #fff;    background: transparent;    }    body.darkmode nav.nav li.logo a{    color: #fff;    }    body.darkmode .box-content{    background: #181818 !important;    }    body.darkmode main > header{    background: #121212;    }    body.darkmode main > footer{    background: #161616;    }    body.darkmode .box-content{    border-color: #191919;    }    body.darkmode .BoxContent-module__boxContent{    background: #191919;    border-color: #191919;    }    body.darkmode .box-content .btn-play{    padding: 0;    padding-top: 5px !important;    padding-bottom: 5px !important;    }    body.darkmode .box-content .btn-play big {    font-size: 30px !important;    }    body.darkmode .text-danger {    color: #ff5f5c;    }    body.darkmode .AvailableGame-module__availableGame>a{    background: #202020 !important;    }    body.darkmode .btn-xxl{    font-size: 35px;    }    body.darkmode td{    color: #999999;    }    body.darkmode div{    color: #909090;    }    body.darkmode .btn-xs, .btn-group-xs>.btn {    padding: 1px 5px;    background: #303030;    outline: none;    border: none;    color: #fff;    padding: 5px;    }    body.darkmode #newGameForm b{    color: #fff;    }    body.darkmode .col-sm-18 div{    color: #fff;    }    body.darkmode .boolBtnList a.active {    border: 1px solid transparent;    background: #303030;    color: #dbdbdb;    }    body.darkmode .boolBtnList a:hover {    border: 1px solid #252525;    background: #303030;    color: #fefefe;    }    body.darkmode .profile div{    color: #fff;    }    body.darkmode .nav-tabs>li.active>a{    background-color: #222222;    border: 1px solid #262626;    color: #fefefe;    }    body.darkmode .nav-tabs {    border-bottom: 1px solid #262626;    }    body.darkmode .nav-tabs>li>a:hover{    border: 1px solid transparent;    background: #353535;    color: #fefefe;    }    body.darkmode .pagination>li>a {    color: #d1d1d1;    background-color: #232323;    border: 1px solid #303030;    }    body.darkmode .pagination>li>a:hover{    background: #262626;    }    body.darkmode .boolBtnSelectedList span{    border-color: #303030;    }    body.darkmode .btn-primary:hover, .btn-primary:focus, .btn-primary.focus, .btn-primary:active, .btn-primary.active, .open>.dropdown-toggle.btn-primary {    color: #fff;    background-color: #303030;    border-color: #252525;    }    body.darkmode .btn-default,    body.darkmode .form-control{    color: #909090;    background-color: #181818;    border-color: #303030;    }    body.darkmode nav.nav li.right a.link:hover {    background: transparent;    }    body.darkmode .alert-info{    background-color: #191919;    border-color: #303030;    }    body.darkmode .Message-module__message Message-module__info{    background-color: #212121;    border-color: #303030;    color: #fff;    }    body.darkmode .Message-module__message.Message-module__info {    background-color: #212121;    border-color: #303030;    color: #909090;    }    body.darkmode .PlayersControls-module__playerList li,    body.darkmode .PlayerList-module__playerList li,    body.darkmode .ConfirmResults-module__playerList li{    background: #212121;    border: 1px solid #303030;    color: #fff;    }    body.darkmode .Message-module__message.Message-module__default{    background-color: #212121;    border-color: #303030;    color: #fff;    }    body.darkmode .Modal-module__modalContent,    body.darkmode .modal-content{    background-color: #212121;    border: 1px solid #303030;    }    body.darkmode .Btn-module__default {    color: #fff;    background-color: #212121;    border-color: #404040;    }    body.darkmode .close{color:#fff}    .menu-devaise{    width: 600px;    height: 370px;    background: #fff;    border: 1px solid #d7d7d7;    border-radius: 5px;    z-index: 2000;    position: fixed;    top: 100px;    left: 50%;    animation: openMenu 0.3s ease-in;    text-align:  center;    transform: translate(-50%, 0%);    display: none;    }    .menu-hide{    opacity: 0;    transition:0.2s ease-in;    transform: translate(-50%, -10%);    }    body.darkmode .menu-devaise{background: #212121;border: 1px solid #303030;}    @keyFrames openMenu{    from{transform:translate(-50%, -10%);opacity: 0;}    to{transform:translate(-50%, 0%);opacity: 1;}    }    .menu-devaise .footer{    width: 100%;    height: 60px;    border-top: 1px solid #e9e9e9;    background: #fff;    position: absolute;    left: 0;    bottom: 0;    border-bottom-left-radius: 5px;    border-bottom-right-radius: 5px;    }    body.darkmode .menu-devaise .footer{background: #252525;border-top: 1px solid #464646}    .menu-devaise .footer img{    width: 170px;    height: 50px;    margin-top: 5px;    }    .menu-devaise .closeMenuDevaise{    color: #505050;    position: absolute;    right: 15px;    top: 15px;    cursor: pointer;    font-size: 20px;    font-weight: 500;    }    .menu-devaise .container{    width: 100%;    position: relative;    height: 240px;    top: 50px;    left: 0;    }    .menu-devaise .container .tb{    width: 85%;    height: 60px;    background: #f7f7f7;    border-radius: 5px;    position: relative;    top: 20px;    margin-top: 20px;    left: 50%;    transform: translate(-50%, 0);    }    body.darkmode .menu-devaise .container .tb{background: #232323;}    .menu-devaise .container .tb span,    .menu-devaise .container .tb button{position: relative;}    .menu-devaise .container .tb span{    color: #909090;    left: 25px;    top: 17.5px;    font-size: 15px;    float: left;    }    .menu-devaise .container .tb button{    border: none;    border-radius: 3px;    outline: none;    padding: 7px 25px 7px 25px;    top: 12.5px;    font-weight: 500;    float: right;    border: 1px solid transparent;    margin-left: 10px;    font-family: "open sans", sans-serif !important;    transition: 0.3s ease-in;    }    .menu-devaise .container .tb button.active{padding: 7px 45px 7px 45px;transition: 0.3s ease-in;}    .menu-devaise .container .tb .whitemodebtn.active{border-color:#fff;}    .menu-devaise .container .tb .darkmodebtn.active{border-color:#505050;}    .menu-devaise .container .tb .darkmodebtn{    right: 10px;    background: #303030;    color: #fafafa;    }    .menu-devaise .container .tb .whitemodebtn{    color: #fff;    right: 10px;    background: #4da0ff;    }    .devmn-div{    position: fixed;    width: 220px;    background: #fafafa;    border-radius: 3px;    height: 50px;    bottom: 30px;    right: 50px;    z-index: 1000;    }    body.darkmode .devmn-div{background:#191919;}    .devmn-div span{    position:absolute;    left: 15px;    top:15px;    color: #505050 !important;    }    body.darkmode .devmn-div span{color: #909090 !important;}    .devmn-div .devaisemenu-open{     background: #2b9cf5;     color: #fff;     border: none;     outline: none;     border-radius: 3px;     padding: 5px 15px 5px 15px;     position: absolute;     top: 10px;     right: 20px;    }

    `;

    document.head.appendChild(style);
    style.type = 'text/css';
    style.innerHTML = style_content;
    console.log("Style Injected");

    const menu = document.createElement('div');
    document.body.appendChild(menu);
    menu.className = "menu-devaise";

    const footer = document.createElement('div');
    footer.className = "footer";
    menu.appendChild(footer);

    const iconclose = document.createElement("i");
    iconclose.className = "fa fa-close closeMenuDevaise";
    menu.appendChild(iconclose);

    const container = document.createElement("div");
    container.className = "container";
    menu.appendChild(container);
    container.innerHTML = `
    <div class='tb'><span>Tryb Strony</span><button class="darkmodebtn" type='button'>Dark</button><button class="whitemodebtn" type='button'>White</button></div>
    <div class="tb" style="text-align:center;height:50px;"><span style="float: none;left:0;top:15px;">Made by Norus with &lt;3</span></div>
    `;

    const imgDevaise = document.createElement("img");
    footer.appendChild(imgDevaise);

    console.log("Menu Created");

    const menuOpenDiv = document.createElement("div");
    menuOpenDiv.className = "devmn-div";
    document.body.appendChild(menuOpenDiv);

    const spanOpen = document.createElement("span");
    spanOpen.textContent="Otwórz menu";
    menuOpenDiv.appendChild(spanOpen);

    const menuOpen = document.createElement("button");
    menuOpen.className = "devaisemenu-open";
    menuOpen.type = "button";
    menuOpen.innerHTML = `<i class="fa fa-plus"></i>`;
    menuOpenDiv.appendChild(menuOpen);

    const script = document.createElement("script");
    script.innerHTML = `
    const darkmodebtn = document.querySelector(".menu-devaise").querySelector(".tb").querySelector(".darkmodebtn");
    const whitemodebtn = document.querySelector(".menu-devaise").querySelector(".tb").querySelector(".whitemodebtn");
    const result_mode = localStorage.getItem("pagemode");
    const opensettings = document.querySelector(".devaisemenu-open");
    const menu = document.querySelector(".menu-devaise");
    const closesettings = menu.querySelector(".closeMenuDevaise");

    opensettings.addEventListener("click", ()=>{if (menu.classList.contains("menu-hide")){menu.classList.remove("menu-hide");}menu.style.display = "block";});
    closesettings.addEventListener("click", ()=>{menu.classList.add("menu-hide");setTimeout(function(){menu.style.display = "none";}, 300);});
    darkmodebtn.addEventListener("click", ()=>{darkmodebtn.className = "darkmodebtn active";document.querySelector(".menu-devaise").querySelector(".footer").querySelector("img").src = "https://www.devaise.xyz/assets/img/devaiselogoname.png";whitemodebtn.classList.remove("active");document.getElementsByTagName( 'html' )[0].classList.add("darkmode");document.body.classList.add("darkmode");localStorage.setItem("pagemode", "dark");});
    whitemodebtn.addEventListener("click", ()=>{document.querySelector(".menu-devaise").querySelector(".footer").querySelector("img").src = "https://www.devaise.xyz/assets/img/devaiselogonamewhite.png";whitemodebtn.className = "whitemodebtn active";darkmodebtn.classList.remove("active");document.getElementsByTagName( 'html' )[0].classList.remove("darkmode");document.body.classList.remove("darkmode");localStorage.setItem("pagemode", "white");    });

    darkmodebtn.click();

   if (result_mode == null || result_mode == ""){localStorage.setItem("pagemode", "dark");}else if(result_mode == "dark"){darkmodebtn.click();}else if(result_mode == "white"){whitemodebtn.click();}else{darkmodebtn.click();}
    `;
    document.body.appendChild(script);
    console.log("Script Injected");
    console.log("Created By Norus");
})();