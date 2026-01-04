// ==UserScript==
// @name         U2 FL Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Just a quick magic set
// @author       solomax
// @match        https://u2.dmhy.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/438466/U2%20FL%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/438466/U2%20FL%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentUCoins() {
        return parseFloat($("#info_block span.ucoin-notation").attr("title").replace(",", ""));
    }

    function addQuickMagicButtons(baseform, typeid, hrs, buttonid, name, ord) {
        let form = $(baseform).clone();
        $(form).find(typeid).prop("checked", true).trigger("click");
        $(form).find("input[name='hours']").val(hrs);
        let serialized = $(form).serialize();
        console.log(serialized);
        let ready = false;
        $.post("promotion.php?test=1", serialized, function (data, status, xhr) {
            let forbidden = true, button = "", message = "", price = 0.0, disabled = false;
            if (data.status == "operational" || data.status == "insufficient") {
                forbidden = false;
                button = "Magic it";
                message = data.price;
                price = parseFloat($(data.price).attr("title").replace(",", ""));
                disabled = (data.status == "insufficient");
            } else {
                forbidden = true;
            }
            if (!forbidden) {
                $("a[href*='promotion.php?action=magic&torrent=']").parent().append($(`<span class="quickMagic" order="${ord}">`).append("&nbsp;&nbsp;")
                    .append(
`<script>
function ${buttonid}() {
    let serialized = "${serialized}";
    $.post("promotion.php", serialized, function (data, status, xhr) {
        if (data.includes(\`<script type="text/javascript">window.location.href = '?action=detail&id=\`)) {
            location.reload();
        } else {
            console.log("ERROR DURING PROMOTION!");
            console.log("serialized: " + serialized);
            console.log("html res: " + data);
            $("#${buttonid}-price").html("Error! Check logs").css("color", "red");
        }
    });
}
</script>`).append(`<button id="${buttonid}" type="button" onclick="${buttonid}();">${name}</button>`).append(`<span id="${buttonid}-price">${message}</div>`));
                if (disabled) {
                    $(`#${buttonid}`).prop("disabled", true)
                }
            }
            $(".quickMagic").sort(function(a, b){
                return +$(a).attr('order') - +$(b).attr('order');
            }).appendTo($("a[href*='promotion.php?action=magic&torrent=']").parent());
        }, "json");
    }

    if (window.location.href.includes("details.php")) {
        console.log("We're on details page!");
        let id = (new URLSearchParams(window.location.search)).get('id');
        console.log("ID: " + id);
        GM.xmlHttpRequest({
            method:     "GET",
            url:        "https://u2.dmhy.org/promotion.php?action=magic&torrent=" + id,
            onload(response) {
                if (response.status === 200) {
                    console.log("Got magic page!");
                    var parser = new DOMParser();
                    var ajaxDoc = parser.parseFromString(response.responseText, "text/html");
                    var form = ajaxDoc.querySelectorAll("form:not([style])");
                    $(form).attr("action", "promotion.php");
                    console.log("Test - button name: " + $(form).find("#btn_query").val());
                    let ord = 0;
                    addQuickMagicButtons(form, "#s_user_self", "24", "selfFl1d", "FL 24h", ord++);
                    addQuickMagicButtons(form, "#s_user_self", "72", "selfFl3d", "FL 3d", ord++);
                    addQuickMagicButtons(form, "#s_user_everyone", "24", "globalFl1d", "GFL 24h", ord++);
                    addQuickMagicButtons(form, "#s_user_everyone", "72", "globalFl3d", "GFL 3d", ord++);
                    addQuickMagicButtons(form, "#s_user_everyone", "168", "globalFl7d", "GFL 1w", ord++);
                }
            }
        });
        GM.xmlHttpRequest({
            method:     "GET",
            url:        "https://u2.dmhy.org/promotion.php?action=torrent&id=" + id,
            onload(response) {
                if (response.status === 200) {
                    console.log("Got promotions page!");
                    var parser = new DOMParser();
                    var ajaxDoc = parser.parseFromString(response.responseText, "text/html");
                    var table = ajaxDoc.querySelectorAll("#outer .embedded table[width='99%']");
                    let good = 0;
                    $(table).find("tr").each(function (i) {
                        if (i !== 0 && $(this).find("td:nth-child(9)").text() !== "Effective") {
                            $(this).remove();
                        } else if (i !== 0) {
                            good++;
                        }
                    });
                    console.log(`found ${good} good promotions`);
                    if (good > 0) {
                        let row = $(`<tr>
<td class="rowhead nowrap" valign="top" align="right">Ongoing promotions</td>
<td class="rowfollow" valign="top" align="left"></td>
</tr>`);
                        $(row).find("td:nth-child(2)").append($(table));
                        $("a[href*='promotion.php?action=magic&torrent=']").parent().parent().after(row);
                    }
                }
            }
        });
    }
})();