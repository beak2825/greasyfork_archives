// ==UserScript==
// @name         ChatGPT Tab Keeper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  To keep tabs not killed
// @author       CY Fung
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465861/ChatGPT%20Tab%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/465861/ChatGPT%20Tab%20Keeper.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // console.log(344);

  if (window.name === 'chatgpt-tab-keeper' && window !== top && location.pathname.includes('robots.txt')) {



    location.hash = '#' + Date.now();
    setTimeout(() => {
     // let db = document.dbForTabKeep;
     // if ('close' in db) db.close();

      Promise.resolve(0).then(() => {


        location.reload(true);
      });

    }, Math.floor(Math.random() * 5) * 1000 + 9000);


    /*
  setInterval(() => {

    location.hash = '#'+Date.now();

  }, 9000);
    */


/*

    // First, open a connection to a database
    const request = indexedDB.open('db_openai_tab_keep_db', 1);

    document.dbForTabKeep = request

    request.onsuccess = function (event) {
      const db = event.target.result;
      document.dbForTabKeep = db;

      // Do something with the database...

      // Close the request when you're done with the database
      db.close();
    };
*/


  } else if (window === top) {

    let iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      transform: 'scale(0.0001) translate(-200vh, -200vh)',
      opacity: 0,
      pointerEvents: 'none',
      display: 'block',
      width: '64px',
      height: '64px',
      position: 'fixed',
      top: '0px',
      left: '0px'
    });
      iframe.name='chatgpt-tab-keeper';
      iframe.setAttribute('referrerpolicy','no-referrer');
        iframe.setAttribute('sandbox',"allow-scripts");
    document.body.appendChild(iframe);
    iframe.src = 'https://chat.openai.com/robots.txt';



    // First, open a connection to a database
    const request = indexedDB.open('db_openai_tab_keep_db', 1);

    document.dbForTabKeep = request


  }

  // Your code here...
})();