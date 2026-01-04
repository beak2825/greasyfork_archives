// ==UserScript==
// @name         Agfa Service-Now Overlay
// @namespace    https://greasyfork.org/scripts/40396-agfa-service-now-overlay/code/Agfa%20Service-Now%20Overlay.user.js
// @version      4.3.1
// @description  agfa service-now overlay script
// @author       Quinten Van den Berghe
// @match        https://agfa.service-now.com/*
// @match        https://*.service-now.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/40396/Agfa%20Service-Now%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/40396/Agfa%20Service-Now%20Overlay.meta.js
// ==/UserScript==


    var controls = `

 <div class="btn-group" style="position:fixed; bottom: 20px; right: 40px; max-width:500px; height:40px;">
  <select class="btn btn-default" id="selectedEnv" style="background-color: white;">
    <option value="">IT</option>
    <option value="medimg">Imaging</option>
  </select>
            <button type="button" class="btn btn-default" id="btn-sb" style="background-color: white; color:black; border-width: 1px;">SB</button>
            <button type="button" class="btn btn-default" id="btn-test" style="background-color: white; color:black; border-width: 1px;">TEST</button>
            <button type="button" class="btn btn-default" id="btn-dev" style="background-color: white; color:black; border-width: 1px;">DEV</button>
            <button type="button" class="btn btn-default" id="btn-uat" style="background-color: white; color:black; border-width: 1px;">UAT</button>
            <button type="button" class="btn btn-default" id="btn-prod" style="background-color: white; color:black; border-width: 1px;">PROD</button>
            <button type="button" class="btn btn-default" id="btn-switch-settings" style="background-color: white; color:black; border-width: 1px;" data-toggle="modal" data-target="#myModal">
            <span class="input-group-addon-transparent icon-cog sysparm-search-icon"></span>
            </button>
  </div>
  `;

    var settingsPage = `
<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Settings</h4>
      </div>
      <div class="modal-body" id="snow-switch-checkboxes">
      	<p>

			<label class="container">Open in new tab
  			<input type="checkbox" id="snowswitch-newtab"/>
  			<span class="checkmark"></span>
			</label>
		</p>
        </br></br>
        <p>

         <p><button type="button" class="btn btn-primary" id="opt-searchtool-rrfind">RRfind (Made by Raf Roothooft)</button></p>
         <p><button type="button" class="btn btn-primary" id="opt-searchtool-button">Open script search</button></p>
         <b/><b/><b/>
         <p>Button background color <input type="color" id="opt-button-color" name="color" value="red"/></p>
      </div>
      <div class="modal-footer">
        <span style="float:left">version 4.3.1</span>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>`;


(function() {

    'use strict';


    if(!(GM_getValue("opt-button-color"))){
        GM_setValue('opt-button-color', 'red');
        // if no color set, set to red By default
    }

    if(!(window.location.host.includes("agfa"))){
           return;
        // prevent running on non-agfa environments
       }

    if(window.top != window.self){
            return;
        //-- Don't run on frames or iframes
    }


    $("body").append(controls);
    $("body").append(settingsPage);


    // set checked
    if(GM_getValue("opt-new-tab") == true){
      $("#snowswitch-newtab").prop('checked', true);
    }

      $("#opt-button-color").prop('value', GM_getValue('opt-button-color'));


    var url = window.location.href;
    if(url.includes("agfamed")){

        $("#selectedEnv").val("medimg");
    }else{
     $("#selectedEnv").val("");
    }
})();

    $(".btn-group > button.btn").click(function(event){

        if(this.id == 'btn-switch-settings')
          return;

        if(GM_getValue("opt-new-tab") == true)
            return;

    $(this).css("color","white");
    $(this).css("background-color",GM_getValue('opt-button-color'));
    $(this).addClass('active');

});

$( "#btn-sb" ).click(function() {
    var sel = $("#selectedEnv").val();
    navigateToPage("sb",sel);

    if(GM_getValue("opt-new-tab") != true)
    restoreButtons("#btn-sb");
});

$( "#btn-test" ).click(function() {
    var sel = $("#selectedEnv").val();
    navigateToPage("test",sel);

    if(GM_getValue("opt-new-tab") != true)
    restoreButtons("#btn-dev");
});

$( "#btn-dev" ).click(function() {
    var sel = $("#selectedEnv").val();
    navigateToPage("dev",sel);

    if(GM_getValue("opt-new-tab") != true)
    restoreButtons("#btn-dev");
});

$( "#btn-uat" ).click(function() {
    var sel = $("#selectedEnv").val();
    navigateToPage("uat",sel);

    if(GM_getValue("opt-new-tab") != true)
    restoreButtons("#btn-uat");

});

$( "#btn-prod" ).click(function() {
    var sel = $("#selectedEnv").val();
    navigateToPage("",sel);

    if(GM_getValue("opt-new-tab") != true)
    restoreButtons("#btn-prod");
});


$("#snowswitch-newtab").click(function() {

    if ($(this).is(':checked')) {
        GM_setValue("opt-new-tab",true);
    }else{
        GM_setValue("opt-new-tab",false);
    }


});

var lastSel = $("#selectedEnv option:selected");

