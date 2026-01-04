// ==UserScript==
// @name         Komica Save webm to catbox
// @namespace    http://github.com/hangjeff
// @version      2025-06-06_09h20m
// @description  Save the Komica webm to catbox
// @author       hangjeff
// @match        https://gita.komica1.org/00b/*
// @match        https://2cha.org/*
// @match        https://gaia.komica1.org/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538484/Komica%20Save%20webm%20to%20catbox.user.js
// @updateURL https://update.greasyfork.org/scripts/538484/Komica%20Save%20webm%20to%20catbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let UserHash = ''; // Enter your own user hash here
     $('.thread').each(function(){
         if($(this).find('.file-thumb').length){
            let Komica_File_Url = 'https:' + $(this).find('.file-thumb').attr('href');
             if($(this).find('.file-thumb').attr('href').includes('.webm') || $(this).find('.file-thumb').attr('href').includes('.mp4')){
                 $(this).find('.file-text').first().append(Catbox_Create(Komica_File_Url, 'Video'));
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
       $('.reply').each(function(){
               if($(this).find('.file-thumb').length){
                    if(!$(this).find('.catboxForm').length){
                        let Komica_File_Url = 'https:' + $(this).find('.file-thumb').attr('href');
                        if($(this).find('.file-thumb').attr('href').includes('.webm') || $(this).find('.file-thumb').attr('href').includes('.mp4')){
                            $(this).find('.file-text').first().append(Catbox_Create(Komica_File_Url, 'Video'));
                        }
                    }
               }
       });
   }
       function Catbox_Create(myUrl, myTarget){
           let form = document.createElement('form');
           form.setAttribute('action', 'https://catbox.moe/user/api.php');
           form.setAttribute('method', 'POST');
           form.className = 'catboxForm';
           form.setAttribute('target', '_blank');
           form.setAttribute('enctype', 'multipart/form-data');

           let inputUser = document.createElement('input');
           inputUser.setAttribute('type', 'hidden');
           inputUser.setAttribute('name', 'userhash');
           inputUser.setAttribute('value', UserHash);
           let inputReqType = document.createElement('input');
           inputReqType.setAttribute('type', 'hidden');
           inputReqType.setAttribute('name', 'reqtype');
           inputReqType.setAttribute('value', 'urlupload');
           let inputUrl = document.createElement('input');
           inputUrl.setAttribute('type', 'hidden');
           inputUrl.setAttribute('name', 'url');
           inputUrl.setAttribute('value', myUrl);

           let inputSubmit = document.createElement('input');
           inputSubmit.setAttribute('type', 'submit');
           inputSubmit.setAttribute('value', 'Save ' + myTarget + ' to catbox');
           inputSubmit.style.backgroundColor = "#ADD8E6";
           inputSubmit.style.color = "#000000";

           form.appendChild(inputUser);
           form.appendChild(inputReqType);
           form.appendChild(inputUrl);
           form.appendChild(inputSubmit);

           return form;
    }

})();