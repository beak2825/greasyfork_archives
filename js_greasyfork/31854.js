// ==UserScript==
// @name         Enhanced Barter
// @icon         https://bartervg.com/imgs/ico/barter/favicon-32x32.png
// @namespace    Revadike
// @author       Revadike
// @version      1.4.2
// @description  This userscript aims to enhance your experience at barter.vg
// @match        https://barter.vg/*
// @match        https://wwww.barter.vg/*
// @connect      barter.vg
// @connect      bartervg.com
// @connect      gg.deals
// @connect      steam-tracker.com
// @connect      steamcommunity.com
// @connect      steamtrades.com
// @connect      store.steampowered.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.4.4/fuse.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/history.js/1.8/bundled-uncompressed/html4+html5/jquery.history.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/13.1.5/nouislider.min.js
// @resource     noUiSliderCss https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/13.1.5/nouislider.min.css
// @homepageURL  https://github.com/Revadike/EnhancedBarter/
// @supportURL   https://github.com/Revadike/EnhancedBarter/issues
// @downloadURL https://update.greasyfork.org/scripts/31854/Enhanced%20Barter.user.js
// @updateURL https://update.greasyfork.org/scripts/31854/Enhanced%20Barter.meta.js
// ==/UserScript==

// ==Linting==
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable init-declarations */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
/* eslint-disable no-empty-function */
/* eslint-disable no-loop-func */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undefined */
/* eslint-disable no-use-before-define */
// ==/Linting==

// ==Code==

const requests = [];
const requestRateLimit = 200;
let myuid;
let mysid;
let streps;
let usergroups;
let itemnames;

function init() {
    setTimeout(initBarter, 0);
}

function initBarter() {
    setInterval(handleRequests, requestRateLimit);

    $.fn.serializeObject = serializeObject;
    // $.ajaxSetup({
    //     "beforeSend": (xhr, options) => {
    //         showSpinner(options.url);

    //         xhr.url = options.url;
    //         const request = () => {
    //             options.beforeSend = (x, o) => x.url = o.url;
    //             $.ajax(options);
    //         };

    //         requests.push(request);
    //     },
    //     "complete": (xhr) => hideSpinner(xhr.url)
    // });
    $.post = jqueryPost;

    unsafeWindow.$ = $;
    unsafeWindow.syncLibrary = syncLibrary;
    unsafeWindow.sendAutomatedOffers = sendAutomatedOffers;
    $(document).ready(barterReady);
}

function barterReady() {
    console.log("[Enhanced Barter] Enhancing");

    // Every barter page
    setTimeout(ajaxify, 0);
    GM_addStyle(GM_getResourceText("noUiSliderCss"));
    GM_addStyle(stylesheet);

    $("#bc li.collapse:last").before(`<li class="collapse" title="${GM_info.script.name} (${GM_info.script.version}) by ${GM_info.script.author}">
        <a target="_blank" href="https://github.com/Revadike/EnhancedBarter/">
            <span>&#129302;&#xFE0E;</span>${GM_info.script.name}
        </a>
    </li>`);

    $(".sortBy").after(`<div id="filtercontainer">
        <span class="activityIcon normal gray">¶</span> Filter by
        <input id="filterBy" type="text" placeholder="Search in displayed rows..." style="width: 530px;">
    </div>`);
    $("#filtercontainer").attr("class", $(".sortBy").attr("class"));
    $("#filterBy").on("change keyup paste", filterRows);

    streps = GM_getValue("stReps", {});
    $("a:has(>[alt=\"Steam Trades icon\"])").get()
        .forEach(addSteamTradesRep);

    if ($("#q").length > 0) {
        itemnames = GM_getValue("itemnames", {});
        addAutoComplete();
    }

    usergroups = GM_getValue("usergroups", {});

    $("[title=\"Steam store page\"], [title=\"Steam community page\"]").get()
        .forEach((elem) => {
            let [type, id] = elem.href.match(/(sub|app)\/\d+/g)[0].split("/");
            $(elem).parent()
                .prepend(`
                <span class="tag">
                    <a style="cursor: pointer;" id="ggdeals_${id}">
                        <img src="https://bartervg.com/imgs/ico/gg.png" width="18" height="18" title="GG.Deals: Click to load price info!">
                    </a>
                    <small id="ggdeals_${id}_after"></small>
                </span>`);
            $(`[id="ggdeals_${id}"]`).click(() => request({
                "method": "GET",
                "url":    `https://gg.deals/steam/${type}/${id}`,
                "onload": (response) => {
                    let parser = new DOMParser();
                    let body = parser.parseFromString(response.responseText, "text/html");
                    let price = $("#game-header-current-prices .price", body).get()
                        .map((t) => t.innerText)
                        .join(" / ");
                    $(`[id="ggdeals_${id}_after"]`).html(` (<a href="https://gg.deals/steam/${type}/${id}" title="GG.Deals current lowest price (Official Stores / Keyshops)">${price}</a>)`);
                },
            }));
        });
    
    let tempI = 0;
    $(".matchcol li a[href*='barter.vg/i/']").get()
        .forEach((elem) => {

        let barterId = elem.href.match(/vg\/i\/\d+/g)[0].split("/")[2];
        let spanId = barterId + "_" + tempI

        $(elem).parent()
            .prepend(`
                <span class="tag">
                    <a style="cursor: pointer;" id="ggdeals_${spanId}">
                        <img src="https://bartervg.com/imgs/ico/gg.png" width="18" height="18" title="GG.Deals: Click to load price info!">
                    </a>
                    <small id="ggdeals_${barterId}_after"></small>
                </span>`);
        $(`[id="ggdeals_${spanId}"]`).click(async () => {
                // inform user as this can take a bit with calls to barter
                $(`[id="ggdeals_${barterId}_after"]`).text(`Loading price, please wait`);
                // Perform calls to barter and ggdeals
                let barterItem = await getBarterItemInfo(barterId);
                let type = barterItem.source_profile.includes("app") ? "app" : "sub";
                let id = barterItem.sku;
                return request({
                    "method": "GET",
                    "url":    `https://gg.deals/steam/${type}/${id}`,
                    "onload": (response) => {
                        let parser = new DOMParser();
                        let body = parser.parseFromString(response.responseText, "text/html");
                        let price = $("#game-header-current-prices .price", body).get()
                        .map((t) => t.innerText)
                        .join(" / ");
                        $(`[id="ggdeals_${barterId}_after"]`).html(` (<a href="https://gg.deals/steam/${type}/${id}" title="GG.Deals current lowest price (Official Stores / Keyshops)">${price}</a>)`);
                    },
                });
        });
        tempI++;
    });

    // The match page and user profile page
    $("#tradeUser [label=Groups] option, [name=group] option").get()
        .forEach((elem) => {
            const id = Math.abs(elem.value);
            const offset = 64; // Char code offset
            const name = usergroups[id >= offset ? id - offset : id];
            if (!name) {
                return;
            }

            elem.innerText = `${elem.innerText} : ${name}`;
        });

    const cats = ["trade", "wish"];
    const sortings = {};
    cats.forEach((cat) => {
        sortings[cat] = {};
        sortings[cat].az = $(`select#${cat}Game option`).get();

        const initial = sortings[cat].az.shift();
        sortings[cat]["90"] = [...sortings[cat].az].sort((a, b) => parseInt(b.innerText.split(" (").pop()
            .replace(")", "")) - parseInt(a.innerText.split(" (").pop()
            .replace(")", "")));

        $(`select#${cat}Game`).after(`
            <div id="${cat}Sort" style="display: inline;">
                <label> Sorted by </label>
                <a data-sort="az" data-selected="1" style="text-decoration: none; font-weight: bold; color: inherit;">A-Z</a>
                <label>/</label>
                <a data-sort="90" data-selected="0" style="cursor: pointer;">9-0</a>
            </div>
        `);

        $(`#${cat}Sort [data-sort]`).click((event) => {
            $(`#${cat}Sort [data-selected="1"]`).attr("data-selected", 0)
                .attr("style", "cursor: pointer;");
            $(event.target).attr("data-selected", 1)
                .attr("style", "text-decoration: none; font-weight: bold; color: inherit;");

            const sortby = $(event.target).data("sort");
            console.log(sortings[cat][sortby][0]);
            $(`select#${cat}Game`).html([initial, ...sortings[cat][sortby]])
                .val(0);
        });
    });

    // Any bundle page
    if ($("[accesskey=\"b\"]").parent()
        .hasClass("nav-sel")) {
        $(".warnings").append(`<li style="float: right">
            <input id="togglebtn" onsubmit="void(0)" value="Hide/Show" type="button" class="addTo offer bold pborder">
        </li>
        <li style="float: right">
            <select id="toggleselect" title="Select which items you want to hide or show" class="pborderHover">
                <option value="[type=checkbox]:checked">Selected</option>
                <option value=".blist">Blacklist</option>
                <option value=".trad">Tradables</option>
                <option value=".wish">Wishlist</option>
                <option value=".libr">Library</option>
            </select>
        </li>`);

        $("#togglebtn").click(toggleBundleItems);
    }

    // The creating offer page
    $("[name=remove_offer_items]").val("－ Remove Selected")
        .css("width", "23.8%")
        .css("margin-left", "-4px")
        .removeClass("extraLeft")
        .after("<input type=\"button\" value=\"◧ Invert Selection\" style=\"width: 23.8%; margin-left: 0.5%\" class=\"checkall addTo bborder\" onsubmit=\"void(0)\"><input type=\"button\" value=\"&#128275;&#xFE0E; Enable Locked\" style=\"width: 23.8%; margin-left: 0.5%\" class=\"enableall addTo oborder\" onsubmit=\"void(0)\">");
    $("[name=add_to_offer]").val("+ Add Selected")
        .css("width", "23.8%")
        .css("margin-right", "0.5%");

    $(".checkall").click(checkAllTradables);
    $(".enableall").click(enableAllTradables);

    // Every next barter page will have the sign out link
    if ($("#signin").length === 0 || $("abbr+ a:has(.icon)").length === 0) {
        return;
    }

    myuid = $("#signin").attr("href")
        .split("/")[4];
    mysid = $("abbr+ a:has(.icon)").attr("href")
        .split("/")[4];

    // Every next barter page will be on /u/myuid/
    if (!$("h1 > a").is(`[href*="/u/${myuid}"]`)) {
        return;
    }

    // The library page
    if ($("[accesskey=\"l\"]").parent()
        .hasClass("nav-sel")) {
        $("[name=\"sync_list\"]").after("<input type=\"button\" title=\"Sync ALL owned games and DLC\" value=\"↻ Comprehensive Sync with Steam\" style=\"margin-left: 0.5%\" id=\"libsync\" class=\"addTo gborder\" onsubmit=\"void(0)\">");
        $("#libsync").click(clickLibSyncBtn);
    }

    // The settings page
    if ($(".preferences").length > 0) {
        $("#offer").before(`<div id="groups">
            <h3 class="listName sborder">&#x1F46A;&#xFE0E; User Group Names</h3>
            <p>
                <select name="groupid">
                    <option value="1">A</option>
                    <option value="2">B</option>
                    <option value="3">C</option>
                    <option value="4">D</option>
                    <option value="5">E</option>
                    <option value="6">F</option>
                    <option value="7">G</option>
                    <option value="8">H</option>
                    <option value="9">I</option>
                    <option value="10">J</option>
                    <option value="11">K</option>
                    <option value="12">L</option>
                    <option value="13">M</option>
                    <option value="14">N</option>
                    <option value="15">O</option>
                    <option value="16">P</option>
                    <option value="17">Q</option>
                    <option value="18">R</option>
                    <option value="19">S</option>
                    <option value="20">T</option>
                    <option value="21">U</option>
                    <option value="22">V</option>
                    <option value="23">W</option>
                    <option value="24">X</option>
                    <option value="25">Y</option>
                    <option value="26">Z</option>
                </select>
                <input type="text" name="groupname" placeholder="E.g. Unowned collectors">
                <input type="button" value="Save" id="savegroup" class="addTo dborder">
            </p>
        </div>`);

        $("#savegroup").click((event) => {
            event.preventDefault();
            const id = $("[name=groupid]").val();
            const name = $("[name=groupname]").val();
            usergroups[id] = name;
            GM_setValue("usergroups", usergroups);
        });

        $("[name=groupid]").change((event) => {
            const id = event.target.value;
            $("[name=groupname]").val(usergroups[id]);
        });

        $("[name=groupid]").trigger("change");
    }

    // The offer overview page
    if ($("li:has([accesskey=\"o\"])").is(".nav-sel") && $(".activity").length > 0) {
        $("[name=\"offer_setup\"]+").after("<input id=\"automatedoffer\" onsubmit=\"void(0)\" value=\"Begin Automated Offer\" class=\"addTo offer bold pborder\" type=\"button\" style=\"float: right;\">");
        $("#automatedoffer").parents("form")
            .css("width", "100%");
        $("#automatedoffer").click(setupAutomatedOffer);
        $(".showMoreArea").last()
            .after(`<p>
            <label for="offersearch">
                <strong>Filter: </strong>
            </label>
            <input class="addTo pborder" id="offersearch" type="text" placeholder="Search in displayed offers..." style="width: 210px;">
            <input class="addTo pborder" style="float: right; margin-left: 4px;" id="removeowned" type="button" onsubmit="void(0)" value="Purge Owned">
            <input class="addTo pborder" style="float: right; margin-left: 4px;" id="canceloffers" type="button" onsubmit="void(0)" value="Cancel">
            <input class="addTo pborder" style="float: right; margin-left: 4px;" id="messageoffers" type="button" onsubmit="void(0)" value="Message">
            <input class="addTo pborder" style="float: right; margin-left: 4px;" id="extendoffers" type="button" onsubmit="void(0)" value="Expiration">
            <strong style="float: right; margin-left: 4px;">Mass: </strong>
        </p>`);

        $("#canceloffers").click(cancelOffers);
        $("#messageoffers").click(messageOffers);
        $("#extendoffers").click(extendExpiry);
        $("#removeowned").click(removeOwned);
        $("#offersearch").on("change keyup paste", searchOffers);
    }

    // The accepted offer page
    $("p:has(> [name='offer_success_update'])").after("<p><input type=\"checkbox\" id=\"finalizeOfferCheck\"><label for=\"finalizeOfferCheck\"><abbr title=\"Complete offer on barter.vg with selected settings, leave a positive rep with custom message on steamtrades, comprehensive library sync and copy custom message to clipboard.\" class=\"bold\"> ⥅ Comprehensive Completion</abbr> complete offer, <a href=\"javascript:void(0)\" id=\"changeRepMsg\">positive steamtrades rep</a>, comprehensive library sync and <a href=\"javascript:void(0)\" id=\"changeClipboardMsg\">set clipboard</a></label></p>");
    $("#changeRepMsg").click(changeRepMsg);
    $("#changeClipboardMsg").click(changeClipboardMsg);
    $("#finalizeOfferCheck").prop("checked", GM_getValue("finalizeOffer", true));
    $("input[value='Completed Offer']").click(finalizeOffer);
}

