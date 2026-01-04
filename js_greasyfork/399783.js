// ==UserScript==
// @name       Koszowiec
// @namespace  http://mongla.net
// @description gisopdjfgopsd
// @version    6.6.6
// @include    https://www.ufs.pt/forum/postings.php*
// @include    https://www.ufs.pt/forum/inlinemod.php*
// @require   http://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/399783/Koszowiec.user.js
// @updateURL https://update.greasyfork.org/scripts/399783/Koszowiec.meta.js
// ==/UserScript==

(function() {
    var css = "@import url(https://fonts.googleapis.com/css?family=Roboto:300,500&subset=latin-ext);@import url(https://fonts.googleapis.com/icon?family=Material+Icons);.ufs-mod{position:fixed;top:0;right:0;width:40px;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:all ease-out 0.1s}.width{width:390px;transition:all ease-in 0.1s}.ufs-mod_desc{position:relative;width:360px;height:100%;background:#1b1b1b;margin:0 0 0 30px;padding:0;box-shadow:0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22);overflow-y:auto;transition:all ease-in 0.2s}.ufs-mod_container{box-sizing:border-box;display:flex;flex-flow:row wrap;justify-content:center;align-content:center;align-items:center;font-family:'Roboto';margin:30px auto;text-align:center}.ufs-mod_flex_wrap-first,.ufs-mod_flex_wrap{display:flex;width:90%;justify-content:center;background:#222}.ufs-mod_button{display:inline-block;position:relative;flex:1 auto;height:36px;width:auto;border-radius:2px;font-size:14px;font-weight:500;line-height:36px;text-align:center;text-decoration:none;text-transform:uppercase;overflow:hidden;vertical-align:middle;cursor:pointer;box-sizing:border-box;-webkit-appearance:none;background:#222;color:rgba(255,255,255,.47);transition:all ease-in-out .2s}.ufs-mod_button:hover{color:rgba(254,128,3,.57);transition:all ease-in-out 0.2s}.ufs-mod_dropdown_title{display:flex;justify-content:flex-end;align-content:flex-end;position:relative;color:rgba(254,128,3,.57);font-family:'Impact',sans-serif;font-size:18px;letter-spacing:3px;font-weight:400;text-transform:uppercase;line-height:36px;width:90%;overflow:hidden;cursor:pointer;transition:all ease-in-out .2s}.ufs-mod_dropdown_title:hover{color:rgba(255,255,255,.57);transition:all ease-in-out 0.2s}.ufs-mod_button-circle{position:absolute;bottom:20%;left:0;width:50px;height:50px;cursor:pointer;font-size:48px;color:rgba(255,255,255,.57);z-index:10}.material-ripple{position:relative;overflow:hidden;cursor:pointer;user-select:none}.material-ripple>span{position:relative;display:block;padding:15px 25px}.material-ink{position:absolute;background:#bdc3c7;border-radius:50%;transform:scale(0);opacity:.4}.material-ink.animate{animation:ripple ease-in 375ms}@keyframes ripple{100%{transform:scale(3,3);opacity:0}}";
    if (typeof GM_addStyle != "undefined") {
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

$(document).ready(function () {
                  $('<aside class="ufs-mod" id="ufs-mod"><div class="ufs-mod_button-circle ufs-mod_material_ripple material-icons">reply_all</div><section class="ufs-mod_desc"><div class="ufs-mod_container"><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="koszyk">Kosz</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="kosz">Kosz</div><div class="ufs-mod_button ufs-mod_material_ripple" id="htp">Kosz HTTP</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="spr">Sprawdzanie</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="req">REQ Wykonany</div><div class="ufs-mod_button ufs-mod_material_ripple" id="nok">NOK</div><div class="ufs-mod_button ufs-mod_material_ripple" id="noktr">NOK Trial</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="dubel">Dubel</div><div class="ufs-mod_button ufs-mod_material_ripple" id="udp">Poprawa</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="gry">Gry</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="grypl">PC PL</div><div class="ufs-mod_button ufs-mod_material_ripple" id="gryeng">PC ENG</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmypl">Filmy Polskie</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="plhq">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="pl720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="pl1080">1080p</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmyld">Filmy Lektor&Dubbing</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="lekhq">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="lek720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="lek1080">1080p</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmyz">Filmy Zagraniczne</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="zag">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="zag720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="zag1080">1080p</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmya">Anime|Animowane|Bajki</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="anihq">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ani720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ani1080">1080p</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmyp">Filmy Pozostałe | Sport</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="trzy">3D</div><div class="ufs-mod_button ufs-mod_material_ripple" id="cztery">4K</div><div class="ufs-mod_button ufs-mod_material_ripple" id="dvdr">DVD-R</div><div class="ufs-mod_button ufs-mod_material_ripple" id="doku">Dokumentalne</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="kab">Kabarety | Stand-up</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sport">Sport</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="serialepl">Seriale W Trakcie</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sezwt">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezwt720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezwt1080">1080p</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="serialepl">Seriale Sezony Polskie</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sezpl">HQ</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="serialeld">Seriale Sezony Lektor&Dub</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sezld">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezld720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezld1080">1080p</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="serialezag">Seriale Sezony Zagraniczne</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sezzag">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezzag720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezzag1080">1080p</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="serialeinne">SERIALE INNE</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sinne">Inne</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sanime">Anime | Animowane | Bajki</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="muza">MUZYKA</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="muzyka">Muzyka</div><div class="ufs-mod_button ufs-mod_material_ripple" id="flac">FLAC</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="programy">PROGRAMY</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="prog">Programy</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="porno">PORNO</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="pornohq">XXX HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="pornohd">XXX HD</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="inne">INNE</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="kursy">Kursy</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ebook">E-Book</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="audbok">Audiobook</div><div class="ufs-mod_button ufs-mod_material_ripple" id="otrs">Inne</div></div></div></section></aside>').appendTo('body');

$(".ufs-mod_material_ripple").click(function(event) {
	var surface = $(this);
	if (surface.find(".material-ink").length === 0) {
		surface.prepend("<div class='material-ink'></div>");
	}
	var ink = surface.find(".material-ink");
	ink.removeClass("animate");
	if (!ink.height() && !ink.width()) {
		var diameter = Math.max(surface.outerWidth(), surface.outerHeight());
		ink.css({ height: diameter, width: diameter });
	}
	var xPos = event.pageX - surface.offset().left - ink.width() / 2;
	var yPos = event.pageY - surface.offset().top - ink.height() / 2;
	var rippleColor = surface.css("color");
	ink
		.css({
			top: yPos + "px",
			left: xPos + "px",
			background: rippleColor
		})
		.addClass("animate");
});
$(".ufs-mod_dropdown_title").click(function() {
	$(this).nextUntil(".ufs-mod_dropdown_title").slideToggle();
});

	$(".ufs-mod_flex_wrap").hide();
	$(".ufs-mod").toggleClass("width");
$(".ufs-mod_button-circle").click(function() {
	$(".ufs-mod").toggleClass("width");
});

$('#kosz').click(function() {
	$("select[id='destforumid']").val("21");
	$("input.button").first().click();
});
$('#htp').click(function() {
	$("select[id='destforumid']").val("915");
	$("input.button").first().click();
});
$('#kont').click(function()  {
	$("select[id='destforumid']").val("176");
	$("input.button").first().click();
});
$('#req').click( function() {
	$("select[id='destforumid']").val("490");
	$("input.button").first().click();
});
$('#nok').click(function()  {
	$("select[id='destforumid']").val("507");
	$("input.button").first().click();
});
$('#noktr').click(function()  {
	$("select[id='destforumid']").val("493");
	$("input.button").first().click();
});
$('#dubel').click(function()  {
	$("select[id='destforumid']").val("501");
	$("input.button").first().click();
});
$('#udp').click(function()  {
	$("select[id='destforumid']").val("132");
	$("input.button").first().click();
});
$('#grypl').click(function()  {
	$("select[id='destforumid']").val("865");
	$("input.button").first().click();
});
$('#gryeng').click(function()  {
	$("select[id='destforumid']").val("866");
	$("input.button").first().click();
});
$('#plhq').click(function() {
	$("select[id='destforumid']").val("868");
	$("input.button").first().click();
});
$('#pl720').click(function() {
	$("select[id='destforumid']").val("869");
	$("input.button").first().click();
});
$('#pl1080').click(function() {
	$("select[id='destforumid']").val("870");
	$("input.button").first().click();
});
$('#lekhq').click(function() {
	$("select[id='destforumid']").val("871");
	$("input.button").first().click();
});
$('#lek720').click(function() {
	$("select[id='destforumid']").val("872");
	$("input.button").first().click();
});
$('#lek1080').click(function() {
	$("select[id='destforumid']").val("873");
	$("input.button").first().click();
});
$('#zag').click(function() {
	$("select[id='destforumid']").val("874");
	$("input.button").first().click();
});
$('#zag720').click(function() {
	$("select[id='destforumid']").val("875");
	$("input.button").first().click();
});
$('#zag1080').click(function() {
	$("select[id='destforumid']").val("876");
	$("input.button").first().click();
});
$('#anihq').click(function() {
	$("select[id='destforumid']").val("877");
	$("input.button").first().click();
});
$('#ani720').click(function() {
	$("select[id='destforumid']").val("878");
	$("input.button").first().click();
});
$('#ani1080').click(function() {
	$("select[id='destforumid']").val("879");
	$("input.button").first().click();
});
$('#trzy').click(function()  {
	$("select[id='destforumid']").val("881");
	$("input.button").first().click();
});
$('#cztery').click(function()  {
	$("select[id='destforumid']").val("882");
	$("input.button").first().click();
});
$('#dvdr').click( function() {
	$("select[id='destforumid']").val("883");
	$("input.button").first().click();
});
$('#doku').click(function() {
	$("select[id='destforumid']").val("884");
	$("input.button").first().click();
});
$('#kab').click( function() {
	$("select[id='destforumid']").val("885");
	$("input.button").first().click();
});
$('#sport').click( function() {
	$("select[id='destforumid']").val("886");
	$("input.button").first().click();
});
$('#sezwt').click(function() {
	$("select[id='destforumid']").val("888");
	$("input.button").first().click();
});
$('#sezwt720').click(function() {
	$("select[id='destforumid']").val("889");
	$("input.button").first().click();
});
$('#sezwt1080').click(function() {
	$("select[id='destforumid']").val("890");
	$("input.button").first().click();
});
$('#sezpl').click(function() {
	$("select[id='destforumid']").val("892");
	$("input.button").first().click();
});
$('#sezld').click(function() {
	$("select[id='destforumid']").val("893");
	$("input.button").first().click();
});
$('#sezld720').click(function() {
	$("select[id='destforumid']").val("894");
	$("input.button").first().click();
});
$('#sezld1080').click(function() {
	$("select[id='destforumid']").val("895");
	$("input.button").first().click();
});
$('#sezzag').click(function() {
	$("select[id='destforumid']").val("896");
	$("input.button").first().click();
});
$('#sezzag720').click(function() {
	$("select[id='destforumid']").val("897");
	$("input.button").first().click();
});
$('#sezzag1080').click(function() {
	$("select[id='destforumid']").val("898");
	$("input.button").first().click();
});
$('#sanime').click(function() {
	$("select[id='destforumid']").val("899");
	$("input.button").first().click();
});
$('#sinne').click(function()  {
	$("select[id='destforumid']").val("900");
	$("input.button").first().click();
});
$('#muzyka').click( function() {
	$("select[id='destforumid']").val("901");
	$("input.button").first().click();
});
$('#flac').click( function() {
	$("select[id='destforumid']").val("902");
	$("input.button").first().click();
});
$('#prog').click( function() {
	$("select[id='destforumid']").val("903");
	$("input.button").first().click();
});
$('#pornohq').click( function() {
	$("select[id='destforumid']").val("904");
	$("input.button").first().click();
});
$('#pornohd').click( function() {
	$("select[id='destforumid']").val("905");
	$("input.button").first().click();
});
$('#kursy').click( function() {
	$("select[id='destforumid']").val("907");
	$("input.button").first().click();
});
$('#ebook').click( function() {
	$("select[id='destforumid']").val("908");
	$("input.button").first().click();
});
$('#audbok').click( function() {
	$("select[id='destforumid']").val("911");
	$("input.button").first().click();
});
$('#otrs').click( function() {
	$("select[id='destforumid']").val("912");
	$("input.button").first().click();
});
   });