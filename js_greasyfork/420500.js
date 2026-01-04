// ==UserScript==
// @name         WME hazav (IL)
// @description  Shows a hazav icon in WME bottom right corner. When clicked, opens hazav on the same WME location and zoom.
// @namespace    https://greasyfork.org/users/gad_m/wme_govmap
// @version      1.0.8
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.2/proj4.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAaCAYAAAC3g3x9AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAB3RJTUUH4wceCTMGTDvEugAABCJJREFUSMeFlUtsFWUYhp/3n+klp0C5qRCtQiuCghckwELjwkAkBko0InGHLExcuCAugIYEQwjFKOIl0Z0LXWqUS6XGaBAkMUEiQSguoIebXCxSCm092DPzvy7OAcFK/ZYz8z3zv/O93ztihNrZ3AYYoZeBC8adAAlBiIZMcaD1ePstPYGRKzFMNj6JuGS4S6gAzMbcg4c3pP9F2T51NZIIUmM064P4yTBKaGWQPrc5jziG/ge4bepqEgWiYwCNzh0nCvbbdLuipj+aAwH1AfxbLoC2N68hIDAkIZA53g2eJVQG7jMsCGgvkET8RJDWxhhPV7qrFIMkIJACCTCh0Dyhp3Sid0pAMyPsV9BFRz9VvX/B+BpQE+0mIK+CjG7MoYToTauDWVI60VsW/A7aC+4PDuTkM4F5xkeBIaDyAlEH1As9bXwEcQ7cI7icCsqGL8CrQBeD6K8LECMpcA3oSBRqgSuZ4yBwJRDOAnOBvca7hLLr0kNrcTPAZcMHwGNA4zPH2hGqAz0rWBzxHON5QKvgBUmzgEM57gCymvQ3rBLPFVdU9LcW2ykktReByzYTAcrOEuNvDe/aPhLtH4Gthh1ZzLYDhwPE1uJmylkTcoEy0/6xTe/QIIWkNgcnO5vXIvSQ8QZgu6QU6LPdAp4RFPYtLm46dZNbCtXh9d/YlBdPvQ1w1TDVlc/RLdgg0S50KBD2AW+Athj+uMV78Gh1YLcaO+I9wArwZOPHDYtk6nPiI4Im4znAcqEeYNtNrbVA/TCg4ELEHwqmAWMFJ4DTggcNJcEZKtcubZu6prLsElR8HQHS64kSFSnnkASujlLh50GXHjDsBr4TmitxLppdQBMwWmiUIQINwGyhPQCpIAHVJk5KDjlLi2+ys7ltoqENfH8gNBrPlTVF8HDErwodSqRPgPHAWOAr278ApEFqiPgV250JoWtH8xpqlVwacvYeaLzhY8NmcDfwaUCXgIOIrxPCAkNLdOy8kTaGfsP3wErDQeDwNZfHCBYDx8HjhMYYj3flNE1AE/YPqZJB43yIMs8X36oAo23wAaGzwJPAwqq0pUBPQhiKeLrQBKE0EpcDGfC+sY19HQaQLiluoqOlDcx58Gd/OaNeNXcIuoGuVEnHkLMZQseCwnrbvwIFQVfu+BLQNyxgF3dvAmDHlFXUhXpFvMR4oWAgcz4JaIx4gp1PArcY5oPqwE3AltsmduvJrXQ0t9WYuKwqf4rxdCq+vBNYZ1gGjDHOQa+lIZy4LbCamWXQR8IDoC+FvjGeGaRuzOuCLmA+8A5wNMsjIwIBW+wI1q7czhANQGo7ubcw7krxz56tCTUJOPf5lKWljbc0D/uNLim2Q4xEYiZBjZJEIEN6ptSXBFIizjMzDFZd35Grs2VdbU5cBAykCrsXHd/okZ7/G6BZ6znLHxdFAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA3LTMwVDA5OjUxOjA2LTA0OjAw7l1BJAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNy0zMFQwOTo1MTowNi0wNDowMJ8A+ZgAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/420500/WME%20hazav%20%28IL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420500/WME%20hazav%20%28IL%29.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global OpenLayers */
/* global proj4 */
/* global I18n */

