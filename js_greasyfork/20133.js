// ==UserScript==
// @name        VPA-Keyboard
// @author      Quapla
// @copyright   Basecode: Kero van Gelder, 2016 - latest: Quapla
// @license     Lesser Gnu Public License, version 3
// @downloadURL
// @description For planets.nu -- Add VPA-key strokes, and commands
// @namespace   quapla/VPA-Keyboard
// @include     http://planets.nu/*
// @include     http://play.planets.nu/*
// @include     http://test.planets.nu/*
// @version     1.0.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20133/VPA-Keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/20133/VPA-Keyboard.meta.js
// ==/UserScript==

// Reference:   Kero van Gelder's Keyboard: http://chmeee.org/ext/planets.nu/Keyboard.user.js

// Changes by Quapla:
// Use Arrows to select ships
// --> LEFT/RIGHT numerical previous/next
// --> UP/DOWN previous/next at same position as planet -> base -> ships (numerical) -> again planet
// --> '#' sets all ships at position "ready" and moves to next ship (not ready yet)
// --> ' ' toggles move mode to set waypoints with cursors, use SHIFT for 81LY

sharedContent.prototype.planetSurvey_ori = sharedContent.prototype.planetSurvey;
sharedContent.prototype.planetSurvey = function (planetId) {
	vgap.currentPlanetSurvey = planetId;
	this.planetSurvey_ori(planetId);
}

sharedContent.prototype.editNote_ori = sharedContent.prototype.editNote;
sharedContent.prototype.editNote = function (noteId, noteType) {
	vgap.currentNoteId = noteId;
	vgap.currentNoteType = noteType;
	this.editNote_ori(noteId, noteType);
	$("#EditNote").focus();
}

vgapShipScreen.prototype.shipMission_ori = vgapShipScreen.prototype.shipMission;
vgapShipScreen.prototype.shipMission = function () {
	this.shipMissionOpen = true;
	this.shipMission_ori();
}

vgapShipScreen.prototype.selectMission_ori = vgapShipScreen.prototype.selectMission;
vgapShipScreen.prototype.selectMission = function (missionId) {
	this.selectMission_ori(missionId);
	this.shipMissionOpen = false;
}

vgapShipScreen.prototype.primaryEnemy_ori = vgapShipScreen.prototype.primaryEnemy;
vgapShipScreen.prototype.primaryEnemy = function () {
	this.primaryEnemyOpen = true;
	this.primaryEnemy_ori();
}
vgapShipScreen.prototype.selectEnemy_ori = vgapShipScreen.prototype.selectEnemy;
vgapShipScreen.prototype.selectEnemy = function (enemyId) {
	this.selectEnemy_ori(enemyId);
	this.primaryEnemyOpen = false;
}
vgaPlanets.prototype.closeMore_ori = vgaPlanets.prototype.closeMore;
vgaPlanets.prototype.closeMore = function (callback) {
	vgap.closeMore_ori(callback);
	this.primaryEnemyOpen = false;
	vgap.currentPlanetSurvey = null;
	vgap.shipScreen.shipMissionOpen = false;
}

vgapMap.prototype.selectPlanet_ori = vgapMap.prototype.selectPlanet;
vgapMap.prototype.selectPlanet = function (planet) {
	vgaPlanets.prototype.Quapla_Move = false;
	this.selectPlanet_ori(planet);
}

