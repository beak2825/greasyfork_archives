// ==UserScript==
// @name         Profile Info
// @namespace    sullenProfileInfo
// @version      0.7.1
// @description  Stores and displays information on player profile pages
// @author       sullengenie [1946152]
// @match        *://*.torn.com/profiles.php?XID=*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33347/Profile%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/33347/Profile%20Info.meta.js
// ==/UserScript==

// Some code kindly contributed by miros [1848626]

(function() {
    'use strict';

    const tag_colors = {
        tbd: 'inherited',
        easy: 'rgba(161, 248, 161, 1)',
        medium: 'rgba(231, 231, 104, 1)',
        impossible: 'rgba(242, 140, 140, 0.7)'
    };

    // Utility code from Peaceful Elimination by Mauk [1494436]
    const create_html = (html) => document.createRange().createContextualFragment(html);
    const insert_before = (nodes, target) => target.parentNode.insertBefore(nodes, target);
    const insert_after  = (nodes, target) => target.parentNode.insertBefore(nodes, target.nextSibling);

    const button_style = (color) => `.profile-button-attack { background: linear-gradient(180deg, #ebebeb, ${color}) !important; }`;
    const color_button = function(color) {
        document.getElementById('difficulty-profile-button-style').innerText = button_style(color);
    };

    // A button which other scripts can click to update attack button color
    const invis_elt = create_html('<div id="sullen-update-button" style="display:none"></div>');

    const automatic_tags = JSON.parse(localStorage.automaticProfileInfo || '{}');
    const manual_tags = JSON.parse(localStorage.sullenProfileInfo || '{}');
    const player_id = parseInt(window.location.href.match(/XID=(\d+)/)[1]);
    const initial_player_info = Object.assign({}, automatic_tags, manual_tags)[player_id] || {};
    const initial_manual_difficulty = (manual_tags[player_id] && manual_tags[player_id].difficulty) || 'tbd';
    const initial_difficulty = initial_player_info.difficulty || 'tbd';
    const initial_notes = initial_player_info.notes || 'Write player notes here. They will automatically save!';


    function update_button() {
        const difficulty = get_player_difficulty();
        color_button(tag_colors[difficulty]);
        if (document.getElementById('difficulty-profile-title')) {
            update_panel_title();
        }
    }

    function update_tags(f) {
        let tags = JSON.parse(localStorage.sullenProfileInfo || '{}');
        f(tags);
        localStorage.sullenProfileInfo = JSON.stringify(tags);
    }

    function update_player(vals) {
        update_tags(tags => tags[player_id] = Object.assign({}, tags[player_id], vals));
    }

    function update_hidden(val) {
        update_tags(tags => tags.hidden = val);
    }

    function player_info() {
        const auto_tags = JSON.parse(localStorage.automaticProfileInfo || '{}');
        const manual_tags = JSON.parse(localStorage.sullenProfileInfo || '{}');
        return Object.assign({}, auto_tags[player_id], manual_tags[player_id]);
    }

    function get_player_difficulty() {
        return (player_info().difficulty) || 'tbd';
    }

    function get_player_notes() {
        return player_info().notes || '';
    }

    function update_difficulty(menu) {
        const difficulty = menu.value;
        update_tags((tags) => {
            if (difficulty === 'tbd' && tags[player_id] && tags[player_id].difficulty) {
                delete tags[player_id].difficulty;
                delete tags[player_id].difficultyTimestamp;
            } else {
                if (tags[player_id] === undefined) {
                    tags[player_id] = {};
                }
                tags[player_id].difficulty = difficulty;
                tags[player_id].difficultyTimestamp = Date.now();
            }
        });
        color_button(tag_colors[get_player_difficulty()]);
    }

    function update_notes(notes) {
        update_player({notes: notes.value});
    }

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    const MAX_NOTES_LENGTH = 58;

    function summarize(notes) {
        if (notes.length <= MAX_NOTES_LENGTH) {
            return notes;
        } else {
            return notes.substring(0, MAX_NOTES_LENGTH - 3) + '...';
        }
    }

    const title_arrow = '<div class="arrow-wrap"><i class="accordion-header-arrow right" id="profile-info-arrow"></i></div>';

    function age_string(timestamp) {
        return `${Math.floor((Date.now() - timestamp) / 1000 / 60 / 60 / 24)} days ago`;
    }

    function panel_title() {
        const tags = player_info();
        let difficulty_timestamp;
        if (tags.difficultyTimestamp) {
            difficulty_timestamp = new Date();
            difficulty_timestamp.setTime(tags.difficultyTimestamp);
        }
        const difficulty = get_player_difficulty();
        return `
${title_arrow}
Profile Info
<span class="panel-title-difficulty ptd-${difficulty}">${difficulty === 'tbd' ? '' : difficulty.capitalize() +
            ' (' + (difficulty_timestamp ? age_string(difficulty_timestamp) : 'automatic') + ')'}</span>
<span class="panel-title-notes">${summarize(get_player_notes())}</span>`;
    }

    function update_panel_title() {
        document.getElementById('difficulty-profile-title').innerHTML = panel_title();
    }

    function set_clipboard(value) {
        var tempInput = document.createElement("input");
        tempInput.style = "position: absolute; left: -1000px; top: -1000px";
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    }

    function export_notes() {
        set_clipboard(localStorage.sullenProfileInfo);
        alert('Your notes data has been copied to your clipboard. Paste it somewhere safe for future import.');
    }

    function export_notes_onclick() {
        const export_button = document.getElementById('sullen-export-button');
        export_button.onclick = export_notes;
    }

    function import_notes() {
        const s = window.prompt('Please paste your exported notes. Proceed with caution, these will overwrite your current notes!', 'Paste them here');
        if (s === null) return;
        try {
            JSON.parse(s);
            localStorage.sullenProfileInfo = s;
        } catch(error) {
            alert('Invalid import data. Player notes were not imported.');
        }
    }

    function import_notes_onclick() {
        const import_button = document.getElementById('sullen-import-button');
        import_button.onclick = import_notes;
    }

    const profile_info_panel = () => create_html(`
<div class="profile-wrapper m-top10">
<div>
<div class="title-black top-round ${manual_tags.hidden ? 'all-round' : 'active'}" id="difficulty-profile-title">
${panel_title()}
</div>
<div class="cont bottom-round">
<div class="profile-container basic-info bottom-round" id="difficulty-profile-body" style="display:${manual_tags.hidden ? 'none' : 'block'}">
<div style="padding: 10px">
<select id="difficulty-dropdown" style="margin: 0px 10px 0px 0px" onchange="update_difficulty(this)">
<option ${initial_manual_difficulty === 'tbd' ? 'selected="selected"' : ''} value="tbd">Difficulty</option>
<option ${initial_manual_difficulty === 'easy' ? 'selected="selected"' : ''} value="easy">Easy</option>
<option ${initial_manual_difficulty === 'medium' ? 'selected="selected"' : ''} value="medium">Medium</option>
<option ${initial_manual_difficulty === 'impossible' ? 'selected="selected"' : ''} value="impossible">Impossible</option>
</select>
<textarea id="difficulty-notes" rows="10" cols="50">${initial_notes}</textarea>
<button id="sullen-export-button">Export</button>
<button id="sullen-import-button">Import</button>
</div>
</div>
</div>
</div>
</div>`);

    function add_title_toggle_onclick() {
        const title_node = document.getElementById('difficulty-profile-title');
        const body_node = document.getElementById('difficulty-profile-body');
        title_node.onclick = function() {
            if (body_node.style.display !== 'none') {
                body_node.style.display = 'none';
                update_hidden(true);
                title_node.classList.add('all-round');
                title_node.classList.remove('active');
            } else {
                body_node.style.display = 'block';
                update_hidden(false);
                title_node.classList.remove('all-round');
                title_node.classList.add('active');
            }
        };
    }

    function add_difficulty_onchange() {
        const dropdown = document.getElementById('difficulty-dropdown');
        dropdown.onchange = () => {
            update_difficulty(dropdown);
            update_panel_title();
        };
    }

    function add_notes_oninput() {
        const notes = document.getElementById('difficulty-notes');
        notes.oninput = () => {
            update_notes(notes);
            update_panel_title();
        };
    }

    function add_info_panel(medal_wrapper) {
        insert_before(profile_info_panel(), medal_wrapper);
        add_title_toggle_onclick();
        add_difficulty_onchange();
        add_notes_oninput();
        export_notes_onclick();
        import_notes_onclick();
    }

    const is_medals_wrapper = (node) => node.classList !== undefined && node.classList.contains('medals-wrapper');

    // Adds the profile info panel once the medals wrapper has loaded
    function wait_for_medals_wrapper() {
        let target = document.querySelector('div.user-profile');
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes.item(i);
                    if (is_medals_wrapper(node)) {
                        add_info_panel(node);
                        this.disconnect();
                        break;
                    }
                }
            }.bind(this));
        });
        let config = { attributes: true, childList: true, characterData: true };
        observer.observe(target, config);
    }

    // Waits for the medals wrapper panel once the page has loaded initially
    function wait_for_page_load() {
        let target = document.getElementById('profileroot').firstElementChild;
        let observer = new MutationObserver(function(mutations) {
            wait_for_medals_wrapper();
            this.disconnect();
        });
        let config = { attributes: true, childList: true, characterData: true };
        observer.observe(target, config);
    }

    function init() {
        // Wait for enough elements to load so that we can add the profile info panel
        wait_for_page_load();

        GM_addStyle(`
#difficulty-profile-title { cursor: pointer; }
#difficulty-profile-body * { vertical-align:top; }
.all-round { border-radius: 5px !important; }
.active #profile-info-arrow { margin: 11px 10px 0 0; }
#profile-info-arrow { margin: 9px 12px 0 0; }
.panel-title-difficulty { margin-left: 1em; }
.ptd-easy   { color: ${tag_colors.easy}; }
.ptd-medium { color: ${tag_colors.medium}; }
.ptd-impossible   { color: ${tag_colors.impossible}; }
.panel-title-notes { margin-left: 2em; font-size: 90%; }
`);


        // Add button style element
        document.body.appendChild(create_html('<style id="difficulty-profile-button-style"></style>'));
        color_button(tag_colors[initial_difficulty || 'tbd']);

        // Add invisible button which other scripts can click to update attack button color
        document.body.appendChild(invis_elt);
        document.getElementById('sullen-update-button').onclick = update_button;
    }
    init();
})();