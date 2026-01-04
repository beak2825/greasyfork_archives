// ==UserScript==
// @name         Omegle Enhanced
// @version      0.22
// @description  Adds features to Omegle: timestamps, interest-only chats
// @author       penishaver666
// @namespace    penishaver666
// @match        *://*.omegle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465203/Omegle%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/465203/Omegle%20Enhanced.meta.js
// ==/UserScript==

(function() {

  function stickyInterests() { // only connect to people with common interests, will look for common interests indefinitely
    window.COMETBackend.prototype.stopLookingForCommonLikes = function(){}; // don't give up!!! ganbare!!!
    console.log('# sticky interests good!');
  }

  function getNiceTime() { // human readable timestamp, HH:MM
    const d = new Date();
    return d.getHours() + ":" + d.getMinutes().toString().padStart(2, "0");
  }

  function win(){ // use unsafeWindow if available
      try{return unsafeWindow;} catch(e) {return window;}
  }

  function timestampify() { // insert timestamps into chat msgs as they appear
    // copied most of this from stackoverflow so idk wtf half of this does desu (stackoverflow.com/questions/49115851)
    let window = win(); // needs to be from a named function else it breaks! idk why
    window.Timestamp$Element = window.Element;
    window.Element = function (a, b) {
      let elem = window.Timestamp$Element(a, b);
      if (typeof a == "string" && b && (b.class == "youmsg" || b.class == "strangermsg")) { // match user msgs
        let stamp = new window.Timestamp$Element("span", {"class": "msgsource"}); // give timestamp the same class as names, so same formatting
        stamp.appendText(getNiceTime() + " | "); // separator between time and name
        elem.grab(stamp);
      }
      return elem;
    };
    Object.assign(window.Element, window.Timestamp$Element);
    console.log('# timestamps good!');
  }

  function noticeInterestOnlyChat() { // add a little notice under tags that interest-only chat is on
    let parentElem = document.querySelector('#topicsettingscontainer > div:nth-child(1) > div:nth-child(2)');
    let noticeElem = document.createElement('div');
    noticeElem.innerHTML = "<div style='padding: 4px; border-radius: 3px / 5px; position: relative; color: white; background: linear-gradient(180deg, rgb(0, 0, 0), rgb(60, 60, 60));'>Interests-Only Chat is ON. You will only match with people with one of these interests. You might be waiting a while for less-populated tags!</div>";
    parentElem.insertAdjacentElement('beforeend', noticeElem.firstChild);
    console.log('# notice added!');
  }

  window.addEventListener('load', function () {
    console.log('# starting...');
    stickyInterests();
    timestampify();
    noticeInterestOnlyChat();
    console.log('# done.');
  })

})();