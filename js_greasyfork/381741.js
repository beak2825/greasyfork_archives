javascript:
// ==UserScript==
// @name         Super asystent farmera
// @version      2.3
// @author       PTS
// @include        *://*.plemiona.pl/game.php?*screen=am_farm*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @description  pomaga farmić
// @namespace https://greasyfork.org/users/291327
// @downloadURL https://update.greasyfork.org/scripts/381741/Super%20asystent%20farmera.user.js
// @updateURL https://update.greasyfork.org/scripts/381741/Super%20asystent%20farmera.meta.js
// ==/UserScript==

var max_dist;
var auto_c;
var i;

$(document).ready(function() {

    setTimeout(function() {
        var next_link;
        var prev_link;

        next_link = $("#village_switch_right").attr("href");
        prev_link = $("#village_switch_left").attr("href");
        $("#content_value").prepend('<button id="saf">Run A</button>&nbsp;&nbsp;&nbsp;&nbsp;<button id="safb">Run A</button><br><button id="auto_a">Run auto A</button>&nbsp;&nbsp;&nbsp;&nbsp;<button id="stop_auto_a">Stop auto A</button><br><br><div><button id="FARM_C">Farm C</button>&nbsp;&nbsp;<button id="start_auto_c">Start C (AUTO)</button>&nbsp;&nbsp;<button id="start_auto_c">Stop C (AUTO)</button></div><div id="FARM_C_DEBUG"></div><br><br><span id="count"></span><span id="wall"></span><br><a href="' + prev_link + '">Previous</a> | <a href="' + next_link + '">Next</a>');
        var farm_c_debug = '<br>';
        farm_c_debug += 'Ilość wiosek w grupie: '+$("#group_table tr").not(':first').length+'</br>';
        var searched = $("#group_table tr td.selected").closest('tr');
        var selected_id = $("#group_table tr").not(':first').index(searched)+1;

        farm_c_debug += 'Aktualna wioska w grupie: '+selected_id+'/'+$("#group_table tr").not(':first').length+'</br>';

        if (sessionStorage.getItem('max_distance') == null) {sessionStorage.setItem('max_distance',2) }
        max_dist = parseFloat(sessionStorage.getItem('max_distance'));
        auto_c = sessionStorage.getItem('auto_c') || "0";
        farm_c_debug += 'Auto C: '+auto_c+'</br>';
        farm_c_debug += 'Max odległość: '+max_dist+'</br>';
        $(document.body).find('#FARM_C_DEBUG').html(farm_c_debug);
        if (selected_id == 1) {sessionStorage.setItem('max_distance',parseFloat(sessionStorage.getItem('max_distance')) + 4)}
        if ($("#group_table tr").not(':first').length == 0 || $("#plunder_list").find(".farm_icon_c").not(".farm_icon_disabled").length == 0) {
            sessionStorage.setItem('auto_c',"0");
        }
        console.log(auto_c == "1");
        if (auto_c == "1") {
            console.log("ustawiam interwał");
            i = $("#plunder_list").find(".farm_icon_c").not(".farm_icon_disabled").length
            setInterval(function() {
                if ($(".error").length > 0) {$(".groupRight").closest('a')[0].click()};
                $(document.body).find("#FARM_C").click();
                console.log("puszczam...");
                i--;
            },580+getRandomInt(20,50))
        }
    },1000)



});

$(document.body).on('click','#start_auto_c',function() {sessionStorage.setItem('auto_c',"1");sessionStorage.setItem('max_distance',2);window.location.reload(true);})
$(document.body).on('click','#stop_auto_c',function() {sessionStorage.setItem('auto_c',"0");window.location.reload(true);})

$(document.body).on('click','#FARM_C',function() {
    farm_c_calculate(max_dist)
})

function farm_c_calculate(max_dist) {
    aktualna = $("#plunder_list").find(".farm_icon_c").not(".farm_icon_disabled").first().closest('tr')
    distance = parseFloat($(aktualna.find('td')[7]).text().trim())
    number_of_c = $("#plunder_list").find(".farm_icon_c").not(".farm_icon_disabled").length;
    if (distance <= max_dist) {
        aktualna.find(".farm_icon_c").click()
    } else {
        $(".groupRight").closest('a')[0].click()
    }
}

$("#saf").click(function() {


    // usun murki i wioski polozone za daleko
    var mur;
    var odl;
    var count = 0;

    $("#content_value").prepend('<span id="count"></span>');

    max_page = parseInt($(".paged-nav-item").last().text().replace(/[^0-9\.]+/g,''))
    current_page = parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,''))
    next_page = current_page+1

    //if ()


    $.each($(".row_a,.row_b"), function() {
        mur = $(this).children("td:nth-child(7)").text().trim();
        odl = parseFloat($(this).children("td:nth-child(8)").text().trim());
        if ((mur != '?' && mur != '0' && mur != '1') || odl > 35) {
            $(this).remove();
            count++;
        };
    });
    $("#wall").text(" | Usuniete wiersze z murem: " + count + " |");

    // pusc farme
    //$(".farm_icon_a").first().remove();
    var iter = $('#plunder_list').find(".farm_icon_a").not(".done").length;
    var light_szablon = parseInt($("[name='light']").first().val());
    var light = Math.floor(parseInt($("#light").text()) / light_szablon);
    var newi;

    if (light < iter) {count = light + 2;}
    else {count = iter + 2;}


    (function myLoop (i) {
        setTimeout(function () {
            $('#plunder_list').find(".farm_icon_a").not(".done").first().click();
            //$(".farm_icon_a").first().parent().parent().remove();
            newi = i - 1;
            $("#count").text(" | Zostało: "+newi+" | ");
            if (--i) {myLoop(i)};
        }, 225 + Math.floor(Math.random() * 20))
    })(count);

    $("#count").text(" | Zostało: 0 | ");

    if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) == 1 && Math.floor(parseInt($("#light").text())) / light_szablon < 1) {
        $(".arrowRight").click();
        $(".groupRight").click();
        return false;
    }
    if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) != 1 && Math.floor(parseInt($("#light").text())) / light_szablon < 1) {
        $("a.paged-nav-item").first()[0].click()
        return false
    }
    if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) == max_page && $('#plunder_list').find(".farm_icon_a").not(".done").length == 0) {
        $("a.paged-nav-item").first()[0].click()
        return false;
    }
    console.log(next_page)
    if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) != max_page && $('#plunder_list').find(".farm_icon_a").not(".done").length == 0) {
        $("a.paged-nav-item:contains('["+next_page+"]')").first()[0].click()
        return false;
    }

});


