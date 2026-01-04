// ==UserScript==
// @name         Don't Train
// @namespace    https://greasyfork.org/en/scripts/383075-don-t-train
// @version      0.2
// @description  Disables the gym to prevent you from training while stacking.
// @author       cryosis7 [926640]
// @match        *.torn.com/gym.php*
// @downloadURL https://update.greasyfork.org/scripts/383075/Don%27t%20Train.user.js
// @updateURL https://update.greasyfork.org/scripts/383075/Don%27t%20Train.meta.js
// ==/UserScript==

const EXPLICIT_MODE = true;
const TERRY_CRUZ = true;

$(window).load(function() {
    $('#gymroot').replaceWith(`
    <div class='m-top10'>
        <div class='title-black top-round' aria-level='5'>STOP</div>
        <div class="bottom-round cont-gray p10">
        <p>    
        ${!EXPLICIT_MODE ?
            "You are <span style='color: red; font-weight:bold'>NOT</span> allowed to train right now!"
            : "YOU SON OF A BITCH, <span style='color: red; font-weight:bold'>DON'T</span> YOU FUCKING <u>DARE</u> SPEND THAT ENERGY!"
        }
        </p><br/>
        ${TERRY_CRUZ ?
            "</br><center><img src=https://i.imgur.com/CFPkW8Z.jpg width=80%/></center>" : ""
        }
        <br/>
        <p>If you want to train, disable this script.</p>
        </div>
        <hr class="page-head-delimiter m-top10">
        </div>
    `)
    $('.doctorn-widgets').remove();
});