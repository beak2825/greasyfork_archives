// ==UserScript==
// @name         Download tickets
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Download ticket-related information and images from the Fixr site
// @author       You
// @match        https://fixr.co/my-events*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fixr.co
// @require      https://update.greasyfork.org/scripts/457525/1134363/html2canvas%20141.js
// @require      https://update.greasyfork.org/scripts/448541/1074759/dom-to-imagejs.js
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/518602/Download%20tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/518602/Download%20tickets.meta.js
// ==/UserScript==

function wait(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

function getElementByXPath(xpath) {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}

function getElementByXPathWithWait(xpath) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const element = result.singleNodeValue;
            console.log(element);
            if (element !== null) {
                clearInterval(interval); // Stop checking once the element is found
                resolve(element); // Return the element
            }
        }, 100); // Check every 100ms
    });
}

function openInNewTab(element) {
    const url = element.getAttribute('href'); // Assuming the div has a data-url attribute
    console.log(url);
    if (url) {
        window.open(url, '_blank'); // Open the URL in a new tab
        console.log('opened', url);
    }
}

function find(text, type = 'span') {
    const items = document.querySelectorAll(type);
    for (let i = 0; i < items.length; i++) {
        const x = items[i];
        if (x.textContent.includes(text)) {
            return x; // Return the matching element
        }
    }
    return null; // Return null if no element was found
}

function find_inside(text, type = 'span', inside) {
    const items = inside.querySelectorAll(type);
    for (let i = 0; i < items.length; i++) {
        const x = items[i];
        if (x.textContent.includes(text) && x.children.length === 0) {
            return x; // Return the matching element
        }
    }
    return null; // Return null if no element was found
}

function removeFirstThreeWords(str) {
    const words = str.split(" ");
    return words.slice(3).join(" ");
}



async function openDays() {
    const days = ['Saturday', 'Wednesday'];
    console.log('Opening days');

    // Wait for page elements to load
    await wait(2);

    const holder = getElementByXPath('//*[@id="__next"]/div[1]/main/div/div[2]').children[0]
    Array.from(holder.children).forEach(function (child) {
        if (child.innerHTML.includes('Wed') || child.innerHTML.includes('Sat')) {
            openInNewTab(child);
        }
    });
}

async function openTickets() {
    'use strict';
    console.log('Opening tickets');

    await wait(2);;

    const holder = document.getElementsByClassName('sc-5b8924b7-0 hdYDdJ')[0];
    console.log(holder)

    /*'sc-7f5536a6-0 kXGQFa' - didnt work
    '/html/body/div[2]/div[1]/main/div/div[2]'


    Array.from(holder.children).forEach(function(child) {
        console.log(child); // Do something with each child element
        openInNewTab(child);
    });*/
    const links = document.querySelectorAll('main a[href]');

    // Loop through each link
    links.forEach(link => {
        console.log(link.href); // Access the href attribute
        openInNewTab(link);
        // Perform any other operations on the link
    });
    await wait(1.5);

    window.open('https://www.google.co.uk/', '_blank');
}


async function oldcaptureTicketImages() {
    console.log('Downloading tickets');
    // Wait for the divs with ticket details to load
    const divs = [
        await getElementByXPathWithWait('//*[@id="__next"]/div[1]/main/div[1]/div[2]/div'),
        await getElementByXPathWithWait('//*[@id="__next"]/div[1]/main/div[1]/div[3]')
    ];

    console.log('DIVs', divs);

    const checkElements = setInterval(() => {
        if (divs[0] && divs[1]) {
            clearInterval(checkElements);
            console.log(divs);
        }
    }, 100); // Check every 100ms

    if (divs.every(el => el != null)) {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.visibility = 'visible';
        container.style.zIndex = '99999';
        container.style.width = 'max-content';
        container.style.height = 'auto';

        divs.forEach(div => {
            if (div) {
                container.appendChild(div.cloneNode(true));
            }
        });

        document.body.appendChild(container);

        const images = container.getElementsByTagName('img');
        const totalImages = images.length;
        let imagesLoaded = 0;

        Array.from(images).forEach(image => {
            if (image.complete && image.naturalWidth > 0) {
                imagesLoaded++;
            } else {
                image.onload = () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        captureContainer(container);
                    }
                };

                if (image.getAttribute('loading') === 'lazy') {
                    const src = image.getAttribute('src');
                    image.setAttribute('src', ''); // Trigger reload for lazy images
                    image.setAttribute('src', src);
                }
            }
        });

        if (totalImages === 0 || imagesLoaded === totalImages) {
            captureContainer(container);
        }

        async function captureContainer(container) {
            await wait(10);

            const timelongtext = find_inside('Entry strictly between', 'span', document).innerHTML;
            const time = removeFirstThreeWords(timelongtext);
            const daylongtext = getElementByXPath('//*[@id="__next"]/div[1]/main/div[1]/div[2]/div/div[3]/div[1]/div[1]/div/div[8]/span').innerHTML;
            const day = daylongtext.split(',')[0];
            const account = getElementByXPath('//*[@id="__next"]/div[1]/main/div[1]/div[2]/div/div[3]/div[1]/div[1]/div/div[3]/span').innerHTML;
            const reference = getElementByXPath('//*[@id="__next"]/div[1]/main/div[1]/div[2]/div/div[3]/div[2]/div[2]/div[4]/span').innerHTML;
            console.log(time, day, account, reference);

            html2canvas(container, {
                useCORS: true,
                allowTaint: true,
                logging: true,
            }).then(canvas => {
                document.body.removeChild(container);
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = '(' + account + '),(' + day + '),(' + time + '),(' + reference + ').png';
                link.click();
            }).catch(error => {
                console.error('Error capturing the divs:', error);
            });
        }
    }
}


