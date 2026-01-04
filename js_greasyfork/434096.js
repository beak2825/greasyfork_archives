// ==UserScript==
// @name        SlitherBOT
// @include     http://slither.io/
// @author      Hacker
// @description Bot for Slither.io
// @grant       none
// @version     1.4
// @namespace   http://slither.io/
// @downloadURL https://update.greasyfork.org/scripts/434096/SlitherBOT.user.js
// @updateURL https://update.greasyfork.org/scripts/434096/SlitherBOT.meta.js
// ==/UserScript==
 
//Bot features that we define
var botFeatures = {
    startingSize: 1000, // the size your snake starts at
    foodSmallSize: 3, // food clusters at or below this size won't be considered
    foodAccelSize: 60, // food cluster size to trigger acceleration
    radiusMultiplier: 5, // radius multiple for circle intersects
    arcSize: 3*Math.PI, // size of arc for collisionAngles
    radiusApproachSize: 26, // quick radius toggle size in approach mode
    radiusAvoidSize: 4, // quick radius toggle size in avoid mode
};

//Window in Sither.io where we make the bot
var bot = window.bot = (function() {
    return {
        isBotRunning: false, // is the bot active
        isBotEnabled: true, // is the bot turned on
        lookForFood: true, // is the bot searching for food
        collisionPoints: [], // it's the vector of coordinate points for colliding with another snake
        collisionAngles: [], // it's the vector of angles for colliding with another snake
        scores: [], // it's the vector of your scores
        foodTimeout: undefined, // it pauses going after food
        sectorBoxSide: 0, // the dimensions of the window shown within Slither.io's world
        defaultAccel: 40, // the default accelleration of the snake
        sectorBox: {}, // an object that contains all the windows within Slither.io's world
        currentFood: {}, // currentFood is the object that contains all food objects
    };
})();

var userInterface = window.userInterface = (function() {}
);

//Main function that we make
(function(){});