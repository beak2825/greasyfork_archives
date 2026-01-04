// ==UserScript==
// @name         Text to Speech
// @namespace    http://tampermonkey.net/
// @version      1.1.12
// @description  Text to Speech description
// @author       Hồng Minh Tâm
// @include      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @icon         https://png.icons8.com/androidL/44/000000/speaker.png
// @connect      ailab.hcmus.edu.vn
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34643/Text%20to%20Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/34643/Text%20to%20Speech.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle([
    '.text-to-speech, .text-to-speech-control { z-index: 10000000000; position: absolute; overflow: hidden; color: #000; background-color: #fff; border: 1px solid #333; border-radius: 2px; line-height: 0; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; }',
    '.text-to-speech-control { position: fixed; bottom: 10px; left: 10px; }',
    '.text-to-speech-item-control { display: inline-block; float: left; }',
    '.text-to-speech-icon { margin: 0; padding: 0; }',
    '.text-to-speech-percent { text-align: center; width: 48px; height: 24px; line-height: 24px; padding: 0 6px; }',
    '.text-to-speech.hide, .text-to-speech-control.hide { display: none; }'
  ].join('\n'));

  var maxNumOfWords = 70,
    text = '',
    index,
    sentences,
    voices = {
      'Sài gòn': 'kp',
      'Huế': 'bg',
      'Hà nội': 'bt'
    },
    speed = 1,
    voice = 'Sài gòn',
    status = 'play',
    percent = 0,
    currentNumOfWords = 0,
    totalNumOfWords = 0,
    percentAudio = 0,
    audio,
    tempText,
    tempIndex,
