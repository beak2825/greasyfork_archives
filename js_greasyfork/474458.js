// ==UserScript==
// @name         AO3: Reorder Tags with Drag & Drop
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      3.0
// @description  drag & drop tags into the order you'd like before posting
// @author       escctrl
// @match        https://*.archiveofourown.org/works/new
// @match        https://*.archiveofourown.org/works/*/edit
// @match        https://*.archiveofourown.org/works/*/edit_tags
// @exclude      https://*.archiveofourown.org/works/*/chapters/*/edit
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js
// @require      https://update.greasyfork.org/scripts/491896/1516188/Copy%20Text%20and%20HTML%20to%20Clipboard.js
// @require      https://update.greasyfork.org/scripts/541008/1615671/AO3%3A%20Initialize%20webix%20GUI.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474458/AO3%3A%20Reorder%20Tags%20with%20Drag%20%20Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/474458/AO3%3A%20Reorder%20Tags%20with%20Drag%20%20Drop.meta.js
// ==/UserScript==

/* global Sortable, copy2Clipboard, q, qa, webix, $$, createMenu, initGUI */

'use strict';

// utility to reduce verboseness (already declared in library)
// const q = (selector, node=document) => node.querySelector(selector);
// const qa = (selector, node=document) => node.querySelectorAll(selector);
const ins = (n, l, html) => n.insertAdjacentHTML(l, html);

/* What's happening:
 * each autocomplete has a corresponding hidden input field [id^="work_"] which is the thing actually used during form submission
 * its value attribute(!) is fixed, and contains a comma-separated list of tags previously saved on this work
 * every time a tag is added through the autocomplete, its value property(!) is updated - the new tag is added at the end
 * when tags are reordered, the value property(!) has to be updated accordingly, or the initial order will be saved
 */

const cfg = 'reorder_tags'; // name of dialog and localstorage used throughout

const defaults = [{key: "useColors", val: 0},
                  {key: "ft", val: '#000000'},
                  {key: "fb", val: '#e6cfcf'},
                  {key: "dt", val: '#000000'},
                  {key: "db", val: '#cde1d2'},];
const storedConfig = getConfig('stored'); // returns object with key: value pairs

// SVGs from Remix Icon https://remixicon.com (Apache license Copyright (c) RemixIcon https://remixicon.com/license)
const icon_pin = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 3V5H17V11L19 14V16H13V23H11V16H5V14L7 11V5H6V3H18Z"></path></svg> `;
const icon_trash = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"></path></svg>`;
const icon_copy = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path></svg>`;
ins(q("head"), 'beforeend', `<style type="text/css"> li.added svg, .reorder-copy, .reorder-delete { width: 1em; height: 1em; display: inline-block; vertical-align: -0.125em; }
${ storedConfig.useColors === 1 ? `li.added.tag { color: ${storedConfig.dt}; background-color: ${storedConfig.db}; padding: 0.3em 0 0.2em 0.2em; }
li.added.tag.fixed { color: ${storedConfig.ft}; background-color: ${storedConfig.fb}; }` : "" } li.added.tag:hover { cursor: default; } li.added.tag.fixed:hover { cursor: no-drop; }
</style>`);

const inputs = new Map();
const fixed = new Map();
const sortable = {};

// on page load: for each field check for fixed tags and make the rest sortable
["fandom", "relationship", "character", "freeform"].forEach((type) => {
    inputs.set(type, q(`dd.${type} ul.autocomplete`))

    // previously added tags are always placed where they used to be by AO3. it refuses to move them. so let's not act like we can.
    // this is heavy: grab each tag type group's old <input value="">, split it by comma, trim spaces off the tagnames and store them in an Array to the Map
    var og_tags = q(`#work_${type}`).getAttribute('value').split(",").map( (tag) => tag.trim() );
    fixed.set(type, og_tags);
    checkAddedTags(type);

    // make the various <ul> sortable. newly added tags are recognized and sortable automatically
    // instead of filtering .input, we make only .tag draggable to avoid problems (autocomplete selection by mouse, dragging without clicking outside the <input>)
    sortable[type] = new Sortable(inputs.get(type), { draggable: ".tag:not(.fixed)" });

    // add copy & delete buttons under each group
    ins(q(`dt.${type}`), 'beforeend', `<button type="button" class="reorder-copy" title="Copy ${type} tags to the Clipboard as a comma-separated list">${icon_copy}</button>
    <button type="button" class="reorder-delete" title="Removes all ${type} tags at once">${icon_trash}</button>`);
});

