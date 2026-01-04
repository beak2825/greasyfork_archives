// ==UserScript==
// @name        TesterTV_AmazonCamel
// @namespace   https://greasyfork.org/ru/scripts/517334-testertv-amazoncamel
// @description Embeds CamelCamelCamel price chart in Amazon and adds centered click zoom effect on images
// @license     GPL version 3 or any later version for my code part !!!
// @author      TesterTV
// @include     http://www.amazon.*/*
// @include     https://www.amazon.*/*
// @include     http://smile.amazon.*/*
// @include     https://smile.amazon.*/*
// @version     2024.11.21
// @grant       GM_openInTab
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/517334/TesterTV_AmazonCamel.user.js
// @updateURL https://update.greasyfork.org/scripts/517334/TesterTV_AmazonCamel.meta.js
// ==/UserScript==

$(document).ready(function () {
    // CamelCamelCamel price chart setup
    const width = 600;
    const height = 400;
    const duration = "1y";

    //const chart = "amazon";
    const chart = "amazon-new";
    //const chart = "amazon-new-used";

    let currentUrl = window.location.href;
    let previousUrl = currentUrl;
    let element = getElementFromUrl(currentUrl);

    const country = getCountryCode(document.domain);

    if (element) {
        const imgSrc = getImageSrc(country, element, width, height, duration);
        const camelCamelCamelElement = createChartElement(imgSrc);
        $("#apex_desktop").parent().children("hr")[0].after(camelCamelCamelElement);
    }

    // Function to extract element ID from URL
    function getElementFromUrl(url) {
        const dpIndex = url.indexOf("/dp/");
        if (dpIndex !== -1) {
            let urlRest = url.slice(dpIndex + 4);  // Remove "/dp/"
            const firstSlashIndex = urlRest.indexOf('/');
            const firstQueryIndex = urlRest.indexOf('?');
            const cutOffIndex = Math.min(
                firstSlashIndex !== -1 ? firstSlashIndex : Infinity,
                firstQueryIndex !== -1 ? firstQueryIndex : Infinity
            );
            return urlRest.slice(0, cutOffIndex);
        }

        // If "/dp/" is not found, check for "/gp/product/"
        const gpProductIndex = url.indexOf("/gp/product/");
        if (gpProductIndex !== -1) {
            let urlRest = url.slice(gpProductIndex + 12);  // Remove "/gp/product/"
            const firstSlashIndex = urlRest.indexOf('/');
            const firstQueryIndex = urlRest.indexOf('?');
            const cutOffIndex = Math.min(
                firstSlashIndex !== -1 ? firstSlashIndex : Infinity,
                firstQueryIndex !== -1 ? firstQueryIndex : Infinity
            );
            return urlRest.slice(0, cutOffIndex);
        }

        // If neither "/dp/" nor "/gp/product/" is found
        return null;
    }


    // Function to get country code from domain
    function getCountryCode(domain) {
        const arr = domain.split(".");
        let country = arr[arr.length - 1];
        return country === "com" ? "us" : country;
    }

    // Function to generate image source URL
    function getImageSrc(country, element, width, height, duration) {
        const prot = window.location.protocol;
        return `${prot}//charts.camelcamelcamel.com/${country}/${element}/${chart}.png?force=1&zero=0&w=${width}&h=${height}&desired=false&legend=1&ilt=1&tp=3${duration}&fo=0`;
    }

    // Function to create chart element
    function createChartElement(src) {
        const camelCamelCamelElement = document.createElement("div");
        camelCamelCamelElement.id = "camelCamelCamelChart";
        camelCamelCamelElement.style = "width: 100%; height: 100%;";
        camelCamelCamelElement.innerHTML = `
            <div id='camelcamelcamel' style='margin-top: 0px; margin-left: 0px'>
                <a>
                    <img id='camelcamelcamelimg' src='${src}' class='zoomable'/>
                </a>
            </div>`;
        return camelCamelCamelElement;
    }

    // Function to update the image source
    function updateImageSource() {
        currentUrl = window.location.href;
        if (currentUrl !== previousUrl) {
            previousUrl = currentUrl;
            element = getElementFromUrl(currentUrl);
            if (element) {
                const newSrc = getImageSrc(country, element, width, height, duration);
                $('#camelcamelcamelimg').attr('src', newSrc);
            }
        }
    }

    // Check the URL every second
    setInterval(updateImageSource, 500);

    // Zoom effect CSS for centered zoom
    $('head').append(`
        <style>
            /* Dark overlay */
            .zoom-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            /* Zoomable image styling */
            .zoomable {
                cursor: zoom-in;
                transition: transform 0.2s ease;
            }
            /* Centered zoomed image */
            .zoomed-img {
                max-width: 60vw;
                max-height: 60vh;
                transform: scale(1.5); /* Adjust as needed */
            }
        </style>
    `);

    // Click event to create overlay with centered zoom
    $('body').on('click', '.zoomable', function (event) {
        event.preventDefault();  // Prevent the default link behavior (navigation)

        const $img = $(this).clone().addClass('zoomed-img');  // Clone and style the zoomed image
        const $overlay = $('<div class="zoom-overlay"></div>').append($img);

        // Append overlay to body
        $('body').append($overlay);

        // Close overlay on click outside the image
        $overlay.on('click', function (e) {
            if (!$(e.target).is('.zoomed-img')) {
                $overlay.remove();
            }
        });

        // Close overlay on mouse leave from the image
        $img.on('mouseleave', function () {
            $overlay.remove();
        });
        // Close overlay on mouse leave from the image
        $img.on('click', function (e) {
            $overlay.remove();
        });

    });

    // Add event listener for middle mouse button click on images
    $('body').on('auxclick', 'img', function(event) {
        if (event.which === 2 && this.src.includes('amazon-new')) {
            event.preventDefault();
            const currentUrl = window.location.href;
            const element = getElementFromUrl(currentUrl);
            if (element) {
                const country = getCountryCode(document.domain);
                const camelUrl = `https://${country}.camelcamelcamel.com/product/${element}`;
                GM_openInTab(camelUrl, { active: false });
            }
        }
    });

});