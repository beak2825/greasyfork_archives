// ==UserScript==
// @name         Facebook events for orienteringslob.dk
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  Udtrækker event-id for Facebook-begivenheder
// @author       vertikal.dk
// @match        https://www.facebook.com/*
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @license      Creative Commons

// @downloadURL https://update.greasyfork.org/scripts/451350/Facebook%20events%20for%20orienteringslobdk.user.js
// @updateURL https://update.greasyfork.org/scripts/451350/Facebook%20events%20for%20orienteringslobdk.meta.js
// ==/UserScript==

//document.evaluate("//h2[contains(., 'Kommende begivenheder')]").iterateNext()
const wait = t => new Promise(resolve => setTimeout(resolve, t));
const endPoint = "https://orienteringslob.dk/import_tampermonkey";
let token;
let club = document.location.href.split("/")[3];

/* globals $ waitForKeyElements*/

(async function() {
   'use strict';
   let delay = 10, intervalID

   let intervalId = setInterval(function(){waitForKeyElements (selectorFunc, callback, false, 1000)}, 1500);

   function selectorFunc() {
      //location.href.match(/https:\/\/www.facebook.com\/.*\/.*events.*/)
      //if(!document.location.href.match(/facebook\.com\/.+\/*events*/)) return [];
      if(!document.location.href.match(/facebook\.com\/.*\/events/)) return [];
      const match = $("h2:contains(egivenheder):first")[0]
      return match ? [match] : [];
   }

   function callback(jNode) {
      console.log("Inside callback");
      if($("#addtoclip").is(":visible")) return
      clearInterval(intervalId);
      $(`<div id="addtoclip" style="font-size:1.2em;margin-top:10px">
           <div style="font-size:25px;font-weight:bold; color: brown; margin-top:15px">Tilføjelse af løb til orienteringslob.dk</div>
           <p style="font-weight:bold">Sørg for at alle løbene er vist. Klik evt. på "Se mere" etc. indtil der ikke er flere løb.</p>
        </div>`).insertAfter("h2:contains(egivenheder):first");

      $(`#addtoclip`).after(`<div id="transfer-events" style="font-size: 1.2em; margin-top: 10px; font-weight: bold"><a>Klik derefter her for at overføre de viste begivenheder til orienteringslob.dk</a></div>`);

      $("#transfer-events").click(function(){
         //let n = document.querySelector("div.gt60zsk1.ez8dtbzv.r227ecj6.g4qalytl");
         let n = document.querySelector("div.x78zum5.x1q0g3np.x1a02dak.x1qughib");
         let events = Array.from(n.querySelectorAll("a[href*='/events/']")).filter(e => e.attributes['aria-label'] == undefined && e.attributes['aria-hidden'] == undefined).map(e => e.href.match(/\d{8,}/));
         console.log({events})
         createEvents(club, events)
      })
   }

})();

function getToken() {
   let token = GM_getValue("token")
   //token = null
   if(!token) {
      token = prompt("Indtast/indsæt den auth token som du har fået tilsendt i feltet herunder.");
      if(!token) {
         alert("Du skal indtaste en auth. token");
         return false;
      }
      GM_setValue("token", token);
   }
   return token
}

function clearToken() {
    GM_deleteValue("token");
}

async function createEvents(club, events) {
   let token = getToken()
   if(!token) return
   let args = {
      url: endPoint,
      headers: {
         "x-access-token": token,
         "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: `events=${events.join(",")}&club=${club}&token=${token}`
   }
   try {
      let res = await gmPost(args)
      if(res == "ok") {
         $("#transfer-events").html(`<div id="eventresults" style="color: brown; font-size:1.2em;margin-top:5px;font-weight: bold">${events.length} løb er nu overført til orienteringslob.dk</div>
         <p style="font-style: italic">Fik du ikke alle løbene med? Så genindlæs siden og prøv igen.</p>`);
      }
      else {
         console.log(res)
         alert(res)
      }
   } catch (error) {
      alert(`Kunne ikke overføre løb\nFejl: ${error}`)
   }
}

async function gmPost(args) {
   return new Promise((resolve, reject) => {
      GM_xmlhttpRequest(
         Object.assign({
            method: 'POST',
         }, args, {
            onload: e => e.status == 200 ? resolve(e.response) : reject(e.response),
            onerror: reject,
            ontimeout: reject,
         })
      );
   });
}