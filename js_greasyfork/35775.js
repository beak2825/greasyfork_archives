// ==UserScript==
// @name         Tumblr Post Saver
// @namespace    https://github.com/bab5470/tampermonkey-tumblr-post-saver
// @version      0.2
// @description  Save tumblr reblogs and drafts on a timer or manually. Prompts you to save new posts to draft (so they aren't lost). Restore posts automatically (after a browser crash). Options to import, export, or clear saved post data.
// @author       Brad Baker
//
// @match      *://www.tumblr.com/*
//
// @noframes
//
// @grant    GM_addStyle
// @grant    GM_listValues
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_deleteValue
// @grant    unsafeWindow
// @grant    GM_registerMenuCommand
//
// @run-at document-end
//
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require http://code.jquery.com/jquery-latest.js
//
// @downloadURL https://update.greasyfork.org/scripts/35775/Tumblr%20Post%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/35775/Tumblr%20Post%20Saver.meta.js
// ==/UserScript==

GM_config.init({
    'id': 'tumblr_post_saver', // The id used for this instance of GM_config
    'title': 'Tumblr Post Saver Settings',
    'fields': // Fields object
    {
        'time_between_saves': // This is the id of the field
        {
            'label': 'Time Between Saves', // Appears next to field
            'section': ['Settings',
                        'Set options below.'], // Appears above the field
            'type': 'select', // Makes this setting a text field
            'options': ['5000', '30000', '60000'], // Possible choices
            'default': '5000' // Default value if user doesn't change it
        },
        'days_to_keep': // This is the id of the field
        {
            'label': 'Days to Keep', // Appears next to field
            'type': 'select', // Makes this setting a text field
            'options': ['183', '365', '730'], // Possible choices
            'default': '730' // Default value if user doesn't change it
        },
        'backup_posts':
        {
            'label': 'Backup Posts', // Appears on the button
            'section': ['Post Management',
                        'Backup, Restore, Clear Posts'], // Appears above the field
            'type': 'button', // Makes this setting a button input
            'size': 100, // Control the size of the button (default is 25)
            'click': function() { // Function to call when button is clicked
                download_data();
            }
        },
        'restore_posts':
        {
            'label': 'Restore Posts', // Appears on the button
            'type': 'button', // Makes this setting a button input
            'size': 100, // Control the size of the button (default is 25)
            'click': function() { // Function to call when button is clicked
                upload_data();
            }
        },
        'clear_data':
        {
            'label': 'Clear Posts', // Appears on the button
            'type': 'button', // Makes this setting a button input
            'size': 100, // Control the size of the button (default is 25)
            'click': function() { // Function to call when button is clicked
                clear_data();
            }

        },
    },
    'css': '#tumblr_post_saver_restore_posts_var #tumblr_post_saver_clear_data_var { width = 10px; float:left; }' // CSS that will hide the section
});

var fireOnHashChangesToo    = true;
var pageURLCheckTimer       = setInterval (
    function () {
        if (this.lastPathStr  !== location.pathname || this.lastQueryStr !== location.search || (fireOnHashChangesToo && this.lastHashStr !== location.hash)) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;

            Main ();
        }
    }, 1000
);

function Main () {
    'use strict';

    console.log ('A new page has loaded.');

    // Add CSS
    GM_addStyle('#post_saver_button { font-size: 13px;font-weight: 700; padding-top: 5px;padding-bottom: 5px;border-radius: 2px 2px 2px 2px;padding-left: 10px;padding-right: 10px;border-color: #4a9aca;background-color: #4a9aca;color: hsla(0,0%,100%,.9);float:left;}');
    GM_addStyle('#white_div {font-size: 13px;font-weight: 700;padding-top: 5px;padding-bottom: 5px;padding-left: 10px;padding-right: 10px;background-color: #ffffff;float:left;}');

    // Register a menu entry for configuring post saver
    GM_registerMenuCommand('Tumblr Post Saver: Configuration', function() {
        GM_config.open();
    });

    if ((GM_config.get('time_between_saves'))) {
        console.log('Time between saves: ' + GM_config.get('time_between_saves'));
    }

    if ((GM_config.get('days_to_keep'))) {
        console.log('Days to keep: ' + GM_config.get('days_to_keep'));
    }

    // Get the current date stamp and the datestamp that the purge was last run.
    var current_datestamp = build_current_datestamp();
    var last_time_purge_ran_datestamp = GM_getValue("last_ran_purge_datestamp");

    // If the last ran purage datestamp isn't set this must be the first run.
    // Set it.
    if (last_time_purge_ran_datestamp === null) {
        // Write the latest run to the database
        GM_setValue("last_ran_purge_datestamp",current_datestamp);
    }

    // If a purge hasn't been run in the last date run it.
    if (last_time_purge_ran_datestamp < current_datestamp) {
        prune_old_posts();
    }

    if(location.pathname.match(/reblog/)) {
        console.log("reblog");
        reblog();
    } else if (location.pathname.match(/edit/)) {
        console.log("edit");
        edit();
    } else if (location.pathname.match(/drafts/)) {
        console.log("drafts");
        // Do nothing
    } else {
        console.log("couldn't find reblog, edit or drafts so polling visibility");
        pollVisibility();
    }
}

