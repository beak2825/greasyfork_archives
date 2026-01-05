// ==UserScript==
// @name CityMoveInfoExtend
// @version 14.06.17-2
// @description Extended move info.
// @namespace      https://*.alliances.commandandconquer.com/*/index.aspx*
// @include        https://*.alliances.commandandconquer.com/*/index.aspx*
// @author Nogrod
// @downloadURL https://update.greasyfork.org/scripts/15090/CityMoveInfoExtend.user.js
// @updateURL https://update.greasyfork.org/scripts/15090/CityMoveInfoExtend.meta.js
// ==/UserScript==

(function() {
	var c = document.createElement("script");
	c.innerHTML = "(" + function() {
		function c() {
			if ("undefined" == typeof webfrontend.gui.region.RegionCityMoveInfo.prototype.updateBases) {
				var a = null,
					b = webfrontend.gui.region.RegionCityMoveInfo.prototype,
					d;
				for (d in b)
					if ("function" === typeof b[d] && /GetCityMoveCooldownTime/.test(b[d].toString())) {
						a = d;
						break
					}
				null !== a && (webfrontend.gui.region.RegionCityMoveInfo.prototype[a + "Orig"] = webfrontend.gui.region.RegionCityMoveInfo.prototype[a], webfrontend.gui.region.RegionCityMoveInfo.prototype.updateBases = function(a, b) {
					if ("undefined" === typeof this.basesCount) {
						var e = new qx.ui.container.Composite(new qx.ui.layout.HBox(6)),
							c = (new qx.ui.basic.Label(this.tr("tnf:bases:") + " ")).set({
								rich: !0,
								textColor: "text-region-tooltip",
								alignY: "middle"
							});
						this.basesCount = (new qx.ui.basic.Label("")).set({
							rich: !0,
							textColor: "text-region-value",
							font: "bold",
							alignY: "middle"
						});
						e.add(c);
						e.add(this.basesCount);
						this.add(e)
					}

					var x = a;
					var y = b;
					var levelCount = [];
					var count = 0;
					var maxAttack = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
					var world = ClientLib.Data.MainData.GetInstance().get_World();
					for (var scanY = y - 10; scanY <= y + 10; scanY++) {
						for (var scanX = x - 10; scanX <= x + 10; scanX++) {
							var distX = Math.abs(x - scanX);
							var distY = Math.abs(y - scanY);
							var distance = Math.sqrt((distX * distX) + (distY * distY));
							// too far away to scan
							if (distance >= maxAttack) {
								continue;
							}
							var object = world.GetObjectFromPosition(scanX, scanY);
							// Nothing to scan
							if (object === null) {
								continue;
							}
							// Object isnt a NPC Base
							if (object.Type !== ClientLib.Data.WorldSector.ObjectType.NPCBase) {
								continue;
							}
							if (typeof object.getCampType === 'function' && object.getCampType() === ClientLib.Data.Reports.ENPCCampType.Destroyed) {
								continue;
							}
							try {
								var level = object.getLevel();
								levelCount[level] = (levelCount[level] || 0) + 1;
							} catch (a) {
								console.error('Error - ' + a);
							}
							count++;
						}
					}
					var output = [];
					for (var i = 0; i < levelCount.length; i++) {
						var lvl = levelCount[i];
						if (lvl !== undefined) {
							output.push(lvl + ' x ' + i);
						}
					}
					// calculate waves
					//Bis 20 Basen -- 1 Angriff
					//21 - 25 -- max 2 Angriffe
					//25 - 30 -- 2 Angriffe
					//31 - 35 -- max. 3 Angriffe
					//35 - 40 -- 3 Angriffe
					//ab 41 Basen in Range bis zu 4 Angriffe ab 45 Basen in Range 4 Angriffe...
					var waves = '';
					if (count <= 20) {
						waves = ' - 1 wave';
					} else if (count <= 25) {
						waves = ' - max 2 waves';
					} else if (count <= 30) {
						waves = ' - 2 waves';
					} else if (count <= 35) {
						waves = ' - max 3 waves';
					} else if (count <= 40) {
						waves = ' - 3 waves';
					} else if (count <= 44) {
						waves = ' - max 4 waves';
					} else if (count <= 50) {
						waves = ' - 4 waves';
					} else {
						waves = ' - are u crazy???';
					}
					//console.log(count + ' - ' + output.join(', '));
					this.basesCount.setValue(count + ' - ' + output.join(', ') + waves)
					
					//for (
					//		 var e = 0,
					//		     c = ClientLib.Data.MainData.GetInstance().get_World(),
					//				 f = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance(),
					//				 d = b - Math.ceil(f)
					//		; d <= b + Math.ceil(f); d++)
					//	for (var k = a - Math.ceil(f); k <= a + Math.ceil(f); k++) {
					//		var g = Math.abs(a - k),
					//			h = Math.abs(b - d);
					//		g * g + h * h <= f * f && (g = c.GetObjectFromPosition(k, d), null !== g && g.Type == ClientLib.Data.WorldSector.ObjectType.NPCBase && e++)
					//	}


				}, b = /this\.(__\w{3})\.setValue\(phe\.cnc\.Util\.getTimespanString\(\w\.GetTimeSpan\(\w\)\)/.exec(webfrontend.gui.region.RegionCityMoveInfo.prototype[a]), webfrontend.gui.region.RegionCityMoveInfo.prototype[a] = (new Function("return function (x,y){this." +
					a + "Orig(x,y);var time=ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().GetCityMoveCooldownTime(x,y);this." + b[1] + ".setValue(this." + b[1] + ".getValue()+' ('+phe.cnc.Util.getDateTimeString(new Date(Date.now()+(time*1000)))+')');this.updateBases(x,y);}"))())
			}
		}

		function h() {
			try {
				"undefined" !== typeof qx && "" !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? c() : setTimeout(h, 1E3)
			} catch (a) {
				"undefined" !== typeof console ? console.log(a + ": " + a.stack) : window.opera ? opera.postError(a) :
					console.log(a)
			}
		}
		setTimeout(h, 1E3)
	}.toString() + ")();";

	c.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(c)
})();