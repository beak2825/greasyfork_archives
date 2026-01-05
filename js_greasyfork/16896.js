// ==UserScript==
// @name           Virtonomica: Unit List v3.0
// @description    Позволяет быстро продавать/закрывать подразделения без дополнительных окон
// @namespace      virtonomica
// @version        3.8
// @include        http*://*virtonomic*.*/*/main/company/view/*/unit_list
// @downloadURL https://update.greasyfork.org/scripts/16896/Virtonomica%3A%20Unit%20List%20v30.user.js
// @updateURL https://update.greasyfork.org/scripts/16896/Virtonomica%3A%20Unit%20List%20v30.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

	function roundPrice(npOldPrice, npNewPrice) {
		if (npNewPrice >= (npOldPrice * 3)) {
		  return Math.floor((Math.floor(npNewPrice *100) - 1)/100);
		} else if (npNewPrice <= (npOldPrice * 0.7)) {
		  return Math.ceil((Math.floor(npNewPrice *100) + 1)/100);
		} else {
			return npNewPrice;
		}
	}
	
	function getSellPrice(spHtml){
		var prize = 0;
		
		$(spHtml).find("td:contains('$')").each(function() { 
			var str = $(this).text();
			//console.log("str = " + str);
			str = str.replace('$','').replace(/\s+/g,'');
			prize += parseFloat(str,10);
		});
		prize = prize/2;
		
		return prize;
	}
	function setSellPrice(npPercent, thisLink){
		if(!confirm('Продать предприятие за '+npPercent+'% цены?')) return false;

		var unitLink = thisLink.parent().children().first();
		var svPostUrl = unitLink.attr('href').replace("main/unit/view","window/unit/market/sale");
		$.get(svPostUrl, function( data ) {
			var sellPrice = getSellPrice(data);
			console.log("sellPrice = " + sellPrice);
			if (isNaN(sellPrice) || sellPrice <= 0) return false;

			var data = {};
			data['price'] = roundPrice(sellPrice, npPercent / 100 * sellPrice);
			data['sale'] = 'Выставить предприятие на продажу';
			//console.log("data = " + JSON.stringify(data));
			//console.log("svPostUrl = " + svPostUrl);
			$.post( svPostUrl, data )
				.done(function() {
				//console.log( "success" );
				unitLink.attr('style','text-decoration: line-through;');
				thisLink.attr('style','font-weight: bold;');
				//window.location = window.location.href;
			})
				.fail(function() {
				console.log( "error" );
			});
		});
	}
	function сancelSell(thisLink){
		var unitLink = thisLink.parent().children().first();
		var svGetUrl = unitLink.attr('href').replace("main/unit/view","window/unit/market/cancel_sale/");
		$.get( svGetUrl, function() {
		  console.log( "success" );
		})
		  .fail(function() {
			console.log( "error" );
		  });
	}
	
	var el = $("a[href*='main/unit/view']").parent().each( function() {
		href = $("a", this).attr('href');
		if ( href.search("manufacture") != -1 ) {
			href1 = href;
			href1 = href1.replace("main/unit/view","window/technology_market/ask/by_unit");
			href1 = href1.replace("manufacture","offer/set");
			href = href.replace("manufacture","");
//			$(this).append("<a href="+href+"supply><img width=16 height=16 alt='Supply' src='/img/unit_types/warehouse.gif'/><a href="+href1+ " onclick='return doWindow(this, 800, 500);'><img width=16 height=16 alt='Tech' src='/img/icon/invention.gif'/>");
		}
		else {
			if ( href.search("trading_hall") != -1 ) {
				href = href.replace("trading_hall","supply");
//				$(this).append("<a href="+href+ "><img width=16 height=16 alt='Supply' src='/img/unit_types/warehouse.gif'/>");
			}
			else {
				if ( href.search("investigation") != -1 ) {
					href = href.replace("main","window");
					href = href.replace("investigation","project_create");
//					$(this).append("<a href="+href+ " onclick='return doWindow(this, 800, 320);'><b>New!</b>");
				}
				else {
					href1 = href.replace("main/unit/view","window/unit/changename");
					href2 = href.replace("main/unit/view","window/unit/market/sale");
					href3 = href.replace("main/unit/view","window/unit/close");
//					$(this).append("<a href="+href1+ " onclick='return doWindow(this, 800, 320);'><img width=16 height=16 alt='Change name' src='/img/units/edit.gif'/>");
					//$(this).append("<a href="+href2+ " onclick='return doWindow(this, 650, 400);'>70%<img width=16 height=16 alt='Sell' src='/img/common/coin_black.gif'/></a>");
					//$(this).append("<a href="+href3+ " onclick='return doWindow(this, 800, 360);'><img width=16 height=16 alt='Close' src='/img/del.gif'/></a>");
					
					var sell70 = $("<a href='#'><img width=16 height=16 alt='Sell' src='/img/common/coin_black.gif'/>70%</a>");
					sell70.click(function() {
						var thisLink = $(this);
						var nvPercent = 70;
						setSellPrice(nvPercent, thisLink);
						return false;
					});
					$(this).append(sell70);
					var sell100 = $("<a href='#'>&nbsp;100%</a>");
					sell100.click(function() {
						var thisLink = $(this);
						var nvPercent = 100;
						setSellPrice(nvPercent, thisLink);
						return false;
					});
					$(this).append(sell100);
					var sell300 = $("<a href='#'>&nbsp;300%</a>");
					sell300.click(function() {
						var thisLink = $(this);
						var nvPercent = 300;
						setSellPrice(nvPercent, thisLink);
						return false;
					});
					$(this).append(sell300);
					var sellCancel = $("<a href='#'>&nbsp;Отменить продажу</a>");
					sellCancel.click(function() {
						var thisLink = $(this);
						сancelSell(thisLink);
						return false;
					});
					$(this).append(sellCancel);
					
					var delBtn = $('<a href="#"><img width=16 height=16 alt="Закрыть быстро" src="/img/del.gif"/></a>');

					delBtn.click(function() {
						if(!confirm('Закрыть предприятие')) return false;
						
						var svPostUrl = $(this).parent().children().first().attr('href').replace("main/unit/view","window/unit/close");
						var row = $(this).parent().parent();
						var data = {};
						data['close_unit'] = 'Закрыть предприятие';
						//console.log("data = " + JSON.stringify(data));
						//console.log("svPostUrl = " + svPostUrl);
						$.post( svPostUrl, data )
							.done(function() {
							//console.log( "success" );
							row.hide();
							//window.location = window.location.href;
						})
							.fail(function() {
							console.log( "error" );
						});
						//$.post( href3, { close_unit: "Закрыть предприятие" } );
						return false;
					});
					$(this).append(delBtn);
				}
			}
		}
	});
	
}

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);