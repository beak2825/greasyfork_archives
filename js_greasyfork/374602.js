// ==UserScript==
// @name       Neopets - Search Helper
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      3
// @description  Updated version of the reddit shop wiz script
// @match      http://www.neopets.com/halloween/witchtower*.phtml
// @match      http://www.neopets.com/island/kitchen*.phtml
// @match      http://www.neopets.com/medieval/earthfaerie.phtml*
// @match      http://www.neopets.com/faerieland/darkfaerie.phtml*
// @match      http://www.neopets.com/safetydeposit.phtml*
// @match      http://www.neopets.com/market.phtml?*type=your*
// @match      http://www.neopets.com/market.phtml*
// @match      http://www.neopets.com/space/coincidence.phtml
// @match      http://www.neopets.com/island/*training.phtml?*type=status*
// @match      http://www.neopets.com/pirates/academy.phtml?type=status
// @match      http://www.neopets.com/inventory.phtml*
// @match      http://www.neopets.com/halloween/esophagor*.phtml
// @match      http://www.neopets.com/faerieland/employ/employment.phtml?*job_id=*
// @match      http://www.neopets.com/closet.phtml*
// @match      http://www.neopets.com/auctions.phtml?*auction_id=*
// @match      http://www.neopets.com/winter/snowfaerie*.phtml
// @match      http://www.neopets.com/quests.phtml
// @match      http://www.neopets.com/games/kadoatery/index.phtml
// @match      http://www.neopets.com/games/kadoatery/*
// @match      http://www.neopets.com/process_cash_object.phtml
// @match      http://www.neopets.com/hospital.phtml
// @match      http://www.neopets.com/objects.phtml?*type=shop*
// @match      http://www.neopets.com/market.phtml?type=wizard&string=*
// @match      http://www.neopets.com/winter/igloo2.phtml
// @match      http://www.neopets.com/island/tradingpost.phtml*
// @match      http://www.neopets.com/market_your.phtml*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/374602/Neopets%20-%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/374602/Neopets%20-%20Search%20Helper.meta.js
// ==/UserScript==

imgsize = 20; // for the search images

$("<style type='text/css'>.searchimg { cursor: pointer; height: " + imgsize + "px !important; width: " + imgsize + "px !important;</style>").appendTo("head");

jQuery.fn.exists = function(){return this.length>0;};

var linkmap = { // for urls and images for each search type
    ssw: {
        "img": "http://images.neopets.com/shopkeepers/super_shopwizard.gif"
    },
    sw: {
        "url": "http://www.neopets.com/market.phtml?type=wizard&string=%s",
        "img": "http://images.neopets.com/shopkeepers/shopwizard.gif"
    },
    tp: {
        "url": "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&search_string=%s",
        "img": "http://images.neopets.com/new_shopkeepers/29.gif"
    },
    au: {
        "url": "http://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie=%s",
        "img": "http://images.neopets.com/shopkeepers/auctiongenie.gif"
    },
    sdb: {
        "url": "http://www.neopets.com/safetydeposit.phtml?obj_name=%s&category=0",
        "img": "http://images.neopets.com/images/emptydepositbox.gif"
    },
    closet: {
        "url": "http://www.neopets.com/closet.phtml?obj_name=%s",
        "img": "http://images.neopets.com/items/ffu_illusen_armoire.gif"
    },
    jni: {
        "url": "https://items.jellyneo.net/search/?name=%s&name_type=3",
        "img": "http://images.neopets.com/items/toy_plushie_negg_fish.gif"
    },
    dti: { // had to base64 the image that I have saved since the item now has the hanger on it -.-
        "img": "data:image/gif;base64,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"
    }
};

// user has premium toolbar
premium = $("#sswmenu .imgmenu").exists();

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}

function sswlink(item) {
    // the only different one because it doesn't use a URL
    return "<img item='"+ item + "' class='sswstuff searchimg' src='" + linkmap.ssw.img + "'>";
}

function sswopen(item) {
    if($(".sswdrop").hasClass("panel_hidden")) {
        $("#sswmenu .imgmenu").click();
    }

    if($("#ssw-tabs-1").hasClass("ui-tabs-hide")) {
        $('#ssw-tabs').tabs('select', 0);
    }

    $("#ssw-criteria").val("exact");

    $("#searchstr").val(item);

    //Added by me, click the search button.
    $('#button-search').click();
}

$(".sswstuff").live("click", function() {
    sswopen($(this).attr("item"));
});

function combiner(item, url, image) {
    url = url.replace("%s", item); // javascript needs sprintf.


if(url.indexOf("type=wizard&string=") != -1) {
    var urlCombined = "<a id='ShopWizButton' tabindex='-1' target='_blank' href='" + url + "'><img src='" + image + "' class='searchimg'></a>";

} else {

    urlCombined = "<a tabindex='-1' target='_blank' href='" + url + "'><img src='" + image + "' class='searchimg'></a>";
}

    return  urlCombined
}



function autoSearchShopWiz() {

        GM_setValue("ShopWizClickSearch", true);
}

