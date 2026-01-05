// ==UserScript==
// @name        Better Google
// @namespace   feifeihang.info
// @description Add 'quick search' input and 'go to top' button for Google. Also highlight search terms.
// @include     https://www.google.*
// @include     http://www.google.*
// @version     5.1.3
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/12182/Better%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/12182/Better%20Google.meta.js
// ==/UserScript==
var shouldHighlight = true;
var COLORS = [
  '#FFFF00',
  '#CCCCFF',
  '#00CCFF',
  '#33CCCC',
  '#FF8080',
  '#FFCC00',
  '#008000',
  '#FFFF99',
  '#808000',
  '#FFFFCC'
];
// highlight search terms.
var urlBuffer,
resultBuffer;
function highlight() {
  console.log('1');
  // first, find all 'em's.
  var ems = document.querySelectorAll('em');
  // if there is no 'em's, do nothing.
  if (ems.length === 0) {
    return false;
  }
  // convert ems into an array.

  ems = Array.prototype.slice.apply(ems);
  var counter = 0;
  var styles = {
  };
  // iterate through all the keywords in search result, 
  // and map the predefined color to them.
  ems.forEach(function (em) {
    var text = em.textContent.toUpperCase().trim();
    var bg = styles[text];
    if (!bg) {
      bg = styles[text] = COLORS[counter++];
      if (counter === COLORS.length) {
        counter = 0;
      }
    }
    em.style.background = bg;
    em.style.color = '#000';
    em.style.fontWeight = 'bold';
  });
}
function toggleHighlight() {
  if (!shouldHighlight) {
    shouldHighlight = true;
    highlight();
  } 
  else {
    shouldHighlight = false;
    var ems = document.querySelectorAll('em');
    if (ems.length === 0) {
      return false;
    }
    ems = Array.prototype.slice.apply(ems);
    ems.map(function (em) {
      em.style.background = '#fff';
    });
  }
}
GM_registerMenuCommand('Toggle Highlight', toggleHighlight);
setInterval(function () {
  // if it's not google's landing page.
  if (urlBuffer !== window.location.href &&
  !document.querySelector('#hplogo')) {
    var resultContainer = document.querySelector('#search');
    if (resultContainer && resultContainer.textContent !== resultBuffer) {
      // update buffer.
      resultBuffer = resultContainer.textContent;
      if (!shouldHighlight) {
        return;
      }
      // first, find all 'em's.

      var ems = document.querySelectorAll('em');
      // if there is no 'em's, do nothing.
      if (ems.length === 0) {
        return false;
      }
      // convert ems into an array.

      ems = Array.prototype.slice.apply(ems);
      var counter = 0;
      var styles = {
      };
      // iterate through all the keywords in search result, 
      // and map the predefined color to them.
      ems.forEach(function (em) {
        var text = em.textContent.toUpperCase().trim();
        var bg = styles[text];
        if (!bg) {
          bg = styles[text] = COLORS[counter++];
          if (counter === COLORS.length) {
            counter = 0;
          }
        }
        em.style.background = bg;
        em.style.color = '#000';
        em.style.fontWeight = 'bold';
      });
      urlBuffer = window.location.href;
    }
  }
}, 200);
var container = document.createElement('div');
container.style = 'display: none; position: fixed; bottom: 20px;' +
'right: 5px; text-align: right;' +
'width: 280px; height: 60px; z-index: 999999999;' +
'opacity: 0.8;';
container.addEventListener('mouseenter', function () {
  this.style.opacity = '1';
}, true);
container.addEventListener('mouseout', function () {
  this.style.opacity = '0.8';
}, true);
// create quick query input.
var input = document.createElement('input');
input.tyle = 'text';
input.value = document.querySelector('#lst-ib').value;
input.setAttribute('placeholder', 'Search...');
input.style = 'border: none; border-left: solid #EA4335 5px; flex: 1; display: inline-block; outline: none; height: 40px;' +
'font-size: 15px; margin-top: 10px; margin-bottom: 10px; padding: 0; ' +
'padding-left: 10px; padding-right: 10px; box-shadow: 0 1px 3px #999999;';
container.appendChild(input);
// bind keypress-enter event.
input.addEventListener('keypress', function (evt) {
  if (evt.keyCode === 13) {
    var value = input.value.trim() || '';
    if (value !== '') {
      document.querySelector('#lst-ib').value = value;
      document.querySelector('.lsb').click();
      window.scrollTo(0, 0);
      document.querySelector('#lst-ib').focus();
    }
  }
}, false);
// create the goto-top button.
var btn = document.createElement('div');
btn.id = 'goto-top-btn';
btn.innerHTML = 'TOP';
btn.onclick = gotoTop;
// set button CSS style.
btn.style = 'display: inline-block; position: relative; left: -7px; color: #fff; line-height: 60px; text-align: center;' +
'width: 60px; height: 60px; background: #4285F4; box-shadow: 0 2px 3px #999999;' +
'cursor: pointer; font-weight: bolder; border-radius: 100%;';
// append the go-to-top to search form to successfully attach to the UI.
container.appendChild(btn);
var form = document.querySelector('#searchform');
form.appendChild(container);
window.onload = function () {
  var doc = document.documentElement;
  var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  if (top !== 0) {
    container.style.display = 'flex';
  }
}
// bind button hiden/show event.

window.onscroll = function () {
  var doc = document.documentElement;
  var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  if (top === 0) {
    container.style.display = 'none';
  } else {
    container.style.display = 'flex';
  }
}
function gotoTop() {
  goto(Math.floor(window.pageYOffset / 5));
}
function goto(step) {
  setTimeout(function () {
    window.scrollTo(0, window.pageYOffset - step);
    if (window.pageYOffset <= 0) return;
    goto(step);
  }, 100);
}
