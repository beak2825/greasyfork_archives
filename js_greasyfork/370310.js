// ==UserScript==
// @name        webnovel.com skip video ads mobile
// @namespace   http://forum.novelupdates.com/
// @version     5
// @run-at      document-end
// @match       http://m.webnovel.com/book/*
// @match       https://m.webnovel.com/book/*
// @license     MIT
// @locale english
// @description test
// @downloadURL https://update.greasyfork.org/scripts/370310/webnovelcom%20skip%20video%20ads%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/370310/webnovelcom%20skip%20video%20ads%20mobile.meta.js
// ==/UserScript==


//-------------------------------------------------------------------------------------------------------------------
// Thanks go to shadofx for modifying the desktop version (v4) of this script
// to  work on mobile. This can be found at
// https://openuserjs.org/scripts/shadofx/webnovel.com_skip_video_ads_mobile/source
//-------------------------------------------------------------------------------------------------------------------

// How frequently this script should check for new chapters.
//
// The amount is in milliseconds.
const INTERVAL_CHAPTER_CHECK = 1000;

// When a token is not ready yet, this is how much time we should wait
// before trying again.
//
// The amount is in milliseconds.
const INTERVAL_TOKEN_CHECK = 1000;

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

/**
 * Check for new chapters and try to remove the adwall from them.
 */
function main() {
    Array.from(
        // Locked chapters.
        document.querySelectorAll('.j_chapterWrapper')
    ).filter((item)=>item.querySelector('.cha-txt').classList.contains('cha-txt-hide'))
        .forEach((lock) => {
        // Element with the chapter content.
        const contentElement = lock.querySelector('.cha-txt');

        // Remove this class so this chapter won't be processed the next time
        // `main` is called.
        contentElement.classList.remove('cha-txt-hide');

        // Remove the video.
        const v = lock.querySelector('.cha-watch-ad');
        if(v) v.remove();

        contentElement.style.opacity = '0.1';

        // Get the ID for the series ("book").
        //
        // Some chapters have the `data-bid` property, but not all of themw.
        // That's why it's better to just get this from the URL.
        const bid = window.location.href.split('/book/')[1].split('/')[0];

        // Get the ID for the chapter.
        const cid = lock.dataset.chapterid;

        //Get the csrf token
        const csrf = getCookie("_csrfToken");
  
//      alert(`https://m.webnovel.com/ajax/chapter/getChapterContentToken?bookId=${bid}&chapterId=${cid}&_csrfToken=${csrf}`);
 
   // Both ID are required.
   if (!bid || !cid || !csrf) {
     return;
   }

        return fetch(
            `https://m.webnovel.com/ajax/chapter/getChapterContentToken?bookId=${bid}&chapterId=${cid}&_csrfToken=${csrf}`
            , {credentials: "same-origin"})
            .then(resp => resp.json())
            .then(data => {
            return data.data.token
        })
            .then(token => encodeURIComponent(token))
            .then(token => new Promise((resolve) => {
            // The raw body of the chapter.
            //
            // It will be plain text, so we must manually build the HTML for it.
            let content = '';

            // Try to get the content of the chapter, and fulfill the promise once
            // we have it.
            //
            // This function will retry until it succeeds.
            function tick() {
                if (token != '') {
                    const url = `https://m.webnovel.com/ajax/chapter/getChapterContentByToken?token=${token}&_csrfToken=${csrf}`;
                    fetch(url, {credentials: "same-origin"})
                        .then(resp => resp.json())
                        .then((data) => {
                        content = data.data.content.trim();

                        if (content) {
                            resolve(content);
                        } else {
                            setTimeout(tick, INTERVAL_TOKEN_CHECK);
                        }
                    })
                        .catch((err) => {
                        console.error(err.stack);
                        tick();
                    });
                }
            }

            tick();
        }))
            .then((content) => {
            // Build the HTML for the chapter content.
            //
            // For now we only split on line breaks and wrap each piece
            // with "<p></p>" tags.
            const chapterHtml = content
            .split('\n')
            .map(p => p.trim())
            .filter(p => !!p)
            .map(p => `<p>${p}</p>`)
            .join('');

            // Update the chapter content and turn opacity back to 100%.
            contentElement.innerHTML = chapterHtml;
            contentElement.style.opacity = '1';
        })
            .catch((err) => {
            console.error(err.stack);
        });
    });
}

// Since Qidian may load new chapters without refreshing the page, we must
// continuously check for new chapters in the page.
setInterval(main, INTERVAL_CHAPTER_CHECK);