// overall linker thing
function makelinks(item, extras) {
    // extras is an object that can only have boolean of 'cash' and 'wearable' (for now) | and a string/int number 'itemid' (only needed for wearable being true)
    links = document.URL.indexOf("/island/tradingpost.phtml") != -1 ? " " : "<br>";

    item = $.trim(item);
    if (typeof extras === "undefined") {
        extras = {cash: false, wearable: false, tradeable: true};
    }

    if (typeof extras.tradeable === "undefined") {
        extras.tradeable = true;
    }

    sswurl = sswlink(item);
    item = item.replace(/&/g, "%26");
    item = item.replace(/ /g, '+');

    if(extras.cash === false && extras.tradeable === true) {
        if(document.URL.indexOf("quests.phtml") == -1) { // doesn't show either SW if you're on a quest
            // SSW
            if(premium) {
                links += sswurl;
            }

            // Regular SW
            links += combiner(item, linkmap.sw.url, linkmap.sw.img);
        }

        // TP
        links += combiner(item, linkmap.tp.url, linkmap.tp.img);

        // Auctions
        links += combiner(item, linkmap.au.url, linkmap.au.img);
    }

    // SDB
    if(document.URL.indexOf("safetydeposit") == -1) {
        links += combiner(item, linkmap.sdb.url, linkmap.sdb.img);
    }

    // Closet
    if(extras.wearable) {
        if(document.URL.indexOf("closet.phtml") == -1) {
            links += combiner(item, linkmap.closet.url, linkmap.closet.img);
        }
    }

    // JN items
    links += combiner(item, linkmap.jni.url, linkmap.jni.img);

    // DTI
    if(extras.wearable) {
        if(extras.itemid != -1 && typeof extras.itemid != "undefined") {
            link = "http://impress.openneo.net/items/" + extras.itemid;
        } else {
            link = "http://impress.openneo.net/items?utf8=%E2%9C%93&q=%s&commit=search";
        }
        links += combiner(item, link, linkmap.dti.img);
    }


        $("#ShopWizButton").click(autoSearchShopWiz);

    return links;
}

jQuery.fn.justtext = function() {
    return $(this).clone().children().remove().end().text();
};

//////////////////////////////////////////////////////////////////////////////////////////

/*
 Adds the search icons under things in:
 Inventory
 SDB
 Closet
 Auction Bidding Page
 Your Shop Price Page
 Coincidence
 MI Training School
 KI Training School
 Snow Faerie
 Esophagor
 Edna Quest
 Kitchen Quest
 Illusen/Jhudora
 Employment Agency
 Faerie Quest Page
*/

br = "<br>";
hr = "<hr>";

// Main Shops
if(document.URL.indexOf("objects.phtml?type=shop") != -1) {
    $("img[src*='/items/']").parent().parent().find("b").each(function(k,v) {
        $(v).after(makelinks($(v).text()) + br);
    });
}

// Igloo Garage
if(document.URL.indexOf("/winter/igloo2.phtml") != -1) {
    $("img[src*='/items/']").parent().parent().find("b").each(function(k,v) {
        $(v).after(makelinks($(v).text()) + br);
    });
}

// Trading Post
if(document.URL.indexOf("/island/tradingpost.phtml") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
       $(this.nextSibling).after(makelinks($(this)[0].nextSibling.nodeValue) + br);
    });
}

// Hospital
if(document.URL.indexOf("/hospital.phtml") != -1) {
    $("img[src*='/items/']").parent().prev().find("b").each(function(k,v) {
        $(v).after(makelinks($(v).text()) + br).before(br);
        $(v).parent().width(150);
    });
}

// Redeeming Cash
if(document.URL.indexOf("process_cash_object") != -1) {
    extras = {cash: true, wearable: true};
    $("img[src*='/items/']").parent().find("b").each(function(k,v) {
        $(v).before(br).after(makelinks($(v).text(), extras) + br);
    });
}

// Auctions
if(document.URL.indexOf("auction_id") != -1) {
    nameb = $("b:contains('owned by')");
    fixname = nameb.html();
    fixname = fixname.substr(0, fixname.indexOf(" (own")); // remove "owned by..."
    nameb.parent().find("img").after(makelinks(fixname));
}

// Inventory
if(document.URL.indexOf("inventory") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        $nametd = $(v).parent().parent();

        extras = {cash: $(v).hasClass("otherItem"), wearable: $nametd.hasClass("wearable"), itemid: -1};

        if ($nametd.find("hr").exists()) {

            extras.tradeable = !$nametd.find("span:contains('(no trade)')").exists();
            $nametd.find("hr").before(makelinks($nametd.justtext(), extras));
        } else {
            $nametd.append(makelinks($nametd.justtext(), extras));
        }
    });
}

