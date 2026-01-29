// ==UserScript==
// @name         Komica Save
// @namespace    http://tampermonkey.net/
// @version      2026-01-28_16h42m
// @description  Save the Komica thread
// @author       hangjeff
// @match        https://gita.komica1.org/00b/*
// @match        https://2cha.org/*
// @match        https://gaia.komica1.org/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501607/Komica%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/501607/Komica%20Save.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
 
    $('.thread').each(function(){
        let Komica_Thread_Url = window.location.href;
        if(!Komica_Thread_Url.includes('res')){
            Komica_Thread_Url = Komica_Thread_Url.substring(0, Komica_Thread_Url.lastIndexOf('/') + 1);
            if(!($(this).find('.threadpost').find('.post-head').find('.rlink').find('a').first().attr('href') === undefined)  )
               Komica_Thread_Url = Komica_Thread_Url + $(this).find('.threadpost').find('.post-head').find('.rlink').find('a').first().attr('href');
            else
                Komica_Thread_Url = Komica_Thread_Url + $(this).find('.threadpost').find('.category a:last').attr('href');
        }
 
        $(this).find('.threadpost').after(ArchiveIs_Create(Komica_Thread_Url, 'Thread'));
        $(this).find('.threadpost').after(WebArchive_Create(Komica_Thread_Url, 'Thread'));
 
        if($(this).find('.file-thumb').length){
            let Komica_File_Url = 'https:' + $(this).find('.file-thumb').attr('href');
 
            if($(this).find('.file-thumb').attr('href').includes('.webm') || $(this).find('.file-thumb').attr('href').includes('.mp4')){
                $(this).find('.file-text').first().append(WebArchive_Create(Komica_File_Url, 'Video'));
            }
            else if($(this).find('.file-thumb').attr('href').includes('.gif')){
                $(this).find('.file-text').first().append(WebArchive_Create(Komica_File_Url, 'Gif'));
                $(this).find('.file-text').first().append(GhostArchive_Create(Komica_File_Url, 'Gif'));
            }
            else{
                $(this).find('.file-text').first().append(WebArchive_Create(Komica_File_Url, 'Image'));
                $(this).find('.file-text').first().append(Megalodon_Create(Komica_File_Url, 'Image'));
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
               if(!$(this).find('form').length){
                   let Komica_File_Url = 'https:' + $(this).find('.file-thumb').attr('href');
                   if($(this).find('.file-thumb').attr('href').includes('.webm') || $(this).find('.file-thumb').attr('href').includes('.mp4')){
                       $(this).find('.file-text').append(WebArchive_Create(Komica_File_Url, 'Video'));
                   }
                   else if($(this).find('.file-thumb').attr('href').includes('.gif')){
                       $(this).find('.file-text').first().append(WebArchive_Create(Komica_File_Url, 'Gif'));
                       $(this).find('.file-text').first().append(GhostArchive_Create(Komica_File_Url, 'Gif'));
                   }
                   else{
                       $(this).find('.file-text').append(WebArchive_Create(Komica_File_Url, 'Image'));
                       $(this).find('.file-text').append(Megalodon_Create(Komica_File_Url, 'Image'));
                   }
               }
           }
       })
   }
 
    function WebArchive_Create(myUrl, myTarget){
       let form = $('<form>', {
                    name: 'wwmform_save',
                    action: 'https://web.archive.org/save',
                    method: 'POST',
                    target: '_blank'
                }).css('display', 'inline-block');
 
        form.append(
                    $('<input>', {
                        id: 'url',
                        type: 'hidden',
                        name: 'url',
                        value: myUrl
                    })
                );
 
        form.append(
                    $('<input>', {
                        type: 'submit',
                        value: 'Save ' + myTarget + ' to Web archive',
                    })
                );
        return form;
    }
 
    function ArchiveIs_Create(myUrl, myTarget){
       let form = $('<form>', {
                    id: 'submiturl',
                    action: 'https://archive.is/submit/',
                    method: 'GET',
                    target: '_blank'
                }).css('display', 'inline-block');
 
        form.append(
                    $('<input>', {
                        id: 'url',
                        type: 'hidden',
                        name: 'url',
                        value: myUrl
                    })
                );
 
        form.append(
                    $('<input>', {
                        type: 'submit',
                        value: 'Save ' + myTarget + ' to archive.is',
                        tabindex: '1'
                    })
                );
        return form;
    }
 
    function Megalodon_Create(myUrl, myTarget){
      let btn = $('<input>', {
          type: 'button',
          value: 'Save ' + myTarget + ' to ウェブ魚拓',
          click: () => {
              window.open(
                  "https://megalodon.jp/pc/main?url=" + encodeURIComponent(myUrl)
                  , "_blank");
          }
      });
 
      return btn;
    }
 
    function GhostArchive_Create(myUrl, myTarget){
      let form = $('<form>', {
                    id: 'submiturl',
                    action: 'https://ghostarchive.org/archive2',
                    method: 'POST',
                    target: '_blank'
                }).css('display', 'inline-block');
 
      form.append(
                    $('<input>', {
                        id: 'url',
                        type: 'hidden',
                        name: 'archive',
                        value: myUrl
                    })
                );
 
      form.append(
                    $('<input>', {
                        type: 'submit',
                        value: 'Save ' + myTarget + ' to ghostarchive.org',
                        tabindex: '1'
                    })
                );
 
      return form;
    }
 
})();