// ==UserScript==
// @name         AO3: [Wrangling] Boot tags to another fandom!
// @description  Easily move tags from one fandom to another via wrangulator!!
// @version      1.0.1

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/*/wrangle?*status=unfilterable*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453349/AO3%3A%20%5BWrangling%5D%20Boot%20tags%20to%20another%20fandom%21.user.js
// @updateURL https://update.greasyfork.org/scripts/453349/AO3%3A%20%5BWrangling%5D%20Boot%20tags%20to%20another%20fandom%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Gets the edit url of the tag from the checkbox
    const get_url = function get_url(checkbox) {
        //If iconify is enabled, this will return the tag's link
        const a = checkbox.parentElement.parentElement.querySelector("ul.actions > li[title='Edit'] > a");
        if (a) {
            return a.href;
        }
        //If iconify is not enabled, we'll use the default path
        const buttons = checkbox.parentElement.parentElement.querySelectorAll("ul.actions > li > a");
        return array(buttons).filter(b => b.innerText == "Edit")[0].href;
    }

    //Hides the checked rows after we do our work
    const delete_tag_row = function delete_tag_row(checkbox) {
        const row = checkbox.parentElement.parentElement;
        row.parentElement.removeChild(row);
    }

    //Each time we finish a request, we'll add 1 to the "done" count
    //When it's equal to the number of tags we had to make requests for, we know we gone through all the checked rows!
    var done;
    //Holds any errors from form submit
    var errors;
    //All tags selected to boot
    var tags;

    // Called for each checked tag
    // Submits form data & passes on any resulting error messages
    // If succesfully done for every selected tag, will also display success banner :)
    // `url` is the URL that will process the form submission
    // `fullfandoms` is an array of all the new fandoms to be added
    // `tag` is the tag being edited
    // `fd` is the new formdata
    const submit_xhr = function submit_xhr(url, fullfandoms, tag, fd) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                //After form submitted:
                if (xhr.status == 200) {
                    // Check for errors
                    const err = xhr.responseXML.documentElement.querySelector("#error");
                    if (err) {
                        alert(err.innerText);
                        errors.push(err)
                    }
                    done += 1;
                    //If succesfully done for every selected tag, we want to display a success banner!
                    if (done == tags.length) {
                        // for some reason this seems to always be present on the page, even if there is no content in it
                        var flash = document.getElementsByClassName("flash")[0]
                        flash.innerHTML = "";
                        flash.classList.add("notice")
                        if (errors.length != 0) {
                            //In case the user wasn't bonked enough for their error,
                            //puts the red box with the error message from the iframe into the flash action message area
                            errors.forEach(e => {
                                e.parentElement.removeChild(e)
                                flash.appendChild(e);
                            });
                        } else {
                            // happy path :)
                            flash.appendChild(document.createTextNode("The following tags were successfully booted to "));
                            flash.appendChild(document.createTextNode(fullfandoms.toString().replaceAll(',', ', ')))
                            flash.appendChild(document.createTextNode(": "));
                            const as = tags.map(checkbox => {
                                const a = document.createElement("a")
                                a.href = get_url(checkbox);
                                a.target = "_blank"
                                a.innerText = checkbox.labels[0].innerText;
                                return a;
                            });
                            as.forEach((a, i) => {
                                if (i != 0) {
                                    flash.appendChild(document.createTextNode(", "))
                                }
                                flash.appendChild(a);
                            });
                            tags.forEach(checkbox => delete_tag_row(checkbox));
                        }
                        flash.appendChild(document.createElement("br"))
                        flash.scrollIntoView();
                        //Unset explicit background to let it go back to the default CSS background
                        button.style.background = ""
                        button.disabled = false
                        button.innerText = "Boot";
                    }
                }
                else if (xhr.status == 429) {
                    // ~ao3jail
                    alert("Rate limited. Sorry :(")
                } else {
                    alert("Unexpected error, check the console :(")
                    console.log(xhr)
                }
            }
        }
        xhr.open("POST", url)
        xhr.responseType = "document"
        xhr.send(fd)
    }

    // Called for each checked tag
    // Gets the edit form data about the tag and sets up request that will actually submit
    // `url` is the url of the edit tag page
    // `newfandoms` is an array of all the new fandoms to be added
    const boot_xhr = function boot_xhr(url, newfandoms) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function xhr_onreadystatechange() {
            if (xhr.readyState == xhr.DONE ) {
                if (xhr.status == 200) {
                    //Fandoms the tag has pre-boot
                    const oldfandoms = []
                    const inner_input = xhr.responseXML.documentElement.querySelector("input[name='tag[syn_string]']")
                    const tag = inner_input.value;

                    const form = xhr.responseXML.documentElement.querySelector("#edit_tag")

                    //Removing all fandoms the tag has pre-boot
                    const checks = array(xhr.responseXML.documentElement.querySelectorAll("label > input[name='tag[associations_to_remove][]']")).filter(foo => foo.id.indexOf("parent_Fandom_associations_to_remove") != -1);
                    for (const check of checks) {
                        const name = check.parentElement.nextElementSibling.innerText
                        oldfandoms.push(name)
                        //Edge case - if user boots a tag to a fandom currently on the tag
                        if (!newfandoms.includes(name)) {
                            check.checked = true;
                        }
                    }
                    //Setting the new fandoms on the tag
                    xhr.responseXML.documentElement.querySelector("#tag_fandom_string").value = newfandoms;

                    console.log("Tag at url " + url + " booted from " + oldfandoms.toString() + " and booted to " + newfandoms)

                    const fd = new FormData(form);

                    //Second xhr call that will submit our edited data to the form
                    submit_xhr(form.action, newfandoms, tag, fd);
                } else if (xhr.status == 429) {
                    // ~ao3jail
                    alert("Rate limited. Sorry :(")
                } else {
                    alert("Unexpected error, check the console :(")
                    console.log(xhr)
                }
            }
        }
        xhr.open("GET", url)
        xhr.responseType = "document"
        xhr.send()
    }

    //Runs when the boot button is clicked
    const boot_fandoms = function boot_fandoms(e) {
        e.preventDefault()

        //Gets all the rows with selected tags
        tags = array(document.querySelectorAll("input[name='selected_tags[]']")).filter(inp => inp.checked);

        //If no tags are selected, bonk user >:(
        if (tags.length == 0) {
            alert("You need to select at least one tag to boot!")
            return;
        }

        //The fandoms checked via the Fandom Assignment Shortcut script, if it is installed
        const fandomschecked = array(document.querySelectorAll("input[name='fandom_shortcut']:checked")).map(f => f.value)
        //The fandoms added via wrangulator textbox
        const fandomstext = document.getElementById("fandom_string").value.split(',')
        //Combine both fandom lists, then remove empty elements
        const fullfandoms = fandomschecked.concat(fandomstext).filter(n => n)

        //If no fandoms are selected, bonk user >:(
        if (fullfandoms.length == 0) {
            alert("You need to select at least one fandom to boot to!")
            return;
        }

        //Each time we finish a request, we'll add 1 to "done", and when it's equal to the number of tags we had to make requests for, we know we have finished them all
        done = 0;
        errors = []

        button.disabled = "true";
        button.innerText = "Processing..."
        // There is no special style in the default ao3 styles for disabled buttons, so even when disabled, the button still looks clickable. This sets the background to
        // "lightgrey" instead of the default light -> dark gradient, to make it look more disabled. We undo this later by setting this property back to an empty string
        // after all our requests are done.
        button.style.background = "lightgrey";

        //Runs hard boot xhr call on each tag selected
        tags.forEach(checkbox => {
            const url = get_url(checkbox)
            boot_xhr(url, fullfandoms)
        })
    }

    // the return value of document.querySelectorAll is technically a "NodeList", which can be indexed like an array, but
    // doesn't have helpful functions like .map() or .forEach(). So this is a simple helper function to turn a NodeList
    // (or any other array-like object (indexed by integers starting at zero)) into an array
    const array = a => Array.prototype.slice.call(a, 0)

    //Creates boot button
    const button = document.createElement("button");
    button.type = "text";
    button.style.textAlign = "center"
    button.style.marginRight = "5px"
    button.textContent = "Boot";
    button.addEventListener("click", boot_fandoms)
    document.querySelector("dd.submit").prepend(button);

    // Your code here...
})();