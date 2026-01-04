// ==UserScript==
// @name         Basic gmail gbar
// @version      0.7.1
// @license      MIT
// @description  Changes the Basic Gmail bar to 2012 Gmail
// @author       Ian Hiew
// @match        *://mail.google.com/*
// @icon         https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico
// @grant        none
// @namespace https://greasyfork.org/users/782542
// @downloadURL https://update.greasyfork.org/scripts/429108/Basic%20gmail%20gbar.user.js
// @updateURL https://update.greasyfork.org/scripts/429108/Basic%20gmail%20gbar.meta.js
// ==/UserScript==

const d = document;

// here's a better way to get the email
// we get the innerHTML of gb4 before replacing it
// its from the boring toolbar btw

var userEmail = d.getElementsByClassName('gb4')[0].innerHTML;
console.log(userEmail); // if this shows its success :him:

// and do funny!!!
// add css or die
function changeDocumentHead(){
  var head = d.head;
  var link = d.createElement("link");

  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "https://hiew.neocities.org/gbar.css"; // previous site got flagged damn D:

  head.appendChild(link);
}
// You must disable csp to allow this, that means no full safari support. Sorry
function createScriptElement(src)
{
  // load the gbar js
  var shead = d.head;
  var script = d.createElement("script");

  script.onload = function()
  {
    console.log("gbar.js loaded");
  }
  script.src = src;
  shead.appendChild(script);
}
window.setTimeout(changeDocumentHead,50);
window.setTimeout(createScriptElement("https://hiew.neocities.org/gbar.js"),100)
window.setTimeout(createScriptElement("https://hiew.neocities.org/gbar3.js"),100);

// now replaceHtml
// we are funny and based