// when tags get added: are they a duplicate of something already in the list? --> remove it
// were they previously saved (deleted and re-added)? --> slot it back in where it was and show it as fixed
const observer = new MutationObserver(function(mutList, obs) {
    for (const mut of mutList) {
        for (const node of mut.addedNodes) { // should only ever be one at a time, but better safe than sorry
            if (node.matches("li.added.tag:not(.sortable-ghost)")) { // skip checks when we're seeing drag&drops
                obs.disconnect(); // gotta stop watching or our own DOM changes turn this into an infinite loop
                checkAddedTags(mut.target.parentElement.classList[0]); // checks if the added tag will actually be sortable by AO3
                startObserving(); // restart observing after our DOM changes are done
            }
        }
    }
});
function startObserving() {
    inputs.forEach((elem) => observer.observe(elem, { attributes: false, childList: true, subtree: false }));
}
startObserving();

// on form submit: put everything in the order it's now supposed to be
document.addEventListener("submit", function() {
    ["fandom", "relationship", "character", "freeform"].forEach((type) => {
        let tags = [];
        for (let added_tag of qa("li.added.tag", inputs.get(type))) {
            tags.push(added_tag.innerText.slice(0, -1).trim());
        }
        q(`#work_${type}`).value = tags.join(",");
    });
});

// when tags get added: were they previously saved (deleted and re-added)? --> slot it back in where it was and show it as fixed
function checkAddedTags(type) {
    let added_arr = Array.from(qa("li.added.tag", inputs.get(type))).map((t) => t.innerText.slice(0, -1).trim()); // the current list of tags
    for (let added_tag of qa("li.added.tag", inputs.get(type))) {
        // check tags if they were saved before. if so, give them a fixed class and some user hints
        let tagname = added_tag.innerText.slice(0, -1).trim();
        if (!added_tag.classList.contains('fixed') && fixed.get(type).includes(tagname)) {
            added_tag.classList.add('fixed');
            added_tag.title = "Sorry, this tag can't be reordered";
            ins(added_tag, 'afterbegin', icon_pin);

            // step 1: what was its original index?
            const og_pos = fixed.get(type).indexOf(tagname);

            // step 2: find a predecessor that's still there
            var pre_pos = -1;
            for (let i = og_pos-1; i >= 0; i--) { // walk backwards through the preceeding og tags
                pre_pos = added_arr.indexOf(fixed.get(type)[i]); // check if this og tag is still in the list (if not: -1)
                if (pre_pos > -1) break; // stop if we found one
            }

            // step 3a: if no og predecessor was found anymore, move the added tag to the beginning of the current tags
            if (pre_pos === -1) inputs.get(type).prepend(added_tag);
            // step 3b: if an og predecessor was found, move the added tag behind it
            else inputs.get(type).children[pre_pos].after(added_tag);
        }
        else added_tag.title = "Drag tag to reorder";
    }
}

q("#work-form").addEventListener("click", function(e) {
    let delegate = e.target.closest("button.reorder-copy") || e.target.closest("button.reorder-delete");
    if (e.target.closest("button.reorder-copy")) { // copy tags as a comma-separated list
        var str = Array.from(qa("li.added.tag", delegate.parentElement.nextElementSibling)).map( (tag) => tag.innerText.slice(0, -1).trim() );
        str = str.join(",");
        copy2Clipboard(e, "txt", str);
    }
    else if (e.target.closest("button.reorder-delete")) { // delete all tags
        for (let x of qa("li.added.tag .delete a", delegate.parentElement.nextElementSibling)) {
            x.click();
        }
    }
});

/***************** CONFIG DIALOG *****************/

