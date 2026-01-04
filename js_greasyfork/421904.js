// ==UserScript==
// @name         Decklog To Tabletop simulator Object
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Download TCG card from Decklog and import to Tabletop simulator as deck item
// @author       ZeroX
// @match        https://decklog.bushiroad.com/view/*
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js
// @require https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.5.3/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/421904/Decklog%20To%20Tabletop%20simulator%20Object.user.js
// @updateURL https://update.greasyfork.org/scripts/421904/Decklog%20To%20Tabletop%20simulator%20Object.meta.js
// ==/UserScript==


(function(){var c;c=jQuery;c.bootstrapGrowl=function(f,a){var b,e,d;a=c.extend({},c.bootstrapGrowl.default_options,a);b=c("<div>");b.attr("class","bootstrap-growl alert");a.type&&b.addClass("alert-"+a.type);a.allow_dismiss&&(b.addClass("alert-dismissible"),b.append('<button class="close" data-dismiss="alert" type="button"><span aria-hidden="true">&#215;</span><span class="sr-only">Close</span></button>'));b.append(f);a.top_offset&&(a.offset={from:"top",amount:a.top_offset});d=a.offset.amount;c(".bootstrap-growl").each(function(){return d= Math.max(d,parseInt(c(this).css(a.offset.from))+c(this).outerHeight()+a.stackup_spacing)});e={position:"body"===a.ele?"fixed":"absolute",margin:0,"z-index":"9999",display:"none"};e[a.offset.from]=d+"px";b.css(e);"auto"!==a.width&&b.css("width",a.width+"px");c(a.ele).append(b);switch(a.align){case "center":b.css({left:"50%","margin-left":"-"+b.outerWidth()/2+"px"});break;case "left":b.css("left","20px");break;default:b.css("right","20px")}b.fadeIn();0<a.delay&&b.delay(a.delay).fadeOut(function(){return c(this).alert("close")}); return b};c.bootstrapGrowl.default_options={ele:"body",type:"info",offset:{from:"top",amount:20},align:"right",width:250,delay:4E3,allow_dismiss:!0,stackup_spacing:10}}).call(this);

//declare all globle var
var scrUIdata = "<div class=\"container\" id=\"scr_menu\">"+
    "<div class=\"container\">"+
    "<h3><div style=\"text-align: center;\">"+
    "<span style=\"font-size: 2.00rem;\">DeckLog to TableTop Simulator Object&nbsp;</span>"+
    "<font color=\"#ffffff\"><span style=\"font-size: 21px; white-space: nowrap; background-color: rgb(108, 117, 125);\"><b>1.0</b></span></font>"+
    "</div></h3>"+
    "</div>"+
    "<div class=\"container\">"+
    "<button type=\"button\" class=\"btn btn-primary\" style=\"font-size: 20px; margin: 5px;\" id=\"scr_download_lua\">Download Deck</button>"+
    "</div>"+
    "<div class=\"container\">"+
    "<div class=\"card border-primary mb-3\">"+
    "<div class=\"card-header text-right\">"+
    "<div class=\"d-none float-left spinner-border\" role=\"status\" id=\"scr_loding\">"+
    "<span class=\"sr-only\">Loading...</span>"+
    "</div>"+
    "</div>"+
    "<div class=\"card-body text-primary\">"+
    "<div class=\"container\">"+
    "<label class=\"text-secondary\">Cardback</label>"+
    "<input type=\"text\" class=\"form-control\" id=\"scr_cardback_input\" placeholder=\"Input your card back image url here\">"+
    "<label class=\"text-secondary\">Place .json file in folder \"Documents\\My Games\\Tabletop Simulator\\Saves\\Saved Objects\\\"</label>"+
    "</div>"+
    "</div>"+
    "</div>"+
    "</div>";
