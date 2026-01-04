// ==UserScript==
// @name         Coconut Shy & Bagatelle
// @namespace    neopets
// @version      0.1
// @description  Autoplay button
// @author       You
// @match        http://www.neopets.com/halloween/coconutshy.phtml
// @match        http://www.neopets.com/halloween/bagatelle.phtml
// @grant        https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/408907/Coconut%20Shy%20%20Bagatelle.user.js
// @updateURL https://update.greasyfork.org/scripts/408907/Coconut%20Shy%20%20Bagatelle.meta.js
// ==/UserScript==

var url = location.href;

jQuery.fn.exists = function () {
	return this.length > 0;
};

$('<style>.autoplayer{width:70%}.autoplayer td,.autoplayer th,.autoplayer tr,.autoplayer table{border-collapse:collapse;text-align:center;font-size:12px;border:1px solid #000;padding:4px}.autoplayer tr:nth-child(even){background-color:#e3e3e3}</style>').appendTo("head");

if (url.includes("/halloween/coconutshy")) {
	(function () {
		if (!$(".content embed").exists()) {
			return false;
		}
		$("img[src*='keeper']").before('No. of games:&nbsp;<input id="numgames_cs" type="number" value="20" min="1" max="20" style="width: 50px;">&nbsp;<input id="play_cs" type="button" value="Play!"><br><br>');
		$("#numgames_cs").on("keyup", function () {
			var v = $(this).val();
			$(this).val(v > 20 ? 20 : v);
		});
		$("#play_cs").on("click", function () {
			var csCount = $("#numgames_cs").val();
			if (csCount < 1 || csCount > 20) {
				alert("Must be between 1 and 20");
				return false;
			}
			$(this).parent().find("div").hide();
			$(this).prop("disabled", true);
			$(this).parent().find("p").attr("id", "results_cs");
			$("#results_cs").html('<hr><b>Playing ' + csCount + ' games...</b><br><br><div class="autoplayer"><table><tbody id="addrows"><tr><th style="width: 8%">#</th><th style="width: 10%;">Prize</th><th style="width: 15%">NP</th><th style="width: 50%">Outcome</th></tr></tbody></table></div>');
			(async() => {
				for (var i = 1; i <= csCount; i++) {
					var res = await playCS(i);
					if (res["status"] === true) {
						$('<tr><td>' + i + '</td><td>' + res["points"] + '</td><td>' + res["np"] + '</td><td>' + res["message"] + '</td></tr>').appendTo("#addrows");
					}
				}
				$('<br><b>Complete!</b><hr>').appendTo("#results_cs");
			})();
		});

		function playCS(count) {
			return new Promise(resolve => {
				setTimeout(() => {
					$.ajax({
						url: "http://www.neopets.com/halloween/process_cocoshy.phtml?coconut=3",
						async: false,
						success: function (result) {
							var stats = result.match(/\d+/g);
							var msg = format_ascii(result.split("error=")[1]);
							resolve({
								"status": true,
								"points": stats[0],
								"np": stats[1],
								"message": msg
							});

						}
					});
				}, 1500);
			});
		}
	})();
	// string: points=0&totalnp=385535&success=0&error=Oi%21+No+more+throws%2C+you%27ve+had+yer+lot.
}

if (url.includes("bagatelle")) {
	(function () {
		if (!$(".content embed").exists()) {
			return false;
		}
		$("center:contains('Jackpot')").find("b:first").next().before('<br><br>No. of games:&nbsp;<input id="numgames_bg" style="width: 50px;" type="number" value="20" min="1" max="20">&nbsp;<input id="play_bg" type="button" value="Play!"><br><br>');
		$("#numgames_bg").on("keyup", function () {
			var v = $(this).val();
			$(this).val(v > 20 ? 20 : v);
		});
		$("#play_bg").on("click", function () {
			if (bgCount < 1 || bgCount > 20) {
				alert("Must be between 1 and 20");
				return false;
			}
			var bgCount = $("#numgames_bg").val();
			$(this).parent().find("embed").hide();
			$(this).prop("disabled", true);
			$('<hr><div id="results_bg" class="autoplayer"><b>Playing ' + bgCount + ' games...</b><br><br><table style="width:50%; text-align:center;"><tbody id="addrows"><tr><th>#</th><th>Slot</th><th>Prize</th><th>NP</th></tr></tbody></table></div>').appendTo($(this).parent());
			(async() => {
				for (var i = 1; i <= bgCount; i++) {
					var res = await playBG(i);
					if (res["status"] === true) {
						$('<tr><td>' + i + '</td><td>' + res["slot"] + '</td><td>' + res["points"] + '</td><td>' + res["np"] + '</td></tr>').appendTo("#addrows");
					}
				}
				$("#results_bg").after('<br><b>Complete!</b><hr>');
			})();
		});

		function playBG(count) {
			return new Promise(resolve => {
				setTimeout(() => {
					$.ajax({
						url: "http://www.neopets.com/halloween/process_bagatelle.phtml",
						async: false,
						success: function (result) {
							var points = result.split("points=")[1].split("&")[0];
							var np = result.split("np=")[1].split("&")[0];
							var slot = calc_slot(result.split("success=")[1].split("&")[0]);
							resolve({
								"status": true,
								"points": points,
								"np": np,
								"slot": slot
							});
						}
					});
				}, 1500);
			});
		}
	})();
	// result = "points=0&totalnp=421962&prize_id=&success=RRRR&error=We+have+a+loser%21";
}

function format_ascii(str) {
	var ascii = str.match(/%../g);
	for (var i = 0; i < ascii.length; i++) {
		var cc = parseInt("0x" + ascii[i].replace("%", ""));
		str = str.replace(ascii[i], String.fromCharCode(cc));
	}
	return str.replace(/\+/g, " ");
}

function calc_slot(string) {
	/*-----------------------------------------------------
	Calculate which slot the ball lands in.

	The XHR returns a 4-letter string with only "L" or "R",
	representing which way the ball bounces each time.

	We evaluate the string as a binary number,
	with L = 1 and R = 0, to get the slot number.
	-----------------------------------------------------*/
	var num = string.replace(/R/g, "0").replace(/L/g, "1").split("");
	var digits = [];
	for (var i = 0; i < 4; i++) {
		digits.push(parseInt(num[i]));
	}
	var binary = parseInt(digits.join("")); // remove leading 0
	return parseInt(binary, 2) + 1;
}
