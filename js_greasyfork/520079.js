// ==UserScript==
// @name         Pardus navigation highlight a.k.a. Paze
// @namespace    leaumar
// @version      4
// @description  Shows the route your ship will fly.
// @author       leaumar@sent.com
// @match        https://*.pardus.at/main.php
// @icon         https://icons.duckduckgo.com/ip2/pardus.at.ico
// @require      https://cdn.jsdelivr.net/npm/ramda@0.30.1/dist/ramda.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/520079/Pardus%20navigation%20highlight%20aka%20Paze.user.js
// @updateURL https://update.greasyfork.org/scripts/520079/Pardus%20navigation%20highlight%20aka%20Paze.meta.js
// ==/UserScript==

// convention: nav grid is width * height tiles with origin 0,0 top-left, just like pixels in css
// a point is an {x, y} coordinate
// a tile is a <td> and a point

const classes = {
	map: {
		// set by the game
		impassable: "navImpassable", // i.e. solid energy
		npc: "navNpc",
		nodata: "navNoData",

		tile: "paze-tile", // every tile in the grid
		passable: "paze-passable", // all clickable tiles
	},
	route: {
		reachable: "paze-reachable", // a route can be flown to this destination
		unreachable: "paze-unreachable", // this destination has no route to it
		step: "paze-step", // ship will fly through here
		deadEnd: "paze-dead-end", // route calculation gets stuck here, or runs into a monster
	},
};

const style = (() => {
	const css = `
	#navareatransition img[class^=nf] {
	  /*
		for some reason these tiles have position:relative but they aren't offset
		this obscures the outline on the parent td
		unsetting the position does not break the flying animation
	  */
	  position: unset !important;
	}
	
	.${classes.map.tile}.${classes.map.impassable} img, .${classes.map.tile}.${classes.map.nodata} img {
	  cursor: not-allowed !important;
	}
	
	.${classes.map.tile}.${classes.map.passable} {
	  /* outline doesn't affect box sizing nor image scaling, unlike border */
	  outline: 1px dotted #fff3;
	  outline-offset: -1px;
	}
	
	.${classes.map.tile}.${classes.route.unreachable} img {
	  cursor: no-drop !important;
	}
	
	.${classes.map.tile}.${classes.route.step} {
	  outline-color: yellow;
	}
	
	.${classes.map.tile}.${classes.route.reachable} {
	  outline: 1px solid green;
	}
	
	.${classes.map.tile}.${classes.route.deadEnd} {
	  outline: 1px solid red;
	}
	`;

	return {
		attach: () => {
			GM_addStyle(css);
		}
	};
})();

const makeMap = (() => {
	// url(//static.pardus.at/img/stdhq/96/backgrounds/space3.png)
	const bgRegex = /\/backgrounds\/([a-z_]+)(\d+)\.png/;

	function getTileType(td) {
		const bg = td.style.backgroundImage;
		const imageUrl =
			bg == null || bg === "" ? td.getElementsByTagName("img")[0].src : bg;
		const [match, name, number] =
			bgRegex.exec(imageUrl) ??
			(() => {
				throw new Error("unexpected missing background", { cause: td });
			})();
		// TODO is this correct?
		return name === "viral_cloud"
			? parseInt(number) < 23
				? "space"
				: "energy"
			: name;
	}

	// -----

	const baseExitCost = {
		asteroids: 24,
		energy: 19,
		exotic_matter: 35,
		nebula: 15,
		space: 10,
	};
	let realExitCost = null;

	// TODO advanced skills, flux capacitors, stim chips...
	function getExitCosts(centerTileType) {
		if (realExitCost != null) {
			return realExitCost;
		}

		const currentCost = parseInt(
			document.getElementById("tdStatusMove").textContent.trim()
		);
		const efficiency = baseExitCost[centerTileType] - currentCost;
		return (realExitCost = R.map(
			(baseCost) => baseCost - efficiency,
			baseExitCost
		));
	}

	// -----

	return (navArea) => {
		const height = navArea.getElementsByTagName("tr").length;
		const tds = [...navArea.getElementsByTagName("td")];
		const width = tds.length / height;
		const size = tds[0].getBoundingClientRect().width;

		console.info(
			`found a ${width}x${height} ${size}px nav grid with ${tds.length} tiles`
		);

		const centerTd = tds[Math.floor(tds.length / 2)];
		const centerTileType = getTileType(centerTd);
		const exitCosts = getExitCosts(centerTileType);

		const tiles = tds.map((td, i) => {
			const x = i % width;
			const y = Math.floor(i / width);
			const equalsPoint = (point) => point.x === x && point.y === y;

			const acceptsTraffic =
				!td.classList.contains(classes.map.impassable) &&
				!td.classList.contains(classes.map.nodata);

			const trafficProperties = acceptsTraffic
				? (() => {
					const type = getTileType(td);
					return {
						isMonster: td.classList.contains(classes.map.npc),
						type,
						exitCost: exitCosts[type],
					};
				})()
				: null;

			return { td, x, y, equalsPoint, acceptsTraffic, ...trafficProperties };
		});

		function findTileOfTd(td) {
			return tiles.find((tile) => tile.td.id === td.id);
		}

		function isInBounds({ x, y }) {
			return x < width && y < height;
		}

		function findTileAt(point) {
			return isInBounds(point) ? tiles[point.y * width + point.x] : null;
		}

		function getCenterTile() {
			return tiles[Math.floor(tiles.length / 2)];
		}

		return {
			height,
			tiles,
			width,
			size,
			findTileOfTd,
			findTileAt,
			getCenterTile,
		};
	};
})();

