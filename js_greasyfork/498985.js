// ==UserScript==
// @name          Customized Youtube
// @description	  Custom Backrounds, Transparent objects, Youtube Converter Button, NyanProgressBar
// @namespace     https://sekuji.xyz
// @author        sekuji | url: sekuji.xyz
// @run-at        document-start
// @version       1.1.2
// @grant         GM_xmlhttpRequest
// @license       GPL-3.0-or-later
// @icon          https://www.svgrepo.com/show/134513/youtube.svg
// @match         *://*.youtube.com/*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498985/Customized%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/498985/Customized%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_BODY_BACKGROUND = 'https://res.cloudinary.com/dk5jbudni/image/upload/v1719409306/yt-bg_phrrfb.png';
    const DEFAULT_CHAT_BACKGROUND = 'https://res.cloudinary.com/dk5jbudni/image/upload/v1719409306/yt-bg_phrrfb.png';
    const youtubeUrlRegex = /^https?:\/\/www\.youtube\.com\/(?!my_videos|ad_companion|subscribe_embed|account|yt|red).*$/;

    const youtubeStyles = `
        body {
            background: url(${DEFAULT_BODY_BACKGROUND}) no-repeat !important;
            background-size: cover !important;
            background-attachment: fixed !important;
        }
        body::before {
            content: '' !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
            z-index: -1 !important;
        }
        .style-scope.yt-live-chat-renderer.iron-selected {
            position: relative;
            background: url(${DEFAULT_CHAT_BACKGROUND}) no-repeat !important;
            background-size: cover !important;
            background-attachment: fixed !important;
        }
        .style-scope.yt-live-chat-renderer.iron-selected::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 0;
            pointer-events: none;
        }
        .style-scope.yt-live-chat-renderer.iron-selected > * {
            position: relative;
            z-index: 1;
        }
        div#banner-container {
            background-color: rgba(255,255,255,0.75) !important;
            border-radius: 15px !important;
        }
        .sbdd_b {
            border: 1px rgba(0, 0, 0, 0.35) solid !important;
            backdrop-filter: blur(15px) !important;
            background-color: rgba(0, 0, 0, 0.35) !important;
        }
        #container.ytd-searchbox, #search-icon-legacy.ytd-searchbox {
            border: 1px rgba(0, 0, 0, 0.35) solid !important;
            background-color: rgba(0, 0, 0, 0.35) !important;
        }
        ytd-multi-page-menu-renderer.style-scope.ytd-popup-container {
            border: 1px rgba(0, 0, 0, 0.35) solid !important;
            background-color: rgba(0, 0, 0, 0.15) !important;
        }
        #background.ytd-masthead {
            background: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(10px) !important;
        }
        yt-chip-cloud-chip-renderer.style-scope.ytd-feed-filter-chip-bar-renderer {
            backdrop-filter: blur(10px) !important;
        }
        #guide-content.ytd-app {
            background: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(10px) !important;
        }
        ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer:after, #left-arrow.ytd-feed-filter-chip-bar-renderer:after {
            background: unset !important;
        }
        ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer:before, #right-arrow.ytd-feed-filter-chip-bar-renderer:before {
            background: unset !important;
        }
        ytd-menu-popup-renderer {
            border: 1px rgba(0, 0, 0, 0.35) solid !important;
            background-color: rgba(0, 0, 0, 0.15) !important;
        }
        .yt-spec-icon-badge-shape--style-overlay .yt-spec-icon-badge-shape__badge {
            border: unset !important;
        }
        :not(.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge):not(.sbdd_b):not(#container.ytd-searchbox, #search-icon-legacy.ytd-searchbox):not(ytd-menu-popup-renderer):not(ytd-multi-page-menu-renderer.style-scope.ytd-popup-container):not(tp-yt-paper-dialog):not(.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal):not(.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled):not(#description.ytd-watch-metadata):not(yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT], yt-chip-cloud-chip-renderer[chip-style=STYLE_HOME_FILTER], yt-chip-cloud-chip-renderer[chip-style=STYLE_COLOR_RED], yt-chip-cloud-chip-renderer[chip-style=STYLE_COLOR_GREEN], yt-chip-cloud-chip-renderer[chip-style=STYLE_COLOR_BLUE], yt-chip-cloud-chip-renderer[chip-style=STYLE_REFRESH_TO_NOVEL_CHIP]):not(#background.ytd-masthead):not(yt-chip-cloud-chip-renderer.style-scope.ytd-feed-filter-chip-bar-renderer):not([class*="video-extras-sparkbar"]):not([class^="ytp-"]):not(.sidebar):not(.video-time):not([class^="html5-"]):not(.yt-uix-button-primary):not(label):not(.toggle):not(.branding-context-container-inner):not(.iv-drawer):not(yt-live-chat-author-chip):not(div#banner-container):not(.notification-popup):not(#settingsButton) {
            background-color: transparent !important;
        }
    `;

    const popupHTML = `
        <div id="settingsPopup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(30, 30, 30, 0.95) !important; color: #fff !important; padding: 30px; border: 1px solid #444; border-radius: 15px; z-index: 1000; font-family: Arial, sans-serif; max-width: 400px; width: 100%;">
            <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 20px; text-align: center;">Settings</h3>
            <div style="margin-bottom: 15px;">
                <label for="backgroundUrl" style="display: block; margin-bottom: 5px;">Background Image URL for Body:</label>
                <input type="text" id="backgroundUrl" style="width: 100%; padding: 8px; background: rgba(60, 60, 60, 0.8) !important; color: #fff; border-radius: 5px; border: 1px solid #555;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="chatBackgroundUrl" style="display: block; margin-bottom: 5px;">Background Image URL for Chat:</label>
                <input type="text" id="chatBackgroundUrl" style="width: 100%; padding: 8px; background: rgba(60, 60, 60, 0.8) !important; color: #fff; border-radius: 5px; border: 1px solid #555;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: inline-flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="enableProgressBar" style="margin-right: 10px;">
                    <span>Enable NyanProgressBar</span>
                </label>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: inline-flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="enableDownloadButton" style="margin-right: 10px;">
                    <span>Enable Download Button</span>
                </label>
            </div>
            <div style="text-align: center;">
                <button id="saveSettingsBtn" style="padding: 8px 15px; background: rgba(0, 150, 0, 0.75) !important; color: #fff !important; border-radius: 5px; border: none; cursor: pointer; margin-right: 10px; transition: background 0.3s;">Save</button>
                <button id="closeSettingsBtn" style="padding: 8px 15px; background: rgba(150, 150, 150, 0.75) !important; color: #fff !important; border-radius: 5px; border: none; cursor: pointer; transition: background 0.3s;">Close</button>
            </div>
        </div>
    `;

    const removeCinematics = () => {
        const cinematics = document.getElementById('cinematics');
        if (cinematics) {
            cinematics.remove();
        }
        setTimeout(removeCinematics, 500);
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        removeCinematics();
    });

    const progressBarStyles = `
        .html5-play-progress, .ytp-play-progress { background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAIAAAAs6UAAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUNCQzIyREQ0QjdEMTFFMzlEMDM4Qzc3MEY0NzdGMDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUNCQzIyREU0QjdEMTFFMzlEMDM4Qzc3MEY0NzdGMDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQ0JDMjJEQjRCN0QxMUUzOUQwMzhDNzcwRjQ3N0YwOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQ0JDMjJEQzRCN0QxMUUzOUQwMzhDNzcwRjQ3N0YwOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PovDFgYAAAAmSURBVHjaYvjPwMAAxjMZmBhA9H8INv4P4TPM/A+m04zBNECAAQBCWQv9SUQpVgAAAABJRU5ErkJggg==\") repeat-x !important; background: linear-gradient(to bottom, #FF0000 0%, #FF0000 16.5%, #FF9900 16.5%, #FF9900 33%, #FFFF00 33%, #FFFF00 50%, #33FF00 50%, #33FF00 66%, #0099FF 66%, #0099FF 83.5%, #6633ff 83.5%, #6633ff 100%) !important; background: -webkit-linear-gradient(top, #FF0000 0%, #FF0000 16.5%, #FF9900 16.5%, #FF9900 33%, #FFFF00 33%, #FFFF00 50%, #33FF00 50%, #33FF00 66%, #0099FF 66%, #0099FF 83.5%, #6633ff 83.5%, #6633ff 100%) !important; background: -moz-linear-gradient(top, #FF0000 0%, #FF0000 16.5%, #FF9900 16.5%, #FF9900 33%, #FFFF00 33%, #FFFF00 50%, #33FF00 50%, #33FF00 66%, #0099FF 66%, #0099FF 83.5%, #6633ff 83.5%, #6633ff 100%) !important; }
        .html5-load-progress, .ytp-load-progress { background:  url(\"data:image/gif;base64,R0lGODlhMAAMAIAAAAxBd////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQECgAAACwAAAAAMAAMAAACJYSPqcvtD6MKstpLr24Z9A2GYvJ544mhXQmxoesElIyCcB3dRgEAIfkEBAoAAAAsAQACAC0ACgAAAiGEj6nLHG0enNQdWbPefOHYhSLydVhJoSYXPO04qrAmJwUAIfkEBAoAAAAsBQABACkACwAAAiGEj6nLwQ8jcC5ViW3evHt1GaE0flxpphn6BNTEqvI8dQUAIfkEBAoAAAAsAQABACoACwAAAiGEj6nLwQ+jcU5VidPNvPtvad0GfmSJeicUUECbxnK0RgUAIfkEBAoAAAAsAAAAACcADAAAAiCEj6mbwQ+ji5QGd6t+c/v2hZzYiVpXmuoKIikLm6hXAAAh+QQECgAAACwAAAAALQAMAAACI4SPqQvBD6NysloTXL480g4uX0iW1Wg21oem7ismLUy/LFwAACH5BAQKAAAALAkAAAAkAAwAAAIghI8Joe0Po0yBWTaz3g/z7UXhMX7kYmplmo0rC8cyUgAAIfkEBAoAAAAsBQAAACUACgAAAh2Ejwmh7Q+jbIFZNrPeEXPudU74IVa5kSiYqOtRAAAh+QQECgAAACwEAAAAIgAKAAACHISPELfpD6OcqTGKs4bWRp+B36YFi0mGaVmtWQEAIfkEBAoAAAAsAAAAACMACgAAAh2EjxC36Q+jnK8xirOW1kavgd+2BYtJhmnpiGtUAAAh+QQECgAAACwAAAAALgALAAACIYSPqcvtD+MKicqLn82c7e6BIhZQ5jem6oVKbfdqQLzKBQAh+QQECgAAACwCAAIALAAJAAACHQx+hsvtD2OStDplKc68r2CEm0eW5uSN6aqe1lgAADs=\") !important; }
        .html5-scrubber-button, .ytp-scrubber-button { background: url(\"data:image/gif;base64,R0lGODlhIgAVAKIHAL3/9/+Zmf8zmf/MmZmZmf+Z/wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDMkJBNjY5RTU1NEJFMzExOUM4QUM2MDAwNDQzRERBQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREIzOEIzMzRCN0IxMUUzODhEQjgwOTYzMTgyNTE0QiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREIzOEIzMjRCN0IxMUUzODhEQjgwOTYzMTgyNTE0QiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM1QkE2NjlFNTU0QkUzMTE5QzhBQzYwMDA0NDNEREFDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMyQkE2NjlFNTU0QkUzMTE5QzhBQzYwMDA0NDNEREFDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8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\") !important; width:34px!important; height:21px!important; border:none!important; margin-left:-18px!important; margin-top:-.8px!important; transform:scale(.8)!important; -webkit-transform:scale(.8)!important; -moz-transform:scale(.8)!important; -ms-transform:scale(.8)!important; }
        .ytp-progress-bar-container:hover .ytp-scrubber-button, .ytp-progress-bar-container:hover .ytp-load-progress{ transform:scale(1)!important; -webkit-transform:scale(1)!important; -moz-transform:scale(1)!important; -ms-transform:scale(1)!important; image-rendering:pixelated!important; }
        .html5-progress-bar-container, .ytp-progress-bar-container { height:12px!important; }
        .html5-progress-bar, .ytp-progress-bar { margin-top:12px!important; }
        .html5-progress-list, .ytp-progress-list, .video-ads .html5-progress-list.html5-ad-progress-list, .video-ads .ytp-progress-list.ytp-ad-progress-list { height:12px!important; }
        .ytp-volume-slider-track { background:#0C4177!important; }
        #progress-bar #progressContainer { height:8px!important; }
        #progress-bar:hover #progressContainer { height:12px!important; image-rendering:pixelated!important; }
        #progress-bar.ytmusic-player-bar { paper-slider-active-color: url(\"data:image/gif;base64,R0lGODlhIgAVAKIHAL3/9/+Zmf8zmf/MmZmZmf+Z/wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDMkJBNjY5RTU1NEJFMzExOUM4QUM2MDAwNDQzRERBQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREIzOEIzMzRCN0IxMUUzODhEQjgwOTYzMTgyNTE0QiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREIzOEIzMjRCN0IxMUUzODhEQjgwOTYzMTgyNTE0QiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM1QkE2NjlFNTU0QkUzMTE5QzhBQzYwMDA0NDNEREFDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMyQkE2NjlFNTU0QkUzMTE5QzhBQzYwMDA0NDNEREFDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8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\") !important; --paper-slider-active-color: linear-gradient(to bottom, #FF0000 0%, #FF0000 16.5%, #FF9900 16.5%, #FF9900 33%, #FFFF00 33%, #FFFF00 50%, #33FF00 50%, #33FF00 66%, #0099FF 66%, #0099FF 83.5%, #6633ff 83.5%, #6633ff 100%) !important; --paper-slider-secondary-color: url(\"data:image/gif;base64,R0lGODlhMAAMAIAAAAxBd////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQECgAAACwAAAAAMAAMAAACJYSPqcvtD6MKstpLr24Z9A2GYvJ544mhXQmxoesElIyCcB3dRgEAIfkEBAoAAAAsAQACAC0ACgAAAiGEj6nLHG0enNQdWbPefOHYhSLydVhJoSYXPO04qrAmJwUAIfkEBAoAAAAsBQABACkACwAAAiGEj6nLwQ8jcC5ViW3evHt1GaE0flxpphn6BNTEqvI8dQUAIfkEBAoAAAAsAQABACoACwAAAiGEj6nLwQ+jcU5VidPNvPtvad0GfmSJeicUUECbxnK0RgUAIfkEBAoAAAAsAAAAACcADAAAAiCEj6mbwQ+ji5QGd6t+c/v2hZzYiVpXmuoKIikLm6hXAAAh+QQECgAAACwAAAAALQAMAAACI4SPqQvBD6NysloTXL480g4uX0iW1Wg21oem7ismLUy/LFwAACH5BAQKAAAALAkAAAAkAAwAAAIghI8Joe0Po0yBWTaz3g/z7UXhMX7kYmplmo0rC8cyUgAAIfkEBAoAAAAsBQAAACUACgAAAh2Ejwmh7Q+jbIFZNrPeEXPudU74IVa5kSiYqOtRAAAh+QQECgAAACwEAAAAIgAKAAACHISPELfpD6OcqTGKs4bWRp+B36YFi0mGaVmtWQEAIfkEBAoAAAAsAAAAACMACgAAAh2EjxC36Q+jnK8xirOW1kavgd+2BYtJhmnpiGtUAAAh+QQECgAAACwAAAAALgALAAACIYSPqcvtD+MKicqLn82c7e6BIhZQ5jem6oVKbfdqQLzKBQAh+QQECgAAACwCAAIALAAJAAACHQx+hsvtD2OStDplKc68r2CEm0eW5uSN6aqe1lgAADs=\") !important; --paper-slider-active-color: rgba(0, 0, 0, 0); }
        #progress-bar[focused].ytmusic-player-bar, ytmusic-player-bar:hover #progress-bar.ytmusic-player-bar { --paper-slider-knob-color: rgba(0, 0, 0, 0) !important; --paper-slider-knob-start-color: rgba(0, 0, 0, 0) !important; --paper-slider-knob-start-border-color: rgba(0, 0, 0, 0) !important; }
        #progress-bar.ytmusic-player-bar:hover, #progress-bar[focused].ytmusic-player-bar { --paper-slider-height: 0px !important; }
        #progress-bar .slider-knob { background: url(\"data:image/gif;base64,R0lGODlhIgAVAKIHAL3/9/+Zmf8zmf/MmZmZmf+Z/wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDMkJBNjY5RTU1NEJFMzExOUM4QUM2MDAwNDQzRERBQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREIzOEIzMzRCN0IxMUUzODhEQjgwOTYzMTgyNTE0QiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREIzOEIzMjRCN0IxMUUzODhEQjgwOTYzMTgyNTE0QiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM1QkE2NjlFNTU0QkUzMTE5QzhBQzYwMDA0NDNEREFDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMyQkE2NjlFNTU0QkUzMTE5QzhBQzYwMDA0NDNEREFDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8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\") !important; width:34px!important; height:21px!important; border:none!important; margin-left:-18px!important; margin-top:8.5px!important; transform:scale(.8); -webkit-transform:scale(.8); -moz-transform:scale(.8); -ms-transform:scale(.8); }
        #progress-bar:hover .slider-knob { margin-top:11px!important; transform:scale(1)!important; -webkit-transform:scale(1)!important; -moz-transform:scale(1)!important; -ms-transform:scale(1)!important; image-rendering:pixelated!important; }
    `;

    function injectProgressBarStyles() {
        injectStyles(progressBarStyles);
    }
    
    function removeProgressBarStyles() {
        const styleTags = document.querySelectorAll('style');
        styleTags.forEach(tag => {
            if (tag.innerHTML.includes(progressBarStyles.trim())) {
                tag.remove();
            }
        });
    }

    function createCustomDownloader() {
        if (document.getElementById('custom-dl')) return;
    
        function appendInfobox() {
            var targetDiv = document.querySelector("#title.style-scope.ytd-watch-metadata");
            if (!targetDiv) return false;
    
            var CustomDownloader = document.createElement("div");
            CustomDownloader.id = "custom-dl";
            CustomDownloader.style.display = "flex";
            CustomDownloader.style.gap = "0.5em";
            CustomDownloader.style.alignItems = "center";
            CustomDownloader.style.fontSize = "1.17em";
            CustomDownloader.style.fontWeight = "700";
    
            var img = document.createElement("img");
            img.src = "https://cdn-icons-png.flaticon.com/512/189/189249.png";
            img.alt = "Custom-DL";
            img.style.height = "1.2em";
            CustomDownloader.appendChild(img);
    
            var link = document.createElement("a");
            link.textContent = "Download";
            link.href = getY2mateUrl(window.location.href);
            link.target = "_blank";
            link.style.fontSize = "13px";
            link.style.marginRight = "10px";
            link.style.padding = "5px 0px";
            link.style.color = "#4abd97";
            link.style.textDecoration = "none";
            CustomDownloader.appendChild(link);
    
            targetDiv.appendChild(CustomDownloader);
            return true;
        }
    
        function getY2mateUrl(url) {
            var videoId = extractVideoId(url);
            return videoId ? "https://y2mate.com/youtube/" + videoId : "#";
        }
    
        function extractVideoId(url) {
            var match = url.match(/[?&]v=([^&]+)/);
            return match ? match[1] : null;
        }
    
        if (!appendInfobox()) {
            const observer = new MutationObserver((mutations, obs) => {
                if (appendInfobox()) {
                    obs.disconnect();
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    function removeCustomDownloader() {
        const customDl = document.getElementById('custom-dl');
        if (customDl) {
            customDl.remove();
        }
    }

    function injectStyles(styles) {
        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);
    }

    function closePopup() {
        const popup = document.getElementById('settingsPopup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    function saveSettings() {
        const backgroundUrl = document.getElementById('backgroundUrl').value.trim();
        const chatBackgroundUrl = document.getElementById('chatBackgroundUrl').value.trim();
        const enableProgressBar = document.getElementById('enableProgressBar').checked;
        const enableDownloadButton = document.getElementById('enableDownloadButton').checked;

        localStorage.setItem('backgroundUrl', backgroundUrl);
        localStorage.setItem('chatBackgroundUrl', chatBackgroundUrl);
        localStorage.setItem('enableProgressBar', enableProgressBar);
        localStorage.setItem('enableDownloadButton', enableDownloadButton);

        applyBackground('body', backgroundUrl || DEFAULT_BODY_BACKGROUND);
        applyBackground('.style-scope.yt-live-chat-renderer.iron-selected', chatBackgroundUrl || DEFAULT_CHAT_BACKGROUND);

        if (enableProgressBar) {
            injectProgressBarStyles();
        } else {
            removeProgressBarStyles();
        }

        if (enableDownloadButton) {
            createCustomDownloader();
        } else {
            removeCustomDownloader();
        }

        showNotification('Settings saved. Some changes may require a page refresh.');

        closePopup();
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification-popup';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 25px;
            left: 25px;
            background-color: rgba(0,0,0,0.75);
            padding: 10px;
            border-radius: 5px;
            color: white;
            font-weight: 800;
            font-size: 16px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function applyBackground(selector, url) {
        injectStyles(`
            ${selector} {
                background-image: url(${url}) !important;
            }
        `);
    }

    function waitForElementAndCreateSettings(maxAttempts = 20, interval = 500) {
        let attempts = 0;
    
        function tryCreatingSettings() {
            const startDiv = document.querySelector('div#start.style-scope.ytd-masthead');
            const logoRenderer = document.querySelector('ytd-topbar-logo-renderer#logo.style-scope.ytd-masthead');
    
            if (startDiv && logoRenderer) {
                console.log('Found necessary elements');
                createSettingsButton(startDiv, logoRenderer);
            } else if (attempts < maxAttempts) {
                attempts++;
                console.log(`Attempt ${attempts}: Elements not found. Retrying...`);
                setTimeout(tryCreatingSettings, interval);
            } else {
                console.log("Failed to find the necessary elements after maximum attempts");
                console.log("Current page structure:", document.body.innerHTML);
            }
        }
    
        tryCreatingSettings();
    }
    
    function createSettingsButton(startDiv, logoRenderer) {
        if (document.getElementById('settingsButton')) {
            console.log('Settings button already exists');
            return;
        }
    
        console.log('Creating settings button');
    
        const settingsButton = document.createElement('div');
        settingsButton.id = 'settingsButton';
        settingsButton.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.25);
            border-radius: 50%;
            transition: background-color 0.3s;
            margin-left: 10px;
            vertical-align: middle;
        `;
    
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("fill", "#fff");
        svg.setAttribute("class", "bi bi-gear-fill");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.innerHTML = `
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
        `;
    
        settingsButton.appendChild(svg);

        startDiv.insertBefore(settingsButton, logoRenderer.nextSibling);
    
        console.log('Settings button created and inserted');

        settingsButton.addEventListener('click', showPopup);
    }
    
    function showPopup() {
        const popup = document.getElementById('settingsPopup');
        if (popup) {
            popup.style.display = 'block';
        }
    }
    
    function initSettingsButton() {
        console.log('Initializing settings button');
        if (youtubeUrlRegex.test(document.location.href)) {
            waitForElementAndCreateSettings();
        } else {
            console.log('Not a YouTube URL, skipping button creation');
        }
    }
    
    window.addEventListener('load', initSettingsButton);
    
    document.addEventListener('yt-navigate-finish', initSettingsButton);
    
    initSettingsButton();

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, me) => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                me.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        if (youtubeUrlRegex.test(document.location.href)) {
            waitForElement('#settingsButton', () => {
                injectStyles(youtubeStyles);
                createSettingsButton();
                document.body.insertAdjacentHTML('beforeend', popupHTML);
                document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
                document.getElementById('closeSettingsBtn').addEventListener('click', closePopup);
    
                const savedBackgroundUrl = localStorage.getItem('backgroundUrl');
                const savedChatBackgroundUrl = localStorage.getItem('chatBackgroundUrl');
                const enableProgressBar = localStorage.getItem('enableProgressBar') === 'true';
                const enableDownloadButton = localStorage.getItem('enableDownloadButton') === 'true';
    
                applyBackground('body', savedBackgroundUrl || DEFAULT_BODY_BACKGROUND);
                applyBackground('.style-scope.yt-live-chat-renderer.iron-selected', savedChatBackgroundUrl || DEFAULT_CHAT_BACKGROUND);
    
                if (savedBackgroundUrl) {
                    document.getElementById('backgroundUrl').value = savedBackgroundUrl;
                }
    
                if (savedChatBackgroundUrl) {
                    document.getElementById('chatBackgroundUrl').value = savedChatBackgroundUrl;
                }
    
                document.getElementById('enableProgressBar').checked = enableProgressBar;
                document.getElementById('enableDownloadButton').checked = enableDownloadButton;
    
                if (enableProgressBar) {
                    injectProgressBarStyles();
                }
    
                if (enableDownloadButton) {
                    createCustomDownloader();
                } else {
                    removeCustomDownloader();
                }
            });
        }
    }    

    document.addEventListener('DOMContentLoaded', init);
})();
