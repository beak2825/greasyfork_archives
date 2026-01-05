// ==UserScript==
// @name ISP admin
// @version 1.4
// @description ISP admin plugin
// @author cuckycz
// @match https://admin.racingnet.cz/new/www/frame/
// @match https://admin.racingnet.cz/new/www/scheduling/*
// @match https://admin.racingnet.cz/new/www/
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant none
// 
// @namespace https://greasyfork.org/users/39040
// @downloadURL https://update.greasyfork.org/scripts/19374/ISP%20admin.user.js
// @updateURL https://update.greasyfork.org/scripts/19374/ISP%20admin.meta.js
// ==/UserScript==


var username = '';
var password = '';


$(function(){
	
	// adresa v planovani v novem okne 
	var element = $('#frmschedulingForm-address');
		var adrs = element.val();
	element.after('<a target="_blank" href="https://mapy.cz/zakladni?q='+adrs+'"><i class="icon-map" title="Zobrazit na mapě"></i></a>');
  
  	// vyplneni prihlasovacich udaju
  	if(username.length > 0){
  		$('#frmsignInForm-username').val(username);
    	$('#frmsignInForm-password').val(password);
    }

  	// automaticke prihlaseni
    $('#frm-signInForm').submit();
  
  

});