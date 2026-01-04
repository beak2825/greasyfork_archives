// ==UserScript==
// @name         clean-youtube
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  sorts youtube playlist on sidebar
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413830/clean-youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/413830/clean-youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playlistsAreSorted = false;
    let sidebarIsCleaned = false;

    // logs text to console but marking the text to tell the user that this script
    // was the thing that logged it
    function log(text)
    {
        console.log(`clean-youtube: ${text}`);
    }

    // sorts playlists on sidebar alphabetically
    function sortPlaylists()
    {
        // if playlists were already sorted, then new triggered events should waste their time resorting them
        if(playlistsAreSorted)
        {
            return;
        }

        log('sorting playlists');

        let parentContainer = document.querySelector('#expanded');
        let playlistContainer = parentContainer.querySelector('#expandable-items');
        let playlists = Array.from(playlistContainer.children);
        let collapser = parentContainer.querySelector('#collapser-item');

        // updates button with the text 'Show less' to simply 'Playlists'
        let textToUpdate = collapser.querySelector('yt-formatted-string.title');

        textToUpdate.innerHTML = 'Playlists';

        // puts the playlist collapser on top instead of on bottom
        parentContainer.removeChild(playlistContainer);
        parentContainer.removeChild(collapser);

        parentContainer.appendChild(collapser);
        parentContainer.appendChild(playlistContainer);

        // adds padding to the collapser because it looks weird on top otherwise
        collapser.style.paddingBottom = '10px';

        // loops through all listed playlists to sort them
        playlists = playlists.sort( (thisPlaylist, thatPlaylist) =>
                                   {
            const thisLink = thisPlaylist.querySelector('a');
            const thatLink = thatPlaylist.querySelector('a');

            // titles to sort by
            const thisTitle = thisLink.title.toUpperCase();
            const thatTitle = thatLink.title.toUpperCase();

            // sorting logic
            return (thisTitle < thatTitle) ? -1 : 1;
        });

        // clears content to readd the sorted content
        playlistContainer.innerHTML = '';

        let likedVideosWasRemoved = false;

        // goes through the playlists and readds them to the document
        // in the new sorted order
        playlists.forEach( playlist =>
        {
            // logic for removing the 'Liked videos' link
            if(!likedVideosWasRemoved)
            {
                let link = playlist.querySelector('a');

                if(link.title === 'Liked videos')
                {
                    likedVideosWasRemoved = true;
                    return;
                }
            }
            playlistContainer.appendChild(playlist);
        });

        playlistsAreSorted = true;
    }

    // the channels sorted by status
    let liveChannels = [];
    let uploadedToChannels = [];
    let otherChannels = [];

    function sortSubscriptions(subscriptionSection)
    {
        let header = subscriptionSection.querySelector('h3');
        let subscriptionItemsContainer = subscriptionSection.querySelector('#items');
        let subscriptionItems = Array.from(subscriptionItemsContainer.querySelectorAll('ytd-guide-entry-renderer'));
        let hiddenSubscriptionsContainer = subscriptionItemsContainer.querySelector('ytd-guide-collapsible-entry-renderer');
        let hiddenSubscriptionItemsContainer = hiddenSubscriptionsContainer.querySelector('#expandable-items');
        let collapserButton = subscriptionItemsContainer.querySelector('#collapser-item');

        if(!collapserButton)
        {
            setTimeout(() => sortSubscriptions(subscriptionSection), 100);
        }

        // goes through all channels and sorts them based on their status (live/badge, uploaded/dot, none)
        for(let item of subscriptionItems)
        {
            let channelStatus = item.lineEndStyle;
            let title = item.querySelector('a').title;

            item.parentNode.removeChild(item);

            if(channelStatus === 'badge')
            {
                liveChannels.push(item);
            }
            else if(channelStatus === 'dot')
            {
                uploadedToChannels.push(item);
            }
            if(channelStatus === 'none' && item.id != 'expander-item' && title != 'Browse channels')
            {
                otherChannels.push(item);
            }
        }

        let sectionHeading = document.createElement('h4');

        sectionHeading.style.padding = '30px 0 30px';
        sectionHeading.style.margin = '0 40px 15px';
        sectionHeading.style.textAlign = 'center';
        sectionHeading.style.color = '#555';
        sectionHeading.style.fontSize = '14px';
        sectionHeading.style.fontWeight = '400';
        sectionHeading.style.borderBottom = '1.5px solid #aaa';

        if(liveChannels.length > 0)
        {
            sectionHeading.innerHTML = 'LIVE';
            subscriptionItemsContainer.appendChild(sectionHeading);
        }
        // goes through each list and adds them back respectively
        for(let item of liveChannels)
        {
            subscriptionItemsContainer.appendChild(item);
        }

        if(uploadedToChannels.length > 0)
        {
            sectionHeading = sectionHeading.cloneNode(false);
            sectionHeading.innerHTML = 'New Uploads';
            subscriptionItemsContainer.appendChild(sectionHeading);
        }
        // goes through each list and adds them back respectively
        for(let item of uploadedToChannels)
        {
            subscriptionItemsContainer.appendChild(item);
        }

        if(otherChannels.length > 0)
        {
            sectionHeading = sectionHeading.cloneNode(false);
            sectionHeading.innerHTML = 'Other Channels';
            subscriptionItemsContainer.appendChild(sectionHeading);
        }
        // goes through each list and adds them back respectively
        for(let item of otherChannels)
        {
            subscriptionItemsContainer.appendChild(item);
        }

        let spacing = document.createElement('div');

        spacing.style.padding = '30px 0';

        subscriptionItemsContainer.appendChild(spacing);

        // removes expandable portion of subscriptions
        hiddenSubscriptionsContainer.parentNode.removeChild(hiddenSubscriptionsContainer);
        collapserButton.parentNode.removeChild(collapserButton);
        header.parentNode.removeChild(header);
    }

    function cleanSidebar()
    {
        if(sidebarIsCleaned)
        {
            return;
        }

        log('cleaning sidebar');

        let sidebarSections = Array.from(document.querySelectorAll('#sections ytd-guide-section-renderer'));

        if(sidebarSections.length < 4)
        {
            return setTimeout(cleanSidebar, 100);
        }

        let footer = document.querySelector('#footer');

        let topSection = sidebarSections[0];
        let subscriptionSection = sidebarSections[1];

        let topItemsContainer = topSection.querySelector('#items');
        let topItems = Array.from(topItemsContainer.querySelectorAll('ytd-guide-entry-renderer'));
        let playlistContainer = topItemsContainer.querySelector('ytd-guide-collapsible-section-entry-renderer');

        if(topItems.length === 0)
        {
            return setTimeout(cleanSidebar, 100);
        }
        else
        {
            // removes unnecessary sections from sidebar
            sidebarSections[2].parentNode.removeChild(sidebarSections[2]);
            sidebarSections[3].parentNode.removeChild(sidebarSections[3]);
            footer.parentNode.removeChild(footer);

            // gets expansion portion of subscriptions and clicks to expand and load all channels
            let subscriptionItemsContainer = subscriptionSection.querySelector('#items');
            let hiddenSubscriptionsContainer = subscriptionItemsContainer.querySelector('ytd-guide-collapsible-entry-renderer');
            let expandButton = hiddenSubscriptionsContainer.querySelector('#endpoint');

            log(expandButton);

            expandButton.click();
        }

        for(let item of topItems)
        {
            let itemLink = item.querySelector('a');

            if(itemLink.title === 'Home')
            {
                item.parentNode.removeChild(item);
            }
            else if(itemLink.title === 'Trending')
            {
                item.parentNode.removeChild(item);
            }
            else if(itemLink.title === 'Originals')
            {
                item.parentNode.removeChild(item);
            }
            else if(itemLink.title === 'History')
            {
                item.parentNode.removeChild(item);
            }
            else if(itemLink.title === 'Your videos')
            {
                item.parentNode.removeChild(item);
            }
            else if(itemLink.title === 'Purchases')
            {
                item.parentNode.removeChild(item);
            }
            else if(itemLink.title === 'Library')
            {
                item.parentNode.removeChild(item);
                topItemsContainer.appendChild(item);
            }
            else if(itemLink.title === 'Watch later')
            {
                item.parentNode.removeChild(item);
            }
        }
        topItemsContainer.removeChild(playlistContainer);
        topItemsContainer.appendChild(playlistContainer);

        let textToUpdate = playlistContainer.querySelector('#expander-item yt-formatted-string.title');

        textToUpdate.innerHTML = 'Playlists';

        sidebarIsCleaned = true;

        setTimeout(() => sortSubscriptions(subscriptionSection), 100);
    }

    function runCheck()
    {
        log('running check');

        let showPlaylistsButton = document.querySelector('ytd-guide-collapsible-section-entry-renderer ytd-guide-collapsible-entry-renderer')
        let playlistContainer = document.querySelector('#expandable-items');
        let sidebarIsExpanded = document.querySelector('#header').hidden;

        if(sidebarIsExpanded)
        {
            cleanSidebar();
        }
        if(showPlaylistsButton)
        {
            showPlaylistsButton.addEventListener('click', sortPlaylists);
        }
        else if(playlistContainer)
        {
            sortPlaylists();
        }
        else if(sidebarIsExpanded)
        {
            setTimeout(runCheck, 250);
        }
    }


    let sidebarToggle = document.querySelector('#guide-button #button');

    if(sidebarToggle)
    {
        sidebarToggle.addEventListener('click', runCheck);
    }

    log('clean-youtube is enabled');

    runCheck();
})();