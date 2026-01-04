// ==UserScript==
// @name chatvdvoem+-
// @namespace Violentmonkey Scripts
// @version 0.1
// @description Shows name of the opponent and adds posibility to send custom photo
// @author my cat
// @match https://chatvdvoem.ru
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/373662/chatvdvoem%2B-.user.js
// @updateURL https://update.greasyfork.org/scripts/373662/chatvdvoem%2B-.meta.js
// ==/UserScript==

function createPhotoButton() {
  const div = document.createElement('div');
  div.classList.add('but');
  const btn = document.createElement('input');
  btn.type = "file";
  //btn.value = "photo";
  btn.addEventListener('change', encode, false);
  div.appendChild(btn);
  return btn;
}

function getActionsBar() {
  return actions_bar = document.getElementById('actions');
}

function sendImg(base64) {
  chat.sendImage(new chat.Image(base64));
}

function encode(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          console.log(e.target.result, theFile);
          sendImg(e.target.result);
          evt.target.value = '';
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
}


const interv = setInterval(function() {
  if (getActionsBar() != null) {
    getActionsBar().appendChild(createPhotoButton());
    clearInterval(interv);
  }
}, 500);

setInterval(function() {
  const ad = document.getElementById('projects');
  if (ad != null) {
    ad.remove();
  }
}, 100);

setInterval(function() {
  const op = document.getElementById('opponent');
  const container = document.getElementById('desc');
  if (op == null && container != null) {
    const op = document.createElement('span');
    op.id = 'opponent'
    container.appendChild(op);
  }
  if (op != null) {
    op.innerText = " " + chat.opponent.name + " ";
  }
}, 500);
