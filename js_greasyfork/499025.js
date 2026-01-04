// ==UserScript==
// @name         2013 Roblox Ban Screen (UNFINISHED)
// @namespace    http://tampermonkey.net/
// @version      1.0-alpha1
// @description  Brings back the Roblox ban (not-approved) screen layout from around 2013.
// @author       boiby
// @match        https://www.roblox.com/not-approved*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499025/2013%20Roblox%20Ban%20Screen%20%28UNFINISHED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499025/2013%20Roblox%20Ban%20Screen%20%28UNFINISHED%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // define styles
    var styles = `
        .bold-text {
            font-weight: bold !important;
            text-align: center !important;
            margin-top: 15px !important;
        }
        .additional-line {
            margin: 2px 40px 5px !important;
        }
        .no-bottom-margin {
            margin-bottom: 0 !important;
        }
        .asset-image {
            width: 250px;
            height: 250px;
            margin: 20px 40px 0;
        }
        .second-asset-image {
            width: 300px;
            height: 250px;
            margin: 0 40px 20px;
        }
    `;
    GM_addStyle(styles);

// Original stuff

GM_addStyle(`
        @font-face {
			font-family: 'Source Sans Pro';
			font-style: normal;
			font-weight: 300;
			src: local("Source Sans Pro Light"),local("SourceSansPro-Light"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-300.woff2") format("woff2"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-300.woff") format("woff"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-300.svg#SourceSansPro") format("svg");
		}
		@font-face {
			font-family: 'Source Sans Pro';
			font-style: normal;
			font-weight: 400;
			src: local("Source Sans Pro"),local("SourceSansPro-Regular"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-regular.woff2") format("woff2"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-regular.woff") format("woff"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-regular.svg#SourceSansPro") format("svg");
		}
		@font-face {
			font-family: 'Source Sans Pro';
			font-style: normal;
			font-weight: 600;
			src: local("Source Sans Pro Semibold"),local("SourceSansPro-Semibold"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-600.woff2") format("woff2"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-600.woff") format("woff"),url("//static.rbxcdn.com/fonts/source-sans-pro-v9-latin-600.svg#SourceSansPro") format("svg");
		}
    /* end of font */
}
.not-approved-punishment-details-item-row {
        font-weight: bold!important;
}
.not-approved-info-section > p:nth-child(5) > div:nth-child(1) {
        font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
}
.not-approved-info-section > p:nth-child(6) > div:nth-child(1) {
        font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
}
.not-approved-info-section > p:nth-child(7) > div:nth-child(1) {
        font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
}
.not-approved-info-section > p:nth-child(8) > div:nth-child(1) {
        font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
}
.not-approved-info-section > p:nth-child(9) > div:nth-child(1) {
        font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
}
.light-theme .content .container-main {
        background-color: white!important;
        margin-top: 40px!important;
}
#body html {
        background-color: #fff!important;
        overflow: auto!important;
        position: relative!important;
        z-index: 0!important;
        background-color: white!important;
}
@media (min-width: 992px) {
        main.container-main {
        margin-top: 40px!important;
}}
.content {
        background-color: white!important;
        color: white!important;
}
main.container-main {
        background-color: white!important;
}
not-approved-content-container {
        background-color: white!important;
}
html {
  background-color: white!important;
}
body, .text, pre {
  font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
}
    p.not-approved-punishment-details-item-row {
        font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
    }
    #not-approved-page-web-app {
        background-color: white!important;
        width: 900px!important;
        padding: 5px 0 25px 0!important;
        margin: 2% auto!important;
    }
    .not-approved-content-container {
        background-color: white!important;
        width: 560px!important;
        margin: 0 auto!important;
	    padding: 30px!important;
    }
    p.div, .not-approved-checkbox-text, .not-approved-info-section > p:nth-child(6) > div:nth-child(1) {
font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
    }
    .not-approved-content-container, .not-approved-page-content .not-approved-page .message-container .punishment-section {
        border: 1px solid black!important;
    }
    .not-approved-title {
        font-weight: bold!important;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  letter-spacing: 0;
  text-transform: uppercase;
  font-size: 16px!important;
  line-height: 1.4em;
  background-color: white;
    }
    .not-approved-page-web-app-root .not-approved-content-container .not-approved-info-section p:not(.not-approved-punishment-details-item p), .checkbox label -not-approved-punishment-details-item  {
        font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
    }
    .not-approved-page-web-app-root .not-approved-content-container .not-approved-info-section .not-approved-punishment-details {
        border: 1px solid black;
    }
    .not-approved-punishment-details {
        font-size: 14px!important;
        border: 1px solid black;
    }

    p.not-approved-punishment-details-item-row {
        font-weight: bold!important;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
    }
    p.not-approved-punishment-details-item-row > strong {
        font-weight: normal!important;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
    }
    .message-container b {
        font-weight: bold!important;
        color: black!important;
    }
    .not-approved-page-content .not-approved-page .message-container .message-section a {
        color: black!important;
    }
    .not-approved-page-content .not-approved-page .message-container .message-section a:hover {
        text-decoration: underline;
    }
    .not-approved-page .message-container > p:not(.not-approved-punishment-details-item p), #punishment-created, #moderator-note {
        margin-left: 0px!important;
    }
    .not-approved-action-section-children button, .checkbox input {
        all: revert!important;
    }
    #reactivate-button {
        margin-bottom: 10px!important;
    }
    .checkbox input {
        margin: 0px !important;
    }
    .checkbox label:before {
        display: none!important;
    }
    .checkbox label {
        padding-left: 0px!important;
    }
    .not-approved-page-content .not-approved-page .message-container .checkbox {
	    margin-bottom: -6px!important;
    }
    .not-approved-page-content .not-approved-page .action-buttons {
	    padding: 8px 0;
    }
    #navbar-robux {
        top: 0;
    }
    #rbx-body.dark-theme::before {
        display: none;
    }
    #chat-container {
        display: none;
    }
    .not-approved-punishment-details-item {
        border: 1px solid black!important;
        padding: 10px!important;
        margin-bottom: 2px!important;
    }
    strong {
        font-weight: normal!important;
  font-family: Arial, Helvetica, sans-serif;
  color: black!important;
  font-size: 12px!important;
  line-height: 1.4em!important;
  background-color: white!important;
    }
    .not-approved-page-web-app-root .not-approved-content-container .not-approved-info-section .not-approved-punishment-details {
        border: 0px solid;
        padding: 0px!important;
        margin-bottom: 12px!important;
    }
    .not-approved-punishment-details {
        border: 0px solid!important;
        padding: 0px!important;
        margin-bottom: 0px;
    }
    .not-approved-punishment-details-item > .not-approved-punishment-details-item-row:first-child {
        margin-bottom: 5px!important;
     }
    .not-approved-info-section {
        margin-bottom: 5px!important;
}
.not-approved-punishment-details-item .not-approved-punishment-details-item-row:nth-child(2) strong {
    display: block; /* Forces the strong element onto a new line */
    padding: 12px 40px 0;
.special-strong-element {
    display: block;
    margin: 0 auto;
    font-weight: bold;
}
`);

(function() {
    'use strict';

    // Function to remove footer
    function removeFooter() {
        var footer = document.querySelector('footer');
        if (footer) {
            footer.remove();
        }
    }
    // Execute functions
    removeFooter();

})();
(function() {
    'use strict';

    // Function to apply styles to strong elements based on their content
    function styleStrongElements() {
        // Select all strong elements within .not-approved-punishment-details-item-row
        var strongElements = document.querySelectorAll('.not-approved-punishment-details-item-row strong');

        // Loop through each strong element
        strongElements.forEach(function(strongElement) {
            var text = strongElement.textContent.trim();

            // Check if the text contains "Asset Version ID:" or "Asset Name"
            if (text.startsWith('Asset Version ID:') || text === 'Asset Name') {
                // Apply CSS classes to parent elements for styling
                strongElement.closest('.not-approved-punishment-details-item-row').classList.add('center-bold');
            }
        });
    }

    // Execute function on page load
    styleStrongElements();

})();
})();
// fuck you roblox for breaking everything