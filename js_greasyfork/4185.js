// ==UserScript==
// @name        Ubuntu-it Ban Helper
// @description Ubuntu-it Ban Helper Script
// @include     http*://forum.ubuntu-it.org/mcp.php?i=ban*
// @require     http://code.jquery.com/jquery-1.9.1.js
// @require     http://code.jquery.com/ui/1.10.2/jquery-ui.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.7.0/moment.min.js
// @resource    customCSS http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @version     0.201705301605
// @namespace   https://greasyfork.org/users/3779
// @downloadURL https://update.greasyfork.org/scripts/4185/Ubuntu-it%20Ban%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/4185/Ubuntu-it%20Ban%20Helper.meta.js
// ==/UserScript==

var newCSS = GM_getResourceText ("customCSS");
GM_addStyle (newCSS);

var days = $('<select>');
days.append('<option value="" selected disabled>Seleziona il numero di giorni...</option>');
for( var i=2; i<15; i++ ){
    days.append('<option value="'+i+'">'+i+' giorni</option>');
}
days.change(function(){
	var days = parseInt($(this).val());
	var date = moment().add(days,'days').format('YYYY-MM-DD');
    $('#banlengthother input').val(date);
});

$('#banlengthother').append(days);
$.datepicker.setDefaults( $.datepicker.regional[ "it" ] );
$('#banlengthother input').datepicker({dateFormat:'yy-mm-dd'});

var filter = $('<input type="text" placeholder="Filtro bannati" value="'+$('#ban').val()+'">');
filter.keyup(function(){
	var $this = $(this);
	if( $this.val() ){
		$('#unban option').each(function(){
			var show = $(this).text().indexOf($this.val())>=0;
			if( show ) $(this).show();
			else $(this).hide();
		});
	}else{
		$('#unban option').show();
	}
});
filter.change(function(){ filter.trigger('keyup'); });
filter.trigger('keyup');
var clean = $('<button type="button" title="Ripulisci filtro">X</button>');
clean.click(function(){
	filter.val('').trigger('keyup');
});
$('#unban').after(filter);
filter.after(clean);
