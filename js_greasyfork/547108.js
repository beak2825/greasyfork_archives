// ==UserScript==
// @name         AO3: [Wrangling] Rel Helper
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  on unwrangled rels, build the proper canonical tag name with minimal typing
// @author       escctrl
// @version      3.0
// @match        *://*.archiveofourown.org/tags/*/edit
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js
// @require      https://update.greasyfork.org/scripts/491896/1516188/Copy%20Text%20and%20HTML%20to%20Clipboard.js
// @downloadURL https://update.greasyfork.org/scripts/547108/AO3%3A%20%5BWrangling%5D%20Rel%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/547108/AO3%3A%20%5BWrangling%5D%20Rel%20Helper.meta.js
// ==/UserScript==

/* global Sortable, copy2Clipboard */
'use strict';

// utility to reduce verboseness
const q = (selector, node=document) => node.querySelector(selector);
const qa = (selector, node=document) => node.querySelectorAll(selector);
const ins = (n, l, html) => n.insertAdjacentHTML(l, html);

/*************** CONFIGURATION ***************/

let cfg = 'wrangleRelHelp';
let stored = localStorage.getItem(cfg) || "syn,west";
let WORKFLOW = stored.split(',')[0] || "syn"; // either "syn" (button for Set as Syn Of) or "copy" (buttons to copy rel to clipboard)
let NAMELOC = stored.split(',')[1] || "west"; // ordering of given and family name as "west" or "east"
const updateConfig = () => localStorage.setItem(cfg, WORKFLOW+","+NAMELOC);

// if no other script has created it yet, write out a "Userscripts" option to the main navigation
if (qa('#scriptconfig').length === 0) {
    qa('#header nav[aria-label="Site"] li.search')[0] // insert as last li before search
        .insertAdjacentHTML('beforebegin', `<li class="dropdown" id="scriptconfig">
            <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
            <ul class="menu dropdown-menu"></ul></li>`);
}
// then add this script's config option to navigation dropdown
ins(q('#scriptconfig .dropdown-menu'), 'beforeend', `<li><a href="#" id="relhelp_workflow">Rel Helper Workflow:
        <span class="switch"><input type="checkbox" ${WORKFLOW === "syn" ? 'checked="checked"' : ""}><span class="slider round"></span></span>
        <span id="relhelp_workflow_status">${WORKFLOW === "syn" ? "SynOf" : "Copy"}</span></a></li>`);

ins(q("head"), 'beforeend', `<style tyle="text/css"> #relhelp_workflow {
    /* The switch - the box around the slider */
        .switch { position: relative; display: inline-block; width: 2em; height: 1em; vertical-align: -0.2em; }
    /* Hide default HTML checkbox */
        .switch input { opacity: 0; width: 0; height: 0; }
    /* The slider */
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 0.8em; width: 0.8em; left: 0.2em; bottom: 0.1em; background-color: white; -webkit-transition: .4s; transition: .4s; }
        input:checked + .slider { background-color: currentColor; }
        input:focus + .slider { box-shadow: 0 0 1px currentColor; }
        input:checked + .slider:before { -webkit-transform: translateX(0.8em); -ms-transform: translateX(0.8em); transform: translateX(0.8em); }
    /* Rounded sliders */
        .slider.round { border-radius: 1em; }
        .slider.round:before { border-radius: 50%; }
    }
    .sortable .tag a { cursor: default; }
    #relhelp_preview { margin: 0.643em auto; }</style>`);

// on either click on link or change of checkbox (depending where exactly user clicked), toggle between SynOf and Copy
q('#relhelp_workflow').addEventListener('click', (e)=>{
    e.preventDefault();
    if (e.currentTarget.tagName==="A") {
        WORKFLOW = WORKFLOW === "syn" ? "copy" : "syn"; // toggle
        updateConfig();
        q('input', e.currentTarget).checked = WORKFLOW === "syn" ? true : false;
        q('#relhelp_workflow_status', e.currentTarget).innerText = WORKFLOW === "syn" ? "SynOf" : "Copy";
        location.reload();
    }
});

/************* CONFIGURATION END *************/

// function to get current list of added tags based on autocomplete input fields e.g. get_added(inputs.char)
const get_added = (me) => qa('.added.tag', me.parentElement.parentElement);
const get_list_names = function (me) {
    let allchars = Array.from(get_added(me));
    allchars = allchars.map((el) => el.innerText.slice(0,-1).trim()); // remove the x delete button
    return allchars;
}

