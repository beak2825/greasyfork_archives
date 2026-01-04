// ==UserScript==
// @name         SchoolModMenu
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  A mod menu to use at school ! Shortcuts / Apps / chatgpt include !
// @author       dltrost
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487298/SchoolModMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/487298/SchoolModMenu.meta.js
// ==/UserScript==

const box = document.createElement('div')
box.innerHTML = `

<div id="box">
    <img class="fond" src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D">
    <div class="background"></div>

    <button id="home" onclick="home()" class="start">Home</button>
    <img src="https://cdn-icons-png.flaticon.com/512/45/45180.png" id="maison">

    <button id="apps" onclick="apps()" >Apps</button>
    <img src="https://www.svgrepo.com/show/334647/extension.svg" id="extention">

    <button id="keyboard" onclick="keys()" >Keys</button>
    <img src="https://cdn-icons-png.flaticon.com/512/68/68760.png" id="clavier">

    <button id="settings" onclick="settings()" >Settings</button>
    <img src="https://cdn-icons-png.flaticon.com/512/15/15185.png" id="option">
   
    <a href="https://update.greasyfork.org/scripts/487298/SchoolModMenu.user.js">
        <div id="v">v2.7</div>
    </a>

    <div id="content1">
        <div id="titlehome">What to do ?</div>
        <div id="texthome"> This mode allows you to <a class="color">navigate</a> and use <a class="color">applications with complete discretion</a> ! You can change <a class="color">application themes</a>, create <a class="color">keyboard shortcuts</a> in case of panic if a teacher arrives ! I let you discover ;)<a class="color"><br><br>By dltrost</a></div>
    </div>

    <div id="content2">
        <a href="https://www.ecoledirecte.com" >
            <div class="logosite" id="logo1"></div>
        </a>
        <a href="https://www.classroom.com" >
            <div class="logosite" id="logo2"></div>
        </a>
        <a href="https://docs.google.com/document/u/0/create?usp=docs_home&ths=true" >
            <div class="logosite" id="logo3"></div>
        </a>
        <a href="https://www.chatgpt.com" >
            <div class="logosite" id="logo4"></div>
        </a>        
        <a href="https://code.visualstudio.com/docs/editor/vscode-web" >
            <div class="logosite" id="logo5"></div>
        </a>    
        <a href="https://www.youtube.com" >
            <div class="logosite" id="logo6"></div>
        </a> 
        <a href="https://www.instagram.com/" >
            <div class="logosite" id="logo7"></div>
        </a>
        <a href="https://www.facebook.com/" >
            <div class="logosite" id="logo8"></div>
        </a>
        <a href="https://www.whatsapp.com/" >
            <div class="logosite" id="logo9"></div>
        </a>
        <a href="https://twitter.com/m" >
            <div class="logosite" id="logo10"></div>
        </a>        
        <a href="https://www.snapchat.com/" >
            <div class="logosite" id="logo11"></div>
        </a>    
        <a href="https://www.discord.com" >
            <div class="logosite" id="logo12"></div>
        </a>
        <a href="https://www.shellshock.io" >
            <div class="logosite" id="logo13"></div>
        </a>
        <a href="https://garticphone.com/fr" >
            <div class="logosite" id="logo14"></div>
        </a>
        <a href="https://amongus-online.net/" >
            <div class="logosite" id="logo15"></div>
        </a>
        <a href="https://games.voodoo.io/paperio2" >
            <div class="logosite" id="logo16"></div>
        </a>        
        <a href="https://diep.io/" >
            <div class="logosite" id="logo17"></div>
        </a>    
        <a href="https://www.haxball.com/" >
            <div class="logosite" id="logo18"></div>
        </a>      

    </div>
</div>

<style>
#box {
    position: fixed;
    top: 20px;
    left: 50%;
    width: 80px;
    height: 12px;
    border-radius: 5px;
    filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.795));
    transform: translateX(-50%);
    transition: height 0.4s, width 0.8s, opacity 0.6s, border-radius 0.9s, background-image 0.9s, filter 0.9s;
    overflow: hidden;
    opacity: 0.7;
}

#box:hover {
    width: 600px;
    height: 200px;
    opacity: 1;
    border-radius: 8px;
}

#home {
    position: absolute;
    top: 40px;
    left: 20px;
    width: 130px;
    height: 30px;
    outline: none;
    border: none;
    background-color: rgba(255, 255, 255, 0.658);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: rgb(46, 46, 46);
    transition-duration: 0.3s;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}

#home:hover, #apps:hover, #keyboard:hover, #settings:hover {
    background-color: rgba(255, 255, 255, 0.568);
}

#maison, #option, #extention, #clavier {
    pointer-events: none;
}

#maison {
    position: absolute;
    width: 15px;
    height: auto;
    left: 32px;
    top: 48px;
}

#apps {
    position: absolute;
    top: 70px;
    left: 20px;
    width: 130px;
    height: 30px;
    outline: none;
    border: none;
    background-color: rgba(255, 255, 255, 0.658);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: rgb(46, 46, 46);
    transition-duration: 0.3s;
}

#extention {
    position: absolute;
    width: 15px;
    height: auto;
    left: 32px;
    top: 78px;
}

#keyboard {
    position: absolute;
    top: 100px;
    left: 20px;
    width: 130px;
    height: 30px;
    outline: none;
    border: none;
    background-color: rgba(255, 255, 255, 0.658);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: rgb(46, 46, 46);
    transition-duration: 0.3s;
}

#clavier {
    position: absolute;
    width: 15px;
    height: auto;
    left: 32px;
    top: 108px;
}

#settings {
    position: absolute;
    top: 130px;
    left: 20px;
    width: 130px;
    height: 30px;
    border: none;
    background-color: rgba(255, 255, 255, 0.658);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 12px;
    font-weight: 800;
    color: rgb(46, 46, 46);
    transition-duration: 0.3s;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
}

#option {
    position: absolute;
    width: 15px;
    height: auto;
    left: 32px;
    top: 138px;
    transition-duration: 0.3s;
}

#box button.active {
    background-color: rgba(255, 255, 255, 0.459);
}

#v {
    position: absolute;
    left: 565px;
    top: 10px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 800;
    font-size: 11px;
    text-decoration: none;
    color: rgb(70, 203, 255);
}

#titlehome, #texthome {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 800;
    color: rgb(216, 216, 216);
}

#titlehome {
    position: absolute;
    left: 330px;
    top: 48px;
    color: rgb(255, 255, 255) !important;
}

#texthome {
    position: absolute;
    left: 170px;
    top: 75px;
    text-align: justify;
    font-size: 10px;
    max-width: 400px;
}

.color {
    color: rgb(150, 168, 255) !important;
}

.fond {
    position: absolute;
    width: 100%;
    height: auto;
    pointer-events: none;
    filter: blur(2px);
}

.background {
    position: absolute;
    top: 40px;
    left: 160px;
    width: 424px;
    height: 119px;
    background-color: rgba(0, 0, 0, 0.253);
    border-radius: 3px;
}

#content2 {
    position: absolute;
    left: 5px;
    opacity: 0;
}

#content1 {
    opacity: 1;
}

.logosite {
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0.685);
    border-radius: 3px;
    border: none;
    transition-duration: 0.2s;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.377));
}

.logosite:hover {
    transform: scale(0.9);
    background-color: rgba(255, 255, 255, 0.842);
}

#logo1 {
    position: absolute;
    top: 66px;
    left: 168px;
    background-image: url("https://static.wixstatic.com/media/138810_d6027b553af442b09f19fe896ff594aa~mv2.png/v1/fill/w_242,h_156,al_c,lg_1,q_85,enc_auto/logoEcoleDirecte_580417d7.png");
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo2 {
    position: absolute;
    top: 66px;
    left: 204px;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png");
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo3 {
    position: absolute;
    top: 66px;
    left: 240px;
    background-image: url("https://cdn-icons-png.flaticon.com/512/5968/5968517.png");
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo4 {
    position: absolute;
    top: 66px;
    left: 276px;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png");
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo5 {
    position: absolute;
    top: 102px;
    left: 168px;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo6 {
    position: absolute;
    top: 102px;
    left: 204px;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo7 {
    position: absolute;
    top: 66px;
    left: 333px;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo8 {
    position: absolute;
    top: 66px;
    left: 369px;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo9 {
    position: absolute;
    top: 66px;
    left: 405px;
    background-image: url("https://logodownload.org/wp-content/uploads/2015/04/whatsapp-logo-png.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo10 {
    position: absolute;
    top: 102px;
    left: 333px;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo11 {
    position: absolute;
    top: 102px;
    left: 369px;
    background-image: url("https://www.freeiconspng.com/uploads/social-media-snapchat-logo-png-clipart-21.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo12 {
    position: absolute;
    top: 102px;
    left: 405px;
    background-image: url("https://logodownload.org/wp-content/uploads/2017/11/discord-logo-1-1.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo13 {
    position: absolute;
    top: 66px;
    left: 462px;
    background-image: url("https://shellshock.io/favicon192.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo14 {
    position: absolute;
    top: 66px;
    left: 498px;
    background-image: url("https://logos-world.net/wp-content/uploads/2022/04/Gartic-Phone-Logo.png"); 
    background-size: 90%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo15 {
    position: absolute;
    top: 66px;
    left: 534px;
    background-image: url("https://assets.stickpng.com/images/6002f9d851c2ec00048c6c78.png"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo16 {
    position: absolute;
    top: 102px;
    left: 462px;
    background-image: url("data:image/jpeg;base64,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"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo17 {
    position: absolute;
    top: 102px;
    left: 498px;
    background-image: url("https://play-lh.googleusercontent.com/6lO401fxwNTk919VwTKOdKGot82kf1WFBYGdhnVgDVsmkdK6Nv6d2ZDpmKBVO9CW2s8=w240-h480-rw"); 
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}

#logo18 {
    position: absolute;
    top: 102px;
    left: 534px;
    background-image: url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b9ed81e2-fe8b-4139-8830-35dabc5256fa/dbl5xzi-63bb9047-abc4-4df0-91b8-ecbe5c7b3a50.png/v1/fill/w_512,h_512/haxball_game_icon__512x512__by_m_1618_dbl5xzi-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvYjllZDgxZTItZmU4Yi00MTM5LTg4MzAtMzVkYWJjNTI1NmZhXC9kYmw1eHppLTYzYmI5MDQ3LWFiYzQtNGRmMC05MWI4LWVjYmU1YzdiM2E1MC5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.lBYfxBQacojZrd_oIexmEiYwzujVLbEHsJkcmfIFCKw"); 
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}
</style>
`
document.body.appendChild(box);

