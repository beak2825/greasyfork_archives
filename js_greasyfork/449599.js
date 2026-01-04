// ==UserScript==
// @name         Тупая фигня, которая делает орбитар мерзким
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Потребляйте кальций
// @author       Rawlique
// @match        *://orbitar.space/*
// @icon         https://orbitar.space/favicon.ico
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449599/%D0%A2%D1%83%D0%BF%D0%B0%D1%8F%20%D1%84%D0%B8%D0%B3%D0%BD%D1%8F%2C%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F%20%D0%B4%D0%B5%D0%BB%D0%B0%D0%B5%D1%82%20%D0%BE%D1%80%D0%B1%D0%B8%D1%82%D0%B0%D1%80%20%D0%BC%D0%B5%D1%80%D0%B7%D0%BA%D0%B8%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/449599/%D0%A2%D1%83%D0%BF%D0%B0%D1%8F%20%D1%84%D0%B8%D0%B3%D0%BD%D1%8F%2C%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F%20%D0%B4%D0%B5%D0%BB%D0%B0%D0%B5%D1%82%20%D0%BE%D1%80%D0%B1%D0%B8%D1%82%D0%B0%D1%80%20%D0%BC%D0%B5%D1%80%D0%B7%D0%BA%D0%B8%D0%BC.meta.js
// ==/UserScript==

(function() {
    const theme = 'theme-yucky';
	const html = document.querySelector('html');
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    const live = (eventType, elementQuerySelector, cb) => {
        document.addEventListener(eventType, function(event) {
            const qs = document.querySelectorAll(elementQuerySelector);
            if (qs) {
                let el = event.target, index = -1;
                while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
                    el = el.parentElement;
                }
                if (index > -1) {
                    cb.call(el, event);
                }
            }
        });
    }

    const isOnLightSide = () => {
        try {
            return JSON.parse(localStorage.getItem('theme')).theme === 'light';
        } catch (e) {
            return true;
        }
    }

    const toggleTheme = (enable) => {
        if (enable) {
            html.classList.add(theme);
        } else {
            html.classList.remove(theme);
        }
    }

    const __snailcss = `
.${theme}:root {
	--fgHardest: #000;
	--fgHarder: #040404;
	--fgHard: #080808;
	--fg: rgb(70, 70, 70);
	--fgMedium: rgb(60, 60, 60);
	--fgSoft: rgb(80, 80, 80);
	--fgSofter: rgb(90, 90, 90);
	--fgSoftest: rgb(130, 130, 130);
	--fgGhost: rgb(180, 180, 180);
	--fgAlmostInvisible: rgb(224, 224, 224);
	--lowered: rgb(246, 239, 210);
	--bg: #FFFFFF;
	--elevated: #d7d7d7;
	--primary: #b97d49;
	--primaryHover: #c98d59;
	--primaryGhost: #d99d69;
	--link: rgb(102, 153, 153);
	--linkHover: rgb(122, 173, 173);
	--linkVisited: rgb(82, 133, 133);
	--linkGhost: rgb(122, 173, 173);
	--dim1: rgba(0, 0, 0, 0.05);
	--dim2: rgba(0, 0, 0, 0.10);
	--dim3: rgba(0, 0, 0, 0.15);
}

.${theme} [class^='CommentComponent_answers'] {
    border-left: 1px solid transparent;
    margin-top: -6px;
}

.${theme} [class^='CommentComponent_comment'] {
    margin-bottom: 16px;
}

.${theme} [class^='RatingSwitch_listDown'] {
    background: inherit;
}

.${theme} [class^='RatingSwitch_listMinus'] {
    border-right: none;
}

.${theme} .isNew {
    border-left: 1px solid transparent;
}

.${theme} .isNew > .commentBody {
    background: var(--lowered);
    padding: 6px 12px 6px 12px;
    margin-left: -11px;
    border-left: 1px solid var(--fgHardest);
}

.${theme} .commentBody > div:nth-child(1) {
  opacity: 0.75;
}

.${theme} .commentBody button {
  opacity: 0.75;
}

.${theme} .isFlat + .isFlat {
    margin-bottom: none;
}

.${theme} #root:after {
    content: ' ';
    position: fixed;
    top: 0;
    left: 0;
    height: 35px;
    right: 0;
    background: linear-gradient(rgba(148, 148, 148, 0.2), rgba(148, 148, 148, 0));
}
`;

    head.appendChild(style);
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(__snailcss));
    live('mouseup', 'svg,button', (e) => {
        setTimeout(() => {
            toggleTheme(isOnLightSide());
        }, 0);
    });
    toggleTheme(isOnLightSide());
})();