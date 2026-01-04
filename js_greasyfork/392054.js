// ==UserScript==
// @name         Amazon CamelCamelCamel Graphs & Shoptimate prices
// @name:fr      Amazon CamelCamelCamel Graphs & Shoptimate prices
// @version      0.2.8.2
// @description  Include CamelCamelCamel graphs & Shoptimate prices directly on Amazon products webpage
// @description:fr  Affiche l'historique des prix amazon ainsi que le prix du même produits sur les autres sites de ventes en lignes
// @author       Thibault
// @namespace    https://greasyfork.org/fr/users/130639-thib
// @include      /^https?://www\.amazon\..*$/
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-latest.min.js
// @icon         https://www.amazon.com/favicon.ico
// @antifeature referral-link
// @downloadURL https://update.greasyfork.org/scripts/392054/Amazon%20CamelCamelCamel%20Graphs%20%20Shoptimate%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/392054/Amazon%20CamelCamelCamel%20Graphs%20%20Shoptimate%20prices.meta.js
// ==/UserScript==

var country="";
var asin= "";

function init(){
    var $head = $('head');
    var $target = $("#corePriceDisplay_desktop_feature_div");
    country = document.domain.split(".")[document.domain.split(".").length - 1];
    asin = $.trim($(':input[id="ASIN"]').attr("value"));

    normalizeCurrentURL();
    $head.append('<script src="//code.jquery.com/jquery-latest.min.js"></script>');
    $head.append($('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">'));
    $head.append('<style><style style="text/css">#shoptimate{width:100%;border-collapse:collapse;}#shoptimate td{padding:4px;}#shoptimate tr{background: none;}#shoptimate tr:hover {background-color: #f1f1f1;cursor:pointer;}.textalignmiddle {text-align:center;vertical-align:middle;line-height:250px;} #camelcamelcamel {width:450px;} #shoptimate {overflow:auto;height:250px;} small {font-size:11px !important;} #shoptimate > tr {height: 38px !important;} #priceHistory {font-size:11px !important; border: 1px solid #f1f1f1;padding:5px;border-radius:5px;background-color:rgb(252, 252, 252);box-shadow: 2px 2px 4px 0px #959595;margin-bottom:10px;display: table;}</style>');
    $target.append('<div id="priceHistory"><table><tr><td><div id="camelcamelcamel" class="textalignmiddle"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Fetching Camelcamelcamel...</div></td></tr><tr><td><div id="shoptimate" class="textalignmiddle"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Fetching Shoptimate...</div></td></tr></table></div>');


    loadShoptimateprices($('#shoptimate'));
    loadCamelCamelCamelgraph($('#camelcamelcamel'));
    addParamToURLs('tag', partnerID[country]);
    var ulrDetection = new urlHandler();
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    fetch("https://analytics-az.netlify.app/.netlify/functions/sendGA", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin, country })
    })
    console.log("fetch");
}
function loadShoptimateprices($div){
    var url = 'https://toolbar.shoptimate.com/v1/fr/fr/amazon_fr/' + asin + '/chrome.html?extensionversion=1.1.2&v=1.1.2';

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(res) {
            var parser = new DOMParser();
            var html = parser.parseFromString(res.responseText, "text/html");
            var list = $(html).find('#offerslist tr:gt(0)');
            /*list.each(function(){
                    $(this).attr('onclick',$(this).attr('onclick').replace('http://www.shoptimate.com/redirect?url=', ''));
                    while(isEncoded($(this).attr('onclick'))){
                        $(this).attr('onclick',decodeURIComponent($(this).attr('onclick')));
                    }
                });*/
            if(list.length > 0) {
                $div.removeClass('textalignmiddle').hide().html(list).fadeIn();
            } else {
                $div.hide().html('<i class="fa fa-ban" aria-hidden="true"></i> No data available').fadeIn();
            }
        },
        onerror: function(res) {
            xmlhttpRequest_error(res);
        }
    });
}
function loadCamelCamelCamelgraph($div){
        var chart = {
            width : 450,
            height : 250,
            category : 'amazon-new'
        };
        if (asin != "")
        {
            var url = 'https://' + country + '.camelcamelcamel.com/product/' + asin;
            var graph = "<a target='blank' href='//" + country + ".camelcamelcamel.com/product/" + asin + "'><img src='//charts.camelcamelcamel.com/" + country + "/" + asin + "/" + chart.category + ".png?force=1&zero=0&w=" + chart.width + "&h=" + chart.height + "&desired=false&legend=1&ilt=1&tp=all&fo=0' /></a>";

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(res) {
                    var parser = new DOMParser();
                    var html = parser.parseFromString(res.responseText, "text/html");
                    $div.html(graph);
                },
                onerror: function(res) {
                    $div.hide().html('<i class="fa fa-ban" aria-hidden="true"></i> Unable to retrieve data.').fadeIn();
                    xmlhttpRequest_error(res);
                }
            });
        }
    }
