// ==UserScript==
// @name        Shkolo fake
// @namespace   Violentmonkey Scripts
// @match       https://app.shkolo.bg/diary
// @grant        GM_xmlhttpRequest
// @version     1.1
// @author      -
// @description 22/10/2023, 18:50:05
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/478016/Shkolo%20fake.user.js
// @updateURL https://update.greasyfork.org/scripts/478016/Shkolo%20fake.meta.js
// ==/UserScript==


document.addEventListener('beforescriptexecute', function(e) {
    if (e.target.innerHTML.includes("window.TRANSLATIONS")) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://unpkg.com/xhook@1.6.2/dist/xhook.min.js", false);  // Note the 'false' for synchronous request
      xhr.send(null);
      e.target.innerHTML += xhr.responseText;

      e.target.innerHTML += `
         const keyword = 'getGradesForPupil';
         const parser = new DOMParser();

         xhook.after(function(request, response) {
           if (request.url.includes(keyword)) {
             const doc = parser.parseFromString('<div class="meow">'+response.text+'</div>', 'text/html');

             const gradeElements = doc.querySelectorAll('.grade');

            gradeElements.forEach((element, index) => {
              if (element.innerHTML.includes('.')) {
                element.innerHTML = "6.0";
              } else {element.innerHTML = "6";}

              if (!element.classList.contains('gradeTermFinal')) {
                element.classList.remove('yellow-casablanca');
                element.classList.remove('yellow-lemon');
                element.classList.remove('red');
                element.classList.add('green-jungle');
              }

            });

            const term1 = doc.querySelectorAll('.term1');
            term1.forEach((element, index) => {
              element.textContent = "6.0";
            });

             response.text = doc.querySelector('.meow').innerHTML;
           }
         });
     `;
      e.target.insertAdjacentElement('afterend', scriptElement);
    }
});