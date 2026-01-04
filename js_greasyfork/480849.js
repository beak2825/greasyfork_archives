// ==UserScript==
// @name         ChatTranslate
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Create a new button to ask ChatGPT explain Japanese text from clipboard. 创建一个按钮来让ChatGPT解释剪贴板中的日文。
// @author       Glaceon
// @match        https://chat.openai.com/*
// @grant        none
// @license      MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/480849/ChatTranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/480849/ChatTranslate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for the button
    const css = `
#buttonLoad {
    border-radius: 10px; /* Rounded corners */
    font-size: 16px; /* Font size */
    border-color: lightgray;
    padding: 10px 20px;
    background: none;
    position: absolute;
    left: -290px;
    display: flex;
    border: 1px solid lightgrey;
}

.list-container ul {
  counter-reset: list-counter;  /* Initialize the counter */
  list-style-type: none;        /* Removes default list style */
}

.list-container li {
  counter-increment: list-counter;  /* Increment the counter */
  margin-bottom: 8px;               /* Add some bottom margin for spacing between items */
  padding-left: 30px;               /* Provide padding to avoid text overlap */
}

.list-container li::before {
  content: counter(list-counter) ". "; /* Display the counter and a dot */
  margin-left: -30px;                    /* Pull the number into the padding area */
  text-align: right;                     /* Right-align the number within the negative margin space */
}

.language-select {
    border-radius: 10px; /* Rounded corners */
    font-size: 16px; /* Font size */
    border-color: lightgray;
    padding: 10px 20px;
    background: none;
}
        `;

    // Inject CSS into the head
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    function insertDivs(listNode, htmlString) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlString, 'text/html');
        var divs = doc.querySelectorAll('p');
        console.log('hi');

        console.log(divs);

        divs.forEach(function(div) {
            listNode.appendChild(div.cloneNode(true));
        });
    }

    function askChat(text) {
//         let newButton = document.querySelector('askButton');
//         newButton.disabled = true;

        let sendButton = document.querySelector('button[data-testid="send-button"]');
        let textarea = document.getElementById('prompt-textarea');
        let lang = document.getElementById('languageSelect');

        // Successfully got text from clipboard
        if (lang.value == 'JA') {
        textarea.value = `
解释日文并注音. 例如:
解释: 翌日が訪れた.
意思是"第二天到了". 各部分解释如下:
翌日 (よくじつ): 这个词的意思是“次日”或者“第二天”，指的是在谈话的当天之后的那一天。
が訪れた (がおとずれた): 这里的“が”是一个语法上的连接词，用来连接主语和谓语。而“訪れた”是“訪れる”的过去式，意思是“到来”或者“访问”。
---
解释: `; // Set clipboard text to textarea
        } else if (lang.value == 'EN') {
            textarea.value = `Translate to English\n`;
        } else {
            textarea.value = `翻译为中文\n`;
        }

        textarea.value += text;

        // Dispatch an 'input' event to mimic user typing
        let event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        textarea.dispatchEvent(event);

        // Rest of your code to enable and click the send button...
        let clickInterval = setInterval(function() {
            if (!sendButton.disabled) { // Check if the button is not disabled
                sendButton.click();
                clearInterval(clickInterval); // Clear the interval to stop checking
//                 newButton.disabled = false;
            }
        }, 100);

    }

    function createSentenceLists() {
        // let form = document.querySelector('form');
        // let contents = document.createElement('div');
        // contents.style = "overflow: auto; max-height:30vh";
        // contents.className = "mx-auto md:px-5 lg:px-1 xl:px-5 md:max-w-2xl";

        let contents = document.createElement("div");

        // Set the id attribute of the new div to "tl"
        contents.id = "tl";

        // Apply CSS styles to position the div
        contents.style.top = "0";
        contents.style.right = "0";
        contents.style.width = "25%";
        contents.style.height = "100%";
        contents.style.overflow_y = "auto";
        contents.style.overflow = "auto";
        // contents.style.backgroundColor = "lightgray";
        contents.style.position = "fixed";


        // Get a reference to the <main> element
        // var presentationDiv = document.querySelector('div[role="presentation"]').firstElementChild;


        // presentationDiv.style.display = "flex";

        // form.parentNode.appendChild(contents);

        // Append the new div to the <main> element
        document.querySelector("main").appendChild(contents);

        // Create a file input element
        let file = document.createElement('input');

        // Append file input to contents
        contents.appendChild(file);
        contents.classList = "list-container"

        file.id = 'fileInput';
        file.type = 'file'; // Specify that this is a file input
        file.accept = '.html';
        file.style.display = 'none'; // Hide the file input

        file.addEventListener('change', function(event) {
            if (file.files.length > 0) {
                let reader = new FileReader();

                reader.onload = function(e) {


                    let text = e.target.result;
                    // Now you have the contents of the file
                    let sentences = document.createElement('ul');
                    sentences.id = 'sentences';

                    sentences.innerHTML = text;
                    contents.appendChild(sentences);

                    let paragraphs = sentences.querySelectorAll('li');

                    sentences.innerHTML = "";

                    // Add event listeners to each <p> element
                    paragraphs.forEach(function(p) {
                        p.addEventListener('click', function() {
                            // Define what happens when a <p> is clicked
                            console.log('Paragraph clicked:', p.textContent);
                            askChat(p.textContent);
                        });
                        sentences.appendChild(p);
                    });

                    // insertDivs(contents, text);
                    // console.log(contents); // You can process the file contents here
                };

                reader.readAsText(file.files[0]); // Read the first selected file
            }
        });


        // Create a button for selecting files.
        let button = document.createElement('button'); button.id = 'buttonLoad'; button.innerText = 'Select File';
        button.onclick = function() {
            file.click(); // Trigger the file input when button is clicked
        };
        let container = document.getElementById("prompt-textarea").parentNode.parentNode.parentNode;
        container.appendChild(button);
    }

    createSentenceLists();

    function createSelectMenu() {

        // HTML for the language selector
        const html = `
            <select id="languageSelect" class="language-select">
                <option value="JA">JA</option>
                <option value="EN">EN</option>
                <option value="ZH">ZH</option>
            </select>
        `;
        const menu = document.createElement('div');

        menu.style.display = 'flex';
        menu.style.position = 'absolute';
        menu.style.left = '-160px';

        // Inject HTML into the body (You may want to adjust where exactly it is added)
        let container = document.getElementById("prompt-textarea").parentNode.parentNode.parentNode;
        container.appendChild(menu);
        menu.innerHTML = html;

        // Get the select element
        const languageSelect = document.getElementById('languageSelect');

        // Set the stored value on page load
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
        }

        // Add event listener to store selection
        languageSelect.addEventListener('change', function() {
            localStorage.setItem('selectedLanguage', languageSelect.value);
        });
    }


    createSelectMenu();

    function createCustomButton() {

        let newButton = document.createElement('askButton');
        newButton.innerHTML = '?';

        // Set the position of the new button relative to the send button
        newButton.style.display = 'flex';
        newButton.style.position = 'absolute';
        newButton.style.left = '-80px';
        // newButton.style.right = (30) + 'px'; // Adjust this value to move the button left of the send button
        // newButton.style.bottom = 100 + 'px';

        // Basic styling to make it look like a traditional button
//        newButton.style.backgroundColor = '#007bff'; // Button background color
        newButton.style.color = '#007bff';             // Text color
        newButton.style.padding = '10px 20px';       // Padding inside the button
        newButton.style.border = '1px solid #007bff';             // No border
        newButton.style.borderRadius = '10px';        // Rounded corners
        newButton.style.cursor = 'pointer';          // Cursor changes on hover
        newButton.style.fontSize = '16px';           // Font size
        newButton.style.fontWeight = 'bold';         // Font weight

        let container = document.getElementById("prompt-textarea").parentNode.parentNode.parentNode;

        // Append the new button to the same parent as the send button
        container.appendChild(newButton);

        newButton.addEventListener('click', function() {
            navigator.clipboard.readText()
                .then(text => askChat(text))
                .catch(err => {
                // Handle errors (like if clipboard access is denied)
                console.error('Failed to read clipboard contents: ', err);
            });

        });
    }

    createCustomButton();
})();
