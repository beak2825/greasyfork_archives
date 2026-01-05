// ==UserScript==
// @name         Export TransIP DNS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  extend transip domain with easy-to-copy-paste url,token and DNS records
// @author       Tomas van Rijsse
// @match        https://www.transip.nl/cp/domein-hosting/*
// @match        https://www.transip.eu/cp/domain-hosting/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/14232/Export%20TransIP%20DNS.user.js
// @updateURL https://update.greasyfork.org/scripts/14232/Export%20TransIP%20DNS.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global jQuery */
'use strict';

jQuery(function(){

    exportDNS();

    var waitingForFragment = setInterval(
        function(){
            if(jQuery('.fragment').length > 0){
                startObserver();
                clearInterval(waitingForFragment);
            }
        }, 100
    );
});

function startObserver(){

    // Select the node that will be observed for mutations
    var targetNode = jQuery('.fragment')[0];

    // Options for the observer (which mutations to observe)
    var config = { childList: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        observer.disconnect();
        exportDNS();
        observer.observe(targetNode, config);
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

}

function exportDNS(){
    var $rows = jQuery('.dns-form-panels').find('.form-panel');

    if($rows.length == 0){
        return false;
    }

    var $table = jQuery('<table></table>');

    $table.append('<tr><th>Name</th><th>Type</th><th>Value</th></tr>');

    $rows.each(function(){
        var $ = jQuery;

        if($(this).find('input.content').val() != ""){

            var $row = $('<tr></tr>');
            $row.append('<td>'+ $(this).find('input.name').val() + '</td>');
            $row.append('<td>'+ $(this).find('select.type').val() + '</td>');
            $row.append('<td>'+ $(this).find('input.content').val() + '</td>');
            $table.append($row);

        }
    });

    $table.find('th,td').css({
        padding:'0 10px 0 0',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '400px'
    })
    $table.find('th').css('text-align','left');
    $table.css('padding','10px');

    var $export = jQuery('<div class="overview-panel"></div>');

    $export.append('<h3 class="ocp-overview-panel-header--border-bottom">DNS export: ' + jQuery('a.ocp-overview-panel-header__title-link').text().trim() + '</h3>');
    if(jQuery('.auth-code-result:not(.hidden) input.js-authcode-input').length){
        $export.append('<p>Auth code: '+ jQuery('input.js-authcode-input').data('authtoken') +'</p>');
    }
    $export.append($table);

    jQuery('div.fragment-overview').append($export);
}
