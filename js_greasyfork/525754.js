// ==UserScript==
// @name         Quick-Trade-Fill-Cash
// @version      0.1.1
// @description  Instantly fills trade with your cash on hand. You're responsible for the consequences if it fails. Quick and dirty script.
// @author       Fuck knows
// @match        https://www.torn.com/trade.php*
// @run-at 		 document-end
// @namespace https://greasyfork.org/users/1430907
// @downloadURL https://update.greasyfork.org/scripts/525754/Quick-Trade-Fill-Cash.user.js
// @updateURL https://update.greasyfork.org/scripts/525754/Quick-Trade-Fill-Cash.meta.js
// ==/UserScript==

const kw_qtfc_callback = async () => {
	if (!document.location.hash.includes("step=addmoney"))
		return console.log("kw--qtfc: Exiting due to incorrect page");
	const addMoneyToTradeRequest = (rfcv, id, amount) =>
		fetch(`https://www.torn.com/trade.php?rfcv=${rfcv}`, {
			method: "POST",
			body: new URLSearchParams([
				["step", "view"],
				["ID", id],
				["inserter", Math.round(Math.random() * 1000000000)],
				["ajax", true],
				["amount", amount],
				["sub_step", "addmoney2"],
			]).toString(),
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
	const getFullMoneyRequest = (rfcv, id) =>
		fetch(`https://www.torn.com/trade.php?step=getFullMoney&ID=${id}&rfcv=${rfcv}`, {
			headers: {
				"X-Requested-With": "XMLHttpRequest",
			},
		})
			.then((r) => r.text())
			.then((t) => parseInt(t.replaceAll(",", "")));
	const addButton = () =>
		$("button#kw--qtfc-fill-cash").length ||
		$("<button>")
			.attr("id", "kw--qtfc-fill-cash")
			.text("Prepare for balance change")
			.css("padding", "1rem 2rem")
			.css("height", "auto")
			.css("font-size", "1.5rem")
			.css("margin", "1rem 0")
			.addClass("torn-btn")
			.on("click", buttonCallback)
			.insertAfter("div.add-money form");

	const buttonCallback = async () => {
		const balanceElement = $("div#trade-container span.money-value");
		$("#kw--qtfc-fill-cash")
			.prop("disabled", true)
			.text(`Waiting for balance change from \$${balanceElement.text()}, please wait...`);
		const currentBalance = parseInt(balanceElement.text().replaceAll(",", ""));
		const currentMax = await getFullMoneyRequest(getRfcv(), getId());
		const amountInTrade = currentMax - currentBalance;

		const newBalance = parseInt(await readyPromise(balanceElement, currentBalance));
		const total = newBalance + amountInTrade;
		console.log({ currentBalance, amountInTrade, currentMax, newBalance });
		if (isNaN(newBalance)) {
			$("#kw--qtfc-fill-cash").text("Error: Balance not found, try the old fashioned way");
			return;
		}
		$("#kw--qtfc-fill-cash")
			.text(`ADD ${total} TO TRADE`)
			.removeProp("disabled")
			.on("click", () =>
				addMoneyToTradeRequest(getRfcv(), getId(), total).then((r) =>
					r.ok ? alert(`Added $${total} to trade`) : alert("Error: " + r.status)
				)
			);
	};

	const readyPromise = (balanceElement, currentBalance) =>
		new Promise((resolve) => {
			const observer = new MutationObserver(() => {
				if (balanceElement.text() !== currentBalance) {
					observer.disconnect();
					resolve(balanceElement.text().replaceAll(",", ""));
				}
			});
			observer.observe(balanceElement[0], { childList: true });
		});

	const getRfcv = () => {
		const cookies = document.cookie.split("; ");
		const rfcv = cookies.find((cookie) => cookie.startsWith("rfc_v="));
		return rfcv ? rfcv.split("=")[1] : null;
	};
	const getId = () => {
		const params = new URLSearchParams(document.location.hash.slice(1));
		return params.get("ID");
	};

	const mut = new MutationObserver(() => {
		if ($?.("div.add-money form").length) {
			addButton();
			mut.disconnect();
		}
	});
	mut.observe(document.body, { childList: true, subtree: true });
};

window.addEventListener("hashchange", kw_qtfc_callback);
kw_qtfc_callback();
