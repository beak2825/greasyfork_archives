// ==UserScript==
// @name         Cheat Engine Forum Dark Theme + Modern Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply a dark modern theme site-wide on Cheat Engine Forum and modernize the search page UI with Google CSE styled search box
// @author       Falcon
// @match        https://forum.cheatengine.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539639/Cheat%20Engine%20Forum%20Dark%20Theme%20%2B%20Modern%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/539639/Cheat%20Engine%20Forum%20Dark%20Theme%20%2B%20Modern%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Site-wide dark theme CSS ---
    const darkThemeCSS = `
      body, html {
        background-color: #1a1a1a !important;
        color: #d1d5db !important;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        margin: 0; padding: 0;
      }

      a:link, a:visited, a:active {
        color: #60a5fa !important;
        text-decoration: none !important;
      }
      a:hover {
        color: #93c5fd !important;
        text-decoration: underline !important;
      }

      /* Override forum background and borders */
      .bodyline, .forumline, td.row1, td.row2, td.row3, td.cat, td.catHead, td.catSides, td.catLeft, td.catRight, td.catBottom {
        background-color: #2d2d2d !important;
        border-color: #4b5563 !important;
        color: #d1d5db !important;
      }

      /* Headers */
      th.thHead {
        background-color: #2563eb !important;
        color: #ffffff !important;
        font-weight: 700 !important;
      }

      /* General text */
      .gen, .genmed, .gensmall, .postbody, .postdetails, .name {
        color: #d1d5db !important;
      }

      /* Inputs */
      input, textarea, select {
        background-color: #374151 !important;
        border: 1px solid #4b5563 !important;
        color: #d1d5db !important;
        font-size: 14px !important;
        border-radius: 4px !important;
        padding: 6px 10px !important;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
      }

      input:focus, textarea:focus, select:focus {
        border-color: #60a5fa !important;
        outline: none !important;
        box-shadow: 0 0 5px #60a5fa !important;
      }

      /* Buttons */
      input.button, input.mainoption, input.liteoption {
        background-color: #2563eb !important;
        color: #ffffff !important;
        border: none !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        border-radius: 5px !important;
        padding: 8px 14px !important;
        transition: background-color 0.3s ease !important;
      }

      input.button:hover, input.mainoption:hover, input.liteoption:hover {
        background-color: #1e40af !important;
      }

      /* Navigation links */
      .nav a {
        color: #60a5fa !important;
      }

      .nav a:hover {
        color: #93c5fd !important;
      }

      /* Titles */
      .maintitle {
        color: #93c5fd !important;
      }

      .cattitle, .forumlink {
        color: #60a5fa !important;
        font-weight: 600 !important;
      }

      /* Post quotes and code blocks */
      .quote {
        background-color: #374151 !important;
        border-color: #4b5563 !important;
        color: #d1d5db !important;
      }

      .code {
        background-color: #1f2937 !important;
        border-color: #4b5563 !important;
        color: #e5e7eb !important;
        font-weight: normal !important;
      }

      /* Footer and copyright */
      .copyright {
        color: #9ca3af !important;
      }
    `;

    // Append the dark theme style to head
    const themeStyle = document.createElement('style');
    themeStyle.textContent = darkThemeCSS;
    document.head.appendChild(themeStyle);

    // --- If on the search page, replace content with modern search UI ---
    if (location.pathname.endsWith('search.php')) {
      document.body.innerHTML = `
        <div class="search-container" style="
          max-width: 600px;
          margin: 60px auto;
          background: #2d2d2d;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.2);
          text-align: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">
          <h2 style="color:#60a5fa; margin-bottom: 15px; font-weight: 700; font-size: 2rem;">Search Cheat Engine Forum</h2>
          <p style="color:#9ca3af; font-size: 1.1rem; margin-bottom: 25px;">Use the Google-powered search below for the best results:</p>
          <gcse:search></gcse:search>
        </div>
      `;

      // Inject Google Custom Search script
      (function() {
        var cx = '009081794347989224031:rrizk45lqzi'; // your CSE ID
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
                    '//www.google.com/cse/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
      })();

      // Additional styling for the Google search input/button
      const cseStyle = document.createElement('style');
      cseStyle.textContent = `
        gcse\\:search {
          display: inline-block;
          width: 100%;
          max-width: 100%;
        }
        input.gsc-input, input.gsc-search-button {
          font-size: 1.1rem !important;
          padding: 10px 16px !important;
          border-radius: 8px !important;
          border: 1px solid #4b5563 !important;
          box-sizing: border-box !important;
        }
        input.gsc-input {
          width: 70% !important;
          margin-right: 12px !important;
          background-color: #374151 !important;
          color: #d1d5db !important;
          transition: border-color 0.3s ease;
        }
        input.gsc-input:focus {
          border-color: #60a5fa !important;
          outline: none !important;
          box-shadow: 0 0 5px #60a5fa !important;
        }
        input.gsc-search-button {
          background-color: #2563eb !important;
          color: #ffffff !important;
          border: none !important;
          cursor: pointer !important;
          transition: background-color 0.3s ease;
        }
        input.gsc-search-button:hover {
          background-color: #1e40af !important;
        }
        @media (max-width: 480px) {
          input.gsc-input {
            width: 100% !important;
            margin: 0 0 10px 0 !important;
          }
          input.gsc-search-button {
            width: 100% !important;
          }
        }
      `;
      document.head.appendChild(cseStyle);
    }

})();