// ==UserScript==
// @name       TagPro Smooth Zooms
// @namespace  http://reddit.com/user/Splanky222
// @version    1.0
// @description  Allows for smooth camera-like zooms for TagPro spectators
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com*
// @include       http://tagproandluckyspammersucksandunfortunatesniperisawesome.com*
// @copyright  2014, Jon Cohen (BBQchicken)
// @downloadURL https://update.greasyfork.org/scripts/4367/TagPro%20Smooth%20Zooms.user.js
// @updateURL https://update.greasyfork.org/scripts/4367/TagPro%20Smooth%20Zooms.meta.js
// ==/UserScript==

function tagproZoom() {
    //******* USER OPTIONS HERE ************//
    var speed = 1.3;                        //
    var instantZoomOnCenter = false;        //
    var centerZoomTime = .5;                //
    //**************************************//

    var zoomOut = 49, zoomIn = 50, center = 67; // 1, 2, and c
    var exp = Math.pow(2, speed / 60);

    var size = Math.max(tagpro.map.length * 40 / window.innerWidth, tagpro.map[0].length * 40 / window.innerHeight);
    var mapCenter = {x: tagpro.map.length * 20, y: tagpro.map[0].length * 20};
    var loop;

    function centerInView() {
        var player = tagpro.players[tagpro.playerId]; //the current player being followed OR the one it cuts to
        var location = {x: player.x, y: player.y};
        var xRange = 14.5 * 40 * tagpro.zoom, yRange = 9 * 40 * tagpro.zoom; //the number of game pixels visible in either direction
        return  ((location.x - xRange) < mapCenter.x) &&
                ((location.x + xRange) > mapCenter.x) &&
                ((location.y - yRange) < mapCenter.y) &&
                ((location.y + yRange) > mapCenter.y);
    }

    function startZoom(direction, alpha) {
        if (direction === zoomOut) {
            return setInterval(function() { tagpro.zoom *= alpha; }, 1000/60);
        } else if (direction === zoomIn) {
            return setInterval(function() { tagpro.zoom /= alpha; }, 1000/60);
        }
    }

    $(document).keydown(function(e) {
        if (tagpro.spectator !== "watching") {
            return "Cheater!!!";
        }
        if ((e.keyCode === zoomIn) || (e.keyCode === zoomOut)) {
            e.preventDefault();
            //If loop is already defined, don't start another zoom.  
            //This is needed to copmensate for the auto-repeat keyDown event sent by most keyboards
            loop = loop || startZoom(e.keyCode, exp); 
        } else if (e.keyCode === center) {//c
            if (instantZoomOnCenter || !centerInView()) { //avoid jump cuts + zooms together, they're jarring
                tagpro.zoom = size;
            } else {
                var numFrames = Math.round(centerZoomTime * 60);
                var alpha = Math.pow(size / tagpro.zoom, 1 / numFrames);

                (function centerLoop(n) {
                    tagpro.zoom *= alpha;
                    setTimeout(function() {
                        if (--n) {
                            centerLoop(n);
                        }
                    }, 1000/60);
                })(numFrames);  

            }
        } 
    });

    $(document).keyup(function(e) {
        if (tagpro.spectator !== "watching") {
            return "No cheating!!!";
        } else if ((e.keyCode === zoomIn) || (e.keyCode === zoomOut)) {
            loop = clearInterval(loop); //makes loop undefined so the next keydown will start a new zoom.
        }
    });
}

(function waitForMapLoad() {
    setTimeout(function() {
        if (typeof tagpro.map === "undefined") { //even using tagpro.ready gives me an error that map is
            waitForMapLoad();
        } else {
            tagproZoom();
        }
    }, 100);
})();