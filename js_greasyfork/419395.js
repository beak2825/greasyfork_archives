// ==UserScript==
// @name         Neopets - Premium Toolbar (Beta)
// @namespace    http://tampermonkey.net/
// @version      2021.02.08
// @description  Click the Premium icon to display your bankroll stats
// @author       EatWoolooAsMutton
// @match        http://www.neopets.com/*
// @downloadURL https://update.greasyfork.org/scripts/419395/Neopets%20-%20Premium%20Toolbar%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419395/Neopets%20-%20Premium%20Toolbar%20%28Beta%29.meta.js
// ==/UserScript==

if (typeof jQuery === "undefined") return;

jQuery.fn.exists = function () {
    return this.length > 0
};

// Check if page is new layout
if (!$("[class^='nav-pet-menu-icon']").exists()) {
    return false;
}

const hasPremium = $(".navsub-ssw-icon__2020").exists();
const $premium = $(".nav-top-grid__2020 a[href*='premium']");

if (hasPremium && $premium.exists()) {

    $("[class^='nav-text__']:contains('Premium')").html("Bankroll");

    function getPremiumStats() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type : "GET",
                async : true,
                url : "/premium",
                timeout : 10000,
                dataFilter : data => {
                    const response = $.parseHTML(data);
                    let stats = {};
                    $(response).find(".bankroll-mid p").each(function (index, element) {
                        const html = $(element).html();
                        switch (index) {
                            case 0:
                                stats["total"] = html.split(": ")[1];
                                break;
                            case 1:
                                stats["bank"] = html.split(": ")[1];
                                break;
                            case 2:
                                stats["till"] = html.split(": ")[1];
                                break;
                            case 3:
                                stats["stockQty"] = html;
                                break;
                            case 4:
                                stats["stockPaid"] = html;
                                break;
                            case 5:
                                stats["stockVal"] = html;
                                break;
                            case 6:
                                stats["percent"] = html;
                                break;
                            default:
                            // your pc explodes if you reach here
                        }
                    });
                    resolve(stats);
                },
                error : data => {
                    console.log(data);
                    reject("Request timed out");
                }
            });
        })
    }


    const menuStyle = `
        <style>
            .prem-dropdown {
                position: absolute;
                /*top: calc(100%);
                left: 80%;
                margin-left: -40px;*/
                width: fit-content;
                overflow-x: hidden;
                overflow-y: hidden;
                box-sizing: border-box;
                border-radius: 10px;
                background-color: #f5fdff;
                color: #000000;
                border: 2px solid #e91216;
                display: none;
                font-family: MuseoSansRounded700, Arial, sans-serif;
                padding: 12px;
                text-align: center;
            }
            .prem-dropdown img {
                width: 30px;
                height: 30px;
                vertical-align: middle;
            }
            .prem-dropdown a {
                color: #000000;
            }
            .stockTable {
                margin: auto;
            }
            .stockTable td {
                padding: 3px 8px;
            }
        </style>`;
    $(menuStyle).appendTo("head");

    const loading = `
            <div id="prem-dropdown" class="prem-dropdown" style="display: none;">
                <!--Promise pending-->
                <img alt="Loading..." src="http://images.neopets.com/games/pages/Z8AGM.gif">
                <span style="color: #000000">Getting data...</span>
            </div>`;
    $premium.before(loading);

    const $menu = $("#prem-dropdown");

    // Click method
    let onFirstClick = true;
    $premium.removeAttr("href").on("click", function () {
        reposition();

        if (onFirstClick) {
            (async () => {
                try {
                    const {
                        bank, till, total,
                        stockPaid, stockQty, stockVal, percent
                    } = await getPremiumStats();

                    $menu.html(`
                    <a href="/bank.phtml?type=your" title="Bank Balance">
                        <img src="http://images.neopets.com/premium/portal/images/banktotal-icon.png">
                        <span id="np-bank">&nbsp;${bank}</span>
                    </a>
                    &nbsp;
                    <a href="/market.phtml?type=till" title="Shop Till">
                        <img src="http://images.neopets.com/premium/portal/images/shoptill-icon.png">
                        <span id="np-till">&nbsp;${till}</span>
                    </a>
                    &nbsp;
                    <a href="/inventory.phtml" title="Total NP">
                        <img src="http://images.neopets.com/premium/portal/images/nptotal-icon.png">
                        <span id="np-total">&nbsp;${total}</span>
                    </a>
                    <br><br>
                    <a href="/stockmarket.phtml?type=portfolio" title="Stocks">
                        <table class="stockTable">
                            <tr>
                                <td rowspan="2" style="padding:0"><img src="http://images.neopets.com/premium/portal/images/stocks-positive.svg" style="width: 50px; height: auto;"></td>
                                <td style="color: #808080">Quantity</td>
                                <td style="color: #0064eb">${stockQty}</td>
                                <td style="color: #808080">Paid</td>
                                <td style="color: #0064eb">${stockPaid}</td>
                            </tr>
                            <tr>
                                <td style="color: #808080">Value</td>
                                <td style="color: #0064eb">${stockVal}</td>
                                <td style="color: #808080">Change</td>
                                <td style="color: ${percent.match(/\+/) ? "#008000" : "#ff0000"}">${percent}</td>
                            </tr>
                        </table>
                    </a>
                    <div style="text-align: right; font-size: 80%; color: #0000ff">
                        <a href="/premium"><img src="http://images.neopets.com/premium/portal/images/anchor-star.png" title="Premium Portal"></a>
                    </div>
                    `);
                    reposition();

                } catch (error) {

                    console.log(error.message);
                    $(".prem-dropdown").html(`<span style="color: #ff0000">Request timed out.</span>`);

                } finally {
                    onFirstClick = false;
                }
            })();
        }

        if ($menu.is(":hidden")) {
            $(this).find("[class^='nav-text']").html("Hide");
            $menu.show();
        } else if ($menu.is(":visible")) {
            $(this).find("[class^='nav-text']").html("Bankroll");
            $menu.hide();
        }

    });


    function reposition() {
        const pWidth = parseFloat($premium.css("width")),
            pHeight = parseFloat($premium.css("height")),
            pTop = $premium.position().top,
            pLeft = $premium.position().left,
            toolbarWidth = parseFloat($menu.css("width")),
            top = pHeight + pTop + 5,
            left = pWidth + pLeft - toolbarWidth;

        $menu.css({
            "top" : `${top}px`,
            "left" : `${left}px`
        });
    }

}