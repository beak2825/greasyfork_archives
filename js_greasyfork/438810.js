// ==UserScript==
// @name         ⚙vpGenius🎬
// @namespace     https://github.com/Filszu/video_player_genius
// @version      1.2.2
// @description  Video speed changer and other useful video player tools
// @description:pl  Skrypt umożliwiający przyspieszenie video do 16x i pobranie go.
// @author       Filszu (https://github.com/Filszu)
// @license      MIT
// @match        http://*/*
// @include      https://www.youtube.com/*
// @include      *://*/**
// @icon         https://ciac.me/logo.png
// @resource     customCSS https://raw.githubusercontent.com/Filszu/video_player_genius/master/style.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/438810/%E2%9A%99vpGenius%F0%9F%8E%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438810/%E2%9A%99vpGenius%F0%9F%8E%AC.meta.js
// ==/UserScript==

var newCSS = GM_getResourceText ("customCSS");
GM_addStyle (newCSS);

console.log('%c------------⚙vpGenius------------', 'color: green; ');
var body;
var video_players;  
//detected videoplayers
let videos_no;
let menu=null;
let hiddenMenu=false;


window.addEventListener("load", function(){
    body = document.querySelector("body");
    //FIND VIDEO
    findVideo();

 
    
});

function findVideo(){
    try{

        video_players=document.querySelectorAll('video');
    
        //detected videoplayers
        videos_no=video_players.length;
        console.log(video_players);
        console.log(video_players[0]);
    
        if(videos_no<=0){
           
            console.log('%c[⚙vpGenius]', 'color: green; ',`Video hasn't been founded`);
            console.log("to refresh, type 'setup()' in the console");
            show_hiddenMenu();

        }
        else{
            
            if(menu==null){
                setup();        
            }

            updateContent();
        }
    }catch(err){
        console.log('%c[⚙vpGenius]', 'color: green; ',`Video hasn't been founded`);
        console.log(err);
        
    }
}



function show_hiddenMenu(){//smal menu
    const el = document.createElement("div");
    const smallMenu = el;
    smallMenu.innerHTML='<div class="menu-container" style="background-color: rgb(0, 181, 114, 0.75); border-radius: 5px; padding: 10px; cursor: pointer">🎬</div>';
    body.append(smallMenu);

    smallMenu.onclick=()=>{
        smallMenu.style.display="none";
        findVideo();
    }
}

function hideMenu(){
    menu.innerHTML="";
    menu=null;
    // menu.style.display="none";
    show_hiddenMenu();
}








let menu_icon;
let menu_options;
let v_control;
let v_info;
let operations;
function setup(){
    console.log('%c------------⚙vpGenius------------', 'color: green; ');
    //PANEL    
    const el = document.createElement("div");
    
    menu = el;
    // console.warn(typeof(menu));
    menu.innerHTML = `
    <div class="menu-container">
        <div id="menu_icon">⚙vpGenius🎬
        <div class="title_desc">powered by: <a href="https://ciac.me">CIAC.me V-speeder</a></div>
        </div>


        <div id="menuOptions">
            ⏱video speed: <span id="v_speed_info">1</span>
            <input type="range" id="speed_control" name="speed_control"" 
            min="0.1" max="16" value="1" step="0.1" style="width: 100%;">

            <div>🎬Detected: <span class="specialFont">${videos_no}</span> video-players</div>
            

            

            <div class="controls">
                <div id="btn_findVideo">⟳</div>
                <div id="btn_controls1">▶</div>
                
                <div id="btn_controls2" >II</div>
                <div id="btn_hideMenu">⤒</div>
            </div>

            <div id="operations-con">
                <div class="controls" ><div>open↗ </div> / <div> download⬇</div></div>
                <div id="operations">videos: </div>
                <div class="controls" id="btn_hideMenu2"><div>⏏⏏⏏</div></div>
                
                
            </div>
            
            
            

            
            <!--⬜▶👣⬛💱🔄⏸⏺⏹🔁🔄 ⟲ ↺ ↻ ↩⤒ ⌫⏎⏏⏫⬆↕-->



            

        
        </div>

        

        
        `;
        
   

    
    body.append(menu);
    
    menu_icon = document.querySelector("#menu_icon");
    menu_options = document.querySelector("#menuOptions");
    v_control = document.querySelector('#speed_control');
    v_info = document.querySelector('#v_speed_info');
    operations = document.querySelector('#operations');

    //clicked methods
    document.querySelector("#btn_findVideo").addEventListener('click',findVideo)
    document.querySelector("#btn_controls1").addEventListener('click',()=>{controls(1)})
    document.querySelector("#btn_controls2").addEventListener('click',()=>{controls(0)})
    document.querySelector("#btn_hideMenu").addEventListener('click',hideMenu)
    document.querySelector("#btn_hideMenu2").addEventListener('click',hideMenu)



    // btn_hideMenu
    // 
    // btn_hideMenu2
    // hideMenu()
    // updateContent();
}


function updateContent(){

//change speed

    v_control.addEventListener("change", function(){

        const v_speed =v_control.value;
        v_info.innerHTML = v_speed;

        for( let v_num in video_players)
        {
            // video_players[v_num].style.display="none";

            // video_players[v_num].defaultPlaybackRate = 1.0;
            // video_players[v_num].play();
            video_players[v_num].playbackRate = v_speed;
        }

        
    });




    //edit div
    //DOWNLOAD or open option
        
    let nContent='';

    for(let i=0; i<videos_no; i++){
        let file_name = video_players[i].currentSrc;


       
        // nContent+=`<div>video${i} (src="${file_name}")</div>`;
        nContent+=`<div>
        video ${i}: 
     
            <a href="${file_name}" target="blank" title="open: ${file_name}">open↗</a> </div>`

    }
        
    
    operations.innerHTML=nContent;

}

function controls(action){
        
    switch (action){
        case 1:
            for(let i=0; i<videos_no; i++){
                // console.log(video_players[i]);
                video_players[i].play();
            }
            break;
        case 0:
            video_players.forEach(v_num => {
                v_num.pause();
            });
            break;
    }

}


// ADD STYLES
    // Get HTML head element
    const head = document.getElementsByTagName('HEAD')[0]; 
    // Create new link Element
    const link = document.createElement('link');
    // set the attributes for link element 
    link.rel = 'stylesheet'; 
    link.type = 'text/css';
    link.href = 'style.css'; 
    // Append link element to HTML head
    head.appendChild(link); 