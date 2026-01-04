// ==UserScript==
// @name         SporzaNoSoccer
// @namespace    http://wimgodden.be/
// @version      2.0.1
// @description  Remove football (soccer for Americans) from Sporza.be and Deredactie.be
// @author       Wim Godden <wim@cu.be>
// @match        https://sporza.be/*
// @match        disabledhttps://www.vrt.be/vrtnws/nl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/368604/SporzaNoSoccer.user.js
// @updateURL https://update.greasyfork.org/scripts/368604/SporzaNoSoccer.meta.js
// ==/UserScript==


add_jQuery (removeSoccer, "1.7.2");

function add_jQuery (callbackFn, jqVersion) {
    jqVersion = jqVersion || "1.7.2";
    var D = document;
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    var scriptNode = D.createElement ('script');
    scriptNode.src = 'https://ajax.googleapis.com/ajax/libs/jquery/'
                    + jqVersion
                    + '/jquery.min.js'
                    ;
    scriptNode.addEventListener ("load", function () {
        var scriptNode = D.createElement ("script");
        scriptNode.textContent =
            'var gm_jQuery  = jQuery.noConflict (true);\n'
            + '(' + callbackFn.toString () + ')(gm_jQuery);'
        ;
        targ.appendChild (scriptNode);
    }, false);
    targ.appendChild (scriptNode);

    setTimeout(function() {
        removeSoccer(gm_jQuery);
    }, 2000); // A second will elapse and Code will execute.
}

