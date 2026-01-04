// ==UserScript==
// @name         GSK script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/39615/GSK%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39615/GSK%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var sanity = "Please answer the following questions based on the post shown. Each post should take about 1-3 minutes.";
    if(sanity == $('p').eq(10).text().trim()){
        var text = $('p').eq(1).text().trim().toLowerCase();
        $('#Survey').toggle();
        $('h1').toggle();
        $('select:first').val("0"); //changed value from 'select' input to No
        var meds = ["anoro", "breo", "incruse", "advair", "copd", "asthma"];
        var em = 1;
        for(x = 0; x<6 ; x++){
            if (text.indexOf(meds[x]) >= 0){
                em++;
            }
        }
       // if (em){
       //     $('img[src=/media/return_hit.gif]').click();
       // }else{
       //     $('#submitButton.btn btn-primary').click();
      //  }
    }
});