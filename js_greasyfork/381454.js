// ==UserScript==
// @name         lgkjdsfgp0ipiodfgpooodfgippdgippddd
// @version      1.1.2
// @description  Does pony things
// @author       Zanoab [1877054]
// @match        http://www.torn.com/*
// @match        https://www.torn.com/*
// @grant        none
// @namespace https://greasyfork.org/users/171904
// @downloadURL https://update.greasyfork.org/scripts/381454/lgkjdsfgp0ipiodfgpooodfgippdgippddd.user.js
// @updateURL https://update.greasyfork.org/scripts/381454/lgkjdsfgp0ipiodfgpooodfgippdgippddd.meta.js
// ==/UserScript==

(function() {
	var checkEgg = function(img, egg, forceResolve) {
		var checked = 0;
		return new Promise(function(resolve, reject) {
			var onload = function(evt) {
				if (!img.naturalHeight && !img.naturalWidth && !evt) {
					console.debug("Image not loaded yet!");
					return;
				}
				if (checked) return;
				++checked;
				if (!img.naturalHeight || !img.naturalWidth) {
					console.debug("Size 0 image?!");
					resolve({
						img: img,
						egg: egg,
						score: 0,
					});
				}
				var canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				console.debug(["Dimensions: ", canvas.height, ", ", canvas.width].join(""));

				var context = canvas.getContext("2d");
				context.drawImage(img, 0, 0);

				var data = context.getImageData(0, 0, canvas.width, canvas.height);
				var score = 0;
				for (var i=0;i<data.data.length;i+=4) {
					if (data.data[i+3] > 0) {
						++score;
					}
				}

				console.debug(["Rating: ", (!data.data.length && "Failed") || score / (data.width * data.height)].join(""));
				resolve({
					img: img,
					egg: egg,
					score: data.data.length && score / (data.width * data.height),
				});
			};

			img.onload = onload;
			img.onerror = function(err) {
				(forceResolve ? resolve : reject)({
					egg: egg,
					img: img,
					error: err,
				});
			};
			if (img.complete && !checked) onload(1);
		});
	};

	var allEggPromises = [];
	var eggPromiseSecret = 0;

	var resetEggPromises = function() {
		if (allEggPromises.length) {
			var secret = ++eggPromiseSecret;
			var complete = false;
			window.addEventListener("beforeunload", function(evt) {
				if (!complete && confirm("There are still eggs waiting to be processed.\nAre you sure you want to leave?") == false) {
					return false;
				}
			});
			Promise.all(allEggPromises).then(function(results) {
				if (eggPromiseSecret == secret) {
					++eggPromiseSecret;
					allEggPromises = [];
					var count = 0;
					var logs = ["Egg results returned!"];
					var a;
					for (var result of results) {
						a = ["Score: "];
						if (!result) {
							++count;
							a.push("Empty?!");
						} else if (result.score != null) {
							if (result.score) {
								++count;
							}
							a.push(result.score);
						} else if (result.error) {
							++count;
							a.push("Error");
						} else {
							++count;
							a.push("Unknown?!");
						}
						logs.push(a.join(""));
					}
					complete = true;
					if (count) {
						alert(logs.join("\n"));
					}
				}
			});
		}
	};

	var checkForEggs = function() {
		var eggs, promises = [], egg, img, imgs, a, b;
		try {
			a = document.querySelectorAll("a[href*='competition.php?']:not([href='/competition.php?'])");
			b = document.querySelectorAll("a[data-href*='competition.php?']:not([data-href='/competition.php?'])");
			eggs = [...a, ...b];
			for (egg of eggs) {
				if (egg.getAttribute("easter-scanned") != "") {
					egg.setAttribute("easter-scanned", "");
					imgs = egg.querySelectorAll("img[src]");
					for (img of imgs) {
						promises.push(checkEgg(img, egg, 1).then(function(result) {
							if (result.score) {
								result.img.style["background-color"] = "#ff00ff";
								result.img.title = ["Score: ", result.score].join("");
							}
							return result;
						}));
					}
				}
			}
			if (promises.length) {
				++eggPromiseSecret;
				for (a of promises) {
					allEggPromises.push(a);
				}
				resetEggPromises();
			}
		} catch(err) {
			alert("Something went wrong!");
			console.error(err);
		}
		return promises.length;
	};

	setInterval(function() {
		if (checkForEggs()) {
			// alert("Processing eggs");
		}
	}, 200);
})();