// ==UserScript==
// @namespace    Xortrox/UserScripts/AutomatedElementTextNotifier
// @name         UserScript Automated Element Text Notifier
// @version      0.7
// @description  This script is intended to work with @require only. Provides class AutomatedElementTextNotifier
// @author       Xortrox,
// @match        *
// @esversion:   6
// @license MIT
// ==/UserScript==

class AutomatedElementTextNotifier {
    constructor(options) {
        this.icon = options.icon || '';
        this.title = options.title || 'No Title Specified';

        this.selector = options.selector;

        /** How frequently to scan for changes on the website (in milliseconds) */
        this.notificationInterval = options.interval;


        /**
         * Every includes/excludes does a check for selector matched element's "innerText" value
         * Each entry will be checked in priority from top to bottom and only the first match will send its notification
         * All configs must have an includes entry, while exclusion is optional.
         * */
        this.scanConfiguration = options.config;

        if (!this.selector) {
            this.error('Error: No selector specified for AutomatedElementTextNotifier');
        }
    }

    async init() {
        await window.UserScript.Notifications.askPermission();

        this.interval = setInterval(this.scan, this.notificationInterval);
    }

    scan = () => {
        const notificationElements = document.querySelectorAll(this.selector);

        /** We send notification only once if any adventures are claimable */
        if (notificationElements && notificationElements.length > 0) {
            let notified = false;

            for (let element of notificationElements) {
                if (notified) {
                    break;
                }

                const text = element.innerText;

                const textLower = text.toLowerCase();

                for (const config of this.scanConfiguration) {
                    let includesText = false;
                    let excludesText = false;

                    for (const includeText of config.includes) {
                        if (textLower.includes(includeText)) {
                            includesText = true;
                            break;
                        }
                    }

                    if (config.excludes?.length > 0) {
                        for (const excludeText of config.excludes) {
                            if (!textLower.includes(excludeText)) {
                                excludesText = true;
                                break;
                            }
                        }
                    }

                    let canShowNotification = includesText;

                    if (config.excludes?.length > 0) {
                        canShowNotification = canShowNotification && excludesText;
                    }

                    if (canShowNotification) {
                        window.UserScript.Notifications.notify(this.title, config.notificationText, this.icon);
                        notified = true;
                        break;
                    }
                }
            }
        }
    }

    error(error) {
        alert(error);
        console.error(new Error(error));
    }
}