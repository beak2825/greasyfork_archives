// ==UserScript==
// @name         Mastodon Notes
// @namespace    FiXato's Mastodon Notes Extension
// @version      0.5.1
// @description  Adds 'notes' buttons to profile links to configured Mastodon sites, which can be used to add your own notes (to be displayed as 'title' attributes) to users' profile links.
// @author       FiXato
// @match        https://hackers.town/*
// @match        https://mastodon.social/*
// @match        https://octodon.social/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399845/Mastodon%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/399845/Mastodon%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Mastodon Notes loaded');

    var users = {};
    var first_call;
    const max_time_between_calls = (1000 * 3); // 3 seconds delay to reduce lag from the function being called too often while new content loads.
    var restore_users_note_timer;
    var running = false;

try {

    if (typeof(Storage) === "undefined") {
        console.error("Local Storage not supported");
        return;
    }

    if (get_notes_auto_status()) {
        restore_users_notes();
    }

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0) {
                //console.log("Mastodon Notes:", mutation);
                if (get_notes_auto_status()) {
                    if (mutation.target && mutation.target.getAttribute('role') == 'feed' && mutation.target.classList.contains('item-list')) {
                        //FIXME: This should be called on only a subset of items, so it doesn't get repeatedly called on object that are already processed.
                        restore_users_notes();
                    }
                    if (mutation.target && mutation.target.classList.contains('activity-stream')) {
                        restore_users_notes();
                    }
                }
            }
        }
    };

    const targetNode = document.querySelector('body');

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}
catch(err) { console.error('Mastodon Notes: error', err); }

    // Function by Mark Amery from https://stackoverflow.com/a/35385518
    function htmlToElement(html) {
        let template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    const notes_control_panel = htmlToElement(`
      <div id="notes_control_panel">
        <h1>Mastodon Notes:</h1><br/>
        <div>
          <label>Status:</label>
          <label class="switch" for="notes_status_toggle">
            <input type="checkbox" id="notes_status_toggle" value="Toggle" checked>
            <span class="slider round"></span>
          </label>
        </div>
        <div>
          <label>Auto-Apply:</label>
          <label class="switch" for="notes_auto_toggle">
            <input type="checkbox" id="notes_auto_toggle" value="Toggle" checked>
            <span class="slider round"></span>
          </label>
        </div>
        <div><button id="reapply_notes">Reapply</button></div>
      </div>
    `);

    const head=document.querySelector('head');
    var styles = `<style>button.notes { opacity: 0; visibility: hidden; transition: visibility 1s, opacity 1s linear; position: absolute; margin-top: -1em; margin-left: -2em;}
    a:hover + button.notes, button.notes:hover { visibility: visible; opacity: 1; z-index: 998}
    #notes_template {width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 999; background: rgba(30,30,30, 0.8); color: #fff; }
    .notes_panel {display: flex; align-items: center; justify-content: center; }
    #notes_content {margin: auto 0; position: relative; background: rgb(30,30,30); border: 1px solid rgb(200,200,200); padding: 2em; margin: 2em;}
    #notes_content form textarea, #notes_content form input {width: 100%;}
    #notes_content form label, #notes_content form input {margin: 0.5em;}
    #notes_control_panel { background-color: #282c37; color: #9baec8; margin-bottom: 10px; padding: 15px 30px 15px 15px; }
    #notes_control_panel h1 { font-size: 1.2em; }
#notes_control_panel > div { display: inline-block; margin-right: 0.5em; margin-bottom: 0.5em;}
    /* The switch - the box around the slider */
    .switch {
        position: relative;
        display: inline-block;
        width: 3em;
        height: 1.5em;
    }

    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
            -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 1em;
        width: 1em;
        left: 0.25em;
        bottom: 0.25em;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(1.5em);
        -ms-transform: translateX(1.5em);
        transform: translateX(1.5em);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 1em;
    }

    .slider.round:before {
        border-radius: 50%;
    }
</style>`
    head.appendChild(htmlToElement(styles));
    add_control_panel();

    function get_notes_status() {
        let notes_status = localStorage.getItem('notes_enabled');
        if (notes_status === null) {notes_status = "true";}
        // work around string type of localStorage.
        notes_status = (notes_status == "true" ? true : false);
        return notes_status;
    }

    function get_notes_auto_status() {
        let notes_auto_status = localStorage.getItem('notes_auto_apply');
        if (notes_auto_status === null) {notes_auto_status = "true";}
        // work around string type of localStorage.
        notes_auto_status = (notes_auto_status == "true" ? true : false);
        return notes_auto_status;
    }

    function toggle_notes() {
        let notes_status = !get_notes_status();
        localStorage.setItem('notes_enabled', notes_status);

        let notes_status_toggle = document.querySelector('#notes_status_toggle');
        if (notes_status_toggle === null) {
            console.error('Mastodon Notes: could not find notes status toggle');
            return false;
        }
        notes_status_toggle.checked = notes_status;
        if (notes_status) {restore_users_notes();}
    }

    function toggle_auto_apply() {
        let notes_auto_status = !get_notes_auto_status();
        localStorage.setItem('notes_auto_apply', notes_auto_status);

        let notes_status_toggle = document.querySelector('#notes_auto_toggle');
        if (notes_status_toggle === null) {
            console.error('Mastodon Notes: could not find notes auto-apply status toggle');
            return false;
        }
        notes_status_toggle.checked = notes_auto_status;
        if (notes_auto_status) {restore_users_notes();}
    }

    function add_control_panel() {
      let beforeElement = document.querySelector('.drawer .search, .column-1 .public-account-bio');
      if (beforeElement === null) {
          console.log('Mastodon Notes: Drawer with search not yet present. Will retry');
          setTimeout(() => { add_control_panel(); }, 500);
          return false;
      }
      let notes_control_panel_el = document.querySelector('body #notes_control_panel');
      if(notes_control_panel_el === null) {
          console.log('Mastodon Notes: Adding control panel');
          beforeElement.parentElement.insertBefore(notes_control_panel, beforeElement);
          let notes_status = get_notes_status();
          let notes_status_toggle = document.querySelector('#notes_status_toggle');
          if (notes_status_toggle !== null) {
              notes_status_toggle.checked = notes_status;
              notes_status_toggle.addEventListener('click', toggle_notes);
          }

          let notes_auto_status = get_notes_auto_status();
          let notes_auto_toggle = document.querySelector('#notes_auto_toggle');
          if (notes_auto_toggle !== null) {
              notes_auto_toggle.checked = notes_auto_status;
              notes_auto_toggle.addEventListener('click', toggle_auto_apply);
          }
          let reapply_button = document.querySelector('#reapply_notes');
          if (reapply_button !== null) { reapply_button.addEventListener('click', restore_users_notes); }
      }
    }

    function open_notes(event) {
        console.log('opening notes interface');
        let notes_template = '<div id="notes_template" class="notes_panel"><div id="notes_content"><form><label for="notes_profile_url">Notes for:</label><input type="text" id="notes_profile_url" /><br /><label for="notes"><textarea id="notes" cols="70" rows="15"></textarea></label><input id="save_notes" type="submit" value="Save!"><input id="close_notes" type="reset" value="Reset & Close"></form></div></div>'
        let profile_url = this.dataset.profileUrl;
        let new_element = htmlToElement(notes_template);
        let body = document.querySelector('body');
        body.insertBefore(new_element, body.firstElementChild);
        document.querySelector('#notes_profile_url').value = profile_url;
        document.querySelector('textarea#notes').value = users[profile_url];
        document.querySelector('#notes_template form').addEventListener('submit', save_notes);
        document.querySelector('#notes_template form #save_notes').addEventListener('click', save_notes);
        document.querySelector('#notes_template form #close_notes').addEventListener('click', close_notes);
    }
    function close_notes(event) {
        console.log('closing notes');
        document.querySelector('#notes_template').remove();
        set_open_notes_event_handlers();
    }
    function save_notes(event) {
        event.preventDefault();
        let profile_url = document.querySelector('#notes_profile_url').value;
        let notes = document.querySelector('#notes').value;
        console.log('saving notes for ' + profile_url);
        if (store_user_notes(profile_url, notes) == true) {
            close_notes()
            restore_users_notes();
        }
    }

    function store_user_notes(profile_url, notes) {
        users[profile_url] = notes;
        localStorage.setItem('notes_for_' + profile_url, notes);
        return true;
    }

    // not sure why I have to call this multiple times, but otherwise I seem to lose the handler after editing the first note.
    function set_open_notes_event_handlers() {
        let note_buttons = document.querySelectorAll('button.notes');
        note_buttons.forEach((element) => {
            element.addEventListener('click', open_notes);
        });

    }

    function append_notes_to_title(profile_url, element) {
        if (users[profile_url] !== null) {
            if (element.title !== undefined && element.dataset.originalTitle === undefined) {
                element.setAttribute('data-original-title', element.title);
            }
            element.title = (element.dataset.originalTitle + (element.dataset.originalTitle && element.dataset.originalTitle.length > 0 ? "\n" : "") + "Notes: " + users[profile_url]);
        }
    }
    function add_buttons_to_link_elements(profile_link_elements) {
        //let idx = 1;
        for(let element of profile_link_elements) {
            //console.log('Mastodon Notes: element[' + idx + '/' + profile_link_elements.length + ']:', element);
            //idx += 1;
            let profile_url = element.href;
            // Don't add notes buttons again if it is already present.
            if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('notes')) {
                let new_element = htmlToElement('<button class="notes" data-profile-url="' + profile_url + '">Notes</button>');
                if (!element.nextElementSibling) {
                    element.parentNode.appendChild(new_element);
                } else {
                    element.parentNode.insertBefore(new_element, element.nextElementSibling);
                }
            }
            let notes = localStorage.getItem('notes_for_' + profile_url);
            if (notes !== "undefined") {
                users[profile_url] = notes;
                try {
                    append_notes_to_title(profile_url, element);
                }
                catch(err) {
                    console.error('Mastodon Notes: error', err);
                }
            }
        }
    }

    function restore_users_notes() {
        if (!get_notes_status()) {
            console.warn('Mastodon Notes: Cannot restore users notes as Mastodon Notes is currently disabled. Please toggle it on first.');
            return false;
        }
        if (running) { return false; }
        if (first_call === undefined) { first_call = Date.now();}
        let delta_first_call = (Date.now() - first_call);

        if (restore_users_note_timer !== undefined) { clearTimeout(restore_users_note_timer); }

        if (delta_first_call < max_time_between_calls) {
            let time_remaining = (max_time_between_calls - delta_first_call);
            //console.log('Mastodon Notes: restore_users_notes() delayed for ' + time_remaining + 'ms');

            restore_users_note_timer = setTimeout(() => { restore_users_notes(); }, time_remaining);
            return false;
        } else {
            first_call = Date.now();
            restore_users_note_timer = undefined;
        }
        console.log("Mastodon Notes: restoring users' notes");
        running = true;
        let profile_link_elements = document.querySelectorAll('a.mention[href], a.status__display-name[href], a.avatar[href], a.detailed-status__display-name[href]');
        add_buttons_to_link_elements(profile_link_elements);

        set_open_notes_event_handlers();
        running = false;
    }

})();