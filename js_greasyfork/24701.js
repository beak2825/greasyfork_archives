// ==UserScript==
// @name         Coalgirls Seeder Ratio
// @namespace    coalgirls_seeder_ratio
// @description  Adds a column with the seeder / leecher ratio on the torrent-listing page
// @version      1.0
// @date         2016-11-09
// @include      /^https?:\/\/coalgirls.wakku.to\/torrent-listing\/?$/
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24701/Coalgirls%20Seeder%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/24701/Coalgirls%20Seeder%20Ratio.meta.js
// ==/UserScript==

function color( percent ) {

	if ( percent === 0 || percent >= 1.5 )
		return { background: "transparent", text: "inherit" };

	if ( percent === -1 )
		return { background: "rgb( 170,20,20 )", text: "#fff" };

	if ( percent < 0.9 )
		return { background: "rgb( 252,181,181 )", text: "#000" };

	if ( percent < 1.5 )
		return { background: "rgb( 231,231,126 )", text: "#000" };

}

$( ".trackerlisting .headentry" ).each(function(){
	var el = $(this);
	$( el.find( "th" ).get( 6 ) ).after( "<th>Ratio</th>" );
});

$( ".newentry" ).each(function(){

	var el = $(this);

	var seeders_el = $( el.find( "td" ).get( 5 ) );
	var leechers_el = $( el.find( "td" ).get( 6 ) );

	var seeders = parseInt( seeders_el.text() );
	var leechers = parseInt( leechers_el.text() );

	var percent = ( seeders === 0 && leechers !== 0 || seeders === 0 && leechers === 0 ) ? -1 : ( leechers === 0 ) ? 0 : ( seeders / leechers );
	var percent_text = ( percent === 0 ) ? "---" : ( percent === -1 ) ? "!!!" : Math.round( percent * 100 ) + "%";
	var percent_align = ( percent === -1 || percent === 0 ) ? "center" : "left";

	leechers_el.after( '<td style="color:'+ color( percent ).text +';text-align:'+ percent_align +';background:'+ color( percent ).background +'">'+ percent_text +'</td>' );

});