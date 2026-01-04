// ==UserScript==
// @description ПИШЕМСКРИПТЫЫЫЫЫЫЫЫ
// @name Писать на ctrl
// @version      1.3
// @include      .fightz.io/
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace хд
// @downloadURL https://update.greasyfork.org/scripts/428257/%D0%9F%D0%B8%D1%81%D0%B0%D1%82%D1%8C%20%D0%BD%D0%B0%20ctrl.user.js
// @updateURL https://update.greasyfork.org/scripts/428257/%D0%9F%D0%B8%D1%81%D0%B0%D1%82%D1%8C%20%D0%BD%D0%B0%20ctrl.meta.js
// ==/UserScript==
function showMessage() {
    setTimeout(function () {
        $('#buttonChat').mousedown();
        $('#chatMessage').val('Лох');
        $('#buttonChat').mousedown();
    },0);
    setTimeout(function () {
        $('#buttonChat').mousedown();
        $('#chatMessage').val('Пидор');
        $('#buttonChat').mousedown();
    },250);
    setTimeout(function () {
        $('#buttonChat').mousedown();
        $('#chatMessage').val('L');
        $('#buttonChat').mousedown();
    },500);
}

document.onkeydown = function (key) {
    switch(key.keyCode) {
        case 17: //on ctrl
            showMessage();
            break;
    }
}