// ==UserScript==
// @name         Decklog To Tabletop simulator script
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Download TCG card from Decklog and import to Tabletop simulator as deck item
// @author       Royal
// @match        https://decklog.bushiroad.com/view/*
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js
// @require https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.5.3/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/420268/Decklog%20To%20Tabletop%20simulator%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/420268/Decklog%20To%20Tabletop%20simulator%20script.meta.js
// ==/UserScript==


(function(){var c;c=jQuery;c.bootstrapGrowl=function(f,a){var b,e,d;a=c.extend({},c.bootstrapGrowl.default_options,a);b=c("<div>");b.attr("class","bootstrap-growl alert");a.type&&b.addClass("alert-"+a.type);a.allow_dismiss&&(b.addClass("alert-dismissible"),b.append('<button class="close" data-dismiss="alert" type="button"><span aria-hidden="true">&#215;</span><span class="sr-only">Close</span></button>'));b.append(f);a.top_offset&&(a.offset={from:"top",amount:a.top_offset});d=a.offset.amount;c(".bootstrap-growl").each(function(){return d= Math.max(d,parseInt(c(this).css(a.offset.from))+c(this).outerHeight()+a.stackup_spacing)});e={position:"body"===a.ele?"fixed":"absolute",margin:0,"z-index":"9999",display:"none"};e[a.offset.from]=d+"px";b.css(e);"auto"!==a.width&&b.css("width",a.width+"px");c(a.ele).append(b);switch(a.align){case "center":b.css({left:"50%","margin-left":"-"+b.outerWidth()/2+"px"});break;case "left":b.css("left","20px");break;default:b.css("right","20px")}b.fadeIn();0<a.delay&&b.delay(a.delay).fadeOut(function(){return c(this).alert("close")}); return b};c.bootstrapGrowl.default_options={ele:"body",type:"info",offset:{from:"top",amount:20},align:"right",width:250,delay:4E3,allow_dismiss:!0,stackup_spacing:10}}).call(this);

//declare all globle var
var scrUIdata = "";
var urllisttostring = "";
var cardidtostring = "";
var cardtitletostring = "";
var carddesctostring = "";
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
  get_UI();
  setTimeout(function () {
    $(".deckview").append(scrUIdata);
    $("#collapseOne").addClass("collapse");
    set_UI_button();
    //show_debug();
  }, 2000);
}

async function get_UI() {
  await GM_xmlhttpRequest({
    method: "GET",
    url:
      "https://raw.githubusercontent.com/RoyalShooter/Decklog-To-Tabletop-simulator-script/main/UI_code/UIhtml_public",
    headers: {
      "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
      Accept: "application/atom+xml,application/xml,text/xml",
    },
    onload: function (responseDetails) {
      scrUIdata = responseDetails.responseText || "<h1>Error on loding UI</h1>";
      //console.log(scrUIdata);
    },
  });
}
//start hooking all button control
function set_UI_button() {
  $("#scr_download_lua").click(download_TTS_Lua_code);
  $("#scr_download_as_image").click(download_Image);
}

function show_debug() {
  $("#collapseOne").append(
    '<button type="button" id="Testbbt">Testbbt</button>'
  );
  $("#Testbbt").click(Testbbt);
}
//finish set button
function download_Image(zEvent) {
  alert("Downloading as TTS card set");
  $(".deckview")
    .find(".card-item")
    .each(function (index) {
      //console.log(index + ": " + $(this).find("img").attr("title"));
      var name = $(this).find("img").attr("title").replace("/", "-");
      var dl_url = $(this).find("img").attr("src");
      var num =
        "0" +
        $(this).find(".card-controller-inner").find(".num").first().text() +
        "x";
      var path = "Decklog_TTS/"; // use a special folder for all the images
      var arg = {
        url: dl_url,
        name: path + num + " " + name + ".png",
      };
      var result = GM_download(arg);
      //console.log(result);
    });
  //download card back
  var arg = {
    url: "https://www.tcgcard.tw/wp-content/uploads/2020/05/ws_cardback.png",
    name: "Decklog_TTS/00 back.png",
  };
  var result = GM_download(arg);
  //console.log(result);
}

async function download_TTS_Lua_code(zEvent) {
$("#scr_loding").removeClass("d-none");
  // alert ("Test");
  var urllist = [];
  var cardidlist = [];
  var cardtitlelist = [];
  var carddesc = [];
  totalnum = $(".graph-sum-value").text();
  deckname = $("h2").text().replace("デッキ名「", "").replace("」のデッキ", "");
  var deckid = $(location).attr("href");
  console.log(deckid);
  var deckseries = $(".col-lg-6").find("span").first().text();
  deckdesc = deckseries + " \\n" + deckid;

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
      for (i = 0; i < num; i++) {
        var dl_url = $(this).find("img").attr("src");
        urllist.push(dl_url);
        var name = $(this).find("img").attr("title");
        var spname = name.split(" : ");
        cardidlist.push(spname[0]);
        var escaped_name = escape_charater(spname[1])
        cardtitlelist.push(escaped_name);
      }
    });
  //console.log("'" + urllist.join("','") + "'");
  //console.log("'" + cardidlist.join("','") + "'");
  //console.log("'" + cardtitlelist.join("','") + "'");
  //console.log("'" + carddesc.join("','") + "'");
  //GM_setClipboard("'" + urllist.join("','") + "'");
  urllisttostring = "'" + urllist.join("','") + "'";
  cardidtostring = "'" + cardidlist.join("','") + "'";
  cardtitletostring = "'" + cardtitlelist.join("','") + "'";



