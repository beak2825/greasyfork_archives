// ==UserScript==
// @name         Popmundo Character Block
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Virtual condom for adult Popmundo players. I am just kidding, it's a great script to ignore someone
// @author       Serhat Yücel A.K.A Vince Floyd (1902064)
// @match        https://*.popmundo.com/World/*
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js


// @downloadURL https://update.greasyfork.org/scripts/411443/Popmundo%20Character%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/411443/Popmundo%20Character%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log($.cookie('VF_BLOCKED_USERS'));
    const url = window.location.href;
    const orig = window.location.origin;
    const globalBlockedCharList = getBlockedCharacters();

    if(url.includes("/Character/Settings"))  {
       printBlockedCharactersList();
    }

    if(url.includes("/Character") && $("#ctl00_cphRightColumn_ctl00_lnkSendMessage").length > 0)  {
       var charId = $(".idHolder").text();
        if(isUserBlocked(charId)){
            window.location.href = orig + "/World/Popmundo.aspx/Character";
       }

       addBlockTextToCharProfile();
    }

    $.each(globalBlockedCharList, function(index, charId) {
        $( "#ppm-main a" ).each(function( index ) {
            if($(this).attr("href").includes("Character") && $(this).attr("href").includes(charId)) {
                $(this).remove();
            }
        });
    });

    $("#vf_block_char").on('click', function() {
        var charId = $(".idHolder").text();
        blockCharacter(charId);
        alert("Character is blocked!");
        console.log($.cookie('VF_BLOCKED_USERS'));
        window.location.href = orig + "/World/Popmundo.aspx/Character";
    });

    $(".vf_unblock_char").on('click', function() {
        var charId = $(this).attr("data-id");
        unblockCharacter(charId);
        alert("Character is ubblocked!");
        console.log($.cookie('VF_BLOCKED_USERS'));
        location.reload();
    });

    function blockCharacter(charId) {
        var blockedUsers = getBlockedCharacters();
        blockedUsers.push(charId);
        $.cookie('VF_BLOCKED_USERS', JSON.stringify(blockedUsers), { expires: 10000, path: '/'});
    }

    function unblockCharacter(charId) {
        var blockedUsers = getBlockedCharacters();

        if(blockedUsers.length > 0) {
            blockedUsers.splice(blockedUsers.indexOf(charId), 1);
            $.cookie('VF_BLOCKED_USERS', JSON.stringify(blockedUsers), { expires: 10000, path: '/'});
        }

    }

    function getBlockedCharacters() {
        if($.cookie('VF_BLOCKED_USERS') ) {
            return JSON.parse($.cookie('VF_BLOCKED_USERS'));
        }else {
            return [];
        }
    }

    function isUserBlocked(charId) {
        var blockedUsers = getBlockedCharacters();

        if(blockedUsers.length > 0) {
            return blockedUsers.includes(charId);
        }
        return false;
    }

    function printBlockedCharactersList() {
        var resultList = "Nothing to show.";
        var blockedUsers = getBlockedCharacters();

        if(blockedUsers.length > 0) {
            resultList = '<table>';
            $.each(blockedUsers, function(index, charId) {
                resultList += '<tr><td><a href="#" class="vf_unblock_char" data-id="'+charId+'"><img src="../../../../Static/Icons/TinyX_White.png"></a></td><td>'+charId+'</td></tr>';
            });
            resultList += '</table>';

        }
        $("#ppm-content").append('<div class="box"><h2>[VF] Blocked Characters</h2>'+resultList+'</div>');
    }

    function addBlockTextToCharProfile() {
        $("#ctl00_cphLeftColumn_ctl00_lnkToolLink3").parent().parent().after('<tr><td><img id="ctl00_cphLeftColumn_ctl00_imgToolLink2" title="Block Character" src="../../../../Static/Icons/TinyX_White.png" alt="Block Character" style="border-width:0px;"></td><td><a href="#" id="vf_block_char">Block</a></td></tr>');
    }


})();