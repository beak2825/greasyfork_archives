// ==UserScript==
// @name       personal test script
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/block/
// @match				https://www.grundos.cafe/market/wizard/
// @match				https://www.grundos.cafe/guilds/guild/*/members/
// @require  	  https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @grant				GM_getValue
// @grant     	GM_setValue
// @grant				GM_listValues
// @grant				GM_addStyle
// @license     MIT
// @version     1.4
// @author      Cupkait (dani edit)
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description	 Blocked users can be synced but do not actually change anything in the SW results yet.

// @downloadURL https://update.greasyfork.org/scripts/495843/personal%20test%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/495843/personal%20test%20script.meta.js
// ==/UserScript==
function OrganizeShopWizResults() {

var divElements = $('.sw_results div');
var guildsList = GM_getValue('guildsList', []);
var allGuildMembers = [];
const userName = /user=(.*?)"/g.exec(document.body.innerHTML)[1];




function createSummaryInfo() {
    var newDiv = $('<div>')
		.addClass('summaryinfo')
		.css({})
		.html('<span id="top"><p id="name">' + itemName + '</p><p id="price">Lowest:  <i>' + lowestPrice.toLocaleString() + ' NP</i></p></span><span id="bottom"><p id="qty">Total Available: <strong><u>' + shopQtyTtl +
					'</u></strong></p><p id="searches">You have <strong>'+searchCount+ '</strong> searches left.</p></span><img width ="225px" src="https://i.imgur.com/OsayYEW.png">');




    var oldWiz = $('#page_content > main > div.center').replaceWith(newDiv);
}

$('#page_banner').html('<div class="newbanner">Savvy Shop Wiz</div>')
$('#page_content > main > h1').eq(0).remove();
$('#page_content > main > p').eq(0).remove();



$.each(guildsList, function(guildID, guildData) {
    var guildMembers = guildData.guildMembers;
    allGuildMembers = allGuildMembers.concat(guildMembers);
});

allGuildMembers = $.grep(allGuildMembers, function(member) {
    return member !== userName;
});

$('.sw_results').css({
    'grid-template-columns': '2fr 1fr 2fr 2fr'
});

var itemName = divElements.eq(5).text();
var shopQtyTtl = 0; // Initialize the total shop quantity
for (var i = 6; i < divElements.length; i += 4) {
    var shopQty = parseInt(divElements.eq(i).text(), 10);
    shopQtyTtl += shopQty;}

var searchCount = parseInt($('#page_content > main > div.center > p.nomargin.smallfont').text().split('/')[0]);


var varianceElement = $('<div>', {
    'class': divElements.eq(3).attr('class')
}).html('<strong>Variance</strong>').insertAfter(divElements.eq(3));

var friendList = GM_getValue('friendList', []);

var listPriceDiffs = [];
var lowestPrice;

for (var i = 7; i < divElements.length; i += 4) {
    var currentListPrice = parseFloat(divElements.eq(i).text().replace(/,/g, ''));
    var currentListPriceClass = divElements.eq(i).attr('class');

    if (!divElements.eq(i).hasClass('data') || !divElements.eq(i).hasClass('sw_mine') || !divElements.eq(i).hasClass('sw_friend')) {
        listPriceDiffs.push({
            listPrice: currentListPrice,
            priceDiff: 0,
            listPriceClass: currentListPriceClass
        });
    }
}

lowestPrice = Math.min(...listPriceDiffs.filter(entry => !entry.listPriceClass.includes('data') || !entry.listPriceClass.includes('sw_mine') || !entry.listPriceClass.includes('sw_friend')).map(entry => entry.listPrice));

listPriceDiffs.forEach(entry => {
    entry.priceDiff = entry.listPrice - lowestPrice;
});

listPriceDiffs.forEach((entry, index) => {
    var currentElement = divElements.eq(7 + (4 * index));
    var varianceText;
    if (entry.priceDiff === 0) {
        varianceText = '<strong style="color: green; font-weight: bold;">- LOWEST -</strong>';
    } else {
        if ($.inArray(currentElement.prev("div").prev("div").prev("div").text().trim(), allGuildMembers) !== -1 || currentElement.hasClass('data sw_guild')) {
            varianceText = '<strong style="color: red;">(' + '+' + entry.priceDiff.toLocaleString() + ')</strong>';
        } else if ($.inArray(currentElement.prev("div").prev("div").prev("div").text().trim(), friendList) !== -1 || currentElement.hasClass('data sw_mine')) {
            varianceText = '<strong style="color: red;">(' + '+' + entry.priceDiff.toLocaleString() + ')</strong>';
        } else {
            varianceText = '<strong>-</strong>';
        }
    }

    $('<div>', {
        'class': entry.listPriceClass
    }).insertAfter(currentElement).html(varianceText);
});

var rows = $('.market_grid.sw_results.margin-1 .data, .market_grid.sw_results.margin-1 .data.bg-alt');

rows.each(function(index) {
    var anchorElement = $(this).find('[href*="/browseshop/?owner="]');
    if (anchorElement.length) {
        var username = anchorElement.text();
        if ($.inArray(username, friendList) !== -1) {
            for (var i = 0; i < 5 && index + i < rows.length; i++) {
                var currentRow = rows.eq(index + i);
                currentRow.addClass('data sw_friend');
            }
        } else if ($.inArray(username, allGuildMembers) !== -1) {
            for (var i = 0; i < 5 && index + i < rows.length; i++) {
                var currentRow = rows.eq(index + i);
                currentRow.addClass('data sw_guild');
            }
        }
    }
});
createSummaryInfo();
$(".header:contains('Item')").remove();
$(".data:contains('" + itemName + "')").remove();

GM_addStyle(`
    .summaryinfo {
        display: flex;
        font-family: trebuchetMS;
        padding: 0px 25px;
        position: relative;
        height: 200px;
        width: 545px;
        margin-top: 10px;
        flex-direction: column;
        flex-wrap: wrap;
        align-content: space-between;
        justify-content: space-between;
        align-items: stretch;
        padding-bottom: 15px;
        align-self: center;
    }

    #top {
        line-height: 25px;
    }

    #bottom {
        line-height: 5px;
        font-size: 14px;
    }

    #name {
        max-width: 250px;
        font-family: heffaklump;
        font-size: 18px;
        margin-bottom: 5px;
        letter-spacing: 0px;
    }

    #price {
        font-size: 16px;
        margin: 0px;
    }

    #price i {
        font-weight: bold;
        font-size: 19px;
        font-style: normal;
    }

    #searches {
        margin-bottom: 0px;
    }

    #qty {
        bottom: 0px;
    }

    .newbanner {
        background-image: repeating-radial-gradient(circle at 0 0, transparent 0, #ffd700 10px), repeating-linear-gradient(rgba(199, 172, 19, 0.47), rgba(199, 172, 19, 0.47));
        background-color: #ffd700;
        font-family: heffaklump;
        font-weight: bold;
        line-height: 50px;
        font-size: 50px;
        padding-right: 20px;
        text-align: right;
        width: 595px;
        background-color: gold;
        border-radius: 20px;
        border: solid 5px black;
    }
		.data.sw_guild, .data.bg-alt.sw_guild {
			order: -2;
			background-color: #f3bc8c;
}
		.data.sw_friend, .data.bg-alt.sw_friend {
			order: -2;
			background-color: rgba(92, 227, 158, .53);
}
		.data.sw_mine {
			order: -2;
}
		.data.sw_block {
			background-color:#bcb6b6f7 !important;
			opacity:30%;
}
	.sw_block:hover {
			opacity:100%;
}
`);
};