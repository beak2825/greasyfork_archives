// ==UserScript==
// @name        c.ai Neo Panel Swipe Numbers
// @namespace   c.ai Neo Panel Swipe Numbers
// @match       https://*.character.ai/chat*
// @grant       none
// @version     1.1
// @author      Vishanka
// @license      MIT
// @description Adds swipe Numbers to the Swipes
// @icon        https://i.imgur.com/iH2r80g.png


// @downloadURL https://update.greasyfork.org/scripts/473632/cai%20Neo%20Panel%20Swipe%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/473632/cai%20Neo%20Panel%20Swipe%20Numbers.meta.js
// ==/UserScript==
'use strict';
//
//------------------------------User settings------------------------------
//

const error500_persistent = true;
const NIGHT_label_glow = "darkgreen";

//------------------------------Arrow right keypress for swiping------------------------------
//
function ArrowRightKeyDown () {
  document.body.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      key: 'ArrowRight',
    })
  );
  console.log("Arrow right pressed");
};
//
//------------------------------Arrow left keypress for swiping------------------------------
//
function ArrowLeftKeyDown () {
  document.body.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      key: 'ArrowLeft',
    })
  );
  console.log("Arrow left pressed");
};
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

//
//------------------------------Data in localStorage is saved across browser sessions------------------------------
//
var localStorage_nativedark = localStorage.getItem ("darkMode");
console.log("Native dark mode switch status =", localStorage_nativedark);
const localStorage_authorization = JSON.parse(localStorage.getItem('char_token')).value;
console.log("Authorization token =", localStorage_authorization);

//------------------------------Bookmarking glow style------------------------------
//
function applyBookmarkStyles() {
    if (window.location.href.includes('.character.ai/chat2')) {

var swipe_label_bookmaring_style = document.createElement('style');
swipe_label_bookmaring_style.classList.add('Reload_Autoscroll_script', 'swipe_label_bookmaring_style');
swipe_label_bookmaring_style.innerHTML = `
div[class="swiper-wrapper"]>div[class^="swiper-slide"] .swipe-number-wrapper {
    position: absolute;
    top: 70px;
    left: 0px; /* If you want it on the left */
    background-color: rgb(60, 133, 246);
    color: white;
    font-weight: 600;
    font-size: 12px;
    border-radius: 0.25rem;
    padding: 0px;
    text-align: center;
    width: 45px; /* Set the desired base width */

  }
  div[class="swiper-wrapper"]>div[class^=swiper-slide][RAs_bookmarked="true"] .swipe-number-wrapper {
    background-image: linear-gradient(${NIGHT_label_glow}, transparent);
    background-color: transparent;
    height: 50%;
  }
`;
document.body.appendChild(swipe_label_bookmaring_style);
    }
else {
var swipe_label_bookmaring_style = document.createElement('style');
swipe_label_bookmaring_style.classList.add('Reload_Autoscroll_script', 'swipe_label_bookmaring_style');
swipe_label_bookmaring_style.innerHTML = `
div[class="swiper-wrapper"]>div[class^="swiper-slide"] .swipe-number-wrapper {
    position: absolute;
    top: 28px;
    left: 0px; /* If you want it on the left */
    background-color: rgb(60, 133, 246);
    color: white;
    font-weight: 600;
    font-size: 12px;
    border-radius: 0.25rem;
    padding: 0px;
    text-align: center;
    width: 45px; /* Set the desired base width */

  }
  div[class="swiper-wrapper"]>div[class^=swiper-slide][RAs_bookmarked="true"] .swipe-number-wrapper {
    background-image: linear-gradient(${NIGHT_label_glow}, transparent);
    background-color: transparent;
    height: 50%;
  }
`;
document.body.appendChild(swipe_label_bookmaring_style);


}
}
applyBookmarkStyles();

//------------------------------When the whole page has loaded, including all dependent resources such as stylesheets, scripts, iframes, and images------------------------------
//
window.addEventListener('load', function () {
//

//------------------------------500 Internal Server Error persistent notification------------------------------
//
  if (error500_persistent) {
    waitForElement('div[id="root"]>div[class="Toastify"]', 60000).then(function() {
      //console.log("Toastify observer SUCCESS");
      const error500_observer = new MutationObserver (function () {
        //console.log("error500_observer observer fired");
        if (document.querySelector('div[class*="Toastify__toast--error"]')) {
          console.log("500 Internal Server Error detected");
          document.querySelector('textarea[id="user-input"]').style.setProperty("background-color", "lightpink", "important");
          document.querySelector('textarea[id="user-input"]').setAttribute("placeholder", "   “500 Internal Server Error” was fired! Refresh the page!");
        };
      });
      error500_observer.observe(document.querySelector('div[id="root"]>div[class="Toastify"]'), {childList: true, subtree: true});
    }).catch(function() {
      console.log("Toastify observer ERROR");
    });
  };
//
//------------------------------Swipes numbering and bookmarking------------------------------
//

  function add_swipe_number() {
    var swipe_labels_text_NodeList = document.querySelectorAll('div[class="swiper-wrapper"]>div[class^="swiper-slide"]');
    for (let i = 0; i < swipe_labels_text_NodeList.length; i++) {
      if (!swipe_labels_text_NodeList[i].getAttribute('swipe_number_listener')) {
        const swipeNumberElement = document.createElement('span');
        swipeNumberElement.className = 'swipe-number';
        swipeNumberElement.textContent = i + 1;

        const swipeNumberWrapper = document.createElement('div');
        swipeNumberWrapper.className = 'swipe-number-wrapper';
        swipeNumberWrapper.appendChild(swipeNumberElement);

        swipe_labels_text_NodeList[i].appendChild(swipeNumberWrapper);

        swipe_labels_text_NodeList[i].setAttribute('swipe_number_listener', 'true');
        console.log(swipe_labels_text_NodeList[i].innerHTML);
      }
    }
  }

    function make_label_glow (arg1) {
      if (arg1.getAttribute('RAs_bookmarked')) {
        arg1.removeAttribute('RAs_bookmarked');
      } else if (!arg1.getAttribute('RAs_bookmarked')) {
        arg1.setAttribute('RAs_bookmarked', 'true');
      };
    };
function add_swipe_bookmark() {
  var swipe_labels_NodeList = document.querySelectorAll(
    'div[class="swiper-wrapper"]>div[class^="swiper-slide"]'
  );
  for (let i = 0; i < swipe_labels_NodeList.length; i++) {
    if (!swipe_labels_NodeList[i].getAttribute('swipe_bookmark_listener')) {
      const swipeNumberWrapper = swipe_labels_NodeList[i].querySelector('.swipe-number-wrapper');
      swipeNumberWrapper.addEventListener('click', function () {
        make_label_glow(swipe_labels_NodeList[i]);
      });
      swipe_labels_NodeList[i].setAttribute('swipe_bookmark_listener', 'true');
    }
  }
}


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

//


}, false);   ///   window.addEventListener('load', function () { closes here <---   ///