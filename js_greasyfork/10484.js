// ==UserScript==
// @name       More UI part1
// @namespace  http://use.i.E.your.homepage/
// @version    1.0
// @description The first part to The GT UI+
// @match      http://www.ghost-trappers.com/fb/camp.php*
// @match      http://www.ghost-trappers.com/fb/hunt.php*
// @copyright  2015+, GTNoAPI
// @grant      GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/10484/More%20UI%20part1.user.js
// @updateURL https://update.greasyfork.org/scripts/10484/More%20UI%20part1.meta.js
// ==/UserScript==

getSpecialItems();
getCompanionExpAndLike();
function getSpecialItems(){
    GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://www.ghost-trappers.com/fb/setup.php?type=special',
			headers: {
				"Accept": "text/html",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
                var text = rD.responseText;

                var result = text.match(/<div class="itemHeadline">[A-Za-z0-9'`._%+-\s]+/ig);

                for(var x = 0; x< result.length; x++){
                    result[x] = result[x].substr(result[x].indexOf('>')+1, result[x].lastIndexOf(' '));
                    result[x] = result[x].trim();
                }

				getAyumiShopItems(result);
			}
		});
};

function getAyumiShopItems(itemsInInventory){
	 GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://www.ghost-trappers.com/fb/scotch_ninth_floor.php?page=shop&filterItemType=souvenir_set',
			headers: {
				"Accept": "text/html",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
                var text = rD.responseText;
				var itemRGX = text.match(/<div class="itemInfo">(\n(.*?))*.?(<div class="seperatorLine">)/ig);
				
				var itemsHolder = [];
                for(var x = 0; x < itemRGX.length; x++){
                    
					var rgx = itemRGX[x];
					
					var itemNameRGX = rgx.match(/<div class="itemHeadline">\n*.*<\/div>|<div class="itemSpecialText">[A-Za-z0-9'`._%+-\s]+/ig);
					
					var itemCostRGX = rgx.match(/<div class="itemCurrency">(\n(.*?)<\/div>)*/ig);
					
					var itemName = itemNameRGX[0].match(/\s[A-Z0-9.-_\s]*?</ig);
					
					var itemName = itemName[0].substr(1, itemName[0].length-2);

					var item;
					
					if(itemsInInventory.indexOf(itemName) == -1){
						item = new Item(itemName);
					
						for(var y = 0; y < itemCostRGX.length; y++){
							var currency_price = itemCostRGX[y].match(/"PRICE - in(.*?)"|<div class="itemPrice">(.*?)<\/div>/ig);
							var currency = currency_price[0].substr(currency_price[0].indexOf('In')+3); 
							currency = currency.substr(0,currency.length-1); 
							
							if(currency == 'Great British Pounds, that goes without saying'){
								currency = "GBP"
							}
							
							var price = currency_price[1].match(/>[0-9,]*?</ig);
							price = price[0].substr(1,price[0].length-2); 
							
							try{
								price = parseInt(price.replace(/,/ig,''));
							}
							catch(err)
							{
								console.log('error parse price');
							}
							
							item.setCurrency(currency, price);
						}
						
						itemsHolder.push(item);
					}
                }

				constract_Table(itemsHolder);
			}
		});
}

function constract_Table(array){

	$('<div class="UserSricpt_container"></div>').appendTo('#header');
	$('<div class="souvenirs_container"></div>').appendTo('.UserSricpt_container');
	
	var container = $('.souvenirs_container');
	
	$('.UserSricpt_container').css('position','absolute');
	$('.UserSricpt_container').css('top','133%');
	$('.UserSricpt_container').css('left','-45%');
	$('.UserSricpt_container').css('color','#fff');
	
	
	for(var x = 0; x < array.length; x++){
		$('<a href="http://www.ghost-trappers.com/fb/scotch_ninth_floor.php?page=shop&filterItemType=souvenir_set" class="custom-item" id="item-'+x+'"></a>')
			.append($('<div class="itemName"></div>').html(array[x].getName()))
			.append($('<div class="itemCost"></div>').css('display', 'table'))
		.appendTo(container);
	
		var key = null;
		for(key in array[x].getItemCost())
		{
			$('#item-'+x).find('.itemCost').append($('<div class="itemCurrencyType"></div>').html('- '+key + " " +  array[x].getItemCost()[key]));       
		}
	}
	
	
	$('.UserSricpt_container').find('.souvenirs_container').css({
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
		'left' : '297px',
		'top': '-89px',
		'background-color': 'rgba(0, 0, 0, 0.6)',
		'z-index': '999'
	});
	
	
	$('.UserSricpt_container').prepend($('<button>toggle souvenirs</button>'));
	
	var button = $('.UserSricpt_container').find('button');
	
	button.css({
		'position':'absolute',
		'left':'116px',
		'color': 'white',
		'font-weight':'bold',
		'font-size': '16px',
		'text-shadow': '1px 1px black',
		'padding': '3px 8px',
		'border': '1px solid rgb(206, 174, 7)',
		'border-radius':'5px',
		'background-color': 'gold',
		'z-index': '99999999',
		'min-width':'153px'
	});
	
	button[0].addEventListener("click", function(){
		
		if($('.UserSricpt_container').find('.souvenirs_container').css('display') == 'none'){
			$('.UserSricpt_container').find('.souvenirs_container').css({
				'display': 'block'
			});
		}
		else{
			$('.UserSricpt_container').find('.souvenirs_container').css({
				'display': 'none'
			});
		}
	});
	
	
	getCurrency(array);
}

function insertCommas(string,text){
	
	if(text){
		var result = text.toString();
		if (result.length > 3){
			for(var x = result.length-3; x>0; x-=3){
				result = result.substring(0, x) + string + result.substring(x, result.length);
			}  
		}

		return result;
	}
	else{
		return 0;
	}
    
}

