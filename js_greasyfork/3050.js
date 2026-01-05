// ==UserScript==
// @name		PH! forum SPOILER elrejto (Safari/GreaseKit)
// @author		http://prohardver.hu/tag/spammer.html
// @namespace 	https://greasyfork.org/users/2358-spammer
// @version    	0.4
// @description A PH! lapcsalad forumaban a spoiler tagekkel ellatott szovegreszeket rejti el.
// @match 		http://prohardver.hu/tema/*
// @match 		http://itcafe.hu/tema/*
// @match 		http://gamepod.hu/tema/*
// @match 		http://mobilarena.hu/tema/*
// @match 		http://logout.hu/tema/*
// @match 		http://m.prohardver.hu/tema/*
// @match 		http://m.itcafe.hu/tema/*
// @match 		http://m.gamepod.hu/tema/*
// @match 		http://m.mobilarena.hu/tema/*
// @match 		http://m.logout.hu/tema/*
// @match 		http://prohardver.hu/muvelet/hsz/*
// @match 		http://itcafe.hu/muvelet/hsz/*
// @match 		http://gamepod.hu/muvelet/hsz/*
// @match 		http://mobilarena.hu/muvelet/hsz/*
// @match 		http://logout.hu/muvelet/hsz/*
// @match 		http://logout.hu/bejegyzes/*
// @include 	http://prohardver.hu/tema/*
// @include 	http://itcafe.hu/tema/*
// @include 	http://gamepod.hu/tema/*
// @include 	http://mobilarena.hu/tema/*
// @include 	http://logout.hu/tema/*
// @include 	http://m.prohardver.hu/tema/*
// @include 	http://m.itcafe.hu/tema/*
// @include 	http://m.gamepod.hu/tema/*
// @include 	http://m.mobilarena.hu/tema/*
// @include 	http://m.logout.hu/tema/*
// @include 	http://prohardver.hu/muvelet/hsz/*
// @include 	http://itcafe.hu/muvelet/hsz/*
// @include 	http://gamepod.hu/muvelet/hsz/*
// @include 	http://mobilarena.hu/muvelet/hsz/*
// @include 	http://logout.hu/muvelet/hsz/*
// @include 	http://logout.hu/bejegyzes/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3050/PH%21%20forum%20SPOILER%20elrejto%20%28SafariGreaseKit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3050/PH%21%20forum%20SPOILER%20elrejto%20%28SafariGreaseKit%29.meta.js
// ==/UserScript==


