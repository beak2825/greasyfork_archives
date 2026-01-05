// ==UserScript==
// @name			SINGULARITY'S Colourblind adjustments
// @description		Changes ingame default colours to help colour blind players
// @author			Singularity
// @include			http://planets.nu/home
// @include			http://planets.nu/games/*
// @include			http://*.planets.nu/*
// @include			http://planets.nu/*
// @version			0.1

// @namespace https://greasyfork.org/users/15085
// @downloadURL https://update.greasyfork.org/scripts/17560/SINGULARITY%27S%20Colourblind%20adjustments.user.js
// @updateURL https://update.greasyfork.org/scripts/17560/SINGULARITY%27S%20Colourblind%20adjustments.meta.js
// ==/UserScript==

/*jshint multistr: true */

function wrapper () { // wrapper for injection

	if (vgap.version < 3) {
		console.log("Colourblind needs Nu version 3 or above");
		return;
	}


	vcrSim.prototype.changeFighterDir = function (obj, i, side) {	

		obj.ftrs[i].hide();
		var y = this.fighterY(i);
		var x = this.screenX(obj.FighterX[i]);
		if (side == 1)
			obj.ftrs[i] = this.drawFighter(x, y, "blue", "right");
		else
			obj.ftrs[i] = this.drawFighter(x, y, "yellow", "left");
	};//changeFighterDir


	vcrSim.prototype.launchFighter = function (obj, i, side) {

		var y = this.fighterY(i);
		var x = this.screenX(obj.FighterX[i]);
		if (side == 1)
			obj.ftrs[i] = this.drawFighter(x, y, "blue", "left");
		else
			obj.ftrs[i] = this.drawFighter(x, y, "yellow", "right");

		obj.status.launchFighter();
	};//launchFighter
	
		
	vgapMap.prototype.drawWaypoints = function (ctx, id, fixedColor) {
	
        for (var i = 0; i < vgap.waypoints.length; i++) {

            var waypoint = vgap.waypoints[i];

            var draw = true;
            if (id && waypoint.id != id)
                draw = false;

            if (draw) {

                //set line color
                var color = waypoint.color;
                if (fixedColor)
                    color = fixedColor;
				
				if (color==="#ff6600")
					color="blue";

                var x1 = this.screenX(waypoint.x1);
                var y1 = this.screenY(waypoint.y1);
                var x2 = this.screenX(waypoint.x2);
                var y2 = this.screenY(waypoint.y2);

                if (this.zoom > 40) {
                    var ship = vgap.getShip(waypoint.id);
                    if (ship && ship.rndX) {
                        var rnd = this.zoom / 2;
                        x1 += (ship.rndX * rnd) - (rnd / 2);
                        y1 += (ship.rndY * rnd) - (rnd / 2);
                    }
                }
                

                if (waypoint.dasharray) {
                    ctx.beginPath();
                    ctx.dashedLine(x1, y1, x2, y2, waypoint.dasharray);
                    ctx.closePath();
                }
                else {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                }
                ctx.strokeStyle = color;
                if (!waypoint.linewidth)
                    ctx.lineWidth = 2;
                else
                    ctx.lineWidth = waypoint.linewidth;
                ctx.stroke();

            }
        }
    }//drawWaypoints
	

	// register your plugin with NU
	vgap.registerPlugin(plugin, "Colourblind plugin");


} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);    
