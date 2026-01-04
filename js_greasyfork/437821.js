// ==UserScript==
// @name            Youtube - right side description with toggle button
// @description     Relocates the description to the right side and creates a button on the header to toggle with related videos
// @namespace       https://greasyfork.org/en/users/758587-barn852
// @version         2.0
// @author          barn852
// @license         MIT
// @match           *://*.youtube.com/*
// @include         *://*.youtube.com/watch*
// @grant           none
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/437821/Youtube%20-%20right%20side%20description%20with%20toggle%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/437821/Youtube%20-%20right%20side%20description%20with%20toggle%20button.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const hide_related = () => $('#related').hide();
    const insert_right = () => document.querySelector('#secondary-inner').appendChild(document.getElementById('meta-contents'));

    const observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if (mutation.type === 'childList'){
                mutation.addedNodes.forEach(function(node){
                    hide_related();
                });
            };
            if (document.querySelector("#secondary-inner > #meta-contents")) { return } else { insert_right() };
        });
    });

    observer.observe(document.body, {'childList': true, 'subtree' : true});

    let target = document.querySelectorAll('body')[0];
    let options = {'childList': true, 'subtree' : true};

    let button = document.createElement('button');
    button.innerHTML = '<svg width="24" height="24" viewBox="0 0 22 22"><g fill="currentColor"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></g></svg>';
    button.style = ` background: transparent; border: 0; color: rgb(96,96,96); outline: 0; cursor: pointer; padding-left: 24px; padding-right: 24px; `;

    let hide = true;

    button.onclick = ()=>{
        hide = !hide;
        $('#meta-contents').show();
        if (hide){
            if ($('#related')[0])
                $('#related').hide();
            else
                observer.observe(target, options);
                console.log(`hide`);
        }
        else{
            observer.disconnect();
            console.log(`show`);
            $('#related').show();
            $('#meta-contents').hide();
        }
    }

    let waitButton = setInterval(() => {
        if ($('#end').length) {
            clearInterval(waitButton);

            let menu = $('#end')[0];
            menu.insertBefore(button, menu.lastElementChild);

        }
    }, 500);

    console.log('inserted');

    window.addEventListener('yt-page-data-updated', function () {

        var checkExist = setInterval(function() {
            var ytMeta = document.querySelector('#secondary-inner #more .more-button.ytd-video-secondary-info-renderer');
            if(ytMeta){
                (ytMeta).click();
                clearInterval(checkExist);
            }
        }, 500);

    });

} )()