function clickLibSyncBtn(event) {
    event.preventDefault();
    showSpinner("libsync");
    $(event.target).prop("disabled", true)
        .val("↻ Syncing...");
    syncLibrary(() => {
        hideSpinner("libsync");
        $(event.target).prop("disabled", false)
            .val("✔ Done");
    });
}

function showSpinner(instanceid) {
    if ($(".spinner").length === 0) { // to avoid multiple spinners
        $("body").prepend("<div class=\"spinner\"></div>");
    }

    $(".spinner").attr("data-instanceid", instanceid);
}

function hideSpinner(instanceid) {
    $(`.spinner[data-instanceid='${instanceid}']`).remove();
}

function enableAllTradables(event) {
    event.preventDefault();

    if (!confirm("Are you sure you want to enable disabled tradables? Make sure the other party is okay with this!")) {
        return;
    }

    $(event.target).parents(".tradables")
        .find(".collectionSelect input[disabled]")
        .get()
        .forEach((elem) => {
            elem.removeAttribute("disabled");
            elem.removeAttribute("title");
            elem.name = `add_to_offer_${$(".enableall:first").is(event.target) ? "1" : "2"}[]`;
            elem.id = $(elem).find("+")
                .attr("for");
            elem.value = `${$(elem).parents("tr")
                .data("item-id")},${$(elem).next()
                .attr("for")
                .replace("edit", "")}`;
        });

    $(event.target).remove();
}

function checkAllTradables(event) {
    event.preventDefault();
    $(event.target).parents(".tradables")
        .find(".collectionSelect input[type=checkbox]:visible")
        .get()
        .forEach((elem) => { elem.checked = !elem.checked; });
}

function toggleBundleItems(event) {
    event.preventDefault();
    $(`.collection tbody > tr:has(${$("#toggleselect").val()}):not(:has(.bargraphs))`).toggle();
    $(".collection tbody > tr:visible [type=checkbox]:visible").prop("disabled", false);
    $(".collection tbody > tr:hidden [type=checkbox]:visible").prop("disabled", true);
}

function createRep(rep) {
    if (rep && isFinite(rep.m) && isFinite(rep.p)) {
        return `<span class="strep" title="Steam Trades score">( <span class="plus">+${rep.p}</span>, <span class="minus${rep.m === 0 ? "" : " hasMinus"}">${rep.m}</span> )</span>`;
    }

    return $("<span class=\"strep notfound\">( none )</span>");
}

function addSteamTradesRep(elem) {
    const steamid = elem.href.split("/")[4];

    if (streps[steamid] && streps[steamid].t && Date.now() - streps[steamid].t <= 48 * 60 * 60 * 1000) {
        $(elem).after(createRep(streps[steamid]));
        return;
    }

    request({
        "method": "GET",
        "url":    elem.href,
        "onload": (response) => {
            streps[steamid] = {};
            const plus = parseInt($(".increment_positive_review_count", response.responseText).first()
                .text()
                .replace(",", ""));
            const minus = parseInt($(".increment_negative_review_count", response.responseText).first()
                .text()
                .replace(",", ""));

            if (!isNaN(plus) && !isNaN(minus)) {
                streps[steamid].p = plus;
                streps[steamid].m = minus;
            }

            streps[steamid].t = Date.now();
            GM_setValue("stReps", streps);
            $(elem).after(createRep(streps[steamid]));
        },
    });
}

function addAutoComplete() {
    if (Date.now() - itemnames.lastupdated <= 24 * 60 * 60 * 1000) {
        const data = Object.entries(itemnames.data).map((e) => ({ "id": e[0], "title": e[1] }));
        // eslint-disable-next-line no-undef
        const fuse = new Fuse(data, {
            "shouldSort":         true,
            "threshold":          0.3,
            "maxPatternLength":   32,
            "minMatchCharLength": 2,
            "keys":               ["id", "title"],
        });

        let delay;
        $("#q").parent()
            .append("<div id=\"acbox\" class=\"autocomplete\"></div>");
        $("#q").on("change keyup paste", (event) => {
            clearTimeout(delay);
            showSpinner("autocomplete");
            delay = setTimeout(() => {
                const val = event.target.value.trim();
                $("#acbox").html("");
                hideSpinner("autocomplete");

                if (val.length <= 2) {
                    return;
                }

                const results = fuse.search(val);
                for (let i = 0; i < 10; i++) {
                    const item = results.shift();
                    if (item) {
                        $("#acbox").append(`<p style="margin: 0.5em;"><a href="/i/${item.id}/">${item.title}</a></p>`);
                    }
                }

                if (results.length === 0) {
                    return;
                }

                $("#acbox").append(`<strong style="margin: 0.5em;"><a href="/search?q=${encodeURIComponent(val)}">And ${results.length} more...</a></strong>`);
            }, 500);
        })
            .blur(() => setTimeout(() => $("#acbox").hide(), 200))
            .focus(() => $("#acbox").show());
    }

    //     request({
    //         "method": `GET`,
    //         "url": `https://barter.vg/browse/json/`,
    //         "onload": (response) => {
    //             let json;
    //             try {
    //                 json = JSON.parse(response.responseText);
    //             } catch (e) {
    //                 return;
    //             }

    //             itemnames.data = {};
    //             for (const id in json) {
    //                 itemnames.data[id] = json[id].title.trim();
    //             }

    //             itemnames.lastupdated = Date.now();
    //             GM_setValue("itemnames", itemnames);
    //             addAutoComplete();
    //         }
    //     });
}

function handleRequests() {
    if (requests.length === 0) {
        return;
    }

    if (requests.length === 1) {
        setTimeout(() => console.log("All ajax requests are served!"), requestRateLimit);
    }

    console.log(`${requests.length} Ajax requests remaining...\nThis will roughly take ${requests.length * requestRateLimit / 1000} seconds to complete.`);
    const req = requests.shift();
    if (typeof request === "function") {
        req();
    }
}

function changeRepMsg() {
    let msg = GM_getValue("repmsg", "＋REP {{name}} is an amazing trader, recommended! We successfully completed this trade: {{url}}. Thanks a lot for the trade!");
    let newmsg = prompt("Message to post along SteamTrades feedback ({{name}} = trader's name, {{url}} = offer URL):", msg);
    GM_setValue("repmsg", newmsg || msg);
}

function changeClipboardMsg() {
    let msg = GM_getValue("clipboardmsg", "Thanks for the trade!\nI completed the trade on barter.vg and left feedback on your steamtrades profile.\nIf you haven't done so already, could you please do the same?\n{{url}}\n{{sgprofile}}");
    let newmsg = prompt("Message to copy to clipboard after offer completion ({{url}} = offer URL, {{sgprofile}} = steamtrades profile link):", msg);
    GM_setValue("clipboardmsg", newmsg || msg);
}

function finalizeOffer(event) {
    const check = $("#finalizeOfferCheck").prop("checked");
    GM_setValue("finalizeOffer", check); // Remember last used setting
    if (!check) {
        return true;
    }

    event.preventDefault();
    const main = $(event.target).parents("#main");
    const steamid = $("#offerHeader [alt=\"Steam icon\"]", main).get()
        .map((elem) => elem.title)
        .find((id) => id !== mysid);
    const name = $(`#offerHeader tr:has([title="${steamid}"]) > td:nth-child(2) > strong > a`, main).text();
    const form = $(event.target).parents("form");
    const url = form.attr("action").split("#")[0];

    let msg = GM_getValue("repmsg", "＋REP {{name}} is an amazing trader, recommended! We successfully completed this trade: {{url}}. Thanks a lot for the trade!");
    msg = msg.replace(/\{\{name\}\}/g, name).replace(/\{\{url\}\}/g, url);

    $(event.target).val("Completing trade, sending feedback and syncing library...")
        .prop("disabled", true);
    showSpinner("feedback");

    setPostTradeClipboard(url);
    $.post(url, form.serializeObject(), () => postSteamTradesComment(msg, steamid, () => syncLibrary(() => { location.href = url; })));
}

async function syncLibrary(callback) {
    if (callback) {
        await syncLibrary().catch(callback);
        callback();
        return;
    }

    return new Promise(async(res, rej) => {
        request({
            "url":     `https://barter.vg/u/${myuid}/l/`,
            "method":  "POST",
            "headers": { "Content-Type": "application/x-www-form-urlencoded" },
            "data":    $.param({
                "sync_list": "↻ Sync List",
                "type":      1,
            }),
            "onload": () => true,
        });

        const response = await request({
            "method": "GET",
            "url":    `http://store.steampowered.com/dynamicstore/userdata/?t=${Date.now()}`,
        }).catch(rej);

        const json = JSON.parse(response.responseText);
        const ownedApps = json.rgOwnedApps;
        const ownedPackages = json.rgOwnedPackages;
        await request({
            "url":     `https://barter.vg/u/${myuid}/l/e/`,
            "method":  "POST",
            "headers": { "Content-Type": "application/x-www-form-urlencoded" },
            "data":    $.param({
                "bulk_IDs":         `app/${ownedApps.join(",app/")},sub/${ownedPackages.join(",sub/")}`,
                "add_IDs":          "+ Add IDs",
                "action":           "Edit",
                "change_attempted": 1,
                "add_from":         "IDs",
            }),
        }).catch(rej);

        return res();
    });
}

async function postSteamTradesComment(msg, steamid, callback) {
    const empty = () => {};
    callback = callback || empty;

    const response = await request({
        "method":  "GET",
        "url":     `https://www.steamtrades.com/user/${steamid}`,
        "headers": {
            "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en",
        },
    }).catch(callback);

    const profile_id = $("[name=profile_id]", response.responseText).val();
    const xsrf_token = $("[name=xsrf_token]", response.responseText).val();
    if (!profile_id || !xsrf_token) {
        callback();
        return;
    }

    const data = {
        "do":          "review_insert",
        xsrf_token,
        profile_id,
        "rating":      1,
        "description": msg,
    };

    await request({
        "method":  "POST",
        "url":     "https://www.steamtrades.com/ajax.php",
        "data":    $.param(data),
        "headers": {
            "Content-Type":    "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept":          "application/json, text/javascript, */*; q=0.01",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en",
        },
    }).catch(callback);

    callback();
}

function setPostTradeClipboard(url) {
    const sgprofile = `https://www.steamtrades.com/user/${mysid}`;
    let msg = GM_getValue("clipboardmsg", "Thanks for the trade!\nI completed the trade on barter.vg and left feedback on your steamtrades profile.\nIf you haven't done so already, could you please do the same?\n{{url}}\n{{sgprofile}}");
    msg = msg.replace(/\{\{url\}\}/g, url).replace(/\{\{sgprofile\}\}/g, sgprofile);
    GM_setClipboard(msg);
}

function addShiftCheck() {
    window.checkKey = null;
    document.querySelectorAll("input[type=checkbox]").forEach((a, f, e) => {
        a.addEventListener("click", (c) => {
            let g = window.checkKey;
            window.checkKey = f;

            if (g !== null && c.shiftKey) {
                let h = e[g].checked;
                let j = [...e].slice(Math.min(f, g), Math.max(f, g) + 1);
                j.forEach((elem) => {
                    elem.checked = h;
                });

                let elem = document.querySelector("#selectCount");
                if (elem) {
                    let k = Number(elem.innerHTML);
                    let d = j.length - 2;
                    elem.innerHTML = h ? k + d : k - d;
                }
            }
        }, false);
    });
}

