// ==UserScript==
// @name         Cross Site Test
// @namespace    Tehapollo
// @version      1.0
// @description  Cross Communication
// @author       Tehapollo
// @include       https://www.gethybrid.io/workers/projects
// @include       *linkedin.com*
// @grant  GM_getValue
// @grant GM_setValue
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @require      https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/377037/Cross%20Site%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/377037/Cross%20Site%20Test.meta.js
// ==/UserScript==

(function() {

var Tesseract = require('tesseract.js')

Tesseract.recognize("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAATCAIAAAD5x3GmAAAB6klEQVQokZWTz2vaYBjHn3eMGfAHBMGDBpmugdqREQ8hsnqodgdh9JQpklPrbqOs/0Lo/gpPrqeOprlLHXSHNQy0OlLNwYIHc6iDsDBfhNAssEPAuuh+9OF7eh++7/N5eJ4HOY4L94wH9zXcecbj8d7eLkXFCeJROv344ODtZDL5o8lx3KurAUmSCCGezxWLxUwmgxAiSVLT+o7jLgscxy0UCgBQqVQkSTo+/tBqfazVXgMAy7Km+X2FB+NZNptNJBKSJHW7Pe8V4xkARCKRkxN52fOQIAhV/XJ01HBdl2GeecDD4RAAQqGQYYxX97Moy/ohy0oqlUIIVavVer2+up+5Dg/feR8hhARBkCRpMNCXPb/Nh6IoURQ5jguHw4qitNvttTX632yXl92zs5Ysn9I0DQCiKN7e/vwb26J6va8AEIvFzs8/+dmm02mz2VRV1Vd/fT0DALZt6/rAvzuj0Whn52WttmsYxmKi0+kAQDQatW17RT8bG08BoFwuz6vf3HxjGMZbjkbjvY8NOY7b7/fz+eez2YzjuO3tF6ZpKsqpZVmlUimXywnCK49zHsi7H03T9vff6LqOMQ4GgzRNsyybTCY3N/NbWwUfGprfHMb44uLz9fUQYxwIBOLxBM/z6fST5fHcef4/fgFdfJXAomtUrwAAAABJRU5ErkJggg=="
)
.then(function(result){
    console.log(result)
})
   if ($("h1:contains('Projects')").length) {
   $('<input type="button" value="Block" id="Block"/>').insertAfter('h1');
   $('h1').append('<textarea id="BlockText" style="font-size: 12pt; height: 15px; overflow-y: hidden; width: 363px;"form="usrform"></textarea>');
   $("input#Block").click(function() {
   var websitename = GM_getValue("Hello");
   document.getElementById('BlockText').value=websitename

     });
 }

    if (window.location.href.indexOf("linkedin") > -1) {
    $(document).keydown(function (keys) {
     if (keys.keyCode == 113){
     $('<input type="button" value="Name" id="Name"/>').insertAfter('h1');
     $("input#Name").click(function() {
     var storesite = document.querySelector("h1.org-top-card-primary-content__title.t-24.t-black").innerText
      GM_setValue("Hello", storesite);
     var websitename = GM_getValue("Hello");

      });
    }
    });
    }
})();