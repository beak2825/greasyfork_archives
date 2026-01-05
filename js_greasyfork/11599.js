// ==UserScript==
// @name        WielkieŻarciePrinter
// @namespace   dapi.wzp
// @description Menedżer wydruku Wielkiego Żarcia
// @include     http*://*wielkiezarcie.com*
// @version     2.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11599/Wielkie%C5%BBarciePrinter.user.js
// @updateURL https://update.greasyfork.org/scripts/11599/Wielkie%C5%BBarciePrinter.meta.js
// ==/UserScript==


function openPreview(address){
	window.wzp_print_preview = true;
	$('body').append('<iframe src="'+address+'?printview" class="wzp_printview" border="0" style="position: fixed; left: 0px; top: 0px; z-index: 2147483640; width: 100%; height: 100%; opacity: 0; border: 0px; background: rgba(255,255,255,0.3)"></iframe>');
	
	$('.wzp_printview').load(function(){
		$('.wzp_printview').focus().css({overflow: 'hidden'}).animate({
			width: '100%',
			height: '100%',
			top: '0px',
			left: '0px',
			opacity: '1',
		}, function(){
			$(this).css({overflow: 'visible'})
		});
		$('body').css({overflow: 'hidden'});
	})
}


function closePreview(minimise){
	if(typeof minimise === 'undefined'){
		var id		= window.location.pathname.replace('/przepisy/','');
		wzp_minimised_previews = JSON.parse(unsafeWindow.localStorage.getItem("wzp_minimised_previews"));
		wzp_new_array = new Array();
		if(wzp_minimised_previews){
			for(var n=0; n<wzp_minimised_previews.length; n++){
				if(wzp_minimised_previews[n][0] != id){
					wzp_new_array.push([wzp_minimised_previews[n][0], wzp_minimised_previews[n][1], wzp_minimised_previews[n][2], wzp_minimised_previews[n][3]]);
				}else{
					write_minimised();
				}
			}
		}
		if(wzp_new_array.length > 0){
			unsafeWindow.localStorage.setItem("wzp_minimised_previews", JSON.stringify(wzp_new_array));
		}else{
			unsafeWindow.localStorage.removeItem("wzp_minimised_previews");
		}
	}
	
	if(window.location.href == parent.location.href && window.location.href.indexOf('?printview') != -1){
		location.href = window.location.href.replace('?printview', '');
	}else{
		if(window.wzp_print_preview || parent.wzp_print_preview){
			parent.wzp_print_preview = false;
			
			$('body', window.parent.document).css({overflow: 'auto'});
			if(typeof minimise === 'undefined'){
				$('body').css({overflow: 'hidden'});
				$('.wzp_printview', window.parent.document).css({overflow: 'hidden'}).animate({
					width: '0px',
					height: '0px',
					top: '50%',
					left: '50%',
					opacity: '0',
				}, function(){
					$('body', window.parent.document).click().focus();
					$(this).remove();
				});
			}else{
				var n 	= 0;
				var id	= window.location.pathname.replace('/przepisy/','');
				wzp_minimised_previews = JSON.parse(unsafeWindow.localStorage.getItem("wzp_minimised_previews"));
				
				if(wzp_minimised_previews){
					for(n=0; n<wzp_minimised_previews.length; n++){
						if(wzp_minimised_previews[n][0] == id){
							break;
						}
					}
				}
				$('.wzp_printview', window.parent.document).css({overflow: 'hidden'}).animate({
					width: '235px',
					height: '35px',
					top: ($(window).height()-35)+'px',
					left: ($(window).width()-(224)*(n+1))+'px',
					opacity: '0',
				}, function(){
					$('body', window.parent.document).click().focus();
					$(this).remove();
				});
			}
		}
	}
	write_minimised();
}


function minimisePreview(close){
	var id		= location.pathname.replace('/przepisy/','');
	var title 	= $('.wzp_title').text();
	var photo 	= $('.wzp_left_pannel img').attr('src');
	var photo 	= (photo)?photo:'http://wielkiezarcie.com/img/icon_recipes_88x88.png';
	var href	= location.href;
	
	wzp_minimise_found = false;
			
	wzp_minimised_previews = JSON.parse(unsafeWindow.localStorage.getItem("wzp_minimised_previews"));
	if(wzp_minimised_previews){
		for(var n=0; n<wzp_minimised_previews.length; n++){
			if(wzp_minimised_previews[n][0] == id){
				wzp_minimise_found = true;
				break;
			}
		}
	}
	
	if(!wzp_minimise_found){
		if(wzp_minimised_previews){
			wzp_new_array = [id, title, photo, href];
			wzp_minimised_previews.push(wzp_new_array);
			unsafeWindow.localStorage.setItem("wzp_minimised_previews", JSON.stringify(wzp_minimised_previews));
		}else{
			unsafeWindow.localStorage.setItem("wzp_minimised_previews", JSON.stringify([[id, title, photo, href]]));
		}
	}
	if(typeof close === 'undefined'){
		closePreview(true);
	}
	write_minimised();
}


