// ==UserScript==
// @name         SC Display Languages
// @version      0.1.2
// @description  Displays movies audio and text languages in SC
// @author       risq
// @match        http*://secret-cinema.pw/torrents.php?id=*
// @namespace https://greasyfork.org/users/157340
// @downloadURL https://update.greasyfork.org/scripts/34609/SC%20Display%20Languages.user.js
// @updateURL https://update.greasyfork.org/scripts/34609/SC%20Display%20Languages.meta.js
// ==/UserScript==

var torrents = unsafeWindow.jQuery('.torrent_table .torrent_row').each(function (i, el) {
  var $el = unsafeWindow.jQuery(el);
  var languages = parseText($el.next().find('> td > blockquote').text());

  var text = void 0;
  if (languages.audio.length) {
    text = 'Audio: <i><b>' + languages.audio.join(', ') + '</b></i>';

    if (languages.text.length) {
      text += ' / Text:  <i><b>' + languages.text.join(', ') + '</b></i>';
    }
  } else if (languages.text.length) {
    text = 'Text:  <i><b>' + languages.text.join(', ') + '</b></i>';
  }

  if (text) {
    $el.find('> td:first-child').append('<div style="color: #666">' + text + '</div>');
  }
});

function parseText(text) {
  var res = {
    audio: [],
    text: []
  };

  var dataFound = false;

  const bdinfoAudio = /AUDIO:\s*\n\n\s*Codec\s*Language.*\s*\n\s*(-|\s)*\s*\n((.|\n)*)\n\s*SUBTITLES/gi.exec(text);
  if (bdinfoAudio) {
    bdinfoAudio[2].split(/\n/g).forEach(function (info) {
      var audio = /(\s\s)+\s*(\w+)/gi.exec(info);

      if (audio && isResultValid(audio[2])) {
        dataFound = true;
        res.audio.push(audio[2]);
      }
    });
  }

  const bdinfoText = /SUBTITLES:\s*\n\n\s*Codec\s*Language.*\s*\n\s*(-|\s)*\s*\n((.|\n)*)\n\s*FILES/gi.exec(text);
  if (bdinfoText) {
    bdinfoText[2].split(/\n/g).forEach(function (info) {
      var text = /(\s\s)+\s*(\w+)/gi.exec(info);

      if (text && isResultValid(text[2])) {
        dataFound = true;
        res.text.push(text[2]);
      }
    });
  }

  if (dataFound) {
    return res;
  }

  var blocks = text.split(/\s*\n\s*\n\s*/g).forEach(function (block) {
    var title = block.split('\n')[0].toLowerCase();

    if (title.indexOf('audio') > -1) {
      var audio = /language\s*:\s*(.*)/gi.exec(block);

      if (audio && isResultValid(audio[1])) {
        dataFound = true;
        res.audio.push(audio[1]);
      }
    }

    if (title.indexOf('text') > -1) {
      var text = /language\s*:\s*(.*)/gi.exec(block);

      if (text && isResultValid(text[1])) {
        dataFound = true;
        res.text.push(text[1]);
      }
    }
  });

  if (dataFound) {
    return res;
  }

  var lines = text.split(/\n/g);

  lines.forEach(function (line) {
    var audio = /.*?(audio).*?:\s*(\w+)/gi.exec(line);

    if (audio && isResultValid(audio[2])) {
      res.audio.push(audio[2]);
      return;
    }

    var text = /.*?(subtitle|text).*?:\s*(\w+)/gi.exec(line);

    if (text && isResultValid(text[2])) {
      res.text.push(text[2]);
      return;
    }
  });

  return res;
}

function isResultValid(result) {
  if (result.trim().length === 0) {
    return false;
  }
  var invalidWords = ['untouched', 'none', 'no'];

  var regexp = new RegExp('(\\b' + invalidWords.join('\\b|\\b') + '\\b)', 'gi');

  return !regexp.test(result);
}