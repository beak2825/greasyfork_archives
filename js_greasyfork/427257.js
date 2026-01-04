// ==UserScript==
// @name     Fix HB layout
// @author   quanzi
// @version  0.5
// @description    "Fix" HB's new layout
// @grant    none
// @match    https://www.humblebundle.com/games/*
// @match    https://www.humblebundle.com/books/*
// @match    https://www.humblebundle.com/software/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/76976
// @downloadURL https://update.greasyfork.org/scripts/427257/Fix%20HB%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/427257/Fix%20HB%20layout.meta.js
// ==/UserScript==

var tier_item_count;
var tier_headers;
var parent;
var backup;
var clone;
var divisor;

function GM_addStyleX(cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fix() {
  var tiers = Array.from($(".js-tier-filter"));
  tier_item_count = new Array();
  tier_headers = new Array();
  parent = $(".desktop-tier-collection-view")[0];
  for (tier of tiers) {
    tier.click();
    await sleep(0.3 * 1000);
	  tier_item_count.push(parent.childElementCount - 1);
    var header = $(".tier-header")[0].textContent;
    header = header.slice(0, header.indexOf("for"));
    header += "to unlock!";
    tier_headers.push(header);
  }
  tier_item_count.reverse();
  tier_headers.reverse();
  console.log(tier_item_count);
  console.log(tier_headers);
  tiers[0].click();
  
  for (var i in tier_item_count) {
    $('<h3 class="tier-header heading-medium js-tier-header tier-item-view" googl="true" style="width:100%;margin:0 .4em;order:' + 
        tier_item_count[i].toString() + '">' + tier_headers[i] + '</h3>').insertBefore(parent.childNodes[0]);
  }
	$(".tier-header")[0].textContent = "\xa0";
  $(".tier-filters")[0].style.display = "none";
  for (var i = parent.childNodes.length - 1, count = 0, t_index = 0; i >= 0, t_index < tier_item_count.length; i--){
    parent.childNodes[i].style.order = tier_item_count[t_index].toString();
    count++;
    if (count >= tier_item_count[t_index]) {
      t_index++;
    }
  }
  await sleep(0.5 * 1000);
  var clone = $(parent).clone(true);
  
  $(".js-basic-info-view").detach().appendTo(".bundle-title");
  $(".pwyw-view h2").clone().insertAfter(".quick-facts");
  $(".countdown-container").clone().insertAfter(".charity-amount-raised");
  $("<div class='button-get-the-bundle'>Get the bundle</div>").appendTo(".bundle-title");
  $(".button-get-the-bundle").click(function() {  window.scrollTo(0, document.querySelector(".sidebar").offsetTop - $(".navbar").height()); });
  
  var total_item_count = tier_item_count[tier_item_count.length - 1];
  if (total_item_count >= 30)
  	divisor = 8;
  else if (total_item_count >= 20)
    divisor = 7;
  else
  	divisor = 4;
  console.log(divisor);
  $('form').on('keyup change paste', 'input, select, textarea',async function(){  
    console.log('Form changed!');
    await sleep(0.5 * 1000);
    $(parent).empty();
    clone.appendTo($(".js-tier-collection")[0]);
  });
  
  var css = `
  .bundle-page .main-area { grid-column: 3/ span 8; text-align: center; }
  .bundle-page .sidebar { grid-column: 4 / span 6; }
  .bundle-title .bundle-logo { margin-left: auto; margin-right: auto; }
	.bundle-title .heading-medium { font-size: 20px; text-transform: uppercase; font-weight: bold; }
	.bundle-title .countdown-container { margin-top: 1em;	font-size: 16px;	text-transform: uppercase; }
	.bundle-title .time { font-size: 25px; display: block; }
  /*.inner-main-wrapper { text-align: center; }*/
  .desktop-tier-collection-view { justify-content: center; }
	.basic-info-view {	line-height: normal; }
  .basic-info-view .quick-facts {	justify-content: center; }
  .basic-info-view .quick-facts .fact { flex-basis: 25%; justify-content: center; font-size: 20px; margin-bottom: 0.5em; 
		text-transform: uppercase; font-weight: bold;
	}
  .basic-info-view .charity-amount-raised { max-width: 50%;	margin: auto;	font-size: 20px; padding: 1em; }
  .splits-adjustment-view .split-option:not(:last-child) { display: block; width: 50%; float: left; }
  .splits-adjustment-view .split-option:last-child { clear: both; }
  .desktop-tier-collection-view .tier-item-view { width: calc((100% - 3.75em) / ` + divisor + `); }
  .tier-item-details-view { text-align: left; }
  .tier-item-details-view .header-area { text-align: center; }
  .tier-item-details-view .heading-medium {	max-width: 100%; }
	.button-get-the-bundle { 
		background-color: #9cb946; border-radius: 2px; color: white; cursor: pointer; font-size: 1.25em; font-weight: bold;
    padding: 1em; position: relative; text-align: center; text-rendering: optimizeLegibility;
		text-shadow: 0 3px 0 rgba(0,0,0,0.2); text-transform: uppercase; transition: 0.35s; width: max-content;
		margin: 1em auto 0 auto;
	}
	.button-get-the-bundle:hover {
    background-color: #748934;
    text-shadow: 0 3px 0 rgba(0,0,0,0.3);
	}
  `;

  GM_addStyleX(css);
}


$(document).ready(function() {
  fix();  
});

