// ==UserScript==
// @name         Phitron Mod
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Phitron.io Enhancements
// @author       Shamim
// @match        https://phitron.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=phitron.io
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/465593/Phitron%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/465593/Phitron%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prev/Next Shortcut
    const prevButton = document.getElementsByClassName("MuiButtonBase-root MuiButton-root MuiButton-text mr-2");
    const nextButton = document.getElementsByClassName("MuiButtonBase-root MuiButton-root MuiButton-contained mr-2");
    window.addEventListener("keydown", (e) => {
        // Previous Shortcut
        if((e.shiftKey && e.keyCode === 80)){
            console.log("Previous Shortcut Clicked");
            prevButton[0].click();
        }
        // Next Shortcut
        if((e.shiftKey && e.keyCode === 78)){
            console.log("Next Shortcut Clicked");
            nextButton[0].click();
        }
    });

    // Auto Speed Set
    let flag = 0;
    setInterval(() => {
        // ---------- General ----------
        let navItem = document.getElementsByClassName("nav-item");
        let search = document.getElementsByClassName("rbt-input-main");
        let dropdownPanel = document.getElementsByClassName("dropdown-menu show");

        if(navItem.length!=0){navItem[2].onmouseover = () => {flag = 1;}}
        if(navItem.length!=0){navItem[3].onmouseover = () => {flag = 1;}}
        if(navItem.length!=0){navItem[5].onmouseover = () => {flag = 1;}}
        if(dropdownPanel.length!=0){dropdownPanel[0].onmouseover = () => {flag = 1;}}
        if(search.length!=0){search[0].onmouseover = () => {flag = 1;}}

        if(navItem.length!=0){navItem[2].onmouseout = () => {flag = 0;}}
        if(navItem.length!=0){navItem[3].onmouseout = () => {flag = 0;}}
        if(navItem.length!=0){navItem[5].onmouseout = () => {flag = 0;}}

        if(dropdownPanel.length!=0){dropdownPanel[0].onmouseout = () => {flag = 0;}}
        if(search.length!=0){search[0].onmouseout = () => {flag = 0;}}
        // ---------- General ----------

        // ---------- Shaka Player ----------
        let playbackRate = document.getElementsByClassName("shaka-playbackrate-button");
        let shakaSpeed = document.getElementsByClassName("shaka-playback-rates");
        let shakaMenu = document.getElementsByClassName("shaka-settings-menu");
        let controlsVisibility = document.getElementsByClassName("shaka-controls-container");

        if(playbackRate.length!=0){playbackRate[0].onmouseover = () => {flag = 1;}}
        if(shakaMenu.length!=0){shakaMenu[0].onmouseover = () => {flag = 1;}}
        if(shakaMenu.length!=0){shakaMenu[1].onmouseover = () => {flag = 1;}}
        if(controlsVisibility.length!=0 && controlsVisibility[0].getAttribute("shown")=='true'){flag = 1;}

        if(playbackRate.length!=0){playbackRate[0].onmouseout = () => {flag = 0;}}
        if(shakaMenu.length!=0){shakaMenu[0].onmouseout = () => {flag = 0;}}
        if(shakaMenu.length!=0){shakaMenu[1].onmouseout = () => {flag = 0;}}
        if(controlsVisibility.length!=0 && controlsVisibility[0].getAttribute("shown")!='true'){flag = 0;}

        if(shakaSpeed.length!=0 && shakaSpeed[0].children.length != 0){
            shakaSpeed[0].children[1].onclick = () => {localStorage.setItem("autoVidSpeedParam", 1);}
            shakaSpeed[0].children[2].onclick = () => {localStorage.setItem("autoVidSpeedParam", 2);}
            shakaSpeed[0].children[3].onclick = () => {localStorage.setItem("autoVidSpeedParam", 3);}
            shakaSpeed[0].children[4].onclick = () => {localStorage.setItem("autoVidSpeedParam", 4);}
            shakaSpeed[0].children[5].onclick = () => {localStorage.setItem("autoVidSpeedParam", 5);}
            shakaSpeed[0].children[6].onclick = () => {localStorage.setItem("autoVidSpeedParam", 6);}
            shakaSpeed[0].children[7].onclick = () => {localStorage.setItem("autoVidSpeedParam", 7);}
        }

        if(shakaSpeed.length!=0 && flag === 0){
            let prevSpeed = localStorage.getItem("autoVidSpeedParam");
            if(shakaSpeed[0].children.length!=0){shakaSpeed[0].children[prevSpeed].click();}
        }
        // ---------- Shaka Player ----------

        // ---------- YTP Player ----------
        let ytpSettingsButton = document.getElementsByClassName("ytp-settings-button");
        let ytpPanel = document.getElementsByClassName("ytp-panel");
        let ytpProgressBarPadding = document.getElementsByClassName("ytp-progress-bar-padding");
        let ytpSpeed = document.getElementsByClassName("ytp-menuitem-content");

        if(ytpSettingsButton.length!=0){ytpSettingsButton[0].onmouseover = () => {flag = 1;}}
        if(ytpSettingsButton.length!=0){ytpSettingsButton[1].onmouseover = () => {flag = 1;}}
        if(ytpPanel.length!=0){ytpPanel[0].onmouseover = () => {flag = 1;}}
        if(ytpPanel.length!=0){ytpPanel[1].onmouseover = () => {flag = 1;}}
        if(ytpPanel.length!=0){ytpPanel[2].onmouseover = () => {flag = 1;}}
        if(ytpProgressBarPadding.length!=0){ytpProgressBarPadding[0].onmouseover = () => {flag = 1;}}

        if(ytpSettingsButton.length!=0){ytpSettingsButton[0].onmouseout = () => {flag = 0;}}
        if(ytpSettingsButton.length!=0){ytpSettingsButton[1].onmouseout = () => {flag = 0;}}
        if(ytpPanel.length!=0){ytpPanel[0].onmouseout = () => {flag = 0;}}
        if(ytpPanel.length!=0){ytpPanel[1].onmouseout = () => {flag = 0;}}
        if(ytpPanel.length!=0){ytpPanel[2].onmouseout = () => {flag = 0;}}
        if(ytpProgressBarPadding.length!=0){ytpProgressBarPadding[0].onmouseout = () => {flag = 0;}}

        if(ytpSpeed.length != 0){
            ytpSpeed[4].onclick = () => {localStorage.setItem("autoVidSpeedParam", 4);}
            ytpSpeed[5].onclick = () => {localStorage.setItem("autoVidSpeedParam", 5);}
            ytpSpeed[6].onclick = () => {localStorage.setItem("autoVidSpeedParam", 6);}
            ytpSpeed[7].onclick = () => {localStorage.setItem("autoVidSpeedParam", 7);}
            ytpSpeed[8].onclick = () => {localStorage.setItem("autoVidSpeedParam", 8);}
            ytpSpeed[9].onclick = () => {localStorage.setItem("autoVidSpeedParam", 9);}
        }

        if(flag === 0){
            let prevSpeed = localStorage.getItem("autoVidSpeedParam");
            if(ytpSpeed.length!=0){ytpSpeed[prevSpeed].click();}
            if(ytpSettingsButton.length!=0){ytpSettingsButton[1].click();}
        }
        // ---------- YTP Player ----------




        // Custom CSS
        const pathUrl = window.location.pathname.split('/');
        if(!document.getElementById("custom-css")){
            const head = document.head || document.getElementsByTagName('head')[0];
            const customStyle = document.createElement('style');
            customStyle.setAttribute("id", "custom-css");
            head.appendChild(customStyle);
        }
        else{
            const customStyle = document.getElementById("custom-css");

            const conceptualVideoSizeMod = `
.container{
    max-width: 90vw;
}
.container > .row > div:nth-child(1){
    max-width: 75% !important;
    flex: 0 0 100%;
}
.container > .row > div:nth-child(2){
    max-width: 25% !important;
    flex: 0 0 100%;
}
.conceptual-session-page .MuiAccordion-root {
    max-height: 75vh !important;
}
            `;

            const videoSizeMod = `
.container{
    max-width: 90vw;
}
.container > .row > div:nth-child(1){
    max-width: 77% !important;
    flex: 0 0 100%;
}
.milestone-section{
    max-width: 23% !important;
}
.course-layout{
    padding-top: 20px !important;
}
.course-content-component .course-content-list{
    max-height: 63vh !important;
}
.module-details .container .course-name{
    margin-bottom: -1.5rem;
}
#plyr-logo{
    display: none !important;
}
            `;


            const generalMod = `
::-webkit-scrollbar{
  width: 5px;
}
::-webkit-scrollbar-thumb{
    background: #c4c4c4;
    border-radius: 24px;
    min-height: 50px;
}
::-webkit-scrollbar-track{
    border-radius: 10px;
}

.ReactModal__Content{
    height: 60vh;
}
.modal-post-detail-contain-body{
    height: 55vh;
}
.avatar{
    border: 0 !important;
}
.card-body{
    border-radius: 10px;
}
            `;


            const themeMod =`
.fb_reset{
    display: none;
}
.course-layout{
    min-height: 100vh !important;
}
.MuiPaper-root{
    background-color: transparent !important;
}
.course-layout, .home-nav, body{
    background-image: url("https://web.programming-hero.com/home/footer/bg_footer.webp");
    background-repeat: no-repeat;
    background-color: #1f0a32;
}
.course-name, .module-title, .module-name, .milestone-title, .sub-milestone-title, .course-content-progress, .complete-course-button, .dropdown-item, .course-summary-title, .post-contain-body, .post-contain-body a, .quiz-result-card p, .assignment-heading-message, .dropdown-menu a, .quiz-question p, .quiz-question p span, .quiz-progress-label span, .ql-syntax, .card-body>h4, .home-nav .dropdown-menu .no-item p, .card-body p, .module-un-active-title, .module-active-title, .module-detail-component h3{
    color: rgb(235, 251, 255) !important;
}
.quiz-question strong{
    color: #c9c2ff !important;
    font-weight: bold !important;
}
.countdown-helper-text, .digit-label{
    color: #c9c2ff !important;
}
.option-component .btn{
    background: #c9c2ff;
}
.option-component .btn:hover{
    background: #9487ff !important;
}
.option-component .selected-button{
    color: #fff !important;
    background: #5a47ef !important;
}
.extra-player-options{
    background: #5a47ef;
}
.module-component{
    background: #3a297d !important;
}
.milestone-component .video-play, .module-component .video-play, .rbt-input-main, .dropdown-menu > .dropdown-item:hover{
    background: #201745 !important;
}
.course-content-component  .milestone-content, .post-component-body, .card-body, .quiz-result-card, .card, .module-group{
    background: #31236b !important;
}
.dropdown-menu{
    background: #004260 !important;
    border: 0;
}
.progress-bar, .complete-course-button, .jss12{
    background: linear-gradient(136.85deg, rgb(255, 55, 242) -15.82%, rgb(64, 90, 255) 99.57%) !important;
}
.module-countdown-component{
    box-shadow: none;
}
            `;

            let finalCss = "";
            if(pathUrl[2]==="video"){finalCss+=videoSizeMod+generalMod+themeMod}
            else if(pathUrl[1]==="conceptual-session"){finalCss+=conceptualVideoSizeMod+generalMod+themeMod;}
            else{finalCss+=generalMod+themeMod}

            if((pathUrl.length>=3 || pathUrl[1]==="conceptual-session") && pathUrl[1]!="profile"){customStyle.innerText = finalCss.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, ' ').trim();}
            else{customStyle.innerText = "";}
        }
    }, 100);
})();