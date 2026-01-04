// ==UserScript==
// @name         youtrack.adrentech.com
// @description  youtrack.adrentech.com improvements
// @match        https://youtrack.adrentech.com/*
// @version 0.3.1
// @namespace https://greasyfork.org/users/843175
// @downloadURL https://update.greasyfork.org/scripts/436011/youtrackadrentechcom.user.js
// @updateURL https://update.greasyfork.org/scripts/436011/youtrackadrentechcom.meta.js
// ==/UserScript==

(function() {

    document.addEventListener('click', async function(evt) {
        // no new tab
        if (evt.target.matches('a, a *')) {
            evt.target.parentElement.target = '';
            return;
        }
    }, true);

    const style = document.createElement('style');
    style.textContent = `
/* size of imges in task description */
.description__e03 img {
  width: auto;
}

/* ----------------- */
/* company colorcoding */

/* guardian */
.ring-palette_tone-6-4,
.color-fields__background-34,
.color-fields__field-34,
.yt-agile-card_color-34:before,
.circle__ed7[label~=Guardian],
.square__ac8[label~=Guardian],
.circle__ed7[label~=Fiorentina],
.square__ac8[label~=Fiorentina] {
    background-color: #462E8D !important;
}
.color-fields__plain-color-34,
.color-tag-34 {
    color: #462E8D !important;
}

/* mediacom */
.ring-palette_tone-6-3,
.color-fields__background-1,
.color-fields__field-1,
.yt-agile-card_color-1:before,
.circle__ed7[label~=Helpdesk],
.square__ac8[label~=Helpdesk],
.circle__ed7[label~=Mediacom],
.square__ac8[label~=Mediacom],
.circle__ed7[label~=MCC],
.square__ac8[label~=MCC] {
    background-color: #0067B4 !important;
}
.color-fields__plain-color-1,
.color-tag-1 {
    color: #0067B4 !important;
}

/* armstrong */
.ring-palette_tone-6-2,
.color-fields__background-2,
.color-fields__field-2,
.yt-agile-card_color-2:before,
.circle__ed7[label~=Armstrong],
.square__ac8[label~=Armstrong] {
    background-color: #C22032 !important;
}
.color-fields__plain-color-2,
.color-tag-2 {
    color: #C22032 !important;
}

/* dobson */
.ring-palette_tone-6-1,
.color-fields__background-26,
.color-fields__field-26,
.yt-agile-card_color-26:before,
.circle__ed7[label~=Dobson],
.square__ac8[label~=Dobson] {
    background-color: #013E52 !important;
    color: #fff !important;
}
.color-fields__plain-color-26,
.color-tag-26 {
    color: #013E52 !important;
}

/* mctv */
.ring-palette_tone-6-0,
.color-fields__background-23,
.color-fields__field-23,
.yt-agile-card_color-23:before,
.circle__ed7[label~=Mctv],
.square__ac8[label~=Mctv] {
    background-color: #F99F1B !important;
    color: #fff !important;
}
.color-fields__plain-color-23,
.color-tag-23 {
    color: #F99F1B !important;
}

/* ----------------- */
/* hide banner */
/*
.header-container__banner {
    display: none;
}
 */

`;
    document.body.append(style);

})();