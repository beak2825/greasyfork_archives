// ==UserScript==
// @name          Tag Checker
// @description   Show D2JSP BNP PokerStatus user
// Credits to fokse for creating this tampermonkey script

// @include   https://forums.d2jsp.org/topic.php?t=*
// @include   https://forums.d2jsp.org/user.php?i=*
// @include   https://forums.d2jsp.org/pm.php?*
// @include https://forums.d2jsp.org/forum.php?f=104
// @include https://forums.d2jsp.org/forum.php?f=104&o=*
// @include https://forums.d2jsp.org/guild.php*
// @include https://forums.d2jsp.org/users.php?a=1&f=*
// @include https://forums.d2jsp.org/index.php?*act=Friends*
// @include https://forums.d2jsp.org/index.php?
// @require https://code.jquery.com/jquery-latest.js
// @include https://forums.d2jsp.org/gold.php*
// @version 1.26
// @namespace https://greasyfork.org/users/371129
// @downloadURL https://update.greasyfork.org/scripts/390137/Tag%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/390137/Tag%20Checker.meta.js
// ==/UserScript==
var TAG_LIST = ["Unknown", "Mediator", "Trusted", "Regular", "Paid Back", "⛔ Blacklist ⛔", "📛 Welcher 📛"],
    COLOR = ["#2b2525", "#326110", "#3f5dce", "#f3ede5", "#f50ea1", "#f7f4f6", "#ef7272"],
    COLOR_2 = ['#615a5a','#178616','#2360af', 'orange','#dc26e6', 'black', 'red' ],
    BACKGROUND = ["#dad1d138", "#d8ecc8", "#d3e6f5", "#c37514", "#ecc1ec", "#151415", "#151415"];





var PAGE_TYPE = window.location.href.match(/\/topic\.php/) ? 'topic' :
    window.location.href.match(/act\=Friends/) ? 'friend' :
    window.location.href.match(/\/users\.php\?a=1\&f\=/) ? 'userlist' :

    window.location.href.match(/\/pm\.php\?c\=3/) ? 'pm' :
    window.location.href.match(/\/user\.php/) ? 'user' :
    window.location.href.match(/\/guild\.php/) ? 'guild' :
    window.location.href.match(/\/gold\.php/) ? 'gold' :
    'UNKNOWN';

function getSticky(){



    if (!window.location.href.match(/\/forum\.php\?f\=104/)){
        return;
    }

    $.ajax({
        type: 'GET',
        url: 'https://bnp.tools/api/links',
        dataType: 'JSON',
        success: function(jsonResult) {
            var sticky = '<tr><td><div class="sX s0a"></div></td><td class="lc links" colspan="5">Help:';
            jsonResult.forEach(function(element) {
                sticky += `<a href="${element.url}"><b>${element.display}</b></a>`;
            });
            sticky += '</td></tr>';
            $('body dl dd table.ftb tbody tr:eq(1)').before(sticky);
        }
    });
}
function showSingleLog(link, uid){

    var offset = jQuery(link).offset();
    $('#psFieldset').css({top:offset.top,left:offset.left}).show();
    $('#psFieldset LEGEND SPAN').html("View tag history");
    $('#psFieldset DIV.main').html('<center><img src="https://bnp.tools/load.gif"></center>');

      $.ajax({
        type: 'GET',
        url:`https://bnp.tools/api/description/${uid}`,
        success: function(response)
        {
            $('#psFieldset DIV.main').html(response);
        },

        error: function(httpCode) {
            $('#psFieldset DIV.main').html('<center><i>Error retrieving data from server</i></center>');
        }
    });

};

