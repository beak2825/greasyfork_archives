// ==UserScript==
// @name          checkReady
// @description   draw a ring around planets and ships that are not marked ready 
// 				  can't move ships marked ready
//
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// @namespace https://greasyfork.org/en/users/32642-stephen-piper
// @downloadURL https://update.greasyfork.org/scripts/17956/checkReady.user.js
// @updateURL https://update.greasyfork.org/scripts/17956/checkReady.meta.js
// ==/UserScript==

function wrapper() {
  var showReady = false;
  var showBldg = false;
  var showHull = false;
  var selectedShip = null;
  var showShips = false;
  var showNatives = false;
  var showProduction = false;
  var displayLine = 0;

  function checkReady() {
  }
  checkReady.prototype = {
    loadControls : function() {

      this.clearData();

      //      if (vgapMap.prototype.spMenuItem != undefined) {
      vgaPlanets.prototype.spMenuItem("Check Ready", "checkReady", function() {
        state = !showReady;
        checkReady.prototype.clearShow();
        showReady = state;
        vgap.map.draw();
      });

      vgaPlanets.prototype.spMenuItem("Show Buildings", "checkReady", function() {
        state = !showBldg;
        checkReady.prototype.clearShow();
        showBldg = state;
        vgap.map.draw();
      });

      vgaPlanets.prototype.spMenuItem("SB Production", "checkReady", function() {
        state = !showProduction;
        checkReady.prototype.clearShow();
        showProduction = state;
        vgap.map.draw();
      });

      vgaPlanets.prototype.spMenuItem("Show Natives", "checkReady", function() {
        state = !showNatives;
        checkReady.prototype.clearShow();
        showNatives = state;
        vgap.map.draw();
      });

      vgaPlanets.prototype.spMenuItem("All Ships", "checkReady", function() {
        state = !showShips;
        checkReady.prototype.clearShow();
        showShips = state;
        vgap.map.draw();
      });

      vgaPlanets.prototype.spMenuItem("Clear", "_massClear", function() {
        checkReady.prototype.clearData();
      });
    //      }
    },

    clearShow : function() {
      showReady = false;
      showBldg = false;
      showHull = false;
      showShips = false;
      showNatives = false;
      showProduction = false;
    },

    clearData : function() {
      this.clearShow();
      selectedShip = null;
      displayLine = 0;
    },

    nativeTaxAmount : function(c, ntr) {
      var nt = 0;
      if (c.nativeclans > 0) {
        if (c.race == 6 && ntr > 20) { // borg == 6
          ntr = 20;
        }

        var nt = (c.nativeclans / 100) * (ntr / 10) * (c.nativegovernment / 5);

        nt = c.nativetype == 5 ? 0 : nt; // amorphous == 5
        nt = c.nativetype == 6 ? 2 * nt : nt; // insect == 6
        nt = c.race == 1 ? 2 * nt : nt; // feds == 1

        nt = Math.round(nt);
      }
      return nt;
    },

    nativetaxsupport : function(c) {
      ns = c.clans;
      ns *= c.race == 1 ? 2 : 1; // feds == 1
      ns *= c.nativetype == 6 ? 2 : 1; // insect == 6
      return ns;
    },
  };


  var oldDraw = vgapMap.prototype.draw;
  vgapMap.prototype.draw = function(fast, ctx, skipUserContent, secondCanvas) {
    oldDraw.apply(this, arguments);
    if (!ctx)
      ctx = this.ctx;

    // have to redraw ships because normal draw
    // copies the planets over the ships
    // draw ships not ready
    displayLine = -1;

    for (var k = 0; k < vgap.ships.length; ++k) {
      var ship = vgap.ships[k];
      this.drawShip(ship, ctx)
    }

  };

  var oldDrawPlanet = vgapMap.prototype.drawPlanet;
  vgapMap.prototype.drawPlanet = function(planet, ctx, fullrender) {
    oldDrawPlanet.apply(this, arguments);

    var x = this.screenX(planet.x);
    var y = this.screenY(planet.y);
    x2 = this.screenX(planet.x + 7.5 * 1.5);
    y2 = this.screenY(planet.y - (-1) * 6 * 1.5);


    // draw planets not ready
    if (planet.infoturn > 0) {
      if (vgap.player.id == planet.ownerid) {
        if (showBldg) {
          ctx.fillStyle = "lightgreen";
          ctx.fillText("m:" + planet.mines + " f:" + planet.factories + " d:" + planet.defense, x2, y2);
        }
        if (showReady) {
          if (planet.readystatus == 0) {

            this.drawCircle(ctx, x, y, 13 * this.zoom, "orange", 2);
          }

          var n = vgap.getStarbase(planet.id);
          if (n != null && n.readystatus == 0) {

            this.drawCircle(ctx, x, y, 11 * this.zoom, "red", 2);
          }
        }
        if (showProduction) {
          if (planet.buildingstarbase) {
            ctx.fillStyle = "lightgreen";
            ctx.fillText("building starbase", x2, y2);
          }
          else if (planet.isbase) {
            var n = vgap.getStarbase(planet.id);
            if (n != null && n.isbuilding) {

              ctx.fillStyle = "lightgreen";
              ctx.fillText(vgap.getHull(n.buildhullid).name, x2, y2);
            }
          }
        }
        if (showNatives && planet.nativeclans > 0) {
          if (planet.nativehappypoints < 30)
            ctx.fillStyle = "red";
          else if (planet.nativehappypoints < 70)
            ctx.fillStyle = "orange";
          else
            ctx.fillStyle = "lightgreen";

          nt = checkReady.prototype.nativeTaxAmount(planet, planet.nativetaxrate);
          ns = checkReady.prototype.nativetaxsupport(planet);
          t = Math.min(nt, ns);

          ctx.fillText(planet.nativeracename + " $" + t, x2, y2);
        }
      }
      if (showNatives && planet.nativeclans > 0) {
        ctx.fillStyle = "orange";
        ctx.fillText(planet.nativeracename, x2, y2);
      }
    }
  };

  var oldDrawShip = vgapMap.prototype.drawShip;
  vgapMap.prototype.drawShip = function(ship, ctx) {
    oldDrawShip.apply(this, arguments);

    // draw ships not ready had to redraw in draw()
    // because drawplanet() wrote over them
    if (showReady && ship.readystatus == 0 && vgap.player.id == ship.ownerid) {
      this.drawCircle(ctx, this.screenX(ship.x), this.screenY(ship.y), 16 * this.zoom, "yellow", 2);
    }

    //    if(showSelected) {
    //      var use = vgap.shipScreen.ship;
    //      if (use.ownerid != vgap.player.id) {
    //      }

    if (showHull && selectedShip != null && selectedShip.hullid == ship.hullid)
      this.drawCircle(ctx, this.screenX(ship.x), this.screenY(ship.y), 13 * this.zoom, "lightgreen", 2);
 
    if (showShips) {
      if (vgap.player.id == ship.ownerid)
        ctx.fillStyle = "lightgreen";
      else
        ctx.fillStyle = "red";
      x2 = this.screenX(ship.x + 7.5 * 1.5);
      y2 = this.screenY(ship.y - displayLine++ * 6 * 1.5);
      ctx.fillText(ship.id + ":" + vgap.getHull(ship.hullid).name, x2, y2);
    }
  };

  var oldShipSelectorClick = vgapMap.prototype.shipSelectorClick;
  vgapMap.prototype.shipSelectorClick = function(event) {

    var e = this.activeShip;
    if (e.readystatus > 0) // can't move ships marked ready
      return;

    oldShipSelectorClick.apply(this, arguments);
  };

  var oldLoadControls = vgapMap.prototype.loadControls;
  vgapMap.prototype.loadControls = function() {
    oldLoadControls.apply(this, arguments);

    checkReady.prototype.loadControls();
  };
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);