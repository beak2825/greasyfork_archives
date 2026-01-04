// ==UserScript==
// @name         autocheck
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  some autistic stuff
// @author       Autist
// @match        https://chan.sankakucomplex.com/post/similar
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37477/autocheck.user.js
// @updateURL https://update.greasyfork.org/scripts/37477/autocheck.meta.js
// ==/UserScript==
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.blacklisted{filter:none !important; -webkit-filter:none !important;}\n';
document.getElementsByTagName('head')[0].appendChild(style);
var fileel = document.getElementById('file');

fileel.addEventListener('change', function (event) {

    var dataurl = null;
    var filesToUpload = document.getElementById('file').files;
    var file = filesToUpload[0];

    // Create an image
    var img = document.createElement("img");
    // Create a file reader
    var reader = new FileReader();
    // Set the image once loaded into file reader
    reader.onload = function(e)
    {
        img.src = e.target.result;
        img.onload = function () {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 800, 600);

            var MAX_WIDTH = 800;
            var MAX_HEIGHT = 600;
            var width = img.width;
            var height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            dataurl = canvas.toDataURL("image/jpeg");
var blobBin = atob(dataurl.split(',')[1]);
var array = [];
for(var i = 0; i < blobBin.length; i++) {
  array.push(blobBin.charCodeAt(i));
}
var newfile = new Blob([new Uint8Array(array)], {type: 'image/jpeg', name: "test.jpg"});
            // Post the data
            var fd = new FormData();

            fd.append("file", newfile);

            $.ajax({
                url: 'https://chan.sankakucomplex.com/post/similar',
                data: fd,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
var newhtml = $( data ).find('form[id="similar-form"]');
$('form[id="similar-form"]').replaceWith( newhtml );
                }
            });
        }
    }
    reader.readAsDataURL(file);
  }, {once:false});