vgapMap.prototype.selectShip_ori = vgapMap.prototype.selectShip;
vgapMap.prototype.selectShip = function (ship) {
	vgaPlanets.prototype.Quapla_Move = false;
	this.selectShip_ori(ship);
}
vgapMap.prototype.drawPlanetNames = function (e, f) {
	if (vgap.map.planetnames) {
		for (var a = 0; a < vgap.planets.length; a++) {
			var c = vgap.planets[a];
			if (this.isVisible(c.x, c.y, this.planetRad(c))) {
				var show = c.id + "- " + c.name;
				var ctx = vgap.map.ctx;
				ctx.textAlign = "center";
				//ctx.fillStyle = color;
				ctx.fillText(show, this.screenX(c.x), (this.screenY(c.y)-10));
			}
		}
	} else {
		//$(".PlanetName").remove()
		vgapMap.prototype.reload();
	}
	/*	drawPlanetNames : function (x, y) {
		for (var i = 0; i < vgap.planets.length; i++) {
			var planet = vgap.planets[i];
			var left = this.screenX(planet.x) + 10;
			var top = this.screenY(planet.y) - 15;
			$("<div class='PlanetName' style='left:" + left + "px;top:" + top + "px;'>" + planet.id + ": " + planet.name + "</div>").appendTo(this.mapCover);
		}
*/

}


		
var hotkey_ori = vgaPlanets.prototype.hotkey;
vgaPlanets.prototype.hotkey = function (event) {
	//console.log("KC: "+event.keyCode);
	if (vgap.shipScreen.primaryEnemyOpen) {
		var enemy = 0;
		if (event.keyCode >= 48 && event.keyCode <= 57)
			enemy = event.keyCode - 48;
		if (event.keyCode >= 65 && event.keyCode <= 90)
			enemy = event.keyCode - 65 + 10;
		if (enemy <= vgap.players.length) {
			vgap.shipScreen.selectEnemy(enemy);
			return;
		}
	}

	if (vgap.shipScreen.shipMissionOpen) {
		var missionId = -1;
		if (event.keyCode == 67)
			missionId = 9; // 'c', Cloak
		else if (event.keyCode == 69)
			missionId = 0; // 'e', Explore
		else if (event.keyCode == 73)
			missionId = 7; // 'i', Intercept
		else if (event.keyCode == 75)
			missionId = 3; // 'k', Kill
		else if (event.keyCode == 76)
			missionId = 2; // 'l', Lay Mines
		else if (event.keyCode == 77)
			missionId = 1; // 'm', Mine Sweep
		else if (event.keyCode == 83 && event.shiftKey)
			missionId = 8; // 'S', Special / Super Spy
		else if (event.keyCode == 83)
			missionId = 4; // 's', Sensor Sweep
		else if (event.keyCode == 84)
			missionId = 6; // 't', Tow
		if (missionId >= 0) {
			vgap.shipScreen.selectMission(missionId);
			return;
		}
	}

	if (vgap.editNoteOpen) {
		if (event.keyCode == 13 && event.ctrlKey) {
			this.saveNote(vgap.currentNoteId, vgap.currentNoteType);
			return;
		}
	}

	if (event.keyCode == 27) {
		if (this.findObjectFeatureActivated)
			vgap.map.hideFindObjectFeature();
		else if (vgap.moreOpen)
			this.closeMore();
		else if (this.lcOpen)
			this.deselectAll();
		return;
	}

	/*	TAB not working properly in browsers
	if (event.keyCode == 9) { //TAB}
	if (event.shiftKey) vgap.map.zoomout()
	else vgap.map.zoomin()
	return;
	}
	 */

	if (vgap.hotkeysOn) {
		switch (event.keyCode) {
		case 8:
			if ((this.starbaseScreenOpen || this.planetScreenOpen || this.shipScreenOpen) && !this.moreOpen) {
				vgap.rPrev();
				return;
			}
		case 78: // 'n'
			if (event.shiftKey) {
				if (this.planetScreenOpen) {
					shtml.editNote(vgap.planetScreen.planet.id, 1);
					return;
				} else if (vgap.currentPlanetSurvey > 0) { // ship screen is open, but unowned planet is selected
					shtml.editNote(vgap.currentPlanetSurvey, 1);
					return
				} else if (this.shipScreenOpen) {
					shtml.editNote(vgap.shipScreen.ship.id, 2);
					return;
				} else if (this.starbaseScreenOpen) {
					shtml.editNote(vgap.starbaseScreen.starbase.id, 3);
					return;
				}
			}
			break;
		case 88: // 'x'
			this.map.clearTools();
			return;
		case 90: // 'z'
			this.map.zoomFarInOrOut_OnWaypointOrPlanet();
			return;

		case 32: //space bar
			if (this.planetScreenOpen || this.shipScreenOpen) {
				vgaPlanets.prototype.Quapla_Move = !vgaPlanets.prototype.Quapla_Move;
				return;
			}

			//case 188: // '<' if (event.shiftKey)
		case 38: // Arrow up
			if (vgaPlanets.prototype.Quapla_Move)
				if (event.shiftKey)
					this.map.moveSelect(0, 81);
				else
					this.map.moveSelect(0, 1);
			else
				vgap.unrotateActiveObject();
			return;
			// case 190: // '>'
		case 40: // Arrow-Down if (event.shiftKey)
			if (vgaPlanets.prototype.Quapla_Move)
				if (event.shiftKey)
					this.map.moveSelect(0, -81);
				else
					this.map.moveSelect(0, -1);
			else
				vgap.rotateActiveObject();
			return;
		case 39: // Arrow right // if (ev.keyCode == 39 && this.shipScreenOpen || this.planetScreenOpen)
			if (vgaPlanets.prototype.Quapla_Move)
				if (event.shiftKey)
					this.map.moveSelect(81, 0);
				else
					this.map.moveSelect(1, 0);
			else
				this.rNext();
			return;
		case 37: // Arrow left // if (ev.keyCode == 39 && this.shipScreenOpen || this.planetScreenOpen)
			if (vgaPlanets.prototype.Quapla_Move)
				if (event.shiftKey)
					this.map.moveSelect(-81, 0);
				else
					this.map.moveSelect(-1, 0);
			else
				this.rPrev();
			return;

		case 163: // '#' set ships/planet ready "Firefox"
		case 191: // Opera
			{
				var item = 0;
				var item2 = 0;
				if (this.planetScreenOpen) {
					var item = vgap.planetScreen.planet.id;
					vgap.planetScreen.planet.readystatus = 1;
				} else if (this.starbaseScreenOpen) {
					item = vgap.starbaseScreen.starbase.id;
					vgap.starbaseScreen.starbase.readystatus = 1;
				} else if (this.shipScreenOpen) {
					var ship = vgap.shipScreen.ship;
					item = ship.id;
					ship.readystatus = 1; // Set ready
					var ships = vgap.shipsAt(ship.x, ship.y)
						var index = ships.indexOf(ship);
					for (var i = 0; i < ships.length; i++) {
						if (ships[i].ownerid == vgap.player.id)
							if (ships[i].readystatus == 0)
								ships[i].readystatus = 1;
					}
				}
				do {
					this.rNext();
					if (this.planetScreenOpen) {
						if (vgap.planetScreen.planet.readystatus < 1)
							break; // This is the next "unready" one...
						item2 = vgap.planetScreen.planet.id;
					} else if (this.starbaseScreenOpen) {
						if (vgap.starbaseScreen.starbase.readystatus < 1)
							break;
						item2 = vgap.starbaseScreen.starbase.id;
					} else if (this.shipScreenOpen) {
						if (vgap.shipScreen.ship.readystatus < 1)
							break;
						item2 = vgap.shipScreen.ship.id;
					}
				} while (item != item2); // until
				return;
			}
			case 80: // 'P' && (!this.planetScreenOpen && !this.starbaseScreenOpen))
			case 112: // 'p'
			{
				vgap.map.planetnames = !vgap.map.planetnames;
				vgap.map.drawPlanetNames();
				return;
			}
		} // End Case
	}
	hotkey_ori.apply(this, arguments);
	//this.hotkey_ori(event);
}

