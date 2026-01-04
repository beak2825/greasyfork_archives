// ==UserScript==
// @name         Custom Font Override (Flexible Edition)
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  Replaces website fonts with Roboto (default via Google Fonts), a local font, or a custom online URL, without breaking Font Awesome, Glyphicons, or Icomoon icons
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527981/Custom%20Font%20Override%20%28Flexible%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527981/Custom%20Font%20Override%20%28Flexible%20Edition%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Font Customization Options ---
    // Users can tweak these to set their preferred font source
    const fontSettings = {useGoogleFonts: true, googleFontUrl: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap", googleFontName: "Roboto", useCustomUrl: false, customFontName: "CustomFont", customFontUrl: "", localFontName: "Arial", fallback: "sans-serif"};
    // useGoogleFonts: True = use Google Fonts CSS (default); False = check other options
    // googleFontUrl: Default Roboto Google Fonts CSS link (third <link> from embed code)
    // googleFontName: Font name for Google Fonts (default: "Roboto")
    // useCustomUrl: True = use a custom online font file; False = use local if useGoogleFonts is also false
    // customFontName: Name for your custom online font (e.g., "MyFont")
    // customFontUrl: Direct URL to a font file (e.g., .woff2); empty by default
    // localFontName: Local font name if both useGoogleFonts and useCustomUrl are false
    // fallback: Fallback font if all else fails (default: "sans-serif")

    // --- How to Customize This Script ---
    // Option 1: Use Google Fonts (Default: Roboto)
    // - Keep useGoogleFonts: true
    // - Visit fonts.google.com, pick a font, select styles (e.g., weights, italics), click "Get font"
    // - Copy the third <link> URL from "Embed code in the <head> of your HTML" (e.g., "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap")
    // - Paste it into googleFontUrl, update googleFontName to match (e.g., "Open Sans")
    // - Set useCustomUrl: false
    //
    // Option 2: Use a Custom Online Font File (e.g., .woff2)
    // - Set useGoogleFonts: false and useCustomUrl: true
    // - Set customFontName to your font’s name (e.g., "MyCoolFont")
    // - Set customFontUrl to a direct .woff2 file URL (e.g., "https://example.com/mycoolfont.woff2")
    // - .woff2 is recommended for speed and mobile compatibility—faster loading!
    // - Example: Roboto .woff2: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2"
    //
    // Option 3: Use a Local Font Installed on Your Computer
    // - Set useGoogleFonts: false and useCustomUrl: false
    // - Update localFontName to your font’s exact name (e.g., "Arial", "Times New Roman", "Comic Sans MS")
    // - Check the name in Windows (Settings > Fonts) or macOS (Font Book)

    function applyFontOverride() {
        // Determine and log the active font source
        const activeFont = fontSettings.useGoogleFonts ? fontSettings.googleFontName : fontSettings.useCustomUrl ? fontSettings.customFontName : fontSettings.localFontName;
        console.log(`Starting font override with ${activeFont}`);

        // --- Load Font Based on Selected Option ---
        if (fontSettings.useGoogleFonts) {
            console.log("Loading Google Fonts CSS: " + fontSettings.googleFontUrl);

            // Preconnect to fonts.googleapis.com
            const linkPreconnect1 = document.createElement('link');
            linkPreconnect1.rel = "preconnect";
            linkPreconnect1.href = "https://fonts.googleapis.com";
            document.head.appendChild(linkPreconnect1);
            console.log("Added preconnect to https://fonts.googleapis.com");

            // Preconnect to fonts.gstatic.com with crossorigin
            const linkPreconnect2 = document.createElement('link');
            linkPreconnect2.rel = "preconnect";
            linkPreconnect2.href = "https://fonts.gstatic.com";
            linkPreconnect2.setAttribute("crossorigin", "");
            document.head.appendChild(linkPreconnect2);
            console.log("Added preconnect to https://fonts.gstatic.com");

            // Load the Google Fonts stylesheet
            const linkStylesheet = document.createElement('link');
            linkStylesheet.rel = "stylesheet";
            linkStylesheet.href = fontSettings.googleFontUrl;
            document.head.appendChild(linkStylesheet);
            console.log("Added stylesheet link: " + fontSettings.googleFontUrl);
        } else if (fontSettings.useCustomUrl && fontSettings.customFontUrl) {
            console.log("Loading custom font file: " + fontSettings.customFontUrl);
            const fontFaceStyle = document.createElement('style');
            fontFaceStyle.textContent = `
                @font-face {
                    font-family: "${fontSettings.customFontName}";
                    src: url("${fontSettings.customFontUrl}") format("woff2");
                }
            `;
            document.head.appendChild(fontFaceStyle);
        } else {
            console.log("Using local font: " + fontSettings.localFontName);
        }

        // --- Apply Font Styles ---
        const style = document.createElement('style');
        style.type = 'text/css';
        let cssContent = '';

        // Apply the selected font to all common text elements
        const fontName = fontSettings.useGoogleFonts ? fontSettings.googleFontName : fontSettings.useCustomUrl ? fontSettings.customFontName : fontSettings.localFontName;
        cssContent += `
            /* Apply ${fontName} to all common text elements */
            body, p, h1, h2, h3, h4, h5, h6, span, div, a, li, td, th, input, textarea, select, option, label, button, i, em {
                font-family: "${fontName}", ${fontSettings.fallback} !important;
            }
        `;

        // --- Icon and Navigation Preservation ---
        // These rules ensure icons and navigation stay intact
        cssContent += `
            /* Preserve generic icon fonts so they don’t get overridden */
            [class*="icon-"], [class*="mdi-"], svg {
                font-family: inherit !important;
            }

            /* Keep Glyphicons working (e.g., home icon) */
            .glyphicon,
            [class*="glyphicon-"] {
                font-family: "Glyphicons Halflings" !important;
            }

            /* Protect Font Awesome icons (e.g., gear, menu) across versions */
            span.fa,
            span[class*="fa-"],
            i.fa,
            i[class*="fa-"] {
                font-family: "FontAwesome", "Font Awesome 5 Free", "Font Awesome 5 Pro", "Font Awesome 6 Free", "Font Awesome 6 Pro" !important;
            }

            /* Preserve Material Icons (e.g., menu from Google’s set) */
            .material-icons,
            [class*="material-icons"] {
                font-family: "Material Icons" !important;
            }

            /* Preserve Icomoon icons (e.g., custom .icon classes) */
            i.icon:not([class*="fa-"]):not([class*="glyphicon-"]):not([class*="material-icons"]):not([class*="mdi-"]) {
                font-family: "icomoon" !important;
            }

            /* Ensure NavTabs navigation icons don’t break */
            #NavTabs *:not(.glyphicon):not([class*="glyphicon-"]):not(.fa):not([class*="fa-"]):not(.material-icons):not([class*="material-icons"]):not(.icon):not([class*="icon-"]) {
                font-family: inherit !important;
            }
        `;

        style.textContent = cssContent;
        document.head.appendChild(style);

        console.log("Font override applied successfully with " + fontName + "; Icon preservation for Glyphicons, Font Awesome, Material Icons, Icomoon");
    }

    // --- Run the Function on Page Load ---
    window.addEventListener('load', applyFontOverride);
    applyFontOverride();
})();