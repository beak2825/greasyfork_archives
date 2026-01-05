// ==UserScript==
// @name LNK_siwi_flag
// @namespace http://www.yaroslav-art.com.ua/lnk/
// @version 1.05
// @description Скрипт додає в SIWIDATA  прапори та оповіщення при стрільбі улюблених спортсменів
// @author LnKOx
// @match http://biathlonresults.com/
// @match http://live.siwidata.com/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/25389/LNK_siwi_flag.user.js
// @updateURL https://update.greasyfork.org/scripts/25389/LNK_siwi_flag.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';
    function prefresh(){
        setTimeout(prefresh, 1000);
        if (flag_enable!=1){return;}
        var elems = document.getElementsByClassName('au-target colNat');
        var country;
        for(var i=0; i<elems.length; i++)
        {
            country=elems[i].innerHTML;
            if (country.length==3)
            {
                elems[i].style='color:rgba(0,0,0,0); width: 28px;  background: url("http://www.yaroslav-art.com.ua/lnk/flags/24/'+country+'.png") no-repeat;';
            }
            else
            {
                elems[i].style='background: none;';
            }
        }
    }
    function shoot_refresh()
    {
        setTimeout(shoot_refresh, 500);
        try {
        var npshoot=0;
        var shootrange = document.getElementsByClassName('colTarget')[0].parentNode.parentNode.parentNode.innerHTML;
        var myshoot=document.getElementById('myshoot');
        myshoot.innerHTML=shootrange;
        var toremove=myshoot.getElementsByClassName('rtHeader')[0];
        toremove.parentNode.removeChild(toremove);
        var elemshoot = myshoot.getElementsByClassName('au-target colNat');
        for(var zq=0; zq<elemshoot.length; zq++)
        {
            if (elemshoot[zq].className=="au-target colNat highlight")
            {
                if (target_enable==1)
                {
                    elemshoot[zq].parentNode.style="top:"+npshoot+"px";
                }
                else
                {
                    elemshoot[zq].parentNode.parentNode.removeChild(elemshoot[zq].parentNode);
                    zq--;
                }
                npshoot=npshoot+21;
            }
            else
            {
                elemshoot[zq].parentNode.parentNode.removeChild(elemshoot[zq].parentNode);
                zq--;
            }
        }
        if (old_npshoot<npshoot)  soundplay(); 
        old_npshoot=npshoot;
        } catch(e) { var gf=0; }
    }
    function soundplay() {
        if (sound_enable!=1) return;
        var audio = new Audio(); 
        audio.src = 'http://www.yaroslav-art.com.ua/lnk/flags/ring2.mp3';
        audio.autoplay = true; 
    } 

    function addshootdiv()
    {
        var d=document.createElement('div');
        d.style="position: absolute; z-index:54; background-color: white; width:250px;  ";
        d.id="myshoot";
        document.body.appendChild(d);
        var q=document.createElement('div');
        q.style="position: absolute; z-index:55; width:75px; height:25px; ";
        q.id="mybut";
        q.innerHTML='<img  align="left" onclick="flag_onoff();" id="flagonoff" > <img onclick="sound_onoff();" id="soundonoff"  align="left" > <img onclick="target_onoff();" id="targetonoff"  align="left" >';
        document.body.appendChild(q);
        var nScript = document.createElement("script");
        nScript.type = "text/javascript";
        nScript.text = "var flag_enable=1; \
var sound_enable=1; \
var target_enable=1;\
var old_npshoot=0; \
function flag_onoff() { \
if (flag_enable==1){flag_enable=0;} else {flag_enable=1;}; \
localStorage.setItem('flag_enable', flag_enable); \
if (flag_enable==1) {document.getElementById('flagonoff').src='http://www.yaroslav-art.com.ua/lnk/flags/flag_on.png';}else{document.getElementById('flagonoff').src='http://www.yaroslav-art.com.ua/lnk/flags/flag_off.png';};   }; \
function sound_onoff(){ \
if (sound_enable==1){sound_enable=0;} else {sound_enable=1;}; \
localStorage.setItem('sound_enable', sound_enable); \
if (sound_enable==1) {document.getElementById('soundonoff').src='http://www.yaroslav-art.com.ua/lnk/flags/sound_on.png';} else {document.getElementById('soundonoff').src='http://www.yaroslav-art.com.ua/lnk/flags/sound_off.png';} ;}; \
function target_onoff(){ \
if (target_enable==1){target_enable=0;} else {target_enable=1;}; \
localStorage.setItem('target_enable', target_enable);  \
if (target_enable==1) {document.getElementById('targetonoff').src='http://www.yaroslav-art.com.ua/lnk/flags/target_on.png';}else{document.getElementById('targetonoff').src='http://www.yaroslav-art.com.ua/lnk/flags/target_off.png';};};  ";

        document.body.appendChild(nScript);
    }
    function read_set()
    {
        flag_enable=localStorage.getItem("flag_enable");
        target_enable=localStorage.getItem("target_enable");
        sound_enable=localStorage.getItem("sound_enable");
        if (flag_enable==1) {document.getElementById('flagonoff').src="http://www.yaroslav-art.com.ua/lnk/flags/flag_on.png";}else{document.getElementById('flagonoff').src="http://www.yaroslav-art.com.ua/lnk/flags/flag_off.png";}
        if (sound_enable==1) {document.getElementById('soundonoff').src="http://www.yaroslav-art.com.ua/lnk/flags/sound_on.png";}else{document.getElementById('soundonoff').src="http://www.yaroslav-art.com.ua/lnk/flags/sound_off.png";}
        if (target_enable==1) {document.getElementById('targetonoff').src="http://www.yaroslav-art.com.ua/lnk/flags/target_on.png";}else{document.getElementById('targetonoff').src="http://www.yaroslav-art.com.ua/lnk/flags/target_off.png";}

    }

    addshootdiv();
    read_set();
    prefresh();
    shoot_refresh();

    // Your code here...
})();