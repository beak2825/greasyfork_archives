// ==UserScript==
// @name        네부 모바일 가격 숨기기 및 버튼 추가
// @namespace   Violentmonkey Scripts
// @match       https://m.land.naver.com/map*
// @grant       none
// @version     1.33
// @description 2024. 8. 9.
// @downloadURL https://update.greasyfork.org/scripts/515845/%EB%84%A4%EB%B6%80%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EA%B0%80%EA%B2%A9%20%EC%88%A8%EA%B8%B0%EA%B8%B0%20%EB%B0%8F%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/515845/%EB%84%A4%EB%B6%80%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EA%B0%80%EA%B2%A9%20%EC%88%A8%EA%B8%B0%EA%B8%B0%20%EB%B0%8F%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

window.addEventListener('load', function() {

    function start() {

      function replaceYearWithTTL(mutationsList) {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1 && node.classList.contains('pin') && node.classList.contains('is-active') && node.classList.contains('_marker') && node.classList.contains('_markerEnv')) {
                var ttl = node.getAttribute('ttl');
                if (ttl) {
                  var yearSpan = node.querySelector('.pin_year._markerEnv');
                  if (yearSpan) {
                    yearSpan.textContent = ttl;
                  }
                }
              }
            });
          }
        }
      }

    var observer2 = new MutationObserver(replaceYearWithTTL);

    var targetNode = document.body;

    var config = { childList: true, subtree: true };

    observer2.observe(targetNode, config);

        // Function to hide price_area element
        function hidePriceArea(priceArea) {
            if (priceArea) {
                priceArea.style.display = "none";
            }
        }

      // Function to create a custom button with the cloned _ncid value
function createCustomButton(buttonText, itemElement) {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', function() {
        const innerLinkElement = itemElement.querySelector('._innerLink._cachingList');
        if (innerLinkElement) {
            const ncid = innerLinkElement.getAttribute('_ncid');
            if (ncid) {
                // Perform the fetch request using the ncid value
                fetch(`https://luciferhong.duckdns.org:8888/naver-realestate/${ncid}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text(); // Retrieve the raw text response
                    })
                    .then(text => {
                        try {
                            const data = JSON.parse(text); // Try parsing the response as JSON
                            console.log(data);

                            // Remove the thumbnail element
                            const thumbnail = itemElement.querySelector('.thumbnail');
                            if (thumbnail) {
                                thumbnail.remove();
                            }

                            // Create a container for the result HTML if it doesn't exist
                            let resultContainer = itemElement.querySelector('.result-container');
                            if (!resultContainer) {
                                resultContainer = document.createElement('div');
                                resultContainer.className = 'result-container';
                                resultContainer.style.marginTop = '10px';

                                // Insert the result container above quantity_area
                                const quantityArea = itemElement.querySelector('.quantity_area');
                                if (quantityArea) {
                                    quantityArea.insertAdjacentElement('beforebegin', resultContainer);
                                }
                            }

                            // Set the inner HTML of the result container to the result
                            resultContainer.innerHTML = data.result;

                            // Adjust _listContainer height based on new content
                            adjustListContainerHeight();

                        } catch (error) {
                            console.error('Failed to parse JSON:', error, 'Response text:', text);
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                    });
            } else {
                console.error('No _ncid attribute found.');
            }
        } else {
            console.error('No _innerLink _cachingList element found.');
        }
    });

    return button;
}

// Function to adjust the height of _listContainer based on its content
function adjustListContainerHeight() {
    const listContainer = document.getElementById('_listContainer');
    if (listContainer) {
        // Reset height to auto to calculate new height based on content
        listContainer.style.height = 'auto';

        // Get the full height of the content inside _listContainer
        const newHeight = listContainer.scrollHeight;

        // Set the height of _listContainer to fit the content
        listContainer.style.height = `${newHeight}px`;
    }
}



        // Function to create the "톡보내기" button and handle sending KakaoTalk messages
        function createKakaoButton(itemElement) {
            const button = document.createElement('button');
            button.textContent = "톡보내기";
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#25D366';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
            button.style.marginLeft = '5px';

            button.addEventListener('click', async function() {
                const titleElement = itemElement.querySelector('.title_area');
                const infoElement = itemElement.querySelector('.information_area');

                if (titleElement && infoElement) {
                    const titleText = titleElement.textContent.trim();

                    // Remove the "동별" text, add " | " separators, and line breaks between the information sections
                    let infoText = infoElement.textContent.trim();
                    infoText = infoText.replace(/동별\s*/g, '')
                                        .replace(/(세대)/g, '세대 |')
                                        .replace(/(동)\s*/g, '동 | ')
                                        .replace(/(?=\d+\.\d+m²)/g, '\n'); // Add line breaks before each size
                    const message = `${titleText}\n${infoText}`;
                    const currentUrl = window.location.href;

                    // Ensure Kakao SDK is loaded and initialized
                    await ensureKakaoSDKReady();

                    try {
                        await ensureValidAccessToken();  // Check or renew the Kakao token
                        await sendMessageToMyChat(message, currentUrl);  // Send the message
                    } catch (error) {
                        console.error('Failed to send Kakao message:', error);
                    }
                } else {
                    console.error('Failed to find title or information areas.');
                }
            });

            return button;
        }

        // Function to add buttons to each item under item_area
        function addButtonToEachItem(itemArea) {
            const itemElements = itemArea.querySelectorAll('.item._item');
            itemElements.forEach(itemElement => {
                const quantityArea = itemElement.querySelector('.quantity_area');
                if (quantityArea) {
                    if (!quantityArea.querySelector('button')) { // Check if buttons already exist
                        const button = createCustomButton("가격가져오기", itemElement);
                        const kakaoButton = createKakaoButton(itemElement);

                        const buttonContainer = document.createElement('div');
                        buttonContainer.style.display = 'flex';
                        buttonContainer.style.justifyContent = 'space-between';
                        buttonContainer.style.marginTop = '10px';

                        buttonContainer.appendChild(button);
                        buttonContainer.appendChild(kakaoButton);

                        // Align buttons to the left and right edges
                        button.style.flex = '1';
                        kakaoButton.style.flex = '1';
                        button.style.marginRight = '5px'; // Add some space between the buttons
                        kakaoButton.style.marginLeft = '5px';

                        quantityArea.appendChild(buttonContainer);
                    } else {
                        console.log("Buttons already exist in quantity_area.");
                    }
                } else {
                    console.log("quantity_area element not found within itemElement:", itemElement);
                }
            });
        }

        // Callback function for MutationObserver
        function handleMutations(mutationsList, observer) {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains("price_area")) {
                        hidePriceArea(node);
                        const itemArea = node.closest('.item_area');
                        if (itemArea) {
                            addButtonToEachItem(itemArea);
                        }
                    } else if (node.nodeType === 1 && node.querySelectorAll) {
                        // Check if any descendants are price_area elements
                        var priceAreas = node.querySelectorAll(".price_area");
                        priceAreas.forEach(priceArea => {
                            hidePriceArea(priceArea);
                            const itemArea = priceArea.closest('.item_area');
                            if (itemArea) {
                                addButtonToEachItem(itemArea);
                            }
                        });
                    }
                });
            });
        }

        // Initialize MutationObserver to watch for changes in the DOM
        var observer = new MutationObserver(handleMutations);

        // Start observing changes in the entire document body
        observer.observe(document.body, { childList: true, subtree: true });

    }


    start();
});
