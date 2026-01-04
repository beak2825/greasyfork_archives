// ==UserScript==
// @name         XVideos Upload Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.xvideos.com/account/uploads/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421167/XVideos%20Upload%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/421167/XVideos%20Upload%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastTitle = ''
    console.log('running');
    function addTags(tags) {
        if (tags.length === 0) return;
        document.querySelector('.tag-list [id^="tag-adder"]').value = tags[0]
        document.querySelector('.tag-list button').click()
        setTimeout(addTags, 50, tags.slice(1))
    }

    function check() {
        upload_form_category_category_centered_category_straight.checked = true
        upload_form_file_terms.checked = true

        const path = document.querySelector('.file-upload-recap').innerText;
        if (path.trim() === '') return;
        let title = path.match(/\\([^\\]+$)/)[1]
        title = title.replace(/(1Giay.Net|1giay.net|mkv|mp4|ts|MP4|TS)/g, ' ')
        title = title.replace(/(\.|\+)/g, ' ').trim()
        if (title === lastTitle) return;

        upload_form_networksites_networksites_centered_networksites_DEFAULT_ONLY.parentNode.click()

        if (!upload_form_titledesc_title.value) upload_form_titledesc_title.value = title
        if (!upload_form_titledesc_description.value) upload_form_titledesc_description.value = title
        const tags = title.split(' ').filter(s => s.length > 2)

        document.querySelector('.tag-list button').click()
        setTimeout(addTags, 50, tags)

        lastTitle = title;
    }

    setInterval(check, 500)

})();