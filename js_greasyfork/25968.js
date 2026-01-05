// ==UserScript==
// @name         Steam Custom Layout, Sorting and Filtering
// @namespace    http://null.frisch-live.de/
// @version      0.27
// @description  Allows to custom filter (min/max Price and min Discount) the search results on Steam
// @author       frisch
// @match        http://store.steampowered.com/search/*
// @match        http://store.steampowered.com/app/*
// @match        http://steamcommunity.com/id/frisch85/wishlist/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25968/Steam%20Custom%20Layout%2C%20Sorting%20and%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/25968/Steam%20Custom%20Layout%2C%20Sorting%20and%20Filtering.meta.js
// ==/UserScript==

/*
    position: absolute;
    top: 0;
    right: -102px;
    float: right;
    width: 100px;
    height: 85px;
    text-align: center;
    vertical-align: middle;
    border: 1px solid white;
    font-size: 56pt;
    margin: 0;
    padding: 0;
*/
console.log("Initializing Steam Custom Layout and Sorting...");
var jq = document.fExt.jq;

if(location.href.indexOf("wishlist") >= 0){
	jq("a:contains('Remove')").each(function(){
		var jqThis = jq(this);
		jqThis.text('X');
		jqThis.css('position','absolute');
		jqThis.css('top','0');
		jqThis.css('right','-102px');
		jqThis.css('float','right');
		jqThis.css('width','100px');
		jqThis.css('height','85px');
		jqThis.css('text-align','center');
		jqThis.css('vertical-align','middle');
		jqThis.css('border','1px solid white');
		jqThis.css('font-size','56pt');
		jqThis.css('margin','0');
		jqThis.css('padding','0');
	});
}
else if(location.href.indexOf("search") >= 0) {
	var loading = 0;

	var loadingStep, loadingPages;
	var jqSearchResultItems = [];

	// Custom Elements
	var sortContainer = jq("<div id='customSortContainer'>Sort by:</div>");
	sortContainer.appendTo("div.searchbar");

	var srtPrice = jq("<a href='#' id='srtPrice'>Price</a>");
	srtPrice.data("sort-type","Price");
	srtPrice.appendTo(sortContainer);

	var srtDiscount = jq("<a href='#' id='srtDiscount'>Discount</a>");
	srtDiscount.attr("active","true");
	srtDiscount.data("sort-type","Discount");
	srtDiscount.addClass("ASC");
	srtDiscount.appendTo(sortContainer);

	var srtDate = jq("<a href='#' id='srtDate'>Release Date</a>");
	srtDate.data("sort-type","Date");
	srtDate.appendTo(sortContainer);

	var filterContainer = jq("<div id='customFilter' style='margin: 8px 0;'></div>");
	filterContainer.insertBefore(sortContainer);

	jq("<label for='filterPriceMin' class='filterLabel'>Minimum Price</label><input id='filterPriceMin' type='number' class='floatInput filterInput' value='0.00' /> €").appendTo(filterContainer);
	jq("<label for='filterPriceMax' class='filterLabel'>Maximum Price</label><input id='filterPriceMax' type='number' class='floatInput filterInput' value='0.00' /> €").appendTo(filterContainer);
	jq("<label for='filterDiscount' class='filterLabel'>Minimum Discount</label><input id='filterDiscount' type='number' class='intInput filterInput' value='0' /> %").appendTo(filterContainer);

	jq('<button type="submit" class="btnv6_blue_hoverfade btn_small" id="customRefresh" style="float: right;"><span>Refresh</span></button>').appendTo(filterContainer);

	// Styles
	document.fExt.createStyle("#customSortContainer { display: block; width: 90%; padding: 4px; text-align: center; font-size: larger; }");
	document.fExt.createStyle("#customSortContainer a { margin: 10px; }");

	document.fExt.createStyle(".search_name { width: 58% !important; }");
	document.fExt.createStyle(".search_capsule { width: 40% !important; }");
	document.fExt.createStyle(".search_result_row { width: 267px !important; float: left !important; border: 2px groove rgba(28, 73, 101, 0.5); margin: 2px; }");
	document.fExt.createStyle(".search_result_row:hover { border: 2px groove rgba(28, 73, 101, 0.5); margin: 2px; }");
	document.fExt.createStyle("#search_result_container { width: 100%; max-width: 100% !important; }");
	document.fExt.createStyle(".responsive_search_name_combined { width: 100%; height: 45px; }");
	document.fExt.createStyle(".search_price_discount_combined { float: right; margin-right: 10px; width: 59%; }");
	document.fExt.createStyle(".search_price { float: right; }");
	document.fExt.createStyle(".leftcol.large { width: 1100px !important; }");
	document.fExt.createStyle(".filterLabel { width: 110px; float: left; }");
	document.fExt.createStyle(".filterInput { width: 100px; float: left; margin-right: 14px; text-align: right; }");
	document.fExt.createStyle(".page_content { width: 1400px !important; } ");
	document.fExt.createStyle(".search_discount.col span { position: absolute; top: 0; right: 20px; }");
	document.fExt.createStyle(".search_review_summary { position: absolute; top: 40px; right: 20px; }");
	document.fExt.createStyle(".search_price { position: absolute; top: 0; right: 80px;}");

	document.fExt.createStyle("#customSortContainer a:after { content: ''; border-left: 5px solid transparent; border-right: 5px solid transparent; bottom: 12px; position: absolute; }");
	document.fExt.createStyle("#customSortContainer a.ASC:after { border-top: 12px solid #fff; }");
	document.fExt.createStyle("#customSortContainer a.DESC:after { border-bottom: 12px solid #fff; }");


	// Functions
	function sort(srtType){
		var direction = "ASC";
		var modifier = 1;

		var jqSortElement;
		if(srtType !== undefined){
			jq("#customSortContainer a").each(function(){
				var jqThis = jq(this);
				var jqHtml = jqThis.html();

				if(jqThis.data("sort-type") === srtType){
					jqThis.attr("active","true");
					direction = jqThis.hasClass("ASC") ? "ASC" : "DESC";
					if(direction === "ASC") {
						jqThis.removeClass("ASC");
						direction = "DESC";
					}
					else {
						jqThis.removeClass("DESC");
						direction = "ASC";
					}

					jqSortElement = jqThis;
					jqSortElement.addClass(direction);
				}
				else {
					jqThis.removeClass("ASC");
					jqThis.removeClass("DESC");
					jqThis.removeAttr("active");
				}
			});
		}
		else {
			jqSortElement = jq("#customSortContainer a[active=true]");
			srtType = jqSortElement.data("sort-type");
			if(!srtType)
				return;
		}

		var container = jq("div#search_result_container");
		if(!container || jqSearchResultItems.length === 0)
			return;

		if(direction === "DESC")
			modifier = -1;

		jqSearchResultItems.each(function(itm,ind){ itm.item.prepend(); });
		jqSearchResultItems.sort(function(a,b){
			var compValA, compValB;
			switch(srtType){
				case "Price":
					return (direction === "DESC") ? a.price > b.price : a.price < b.price;
				case "Release Date":
					return (direction === "DESC") ? a.releaseDate > b.releaseDate : a.releaseDate < b.releaseDate;
				case "Discount":
					return (direction === "ASC") ? a.discount > b.discount : a.discount < b.discount;
			}
		});
		jqSearchResultItems.each(function(itm,ind){ itm.item.appendTo("#search_result_container"); });
	}

	function Initialize(){
		jq("a.search_result_row").remove();

		jq("div.search_name").each(function(){
			var jqThis = jq(this);
			var jqParent = jqThis.parent().parent("a");
			var jqAppImg = jqParent.find("div.search_capsule");
			jqThis.detach();
			jqThis.insertAfter(jqAppImg);
		});
		//jq("div.search_pagination").clone().insertBefore("div#search_result_container");

		// http://store.steampowered.com/search/?sort_by=&sort_order=0&category1=998&special_categories=&specials=1&page=pageID
		var lastPage = document.fExt.jq("div.search_pagination a:last");
		if(lastPage.length === 1 && (lastPage.text() === '>' || lastPage.text() === '&gt;'))
			lastPage = lastPage.prev();

		if(lastPage.length === 1){
			var rx = new RegExp(/(page=[0-9]+)/g);
			var matches = rx.exec(document.fExt.jq(location)[0].href);
			loadingPages = parseInt(lastPage.text());

			var pageLink = lastPage.attr('href').replace("page=" + loadingPages, "page=PAGENUMBER");

			jqSearchResultItems.each(function(item,index){
				item.item.remove();
			});
			jqSearchResultItems = [];

			if(loadingPages > 25)
				loadingPages = 25;

			loadingStep = 0;
			document.fExt.message("Loading pages (" + loadingStep + "/" + loadingPages + ")...");
			var step = 0;
			while(step < loadingPages){
				step++;
				var link = pageLink.replace("PAGENUMBER", step);
				loadPageAsync(link);
			}
		}
		else {
			loadingStep = 0;
			loadingPages = 1;
			document.fExt.message("Loading pages (" + loadingStep + "/" + loadingPages + ")...");
			loadPageAsync(window.location.href);
		}
	}

	function reInit(){
		if(jq("div.search_pagination").length === 2)
			setTimeout(function(){ reInit(); }, 500);
		else {
			jq("#search_result_container").unbind("DOMSubtreeModified");
			Initialize();
		}
	}

	function loadPageAsync(link){
		jq.ajax({
			url: link,
			type: 'GET',
			error: function(data){
				loadingStep++;
				console.log("Error loading page #" + loadingStep + ": " + data);
			},
			complete: function(data){
				loadingStep++;

				loading--;
				jq(data.responseText).find("a.search_result_row").each(function(){
					var jqItem = jq(this);
					var game = jqItem.find("span.title").text();
					var isUnique = jq.grep(jqSearchResultItems, function(itm){ return itm.game === game; }).length === 0;
					jqItem.css("display","none");

					if(isUnique) {
						var itemPrice = parsePrice(jqItem.find(".search_price").html().replace(/.*>/, ''));
						var itemDiscount = parseDiscount(jqItem.find(".search_discount span").text());
						var itemRelease = jqItem.find("div.search_released").text();

						if(isNaN(itemPrice))
							itemPrice = 0;
						if(isNaN(itemDiscount))
							itemDiscount = 0;
						if(itemRelease)
							itemRelease = Date.parse(itemRelease);


						jqItem.appendTo("#search_result_container");

						jqSearchResultItems.push({
							game: game,
							item: jqItem,
							discount: itemDiscount,
							price:  itemPrice,
							releaseDate: itemRelease,
						});
					}
				});

				if (loadingStep === loadingPages){
					sort();
					filter();
					document.fExt.popup("Loading completed.");
					document.fExt.message(undefined);
				}
				else document.fExt.message("Loading pages (" + loadingStep + "/" + loadingPages + ")(" + jqSearchResultItems.length + " uniqueItems found)...");
			},
		});
	}

	function parsePrice(text){
		return parseFloat(text.replace("€","").trim().replace(",","."));
	}

	function parseDiscount(text){
		return parseInt(text.replace("%","").trim());
	}

	function filter() {
		var priceMin = parsePrice(jq("#filterPriceMin").val());
		var priceMax = parsePrice(jq("#filterPriceMax").val());
		var discountMin = parseDiscount(jq("#filterDiscount").val()) * -1;
		var displayingItems = 0;
		var totalDisplayingItems = 100;
		var exceedingItems = 0;

		jqSearchResultItems.each(function(item, ind){
			var displayItem = true;

			if(priceMin > 0)
				displayItem = displayItem && item.price >= priceMin;
			if(priceMax > 0)
				displayItem = displayItem && item.price <= priceMax;
			if(discountMin < 0)
				displayItem = displayItem && item.discount <= discountMin;

			item.item.css("display", displayingItems < totalDisplayingItems && displayItem ? "block" : "none");
			if(displayItem) {
				if(displayingItems === totalDisplayingItems)
					exceedingItems++;
				else
					displayingItems++;
			}
		});

		if(exceedingItems > 0)
			document.fExt.popup("Too many items to display. (" + exceedingItems + " more items)");
	}

	// Events
	jq("#srtPrice, #srtDiscount, #srtDate").click(function(e) {
		e.preventDefault();
		sort(jq(this).data("sort-type"));
		return false;
	});

	jq(document).on('click', 'div.search_pagination_right a', function(e){
		jq("#search_result_container").bind("DOMSubtreeModified", reInit());
	});

	jq("input.floatInput").keyup(function(e){
		if(e.keyCode === 13){
			e.preventDefault();
			jq(".filterInput").trigger("keyup");
			return false;
		}
		else {
			var jqThis = jq(this);
			var val = jqThis.val().replace(/[^0-9,.]/g,'');

			if (val !== jqThis.val())
				jqThis.val(val);
		}
	});

	jq("input.intInput").keyup(function(e){
		if(e.keyCode === 13){
			e.preventDefault();
			jq(".filterInput").trigger("keyup");
			return false;
		}
		else {
			var jqThis = jq(this);
			var val = jqThis.val().replace(/[^0-9]/g,'');

			if (val !== jqThis.val())
				jqThis.val(val);
		}
	});

	var filterChangeID = 0;
	jq(".filterInput").keyup(function(e){
		if(e.keyCode === 13)
			e.preventDefault();

		filterChangeID++;
		var myChangeID = filterChangeID;
		setTimeout(function(){
			if (filterChangeID === myChangeID) {
				filterChangeID = 0;
				filter();
			}
		}, 1000);
	});

	jq("#customRefresh").click(function(e){
		e.preventDefault();
		reInit();
		return false;
	});

	// Init

	jq("form#advsearchform").on("submit", function(e){
		setTimeout(function(){
			Initialize();
		}, 500);
	});

	Initialize();
}