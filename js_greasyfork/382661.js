// ==UserScript==
// @name         SC Display Mediainfo Table
// @version      0.3.14.15926535897
// @description  Displays Mediainfo Table on SC
// @author       bubonic & risq
// @match        http://secret-cinema.pw/torrents.php?id=*
// @match        https://secret-cinema.pw/torrents.php?id=*
// @namespace https://greasyfork.org/en/users/298623
// @downloadURL https://update.greasyfork.org/scripts/382661/SC%20Display%20Mediainfo%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/382661/SC%20Display%20Mediainfo%20Table.meta.js
// ==/UserScript==

var torrents = unsafeWindow.jQuery('.torrent_table .torrent_row').each(function (i, el) {
  var $el = unsafeWindow.jQuery(el);
  var languages = parseText($el.next().find('> td > blockquote').text());

  var text = void 0;
  var textSubtitles = void 0;
  var bitRateVideoText = void 0;
  var AudioText = void 0;
  var bitRateAudioText = void 0;
  var FileSizeText = void 0;
  var DurationText = void 0;
  var FormatText = void 0;
  var vCodecText = void 0;
  var FrameRateText = void 0;
  var ResolutionText = void 0;
  var AspectRatioText = void 0;
  var MinSettingsText = void 0;
  var FormatProfileText = void 0;
  var minsettings = false;

  if (languages.audio.length) {
      AudioText = 'Audio: ' + languages.audio.join("<br>Audio: ");
  }
  if (languages.text.length) {
      var uniq = [...new Set(languages.text)];
      textSubtitles = 'Subtitles:  <i><b>' + uniq.join(', ') + '</b></i>';
      //textSubtitles = 'Subtitles:  <i><b>' + languages.text.join(', ') + '</b></i>';
  }
  if (languages.videobr.length) {
      bitRateVideoText = 'Bit rate: <b>' + languages.videobr.join(', ') + '</b>';
  }
  if (languages.size.length) {
      FileSizeText = languages.size.join(', ');
  }
  if (languages.duration.length) {
      DurationText = languages.duration.join(', ');
  }
  if (languages.format.length) {
      FormatText = languages.format.join(', ');
  }
  if (languages.videocodec.length) {
      vCodecText = languages.videocodec.join(', ');
  }
  if (languages.width.length && languages.height.length) {
      ResolutionText = languages.width.join(', ') + 'x' + languages.height.join(', ');
  }
  if (languages.fps.length) {
      FrameRateText = languages.fps.join(', ');
  }
  if (languages.ar.length) {
      AspectRatioText = languages.ar.join(', ');
  }

  var k;
  if (languages.minset.length) {
      for (k = 0; k < languages.minset.length; k++) {
          if (languages.minset[k] == 1) {
              minsettings = true;
          }
          else{
              minsettings = false;
              break;
          }
      }
  }




  if (minsettings) {
      MinSettingsText = 'Minimum settings: Met';
  }
  else {
      //MinSettingsText = 'Minimum settings: Not met ' + languages.setnotmet.join(', ');
      //MinSettingsText = 'Min. settings: <a class="tooltip" title="' + languages.setnotmet.join(', ') +'">Not Met</a>';
      addGlobalStyle(`

.toggletip-container {
  position: relative;
  display: flex;
  overflow: visible;
  left: -5%

}

/* the bubble element, added inside the toggletip live region */

.toggletip-bubble {
  display: flex;
  overflow: visible;
  position: absolute;
  left: -25%
  top: 2;
  width: 20em;
  padding: 0.5rem;
  background: #000;
  color: #fff;
  opacity: 0.80;
  border-radius: 15px 50px;
}

.button666 {
  width: 5em;
  height: 1.3em;
  border-radius: 0%;
  border: 0;
  font-style: italic;
  font-size: 90%;
  color: #000;
  left: 0%
}

.button666:focus {
  outline: none;
  box-shadow: 0 0 0 0.25rem skyBlue;
}

`)


      MinSettingsText = 'Min. settings: <span class="toggletip-container"> <button class="button button666" aria-label="more info" data-toggletip-content="' + languages.setnotmet.join(', ') +'">Not Met</button><span role="status"></span></span>'



  }

/*
  if (languages.profile.length) {
      FormatProfileText = languages.profile.join(', ');
  }
*/




  if (text) {
    $el.find('> td:first-child').append('<div style="color: #666">' + text + '</div>');
  }
  if (AudioText || FileSizeText || DurationText || FormatText) {
      //$el.find('> td:first-child').append('<div style="color: #666">' + bitRateText + '</div>');
      //$el.find('> td:first-child').append('<table><tr><th>General</th><th>Video</th><th>Audio</th></tr><tr><td></td><td>' + bitRateVideoText + '</td><td></td></tr><tr><td>Subtitles:</td><td></td><td></td></tr></table>');
      $el.find('> td:first-child').append('<table style="border-collapse:collapse;border-spacing:0;border:none;border-color:#aaa" class="tg"><tr><th style="font-family:Arial, sans-serif;font-size:11px;font-weight:bold;padding:3px 3px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:inherit;color:#fff;background-color:#000000;text-align:center;vertical-align:top">General</th><th style="font-family:Arial, sans-serif;font-size:11px;font-weight:bold;padding:3px 3px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:inherit;color:#fff;background-color:#000000;text-align:center;vertical-align:top">Video</th><th style="font-family:Arial, sans-serif;font-size:11px;font-weight:bold;padding:3px 3px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:inherit;color:#fff;background-color:#000000;text-align:center;vertical-align:top;">Audio</th></tr><tr align="left"><td style="font-family:Arial, sans-serif;font-size:11px;padding:4px 4px;border-style:solid;border-width:0px;overflow:visible;word-break:normal;border-color:inherit;color:#333;background-color:#fff;text-align:left;vertical-align:top; width:122px;">Container: ' + FormatText + '<br>Runtime: ' + DurationText + '<br>Size: ' + FileSizeText + '<br>' + MinSettingsText + '</td><td style="font-family:Arial, sans-serif;font-size:11px;padding:4px 4px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:inherit;color:#333;background-color:#fff;text-align:left;vertical-align:top;width:113px;">Codec: ' + vCodecText + '<br>Resolution: ' + ResolutionText + '<br>Aspect Ratio: ' + AspectRatioText + '<br>Frame Rate: ' + FrameRateText + '<br>' + bitRateVideoText + '</td><td style="font-family:Arial, sans-serif;font-size:11px;padding:4px 4px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:inherit;color:#333;background-color:#fff;text-align:left;vertical-align:top;"><span align="left" style="max-width:190px;">' + AudioText + '</span></td></tr></table>');
      $el.find('> td:first-child').append('<div style="color: #666">' + textSubtitles + '</div>');
  }
});