function changeMinimise(dir){
	var id		= location.pathname.replace('/przepisy/','');
	
	wzp_minimised_previews = JSON.parse(unsafeWindow.localStorage.getItem("wzp_minimised_previews"));
	if(wzp_minimised_previews){
		for(n=0; n<wzp_minimised_previews.length; n++){
			if(wzp_minimised_previews[n][0] == id){
				break;
			}
		}
	}
	
	minimisePreview(false);
	
	if(dir == 'prev'){
		address = wzp_minimised_previews[n+1][3]
	}else{
		address = wzp_minimised_previews[n-1][3]
	}
	location.href=address;
}


minimised_tabs_last = '';
function write_minimised(){
	minimised_tabs = unsafeWindow.localStorage.getItem("wzp_minimised_previews");
	if(minimised_tabs_last != minimised_tabs){
		$('.wzp_minimise_tab', window.parent.document).remove();
		if(minimised_tabs){
			wzp_minimised_previews = JSON.parse(minimised_tabs);
			for(var n=0; n<wzp_minimised_previews.length; n++){
				$('body', window.parent.document).append('<div class="wzp_no_printed wzp_minimise_tab" data-wzp_minimise_id="'+wzp_minimised_previews[n][0]+'" data-wzp_minimise_href="'+wzp_minimised_previews[n][3]+'" style="position: fixed; bottom: 0px; right: '+(((235+10)*n)+5)+'px; width: 235px; height: 35px; background: #009CDE; border: 1px dashed #fff; border-bottom: none; outline: 1px solid #009CDE; color: #fff; font-size: 12px; cursor: pointer; z-index: 2147483630"></div>');
				$('[data-wzp_minimise_id="'+wzp_minimised_previews[n][0]+'"]', window.parent.document).append('<div style="display: table-cell; vertical-align: middle; padding: 0px 0px 0px 10px;"><div style="width: 25px; height: 25px; background: url('+wzp_minimised_previews[n][2]+'); background-size: cover; background-position: center;"></div></div>');
				$('[data-wzp_minimise_id="'+wzp_minimised_previews[n][0]+'"]', window.parent.document).append('<div style="display: table-cell; vertical-align: middle; padding: 0px 10px 0px 10px; height: 35px;">'+wzp_minimised_previews[n][1]+'</div>');
			}
		}
		minimised_tabs_last = minimised_tabs;
	}
}


