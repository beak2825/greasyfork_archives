// ==UserScript==
// @name         Sorare game changer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description
// @author       JVR
// @include        /^(?:https?:\/\/)?(?:www\.)?soraredata.com\/publicOffers/
// @include        /^(?:https?:\/\/)?(?:www\.)?soraredata.com\/ongoingAuctions/
// @icon         https://www.google.com/s2/favicons?domain=soraredata.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @updateURL
// @description Best Sorare game changer
// @downloadURL https://update.greasyfork.org/scripts/446189/Sorare%20game%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/446189/Sorare%20game%20changer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if ( window.location.href.indexOf("publicOffers") > -1) {
        window.addEventListener("load", () => {
            addButton("Check offers");
        });
    } else if ( window.location.href.indexOf("ongoingAuctions") > -1) {
        window.addEventListener("load", () => {
            addButton("Check Auctions");
        });
    }

    function quickCheckOffers() {
        $('.infinite-scroll-component > div > div').each(function(index) {

            let box = $(this);
            let styledBox = box.children("div:first");
            let primary = styledBox.children("div:first");
            let secondary = primary.children("div:first");
            let infoBox = secondary.children('div:eq(1)');
            let imageBox = secondary.children('div:eq(0)');
            // valeurs
            let ethValues = infoBox.children("div:first");
            let ethVal = ethValues.find('div:eq(2) p').text();

            let num = ethVal.match(/[\d\.]+/g);
            let ethValNum = parseFloat(num[0]);
            let marketVal = ethValues.find('div[data-tip="Floor price"] p').text();
            let marketValNum = marketVal.match(/[\d\.]+/g);
            if (marketValNum == null) {
                marketValNum = 10000000;
            } else {
                marketValNum = parseFloat(marketValNum[0]);
            }

            //3 days average
            let threedaysVal = ethValues.find('div[data-tip="3 days average"] p').text();
            let threedaysValNum = threedaysVal.match(/[\d\.]+/g);
            threedaysValNum = threedaysValNum && threedaysValNum[0] ? parseFloat(threedaysValNum[0]) : 0;

            //1 week average
            let oneweekVal = ethValues.find('div[data-tip="1 week average"] p').text();
            let oneweekValNum = oneweekVal.match(/[\d\.]+/g);
            oneweekValNum = oneweekValNum && oneweekValNum[0] ? parseFloat(oneweekValNum[0]) : 0;

            let pointValues = infoBox.children('div:eq(1)');

            //percent 5 games.
            let percent5Game = pointValues.find('div[data-tip$="games played over the past 5 games"]').next('.text-center').text();
            let percent5GameNum = percent5Game.match(/[\d\.]+/g);
            percent5GameNum = percent5GameNum && percent5GameNum[0] ? parseInt(percent5GameNum[0]) : 0;

            //percent 15 games.
            let percent15Game = pointValues.find('div[data-tip$="games played over the past 15 games"]').next('.text-center').text();
            let percent15GameNum = percent15Game.match(/[\d\.]+/g);
            percent15GameNum = percent15GameNum && percent15GameNum[0] ? parseInt(percent15GameNum[0]) : 0;

            //points 5 games.
            let points5Game = pointValues.find("div[data-tip='Average SO5 points (DNPs excluded) over the past 5 games']").text();
            let points5GameNum = points5Game.match(/[\d\.]+/g);
            points5GameNum = points5GameNum && points5GameNum[0] ? parseInt(points5GameNum[0]) : 0;

            // if there is 3days average or 1 week average AND diff beetween price and average higher than 10%, add triangle.
            let percentDiff = 0;
            if (threedaysValNum > 0) {
                let decreaseValue = threedaysValNum - ethValNum;
                percentDiff = (decreaseValue / threedaysValNum) * 100;
            } else if (oneweekValNum > 0) {
                let decreaseValue = oneweekValNum - ethValNum;
                percentDiff = (decreaseValue / oneweekValNum) * 100;
            }

            if ( window.location.href.indexOf("publicOffers") > -1) { // on est dans les offres
                // if price better by 10%, &&  price <= best market price AND price <= average 3 days or average 1 week AND percent 5 games >= 80 AND points 5 games >= 45
                if (percentDiff >= 10 && ((ethValNum <= marketValNum) && ((ethValNum <= threedaysValNum) || (ethValNum <= oneweekValNum)) && percent5GameNum >= 80 && points5GameNum >= 45)) {
                    //$('<span class="triangle-topleft"></span>').appendTo(box);
                    //$('<span align="center" style="font-weight: bold;"> test </span>').appendTo(box);
                    ethValues.find('div:eq(2) p').text(ethVal + ' (' + percentDiff.toPrecision(3) + ')');
                    if(percentDiff >= 20) {
                        imageBox.css('border', '4px solid    rgb(255,0,0)');
                        imageBox.css('border-bottom', '0');
                        infoBox.css('border', '4px solid    rgb(255,0,0)');
                        infoBox.css('border-top', '0');
                    } else if (percentDiff >= 15) {
                        imageBox.css('border', '4px solid    rgb(255,127,0)');
                        imageBox.css('border-bottom', '0');
                        infoBox.css('border', '4px solid    rgb(255,127,0)');
                        infoBox.css('border-top', '0');
                    } else{
                        imageBox.css('border', '4px solid    rgb(55,255,20)');
                        imageBox.css('border-bottom', '0');
                        infoBox.css('border', '4px solid    rgb(55,255,20)');
                        infoBox.css('border-top', '0');
                    }
                } else {
                    box.remove ();
                }
            } else if ( window.location.href.indexOf("ongoingAuctions") > -1) { // on est dans les encheres !!
                // if price better by 10%, &&  price <= best market price AND price <= average 3 days or average 1 week AND percent 5 games >= 80 AND points 5 games >= 45
                if (percentDiff >= 10 && ((ethValNum <= marketValNum) && ((ethValNum <= threedaysValNum) || (ethValNum <= oneweekValNum)) && percent5GameNum >= 80 && points5GameNum >= 45)) {
                    //$('<span class="triangle-topleft"></span>').appendTo(box);
                    //$('<span align="center" style="font-weight: bold;"> test </span>').appendTo(box);
                    ethValues.find('div:eq(2) p').text(ethVal + ' (' + percentDiff.toPrecision(3) + ')');
                    if(percentDiff >= 20) {
                        imageBox.css('border', '4px solid    rgb(255,0,0)');
                        imageBox.css('border-bottom', '0');
                        infoBox.css('border', '4px solid    rgb(255,0,0)');
                        infoBox.css('border-top', '0');
                    } else if (percentDiff >= 15) {
                        imageBox.css('border', '4px solid    rgb(255,127,0)');
                        imageBox.css('border-bottom', '0');
                        infoBox.css('border', '4px solid    rgb(255,127,0)');
                        infoBox.css('border-top', '0');
                    } else{
                        imageBox.css('border', '4px solid    rgb(55,255,20)');
                        imageBox.css('border-bottom', '0');
                        infoBox.css('border', '4px solid    rgb(55,255,20)');
                        infoBox.css('border-top', '0');
                    }
                } else {
                    box.remove ();
                }
            }

        });
    }

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {
            position: "fixed",
            bottom: "5%",
            right: "1%",
            "z-index": 3,
            fontWeight: "600",
            fontSize: "14px",
            backgroundColor: "#00cccc",
            color: "white",
            border: "none",
            padding: "10px 20px"
        };
        let button = document.createElement("button"),
            btnStyle = button.style;
        document.body.appendChild(button);
        button.innerHTML = text;
        // Setting function for button when it is clicked.
        button.onclick = quickCheckOffers;
        Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]));
        return button;
    }

    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    GM_addStyle(".triangle-topleft{width:0;height:0;border-top:70px solid gold;border-right:70px solid transparent;position: absolute; z-index: 1;}");

})();