const inputs = {
    tag: q('#tag_name'),
    syn: q('#tag_syn_string_autocomplete'),
    char: q('#tag_character_string_autocomplete')
};

if (q('#tag_character_string') === null) return; // works only on relationships
if (q('#tag_canonical').checked) return; // works only if not canonical
if (get_added(inputs.syn).length > 0) return; // works only if not a synonym already

const chars_ul = inputs.char.parentElement.parentElement;
const individuals = inputs.tag.value.split(/\/|&|\band\b|\bx\b/g);
const relHelpType = inputs.tag.value.indexOf('/') > -1 || inputs.tag.value.indexOf(' x ') > -1 ? "/" : " & ";
let fillCount = 0;
let newRel = "";

// add the alphabet to the "Add Characters" heading for reference
ins(q('h4.heading', chars_ul.parentElement.parentElement), 'beforeend', `<span class="alphabet">[ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z ]</span>`);

// make the characters <ul> sortable
let sortable = new Sortable(chars_ul, {
    draggable: ".tag", // instead of filtering .input, we make only .tag draggable to avoid problems (autocomplete selection by mouse, dragging without clicking outside the <input>)
    onEnd: updatePreview // reorder in preview immediately
});
chars_ul.classList.add('sortable');

// add some buttons (automatically select the / or & based on tagname)
ins(chars_ul, 'afterend', `<div id="relhelp_btns">
    <button type="button" id="relhelp_addchars" title="search for the next character from the rel in the autocomplete">Add Char</button>
    <button type="button" id="relhelp_nameloc" title="switch between given-family and family-given name sorting" data-relhelploc="${NAMELOC}">${NAMELOC === "west" ? "Given Family" : "Family Given"}</button> &middot;
    <button type="button" id="relhelp_settype" title="switch between / and & rels" data-relhelptype="${relHelpType}">${relHelpType === "/" ? "&" : "/"}</button>
    <button type="button" id="relhelp_remdisambig" title="switch between keeping and removing fandom disambigs" data-relhelpdisambig="keep">Remove ()</button> &middot;
    <select id="relhelp_addNF_choice" style="width: fit-content;">
        <option>Everyone</option>
        <option>Me | Fanwork Creator(s)</option>
        <option selected>Original Character(s)</option>
        <option>Original Female Character(s)</option>
        <option>Original Male Character(s)</option>
        <option>Other(s)</option>
        <option>Reader</option>
        <option>Undisclosed</option>
        <option>You</option>
    </select><button type="button" id="relhelp_addNF" title="generic char to be appended to your rel">Add NF</button><br />
    <input type="text" id="relhelp_preview" title="preview of the proposed tag you're building" style="max-width: 30em;" />
    ${ WORKFLOW === "syn" ? `<button type="button" id="relhelp_setsyn" title="set the proposed tag in the Synonym Of field">Set Syn Of</button>` :
        `<button type="button" id="relhelp_copy" title="copy the proposed tag to clipboard">Copy Rel</button>
        <button type="button" id="relhelp_copychars" title="copy the selected chars to clipboard">Copy Chars</button>` }
    <span id="relhelp_error"></span>
    </div>`);

