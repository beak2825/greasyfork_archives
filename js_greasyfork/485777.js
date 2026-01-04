// ==UserScript==
// @name         Starblast Client
// @version      4.1.4
// @description  All rights reserved, this code may not be reproduced or used in any way without the express written consent of the author.
// @author       M4tr1x
// @license      May not reproduce code in any way without explicit permission from the author.
// @match        https://starblast.io/
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/926687
// @downloadURL https://update.greasyfork.org/scripts/485777/Starblast%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/485777/Starblast%20Client.meta.js
// ==/UserScript==
(function () {
    window.rootHost = 'http://localhost'
    window.rootPort = '3009'



   document.open();
   document.write(`<html>

<head>
   <title>Loading NOSpace...</title>
</head>

<body style="background-color:#000000;">
   <div style="margin: auto; width: 50%;">
       <h1 style="text-align: center;padding: 170px 0;color:#FFFFFF;">NOSpace is loading</h1>
       <h1 style="text-align: center;color:#FFFFFF;">Please wait</h1>
   </div>
   <div id="fancylogcontainer" style="position:absolute;top:10px;color:white;">
       <span id="fancylog"></span>
   </div>
</body>

</html>`);
   document.close();

   function runExternalScript(url){
       // xhr
       var xhr = new XMLHttpRequest();
       xhr.open('GET', url, true);
       xhr.setRequestHeader('package', 'true');
       xhr.onload = function() {
           if (xhr.status === 200) {
               var script = document.createElement('script');
               script.textContent = xhr.responseText;
               document.head.appendChild(script);

               runExternalScript = function(){}
           } else {
               console.error(`Error loading script: ${url}`);
           }
       }
       xhr.send();
   }
   runExternalScript(`${rootHost}:${rootPort}/public/matrixclient.html`);
   console.clear()

})();