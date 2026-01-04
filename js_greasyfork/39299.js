// ==UserScript==
// @name           Virtonomica: расчет цены за ед. кач. + сортировка V2
// @namespace      virtonomica
// @description    Цена за единицу качества + сортировка
// @include        https://virtonomic*.*/*/window/unit/supply/create/*/step2
// @version        1.1
// @downloadURL https://update.greasyfork.org/scripts/39299/Virtonomica%3A%20%D1%80%D0%B0%D1%81%D1%87%D0%B5%D1%82%20%D1%86%D0%B5%D0%BD%D1%8B%20%D0%B7%D0%B0%20%D0%B5%D0%B4%20%D0%BA%D0%B0%D1%87%20%2B%20%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/39299/Virtonomica%3A%20%D1%80%D0%B0%D1%81%D1%87%D0%B5%D1%82%20%D1%86%D0%B5%D0%BD%D1%8B%20%D0%B7%D0%B0%20%D0%B5%D0%B4%20%D0%BA%D0%B0%D1%87%20%2B%20%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20V2.meta.js
// ==/UserScript==

var run = function() {
	function fillArray( id, cen ) {
  		this.id = id;
   		this.cen = cen;
	}
	
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window); 
    var txt = [];
    $ = win.$;
	i=0;
	var local_price = parseFloat($('div.supply_addition_info>table>tbody tr:eq(1) th:eq(0)').prop('textContent').replace('Цена = $','').replace(' ', '').replace(' ', '').replace(' ', ''));
	var local_quality = parseFloat($('div.supply_addition_info>table>tbody tr:eq(1) th:eq(1)').prop('textContent').replace('Качество = ','').replace(' ', '').replace(' ', '').replace(' ', ''));
	var good_price = 2 * local_price;
	var good_quality = local_quality * 1;

	$('#supply_content table tr').each(function() {
		var temp = $(this).attr('id');
        if (!isNaN(temp)) { return; }
		
		var cels1 = $('th', this);
		$(cels1[3]).after('<th><div class="field_title">ЦК<div class="asc" title="сортировка по возрастанию"><a id="qpasc" href="#"><img src="/img/up_gr_sort.png"></a></div><div class="desc" title="сортировка по убыванию"><a id="qpdesc" href="#"><img src="/img/down_gr_sort.png"></a></div></div></th>');
		
        var cels = $('td', this);
		
        var price = parseFloat($(cels[5]).text().replace('$', '').replace(/ /g, ''));
		
        var qual = parseFloat($(cels[6]).text().replace(/ /g, ''));

        if (isNaN(price) || isNaN(qual)) { return; }
		
if(price < good_price && qual > good_quality) {$(cels[8]).css("background-color", "#ccffcc");}
		
        var qp = (price / qual).toFixed(2);
	i++;
        $(cels[5]).after('<td class="supply_data" id="td_s'+i+'" style="color: #f00">'+qp+'</td>');
		txt[i] = new fillArray( i, parseFloat($('#td_s'+i).text()) );
    });
	
	total=i;
	
	function sort_table(type){
		for(i=0;i<=total;i++){
			for(j = 1;j < total - i;j++) {
				if(type=='asc'){
					if(txt[j]['cen'] > txt[j+1]['cen']){
						var tmp = txt[j]['cen'];
						txt[j]['cen'] = txt[j+1]['cen'];
						txt[j+1]['cen'] = tmp;
						tmp = txt[j]['id'];
						txt[j]['id'] = txt[j+1]['id'];
						txt[j+1]['id'] = tmp;
					}
				}
				if(type=='desc'){
					if(txt[j]['cen'] < txt[j+1]['cen']){
						var tmp = txt[j]['cen'];
						txt[j]['cen'] = txt[j+1]['cen'];
						txt[j+1]['cen'] = tmp;
						tmp = txt[j]['id'];
						txt[j]['id'] = txt[j+1]['id'];
						txt[j+1]['id'] = tmp;
					}
				}
			}
		}
		for(i=total;i>1;i--){
			id_rod = $('#td_s'+txt[i]['id']).closest('tr');
			id_rod1 = $('#td_s'+txt[i-1]['id']).closest('tr');
			
			if(id_rod1.next().hasClass('ordered')){
				var n = id_rod1.next();
				id_rod.before(id_rod1).before(n);
			}else
				id_rod.before(id_rod1);
			
		}
		return false;
	}
	$('#qpasc').click(function() {
		sort_table('asc');
		return false;
	});
	
	$('#qpdesc').click(function() {
		sort_table('desc');
		return false;
	});
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);