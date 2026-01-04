// ==UserScript==
// @name         4chan Save
// @namespace    http://github.com/hangjeff
// @version      2025-03-27_14h03m
// @description  Save the 4chan thread
// @author       hangjeff
// @match        https://boards.4chan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529047/4chan%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/529047/4chan%20Save.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelectorAll('.thread').forEach(thread => {
        let fileThumb = thread.querySelector('.fileThumb');
        if(fileThumb){
            let Komica_File_Url = 'https:' + fileThumb.getAttribute('href');
            let fileText = thread.querySelector('.fileText');

            if(fileThumb.getAttribute('href').includes('.webm') || fileThumb.getAttribute('href').includes('.mp4')){
                fileText.appendChild(GhostArchive_Create(Komica_File_Url, 'Video'));
                fileText.appendChild(WebArchive_Create(Komica_File_Url, 'Video'));
            }
            else{
                // $(this).find('.fileText').first().append(WebArchive_Create(Komica_File_Url, 'Image'));
                fileText.appendChild(ArchiveIs_Create(Komica_File_Url, 'Image'));
            }
        }

    })

   reply_Class_Read();
   document.addEventListener('click', event => {
       if (event.target.matches('.-expand-thread')) {
           setTimeout(() => {
               reply_Class_Read();
               console.log('Done!');
           }, 1000);
       }
   });

   function reply_Class_Read(){
       document.querySelectorAll('.reply').forEach(reply => {
               let fileThumb = reply.querySelector('.fileThumb');
               if (fileThumb && !reply.querySelector('form')) {
                   let Komica_File_Url = 'https:' + fileThumb.getAttribute('href');
                   let fileText = reply.querySelector('.fileText');
                   if (fileThumb.getAttribute('href').includes('.webm') || fileThumb.getAttribute('href').includes('.mp4')) {
                       fileThumb.appendChild(GhostArchive_Create(Komica_File_Url, 'Video'));
                       fileThumb.appendChild(WebArchive_Create(Komica_File_Url, 'Video'));
                   }
                   else{
                       // $(this).find('.fileText').append(WebArchive_Create(Komica_File_Url, 'Image'));
                       fileText.appendChild(ArchiveIs_Create(Komica_File_Url, 'Image'));
                   }
               }
       });
   }
       function WebArchive_Create(myUrl, myTarget){
       let form = document.createElement('form');
        form.setAttribute('name', 'wwmform_save');
        form.setAttribute('action', 'https://web.archive.org/save');
        form.setAttribute('method', 'POST');
        form.setAttribute('target', '_blank');
        form.style.display = 'inline-block';

        let inputUrl = document.createElement('input');
        inputUrl.setAttribute('id', 'url');
        inputUrl.setAttribute('type', 'hidden');
        inputUrl.setAttribute('name', 'url');
        inputUrl.setAttribute('value', myUrl);

        let inputSubmit = document.createElement('input');
        inputSubmit.setAttribute('type', 'submit');
        inputSubmit.setAttribute('value', 'Save ' + myTarget + ' to Web archive');

        form.appendChild(inputUrl);
        form.appendChild(inputSubmit);

        return form;
    }

    function ArchiveIs_Create(myUrl, myTarget){
       let form = document.createElement('form');
       form.setAttribute('id', 'submiturl');
       form.setAttribute('action', 'https://archive.is/submit/');
       form.setAttribute('method', 'GET');
       form.setAttribute('target', '_blank');
       form.style.display = 'inline-block';

        let inputUrl = document.createElement('input');
        inputUrl.setAttribute('id', 'url');
        inputUrl.setAttribute('type', 'hidden');
        inputUrl.setAttribute('name', 'url');
        inputUrl.setAttribute('value', myUrl);

        let inputSubmit = document.createElement('input');
        inputSubmit.setAttribute('type', 'submit');
        inputSubmit.setAttribute('value', 'Save ' + myTarget + ' to archive.is');
        inputSubmit.setAttribute('tabindex', '1');

        form.appendChild(inputUrl);
        form.appendChild(inputSubmit);
        return form;
    }

    function GhostArchive_Create(myUrl, myTarget){
      let form = document.createElement('form');
        form.setAttribute('id', 'submiturl');
        form.setAttribute('action', 'https://ghostarchive.org/archive2');
        form.setAttribute('method', 'POST');
        form.setAttribute('target', '_blank');
        form.style.display = 'inline-block';

      let inputUrl = document.createElement('input');
        inputUrl.setAttribute('id', 'url');
        inputUrl.setAttribute('type', 'hidden');
        inputUrl.setAttribute('name', 'archive');
        inputUrl.setAttribute('value', myUrl);

      let inputSubmit = document.createElement('input');
        inputSubmit.setAttribute('type', 'submit');
        inputSubmit.setAttribute('value', 'Save ' + myTarget + ' to ghostarchive.org');
        inputSubmit.setAttribute('tabindex', '1');

      form.appendChild(inputUrl);
      form.appendChild(inputSubmit);
      return form;
    }

})();