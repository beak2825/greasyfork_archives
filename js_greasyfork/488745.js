// ==UserScript==
// @name         Erweiterung (Rest time) für das gesehene Videos ausblenden oder markieren
// @namespace    https://basti1012.bplaced.net
// @version      2.1
// @description  zeigt an wie viel Restzeit ein Video läuft,
// auch wenn der Player schneller läuft, wird die Zeit mitgerechnet
// Dieses Script wurde von 4lrick geschrieben (YouTube - Remaining time).
// Ich hatte mir zwar auch eine Version erstellt. Aber seine läuft besser
// @author       4lrick . Für mein YouTube Script umgebaut von basti1012 als Erweiterung
// @allFrames           true
// @run-at document-end
// @license MIT License
// @noframes
// @icon        https://basti1012.de/images/favicon.png
// ==/UserScript==

if(!console_log_value){
    var console_log_value = [];
}
var start2 = performance.now();
if(!array_localsdtorage){
    var array_localsdtorage=[];
}
if(!erweiterungs_einstellungs_array){
    var erweiterungs_einstellungs_array=[];
}
array_localsdtorage.push(["rest_zeit_einblenden", false]);
function rest_lauf_zeit_anzeigen(){
    if(localStorage.getItem('rest_zeit_einblenden')=='true'){
        // beginn Script from 4lrick


            const styleTag4 = document.createElement('style');
            styleTag4.id='BASTI1012_ERWEITERUNG_RESTTIME';
            styleTag4.innerHTML = `
            span#resttime_anzeige_tooltip {
                margin: -100px 0 0 -220px;
                position: absolute;
                line-height: 12px;
                border-radius: 5px;
                display:none;
                padding:10px;
                width: 160px;
                z-index: 11111;
                background: rgba(2,2,2,0.8);
                color: white;
            }
            span#resttime_anzeige:hover #resttime_anzeige_tooltip {
                display:block;
            }`;
            document.body.appendChild(styleTag4);

function displayTime(hhh){
    var heute;
    Date.prototype.addSecs = function (s) {
        this.setTime(this.getTime() + (s * 1000));
        return this;
    }
    heute = new Date();
    heute.addSecs(hhh);

     var StundenZahl = heute.getHours();
     var MinutenZahl = heute.getMinutes();
     var SekundenZahl = heute.getSeconds();

    if(StundenZahl < 10 ){
        StundenZahl="0" + StundenZahl;
    }
     if (MinutenZahl < 10) {
          MinutenZahl = "0" + MinutenZahl;
     }
     if (SekundenZahl < 10) {
          SekundenZahl = "0" + SekundenZahl;
     }
     return StundenZahl +' : '+ MinutenZahl +' : '+ SekundenZahl;
}


let restzeit_timer;
        let init = false;
        let timeDisplay;
    //    let resttime_anzeige;
     //   let resttime_anzeige_tooltip;
        function displayRemainingTime() {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                const timeRemaining = (videoElement.duration - videoElement.currentTime) / videoElement.playbackRate;
                const endtime=displayTime(timeRemaining);
            //    console.log(endtime);
                const hours = Math.floor(timeRemaining / 3600);
                const minutes = Math.floor((timeRemaining % 3600) / 60);
                const seconds = Math.floor(timeRemaining % 60);
                const isLive = document.querySelector('.ytp-live');
                const viewLiveCount = document.querySelector('span[dir="auto"].bold.style-scope.yt-formatted-string');
                const isEmbed = window.location.href;
             //   timeDisplay.title='Video endet um '+endtime+' Uhr';
                if ((viewLiveCount !== null && viewLiveCount.textContent.trim() !== "watching now") || isEmbed.includes("youtube.com/embed") && !isLive) {
                    timeDisplay.innerHTML = `<span id="resttime_anzeige"> (${hours > 0 ? `${hours}:` : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds})<span id="resttime_anzeige_tooltip">Video endet um ${endtime}</span></span>`;
                 //   document.getElementById('resttime_anzeige').innerHTML=`(${hours > 0 ? `${hours}:` : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;
                 //   document.getElementById('resttime_anzeige_tooltip').innerHTML=`Video endet um ${endtime}`;
                } else {
                    timeDisplay.textContent = null;
                }
            }
         //   requestAnimationFrame(displayRemainingTime);
            restzeit_timer=setTimeout(function(){
                displayRemainingTime();
            },1000)
        }
        function initDisplay() {
            timeDisplay = document.createElement('div');
            timeDisplay.style.display = 'inline-block';
            timeDisplay.style.marginLeft = '10px';
            timeDisplay.style.color = '#ddd';
            const timeContainer = document.querySelector('.ytp-time-display');
            if (timeContainer) {
                 //      timeDisplay.innerHTML = `<span id="resttime_anzeige"> <span id="resttime_anzeige_tooltip"></span></span>`;
                timeContainer.appendChild(timeDisplay);
                init = true;
            }
        }
        function checkVideoExists() {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                if (!init) {
                    initDisplay();
                }
              //  clearTimeout(restzeit_timer)
                videoElement.onplaying = displayRemainingTime;
            }
        }
        const observer = new MutationObserver(checkVideoExists);
        const body = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(body, config);
        // end script from 4lrick
        return 1;
    }else{
        return 2;
    }
    return 3;
}
var checkboxerweiterungrestzeitaktivieren;
if(localStorage.getItem('rest_zeit_einblenden')=='true'){
    checkboxerweiterungrestzeitaktivieren ='checked="true"';
}else{
    checkboxerweiterungrestzeitaktivieren ='';
}
if(!erweiterungs_einstellungs_array){
    erweiterungs_einstellungs_array = [];
}
erweiterungs_einstellungs_array.push(['restzeit_anzeigen',`
<label>
    <label style="display:flex;flex-direction:column">
        <p>
            <strong>Restzeit anzeigen </strong>
            <input type="checkbox" id="rest_laufueit" ${checkboxerweiterungrestzeitaktivieren}>
            <span>?
                <small>
                    Mit dieser Funktion wird im Player neben der Abgelaufene und Endzeit noch die Restlaufzeit angezeigt<br>
					Auch wenn sie den Player schneller oder langsamer laufen lassen, wird dies mit berechnet
                </small>
            </span>
        </p>
    </label>
</label>     <hr style="height:3px;background:black">`]);
if(!array_script){
	var array_script=[];
}
array_script.push([`
    var restlaufzeit_var=document.getElementById('rest_laufueit')
    restlaufzeit_var.addEventListener('click',function(u){
        if(restlaufzeit_var.checked==true){
            localStorage.setItem('rest_zeit_einblenden',true);
        }else{
            localStorage.setItem('rest_zeit_einblenden',false);
        }
    })
`]);
if(localStorage.getItem('rest_zeit_einblenden')){
    var restlaufzeit=rest_lauf_zeit_anzeigen();
	var console_rest_lauf_zeit='_____';
    var console_rest_lauf_zeit_per='_____';
    if(restlaufzeit==1){
        //console.log('%cRestlaufzeit aktiviert'+ (performance.now() - start2) + ' ms.','color:green');
		console_rest_lauf_zeit='Restlaufzeit aktiviert';
        console_rest_lauf_zeit_per=''+(performance.now() - start2) + ' ms.';
    }else if(restlaufzeit==2){
        //console.log('%cRestlaufzeit deaktiviert'+ (performance.now() - start2) + ' ms.','color:orange');
		console_rest_lauf_zeit='Restlaufzeit deaktiviert';
        console_rest_lauf_zeit_per=''+(performance.now() - start2) + ' ms.';
    }else{
        //console.log('%cRestlaufzeit error'+ (performance.now() - start2) + ' ms.','color:red');
	    console_rest_lauf_zeit='Restlaufzeit error';
        console_rest_lauf_zeit_per=''+(performance.now() - start2) + ' ms.';
    }
}

console_log_value.push({
    name: console_rest_lauf_zeit,
    wert: console_rest_lauf_zeit_per
});