function getStatus(userId) {
    $.ajax({
        type: 'GET',
        url: `https://bnp.tools/api/status/${userId}`,
        dataType: 'JSON',
        error: function(httpCode) {
            $(`div#pokerstatus_${jsonResult.id}`).each(function() {
                switch (PAGE_TYPE) {
                    case 'user':
                        $(this).html(`<i>Error retrieving data from server</i> `);
                        break;
                    case 'topic':
                    case 'pm':
                         $(this).html(`<a href=\"javascript:void(0);\">Poker Status: <i>Error</i></a> `)
                        break;
                }

            });

        },

        success: function(jsonResult) {


            $(`div#pokerstatus_${jsonResult.id}`).each(function() {
                switch (PAGE_TYPE) {
                    case 'user':
                        $(this).html(`
                            <table class="ftbt">
                                <tbody>
                                    <tr><td align="right"><b>Status:</b></td><td><b><span style="color: ${COLOR[jsonResult.results == false ? 0 : jsonResult.results[1]]};background: ${BACKGROUND[jsonResult.results == false ? 0 : jsonResult.results[1]]};opacity: 0.9;font-weight: bold;padding-left: 5px;padding-right: 5px;padding-top: 1px;padding-bottom: 1px;border-radius: 10px;">${jsonResult.results == false ? 'Unknown' : TAG_LIST[jsonResult.results[1]]}</span></b></td></tr>
                                    ${(jsonResult.results[2] && jsonResult.results[3].indexOf("#") != -1) || (jsonResult.results[3] )  ? `<tr class="bts">`: ''}
                                    ${jsonResult.results[2] && jsonResult.results[2].indexOf("#") != -1 ? `<td align="right" nowrap="">Discord:</td><td>${jsonResult.results[2]}</td></tr>`: ''}
                                    ${jsonResult.results[3]  ? `<tr><td align="right" nowrap="">PokerStars:</td><td>${jsonResult.results[3]}</td></tr>`: ''}

                                    ${jsonResult.results[4] || jsonResult.results[5]  ? `<tr class="bts"><td></td><td align="right" nowrap=""><a id="tag_history" href="javascript:void(0);">View tag history</a></td></tr>`: ''}
                                </tbody>
                            </table>
                        `);

                        if (jsonResult.results[4] || jsonResult.results[5]){
                            $("#tag_history").click(function(){
                                showSingleLog(this, jsonResult.id)
                            });
                        }


                        break;
                    case 'gold':
                    case 'guild':
                    case 'friend':
                        $(this).html(`<span style="font-size: 8px;color: ${COLOR[jsonResult.results == false ? 0 : jsonResult.results[1]]};background: ${BACKGROUND[jsonResult.results == false ? 0 : jsonResult.results[1]]};opacity: 0.9;font-weight: bold;padding-left: 5px;padding-right: 5px;padding-top: 1px;padding-bottom: 1px;border-radius: 10px;">${jsonResult.results == false ? 'Unknown' : TAG_LIST[jsonResult.results[1]]}</span>`)

                        break;
                    case 'userlist':
                        console.log(jsonResult.results)
                        if (jsonResult.results != 0 && jsonResult.results[1] != 0){
                            $(this).html(` (<span style="font-weight:bold;color: ${COLOR_2[jsonResult.results == false ? 0 : jsonResult.results[1]]}">${jsonResult.results == false ? 'Unknown' : TAG_LIST[jsonResult.results[1]]}</span>)`)
                        }
                        break;
                    break;
                    case 'topic':
                    case 'pm':

                         $(this).html(`<a href=\"javascript:void(0);\">Poker Status:</a> <span style="font-size: 8px;color: ${COLOR[jsonResult.results == false ? 0 : jsonResult.results[1]]};background: ${BACKGROUND[jsonResult.results == false ? 0 : jsonResult.results[1]]};opacity: 0.9;font-weight: bold;padding-left: 5px;padding-right: 5px;padding-top: 1px;padding-bottom: 1px;border-radius: 10px;">${jsonResult.results == false ? 'Unknown' : TAG_LIST[jsonResult.results[1]]}</span>`)


                        if (jsonResult.results != false) {
                            if (jsonResult.results[2] && jsonResult.results[2].indexOf("#") !== -1) {
                                $(this).append(`<br>Discord: ${jsonResult.results[2]}`)
                            }
                            if (jsonResult.results[3]) {
                                $(this).append(`<br>PokerStars: ${jsonResult.results[3]}`)
                            }
                            if (jsonResult.results[4] || jsonResult.results[5]){
                                $($($(this).append(`<br><div class="view_log></div>`)).append(`<a  href="javascript:void(0);">View tag history</a>`)).click(function(){showSingleLog(this, jsonResult.id)});
                            }
                     }
                     break;
                 }

             });
}
});


}

