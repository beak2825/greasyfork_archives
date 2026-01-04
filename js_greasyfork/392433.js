// ==UserScript==
// @name         WME GIS (IL)
// @description  Shows an GIS icon in WME bottom right corner. When clicked, opens selected city GIS (if available).
// @namespace    https://greasyfork.org/users/gad_m/wme_gis_il
// @version      1.0.59
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.2/proj4.js
// @require      https://greasyfork.org/scripts/28502-jquery-ui-v1-11-4/code/jQuery%20UI%20-%20v1114.js?version=187735
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      raw.githubusercontent.com
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEcklEQVRYR+1XXUyTVxh+vqL8VIGCk07+IpLQArXMQmKyDeQ3Za0TtisvTLwwaNyFGqOIy2am6IQYEqMJCYnxxhhli67iqF1TIz+bCRPcxgKlDIuAww6RBmzLX+m3nHfwhdqPkWUJ3HCuznn/zvM+533P+T7uK0CSCnwuAT7jgS1YgcEBL31ArRX4mqsHvuCAyhXYN2ALHviS+xYYXqnM30bAmOC+AfjVyH5hzzUAawwsywC3bh3WR0TA63LBNzPzn+uVk0iwPjISc9PTmPN4AvxFATCnpAMHsO3QIcgyMsBA8D4fXM+eYdhgQGd5OQVKKitDyrFjNO8+dw5D9fXCBlFZWUg/exYxeXkICgsjuWdgAP3Xr6Onuhq+6WmSBQCQBAfj/Tt3sGX3btFsB2/eRNu+faTLrKvDtoMHad6i1eIvs5nmMQUFyG5shCQkJCDGhNUKs0pFCYkCUF+6BMWJE6R02e2wXriAia4uOoZItRrOjg68amoi/a6HDxGTn09zY3Iy3HY7GHsf9fVhQ1ISwPPoPH0agzduICwuDgl792LsyRMM3b4tAPNjICw2Frr+fjAWZsfHYUpLw9Tw8JLnrh8YgDQxEb7ZWdyVSsF7vZDt2IGip0/J51VzM5pyc/+1bvwAKMrLoa6uJofemhr8Ns+EWISg0FB84nZTxm96e2FSKMhMrtUix2T6h8G+PvygUgnnLRbHD0COxQJ5QQHZNeXlEdXBmzaBbbYwvB4PZp1ORKSlQdvVReKXRiN+1OtpHhYfD/3z5+CCgmjtMJmoZmZevxZlwg9AidOJYJmMDA0yGR1DXksL3snOFpxZBf9eUYHYPXvwwb17JP/jyhX8evSoYLP94kUoKyqE9ZTDgZ/37xeKdDESAQDLtGR0lHTTo6No2LyZ5h87HAiVywWf9rIy9F+7hpTjx5FRU0PyX44cQd/Vq34ZKk6ehOr8eaonNlidtOp0GLFY/OwEAOFKJYqtVlK+sdlgUippHpGeToHiSktpvXA0mtpaJB8+TLJWvR4OozGAYplGQy29YetW0rEOsmRlLQEgNRXF3d2kZO33IDlZMNz16BFi5qv5+4QETL54gRyzGfKiIrJ5oFDA1dsbAIAJwlNSUGyzkc7rduO7jRvFAbDrstTpBDgO/NwcGhMTMTnfgvqhIUjj4zE3OYm7LIDPB53dTr3OWo+1IKNYbLDsWWu/zeyCrV8RFnZ0IEqjId1YezuslZWYGhlB/uPH4DiOLiTWVuxcP/V4qNIXsxUaG0vMsBoZa2tDiFxO17FMraaY3ZWV6DpzRpwBJn1Xp8OH9+9Tb4uN4YYG/FRSgnCFAsU9PWTiMJvRqtXSfHtVFZSnTon6soSac3PpGBaPgLeAgVAx1BqNAIQdxXhnJ+x1dfjTYED0zp147/JlisPWtvnLKyozE+wykxcWIjg6GjzP0/U8eOsWbFVVAZsz/yWf4yCplJ5R78SEqKNomouE7AVktbTcE77s98ByG/1f/RqANQZW/9ds1X9OV/v3/G8sHtjKp2bK3QAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/392433/WME%20GIS%20%28IL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392433/WME%20GIS%20%28IL%29.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global OpenLayers */
/* global proj4 */
/* global WazeWrap */

