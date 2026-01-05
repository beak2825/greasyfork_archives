// ==UserScript==
// @name				Better IndustrieTycoon Lite
// @namespace			https://greasyfork.org/users/5864
// @description			Add more Usability, reorganize Navigation, add helping Boxes (Ruf, HLT) [ IndustrieTycoon Industrie Tycoon IT IT2 Lite Light]
// @include				http://*.itycoon2.de/*
// @exclude				http://forum.itycoon2.de/*
// @icon				http://abload.de/img/itlitelogolcsfh.jpg
// @version				1.38
// @grant				none
// @require				http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @copyright			2015+, guckguck
// @downloadURL https://update.greasyfork.org/scripts/16034/Better%20IndustrieTycoon%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/16034/Better%20IndustrieTycoon%20Lite.meta.js
// ==/UserScript==

//	Settings
url_offset_bit = 22;
show_vote_bit = true;			//	Show Votebox
show_userad_bit = true;			//	Show User Advertising, if there is one
build_button_modify = false;	//	false = hide Building Speedup Buttons completely, 'true' = smaller Buttons
box_halt_show_bit = true;		//	true = add Expiry Box to Navigation
box_ruf_show_bit = true;		//	true = add Reputation Box to Navigation


var vipcheck_bit = $( '#avatar > ul > li > a[href="/vip"]' ).text().substr(0,8);
if ( vipcheck_bit == 'VIP bis ' && $( '#travel_vip > form > input#town_submit' ).attr('value') == 'Sofortreise') {
	var vip_bit = true;
} else {
	var vip_bit = false;
}

$( 'script[src^="/javascripts/clock.js?"]' ).remove();

var vip_width_bit = (vip_bit ? '45' : '0');
var width_bit = Math.floor(Math.max((document.body.offsetWidth*0.95)-vip_width_bit,1000));
$('body').css('paddingRight', '0px');
$('#wrap').width(width_bit);
$('div.content').width(width_bit-220);
if (vip_bit) $('#vip_navigation').css('left', 20+width_bit+'px');
$('#footer').css('left', '0px');


if(!show_userad_bit || $('div#user_advertising u').text() == 'Hier kÃ¶nnte deine Werbung stehen!') $( '#user_advertising' ).hide(); // hide Useradvertising
if(!show_vote_bit) $( '#vote' ).hide();

$( 'div#main > div.boxes' ).prepend( $( '#supremacy' ) );
$( 'div#main > div.boxes' ).prepend( $( 'div#user_advertising' ) );
$( 'div#main > div.boxes' ).prepend( $( 'div#stats' ) );
$( 'div#main > div.boxes' ).prepend( $( 'div#internal_links' ) );
$( 'div#main > div.boxes' ).prepend( $( 'div#information' ) );
$( 'div#main > div.boxes' ).prepend( $( 'div#travel_vip' ) );
$( 'div#main > div.boxes' ).prepend( $( 'div#company' ) );
$( 'div#main > div.boxes' ).prepend( $( 'div#avatar' ) );
$( 'div#main > div.boxes' ).prepend( $( 'div#new_messages' ) );
$( 'div#company > ul.information' ).append( $( '#internal_links > ul > li.last_entry' ) );

$( '#clock' ).before(' - ');
$('#time').css('font-size', '16px');
if (window.location.href.substr(url_offset_bit+0,19) == '/building/messages/') {
	$( 'tr:contains(" produziert und ins Lager geliefert.")' ).css({'color': '#a0a0a0', 'font-style': 'italic' });
}

if ( $( '#company img[src*="/images/icons/bullet_go.png"]' ).length == '1' ){
	var concernlink_bit = '<a href="/chat/concern/chat-button"><img alt="Konzernboard" class="icon" src="/images/icons/pencil.png" title="Konzernboard" border="false"></a>';
	$( '#company img[src*="/images/icons/bullet_go.png"]' ).parents().eq(1).append(concernlink_bit);
}

if (window.location.href.substr(url_offset_bit+0,22) == '/product_info/details/') {
	$( '#chart_product_info' ).insertBefore( $( 'div.body > div.back_button' ) );
}

if (window.location.href.substr(url_offset_bit+0,18) == '/message/inbox?to=') {
	$( 'div.body' ).append( '<hr>' );
	$( 'div.body' ).append( $( 'h2:contains("Posteingang")' ) );
	$( 'div.body' ).append( $( 'div.body > p' ) );
	$( 'div.body' ).append( $( 'div.body > div.ca' ) );	
	$( 'div.body' ).append( $('form[action="/message/destroy"]') );
}

if (window.location.href.substr(url_offset_bit+0,9) == '/message/') {
	$( 'p.small:gt(1):not(:contains("Zeichen"))' ).hide();
	
	$( 'input#the_message_submit' ).after( "<br><div id='mtable_bit'><div id='mtable_1_bit' class='mtable_bit'></div><div id='mtable_2_bit' class='mtable_bit'><p>&nbsp;</p></div><div id='mtable_3_bit' class='mtable_bit'></div><div id='mtable_4_bit' class='mtable_bit'></div></div>" );
	$( '.mtable_bit' ).css('display', 'inline-block');
	$( '.mtable_bit' ).css("margin","10px");

	$( '#mtable_1_bit' ).append($( '<p class="small"><strong>Textformatierungen</strong></p>' ) );
	$( '#mtable_1_bit' ).append($( '<p class="small">*Fett*</p>' ) );
	$( '#mtable_1_bit' ).append($( '<p class="small">_Kursiv_</p>' ) );
	$( '#mtable_2_bit' ).append($( '<p class="small">+Unterstrichen+</p>' ) );
	$( '#mtable_2_bit' ).append($( '<p class="small">\"Link\":http://url.tld</p>' ) );
	$( '#mtable_3_bit' ).append($( '<p class="small"><strong>Unsortierte Liste</strong></p>' ) );
	$( '#mtable_3_bit' ).append($( '<p class="small">* Listeneintrag 1</p>' ) );
	$( '#mtable_3_bit' ).append($( '<p class="small">* Listeneintrag 2</p>' ) );
	$( '#mtable_4_bit' ).append($( '<p class="small"><strong>Sortierte Liste</strong></p>' ) );
	$( '#mtable_4_bit' ).append($( '<p class="small"># Listeneintrag 1</p>' ) );
	$( '#mtable_4_bit' ).append($( '<p class="small"># Listeneintrag 2</p>' ) );
}


