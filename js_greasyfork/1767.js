// ==UserScript==
// @name        MeFi NOPE!
// @namespace   http://www.roufa.com/mefiNope
// @version     0.401
// @description Sometimes people post things that you don't want to click on. Click "NOPE!" to hide a post. Click "unnope" to bring it back.
// @match       *://www.metafilter.com/
// @match       *://www.metafilter.com/index.cfm*
// @copyright   2014+, Michael Roufa
// @require     http://code.jquery.com/jquery-latest.js
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/1767/MeFi%20NOPE%21.user.js
// @updateURL https://update.greasyfork.org/scripts/1767/MeFi%20NOPE%21.meta.js
// ==/UserScript==

jQuery(function () {
    var noped = JSON.parse(GM_getValue('noped', '[]'));
    console.log("Loaded noped", noped);
    var nopeId = 0;

    var nope = function (el, save) {
        var body = el;
        nopeId++;
        console.log('body', body);
        body.hide(); // Nope to the body!
        body.addClass('nopeId-' + nopeId);
        var header = body.prev();
        console.log('header', header);
        header.hide(); // Nope to the title!
        header.addClass('nopeId-' + nopeId);
        header.addClass('nopeUrlContainer-' + nopeId);
        var lineBreak = body.next();
        lineBreak.hide(); // Nope to the spacing!
        lineBreak.addClass('nopeId-' + nopeId);
        if (save) {
            // Grab that URL for eternal noping.
            var linkAnchor = jQuery('a', header)[0];
            var linkPath = linkAnchor.pathname;
            console.log('Noping forever', linkPath);
            noped.push(linkPath);
            saveNoped();
        }
        body.before('<div class="copy"><small><em>[This post was noped. <a href="#" onclick="return false" data-id="' + nopeId + '" class="unnope">unnope</a>]</em></small></div>');
    };

    jQuery(document).on('click', '.nope', function (event) {
        nope(jQuery(event.target).parents('div.copy'), true);
    });
    jQuery(document).on('click', '.unnope', function (event) {
        var id = jQuery(event.target).attr('data-id');
        jQuery('.nopeId-' + id).show();
        jQuery(event.target).parents('.copy').remove();
        var href = jQuery('a', '.nopeUrlContainer-' + id).attr('href');
        var i;
        for (i = 0; i < noped.length; i++) {
            if (noped[i] === href) break;
        }
        if (i < noped.length) {
            noped.splice(i, 1);
            saveNoped();
        }
    });

    var els = jQuery('span.smallcopy:contains("posted by")');
    for (var i = 0; i < els.length; i++) {
        els[i].innerHTML += '&nbsp;[<a href="#" class="nope" onclick="return false;">NOPE!</a>]';
    }
    for (var i = 0; i < noped.length; i++) {
        var hrf = noped[i];
        var anc = jQuery(jQuery("a[href$='" + hrf + "']")[0]);
        if (anc.length === 0) continue;
        console.log(hrf + " -- NOPE!!!!");
        var startEl = anc.parent().next();
        nope(startEl, false);
    }

    var saveNoped = function () {
        GM_setValue('noped', JSON.stringify(noped));
    };
});
