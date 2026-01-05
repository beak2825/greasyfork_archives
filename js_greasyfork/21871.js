// ==UserScript==
// @name TOC Lista Ludopedia
// @namespace tequila_j-script
// @version    3.0.2
// @description  Mostra um TOC para os itens de uma lista da ludopedia, bem como informação de leilões (preço)  (ludopedia.com.br)
// @match      http://*.ludopedia.com.br/lista/*
// @match      http://ludopedia.com.br/lista/*
// @match      https://*.ludopedia.com.br/lista/*
// @match      https://ludopeda.com.br/lista/*
// @grant    GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/21871/TOC%20Lista%20Ludopedia.user.js
// @updateURL https://update.greasyfork.org/scripts/21871/TOC%20Lista%20Ludopedia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*jshint multistr: true */

GM_addStyle("\
div.principal {\
	position: relative;\
}\
\
div.toc {\
	position: fixed;\
	top: 20px;\
	bottom: 0px;\
	right: 0px;\
	width: 350px;\
    margin: auto;\
	//box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\
    background: rgba(240,240,253,0.95);\
    padding: 8px 8px;\
	height: 100%;\
	z-index: 5000;\
}\
\
div.toc div.inner-panel {\
	overflow-y: hidden;\
	height: 100%;\
}\
div.toc div.pag-panel {\
	height: 15px;\
}\
div.toc .auction-info {\
	position:absolute;\
	left:0px;\
	font-size: xx-small;\
	cursor: pointer;\
	cursor: hand;\
}\
div.toc .auction-info span{\
	padding: 0px 3px;\
}\
div.toc div.hide-show-panel {\
	position: absolute;\
	left:-15px;\
	top: 0px;\
	bottom: 0px;\
	height: 100%;\
	width: 15px;\
	background: rgba(240,240,253,0.90);\
	box-shadow: -9px 0px 18px 0 rgba(0, 0, 0, 0.2);\
	border-right: 1px solid lightgray;\
	line-height: 100%;\
	text-align: center;\
	border-bottom-left-radius: 10px;\
	border-top-left-radius: 10px;\
}\
div.toc div.hide-show-panel .hide-show-panel-icon {\
	line-height: 100vh;\
}\
\
div.toc div.list-panel {\
	margin:2px 0px;\
	overflow-y: auto;\
	height: calc(100% - 20px);\
}\
div.toc div.list-panel::-webkit-scrollbar {\
    display: none;\
}\
");

GM_addStyle("\
div.toc p {\
	margin:2px 0px;\
	border-bottom: 1px solid white;\
}\
div.toc p:hover {\
	background: rgba(220,220,253,0.90);\
}\
\
div.toc p {\
	font-size: small;\
	padding: 0px;\
}\
div.toc p span.bid {\
	cursor: pointer;\
	cursor: hand;\
}\
div.toc p span.name {\
	cursor: pointer;\
	cursor: hand;\
	color:black;\
}\
div.toc p a.name {\
	cursor: pointer;\
	cursor: hand;\
	color:black;\
}\
div.toc p div.value-detail {\
	cursor: pointer;\
	cursor: hand;\
	display: inline;\
}\
div.toc p div.value-detail span.next-val {\
	color: #555555;\
}\
div.toc div.list-panel p {\
	border-left: 5px solid transparent;\
	padding-left: 3px;\
}\
div.toc div.list-panel p.auction-ended {\
	border-left: 5px solid darkred;\
	padding-left: 3px;\
}\
div.toc div.list-panel p.i-am-winning {\
	background-color: lightgreen;\
}\
div.toc div.list-panel p.i-am-winning span {\
	color: black;\
}\
div.toc div.list-panel p.i-win {\
	background-color: lightgreen;\
}\
div.toc .panel {\
}\
\
div.toc .misc\
{\
    position: absolute;\
    top: 103%;\
    left: 0;\
    width: 100%;\
}\
div.toc .micropagination {\
	font-size: x-small;\
}\
div.toc ul.micropagination {\
	font-size: x-small;\
	display:inline-block;\
	width: 100%;\
	text-align: right;\
}\
div.toc .micropagination li {\
	display: inline;\
	padding: 0px 8px;\
}\
div.toc .micropagination li.active {\
	border: 1px solid lightgray;\
	background-color: #d1d1d1;\
}\
div.toc .micropagination li.disabled a {\
   	color: rgb(220,230,243);\
}\
.fa {\
	font-size: xx-small;\
	padding-right: 2px;\
}\
");


