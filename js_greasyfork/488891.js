// ==UserScript==
// @name         IMVU HTML Description Injector V5.1
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Adds button to inject HTML code into the description box on IMVU product edit page
// @author       Shop Spikes / add spcckz @ discord for any issues/feature requests you have
// @match        https://www.imvu.com/creator/edit_product_html/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488891/IMVU%20HTML%20Description%20Injector%20V51.user.js
// @updateURL https://update.greasyfork.org/scripts/488891/IMVU%20HTML%20Description%20Injector%20V51.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let textColor = localStorage.getItem('chosenColor') || '#ffffff';
    let textShadow = localStorage.getItem('rememberShadow') === 'true' ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none';

    function toggleDropShadow() {
        textShadow = document.getElementById('dropShadowCheckbox').checked ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none';
        injectHTMLCode();
        localStorage.setItem('rememberShadow', document.getElementById('dropShadowCheckbox').checked);
    }

    function changeFontColor() {
        textColor = document.getElementById('fontColorPicker').value;
        injectHTMLCode();
        localStorage.setItem('chosenColor', textColor);
    }

    function getUserIdFromLink() {
        const userIdMatch = document.querySelector('a.notranslate').getAttribute('href').match(/user=(\d+)/);
        return userIdMatch ? userIdMatch[1] : null;
    }

    function injectHTMLCode() {
        const userId = getUserIdFromLink();
        const derivedFromNumber = window.location.href.match(/edit_product_html\/(\d+)/) ? window.location.href.match(/edit_product_html\/(\d+)/)[1] : '';

        if (userId) {
            const userImages = document.getElementById('userImages').value.split('\n');
            const backgroundImage = localStorage.getItem('chosenImage') || '';
            const bannerCode = document.getElementById('bannerBox').value.trim();
            const footerTextColor = document.getElementById('fontColorPicker').value;
            const additionalHtml = document.getElementById('additionalHtml').value;
            const username = document.getElementById('usernameInput').value.trim(); // Added username input

            // Added category buttons with dynamic username
            const categoryButtonsHTML = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Button Links</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
        }

        .button-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 10px; /* Adjust minimum height to ensure full viewport coverage */
            gap: 25px; /* Add some space between columns */
            padding: 20px; /* Add padding as necessary */
        }

        .column {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1; /* Ensure columns grow to fill container */
        }

        .column h2 {
            margin-bottom: 20px;
        }

        .styled-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 150px; /* Fixed width for all buttons */
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #333;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            margin: 10px 0;
            transition: background-color 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Add drop shadow */
        }

        .styled-button:hover {
            background-color: #555;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Add drop shadow */
        }
    </style>
</head>
<body>
    <div class="button-container">
        <div class="column">
            <h2>MALE</h2>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-41-71&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Accessories
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-41-68&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Skins
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-41-91&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Eyes
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-41-67&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Hair
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-41-69&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Tops
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-41-70&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Pants
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-41-102&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Shoes
            </a>
        </div>
        <div class="column">
            <h2>FEMALE</h2>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-40-153&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Accessories
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-40-76&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Skins
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-40-89&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Eyes
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-40-75&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Hair
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-40-128&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Tops
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-40-78&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Pants
            </a>
            <a href="https://www.imvu.com/shop/web_search.php?keywords=${username}&within=creator_name&page=1&cat=106-40-101&bucket=&tag=&sortorder=desc&quickfind=new&product_rating=-1&offset=27&narrow=&manufacturers_id=&derived_from=0&derivable=0&sort=id" class="styled-button" target="_blank">
                Shoes
            </a>
        </div>
    </div>
