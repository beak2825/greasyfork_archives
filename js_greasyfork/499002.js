// ==UserScript==
// @name         BuiltByBit+
// @version      1.0
// @description  Just better BuiltByBit
// @author       Xqedii
// @namespace    https://builtbybit.com/*
// @match        https://builtbybit.com/*
// @icon         https://cdn.discordapp.com/icons/930296976606629918/6c6b84b3dd570cf75eebda8563161618.webp?size=96
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499002/BuiltByBit%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/499002/BuiltByBit%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NewLogo = true

    const newLogoSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="363" viewBox="0 0 2600 363" xmlns:v="https://vecta.io/nano"><g transform="matrix(.93 0 0 .93 1164.67 181.5)"><g fill="#2d87c3">
<path vector-effect="non-scaling-stroke" transform="translate(-1250 -181.45)" d="M166.757.476L6.216 88.987c-2.668 1.471-2.64 5.318.05 6.75L92.067 141.4c1.165.62 2.567.597 3.711-.06l70.921-40.775c1.183-.68 2.639-.68 3.822.001l70.884 40.78c1.145.658 2.546.681 3.712.061l85.844-45.673c2.69-1.431 2.719-5.279.05-6.75L170.457.476a3.83 3.83 0 0 0-3.7 0z"/>
<path vector-effect="non-scaling-stroke" d="M91.909 164.786L5.641 118.888c-2.554-1.359-5.635.493-5.635 3.388L0 275.971a3.84 3.84 0 0 0 1.985 3.362l150.736 83.089a3.84 3.84 0 0 0 5.685-3.362v-91.528c0-1.374-.734-2.643-1.924-3.327l-60.614-34.861a3.84 3.84 0 0 1-1.924-3.328v-57.841a3.84 3.84 0 0 0-2.035-3.389zm153.397 0l86.268-45.898c2.554-1.359 5.635.493 5.635 3.388l.006 153.695a3.84 3.84 0 0 1-1.984 3.362l-150.736 83.089a3.84 3.84 0 0 1-5.685-3.362v-91.528c0-1.374.734-2.643 1.924-3.327l60.614-34.861a3.84 3.84 0 0 0 1.924-3.328v-57.841c0-1.42.782-2.723 2.034-3.389z" transform="translate(-1250 -181.46)"/>
<path vector-effect="non-scaling-stroke" d="M470.659 63.373c21.129 0 38.811 2.003 53.046 6.01 14.457 3.784 25.244 10.128 32.361 19.031 7.34 8.681 11.01 20.478 11.01 35.392 0 8.903-1.446 17.028-4.337 24.373s-7.118 13.356-12.678 18.03c-5.338 4.674-11.899 7.679-19.684 9.015v1.669c8.007 1.559 15.236 4.341 21.686 8.347s11.565 9.794 15.347 17.362 5.671 17.585 5.671 30.05c0 14.468-3.559 26.933-10.676 37.395-6.895 10.239-16.903 18.141-30.026 23.706-13.122 5.342-28.691 8.013-46.707 8.013h-89.077V63.373h74.064zm5.671 94.489c14.68 0 24.8-2.337 30.36-7.012 5.783-4.674 8.674-11.463 8.674-20.366 0-9.127-3.336-15.693-10.008-19.699s-17.238-6.01-31.695-6.01h-26.689v53.087h29.358zm-29.358 40.066v62.102H480c15.125 0 25.689-2.893 31.695-8.681 6.005-6.01 9.007-13.911 9.007-23.705 0-6.01-1.334-11.241-4.003-15.693-2.447-4.452-6.784-7.902-13.011-10.35s-14.68-3.673-25.356-3.673h-31.36zm384.291 19.699c0 16.472-3.669 31.385-11.009 44.74-7.117 13.133-18.016 23.595-32.695 31.386-14.457 7.568-32.806 11.352-55.048 11.352-31.583 0-55.604-8.014-72.062-24.04-16.459-16.249-24.689-37.618-24.689-64.106V63.373h50.378V209.28c0 19.588 4.003 33.388 12.01 41.402s19.906 12.019 35.698 12.019c11.12 0 20.128-1.892 27.023-5.676s11.899-9.682 15.013-17.695c3.336-8.014 5.004-18.141 5.004-30.384V63.373h50.377v154.254zm164.096 84.139H886.931v-28.714l29.026-13.356V105.442l-29.026-13.355V63.373h108.428v28.714l-29.025 13.355v154.254l29.025 13.356v28.714z" transform="translate(-1250 -181.45)"/>
<path vector-effect="non-scaling-stroke" transform="translate(-1250.01 -181.45)" d="M1052.63 301.766V63.373h50.38V260.03h96.75v41.736h-147.13z"/>
<path vector-effect="non-scaling-stroke" d="M1349.7 301.766h-50.38V105.442h-64.72V63.373h179.82v42.069h-64.72v196.324z" transform="translate(-1250 -181.45)"/></g>
<path vector-effect="non-scaling-stroke" transform="translate(-1250 -181.45)" d="M1555.91 63.373c20.24 0 37.15 1.892 50.71 5.676 13.79 3.784 24.14 10.128 31.03 19.031 7.12 8.681 10.68 20.256 10.68 34.724 0 9.349-1.67 17.696-5.01 25.042-3.33 7.122-8.23 13.132-14.68 18.029-6.22 4.675-14.01 7.791-23.35 9.349v1.669c9.56 1.559 18.13 4.452 25.69 8.681 7.56 4.007 13.57 9.906 18.01 17.696 4.45 7.791 6.68 17.919 6.68 30.384 0 14.468-3.45 26.821-10.35 37.061-6.67 10.016-16.34 17.695-29.02 23.038-12.46 5.342-27.36 8.013-44.71 8.013h-85.4V63.373h69.72zm6.01 99.497c18.68 0 31.47-3.005 38.36-9.015 7.12-6.009 10.68-14.913 10.68-26.71 0-12.02-4.23-20.59-12.68-25.709s-21.9-7.68-40.37-7.68h-35.69v69.114h39.7zm-39.7 29.382v79.464h43.7c19.35 0 32.81-3.784 40.37-11.352s11.34-17.584 11.34-30.049c0-7.568-1.67-14.246-5-20.033-3.34-5.788-9.01-10.239-17.02-13.356-7.78-3.116-18.46-4.674-32.02-4.674h-41.37zm273.65-17.362l58.39-111.517h38.7l-79.41 145.907v92.486h-35.69v-91.15l-79.41-147.243h39.04l58.38 111.517z" fill="#fff"/>
<path vector-effect="non-scaling-stroke" transform="translate(-1250 -181.45)" d="M2030.41 63.373c21.13 0 38.81 2.003 53.05 6.01 14.45 3.784 25.24 10.128 32.36 19.031 7.34 8.681 11.01 20.478 11.01 35.392 0 8.903-1.45 17.028-4.34 24.373s-7.12 13.356-12.68 18.03c-5.34 4.674-11.9 7.679-19.68 9.015v1.669c8.01 1.559 15.23 4.341 21.68 8.347s11.57 9.794 15.35 17.362 5.67 17.585 5.67 30.05c0 14.468-3.56 26.933-10.67 37.395-6.9 10.239-16.91 18.141-30.03 23.706-13.12 5.342-28.69 8.013-46.71 8.013h-89.07V63.373h74.06zm5.67 94.489c14.68 0 24.8-2.337 30.36-7.012 5.78-4.674 8.68-11.463 8.68-20.366 0-9.127-3.34-15.693-10.01-19.699-6.68-4.007-17.24-6.01-31.7-6.01h-26.69v53.087h29.36zm-29.36 40.066v62.102h33.03c15.13 0 25.69-2.893 31.7-8.681 6-6.01 9-13.911 9-23.705 0-6.01-1.33-11.241-4-15.693-2.45-4.452-6.78-7.902-13.01-10.35s-14.68-3.673-25.36-3.673h-31.36zm279.54 103.838h-108.43v-28.714l29.03-13.356V105.442l-29.03-13.355V63.373h108.43v28.714l-29.03 13.355v154.254l29.03 13.356v28.714zm149.02 0h-50.38V105.442h-64.72V63.373H2500v42.069h-64.72v196.324z" fill="#2d87c3"/></g><g transform="matrix(.42 0 0 .42 2329.61 73.9842)">
<path vector-effect="non-scaling-stroke" d="M295.516 216.494h154v78.992h-154v-78.992zm-233.042.02h154.05v78.971H62.474v-78.971z"/>
<path vector-effect="non-scaling-stroke" d="M216.525 295.465h79.001v154.05h-79.001v-154.05zm0-232.991h79.001v154.041h-79.001V62.474z"/>
<path vector-effect="non-scaling-stroke" d="M216.525 216.514h79.001v78.971h-79.001v-78.971z"/></g></svg>`

    function modifyPriceContainers() {
        let priceContainers1 = document.querySelectorAll("#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div:nth-child(1) > div > div > div.block-row.stat-row > div:nth-child(-n+4), " +
                                                         "#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div:nth-child(4) > div > div.block-body > div > div:nth-child(3), " +
                                                         "#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div:nth-child(4) > div > div.block-body > div > div:nth-child(4), " +
                                                         "#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div > div:nth-child(4) > div:nth-child(1) > div > div.block-body > div > table > tbody:nth-child(-n+30) > tr > td:nth-child(3), " +
                                                         "#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div > div:nth-child(5) > div:nth-child(1) > div > div.block-body > div > table > tbody:nth-child(-n+30) > tr > td:nth-child(3), " +
                                                         "#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div > div:nth-child(5) > div:nth-child(2) > div > div.block-body > div > table > tbody:nth-child(-n+30) > tr > td:nth-child(3), " +
                                                         "#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div > div:nth-child(6) > div > div.block-body > div > table > tbody:nth-child(-n+30) > tr > td:nth-child(5), " +
                                                         "#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div:nth-child(3) > div > div.block-body > div > table > tbody:nth-child(-n+30) > tr > td:nth-child(5)");
        priceContainers1.forEach((container) => {
            let priceElement = container.querySelector(".value");
            if (!priceElement) {
                priceElement = container
            }
            if (priceElement && !priceElement.dataset.modified) {
                let currentPriceText = priceElement.textContent.trim();
                let parts = currentPriceText.split('\n');
                let currentPrice = parts[0];

                let currentPriceNumber = parseFloat(currentPrice.replace('$', '').replace(',', ''));
                let currentPricePLN = convertToPLN(currentPriceNumber);

                let containerPLN = document.createElement('span');
                containerPLN.classList.add('price-container');

                let usdPriceElement = document.createElement('span');
                usdPriceElement.textContent = `${currentPrice} ⠀`;
                containerPLN.appendChild(usdPriceElement);

                let plnPriceElement = document.createElement('span');
                plnPriceElement.innerHTML = `<b>(${currentPricePLN.toLocaleString('pl-PL')} ${localStorage.getItem('settingsPrefix')})</b>`;
                containerPLN.appendChild(plnPriceElement);

                priceElement.innerHTML = '';
                priceElement.appendChild(containerPLN);

                priceElement.dataset.modified = true;

                animateText(plnPriceElement, `(${currentPricePLN.toLocaleString('pl-PL')} ${localStorage.getItem('settingsPrefix')})`);
            }
        });

        let priceContainers2 = document.querySelectorAll("#filterForm > div:nth-child(2) > div > div > div.block-row.stat-row > div:nth-child(-n+4)");

        priceContainers2.forEach((container, index) => {
            let priceElement = container.querySelector(".value");
            if (priceElement && !priceElement.dataset.modified) {
                let currentPriceText = priceElement.textContent.trim();
                let parts = currentPriceText.split('\n');
                let currentPrice = parts[0];

                let currentPriceNumber = parseFloat(currentPrice.replace('$', '').replace(',', ''));
                let currentPricePLN = convertToPLN(currentPriceNumber);

                let containerPLN = document.createElement('span');
                containerPLN.classList.add('price-container');

                let usdPriceElement = document.createElement('span');
                usdPriceElement.textContent = `${currentPrice} ⠀`;
                containerPLN.appendChild(usdPriceElement);

                let plnPriceElement = document.createElement('span');
                plnPriceElement.innerHTML = `(<b>${currentPricePLN.toLocaleString('pl-PL')} ${localStorage.getItem('settingsPrefix')}</b>)`;
                containerPLN.appendChild(plnPriceElement);

                priceElement.innerHTML = '';
                priceElement.appendChild(containerPLN);

                priceElement.dataset.modified = true;

                animateText(plnPriceElement, `(${currentPricePLN.toLocaleString('pl-PL')} ${localStorage.getItem('settingsPrefix')})`);

                let yearly = currentPricePLN * 12;
                if (index == 0) {
                    let headertext = document.querySelector("#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-pageContent > div:nth-child(1) > div > div > div:nth-child(1)");

                    if (headertext) {
                        let amount = currentPriceNumber*12
                        let roundedPLN = amount.toFixed(2);
                        headertext.innerHTML = `Over the last 30 days, you've earned ${currentPrice} <b>(${currentPricePLN.toLocaleString('pl-PL')} ${localStorage.getItem('settingsPrefix')})</b>. If this monthly earning trend continues throughout the year, your total earnings for the year would amount to $${roundedPLN} <b>(${yearly.toLocaleString('pl-PL')} ${localStorage.getItem('settingsPrefix')})</b>!`;
                    }
                }
            }
        });
    }

    function convertToPLN(priceUSD) {
        const usdToPlnExchangeRate = localStorage.getItem('settingsValue');
        return (priceUSD * usdToPlnExchangeRate).toFixed(2);
    }
    function changeLogo() {
        const existingLogo = document.querySelector('#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-navSticky.p-navSticky--all > div.p-nav--wrapper > nav > div > div.p-nav-smallLogo.custom-nav-logo > a > span.desktop-logo > svg');
        if (existingLogo) {
            if (existingLogo.innerHTML) {
                existingLogo.innerHTML = newLogoSVG;
            }
        }
    }

    function greetUser() {
        let nickElement = document.querySelector("#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-navSticky.p-navSticky--all > div.p-nav--wrapper > nav > div > div.p-nav-opposite > div.p-navgroup.p-account.p-navgroup--member > a.p-navgroup-link.p-navgroup-link--iconic.p-navgroup-link--user > span.p-navgroup-linkText");
        if (nickElement) {
            let nick = nickElement.textContent.trim();
            let headerElement = document.querySelector("#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div.p-body-main.p-body-main--withSideNav > div.p-body-content > div > div.p-body-header > div > h1");
            if (headerElement) {
                headerElement.style.textAlign = "center";
                animateText(headerElement, `Welcome ${nick}!`);
            }
        }
    }

    function animateText(element, text) {
        element.textContent = '';

        for (let i = 0; i < text.length; i++) {
            let letter = document.createElement('span');
            letter.textContent = text[i];
            letter.style.opacity = 0;
            letter.style.fontWeight = 'bold';
            element.appendChild(letter);

            setTimeout(() => {
                letter.style.transition = 'opacity 0.3s ease-in-out';
                letter.style.opacity = 1;
            }, i * 50);
        }
    }

    const element = document.querySelector("#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-navSticky.p-navSticky--all > div.p-nav--wrapper > nav > div > div.p-nav-opposite > div.p-navgroup.p-account.p-navgroup--member > a.p-navgroup-link.p-navgroup-link--iconic.p-navgroup-link--user > span.p-navgroup-linkText");
    if (element) {
        element.style.fontWeight = 'bold';
    }
    function modifyStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
    @keyframes fillTransition {
        0% { fill: rgb(232, 160, 26); }
        16.67% { fill: rgb(255, 51, 51); }
        33.33% { fill: rgb(180, 255, 51); }
        50% { fill: rgb(51, 255, 129); }
        66.67% { fill: rgb(51, 204, 255); }
        83.33% { fill: rgb(194, 51, 255); }
        100% { fill: rgb(232, 160, 26); }
    }
    @keyframes colorTransition {
        0% { stroke: rgb(232, 160, 26); }
        16.67% { stroke: rgb(255, 51, 51); }
        33.33% { stroke: rgb(180, 255, 51); }
        50% { stroke: rgb(51, 255, 129); }
        66.67% { stroke: rgb(51, 204, 255); }
        83.33% { stroke: rgb(194, 51, 255); }
        100% { stroke: rgb(232, 160, 26); }
    }
    .p-nav-smallLogo svg path,
    .xb-footer-block-1 svg path,
    .p-breadcrumbs li:first-of-type svg path {
        fill: rgb(232, 160, 26);
        transition: fill 0.3s ease-in-out;
        animation: fillTransition 5s;
    }
    .ct-chart .ct-series-b .ct-line,
    .ct-chart .ct-series-a .ct-line,
    .ct-chart .ct-series-b .ct-point,
    .ct-chart .ct-series-a .ct-point {
        stroke: rgb(232, 160, 26);
        transition: stroke 0.3s ease-in-out;
        animation: colorTransition 5s;
    }
    `;
        document.head.appendChild(styleElement);
    }
    function rainbowNick() {
        const uniqueIdElement = document.querySelector('div[class*="memberProfileBanner-"] h1 span span span span');
        if (uniqueIdElement) {
            uniqueIdElement.classList.add("gradient-text");
            uniqueIdElement.style.fontWeight = "bold";
        }

        const styleElement = document.createElement('style');
        styleElement.textContent = `
        @keyframes gradientShift {
            0% {
                background-position: 700% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        .gradient-text {
            background: linear-gradient(90deg,
                rgb(232, 160, 26),
                rgb(255, 51, 51),
                rgb(180, 255, 51),
                rgb(51, 255, 129),
                rgb(51, 204, 255),
                rgb(194, 51, 255),
                rgb(232, 160, 26)
            );
            background-size: 700% 700%;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            animation: gradientShift 25s linear infinite;
        }
        #top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-navSticky.p-navSticky--all > div.p-nav--wrapper > nav > div > div.p-nav-opposite > div.p-navgroup.p-account.p-navgroup--member > a.p-navgroup-link.p-navgroup-link--iconic.p-navgroup-link--user > span.p-navgroup-linkText {
            color: transparent;
            background: linear-gradient(90deg,
                rgb(232, 160, 26),
                rgb(255, 51, 51),
                rgb(180, 255, 51),
                rgb(51, 255, 129),
                rgb(51, 204, 255),
                rgb(194, 51, 255),
                rgb(232, 160, 26)
            );
            background-size: 700% 700%;
            background-clip: text;
            -webkit-background-clip: text;
            animation: gradientShift 25s linear infinite;
        }
    `;
        document.head.appendChild(styleElement);
    }
    function rainbowNick2(uniqueId) {
        let uniqueIdElement = document.querySelector(`#${uniqueId}`);
        let animationName = `gradientShift-${uniqueId}`;

        if (!uniqueIdElement) {
            // Jeśli element o danym ID nie istnieje, użyj domyślnego identyfikatora
            uniqueIdElement = document.querySelector("#js-XFUniqueId12");
            animationName = 'gradientShift';
        }

        if (uniqueIdElement) {
            const spanElement = uniqueIdElement.querySelector("span");
            if (spanElement) {
                spanElement.classList.add("rainbow-text");
            }
        }

        const styleElement = document.createElement('style');
        styleElement.textContent = `
        @keyframes ${animationName} {
            0% {
                background-position: 700% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        .rainbow-text {
            background: linear-gradient(90deg,
                rgb(232, 160, 26),
                rgb(255, 51, 51),
                rgb(180, 255, 51),
                rgb(51, 255, 129),
                rgb(51, 204, 255),
                rgb(194, 51, 255),
                rgb(232, 160, 26)
            );
            background-size: 700% 700%;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            animation: ${animationName} 25s linear infinite;
        }

        .username--style13 {
            background: linear-gradient(90deg,
                rgb(232, 160, 26),
                rgb(255, 51, 51),
                rgb(180, 255, 51),
                rgb(51, 255, 129),
                rgb(51, 204, 255),
                rgb(194, 51, 255),
                rgb(232, 160, 26)
            );
            background-size: 700% 700%;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            animation: ${animationName} 25s linear infinite;
        }
    `;
        document.head.appendChild(styleElement);
    }
    function createTebexWalletButton() {
        if (!document.querySelector('a[href="https://wallet.tebex.io/wallet"]')) {
            let button = document.createElement('a');
            button.href = 'https://wallet.tebex.io/wallet';
            button.textContent = 'Tebex Wallet';
            button.style.backgroundColor = '#e8a01a';
            button.style.color = '#ffffff';
            button.style.padding = '10px 15px';
            button.style.borderRadius = '5px';
            button.style.textDecoration = 'none';
            button.target = '_blank';
            button.style.display = 'block';
            button.style.marginBottom = '9px';
            button.style.marginTop = '9px';
            let filterBar = document.querySelector('#filterForm > div:nth-child(2) > div > div > div.block-filterBar.block-filterBar--analytics');
            if (filterBar) {
                filterBar.insertBefore(button, filterBar.firstChild);
                button.style.marginLeft = '10px';
            }
        }
    }

    function rgbToHex(rgb) {
        let match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) {
            return rgb;
        }
        let hex = "#" + ("0" + parseInt(match[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(match[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(match[3], 10).toString(16)).slice(-2);
        return hex;
    }
    function createSettingsButton() {
        if (!document.querySelector('button.settings-button')) {
            let button = document.createElement('button');
            button.className = 'settings-button';
            button.textContent = 'Settings';
            button.style.backgroundColor = '#e8a01a';
            button.style.color = '#ffffff';
            button.style.padding = '8px 15px';
            button.style.borderRadius = '5px';
            button.style.marginRight = '8px';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.textDecoration = 'none';
            button.style.marginTop = '6px';

            button.addEventListener('click', toggleSettingsModal);

            let navGroupMember = document.querySelector("#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-navSticky.p-navSticky--all > div.p-nav--wrapper > nav > div > div.p-nav-opposite > div.p-navgroup.p-account.p-navgroup--member");
            if (navGroupMember) {
                navGroupMember.appendChild(button);
            }
        }
    }

    function toggleSettingsModal() {
        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        overlay.style.zIndex = '1000';
        document.body.appendChild(overlay);

        let modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#161c27';
        modal.style.padding = '20px';
        modal.style.borderRadius = '5px';
        modal.style.zIndex = '1100';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(modal);

        let closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = '#121721';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.padding = '5px 10px';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        });
        modal.appendChild(closeButton);

        let header = document.createElement('h2');
        header.textContent = 'Settings';
        header.style.textAlign = 'center';
        header.style.marginBottom = '20px';
        header.style.color = '#fff';
        modal.appendChild(header);

        createOption(modal, 'Value', 'number');
        createOption(modal, 'Prefix', 'text');
        createSeparator(modal);
        createCheckboxOption(modal, 'Colors Anim', 'checkbox', false);
        createCheckboxOption(modal, 'New Logo', 'checkbox', false);

        let valueInput = modal.querySelector('input[name="value"]');
        let prefixInput = modal.querySelector('input[name="prefix"]');
        let colorsAnimCheckbox = modal.querySelector('input[name="colorsanim"]');
        let newLogoCheckbox = modal.querySelector('input[name="newlogo"]');

        if (valueInput) {
            valueInput.value = localStorage.getItem('settingsValue') || '4.04';
        }
        if (prefixInput) {
            prefixInput.value = localStorage.getItem('settingsPrefix') || 'PLN';
        }
        if (colorsAnimCheckbox) {
            colorsAnimCheckbox.checked = localStorage.getItem('settingsColorsAnim') === 'true';
        }
        if (newLogoCheckbox) {
            newLogoCheckbox.checked = localStorage.getItem('settingsNewLogo') === 'true';
        }
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        });
    }

    function createOption(parent, label, type) {
        let labelElement = document.createElement('label');
        labelElement.textContent = label + ': ';
        labelElement.style.color = '#ffffff';
        parent.appendChild(labelElement);

        let input = document.createElement('input');
        input.type = type;
        input.name = label.toLowerCase();
        input.style.marginBottom = '10px';
        input.style.color = '#ffffff';
        input.style.marginLeft = '5px';
        input.style.border = '1px solid #0c1017';
        input.style.backgroundColor = '#121721';
        input.style.borderRadius = '5px';
        input.addEventListener('input', () => {
            localStorage.setItem('settings' + label, input.value);
        });
        parent.appendChild(input);

        parent.appendChild(document.createElement('br'));
    }


    function createCheckboxOption(parent, label, type, checked) {
        let container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginBottom = '-10px';

        let labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.style.color = '#fff';
        labelElement.style.marginRight = '10px';
        container.appendChild(labelElement);

        let input = document.createElement('input');
        input.type = type;
        input.name = label.toLowerCase().replace(/\s+/g, '');
        input.checked = checked;
        input.style.verticalAlign = 'middle';
        input.addEventListener('change', () => {
            localStorage.setItem('settings' + label.replace(/\s+/g, ''), input.checked.toString());
        });
        container.appendChild(input);

        parent.appendChild(container);
        parent.appendChild(document.createElement('br'));
    }
    function createSeparator(parent) {
        let container = document.createElement('div');
        container.style.marginBottom = '15px';

        parent.appendChild(container);
    }
    function addBoldText() {
        const uniqueIdElements = document.querySelectorAll("[id^='js-XFUniqueId']");
        const topElement = document.querySelector("#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-navSticky.p-navSticky--all > div.p-nav--wrapper > nav > div > div.p-nav-opposite > div.p-navgroup.p-account.p-navgroup--member > a.p-navgroup-link.p-navgroup-link--iconic.p-navgroup-link--user > span.p-navgroup-linkText");
        const textToCompare = topElement.textContent.trim();

        function hasSpanWithText(element, text) {
            const spanElement = element.querySelector("span");
            return spanElement && spanElement.textContent.trim() === text;
        }
        uniqueIdElements.forEach(uniqueIdElement => {
            const spanElement = uniqueIdElement.querySelector("span");
            if (spanElement && hasSpanWithText(uniqueIdElement, textToCompare)) {
                spanElement.style.fontWeight = "bold";
                rainbowNick2(uniqueIdElement.id);
            }
        });
    }
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (localStorage.getItem('settingsNewLogo') == "true") {
                    changeLogo();
                }
                modifyPriceContainers();
                greetUser();
                createTebexWalletButton();
                createSettingsButton();
                addBoldText();
                if (localStorage.getItem('settingsColorsAnim') == "true") {
                    modifyStyles();
                    rainbowNick();
                }
            });
        } else {
            if (localStorage.getItem('settingsNewLogo') == "true") {
                changeLogo();
            }
            modifyPriceContainers();
            greetUser();
            createTebexWalletButton();
            createSettingsButton();
            addBoldText();
            if (localStorage.getItem('settingsColorsAnim') == "true") {
                modifyStyles();
                rainbowNick();
            }
        }
    }

    initialize();
})();
