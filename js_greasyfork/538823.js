// ==UserScript==
// @name         WritingTeam Template Generator
// @namespace    http://retroachievements.org/
// @version      1.2
// @description  This script generates templates for the WritingTeam to send out to developers or reporters.
// @author       Nepiki
// @match        https://retroachievements.org/messages/WritingTeam/create
// @include      https://retroachievements.org/message-thread/*
// @run-at       document-end
// @icon         https://static.retroachievements.org/assets/images/ra-icon.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538823/WritingTeam%20Template%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/538823/WritingTeam%20Template%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This function validates that the message is being sent from the WritingTeam inbox. If this is not the case, no dropdown menu will be added.
    function checkAccount() {
        console.log("Checking account...");
        const submitButton = document.querySelector('button[type="submit"]');
        console.log("Submit button found:", submitButton);

        if (submitButton) {
            console.log("Submit button text:", submitButton.textContent);
            // Check if button text matches pattern "Submit as [TeamName]".
            const hasTeamSubmit = submitButton.textContent.includes("Submit as WritingTeam");
            console.log("Has team submit pattern:", hasTeamSubmit);
            return hasTeamSubmit;
        }

        return false;
    }

    // This function adds a new dropdown on the "Start new message thread" page, including input fields and generate button for the template.
    function addDropdownAndFieldsNewMessage() {
        console.log("addDropdownAndFieldsNewMessage called");

        if (checkAccount() === true) {
            console.log("Account check passed, creating dropdown...");

            // Create new div.
            const newDiv = document.createElement("div");
            newDiv.className = "WritingTeam-Template-Generator";
            newDiv.style.marginTop = "10px";
            newDiv.style.padding = "10px";
            newDiv.style.border = "1px solid #ccc";
            newDiv.style.borderRadius = "5px";
            console.log("Created main div");

            // Create new select button.
            const menu = document.createElement("select");
            menu.style.marginBottom = "5px";
            menu.style.width = "100%";

            // Option 1.
            var option1 = document.createElement("option");
            option1.innerText = "1. Developer has given us permission to update the achievement but wishes to be contacted afterwards";
            menu.appendChild(option1);

            // Option 2.
            var option2 = document.createElement("option");
            option2.innerText = "2. Developer wants to be contacted first/exclusively, or we can't validate the report";
            menu.appendChild(option2);

            // Option 3.
            var option3 = document.createElement("option");
            option3.innerText = "3. Developer not yet on spreadsheet, sends template 2 + addendum";
            menu.appendChild(option3);

            // Append dropdown to newDiv.
            newDiv.appendChild(menu);
            console.log("Added dropdown menu");

            // Input Field 1 (Developer Name).
            const devNameField = document.createElement("input");
            devNameField.setAttribute("type", "text");
            devNameField.setAttribute("placeholder", "Enter developer name");
            devNameField.classList.add("input-field");
            devNameField.style.display = "block";
            devNameField.style.marginBottom = "5px";
            devNameField.style.width = "100%";
            newDiv.appendChild(devNameField);

            // Input Field 2 (Game ID).
            const gameIdField = document.createElement("input");
            gameIdField.setAttribute("type", "text");
            gameIdField.setAttribute("placeholder", "Enter game ID");
            gameIdField.classList.add("input-field");
            gameIdField.style.display = "block";
            gameIdField.style.marginBottom = "5px";
            gameIdField.style.width = "100%";
            newDiv.appendChild(gameIdField);

            // Input Field 3 (Achievement ID).
            const achievementIdField = document.createElement("input");
            achievementIdField.setAttribute("type", "text");
            achievementIdField.setAttribute("placeholder", "Enter achievement ID");
            achievementIdField.classList.add("input-field");
            achievementIdField.style.display = "block";
            achievementIdField.style.marginBottom = "5px";
            achievementIdField.style.width = "100%";
            newDiv.appendChild(achievementIdField);
            console.log("Added input fields");

            // Generate Button.
            const generateButton = document.createElement("button");
            generateButton.type = "button"; // Prevent form submission.
            generateButton.innerHTML = "Generate template";
            generateButton.style.marginTop = "5px";
            generateButton.style.backgroundColor = "#4a5568"; // Darker gray.
            generateButton.style.color = "white";
            generateButton.style.padding = "5px 15px";
            generateButton.style.borderRadius = "4px";
            generateButton.style.border = "none";
            generateButton.style.cursor = "pointer";
            generateButton.addEventListener("click", function(e) {
                e.preventDefault(); // Extra prevention of default behavior.
                e.stopPropagation(); // Stop event from bubbling up.
                console.log("Generate button clicked");
                pasteTemplateIntoTextArea();
            });
            // Add hover effect.
            generateButton.addEventListener("mouseenter", function() {
                this.style.backgroundColor = "#2d3748";
            });
            generateButton.addEventListener("mouseleave", function() {
                this.style.backgroundColor = "#4a5568";
            });
            newDiv.appendChild(generateButton);
            console.log("Added generate button");

            // Add new div below toolbar.
            const buttonToolbar = document.querySelector('.w-full.rounded.bg-embed.p-2');
            console.log("Button toolbar found:", buttonToolbar);

            if (buttonToolbar) {
                buttonToolbar.parentNode.insertBefore(newDiv, buttonToolbar.nextSibling);
                console.log("Template generator div inserted into DOM");
            } else {
                // Try alternative insertion point if toolbar not found.
                console.log("Toolbar not found, trying alternative insertion...");
                const messageForm = document.querySelector('form');
                if (messageForm) {
                    messageForm.insertBefore(newDiv, messageForm.firstChild);
                    console.log("Template generator div inserted at top of form");
                } else {
                    console.log("ERROR: Could not find insertion point for template generator");
                }
            }
        } else {
            console.log("Account check failed - not adding dropdown");
        }
        return;
    }

    // This function adds a new dropdown on the "Reply to message thread" page, including a generate button for the template.
    function addDropdownReply() {
        console.log("addDropdownReply called");

        if (checkAccount() === true) {
            console.log("Account check passed, creating reply dropdown...");

            // Create new div.
            const newDiv = document.createElement("div");
            newDiv.className = "WritingTeam-Template-Generator";
            newDiv.style.marginTop = "10px";
            newDiv.style.padding = "10px";
            newDiv.style.border = "1px solid #ccc";
            newDiv.style.borderRadius = "5px";

            // Create new select button.
            const menu = document.createElement("select");
            menu.style.marginBottom = "5px";
            menu.style.width = "100%";

            // Option 1.
            var option1 = document.createElement("option");
            option1.innerText = "1. Reply to reporter (correct)";
            menu.appendChild(option1);

            // Option 2.
            var option2 = document.createElement("option");
            option2.innerText = "2. Reply to reporter (incorrect)";
            menu.appendChild(option2);

            // Append dropdown to newDiv.
            newDiv.appendChild(menu);
            console.log("Added reply dropdown menu");

            // Generate Button.
            const generateButton = document.createElement("button");
            generateButton.type = "button"; // Prevent form submission.
            generateButton.innerHTML = "Generate template";
            generateButton.style.marginTop = "5px";
            generateButton.style.backgroundColor = "#4a5568"; // Darker gray.
            generateButton.style.color = "white";
            generateButton.style.padding = "5px 15px";
            generateButton.style.borderRadius = "4px";
            generateButton.style.border = "none";
            generateButton.style.cursor = "pointer";
            generateButton.addEventListener("click", function(e) {
                e.preventDefault(); // Extra prevention of default behavior.
                e.stopPropagation(); // Stop event from bubbling up.
                console.log("Generate reply button clicked");
                pasteTemplateIntoTextArea();
            });
            // Add hover effect.
            generateButton.addEventListener("mouseenter", function() {
                this.style.backgroundColor = "#2d3748";
            });
            generateButton.addEventListener("mouseleave", function() {
                this.style.backgroundColor = "#4a5568";
            });
            newDiv.appendChild(generateButton);

            // Add new div below toolbar.
            const buttonToolbar = document.querySelector('.w-full.rounded.bg-embed.p-2');
            console.log("Button toolbar found:", buttonToolbar);

            if (buttonToolbar) {
                buttonToolbar.parentNode.insertBefore(newDiv, buttonToolbar.nextSibling);
                console.log("Reply template generator div inserted into DOM");
            } else {
                // Try alternative insertion point if toolbar not found.
                console.log("Toolbar not found, trying alternative insertion...");
                const messageForm = document.querySelector('form');
                if (messageForm) {
                    messageForm.insertBefore(newDiv, messageForm.firstChild);
                    console.log("Reply template generator div inserted at top of form");
                } else {
                    console.log("ERROR: Could not find insertion point for reply template generator");
                }
            }
        } else {
            console.log("Account check failed - not adding reply dropdown");
        }
        return;
    }

    function generateTemplateNewMessage() {
        console.log("generateTemplateNewMessage called");
        var newDiv = document.querySelector('.WritingTeam-Template-Generator');
        if (!newDiv) {
            console.log("ERROR: Template generator div not found");
            return "";
        }

        var inputFields = newDiv.querySelectorAll('input[type="text"]');
        console.log("Found input fields:", inputFields.length);

        // Get values of fields.
        var developerNameField = inputFields[0].value;
        var gameIdField = inputFields[1].value;
        var achievementIdField = inputFields[2].value;

        console.log("Developer name:", developerNameField);
        console.log("Game ID:", gameIdField);
        console.log("Achievement ID:", achievementIdField);

        // Get value of select, and return template based on the value.
        var selectField = newDiv.querySelector('select');
        console.log("Selected option:", selectField.value);

        var titleField = document.querySelector('[name="title"]');
        console.log("Title field found:", titleField);

        if (selectField.value === "1. Developer has given us permission to update the achievement but wishes to be contacted afterwards") {
            if (titleField) {
                // Use React-compatible method to set title.
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(titleField, "Writing fix published for {game name}");
                titleField.dispatchEvent(new Event('input', { bubbles: true }));
                titleField.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return `Hello ${developerNameField},

Following a user report, we have updated the following achievement in [game=${gameIdField}]:

[ach=${achievementIdField}]

Old: WRITER: PASTE THE OLD TEXT HERE
New: WRITER: PASTE THE NEW TEXT HERE WITH CHANGES IN BOLD TEXT

Please let us know if there are any issues with these changes!

Kind regards,

-WritingTeam`;
        }

        if (selectField.value === "2. Developer wants to be contacted first/exclusively, or we can't validate the report") {
            if (titleField) {
                // Use React-compatible method to set title.
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(titleField, "User writing report for {game name}");
                titleField.dispatchEvent(new Event('input', { bubbles: true }));
                titleField.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return `Hello ${developerNameField},

We have received a writing report for [game=${gameIdField}] for the following achievement:

[ach=${achievementIdField}]

WRITER: DESCRIBE HERE WHAT THE ISSUE IS

Would you be able to take a look at this one? Thank you in advance!

Kind regards,

-WritingTeam`;
        }

        if (selectField.value === "3. Developer not yet on spreadsheet, sends template 2 + addendum") {
            if (titleField) {
                // Use React-compatible method to set title.
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(titleField, "User writing report for {game name}");
                titleField.dispatchEvent(new Event('input', { bubbles: true }));
                titleField.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return `Hello ${developerNameField},

We have received a writing report for [game=${gameIdField}] for the following achievement:

[ach=${achievementIdField}]

WRITER: DESCRIBE HERE WHAT THE ISSUE IS

Would you be able to take a look at this one? Thank you in advance!

Kind regards,

-WritingTeam

---

As a reminder, we now have an opt-out system in place where the Writing Team members will make the changes if the report falls within the following categories:

1. The report involves a simple typo, incorrect capitalization, or a consistency issue (e.g. witout => without)
2. The report contains an obvious discrepancy between logic and description on the writing side, such as copy-paste errors (e.g. the description says Stage 2, but it's meant to be Stage 3)

If you agree to giving us these permissions and do not wish to be contacted whenever we make them, then no reply is needed to this message! If you wish, you can also actively give us permission to perform full rewrites of the titles and descriptions of your sets, but this is not allowed by default. If you would like to change your preferences from the default, please evaluate [url=https://docs.google.com/spreadsheets/d/1zw1_mHRlyoXkzzgRW0i-IS0z2M2N8bdtykxyEYdLhNw/edit?usp=sharing]this spreadsheet[/url] and reply to us with your preferences in the following format, choosing one of the following options for each category of change:

Allowed, no contact needed | Allowed, contact after fix | Contact first, change after 3 days of no reply | Disallowed, contact always required

[code]
1. [Typos] -
2. [Logic-description mismatches] -
3. [Set rewrites] -
[/code]

If there are any questions, please feel free to let us know!`;
        }

        return "";
    }

    function generateTemplateReply() {
        console.log("generateTemplateReply called");
        var newDiv = document.querySelector('.WritingTeam-Template-Generator');
        if (!newDiv) {
            console.log("ERROR: Template generator div not found");
            return "";
        }

        // Get value of select, and return template based on the value.
        var selectField = newDiv.querySelector('select');
        console.log("Selected option:", selectField.value);

        // Get the user the Writer is replying to.
        var userNameDiv = document.querySelector('.flex.max-w-fit.items-center.gap-2');
        console.log("Username div found:", userNameDiv);

        var userName = "";
        if (userNameDiv) {
            var userNameSpan = userNameDiv.querySelector('span');
            if (userNameSpan) {
                userName = userNameSpan.textContent;
                console.log("Found username:", userName);
            }
        }

        if (selectField.value === "1. Reply to reporter (correct)") {
            return `Hello ${userName}, thank you for reaching out to us with your report! We have followed up on it and the issue has now been resolved. Kind regards,

-WritingTeam`;
        }

        if (selectField.value === "2. Reply to reporter (incorrect)") {
            return `Hello ${userName}, thank you for reaching out to us with your report! However, we have validated that the report is incorrect because WRITER POST REASONING HERE. Hopefully we have cleared any confusion you may have had! Kind regards,

-WritingTeam`;
        }

        return "";
    }

    // This function puts the template into the message box after the "Generate template" button was clicked.
    function pasteTemplateIntoTextArea() {
        console.log("pasteTemplateIntoTextArea called");
        var template = "";

        if (document.URL === "https://retroachievements.org/messages/WritingTeam/create") {
            console.log("Generating template for new message");
            template = generateTemplateNewMessage();
        }

        if (document.URL.includes("https://retroachievements.org/message-thread/")) {
            console.log("Generating template for reply");
            template = generateTemplateReply();
        }

        console.log("Generated template:", template);

        if (template) {
            var textArea = document.querySelector('textarea[name="body"]');
            console.log("Textarea found:", textArea);

            if (textArea) {
                // Focus the textarea first.
                textArea.focus();

                // Set the value using native setter to bypass React.
                const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                nativeTextAreaValueSetter.call(textArea, template);

                // Trigger multiple events to ensure React notices the change.
                const inputEvent = new Event('input', { bubbles: true });
                const changeEvent = new Event('change', { bubbles: true });

                textArea.dispatchEvent(inputEvent);
                textArea.dispatchEvent(changeEvent);

                // Also try triggering a React-specific event if needed.
                const reactEvent = new Event('input', { bubbles: true, cancelable: true });
                textArea.dispatchEvent(reactEvent);

                console.log("Template pasted into textarea with React-compatible events");
                console.log("Textarea value after paste:", textArea.value.substring(0, 50) + "...");
            } else {
                console.log("ERROR: Could not find textarea element");
            }
        } else {
            console.log("No template generated");
        }
    }

    // Initialize the script when the page loads.
    function init() {
        console.log("=== WritingTeam Template Generator Initializing ===");
        console.log("Current URL:", document.URL);
        console.log("Document ready state:", document.readyState);

        if (document.URL === "https://retroachievements.org/messages/WritingTeam/create") {
            console.log("Detected: Create new message page");
            addDropdownAndFieldsNewMessage();
        } else if (document.URL.includes("https://retroachievements.org/message-thread/")) {
            console.log("Detected: Reply to message thread page");
            addDropdownReply();
        } else {
            console.log("Not on a recognized page - script will not activate");
        }
    }

    // Run the initialization.
    console.log("Script loaded, waiting for DOM...");

    // Add a small delay to ensure DOM is fully loaded.
    setTimeout(function() {
        console.log("Starting initialization after delay...");
        init();
    }, 500);

})();