// ==UserScript==
// @name         XVideos Alabama
// @version      2025-04-22-v1
// @description  Sweet home Alabama + Loads HD and well rated videos
// @author       ScriptKing
// @match        https://www.xvideos.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xvideos.com
// @grant        none
// @namespace https://greasyfork.org/users/1336691
// @downloadURL https://update.greasyfork.org/scripts/501190/XVideos%20Alabama.user.js
// @updateURL https://update.greasyfork.org/scripts/501190/XVideos%20Alabama.meta.js
// ==/UserScript==

(function() {
    var overlay = document.createElement('div');
    overlay.innerHTML = `
        <div style="
            position:fixed;
            top:0; left:0;
            width:100%; height:100%;
            background:rgba(50, 50, 50);
            color:white;
            font-size:2em;
            display:flex;
            justify-content:center;
            align-items:center;
            z-index:10000;
            backdrop-filter: blur(8px);">
            Loading...
        </div>`;
    const url = new URL(window.location.href);
    const params = new URLSearchParams(window.location.search);
    const paramLength = [...params.keys()].length
    let query = ''
    let groupBtn = document.querySelector('span[class="input-group-btn"]')

    const searchElement = document.querySelector('div[class="head__search"]');

    if (searchElement) {
        const input = document.createElement('input');
        input.id = 'go_input'
        input.className = 'go_search_class'
        input.placeholder = 'TYPE HERE ...'

        const button = document.createElement('button');
        button.id = 'go_button';
        button.textContent = 'FIND 🔎';
        button.className = 'go_button_class'

        searchElement.appendChild(input);
        searchElement.appendChild(button);


        if(window.location == 'https://www.xvideos.com/'){
          localStorage.setItem('k', '');
        } else {
          const k = params.get('k');
          if (k) {
            const decoded = decodeURIComponent(k.replace(/\+/g, ' '));
            document.getElementById('go_input').value = decoded;
            localStorage.setItem('k', decoded);
          } else {
            const myK = localStorage.getItem('k')
            if(myK != '') document.getElementById('go_input').value = myK;
          }

        }



    }
    let inputBox = document.querySelector('input[id="go_input"]')
    inputBox.onkeyup = function() {
        query = this.value;
    };
    const submitBtn = document.querySelector('button[id="go_button"]')
    inputBox.addEventListener('keypress', e => {
        if (e.keyIdentifier=='U+000A' || e.keyIdentifier=='Enter' || e.keyCode==13) {
            searchFn()
        }
    });

    const submitFrm = document.querySelector('form[id="xv-search-form"]')
    let sFClone = submitFrm.cloneNode(true);
    submitFrm.parentNode.replaceChild(sFClone, submitFrm);

    submitBtn.type = 'button'
    const urlParams = new URLSearchParams(window.location.search);
    let paramText = ''
    try {
      paramText = urlParams.get('k').replace(/\+/g, ' ');
    } catch(e){
      console.log('no url params')
    }

    const searchFn = () => {
        const url = new URL(window.location.href);
        const urlParams = new URLSearchParams(url.search);
        const baseUrl = 'https://www.xvideos.com'; // Set your base URL here

        // Check if the 'k' parameter is absent
        if (!urlParams.has('k')) {
            // Reset to base URL and set default parameters
            urlParams.set('sort', 'relevance');
            urlParams.set('durf', '10min_more');
            urlParams.set('quality', 'hd');
            urlParams.set('k', inputBox.value); // Attach 'k' parameter

            // Update the URL and redirect
            window.location.href = `${baseUrl}?${urlParams.toString()}`;
        } else {
            // Update or set the 'k' parameter with the value from the input box
            urlParams.set('k', inputBox.value);
            url.search = urlParams.toString();

            // Update the URL and redirect
            setTimeout(() => window.location.href = url.toString(), 100);
        }
    };


    submitBtn.onclick = searchFn

    document.body.appendChild(overlay);
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const let_me_fantasise = () => {
        // Create a map to hold identifiers and their corresponding URLs
        const urlMap = new Map();
        let idCounter = 0; // Counter for generating unique identifiers

        // Step 1: Replace URLs with identifiers
        document.querySelectorAll('a, h2').forEach(element => {
            let htmlContent = element.innerHTML;

            // Use regex to find all https URLs ending with .jpg, .jpeg, .svg, or .gif
            htmlContent = htmlContent.replace(/(https:\/\/[^\s]+?\.(jpg|jpeg|svg|gif|png))/g, (match) => {
                const identifier = `__url_identifier_${idCounter}__`; // Generate a unique identifier
                urlMap.set(identifier, match); // Save the mapping
                idCounter++; // Increment the counter for the next identifier
                return identifier; // Replace the URL with the identifier
            });


            // Step 2: Perform text transformations
            const newText = htmlContent
                .replaceAll(/step[- ]*|in[- ]*law/gi, '')
                .replaceAll(/[- ]{2,}/g, ' ')
                .replaceAll('m.', 'mom')
                .replaceAll('d.', 'daughter')
                .replaceAll('b.', 'brother');

            // Step 3: Restore the URLs using identifiers
            const finalContent = Array.from(urlMap.entries()).reduce((acc, [identifier, url]) => {
                return acc.replace(new RegExp(identifier, 'g'), url); // Replace identifiers back with original URLs
            }, newText);

            // Set the modified HTML back to the element
            element.innerHTML = finalContent;
        });

        overlay.remove(); // Remove overlay after processing
    };

    const scroll = () => {
        setTimeout(() => window.scrollTo(0, document.documentElement.scrollTop + 250), 50)
    }

    const scrollinterval = setInterval(scroll, 10)

    const interval = setInterval(() => {
        const images = document.querySelectorAll('img[src*="lightbox-blank"]');

        if (images.length === 0) {
            document.documentElement.scrollTop = 0
            setTimeout(() => { document.documentElement.scrollTop = 0 }, 50)
            document.body.style.overflow = 'visible';
            let_me_fantasise()
            document.querySelectorAll('.premium-results-line').forEach(e => e.style.display = "none")
            clearInterval(interval);
            clearInterval(scrollinterval)
            document.querySelectorAll('.frame-block.thumb-block.tb_full_init.tbm-init-ok').forEach(div => {
                const img = div.querySelector('img:nth-of-type(n)');
                if (img && !img.complete) {
                    div.remove();
                }
            });
        }
    }, 1000);

    const logo = document.getElementById('site-logo');
    if (logo) {
        const replacementText = document.createElement('span');
        replacementText.textContent = 'XVideos+';
        replacementText.className = 'newLogo'

        logo.parentNode.replaceChild(replacementText, logo);
    }

    const style = document.createElement('style');
    style.textContent = `
        .thumb-inside {
            border-radius: 21px !important;
            transform: scale(0.95) !important;
        }
        .video-hd-mark {
            border-radius: 4px !important;
            transform: translateX(-10px) translateY(5px)
        }
        .premium-results-line{
          display: none!important;
        }
        .search-premium-tabs {
          display: none!important;
        }
        #anc-tst-join_for_free-btn {
          display: none;
        }
        #anc-tst-join_for_free-btn {
          display: none;
        }
        .btn.btn-link.report-search {
            display: none;
        }
        .frame-block {
          border: none!important;
        }
        .head__btn.head__btn--join.btn-clear {
          display: none;
        }
        #xv-search-form {
          display: none!important;
        }
        .go_search_class {
          margin: 20px;
          border-radius: 10px;
          border: 1px;
          font-size: 10px;
        }
        .go_button_class{
          padding: 10px;
          font-size: 20px;
          border-radius: 8px;
          border: none;
          background: red!important;
          color: white;
        }
        #main {
          padding-top: 40px;
        }
        .go_search_class, textarea {
          background-color : #444;
        }
        .newLogo {
          font-size: 30px;
          font-style: italic;
          font-weight: bold;
          color: red !important;
        }
        /*
        .head__search{
              transform: translateX(30px);
        } */
        .go_input {
          padding-right: 90px;
          margin-left: 4vw;
          transform: scale(1.1);
        }
        .go_search_class {
          padding: 7px 8vw 7px 5vw !important;
        }
        .input-group {
          display: none;
        }
        a.live-cams.btn {
          display: none;
        }
        .ad-header-mobile-contener {
          display: none;
        }

        #html5video {
          border-radius: 20px;
        }
        #mobile-header-links {
          border: none!important;
        }
        #header-mobile-search-toggle {
          display: none;
        }
        *:not(#html5video):not(#html5video *):not(#site-logo-link *):not(textarea):not(input):not(button) {
            background-color: #111 !important;
            color: white !important;
        }
        @media (max-width: 599px)
            .go_search_class {
                border-radius: 10px;
                border: 1px solid;
                padding: 5px 5px 5px 14px;
                font-size: 4.5vw;
            }
            .go_button_class{
              padding: 10px;
              font-size: 14px;
              border-radius: 8px;
              border: none;
              background: red;
              font-weight: bold;
              color: white
            }
            .newLogo {
              font-size: 20px;
              font-style: italic;
              font-weight: bold;
              color: red !important;
            }
            .go_input {
              padding-right: 90px;
              margin-left: 6vw;
            }
            .go_search_class {
              padding: 7px 14vw 7px 1vw !important;
            }
        }
    `;
    document.head.appendChild(style);

})();
