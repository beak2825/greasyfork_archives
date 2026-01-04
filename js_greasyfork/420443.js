// ==UserScript==
// @name         Charts on Twitter CashTags
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Add link for charts in Twitter CashTags
// @author       @ozero
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420443/Charts%20on%20Twitter%20CashTags.user.js
// @updateURL https://update.greasyfork.org/scripts/420443/Charts%20on%20Twitter%20CashTags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // insert links for chart service
    let decorate = (anchors) => {

        for (let i in anchors){
            let txt = anchors[i].innerText;
            if(txt == ""){continue;}
            let href = anchors[i].href + "";
            if(href == ""){continue;}
            //
            if(href.substring(href.length - 13) == "cashtag_click"){
                if( anchors[i].getAttribute("data-decorate") == "done" ){
                    continue;
                }

                let symbol = txt.replace("$","");
                let attr = ' target="_blank" style="color:#8aa3d1;"'
                let links = [
                    '$', symbol, '</a><span style="font-size:80%;color:#8aa3d1;">[',
                    ' , <a ', attr, ' href="https://www.tradingview.com/symbols/', symbol, '">tV</a>',
                    ' , <a ', attr, ' href="https://stockrow.com/', symbol, '">SR</a>',
                    ' , <a ', attr, ' href="https://stockanalysis.com/stocks/', symbol, '/">sA</a>',
                    ' , <a ', attr, ' href="https://www.chartmill.com/stock/quote/', symbol, '">cM</a>',
                    ' , <a ', attr, ' href="https://finviz.com/quote.ashx?t=', symbol, '">Fv</a>',
                    ' , <a ', attr, ' href="https://finbox.com/', symbol, '">fB</a>',
                    ' ]</span>'
                ].join("");
                anchors[i].innerHTML = links;
                anchors[i].dataset.decorate = "done";
            }
            continue;
        }
    }

    //check and insert periodically (2sec)
    let scan_for_cashtags = () =>{
        window.setTimeout(function(){
            let a_list = document.getElementsByTagName("a");
            decorate(a_list);
            scan_for_cashtags();
        }, 2000);
    }

    //bootstrap
    scan_for_cashtags();
})();

