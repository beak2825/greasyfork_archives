// ==UserScript==
// @name         To warosu
// @namespace    http://github.com/hangjeff
// @version      2025-07-29_11h40m
// @description  To archiveofsins.com
// @author       hangjeff
// @match        https://boards.4chan.org/vt/*
// @exclude      https://boards.4chan.org/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538276/To%20warosu.user.js
// @updateURL https://update.greasyfork.org/scripts/538276/To%20warosu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     document.querySelectorAll('.thread').forEach(function(thread) {
        let Komica_Thread_Url = window.location.href;
        if(!Komica_Thread_Url.includes('thread')){
            Komica_Thread_Url = Komica_Thread_Url.substring(0, Komica_Thread_Url.lastIndexOf('/') + 1);
            let replyLink = thread.querySelector('.postContainer .replylink');
            if(replyLink && replyLink.getAttribute('href') !== undefined){
               Komica_Thread_Url = Komica_Thread_Url + replyLink.getAttribute('href');
               //alert(Komica_Thread_Url);
            }
            else{
                // Komica_Thread_Url = Komica_Thread_Url + $(this).find('.threadpost').find('.category a:last').attr('href');
                console.log('404 Thread Not Found!');
            }
        }
        Komica_Thread_Url = Komica_Thread_Url.substring(0, Komica_Thread_Url.lastIndexOf("/"));
        //alert(Komica_Thread_Url);
        let postInfo = thread.querySelector('.postInfo');
        if(postInfo){
            let Redirect_Btn = ArchiveIs_Create(Komica_Thread_Url.replace("https://boards.4chan.org/", "https://warosu.org/"),
                                       'Warosu');
            postInfo.parentNode.insertBefore(Redirect_Btn, postInfo.nextSibling);
            //alert(Komica_Thread_Url.replace("https://boards.4chan.org/", "https://warosu.org/"));
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