function printPreview(){
	wzp_print_preview = true;
  
	/* usuwanie elementów i styli */

	// usuwanie stylu
	$('link[rel="stylesheet"').remove();

	// usuwanie reklam
	$('a[href*="adClick"], .advert').remove();


	// usuwanie nagłówka, nawigacji, wyszukiwarki, menu, okruszków chlebowych, 
	$('#head, #header, #topMenu, #search, #mainMenu, .icons, #path').remove();


	// usuwanie elementów z założenia niedrukowalnych
	$('.notPrinted, .hidden').remove();


	// usuwanie paginacji, stopki, komunikatu cookies
	$('.pagination01, #footer, #cookiesmessage').remove();
	
	
	// usuwanie elementów z przepisów specjalnych
	if(location.pathname.substr(1,location.pathname.substr(1).indexOf('/')) != 'przepisy'){
		elements_surname 	= location.pathname.substr(1,location.pathname.substr(1).indexOf('/'));
		$('.'+elements_surname+'section .menu').remove();
		$('.'+elements_surname+'footer').remove();
	}
	
	
	// usuwanie informacji o ilościach komentarzy, wejść i ulubionych
	$('.boxHeader .inf').remove();

 
 
	/* tworzenie układu */

	// tworzenie nagłówka
	recipe_name = $('#articleTitle').text();
	serves      = $('.prepInfo > ul > .serves > span.label').text();
	
	if(location.pathname.substr(1,location.pathname.substr(1).indexOf('/')) != 'przepisy'){
		recipe_name = $('#articleTitle').text();
		serves      = '';
		$('.'+elements_surname+'section').before('<div class="boxHeader"></div>');
	}

	$('.clickBox').remove();
	
	$('.boxHeader').append('<div class="wzp_title">'+recipe_name+'</div>'+
						             '<div class="wzp_serves">'+serves+'</div>');

	
	// tworzenie paneli przepisu
	$('.boxHeader').after('<div class="wzp_recipe"></div>');
	$('.wzp_recipe').append('<div class="wzp_left_pannel"></div>'+
                          '<div class="wzp_right_pannel"></div>');

	// lewy panel...
	photo             = $('.boxHeader .bgimage');
	ingredients_title = $('.ingredients h3').text();
	ingredients       = $('.ingredients #content1').html();
	
	if(location.pathname.substr(1,location.pathname.substr(1).indexOf('/')) != 'przepisy'){
		ingredients_title = '';
		$('.recipe .content #content1 img.logo').remove();
		ingredients       = '';
	}

	photo = $('.boxHeader.withbackground');
	
	$('.wzp_left_pannel').append('<div class="wzp_ingredients">'+ingredients+'</div>');
	$('.wzp_ingredients').prepend('<h2>'+ingredients_title+'</h2>');
	
	
	if(photo.length != 0){
		photoSrc = photo.css('background-image').substr(5);
    photoSrc = photoSrc.substr(0, photoSrc.length-2)
		$('.wzp_left_pannel').append('<img src="'+photoSrc.replace('x.', '.')+'">');
	}
	
	photo.css({background: ''});
	$('#articleTitle, .prepInfo').remove();
	$('.boxHeader .bgimage').remove();


	// prawy panel...
	directions_title = $('.directions h3').text();
	directions       = $('#content2').html();
  
	if(location.pathname.substr(1,location.pathname.substr(1).indexOf('/')) != 'przepisy'){
		directions_title = '';
		$('.recipe .content #content2 img.logo').remove();
		directions       = $('#content1').html();
	}
  
  
	$('.wzp_right_pannel').append('<div class="wzp_directions">'+directions+'</div>');
	$('.wzp_directions').prepend('<h2>'+directions_title+'</h2>');

  
  // notatka...
  notes_title 	= $('.note .header h3').text();
  notes     	= $('#notetoedit').html();
	
  $('.wzp_right_pannel').append('<div class="wzp_notes">'+notes+'</div>');
  $('.wzp_notes').prepend('<h2>'+notes_title+'</h2>');
    
  if($('#notetoedit').text().replace(/\s/g,'').length === 0){
	  $('.wzp_notes').css({display: 'none'});
  }

  // i stopka...
  $('.wzp_recipe').after('<footer></footer>');

  author_first  = $('.author .first').text();
  author_nick   = $('.author .nick').text();
  date          = $('.author .date').text();

	$('footer').append('<div class="wzp_date">'+date+'</div>'+
						'<div class="wzp_author">'+author_first+''+author_nick+'</div>')

	$('.boxContent').remove();
	if(location.pathname.substr(1,location.pathname.substr(1).indexOf('/')) != 'przepisy'){
		$('.'+elements_surname+'section').remove();
	}


  /* stylowanie elementów */

  // style nadrzędne elementów
  $('body').css({
    margin: '0px',
		background: '#FFFFFF',
    fontFamily: '"Myriad Pro",Arial,Helvetica,sans-serif',
    fontSize: '0.15in'
  });

  // stylowanie wrappera
  $('#main').css({
    position: 'absolute',
		left: '61%',
		margin: '50px -4.135in',
		width: '8.27in'
  });

  // stylowanie nagłówka
  $('.boxHeader').css({
    padding: '0px 0px 0.3in 0px',
    borderBottom: '1px dashed #7d7d7d'
  });
  $('.wzp_title').css({
    display: 'inline-block',
    width: '80%',
    fontSize: '0.35in',
    fontWeight: 'bold'
  });
  $('.wzp_serves').css({
    display: 'inline-block',
    width: '20%',
    fontSize: '0.15in',
    textAlign: 'right'
  });

  // stylowanie paneli nowego przepisu
  $('.wzp_recipe').css({
	display: 'table',
    marginTop: '0.4in'
  });
  $('.wzp_left_pannel').css({
    display: 'table-cell',
    boxSizing: 'border-box',
    paddingRight: '0.38in',
    width: '40%',
    borderRight: '1px dashed #7d7d7d',
    verticalAlign: 'top',
    textAlign: 'center',
	fontSize: '0.15in'
  });
  
  $('.wzp_right_pannel').css({
	display: 'table-cell',
	boxSizing: 'border-box',
	paddingLeft: '0.38in',
	width: '60%',
	verticalAlign: 'top',
	fontSize: '0.15in'
  });
  if(location.pathname.substr(1,location.pathname.substr(1).indexOf('/')) != 'przepisy'){
	  $('.wzp_left_pannel').css({
		display: 'none'
	  });
		
	  $('.wzp_right_pannel').css({
		paddingLeft: '0',
		width: '100%'
	  });
  }
  $('.wzp_ingredients').css({
    textAlign: 'left'
  });
  $('.wzp_ingredients h2, .wzp_directions h2, .wzp_notes h2').css({
    margin: '0px 0px 0.2in 0px',
    padding: '0px',
    fontSize: '0.22in',
  });
  $('.wzp_notes h2').css({
    margin: '0.5in 0px 0.2in 0px',
  });
  $('.wzp_left_pannel img').css({
    margin: '0.25in auto 0px',
    width: '2.6in'
  });
  $('.wzp_ingredients, .wzp_directions, .wzp_notes').css({
    fontFamily: 'Verdana',
  });

  // stylowanie stopki
  $('footer').css({
    marginTop: '0.4in',
    padding: '0.3in 0px 0px 0px',
    borderTop: '1px dashed #7d7d7d',
    fontSize: '0.14in'
  });
  $('footer .wzp_date').css({
    display: 'inline-block',
    width: '50%',
    textAlign: 'left'
  });
  $('footer .wzp_author').css({
    display: 'inline-block',
    width: '50%',
    textAlign: 'right'
  });
  
  
  
  
  
	/* kopia zapsowa */
	backup	= [];
	backup['title']			= $('.wzp_title').text();
	backup['ingredients']	= $('.wzp_ingredients').html();
	backup['directions']	= $('.wzp_directions').html();
	backup['notes']			= $('.wzp_notes').html();
  
  
  
	/* paginacja */
	function check_page_height(){
		recipe_height 	= parseInt($('.boxTxt').height());
		pages_height	= parseInt($('.page_tpl').length)*parseInt($('.page_tpl').last().outerHeight());
		
		if(recipe_height > pages_height){
			$('#main').append('<div class="wzp_no_printed page_tpl" style="position: absolute; z-index: -1; width: 0in; height: 12.1875in; top: '+(parseInt($('.page_tpl').last().outerHeight())+parseInt($('.page_tpl').last().offset().top))+'px; left: 50%; margin-left: -4.135in;"></div>');
		}else if(recipe_height < pages_height-parseInt($('.page_tpl').last().outerHeight())){
			$('.page_tpl').last().remove();
		}
		
		$('.wzp_options .wzp_pages_info').text('Szacowana ilość stron: '+parseInt($('.page_tpl').length))
		
		return parseInt($('.page_tpl').length);
	}
	
	
	
	
  
    /* kontroler wydruku */
	$('body').append('<div id="inch_test"></div>');
	$('#inch_test').css({
		width: '1in',
		height: '0'
	});
	ppi = parseInt($('#inch_test').css('width'));
  
  
  
    /* opcje menadżera wydruku */
  $('#main').before('<div class="wzp_options wzp_no_printed"></div>');
  $('.wzp_options').css({
	position: 'fixed',
	top: '0px',
	left: '0px',
	zIndex: '10',
	width: '21%',
	minWidth: '290px',
	height: '100%',
	boxSizing: 'border-box',
    background: 'rgba(137,176,67,0.5)',
    color: '#fff',
    textAlign: 'center'
  });
  
	$('.wzp_options').prepend('<header class="wzp_no_printed"></header>');
	$('.wzp_options header').append('<div></div>');
	$('.wzp_options header div').append('<h1>Menedżer wydruku</h1>');
	$('.wzp_options header div').append('<a target="_BLANK" href="//greasyfork.org/pl/scripts/11599-wielkie%C5%BBarcieprinter" title="Przejdź do strony skryptu">Wersja 2.8</a>');
	$('.wzp_options header div').append('<a target="_BLANK" href="//dapi.net.pl" title="Przejdź do strony autora">Created by Dapi</a>');
	
	var id				= window.location.pathname.replace('/przepisy/','');
	wzp_minimised 		= JSON.parse(unsafeWindow.localStorage.getItem("wzp_minimised_previews"));
	deactive_icon_prev_class = '';
	deactive_icon_next_class = '';
	
	if(wzp_minimised){
		deactive_icon_prev_class_ctrl = 0;
		for(var n=0; n<wzp_minimised.length; n++){
			if(wzp_minimised[n][0] == id){
				deactive_icon_prev_class_ctrl = 1;
			}
		}
		if(!deactive_icon_prev_class_ctrl){
			deactive_icon_prev_class = 'deactive_icon';
		}
		
		if(wzp_minimised.length<1 || (wzp_minimised.length==1 && wzp_minimised[0][0] == id)){
			deactive_icon_prev_class = 'deactive_icon';
			deactive_icon_next_class = 'deactive_icon';
		}
		
		if((wzp_minimised.length==1 && wzp_minimised[0][0] != id) || wzp_minimised[wzp_minimised.length-1][0] == id){
			deactive_icon_prev_class = 'deactive_icon';
		}
		
		if(wzp_minimised[0][0] == id){
			deactive_icon_next_class = 'deactive_icon';
		}
	}else{
		deactive_icon_prev_class = 'deactive_icon';
		deactive_icon_next_class = 'deactive_icon';
	}
	
	$('.wzp_options').append('<nav class="wzp_no_printed"></nav>');
	$('.wzp_options nav').append('<div class="wzp_close wzp_no_printed" title="'+((parent.location.href.indexOf('latest') != -1)?'Wróć do przeglądanych':'Wróć do przepisu')+' ([ESC])">&#10799;</div>');
	$('.wzp_options nav').append('<div class="wzp_minimise wzp_no_printed" title="Minimalizuj ten podgląd ([CTRL]+[ALT]+[M])">&#9149;</div>');
	$('.wzp_options nav').append('<div class="wzp_prev wzp_no_printed '+(deactive_icon_prev_class)+'" title="Poprzedni zminimalizowany ([CTRL]+[ALT]+[,])">&#x25C2;</div>');
	$('.wzp_options nav').append('<div class="wzp_next wzp_no_printed '+(deactive_icon_next_class)+'" title="Następny zminimalizowany ([CTRL]+[ALT]+[.])">&#x25B8;</div>');
	$('.wzp_options nav').append('<div class="wzp_reset wzp_no_printed deactive_icon" title="Cofnij wszystkie zmiany ([CTRL]+[ALT]+[C])">&#x27F2;</div>');
	$('.wzp_options nav').append('<div class="wzp_print wzp_no_printed" title="Drukuj przepis ([CTRL]+[P])">&#x2399;</div>');
	
	$('.wzp_options header').css({
		width: '100%',
		padding: '1.4vw 0px',
		background: '#89b043'
	});
	$('.wzp_options header div').css({
		display: 'table',
		margin: 'auto',
	});
	$('.wzp_options header h1').css({
		margin: '5px 0px 5px 0px',
		color: '#fff',
		fontSize: '23px',
		fontWeight: 'bold',
	});
	$('.wzp_options header a').css({
		color: '#fff',
		fontSize: '10px',
		textDecoration: 'none'
	});
	$('.wzp_options header a:eq(0)').css({
		float: 'left'
	});
	$('.wzp_options header a:eq(1)').css({
		float: 'right'
	});
	
	$('.wzp_options nav').css({
		display: 'table',
		width: '100%',
		background: '#46afdb',
	});
	$('.wzp_options nav div').css({
		display: 'inline-block',
		margin: '0px auto',
		verticalAlign: 'middle',
		boxSizing: 'border-box',
		width: '41px',
		height: '35px',
		border: '1px solid rgba(255,255,255,0.2)',
		borderWidth: '0px 1px 0px 0px',
		fontSize: '24px',
		cursor: 'pointer'
	});
	$('.wzp_options nav div:eq(0)').css({
		borderWidth: '0px 1px 0px 1px',
	});
  
  
	if(window.navigator.userAgent.indexOf('Firefox') != -1) {
		$('.wzp_options').append('<div class="wzp_option wzp_grayscale"><label for="wzp_grayscale">Wydruk w skali szarości</label><input type="checkbox" id="wzp_grayscale"></div>');
	}
	if(photo.length != 0){
		$('.wzp_options').append('<div class="wzp_option wzp_hideimg"><label for="wzp_hideimg">Ukryj zdjęcie</label><input type="checkbox" id="wzp_hideimg"></div>');
	}
	if(parseInt(serves) > 0){
		$('.wzp_options').append('<div class="wzp_option wzp_hideserves"><label for="wzp_hideserves">Ukryj ilość porcji</label><input type="checkbox" id="wzp_hideserves"></div>');
	}
	if(notes.indexOf('brak notatki') == -1){
		$('.wzp_options').append('<div class="wzp_option wzp_note"><label for="wzp_note">Pokaż moją notatkę</label><input type="checkbox" id="wzp_note" checked></div>');
	}
	$('.wzp_options').append('<div class="wzp_option wzp_editable"><label for="wzp_editable">Włącz edycję treści</label><input type="checkbox" id="wzp_editable"></div>');
	$('.wzp_options').append('<div class="wzp_option wzp_scale"><label for="wzp_scale">Wielkość czcionki</label><br><input type="range" step="0.5" min="5" max="15" id="wzp_scale"></div>');
  
	$('.wzp_options').append('<div class="wzp_print_btns"></div>');
	$('.wzp_print_btns').append('<div class="wzp_option wzp_pages_info">Ilość stron: nieznana</div>');
   
	$('.wzp_options').append('<div style="position: absolute; width: 100%; height: 100%; top: 0px; left: 0px; background: transparent url(http://wielkiezarcie.com/img/body_bg.jpg); z-index: -1;"></div>');
  
	$('.wzp_options .wzp_option').css({
		display: 'inline-block',
		boxSizing: 'border-box',
		padding: '10px 10%',
		width: '18vw',
		minWidth: '290px',
		verticalAlign: 'middle',
		fontSize: '15px',
		color: '#fff',
		fontFamily: 'Arial',
		textAlign: 'left',
	});
	$('.wzp_options .wzp_option').first().css({
		marginTop: '100px'
	}); 
	
	$('.wzp_options .wzp_option input').css({
		'float': 'right'
	});
	$('.wzp_options .wzp_option input[type=range]').css({
		width: '97%',
		margin: '7px 1%',
	});
	$('.wzp_options .wzp_pages_info').css({
		textAlign: 'center'
	});
  
	function reset_recipe(){
		if(any_changes[0]+any_changes[1]+any_changes[2]+any_changes[3]+any_changes[4]+any_changes[5]+any_changes[6] != 0){
			if(confirm('Czy na pewno chcesz cofnąć wszystkie wprowadzone zmiany treści i zresetować ustawienia wydruku?')){
				if($('.wzp_grayscale > input[type=checkbox]').prop('checked')){
					$('.wzp_grayscale > input[type=checkbox]').click();
				}
				if($('.wzp_editable > input[type=checkbox]').prop('checked')){
					$('.wzp_editable > input[type=checkbox]').click();
				}
				if(!$('.wzp_note > input[type=checkbox]').prop('checked')){
					$('.wzp_note > input[type=checkbox]').click();
				}
				if($('.wzp_hideimg > input[type=checkbox]').prop('checked')){
					$('.wzp_hideimg > input[type=checkbox]').click();
				}
				if($('.wzp_hideserves > input[type=checkbox]').prop('checked')){
					$('.wzp_hideserves > input[type=checkbox]').click();
				}
				$('.wzp_scale > input[type=range]').val('10').change();
					
				$('.wzp_title').text(backup['title']);
				$('.wzp_ingredients').html(backup['ingredients']);
				$('.wzp_directions').html(backup['directions']);
				$('.wzp_notes').html(backup['notes']);
					
				pages_temp = check_page_height();
				while(check_page_height() != pages_temp){
					pages_temp = check_page_height();
				}
			}
			any_changes = [0,0,0,0,0,0,0];
			$('.wzp_reset').addClass('deactive_icon');
		}
	}
  
	any_changes = [0,0,0,0,0,0,0];
	//setInterval(function(){console.log(any_changes+' '+any_changes[0]+any_changes[1]+any_changes[2]+any_changes[3]+any_changes[4]+any_changes[5]+any_changes[6])},5000)
	$('body').on('change', '.wzp_grayscale > input[type=checkbox]', function(){
		if($('.wzp_grayscale > input[type=checkbox]').prop('checked')){
			$('#main').css({
				filter: 'grayscale(100%)'
			});
			any_changes[0] = 1;
		}else{
			$('#main').css({
				filter: 'grayscale(0%)'
			});
			any_changes[0] = 0;
		}
	}).on('change', '.wzp_editable > input[type=checkbox]', function(){
		if($('.wzp_editable > input[type=checkbox]').prop('checked')){
			$('.wzp_notes, .wzp_directions, .wzp_ingredients, .wzp_title').attr('contenteditable','true');
			$('.wzp_notes > h2, .wzp_directions > h2, .wzp_ingredients > h2').attr('contenteditable','false');
			any_changes[1] = 1;
		}else{
			$('.wzp_notes, .wzp_directions, .wzp_ingredients, .wzp_title').attr('contenteditable','false');
			any_changes[1] = 0;
		}
	}).on('change', '.wzp_note > input[type=checkbox]', function(){
		if($('.wzp_note > input[type=checkbox]').prop('checked')){
			if(notes.indexOf('brak notatki') == -1){
				$('.wzp_right_pannel .wzp_notes').css({display:'unset'});
				any_changes[2] = 1;
			}
		}else{
			$('.wzp_right_pannel .wzp_notes').css({display:'none'});
			any_changes[2] = 0;
		}
		check_page_height();
	}).on('change', '.wzp_hideimg > input[type=checkbox]', function(){
		if($('.wzp_hideimg > input[type=checkbox]').prop('checked')){
			$('.wzp_left_pannel img').css({display:'none'});
			any_changes[3] = 1;
		}else{
			$('.wzp_left_pannel img').css({display:'unset'});
			any_changes[3] = 0;
		}
		check_page_height();
	}).on('change', '.wzp_hideserves > input[type=checkbox]', function(){
		if($('.wzp_hideserves > input[type=checkbox]').prop('checked')){
			$('.boxHeader .wzp_serves').css({display:'none'});
			any_changes[6] = 1;
		}else{
			$('.boxHeader .wzp_serves').css({display:'inline-block'});
			any_changes[6] = 0;
		}
		check_page_height();
	}).on('change', '.wzp_scale > input[type=range]', function(){
		if($(this).val() != 10){
			any_changes[4] = 1;
		}else{
			any_changes[4] = 0;
		}
		$('#main *').each(function(){
			basic_fs 	= $(this).attr('data-fontSize');
			new_fs 		= ($('.wzp_scale > input[type=range]').val()/10)*basic_fs;
			$(this).css({fontSize: new_fs+'in'});
		});
		check_page_height();
	}).on('click', '.wzp_close', function(){
		closePreview();
	}).on('click', '.wzp_minimise', function(){
		minimisePreview();
	}).on('click', '.wzp_prev', function(){
		if($(this).attr('class').indexOf('deactive_icon') == -1){
			changeMinimise('prev');
		}
	}).on('click', '.wzp_next', function(){
		if($(this).attr('class').indexOf('deactive_icon') == -1){
			changeMinimise('next');
		}
	}).on('click', '.wzp_reset', function(){
		reset_recipe();
	}).on('click', '.wzp_print', function(){
		window.print();
	}).on('keyup', '.wzp_title, .wzp_ingredients, .wzp_directions, .wzp_notes', function(){
		any_changes[5] = 1;
		if(any_changes[0]+any_changes[1]+any_changes[2]+any_changes[3]+any_changes[4]+any_changes[5]+any_changes[6] != 0){
			$('.wzp_reset').removeClass('deactive_icon')
		}else{
			$('.wzp_reset').addClass('deactive_icon');
		}
	}).on('change', 'input[type=checkbox], input[type=range]', function(){
		if(any_changes[0]+any_changes[1]+any_changes[2]+any_changes[3]+any_changes[4]+any_changes[5]+any_changes[6] != 0){
			$('.wzp_reset').removeClass('deactive_icon')
		}else{
			$('.wzp_reset').addClass('deactive_icon');
		}
	});
	
  // paginacja
  $('.wzp_title, .wzp_left_pannel, .wzp_right_pannel').keyup(function(){
		check_page_height();
  });
  
  if($('.page_tpl').index() == -1){
	$('#main').append('<div class="wzp_no_printed page_tpl" style="position: absolute; z-index: -1; width: 0in; height: 12.1875in; top: '+($('#main').offset().top)+'px; left: 50%; margin-left: -4.135in;"></div>');
  }
  check_page_height();
  
  $('#main *').each(function(){
	fs = parseInt($(this).css('font-size'))/96;
	$(this).attr('data-fontSize', fs).css({fontSize: fs+'in'});
  });
 
  
  $('body').append('<style>'+
						'@media print {'+
							'.wzp_no_printed{display: none;}'+
							'#main{position: static !important; left: 0!important; margin: auto!important;}'+
						'}'+
						'.wzp_options nav div{transition: 200ms all;}'+
						'.wzp_options nav div:hover{background: #008AD5;}'+
						'.wzp_options nav .deactive_icon{background: #6B6B6B !important; color: #8f8f8f !important; cursor: default !important}'+
					'</style>');
  	
	$(document).bind("keydown", function(e){
		if(e.keyCode == 27){
			e.preventDefault();
			closePreview();
		}else if(e.keyCode == 77 && e.altKey && e.ctrlKey){
			e.preventDefault();
			minimisePreview();
		}else if(e.keyCode == 67 && e.altKey && e.ctrlKey){
			e.preventDefault();
			reset_recipe();
		}else if(e.keyCode == 188 && e.altKey && e.ctrlKey){
			e.preventDefault();
			if($('.wzp_prev').attr('class').indexOf('deactive_icon') == -1){
				changeMinimise('prev');
			}
		}else if(e.keyCode == 190 && e.altKey && e.ctrlKey){
			e.preventDefault();
			if($('.wzp_next').attr('class').indexOf('deactive_icon') == -1){
				changeMinimise('next');
			}
		}else if(e.which == 66 && e.altKey && e.ctrlKey){
			document.execCommand("Bold", false, null);
		}else if(e.keyCode == 73 && e.altKey && e.ctrlKey){
			document.execCommand("Italic", false, null);
		}else if(e.keyCode == 85 && e.altKey && e.ctrlKey){
			document.execCommand("Underline", false, null);
		}else if(e.keyCode == 76 && e.altKey && e.ctrlKey){
			document.execCommand("justifyLeft", false, null);
		}else if(e.keyCode == 69 && e.altKey && e.ctrlKey){
			if($('.wzp_editable > input[type=checkbox]').prop('checked')){
				e.preventDefault();
			}
			document.execCommand("justifyCenter", false, null);
		}else if(e.keyCode == 82 && e.altKey && e.ctrlKey){
			document.execCommand("justifyRight", false, null);
		}
	});
}


