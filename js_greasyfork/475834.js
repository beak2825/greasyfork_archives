// ==UserScript==
// @name         Drawaria.online Image Opacity
// @version      0.0
// @description  Drawaria.online drawing an image with opacity
// @author       Mr.Robot
// @author       Discord: Sinasinb#3578
// @match        https://drawaria.online/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/475834/Drawariaonline%20Image%20Opacity.user.js
// @updateURL https://update.greasyfork.org/scripts/475834/Drawariaonline%20Image%20Opacity.meta.js
// ==/UserScript==

(function() {
    'use strict';
  $(document).ready(function() {
    $('button').click(function() {
      var containerName = $(this).data('name');
      $('div.' + containerName).toggle();
    });
  });
    let target = document.getElementById('roomcontrols');
    let togglebtn = document.createElement('button');
    target.parentNode.insertBefore(togglebtn, target.nextSibling);
    togglebtn.type = 'button';
    togglebtn.innerHTML = `
<div>
  <button data-name="div-1">+</button>
</div>
  <style>
    #canvas {
      border: 0px solid black;
    }
  </style>
  <style>
.default {
  border: 1px solid;
  margin-bottom: 15px;
  margin-top: 15px;
  padding: 15px;
  display: none;
}

.view-div {
  display: block !important;
}
  </style>
<div class="div-1 default">
  <input type="file" id="upload" accept="image/*">
<br><br>
  <i class='fas fa-arrows-alt-v' style="font-size: 16px;">&#xe432;</i><span> <label for="top">Top:</label>
  <input type="number" id="top" value="0">
<br><br>
  <i class='fas fa-arrows-alt-h' style="font-size: 16px;">&#xe432;</i><span> <label for="left">Left:</label>
  <input type="number" id="left" value="0">
<br><br>
  <i class='fas fa-low-vision' style="font-size: 16px;">&#xe432;</i><span> <label for="opacity">Opacity:</label>
  <input type="range" id="opacity" min="0" max="1" step="0.1" value="1">
<br><br>
  <i class='fas fa-expand-arrows-alt' style="font-size: 16px;">&#xe432;</i><span> <label for="scale">Scale:</label>
  <input type="range" id="scale" min="0.1" max="2" step="0.1" value="1">
<br><br>
 <i class='fas fa-lock' style="font-size: 16px;">&#xe432;</i><span> <input type="checkbox" id="lock">
  <label for="lock">Lock</label>
<br><br>
  <i class='fas fa-eye-slash' style="font-size: 16px;">&#xe432;</i><span> <input type="checkbox" id="hide">
  <label for="hide">Hide Image</label>
</div>
    `;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let image = null;
    let topValue = 0;
    let leftValue = 0;
    let opacityValue = 1;
    let scaleValue = 1;
    let locked = false;
    let hidden = false;

function drawImage() {
    if (hidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
        ctx.globalAlpha = opacityValue;
        ctx.drawImage(image, leftValue, topValue, image.width * scaleValue, image.height * scaleValue);
        ctx.globalAlpha = 1; // Reset opacity for drawing brush
    }
}
    function handleImageUpload(e) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                image = img;
                drawImage();
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    function pasteImage() {
        navigator.clipboard.read().then(data => {
            if (data && data.length > 0) {
                const item = data[0];
                if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                    item.getType('image/png').then(blob => {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            const img = new Image();
                            img.onload = function () {
                                image = img;
                                drawImage();
                            }
                            img.src = event.target.result;
                        }
                        reader.readAsDataURL(blob);
                    });
                }
            }
        });
    }

    document.getElementById('upload').addEventListener('change', handleImageUpload);

    document.getElementById('top').addEventListener('input', function (e) {
        topValue = parseInt(e.target.value);
        drawImage();
    });

    document.getElementById('left').addEventListener('input', function (e) {
        leftValue = parseInt(e.target.value);
        drawImage();
    });

document.getElementById('opacity').addEventListener('input', function (e) {
    opacityValue = parseFloat(e.target.value);
    drawImage();
});

    document.getElementById('scale').addEventListener('input', function (e) {
        scaleValue = parseFloat(e.target.value);
        drawImage();
    });

    document.getElementById('lock').addEventListener('change', function (e) {
        locked = e.target.checked;
    });

document.getElementById('hide').addEventListener('change', function (e) {
    hidden = e.target.checked;
    drawImage();
});

    canvas.addEventListener('mousedown', function (e) {
        if (!locked && image) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (x >= leftValue && x <= leftValue + image.width * scaleValue &&
                y >= topValue && y <= topValue + image.height * scaleValue) {
                let offsetX = x - leftValue;
                let offsetY = y - topValue;

                function moveImage(event) {
                    const newX = event.clientX - rect.left;
                    const newY = event.clientY - rect.top;
                    leftValue = newX - offsetX;
                    topValue = newY - offsetY;
                    drawImage();
                }

                function stopMovingImage() {
                    document.removeEventListener('mousemove', moveImage);
                    document.removeEventListener('mouseup', stopMovingImage);
                }

                document.addEventListener('mousemove', moveImage);
                document.addEventListener('mouseup', stopMovingImage);
            }
        }
    });
})();