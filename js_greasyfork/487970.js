// ==UserScript==
// @name         [Neopets] Grave Danger Random Diver
// @namespace    https://greasyfork.org/en/scripts/487970
// @version      0.4
// @description  Adds a button that sends a random petpet off to the catacombs, without any equipment.
// @author       Piotr Kardovsky
// @match        https://www.neopets.com/halloween/gravedanger/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @license      MIT
// @require      http://code.jquery.com/jquery-latest.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/487970/%5BNeopets%5D%20Grave%20Danger%20Random%20Diver.user.js
// @updateURL https://update.greasyfork.org/scripts/487970/%5BNeopets%5D%20Grave%20Danger%20Random%20Diver.meta.js
// ==/UserScript==
var $ = window.jQuery;

const GDU = "https://www.neopets.com/halloween/gravedanger/";

(function() {
    'use strict';
    let pname = null;
    let doAgain = () => {
            $.post(GDU, {'again':'1'}, (r) => {
                let match = r.match(/(petpets: \{"[\s\S]+"\}),/)[0];
                match = "{\"petpets\"" + match.substring(7, match.length-1) + "}";
                let getGD = JSON.parse(match);
                let pArr = Object.keys(getGD.petpets);
                pname = pArr[Math.floor(Math.random() * (pArr.length - 1) + 1)];
                //console.log(pArr, pname);
                setTimeout( () => {
                    $.post(GDU, {'neopet':pname, 'equipped':"0"}, (m) => { location.reload(); });
                }, Math.floor(Math.random() * 400 + 600))
            });
    }

    let rndAgn = $('<button/>').addClass('button-default__2020 button-blue__2020 rndAgnBtn').css({'margin':'0px auto', 'width':'50%'}).text('Dive again with a random Petpet!').on('click', (e) => { e.preventDefault(); doAgain(); });

    $(document).ready(() => {
        $('#gdSelection .select:contains("Choose a Petpet!")').before(rndAgn);
        $('.gdForm').prepend($('<br/>'),rndAgn.clone(true, true));
    });
})();