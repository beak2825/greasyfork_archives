// ==UserScript==
// @name        YouTube 劇院模式優化 + 自動最高畫質
// @version     1.3
// @match       *://www.youtube.com/*
// @grant       none
// @description YouTube 劇院模式優化自動最高畫質
// @noframes
// @namespace https://greasyfork.org/users/735944
// @downloadURL https://update.greasyfork.org/scripts/531403/YouTube%20%E5%8A%87%E9%99%A2%E6%A8%A1%E5%BC%8F%E5%84%AA%E5%8C%96%20%2B%20%E8%87%AA%E5%8B%95%E6%9C%80%E9%AB%98%E7%95%AB%E8%B3%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/531403/YouTube%20%E5%8A%87%E9%99%A2%E6%A8%A1%E5%BC%8F%E5%84%AA%E5%8C%96%20%2B%20%E8%87%AA%E5%8B%95%E6%9C%80%E9%AB%98%E7%95%AB%E8%B3%AA.meta.js
// ==/UserScript==

// Cache for scrollbar width
const getScrollbarWidth = (() => {
    let width = null;
    return () => {
        if (width === null) {
            const dummy = document.createElement('div');
            dummy.style.cssText = 'overflowY:scroll;visibility:hidden;position:absolute;';
            document.body.appendChild(dummy);
            width = dummy.offsetWidth - dummy.clientWidth + 1;
            dummy.remove();
        }
        return width;
    };
})();

// Theater mode optimization
const applyTheaterMode = (() => {
    let style = null;
    let isCurrentlyTheater = false;
    
    return () => {
        const theaterElement = document.querySelector('ytd-watch-flexy');
        const isTheaterMode = theaterElement?.isTheater_();
        
        // Only update if theater mode state has changed
        if (isTheaterMode !== isCurrentlyTheater) {
            isCurrentlyTheater = isTheaterMode;
            
            if (isTheaterMode && !style) {
                style = document.createElement('style');
                style.id = 'theater-mode-style';
                style.textContent = `
                    ytd-page-manager { margin: 0 !important; }
                    #full-bleed-container {
                        min-height: 100vh !important;
                        min-width: calc(100vw - ${getScrollbarWidth()}px) !important;
                    }
                    #masthead-container {
                        transition: top 0.3s;
                        position: fixed;
                        width: 100%;
                        top: -56px;
                        z-index: 1000;
                    }
                    .ytp-fullerscreen-edu-button { display: none !important; }
                `;
                document.head.appendChild(style);
            } else if (!isTheaterMode && style) {
                style.remove();
                style = null;
            }
        }
    };
})();

// Optimized scroll handler with throttling
let lastScrollY = window.scrollY;
let ticking = false;

const handleScroll = () => {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
            const masthead = document.getElementById('masthead-container');
            if (masthead) {
                masthead.style.top = window.scrollY > lastScrollY ? '0' : '-56px';
            }
            lastScrollY = window.scrollY;
            ticking = false;
        });
    }
};

// More efficient event listener setup
const setupEventListeners = () => {
    // Scroll event
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Wheel event - only if needed
    document.addEventListener('wheel', (e) => {
        if (document.body.classList.contains('no-scroll')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Navigation event
    document.addEventListener('yt-navigate-finish', () => {
        applyTheaterMode();
        setHighestQuality();
    });
};

// More targeted MutationObserver for theater mode
const setupTheaterModeObserver = () => {
    const targetNode = document.querySelector('ytd-watch-flexy') || document.body;
    const observer = new MutationObserver((mutations) => {
        // Check if any of the mutations are relevant to theater mode
        for (const mutation of mutations) {
            if (mutation.attributeName === 'theater' || 
                mutation.type === 'childList' && 
                (mutation.target.id === 'player-container' || mutation.target.id === 'content')) {
                applyTheaterMode();
                return; // No need to process further
            }
        }
    });
    
    observer.observe(targetNode, {
        attributes: true,
        attributeFilter: ['theater', 'class'],
        childList: true,
        subtree: true
    });
};

// Add button function - with optimization
const addButton = () => {
    const titleElement = document.querySelector('h1.style-scope.ytd-watch-metadata');
    if (titleElement && !titleElement.querySelector('.go-to-youtube-btn')) {
        const button = document.createElement('button');
        button.textContent = 'Go to YouTube';
        button.className = 'go-to-youtube-btn';
        
        // Apply styles all at once for better performance
        button.style.cssText = 'margin-left:10px;padding:10px 20px;background-color:#ff0000;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:14px;box-shadow:0 4px 6px rgba(0,0,0,0.1);transition:background-color 0.3s,transform 0.3s;';
        
        // Event delegation to reduce listeners
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#cc0000';
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#ff0000';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => window.location.href = 'https://www.youtube.com/');
        
        titleElement.appendChild(button);
        return true; // Button added
    }
    return false; // Button not added
};

// Try to add button with retry mechanism instead of arbitrary timeout
const setupButtonWithRetry = () => {
    let attempts = 0;
    const maxAttempts = 5;
    
    const tryAddButton = () => {
        if (attempts >= maxAttempts) return;
        
        if (!addButton()) {
            attempts++;
            setTimeout(tryAddButton, Math.min(1000 * attempts, 3000)); // Exponential backoff
        }
    };
    
    // Start trying after page navigation
    document.addEventListener('yt-navigate-finish', () => {
        if (window.location.href.includes('/watch?v=')) {
            attempts = 0;
            setTimeout(tryAddButton, 500); // Initial delay
        }
    });
};

// Optimize highest quality selection
const setHighestQuality = () => {
    if (!window.location.href.includes('/watch?v=')) return;
    
    const checkAndSetQuality = () => {
        const moviePlayer = document.querySelector('#movie_player');
        if (moviePlayer && typeof moviePlayer.getAvailableQualityLevels === 'function') {
            const qualities = moviePlayer.getAvailableQualityLevels();
            if (qualities && qualities.length > 0) {
                const maxRes = qualities[0];
                moviePlayer.setPlaybackQualityRange(maxRes);
                return true;
            }
        }
        return false;
    };
    
    // Try immediately
    if (checkAndSetQuality()) return;
    
    // If not successful, set up a more targeted observer
    const videoContainer = document.querySelector('#player-container');
    if (!videoContainer) return;
    
    const observer = new MutationObserver(() => {
        if (checkAndSetQuality()) {
            observer.disconnect();
        }
    });
    
    observer.observe(videoContainer, { 
        childList: true, 
        subtree: true 
    });
    
    // Safety timeout to disconnect observer after 10 seconds
    setTimeout(() => observer.disconnect(), 10000);
};

// Initialize everything
const init = () => {
    setupEventListeners();
    setupTheaterModeObserver();
    setupButtonWithRetry();
    applyTheaterMode(); // Initial check
    
    // Add CSS for elements that are always hidden
    const css = document.createElement("style");
    css.innerText = ".ytp-fullerscreen-edu-button { display: none !important; }";
    document.head.appendChild(css);
};

// Start the script after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}