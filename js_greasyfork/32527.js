// ==UserScript==
// @name         Report Auto Categorization Buttons
// @namespace    http://phishme.com
// @version      0.1
// @description  Adds buttons to auto categorize reports
// @author       Matthew Thurber
// @match        https://myc01.managedphishme.com/reports/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/32527/Report%20Auto%20Categorization%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/32527/Report%20Auto%20Categorization%20Buttons.meta.js
// ==/UserScript==

(function() {

    var category;
    var response;
    var tags;
    
    var id = document.location.toString().split("/reports/")[1];
    
 
    
    //Build Spam Button
    category = "2";
    response = "6";
    var spambutton = '<form role="form" class="new_manual_report_categorization" id="new_manual_report_categorization" action="/manual_report_categorizations" accept-charset="UTF-8" data-remote="true" method="post" target="frame"><input type="hidden" name="manual_report_categorization[report_id]" value="'+id+'"></input><input type="hidden" name="manual_report_categorization[redirect_to_reporter]" value=""></input><input type="hidden" name="manual_report_categorization[category_id]" value="'+category+'"></input><input type="hidden" name="manual_report_categorization[auto_response_id]" value="'+response+'"></input><input type="hidden" name="report_id" value="'+id+'"></input><input type="hidden" name="recipe_notification_template_id" value=""></input><input type="hidden" name="manual_report_categorization[categorization_tag_list]" value=""></input><input type="submit" name="commit" value="Spam"></input></form>';
    
    
      //Build NonMalCustInt Button
    category = "1";
    response = "1";
    tags = "Cust-int";
    var nonmalcustintbutton = '<form role="form" class="new_manual_report_categorization" id="new_manual_report_categorization" action="/manual_report_categorizations" accept-charset="UTF-8" data-remote="true" method="post" target="frame"><input type="hidden" name="manual_report_categorization[report_id]" value="'+id+'"></input><input type="hidden" name="manual_report_categorization[redirect_to_reporter]" value=""></input><input type="hidden" name="manual_report_categorization[category_id]" value="'+category+'"></input><input type="hidden" name="manual_report_categorization[auto_response_id]" value="'+response+'"></input><input type="hidden" name="report_id" value="'+id+'"></input><input type="hidden" name="recipe_notification_template_id" value=""></input><input type="hidden" name="manual_report_categorization[categorization_tag_list]" value="'+tags+'"></input><input type="submit" name="commit" value="Non-Mal Cust-int"></input></form>';
    
       //Build NonMalCustInt Button
    category = "1";
    response = "1";
    tags = "Cust-ext";
    var nonmalcustextbutton = '<form role="form" class="new_manual_report_categorization" id="new_manual_report_categorization" action="/manual_report_categorizations" accept-charset="UTF-8" data-remote="true" method="post" target="frame"><input type="hidden" name="manual_report_categorization[report_id]" value="'+id+'"></input><input type="hidden" name="manual_report_categorization[redirect_to_reporter]" value=""></input><input type="hidden" name="manual_report_categorization[category_id]" value="'+category+'"></input><input type="hidden" name="manual_report_categorization[auto_response_id]" value="'+response+'"></input><input type="hidden" name="report_id" value="'+id+'"></input><input type="hidden" name="recipe_notification_template_id" value=""></input><input type="hidden" name="manual_report_categorization[categorization_tag_list]" value="'+tags+'"></input><input type="submit" name="commit" value="Non-Mal Cust-ext"></input></form>';
    
    
      //Build NonMalExt Button
    category = "1";
    response = "6";
    tags = "Non-Malicious-External";
    var nonmalextbutton = '<form role="form" class="new_manual_report_categorization" id="new_manual_report_categorization" action="/manual_report_categorizations" accept-charset="UTF-8" data-remote="true" method="post" target="frame"><input type="hidden" name="manual_report_categorization[report_id]" value="'+id+'"></input><input type="hidden" name="manual_report_categorization[redirect_to_reporter]" value=""></input><input type="hidden" name="manual_report_categorization[category_id]" value="'+category+'"></input><input type="hidden" name="manual_report_categorization[auto_response_id]" value="'+response+'"></input><input type="hidden" name="report_id" value="'+id+'"></input><input type="hidden" name="recipe_notification_template_id" value=""></input><input type="hidden" name="manual_report_categorization[categorization_tag_list]" value="'+tags+'"></input><input type="submit" name="commit" value="Non-Mal External"></input></form>';
    
    
     //Build 419 Button
    category = "2";
    response = "6";
    tags = "419";
    var spam419button = '<form role="form" class="new_manual_report_categorization" id="new_manual_report_categorization" action="/manual_report_categorizations" accept-charset="UTF-8" data-remote="true" method="post" target="frame"><input type="hidden" name="manual_report_categorization[report_id]" value="'+id+'"></input><input type="hidden" name="manual_report_categorization[redirect_to_reporter]" value=""></input><input type="hidden" name="manual_report_categorization[category_id]" value="'+category+'"></input><input type="hidden" name="manual_report_categorization[auto_response_id]" value="'+response+'"></input><input type="hidden" name="report_id" value="'+id+'"></input><input type="hidden" name="recipe_notification_template_id" value=""></input><input type="hidden" name="manual_report_categorization[categorization_tag_list]" value="'+tags+'"></input><input type="submit" name="commit" value="419"></input></form>';
    

       //Build Lottery Button
    category = "2";
    response = "6";
    tags = "Lottery";
    var lotterybutton = '<form role="form" class="new_manual_report_categorization" id="new_manual_report_categorization" action="/manual_report_categorizations" accept-charset="UTF-8" data-remote="true" method="post" target="frame"><input type="hidden" name="manual_report_categorization[report_id]" value="'+id+'"></input><input type="hidden" name="manual_report_categorization[redirect_to_reporter]" value=""></input><input type="hidden" name="manual_report_categorization[category_id]" value="'+category+'"></input><input type="hidden" name="manual_report_categorization[auto_response_id]" value="'+response+'"></input><input type="hidden" name="report_id" value="'+id+'"></input><input type="hidden" name="recipe_notification_template_id" value=""></input><input type="hidden" name="manual_report_categorization[categorization_tag_list]" value="'+tags+'"></input><input type="submit" name="commit" value="Lottery"></input></form>';
    

    
    
    
    $("#recategorize_link").after("<iframe src='' width='1px' height='1px' name='frame' style='display:none'></iframe>");
    $("#recategorize_link").after("<img id='loading' src='https://qzprod.files.wordpress.com/2015/04/loading.gif?w=1600' width='10%' height='10%'>");
    $("#loading").hide();
    
    $("#recategorize_link").after(lotterybutton);
    $("#recategorize_link").after(spam419button);
    $("#recategorize_link").after(nonmalextbutton);
    $("#recategorize_link").after(nonmalcustextbutton);
    $("#recategorize_link").after(nonmalcustintbutton);
    $("#recategorize_link").after(spambutton);
    
    
    $( "input[name='commit']" ).click(function() {
  $("#loading").show();
});
    
  
    
    
    
    // Your code here...
})();