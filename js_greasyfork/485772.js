// ==UserScript==
// @name         FMHY Base64 Auto Decoder
// @version      2.5
// @author       Rust1667
// @description  Decode base64-encoded links in some pastebins and make URLs clickable
// @match        *://rentry.co/*
// @match        *://rentry.org/*
// @match        *://pastes.fmhy.net/*
// @match        *://bin.disroot.org/?*#*
// @match        *://privatebin.net/?*#*
// @match        *://textbin.xyz/?*#*
// @match        *://bin.idrix.fr/?*#*
// @match        *://privatebin.rinuploads.org/?*#*
// @match        *://pastebin.com/*
// @grant        none
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://fmhy.net&size=64
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/485772/FMHY%20Base64%20Auto%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/485772/FMHY%20Base64%20Auto%20Decoder.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Regular expression to match base64-encoded strings
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    // Function to decode base64 string
    function decodeBase64(encodedString) {
        return atob(encodedString);
    }

    // Function to check if a string is a URL
    function isURL(str) {
        const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(str);
    }

    // Different script for different pastebins
    var currentUrl = window.location.href;
    const rentryOrSnowbinRegex =          /^(https?:\/\/(?:rentry\.co|rentry\.org|pastes\.fmhy\.net)\/[\w\W]+)/;
    const FMHYmainBase64PageRegex =       /^https:\/\/rentry\.(?:co|org)\/fmhybase64(?:#.*)?/i;
    const fmhyBase64RawRentryPageRegex =  /^https:\/\/rentry\.(co|org)\/FMHYBase64\/raw$/i;
    const privatebinDomainsRegex =        /^(https?:\/\/(?:bin\.disroot\.org|privatebin\.net|textbin\.xyz|bin\.idrix\.fr|privatebin\.rinuploads\.org)\/[\w\W]+)/;
    const pastebinComRegex =              /^https:\/\/pastebin\.com\/.*/;

    // PASTEBIN.COM
    if (pastebinComRegex.test(currentUrl)) {
      let elements = document.querySelectorAll('.de1');
        elements.forEach(function(element) {
            let text = element.textContent.trim();
            if (text.startsWith('aHR0')) {
              let decodedText = decodeBase64(text);

              // Get the color of the original text
              let originalColor = window.getComputedStyle(element).color;

              // Turn each valid URL in the decoded text into a clickable link
              let htmlWithLinks = decodedText.replace(
                /(https?:\/\/[^\s]+)/g, // find anything that looks like a URL
                '<a href="$1" target="_blank" style="color: ' + originalColor + ';">$1</a>'
              );

              // Replace newlines with <br> for readability
              htmlWithLinks = htmlWithLinks.replace(/\n/g, '<br>');

              // Replace the original text with the new clickable version
              element.innerHTML = htmlWithLinks;
            }
        });


    //RENTRY OR PASTES.FMHY
    } else if (rentryOrSnowbinRegex.test(currentUrl) && !fmhyBase64RawRentryPageRegex.test(currentUrl)) {

      // Select appropriate tags based on the URL matching
      var elementsToCheck = FMHYmainBase64PageRegex.test(currentUrl) ? document.querySelectorAll('code') : document.querySelectorAll('code, p');

      // Loop through each selected element
      elementsToCheck.forEach(function(element) {
          // Get the content of the element
          var content = element.textContent.trim();

          // Check if the content matches the base64 regex
          if (base64Regex.test(content)) {
              // Decode the base64-encoded string
              var decodedString = decodeBase64(content).trim();

              // If the decoded string has URLs, decode it and linkify when possible
              if (isURL(decodedString) || (decodedString.includes('http') && decodedString.includes('\n'))) {

                  // One line
                  if (!decodedString.includes('\n')) {
                    var link = document.createElement('a');
                    link.href = decodedString;
                    link.textContent = decodedString;
                    link.target = '_self'; // Open link in the same tab
                    element.textContent = ''; // Clear the content of the element
                    element.appendChild(link); // Append the link to the element
                  }
                  //Multiple lines
                  else {
                    const lines = decodedString.split("\n");
                    const links = lines.map(line => isURL(line.trim()) ? "<a href='" + line.trim() + "'>" + line.trim() + "</a>" : line.trim());
                    element.innerHTML = links.join("<br>");
                  }

              }
          }
      });



    //FMHY-BASE64 RAW RENTRY PAGE
    } else if (fmhyBase64RawRentryPageRegex.test(currentUrl)) {

        // Find all lines starting with "* `"
        const lines = document.body.innerText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('`')) {
                const startIndex = line.indexOf('`');
                const endIndex = line.lastIndexOf('`');
                const encodedText = line.substring(startIndex + 1, endIndex).trim();
                const decodedText = atob(encodedText);
                const newLine = line.substring(0, startIndex) + decodedText + line.substring(endIndex + 1);
                lines[i] = newLine;
            }
        }

        // Update the page content with decoded lines
        document.body.innerText = lines.join('\n');




    // PRIVATEBIN
    } else if (privatebinDomainsRegex.test(currentUrl)) {

      // Wait for the decryption process to finish
      function waitForDecryption() {
          const prettyPrintElement = document.getElementById('prettyprint');
          if (prettyPrintElement && prettyPrintElement.textContent.trim() !== '') {
              let decryptedText = prettyPrintElement.innerHTML.trim();
              const lines = decryptedText.split('\n');

              // Flag to track if any modifications were made
              let modified = false;

              // Iterate through each line
              lines.forEach(line => {
                  // Check if the line contains a potential Base64 encoded string
                  if (base64Regex.test(line)) {
                      // Attempt to decode the potential Base64 encoded string
                      try {
                          const decodedText = decodeBase64(line);
                          // Trim the decoded text before checking if it's a URL
                          const trimmedText = decodedText.trim();
                          // If trimmed decoded string is a URL, make it clickable
                          if (isURL(trimmedText)) {
                              // Replace the line with the decoded and linked text
                              decryptedText = decryptedText.replace(line, '<a href="' + trimmedText + '">' + trimmedText + '</a>');
                              modified = true;
                          }
                      } catch (error) {
                          // If an error occurs during decoding, show it in an alert message
                          //alert("Unable to decode the string: " + line);
                      }
                  } else if (line.startsWith('`') && line.endsWith('`')) {
                      // Check if the line starts and ends with backticks
                      let textInsideBackticks = line.slice(1, -1);
                      // Check if textInsideBackticks is a Base64 encoded string
                      if (base64Regex.test(textInsideBackticks)) {
                      // Attempt to decode the text inside backticks
                        try {
                            const decodedText = decodeBase64(textInsideBackticks);
                            // Trim the decoded text before checking if it's a URL
                            const trimmedText = decodedText.trim();
                            // If trimmed decoded string is a URL, make it clickable
                            if (isURL(trimmedText)) {
                                // Replace the line with the decoded and linked text
                                decryptedText = decryptedText.replace(line, '<a href="' + trimmedText + '">' + trimmedText + '</a>');
                                modified = true;
                            }
                        } catch (error) {
                            // If an error occurs during decoding, show it in an alert message
                            //alert("Unable to decode the string: " + textInsideBackticks);
                        }
                      }
                  }
              });

              // If modifications were made, show modified text in the page
              if (modified) {
                prettyPrintElement.innerHTML = decryptedText;
              }

          } else {
              setTimeout(waitForDecryption, 500); // Check again in 500ms
          }
      }

      // Start waiting for decryption
      waitForDecryption();
    }





})();
