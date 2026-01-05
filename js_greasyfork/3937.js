// ==UserScript==
// @name         YouTube Annotation Ripper
// @namespace    http://www.diamonddownload.weebly.com
// @version      1.3.2
// @description  Appends the each annotation text to a textbox box below the video for easy copying.
// @include      *youtube.*/watch?v=*
// @copyright    2014+, RGSoftware
// @run-at       document-body
// @author       R.F Geraci
// @grant        GM_notification
// @icon64       http://icons.iconarchive.com/icons/simekonelove/modern-web/64/youtube-icon.png
// @downloadURL https://update.greasyfork.org/scripts/3937/YouTube%20Annotation%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/3937/YouTube%20Annotation%20Ripper.meta.js
// ==/UserScript==

var apParent, Anno, cDiv,i, txtbox, Interval,
    TextboxWidth, TextboxHeight, TextboxMargin,
    TextboxResize, TextboxBorder, TextboxOutline,
    InitialMsg, TextboxReadOnly, CompletedAnnotationNewClassName,
    MissingHTMLErrorMsg, IdleButtonImage, ToggleButtonParent,
    ToggleButton, ButtonImage, Ton = false, ActiveButtonImage,
    HoverButtonImage, Shown = false, TextboxPadding, Title;

//=========================CUSTOM SETTINGS==========================================================

Interval = 1000;
TextboxWidth = "99%";
TextboxHeight = "95%";
TextboxResize = "none";
TextboxBorder = "none";
TextboxOutline = "none";
TextboxReadOnly = "true";
InitialMsg = "‒‒‒‒‒‒‒‒‒ Annotations from the video will appear here ‒‒‒‒‒‒‒‒‒";
MissingHTMLErrorMsg = "A YouTube element is missing or has been renamed. 'YouTube Annotation Grabber' code must be updated.";
CompletedAnnotationNewClassName = "inner-done-text";
IdleButtonImage = "https://i.imgur.com/e4QIe2b.png";
ActiveButtonImage = "https://i.imgur.com/1xqKemW.png";
HoverButtonImage = "https://i.imgur.com/VWqFE5l.png";

//===================================================================================================

//--------------------------------------
function CreateElements(){    
    
    apParent = document.getElementById('watch7-content');
    
    Anno = document.getElementsByClassName('inner-text');
    
    Title = document.createElement("p");
    Title.innerText = InitialMsg;
    Title.setAttribute('style', 'z-index: -1; text-align: center; padding: 0px; position: relative; top: -50px; height: 0px; -webkit-transition: top 1s, padding 1s, height 1s;');
    apParent.insertBefore(Title, apParent.firstChild);
    
    cDiv = document.createElement('div');
    cDiv.id = 'cDiv';
    cDiv.setAttribute('style', 'width: 100%; -webkit-transition: height 1s; text-align: center; height: 0px; background: white; display: block; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,.1); text-align: center;'); //border-bottom: 1px solid #E6E6E6; //border-top: 1px solid #E6E6E6; border-bottom: 1px solid #E6E6E6;
    apParent.insertBefore(cDiv, apParent.childNodes[1]);
    
    txtbox = document.createElement('textarea');
    txtbox.id = 'cDivTxtBox';
    txtbox.setAttribute('readonly', TextboxReadOnly);
    txtbox.setAttribute('style', 'width: '+ TextboxWidth +';' + 'height: ' + TextboxHeight + ';' + 'resize: ' +TextboxResize + ';' + 'border: ' + TextboxBorder + ';' + 'outline: ' + TextboxOutline + ';');
    cDiv.appendChild(txtbox);
}
//--------------------------------------
function getAnno(){
    
    for (i=0; i<Anno.length; i++){
        
        if (Anno[i].innerHTML != ""){
            txtbox.value += Anno[i].innerHTML + "\n\n"; 
            Anno[i].className = CompletedAnnotationNewClassName;
        }  
    }
}
//--------------------------------------
function CreateToggle(){
    
    ToggleButtonParent = document.getElementById('watch8-secondary-actions');  //watch-like-dislike-buttons
    ToggleButton = document.createElement('button');
    ToggleButton.id = 'ToggleAnno';
    ToggleButton.type = 'button';
    ToggleButton.innerHTML = '';
    ToggleButton.setAttribute('style', 'outline: none; padding: 0px 10px; vertical-align: middle; display: inline-block; position: relative; top: 3px;');
    ToggleButton.title = 'Enable/Disable Annotation Ripping';
    ToggleButtonParent.appendChild(ToggleButton);  
    
    ButtonImage = document.createElement('img');  
    ButtonImage.setAttribute("style", "width: 25px; opacity: 0.8;");
    ButtonImage.alt = 'Toggle Annotation Ripping';
    ButtonImage.src = IdleButtonImage;
    ToggleButton.appendChild(ButtonImage);   
}
//--------------------------------------
function Tmsg(message, title){
    GM_notification(message, title);   
}
//--------------------------------------
if (document.getElementById('watch7-content') == undefined){
    Tmsg(MissingHTMLErrorMsg, "YouTube Annotation Grabber Error");
}else{  
    CreateToggle();
}
//--------------------------------------
function HideElements(){
    
    cDiv.style.height = "0px";
    Title.style.top = "-50px";
    Title.style.padding = "0px";
    Title.style.height = "0px";
}
//--------------------------------------
function ShowElements(){
    cDiv.style.height = "150px";
    Title.style.top = "0px";
    Title.style.padding = "10px";
    Title.style.height = "10px";
}
//--------------------------------------
if (!Shown){
    CreateElements();
    window.setInterval(getAnno, Interval); 
}

ToggleButton.onclick= function(){
    Ton = !Ton;
    if (Ton){
        ShowElements();
        Shown =  true;
    }else{
        HideElements();
        ButtonImage.src = IdleButtonImage;
    }
};

ToggleButton.onmousedown= function(){
    ButtonImage.src = ActiveButtonImage;
};
//--------------------------------------
ToggleButton.onmouseover = function(){
    ButtonImage.src = HoverButtonImage;
};
//--------------------------------------
ToggleButton.onmouseout = function(){
    
    if (Ton){
        ButtonImage.src = ActiveButtonImage;
    }else{ 
        ButtonImage.src = IdleButtonImage;
    }  
};
//--------------------------------------