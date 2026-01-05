// ==UserScript==
// @name       TradeMe Lifestyle Real Estate filter
// @namespace  http://tw/
// @version    1.0
// @description  Extension of the TradeMe Real estate filter to filter out listings baased on price per HA and definite prices only in Real Estate search results. Works in List view only
// @include    /http://www\.trademe\.co\.nz/[Bb]rowse/[Cc]ategory[Aa]ttribute[Ss]earch[Rr]esults.aspx.*/
//    tried using params to select only real estate search results but there are too many variants
// @include    http://www.trademe.co.nz/property/*
// @include    http://www.trademe.co.nz/browse/property/regionlistings.aspx*
// @include    http://www.trademe.co.nz/members/listings.aspx*
// @grant      none
// @copyright  public domain
// @downloadURL https://update.greasyfork.org/scripts/20586/TradeMe%20Lifestyle%20Real%20Estate%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/20586/TradeMe%20Lifestyle%20Real%20Estate%20filter.meta.js
// ==/UserScript==


//-----------------------------------------------------------------------------------------------
// Listings with a "price" that matches this pattern will be hidden
var KILL_PATTERN = /(Price by negotiation)|(Enquiries Over)|(To be auctioned)|(Tender)|(Deadline private treaty)/i;
// Listing that cost more than MAX_PRICE_PER_HA per HA will be hidden.
// (This is roughly 5% gross annual return for sheep, with no wool (a meat breed like Dorpers))
var MAX_PRICE_PER_HA = 17500;
// Some alternative kill patterns below, remove the "//" at the start of the line add a "//" before the other patterns to use them

// Any price that doesn't contain a dollar sign. This will allow "Enquiries over $nnnn" but block all auctions, tenders etc.
// var KILL_PATTERN = /^[^\$]*$/;

// Only kill "Price by negotiation"
// var KILL_PATTERN = /Price by negotiation/i;
//-----------------------------------------------------------------------------------------------

// v1.1.2 Trademe changed class for listing price
// v1.1, v1.1.1 Greasemonkey 2.0 changes
// v1.0 work with "Properties from this office" page and category listing pages

var KILLED_LISTING_STYLES = 
".killedlisting {background-color:#eeeeee !important; color: #999999 !important;}\
.hiddenlisting {display:none !important;}";

function addStyle(style) {
	$("<style>").prop("type", "text/css").html(style).appendTo("head");
}
addStyle(KILLED_LISTING_STYLES);

// replace trademe's JS error handler
window.onerror=function(msg, url, linenumber){
    if (msg.indexOf("Uncaught TypeError") < 0) { // caused by Adblock in Chrome I think
        console.log('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    }
    return true;
};

var killedListingCount = 0;

function toggleListingVisibility() {
    $(".killedlisting").toggleClass("hiddenlisting");
    $(".killToggle").each(function(index, toggle) {
        $(toggle).text($(toggle).text()==="show" ? "hide" : "show");
    });
}

// keypress code borrowed from "Google reader tiny"
function REF_key(event) {
   element = event.target;
   elementName = element.nodeName.toLowerCase();
   if (elementName == "input") {
     typing = (element.type == "text" || element.type == "password");
   } else {
     typing = (elementName == "textarea");
   }
   if (typing) return true;

    if (String.fromCharCode(event.which)=="H" && !event.ctrlKey && !event.altKey && !event.metaKey) {
     toggleListingVisibility();
     try {
       event.preventDefault();
     } catch (e) {
     }
     return false;
   }
   return true;
 }
document.addEventListener("keydown", REF_key, false);

function priceInsideRange(price) {
    if (price.indexOf('$')<0) {
        return true;
    }

    var numericPrice = parseInt(price.split('$')[1].replace(/,/g, ''));
    // catch prices accidentally listed as price/1000
    if (numericPrice < 1000) {
        numericPrice *= 1000;
    }

    // get the max and min prices from the search form 
    // values for "Any" = 0, "2M+" = 2000000
    var maxPrice = parseInt($("#max-49").val());
    var minPrice = parseInt($("#min-49").val());   
    // check for 2 million because this search form option is actually 2 million plus so doesn't count as a max
    var insideMax =  maxPrice <= 0 || maxPrice == 2000000 || numericPrice <= maxPrice;
    var insideMin = minPrice <=0 || numericPrice >= minPrice;

    return (insideMin && insideMax);
}

function addListingHeader() {
    if (killedListingCount > 0) {
        // add after the "nnnn listings, showing n to n" para
        // there are two of these, one <div> and one <p>, with one hidden depending on browse or search mode
        $(".listing-count-holder").each(function(index, listingCount) {
			var $listingCount = $(listingCount);
            $listingCount.html($listingCount.text()+ ". " + killedListingCount + ' hidden listings, <a class="killToggle" title="listings hidden by TradeMe Real Estate Filter script" href="javascript:void(0)">show</a>');
        });
        $(".killToggle").click(toggleListingVisibility);
    }
}

function scriptMain() {
	// try to check for property search results as it sometimes fires on Motors search results
	// breadcrumb class is different for category listing page e.g.
	// http://www.trademe.co.nz/property/residential-property-for-sale/canterbury/christchurch-city
	var firstBreadCrumb = $("#mainContent .site-breadcrumbs a:first, #mainContent .category-listings-breadcrumbs a:first");
	var priceColumnClass = ".list-view-card-price";
	if (firstBreadCrumb.length == 0) {
		// "Properties from this office" page
		firstBreadCrumb = $("#BreadCrumbsStore_BreadcrumbsContainer a:first");
		priceColumnClass = ".classifyCol";
	}
	var isPropertySearchResult = firstBreadCrumb.text().indexOf("Property") != -1;

    
    if (isPropertySearchResult) {
		// Class for the price field is different in gallery view so this won't find anything
		$(priceColumnClass).each(function(index, listingPrice) {
            var price = listingPrice.textContent;
	        var listing = $(listingPrice).closest(".listingCard")[0];
            var abc = $(listing).find(".attribute-boosted-container")[0];
            var area = $(abc).find(".property-card-land-area")[0];
			var areavalue = parseFloat($(area).find(".icon-attribute-number")[0].textContent);
            
            var number = Number(price.replace(/[^0-9\.]+/g,""));
            var pricePerHA = Math.round(number/areavalue);
            var dat = "".concat(areavalue," HA " ,pricePerHA.toString()," $/HA");
			var aaa= $(listing).find(".icon-attribute-number")[0];
            $(aaa).text(dat);
                
            
            
            if (KILL_PATTERN.test(price) || !priceInsideRange(price) || (pricePerHA>MAX_PRICE_PER_HA)) {
    				
			   $(listingPrice).closest(".listingCard").addClass("killedlisting hiddenlisting");
				killedListingCount++;
				
			}});
		
		// TODO could kill ".super-features-container" if all prices inside (".super-feature-price") should be killed?
		
		addListingHeader();
	}        
}
// wait for load as the TM page overwrites the "Showing n to n" header otherwise
$(window).load(scriptMain);
