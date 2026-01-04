javascript:
// ==UserScript==
// @name         Pomaga w farmieniu
// @version      1.0
// @author       PTS
// @include        *://*.plemiona.pl/game.php?*screen=am_farm*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @description  pomaga farmić
// @namespace https://greasyfork.org/users/291327
// @downloadURL https://update.greasyfork.org/scripts/415460/Pomaga%20w%20farmieniu.user.js
// @updateURL https://update.greasyfork.org/scripts/415460/Pomaga%20w%20farmieniu.meta.js
// ==/UserScript==

var dane = {}
var max_page
var current_page
var next_page
var max_distance = 35;
$("#content_value").prepend(`<div><button class="btn" id="auto_a">START AUTO A</button></div><br><br><div><button class="btn" id="stop_a">STOP AUTO A</button></div><br><br><div id="stats"></div>`)



dane.link_dane = `https://${game_data.world}.plemiona.pl/game.php?&village=${game_data.village.id}&type=complete&mode=combined&page=-1&screen=overview_villages`
console.log(dane)

$(document).ready(function() {
    $.ajax({
        url:dane.link_dane,
        method:'POST',
        success:function(body) {
            var max_index = $(body).find("#combined_table tr").not(":first").length - 1
            var table = $(body).find("#combined_table tr").not(":first")
            var row = table.filter(".selected")
            max_page = parseInt($(".paged-nav-item").last().text().replace(/[^0-9\.]+/g,''));
            current_page = parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,''));
            next_page
            if (max_page == current_page) {
                next_page = 1
            } else {
                next_page = current_page + 1
            }
            if (max_index == table.index(row)) {sessionStorage.setItem('LAST_VILLAGE','1')}

            if (sessionStorage.getItem('AUTO_A') == '1') {
                setInterval(click_a,280 + Math.floor(Math.random() * 20))
            }
        }
    })
})


function click_a() {
    $.each($(".row_a,.row_b"), function() {
        mur = $(this).children("td:nth-child(7)").text().trim();
        odl = parseFloat($(this).children("td:nth-child(8)").text().trim());
        if ((mur != '?' && mur != '0' && mur != '1') || odl > max_distance) {
            $(this).remove();

        };
    });
    //


    var light_szablon = parseInt($("[name='light']").first().val());
    var light = Math.floor(parseInt($("#light").text())) / light_szablon;

    $("#stats").html(`Ilość A: ${$('#plunder_list').find(".farm_icon_a").not(".done").length}<br>
Ilość pakietów: ${Math.floor(light)}
`)

    if (light < 1) {sessionStorage.setItem("NEXT_VILLAGE","1");}
    if (max_page == current_page && $('#plunder_list').find(".farm_icon_a").not(".done").length == 0) {sessionStorage.setItem('NEXT_VILLAGE','1')}
    //
    var next_village = sessionStorage.getItem("NEXT_VILLAGE") || "0";

    if (sessionStorage.getItem('LAST_VILLAGE') == "1" && sessionStorage.getItem('NEXT_VILLAGE') == "1") {
        sessionStorage.setItem('AUTO_A','0');
        location.reload();
        return false;
    }

    if (next_village == "1" && current_page == 1) {
            sessionStorage.setItem("NEXT_VILLAGE","0");
            $(".arrowRight").click();
            $(".groupRight").click();
            return false;
    }

    if (next_village == "1" && current_page != 1) {
            $("a.paged-nav-item").first()[0].click();
            return false;
        }

    if ($('#plunder_list').find(".farm_icon_a").not(".done").length == 0 && light > 0 && current_page != max_page) {
        $("a.paged-nav-item:contains('["+next_page+"]')").first()[0].click()
        return false;
    }

    $('#plunder_list').find(".farm_icon_a").not(".done").first().click();
}

$(document.body).on('click','#auto_a',function() {sessionStorage.setItem("AUTO_A","1");sessionStorage.setItem('LAST_VILLAGE','0');sessionStorage.setItem('NEXT_VILLAGE','0');location.reload();})
$(document.body).on('click','#stop_a',function() {sessionStorage.setItem("AUTO_A","0");location.reload();})