if (window.location.href.substr(url_offset_bit+0,1000) == '/building') {
	if (build_button_modify) {
		//	smaller Buttons
		$('div.speedup').css('display','inline');
		$('div.speedup').css('padding','0px 4px');
		$(' .ra > form[action^="/building/speedup/"] > div.speedup ').html( $('form[action^="/building/speedup/"] .speedup').html().replace(' fÃ¼r 6 Stunden','').replace('Bauzeit verkÃ¼rzen: ','-6 Std: ') );
		$(' .ra > form[action^="/building/instant_speedup/"] > div.speedup ').html( $('form[action^="/building/instant_speedup/"] .speedup').html().replace(' fertigstellen','') );
	} else {
		//	hide Buttons
		$('.ra').hide();
	}

}

if (window.location.href.substr(url_offset_bit+0,13) == '/stock/index/') {
	if ( $( '#transport_list img[src*="/images/icons/coins.png"]' ).length > '0' ){
		window.location.href = '#incoming';
		$( '#transport_list img[src*="/images/icons/coins.png"]' ).parent().parent().parent().parent().css('background-color', 'red');
	}
}

if (window.location.href.substr(url_offset_bit+0,18) == '/production/index/') {
	$( 'a[href^="/production/switch/"] img[src*="accept.png"]' ).parent().click(function(event){ return confirm( "Diese Produktion wirklich abbrechen?" ); });
}

$( '#vote' ).prepend( '<ul class="subnavigation"><li class="header">Votingbox</li></ul>' );
$( '#vote' ).removeClass('voting');
$( '#vote div,#vote p' ).hide();
$( '#vote' ).click(function(){ $( '#vote div,#vote p' ).slideToggle(); });


if (box_halt_show_bit) {
	var box_halt_style_bit = ' float:left; width:30px; margin-right:5px; color:maroon; text-align:right; ';
	$( 'div#stats' ).before( '<div id="box_halt_bit" class="box"><ul class="subnavigation">' );
	$( '#box_halt_bit ul' ).append( '<li class="header">Haltbarkeit</li>' );
	$( '#box_halt_bit ul' ).append( '<li style="display:none;"><span style=" '+box_halt_style_bit+'">-0.2 </span>Ewig haltbar</li>' );
	$( '#box_halt_bit ul' ).append( '<li style="display:none;"><span style=" '+box_halt_style_bit+'">-1 </span>Sehr lange haltbar</li>' );
	$( '#box_halt_bit ul' ).append( '<li style="display:none;"><span style=" '+box_halt_style_bit+'">-5 </span>Lange haltbar</li>' );
	$( '#box_halt_bit ul' ).append( '<li style="display:none;"><span style=" '+box_halt_style_bit+'">-10</span>Haltbar</li>' );
	$( '#box_halt_bit ul' ).append( '<li style="display:none;"><span style=" '+box_halt_style_bit+'">-25 </span>Leicht verderblich</li>' );
	$( '#box_halt_bit ul' ).append( '<li style="display:none;"><span style=" '+box_halt_style_bit+'">-50 </span>Sehr leicht verderblich</li>' );

	$( "#box_halt_bit" ).click(function(){ $( "#box_halt_bit li:not(.header)" ).slideToggle(); });
}

if (box_ruf_show_bit) {
	var box_ruf_style_bit = ' float:left; width:80px; margin-right:5px; text-align:right; ';
	$( 'div#stats' ).before( '<div id="box_ruf_bit" class="box"><ul class="subnavigation">' );
	$( '#box_ruf_bit ul' ).append( '<li class="header">Rufpunkte</li>' );
	$( '#box_ruf_bit ul' ).append( '<li style="color:#606060; display:none;"><span style="'+box_ruf_style_bit+'">0 - 9,99</span> - Unbekannt</li>' );
	$( '#box_ruf_bit ul' ).append( '<li style="color:black; display:none;"><span style="'+box_ruf_style_bit+'">10 - 29,99</span> - Bekannt</li>' );
	$( '#box_ruf_bit ul' ).append( '<li style="color:#00DD00; display:none;"><span style="'+box_ruf_style_bit+'">30 - 59,99</span> - Prominent</li>' );
	$( '#box_ruf_bit ul' ).append( '<li style="color:#0040DD; display:none;"><span style="'+box_ruf_style_bit+'">60 - 89,99</span> - PopulÃ¤r</li>' );
	$( '#box_ruf_bit ul' ).append( '<li style="color:#AF3FFF; display:none;"><span style="'+box_ruf_style_bit+'">90 - 100</span> - Kult</li>' );
	
	$( "#box_ruf_bit" ).click(function(){ $( "#box_ruf_bit li:not(.header)" ).slideToggle(); });
}
