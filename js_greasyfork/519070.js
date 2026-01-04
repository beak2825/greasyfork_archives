// ==UserScript==
// @name         atlassian license bulk copy
// @namespace    http://tampermonkey.net/
// @version      2025.06.18.0
// @description  Inserts a textarea with basic license info in csv format for easy export
// @author       gwelch-contegix
// @match        https://my.atlassian.com/product
// @match        https://my.atlassian.com/products/*
// @match        https://www.atlassian.com/purchase/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519070/atlassian%20license%20bulk%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/519070/atlassian%20license%20bulk%20copy.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function printlicense(n) {
        let name = n
            .childNodes[1]
            .textContent.trim()
            .replaceAll(",", "")
        if (name.indexOf('Cloud') >= 0) {
            window.TSX_license_count -= 1;
            return;
        }
        try {
            let lic = n.nextElementSibling
            console.log("printing", n.childNodes[1].textContent.trim().replaceAll(",", ""));
            if (
                lic.querySelector("*[data-cy=mac-expanded-account-name] span") == null ||
                (lic.querySelector("*[data-cy=actions-section-upgrade-button]") == null && !name.startsWith("Bamboo (Data Center)")) ||
                lic.querySelector("*[data-cy=mac-sen-details]") == null
            ) {
                console.log("Elements not found:", lic.querySelector("*[data-cy=mac-expanded-account-name] span"), lic.querySelector("*[data-cy=actions-section-upgrade-button]"), lic.querySelector("*[data-cy=mac-sen-details]"));
                setTimeout(printlicense, 1000, n)
                return
            }

            function getLicenseCountAndPluginName(name) {
                let split_name = name.split(" ")
                let data = split_name.indexOf("(Data")
                var app_name = ""
                if (split_name[data + 1] == "Center)") {
                    let plugin = split_name.lastIndexOf("for", data)
                    if (plugin < 0) {
                        app_name = split_name.slice(0, data).join(" ")
                    } else {
                        app_name = split_name[plugin + 1]
                    }
                }
                var license_count_index = split_name.lastIndexOf("Users:") - 1
                var license_count = ""
                if (license_count_index > 0) {
                    license_count = split_name.at(license_count_index)
                } else {
                    license_count_index = split_name.lastIndexOf("Agents:") - 1
                    if (license_count_index > 0) {
                        license_count = split_name.at(license_count_index)
                        if (license_count == "Remote") {
                            license_count = split_name.at(license_count_index - 1)
                        }
                    }
                }
                return [app_name, license_count]
            }
            let sen = lic.querySelector("*[data-cy=mac-sen-details] > div > span").textContent.trim().replaceAll(",", "")
            let org = lic
                .querySelector("*[data-cy=mac-expanded-account-name] > div > span").childNodes[0]
                .textContent.trim()
                .replaceAll(",", "")

            let expiry = n
                .querySelector(`*[data-cy=license-collapsed-row-expiration-date-${sen.slice(4)}]`)
                .textContent.trim()
                .replaceAll(",", "")
            var product_key = "";
            var license = "";
            if (name.indexOf('Cloud') == -1) {
                if (name.startsWith("Bamboo (Data Center)")) {
                    product_key = 'pricingplan.bamboo-data-center'
                } else {
                    let url = new URL(lic.querySelector('*[data-cy=actions-section-upgrade-button]').getAttribute('href'));
                    product_key = url.searchParams.get('productKey');
                }
                license = lic
                    .querySelector("textarea")
                    .value.trim()
                    .replaceAll(",", "");
            }
            if (product_key.endsWith(".data-center") || product_key.endsWith("-data-center")) {
                product_key = product_key.slice(0, -12)
            }
            if (product_key.startsWith("pricingplan.")) {
                product_key = product_key.slice(12)
            }
            let [app_name, license_count] = getLicenseCountAndPluginName(name)
            let line =
                `${license_count},${org},${name},${app_name},${product_key},${expiry},${sen},${license}`.replaceAll("\n", "");
            document.getElementById("tsx-csv").value += line + "\n"
            console.log(line)
        } catch (ex) {
            notify("Failed to get license info for " + n.childNodes[1].textContent.trim().replaceAll(",", ""), 10000, true);
        }
        window.TSX_license_count -= 1;
    }

    function notify(message, time, center = false) {
        var popup = document.createElement('div');
        popup.innerText = message;

        popup.style.position = "fixed";
        if (center) {
            popup.style.bottom = "50%";
            popup.style.right = "50%";
        } else {
            popup.style.bottom = "0%";
            popup.style.right = "0%";
        }
        popup.style.backgroundColor = "red";
        popup.style.padding = "10px";
        popup.style.border = "1px solid black";
        popup.style.zIndex = "1000";

        document.body.appendChild(popup)

        // Hide the popup after a delay (e.g., 3 seconds)
        setTimeout(function() {
            popup.remove();
        }, time)
    }

    function licenseDone() {
        if (window.TSX_license_count > 0) {
            console.log("waiting for csv to complete " + window.TSX_license_count)
            notify(
                "waiting for csv to complete " + window.TSX_license_count + " left",
                1050,
            )
            setTimeout(licenseDone, 1000)
            return
        }
        console.log("csv is done")
        notify("csv is done", 5000, true)
        let d = document.getElementById("tsx-div")
        let p = document.createElement("p")
        p.textContent = "csv is done"
        d.appendChild(p)
    }

    function click(n) {
        n.querySelector("span").click()
    }

    function download(file, text) {
        let element = document.createElement("a")
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(text),
        )
        element.setAttribute("download", file)
        document.body.appendChild(element)
        element.click()

        document.body.removeChild(element)
    }

    function getlicenses() {
        var wait = 0
        for (let name of document
                .querySelectorAll(
                    "tr:has(td.LicensesCollapsedRow__Cell-sc-1hqm79z-0)",
                )
                .values()
                .toArray()
                .reverse()) {
            if (name.checkVisibility()) {
                window.TSX_license_count += 1
                if (window.TSX_license_count % 2 == 0) {
                    wait += 1000
                }
                setTimeout(click, 1200 * window.TSX_license_count, name)
                printlicense(name)
            }
        }
        licenseDone()
    }

    function installForm() {
        let form = document.querySelector(
            "div.styledComponents__StyledLinksWrapper-sc-balsup-29:has(> button)",
        )
        console.log(form);
        let div = document.createElement("div")
        div.id = "tsx-div"
        let csv = document.createElement("textarea")
        let btnGetLicenses = document.createElement("button")
        let btnDownloadCSV = document.createElement("button")
        csv.id = "tsx-csv"
        csv.value = "license_count,owner,app,app_name,product_key,expiry,sen,license\n"
        csv.style.display = "block"
        csv.style.width = "100%";
        div.style.margin = "0px 6px 0 0";
        btnGetLicenses.textContent = "Get Licenses"
        btnGetLicenses.addEventListener("click", getlicenses)
        btnDownloadCSV.textContent = "download csv"
        btnDownloadCSV.addEventListener("click", function(e) {
            download("licenses.csv", csv.value)
        })
        div.appendChild(csv)
        div.appendChild(btnGetLicenses)
        div.appendChild(btnDownloadCSV)
        form.after(div)
        window.TSX_license_count = 0
    }

    function wait_for_load(mutationList, observer) {
        var foundNode = null;
        var target = null;
        for (const mutation of mutationList) {
            for (var node of mutation.addedNodes) {
                if (node.querySelector('div.styledComponents__StyledLinksWrapper-sc-balsup-29:has(> button)') != null) {
                    foundNode = node;
                    target = mutation.target;
                }
            }
        }

        if (foundNode == null) {
            return;
        }
        installForm();
    }
    let sd_init_observer = new MutationObserver(wait_for_load);
    if (document.querySelector('div.styledComponents__StyledLinksWrapper-sc-balsup-29:has(> button)') != null) {
        installForm();
    } else {
        sd_init_observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})()