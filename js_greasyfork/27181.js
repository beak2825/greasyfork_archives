// ==UserScript==
// @name        Get_Topology
// @namespace   
// @description csone topology automator
// @version     0.15
// @description  [10-11] WARNING : Always make sure your browser allows unsafe content!
// @include      https://*/*xmainpane*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant        all


// @downloadURL https://update.greasyfork.org/scripts/27181/Get_Topology.user.js
// @updateURL https://update.greasyfork.org/scripts/27181/Get_Topology.meta.js
// ==/UserScript==

var cc = [];
var c3 = "";
var res = "";
var body ="";
var contract = "";
var re =/(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
var names = [];
var lastext ="";


$(window).load(function(){

    isPageLoaded();

    $("#caseHeader").append("<span class='topology' style='float:right;cursor:pointer;margin-right:5px;background-color:lime'>Get Topology</span>");

    $(".topology" ).on('click', function() {

        window.open("https://scripts.cisco.com/ui/use/CDP_to_Archer_topology?sr_number="+c3+"&autorun=true");

    })

})





function isPageLoaded(){

    if($("#casehistory").html().length<3000){

        console.log("ccs : Page is not loaded yet" + $("#casehistory").html().length);
        setTimeout(function(){isPageLoaded()},500);

    }

    else{

        getC3number();
        getcaseowner();

    }

}





function getC3number(){

    c3 = $(".dynamic-caseNumberHeader").text().trim();
    console.log("TOPOLOGY : SR number = "+c3);
}



function getcaseowner(){

    owner = $(".caseinfo-status-owner.con-LAlign:eq(1)").text().trim().substring(0,8);
    owner = owner+"@cisco.com";
    console.log ("TOPOLOGY : owner = "+owner);
}