(async function() {
    // Library function: creates the "Userscripts" menu item with (id, heading) parameters
    createMenu(cfg, "Reorder Tags");

    // config rarely is opened, so we avoid running through its setup on every page load by initializing only on first click (it adds a listener for subsequent clicks)
    q("#opencfg_"+cfg).addEventListener("click", async function(e) {
        // Library function: initializes webix and the window component with (id, heading, maxWidth, views that may need to be styled) parameters
        //                   returns the (empty) layout component to which all other webix "views" can be added
        let innerLayout = await initGUI(e, cfg, "Reorder Tags", 500, [cfg, defaults[1].key+"Picker", defaults[2].key+"Picker", defaults[3].key+"Picker", defaults[4].key+"Picker"]);
        if (innerLayout !== false) createDialog(innerLayout);
    }, { once: true });

    // this function fills the webix window and shows it
    function createDialog(container) {

        $$(container).addView( // gets the "container" layout in which everything can be added
            { view:"form", id:cfg+"_form", elements:[ // alias for rows
                { // color toggle
                    view: "switch", value:storedConfig.useColors, name:defaults[0].key, id:defaults[0].key,
                    labelRight:"Use colors on tags", labelWidth: "auto"
                },
                { cols:[
                    { rows:[ // labels in separate column to make things align nicely
                        { view: "template", template: "Fixed tags - text:", type: "clean" },
                        { view: "template", template: "Fixed tags - background:", type: "clean" },
                        { view: "template", template: "Draggable tags - text:", type: "clean" },
                        { view: "template", template: "Draggable tags - background:", type: "clean" },
                    ]},
                    { rows:[
                        { // colorpicker - fixed tags text color
                            view:"colorpicker", value:storedConfig.ft, name:defaults[1].key, id:defaults[1].key, clear: true,
                            label:"Fixed tags - text:", labelWidth: 0,
                            suggest: { type:"colorselect", body: { button:true }, id:defaults[1].key+"Picker", css: "darkmode" }
                        },
                        { // colorpicker - fixed tags background color
                            view:"colorpicker", value:storedConfig.fb, name:defaults[2].key, id:defaults[2].key, clear: true,
                            label:"Fixed tags - background:", labelWidth: 0,
                            suggest: { type:"colorselect", body: { button:true }, id:defaults[2].key+"Picker", css: "darkmode" }
                        },
                        { // colorpicker - draggable tags text color
                            view:"colorpicker", value:storedConfig.dt, name:defaults[3].key, id:defaults[3].key, clear: true,
                            label:"Draggable tags - text:", labelWidth: 0,
                            suggest: { type:"colorselect", body: { button:true }, id:defaults[3].key+"Picker", css: "darkmode" }
                        },
                        { // colorpicker - draggable tags background color
                            view:"colorpicker", value:storedConfig.db, name:defaults[4].key, id:defaults[4].key, clear: true,
                            label:"Draggable tags - background:", labelWidth: 0,
                            suggest: { type:"colorselect", body: { button:true }, id:defaults[4].key+"Picker", css: "darkmode" }
                        },
                    ]},
                ]},
                { cols:[ // buttonbar
                    {
                        view:"button", value:"Reset",
                        click: function() { // revert all values to the default in the GUI and delete the stored config
                            $$(cfg+"_form").setValues(getConfig('default'));
                            localStorage.removeItem(cfg);
                            $$(cfg).hide(); // close the dialog
                        }
                    },
                    {
                        view:"button", value:"Cancel",
                        click: function() { $$(cfg).hide(); } // close the dialog
                    },
                    {
                        view:"button", value:"Save", css:"webix_primary",
                        click: function() {
                            let selected = $$(cfg+"_form").getValues();
                            localStorage.setItem(cfg, JSON.stringify(selected));
                            $$(cfg).hide(); // close the dialog
                        }
                    }
                ]}
        ]}, 0);

        $$(cfg).show();
    }
})();

function getConfig(type) {
    let def = {
        [defaults[0].key]: defaults[0].val,
        [defaults[1].key]: defaults[1].val,
        [defaults[2].key]: defaults[2].val,
        [defaults[3].key]: defaults[3].val,
        [defaults[4].key]: defaults[4].val
    };
    if (type === 'default') return def;
    else if (type === 'stored') return JSON.parse(localStorage.getItem(cfg)) ?? def;
    else return false;
}
