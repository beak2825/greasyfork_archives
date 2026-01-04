// ==UserScript==
// @name         True fill tool (fix).
// @version      0.1
// @description  Now u can fill unlimited.
// @author       nab aka NoT BoT
// @match        *.ourworldofpixels.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/228105
// @downloadURL https://update.greasyfork.org/scripts/436976/True%20fill%20tool%20%28fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436976/True%20fill%20tool%20%28fix%29.meta.js
// ==/UserScript==
function install() {
    let move = (x, y) => {
        OWOP.net.protocol.lastSentX = x * 16;
        OWOP.net.protocol.lastSentY = y * 16;
        OWOP.net.connection.send(new Int32Array([x * 16, y * 16, 0]).buffer);
    };
OWOP.tool.addToolObject(new OWOP.tool.class('True Fill', OWOP.cursors.fill, OWOP.fx.player.NONE, false, function (tool) {
		tool.extra.tickAmount = 6;
		var queue = [];
		var fillingColor = null;
		var defaultFx = OWOP.fx.player.RECT_SELECT_ALIGNED(1);
		tool.setFxRenderer(function (fx, ctx, time) {
			ctx.globalAlpha = 0.8;
			ctx.strokeStyle = fx.extra.player.htmlRgb;
			var z = OWOP.camera.zoom;
			if (!fillingColor || !fx.extra.isLocalPlayer) {
				defaultFx(fx, ctx, time);
			} else {
				ctx.beginPath();
				for (var i = 0; i < queue.length; i++) {
					ctx.rect((queue[i][0] - OWOP.camera.x) * z, (queue[i][1] - OWOP.camera.y) * z, z, z);
				}
				ctx.stroke();
			}
		});
		function tick() {
			var eq = function eq(a, b) {
				return a && b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
			};
			var check = function check(x, y) {
				if (eq(OWOP.world.getPixel(x, y), fillingColor)) {
					queue.unshift([x, y]);
					return true;
				}
				return false;
			};

			if (!queue.length || !fillingColor) {
				return;
			}

			var selClr = OWOP.player.selectedColor;
			var painted = 0;
			var tickAmount = tool.extra.tickAmount;
			for (var painted = 0; painted < tickAmount && queue.length; painted++) {
				var current = queue.pop();
				var x = current[0];
				var y = current[1];
				var thisClr = OWOP.world.getPixel(x, y);
				if (eq(thisClr, fillingColor) && !eq(thisClr, selClr)) {
                    move(x,y);
					if (!OWOP.world.setPixel(x, y, selClr)) {
						queue.push(current);
						break;
					}

					// diamond check first
					var top = check(x, y - 1);
					var bottom = check(x, y + 1);
					var left = check(x - 1, y);
					var right = check(x + 1, y);

					// if corners are not closed by parts of the diamond, then they can be accessed
					if (top && left) {
						check(x - 1, y - 1);
					}
					if (top && right) {
						check(x + 1, y - 1);
					}
					if (bottom && left) {
						check(x - 1, y + 1);
					}
					if (bottom && right) {
						check(x + 1, y + 1);
					}

					// Shape diamond, infra not like
					/*check(x    , y - 1);
     check(x - 1, y    );
     check(x + 1, y    );
     check(x    , y + 1);*/
				}
			}
		}
		tool.setEvent('mousedown', function (mouse) {
			if (!(mouse.buttons & 4)) {
				fillingColor = OWOP.world.getPixel(mouse.tileX, mouse.tileY);
				if (fillingColor) {
					queue.push([mouse.tileX, mouse.tileY]);
					tool.setEvent('tick', tick);
				}
			}
		});
		tool.setEvent('mouseup deselect', function (mouse) {
			if (!mouse || !(mouse.buttons & 1)) {
				fillingColor = null;
				queue = [];
				tool.setEvent('tick', null);
			}
		});
	}));
}
setTimeout(() => {
    install()
},5000)