function jQueryIsReady($) {
            
    //---------------------------------//
    //----- 1. Var --------------------//
    //---------------------------------//    
    
   	var $OPENING_TAG = '[SPOILER]';
    var $CLOSING_TAG = '[/SPOILER]';    
    var $SPOILER_WARNING = 'SPOILER! megtekintése';
    var $spoiler_wrap = '<div class="spoiler_wrap"></div>';
    var check_domain = window.location.hostname; //mobilos nezethez (m-es domain)
    
       
    //mobilos nezethez mas style-t kell be betolteni, ezert csekkoljuk, hogy m-es domain cím-e
    if(check_domain === "m.prohardver.hu" || check_domain === "m.itcafe.hu" || check_domain === "m.gamepod.hu" || check_domain === "m.mobilarena.hu" || check_domain === "m.logout.hu") {
        console.log('mobile vars loaded: '+check_domain);
     
		var $spoiler_alert_CSS  = {
         
            "padding":"5px",
            "margin-top":"15px",
            "box-sizing":"border-box",
            "color":"#c90000",
            "font-weight":"bold",
            "font-size":"11px",
            "cursor":"pointer"
        }
        
        var $spoiler_wrap_CSS  = { 
        
        "box-sizing":"border-box",
        "padding":"5px 0 10px 5px"
    	
        }
        
    } else {
        console.log('desktop vars loaded: '+check_domain);
    
        var $spoiler_alert_CSS  = { 
            
            "background": "rgba(0,0,0,0.05)", 
            "border":"1px dashed rgba(0,0,0,0.25)",
            "border-radius":"3px",
            "padding":"5px",
            "margin-top":"15px",
            "box-sizing":"border-box",
            "color":"#c90000",
            "font-weight":"bold",
            "font-size":"11px",
            "cursor":"pointer"
        
        }
        
       	var $spoiler_wrap_CSS  = { 
        
        "background": "rgba(0,0,0,0.05)", 
        "border-left":"1px dashed rgba(0,0,0,0.25)",
        "border-right":"1px dashed rgba(0,0,0,0.25)",
        "border-bottom":"1px dashed rgba(0,0,0,0.25)",
        "border-radius":"3px",
        "box-sizing":"border-box",
        "padding":"5px 0 10px 5px"
    	
        }
        
    } //if -> else vege
    

    var $SPOILER_OPEN_ONLY = $('.text p').filter(function() { return $(this).text() ===  $OPENING_TAG;});
    var $SPOILER_CLOSE_ONLY = $('.text p').filter(function() { return $(this).text() ===  $CLOSING_TAG;});
    var $SPOILER_BLOCK = $('.text p:contains('+$OPENING_TAG+'):contains('+$CLOSING_TAG+')');
    var $SPOILER_OPEN_TEXT = $('.text p:contains('+$OPENING_TAG+'):not(:contains('+$CLOSING_TAG+'))');
 	var $SPOILER_CLOSE_TEXT = $('.text p:contains('+$CLOSING_TAG+'):not(:contains('+$OPENING_TAG+'))');
    
    //--------------------------------------------------//
    //------ 2. Classok hozzaadasa  --------------------//
    //--------------------------------------------------//   
    
    $($SPOILER_OPEN_ONLY).each(function () { $(this).addClass("spoiler_open_only");  });
    $($SPOILER_CLOSE_ONLY).each(function () { $(this).addClass("spoiler_close_only"); });
	$($SPOILER_BLOCK).each(function () { $(this).addClass("spoiler_block"); });
    $($SPOILER_OPEN_TEXT).each(function () { if ($(this).text().length > 9) { $(this).addClass("spoiler_open_text"); } });
    $($SPOILER_CLOSE_TEXT).each(function () { if ($(this).text().length > 10) { $(this).addClass("spoiler_close_text"); } });
   
    //--------------------------------------------------//
    //------ 3. Elemek szetbontasa es osszerakasa ------//
    //--------------------------------------------------//  
    
  	// --- 3.1. A nyito tag egy <p> blokkban van a szovegel
    $('.spoiler_open_text').before('<p class="spoiler_open_only">'+$OPENING_TAG+'</p>'); //beszurunk egy uj onallo nyito tag blokkot
   	$('.spoiler_open_text:contains('+$OPENING_TAG+')').html(function() { return $(this).html().replace($OPENING_TAG, ''); }); //toroljuk a szovegbol a nyito taget
    $('.spoiler_open_text').html(function() { return $(this).html().replace('<br>', ''); }); //toroljuk a sortorest, ami a nyito tag utan volt, hogy ne legyen hezag a szoveg elott.
    
    // --- 3.2. A zaro tag egy <p> blokkban van a szovegel
   	$('.spoiler_close_text').after('<p class="spoiler_close_only">'+$CLOSING_TAG+'</p>'); //beszurunk egy uj onallo zaro tag blokkot
   	$('.spoiler_close_text:contains('+$CLOSING_TAG+')').html(function() { return $(this).html().replace($CLOSING_TAG, ''); }); //toroljuk a szovegbol a zaro taget
	
    // --- 3.3. A nyito es a zaro tag is egy <p> blokkban van a szoveggel
	$('.spoiler_block').before('<p class="spoiler_open_only">'+$OPENING_TAG+'</p>'); //beszurunk egy uj onallo nyito tag blokkot
    $('.spoiler_block').after('<p class="spoiler_close_only">'+$CLOSING_TAG+'</p>'); //beszurunk egy uj onallo zaro tag blokkot
    $('.spoiler_block:contains('+$OPENING_TAG+')').html(function() { return $(this).html().replace($OPENING_TAG, ''); }); //toroljuk a szovegbol a nyito taget
    $('.spoiler_block:contains('+$CLOSING_TAG+')').html(function() { return $(this).html().replace($CLOSING_TAG, ''); }); //toroljuk a szovegbol a zaro taget
    $('.spoiler_block').html(function() { return $(this).html().replace('<br>', ''); }); //toroljuk a sortorest, ami a nyito tag utan volt, hogy ne legyen hezag a szoveg elott.

    
    //-------------------------------------------------------------//
    //------ 4. Spoiler elrejtese, csomagolasa, megjelenitese -----//
    //-------------------------------------------------------------// 
    
    //mobilos nezethez mas style-t kell be betolteni, ezert csekkoljuk, hogy m-es domain cím-e
    if(check_domain === "m.prohardver.hu" || check_domain === "m.itcafe.hu" || check_domain === "m.gamepod.hu" || check_domain === "m.mobilarena.hu" || check_domain === "m.logout.hu") { 
    	
    	var $spoiler_wrap_p_style = 'margin-top:5px!important';
        console.log('mobile .spoiler_wrap p style loaded: '+check_domain);
    
    } else {
        
        var $spoiler_wrap_p_style = 'margin-top:5px!important;max-width:465px';
        console.log('desktop .spoiler_wrap p style loaded: '+check_domain);
    }
    
    
    $('.spoiler_open_only').nextUntil($('.spoiler_close_only')).hide(); //elrejtunk mindent a 2 tag kozott
    $('.spoiler_open_only').text($SPOILER_WARNING).css($spoiler_alert_CSS); //a nyito taget lecsereljuk formazott figyelmezteto szovegre
    
    
	//A mar formazott figyelmezteto szovegre kattintva kinyitjuk vagy becsukjuk a spoileres tartalmat
	$('.spoiler_open_only').click(function() {
       
        if ($(this).nextAll().css('display') == 'none') {
        	
            $(this).nextUntil($('.spoiler_close_only')).wrapAll($spoiler_wrap); //spoileres tartalom becsomagolasa
            $(".spoiler_wrap").css($spoiler_wrap_CSS); //alkalmazzuk a css-t a wrapperre
            $(".spoiler_wrap p").attr('style',$spoiler_wrap_p_style); //css helyett attr, kulonben az oldal margin-top !importantjat nem irja felul
            $(".spoiler_wrap p small").css('color', '#000'); //offtopic betuk szinezese feketere
            $(".spoiler_wrap").show(); //spoileres doboz kinyitasa
            $(this).nextUntil($('.spoiler_close_only')).hide().fadeIn("200"); //spoileres tartalom megjelenitese
              
        } else {
              
            $(this).nextUntil($('.spoiler_close_only')).contents().unwrap(); //tobbszoros becsukas/kinyitas utan ne legyen tobbszoros wrappolas
            $(this).nextUntil($('.spoiler_close_only')).hide(); //spoileres tartalom elrejtese
            
        }
        
    });
      
    
	$('.spoiler_close_only').hide(); //a zaro taget minden esetben elrejtjuk 
    
     
} //script vege


// -----------------------------------------------------------------
// Greasemonkey/GreaseKit compatibility
// -----------------------------------------------------------------

if (typeof(unsafeWindow) === 'undefined') {
 unsafeWindow = window;
}

// -----------------------------------------------------------------
// jQuery
// -----------------------------------------------------------------

var script = document.createElement('script');
script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
script.type = 'text/javascript';
script.addEventListener("load", function() {
  unsafeWindow.jQuery.noConflict();
  jQueryIsReady(unsafeWindow.jQuery);
}, false);
document.getElementsByTagName('head')[0].appendChild(script);