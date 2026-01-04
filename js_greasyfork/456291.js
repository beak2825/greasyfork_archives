// ==UserScript==
// @name        Fuller Snow
// @namespace   left paren
// @match       https://bonk.io/gameframe-release.html
// @run-at      document-start
// @grant       none
// @version     1.0
// @license     Unlicense
// @author      left paren
// @description Improves Bonk.io snow
// @downloadURL https://update.greasyfork.org/scripts/456291/Fuller%20Snow.user.js
// @updateURL https://update.greasyfork.org/scripts/456291/Fuller%20Snow.meta.js
// ==/UserScript==

const injectorName = `Fuller Snow`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function escReg(reg){
    return reg.replace(/([[\]$])/g, "\\$1");
}

function injector(src){
  let newSrc = src
  var timeyThing = /if\(([$a-zA-Z0-9_]{2,5}\[[0-9]+\])/.exec(/class .{2,5}\{(constructor\(.{1,1600})seededRand\(.{1,1600}render\(\) \{.{1,1600}\};/.exec(src)[1])[1]
  var snowManName = /([$a-zA-Z0-9_]{2,5}\[[0-9]+\])=class .{2,5}\{constructor\(.{1,1600}seededRand\(.{1,1600}render\(\) \{.{1,1600}\};/.exec(src)[1]
  newSrc = newSrc.replace(new RegExp("(new " + escReg(snowManName) + ".{1,1600})}render\\("), "$1;this.displayObject.addChild(this.snowManager.displayObject2);}render(")
  newSrc = newSrc.replace(/class .{2,5}\{constructor\(.{1,1600}seededRand\(.{1,1600}render\(\) \{.{1,1600}\};/, `class SnowMan {
        constructor(mapScale) {
          this.displayObject = new PIXI.Container();
          this.displayObject2 = new PIXI.Container();
          this.snows = [];
          this.lastRenderTime = Date.now();
          if (${timeyThing}.isItChristmas()) {
            var dayOfYear = ${timeyThing}.getDayOfYear();
            var rand0 = this.seededRand(dayOfYear);
            var rand50 = this.seededRand(dayOfYear + 50);
            var rand150 = this.seededRand(dayOfYear + 150);
            this.xLimit = 730 * mapScale;
            this.yLimit = 500 * mapScale;
            this.snowQuantity = Math.round(10 + rand0 * 110)*5;
            this.snowQuantity2 = Math.round(10 + rand0 * 110)*30;
            this.todaysBaseWindAmount = -0.6 + rand50 * 1.2;
            this.todaysBaseGravAmount = 0.5 + rand150 * 0.4;
            this.build();
          }
        }
        seededRand(G5V) {
          var C_5 = [arguments];
          C_5[0][0] *= 100000;
          C_5[8] = 7247;
          C_5[3] = 7823;
          J4z.Q2x(224 /* operation is {3} * {1} % ({0} * {2}) */);
          J4z.M7Z();
          C_5[0][0] = J4z.z7b(C_5[8], C_5[0][0], C_5[3], C_5[0][0]);
          J4z.B6c(173 /* operation is {0} / ({1} * {2}) */);
          return J4z.h8m(C_5[0][0], C_5[8], C_5[3]);
        }
        build() {
          var flake;
          for (var i = 0; i < this.snowQuantity; i++) {
            flake = new PIXI.Sprite(PIXI.Texture.WHITE);
            flake.width = 3;
            flake.height = 3;
            flake.x = Math.random() * this.xLimit;
            flake.y = Math.random() * this.yLimit;
            this.displayObject.addChild(flake);
            this.snows.push(flake);
          }
          for (var i = 0; i < this.snowQuantity2; i++) {
            flake = new PIXI.Sprite(PIXI.Texture.WHITE);
            flake.width = 3;
            flake.height = 3;
            flake.x = Math.random() * this.xLimit;
            flake.y = Math.random() * this.yLimit;
            flake.alpha = 0.5
            this.displayObject2.addChild(flake);
            this.snows.push(flake);
          }
          this.snows.sort(()=>Math.random()-0.5)
        }
        render() {
          var timeDiff = Date.now() - this.lastRenderTime;
          var movementAmount = timeDiff / (1000 / 120);
          this.snows.forEach((flake, index) => {
            var windMultiplier = -0.1 + (index / this.snowQuantity) * 0.2;
            flake.x += (this.todaysBaseWindAmount + windMultiplier) * movementAmount;
            flake.y += (this.todaysBaseGravAmount + Math.random() * 0.2) * movementAmount;
            flake.angle += 1 * movementAmount;
            if (flake.x > this.xLimit) {
              flake.x -= this.xLimit;
            }
            if (flake.x < 0) {
              flake.x += this.xLimit;
            }
            if (flake.y > this.yLimit) {
              flake.y -= this.yLimit;
            }
            if (flake.y < 0) {
              flake.y += this.yLimit;
            }
          });
          this.lastRenderTime = Date.now();
        }
        destroy() {
          this.snows.forEach((x) => x.destroy());
          this.snow = [];
        }
      };`)

  if(src === newSrc) throw "Injection failed!";
  console.log(injectorName+" injector run");
  return newSrc;
}

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(errorMsg);
		throw error;
	}
});

console.log(injectorName+" injector loaded");