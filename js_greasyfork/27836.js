// ==UserScript==
// @name           Sina Slides download
// @namespace      https://dev.donie.me
// @version      0.3.7
// @description   Save all original images from sina slides
// @author       forinec
// @match        *://slide.ent.sina.com.cn/*
// @match        *://slide.eladies.sina.com.cn/*
// @match        *://slide.fashion.sina.com.cn/*
// @grant    GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27836/Sina%20Slides%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/27836/Sina%20Slides%20download.meta.js
// ==/UserScript==

//var container = document.getElementByClass("swp-tit");
var container = document.getElementsByClassName("swp-tit")[0];
var images = [];

for (var imageObj of slide_data.images) {
  //console.log("adding to images: " + imageObj.image_url);
  //images.push(imageObj.image_url);
  console.log("adding to images: " + imageObj.download_img);
  images.push(imageObj.download_img);
}

var button = document.createElement('button');
button.innerHTML = '下载';
button.onclick = function() {
  download_files(images);
};

container.appendChild(button);

function download_files(urls) {
  console.log("inside download_files func!");
  var i = 0;
  while (i < urls.length) {
    (function(i) {
      gotoURL = urls[i];
      GM_xmlhttpRequest({
        method: "GET",
        url: gotoURL,
        overrideMimeType: 'text/plain; charset=x-user-defined',
        onload: function(xhr) {
          console.log("GM_XHR " + i);
          //alert(response.responseText);
          //var binResp = customBase64Encode(respDetails.responseText);
          //var imgResp = 'data:image/jpeg;base64,' + binResp;
          //console.log('image: ' + imgResp)
          var data = data_string(xhr.responseText);
          
          // We can now do what we like with the data, E.g.
          var base64_data = btoa(data); // Encode to base64 string

          // We can then turn the Base64 string into a image using Data URL's ( http://en.wikipedia.org/wiki/Data_URI_scheme )
          var data_url = 'data:' + mime_from_data(data) + ';base64,' + base64_data; // Make the data url
          //console.log(data_url);
          var img_url = data_url.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
          

          //var image = new Image();
          //image.src = data_url;
          //container.appendChild(image); // Put image to page

          // Or put the image to a cavas to manipulate
          //var canvas = unsafeWindow.document.createElement('canvas'); 					// Canvas is created in unsafeWindow context to aviod security issues
          //canvas.getContext('2d').drawImage(image, 0, 0); // Put image to canvas
          
          var fileName = /.*\/(.*)\/w5000hdp.jpg/.exec(urls[i]);
          saveAs(img_url, fileName[1]);
        }
      });
    })(i);
    i++;
  }
}

function saveAs(uri, filename) {
  var link = document.createElement('a');
  console.log("downloading: " + uri);
  link.href = uri;
  link.download = filename;

  //Firefox requires the link to be in the body
  container.appendChild(link);

  //simulate click
  link.click();

  //remove the link when done
  //document.body.removeChild(link);
}


function mime_from_data(data) // Simple function that checks for JPG, GIF and PNG from image data. Otherwise returns false.
{
  if ('GIF' == data.substr(0, 3)) return 'image/gif';
  else if ('PNG' == data.substr(1, 3)) return 'image/png';
  else if ('JFIF' == data.substr(6, 4)) return 'image/jpg';
  return false;
};

function data_string(data) // Generates the binary data string from character / multibyte data
{
  var data_string = '';
  for (var i = 0, il = data.length; i < il; i++) data_string += String.fromCharCode(data[i].charCodeAt(0) & 0xff);
  return data_string;
};


// following from: http://stackoverflow.com/a/8781262/468165
function customBase64Encode(inputStr) {
  var
    bbLen = 3,
    enCharLen = 4,
    inpLen = inputStr.length,
    inx = 0,
    jnx,
    keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + "0123456789+/=",
    output = "",
    paddingBytes = 0;
  var
    bytebuffer = new Array(bbLen),
    encodedCharIndexes = new Array(enCharLen);

  while (inx < inpLen) {
    for (jnx = 0; jnx < bbLen; ++jnx) {
      /*--- Throw away high-order byte, as documented at:
        https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
      */
      if (inx < inpLen)
        bytebuffer[jnx] = inputStr.charCodeAt(inx++) & 0xff;
      else
        bytebuffer[jnx] = 0;
    }

    /*--- Get each encoded character, 6 bits at a time.
        index 0: first  6 bits
        index 1: second 6 bits
                    (2 least significant bits from inputStr byte 1
                     + 4 most significant bits from byte 2)
        index 2: third  6 bits
                    (4 least significant bits from inputStr byte 2
                     + 2 most significant bits from byte 3)
        index 3: forth  6 bits (6 least significant bits from inputStr byte 3)
    */
    encodedCharIndexes[0] = bytebuffer[0] >> 2;
    encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
    encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
    encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

    //--- Determine whether padding happened, and adjust accordingly.
    paddingBytes = inx - (inpLen - 1);
    switch (paddingBytes) {
      case 1:
        // Set last character to padding char
        encodedCharIndexes[3] = 64;
        break;
      case 2:
        // Set last 2 characters to padding char
        encodedCharIndexes[3] = 64;
        encodedCharIndexes[2] = 64;
        break;
      default:
        break; // No padding - proceed
    }

    /*--- Now grab each appropriate character out of our keystring,
        based on our index array and append it to the output string.
    */
    for (jnx = 0; jnx < enCharLen; ++jnx)
      output += keyStr.charAt(encodedCharIndexes[jnx]);
  }
  return output;
}