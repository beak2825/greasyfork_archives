// ==UserScript==
// @name       Guzik
// @namespace  https://mongla.net
// @version    6.6.6
// @description jsfoidfsdgs
// @include    https://www.ufs.pt/forum/showthread.php*
// @require    https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382870/Guzik.user.js
// @updateURL https://update.greasyfork.org/scripts/382870/Guzik.meta.js
// ==/UserScript==

(function() {
  var css = ".wheatButton { padding: 5px 10px; display: inline-block; color: black!important; font-size: 11px; font-weight: bold; font-variant: small-caps; text-decoration: none!important; background-color: #606060; border-radius: 2px; cursor: pointer; -webkit-font-smoothing:antialiased;  box-sizing: border-box; box-shadow: -2px 2px 1px black; border: 1px solid #1b1b1b; transition: all 250ms;  } .wheatButton:hover{ background-color: #1b1b1b; color: #d35400!important; box-shadow: -4px 4px 5px black!important; border: 1px solid #606060; transition: all 250ms;}";
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    addStyle(css);
  } else {
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      var node = document.createElement("style");
      node.type = "text/css";
      node.appendChild(document.createTextNode(css));
      heads[0].appendChild(node); 
    }
  }
})();


$(document).ready(function ()
{
  $("<a>",
  {
    "class": "wheatButton",
    text: "Edytuj Pierwszy",
    "id": "PostTwo",
    value: "up",
    type: "button",
    style: "position: fixed; top: 5px; right: 5px;"
  }).appendTo("body"); 
  $("<a>",
  {
    "class": "wheatButton",
    text: "Sprawdzam",
    "id": "sprawdzam",
    value: "up",
    type: "button",
    style: "position: fixed; top: 33px; right: 5px;"
  }).appendTo("body"); 
  $("<a>",
  {
    "class": "wheatButton",
    text: "Zatwierdź",
    "id": "zatwierdz",
    value: "up",
    type: "button",
    style: "position: fixed; top: 61px; right: 5px;"
  }).appendTo("body"); 
  $("<a>",
  {
    "class": "wheatButton",
    text: "Niezatwierdzony",
    "id": "niet",
    value: "up",
    type: "button",
    style: "position: fixed; top: 89px; right: 5px;"
  }).appendTo("body"); 
  $("<a>",
  {
    "class": "wheatButton",
    text: "Usuń 2 Post",
    "id": "stamp",
    value: "up",
    type: "button",
    style: "position: fixed; top: 117px; right: 5px;"
  }).appendTo("body"); 
  $("<a>",
  {
    "class": "wheatButton",
    text: "Przenieś",
    "id": "teleport",
    value: "up",
    type: "button",
    style: "position: fixed; top: 145px; right: 5px;"
  }).appendTo("body"); 
  $("<a>",
  {
    "class": "wheatButton",
    text: "Dodaj Hide",
    "id": "addHide",
    value: "up",
    type: "button",
    style: "position: fixed; top: 173px; right: 5px;"
  }).appendTo("body"); 
  $("<a>",
  {
    "class": "wheatButton",
    text: "HC Up Na Życzenie",
    "id": "zyczenie",
    value: "up",
    type: "button",
    style: "position: fixed; top: 201px; right: 5px;"
  }).appendTo("body"); 

  $('#PostTwo').click(function() {
    testy();
  });
  $('#sprawdzam').click(function() {
    sprawdzam();
  });     $('#zatwierdz').click(function() {
    zatwierdz();
  });     $('#niet').click(function() {
    niet();
  });   $('#stamp').click(function() {
    stamp();
  });
  $('#teleport').click(function() {
    teleport();
  });
  $('#czer').click(function() {
    czer();
  });
  $('#addHide').click(function() {
    addHide();
  });
  $('#zyczenie').click(function() {
  upnazyczenie(); 
  });
  function testy() {
    postie = $(".editpost").first().attr("href");
    window.location.href = postie;
  }
  function sprawdzam(){
    $('.cke_enable_context_menu').last().val('Pacze/moje cyferkicyferkicyferki ' + $("#posts li:first-child").first().attr("id"));
    $('#qr_submit').click()
  }
  function addHide(){
    $(".editpost").first().click()
    setTimeout(
      function() 
      {
        $('.cke_enable_context_menu').first().val(
          function(i,val){
            return '[hide] ' + val;
          });
        $('.cke_enable_context_menu').first().val(
          function(i,val){
            return val + '[/hide]';
          });
      $("input[value='Zapisz']").first().click()
      }, 2000);
}
function czer(){
    $('.cke_enable_context_menu').last().val('[center][img]https://www.ufs.pt/grafika/niezatwierdzone.png[/img][/center]')
    $('#qr_submit').click()
  }
  function zatwierdz(){
    if($(".editpost").length==1) {
      sprawdzam();
      setTimeout(function() { zatwierdz(); }, 2000);
    } else {
     $(".editpost").last().click()
     setTimeout(
       function() 
       {
         $('.cke_enable_context_menu').first().val('[center][img]https://www.ufs.pt/grafika/zatwierdzone.png[/img][/center]')
         $("input[value='Zapisz']").first().click()
       }, 2000);
     }
  }
  function niet(){
    if($(".editpost").length==1) {
      sprawdzam();
      setTimeout(function() { niet(); }, 2000);
    } else {
     $(".editpost").last().click()
     setTimeout(
       function() 
       {
         $('.cke_enable_context_menu').first().val('[center][img]https://www.ufs.pt/grafika/niezatwierdzone.png[/img][/center]')
         $("input[value='Zapisz']").first().click()
       }, 2000);
    }
  }
  function stamp(){
   $(".editpost:eq(1)").last().click()
   setTimeout(
    function() 
    {
     $("input[value='Usuń']").first().click()
     $("input[name='deletepost']").first().click()
     $("input[value='Usuń posta']").first().click()
   }, 2000);
 }
 function teleport(){
  $("a[class='popupctrl']").first().click()
  $("input[value='movethread']").first().click()
  $("input[value='Dalej']").first().click()
}
  function upnazyczenie(){
    const regex = /(showthread\.php\?\d+)/gm;
let m;
var str = ($("h1 .threadtitle a").attr("href"));
let link = [];
while ((m = regex.exec(str)) !== null) {
// This is necessary to avoid infinite loops with zero-width matches
if (m.index === regex.lastIndex) {
regex.lastIndex++;
}

// The result can be accessed through the `m`-variable.
m.forEach((match, groupIndex) => {
console.log(`Found match, group ${groupIndex}: ${match}`);
link.push(match);
});
}
// console.log(link);
// $('.cke_enable_context_menu').first().val('[img]https://www.ufs.pt/forum/images/icons/http.png[/img]' + $("title").text().match(/.*GB/) + ' [url=https://www.ufs.pt/forum/' + ($("h1 .threadtitle a").attr("href")) + ']' + $("h1 .threadtitle a").text() + '[/url]');
$('.cke_enable_context_menu').first().val('[img]https://www.ufs.pt/forum/images/icons/http.png[/img]' + $("title").text().match(/.*GB/) + ' [url=https://www.ufs.pt/forum/' + (link[1]) + ']' + $("h1 .threadtitle a").text() + '[/url]');
  }
})
