// ==UserScript==
// @name:en         Custom Commands Dropdown
// @name Custom Commands Dropdown
// @namespace    pl.4as.chatgpt
// @version      0.2
// @description Add a dropdown of custom commands to a page
// @description:en  Add a dropdown of custom commands to a page
// @author       Description009
// @match *://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479988/Custom%20Commands%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/479988/Custom%20Commands%20Dropdown.meta.js
// ==/UserScript==

"use strict";

(function () {
  "use strict";
  console.log("CCD loading...");

  // This function will add our custom commands dropdown
  function addCustomCommandsDropdown() {
    // Get the textarea by ID
    const textareaElement = document.getElementById("prompt-textarea");

    // If the textarea exists, proceed to add the dropdown
    if (textareaElement) {
      // Create the select element
              var select_id=document.getElementById('commands')
      if (select_id){console.log('menu is loaded')}else{
      const select = document.createElement("select");
      select.name = "Commands";
      select.id = "commands";
      select.style.borderTop = "none";
      select.className =
        "m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-4 md:pr-12 gizmo:md:py-3.5 pl-12 gizmo:pl-10 md:pl-[46px] gizmo:md:pl-[55px]";

      // List of commands for autocomplete
      const commands = [
        "Select Command",
        "myfiles_browser.search",
        "myfiles_browser.open_url",
        "myfiles_browser.back",
        "myfiles_browser.scroll",
        "myfiles_browser.quote_lines",
        "browser.search",
        "browser.click",
        "browser.back",
        "browser.scroll",
        "browser.open_url",
        "browser.quote_lines",
        // ... add any other commands here if necessary
      ];

      // Populate the select element with options
      commands.forEach((command) => {
        const option = document.createElement("option");
        option.value = command;
        option.textContent = command;
        option.style.backgroundColor = "#343541";
        option.style.borderBottom = "none";
        select.appendChild(option);
      });

      // Insert the select element before the textarea
      textareaElement.parentNode.insertBefore(select, textareaElement);

      // Event listener for select change
      select.addEventListener("change", function () {
        const selectedOption = select.options[select.selectedIndex].value;
        textareaElement.value += selectedOption + "();\n";
      });
      }
      console.log("Custom commands dropdown added.");
    } else {
      console.error("Textarea not found.");
    };
   setTimeout(addCustomCommandsDropdown,2000);console.log('Run function');
  }

  // Inject our addCustomCommandsDropdown function into the page
  function injectFunction(fn) {
    const script = document.createElement("script");
    script.text = `(${fn.toString()})();`;
      script.id = 'CustomCommand'
    document.body.appendChild(script);
    console.log("Code injected using injectionFunc");
  }

  // Wait 10 seconds after the page loads before injecting the dropdown
  setTimeout(function () {
    injectFunction(addCustomCommandsDropdown);
  }, 1000); // 1 seconds expressed in milliseconds
})();
