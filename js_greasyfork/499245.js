// ==UserScript==
// @name        AO3: Tag counter when posting/editing works
// @namespace   https://github.com/RhineCloud
// @version     1.0.1
// @description Count number of tags that count towards the 75 limit on works
// @grant       none
// @author      Rhine
// @match       https://*.archiveofourown.org/works/new*
// @include     /https?:\/\/[^\/]*archiveofourown.org\/works\/[0-9]+\/edit(_tags)?\/?/
// @license     GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @downloadURL https://update.greasyfork.org/scripts/499245/AO3%3A%20Tag%20counter%20when%20postingediting%20works.user.js
// @updateURL https://update.greasyfork.org/scripts/499245/AO3%3A%20Tag%20counter%20when%20postingediting%20works.meta.js
// ==/UserScript==

// CSS settings
// unknown: at the beginning, before tags were added or counted
const style_unknown = 'background: #999;';
// ok: at least 1 fandom tag, but still within the tag limit
const style_ok = 'background: #099;';
// warning: more than 75 tags that count towards the limit
const style_warning = 'background: #900;';


// counter to track the number of fandom, relationship, character, and additional tags
const tag_counts = [0, 0, 0, 0];

function update_tag_counts() {
    // grab relevant fields of the work posting/editing form
    const fandoms = document.querySelector('#work-form .work.meta dd.fandom .autocomplete');
    const relationships = document.querySelector('#work-form .work.meta dd.relationship .autocomplete');
    const characters = document.querySelector('#work-form .work.meta dd.character .autocomplete');
    const freeforms = document.querySelector('#work-form .work.meta dd.freeform .autocomplete');

    // count properly added tags above the input field
    tag_counts[0] = fandoms.querySelectorAll('li.added.tag').length;
    tag_counts[1] = relationships.querySelectorAll('li.added.tag').length;
    tag_counts[2] = characters.querySelectorAll('li.added.tag').length;
    tag_counts[3] = freeforms.querySelectorAll('li.added.tag').length;

    // count the number of tags still in the input fields proper
    tag_counts[0] += fandoms.querySelector('input').value.split(/[,，、]/).filter(value => value.trim()).length;
    tag_counts[1] += relationships.querySelector('input').value.split(/[,，、]/).filter(value => value.trim()).length;
    tag_counts[2] += characters.querySelector('input').value.split(/[,，、]/).filter(value => value.trim()).length;
    tag_counts[3] += freeforms.querySelector('input').value.split(/[,，、]/).filter(value => value.trim()).length;
}

// sum up the counts from each relevant tag category
function get_total_count() {
    return tag_counts.reduce((prev_count, curr_count) => prev_count + curr_count, 0);
}

// check if the total tag count total is within the tag limit
function is_within_limits() {
    return 75 >= get_total_count();
}

// insert the counter on the page
const style_counter = 'position: fixed; right: 0; bottom: 2em; z-index: 10;';
const fieldset_counter = document.createElement('fieldset');
fieldset_counter.innerHTML = '<legend>Tag Counter</legend>' +
    '<h3 class="landmark heading">Tag Counter</h3>' +
    '<dl>' +
    '<dt>Fandoms</dt>' +
    '<dd id="fandom_tag_count">?</dd>' +
    '<dt>Relationships</dt>' +
    '<dd id="relationship_tag_count">?</dd>' +
    '<dt>Characters</dt>' +
    '<dd id="character_tag_count">?</dd>' +
    '<dt>Additional Tags</dt>' +
    '<dd id="freeform_tag_count">?</dd>' +
    '<dt style="font-weight: bolder;">Total</dt>' +
    '<dd id="total_tag_count" style="font-weight: bolder;">?</dd>' +
    '</dl>' +
    '<button id="update_tag_counter" type="button">Update Counter</button>';
fieldset_counter.setAttribute('style', style_counter + style_unknown);
document.querySelector('#work-form').prepend(fieldset_counter);

// update the counter on the page when the button is clicked
fieldset_counter.querySelector('#update_tag_counter').addEventListener('click', () => {
    update_tag_counts();
    fieldset_counter.querySelector('#fandom_tag_count').innerText = tag_counts[0];
    fieldset_counter.querySelector('#relationship_tag_count').innerText = tag_counts[1];
    fieldset_counter.querySelector('#character_tag_count').innerText = tag_counts[2];
    fieldset_counter.querySelector('#freeform_tag_count').innerText = tag_counts[3];
    fieldset_counter.querySelector('#total_tag_count').innerText = get_total_count();
    // update colour scheme
    if (0 === tag_counts[0]) {
        fieldset_counter.setAttribute('style', style_counter + style_unknown);
    } else if (is_within_limits()) {
        fieldset_counter.setAttribute('style', style_counter + style_ok);
    } else {
        fieldset_counter.setAttribute('style', style_counter + style_warning);
    }
});
