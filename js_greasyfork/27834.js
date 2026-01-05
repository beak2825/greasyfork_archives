// ==UserScript==
// @name         Slay.One Hackx
// @namespace    null
// @version      1.6.1
// @description  Slay.one hack
// @author       Null
// @include      http*://slay.one/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27834/SlayOne%20Hackx.user.js
// @updateURL https://update.greasyfork.org/scripts/27834/SlayOne%20Hackx.meta.js
// ==/UserScript==

// Function re-definition for zoom hack
// to work. (See below the function)
Game.prototype.draw = function()
{
	var now = Date.now();
	var fps = this.calcFps(now);

	if(this.playingPlayer && !this.playingPlayer.dieAt && KeyManager.leftMouse && this.playingPlayer.weapon && (this.lastTimeMousePosSent + 65) < now)
	{
		var wpn = this.playingPlayer.weapon;

		var msTillNextShoot = (Math.max(this.playingPlayer.weaponCooldowns[wpn.id], 0) + Math.max(this.playingPlayer.switchWeaponUntil - this.ticksCounter, 0)) * 50;

		if(!isMobile && (msTillNextShoot - network.lastPing - 150) < 0)
		{
			this.mouseUpdate();
			this.lastTimeMousePosSent = now;
		}

		// empty clip sound
		if(msTillNextShoot <= 0 && this.lastEmptyClipSound + 500 < now && !this.playingPlayerClips[wpn.id] && !this.playingPlayerAmmo[wpn.id] && this.playingPlayer.weaponCooldowns[wpn.id] <= 0 && (this.playingPlayer.weaponCooldowns2[wpn.id] <= 0 || this.playingPlayer.weaponCooldowns2[wpn.id] >= wpn.cooldown2))
		{
			this.interface_.setMainKillMsg(slayOne.widgets.lang.get("game.msg.no_ammo"), "grey", "textInGrey");
			soundManager.playSound(SOUND.EMPTY_CLIP, this.playingPlayer.x, this.playingPlayer.y, 0.75);
			this.lastEmptyClipSound = now;
		}
	}

	else if(this.playingPlayerCountActiveHeatseeking2Missiles > 0 && (this.lastTimeMousePosSent + 65) < now)
	{
		this.mouseUpdate();
		this.lastTimeMousePosSent = now;
	}

	// mobile movement
	if(this.playingPlayer && KeyManager && isMobile)
	{
		for(var k = 0; k < this.interface_.buttons.length; k++)
		{
			this.interface_.buttons[k].isPressedOld = this.interface_.buttons[k].isPressed;
			this.interface_.buttons[k].isPressed = false;
		}

		for(var i = 0; i < KeyManager.ongoingTouches.length; i++)
		{
			var touch = KeyManager.ongoingTouches[i];
			// console.log(touch.pageX + ":" +  touch.pageY)
			for(var k = 0; k < this.interface_.buttons.length; k++)
				if(this.interface_.buttons[k].contains(touch.pageX, touch.pageY))
					this.interface_.buttons[k].isPressed = true;
		}

		for(var k = 0; k < this.interface_.buttons.length; k++)
			if(this.interface_.buttons[k].isPressed != this.interface_.buttons[k].isPressedOld)
				network.send((this.interface_.buttons[k].isPressed ? "kdn$" : "kup$") + keyCodes[this.interface_.buttons[k].key]);
	}

	var percentageOfCurrentTickPassed = Math.min((now - lastUpdate) / window.replayOption.tickTime, 1);
	var exactTicks = (this.ticksCounter < 0) ? this.roundTime : (this.ticksCounter + percentageOfCurrentTickPassed);
	if(this.ticksCounter < 0)
		percentageOfCurrentTickPassed = 0;

	// scales
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

        /* 
         *  EDIT HERE
         */

	if(this.playingPlayer && false)
		SCALE_CONST = 0.06;

	FIELD_SIZE = Math.sqrt(WIDTH * HEIGHT) * SCALE_CONST;
	SCALE_FACTOR = FIELD_SIZE / 16;

	if(!this.editingMode && !game.fastForward)
	{
		var x = 0;
		var y = 0;
		var p = null;

		if(this.playingPlayer)
		{
			var playerWeight = 1;
			if(this.playingPlayer.standTime && this.playingPlayer.weapon && this.playingPlayer.weapon.requiredStandTime)
			{
				var extraWeight = Math.min((this.playingPlayer.standTime + percentageOfCurrentTickPassed) / this.playingPlayer.weapon.requiredStandTime, 1);
				playerWeight += -(Math.pow(extraWeight * 1.26, 3) - Math.pow((extraWeight * 1.26) - 0.04, 2) * 2) * 1.5;
			}

			x = (((this.playingPlayer.x0 + percentageOfCurrentTickPassed * (this.playingPlayer.x - this.playingPlayer.x0) - this.cameraX) * FIELD_SIZE * 2 + KeyManager.x * playerWeight) / (2 + playerWeight)) / FIELD_SIZE + this.cameraX;
			y = (((this.playingPlayer.y0 + percentageOfCurrentTickPassed * (this.playingPlayer.y - this.playingPlayer.y0) - this.cameraY) * FIELD_SIZE * 2 + KeyManager.y * playerWeight) / (2 + playerWeight)) / FIELD_SIZE + this.cameraY;
		}

		else if(this.players.length > 0) // no playing player, follow random player with camera
		{
			if(this.iAmSpec)
				p = this.specPlayer;
			else
				p = this.players[Math.floor(this.ticksCounter / 80) % this.players.length];

			if(p)
			{
				x = (((p.x0 + percentageOfCurrentTickPassed * (p.x - p.x0) - this.cameraX) * FIELD_SIZE * 2 + KeyManager.x) / 3) / FIELD_SIZE + this.cameraX;
				y = (((p.y0 + percentageOfCurrentTickPassed * (p.y - p.y0) - this.cameraY) * FIELD_SIZE * 2 + KeyManager.y) / 3) / FIELD_SIZE + this.cameraY;
			}
		}

		if(this.players.length > 0)
		{
			this.cameraX = -(WIDTH / 2) / FIELD_SIZE + x;
			this.cameraY = -(HEIGHT / 2) / FIELD_SIZE + y;
		}

		if(this.iAmSpec && !p)
		{
			if(KeyManager.keys[commandKeys[COMMAND.UP]])
				this.specY -= timeDiff * 0.019;

			if(KeyManager.keys[commandKeys[COMMAND.DOWN]])
				this.specY += timeDiff * 0.019;

			if(KeyManager.keys[commandKeys[COMMAND.LEFT]])
				this.specX -= timeDiff * 0.019;

			if(KeyManager.keys[commandKeys[COMMAND.RIGHT]])
				this.specX += timeDiff * 0.019;

			this.cameraX = this.specX;
			this.cameraY = this.specY;
		}
	}

	if(this.rumbleUntil > now)
	{
		var power = this.rumblePower * (1 - (now - this.rumbleStart) / (this.rumbleUntil - this.rumbleStart));
		this.cameraX += Math.random() * power * 2 - power;
		this.cameraY += Math.random() * power * 2 - power;
	}

	this.cameraX2 = this.cameraX + WIDTH / FIELD_SIZE;
	this.cameraY2 = this.cameraY + HEIGHT / FIELD_SIZE;

	// clear screen
	c.fillStyle = "#30302C";
	c.fillRect(0, 0, WIDTH, HEIGHT);

	if(!game.fastForward)
	{
		// ground
		var canv = this.groundCanvas[Math.floor(exactTicks / 10) % this.groundCanvas.length];
		var drawW = Math.min(WIDTH, canv.width * SCALE_FACTOR);
		var drawH = Math.min(HEIGHT, canv.height * SCALE_FACTOR);
		c.drawImage(canv, (this.cameraX - this.groundMinX) * 16, (this.cameraY - this.groundMinY) * 16, drawW / SCALE_FACTOR, drawH / SCALE_FACTOR, 0, 0, drawW, drawH);

		// walkways
		for(var i = 0; i < this.walkways.length; i++)
		{
			var w = this.walkways[i];
			if(w.x + 1 >= this.cameraX && w.y + 1 >= this.cameraY && w.x - 1 <= this.cameraX2 && w.y - 1 <= this.cameraY2)
			{
				var t = w.type;
				var sX = w.shiftX ? (t.img.x + 8 * Math.sign(w.shiftX) - (w.shiftX * 16 * exactTicks) % 16) : t.img.x;
				var sY = w.shiftY ? (t.img.y + 8 * Math.sign(w.shiftY) - (w.shiftY * 16 * exactTicks) % 16) : t.img.y;
				var x = (w.x - this.cameraX) * FIELD_SIZE;
				var y = (w.y - this.cameraY) * FIELD_SIZE;
				c.drawImage(imgs.tileSheet, sX, sY, t.img.w, t.img.h, x, y, t.w * FIELD_SIZE, t.h * FIELD_SIZE);
			}
		}

		// whitecircles
		for(var i = 0; i < this.whiteCircles.length; i++)
		{
			var wc = this.whiteCircles[i];
			if(wc.time + 30 > this.ticksCounter)
			{
				var age = exactTicks - wc.time;
				var img = wc.img;
				var scale = age * 6.0;
				var drawX = g2rx(wc.x) - (img.w / 2) * scale;
				var drawY = g2ry(wc.y) - (img.h / 2) * scale;
				c.globalAlpha = Math.max(0.4 - age / 20, 0);
				c.drawImage(imgs.miscSheet, img.x, img.y, img.w, img.h, drawX, drawY, img.w * scale, img.h * scale);
				c.globalAlpha = 1;
			}

			else
			{
				this.whiteCircles.splice(i, 1);
				i--;
			}
		}

		// fog / smoke
		c.globalAlpha = 0.06;

		var fieldsCount = imgCoords.fog.w / 16;

		for(var x = -fieldsCount + (exactTicks / 67) % fieldsCount; x < this.map.x; x += fieldsCount)
			for(var y = -fieldsCount + (exactTicks / 63.23) % fieldsCount; y < this.map.y; y += fieldsCount)
			{
				var x_cut_1 = 0;
				if(x < 0)
					x_cut_1 = -x;

				var y_cut_1 = 0;
				if(y < 0)
					y_cut_1 = -y;

				var x_cut_2 = 0;
				if(x + fieldsCount > this.map.x)
					x_cut_2 = x + fieldsCount - this.map.x;

				var y_cut_2 = 0;
				if(y + fieldsCount > this.map.y)
					y_cut_2 = y + fieldsCount - this.map.y;

				var x_target = (x + x_cut_1 - this.cameraX) * FIELD_SIZE;
				var y_target = (y + y_cut_1 - this.cameraY) * FIELD_SIZE;
				var x_source = imgCoords.fog.x + x_cut_1 * 16;
				var y_source = imgCoords.fog.y + y_cut_1 * 16;
				var w_source = imgCoords.fog.w - (x_cut_1 + x_cut_2) * 16;
				var h_source = imgCoords.fog.h - (y_cut_1 + y_cut_2) * 16;
				var w_target = w_source * SCALE_FACTOR;
				var h_target = h_source * SCALE_FACTOR;

				if(x_target <= WIDTH && y_target <= HEIGHT && x_target + w_target >= 0 && y_target + h_target >= 0)
					c.drawImage(imgs.tileSheet, x_source, y_source, w_source, h_source, x_target, y_target, w_target, h_target);
			}

		c.globalAlpha = 1;

		// draw all objects
		var objs = this.objectsToDraw.slice();
		for(var i = 0; i < objs.length; i++)
			objs[i].draw(exactTicks, this.cameraX, this.cameraY, this.cameraX2, this.cameraY2, percentageOfCurrentTickPassed);

		if(this.editingMode)
		{
			this.editor.draw();
			return;
		}

		// target locked player (homing missiles)
		if(this.playingPlayer && this.playingPlayer.weapon && this.playingPlayer.weapon.isHeatSeeking)
		{
			this.refreshLockedPlayer(getMouseGamePlayX(), getMouseGamePlayY());
			if(this.targetLockedPlayer)
			{
				var scale = SCALE_FACTOR * (1.7 - (Math.floor(this.ticksCounter * 0.4) % 4) * 0.1);

				var p = this.targetLockedPlayer;

				var x_ = (p.x0 + percentageOfCurrentTickPassed * (p.x - p.x0) - this.cameraX) * FIELD_SIZE - (imgCoords.aimLock.w / 2) * scale;
				var y_ = (p.y0 + percentageOfCurrentTickPassed * (p.y - p.y0) - this.cameraY) * FIELD_SIZE - (imgCoords.aimLock.h * 0.75) * scale;
				c.drawImage(imgs.miscSheet, imgCoords.aimLock.x, imgCoords.aimLock.y, imgCoords.aimLock.w, imgCoords.aimLock.h, x_ , y_, scale * imgCoords.aimLock.w, scale * imgCoords.aimLock.h);
			}
		}

		else
			this.targetLockedPlayer = null;

		// green aim lock (heal gun)
		if(this.playingPlayer && this.playingPlayer.weapon && this.playingPlayer.weapon.autoAimRange)
		{
			var p = this.getClosestAlly(getMouseGamePlayX(), getMouseGamePlayY(), this.playingPlayer.weapon.autoAimRange);
			if(p)
			{
				var scale = SCALE_FACTOR * (1.7 - (Math.floor(this.ticksCounter * 0.4) % 4) * 0.1);
				var x_ = (p.x0 + percentageOfCurrentTickPassed * (p.x - p.x0) - this.cameraX) * FIELD_SIZE - (imgCoords.aimLockGreen.w / 2) * scale;
				var y_ = (p.y0 + percentageOfCurrentTickPassed * (p.y - p.y0) - this.cameraY) * FIELD_SIZE - (imgCoords.aimLockGreen.h * 0.75) * scale;
				c.drawImage(imgs.miscSheet, imgCoords.aimLockGreen.x, imgCoords.aimLockGreen.y, imgCoords.aimLockGreen.w, imgCoords.aimLockGreen.h, x_ , y_, scale * imgCoords.aimLockGreen.w, scale * imgCoords.aimLockGreen.h);
			}
		}

		for(var i = 0; i < this.floatingTexts.length; i++)
			this.floatingTexts[i].draw();

		// fog / smoke 2
		c.globalAlpha = 0.05;
		var x1 = this.cameraX + (this.cameraX2 - this.cameraX) / 2;

		for(var x = 0 - fieldsCount - (exactTicks / 73.27) % fieldsCount; x < this.map.x + fieldsCount; x += fieldsCount)
			for(var y = 0 - fieldsCount - (exactTicks / 77.41) % fieldsCount; y < this.map.y + fieldsCount; y += fieldsCount)
			{
				var x_ = (x1 + (x - x1) * 1.5 - this.cameraX) * FIELD_SIZE;
				var y_ = (this.cameraY2 + (y - this.cameraY2) * 1.5 - this.cameraY) * FIELD_SIZE;
				if(x_ <= WIDTH && y_ <= HEIGHT && x_ + imgCoords.fog.w * SCALE_FACTOR * 1.5 >= 0 && y_ + imgCoords.fog.h * SCALE_FACTOR * 1.5 >= 0)
					c.drawImage(imgs.tileSheet, imgCoords.fog.x, imgCoords.fog.y, imgCoords.fog.w, imgCoords.fog.h, x_ , y_, SCALE_FACTOR * 1.5 * imgCoords.fog.w, SCALE_FACTOR * 1.5 * imgCoords.fog.h);
			}

		c.globalAlpha = 1;

		// wpn radius
		if(this.playingPlayer && this.playingPlayer.weapon && this.playingPlayer.weapon.range && this.playingPlayer.switchWeaponUntil <= this.ticksCounter)
		{
			var x = (this.playingPlayer.x0 + percentageOfCurrentTickPassed * (this.playingPlayer.x - this.playingPlayer.x0) - this.cameraX) * FIELD_SIZE;
			var y = (this.playingPlayer.y0 + percentageOfCurrentTickPassed * (this.playingPlayer.y - this.playingPlayer.y0) - this.cameraY) * FIELD_SIZE;

			c.globalAlpha = 0.2;
			drawCircle(x, y, FIELD_SIZE * (this.playingPlayer.weapon.range + CONST.PLAYER_RADIUS), "white");
			c.globalAlpha = 1;
		}

		// ability radius
		if(this.playingPlayer && KeyManager.activeAbility && KeyManager.activeAbility.range)
		{
			var x = (this.playingPlayer.x0 + percentageOfCurrentTickPassed * (this.playingPlayer.x - this.playingPlayer.x0) - this.cameraX) * FIELD_SIZE;
			var y = (this.playingPlayer.y0 + percentageOfCurrentTickPassed * (this.playingPlayer.y - this.playingPlayer.y0) - this.cameraY) * FIELD_SIZE;

			c.globalAlpha = 0.2;
			drawCircle(x, y, FIELD_SIZE * this.getAbilityFieldValue(KeyManager.activeAbility, "range"), "white");
			c.globalAlpha = 1;
		}

		// ability preview / mouse cursor
		if(this.playingPlayer && KeyManager.activeAbility && KeyManager.activeAbility.type == "place" && KeyManager.activeAbility.object)
		{
			var target = this.getPotentialPlaceTarget(KeyManager.activeAbility);

			if(target)
			{
				var obj = objects[KeyManager.activeAbility.object];
				var ani = animationData[obj.animation];
				var scale = SCALE_FACTOR * (obj.imgScale ? obj.imgScale : 1);
				var img = imgCoords[obj.img[0]];
				var x = (target.x - this.cameraX) * FIELD_SIZE + (-img.w / 2) * scale;
				var y = (target.y + (obj.yOffset ? obj.yOffset : 0) / 16 - 0.2 - this.cameraY) * FIELD_SIZE + (8 - img.h) * scale;

				c.drawImage(imgs.miscSheet, img.x, img.y, img.w, img.h, x, y, img.w * scale, img.h * scale);

				// turret
				if(ani && ani.imgTurret01)
				{
					img = ani.imgTurret01;
					var x2 = (target.x - this.cameraX) * FIELD_SIZE + (-img.w / 2) * scale;
					var y2 = (target.y - 0.2 - this.cameraY) * FIELD_SIZE + (8 - img.h) * scale;
					c.drawImage(imgs.miscSheet, img.x, img.y, img.w, img.h, x2, y2, img.w * scale, img.h * scale);
				}
			}
		}

		// Fairies
		var x1 = this.cameraX + (this.cameraX2 - this.cameraX) / 2;
		for(var i = 0; i < this.fairies.length; i++)
			this.fairies[i].draw(exactTicks, x1, this.cameraY2);

		// filter
		c.globalAlpha = 0.6;
		c.drawImage(imgs.miscSheet, imgCoords.filter.x, imgCoords.filter.y, imgCoords.filter.w, imgCoords.filter.h, 0, 0, WIDTH, HEIGHT);
		c.globalAlpha = 1;

		if (this.miniMap) {
            this.miniMap.render(percentageOfCurrentTickPassed);
		}

		// red screen (when taking damage)
		if(this.redScreen > 0)
		{
			c.fillStyle = "rgba(255, 0, 0, " + (this.redScreen / 650) + ")";
			c.fillRect(0, 0, WIDTH, HEIGHT);

			this.redScreen -= timeDiff;
		}

		// white screen (when picking up stuff)
		if(this.lastPickUp + 250 >= now)
		{
			c.fillStyle = "rgba(255, 255, 255, " + ((125 - Math.abs(125 - (now - this.lastPickUp))) / 450) + ")";
			c.fillRect(0, 0, WIDTH, HEIGHT);
		}
	}

	// draw mouse cursor
	var str = "";

	if(this.editingMode || this.interface_.hoverWeapon >= 0 || this.interface_.hoverAbility >= 0 || this.interface_.hoverChoice || this.interface_.buttonIsHovered || this.interface_.skipButtonHover || this.interface_.unskipButtonHover)
		str = "url(\"" + window.ResourcePath + "imgs/cursor.cur\"), auto";

	else if(this.playingPlayer
		&& KeyManager.activeAbility &&
		((KeyManager.activeAbility.type == "blink" && this.playingPlayer.carriesFlag()) ||
		KeyManager.activeAbility.energy > this.playingPlayerEnergy ||
		this.lastAbilityUses[pl_active_abilities[0] == KeyManager.activeAbility ? 0 : 1] + KeyManager.activeAbility.cooldown > this.ticksCounter))
		str = "url(\"" + window.ResourcePath + "imgs/cx.cur\"), auto";

	else if(this.playingPlayer && KeyManager.activeAbility && KeyManager.activeAbility.type == "blink")
		str = "url(\"" + window.ResourcePath + "imgs/cb.cur\"), auto";

	else if(this.playingPlayerCountActiveHeatseeking2Missiles > 0)
		str = "url(\"" + window.ResourcePath + "imgs/crosshair" + ((this.ticksCounter % 10 < 5) ? "2" : "") + ".png\") 26 26, auto";

	else if(this.playingPlayer && this.playingPlayer.weapon && this.playingPlayer.weapon.aoeCursor && !this.playingPlayer.dieAt)
	{
		drawCircle(KeyManager.x, KeyManager.y, this.playingPlayer.weapon.aoe * FIELD_SIZE, null, "rgba(255, 150, 150, 0.2)", 0.9);
		drawCircle(KeyManager.x, KeyManager.y, 0.066 * FIELD_SIZE, null, "rgba(255, 255, 255, 0.15)", 0.9);
		str = "none";
	}

	else if(this.playingPlayer && this.playingPlayer.weapon && !this.playingPlayer.weapon.aoeCursor && !this.playingPlayer.dieAt)
	{
		var cur = 0;

		if(KeyManager.leftMouse)
			cur = 6;

		str = "url(\"" + window.ResourcePath + "imgs/c" + cur + ".cur\"), auto";
	}

	else {
		str = "url(\"" + window.ResourcePath + "imgs/cursor.cur\"), auto";
	}

	if(this.lastCursorStr != str)
	{
		this.lastCursorStr = str;
		canvas.style.cursor = str;
	}

	if(this.map != map1)
		this.interface_.draw(exactTicks);

};

