// ==UserScript==
// @name         Work Item View Improver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  42
// @author       Zbahniuk
// @match        https://dev.azure.com/sphera/Proscient/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/427393/Work%20Item%20View%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/427393/Work%20Item%20View%20Improver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.waitForKeyElements=function(e,t,n){var a,o;(a=document.querySelectorAll(e))&&0<a.length?(o=!0,a.forEach(function(e){"alreadyFound"==e.dataset.found||(t(e)?o=!1:e.dataset.found="alreadyFound")})):o=!1;var l=waitForKeyElements.controlObj||{},r=e.replace(/[^\w]/g,"_"),d=l[r];o&&n&&d?(clearInterval(d),delete l[r]):d||(d=setInterval(function(){waitForKeyElements(e,t,n)},300),l[r]=d),waitForKeyElements.controlObj=l};

    waitForKeyElements('.workitem-header-bar a, .work-item-form-title', function() {
        var id = $('.work-item-form-id').text();
        var title = $('.work-item-form-title input').val();
        var fullTitle = id + ': ' + title;
        if ($('#CP_Title').length === 0) {
          $('.work-item-form-header-controls-container').append('<input type="button" value="Copy Title" id="CP_Title">');
          $('#CP_Title').css('background-color', 'antiquewhite').css('border-radius', '15px').css('color', 'blueviolet');
          $('#CP_Title').click(function() {
            navigator.clipboard.writeText(fullTitle).then(function() {
              console.log(fullTitle);
            });
          });
        }
        var regexForWords = /\b[^\d\W]+\b/g;
        var headerBarText = $('.workitem-info-bar.workitem-header-bar a').text() || '';
        var wordsFromHeaderBar = headerBarText.match(regexForWords);
        var workItemType = Array.isArray(wordsFromHeaderBar) ? wordsFromHeaderBar.map(function(i) {
           return i.toLowerCase();
        }).join('-') : '';
        var lowercasedTitleArr = title ? title.split(' ').map(function(i) {
           return i.toLowerCase();
        }) : [];
        var branchName = workItemType + '/' + id + '-' + lowercasedTitleArr.join('-');
        if ($('#CP_BN').length === 0) {
          $('.workitem-info-bar.workitem-header-bar .info-text-wrapper').append('<input type="button" value="Copy Branch Name" id="CP_BN">');
          $('#CP_BN').css('background-color', 'antiquewhite').css('border-radius', '15px').css('color', 'blueviolet');
          $('#CP_BN').click(function() {
            navigator.clipboard.writeText(branchName).then(function() {
              console.log(branchName);
            });
          });
        }
    });
})()