$("#selectedEnv").change(function() {

    var type = "";
    if(window.location.host.includes("dev")){
        type = "dev";
    }else if(window.location.host.includes("uat")){
        type = "uat";
    }else if(window.location.host.includes("test")){
        type = "test";
    }else if(window.location.host.includes("sb")){
        type = "sb";
    }else{
        type = "";
    }
    navigateToPage(type,$(this).val());

    // check if new tab is checked
    if(GM_getValue('opt-new-tab'))
    lastSel.attr("selected", true);

});


    $("#selectedEnv").click(function(){
    lastSel = $("#selectedEnv option:selected");
});

    if(window.location.host.includes("dev")){
        $("#btn-dev").css("background-color",GM_getValue('opt-button-color'));
        $("#btn-dev").css("color","white");
        $("#btn-dev").addClass('active');
        restoreButtons("#btn-dev");

    }else if(window.location.host.includes("uat")){
        $("#btn-uat").css("background-color",GM_getValue('opt-button-color'));
        $("#btn-uat").css("color","white");
        $("#btn-uat").addClass('active');
        restoreButtons("#btn-uat");

    }else if(window.location.host.includes("test")){
        $("#btn-test").css("background-color",GM_getValue('opt-button-color'));
        $("#btn-test").css("color","white");
        $("#btn-test").addClass('active');
        restoreButtons("#btn-test");

    }else if(window.location.host.includes("sb")){
        $("#btn-sb").css("background-color",GM_getValue('opt-button-color'));
        $("#btn-sb").css("color","white");
        $("#btn-sb").addClass('active');
        restoreButtons("#btn-sb");

    }else{
        $("#btn-prod").css("background-color",GM_getValue('opt-button-color'));
        $("#btn-prod").css("color","white");
        $("#btn-prod").addClass('active');
        restoreButtons("#btn-prod");
    }


function navigateToPage(type, env, customParameters){

        var parameters = (location.pathname+location.search).substr(1);
        var beginUrl = window.location.protocol + "//";

    if(customParameters)
        parameters = customParameters;

    var navUrl = beginUrl + "agfa" + env + type +".service-now.com/" + parameters;





    if(GM_getValue("opt-new-tab") == true){

    var win = window.open(navUrl, '_blank');
    win.focus();
    if (win) {

    } else {
    alert("pop up was blocked! Please allow popups!");
    }

    }else{
       window.location.href = navUrl;
    }
}


    $("#opt-searchtool-button").click(function(event){

        alert('this is broken in kingston+ ! If you are in Kingston or higher, use RRfind (Raf Roothooft) instead');
       var param = 'sn_codesearch_CodeSearchExampleUse.do';


        var agfaEnv = getEnvironment();

        var instance = agfaEnv.instance;
        if(instance == "it")
            instance = "";

        var type = agfaEnv.type;

        if(type == "prod")
            type = "";

       navigateToPage(type,instance,param);

    });


    $("#opt-button-color").change(function(event){
        GM_setValue('opt-button-color', event.target.value);
        alert('Color has been changed! Please refresh the page.');
    });


   $("#opt-searchtool-rrfind").click(function(event){

       var param = 'RRfind.do';


        var agfaEnv = getEnvironment();

        var instance = agfaEnv.instance;
        if(instance == "it")
            instance = "";

        var type = agfaEnv.type;

        if(type == "prod")
            type = "";

       navigateToPage(type,instance,param);

    });

function restoreButtons(button){

    var itemsArray = ["#btn-dev","#btn-uat","#btn-prod","#btn-test", "#btn-sb"];
    for(var i = 0; i < itemsArray.length; i++){
        if(itemsArray[i] == button)
            continue;

        $(itemsArray[i]).css("background-color","white");
        $(itemsArray[i]).css("color","black");
        $(this).removeClass('active');

    }
}


// style injector
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


function getEnvironment(){

    var obj = {};


     var url = window.location.href;
    if(url.includes("agfamed")){
        obj.instance = "medimg";
    }else{
        obj.instance = "it";
    }


    if(url.includes("dev"))
       obj.type = "dev";
    else if(url.includes("uat"))
        obj.type = "uat"
    else if(url.includes("test"))
        obj.type = "test";
    else if(url.includes("sb"))
        obj.type = "sb";
    else
        obj.type = "prod";

    return obj;
}


// constant CSS

const checkboxStyle = `#snow-switch-checkboxes .container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Hide the browser's default checkbox */
#snow-switch-checkboxes .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

/* Create a custom checkbox */
#snow-switch-checkboxes .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
}

/* On mouse-over, add a grey background color */
#snow-switch-checkboxes .container:hover input ~ .checkmark {
    background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
#snow-switch-checkboxes .container input:checked ~ .checkmark {
    background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
#snow-switch-checkboxes .checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

/* Show the checkmark when checked */
#snow-switch-checkboxes .container input:checked ~ .checkmark:after {
    display: block;
}

/* Style the checkmark/indicator */
#snow-switch-checkboxes .container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}`;


// Inject CSS
addGlobalStyle(checkboxStyle);

const holder1 = ``;
const holder2 = ``;
const holder3 = ``;

