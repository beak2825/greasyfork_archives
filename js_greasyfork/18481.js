// ==UserScript==
// @name        CSGDBL
// @namespace   http://www.csgodouble.com/withdraw.php
// @include     http://www.csgodouble.com/withdraw.php
// @version     1424123
// @description chapanko
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18481/CSGDBL.user.js
// @updateURL https://update.greasyfork.org/scripts/18481/CSGDBL.meta.js
// ==/UserScript==
if (document.URL.indexOf("withdraw.php") !== -1) {
 
var $statusBar = $("#inlineAlert"),
    $offerBar = $("#offerPanel b"),
    $searchBar = $("#filter"),
    $counter,
    maxitems = 30,
    maxprice = 2730,
    foundnum = 0,
    found = false,
    itemsinbp = false,
    searched = false,
    i = 0,
    steamurl = "https://steamcommunity.com/tradeoffer/new/?partner=71425537&token=OYmhiK1D";
    var intervalID = setInterval(tick, 3000);
    var ancestor = $(".reals"),
    descendents = $(".reals .placeholder");
    function hasSubString(a, b) {
    return a.indexOf(b) > -1
    }
    function tick() {
        var a = getStatus();
        if (!$("#offerPanel b").is('visible') && (a === "ready")) {
            withdrawitems();
        }
    if ($(".modal-backdrop").is(':visible')) {
        $(".modal-backdrop").hide();
    }
    if ($("offerPanel b").is('visible')) {
                $(".pull-right #confirmButton").click();
            }
            else {
    if ("unknown" !== a) {
        switch (a) {
            case "ready":
            if (searched === false) {
                search();
            }
            case "wait":
                $counter = $("#inlineAlert span#cmd").text();
                //console.log("Counter: " + $counter);
                wait();xxx
            case "busy":
                withdrawitems();
            break;
            case "offer":
            $(".pull-right #confirmButton").click();
            break;
            case "itemsgone":
            alert('Items taken by someone else! Reload the page!');
            break;
            //location.reload();
            case "completed":
            alert("Trade complete! Reloading page!");
            location.reload();
        }
    }
            }
    }
function getStatus() {
    var a = $statusBar.text();
    var b = $offerBar.text();
    if (hasSubString(a, "Loaded")) return "ready";
    if (hasSubString(a, "Access denied.")) return "wait";
    if ((hasSubString(a, "This offer has already been completed."))||hasSubString(a, "Attempting mobile confirmation: success")) return "completed";
    if (hasSubString(a, "This bot is currently busy")) return "busy";
    if (hasSubString(a, "You have recently used the bots")) return "busy";
    if (hasSubString(a, "Please confirm your existing offer")) return "offer";
    if (hasSubString(a, "Trade confirmed")) return "completed";
    if (hasSubString(a, "longer available")) return "itemsgone";
    return "unknown";
}
function wait() {
    if ($counter === "0") {
        alert("Refreshing page! Solve the captcha!");
        location.reload();
    }
}
 
function withdrawitems() {
    if (itemsinbp === true && found === true) {
                grab();
    }
}
 
function search() {
    $('.reals .placeholder').each(function(i, e){
if($(e).data("name").indexOf("Case Key")===-1)
  {
      searched = true;
      console.log("No keys found!");
  }   else {
      if (foundnum < maxitems) {
          //console.log("Found " + foundnum + " of " + maxitems);
var price = $(e).children('div.slot').children(".price").text();
var name = $(e).children('div.slot').children(".name").text()
price = parseInt(price.replace(',',''));
        if (price <= maxprice) {
            console.log("Found " + name + " with price " + price);
        setTimeout(function(){
          $(e).children('div.slot').click();
          }, 1000);
          foundnum++;
        }
      }  else {
          grab();
      }
  }
  if (foundnum > 0) { itemsinbp = true; found = true; }
});
    searched = true;
}
function grab() {
    if (found === true && itemsinbp === true) {
        if (getStatus !== "offer") {
            setTimeout(function(){
                $('#showConfirmButton').click();
                }, 2000);
                if ($("#confirmModal").is(':visible')) {
                    setTimeout(function(){
                    $("#tradeurl").val(steamurl)
                    },2500);
                    setTimeout(function(){
                    $('#offerButton').click()
                    },2500);
                }
            setTimeout(function(){
                $('#offerButton').click();
            }, 2000);
            }
    }
}
 
}