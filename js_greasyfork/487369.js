// ==UserScript==
// @name         VideoPlayerMagic-Styles
// @namespace    vpm-s
// @version      2025_12-16_01
// @description  CSS Styles for VideoPlayerMagic
// @author       SimplyMe
// @license      MIT
// @grant        none
// ==/UserScript==

let vpmStyles = {
    'pornhub':   `div#player.maximized {position: fixed !important; top: 0; left: 0; height: 100vh !important; width: 100vw !important; z-index: 5000;}
                  div#player.maximized video-element {height: inherit; width: inherit;}`,
    'xhamster':  `div#player-container.maximized {position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; z-index: 5000;}`,
    'xvideos':   `div#content.maximized {position: fixed !important; top: 0; left: 0; height: 100vh; width: 100vw; z-index: 5000 !important; margin: 0 !important;}
                  div#content.maximized div#html5video {width: 100vw; height: 100vh !important;}
                  div#content.maximized div#hlsplayer {width: 100vw; height: 100vh !important;}
                  div#content.maximized div.progress-bar-bg { display: none !important;}
                  div#content.maximized div.buttons-bar {display: none !important;}`,
    'spankbang': `#video #video_container div#main_video_player.maximized {position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; z-index: 5000;}`,
    'eporner':   `div#EPvideo.maximized {position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; z-index: 5000;}`,
    'hypnotube': `div.plyr.maximized {position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; z-index: 5000; background: #000;}`,
    'pmvhaven':  `div.hls-player-wrapper.maximized {position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; z-index: 5000;}`
};

function injectStyles() {
    let styleTag = document.createElement('style');
    if (document.location.host.includes('pornhub'))
        styleTag.innerHTML = vpmStyles.pornhub;
    else if (document.location.host.includes('xhamster'))
        styleTag.innerHTML = vpmStyles.xhamster;
    else if (document.location.host.includes('xvideos'))
        styleTag.innerHTML = vpmStyles.xvideos;
    else if (document.location.host.includes('eporner'))
        styleTag.innerHTML = vpmStyles.eporner;
    else if (document.location.host.includes('spankbang'))
        styleTag.innerHTML = vpmStyles.spankbang;
    else if (document.location.host.includes('hypnotube'))
        styleTag.innerHTML = vpmStyles.hypnotube;
    else if (document.location.host.includes('pmvhaven'))
        styleTag.innerHTML = vpmStyles.pmvhaven;
    document.head.appendChild(styleTag);
}