function setupAutomatedOffer() {
    $("#automatedoffer").text("Loading...");
    $.post(`/u/${myuid}/o/`, {
        "to_user_id":  -2,
        "offer_setup": 1,
    }, (data) => {
        $.post($("[rel=canonical]", `<div>${data}</div>`).attr("href"), {
            "offer_setup":  3,
            "cancel_offer": "☒ Cancel Offer",
        });

        parseHtml(data);

        $("#main h2").html("&#x1F916;&#xFE0E;✉ Automated Offers");
        $("#offerHeaderTo").html("To <strong>Qualified Users</strong> (select options below)");
        $("#offerHeaderTo").parent()
            .next()
            .remove();
        $("#offerHeaderTo").parent()
            .before(`<tr>
            <td class="gray">
                <span>Via</span>
            </td>
            <td colspan="6" class="gray">
                <a href="https://steamcommunity.com/groups/bartervg/discussions/6/1470841715930902039/">
                    <span title="version ${GM_info.script.version}">${GM_info.script.name}</span>
                </a>
                <a href="https://github.com/Revadike/EnhancedBarter/">
                    <img src="https://bartervg.com/imgs/ico/github.png" alt="GitHub icon" title="GitHub" class="icon">
                </a>
                <span>(not associated with Barter.vg)</span>
            </td>
        </tr>`);
        $("#offer").replaceWith(`<form id=offer>${$("#offer").html()}</form>`);
        $("[name=cancel_offer]").replaceWith("<input class=\"addTo failed\" value=\"🗑 Cancel and Discard Offer\" type=\"button\" onclick=\"location.reload()\">");
        $(".tradables:nth-child(3) legend").html(`${$(".tradables:nth-child(3) legend").html()
            .replace("<strong class=\"midsized offer\">1</strong> of ", "<input min=\"1\" id=\"from_ratio\" name=\"from_ratio\" type=\"number\" value=\"1\" style=\"width: 40px;\"> of ")}...`);

        $("form[action*=comments]").remove();
        $(".noborder:nth-child(3)").nextAll()
            .remove();
        $(".collectionSelect").nextAll()
            .remove();
        $("#exchanges").nextAll()
            .remove();
        $("#offer").nextAll()
            .remove();

        $(".tradables").after(`
        <ul>
        ...to users who...
            <li> <input type="checkbox" name="offering_to" id="towishlist" value="wishlist" checked="true"> <label for="towishlist">...have them in their wishlist...</label></li>
            <li> <input type="checkbox" name="offering_to" id="tounowned" value="unowned"> <label for="tounowned">...do <strong>not</strong> have them in their library...</label></li>
            <!-- <li> <input type="checkbox" name="offering_to" id="tolibrary" value="library"> <label for="tolibrary">...have them in their library...</label></li> -->
            <li> <input type="checkbox" name="offering_to" id="totradable" value="tradable"> <label for="totradable">...have them for trade...</label></li>
        </ul>
        <div style="margin: 2em 0; border-top: 1px solid rgb(153, 17, 187); border-bottom: 1px solid rgb(153, 17, 187);" class="offerDivide">
            <strong class="midsized">⇅</strong> ...in exchange for...
        </div>
        <p>
            ... <input min="1" id="to_ratio" name="to_ratio" type="number" value="1" style="width: 40px;"> of their tradables of type(s)...
        </p>
        <p>
            <input type="checkbox" name="type" id="game" value="game" checked="true"> <label for="game">Game</label>
            <input type="checkbox" name="type" id="dlc" value="dlc"> <label for="dlc">DLC</label>
            <input type="checkbox" name="type" id="application" value="application"> <label for="application">Application</label>
            <input type="checkbox" name="type" id="tool" value="tool"> <label for="tool">Tool</label>
            <input type="checkbox" name="type" id="demo" value="demo"> <label for="demo">Demo</label>
            <input type="checkbox" name="type" id="mod" value="mod"> <label for="mod">Mod</label>
            <input type="checkbox" name="type" id="media" value="media"> <label for="media">Media</label>
            <input type="checkbox" name="type" id="movie" value="movie"> <label for="movie">Movie</label>
            <input type="checkbox" name="type" id="video" value="video"> <label for="video">Video</label>
            <input type="checkbox" name="type" id="episode" value="episode"> <label for="episode">Episode</label>
            <input type="checkbox" name="type" id="series" value="series"> <label for="series">Series</label>
            <input type="checkbox" name="type" id="guide" value="guide"> <label for="guide">Guide</label>
            <input type="checkbox" name="type" id="config" value="config"> <label for="config">Config</label>
            <input type="checkbox" name="type" id="storeonly" value="storeonly"> <label for="storeonly">Storefront Only</label>
            <input type="checkbox" name="type" id="advertising" value="advertising"> <label for="advertising">Advertising</label>
            <input type="checkbox" name="type" id="hardware" value="hardware"> <label for="hardware">Hardware</label>
            <input type="checkbox" name="type" id="unknown" value="unknown"> <label for="unknown">Unknown</label>
            <input type="checkbox" name="type" id="unset" value="unset"> <label for="unset">Unset</label>
        </p>
        <p>
            ...meeting these requirements...
        </p>
        <fieldset>
            <small>TIP: Hover over the (?) with your mouse cursor for a better description and explanation of the requirement.</small>
        </fieldset>
        <fieldset style="border-top: 1px solid rgb(153, 17, 187);">
            <div id="limit" data-max="10000" class="offerSlider"></div>
            Offer count (<a style="cursor: help; text-decoration: none;" title="The number range of offers you want to send. \nIf you only have a limited stock of your selected tradable(s), I'd recommend limiting your offers to avoid getting more accepted offers than you can fulfill. \nNote that barter has a daily limit for offers. Please complain to barter.vg about this.">?</a>)
        </fieldset>
        <!-- <fieldset>
            <div id="DLC" data-max="1" data-suffix="%" class="offerSlider"></div>
            DLC (<a style="cursor: help; text-decoration: none;" title="Include DLC? \nThere are 3 options: 0%-0% means no DLC, 0%-100% means allow DLC (don't care) and 100%-100% means DLC only.">?</a>)
        </fieldset> -->
        <fieldset>
            <div id="limited" data-max="1" data-suffix="%" class="offerSlider"></div>
            Steam Limited (<a style="cursor: help; text-decoration: none;" title="Include Steam Limited? \nSteam Limited: no +1 for your library, no achievement showcase. \nThere are 3 options: 0%-0% means no Steam Limited, 0%-100% means allow Steam Limited (don't care) and 100%-100% means Steam Limited only.">?</a>)
        </fieldset>
        <fieldset>
            <div id="givenaway" data-max="1" data-suffix="%" class="offerSlider"></div>
            Given away (<a style="cursor: help; text-decoration: none;" title="Include games that are free or have been given away before?\nThere are 3 options: 0%-0% means no given away, 0%-100% means allow given away (don't care) and 100%-100% means given away only.">?</a>)
        </fieldset>
        <fieldset>
            <div id="bundles" data-max="100" class="offerSlider"></div>
            Bundles count (<a style="cursor: help; text-decoration: none;" title="The range of the number of times the game has been bundled. \nChoose range 0-0 to only want never bundled games. \nChoose range 1-max to avoid never-bundled games.">?</a>)
        </fieldset>
        <fieldset>
            <div id="cards" data-max="100" class="offerSlider"></div>
            Cards count (<a style="cursor: help; text-decoration: none;" title="The range of the how many Steam Trading Cards a game must have. \nChoose range 0-0 to only want games with no cards. \nChoose range 1-max to only want games with cards (any amount).">?</a>)
        </fieldset>
        <fieldset>
            <div id="achievements" data-max="1000000" class="offerSlider"></div>
            Achievements count (<a style="cursor: help; text-decoration: none;" title="The range of how many achievements a game must have. \nChoose range 0-0 to only want games with no achievements. \nChoose range 1-max if you only want games with achievements (any amount).">?</a>)
        </fieldset>
        <fieldset>
            <div id="reviews" data-max="1000000" class="offerSlider"></div>
            Review count (<a style="cursor: help; text-decoration: none;" title="I recommend leaving this one on default (0-max). \nThe range of how many reviews a game must have. \nChoose range 0-0 to only want games with no reviews. \nChoose range 1-max if you only want games with reviews (any amount).">?</a>)
        </fieldset>
        <fieldset>
            <div id="scores" data-max="100" data-suffix="%" class="offerSlider"></div>
            Review score (<a style="cursor: help; text-decoration: none;" title="The percentage range of the game review score. \nThe default range (0%-100%) allows games with any review score.">?</a>)
        </fieldset>
        <fieldset>
            <div id="price" data-max="10000" data-prefix="$" class="offerSlider"></div>
            Price (<a style="cursor: help; text-decoration: none;" title="The price range of the game. \nThe default range (0$-max$) allows games with any price amount. \nI'd recommend adjusting this range to roughly match your selected tradable(s).">?</a>)
        </fieldset>
        <fieldset>
            <div id="year" data-min="1950" data-max="2050" class="offerSlider"></div>
            Release year (<a style="cursor: help; text-decoration: none;" title="The release year range of the game.">?</a>)
        </fieldset>
        <fieldset>
            <div id="stowners" data-max="1000" class="offerSlider"></div>
            Steam-Tracker owners (<a style="cursor: help; text-decoration: none;" title="The range of the steam-tracker app owners count: the number of Steam-Tracker users that own the (removed) game. \nI'd recommend adjusting this range to roughly match your selected tradable(s).">?</a>)
        </fieldset>
        <fieldset>
            <div id="wishlist" data-max="10000" class="offerSlider"></div>
            Wishlist count (<a style="cursor: help; text-decoration: none;" title="The range of the wishlist count: the number of Barter.vg users that have the game in their wishlist. \nI'd recommend adjusting this range to roughly match your selected tradable(s).">?</a>)
        </fieldset>
        <fieldset>
            <div id="library" data-max="10000" class="offerSlider"></div>
            Library count (<a style="cursor: help; text-decoration: none;" title="The range of the library count: the number of Barter.vg users that have the game in their library. \nIf you want only rare games (games nobody or only a few have), you can lower the upper range bound.">?</a>)
        </fieldset>
        <fieldset style="border-bottom: 1px solid rgb(153, 17, 187);">
            <div id="tradables" data-max="10000" class="offerSlider"></div>
            Tradables count (<a style="cursor: help; text-decoration: none;" title="The range of the tradables count or availability: the number of Barter.vg users that have the game to trade.">?</a>)
        </fieldset>
        <p style="float: left; width: 50%;">...from these platforms...</p>
        <p style="float: left; width: 50%;">...delivered via...</p>
        <div style="width: 50%; float: right; height: 14em; overflow: auto; border-top: 1px solid rgb(153, 17, 187); border-bottom: 1px solid rgb(153, 17, 187);">
            <ul>
                <li> <input type="checkbox" name="delivery" id="auto" value="auto" checked="true"> <label for="auto">Auto</label></li>
                <li> <input type="checkbox" name="delivery" id="curator" value="curator" checked="true"> <label for="curator">Steam Curator Connect</label></li>
                <li> <input type="checkbox" name="delivery" id="custom" value="custom" checked="true"> <label for="custom">Custom</label></li>
                <li> <input type="checkbox" name="delivery" id="extra" value="extra" checked="true"> <label for="extra">Extra</label></li>
                <li> <input type="checkbox" name="delivery" id="gift" value="gift" checked="true"> <label for="gift">Steam Gift</label></li>
                <li> <input type="checkbox" name="delivery" id="gift-lock" value="gift-lock" checked="true"> <label for="gift-lock">Steam Gift (Lock)</label></li>
                <li> <input type="checkbox" name="delivery" id="gift-trade" value="gift-trade" checked="true"> <label for="gift-trade">Steam Gift (Trade)</label></li>
                <li> <input type="checkbox" name="delivery" id="included" value="included" checked="true"> <label for="included">Included</label></li>
                <li> <input type="checkbox" name="delivery" id="key" value="key" checked="true"> <label for="key">Steam Key</label></li>
                <li> <input type="checkbox" name="delivery" id="link" value="link" checked="true"> <label for="link">Bundle Gift Link</label></li>
                <li> <input type="checkbox" name="delivery" id="unrevealed" value="unrevealed" checked="true"> <label for="unrevealed">Unrevealed</label></li>
                <li> <input type="checkbox" name="delivery" id="unspecified" value="" checked="true"> <label for="unspecified">Unspecified</label></li>
            </ul>
        </div>
        <div style="width: 50%; height: 14em; overflow: auto; border-top: 1px solid rgb(153, 17, 187); border-bottom: 1px solid rgb(153, 17, 187);">
            <ul>
                <li><input type="checkbox" name="platform" id="steam" value="1" checked="true"><label for="steam">Steam</label></li>
                <li><input type="checkbox" name="platform" id="steampkg" value="2"><label for="steampkg">Steam Package</label></li>
                <li><input type="checkbox" name="platform" id="humblebundle" value="3"><label for="humblebundle">Humble Bundle</label></li>
                <li><input type="checkbox" name="platform" id="gog" value="4"><label for="gog">GOG.com</label></li>
                <li><input type="checkbox" name="platform" id="origin" value="5"><label for="origin">Origin</label></li>
                <li><input type="checkbox" name="platform" id="desura" value="6"><label for="desura">Desura</label></li>
                <li><input type="checkbox" name="platform" id="indiegala" value="7"><label for="indiegala">Indiegala</label></li>
                <li><input type="checkbox" name="platform" id="fanatical" value="8"><label for="fanatical">Fanatical</label></li>
                <li><input type="checkbox" name="platform" id="groupees" value="9"><label for="groupees">Groupees</label></li>
                <li><input type="checkbox" name="platform" id="indieroyale" value="10"><label for="indieroyale">Indie Royale</label></li>
                <li><input type="checkbox" name="platform" id="gamersgate" value="11"><label for="gamersgate">GamersGate</label></li>
                <li><input type="checkbox" name="platform" id="amazon" value="12"><label for="amazon">Amazon</label></li>
                <li><input type="checkbox" name="platform" id="humblebundle" value="13"><label for="humblebundle">Humble Store</label></li>
                <li><input type="checkbox" name="platform" id="uplay" value="14"><label for="uplay">Uplay</label></li>
                <li><input type="checkbox" name="platform" id="lazyguys" value="15"><label for="lazyguys">Lazy Guys Bundle</label></li>
                <li><input type="checkbox" name="platform" id="greenlight" value="16"><label for="greenlight">Green Light Bundle</label></li>
                <li><input type="checkbox" name="platform" id="dailyindie" value="17"><label for="dailyindie">DailyIndieGame</label></li>
                <li><input type="checkbox" name="platform" id="flyingbundle" value="18"><label for="flyingbundle">Flying Bundle</label></li>
                <li><input type="checkbox" name="platform" id="steami" value="19"><label for="steami">Steam Item</label></li>
                <li><input type="checkbox" name="platform" id="gmg" value="20"><label for="gmg">Green Man Gaming</label></li>
                <li><input type="checkbox" name="platform" id="nuuvem" value="21"><label for="nuuvem">Nuuvem</label></li>
                <li><input type="checkbox" name="platform" id="macgamestore" value="22"><label for="macgamestore">MacGameStore</label></li>
                <li><input type="checkbox" name="platform" id="playinjector" value="23"><label for="playinjector">Playinjector</label></li>
                <li><input type="checkbox" name="platform" id="igamestand" value="24"><label for="igamestand">IndieGameStand</label></li>
                <li><input type="checkbox" name="platform" id="3ds" value="25"><label for="3ds">Nintendo 3DS</label></li>
                <li><input type="checkbox" name="platform" id="wiiu" value="26"><label for="wiiu">WiiU</label></li>
                <li><input type="checkbox" name="platform" id="coinplay" value="27"><label for="coinplay">Coinplay.io</label></li>
                <li><input type="checkbox" name="platform" id="itchio" value="28"><label for="itchio">itch.io</label></li>
                <li><input type="checkbox" name="platform" id="superduper" value="29"><label for="superduper">Super-Duper Bundle</label></li>
                <li><input type="checkbox" name="platform" id="onemore" value="30"><label for="onemore">one more bundle</label></li>
                <li><input type="checkbox" name="platform" id="cubicbundle" value="31"><label for="cubicbundle">Cubic Bundle</label></li>
                <li><input type="checkbox" name="platform" id="telltale" value="32"><label for="telltale">Telltale Games</label></li>
                <li><input type="checkbox" name="platform" id="hrk" value="33"><label for="hrk">HRK</label></li>
                <li><input type="checkbox" name="platform" id="wingamestore" value="34"><label for="wingamestore">WinGameStore</label></li>
                <li><input type="checkbox" name="platform" id="sgreenlight" value="35"><label for="sgreenlight">Steam Greenlight</label></li>
                <li><input type="checkbox" name="platform" id="orlygift" value="36"><label for="orlygift">Orlygift</label></li>
                <li><input type="checkbox" name="platform" id="squareenix" value="37"><label for="squareenix">Square Enix</label></li>
                <li><input type="checkbox" name="platform" id="otakumaker" value="38"><label for="otakumaker">OtakuMaker</label></li>
                <li><input type="checkbox" name="platform" id="bundlekings" value="39"><label for="bundlekings">Bundle Kings</label></li>
                <li><input type="checkbox" name="platform" id="gamebundle" value="40"><label for="gamebundle">GameBundle</label></li>
                <li><input type="checkbox" name="platform" id="chronogg" value="41"><label for="chronogg">Chrono.gg</label></li>
                <li><input type="checkbox" name="platform" id="dlgamer" value="42"><label for="dlgamer">DLGamer</label></li>
                <li><input type="checkbox" name="platform" id="gamesplanet" value="43"><label for="gamesplanet">Gamesplanet</label></li>
                <li><input type="checkbox" name="platform" id="silagames" value="44"><label for="silagames">Sila Games</label></li>
                <li><input type="checkbox" name="platform" id="bunchofkeys" value="45"><label for="bunchofkeys">Bunch of Keys</label></li>
                <li><input type="checkbox" name="platform" id="g2a" value="46"><label for="g2a">G2A</label></li>
                <li><input type="checkbox" name="platform" id="steamground" value="47"><label for="steamground">Steamground</label></li>
                <li><input type="checkbox" name="platform" id="99cent" value="48"><label for="99cent">99 Cent Bundle</label></li>
                <li><input type="checkbox" name="platform" id="redacted" value="49"><label for="redacted">Redacted Network</label></li>
                <li><input type="checkbox" name="platform" id="breadbox" value="50"><label for="breadbox">Bread Box Bundle</label></li>
                <li><input type="checkbox" name="platform" id="ps4" value="51"><label for="ps4">PlayStation 4</label></li>
                <li><input type="checkbox" name="platform" id="ps3" value="52"><label for="ps3">PlayStation 3</label></li>
                <li><input type="checkbox" name="platform" id="xb360" value="53"><label for="xb360">Xbox 360</label></li>
                <li><input type="checkbox" name="platform" id="xbone" value="54"><label for="xbone">Xbox One</label></li>
                <li><input type="checkbox" name="platform" id="steamgifts" value="55"><label for="steamgifts">Steamgifts.com</label></li>
                <li><input type="checkbox" name="platform" id="marvelous" value="56"><label for="marvelous">MarvelousCrate</label></li>
                <li><input type="checkbox" name="platform" id="barter" value="57"><label for="barter">Barter.vg</label></li>
                <li><input type="checkbox" name="platform" id="gogobundles" value="58"><label for="gogobundles">GoGoBundle</label></li>
                <li><input type="checkbox" name="platform" id="cdkeys" value="59"><label for="cdkeys">CDKeys.com</label></li>
                <li><input type="checkbox" name="platform" id="kinguin" value="60"><label for="kinguin">Kinguin</label></li>
                <li><input type="checkbox" name="platform" id="unspecified2" value="61"><label for="unspecified2">Unspecified Platform</label></li>
                <li><input type="checkbox" name="platform" id="otakubundle" value="62"><label for="otakubundle">Otaku Bundle</label></li>
                <li><input type="checkbox" name="platform" id="dogebundle" value="63"><label for="dogebundle">DogeBundle</label></li>
                <li><input type="checkbox" name="platform" id="plati" value="64"><label for="plati">Plati</label></li>
                <li><input type="checkbox" name="platform" id="streamtrades" value="65"><label for="streamtrades">Steamtrades.com</label></li>
                <li><input type="checkbox" name="platform" id="epicgamesstore" value="66"><label for="epicgamesstore">Epic Games Store</label></li>
                <li><input type="checkbox" name="platform" id="twitch" value="67"><label for="twitch">Twitch</label></li>
                <li><input type="checkbox" name="platform" id="indiedeals2" value="68"><label for="indiedeals2">IndieDeals.net</label></li>
                <li><input type="checkbox" name="platform" id="tigb" value="69"><label for="tigb">The Indie Games Bundle</label></li>
                <li><input type="checkbox" name="platform" id="tiltify" value="70"><label for="tiltify">Tiltify</label></li>
                <li><input type="checkbox" name="platform" id="tremorgames" value="71"><label for="tremorgames">Tremor Games</label></li>
                <li><input type="checkbox" name="platform" id="grepublic" value="72"><label for="grepublic">Games Republic</label></li>
                <li><input type="checkbox" name="platform" id="2game" value="73"><label for="2game">2game</label></li>
                <li><input type="checkbox" name="platform" id="d2d" value="74"><label for="d2d">Direct2Drive</label></li>
                <li><input type="checkbox" name="platform" id="dreamgate" value="75"><label for="dreamgate">Dreamgate</label></li>
                <li><input type="checkbox" name="platform" id="newegg" value="76"><label for="newegg">Newegg</label></li>
                <li><input type="checkbox" name="platform" id="ps3" value="77"><label for="ps3">PSVita</label></li>
                <li><input type="checkbox" name="platform" id="ps4" value="78"><label for="ps4">PSN</label></li>
                <li><input type="checkbox" name="platform" id="embloo" value="79"><label for="embloo">Embloo</label></li>
                <li><input type="checkbox" name="platform" id="battlenet" value="80"><label for="battlenet">battle.net</label></li>
                <li><input type="checkbox" name="platform" id="gamivo" value="81"><label for="gamivo">Gamivo</label></li>
                <li><input type="checkbox" name="platform" id="getgames" value="82"><label for="getgames">Get Games Go</label></li>
                <li><input type="checkbox" name="platform" id="g2play" value="83"><label for="g2play">G2play</label></li>
                <li><input type="checkbox" name="platform" id="fangamer" value="84"><label for="fangamer">Fangamer</label></li>
                <li><input type="checkbox" name="platform" id="trove" value="85"><label for="trove">Humble Trove</label></li>
                <li><input type="checkbox" name="platform" id="steam-tracker" value="86"><label for="steam-tracker">Steam-tracker</label></li>
                <li><input type="checkbox" name="platform" id="blinkbundle" value="87"><label for="blinkbundle">Blink Bundle</label></li>
                <li><input type="checkbox" name="platform" id="gamesrage" value="88"><label for="gamesrage">Games Rage</label></li>
                <li><input type="checkbox" name="platform" id="bbandits" value="89"><label for="bbandits">Bundle Bandits</label></li>
                <li><input type="checkbox" name="platform" id="bcentral" value="90"><label for="bcentral">Bundle Central</label></li>
                <li><input type="checkbox" name="platform" id="bdragon" value="91"><label for="bdragon">Bundle Dragon</label></li>
                <li><input type="checkbox" name="platform" id="biab" value="92"><label for="biab">Bundle In A Box</label></li>
                <li><input type="checkbox" name="platform" id="cultofmac" value="93"><label for="cultofmac">Cult of Mac</label></li>
                <li><input type="checkbox" name="platform" id="eurobundle" value="94"><label for="eurobundle">Eurobundle</label></li>
                <li><input type="checkbox" name="platform" id="gram" value="95"><label for="gram">gram.pl</label></li>
                <li><input type="checkbox" name="platform" id="indieammo" value="96"><label for="indieammo">Indie Ammo Box</label></li>
                <li><input type="checkbox" name="platform" id="iborg" value="97"><label for="iborg">IndieBundle</label></li>
                <li><input type="checkbox" name="platform" id="kissmb" value="98"><label for="kissmb">KissMyBundles</label></li>
                <li><input type="checkbox" name="platform" id="madorc" value="99"><label for="madorc">MadOrc</label></li>
                <li><input type="checkbox" name="platform" id="paddle" value="100"><label for="paddle">Paddle</label></li>
                <li><input type="checkbox" name="platform" id="paywuw" value="101"><label for="paywuw">PayWUW</label></li>
                <li><input type="checkbox" name="platform" id="peonb" value="102"><label for="peonb">Peon Bundle</label></li>
                <li><input type="checkbox" name="platform" id="gameolith" value="103"><label for="gameolith">Gameolith</label></li>
                <li><input type="checkbox" name="platform" id="selectnp" value="104"><label for="selectnp">Select n' Play</label></li>
                <li><input type="checkbox" name="platform" id="shinyloot" value="105"><label for="shinyloot">ShinyLoot</label></li>
                <li><input type="checkbox" name="platform" id="stacksocial" value="106"><label for="stacksocial">StackSocial</label></li>
                <li><input type="checkbox" name="platform" id="universala" value="107"><label for="universala">Universala</label></li>
                <li><input type="checkbox" name="platform" id="vodo" value="108"><label for="vodo">VODO</label></li>
                <li><input type="checkbox" name="platform" id="cybundle" value="109"><label for="cybundle">CY Bundle</label></li>
                <li><input type="checkbox" name="platform" id="discord" value="110"><label for="discord">Discord</label></li>
                <li><input type="checkbox" name="platform" id="lequestore" value="111"><label for="lequestore">lequestore</label></li>
                <li><input type="checkbox" name="platform" id="rockstar" value="112"><label for="rockstar">Rockstar Social Club</label></li>
                <li><input type="checkbox" name="platform" id="disc" value="113"><label for="disc">From boxed copy</label></li>
                <li><input type="checkbox" name="platform" id="puppygames" value="114"><label for="puppygames">PuppyGames</label></li>
                <li><input type="checkbox" name="platform" id="igpack" value="115"><label for="igpack">Indie-games pack</label></li>
                <li><input type="checkbox" name="platform" id="supershock" value="116"><label for="supershock">Super Shock Bundle</label></li>
                <li><input type="checkbox" name="platform" id="charlies" value="117"><label for="charlies">Charlie's Games</label></li>
                <li><input type="checkbox" name="platform" id="socks" value="118"><label for="socks">Buy Games Not Socks</label></li>
                <li><input type="checkbox" name="platform" id="subsoap" value="119"><label for="subsoap">Subsoap</label></li>
                <li><input type="checkbox" name="platform" id="bitcoin" value="120"><label for="bitcoin">Bitcoin Bundle</label></li>
                <li><input type="checkbox" name="platform" id="gamersgate" value="121"><label for="gamersgate">IndieFort</label></li>
                <li><input type="checkbox" name="platform" id="voidu" value="122"><label for="voidu">Voidu</label></li>
                <li><input type="checkbox" name="platform" id="gemly" value="123"><label for="gemly">gemly</label></li>
                <li><input type="checkbox" name="platform" id="akens" value="124"><label for="akens">akens.ru</label></li>
                <li><input type="checkbox" name="platform" id="farmkeys" value="125"><label for="farmkeys">FarmKEYS</label></li>
                <li><input type="checkbox" name="platform" id="tkfg" value="126"><label for="tkfg">TKFG</label></li>
                <li><input type="checkbox" name="platform" id="greenlighta" value="127"><label for="greenlighta">Greenlight Arcade</label></li>
                <li><input type="checkbox" name="platform" id="h2o" value="128"><label for="h2o">H2O Bundle</label></li>
                <li><input type="checkbox" name="platform" id="oculus" value="129"><label for="oculus">Oculus</label></li>
                <li><input type="checkbox" name="platform" id="razer" value="130"><label for="razer">Razer</label></li>
                <li><input type="checkbox" name="platform" id="alienware" value="131"><label for="alienware">Alienware</label></li>
                <li><input type="checkbox" name="platform" id="ign" value="132"><label for="ign">IGN</label></li>
                <li><input type="checkbox" name="platform" id="microsoft" value="133"><label for="microsoft">Microsoft Store</label></li>
                <li><input type="checkbox" name="platform" id="alphabundle" value="134"><label for="alphabundle">Alpha Bundle</label></li>
                <li><input type="checkbox" name="platform" id="opiumpulses" value="135"><label for="opiumpulses">Opium Pulses</label></li>
                <li><input type="checkbox" name="platform" id="brightlocker" value="137"><label for="brightlocker">BrightLocker</label></li>
                <li><input type="checkbox" name="platform" id="oyvey" value="138"><label for="oyvey">Oy Vey Keys</label></li>
                <li><input type="checkbox" name="platform" id="stardock" value="139"><label for="stardock">Stardock</label></li>
                <li><input type="checkbox" name="platform" id="lootcrate" value="140"><label for="lootcrate">Loot Crate</label></li>
                <li><input type="checkbox" name="platform" id="allyouplay" value="141"><label for="allyouplay">Allyouplay</label></li>
                <li><input type="checkbox" name="platform" id="bestbuy" value="142"><label for="bestbuy">Best Buy</label></li>
                <li><input type="checkbox" name="platform" id="gameuk" value="143"><label for="gameuk">GAME UK</label></li>
                <li><input type="checkbox" name="platform" id="gamebillet" value="144"><label for="gamebillet">Gamebillet</label></li>
                <li><input type="checkbox" name="platform" id="gamestop" value="145"><label for="gamestop">GameStop</label></li>
                <li><input type="checkbox" name="platform" id="xbone" value="146"><label for="xbone">Xbox Live</label></li>
                <li><input type="checkbox" name="platform" id="arenanet" value="147"><label for="arenanet">ArenaNet</label></li>
                <li><input type="checkbox" name="platform" id="bethesda" value="148"><label for="bethesda">Bethesda.net</label></li>
                <li><input type="checkbox" name="platform" id="gamehag" value="149"><label for="gamehag">Gamehag</label></li>
                <li><input type="checkbox" name="platform" id="kartridge" value="150"><label for="kartridge">Kartridge</label></li>
                <li><input type="checkbox" name="platform" id="lootboy" value="151"><label for="lootboy">LootBoy</label></li>
                <li><input type="checkbox" name="platform" id="dlhnet" value="152"><label for="dlhnet">Dlh.net</label></li>
                <li><input type="checkbox" name="platform" id="giveawaysu" value="153"><label for="giveawaysu">GiveAway.su</label></li>
                <li><input type="checkbox" name="platform" id="gleam" value="154"><label for="gleam">Gleam</label></li>
                <li><input type="checkbox" name="platform" id="gamehunt" value="155"><label for="gamehunt">GAMEHUNT</label></li>
                <li><input type="checkbox" name="platform" id="grabfreegame" value="156"><label for="grabfreegame">GrabFreeGame</label></li>
                <li><input type="checkbox" name="platform" id="wgn" value="157"><label for="wgn">Who's Gaming Now?!</label></li>
                <li><input type="checkbox" name="platform" id="keyjoker" value="158"><label for="keyjoker">KeyJoker</label></li>
                <li><input type="checkbox" name="platform" id="devsource" value="159"><label for="devsource">From Dev / Pub</label></li>
                <li><input type="checkbox" name="platform" id="blank" value="160"><label for="blank">WeGame X</label></li>
                <li><input type="checkbox" name="platform" id="blank" value="161"><label for="blank">Indie Face Kick</label></li>
            </ul>
        </div>
        <p style="float: left; width: 50%;">...with availability...</p>
        <p style="float: left; width: 50%;">...from users who...</p>
        <div style="width: 50%; float: right; height: 14em; overflow: auto; border-top: 1px solid rgb(153, 17, 187); border-bottom: 1px solid rgb(153, 17, 187);">
            <ul>
                <li> <input type="checkbox" name="want_from" id="wantwishlist" value="wishlist" checked="true"> <label for="wantwishlist">...have those tradables in your wishlist.</label></li>
                <li> <input type="checkbox" name="want_from" id="wantunowned" value="unowned"> <label for="wantunowned">...do <strong>not</strong> have those tradables in your library.</label></li>
                <li> <input type="checkbox" name="want_from" id="wantlibrary" value="library"> <label for="wantlibrary">...have those tradables in your library.</label></li>
                <li> <input type="checkbox" name="want_from" id="wanttradable" value="tradable"> <label for="wanttradable">...have those tradables in your tradables list.</label></li>
            </ul>
        </div>
        <div style="width: 50%; float: right; height: 14em; overflow: auto; border-top: 1px solid rgb(153, 17, 187); border-bottom: 1px solid rgb(153, 17, 187);">
            <ul>
                <li><input type="checkbox" name="availability" id="available" value="0" checked="true"><label for="available">Available</label></li>
                <li><input type="checkbox" name="availability" id="delisted" value="1" checked="true"><label for="delisted">Delisted</label></li>
                <li><input type="checkbox" name="availability" id="test_app" value="2" checked="true"><label for="test_app">Test app</label></li>
                <li><input type="checkbox" name="availability" id="purchase_disabled" value="3" checked="true"><label for="purchase_disabled">Purchase disabled</label></li>
                <li><input type="checkbox" name="availability" id="retail_only" value="4" checked="true"><label for="retail_only">Retail only</label></li>
                <li><input type="checkbox" name="availability" id="delisted_software" value="5" checked="true"><label for="delisted_software">Delisted software</label></li>
                <li><input type="checkbox" name="availability" id="f2p_unavailable" value="6" checked="true"><label for="f2p_unavailable">F2P (unavailable)</label></li>
                <li><input type="checkbox" name="availability" id="delisted_video" value="7" checked="true"><label for="delisted_video">Delisted video</label></li>
                <li><input type="checkbox" name="availability" id="unreleased" value="13" checked="true"><label for="unreleased">Unreleased</label></li>
                <li><input type="checkbox" name="availability" id="preorder_exclusive" value="14" checked="true"><label for="preorder_exclusive">Pre-order exclusive</label></li>
                <li><input type="checkbox" name="availability" id="free_software" value="15" checked="true"><label for="free_software">Free software</label></li>
                <li><input type="checkbox" name="availability" id="unreleased_software" value="19" checked="true"><label for="unreleased_software">Unreleased software</label></li>
                <li><input type="checkbox" name="availability" id="banned" value="20" checked="true"><label for="banned">Banned</label></li>
                <li><input type="checkbox" name="availability" id="banned_unreleased" value="23" checked="true"><label for="banned_unreleased">Banned (unreleased)</label></li>
                <li><input type="checkbox" name="availability" id="delisted_hardware" value="25" checked="true"><label for="delisted_hardware">Delisted hardware</label></li>
            </ul>
        </div>`);

        $("#offerStatus").html("<div class=\"statusCurrent\">Creating...</div><div class=\"\">Preparing...</div><div class=\"\">Sending offers...</div><div class=\"\">Completed</div>");
        $("#offer").prepend(`<div>
            <textarea class="offer_message" name="message" id="offerMessage" placeholder="Add a public comment to automated offers that is relevant and respectful" title="optional public comment up to 255 characters" maxlength="255" style="width: 100%;"></textarea>
        </div>`);

        $("#from_ratio").attr("max", $(".tradables input").length);
        $(".tradables input[type=checkbox]").click(() => {
            const n = $(".tradables input:checked").length;
            $("#from_ratio").attr("max", n || 1);
            $("#from_ratio").val(Math.min(n || 1, parseInt($("#from_ratio").val())));
        });
        $("#from_ratio").change(() => $("#from_ratio").val(Math.min(parseInt($("#from_ratio").attr("max")), parseInt($("#from_ratio").val()))));

        $("#exchanges").nextAll()
            .remove();
        $("[name=offer_setup]").remove();
        $("#exchanges").after(`
        <p>
            <label for="expire_days">Offer expires in </label>
            <select name="expire_days" id="expire_days">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option selected="selected">15</option>
            </select>
            days.
        </p>
        <p>
            <label for="counter_preference">Counter offer is </label>
            <select name="counter_preference" id="counter_preference">
                <option value="-1">Discouraged, don't display counter</option>
                <option value="0" selected="selected">OK, display counter</option>
                <option value="1">Encouraged, bold counter</option>
            </select>
            .
        </p>
        <p>
            <input type="checkbox" name="synclib" id="synclib" value="true" checked><label for="synclib">Synchronize your <a target="_blank" href="/u/${myuid}/l/">barter library</a> with <a target="_blank" href="https://store.steampowered.com/dynamicstore/userdata/">steam store userdata</a> first (RECOMMENDED).</label>
        </p>
        <input class="showMoreToggle" type="checkbox" id="templatebox">
        <label class="showMoreLabel " for="templatebox"> Export/import template (advanced)</label>
        <div class="showMoreArea"><textarea style="width: 100%;" id="template"></textarea></div>
        <p><button id="massSendBtn" class="addTo gborder acceptOption" style="font-weight: bold; color: green; width: 100%; height: 2em; font-size: 1.2em; cursor: pointer;">Finish and Send Automated Offers</button>`);
        $("#massSendBtn").click((event) => {
            event.preventDefault();
            sendAutomatedOffers(JSON.parse($("#template").val()));
        });
        $("#offer :input").on("change click keyup paste", (event) => {
            if (event.target.id === "template") {
                return;
            }
            $("#template").val(JSON.stringify($("#offer").serializeObject()));
        });
        $("#template").val(JSON.stringify($("#offer").serializeObject()));
        $("[name='add_to_offer_1[]']").attr("name", "offering");
        $("#offerStatus+ div").remove();
        $("#offerStatus").attr("style", "border-top: 1px solid rgb(153, 17, 187); border-bottom: 1px solid rgb(153, 17, 187);");
        $(".offerSlider").get()
            .forEach(addSlider);
        addShiftCheck();
    });
}

