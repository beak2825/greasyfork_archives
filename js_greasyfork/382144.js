// ==UserScript==
// @name		 Kittens Turbo!
// @description Script for bloodrizer's Kittens Game. Enables time turbo! You can increase your time warp dilation by 3x, 10x and ???x (as fast as your device can handle). You can also automatically craft stuff when the appropriate resource is full. Designed for 1080p screen, sorry if something overlaps.
// @version	1.3
// @include	 http://bloodrizer.ru/games/kittens/*
// @grant		none
// @namespace https://greasyfork.org/users/294260
// @downloadURL https://update.greasyfork.org/scripts/382144/Kittens%20Turbo%21.user.js
// @updateURL https://update.greasyfork.org/scripts/382144/Kittens%20Turbo%21.meta.js
// ==/UserScript==
var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};
/**/loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js", function() {/**/

/// history
// 1.1 bug fix
// 1.2 added autocrafting for: slab/beam, plate. AUTO Zebra trade, praising, hunting. 						TODO bcoin buy/sell when the price is right
//   - revamp auto crafting code
//   - turbo is now 1x(off) by default when enabled instead of 10x
// 1.3 added kero & thorium, seperated slab & beam. changed to use latest version of jQuery
////////////////////////////////////////////////////
  $ = jQuery.noConflict(true);

	//some vars
	var someVars = {
		allTick: 0,
		turboTick: 0,
		turboSpeed: 200,
	};
	var $insetPoint = $(".links-block").first();

  //some funcs
	function turboOn(){
		if(!someVars.turboTick) someVars.turboTick = setInterval(function(){game.tick();}, someVars.turboSpeed);//fire up the turbo!
	}
	function allOn(){
		if(!someVars.allTick) someVars.allTick = setInterval(function(){allTick();}, someVars.turboSpeed*5);//fire up the auto craft!
	}
	function turboOff(){
		clearInterval(someVars.turboTick);
		someVars.turboTick = 0;
	}
	function allOff(){
    clearInterval(someVars.allTick);
    someVars.allTick = 0;
	}
	function allTick(){
    if( !$("input[type=checkbox][class^=kt-]:checked").length ) return; //skip if nothing is checked
		if( $(".kt-fait")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.e.2"]').hasClass("resLimitNotice") )
				$('a[data-reactid=".0.3.0"]')[0].click();//auto praise if you got max faith
		}
		if( $(".kt-hunt")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.b.2"]').hasClass("resLimitNotice") )
				$('a[data-reactid=".0.2.0"]')[0].click();//auto hunt if you got max catpower
		}
		if( $(".kt-zebr")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.b.2"]').hasClass("resLimitNotice") && $(".tabInner .title:contains('Zebras')").length)
				$(".tabInner .title:contains('Zebras')").next().find(".btnContent").find("a").first()[0].click();//trade with zebras if you got that open
		}
		if( $(".kt-stee")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.3.2"]').hasClass("resLimitNotice") )
				$('div[data-reactid=".0.4.1.0.5.6.0"]').click();//auto craft ALL steel if you got max coal
		}
		if( $(".kt-elud")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.9.2"]').hasClass("resLimitNotice") )
				$('div[data-reactid=".0.4.1.0.9.6.0"]').click();//auto craft ALL eludium if you got max uo
		}
		if( $(".kt-beam")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.1.2"]').hasClass("resLimitNotice") )
				$('div[data-reactid=".0.4.1.0.2.6.0"]').click();//auto craft ALL beam if you got max wood
		}
		if( $(".kt-slab")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.2.2"]').hasClass("resLimitNotice") )
				$('div[data-reactid=".0.4.1.0.3.6.0"]').click();//auto craft ALL slab if you got max minerals
		}
		if( $(".kt-plat")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.4.2"]').hasClass("resLimitNotice") )
				$('div[data-reactid=".0.4.1.0.4.6.0"]').click();//auto craft ALL plate if you got max iron
		}
		if( $(".kt-kero")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.7.2"]').hasClass("resLimitNotice") )
				$('div[data-reactid=".0.4.1.0.d.6.0"]').click();//auto craft ALL kerosene if you got max oil
		}
		if( $(".kt-thor")[0].checked ){
			if( $('div[data-reactid=".0.0.1.1.8.2"]').hasClass("resLimitNotice") )
				$('div[data-reactid=".0.4.1.0.i.6.0"]').click();//auto craft ALL thorium if you got max uranium
		}
//		if( $(".kt-coin")[0].checked ){
//			if( false ){
//				//TODO
//			}	
//		}
	}
  
	//draw main turbo button
	$insetPoint.prepend('<a class="gofaster" href="#">&cross; Turbo</a> | ');
	
  //main turbo button handler
	$(".gofaster").click(function(){
		if($(".kt-options").length){
			turboOff();
			allOff();
			$(this).html("&cross; Turbo");
			$(".kt-options").remove();
		} else{
			///prep

			///display
			$(this).html("&check; Turbo");
			$insetPoint.prepend('<div class="kt-options">'+
										 			'<label><input type="radio" name="kt_radio" class="kt-fast"					/><attr title="1ms">???x</attr></label><br>'+
													'<label><input type="radio" name="kt_radio" class="kt-medi"					/><attr title="22ms">10x</attr></label><br>'+
													'<label><input type="radio" name="kt_radio" class="kt-slow"					/><attr title="100ms">3x</attr></label><br>'+
													'<label><input type="radio" name="kt_radio" class="kt-whyu" checked	/><attr title="(off)">1x</attr></label><br>'+
													'<hr>'+
													'<label><input type="checkbox" class="kt-beam" /><attr title="auto craft Beam when your Wood is max">beam</attr></label><br>'+
													'<label><input type="checkbox" class="kt-slab" /><attr title="auto craft Slab when your Mineral is max">slab</attr></label><br>'+
													'<label><input type="checkbox" class="kt-plat" /><attr title="auto craft Plate when your Iron is max (X steel)">plate</attr></label><br>'+
													'<label><input type="checkbox" class="kt-stee" /><attr title="auto craft Steel when your Coal is max (X plate)">steel</attr></label><br>'+
													'<label><input type="checkbox" class="kt-elud" /><attr title="auto craft Eludium when your UO is max">eludium</attr></label><br>'+
													'<label><input type="checkbox" class="kt-kero" /><attr title="auto craft Kerosene when your Oil is max">kero</attr></label><br>'+
													'<label><input type="checkbox" class="kt-thor" /><attr title="auto craft Thorium when your Uranium is max">thorium</attr></label><br>'+
													'<hr>'+
													'<label><input type="checkbox" class="kt-fait" /><attr title="auto praise when your faith is max">\\o/</attr></label><br>'+
													'<label><input type="checkbox" class="kt-hunt" /><attr title="auto hunt when your catpower is max (X zebra)">hunt</attr></label><br>'+
													'<hr>'+
													'<label><input type="checkbox" class="kt-zebr" /><attr title="auto trade w/zebras when catpower is max (X hunt)\n /!\\ Trade panel must be open /!\\ \nsuggest also use `slab beam` to keep up slab supply">zebra</attr></label><br>'+
											//		'<label><input type="checkbox" class="kt-coin" /><attr title="auto trade w/elders when bcoin price is right: sell when at 1095, buy while under 885">bcoin</attr></label><br>'+
													'<hr>'+
										'</div>'+styler);
			///handlers
			$(".kt-fast").click(function(){
				turboOff();
        allOff();
				someVars.turboSpeed = 1;
				turboOn();
        allOn();
			});
			$(".kt-medi").click(function(){
				turboOff();
        allOff();
				someVars.turboSpeed = 22;
				turboOn();
        allOn();
			});
			$(".kt-slow").click(function(){
				turboOff();
        allOff();
				someVars.turboSpeed = 100;
				turboOn();
        allOn();
			});
			$(".kt-whyu").click(function(){
				turboOff();
        allOff();
				someVars.turboSpeed = 200;
        allOn();
			});
			///turn it on!
			//turboOn();
      allOn();
		}
	});
  
  //finished loading
	console.log("Kittens Turbo! loaded")
		

	

var styler = '\
<style>									\
.kt-options {						\
	position: absolute;		\
	z-index: 1;						\
	right: 0;							\
	top: 30px;						\
}												\
.kt-options input {			\
	display: inline-block;\
	width: ;							\
}												\
</style>';

/**/});/**/