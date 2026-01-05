// ==UserScript==
// @name         FA TextViewer
// @namespace    FurAffinity
// @version      2.0.2
// @description  Allows for online viewing of all text based submissions of FurAffinity
// @author       JaysonHusky
// @match        https://www.furaffinity.net/view/*/
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/26791/FA%20TextViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/26791/FA%20TextViewer.meta.js
// ==/UserScript==
(function() {
    'use strict';
$(document).ready(function(){
    var TemplateStyle=$('body').attr('data-static-path');
    var is_book=$("meta[property='og:type']").attr("content");
    var SubmissionDownloadURL="";
    if(TemplateStyle=="/themes/beta"){
        SubmissionDownloadURL=$('a.download-logged-in').attr('href');
        $('#submissionImg').after('<br/><br/><iframe style="width: 900px; height: 900px;" src="https://docs.google.com/gview?url=https:'+SubmissionDownloadURL+'&embedded=true" height="240" width="320" frameborder="0"></iframe>');
    }
    else if(TemplateStyle=="/themes/classic"){
        SubmissionDownloadURL=$('div#text-container a').attr('href');
        $('#submissionImg').after('<br/><br/><iframe style="width: 900px; height: 900px;" src="https://docs.google.com/gview?url=https:'+SubmissionDownloadURL+'&embedded=true" height="240" width="320" frameborder="0"></iframe>');
    }
    else {
        console.log('FA Online Viewer is only activated on story/poetry submissions.');
    }
});
})();