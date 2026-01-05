// ==UserScript==
// @name          showMinerals
// @description   shows minerals at planets and ships in several formats.
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// @namespace https://greasyfork.org/users/32642
// @downloadURL https://update.greasyfork.org/scripts/17955/showMinerals.user.js
// @updateURL https://update.greasyfork.org/scripts/17955/showMinerals.meta.js
// ==/UserScript==

function wrapper() {
  var res = {
    neu : {
      name : "Neutronium",
      color : "red",
      line : 0,
      show : false
    },
    dur : {
      name : "Duranium",
      line : 1,
      color : "cyan",
      show : false
    },
    tri : {
      name : "Tritanium",
      line : 2,
      color : "orange",
      show : false
    },
    mol : {
      name : "Molybdenum",
      line : 3,
      color : "violet",
      show : false
    },
    mc : {
      name : "Megacredits",
      line : 4,
      color : "lightgreen",
      show : false
    },
    sup : {
      name : "Supplies",
      line : 5,
      color : "yellow",
      show : false
    }
  };

  var showText = false;
  var checkStarbase = false;
  var checkFighters = false;
  var checkShip = false;
  var selectedBuild = null;

  function showMinerals() {
  }
  showMinerals.prototype = {
    loadControls : function() {
      // debugger;

      this.clearData();

      //      if (vgapMap.prototype.spMenuItem != undefined) {
      // weird declaration fits the color into the existing class
      vgaPlanets.prototype.spMenuItem(res.neu.name, "showMinerals\' style=\'color:" + res.neu.color, function() {
        showMinerals.prototype.toggleRes(res.neu);
      });

      vgaPlanets.prototype.spMenuItem(res.dur.name, "showMinerals\' style=\'color:" + res.dur.color, function() {
        showMinerals.prototype.toggleRes(res.dur);
      });

      vgaPlanets.prototype.spMenuItem(res.tri.name, "showMinerals\' style=\'color:" + res.tri.color, function() {
        showMinerals.prototype.toggleRes(res.tri);
      });

      vgaPlanets.prototype.spMenuItem(res.mol.name, "showMinerals\' style=\'color:" + res.mol.color, function() {
        showMinerals.prototype.toggleRes(res.mol);
      });

      vgaPlanets.prototype.spMenuItem(res.mc.name, "showMinerals\' style=\'color:" + res.mc.color, function() {
        showMinerals.prototype.toggleRes(res.mc);
      });

      vgaPlanets.prototype.spMenuItem(res.sup.name, "showMinerals\' style=\'color:" + res.sup.color, function() {
        showMinerals.prototype.toggleRes(res.sup);
      });


      vgaPlanets.prototype.spMenuItem("Circles", "showMinerals", function() {
        vgap.map.showresources = true;
        showText = !showText;
        checkStarbase = false;
        checkFighters = false;
        checkShip = false;

        vgap.map.draw();
      });

      vgaPlanets.prototype.spMenuItem("Starbase Build", "showMinerals", function() {
        vgap.map.showresources = true;
        state = !checkStarbase;
        showMinerals.prototype.clearShow();
        checkStarbase = state;
        vgap.map.draw();
      });

      vgaPlanets.prototype.spMenuItem("Ship Build", "showMinerals", function() {
        if (vgap.shipScreen.ship != undefined) {
          vgap.map.showresources = true;
          selectedBuild = vgap.shipScreen.ship;
          state = !checkShip;
          showMinerals.prototype.clearShow();
          checkShip = state;
          vgap.map.draw();
        }
      });

      vgaPlanets.prototype.spMenuItem("Fighter Build", "showMinerals", function() {
        vgap.map.showresources = true;
        state = !checkFighters;
        showMinerals.prototype.clearShow();
        checkFighters = state;
        vgap.map.draw();
      });

      vgaPlanets.prototype.spMenuItem("Clear", "_massClear", function() {
        showMinerals.prototype.clearData();
      });
    //      }
    },

    // display minerals
    toggleRes : function(r) {
      //      debugger;
      vgap.map.showresources = true;
      r.show = !r.show;

      line = -1;
      if (res.neu.show)
        res.neu.line = line++;
      if (res.dur.show)
        res.dur.line = line++;
      if (res.tri.show)
        res.tri.line = line++;
      if (res.mol.show)
        res.mol.line = line++;
      if (res.mc.show)
        res.mc.line = line++;
      if (res.sup.show)
        res.sup.line = line++;

      checkStarbase = false;
      checkFighters = false;
      checkShip = false;

      vgap.map.draw();
    },

    clearData : function() {
      vgap.map.showresources = false;
      showText = true;
      selectedBuild = null;
      //      debugger;
      this.clearAllRes();
      this.clearShow();
    },

    clearAllRes : function() {
      this.clearRes(res.neu);
      this.clearRes(res.dur);
      this.clearRes(res.tri);
      this.clearRes(res.mol);
      this.clearRes(res.mc);
      this.clearRes(res.sup);
    },

    clearShow : function() {
      //      res.neu.show = false;
      //      res.dur.show = false;
      //      res.tri.show = false;
      //      res.mol.show = false;
      //      res.mc.show  = false;
      //      res.sup.show = false;
      checkStarbase = false;
      checkFighters = false;
      checkShip = false;
    },

    clearRes : function(r) {
      r.surface = 0;
      r.supplies = 0;
      r.ground = 0;
      r.target = 0;
      r.mined = 0;
    },

    showResources : function(r, p, ctx) {
      //     debugger;
      if (r.show == true) {
        var color = r.color;
        if (showText) {
          x2 = vgap.map.screenX(p.x + 7.5 * 1.5);
          y2 = vgap.map.screenY(p.y - r.line * 6 * 1.5);

          f = "";
          if (r.surface > 0)
            f = r.surface + " ";
          if (r.ground > 0)
            f += "+ " + (r.mined + r.target);
          if (f != "") {
            ctx.fillStyle = color;
            ctx.fillText(f, x2, y2);
          }
        }
        else {
          var x1 = vgap.map.screenX(p.x);
          var y1 = vgap.map.screenY(p.y);
          if (r.ground > 0) {
            radius = Math.sqrt(r.ground) * vgap.map.zoom;
            vgap.map.drawCircle(ctx, x1, y1, radius, color, 1);
          }
          if (r.surface > 0) {
            radius = Math.sqrt(r.surface) * vgap.map.zoom;
            vgap.map.drawCircle(ctx, x1, y1, radius, color, 2);
          }
        }
      }
    },

    getSurfaceMin : function(r, p, surface, ground, density) {
      r.surface = surface;
      r.ground = ground;
      r.mined = this.miningRate(p, ground, density);
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

    miningRate : function(p, ground, density) {
      m = vgap.miningRate(p, density);
      m = m > ground ? ground : Math.round(m);

      return m;
    },

    nativetaxsupport : function(c) {
      ns = c.clans;
      ns *= c.race == 1 ? 2 : 1; // feds == 1
      ns *= c.nativetype == 6 ? 2 : 1; // insect == 6
      return ns;
    },

    nativeSupportedTax : function(c) {
      nt = this.nativeTaxAmount(c, c.nativetaxrate);
      ns = this.nativetaxsupport(c);
      cs = ns - nt;
      nt = Math.min(nt, ns);
      return nt;
    },

    nativeSupplies : function(c) {
      sp = c.factories;
      if (c.nativetype == 2) { // bovinoid
        spn = Math.floor(c.nativeclans / 100);
        sps = c.clans - spn;
        sp += sps > 0 ? spn : c.clans;
      }
      return sp;
    }
  };

  var oldRenderResource = vgapMap.prototype.renderResource;
  vgapMap.prototype.renderResource = function(ctx) {
    // replace completely
    // oldRenderResource.apply(this, arguments);

    sh = {};

    for (var d = 0; d < vgap.planets.length; d++) {
      var planet = vgap.planets[d];

      showMinerals.prototype.clearAllRes();

      showMinerals.prototype.getSurfaceMin(res.neu, planet, planet.neutronium, planet.groundneutronium, planet.densityneutronium);
      showMinerals.prototype.getSurfaceMin(res.dur, planet, planet.duranium, planet.groundduranium, planet.densityduranium);
      showMinerals.prototype.getSurfaceMin(res.tri, planet, planet.tritanium, planet.groundtritanium, planet.densitytritanium);
      showMinerals.prototype.getSurfaceMin(res.mol, planet, planet.molybdenum, planet.groundmolybdenum, planet.densitymolybdenum);
      res.mc.surface = planet.megacredits;
      res.mc.mined = showMinerals.prototype.nativeSupportedTax(planet);
      res.sup.surface = planet.supplies;
      res.sup.mined = showMinerals.prototype.nativeSupplies(planet);

      for (var k = 0; k < vgap.myships.length; ++k) {
        var ship = vgap.myships[k];
        var t = Math.dist(ship.targetx, ship.targety, planet.x, planet.y) <= 3;
        if (!t)
          continue;

        p = ship.x == planet.x && ship.y == planet.y;
        hull = vgap.getHull(ship.hullid).id;
// getNextLoc
        sh.neu = ship.neutronium;
        sh.dur = ship.duranium;
        sh.tri = ship.tritanium;
        sh.mol = ship.molybdenum;
        sh.mc = ship.megacredits;
        sh.sup = ship.supplies;

        // 104 neutronic refinery - supplies + minerals to fuel 1+1:1
        // 105 merlin - supplies to minerals 3:1
        // 97 aries - minerals to fuel 1:1
        // lfm - 2 mol, 3 tri, 5 sup	
        if (hull == 105) {
          min = Math.floor(sh.sup / 3);

          switch (ship.friendlycode) {
          case 'nal':
            break;
          case 'alm':
            sh.mol += min;
            sh.sup = 0;
            break;
          case 'ald':
            sh.dur += min;
            sh.sup = 0;
            break;
          case 'alt':
            sh.tri += min;
            sh.sup = 0;
            break;
          default:
            sh.sup = 0;
            min = Math.floor(min / 3);
            res.mol.target += min;
            res.dur.target += min;
            res.tri.target += min;
          }
        }
        if (hull == 104 && ship.friendlycode != 'nal') {
          min = Math.min(sh.sup, sh.mol + sh.dur + sh.tri);
          if (min > 0) {
            sh.sup = 0;
            sh.mol = 0;
            sh.dur = 0;
            sh.tri = 0;
            res.neu.target += min;
          }
        }

        //  	if (ship.friendlycode == 'lfm') {
        //  	  min = Math.floor(Math.min(cargo/10, mol.surface/2, tri/3, sup/5));
        //  	res.mol.surface -= min * 2;
        //  	}

        if (p) {
          res.neu.surface += sh.neu;
          res.dur.surface += sh.dur;
          res.tri.surface += sh.tri;
          res.mol.surface += sh.mol;
          res.mc.surface += sh.mc;
          res.sup.surface += sh.sup;
        }
        else {
          res.neu.target += sh.neu;
          res.dur.target += sh.dur;
          res.tri.target += sh.tri;
          res.mol.target += sh.mol;
          res.mc.target += sh.mc;
          res.sup.target += sh.sup;
        }
      }

      neu = res.neu.surface;
      dur = res.dur.surface;
      tri = res.tri.surface;
      mol = res.mol.surface;
      mc = res.mc.surface;
      sup = res.sup.surface;
      mcc = mc + sup;

      var x1 = this.screenX(planet.x);
      var y1 = this.screenY(planet.y);
      if (planet.ownerid == vgap.player.id && (checkStarbase || checkFighters || (checkShip && selectedBuild))) {
        neu2 = neu + res.neu.mined + res.neu.target;
        dur2 = dur + res.dur.mined + res.dur.target;
        tri2 = tri + res.tri.mined + res.tri.target;
        mol2 = mol + res.mol.mined + res.mol.target;
        mc2 = mc + res.mc.mined + res.mc.target;
        sup2 = sup + res.sup.mined + res.sup.target;
        mcc2 = mc2 + sup2;
        if (checkStarbase) {
          if (planet.buildingstarbase) {
            this.drawCircle(ctx, x1, y1, 12 * this.zoom, "blue", 3);

          }
          else if (!planet.isbase) {
            if (dur >= 120 && tri >= 302 && mol >= 430 && mcc >= 900) {
              this.drawCircle(ctx, x1, y1, 12 * this.zoom, "lightgreen", 3);
            }
            else if (dur2 >= 120 && tri2 >= 302 && mol2 >= 430 && mcc2 >= 900) {
              this.drawCircle(ctx, x1, y1, 12 * this.zoom, "yellow", 3);
            }
            else {
              td = dur2 - 120 < 0 ? dur2 - 120 : 0;
              tt = tri2 - 302 < 0 ? tri2 - 302 : 0;
              tm = mol2 - 430 < 0 ? mol2 - 430 : 0;
              if ((td + tt + tm) > -300) {
                x2 = this.screenX(planet.x + 12 * 1.5);

                ctx.fillStyle = res.dur.color;
                y2 = this.screenY(planet.y - (-2) * 6 * 1.5);
                ctx.fillText(dur2 - 120, x2, y2);

                ctx.fillStyle = res.tri.color;
                y2 = this.screenY(planet.y - (-1) * 6 * 1.5);
                ctx.fillText(tri2 - 302, x2, y2);

                ctx.fillStyle = res.mol.color;
                y2 = this.screenY(planet.y - 0 * 6 * 1.5);
                ctx.fillText(mol2 - 430, x2, y2);

                ctx.fillStyle = res.mc.color;
                y2 = this.screenY(planet.y - 1 * 6 * 1.5);
                ctx.fillText(mcc2 - 900, x2, y2);
              }

            }
          }

        }
        else if (checkFighters) {
          fighters = Math.floor(Math.min(sup / 5, tri / 3, mol / 2));
          if (fighters > 0) {
            ctx.fillStyle = "orange";
            x2 = this.screenX(planet.x + 7.5 * 1.5);
            y2 = this.screenY(planet.y + 0 * 1.5);
            ctx.fillText(fighters, x2, y2);
          }
        }
        else if (checkShip) {

          var sb = vgap.getStarbase(planet.id);
          if (sb != null) {

            x2 = this.screenX(planet.x + 12 * 1.5);

            var ship = selectedBuild;
            var hull = vgap.getHull(ship.hullid);

            var cmp = {
              dur : hull.duranium,
              tri : hull.tritanium,
              mol : hull.molybdenum,
              mc : hull.cost
            };

            b = vgap.engines[ship.engineid - 1];
            cmp.dur += b.duranium * hull.engines;
            cmp.tri += b.tritanium * hull.engines;
            cmp.mol += b.molybdenum * hull.engines;
            cmp.mc += b.cost * hull.engines;
            if (ship.beams > 0) {
              b = vgap.beams[ship.beamid - 1];
              cmp.dur += b.duranium * ship.beams;
              cmp.tri += b.tritanium * ship.beams;
              cmp.mol += b.molybdenum * ship.beams;
              cmp.mc += b.cost * ship.beams;
            }
            if (ship.torps > 0) {
              b = vgap.torpedos[ship.torpedoid - 1];
              cmp.dur += b.duranium * ship.torps;
              cmp.tri += b.tritanium * ship.torps;
              cmp.mol += b.molybdenum * ship.torps;
              cmp.mc += b.cost * ship.torps;
            }

            var checkdur = dur - cmp.dur;
            var checktri = tri - cmp.tri;
            var checkmol = mol - cmp.mol;
            var checkmc = mcc - cmp.mc;
            if (checkdur >= 0 && checktri >= 0 && checkmol >= 0 && checkmc >= 0 || sb.isbuilding) {
              if (sb.isbuilding)
                this.drawCircle(ctx, x1, y1, 12 * this.zoom, "blue", 2);
              else {
                var cmp = {
                  dur : cmp.dur * 2,
                  tri : cmp.tri * 2,
                  mol : cmp.mol * 2,
                  mc : cmp.mc * 2
                };
                this.drawCircle(ctx, x1, y1, 12 * this.zoom, "green", 2);
              }
            }
            else
              this.drawCircle(ctx, x1, y1, 12 * this.zoom, "orange", 2);

            checkdur = dur2 - cmp.dur;
            checktri = tri2 - cmp.tri;
            checkmol = mol2 - cmp.mol;
            checkmc = mcc2 - cmp.mc;
            if (checkdur >= 0 && checktri >= 0 && checkmol >= 0 && checkmc >= 0)
              this.drawCircle(ctx, x1, y1, 16 * this.zoom, "lightgreen", 2);
            else
              this.drawCircle(ctx, x1, y1, 16 * this.zoom, "orange", 2);

            ctx.fillStyle = res.dur.color;
            y2 = this.screenY(planet.y - (-2) * 6 * 1.5);
            ctx.fillText(checkdur, x2, y2);

            ctx.fillStyle = res.tri.color;
            y2 = this.screenY(planet.y - (-1) * 6 * 1.5);
            ctx.fillText(checktri, x2, y2);

            ctx.fillStyle = res.mol.color;
            y2 = this.screenY(planet.y - 0 * 6 * 1.5);
            ctx.fillText(checkmol, x2, y2);

            ctx.fillStyle = res.mc.color;
            y2 = this.screenY(planet.y - 1 * 6 * 1.5);
            ctx.fillText(checkmc, x2, y2);
          }
        }
      }
      else {
        showMinerals.prototype.showResources(res.neu, planet, ctx);
        showMinerals.prototype.showResources(res.dur, planet, ctx);
        showMinerals.prototype.showResources(res.tri, planet, ctx);
        showMinerals.prototype.showResources(res.mol, planet, ctx);
        showMinerals.prototype.showResources(res.mc, planet, ctx);
        showMinerals.prototype.showResources(res.sup, planet, ctx);
      }
    }
  };

  var oldLoadControls = vgapMap.prototype.loadControls;
  vgapMap.prototype.loadControls = function() {
    oldLoadControls.apply(this, arguments);

    showMinerals.prototype.loadControls();
  };
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);