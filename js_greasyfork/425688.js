// ==UserScript==
// @name         Rule34Hentai - Top Animated Button
// @version      0.1
// @description  A button that get the "Top Voted Animations" of the chosen tags!
// @match        https://*.rule34hentai.net/post/list/*
// @namespace https://greasyfork.org/users/766244
// @downloadURL https://update.greasyfork.org/scripts/425688/Rule34Hentai%20-%20Top%20Animated%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/425688/Rule34Hentai%20-%20Top%20Animated%20Button.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
    var form = document.querySelector('#Navigationleft > div > form')
    var ta_btn = document.createElement('button')
    ta_btn.id = 'ta'
    ta_btn.innerText = 'TOP ANIMATED'
    ta_btn.onclick = function () {
        var tagsInput = form.querySelector('input[name="search"]')
        tagsInput.value += ' animated order=score_desc'
        form.submit()
    }
    form.insertAdjacentElement('beforeend', ta_btn)
})