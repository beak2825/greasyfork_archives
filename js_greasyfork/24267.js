// ==UserScript==
// @name Primewire Host BOX
// @namespace AWM
// @description Creates a hovering Box which includes the providers or hosts of your choice wherever they appear on a page listing, allowing you to quickly locate and click your favorite host to start watching.
// @version 2.5
// @run-at  document-ready
// @include https://www.primewire.ag/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author A.W.M, drhouse
// @icon https://www.primewire.ag/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/24267/Primewire%20Host%20BOX.user.js
// @updateURL https://update.greasyfork.org/scripts/24267/Primewire%20Host%20BOX.meta.js
// ==/UserScript==

var rightDivLeft = 0;
var rightDivLeftHide = 0;
var showoptions = false;
var bigDelay = 1500;
var smallDelay = 400;
var autoOpen = false;
var autoOpenString = "AutoOpen PrimeHost";
var tempLeft = false;

$(document).ready(function () {

    function addProviders(){
        var host = GM_getValue("hostsList");
        if (!host){
            host = "[vodlocker.com][thevideo.me][promptfile.com][filenuke.com]";
        }
        host = prompt ('Enter hostname (case insensitive), you can add each domain between []\neg. [vodlocker.com][thevideo.me]:', host);
        GM_setValue ("hostsList", host);
        location.reload();
    }

    GM_registerMenuCommand("Primewire Host Highlighter: Change Hosts", addProviders);

    $.expr[":"].icontains = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    // *************** Prepare variables *******************
    var host = GM_getValue("hostsList");
    if (!host){
        host = "[vodlocker.com][thevideo.me][promptfile.com][filenuke.com]";
    }

    var primeHost = GM_getValue("primeHost");
    if (!primeHost){
        primeHost = 0;
    }

    var hosts = host.match(/\[[^\]]+\]/g);
    var colors = ["#00b2ff","#009921", "#aaaa00", "#ff7b00", "#e100ff", "#ff0072"]; // Default Colors
    var colorsRGB = ["0,178,255","0, 153, 33", "170, 170, 0", "255,123,0", "225,0,255", "255,0,114"]; // Default colors in RGB
    var colorslength = colors.length;
    var hostsArrLength = hosts.length;
    var linksAvailable = false;

    var primeLinksArr = [];
    var primelink = "";
    if(primeHost >= hostsArrLength){
        primeHost = 0;
    }

    // ****************** Prepare DIVs ******************
    var menuDiv = document.createElement("div"); //Create left div
    menuDiv.id = "menuDiv"; //Assign div id
    menuDiv.setAttribute("style", " position: fixed; float: left; z-index: 153; width: 0px; height: 0px; "); //Set div attributes
    document.body.appendChild(menuDiv); // And append the div to the document body
    $('#menuDiv').show(); // Start hidden

    var leftDiv = document.createElement("div"); //Create left div
    leftDiv.id = "leftDiv"; //Assign div id
    leftDiv.setAttribute("style", " position: fixed; float: left; z-index: 151; background-color: rgba(242, 242, 242,1); text-align: center; font-size: 16px; padding: 10px; display: inline-block; border: 1px solid #666666; border-radius: 4px; "); //Set div attributes
    document.body.appendChild(leftDiv); // And append the div to the document body

    var centerDiv = document.createElement("div"); //Create center div
    centerDiv.id = "centerDiv"; //Assign div id
    centerDiv.setAttribute("style", " position: fixed; top: 0px; left: 0px; background-color: rgba(0,0,0,.8); width: 100%; height: 100%; z-index: 150; "); //Set div attributes
    document.body.appendChild(centerDiv);
    $('#centerDiv').hide(); // Start hidden

    var optionsclass = "optionsMenu";
    var rightDiv = document.createElement("div"); //Create right div
    rightDiv.id = "rightDiv"; //Assign div id
    rightDiv.className = optionsclass;
    rightDiv.setAttribute("style", " min-width:170px; position: fixed; float: left; z-index: 152; background-color: rgba(242, 242, 242,1); text-align: center; font-size: 16px; padding: 5px; display: inline-block; border-top: 1px solid #f2f2f2; border-right: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2; border-radius: 4px; "); //Set div attributes
    document.body.appendChild(rightDiv); // And append the div to the document body
    $("#rightDiv").hide(); // Start hidden

    var minDivWidth = 170; // Max Left Div Width

    // Show/Movie Title
    var titlesDiv = document.createElement("div"); //Create right div
    titlesDiv.id = "titlesDiv"; //Assign div id
    titlesDiv.setAttribute("style", " display:block; text-align: center; background-color: rgba(124, 174, 255,.5); padding: 5px; border: 1px solid  #000000; border-radius: 8px; "); //Set div attributes
    leftDiv.appendChild(titlesDiv);

    var titleclass = document.getElementsByTagName("h1");
    var titlesSpan = titleclass[1].childNodes;
    var titles = titlesSpan[0].childNodes;
    var title1 = document.createElement('h5');
    title1.id = "title1";
    title1.innerHTML = titles[1].innerText;
    var title1_styling = "<style> #title1{ color: black; overflow: hidden; white-space: nowrap; font-size: 12px; font-weight: bold; text-align: center; display: inline-block; } </style>";
    $('head').append( title1_styling );
    titlesDiv.appendChild(title1);


    // *********** Season, Ep titles || Next, Previous Buttons || Autostart CheckBox ******************
    var prev_next_show = false;
    var prev_next_elem = $("div.episode_prev_next").children();
    if(prev_next_elem.length > 0){
        prev_next_show = true;
        var previous = 'https://www.primewire.ag' + $(prev_next_elem[0]).attr('href');
        var next = 'https://www.primewire.ag' + $(prev_next_elem[1]).attr('href');

        // **** Season Title *****
        var title2 = document.createElement('h5');
        title2.id = "title2";
        title2.innerHTML = titles[3].childNodes[1].innerText; // <a>INNER_TEXT</a>
        var title2_styling = "<style> #title2{ color: black; overflow: hidden; white-space: nowrap; font-size: 10px; text-align: center; display: inline-block; } </style>";
        $('head').append( title2_styling );
        titlesDiv.appendChild(document.createElement("br"));
        titlesDiv.appendChild(title2); // Append the link to the div

        // **** Ep Title *****
        var title3 = document.createElement('h5');
        title3.id = "title3";
        title3.innerHTML = titles[5].innerText; // <a>INNER_TEXT</a>
        var title3_styling = "<style> #title3{ color: black; overflow: hidden; white-space: nowrap; font-size: 10px; text-align: center; display: inline-block; } </style>";
        $('head').append( title3_styling );
        titlesDiv.appendChild(document.createElement("br"));
        titlesDiv.appendChild(title3); // Append the link to the div

        // ****** Next & Previous Buttons ******
        var prevNextDiv = document.createElement("div"); //Create right div
        prevNextDiv.id = "prevNextDiv"; //Assign div id
        prevNextDiv.setAttribute("style", " margin-top: 5px; overflow:auto; display:block; "); //Set div attributes
        leftDiv.appendChild(prevNextDiv);

        var prev_a = document.createElement('a');
        prev_a.className = "aprevlink";
        prev_a.id = "aprevlinkid";
        prev_a.href =  previous; // Insted of calling setAttribute
        prev_a.setAttribute("target", "_self");
        prev_a.innerHTML = " Previous "; // <a>INNER_TEXT</a>
        var prev_link_styling = "<style> a.aprevlink{ float: left; background-color: white; color: #dd3333; font-weight: bold; padding: 3px 3px; text-align: center; text-decoration: none; display: inline-block; border: 1px solid #dd3333; border-radius: 2px; } </style>";
        var prev_link_hover_styling = "<style> a.aprevlink:hover{ background-color: #dd3333; color: white; border: 1px solid #dd3333; border-radius: 2px; } </style>";
        var prev_visited_styling = "<style> a.aprevlink:visited{ background-color: #c6c6c6; color: #666666; border: 1px solid #666666; border-radius: 2px; } </style>";
        var prev_visited_hover_styling = "<style> a.aprevlink:visited:hover{ background-color: #666666; color: white; border: 1px solid #666666; border-radius: 2px; } </style>";
        $('head').append( prev_link_styling );
        $('head').append( prev_link_hover_styling );
        $('head').append( prev_visited_styling );
        $('head').append( prev_visited_hover_styling );
        prevNextDiv.appendChild(prev_a); // Append the link to the div

        var next_a = document.createElement('a');
        next_a.className = "anext";
        next_a.id = "anextid";
        next_a.href =  next; // Insted of calling setAttribute
        next_a.setAttribute("target", "_self");
        next_a.innerHTML = " Next "; // <a>INNER_TEXT</a>
        var next_link_styling = "<style> a.anext:link{ float: right; background-color: white; color: #3369dd; font-weight: bold; padding: 3px 3px; text-align: center; text-decoration: none; display: inline-block; border: 1px solid #3369dd; border-radius: 2px; } </style>";
        var next_link_hover_styling = "<style> a.anext:link:hover{ background-color: #3369dd; color: white; font-weight: bold; padding: 3px 3px; text-align: center; text-decoration: none; display: inline-block; border: 1px solid #3369dd; border-radius: 2px; } </style>";
        var next_visited_styling = "<style> a.anext:visited{ float: right; background-color: #c6c6c6; color: #666666; font-weight: bold; padding: 3px 3px; text-align: center; text-decoration: none; display: inline-block; border: 1px solid #666666; border-radius: 2px; } </style>";
        var next_visited_hover_styling = "<style> a.anext:visited:hover{ float: right; background-color: #666666; color: white; font-weight: bold; padding: 3px 3px; text-align: center; text-decoration: none; display: inline-block; border: 1px solid #666666; border-radius: 2px; } </style>";
        $('head').append( next_link_styling );
        $('head').append( next_link_hover_styling );
        $('head').append( next_visited_styling );
        $('head').append( next_visited_hover_styling );
        prevNextDiv.appendChild(next_a); // Append the link to the div


        var autoCheckDiv = document.createElement("div"); //Create right div
        autoCheckDiv.id = "autoCheckDiv"; //Assign div id
        autoCheckDiv.setAttribute("style", " display:block; margin-top: 5px; "); //Set div attributes
        leftDiv.appendChild(autoCheckDiv);

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "autoOpenCheck";
        checkbox.checked = sessionStorage.getItem("mcheck") === "1";

        var autoOpenLbl1 = document.createElement('label');
        autoOpenLbl1.htmlFor = "autoOpenCheck";
        autoOpenLbl1.id = "autoOpenLbl1";
        autoOpenLbl1.innerHTML = autoOpenString;

        var check_styling = "<style> #autoOpenCheck{ cursor: pointer; text-align: center; text-decoration: none; display: inline-block; } </style>";
        var check_label1_styling = "<style> #autoOpenLbl1{ color: black; text-align: center; font-size: 14px; font-weight: normal; text-decoration: none; margin-left: 5px; display: inline-block; } </style>";
        $('head').append( check_styling );
        $('head').append( check_label1_styling );
        $('head').append( check_label2_styling );
        autoCheckDiv.appendChild(checkbox); // Append the link to the div
        autoCheckDiv.appendChild(autoOpenLbl1); // Append the link to the div

        checkbox.onclick = function(event) {
            var chbox = event.target;
            if (chbox.checked) {
                sessionStorage.setItem("mcheck", "1");
                if(!primelink){
                    primelink = "";
                }
                if(primelink !== ""){
                    countDown(primelink);
                }
            } else {
                sessionStorage.setItem("mcheck", "0");
                cancelCountDown();
            }
        };

        var autoCheckCounterDiv = document.createElement("div"); //Create right div
        autoCheckCounterDiv.id = "autoCheckCounterDiv"; //Assign div id
        autoCheckCounterDiv.setAttribute("style", " display:block; "); //Set div attributes
        leftDiv.appendChild(autoCheckCounterDiv);

        var autoOpenLbl2 = document.createElement('label');
        autoOpenLbl2.id = "autoOpenLbl2";
        autoOpenLbl2.innerHTML = "";
        var check_label2_styling = "<style> #autoOpenLbl2{ color: black; text-align: center; font-size: 10px; font-weight: normal; text-decoration: none; margin-left: 5px; display: inline-block; } </style>";
        autoCheckCounterDiv.appendChild(autoOpenLbl2); // Append the link to the div

        var autoOpenCancel = document.createElement('h5');
        autoOpenCancel.id = "autoOpenCancel";
        autoOpenCancel.title = "Cancel AutoOpen";
        autoOpenCancel.innerHTML = "X";
        var autoOpenCancel_styling = "<style> #autoOpenCancel{ cursor: pointer; background-color: #d82727; color: white; font-weight: bold; width: 13px; height: 13px; text-align: center; font-size: 10px; line-height: 1.428571429; border-radius: 13px; display: inline-block; margin-left: 10px; } </style>";
        $('head').append( autoOpenCancel_styling );
        autoCheckCounterDiv.appendChild(autoOpenCancel);

        autoOpenCancel.onclick = function() {
            cancelCountDown();
        };

        $('#autoCheckCounterDiv').hide();
    }

    // ********** Center Button **********
    var saved_checkposition = GM_getValue("checkposition");
    if (!saved_checkposition){
        GM_setValue("checkposition", "0");
        saved_checkposition = "0";
    }

    var centerKey = document.createElement('a');
    centerKey.id = "centerKey";
    centerKey.innerHTML = "⁛";
    var centerKey_styling = "<style> #centerKey { position: fixed; background-color: #00b2ff; color: white; height: 15px; width: 15px; font-size: 15px; font-weight: bold; cursor: pointer; text-align: center; padding-top: 0px; padding-right: 4px; padding-bottom: 4px; padding-left: 2px; } </style>";
    $('head').append( centerKey_styling );
    menuDiv.appendChild(centerKey); // Append the link to the div

    centerKey.onclick = function() {
        if(tempLeft){
            return;
        }
        if (GM_getValue("checkposition") === "0") {
            GM_setValue("checkposition", "1");
            centerMenu();
        } else {
            GM_setValue("checkposition", "0");
            leftMenu();
        }
    };

    // ********** Mini Button **********
    var miniKey = document.createElement('a');
    miniKey.id = "miniKey";
    miniKey.innerHTML = "▬";
    var miniKey_styling = "<style> #miniKey { position: fixed; background-color: #00b2ff; color: white; height: 15px; width: 15px; font-size: 12px; font-weight: bold; cursor: pointer; text-align: center; padding-top: 0px; padding-right: 4px; padding-bottom: 4px; padding-left: 2px; } </style>";
    $('head').append( miniKey_styling );
    menuDiv.appendChild(miniKey); // Append the link to the div

    miniKey.onclick = function(event) {
        var mminiKey = event.target;
        if(sessionStorage.getItem("hiddenState") !== "1"){
            sessionStorage.setItem("hiddenState", "1");
        } else {
            sessionStorage.setItem("hiddenState", "0");
        }
        miniMenu();
    };

    // ********** Settings Button **********
    var optionsKey = document.createElement('a');
    optionsKey.id = "optionsKey";
    optionsKey.innerHTML = "⚙";
    var optionsKey_styling = "<style> #optionsKey { position: fixed; background-color: #00b2ff; color: white; height: 15px; width: 15px; font-size: 15px; font-weight: bold; cursor: pointer; text-align: center; padding-top: 0px; padding-right: 4px; padding-bottom: 4px; padding-left: 2px; } </style>";
    $('head').append( optionsKey_styling );
    menuDiv.appendChild(optionsKey); // Append the link to the div

    optionsKey.onclick = function(event) {
        var moptionsKey = event.target;
        showoptions = !showoptions;
        if(showoptions){
            $("#rightDiv").animate({left:rightDivLeft, opacity:"show"}, smallDelay);
        } else {
            $("#rightDiv").animate({left:rightDivLeftHide, opacity:"hide"}, smallDelay);
        }
    };

    // ***** Settings **** Change Fav hosts ****** START
    var changeHoststitle = document.createElement('h5');
    changeHoststitle.id = "changeHoststitle";
    changeHoststitle.innerHTML = "Favorite Hosts:";
    var changeHoststitle_styling = "<style> #changeHoststitle{ color: black; overflow: hidden; font-weight: normal; white-space: nowrap; font-size: 12px; text-align: left; display: block; margin-top: 5px; } </style>";
    $('head').append( changeHoststitle_styling );
    rightDiv.appendChild(changeHoststitle);

    var changeHosts = document.createElement('input');
    changeHosts.type = "button";
    changeHosts.id = "changeHostsBtn";
    changeHosts.value = "Change";
    rightDiv.appendChild(changeHosts); // Append the link to the div

    var changeHostsBtn_styling = "<style> #changeHostsBtn{ width: 80%; cursor: pointer; background-color: white; color: #666666; font-weight: bold; padding: 7px 7px; text-align: center; text-decoration: none; display: block; border: 3px solid #666666; border-radius: 2px; margin: 0 auto; } </style>";
    var changeHostsBtn_hover_styling = "<style> #changeHostsBtn:hover{ background-color: #666666; color: white; border: 3px solid #666666; border-radius: 2px; } </style>";
    $('head').append( changeHostsBtn_styling );
    $('head').append( changeHostsBtn_hover_styling );

    $("#changeHostsBtn").click(addProviders);
    // ***** Settings **** Change Fav hosts ****** END

    // ***** Settings **** Autostart PrimeHost selection ******** START
    var primeHostSlctDiv = document.createElement("div");
    primeHostSlctDiv.id = "primeHostSlctDiv"; //Assign div id
    primeHostSlctDiv.setAttribute("style", " margin-top: 5px; padding: 5px; background-color: rgba(102, 102, 102,.8);  display:block; text-align: left; border: 0px; border-radius: 8px; "); //Set div attributes
    rightDiv.appendChild(primeHostSlctDiv);

    var SetPrimeHostLbl = document.createElement('h5');
    SetPrimeHostLbl.id = "SetPrimeHostLbl";
    SetPrimeHostLbl.innerHTML = "  Current PrimeHost : ";
    var SetPrimeHostLbl_styling = "<style> #SetPrimeHostLbl{ color: white; font-size: 12px; font-weight: normal; cursor: default; text-align: left; text-decoration: none; display: block; } </style>";
    $('head').append( SetPrimeHostLbl_styling );
    primeHostSlctDiv.appendChild(SetPrimeHostLbl); // Append the link to the div

    var SetPrimeHostLbl2 = document.createElement('h5');
    SetPrimeHostLbl2.id = "SetPrimeHostLbl2";
    SetPrimeHostLbl2.innerHTML = hosts[primeHost].substring(1,hosts[primeHost].length - 1);
    var SetPrimeHostLbl2_styling = "<style> #SetPrimeHostLbl2{ color: white; font-weight: bold; cursor: default; text-align: center; text-decoration: none; display: block; } </style>";
    $('head').append( SetPrimeHostLbl2_styling );
    primeHostSlctDiv.appendChild(SetPrimeHostLbl2); // Append the link to the div

    var setPrimeBtnClass = "optionsclassbutton";

    for (var x = 0; x < hostsArrLength; x++) {
        var hostslength = hosts[x].length - 1;
        var hostname = hosts[x].substring(1,hostslength);

        var option = document.createElement('input');
        option.type = "button";
        option.id = x;
        option.value = " " + hostname + " ";
        option.className = setPrimeBtnClass;
        rightDiv.appendChild(option); // Append the link to the div
    }

    var option_styling = "<style> input." + setPrimeBtnClass + " { min-width: 80%; cursor: pointer; display: block; margin: 0 auto; margin-top: 10px; background-color: white; color: #666666; font-weight: bold; padding: 7px 7px; text-align: center; text-decoration: none; border: 3px solid #666666; border-radius: 2px; } </style>";
    $('head').append( option_styling );
    var options_button_hover_styling = "<style> input." + setPrimeBtnClass + ":hover{ background-color: #666666; color: white; } </style>";
    $('head').append( options_button_hover_styling );

    $("." + setPrimeBtnClass).click(function(event) {
        var mbutton = event.target;
        GM_setValue ("primeHost", mbutton.id);
        document.getElementById("SetPrimeHostLbl2").innerHTML = hosts[mbutton.id].substring(1,hosts[mbutton.id].length - 1);
        primelink = primeLinksArr[mbutton.id];
        if(!primelink){
            primelink = "";
        }
    });


    $("#rightDiv").hide();
    // ***** Settings **** Autostart PrimeHost selection ******** END

    // ********** Left DIV ******** links
    var leftDivTop = 0;
    var mchildren = document.getElementById("leftDiv").childNodes;
    var mchildrenLength = mchildren.length;
    for(var y = 0; y < mchildrenLength; y++){
        leftDivTop += mchildren[y].offsetHeight;
    }
    for (var i = 0; i < hostsArrLength; i++) {
        var colorpos = i % colorslength;
        var color = colors[colorpos];
        var hostlength = hosts[i].length - 1;
        var linkTitle = hosts[i].substring(1,hostlength);
        var target = $('#first > table:icontains('+ linkTitle +')');
        $(target).css('background-color', "rgba(" + colorsRGB[colorpos] + ",.4) ");
        var targetlength = target.length;

        var linkID = linkTitle.replace(".","");
        linkID = linkID.replace(".","");
        linkID = linkID.replace(".","");
        linkID = "link_Host_" + linkID + "_ID";

        for (var j = 0; j < targetlength; j++){
            linksAvailable = true;
            var finalcolor = color;
            var targetx = $(target[j]).find('.movie_version_link a').attr('href');
            var link = 'https://www.primewire.ag' + targetx;

            if((leftDivTop + 45) >= $(window).height()){
                break;
            }

            if(j === 0){
                primeLinksArr[i] = link;
            }

            if(primelink === "" && i == primeHost){
                primelink = link;
            }

            var linkButton = document.createElement('a');
            linkButton.id = linkID + "_" + j;
            linkButton.href =  link; // Insted of calling setAttribute
            linkButton.setAttribute("target", "_blank");
            linkButton.innerHTML = " " + linkTitle + " "; // <a>INNER_TEXT</a>
            var linkButton_styling = "<style> #" + linkID + "_" + j + "{ background-color: white; color: " + finalcolor + "; font-weight: bold; padding: 7px 10px; text-align: center; text-decoration: none; display:block; border: 2px solid " + finalcolor + "; border-radius: 4px; margin-top: 10px; } </style>";
            var linkButton_hover_styling = "<style> #" + linkID + "_" + j + ":hover{ background-color: " + finalcolor + "; color: white; border: 2px solid " + finalcolor + "; border-radius: 4px; } </style>";
            var visited_linkButton_styling = "<style> #" + linkID + "_" + j + ":visited{ background-color: #c6c6c6; color: #666666; border: 2px solid #666666; border-radius: 4px; } </style>";
            var visited_linkButton_hover_styling = "<style> #" + linkID + "_" + j + ":visited:hover{ background-color: #666666; color: white; border: 2px solid #666666; border-radius: 4px; } </style>";
            $('head').append( linkButton_styling );
            $('head').append( linkButton_hover_styling );
            $('head').append( visited_linkButton_styling );
            $('head').append( visited_linkButton_hover_styling );
            leftDiv.appendChild(linkButton); // Append the link to the div
            leftDivTop += 38;
        }
    }

    var noLink = document.createElement('h1');
    noLink.id = "noLink";
    noLink.innerHTML = "no available link.";
    var noLink_styling = "<style> #noLink{ color: black; overflow: hidden; white-space: nowrap; font-size: 16px; opacity: .5; font-weight: bold; text-align: center; display: block; margin-top: 10px; } </style>";
    $('head').append( noLink_styling );
    leftDiv.appendChild(noLink);
    $("#noLink").hide(); // Start hidden
    // ********** Final adjustments to all Elements **********************
    if(!linksAvailable){
        $("#noLink").show();
        tempLeft = true;
    }

    var showMenu = false;
    if(document.getElementsByClassName("actual_tab").length > 0 && document.getElementsByClassName("tv_container").length < 1){
        showMenu = true;
    }

    if(showMenu){

        if(sessionStorage.getItem("hiddenState") === "1"){
            miniMenu();
        } else if(GM_getValue("checkposition") === "1" && !tempLeft){
            centerMenu();
        } else {
            leftMenu();
        }

        document.addEventListener('visibilitychange', function(){
            if(!document.hidden && sessionStorage.getItem("hiddenState") !== "1"){
                if(sessionStorage.getItem("hiddenState") === "1"){
                    miniMenu();
                } else if(GM_getValue("checkposition") === "1" && !tempLeft){
                    centerMenu();
                } else {
                    leftMenu();
                }
            }
        });

        if(!primelink){
            primelink = "";
        }

        if(sessionStorage.getItem("mcheck") === "1" && primelink !== ""){
            countDown(primelink);
        }
    } else {
        $("#menuDiv").hide(); // Start hidden
        $("#leftDiv").hide(); // Start hidden
    }

    // ******* Hide Right DIV (Settings) onclick outside DIV ************
    $(document).click(function(event) {
        var a = $(event.target).closest('#rightDiv').length;
        var b = $(event.target).closest('#optionsKey').length;

        if(a < 1 && b < 1) {
            $("#rightDiv").animate({left:rightDivLeftHide, opacity:"hide"}, smallDelay);
            showoptions = false;
        }
    });

});

