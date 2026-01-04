// ==UserScript==
// @name         Compteur de mots et caractères Notion
// @name:en      Notion word and caracters count
// @namespace    https://github.com/paulverbeke
// @version      1.2
// @description  Affiche un simple compteur de mots et caractères dans Notion
// @description:en  Displays a simple word and caracters count in Notion
// @author       paulv
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?domain=notion.so
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457700/Compteur%20de%20mots%20et%20caract%C3%A8res%20Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/457700/Compteur%20de%20mots%20et%20caract%C3%A8res%20Notion.meta.js
// ==/UserScript==

//styling: modify as desired
const styles = document.createElement('style');
styles.innerHTML = `
.word-count {
  z-index: 500;
  position: absolute;
  bottom: 20px;
  right: 25px;
  font: 16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
}
.char-count {
  z-index: 500;
  position: absolute;
  bottom: 5px;
  right: 25px;
  font: 16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
}
.notion-help-button {
  bottom: 40px !important;
}
`;
document.head.appendChild(styles);

//create + insert word count element
const wordCount = document.createElement('span');
wordCount.classList.add('word-count');
document.body.appendChild(wordCount);

//create + insert char count element
const charCount = document.createElement('span');
charCount.classList.add('char-count');
document.body.appendChild(charCount);


/* Word Count Function */
let pattern = /[a-zA-Z0-9_\u0392-\u03c9\u00c0-\u00ff\u0600-\u06ff\u0400-\u04ff]+|[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;

function wordCountFunc(str) {
    let m = str.match(pattern);
    let count = 0;
    if (!m) {
        return 0;
    }
    for (let i = 0; i < m.length; i++) {
        if (m[i].charCodeAt(0) >= 0x4e00) {
            count += m[i].length;
        } else {
            count += 1;
        }
    }
    return count;
};
/* Word Count Function */

//fill chars and words count element
function updateCount () {
    try {
		let text = '';
		let selection = document.getSelection(); //display char count of selection only

        //debugger;
		if (selection.type === 'Range') { //char/words selected (not caret)
            text = selection.toString();
		}
        else {
            const pageContents = document.querySelectorAll('.notion-page-content');
            const mainContentPage = pageContents[pageContents.length - 1]; // to get content of the correct page if in peek mode

            //check if nodes selected
            selection = mainContentPage.querySelectorAll('.notion-selectable-halo');
            for (const block of selection) {//get contents of selected nodes
                text += block.previousSibling.innerText + '\n';
            }

            if (!text) { //no selection or selection empty
                //get content of entire page
                text = mainContentPage.innerText;
            }
        }

		//count chars, words, and display
		const cCount = text.length;
		const wCount = wordCountFunc(text);
		charCount.innerText = `${cCount} caractère${cCount === 1 ? '' : 's'}`;
		wordCount.innerText = `${wCount} mot${wCount === 1 ? '' : 's'}`;
	} catch (err) {
		//console.log('No content detected. Are you on a database page?'); //some pages do not have .notion-page-content
		charCount.innerText = ''; //empty char count display
		wordCount.innerText = ''; //empty word count display
	}
}

//updates counts 500 seconds after last key press or selection change
document.addEventListener('keyup', debounce(updateCount, 500));
document.addEventListener('selectionchange', debounce(updateCount, 500));
setTimeout(updateCount, 500); //initial counts

//update word & chars count after navigation between pages
var pushState = history.pushState;
history.pushState = function () {
	pushState.apply(history, arguments);
	setTimeout(updateCount, 500);
};


//helper function
//minified from https://github.com/component/debounce
function debounce(l,n,u){var e,i,t,o,f;if(null==n)n=100;function a(){var r=Date.now()-o;if(r<n&&r>=0){e=setTimeout(a,n-r)}else{e=null;if(!u){f=l.apply(t,i);t=i=null}}}var r=function(){t=this;i=arguments;o=Date.now();var r=u&&!e;if(!e)e=setTimeout(a,n);if(r){f=l.apply(t,i);t=i=null}return f};r.clear=function(){if(e){clearTimeout(e);e=null}};r.flush=function(){if(e){f=l.apply(t,i);t=i=null;clearTimeout(e);e=null}};return r}