function parsePage() {
    var checked = [],
        userid;

    switch (PAGE_TYPE) {
        case "pm":
            userid = $('body > form > dl.c > dt > a').attr('href').split('=')[1];
            $('body > form > dl.c > dd > div.bts.ppc > div.desc.p3.pud').append(`<div id="pokerstatus_${userid}"><a href="javascript:void(0);">Poker Status:</a> Loading...</div>`);
            getStatus(userid);
            break;
        case "friend":
            $('body > dl > dd > table > tbody > tr:nth-child(1) > th:last-child').after('<th>Poker Status</th>');
            $('body > dl > dd > table > tbody > tr').each(function(){
                if (typeof $('td:nth-child(3) a', this).attr('href') !== 'undefined'){
                    var userid = $('td:nth-child(3) a', this).attr('href').split("=")[1]
                    // console.log(userid)
                    $(this).append(`<td><div style="display: inline;" id="pokerstatus_${userid}"></div></td>`);
                    getStatus(userid);
                }

            })
        break;
        case "userlist":
            console.log("User list")
            $('body > dl > dd > table > tbody > tr:nth-child(2) > td > a').each(function(){
                 var userid = $(this).attr('href').split("=")[1]
                $(this).after(`<div style="display: inline;" id="pokerstatus_${userid}"></div>`);
                getStatus(userid);
            })
        break;

        case "user":
            userid = window.location.href.split("=")[1]
            getStatus(userid);

            $('body > form > div > div:nth-child(1) > dl:nth-child(1)').append(`<dl><dt>Bar & Pub Status</dt><dd><div class="p3 ce"><div id="pokerstatus_${userid}"><i>Loading...</i></div></div></dd></dl>`);
            $('body > div.upt > div:nth-child(1) > dl:nth-child(1)').after(` <dl><dt>Bar & Pub Status</dt><dd><div class="p3 ce"><div id="pokerstatus_${userid}"><i>Loading...</i></div></div></dd></dl>`);
            break;
        case 'guild':
            $('#tLT > tbody > tr:nth-child(1) > th:last-child').after('<th>Poker Status</th>');
            $('#tLT > tbody > tr').each(function(){
                if (typeof $('td:nth-child(2) > a', this).attr('href') !== 'undefined'){
                    var userid = $('td:nth-child(2) > a', this).attr('href').split("=")[1]
                    $(this).append(`<td><div id="pokerstatus_${userid}"><i>Loading...</i></div></td>`);
                    getStatus(userid);
                }
            })
        break;
        case 'gold':
            $('.tzc > tbody > tr:nth-child(1) > th:last-child').after('<th>Poker Status</th>');
            $('.tzc > tbody > tr').each(function(){
                if (typeof $('td:nth-child(5) > a', this).attr('href') !== 'undefined'){
                    var userid = $('td:nth-child(5) > a', this).attr('href').split("=")[1]
                    $(this).append(`<td><div id="pokerstatus_${userid}"><i>Loading...</i></div></td>`);
                    getStatus(userid);
                }
            })
        break;
        case 'topic':
            $('body > form > dl > dd > div.bts.ppc > div.desc.p3.pud').each(function() {
                $(this).append(`<div id="pokerstatus_${$(this).find('A[href^="pm.php"]').attr('href').split('=')[2]}"><a href="javascript:void(0);">Poker Status:</a> Loading...</div>`);
            });

            $('BODY form DL DT A[href^="user.php"]').each(function() {
                userid = $(this).attr('href').split('=')[1];
                if (checked.indexOf(userid) == -1) {
                    checked.push(userid);
                    getStatus(userid);
                }
            });
            break;
    }


}
function createBox(){
    $('BODY').append('<fieldset style="padding:5px;position:absolute;z-index:100;background-color:#D4E0FF;" id="psFieldset"><legend style="background-color:#D4E0FF;border:1px solid #B0B0B0;"><span></span><img style="vertical-align:inherit;margin-left:2px;cursor:pointer;" src="images/x.gif" /></legend><div class="main"></div></fieldset>');
    $('#psFieldset LEGEND IMG').click(function(){$('#psFieldset').hide();});
    $('#psFieldset').hide();
}
createBox();
parsePage();
getSticky();
