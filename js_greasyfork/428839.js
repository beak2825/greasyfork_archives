// ==UserScript==
// @name         Alt+Insert to Render Less
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows users to use the key combination Alt+Insert to disable less essential rendering.
// @author       MTP3
// @match        *://manyland.com/*
// @icon         http://manyland.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/428839/Alt%2BInsert%20to%20Render%20Less.user.js
// @updateURL https://update.greasyfork.org/scripts/428839/Alt%2BInsert%20to%20Render%20Less.meta.js
// ==/UserScript==

function main() {
	entityTypesToMessWith = [
		"EntityDecoanim", "EntityDecotch", "EntityFurry", "EntityDecobig", "EntityDecovbig",
		"EntityDynathing", "EntityFarback", "EntityDeadPlayer",
		"EntityDust", "EntityRemovedust", "EntityFootdust", "EntityJumpdust",
		"EntityVignette", "EntityLiquidDrop", "EntitySparkle", "EntitySpot",
		"EntityBigDust", "EntityBackgroundBlock", "EntityCrumbleBlock"
	];

	renderingStuff = true;
	tmpfuncs = {};

	ig.input.bind(ig.KEY.ALT, "alt");

	document.addEventListener('keyup', (e) => {
		if (ig.input.state("alt") && e.key == "Insert")
		{
			if (renderingStuff)
			{
				for (let [_, typename] of Object.entries(entityTypesToMessWith))
				{
					tmpfuncs[typename] = unsafeWindow[typename].prototype.draw;
					unsafeWindow[typename].prototype.draw = () => {};
				}
			}
			else
			{
				for (let [_, typename] of Object.entries(entityTypesToMessWith))
					unsafeWindow[typename].prototype.draw = tmpfuncs[typename];
			}

			renderingStuff = !renderingStuff;
		}
	});
};

(() => {
	interval = setInterval(() => {
		if (ig === undefined) return;
		if (ig.input === undefined) return;

		clearInterval(interval);
		main();
	}, 50);
})();