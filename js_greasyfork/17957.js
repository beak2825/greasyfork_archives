// ==UserScript==
// @name          randomizeFCs
//
// @description   randomize names and FCs for planets.nu and replaces the builtin random generator
// 				  to eliminate command codes it only replaces FCs in the format 0a0.
// 				  ship names get changed only if they contain capital letters.
//
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// @namespace https://greasyfork.org/en/users/32642-stephen-piper
// @downloadURL https://update.greasyfork.org/scripts/17957/randomizeFCs.user.js
// @updateURL https://update.greasyfork.org/scripts/17957/randomizeFCs.meta.js
// ==/UserScript==

function wrapper() {
  var defaultplanet = new dataObject();
  var execplanets = [];
  var builtfact = [];
  var builtmine = [];
  var ready = [];
  var taxrate = [];

  function setRandom() {
  }
  setRandom.prototype = {

    loadControls : function() {
      // debugger;
      this.clearData();

      if (vgapMap.prototype.spMenuItem != undefined) {
	vgapMap.prototype.spMenuItem("Random FCs", "setRandom", function() {
	  setRandom.prototype.setRandomFC();
	});

	vgapMap.prototype.spMenuItem("Random Ship Names", "setRandom", function() {
	  setRandom.prototype.setRandomShipNames();
	});

	vgapMap.prototype.spMenuItem("Exec Notes", "setRandom", function() {
	  setRandom.prototype.parsenotes();
	});
	
	vgapMap.prototype.spMenuItem("Clear", "_massClear", function() {
	  setRandom.prototype.clearData();
	});
      }

    },

    clearData : function() {
      execplanets = [];
      builtfact = [];
      builtmine = [];
      builtdef = [];
      ready = [];
      taxrate = [];
      defaultplanet = new dataObject();
    },

    setRandomFC : function() {
      for (var i = 0; i < vgap.myplanets.length; ++i) {
	var planet = vgap.myplanets[i];
	if (vgap.player.id == planet.ownerid && planet.readystatus == 0) {
	  if (planet.friendlycode == /[0-9][a-zA-Z][0-9]/) {
	    planet.friendlycode = vgap.randomFC();
	    planet.changed = true;
	  }
	}
      }
      
      for (var i = 0; i < vgap.myships.length; ++i) {
	var ship = vgap.myships[i];
	if (vgap.player.id == ship.ownerid && ship.readystatus == 0) {
	  if (ship.friendlycode == /[0-9][a-zA-Z][0-9]/) {
	    ship.friendlycode = vgap.randomFC();
	    ship.changed = true;
	  }
	}
      }

      vgap.indicator.text("done");
      vgap.indicateOn();
    },

    setRandomShipNames : function() {
      var url = "http://api.wordnik.com:80/v4/words.json/randomWord";
      var data = {
	"hasDictionaryDef" : "true",
	"includePartOfSpeech" : "verb-intransitive",
	"minLength" : "5",
	"maxLength" : "16",
	"limit" : "1",
	"api_key" : "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
      };
      var pat = /.*?[A-Z]/;

      for (var i = 0; i < vgap.myships.length; ++i) {
	var ship = vgap.myships[i];
	if (vgap.player.id == ship.ownerid && pat.test(ship.name)) {
	  $.ajax({
	    async : false,
	    type : 'GET',
	    url : url,
	    data : data,
	    success : function(data) {
	      ship.name = data.word;
	      ship.changed = 1;
	    }
	  });
	}
      }

      vgap.indicator.text("done");
      vgap.indicateOn();
    },

    // **** commands are executed in the following order ****
    // { ["defaultplanet":{] // used for all planets that don't have notes
    // "checkready":"", // don't execute if planet.readystatus > 0
    // "buildfact":"xxx", // phaze 1, can skip any build in any phaze
    // "builddef":"xxx",
    // "fcdef":"aaa", // once planet.defenses >= builddef
    // "fc":["random","aaa"], // set random or a fixed value if !fcdef
    // "buildmines":"xxx",
    
    // "buildfact2":"xxx", // phaze 2, after all phaze 1 builds
    // "builddef2":"xxx",
    // "minerate2":"xxx", // miningrate/turn
    // "resground2":"xxxx", // minerals in ground
    // "buildmines2":"xxx", // dependant on native type, miningrate && resground

    // "minbuildtax3:"xxx",	// native supported tax < minbuildtax
    // "buildfact3":"xxx", // dependant on native type
    // "minerate3":"xxx",
    // "resground3":"xxxx",
    // "buildmines3":"xxx",
    
//    "natmaxtax":"xxx",
//    "nathappy":"xxx",
//    "natmaxhappych":"xxx",
//    "natmintaxamt":"xxx",

    // "ready":"1" // set planet.readystatus
    // [}] } // close default

    
    // **** "minerate3[neu,dur,tri,mol]":"xxx" // minimum miningrate/turn
    // **** "resground3[neu,dur,tri,mol]":"xxxx" // minimum minerals in ground


    nativetaxrate : function(l, c) {
      tax =
	  Math.floor((-c * 100 + 1000 - Math.sqrt(l.nativeclans) - (l.factories + l.mines) / 2 - 50 * (10 - l.nativegovernment)) / 85);
      return tax;
    },

    nativesupport : function(c) {
      ns = c.clans;
      ns *= c.race == 1 ? 2 : 1; // feds == 1
      ns *= c.nativetype == 6 ? 2 : 1; // insect == 6
      return ns;
    },

    nativeTaxAmount : function(c, ntr) {
      var nt = 0;
      if (c.nativeclans > 0) {
	if (c.race == 6 && ntr > 20) { // borg == 6
	  ntr = 20;
	}

	nt = (c.nativeclans / 100) * (ntr / 10) * (c.nativegovernment / 5);

	nt = c.nativetype == 5 ? 0 : nt; // amorphous == 5
	nt = c.nativetype == 6 ? 2 * nt : nt; // insect == 6
	nt = c.race == 1 ? 2 * nt : nt; // feds == 1

	nt = Math.round(nt);
	// nt = Math.min(this.nativesupport(c), nt);
      }
      
      return nt;
    },
    
    nativesupportedtax : function (l, ntr) {
      nt = this.nativeTaxAmount(l, ntr);
      ns = this.nativesupport(l);
      nt = Math.min( nt , ns);
      return nt;
    },

    parsenotes : function() {
      for (var f = 0; f < vgap.myplanets.length; f++) {
	var l = vgap.myplanets[f];
	if (l.note != undefined && l.note.body != "") {
	  try {
	    var jn = JSON.parse(l.note.body
		// , function(h, k) {console.log(h+" "+k)}
	    );
	  } catch (e) {
	    console.log("parse error " + l.id + " " + l.note.body);
	    continue;
	  }
	  
	  if (jn.defaultplanet != undefined) {
	    defaultplanet = jn.defaultplanet;
	    // console.log("found default");
	  } else {
	    l.execute = jn;
	    // console.log("found explicit " + l.id)
	  }
	}
      }

      this.execute();
      for (var f = 0; f < vgap.myplanets.length; f++) {
	var l = vgap.myplanets[f];
	if (l.note != undefined && l.note.body != "") {

	  vgap.indicator.text("done");
	  vgap.indicateOn();
	}
      }
    },

    execute : function() {
      for (var f = 0; f < vgap.myplanets.length; f++) {
	var l = vgap.myplanets[f];
	if (l.execute != undefined) {
	  // console.log(l.id + " single");
	  this.executesingle(l, l.execute);

	} else if (defaultplanet != null) {
	  // console.log(l.id + " default");
	  this.executesingle(l, defaultplanet);
	}
      }
      vgap.map.draw();
    },

    executesingle : function(l, jn) {

      // this has to be first
      if (jn.readonly != undefined) {
	vgap.readOnly = true;
	vgap.indicator.text("Read Only");
	vgap.indicateOn();
      }

      // this has to be first
      if (jn.checkready != undefined && l.readystatus > 0) {
	// console.log(l.id + " checkReady");
	ready.push(l.id);
	return;
      }

      if (jn.buildfact != undefined) { // 1st phaze
	this.buildFactories(l, jn.buildfact);
      }

      fcdef = false;
      if (jn.builddef != undefined) { // 1st phaze
	this.buildDefense(l, jn.builddef);
	if (l.defense >= jn.builddef && jn.fcdef != undefined) {
	  fcdef = true;
	  if (l.friendlycode != jn.fcdef) {
	    l.friendlycode = jn.fcdef;
	    l.changed = true;
	    // console.log(l.id + " deffc " + l.friendlycode);
	  }
	}
      }
      
      if (jn.fc != undefined && !fcdef) {
	if (jn.fc == "random") {
	  l.friendlycode = vgap.randomFC();
	  l.changed = true;
	  // console.log(l.id + " rndfc " + l.friendlycode);
	} else if (jn.fc != l.friendlycode) {
	  l.friendlycode = jn.fc;
	  l.changed = true;
	  // console.log(l.id + " fc " + l.friendlycode);
	}
      }

      if (jn.builddef2 != undefined) { // 2nd phaze
	this.buildDefense(l, jn.builddef2);
      }

	var minbuildtax = 0;
	if (jn.minbuildtax2 != undefined)
	  minbuildtax = jn.minbuildtax2
	
     if (jn.buildfact2 != undefined) {
	if (this.nativesupportedtax(l, 10) < minbuildtax) {
          if (l.nativeclans == 0 || l.nativetype == 5 || l.nativetype == 4) {
	  this.buildFactories(l, jn.buildfact2);
	}
	}
      }
	
      if (jn.buildmines2 != undefined) { // 2nd phaze

	if (this.nativesupportedtax(l, 10) < minbuildtax) {
	  if (l.nativeclans == 0 || l.nativetype == 3 || l.nativetype == 5 || l.nativetype == 4) {
          this.buildMines(l, jn.buildmines2);
        } else {
          var q = 0;
          var m = 0;
          var r = 0;
          var s = 0;
          
          if (jn.minerate2 != undefined) {
            m += jn.minerate2;
            
            q += l.densityneutronium > m ? 1 : 0;
            q += l.densityduranium > m ? 1 : 0;
            q += l.densitytritanium > m ? 1 : 0;
            q += l.densitymolybdenum > m ? 1 : 0;
          }
          
          if (jn.resground2 != undefined) {
            r += jn.resground2;
            
            s += l.groundneutronium > r ? 1 : 0;
            s += l.groundduranium > r ? 1 : 0;
            s += l.groundtritanium > r ? 1 : 0;
            s += l.groundmolybdenum > r ? 1 : 0;
          }
          
          if ((q > 0 || m == 0) && (s > 0 || r == 0))
            this.buildMines(l, jn.buildmines2);
        }
	}
      }

	var minbuildtax = 0;
	if (jn.minbuildtax3 != undefined)
	  minbuildtax = jn.minbuildtax3
	
     if (jn.buildfact3 != undefined) { // 3nd phaze
	if (this.nativesupportedtax(l, 10) < minbuildtax) {
          if (l.nativeclans == 0 || l.nativetype == 5 || l.nativetype == 4) {
	  this.buildFactories(l, jn.buildfact3);
	}
	}
      }

    // 1 Humanoid - Any starbase that is built around a humanoid planet will
    // have tech 10 hull technology automatically.
    // 7 Amphibian - Any starbase that is built around a amphibian planet will
    // have tech 10 beam technology automatically.
    // 8 Ghipsoldal - Any starbase that is built around a ghipsoldal planet will
    // have tech 10 engine technology automatically.
    // 9 Siliconoid - Any starbase that is built around a siliconoid planet will
    // have tech 10 torpedo technology automatically.

    // 2 Bovinoid - Bovinoids are very valuable. Every 10000 Bovinoids will
    // produce 1 supply unit per turn.
    // 3 Reptilian - If there Reptilians living on a planet then your mining
    // rate will be doubled.
    // 4 Avian - Are quick to forgive you for overtaxing them. They will allow
    // you to slightly overtax them without growing unhappy.
    // 5 Amorphous - The only bad natives. The Amorphous lifeforms eat 500
    // colonists (5 clans) per turn.
    // 6 Insectoid - Insectoids produce twice the normal amount of credits per
    // turn per percentage as other native races.
      
      if (jn.buildmines3 != undefined) { // 3nd phaze
	if (this.nativesupportedtax(l, 10) < minbuildtax) {
	  if (l.nativeclans == 0 || l.nativetype == 3 || l.nativetype == 5 || l.nativetype == 4) {
          this.buildMines(l, jn.buildmines3);
        } else {
	  
          q = 0;
          m = 0;
          r = 0;
          s = 0;
          
          if (jn.minerate3 != undefined) {
            m += jn.minerate3;
            
            q += l.densityneutronium > m ? 1 : 0;
            q += l.densityduranium > m ? 1 : 0;
            q += l.densitytritanium > m ? 1 : 0;
            q += l.densitymolybdenum > m ? 1 : 0;
          }
          
          if (jn.resground3 != undefined) {
            r += jn.resground3;
            
            s += l.groundneutronium > r ? 1 : 0;
            s += l.groundduranium > r ? 1 : 0;
            s += l.groundtritanium > r ? 1 : 0;
            s += l.groundmolybdenum > r ? 1 : 0;
          }
          
          if ((q > 0 || m == 0) && (s > 0 || r == 0))
            this.buildMines(l, jn.buildmines3);
        }
      }
      }
      
//    "nathappy":"xxx",
//    "natmaxhappych":"xxx",
//    "natmintaxamt":"xxx",
      var nativetaxrate = l.nativetaxrate;

      if (jn.nathappy != undefined) {
	var nathappych = jn.nathappy - l.nativehappypoints;
	if (nathappych != 0) {
	  var maxhappych = nathappych;
	  if (jn.natmaxhappych != undefined) {
	    maxhappych = jn.natmaxhappych;
	    if (nathappych > maxhappych) {
	      nathappych = maxhappych;
	    } else if (nathappych < -maxhappych) {
	      nathappych = -maxhappych;
	    }
	  }
	  
	  l.nativetaxrate = this.nativetaxrate(l, nathappych);
	  
	  if (l.nativetaxrate < 0) {
	    l.nativetaxrate = 0;
	  }
	}
      }
      
      
//    "natmintaxamt":"xxx",
      
      if (jn.natmintaxamt != undefined) {
	var taxamt = this.nativesupportedtax(l, l.nativetaxrate);
	if (taxamt < jn.natmintaxamt) {
	  l.nativetaxrate = 0;
	}
      }
      
//    "natmaxtax":"xxx",

      if (jn.natmaxtax != undefined) {
	if (l.nativetaxrate > jn.natmaxtax) {
	  l.nativetaxrate = parseInt(jn.natmaxtax);
	}
      }

      if (l.nativetaxrate != nativetaxrate) {
	var nativetaxamt = this.nativesupportedtax(l, l.nativetaxrate);
	l.nativehappychange = vgap.nativeTaxChange(l);
	taxrate.push({id:l.id, tax:l.nativetaxrate, happy:l.nativehappychange, taxamt:nativetaxamt});
	l.changed = true;
      }
      
      if (l.changed) {
	execplanets.push(l.id);
// console.log(l.id + " changed");
      }

      // has to be last
      if (jn.ready != undefined) {
	l.readystatus = jn.ready;
	l.changed = true;
	ready.push(l.id);
	// console.log("ready " + l.id);
      }

    },

    buildFactories : function(d, a) {
      var c = this.maxBuilding(d, 100);

      a = Math.min(a - d.factories, d.supplies, Math.floor((d.supplies + d.megacredits) / 4), c - d.factories);

      if (a > 0) {
	this.spendSuppliesMC(d, a, a * 3)  

	d.builtfactories += a;
	d.factories += a;
	d.changed = true;
	// console.log(d.id + " factories " + a + " = " + d.factories);
        builtfact.push({id:d.id, qty:a});
     }

      return a;
    },

    spendSuppliesMC : function(d, c, a) {
      if (c + a <= d.supplies + d.megacredits && c <= d.supplies) {
	if (d.megacredits < a) {
	  var b = a - d.megacredits;
	  d.megacredits += b;
	  d.supplies -= b;
	  d.suppliessold += b;
	  // console.log(d.id + " supplies "+d.suppliessold +" mc " +
	  // d.megacredits);
	}
	d.megacredits -= a;
	d.supplies -= c;
	d.changed = true;
      }
    },

    miningRate (p, ground, density) {
      m = vgap.miningRate(p, density);
      m = m > ground ? ground : Math.round(m);
	
      return m;
    },

    buildMines : function(d, a) {
      var c = this.maxBuilding(d, 200);

      a = Math.min(a - d.mines, d.supplies, Math.floor((d.supplies + d.megacredits) / 5), c - d.mines);

      if (a > 0) {
	this.spendSuppliesMC(d, a, a * 4);

	d.builtmines += a;
	d.mines += a;
	d.changed = true;
	// console.log(d.id + " mines " + a + " = " + d.mines);
// builtmine.push(d.id);
        builtmine.push({id:d.id, qty:a});
      }

      return a;
    },

    buildDefense : function(d, a) {
      var c = this.maxBuilding(d, 50);

      a = Math.min(a - d.defense, d.supplies, Math.floor((d.supplies + d.megacredits) / 11), c - d.defense);

      if (a > 0) {
	this.spendSuppliesMC(d, a, a * 10);

	d.builtdefense += a;
	d.defense += a;
	d.changed = true;
	// console.log(d.id + " defense " + a + " = " + d.defense);
	
        builtdef.push({id:d.id, qty:a});
     }
      return a;
    },

    maxBuilding : function(d, a) {
      if (d.clans <= a) {
	return d.clans
      } else {
	return Math.floor(a + Math.sqrt(d.clans - a))
      }
    },

  };

  var oldDrawPlanet = vgapMap.prototype.drawPlanet;
  vgapMap.prototype.drawPlanet = function(planet, ctx, fullrender) {

    var note = planet.note;
    planet.note = "";

    oldDrawPlanet.apply(this, arguments);

    planet.note = note;

    var x = this.screenX(planet.x);
    var y = this.screenY(planet.y);

    // planets with script executed
    for (i = 0; i < ready.length; ++i) {
      if (ready[i] == planet.id) {
	this.drawCircle(ctx, x, y, 8 * this.zoom, "lightgreen", 2);
      }
    }

//    for (i = 0; i < execplanets.length; ++i) {
//      if (execplanets[i] == planet.id) {
//	this.drawCircle(ctx, x, y, 7 * this.zoom, "green", 2);
//      }
//    }

    x2 = this.screenX(planet.x + 11 * 1.5);
    
    q = 0;
    for (i = 0; i < builtfact.length; ++i) {
      if (builtfact[i].id == planet.id) {
	q += builtfact[i].qty;
	// this.drawCircle(ctx, x, y, 12 * this.zoom, "yellow", 2);
      }
    }

    if (q != 0) {
      ctx.fillStyle = "orange";
      y2 = this.screenY(planet.y - (2 - 2) * 6 * 1.5);
      ctx.fillText("F+"+q, x2, y2);
    }

    q = 0;
    for (i = 0; i < builtmine.length; ++i) {
      if (builtmine[i].id == planet.id) {
	q += builtmine[i].qty;
	// this.drawCircle(ctx, x, y, 9 * this.zoom, "orange", 2);
      }
    }
    
    if (q != 0) {
      ctx.fillStyle = "orange";
      y2 = this.screenY(planet.y - (3 - 2) * 6 * 1.5);
      ctx.fillText("M+"+q, x2, y2);
    }

    q = 0;
    for (i = 0; i < builtdef.length; ++i) {
      if (builtdef[i].id == planet.id) {
	q += builtdef[i].qty;
	// this.drawCircle(ctx, x, y, 9 * this.zoom, "orange", 2);
      }
    }
    
    if (q != 0) {
      ctx.fillStyle = "orange";
      y2 = this.screenY(planet.y - (4 - 2) * 6 * 1.5);
      ctx.fillText("D+"+q, x2, y2);
    }

      ctx.fillStyle = "lightgreen";
      y2 = this.screenY(planet.y - (5 - 2) * 6 * 1.5);
      for (i = 0; i < taxrate.length; ++i) {
	if (taxrate[i].id == planet.id) {
//	  taxrate.push({id:l.id, tax:l.nativetaxrate, happy:l.nativehappychange, taxamt:nativetaxamount});
	  ctx.fillText("t%"+taxrate[i].tax+" hc" + taxrate[i].happy + " $" + taxrate[i].taxamt, x2, y2);
	  break;
	}
      }
    
    if (planet.note && planet.note.body.length > 0) {
      this.drawCircle(ctx, x, y, 3.5 * this.zoom, "blue", 1);
    }
  };

  // vgaPlanets.prototype.randomFC() can generate commands
  var oldRandomFC = vgaPlanets.prototype.randomFC;
  vgaPlanets.prototype.randomFC = function() {
    // replace function, old function is broken
    // randomFC.apply(this, arguments);

    c = "";
    c += Math.floor(Math.random() * 10);
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    c += b.charAt(Math.floor(Math.random() * b.length))
    c += Math.floor(Math.random() * 10);

    return c
  };

  var oldLoadControls = vgapMap.prototype.loadControls;
  vgapMap.prototype.loadControls = function() {
    oldLoadControls.apply(this, arguments);

    setRandom.prototype.loadControls();
  };
};

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