(function() {

    let imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAaCAYAAAC3g3x9AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAB3RJTUUH4wceCTMGTDvEugAABCJJREFUSMeFlUtsFWUYhp/3n+klp0C5qRCtQiuCghckwELjwkAkBko0InGHLExcuCAugIYEQwjFKOIl0Z0LXWqUS6XGaBAkMUEiQSguoIebXCxSCm092DPzvy7OAcFK/ZYz8z3zv/O93ztihNrZ3AYYoZeBC8adAAlBiIZMcaD1ePstPYGRKzFMNj6JuGS4S6gAzMbcg4c3pP9F2T51NZIIUmM064P4yTBKaGWQPrc5jziG/ge4bepqEgWiYwCNzh0nCvbbdLuipj+aAwH1AfxbLoC2N68hIDAkIZA53g2eJVQG7jMsCGgvkET8RJDWxhhPV7qrFIMkIJACCTCh0Dyhp3Sid0pAMyPsV9BFRz9VvX/B+BpQE+0mIK+CjG7MoYToTauDWVI60VsW/A7aC+4PDuTkM4F5xkeBIaDyAlEH1As9bXwEcQ7cI7icCsqGL8CrQBeD6K8LECMpcA3oSBRqgSuZ4yBwJRDOAnOBvca7hLLr0kNrcTPAZcMHwGNA4zPH2hGqAz0rWBzxHON5QKvgBUmzgEM57gCymvQ3rBLPFVdU9LcW2ykktReByzYTAcrOEuNvDe/aPhLtH4Gthh1ZzLYDhwPE1uJmylkTcoEy0/6xTe/QIIWkNgcnO5vXIvSQ8QZgu6QU6LPdAp4RFPYtLm46dZNbCtXh9d/YlBdPvQ1w1TDVlc/RLdgg0S50KBD2AW+Athj+uMV78Gh1YLcaO+I9wArwZOPHDYtk6nPiI4Im4znAcqEeYNtNrbVA/TCg4ELEHwqmAWMFJ4DTggcNJcEZKtcubZu6prLsElR8HQHS64kSFSnnkASujlLh50GXHjDsBr4TmitxLppdQBMwWmiUIQINwGyhPQCpIAHVJk5KDjlLi2+ys7ltoqENfH8gNBrPlTVF8HDErwodSqRPgPHAWOAr278ApEFqiPgV250JoWtH8xpqlVwacvYeaLzhY8NmcDfwaUCXgIOIrxPCAkNLdOy8kTaGfsP3wErDQeDwNZfHCBYDx8HjhMYYj3flNE1AE/YPqZJB43yIMs8X36oAo23wAaGzwJPAwqq0pUBPQhiKeLrQBKE0EpcDGfC+sY19HQaQLiluoqOlDcx58Gd/OaNeNXcIuoGuVEnHkLMZQseCwnrbvwIFQVfu+BLQNyxgF3dvAmDHlFXUhXpFvMR4oWAgcz4JaIx4gp1PArcY5oPqwE3AltsmduvJrXQ0t9WYuKwqf4rxdCq+vBNYZ1gGjDHOQa+lIZy4LbCamWXQR8IDoC+FvjGeGaRuzOuCLmA+8A5wNMsjIwIBW+wI1q7czhANQGo7ubcw7krxz56tCTUJOPf5lKWljbc0D/uNLim2Q4xEYiZBjZJEIEN6ptSXBFIizjMzDFZd35Grs2VdbU5cBAykCrsXHd/okZ7/G6BZ6znLHxdFAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA3LTMwVDA5OjUxOjA2LTA0OjAw7l1BJAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNy0zMFQwOTo1MTowNi0wNDowMJ8A+ZgAAAAASUVORK5CYII=';

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-hazav: WME is ready.');
        init();
    } else {
        console.debug('wme-hazav: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", init, {
            once: true,
        });
    }

    function convertZoom(editorZoom) {
        let result = 10;
        switch (editorZoom) {
            case 0:
                result = 4;
                break;
            case 1:
                result = 5;
                break;
            case 2:
                result = 6;
                break;
            case 3:
            case 4:
                result = 7
                break;
            case 5:
                result = 8;
                break;
            case 6:
                result = 9;
                break;
        }
        console.log('wme-hazav: convertZoom() converting: ' + editorZoom + ' returning: ' + result);
        return result;
    }

    /*function convertLocale(editorLocale) {
        // does nothing (for now).
        let result = editorLocale;
        console.log('wme-hazav: convertLocale() converting: ' + editorLocale + ' returning: ' + result);
        return result;
    }*/

    function init() {
        console.log('wme-hazav: init()');
        // Define EPSG:2039 as Israeli Transverse Mercator
        proj4.defs("EPSG:2039", "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-24.0024,-17.1032,-17.8444,-0.33077,-1.85269,1.66969,5.4248 +units=m +no_defs");
        let controlPermalink = jQuery('.WazeControlPermalink');
        let hazavLink = document.createElement('a');
        hazavLink.id = 'wme-hazav-a';
        hazavLink.title = "\u05d7\u05e6\u05d1";
        hazavLink.style.display = "inline-block";
        hazavLink.style.marginRight = "2px";
        hazavLink.href = 'https://geo.mot.gov.il/';
        hazavLink.target = '_blank';
        let hazavDiv = document.createElement('div');
        hazavDiv.class = 'icon';
        hazavDiv.style.width = "20px";
        hazavDiv.style.height = "20px";
        hazavDiv.style.backgroundImage = 'url(' + imageUrl + ')';
        hazavDiv.style.backgroundSize = "20px 20px";
        hazavLink.appendChild(hazavDiv);
        controlPermalink.append(hazavLink);
        jQuery('#wme-hazav-a').click(function () {
            console.log('wme-hazav: click() map center: ' + JSON.stringify(W.map.getCenter()));
            let centerLonLat = new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
            centerLonLat.transform(new OpenLayers.Projection(W['Config'].map['projection']['local']), new OpenLayers.Projection(W['Config'].map['projection'].remote));
            console.log('wme-hazav: click() centerLonLat: ' + centerLonLat);
            let sourceCoords = [centerLonLat.lon, centerLonLat.lat];
            let targetCoords = proj4("EPSG:4326", "EPSG:2039", sourceCoords);
            let x = targetCoords[0].toFixed(2);
            let y = targetCoords[1].toFixed(2);
            console.log('wme-hazav: click() transform to ITM (x,y): (' + x + ',' + y + ')');
            let zoom = convertZoom(parseInt(W.map.getZoom()) - 12);
            //let locale = convertLocale(I18n.locale);
            let href = 'https://geo.mot.gov.il/?x=' + x + '&y=' + y + '&layers=&z=' + zoom;
            console.log('wme-hazav: click() returning: ' + href);
            this.href = href;
        });
        console.log('wme-hazav: init() done!');
    } // end init()
}.call(this));