// What this huge function re-definition does.
// Re-scaled the viewport to view more land
// (and players :D )
var zoomAmount = 0.025;
setInterval(function() { zoom(0, zoomAmount); }, 50);

// Keyboard combos to change the zoom level:
// EQUALS/PLUS: Increase zoom
// MINUS/DASH/UNDERSCORE: Decrease zoom
// CLOSING BRACKET: Reset to default zoom
// OPENING BRACKET: Reset to game default zoom (like everybody's elses)
// Other key combos:
// T: Insta respawn
var isStanding = false;
document.body.onkeypress = function(event) {
  if ((event.charCode === 61 || event.keyCode === 61 || event.charCode === 187 || event.keyCode === 187 || event.key === "=") && zoomAmount < 0.2) {
    zoomAmount += 0.006;
  } else if ((event.charCode === 45 || event.keyCode === 45 || event.charCode === 189 || event.keyCode === 189 || event.key === "-") && zoomAmount > 0.018) {
    zoomAmount -= 0.006;
  } else if (event.charCode === 221 || event.keyCode === 221 || event.key === "]") {
    zoomAmount = 0.024;
  } else if (event.charCode === 219 || event.keyCode === 219 || event.key === "[") {
    zoomAmount = 0.06;
  }
  
  if (event.charCode === 72 || event.keyCode === 72 || event.key === "h") {
    sendRespawn();
  }
  
  if (event.charCode === 103 || event.keyCode === 103 || event.key === "G") {
    if (isStanding) {
      document.onkeyup({which: 70});
      isStanding = false;
    } else {
      document.onkeydown({which: 70});
      isStanding = true;
    }
  }
};

