// ==UserScript==
// @name         PanzerRush - Online
// @namespace    https://www.panzerrush.com/
// @version      0.1
// @description  try to stay online. BETA
// @author       Chillchef
// @match        http*://www.panzerrush.*
// @include      http*://www.panzerrush.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372994/PanzerRush%20-%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/372994/PanzerRush%20-%20Online.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lv = 0;
    var cnt = 0;
    var dt = null;
    var gestartet = false;
    var chatten = null;
    var kbdEv = null;
    var mouseEv = null;
    var mouseX = 0;
    var mouseY = 0;
    //document.body.oncontextmenu = null;
    //document.body.onselectstart = null;

    setTimeout(function(){login();},3000);
    setTimeout(function(){start();},6000);

    function start()
    {
        chatten = document.getElementById("chatten");
        if(!chatten)
        {
            lv = lv + 1;
            console.log("Lade-Versuch " + lv);
            setTimeout(function(){start();},1000);
        }
        else
        {
            try
            {
                dt = new Date();

                if(!kbdEv)
                {
                    chatten.maxLength="1000";
                    document.onmousemove=function(e){mouseX = e.pageX; mouseY = e.pageY;};

                    kbdEv = document.createEvent('KeyboardEvent');
                    kbdEv.initKeyEvent( 'keydown', true, true, window, false, false, false, false, 13, 0); //13 = [Enter]
                    chatten.value = "Start am " + dt.toLocaleDateString() + " um " + dt.toLocaleTimeString();
                }
                else
                {
                    cnt = cnt + 1;
                    //chatten.value = cnt + ". Refresh um " + dt.toLocaleTimeString();
                    var alt = chatten.value;
                    chatten.value = "";
                }

                chatten.visibility = "visible";
                chatten.focus();
                document.body.dispatchEvent(kbdEv);
                document.dispatchEvent(kbdEv);
                chatten.visibility = "hidden";
                if(alt)
                {
                    chatten.visibility = "visible";
                    chatten.value = "%! " + alt;
                    chatten.focus();
                }
                

                setTimeout(function(){mausKlick();},5000);
                setTimeout(function(){start();},110000);
            }
            catch(ex)
            {
                console.warn("fehler in start:", ex);
            }
        }
    }

    function mausKlick()
    {
        try
        {
            document.body.style.cursor = 'pointer';
            if(!mouseEv)
            {
                mouseEv = document.createEvent("MouseEvents");
                //event.initMouseEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
                mouseEv.initMouseEvent('click', true, true, window, 0, 0, 0, mouseX, mouseY, false, false, false, false, 0, null);
                console.log("Mouse-Event angelegt...");
            }
            else
            {
                console.log("klick auf X_" + mouseX + " Y_" + mouseY + " !!");
                var c = document.getElementById("canvasa");
                c.style.cursor = 'pointer';
                c.focus();
                c.dispatchEvent(mouseEv);
                c.style.cursor = 'default';
                document.body.dispatchEvent(mouseEv);
                document.dispatchEvent(mouseEv);
            }
            try
            {
                document.getElementById("fragebox").style.visibility = "hidden";
                document.getElementById("hintbox").style.visibility = "hidden";
            }
            catch(ex)
            {
                console.log("fehler in ", ex);
            }
            document.body.style.cursor = 'default';
            setTimeout(function(){mausKlick();},10000);
        }
        catch(ex)
        {
            console.warn("Maus-Klick-Error: ", ex);
        }
    }

    function login()
    {
        try
        {
            var name = document.getElementById("loginname").value;
            var pass = document.getElementById("loginpass").value;
            var ok = document.getElementById("bigbutton");
            if(name && pass && ok)
            {
                ok.click();
                console.log("Login ok");
                return true;
            }
            console.log("Login fehler");
        }
        catch(ex)
        {
            console.log("fehler!!! Login nicht möglich!", ex);
            return false;
        }
    }
})();

