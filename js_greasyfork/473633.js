// ==UserScript==
// @name        c.ai Neo Panel Quickscroll
// @namespace   c.ai Neo Panel Quickscroll
// @match       https://*.character.ai/chat*
// @grant       none
// @version     1.7
// @author      Vishanka
// @license      MIT
// @description Adds Quickscroll Buttons and applies some visual fixes for chat2 like paragraphing and linebreak
// @icon        https://i.imgur.com/iH2r80g.png

(function() {
// @downloadURL https://update.greasyfork.org/scripts/473633/cai%20Neo%20Panel%20Quickscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/473633/cai%20Neo%20Panel%20Quickscroll.meta.js
// ==/UserScript==
'use strict';

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
}

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
}
//
//------------------------------Timed MutationObserver------------------------------
//
function waitForElement(querySelector, timeout) {
  return new Promise(function(resolve, reject) {
    var timer = false;
    if (document.querySelectorAll(querySelector).length) {
      return resolve();
    }
    const observer = new MutationObserver(function () {
      if (document.querySelectorAll(querySelector).length) {
        observer.disconnect();
        //console.log("Timed MutationObserver is disconnected");
        if (timer !== false) clearTimeout(timer);
        return resolve();
      }
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
    }
  });
}
//
//------------------------------Data in localStorage is saved across browser sessions------------------------------
//
var localStorage_nativedark = localStorage.getItem ("darkMode");
console.log("Native dark mode switch status =", localStorage_nativedark);
const localStorage_authorization = JSON.parse(localStorage.getItem('char_token')).value;
console.log("Authorization token =", localStorage_authorization);
//
//------------------------------Quickscroll buttons style------------------------------
//
function applyQuickScrollStyles() {
    if (window.location.href.includes('.character.ai/chat2')) {
        var quickscroll_buttons_style = document.createElement('style');
        quickscroll_buttons_style.classList.add('Reload_Autoscroll_script', 'quickscroll_buttons_style');
        quickscroll_buttons_style.innerHTML = `
            div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"] {
                cursor: pointer;
                user-select: none;
                position: absolute;
                top: 45%;
                right: 0;
                color: black;
                font-weight: 700;
                z-index: 10;
                font-family: swiper-icons;
                margin-top: 3px;
                transform: scale(0.6, 1.5);
            }
            div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"]:hover {
                color: #3c85f6;
            }
            div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"]::after {
                content: "next" "next";
            }
            div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"] {
                cursor: pointer;
                user-select: none;
                position: absolute;
                top: 45%;
                left: 0;
                color: black;
                font-weight: 700;
                height: 30px;
                z-index: 10;
                justify-content: center;
                align-items: center;
                font-family: swiper-icons;
                margin-top: 3px;
                transform: scale(0.6, 1.5);
            }
            div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"]:hover {
                color: #3c85f6;
            }
            div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"]::after {
                content: "prev" "prev";
            }
        `;
        document.body.appendChild(quickscroll_buttons_style);
    }
    else {
        var quickscroll_buttons_style = document.createElement('style');
        quickscroll_buttons_style.classList.add('Reload_Autoscroll_script', 'quickscroll_buttons_style');
        quickscroll_buttons_style.innerHTML = `
            div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"] {
                cursor: pointer;
                user-select: none;
                position: absolute;
                top: 53px;
                right: 0;
                color: black;
                font-weight: 700;
                height: 30px;
                z-index: 10;
                justify-content: center;
                align-items: center;
                font-family: swiper-icons;
                margin-top: 0px;
                transform: scale(0.6, 1.5);
            }
            div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"]:hover {
                color: #3c85f6;
            }
            div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"]::after {
                content: "next" "next";
            }
            div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"] {
                cursor: pointer;
                user-select: none;
                position: absolute;
                top: 53px;
                left: 0;
                color: black;
                font-weight: 700;
                height: 30px;
                z-index: 10;
                justify-content: center;
                align-items: center;
                font-family: swiper-icons;
                margin-top: 0px;
                transform: scale(0.6, 1.5);
            }
            div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"]:hover {
                color: #3c85f6;
            }
            div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"]::after {
                content: "prev" "prev";
            }
        `;
        document.body.appendChild(quickscroll_buttons_style);

    }
}

applyQuickScrollStyles();

//
//------------------------------When the whole page has loaded, including all dependent resources such as stylesheets, scripts, iframes, and images------------------------------
//
window.addEventListener('load', function () {
//

//------------------------------Quickscroll « and » buttons------------------------------
//

    var quickscroll_right_button = document.createElement('div');
    quickscroll_right_button.classList.add('Reload_Autoscroll_script', 'swiper-button-next-quickscroll');
    quickscroll_right_button.onclick = function (){
      event.stopPropagation();
      for (let step = 0; step < 10; step++) {
        ArrowRightKeyDown ();
      }
    };
    var quickscroll_left_button = document.createElement('div');
    quickscroll_left_button.classList.add('Reload_Autoscroll_script', 'swiper-button-prev-quickscroll');
    quickscroll_left_button.onclick = function (){
      event.stopPropagation();
      for (let step = 0; step < 10; step++) {
        ArrowLeftKeyDown ();
      }
    };
    function append_quickscroll_right_button () {
      if (document.querySelector('div[class="swiper-button-next"]')) {
        document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]').appendChild(quickscroll_right_button);
      } else if (document.querySelector('div[class="swiper-button-next swiper-button-disabled"]') && document.querySelector('div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"]')) {
        document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]').removeChild(quickscroll_right_button);
      }
    }
    function append_quickscroll_left_button () {
      if (document.querySelector('div[class="swiper-button-prev"]')) {
        document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]').appendChild(quickscroll_left_button);
      } else if (document.querySelector('div[class="swiper-button-prev swiper-button-disabled"]') && document.querySelector('div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"]')) {
        document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]').removeChild(quickscroll_left_button);
      }
    }
    waitForElement('div[class="swiper-wrapper"]', 60000).then(function () {
      //console.log("swiper-wrapper observer SUCCESS");
      append_quickscroll_right_button ();
      append_quickscroll_left_button ();
      const swipe_buttons_row_observer = new MutationObserver(function () {
        //console.log("swipe_buttons_row_observer fired");
        append_quickscroll_right_button ();
        append_quickscroll_left_button ();
      });
      swipe_buttons_row_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]>div:nth-of-type(3)'), {attributes: true, attributeFilter: ['class']});
      swipe_buttons_row_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]>div:nth-of-type(2)'), {attributes: true, attributeFilter: ['class']});
      const swipe_buttons_intermediate_observer = new MutationObserver(function () {
        //console.log("swipe_buttons_intermediate_observer fired");
        swipe_buttons_intermediate_observer.disconnect();
        if (document.querySelector('div[class="swiper-wrapper"]')) {
          swipe_buttons_row_observer.disconnect();
          swipe_buttons_row_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]>div:nth-of-type(3)'), {attributes: true, attributeFilter: ['class']});
          swipe_buttons_row_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]>div:nth-of-type(2)'), {attributes: true, attributeFilter: ['class']});
        }
      });
      const swipe_buttons_column_observer = new MutationObserver(function () {
        //console.log("swipe_buttons_column_observer fired");
        if (document.querySelector('div[class="swiper-wrapper"]')) {
          swipe_buttons_intermediate_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]'), {childList: true});
        }
      });
      swipe_buttons_column_observer.observe(document.querySelector('div[class="infinite-scroll-component "]'), {childList: true});
    }).catch(function() {
      console.log("swiper-wrapper observer ERROR");
    });


//



}, false);


//Styles to fix formatting

    window.addEventListener('load', function() {
        // Remove the margin from the specified selectors
        var styleTag = document.createElement('style');
    // Check if the current URL includes '.character.ai/chat2'
    if (window.location.href.includes('.character.ai/chat2')) {
// Adjusts the position of the swiper button to the original position of chat
      styleTag.innerHTML = '.chat2 .swiper-button-next, .chat2 .swiper-button-prev { margin-top: 0px !important; top: 45%; }';
    } else {
      styleTag.innerHTML = '.swiper-button-next, .swiper-button-prev { margin-top: 0px !important; top: 50px; }';
    }

    // Append the style tag to the document's head
    document.head.appendChild(styleTag);
  });


var css = `


.chat2 > div:nth-child(1) > div:nth-child(2) {
  box-shadow: 0px 1px 0px rgb(68, 71, 71);
}


`;

  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.setAttribute("type", 'text/css');
  style.innerHTML = css;
  head.appendChild(style);
})();