vgapMap.prototype.zoomFarInOrOut_OnWaypointOrPlanet = function () {
	var zoomedOut = (this.zoom < 29);
	if (zoomedOut) {
		this.zoomFactorBeforeZoomingInDeeply = this.zoom;
		this.setZoom(42);
	} else {
		this.setZoom(this.zoomFactorBeforeZoomingInDeeply);
	}
	var x,
	y;
	if (this.activeShip) {
		x = this.activeShip.targetx;
		y = this.activeShip.targety;
	} else if (this.activePlanet) {
		x = this.activePlanet.x;
		y = this.activePlanet.y;
	} else {
		x = this.centerX;
		y = this.centerY;
	}

	this.centerX = x;
	this.centerY = y;
	this.canvas.x = x - $(window).width() / 2 / this.zoom;
	this.canvas.y = y - $(window).height() / 2 / this.zoom;
	this.draw();
}

vgaPlanets.prototype.rotateActiveObject = function () {
	if (vgap.planetScreenOpen) {
		var planet = vgap.map.activePlanet;
		if (planet.isbase) {
			vgap.map.selectStarbase(planet.id);
		} else {
			var ships = vgap.shipsAt(planet.x, planet.y);
			if (ships.length > 0)
				vgap.map.selectShip(ships[0].id);
			// else only a planet
		}
	} else if (vgap.starbaseScreenOpen) {
		var planet = vgap.map.activePlanet;
		var ships = vgap.shipsAt(planet.x, planet.y);
		if (ships.length > 0) {
			vgap.map.selectShip(ships[0].id);
		} else {
			vgap.map.selectPlanet(planet.id);
		}
	} else if (vgap.shipScreenOpen) {
		var ship = vgap.map.activeShip;
		var ships = vgap.shipsAt(ship.x, ship.y)
			var index = ships.indexOf(ship);
		if (index == ships.length - 1) {
			var planet = vgap.planetAt(ship.x, ship.y)
				if (planet) {
					vgap.map.selectPlanet(planet.id);
				} else if (ships.length > 1) {
					vgap.map.selectShip(ships[0].id);
				} // else Cannot rotate 1 ship
		} else {
			vgap.map.selectShip(ships[index + 1].id);
		}
	}
}

vgaPlanets.prototype.unrotateActiveObject = function () {
	if (vgap.planetScreenOpen) {
		var planet = vgap.map.activePlanet;
		var ships = vgap.shipsAt(planet.x, planet.y);
		if (ships.length > 0) {
			vgap.map.selectShip(ships[ships.length - 1].id);
		} else if (planet.isbase) {
			vgap.map.selectStarbase(planet.id);
		} // else only a planet
	} else if (vgap.starbaseScreenOpen) {
		var planet = vgap.map.activePlanet;
		vgap.map.selectPlanet(planet.id);
	} else if (vgap.shipScreenOpen) {
		var ship = vgap.map.activeShip;
		var ships = vgap.shipsAt(ship.x, ship.y)
			var index = ships.indexOf(ship);
		if (index == 0) {
			var planet = vgap.planetAt(ship.x, ship.y)
				if (planet) {
					if (planet.isbase) {
						vgap.map.selectStarbase(planet.id);
					} else {
						vgap.map.selectPlanet(planet.id);
					}
				} else {
					if (ships.length > 1)
						vgap.map.selectShip(ships[ships.length - 1].id);
				}
		} else {
			vgap.map.selectShip(ships[index - 1].id);
		}
	}
}
