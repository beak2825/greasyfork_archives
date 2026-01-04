// ==UserScript==
// @name         SteamTrades - Have List Filter (Barter.vg)
// @icon         https://cdn.steamtrades.com/img/favicon.ico
// @namespace    Revadike
// @author       Revadike
// @version      2.0.0
// @description  Check if you own the games from someone's have list (instant Compare2Steam) using Barter.vg
// @support      https://www.steamgifts.com/discussion/fN8vR/
// @match        https://www.steamtrades.com/trade/*
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382106/SteamTrades%20-%20Have%20List%20Filter%20%28Bartervg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382106/SteamTrades%20-%20Have%20List%20Filter%20%28Bartervg%29.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(addFilter);

function addFilter() {
    const filter = $(`<div>`, {
        id: `filterBtn`,
        class: `btn_action green`,
        style: `z-index: 16777271; position: fixed; right: 1em; bottom: 1em;`,
        html: `<span><i class="fa fa-filter"></i> Filter</span>`
    });

    filter.appendTo(`body`);
    filter.click(addSelectorGadget);
}

function addSelectorGadget() {
    $(`#filterBtn`).hide();

    if (unsafeWindow.selector_gadget) {
        unsafeWindow.selector_gadget.rebind();
        setupSelectorGadget();
    } else {
        $.getScript(`https://dv0akt2986vzh.cloudfront.net/unstable/lib/selectorgadget.js`, () => {
            wait_for_script_load(`selector_gadget`, setupSelectorGadget);
        });
    }
}

function setupSelectorGadget() {
    let modscript = `line = line.toLowerCase(); line = line.replace("(Early Access)", "");`;
    const btnOk = $(`<input>`, { type: `button`, class: `sg_ignore`, value: `Finish` });
    const btnJs = $(`<input>`, { type: `button`, class: `sg_ignore`, value: `JS` });
    const SG = unsafeWindow.selector_gadget;

    btnOk.on(`click`, () => finishFilter(SG, modscript))
    btnJs.on(`click`, () => modscript = prompt(`Custom javascript to modify 'line' variable (each line)`, modscript));

    SG.sg_div.append(btnOk);
    SG.sg_div.prepend(btnJs);

    $(selector_gadget.sg_div).find(`[value=XPath]`).remove();
    $(selector_gadget.sg_div).find(`[value=X]`).click(() => $(`#filterBtn`).show());
}

function finishFilter(SG, modscript) {
    const selector = SG.path_output_field.value;

    if (selector === `No valid path found.`) {
        alert(`Please highlight the element(s) containing the games to filter`);
        return;
    }

    const bulk_input = getLines(selector).map(line => {
        eval(modscript);
        return line;
    }).join(`\n`);

    if (bulk_input.length > 40000) {
        alert(`Input too large. Please select fewer elements or reduce the input using JS.`);
        return;
    }

    const form = $(`<form>`, { action: `https://barter.vg/u/my/c/e/`, method: `POST`, target: `_blank` });
    form.append($(`<input>`, { type: `hidden`, name: `bulk_input`, value: bulk_input }));
    form.append($(`<input>`, { type: `hidden`, name: `action`, value: `Edit` }));

    $(`body`).append(form);
    form.submit();

    SG.unbind();
    $(`#filterBtn`).show();
}

function getLines(selector) {
    return [].concat(...$(selector).get().map((elem) => elem.innerText.split(`\n`)));
}