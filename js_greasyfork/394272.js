// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/index.php?version=4.9&ext=dhdg&updated=true
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @include     *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/394272/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/394272/New%20Userscript.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // FETCH API:ER SOM OFTA INTE FUNKAR PGA SECURITY POLICY
// function checkSite(id, url) {
//  fetch(url)
//    .then(res => res.json())
//    .then(data => {
 //     for (var x of data) {
//        findText(x.value)
//      }
//    });
// }

function runAllAtOnce() {
var moveNextAlertDown = 80;
var alerts = [] // LISTA AV ALERTS
var habanero = false


function findText(text, recomendation, publisher, link) {

    if (alerts.includes(text)) {console.log('en alert har redan skapats')}

     var y = window.scrollY

    if (window.find(text) && !alerts.includes(text)) {

        if (habanero === false) {

    document.body.insertAdjacentHTML("beforeEnd",`

     <div id="habanero" class="warningDiv" style ="position: fixed; right: 18px; top: 120px; z-index: 2147483647; border-radius: 50%">
       <button id="dropdownButton" class="dropbtn" style="width: 3vw; height: 3vw; background-color: #ff0000; border: none; border-radius: 50%; padding: 0; vertical-align: middle; background-color: #3498DB; color: white; padding: 16px; font-size: 16px; cursor: pointer" type="button">
         <img id="dropdownImage" style="width: 3vw; height: auto; border-radius: 50%; padding: 0; vertical-align: middle" class="icon-circled icon-bglight" src="https://www.chillisoft.co.za/wp-content/uploads/2016/04/Habanero-1.jpg" alt="">
       </button>

       <div id="mydropdown" class="dropdown-content" style="display: none">
       </div>

     </div>
    `);

    }

     habanero = true;
     alerts.push(text)


        // console.log('det här ska vara en fungerande länk' + link)


     document.getElementById('mydropdown').insertAdjacentHTML("beforeEnd",`

       <div class="warningDiv" style = "position: absolute; top: ${moveNextAlertDown}px; right: 5px; background-color: #FFFFFFDB; width: 150px; padding: 3px; z-index: 2147483647; border-radius: 5%">
         <div style = "position: relative; font-size: 16px; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #504f54; line-height: 0.9;"> ${text} - ${recomendation} <a href="${link} onclick="openLink(${link})"> ${publisher}</a> </div>
       </div>
     `)

     moveNextAlertDown = moveNextAlertDown + 80;

        if (window.getSelection) {window.getSelection().removeAllRanges();}
        else if (document.selection) {document.selection.empty();}

        document.activeElement.blur();
        document.activeElement.parentNode.blur();


     //document.getElementById('habanero').addEventListener("click", openDropDownList);
     //document.getElementById('habanero').addEventListener("focus", focusFunction)

     console.log('har hittat ' + text +'!!!!!!')

}
        window.scrollTo(0, y);
}


function openLink(url) {
   window.open(url)
}


function test() {

    var itemsInSession = sessionStorage.getItem('itemCount')
    console.log('har hittat ' + (Number(itemsInSession)+1) + ' ord i session storage')
    sessionStorage.setItem('itemCount', '20') //Det här borde sättas till noll efter att alla värden i session storage har gjorts till variabler

      for (var i = 0; i <= itemsInSession; i++) {
      //   console.log('test påbörjad för ' + JSON.parse(sessionStorage.getItem(i))[0] + '...')

         // console.log('länk till sida = ' + JSON.parse(sessionStorage.getItem(i))[3])

          findText(JSON.parse(sessionStorage.getItem(i))[0],JSON.parse(sessionStorage.getItem(i))[1],JSON.parse(sessionStorage.getItem(i))[2],JSON.parse(sessionStorage.getItem(i))[3])
         // findText (sessionStorage.getItem(i))

      }
}





 // CHECK-EVENT VID KLICK
function events (event) {
  document.body.addEventListener("mousedown", function(event) {

           console.log('Har det klickats på något som sätter igång test? = ')
           console.log(!(event.target.matches('INPUT')) && !(event.target.closest('.warningDiv')))

      if (event.target.closest('.warningDiv')) {
         openDropDownList(event)
      }

      if (event.target.closest('#habanero')) {
          //  event.target.parentNode.blur();
           // event.target.parentNode.parentNode.blur();
      }

      if (event.target.closest('INPUT')) {
            event.target.parentNode.blur();
            event.target.parentNode.parentNode.blur();
      }

      if (!(event.target.closest('INPUT')) && !(event.target.closest('.warningDiv'))) {
        setTimeout(test, 2500);
      }

})}

setTimeout(events, 5000);

 // CHECK ON LOAD

setTimeout(startFunction, 4000);

   function startFunction() {
        test()
        document.body.click()
    }


// DROPDOWN MENY
   //tar bort menyn om man klickar utanför
window.onclick = function(event) {
 if (document.getElementById('dropdownButton').contains(event.target)){
  } else{
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];

      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    }
  }
};

function openDropDownList(e) {
   e.preventDefault();
   //this.blur();

   var dropdowns = document.getElementsByClassName("dropdown-content");
   var i;

   for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];

        if (openDropdown.style.display === "block") {
          openDropdown.style.display = "none";
        } else {
          openDropdown.style.display = "block";
        }
    }
}






// GREASY FORK CODE
function testButton () {
  var testedButton = document.querySelector("#install-area > a.install-link").innerHTML.includes('Reinstall')

    if (testedButton === true) {
        setTimeout(closeWindow, 100);
    } else {
        pressButton()
    }
}

function pressButton () {
  document.querySelector("#install-area > a.install-link").click()
    setTimeout(closeWindow, 1000);
}

function closeWindow () {
  window.close('https://greasyfork.org/en/scripts/394274-arrayofwordstomatch');
}

//console.log(window.location.href)

if ((window.location.href === 'https://greasyfork.org/en/scripts/394272-new-userscript/code') || (window.location.href === 'https://greasyfork.org/en/scripts/394274-arrayofwordstomatch'))
{
   setTimeout(testButton, 1000)
}

}

runAllAtOnce()

})();