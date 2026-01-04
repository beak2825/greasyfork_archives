// ==UserScript==
// @name         Per Thread Status
// @namespace    https://greasyfork.org/users/2562
// @version      0.75
// @description  This adds a custom status field to the list of threads in the forum view. This should work on both SB/SV and probably other XenForo based forums with a bit of tweaking.
// @author       arctica
// @match        https://forums.spacebattles.com/forums/*
// @match        https://forums.sufficientvelocity.com/forums/*
// @match        https://forums.spacebattles.com/watched/threads*
// @match        https://forums.sufficientvelocity.com/watched/threads*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405823/Per%20Thread%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/405823/Per%20Thread%20Status.meta.js
// ==/UserScript==
function append_info() {
    // set the threads to an array var for use
    var threads_array = document.getElementsByClassName("js-inlineModContainer");
    // set the total number of threads
    var threads_total = threads_array.length;
    // loop through all the threads
    // and add an the thread id as an ID
    for (var i = 0; i < threads_total; i++) {
        // create an array based on the class list
        var temp_array = Array.from(threads_array[i].classList);
        // find the className and then read only the thread id
        var temp_number = temp_array[temp_array.findIndex(element => element.includes("js-threadListItem-"))].substring(18);
        // set the thread id to the ID of the thread html element
        threads_array[i].id = temp_number;
        // set the status from the localstorage
        var temp_status = check_status(temp_number);
        // set the opacatiy, if status not set set to 0.25 otherwise set to 0.75
        var temp_opacity = (temp_status == "<i>Not Set</i>") ? 0.25 : 0.75;
        // add the custom status to the page
        threads_array[i].getElementsByClassName("structItem-minor")[0].innerHTML += "<div style='float:right; opacity: " + temp_opacity + ";' class='PTS-Status');\">" + temp_status + "</div>";
        // set click event to run allowing change of status
        document.getElementById(temp_number).getElementsByClassName("PTS-Status")[0].addEventListener("click", change_status(temp_number));
    }
}

function change_status(temp_id) {
    return function() {
        //grab the current custom status
        var temp_current = document.getElementById(temp_id).getElementsByClassName("PTS-Status")[0].innerText;
        //create user input box
        var temp_prompt = prompt("Please input a custom status.\nIf set to \"Not Set\" then the custom status will be removed.", temp_current);
        // if the user kept the Not Set setting
        if (temp_prompt == "Not Set") {
            // update value on document keeping it in italics
            document.getElementById(temp_id).getElementsByClassName("PTS-Status")[0].innerHTML = "<i>Not Set</i>";
            // update the opacity
            document.getElementById(temp_id).getElementsByClassName("PTS-Status")[0].style.opacity = 0.25;
            // remove the updated value
            remove_status(temp_id);
        // if the prompt isn't null and not just spaces or blank
        } else if (temp_prompt != null & temp_prompt.trim().length) {
            // update the status
            document.getElementById(temp_id).getElementsByClassName("PTS-Status")[0].innerHTML = temp_prompt;
            // update the opacity
            document.getElementById(temp_id).getElementsByClassName("PTS-Status")[0].style.opacity = 0.75;
            // store the id/status in the localstorage
            store_status(temp_id, temp_prompt);
        }
    };
}

function store_status(temp_id, temp_status) {
    // create array based on thread id and status value
    var temp_thread = [temp_id, temp_status];
    // create array of threads for use, if already exsiting will be overwritten
    var temp_array = [temp_thread];
    // check to see if something was stored, if yes edit.
    if (localStorage["pts-threads"] != null) {
        // update temp array based on local storage
        temp_array = JSON.parse(localStorage["pts-threads"]);
        // check to see if thread id exists in array. If it does, update the existing data; otherwise add the thread info into the array
        (temp_array.find(element => element[0] == temp_id) != null) ? temp_array.find(element => element[0] == temp_id)[1] = temp_status : temp_array.push(temp_thread);
    }
    // update the localstorage
    localStorage["pts-threads"] = JSON.stringify(temp_array);
}

function remove_status(temp_id) {
    // check to see if something was stored
    if (localStorage["pts-threads"] != null) {
        var temp_array = JSON.parse(localStorage["pts-threads"]);
        // if the temp_id can be found in the stored array
        if (temp_array.find(element => element[0] == temp_id) != null) {
            // remove the id/status from the array
            temp_array.splice(temp_array.findIndex(element => element[0] == temp_id), 1);
            // update the local storage
            localStorage["pts-threads"] = JSON.stringify(temp_array);
        }
    }
}

function check_status(temp_id) {
    // Set the status to not set
    var temp_status;
    // check to see if the localstorage has been used yet. if yes search for thread ID
    if (localStorage["pts-threads"] != null) {
        var temp_array = JSON.parse(localStorage["pts-threads"]);
        // if that thread id is already in use, if it is use the exsiting data; otherwise the status is not set.
        (temp_array.find(element => element[0] == temp_id) != null) ? temp_status = temp_array.find(element => element[0] == temp_id)[1] : temp_status = "<i>Not Set</i>";
    // if local storage is not in use
    } else {
        // set the status to not set
        temp_status = "<i>Not Set</i>";
    }
    return temp_status;
}
//Give threads an ID of the thread id number on load //window.onload = append_id()
append_info();