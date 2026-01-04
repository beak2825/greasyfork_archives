// ==UserScript==
// @name         Skip sponsors - using Sponsorblock API on m.youtube.com (Kiwi browser etc.)
// @namespace    http://your-namespace.com
// @version      4.0
// @description  Skip sponsors/selfpromo, marks them in progress bar
// @author       
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505870/Skip%20sponsors%20-%20using%20Sponsorblock%20API%20on%20myoutubecom%20%28Kiwi%20browser%20etc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505870/Skip%20sponsors%20-%20using%20Sponsorblock%20API%20on%20myoutubecom%20%28Kiwi%20browser%20etc%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  const style = document.createElement('style');
  style.textContent = `
    .ytProgressBarPlayheadHost {
      z-index: 67666 !important;
    }
  `;
  document.head.appendChild(style);
  
  // sha256 lib
  var sha256 = function a(b){function c(a,b){return a>>>b|a<<32-b}for(var d,e,f=Math.pow,g=f(2,32),h="length",i="",j=[],k=8*b[h],l=a.h=a.h||[],m=a.k=a.k||[],n=m[h],o={},p=2;64>n;p++)if(!o[p]){for(d=0;313>d;d+=p)o[d]=p;l[n]=f(p,.5)*g|0,m[n++]=f(p,1/3)*g|0}for(b+="\x80";b[h]%64-56;)b+="\x00";for(d=0;d<b[h];d++){if(e=b.charCodeAt(d),e>>8)return;j[d>>2]|=e<<(3-d)%4*8}for(j[j[h]]=k/g|0,j[j[h]]=k,e=0;e<j[h];){var q=j.slice(e,e+=16),r=l;for(l=l.slice(0,8),d=0;64>d;d++){var s=q[d-15],t=q[d-2],u=l[0],v=l[4],w=l[7]+(c(v,6)^c(v,11)^c(v,25))+(v&l[5]^~v&l[6])+m[d]+(q[d]=16>d?q[d]:q[d-16]+(c(s,7)^c(s,18)^s>>>3)+q[d-7]+(c(t,17)^c(t,19)^t>>>10)|0),x=(c(u,2)^c(u,13)^c(u,22))+(u&l[1]^u&l[2]^l[1]&l[2]);l=[w+x|0].concat(l),l[4]=l[4]+w|0}for(d=0;8>d;d++)l[d]=l[d]+r[d]|0}for(d=0;8>d;d++)for(e=3;e+1;e--){var y=l[d]>>8*e&255;i+=(16>y?0:"")+y.toString(16)}return i};

  function getYouTubeVideoID(url) {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  let previousUrl = window.location.href;
  let skipSegments = [];
  let gradientStops = [];
  let skipgradientStop = [];
  let intervalId = null;
  let index3 = false;

  const skipButton = document.createElement('button');
  skipButton.textContent = '>>';
  skipButton.style.width = "50px";
  skipButton.style.fontSize = "40px";
  skipButton.style.zIndex = '8888';
  skipButton.style.background = 'transparent';
  skipButton.style.display = "none";
  skipButton.style.textShadow = `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000`;
  skipButton.className = 'skip-button-S';
  skipButton.title = "Skip To Highlight";

  setInterval(() => {
    const currentVideoId = getYouTubeVideoID(window.location.href);
    const isWatchPage = window.location.href.includes('watch?v=');

    if ((currentVideoId !== getYouTubeVideoID(previousUrl)) ||
      (!isWatchPage && previousUrl.includes('watch?v='))) {
      previousUrl = window.location.href;
      clearInterval(intervalId);
      document.getElementById('skip-gradient')?.remove();
      document.getElementById('sponsorblock-gradient')?.remove();
      
      if (isWatchPage) {
        gradientStops = [];
        skipSegments = [];
        skipgradientStop = [];
        index3 = false;
        skipButton.style.display = 'none';
      } else {
        skipButton.style.display = 'none';
      }
    }

    if (document.querySelector('video')) {
      const video_obj = document.querySelector("video");
      if (document.querySelector('div[role="slider"]') && window.location.href.includes('watch?v=') && !index3) {
        index3 = true;
        const videoID = getYouTubeVideoID(window.location.href);
        const hash = sha256(videoID).substr(0, 4);
        const url = `https://sponsor.ajay.app/api/skipSegments/${hash}?service=YouTube&categories=%5B%22sponsor%22,%22poi_highlight%22,%22selfpromo%22%5D`;

        fetch(url).then(r => r.json()).then(data => {
          if (!Array.isArray(data)) return;
          for (const video of data) {
            if (video.videoID != videoID) continue;
            for (const segment of video.segments) {
              const [start, stop] = segment.segment;
              let startPosition = (start / video_obj.duration) * 100;
              let stopPosition = (stop / video_obj.duration) * 100;

              if (segment.category === "sponsor") {
                gradientStops.push(`transparent ${startPosition+0.5}%, green ${startPosition+0.5}%, green ${stopPosition}%, transparent ${stopPosition}%`);
                skipSegments.push({ start, stop });
              } else if (segment.category === "selfpromo") {
                gradientStops.push(`transparent ${startPosition}%, gold ${startPosition}%, gold ${stopPosition}%, transparent ${stopPosition}%`);
                skipSegments.push({ start, stop });
              } else if (segment.category === "poi_highlight") {
                // just 1% width red marker
                skipgradientStop.push(`transparent ${startPosition}%, red ${startPosition}%, red ${startPosition+1}%, transparent ${startPosition+1}%`);
                skipButton.style.display = "block";
                skipButton.onclick = () => { video_obj.currentTime = start; };
              }
            }
          }

          intervalId = setInterval(() => {
            if (document.querySelector('video')) {
              const gradientContainer = document.getElementById('sponsorblock-gradient');
              if ((!gradientContainer || !gradientContainer.style.backgroundImage) && gradientStops.length > 0) {
                document.getElementById('sponsorblock-gradient')?.remove();
                const newGradientContainer = document.createElement('div');
                newGradientContainer.id = 'sponsorblock-gradient';
                newGradientContainer.style.position = 'absolute';
                newGradientContainer.style.top = '45%';
                newGradientContainer.style.zIndex = '66666';
                newGradientContainer.style.left = '0';
                newGradientContainer.style.width = '100%';
                newGradientContainer.style.height = '10%';
                newGradientContainer.style.backgroundRepeat = 'no-repeat';
                newGradientContainer.style.pointerEvents = 'none';
                newGradientContainer.style.backgroundImage = `linear-gradient(to right, ${gradientStops.join(', ')})`;
                document.querySelector('div[role="slider"]')?.parentNode.appendChild(newGradientContainer);
              }
              
              const skipgradientContainer = document.getElementById('skip-gradient');
              if ((!skipgradientContainer || !skipgradientContainer.style.backgroundImage) && skipgradientStop.length > 0) {
                document.getElementById('skip-gradient')?.remove();
                const newSkipGradientContainer = document.createElement('div');
                newSkipGradientContainer.id = 'skip-gradient';
                newSkipGradientContainer.style.position = 'absolute';
                newSkipGradientContainer.style.top = '35%';
                newSkipGradientContainer.style.zIndex = '66666';
                newSkipGradientContainer.style.left = '0';
                newSkipGradientContainer.style.width = '100%';
                newSkipGradientContainer.style.height = '30%';
                newSkipGradientContainer.style.backgroundRepeat = 'no-repeat';
                newSkipGradientContainer.style.pointerEvents = 'none';
                newSkipGradientContainer.style.backgroundImage = `linear-gradient(to right, ${skipgradientStop.join(', ')})`;
                document.querySelector('div[role="slider"]')?.parentNode.appendChild(newSkipGradientContainer);
              }
              
              if (document.querySelector('.player-controls-top') && !document.querySelector('.skip-button-S')) {
                document.querySelector('.player-controls-top').insertBefore(skipButton, document.querySelector('.player-controls-top').firstChild);
              }
              
              for (const { start, stop } of skipSegments) {
                if (video_obj.currentTime >= start && video_obj.currentTime < stop - 1) {
                  video_obj.currentTime = stop;
                }
              }
            }
          }, 300);
        }).catch(err => console.error("SponsorBlock fetch failed:", err));
      }
    }
  }, 500);
})();