function pollVisibility() {
    // The post form is open (it could be a reblog or a new post. We'll check that below.
    if( ($('.post-forms-glass').is(':visible')) && (($('.reblog_name').length) === 0)) {
        console.log("new post");
        newpost();
    } else {
        console.log("poll visibility again");

        if(location.pathname.match(/reblog/)) {
            console.log("reblog");
            reblog();
        } else if (location.pathname.match(/edit/)) {
            console.log("edit");
            edit();
        } else if (location.pathname.match(/drafts/)) {
            console.log("drafts");
            // Do nothing
        }

        setTimeout(pollVisibility, 5000);
    }
}

function newpost () {

    // Every "time_between_saves" (see preferences)
    //setInterval(function() {

        if (!location.pathname.match(/drafts/)) {
            // Keep prompting the user to save the post as otherwise it may be lost during a browser crash/OS reboot etc.
            if (confirm("Warning: It appears you're starting a new post. Post saver can't save new posts until you save an initial draft. Would you like to do so now? (You won't be prompted again)")) {

                // Click the arrow drop down next to the post button
                document.getElementsByClassName('dropdown-area icon_arrow_carrot_down')[0].click();

                // Find the save as draft list item and click it
                var save_as_draft = document.evaluate("//span[contains(., 'Save as draft')]", document, null, XPathResult.ANY_TYPE, null );
                var save_as_draft_link = save_as_draft.iterateNext();
                save_as_draft_link.click();

                // Click the save button
                var save_button = $('.post-form--save-button [data-js-clickablesave]');
                save_button.click();
            }
        }
    //}, GM_config.get('time_between_saves'));
}

function reblog () {

    // Get the request ID from the URL
    request = get_request_id();

    console.log(request);

    // Get all the saved posts
    var saved_posts = GM_listValues();

    // Generate a regular expression to match the request id
    var regex = new RegExp(request, "g");

    // Create variable to store the key
    var datestamp;

    // Iterate through the posts
    for (var i=0; i < saved_posts.length; i++) {

        var key = saved_posts[i];

        // If there's a match then set the post content to the key data
        if (key.match(regex)) {

            console.log("Match found for " + regex);

            // Store the current key in a datestamp variable for use below
            datestamp = key;

            // Get the matching post from the database
            var postcontent = GM_getValue(saved_posts[i]);

            // Restore the post
            if (document.getElementsByClassName('editor editor-richtext')[0]) {
                document.getElementsByClassName('editor editor-richtext')[0].innerHTML = postcontent;
            } else {
                setTimeout(reblog, 1000);
            }
        } else {
            console.log("Match NOT found for " + regex);
        }
    }

    // Insert save button
    insert_save_button(datestamp);

    // Every "time_between_saves", save the post to the database
    setInterval(function() {
        var key;

        // If the datestamp is null (i.e. we've never seen this post before) then create a new key
        // otherwise reuse the existing key
        if(datestamp) {
            key = datestamp;
        } else {
            key = build_current_datestamp() + "_" + get_request_id();
        }
        var postcontent = document.getElementsByClassName('editor editor-richtext')[0];

        // If the post content is <p><br></p> then the post field is empty. Don't save as
        // there's no point in saving an empty post and also there can be a race condition
        // where the post hasn't been restored and thus is empty and the automatic save kicks in.
        // If that happens the saved post can be wipped out with <p><br></p>
        if(postcontent.innerHTML === "<p><br></p>"){
            console.log("Post not saved as post content is empty: " + postcontent.innerHTML);
        } else if (postcontent.innerHTML === GM_getValue(key)) {
            // Don't do anything as the post is already up to date.
            // console.log("Post already up to date: " + key);
        } else {

            // console.log("Post saved as: " + key);
            //console.log("Post Content: " +  postcontent.innerHTML);

            // Save the post
            GM_setValue(key,postcontent.innerHTML);

            // Check that the post actually saved!
            if (GM_getValue(key) !==  postcontent.innerHTML) {
                alert("Post not saved! Try again");
            }
        }
    }, GM_config.get('time_between_saves'));
}