var allfinish = false;
var totalnum = "";
var lua_base = "";
var carddata = "";
var cardback = "";
var cardid = "";
var craddescarray = [];
var cardidarray = [];
var target = document.querySelector("#loader-bg");
var runcheck = true;
var ttsObject = {SaveName: "", GameMode: "", Date: "", VersionNumber: "", GameType: "", GameComplexity: "", Tags: [], Gravity: 0.5, PlayArea: 0.5, Table: "", Sky: "", Note: "", Rules: "", TabStates: {}, LuaScript: "", LuaScriptState: "", XmlUI: ""};
ttsObject.ObjectStates = [{GUID: "", Name: "Deck", Transform: {posX: 8.575968, posY: 2.149997, posZ: -6.66962337, rotX: 0, rotY: 180.0, rotZ: 180.0, scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0}, Nickname: "", Description: "", GMNotes: "",
                           ColorDiffuse: {r: 1.0, g: 1.0, b: 1.0}, LayoutGroupSortIndex: 0, Locked: false, Grid: true, Snap: true, IgnoreFoW: false, MeasureMovement: false, DragSelectable: true, Autoraise: true, Sticky: true, Tooltip: true,
                           GridProjection: false, HideWhenFaceDown: true, Hands: true, SidewaysCard: false, DeckIDs: [], CustomDeck: {}, LuaScript: "", LuaScriptState: "", XmlUI: "", ContainedObjects: []}];
function addCard(guid, name, cardID, cardID2, faceURL, backURL, num) {
    var containedObject = {GUID: guid, Name: "Card", Transform: {posX: 0.0, posY: 5.0, posZ: 0.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0}, Nickname: name, Description: "", GMNotes: "",
                           ColorDiffuse: {r: 1.0, g: 1.0, b: 1.0}, LayoutGroupSortIndex: 0, Locked: false, Grid: true, Snap: true, IgnoreFoW: false, MeasureMovement: false, DragSelectable: true, Autoraise: true, Sticky: true, Tooltip: true,
                           GridProjection: false, Hands: true, CardID: cardID * 100, SidewaysCard: false, CustomDeck: {}, LuaScript: "", LuaScriptState: "", XmlUI: ""};
    containedObject.CustomDeck[cardID2] = {FaceURL: faceURL, BackURL: backURL, NumWidth: 1, NumHeight: 1, BackIsHidden: true, UniqueBack: false, Type: 0};
    for (i=0;i<num;i++) {
        ttsObject.ObjectStates[0].DeckIDs.push(cardID * 100);
        ttsObject.ObjectStates[0].ContainedObjects.push(containedObject);
    }
    ttsObject.ObjectStates[0].CustomDeck[cardID] = {FaceURL: faceURL, BackURL: backURL, NumWidth: 1, NumHeight: 1, BackIsHidden: true, UniqueBack: false, Type: 0};
}
// create an observer instance
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(async function (mutation) {
        //alert("mutation");
        await doruncheck();
    });
});

// configuration of the observer:
var config = { attributes: true };
var target2 = document.querySelector(".body-page-view");
// create an observer instance
var observer2 = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        setTimeout(function () {
            //Code to run After timeout elapses
            remove_landscape_card();
        }, 500); //Two seconds will elapse and Code will execute.
    });
});

// configuration of the observer:
var config2 = { attributes: true, childList: true, characterData: true };
var sqlcardid = "";
var deckname = "";
var deckdesc = "";

//finish declare

(function () {
    "use strict";

    // Your code here...
    $(document).ready(function () {
        //When document has loaded
        console.log("start");

        observer.observe(target, config);
        observer2.observe(target2, config2);
    });
})();

async function doruncheck() {
    if (runcheck == true) {
        //check for page finish
        var stats = $("#loader-bg").attr("style");
        //console.log(stats);
        if (stats.includes("none") == true) {
            await startpage();
            runcheck = false;
        }
    } else {
        //console.log("no check");
    }
}

function startpage() {
    runcheck = false;
    //build UI
    setTimeout(function () {
        $(".deckview").append(scrUIdata);
        $("#collapseOne").addClass("collapse");
        $("#scr_cardback_input").val("https://drive.google.com/uc?export=view&id=1aIGGb5QAsMDwwj6ToZ5AZViiyYRzUEjA");
        set_UI_button();
    }, 2000);
}

//start hooking all button control
function set_UI_button() {
    $("#scr_download_lua").click(download_TTS_Lua_code);
}