// SDB & Closet
// only downside is not knowing if something is NC if it's in the closet. Oh well, no way to know.
if(document.URL.indexOf("safetydeposit") != -1 || document.URL.indexOf("closet") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        id = $(v).parent().parent().find("td").eq(5).find("input").attr("name").match(/\d+/g)[0];

        iswearable = $(v).parent().parent().find("td").eq(1).text().indexOf("(wearable)") != -1;
        if(document.URL.indexOf("closet") != -1) { // because it'll always be wearable if it's in the closet...
            iswearable = true;
        }
        category = $(v).parent().parent().find("td").eq(3);
        extras = {cash: (category.text().trim() == "Neocash"), wearable: iswearable, itemid: id};
        nametd = $(v).parent().parent().find("td").eq(1);
        nametd.find("b").eq(0).after(makelinks(nametd.find("b").eq(0).justtext(), extras));
    });
}

// Shop
if(document.URL.indexOf("type=your") != -1 || $("[name=subbynext]").length == 2) { // because pressing the Previous/Next 30 is a POST and has nothing of value in the URL
    $("img[src*='/items/']").each(function(k,v) {
        nametd = $(v).parent().parent().find("td").eq(0);
        itemname = nametd.text();
        itemname = itemname.replace(nametd.find(".medText").text(), "");

        nametd.find("b").eq(0).after(makelinks(itemname));
    });
}

// Shop2
if(document.URL.indexOf("market_your") != -1 || $("[name=subbynext]").length == 2) { // because pressing the Previous/Next 30 is a POST and has nothing of value in the URL
    $("img[src*='/items/']").each(function(k,v) {
        nametd = $(v).parent().parent().find("td").eq(0);
        itemname = nametd.text();
        itemname = itemname.replace(nametd.find(".medText").text(), "");

        nametd.find("b").eq(0).after(makelinks(itemname));
    });
}

// Coincidence
if(document.URL.indexOf("coincidence") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        nametd = $(v).parent();
        nametd.find("b").eq(0).after(makelinks(nametd.justtext()));
    });
}

// MI Training
if(document.URL.indexOf("/island/training.phtml?type=status") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        $(v).after(makelinks($(v).prev().text()) + "<hr>");
    });
}

// Secret Training
if(document.URL.indexOf("/island/fight_training.phtml?type=status") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        $(v).after(makelinks($(v).prev().text()) + "<hr>");
    });
}

// KI Training
if(document.URL.indexOf("/pirates/academy.phtml?type=status") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        nametd = $(v).parent();
        itemname = nametd.parent().find("td > b").eq(0).text();
        nametd.parent().find("td > b").eq(0).after(makelinks(itemname));
    });
}

// Snow Faerie
// essentially same as kitchen. woo, lazy!
if(document.URL.indexOf("snowfaerie") != -1) {
    addhr = (document.URL.indexOf("snowfaerie2") == -1);
    hr = addhr ? "<hr>" : "";
    $("img[src*='/items/']").parent().find("b").each(function(k,v) {
        $(v).after(makelinks($(v).text()) + hr);
    });
}

// Esophagor
if(document.URL.indexOf("esophagor") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        itemname = $(v).parent().find("b");
        itemname.after(makelinks(itemname.text()));
    });
}

// Edna
if(document.URL.indexOf("witchtower") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        itemname = $(v).parent().find("b");
        itemname.after(makelinks(itemname.text()));
    });
}

// Kitchen
if(document.URL.indexOf("kitchen") != -1) {
    addhr = (document.URL.indexOf("kitchen2") == -1);
    hr = addhr ? "<hr>" : "";
    $("img[src*='/items/']").parent().find("b").each(function(k,v) {
        $(v).after(makelinks($(v).text()) + hr);
    });
}

// illusen & jhudora
if($("img[src*='ef_2.gif']").exists() || $("img[src*='darkfaeriequest2.gif']").exists()) {
    itemname = $("center:contains('Where is my') > b").text();
    $("center:contains('Where is my')").parent().find("img[src*='/items/']").after(makelinks(itemname));
}

// employment agency
if(document.URL.indexOf("employment") != -1) {
    $("b:contains('Find')").eq(0).after(makelinks($("b:contains('Find')").eq(0).justtext()));
}

// Faerie Quests
if(document.URL.indexOf("quests") != -1) {
    $("img[src*='/items/']").each(function(k,v) {
        itemname = $(v).parent().find("b");
        itemname.after(makelinks(itemname.text()));
    });
}

// Kadoatery
if(document.URL.indexOf("kadoatery") != -1) {
    $("td:contains('You should give it'):not(:contains('Thanks,'))").each(function(k,v) {
        itemname = $(v).find("strong").last();
        itemname.after(makelinks(itemname.text()));
    });
}

// Shop Wiz Auto-Exact
if(document.URL.indexOf("type=wizard&string=") != -1) {
    $("[name='shopwizard']").val(getQueryParams(document.location.search).string);
    $("[name='criteria']").val("exact");

    if(GM_getValue("ShopWizClickSearch")) {

        GM_setValue("ShopWizClickSearch", false);
$('#content > table > tbody > tr > td.content > div.contentModule > table > tbody > tr:nth-child(2) > td > div > div > input[type="submit"]').click();
    }
}
