// ==UserScript==
// @name         Ražba2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automaticky razí mince v Panském Dvoře
// @author       Darxeal
// @match        https://*/game.php?*screen=snob*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/399371/Ra%C5%BEba2.user.js
// @updateURL https://update.greasyfork.org/scripts/399371/Ra%C5%BEba2.meta.js
// ==/UserScript==

(function() {
    let active = GM_getValue("minting", false);

    let html = active ?
    `<div>
        <h1 style="color: red;">Ražba je aktivní!</h1>
        <div>
            Zhruba za minutu se vyrazí mince.
        </div>
        <div>
            <button id="deactivate-btn" class="btn">Deaktivovat</button>
        </div>
    </div>`
    :
    `<div>
        <h1>Ražba není aktivní</h1>
        <div>
            <button id="activate-btn" class="btn">Aktivovat</button>
        </div>
    </div>`;

    $("#content_value").find("td").eq(5).append(html);

    $("#activate-btn").click(() => {
        GM_setValue("minting", true);
        location.reload();
    });

    $("#deactivate-btn").click(() => {
        GM_setValue("minting", false);
        location.reload();
    });

    if (active) {
        let timeoutSeconds = 40 + Math.random() * 40;
        setTimeout(() => {
            if ($(".btn-default").length > 0) {
                $("#coin_mint_fill_max")[0].click();
                setTimeout(() => {
                    $(".btn-default")[0].click();
                }, 100);
                
            } else {
                location.reload();
            }
        }, timeoutSeconds * 1000);
    }
})();
