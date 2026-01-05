// ==UserScript==
// @name          hypCircle
// @description   shows a modified hyperjump ring and warp 9 circles
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// @namespace https://greasyfork.org/en/users/32642-stephen-piper
// @downloadURL https://update.greasyfork.org/scripts/17958/hypCircle.user.js
// @updateURL https://update.greasyfork.org/scripts/17958/hypCircle.meta.js
// ==/UserScript==

function wrapper() {
  function hypTools() {
  }
  hypTools.prototype = {
    loadControls : function() {
      // debugger;
      this.putWarpCircles = false;
      this.warpcircles = [];
      this.putMultiTurnCircles = false;
      this.multiturncircles = [];
      this.addlinestart = false;
      this.addlineend = false;
      this.lines = [];
      this.lineStart = null;

      this.clearData();

      //      if (vgapMap.prototype.spMenuItem != undefined) {
      vgaPlanets.prototype.spMenuItem("Hyp Circle", "hypTools", function() {
        vgap.map.putHypCircle = true;
        $("body").css("cursor", "crosshair");
      });

      vgaPlanets.prototype.spMenuItem("Warp Circle", "hypTools", function() {
        hypTools.putWarpCircle = true;
        $("body").css("cursor", "crosshair");
      });

      vgaPlanets.prototype.spMenuItem("Warp Circle x 3", "hypTools", function() {
        hypTools.putMultiTurnCircle = true;
        $("body").css("cursor", "crosshair");
      });

      //	vgaPlanets.prototype.spMenuItem("Add Line", "addLine", function() {
      //	  if (hypTools.addlineend) {
      //	    hypTools.startlinept.pop();
      //	  }
      //	  hypTools.addlinestart = true;
      //	  hypTools.addlineend = false;
      //	});
      //
      //	vgaPlanets.prototype.spMenuItem("Delete Line", "deleteLine", function() {
      //	  hypTools.deleteline = true;
      //	   $("body").css("cursor", "crosshair");
      //	});

      vgaPlanets.prototype.spMenuItem("Clear", "_massClear", function() {
        hypTools.prototype.clearData();
      });
    //      }
    },

    clearData : function() {
      vgap.map.putHypCircle = false;
      vgap.map.hypcircles = new Array();
      hypTools.putWarpCircle = false;
      hypTools.warpcircles = [];
      hypTools.putMultiTurnCircles = false;
      hypTools.multiturncircles = [];
      hypTools.addlinestart = false;
      hypTools.addlineend = false;
      hypTools.lines = [];
      hypTools.lineStart = null;
    },

    addWarpCircle : function(a, b, c) {
      hypTools.warpcircles.push({
        x : a,
        y : b,
        w : c
      });
      $("body").css("cursor", "");
    },

    addMultiTurn : function(a, b, c) {
      hypTools.multiturncircles.push({
        x : a,
        y : b,
        w : c
      });
      $("body").css("cursor", "");
    },

    //    addLineStart : function(a, b) {
    //      hypTools.linestart = {
    //	x : a,
    //	y : b
    //      };
    //      
    //      $("body").css("cursor", "crosshair");
    //   },
    //
    //   addLineEnd : function(a, b) {
    //     hypTools.lines.push({
    //       sx : hypTools.linestart.x,
    //       sy : hypTools.linestart.y,
    //       ex : a,
    //       ey : b
    //     });
    //     hypTools.linestart = null;
    //
    //     hypTools.prototype.writeLines();
    //
    //     $("body").css("cursor", "");
    //   },
    //
    //    writeLines : function () {
    //      var p = vgap.myplanets[0];
    //      if (p.note == null)
    //	p.note = vgap.addNote(p, 1);
    //
    //      p.note.body = "{\"lines\" :" + JSON.stringify(hypTools.lines) + "}";
    ////console.log(p.note.body);
    //      
    //      $("body").css("cursor", "");
    //    },
    //    
    //    deleteLine : function(a, b) {
    //      d = 9999;
    //      
    //      for (i = 0; i<hypTools.lines.length; ++i){
    //	l = hypTools.lines[i];
    //	if (l != null) {
    //	  s = Math.min(Math.dist(l.sx, l.sy, a, b), Math.dist(l.ex, l.ey, a, b));
    //	  
    //	  if(d > s) {
    //	    d = s;
    //	    id = i;
    //	  }
    //	}
    //      }
    //	  
    //      if (id != undefined) {
    //	delete hypTools.lines[id];
    //	hypTools.prototype.writeLines();
    //      }
    //    },
    //      
    //    parsenotes : function() {
    //      for (var f = 0; f < vgap.myplanets.length; f++) {
    //	var l = vgap.myplanets[f];
    //	if (l.note != undefined && l.note.body != "") {
    //	  try {
    //	    var jn = JSON.parse(l.note.body
    //		// , function(h, k) {console.log(h+" "+k)}
    //	    );
    //	  } catch (e) {
    //	    console.log("parse error " + l.id + " " + l.note.body);
    //	    continue;
    //	  }
    //
    //	  if (jn.lines != undefined) {
    //	    l = jn.lines;
    //
    //	    for (f = 0; f < l.length; f++) {
    //	      p = l[f];
    //	      if (p != null) {
    //	
    //		console.log(p);
    //
    //		hypTools.lines.push({
    //		  sx : p.sx,
    //		  sy : p.sy,
    //		  ex : p.ex,
    //		  ey : p.ey
    //		});
    //	      }
    //	    }
    //	  }
    //	}
    //      }
    //    },

  };

  var oldRenderMapTools = vgapMap.prototype.renderMapTools;
  vgapMap.prototype.renderMapTools = function(ctx) {

    h = this.hypcircles;
    this.hypcircles = [];

    oldRenderMapTools.apply(this, arguments);

    this.hypcircles = h;

    for (var d = 0; d < this.hypcircles.length; d++) {
      var c = this.hypcircles[d];

      // planetary hypcircle
      for (var i = 0; i < vgap.planets.length; ++i) {
        var planet = vgap.planets[i];
        var dist = Math.dist(c.x, c.y, planet.x, planet.y);
        if (dist >= 340 && dist <= 360) {
          this.drawCircle(ctx, this.screenX(planet.x), this.screenY(planet.y), 12 * this.zoom, "cyan", 1);
        }
        else if (dist >= 338 && dist <= 362) {
          this.drawCircle(ctx, this.screenX(planet.x), this.screenY(planet.y), 12 * this.zoom, "orange", 1);
        }
      }

      // large hypcircle
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 340 * this.zoom, "cyan", 1);
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 360 * this.zoom, "cyan", 1);
    }

    for (var d = 0; d < hypTools.warpcircles.length; d++) {
      var c = hypTools.warpcircles[d];

      // planetary hypcircle
      for (var i = 0; i < vgap.planets.length; ++i) {
        var planet = vgap.planets[i];
        var dist = Math.dist(c.x, c.y, planet.x, planet.y);
        if (dist >= c.w && dist <= c.w + 3) {
          this.drawCircle(ctx, this.screenX(planet.x), this.screenY(planet.y), 12 * this.zoom, "blue", 1);
        }
      }

      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), c.w * this.zoom, "cyan", 1);
    }

    for (var d = 0; d < hypTools.multiturncircles.length; d++) {
      var c = hypTools.multiturncircles[d];
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 1 * c.w * this.zoom, "cyan", 1);
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 2 * c.w * this.zoom, "cyan", 1);
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 3 * c.w * this.zoom, "cyan", 1);
    }

  //    if (hypTools.linestart) {
  //      var l = hypTools.linestart;
  //      this.drawCircle(ctx, this.screenX(l.x), this.screenY(l.y), 1 * this.zoom, "orange", 2);
  //    }
  //
  //    for (var d = 0; d < hypTools.lines.length; ++d) {
  //      var l = hypTools.lines[d];
  //      if (l != null)
  //	this.drawLine(ctx, this.screenX(l.sx), this.screenY(l.sy), this.screenX(l.ex), this.screenY(l.ey), "orange", 1);
  //    }
  };

  var oldClick = vgapMap.prototype.click;
  vgapMap.prototype.click = function(event) {
    if (this.over) {
      a = this.over.x;
      b = this.over.y;
    }
    else {
      a = this.x;
      b = this.y;
    }
    if (vgap.shipScreen.ship != undefined) {
      s = vgap.shipScreen.ship;
      w = s.engineid * s.engineid + .4;
    }
    else {
      w = 81.4;
    }

    // snap hypcircle to closest ship or planet
    if (hypTools.putWarpCircle) {
      hypTools.prototype.addWarpCircle(a, b, w);

      hypTools.putWarpCircle = false;
      $("body").css("cursor", "");
    }

    //    if (hypTools.addlinestart) {
    //      hypTools.prototype.addLineStart(a, b);
    //
    //      hypTools.addlinestart = false;
    //      hypTools.addlineend = true;
    //      $("body").css("cursor", "crosshair");
    //      // return
    //    } else if (hypTools.addlineend) {
    //      hypTools.prototype.addLineEnd(a, b);
    //
    //      hypTools.addlinestart = false;
    //      hypTools.addlineend = false;
    //      $("body").css("cursor", "");
    //    }
    //
    //    if (hypTools.deleteline) {
    //      hypTools.prototype.deleteLine(a, b);
    //      
    //      $("body").css("cursor", "");
    //    }

    if (hypTools.putMultiTurnCircle) {
      hypTools.prototype.addMultiTurn(a, b, w);

      hypTools.putMultiTurnCircle = false;
      $("body").css("cursor", "");
    }
    if (this.putHypCircle) {
      this.hyperjump(a, b);

      this.putHypCircle = false;
      $("body").css("cursor", "");
    }

    oldClick.apply(this, arguments);

    this.draw();
  };

  //  var oldLoad = vgapMap.prototype.load;
  //  vgapMap.prototype.load = function() {
  //    oldLoad.apply(this, arguments);
  //    
  //    hypTools.prototype.parsenotes();
  //  };

  var oldLoadControls = vgapMap.prototype.loadControls;
  vgapMap.prototype.loadControls = function() {
    oldLoadControls.apply(this, arguments);

    hypTools.prototype.loadControls();
  };
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);