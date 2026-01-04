// ==UserScript==
// @name        Replies numbering and "bookmarking" at character.ai
// @namespace   https://sleazyfork.org/en/users/927364-mozgovlom
// @match       https://beta.character.ai/chat2?char=*
// @grant       none
// @version     0.2.2
// @author      Mozgovlom
// @description Adds a serial number to character's message in a current roll; you can click on the label to "bookmark" it.
// @icon        https://characterai.io/static/logo512.png

// @downloadURL https://update.greasyfork.org/scripts/471690/Replies%20numbering%20and%20%22bookmarking%22%20at%20characterai.user.js
// @updateURL https://update.greasyfork.org/scripts/471690/Replies%20numbering%20and%20%22bookmarking%22%20at%20characterai.meta.js
// ==/UserScript==
'use strict';

// If enabled, will show reply number and will allow "bookmarking" on click. Don't mind this, this is here because it's optional in the main script.
// Default: true
const reply_numbering = true;


const DAY_label_glow = "green";                                                    //----------LIGHT mode; swipe bookmarking color goes inside " " ----------
const NIGHT_label_glow = "deeppink";                                               //----------DARK mode;  swipe bookmarking color goes inside " " ----------


//
//------------------------------Data in localStorage is saved across browser sessions------------------------------
//
var localStorage_nativedark = localStorage.getItem ("darkMode");
console.log("Native dark mode switch status =", localStorage_nativedark);
//
//------------------------------Timed MutationObserver------------------------------
//
function waitForElement(querySelector, timeout) {
  return new Promise(function(resolve, reject) {
    var timer = false;
    if (document.querySelectorAll(querySelector).length) {
      return resolve();
    };
    const observer = new MutationObserver(function () {
      if (document.querySelectorAll(querySelector).length) {
        observer.disconnect();
        //console.log("Timed MutationObserver is disconnected");
        if (timer !== false) clearTimeout(timer);
        return resolve();
      };
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    if (timeout) {
      timer = setTimeout(function() {
        observer.disconnect();
        //console.log("Timed MutationObserver is disconnected");
        reject();
      }, timeout);
    };
  });
};
//
if (localStorage_nativedark === "true") {
  var bookmark_glow_color = NIGHT_label_glow;
} else {
  var bookmark_glow_color = DAY_label_glow;
};
var swipe_label_bookmaring_style = document.createElement('style');
swipe_label_bookmaring_style.classList.add('Reload_Autoscroll_script', 'swipe_label_bookmaring_style');
swipe_label_bookmaring_style.innerHTML = `
  div[class="swiper-wrapper"]>div[class^="swiper-slide"]>div[class="row p-0 m-0"]>div[class="col-auto p-0"][RAs_bookmarked="true"] {
    background-image: linear-gradient(${bookmark_glow_color}, transparent);
    background-color: transparent;
    height: 50%;
  }
  div[class="swiper-wrapper"]>div[class^=swiper-slide]>div[class="row p-0 m-0"]>div[class="col-auto p-0"] {
    background-color: rgb(60, 133, 246);
    color: white;
    font-weight: 600;
    font-size: 12px;
    border-radius: 0.25rem;
    width: 45px;
    position: absolute;
    top: calc(45px/2);
    text-align: center;
  }
`;
//

//
//------------------------------When the whole page has loaded, including all dependent resources such as stylesheets, scripts, iframes, and images------------------------------
//
window.addEventListener('load', function () {
//
//------------------------------CSS------------------------------
//
  if (reply_numbering) {
    document.body.appendChild(swipe_label_bookmaring_style);
  };
//
//
//------------------------------Swipes numbering and bookmarking------------------------------
//
  if (reply_numbering) {
    function add_swipe_number () {
      var swipe_labels_text_NodeList = document.querySelectorAll('div[class="swiper-wrapper"]>div[class^="swiper-slide"]>div[class="row p-0 m-0"]>div[class="col-auto p-0"]');
      for (let i = 0; i < swipe_labels_text_NodeList.length; i++) {
        if (!swipe_labels_text_NodeList[i].getAttribute('swipe_number_listener')) {
          swipe_labels_text_NodeList[i].innerHTML = i + 1;
          swipe_labels_text_NodeList[i].setAttribute('swipe_number_listener', 'true');
          console.log(swipe_labels_text_NodeList[i].innerHTML); // This is left enabled intentionally because I like watching numbers go brrr.
        };
      };
    };
    function make_label_glow (arg1) {
      if (arg1.getAttribute('RAs_bookmarked')) {
        arg1.removeAttribute('RAs_bookmarked');
      } else if (!arg1.getAttribute('RAs_bookmarked')) {
        arg1.setAttribute('RAs_bookmarked', 'true');
      };
    };
    function add_swipe_bookmark () {
      var swipe_labels_NodeList = document.querySelectorAll('div[class="swiper-wrapper"]>div[class^="swiper-slide"]>div[class="row p-0 m-0"]>div[class="col-auto p-0"]');
      for (let i = 0; i < swipe_labels_NodeList.length; i++) {
        if (!swipe_labels_NodeList[i].getAttribute('swipe_bookmark_listener')) {
          swipe_labels_NodeList[i].addEventListener('click', function () {
            make_label_glow (swipe_labels_NodeList[i]);
          });
          swipe_labels_NodeList[i].setAttribute('swipe_bookmark_listener', 'true');
        };
      };
    };
    waitForElement('div[class="swiper-wrapper"]', 60000).then(function () {
      //console.log("swiper-wrapper observer SUCCESS");
      add_swipe_number ();
      add_swipe_bookmark ();
      const new_replies_row_observer = new MutationObserver(function () {
        //console.log("new_replies_row_observer fired");
        add_swipe_number ();
        add_swipe_bookmark ();
      });
      new_replies_row_observer.observe(document.querySelector('div[class="swiper-wrapper"]'), {childList: true});
      const new_replies_column_observer = new MutationObserver(function () {
        //console.log("new_replies_column_observer fired");
        if (document.querySelector('div[class="swiper-wrapper"]')) {
          new_replies_row_observer.disconnect();
          new_replies_row_observer.observe(document.querySelector('div[class="swiper-wrapper"]'), {childList: true});
        };
      });
      new_replies_column_observer.observe(document.querySelector('div[class="infinite-scroll-component "]'), {childList: true});
    }).catch(function() {
      console.log("swiper-wrapper observer ERROR");
    });
  };
//
//------------------------------comment name here------------------------------
//

}, false);   ///   window.addEventListener('load', function () { closes here <---   ///