$('body').on('click', '.wzp_minimise_tab', function(){
	closePreview(true);
	openPreview($(this).attr('data-wzp_minimise_href'));
});
	
if(window.location.search.substring(1).indexOf('printview') != -1){
	printPreview();
	
// }else if(window.location.href.indexOf('latest') != -1 || window.location.href.indexOf('przepisy/group') != -1){
// 	write_minimised();
// 	window.wzp_print_preview = false;
// 	$('.mainArticleList .article .details').each(function(){
// 		address = $(this).parent().children('.photo').children('a').attr('href');
// 		$(this).children('a:eq('+($(this).children('a').length-1)+')').after('<a href="'+address+'?printview" class="more wzp_men_trigger">&gt; Menadżer wydruku</a></li>');
// 	});
	
	
// 	$('body').on('click', '.wzp_men_trigger', function(e){
// 		if(!e.ctrlKey && !window.wzp_print_preview){
// 			openPreview($(this).attr('href').replace('?printview',''));
// 			return false;
// 		}
// 	});
	
}else{
	write_minimised();
	window.wzp_print_preview = false;
	
	if (window.location.href.indexOf('przepisy') != -1 || window.location.href.indexOf('artykuly') != -1) {
		if ($('.boxTxt .boxContent .tools').find('a').last().text() === 'Drukuj'){
			$('.boxTxt .boxContent .tools').find('a').last().remove();
		}
		
		if ($('.boxTxt .boxContent .tools').length === 0){
			if (window.location.href.indexOf('artykuly') != -1) {
				$('.articleView .author').after('<div class="tools"><div class="clear"></div></div>');
			} else {
				$('#galsld').after('<div class="tools"><div class="clear"></div></div>');
			}
		}
		
		
		if (window.location.href.indexOf('artykuly') != -1) {
			$('.articleView .tools .clear').before('<a href="'+window.location+'?printview" class="wzp_men_trigger" title="Menadżer wydruku ([CTRL]+[P])">Menadżer wydruku</a>');
		} else {
			$('.boxTxt .boxContent .tools .clear').before('<a href="'+window.location+'?printview" class="wzp_men_trigger" title="Menadżer wydruku ([CTRL]+[P])">Menadżer wydruku</a>');
		}
	}
	
  $('.articlebox').each(function(){
		var url = $(this).children('a').attr('href');
		$(this).children('.author').append('<div><a href="'+url+'?printview" class="wzp_men_trigger" title="Menadżer wydruku">Menadżer wydruku</a></div>');
	});
	
	$('.articlebox').on('mouseenter', function(){
    $(this).children('.author').stop().animate({height: '40px'});
	}).on('mouseleave', function(){
    $(this).children('.author').stop().animate({height: '20px'});
	});
	
	$('body').on('click', '.wzp_men_trigger', function(e){
		if(!e.ctrlKey && !window.wzp_print_preview){
			openPreview($(this).attr('href').replace('?printview',''));
			return false;
		}
	});
	
	window.onbeforeprint = function(e){
		if(window.location.href.indexOf('przepisy') != -1 || window.location.href.indexOf('artykuly') != -1) {
			if(!window.wzp_print_preview){
				openPreview(window.location.href);
			}
			e.preventDefault();
			e.stopImmediatePropagation();
			return false;
		}
	}
	
	$(document).bind("keyup keydown", function(e){
		if((e.key == "p" || e.charCode == 16 || e.charCode == 112 || e.keyCode == 80) && e.ctrlKey && !window.wzp_print_preview){
			if(window.location.href.indexOf('przepisy') != -1 || window.location.href.indexOf('artykuly') != -1) {
				e.preventDefault();
				e.stopImmediatePropagation();
				openPreview(window.location.href);
			}
		}
	});
}

  $('body').append('<style>'+
						'.wzp_minimise_tab{transition: 200ms all;}'+
						'.wzp_minimise_tab:hover{background: #008AD5 !important}'+
					'</style>');