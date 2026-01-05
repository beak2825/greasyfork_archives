// ==UserScript==
// @name        Ka3boura++
// @namespace   Hossem dev
// @description m3allem
// @match       http*://ka3boura.tn/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25271/Ka3boura%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/25271/Ka3boura%2B%2B.meta.js
// ==/UserScript==

var script = document.createElement("script");
script.src = "http://wrs.epizy.com/jquery-2.1.3.min.js";
script.src = "http://wrs.epizy.com/metro.js";
document.getElementsByTagName("head")[0].appendChild(script);
setDarkTheme(true);
setNames(true);
$("#nick").val("First ka3boura script :) ");
function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}
addStyleSheet('@import "http://bootswatch.com/paper/bootstrap.css"; @import "http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"; @import "http://wrs.epizy.com/style.css"; @import "http://wrs.epizy.com/test.css"; html * { font-family: Raleway, sans-serif; }'); 

        var alerted = localStorage.getItem('alerted') || '';
        if (alerted != 'yes') {
         alert("Make sure you have the Charts & Stats userscript installed for ingame statistics! Check the description on Greasyfork for more info.");
         localStorage.setItem('alerted','yes');
        }
$(document).ready(function() {
    var region = $("#region");
    if (region.length) {
        $("<br/><div class=\"input-group\"><div class=\"form-group\"><input id=\"serverInput\" class=\"form-control\" placeholder=\"Houni 7ot il ip li t7eb 3liha\" maxlength=\"200\"><span class=\"input-group-btn\"> &<button id=\"connectBtn\" class=\"btn-needs-server btn btn-warning\" style=\"width: 168px\" onclick=\"connect('ws://' + $('#serverInput').val());\" type=\"button\">Join</button><button id=\"connectBtn\" class=\"btn-needs-server btn btn-info\" style=\"width: 80px\" onclick=\"connect('ws://' + $('#serverInput').val());\" type=\"button\"><span class=\"fa fa-lg fa-spin fa-refresh\"></span></button><button id=\"connectBtn\" class=\"btn-needs-server btn btn-success\" style=\"width: 80px\" onclick=\" type=\"button\"><span class=\"fa fa-lg fa-shield\"></span></button> </input></div>").insertAfter("#helloDialog > form > div:nth-child(3)");
        $("h2").replaceWith('<img style="width:330px;margin-bottom:1px;" src="http://i.imgur.com/6a0s9uq.png" >');
        $("#adsBottomInner").remove();
        $(".adsbygoogle").replaceWith('<img style="width:330px;margin-bottom:5px;" class="butt " src="http://i.imgur.com/m26Ns87.png" >');
        					setTimeout(function(){
                                   $.Notify({type: 'alert', caption: 'Hi ;) ', content: "Have nice mass !", icon: "<img src='http://fontmeme.com/permalink/161130/97a06fa9b48a21d8425a2fa725112538.png'></img>"});
                            }, 5000);
							setTimeout(function(){
                                $.Notify({keepOpen: true, type: 'success', caption: 'Contact ', content: "Ask Hossem for any issues in this script", icon: "<img src='http://fontmeme.com/permalink/161130/97a06fa9b48a21d8425a2fa725112538.png'></img>"});
                            }, 15000);
    }
});

var elmDeleted = document.getElementById("instructions");
	elmDeleted.parentNode.removeChild(elmDeleted);
 WebFontConfig = {
    google: { families: [ 'Raleway::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];

  })();