chars_ul.parentElement.addEventListener('click', (e) => {
    if (e.target.id === "relhelp_addchars") { // with each click fill autocomplete search with the next char
        let nextIndividual = individuals[fillCount].trim();
        inputs.char.value = nextIndividual;
        inputs.char.focus();
        fillCount = (fillCount+1 === individuals.length) ? 0 : fillCount+1;
    }
    else if (e.target.id === "relhelp_nameloc") { // with each click toggle between western/eastern name sorting
        e.target.dataset.relhelploc = e.target.dataset.relhelploc === "west" ? "east" : "west";
        e.target.innerText = (e.target.dataset.relhelploc === "west" ? "Given Family" : "Family Given");
        NAMELOC = e.target.dataset.relhelploc;
        updateConfig();
        for (let char of get_added(inputs.char)) { buildSortableString(char) }; // rebuild the sortable text on all chars
        sortChars(); // now resort based on the changed text
        updatePreview();
    }
    else if (e.target.id === "relhelp_settype") { // with each click toggle between / and & rels
        e.target.dataset.relhelptype = e.target.dataset.relhelptype === "/" ? " & " : "/";
        e.target.innerText = (e.target.dataset.relhelptype === "/" ? "&" : "/");
        updatePreview();
    }
    else if (e.target.id === "relhelp_remdisambig") { // with each click toggle between keeping and removing the disambigs
        e.target.dataset.relhelpdisambig = e.target.dataset.relhelpdisambig === "keep" ? "rem" : "keep";
        e.target.innerText = (e.target.dataset.relhelpdisambig === "keep" ? "Remove" : "Keep") + " ()";
        updatePreview();
    }
    else if (e.target.id === "relhelp_addNF") { // add an NF char at the end of the rel
        q('#relhelp_preview').value = q('#relhelp_preview').value + q('#relhelp_settype').dataset.relhelptype + q('#relhelp_addNF_choice').value;
        q('#relhelp_preview').dispatchEvent(new Event('input', { bubbles: true })); // react as if this was a typed input
    }
    else if (e.target.id === "relhelp_copy") { // copy final rel to clipboard
        copy2Clipboard(e, "txt", newRel);
    }
    else if (e.target.id === "relhelp_copychars") { // copy CSV of chars to clipboard, and remove the chars in one go
        let allchars = get_list_names(inputs.char); // grab all current chars
        copy2Clipboard(e, "txt", allchars.join(','));
        for (let char of get_added(inputs.char)) {
            q('.delete a', char).click();
        }
    }
    else if (e.target.id === "relhelp_setsyn") { // populate the Synonym Of field
        inputs.syn.focus();
        inputs.syn.value = newRel;
        inputs.syn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, key: "Enter" }));
    }
});

q('#relhelp_preview').addEventListener('input', (e) => { // when user makes manual changes
    newRel = e.target.value;
    checkTagValidity();
});

// update preview when a char gets added/deleted
const observer = new MutationObserver(function(mutList, obs) {
    for (const mut of mutList) {
        // check if the added/removed node is an .added.tag LI
        for (const node of mut.addedNodes) {
            if (node.classList.contains('added') && !node.classList.contains('sortable-ghost')) {
                // make content of the LI into a link
                let oldNode = node.childNodes[0];
                let newNode = document.createElement("a");
                newNode.innerText = oldNode.textContent;
                newNode.href = encodeURI("https://archiveofourown.org/tags/" +
                    oldNode.textContent.trim().replace('/', '*s*').replace('&', '*a*').replace('#', '*h*').replace('.', '*d*').replace('?', '*q*') +
                    "/wrangle?show=relationships&status=canonical");
                newNode.target = "_blank";
                node.replaceChild(newNode, oldNode);
                // resorting the LIs so that they appear in alphabetic order
                buildSortableString(node);
                sortChars();
                updatePreview();
            }
        }
        for (const node of mut.removedNodes) { if (node.classList.contains('added')) updatePreview(); }
    }
});
// listening to as few changes as possible: only direct children of UL
const startObserving = () => observer.observe(chars_ul, { attributes: false, childList: true, subtree: false });
const stopObserving = () => observer.disconnect();
startObserving();

