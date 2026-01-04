// ==UserScript==
// @name         Triage Processed Search Overhaul
// @namespace    http://phishme.com
// @version      1.1
// @description  Allows searching by processed date
// @author       Matthew Thurber
// @require      https://greasyfork.org/scripts/31759-multiple-select/code/Multiple%20Select.js?version=208177
// @match        https://*.managedphishme.com/processed*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31760/Triage%20Processed%20Search%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/31760/Triage%20Processed%20Search%20Overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';


        
    
    
    
  
    //Remove Elements
   $('input[name="q[suspect_received_at]"]').remove();
   $('input[name="commit"]').remove();
   $('button[name="button"]').remove();
    
    
    //Add Fields
    document.getElementById('search').innerHTML+='<input class="daterange input-sm" placeholder="Processed" type="text" name="q[processed_at]" id="q_processed_at">';
    document.getElementById('search').innerHTML+='<input class="daterange input-sm" placeholder="Received" type="text" name="q[suspect_received_at]" id="q_suspect_received_at">';

    //Add Hidden Fields
     document.getElementById('search').innerHTML+='<input type="hidden" name="q[processed_at_gteq]" id="q_processed_at_gteq" />';
     document.getElementById('search').innerHTML+='<input type="hidden" name="q[processed_at_end_of_day_lteq]" id="q_processed_at_end_of_day_lteq" />';
    
    //Add Submit
    document.getElementById('search').innerHTML+='<input id="newsubmit" type="test" name="commit" value="Filter" class="btn btn-primary btn-sm input-sm form-control">';

    //Add Reset
     document.getElementById('search').innerHTML+='<button name="button" type="reset" class="btn btn-default btn-sm input-sm form-control nudge-right">Reset</button>';
    
    //Update Hidden on Submit
    function updatehidden(){
        if (document.getElementById('q_processed_at').value !== ""){
        var processedatgteq = document.getElementById('q_processed_at').value.split(' - ')[0];
        var processedatgteqfix = processedatgteq.split("/");
        processedatgteq = processedatgteqfix[2]+"/"+processedatgteqfix[0]+"/"+processedatgteqfix[1];
        
        var processedatlteq = document.getElementById('q_processed_at').value.split(' - ')[1];
        var processedatlteqfix = processedatlteq.split("/");
        processedatlteq = processedatlteqfix[2]+"/"+processedatlteqfix[0]+"/"+processedatlteqfix[1];
    }
        
         if (document.getElementById('q_suspect_received_at').value !== ""){
        
        var receivedatgteq = document.getElementById('q_suspect_received_at').value.split(' - ')[0];
        var receivedatgteqfix = receivedatgteq.split("/");
        receivedatgteq = receivedatgteqfix[2]+"/"+receivedatgteqfix[0]+"/"+receivedatgteqfix[1];
        
        var receivedatlteq = document.getElementById('q_suspect_received_at').value.split(' - ')[1];
        var receivedatlteqfix = receivedatlteq.split("/");
        receivedatlteq = receivedatlteqfix[2]+"/"+receivedatlteqfix[0]+"/"+receivedatlteqfix[1];
    }
        
       
        
        
        if (document.getElementById('q_processed_at').value !== ""){
        document.getElementById('q_processed_at_end_of_day_lteq').value=processedatlteq.replace(/\//g, '-');
        document.getElementById('q_processed_at_gteq').value=processedatgteq.replace(/\//g, '-');
        
        }
        
        if (document.getElementById('q_suspect_received_at').value !== ""){
        document.getElementById('q_suspect_received_at_gteq').value=receivedatgteq.replace(/\//g, '-');
        document.getElementById('q_suspect_received_at_end_of_day_lteq').value=receivedatlteq.replace(/\//g, '-');
           
        }
        
        
    }
    
    function submitform(){
        document.getElementById('search').submit()
    }
    
    
    
    $("#newsubmit").click(updatehidden);
    $("#newsubmit").click(submitform);
    
        
    
    
    //Fix Date Picker
          $('input[name="q[suspect_received_at]"]').daterangepicker({
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });
        $('input[name="q[processed_at]"]').daterangepicker({
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });
    
  
    
    
    //Fix Category Selector
    $('#q_category_id_in').multipleSelect({
            placeholder: "Category"
        });
    $('.multipleselect').eq(2).hide();
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
})();