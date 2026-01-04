// ==UserScript==
// @name        AO3 Language Blocker
// @namespace   https://greasyfork.org/en/users/442480-ria
// @match       *://archiveofourown.org/*
// @grant       none
// @version     1.1
// @author      Ria
// @description Only shows AO3 works that are in certain languages.
// @downloadURL https://update.greasyfork.org/scripts/432464/AO3%20Language%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/432464/AO3%20Language%20Blocker.meta.js
// ==/UserScript==

function hideLanguages() {
    'use strict';
  
    // ---------------- CONFIG ----------------
  
    const whitelistedLanguages = ['English', 'Español', '日本語']
    
    //-----------------------------------------
    
    let works = Array.from(document.getElementsByClassName("blurb"))
    works.forEach(work => {
        let languageStats = work.querySelectorAll("dd.language")
        languageStats.forEach(languageStat => {
            if (!whitelistedLanguages.includes(languageStat.innerHTML)) {
                console.log("AO3 Language Blocker: Hiding works in " +
                    languageStat.innerHTML)
                work.style.display = 'none'
            }
        })
    })
}
hideLanguages()