const CACHE_KEY = "gisJsonCachedData";
const CACHE_EXPIRY_KEY = "gisJsonCacheExpiry";
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

let likeTlv = function(orgUrl, lon, lat, zoom) {
    let centerLon = Math.round(lon["EPSG:900913"]);
    let centerLat = Math.round(lat["EPSG:900913"]);
    let width = 25*Math.pow(2, 11-zoom);
    let height = 10*Math.pow(2, 11-zoom);
    let result = orgUrl + (centerLon - width/2) + "," + (centerLat - height/2) + "," + (centerLon + width/2) + "," + (centerLat + height/2);
    console.debug('wme-gis-il: likeTlv() returning: ' + result);
    return result;
};

let v3GisNetChromeExtension = function(orgUrl, lon, lat, zoom, cityName, noExtent) {
    let centerLon = Math.round(lon.ITM);
    let centerLat = Math.round(lat.ITM);
    let width = 25*Math.pow(2, 11-zoom);
    let height = 10*Math.pow(2, 11-zoom);
    let extent = noExtent?'':"?extent=" + (centerLon - width/2) + "," + (centerLat - height/2) + "," + (centerLon + width/2) + "," + (centerLat + height/2) + ",2039";
    let result = "chrome-extension://hehijbfgiekmjfkfjpbkbammjbdenadd/nhc.htm#url=" + orgUrl + cityName + extent;
    let alertMsg = "<div dir='rtl'>\u05d4\u05d3\u05e4\u05d3\u05e4\u05df \u05dc\u05d0 \u05de\u05d0\u05e4\u05e9\u05e8 \u05e4\u05ea\u05d9\u05d7\u05ea \u05db\u05e8\u05d8\u05d9\u05e1\u05d9\u05d4 \u05d4\u05de\u05e9\u05ea\u05de\u05e9\u05ea \u05d1\u05ea\u05d5\u05e1\u05e3\u002e \u05e0\u05d0 \u05dc\u05e4\u05ea\u05d5\u05d7 \u05d1\u05db\u05e8\u05d8\u05d9\u05e1\u05d9\u05d4 \u05d7\u05d3\u05e9\u05d4 <a href='__placeholder__' target='_blank'>\u05e7\u05d9\u05e9\u05d5\u05e8 \u05d6\u05d4</a> \u0028\u05e7\u05dc\u05d9\u05e7 \u05d9\u05de\u05e0\u05d9 \u002d\u003e \u0022\u05e4\u05ea\u05d7 \u05e7\u05d9\u05e9\u05d5\u05e8 \u05d1\u05db\u05e8\u05d8\u05d9\u05e1\u05d9\u05d9\u05d4 \u05d7\u05d3\u05e9\u05d4\u0022\u0029.<br/><br/>\u05d4\u002dGIS \u05de\u05e6\u05e8\u05d9\u05da \u05e9\u05d9\u05de\u05d5\u05e9 \u05d1\u05ea\u05d5\u05e1\u05e3\u00a0IE Tab, \u05d4\u05ea\u05e7\u05e0\u05d4 <a href='https://chrome.google.com/webstore/detail/ie-tab/hehijbfgiekmjfkfjpbkbammjbdenadd' target='_blank'>\u05db\u05d0\u05df</a>.</div>".replace('__placeholder__', result);
    console.debug('wme-gis-il: v3GisNetChromeExtension() alerting with URL: ' + result);
    WazeWrap.Alerts.info(null, alertMsg, false, false);
    return result;
};

let arcgis = function(orgUrl, lon, lat, zoom, cityName, prefix, suffix, isEPSG) {
    let centerLon = Math.round(lon.ITM);
    let centerLat = Math.round(lat.ITM);
    if (isEPSG) {
        centerLon = Math.round(lon["EPSG:900913"]);
        centerLat = Math.round(lat["EPSG:900913"]);
    }
    let width = 25*Math.pow(2, 11-zoom);
    let height = 10*Math.pow(2, 11-zoom);
    let extent = (centerLon - width/2) + "," + (centerLat - height/2) + "," + (centerLon + width/2) + "," + (centerLat + height/2);
    prefix = prefix?prefix:'https://www.';
    suffix = suffix?suffix:'2039';
    let result = prefix + orgUrl + cityName + "&extent=" + extent + "," + suffix;
    console.debug('wme-gis-il: arcgis() returning: ' + result);
    return result;
};