function urlHandler(){
    this.orlUrl = window.location.href;
    this.check = {};
    var that = this;
    var detect = function(){
        if(that.orlUrl!=window.location.href){
            init();
            that.orlUrl = window.location.href;
        }
    };
    this.check = setInterval(function(){detect();},1000);
}
function xmlhttpRequest_error(res){
    var msg = [
        "An error occurred.",
        "responseText: " + res.responseText,
        "readyState: " + res.readyState,
        "responseHeaders: " + res.responseHeaders,
        "status: " + res.status,
        "statusText: " + res.statusText,
        "finalUrl: " + res.finalUrl].join('\n');
    console.log(msg);
}
function isEncoded(str) {
    return typeof str == "string" && decodeURIComponent(str) !== str;
}
function addParamToURLs(paramName, paramValue) {
    // Sélectionner tous les liens de la page
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        // Obtenir l'URL actuelle
        if (!link.href) return;

        try {
            const url = new URL(link.href);
            const domain = url.hostname;
            if (!/amazon\./i.test(domain)) return;

            // Extraire ASIN si présent
            let asinMatch = url.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
            if (!asinMatch) return;
            let asin = asinMatch[1];

            // Construire la nouvelle URL propre
            let newUrl = `${url.protocol}//${url.host}/dp/${asin}/ref=nosim`;


            if (paramName && paramValue) {
                newUrl += `?${paramName}=${paramValue}`;
            }

            // Mettre à jour le href
            link.href = newUrl;
        }
        catch(e) {
            // Ignore les URLs invalides
        }
    });
}
function normalizeCurrentURL() {
    try {
        const currentUrl = new URL(window.location.href);
        const tag = partnerID[country]; // TOUJOURS celui du script

        // Vérifier Amazon
        if (!/amazon\./i.test(currentUrl.hostname)) return;

        // Extraire ASIN si présent
        const asinMatch = currentUrl.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);

        let newUrl;

        if (asinMatch) {
            const asin = asinMatch[1];
            // URL produit normalisée
            newUrl = `${currentUrl.protocol}//${currentUrl.host}/dp/${asin}/ref=nosim?tag=${tag}`;
        } else {
            // Page sans ASIN → juste forcer le tag
            newUrl = `${currentUrl.protocol}//${currentUrl.host}${currentUrl.pathname}?tag=${tag}`;
        }

        // Mettre à jour seulement si nécessaire
        if (currentUrl.toString() !== newUrl) {
            window.history.replaceState({}, '', newUrl);
        }
    }
    catch (e) {
        console.log('normalizeCurrentURL error', e);
    }
}
function onNewHrefAdded(node) {
    if (node.tagName === 'A' && node.href) {
        addParamToURLs('tag', partnerID[country]);
    }
}
const observer = new MutationObserver(mutations => {
        mutations.forEach(mut => {
            mut.addedNodes.forEach(node => {
                if (node instanceof HTMLElement) {
                    onNewHrefAdded(node);
                    node.querySelectorAll?.('a').forEach(link => onNewHrefAdded(link));
                }
            });
        });
    });
const partnerID= {
    fr:'thib0a2-21',
    au: 'thib-22',
    es: 'thib068-21',
    it: 'thib0f-21',
    de: 'thib0d-21',
    'co.uk': 'thib06-21',
    uk: 'thib06-21',
    com: 'thib09-20',
    ca: 'thib0b-20'

}
init();