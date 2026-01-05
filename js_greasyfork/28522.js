// ==UserScript==
// @name        Improve 8bcDump
// @namespace   Improve8bcDump
// @description Improve the interface of the public 8bitcollective archive on brkbrkbrk.com.
// @include     http://brkbrkbrk.com/8bcdump/
// @include     https://brkbrkbrk.com/8bcdump/
// @include     http://www.brkbrkbrk.com/8bcdump/
// @include     https://www.brkbrkbrk.com/8bcdump/
// @version     0.4.3
// @grant       none
// @author      Jack Willis
// @license     MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/28522/Improve%208bcDump.user.js
// @updateURL https://update.greasyfork.org/scripts/28522/Improve%208bcDump.meta.js
// ==/UserScript==

(function() {
  console.log('Improve8bcDump v0.4.3 is active.');

  // Fix a wrong attribute on the page's external stylesheet.
  var stylesheet = document.querySelector('link[type="text/stylesheet"]');
  stylesheet.setAttribute('type', 'text/css');

  // Styles for the last played list
  var newStyles = document.createElement('style');
  newStyles.textContent += '.lastPlayed li:first-child { font-weight: bold; }';
  newStyles.textContent += '.lastPlayed li:first-child:after { content: " (playing)" }';
  newStyles.textContent += '.lastPlayed { margin: 1em; padding: 2em; border: 1px solid black; }';
  document.body.appendChild(newStyles);
  
  // Create a stack for the last played songs.
  // The stack is realized in an <ol>, contained in parentElement.

  var getSongLinkByIndex = function(index) {
    return document.getElementById(index).querySelector('a');
  };
  
  function LastPlayedList(maxLength, parentElement) {
    // Create a heading for the last played list
    var heading = document.createElement('h2');
    heading.textContent = 'Last played';
    parentElement.appendChild(heading);
    
    // Create the list itself
    var list = document.createElement('ol');
    list.classList.add('lastPlayed');
    parentElement.appendChild(list);
    
    // Push songs through the stack
    this.push = function(songNode) {
      var nodes = list.childNodes;
      
      if (nodes.length == maxLength) {
        list.removeChild(nodes[nodes.length - 1]);
      }
      
      list.insertBefore(songNode, nodes[0]);
    };

    this.currentSongInfo = function() {
      return list.childNodes[0].querySelector('span').innerHTML;
    };
  }
  
  // Create a list near the top of the page to hold the last 20 songs
  var lastPlayedDiv = document.createElement('div');
  document.body.insertBefore(lastPlayedDiv, document.querySelector('h1 + p'));

  var lastPlayedList = new LastPlayedList(20, lastPlayedDiv);
  
  // The song's information should be added to the last played list.
  // Overriding the existing updateID3 method

  var isBlank = function(str) {
    return !str || !(/\w/.test(str));
  };

  window.updateID3 = function(id3) {
    var songLi = document.createElement('li');
    var songInfo = document.createElement('span');

    var title = isBlank(id3.title) ? 'Untitled' : ('&ldquo;' + id3.title.trim() + '&rdquo;');
    var artist = isBlank(id3.artist) ? 'unknown' : id3.artist.trim();

    var album = '';
    if (!isBlank(id3.album)) {
      var em = document.createElement('em');
      em.textContent = id3.album;
      album = ' on ' + em.outerHTML;
    }

    var songInfoHTML = title + ' by ' + artist + album + '. ';

    songInfo.innerHTML = songInfoHTML;
    window.liID3.innerHTML = songInfoHTML;

    var originalSongLink = getSongLinkByIndex(window.index);

    // Create a song link to put in the last played list

    var secondarySongLink = document.createElement('a');
    secondarySongLink.href = originalSongLink.href;
    secondarySongLink.textContent = '(' + originalSongLink.textContent + ')';

    secondarySongLink.onclick = function(e) {
      e.preventDefault();
      originalSongLink.click();
    };

    songLi.appendChild(songInfo);
    songLi.appendChild(secondarySongLink);

    lastPlayedList.push(songLi);
  };

  // Make sure the player information is the same as on the list due to timing issues
  setInterval(function() {
    window.liID3.innerHTML = lastPlayedList.currentSongInfo();
  }, 250);

  // Add more buttons to the player interface

  // The <audio> element
  var audio = window.tP.el;

  var tPControls = document.querySelector('ul.tpControls');

  var ffLi = document.createElement('li');
  ffLi.classList.add('ff');

  // The player control buttons use Font Awesome icons
  var fastForwardButton = document.createElement('i');
  fastForwardButton.classList.add('fa', 'fa-fast-forward');

  ffLi.style.marginLeft = '0.25em';

  ffLi.appendChild(fastForwardButton);
  tPControls.appendChild(ffLi);

  // Shuffle button uses a checkbox
  var shuffleLi = document.createElement('li');
  shuffleLi.classList.add('shuffle');

  var shuffleButton = document.createElement('input');
  shuffleButton.setAttribute('type', 'checkbox');

  var shuffleText = document.createTextNode('Shuffle?');
  shuffleLi.style.marginLeft = '1em';

  shuffleLi.appendChild(shuffleText);
  shuffleLi.appendChild(shuffleButton);
  tPControls.appendChild(shuffleLi);

  // The fast forward button triggers the 'ended' event on the audio player.
  fastForwardButton.addEventListener('click', function() {
    audio.dispatchEvent(new CustomEvent('ended'));
  });

  var randInt = function(max) {
    return Math.floor(Math.random() * max);
  };

  audio.addEventListener('ended', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    var nextSongIndex = shuffleButton.checked ? randInt(window.archiveAs.length) : window.index;
    getSongLinkByIndex(nextSongIndex).click();
  });
}());