// ==UserScript==
// @name         Google Drive Direct Link Converter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Convert Google Drive file links to direct links
// @match        *://drive.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477084/Google%20Drive%20Direct%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/477084/Google%20Drive%20Direct%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert Google Drive file link to direct link
    function convertToDirectLink(url) {
        var id = '';
        var splitUrl = url.split('/');
        for (var i = 0; i < splitUrl.length; i++) {
            if (splitUrl[i] === 'd') {
                id = splitUrl[i + 1];
                break;
            }
        }
        return 'https://drive.google.com/uc?export=download&id=' + id;
    }

    // Create the red dot
    var dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.top = '50%';
    dot.style.left = '50%';
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.backgroundColor = 'red';
    dot.style.borderRadius = '50%';
    dot.style.cursor = 'pointer';
    document.body.appendChild(dot);

    // Make the red dot draggable
    dot.onmousedown = function(event) {
        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            dot.style.left = pageX - dot.offsetWidth / 2 + 'px';
            dot.style.top = pageY - dot.offsetHeight / 2 + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        dot.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            dot.onmouseup = null;
        };
    };

    // Create the overlay with two inputs and a button
    var overlay = document.createElement('div');
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.backgroundColor = 'white';
    overlay.style.border = '1px solid black';
    overlay.style.padding = '10px';

    var input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Paste Google Drive link here...';

     // Add a close button to the overlay
     var closeButton = document.createElement('button');
     closeButton.innerHTML = 'Close';
     closeButton.style.marginLeft = '10px';

     closeButton.addEventListener('click', function() {
         overlay.style.display ='none';
         dot.style.display ='block';
     });

     var input2 = document.createElement('input');
     input2.type = 'text';
     input2.placeholder = 'Direct link will appear here...';
     input2.style.marginTop = '10px';

     var button = document.createElement('button');
     button.innerHTML = 'Convert Google Drive Link';
     button.style.marginLeft = '10px';
     button.style.marginTop = '10px';

     // Add the event listener for the button
     button.addEventListener('click', function() {
        if (input1.value.includes('https://drive.google.com/file/d/')) {
            var directLink = convertToDirectLink(input1.value);
            input2.value = directLink;
            alert('Link has been converted!');
        } else {
            alert('No valid Google Drive link found in the input.');
        }
     });

     overlay.appendChild(input1);
     overlay.appendChild(input2);
     overlay.appendChild(button);
     overlay.appendChild(closeButton);

     document.body.appendChild(overlay);

     // Add the event listener for the red dot
     dot.addEventListener('click', function() {
         overlay.style.display ='block';
         dot.style.display ='none';
         input1.value ='';
         input2.value ='';
         input1.focus();
         // Set the position of the overlay to the position of the red dot
         overlay.style.top = dot.style.top;
         overlay.style.left = dot.style.left;
     });
})();
