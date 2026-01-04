// ==UserScript==
// @name        Reddit Chat Anonymizer
// @namespace   Violentmonkey Scripts
// @match       https://chat.reddit.com/room*
// @grant       none
// @version     1.0.2
// @author      AveTrue
// @license GNU General Public License v3.0 
// @description A privacy-focused userscript that locally modifies Reddit chat to enhance anonymity by removing usernames and avatars
// @downloadURL https://update.greasyfork.org/scripts/521161/Reddit%20Chat%20Anonymizer.user.js
// @updateURL https://update.greasyfork.org/scripts/521161/Reddit%20Chat%20Anonymizer.meta.js
// ==/UserScript==

class RedditChatAnonymizer {
    constructor() {
        this.intervalId = null;
        this.isEnabled = localStorage.getItem('redditChatAnonymizerEnabled') !== 'false';
        this.PLACEHOLDER_AVATAR = 'https://www.ledr.com/colours/black.jpg';
        this.INSPECTION_INTERVAL = 50; // milliseconds
        this.INITIALIZATION_DELAY = 2000; // milliseconds
    }

    createToggleButton() {
        const button = document.createElement('button');
        this.updateButtonState(button);
        
        const styles = {
            position: 'fixed',
            top: '10px',
            right: '100px',
            zIndex: '10000',
            padding: '8px 16px',
            backgroundColor: '#1a1a1b',
            color: '#d7dadc',
            border: '1px solid #343536',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '14px'
        };
        
        Object.assign(button.style, styles);
        button.addEventListener('click', () => this.toggleAnonymizer(button));
        document.body.appendChild(button);
    }

    updateButtonState(button) {
        button.textContent = `Anonymizer: ${this.isEnabled ? 'ON' : 'OFF'}`;
    }

    toggleAnonymizer(button) {
        this.isEnabled = !this.isEnabled;
        localStorage.setItem('redditChatAnonymizerEnabled', this.isEnabled);
        this.updateButtonState(button);

        if (this.isEnabled) {
            this.startTimelineEventInspection();
        } else {
            this.cleanup();
        }
    }

    startTimelineEventInspection() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.inspectTimelineEvents(), this.INSPECTION_INTERVAL);
    }

    cleanup() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            window.location.reload();
        }
    }

    getCurrentUsername() {
        try {
            // Try multiple selector patterns for current username
            const rsApp = document.querySelector('rs-app');
            if (rsApp) {
                const curUser = rsApp.querySelector('rs-current-user');
                if (curUser) {
                    return curUser.getAttribute('display-name');
                }
            }
            
            // Try new structure
            const userElement = document.querySelector('.current-user-name') ||
                              document.querySelector('.username-display');
            return userElement?.textContent?.trim();
            
        } catch (error) {
            console.debug('Error getting current username:', error);
            return null;
        }
    }

    getTimelineEvents() {
        const rsApp = document.querySelector('rs-app');
        const overlayManager = rsApp?.shadowRoot?.querySelector('rs-room-overlay-manager');
        const rsRoom = overlayManager?.querySelector('rs-room');
        const timeline = rsRoom?.shadowRoot?.querySelector('rs-timeline');
        const virtualScroll = timeline?.shadowRoot?.querySelector('rs-virtual-scroll-dynamic');
        return virtualScroll?.shadowRoot?.querySelectorAll('rs-timeline-event') || [];
    }

    anonymizeAvatar(avatar) {
        if (!avatar) return;
        
        avatar.src = this.PLACEHOLDER_AVATAR;
        avatar.setAttribute('href', this.PLACEHOLDER_AVATAR);
        avatar.onload = () => avatar.dispatchEvent(new CustomEvent('render', { bubbles: true }));
    }

    anonymizeEvent(event, currentUsername) {
        try {
            // First try the old structure
            let nameSpan = event.shadowRoot.querySelector('rs-timeline-event-hovercard-display-name span');
            
            // If that fails, try the new structure
            if (!nameSpan) {
                const messageContainer = event.shadowRoot.querySelector('.message-container');
                if (messageContainer) {
                    nameSpan = messageContainer.querySelector('.username-text');
                }
            }
            
            // If we found a name span and it's not the current user
            if (nameSpan && nameSpan.textContent !== currentUsername) {
                nameSpan.textContent = '';
                
                // Try multiple avatar selector patterns
                const avatar = 
                    event.shadowRoot.querySelector('.avatar-image') ||
                    event.shadowRoot.querySelector('image') ||
                    event.shadowRoot.querySelector('img') ||
                    event.shadowRoot.querySelector('.user-avatar img');
                    
                this.anonymizeAvatar(avatar);
            }
            
        } catch (error) {
            console.debug('Error in anonymizeEvent:', error, 
                         '\nEvent:', event, 
                         '\nShadowRoot content:', event.shadowRoot?.innerHTML);
        }
    }

    inspectTimelineEvents() {
        if (!this.isEnabled) return;
        
        const currentUsername = this.getCurrentUsername();
        const timelineEvents = this.getTimelineEvents();
        
        timelineEvents.forEach(event => {
            this.anonymizeEvent(event, currentUsername);
        });
    }

    initialize() {
        setTimeout(() => {
            this.createToggleButton();
            if (this.isEnabled) this.startTimelineEventInspection();
        }, this.INITIALIZATION_DELAY);
    }
}

// Initialize the anonymizer
const anonymizer = new RedditChatAnonymizer();
anonymizer.initialize();