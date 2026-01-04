// ==UserScript==
// @name         Alwazah Customizer
// @namespace   http://tampermonkey.net/
// @version     1.3
// @description Change Twitter Favicon and SVG Path
// @author      Abuabdallah
// @match       https://twitter.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/471897/Alwazah%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/471897/Alwazah%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // Favicon Changer
        var link = document.querySelector("link[rel='shortcut icon']");
        if (link) {
            link.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAyCAQAAACJpCFcAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAd0SU1FB+cHGwYvGPdQUZ0AAAPHSURBVFjDrZhdbBRVGIafWTatW2mLKNR2VWwIrUQEdGslGjDxgmhMTEMDYkxU/EmMF3CFGG80mhgS/4gKiYleaeQCvPCnGutPMEosIOEn1BhDWrQ1bZUWl9a42dK+XszM2TM7u6U7O+/czJyceeab95zznW/GoUjyTzI8xDqSHOMDjgI4VCX5xyq9oSH5Oqetbnv16MXapd8V1Li6q4J76Ix6NauwjmpJZLiHfljnVFrTkWMXQgk9rX9UXq9VA9+mSc2lg0pUCk94k28VL7AQgBnzxL+YjmqzgQPwOMuASV5kv9fSx718Fge8iY0AfMEh1gKQ41VOcNzqOcxsNMfXKevN51HjcEoJ7bc8fybSgAo9qJnA4P2hDqEW/WpapnR35Wh3BtxovAeY4Dl+BjppNW1D/BbV81arZYIdfAQsYBM1prWPsWiON+qIef0BbfZW6xqNWOtzS1TH7zIr8zvdbjLjS9YYnFFL1NX5uof4WEsN+mYNWPBXoi79Np2VJPWrzaAd7bXQY7otKvwx5SXltc0FCKF7dN6C760sq/ghAtqii5rR20qZuBfpWws9Wkncsg5AKT2grWqw4t4eWFLvyJkf3GCX6Qk1KPgs73ylNwauRnRrGK3yR1pPql/fKCUg6Vi3ADXsYrnFOcDJwr4fiv8KHCBBI3WkaSPDBtpJ0Md/AMmi7vez2boa4X2fqAIwTTsraKWe66kFEjRxJYuoM/edLvWqS/VTIIG9K8fYhVC7tqtHw8rNuWeNq1MhNHo+0OmCNlhurtTuUMlRWp+oNgxfHhhKqUe1ppbZocF5gaWs7iuaAkKOSQO+3pKb1rr1Q1G+n0v7lAzAhdCKUM1yQGv0lL6/jMNBHdF14bjRzlDHvCZ0qQKwJH2tDi0ojrxRhyvElNO4XvYH1N/eVnPLPNPH5TTNkF/vJL3lcQf1saCP8SyH/As3cofVsaDFSf4MbPZCteqNyXFpSO+p1fa8nuaYHIerOM+4a7ZvS5UfPJY+ZR9TriMufJKR2OBd9HKQTQVbcpyNDZ6inTSD3pUQ6lI+tiHtV8ZNeI6L5xp66Iwp9kmOc4J+LhRif6SiBDUfDRTgNdoTK/qU1tu+L9aHJb9Bo+hHZYpzeqN2a6pqcFZ71FIqqyfVVVXyzekrbXQzelEh4u2YS7RTpyveJqSsvlS3Fpb9CWH2+iY9qs8D5ehc+ldn9KbWq86qEyn5E8Uqf26igztZSzMN1BQVUHlyXGSMQU5xmF8KnzUFZJmEZb1Wgqtp5gbSXGt1mGWQUYb5myyXysH+B8u7HKtjI4bYAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTI3VDA2OjQ3OjE1KzAwOjAwOm2wVAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNy0yN1QwNjo0NzoxNSswMDowMEswCOgAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMDctMjdUMDY6NDc6MjQrMDA6MDA03SVgAAAAAElFTkSuQmCC";
        }

        changeSVGPath();

        showCustomSvgForLimitedTime();

        let bodyList = document.querySelector('body');
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                changeSVGPath();
            });
        });

        let config = {
            childList: true
        };

        observer.observe(bodyList, config);
    }, false);

    function changeSVGPath() {
        let path = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > header > div > div > div > div:nth-child(1) > div.css-1dbjc4n.r-dnmrzs.r-1vvnge1 > h1 > a > div > svg > g > path");
        if (path) {
            path.setAttribute("d", "M10.472 4.445c1.057 0.038 1.78 0.553 2.168 1.544a6.197 6.197 0 0 1 -0.147 3.381 15.913 15.913 0 0 1 -0.588 1.617 112.485 112.485 0 0 0 -1.69 3.454 1.702 1.702 0 0 0 -0.074 1.029 0.756 0.756 0 0 0 0.551 0.035 41.997 41.997 0 0 0 2.94 -1.544 12.488 12.488 0 0 1 4.336 -0.662 5.945 5.945 0 0 0 3.308 -1.066 4.629 4.629 0 0 1 -0.551 2.352 23.748 23.748 0 0 1 -0.697 1.066l0.956 0.623a6.617 6.617 0 0 1 -1.102 0.917 7.432 7.432 0 0 0 1.25 0.623 10.882 10.882 0 0 1 -0.808 0.697 13.394 13.394 0 0 0 1.323 0.403 6.298 6.298 0 0 1 -0.808 0.808 0.722 0.722 0 0 0 0.368 0.184 31.008 31.008 0 0 0 1.469 0.293 8.135 8.135 0 0 1 -3.823 2.572 15.68 15.68 0 0 1 -7.497 0.441 9.048 9.048 0 0 1 -4.151 -2.093c-1.116 -1.323 -1.41 -2.818 -0.881 -4.484a17.689 17.689 0 0 1 0.662 -1.69 217.385 217.385 0 0 0 2.723 -4.631 10.708 10.708 0 0 0 0.772 -2.315c0.012 -0.38 -0.159 -0.551 -0.514 -0.514a52.353 52.353 0 0 1 -0.992 1.58 10.425 10.425 0 0 1 -1.911 1.69 6.872 6.872 0 0 1 -1.067 1.435c-0.46 0.168 -0.754 0.009 -0.881 -0.478 0.142 -0.529 0.326 -1.043 0.551 -1.544a128.94 128.94 0 0 0 0.441 -2.278 4.107 4.107 0 0 1 1.36 -1.799 9.046 9.046 0 0 1 3.014 -1.654ZM7.9 7.534c0.284 0.024 0.345 0.147 0.184 0.368 -0.147 0.248 -0.357 0.358 -0.623 0.329 -0.075 -0.077 -0.088 -0.162 -0.035 -0.258a3.958 3.958 0 0 1 0.478 -0.441Z");

            let svg = path.closest('svg');
            if (svg) {
                svg.setAttribute("viewBox", "5 4 19 19");
            }
        }
    }

    function showCustomSvgForLimitedTime() {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '-36 0 100 29');
        svg.style.position = 'fixed';
        svg.style.zIndex = '9999';
        svg.style.top = '50%';
        svg.style.left = '50%';
        svg.style.transform = 'translate(-50%, -50%)';
        svg.style.fill = 'white';

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M10.472 4.445c1.057 0.038 1.78 0.553 2.168 1.544a6.197 6.197 0 0 1 -0.147 3.381 15.913 15.913 0 0 1 -0.588 1.617 112.485 112.485 0 0 0 -1.69 3.454 1.702 1.702 0 0 0 -0.074 1.029 0.756 0.756 0 0 0 0.551 0.035 41.997 41.997 0 0 0 2.94 -1.544 12.488 12.488 0 0 1 4.336 -0.662 5.945 5.945 0 0 0 3.308 -1.066 4.629 4.629 0 0 1 -0.551 2.352 23.748 23.748 0 0 1 -0.697 1.066l0.956 0.623a6.617 6.617 0 0 1 -1.102 0.917 7.432 7.432 0 0 0 1.25 0.623 10.882 10.882 0 0 1 -0.808 0.697 13.394 13.394 0 0 0 1.323 0.403 6.298 6.298 0 0 1 -0.808 0.808 0.722 0.722 0 0 0 0.368 0.184 31.008 31.008 0 0 0 1.469 0.293 8.135 8.135 0 0 1 -3.823 2.572 15.68 15.68 0 0 1 -7.497 0.441 9.048 9.048 0 0 1 -4.151 -2.093c-1.116 -1.323 -1.41 -2.818 -0.881 -4.484a17.689 17.689 0 0 1 0.662 -1.69 217.385 217.385 0 0 0 2.723 -4.631 10.708 10.708 0 0 0 0.772 -2.315c0.012 -0.38 -0.159 -0.551 -0.514 -0.514a52.353 52.353 0 0 1 -0.992 1.58 10.425 10.425 0 0 1 -1.911 1.69 6.872 6.872 0 0 1 -1.067 1.435c-0.46 0.168 -0.754 0.009 -0.881 -0.478 0.142 -0.529 0.326 -1.043 0.551 -1.544a128.94 128.94 0 0 0 0.441 -2.278 4.107 4.107 0 0 1 1.36 -1.799 9.046 9.046 0 0 1 3.014 -1.654ZM7.9 7.534c0.284 0.024 0.345 0.147 0.184 0.368 -0.147 0.248 -0.357 0.358 -0.623 0.329 -0.075 -0.077 -0.088 -0.162 -0.035 -0.258a3.958 3.958 0 0 1 0.478 -0.441Z'); // Add your SVG path here

        svg.appendChild(path);

        document.body.appendChild(svg);

        setTimeout(function() {
            svg.remove();
        }, 170);
    }
})();