function edit () {

    // alert("edit");

    // Create variable to store the key
    var datestamp;

    // Get the request ID from the URL
    var request = get_request_id();

    // Get all the saved posts
    var saved_posts = GM_listValues();

    // Generate a regular expression to match the request id
    var regex = new RegExp(request, "g");

    // Create variable to store the key
    var matched_key;

    // Iterate through the posts
    for (var i=0; i < saved_posts.length; i++) {

        var current_key = saved_posts[i];

        // If the db entry's key matches the request id we're looking for
        if (current_key.match(regex)) {

            //  Store the match in the matched_key variable
            matched_key = current_key;

            // Get the post content from the database
            var saved_post_content = GM_getValue(saved_posts[i]);

            // Get the post content stored by tumblr
            var current_post_content = document.getElementsByClassName('editor editor-richtext')[0].innerHTML;

            // If the two don't match - houston we have a problem
            // if (saved_post_content != current_post_content){

            // Ask the user what we want to do. Is tumblr right or is post_saver right?
            // if (confirm('I found a draft different than the one here. Do you want to restore it?')) {
            document.getElementsByClassName('editor editor-richtext')[0].innerHTML = saved_post_content;
            // }
        }
    }

    var key;

    // If the matched_key is null (i.e. we've never seen this post before) then create a new key
    // otherwise reuse the existing key
    if(matched_key === null) {
        key = build_current_datestamp() + "_" + get_request_id();
    } else {
        key = matched_key;
    }

    // Save the post to the database in case its not already there
    var postcontent = document.getElementsByClassName('editor editor-richtext')[0];
    if(postcontent){
        // Save the post
        GM_setValue(key,postcontent.innerHTML);

        // Check that the post actually saved!
        if (GM_getValue(key) !==  postcontent.innerHTML) {
            alert("Post not saved! Try again");
        }
    }

    // Insert save button
    insert_save_button(datestamp);

    // Save the post again every time_between_saves
    setInterval(function() {
        var postcontent = document.getElementsByClassName('editor editor-richtext')[0];
        if(postcontent){
            // First check if the post is already saved (there's no sense in repeatedly saving something thats already in the database)
            if (GM_getValue(key) !==  postcontent.innerHTML) {
                // Save the post
                GM_setValue(key,postcontent.innerHTML);

                // Check again that it actually saved. If it didn't alert the user
                if (GM_getValue(key) !==  postcontent.innerHTML) {
                    alert("Auto save failed. You may want to try manual saving.");
                }
            }
        }
    }, GM_config.get('time_between_saves'));
}

// Get the tumbler post id (request id) from the URL
function get_request_id (){

    // Get the current url path
    var location_path = location.pathname;

    // Split on the slash character
    var location_items = location_path.split("/");

    // Skip first path (reblog/edit, etc) in the url
    location_items.shift();

    // Get the ID from the URL and return it
    var request = parseInt(location_items[1]);
    return request;
}


function insert_save_button (datestamp) {

    // Create a new button
    var save_draft_button = document.createElement('button');
    save_draft_button.setAttribute("id", "post_saver_button");
    save_draft_button.innerHTML = 'Save to Post Saver';

    // Set what happens when the button is clicked
    save_draft_button.onclick = function(){

        // Instantiate a variable to store the key
        var key;

        // If the datestamp is null (i.e. we've never seen this post before) then create a new key
        // otherwise reuse the existing key
        if(datestamp === null) {
            key = build_current_datestamp() + "_" + get_request_id();
        } else {
            key = datestamp;
        }

        var postcontent = document.getElementsByClassName('editor editor-richtext')[0];
        GM_setValue(key,postcontent.innerHTML);

        // Check that the post actually saved!
        if (GM_getValue(key) !==  postcontent.innerHTML) {
            alert("Post not saved! Try again");
        } else {
            alert("saved!");
        }

        return false;
    };

    var checkExist = setInterval(function() {
        // Find the create post button
        var save_button = document.getElementsByClassName('button-area create_post_button')[0];
        if (save_button) {
            console.log("Post button exists.");

            // Check of the post saver button already exits so we don't add it multiple times.
            if (document.getElementById('post_saver_button') === null || document.getElementById('post_saver_button') === undefined) {

                console.log("Post saver button not found to adding it");

                // Insert the save_draft button before the save button
                save_button.parentNode.insertBefore(save_draft_button, save_button);

                // Create a white div to create space between the post saver and post button
                var white_div = document.createElement('div');
                white_div.innerHTML = '&nbsp;&nbsp;';
                white_div.setAttribute("id", "white_div");

                // Insert the white space before the save button
                save_button.parentNode.insertBefore(white_div, save_button);
            }

            clearInterval(checkExist);
        } else {
            console.log("Post button does not exist");
        }
    }, 100); // check every 100ms
}

