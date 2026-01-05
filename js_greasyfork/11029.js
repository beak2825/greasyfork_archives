// ==UserScript==
// @name        MTurk Check calorie information
// @description Makes 'product' easily copyable, and makes URL to website a hyperlink
// @namespace   http://idlewords.net
// @include     https://www.mturkcontent.com/dynamic/hit*
// @include		https://www.ocado.com/webshop/product*
// @version     7
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11029/MTurk%20Check%20calorie%20information.user.js
// @updateURL https://update.greasyfork.org/scripts/11029/MTurk%20Check%20calorie%20information.meta.js
// ==/UserScript==

if ($("p:contains('Find the energy kJ per 100 g')").length) {
	$("table>tbody>tr").each(function(index, element) {
		$(this).children("td").each(function(index_c, element) {
			if (index_c == 0) {
				return true;
			} else if (index == 0) {
				var website = $(this).children("strong").text();
				$(this).children("strong").wrapInner("<a href='" + website + "' id='website' target='_blank'></a>");
			} else if (index == 1) {
				var product_name = $(this).children("strong").text().trim().replace('  ', ' ').replace('&nbsp;', '');
				var re = /(\d{1,3})?(\s?\.?x?\s?)(\d{1,4})(\s?)([MmKk]?[LlGg])/;
				if ((m = re.exec(product_name)) !== null) {
				    if (m.index === re.lastIndex) {
				        re.lastIndex++;
				    }
				}
				$(this).children("strong").text('');
				$(this).append('<input type="text" value="' + product_name + '" id="product" style="width: 400px;" />');
				if (m !== null) {
					if (m[0]) {
						$(this).append(' ' + m[0]);
						$("#product").val($("#product").val().replace(m[0], ''));
					}
				}
				$("#product").css('width', '400px').css('border', 'none');
			}
		});
	});

	var websiteUrl = 'https://www.ocado.com/webshop/getSearchProducts.do?clearTabs=yes&isFreshSearch=true&chosenSuggestionPosition=&entry=' + encodeURIComponent($("#product").val().trim());
	websiteUrl = websiteUrl.replace('%A0', '');
	$("#website").attr('href', websiteUrl);

	$("#product").mouseover(function() {
		$(this).select();
	});
	$("#product").mouseout(function() {
		$(this).select();
	});
}

if ($("a.shopLink:contains('Browse Shop')").length && document.URL.search('/product') > -1) {
	$("h2:contains('Nutrition')").wrapInner('<input type="text" id="nutrition" value="Nutrition" />');
	$("#nutrition").css('border', 'none');

	$("#nutrition").get(0).scrollIntoView();
	window.scrollBy(0, -150);
}