//    icon = {
//      speaker: getIcons8('androidL', 'speaker', 24, '000000'),
//      pause: getIcons8('androidL', 'pause', 24, '000000'),
//      stop: getIcons8('androidL', 'stop', 24, '000000'),
//      play: getIcons8('androidL', 'play', 24, '000000')
//    };
    icon = {
      speaker: getIcons8('androidL', 'speaker', 24, '000000'),
      pause: getIcons8('androidL', 'pause', 24, '000000'),
      stop: getIcons8('androidL', 'stop', 24, '000000'),
      play: getIcons8('androidL', 'play', 24, '000000')
    };

  var $textToSpeech = $('<div/>', {
    class: 'text-to-speech hide'
  }).appendTo(document.body).on('mousedown', mousedownBlock);
  var $iconTextToSpeech = $('<img/>', {
    class: 'text-to-speech-icon',
    src: icon.speaker
  }).appendTo($textToSpeech);

  var $textToSpeechControl = $('<div/>', {
    class: 'text-to-speech-control hide'
  }).appendTo(document.body).on('mousedown', mousedownBlock);

  var $itemPlayPause = $('<div/>', {
    class: 'text-to-speech-item-control'
  }).appendTo($textToSpeechControl);
  var $iconPlayPause = $('<img/>', {
    class: 'text-to-speech-icon',
    src: icon.pause
  }).appendTo($itemPlayPause);

  var $itemStop = $('<div/>', {
    class: 'text-to-speech-item-control'
  }).appendTo($textToSpeechControl);
  var $iconStop = $('<img/>', {
    class: 'text-to-speech-icon',
    src: icon.stop
  }).appendTo($itemStop);

  var $itemPercent = $('<div/>', {
    class: 'text-to-speech-item-control'
  }).appendTo($textToSpeechControl);
  var $iconPercent = $('<div/>', {
    class: 'text-to-speech-percent',
    text: '0%'
  }).appendTo($itemPercent);

  $textToSpeech.on('click', function (event) {
    event.preventDefault();
    stop();
    loadInfo();
    read();
    $textToSpeech.addClass('hide');
    $textToSpeechControl.removeClass('hide');
  });

  $itemPlayPause.on('click', function (event) {
    if (status !== 'end') {
      if (status === 'play') {
        pause();
      } else if (status === 'pause' || status === 'stop') {
        play();
      } else {
        console.error('error status other:', status);
      }
    } else {
      index = 0;
      status = 'play';
      read();
    }
  });

  $itemStop.on('click', function (event) {
    event.preventDefault();
    stop();
  });

  function getIcons8(style, id, size, color) {
    return 'https://png.icons8.com/' + style + '/' + size + '/' + color + '/' + id + '.png';
  }

  function mousedownBlock(event) {
    event.preventDefault();
  }

  function loadInfo() {
    index = 0;
    totalNumOfWords = 0;
    status = 'play';
    text = text.replace(/=/g, ' bằng ');
    text = text.replace(/&/g, ' và ');
    sentences = [];
    if (text) {
      var tempSentences = text.match(/\S.*?([^.,;?!\n]+[.,;?!\n]+|$)(?=\s|$)/g);
      tempSentences.forEach(function (text, index) {
        var sentence = createObjectSentence(text);
        var words = sentence.words;
        var numOfWords = sentence.numOfWords;
        if (numOfWords > maxNumOfWords) {
          var start = 0;
          var end = 0;
          while (start < numOfWords) {
            sentence = {};
            end = ((start + maxNumOfWords) < numOfWords) ? start + maxNumOfWords : numOfWords;
            sentence = createObjectSentence(words.slice(start, end).join(' '));
            sentences.push(sentence);
            start = end;
          }
        } else {
          sentences.push(sentence);
        }
      });
    }

    function createObjectSentence(text) {
      var sentence = {};
      sentence.text = text;
      // sentence.words = text.match(/\S+/g);
      sentence.words = sentence.text.split(' ');
      sentence.numOfWords = sentence.words.length;
      totalNumOfWords += sentence.numOfWords;
      return sentence;
    }
  }

  function read() {
    if (status != 'stop' && index < sentences.length) {
      tempIndex = index;
      var text = getTextMax();
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://ailab.hcmus.edu.vn/vos/demo.php?' + new Date().getTime(),
        data: 'text=' + text + '&voice=' + voices[voice] + '&speed=' + speed,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function (response) {
          audio = $(response.response).filter('audio');
          //audio.trigger('pause');
          var source = audio.find('source');
          var linkaudio = 'https://ailab.hcmus.edu.vn/vos/' + source.attr('src');
          source.prop('src', linkaudio);
          audio.trigger('load');
          audio.on('canplay', function () {
            audio.trigger('play');
          }).on('ended', function () {
            $iconPercent.text(percent + '%');
            read();
          }).on('pause', function () {
            if (!this.ended) {
              status = 'pause';
              $iconPlayPause.attr('src', icon.play);
            }
          }).on('play', function () {
            if (!this.ended) {
              status = 'play';
              $iconPlayPause.attr('src', icon.pause);
            }
          }).on('timeupdate', function() {
            var duration =  audio.prop('duration');
            if (duration > 0) {
              var tempPercent = Math.round((percent - percentAudio) + (audio.prop('currentTime') / duration) * percentAudio);
              if (tempPercent <= 100) {
                $iconPercent.text(tempPercent + '%');
              }
            }
          });;
        },
        onerror: function (response) {
          index = tempIndex;
          read();
        }
      });
    } else {
      status = 'end';
      $iconPlayPause.attr('src', icon.play);
      $textToSpeechControl.addClass('hide');
    }
  }

  function stop() {
    if (audio) {
      audio.prop('src', 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=');
      audio.trigger('pause');
      status = 'stop';
      index = 0;
      percent = 0;
      $iconPercent.text(percent + '%');
      currentNumOfWords = 0;
    }
  }

  function pause() {
    if (audio) {
      $iconPlayPause.attr('src', icon.play);
      audio.trigger('pause');
    }
  }

  function play() {
    if (audio) {
      $iconPlayPause.attr('src', icon.pause);
      audio.trigger('play');
    }
  }

  function getTextMax() {
    var textMax = '';
    var countWords = 0;
    while (index < sentences.length && countWords + sentences[index].numOfWords <= maxNumOfWords) {
      textMax += ' ' + sentences[index].text;
      countWords += sentences[index].numOfWords;
      index++;
    }
    currentNumOfWords += countWords;
    var tempPercent = Math.round((currentNumOfWords / totalNumOfWords) * 100);
    percentAudio = tempPercent - percent;
    percent = tempPercent;
      console.log(percentAudio, percent);
    return textMax;
  }

  $(document).on('mouseup', function (e) {
    tempText = getSelectedText().trim();
    if (tempText !== '' && text !== tempText) {
      text = tempText;
      if (status === 'end') {
        $textToSpeechControl.addClass('hide');
      }
      $textToSpeech.removeClass('hide');
      $textToSpeech.css({
        left: e.pageX - 30,
        top: e.pageY + 10
      });
    } else {
      if (!$(e.target).closest('.text-to-speech').length && !$(e.target).closest('.text-to-speech-control').length) {
        text = '';
      }
      $textToSpeech.addClass('hide');
    }
  });

  function getSelectedText() {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.getSelection) {
      return document.getSelection().toString();
    } else if (document.selection) {
      return document.selection.createRange().text;
    }
    return '';
  }
})();