// ==UserScript==
// @name           Custom YouTube Video Tools
// @namespace      http://www.diamonddownload.weebly.com
// @description    Adds buttons to YouTube videos to allow custom seeking. It also adds a handy stop start button for stopping to video quickly. 
// @include        http://*.youtube.com/*
// @include        http://youtube.com/*
// @include        https://*.youtube.com/*
// @include        https://youtube.com/*
// @grant          none
// @version        2.3.0
// @run-at         document-body
// @author         R.F Geraci
// @icon64         http://icons.iconarchive.com/icons/designbolts/minimalist-social/64/YouTube-icon.png
// @downloadURL https://update.greasyfork.org/scripts/4081/Custom%20YouTube%20Video%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/4081/Custom%20YouTube%20Video%20Tools.meta.js
// ==/UserScript==

//============CUSTOM SETTINGS============
var showOnPageLoad = false;
var ToggleOFFDivButtonText = 'Video Tools';
var ToggleONDivButtonText = 'Hide Tools';
//=======================================

var toggle = false;
var btn;
var Tbox;
var SeekBBtn;
var SeekFBtn;
var label;
var CheckBox;
var tURLBtn;
var HideAnnosBtn;
var togHideAnno;
var playVidAtBtn;
var PlayVidAtHOUR;
var PlayVidAtMIN;
var PlayVidAtSEC;
var Hlabel;
var Mlabel;
var Slabel;
var vidSpeed;
var vidSpeedlabel;
var TogDiv;
var div;
var FlipVidXBtn;
var vidFlippedY = false;
var vidFlippedX = false;
var res = "";
var flipY = 0;
var flipX = 0;

var p = document.getElementsByClassName('video-stream html5-main-video')[0];
var container = document.getElementById('watch7-user-header');

function stopvidload(){
    
    if (p){
        toggle = !toggle;
        
        if (toggle){
            
            btn.innerText = "Play Video";
            p.pause();
        }else{
            
            btn.innerText = "Stop Video";
            p.play();
        }
    } 
}

function seekForward(){
    var int = parseFloat(Tbox.value);
    if (Tbox.value !== "" && int > 0){
        p.currentTime += int;      
    }
}

function seekBackward(){
    
    var int = parseFloat(Tbox.value);
    
    if (Tbox.value !== "" && int > 0){
        p.currentTime -= int;      
    }
}

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}


function GetTimeURL(){
    var winLoc = window.location.href;
    
    if (winLoc.indexOf("#t=") > -1){
        winLoc = winLoc = winLoc.substring(0, winLoc.indexOf('#t='));
    }
    var cTime = winLoc + "#t=" + p.currentTime.toFixed(3).toString();
    copyToClipboard(cTime);
}

function HideAnnos(){
    
    var anno = document.getElementsByClassName('video-annotations iv-module')[0];
    togHideAnno =  !togHideAnno;
    
    if (togHideAnno){
        
        anno.style.display = 'none';
        HideAnnosBtn.innerText = "Show Annotations";
        
    }else{
        anno.style.display = 'block';
        HideAnnosBtn.innerText = "Hide Annotations";
    } 
}

function PlayVidAt(){
    var hour =  parseFloat(PlayVidAtHOUR.value);
    var min = parseFloat(PlayVidAtMIN.value);
    var sec = parseFloat(PlayVidAtSEC.value);
    p.currentTime = (hour*60*60) + (min*60) + (sec);
    p.play();
}

function ToggleDiv(){
    TogDiv = !TogDiv;
    
    if (TogDiv){
        div.style.display = "block";  
        CheckBox.value = ToggleONDivButtonText;
    }else{
        div.style.display = "none";  
        CheckBox.value = ToggleOFFDivButtonText;
    }
    
}


function flipVidX(amount){
    
    var rev;
    
    vidFlippedX = !vidFlippedX;
    
    if (vidFlippedX){
        
        FlipVidXBtn.innerText = "UnFlip X";
        rev = amount;
        flipX = amount;
    }else{
        
        FlipVidXBtn.innerText = "Flip X";
        rev = 0;
        flipX = 0;
    }
    
    var com = "transform: rotateX" + "(" + rev + "deg) " + "rotateY" + "(" + flipY + "deg);";
    p.setAttribute("style", com);
    
    
}