//var $items = $('div[id^="id_ludo_list_item_"');
var $items = $('div.lista-item');

var itemsObject = [];

$items.each(function () {
  var itemHeader = $(this).find('h3.mar-no');
  //var itemName = $(itemHeader[1]).html();
  var itemName = itemHeader.clone()    //clone the element
    .children() //select all the children
    .remove()   //remove all the children
    .end()  //again go back to selected element
    .text();
  
  var newLudpediaListCompat = $(this).children("div:first");
  
  var linkObject = $(this).find("div.list-item-buttons").find("a:first");
  
  var itemAnchor = $(itemHeader[0]).attr('href');
  
  var itemHash = linkObject.prop("hash");
  
  //item id is more complicated than it should because changes in Ludopedia 
  //made an old script deprecated, and this was the fastest way to correct it
  var itemObject = {
    'name' : itemName,
    'anchor' : itemAnchor,
    'id' : newLudpediaListCompat.attr('id'),
    'hash': itemHash,
    'link': linkObject.attr("href")
  };
  
  //does it have an alternate name?
  var itemBody = $(this).find('div.lista-item-descricao').text();
  var alternateNameLine = itemBody.match(/\+\+.*\+\+/);
  if (alternateNameLine !== null) {
    console.log(alternateNameLine);
    var parts = alternateNameLine[0].substring(2,alternateNameLine[0].length - 4).trim();
    itemObject.name = parts;
  }
  
  itemsObject.push(itemObject);
});


//create the small box
var $tocEl = $(document.createElement('div')).addClass("toc");
var $tocInnerPanel = $(document.createElement('div')).addClass("inner-panel");
var $tocPagPanel = $(document.createElement('div')).addClass("pag-panel");
var $tocListPanel = $(document.createElement('div')).addClass("list-panel");
var $tocPanel = $(document.createElement('div'));

var $hideShowPanel = $(document.createElement('div')).addClass("hide-show-panel");
var $hideShowIcon = $(document.createElement('i')).addClass("hide-show-panel-icon fa");
$hideShowPanel.append($hideShowIcon);

if (localStorage.getItem('toc-panel') == 'hide') {
  $tocEl.css("margin-right",'-350px');
  $hideShowIcon.addClass("fa-chevron-circle-left");
} else {
  $hideShowIcon.addClass("fa-chevron-circle-right");
}

$hideShowPanel.click(function() {
    if($tocEl.css("margin-right") == "-350px")
    {
        $tocEl.animate({"margin-right": '+=350'});
      	localStorage.setItem('toc-panel', 'visible');
      	$hideShowIcon.removeClass("fa-chevron-circle-left");
      	$hideShowIcon.addClass("fa-chevron-circle-right");
     }
    else
    {
      $tocEl.animate({"margin-right": '-=350'});
      localStorage.setItem('toc-panel', 'hide');
      $hideShowIcon.removeClass("fa-chevron-circle-right");
      $hideShowIcon.addClass("fa-chevron-circle-left");
     }
  });


$tocEl.append($hideShowPanel);
$tocEl.append($tocInnerPanel);
$tocInnerPanel.append($tocPagPanel);
$tocInnerPanel.append($tocListPanel);
$('div#container').append($tocEl);

var currUsername = $("li#dropdown-user").find("div.username").html().trim();
console.log("Logged user:" + currUsername);
  
//check if this is an auction:
//Ive never tested in non autcion lists if all the requirements are repeated
var isAuctionList = $('div.text-leilao label:contains("Final do Leilão")').length > 0;
console.log("Is Auction:" + isAuctionList);
  
