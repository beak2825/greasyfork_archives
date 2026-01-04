// ==UserScript==
// @name           Virtonomica: быстрая установка цены
// @namespace      virtonomica
// @description    быстрая установка цены продажи на складе или заводе
// @version        3.9.5
// @include        http*://*virtonomic*.*/*/main/unit/view/*/sale
// @include        http*://*virtonomic*.*/*/main/unit/view/*/sale/offer
// @downloadURL https://update.greasyfork.org/scripts/34346/Virtonomica%3A%20%D0%B1%D1%8B%D1%81%D1%82%D1%80%D0%B0%D1%8F%20%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%86%D0%B5%D0%BD%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/34346/Virtonomica%3A%20%D0%B1%D1%8B%D1%81%D1%82%D1%80%D0%B0%D1%8F%20%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%86%D0%B5%D0%BD%D1%8B.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	
	function getRealm(){
		var svHref = window.location.href;
        var matches = svHref.match(/\/(\w+)\/main\/unit\/view\//);
		return matches[1];
	}
	function getUnitType(){
		//console.log($('div.content div.bg-image'));
		unitTypeImg=$('div.content div.bg-image').prop('classList')[1];
		var matches = unitTypeImg.match(/bgunit-(\w+)_/);		
		return matches[1];		
	}
	function getLastPart(spHref){
		//console.log('getLastPart. spHref = ' + spHref);
    var matches = spHref.match(/[^\d].(\d+)/);
		return matches[1];
	}
	//warehouse, workshop
	var unitType = getUnitType();
	console.log('unitType = ' + unitType);
	var svRegionHref = $('div.content > div.title > a[href*="/main/geo/citylist/"]').attr('href');
	var regionID = '';
	var countryID = '';
	if (svRegionHref == null || svRegionHref == '') {
		countryID = getLastPart($('div.content > div.title > a[href*="/main/geo/regionlist/"]').attr('href'));
	} else {
		regionID = getLastPart(svRegionHref);
	}
	console.log('countryID = ' + countryID);
	console.log('regionID = ' + regionID);
	var realm = getRealm();
	var tax = 1;
	var agCtie = [];
	$.getJSON('https://cobr123.github.io/by_trade_at_cities/'+realm+'/regions.json', function (data) {
		$.each(data, function (key, val) {
			if ((regionID !== '' && val.i == regionID) || (regionID === '' && countryID !== '' && val.ci == countryID) ) {
				tax = parseFloat(val.itr, 10) / 100;
				console.log('tax = ' + tax);
				regionID = val.i;
				if(unitType !== 'warehouse'){
					$.getJSON('https://cobr123.github.io/industry/'+realm+'/region_ctie/'+regionID+'.json', function (data) {
						$.each(data, function (key, val) {
							agCtie[val.pi] = parseFloat(val.r, 10);
						});
					});
				}
			}
		});
	});
	var panel = $('form:has(table)');
  	var butAllByOneCent = $('<button>всё по $0.01</button>');
	var butAllByOne = $('<button>всё по $1</button>');
	var butAllByCost = $('<button>всё по сс</button>');
	var butAllPlus1Prc = $('<button>+1%</button>');
	var butAllPlus5Prc = $('<button>+5%</button>');
	var butAllPlus10Prc = $('<button>+10%</button>');
	var butAllByTaxPlus = $('<select><option value=""></option>'
							+'<option value=0>всё по +0% +Налоги</option>'
							+'<option value=1>всё по +1% +Налоги</option>'
							+'<option value=5>всё по +5% +Налоги</option>'
							+'<option value=10>всё по +10% +Налоги</option>'
							+'<option value=15>всё по +15% +Налоги</option>'
							+'<option value=20>всё по +20% +Налоги</option>'
							+'<option value=30>всё по +30% +Налоги</option>'
							+'</button>');
    var sellTo = $('<select>'
                   +'<option value=""></option>'
                   +'<option value="0">Не продавать</option>'
                   +'<option value="1">Любому покупателю</option>'
                   +'<option value="2">Только определенным компаниям</option>'
                   +'<option value="3">Только своей компании</option>'
                   +'<option value="5">Только участникам корпорации</option>'
                   +'</select>');
  
	sellTo.click(function() {
		$('select[name*="[constraint]"]').each(function() {
			$(this).val(sellTo.val());
			$(this).change();
		});
	});

	butAllByOneCent.click(function() {
		$('button[class="sell_by_one_cent"]').each(function() {
			$(this).click();
		});
	});

	butAllByOne.click(function() {
		$('button[class="sell_by_one_dollar"]').each(function() {
			$(this).click();
		});
	});

	butAllByCost.click(function() {
		$('button[class="sell_by_cc"]').each(function() {
			$(this).click();
		});
	});

	butAllPlus1Prc.click(function() {
		$('button[class="plus1prc"]').each(function() {
			$(this).click();
		});
	});

	butAllPlus5Prc.click(function() {
		$('button[class="plus5prc"]').each(function() {
			$(this).click();
		});
	});


	butAllPlus10Prc.click(function() {
		$('button[class="plus10prc"]').each(function() {
			$(this).click();
		});
	});

	butAllByTaxPlus.change(function() {
		var value = $(this).val() || 0;
		$('select[class="sell_by_tax_plus"]').val(value).change();
	});

	panel.first().before(butAllByTaxPlus).before(butAllByCost).before(butAllByOne).before(butAllByOneCent).before(butAllPlus1Prc).before(butAllPlus5Prc).before(butAllPlus10Prc).before(sellTo);
	
    $('table.grid > tbody > tr[class]').each(function() {
		var row = $(this);
        var sel = $('> td > select', row).first();
        var price = $('input.money', row).first();
		price.attr('oldValue', price.val());
		var ss = parseFloat($('> td:nth-child(4) > table > tbody > tr:nth-child(3) > td:nth-child(2)', row).text().replace('$','').replace(/\s+/g,''), 10);
        if (isNaN(ss)) { 
          ss = 0;
        } else {
          ss += 0.01;
        }
        var productID = getLastPart($('> td[title] > a:has(img)', row).attr('href'));
		//console.log("ss = " + ss);

        var butByOneCent = $('<button class="sell_by_one_cent">$0.01</button>');
        var butByOne = $('<button class="sell_by_one_dollar">$1</button>');
        var butByCost = $('<button class="sell_by_cc">сс</button>');
        var butPlus1Prc = $('<button class="plus1prc">+1%</button>');
        var butPlus5Prc = $('<button class="plus5prc">+5%</button>');
        var butPlus10Prc = $('<button class="plus10prc">+10%</button>');
        var butByTaxPlus = $('<select class="sell_by_tax_plus"><option value=""></option>'
							 +'<option value=0>+0% +Налоги</option>'
							 +'<option value=1>+1% +Налоги</option>'
							 +'<option value=5>+5% +Налоги</option>'
							 +'<option value=10>+10% +Налоги</option>'
							 +'<option value=15>+15% +Налоги</option>'
							 +'<option value=20>+20% +Налоги</option>'
							 +'<option value=30>+30% +Налоги</option>'
							 +'</button>');

        sel.before(butByTaxPlus).before(butByCost).before(butByOne).before(butByOneCent).before(butPlus1Prc).before(butPlus5Prc).before(butPlus10Prc);

        butByOneCent.click(function() {
            price.val(0.01);
            return false;
        });
        butByOne.click(function() {
            price.val(1);
            return false;
        });
        butByCost.click(function() {
            price.val(ss.toFixed(2));
            return false;
        });
        butPlus1Prc.click(function() {
			var newVal = parseFloat(price.val(),10) * 1.01;
            price.val(newVal.toFixed(2));
            return false;
        });
        butPlus5Prc.click(function() {
			var newVal = parseFloat(price.val(),10) * 1.05;
            price.val(newVal.toFixed(2));
            return false;
        });
        butPlus10Prc.click(function() {
			var newVal = parseFloat(price.val(),10) * 1.10;
            price.val(newVal.toFixed(2));
            return false;
        });
        butByTaxPlus.change(function() {
			var markup = $(this).val();
			if (markup == null || markup == ''){
				price.val(price.attr('oldValue'));
			} else {
				var diff = ss * (markup/100);
                console.log("diff = " + diff);
				if(unitType === 'warehouse'){
					price.val((ss * (markup/100 + 1) + diff * tax).toFixed(2));
				} else {
					var ctieTax = agCtie[productID];
					console.log("ctieTax = " + ctieTax);
					console.log("tax = " + tax);
					var ctie = ss * (ctieTax/100) * tax;
					console.log("ctie = " + ctie);
					price.val((ss * (markup/100 + 1) + diff * tax + ctie).toFixed(2));	
				}
			}
            return false;
        });
    });
}
function initialize(){
	var script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}
if(window.top == window) {
	window.setTimeout(initialize,500);
}
