// ==UserScript==
// @name         Show Tags on booru.org
// @description  Expose your favorite tags before clicking the image
// @version      0.2.0
// @author       sllypper
// @homepage     https://sleazyfork.org/en/users/55535-sllypper
// @namespace    sllypper
// @match        *://*.booru.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424076/Show%20Tags%20on%20booruorg.user.js
// @updateURL https://update.greasyfork.org/scripts/424076/Show%20Tags%20on%20booruorg.meta.js
// ==/UserScript==

// todo: remove searched tags from favTags

(function() {
    'use strict';

    let imgPageAction = true

    let fgColor = 'white',
        bgColor = 'darkred',
        highlightColor = 'darkred';

    // no judgerino pls
    let favTags = [
        'thick_thighs',
        'muscular_female',
        'short_hair',
//        'male_viewer',
        'abs',
        'tomboy',
        'wholesome',
        'saviour_kink',
        'symbol-shaped_pupils',
        'heart-shaped_pupils',
        'romance',
        'cock_worship',
        'pinched_thighmeat',
    ]

    if (Object.keys(posts).length == 1) {
        if (imgPageAction) singleImgCSS()
        let tags = document.getElementById('tag_list')
        tags.descendants().filter((e) => e.tagName === "A").forEach((e) => {
            if (favTags.indexOf(e.text.replace(' ', '\_')) >= 0) {
                e.style = 'font-weight: 700; color: ' + highlightColor + ';'
            }
        })
        return
    }

    function runScript2() {
        Object.keys(posts).forEach((k) => {
            favTags.indexOf
            posts[k].tags.forEach((t) => {
                if (favTags.indexOf(t) != -1) {
                    let sp = document.createElement('span')
                    sp.setAttribute('class', 'tag')
                    sp.textContent = t
                    document.getElementById('p'+k).parentElement.appendChild(sp)
                }
            })
        })
    }

    /*
    function runScript() {
        // find which posts have those tags and which tags
        let keys = Object.keys(posts)
        let found = []
        //console.log(keys)
        keys.forEach((key) => {
            let tags = posts[key].tags.filter((tag) => favTags.indexOf(tag) != -1)

            if (tags.length) found[key] = tags
        })
        console.log(found)
        // append the tags below the thumb
        // for each post with tag found, find element
        found.forEach((post, key) => {
            let postEl = document.getElementById('p'+key).parentElement
//             console.log(postEl)

            post.forEach((tag) => {
                let newEl;
                postEl.appendChild((newEl = document.createElement('span')))
                newEl.setAttribute('class', 'tag')
                newEl.textContent = tag
            })
        })
    }
    */

    function customCSS() {
        let customStyles = document.createElement("style");
        customStyles.setAttribute("type", "text/css");

        let styles = ".tag { color: " + fgColor + "; background-color: " + bgColor + "; padding: 2px; border-radius: 2px; margin-left: 2px; margin-top: 4px; display: inline-block; }"
        customStyles.innerHTML = styles;

        document.getElementsByTagName("head")[0].appendChild(customStyles);
    }

    function singleImgCSS() {
        let customStyles = document.createElement("style");
        customStyles.setAttribute("type", "text/css");

        let styles = "#image { width: 100%; }"
        customStyles.innerHTML = styles;

        document.getElementsByTagName("head")[0].appendChild(customStyles);
    }

    customCSS();
    runScript2();

})();