function addSlider(slider) {
    const min = parseInt($(slider).data("min")) || 0;
    const max = parseInt($(slider).data("max")) || 1000;
    const digits = max.toString().split("").length;
    const prefix = $(slider).data("prefix") || "";
    const suffix = $(slider).data("suffix") || "";
    const isToggle = max === 1;
    const isPercent = suffix === "%";
    if (isToggle && !isPercent) {
        $(slider).after(`<input type="hidden" value="true" name="${slider.id}">`);
    } else {
        $(slider).after(`<input type="hidden" value="0" name="min${slider.id}">`);
        $(slider).after(`<input type="hidden" value="${max}" name="max${slider.id}">`);
    }

    const toggleTooltip = (val) => {
        if (max === 1) {
            if (isPercent) {
                return val ? "100%" : "0%";
            }
            return val ? "Yes" : "No";
        }

        return `${prefix}${Number(val).toFixed(0)}${suffix}`;
    };

    const range = { min, max };
    const n = Math.log10(max);
    if (min === 0 && n - Math.floor(n) === 0) {
        let percentage = 0;
        for (let i = 1; i <= digits - 1; i++) {
            percentage += 100 / (digits - 1);
            range[`${percentage}%`] = 10 ** i;
        }
    }

    // eslint-disable-next-line no-undef
    noUiSlider.create(slider, {
        "start":     isToggle && !isPercent ? max : [0, max],
        "connect":   !isToggle || isPercent,
        "behaviour": isToggle && !isPercent ? "none" : "tap",
        "tooltips":  [{ "to": toggleTooltip }].concat(isToggle && !isPercent ? [] : [{ "to": toggleTooltip }]),
        "step":      1,
        range,
    }).on("update", (values) => {
        $("#template").val(JSON.stringify($("#offer").serializeObject()));
        if (isToggle && !isPercent) {
            const value = parseInt(values[0]);
            $(`[name="${slider.id}"]`).val(Boolean(value));

            if (value) {
                $(slider).addClass("on");
            } else {
                $(slider).removeClass("on");
            }
        } else {
            $(`[name="min${slider.id}"]`).val(Number(values[0]).toFixed(0));
            $(`[name="max${slider.id}"]`).val(Number(values[1]).toFixed(0));
        }
    });

    if (isToggle && !isPercent) {
        $(slider).find(".noUi-connects")
            .click(() => slider.noUiSlider.set(parseInt(slider.noUiSlider.get()) ? 0 : 1));
    }
}

