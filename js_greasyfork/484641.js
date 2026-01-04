// ==UserScript==
// @name         Gmail Filter From Email Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a "Filter All" button to the left of the received time on gmail emails. Clicking it does the same thing as the "filter messages like this" menu button.
// @author       Patrick Daniel
// @match        https://mail.google.com/mail/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484641/Gmail%20Filter%20From%20Email%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/484641/Gmail%20Filter%20From%20Email%20Button.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    const NewEL = (tag, prop) => Object.assign(document.createElement(tag), prop);

    document.addEventListener("mousemove", e => {
        //$(document).on("click mousedown mouseup focus blur keydown change", console.log("move"));
        //console.log($(".gH.bAk"));

        if(document.querySelector(".gH.bAk span") && !document.querySelector(".gH.bAk span button")){
            var email = document.querySelector(".go")?.textContent?.replace('<', '')?.replace('>', '');
            var url = `https://mail.google.com/mail/u/1/#create-filter/from=${encodeURIComponent(email)}&sizeoperator=s_sl&sizeunit=s_smb`
            const EL_btn = NewEL("button", {
                textContent: "Filter All",
                onclick() {
                    window.location.href = url;
                    //window.open(url);
                    //window.focus();
                    //window.open(url, '_blank');
                },
            });
            $(document.querySelector(".gH.bAk span")).prepend(EL_btn);
        }
        if(document.querySelector(".gH.bAk span button").attributes.length == 0){
            document.querySelector(".gH.bAk span button").setAttribute('style', `border-radius: 10px; font-size: medium; margin: 0 5px; border: solid #cdcdcd 1px; background: #f1f1f1; padding: 3px 13px;`)
        }
    })

    /*const observer = new MutationObserver(m => {
        console.log(m);
        console.log($)
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });*/
})();