async function download_TTS_Lua_code(zEvent) {
    $("#scr_loding").removeClass("d-none");

    totalnum = $(".graph-sum-value").text();
    deckname = $("h2").text().replace("デッキ名「", "").replace("」のデッキ", "");
    var deckid = $(location).attr("href");
    console.log(deckid);
    var deckseries = $(".col-lg-6").find("span").first().text();
    deckdesc = deckseries + " \n" + deckid;
    cardback = $("#scr_cardback_input").val();

    var guid = "deadbf";
    ttsObject.ObjectStates[0].GUID = guid;
    ttsObject.ObjectStates[0].Nickname = deckname;
    ttsObject.ObjectStates[0].Description = deckdesc;

    var cardID = 50;
    var cardID2 = 10;
    $(".deckview")
        .find(".card-item")
        .each(function (index) {
        //console.log( index + ": " + $(this).find("img").attr("title"));

        var num = $(this)
        .find(".card-controller-inner")
        .find(".num")
        .first()
        .text();
        var i;
        var dl_url = $(this).find("img").attr("src");
        var name = $(this).find("img").attr("title");
        var spname = name.split(" : ");

        addCard(guid, name, cardID, cardID2, dl_url, cardback, num);

        cardID++;
        cardID2++;
    });

    combine();
    $("#scr_loding").addClass("d-none");
}

function remove_landscape_card(zEvent) {
    //alert ("Test");
    const img = new Image();
    $(".deckview")
        .find(".card-item")
        .each(function (index) {
        //console.log( index + ": " + $(this).find("img"));
        const img = new Image();
        //img.onload = function() {
        //    console.log( index + ": " + this.width + 'x' + this.height);
        //}
        img.src = $(this).find("img").attr("src");
        //console.log( index + ": " + img.width + 'x' + img.height);

        if (img.width > img.height) {
            $("#scr_loding").removeClass("d-none");
            var name = $(this).find("img").attr("title");
            var spname = name.split(" : ");
            var yyturl1 =
                "https://yuyu-tei.jp/game_ws/sell/sell_price.php?name=" + spname[0];

            let getimg = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: yyturl1,
                    headers: {
                        "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
                        Accept: "application/atom+xml,application/xml,text/xml",
                    },
                    onload: function (responseDetails) {
                        //console.log('Request for Atom feed returned ' + responseDetails.status + ' ' + responseDetails.statusText + '\n\n' +'Feed data:\n' + responseDetails.responseText);
                        //console.log(responseDetails.responseText)
                        var yyturl2 =
                            "https://yuyu-tei.jp" +
                            $(responseDetails.responseText)
                        .find(".card_list_box")
                        .find("a")
                        .attr("href");

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: yyturl2,
                            headers: {
                                "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
                                Accept: "application/atom+xml,application/xml,text/xml",
                            },
                            onload: function (responseDetails) {
                                //console.log('Request for Atom feed returned ' + responseDetails.status + ' ' + responseDetails.statusText + '\n\n' +'Feed data:\n' + responseDetails.responseText);
                                //console.log(responseDetails.responseText)
                                var data = responseDetails.responseText;
                                var newimg = $(data)
                                .find(".image_box")
                                .find("img")
                                .first()
                                .attr("src");
                                //console.log(newimg);
                                if (newimg != "") {
                                    resolve(newimg);
                                } else {
                                    reject("img no found");
                                }
                            },
                        });
                    },
                });
            });

            getimg.then((successdata) => {
                console.log("replace image = "+$(this).find("img").attr("src", successdata));
                $("#scr_loding").addClass("d-none");
            });
        }

        //alert(name);
    });
}

function combine() {
    var lua = JSON.stringify(ttsObject);
    GM_setClipboard(lua);
    download(deckname + ".json", lua);
    //alert("Lua code finished, please paste lua in the scripting tab");
    $.bootstrapGrowl("Finished", {
        type: 'success', // (null, 'info', 'danger', 'success')
        allow_dismiss: true, // If true then will display a cross to close the popup.
        stackup_spacing: 10 // spacing between consecutively stacked growls.
    });
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}