async function captureTicketImages() {
    const divs = [
        await getElementByXPathWithWait('//*[@id="__next"]/div[1]/main/div[1]/div[2]/div'),
        await getElementByXPathWithWait('//*[@id="__next"]/div[1]/main/div[1]/div[3]')
    ];

    const div1 = divs[0];
    const div2 = divs[1];

    // Make sure both divs exist
    if (div1 && div2) {
        // Function to take the screenshot and combine the divs into one image
        async function captureAndCombine() {
            // Create a new container to hold both divs
            const combinedContainer = document.createElement('div');
            /*combinedContainer.style.display = 'block';  // Stack divs vertically
            combinedContainer.style.position = 'fixed'; // Fixed position to avoid affecting the layout
            combinedContainer.style.top = '0'; // Positioning at the top of the screen
            combinedContainer.style.left = '0'; // Positioning at the left of the screen
            combinedContainer.style.width = '100%'; // Make the container full width
            combinedContainer.style.height = '100%'; // Make the container full height
            combinedContainer.style.zIndex = '9999';  // Make sure the container is on top of other elements
            combinedContainer.style.pointerEvents = 'none'; // Prevent interaction with the page while capturing*/
            combinedContainer.style.width = '70%'; // Adjust percentage or set fixed width like '800px'
            combinedContainer.style.margin = '0 auto'; // Center horizontally
            combinedContainer.style.position = 'relative'; // Ensure it stays in the flow
            combinedContainer.style.display = 'flex';
            combinedContainer.style.flexDirection = 'column'; // Stack divs vertically
            combinedContainer.style.alignItems = 'center'; // Center content within the container
            combinedContainer.style.padding = '20px'; // Add some padding if needed
            combinedContainer.style.backgroundColor = 'white'; // Visible background
            combinedContainer.style.border = '1px solid #ccc'; // Optional border for clarity

            // Clone the divs and append them to the container
            combinedContainer.appendChild(div1.cloneNode(true)); // Clone div1 to avoid altering the original
            combinedContainer.appendChild(div2.cloneNode(true)); // Clone div2 to avoid altering the original

            // Append the combined container to the body
            document.body.appendChild(combinedContainer);

            // Ensure the page is fully rendered before capturing the screenshot
            setTimeout(async () => {
                // Use html2canvas to capture the combined container
                html2canvas(combinedContainer, {
                    allowTaint: true, // Allow cross-origin images to be captured
                    useCORS: true,    // Use CORS for cross-origin images
                    scrollX: 0,       // Ignore page scroll position
                    scrollY: 0        // Ignore page scroll position
                }).then(async canvas => {
                    // Convert the canvas to an image (Data URL)
                    const imgData = canvas.toDataURL('image/png');

                    // Download the image
                    const timelongtext = find_inside('Entry strictly between', 'span', document).innerHTML;
                    const time = removeFirstThreeWords(timelongtext);
                    const daylongtext = getElementByXPath('//*[@id="__next"]/div[1]/main/div[1]/div[2]/div/div[3]/div[1]/div[1]/div/div[8]/span').innerHTML;
                    const day = daylongtext.split(',')[0];
                    const account = getElementByXPath('//*[@id="__next"]/div[1]/main/div[1]/div[2]/div/div[3]/div[1]/div[1]/div/div[3]/span').innerHTML;
                    const reference = getElementByXPath('//*[@id="__next"]/div[1]/main/div[1]/div[2]/div/div[3]/div[2]/div[2]/div[4]/span').innerHTML;
                    console.log(time, day, account, reference);

                    let ele = combinedContainer.getElementsByClassName('sc-89f91ff2-3 grrvbQ')[0];
                    let ele2 = combinedContainer.getElementsByClassName('sc-33a689c-0 ctDIvU')[0];

                    if (typeof ele === 'undefined') {
                        console.log('Element is undefined');
                        location.reload();
                        return;
                    }

                    if (ele) {ele.remove()};
                    if (ele2) {ele2.remove()};

                    console.log(ele, ele2);

                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = '(' + account + '),(' + day + '),(' + time + '),(' + reference + ').png';
                    link.click();
                    console.log(combinedContainer);

                    // Remove the combined container after the screenshot is taken
                    //document.body.removeChild(combinedContainer);
                }).catch(error => {
                    console.error('Error capturing the screenshot: ', error);
                    //document.body.removeChild(combinedContainer);
                });
            }, 100); // Add a slight delay to ensure the page is fully rendered
        }

        // Add a button to the page to trigger the screenshot capture
        /*const button = document.createElement('button');
        button.textContent = 'Capture Screenshot';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', captureAndCombine);*/

        await wait(1);
        captureAndCombine();

        // Append the button to the body
        //document.body.appendChild(button);
    } else {
        console.error('Divs not found on the page');
    }
}


(function () {
    'use strict';

    const currentUrl = window.location.href;
    console.log(currentUrl);
    console.log(currentUrl.split('/'));

    if (currentUrl == 'https://fixr.co/my-events') {
        openDays();
    } else if (currentUrl.split('/').length == 5) {
        openTickets();
    } else if (currentUrl.split('/').length > 5) {
        captureTicketImages();
    }
})();
