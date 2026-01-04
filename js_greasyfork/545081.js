// ==UserScript==
// @name        My Kittens Game tweaks
// @namespace   https://gist.github.com/WillMoggridge/133c22444caaa4cc3f2a5536e9621a37
// @description Kittens!
// @include     *https://kittensgame.com/web/#*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/545081/My%20Kittens%20Game%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/545081/My%20Kittens%20Game%20tweaks.meta.js
// ==/UserScript==


var autoObserve = function(game) {
  var observe = setInterval(function() {
    document.getElementById("observeBtn").dispatchEvent(new MouseEvent('click'));
  }, 1000); // 1 second
};


var autoPraiseFaith = function(game) {
  console.log("Autopraising faith");
  praiseFaith = setInterval(function() {
      var faith = game.resPool.get('faith');
      if (faith.value > faith.maxValue * 0.95) {
          game.religion.praise();
      }
  }, 10000); // 10 seconds
};

var speedUpGame = function(game) {
  // Speed game up. Lower is faster.
  // 200 = double. 30 ~ 8x
  var newSpeed = 200;

  console.log("Speeding game up...");
  autoTick = setInterval(function(){
      game.tick();
  }, newSpeed);
  game.rate = 5+(1000/newSpeed);
};

var loadScript = function() {
  var game = window.gamePage;
  if (typeof gamePage === 'undefined') {
    setTimeout(function(){
      loadScript();
    }, 2000);
  } else {
    //autoObserve(game);
    //autoPraiseFaith(game);
    speedUpGame(game);
  }
};


loadScript();
