// ==UserScript==
// @name Youtube Trending Blacklist
// @description Adds the option to blacklist some channels from your trending Feed
// @match https://www.youtube.com/*
// @version 1.0.3
// @namespace trending-blacklist
// @downloadURL https://update.greasyfork.org/scripts/389194/Youtube%20Trending%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/389194/Youtube%20Trending%20Blacklist.meta.js
// ==/UserScript==


const VideoSelector = 'ytd-video-renderer'
const ChannelSelector = [
	'ytd-video-meta-block [href^="/c"]',
	'ytd-video-meta-block [href^="/channel"]',
	'ytd-video-meta-block [href^="/user"]',
].join(',')

let trendingBlacklist = localStorage.getItem('trending-blacklist');

if (!trendingBlacklist) {
	trendingBlacklist = '[]';
}

trendingBlacklist = JSON.parse(trendingBlacklist);

console.log('current blacklist:', trendingBlacklist);

let removeBlacklisted = () => {
    if (location.href.indexOf('trending') === -1) {
        return;
    }

    document
        .querySelectorAll(VideoSelector)
        .forEach(function(node) {
      			var channel = node.querySelector(ChannelSelector);
      
            if (trendingBlacklist.indexOf(channel.innerText) !== -1) {
                channel.closest('ytd-video-renderer').remove();
            }
            else if (!channel.classList.contains('blacklist-visited')) {
                addBlacklistButton(channel);
                channel.classList.add('blacklist-visited');
            }
        });
}

function addBlacklistButton(node) {
    let button = document.createElement('span');
    button.innerText = 'Add to blacklist';
    button.classList = 'style-scope ytd-video-meta-block';
    button.addEventListener('click', function(event) {
        event.stopPropagation();
        
        console.log('adding', node.innerText, 'to blacklist');
        trendingBlacklist.push(node.innerText);
        localStorage.setItem('trending-blacklist', JSON.stringify(trendingBlacklist));
        removeBlacklisted();
    });
    node.closest('ytd-video-renderer').querySelector('#metadata-line').appendChild(button);
}

let loop = () => {
    removeBlacklisted();
    setTimeout(loop, 1000);
}

loop();