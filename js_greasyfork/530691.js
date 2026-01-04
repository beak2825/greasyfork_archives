// ==UserScript==
// @name         To Archived.moe For 4chan search
// @namespace    http://github.com/hangjeff
// @version      2025-03-24_14h55m
// @description  To Website Archived.moe
// @author       hangjeff
// @match      https://boards.4chan.org/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530691/To%20Archivedmoe%20For%204chan%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/530691/To%20Archivedmoe%20For%204chan%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     document.querySelectorAll('.thread').forEach(function(thread) {
        let replyLink = thread.querySelector('.postContainer .replylink');
        let Komica_Thread_Url = 'https:';
         if(replyLink && replyLink.getAttribute('href') !== undefined){
             Komica_Thread_Url = Komica_Thread_Url + replyLink.getAttribute('href');
         }
        // alert( Komica_Thread_Url);
        let postInfo = thread.querySelector('.postInfo');
        if(postInfo){
            let Redirect_Btn = ArchiveIs_Create(Komica_Thread_Url.replace("https://boards.4chan.org/", "https://archived.moe/"),
                                       'Archived.moe');
            postInfo.parentNode.insertBefore(Redirect_Btn, postInfo.nextSibling);
        }
    })

    function ArchiveIs_Create(myUrl, myTarget){
       let btn = document.createElement('button');
       btn.textContent = 'Redirect to ' + myTarget;
       btn.tabIndex = 1;
       btn.style.display = 'inline-block';
       btn.style.backgroundColor = 'green';
       btn.addEventListener('click', function(event) {
           event.preventDefault();
           window.open(myUrl, '_blank');
       });
       return btn;
    }

})();