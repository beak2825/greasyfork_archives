// ==UserScript==
// @name         Shop Wizard Beta Refresh
// @namespace    neopets
// @version      2020.01.16
// @description  You'll never want to use it without the script after this
// @author       Rippy
// @match        http://www.neopets.com/shops/wizard.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420250/Shop%20Wizard%20Beta%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/420250/Shop%20Wizard%20Beta%20Refresh.meta.js
// ==/UserScript==

/******************************************************************
 * Adapted from Rippy's script. Main changes:
 *
 * - You can now use the Shop Wizard when you're on a Faerie Quest.
 *
 * - Nicer styling
 *
 * - Original search form now remains on page upon a search.
 *    Useful for starting a new search immediately.
 *
 * - Auto toggle to "Identical to my phrase"
 *
 * - Minor fix for compatibility with diceroll's Search Helper.
 ******************************************************************/

// On regular SW, there is no server-side check for whether or not you're on a Faerie Quest.
if (!$(".wizard-faeriequest__2020").length) {
    // Hide the original form
    $("#shopWizardFormResults").hide();
}

// Replace it with our own
$("#pageDesc").html(`
<div id="userscriptSWResult" class="wizard-results__2020">
    <div class="wizard__2020">
        <div class="wizard-header">
            <div class="wizard-char wizard-char-img"></div>
            <h2>What are you looking for?</h2>
        </div>
        <div class="wizard-body">
            <div class="wizard-char-container">
                <div class="wizard-char wizard-char-img"></div>
            </div>

            <div>
                <input type="hidden" name="type" value="process_wizard">
                <input type="hidden" name="feedset" id="feedset" value="0">
                <div class="wizard-search">
                    <input type="text" id="shopwizard" value="" size="50" maxlength="60">
                    <button class="wizard-button-search button-default__2020 button-green__2020" id="submit_wizard">
                        <div class="button-search-white"></div>
                    </button>
                </div>
                <div class="wizard-filters">
                    <select id="criteria">
                        <option value="containing">Containing my phrase
                        </option>
                        <option value="exact">Identical to
                        </option>
                    </select>
                    <select name="wizard-area" id="wizard-area">
                        <option value="shop">In Shops</option>
                        <option value="gallery">In Galleries</option>
                    </select>
                </div>
                <div class="wizard-price">
                    <p class="wizard-price-text">Price:</p>
                    <input type="text" id="min_price" size="6" maxlength="6" value="0" placeholder="Min">
                    <div class="wizard-dash"></div>
                    <input type="text" id="max_price" size="6" maxlength="6" value="999999" placeholder="Max">
                </div>
            </div>
        </div>
    </div>
</div>
<div id="divRefresh" style="display:none;"><br><button id="refreshresults" style="margin: auto;" type="button" class="button-default__2020 button-green__2020 btn-single__2020 wizard-button__2020">Refresh Results</button></div>
<div id="bypassResults" class="wizard-results__2020"></div>
<br>
`);

// Initialise values, and search string if any
$("#criteria").val("exact");
if (location.search) {
    $("#shopwizard").val(
        (qs => {
            qs = qs.split("+").join(" ");
            let params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }
            return params;
        })(location.search)["string"]
    );
}
$("h1:contains('Shop Wizard')").html("Cheat Shop Wizard").parent().after(`<br><div style="font-size: 11pt; font-family: MuseoSansRounded500, Arial, sans-serif; width: 90%; margin: 5px auto; text-align: center;">Userscript is active! You can now refresh search results after a search.<br><br>Also, this wizard doesn't give a shit about "Ancient laws of magic" and<br>allows you to use him during a quest anyway. Fuck the faerie queen!<br><br>This userscript was originally written by <b>Rippy</b> of the r/neopets discord server.</div>`);

// Handlers
$("#shopwizard").on("keydown", function (e) {
    // Submit on pressing enter
    if (e.which === 13) {
        $("#submit_wizard").click();
    }
});

let resultsMaxHeight = 0;
$("#submit_wizard, #refreshresults").on("click", function () {

    $("#divRefresh").show();

    toggleButton($("#refreshresults"), "disable");
    toggleButton($("#submit_wizard"), "disable");

    $.ajax({
        type : "POST",
        url : "/np-templates/ajax/wizard.php",
        dataType : "html",
        data : {
            "type" : "process_wizard",
            "feedset" : 0,
            "shopwizard" : $("#shopwizard").val(),
            "table" : $("#wizard-area option:selected").val(),
            "criteria" : $("#criteria option:selected").val(),
            "min_price" : $("#min_price").val(),
            "max_price" : $("#max_price").val()
        },
        success : function (response) {
            $("#bypassResults").html(response);
            toggleButton($("#refreshresults"), "enable");
            toggleButton($("#submit_wizard"), "enable");

            // Retain max height of the search results so the window doesn't shift
            let height = parseFloat($("#bypassResults").css("height"));
            if (height > resultsMaxHeight) {
                resultsMaxHeight = height;
            }
            $("#bypassResults").css({"height" : resultsMaxHeight});

            // scroll to results (comment out if annoying)
            $("html, body").animate({
                scrollTop : $("#divRefresh").offset().top - 70
            }, 200);
        },
        error : function () {
            alert("Error");
            toggleButton($("#refreshresults"), "enable");
            toggleButton($("#submit_wizard"), "enable");
        }
    });
});

function toggleButton(selector, mode) {
    let thisClass = $(selector).attr("class");
    if (mode === 1 || mode === "enable") {
        $(selector).attr("class", thisClass.replace(/red/g, "green"));
        $(selector).prop("disabled", false);
    } else if (mode === 0 || mode === "disable") {
        $(selector).attr("class", thisClass.replace(/green/g, "red"));
        $(selector).prop("disabled", true);
    }
}