// ==UserScript==
// @name         NMIT Moodle for Developers
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Flexible Learning Team
// @author       Alan PT
// @match        https://ecampus.nmit.ac.nz/moodle/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370315/NMIT%20Moodle%20for%20Developers.user.js
// @updateURL https://update.greasyfork.org/scripts/370315/NMIT%20Moodle%20for%20Developers.meta.js
// ==/UserScript==

(function() {

})();

var Notes = document.createElement("div");

var rubricPage = document.getElementsByClassName('path-grade-grading-form-rubric');
if (rubricPage.length > 0) {
   Notes.innerHTML = "<div class='alert alert-block'><button type='button' class='close' data-dismiss='alert'>×</button><h1>Tips</h1><ol><li>Be consistent.</li><li>Base them around Learning Objectives</li><li>Use clear language</li><li>Embrace the positive.</li><li>Allow for Creativity.</li></ol><h2>Bloom</h2><ul><li>remember-&nbsp;Recognize,Recall</li><li>understand-&nbsp;Interpret,&nbsp;Classify,&nbsp;Summarize,Compare,Explain</li><li>apply-&nbsp;Execute,&nbsp;Implement</li><li>analyze-&nbsp;Differentiate,&nbsp;Organize,&nbsp;Attribute</li><li>evaluate-&nbsp;Check,&nbsp;Critique</li><li>create-&nbsp;Generate,Plan,&nbsp;Produce</li></ul><h2>SOLO</h2><ul><li>I don't know what is expected of me</li><li>I can identify,name,draw,label,match</li><li>I can describe,list outline,or combine</li><li>I can explain,give reasons,sequence,classify,compare,apply</li><li>I can generalise,state possible futures,create a hypothesis,argue,design.</li></ul><h2>SOLO Define</h2><ul><li>I need help to define</li><li>My definition has one relevant idea</li><li>My definition has several relevant ideas</li><li>I can link the ideas</li><li>And look at those linked ideas in a new way&nbsp;</li></ul></div>";
   Notes.style = "top:0;right:0;position:fixed;z-index: 9999; width:400px; padding:20px; margin:20px;"
   document.body.appendChild(Notes);
}

GM_addStyle ( `
    #page-grade-grading-form-rubric-edit .row-fluid .span9 {width: 100%;}
    #page-grade-grading-form-rubric-edit .container-fluid {max-width: 100%;}
    #page-grade-grading-form-rubric-edit .block-region{ display:none !important}
    #page-grade-grading-form-rubric-edit footer {display:none}
    #page-grade-grading-form-rubric-edit .fdescription {display:none}
    #page-grade-grading-form-rubric-edit .mform .fitem .felement {margin-left: 30px; margin-right: 0px; width: 90%}
    #page-grade-grading-form-rubric-edit .fitemtitle {margin-right:20px}
    #page-grade-grading-form-rubric-edit .gradingform_rubric {max-width: 100%;}
` );