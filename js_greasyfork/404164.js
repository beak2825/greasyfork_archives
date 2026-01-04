// ==UserScript==
// @name         WME Simplex
// @description  Shows simplex icon in WME bottom right corner. When clicked, opens Simplex Maps on the same WME location.
// @namespace    https://greasyfork.org/users/gad_m/wme_simplex
// @version      0.1.17
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEeklEQVRYR+2Xb8SedRzFz6lMMkkms5JJMkmUZJJJMjNZM8kkqWTWypqpXvSi3kySmZnZi2RmkjwymcnMzMxMZjKZJJNkkkxmksl08rl8r9v9XPd1/+l505t+b+7nuZ/r+v3O73zPOd/v4yTWf7j8P4B/w4DtOyTdL+luSYsl3STpb0nLJP0u6a/6nc/fJH2b5MdJFZ6pBLYflPSYpFsk/Srpe0mXJF1Ncs32VkmfSrpSwAB6n6R76/DTSb7pAzIRQN342brpaUnnk3DjwbINqM2S9ibh5vOW7RWSVhc7BwA87/1xJbDNwdz6kyTfjaPR9q2SnkpyaCLV9kqekwQI2GvWCAO2b6gbfVCUX5B0UtKhJLCwoGV7fZXpnKR1Sa6OALCNqKDzlxLVS5IeHhIdwjoDGElH2k2mIbK9WxI6OSHpQ0loal+jn+ES2N6EepN82aCzUTsALktCWJTlifr5T0mww7Owc7Gn/kvq75RyZ5J3al/YWJRkbgDA9tNsnGR/R2TYDhDnkqB+gD0q6TlJayXdU8//LOmopC8kUapVkj6XdLOkV4Y1UkxvRw8NANt3SXpB0u6uSutAlMyhPyT5ugMQltYVO1DLgTB2O89LWp8EcF13rOHZFgDUY7GzE9SOr1HyxSToYGTZ5lAA4n9EtiTJ9THPEl4baER3StqYZNcMYmJj6km6nRnOhAor6EcrhNKrZc9e55TbtgDgGUnXk3w1DUCVg5o/LumnJKfqOw7bUymJxS7Y/qOU3ghvDAubAfBaWWoQDtOA2F4u6RFASNoiCbseQZithmzjdyXhuYkA3i/REJHkwKlW7ZOA2MYZ5AEifC/Jjo448TvgcFYTv7Yp4ZMwLonAWwYDbxd6nuHLS9MCxjaqx65stLfep/MN+oRt8oLgWZ3keAEgtnEcz/HzKgC8nmTfNNrbv9vmZm9JwjEECoHEJyl5sm1ItrEjnfNgElKwa0PyZSUA3qxONq/L9bwAYiiHQjrfYFPbS+t7ZoITQyCw6+Ik5EMXwItYugVAh2qawxi1Yj1S7TZ6RZLPejbEfnQ7QMAEcwK6IPGWDu9vm33Inj0AeLkml/6BwWYDOiPe3zBJoLbJfkBwmWPlFFggDQ8PlZHUvZzkKAAeImaTfNxRMYLk1jSgOaJ6XKp13gMEZSIHaOPYey4JXRYnUA4GlF2IFgA3Stom6XDb0WqKod6EzruzpGQHBJEMCES4k9IlWVETFkD2t0NJ2wvIeWj6yPZGSbABjQRLb+5Pc01NSoQQWUDXpJnxeSzJ+UE52nnANvFKbPIQ/uVwhswFr7IiKYnNKeeO7njXHUgAgIjWdIfPHtVjPYTU2+2GBPd86YhSNvPEvHJ1h9IaNqjf8SRNnvccjkDfqJDpZamimjRkwqI79lu8byquUYy45SASj5gl8ZpV1G5KQgccrLIhKn+gYppQGrn1RAY6G7IR4iE4CBgmG6YdmhaaYQTjb5SDjOd7IvnstP+IRkQ4TWmVXsTxomKGV6j/tSRM0QtaM/1rtqCdZ3zpH/E+F8SJkFPAAAAAAElFTkSuQmCC
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/404164/WME%20Simplex.user.js
// @updateURL https://update.greasyfork.org/scripts/404164/WME%20Simplex.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global OpenLayers */
/* global WazeWrap */

