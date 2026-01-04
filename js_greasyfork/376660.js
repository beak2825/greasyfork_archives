// ==UserScript==
// @name        Youtube.com - Save current timestamp 
// @namespace   https://www.youtube.com/2
// @description Save the playing position of the currently played video as a timestamp, attached to the videos URL (Like to share an video with a timemark). 
// @include     http*://www.youtube.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at      document-end
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_getMetadata
// @version 0.0.1.20190128211941
// @downloadURL https://update.greasyfork.org/scripts/376660/Youtubecom%20-%20Save%20current%20timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/376660/Youtubecom%20-%20Save%20current%20timestamp.meta.js
// ==/UserScript==

var Auswahl = "Sofort"; // Choose between "Sofort" (When video is playing) and "Verzoegert" (Instantly without video is being played)


var Knopf = document.createElement("div");
Knopf.innerHTML = "Stelle speichern";
Knopf.id        = "Youtube_savecurrenttimestamp";
Knopf.addEventListener("click", function() { Speicherauswahl(Auswahl); }, false);
Knopf.style.float = "right";
Knopf.style.color = "#000000";
Knopf.style.background = "#F8F8F8";
Knopf.style.border = "1px solid #CCCCCC";
Knopf.style.height = "14px";
Knopf.style.padding = "4px";
Knopf.style.margin = "8px 0px 0px 4px";
Knopf.align = "center";
Knopf.style.display = "inline-block";
Knopf.style.cursor = "pointer";

var Stelle = document.getElementsByClassName("style-scope ytd-menu-renderer style-default size-default force-icon-button")[1]; 
Stelle.after(Knopf);

function Speicherauswahl (Auswahl)
{
switch (Auswahl)
    {
    case "Sofort":
        stellespeichern2();
        break;
    case "Verz�gert":
        stellespeichern();
        break;
    }
}

function stellespeichern2()
{
/* 
 * Source
   URL    : https://stackoverflow.com/q/12915018
   Site   : Stackoverflow.com
   User   : Strannik
   Comment: Thank you so much for this code
*/   

var Zeit = document.getElementsByClassName('video-stream')[0];
timenow = Zeit.currentTime;

if (timenow != "0")
    {
    if (parseInt(timenow)/60>=1) 
        {
        var h = Math.floor(timenow / 3600);
        timenow = timenow - h * 3600;               
        var m = Math.floor(timenow / 60);
        var s = Math.floor(timenow % 60);
        
        if(h.toString().length<2)
            {
            h='0'+h;
            }
            
        if(m.toString().length<2)
            {
            m='0'+m;
            }
            
        if(s.toString().length<2)
            {
            s='0'+s;
            }
            
        Zeit = h + "h" + m + "m" + s + "s";         
        } 
    else 
        {
        var m = Math.floor(timenow / 60);
        var s = Math.floor(timenow % 60);
        
        if(m.toString().length<2)
            {
            m='0'+m;
            }
            
        if(s.toString().length<2)
            {
            s='0'+s;
            }
            
        Zeit = m + "m" + s + "s";   
        }
        
    Zeitspeichern(Zeit);
    }
}

function stellespeichern()
{
if ( $(" .yt-uix-form-input-checkbox-element" ).length ) 
    { 
    $(" .yt-uix-form-input-checkbox-element ")[0].click();
    var Zeit = $(" .yt-uix-form-input-text.share-panel-start-at-time ")[0].value;

    var Zeitpunkte = Zeit.split(":").length -1
    
    if (Zeitpunkte == "2")
        {
        Zeit = Zeit.replace(":","h");
        Zeit = Zeit.replace(":","m");
        }
    else if (Zeitpunkte == "1")
        {
        Zeit = Zeit.replace(":","m");
        }
        
    Zeitspeichern(Zeit + "s");
    }
else
    {
    $(" .yt-uix-button.yt-uix-button-size-default.yt-uix-button-opacity.yt-uix-button-has-icon.no-icon-markup.pause-resume-autoplay.action-panel-trigger.action-panel-trigger-share.yt-uix-tooltip ")[0].click();
    }  
}

function Zeitspeichern(Zeit)
{
    var Adresse = window.location.href;
    Adresse = Adresse.split("&t=");
    Adresse = Adresse[0] + "&t=" + Zeit;

    window.location.href = Adresse;    
}