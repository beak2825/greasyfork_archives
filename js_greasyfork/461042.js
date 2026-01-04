// ==UserScript==
// @name 유튜브 토글러
// @namespace 유튜브 토글러
// @version       0.1
// @description 유튜브 영상에서 Ctrl+Shift+Y를 눌러 큰 화면과 작은 화면 주소를 토글(리다이렉트)합니다.
// @match https://www.youtube.com/*
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAe1BMVEVHcEymAACFhYXkAAC/AADyAADTAAD/////Ly//AwPhBgbxAAAmAAD5AADxAADJAADVBATaDw+BAADTAgL/LCzWAADhCAjfGhr/KCjnAAD0AADOAAD/AAD/////9/f/7+//e3v/UFD/vr7/qan/PT3/39//kJD/Kir/zc0Q/tNHAAAAHHRSTlMALQOZg+HKD8j9S+wQ88ttWX4fO6+0imqYqbniBuNvagAAAZNJREFUWIXtlt1ygjAQhTdEaBOSQEQBNVGrrfX9n7ABRlvR/EhueuGZYRgg52MTluwCvPTSv1LCEKpo00jZtovF4n0sc69ta9k0Ja0QYsnIPpdrkeZEKdUdv6erhmvSn3ieCoHpXztWT4uotLz4Wfq8v1cz+FE+0a/UEMNqsl/l/QJM9w8hFDEAHDcDpQSDRMQA0jnMp37DXhxFAggFxG0P9+N0fqQSKuuw7TmAUEBpB2h99CJqRxoYgD5/eADYAzBBfDoBK5h5AHq3dwGWfoDWX455BAH09mgdlAUBHPMIBWh9eLyYGdSBgN3p4SARGoElgNAp2L9DGOD0bR0UAjjY7V0e+FLZnYhegEkh4vwjMZQugCuJLwBqfYEv+l4SKuuWdvC+XnU7UkRl7FTG7soVsKjCkiOAdUwApjKBjIlgbYprFQOQXYMQs4qsA9Dp/npokiYT6kubVk5LpqvfSIo8pBZfRbjA7KZVZYgWM7zMsk3O+V2f2nsI4TzdZNkSzwpa3drHfXOSvN3J3HR32y+9FKEfw10c+oXU9S4AAAAASUVORK5CYII
// @author        mickey90427 <mickey90427@naver.com>
// @downloadURL https://update.greasyfork.org/scripts/461042/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%ED%86%A0%EA%B8%80%EB%9F%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/461042/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%ED%86%A0%EA%B8%80%EB%9F%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to redirect from watch?v= to embed/ with autoplay and related videos disabled
    function redirectToEmbedUrl() {
        let url = window.location.href;
        if (url.includes('watch?v=')) {
            let videoId = url.split('watch?v=')[1];
            let embedUrl = `https://www.youtube.com/embed/${videoId}\?autoplay=1&rel=0`;
            window.location.href = embedUrl;
        }
    }

    // Function to redirect from embed/ to watch?v=
    function redirectToWatchUrl() {
        let url = window.location.href;
        if (url.includes('embed/')) {
            let videoId = url.split('embed/')[1].split('?')[0];
            let watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
            window.location.href = watchUrl;
        }
    }

    // Add event listener for keydown event to listen for Alt + \ key press
    document.addEventListener('keydown', function(e) {
        if (event.ctrlKey && event.shiftKey && event.key === 'Y') {
            if (window.location.href.includes('youtube.com/watch')) {
                redirectToEmbedUrl();
            } else if (window.location.href.includes('youtube.com/embed')) {
                redirectToWatchUrl();
            }
        }
    });
})();