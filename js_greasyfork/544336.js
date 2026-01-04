// ==UserScript==
// @name        AmericanExpress Offer Automator
// @namespace   Violentmonkey Scripts
// @match       https://*americanexpress.*/*
// @grant       none
// @version     1.0.3
// @author      Yeung
// @license     MIT
// @description 11/5/2025, 11:40:00 AM
// @downloadURL https://update.greasyfork.org/scripts/544336/AmericanExpress%20Offer%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/544336/AmericanExpress%20Offer%20Automator.meta.js
// ==/UserScript==
//
//
// American Express Offer Automation Script
class AmexOfferAutomator {
    constructor() {
        this.offerButtons = [];
        this.isRunning = false;
        this.delay = 3000;
        this.currentButton = null;
        this.init();
    }

    init() {
        this.createStartButton();
        this.startMonitoring();
    }

    createStartButton() {
        this.currentButton = document.createElement('button');
        this.currentButton.textContent = 'Add all offers';
        this.currentButton.className = 'amex-offer-button';

        this.applyButtonStyles(this.currentButton);
        this.addHoverEffects(this.currentButton);
        this.currentButton.addEventListener('click', () => this.startAutomation());
        document.body.appendChild(this.currentButton);
    }

    createPauseButton() {
        const pauseButton = document.createElement('button');
        pauseButton.textContent = '⏸️ Pause automation';
        pauseButton.className = 'amex-offer-button pause';

        this.applyButtonStyles(pauseButton);
        this.addHoverEffects(pauseButton);
        pauseButton.style.backgroundColor = '#dc3545';

        pauseButton.addEventListener('mouseenter', () => {
            pauseButton.style.backgroundColor = '#c82333';
        });

        pauseButton.addEventListener('mouseleave', () => {
            pauseButton.style.backgroundColor = '#dc3545';
        });

        pauseButton.addEventListener('click', () => this.stopAutomation());
        return pauseButton;
    }

    applyButtonStyles(button) {
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
        });
    }

    addHoverEffects(button) {
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('pause')) {
                button.style.backgroundColor = '#0056b3';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('pause')) {
                button.style.backgroundColor = '#007BFF';
            }
        });
    }

    replaceButton(newButton) {
        if (this.currentButton && this.currentButton.parentNode) {
            this.currentButton.parentNode.replaceChild(newButton, this.currentButton);
        }
        this.currentButton = newButton;
    }

    findOfferButtons() {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.filter(
          btn => [
            'Add to Card',
            'Activate Offer',
            'add to list card'
          ]
          .map( t => t.toLowerCase() )
          .indexOf( btn.title ) !== -1
        );
    }

    async clickOfferButton(index) {
        if (!this.isRunning || index >= this.offerButtons.length) {
            this.isRunning = false;
            if (index >= this.offerButtons.length) {
                console.log('✅ All offers processed successfully!');
                this.showCompletionMessage();
            }
            return;
        }

        const button = this.offerButtons[index];
        console.log(`🔄 Clicking offer ${index + 1} of ${this.offerButtons.length}`);

        try {
            button.click();
            await this.sleep(this.delay);
            await this.clickOfferButton(index + 1);
        } catch (error) {
            console.error('❌ Error clicking offer button:', error);
            this.isRunning = false;
        }
    }

    async startAutomation() {
        if (this.isRunning) {
            console.log('⚠️ Automation already running...');
            return;
        }

        this.isRunning = true;
        console.log('🚀 Starting AMEX offer automation...');

        // Replace start button with pause button
        const pauseButton = this.createPauseButton();
        this.replaceButton(pauseButton);

        // Wait a bit before starting to ensure page is ready
        await this.sleep(this.delay);
        await this.processOffers();
    }

    stopAutomation() {
        this.isRunning = false;
        console.log('⏹️ Automation paused');

        // Replace pause button with resume button
        const resumeButton = this.createResumeButton();
        this.replaceButton(resumeButton);
    }

    createResumeButton() {
        const resumeButton = document.createElement('button');
        resumeButton.textContent = '▶️ Resume automation';
        resumeButton.className = 'amex-offer-button resume';

        this.applyButtonStyles(resumeButton);
        this.addHoverEffects(resumeButton);
        resumeButton.style.backgroundColor = '#28a745';

        resumeButton.addEventListener('mouseenter', () => {
            resumeButton.style.backgroundColor = '#218838';
        });

        resumeButton.addEventListener('mouseleave', () => {
            resumeButton.style.backgroundColor = '#28a745';
        });

        resumeButton.addEventListener('click', () => this.resumeAutomation());
        return resumeButton;
    }

    async resumeAutomation() {
        if (this.isRunning) {
            console.log('⚠️ Automation already running...');
            return;
        }

        this.isRunning = true;
        console.log('🔄 Resuming AMEX offer automation...');

        // Replace resume button with pause button
        const pauseButton = this.createPauseButton();
        this.replaceButton(pauseButton);

        // Continue from where we left off
        await this.processOffers();
    }

    showCompletionMessage() {
        // Replace current button with completion button
        const completionButton = document.createElement('button');
        completionButton.textContent = '✅ Completed!';
        completionButton.className = 'amex-offer-button completed';

        this.applyButtonStyles(completionButton);
        completionButton.style.backgroundColor = '#28a745';
        completionButton.style.cursor = 'default';

        // Remove hover effects for completion button
        completionButton.addEventListener('mouseenter', () => {
            completionButton.style.backgroundColor = '#28a745';
        });

        completionButton.addEventListener('mouseleave', () => {
            completionButton.style.backgroundColor = '#28a745';
        });

        this.replaceButton(completionButton);

        // Auto-remove completion button after 5 seconds
        setTimeout(() => {
            if (completionButton.parentNode) {
                completionButton.parentNode.removeChild(completionButton);
            }
        }, 5000);
    }

    async processOffers() {
        this.offerButtons = this.findOfferButtons();

        if (this.offerButtons.length === 0) {
            console.log('⏳ No offer buttons found, retrying in 3 seconds...');
            if (this.isRunning) {
                setTimeout(() => this.processOffers(), this.delay);
            }
            return;
        }

        console.log(`🎯 Found ${this.offerButtons.length} AMEX offer buttons`);
        await this.clickOfferButton(0);
    }

    startMonitoring() {
        // Monitor for dynamic content changes
        const observer = new MutationObserver(() => {
            if (!this.isRunning) {
                this.offerButtons = this.findOfferButtons();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        console.log('⏹️ Automation stopped');
    }
}

// Initialize the automator when the script loads
const amexAutomator = new AmexOfferAutomator();

// Expose to global scope for debugging
window.amexAutomator = amexAutomator;