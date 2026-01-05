// ==UserScript==
// @name       More UI part3
// @namespace  http://use.i.E.your.homepage/
// @version    1.0.2.1
// @description The third part to The GT UI+
// @match      http://www.ghost-trappers.com/fb/camp.php*
// @match      http://www.ghost-trappers.com/fb/hunt.php*
// @copyright  2015+, GTNoAPI
// @grant      GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12005/More%20UI%20part3.user.js
// @updateURL https://update.greasyfork.org/scripts/12005/More%20UI%20part3.meta.js
// ==/UserScript==

initUIv3();

function initUIv3(){
	GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://www.ghost-trappers.com/fb/scotch_ninth_floor.php?page=exhibition&currentPage=-2',
			headers: {
				"Accept": "text/html",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
                var text = rD.responseText;

				$('<div class="UserSricpt_exhibition_container"></div>').appendTo('#header');
				
				$('<div class="exhibition_container"></div>').appendTo('.UserSricpt_exhibition_container');
				
				var container = $('.exhibition_container');
				
				
				$('.UserSricpt_exhibition_container').css('position','absolute');
				$('.UserSricpt_exhibition_container').css('top','150%');
				$('.UserSricpt_exhibition_container').css('left','-27%');
				$('.UserSricpt_exhibition_container').css('color','#fff');
				var rgx = text.match(/<div class="souvenirPartsLine " >[\s\nA-Za-z0-9<=>"'\/_.?!]*<\/div>/gi);
				var array = [];
				var temp = stringRep(text);
				for(var x = 0; x< rgx.length; x++){
					var rgxImg = rgx[x].match(/src(.*)\w/gi);
					array[x] = [];

					($('<a href="http://www.ghost-trappers.com/fb/scotch_ninth_floor.php?page=exhibition&currentPage=-2" class="exhibition-collection" id="exhibition-collection-'+x+'"></a>')
					 	.css('position', 'relative'))
						.appendTo(container);
					
					var item_container = $('#exhibition-collection-'+x);
				
					if(x < rgx.length-1){
						for(var y=0; y < rgxImg.length-1; y++){
							($('<img '+ rgxImg[y] + '" data-target="'+x+'_'+y+'"/>')
							 .css('width', '10%'))
							.appendTo(item_container);
					
							($('<div id="'+x+'_'+y+'"></div>').css({
								'position': 'absolute',
								'z-index': '9999999',
								'font-size': '14px',
								'display': 'none',
								'background-color': '#223341',
								'border': '1px solid #222',
								'border-radius': '7px',
								'padding': '10px',
								'min-width': '150px'
							}))
							.appendTo(item_container);
						}
					}
					else{
						for(var y=0; y < rgxImg.length; y++){
							($('<img '+ rgxImg[y] + '"/>').css('width', '10%'))
							.appendTo(item_container);
						}
					}
				}
		
				
				$('.UserSricpt_exhibition_container').find('.exhibition-collection').css({
					'display':'block',
					'color':'white',
					'position':'relative',
					'padding':'10px',
					'margin-top':'10px',
					'border-radius':'15px',
					'font-size':'14px',
					'width':'607px',
					'z-index': '9999',
					'display': 'none'
				});
				
				
				container.css({
					'position': 'absolute',
					'left' : '183px',
					'top': '-89px',
					'background-color': 'rgba(0, 0, 0, 0.6)',
					'z-index': '999'
				});
				
				
				$('.UserSricpt_exhibition_container').prepend($('<button>toggle exhibition</button>'));
	
				var button = $('.UserSricpt_exhibition_container').find('button');

				button.css({
					'position':'absolute',
					'left':'0px',
					'color': 'white',
					'font-weight':'bold',
					'font-size': '16px',
					'text-shadow': '1px 1px black',
					'padding': '3px 8px',
					'border': '1px solid rgb(206, 174, 7)',
					'border-radius':'5px',
					'background-color': 'gold',
					'z-index': '99999999',
					'width': '153px'
				});

				button[0].addEventListener("click", function(){

					if($('.UserSricpt_exhibition_container').find('.exhibition-collection').css('display') == 'none'){
						$('.UserSricpt_exhibition_container').find('.exhibition-collection').css({
							'display': 'block'
						});
					}
					else{
						$('.UserSricpt_exhibition_container').find('.exhibition-collection').css({
							'display': 'none'
						});
					}
				});
			}
		});
	
	
	
	GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://gtnoapi.herokuapp.com/api/ghosts',
			headers: {
				"Accept": "application/json",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
				$('.exhibition-collection').each(function(){
					var ghostEncounter = $(this).find('img');
					
					
					ghostEncounter.each(function(){
						var link = $(this).attr('src');
						var label = $(this).next('div');
						
						var item = link.substr(link.lastIndexOf('/')+1, link.length - link.lastIndexOf('/')-5);
						item = item.replace(/_/ig,' ');
						
						
						if(item.indexOf('04') != -1){
							item = item.substr(3);
						}
						
						if(item.lastIndexOf('grey') != -1){
							item = item.substr(0, item.lastIndexOf('grey')-1);
						}

						var obj = jQuery.parseJSON(rD.response);
						var result = [];
						for(var x = 0; x < obj.length; x++){
							result.push(new Ghost(obj[x].name, obj[x].type, obj[x].location, obj[x].loot));
						}
						
						for(var x = 0; x < result.length; x++){
							for(var y = 0; y<result[x].getLoot().length; y++){
								if(result[x].getLoot()[y].toLowerCase() == item){
									label.html(result[x].getName() + '<br />' + 
											   'type: ' + result[x].getType()[0] +(result[x].getType()[1] ? ', '+ result[x].getType()[1]: '') + (result[x].getType()[2] ? ', '+ result[x].getType()[2]: '')+ '<br />'+
											    'location: ' + result[x].getLocation()[0] +(result[x].getLocation()[1] ? ', '+ result[x].getLocation()[1]: '') + (result[x].getLocation()[2] ? ', '+ result[x].getLocation()[2]: '')
											  );
								}
							}
							
						}
						
						$(this).hover(function(e){
							var parentOffset = $(this).offset();
							var relX = e.pageX - 570;
							var relY = -20;
							
							
							if(label.html() && label.css('display') == 'none'){
								$(this).next('div')
								.show()
								.css({
									'top':relY,
									'left': relX
								});
							}
							else{
								$(this).next('div').hide();
							}
							
						})
						
					});
					
				});
			}
		});
}


