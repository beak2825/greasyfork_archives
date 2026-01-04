// ==UserScript==
// @name         ylOppTactsPreview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows last 6 tactics of u18 matches when you mouse over on opponent's shortname
// @author       kostrzak16 in MZ
// @match        https://www.managerzone.com/?p=match&sub=scheduled
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488963/ylOppTactsPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/488963/ylOppTactsPreview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all links containing "tid" in their URL
    const linksWithTid = document.querySelectorAll('a[href*="tid"].clippable');

    // Define variables to track mouse enter and leave events for each link
    let hoverStartTime;
    let hoverTimeout;

    // Function to make fetch request with the "tid" value
    const makeFetchRequest = (tidValue) => {
        fetch("https://www.managerzone.com/ajax.php?p=matches&sub=list&sport=soccer", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Opera\";v=\"107\", \"Chromium\";v=\"121\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.managerzone.com/?p=match&sub=played&tid=" + tidValue,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "type=played&hidescore=false&tid1=" + tidValue + "&offset=&selectType=u18&limit=default",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
       .then(data => {
  const listHTML = data.list; // Get the HTML content from the "list" property
  const parser = new DOMParser();
  const htmlDocument = parser.parseFromString(listHTML, 'text/html'); // Parse the HTML string

  // Select all anchor elements with the "score-shown" class
  const scoreShownLinks = htmlDocument.querySelectorAll('a.score-shown');

  // Display the URLs of the first 5 links
 //console.log('URLs of the first 5 links:');

              // Create a container div
    const container = document.createElement('div');
    container.id = 'oppLast';
    container.style.position = 'fixed';
    container.style.top = '5%';
    container.style.left = '5px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(2, 150px)';
    container.style.gridTemplateRows = 'repeat(3, 200px)';
    container.style.gap = '5px'; // Gap between divs

    // Append the container to the body
    document.body.appendChild(container);

  for (let i = 0; i < Math.min(6, scoreShownLinks.length); i++) {
   // console.log(extractMidFromUrl(scoreShownLinks[i].href));
const isHome = checkNextDdForStrong(scoreShownLinks[i]);
      if(!isHome)
      {
      container.appendChild(createCanvasWithModifiedColorsAndRotation('https://www.managerzone.com/dynimg/pitch.php?match_id='+extractMidFromUrl(scoreShownLinks[i].href)));
      }
      else
      {
      container.appendChild(createCanvasWithReplacedColors('https://www.managerzone.com/dynimg/pitch.php?match_id='+extractMidFromUrl(scoreShownLinks[i].href)));
      }
  //     const canvas = createCanvasWithReplacedColors('https://www.managerzone.com/dynimg/pitch.php?match_id='+extractMidFromUrl(scoreShownLinks[i].href));
  //      container.appendChild(canvas);

      // const isHome = checkNextDdForStrong(scoreShownLinks[i]);
      //  const div = document.createElement('div');
      //   div.style.width = '150px';
      //   div.style.height = '200px';
      // if(!isHome)
      // {  div.style.transform = 'rotate(180deg)';}
      //   div.style.backgroundImage = 'url(https://www.managerzone.com/dynimg/pitch.php?match_id='+extractMidFromUrl(scoreShownLinks[i].href)+')';
      //   container.appendChild(div);
  }
})
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };

    // Attach event listeners to each link
    linksWithTid.forEach(link => {
        // Event listener for mouseenter
        link.addEventListener('mouseenter', () => {
            // Record the time when mouse enters
            hoverStartTime = Date.now();

            // Get the "tid" value from the URL
            const tidValue = new URL(link.href).searchParams.get('tid');

            // Set a timeout to make the fetch request after 4 seconds
            hoverTimeout = setTimeout(() => {
                makeFetchRequest(tidValue);
            }, 1000);
        });

        // Event listener for mouseleave
        link.addEventListener('mouseleave', () => {
            // Clear the timeout if mouse leaves before 4 seconds
            clearTimeout(hoverTimeout);
            $('#oppLast').remove();
            // Reset hoverStartTime
            hoverStartTime = null;
        });
    });
//HELPERS
    function extractMidFromUrl(url) {
    const urlSearchParams = new URLSearchParams(new URL(url).search);
    return urlSearchParams.get('mid');
}

    function checkNextDdForStrong(ele) {
    // Find the closest ancestor <dd> element
    const closestDd = ele.closest('dd');

    if (closestDd) {
        // Find the next sibling <dd> element
        const nextDd = closestDd.nextElementSibling;

        if (nextDd && nextDd.querySelector('strong')) {
            return true; // The next <dd> contains a <strong> element
        }
    }

    return false; // The next <dd> does not contain a <strong> element or there is no next <dd> element
}

    function createCanvasWithReplacedColors(imageUrl) {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 200;

    const context = canvas.getContext('2d');

    // Load the image onto the canvas
    const image = new Image();
    image.onload = function() {
        // Draw the image onto the canvas
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Get the image data (pixel data) from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Iterate through each pixel and manipulate its color
        for (let i = 0; i < data.length; i += 4) {
            // Modify colors here (e.g., replace yellow with green)
            // Example: If the pixel is yellow, change it to green
            if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] < 100) {
                data[i] = 64; // R channel
                data[i + 1] = 154; // G channel
                data[i + 2] = 64; // B channel
            }
        }

        // Put the modified image data back onto the canvas
        context.putImageData(imageData, 0, 0);
    };

    // Set the image source to trigger the onload event
    image.src = imageUrl;

    return canvas;
}

    function createCanvasWithModifiedColorsAndRotation(imageUrl) {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 200;

    const context = canvas.getContext('2d');

    // Load the image onto the canvas
    const image = new Image();
    image.onload = function() {
          // Rotate the canvas by 180 degrees
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(Math.PI); // Rotate by 180 degrees
        context.translate(-canvas.width / 2, -canvas.height / 2);
        // Draw the image onto the canvas
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Get the image data (pixel data) from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Iterate through each pixel and perform color replacements
        for (let i = 0; i < data.length; i += 4) {
            // Replace black colors with green
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                data[i] = 64; // R channel
                data[i + 1] = 154; // G channel
                data[i + 2] = 64; // B channel
            }
            // Replace yellow colors with black
            else if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] < 100) {
                data[i] = 0; // R channel
                data[i + 1] = 0; // G channel
                data[i + 2] = 0; // B channel
            }
        }

        // Put the modified image data back onto the canvas
        context.putImageData(imageData, 0, 0);

        // Rotate the canvas by 180 degrees
     //   context.translate(canvas.width / 2, canvas.height / 2);
     //   context.rotate(Math.PI); // Rotate by 180 degrees
    //    context.translate(-canvas.width / 2, -canvas.height / 2);
    };

    // Set the image source to trigger the onload event
    image.src = imageUrl;

    return canvas;
}
})();