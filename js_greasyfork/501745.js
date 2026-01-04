// ==UserScript==
// @name         majeur Save
// @namespace    http://tampermonkey.net/
// @version      2025-03-27
// @description  Save the Majeur thread
// @author       hangjeff
// @match        https://majeur.zawarudo.org/*/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/501745/majeur%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/501745/majeur%20Save.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    $('.op').each(function(){
        let majeur_Thread_Url = window.location.href;
        if(!majeur_Thread_Url.includes('res')){
            for(let i = 0; i < 2; i++){
                majeur_Thread_Url = majeur_Thread_Url.substring(0, majeur_Thread_Url.lastIndexOf('/'));
            }
            majeur_Thread_Url = majeur_Thread_Url + $(this).find('.intro a:contains("[Reply]")').attr('href');
        }

        $(this).find('.intro').after(ArchiveIs_Create(majeur_Thread_Url, 'Thread'));

        files_Class_Read(majeur_Thread_Url);

    })

    $('.video-container').each(function(){
        if($(this).find('.post-image').attr('src').includes('img.youtube.com')){
            let yt_Img_Url = 'https:' + $(this).find('.post-image').attr('src');
            $(this).append(ArchiveIs_Create(yt_Img_Url, 'Image'));
        }
    })


   function files_Class_Read(Thread_Url){
       $('.files').each(function(){
           if($(this).find('.fileinfo').length){
               if(!$(this).find('form').length){
                   let majeur_File_Url = Thread_Url;
                   for(let i = 0; i < 3; i++){
                       majeur_File_Url = majeur_File_Url.substring(0, majeur_File_Url.lastIndexOf('/'));
                   }
                   majeur_File_Url = majeur_File_Url + $(this).find('.fileinfo').find('a').first().attr('href');
                   if(majeur_File_Url.includes('.webm') || majeur_File_Url.includes('.mp4')){
                       $(this).find('.fileinfo').first().append(WebArchive_Create(majeur_File_Url, 'Video'));
                   }
                   else{
                       $(this).find('.fileinfo').first().append(ArchiveIs_Create(majeur_File_Url, 'Image'));
                   }
                   $(this).find('.fileinfo').css('height', '26px');
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
    			}).css('display', 'inline-block').css('height', '20px').css('margin-bottom', '32px');

        form.append(
        			$('<input>', {
                		class: 'url',
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
        			class: 'submiturl',
        			action: 'https://archive.is/submit/',
        			method: 'GET',
                    target: '_blank'
    			}).css('display', 'inline-block').css('height', '20px').css('margin-bottom', '32px');

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

    function GhostArchive_Create(myUrl, myTarget){
      let form = $('<form>', {
        			class: 'submiturl',
        			action: 'https://ghostarchive.org/archive2',
        			method: 'POST',
                    target: '_blank'
    			}).css('display', 'inline-block').css('height', '20px').css('margin-bottom', '32px');

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