function replaceHtmlReal(){
var tochange = d.getElementById('guser');
tochange.innerHTML = `
<div id="mngb">
 <div id="gb">
  <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
   window.gbar&&gbar.eli&&gbar.eli()
  </script>
  <div id="gbw">
   <div id="gbz">
    <span class="gbtcb"></span>
    <ol id="gbzc" class="gbtc">
     <li class="gbt">
      <a
       class="gbzt"
       id="gb_1"
       href="https://www.google.com.my/webhp?tab=ww&amp;authuser=0"
       ><span class="gbtb2"></span><span class="gbts">Search</span></a
      >
     </li>
     <li class="gbt">
      <a
       class="gbzt"
       id="gb_2"
       href="https://www.google.com.my/imghp?hl=en&amp;tab=wi&amp;authuser=0"
       ><span class="gbtb2"></span><span class="gbts">Images</span></a
      >
     </li>
     <li class="gbt">
      <a
       class="gbzt"
       id="gb_8"
       href="https://maps.google.com.my/maps?hl=en&amp;tab=wl&amp;authuser=0"
       ><span class="gbtb2"></span><span class="gbts">Maps</span></a
      >
     </li>
     <li class="gbt">
      <a
       class="gbzt"
       id="gb_78"
       href="https://play.google.com/?hl=en&amp;tab=w8&amp;authuser=0"
       ><span class="gbtb2"></span><span class="gbts">Play</span></a
      >
     </li>
     <li class="gbt">
      <a
       class="gbzt"
       id="gb_36"
       href="https://www.youtube.com/?gl=MY&amp;tab=w1&amp;authuser=0"
       ><span class="gbtb2"></span><span class="gbts">YouTube</span></a
      >
     </li>
     <li class="gbt">
      <a
       class="gbzt"
       id="gb_426"
       href="https://news.google.com/?tab=wn&amp;authuser=0"
       ><span class="gbtb2"></span><span class="gbts">News</span></a
      >
     </li>
     <li class="gbt">
      <a
       class="gbzt gbz0l gbp1"
       id="gb_23"
       href="https://mail.google.com/mail/?tab=wm&amp;authuser=0"
       ><span class="gbtb2"></span><span class="gbts">Gmail</span></a
      >
     </li>
     <li class="gbt">
      <a
       class="gbzt"
       id="gb_49"
       href="https://drive.google.com/?tab=wo&amp;authuser=0"
       ><span class="gbtb2"></span><span class="gbts">Drive</span></a
      >
     </li>
     <li class="gbt">
      <a
       class="gbgt"
       id="gbztm"
       href="https://www.google.com.my/intl/en/about/products?tab=wh"
       aria-haspopup="true"
       aria-owns="gbd"
       onclick="gbar.tg(event,this)"
       ><span class="gbtb2"></span
       ><span id="gbztms" class="gbts gbtsa"
        ><span id="gbztms1">More</span><span class="gbma"></span></span
      ></a>
      <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
       document.getElementById('gbztm').addEventListener('click', function clickHandler() { gbar.tg(event,this); });
      </script>
      <div class="gbm" id="gbd" aria-owner="gbztm" style="visibility: hidden;">
       <div id="gbmmb" class="gbmc gbsb gbsbis">
        <ol id="gbmm" class="gbmcc gbsbic" style="max-height: 829px;">
         <li class="gbmtc">
          <a
           class="gbmt"
           id="gb_24"
           href="https://calendar.google.com/calendar?tab=wc&amp;authuser=0"
           >Calendar</a
          >
         </li>
         <li class="gbmtc">
          <a
           class="gbmt"
           id="gb_51"
           href="https://translate.google.com.my/?hl=en&amp;tab=wT&amp;authuser=0"
           >Translate</a
          >
         </li>
         <li class="gbmtc">
          <a
           class="gbmt"
           id="gb_10"
           href="https://books.google.com.my/?hl=en&amp;tab=wp&amp;authuser=0"
           >Books</a
          >
         </li>
         <li class="gbmtc">
          <a
           class="gbmt"
           id="gb_6"
           href="https://www.google.com.my/shopping?hl=en&amp;source=og&amp;tab=wf&amp;authuser=0"
           >Shopping</a
          >
         </li>
         <li class="gbmtc">
          <a
           class="gbmt"
           id="gb_31"
           href="https://photos.google.com/?tab=wq&amp;authuser=0&amp;pageId=none"
           >Photos</a
          >
         </li>
         <li class="gbmtc">
          <a
           class="gbmt"
           id="gb_25"
           href="https://docs.google.com/document/?usp=docs_alc&amp;authuser=0"
           >Docs</a
          >
         </li>
         <li class="gbmtc"><div class="gbmt gbmh"></div></li>
         <li class="gbmtc">
          <a
           href="https://www.google.com.my/intl/en/about/products?tab=wh"
           class="gbmt"
           >Even more »</a
          >
          <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
           document.querySelector('li > a.gbmt').addEventListener('click', function clickHandler() { gbar.logger.il(1,{t:66});; });
          </script>
         </li>
        </ol>
        <div class="gbsbt" style="opacity: 0;"></div>
        <div class="gbsbb" style="opacity: 0;"></div>
       </div>
      </div>
      <iframe
       tabindex="-1"
       id="gbs"
       src="javascript:''"
       aria-hidden="true"
       title="empty"
       style="visibility: hidden;"
       frameborder="0"
      ></iframe>
     </li>
    </ol>
   </div>
   <div id="gbg">
    <h2 class="gbxx">Account Options</h2>
    <span class="gbtcb"></span>
    <ol class="gbtc">
     <li class="gbt">
      <a
       class="gbgt"
       id="gbg4"
       href="https://profiles.google.com/?hl=en&amp;tab=wX&amp;authuser=0"
       aria-haspopup="true"
       aria-owns="gbd4"
       onclick="gbar.tg(event,this);"
       ><span class="gbtb2"></span>
       <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
        document.getElementById('gbg4').addEventListener('click', function clickHandler(event) { gbar.logger.il(50); gbar.tg(event,this); });
       </script>
       <span id="gbgs4" class="gbts gbtsa"
        ><span id="gbi4"><span id="gbi4m1">${userEmail}</span
         ><span class="gbma"></span></span></span
      ></a>
      <div class="gbm" id="gbd4" aria-owner="gbg4" guidedhelpid="gbd4">
       <div class="gbmc">
        <div id="gbmpdv">
         <div class="gbpc">
          <span id="gbmpn" class="gbps">Ian Doe</span>
          <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
           document.getElementById('gbmpn').addEventListener('click', function clickHandler(event) { gbar.logger.il(10,{t:69}); });
          </script>
          <span class="gbps2">${userEmail}</span>
          <div class="gbmlbw">
           <a
            id="gb_150"
            href="https://myaccount.google.com/?utm_source=OGB&amp;tab=wk&amp;authuser=0"
            class="gbmlb"
            >Google Account</a
           >
           <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
            document.getElementById('gb_150').addEventListener('click', function clickHandler(event) { gbar.logger.il(10,{t:150}); });
           </script>
           –<a href="https://policies.google.com/privacy?hl=en" class="gbmlb"
            >Privacy</a
           >
           <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
            document.querySelector('div.gbmlbw > a.gbmlb').addEventListener('click', function clickHandler(event) { gbar.logger.il(10,{t:149}); });
           </script>
          </div>
         </div>
        </div>
        <div id="gbmps">
         <div id="gbmpasb" class="gbsb gbsbis">
          <div id="gbmpas" class="gbsbic">
           <div id="gbmpm_0" class="gbmtc gbp0">
            <a
             id="gbmpm_0_l"
             href="https://www.google.com/webhp?authuser=0"
             class="gbmt"
             ><span class="gbmpiaw"
              ><img
               class="gbmpia"
               data-asrc="https://lh3.googleusercontent.com/ogw/ADea4I7d7MFiPquiRH91IyG2Qoy3tlT63ffAsxnck8S1gg=s48-c-mo"
               alt="Jun Ian"
               src="https://lh3.googleusercontent.com/ogw/ADea4I7d7MFiPquiRH91IyG2Qoy3tlT63ffAsxnck8S1gg=s48-c-mo"
               width="48"
               height="48"
             /></span>
             <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
              document.querySelector('span.gbmpiaw.gbxv > img.gbmpia').addEventListener('error', function clickHandler() { window.gbar&&gbar.pae?gbar.pae(this):this.loadError=1; });
             </script>
             <span class="gbmpnw"
              ><span class="gbps">Place Holder</span
              ><span class="gbps2"
               ><span class="gbps3">placeholder@gmail.com</span>
               (default)</span
              ></span
             ></a
            >
           </div>

          <div class="gbsbt" style="opacity: 0;"></div>
          <div class="gbsbb" style="opacity: 0;"></div>
         </div>
         <div id="gbmppc" class="gbxx gbmtc">
          <a class="gbmt" href="https://plus.google.com/u/0/dashboard"
           ><span class="gbmppci"></span>All your Google+ pages ›</a
          >
         </div>
        </div>
        <table id="gbmpal">
         <tbody>
          <tr>
           <td class="gbmpala">
            <a
             role="button"
             href="https://accounts.google.com/AddSession?hl=en&amp;continue=https://mail.google.com/mail/h"
             class="gbqfbb"
             >Add account</a
            >
           </td>
           <td class="gbmpalb">
            <a
             target="_top"
             role="button"
             id="gb_71"
             href="https://accounts.google.com/Logout?hl=en&amp;continue=https://www.google.com/&amp;timeStmp=1625789247&amp;secTok=.AG5fkS8DQaQI8UgxJx-Gc2wrqfC1V06ASQ&amp;ec=GAdAAQ"
             class="gbqfbb"
             >Sign out</a
            >
            <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
             document.getElementById('gb_71').addEventListener('click', function clickHandler(event) { gbar.logger.il(9,{l:'o'}); });
            </script>
           </td>
          </tr>
         </tbody>
        </table>
       </div>
      </div>
     </li>
     <li class="gbt gbtb"><span class="gbts"></span></li>
     <noscript
      ><li class="gbt">
       <a
        class="gbgt"
        href="https://accounts.google.com/Logout?hl=en&continue=https://www.google.com/&timeStmp=1625789247&secTok=.AG5fkS8DQaQI8UgxJx-Gc2wrqfC1V06ASQ&ec=GAdAAQ"
        ><span class="gbtb2"></span><span class="gbts">Sign out</span></a
       >
      </li>
      <li class="gbt gbtb"><span class="gbts"></span></li
     ></noscript>
     <li class="gbt">
      <a
       class="gbgt"
       id="gbg5"
       href="http://www.google.com.my/preferences?hl=en"
       title="Options"
       aria-haspopup="true"
       aria-owns="gbd5"
       onclick="gbar.tg(event,this);"
       ><span class="gbtb2"></span
       ><span id="gbgs5" class="gbts"><span id="gbi5"></span></span
      ></a>
      <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
       document.getElementById('gbg5').addEventListener('click', function clickHandler() { gbar.tg(event,this); });
      </script>
      <div class="gbm" id="gbd5" aria-owner="gbg5">
       <div class="gbmc">
        <ol id="gbom" class="gbmcc">
         <li class="gbkc gbmtc">
          <a class="gbmt" href="?&v=prg">Settings</a>
         </li>
         <li class="gbmtc"><div class="gbmt gbmh"></div></li>
         <li class="gbkp gbmtc">
          <a
           class="gbmt"
           href="/?nocheckbrowser=true"
           >Normal Gmail</a
          >
         </li>
        </ol>
       </div>
      </div>
     </li>
    </ol>
   </div>
  </div>
  <div id="gbx3"></div>
  <div id="gbx4"></div>
  <script nonce="rQKKL1czeZ9pyOU7fZDwWw==">
   window.gbar&&gbar.elp&&gbar.elp()
  </script>
 </div>
</div>

`;
};
window.setTimeout(replaceHtmlReal,100);


// additional circuitry for gbar dropdowns

/*
var gbarObject = d.getElementById("gb-more");
console.log(gbarObject);

// the replace stuff
function gbarReplace(closeDown)
{
  if (closeDown == true)
  {
    d.getElementById("gbd").removeAttribute("style");
  }
}
*/