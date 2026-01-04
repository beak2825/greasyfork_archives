// ==UserScript==
// @name         Test Site
// @namespace    https://www.google.com
// @version      0.2
// @description  Type away "test, testing, testing testing" or even "testing testing 123" into Google, and you get sent to the Test Site! Have all the tools you need to test all the things you need to test in ONE PLACE.
// @author       Googler
// @match        *://www.google.com/search?q=test&*
// @match        *://www.google.com/search?q=test
// @match        *://www.google.com/search?q=testing&*
// @match        *://www.google.com/search?q=testing
// @match        *://www.google.com/search?q=testing%20testing&*
// @match        *://www.google.com/search?q=testing%20testing
// @match        *://www.google.com/search?q=testing%20testing%20123&*
// @match        *://www.google.com/search?q=testing%20testing%20123
// @match        *://www.google.com/search?q=testing+testing&*
// @match        *://www.google.com/search?q=testing+testing
// @match        *://www.google.com/search?q=testing+testing+123&*
// @match        *://www.google.com/search?q=testing+testing+123
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://google.com&size=64
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501958/Test%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/501958/Test%20Site.meta.js
// ==/UserScript==

webpage = `<title>Testing Site</title>
<style>
/* latin */
@font-face {
  font-family: 'Product Sans';
  font-style: normal;
  font-weight: 100;
  src: local('Product Sans Thin'), local('ProductSans-Thin'), url(https://fonts.gstatic.com/s/productsans/v9/aXL-Qz25m_FkY0KDMUoO01dBB84BqlWy1BjOnCrU9PY.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}
/* latin */
@font-face {
  font-family: 'Product Sans';
  font-style: normal;
  font-weight: 300;
  src: local('Product Sans Light'), local('ProductSans-Light'), url(https://fonts.gstatic.com/s/productsans/v9/N0c8y_dasvG2CzM7uYqPLk4GofcKVZz6wtzX_QUIqsI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}
/* latin */
@font-face {
  font-family: 'Product Sans';
  font-style: normal;
  font-weight: 400;
  src: local('Product Sans'), local('ProductSans-Regular'), url(https://fonts.gstatic.com/s/productsans/v9/HYvgU2fE2nRJvZ5JFAumwegdm0LZdjqr5-oayXSOefg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}
/* latin */
@font-face {
  font-family: 'Product Sans';
  font-style: normal;
  font-weight: 500;
  src: local('Product Sans Medium'), local('ProductSans-Medium'), url(https://fonts.gstatic.com/s/productsans/v9/N0c8y_dasvG2CzM7uYqPLs1Lch-SD8r0CsJ60meulZ8.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}
/* latin */
@font-face {
  font-family: 'Product Sans';
  font-style: normal;
  font-weight: 700;
  src: local('Product Sans Bold'), local('ProductSans-Bold'), url(https://fonts.gstatic.com/s/productsans/v9/N0c8y_dasvG2CzM7uYqPLnNuWYKPzoeKl5tYj8yhly0.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}
/* latin */
@font-face {
  font-family: 'Product Sans';
  font-style: normal;
  font-weight: 900;
  src: local('Product Sans Black'), local('ProductSans-Black'), url(https://fonts.gstatic.com/s/productsans/v9/N0c8y_dasvG2CzM7uYqPLtDLwwZd-mS_8JqJ_KGXwxs.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}
</style>
<style>
.center-text {
text-align: center;
margin-top: -5%;
font-size: 250%;
font-weight: 500;
color: #5f6368;
}
body {
font-family: 'Product Sans';
font-weight: 500;
color: #5f6368;
}
</style>

<img style="width: 10%; margin-top: -3%; margin-left: -1.5%;" src="https://cdn.myportfolio.com/8f34bb40c4834b701ac4b5a453c80f35/c9838308-dd3d-49d1-8fda-faf48ff3381d_rw_1200.gif?h=3bcf6150647d23823fec951cf30e182e">
<p class="center-text">Testing? I see!</p>
<p class="center-text" style="font-size: 125%; margin-top: -3%; font-weight: 200;">Here! Have some help:</p>
<p style="font-weight: 200; font-size: 175%; margin-top: 4%; margin-left: 5%;">Your IP</p>
<p style="font-size: 175%; margin-top: -2%; margin-left: 5%;" id="ip">ip</p>
<p class="center-text" style="font-size: 150%; margin-top: 7.5%; font-weight: 400;">Please email me ideas of</p>
<p class="center-text" style="font-size: 150%; margin-top: -2%; font-weight: 400;">tests useful for testing! At</p>
<p class="center-text" style="font-size: 150%; margin-top: -2%; font-weight: 400; color: #4285f5;">artificialkathlin@belgianairways.com</p>
<a style="color: #4285f5; font-size: 125%; font-weight: 500; position: fixed; bottom: 0; left: 0; padding: 1%;" id="link">Depart the Testing Site</a>`;

document.open();
document.write(webpage);
document.close();

var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "https://api.ipify.org", false );
xmlHttp.send( null );
document.getElementById("ip").innerText = xmlHttp.responseText;

document.getElementById("link").href = "https://www.google.com/search?q=+" + window.location.href.split("://www.google.com/search?q=")[1].split("&")[0] + "+"