let v3GisNet = function(orgUrl, lon, lat, zoom, cityName) {
    let centerLon = Math.round(lon.ITM);
    let centerLat = Math.round(lat.ITM);
    let width = 25*Math.pow(2, 11-zoom);
    let height = 10*Math.pow(2, 11-zoom);
    let result = orgUrl + cityName + "/?extent=" + (centerLon - width/2) + "," + (centerLat - height/2) + "," + (centerLon + width/2) + "," + (centerLat + height/2) + ",2039";
    console.debug('wme-gis-il: v3GisNet() returning: ' + result);
    return result;
};

let v5GisNet = function(orgUrl, lon, lat, zoom, cityName, queryParams) {
    let centerLon = Math.round(lon.ITM);
    let centerLat = Math.round(lat.ITM);
    let width = 25*Math.pow(2, 11-zoom);
    let height = 10*Math.pow(2, 11-zoom);
    let params = queryParams?(queryParams+"&"):"";
    let result = orgUrl + cityName + "?" +params + "extent=" + (centerLon - width/2) + "," + (centerLat - height/2) + "," + (centerLon + width/2) + "," + (centerLat + height/2);
    console.debug('wme-gis-il: v5GisNet() returning: ' + result);
    return result;
};

let gisIntertown = function(orgUrl, lon, lat, zoom, cityName, suffix) {
    if (!suffix) {
        suffix = "public";
    }
    let result = orgUrl + cityName + "/" + suffix + "/";
    console.debug('wme-gis-il: gisIntertown() returning (static url - no zoom): ' + result);
    return result;
};

let gis01To09Taldor = function(orgUrl, lon, lat, zoom, cityName, suffix) {
    let result = orgUrl + cityName + "/" + (suffix==null?'Default.aspx':suffix);
    console.debug('wme-gis-il: gis01To09Taldor() returning (static url - no zoom): ' + result);
    return result;
};

let gisTaldorPrefix = function(orgUrl, lon, lat, zoom, cityName, prefix) {
    let result = orgUrl.replace('__prefix__', prefix) + cityName;
    console.debug('wme-gis-il: gisTaldorPrefix() returning (static url - no zoom): ' + result);
    return result;
};

let orhitecErpgis = function(orgUrl, lon, lat, zoom, cityName) {
    let result = orgUrl + cityName;
    console.debug('wme-gis-il: orhitecErpgis() returning (static url - no zoom): ' + result);
    return result;
};

let metropolinet = function(orgUrl, lon, lat, zoom, cityName) {
    let mapZoom = zoom + 1;
    let centerLon = Math.round(lon.ITM);
    let centerLat = Math.round(lat.ITM);
    let result = orgUrl + cityName + "#882fa587-ec20-45ba-a1a7-f56063f32be9/" + centerLat + "/" + centerLon + "/" + mapZoom;
    console.debug('wme-gis-il: metropolinet() returning: ' + result);
    return result;
};

let gisOrgIlPrefix = function(orgUrl, lon, lat, zoom, cityName, prefix) {
    let centerLon = lon.ITM;
    let centerLat = lat.ITM;
    let marker = centerLon + "," + centerLat;
    //let zoomParam = zoom;
    let result = orgUrl.replace('__prefix__', prefix) + 'apps/' + cityName + "/?marker=" + marker + "%2C2039&zoom=" + zoom;
    console.debug('wme-gis-il: gisOrgIlPrefix() returning: ' + result);
    return result;
};

let gisCoIlPrefix = function(orgUrl, lon, lat, zoom, cityName, prefix) {
    let result = orgUrl.replace('__prefix__', prefix) + cityName + "/#/"
    console.debug('wme-gis-il: gisCoIlPrefix() returning: ' + result);
    return result;
};