const navigation = (() => {
	const stuck = "stuck";

	// diagonal first, then straight line
	// obstacle avoidance: try left+right or up+down neighboring tiles
	// vertical movement first if diagonally sidestepping, down/right first if orthogonally
	function* pardusWayfind(destinationTile, map) {
		let currentTile = map.getCenterTile();

		yield currentTile;

		while (!destinationTile.equalsPoint(currentTile)) {
			if (currentTile.isMonster) {
				yield stuck;
				return;
			}

			const delta = {
				x: destinationTile.x - currentTile.x,
				y: destinationTile.y - currentTile.y,
			};
			// if delta is 0, sign is 0 so no move
			const nextMovePoint = {
				x: currentTile.x + 1 * Math.sign(delta.x),
				y: currentTile.y + 1 * Math.sign(delta.y),
			};

			const nextMoveTile = map.findTileAt(nextMovePoint);
			if (nextMoveTile != null && nextMoveTile.acceptsTraffic) {
				yield (currentTile = nextMoveTile);
				continue;
			}

			const isHorizontal = delta.x !== 0;
			const isVertical = delta.y !== 0;

			const sidestepPoints = (() => {
				if (isHorizontal && isVertical) {
					return [
						{
							x: currentTile.x,
							y: nextMovePoint.y,
						},
						{
							x: nextMovePoint.x,
							y: currentTile.y,
						},
					];
				}

				if (isHorizontal) {
					return [
						{
							x: nextMovePoint.x,
							y: currentTile.y + 1,
						},
						{
							x: nextMovePoint.x,
							y: currentTile.y - 1,
						},
					];
				}

				if (isVertical) {
					return [
						{
							x: currentTile.x + 1,
							y: nextMovePoint.y,
						},
						{
							x: currentTile.x - 1,
							y: nextMovePoint.y,
						},
					];
				}
			})();

			const sidestepTile = sidestepPoints
				.map((point) => map.findTileAt(point))
				.find((tile) => tile != null && tile.acceptsTraffic);

			if (sidestepTile == null) {
				// autopilot failure
				yield stuck;
				return;
			}

			yield (currentTile = sidestepTile);
		}
	}

	function wayfind(destinationTile, map) {
		const tiles = [...pardusWayfind(destinationTile, map)];
		const isStuck = tiles.at(-1) === stuck;

		return {
			tiles: isStuck ? tiles.slice(0, -1) : tiles,
			stuck: isStuck,
		};
	}

	return {
		wayfind,
	};
})();

