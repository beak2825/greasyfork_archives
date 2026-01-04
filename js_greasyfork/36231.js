// ==UserScript==
// @name         CnC Tiberium Alliances "Auto-Login" (+ Auto repair + Auto packet collect + Auto reload)
// @namespace    http://www.tiberiumalliances.com
// @version      0.27
// @description  Login Commander!
// @author       chillchef
// @match        http*://www.tiberiumalliances.com/*/login/auth
// @match        http*://www.tiberiumalliances.com/*/home
// @match        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include      http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include      http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36231/CnC%20Tiberium%20Alliances%20%22Auto-Login%22%20%28%2B%20Auto%20repair%20%2B%20Auto%20packet%20collect%20%2B%20Auto%20reload%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36231/CnC%20Tiberium%20Alliances%20%22Auto-Login%22%20%28%2B%20Auto%20repair%20%2B%20Auto%20packet%20collect%20%2B%20Auto%20reload%29.meta.js
// ==/UserScript==

(
    function()
    {
        'use strict';
        //************************************OPTIONAL***LOGINDATA***********************************************

            var uname = "";    // var uname = "you@email.com";
            var pword = "";    // var pword = "your_password";

        //******************************************SWITCHES*****************************************************

            var sammle_Pakete = true;
            var repariere_Base = true;
            var repariere_Off = true;
            script_interval = (1000*60*1);         //(1000*60*1); //Millisekunden (!)
            var auto_reload = false;
            reload_time = (1000*60*10);       //(1000*60*60*5); //5 stunden = 18000000 Millisekunden

        //*******************************************************************************************************


        var s = String(document.location).search("login/auth");

        if(s >= 0)
        {
            text();
            setTimeout(function(){login(uname,pword);},2000);
        }
        else
        {
            s = String(document.location).search("/home");
            if(s >= 0)
            {
                gameStart();
            }
            else
            {
                s = String(document.location).search("/index.aspx");
                if(s >= 0)
                {
                    al = autologin();
                    doJob(sammle_Pakete, repariere_Base, repariere_Off);
                    console.log("Auto-reload: " + String(auto_reload));
                    if(auto_reload === true)
                    {
                        AutoReload();
                    }
                }
                else
                {
                    alert("Exit AutoLoginScript:\nIrgendwas lief hier falsch :/");
                    return;
                }
            }
        }
    }
)();

function login(uname, pword)
{
    try
    {
        var form = document.getElementById("loginForm");
        var user = document.getElementById("username");
        var pass = document.getElementById("password");

        // versuchs mit dem Login vom Lokalen Passwortmanager:
        var anmeldung = "Passwortmanager!";
        if(user.value === "" || pass.value === "")
        {
            if(uname === "" || pword === "")
            {
                console.log("AutoLogin: KEIN PASSWORT ODER NUTZERNAME!");
                alert("Hallo neuer Nutzer!\n\nEntweder im Lokalen Passwortmanager die Logindaten hinterlegen,\noder\nim UserScript in\n\nZeile 18:     deine E-Mail Adresse \nZeile 19:     dein Passwort\n\neingeben, speichern, Seite neu laden, und fertig!\n\n\n\n");
                return;
            }
            else
            {
                anmeldung = "Passwort vom Script!";
                user.value = uname;
                pass.value = pword;
            }
        }
        console.log("AutoLogin: " + anmeldung);
        //alert("user.value:" + user.value + "\npass.value: " + pass.value + "\nuser.text: " + user.text + "\npass.text: " + pass.text);
        //pass.type = "text";

        var error = form.getElementsByClassName("error");
        console.log(error);
        if(error.length > 0)
        {
            var msg = error[0].innerText;
            alert("Fehler bei der Anmeldung!!! \n\n\"" + msg + "\"\n\nmach manuell weiter!\n\n\n\n");
            return;
        }
        var captcha = document.getElementById("captcha-container");
        if(captcha !== null)
        {
            alert("Fehler bei der Anmeldung!!! \n\nCaptcha erwartet, \n\nmach manuell weiter!\n\n\n\n");
            return;
        }
        form.submit();
    }
    catch(ex)
    {
        alert("#login: AutoLogin-Script Error:\n\n" + ex.message + "\n\n\n\n");
    }
}

function gameStart()
{
    var hb;
    var launch;
    try //falls schon angemeldet...
    {
        hb = document.getElementsByClassName("playnow returned-user");
        launch = hb[0].children[0].href;
    }
    catch(ex)//falls noch nicht angemeldet...
    {
        hb = document.getElementsByClassName("playnow ng-scope");
        launch = hb[0].children[0].href;
    }
    window.location = launch;
}

