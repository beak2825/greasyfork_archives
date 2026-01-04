// ==UserScript==
// @name         YoutubeVR
// @namespace    http://YoutubeVR.net
// @version      1.0
// @description  YoutubeVR Plugin
// @author       Sofiene DJEBALI
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40160/YoutubeVR.user.js
// @updateURL https://update.greasyfork.org/scripts/40160/YoutubeVR.meta.js
// ==/UserScript==

(function() {
    $ytBtn = document.querySelector('.ytp-button.ytp-settings-button');
    if ($ytBtn) {
        console.log('STARTING YOUTUBE VR');
        $vrBtn = document.createElement('img');
        $vrBtn.width = 25;
        $vrBtn.style.position = 'relative';
        $vrBtn.style.bottom = '5px';
        $vrBtn.style.cursor = 'pointer';
        $vrBtn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMBSURBVGhD7Zm7axRRFMazKsRIRO0kSCwCihZ2+h9YaAQf2wgBH6hB6wiWFhpNQKtUIT46FZ9JJdgqJIQIElCrdFoJphKM0V1/Z+YzspuZy8zddTLg/cHHzL3nO989dwnLih2BQCAQCBRBrVbbg26gR/V6/fG/FGc8RMNot45vDwSeRcscUiic+QOd0hitYZ+KBSq7cDh7Ce3SOP4QMqzMNYMZrmscfwg5SdbIWspm0Dj/MXwKm9FRPpHBMshmsZk0XjZoOIK+EFAqbCbUrzHdYNyHltRbOpjtO9qrcdPBdF89pYUZ72rcdDC9lb/MzGncdLjIvMylxWbUuOmEixRI2y6CZxHVtGwblgmLWqaCx/8i7C+gAV675etCVfQ+dvhDxjw6wetGy+bZzXoALUSGJsxvPidmkn8F9mZ4bJGlAfY3UX8VGT2g9yXqUlwDlLfp7AbYy38R1t9Qj8qJYLMDc/8SUM9WxSSCZ4fNEHfEsPa6yIRKTvCNqiUPI2p3QvY9+SN8L3JeJSf4jqslD8fU7oTsC/JH+F7ktEpO8B1WS2boOaR2J1jPxB0xvhcZVckJvitqyQw9l9XuBN8ttUTYjCqlYyb5I1h/QonfKn/AtgHPx7gjO/R84LFeMYlQt2/Fz1GDYJ3/IgZ74zwqsqyCmv2T1AuybypmFZQr1O/Ezr94X8Rg/znaKVsE6x7U8s9+ZWxXbISdhV7EjkbY97+IQe0XjzmeU2gG/YwryVB/jS6iS+iNthOhvowsc4qlnWFnJUKttYvkgZwnPFb+/u2dvadRsUUKuwgZRp/yDpr03mcF2bwhorCLzCqrE32VOrU3K5s3ZGS6yDv5vSFjSFlVbdleVXtD2vLGZrQsJ5gSvymyQr/96fQqazLejfYnbY/XXnm8of2ZZTnB1C+/F/RPWw6v63gfQ+PSmO3pjOnI7An9mX7a2EHX1JMbes8pJhXzyJ4L+oyriskGDQfQbfoT/zOmWXgf8BxUuxN8FfOqJzGvWTYL2q+IQCAQCATaSEfHbzt1pDfLYTAmAAAAAElFTkSuQmCC';
        $ytBtn.parentNode.insertBefore($vrBtn, $ytBtn);

        $vrBtn.addEventListener('click', () => {
            $iframe = document.createElement('iframe');
            $iframe.src = 'https://google.fr';
            window.open('https://ad218564.eu.ngrok.io/?' + window.location.search.substr(1), "YOUTUBE VR","menubar=1,resizable=0,width=500,height=500");
            document.querySelector('ytd-app').appendChild($iframe);
        });
    }

    function getQueryParams(qs) {
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens == re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }
})();