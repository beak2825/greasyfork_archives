// ==UserScript==
// @name         To Desuarchive
// @namespace    http://github.com/hangjeff
// @version      2025-03-20_16h50m
// @description  To desuarchive.org
// @author       hangjeff
// @match        https://boards.4chan.org/a/*
// @match        https://boards.4chan.org/aco/*
// @match        https://boards.4chan.org/an/*
// @match        https://boards.4chan.org/c/*
// @match        https://boards.4chan.org/cgl/*
// @match        https://boards.4chan.org/co/*
// @match        https://boards.4chan.org/d/*
// @match        https://boards.4chan.org/fit/*
// @match        https://boards.4chan.org/g/*
// @match        https://boards.4chan.org/his/*
// @match        https://boards.4chan.org/int/*
// @match        https://boards.4chan.org/k/*
// @match        https://boards.4chan.org/m/*
// @match        https://boards.4chan.org/mlp/*
// @match        https://boards.4chan.org/mu/*
// @match        https://boards.4chan.org/q/*
// @match        https://boards.4chan.org/qa/*
// @match        https://boards.4chan.org/r9k/*
// @match        https://boards.4chan.org/tg/*
// @match        https://boards.4chan.org/trash/*
// @match        https://boards.4chan.org/vr/*
// @match        https://boards.4chan.org/wsg/*
// @exclude      https://boards.4chan.org/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530327/To%20Desuarchive.user.js
// @updateURL https://update.greasyfork.org/scripts/530327/To%20Desuarchive.meta.js
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
            let Redirect_Btn = ArchiveIs_Create(Komica_Thread_Url.replace("https://boards.4chan.org/", "https://desuarchive.org/"),
                                       'Desuarchive');
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