const homepage = document.getElementById('home')
const appspage = document.getElementById('apps')
const keyboardpage = document.getElementById('keyboard')
const settingspage = document.getElementById('settings')
homepage.classList.add('active')

const buttons = document.querySelectorAll('#box button');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        buttons.forEach(btn => btn.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('start'));
        this.classList.add('active');
             alert('F = 1/T ; 1s*2 2s*2 2p*6 3p*2 3p*6 ; timbre : aigue/grave ; entend entre 20HZ-20000HZ ; motif : duré d un son qui se répéte');
    });
});

const homecontent = document.getElementById('content1')
const appscontent = document.getElementById('content2')
const keyscontent = document.getElementById('content3')
const settingscontent = document.getElementById('content4')

appspage.addEventListener('click', function() {
    homecontent.style.opacity = "0";
    appscontent.style.opacity = "1";
    keyscontent.style.opacity = "0";
    settingscontent.style.opacity = "0";
});

homepage.addEventListener('click', function() {
    homecontent.style.opacity = "1";
    appscontent.style.opacity = "0";
    keyscontent.style.opacity = "0";
    settingscontent.style.opacity = "0";
});

keyboardpage.addEventListener('click', function() {
    homecontent.style.opacity = "0";
    appscontent.style.opacity = "0";
    keyscontent.style.opacity = "1";
    settingscontent.style.opacity = "0";
});

settingspage.addEventListener('click', function() {
    homecontent.style.opacity = "0";
    appscontent.style.opacity = "0";
    keyscontent.style.opacity = "0";
    settingscontent.style.opacity = "1";
});


const version = GM_info.script.version;
var vUpdate = document.getElementById('v');
vUpdate.textContent = 'v' + version;




