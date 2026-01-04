// ==UserScript==
// @name         Coursera - Estimated Time
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Estimate the rest time of each course on its Coursera Welcome page to do a better Scrum
// @author       Artwalk
// @source       https://gist.github.com/Artwalk/18b594172c7b0b71f2bb210788b3939a
// @include      https://www.coursera.org/learn/*/home/welcome
// @match        https://www.coursera.org/learn/*/home/welcome
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36774/Coursera%20-%20Estimated%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/36774/Coursera%20-%20Estimated%20Time.meta.js
// ==/UserScript==

(function() {
    setTimeout(function () {
        main()
    }, 1000);
})();

function main() {
    'use strict';

    let et = document.getElementsByClassName('body-2-text estimated-time')

    var h = 0, m = 0
    for (var i=0; i<et.length; i++) { // I miss vector operation in Octave so much ?
        let hm = et[i].outerText.split(" ")
        for (var j=0; j<hm.length; j++) {
            let num = parseInt(hm[j])
            if (!isNaN(num)) {
                if (hm[j].includes("h")) {
                    h += num
                } else {
                    m += num
                }
            }
        }
    }
    h += m/60
    m %= 60

    var tmp = document.getElementsByClassName('items align-self-stretch')

    var div = document.createElement('div')
    div.className = 'rc-DefaultNavigationItem'

    var a = document.createElement('a')
    a.className = 'rc-NavigationLink horizontal-box align-items-vertical-center wrap'

    let hm = document.createElement('p')
    hm.textContent = 'Estimated Time: ' + Math.floor(h) + 'h ' + m + 'm'
    hm.className = 'nav-item headline-1-text'


    div.appendChild(a)
    a.appendChild(hm)
    tmp[tmp.length-1].appendChild(div)
}