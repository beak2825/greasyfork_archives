// ==UserScript==
// @name         *Iframe Imbed
// @namespace    https://gist.github.com/Kadauchi/
// @version      1.3.5
// @description  Embeds an iframe to make HITs easier.
// @author       Kadauchi
// @include      https://www.mturkcontent.com/dynamic/*
// @include      https://s3.amazonaws.com/mturk_bulk/*
// @include      https://informationevolution2.crowdcomputingsystems.com/*
// @include      *amazon.com*
// @include      *google.com*
// @include      *bing.com*
// @include       https://www.linkedin.com/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/11945/%2AIframe%20Imbed.user.js
// @updateURL https://update.greasyfork.org/scripts/11945/%2AIframe%20Imbed.meta.js
// ==/UserScript==

// Instructions. ==============================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================
// Seems to only work in Chrome. I may or may not fix it. Fuck FireFox.
// Setup Step 1: Download and install this Chrome extension https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe
// Setup Step 2: Add these to your Chrome shortcut. -disable-web-security --allow-running-insecure-content 
// ------------- Example: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -disable-web-security --allow-running-insecure-content
// Setup Step 3: Set "Google Instant Predictions" to "Never Show Instant Results" in Google's search settings or else not all features may work correctly.
// Setup Step 4: You will need to set the iframe source yourself to work with your current HIT. (Defaulted to the Google homepage.)

// Features:
// 1: Click on the black text with yellow background to send it to the first empty text box. (Excludes Amazon Model Numbers)
// 2: Click on the buttons in the HIT window to do stuff. See below for what each button does.
// 3: Keybinds. See below for what each keybind does.
// 4: Toggle variables to customize some parts of the script. Scroll to variables section to see what each one does.

// Keybinds:
// 1 and Alt+1 and Numpad 1 and Alt+Numpad 1 = Sends your highlighted text to the first empty textbox. (Works only from inside the iframe).
// 2 and Alt+2 and Numpad 2 and Alt+Numpad 2 = Sends the current URL to the first empty textbox. (Works only from inside the iframe).
// Shift+End = Submits the HIT. (Works only from inside the iframe).

// Buttons: 
// Show Instructions: Toggle button to show/hide the instructions. 
// Hide: Toggle button to show/hide the created iframe.
// Google: Makes the iframe go to the Google homepage. (Highlight text to search for the selected text, Only works for the HIT page, not the iframe).
// Bing: Makes the iframe go to the Bing homepage. (Highlight text to search for the selected text, Only works for the HIT page, not the iframe).
// Amazon: Makes the iframe go to the Amazon homepage. (Highlight text to search for the selected text, Only works for the HIT page, not the iframe).
// Get URL: Sends the current URL of the iframe to the first empty textbox.
// N/A: Sends N/A to the first empty textbox.

// Requester Rules:
// This is used to check the HIT's requester name and automatically make changes based on the function that you made for that requester.
//
// What are you able to set in the requester rules functions?
// 1: The iframeURL.
// 2: Where the iframe is attached at in the HIT.
// 3: Set radio buttons or checkboxes.
// 4: Hide, move, or modify elements.
// 5: Pretty much anything you can normally do with a script.
//
// How to set up a function for a specific requester?
// Step 1: You will need to create a function in the Requester Rules section of the script.
// Step 2: You will need to add an else if statement to the Requester_Rules function.
// Step 3: Set what you want to be specific to that requester in your newly created function.
// Steo 4: Give me the function and else if statement so I can be add it to my script so they become consolidated and,
// ------- you won't have to add them youself when future updates are released.

// Variables. =================================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================

// Toggle to make links open in the iframe instead of a new tab or window.
var open_all_links_in_iframe = true;

// Toggle to use post message to send answers instead of searching for the elements.
var use_postmessage = true;

// Toggle to automatically detect the Requester Rules.
var Use_Requester_Rules = true; 

// Toggle to only make iframes for Requester Rules HITs.
var Only_Requester_Rules = false; 

// Define what colors you want to use on Google, Bing and Amazon.
var Text_Color = "black";
var Highlight_Color = "yellow";

// DO NOT TOUCH THESE VARIABLES!
var iframeAttach = ".panel.panel-primary";