function removeSoccer($) {
    'use strict';

    function searchTheDivs(searchString, element) {
        // Select all div elements containing 'bla'
        let divsWithElement = Array.from(document.querySelectorAll(searchString)).filter(div => div.textContent.includes(element));

        // Filter those divs to find ones that meet the class criteria
        let filteredDivs = divsWithElement.filter(div => {
            let hasCategoryClass = Array.from(div.classList).some(className => className.includes('category'));
            let currentElement = div.parentElement; // Starting point to look for 'storyCardContent'
            let hasStoryCardContentClass = false;
            while (currentElement !== null && typeof currentElement.tagName != "undefined" && currentElement.tagName != null && currentElement.tagName !== "section") { // Assumes SECTION is the stopping point
                if (Array.from(currentElement.classList).some(className => className.includes('storyCardContent'))) {
                    hasStoryCardContentClass = true;
                    break;
                }
                currentElement = currentElement.parentElement;
            }
            return hasCategoryClass && hasStoryCardContentClass;
        });
        return filteredDivs;
    }

    function searchAndRemove(element) {
        $("." + element).hide();
        $(".vrt-title--section:contains('" + element + "')").parent().parent().hide();
        //$("h2:contains('" + element + "')").parent().parent().hide();
        $("div .teaser div div a article div div h2:contains('" + element + "')").parent().parent().parent().parent().parent().parent().parent().hide();
        $("section div h2:contains('" + element + "')").parent().parent().hide();
        $(".article-teaser div div div:contains('" + element + "')").parent().parent().parent().remove();
        $("section div span:contains('" + element + "')").parent().parent().hide();
//        $("article div span:contains('" + element + "')").parent().parent().parent().parent().parent().hide();
//        $(".article-teaser div div p:contains('" + element + "')").parent().parent().parent().remove();
        $("div .vrt-banner__title:contains('" + element + "')").parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().remove();
        $(".sw-articles-module-articles .sw-card-module-card .sw-story-card-module-storyCardContent .sw-category-module-category:contains('" + element + "')").parent().parent().parent().remove();
        $(".sw-card-module-card .sw-story-card-module-storyCardContent .sw-category-module-category:contains('" + element + "')").parent().parent().remove();
        $(".FGSPK:contains('" + element + "')").parent().parent().parent().hide();
        //$("section div a div div:contains('" + element + "')").parent().parent().parent().hide();
        $('div[class^="_storyCardContent"] div[class^="_category"]:contains("' + element + '")').parent().parent().remove();

        let filteredDivs = searchTheDivs("section div a div div", element);
        console.log(filteredDivs);
        let filteredDivs2 = searchTheDivs("section div div a div div", element);
        console.log(filteredDivs2);

        filteredDivs.forEach(div => {
            console.log(div);
            div.parentElement.parentElement.style.display = 'none';
        });

        var links = document.evaluate('//a[contains(@href, "' + element + '")]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var j = 0; j < links.snapshotLength; j++) {
            var link = links.snapshotItem(j);
            link.parentNode.removeChild(link);
        }
    }


    var sporzaOnlyElements = [
        'Buitenland',
        'Anderlecht',
        'Club Brugge',
        'Antwerp',
        'Turkije',
        'Engeland',
        'Nederland',
        'Frankrijk',
        'Antwerp',
        'Union',
        'voetbal'
    ];
    var soccerElements = [
        'Proximus League',
        'EK-voorronde',
        'alle-doelpunten',
        'football',
        'fifa-wk-voetbal-2018',
        'champioensleaguetheme',
        'ek-2016',
        'euro-2016',
        'ek-france-theme',
        'rodedijvelstheme',
        'jupiler-pro-league',
        'voetbal',
        'rode duivels',
        'Rode Duivels',
        'Voetbal',
        'Europa League',
        'Messi',
        'Meunier',
        'Witsel',
        'Coucke',
        'Champions League',
        'Jupiler Pro League',
        'red flames',
        'Red Flames',
        'Duivelsgekte',
        'wereldkampioenen',
        'Villa Sporza',
        'de kijkersvraag voor een rode duivel',
        'jupiler pro league',
        'Extra Time',
        'Real Madrid',
        'Liverpool',
        'Silva',
        'De Bruyne',
        'Juventus',
        'Ronaldo',
        'AC Milan',
        'Atletico',
        'Real Madrid',
        'Barça',
        'Ajax',
        'jplacties',
        'KV Mechelen',
        'Mourinho',
        'Beker van België',
        'Abdelhak',
        'KV Oostende',
        'KV Mechelen',
        'Kompany',
        'KV Kortrijk',
        'Standard',
        'Neymar',
        'tackle',
        'JPL',
        'jpl goals',
        'Pereira',
        'Balotelli',
        'Casteels',
        'Franse ploeg',
        'Alderweireld',
        'Courtois',
        'Lagere klassen',
        'Eerste Klasse b',
        'Les Bleus',
        'Nations League',
        'Beker van belgie',
        'Beckham',
        'Bundesliga',
        'Pochettino',
        'Premier League',
        'Ligue 1',
        'Eerste Klasse B',
        'Serie A',
        'Primera Division',
        'de Duivels',
        'de Rode Duivels',
        'Fraudedossier',
        'fraudedossier',
        'Copa America',
        'De Tribune',
        'Primera División',
        'Eredivisie',
        'Diego Maradona overleden',
        'WK-voorronde',
        'MLS',
        'Coppa Italia',
        'super league',
        'EK voetbal',
        'Copa América',
        '1B Pro League',
        'Conference League',
        'Women Super League',
        'Afrika Cup',
        'Ibrahimovic',
        'Gouden Schoen',
        'WK voor clubs',
        '90 minutes',
        'FA Cup',
        'Croky Cup',
        'Union',
        'Antwerp',
        'voetbal',
        'Challenger Pro League',
        'The Championship',
        'Champions League',
        'Manchester United',
        'lukaku',
        'DFB Pokal',
        'KAA Gent',
        "Women's Nations League",
        'Erik ten Hag',
        'Palmeiras',
        'Futsal',
        'Süper Lig',
        'Euro 2024',
        'Coupe de France',
        'Copa del Rey',
        'supercup',
        'KNVB-beker',
        'Youri Tielemans',
        'Primeira Liga'
    ];

    $(".matchdays").hide();

    soccerElements.forEach(function(element) {
        searchAndRemove(element);
    });

    if (window.location.hostname != 'www.vrt.be') {
        sporzaOnlyElements.forEach(function(element) {
            searchAndRemove(element);
        });
    }

    $("img[src*='soccer/championsleague/logo-highlighted.png']").parent().parent().parent().parent().hide();
    $("img[src*='soccer/default/icon-highlighted.png']").parent().parent().parent().parent().hide();
    $("img[src*='soccer/jupilerproleague/logo-highlighted.png']").parent().parent().parent().parent().hide();
    $("img[src*='soccer/championsleague/logo-dimmed.png']").parent().parent().parent().parent().hide();
    $("img[src*='soccer/default/icon-dimmed.png']").parent().parent().parent().parent().hide();
    $("img[src*='soccer/championsleague/background-highlighted-left-temp.png']").parent().parent().parent().parent().parent().hide();
    $("img[src*='soccer/jupilerproleague/icon-highlighted.png']").parent().parent().parent().parent().parent().hide();
    $("img[src*='soccer/jupilerproleague/logo-dimmed.png']").parent().parent().parent().parent().parent().hide();
    $("img[src*='soccer/default/icon-highlighted.png']").parent().parent().parent().parent().parent().hide();
    $("img[src*='soccer/euro2024/icon-highlighted.png']").parent().parent().parent().parent().parent().parent().hide();

    $("img:contains('polopoly_fs/1.2672806!image/1568165166.jpg')").hide();

    var snapEKImages = document.evaluate("//img[contains(@src,'1568165166')]",
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = snapEKImages.snapshotLength - 1; i >= 0; i--) {
		var elm = snapEKImages.snapshotItem(i);
        elm.parentNode.parentNode.parentNode.parentNode.style.display='none';
	}
}