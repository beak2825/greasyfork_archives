// ==UserScript==
// @name         AO3: [Wrangling] Maximal relationship length checker
// @namespace    N/A
// @version      1.1.2
// @description  Calculate maximal relationship tag length based on attached characters. Does not take into account disambiguation drops!
// @author       Cascade
// @match        *://*.archiveofourown.org/tags/*/edit
// @match        *://*.archiveofourown.org/tags/*/wrangle?*show=relationships*&status=canonical*
// @match        *://*.archiveofourown.org/tags/*/wrangle?*status=canonical*&show=relationships*
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/530652/AO3%3A%20%5BWrangling%5D%20Maximal%20relationship%20length%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/530652/AO3%3A%20%5BWrangling%5D%20Maximal%20relationship%20length%20checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION ===

    class cfg {
        // Turns on and off printing the character counter box for a rel if the maximal rel length is calculated to be <=100. (still prints errors). Default: false
        static VERBOSE = false;

        // Turns on and off running in the Canonical Relationship bins. Default: true
        static RUN_IN_BINS = true;

        // Turns off and on printing the character counter box if the actual rel tag length is already >100 (the assumption being that the tag has already been
        // renamed and doesn't need further actioning). Default: true
        static IGNORE_ALREADY_RENAMED = true;

        constructor() {}
    }

    // === END CONFIGURATION ===

    const EDIT_PAGE = 0;
    const BIN_PAGE = 1;
    const OLD_REL_LENGTH = 100;

    // "Abstract" base class, inherited by concrete implementation classes for parsing tags on different pages
    class Tag {
        constructor() {
            if (this.constructor == Tag) {
                throw new Error("Can't construct abstract base class");
            }
        }

        is_return_early() {
            throw new Error("Method is_return_early must be implemented");
        }

        get_attached_characters() {
            throw new Error("Method get_attached_characters must be implemented");
        }

        get_rel_text() {
            throw new Error("Method get_rel_text must be implemented");
        }

        print_location() {
            throw new Error("Method print_location must be implemented");
        }
    }

    class EditPageTag extends Tag {
        is_return_early() {
            return !this.is_canonical_rel() || (cfg.IGNORE_ALREADY_RENAMED && this.get_rel_text().length > OLD_REL_LENGTH);
        }

        get_attached_characters() {
            return document.querySelectorAll('#parent_Character_associations_to_remove_checkboxes ul li a');
        }

        get_rel_text() {
            return document.getElementById('tag_name').value;
        }

        print_location() {
            return document.querySelector("#edit_tag > fieldset > dl > dd");
        }

        is_canonical_rel() {
            return document.getElementById('tag_canonical').hasAttribute("checked") && document.querySelector("#edit_tag > fieldset > dl > dd > strong").textContent == "Relationship";
        }
    }

    class BinPageTag extends Tag {
        #tag_node;

        constructor(tag_node) {
            super();
            this.#tag_node = tag_node;
        }

        is_return_early() {
            return cfg.IGNORE_ALREADY_RENAMED && this.get_rel_text().length > OLD_REL_LENGTH;
        }

        get_attached_characters() {
            return this.#tag_node.querySelectorAll('td[title="characters"] ul li a');
        }

        get_rel_text() {
            return this.#tag_node.querySelector('[title="tag"] label').innerText;
        }

        print_location() {
            return this.#tag_node.querySelector('[title="tag"]');
        }
    }

    class ZeroCharactersError extends Error {
        constructor() {
            super();
        }
    }

    const getPageType = function getPageType() {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;

        if (currentPath.match(/\/edit$/)) {
            return EDIT_PAGE;
        }
        if (currentPath.match(/\/wrangle/) && currentSearch.match(/\?.*show\=relationships.*/) && currentSearch.match(/\?.*status\=canonical.*/)) {
            return BIN_PAGE;
        }
        throw new Error("Can't identify page type");
    };

    const tagFactory = function tagFactory(node = null) {
        switch(getPageType()) {
            case EDIT_PAGE:
                return new EditPageTag();
            case BIN_PAGE:
                return new BinPageTag(node);
            default:
                break;
        }
    };

    const SLASH = "slash";
    const AMPERSAND = "ampersand";
    const ORIGINAL_CHARACTERS = "Original Character(s)";
    const ORIGINAL_MALE_CHARACTERS = "Original Male Character(s)";
    const ORIGINAL_FEMALE_CHARACTERS = "Original Female Character(s)";
    const READER_CHARACTER = "Reader";
    const YOU_CHARACTER = "You";
    const EVERYONE_CHARACTER = "Everyone";
    const UNDISCLOSED_CHARACTER = "Undisclosed";
    const OTHER_CHARACTER = "Other(s)";
    const FANWORK_CREATOR_CHARACTER = "Me | Fanwork Creator(s)";
    const SPECIAL_CHARACTERS = [ORIGINAL_CHARACTERS, ORIGINAL_MALE_CHARACTERS, ORIGINAL_FEMALE_CHARACTERS, READER_CHARACTER, YOU_CHARACTER, EVERYONE_CHARACTER,
                                UNDISCLOSED_CHARACTER, OTHER_CHARACTER, FANWORK_CREATOR_CHARACTER];
    const NOTIF_BOX_PREFACE = "Maximal relationship tag length: ";

    const get_character_count = function get_character_count(tag) {
        const characters = tag.get_attached_characters();
        var char_count = 0;
        var num_characters = 0;

        // Counting up attached characters, unless they are ~special~ (remember, doesn't account for disambig dropping!)
        if (characters !== null) {
            if (characters.length == 0) throw new ZeroCharactersError("No characters attached to rel!");

            characters.forEach((character) => {
                if (SPECIAL_CHARACTERS.indexOf(character.innerText) === -1) {
                    char_count += character.innerText.length;
                    num_characters += 1;
                }
            });
        }

        // Adding additional length on ~special case~ rels with characters that don't get attached
        const rel_split = tag.get_rel_text().split(/\/| \& /);
        rel_split.forEach((character, index) => {
            switch (true) {
                case [ORIGINAL_CHARACTERS, "Original Character", "Original Characters", "OC", "OCs", "OC(s)"].includes(character):
                    char_count += ORIGINAL_CHARACTERS.length;
                    num_characters += 1;
                    break;
                case [ORIGINAL_MALE_CHARACTERS, "Original Male Character", "Original Male Characters", "OMC", "OMCs", "OMC(s)"].includes(character):
                    char_count += ORIGINAL_MALE_CHARACTERS.length;
                    num_characters += 1;
                    break;
                case [ORIGINAL_FEMALE_CHARACTERS, "Original Female Character", "Original Female Characters", "OFC", "OFCs", "OFC(s)"].includes(character):
                    char_count += ORIGINAL_FEMALE_CHARACTERS.length;
                    num_characters += 1;
                    break;
                case [READER_CHARACTER, "Reader(s)"].includes(character):
                    char_count += READER_CHARACTER.length;
                    num_characters += 1;
                    break;
                case [YOU_CHARACTER].includes(character):
                    char_count += YOU_CHARACTER.length;
                    num_characters += 1;
                    break;
                case [EVERYONE_CHARACTER].includes(character):
                    char_count += EVERYONE_CHARACTER.length;
                    num_characters += 1;
                    break;
                case [UNDISCLOSED_CHARACTER].includes(character):
                    char_count += UNDISCLOSED_CHARACTER.length;
                    num_characters += 1;
                    break;
                case [OTHER_CHARACTER, "Other", "Others"].includes(character):
                    char_count += OTHER_CHARACTER.length;
                    num_characters += 1;
                    break;
                case [FANWORK_CREATOR_CHARACTER, "Me | Fanwork Creator", "Me | Fanwork Creators"].includes(character):
                    char_count += FANWORK_CREATOR_CHARACTER.length;
                    num_characters += 1;
                    break;
                default:
                    // Rels with multiple instances of the same character.
                    if (index > 0 && (character.split(" (")[0] == rel_split[index - 1])) {
                        char_count += character.length;
                        num_characters += 1;
                    }
                    break;
            }
        });

        const counts = new Map();

        // Last step of counting is adding up the contribution from delimiters
        counts.set(SLASH, char_count + (num_characters - 1));
        counts.set(AMPERSAND, char_count + (num_characters - 1) * 3);

        return counts;
    };

    const construct_text = function construct_text(count, rel_type) {
        const count_element = document.createElement('span');

        count_element.textContent = `${rel_type} rel = ${count}`;

        // Mark potential rels to extend with EMPHASIS. Don't forget to manually verify!
        if (count > OLD_REL_LENGTH) {
            count_element.style.fontWeight = 'bold';
            count_element.style.textShadow = "1px 1px 1px #ffffff";
        }
        return count_element;
    };

    const print_count = function print_count(tag) {
        const counts = get_character_count(tag)

        if (!cfg.VERBOSE && Math.max(...counts.values()) <= OLD_REL_LENGTH) return;

        const print_location = tag.print_location();
        const div_count_element = document.createElement('div');

        const combined_count_element = document.createElement('p');
        combined_count_element.title = "Remember, this counter doesn't drop disambigs! If the maximal length calculated is >100, it's just intended as an indication to double check.";
        combined_count_element.appendChild(document.createTextNode(NOTIF_BOX_PREFACE));

        // Generate the counts!
        combined_count_element.appendChild(construct_text(counts.get(SLASH), SLASH));
        combined_count_element.appendChild(document.createTextNode(" | "));
        combined_count_element.appendChild(construct_text(counts.get(AMPERSAND), AMPERSAND));
        if (Math.max(...counts.values()) > OLD_REL_LENGTH) {
            div_count_element.classList.add("caution");
        }
        else {
            div_count_element.classList.add("notice");
        }

        div_count_element.appendChild(combined_count_element);
        print_location.appendChild(div_count_element);
    };

    const print_error = function print_error(tag) {
        const print_location = tag.print_location();
        const div_error_element = document.createElement('div');
        const error_element = document.createElement('p');

        // Yell if no characters are attached
        error_element.appendChild(document.createTextNode(NOTIF_BOX_PREFACE));
        const zero_count_element = document.createElement('span');
        zero_count_element.style.fontWeight = 'bold';
        zero_count_element.textContent = "NO CHARACTERS ATTACHED TO REL!";
        error_element.appendChild(zero_count_element);
        div_error_element.classList.add("error");

        div_error_element.appendChild(error_element);
        print_location.appendChild(div_error_element);
    };

    const run_counter = function run_counter(tag) {
        if (tag.is_return_early()) return;

        try {
            print_count(tag);
        }
        catch (e) {
            if (e instanceof ZeroCharactersError) print_error(tag);
            else throw e;
        }
    }

    if (cfg.RUN_IN_BINS && getPageType() == BIN_PAGE) {
        const all_rels = document.querySelectorAll('#wrangulator [title="tag"]');
        if (all_rels !== null) {
            all_rels.forEach((rel) => {
                const tag = tagFactory(rel.parentNode);
                run_counter(tag);
            });
        }
    }
    else if (getPageType() == EDIT_PAGE) {
        const tag = tagFactory();
        run_counter(tag);
    }
})();