// ==UserScript==
// @name         User Info Popover
// @namespace    pxgamer
// @version      0.1
// @description  Adds a popover with user info.
// @author       pxgamer
// @include      *kat.cr/community/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19647/User%20Info%20Popover.user.js
// @updateURL https://update.greasyfork.org/scripts/19647/User%20Info%20Popover.meta.js
// ==/UserScript==



(function() {
    'use strict';

    $('body').append(' <div id="userInfoPop" style="display: none; padding: 3px; position: fixed; background: white; border: 1px solid black; border-radius: 4px; top: 60px; left: 5px;">'+
                     '<table><tr><th>User Details:</th><th style="text-align: right;"><a href="javascript:$(\'#userInfoPop\').hide();"<i class="ka ka16 ka-delete ka-red"></i></th>'+
                     '  <tr>'+
                     '    <td>Username</td>'+
                     '    <td class="unValue InfoPop"></td>'+
                     '  </tr>'+
                     '  <tr>'+
                     '    <td>Reputation</td>'+
                     '    <td class="repuVal InfoPop"></td>'+
                     '  </tr>'+
                     '  <tr>'+
                     '    <td>Rank</td>'+
                     '    <td class="rankValue InfoPop"></td>'+
                     '  </tr>'+
                     '  <tr>'+
                     '    <td>Friends</td>'+
                     '    <td class="friendValue InfoPop"></td>'+
                     '  </tr>'+
                     '  <tr>'+
                     '    <td>Cheevos</td>'+
                     '    <td class="cheevoValue InfoPop"></td>'+
                     '  </tr>'+
                     '</table>'+
                     '</div>');
    $('.badgeInfo .badgeUsernamejs.font12px').each(function() {
        $(this).after(' <span class="ka ka16 ka-faq lower userInfoPopover"></span>');
    });

    $('.userInfoPopover').on('click', function() {
        var username = $(this).parent().find('.badgeUsernamejs .plain[href^="/user/"]').text();
        var userInfo = getUserInfo(username);

        $('#userInfoPop').css('display', '');
        $('.InfoPop.unValue').html('<a href="/user/'+userInfo.username+'/">'+userInfo.username+'</a>');
        $('.InfoPop.repuVal').text(userInfo.rep);
        $('.InfoPop.rankValue').text(userInfo.rank);
        $('.InfoPop.friendValue').text(userInfo.friends);
        $('.InfoPop.cheevoValue').text(userInfo.cheevos);
    });

    function getUserInfo(username) {
        var returnedData;
        var matches;
        var userInfo = {
            username: username
        };

        var userRank    = /<div class="lightgrey font12px"><span class="aclColor_.*">([a-z 0-9]+)<\/span>/gi;
        var userRep     = /<span title="Reputation" class="repValue positive">([0-9]+)<\/span>\n                        		<\/h1>/gi;
        var userCheevo  = /<h2><a class="ka ka16 ka-eye" title="Toggle Achievements" id="toggleAch"><\/a> User Achievements \(([0-9]+) opened\)/gi;
        var userUploads = /<span>uploads <i class="menuValue">([0-9]+)<\/i><\/span>/gi;
        var userFriends = /<span>Friends <i class="menuValue">([0-9]+)<\/i><\/span>/gi;

        $.ajax({
            type: 'GET',
            url: '/user/' + username + '/',
            async: false,
            success: function (data) {
                returnedData = data;
                while (matches = userRank.exec(returnedData.html)) {
                    userInfo.rank = matches[1];
                }
                while (matches = userRep.exec(returnedData.html)) {
                    userInfo.rep = matches[1];
                }
                while (matches = userCheevo.exec(returnedData.html)) {
                    userInfo.cheevos = matches[1];
                }
                while (matches = userUploads.exec(returnedData.html)) {
                    userInfo.uploads = matches[1];
                }
                while (matches = userFriends.exec(returnedData.html)) {
                    userInfo.friends = matches[1];
                }
            },
            returnData: "json"
        });
        return userInfo;
    }
})();
