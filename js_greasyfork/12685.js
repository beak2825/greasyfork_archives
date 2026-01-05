// ==UserScript==
// @name         CS:GO Prizes Ticket Farm - user's version
// @version      1.2
// @description  If you are so lazy you can use this script to farm tickets)
// @author       SADAVA
// @match        http://csgoprizes.com/get-tickets
// @grant        unsafeWindow
// @namespace    http://sadava.pw/csgoprizehack_auto.js
// @downloadURL https://update.greasyfork.org/scripts/12685/CS%3AGO%20Prizes%20Ticket%20Farm%20-%20user%27s%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/12685/CS%3AGO%20Prizes%20Ticket%20Farm%20-%20user%27s%20version.meta.js
// ==/UserScript==
try {
	! function (e) {
		e(function () {
			function e(e) {
				return 10 > e && (e = "0" + e), e
			}

			function t(e) {
				return o(1) + e + "</div>"
			}

			function o(e) {
				return 0 == e ? "<div style='float: left;'>" : "<div style='float: right;'>"
			}

			function n() {
				return x = new Date(1970, 0, 1), x.setSeconds((new Date).getTime() / 1e3), x.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
			}

			function r() {
				var t = new Date,
					o = e(t.getHours()),
					n = e(t.getMinutes()),
					r = e(t.getSeconds());
				return "Local time: <b>" + o + ":" + n + ":" + r + "</b>"
			}
			var c = n() + " | +0<br>",
				i = "<b>Ticket Farm Script</b> v1.3 by <b>2015 &copy; SADAVA</b> for gamers. <b>Free to use</b>, log time in GMT+0<br><br>",
				a = "No tickets received jet.";
			document.title = a, document.body.innerHTML = "", document.body.style.padding = "20px", setInterval(function () {
				jQuery.ajax({
					url: "http://csgoprizes.com/wp-admin/admin-ajax.php",
					async: !0,
					type: "post",
					data: {
						action: "ajouterTicket"
					},
					success: function (e) {
						"ticket_not_added" != e && (document.title = "Your tickets : " + e) && (a = "Your current tickets : <b>" + e + "</b>") && (c = n() + " | +3<br>" + c) && (e = "Yay! Your new tickets is " + e) || (e = "Ticket not added."), document.body.innerHTML = o(0) + i + a + "<br><br>Status: <b>" + e + "</b><br>" + r() + "</div>" + t(c)
					}
				})
			}, 1e3)
		})
	}(jQuery)
} catch (e) {
	console.error("Cannot start CP-FARM..."), e.message && e.stack ? (console.error("ERROR: " + e.message), console.log(e.stack.replace(/(\\(eval at )?<anonymous>[: ]?)|([\s.]*at TM_mEval[\s\S.]*)/g, ""))) : console.error(e), document.querySelectorAll(".cf-browser-verification").length > 0 ? (console.log("Cloudflare Anti-DDOS Security, waiting..."), document.title = "DDOS Security") : (console.log("Reloading..."), document.title = "Error, reloading...", window.location.reload())
}