if (isAuctionList) {  // get some header info
 	var auctionInfo = $('div.text-leilao');
  	var endDateStr = $(auctionInfo[0]).find("span:first").html();
  	var srcState = $(auctionInfo[1]).find("span:first").html();
  	var auctionInfo = $('<div class="auction-info"><span class="endDate">' + endDateStr + '</span><span class="state">' + srcState + '</span></div>');
  
  	var baseHref = $(location).attr("href").split(/&id_ludo_list_item/)[0];
  	var auctionTitle = $(document).attr('title');
  
  	$tocPagPanel.append(auctionInfo);
  	auctionInfo.click(function () {
      	history.pushState("none", auctionTitle, baseHref);
      	$("html, body").animate({ scrollTop: 0 }, "fast");
		return false;
    });
  	console.log("Date/State" + endDateStr + "/" + srcState);
}
  
  console.log(itemsObject);

//cria a lista de TOC
itemsObject.forEach(function(item) {
  
  var tocEntry = $(document.createElement('p'));
  var tocName = $(document.createElement('a')).addClass('name');
  var tocSeparator = $('<span> - </span>').addClass("separator");
  var tocHammer = $(document.createElement('i')).addClass('fa fa-gavel');
  var tocNext = $(document.createElement('i')).addClass('fa fa-chevron-right');
  var tocNextValue = $(document.createElement('span')).addClass("next-val");
  var tocValueDetail = $(document.createElement('div')).addClass("value-detail");
  
  var entryPieces = [];
  
  tocName.html(item.name);
  tocName.attr("href",item.link);
  
  var listItem = $(document.getElementById(item.id)).parent(); //hack
  
  
  tocEntry.append(tocName);
  
  if (isAuctionList) { //this is an auction, so put the link to the bid and current next val
    
    var auctionBlock = $(listItem).find('.bloco-leilao');
  	var hasItemFailed = auctionBlock.hasClass("leilao-sem-lance-fim");
  	var hasItemSucceed = auctionBlock.hasClass("leilao-lance-fim");
  	var hasAuctionEnded = hasItemFailed || hasItemSucceed;
    
    var auctionUsername = auctionBlock.find("[id^=usuario_lance_]").html().trim();
    
    
    var amIWinning = currUsername == auctionUsername;
    
    if (! hasAuctionEnded) {
    	if (amIWinning) {
      		tocValueDetail.append(tocHammer);
      		var myBid = auctionBlock.find('span[id^=vl_lance_atual]').first();
      		tocNextValue.html(myBid.text().replace("R$","").trim());
      		tocEntry.addClass("i-am-winning");
    	} else {
	  		tocValueDetail.append(tocNext);     
      		var nextBid = auctionBlock.find('select > option').first();
      		tocNextValue.html(nextBid.text().replace("R$","").trim());
    	}
      	tocEntry.append(tocSeparator.clone());
    	tocEntry.append(tocValueDetail);
      	tocValueDetail.append(tocNextValue);
    } else {
      if (amIWinning) {
      		tocValueDetail.append(tocHammer);
        	tocEntry.addClass("i-win");
       }
       var bid = auctionBlock.find('span[id^=vl_lance_atual]').first();
       tocNextValue.html(bid.text().replace("R$","").trim());
       
       tocEntry.append(tocSeparator.clone());
       tocEntry.append(tocValueDetail);
       tocEntry.addClass("auction-ended");
       tocValueDetail.append(tocNextValue);
    }

    tocValueDetail.click(function() {
      	$(listItem).find('div.bloco-show-lg').addClass("bloco-sm-content-open");
      	history.pushState(item.hash, item.name, item.link);
	    $('html, body').stop().animate({
    	'scrollTop': $(auctionBlock).offset().top - 80
		}, 400);
      	return false;
	});
  }
  
  $tocListPanel.append(tocEntry);
  
  tocName.click(function(e) {
    if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
      $('html, body').stop().animate({
     	'scrollTop': $(listItem).offset().top - 80
		}, 400);
        $(listItem).find('div.bloco-show-lg').addClass("bloco-sm-content-open");
      	history.pushState(item.hash, item.name, item.link);
      	return false;
  	}
  });

});

//create pagination
var paginationEl = $("ul.pagination");
if (paginationEl.length > 0) {
  var smallPagination = paginationEl.clone();
  smallPagination.removeClass("pagination").addClass("micropagination");
  $tocPagPanel.append(smallPagination);
}
  

  
  

})();




