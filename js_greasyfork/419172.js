// ==UserScript==
// @name         Neopets - Bank improvements for Beta
// @namespace    np
// @version      2020.12.30
// @description  Various improvements to shop till and bank, including a bank interest calculator.
// @author       x
// @include      http://www.neopets.com/market.phtml?type=till
// @include      http://www.neopets.com/bank.phtml*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/419172/Neopets%20-%20Bank%20improvements%20for%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/419172/Neopets%20-%20Bank%20improvements%20for%20Beta.meta.js
// ==/UserScript==

/************************************************************************
 * Removed @require jQuery.
 * This lets us use $(document).ajaxSuccess without needing unsafeWindow.
 * As of 2020-12-25, neopets beta is using jQuery v3.4.1;
 * the version number can be checked in console with $().jquery
 ************************************************************************/

if (!GM_getValue) {
    GM_getValue = (key, val) => localStorage[key] || val;
    GM_setValue = (key, val) => localStorage[key] = val;
}

if (!GM_getValue("config")) {
    let config = {
        deposit : 0,
        withdraw : 0,
        calc_visible : true
    };
    GM_setValue("config", config);
}
let config = GM_getValue("config");

//-----------------------------------------------------------------------

const url = location.href;
const isBeta = $("[class^='nav-pet-menu-icon']").length > 0;