function stringRep(text){
	var rgx = text.match(/<div class="souvenirSetContainer" >(\n(.*?))*.?(<div class="seperatorLine">)/gi);
	var array = [];
	for(var x = 0; x < rgx.length; x++){
		var name = rgx[x].match(/<div class="souvenirTopLeft">(\n(.*?))*.?(<\/img>)/gi);
		name = name[0].substr(name[0].indexOf('souvenirs')+'souvenirs'.length+1, (name[0].lastIndexOf('"')-(name[0].indexOf('souvenirs')+'souvenirs'.length+5)));
		
		if(name.indexOf('04_headline') > -1){
			name = name.substr(name.indexOf('04_headline')+'04_headline'.length+1);
		}
		else if(name.indexOf('headline') > -1){
			name = name.substr(name.indexOf('headline')+'headline'.length+1);
		}
		
		name = name.replace(/_/ig,' ');
		array.push(name);
	}
	
	return array;
}

var Ghost = function(name, type, location, loot) {
  	this.name = name;
	this.type = type;
	this.location = location;
	this.loot = loot;
};

Ghost.prototype.getName = function(){
	return this.name;
}

Ghost.prototype.getType = function(){
	return this.type;
};

Ghost.prototype.getLoot = function(){
	return this.loot;
};

Ghost.prototype.getLocation = function(){
	return this.location;
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