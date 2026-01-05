// ==UserScript==
// @name Qualtrics:Show All Questions
// @description Show All Questions on Qualtrics (use in edit mode of survey)
// @include https://*.qualtrics.com/*Edit*
// @grant none
// @version 0.0.2.20170713
// @namespace https://greasyfork.org/users/4252
// @downloadURL https://update.greasyfork.org/scripts/3945/Qualtrics%3AShow%20All%20Questions.user.js
// @updateURL https://update.greasyfork.org/scripts/3945/Qualtrics%3AShow%20All%20Questions.meta.js
// ==/UserScript==
//Note: Only been tested in firefox
jQuery(document).ready(function(){
    if (jQuery(".EditSection").length){ //if in edit mode
        var div = jQuery("<div></div>").attr("href","#").addClass('btn btn-primary').click(OutputQuestions).appendTo("#ToolbarContainer div.right");
        jQuery("<span></span>").addClass('icon toolbar-icon-open').appendTo(div);
        jQuery("<span></span>").text("Output Questions").appendTo(div);
    }
});

function OutputQuestions() {

    var Questions = jQuery(".QuestionText").not("#TrashArea .QuestionText");

    var output = jQuery("<div></div>");
    jQuery("<button></button>").attr("id","button").attr("type","button").attr("onclick","ShowHideNAN()").text("Show/Hide Questions without numbers").appendTo(output);
    var table = jQuery("<table></table>").appendTo(output);
    jQuery.each(Questions, function(index, Question) {
        var cell = jQuery("<td></td>").html(Question.innerHTML);
        var row = jQuery("<tr></tr>").append(cell).appendTo(table);
        if (isNaN(Question.textContent.trim().substr(0, 1))) { //if it doesn't start with a number then hide it
            row.addClass("hidden");
        }
    });

    var myWindow = window.open("", "_blank", "scrollbars=yes, menubar=yes");

    var newStyle = jQuery("<style></style>").html(".hidden{ display:none;} table, td{border:1px solid black;display:block;}");
    myWindow.document.head.appendChild(newStyle[0]);

    var newScript = jQuery("<script></script>").html('function ShowHideNAN() { rule = document.styleSheets[0].cssRules[0]; if (rule.style.display == "none") rule.style.display = "block"; else rule.style.display = "none"; }');
    myWindow.document.head.appendChild(newScript[0]);

    myWindow.document.body.appendChild(output[0]);
}
