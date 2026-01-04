// ==UserScript==
// @name         Torn Extensions - Stock Order
// @namespace    TornExtensions
// @version      2.3
// @description  Helps to order stock for your company.
// @author       Mathiaas [XID 1918010]
// @match        https://www.torn.com/companies.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/382368/Torn%20Extensions%20-%20Stock%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/382368/Torn%20Extensions%20-%20Stock%20Order.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    let APIKey = "YOUR API KEY HERE";

    let targetNode = document.getElementById('stock');
    let config = { childList: true };
    let onItsWay = 0;
	let maxStock = 0;

    let callback = function(mutationsList, observer) {
        console.log("exists: " + $(".custom-stock").length);
        if($(".custom-stock").length >= 1)
            return;
        $(".total-price.bold").after("<div class=\"total-stock-container bold\">Total stock:</span> <span class=\"total-stock\"></span></div><br />");
        $(".total-stock-container").css("padding", "10px 10px 0");
        $(".input-money").change(() => {
            calcStock();
        });
        calcStock();
        let API = `https://api.torn.com/company/?selections=stock,detailed&key=${APIKey}`;
		GM_xmlhttpRequest({
			method: "GET",
			url: API,
			onreadystatechange: (res) => {
				if(res.readyState > 3 && res.status === 200) {
					res = JSON.parse(res.response);
                    console.log(res);
					maxStock = res.company_detailed.upgrades.storage_space;
					let tablehead = "", tablefields = "";
					$.each(res.company_stock, (k, v) => {
						onItsWay += v.on_order;
						tablehead += `<th>${k}</th>`;
						tablefields += `<td><input style="width:75%" data-custom="1" data-name="${k}" value="${localStorage.getItem(k) || 0}" /></td>`;
					});
					$(".total-stock").text((parseInt($(".total-stock").text().replace(",", "")) + onItsWay).toLocaleString("en-US"));
					$(".total-stock").after(`<table class="custom-stock"><tr><th>Total Custom</th>${tablehead}</tr><tr><td id="total-custom">0</td>${tablefields}</tr></table>`);
					calcCustom();
					$(".custom-stock").css("border", "1px solid black").css("margin-top", "5px");
					$(".custom-stock th").css("border", "1px solid black").css("padding", "5px");
					$(".custom-stock td").css("border", "1px solid black").css("padding", "5px");
					$("input[data-custom=\"1\"]").on("change", (i) => {
						if($(i.target).val() == "")
							$(i.target).val(0);
						localStorage.setItem($(i.target).data("name"), $(i.target).val());
						calcCustom();
					});
					$(".order.btn-wrap.silver").after(`<span class="fill btn-wrap silver"><span class="btn"><button class="torn-btn" role="button">FILL CUSTOM</button></span></span>`);
					$(".fill").click(() => {
						if(calcCustom() != 0) {
                            $(".order.btn-wrap.silver").find("button").removeProp("disabled").removeClass("disabled");
                            $(".confirm.btn-wrap.silver").find("button").removeProp("disabled").removeClass("disabled");
							$(".name.bold.t-gray-9.acc-header.t-overflow").each((a, b) => {
								let incoming = 0;
								$("ul.order-list li").each((i, e) => {
									if($(e).text().includes("Delivered"))
										return;
									let name = $(e).find(".name").text();
									if(name == $(b).text().trim()) {
										incoming += parseInt($(e).find(".amount").text().replace(",", "")) || 0;
										console.log("incoming " + incoming + " " + name);
									}
								});
								let product = $(b).text().trim();
								let info = $(b).next(".acc-body");
								let stock = parseInt(info.find(".stock").text().trim().replace(",", "").replace("In Stock:", ""));
								info.find(".input-money").val((localStorage.getItem(product || 0) - (stock + incoming)) > 0 ? localStorage.getItem(product) - (stock + incoming) : "");
								info.find(".input-money").trigger("change");
                            });
                        }
                    });
				} else
                    console.log(`state ${res.readyState} status ${res.status}`);
			},
			onerror: (err) => {
				console.log(err);
			}
        });
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    function calcStock() {
        $(".total-stock").text((parseInt($(".quantity.bold").text().replace(",", "")) + parseInt($(".stock.bold").text().replace(/,/g, "")) + onItsWay).toLocaleString("en-US"));
    }

    function calcCustom() {
		let total = 0;
        $("input[data-custom=\"1\"]").each((i, e) => {
			total += parseInt($(e).val());
		});
		$("#total-custom").text(`${total.toLocaleString("en-US")}/${maxStock.toLocaleString("en-US")}`);
		if(total == maxStock)
			$("#total-custom").css("color", "orange");
		else if(total > maxStock)
			$("#total-custom").css("color", "red");
		else
			$("#total-custom").css("color", "green");
		return total || 0;
	}
})();