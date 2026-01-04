// ==UserScript==
// @name               YouTube Most Popular Videos of Channel Shortcut
// @namespace          https://greasyfork.org/en/users/664455-ali-tale
// @version            1.8
// @description        Popular And Newest Videos shortcut (Adds after Show More button)
// @run-at             document-start
// @include            https://www.youtube.com/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author             AliTale
// @downloadURL https://update.greasyfork.org/scripts/406661/YouTube%20Most%20Popular%20Videos%20of%20Channel%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/406661/YouTube%20Most%20Popular%20Videos%20of%20Channel%20Shortcut.meta.js
// ==/UserScript==

$(document).ready(function() {
    function openChannelVideos(sortType) {
        const channel = $('a[href^="/channel/"].yt-simple-endpoint').attr('href');
        const channel_a = $('a[href^="/@"].yt-simple-endpoint').attr('href');
        if (channel) {
            const url = `https://www.youtube.com${channel}/videos?SRT=${sortType}`;
            window.open(url, '_blank');
        }else if(channel_a){
            const url = `https://www.youtube.com${channel_a}/videos?SRT=${sortType}`;
            window.open(url, '_blank');
        }
    }

    function setupButton(id, label, clickHandler , buttonContainer) {
        return $(`<div style="text-decoration: none; margin-left: 10px; cursor: pointer;" id="${id}" class="more-button style-scope ytd-video-secondary-info-renderer">${label}</div>`)
            .insertAfter(buttonContainer)
            .on('click', clickHandler);
    }

    function clickWhenElementExists(selector, clickHandler) {
        const interval = setInterval(() => {
            const element = $(selector);
            if (element.length) {
                clearInterval(interval);
                clickHandler(element);
            }
        }, 100);
    }

    if (window.location.href.includes("SRT=P")) {
        clickWhenElementExists('yt-formatted-string[title=Popular]', element => element.click());
    }
    if (window.location.href.includes("SRT=O")) {
        clickWhenElementExists('yt-formatted-string[title=Oldest]', element => element.click());
    }

    const checkExist = setInterval(() => {
        const expandButton = $('tp-yt-paper-button#expand.button.style-scope.ytd-text-inline-expander');
        if (expandButton.length) {
            clearInterval(checkExist);
            const buttonContainer = expandButton.parent();
            setupButton('PopularButt', 'Popular', () => openChannelVideos('P') , buttonContainer);
            setupButton('OldestButt', 'Oldest', () => openChannelVideos('O') , buttonContainer);
            setupButton('NewestButt', 'Newest', () => openChannelVideos('R') , buttonContainer);


        }
    }, 500);
});
