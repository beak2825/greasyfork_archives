// ==UserScript==
// @name         To 4plebs
// @namespace    http://github.com/hangjeff
// @version      2025-03-20_16h45m
// @description  To archive.4plebs.org
// @author       hangjeff
// @match        https://boards.4chan.org/adv*
// @match        https://boards.4chan.org/f/*
// @match        https://boards.4chan.org/hr/*
// @match        https://boards.4chan.org/o/*
// @match        https://boards.4chan.org/pol/*
// @match        https://boards.4chan.org/s4s/*
// @match        https://boards.4chan.org/sp/*
// @match        https://boards.4chan.org/tg/*
// @match        https://boards.4chan.org/trv/*
// @match        https://boards.4chan.org/tv/*
// @match        https://boards.4chan.org/x/*
// @exclude      https://boards.4chan.org/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530329/To%204plebs.user.js
// @updateURL https://update.greasyfork.org/scripts/530329/To%204plebs.meta.js
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
        // alert( Komica_Thread_Url);
        let postInfo = thread.querySelector('.postInfo');
        if(postInfo){
            let Redirect_Btn = ArchiveIs_Create(Komica_Thread_Url.replace("https://boards.4chan.org/", "https://archive.4plebs.org/"),
                                       '4plebs');
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