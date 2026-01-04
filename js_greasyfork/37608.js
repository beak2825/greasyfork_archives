// ==UserScript==
// @name         npmjs.com visual tweaks
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Makes READMEs on npmjs.com look more like READMEs on GitHub (font, size, padding, some colors); also makes the content wider
// @author       joeytwiddle
// @copyright    2018-2019, Paul "Joey" Clark (http://neuralyte.org/~joey)
// @license      MIT
// @match        https://www.npmjs.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37608/npmjscom%20visual%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/37608/npmjscom%20visual%20tweaks.meta.js
// ==/UserScript==

// Motivation: I didn't like the visual context switching between reading Github READMEs and npm READMEs, so I made READMEs on npm look similar to READMEs on Github.

(function() {
    'use strict';

    // This allows the README to expand to the full width below the info sidebar
    const floatTheSidebar = true;
    const allowWiderContent = true;
    const useOldGithubColors = false;
    const makeLinksBlue = true;

    //const readmePrefix = '.readme__readme___tmT33';
    //const readmePrefix = '.markdown__markdown___3yof6';
    const readmePrefix = '#readme';

    // I want to scale down the fonts and everything else a bit.  This was an easy way to do that.
    //GM_addStyle('.container { transform: scale(0.92); transform-origin: 50% 0; }');

    if (allowWiderContent) {
        // The default behaviour is to max out at 1200px, but I am happy for the README to grow a little bit larger.  (Same with my Wide-Github)
        //GM_addStyle('.container { width: 98%; max-width: 100%; }');
        // .package__root___22JkW
        GM_addStyle(`
            /* Override the default, to expand fully (with a small margin) */
            .vistweaks #top {
                min-width: 100%;
                max-width: 100%;
            }
            /* But max out at 1500 */
            @media screen and (min-width: 1500px) {
                .vistweaks #top {
                    min-width: 1500px;
                    max-width: 1500px;
                }
            }
        `);
    }

    // Set fonts like GitHub
    GM_addStyle('.vistweaks #readme { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Source Sans Pro", "Lucida Grande", sans-serif; }');
    GM_addStyle('#readme { font-family: line-height: 1.5;}');
    //GM_addStyle('pre, code, kbd, samp { font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; }');
    // Set fonts how I like them (configurable through browser)
    //GM_addStyle('pre, code, kbd, samp { font-family: monospace; }');
    // I don't know why, but "monospace" shrinks the font considerably on my Linux, whilst "monospace,monospace" does not.
    // Also "monospace,monospace" is what the site itself adopted on 2018/3/22.  This rule will just ensure it stays this way!
    GM_addStyle(`.vistweaks ${readmePrefix} pre, .vistweaks ${readmePrefix} code, .vistweaks ${readmePrefix} kbd, .vistweaks ${readmePrefix} samp { font-family: monospace,monospace; }`);

    // Set font sizes like GitHub
    GM_addStyle(`.vistweaks ${readmePrefix} p { font-size: 16px; line-height: 1m5; }`);
    GM_addStyle(`
        /*
        @media screen and (min-width: 30em) {
          .vistweaks ${readmePrefix} {
            font-size: 0.8rem;
          }
        }
        */
        .vistweaks ${readmePrefix} h1 {
            padding-bottom: 0.3em;
            font-size: 2em;
            border-bottom: 1px solid #eaecef
        }
        .vistweaks ${readmePrefix} h2 {
            padding-bottom: 0.3em;
            font-size: 1.5em;
            border-bottom: 1px solid #eaecef
        }
        .vistweaks ${readmePrefix} h3 {
            font-size: 1.25em
        }
        .vistweaks ${readmePrefix} h4 {
            font-size: 1em
        }
        .vistweaks ${readmePrefix} h5 {
            font-size: 0.875em
        }
        .vistweaks ${readmePrefix} h6 {
            font-size: 0.85em;
            color: #6a737d
        }
        /* Code blocks inside a header do not shrink */
        .vistweaks ${readmePrefix} h1 tt,
        .vistweaks ${readmePrefix} h1 code,
        .vistweaks ${readmePrefix} h2 tt,
        .vistweaks ${readmePrefix} h2 code,
        .vistweaks ${readmePrefix} h3 tt,
        .vistweaks ${readmePrefix} h3 code,
        .vistweaks ${readmePrefix} h4 tt,
        .vistweaks ${readmePrefix} h4 code,
        .vistweaks ${readmePrefix} h5 tt,
        .vistweaks ${readmePrefix} h5 code,
        .vistweaks ${readmePrefix} h6 tt,
        .vistweaks ${readmePrefix} h6 code {
            font-size: inherit;
            /* This is a fix because 600 is not thick enough for the monospace font we introduced */
            /* font-weight: 800; */
            /* Using the Github mandated font is a better fix */
            font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace;
        }
        /* Remove the hard-coded link sizing */
        .vistweaks ${readmePrefix} ul li a {
            font-size: inherit;
        }
    `);
    // A snippet of code appearing within a paragraph
    // A line of code on its own
    GM_addStyle(`.vistweaks ${readmePrefix} pre { line-height: 1.5; }`);
    GM_addStyle(`.vistweaks ${readmePrefix} code { line-height: 1.5; }`);
    GM_addStyle(`.vistweaks ${readmePrefix} pre { font-size: 85%; }`);
    GM_addStyle(`.vistweaks ${readmePrefix} code { font-size: 85%; }`);
    GM_addStyle(`.vistweaks ${readmePrefix} pre code { font-size: inherit; }`);
    // A block of code
    //GM_addStyle('.vistweaks pre { font-size: 82%; line-height: 1.4; }');

    // Darker text, and blue links instead of red links
    // Weirdly, on Mac, the font strokes on npmjs.com appear thinner than those on Github, for a reason I cannot understand.
    // To compensate, I use a darker color for text, and for links, I also shift the hue towards purple.  Far out!
    const onMac = !!navigator.userAgent.match(/Mac OS X/);
    const textColor = useOldGithubColors ? onMac ? '#111' : '#333' : onMac ? 'hsl(210, 12%, 5%)' : '#24292e';
    const linkColor = useOldGithubColors ? onMac ? 'hsl(214, 77%, 32%)' : 'rgb(64, 120, 192)' : onMac ? 'hsl(222, 100%, 37%)' : '#0366d6';
    GM_addStyle(`.vistweaks .markdown p, .vistweaks .markdown li { color: ${textColor}; }`);
    if (makeLinksBlue) {
        GM_addStyle(`.vistweaks ${readmePrefix} a, .vistweaks ${readmePrefix} ul li a { color: ${linkColor}; }`);
    }

    // The boxes around inline code snippets
    GM_addStyle('.vistweaks code { border-radius: 3px; padding: 0.2em 0.4em !important; }');

    // Links should be normal weight (npm makes them bolder)
    GM_addStyle('.vistweaks .markdown p a, .vistweaks .markdown li a { font-weight: initial; }');

    // Padding around code blocks and snippets
    // A snippet of code appearing within a paragraph
    GM_addStyle('.vistweaks code { padding: 0.2em 0.2em; }');
    // A line of code on its own
    GM_addStyle('.vistweaks pre > code { padding: 1em 2em; }');

    // Reduce the large padding inside code blocks to be more like Github's
    GM_addStyle('.vistweaks pre { padding: 1.1rem !important; }');

    // Lighter background on code blocks and snippets
    GM_addStyle('.vistweaks .markdown .highlight, .vistweaks .markdown code, .vistweaks .markdown pre { background-color: #f6f8fa; }');

    // More of a gap after each paragraph?  Wasn't actually needed.  The problem was wrapping due to insufficient width.
    //GM_addStyle('div, .highlight { padding-bottom: 20px; }');

    // Thicker font for section headers
    GM_addStyle('.vistweaks .markdown h1, .vistweaks .markdown h2, .vistweaks .markdown h3, .vistweaks .markdown h4, .vistweaks .markdown h5, .vistweaks .markdown h6 { font-weight: 600; }');

    // Use the npm font for section headers, even though we aren't using it for main text.  (This is a divergence from Github's markdown scheme.)
    //GM_addStyle(".markdown h1, .markdown h2, .markdown h3, .markdown h4, .markdown h5, .markdown h6 { font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif; }");

    // There was absolutely no padding on the new styling.  At low widths, the text could touch the edge of the screen.  No thanks!
    //GM_addStyle(".markdown { padding-left: 1em; padding-right: 1em; }");
    // Better to do it for the whole content, including the tabs across the top
    //GM_addStyle("#top { padding-left: 1em; padding-right: 1em; }");
    // At larger widths we can enjoy greater padding
    GM_addStyle(".vistweaks #top { padding-left: 2%; padding-right: 2%; }");

    // Make the sidebar look like a hovering card
    // Sadly this now reaches all the way down to the bottom of the README
    GM_addStyle(".vistweaks .package__rightSidebar___9dMXo { padding: 0.9em 1.8em 0.1em 1.8em !important; margin-top: 2.75rem; }");
    //GM_addStyle(".package__rightSidebar___9dMXo { box-shadow: 0 0 8px 0 #00000033; }");
    GM_addStyle(".vistweaks .package__rightSidebar___9dMXo { border: 1px solid #0002 }");
    // This widens the gap between the two panels, so the shadow doesn't overlap too much
    GM_addStyle(".vistweaks .markdown { padding-right: 0.5em; }");
    // This graph does not scale down well to low resolutions, with or without our changes.  I will wait and see if they fix that.

    // This is one way of increasing the specificity of our selectors
    // It could also be used to toggle our tweaks on and off
    // But I have not yet added it to the selectors above
    document.body.classList.add("vistweaks");

    // Drop the huge margins above section titles
    GM_addStyle(".vistweaks .markdown h1, .vistweaks .markdown h2, .vistweaks .markdown h3, .vistweaks .markdown h4, .vistweaks .markdown h5, .vistweaks .markdown h6 { margin-top: 1em; padding-top: 0; }");

    // Indent lists
    GM_addStyle(".vistweaks .markdown ul, .vistweaks .markdown ol { padding-left: 2em; }");

    // Bugfix: strong changes the text colour, but that sucks if the strong is inside a link.
    // Using `a *` instead of `a strong` just in case there are other problems like this.
    GM_addStyle(`.vistweaks ${readmePrefix} a * { color: inherit; }`);

    if (floatTheSidebar) {
        var checkTheSidebar = function () {
            const mainLeftPanel = document.querySelector('._6620a4fd');
            if (!mainLeftPanel) return;

            const readmeElement = document.querySelector('#readme');
            if (!readmeElement) return;

            const sidebarElement = document.querySelector('.fdbf4038');
            if (!sidebarElement) return;
            if (sidebarElement.parentNode.classList.contains('visual-tweaks-userscript-sidebar-container')) {
                //console.log("We have already handled this sidebar");
                return;
            }

            mainLeftPanel.classList.remove('w-two-thirds-l');
            //mainLeftPanel.querySelector('section').classList.remove('mr3-ns');

            // If there is nothing forcing the main pane to fill the width, then it won't.
            // That looks odd, because the floated sidebar will now not appear next to the right edge.
            // Example (a page without an image): https://www.npmjs.com/package/eslint-plugin-styled-components
            // So we force the main content to fill the available width.
            mainLeftPanel.style.width = '100%';
            mainLeftPanel.style.maxWidth = '100%';

            const sidebarContainer = document.createElement('div');
            sidebarContainer.className = 'visual-tweaks-userscript-sidebar-container';
            sidebarContainer.style.float = 'right';
            sidebarContainer.style.background = 'white';
            sidebarContainer.style.paddingLeft = '3em';
            sidebarContainer.style.paddingBottom = '3em';
            // Move the width from the sidebar to the container
            sidebarElement.classList.remove('w-third-l');
            sidebarContainer.classList.add('w-third-l');
            sidebarContainer.appendChild(sidebarElement);
            GM_addStyle(".vistweaks .markdown { padding-right: 0; }");
            // Clear the existing margin.  Leave a small margin for the shadow.
            GM_addStyle(".vistweaks .mr3-ns { margin-right: 4px; }");
            // Give the info card equal padding at the top and bottom
            GM_addStyle(".vistweaks .package__rightSidebar___9dMXo { padding-top: 1em !important; padding-bottom: 1em !important; }");
            //readmeElement.appendChild(sidebarElement);
            readmeElement.parentNode.insertBefore(sidebarContainer, readmeElement);

            // BUG: At low resolutions, normally the sidebar will break to below the readme.  But with our changes, the sidebar appears above the readme!

            // If an image appears above the fold, and it takes 100% of the width, then it will cause the document to push down below the floating sidebar
            // For an example of such a page: https://www.npmjs.com/package/passport
            // To fix it, we set a max width on images
            // Of course this rule will apply to all images, even those later down on the page
            // npmjs have now set their own max, so we can remove this
            GM_addStyle(".vistweaks .markdown img { max-width: 66%; }");
        };

        // On Firefox, this causes two sidebars to appear!
        // Presumably because it runs again below
        //checkTheSidebar();

        // Keep checking, in case we go to a new page
        new MutationObserver(mutations => checkTheSidebar()).observe(document.body, { childList: true, subtree: true });
    }
})();
