// ==UserScript==
// @name     kinokrad.co styles
// @description kinokrad.co styles - Black theme
// @namespace    kinokrad.co
// @include  https://kinokrad.co/*
// @grant    GM_addStyle
// @run-at   document-start
// @version  1.006
// @downloadURL https://update.greasyfork.org/scripts/393364/kinokradco%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/393364/kinokradco%20styles.meta.js
// ==/UserScript==

(function () {

    function getThemeSettingsFromStorage() {
        let val = localStorage.getItem('isDarkTheme');
        return val !== "false";
    }

    let isDarkTheme = getThemeSettingsFromStorage();

    function setThemeSettingsToStorage() {
        localStorage.setItem('isDarkTheme', isDarkTheme);
    }

    function addGlobalStyle() {
        let head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.id = 'KinokradTheme';
        style.innerHTML = '';
        head.appendChild(style);
    }

    function getDarkTheme() {
        return `
#content, #middle, .commtext, .commtext-box, body {
    background-color: #000 !important;
    background-image: none !important;
    color: white !important;
}

.commtext {
    border-color: #333 !important;
}

.janrfall li a, .janrfall2 li a {
    color: white !important;
}

.janrfall span.orange {
    color: #ff760c !important;
}

.headermenu {
    background: none !important;
}

ul.topmenu li a {
    color: white !important;
}

.leftbox-comm, #footer {
    display: none;
}

.quote, .scriptcode, .text_spoiler, .title_quote, .title_spoiler, .title_quote, .title_spoiler {
    background: none !important;
}

ul.topmenu li.sublnk ul {
    background-color: #333 !important;
}

ul.topmenu li.sublnk ul li a:hover {
    background-color: #666 !important;
}

.godshort .fader2, .janrshort .fader2, .navcent, .navcent a {
    background: none !important;
}

.godshort span, .janrshort span {
    color: #CCC !important;
}

.navnext, .navprev, .navcent span {
    background: none !important;
    color: #FFF !important;
}

.navcent span {
    background: none !important;
    color: orange !important;
}

.navcent a:hover, .navnext:hover, .navprev:hover {
    color: yellow !important;
}
`
    }

    function getLightTheme() {
        return `
body {
    background: white !important;
}
`;
    }

    function getThemeSelectorName() {
        return (isDarkTheme ? '⮕ Light theme' : '⮕ Dark theme')
    }

    function changeStyle() {
        document.getElementById('KinokradTheme').innerHTML = isDarkTheme ? getDarkTheme() : getLightTheme();
    }

    function switchTheme() {
        isDarkTheme = !isDarkTheme;
        document.getElementById('KinokradThemeSelector').innerHTML = getThemeSelectorName();
        changeStyle();
        setThemeSettingsToStorage();
    }

    function setThemeSelector() {
        let $menu = document.getElementsByClassName('topmenu');
        if ($menu.length > 0) {
            let a = document.createElement('a');
            a.href = '#';
            a.id = 'KinokradThemeSelector';
            a.innerHTML = getThemeSelectorName();
            a.onclick = switchTheme;
            let li = document.createElement('li');
            li.append(a);
            $menu[0].append(li);
        } else {
            setTimeout(setThemeSelector, 100);
        }
    }

    function removeHeader() {
        let wrapper = document.getElementById('wrapper');
        if (wrapper != null) {
            wrapper.setAttribute('style', 'margin-top: 45px !important');
        } else {
            setTimeout(removeHeader, 100);
        }
    }

    setThemeSelector();
    removeHeader();
    addGlobalStyle();
    changeStyle();

})();