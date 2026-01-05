// ==UserScript==
// @name       Koszowiec
// @namespace  http://mongla.net
// @description gisopdjfgopsd
// @version    2.1.6
// @include    http://www.ufs.pt/forum/postings.php*
// @include    http://www.ufs.pt/forum/inlinemod.php*
// @require   http://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24407/Koszowiec.user.js
// @updateURL https://update.greasyfork.org/scripts/24407/Koszowiec.meta.js
// ==/UserScript==

(function() {
    var css = "@import url(https://fonts.googleapis.com/css?family=Roboto:300,500&subset=latin-ext);@import url(https://fonts.googleapis.com/icon?family=Material+Icons);.ufs-mod{position:fixed;top:0;right:0;width:40px;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:all ease-out 0.1s}.width{width:390px;transition:all ease-in 0.1s}.ufs-mod_desc{position:relative;width:360px;height:100%;background:#1b1b1b;margin:0 0 0 30px;padding:0;box-shadow:0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22);overflow-y:auto;transition:all ease-in 0.2s}.ufs-mod_container{box-sizing:border-box;display:flex;flex-flow:row wrap;justify-content:center;align-content:center;align-items:center;font-family:'Roboto';margin:30px auto;text-align:center}.ufs-mod_flex_wrap-first,.ufs-mod_flex_wrap{display:flex;width:90%;justify-content:center;background:#222}.ufs-mod_button{display:inline-block;position:relative;flex:1 auto;height:36px;width:auto;border-radius:2px;font-size:14px;font-weight:500;line-height:36px;text-align:center;text-decoration:none;text-transform:uppercase;overflow:hidden;vertical-align:middle;cursor:pointer;box-sizing:border-box;-webkit-appearance:none;background:#222;color:rgba(255,255,255,.47);transition:all ease-in-out .2s}.ufs-mod_button:hover{color:rgba(254,128,3,.57);transition:all ease-in-out 0.2s}.ufs-mod_dropdown_title{display:flex;justify-content:flex-end;align-content:flex-end;position:relative;color:rgba(254,128,3,.57);font-family:'Impact',sans-serif;font-size:18px;letter-spacing:3px;font-weight:400;text-transform:uppercase;line-height:36px;width:90%;overflow:hidden;cursor:pointer;transition:all ease-in-out .2s}.ufs-mod_dropdown_title:hover{color:rgba(255,255,255,.57);transition:all ease-in-out 0.2s}.ufs-mod_button-circle{position:absolute;bottom:20%;left:0;width:50px;height:50px;cursor:pointer;font-size:48px;color:rgba(255,255,255,.57);z-index:10}.material-ripple{position:relative;overflow:hidden;cursor:pointer;user-select:none}.material-ripple>span{position:relative;display:block;padding:15px 25px}.material-ink{position:absolute;background:#bdc3c7;border-radius:50%;transform:scale(0);opacity:.4}.material-ink.animate{animation:ripple ease-in 375ms}@keyframes ripple{100%{transform:scale(3,3);opacity:0}}";
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

$(document).ready(function () {	
                  $('<aside class="ufs-mod" id="ufs-mod"><div class="ufs-mod_button-circle ufs-mod_material_ripple material-icons">reply_all</div><section class="ufs-mod_desc"><div class="ufs-mod_container"><div class="ufs-mod_flex_wrap-first"><div class="ufs-mod_button ufs-mod_material_ripple" id="req">REQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="kont">Kosz Kont</div><div class="ufs-mod_button ufs-mod_material_ripple" id="kosz">Kosz</div></div><div class="ufs-mod_flex_wrap-first"><div class="ufs-mod_button ufs-mod_material_ripple" id="niezatwierdzony">niezatwierdzone</div><div class="ufs-mod_button ufs-mod_material_ripple" id="dubel">Dubel</div><div class="ufs-mod_button ufs-mod_material_ripple" id="udp">Poprawa</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="gry">Gry</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="grypl">PC PL</div><div class="ufs-mod_button ufs-mod_material_ripple" id="gryeng">PC ENG</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ps3">PlayStation 3</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="psx">PlayStation 1</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ps2">PlayStation 2</div><div class="ufs-mod_button ufs-mod_material_ripple" id="linux">Mac / Linux</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="psp">PSP</div><div class="ufs-mod_button ufs-mod_material_ripple" id="x360">XBOX 360</div><div class="ufs-mod_button ufs-mod_material_ripple" id="jottag">JTAG / RGH</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmy">FILMY</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="pl">Polskie</div><div class="ufs-mod_button ufs-mod_material_ripple" id="lek">LEK/DUB</div><div class="ufs-mod_button ufs-mod_material_ripple" id="eng">ENG HQ</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="doku">Dokumentalne</div><div class="ufs-mod_button ufs-mod_material_ripple" id="anime">Anime</div><div class="ufs-mod_button ufs-mod_material_ripple" id="anim">Animowane</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="rmvb">RMVB</div><div class="ufs-mod_button ufs-mod_material_ripple" id="dvdr">DVD-R</div><div class="ufs-mod_button ufs-mod_material_ripple" id="kab">Kabarety</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="x265">x265</div><div class="ufs-mod_button ufs-mod_material_ripple" id="trzy">3D</div><div class="ufs-mod_button ufs-mod_material_ripple" id="hd">720 / 1080</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="cam">Cam / TS</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sprt">Sport</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="seriale">SERIALE</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sezon">Sezony</div><div class="ufs-mod_button ufs-mod_material_ripple" id="poj">Odcinki</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sanime">Seriale Anime</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="muza">MUZYKA</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="techno">Techno</div><div class="ufs-mod_button ufs-mod_material_ripple" id="pop">POP</div><div class="ufs-mod_button ufs-mod_material_ripple" id="rap">Hip-Hop</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="skldanki">Sk&lstrok;adanki</div><div class="ufs-mod_button ufs-mod_material_ripple" id="soundtrack">Soundtrack</div><div class="ufs-mod_button ufs-mod_material_ripple" id="regge">Regge</div><div class="ufs-mod_button ufs-mod_material_ripple" id="metal">Rock</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="programy">PROGRAMY</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="syst">Systemy</div><div class="ufs-mod_button ufs-mod_material_ripple" id="bezpiec">Bezpiecze&nacute;stwo</div><div class="ufs-mod_button ufs-mod_material_ripple" id="grafika">Grafika</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="multimedia">Multimedia</div><div class="ufs-mod_button ufs-mod_material_ripple" id="internet">Internet</div><div class="ufs-mod_button ufs-mod_material_ripple" id="edukacja">Edukacja</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="biuro">Biuro</div><div class="ufs-mod_button ufs-mod_material_ripple" id="narzedzia">Narz&eogon;dzia</div><div class="ufs-mod_button ufs-mod_material_ripple" id="innene">Inne</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="porno">PORNO</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="prnoclip">XXX HD</div><div class="ufs-mod_button ufs-mod_material_ripple" id="prnofull">XXX LQ</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="inne">INNE</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="kursy">Kursy</div><div class="ufs-mod_button ufs-mod_material_ripple" id="eksiazki">E-Ksi&aogon;&zdot;ki</div><div class="ufs-mod_button ufs-mod_material_ripple" id="egazety">E-Gazety</div><div class="ufs-mod_button ufs-mod_material_ripple" id="gsm">GSM / PDA</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="ezagraniczne">E-Zagraniczne</div><div class="ufs-mod_button ufs-mod_material_ripple" id="audbok">Audiobooki</div><div class="ufs-mod_button ufs-mod_material_ripple" id="otrs">Inne</div></div></div></section></aside>').appendTo('body');        

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

$('#otrs').click( function() {
	$("select[id='destforumid']").val("124");
	$("input.button").first().click();
});
$('#audbok').click( function() {
	$("select[id='dest$forumid']").val("454");
	$("input.button").first().click();
});
$('#ezagraniczne').click( function() {
	$("select[id='destforumid']").val("810");
	$("input.button").first().click();
});
$('#egazety').click( function() {
	$("select[id='destforumid']").val("809");
	$("input.button").first().click();
});
$('#eksiazki').click( function() {
	$("select[id='destforumid']").val("808");
	$("input.button").first().click();
});
$('#kursy').click( function() {
	$("select[id='destforumid']").val("19");
	$("input.button").first().click();
});
$('#gsm').click( function() {
	$("select[id='destforumid']").val("286");
	$("input.button").first().click();
});
$('#prnoclip').click( function() {
	$("select[id='destforumid']").val("145");
	$("input.button").first().click();
});
$('#prnofull').click( function() {
	$("select[id='destforumid']").val("17");
	$("input.button").first().click();
});
$('#innene').click( function() {
	$("select[id='destforumid']").val("578");
	$("input.button").first().click();
});
$('#narzedzia').click( function() {
	$("select[id='destforumid']").val("579");
	$("input.button").first().click();
});
$('#biuro').click( function() {
	$("select[id='destforumid']").val("577");
	$("input.button").first().click();
});
$('#edukacja').click( function() {
	$("select[id='destforumid']").val("576");
	$("input.button").first().click();
});
$('#internet').click( function() {
	$("select[id='destforumid']").val("575");
	$("input.button").first().click();
});
$('#multimedia').click( function() {
	$("select[id='destforumid']").val("571");
	$("input.button").first().click();
});
$('#grafika').click( function() {
	$("select[id='destforumid']").val("572");
	$("input.button").first().click();
});
$('#bezpiec').click( function() {
	$("select[id='destforumid']").val("573");
	$("input.button").first().click();
});
$('#syst').click( function() {
	$("select[id='destforumid']").val("574");
	$("input.button").first().click();
});
$('#metal').click( function() {
	$("select[id='destforumid']").val("172");
	$("input.button").first().click();
});
$('#regge').click( function() {
	$("select[id='destforumid']").val("174");
	$("input.button").first().click();
});
$('#soundtrack').click( function() {
	$("select[id='destforumid']").val("173");
	$("input.button").first().click();
});
$('#skldanki').click( function() {
	$("select[id='destforumid']").val("177");
	$("input.button").first().click();
});
$('#rap').click( function() {
	$("select[id='destforumid']").val("171");
	$("input.button").first().click();
});
$('#pop').click( function() {
	$("select[id='destforumid']").val("123");
	$("input.button").first().click();
});
$('#techno').click( function() {
	$("select[id='destforumid']").val("15");
	$("input.button").first().click();
});
$('#sprt').click( function() {
	$("select[id='destforumid']").val("220");
	$("input.button").first().click();
});
$('#kab').click( function() {
	$("select[id='destforumid']").val("265");
	$("input.button").first().click();
});
$('#dvdr').click( function() {
	$("select[id='destforumid']").val("182");
	$("input.button").first().click();
});
$('#rmvb').click( function() {
	$("select[id='destforumid']").val("116");
	$("input.button").first().click();
});
$('#jottag').click( function() {
	$("select[id='destforumid']").val("756");
	$("input.button").first().click();
});
$('#x360').click( function() {
	$("select[id='destforumid']").val("256");
	$("input.button").first().click();
});
$('#psp').click( function() {
	$("select[id='destforumid']").val("169");
	$("input.button").first().click();
});
$('#linux').click( function() {
	$("select[id='destforumid']").val("766");
	$("input.button").first().click();
});
$('#ps3').click( function() {
	$("select[id='destforumid']").val("585");
	$("input.button").first().click();
});
$('#ps2').click( function() {
	$("select[id='destforumid']").val("168");
	$("input.button").first().click();
});
$('#psx').click( function() {
	$("select[id='destforumid']").val("195");
	$("input.button").first().click();
});
$('#req').click( function() {
	$("select[id='destforumid']").val("490");
	$("input.button").first().click();
});
$('#pl').click(function() {
	$("select[id='destforumid']").val("52");
	$("input.button").first().click();
});
$('#lek').click(function() {
	$("select[id='destforumid']").val("51");
	$("input.button").first().click();
});
$('#cam').click(function() {
	$("select[id='destforumid']").val("165");
	$("input.button").first().click();
});
$('#eng').click(function() {
	$("select[id='destforumid']").val("166");
	$("input.button").first().click();
});
$('#anim').click(function() {
	$("select[id='destforumid']").val("126");
	$("input.button").first().click();
});
$('#anime').click(function() {
	$("select[id='destforumid']").val("392");
	$("input.button").first().click();
});
$('#hd').click(function()  {
	$("select[id='destforumid']").val("167");
	$("input.button").first().click();
});
$('#x265').click(function()  {
	$("select[id='destforumid']").val("804");
	$("input.button").first().click();
});
$('#trzy').click(function()  {
	$("select[id='destforumid']").val("725");
	$("input.button").first().click();
});
$('#doku').click(function() {
	$("select[id='destforumid']").val("512");
	$("input.button").first().click();
});
$('#sezon').click(function() {
	$("select[id='destforumid']").val("122");
	$("input.button").first().click();
});
$('#poj').click(function()  {
	$("select[id='destforumid']").val("54");
	$("input.button").first().click();
});
$('#sanime').click(function() {
	$("select[id='destforumid']").val("755");
	$("input.button").first().click();
});
$('#grypl').click(function()  {
	$("select[id='destforumid']").val("271");
	$("input.button").first().click();
});
$('#gryeng').click(function()  {
	$("select[id='destforumid']").val("274");
	$("input.button").first().click();
});
$('#kosz').click(function() {
	$("select[id='destforumid']").val("21");
	$("input.button").first().click();
});
$('#udp').click(function()  {
	$("select[id='destforumid']").val("132");
	$("input.button").first().click();
});
$('#niezatwierdzony').click(function()  {
	$("select[id='destforumid']").val("507");
	$("input.button").first().click();
});
$('#dubel').click(function()  {
	$("select[id='destforumid']").val("501");
	$("input.button").first().click();
});
$('#kont').click(function()  {
	$("select[id='destforumid']").val("176");
	$("input.button").first().click();
});
   });