// TO-DO (someday) - a toggle for the hack
// It half-works. Well... the checkbox that
// is, the toggeler? Not so much.
function toggleOptionsMenu() {
  soundManager.playSound(SOUND.CLICK);
  var el = document.getElementById("optionsWindow");
  el.className = "optionsWindow1 basicWindow";
  el.style.display = (el.style.display != "inline" || el.getAttribute("data-windowtype") != "options") ? "inline" : "none";
  uiManager.showOptions();
  
  var checkbox = document.createElement("DIV");
  checkbox.innerHTML = "<div class='options_h2' onmouseover='uiManager.showHatsInfo2(&quot;Hackx ze game. Duh.&quot;);' onmouseout='uiManager.hideHatsInfo2();'><label>Hackx <input id='hackxSetting' onchange='hackxToggle(this.checked); soundManager.playSound(SOUND.CLICK);' type='checkbox'></label></div>";
  document.getElementById("optionsWindow").appendChild(checkbox);
};

// Debug. Peroid.
function hackxToggle(state) { console.log("hackxToggle(" + state + ")"); }

// Was used in a older version of the hack. Let
// the player scroll anywhere on the screen
// (like spectator mode; hell, it is spectator
// mode) after pressing the grave/tilda key (`)
// (~). Not used as the zoom function works a lot
// better that this does, but I still kept it here.
//document.onkeypress = function(event) { if (event.charCode === 96 || event.charCode === 96 || event.key === "`") { if (!game.iAmSpec) { game.iAmSpec = true; game.specX = game.cameraX; game.specY = game.cameraY; } else { game.iAmSpec = false; }}};

// Stops smoke grenades and flashbangs from...
// well... working, by nullerating their effect.
objects.smokegrenade.emitsSmoke = false;
objects.flashgrenade.flash = false;

// Nullerate the imvisibilty effect to we can
// SEE invisible players. Might work now.
setInterval(function() {
  for (var i=0; i<game.players.length; i++) {
    game.players[i].isInvisible = false;
  }
}, 50);

// Shows the lifetime bars for all turrets.
// It's like the blue bar above any healing
// station, now on turrets also.
objects.autoturret.showLifeTimeBar = true;
objects.laserturret.showLifeTimeBar = true;
objects.missileturret.showLifeTimeBar = true;
objects.grenadeturret.showLifeTimeBar = true;

console.info("If you're seeing this then it worked! Horray! You actually got it to work! Now kill everyone and rule the leaderboards!!!\n\nHacks:\n- Zoom hack controls: Plus, Increase zoom; Minus, decrease zoom; Close bracket (this thing ] ), reset to default zoom\nOpen bracket (this thing [), reset to game default zoom (like everybody's elses)\n- Now can see through smoke and flashbangs with ease.\n- Shows lifetime bars (the blue bar) on turrets\n\n~ Null");