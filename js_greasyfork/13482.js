// ==UserScript==
// @name          mods.de Forum - Lesezeichen
// @description   Verbessert die Darstellung und Verwendung der Lesezeichenfunktion
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://forum.mods.de/
// @match         https://forum.mods.de/index.php
// @match         https://forum.mods.de/thread.php*
// @match         https://forum.mods.de/bb/
// @match         https://forum.mods.de/bb/index.php
// @match         https://forum.mods.de/bb/thread.php*
// @icon          https://i.imgur.com/wwA18B8.png
// @version       1.8
// @grant         GM_openInTab
// @grant         GM_addStyle
// @grant         GM_getResourceURL
// @grant         GM_getResourceText
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require       https://greasyfork.org/scripts/5844-tablesorter/code/TableSorter.js
// @resource      jQueryUICSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/jquery-ui.min.css
// @resource      ui-bg_flat_0_eeeeee_40x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-bg_flat_0_eeeeee_40x100.png
// @resource      ui-bg_gloss-wave_30_3d3644_500x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-bg_gloss-wave_30_3d3644_500x100.png
// @resource      ui-bg_highlight-soft_100_dcd9de_1x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-bg_highlight-soft_100_dcd9de_1x100.png
// @resource      ui-bg_highlight-soft_100_eae6ea_1x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-bg_highlight-soft_100_eae6ea_1x100.png
// @resource      ui-bg_highlight-soft_25_30273a_1x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-bg_highlight-soft_25_30273a_1x100.png
// @resource      ui-bg_highlight-soft_45_5f5964_1x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-bg_highlight-soft_45_5f5964_1x100.png
// @resource      ui-icons_454545_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-icons_454545_256x240.png
// @resource      ui-icons_734d99_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-icons_734d99_256x240.png
// @resource      ui-icons_8d78a5_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-icons_8d78a5_256x240.png
// @resource      ui-icons_ffffff_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/eggplant/images/ui-icons_ffffff_256x240.png
// @downloadURL https://update.greasyfork.org/scripts/13482/modsde%20Forum%20-%20Lesezeichen.user.js
// @updateURL https://update.greasyfork.org/scripts/13482/modsde%20Forum%20-%20Lesezeichen.meta.js
// ==/UserScript==

// Workaround to get rid of "is not defined" warnings
/* globals $, jQuery, async_get */

// Add resources

(function(){
    var resources = {
        'ui-bg_flat_0_eeeeee_40x100.png': GM_getResourceURL('ui-bg_flat_0_eeeeee_40x100.png'),
        'ui-bg_gloss-wave_30_3d3644_500x100.png': GM_getResourceURL('ui-bg_gloss-wave_30_3d3644_500x100.png'),
        'ui-bg_highlight-soft_100_dcd9de_1x100.png': GM_getResourceURL('ui-bg_highlight-soft_100_dcd9de_1x100.png'),
        'ui-bg_highlight-soft_100_eae6ea_1x100.png': GM_getResourceURL('ui-bg_highlight-soft_100_eae6ea_1x100.png'),
        'ui-bg_highlight-soft_25_30273a_1x100.png': GM_getResourceURL('ui-bg_highlight-soft_25_30273a_1x100.png'),
        'ui-bg_highlight-soft_45_5f5964_1x100.png': GM_getResourceURL('ui-bg_highlight-soft_45_5f5964_1x100.png'),
        'ui-icons_454545_256x240.png': GM_getResourceURL('ui-icons_454545_256x240.png'),
        'ui-icons_734d99_256x240.png': GM_getResourceURL('ui-icons_734d99_256x240.png'),
        'ui-icons_8d78a5_256x240.png': GM_getResourceURL('ui-icons_8d78a5_256x240.png'),
        'ui-icons_ffffff_256x240.png': GM_getResourceURL('ui-icons_ffffff_256x240.png')
    };
    var jQueryUICSS = GM_getResourceText('jQueryUICSS');
    $.each(resources, function(resourceName, resourceUrl) {
        jQueryUICSS = jQueryUICSS.replace('images/' + resourceName, resourceUrl);
    });
    GM_addStyle(jQueryUICSS);
})();

