// ==UserScript==
// @name        Torn Race Stats
// @description Torn race car stats numerical and save/load custom race settings
// @namespace   http://www.browserscripts.blogger.com
// @include     *torn.com/loader.php?sid=racing
// @version     0.2
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/388821/Torn%20Race%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/388821/Torn%20Race%20Stats.meta.js
// ==/UserScript==
/* global $ */

var pgurl = encodeURIComponent(document.URL);
//-Race Stats
if (pgurl.search("racing")>-1){
$("a[href$='loader.php?sid=racing&tab=cars'],a[href$='loader.php?sid=racing&tab=parts'],a[href$='changeRacingCar']").click(function(){window.setTimeout(function(){carStats();},1000);});
$("a[href$='loader.php?sid=racing&tab=race']").click(function(){window.setTimeout(function(){carLookLink();},1000);});

////////////////////////
//--Save/Load testing
$("a[href$='/loader.php?sid=racing&tab=customrace']").click(function(){window.setTimeout(function(){cCCheck();},1000);});


}

function cCCheck () {
    if ($("a[href$='/loader.php?sid=racing&tab=customrace&section=createCustomRace']").length>-1){$("a[href$='/loader.php?sid=racing&tab=customrace&section=createCustomRace']").css("color","green");$("a[href$='/loader.php?sid=racing&tab=customrace&section=createCustomRace']").click(function(){window.setTimeout(function(){saveLoad();},1000);});}
    else {window.setTimeout(function(){cCCheck();},1000);}
}
function saveLoad () {
    if ($("input[form-value='createCustomRace']").length>-1){
    $("<div id='expRT' style='float:right;'><button id='rSSave'> Save </button><button id='rSLoad'> Load </button><br /></div>").appendTo("#racingAdditionalContainer>div.form-custom-wrap>div.title-black.top-round.m-top10.bold");
    $("#rSSave").click(function(){sRData();});

    $("#rSLoad").click(function(){lRData();});
    }
    else {window.setTimeout(function(){saveLoad();},1000);}
}
function sRData () {
    var rN=$("#racename").val();
    var dMin=$("li.drivers-wrap>div.input-wrap>input").val();
    var dMax=$("li.drivers-max-wrap>div.input-wrap>input").val();
    var laps=$("li.laps-wrap>div.input-wrap>input").val();
    var rC=$("#select-racing-cars").val();
    var upg=$("#select-allow-upgrades").val();
    var bA=$("#betAmount").val();
    var wT=$("#waitTime").val();
    var pass=$("ul.column.right#password").val();
    if (pass==undefined){pass="";}
    var track=$("#select-racing-track").val();
    var tImg=$("div.tracks-wrap>div.flex-viewport>ul.slider-wrap").css("transform");
    localStorage.cRData=[rN,dMin,dMax,laps,rC,upg,bA,wT,pass,track];
    localStorage.tID=tImg;
    alert("Settings stored");
}
function lRData () {
        if (localStorage.cRData.length>1 && localStorage.tID.length>1){
            var tImg=localStorage.tID;
            var rData=localStorage.cRData.split(",");
            var rN=rData[0];var dMin=rData[1];var dMax=rData[2];var laps=rData[3];var rC=rData[4];var upg=rData[5];var bA=rData[6];var wT=rData[7];var pass=rData[8];var track=rData[9];
            $("#racename").val(rN);
            $("li.drivers-wrap>div.input-wrap>input").val(dMin);
            $("li.drivers-max-wrap>div.input-wrap>input").val(dMax);
            $("li.laps-wrap>div.input-wrap>input").val(laps);
            $("#select-racing-cars").val(rC);
            $("#select-racing-cars-button>span.ui-selectmenu-status").text($("#select-racing-cars>option[value='"+rC+"']").text());
            $("#select-allow-upgrades").val(upg);
            $("#select-allow-upgrades-button>span.ui-selectmenu-status").text($("#select-allow-upgrades>option[value='"+upg+"']").text());
            $("#betAmount").val(bA);
            $("#waitTime").val(wT);
            $("ul.column.right#password").val(pass);
            $("#select-racing-track").val(track);
            $("#select-racing-track-button>span.ui-selectmenu-status").text($("#select-racing-track>option[value='"+track+"']").text());
            $("div.tracks-wrap>div.flex-viewport>ul.slider-wrap").css("transform",tImg);
        }
        else {alert("No saved race found.");}
    }

//--End testing
/////////////////////////

function carLookLink () {
    if ($("div.car-selected.left").length){
        $("a[href$='changeRacingCar']").click(function(){window.setTimeout(function(){carStats();},1000);});
    }
    else {window.setTimeout(function(){carLookLink();},1000);}
}

function carParts() {
    if ($("div.cont-black.bottom-round").length){
        var hold=$("ul.properties-wrap>li");
        var clrSt=$("div.bar-color-wrap-d");
        var grySt=$("div.bar-gray-light-wrap-d");
        var hC=0;
        while (grySt[hC])
            {
                var cStatN=$(clrSt).eq(hC).attr("style");
                cStatN=cStatN.replace(/[^0-9.]/g,"").substr(0,6);
                if (cStatN=="0"){
                        cStatN=$(grySt).eq(hC).attr("style");
                        cStatN=cStatN.replace(/[^0-9.]/g,"").substr(0,6);}
                var top=$(grySt).eq(hC).parents("li:first").find("div.name");
                $(top).css("height","40px");
                if ($(top).text().search(cStatN)<0){
                    $(top).append("<br/>"+cStatN);}
                hC++;

    }}
    else{window.setTimeout(function(){carParts();},1000);}
}

function carStats () {
    if ($("div.enlist-wrap.enlisted-wrap").length){
        $("div.gallery-wrapper.pagination.m-top10.left a,a[href$='changeRacingCar'],a[href$='sid=racing&tab=parts'],div.gallery-wrapper.pagination.m-top10.left>a").click(function(){window.setTimeout(function(){carStats();},1000);});
        $("div.remove-info>a").click(function(){window.setTimeout(function(){carParts();}, 1000);});
    var holder=$("ul.enlist-bars>li");
    var cStat=$("div.bar-color-wrap-d");
    var dStat=$("div.bar-gray-light-wrap-d");
    var hC=0;
    var sC=0;
    while (holder[hC])
    {
        if ($(holder).eq(hC).hasClass("clear")===false){
            var cStatN=$(cStat).eq(sC).attr("style");
            cStatN=cStatN.replace(/[^0-9.]/g,"").substr(0,6);
            if (cStatN=="0"){
                cStatN=$(dStat).eq(sC).attr("style");
                cStatN=cStatN.replace(/[^0-9.]/g,"").substr(0,6);}
            if ($(holder).eq(hC).text().search(cStatN)<0){
                $(holder).eq(hC).prepend(cStatN);}
            sC++;}
        hC++;

    }}
    else{window.setTimeout(function(){carStats();},1000);}
}
//--End Race Stats