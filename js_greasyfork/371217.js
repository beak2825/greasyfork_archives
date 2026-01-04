// ==UserScript==
// @name         TP Cichorium Improver
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Lorem ipsum dolor
// @author       Stan Li
// @match        https://targetprocess.cisco.com/*.aspx
// @grant        none
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/7e2dbd8d041afa4bda5914b4c8086b2519c51b41/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/371217/TP%20Cichorium%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/371217/TP%20Cichorium%20Improver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForUrl(/^https:\/\/targetprocess\.cisco\.com\/restui\/board.aspx.*/i, function(){
        waitForElems(".view-header-group:not(._upd)", function(){
            $('.view-header-group:not(._upd)').each((i,el)=>{
                // Format user story/bug title format
                $(el).addClass('_upd');
                const $id = $(el).find('.i-role-entity-id');
                $id.text($id.text() + ':');

                // Generate branch name
                const pre = $(el).find('.tau-entity-icon--userstory').length ? 'feature' : 'bugfix';
                const branch = ($(el).find('.i-role-entity-id').text() + ' ' + $(el).find('.i-role-entity-title').text()).replace(/([^\w\s\d]{1,})/g, ' ').trim().replace(/\s{1,}/gi, '-');
                $(`<div style="width:100%;text-align:right;"><small><pre>${pre}/${branch}</pre><small></div>`).prependTo(el);
            });
            
        });
    });

    waitForUrl(/^https:\/\/targetprocess\.cisco\.com\/Default\/TimeSheet.aspx.*/, function(){
         // Add feature/bug ID to a report
        waitForElems("#timeTable .timeTotal", function(){
            $('#timeTable [data-entity-type][href]:not(._upd)').each((i,a)=>{
                $(a).addClass('_upd').text($(a).attr('href').replace(/(.+)(\/)(\d+)$/,'#$3: '+ $(a).text()));
            });
        });
    });


})();