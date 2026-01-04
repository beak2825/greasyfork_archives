// ==UserScript==
// @name         WaniKani Item Lattice
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Recreates the item lattices that were previously removed from Wanikani
// @author       Wantitled
// @match        https://www.wanikani.com/users/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451758/WaniKani%20Item%20Lattice.user.js
// @updateURL https://update.greasyfork.org/scripts/451758/WaniKani%20Item%20Lattice.meta.js
// ==/UserScript==

// Checks for Wanikani Open Framework
if (!window.wkof){
    if(
        confirm(`Wanikani Item Lattice requires Wanikani Open Framework.
            Click "OK" to be forwarded to installation instructions.`)){
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'}
    return;
}

// Defines items globally
let items;
let section_states = {"radical":{loaded: false, display: false}, "kanji": {loaded: false, display: false}};

// Toggles the display of the item lattices (items by default are unloaded)
const toggle_section = (item_type) => {
    let title_span = document.getElementById(`${item_type}_span`);
    if (!section_states[item_type].loaded){
        title_span.innerText = "▼";
        section_states[item_type].loaded = !section_states[item_type].loaded;
        section_states[item_type].display = !section_states[item_type].display;
        build_lattice(item_type);
    } else {
        if (section_states[item_type].display){
            title_span.innerText = "▶";
            section_states[item_type].display = !section_states[item_type].display;
            document.getElementById(`${item_type}_lattice`).style.display = "none";
        } else {
            title_span.innerText = "▼";
            section_states[item_type].display = !section_states[item_type].display;
            document.getElementById(`${item_type}_lattice`).style.display = "flex";
        }
    }
}

// Config for wkof fetch
var wkof_config = {
    wk_items: {
        options: {assignments: true},
        filters: {item_type: ["rad", "kan"]}
    }
}

// div templates and definitions
const space = document.createElement("div");
const circle = document.createElement("a");
const text_container = document.createElement("div");
const rad_svg = document.createElement("svg");
rad_svg.setAttribute("xmlns", "https://www.w3.org/2000/svg");
rad_svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
rad_svg.setAttribute("style", `height: 1.5rem; width: 1.5rem;`);
const rad_img = document.createElement("img");
rad_img.setAttribute("style", `display: block; height: 1.5rem; width: 1.5rem;`)
space.setAttribute("style", `
    height: 3rem;
    width: 3rem;`
);
circle.setAttribute("style", `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    text-decoration: none;
    box-shadow: inset 0px -10px 13px -18px rgba(0, 0, 0, 0.50);`
)
circle.setAttribute("target", "_blank");
text_container.setAttribute("style", `
    text-decoration: none;
    font-size: 1.8rem;
    color: white;`
);


let lattice = document.createElement("div");
lattice.setAttribute("style", `
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 20px;`
);

let main_section = document.createElement("section");
main_section.setAttribute("style", `font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;`);
main_section.classList.add("container");
let main_section_title = document.createElement("h2");
main_section_title.setAttribute("style", `padding-bottom: 0.24em; border-bottom: 1px solid #d5d5d5; font-size: 28px;`)
main_section_title.innerText = "Item Lattices";
main_section.appendChild(main_section_title);

let sub_section = document.createElement("div");
let sub_section_title = document.createElement("h3");
let title_button = document.createElement("button");
title_button.setAttribute("style", `text-decoration: none; background: none; border: none;`);

// Start
wkof.include('ItemData');
wkof.ready('ItemData').then(get_items).then(initiate);

// Gets item data
async function get_items() {
    items = await wkof.ItemData.get_items(wkof_config);
}

// Filters items to get radicals or kanji
const get_items_of_type = (item_type, items_arr) => {
    let filtered_items = items_arr.filter(item_to_filter => item_to_filter.object === item_type);
    return filtered_items
}

// Sorts items by level
const sort_by_level = (filtered_items) => {
    filtered_items.sort((a,b) => a.data.slug - b.data.slug);
    filtered_items.sort((a,b) => a.data.level - b.data.level);
    return filtered_items
}

// Builds the item lattice for the given item type
const build_lattice = (item_type) => {
    let items_obj = sort_by_level(get_items_of_type(item_type, items));
    let type_lattice = lattice.cloneNode();
    items_obj.map((single_item_obj, index)=>{
        let item_space = space.cloneNode();
        let item_circle = circle.cloneNode();
        let item_container = text_container.cloneNode();
        item_space.setAttribute("key", index);
        let item_text = single_item_obj.data.characters;
        if (item_text === null){
            let svg_obj = single_item_obj.data.character_images.find(img => img.content_type === "image/svg+xml" && img.metadata.inline_styles === false);
            item_container.innerHTML = `<svg width="1.5rem" height="1.5rem"><image xlink:href=${svg_obj.url} width="1.5rem" height="1.5rem"/></svg>`
        } else {item_container.innerText = item_text;}
        item_circle.style.backgroundColor = get_item_color(single_item_obj);
        item_circle.setAttribute("href", single_item_obj.data.document_url);
        item_circle.setAttribute("title", capitalize(single_item_obj.data.slug));
        item_circle.appendChild(item_container);
        item_space.appendChild(item_circle);
        type_lattice.appendChild(item_space);
    })
    type_lattice.setAttribute("id", `${item_type}_lattice`);
    item_type === "radical" ? document.getElementById("radical_section").appendChild(type_lattice) : document.getElementById("kanji_section").appendChild(type_lattice);
}

const capitalize = (string) => {return string.charAt(0).toUpperCase() + string.slice(1)}

// Gets the corresponding color for the SRS level
const get_item_color = (item_obj) => {
    let item_level = item_obj.assignments?.srs_stage ?? 0;
    switch (item_level){
        case 0: return "#C8C8C8";
        case 1: return "#F100A0";
        case 2: return "#F100A0";
        case 3: return "#F100A0";
        case 4: return "#F100A0";
        case 5: return "#9A33B3";
        case 6: return "#9A33B3";
        case 7: return "#4765E0";
        case 8: return "#00A2F3";
        case 9: return "#FBC03D";
        default: return "#474747";
    }
}

const add_span = (text) => {
    let title_text = text === "kanji" ? "Kanji Lattice" : "Radical Lattice"
    let span_text = title_text + ` <span id="${text}_span" style="font-size: 0.6em; color: #888;">▶</span>`
    return span_text;
}

// Builds the lattice section
const build_section = (item_type) => {
    let item_section = sub_section.cloneNode();
    let item_button = title_button.cloneNode();
    let item_title = sub_section_title.cloneNode();
    item_title.innerHTML = add_span(item_type);
    item_button.addEventListener("click", () => {toggle_section(item_type)});
    item_button.appendChild(item_title);
    item_section.appendChild(item_button);
    item_section.setAttribute("id", `${item_type}_section`);
    return item_section;
}

function initiate() {
    'use strict';
    let radical_section = build_section("radical");
    let kanji_section = build_section("kanji");
    main_section.appendChild(radical_section);
    main_section.appendChild(kanji_section);
    let body_div = document.querySelector("body").querySelectorAll(".footer-adjustment")[0]
    body_div.insertBefore(main_section, body_div.querySelectorAll("script")[0]);
}