function flipVidY(amount){
    
    var rev;
    
    vidFlippedY = !vidFlippedY;
    
    if (vidFlippedY){
        
        FlipVidYBtn.innerText = "UnFlip Y";
        rev = amount;
        flipY = amount;
    }else{
        
        FlipVidYBtn.innerText = "Flip Y";
        rev = 0;
        flipY = 0;
    }
    
    var com = "transform: rotateX" + "(" + flipX + "deg) " + "rotateY" + "(" + rev + "deg);";
    
    p.setAttribute("style", com);
    
}

/*
function flipVid(f_axis, amount){
    
    var ax = f_axis.toLowerCase().trim();
    
    if (ax !== "y" && ax !== "x"){
        console.error("Invalid axis to rotate");
        return;
    }
    
    if (amount === 0){
        console.error("Flip is 0, increase value");
        return;
    }
    
    if (amount.indexOf("deg") > -1){
        amount = amount.replace("deg", "");   
    }
    
    //---------
    
   
    if (ax == "y"){
        
        vidFlippedY = !vidFlippedY;
        
        if (vidFlippedY){
            
            res = "rotate" + ax.toUpperCase() + "(" + amount + "deg);";
            FlipVidYBtn.innerText = "UnFlip " + ax.toUpperCase();
            
        }else{
            
            
            var com = "transform: rotate" + ax.toUpperCase() + "(" + amount + "deg) " + "rotateY" + ax
            res = "rotate" + ax.toUpperCase() + "(" + "0" + "deg);";
            FlipVidYBtn.innerText = "Flip " + ax.toUpperCase();
        }
        
        p.setAttribute("style", "transform: " + res);
        
    }else{
        
        vidFlippedX = !vidFlippedX;
        
        
        if (vidFlippedX){
            
            res = "rotate" + ax.toUpperCase() + "(" + amount + "deg);";
            FlipVidXBtn.innerText = "UnFlip " + ax.toUpperCase();
            
        }else{
            
            res = "rotate" + ax.toUpperCase() + "(" + "0" + "deg);";
            FlipVidXBtn.innerText = "Flip " + ax.toUpperCase();
        }
        
        p.setAttribute("style", "transform: " + res);
        
    } 
}

*/
//----------------------------------------------------------------------------------------------------
div = document.createElement('div');
div.id = 'myDiv';
div.setAttribute('style', 'margin-top: 10px; margin-bottom: 25px; display: none; border-top: 1px solid #EEEEEE; border-bottom: 1px solid #EEEEEE; width: 100%; margin-right: 20px; padding-top: 5px; padding-bottom: 5px;');
container.appendChild(div);
//----------------------------------------------------------------------------------------------------
btn = document.createElement('button');
btn.id = 'Play-Video';
btn.type = 'button';
btn.title =  'Play/Pause Video';
btn.className ='yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
btn.setAttribute('style', 'margin-left: 5px; display: inline;');
btn.innerText = "Stop Video";
div.appendChild(btn);
btn.addEventListener('click',stopvidload, true);
//----------------------------------------------------------------------------------------------------
SeekBBtn = document.createElement('button');
SeekBBtn.id = 'Seek-B-Increment';
SeekBBtn.type =  'button';
//SeekBBtn.title = 'Seek Backward';
SeekBBtn.className = 'yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
SeekBBtn.setAttribute('style', 'margin-left: 5px; width: 25px;');
SeekBBtn.innerText = "◄";
div.appendChild(SeekBBtn);
SeekBBtn.addEventListener('click',seekBackward, true);
//----------------------------------------------------------------------------------------------------
SeekFBtn = document.createElement('button');
SeekFBtn.id = 'Seek-F-Increment';
SeekFBtn.type =  'button';
//SeekBBtn.title = 'Seek Forward';
SeekFBtn.className = 'yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
SeekFBtn.setAttribute('style', 'margin-left: 5px; width: 25px;');
SeekFBtn.innerText = "►";
div.appendChild(SeekFBtn);
SeekFBtn.addEventListener('click',seekForward, true);
//----------------------------------------------------------------------------------------------------
Tbox = document.createElement('input');
Tbox.id = 'Increment-value';
Tbox.type ='number';
Tbox.setAttribute('style', 'margin-left: 5px; width: 35px; position: relative; top: 2px;');
Tbox.value = "1";
Tbox.min = "0";
Tbox.step = "0.1";
Tbox.setAttribute('maxlength', "5");
div.appendChild(Tbox);
//----------------------------------------------------------------------------------------------------
label = document.createElement('label');
label.id = 'Seek-Label';
label.type = 'text';
label.setAttribute('style', 'margin-left: 5px; position: relative; top: 2px;');
label.innerText = "secs";
div.appendChild(label);
//---------------------------------------------------------------------------------------------------
tURLBtn = document.createElement('button');
tURLBtn.id = 'tURLBtn';
tURLBtn.type =  'button';
tURLBtn.className = 'yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
tURLBtn.setAttribute('style', 'margin-left: 5px;');
tURLBtn.innerText = "Get URL at Current Time";
div.appendChild(tURLBtn);
tURLBtn.addEventListener('click',GetTimeURL, true);
//----------------------------------------------------------------------------------------------------
HideAnnosBtn = document.createElement('button');
HideAnnosBtn.id = 'HideAnnos';
HideAnnosBtn.type =  'button';
HideAnnosBtn.className = 'yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
HideAnnosBtn.setAttribute('style', 'margin-left: 5px;');
HideAnnosBtn.innerText = "Hide Annotations";
div.appendChild(HideAnnosBtn);
HideAnnosBtn.addEventListener('click',HideAnnos, true);
//----------------------------------------------------------------------------------------------------
playVidAtBtn = document.createElement('button');
playVidAtBtn.id = 'playVidAtBtn';
playVidAtBtn.type =  'button';
playVidAtBtn.className = 'yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
playVidAtBtn.setAttribute('style', 'margin-left: 5px;');
playVidAtBtn.innerText = "Play Video At";
div.appendChild(playVidAtBtn);
playVidAtBtn.addEventListener('click',PlayVidAt, true);
//----------------------------------------------------------------------------------------------------
PlayVidAtHOUR = document.createElement('input');
PlayVidAtHOUR.id = 'PlayVidAtHOUR';
PlayVidAtHOUR.type ='number';
PlayVidAtHOUR.setAttribute('style', 'margin-left: 5px; width: 35px; position: relative; top: 2px;');
PlayVidAtHOUR.value = "0";
PlayVidAtHOUR.min = "0";
PlayVidAtHOUR.setAttribute('maxlength', "5");
div.appendChild(PlayVidAtHOUR);
//----------------------------------------------------------------------------------------------------
Hlabel = document.createElement('label');
Hlabel.id = 'Hlabel';
Hlabel.type = 'text';
Hlabel.setAttribute('style', 'margin-left: 5px; position: relative; top: 2px;');
Hlabel.innerText = "hrs";
div.appendChild(Hlabel);
//---------------------------------------------------------------------------------------------------
PlayVidAtMIN = document.createElement('input');
PlayVidAtMIN.id = 'PlayVidAtMIN';
PlayVidAtMIN.type ='number';
PlayVidAtMIN.setAttribute('style', 'margin-left: 5px; width: 35px; position: relative; top: 2px;');
PlayVidAtMIN.value = "0";
PlayVidAtMIN.min = "0";
PlayVidAtMIN.setAttribute('maxlength', "5");
div.appendChild(PlayVidAtMIN);
//----------------------------------------------------------------------------------------------------
Mlabel = document.createElement('label');
Mlabel.id = 'Mlabel';
Mlabel.type = 'text';
Mlabel.setAttribute('style', 'margin-left: 5px; position: relative; top: 2px;');
Mlabel.innerText = "mins";
div.appendChild(Mlabel);
//---------------------------------------------------------------------------------------------------
PlayVidAtSEC = document.createElement('input');
PlayVidAtSEC.id = 'PlayVidAtMIN';
PlayVidAtSEC.type ='number';
PlayVidAtSEC.setAttribute('style', 'margin-left: 5px; width: 35px; position: relative; top: 2px;');
PlayVidAtSEC.value = "0";
PlayVidAtSEC.min = "0";
PlayVidAtSEC.setAttribute('maxlength', "5");
div.appendChild(PlayVidAtSEC);
//----------------------------------------------------------------------------------------------------
Slabel = document.createElement('label');
Slabel.id = 'Slabel';
Slabel.type = 'text';
Slabel.setAttribute('style', 'margin-left: 5px; position: relative; top: 2px;');
Slabel.innerText = "secs";
div.appendChild(Slabel);
//---------------------------------------------------------------------------------------------------
vidSpeedlabel = document.createElement('label');
vidSpeedlabel.id = 'vidSpeedlabel';
vidSpeedlabel.type = 'text';
vidSpeedlabel.setAttribute('style', 'margin-left: 5px; position: relative; top: 2px; display: inline-block;');
vidSpeedlabel.innerText = "Playback Rate";
div.appendChild(vidSpeedlabel);
//-------------------------------------------------------------------------------------------------------
vidSpeed = document.createElement('input');
vidSpeed.id = 'vidSpeed';
vidSpeed.type ='number';
vidSpeed.setAttribute('style', 'margin-left: 5px; margin-top: 5px; width: 45px; position: relative; top: 2px; display: inline;');
vidSpeed.value = "1";
vidSpeed.min = "0";
//vidSpeed.max = "2";
vidSpeed.setAttribute('maxlength', "5");
vidSpeed.setAttribute('step', "0.1");
div.appendChild(vidSpeed);
//---------------------------------------------------------------------------------------------------
CheckBox = document.createElement('input');
CheckBox.id = 'myCheckbox';
CheckBox.type = 'button';
CheckBox.title =  'Show/Hide Custom Video Tools';
CheckBox.className ='yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
CheckBox.setAttribute('style', 'Border-Bottom-Left-Radius: 0px; !important; Border-Top-Left-Radius: 0px; !important; margin: -1px !important;');
CheckBox.value = ToggleOFFDivButtonText;
var parent = document.getElementById('watch7-subscription-container');
parent.appendChild(CheckBox);
CheckBox.addEventListener('click', ToggleDiv, true);
//----------------------------------------------------------------------------------------------------
FlipVidYBtn = document.createElement('button');
FlipVidYBtn.id = 'FlipVidYBtn';
FlipVidYBtn.type =  'button';
FlipVidYBtn.className = 'yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
FlipVidYBtn.setAttribute('style', 'margin-left: 5px;');
FlipVidYBtn.innerText = "Flip Y";
div.appendChild(FlipVidYBtn);
FlipVidYBtn.addEventListener('click', function(){flipVidY("180");}, true);
//----------------------------------------------------------------------------------------------------
FlipVidXBtn = document.createElement('button');
FlipVidXBtn.id = 'FlipVidXBtn';
FlipVidXBtn.type =  'button';
FlipVidXBtn.className = 'yt-subscription-button yt-uix-button yt-uix-button-subscribe-branded';
FlipVidXBtn.setAttribute('style', 'margin-left: 5px;');
FlipVidXBtn.innerText = "Flip X";
div.appendChild(FlipVidXBtn);
FlipVidXBtn.addEventListener('click', function(){flipVidX("180");}, true);
//----------------------------------------------------------------------------------------------------
if (showOnPageLoad){
    div.style.display = "block";
    CheckBox.value = ToggleONDivButtonText;
    TogDiv = true;
}else{
    div.style.display = "none";  
    CheckBox.value = ToggleOFFDivButtonText;
}
//----------------------------------------------------------------------------------------------------
p.onpause = function(){btn.innerText = "Play Video"; toggle = true;};
p.onplay = function(){btn.innerText = "Stop Video"; toggle = false;};
vidSpeed.onchange = function(){p.playbackRate = parseFloat(vidSpeed.value);};

Tbox.onchange = function(){
    var val = parseFloat(Tbox.value);
    
    if (val < 2){
        Tbox.step = "0.1";
        
    }else{
        Tbox.step = "1";
    }
};