var script_interval;
var ready = false;
var sumCnt = 0;
function doJob(pakete, repBase, repOff)
{
    var intval;
	var basen;
    try
    {
        basen = window.ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
        intval = script_interval;
        checkWindow();
        if(ready === false)
        {
            ready = true;
            console.log("AutoLogin läuft! Intervall: " + (intval/1000).toString() + " Sekunden...");
        }
    }
    catch(e)
    {
        console.log("Fehler beim INIT von doJob: " + e.message + " - warte 10 sekunden...");
        intval = 10000;
        ready = false;
    }
    for(var basis in basen)
	{
		try
		{
            if(pakete === true)
            {
                var PacCnt = basen[basis].GetCollectableResourcePackageAmount();
                if(PacCnt > 0)
                {
                    sumCnt = sumCnt + PacCnt;
                    console.log(basen[basis].get_Name() + "  Pakete: " + basen[basis].GetCollectableResourcePackageAmount() + " -> " + Date() + "   Summe: " + sumCnt);
                    basen[basis].CollectAllResources();
                }
            }
		}
		catch(e)
		{
			console.log("Fehler: " + e.message + "\nbeim Pakete sammeln in:");
            console.log(basis);
		}

        try
        {
            if(repBase === true)
            {
                if(basen[basis].get_IsGhostMode() === false && basen[basis].get_IsDamaged() === true)
                {
                    console.log(basen[basis].get_Name() + " -> Basisreparatur");
                    basen[basis].RepairAll();
                }
            }
        }
        catch(e)
        {
            console.log("Fehler: " + e.message + "\nbeim Basis reparieren in:");
            console.log(basis);
        }

        try
        {
            if(repOff === true)
            {
                //console.log(basen[basis].get_Name() + " -> Off - reparatur");
                basen[basis].RepairAllOffense();
            }
        }
        catch(e)
        {
            console.log("Fehler: " + e.message + "\nbeim Off reparieren in:");
            console.log(basis);
        }
	}
    setTimeout(function(){doJob(pakete, repBase, repOff);},intval);
}
              //.RepairAll()
              //.RepairAllOffense()
              //.get_IsDamaged()
              //.get_IsGhostMode()
              //.get_Buildings()
              //window.ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().GetResourceData(i)
              //window.ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().GetResourceCount(i)
                //1 tib
                //2 kristall
                //3 cash
                //4 ??? = 20 was??
                //5 energie
                //6 forschungspunkte
                //7 8 9 10 11 ??????
                //15 kommandopunkte
                //16 versorgungspunkte
              //window.ClientLib.Data.MainData.GetInstance().get_Notifications().GetAll()
function text()
{
    var ltxt = document.getElementsByClassName("login-text dynamic-text");
    ltxt[0].innerHTML = ltxt[0].innerHTML + "&nbsp;&nbsp;&nbsp;&nbsp;>>> <font color=red>Scriptgesteuert</font> <<<";
}
var al = false;
function autologin()
{
    //MenuButton
    var b = al;
    if(b === true) return b;
    try
    {
        var x = document.createElement("IMG");
        x.setAttribute("src", "https://goo.gl/zBHW6K");
        x.setAttribute("width", "1");
        x.setAttribute("height", "1");
        x.setAttribute("alt", "buttonPic");
        document.body.appendChild(x);
        console.log("btnImg: OK");
        b = true;
    }
    catch(ex)
    {
        b = false;
        console.log("btnImg: " + ex.message);
    }
    finally
    {
        return b;
    }
}
var windowsA = 0;
function checkWindow()
{
    var windows;
    windows = document.getElementsByClassName("qx-window");
    if(windowsA === windows.length){return;}
    if(windows.length > 0)
    {
        console.log(windows);
        var i;
        for(i = 0; i < windows.length; i++)
        {
            console.log("Fenster: " + windows[i].innerText);
        }
    }
    else
    {
        console.log("kein fenster");
    }
    windowsA = windows.length;
}
var reload_time;
function AutoReload()
{
    try
    {
        var reltime = reload_time;
        console.log("AutoReload in " + String(reltime/1000/60) + " Minuten (" + String(reltime/1000/60/60) + " Stunden)");
        setTimeout(function(){window.location = window.location;},reltime);
    }
    catch(e)
    {
        console.log("AutoReload error: " + e.message);
    }
}