function fixSettings(settings) {
    settings = fixObjectTypes(settings);
    settings.offering = Array.isArray(settings.offering) ? settings.offering : [settings.offering];
    settings.offering_to = Array.isArray(settings.offering_to) ? settings.offering_to.map((g) => g.toLowerCase()) : [settings.offering_to.toLowerCase()];
    settings.want_from = Array.isArray(settings.want_from) ? settings.want_from.map((g) => g.toLowerCase()) : [settings.want_from.toLowerCase()];
    settings.platform = Array.isArray(settings.platform) ? settings.platform : [settings.platform];
    settings.delivery = Array.isArray(settings.delivery) ? settings.delivery : [settings.delivery];
    settings.availability = Array.isArray(settings.availability) ? settings.availability : [settings.availability];
    settings.type = Array.isArray(settings.type) ? settings.type.map((g) => g.toLowerCase()) : [settings.type.toLowerCase()];
    return settings;
}

function checkSettings(settings) {
    if (!settings.offering) {
        alert(`Please select ${settings.from_ratio} or more of your tradable(s) that you want to offer.`);
        return;
    }

    if (!settings.offering_to) {
        alert("Please select 1 or more trader groups you want to sent offers to.");
        return;
    }

    if (!settings.want_from) {
        alert("Please select 1 or more tradable groups you want to ask tradables from.");
        return;
    }

    if (!settings.type) {
        alert("Please select 1 or more tradable type(s) you want to ask tradables from.");
        return;
    }

    if (!settings.platform) {
        alert("Please select 1 or more platform(s) you want to ask tradables from.");
        return;
    }

    if (!settings.delivery) {
        alert("Please select 1 or more delivery options.");
        return;
    }

    if (!settings.availability) {
        alert("Please select 1 or more availability options.");
        return;
    }

    if (settings.message && settings.message.length > 255) {
        alert("Please limit your message to only 255 characters.");
        return;
    }

    if (!confirm("Are you sure you want to proceed? Beware that this may cause traders to add you to their ignore list!")) {
        return;
    }

    if (settings.offering.filter((i) => i).length < settings.from_ratio) {
        alert(`Please select ${settings.from_ratio} or more of your tradable(s) that you want to offer.`);
        return;
    }

    if (settings.offering.filter((i) => i).length > 100) {
        alert("Please select 100 or less of your tradable(s) that you want to offer.");
        return;
    }

    return settings;
}

