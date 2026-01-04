// ==UserScript==
// @name         4chan webp converter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  script to convert webps on 4channel
// @author       peteblank
// @license MIT
// @match        https://boards.4channel.org/*
// @match        https://boards.4chan.org/*
// @grant        none
// @run-at context-menu
// @downloadURL https://update.greasyfork.org/scripts/456911/4chan%20webp%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/456911/4chan%20webp%20converter.meta.js
// ==/UserScript==

(function() {
   'use strict';
//converts file to base64
async function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
     reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });}
   console.log("test")
  //gets the file blob after you click on choose file and pick a picture
  var file=document.getElementById('postFile').files[0]
  //creates a canvas
  var canvas = document.createElement('canvas');

  //tried to draw image into canvas
 function events(){
    var ctx = canvas.getContext("2d");
    var image = new Image();
    canvas.width = 1000;
    canvas.height = 1000;
    ctx.drawImage(image, 0, 0);
  getBase64(file).then(data=>{
                  image.src=data;
                  ctx.drawImage(image, 0, 0);
                  canvas.toDataURL('image/jpeg',1.0);
                             })
  .then(img=>{fetch(img)
  .then(result=>result.blob())
  .then(blob=>{
  //https://pqina.nl/blog/set-value-to-file-input/
  const fileInput = document.querySelector('input[type="file"]');
  console.log(blob)
      // Create a new File object
      const myFile = new File([blob], 'newimage'+Math.random()+'.jpg', {
          type: 'image/jpeg',
          lastModified: new Date(),
      });

      // Now let's create a DataTransfer to get a FileList
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(myFile);
      fileInput.files = dataTransfer.files;
  })
  })
}
    document.querySelector('input[type="file"]').addEventListener('click',events(),true)
})();