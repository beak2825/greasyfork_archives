// ==UserScript==
// @name         Homestuck Quirk Fixer
// @author       TornadoKirby
// @icon         http://www.bgreco.net/hsflash.png
// @description  it fixes the home stuck
// @version      1.23
// @namespace    tkhomestuck
// @include      https://www.homestuck.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js#sha256=CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=
// @require      https://cdn.jsdelivr.net/npm/velocity-animate@2.0/velocity.min.js
// @downloadURL https://update.greasyfork.org/scripts/401774/Homestuck%20Quirk%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/401774/Homestuck%20Quirk%20Fixer.meta.js
// ==/UserScript==

/*eslint-env es2020, jquery*/
/*global Velocity*/

const emptyLine = /^[^\w\n]*\n$/;

var scratchText;

const tereziNumb = /^[413]+$/;
const tereziWord = /\b[4B-D3F-H1J-Z]+\b/;
var tereziText;

const feferiTrident = /-+E/g;
var feferiText;

var gamzeeText;

var solluxText;

(function() {
	if ($(".o_chat-log-btn").length == 1 && $(".o_chat-container").length == 1) {
		//let t0 = performance.now();
		let chatlog = $(".o_chat-log").contents();
		for (let cli = 0; cli < chatlog.length; cli++) {
			let elem = chatlog[cli];
			if (elem.nodeName != "SPAN") {
				continue;
			}
			let bt = (cli-1 < 0 || (chatlog[cli-1].nodeType == 3 && emptyLine.test(chatlog[cli-1].textContent)) || (chatlog[cli-1].nodeName == "BR"));
			let at = (cli+1 == chatlog.length || (chatlog[cli+1].nodeType == 3 && emptyLine.test(chatlog[cli+1].textContent)));
			if (bt && at) {
				$(elem).addClass("hsLine");
			}
		}
		let lines = $(".hsLine");

		scratchText = lines.filter("[style*='color: #FFFFFF'], [style*='color: #ffffff']").addClass("hsModLine").css("background-color", "#EFEFEF");
		scratchText.each((i, elem) => {
			elem.hsID = "DOC"+i;
		});

		tereziText = lines.filter("[style*='color: #008282']").addClass("hsModLine"); //:not(:contains('gallowsCalibrator'))
		tereziText.each((i, elem) => {
			elem.hsID = "TEZ"+i;
			elem.hsData = {
				originalLine: elem.innerText,
				newLine: elem.innerText.split(" ").map((t, i) => {
					if (t == "1") {
						return "I";
					} else if (t == "4") {
						return "A";
					} else if (i == 0 || tereziNumb.test(t)) {
						return t;
					} else if (tereziWord.test(t)) {
						return t.replace(/4/g, "A").replace(/1/g, "I").replace(/3/g, "E");
					}
					return t;
				}).join(" "),
			}
		});

		feferiText = lines.filter("[style*='color: #77003C'], [style*='color: #77003c']").addClass("hsModLine"); //:not(:contains('cuttlefishCuller'))
		feferiText.each((i, elem) => {
			elem.hsID = "FEF"+i;
			elem.hsData = {
				originalLine: elem.innerText,
				newLine: elem.innerText.split(" ").map((t, i) => {
					let n = t.replace(feferiTrident, "E");
					n = n.replace(/\)\(/g, "h").replace(/hI/g, "HI");
					if (i == 1) {
						n = n.charAt(0).toUpperCase() + n.slice(1);
					}
					if (n.length > 2) {
						let uc = 0;
						let hc = 0;
						for (var si = 0; si < n.length; si++) {
							let c = n.charAt(si);
							if (c === c.toUpperCase()) {
								uc++;
							} else if (c == "h") {
								hc++;
							}
						}
						if (hc > 0 && uc == n.length-hc) {
							n = n.toUpperCase();
						}
					}

					/*if (n.includes(")(")) {
							console.log(elem.innerText, t, n);
						}*/
					return n;
				}).join(" "),
			}
		});

		solluxText = lines.filter("[style*='color: #A1A100'], [style*='color: #a1a100']").addClass("hsModLine"); //:not(:contains('twinArmageddons'))
		solluxText.each((i, elem) => {
			elem.hsID = "SOL"+i;
			elem.hsData = {
				originalLine: elem.innerText,
				newLine: elem.innerText.split(" ").map(t => t.replace(/ii/g, "i").replace(/2/g, "s")).join(" "),
			}
		});

		gamzeeText = lines.filter("[style*='color: #2B0057'], [style*='color: #2b0057']").addClass("hsModLine"); //:not(:contains('terminallyCapricious'))
		gamzeeText.each((i, elem) => {
			elem.hsID = "GAM"+i;
			elem.hsData = {
				originalLine: elem.innerText,
				newLine: elem.innerText.split(" ").map((t, i) => {
					if (i == 0)
						return t;
					return t.toLowerCase();
				}).join(" "),

			}
		});

		$(".hsModLine").each((i, elem) => {
			elem.clickSelected = false;
		});

		$(".hsModLine").hover((e) => {
			if (e.target.hsID.startsWith("DOC")) {
				Velocity(e.target, {
					backgroundColor: "#0E4603",
				}, {
					duration: 125,
					queue: "scratch"+e.target.hsID,
				});
			} else {
				e.target.innerText = e.target.hsData.newLine;
			}
		}, (e) => {
			if (!e.target.clickSelected) {
				if (e.target.hsID.startsWith("DOC")) {
					Velocity(e.target, {
						backgroundColor: "#EFEFEF",
					}, {
						duration: 125,
						complete: () => {
							Velocity("finish", "scratch"+e.target.hsID);
						},
						queue: "scratch"+e.target.hsID,
					});
				} else {
					e.target.innerText = e.target.hsData.originalLine;
				}
			}
		})
		$(".hsModLine").click((e) => {
			if (!e.target.clickSelected) {
				e.target.clickSelected = true;
			} else {
				e.target.clickSelected = false;
				if (e.target.hsID.startsWith("DOC")) {
					Velocity(e.target, {
						backgroundColor: "#EFEFEF",
					}, {
						duration: 125,
						complete: () => {
							Velocity("finish", "scratch"+e.target.hsID);
						},
						queue: "scratch"+e.target.hsID,
					});
				} else {
					e.target.innerText = e.target.hsData.originalLine;
				}
			}
		});

		//console.log((performance.now()-t0), "ms taken");
	}
})();