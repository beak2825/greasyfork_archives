// ==UserScript==
// @name         JIRA to YouTrack

// @description  feature for simple fast transfer jira task to youtrack
// @match        https://jira.vseinstrumenti.ru/projects/*/queues/*
// @match        http://tasker.vseinstrumenti.ru/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js

// @version 0.0.1.20210219143612
// @namespace https://greasyfork.org/users/737684
// @downloadURL https://update.greasyfork.org/scripts/421996/JIRA%20to%20YouTrack.user.js
// @updateURL https://update.greasyfork.org/scripts/421996/JIRA%20to%20YouTrack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let defauldTemplateURL = 'http://tasker.vseinstrumenti.ru/newIssue';
    let isYoutrack = $('img[title="YouTrack"]').length > 0;

    if(isYoutrack){
        if(GM_getValue("JIRA", true)){
            setTimeout(onYoutrack, 1000);
        }
    }else{
        onJira();
    }

    function copyToYoutrack(e) {
        GM_setValue("title", $('#summary-val')[0].innerText.trim());
        GM_setValue("description", $('#description-val')[0].innerText.trim());
        GM_openInTab(GM_getValue('URLTemplate', defauldTemplateURL));
        GM_setValue("JIRA", true);
    }

    function inputTemplateURL(e) {
        if(this.value.search(/^http:\/\/tasker.vseinstrumenti.ru\/newIssue/i) === -1){
            this.value = defauldTemplateURL;
        }
        GM_setValue('URLTemplate', this.value)
    }

    function onJira () {
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
    top: 41px;
    right: 0;
    font-size: 21px;
    background: #0648a6;
    border-radius: 5px;
    margin: 5px;
    z-index: 1100;
    padding: 5px 8px;
}
    #toYoutrack {
    cursor: pointer;
    font-size: 21px;
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
        //Create button click
        //$('button[data-test="createIssueAction"]').click()
        GM_setValue("JIRA", false)

        //Title
        $('.yt-issue-body__summary__input').val(GM_getValue("title",""));
        triggerChange($('.yt-issue-body__summary__input')[0]);

        //Description
        $('.yt-issue-body__description__input').val(GM_getValue("description",""));
        triggerChange($('.yt-issue-body__description__input')[0]);

        //Create button click
        $('button[data-test="createIssueAction"]').click()
        GM_setValue("JIRA", false)

        //Направление
        setTimeout(()=>{$('.yt-issue-fields-panel__row:nth-child(6) td:nth-child(2)').click()}, 1000);

    }

})();