(function() {

    let imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEcklEQVRYR+1XXUyTVxh+vqL8VIGCk07+IpLQArXMQmKyDeQ3Za0TtisvTLwwaNyFGqOIy2am6IQYEqMJCYnxxhhli67iqF1TIz+bCRPcxgKlDIuAww6RBmzLX+m3nHfwhdqPkWUJ3HCuznn/zvM+533P+T7uK0CSCnwuAT7jgS1YgcEBL31ArRX4mqsHvuCAyhXYN2ALHviS+xYYXqnM30bAmOC+AfjVyH5hzzUAawwsywC3bh3WR0TA63LBNzPzn+uVk0iwPjISc9PTmPN4AvxFATCnpAMHsO3QIcgyMsBA8D4fXM+eYdhgQGd5OQVKKitDyrFjNO8+dw5D9fXCBlFZWUg/exYxeXkICgsjuWdgAP3Xr6Onuhq+6WmSBQCQBAfj/Tt3sGX3btFsB2/eRNu+faTLrKvDtoMHad6i1eIvs5nmMQUFyG5shCQkJCDGhNUKs0pFCYkCUF+6BMWJE6R02e2wXriAia4uOoZItRrOjg68amoi/a6HDxGTn09zY3Iy3HY7GHsf9fVhQ1ISwPPoPH0agzduICwuDgl792LsyRMM3b4tAPNjICw2Frr+fjAWZsfHYUpLw9Tw8JLnrh8YgDQxEb7ZWdyVSsF7vZDt2IGip0/J51VzM5pyc/+1bvwAKMrLoa6uJofemhr8Ns+EWISg0FB84nZTxm96e2FSKMhMrtUix2T6h8G+PvygUgnnLRbHD0COxQJ5QQHZNeXlEdXBmzaBbbYwvB4PZp1ORKSlQdvVReKXRiN+1OtpHhYfD/3z5+CCgmjtMJmoZmZevxZlwg9AidOJYJmMDA0yGR1DXksL3snOFpxZBf9eUYHYPXvwwb17JP/jyhX8evSoYLP94kUoKyqE9ZTDgZ/37xeKdDESAQDLtGR0lHTTo6No2LyZ5h87HAiVywWf9rIy9F+7hpTjx5FRU0PyX44cQd/Vq34ZKk6ehOr8eaonNlidtOp0GLFY/OwEAOFKJYqtVlK+sdlgUippHpGeToHiSktpvXA0mtpaJB8+TLJWvR4OozGAYplGQy29YetW0rEOsmRlLQEgNRXF3d2kZO33IDlZMNz16BFi5qv5+4QETL54gRyzGfKiIrJ5oFDA1dsbAIAJwlNSUGyzkc7rduO7jRvFAbDrstTpBDgO/NwcGhMTMTnfgvqhIUjj4zE3OYm7LIDPB53dTr3OWo+1IKNYbLDsWWu/zeyCrV8RFnZ0IEqjId1YezuslZWYGhlB/uPH4DiOLiTWVuxcP/V4qNIXsxUaG0vMsBoZa2tDiFxO17FMraaY3ZWV6DpzRpwBJn1Xp8OH9+9Tb4uN4YYG/FRSgnCFAsU9PWTiMJvRqtXSfHtVFZSnTon6soSac3PpGBaPgLeAgVAx1BqNAIQdxXhnJ+x1dfjTYED0zp147/JlisPWtvnLKyozE+wykxcWIjg6GjzP0/U8eOsWbFVVAZsz/yWf4yCplJ5R78SEqKNomouE7AVktbTcE77s98ByG/1f/RqANQZW/9ds1X9OV/v3/G8sHtjKp2bK3QAAAABJRU5ErkJggg==';
    function getCities2GisJson(cb) {
        const cachedData = JSON.parse(GM_getValue(CACHE_KEY, "{}"));
        const cacheExpiry = GM_getValue(CACHE_EXPIRY_KEY, 0);
        if (cachedData && Date.now() < cacheExpiry) {
            console.info("wme-gis-il: getCities2GisJson() Using cached data");
            cb(null, cachedData);
        } else {
            const fileURL = "https://raw.githubusercontent.com/melameg/public-resources/refs/heads/master/wme-gis-il/cities2Gis.json";
            console.info('wme-gis-il: getCities2GisJson() getting from url: ' + fileURL);
            GM_xmlhttpRequest({
                method: "GET",
                url: fileURL,
                onload: (response) => {
                    if (response.status === 200) {
                        console.info('wme-gis-il: getCities2GisJson() storing in cache');
                        GM_setValue(CACHE_KEY, response.responseText);
                        GM_setValue(CACHE_EXPIRY_KEY, Date.now() + CACHE_DURATION_MS);
                        cb(null, JSON.parse(response.responseText));
                    } else {
                        cb(`wme-gis-il: getCities2GisJson() HTTP Error: ${response.status} - ${response.statusText}`, null);
                    }
                },
                onerror: (error) => cb(`wme-gis-il: getCities2GisJson() Request failed: ${JSON.stringify(error)}`, null),
                ontimeout: () => cb("wme-gis-il: getCities2GisJson() Request timed out.", null),
                timeout: 5000,
            });
        }
    }

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-gis-il: WME is ready.');
        init();
    } else {
        console.debug('wme-gis-il: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", init, {
            once: true,
        });
    }

    function convertUrl(params) {
        if (typeof params['functionName'] !== 'undefined') {
            if ('likeTlv' === params['functionName']) {
                return likeTlv(params['orgUrl'], params['lon'], params['lat'], params['zoom']);
            } else if ('arcgis' === params['functionName']) {
                return arcgis(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName'], params['prefix'], params['suffix'], params['isEPSG'] === "true");
            } else if ('v3GisNet' === params['functionName']) {
                return v3GisNet(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName']);
            } else if ('v5GisNet' === params['functionName']) {
                return v5GisNet(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName'], params['queryParams']);
            } else if ('gisIntertown' === params['functionName']) {
                return gisIntertown(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName'], params['suffix']);
            } else if ('gis01To09Taldor' === params['functionName']) {
                return gis01To09Taldor(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName'], params['suffix']);
            } else if ('gisTaldorPrefix' === params['functionName']) {
                return gisTaldorPrefix(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName'], params['prefix']);
            } else if ('orhitecErpgis' === params['functionName']) {
                return orhitecErpgis(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName']);
            } else if ('metropolinet' === params['functionName']) {
                return metropolinet(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName']);
            } else if ('v3GisNetChromeExtension' === params['functionName']) {
                return v3GisNetChromeExtension(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName'], params['noExtent'] === "true");
            } else if ('gisOrgIlPrefix' === params['functionName']) {
                return gisOrgIlPrefix(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName'], params['prefix']);
            } else if ('gisCoIlPrefix' === params['functionName']) {
                return gisCoIlPrefix(params['orgUrl'], params['lon'], params['lat'], params['zoom'], params['cityName'], params['prefix']);
            }
        }
        console.error("wme-gis-il: convertUrl() function name doesn't exist: " + params['functionName']);
        return params['orgUrl'];
    }

    function setTopCityIdUI(citeID) {
        console.info('wme-gis-il: setTopCityIdUI() City ID: ' + citeID);
        let cityName = W.model['cities'].objects[citeID].getName();
        let countryName = getCountryName();
        let label = cityName + ", " + countryName;
        console.info("wme-gis-il: setTopCityIdUI() setting UI to '" + label + "'");
        jQuery('.location-info > .full-address').html(label);
    }

    function getClosestCity(mapCenterPoint) {
        let allCities = W.model['cities'].objects;
        console.debug('wme-gis-il: getClosestCity() number of cities: ' + Object.keys(allCities).length);
        let minDistance = Infinity;
        let closetCityId;
        for (let cityID in allCities) {
            let aCity = allCities[cityID];
            let cityName = aCity.getName();
            if (aCity.getOLGeometry()) {
                let distanceToCity = mapCenterPoint.distanceTo(aCity.getOLGeometry(), {details: true});
                if (cityName) {
                    if (distanceToCity['distance'] < minDistance) {
                        minDistance = distanceToCity['distance'];
                        closetCityId = cityID;
                        console.info('wme-gis-il: getClosestCity() found better city: city ID: ' + cityID + " name: " + cityName);
                    }
                }
            } else {
                console.debug('wme-gis-il: getClosestCity() city with ID ' + cityID + " has no geometry. Skipping");
            }
        }
        if (closetCityId) {
            return {cityID:closetCityId, distance: minDistance};
        } else {
            return null;
        }
    }

    function getClosestSegment(mapCenterPoint, closestCity) {
        let allSegments = W.model.segments.objects;
        console.debug('wme-gis-il: getClosestSegment() number of segments: ' + Object.keys(allSegments).length);
        let minDistance = closestCity? closestCity['distance']:Infinity;
        let closetSegment;
        for (let segmentID in allSegments) {
            let aSegment = allSegments[segmentID];
            if (aSegment.getOLGeometry()) {
                let distanceToSegment = mapCenterPoint.distanceTo(aSegment.getOLGeometry(), {details: true});
                if (distanceToSegment['distance'] < minDistance) {
                    let primaryStreetID = aSegment.getPrimaryStreetID();
                    if (primaryStreetID) {
                        let cityID = getPrimaryStreetCityID(aSegment);
                        let cityName = getObjectName(W.model['cities'], cityID);
                        if (cityName) {
                            minDistance = distanceToSegment['distance'];
                            closetSegment = aSegment;
                            console.info('wme-gis-il: getClosestSegment() found better segment: segment ID: ' + segmentID + " with city name: " + cityName);
                        } else {
                            console.debug('wme-gis-il: getClosestSegment() found better segment: segment ID: ' + segmentID + " but has no city name. Skipping.");
                        }
                    } else {
                        console.debug('wme-gis-il: getClosestSegment() found better segment: segment ID: ' + segmentID + " but has no primary street ID. Skipping.");
                    }
                }
            } else {
                console.debug('wme-gis-il: getClosestSegment() segment with ID ' + segmentID + " has no geometry");
            }
        }
        if (closetSegment) {
            let cityID = getPrimaryStreetCityID(closetSegment);
            console.info('wme-gis-il: getClosestSegment() returning closet segment: ' + closetSegment.getID() + " of city ID: " + cityID);
            return cityID;
        } else if (closestCity) {
            console.info('wme-gis-il: getClosestSegment() no segment closer than city found. Returning closet city: ' + closestCity['cityID']);
            return closestCity['cityID'];
        } else {
            console.info('wme-gis-il: getClosestSegment() no segment nor city found. Returning null');
            return null;
        }
    }

    function getObjectName(objects, id) {
        let object = objects.getObjectById(id);
        return object.name || object.attributes.name;
    }

    function getCountryName() {
        let topCountry = W.model.getTopCountry();
        return topCountry.name || topCountry.attributes.name;
    }

    function getPrimaryStreetCityID(segment) {
        let primaryStreet = W.model.streets.getObjectById(segment.getPrimaryStreetID());
        return primaryStreet.cityID || primaryStreet.attributes.cityID;
    }

    function setByClosestObject() {
        console.debug('wme-gis-il: setByClosestObject()');
        let mapCenterPoint = new OpenLayers.Geometry.Point(W.map.getCenter().lon, W.map.getCenter().lat);
        console.debug('wme-gis-il: setByClosestObject() mapCenterPoint: ' + mapCenterPoint);
        let closestCity = getClosestCity(mapCenterPoint);
        let closestCityID = getClosestSegment(mapCenterPoint, closestCity);
        if (closestCityID) {
            setTopCityIdUI(closestCityID);
            return closestCityID;
        } else {
            return null;
        }
    }

    function init() {
        console.debug('wme-gis-il: init()');
        // Define EPSG:2039 as Israeli Transverse Mercator
        proj4.defs("EPSG:2039", "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-24.0024,-17.1032,-17.8444,-0.33077,-1.85269,1.66969,5.4248 +units=m +no_defs");
        let myDiv = document.createElement('div');
        myDiv.id = 'mydivid';
        myDiv.title = 'some title';

        let myP = document.createElement('p');
        myP.text = "bla bla";
        myP.appendChild(myDiv);
        jQuery( function() {
            jQuery( "#mydivid" ).dialog();
        } );

        let controlPermalink = jQuery('.WazeControlPermalink');
        let gisILLink = document.createElement('a');
        gisILLink.id = 'wme-gis-il-a';
        gisILLink.title = "\u0047\u0049\u0053 \u05e2\u05d9\u05e8\u05d5\u05e0\u05d9";
        gisILLink.style.display = "inline-block";
        gisILLink.style.marginRight = "2px";
        gisILLink.href = '';
        gisILLink.target = '_blank';
        let gisILDiv = document.createElement('div');
        gisILDiv.class = 'icon';
        gisILDiv.style.width = "20px";
        gisILDiv.style.height = "20px";
        gisILDiv.style.backgroundImage = 'url(' + imageUrl + ')';
        gisILDiv.style.backgroundSize = "20px 20px";
        gisILLink.appendChild(gisILDiv);
        controlPermalink.append(gisILLink);
        let theGisLink = jQuery('#wme-gis-il-a');
        theGisLink.mouseover(function () {
            console.info('wme-gis-il: mouseover()');
            setByClosestObject();
        });
        theGisLink.click(function (event) {
            event.preventDefault();
            console.info('wme-gis-il: click()');
            let cityId = setByClosestObject();
            console.info('wme-gis-il: click() cityId: ' + cityId);
            if (cityId && typeof cityId !== 'undefined') {
                getCities2GisJson(function (err, data) {
                    if (err) {
                        console.error('wme-gis-il: click() Error: ' + err);
                    } else {
                        let cityData = data['cities'][cityId];
                        if (cityData && typeof cityData !== 'undefined') {
                            console.info('wme-gis-il: click() map center EPSG:900913: ' + JSON.stringify(W.map.getCenter()));
                            let centerLonLat = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat);
                            centerLonLat.transform(new OpenLayers.Projection(W['Config'].map['projection']['local']), new OpenLayers.Projection(W['Config'].map['projection'].remote));
                            console.info('wme-gis-il: click() map center EPSG:4326: ' + centerLonLat);
                            let sourceCoords = [centerLonLat.lon, centerLonLat.lat];
                            let targetCoords = proj4("EPSG:4326", "EPSG:2039", sourceCoords);
                            let x = targetCoords[0].toFixed(2);
                            let y = targetCoords[1].toFixed(2);
                            console.info('wme-gis-il: click() transform to ITM (x,y): (' + x + ',' + y + ')');
                            let zoom = W.map.getZoom() - 12;
                            let lon = {"EPSG:900913":W.map.getCenter().lon,"EPSG:4326":centerLonLat.lon,"ITM":x};
                            let lat = {"EPSG:900913":W.map.getCenter().lat,"EPSG:4326":centerLonLat.lat,"ITM":y};
                            let gisData = data['gis'][cityData['gis']];
                            if (gisData && typeof gisData !== 'undefined') {
                                console.info('wme-gis-il: click() found gis data');
                                let params = {
                                    "orgUrl": gisData.url,
                                    "lon": lon,
                                    "lat": lat,
                                    "zoom": zoom,
                                    "functionName": gisData.functionName,
                                    "cityName": cityData.name,
                                    "prefix": cityData.prefix,
                                    "suffix": cityData.suffix,
                                    "noExtent": cityData.noExtent,
                                    "isEPSG": cityData.isEPSG,
                                    "queryParams": cityData.queryParams,
                                    "project": cityData.project
                                };
                                let hrefVal = convertUrl(params);
                                if (hrefVal.startsWith("chrome")) {
                                    console.info('wme-gis-il: click() hrefVal: ' + hrefVal + ' startsWith: chrome - nothing to do');
                                } else if (typeof hrefVal !== 'undefined') {
                                    console.info("wme-gis-il: click() openning a new tab with URL: " + hrefVal);
                                    window.open(hrefVal);
                                }
                            } else {
                                console.info("wme-gis-il: click() No GIS data found for key '" + cityData['gis'] + "' using key as URL");
                                window.open(cityData['gis']);
                            }
                        } else {
                            WazeWrap.Alerts.info(null, "<div dir='rtl'>\u05d4\u05e2\u05d9\u05e8 \u0027" + W.model['cities'].objects[cityId].getName() + "\u0027 \u05dc\u05d0 \u05e0\u05ea\u05de\u05db\u05ea \u05e2\u0022\u05d9 \u05d4\u05ea\u05d5\u05e1\u05e3\u002e<br/>\u05e4\u05e0\u05d4 \u05dc\u05de\u05e4\u05ea\u05d7 \u0067\u0061\u0064\u005f\u006d</div>", false, false);
                            console.info("wme-gis-il: click() No GIS defined for city '" + W.model['cities'].objects[cityId].getName() + "'");
                        }
                    }

                });
            } else {
                WazeWrap.Alerts.info(null, '\u05d1\u05db\u05d3\u05d9 \u05e9\u05d4\u05ea\u05d5\u05e1\u05e3 \u05d9\u05e4\u05e2\u05dc\u002c \u05d9\u05e9 \u05dc\u05de\u05e7\u05d3 \u05d0\u05ea \u05d4\u05e2\u05d5\u05e8\u05da \u05dc\u05e2\u05d9\u05e8', false, false);
                console.info('wme-gis-il: click() city id not found');
            }
        });
        console.info('wme-gis-il: init() done!');
    } // end init()
}.call(this));
