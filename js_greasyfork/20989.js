// ==UserScript==
// @name         Group Leader Enhancement Suit
// @namespace    Remix
// @version      0.1
// @description  An userscript to manage HF groups
// @author       Remix
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @include      http://hackforums.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/20989/Group%20Leader%20Enhancement%20Suit.user.js
// @updateURL https://update.greasyfork.org/scripts/20989/Group%20Leader%20Enhancement%20Suit.meta.js
// ==/UserScript==

blackListColor = GM_getValue('blackListColor', '#F44336');
shinyColor = GM_getValue('shinyColor', '#FFCC00');
shinyUsers = [];
//url = 'http://grouptoolkit.ub3r.org/bl_api.php';
url = GM_getValue('blackListUrl', '');
console.log(url);

if(url != '')
    GM_xmlhttpRequest({
        method: "GET",
        url: url+'?action=read',
        onload: function(response){
            var arr = JSON.parse(response.responseText);
            arr.splice(arr.length-1, 1);
            GM_setValue('blackListedMembers', arr);
        },
    });

blackListedMembers = GM_getValue('blackListedMembers', []);

$(document).ready(function() {
    
    if(location.href.indexOf('usercp.php?action=options') > -1) {
        
        $('input#invisible').parent().parent().parent().parent().parent().parent().parent().parent().parent().after('<br><table border="0" cellspacing="1" cellpadding="4" class="tborder"><tbody><tr><td class="thead" colspan="2"><strong>GLES Settings</strong></td></tr><tr><td width="50%" class="trow1" valign="top"><fieldset class="trow2"><legend><strong>Management</strong></legend><table cellspacing="0" cellpadding="4"><tbody><tr><td><span class="smalltext"><label for="activityCheckLink">Activity check:</label></span></td><td><input name="activityCheckLink" id="activityCheckLink" placeholder="Link"></td><td width="1"><input id="activityCheckGID" placeholder="Group ID"></td><td><input type="button" id="activityCheckBtn" class="button" value="Run"></td></tr><tr><td><span class="smalltext"><label for="activityCheckLink">Blacklist URL:</label></span></td><td><input name="blackListLink" id="blackListLink" value="'+url+'"></td></tr></tbody></table></td></tr></tbody></table>');
        
        $('input[class="button"][name="regsubmit"]').on('click', function() {
            GM_setValue('blackListUrl', $('#blackListLink').val());
        });
        
        $('#activityCheckBtn').on('click', function() {
            var gid = $('#activityCheckGID').val();
            var link = $('#activityCheckLink').val();
            
            if(gid.length === 0 || link.length === 0)
                return;
            
            var tid = link.replace(/[^0-9]/g, '');
            
            $.get('http://hackforums.net/misc.php?action=whoposted&tid=' + tid, function(data) {
                var posted = [];
                $('body').append('<div style="display:none" id="result"></div>');
                $('#result').html(data);
                $('#result span[class*="group"]').each(function() {
                    posted.push($(this).parent().prop('href').replace(/[^0-9]/g, ''));
                });
                GM_setValue('postedUsers', posted);
                window.location = 'http://hackforums.net/managegroup.php?gid=' + gid;
            });
            
        });
        
        /*** Activity check end ***/
        
    } else if (location.href.indexOf('managegroup.php?gid=') > -1) {
        
        /*** Mouse hover color ***/
        
        $('a[href*="private.php?action=send"]').parent().parent().hover(function() {
            $(this).children().css('background-color', '#393939');
        }, function() {
            $(this).children().css('background-color', '');
        });
        
        /*** Mouse hover color end ***/
        
        /*** Activity check begin ***/

        var posted = GM_getValue('postedUsers', []);
        
        if(posted.length > 0) {
            $('input[type="checkbox"][name*="removeuser"]').each(function() {
                $(this).prop('checked', true);
                $(this).parent().parent().children().css('background', 'rgb(36, 36, 36)');
            });
            
            posted.forEach(function(uid) {
                var checkbox =  $('input[type="checkbox"][name*="removeuser['+uid+']"]');
                $(checkbox).prop('checked', false);
                $(checkbox).parent().parent().children().css('background', '');
            });
            
            GM_setValue('postedUsers', []);
        }
        
        /*** Activity check end ***/
        
        /*** Blacklist ***/

        blackListedMembers.forEach(function(uid) {
            $('a[href*="member.php?action=profile&uid=' + uid + '"]').parent().parent().children().css('background-color', blackListColor);
        });

        /*** Blacklist end ***/


        /*** Check all members ***/

        //$('table tbody tr:nth-child(2) td:last-child').append('<a href="javascript:void(0)" id="selectAllMembers">Check All</a>');

        $('#selectAllMembers').on('click', function() {
            $('input[type="checkbox"][name*="removeuser"]').each(function(box) {
                if($(this).prop('checked') == false) {
                    $(this).prop('checked', true);
                    $(this).parent().parent().children().css('background', 'rgb(36, 36, 36)');
                } else {
                    $(this).prop('checked', false);
                    $(this).parent().parent().children().css('background', '');
                }
            });
        });



        /*** set background color for checked members ***/

        $('input[type="checkbox"][name*="removeuser"]').change(function() {
            if($(this).prop('checked'))
                $(this).parent().parent().children().css('background', 'rgb(36, 36, 36)');
            else
                $(this).parent().parent().children().css('background', '');
        });


        /*** Export members ***/

        /*$('table tbody tr:first-child td').append('<a href="javascript:void(0)" style="float: right" id="memberExportLink">Export members</a>');

        $('#memberExportLink').on('click', function() {
            var output = '[list]';

            $('table tbody tr td a[href*="http://hackforums.net/member.php?action=profile&uid="]').each(function(element) {
                output += '[*][url=' + $(this).attr('href') + ']' + $(this).find('span').html() + '[/url]\n';
            });

            output += '[/list]';

            console.log(output);
        });*/


        /*** PM 5 members ***/
        /*$('table[cellpadding="4"]').prop('cellpadding', '5');
        $('td[class="thead"][colspan="7"]').prop('colspan', '9');
        $('td[class="tcat"]:nth-child(2)').after('<td class="tcat" align="2" width="10%"><span class="smalltext"><strong>PM (max. 5)</strong></span></td>');
        $('a[href*="action=send&uid="]').parent().after('<td class="trow1" align="center"><input type="checkbox" class="pmSelectedUsersCheckBox"></td>');*/

    } else if (location.href.indexOf('managegroup.php?action=joinrequests&gid=') > -1) {

        /*** Check all join requests ***/

        /*$('td.tcat strong').each(function() {
            var text = $(this).text();
            if(text == 'Accept')
                $(this).parent().append('<br><small><a href="javascript:void(0)" class="checkAllJoinRequests" id="checkAllAccept">Check all</a></small>');
            else if(text == 'Ignore')
                $(this).parent().append('<br><small><a href="javascript:void(0)" class="checkAllJoinRequests" id="checkAllIgnore">Check all</a></small>');
            else if(text == 'Decline')
                $(this).parent().append('<br><small><a href="javascript:void(0)" class="checkAllJoinRequests" id="checkAllDecline">Check all</a></small>');
        });

        $('.checkAllJoinRequests').on('click', function() {
            if($(this).prop('id') == 'checkAllAccept')
                $('input[type="radio"][name*="request"][value="accept"]').each(function() {
                    $(this).prop('checked', true);
                });
            else if($(this).prop('id') == 'checkAllIgnore')
                $('input[type="radio"][name*="request"][value="ignore"]').each(function() {
                    $(this).prop('checked', true);
                });
            else if($(this).prop('id') == 'checkAllDecline')
                $('input[type="radio"][name*="request"][value="decline"]').each(function() {
                    $(this).prop('checked', true);
                });
        });*/


        /*** Black list ***/
    } else if(location.href.indexOf('member.php?action=profile&uid=') > -1) {
        
        var ownUid = $('a[href*="member.php?action=profile&uid="]:first-child').prop('href').replace(/[^0-9]/g, '');
        var uid = location.href.replace(/[^0-9]/g, '');

        if(uid != ownUid) {
            if(blackListedMembers.indexOf(uid) == -1) {
                $('a[href*="/usercp.php?action=do_editlists&manage=ignored"]').after('<br><a href="javascript:void(0)" id="blackListMember"><img src="http://i.imgur.com/xTP4gXj.png" alt=""> Add to your Blacklist</a>');
            } else {
                var block = $('body table[class="tborder"]:first-child');
                $(block).each(function(idx) { if(idx == 0) { $(this).css('border', '1px solid ' + blackListColor); } });
                $(block).find('.largetext').find('strong').find('span').css('color', blackListColor);
                $('a[href*="/usercp.php?action=do_editlists&manage=ignored"]').after('<br><a href="javascript:void(0)" id="blackListMember"><img src="http://i.imgur.com/xTP4gXj.png" alt=""> Remove from your Blacklist</a>');
            }
        } 

        if(shinyUsers.indexOf(uid) != -1) {
            var block = $('body table[class="tborder"]:first-child');
            $(block).each(function(idx) { if(idx == 0) { $(this).css('border', '1px solid ' + shinyColor); } });
            $(block).find('.largetext').find('strong').find('span').toggleClass('addStar');
        }

        $('#blackListMember').on('click', function() {
            var position = blackListedMembers.indexOf(uid);
            if(position == -1) {
                blackListedMembers.push(uid);
                if(url != '')
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url+'?action=add&uid='+uid,
                        onload: function(response){
                            console.log(response.responseText);
                        },
                    });
            } else {
                blackListedMembers.splice(position, 1);
                if(url != '')
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url+'?action=remove&uid='+uid,
                        onload: function(response){
                            console.log(response.responseText);
                        },
                    });
            }

            GM_setValue('blackListedMembers', blackListedMembers);
            
            
        });
    } else if(location.href.indexOf('showthread.php?tid=') != -1) {
        blackListedMembers.forEach(function(uid) {
            console.log(uid);
            $('a[href*="member.php?action=profile&uid='+ uid +'"] span[class*="group"]').each(function() {
                var table = $(this).closest('table[class="tborder"]');
                $(table).css('border', '1px solid ' + blackListColor);
                $(table).find('tbody').find('tr').find('td[class="tcat"]').css('background-color', blackListColor);
            });
        });

        shinyUsers.forEach(function(uid) {
            $('a[href*="member.php?action=profile&uid='+ uid +'"] span[class*="group"]').each(function() {
                console.log($(this));
                var table = $(this).closest('table[class="tborder"]');
                var topbar = $(table).find('tbody').find('tr').find('td[class="tcat"]');
                $(table).css('border', '1px solid ' + shinyColor);
                $(topbar).css('background-color', shinyColor);
                $(topbar).find('.smalltext').css('color', 'black');
                $(topbar).find('a').css('color', 'black');
                $(this).toggleClass('addStar');
            });
        });
    } else if(location.href.indexOf('private.php?action=read&pmid=') != -1) {
        $('a[href*="member.php?action=profile&uid="]').each(function(idx) {
            if(idx == 2) {
                var uid = $(this).prop('href').replace(/[^0-9]/g, '');
                if(blackListedMembers.indexOf(uid) != -1) {
                    var table = $(this).closest('table[class="tborder"]');
                    $(table).css('border', '1px solid ' + blackListColor);
                    $(table).find('tbody').find('tr').find('td[class="tcat"]').css('background-color', blackListColor);
                } else if(shinyUsers.indexOf(uid) != -1) {
                    var table = $(this).closest('table[class="tborder"]');
                    var topbar = $(table).find('tbody').find('tr').find('td[class="tcat"]');
                    $(table).css('border', '1px solid ' + shinyColor);
                    $(table).find('tbody').find('tr').find('td[class="tcat"]').css('background-color', shinyColor);
                    $(topbar).css('background-color', shinyColor);
                    $(topbar).find('.smalltext').css('color', 'black');
                    $(topbar).find('a').css('color', 'black');
                }
            }
        });
    }

    /*** Blacklist end ***/

    $('span.addStar').before('<img src="http://i.imgur.com/tylnPNi.png" alt="">');
});