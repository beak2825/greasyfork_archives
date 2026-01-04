// ==UserScript==
// @name         Kinoland Smart Series
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Оптимизирует логику работы сайта Kinoland при работе со списком серий сериалов
// @author       Zeleax
// @match        https://kinoland.biz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinoland.biz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477022/Kinoland%20Smart%20Series.user.js
// @updateURL https://update.greasyfork.org/scripts/477022/Kinoland%20Smart%20Series.meta.js
// ==/UserScript==

var el_season, el;
var series=document.querySelectorAll("a[class='js-series-mark-episode season-mark']");
el=series[series.length-1];
if(el){
    var needSeason = el.getAttribute('data-season');
    var needSerie = el.getAttribute('data-episode');
    el=getClosestParentByTagName(el, 'tr');
    var needSerieNowHidden = (el.className=='js-series-episode hidden');
    var seasons=document.querySelectorAll("div[class='js-series-season season-area']");

    for(var i=0; el_season=seasons[i]; i++){
        var season_num=el_season.getAttribute('data-season');
        var season_visible=(getE('.//a[@class="js-series-season-toggle season-h-show"]', el_season) != null);

        if((season_num==needSeason && !season_visible) || (season_num!=needSeason && season_visible)){
            el=getE('.//span[@class="season-head-icon is-hidden"]', el_season); // Развернуть
            el.click();
            if(season_num==needSeason && needSerieNowHidden){
                el=getE('.//div[@class="js-series-showall season-showallep"]', el_season); // Показать все серии
                el.click();
            }
        }
    }
}

function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getClosestParentByTagName(el, tag){var p, e, fnd=false, tf=tag.toLowerCase();e=el;do{p=e.parentElement;if((p) && (p.tagName.toLowerCase()==tf)){fnd=true;break;} e=p;} while (e);return fnd?p:null;}