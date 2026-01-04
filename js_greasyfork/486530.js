// ==UserScript==
// @name         Stop all videos
// @namespace    Stop all videos
// @version      1.2
// @description  Stops all videos on the page
// @author       Nameniok
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486530/Stop%20all%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/486530/Stop%20all%20videos.meta.js
// ==/UserScript==

(function() {
const config = {
        blockVideoPreload: true,      // Stop video loading
        blockAutoplay: true,          // Stop automatic playback
        addControls: true,            // Add controls to videos
        initialHidden: false,          // Initially hide videos
        showOnPause: false,            // Show videos on pause
        muteAllVideos: true,          // Mute all videos
        blockedExtensions: ['.mp4', '.webm'],  // Blocked extensions
        useIntersectionObserver: false // Use Intersection Observer for video visibility (autoplaing videos on scroll, false to disable, false is better but may cause problems)
    };

    function stopAndDisablePreload(video) {
        video.pause();
        video.removeAttribute('preload');
      console.log('runned stopAndDisablePreload');
    }

    function stopAndDisablePreloadForAllVideos() {
        Array.from(document.querySelectorAll('video')).forEach(video => {
            stopAndDisablePreload(video);
            removeAutoplayAttribute(video);
            addControlsAttribute(video);
            addCanPlayListener(video);
          console.log('runned stopAndDisablePreloadForAllVideos');

            if (config.initialHidden) {
                video.style.visibility = 'hidden';
            }

            video.addEventListener('loadedmetadata', () => {
                stopAndDisablePreload(video);
                removeAutoplayAttribute(video);
                addControlsAttribute(video);
                addCanPlayListener(video);
              console.log('runned stopAndDisablePreloadForAllVideos loadedmetadata');
            });
        });
    }

    function addCanPlayListener(video) {
        video.addEventListener('canplay', () => {
            stopAndDisablePreload(video);
            removeAutoplayAttribute(video);
            addControlsAttribute(video);
          console.log('runned addCanPlayListener canplay');
            if (config.initialHidden) {
                video.style.visibility = 'visible';
            }
        }, { once: true });

        video.addEventListener('loadedmetadata', () => {
            stopAndDisablePreload(video);
            removeAutoplayAttribute(video);
            addControlsAttribute(video);
          console.log('runned addCanPlayListener loadedmetadata');
            if (config.initialHidden) {
                video.style.visibility = 'visible';
            }
        }, { once: true });

        video.addEventListener('pause', () => {
            if (config.showOnPause) {
                video.style.visibility = 'visible';
            }
        });
    }

    function removeAutoplayAttribute(video) {
        if (config.blockAutoplay) {
            video.removeAttribute('autoplay');
            video.removeEventListener('play', preventAutoplay);
            video.addEventListener('play', preventAutoplay, { once: true });
            console.log('runned removeAutoplayAttribute');
        }
    }

    function addControlsAttribute(video) {
    if (config.addControls) {
        video.setAttribute('controls', 'true');
        console.log('runned addControlsAttribute');

        if (config.muteAllVideos) {
            video.setAttribute('muted', 'true');
        }
    }
}

    function preventAutoplay(event) {
        event.preventDefault();
        event.stopPropagation();
      console.log('runned preventAutoplay event');
    }

    function hasBlockedExtension(source) {
    return source && config.blockedExtensions.some(extension => source.endsWith(extension));
}

    function observeVideos(mutationsList) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName && node.tagName.toLowerCase() === 'video') {
                        if (config.blockVideoPreload) {
                            stopAndDisablePreload(node);
                          console.log('runned blockVideoPreload mutationobserver');
                        }
                        if (config.blockAutoplay) {
                            removeAutoplayAttribute(node);
                            addControlsAttribute(node);
                            addCanPlayListener(node);
                          console.log('runned blockAutoplay mutationobserver');

                            const videoSource = node.getAttribute('src');
                            if (hasBlockedExtension(videoSource)) {
                                node.pause();
                                stopAndDisablePreload(node);
                                removeAutoplayAttribute(node);
                                console.log('Blocked video with source:', videoSource);
                                return;
                              console.log('runned hasBlockedExtension mutationobserver');
                            }
                        }
                        if (config.initialHidden) {
                            node.style.visibility = 'hidden';
                        }
                        observeVideoVisibility(node);
                    } else if (node.querySelectorAll) {
                        Array.from(node.querySelectorAll('video')).forEach(video => {
                            if (config.blockVideoPreload) {
                                stopAndDisablePreload(video);
                              console.log('runned blockVideoPreload2 mutationobserver');
                            }
                            if (config.blockAutoplay) {
                                removeAutoplayAttribute(video);
                                addControlsAttribute(video);
                                addCanPlayListener(video);
                              console.log('runned blockAutoplay2 mutationobserver');

                                const videoSource = video.getAttribute('src');
                                if (hasBlockedExtension(videoSource)) {
                                    video.pause();
                                    stopAndDisablePreload(video);
                                    removeAutoplayAttribute(video);
                                    configureVideoPreloadAndAutoplay();
                                    console.log('Blocked video with source:', videoSource);
                                    return;
                                  console.log('runned hasBlockedExtension2 mutationobserver');
                                }
                            }
                            if (config.initialHidden) {
                                video.style.visibility = 'hidden';
                            }
                            observeVideoVisibility(video);
                        });
                    }
                });
            }
        });
    }


    function observeVideoVisibility(video) {
    if (!config.useIntersectionObserver) {
        return; // Skip observation if not configured to use Intersection Observer
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(error => { // change "video.play()" to "video.pause()" if you want
                });
            } else {
                // Video is out of view, pause
                video.pause();
            }
        });
    });

    observer.observe(video);
}

    function initObserver() {
    const observer = new MutationObserver(observeVideos);
    const targetNode = document.documentElement;

    const observerConfig = {
        childList: true,
        subtree: true
    };
    observer.observe(targetNode, observerConfig);
}
document.addEventListener("DOMContentLoaded", function() {
        stopAndDisablePreloadForAllVideos();
        initObserver();
    });
        stopAndDisablePreloadForAllVideos();
        initObserver();
}


)();