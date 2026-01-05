// ==UserScript==
// @name       More UI part4
// @namespace  http://use.i.E.your.homepage/
// @version    v1.0.2.1
// @description The fourth part to The GT UI+
// @match      http://www.ghost-trappers.com/fb/*
// @copyright  2015+, GTNoAPI
// @grant      GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12102/More%20UI%20part4.user.js
// @updateURL https://update.greasyfork.org/scripts/12102/More%20UI%20part4.meta.js
// ==/UserScript==

initUIv4();

function initUIv4(){
	
	
	var word_container = $('.wordsWithGhostsContainer').css({
		'position': 'relative',
		'cursor': 'pointer'
	});
	
	var form = $('<form></form>').css({
		'width':'187px',
		'position': 'absolute',
		'top': '84px',
		'left': '0px',
		'display':'none',
		'background-color': '#fff',
		'padding': '5px'
	});
		
	
	
	var word = $('.campWordsWithGhostsChar').html();
	
	
	$('.campWordsWithGhostsChar')[0].addEventListener('click', function(){
		if(form.css('display') == 'none'){
			form.show();
		}
		else{
			form.hide();
		}
	});
	
	
	($('<div class="form-group"></div>')
		.append($('<label>types (max 3 choices):</label>'))
	 	.append($('<select class="ghost-type" multiple></select>').css({'width':'100%','border': '1px solid rgb(34, 34, 34)'})
				.append('<option value="Normal">Normal</option>')
				.append('<option value="Midnight">Midnight</option>')
				.append('<option value="Alien">Alien</option>')
				.append('<option value="Party">Party</option>')
				.append('<option value="Rhombus red">Rhombus red</option>')
				.append('<option value="Gaussgreen">Gaussgreen</option>')
				.append('<option value="Ultraviolet">Ultraviolet</option>')
				.append('<option value="Infrayellow">Infrayellow</option>')
				.append('<option value="Nightmare">Nightmare</option>')
				.append('<option value="Special">Special</option>')
				.append('<option value="Minion">Minion</option>')
				.append('<option value="Boss">Boss</option>')
				.append('<option value="Mystic-resistant">Mystic-resistant</option>')
				.append('<option value="Monster">Monster</option>')
				.append('<option value="Brute force">Brute force</option>')
				.append('<option value="Gift">Gift</option>')
				.append('<option value="Vintage">Vintage</option>')
			   )
	 	.append($('<label>location:</label>'))
		.append($('<select class="ghost-location"></select>').css({'width':'100%','border': '1px solid rgb(34, 34, 34)'})
				.append('<option value="All regions">All regions</option>')
				.append('<option value="Alien visitors">Alien visitors</option>')
				.append('<option value="Region 1: Dumfries and Galloway">Region 1: Dumfries and Galloway</option>')
				.append('<option value="Region 2: Borders">Region 2: Borders</option>')
				.append('<option value="Region 3: Strathclyde">Region 3: Strathclyde</option>')
				.append('<option value="Region 4: Lothian">Region 4: Lothian</option>')
				.append('<option value="Region 5: Fife">Region 5: Fife</option>')
				.append('<option value="Region 6: Central">Region 6: Central</option>')
			   ))
	.appendTo(form);
	
	($('<div class="form-group"></div>').append($('<a class="filter">filter</a>').css({
		'padding': '5px 12px',
		'background-color': 'rgb(34, 51, 65)',
		'border': '1px solid rgb(34, 34, 34)',
		'text-decoration': 'none',
		'color': 'white',
		'text-transform':' uppercase',
		'font-weight': 'bold',
		'display': 'inline-block',
		'margin-top': '20px'
	}))).appendTo(form);
	
	
	form.appendTo(word_container);
	
	$('.form-group').css({
		'font-size': '16px',
		'float':'left'
	});
	
	
	
	var button = $('.form-group').find('.filter');
	
	button[0].addEventListener('click', function(){
		var types = $(".ghost-type");
		var filter = [];
		var url = 'https://gtnoapi.herokuapp.com/api/ghosts/search?';
		
		var length = 0;
		for(var x = 0; x < types.length; x++){
			var input = $(types[x]).find('option');
			filter = [];
			var count = 0;
			for(var y = 0; y < input.length; y++){
				if($(input[y]).attr('selected')){
					if(length == 0){
						url += 'type'+(count+1) +'='+ $(input[y]).val();
					}
					else{
						url += '&type'+(count+1) +'='+ $(input[y]).val();
					}
					length++;
					count++;
				}
			}
		}
		
		
		var types = $(".ghost-location");
		for(var x = 0; x < types.length; x++){
			var input = $(types[x]).find('option');
			filter = [];
			var count = 0;
			for(var y = 0; y < input.length; y++){
				if($(input[y]).attr('selected')){
					if(length == 0){
						url += 'location'+(count+1) +'='+ $(input[y]).val();
					}
					else{
						url += '&location'+(count+1) +'='+ $(input[y]).val();
					}
					
					length++;
					count++;
				}
			}
		}
		
		
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			headers: {
				"Accept": "application/json",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
				
				if($('.popup-moreUIv4-result').length > 0){
					$('.popup-moreUIv4-result').remove();
				}
				
				$('.campWordsWithGhostsChar').css('color', '#223341');
				var childEle = $('<div class="popup-moreUIv4-result"></div>').css({
								'position': 'absolute',
								'top': '0',
								'right': '120px',
								'z-index': '9999999',
								'font-size': '14px',
								'display': 'none',
								'background-color': '#223341',
								'border': '1px solid #222',
								'border-radius': '7px',
								'padding': '10px',
								'width':'400px'
							});
				
				var db = getGhostFromDB(rD.response);
				
				for(var x = 0; x< db.length; x++){
					if(db[x].name.indexOf(word) == 0){
						($('<div></div>').css('color', 'white').html(db[x].name + ': ' +(db[x].location[1]? ' ' + db[x].location[1]:'')+(db[x].location[2]? ', ' + db[x].location[2]:''))).appendTo(childEle);
					}
				}
				
				childEle.appendTo(word_container);
				
				$('.campWordsWithGhostsChar').hover(function(){
					if($(childEle).css('display')=='none'){
						$(childEle).show();
						$(this).css('color', '#fff');
					}
					else{
						$(childEle).hide();
						$(this).css('color', 'inherit');
					}
				});
			}
		});
	});
	
	
}

function getGhostFromDB(jsonTxt){
	
	var obj = jQuery.parseJSON(jsonTxt);
	var result = [];
	for(var x = 0; x < obj.length; x++){
		result.push({
					'name':obj[x].name,
					'location':obj[x].location,
					'type':obj[x].type,
					'loot':obj[x].loot,
				})
		
	}
	
	return result;
}