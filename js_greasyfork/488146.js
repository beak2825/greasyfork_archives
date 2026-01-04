// ==UserScript==
// @name         Save university Pics
// @namespace    http://tampermonkey.net/
// @version      2024-01-10
// @description  Save university Pics.
// @author       You
// @match        https://photo.*.edu/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488146/Save%20university%20Pics.user.js
// @updateURL https://update.greasyfork.org/scripts/488146/Save%20university%20Pics.meta.js
// ==/UserScript==

var observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
      console.count('added')
      srcSet.add(mutation.target.src);
    }
  });
});

document.querySelectorAll(".zfl-ss.zfl-ss-view img").forEach((img) => {
  observer.observe(img, {
    attributes: true
  });
});

var srcSet = new Set();




// Function to load a script
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) { // For old versions of IE
    script.onreadystatechange = function() {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else { // Other browsers
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Use the function to load FileSaver.js
var observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
      console.count('added')
      srcSet.add(mutation.target.src);
    }
  });
});

document.querySelectorAll(".zfl-ss.zfl-ss-view img").forEach((img) => {
  observer.observe(img, {
    attributes: true
  });
});

var srcSet = new Set();




// Function to load a script
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) { // For old versions of IE
    script.onreadystatechange = function() {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else { // Other browsers
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Use the function to load FileSaver.js
loadScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js", function() {
  console.log("FileSaver.js loaded successfully.");

  let delay = 0; // Delay in milliseconds
  srcSet.forEach(function(src) {
    setTimeout(function() {
      fetch(src)
        .then(response => response.blob())
        .then(blob => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = src.split('/').pop().split('?')[0];
          a.click();
        })
        .catch(error => console.error(error));
    }, delay);
    delay += 1000; // Increase delay for each file
  });
});