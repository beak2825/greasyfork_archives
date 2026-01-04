// ==UserScript==
// @name         ING DiBa Login keepAlive
// @namespace    https://*.ing-diba.*
// @version      0.8.3
// @description  try to keep login alive... Das Script setzt die "Automatische LogOut-Funktion" der ING (ehem. DiBa) Banking Site außer Kraft. Die Seite bleibt so lange online, bis man sich selber abmeldet. Die Watchlist aktualisiert ohne Unterbrechung (Kursaktualisierung muss nicht mehr manuell angestoßen werden). Hauseigene Werbung wird ebenfalls versucht auszublenden (Angebote, Kredite etc.)
// @author       Chillchef
// @include      https://wertpapiere.ing.*
// @include      https://banking.ing.*
// @XincludeX    *://*.ing.*/*
// @grantX       none
// @license      MIT
/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @run-at       document-idle
*/
// @downloadURL https://update.greasyfork.org/scripts/371772/ING%20DiBa%20Login%20keepAlive.user.js
// @updateURL https://update.greasyfork.org/scripts/371772/ING%20DiBa%20Login%20keepAlive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //initEvents();

    if(window.debugOutput !== undefined)
    {
        window.debugOutput = true;
    }
    //setTimeout(function(){restoreConsole();},400);
    log("ING KeepAlive Script start:");
    log(document.location);

    var cnt = 0;
    var hBckup = new Object();
    var d = document;
    var t = 100000;
    setTimeout(function(){refreshLogin();},t);
    setTimeout(function(){refreshPopup();},t);


    var classesToHide = new Object();
    classesToHide[0] = ["ghost-account","0"];
    classesToHide[1] = ["hint sales-signals sales-signals--wide gap-top-2-lg sales-signals__teaser","0"];
    classesToHide[2] = ["hint sales-signals sales-signals--wide","0"];
    classesToHide[3] = ["modal modal--open","0"];
    classesToHide[4] = ["hint sales-signals sales-signals--wide","0"];
    classesToHide[5] = ["hint sales-signals","0"];
    classesToHide[6] = ["insight insight--ghost","0"];
    classesToHide[7] = ["insight insight--teaser","0"];
    classesToHide[8] = ["insight-modal","0"];
    classesToHide[9] = ["u-print-hidden","2"];
    classesToHide[10] = ["insight insight--slider","0"];
    classesToHide[11] = ["insight","0"];
    classesToHide[12] = ["insight insight--elevated","0"];
    classesToHide[13] = ["announcement","0"];
    classesToHide[14] = ["sh-title-arrow-box","0"];
    //classesToHide[15] = ["xxx","0"];
    //classesToHide[16] = ["xxx","0"];
    //classesToHide[17] = ["xxx","0"];
    //classesToHide[18] = ["xxx","0"];
    //classesToHide[19] = ["xxx","0"];
    //classesToHide[20] = ["xxx","0"];

    //window.addEventListener('DOMContentLoaded', sorryBro());
    //window.addEventListener('DOMContentLoaded', styleStart());
    window.addEventListener('DOMContentLoaded', TimerStart());


    function TimerStart()
    {
        setTimeout(function(){styleStart();},500);
        setTimeout(function(){sorryBro();},500);
    }


    function log(txt)
    {
        var dt = new Date();
        console.log(dt.toLocaleString()+ "." + dt.getMilliseconds() + " " + txt);
    }

    function initEvents()
    {
        log("initEvents()");

        //test1
        document.onreadystatechange = function(){
            if(document.readyState == "complete")
            {
                log("Test1: document.onreadystatechange == \"complete\"");
            }

            if(document.readyState == "interactive")
            {
                log("Test1: document.onreadystatechange == \"interactive\"");
            }
        }

        //test2
        window.addEventListener('load', function(){log("Test2: window.addEventListener load");});

        //test3
        document.addEventListener('DOMContentLoaded', function(){log("Test3: document.addEventListener DOMContentLoaded");});

    }


    function styleStart()
    {
        cnt++;
        log("styleStart() Nr." + cnt);
        editStyle("sh-page ing-diba-content-to-blur","95%");
        editStyle("content","95%");
        editStyle("isin","95%");

        btnColor();

        //Werbeeinblendungen ausblenden. Falls nicht gewünscht, einfach auskommentieren oder auf 'false' setzen!
        hideClasses(true);

        selectHandelsPlatz();


        //watchListFullNames();
    }

    function btnColor()
    {
        log("btnColor() start");
        try
        {

            var loBtn = d.getElementsByClassName("ing-sn-session-button__link")[0].nextElementSibling;
            loBtn.innerText = "Kein Auto-Logout!";

        }
        catch
        {
        }
        //d.getElementsByClassName("session")[0].style.cssText = ":hover {color: red !important; background-color: green !important;}";
        d = document;
        var c = "rgb(255, 197, 161)";
        var ho = [
            ["session","rgb(255, 98, 50)"], //rgb(255, 98, 0)
            ["ing-header",c],
            ["ing-sn-content-to-blur",c],
            ["ing-header__bottom",c],
            ["navigation-l1",c],
            ["ingde-sn-search-input","rgb(255, 222, 201)"],
            ["ing-sn-session-button__refresh","rgb(191, 73, 0)"]
        ];

        var b;
        for(var s in ho)
        {
            try
            {
                b = document.getElementsByClassName(ho[s][0]);
                b[0].style["background-color"] = ho[s][1];
                window.console.log("btnColor("+ho[s][0]+") OK");
            }
            catch(e)
            {
                window.console.log("btnColor("+ho[s][0]+") Fehler: " + e.message);
                window.console.log(b);
            }
        }
        //setTimeout(function(){btnColor();},10000);
    }

    function isWatchlist()
    {
        try
        {
            //return window.location.toString().includes("wertpapiere");
            return document.getElementsByClassName("sh-title")[0].innerText.toLowerCase().includes("watchlist");
        }
        catch
        {
            return false;
        }
    }

    function selectHandelsPlatz()
    {
        try
        {
            log("selectHandelsPlatz()");
            var tradeMask = d.getElementsByClassName("ibbr-table-cell");

            for(var x in tradeMask)
            {
                try
                {
                    if(tradeMask[x].innerHTML.toLowerCase().includes("direkthandel"))
                    {
                        log("direkthandel klick");
                        tradeMask[x].click()
                        setTimeout(function(){selectTradeOptions();},1000);
                        break;
                    }
                }
                catch
                {
                }
            }
        }
        catch
        {
        }
    }

    function selectTradeOptions()
    {
        var coboItems = d.getElementsByTagName("option");
        console.log(coboItems);
        for(var x in coboItems)
        {
            try
            {

                /*
                if(coboItems[x].getAttribute("value") === "LIMIT")
                {
                    coboItems[x].parentNode[0].click();
                    coboItems[x].selected = true;
                    //coboItems[x].setAttribute("selected","selected");
                    //coboItems[x].click();
                    console.log("Eintrag Aktiviert:");
                    console.log(coboItems[x]);
                }
                */

                if(coboItems[x].getAttribute("value") === "MAXIMAL")
                {
                    //coboItems[x].parentNode[0].click();
                    coboItems[x].selected = true;
                    //coboItems[x].setAttribute("selected","selected");
                    //coboItems[x].click();
                    console.log("Eintrag Aktiviert:");
                    console.log(coboItems[x]);
                }
            }
            catch
            {
            }
        }
    }

    function refreshLogin()
    {
        if(isWatchlist())
        {
            return;
        }

        try
        {
            //var clsn = "session__refresh"; //alt1
            //var clsn = "ing-sn-session-button__refresh"; //alt2
            //
            var clsn = "session-button__refresh-button";

            var reloadBtn = d.getElementsByClassName(clsn);
            if(reloadBtn[0])
            {
                reloadBtn[0].click();
                log(" Login-Refresh");
            }
        }
        catch(e)
        {
            //window.alert("DiBa-Script-Refresh-Fehler: " + e.message);
            log("Fehler in refreshLogin(): " + e.message + " !!!");
            console.log(e);
        }
        setTimeout(function(){refreshLogin();},t);
    }

    function refreshPopup()
    {
        try
        {
            var pId = "QuotestreamPopup";
            var p = d.getElementById(pId);
            if(p !== null)
            {
                var ph = p.clientHeight;
                if(ph > 0)
                {
                    d.getElementById("ctl00_QsPopup_Reload").click();
                    log("refreshPopup()  Watchlist Aktualisierung OK");
                }
            }
        }
        catch(e)
        {
            //window.alert("DiBa-Script-Popup-Fehler: " + e.message);
            log("Fehler in refreshPopup(): " + e.message + " !!!");
            console.log(e);
        }

        setTimeout(function(){refreshPopup();},2000);
    }

    //Falls Serverfehler "Entschuldigung!" beim LoginRefresh:
    function sorryBro()
    {
        try
        {
            var s = d.getElementsByClassName("headline")[0];
            if(s !== undefined)
            {
                log("sorryBro() Fehlersite wurde geladen.");
                console.log("innerText: '" + s.innerText + "'");
                if(s.innerText == "Entschuldigung!")
                {
                    log("sorryBro():Entschuldigung! Gehe zurück zur vorherigen Site.");
                    history.back();
                }
                else
                {
                    log("sorryBro() Fehlersite unbekannt? ");
                }
            }
        }
        catch(e)
        {
            log("sorryBro() Fehler: " + e.message);
        }
    }

    function hideClasses(hide)
    {
        for(var v in classesToHide)
        {
            hideClass(classesToHide[v][0], classesToHide[v][1], hide);
        }
    }

    function hideClass(clsName, cnt, hide)
    {
        var cnter = -1;
        var isId = false;

        try
        {
            var sichtbarkeit = hide ? 'hidden' : 'visible';
            var ga = document.getElementsByClassName(clsName);
            


            if(ga === null || ga.length === 0)
            {
                var e = d.getElementById(clsName);
                ga = new Array();
                ga[0] = e;
                isId = true;
            }
            else
            {
                isId = false;
            }



            if(ga !== null)
            {
                for(var v in ga)
                {
                    if(ga[v] !== null)
                    {
                        cnter++;
                        if(cnter < cnt || ga[v].localName === "form")
                        {
                            continue;
                        }

                        if((!isId && ga[v].className === clsName) || (isId && ga[v].id !== undefined && ga[v].id === clsName))
                        {
                            /*
                            cnter++;
                            if(cnter < cnt)
                            {
                                continue;
                            }
                            */

                            ga[v].style.visibility = sichtbarkeit;
                            if(hide === true)
                            {
                                if (hBckup[ga[v].id] === undefined) { hBckup[ga[v].id] = ga[v].style.height;}
                                ga[v].style.height = '0px';
                            }
                            else
                            {
                                if (hBckup[ga[v].id] !== undefined) { ga[v].style.height = hBckup[ga[v].id]}
                            }

                            log(">>> hideClass: " + clsName + "[idx " + cnter + "] versteckt: " + hide);
                            console.log(ga);
                        }

                    }
                }
            }
            else
            {
                log(">>> hideClass: " + clsName + "[idx " + cnter + "]  ist NULL");
            }
        }
        catch(e)
        {
            window.alert("DiBa-Script-Hide-Class-Fehler: " + clsName + ": " + e.message);
            window.console.log("Fehler: " + e.message + " !!!");
            console.log(e);
        }
    }

    function editStyle(clsName, clsWidth)
    {
        try
        {
            var c;
            c = d.getElementsByClassName(clsName);
            if(c === null || c.length == 0)
            {
                c = d.getElementById(clsName);
            }

            if(c !== null && c.length > 0)
            {
                for(var v in c)
                {
                    try
                    {
                        c[v].style["max-width"] = clsWidth;
                        c[v].children[1].style.maxWidth = clsWidth;
                        log("editStyle(): " + clsName + " auf " + clsWidth + " gesetzt");
                    }
                    catch(ex)
                    {
                    }
                }
            }
        }
        catch(e)
        {
            window.alert("DiBa-Script-editStyle-Fehler: " + clsName + ": " + e.message);
            window.console.log("Fehler: " + e.message + " !!!");
            console.log(e);
        }
    }

    var f;
    function createFrame(url, id)
    {
        try
        {
            f = document.createElement('iframe');
            f.src = url;
            document.body.appendChild(f)
            f.setAttribute("id",id);


            return document.getElementById(id).contentDocument.getElementsByClassName("headline instrument-name")[0].innerHTML;
        }
        catch(e)
        {
            return id;
        }
    }

    function watchListFullNames()
    {
        var t = d.getElementById("ctl00_WebPartManager_wp1597137417_wp45466993_PortfolioItems_Control_Grid").childNodes[2].rows;
        for(var r in t)
        {
            console.log(t[r]);
            if(t[r].className === "first")
            {
                try
                {
                    var id = t[r].cells[0].textContent;
                    var url = t[r].cells[0].childNodes[0].getAttribute("href");

                    t[r].cells[0].textContent = createFrame(url, id);
                }
                catch(e)
                {
                    console.log(e);
                }
            }
        }
    }


    function restoreConsole()
    {
        var i = document.createElement('iframe');
        i.style.display = 'none';
        document.body.appendChild(i);
        window.console = i.contentWindow.console;
        i.parentNode.removeChild(i);
    }
})();
