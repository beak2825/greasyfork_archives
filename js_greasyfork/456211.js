// ==UserScript==
// @name     Phabricator copy link button
// @description  Creates a Phabricator copy link button
// @author   @micgro42, @lilients
// @namespace https://gitlab.wikimedia.org/repos/wmde/browser-user-scripts/
// @license MIT
// @version  1
// @grant    none
// @match    https://phabricator.wikimedia.org/T*
// @downloadURL https://update.greasyfork.org/scripts/456211/Phabricator%20copy%20link%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/456211/Phabricator%20copy%20link%20button.meta.js
// ==/UserScript==


const title = document.title;
const url = location.origin + location.pathname;

addButtonToDom(' M⬇️', 'Markdown', getPlainTextClickHandler(`[${title}](${url})`) )
addButtonToDom(' ', 'Wikitext', getPlainTextClickHandler(`[${url} ${title}]`) )
addButtonToDom(' HTML', 'HTML', htmlClickHandler)


function addButtonToDom(buttonLabel, formattingType, clickHandler) {
  const button = document.createElement('button');
  button.style['font-family'] = 'FontAwesome';
  button.appendChild(document.createTextNode(buttonLabel));
  button.title = `Copy link with title formatted in ${formattingType}`;
  button.addEventListener('click', clickHandler);
  getButtonContainer().appendChild(button);
}

function getButtonContainer() {
    let container = document.getElementById('copyLinkButtonContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'copyLinkButtonContainer';
        container.style.display = 'inline-flex';
        container.style['align-items'] = 'stretch';
        document.querySelector('.phui-crumbs-actions').prepend(container);
    }
    return container;
}

function getPlainTextClickHandler ( syntax ) {
    return () => {
        navigator.clipboard.writeText(syntax).then(() => {
            console.log('copied!');
        });
    };
}

function htmlClickHandler () {
  const linkHTML = `<a href=${url}>${title}</a>`;

  if ( typeof ClipboardItem === 'undefined' ) {
    console.log('trying workaround for Firefox without ClipboardItem');
    
    copyAsHTML(linkHTML);
  } else {

    console.log('using new ClipboardItem API');
  
    const clipboardItem = new
            ClipboardItem({
            'text/html':  new Blob([linkHTML], {type: 'text/html'}),
            'text/plain': new Blob([linkHTML], {type: 'text/plain'}),
            });

    navigator.clipboard.write([clipboardItem]).then(() => {
        console.log('html copied!');
    }, (error) => console.error(error));
  }
}

// adapted from https://stackoverflow.com/a/34192073/3293343
function copyAsHTML (html) {
  
    var container = document.createElement('div')
    container.innerHTML = html.trim();

    container.style.position = 'fixed'
    container.style.pointerEvents = 'none'
    container.style.opacity = 0

    document.body.appendChild(container)
  
    window.getSelection().removeAllRanges()
  
    var range = document.createRange()
    range.selectNode(container)
    window.getSelection().addRange(range)
  
    document.execCommand('copy')
  
    document.body.removeChild(container)
}