if (url.includes("bank") && isBeta) {
    const np = $("#npanchor").text().replace(/,/g, "");
    const bank = $("#txtCurrentBalance1").text().replace(/[^\d]/g, "");

    $("#frmDeposit :input[name='amount']").val(config.deposit || np);
    $("#frmWithdraw :input[name='amount']").val(config.withdraw || bank);
    $("#frmUpgradeAccount :input[name='amount']").val(np);

    $("#frmWithdraw").on("submit", function () {
        const amtWithdraw = $("#frmWithdraw :input[name='amount']").val();
        if (amtWithdraw !== 0 && !amtWithdraw.match(/[^\d]/g)) {
            config.withdraw = amtWithdraw;
            GM_setValue("config", config);
        }
    });

    $("h2:contains('Interest')").parent().parent().after(`
<!--Bank interest calculator userscript-->
<style>.interest-div {margin: 3px auto;} .interest-number {height: 30px; width:100px; border: 1px solid #58250d; border-radius: 5px; font-family:'MuseoSansRounded700', 'Arial', sans-serif; margin-right:10px;}</style>
<div class="bank-upgrade bank-section-container">
    <div id="hide-calculator" class="bank-upgrade-header bank-backing-header bank-backing-t4" title="Click to hide" style="cursor: pointer;">
        <h2>Interest Calculator</h2>
    </div>
    <div class="bank-upgrade-body bank-backing-marble" style="display: ${config.calc_visible ? "" : "none"}">
        <div id="interest-calculator">
            <table style="width:60%; border-spacing:0; margin-left:auto; margin-right:auto; padding:10px;">
                <tbody>
                <tr>
                    <td style="text-align:right;">
                        <div class="bank-account-level interest-div">
                            <span class="bank-text-bold">Account Level:</span>
                        </div>
                    </td>
                    <td>
                        <div class="bank-account-level interest-div">
                            <select name="account_type" id="interest-account-type" style="width:250px;">
                                <option value="0.045">Junior Saver (4.5%)</option>
                                <option value="0.055">Neopian Student (5.5%)</option>
                                <option value="0.06">Bronze Saver (6.0%)</option>
                                <option value="0.065">Silver Saver (6.5%)</option>
                                <option value="0.07">Super Gold Plus (7.0%)</option>
                                <option value="0.075">Platinum Extra (7.5%)</option>
                                <option value="0.08">Double Platinum (8.0%)</option>
                                <option value="0.085">Triple Platinum (8.5%)</option>
                                <option value="0.09">Diamond Deposit (9.0%)</option>
                                <option value="0.095">Diamond Deposit Plus (9.5%)</option>
                                <option value="0.10">Diamond Deposit Gold (10.0%)</option>
                                <option value="0.105">Millionaire Platinum (10.5%)</option>
                                <option value="0.11">Millionaire Double Platinum (11.0%)</option>
                                <option value="0.115">Millionaire Mega-Platinum (11.5%)</option>
                                <option value="0.12">Neopian Mega-Riches (12.0%)</option>
                                <option value="0.125" selected>Ultimate Riches! (12.5%)</option>
                            </select>
                        </div>
                    </td>
                </tr>
                <tr style="height: 38px">
                    <td style="text-align:right;">
                        <div class="bank-add-deposit interest-div">
                            <span class="bank-text-bold bank-adddeposit-text">Battleground boon:</span>
                        </div>
                    </td>
                    <td>
                        <div class="bank-add-deposit interest-div">
                            <label for="boon-enabled" class="bank-text-bold">
                                <input type="checkbox" id="boon-enabled">
                                (+3%)
                            </label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="text-align:right;">
                        <div class="bank-add-deposit interest-div">
                            <span class="bank-text-bold bank-adddeposit-text">Daily interest:</span>
                        </div>
                    </td>
                    <td>
                        <div class="bank-add-deposit interest-div">
                            <input class="interest-number" type="text" id="daily-interest" size="10" maxlength="6">
                            <span class="bank-text-bold">NP</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="text-align:right;">
                        <div class="bank-add-deposit interest-div">
                            <span class="bank-text-bold bank-adddeposit-text">Account balance:</span>
                        </div>
                    </td>
                    <td>
                        <div class="bank-add-deposit interest-div">
                            <input class="interest-number" type="text" id="acc-balance" size="10" maxlength="10">
                            <span class="bank-text-bold">NP</span>
                        </div>
                    </td>
                    </td>
                </tr>
                </tbody>
            </table>
            <!--input class="button-default__2020 button-yellow__2020 btn-single__2020" type="submit" style="margin: 3px auto; padding: 2px 5px 7px 5px !important;" value="Calculate"-->
        </div>
    </div>
</div>
<!--End of userscript-->`);

    $("#hide-calculator").on("click", function () {
        const $hideArea = $(this).next();
        if ($hideArea.is(":visible")) {
            $hideArea.hide(200);
            config.calc_visible = false;
        } else {
            $hideArea.show(200);
            config.calc_visible = true;
        }
        GM_setValue("config", config);
    });

    /********************************************************
     * --- Calculator ---
     *
     * You can type in "k", "m", and "b" to instantly insert
     * 3, 6 and 9 zeroes respectively.
     *
     * Example: type 22.5k to instantly input 22500,
     * 35.55m to instantly input 35550000.
     *
     * Since the maximum amount of NP in the bank right now
     * is 2,147,483,647 the feature above will not convert
     * bank balance amounts above this limit.
     ********************************************************/

        // Initial values
    const interestRate = 0.01 * parseFloat($("#txtAnnualInterestRate").find("b").html());
    $("#interest-account-type").val(interestRate.toString());
    $("#acc-balance").val(bank);
    $("#daily-interest").val(Math.ceil(bank * interestRate / 365));

    const validateInput = input => !input.match(/[^\d]+/g);
    const validateLength = (input, length) => input.length <= length;

    $("#interest-account-type").on("change", function() {
        const newInterestRate = parseFloat(this.value);
        const bankBal = $("#acc-balance").val();
        $("#daily-interest").val(Math.ceil(bankBal * newInterestRate / 365));
    });

    $("#boon-enabled").on("change", function (e) {
        const checked = e.target.checked;
        const interestRate = parseFloat($("#interest-account-type").val());
        const bankBal = $("#acc-balance").val();
        const newDailyInterest = checked ?
            Math.ceil(bankBal * (interestRate + 0.03) / 365) :
            Math.ceil(bankBal * interestRate / 365);
        $("#daily-interest").val(newDailyInterest);
    });

    $("#daily-interest").on("input", function (e) {
        const key = e.originalEvent.data;
        let newVal;
        if (key === "k") {
            newVal = (parseFloat(this.value) * 1000).toString();
            this.value = validateLength(newVal, 6) ? newVal : this.value;
        }
        const daily = this.value;
        if (validateInput(daily)) {
            const newBal = daily === "" ? "" : Math.floor(daily * 365 / interestRate);
            $("#acc-balance").val(newBal);
        }
    });

    $("#acc-balance").on("input", function (e) {
        const key = e.originalEvent.data;
        let newVal;
        if (key === "k") {
            newVal = (parseFloat(this.value) * 1000).toString();
            this.value = validateLength(newVal, 10) ? newVal : this.value;
        }
        if (key === "m") {
            newVal = (parseFloat(this.value) * 1000000).toString();
            this.value = validateLength(newVal, 10) ? newVal : this.value;
        }
        if (key === "b") {
            newVal = (parseFloat(this.value) * 1000000000).toString();
            this.value = validateLength(newVal, 10) ? newVal : this.value;
        }
        const bal = this.value;
        if (validateInput(bal)) {
            const newDaily = bal === "" ? "" : Math.ceil(bal * interestRate / 365);
            $("#daily-interest").val(newDaily);
        }
    });

    /*
        <div id="bankInterestDailyWrapper">
			<div class="bank-interest-daily">
				<div id="txtDailyInterest" class="bank-interest-daily-text bank-text-bold">
				    Daily Interest: 33,909 NP
				</div>
				<form action="/np-templates/ajax/process_bank.php" method="post" id="frmCollectInterest" onsubmit="return one_submit();">
					<input type="hidden" name="type" value="interest">
					<input type="hidden" name="_ref_ck" value="e3d2c0afd96f354377d62ac96d1319a7">
					<input class="bank-interest-btn button-default__2020 button-yellow__2020" type="submit" value="Collect Interest">
				</form>
			</div>
		</div>
     */

    // prevent input while xhr is sending
    $(document).ajaxStart(function () {
        $("#interest-account-type").prop("disabled", true);
        $("#boon-enabled").prop("disabled", true);
        $("#daily-interest").prop("disabled", true);
        $("#acc-balance").prop("disabled", true);
    });

    // Auto-update the calculator values after a deposit/withdrawal or collecting interest.
    $(document).ajaxSuccess(function (event, xhr, settings) {
        // for collecting interest, the xhr completes before the bank balance is updated,
        // so we read the response data instead

        try {
            const response = JSON.parse(xhr.responseText);
            // check that this xhr is related to bank updating
            if (response["final_balance"] || response["new_balance"]) {
                const updatedBal = parseInt(response["final_balance"]) || response["new_balance"];
                const updatedInterestRate = 0.01 * parseFloat($("#txtAnnualInterestRate").find("b").html());
                const updatedDaily = Math.ceil(updatedBal * updatedInterestRate / 365);
                $("#daily-interest").val(updatedDaily);
                $("#acc-balance").val(updatedBal);
            }
        } catch (e) {
            // response probably isn't in JSON format
            // ie - not related to bank xhr
        }

        // re-enable calculator
        $("#interest-account-type").prop("disabled", false);
        $("#boon-enabled").prop("disabled", false);
        $("#daily-interest").prop("disabled", false);
        $("#acc-balance").prop("disabled", false);
    });

}

/*
if (url.includes("till")) {
    const till = $("p:contains('You currently have')").find("b").text().replace(/[^\d]/g, "");
    if (till !== "0") {
        $("form[action='process_market.phtml']").find("input[name='amount']").val(till);
    }
}
*/