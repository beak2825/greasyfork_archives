// ==UserScript==
// @name         GLPI to YouTrack

// @description  feature for simple fast transfer glpi task to youtrack
// @match        https://glpi.vseinstrumenti.ru/front/ticket.form.php?*
// @match        http://tasker.vseinstrumenti.ru/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @version 0.0.1.20210215182347
// @namespace https://greasyfork.org/users/737684
// @downloadURL https://update.greasyfork.org/scripts/421737/GLPI%20to%20YouTrack.user.js
// @updateURL https://update.greasyfork.org/scripts/421737/GLPI%20to%20YouTrack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let defauldTemplateURL = 'http://tasker.vseinstrumenti.ru/newIssue';
    let isYoutrack = $('img[title="YouTrack"]').length > 0;

    if(isYoutrack){
        if(GM_getValue("GLPI", true)){
            setTimeout(onYoutrack, 1000);
        }
    }else{
        onGlpi();
    }

    function copyToYoutrack(e) {
        GM_setValue("glpiNumber", $('.tab_cadre_fixe:nth-child(1) th')[0].innerHTML.match(/ID (\d+)/i)[1]);
        GM_setValue("glpiTitle", $('.tab_cadre_fixe:nth-child(4) .tab_bg_1:nth-child(1) td div')[0].innerHTML.trim());
        GM_setValue("glpiDescription", $('.tab_cadre_fixe:nth-child(4) .tab_bg_1:nth-child(2) td div')[0].innerHTML.trim());
        GM_openInTab(GM_getValue('URLTemplate', defauldTemplateURL));
        GM_setValue("GLPI", true);
    }

    function inputTemplateURL(e) {
        if(this.value.search(/^http:\/\/tasker.vseinstrumenti.ru\/newIssue/i) === -1){
            this.value = defauldTemplateURL;

        }
        GM_setValue('URLTemplate', this.value)
    }

    function onGlpi () {
        var toYoutrack = $('<div></div>')
            .html('<button id="toYoutrack" type="button">Скопировать в Yourack</button><input id="templateURL" placeholder="URL шаблона для задачи">')
            .attr('id', 'toYoutrackBox');
        $('body').append(toYoutrack);
        $('#toYoutrack').click(copyToYoutrack);
        $('#templateURL').val(GM_getValue('URLTemplate', defauldTemplateURL))

        $('#templateURL').on('change',inputTemplateURL);

        GM_addStyle (`
    #toYoutrackBox {
        position: fixed;
        top: 160px;
        left: 0;
        font-size: 20px;
        background: #3281af;
        border-radius: 5px;
        border: 3px solid #525252;
        margin: 5px;
        z-index: 1100;
        padding: 5px 8px;
    }
    #toYoutrack {
        cursor:                 pointer;
    }
    #toYoutrackBox p {
        color:                  red;
        background:             white;
    }
    #templateURL {
        height: 30px;
        display: block;
        width: 227px;
        line-height: 83px;
        margin: 5px 0;
        font-size: 15px;
    }
    `);
}

    function triggerChange(htmlObj){
        htmlObj.dispatchEvent(new Event('input', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }

    function onYoutrack () {
        //GLPI number
        console.log(GM_getValue("glpiTitle",""));
        $('.yt-issue-fields-panel__row:nth-child(1) .yt-issue-custom-field-simple').click();
        $('form[name="editFieldForm"] input.ring-input').val(GM_getValue("glpiNumber",""));
        triggerChange($('form[name="editFieldForm"] input.ring-input')[0]);
        $('form[name="editFieldForm"] button[type="submit"]').click();

        //Title
        $('.yt-issue-body__summary__input').val(GM_getValue("glpiTitle",""));
        triggerChange($('.yt-issue-body__summary__input')[0]);

        //Description
        $('.yt-issue-body__description__input').val(GM_getValue("glpiDescription",""));
        triggerChange($('.yt-issue-body__description__input')[0]);

        //Create button click
        $('button[data-test="createIssueAction"]').click()
        GM_setValue("GLPI", false)
    }

})();