// ==UserScript==
// @name          hoverTextbox
// @description   rewrites the information you get when you hover over a planet
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// @namespace https://greasyfork.org/en/users/32642-stephen-piper
// @downloadURL https://update.greasyfork.org/scripts/17959/hoverTextbox.user.js
// @updateURL https://update.greasyfork.org/scripts/17959/hoverTextbox.meta.js
// ==/UserScript==

//1 Humanoid - Any starbase that is built around a humanoid planet will have tech 10 hull technology automatically.
//7 Amphibian - Any starbase that is built around a amphibian planet will have tech 10 beam technology automatically.
//8 Ghipsoldal - Any starbase that is built around a ghipsoldal planet will have tech 10 engine technology automatically.
//9 Siliconoid - Any starbase that is built around a siliconoid planet will have tech 10 torpedo technology automatically.


//2 Bovinoid - Bovinoids are very valuable. Every 10000 Bovinoids will produce 1 supply unit per turn.
//3 Reptilian - If there Reptilians living on a planet then your mining rate will be doubled.
//4 Avian - Are quick to forgive you for overtaxing them. They will allow you to slightly overtax them without growing unhappy.
//5 Amorphous - The only bad natives. The Amorphous lifeforms eat 500 colonists (5 clans) per turn.
//6 Insectoid - Insectoids produce twice the normal amount of credits per turn per percentage as other native races.