function clear_data (){
    if (confirm('Are you sure you to clear all data? This cannot be undone!!!')) {

        // Clear everything fom the database
        var keys = GM_listValues();
        for (var key of keys) {
            GM_deleteValue(key);
        }

        // Write the last_ran_purge_datestamp to the database
        var current_datestamp = build_current_datestamp();
        GM_setValue("last_ran_purge_datestamp",current_datestamp);

        // Inform the user we cleared successfully
        alert("Cleared Successfully!");
    }
}

function upload_data (){

    // Alert the user that we restored successfully
    alert("Before you restore your posts makes sure that all tumblr tabs are closed except this one! Restoring data while other tabs are open may cause unexpected results.");



    // Restoring data wipes out existing entries this is to avoid situations
    // like when you have a key of 20170101_123456 and another key of 20170202_123456
    // (basically two entries for the same request id)

    if (confirm('Are you sure you want restore? Restoring will overwrite anything you have in the database currently!!!')) {

        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('id', 'files');
        input.setAttribute('accept', '.csv');
        input.style.cssText = "display:none";

        // Click the files input button (see the cpanel section)
        input.click();

        // Clear the database
        var keys = GM_listValues();
        for (var key of keys) {
            GM_deleteValue(key);
        }

        // Create a new FileReader
        var reader=new FileReader();

        // when the file element changes read in the file
        input.onchange = function() {
            const file = input.files[0];
            reader.readAsText(file);
        };

        // When the file is completely read in
        reader.onload = function() {

            // Create a variable to store the results
            var csv = reader.result;

            // Create an array of lines by splitting up the csv on carraige returns
            var allTextLines = csv.split(/\r\n|\n/);

            // Create a variable to store the lines
            var lines = [];

            // From 0 to the total number of lines
            for (var i=0; i<allTextLines.length; i++) {

                // If the line isn't empty (the last line is)
                if (allTextLines[i]) {

                    // Create an an array called data, split the
                    // line on the comma value and store each element in the array
                    var data = allTextLines[i].split(',');

                    // Write the post to the database
                    GM_setValue(data[0],data[1]);

                }
            }
            // Alert the user that we restored successfully
            alert("Restored Successfully!");
        };
    }
}

function download_data (){
    // Get all the posts from the database
    var saved_posts = GM_listValues();

    // Set a content type header
    var csvContent = "data:text/csv;charset=utf-8,";

    // Iterate through the saved posts
    for (var i=0; i < saved_posts.length; i++) {

        // Generate a row by joining the key and the post and seperating them by a comma
        var row = [saved_posts[i],GM_getValue(saved_posts[i])].join(',');

        // Add a carriage return for the next line
        csvContent += row + "\r\n";
    }

    // Encode the csvContent prior to download
    var encodedUri = encodeURI(csvContent);

    // Force the browser to download the file
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tumblr_posts_backup.csv");

    // Required for FF
    document.body.appendChild(link);

    link.click();
}

// Get the current date stamp (today)
function build_current_datestamp() {
    // Get todays date
    var a = new Date();

    // Get the year, month and day
    var year = a.getFullYear();
    var month = a.getMonth();
    var day = a.getDate();

    // Combine them into a datestamp and return it
    var datestamp = [year,month+1,day].join('');

    return datestamp;
}

// Generate the oldest datestamp (What's the oldest datestamp we'd want to keep)
function build_oldest_datestamp () {
    // Figure out how many days we want to keep
    var days_to_keep = GM_config.get('days_to_keep');

    // Take the current date and subtract days to keep
    var date = new Date(new Date().setDate(new Date().getDate() - days_to_keep));

    // Get the new year, month,day
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    // Combine them into a datestamp and return it
    var datestamp = [year,month+1,day].join('');
    return datestamp;
}

// Remove old posts to reduce storage
function prune_old_posts (){

    // First figure out the oldest datestamp we'd want to keep based on the users preferences
    oldest_datestamp =  build_oldest_datestamp();

    // Get all the existing posts
    var saved_posts = GM_listValues();

    // Iterate through the saved_posts array
    for (var key in saved_posts) {

        // Get the post's current datestamp
        var saved_post_datestamp = key.replace(/_.*/g, '');

        // If the posts date stamp is newer than the oldest allowed datestamp
        if (saved_post_datestamp < oldest_datestamp) {

            // Delete it from the database
            GM_deleteValue(key);
        }
    }

    // Write the latest run to the database
    var current_datestamp = build_current_datestamp();
    GM_setValue("last_ran_purge_datestamp",current_datestamp);
}
