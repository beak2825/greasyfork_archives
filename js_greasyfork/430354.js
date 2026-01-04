// ==UserScript==
// @name:en     Cloudflare DNS replacer
// @name     Cloudflare DNS replacer
// @version  1
// @grant    none
// @description Can be used to batch replace IP adresses in the Cloudflare DNS panel.

// @match   https://dash.cloudflare.com/*/*/dns
// @namespace https://greasyfork.org/users/218405
// @downloadURL https://update.greasyfork.org/scripts/430354/Cloudflare%20DNS%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/430354/Cloudflare%20DNS%20replacer.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// the guts of this userscript
function main() {
    async function delay(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }

    jQ(function() {
        (async function() {
            while (jQ("[data-testid='dns-table-add-record-button']").length === 0) {
                console.log("Waiting for cloudflare DNS to load...")
                await delay(1000);
            }
            const $button = jQ("<input type='button' value='Batch replace DNS' class='c_fq c_gv c_gw c_gx c_gy c_gz c_ha c_hb c_hc c_hd c_he c_v c_q c_gb c_hf c_hg c_hh c_hi c_hj c_hk c_hl c_dx c_ct c_hm c_hn c_ho c_hp c_hq c_hr c_hs c_eo c_cm c_ht c_hu c_hv c_hw c_u c_hx c_hy c_ap c_hz c_ds c_ia c_bs c_cl c_ax c_ay c_bh c_bi c_fb c_aj c_ib c_dd c_ic c_id c_ie c_if' />");
            $button.click(async function() {
                const IPs = {
                    search: prompt("Enter search IP"),
                    replace: prompt("Enter replacement")
                }
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                let dnsRows = jQ("[data-testid='dns-table-row']").toArray();
                for (let dnsRow of dnsRows) {
                    const $dnsRow = jQ(dnsRow);
                    $dnsRow.click();
                    await delay(1000);
                    const $openRow = $dnsRow.next();
                    const $dnsInput = $openRow.find(`input[value='${IPs.search}']`)
                    if ($dnsInput.length) {
                        nativeInputValueSetter.call($dnsInput.get(0), IPs.replace);
                        var ev = new Event('input', {
                            bubbles: true
                        });
                        $dnsInput.get(0).dispatchEvent(ev);
                        await delay(1000);
                        let saveButton = $openRow.find("[data-testid='dns-record-form-save-button']");
                        jQ(saveButton).click();
                        await delay(1000);
                    }
                }
            });
            jQ("[data-testid='dns-table-add-record-button']").parent().prepend($button);
        })();
    })
}

// load jQuery and execute the main function
addJQuery(main);