// ==UserScript==
// @name        Statify Official WoT Forums
// @namespace   BocajSretep
// @description Adds WoTLabs stats to the official forums
// @include     http://forum.worldoftanks.com/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5363/Statify%20Official%20WoT%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/5363/Statify%20Official%20WoT%20Forums.meta.js
// ==/UserScript==
(function statifyWotForums() {
    var poasts = document.querySelectorAll('.post_block'),
        fragment = document.createDocumentFragment(),
        listItem = document.createElement('li'),
        nmDiv = document.createElement('div'),
        nmLink = document.createElement('a'),
        wlDiv = document.createElement('div'),
        wlLink = document.createElement('a'),
        sigDiv = document.createElement('div'),
        statsSig = document.createElement('img'),
        cssRules = document.createElement('style'),
        playerName;
    
    cssRules.innerHTML = '.wotLabsStats{width: 107px; padding: 2px; margin-top: 5px; background: white; border: 1px solid grey; overflow-x: hidden; transition: width 500ms}.wotLabsStats:hover{width: 472px}.statsLink:before {content: "";display: inline-block;height: 0;width: 0;margin-right: 0.5em;border-left: 4px solid #5A5A5A;border-top: 4px solid transparent;border-bottom: 4px solid transparent;}.statsLink{margin-top: 5px;}';
    document.head.appendChild(cssRules);
    
    
    listItem.classList.add('desc');
    listItem.classList.add('stats');
    
    nmDiv.classList.add('statsLink');
    wlDiv.classList.add('statsLink');
    sigDiv.classList.add('wotLabsStats');
    
    nmLink.innerHTML = 'NoobMeter';
    wlLink.innerHTML = 'WotLabs';
    
    nmDiv.appendChild(nmLink);
    listItem.appendChild(nmDiv);
    wlDiv.appendChild(wlLink);
    listItem.appendChild(wlDiv);
    sigDiv.appendChild(statsSig);
    listItem.appendChild(sigDiv);
    fragment.appendChild(listItem);
    
    for(var i = 0; i < poasts.length; ++i) {
        playerName = poasts[i].querySelector('.name').getAttribute('hovercard-id');
        
        nmLink.href = "http://www.noobmeter.com/player/na/" + playerName;
        wlLink.href = "http://wotlabs.net/na/player/" + playerName;
        statsSig.src = "http://wotlabs.net/sig/na/" + playerName + "/signature.png"
        
        poasts[i].querySelector('.basic_info').appendChild(fragment.cloneNode(true));
        
    }
})();