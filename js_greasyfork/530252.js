// ==UserScript==
// @name         To Archive Of Sins
// @namespace    http://github.com/hangjeff
// @version      2025-03-20_16h57m
// @description  To archiveofsins.com
// @author       hangjeff
// @match        https://boards.4chan.org/h/*
// @match        https://boards.4chan.org/hc/*
// @match        https://boards.4chan.org/hm/*
// @match        https://boards.4chan.org/i/*
// @match        https://boards.4chan.org/lgbt/*
// @match        https://boards.4chan.org/r/*
// @match        https://boards.4chan.org/s/*
// @match        https://boards.4chan.org/soc/*
// @match        https://boards.4chan.org/t/*
// @match        https://boards.4chan.org/u/*
// @exclude      https://boards.4chan.org/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530252/To%20Archive%20Of%20Sins.user.js
// @updateURL https://update.greasyfork.org/scripts/530252/To%20Archive%20Of%20Sins.meta.js
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
            let Redirect_Btn = ArchiveIs_Create(Komica_Thread_Url.replace("https://boards.4chan.org/", "https://archiveofsins.com/"),
                                       'Archive Of Sins');
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