function buildSortableString(added_char) {
    let name = added_char.innerText.slice(0,-1).trim();
    let name_style = q('#relhelp_nameloc').dataset.relhelploc;

    // removing any fandom disambigs (but not the (ren) or (s) plurals)
    if (/\((?!ren\)|s\)).+?\)$/i.test(name)) name = name.slice(0, name.lastIndexOf("(")-1);

    if (name.includes(' | ')) name = name.slice(0, name.indexOf(' | ')); // cut off any pipes (we sort only by before-the-pipe)

    // Mr., Mrs. etc: nothing we can do with them, they usually stand in for a missing given name
    // nicknames: they're used like a stand-in for a missing, or are attached to the existing, given name
    name = name.replaceAll(/(?<=".*?) (?=.*?")/g, ",").split(" "); // change spaces within quotes to comma so nicknames don't get split, then divide the name into its pieces
    for (let i in name) {
        if (name[i].startsWith('"')) {
            if (name_style === "west" && i > 0 || name_style === "east" && i > 1 ) {
                name[i-1] += " " + name[i]; // add it back to the previous given name part if there is one
                name.splice(i, 1); // remove the nickname's name piece from array
            }
        }
    }

    if (name[0] === "The") name.shift(); // if it's a descriptive "The X" never resort
    else if (name_style === "west") { // if we're set to sorting western-style and need to flip names
        if (name.length === 2 && !/[']s?$/i.test(name[0]) && // if this is exactly a two-part name, and the char isn't "X's Parents" or "X' Parents"
            !/(Character|Member)\(?s\)?|Family|Child\(?ren\)?|\d+/i.test(name[1])) { // nor "X Character(s)", "X Member(s)", "X Family", "X Child(ren)", "X #"
            name = name.reverse(); // flip the names for sorting
        }
        else if (name.length === 3 && /[']s?$/i.test(name[1]) && !/\d+/i.test(name[1])) { // if it's a three-part name like "X Y's Parent", but not "X #'s Parent"
            name = [name[1].slice(0,name[1].lastIndexOf("'")), name[0]+"'s", name[2]]; // turn it into "Y X's Parent" for sorting
        }
        else if (name.length === 3 && /[JS]r\.?/i.test(name[2])) { // Jr. and Sr.: for sorting they attach at the end of the given name e.g. Crow, Ben Jr.; Crow, Ben Sr.; Crow, Benton
            name = [name[1], name[0], name[2]]; // turn it into "Y X Jr." for sorting
        }
    }

    name = name.join(" ").replaceAll(/[-,]/g, " ").replaceAll(/[^\p{Script=Latin}0-9' ]/gui, ""); // nickname-commas back to space and dashes to sort numbers like T-800, remove other all punctuation
    added_char.dataset.sortas = name.toUpperCase(); // set as data-* on the node itself
}

function sortChars() {
    let all_chars = Array.from(get_added(inputs.char)); // grab all current chars (as array to enable sort())
    all_chars.sort((a, b) => {
        let a_name = a.dataset.sortas;
        let b_name = b.dataset.sortas;
        // "Original X Characters", "Original Children of X" etc are always last (to match the NF OC/OFC/OMC tags)
        let originals = /^Original .*?(Child\(?ren\)?|Character\(?s\)?|Member\(?s\)?)/gi;
        if (originals.test(a_name) && !originals.test(b_name)) return 1;
        else if (!originals.test(a_name) && originals.test(b_name)) return -1;
        // all other cases: regular sorting! using localeCompare for accented characters and understanding numbers
        else return a_name.localeCompare(b_name, undefined, { numeric: true });
    });
    stopObserving();
    chars_ul.replaceChildren(...all_chars, q("li.input", chars_ul)); // write the resorted items back out into the DOM
    startObserving();
}

function updatePreview() {
    let all_chars = get_list_names(inputs.char); // grab all current chars

    if (q('#relhelp_remdisambig').dataset.relhelpdisambig === "rem") {
        // split apart names and disambigs - (s) in Character(s) or (ren) in Child(ren) doesn't count
        let all_disambigs = all_chars.map((el) => /\((?!ren\)|s\)).+?\)$/i.test(el) ? [ el.slice(0, el.lastIndexOf("(")-1), el.slice(el.lastIndexOf("("))] : [el, ""] );

        let all_same = all_disambigs.every((d) => d[1] === all_disambigs[0][1]);
        all_chars = all_chars.map((el, ix) => {
            if (all_same && ix === all_chars.length-1) return el; // when all chars have the same disambig, keep it on the last one
            else return all_disambigs[ix][0]; // otherwise remove all disambigs (not ideal on crossover rels!)
        });
    }
    newRel = all_chars.join(q('#relhelp_settype').dataset.relhelptype); // join with the rel type we're supposed to use
    q('#relhelp_preview').value = newRel; // write out into preview field
    checkTagValidity();
}

function checkTagValidity() { // warn if new tag name too long or same as this tag
    let preview = q('#relhelp_preview');
    let error = "";

    if (newRel.length > 150) error = "proposed canonical is too long";
    if (newRel.toLowerCase() === inputs.tag.value.toLowerCase()) error = "proposed canonical is same as this tag";

    if (error === "") {
        preview.classList.remove('error');
        preview.title = "preview of the proposed tag you're building";
        q('#relhelp_error').innerText = "";
        qa('#relhelp_copy, #relhelp_copychars, #relhelp_setsyn').forEach((b) => { b.style.display = "inline-block"; }); // show the buttons
    }
    else {
        preview.classList.add('error');
        preview.title = error;
        q('#relhelp_error').innerText = error;
        qa('#relhelp_copy, #relhelp_copychars, #relhelp_setsyn').forEach((b) => { b.style.display = "none"; }); // hide the buttons
    }
}