// ********** Change Menu Position ********** START
function centerMenu() {
    if(showState === 2)
        return;
    var width = document.getElementById("leftDiv").offsetWidth;
    var height = document.getElementById("leftDiv").offsetHeight;
    var winwidth = $(window).width();
    var winheight = $(window).height();
    var newwidth = (winwidth - width) / 2;
    var newheight = (winheight - height) / 2;
    $("#centerDiv").animate({opacity:"show"}, bigDelay);
    $("#leftDiv").animate({left:newwidth, top:newheight}, bigDelay);
    $("#optionsKey").animate({left:(newwidth + 50), top:(newheight - 20)}, bigDelay);
    $("#centerKey").animate({left:(newwidth + 25), top:(newheight - 20)}, bigDelay);
    $("#miniKey").animate({left:(newwidth), top:(newheight - 20)}, bigDelay);
    if(showoptions){
        $("#rightDiv").animate({left:(newwidth + width - 5), top:(newheight + 1)}, bigDelay);
        $("#rightDiv").animate({left:(newwidth + width - 10), opacity:"hide"}, smallDelay);
        showoptions = false;
    } else {
        $("#rightDiv").animate({left:(newwidth + width - 10), top:(newheight + 1)}, bigDelay);
    }
    rightDivLeft = (newwidth + width - 5);
    rightDivLeftHide = (newwidth + width - 10);
    showState = 2;
}