$("#safb").click(function() {


    // usun murki i wioski polozone za daleko
    var mur;
    var odl;
    var count = 0;

    $("#content_value").prepend('<span id="count"></span>');

    max_page = parseInt($(".paged-nav-item").last().text().replace(/[^0-9\.]+/g,''))
    current_page = parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,''))
    next_page = current_page+1

    //if ()


    $.each($(".row_a,.row_b"), function() {
        mur = $(this).children("td:nth-child(7)").text().trim();
        odl = parseFloat($(this).children("td:nth-child(8)").text().trim());
        if ((mur != '?' && mur != '0' && mur != '1') || odl > 35) {
            $(this).remove();
            count++;
        };
    });
    $("#wall").text(" | Usuniete wiersze z murem: " + count + " |");

    // pusc farme
    //$(".farm_icon_a").first().remove();
    var iter = $('#plunder_list').find(".farm_icon_b").not(".done").length;
    var light_szablon = parseInt($("[name='light']").not(':first').first().val());
    var light = Math.floor(parseInt($("#light").text()) / light_szablon);
    var newi;

    if (light < iter) {count = light + 2;}
    else {count = iter + 2;}


    (function myLoop (i) {
        setTimeout(function () {
            $('#plunder_list').find(".farm_icon_b").not(".done").first().click();
            //$(".farm_icon_a").first().parent().parent().remove();
            newi = i - 1;
            $("#count").text(" | Zostało: "+newi+" | ");
            if (--i) {myLoop(i)};
        }, 225 + Math.floor(Math.random() * 20))
    })(count);

    $("#count").text(" | Zostało: 0 | ");

    if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) == 1 && Math.floor(parseInt($("#light").text())) / light_szablon < 1) {
        $(".arrowRight").click();
        $(".groupRight").click();
        return false;
    }
    if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) != 1 && Math.floor(parseInt($("#light").text())) / light_szablon < 1) {
        $("a.paged-nav-item").first()[0].click()
        return false
    }
    if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) == max_page && $('#plunder_list').find(".farm_icon_b").not(".done").length == 0) {
        $("a.paged-nav-item").first()[0].click()
        return false;
    }
    console.log(next_page)
    if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) != max_page && $('#plunder_list').find(".farm_icon_b").not(".done").length == 0) {
        $("a.paged-nav-item:contains('["+next_page+"]')").first()[0].click()
        return false;
    }

});

document.addEventListener("keydown", function(event) {
    if (event.which == 118) {$("#saf").click();};
    if (event.which == 119) {$("#safb").click();};

});


$(document.body).on('click','#auto_a',function() {
    sessionStorage.setItem('AUTO_A',1);
    location.reload();
})

$(document.body).on('click','#stop_auto_a',function() {
    sessionStorage.setItem('AUTO_A',0);
})


$(document).ready(function() {
    if (sessionStorage.getItem('AUTO_A') == '1') {
        setTimeout(function() {console.log('start')},1000);
        var light_szablon = parseInt($("[name='light']").first().val());
        var light = Math.floor(parseInt($("#light").text()) / light_szablon);
        var max_page = parseInt($(".paged-nav-item").last().text().replace(/[^0-9\.]+/g,''));
        var current_page = parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,''));
        var next_page = current_page+1;
        (function myLoop (i) {
            setTimeout(function () {
                $('#plunder_list').find(".farm_icon_a").not(".done").first().click();
                if ($("div:contains('Nie ma żadnych wiosek w tej grupie.')").length > 0) {
                    sessionStorage.setItem('AUTO_A',0);
                }
                if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) == 1 && Math.floor(parseInt($("#light").text())) / light_szablon < 1) {
                    $(".arrowRight").click();
                    $(".groupRight").click();
                    return false;
                }
                if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) != 1 && Math.floor(parseInt($("#light").text())) / light_szablon < 1) {
                    $("a.paged-nav-item").first()[0].click()
                    return false
                }
                if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) == max_page && $('#plunder_list').find(".farm_icon_a").not(".done").length == 0) {
                    $("a.paged-nav-item").first()[0].click()
                    return false;
                }
                console.log(next_page)
                if (parseInt($("strong.paged-nav-item").first().text().replace(/[^0-9\.]+/g,'')) != max_page && $('#plunder_list').find(".farm_icon_a").not(".done").length == 0) {
                    $("a.paged-nav-item:contains('["+next_page+"]')").first()[0].click()
                    return false;
                }


                if (--i) {myLoop(i)};
            }, 280 + Math.floor(Math.random() * 20))
        })(200);


    }
})

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}