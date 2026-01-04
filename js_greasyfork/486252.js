// ==UserScript==
// @name         Discord Custom Styling
// @namespace    https://greasyfork.org/es/scripts/486252-discord-custom-styling/
// @version      1.3
// @description  Custom styles for Discord
// @author       sam_speak
// @match        https://discord.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486252/Discord%20Custom%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/486252/Discord%20Custom%20Styling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add CSS styles to the page
    function addStyles() {
        // Styles for NSFW labeling
        const nsfwStyle = document.createElement('style');
        nsfwStyle.innerHTML = `
            [class*=linkTop_]:has(> [class*=iconContainer__] [d^="M18.09 1.63"]) > [class*=children_]::after {
                content: "NSFW";
                background: var(--status-danger-background);
                color: var(--status-danger-text);
                padding: 0 6px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: .02em;
                line-height: 16px;
                margin-left: 4px;
            }
        `;
        document.head.appendChild(nsfwStyle);
         // Additional styles for custom scrollbar
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.innerHTML = `
            [class*="none_"]::-webkit-scrollbar {
                width: 5px;
                background: transparent;
                border: none;
            }

            [class*="none_"]::-webkit-scrollbar-thumb {
                background: #101115;
            }
        `;
        document.head.appendChild(scrollbarStyle);

        // Styles for rotating buttons
        const rotateStyle = document.createElement('style');
        rotateStyle.innerHTML = `
            button.button__4f306 {
                border-radius: 50%;
            }

            .button__4f306:last-child,
            .attachButton_b1db83 .attachButtonInner__3ce2b,
            .emojiButton__30ec7 .contents_fb6220,
            .closeButton__34341 {
                transition: transform 1s ease;
            }

            .button__4f306:last-child:hover,
            .attachButton_b1db83:hover .attachButtonInner__3ce2b,
            .emojiButton__30ec7:hover .contents_fb6220,
            .closeButton__34341:hover {
                transform: rotate(360deg);
            }
        `;
        document.head.appendChild(rotateStyle);

        // Styles for user popout customization
        const popoutStyle = document.createElement('style');
        popoutStyle.innerHTML = `
            .activityUserPopoutV2__32328:has([class^=timeBarUserPopoutV2_]) .contentImagesUserPopoutV2__04250 {
                margin-left: 22px;
            }

            .activityUserPopoutV2__32328:has([class^=timeBarUserPopoutV2_]) .contentImagesUserPopoutV2__04250 > div:first-child::before,
            .activityUserPopoutV2__32328:has([class^=timeBarUserPopoutV2_]) .contentImagesUserPopoutV2__04250 > div:nth-child(2)::before,
            .activityUserPopoutV2__32328:has([class^=timeBarUserPopoutV2_]) .contentImagesUserPopoutV2__04250 > div:nth-child(3)::before {
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-size: contain;
                padding: 7px;
                margin-left: -17px;
                margin-top: 2px;
                content: '';
                background-color: var(--header-primary);
                position: absolute;
            }

            .activityUserPopoutV2__32328:has([class^=timeBarUserPopoutV2_]) .contentImagesUserPopoutV2__04250 > div:first-child::before {
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-music-4'%3E%3Cpath d='M9 18V5l12-2v13'%3E%3C/path%3E%3Cpath d='m9 9 12-2'%3E%3C/path%3E%3Ccircle cx='6' cy='18' r='3'%3E%3C/circle%3E%3Ccircle cx='18' cy='16' r='3'%3E%3C/circle%3E%3Cline x1='12' x2='12' y1='19' y2='22'%3E%3C/line%3E%3C/svg%3E");
            }

            .activityUserPopoutV2__32328:has([class^=timeBarUserPopoutV2_]) .contentImagesUserPopoutV2__04250 > div:nth-child(2)::before {
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-mic'%3E%3Cpath d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z'%3E%3C/path%3E%3Cpath d='M19 10v2a7 7 0 0 1-14 0v-2'%3E%3C/path%3E%3Cline x1='12' x2='12' y1='19' y2='22'%3E%3C/line%3E%3C/svg%3E");
            }

            .activityUserPopoutV2__32328:has([class^=timeBarUserPopoutV2_]) .contentImagesUserPopoutV2__04250 > div:nth-child(3)::before {
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-disc-2'%3E%3Ccircle cx='12' cy='12' r='4'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='12' x2='12' y2='12.01'%3E%3C/line%3E%3C/svg%3E");
            }
        `;
        document.head.appendChild(popoutStyle);

        // Custom styles for mentions
        const mentionStyle = document.createElement('style');
        mentionStyle.innerHTML = `
            /* Make My Mention Different From Other Mentions without affecting #CHANNEL */
            .theme-dark .mentioned__58017 .mention {
                color: red !important;
            }

            .theme-dark .mention {
                color: grey;
                background-color: transparent;
            }

            /* Better Mentions Pulse (after fix) */
            .mentioned__58017 .mention {
                background-color: transparent !important;
            }
            .theme-dark .mentioned__58017 .mention {
                cursor: pointer;
                box-shadow: 0 0 0 red;
                animation: pulse 1.6s infinite;
            }

            .cozy_f5c119 .messageContent__21e69 {
                padding-top: 1px;
            }

            @-webkit-keyframes pulse {
                0% {
                    -webkit-box-shadow: 0 0 2px 2px transparent;
                }
                70% {
                    -webkit-box-shadow: 0 0 2px 2px red;
                }
                100% {
                    -webkit-box-shadow: 0 0 0 0 transparent;
                }
            }

            @keyframes pulse {
                0% {
                    -moz-box-shadow: 0 0 0 0 transparent;
                    box-shadow: 0 0 0 0 transparent;
                }
                70% {
                    -moz-box-shadow: 0 0 2px 2px red;
                    box-shadow: 0 0 2px 2px red;
                }
                100% {
                    -moz-box-shadow: 0 0 0 0 transparent;
                    box-shadow: 0 0 0 0 transparent;
                }
            }
        `;
        document.head.appendChild(mentionStyle);

        // Additional styles for sidebar and panels
        const sidebarPanelStyle = document.createElement('style');
        sidebarPanelStyle.innerHTML = `
            [class^="sidebar_"] [class^="panels_"] {
                margin-right: 5px;
                margin-bottom: 5px;
                margin-left: 5px;
                border: 1px solid var(--background-modifier-accent);
                border-radius: 20px;
                box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.45);
            }

            [class^="sidebar_"] [class^="panels_"] [class^="container_"],
            [class^="sidebar_"] [class^="panels_"] [class^="panel_"] {
                background: transparent !important;
            }

            [class^="sidebar_"] [class^="panels_"] [class^="container_"] [class^="avatarWrapper_"] + [class^="flex_"] {
                margin-left: -10px;
            }

            #vc-spotify-player {
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
            }

            /* Nitro Theme Shit */
            html.custom-theme-background [class^="sidebar_"] {
                background: var(--bg-overlay-3);
            }
            html.custom-theme-background [class^="sidebar_"] [class^="panels_"] {
                background: var(--bg-overlay-1);
            }
        `;
         // Additional styles for timestamp opacity
        const timestampOpacityStyle = document.createElement('style');
        timestampOpacityStyle.innerHTML = `
            [class*="timestamp"][class*="CompactTimeStamp"] {
                opacity: 0;
                will-change: opacity;
            }

            [class*="messageListItem"] > [class*="message"]:hover [class*="timestamp"][class*="CompactTimeStamp"] {
                opacity: 1;
            }
        `;
        document.head.appendChild(timestampOpacityStyle);
        document.head.appendChild(sidebarPanelStyle);
         // Custom styles for channel, members, dms, and settings
        const customHoverStyle = document.createElement('style');
        customHoverStyle.innerHTML = `
            .wrapper__7bcde .link__95dc0,
            .container__4f20e,
            .channel_c21703,
            .side_b4b3f6 .item__48dda {
                transition: margin-left 0.2s ease;
            }

            .wrapper__7bcde:hover .link__95dc0,
            .side_b4b3f6 .item__48dda:hover {
                margin-left: 10px;
            }

            .container__4f20e:hover,
            .channel_c21703:hover {
                margin-left: 18px;
            }
        `;
        document.head.appendChild(customHoverStyle);
         // Additional styles for user context menu
        const userContextMenuStyle = document.createElement('style');
        userContextMenuStyle.innerHTML = `
            #user-context-close-dm,
            #user-context-remove-friend,
            #user-context-block {
                color: var(--status-danger);
            }

            #user-context-close-dm:active,
            #user-context-remove-friend:active,
            #user-context-block:active {
                background-color: var(--red-500) !important;
                color: var(--white-500) !important;
            }

            #user-context-close-dm[class*="focused-"],
            #user-context-remove-friend[class*="focused-"],
            #user-context-block[class*="focused-"] {
                background-color: var(--button-danger-background);
                color: var(--white-500);
            }
        `;
        document.head.appendChild(userContextMenuStyle);


         // Additional styles for sidebar view and layer
        const customStyles = document.createElement('style');
        customStyles.innerHTML = `
            .standardSidebarView__1129a {
                top: 0 !important;
            }

            .layer__2efaa + .layer__2efaa {
                top: 48px !important;
            }

            .wrapper__7bcde:hover .sidebarRegionSidebar_2-vFDq {
                background-color: var(--background-modifier-hover);
                border-radius: 20px;
                margin-right: 5px;
            }
        `;
        const imageWrapperStyle = document.createElement('style');
        imageWrapperStyle.innerHTML = `
    [class^="imageWrapper_"] img[class^="lazyImg"] {
        object-fit: contain !important;
    }
       `;
        document.head.appendChild(imageWrapperStyle);


        document.head.appendChild(customStyles);

        // Custom styles for the text
        const textStyles = document.createElement('style');
        textStyles.innerHTML = `
            .text-xs-semibold_a3a2b4.barText__1a44f { font-size: 0px; }
            .text-xs-semibold_a3a2b4.barText__1a44f:before {
                font-size:12px;
                content: "LOOK AT THIS!";
                position: absolute;
                top: 4px;
            }
            .bar__004d9 { width: 100px; } /* adjust if needed for bar width, incase the text goes off the bar */
        `;
        document.head.appendChild(textStyles);
    }

    // Call the function to add styles when the page loads
    addStyles();
})();
