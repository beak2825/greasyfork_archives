// ==UserScript==
// @name               Popurls Classic Black Style 2019
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            3.0
// @description        Brings back Popurls classic black theme, perfectly restores and improves former functionality while adding fullsize image previews.
// @run-at             document-start
// @include            http://popurls.com/
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @resource linkscss  https://greasyfork.org/scripts/14798-popurls-classic-link-colors-stylesheet/code/popurls%20classic%20link%20colors%20stylesheet.js?version=95986
// @resource qtipcss   https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.2/jquery.qtip.min.css
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_getResourceText
// @grant              GM_addStyle
// @author             drhouse
// @icon               http://web.archive.org/web/20120612095215if_/http://popurls.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/14800/Popurls%20Classic%20Black%20Style%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/14800/Popurls%20Classic%20Black%20Style%202019.meta.js
// ==/UserScript==

/* All colors and styles are an *exact* re-creation of the original site, the css values were copied from a locally saved html file from 2014 of the original popurls.com black site */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function () {

	$('body').css('background-color','#0E0E0E'); //black background
	$('body').css('font-size','0.9em'); //original font size

	//original a { link, visited, hover, active } link colors
	var linkscss  = GM_getResourceText("linkscss");
	GM_addStyle (linkscss);

	$('.feedbox h4').css({'border-top': '1px solid #505050'}); //original article divider line color

	$( ".box-d > h4" ).wrap( "<div class='pure-u-1'></div>" );

	//original hover color behavior, new style removed hovers
	$('#popurls > div > div > div > div > div > div, .box-d > div').css('background-color','#0E0E0E').hover(  
		function(){
			$(this).css('background-color','#333');
			$( this ).has( ".more" ).css( "background-color", "#0E0E0E" );
		},
		function(){
			$(this).css('background-color','#0E0E0E');
		});

	$('h4 > a > img').attr('height','10px').attr('width','10px'); //resize article thumbnails for original line spacing

	//restore original 'More' link & blend new design's into background
	$('.more > a').attr('style','background: url("http://cdn.popurls.com/get/100322/i/b/mm.gif") center right no-repeat;color:#0E0E0E !important');
	$('.more > a').text("_________");
	$('.more').attr('align','right');

    //add feature to permanently keep news feed columns expanded or collapsed, value is stored for return visits
	var permaexpand = GM_getValue("permaexpand");

	if( permaexpand == "true" ){
		location.href="javascript:("+function(){
			$.each($('.more > a'), function() {
				$(this).click();
			});
		}+")();";
		$('<a class="clickmore" style="color:#fff">collapse all news feeds</a><br>').prependTo('#customize');
	} else {
		GM_setValue("permaexpand", "false");
		$('.clickmore').remove();
		$('<a class="clickmore" style="color:#fff">expand all news feeds</a><br>').prependTo('#customize');
	}

	$('.clickmore').click(function(){
		var permaexpand = GM_getValue("permaexpand");
		if(!permaexpand)
			GM_setValue("permaexpand", "true");
		if(permaexpand == "false")
			GM_setValue("permaexpand", "true");
		if(permaexpand == "true")
			GM_setValue("permaexpand", "false");

		permaexpand = GM_getValue("permaexpand");

		if( permaexpand == "true" ){
			$('.clickmore').text('collapse all news feeds');
			console.log("permaexpand3: " + permaexpand); 
			location.href="javascript:("+function(){
				$.each($('.more > a'), function() {
					$(this).click();
				});
			}+")();";
		} 
		else {location.reload();}
	});

	//invert main graphics to visually work, going from new white to original black background
	$('#holder-logo').css({'-webkit-filter':'invert(100%)','background-color':'white'}); //invert popurl main logo
	$('h3').css('-webkit-filter','invert(100%)'); //invert coloumn header banners

	//improve tooltips light rounded style
	var qtipcss  = GM_getResourceText("qtipcss");
	GM_addStyle (qtipcss);

	unsafeWindow.$('[title!=""]').qtip({
		style: {
			classes: 'qtip-light qtip-shadow qtip-rounded'
		},
		position: {
			target: 'mouse', // Track the mouse as the positioning target
			adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
		}
	}); 

	//classic black favicon.ico
	a=document.createElement("link");
	a.setAttribute("type", "image/jpeg");
	a.setAttribute("rel", "icon");
	a.setAttribute("href", 'data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAABgYGAIaGhgBGRkYAxsbGAGZmZgCmpqYAKioqAObm5gBWVlYAdnZ'+
				   '2ALa2tgA'+'WFhYA9vb2AJ6engDW1tYAOjo6AA4ODgCOjo4ATk5OAG5ubgCurq4A7u7uAF5eXgB+fn4Avr6+AN7e3gAyMjIAHh4eAP7+/gBCQkIACgoKAIqKigBKSkoAysrKAGpqagCqqqoALi4uAOrq6gBaWloAenp6ALq6ugAaGhoA+vr6'+
				   'AKKiogDa2toAPj4+ABI'+'SEgCSkpIAUlJSAHJycgCysrIA8vLyAGJiYgCCgoIAwsLCAOLi4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIYJTcrJAAAAAAA'+
				   'AAAABg0ZJTYSAAAAAAAAAAAAAAASDBwcHBwVMAAAAAAAACAHHBwcHComAAAAAAAAAAAACw4cHBwcHBwMHQAAAAAPFRwcHBwcHDcpAAAAAAA'+'AAAAIHBwcHBwcHBwOCwAALiEcHBwcHBwcHDQAAAAAAAAAABccHBwcHBwcHBw1EQEJHBwcH'+
				   'BwcHBwcHwAAAAAAAAAACRwcHBwcHBwcHBUVNwccHBwcHBwcHBwBAAAAAAAAAAACHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBIAAAAAAAAAAAAyHBwcHBwcHBw'+'cHBwcHBwcHBwcHBwYHgAAAAAAAAAAABIcHBwcHBwcHBwcHBwcHBwcHBwcHC'+
				   'YAAAAAAAAAAAAPJRwcHBwcHBwcHBwcHBwcHBwcHBwcFR0AAAAAAAAAAA0cHBwcHBwcHBwcHBwcHBwcHBwcHBwcFAAAAAAAAAAAMhwcHBwcHBwcHBwcHBwcHBwcHBwcHBw'+'YAAAAAAAAAAAjHBwcHBwcHBwcHBwcHBwcHBwcHBwcHAoAAAA'+
				   'AAAAALiwcHBwcHBwcHBwzNzcVHBwcHBwcHBwcBykAAAAAAAAIHBwcHBwcHBwcHB8xFxccHBwcHBwcHBwcNAAAAAAAAAocHBwcHBwcHBwyEAsLAAUcHBwcHBwcHBw2AAAAAAAaDBwcHBw'+'cHBwcDRAAAAAAEC8cHBwcHBwcHBwPAAAAACcc'+
				   'HBwcHBwcBwQAAAAAAAAAABY3HBwcHBwcHAEAAAAAChwcHBwcFREbAAAAAAAAAAAAACkBJRwcHBwcNgAAAAAZHBwMAzEbAAAAAAAAAAAAAAAAAAApEzYMHBwHAAAAABQyEyQAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAYiFAoAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAA'+
				   'AAAAAAAAAAAAAAAAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAGBgYAhoaGAMbGxgBKSkoA5ubmACYmJgCmpqYAZmZmAPb29gAeHh4Avr6+ANra2gBeXl4A7u7uADo6OgAODg4AmpqaAFJSUgCurq4AcnJyAP7'+
				   '+/'+'gDi4uIATk5OAOrq6gAuLi4A+vr6ACIiIgDCwsIA3t7eAPLy8gA+Pj4AEhISAJ6engCysrIAenp6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEEFxMAAAMVHSIAAAAAAAAhFBQUBxYEFBQcDwAAAAAAEhQUFB0IFBQUCw8AAAAAACIUFBQ'+
				   'UFBQUFAYAAAAAAAAbFBQUFBQUFBQNGgAAAAAPCxQUFA0NFBQUFB4AAAAADBQUFBcDDgIUFBQQAAAAAAoUGSEYAAA'+'JEA0UCwAAAAAbIA4AAAAAAAAFAQoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
				   'AAAAAAAAX4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=');

	document.documentElement.firstChild.appendChild(a);

	//introduce fullsize improved popup image functionality to adjust for reduced thumbnails 
	var logo = $('#holder-logo').find('img');
	var apple = $('#popurls > div > div:nth-child(3) > div:nth-child(2)').find('img');

	$( "img" ).not(logo).not(apple).each(function() {
		var key = $(this).attr('src');
		$( this ).wrap( "<a href="+key+" class='preview'></a>" );    
		$( this ).replaceWith( "<img src="+key+" height=12 width=12>" );
	});

	var prevWidth;
	$("a.preview").hover(function(e){
		this.t = $(this).parent().parent().find('a:nth-child(2)').attr('oldtitle');
		this.title = "";
		var qt = $(this).parent().attr('data-hasqtip');
		$('#qtip-'+qt).removeClass('qtip');
		if (!this.t){
			this.t = $(this).parent().attr('oldtitle');
			if (!this.t){
				this.t = $(this).parent().text();
			}
		}

		var c = (this.t !== "") ? "<br/>" + this.t : "";		 
		$("body").append("<p id='preview'><img src='"+ this.href +"' alt='Image preview' />"+ c +"</p>");
		$('#preview').css('position','absolute')
			.css('color','white')
			.css('padding','8px')
			.css('font','100% Arial')
			.css('border','1px solid #fff')
			.css('background','#191919');
		var $img = $('#preview > img');


		$img.on('load', function(){
			prevWidth = $(this).width();
			$('#preview').css('width', prevWidth);
		});

		$('#preview').css('width', prevWidth);
		$('#preview').css('word-wrap','break-word');

		var rt = ($(window).width() - ($( this ).find('img').offset().left + $( this ).find('img').outerWidth()));
		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height();
		var viewportWidthCenter = viewportWidth/2;
		var viewportHeightCenter = viewportHeight/2;
		var xOffset;
		var yOffset;

		if (rt >= viewportWidthCenter){
			xOffset = 10;
			yOffset = 30;
			$("#preview")
				.css("top",(e.pageY - xOffset) + "px")
				.css("left",(e.pageX + yOffset) + "px")
				.fadeIn("fast");						
		} else {
			xOffset = 10;
			yOffset = $('#preview').width() + 30;	
			$("#preview")
				.css("top",(e.pageY - xOffset) + "px")
				.css("left",(e.pageX - yOffset) + "px")
				.fadeIn("fast");
		}
	},
						 function(){
		this.title = this.t;	
		$("#preview").remove();
	});	

});