function priceIn(dictionary, array){
    var elements = $(".UserSricpt_container").find('.souvenirs_container')[0].childNodes;
    for(var x= 0; x < elements.length; x++){
        var currencyHolder = elements[x];
		
        var children = currencyHolder.childNodes;
		children = children[1].childNodes;
		var match = 0;
		for(var y = 0; y < children.length; y++){
			var temp = children[y].innerHTML;
			var priceIn = temp.substr(temp.indexOf('-')+2, temp.lastIndexOf(' ')-2).trim();
			var price = temp.substr(temp.lastIndexOf(' ')+1);

			try{
				dictionary[priceIn] = parseInt(dictionary[priceIn].replace(/,/ig,''));
			}
			catch(err)
			{
				// just skip this error!!!
			}
			
			children[y].innerHTML = ' - ' + priceIn +' '+ insertCommas(',',price) + '('+insertCommas(',',dictionary[priceIn])+')';
			
			if(dictionary[priceIn] >= array[x].getCurrency(priceIn)){
				
				if(match == children.length-1){

					$(".UserSricpt_container").find('.souvenirs_container').find('#item-'+x).css({
						'background-color':'rgba(0, 128, 0, 0.2)',
						'border':'1px solid green',
						'box-shadow':'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px green',
						'-webkit-box-shadow':'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px green',
						'display':'block',
						'color':'white',
						'position':'relative',
						'padding':'10px',
						'margin-top':'10px',
						'border-radius':'15px'
					});
				}
				
				match++;
			}
			else{
				
				$(".UserSricpt_container").find('.souvenirs_container').find('#item-'+x).css({
					'background-color':'rgba(255, 0, 0, 0.2)',
					'border':'1px solid red',
					'box-shadow':'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px red',
					'-webkit-box-shadow':'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px red',
					'display':'block',
					'color':'white',
					'position':'relative',
					'padding':'10px',
					'margin-top':'10px',
					'border-radius':'15px'
				});
				
			}
		}
    }
	
}

function getCurrency(array){
    GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://www.ghost-trappers.com/fb/setup.php?type=currency',
			headers: {
				"Accept": "text/html",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
                var text = rD.responseText;

                var result = text.match(/<div class="itemInfo">\n*.*<\/div>|<div class="itemSpecialText">[A-Za-z0-9'`._%+-\s]+/ig);
                var gbpHolder = document.getElementById('profile_gbp').innerHTML;

                var dictionary = [];
                for(var x = 0; x < result.length-1; x+=2){
                    var temp = result[x].match(/[A-Z0-9.-_\s]+>/ig);
                    var key = temp[0].substring(1, temp[0].indexOf('</')).trim();
                    var value = result[x+1].substring(result[x+1].indexOf('itemSpecialText'), result[x+1].indexOf('.'));
                    value = value.match(/[0-9]+/ig);
                    
                    dictionary[key] = parseInt(value);
                } 
                
                dictionary['GBP'] = gbpHolder;
                priceIn(dictionary, array);
			}
		});
};


var Item = function(name) {
  	this.name = name;
	this.dictionary = [];
};

Item.prototype.getName = function(){
	return this.name;
}

Item.prototype.setCurrency = function(currency, value){
	this.dictionary[currency] = value;
};

Item.prototype.getCurrency = function(currency){
	return this.dictionary[currency];
};

Item.prototype.getItemCost = function(){
	return this.dictionary;
}

//<<<<>>>
function getCompanionExpAndLike(){
	 GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://www.ghost-trappers.com/fb/setup.php?type=companion',
			headers: {
				"Accept": "text/html",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
                var text = rD.responseText;
			
				var rgx = text.match(/<div class="companionFullBar"*.*<\/div>|<div class=companionLikeFullBar*.*<\/div>/ig);
				var percent = [];
				for(var x= 0; x< rgx.length; x++){
					var width = rgx[x].match(/width:[0-9]+/ig);
					width = width[0].substr(width[0].indexOf(':')+1);
					
					percent.push((width/200)*100);
					
				}
				
				var companionLVLRGX = text.match(/companion\/level*.*(jpg)/ig);
				var companionLVL = companionLVLRGX[0].substr(companionLVLRGX[0].indexOf('_')+1, 1);
				var container = $('#petRightContainer');
				
				var likeValue = 0;
				if(percent[1]){
					likeValue = percent[1];
				}
				else{
					if(companionLVL < 5){
						likeValue = 0;
					}
					else if(companionLVL == 5){
						likeValue = 100;
					}
				}

				$('<a href="http://www.ghost-trappers.com/fb/setup.php?type=companion" class="exp_like_display"></a>')
					.append($('<div class="expDisplay"></div>')
							.html(percent[0].toFixed(1) + '%')
							.css({
									'float': 'left', 
									'padding': '3px',
									'font-weight': 'bold',
									'background-color':'rgba(135, 206, 235, 0.6)',
									'border-radius': '10px',
									'border':'1px solid skyblue',
									'box-shadow':'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px skyblue',
									'-webkit-box-shadow':'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px skyblue'
								}))
					.append($('<div class="likeDisplay"></div>')
							.html(likeValue.toFixed(1)+ '%')
							.css({
									'float': 'right', 
									'padding': '3px',
									'font-weight': 'bold',
									'background-color':'rgba(255, 192, 203, 0.6)',
									'border-radius': '10px',
									'border':'1px solid pink',
									'box-shadow':'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px pink',
									'-webkit-box-shadow':'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px pink'
								}))
				.appendTo(container);
				
				$('.exp_like_display').css({
					'color': 'black',
					'position':'absolute',
					'top': '60px',
					'left': '0px',
					'width': '100%',
					'z-index': '9999'
				})
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