function logHTML(log) {
    console.log(log);
    $("#log").append(`<p>${log}</p>`);
    $("#log").get(0).scrollTop = $("#log").get(0).scrollHeight;
}

function changeAutomatedOfferStatus(i) {
    [1, 2, 3, 4].forEach((n) => $(`#offerStatus > div:nth-child(${n})`).removeClass("statusCurrent"));
    $(`#offerStatus > div:nth-child(${i})`).addClass("statusCurrent");
}

function calculateStupidDailyLimit(offers) {
    const unique = [];
    for (const id in offers) {
        const offer = offers[id];
        if (offer.from_status !== "completed" || offer.to_status !== "completed") {
            continue;
        }

        const otherparty = offer.to_user_id === myuid ? offer.from_user_id : offer.to_user_id;
        if (unique.includes(otherparty)) {
            continue;
        }

        unique.push(otherparty);
    }

    const daylength = 24 * 60 * 60 * 1000;
    const recent = [];
    for (const id in offers) {
        const offer = offers[id];
        if (offer.from_user_id === myuid && offer.created * 1000 > Date.now() - daylength && offer.to_status !== "completed" && offer.from_status !== "cancelled") {
            recent.push(id);
        }
    }

    return (unique.length < 100 ? 200 : 400) - recent.length;
}

