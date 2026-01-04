// ==UserScript==
// @name         To Archived.moe
// @namespace    http://github.com/hangjeff
// @version      2025-03-20_16h41m
// @description  To Website Archived.moe
// @author       hangjeff
// @match        https://boards.4chan.org/*
// @exclude        https://boards.4chan.org/h/*
// @exclude        https://boards.4chan.org/hc/*
// @exclude        https://boards.4chan.org/hm/*
// @exclude        https://boards.4chan.org/i/*
// @exclude        https://boards.4chan.org/lgbt/*
// @exclude        https://boards.4chan.org/r/*
// @exclude        https://boards.4chan.org/s/*
// @exclude        https://boards.4chan.org/soc/*
// @exclude        https://boards.4chan.org/t/*
// @exclude        https://boards.4chan.org/u/*
// @exclude        https://boards.4chan.org/a/*
// @exclude        https://boards.4chan.org/aco/*
// @exclude        https://boards.4chan.org/an/*
// @exclude        https://boards.4chan.org/c/*
// @exclude        https://boards.4chan.org/cgl/*
// @exclude        https://boards.4chan.org/co/*
// @exclude        https://boards.4chan.org/d/*
// @exclude        https://boards.4chan.org/fit/*
// @exclude        https://boards.4chan.org/g/*
// @exclude        https://boards.4chan.org/his/*
// @exclude        https://boards.4chan.org/int/*
// @exclude        https://boards.4chan.org/k/*
// @exclude        https://boards.4chan.org/m/*
// @exclude        https://boards.4chan.org/mlp/*
// @exclude        https://boards.4chan.org/mu/*
// @exclude        https://boards.4chan.org/q/*
// @exclude        https://boards.4chan.org/qa/*
// @exclude        https://boards.4chan.org/r9k/*
// @exclude        https://boards.4chan.org/tg/*
// @exclude        https://boards.4chan.org/trash/*
// @exclude        https://boards.4chan.org/vr/*
// @exclude        https://boards.4chan.org/wsg/*
// @exclude      https://boards.4chan.org/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529707/To%20Archivedmoe.user.js
// @updateURL https://update.greasyfork.org/scripts/529707/To%20Archivedmoe.meta.js
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