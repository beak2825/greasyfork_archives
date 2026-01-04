// ==UserScript==
// @name         Facebook auto-events for orienteringslob.dk
// @namespace    http://tampermonkey.net/
// @version      0.37
// @description  Udtrækker event-id for Facebook-begivenheder og går automatisk videre til næste klub i listen
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

// @downloadURL https://update.greasyfork.org/scripts/495144/Facebook%20auto-events%20for%20orienteringslobdk.user.js
// @updateURL https://update.greasyfork.org/scripts/495144/Facebook%20auto-events%20for%20orienteringslobdk.meta.js
// ==/UserScript==

//document.evaluate("//h2[contains(., 'Kommende begivenheder')]").iterateNext()
const wait = t => new Promise(resolve => setTimeout(resolve, t));
const endPoint = "https://orienteringslob.dk/import_tampermonkey";
let token;
let club = document.location.href.split("/")[3];
const timeout = 5000;
/* globals $ waitForKeyElements*/

(async function() {
   'use strict';
   let delay = 10, intervalID

   let t = Date.now();

   let intervalId = setInterval(function(){waitForKeyElements (selectorFunc, callback, false, 5000)}, 1500);

   function selectorFunc() {
      if(!document.location.href.match(/facebook\.com\/.*(\/|&sk=)events/)) return [];
      //https://www.facebook.com/profile.php?id=100064328004225&sk=events
      if(intervalId == 0) return;
      //console.log("selectorFunc")
      if(Date.now()-t > timeout) {
         clearInterval(intervalId);
         intervalId = 0;
         getNextClub();
      }
      //location.href.match(/https:\/\/www.facebook.com\/.*\/.*events.*/)
      //if(!document.location.href.match(/facebook\.com\/.+\/*events*/)) return [];
      // const match = $("h2:contains(egivenheder):first")[0]
      const match = $("a div span:contains(Kommende)")[0];
      return match ? [match] : [];
   }

   function callback(jNode) {
      console.log("Inside callback");
      if($("#addtoclip").is(":visible")) return
      //console.clear();
      clearInterval(intervalId);
      intervalId = 0;
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
      $("#transfer-events").click();
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
      data: `events=${events.join(",")}&club=${club}&token=${token}`
   }
   try {
      let res = await gmPost(args)
      if(res == "ok") {
         $("#transfer-events").html(`<div id="eventresults" style="color: brown; font-size:1.2em;margin-top:5px;font-weight: bold">${events.length} løb er nu overført til orienteringslob.dk</div>
         <p style="font-style: italic">Fik du ikke alle løbene med? Så genindlæs siden og prøv igen.</p>`);
         // await wait((Math.trunc(Math.random()*7)+3) * 1000);
         await getNextClub();
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
            ... args,
            onload: e => e.status == 200 ? resolve(e.response) : reject(e.response),
            onerror: reject,
            ontimeout: reject,
         })
      );
   });
}

async function gmGet(args) {
   return new Promise((resolve, reject) => {
      GM_xmlhttpRequest(
         Object.assign({
            method: 'GET',
            ... args,
            onload: e => e.status == 200 ? resolve(e.response) : reject(e.response),
            onerror: reject,
            ontimeout: reject,
         })
      );
   });
}

async function getNextClub() {
   let args = {
      url: "https://orienteringslob.dk/klubber.json"
   }
   // let url = location.href.match(/.*\//)[0];
   let url = location.href.replace(/(\/events|&sk=events)\b.*/,"/");
   let clubs = JSON.parse(await gmGet(args)).filter(k => k.field_facebook_page);
   let i = clubs.findIndex(k => k.field_facebook_page == url);
   let remaining = clubs.length-i-2;
   console.log(i,url);
   if(i+1 >= clubs.length) {
      console.log("Finished extracting event IDs");
      return;
   }
   let nextUrl = clubs[i+1].field_facebook_page + "events";
   if(nextUrl.match("profile.php")) nextUrl = nextUrl.replace("/events", "&sk=events");
   nextUrl = decodeURI(nextUrl);
   let qry = `?currentUrl=${encodeURIComponent(url)}&nextUrl=${encodeURIComponent(nextUrl)}&index=${i}&remaining=${remaining}`;
   console.log(qry);
   args = {
      url: "https://marlar.dk/weblogger.php/mo" + qry
   }
   //await gmGet(args);
   await wait((Math.trunc(Math.random()*7)+3) * 3000);
   location = nextUrl;
}