var download_desc = $("#scr_progress_bar_show").hasClass("d-none")
if (download_desc == false){
  //alert("do download "+download_desc)
}else{
  //alert("do nothing "+download_desc)
}
  carddesctostring = "'" + craddescarray.join("','") + "'" || "";
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

function get_card_id_list() {
  //alert("get_card_id_list");
  var urllist = [];
  var cardidlist = [];
  var cardidtop = [];
  var cardidback = [];
  var cardidtemparray = [];
  var cardidtemp = "";
  var cardtitlelist = [];
  var carddesc = [];
  totalnum = $(".graph-sum-value").text();

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
      for (i = 0; i < num; i++) {
        var dl_url = $(this).find("img").attr("src");
        urllist.push(dl_url);
        var name = $(this).find("img").attr("title");
        var spname = name.split(" : ");
        cardidtemparray = spname[0].split("-");
        cardidtop = cardidtemparray[0];
        cardidback = cardidtemparray[1].substring(0, 3);
        //console.log(cardidback);
        cardidtemp = cardidtop + "-" + cardidback;
        cardidlist.push(cardidtemp);
        cardidarray = cardidlist;
      }
    });
  //pass "cardidarray[]" to globle var
}

function download_card_id_list(zEvent) {
  get_card_id_list();
  //console.log('"' + cardidarray.join('","') + '"');
  sqlcardid = "cardid = [" + '"' + cardidarray.join('","') + '"' + "]";
  var totext = sqlcardid;
  GM_setClipboard(totext);
  alert("Card ID list complete, Please paste into handler.");
}

function card_desc_download_enable(zEvent) {
  //console.log("card_desc_download_enable");
  $("#scr_progress_bar_show").toggleClass("d-none");
}

function scr_cardback_input_show(zEvent) {
  $("#scr_progress_bar_show").toggleClass("d-none");
}

let get_lua_code = new Promise((resolve, reject) => {
  GM_xmlhttpRequest({
    method: "GET",
    url:
      "https://raw.githubusercontent.com/RoyalShooter/Decklog-To-Tabletop-simulator-script/main/base2",
    headers: {
      "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
      Accept: "application/atom+xml,application/xml,text/xml",
    },
    onload: function (responseDetails) {
      //console.log('Request for Atom feed returned ' + responseDetails.status + ' ' + responseDetails.statusText + '\n\n' +'Feed data:\n' + responseDetails.responseText);
      //console.log(responseDetails.responseText)
      lua_base = responseDetails.responseText;
      //GM_setClipboard (lua_base);
      if (lua_base != "") {
        resolve(lua_base);
      } else {
        reject("err on base lua");
      }
    },
  });
});

function combine() {
  cardback =
    "https://www.tcgcard.tw/wp-content/uploads/2020/05/ws_cardback.png";
  get_lua_code.then((successdata) => {
    lua_base = successdata;
  });
  var lua_top =
    "local testurl = {" +
    urllisttostring +
    "} \n local cardid = {" +
    cardidtostring +
    "} \n local cardname = {" +
    cardtitletostring +
    "} \n local carddesc = {" +
    carddesctostring +
    "} \n local totalnum = '" +
    totalnum +
    "' \n local deckname = '" +
    deckname +
    "' \n local deckdesc = '" +
    deckdesc +
    "' \n local cardBack = '" +
    cardback +
    "'\n";

  var lua = lua_top + "\n" + lua_base;
  GM_setClipboard(lua);
  //alert("Lua code finished, please paste lua in the scripting tab");
  $.bootstrapGrowl("Lua code finished, please paste lua in the scripting tab", {
    type: 'success', // (null, 'info', 'danger', 'success')
    allow_dismiss: true, // If true then will display a cross to close the popup.
    stackup_spacing: 10 // spacing between consecutively stacked growls.
  });
}

function Testbbt(zEvent) {
  alert("Test2");
  //get_card_data("BFR/S78-042");
  var download_desc = $("#scr_progress_bar_show").hasClass("d-none")
if (download_desc == false){
  //alert("do download "+download_desc)
}else{
  //alert("do nothing "+download_desc)
}

}

// TTS somehow can't read special charater, dev said this will be fix in upcomming update, for now this funtion will increase readability
function fix_charater(data){
    return new Promise((resolve, reject) => {
        var text = data ;
    text = text.replace("【", "<")
    text = text.replace("】", ">")
    text = text.replace("（", "(")
    text = text.replace("）", ")")
    text = text.replace("：", ":")
    text = text.replace("。", ".")
    text = text.replace("，", ",")
    text = text.replace("《", "<")
    text = text.replace("》", ">")
    text = text.replace("「", "<")
    text = text.replace("」", ">")
    text = text.replace("【", "<")
    text = text.replace("】", ">")
    text = text.replace("【", "<")
    text = text.replace("】", ">")
    text = text.replace("《", "<")
    text = text.replace("》", ">")
    text = text.replace("「", "<")
    text = text.replace("」", "<")
    text = text.replace("［", "[")
    text = text.replace("］", "]")
    text = text.replace("『", "[")
    text = text.replace("』", "]")
    text = text.replace("＋", "+")
    text = text.replace("。", ".")
    text = text.replace("、", ",")
    text = text.replace("。", ".")
    //console.log(text)
    resolve(text)
  });
}

function escape_charater(data){
    var text = data ;
    text = text.replace('"', ' ')
    text = text.replace("'", " ")

    return(text)
}