(function() {

    initCitiesJson();
    
    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-simplex: WME is ready.');
        init();
    } else {
        console.debug('wme-simplex: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", init, {
            once: true,
        });
    }

    function initCitiesJson() {
        console.debug('wme-simplex: initCitiesJson()...');
        let fileURL = "https://raw.githubusercontent.com/melameg/public-resources/master/wme-simplex/cities.json";
        GM_xmlhttpRequest({
            method: "GET",
            url: fileURL,
            responseType: "json",
            onload: function (response) {
                if (response && response.status === 200) {
                    let citiesJson = response.response;
                    //console.debug('wme-simplex: initCitiesJson() citiesJson:\n' + JSON.stringify(citiesJson, null, 4));
                    window.citiesJson = citiesJson;
                    console.debug('wme-simplex: initCitiesJson() done. Number of supported cities: ' + Object.keys(citiesJson).length);
                } else {
                    console.error('wme-simplex: initCitiesJson() failed. response status: ' + response.status + " response text:\n" + response.responseText);
                }
            }
        });
    }

    function convertZoom(editorZoom) {
        let result;
        switch (editorZoom) {
            case 0:
            case 1:
            case 2:
            case 3:
                result = 4000;
                break;
            case 4:
                result = 3000;
                break;
            case 5:
                result = 1500;
                break;
            case 6:
                result = 500;
                break;
            case 7:
                result = 400;
                break;
            case 8:
            case 9:
            case 10:
                result = 300;
                break;
        }
        console.log('wme-simplex: convertZoom() converting: ' + editorZoom + ' returning: ' + result);
        return result;
    }

    function init() {
        console.log('wme-simplex: init()');
        let controlPermalink = jQuery('.WazeControlPermalink');
        let simplexLink = document.createElement('a');
        simplexLink.id = 'wme-simplex-a';
        simplexLink.title = "\u05e1\u05d9\u05de\u05e4\u05dc\u05e7\u05e1";
        simplexLink.style.display = "inline-block";
        simplexLink.style.marginRight = "2px";
        simplexLink.href = 'https://simplex-smart3d.com';
        simplexLink.target = '_blank';
        let simplexDiv = document.createElement('div');
        simplexDiv.class = 'icon';
        simplexDiv.style.width = "20px";
        simplexDiv.style.height = "20px";
        simplexDiv.style.backgroundImage = "url(https://static.wixstatic.com/ficons/73f1e3_99de9ff506204a51a87bac47171e2df2_fi.ico)";
        simplexDiv.style.backgroundSize = "20px 20px";
        simplexLink.appendChild(simplexDiv);
        controlPermalink.append(simplexLink);
        jQuery('#wme-simplex-a').click(function () {
            console.log('wme-simplex: click() map center: ' + JSON.stringify(W.map.getCenter()));
            let centerLonLat = new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
            centerLonLat.transform(new OpenLayers.Projection(W['Config'].map['projection']['local']), new OpenLayers.Projection(W['Config'].map['projection'].remote));
            console.log('wme-simplex: click() centerLonLat: ' + centerLonLat);
            let height = convertZoom(parseInt(W.map.getZoom()) - 12);
            let cityObj = window.citiesJson?window.citiesJson[W.model.getTopCityId()]:null;
            let href;
            if (cityObj) {
                href = 'https://simplex-smart3d.com/ces/' + cityObj.appName + '/App/?pos=' + centerLonLat.lon.toFixed(5) + ',' + centerLonLat.lat.toFixed(5) + ',' + (height + cityObj.height) + '&ori=0,-40,0';
            } else {
                href = 'https://simplex-smart3d.com/ces/net/app-models/?pos=' + centerLonLat.lon.toFixed(5) + ',' + centerLonLat.lat.toFixed(5) + ',' + height + '&ori=0,-40,0';
            }
            console.log('wme-simplex: click() returning: ' + href);
            this.href = href;
        });
        console.log('wme-simplex: init() done!');
    } // end init()
}.call(this));