// ==UserScript==
// @name         Torn Forum Karma
// @namespace    https://torn.com/1714547
// @version      0.1
// @description  Hide low karma posts
// @author       Jox [1714547]
// @match        https://www.torn.com/forums.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370951/Torn%20Forum%20Karma.user.js
// @updateURL https://update.greasyfork.org/scripts/370951/Torn%20Forum%20Karma.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var targetNode = document.querySelector('.container');

    // Options for the observer (which mutations to observe)
    var config = {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList) {

        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                //console.log('A child node has been added or removed.',mutation);
                var threadList = document.querySelector('.threads-list');
                var threads = document.querySelector('.forums-thread');

                if(threadList || threads){
                    observer.disconnect();

                    var content = document.querySelector('.content-wrapper');

                    observer.observe(content, config);

                    if(threadList){
                        parseThreadsLists();
                    }

                    if(threads){
                        parseThreads();
                    }

                    break;
                }

                if(mutation.removedNodes.length > 0){
                    for(const node of mutation.removedNodes){
                        if(node.type == 1 && (node.childList.contains('threads-list') || node.childList.contains('forums-thread'))){
                            //console.log('Upsss, Got removed...');
                            break;
                        }
                    }
                }
            }
            else if (mutation.type == 'attributes') {
                //console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Later, you can stop observing
    //observer.disconnect();


    function parseThreadsLists(){
        //console.log('Thread list');

        observer.disconnect();

        var container = document.querySelector('.forums-committee-wrap');

        var myDiv = document.createElement('div');
        myDiv.classList.add('forums-committee', 'm-top10');
        var ul = document.createElement('ul');
        ul.classList.add('threads-list','fm-list','cont-gray','bottom-round');

        myDiv.appendChild(ul);
        container.parentElement.appendChild(myDiv);

        var dislikes = container.querySelectorAll('.dislike-icon');

        for(var dislike of dislikes){
            var dislikeThread = dislike.parentElement.parentElement.parentElement.parentElement;
            dislikeThread.remove();
            ul.appendChild(dislikeThread);
            //console.log(dislikeThread);
        }

        var content = document.querySelector('.content-wrapper');

        observer.observe(content, config);
    }


    function parseThreads(){
        //console.log('Threads');

        observer.disconnect();

        var posts = document.querySelectorAll('li > .column-wrap');


        for(var post of posts){
            var threadId = post.querySelector('.post-wrap').dataset.thread;
            var postId = post.querySelector('.post-wrap').dataset.post;
            //console.log(threadId, postId, post);

            var like = post.querySelector('.like > .value');
            var dislike = post.querySelector('.dislike > .value');

            //console.log(threadId, postId, like, dislike);

            if(parseInt(dislike.textContent) > parseInt(like.textContent)){
                //console.log('need to hide me');
                post.querySelector('.info-wrap').style.display = 'none';
                post.querySelector('.post-container').style.display = 'none';
            }

            var forInsertBefore = post.querySelector('.action-wrap > .right-part');

            if(!post.querySelector('.hide-me')){
                var li = document.createElement('li');
                li.innerHTML = 'show / hide';
                li.classList.add('hide-me');
                li.addEventListener('click', (e) => {
                    //console.log(e);
                    var container = e.srcElement.parentNode.parentNode.parentNode.parentNode;
                    //console.log(container);

                    var info = container.querySelector('.info-wrap');
                    var comment = container.querySelector('.post-container');

                    if(info.offsetWidth > 0 && info.offsetHeight > 0){
                        info.style.display = 'none';
                        comment.style.display = 'none';
                    }
                    else{
                        info.style.display = '';
                        comment.style.display = '';
                    }

                    //console.log(info, post);
                })

                forInsertBefore.parentNode.insertBefore(li, forInsertBefore.nextSibling);
            }


            //console.log(like, dislike);
        }


        var content = document.querySelector('.content-wrapper');

        observer.observe(content, config);
    }
})();