function leftMenu() {
    if(showState === 1)
        return;
    var width = document.getElementById("leftDiv").offsetWidth;
    var height = document.getElementById("leftDiv").offsetHeight;
    $("#centerDiv").animate({opacity:"hide"}, bigDelay);
    $("#leftDiv").animate({left:5, top:25}, bigDelay);
    $("#optionsKey").animate({left:(5 + 50), top:(5)}, bigDelay);
    $("#centerKey").animate({left:(5 + 25), top:(5)}, bigDelay);
    $("#miniKey").animate({left:(5), top:(5)}, bigDelay);
    if(showoptions){
        $("#rightDiv").animate({left:width, top:26}, bigDelay);
        $("#rightDiv").animate({left:(width - 6), opacity:"hide"}, smallDelay);
        showoptions = false;
    } else {
        $("#rightDiv").animate({left:(width - 6), top:26}, bigDelay);
    }
    rightDivLeft = width;
    rightDivLeftHide = width - 6;
    showState = 1;
}

var showState = 0;
var hiddenState = sessionStorage.getItem("hiddenState");
if (!hiddenState){
    sessionStorage.setItem("hiddenState", "0");
}

function miniMenu() {
    if(sessionStorage.getItem("hiddenState") !== "1"){
        $("#leftDiv").show();
        $("#optionsKey").show();
        $("#centerKey").show();
        $("#miniKey").css("background-color","#00b2ff");
        if(GM_getValue("checkposition") === "1" && !tempLeft){
            centerMenu();
        } else {
            leftMenu();
        }
        sessionStorage.setItem("hiddenState", "0");
    } else {
        $("#miniKey").css("background-color","#ff5500");
        if(showState !== 1){
            leftMenu();
            setTimeout(function() {
                $("#leftDiv").hide();
                $("#optionsKey").hide();
                $("#centerKey").hide();
            },bigDelay);

        } else {
            $("#leftDiv").hide();
            $("#optionsKey").hide();
            $("#centerKey").hide();
        }
        sessionStorage.setItem("hiddenState", "1");
    }
}
// ********** Change Menu Position ********** END