function makeCanvas(map) {
	const canvas = document.createElement("canvas");
	Object.assign(canvas, {
		width: map.size * map.width,
		height: map.size * map.height,
	});
	Object.assign(canvas.style, {
		position: "absolute",
		top: "0",
		left: "0",
		pointerEvents: "none",
	});

	const ctx = canvas.getContext("2d");

	function drawDashes(tiles, { gap, width, length, color }) {
		ctx.setLineDash([length, gap]);
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo((map.width * map.size) / 2, (map.height * map.size) / 2);
		tiles.forEach(({ x, y }) => {
			ctx.lineTo(x * map.size + map.size / 2, y * map.size + map.size / 2);
		});
		ctx.stroke();
	}

	function drawCosts(tiles) {
		ctx.fillStyle = "white";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.font = "12px sans-serif";

		tiles.slice(1).forEach((tile, i) => {
			const previousTile = tiles[i];
			const exitCost = `${previousTile.exitCost}`;
			const x = tile.x * map.size + 10;
			const y = tile.y * map.size + 16;

			ctx.strokeText(exitCost, x, y);
			ctx.fillText(exitCost, x, y);
		});
	}

	function drawRectangle(tile, color) {
		ctx.fillStyle = color;
		ctx.fillRect(tile.x * map.size, tile.y * map.size, map.size, map.size);
	}

	return {
		appendTo: (parent) => {
			const { position } = window.getComputedStyle(parent);

			switch (position) {
				// partial refresh is off
				case "static": {
					parent.style.position = "relative";
					break;
				}

				// partial refresh is on
				case "absolute":
					break;

				// mods?
				default: {
					throw new Error("unexpected parent position", { cause: parent });
				}
			}

			parent.appendChild(canvas);
		},
		clear: () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		},
		plot: (way, destinationTile) => {
			drawRectangle(destinationTile, way.stuck ? "#f001" : "#fff1");

			// they start at the same pixel so the outline is actually misaligned by 1 border width
			drawDashes(way.tiles, {
				gap: 6,
				width: 4,
				length: 9,
				color: "black",
			});
			drawDashes(way.tiles, {
				gap: 7,
				width: 2,
				length: 8,
				color: way.stuck ? "red" : "green",
			});

			drawCosts(way.tiles);
		},
	};
}

const makeGrid = (() => {
	const routeClassNames = R.values(classes.route);

	return (map) => {
		function show() {
			map.tiles.forEach((tile) => {
				tile.td.classList.add(classes.map.tile);
				if (tile.acceptsTraffic) {
					tile.td.classList.add(classes.map.passable);
				}
			});
		}

		function erase() {
			map.tiles.forEach((tile) => {
				tile.td.classList.remove(...routeClassNames);
			});
		}

		function plot(way, destinationTile) {
			way.tiles.slice(1).forEach((tile) => {
				tile.td.classList.add(classes.route.step);
			});

			destinationTile.td.classList.add(
				way.stuck ? classes.route.unreachable : classes.route.reachable
			);

			if (way.stuck) {
				const stuckTile = way.tiles.at(-1);
				stuckTile.td.classList.add(classes.route.deadEnd);
			}
		}

		return {
			erase,
			plot,
			show,
		};
	};
})();

function gps(navArea) {
	const map = makeMap(navArea);
	const canvas = makeCanvas(map);
	canvas.appendTo(navArea.parentNode);
	const grid = makeGrid(map);
	grid.show();

	function clearRoute() {
		grid.erase();
		canvas.clear();
	}

	function showRoute(event) {
		if (event.target.tagName === "TD") {
			const destinationTile = map.findTileOfTd(event.target);

			if (destinationTile == null) {
				throw new Error("unexpected tile", { cause: event.target });
			}

			clearRoute();

			if (
				destinationTile.acceptsTraffic &&
				!map.getCenterTile().equalsPoint(destinationTile)
			) {
				const way = navigation.wayfind(destinationTile, map);

				// TODO hint at more efficient route?

				canvas.plot(way, destinationTile);
				grid.plot(way, destinationTile);
			}
		}
	}

	// capture phase is required: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event#behavior_of_mouseenter_events
	navArea.addEventListener("mouseenter", showRoute, true);
	navArea.addEventListener("mouseleave", clearRoute);

	return function cleanUp() {
		clearRoute();
		navArea.removeEventListener("mouseenter", showRoute, true);
		navArea.removeEventListener("mouseleave", clearRoute);
	};
}

style.attach();

let cleanUp = gps(document.getElementById("navarea"));

unsafeWindow.addUserFunction(() => {
	cleanUp();
	// TODO if the mouse moves during flight animation, the appropriate route isn't shown until mousing over another tile
	cleanUp = gps(document.getElementById("navareatransition"));
});
