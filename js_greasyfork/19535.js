// ==UserScript==
// @name        Extra Cheevos
// @namespace   pxgamer
// @description Adds more cheevos
// @include     *kat.cr/achievements*
// @include     *kat.cr/user/*/
// @author      pxgamer
// @version     0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19535/Extra%20Cheevos.user.js
// @updateURL https://update.greasyfork.org/scripts/19535/Extra%20Cheevos.meta.js
// ==/UserScript==

$(function(){
    var cheevoTitles = ["Speechless"];
    var cheevoDescriptions = ["Oh no, you've been muted!"];
    var i = 0;
    var username = $('#navigation li a span.usernameProfile.menuItem').text();
    var rep = "129.82K";
    var acl = "3";
    var loc = window.location.href;

    if (loc.substr(loc.length - 14) == "/achievements/") {
        for (i = 0; i < cheevoTitles.length; i++) {
            $('table.achTable tr td.leftpad20px.width100perc ul:first').append(
                '<li> <span class="achBadge specialAchBack assignedAchievement"><a href="/achievements/'+encodeURIComponent(cheevoTitles[i])+'" title=""><span class="specialAchIcon"></span><span class="achTitle">'+cheevoTitles[i]+'</span></a></span> <strong>x 1</strong>  <span class="achDesc">'+cheevoDescriptions[i]+'</span> </li>'
            );
        }
    }
    if (loc.split("/")[4] == username) {
        for (i = 0; i < cheevoTitles.length; i++) {
            $('table.achTable tbody tr:first td.botpad5px').append(
                '<span class="achBadge specialAchBack"><a href="/achievements/'+encodeURIComponent(cheevoTitles[i])+'/" title="'+cheevoDescriptions[i]+'"><span class="specialAchIcon"></span><span class="achTitle">'+cheevoTitles[i]+'</span></a></span>'
            );
        }
    }
    for (i = 0; i < cheevoTitles.length; i++) {
        if (loc.indexOf(encodeURIComponent(cheevoTitles[i])) > -1) {
            document.title = "Achievements - Kickass Torrents";
            $('.errorpage').html('<h2>Users that received <b>'+cheevoTitles[i]+'</b> achievement</h2>'+
                                 '<a href="/achievements/" class="block clearleft">← Back to all achievements</a>'+
                                 '<div class="botmarg10px center topmarg10px">'+
                                 '<img src="//kastatic.com/images/achMedal_special.jpg" /> '+
                                 '<div class="ach_desc">'+cheevoDescriptions[i]+'</div>'+
                                 '</div>'+
                                 '<div class="bottmarg20px accentbox textcontent inlineblock noBulletsList"> '+
                                 '<ul class="fourcols"> '+
                                 '<li '+
                                 '<span class="badgeInline"><span class="online" title="online"></span><span class="aclColor_'+acl+'"><a class="plain" href="/user/'+username+'"> '+username+'</a></span><span title="Reputation" class="repValue positive">'+rep+'</span></span></li>'
                                );
            $('.errorpage').css("background", "none");
            $('.errorpage').removeClass('errorpage');
        }
    }
});