if (document.location.toString().indexOf('mturk') != -1){
    var Requester_Name = $(window.self.parent.document).find("td.capsule_field_text").eq(0).text().trim(); // Gets the requester's name.
    var HIT_Title = $(window.self.parent.document).find("td.capsulelink_bold").eq(0).text().trim();// Gets the HIT's title.
}

var Iframe_Built = 0;

// Requester Rules. ===========================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================

function Requester_Rules(){
    if (Requester_Name.indexOf("Kadauchi")>=0){ Kadauchi(); }
    else if (Requester_Name.indexOf("Singular")>=0){ Singular(); } 
    else if (Requester_Name.indexOf("Richard L Jenkins")>=0){ Richard_L_Jenkins(); }
    else if (Requester_Name.indexOf("Hugh Hunter")>=0){ Hugh_Hunter(); }
    else if (Requester_Name.indexOf("Martin Dell")>=0){ Martin_Dell(); }
    else if (Requester_Name.indexOf("Josh Bleggi")>=0){ Josh_Bleggi(); }
    else if (Requester_Name.indexOf("Jeff Vogt")>=0){ Jeff_Vogt(); } 
    else if (Requester_Name.indexOf("Johnson Garrett")>=0){ Johnson_Garrett(); }
    else if (Requester_Name.indexOf("Unai Garcia")>=0){ Unai_Garcia(); }
    else if (Requester_Name.indexOf("Tal Brown")>=0){ Tal_Brown(); }
    else if (Requester_Name.indexOf("Jobaline")>=0){ Jobaline(); }
    else if (Requester_Name.indexOf("Andrew")>=0){ Andrew(); }
    else if ((Requester_Name.indexOf("Kevin Dodds")>=0)&&(HIT_Title.indexOf("URL search 2015")>=0)){ Kevin_Dodds_URL_search_2015(); }
    //else if ((Requester_Name.indexOf("Kevin Dodds")>=0)&&(HIT_Title.indexOf("HG China Determine Company Type")>=0)){ Kevin_Dodds_HG_China_Determine_Company_Type(); }
    else if (Requester_Name.indexOf("Johnson Garrett")>=0){ Johnson_Garrett(); }
    else if (Requester_Name.indexOf("Prospect Smarter")>=0){ Prospect_Smarter(); }
    else if (Requester_Name.indexOf("Visual Search Requester")>=0){ Visual_Search_Requester(); }
    else if (Requester_Name.indexOf("Sergey Schmidt")>=0){ Sergey_Schmidt(); }
    else if (Requester_Name.indexOf("Edward Murphy")>=0){ Edward_Murphy(); }
    else if (Requester_Name.indexOf("Crowd Task")>=0){ Crowd_Task(); }
    else if (Requester_Name.indexOf("Dennis Jiang")>=0){ Dennis_Jiang(); }
    else if (Requester_Name.indexOf("Itay")>=0){ Itay(); }
    else if (Requester_Name.indexOf("Sanjay Shah")>=0){ Sanjay_Shah(); }




}

function Default(){ // Default HITs
    iframeAttach = ".panel.panel-primary";
    iframeURL = "https://www.google.com/search?q=";
    builder();
}

