// ==UserScript==
// @name     	WordReference.com to Single-page app (with Fullsceen)
// @description It turns wordreference.com dictionary into a single-page application, that is it doesn't reload the full page when navigating to a different word. It also minimizes distractions by hiding the left and right columns and by providing fullscreen mode.
// @version  	1.1
// @grant    	none
// @include 	https://www.wordreference.com/*
// @require		https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.js
// @namespace https://greasyfork.org/users/396351
// @downloadURL https://update.greasyfork.org/scripts/393304/WordReferencecom%20to%20Single-page%20app%20%28with%20Fullsceen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393304/WordReferencecom%20to%20Single-page%20app%20%28with%20Fullsceen%29.meta.js
// ==/UserScript==

const win = window;
const doc = document;
const loc = win.location;
var linkParts, word, lang;

const hide = (id) => doc.getElementById(id).setAttribute('hidden', '');
hide('rightcolumn');
hide('leftcolumn');
document.querySelector('#centercolumn').style.width = 'auto'

const fullscrBtn = doc.createElement('button');
fullscrBtn.innerHTML = 'Fullscreen';
fullscrBtn.setAttribute('class', 'bttn');
fullscrBtn.addEventListener('click', e => {
  if (!doc.fullscreenElement) {  
  	doc.documentElement.requestFullscreen();
  } else {
    doc.exitFullscreen();
  }
});
doc.documentElement.addEventListener('fullscreenchange', e => {
  const fullscrBtn = doc.querySelector('#forumapi button');
  if (!doc.fullscreenElement) {
    fullscrBtn.innerHTML = 'Fullscreen';
  } else {
    fullscrBtn.innerHTML = 'Exit Fullscreen';
  }
  
});
doc.getElementById('forumapi').prepend(fullscrBtn);

const modifyCenterColumn = () => {
  linkParts = loc.pathname.split('/');
  word = linkParts[2];
  lang = linkParts[1];

  const html = doc.querySelector('#centercolumn').innerHTML;   
  const dictA = doc.querySelector('#nav a');
  const dictLink = { href:dictA.href, text:dictA.text };
  history.replaceState({html, word, dictLink}, '', loc.href);

  doc.querySelector('#fSelect').value = (lang == 'definition')? 'enen':lang;

}

fetch('https://www.wordreference.com/2012/scripts/allOptions.aspx').
  then(r => r.text()).
	then(t => {
    doc.querySelector('#fSelect').innerHTML = t;
    modifyCenterColumn();
  });


const search = doc.querySelector('#search input');
const focusOnSearch = (e) => search.focus();

focusOnSearch();

doc.addEventListener('focus', focusOnSearch);

fetch('https://www.wordreference.com/2012/scripts/bundle.min.js?v=26112019015910').then(r => r.text()).
	then(script => {
  const redirectWRFunc = script.split('\n')[4].substring(7922,13137)
  win.eval(redirectWRFunc.replace('window.location.href=e+url','document.dispatchEvent(new CustomEvent("newpage", {detail: "https:"+e+url}))'));
  
});

const opts = {
  lines: 12             // The number of lines to draw
  , length: 1             // The length of each line
  , width: 5              // The line thickness
  , radius: 10            // The radius of the inner circle
  , scale: 9           // Scales overall size of the spinner
  , corners: 1            // Roundness (0..1)
  , color: '#000'         // #rgb or #rrggbb
  , opacity: 1/4          // Opacity of the lines
  , rotate: 0             // Rotation offset
  , direction: 1          // 1: clockwise, -1: counterclockwise
  , speed: 1.6              // Rounds per second
  , trail: 50            // Afterglow percentage
  , fps: 20               // Frames per second when using setTimeout()
  , zIndex: 2e9           // Use a high z-index by default
  , className: 'spinner'  // CSS class to assign to the element
  , top: '40%'            // center vertically
  , left: '36%'           // center horizontally
  , shadow: false         // Whether to render a shadow
  , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
  , position: 'absolute'  // Element positioning
}

load = link => {
  const target = doc.querySelector('.content');
  const spinner = new Spinner(opts).spin(target);
  fetch(link).then(r => r.text()).then(html => {
    history.pushState({}, '', link);
    const div = doc.createElement('div');
    div.innerHTML = html;
    doc.querySelector('#centercolumn').innerHTML = div.querySelector('#centercolumn').innerHTML;
    doc.querySelector('#nav a').replaceWith(div.querySelector('#nav a'));
    modifyCenterColumn();
  	document.dispatchEvent(new Event("newpageloaded"));
    
    doc.querySelector('#nav a:nth-child(2)').text = word;
    focusOnSearch();
    spinner.stop();
  });
}

doc.addEventListener('click', e => {
  if (e.target.tagName == 'A' && /^https:\/\/www.wordreference.com\/.+\/.+$/.test(e.target.href)) {
    e.preventDefault();
    load(e.target.href);
  }
});

const suggestions = doc.querySelector('.autocomplete-suggestions'); 
const hideSuggestions = () => setTimeout(() => {
  suggestions.style.display = 'none';
  search.value = '';
}, 250);

const loadSelection = (sel) => {
  const v = sel.getAttribute('data-val');
  const selection = JSON.parse(decodeURIComponent(v));
  load(history.state.dictLink.href + selection.term);
  hideSuggestions();
}

suggestions.addEventListener('mousedown', e => {
  e.preventDefault();
  e.stopPropagation();
  loadSelection(e.target);
}, true);


doc.querySelector('#search div').addEventListener('keydown', e => {
  if (e.key == 'Enter') {
    e.preventDefault();
    e.stopPropagation();
    const hovered = doc.querySelector('.autocomplete-suggestion.hover');
    if (hovered) {
      loadSelection(hovered);
    } else {
      load(history.state.dictLink.href + search.value);
      hideSuggestions();
    }
  }
}, true);

doc.addEventListener('newpage', e => load(e.detail));

doc.addEventListener('keydown', focusOnSearch);

window.addEventListener('popstate', e => {
  const doc = document;
  doc.querySelector('#nav a:nth-child(2)').text = e.state.word;
  doc.querySelector('#centercolumn').innerHTML = e.state.html;
  const dictA = doc.createElement('a');
  dictA.href = e.state.dictLink.href;
  dictA.text = e.state.dictLink.text;
  doc.querySelector('#nav a').replaceWith(dictA);
});