function parseText(text) {
  var res = {
    audio: [],
    text: [],
    videobr: [],
    audiobr: [],
    size: [],
    duration: [],
    format: [],
    videocodec: [],
    width: [],
    height: [],
    ar: [],
    fps: [],
    ref: [],
    profile: [],
    minset: [],
    setnotmet: []

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
  //var blocks = text.split(/\n/g).forEach(function (block) {
    var title = block.split('\n')[0].toLowerCase();
    var title2 = block.split('\n\n')[0].toLowerCase();
    console.log(block);
    console.log(title);

    if (title.indexOf('general') > -1 || title2.indexOf('general') > -1) {
    //if (generalText) {
        var size = /File\ssize\s*:\s*(.*)/gi.exec(block);
        var duration = /Duration\s*:\s*(.*)/gi.exec(block);
        var format = /Format\s*:\s*(.*)/gi.exec(block);
        if (size && isResultValid(size[1])) {
            dataFound = true;
            res.size.push(size[1]);
        }
        if (duration && isResultValid(duration[1])) {
            dataFound = true;
            res.duration.push(duration[1]);
        }
        if (format && isResultValid(format[1])) {
            dataFound = true;
            res.format.push(format[1]);
        }
    }
    //if (videoText) {
    if (title.indexOf('video') > -1) {
      var video = /Bit\srate\s*:\s*(.*)/gi.exec(block);
      var width = /Width\s*:\s*(\d.\d+)/gi.exec(block);
      var height = /Height\s*:\s*(\d.\d+)/gi.exec(block);
      var vcodec = /Writing\slibrary\s*:\s*(....)\s.*/gi.exec(block);
      var aspectratio = /Display\saspect\sratio\s*:\s*(.*)/gi.exec(block);
      var framerate = /Frame\srate\s*:\s*(\d+.\d+)/gi.exec(block);
      var profile = /Format\sprofile\s*:\s*(.*)/gi.exec(block);

      if (profile && isResultValid(profile[1])) {
          res.profile.push(profile[1]);
          if (parseInt(height[1].replace(/\s/g, "")) <= 576) {
              switch(profile[1].trim()) {
                  case 'High@L5.1':
                      res.minset.push(1);
                      break;
                  case 'High@L5':
                      res.minset.push(1);
                      break;
                  case 'High@L4.2':
                      res.minset.push(1);
                      break;
                  case 'High@L4.1':
                      res.minset.push(1);
                      break;
                  case 'High@L4':
                      res.minset.push(1);
                      break;
                  case 'High@L3.2':
                      res.minset.push(1);
                      break;
                  case 'High@L3.1':
                      res.minset.push(1);
                      break;
                  default:
                      res.minset.push(0);
                      res.setnotmet.push(profile[1]);
              }
          }
          else {
              switch(profile[1]) {
                  case "High@L5.1":
                      res.minset.push(1);
                      break;
                  case "High@L5":
                      res.minset.push(1);
                      break;
                  case "High@L4.2":
                      res.minset.push(1);
                      break;
                  case "High@L4.1":
                      res.minset.push(1);
                      break;
                  default:
                      res.minset.push(0);
                      res.setnotmet.push(profile[1]);
              }
          }
      }

      var x264settings = /Encoding\ssettings\s*:\s*(.*)/gi.exec(block);
      var merange = void 0;
      var me = void 0;
    if (x264settings) {
      var x264blocks = x264settings[1].split("/").forEach(function (item) {
          var refFrames = /\sref=(\d+)/gi.exec(item);
          var cabac = /cabac=(\d+)/gi.exec(item);
          var rc = /\src=(.*)/gi.exec(item);
          var trellis = /\strellis=(.*)/gi.exec(item);
          me = /\sme=(.*)/gi.exec(item);
          var subme = /\ssubme=(\d+)/gi.exec(item);
          merange = /\sme_range=(\d+)/gi.exec(item);
          var rclookahead = /\src_lookahead=(\d+)/gi.exec(item);
          var bframes = /\sbframes=(\d+)/gi.exec(item);


          if (cabac && isResultValid(cabac[1])) {
              res.ref.push(cabac[1]);
              if (parseInt(cabac[1]) == 1) {
                  res.minset.push(1);
              }
              else {
                  res.minset.push(0);
                  res.setnotmet.push("cabac=" + cabac[1]);
              }
          }
          if (rc && isResultValid(rc[1])) {
              res.ref.push(rc[1]);
              switch (rc[1].trim()) {
                  case "crf":
                      res.minset.push(1);
                      break;
                  case "2pass":
                      res.minset.push(1);
                      break;
                  default:
                      res.minset.push(0);
                      res.setnotmet.push("rc=" + rc[1]);
              }
          }
          if (trellis && isResultValid(trellis[1])) {
              res.ref.push(trellis[1]);
              if (parseInt(trellis[1]) != 2) {
                  res.minset.push(0);
                  res.setnotmet.push("trellis=" + trellis[1]);
              }
              else {
                  res.minset.push(1);
              }
          }

          if (me && isResultValid(me[1])) {
              res.ref.push(me[1]);
              switch (me[1].trim()) {
                  case "umh":
                      res.minset.push(1);
                      break;
                  case "esa":
                      res.minset.push(1);
                      break;
                  case "tesa":
                      res.minset.push(1);
                      break;
                  default:
                      res.minset.push(0);
                      res.setnotmet.push("me=" + me[1].trim());
              }
          }
          if (subme && isResultValid(subme[1])) {
              res.ref.push(subme[1]);
              if (parseInt(subme[1]) < 7) {
                  res.minset.push(0);
                  res.setnotmet.push("subme=" + subme[1]);
              }
              else {
                  res.minset.push(1);
              }
          }
          if (rclookahead && isResultValid(rclookahead[1])) {
              res.ref.push(rclookahead[1]);
              if (parseInt(rclookahead[1]) < 60) {
                  res.minset.push(0);
                  res.setnotmet.push("rc_lookahead=" + rclookahead[1]);

              }
              else {
                  res.minset.push(1);
              }
          }
          if (refFrames && isResultValid(refFrames[1])) {
              if (parseInt(height[1].replace(/\s/g, "")) <= 576) {
                  if (parseInt(refFrames[1]) < 9) {
                      res.minset.push(0);
                      res.setnotmet.push("ref=" + refFrames[1]);
                  }
                  else {
                      res.minset.push(1);
                  }
              }
              else if (parseInt(height[1].replace(/\s/g, "")) > 576 && parseInt(height[1].replace(/\s/g, "")) <= 720) {
                  if (parseInt(refFrames[1]) < 8) {
                      res.minset.push(0);
                      res.setnotmet.push("ref=" + refFrames[1]);
                  }
                  else {
                      res.minset.push(1);
                  }
              }
              else {
                  if (parseInt(refFrames[1]) < 3) {
                      res.minset.push(0);
                      res.setnotmet.push("ref=" + refFrames[1]);
                  }
                  else {
                      res.minset.push(1);
                  }
              }
              res.ref.push(refFrames[1]);
          }

          if (bframes && isResultValid(bframes[1])) {
              res.ref.push(bframes[1]);
              if (parseInt(height[1].replace(/\s/g, "")) <= 576) {
                  if (parseInt(bframes[1]) < 5) {
                      res.minset.push(0);
                      res.setnotmet.push("bframes=" + bframes[1]);
                  }
                  else {
                      res.minset.push(1);
                  }
              }
              else if (parseInt(height[1].replace(/\s/g, "")) > 576 && parseInt(height[1].replace(/\s/g, "")) <= 720) {
                  if (parseInt(bframes[1]) < 5) {
                      res.minset.push(0);
                      res.setnotmet.push("bframes=" + bframes[1]);
                  }
                  else {
                      res.minset.push(1);
                  }
              }
              else {
                  if (parseInt(bframes[1]) < 3) {
                      res.minset.push(0);
                      res.setnotmet.push("bframes=" + bframes[1]);
                  }
                  else {
                      res.minset.push(1);
                  }
              }
          }
          if (merange && isResultValid(merange[1])) {
              res.ref.push(merange[1]);
              if (parseInt(height[1].replace(/\s/g, "")) <= 576) {
                  if (parseInt(merange[1]) < 24) {
                      res.minset.push(0);
                      res.setnotmet.push("merange=" + merange[1]);

                  }
                  else {
                      res.minset.push(1);
                  }

              }
              else if (parseInt(merange[1]) < 16) {
                  res.minset.push(0);
                  res.setnotmet.push("merange=" + merange[1]);
              }
              else {
                  res.minset.push(1);
              }
            }
      });


    }

      if (video && isResultValid(video[1])) {
          dataFound = true;
          res.videobr.push(video[1]);
      }
      if (vcodec && isResultValid(vcodec[1])) {
          dataFound = true;
          res.videocodec.push(vcodec[1]);
      }
      if (width && isResultValid(width[1])) {
          dataFound = true;
          res.width.push(width[1].replace(/\s/g, ""));
      }
      if (height && isResultValid(height[1])) {
          dataFound = true;
          res.height.push(height[1].replace(/\s/g, ""));
      }
      if (aspectratio && isResultValid(aspectratio[1])) {
          dataFound = true;
          res.ar.push(aspectratio[1]);
      }
      if (framerate && isResultValid(framerate[1])) {
          dataFound = true;
          res.fps.push(framerate[1]);
      }
    }
    //if (audioText) {
    if (title.indexOf('audio') > -1) {
      var audio = /language\s*:\s*(.*)/gi.exec(block);
      var audioTitle = /title\s*:\s*(.*)/gi.exec(block);
      var audioBR = /Bit\srate\s*:\s*(.*)/gi.exec(block);
      var audioCodec = /Format\s*:\s*(.*)/gi.exec(block);
      var audioInfo = void 0;

      if (audioBR && isResultValid(audioBR[1])) {
          dataFound = true;
          res.audiobr.push(audioBR[1]);
      }
      if (audio && isResultValid(audio[1])) {
        dataFound = true;
        if (audioTitle && isResultValid(audioTitle[1])) {
            if (audioBR && isResultValid(audioBR[1])) {
                if (audioCodec && isResultValid(audioCodec[1])) {
                    audioInfo = audio[1] + ' (' + audioTitle[1] + ') ' + audioCodec[1] + ' @ ' + audioBR[1];
                }
                else {
                    audioInfo = audio[1] + ' (' + audioTitle[1] + ') @ ' + audioBR[1];
                }
                res.audio.push(audioInfo);
            }
            else {
                if (audioCodec && isResultValid(audioCodec[1])) {
                    audioInfo = audio[1] + ' (' + audioTitle[1] + ') ' + audioCodec[1];
                }
                else {
                    audioInfo = audio[1] + ' (' + audioTitle[1] + ') ';
                }
                res.audio.push(audioInfo);
            }
        }
        else if (audioBR && isResultValid(audioBR[1])) {
            if (audioCodec && isResultValid(audioCodec[1])) {
                audioInfo = audio[1] + ' ' + audioCodec[1] + ' @ ' + audioBR[1];
            }
            else {
                audioInfo = audio[1] + ' @ ' + audioBR[1];
            }
            res.audio.push(audioInfo);
        }
        else if (audioCodec && isResultValid(audioCodec[1])) {
            audioInfo = audio[1] + ' ' + audioCodec[1];
            res.audio.push(audioInfo);
        }
        else {
            res.audio.push(audio[1]);
        }
        //added line
        //res.audio.push(audioInfo);
      }
     else {
         if (audioTitle && isResultValid(audioTitle[1])) {
            if (audioBR && isResultValid(audioBR[1])) {
                if (audioCodec && isResultValid(audioCodec[1])) {
                    audioInfo = '(' + audioTitle[1] + ') ' + audioCodec[1] + ' @ ' + audioBR[1];
                }
                else {
                    audioInfo = '(' + audioTitle[1] + ') @ ' + audioBR[1];
                }
                res.audio.push(audioInfo);
            }
            else if (audioCodec && isResultValid(audioCodec[1])) {
                    audioInfo = '(' + audioTitle[1] + ') ' + audioCodec[1];
                    res.audio.push(audioInfo);
                }
            else {
                 audioInfo = ' (' + audioTitle[1] + ') ';
                 res.audio.push(audioInfo);
            }
        }
        else if (audioCodec && isResultValid(audioCodec[1])) {
           if (audioBR && isResultValid(audioBR[1])) {
               audioInfo = audioCodec[1] + ' @ ' + audioBR[1];
           }
           else {
               audioInfo = audioCodec[1];
           }
           res.audio.push(audioInfo);
        }
        dataFound = false;
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
    /*var audio = /.*?(audio).*?:\s*(\w+)/gi.exec(line);

    if (audio && isResultValid(audio[2])) {
      res.audio.push(audio[2]);
      return;
    }
    */

    var text = /.*?(subtitle|text).*?:\s*(\w+)/gi.exec(line);

    if (text && isResultValid(text[2])) {
      res.text.push(text[2]);
      return;
    }
  });

  return res;
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function isResultValid(result) {
  if (result.trim().length === 0) {
    return false;
  }
  var invalidWords = ['untouched', 'none', 'no'];

  var regexp = new RegExp('(\\b' + invalidWords.join('\\b|\\b') + '\\b)', 'gi');

  return !regexp.test(result);
}

(function() {
  // Get all the toggletip buttons
  var toggletips = document.querySelectorAll('[data-toggletip-content]');

  // Iterate over them
  Array.prototype.forEach.call(toggletips, function (toggletip) {
    // Get the message from the data-content element
    var message = toggletip.getAttribute('data-toggletip-content');

    // Get the live region element
    var liveRegion = toggletip.nextElementSibling;

    // Toggle the message
    toggletip.addEventListener('click', function () {
        liveRegion.innerHTML = '';
        window.setTimeout(function() {
          liveRegion.innerHTML = '<span class="toggletip-bubble">'+ message +'</span>';
        }, 100);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (toggletip !== e.target) {
        liveRegion.innerHTML = '';
      }
    });

    // Remove toggletip on ESC
    toggletip.addEventListener('keydown', function (e) {
      if ((e.keyCode || e.which) === 27) {
      liveRegion.innerHTML = '';
      }
    });

    toggletip.addEventListener('mouseover', function (e) {
        liveRegion.innerHTML = '<span class="toggletip-bubble">'+ message +'</span>';


        window.setTimeout(function() {
            liveRegion.innerHTML = '';
        }, 7000);
    });
    // Remove on blur
    toggletip.addEventListener('blur', function (e) {
      liveRegion.innerHTML = '';
    });
  });
}());