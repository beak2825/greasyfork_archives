// ==UserScript==
// @name   Add Back and Next Button to Bytes.dev
// @include /^https?:\/\/bytes\.dev\/archives\/\d+/
// @include /^bytes\.dev\/archives\/\d+/
// @description   Add Back and Next Button to Bytes.dev Articles
// @version 0.0.5
// @namespace https://greasyfork.org/users/1019668
// @downloadURL https://update.greasyfork.org/scripts/489758/Add%20Back%20and%20Next%20Button%20to%20Bytesdev.user.js
// @updateURL https://update.greasyfork.org/scripts/489758/Add%20Back%20and%20Next%20Button%20to%20Bytesdev.meta.js
// ==/UserScript==
 
 window.addEventListener("load", () => {
    // Get the current article URL
    const currentUrl = window.location.href;

    // Extract the article number from the URL
    const articleNumber = parseInt(currentUrl.split("/").pop());

    // Calculate the previous and next article numbers
    const previousArticleNumber = articleNumber - 1;
    const nextArticleNumber = articleNumber + 1;

    // Create a container div for the buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.gap = "10px";

    // Create the "Previous" button
    const backButton = document.createElement("button");
    backButton.textContent = "Previous";
    backButton.style.backgroundColor = "white";
    backButton.style.color = "black";
    backButton.style.border = "none";
    backButton.style.padding = "10px 20px";
    backButton.style.borderRadius = "5px";
    backButton.addEventListener("click", () => {
        // Navigate to the previous article
        window.location.href = `https://bytes.dev/archives/${previousArticleNumber}`;
    });

    // Create the "Next" button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.style.backgroundColor = "white";
    nextButton.style.color = "black";
    nextButton.style.border = "none";
    nextButton.style.padding = "10px 20px";
    nextButton.style.borderRadius = "5px";
    nextButton.addEventListener("click", () => {
        // Navigate to the next article
        window.location.href = `https://bytes.dev/archives/${nextArticleNumber}`;
    });

    // Append the buttons to the container div
    buttonContainer.appendChild(backButton);
    buttonContainer.appendChild(nextButton);

    // Find the footer element
    const footer = document.querySelector("footer");

    // Insert the container div above the footer
    footer.insertAdjacentElement("beforebegin", buttonContainer);
});
