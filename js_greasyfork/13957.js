// ==UserScript==
// @name        Fanfiction.net dark theme
// @namespace   Danielv123
// @description A dark theme for fanfiction.net. Works well for night reading.
// @include     https://www.fanfiction.net/s/*
// @include     https://www.fictionpress.com/s/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13957/Fanfictionnet%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/13957/Fanfictionnet%20dark%20theme.meta.js
// ==/UserScript==
// Settings:
// Display comment section
var commentSection = false;
// End of settings
//
// Get all elements that have a style attribute
var elms = document.querySelectorAll('*[style]');
// Loop through them
Array.prototype.forEach.call(elms, function (elm) {
  // Get the color value
  var clr = elm.style.backgroundColor || '';
  // Remove all whitespace, make it all lower case
  clr = clr.replace(/\s/g, '').toLowerCase();
  // Switch on the possible values we know of
  console.log(clr)
  switch (clr) {
    case 'white':
      elm.style.backgroundColor = '#262626';
      console.log('Color set')
      break;
  }
});
document.body.style.backgroundColor = '#666'
var lightGreyStuff = document.getElementsByClassName('zmenu')
for (var i = 0; i < lightGreyStuff.length; i++) {
  lightGreyStuff[i].style.backgroundColor = '#454545'
}
document.body.style.color = 'white';
if (commentSection === false) {
  document.getElementById('review').style.display = 'none';
}

setTimeout(() => {
    console.log("Updating CSS")
document.querySelector("body > style").innerHTML += `
.lc-wrapper .xcontrast_txt {
  color:white;
}
.xcontrast_txt{
  color:lightgray;
}
.lc-wrapper .lc {
  background-color: #262626;
}
.lc-left {
  background-color: #262626;
}
`
}, 100)