// ==UserScript==
// @name         EasierSendToKindle
// @version      1.1
// @description  automatically download epub (or any) file and open email client
// @author       daydreamorama
// @include      /https?://archiveofourown\.org/.*works/\d+/
// @grant        none
// @namespace https://greasyfork.org/en/users/36620
// @downloadURL https://update.greasyfork.org/scripts/448890/EasierSendToKindle.user.js
// @updateURL https://update.greasyfork.org/scripts/448890/EasierSendToKindle.meta.js
// ==/UserScript==



(function () {
    // Change this to your email address that is your kindle
    var email = 'email@kindle.com'

    // if you prefer other extensions change this. (such as 'mobi')
    var ext = 'epub'


    var chapter = document.getElementById('chapters');
    var btn = $('<input class="button" type="button" value="' + ext + '"></input> ');

    //const btn = document.createElement('button')
    //btn.innerText = ext

    var header_menu = $('ul.work.navigation.actions');
    header_menu.find('li.download').append(btn);

    const titleLink = document.querySelector('h2.title.heading');
    var title = titleLink.textContent.trim();
    var workId = (window.location.pathname.match(/\/works\/(\d+)\b/) || [])[1];
    var link = `https://archiveofourown.org/downloads/${workId}/${encodeURIComponent(title)}.${ext}?updated_at=${Date.now()}`

    // ideally we'd just take the link but lets hope your title doesn't have things like ? in it ...
//    btn.innerText = link
    btn.click(function() {
        window.open(link)
        window.open('mailto:' + email + '?subject=empty&body=empty')
    });
})();
