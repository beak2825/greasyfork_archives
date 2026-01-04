// ==UserScript==
// @name         AO3: [Wrangling] Wrangle straight from the bins!!!!!!
// @description  Lets tag wranglers syn tags directly from the bin pages!
// @version      1.0.2

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445838/AO3%3A%20%5BWrangling%5D%20Wrangle%20straight%20from%20the%20bins%21%21%21%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/445838/AO3%3A%20%5BWrangling%5D%20Wrangle%20straight%20from%20the%20bins%21%21%21%21%21%21.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let encode_uri = window.encodeURIComponent
    if (!encode_uri) {
        encode_uri = (x) => x // hope for the best
    }

    const get_url = function get_url(checkbox) {
        // this will return the link if iconify is enabled
        const a = checkbox.parentElement.parentElement.querySelector("ul.actions > li[title='Edit'] > a");
        if (a) {
            return a.href;
        }
        // no iconify - use default path
        const buttons = checkbox.parentElement.parentElement.querySelectorAll("ul.actions > li > a");
        return array(buttons).filter(b => b.innerText == "Edit")[0].href;
    }
    const delete_tag_row = function delete_tag_row(checkbox) {
        const row = checkbox.parentElement.parentElement;
        row.parentElement.removeChild(row);
    }

    // the return value of document.querySelectorAll is technically a "NodeList", which can be indexed like an array, but
    // doesn't have helpful functions like .map() or .forEach(). So this is a simple helper function to turn a NodeList
    // (or any other array-like object (indexed by integers starting at zero)) into an array
    const array = a => Array.prototype.slice.call(a, 0)

    // grab the "description list" out of the wrangulator fieldset. there is only one, it is at the top of the page, and right now
    // it only contains the fandom dropdown and "Wrangle" button
    const wdl = document.querySelector("#wrangulator > fieldset > dl")
    // we will be adding two sets of one each "description term" and "description definition" elements, one pair for the dropdown, and one for the submit button
    const dt = document.createElement("dt");
    const label = document.createElement("label");
    label.innerText = "Syn to an existing tag";
    // "for" is a reserved keyword in javascript so we use setAttribute() to set it
    // this must match the ID (NOT name) of the input element below
    label.setAttribute("for", "syn_tag_autocomplete");
    dt.appendChild(label);
    const dd = document.createElement("dd")
    dd.title = "Syn to an existing tag";
    const input = document.createElement("input")
    input.type = "text"
    // if you set a name here, it will get sent to the server when submitting the wrangle-to-fandom form, which we don't want
    // so we explcitly don't set a name here
    input.id = "syn_tag_autocomplete"
    input.classList.add("autocomplete")
    // note the URL actually uses the plurals of these, "freeforms", "characters", and "relationships", but when querying
    // /autocomplete/ we want to use the singular forms (I do not know why these differ). But if we just don't put the "s"
    // in the regex at all, we will capture only what's in the capture group
    let autocomplete_type = window.location.search.match("show=(freeform|character|relationship)")[1];
    // these properties are all specific to autocomplete-js (the one at autocomplete-js.com, NOT the one at autocompletejs.com)
    input.setAttribute("data-autocomplete-method", "/autocomplete/tag?type=" + encode_uri(autocomplete_type))
    input.setAttribute("data-autocomplete-hint-text", "Start typing for suggestions!")
    input.setAttribute("data-autocomplete-no-results-text", "(No suggestions found)")
    // don't try to autofill on an empty input box
    input.setAttribute("data-autocomplete-min-chars", "1")
    input.setAttribute("data-autocomplete-searching-text", "Searching...")
    // don't allow selecting more than one tag
    input.setAttribute("data-autocomplete-token-limit", "1")
    dd.appendChild(input);
    wdl.appendChild(dt);
    wdl.appendChild(dd);
    // I don't know what the landmark dt is for, but it's probably for page layout or something. Just copied this from the existing wrangulator fieldset.
    const landmark = document.createElement("dt");
    landmark.classList.add("landmark")
    landmark.innerText = "Submit (for synning a tag)";
    wdl.appendChild(landmark);
    const submit = document.createElement("dd")
    submit.classList.add("submit")
    const button = document.createElement("button")
    button.innerText = "Wrangle to existing tag"
    button.name = "wrangle_existing";
    submit.appendChild(button);
    wdl.appendChild(submit);

    button.addEventListener("click", (e) => {
        // This is important - without this, the rest of this function will still run, but as soon as it's done running (at which point the iframes have not loaded yet),
        // the regular wrangle-to-fandom form will ALSO submit. This would just break the script entirely so by calling "preventDefault" here we are telling the browser
        // NOT to submit the form that this button happens to be inside.
        e.preventDefault();
        // some default sanity checks
        const tag = input.value;
        if (tag == "") {
            alert("You need to select a tag from the dropdown")
            return;
        }
        var tags = array(document.querySelectorAll("input[name='selected_tags[]']")).filter(inp => inp.checked);
        if (tags.length == 0) {
            alert("You need to select at least one tag to syn")
            return;
        }
        // each time we finish a request, we'll add 1 to "done", and when it's equal to the number of tags we had to make requests for, we know we have finished them all
        var done = 0;
        var errors = []
        button.disabled = "true";
        button.innerText = "Processing..."
        // There is no special style in the default ao3 styles for disabled buttons, so even when disabled, the button still looks clickable. This sets the background to
        // "lightgrey" instead of the default light -> dark gradient, to make it look more disabled. We undo this later by setting this property back to an empty string
        // after all our requests are done.
        button.style.background = "lightgrey";
        tags.forEach(checkbox => {
            const url = get_url(checkbox)
            const iframe = document.createElement("iframe");
            // We put this in its own function because we need to remove it later. If we don't remove it later, then when we submit the form in the iframe,
            // the "onload" event will fire *again*, and we will basically go into an infinite loop. So after the frame loads once, we remove this handler, and add
            // another one that will check for errors and handle when we are done with all the requests. But in order to remove this handler, we have to have a reference
            // to it, so we have to stick it in a variable.
            const onload1 = function onload1() {
                // grab the `syn_string` input box
                // this also has an ID but I found that out later
                const inner_input = iframe.contentWindow.document.querySelector("input[name='tag[syn_string]']")
                inner_input.value = tag;
                // prepare to save changes in the iframe. Before we do this, we need to remove *ourself* as the onload event handler, so we don't get stuck in an
                // infinite loop as described above. We add a new function that will check for errors and handle when we are done with all the requests
                const form = iframe.contentWindow.document.getElementById("edit_tag")
                iframe.removeEventListener("load", onload1)
                iframe.addEventListener("load", function() {
                    // check for errors
                    const err = iframe.contentWindow.document.getElementById("error");
                    if (err) {
                        // good luck, fellow wrangler
                        alert(err.innerText);
                        errors.push(err)
                        // leave the iframe in the page for debugging
                    } else {
                        document.body.removeChild(iframe);
                    }
                    done += 1;
                    if (done == tags.length) {
                        // for some reason this seems to always be present on the page, even if there is no content in it
                        var flash = document.getElementsByClassName("flash")[0]
                        flash.innerHTML = "";
                        flash.classList.add("notice")
                        if (errors.length != 0) {
                            // try to put the red box with the error message from the iframe into the flash action message area
                            errors.forEach(e => {
                                // might work
                                e.parentElement.removeChild(e)
                                flash.appendChild(e);
                            });
                        } else {
                            // happy path :)
                            // perform substitutions on the destination tag name to get the url-safe name for the url
                            // hope this works lmao
                            const url_safe_tag = tag.replace("/", "*s*").replace(".", "*d*").replace("#", "*h*").replace("?", "*q*");
                            const taga = document.createElement("a")
                            taga.href = "/tags/" + url_safe_tag; // fingers crossed
                            taga.target = "_blank"
                            taga.innerText = tag;
                            flash.appendChild(document.createTextNode("The following tags were successfully wrangled to "));
                            flash.appendChild(taga)
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
                            // Clear out the dropdown
                            input.previousElementSibling.getElementsByClassName("delete")[0].children[0].click();
                        }
                        flash.appendChild(document.createElement("br")) // should really just wrap the above stuff in a div, but w/e
                        flash.scrollIntoView();
                        // unset explicit background to let it go back to the default CSS background
                        button.style.background = ""
                        button.disabled = false
                        button.innerText = "Wrangle to existing tag";
                    }
                });
                // now that the old load handler has been removed and the new one has been added, it is safe to submit the form
                form.submit()
            };
            // add the event listener *before* setting the url, just in case the url loads immediately :)
            iframe.addEventListener("load", onload1);
            iframe.src = url;
            // don't show ao3 wranglers our dirty little secrets (iframes)
            // can be removed for debugging
            iframe.style.display = "none";
            document.body.appendChild(iframe);
        });
    });
})();