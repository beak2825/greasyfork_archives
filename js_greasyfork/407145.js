// ==UserScript==
// @name         Container Audit
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Narzędzie do rejestrowania Audytów skanerem (opcja 105)
// @author       NOWARATN
// @match        http://sortcenter-menu-eu.amazon.com/audit/containerAudit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407145/Container%20Audit.user.js
// @updateURL https://update.greasyfork.org/scripts/407145/Container%20Audit.meta.js
// ==/UserScript==

var zmienna = false;
var temp;
var paczka;
var rodzaj;
var info;
var g_regexp = /GAYLORD[A-zA-Z0-9]{9}/g
var nok = "Package is not in this container";
var ok = "Package is in correct container";

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;


setInterval(function() {

    if(document.getElementById("sejfaudyt_div") == null)
    {
        var znode_audyt = document.createElement ('div');
        znode_audyt.innerHTML = '<hr><code contenteditable="true" id="audyt_textarea" style="">';
        znode_audyt.setAttribute ('id', 'sejfaudyt_div');
        znode_audyt.setAttribute ('style', 'overflow-y:auto;height:500px;');
        document.getElementById("container").appendChild(znode_audyt);

        var znode_guziki = document.createElement ('div');
        znode_guziki.innerHTML = '<br><br><input type="button" id="wczytaj_button" value="WCZYTAJ"></input> <input type="button" id="czysc_button" value="CZYŚĆ"></input>';
        znode_audyt.setAttribute ('id', 'sejfaudyt_div');
        document.getElementById("container").appendChild(znode_guziki);

        document.getElementById ("wczytaj_button").addEventListener (
            "click", ButtonClickAction, false
        );

        document.getElementById ("czysc_button").addEventListener (
            "click", ButtonClickActionCzysc, false
        );

        function ButtonClickAction (zEvent)
        {
           document.getElementById("audyt_textarea").innerHTML = localStorage.getItem(today);
        }
         function ButtonClickActionCzysc (zEvent)
        {
           document.getElementById("audyt_textarea").innerHTML = "";
        }
    }

    if(zmienna == false)
    {
        temp = document.getElementById("parentInfo").innerText;
        if(document.getElementById("parentInfo").innerText != "")
        {
            if(document.getElementById("infodisplay").style.display == "block" && (document.getElementById("infodisplay").innerText == ok || document.getElementById("infodisplay").innerText == nok))
            {
                console.log("1");
                var text = document.getElementById("parentInfo").innerText;
                var wynik;
                text = text.replace("Gaylord Id\n","");
                text = text.replace("Stacking Filter\n","");
                text = text.replace("CPT\n","");
                console.log(text);
                var gay = text.match(g_regexp);
                console.log(gay);

                text = text.replace(g_regexp, '<strong>' + text.match(g_regexp) + '</strong>');

                if(document.getElementById("infodisplay").innerText == ok)
                {
                    console.log("2");
                    wynik = " is in correct container (OK)";
                    rodzaj = "ok";
                }
                else
                {
                    wynik = " is not in this container (NOK)";
                    rodzaj = "nok";
                }

                console.log("3");
                if(document.getElementById("packageInfo").style.display == "block" && (document.getElementById("infodisplay").innerText == ok || document.getElementById("infodisplay").innerText == nok))
                {
                    console.log("4");
                    paczka = document.getElementById("pkInValue").innerText;
                }

                if(rodzaj == "ok")
                {
                    info = '<span style="color: green;">' + paczka + wynik;
                }
                else info = '<span style="color: red;">' + paczka + wynik;

                console.log("5");
              //  document.getElementById("audyt_textarea").value += text + "\r\n" + paczka + wynik + "\r\n";
                document.getElementById("audyt_textarea").innerHTML += '<span style="color: blue;">' + text.replace("\n","<br>") + '</span><br>' + info + '<br>';

                zmienna = true;

                localStorage.setItem(today, document.getElementById("audyt_textarea").innerHTML);
            }
        }
    }

    if(zmienna == true)
    {
        if(document.getElementById("pkInValue").innerText != paczka && document.getElementById("pkInValue").innerText != "")
        {
            paczka = document.getElementById("pkInValue").innerText
            if(document.getElementById("infodisplay").innerText == ok)
                {
                    console.log("2");
                    wynik = " is in correct container (OK)";
                    rodzaj = "ok";
                }
                else
                {
                    wynik = " is not in this container (NOK)";
                    rodzaj = "nok";
                }

            if(rodzaj == "ok")
            {
                info = '<span style="color: green;">' + paczka + wynik;
            }
            else info = '<span style="color: red;">' + paczka + wynik;



            document.getElementById("audyt_textarea").innerHTML += info + "<br>";

            localStorage.setItem(today, document.getElementById("audyt_textarea").innerHTML);
        }
    }

    if(document.getElementById("parentInfo").innerText != temp)
    {
        document.getElementById("audyt_textarea").innerHTML += "<br>";
        zmienna = false;
    }

}, 500);

