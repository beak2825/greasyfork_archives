// ==UserScript==
// @name              Hacker News - Dark Theme
// @namespace         https://github.com/jtolj
// @description       A dark theme for Hacker News (YCombinator).
// @include           https://news.ycombinator.com/*
// @grant             none
// @version           1.4
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510432/Hacker%20News%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/510432/Hacker%20News%20-%20Dark%20Theme.meta.js
// ==/UserScript==

document.body.bgColor = '#000';
document.body.style.opacity = 0;

const css = `
html,
body,
#hnmain {
    background: #333;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}

#pagespace {
    height: 24px !important;
}

a,
a:link,
a:visited,
a:active,
.comment * {
    color: #ddd !important;
}

a {
  transition: font-size .3s ease;
}

a:focus-visible  {
  font-size:102%;
  text-decoration: underline;
}

a.title-link:focus-visible {
  outline: none;

}

.comment {
    padding: 14px;
    border: 1px solid #efef;
    border-radius: 6px;
}

.commtext {
    font-size: 15px !important;
}

.reply a {
    font-size: 14px !important;
}

.pagetop {
    font-size: 16px;
    padding: 0 6px;
}

.pagetop>a,
.pagetop>a:link,
.pagetop>a:visited,
.pagetop>a:active,
.hnname>a {
    color: #333 !important;
}


.spacer {
    height: 16px !important;
}

.titleline {
    font-size: 16px !important;
    font-weight: 400;
}

.athing+tr>td {
    padding-top: 6px;
}

.itemlist .subtext * {
    font-size: 14px !important;
}

.votelinks {
    width: 50px !important;
}

.votearrow {
    background: none;
    width: 24px !important;
    position: relative;
}

.votearrow:before {
    filter: grayscale(100%);
    content: '👍';
    font-size: 24px;
    position: absolute;
    top: -10px;
    left: 0px;
}
`

let style = document.createElement('style');
style.innerHTML = css;
document.body.append(style);


const init = function () {
  const links = document.querySelectorAll('span.titleline>a, td.subtext a, a.morelink');
  let tabIndex = 0;
  for (let link of links) {
    const isTitleLink = link.parentNode.classList.contains('titleline');
    const isCommentsLink = link.text.indexOf('comments') > -1;
    const isNextPageLink = link.classList.contains('morelink');
    if ( isTitleLink || isCommentsLink || isNextPageLink) {
      if (tabIndex === 0) {
        link.focus();
      }
      link.tabIndex = ++tabIndex;
      if (isTitleLink) {
        link.classList.add('title-link');
      }
    }
  }
  document.body.style.opacity = 1;
}

if (document.readyState !== 'loading') {
  init();
}

window.addEventListener('DOMContentLoaded', function () {
  init();
});

document.addEventListener('keydown', function(event) {

    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }

    if (event.key === 's') {
      document.querySelector('[tabindex]').focus()
    }
    else if (event.key === 'e') {
      const focusableElements = Array.from(document.querySelectorAll('[tabindex]'));
      focusableElements[focusableElements.length - 1].focus();
    }
    else if (event.key === 'j' || event.key === 'k') {
        const focusableElements = Array.from(document.querySelectorAll('[tabindex]'))
            .sort((a, b) => a.tabIndex - b.tabIndex);
        const currentElement = document.activeElement;
        const currentIndex = focusableElements.indexOf(currentElement);

        let nextIndex;
        if (event.key === 'j') {
            nextIndex = (currentIndex + 1) % focusableElements.length;
        } else if (event.key === 'k') {
            nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        }

        focusableElements[nextIndex].focus();
    }
});