var timer1, timer2, timer3, timer4, timer5;
function countDown(primelink){
    cancelCountDown();
    autoOpen = true;
    $('#autoCheckCounterDiv').show();
    document.getElementById("autoOpenLbl2").innerHTML = "in " + 5 + "s";

    timer1 = setTimeout(function() {
        if(autoOpen){
            document.getElementById("autoOpenLbl2").innerHTML = "in " + 4 + "s";
        } else {
            cancelCountDown();
        }
    },1000);

    timer2 = setTimeout(function() {
        if(autoOpen){
            document.getElementById("autoOpenLbl2").innerHTML = "in " + 3 + "s";
        } else {
            cancelCountDown();
        }
    },2000);

    timer3 = setTimeout(function() {
        if(autoOpen){
            document.getElementById("autoOpenLbl2").innerHTML = "in " + 2 + "s";
        } else {
            cancelCountDown();
        }
    },3000);

    timer4 = setTimeout(function() {
        if(autoOpen){
            document.getElementById("autoOpenLbl2").innerHTML = "in " + 1 + "s";
        } else {
            cancelCountDown();
        }
    },4000);

    timer5 = setTimeout(function() {
        if(autoOpen){
            window.open(primelink, '_blank');
        }
        $('#autoCheckCounterDiv').hide();
    },5000);
}

function cancelCountDown(){
    autoOpen = false;
    $('#autoCheckCounterDiv').hide();
    if(typeof timer1 !== 'undefined'){
        clearTimeout(timer1);
    }
    if(typeof timer2 !== 'undefined'){
        clearTimeout(timer2);
    }
    if(typeof timer3 !== 'undefined'){
        clearTimeout(timer3);
    }
    if(typeof timer4 !== 'undefined'){
        clearTimeout(timer4);
    }
    if(typeof timer5 !== 'undefined'){
        clearTimeout(timer5);
    }
}