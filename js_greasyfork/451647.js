// ==UserScript==
// @name Reorder Mandiner Comments by responses
// @name:hu Mandiner comment sorrend rendezés válaszok szerint
// @description   Orgiginal time order is can be changed to response order. Threads containing banned users are excluded.
// @description:hu   Az eredeti idősorrend megváltoztatható válaszok szerinti sorrendre. Tiltott usernek szóló válaszok nem látszanak.
// @icon https://mandiner.hu/images/favicon.png
// @version 1.1
// @license MIT
// @include https://*mandiner.hu/cikk/*
// @grant    none
// @namespace https://greasyfork.org/en/users/961317-readonly
// @downloadURL https://update.greasyfork.org/scripts/451647/Reorder%20Mandiner%20Comments%20by%20responses.user.js
// @updateURL https://update.greasyfork.org/scripts/451647/Reorder%20Mandiner%20Comments%20by%20responses.meta.js
// ==/UserScript==


let commentsHeader = document.querySelector('.comments-head');

let sortDiv = document.createElement('div');
let sortByReplyLabel = document.createElement('span');
let sortByReplyCheckbox = document.createElement('input');

sortByReplyLabel.innerText = 'Válaszok szerinti rendezés';
sortByReplyCheckbox.type = 'checkbox';
sortByReplyCheckbox.id = 'sortByComment';
sortByReplyCheckbox.checked = true;

sortDiv.appendChild(sortByReplyCheckbox);
sortDiv.appendChild(sortByReplyLabel);
commentsHeader.appendChild(sortDiv);

sortByReplyCheckbox.onclick = () => {

   if (sortByReplyCheckbox.checked == true) {

      let commentArray = Array.from(document.querySelectorAll('.comment'));
      const commentList = document.querySelector('.Comments-list');

      for (let i = 0; i < commentArray.length; i++) {
         
         let replies = commentArray[i]
           .querySelector('.replies')
           .querySelectorAll('div');
            
         for (let j = 0; j < replies.length; j++) {
            
            const link = replies[j].querySelector('a').href;
            const id = link.slice(link.indexOf('#') + 'commentanch'.length + 1);
            const comm = document.querySelector('#comment' + id);
            
            if ( commentArray[i].style.display === 'none' && commentArray[i].style.visibility === 'hidden') {
               comm.style.display = 'none';
               comm.style.visibility = 'hidden';
            }
              
           commentArray.splice(commentArray.indexOf(comm),1);
           commentArray.splice(i + j + 1, 0, comm); 
           
         };
      };
      commentList.innerHTML = '';
      emptyComment = document.createElement('div')
      commentList.appendChild(emptyComment)
      commentArray.reverse().forEach( 
         (comment) => {
            commentList.insertBefore(comment, emptyComment.nextSibling);
         } 
      );

      document.querySelector('.filt').style.display = 'none';

   } else {

      document.querySelector('.anthracite').click();
      document.querySelector('.filt').style.display = 'block';

   }
};

sortByReplyCheckbox.onclick()
