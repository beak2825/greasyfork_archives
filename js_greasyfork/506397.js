// ==UserScript==
// @name         Vault Buttons
// @namespace    Titanic_, zstorm
// @version      1.3.2
// @description  Adds buttons for quick withdrawal and deposit to the vault. See Screenshots.
// @license      MIT
// @author       Titanic_, zstorm
// @match        https://www.torn.com/properties.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506397/Vault%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/506397/Vault%20Buttons.meta.js
// ==/UserScript==

//====================UPDATE:===============================
// 1.3.2  remove depositButton.click(); at line 111 to avoid captcha.
// 1.3.1  Adapt the script from Titanic_'s one.
//========================================================

function addElements() {
    // Check if the buttons are already added
    if (document.getElementById("custom-buttons-container")) {
        return; // Exit the function if buttons already exist
    }

    let parent = document.createElement("div");
    let leftContainer = document.createElement("div");
    let rightContainer = document.createElement("div");

    parent.id = "custom-buttons-container";
    leftContainer.id = "custom-buttons";
    rightContainer.id = "custom-buttonsright";

    // Add buttons to their respective containers
    addButton(leftContainer, "-352", 352500);
    addButton(leftContainer, "-15m", 15000000);
    addButton(leftContainer, "-23m", 23000000);
    addPasteButton(leftContainer);
    addMagicButton();

        // Append the containers to the parent
    parent.appendChild(leftContainer);
    parent.appendChild(rightContainer);

    let div = document.querySelector("form.left .cont.torn-divider");

    if (div) {
        div.parentNode.insertBefore(parent, div.nextSibling);
    }
}

function addButton(parent, label, amount) {
    let btn = document.createElement("input");
    btn.value = label;
    btn.type = "button";
    btn.classList.add("torn-btn");

     btn.addEventListener("click", () => {
        let $inputVisible = document.querySelector("form.left > div.torn-divider > div.input-money-group > input.input-money");
        let $inputHidden = document.querySelectorAll("form.left > div.torn-divider > div.input-money-group > input.input-money")[1];
        let value = parseInt($inputHidden.value);

        if(isNaN(value)) { value = 0 }
        $inputVisible.value = amount + value;
        $inputVisible.dispatchEvent(new Event("input", { bubbles: true }));
    });

    parent.appendChild(btn);
}

function addPasteButton(parent) {
    let btn = document.createElement("input");
    btn.value = "Clear";
    btn.type = "button";
    btn.classList.add("torn-btn");

    btn.addEventListener("click", () => {
        let $inputVisible = document.querySelector("form.left > div.torn-divider > div.input-money-group > input.input-money");
        let $inputHidden = document.querySelectorAll("form.left > div.torn-divider > div.input-money-group > input.input-money")[1];
        $inputVisible.value = 0;
        $inputVisible.dispatchEvent(new Event("input", { bubbles: true }));

    });

    parent.appendChild(btn);
}

function addMagicButton() {
    let depositButtonWrapper = document.querySelector(".vault-cont.right.deposit-box .btn-wrap.silver .btn");

    if (depositButtonWrapper) {
        let btn = document.createElement("input");
        btn.value = "$";
        btn.type = "button";
        btn.classList.add("torn-btn");
        btn.id = "qdeposit-btn"; // Give it an ID for easy manipulation

        btn.addEventListener("click", () => {
            // Perform the QDeposit logic
            let $inputVisible = document.querySelector("form.right > div.torn-divider > div.input-money-group > input.input-money");
            let amountOnHand = document.querySelector(".dvalue").textContent.replace(/[^0-9]/g, '');
            $inputVisible.value = amountOnHand;
            $inputVisible.dispatchEvent(new Event("input", { bubbles: true }));

            // Hide the QDeposit button after it's clicked
            btn.style.display = "none";

            // Enable and click the underlying Deposit button
            let depositButton = document.querySelector(".vault-cont.right.deposit-box .btn-wrap.silver .btn input.torn-btn");
            if (depositButton) {
                depositButton.disabled = false;
               
            }
        });

        // Append the QDeposit button to the Deposit button's wrapper
        depositButtonWrapper.style.position = "relative"; // Ensure the wrapper is positioned relative
        depositButtonWrapper.appendChild(btn);
    }
}

function inputCheck() {
    setTimeout(function() {
        if (document.querySelector('.input-money-group > .input-money')) {
            addElements();
        }
    }, 300);
}

const observer = new MutationObserver(() => {
    if (window.location.href.includes("tab=vault")) {
        inputCheck();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

if (window.location.href.includes("tab=vault")) {
    inputCheck();
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Add CSS to position the QDeposit button directly over the Deposit button
addGlobalStyle(`
    #qdeposit-btn {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(106, 13, 173, 0.8); /* Slightly transparent background */
        color: #ffffff;
        border-radius: 5px;
        z-index: 1000;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        font-size: 16px;

    }
`);
addGlobalStyle('#custom-buttons { justify-content: center; margin: 0 auto 50 auto;  display: flex; gap: 10px; padding-top: 2.5px; padding-bottom: 2.5px; }');
addGlobalStyle('#custom-buttons > input:nth-of-type(1) { background: #2aab2a ; color: #ffffff;');
addGlobalStyle('#custom-buttons > input:nth-of-type(1):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(42, 171, 42, 1), 0 0 15px rgba(42, 171, 42, 1), 0 0 15px rgba(42, 171, 42, 1); }');
addGlobalStyle('#custom-buttons > input:nth-of-type(2) { background: #208220 ; color: #ffffff;');
addGlobalStyle('#custom-buttons > input:nth-of-type(2):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(42, 171, 42, 1), 0 0 15px rgba(42, 171, 42, 1), 0 0 15px rgba(42, 171, 42, 1); }');
addGlobalStyle('#custom-buttons > input:nth-of-type(3) { background: #114511 ; color: #ffffff;');
addGlobalStyle('#custom-buttons > input:nth-of-type(3):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(42, 171, 42, 1), 0 0 15px rgba(42, 171, 42, 1), 0 0 15px rgba(42, 171, 42, 1); }');
addGlobalStyle('#custom-buttons > input:nth-of-type(4) { background: #8b0000 ; color: #ffffff;');
addGlobalStyle('#custom-buttons > input:nth-of-type(4):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(139, 0, 0, 1), 0 0 15px rgba(139, 0, 0, 1), 0 0 15px rgba(139, 0, 0, 1); }');
addGlobalStyle('.vault-cont.right.deposit-box .btn-wrap.silver .btn > input:nth-of-type(2) { background: #8b0000; color: #ffffff; border: 1.5px solid #8a2be2; border-radius: 12px; font-size: 16px; box-shadow: 0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.5), 0 0 30px rgba(138, 43, 226, 0.5); text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); transition: transform 0.3s ease, box-shadow 0.3s ease; }');
addGlobalStyle('.vault-cont.right.deposit-box .btn-wrap.silver .btn > input:nth-of-type(2):hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(138, 43, 226, 0.7), 0 0 30px rgba(138, 43, 226, 0.7), 0 0 40px rgba(138, 43, 226, 0.7); }');

