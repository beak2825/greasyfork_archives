// ==UserScript==
// @name         QuickSearchUtility
// @namespace    http://tampermonkey.net/
// @version      10.9
// @description  relate record search
// @author       Preshit Doshi
// @match        https://support.servicenow.com/sn_customerservice_case.do*
// @icon         https://www.google.com/s2/favicons?domain=servicenow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433810/QuickSearchUtility.user.js
// @updateURL https://update.greasyfork.org/scripts/433810/QuickSearchUtility.meta.js
// ==/UserScript==
(function(){
    
    'use strict';
    var count = 0;
    var followUp = document.getElementById("toggleMoreOptions"); //connectFollowWidget
    //let spanNode = document.createElement("span");
    //spanNode.setAttribute("style",'color:red;margin-left:0em ;display:inline-block;');
    let resBtn = document.createElement("button");
    resBtn.innerHTML = "<b>Find Similar Issues</b>";
    resBtn.setAttribute("style",'color:green;margin-left:1em ;display:inline-block;');
    resBtn.addEventListener("click",ButtonClickAction,false);
    //followUp.insertBefore(spanNode,followUp.childNodes[0]);
    $j(".navbar_ui_actions").prepend(resBtn);
    //followUp.insertBefore(resBtn,followUp.childNodes[0]);
    function ButtonClickAction(zEvent) {
        // alert("Testing");
        document.getElementById('sn_customerservice_case.form_scroll').style.display = 'none';
        //document.getElementById('sn_customerservice_case.form_header').style.display = 'none';
        if(count == 0){
            renderForm();
        }
        else{
            document.getElementById('related-records').style.display = '';
        }
    }
    function renderForm(){

        let feedCount = 0;
       let avgRating = 0;
        var xmlhttpReq = getRating();
            xmlhttpReq.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    //var value = JSON.parse(this.response).result.length;
                    var b = JSON.parse(this.response);
                    feedCount = b.fcount;
                    avgRating = b.avgRate;
                   // $j("#avg_rating").html(avgRating);
                    $j("#feed_count").html(feedCount);
                     $j("#rating_count").show();
                   var stars = document.querySelectorAll(".stars a");
                    var ratedIndex = avgRating;
                    for (i = 0; i < stars.length; ++i) {
                    if(i <= ratedIndex-1){
                    stars[i].setOpacity("100%");
                     }
                  }
                   // $j('#tool_feed').text(a.avgRate + "/5 from "+a.fcount surveys );
                   console.log(b);
                    }
                    }
        xmlhttpReq.send();

        count += 1;
        var zNode = document.createElement('div');
        $j("#pbtable").hide();
        $j("#ctasktable").hide();
        $j("#casetable").hide();
        zNode.setAttribute("class","section_header_content_no_scroll");
        zNode.innerHTML = `
                <div class="container" style="background:azure;">
                  <div class="row section_header_content_no_scroll" id="related-records">
                      <div class="vsplit col-sm-9" id="col1">
                      <div class="header_text">Related Records Search</div>
                      </div>
                      <div class="vsplit col-sm-3" id="col2">
                      </div>

                 </div>


                 </div>

               </div>
               <style>
               div.scrl {

             overflow: auto;
}
               .header_text{
    font-size: 25px;
    font-family: monospace;
    margin-top: 20px;
    margin-left: 40%;
    text-decoration-line: overline;
    padding-bottom: 20px;
               }
              .sub_header_text {
                font-family: inherit;
                font-size: large;
                font-weight: bold;
}
               .search-box{
               background-color: white;
                padding-left: 5px;
                width: 100%;
                }
                label {
    font-weight: normal;
    font-family: inherit;
    font-size: initial;
}
               .body{
                    overflow:auto !important;
               }
               .lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

.stars a{
display:inline-flex;
padding:0.5em;
opacity:50%
}




               </style>
               `;
        $j('body').append(zNode);
        zNode = document.createElement('div');
        zNode.innerHTML = `<br>`;
        //zNode.innerHTML +=`<div class="sub_header_text"> Rated ${avgRating}/5 (${feedCount} Surveys)<div>`;
        //zNode.innerHTML +=`<div id= rating_count class="sub_header_text" style="display:none"> Rated <span id="avg_rating">4</span>/5 Of <span id="feed_count">5</span> Surveys<div><br>`
        zNode.innerHTML +=`<div id= rating_count class="stars"><a>⭐</a><a>⭐</a><a>⭐</a><a>⭐</a><a>⭐</a><span>(<span><span id="feed_count"></span> Surveys<span>)<span><div><br></div>`
        zNode.innerHTML += `<label for="timeframet-select"  class="sub_header_text" style="padding-top: 11%">Choose a Timefreame:</label><br>
     <select name="Timeframe" style="width: 100%" id="timeframet-select">
    <option value="">--Please choose an option--</option>
    <option value="this_month">This Month</option>
    <option value="last_month">Last Month</option>
    <option value="last_three_month">Last 3 Months</option>
    <option value="last_six_month" selected>Last 6 Months</option>
    <option value="last_twelve_month">Last 12 Months</option>
</select>`;

        /*
var d = new Date();
d.setMonth(d.getMonth() - 3);

document.getElementById('start').value = d.toISOString().substr(0,10); */

        /*zNode.innerHTML += `<label for="start" class="sub_header_text">Start date   :  </label>`;
        zNode.innerHTML += `<br>`;
        zNode.innerHTML += `<input type="date" id="start" name="start" value="">`;
        zNode.innerHTML += `<br><br>`;
        zNode.innerHTML += `<label for="start" class="sub_header_text">End date    :  </label>`;
        zNode.innerHTML += `<br>`;
        zNode.innerHTML += `<input type="date" id="end" name="end" value="">`; */
        $j('#col2').append(zNode);
        zNode = document.createElement('div');
        zNode.innerHTML = `<br>`;
        zNode.innerHTML += `<label for="keywords" class="sub_header_text">Search </label>`;
        zNode.innerHTML += `<span style="
    margin-left: 1em;
"><a href=https://support.servicenow.com/kb?id=kb_article_view&amp;sysparm_article=KB0997858 target="_blank">Need help?</a></span>`
        zNode.innerHTML += `<br>`;
        zNode.innerHTML += ` <textarea type="text" id="keywords" name="keywords" class="search-box" placeholder="(Enter keywords separated by comma)"></textarea><br>`;
        //zNode = document.createElement('div');
        // zNode.innerHTML = `<br><br>`;
        zNode.innerHTML += '<button id="rel_search" type="button" style="color:green; margin-left:0.2em">' + 'Search</button>';
        zNode.innerHTML += '<button id="show_back_to_case" type="button" style="color:red; margin-left:0.2em">' + 'Back to Case</button>';
        zNode.innerHTML += '<button id="feedback" type="button" style="color: white;margin-left:0.2em;background: #293E40;">Feedback</button>'
        $j('#col2').append(zNode);
        //$j('#col2').append(zNode);
        zNode = document.createElement('div');
        zNode.innerHTML = `<br>`;
        zNode.innerHTML +=`<label><input type="checkbox" value="all_match" id="all_match" checked> Search for exact match including all keywords</label>`;
        $j('#col2').append(zNode);
        zNode = document.createElement('div');
        zNode.innerHTML = `<br>`;
        zNode.innerHTML += `<fieldset class="CbxGroup">
  <b class="sub_header_text">Select Search criteria fields</b><br><br>
  <label><input type="checkbox" name="cbxGroup1[]" value="prb_short_desc" id="prb_short_desc" checked> Problem Short Description </label>
  <br>
  <label><input type="checkbox" name="cbxGroup1[]" value="prb_workaround" id="prb_workaround" checked> Problem work around </label>
  <br>
  <label><input type="checkbox" name="cbxGroup1[]" value="prb_step" id="prb_step" checked> Problem Steps to reproduce </label>
  <br>
   <label><input type="checkbox" name="cbxGroup1[]" value="case_short_desc" id="case_task_short_desc" checked> Case Task Subject</label>
  <br>
   <label><input type="checkbox" name="cbxGroup1[]" value="case_task_desc" id="case_task_desc" checked> Case Task Description</label>
  <br>
   <label><input type="checkbox" name="cbxGroup1[]" value="case_short_desc" id="case_short_desc" checked> Case Short Description</label>
  <br>
  <label><input type="checkbox" name="cbxGroup1[]" value="case_desc" id="case_desc" checked> Case Description</label>
  <br>
  <label><input type="checkbox" name="cbxGroup1[]" value="case_tap" id="case_tap" checked> Case Technical Action Plan </label>
  <br>
   <label><input type="checkbox" name="cbxGroup1[]" value="case_res_notes" id="case_res_notes" checked> Case Resolution </label>
   <br>
  <label><input type="checkbox" name="cbxGroup1[]" value="kb_search" id="kb_search"> Knowledge Article Title </label>
  <br>
  <label><input type="checkbox" name="cbxGroup1[]" value="select_all" id="select_all"> Check / Uncheck All </label>
  <br>
</fieldset>`;
        zNode.innerHTML += `<br><br><b><span>Powered By :<span><b> <span>Technical Support Architects<span><br>
<b><span>Developed By :<span><b> <span>Preshit Doshi<span>`
        $j('#col2').append(zNode);

        document.getElementById('select_all').onclick = function() {
            var checkboxes = document.getElementsByName('cbxGroup1[]');
            for (var checkbox of checkboxes) {
                checkbox.checked = this.checked;

            }
        }

        /*  zNode = document.createElement('div');
        zNode.innerHTML = `<br><br>`;
        zNode.innerHTML += '<button id="rel_search" type="button" style="color:green">' + 'Search</button>';
        zNode.innerHTML += '<button id="show_trback_to_case" type="button" style="color:red">' + 'Exit</button>';
        $j('#col2').append(zNode);*/
        document.getElementById("rel_search").addEventListener("click", fetchData, false);
        document.getElementById("show_back_to_case").addEventListener("click", showCase, false);
        document.getElementById("feedback").addEventListener("click", getFeedback, false);

        function getFeedback() {
        var instance = "https://londonpdoshi.service-now.com/";
        var survey = "esc?id=public_survey&type_id=272733bc87537450475d63dd0ebb35e3";
        var surveyUrl = instance+survey;
            window.open(
             surveyUrl , "_blank");
        }



        function showCase() {
            document.getElementById('related-records').style.display = 'none';
            document.getElementById('sn_customerservice_case.form_scroll').style.display = '';

        }


        function fetchData() {
            $j(".count_val").text("");
            $j("#pbtable").hide();
            $j("#ctasktable").hide();
            $j("#casetable").hide();
            $j("#pb_table").find("tr:not(:first)").remove();
            $j("#ctask_table").find("tr:not(:first)").remove();
            $j("#case_table").find("tr:not(:first)").remove();

            var start_date = "";
            var end_date = "";
            var d = "";
            var e = "";
          
            //  var selectedManager = $j('#selected_manager').val();
            // var selectedEngineer = $j('#selected_engineer').val();
            if(document.getElementById('timeframet-select').value == "this_month"){
                d = new Date();
                var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
                start_date = firstDay.toISOString().substr(0,10);
                e = new Date();
                end_date = e.toISOString().substr(0,10);
            }
            else if(document.getElementById('timeframet-select').value == "last_month"){
                d = new Date();
                d.setMonth(d.getMonth() - 1);
                start_date = d.toISOString().substr(0,10);
                e = new Date();
                end_date = e.toISOString().substr(0,10);
                //end_date = e.toISOString().substr(0,10);
            }
            else if(document.getElementById('timeframet-select').value == "last_three_month"){
                d = new Date();
                d.setMonth(d.getMonth() - 3);
                start_date = d.toISOString().substr(0,10);
                e = new Date();
                end_date = e.toISOString().substr(0,10);
            }
            else if(document.getElementById('timeframet-select').value == "last_six_month"){
                d = new Date();
                d.setMonth(d.getMonth() - 6);
                start_date = d.toISOString().substr(0,10);
                e = new Date();
                end_date = e.toISOString().substr(0,10);
            }
            else if(document.getElementById('timeframet-select').value == "last_twelve_month"){
                d = new Date();
                d.setMonth(d.getMonth() - 12);
                start_date = d.toISOString().substr(0,10);
                e = new Date();
                end_date = e.toISOString().substr(0,10);
            }



            var keywords = $j('#keywords').val();
            var exactMatch = $j('#all_match').val();
            // var start_date = $j('#start').val();
            // var end_date = $j('#end').val();
            if (keywords && start_date && end_date) {

               /* $j('#rel_prb').text("...");
                $j('#rel_case_task').text("...");
                $j('#rel_case').text("...");
                $j('#rel_kb').text("...");*/


                getRelatedProblems(keywords,start_date,end_date);
                getRelatedCaseTasks(keywords,start_date,end_date);
                getRelatedCases(keywords,start_date,end_date);
                gerRelatedKnowledge(keywords);

            } else {
                alert("Select Time Frame and Keywords to search");
            }
        }
        //####################################
        //Add Containers
        //####################################
        zNode = document.createElement('div');

        zNode.innerHTML = `
   <div class="container" id="case-containter1" style="padding-top: 5% overflow: auto;">
    <div class="row" >
        <div class="vsplit col-sm-2" id="col11">
            <div class="sn-canvas-header-tools" style="height: 30px;">
                <p style="text-align:center;" class="sub_header_text1">Problems</p>
            </div>
            <div class="sn-canvas-header-tools" style="height: 100px;">
                <p id="rel_prb" class="count_val"></p>
            </div>
        </div>
        <div class="vsplit col-sm-2" id="col12">
            <div class="sn-canvas-header-tools" style="height: 30px;">
                <p style="text-align:center;" class="sub_header_text1">Case Tasks</p>
            </div>
            <div class="sn-canvas-header-tools" style="height: 100px;">
                <p id="rel_case_task" class="count_val"></p>
            </div>
        </div>
        <div class="vsplit col-sm-2" id="col13">
            <div class="sn-canvas-header-tools" style="height: 30px;">
                <p style="text-align:center;" class="sub_header_text1">Cases</p>
            </div>
            <div class="sn-canvas-header-tools" style="height: 100px;">
                <p id="rel_case" class="count_val"></p>
            </div>
        </div>
        <div class="vsplit col-sm-2" id="col14">
            <div class="sn-canvas-header-tools" style="height: 30px;">
                <p style="text-align:center;" class="sub_header_text1">Knowledge Articles</p>
            </div>
            <div class="sn-canvas-header-tools" style="height: 100px;">
                <p id="rel_kb" class="count_val"></p>
            </div>
        </div>
    </div>
</div>
<div id="pbtable" style="display:none;margin-top: 3%;">
    <table style="
        border: 1px solid #333;
        width: -webkit-fill-available;
        "id="pb_table">
        <thead class="table_head">
            <tr>
                <th colspan="2" style="
                    /* align-content: center; */
                    text-align: center;
                    ">Recent Poblems</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<br>
<div id="ctasktable" style="display:none;">
    <table style="
        border: 1px solid #333;
        width: -webkit-fill-available;
        "id="ctask_table">
        <thead class="table_head">
            <tr>
                <th colspan="2" style="
                    /* align-content: center; */
                    text-align: center;
                    ">Recent Case Tasks</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<br>
<div id="casetable" style="display:none;">
    <table style="
        border: 1px solid #333;
        width: -webkit-fill-available;
        "id="case_table">
        <thead class="table_head">
            <tr>
                <th colspan="2" style="
                    /* align-content: center; */
                    text-align: center;
                    ">Recent Cases</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<br>
<style>
    .count_val{
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 50px;
    background: #80B6A1 !important;
    color: whitesmoke;
    }
    .sub_header_text1{
    background: #293E40 !important;
    text-align: center;
    font-family: inherit;
    font-size: large;
    color: white;
    }
    .table_head{
    text-align: center;
    background-color: #293E40;
    font-family: inherit;
    font-size: large;
    color : white;
    }

</style>`;
        $j('#col1').append(zNode);

        //####################################
        //Generic Send Request Function
        //####################################
        function getRating() {

            var endpoint = " https://londonpdoshi.service-now.com/api/snc/getfeedback";
            var client = new XMLHttpRequest();
            client.open("get", endpoint);
            client.setRequestHeader('Accept', 'application/json');
            client.setRequestHeader('Content-Type', 'application/json');
            return client;
        };

        function sendRequest(table_name, sysparm_fields, sysparm_query) {
          
            var endpoint = "https://support.servicenow.com" + "/api/now/table/" + table_name + "?";
            endpoint += "sysparm_query=" + sysparm_query + "&";
            endpoint += "sysparm_fields=" + sysparm_fields + "&";
            var client = new XMLHttpRequest();
            client.open("get", endpoint);
            client.setRequestHeader('Accept', 'application/json');
            client.setRequestHeader('Content-Type', 'application/json');
            client.setRequestHeader('X-UserToken', window.g_ck);
            return client;
        };

        //####################################
        //Get Related Problems
        //####################################
        function getRelatedProblems(keywords,startDate,endDate) {
         
            var sysparm_query = "";
            var keyArr = keywords.split(',');
            var table_name = "problem";
            var sysparm_fields = "sys_id,number,short_description";
            // var startDate = start_date;
            //  var endDate = end_date;
            var prb_link = "";
            var finalQuery = "";
            var query1 = `sys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            var query2 = `^NQsys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            var query3 = `^NQsys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            if(document.getElementById('all_match').checked && document.getElementById('prb_short_desc').checked && document.getElementById('prb_workaround').checked && document.getElementById('prb_step').checked){
                finalQuery = "";
                for(var i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query1+query2+query3;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && document.getElementById('prb_short_desc').checked && document.getElementById('prb_workaround').checked && !document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    //query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query1+query2;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && document.getElementById('prb_short_desc').checked && !document.getElementById('prb_workaround').checked && !document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                   // query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    //query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query1;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('prb_short_desc').checked && !document.getElementById('prb_workaround').checked && document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    //query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                   // query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query3;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('prb_short_desc').checked && document.getElementById('prb_workaround').checked && !document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query2;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
             else if(document.getElementById('all_match').checked && document.getElementById('prb_short_desc').checked && !document.getElementById('prb_workaround').checked && document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                  //  query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query1+query3;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('prb_short_desc').checked && document.getElementById('prb_workaround').checked && document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                   // query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query2+query3;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
           else if(!document.getElementById('all_match').checked && document.getElementById('prb_short_desc').checked && document.getElementById('prb_workaround').checked && document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query2 += "^ORu_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^ORu_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query1+query2+query3;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && document.getElementById('prb_short_desc').checked && document.getElementById('prb_workaround').checked && !document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                   // query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query2 += "^ORu_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                      //  query3 += "^ORu_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query1+query2;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && document.getElementById('prb_short_desc').checked && !document.getElementById('prb_workaround').checked && !document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    //query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                   // query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                      //  query2 += "^ORu_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                     //   query3 += "^ORu_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query1;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('prb_short_desc').checked && document.getElementById('prb_workaround').checked && !document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                   // query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                   // query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                     //   query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query2 += "^ORu_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    //    query3 += "^ORu_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query2;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('prb_short_desc').checked && !document.getElementById('prb_workaround').checked && document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                   // query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                  //  query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                      //  query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                     ///   query2 += "^ORu_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^ORu_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query3;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && document.getElementById('prb_short_desc').checked && !document.getElementById('prb_workaround').checked && document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                   // query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                       // query2 += "^ORu_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^ORu_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query1+query3;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('prb_short_desc').checked && document.getElementById('prb_workaround').checked && document.getElementById('prb_step').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                   // query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^u_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^u_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                     //   query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query2 += "^ORu_workaroundLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^ORu_steps_to_reproduceLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query2+query3;
                sysparm_query = finalQuery;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else {
                sysparm_query = `GOTO123TEXTQUERY321=${keywords}^sys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
                prb_link = `<a href = https://support.servicenow.com/problem_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            var xmlhttpReq = sendRequest(table_name, sysparm_fields, sysparm_query);
            $j('#rel_prb').append(`<div class="lds-ripple"><div></div><div></div></div>`);
            xmlhttpReq.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    var value = JSON.parse(this.response).result.length;
                    var a = JSON.parse(this.response).result;
                    $j('#rel_prb').text(value);
                    //document.getElementById("rel_prb").src = prb_link;
                    $j('#rel_prb').wrap(prb_link);
                    if(value > 0){
                        $j("#pbtable").show();
                    for (var i = 0; i < a.slice(0,10).length; i += 1) {
                        $j("#pb_table").append(`<tr><td class="vt"><a href = https://support.servicenow.com/nav_to.do?uri=problem.do?sys_id=${JSON.parse(this.response).result[i].sys_id} target="_blank">` + JSON.parse(this.response).result[i].number + `</td><td class="vt">`+JSON.parse(this.response).result[i].short_description.substr(0,119)+`<td></tr>`);
                    }
                    }
                }
            }
            xmlhttpReq.send();
        };
        //####################################
        //Get Related Case Tasks
        //####################################
        function getRelatedCaseTasks(keywords,startDate,endDate) {
          
            var sysparm_query = "";
            var keyArr = keywords.split(',');
            var table_name = "sn_customerservice_task";
            var sysparm_fields = "sys_id,number,short_description";
            // var startDate = start_date;
            //  var endDate = end_date;
            var ctask_link = "";
            var finalQuery = "";
            var query1 = `sys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            var query2 = `^NQsys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            if(document.getElementById('all_match').checked && document.getElementById('case_task_short_desc').checked && document.getElementById('case_task_desc').checked){
                for(var i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query1+query2;
                sysparm_query = finalQuery;
                ctask_link = `<a href = https://support.servicenow.com/sn_customerservice_task_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && document.getElementById('case_task_short_desc').checked && !document.getElementById('case_task_desc').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    // query2 += "^descriptionLIKE"+keyArr[i];
                }
                finalQuery = query1;
                sysparm_query = finalQuery;
                ctask_link = `<a href = https://support.servicenow.com/sn_customerservice_task_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('case_task_short_desc').checked && document.getElementById('case_task_desc').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    //query1 += "^short_descriptionLIKE"+keyArr[i];
                    query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query2;
                sysparm_query = finalQuery;
                ctask_link = `<a href = https://support.servicenow.com/sn_customerservice_task_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && document.getElementById('case_task_short_desc').checked && document.getElementById('case_task_desc').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query2 += "^ORdescriptionLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query1+query2;
                sysparm_query = finalQuery;
                ctask_link = `<a href = https://support.servicenow.com/sn_customerservice_task_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('case_task_short_desc').checked && document.getElementById('case_task_desc').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        //query1 += "^short_descriptionLIKE"+keyArr[i];
                        query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        // query1 += "^ORORshort_descriptionLIKE"+keyArr[i];
                        query2 += "^ORdescriptionLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query2;
                sysparm_query = finalQuery;
                ctask_link = `<a href = https://support.servicenow.com/sn_customerservice_task_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && document.getElementById('case_task_short_desc').checked && !document.getElementById('case_task_desc').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        // query2 += "^descriptionLIKE"+keyArr[i];
                    }
                    else{
                        query1 += "^ORORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        //      query2 += "^ORdescriptionLIKE"+keyArr[i];
                    }

                }
                finalQuery = query1;
                sysparm_query = finalQuery;
                ctask_link = `<a href = https://support.servicenow.com/sn_customerservice_task_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else {
                sysparm_query = `GOTO123TEXTQUERY321=${keywords}^sys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
                ctask_link = `<a href = https://support.servicenow.com/sn_customerservice_task_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            var xmlhttpReq = sendRequest(table_name, sysparm_fields, sysparm_query);
             $j('#rel_case_task').append(`<div class="lds-ripple"><div></div><div></div></div>`);
            xmlhttpReq.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    var value = JSON.parse(this.response).result.length;
                     var a = JSON.parse(this.response).result;
                    $j('#rel_case_task').text(value);
                    //document.getElementById("rel_prb").src = prb_link;
                    $j('#rel_case_task').wrap(ctask_link);
                    if(value > 0){
                        $j("#ctasktable").show();

                    for (var i = 0; i < a.slice(0,10).length; i += 1) {
                        $j("#ctask_table").append(`<tr><td class="vt"><a href = https://support.servicenow.com/nav_to.do?uri=sn_customerservice_task.do?sys_id=${JSON.parse(this.response).result[i].sys_id} target="_blank">` + JSON.parse(this.response).result[i].number + `</td><td class="vt">`+JSON.parse(this.response).result[i].short_description.substr(0,119)+`<td></tr>`);
                    }
                    }
                }
            }
            xmlhttpReq.send();
        };

        //####################################
        //Get Related Cases
        //####################################
        function getRelatedCases(keywords,startDate,endDate) {
          
            var sysparm_query = "";
            var keyArr = keywords.split(',');
            var table_name = "sn_customerservice_case";
            var sysparm_fields = "sys_id,number,short_description";
            //  var startDate = start_date;
            //  var endDate = end_date;
            var case_link = "";
            var finalQuery = "";
            var query1 = `sys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            var query2 = `^NQsys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            var query3 = `^NQsys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            var query4 = `^NQsys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
            if(document.getElementById('all_match').checked && document.getElementById('case_short_desc').checked &&document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                for(var i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                    query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query1+query2+query3+query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked &&document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    //query1 += "^short_descriptionLIKE"+keyArr[i];
                    query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                    query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query2+query3+query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && !document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    //query1 += "^short_descriptionLIKE"+keyArr[i];
                    // query2 += "^descriptionLIKE"+keyArr[i];
                    query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                    query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query3+query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && !document.getElementById('case_desc').checked && !document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    //query1 += "^short_descriptionLIKE"+keyArr[i];
                    // query2 += "^descriptionLIKE"+keyArr[i];
                    // query3 += "^close_notesLIKE"+keyArr[i];
                    query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && !document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    // query3 += "^close_notesLIKE"+keyArr[i];
                    //query4 += "^u_technical_action_planLIKE"+keyArr[i];
                }
                finalQuery = query1+query2;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^descriptionLIKE"+kencodeURIComponent(keyArr[i]);
                    query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                    //query4 += "^u_technical_action_planLIKE"+keyArr[i];
                }
                finalQuery = query1+query2+query3;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && !document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    // query3 += "^close_notesLIKE"+keyArr[i];
                    query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                }
                finalQuery = query1+query2+query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && document.getElementById('case_short_desc').checked && !document.getElementById('case_desc').checked && !document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    // query2 += "^descriptionLIKE"+keyArr[i];
                    // query3 += "^close_notesLIKE"+keyArr[i];
                    // query4 += "^u_technical_action_planLIKE"+keyArr[i];
                }
                finalQuery = query1;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && !document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    // query2 += "^descriptionLIKE"+keyArr[i];
                    // query3 += "^close_notesLIKE"+keyArr[i];
                    // query4 += "^u_technical_action_planLIKE"+keyArr[i];
                }
                finalQuery = query2;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && !document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                for( i=0; i<=keyArr.length-1; i++){
                    // query1 += "^short_descriptionLIKE"+keyArr[i];
                    // query2 += "^descriptionLIKE"+keyArr[i];
                    query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                    // query4 += "^u_technical_action_planLIKE"+keyArr[i];
                }
                finalQuery = query2;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(document.getElementById('all_match').checked && document.getElementById('case_short_desc').checked && !document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                finalQuery = "";

                for( i=0; i<=keyArr.length-1; i++){
                    query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    //query2 += "^descriptionLIKE"+keyArr[i];
                    query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                    // query4 += "^u_technical_action_planLIKE"+keyArr[i];
                }
                finalQuery = query1+query3;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        query1 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                        query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        query1 += "^ORshort_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query2 += "^ORdescriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^ORclose_notesLIKE"+encodeURIComponent(keyArr[i]);
                        query4 += "^ORu_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query1+query2+query3+query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        // query1 += "^short_descriptionLIKE"+keyArr[i];
                        query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                        query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        // query1 += "^ORshort_descriptionLIKE"+keyArr[i];
                        query2 += "^ORdescriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^ORclose_notesLIKE"+encodeURIComponent(keyArr[i]);
                        query4 += "^ORu_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query2+query3+query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && !document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        // query1 += "^short_descriptionLIKE"+keyArr[i];
                        // query2 += "^descriptionLIKE"+keyArr[i];
                        query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                        query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        // query1 += "^ORshort_descriptionLIKE"+keyArr[i];
                        //  query2 += "^ORdescriptionLIKE"+keyArr[i];
                        query3 += "^ORclose_notesLIKE"+encodeURIComponent(keyArr[i]);
                        query4 += "^ORu_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query3+query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && !document.getElementById('case_desc').checked && !document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        // query1 += "^short_descriptionLIKE"+keyArr[i];
                        // query2 += "^descriptionLIKE"+keyArr[i];
                        // query3 += "^close_notesLIKE"+keyArr[i];
                        query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        // query1 += "^ORshort_descriptionLIKE"+keyArr[i];
                        //  query2 += "^ORdescriptionLIKE"+keyArr[i];
                        //   query3 += "^ORclose_notesLIKE"+keyArr[i];
                        query4 += "^ORu_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query4;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && !document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        // query1 += "^short_descriptionLIKE"+keyArr[i];
                        query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        // query3 += "^close_notesLIKE"+keyArr[i];
                        //  query4 += "^u_technical_action_planLIKE"+keyArr[i];
                    }
                    else{
                        // query1 += "^ORshort_descriptionLIKE"+keyArr[i];
                        query2 += "^ORdescriptionLIKE"+encodeURIComponent(keyArr[i]);
                        //   query3 += "^ORclose_notesLIKE"+keyArr[i];
                        //  query4 += "^ORu_technical_action_planLIKE"+keyArr[i];
                    }

                }
                finalQuery = query2;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        // query1 += "^short_descriptionLIKE"+keyArr[i];
                        query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                        //query4 += "^u_technical_action_planLIKE"+keyArr[i];
                    }
                    else{
                        // query1 += "^ORshort_descriptionLIKE"+keyArr[i];
                        query2 += "^ORdescriptionLIKE"+encodeURIComponent(keyArr[i]);
                        query3 += "^ORclose_notesLIKE"+encodeURIComponent(keyArr[i]);
                        // query4 += "^ORu_technical_action_planLIKE"+keyArr[i];
                    }

                }
                finalQuery = query2+query3;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && document.getElementById('case_desc').checked && !document.getElementById('case_res_notes').checked && document.getElementById('case_tap').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        // query1 += "^short_descriptionLIKE"+keyArr[i];
                        query2 += "^descriptionLIKE"+encodeURIComponent(keyArr[i]);
                        // query3 += "^close_notesLIKE"+keyArr[i];
                        query4 += "^u_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }
                    else{
                        // query1 += "^ORshort_descriptionLIKE"+keyArr[i];
                        query2 += "^ORdescriptionLIKE"+encodeURIComponent(keyArr[i]);
                        // query3 += "^ORclose_notesLIKE"+keyArr[i];
                        query4 += "^ORu_technical_action_planLIKE"+encodeURIComponent(keyArr[i]);
                    }

                }
                finalQuery = query2+query3;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            else if(!document.getElementById('all_match').checked && !document.getElementById('case_short_desc').checked && !document.getElementById('case_desc').checked && document.getElementById('case_res_notes').checked && !document.getElementById('case_tap').checked){
                finalQuery = "";
                for( i=0; i<=keyArr.length-1; i++){
                    if(i==0){
                        // query1 += "^short_descriptionLIKE"+keyArr[i];
                        // query2 += "^descriptionLIKE"+keyArr[i];
                        query3 += "^close_notesLIKE"+encodeURIComponent(keyArr[i]);
                        //query4 += "^u_technical_action_planLIKE"+keyArr[i];
                    }
                    else{
                        // query1 += "^ORshort_descriptionLIKE"+keyArr[i];
                        //  query2 += "^ORdescriptionLIKE"+keyArr[i];
                        query3 += "^ORclose_notesLIKE"+encodeURIComponent(keyArr[i]);
                        // query4 += "^ORu_technical_action_planLIKE"+keyArr[i];
                    }

                }
                finalQuery = query2+query3;
                sysparm_query = finalQuery;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query}>`;
            }
            else {
                sysparm_query = `GOTO123TEXTQUERY321=${keywords}^sys_created_onBETWEENjavascript:gs.dateGenerate('${startDate}','00:00:00')@javascript:gs.dateGenerate('${endDate}','23:59:59')`;
                case_link = `<a href = https://support.servicenow.com/sn_customerservice_case_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            }
            var xmlhttpReq = sendRequest(table_name, sysparm_fields, sysparm_query);
            $j('#rel_case').append(`<div class="lds-ripple"><div></div><div></div></div>`);
            xmlhttpReq.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    var value = JSON.parse(this.response).result.length;
                    var a = JSON.parse(this.response).result;
                    $j('#rel_case').text(value);
                    //document.getElementById("rel_prb").src = prb_link;
                    $j('#rel_case').wrap(case_link);
                    if(value > 0){
                        $j("#casetable").show();

                    for (var i = 0; i < a.slice(0,10).length; i += 1) {
                        $j("#case_table").append(`<tr><td class="vt"><a href = https://support.servicenow.com/nav_to.do?uri=sn_customerservice_case.do?sys_id=${JSON.parse(this.response).result[i].sys_id} target="_blank">` + JSON.parse(this.response).result[i].number + `</td><td class="vt">`+JSON.parse(this.response).result[i].short_description.substr(0,119)+`<td></tr>`);
                    }
                    }
                }
            }
            xmlhttpReq.send();
        };
        //####################################
        //Get Related Knowledge Articles
        //####################################
        function gerRelatedKnowledge(keywords) {

            var sysparm_query = "";
            var keyArr = keywords.split(',');
            var table_name = "kb_knowledge";
            var sysparm_fields = "number";
            // var startDate = $j('#start').val();
            // var endDate = $j('#end').val();
            var kb_link = "";
            var finalQuery = "";
            var query = `kb_knowledge_base=124c2ca22bb9f1002f42729fe8da152e^workflow_state=published^123TEXTQUERY321=${encodeURIComponent(keywords)}`;
            var query2 = `kb_knowledge_base=124c2ca22bb9f1002f42729fe8da152e^workflow_state=published`
            if(document.getElementById('kb_search').checked){

                for(var i=0; i<=keyArr.length-1; i++){
                    //query1 += "^short_descriptionLIKE"+keyArr[i];
                    // query2 += "^descriptionLIKE"+keyArr[i];
                    query2 += "^short_descriptionLIKE"+encodeURIComponent(keyArr[i]);
                    //query4 += "^u_technical_action_planLIKE"+keyArr[i];
                }
                finalQuery = query2;
            }
            else{
            finalQuery = query;
            }
            sysparm_query = finalQuery;
            kb_link = `<a href = https://support.servicenow.com/kb_knowledge_list.do?sysparm_query=${sysparm_query} target="_blank">`;
            var xmlhttpReq = sendRequest(table_name, sysparm_fields, sysparm_query);
            $j('#rel_kb').append(`<div class="lds-ripple"><div></div><div></div></div>`);
            xmlhttpReq.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    var value = JSON.parse(this.response).result.length;
                    $j('#rel_kb').text(value);
                    //document.getElementById("rel_prb").src = prb_link;
                    $j('#rel_kb').wrap(kb_link);

                }


            }
            xmlhttpReq.send();
        };
    }

})();
