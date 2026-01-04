// ==UserScript==
// @name         ErdemSoft - Full Transfer Automation v9.22
// @namespace    http://tampermonkey.net/
// @version      9.22
// @description  Adds copy buttons for name, hour, phone, process + create transfer with auto phone fill and dropdown fix
// @match        https://panel.mekcrm.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/534306/ErdemSoft%20-%20Full%20Transfer%20Automation%20v922.user.js
// @updateURL https://update.greasyfork.org/scripts/534306/ErdemSoft%20-%20Full%20Transfer%20Automation%20v922.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentURL = window.location.href;

    if (currentURL.includes('/createtransfer')) {
        // We are on the Create Transfer page
        autoFillPhone();
    } else if (currentURL.includes('/transfer-listesi') || currentURL.includes('/transfer_duzenle')) {
        // We are on the Transfer List or Edit Transfer page
        setInterval(replaceCancelButtonWithCopy, 200); // Replace "Vazgeç" button with Copy Message button
        setInterval(addPhoneCopyButton, 200); // Add copy button for phone number
        setInterval(addCopyButtons, 200); // Add all other copy buttons
    } else {
        // We are on other pages like Transfer Takvim
        setInterval(addCopyButtons, 200);
    }

    // Replaces the "Vazgeç" button with the "Copy Message" button when the modal appears
    function replaceCancelButtonWithCopy() {
        const cancelButton = document.querySelector('button.swal2-cancel');
        if (cancelButton && !cancelButton.classList.contains('myMessageButton')) {
            // Replace the "Vazgeç" button with the "Copy Message" button
            const copyMessageButton = document.createElement('button');
            copyMessageButton.textContent = "📋 Copy Message";
            copyMessageButton.style.position = 'absolute';
            copyMessageButton.style.left = '50%';
            copyMessageButton.style.transform = 'translateX(-50%)';
            copyMessageButton.style.padding = '10px 15px';
            copyMessageButton.style.backgroundColor = '#4CAF50';
            copyMessageButton.style.color = 'white';
            copyMessageButton.style.border = 'none';
            copyMessageButton.style.borderRadius = '5px';
            copyMessageButton.style.fontSize = '16px';
            copyMessageButton.style.cursor = 'pointer';
            copyMessageButton.style.zIndex = '10001';

            // Add click event to copy the message from the modal
            copyMessageButton.onclick = () => {
                const message = extractMessage();
                if (message) {
                    GM_setClipboard(message);
                    showCopiedToast(message);
                } else {
                    alert('No message found between single quotes!');
                }
            };

            // Replace the "Vazgeç" button with the copy button
            cancelButton.parentNode.replaceChild(copyMessageButton, cancelButton);
            console.log("✅ Replaced 'Vazgeç' button with copy button.");
        }
    }

    // Function to extract the message between single quotes
    function extractMessage() {
        const swalHtmlContainer = document.querySelector('.swal2-html-container');
        if (swalHtmlContainer) {
            const messageText = swalHtmlContainer.textContent.trim();

            // Use a regex to match content between single quotes
            const match = messageText.match(/'([^']+)'/);
            if (match && match[1]) {
                return match[1];  // Return the message between the single quotes
            }
        }
        return null; // Return null if no message is found
    }

    // Add copy button for phone number
    function addPhoneCopyButton() {
        const phoneElements = document.querySelectorAll('span.mus_telefon');
        for (const phoneElement of phoneElements) {
            if (!phoneElement.querySelector('.myPhoneCopyButton')) {
                const phoneNumber = phoneElement.textContent.trim();

                const btn = document.createElement('button');
                btn.textContent = "📞 Copy Phone";
                btn.className = "myPhoneCopyButton";
                btn.style.marginLeft = "10px";
                btn.style.padding = "2px 6px";
                btn.style.fontSize = "14px";
                btn.style.borderRadius = "5px";
                btn.style.border = "none";
                btn.style.backgroundColor = "#4CAF50";
                btn.style.color = "white";
                btn.style.cursor = "pointer";

                btn.onclick = (event) => {
                    event.preventDefault(); // Prevent the link from opening
                    GM_setClipboard(phoneNumber);
                    showCopiedToast(phoneNumber);
                };

                phoneElement.appendChild(btn);
                console.log("✅ Added 'Copy Phone' button.");
            }
        }
    }

    // Add the copy buttons for name, hour, process, etc.
    function addCopyButtons() {
        // --- Handle Ad Soyad (Name) ---
        const nameElements = document.querySelectorAll('li.transfer_adsoyad');
        for (const nameElement of nameElements) {
            if (!nameElement.querySelector('.myCopyButton')) {
                const originalText = nameElement.firstChild.textContent.trim();
                const btn = createButton("📋", "myCopyButton", originalText);
                nameElement.appendChild(btn);
            }
        }

        // --- Handle Saat (Hour) ---
        const timeElements = document.querySelectorAll('span.dnereden_tarih');
        for (const timeElement of timeElements) {
            if (!timeElement.querySelector('.myTimeButton')) {
                const fullText = timeElement.textContent.trim();
                const hourMatch = fullText.match(/\d{2}:\d{2}$/);
                if (!hourMatch) continue;

                const hourText = hourMatch[0];
                const btn = createButton("🕑", "myTimeButton", hourText);
                timeElement.appendChild(btn);
            }
        }

        // --- Handle Telefon (Phone) + Create Transfer button ---
        const phoneElements = document.querySelectorAll('li.transfer_telefon');
        for (const phoneElement of phoneElements) {
            if (!phoneElement.querySelector('.myPhoneButton')) {
                const link = phoneElement.querySelector('a');
                if (!link) continue;

                let phoneText = link.textContent.trim();
                if (phoneText.startsWith('+')) {
                    phoneText = phoneText.substring(1);
                }

                const btnCopy = createButton("📞", "myPhoneButton", phoneText);
                phoneElement.appendChild(btnCopy);

                const btnCreateTransfer = document.createElement('button');
                btnCreateTransfer.textContent = "🚀";
                btnCreateTransfer.className = "myCreateTransferButton";
                btnCreateTransfer.style.marginLeft = "5px";
                btnCreateTransfer.style.padding = "2px 6px";
                btnCreateTransfer.style.fontSize = "14px";
                btnCreateTransfer.style.borderRadius = "5px";
                btnCreateTransfer.style.border = "none";
                btnCreateTransfer.style.backgroundColor = "#00BCD4"; // Light blue
                btnCreateTransfer.style.color = "white";
                btnCreateTransfer.style.cursor = "pointer";

                btnCreateTransfer.onclick = () => {
                    window.open(`https://panel.mekcrm.com/createtransfer?phone=${phoneText}`, '_blank');
                };

                phoneElement.appendChild(btnCreateTransfer);
            }
        }

        // --- Handle İşlem Tip (Process Type) ---
        const processElements = document.querySelectorAll('li.transfer_islemtip');
        for (const processElement of processElements) {
            if (!processElement.querySelector('.myProcessButton')) {
                const processText = processElement.textContent.trim();
                const btn = createButton("🏥", "myProcessButton", processText);
                processElement.appendChild(btn);
            }
        }

        // --- Handle Ucusno (Flight Number) ---
        const ucusnoElements = document.querySelectorAll('li.transfer_ucusno');
        for (const ucusnoElement of ucusnoElements) {
            if (!ucusnoElement.querySelector('.myUcusnoButton')) {
                const originalText = ucusnoElement.textContent.trim();
                const btn = createButton("📋", "myUcusnoButton", originalText);
                ucusnoElement.appendChild(btn);
            }
        }

        // --- Handle Nereye (Airport) + Tarih (Date and Time) ---
        const airportElements = document.querySelectorAll('h3.nereye_baslik');
        for (const airportElement of airportElements) {
            const airportName = airportElement.textContent.trim();
            const dateElement = airportElement.closest('div').querySelector('span.dnereye_tarih');
            if (dateElement) {
                const dateTime = dateElement.textContent.trim();

                // Combine both with a space between them
                const combinedText = `${airportName} ${dateTime}`;

                if (!airportElement.querySelector('.myAirportButton')) {
                    const btn = createButton("📋", "myAirportButton", combinedText);
                    airportElement.appendChild(btn);
                }
            }
        }
    }

    function createButton(emoji, className, copyText) {
        const btn = document.createElement('button');
        btn.textContent = emoji;
        btn.className = className;
        btn.style.marginLeft = "10px";
        btn.style.padding = "2px 6px";
        btn.style.fontSize = "14px";
        btn.style.borderRadius = "5px";
        btn.style.border = "none";
        btn.style.backgroundColor = "#4CAF50";
        btn.style.color = "white";
        btn.style.cursor = "pointer";

        btn.onclick = () => {
            GM_setClipboard(copyText);
            showCopiedToast(copyText);
        };

        return btn;
    }

    function showCopiedToast(text) {
        const toast = document.createElement('div');
        toast.innerText = `Copied: ${text}`;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#4CAF50';
        toast.style.color = 'white';
        toast.style.padding = '10px 15px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '9999';
        toast.style.fontSize = '14px';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    function autoFillPhone() {
        const url = new URL(window.location.href);
        const phone = url.searchParams.get("phone");

        if (phone) {
            const inputBox = document.getElementById('ara8');
            if (inputBox) {
                // Clear the input box first to remove any leftover data
                inputBox.value = "";

                // Focus the input box to ensure it’s ready for interaction
                inputBox.focus();

                // Set the phone number directly into the input box
                inputBox.value = phone;

                // Dispatch the 'input' event to simulate user typing
                inputBox.dispatchEvent(new Event('input', { bubbles: true }));

                console.log("✅ Phone number inserted into the input box.");
            }
        }
    }

})();