function Kadauchi(){ // Testing HIT
    iframeURL = "http://www.bing.com/search?q="+encodeURIComponent($("td").eq(1).text()); // Searches Bing for second <td>.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}

function Singular(){ // Does this product match this Amazon page?
    $("b, strong").eq(5).css({ backgroundColor: Highlight_Color }); // Highlights the model number in HIT.
    $('input[value="Yes"]').click(); // Marks all of the radios Yes.   
    $('input[value="Yes"]').eq(0).focus(); // Focuses the first radio.
    iframeURL = $("a").eq(0).attr("href"); // First hyperlink.
    iframeAttach = "table"; // Element to attach the iframe to.
    Iframe_Sandbox = "allow-scripts";
    iframe_builder(); 
    Iframe_Built = 1;
}

function Richard_L_Jenkins(){ // (Masters) Find the Website Address and Contact Information for Businesses.
    $("input#COUNTRY").val("United States");
    iframeURL = "http://www.google.com/search?q="+encodeURIComponent($("td").eq(1).text()); // Searches Google for second <td>.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}

function Hugh_Hunter(){ // Clean up the Name of Beer / Wine / Spirits Products.
    iframeURL = $("a").eq(0).attr("href"); // First hyperlink.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}

function Jobaline(){ // Classify an audio clip (15 seconds).
    iframeURL = $("a").eq(0).attr("href"); // First hyperlink.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}

function Andrew(){ // Find Amazon.com and Official Business URLs for Companies.
    $("td").eq(1).click(function() {
        iframe.src = "http://www.google.com/search?q=" + $("td").eq(1).text() + " company";
    }); 
    $("div.radio").click(function() {
        iframe.src = "http://www.google.com/search?q=" + $("td").eq(1).text();
    }); 
    $("div.radio").eq(2).click(function() {
        $(".form-control").eq(0).val("Not Found");
    }); 
    iframeURL = "http://www.amazon.com/s/keywords=" +encodeURIComponent($("td").eq(1).text());
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}

function Johnson_Garrett(){ // (Masters) Find and append correct work email addresses.
    $("td").filter(':eq(5), :eq(7), :eq(9), :eq(11)').click(function() {
        iframe.src = "http://www.google.com/search?q="+encodeURIComponent($("td").eq(1).text()+" "+$("td").eq(3).text()+" "+$(this).text());
    }); 
    iframeURL = "http://www.google.com/search?q="+encodeURIComponent($("td").eq(1).text()+" "+$("td").eq(3).text()); // Searches Google for first+last name.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}

function Josh_Bleggi(){ // Find the Website Address and Contact Information for Businesses 
    iframeURL = $("p").eq(2).text().replace("1. Please find the URL for the following Site:", ""); // Second <td>.
    iframeURL = "http://www.google.com/search?q="+iframeURL; // Searches Bing for second <td>.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();

}

function Jeff_Vogt(){ // Find the Website Address and Contact Information for Businesses 
    iframeURL = $("div").eq(4).text().replace("Company Name:", ""); // Second <td>.
    iframeURL = "http://www.google.com/search?q="+iframeURL; // Searches Bing for second <td>.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();

}

function Johnson_Garrett(){ // Find the Website Address and Contact Information for Businesses
    iframeURL = "http://www.google.com/search?q="+encodeURIComponent($("td").eq(1).text()+" "+$("td").eq(3).text()+" "+$("td").eq(7).text()+' email');
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();

}
// Kevin_Dodds_URL_search_2015();
function Kevin_Dodds_URL_search_2015(){ 

    //Hides the feedback section.
    $(".shadow-block:eq(0) > .cc-decorate.top-level:eq(2)").hide();
    $(".shadow-block:eq(1) > .cc-decorate.top-level:eq(2)").hide();

    //Changes dark box.
    $(".place.bg-dark:eq(0)").children("span:eq(1), span:eq(2), span:eq(4), span:eq(5), span:eq(7)").hide();
    $(".place.bg-dark:eq(1)").children("span:eq(1), span:eq(2), span:eq(4), span:eq(5), span:eq(7)").hide();
    $("a:contains('Click to open Google search based on the company name, state, and city.')").text("Name + State + City");
    $("a:contains('Click to open Google search based on the company name and full address to target more specifically, if necessary.')").text("Name + Address");

    // Answer boxes sizing and positioning.
    $("div.box-body").width(470);
    $("div.box-body").height(400);
    $("div.box-body:eq(0)").css({ 'margin-left': '0' });
    $("div.box-body:eq(1)").css({ 'margin-right': '0' });
    $("div.box-body:eq(1)").animate({'marginTop' : "-=422px" },0);

    $('input[value="5"]').click();
    // $(".place.bg-dark:eq(0) > a:eq(0)").attr("href"); 
    iframeURL = $("a").eq(5).attr("href");  
    iframeAttach = ".toggle-box-container"; // Element to attach the iframe.
    iframe_builder(); 
    Iframe_Built = 1;
}

function Martin_Dell(){ // Find the Website Address and Contact Information for Businesses 
    iframeURL = $("td").eq(1).text(); // Second <td>.
    iframeURL = "http://www.google.com/search?q="+iframeURL; // Searches Bing for second <td>.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    // $("input#COUNTRY").val("United States");
    builder();

}


function Unai_Garcia(){ // Find the Website Address and Contact Information for Businesses 
    iframeURL = $("td").eq(1).text(); // Second <td>.
    iframeURL = "http://www.google.com/search?q="+iframeURL; // Searches Bing for second <td>.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    // $("input#COUNTRY").val("United States");
    builder();

}


function Tal_Brown(){ // Find the Website Address and Contact Information for Businesses 
    iframeURL = $("td").eq(3).text(); // Second <td>.
    iframeURL = "http://www.google.com/search?q="+iframeURL; // Searches Bing for second <td>.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    // $("input#COUNTRY").val("United States");
    builder();

}

function Prospect_Smarter(){ // Find the Website Address and Contact Information for Businesses 
    iframeURL = $("td").eq(1).text(); // Second <td>.
    //iframeURL = "http://www.google.com/search?q="+iframeURL; // Searches Bing for second <td>.
    iframeAttach = "b"; // Element to attach the iframe.
    //iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    iframe_builder(); 
    Iframe_Built = 1;

}
// Visual_Search_Requester();
function Visual_Search_Requester(){ // Find the Website Address and Contact Information for Businesses 
    $(".overview-wrapper").hide();
    iframeURL = $("h3").eq(1).text().replace("Product barcode value: ", ""); // Second <td>.
    iframeURL = "http://www.google.com/search?q="+iframeURL; // Searches Bing for second <td>.
    iframeAttach = ".overview-wrapper"; // Element to attach the iframe.
    // $("input#COUNTRY").val("United States");
    iframe_builder(); 
    Iframe_Built = 1;

}

function Sergey_Schmidt(){ // Find the Website Address and Contact Information for Businesses 
    iframeURL = $("a:contains('follow the link')")[0];
    $("h3").hide();
    $("p:contains('You are asked')").hide();
    $("p:contains('In this task')").hide();
    $("p:contains('For each topic')").hide();
    $("p:contains('Important Notes')").hide();
    $("p:contains('Examples of correct')").hide();
    $("ol").hide();
    $("ul").hide();
    $(".centralityRatingExamples").hide();
    $(".input").show();
    iframeAttach = "h3"; // Element to attach the iframe.
    // $("input#COUNTRY").val("United States");
    iframe_builder(); 
    Iframe_Built = 1;
    document.addEventListener( "keydown", kas, false);
    function kas(i) {

        // Central
        if (i.keyCode == 97) { //Numpad 1
            $('input[value="CENTRAL"]').eq(0).click();
            $('input[type="submit"]').click();
        }

        // Relevant
        if (i.keyCode == 98) { //Numpad 2
            $('input[value="RELEVANT"]').eq(0).click();
            $('input[type="submit"]').click();
        }

        // Off Topic
        if (i.keyCode == 99) { //Numpad 3
            $('input[value="OFF_TOPIC"]').eq(0).click();
            $('input[type="submit"]').click();
        }  

        // Don't Know
        if (i.keyCode == 96) { //Numpad 0
            $('input[value="DONT_KNOW"]').eq(0).click();
            $('input[type="submit"]').click();
        }    
    }

}

function Edward_Murphy(){ 
    iframeURL = "http://www.cookcountyboardofreview.com/html/decision.php"
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();

}

function Crowd_Task(){ // Find the Website Address and Contact Information for Businesses 
    iframeURL = $("li").eq(4).text().replace("State:","");
    iframeURL = $("li").eq(3).text().replace("Company Name:","")+iframeURL; // Second <td>.                                            
    iframeURL = "http://www.google.com/search?q="+iframeURL; // Searches Bing for second <td>.
    iframeAttach = ".overview-wrapper"; // Element to attach the iframe.
    $(document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val("NA");
    $(document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val("NA");
    // $("input#COUNTRY").val("United States");
    iframe_builder(); 
    Iframe_Built = 1;
    button_builder();
    window.onkeydown = function(e) {
        // Sends the current URL of the iframe to the first empty textbox.
        if ((e.keyCode == 51) || (e.altKey && e.keyCode === 51) || (e.keyCode == 99) || (e.altKey && e.keyCode === 98)) { // 3 and Alt+3 and Numpad 2 and Alt+Numpad 2
            answ = $(location).attr('href'); 
            $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val("NA");
            window.self.parent.focus();


        }
    };

}

function Dennis_Jiang(){ // (Masters)  Find contact information for political clubs at US universities 
    iframeURL = "http://www.google.com/search?q="+encodeURIComponent($("td").eq(1).text()); // Searches Google for second <td>.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}

function Itay(){ // (Masters) Find the Website Address and Contact Information for Businesses.   
    var linkedIN = $("p").eq(2).text().replace("The Company Name is: ","");
    var linkedIN = linkedIN.replace(":","");
    iframeURL = "https://www.linkedin.com/vsearch/c?type=companies&keywords="+linkedIN; // Searches LinkedIN.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}

function Sanjay_Shah(){ // Classify an audio clip (15 seconds).
    iframeURL = $("a").eq(0).attr("href"); // First hyperlink.
    iframeAttach = ".panel.panel-primary"; // Element to attach the iframe.
    builder();
}


// Functions. =================================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================

// jQuery Plugin: http://docs.jquery.com/Plugins/Validation/blank
(function($) {
    $.extend($.expr[":"], {
        blank: function(a) {
            return !$.trim(a.value);
        },
    });
})(jQuery);


// Function for making the links open in the iframe.
function iframeLinks() {
    if (open_all_links_in_iframe) {
        $("a[href^='http']").attr('target','MyIframe');
    }
}

function builder() {
    if (Iframe_Built === 0) {
        iframeLinks();
        instructions_builder();  
        iframe_builder(); 
        button_builder();
        Iframe_Built = 1;
    }
}

function iframe_builder() {

    // Makes container for the iframe.
    var MyIframeContainer = document.createElement('div');
    MyIframeContainer.id = "MyIframeContainer";
    $(iframeAttach).after(MyIframeContainer);

    // Creates the iframe.
    var MyIframe = document.createElement('iframe');
    MyIframe.id = "MyIframe";
    MyIframe.src = iframeURL;
    MyIframe.sandbox = "allow-forms allow-scripts allow-same-origin";
    MyIframe.width= "100%";
    MyIframe.height= screen.availHeight/1.75;
    document.getElementById('MyIframeContainer').appendChild(MyIframe);
}

function button_builder(){

    // Amazon Button.
    var AmazonButton = document.createElement('button');
    AmazonButton.id = "AmazonButton";
    AmazonButton.type = "button";
    AmazonButton.innerHTML = "Amazon";
    document.getElementById('MyIframeContainer').insertBefore(AmazonButton, document.getElementById('MyIframeContainer').firstChild);

    document.getElementById('AmazonButton').addEventListener('click',function () {
        selection = window.getSelection().toString();
        document.getElementById('MyIframe').src = "http://www.amazon.com/s/keywords="+selection;
    });

    // Bing Button.
    var BingButton = document.createElement('button');
    BingButton.id = "BingButton";
    BingButton.type = "button";
    BingButton.innerHTML = "Bing";
    document.getElementById('MyIframeContainer').insertBefore(BingButton, document.getElementById('MyIframeContainer').firstChild);

    document.getElementById('BingButton').addEventListener('click',function () {
        selection = window.getSelection().toString();
        document.getElementById('MyIframe').src = "https://www.Bing.com/search?q="+selection;
    });

    // Google Button.
    var GoogleButton = document.createElement('button');
    GoogleButton.id = "GoogleButton";
    GoogleButton.type = "button";
    GoogleButton.innerHTML = "Google";
    document.getElementById('MyIframeContainer').insertBefore(GoogleButton, document.getElementById('MyIframeContainer').firstChild);

    document.getElementById('GoogleButton').addEventListener('click',function () {
        selection = window.getSelection().toString();
        document.getElementById('MyIframe').src = "https://www.google.com/search?q="+selection;
    });

    // Hide Button.
    var HideButton = document.createElement('button');
    HideButton.id = "HideButton";
    HideButton.type = "button";
    HideButton.innerHTML = "Hide";
    document.getElementById('MyIframeContainer').insertBefore(HideButton, document.getElementById('MyIframeContainer').firstChild);

    document.getElementById('HideButton').addEventListener('click',function () {
        document.getElementById("MyIframeContainer").style.display = (document.getElementById("MyIframeContainer").style.display === '' ? 'none' : '' );
        document.getElementById("HideButton").innerHTML = (document.getElementById("HideButton").innerHTML == 'Hide' ? 'Show' : 'Hide' );
    });

    // Get URL Button.
    var GetURLButton = document.createElement('button');
    GetURLButton.id = "GetURLButton";
    GetURLButton.type = "button";
    GetURLButton.innerHTML = "Get URL";
    document.getElementById('MyIframeContainer').appendChild(GetURLButton);

    document.getElementById('GetURLButton').addEventListener('click',function () {
        var answ = document.getElementById('MyIframe').contentWindow.location.href;
        $(document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(answ);
    });

    // N/A Button.
    var NAButton = document.createElement('button');
    NAButton.id = "NAButton";
    NAButton.type = "button";
    NAButton.innerHTML = "N/A";
    document.getElementById('MyIframeContainer').appendChild(NAButton);

    document.getElementById('NAButton').addEventListener('click',function () {
        $(document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val("N/A");
        window.self.parent.focus();

    });
}

function instructions_builder(){

    // Instructions Button.
    var InstructionsButton = document.createElement('button');
    InstructionsButton.id = "InstructionsButton";
    InstructionsButton.type = "button";
    InstructionsButton.innerHTML = "Show Instructions";
    document.getElementsByClassName('panel-primary')[0].parentNode.insertBefore(InstructionsButton, document.getElementsByClassName('panel-primary')[0]);

    document.getElementById('InstructionsButton').addEventListener('click',function () {
        document.getElementsByClassName("panel-primary")[0].style.display = (document.getElementsByClassName("panel-primary")[0].style.display == 'none' ? '' : 'none' );
        document.getElementById("InstructionsButton").innerHTML = (document.getElementById("InstructionsButton").innerHTML == 'Show Instructions' ? 'Hide Instructions' : 'Show Instructions' );
    });

    document.getElementsByClassName("panel-primary")[0].style.display = 'none';
}
// Keybinds. ==================================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================

window.onkeydown = function(e) {

    // Sends the current highlighted text to the first empty text box.
    if ((e.keyCode == 49) || (e.altKey && e.keyCode === 49) || (e.keyCode == 97) || (e.altKey && e.keyCode === 97)) { // 1 and Alt+1 and Numpad 1 and Alt+Numpad 1
        answ = window.getSelection().toString();
        if (use_postmessage) {
            parent.postMessage({A: answ},'*');
        } else {
            $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(answ);
        }    
    }

    // Sends the current URL of the iframe to the first empty textbox.
    if ((e.keyCode == 50) || (e.altKey && e.keyCode === 50) || (e.keyCode == 98) || (e.altKey && e.keyCode === 98)) { // 2 and Alt+2 and Numpad 2 and Alt+Numpad 2
        answ = $(location).attr('href');
        if (use_postmessage) {
            parent.postMessage({A: answ},'*');
        } else {
            $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(answ);
        }    
    }

    // Submit
    if (e.shiftKey && e.keyCode === 35) { // Shift+End
        //window.self.parent.focus();    
        $(window.self.parent.document).find("#submitButton").click();
        //$('input[name="/submit"]').eq(0).click(); 
        //  $(window.self.parent.document).find("/media/submit_hit.gif").click();

    }
};

// Handles HIT Page. ==========================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================

if (document.location.toString().indexOf('mturk') != -1){

    iframeLinks();

    if ((Use_Requester_Rules) || (Only_Requester_Rules)){
        Requester_Rules();
    }

    if (!Only_Requester_Rules) {
        Default();
    }

    // Listener.
    window.addEventListener("message", listener, false);

    // Listener actions.
    function listener(l){
        var info = l.data;
        $(document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(info.A);
    }


}

// Handles ASIN. ==============================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================

if (document.location.toString().indexOf('amazon') != -1){

    var Model_Number_Get1 = $("li:contains('Item model number:')").text().replace('Item model number:','');
    var Model_Number_Get2 = $("tr.item-model-number td.value").text();
    var Part_Number_Get1 = $("tr:contains('Part Number')").find('td').eq(1).text();

    if (Model_Number_Get1.length){
        Model_Number = Model_Number_Get1;
    } else if (Model_Number_Get2.length){
        Model_Number = Model_Number_Get2;
    } else if (Part_Number_Get1.length){
        Model_Number = Part_Number_Get1;
    } else {
        Model_Number = "NULL";
    }


    $.expr[':'].childof = function(obj, index, meta, stack){
        return $(obj).parent().is(meta[3]);
    };

    function getASIN(href) {
        var asinMatch;
        asinMatch = href.match(/\/exec\/obidos\/ASIN\/(\w{10})/i);
        if (!asinMatch) { asinMatch = href.match(/\/gp\/product\/(\w{10})/i); }
        if (!asinMatch) { asinMatch = href.match(/\/exec\/obidos\/tg\/detail\/\-\/(\w{10})/i); }
        if (!asinMatch) { asinMatch = href.match(/\/dp\/(\w{10})/i); }
        if (!asinMatch) { return null; }
        return asinMatch[1];
    }

    // add ASIN after most absolute product links that aren't an image, price, or Other Colors link WORKING
    $('a[href*="www.amazon.com/"]').not(':has(img)').not(':has(span.a-color-secondary)').not(':has(span.s-price)').not(':childof(td.toeOurPrice)').each(function(){
        var asin = getASIN( $(this).attr('href') );
        if (asin !== null) {
            var ASIN1 = document.createElement("strong");
            ASIN1.setAttribute("id","ASIN1");
            ASIN1.innerHTML = asin;
            ASIN1.style.color = Text_Color;
            ASIN1.style.background = Highlight_Color;
            $(this).parent().before(ASIN1);        
        }
    });

    // add ASIN after most relative product links that aren't an image, price, Other Colors, Try Prime, or Buy Kindle link
    $('a[href^="/gp/product/"]').not(':has(img)').not(':has(span.a-color-secondary)').not(':has(span.s-price)').not(':childof(td.toeOurPrice)').not('a.nav-prime-try').not('a.nav-link-prime').not(':contains("Buy a Kindle")').not(':has(span.nav-a-content)').each(function(){
        var asin = getASIN( $(this).attr('href') );
        if ( (asin !== null) && (asin != 'B00DBYBNEE') )  {
            var ASIN2 = document.createElement("strong");
            ASIN2.setAttribute("id","ASIN2");
            ASIN2.innerHTML = asin;
            ASIN2.style.color = Text_Color;
            ASIN2.style.background = Highlight_Color;
            $(this).parent().before(ASIN2);        
        }
    });

    // add ASIN after top-of-page product title on individual product pages
    $('span#productTitle').each(function(){
        var asin = getASIN( document.location.href );
        if (asin !== null) {
            var ASIN3 = document.createElement("strong");
            ASIN3.setAttribute("id","ASIN3");
            ASIN3.innerHTML = asin;
            ASIN3.style.color = Text_Color;
            ASIN3.style.fontSize = '130%';
            ASIN3.style.background = Highlight_Color;
            $(this).parent().before(ASIN3);
            var ModelNum = document.createElement("strong");
            ModelNum.setAttribute("id","ModelNum");
            ModelNum.innerHTML = Model_Number;
            ModelNum.style.color = Text_Color;
            ModelNum.style.fontSize = '130%';
            ModelNum.style.background = Highlight_Color;
            $(this).parent().before('<strong>&nbsp;|&nbsp;</strong>');
            $(this).parent().before(ModelNum);
        }
    });
    $('span#btAsinTitle').each(function(){
        var asin = getASIN( document.location.href );
        if (asin !== null) {
            var ASIN4 = document.createElement("strong");
            ASIN4.setAttribute("id","ASIN4");
            ASIN4.innerHTML = asin;
            ASIN4.style.color = Text_Color;
            ASIN4.style.background = Highlight_Color;
            $(this).parent().before(ASIN4);        
        }
    });

    // add ASIN after relative product links in carousels (first page only) on individual product pages
    $('li.a-carousel-card > div.a-section > a.a-link-normal').each(function(){
        var asin = getASIN( $(this).attr('href') );
        if (asin !== null) {
            var ASIN5 = document.createElement("strong");
            ASIN5.setAttribute("id","ASIN5");
            ASIN5.innerHTML = asin;
            ASIN5.style.color = Text_Color;
            ASIN5.style.background = Highlight_Color;
            $(this).parent().before(ASIN5);        
        }
    });

    // add ASIN after relative product links in 'after viewing this item' at bottom of individual product pages
    $('div.asinDetails > a').each(function(){
        var asin = getASIN( $(this).attr('href') );
        if (asin !== null) {
            var ASIN6 = document.createElement("strong");
            ASIN6.setAttribute("id","ASIN6");
            ASIN6.innerHTML = asin;
            ASIN6.style.color = Text_Color;
            ASIN6.style.background = Highlight_Color;
            $(this).parent().before(ASIN6);        
        }
    });

    // add ASIN after relative product links in 'more to explore' on bestsellers pages
    $('div.zg_more_item > a').each(function(){
        var asin = getASIN( $(this).attr('href') );
        if (asin !== null) {
            var ASIN7 = document.createElement("strong");
            ASIN7.setAttribute("id","ASIN7");
            ASIN7.innerHTML = asin;
            ASIN7.style.color = Text_Color;
            ASIN7.style.background = Highlight_Color;
            $(this).parent().before(ASIN7);        
        }
    });

    //Click functions.
    $("#ASIN1, #ASIN2, #ASIN3, #ASIN4, #ASIN5, #ASIN6, #ASIN7").click(function(){
        var answ = $(this).text();
        if (use_postmessage) {
            parent.postMessage({A: answ},'*');
        } else {
            $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(answ);
        }
    });
}

// Handles Google. ============================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================

if ((document.location.toString().indexOf('google') != -1) && (document.getElementById('hdtbSum'))) {

    var page = document.getElementById("ires");
    var linkPac = page.getElementsByClassName("rc");
    for (var g = 0; g < linkPac.length; g++){
        var aTag = linkPac[g].getElementsByClassName("r")[0].firstChild;
        var G_URL = document.createElement("strong");
        G_URL.setAttribute("id","G_URL");
        G_URL.innerHTML = aTag.href;
        G_URL.style.color = Text_Color;
        G_URL.style.background = Highlight_Color;
        linkPac[g].parentNode.insertBefore(G_URL, linkPac[g].nextSibling);
    }

    //Click function.
    $("strong#G_URL").click(function(){
        var answ = $(this).text();
        if (use_postmessage) {
            parent.postMessage({A: answ},'*');
        } else {
            $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(answ);
        }
        window.self.parent.focus();
    });



}

// Handles Bing. ============================================================================================================================================================================================================================================
// ============================================================================================================================================================================================================================================================

if ((document.location.toString().indexOf('bing') != -1) && (document.getElementById('b_header'))) {

    var page = document.getElementById("b_results");
    var linkPac = page.getElementsByClassName("b_algo");
    for (var g = 0; g < linkPac.length; g++){
        var aTag = linkPac[g].getElementsByTagName("h2")[0].firstChild;
        var B_URL = document.createElement("strong");
        B_URL.setAttribute("id","B_URL");
        B_URL.innerHTML = aTag.href;
        B_URL.style.color = Text_Color;
        B_URL.style.background = Highlight_Color;      
        linkPac[g].parentNode.insertBefore(B_URL, linkPac[g].nextSibling);
    }

    //Click function.
    $("strong#B_URL").click(function(){
        var answ = $(this).text();
        if (use_postmessage) {
            parent.postMessage({A: answ},'*');
        } else {
            $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(answ);
        }
    });
}
//  Handles Edward Murphy Hits
if (document.location.toString().indexOf('cookcountyboardofreview.com') != -1){ //$("td").eq(1).text()
    box1 = $(window.self.parent.document).find("td:eq(1)").text(); 
    box2 = $(window.self.parent.document).find("td:eq(3)").text(); 
    $("input[name=Complaint]").val(box1);
    $("input[name=ComplaintExt]").val(box2);
    $("input[name=complaint_search]").click();
    Appellant_Name = $("td.ReasonsHead").eq(4).text();
    Attorney_Name = $("td.ReasonsHead").eq(6).text();
    $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(Appellant_Name);
    $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(Attorney_Name);
}

if (document.location.toString().indexOf('linkedin.com') != -1){ //$("td").eq(1).text()
    box1 = $("a.density").text();
    box2 = $("p.company-size").text().replace("employees","");
    $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(box1);
    $(window.self.parent.document).find("input:blank:not(:checkbox,:button,:radio,:submit)").filter(":visible:enabled").first().val(box2);
    window.self.parent.focus();


}


