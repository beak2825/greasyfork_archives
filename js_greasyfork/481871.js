// ==UserScript==
// @name         Новогодний логотип Lolzteam | 2024
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Lolzteam 2024 logo
// @author       stealyourbrain
// @match        https://zelenka.guru/*
// @downloadURL https://update.greasyfork.org/scripts/481871/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%BB%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF%20Lolzteam%20%7C%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/481871/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%BB%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF%20Lolzteam%20%7C%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var logoElement = document.getElementById('lzt-logo');

    if (logoElement) {
        logoElement.style.backgroundImage = 'url(https://private-user-images.githubusercontent.com/79356925/289359852-8f0a5f76-c88e-4c3d-b2fc-c96789c990f0.svg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE3MDIyMTM2NDMsIm5iZiI6MTcwMjIxMzM0MywicGF0aCI6Ii83OTM1NjkyNS8yODkzNTk4NTItOGYwYTVmNzYtYzg4ZS00YzNkLWIyZmMtYzk2Nzg5Yzk5MGYwLnN2Zz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzEyMTAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMxMjEwVDEzMDIyM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTY5NDFkNmE2MzA3NDM3ZTllY2NiMDFlZTdlYjVhYTIyYmFhM2ZhZTUyZWJmMWVkZWMwYTU0NmRmMWZjYWZiM2QmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.iiBCGDwXrv2eqvjHVdxjrOoy6BGCbVcsnSxhDedAups)';
    }
})();
