// ==UserScript==
// @name           Add Follow List Form
// @namespace      your-namespace
// @version        1.4
// @author         zzm88 & calon @ 253874.net
// @description    Highlight the post content of the user in the "followList".
// @match          https://*.253874.net/t/*
// @match          http://*.253874.net/t/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=253874.net
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/461697/Add%20Follow%20List%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/461697/Add%20Follow%20List%20Form.meta.js
// ==/UserScript==

(function() {
      // Find the element with the ID "quot"
    const quot = document.getElementById("quot");

    // Create the form
    const form = createForm();

    // Add the form after the element with the ID "quot"
    quot.after(form);

    // Get the follow list from local storage
    const followList = localStorage.getItem("followList");

    // Create the input box
    const input = document.getElementById("follow-list-input");

    // Load the follow list in the input box after the page is loaded
    loadFollowList(input, followList);

    // Loop through the elements with the class "author"
    loopAuthors(authors => {
        // Highlight the posts by users in the follow list
        highlightPosts(authors, followList);
    });

    // Add an event listener to the form for when it is submitted
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Get the input value and format it
        const inputVal = input.value.trim().replace(/\s+/g, " ");

        // Store the input value in local storage
        localStorage.setItem("followList", inputVal);

        // Loop through the elements with the class "author" again to update the highlights
        loopAuthors(authors => {
            highlightPosts(authors, inputVal);
        });
    });


    function createForm() {
        // Create the form
        const form = document.createElement("form");
        form.id = "follow-list-form";

        // Create the label
        const label = document.createElement("label");
        label.htmlFor = "follow-list-input";
        label.textContent = "Following: ";
        form.appendChild(label);

        // Create the input box
        const input = document.createElement("input");
        input.type = "text";
        input.name = "follow-list";
        input.id = "follow-list-input";
        form.appendChild(input);

        // Create the submit button
        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "Submit";
        form.appendChild(submit);

        return form;
    }

    function loadFollowList(input, followList) {
        // Load the follow list in the input box after the page is loaded
        input.value = followList;
    }

    function loopAuthors(callback) {
        // Loop through the elements with the class "author"
        const authors = document.querySelectorAll(".author");
        callback(authors);
    }

    function highlightPosts(authors, followList) {
    // Loop through the elements with the class "author" and highlight the posts by users in the follow list
    for (let i = 0; i < authors.length; i++) {
        const author = authors[i];

        // Get the username from the author element
        const usernameElement = author.querySelector(".username");
        if (!usernameElement) continue; // skip if username element is not found
        let username = usernameElement.textContent.trim();
        username = username.replace(/\【.*?\】/g, "").trim(); // remove text enclosed in square brackets

        // Check if the username is in the follow list
        if (followList && followList.includes(username)) {
            // highlight these users' replies
            const postList = author.closest(".post_list");
            postList.style.borderLeft = "medium solid #FF0000";
            postList.style.paddingLeft = "0.4rem";
            // usernameElement.style.borderBottom = "medium solid #FF0000";
            // postList.style.boxShadow = "0.2rem 0.2rem 0.5rem rgb(0 0 0 / .5)";

        } else {
            // Back to the default style
            const postList = author.closest(".post_list");
            postList.style.borderLeft = "initial";
            // usernameElement.style.borderBottom = "initial";
            // postList.style.boxShadow = "";

        }
    }
}

})();