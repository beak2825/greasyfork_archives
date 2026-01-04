// ==UserScript==
// @name Live Chat on YouTube Mobile
// @author Adam Jensen
// @version 1.3.3
// @description Integrates the live chat into the mobile version of YouTube
// @match https://m.youtube.com/*
// @grant none
// @namespace https://greasyfork.org/en/scripts/519614-live-chat-on-youtube-mobile
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519614/Live%20Chat%20on%20YouTube%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/519614/Live%20Chat%20on%20YouTube%20Mobile.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // CONFIGURATION 
    const AUTO_HIDE_CHAT_BUTTON = false; // If true, the button only appears when a Live/Premiere is detected
    const AUTO_SHOW_CHAT = false; // If true, the chat automatically opens when a Live/Premiere loads.
 
    let currentVideoId = null, isIframeLoaded = false, observer = null, previousWidth = window.innerWidth, isChatVisible = false, iframeLoadTimeout = null, iframeLoadFailed = false;
    const elements = {};
 
    const isVideoPage = () => window.location.pathname === '/watch' && window.location.search.includes('v=');
    const getVideoId = () => (window.location.search.match(/v=([^&]+)/) || [])[1];
    const isPortraitOrientation = () => window.innerHeight > window.innerWidth;
    
    const isLiveOrPremiere = () => {
        if (!AUTO_HIDE_CHAT_BUTTON) {
            return true;
        }
 
        const infoContainer = elements.infoContainer;
        if (infoContainer) {
            const content = infoContainer.textContent || '';
            return content.toLowerCase().includes('watching now') 
                || content.toLowerCase().includes('personas mirando ahora')
                || content.toLowerCase().includes('usuarios viéndolo ahora')
                || content.toLowerCase().includes('viewing now')
                || content.includes('人正在观看')
                || content.includes('人正在觀看')
                || content.includes('人が視聴中')
                || content.toLowerCase().includes('a ver agora')
                || content.toLowerCase().includes('assistindo agora')
                || content.toLowerCase().includes('spettatori attuali');
        }
        return false;
    };
 
    const showErrorMessage = () => {
        elements.loader.style.display = 'none';
        elements.errorContainer.style.display = 'flex';
        iframeLoadFailed = true;
    };

    const hideErrorMessage = () => {
        elements.errorContainer.style.display = 'none';
        iframeLoadFailed = false;
    };
    const showLoader = (darkbackground = '#111') => {
        elements.loader.style.display = 'block';
        elements.chatIframe.style.opacity = '0';
        elements.chatContainer.style.backgroundColor = darkbackground;
    };
 
    const hideLoader = () => {
        elements.loader.style.display = 'none';
        elements.chatIframe.style.opacity = '1';
        elements.chatContainer.style.backgroundColor = '#333';
    };
 
    const updateChatPosition = () => {
        const videoPlayer = elements.videoPlayer;
        if (videoPlayer && videoPlayer.clientHeight > 0) {
            const videoRect = videoPlayer.getBoundingClientRect();
            const isVerticalVideo = videoRect.height > videoRect.width && videoRect.height > 100;
            elements.chatContainer.style.top = isVerticalVideo ? '50%' : `${videoRect.bottom}px`;
            elements.chatContainer.style.height = isVerticalVideo ? '50%' : 'auto';
            elements.chatContainer.style.bottom = '0';
        } else {
            elements.chatContainer.style.top = '250px';
            elements.chatContainer.style.height = 'auto';
        }
    };
 
    const setButtonVisibility = (visible) => {
        elements.button.style.display = (visible && isPortraitOrientation() && isLiveOrPremiere()) ? 'block' : 'none';
    };
 
    const closeChat = () => {
        if (elements.chatContainer.style.display !== 'none') {
            hideErrorMessage();
            elements.chatContainer.style.display = 'none';
            elements.button.innerText = '💬';
            document.body.classList.remove('chat-open-no-scroll');
            isChatVisible = false;
        }
    };
    
    const showChat = () => { 
        updateChatPosition();
        elements.chatContainer.style.display = 'block';
        document.body.classList.add('chat-open-no-scroll');
        elements.button.innerText = '✖️';
        isChatVisible = true;

        if (iframeLoadFailed) {
            showErrorMessage();
        } else if (!isIframeLoaded) {
            showLoader();
        } else {
            hideLoader();
        }
        elements.chatIframe.focus();
    };
 
    const toggleChat = () => {
        if (elements.button.style.display === 'none') return;
        
        if (!isChatVisible) {
            showChat();
        } else {
            closeChat();
        }
    };
 
    const preloadChatIframe = () => {
        const videoId = getVideoId();
        
        if (isVideoPage() && videoId && isLiveOrPremiere() && videoId !== currentVideoId) {
            currentVideoId = videoId;
            isIframeLoaded = false;
            iframeLoadFailed = false;
            hideErrorMessage();
            clearTimeout(iframeLoadTimeout);
            
            elements.chatIframe.style.opacity = '0'; 
            
            const newChatSrc = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}`;
            elements.chatIframe.src = newChatSrc;
            iframeLoadTimeout = setTimeout(() => {
                iframeLoadFailed = true;
                if (isChatVisible) showErrorMessage();
            }, 20000);
            
        } else if (videoId === currentVideoId && isIframeLoaded) {
             setButtonVisibility(true);
        }
    };
 
 
    const updateDOMElementsCache = () => {
        elements.videoPlayer = document.querySelector('.player-container');
        elements.infoContainer = document.querySelector('.slim-video-information-content');
    };
 
    const handlePageAndVideoState = () => {
        const onVideoPage = isVideoPage();
        const newVideoId = getVideoId();
        
        if (onVideoPage && newVideoId !== currentVideoId) {
            updateDOMElementsCache();
            preloadChatIframe(); 
            hideErrorMessage();
            
            if (AUTO_SHOW_CHAT && isPortraitOrientation() && isLiveOrPremiere()) {
                showChat();
            }
 
        } else if (!onVideoPage) {
            elements.videoPlayer = null;
            elements.infoContainer = null;
            currentVideoId = null;
            isIframeLoaded = false;
            iframeLoadFailed = false;
            elements.chatIframe.src = '';
        }
        
        setButtonVisibility(onVideoPage);
 
        if (!onVideoPage) {
            closeChat();
        } else if (isChatVisible) {
            if (newVideoId && newVideoId !== currentVideoId) {
                closeChat(); 
            } else if (!isPortraitOrientation() || !isLiveOrPremiere()) {
                closeChat();
            } else {
                updateChatPosition(); 
            }
        }
    };
 
    const createUIElements = () => {
        elements.button = document.createElement('button');
        Object.assign(elements.button.style, {
            position: 'fixed', bottom: '64px', right: '20px', zIndex: '9999', padding: '10px',
            backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: '50%',
            width: '45px', height: '45px', fontSize: '20px', lineHeight: '0',
            boxShadow: '0 3px 6px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'none'
        });
        elements.button.innerText = '💬';
        document.body.appendChild(elements.button);
 
        elements.chatContainer = document.createElement('div');
        Object.assign(elements.chatContainer.style, {
            display: 'none', position: 'fixed', width: '100%', top: '250px', bottom: '0',
            height: 'auto', left: '0', right: '0', borderTop: '1px solid #555',
            backgroundColor: '#333', zIndex: '9998', overflow: 'hidden'
        });
        document.body.appendChild(elements.chatContainer);
 
        elements.chatIframe = document.createElement('iframe');
        Object.assign(elements.chatIframe.style, {
            width: '100%', height: '100%', border: 'none', maxWidth: '100%', opacity: '0'
        });
        elements.chatContainer.appendChild(elements.chatIframe);
 
        elements.loader = document.createElement('div');
        Object.assign(elements.loader.style, {
            border: '4px solid #555', borderTop: '4px solid #ff0000', borderRadius: '50%',
            width: '30px', height: '30px', animation: 'spin 1s linear infinite',
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: '10000', display: 'none'
        });
        elements.chatContainer.appendChild(elements.loader);
 
        elements.errorContainer = document.createElement('div');
        Object.assign(elements.errorContainer.style, {
            display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', color: '#fff'
        });
        elements.chatContainer.appendChild(elements.errorContainer);

        const errorMessage = document.createElement('p');
        errorMessage.innerText = 'Error loading chat.';
        elements.errorContainer.appendChild(errorMessage);

        elements.retryButton = document.createElement('button');
        elements.retryButton.innerText = 'Retry';
        Object.assign(elements.retryButton.style, {
            padding: '10px 20px', backgroundColor: '#ff0000', color: '#fff',
            border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px'
        });
        elements.errorContainer.appendChild(elements.retryButton);



        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `@keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } } .chat-open-no-scroll { overflow: hidden !important; position: fixed !important; width: 100% !important; height: 100% !important; }`;
        document.head.appendChild(styleSheet);
    };
 
    const updateButtonSize = () => {
        if (!elements.button) return;
        const buttonSize = Math.max(45, Math.min(60, Math.min(window.innerWidth, window.innerHeight) * 0.12));
        const fontSize = buttonSize * 0.45;
        elements.button.style.width = `${buttonSize}px`;
        elements.button.style.height = `${buttonSize}px`;
        elements.button.style.fontSize = `${fontSize}px`;
    };

    const initializeObserver = () => {
        const targetNode = document.querySelector('body'); 
        if (targetNode) {
            observer = new MutationObserver(() => setTimeout(handlePageAndVideoState, 100));
            observer.observe(targetNode, { childList: true, subtree: true });
        }
 
        window.addEventListener('popstate', handlePageAndVideoState);
        window.addEventListener('resize', () => {
            const isRotationDetected = window.innerWidth !== previousWidth;
            updateButtonSize();
            if (isRotationDetected) {
                handlePageAndVideoState();
            }
            else if (isChatVisible) updateChatPosition();
            previousWidth = window.innerWidth;
        });
        handlePageAndVideoState();
    };
 
    const initialize = () => {
        if (window.self !== window.top) return;
        createUIElements();
        updateButtonSize();
        
        updateDOMElementsCache(); 
        
        elements.button.addEventListener('click', toggleChat);

        elements.retryButton.addEventListener('click', () => {
            hideErrorMessage();
            showLoader();
            preloadChatIframe();
        });
        
        elements.chatIframe.onload = () => { 
            if (iframeLoadFailed) return;
            if (elements.chatIframe.contentDocument && elements.chatIframe.contentDocument.querySelector('sub-frame-error-details')) {
                showErrorMessage();
                return;
            }

            clearTimeout(iframeLoadTimeout);
            hideErrorMessage();
            isIframeLoaded = true; 
            
            if (isChatVisible) hideLoader(); 
            setButtonVisibility(onVideoPage);
        };
        
        preloadChatIframe(); 
        
        initializeObserver();
    };
 
    initialize();
})();