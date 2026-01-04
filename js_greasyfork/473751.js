// ==UserScript==
// @name         Clean Britannica Dictionary UI
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      1.0
// @description  Clear elements at the top and add some buttons.
// @author       zica
// @match        https://www.britannica.com/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/473751/Clean%20Britannica%20Dictionary%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/473751/Clean%20Britannica%20Dictionary%20UI.meta.js
// ==/UserScript==

(function () {
    "use strict";

    clear_elements();
    tweak_elements();
    move_searchbar_and_entries_to_right();

    const fileType = "mp3"; // choose between mp3, ogg, and wav
    add_pronounce_button();
    generate_toggle_all_examples_button();


    function clear_elements() {
        document.getElementById("wrap_cr_t").remove(); // ad at the top
        // document.getElementById("wrap_c").style.margin = 0; // space on the left & right
        document.getElementsByClassName("section-links")[0].remove(); // top sections
        document.getElementById("main_title").remove(); // "The Britannica Dictionary"
        document.getElementById("ld_entries_v2_mainh").remove(); // the word
        const all_lines = document.getElementsByClassName("dline"); // Britannica Dictionary definition of ...
        const n = all_lines.length;
        // bcz all_lines changes immediately when we change it, we need to use this way of iterating to properly remove all
        for (let i = n - 1; i >= 0; --i) {
            all_lines[i].remove();
        }
    }

    function tweak_elements() {
        // short(in height) search box
        document.getElementsByClassName("ld_search_inp")[1].style.padding = "6px";
        // search button position
        Object.assign(document.getElementsByClassName("search_btn")[1].style, {
            top: "8px",
            right: "7px",
        });
        // short list box if it doesn't have that many items
        Object.assign(document.getElementsByClassName("o_list")[0].style, {
            height: "revert",
            maxHeight: "72px",
        });
        document.getElementById("ld_entries_v2_all").style.marginTop = 0; // margin at the top
        // highlight definitions
        for (const definition of document.getElementsByClassName("def_text")) {
            Object.assign(definition.style, {
                backgroundColor: "gray",
                color: "white",
                padding: "0 0.5em",
            });
        }
    }

    function move_searchbar_and_entries_to_right() {
        const entries = document.getElementById("ld_entries_v2_others_block");
        Object.assign(entries.style, {
            backgroundColor: "white"
        });
        const searchbar = document.getElementsByClassName("desktop_top")[0];
        const rightSide = document.getElementById("wrap_cr_br");
        Object.assign(searchbar.style, {
            width: getComputedStyle(rightSide).getPropertyValue("width"),
        });
        const toolbar = document.createElement("div");
        Object.assign(toolbar.style, {
            position: "sticky",
            top: 0,
            zIndex: Number.MAX_SAFE_INTEGER,
        });
        toolbar.append(searchbar);
        toolbar.append(entries);
        rightSide.prepend(toolbar);
        Object.assign(rightSide.style, {
            height: getComputedStyle(rightSide.parentElement).getPropertyValue("height"),
        });
    }

    function generate_toggle_all_examples_button() {
        const toggleAllExamples = document.createElement("input");
        Object.assign(toggleAllExamples.style, {
            borderRadius: "10px",
            position: "fixed",
            zIndex: Number.MAX_SAFE_INTEGER,
            bottom: "10vh",
            right: "5vh",
        });
        let toShow = true;
        Object.assign(toggleAllExamples, {
            type: "button",
            value: "show all examples",
            onclick: function () {
                for (const wrapper of document.getElementsByClassName("vi_more")) {
                    if (toShow !== wrapper.classList.contains("opened")) {
                        wrapper.firstElementChild.click();
                    }
                }
                toShow = !toShow;
                if (toShow) {
                    this.value = "show all examples";
                } else {
                    this.value = "hide all examples";
                }
            },
        });
        document.documentElement.prepend(toggleAllExamples);
    }

    function add_pronounce_button() {
        for (const icon of document.getElementsByClassName("play_pron")) {
            const path = icon.dataset.lang.replace('_', '/');
            const file = icon.dataset.file;
            const dir = icon.dataset.dir;
            const url = `https://media.merriam-webster.com/audio/prons/${path}/${fileType}/${dir}/${file}.${fileType}`;
            const audio = new Audio(url);

            const pronounce = document.createElement("input");
            Object.assign(pronounce.style, {
                borderRadius: "10px",
                marginLeft: "1em"
            });
            Object.assign(pronounce, {
                type: "button",
                value: "pronounce",
                onclick: audio.play.bind(audio)
            });
            icon.after(pronounce);
        }
    }
})();
