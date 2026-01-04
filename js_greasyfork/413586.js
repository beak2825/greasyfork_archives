// ==UserScript==
// @name         ALERT FPY
// @namespace    http://tampermonkey.net/
// @version      3
// @description  try to take over the world!
// @author       NOWARATN
// @match        https://atlas.corp.amazon.com/action_center/KTW1/actions?status=expired,open,pending,workInProgress&process=induct,shipDock*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/413586/ALERT%20FPY.user.js
// @updateURL https://update.greasyfork.org/scripts/413586/ALERT%20FPY.meta.js
// ==/UserScript==

GM_config.init(
{
  'id': 'Automat_FPY', // The id used for this instance of GM_config
  'title': 'Automat_FPY',
  'fields':
  {
      'Automat':
      {
          'label': 'Automatycznie?', // Appears next to field
          'type': 'text', // Makes this setting a checkbox input
          'default': false // Default value if user doesn't change it
      },
  }
});

//var czy_automat = GM_config.get('Automat');

var action_link = "";
var i;
var typ = "";
var ok = true;
var czas;

czas = randomIntFromInterval(30000,150000);
console.log(czas);

// Guzik automat
var automat = document.createElement ('div');
automat.innerHTML = '<button id="Button_automatyczne_fpy" type="button" class="btn btn-sm btn-secondary" style="position:absolute;z-index:9999;display:block;">Automatuj</button>';
automat.setAttribute ('id', 'automatyczne_fpy_div');
document.getElementById("action-center-filters").appendChild(automat);

// iFrame
var ramka = document.createElement ('div');
ramka.innerHTML = '<iframe id="rameczka1" width="100%" height="80%">';
ramka.setAttribute ('id', 'rameczka_div');
ramka.setAttribute ('style', 'position: absolute;left: -33%;top: -50%;width: 34%;height: 240%;z-index: 2;');
document.getElementsByClassName("container")[5].appendChild(ramka);

//document.getElementById ("Button_automatyczne_fpy").addEventListener (
//            "click", ButtonClick, false
//        );

//function ButtonClick (zEvent)
//{

setInterval(function()
            {
    // Odnajdujemy link do FPY
    for (i = 0; i < document.getElementsByTagName("tr").length; i++) {
        if(document.getElementsByTagName("tr")[i].attributes[2] != undefined)
        {
            console.log("1");
            if(document.getElementsByTagName("tr")[i].attributes[2].value == "open")
            {
                console.log("2");
                console.log(document.getElementsByTagName("tr")[i].attributes[4].value);
                if(document.getElementsByTagName("tr")[i].attributes[4].value == "shipDock")
                {
                    console.log("3");
                    // Ship Dock
                    action_link = document.getElementsByTagName("tr")[i].children[4].children[0].href
                    console.log(action_link);
                    break;
                }
            }
        }
    }

    if(action_link != "")
    {
        var iframe = document.getElementById("rameczka1");
        iframe.src = action_link;

        setTimeout(function() {
            var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            innerDoc.getElementsByClassName("close")[0].click();
            typ = innerDoc.getElementsByTagName("strong")[0].innerText;
            console.log(typ);
            if(typ == "Failed Moves for Associate Above Threshold")
            {
                innerDoc.getElementsByTagName("select")[2].selectedIndex = 1;
                innerDoc.getElementsByTagName("select")[3].selectedIndex = 1;
                innerDoc.getElementsByTagName("textarea")[3].value = "Feedback"
                innerDoc.getElementsByTagName("select")[4].selectedIndex = 1;

                setTimeout(function() {
                    innerDoc.getElementsByClassName("btn btn-sm btn-primary")[2].click();
                }, 2000);
                setTimeout(function() {
                    location.reload();
                }, 2000);
            }

            if(typ == "Ship Sorter Destination-Level Recirc Count Exceeds Threshold")
            {
                innerDoc.getElementsByTagName("select")[2].selectedIndex = 10;
                innerDoc.getElementsByTagName("select")[3].selectedIndex = 0;
                innerDoc.getElementsByTagName("textarea")[3].value = "Other"
                innerDoc.getElementsByTagName("textarea")[4].value = "Feedback"

                setTimeout(function() {
                innerDoc.getElementsByClassName("btn btn-sm btn-primary")[2].click();
                }, 2000);
                setTimeout(function() {
                location.reload();
                }, 2000);
            }

            if(typ == "Ship Sorter No Scan Count Exceeds Threshold")
            {
                innerDoc.getElementsByTagName("select")[2].selectedIndex = 9;
                innerDoc.getElementsByTagName("select")[3].selectedIndex = 0;
                innerDoc.getElementsByTagName("textarea")[3].value = "Other"
                innerDoc.getElementsByTagName("textarea")[4].value = "Feedback"

                setTimeout(function() {
                innerDoc.getElementsByClassName("btn btn-sm btn-primary")[2].click();
                }, 2000);
                setTimeout(function() {
                location.reload();
                }, 2000);
            }







            ok = true;
            action_link = "";
           // location.reload();
        },5000);
    }
    else
    {
        location.reload();
    }
}, czas);

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