function wrapper() {
  function hitText() {
  }
  hitText.prototype = {
    nativeTaxAmount : function(c, ntr) {
      var nt = 0;
      if (c.nativeclans > 0) {
        if (c.race == 6 && ntr > 20) { // borg == 6
          ntr = 20;
        }

        var nt = (c.nativeclans / 100) * (ntr / 10) * (c.nativegovernment / 5);

        nt = c.nativetype == 5 ? 0 : nt; // amorphous == 5
        nt *= c.race == 1 ? 2 : 1; // feds == 1
        nt *= c.nativetype == 6 ? 2 : 1; // insect == 6

        nt = Math.round(nt);
      }
      return nt;
    },

    nativesupportedtax : function(c) {
      ns = c.clans;
      ns *= c.race == 1 ? 2 : 1; // feds == 1
      ns *= c.nativetype == 6 ? 2 : 1; // insect == 6
      return ns;
    },

    miningRate (p, ground, density) {
      m = vgap.miningRate(p, density);
      m = m > ground ? ground : Math.round(m);

      return m;
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

    sbBuildCost : function(sb) {
      var h = vgap.getHull(sb.buildhullid);
      mc = 0;
      if (h) {
        mc = h.cost;
        if (sb.buildingengineid > 0)
          mc += vgap.engines[sb.buildengineid - 1].cost * h.engines;
        if (sb.buildbeamcount > 0)
          mc += vgap.beams[sb.buildbeamid - 1].cost * sb.buildbeamcount;
        if (sb.buildtorpcount > 0)
          mc += vgap.torpedos[sb.buildtorpedoid - 1].cost * sb.buildtorpcount;
      }

      return mc;
    },
  };

  var oldHitTextBox = vgapMap.prototype.hitTextBox;
  vgapMap.prototype.hitTextBox = function(c) {
    // replace completely, pretty sure i want to do this
    // oldHitTextBox.apply(this, arguments);

    var q = "";
    q += "<div class='ItemSelectionBox minCorrection'>";
    if (c.isPlanet) {
      if (c.id < 0) {
        c = vgap.getPlanet(-c.id);
      }

      q += "<table class='CleanTable'>";
      if (c.ownerid == vgap.player.id && c.readystatus == 0)
        q += "<tr><td colspan='2' class='WarnText'>" + c.id + ":" + c.name + "</td>";
      else
        q += "<tr><td colspan='2'>" + c.id + ":" + c.name + "</td>";
      if (c.clans > 0) {
        q += "<td align='right' colspan='2'>&nbsp;" + c.clans + "</td>";
        q += "<td align='right'>&nbsp;" + c.friendlycode + "</td>";
        if (c.temp > 84 || c.temp < 15)
          q += "<td align='right' class='WarnText'>";
        else
          q += "<td align='right'>";

        q += "&nbsp;" + c.temp + "</td>";
      }
      q += "</tr>";
      if (c.nativeclans > 0) {
        q += "<tr><td colspan='2'>" + c.nativeracename + "</td>";
        q += "<td align='right' colspan='2'>&nbsp;" + c.nativeclans + "</td>"
        if (c.ownerid == vgap.player.id) {
          q += "<td align='right'>&nbsp;" + c.nativehappypoints + "%</td>";
          q += "<td align='right'>&nbsp;" + c.nativetaxrate + "%</td>";
        }
        q += "</tr>";
      }

      // if (vgap.player.status == 7 && !c) {
      // var e = ["None", "Colonization", "Build Starbase", "Supply
      // Starbase", "Exploration", "Build Special", "Attack", "Defend",
      // "Move Fuel"];
      // return "<tr><td colspan='" + a + "' class='WarnText'>" +
      // e[b.goal] + "-" + b.goaltarget + "</td></tr>"
      // }

      if (c.infoturn != 0 && !vgap.godmode) {
        // q += this.hitText(c, c.isPlanet).replace("&nbsp", "");

        var sp = c.factories;

        var cs = 0;
        var nt = 0;
        var cs10 = 0;
        var nt10 = 0;
        var sps = 0;
        if (c.nativeclans > 0) {
          if (c.nativetype == 2) { // bovinoid
            spn = Math.floor(c.nativeclans / 100);
            sps = c.clans - spn;
            sp += sps > 0 ? spn : c.clans;
          }

          nt = hitText.prototype.nativeTaxAmount(c, c.nativetaxrate);
          ns = hitText.prototype.nativesupportedtax(c);
          cs = ns - nt;
          nt = Math.min(nt, ns);

          nt10 = hitText.prototype.nativeTaxAmount(c, 10);
          ns10 = hitText.prototype.nativesupportedtax(c);
          cs10 = ns10 - nt10;
          nt10 = Math.min(nt10, ns10);
        }

        ct = Math.round(c.clans * c.colonisttaxrate / 1000);

        mn = hitText.prototype.miningRate(c, c.groundneutronium, c.densityneutronium);
        md = hitText.prototype.miningRate(c, c.groundduranium, c.densityduranium);
        mm = hitText.prototype.miningRate(c, c.groundmolybdenum, c.densitymolybdenum);
        mt = hitText.prototype.miningRate(c, c.groundtritanium, c.densitytritanium);

        q += "</table><table class='CleanTable'>";
        if (c.groundneutronium > 0) {
          q += "<tr><td>neu:</td><td align='right'>" + c.neutronium + "/&nbsp;</td><td align='right'>" + c.groundneutronium
            + "+&nbsp;</td><td align='right'>" + mn + "</td>";
          q += "<td>&nbsp;sup:</td><td align='right'>" + c.supplies + "+&nbsp;</td><td align='right'>" + sp + "-&nbsp;";
          if (sps < 0)
            q += "</td><td  class='WarnText' align='right'>" + (-sps);
          q += "</td></tr>";

          q += "<tr><td>dur:</td><td align='right'>" + c.duranium + "/&nbsp;</td><td align='right'>" + c.groundduranium
            + "+&nbsp;</td><td align='right'>" + md + "</td>";
          q += "<td>&nbsp;mc:</td><td align='right'>" + c.megacredits + "+&nbsp;</td><td align='right'>" + (nt + ct) + "-&nbsp;";
          if (cs < 0)
            q += "</td><td  class='WarnText' align='right'>" + (-cs);

          q += "</td></tr>";

          q += "<tr><td>tri:</td><td align='right'>" + c.tritanium + "/&nbsp;</td><td align='right'>" + c.groundtritanium
            + "+&nbsp;</td><td align='right'>" + mt + "</td>";
          if (c.nativeclans > 0) {
            q += "<td>&nbsp;10%:</td><td>&nbsp;</td><td align='right'>" + nt10 + "-&nbsp;";
            if (cs10 < 0)
              q += "</td><td  class='WarnText' align='right'>" + (-cs10);
          }
          q += "</td></tr>";

          q += "<tr><td>mol:</td><td align='right'>" + c.molybdenum + "/&nbsp;</td><td align='right'>" + c.groundmolybdenum
            + "+&nbsp;</td><td align='right'>" + mm + "</td>";

          q += "<td>&nbsp;m/f/d:</td><td colspan=2>&nbsp;" + c.mines + " / " + c.factories + " / " + c.defense + "<td>";
          q += "</tr>";

          var n = vgap.getStarbase(c.id);
          if (n != null
            && (c.ownerid == vgap.player.id || vgap.fullallied(c.ownerid))) {
            if (n.starbasetype != 2) {
              if (n.isbuilding)
                q += "<tr><td colspan='6'>bld:&nbsp;" + vgap.getHull(n.buildhullid).name + "</td></tr>";
              else
                q += "<tr><td colspan='6' class='WarnText'>SB Not Building</td></tr>";
            }
          }
        }
      }
      if (c.ownerid != vgap.player.id && c.ownerid != 0) {
        var k = vgap.getPlayer(c.ownerid);
        var l = vgap.getRace(k.raceid);
        q += "<tr><td colspan='4'>" + l.adjective + " (" + k.username + ")</td></tr>"
      }
      q += this.hitText(c, c.isPlanet).replace("&nbsp", "")
      q += "</table>";

    }
    else {
      if (c.id < 0) {
        c = vgap.getShip(-c.id)
      }

      var m = c;
      var e = vgap.getHull(m.hullid);
      var k = vgap.getPlayer(m.ownerid);

      var d = "<table class='CleanTable'>";
      if (m.ownerid == vgap.player.id && m.readystatus == 0)
        d += "<tr><td colspan='4' class='WarnText'>" + m.id + ":" + e.name + "</td></tr>";
      else
        d += "<tr><td colspan='4' >" + m.id + ":" + e.name + "</td></tr>";
      if (m.ownerid == vgap.player.id || vgap.fullallied(m.ownerid)) {

        d += "<tr><td>neu:</td><td>&nbsp;" + gsv(m.neutronium) + "/" + e.fueltank + " </td>";
        d += "<td>&nbsp;fc:</td><td>&nbsp;" + m.friendlycode + "</td></tr>";

        cl = "";
        if (m.clans != 0)
          cl = "<td>clns:</td><td>&nbsp;" + gsv(m.clans) + "</td>";
        cs = "<td>sup:</td><td>&nbsp;" + gsv(m.supplies) + "</td>";
        mc = "<td>mc:</td><td>&nbsp;" + gsv(m.megacredits) + "</td>";
        if (m.duranium != 0 || m.tritanium != 0 || m.molybdenum != 0) {
          d += "<tr><td>dur:</td><td>&nbsp;" + gsv(m.duranium) + "</td>" + cs + "</tr>";
          d += "<tr><td>tri:</td><td>&nbsp;" + gsv(m.tritanium) + "</td>" + mc + "</tr>";
          d += "<tr><td>mol:</td><td>&nbsp;" + gsv(m.molybdenum) + "</td>" + cl + "</tr>";

        }
        else {
          if (m.supplies != 0 || m.megacredits != 0)
            d += "<tr>" + cs + mc + "</tr>";
          if (m.clans != 0 && cl != "")
            d += "<tr>" + cl + "</tr>";
        }
        if (m.bays > 0 || m.torps > 0 || m.beams > 0) {
          d += "<tr>";
          if (m.beams > 0) {
            d += "<td colspan='2'>beam/tech:&nbsp;" + m.beams + "/" + m.beamid + "</td>";
          }
          if (m.bays > 0) {
            d += "<td colspan='2'>fgtr:&nbsp;" + gsv(m.ammo) + "</td>";
          }
          if (m.torps > 0) {
            d += "<td colspan='2'>torp/tech:&nbsp;" + gsv(m.ammo) + "/" + m.torpedoid + "</td>";
          }

          d += "</tr>";
        }
        if (c.ownerid == vgap.player.id) {

          e = "<tr>";
          // if (m.mission != 0 && m.mission != 4) {
          if (m.mission == 9)
            e += "<td colspan='3' class='GoodText'>";
          else
            e += "<td colspan='3'>";

          e += vgap.getShipMissionShortText(m);
          e += ((m.mission == 6 || m.mission == 7 || m.mission == 15 || m.mission == 20) && m.mission1target != 0 ? "&nbsp;"
          + m.mission1target : "");
          e += "</td>";
          // }

          if (m.enemy > 0) {
            s = vgap.getRace(m.enemy).adjective;
            s = s.replace(/^The (.+)/, "$1");

            e += "<td colspan='5' class='WarnText'>" + s + "</td>";
          }
          e += "</tr>";
          if (m.x != m.targetx && m.y != m.targety) {
            t = Math.round(Math.dist(m.x, m.y, m.targetx, m.targety) * 10) / 10;
            e += "</tr><tr>";
            if (m.target != null && m.target.name != null)
              e += "<td colspan='2'>" + m.target.id + ":&nbsp;" + m.target.name + "</td>";
            else
              e += "<td colspan='2'>(" + m.targetx + "," + m.targety + ")</td>";
                      
            e += "<td>&nbsp;" + t + " ly</td>";

            // var t = Math.round(Math.dist(m.x, m.y, m.targetx, m.targety));

            trn = Math.ceil(t / (m.warp * m.warp + .4));
            if (m.friendlycode == "HYP") {
              if (t >= 340 && t <= 360 && m.warp > 0) {
                e += "<td>";
                trn = 1;
              }
              else
                e += "<td class='BadText'>";
            }
            else if (trn > 1)
              e += "<td class='WarnText'>";
            else
              e += "<td>";

            e += "&nbsp;" + trn + "&nbsp;trns</td>";
          }
          if (e != "<tr>")
            d += e + "</tr>";
          if (m.damage > 0) {
            d += "<td>dam:</td><td class='BadText'>&nbsp;" + m.damage + "</td>"
          }
          else {
            d += "<td/></td>"
          }
          // }
          d += "</tr>"
        }
        if (c.ownerid != vgap.player.id && vgap.accountsettings.hoverallyplayer) {
          d += "<tr><td colspan='4'>" + l.adjective + " (" + k.username + ")</td></tr>"
        }

        d += "</table>"
      }
      else {
        q += "<div>" + vgap.getRace(k.raceid).adjective + " (" + vgap.getPlayer(c.ownerid).username + ")</div>";

        d += "<table class='CleanTable'>";
        d += "<tr><td>Heading:</td><td>&nbsp;" + gsv(m.heading) + " at Warp: " + gsv(m.warp) + "</td></tr>";
        d += "<tr><td>Mass: </td><td>&nbsp;" + gsv(m.mass) + "</td></tr>";
        if (vgap.player.raceid == 7) {
          for (var f = 0; f < vgap.messages.length; f++) {
            var g = vgap.messages[f];
            if (g.messagetype == 12 && g.target == m.id) {
              d += "<tr><td class='BadText'>OUT OF FUEL</td></tr>";
              break
            }
          }
        }
        if (m.iscloaked) {
          d += "<tr><td colspan='2' class='GoodText'>Cloaked</td></tr>"
        }
        d += this.hitText(c, c.isPlanet).replace("&nbsp", "");
        d += "</table>"
      }
      q += d
    }
    q += "</div>";
    return q
  };

  //shipSurvey

  var oldShowInfo = vgapMap.prototype.showInfo;
  vgapMap.prototype.showInfo = function(a, b) {
    // replace completely
    // oldShowInfo.apply(this, arguments);

    var h = Math.round(vgap.map.mapX(a));
    var j = Math.round(vgap.map.mapY(b));
    var c = null;
    if (h > 0 && h < 4000 && j > 0 && j < 4000) {
      c = vgap.map.checkForHit(h, j)
    }
    vgap.map.over = c;
    vgap.map.x = h;
    vgap.map.y = j;
    var f = "<span class='coordDisplay titleSelectionBox'> x: " + h + " y: " + j + " </span>";
    if (c) {
      if (c.isPlanet) {
        f += vgap.map.hitTextBox(c)
      }
      var e = vgap.shipsAt(c.x, c.y);
      for (var d = 0; d < e.length; d++) {
        f += vgap.map.hitTextBox(e[d])
      }
    }

    var g = "";
    g += vgap.map.ionText(h, j);
    g += vgap.map.mineText(h, j);
    g += vgap.map.nebText(h, j);
    g += vgap.map.starText(h, j);
    g += vgap.map.debrisText(h, j);
    if (g != "undefined") {
      f += g;
    }
    if (vgap.map.zoom != 1) {
      f += "<div class='ItemSelectionBox minCorrection'>Zoom: " + Math.round(vgap.map.zoom * 100) + "% </div>"
    }
    vgap.map.loc.html("<div class='ItemSelection_border'>" + f + "</div>");
    vgap.map.container.css("cursor", "inherit");
    if (vgap.map.over) {
      if (vgap.map.activePlanet == null && vgap.map.activeShip == null) {
        vgap.map.container.css("cursor", "pointer")
      }
      else {
        vgap.map.container.css("cursor", "pointer")
      }
    }
  };

  var oldShowAssembly = vgapStarbaseScreen.prototype.showAssembly;
  vgapStarbaseScreen.prototype.showAssembly = function() {
    oldShowAssembly.apply(this, arguments);

    s = {
      "top" : "57px",
      "position" : "absolute",
      "line-height" : "16px",
      "height" : "14px",
      "padding" : "0 24px",
      "right" : "14px",
    };

    $("<div class='MoreActionButton' id='SellSuppliesButton'>Sell</div>")
      .appendTo("#BuyShipBox")
      .tclick(function() {

        //    c = hitText.prototype.sbBuildCost(vgap.starbaseScreen.starbase);
        var v = $("#BuildShipCost .val").contents();
        c = v[7].data;

        p = vgap.starbaseScreen.planet;
        mc = p.megacredits;
        sp = p.supplies;

        n = c - mc;
        if (n > 0) {
          if (sp - n > 0) {
            p.megacredits += n;
            p.supplies -= n;
            p.suppliessold += n;
            p.changed = 1;
            if (v[8].data != undefined)
              v[8].data = p.megacredits;
            else if (v[8].childNodes.length > 0) {
              v[8].className = "GreatText";
              v[8].childNodes[0].data = p.megacredits;
            }

            $("#SellSuppliesVar").replaceWith("<div id='SellSuppliesVar'>" + p.supplies + "</div>");
            $("#SellSuppliesVar").css(s);
          }
        }

      });

    //    c = hitText.prototype.sbBuildCost(vgap.starbaseScreen.starbase);
    var v = $("#BuildShipCost .val").contents();
    if (v != undefined && v[7] != undefined) {
      c = v[7].data;

      p = vgap.starbaseScreen.planet;
      mc = p.megacredits;
      sp = p.supplies;

      r = mc - c;
      if (r > 0)
        q = "";
      else {
        r += sp;
        if (r > 0)
          q = " class='GreatText'";
        else
          q = " class='BadText'";
      }

      $("#SellSuppliesButton").css(s);

      $("<div id='SellSuppliesHdr'>Supplies</div>").appendTo("#BuyShipBox");
      s.top = 18;
      s.padding = "0 20";
      $("#SellSuppliesHdr").css(s);

      s.top = 36;
      $("<div id='SellSuppliesVar'" + q + ">" + p.supplies + "</div>").appendTo("#BuyShipBox");
      $("#SellSuppliesVar").css(s);
    }
  };

  var oldRenderScreen = vgapTransferScreen.prototype.renderScreen;
  vgapTransferScreen.prototype.renderScreen = function() {
    oldRenderScreen.apply(this, arguments);

    e = vgap.getHull(this.to.hullid).name;

    var to = this.to.id + ":" + e;
    if (this.from.isPlanet != undefined && this.from.isPlanet == true) {
      var from = this.from.id + ":" + this.from.name;
      var title = "planet\>ship";
    }
    else {
      e = vgap.getHull(this.from.hullid).name;

      var from = this.from.id + ":" + e;
      title = "ship\>ship";
    }

    var html = "<table style='width:100%'><tr>";
    html += "<td>" + from + "</td>";
    html += "<td style='text-align:center'>" + title + "</td>";
    html += "<td style='text-align:right'>" + to + "</td>";
    html += "</tr></table>";

    var m = "#MoreScreen ";
    var t = "#MoreScreen #TransferScreen ";

    $(t+".TransferTitle").replaceWith(html);
    $(t+".LeftRight1000 .lrtext-small").remove();
    $(t+"h1").remove();
    $(t+".valsup").replaceWith("<td><div>&nbsp;</div></td>");

    //    t+$(".SellSuppliesTable").remove();
    $(t+"td:contains('Total')").replaceWith("<td><div>&nbsp;</div></td>");
    //    t+$("td:contains('Build Fighters')").parent().remove();

    s = {
      "width" : "230px"
    };
    $(t+".LeftRight1000").css(s);

    s = {
      "width" : "24px",
      "height" : "22px"
    };
    $(t+".sac-small").css(s);

    s = {
      "width" : "420px"
    };
    $(m).css(s);
    $(m).css(s);

    s = {
      "font-weight" : "normal",
      "color" : "white"
    };
    $(t+".TransferVal").css(s);

    //    var st = $("#MoreScreen #TransferScreen #SuppliesTransfer").parent().parent().detach();
    //    st.insertBefore($("#MoreScreen #TransferScreen #MoneyTransfer").parent().parent());


  };

  var oldShipTransferView = sharedContent.prototype.shipTransferView;
  sharedContent.prototype.shipTransferView = function(e) {
    //    oldShipTransferView.apply(this, arguments);

    d = vgap.map.hitTextBox(e);
    return d;
  };

  var oldPlanetTransferView = sharedContent.prototype.planetTransferView;
  sharedContent.prototype.planetTransferView = function(e) {
    //    oldPlanetTransferView.apply(this, arguments);

    d = vgap.map.hitTextBox(e);
    return d;
  };

  var oldTransfer = vgapPlanetScreen.prototype.transfer;
  vgapPlanetScreen.prototype.transfer = function() {
    oldTransfer.apply(this, arguments);

    s = {
      "width" : "210px",
      "font-weight" : "normal",
      "font-size" : "11px",
      "line-height" : "12px"
    };
    $("#SelectLocation").css(s);

    $("#MoreScreen").width("210px");
  };
  
  var oldDrawShip = vgapMap.prototype.drawShip;
  vgapMap.prototype.drawShip = function(ship, ctx) {
    oldDrawShip.apply(this, arguments);

    if (vgap.canInitiateChunnel(ship)) {
    	var b = vgap.getChunnelTarget(ship);
    	if (b != null  && vgap.isValidChunnelTarget(ship, b)) {
        d = Math.round(Math.dist(ship.x, ship.y, b.x, b.y) * 10) / 10;

        a = (ship.x - b.x) / d;
        a = Math.degrees(Math.acos(a));
        e = (ship.y - b.y) / d;
        e = Math.degrees(Math.asin(e));
        
        ax = Math.cos(Math.radians(a)) * d * .1;
        x = b.x + ax;
        ay = Math.sin(Math.radians(e)) * d *.1;
        y = b.y + ay;

        d = 30;

       // yellow
        ax = Math.cos(Math.radians(a-15)) * d;
        x1 = x + ax;
//      console.log(ship.id+" x:"+x+" ax:"+ax+" x1:"+x1+" a:"+a);

        ay = Math.sin(Math.radians(e-15)) * d;
        y1 = y + ay;
//      console.log(" "+b.id+" y:"+y+" ay:"+ay+" y1:"+y1+" e:"+e);
      

      // red
        ax = Math.cos(Math.radians(a+15)) * d;
        x2 = x + ax;

        ay = Math.sin(Math.radians(e+15)) * d;
        y2 = y + ay;

//        ctx.beginPath();
//    		ctx.moveTo(this.screenX(b.x), this.screenY(b.y));
//    		ctx.lineTo(this.screenX(x), this.screenY(y));
//    		ctx.strokeStyle = "orange";
//    		ctx.stroke();

        ctx.beginPath();
    		ctx.moveTo(this.screenX(x1), this.screenY(y1));
    		ctx.lineTo(this.screenX(x), this.screenY(y));
//    		ctx.strokeStyle = "aqua";
//    		ctx.stroke();
//    		
//        ctx.beginPath();
//    		ctx.moveTo(this.screenX(x), this.screenY(y));
    		ctx.lineTo(this.screenX(x2), this.screenY(y2));
    		ctx.strokeStyle = "aqua";
    		ctx.stroke();
    	}
    }
  };

//Converts from degrees to radians.
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };
   
  // Converts from radians to degrees.
  Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
  };
  

}
;

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);