// Override set bookmark

function jQAlert(title, message){
    $('body').append('<div id="overlayDialog">' + message + '</div>');
    $('#overlayDialog').dialog({
        draggable: false,
        resizable: false,
        modal:     true,
        title:     title,
        buttons: {
            Ok: function(){
                $(this).dialog('close');
            }
        },
        position: {my: "right top", at: "right top", of: window}
    });
}

unsafeWindow.setBookmark = function(pid, token){
    async_get(
    'async/set-bookmark.php?PID='+pid+'&token='+token, null,
    function(xml){
        var message = '';
        switch(parseInt(xml.responseText)){
            case 1: message = 'Das Lesezeichen wurde gesetzt.'; break;
            case 2: message = 'Du hast bereits zu viele Lesezeichen!'; break;
            default: message = 'Unbekannter Fehler:<br>' + xml.responseText; break;
        }
        jQAlert('Lesezeichen', message);
    });
    return;
}

// Override remove bookmark

unsafeWindow.removeBookmark = function(bmid, token, thread, force){
    var message = thread
        ? 'Soll das Lesezeichen \''+thread+'\' wirklich gelöscht werden?'
        : 'Soll dieses Lesezeichen wirklich gelöscht werden?';
    $('body').append('<div id="overlayDialog">' + message + '</div>');
    $('#overlayDialog').dialog({
        draggable: false,
        resizable: false,
        modal:     true,
        title:     'Lesezeichen',
        buttons: {
            Ja: function(){
                async_get('async/remove-bookmark.php?BMID='+bmid+'&token='+token, null, null);
                $(this).dialog('close');
            },
            Nein: function(){
                $(this).dialog('close');
            }
        },
        position: {my: "right top", at: "right top", of: window}
    });
}

// Add open in new tabs link

unsafeWindow.openLinks = function(){
    $('#bookmarklist > table > tbody > tr').each(function(){
        if ($('td:nth-child(4)', this).text().indexOf('neu') != -1){
            GM_openInTab('http://forum.mods.de/' + $('td:nth-child(3) > a', this).attr('href'));
        }
    });
}

$('.bookmarklist > span').wrapInner('<a href="javascript:openLinks()"></a>'); 

// Sort and change style of table

function stripeRows() {
    $('#bookmarklist > table > tbody > tr').removeClass('color3b')
        .filter(':even').addClass('color3b');
}

if ($('#bookmarklist').length){
    $('#bookmarklist > table').prepend('<thead><tr class="l"><th></th><th>Forum</th><th>Thread</th><th>#Posts</th><th></th><th></th><th style="display:none"></th></tr></thead>');
    $('#bookmarklist > table > tbody > tr').each(function(){
        if ($('td:nth-child(4)', this).text().indexOf('neu') != -1){
            $(this).append('<td style="display:none">0</td>');
        } else if ($('td:nth-child(3)', this).has('del').length){
            $(this).append('<td style="display:none">2</td>');
        } else {
            $(this).append('<td style="display:none">1</td>');
        }
    });
    $('#bookmarklist > table').tablesorter({
        sortList: [[6,0],[3,1],[1,1],[2,0]],
        sortForce: [[6,0]],
        headers: {
            0: {sorter: false},
            4: {sorter: false},
            5: {sorter: false},
            6: {sorter: false}
        }
    });
    $('#bookmarklist > table').bind('sortEnd', stripeRows);
    $('#bookmarklist > table').css('border-collapse', 'collapse');
    $('#bookmarklist > table > tbody > tr').css('border-bottom', '2px solid transparent');
    $('#bookmarklist > table > tbody > tr > td > a').css('color', '#ccc');
    stripeRows();
}