`;

            const dropShadowImageUrl = 'https://userimages-akm.imvu.com/userdata/38/39/59/89/userpics/Snap_j4ogbJlGKQ1012285644.png';

            const imageHTML = userImages.map(image => `<center><div style="position: relative; display: inline-block;"><img src="${image.trim()}" style="position: relative; z-index: 1;"><img src="${dropShadowImageUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;"></div></center>`).join('');

            const gaf210Code = `<center><!-- Product Marquee made @ gaf210.gafcodes.com --><style>.imvustylez_products_marquee{margin:0 auto}.imvustylez_products_marquee [id$="_panel_header"]{display:none!important;font-size:1px}.imvustylez_products_marquee [id$="_panel_body"]{line-height:1px}.imvustylez_products_marquee .productbox,.imvustylez_products_marquee .productbox img{width:100px!important;height:80px!important}</style><marquee class='imvustylez_products_marquee' width='500' height='100' scrollamount='12' direction='left' behavior='scroll' onmouseover="this.stop()" onmouseout="this.start()"><div style='width:2675px'><script src="https://gaf210.gafcodes.com/newprodsbanner/filtered_dev_panel.js.php?dev_id=${userId}&pn=new&q=25"></script></div></marquee></center>`;

            const iframeCode = `<center><a href="https://www.imvu.com/shop/web_search.php?derived_from=${derivedFromNumber}" target="_blank">CLICK HERE to open derivations of this item in a new tab</a><iframe name="Derived Products" src='https://www.imvu.com/shop/web_search.php?derived_from=${derivedFromNumber}?keywords=Punishment&within=creator_name&sortorder=desc&quickfind=new&sort=id#products' width='775' height='105' scrolling="no" style="margin: 0; padding: 0;"></iframe></center>`;

const injectedHtmlCode = `
    <center>${gaf210Code}${iframeCode}${categoryButtonsHTML}
    <style>
        html, body {
        }
        body {
            background-image: url('${backgroundImage}');
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-size: cover;
            color: ${textColor};
            text-shadow: ${textShadow};
            padding: 0;
            margin: 0;
            overflow: visible;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

        .body-content {
            overflow-y: visible; /* Enable scrolling for content that exceeds viewport height */
        }

        .autoHtmlFooter {
            font-size: 16px;
            color: ${footerTextColor};
            margin: 0;
            padding: 0px;
            overflow-y: visible;
            text-align: right;
        }
        .preview-container {
            flex: 1; /* This makes the preview container grow to fill available space */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-y: visible;
        }
    </style>
    <div class="preview-container">${imageHTML}</div>
    ${bannerCode ? bannerCode : ''}
    <div class="autoHtmlFooter">EZ-AutoHTML by Spikes, spcckz@discord</div>
    ${additionalHtml}
</center>`;


            const descriptionTextarea = document.querySelector('#description');
            if (descriptionTextarea) {
                descriptionTextarea.value = injectedHtmlCode;
            }
        }
    }

    function loadSavedValues() {
        document.getElementById('userImages').value = localStorage.getItem('userImages') || '';
        document.getElementById('bannerBox').value = localStorage.getItem('bannerCode') || '';
        document.getElementById('backgroundImageInput').value = localStorage.getItem('chosenImage') || '';
        document.getElementById('additionalHtml').value = localStorage.getItem('additionalHtml') || '';
        document.getElementById('usernameInput').value = localStorage.getItem('username') || '';
    }

    function saveInputValues() {
        localStorage.setItem('userImages', document.getElementById('userImages').value);
        localStorage.setItem('bannerCode', document.getElementById('bannerBox').value);
        localStorage.setItem('chosenImage', document.getElementById('backgroundImageInput').value);
        localStorage.setItem('additionalHtml', document.getElementById('additionalHtml').value);
        localStorage.setItem('username', document.getElementById('usernameInput').value.trim());
    }

    function addButtonAndInput() {
        const container = document.createElement('div');
        container.style.cssText = 'position:absolute;top:235px;right:200px;z-index:9999;font-size:16px;display:flex;flex-direction:column;align-items:center';

        const input = document.createElement('textarea');
        input.id = 'userImages';
        input.rows = 6;
        input.placeholder = 'Enter preview image URLs here. To add more, press Shift+Enter after the first URL.';

        const bannerLabel = document.createElement('label');
        bannerLabel.htmlFor = 'bannerBox';
        bannerLabel.textContent = 'Banner HTML Code';

        const bannerBox = document.createElement('textarea');
        bannerBox.id = 'bannerBox';
        bannerBox.rows = 6;
        bannerBox.placeholder = 'Enter banner HTML code here.';
        bannerBox.value = localStorage.getItem('bannerCode') || '';

        const backgroundImageInput = document.createElement('input');
        backgroundImageInput.type = 'text';
        backgroundImageInput.id = 'backgroundImageInput';
        backgroundImageInput.placeholder = 'Enter background image URL';
        backgroundImageInput.value = localStorage.getItem('chosenImage') || '';

        const bgImgLabel = document.createElement('label');
        bgImgLabel.htmlFor = 'backgroundImageInput';
        bgImgLabel.textContent = 'Background Image URL';

        const button = document.createElement('button');
        button.textContent = 'Inject HTML Code';
        button.addEventListener('click', injectHTMLCode);

        const shadowCheckbox = document.createElement('input');
        shadowCheckbox.type = 'checkbox';
        shadowCheckbox.id = 'dropShadowCheckbox';
        shadowCheckbox.checked = textShadow !== 'none';
        shadowCheckbox.addEventListener('change', toggleDropShadow);

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = 'fontColorPicker';
        colorPicker.value = localStorage.getItem('chosenColor') || textColor;
        colorPicker.addEventListener('input', changeFontColor);

        const colorLabel = document.createElement('label');
        colorLabel.htmlFor = 'fontColorPicker';
        colorLabel.textContent = 'Font Color';

        const shadowLabel = document.createElement('label');
        shadowLabel.htmlFor = 'dropShadowCheckbox';
        shadowLabel.textContent = 'Font Drop Shadow';

        const additionalHtmlLabel = document.createElement('label');
        additionalHtmlLabel.htmlFor = 'additionalHtml';
        additionalHtmlLabel.textContent = 'Additional HTML';

        const additionalHtml = document.createElement('textarea');
        additionalHtml.id = 'additionalHtml';
        additionalHtml.rows = 6;
        additionalHtml.placeholder = 'Enter additional HTML code here.';
        additionalHtml.value = localStorage.getItem('additionalHtml') || '';

        const usernameInput = document.createElement('input'); // Added username input
        usernameInput.type = 'text';
        usernameInput.id = 'usernameInput';
        usernameInput.placeholder = 'Enter your username';
        usernameInput.value = localStorage.getItem('username') || '';
        usernameInput.addEventListener('input', () => {
            localStorage.setItem('username', usernameInput.value.trim());
        });

        container.appendChild(usernameInput); // Moved username input above the inject button
        container.appendChild(button);
        container.appendChild(input);
        container.appendChild(bgImgLabel);
        container.appendChild(backgroundImageInput);
        container.appendChild(colorLabel);
        container.appendChild(colorPicker);
        container.appendChild(document.createElement('br'));
        container.appendChild(shadowLabel);
        container.appendChild(shadowCheckbox);
        container.appendChild(document.createElement('br'));
        container.appendChild(bannerLabel);
        container.appendChild(bannerBox);
        container.appendChild(document.createElement('br'));
        container.appendChild(additionalHtmlLabel);
        container.appendChild(additionalHtml);

        document.body.appendChild(container);

        loadSavedValues(); // Load saved input values on page load

        window.addEventListener('beforeunload', saveInputValues); // Save input values before leaving the page
    }

    window.addEventListener('load', addButtonAndInput);

})();