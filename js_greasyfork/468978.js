// ==UserScript==
// @name         M-Team Gay Video Filter
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Used to filter gay videos in m-team
// @author       q1angch0u
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @match        https://kp.m-team.cc/adult.php*
// @icon         none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/468978/M-Team%20Gay%20Video%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/468978/M-Team%20Gay%20Video%20Filter.meta.js
// ==/UserScript==

const gayKeyword = "Gay";

const gayFilter = {
    NORMAL: {text:'Normal', handler: normalHandler},
    NO_GAY: {text:'No', handler: noGayHandler},
    ONLY_GAY: {text:'Only', handler: onlyGayHandler}
};

// the fourth tbody is a dom which search bar in.
const searchBarOrder = 4;
// the fourth td is a dom which need to insert the selector.
const gayModeSelectorOrder = 4;
// the first td is a dom which contains description for torrents.
const categoryOrder = 0;
const imageOrder = 0;

(function() {
    'use strict';
    $(function() {

        let mTeamGayMode = GM_getValue('mTeamGayMode', 'NORMAL');

        $('.searchbox').find('tbody').eq(searchBarOrder).find('td').eq(gayModeSelectorOrder).append(getSelector(mTeamGayMode));
        changeMode(mTeamGayMode);
        $('#gay-mode-selector').on('change', function() {
            let mode = $(this)[0].options[$(this)[0].selectedIndex].value;
            changeMode(mode);
        });

    });
})();

function changeMode(mode) {
    if (!(mode in gayFilter)) {
        return;
    }
    GM_setValue('mTeamGayMode', mode);
    $('.torrents').children('tbody').children('tr:gt(0)').each(function() {
        gayFilter[mode].handler(this);
    });
}

function getSelector(currentMode) {
    let gaySelector = "Gay Mode: <select id='gay-mode-selector'>";
    for (const [key, value] of Object.entries(gayFilter)) {
        let selected = currentMode == key ? "selected" : "";
        gaySelector += "<option value='" + key + "'" + selected + ">" + value.text + "</option>";
    }
    return gaySelector + "</select>";
}

function noGayHandler(dom) {
    $(dom).show();
    if (isGayVideo(dom)) {
        $(dom).hide();
    }
}


function onlyGayHandler(dom) {
    $(dom).show();
    if (!isGayVideo(dom)) {
        $(dom).hide();
    }
}


function normalHandler(dom) {
    $(dom).show();
}

function isGayVideo(dom) {
    let category = $(dom).find('td').eq(categoryOrder).find('img').eq(imageOrder).attr('alt');
    return category !== undefined && category.indexOf(gayKeyword) > 0;
}
