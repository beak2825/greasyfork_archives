// ==UserScript==
// @name           Virtonomica: управление закупками на склад
// @version        1.11
// @namespace      Virtonomica
// @description    Корректирует закупки на склад при условии что поставщиков у каждого товара может быть несколько. Учитывает доступные остатки/ограничения_количества и пропорционально увеличивает/уменьшает закупку.
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply
// @downloadURL https://update.greasyfork.org/scripts/10123/Virtonomica%3A%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%D0%BC%D0%B8%20%D0%BD%D0%B0%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/10123/Virtonomica%3A%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%D0%BC%D0%B8%20%D0%BD%D0%B0%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4.meta.js
// ==/UserScript==

var run = function() {
  //ждем заполнения .bg-image скриптом
  $( document ).ready(function() {
	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

    var src = $('.bg-image').attr('class'); 
	//если это не склад, выходим
	if(src.indexOf("warehouse") <= 0){
      return;
    }
	
	function toFloat(spNum){
		//console.log('toFloat = ' + spNum);
		if(spNum == null || spNum == '') {
			return 0;
		}
		return parseFloat(spNum.replace('$','').replace('"','').replace(/\s+/g,''),10);
	}
	
	function priceToFloat(spNum){
		//console.log('priceToFloat = ' + spNum);
		if(spNum == null || spNum == '') {
			return 0;
		}
		var nvSlashPos = spNum.indexOf("/");
		if(nvSlashPos > -1){
			return toFloat(spNum.substr(nvSlashPos + 1));
		} else {
			return toFloat(spNum);
		}
	}
	
	function remainToFloat(spNum){
		//console.log('remainToFloat = ' + spNum);
		if(spNum == null || spNum == '') {
			return 0;
		}
		
		var nvSpanCloseTagPos = spNum.indexOf(">");
		var nvBrPos = spNum.indexOf("<br>");
		if(nvBrPos > -1){
			var svNum = spNum.substr(nvSpanCloseTagPos+1, nvBrPos-nvSpanCloseTagPos-1);
			var nvInPos = svNum.indexOf("из");
			if(nvInPos > -1){
				return Math.min(toFloat(svNum.substr(0, nvInPos)), toFloat(svNum.substr(nvInPos+3)));
			} else {
				return toFloat(svNum);
			}
		} else {
			return toFloat(spNum);
		}
	}
	
	var data = [];
	function addProduct(spProductTitle, npQtyNeed, npQtyOrdered, opAddContras){
		//console.log('addProduct "'+spProductTitle+'"');
		data[spProductTitle] = {
			aContras : []
		   ,nQtyNeed : npQtyNeed
		   ,nQtyOrdered : npQtyOrdered
		   ,oAddContras : opAddContras
		};
	}
	
	function addContras(spProductTitle, opInputOrderQty, npOrderedQty, npPrice, npQuality, npRemain){
		//console.log('addContras "'+spProductTitle+'"');
		data[spProductTitle].aContras.push({
			oInputOrderQty : opInputOrderQty
		   ,nOrderedQty    : npOrderedQty
		   ,nPrice    	   : npPrice
		   ,nQuality       : npQuality
		   ,nRemain        : npRemain
		});
	}
	
	function collectData(){
		var svProductTitle = '';
		data = [];
		$("table.list > tbody > tr[class]").each( function() {
			var row = $(this);
			if(row.attr('class') == 'p_title'){
				//Отгрузки по контрактам
				// > td.p_title_l > div:nth-child(2) > table > tbody > tr > td:nth-child(2) > strong
				var nvQtyNeed = toFloat($('> td.p_title_l > div:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2) > strong', row).first().text());
				console.log('nvQtyNeed = ' + nvQtyNeed);
				var nvQtyOrdered = toFloat($('> td:nth-child(2) > nobr > strong', row).first().text());
				console.log('nvQtyOrdered = ' + nvQtyOrdered);
				var ovProductImg = $('> td.p_title_l > div:nth-child(1) > div:nth-child(1) > div > img', row);
				var ovAddContras = $('> td.p_title_l > div:nth-child(1) > div:nth-child(2) > a:nth-child(2)', row);
				
				svProductTitle = ovProductImg.attr('title');
				//console.log('svProductTitle = ' + svProductTitle);
				addProduct(svProductTitle, nvQtyNeed, nvQtyOrdered, ovAddContras);
			} else if (row.attr('class') == 'odd' || row.attr('class') == 'even'){
				var ovInputOrderQty = $('> td:nth-child(2) > input[type="text"]:nth-child(1)', row);
				ovInputOrderQty.attr('old_val', ovInputOrderQty.val());
				var nvOrderedQty = toFloat($('> td:nth-child(3)', row).first().text());
				var nvPrice = priceToFloat($('> td:nth-child(4)', row).first().text());
				var nvQuality = toFloat($('> td:nth-child(6)', row).first().text());
				var nvRemain = remainToFloat($('> td:nth-child(9)', row).first().html());
				if ($(' > td:nth-child(1) > div:nth-child(3) > img[src="/img/unit_types/seaport.gif"]', row).length > 0){
				   nvRemain = Number.POSITIVE_INFINITY;
				}
				
				addContras(svProductTitle, ovInputOrderQty, nvOrderedQty, nvPrice, nvQuality, nvRemain);
			}
		});
	}
	
	function sortTable(){
		var filtered = true;
		for(var producTitle in data){
			//console.log(producTitle);
	  		var avContras = data[producTitle].aContras;
			var iterCnt = 0;
	  		do {
				filtered = true;
				for(var i = 0; i < avContras.length; i++) {
					if(i > 0 && avContras[i].nPrice / avContras[i].nQuality < avContras[i-1].nPrice / avContras[i-1].nQuality){
						var tbody = avContras[i].oInputOrderQty.closest('tbody');
						var prev = avContras[i-1].oInputOrderQty.closest('tr');
						var prevClass = prev.attr('class');
						var curr = avContras[i].oInputOrderQty.closest('tr');
						var currClass = curr.attr('class');
						
						prev.attr('class', currClass);
						curr.attr('class', prevClass);
						
						//console.log('move '+ (avContras[i].nPrice / avContras[i].nQuality) +' before '+(avContras[i-1].nPrice / avContras[i-1].nQuality));
						prev.before(curr);
						
						var tmp = avContras[i-1];
						avContras[i-1] = avContras[i];
						avContras[i] = tmp;
						//tbody.insertBefore(curr, prev);
						filtered = false;
					}
				}
				iterCnt++;
				if (iterCnt > 10000){
					console.log('зацикливание при сортировке или слишком много заказов продукта "'+producTitle+'"');
					break;
				}
			}
			while (!filtered);
		}
	}
	
	function changeOrderQty(opInput, npQty){
		var svOld = opInput.attr('old_val');
		var svNew = npQty;
		if(opInput.prev().prop("tagName") == 'B'){
			opInput.prev().remove();
		}
		opInput.before('<b>'+svOld+'->'+svNew+'</b>');
		opInput.val(npQty);
	}
	
	function scrollTo(element){
		element.focus();
		//var offset = element.offset().top;
		//$('html, body').animate({ scrollTop: offset }, 500);
	}
	
	function clearLog(){
		$('#autoCorrectMessages').html('');
	}
	function addToLog(opMsg){
		$('#autoCorrectMessages').append('<br>').append(opMsg);
	}
	
	function oneToOne(){
		clearLog();
		
		for(var producTitle in data){
	  		var avContras = data[producTitle].aContras;
			var nvQtyNeed = data[producTitle].nQtyNeed;
			var nvQtyOrdered = data[producTitle].nQtyOrdered;
			
			if(avContras.length == 0 && nvQtyNeed > 0){
				scrollTo(data[producTitle].oAddContras);
				addToLog('Нужно добавить поставщика товара "'+producTitle+'"');
				alert('Нужно добавить поставщика товара "'+producTitle+'"');
				return;
			} else if(avContras.length == 1){
				var nvOrderQty = toFloat(avContras[0].oInputOrderQty.val());
				console.log('nvQtyNeed = '+nvQtyNeed);
				console.log('nvOrderQty = '+nvOrderQty);
				console.log('avContras[0].nRemain = '+avContras[0].nRemain);
				if(nvQtyNeed > avContras[0].nRemain){
					scrollTo(data[producTitle].oAddContras);
					addToLog('Нужно добавить поставщика товара "'+producTitle+'"');
					alert('Нужно добавить поставщика товара "'+producTitle+'"');
					return;
				} else if (nvQtyNeed < avContras[0].nRemain && nvOrderQty != nvQtyNeed) {
					changeOrderQty(avContras[0].oInputOrderQty, nvQtyNeed);
				}
			} else {
				for(var i = 0; i < avContras.length; i++) {
					var nvOrderQty = toFloat(avContras[i].oInputOrderQty.val());
					if(nvOrderQty > 0){
						if(nvQtyNeed == 0){
							changeOrderQty(avContras[i].oInputOrderQty, 0);
						} else {
							//console.log('nvOrderQty = '+nvOrderQty);
							//console.log('nRemain = '+avContras[i].nRemain);
							if(avContras[i].nRemain == 0){
								changeOrderQty(avContras[i].oInputOrderQty, 0);
								nvQtyOrdered = nvQtyOrdered - nvOrderQty;
							} else if(avContras[i].nRemain < nvOrderQty){
								changeOrderQty(avContras[i].oInputOrderQty, avContras[i].nRemain);
								nvQtyOrdered = nvQtyOrdered - (nvOrderQty - avContras[i].nRemain);
							}
						}
					}
				}
				if(nvQtyNeed < nvQtyOrdered){
					var nvMissing = nvQtyNeed;
					for(var i = 0; i < avContras.length; i++) {
						var nvOrderQty = toFloat(avContras[i].oInputOrderQty.val());
						if(nvOrderQty > 0){
							var part = nvQtyOrdered / nvOrderQty;
							//console.log('nvQtyOrdered = '+nvQtyOrdered);
							//console.log('nvOrderQty = '+nvOrderQty);
							//console.log('part = '+part);
							var nvNew = Math.max(Math.round(nvQtyNeed / part), 0);
							//console.log('nvNew = '+nvNew);
							changeOrderQty(avContras[i].oInputOrderQty, nvNew);
							nvMissing = nvMissing - nvNew;
						}
					}
					if(nvMissing > 0){
						console.log('nvMissing = '+nvMissing);
						for(var i = avContras.length - 1; i >= 0; i--) {
							var nvOrderQty = toFloat(avContras[i].oInputOrderQty.val());
							if(nvOrderQty > 0){
								var nvNew = Math.max(nvOrderQty - nvMissing, 0);
								changeOrderQty(avContras[i].oInputOrderQty, nvNew);
								nvMissing = nvMissing - nvNew;
								if(nvMissing <= 0){
									break;
								}
							}
						}
						if(nvMissing > 0){
							console.log('nvMissing = '+nvMissing);
							scrollTo(data[producTitle].oAddContras);
							addToLog('Нужно уменьшить поставки товара "'+producTitle+'"');
							alert('Нужно уменьшить поставки товара "'+producTitle+'"');
							return;
						}
					}
				} else if(nvQtyNeed > nvQtyOrdered){
					var nvMissing = 0;
					for(var i = 0; i < avContras.length; i++) {
						var nvOrderQty = toFloat(avContras[i].oInputOrderQty.val());
						if(nvOrderQty > 0){
							var part = nvQtyOrdered / nvOrderQty;
							var nvNew = Math.min(Math.round(nvQtyNeed / part), avContras[i].nRemain);
							changeOrderQty(avContras[i].oInputOrderQty, nvNew);
							nvMissing = nvMissing + nvNew;
						}
					}
					if(nvMissing < nvQtyNeed){
						console.log('nvMissing = '+nvMissing);
						for(var i = 0; i < avContras.length; i++) {
							var nvOrderQty = toFloat(avContras[i].oInputOrderQty.val());
							if(nvOrderQty > 0){
								var nvNew = Math.min(nvOrderQty + nvMissing, avContras[i].nRemain);
								changeOrderQty(avContras[i].oInputOrderQty, nvNew);
								nvMissing = nvMissing + nvNew;
								if(nvMissing >= nvQtyNeed){
									break;
								}
							}
						}
						if(nvMissing < nvQtyNeed){
							console.log('nvMissing = '+nvMissing);
							scrollTo(data[producTitle].oAddContras);
							addToLog('Нужно добавить поставщика товара "'+producTitle+'"');
							alert('Нужно добавить поставщика товара "'+producTitle+'"');
							return;
						}
					}
				}
			}
		}
	}
	
	function maxAvailable(){
		clearLog();
		
		for(var producTitle in data){
	  		var avContras = data[producTitle].aContras;
			var nvQtyOrdered = data[producTitle].nQtyOrdered;
			
			for(var i = 0; i < avContras.length; i++) {
				changeOrderQty(avContras[i].oInputOrderQty, avContras[i].nRemain);
			}
		}
	}
	// кнопки
	 var oneToOneBtn = $('<button>1:1</button>').click(function() {
		 oneToOne();
	});
	 var maxAvailableBtn = $('<button>max</button>').click(function() {
		 maxAvailable();
	});
	$('#mainContent form').first().before(oneToOneBtn).before(maxAvailableBtn).before('<div id="autoCorrectMessages"></div>');
	//
	collectData();
	sortTable();
  });
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);