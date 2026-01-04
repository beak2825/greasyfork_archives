// ==UserScript==
// @name         Yahoo!ジオシティーズ to archive.org
// @namespace    https://greasyfork.org/users/299154-rnnqq
// @version      0.3
// @description  geocities.jp -> RedirectURL or archive.org
// @author       rnnqq
// @include      http://*.geocities.jp/*
// @include      http://*.geocities.co.jp/*
// @include      https://*.geocities.jp/*
// @include      https://*.geocities.co.jp/*
// @exclude      https://web.archive.org/*
// @exclude      http://www.geocities.jp/
// @exclude      http://www.geocities.co.jp/
// @exclude      https://shopping.geocities.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382767/Yahoo%21%E3%82%B8%E3%82%AA%E3%82%B7%E3%83%86%E3%82%A3%E3%83%BC%E3%82%BA%20to%20archiveorg.user.js
// @updateURL https://update.greasyfork.org/scripts/382767/Yahoo%21%E3%82%B8%E3%82%AA%E3%82%B7%E3%83%86%E3%82%A3%E3%83%BC%E3%82%BA%20to%20archiveorg.meta.js
// ==/UserScript==

(function() {
    if(document.querySelector('.userpageRedirectUrl')){
        var RedirectURL = document.getElementsByClassName('userpageRedirectUrl');
        location.href = RedirectURL[0].textContent;
}
    else {
        var archiveURL = "https://web.archive.org/web/"+location.href;
        location.href = archiveURL;
}
})();