async function sendAutomatedOffers(options) {
    if (!options) {
        options = $("#offer").serializeObject();
    }

    const settings = fixSettings(options);

    const alertError = (err) => {
        console.log(err);
        alert(err.message || err.name);
    };

    console.log({ settings });

    if (!checkSettings(settings)) {
        return;
    }

    changeAutomatedOfferStatus(2);
    $("#offer").replaceWith("<div style=\"height: 28em; overflow: auto; border-bottom: 1px solid rgb(153, 17, 187);\" id=\"log\"></div>");
    showSpinner("automatedoffers");

    let offers = await getBarterOffers(parseInt(myuid, 16));
    let dailylimit = calculateStupidDailyLimit(offers); // barter's stupid daily offer limit

    if (dailylimit <= 0) {
        logHTML("<strong>Cancelled, because you hit/exceeded <a target=\"_blank\" href=\"/u/a0/\">barter.vg</a>'s daily offer limit...<br>Help him convince to remove this limit by complaining to him!</strong>");
        return;
    }

    if (settings.synclib) {
        logHTML(`Syncing your <a target="_blank" href="/u/${myuid}/l/">barter library</a> with your <a target="_blank" href="https://store.steampowered.com/dynamicstore/userdata/">steam user data</a>...`);
        await syncLibrary().catch(alertError);
    }

    logHTML("Getting list of users that opted out for automated offers..");
    const optins = await getBarterAppSettings(2).catch(alertError);
    console.log("optins", optins);

    logHTML("Getting list of Steam-Tracker apps..");
    const st_apps = await getSteamTrackerApps().catch(alertError);
    console.log("stapps", st_apps);

    logHTML("Getting info about the tradables you are offering...");
    const allmatches = {};
    const mytradables = {};
    const { tags, "user": { country_id } } = await getBarterTradables(parseInt(myuid, 16));
    const tag2cc = {
        // "26": region,
        // "27": `RU`,
        // "28": 1,
        // "29": 2,
        // "30": 3,
        // "31": 4,
        // "34": 6,
        // "35": 5,
        // "346": region
        // "364": `PL`,
        // "376": `ROW`,
        // "387": `DE`,
        // "398": `IN`,
        // "479": `CN`

        "27":  [191], // locked: RU
        "28":  [7, 16, 36, 79, 116, 125, 139, 191, 219, 222, 230, 235], // locked: CIS
        "29":  [10, 29, 31, 32, 37, 46, 49, 50, 63, 91, 94, 97, 157, 165, 173, 174, 186, 207, 210, 234, 238], // locked: SA
        "30":  [101, 158, 177, 198, 218], // locked: SEA
        "31":  [225], // locked: TR
        "34":  [38, 233], // locked: NA
        "35":  [15, 6, 1, 12, 20, 17, 22, 98, 55, 56, 59, 64, 74, 70, 75, 57, 83, 89, 81, 100, 109, 102, 110, 111, 135, 129, 133, 134, 144, 153, 139, 138, 140, 166, 179, 184, 189, 204, 190, 202, 200, 68, 197, 43, 77], // locked: EU
        "364": [179], // locked: PL
        "376": [1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 33, 34, 35, 38, 39, 40, 41, 42, 43, 44, 45, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 92, 93, 95, 96, 98, 99, 100, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 117, 118, 119, 120, 121, 122, 123, 124, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 159, 160, 161, 162, 163, 164, 166, 167, 168, 169, 170, 171, 172, 175, 176, 178, 179, 180, 181, 182, 183, 184, 185, 187, 188, 189, 190, 192, 193, 194, 195, 196, 197, 199, 200, 201, 202, 203, 204, 205, 206, 208, 209, 211, 212, 213, 214, 215, 216, 217, 220, 221, 223, 224, 226, 227, 228, 229, 231, 232, 233, 236, 237, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250], // locked: ROW
        "387": [57], // locked: DE
        "398": [105], // locked: IN
        "479": [48], // locked: CN
        "534": [225, 107, 193, 245, 212, 2, 103, 113, 183, 127, 172, 123, 187, 23, 108, 164, 69, 65, 40, 247, 115, 62, 231, 196, 137, 82, 159, 44, 142, 8, 47, 162, 21, 145, 156, 248, 205, 249, 215, 86, 223, 192, 208, 25, 206, 24, 217, 136, 203, 41, 67, 42, 131, 151, 76, 160, 35, 132, 88, 85, 93, 154, 213, 58, 188, 119, 66, 52, 246, 209, 195], // locked: MEA
        "624": [114], // locked: JP
    };

    for (const i of settings.offering) {
        const key = i.split(",");
        mytradables[i] = await getBarterItemInfo(key[0]);
        mytradables[i].regions = Object.values(tags[key[1]] || {}).filter((tag) => Object.keys(tag2cc).includes(tag.tag_id.toString()))
            .map((tag) => tag2cc[tag.tag_id])
            .flat();
    }

    console.log("mytradables", mytradables);
    for (const key in mytradables) {
        mytradables[key].matches = new Set(); // the users that want this tradable
        const gameinfo = mytradables[key];

        logHTML(`Limiting traders that potentionally want <a target="_blank" href="/i/${gameinfo.id}/">this tradable</a>, according to their preferences...`);

        settings.offering_to.forEach((group) => {
            if (!gameinfo.users.hasOwnProperty(group)) {
                return;
            }

            for (const userid in gameinfo.users[group]) { // for every user in that group
                if (!gameinfo.users[group].hasOwnProperty(userid)) {
                    continue;
                }

                const uid = parseInt(userid);
                const user = gameinfo.users[group][userid];
                if (passesTheirPreferences(gameinfo, user, optins, group, settings.offering.length)) {
                    mytradables[key].matches.add(uid);
                    allmatches[uid] = user;
                    allmatches[uid].want = new Set();
                }
            }
        });
    }

    for (const userid in allmatches) {
        const uid = parseInt(userid);
        const offeringcount = Object.values(mytradables).filter((tradable) => tradable.matches.has(uid)).length; // the amount of tradables I can offer that user
        const pendingusers = Object.values(offers).filter((offer) => offer.from_user_id === myuid && offer.to_status === "pending")
            .map((offer) => parseInt(offer.to_user_id, 16));

        // if I can't offer enough (according to my options)
        // or if I exceed the user's max items per offer setting
        // or if I already have a pending offer sent to the user
        // then delete match
        if (offeringcount < settings.from_ratio || offeringcount > allmatches[uid].max_items_per_offer || pendingusers.includes(uid)) {
            delete allmatches[uid];
            for (const k in mytradables) {
                mytradables[k].matches.delete(uid);
            }
        }
    }

    delete allmatches[parseInt(myuid, 16)];
    for (const k in mytradables) {
        mytradables[k].matches.delete(parseInt(myuid, 16));
    }

    const matchedcount = Object.keys(allmatches).length;
    logHTML(`Found ${matchedcount} matching traders!`);
    console.log("allmatches", allmatches);
    if (matchedcount === 0) {
        logHTML("Done!");
        changeAutomatedOfferStatus(4);
        hideSpinner("automatedoffers");
        return;
    }

    logHTML(`Limiting traders that have tradables you want, according to your preferences...${matchedcount > 100 ? "<br><strong>This may take several minutes</strong>" : ""}`);
    for (const userid in allmatches) { // gonna filter out the matches that have no tradables that interest me
        const uid = parseInt(userid);

        const groups = await getFilteredTradables(uid).catch(alertError); // the user's tradables filtered according to my collections
        if (!groups) {
            delete allmatches[uid];
            for (const key in mytradables) {
                mytradables[key].matches.delete(uid);
            }
            continue;
        }

        const want_items = [].concat(...settings.want_from.map((group) => groups[group] || [])); // array of item id's of the group of tradables I (still) want from this user
        if (want_items.length === 0) { // if user has no tradables I'm interested in, delete match
            delete allmatches[uid];
            for (const key in mytradables) {
                mytradables[key].matches.delete(uid);
            }
            continue;
        }

        const theirtradables = await getBarterTradables(uid).catch(alertError);
        if (!theirtradables) {
            delete allmatches[uid];
            for (const key in mytradables) {
                mytradables[key].matches.delete(uid);
            }
            continue;
        }

        const no_offers_items = theirtradables.tags && Object.keys(theirtradables.tags).length > 0 ? Object.values(Object.assign(...Object.values(theirtradables.tags))).filter((tag) => tag.tag_id === 369)
            .map((tag) => tag.line_id) : [];
        const limited_items = theirtradables.steam_limited;

        for (const platformid in theirtradables.by_platform) {
            const tradables = theirtradables.by_platform[platformid];
            for (const line_id in tradables) {
                const tradable = tradables[line_id];
                tradable.regions = Object.values(theirtradables.tags[line_id] || {}).filter((tag) => Object.keys(tag2cc).includes(tag.tag_id.toString()))
                    .map((tag) => tag2cc[tag.tag_id])
                    .flat();
                if (passesMyPreferences(tradable, settings, st_apps, want_items, no_offers_items, limited_items, country_id)) {
                    allmatches[uid].want.add(`${tradable.item_id},${tradable.line_id}`);
                }
            }
        }

        if (allmatches[uid].want.size < parseInt(settings.to_ratio) || allmatches[uid].want.size === 0) {
            delete allmatches[uid];
            for (const key in mytradables) {
                mytradables[key].matches.delete(uid);
            }
            continue;
        }
    }

    const matchescount = Object.keys(allmatches).length;
    logHTML(`Found ${matchescount} matching traders!`);

    if (matchescount < settings.minlimit) {
        logHTML("Not enough matches found. Done!");
        changeAutomatedOfferStatus(4);
        hideSpinner("automatedoffers");
        return;
    }

    const max = Math.min(settings.maxlimit, matchescount);
    logHTML(`Sending ${max} automated offers...`);
    changeAutomatedOfferStatus(3);

    let sent = 0;
    let failed = 0;
    const matches = shuffle(Object.keys(allmatches)).slice(0, max); // the users to send the automated offers to
    for (const userid of matches) {
        if (sent === dailylimit) {
            const daylength = (24 * 60 * 60 * 1000) + 10000; // 24h + 10 seconds
            const endtime = Date.now() + daylength;
            const countdown = setInterval(() => {
                const distance = endtime - Date.now();

                if (distance < 0) {
                    clearInterval(countdown);
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                const minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
                const seconds = Math.floor(distance % (1000 * 60) / 1000);

                $(".countdown").html(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }, 1000);

            logHTML(`<strong>Now we have to wait <i class="countdown"></i> before sending the remaining ${matches.length - failed - sent} offers, because <a target="_blank" href="/u/a0/">barter.vg</a> thinks this limit is neccesary...<br>Help him change his mind by complaining to him!</strong>`);

            await delay(daylength); // wait an entire day, because barter thinks it's neccesary

            offers = await getBarterOffers(parseInt(myuid, 16)).catch(alertError);
            dailylimit = sent + calculateStupidDailyLimit(offers); // barter's stupid daily offer limit
        }

        const uid = parseInt(userid);
        const ato1 = shuffle(Object.keys(mytradables).filter((key) => mytradables[key].matches.has(uid))); // only add my offered tradables that the user actually wants
        const ato2 = shuffle([...allmatches[uid].want]).splice(0, allmatches[uid].max_items_per_offer || 100);

        const offer = await sendBarterOffer({
            "to":                  uid,
            "from_and_or":         settings.from_ratio === ato1.length ? 0 : settings.from_ratio,
            "to_and_or":           settings.to_ratio === ato2.length ? 0 : settings.to_ratio,
            "expire":              Math.max(allmatches[uid].expire_min_from || 1, settings.expire_days),
            "counter_preference":  settings.counter_preference,
            "add_to_offer_from[]": ato1,
            "add_to_offer_to[]":   ato2,
            // "settings": JSON.stringify(settings),
            "message":             settings.message || "",
        }).catch((err) => {
            failed++;
            logHTML(`<strong>Failed to send automated offer to <a target="_blank" href="/u/${uid.toString(16)}/">${allmatches[uid].steam_persona}</a></strong> (${sent}/${max} sent${failed > 0 ? `, ${failed} failed` : ""})`);
            console.log(err);
        });

        if (offer) {
            sent++;
            logHTML(`Successfully sent automated <a target="_blank" href="/u/${myuid}/o/${offer.offer_id}/">offer</a> to <a target="_blank" href="/u/${uid.toString(16)}/">${allmatches[uid].steam_persona}</a> (${sent}/${max} sent${failed > 0 ? `, ${failed} failed` : ""})`);
        }
    }

    logHTML("Done!");
    changeAutomatedOfferStatus(4);
    hideSpinner("automatedoffers");
}

function getBarterOffers(uid) {
    return new Promise(async(res, rej) => {
        const response = await request({
            "method": "GET",
            "url":    `https://barter.vg/u/${uid.toString(16)}/o/json/`,
        }).catch(rej);

        let json;
        try {
            json = JSON.parse(response.responseText);
        } catch (e) {
            e.data = response;
            rej(e);
        }

        delete json[0]; // metadata
        res(json);
    });
}

function getBarterTradables(uid) {
    return new Promise(async(res, rej) => {
        const response = await request({
            "method": "GET",
            "url":    `https://barter.vg/u/${uid.toString(16)}/t/json/`,
        }).catch(rej);

        let json;
        try {
            json = JSON.parse(response.responseText);
        } catch (e) {
            e.data = response;
            rej(e);
        }

        res(json);
    });
}

function getFilteredTradables(uid) {
    return new Promise(async(res, rej) => {
        const response = await request({
            "method": "GET",
            "url":    `https://barter.vg/u/${uid.toString(16)}/t/f/${myuid}/json/`,
        }).catch(rej);

        let json;
        try {
            json = JSON.parse(response.responseText);
        } catch (e) {
            e.data = response;
            rej(e);
        }

        res(json);
    });
}

function getBarterItemInfo(itemid) {
    return new Promise(async(res, rej) => {
        const response = await request({
            "method": "GET",
            "url":    `https://barter.vg/i/${itemid}/json2/`,
        }).catch(rej);

        let json;
        try {
            json = JSON.parse(response.responseText);
        } catch (e) {
            e.data = response;
            rej(e);
        }

        res(json);
    });
}

function getBarterAppSettings(appid) {
    return new Promise(async(res, rej) => {
        const response = await request({
            "method": "GET",
            "url":    `https://barter.vg/app/${appid}/settings/`,
        }).catch(rej);

        let json;
        try {
            json = JSON.parse(response.responseText);
        } catch (e) {
            e.data = response;
            rej(e);
        }

        res(json);
    });
}

function getSteamTrackerApps() {
    return new Promise(async(res, rej) => {
        const response = await request({
            "method": "GET",
            "url":    "https://steam-tracker.com/api?action=GetAppListV3",
        }).catch(rej);

        let json;
        try {
            json = JSON.parse(response.responseText);
        } catch (e) {
            e.data = response;
            rej(e);
        }

        if (!json || !json.success) {
            rej(json);
        }

        const apps = {};
        for (const app of json.removed_apps) {
            apps[app.appid] = app;
        }
        res(apps);
    });
}

function sendBarterOffer(options) {
    return new Promise(async(res, rej) => {
        console.log("options", options);
        const response = await request({
            "url":     `https://barter.vg/u/${myuid}/o/json/`,
            "method":  "POST",
            "headers": { "Content-Type": "application/x-www-form-urlencoded" },
            "data":    $.param({
                "app_id":      2,
                "app_version": versionToInteger(GM_info.script.version),
                ...options,
            }),
        }).catch(rej);

        let json;
        try {
            json = JSON.parse(response.responseText);
        } catch (e) {
            e.data = response;
            rej(e);
        }

        res(json);
    });
}

function delay(ms) {
    return new Promise((res) => setTimeout(() => res(), ms));
}

async function jqueryPost(url, data, callback) {
    const response = await request({
        url,
        "method":  "POST",
        "headers": { "Content-Type": "application/x-www-form-urlencoded" },
        "data":    $.param(data),
    }).catch(callback);

    if (response && callback) {
        return callback(response.responseText);
    }
}

function request(options) {
    if (options.onload) {
        GM_xmlhttpRequest(options);
        return;
    }

    let error = new Error("HTTP Error");
    return new Promise((res, rej) => GM_xmlhttpRequest({
        "timeout":   240000,
        ...options,
        "onload":    res,
        "onerror":   (...params) => { error.params = params; rej(error); },
        "ontimeout": (...params) => { error.params = params; rej(error); },
        "onabort":   (...params) => { error.params = params; rej(error); },
    }));
}

function passesMyPreferences(game, settings, st_apps, want_items, no_offers_items, limited_items, mycountry) {
    let pass = want_items.includes(game.item_id) && settings.platform.includes(game.platform_id) && !no_offers_items.includes(game.line_id);
    if (!pass) {
        return pass;
    }
    // console.log(game.title, pass, new Error);

    if (pass && mycountry && mycountry !== 0 && game.regions && game.regions.length > 0) {
        pass = pass && game.regions.includes(mycountry); // their tradable region lock has my country
    }
    // lack of information: assume bad region
    if (pass && (!mycountry || mycountry === 0) && game.regions && game.regions.length > 0) {
        return false;
    }
    // console.log(game.title, pass, new Error);

    if (pass && game.hasOwnProperty("extra")) { // Number of copies
        pass = pass && game.extra > 0;
    }
    // console.log(game.title, pass, new Error);

    if (pass && game.hasOwnProperty("sku") && st_apps.hasOwnProperty(game.sku) && settings.hasOwnProperty("availability")) {
        pass = pass && settings.availability.includes(st_apps[game.sku].category_id);
    }
    if (pass && game.hasOwnProperty("sku") && !st_apps.hasOwnProperty(game.sku) && settings.hasOwnProperty("availability")) {
        pass = pass && settings.availability.includes(0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && game.hasOwnProperty("sku") && st_apps.hasOwnProperty(game.sku) && settings.hasOwnProperty("minstowners") && settings.hasOwnProperty("maxstowners")) {
        pass = pass && inRange(settings.minstowners, settings.maxstowners, st_apps[game.sku].count || 0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && game.hasOwnProperty("item_type") && settings.hasOwnProperty("type")) {
        pass = pass && settings.type.includes(game.item_type.toLowerCase());
    }
    // console.log(game.title, pass, new Error);

    if (pass && game.hasOwnProperty("ci_type") && settings.hasOwnProperty("delivery")) {
        pass = pass && settings.delivery.includes(game.ci_type.toLowerCase());
    }
    if (pass && !game.hasOwnProperty("ci_type") && settings.hasOwnProperty("delivery")) {
        pass = pass && settings.delivery.includes("");
    }
    // console.log(game.title, pass, new Error);

    if (pass && game.hasOwnProperty("item_type") && settings.hasOwnProperty("minDLC") && settings.hasOwnProperty("maxDLC")) {
        if (settings.minDLC === 0 && settings.maxDLC === 0) {
            pass = pass && game.item_type.toLowerCase() !== "dlc";
        }
        if (settings.minDLC === 1 && settings.maxDLC === 1) {
            pass = pass && game.item_type.toLowerCase() === "dlc";
        }
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minlimited") && settings.hasOwnProperty("maxlimited")) {
        if (settings.minlimited === 0 && settings.maxlimited === 0) {
            pass = pass && !limited_items.includes(game.item_id);
        }
        if (settings.minlimited === 1 && settings.maxlimited === 1) {
            pass = pass && limited_items.includes(game.item_id);
        }
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("mingivenaway") && settings.hasOwnProperty("maxgivenaway")) {
        if (settings.mingivenaway === 0 && settings.maxgivenaway === 0) {
            pass = pass && (game.givenaway || 0) === 0;
        }
        if (settings.mingivenaway === 1 && settings.maxgivenaway === 1) {
            pass = pass && (game.givenaway || 0) !== 0;
        }
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minbundles") && settings.hasOwnProperty("maxbundles")) {
        pass = pass && inRange(settings.minbundles, settings.maxbundles, game.bundles_all || 0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("mincards") && settings.hasOwnProperty("maxcards")) {
        pass = pass && inRange(settings.mincards, settings.maxcards, game.cards || 0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minachievements") && settings.hasOwnProperty("maxachievements")) {
        pass = pass && inRange(settings.minachievements, settings.maxachievements, game.achievements || 0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minreviews") && settings.hasOwnProperty("maxreviews")) {
        pass = pass && inRange(settings.minreviews, settings.maxreviews, game.reviews_total || 0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minscores") && settings.hasOwnProperty("maxscores")) {
        pass = pass && inRange(settings.minscores, settings.maxscores, game.reviews_positive || 0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minprice") && settings.hasOwnProperty("maxprice")) {
        pass = pass && inRange(settings.minprice, settings.maxprice, (game.price || 0) / 100);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minyear") && settings.hasOwnProperty("maxyear")) {
        pass = pass && inRange(settings.minyear, settings.maxyear, game.release_year || 1950);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minwishlist") && settings.hasOwnProperty("maxwishlist")) {
        pass = pass && inRange(settings.minwishlist, settings.maxwishlist, game.wishlist || 0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("minlibrary") && settings.hasOwnProperty("maxlibrary")) {
        pass = pass && inRange(settings.minlibrary, settings.maxlibrary, game.library || 0);
    }
    // console.log(game.title, pass, new Error);

    if (pass && settings.hasOwnProperty("mintradables") && settings.hasOwnProperty("maxtradables")) {
        pass = pass && inRange(settings.mintradables, settings.maxtradables, game.tradable || 0);
    }
    // console.log(game.title, pass, new Error);

    return pass;
}

function passesTheirPreferences(game, user, optins, group, offeringcount) { // game = my tradable
    const my_user_id = parseInt(myuid, 16);
    let pass = user.country_id && user.country_id !== 0 && game.regions && game.regions.length > 0 ? game.regions.includes(user.country_id) : true;

    // lack of information: assume bad region
    if (pass && (!user.country_id || user.country_id === 0) && game.regions && game.regions.length > 0) {
        return false;
    }

    if (optins.hasOwnProperty("global") || optins.hasOwnProperty("0")) { // for future support, not yet implemented in API (#6)
        if (pass && user.hasOwnProperty("user_id") && optins.hasOwnProperty("global") && optins.global.hasOwnProperty(user.user_id)) {
            pass = pass && optins.global[user.user_id];
        }

        if (pass && user.hasOwnProperty("user_id") && optins.hasOwnProperty(user.user_id)) {
            pass = pass && optins[user.user_id][my_user_id];
        }
    } else if (pass && user.hasOwnProperty("steam_id64_string") && optins.hasOwnProperty(user.steam_id64_string)) {
        pass = pass && optins[user.steam_id64_string];
    }

    if (pass && user.hasOwnProperty("wants_unowned")) {
        if (user.wants_unowned === 0) {
            pass = pass && group === "wishlist";
        } else if (user.wants_unowned === 1) {
            pass = pass && (group === "wishlist" || group === "unowned");
        }
    }

    if (pass && user.hasOwnProperty("wants_library")) {
        if (user.wants_library === 0) {
            pass = pass && group !== "library";
        }
    }

    if (pass && user.hasOwnProperty("wants_tradable")) {
        if (user.wants_tradable === 0) {
            pass = pass && group !== "tradable";
        }
    }

    if (pass && user.hasOwnProperty("wants_cards") && user.wants_cards === 1) {
        pass = pass && (game.cards || 0) > 0 && (game.cards_marketable || 0) === 1;
    }

    if (pass && user.hasOwnProperty("wants_achievements") && user.wants_achievements === 1) {
        pass = pass && (game.achievements || 0) > 0;
    }

    if (pass && user.hasOwnProperty("avoid_givenaway") && user.avoid_givenaway === 1) {
        pass = pass && (game.giveaway_count || 0) === 0;
    }

    if (pass && user.hasOwnProperty("avoid_bundles") && user.avoid_bundles === 1) {
        pass = pass && (game.bundles_available || 0) === 0;
    }

    if (pass && game.hasOwnProperty("user_reviews_positive") && user.hasOwnProperty("wants_rating") && game.user_reviews_positive >= 0) {
        pass = pass && user.wants_rating <= game.user_reviews_positive;
    }

    if (pass && user.hasOwnProperty("max_items_per_offer")) {
        pass = pass && user.max_items_per_offer >= offeringcount;
    }

    if (pass && game.hasOwnProperty("source_id") && user.hasOwnProperty("wants_steam_only") && user.wants_steam_only === 1) {
        pass = pass && (game.source_id === 1 || game.source_id === 2);
    }

    if (pass && game.hasOwnProperty("item_type") && user.hasOwnProperty("avoid_dlc") && user.avoid_dlc === 1) {
        pass = pass && game.item_type.toLowerCase() !== "dlc";
    }

    if (user.hasOwnProperty("windows") && user.windows === 1 && user.hasOwnProperty("mac") && user.mac === 1 && user.hasOwnProperty("linux") && user.linux === 1) { // workaround
        user.windows = 0;
        user.mac = 0;
        user.linux = 0;
    }

    if (pass && game.hasOwnProperty("windows") && user.hasOwnProperty("windows") && user.windows === 1) {
        pass = pass && game.windows === 1;
    }

    if (pass && game.hasOwnProperty("mac") && user.hasOwnProperty("mac") && user.mac === 1) {
        pass = pass && game.mac === 1;
    }

    if (pass && game.hasOwnProperty("linux") && user.hasOwnProperty("linux") && user.linux === 1) {
        pass = pass && game.linux === 1;
    }

    console.log(user.user_id, pass);
    return pass;
}

function fixObjectTypes(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            let val = obj[key];
            if (Array.isArray(val)) {
                // eslint-disable-next-line no-extra-parens
                obj[key] = val.map((i) => (isFinite(i) ? Number(i) : i));
            } else if (val === "true") {
                obj[key] = true;
            } else if (val === "false") {
                obj[key] = false;
            } else if (val === "") {
                delete obj[key];
            } else if (isFinite(val)) {
                obj[key] = Number(val);
            }
        }
    }
    return obj;
}

function filterRows(event) {
    const val = event.target.value.toLowerCase();
    $(".collection tbody tr:not(.platform)").get()
        .forEach((elem) => {
            if ($(elem).html()
                .toLowerCase()
                .includes(val)) {
                $(elem).show();
            } else {
                $(elem).hide();
            }
        });
}

function searchOffers(event) {
    const val = event.target.value.toLowerCase();
    $("#offers tr:has(abbr)").get()
        .forEach((elem) => {
            if ($(elem).text()
                .toLowerCase()
                .includes(val)) {
                $(elem).show();
            } else {
                $(elem).hide();
            }
        });

    $("#offers tr.commentPreview").get()
        .forEach((elem) => {
            if ($(elem).prev()
                .is(":hidden")) {
                $(elem).hide();
            } else {
                $(elem).show();
            }
        });
}

function messageOffers(event) {
    event.preventDefault();

    const message = prompt("Message:");

    if (!message) {
        return;
    }

    $("#offers tr:visible:has(abbr)").get()
        .forEach((elem) => $.post($("a.textColor", elem).attr("href"), {
            "offer_message": message,
            "offer_setup":   3,
        }, () => $(elem).find("*")
            .css("color", "green")));
}

function cancelOffers(event) {
    event.preventDefault();

    if (!confirm("Are you sure you want to cancel all trade offers displayed below?")) {
        return;
    }

    $("#offers tr:visible:has(abbr)").get()
        .forEach((elem) => $.post($("a.textColor", elem).attr("href"), {
            "offer_setup":  3,
            "cancel_offer": "☒ Cancel Offer",
        }, () => $(elem).remove()));
}

function extendExpiry(event) {
    event.preventDefault();
    const expire_days = parseInt(prompt("Expiration:", "15"));
    if (isNaN(expire_days)) {
        return;
    }

    $("#offers tr:visible").get()
        .forEach((elem) => {
            const url = $("a.textColor", elem).attr("href");
            $.post(url, {
                "offer_setup": 3,
                "edit_offer":  "✐ Edit Offer",
            }, (data) => {
                data = data.replace(/src="[^"]*"/ig, "");
                const formdata = $("#offer", data).serializeObject();
                formdata.expire_days = expire_days;
                formdata.propose_offer = "Finish and Propose Offer";
                $.post(url, formdata, () => $(elem).find("*")
                    .css("color", "green"));
            });
        });
}

function removeOwned(event) {
    event.preventDefault();
    if (!confirm("Are you sure you want to purge owned items from visible offers? This may cause nasty side effects, like empty sides, new ratios, etc.")) {
        return;
    }

    const elems = $("#offers tr.active:visible").get();
    const nParallel = 3;
    const purge = () => {
        if (elems.length === 0) {
            return;
        }
        const elem = elems.shift();
        const url = $("a.textColor", elem).attr("href");
        $.post(url, {
            "offer_setup": 3,
            "edit_offer":  "✐ Edit Offer",
        }, (data) => {
            data = data.replace(/src="[^"]*"/ig, "");
            // assuming you are the one sending this offer
            const $to_items = $(".tradables_items_list [data-item-id]:has(.checked_to)", data);
            const checked = [];
            const myname = $("#main > h1 > a:nth-child(2)").text();
            for (let i = 0; i < $to_items.length; i++) {
                const $elem = $($to_items[i]);
                if ($elem.find(`.collectionsIncluded [title="${myname}"]`).nextUntil("img")
                    .text()
                    .toLowerCase()
                    .includes("library")) {
                    checked.push($elem.find(".checked_to").val());
                }
            }
            const formdata = $("#offer", data).serializeObject();

            if (checked.length === 0) {
                formdata.propose_offer = "Finish and Propose Offer";
                $.post(url, formdata, () => {
                    $(elem).find("*")
                        .css("color", "grey");
                    setTimeout(purge, 0);
                });
                return;
            }

            formdata.checked = checked;
            formdata.remove_offer_items = " － Remove Selected";
            $.post(url, formdata, (data) => {
                data = data.replace(/src="[^"]*"/ig, "");
                const formdata = $("#offer", data).serializeObject();
                formdata.propose_offer = "Finish and Propose Offer";
                $.post(url, formdata, () => {
                    $(elem).find("*")
                        .css("color", "green");
                    setTimeout(purge, 0);
                });
            });
        });
    };

    for (let i = 0; i < nParallel; i++) {
        setTimeout(purge, 0);
    }
}

function ajaxify() {
    return; // disabled for now
    // eslint-disable-next-line no-unreachable
    $("form:not([target='_blank'], [onsubmit])").submit(formSubmitted);
    $("button[name], [type=submit]:not([target='_blank'], [onsubmit])").click(submitClicked);
}

function submitClicked(event) {
    if ($(event.target).parents("form").length > 0) {
        $("[type=submit]", $(event.target).parents("form")).removeAttr("clicked");
        $(event.target).attr("clicked", "true");
    } else {
        $("form").off("submit", formSubmitted);
    }
}

function formSubmitted(event) {
    event.preventDefault();

    const form = event.target;
    const submit = $("[clicked=true]", form);
    const action = submit.is("[formaction]") ? submit.attr("formaction") : $(form).attr("action");
    const method = $(form).attr("method") || "POST";
    const data = $(form).serializeObject();
    const xhr = new XMLHttpRequest();

    if (submit.attr("name")) {
        data[submit.attr("name")] = submit.attr("value") || "";
    }
    submit.css("cursor", "not-allowed").prop("disabled", true);

    $.ajax({
        "url":     action,
        method,
        data,
        "xhr":     () => xhr,
        "success": parseHtml,
    });
}

function parseHtml(html, status, xhr) {
    document.documentElement.innerHTML = html;
    if (xhr) {
        History.replaceState(null, document.title, xhr.url);
    }

    $(document).ready(barterReady);
}

function serializeObject() {
    const o = {};
    // eslint-disable-next-line no-invalid-this
    const a = this.serializeArray();
    a.forEach((elem) => {
        if (o[elem.name] === undefined) {
            o[elem.name] = elem.value || "";
        } else {
            if (!o[elem.name].push) {
                o[elem.name] = [o[elem.name]];
            }
            o[elem.name].push(elem.value || "");
        }
    });
    return o;
}

function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue; let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function inRange(num1, num2, numTest) {
    const [min, max] = [parseInt(num1), parseInt(num2)].sort((a, b) => a > b);
    return numTest >= min && numTest <= max;
}

function versionToInteger(ver) {
    let i = 0;
    ver.split(".").reverse()
        .forEach((n, index) => {
            i += parseInt(n) * (10 ** (2 * index));
        });
    return i;
}

const stylesheet = `
    .spinner {
        -moz-animation: rotation .6s infinite linear;
        -o-animation: rotation .6s infinite linear;
        -webkit-animation: rotation .6s infinite linear;
        animation: rotation .6s infinite linear;
        border-bottom: 14px solid rgba(0, 104, 209, .15);
        border-left: 14px solid rgba(0, 104, 209, .15);
        border-radius: 100%;
        border-right: 14px solid rgba(0, 104, 209, .15);
        border-top: 14px solid rgba(0, 104, 209, .8);
        height: 70px;
        left: -moz-calc(50% - 35px);
        left: -o-calc(50% - 35px);
        left: -webkit-calc(50% - 35px);
        left: calc(50% - 35px);
        margin: 0px auto;
        position: fixed;
        top: -moz-calc(50% - 35px);
        top: -o-calc(50% - 35px);
        top: -webkit-calc(50% - 35px);
        top: calc(50% - 35px);
        width: 70px;
    }

    @-webkit-keyframes rotation {
        from { -webkit-transform: rotate(0deg); } to { -webkit-transform: rotate(359deg); }
    }

    @-moz-keyframes rotation {
        from { -moz-transform: rotate(0deg); } to { -moz-transform: rotate(359deg); }
    }

    @-o-keyframes rotation {
        from { -o-transform: rotate(0deg); } to { -o-transform: rotate(359deg); }
    }

    @keyframes rotation {
        from { transform: rotate(0deg); } to { transform: rotate(359deg); }
    }

    .strep {
        color: #777;
        margin-left: 5px;
        font-size: 90%;
    }

    .strep .plus {
        color: #090;
    }

    .strep .minus {
        color: #777;
    }

    .strep .minus.hasMinus {
        color: #d00;
        font-weight: bold;
    }

    #offerHeader {
        width: 115%;
    }

    .autocomplete {
        background: rgba(0, 0, 0, 0.6);
        display: none;
        left: 50%;
        margin-left: -20%;
        position: absolute;
        width: 45%;
    }

    .offerSlider .noUi-handle:after,
    .offerSlider .noUi-handle:before {
        display: none;
    }

    .offerSlider .noUi-tooltip {
        display: none;
        border: none;
        border-radius: unset;
        background: none;
        color: inherit;
        padding: unset;
        margin-bottom: -6px;
    }

    .offerSlider:hover .noUi-tooltip {
        display: block;
    }

    .offerSlider .noUi-connect {
        background-color: #fff;
    }

    .offerSlider .noUi-handle {
        border: 1px solid rgb(153, 17, 187);
        box-shadow: none;
        height: 20px;
        outline: none;
        width: 20px;
    }

    .offerSlider.noUi-target {
        background-color: rgba(153, 17, 187, 0.1);
        border: 1px solid rgb(153, 17, 187);
        box-shadow: none;
        float: right;
        height: 10px;
        margin: 7px;
        width: 70%;
    }

    .offerSlider.on {
        background-color: #fff;
    }

    @media screen and (max-width: 72em) {
        #bc {
            width: 10em !important;
            left: -11em !important; 
        }
    }

    @media screen and (max-width: 81em) {
        #bc {
            width: 10em !important;
            left: -11em !important; 
        }
    }

    @media screen and (max-width: 67em) {
        #bc {
            width: unset !important;
            left: unset !important; 
        }
    }
`;

init();
// ==/Code==
