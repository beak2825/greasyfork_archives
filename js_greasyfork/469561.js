// ==UserScript==
// @name         打开选中的pixiv id
// @name:en      Open the selected Pixiv ID
// @namespace    https://greasyfork.org/zh-CN/scripts/469561-%E6%89%93%E5%BC%80%E9%80%89%E4%B8%AD%E7%9A%84pixiv-id
// @version      2.0
// @description  在鼠标选中pixiv id后询问是否要跳转到对应网站
// @description:en  Ask if you want to navigate to the corresponding website after selecting a Pixiv ID with the mouse
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469561/%E6%89%93%E5%BC%80%E9%80%89%E4%B8%AD%E7%9A%84pixiv%20id.user.js
// @updateURL https://update.greasyfork.org/scripts/469561/%E6%89%93%E5%BC%80%E9%80%89%E4%B8%AD%E7%9A%84pixiv%20id.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hasOpenedDialog = false; // flag to check if the dialog has been opened

    // get the selected text or extract the numeric sequence if less than 100 bytes
    function getSelectionNumericSequence() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }

        // Extract numeric sequence if the selected text is less than 100 bytes
        if (text.length < 100) {
            var numericSequence = text.match(/\d+/g); // Extract numeric sequence
            if (numericSequence) {
                return numericSequence.join(""); // Concatenate numeric sequence
            }
        }
        return null;
    }

    // check if the text is a valid pixiv id
    function isValidPixivId(text) {
        text = text.replace(/\s/g, ''); // remove all whitespace characters
        var regex = /^\d{5,12}$/; // a number between 5 and 12 digits
        return regex.test(text);
    }

    // generate the pixiv url by id
    function getPixivUrl(id) {
        var baseUrl = "https://www.pixiv.net/member_illust.php?illust_id=";
        return baseUrl + id + "&mode=medium";
    }

    // open the pixiv url in a new tab
    function openPixivUrl(url, active) {
        GM_openInTab(url, {active: active, insert: true});
    }

    // create a custom confirm dialog with four buttons
    function createCustomConfirm(url) {
        var dialog = document.createElement("div"); // create a div element for the dialog
        dialog.id = "custom-confirm"; // set the id of the dialog
        dialog.className = "custom-confirm"; // set the class name of the dialog

        var message = document.createElement("p"); // create a p element for the message
        message.className = "custom-confirm-message"; // set the class name of the message
        message.textContent = "你想要打开这个pixiv作品吗：" + url + "?"; // set the text content of the message

        var buttons = document.createElement("div"); // create a div element for the buttons
        buttons.className = "custom-confirm-buttons"; // set the class name of the buttons

        var button1 = document.createElement("button"); // create a button element for the first button
        button1.className = "custom-confirm-button"; // set the class name of the first button
        button1.textContent = "打开并留在当前标签页"; // set the text content of the first button

        var button2 = document.createElement("button"); // create a button element for the second button
        button2.className = "custom-confirm-button"; // set the class name of the second button
        button2.textContent = "打开并跳转到新标签页"; // set the text content of the second button

        var button3 = document.createElement("button"); // create a button element for the third button
        button3.className = "custom-confirm-button"; // set the class name of the third button
        button3.textContent = "取消"; // set the text content of the third button

        var button4 = document.createElement("button"); // create a button element for the fourth button
        button4.className = "custom-confirm-button disable-script"; // set the class name of the fourth button with an additional class for styling
        button4.textContent = "在当前标签页停用"; // set the text content of the fourth button

        buttons.appendChild(button1); // append the first button to the buttons div
        buttons.appendChild(button2); // append the second button to the buttons div
        buttons.appendChild(button3); // append the third button to the buttons div
        buttons.appendChild(button4); // append the fourth button to the buttons div

        dialog.appendChild(message); // append the message to the dialog div
        dialog.appendChild(buttons); // append the buttons to the dialog div

        document.body.appendChild(dialog); // append the dialog to the body

        return {dialog: dialog, button1: button1, button2: button2, button3: button3, button4: button4}; // return an object with references to the dialog and buttons elements
    }

    // add some styles for the custom confirm dialog
    function addCustomConfirmStyles() {
        var css = `
.custom-confirm {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  max-width: 90%;
  background-color: #fff;
  border: 2px solid #3498db;
  border-radius: 8px;
  padding: 20px;
  z-index: 9999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-confirm-message {
  margin: 10px 0;
  font-size: 16px;
}

.custom-confirm-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.custom-confirm-button {
  flex: 1;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  color: #000; /* Set text color to black */
  background-color: #3498db;
  transition: background-color 0.3s ease;
}

.custom-confirm-button:hover {
  background-color: #297fb8;
}

.disable-script {
  background-color: #e74c3c;
}

.disable-script:hover {
  background-color: #c0392b;
}
`;
        GM_addStyle(css); // add the css to the document
    }

    // handle the mouseup event
    function handleMouseUp(event) {
        var numericSequence = getSelectionNumericSequence(); // get the numeric sequence from the selected text
        if (numericSequence && isValidPixivId(numericSequence) && !hasOpenedDialog) { // check if it is a valid pixiv id and dialog is not already opened
            var url = getPixivUrl(numericSequence); // generate the pixiv url
            var customConfirm = createCustomConfirm(url); // create a custom confirm dialog
            addCustomConfirmStyles(); // add some styles for the dialog
            hasOpenedDialog = true; // set the flag to true

            customConfirm.button1.addEventListener("click", function() { // add a click event listener to the first button
                openPixivUrl(url, false); // open the url in a new tab but stay in the current tab
                document.body.removeChild(customConfirm.dialog); // remove the dialog from the body (added this line)
                clearSelection(); // clear the selected text
                hasOpenedDialog = false; // reset the flag
            }, false);

            customConfirm.button2.addEventListener("click", function() { // add a click event listener to the second button
                openPixivUrl(url, true); // open the url in a new tab and switch to it
                document.body.removeChild(customConfirm.dialog); // remove the dialog from the body (added this line)
                clearSelection(); // clear the selected text
                hasOpenedDialog = false; // reset the flag
            }, false);

            customConfirm.button3.addEventListener("click", function() { // add a click event listener to the third button
                document.body.removeChild(customConfirm.dialog); // remove the dialog from the body
                clearSelection(); // clear the selected text
                hasOpenedDialog = false; // reset the flag
            }, false);

            customConfirm.button4.addEventListener("click", function() { // add a click event listener to the fourth button
                document.body.removeChild(customConfirm.dialog); // remove the dialog from the body
                clearSelection(); // clear the selected text
                hasOpenedDialog = false; // reset the flag
                disableScript(); // disable the script
            }, false);
        }
    }

    // clear the selected text
    function clearSelection() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    }

    // disable the script
    function disableScript() {
        document.removeEventListener("mouseup", handleMouseUp, false);
    }

    // add the event listener to the document
    document.addEventListener("mouseup", handleMouseUp, false);
})();
