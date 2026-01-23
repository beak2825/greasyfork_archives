// ==UserScript==
// @name         arte stream and download
// @namespace    http://tampermonkey.net/
// @version      4.0.1
// @description  get arte stream url with just one click (or none at all) or download seperate audio/video mp4
// @author       mihau
// @match        https://www.arte.tv/*/videos*
// @match        https://www.arte.tv/*/live*
// @license MIT
// @supportURL   https://greasyfork.org/en/scripts/533451-arte-stream-and-download
// @downloadURL https://update.greasyfork.org/scripts/533451/arte%20stream%20and%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/533451/arte%20stream%20and%20download.meta.js
// ==/UserScript==

// if you want to get the url in the very moment the page loads, you may change this from 0 to 1:
var loadonload = 0;
// if you do not need SD video download links, change this from 0 to 1: 
var nosd = 0;
// best not edit below this line...

// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitforit(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    var observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });
    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

waitforit('video').then((elm) => {
  
  function main() {
    
      filmtitle = title + subtitle;
      filmtitleraw = filmtitle;
      filmtitle = filmtitle.replace(/ /g, "_").replace(/[^a-z0-9 \.,_-]/gim, "").replace("_-_", "-");

      if (($qa('[data-testid="AUSSCHNITT"]')[0]) || ($qa('[data-testid="EXTRAIT"]')[0])) {
        trailer = " TRAILER";
        var desc = '[data-testid="pc_desc-Heading"]';
        var warn = $qa(desc)[0].innerText;
        var nraw = '<span style="color: red">' + trailer.replace(" ", "") + ':</span>';
        $qa(desc)[0].innerHTML = nraw + warn;
        document.title = trailer + ": " + filmtitleraw;
      }

      if (loadonload != 0) {
        if ((filmid != null) && (filmid != "null") && (filmid != "") && (filmid != "undefined") && (filmid != undefined) && (!(isNaN(filmid)))) {
          streamurl();
        }
      }

      streambutton();
      downloadbutton();
      $("streamurl").onclick = function() { streamurl(); };
    
      getM3U(url, function(err, data) {
                if (err != null) {
                  console.error(err);
                } else {

                  var mp4avail = 1,
                    fhdavail = 0,
                    videosarr = [],
                    audiosarr = [],
                    subtisarr = [],
                    videosarrng = [],
                    vid = 0,
                    aud = 0,
                    sub = 0,
                    vidng = 0,
                    bp = "&#x95; ",
                    result, videolinks, audiolinks, subtilinks,
                    vregex = new RegExp(".*_v", "gi"),
                    videoformats = /-([A-Z])_v/,
                    uregex = /URI=(["'])(.*?)\1/,
                    nregex = /NAME=(["'])(.*?)\1/;

                  var lines = data.split(/[\r\n]/);

                  for (var i in lines) {

                    var line = lines[i];

                    if (!(/iframe/.test(line))) {

                      if (!(/h265/.test(line))) {

                        if (videoformats.test(line)) {

                          if (/aka_me_session/.test(line)) {
                            mp4avail = 0;
                          }
                          if (/v1080/.test(line)) {
                            fhdavail = 1;
                          }

                          videosarr[vid] = line;
                          vid++;

                        }

                        if (/TYPE=AUDIO/.test(line)) {

                          var audiofile = line.match(uregex)[2];
                          var audiolabel = line.match(nregex)[2];

                          audiosarr[aud] = audiolabel + "#" + audiofile;
                          aud++;

                        }

                        if (/TYPE=SUBTITLES/.test(line)) {

                          var subfile = line.match(uregex)[2];
                          var sublabel = line.match(nregex)[2];

                          subtisarr[sub] = sublabel + "#" + subfile.replace("m3u8", "vtt");
                          sub++;

                        }

                      } else {
                        videosarrng[vidng] = line;
                        vidng++;
                      }

                    }

                  }

                  videosarr = videosarr.sort();
                  if (fhdavail == 1) {
                    videosarr.push(videosarr.shift());
                  }

                  if (nosd == 1) {
                    videosarr = videosarr.splice(-2);
                  }
                  videosarr = videosarr.reverse();

                  audiosarr = audiosarr.sort();
                  subtisarr = subtisarr.sort();

                  for (i = 0, l = subtisarr.length; i < l; ++i) {

                    var subcom = subtisarr[i].split("#");
                    subtilinks += '<option value="' + subcom[1] + '">' + subcom[0].replace("automatische", "erforderliche").replace("Für", "für").replace(" Untertitel", "").replace("forcé", "obligatoire") + '</option>';

                  }

                  for (i = 0, l = audiosarr.length; i < l; ++i) {

                    var audcom = audiosarr[i].split("#");
                    audiolinks += '<option value="' + audcom[1] + '">' + audcom[0].replace(" (Original)", "").replace(" (VO)", "") + '</option>';

                  }

                  for (i = 0, l = videosarr.length; i < l; ++i) {

                    videolinks += '<option value="' + videosarr[i] + '">' + videosarr[i].replace(".m3u8", "").replace(vregex, "") + 'p</option>';

                  }

                  if (videosarrng.length > 0) {

                    videosarrng = videosarrng.sort();
                    videolinks += '<option value="">' + bp + loc_video + ' (h265 hevc/mp4)</option>';

                    for (i = 0, l = videosarrng.length; i < l; ++i) {

                      videolinks += '<option value="' + videosarrng[i] + '">' + videosarrng[i].replace(".m3u8", "").replace("_h265", "").replace(vregex, "") + 'p</option>';

                    }

                  }

                  if (mp4avail == 1) {
                    var empty = '<option value=""></option>';
                    result = '<form name="jump" action=""><select id="dlmenu" style="background-color:black;color:white; width: 40px" class="' + spanclass + '" name="dlmenu" onchange="opennewtab()">';
                    result += '<option value="" selected="selected">&#x1f847; ' + loc_dl + trailer + '</option>'; // 🡇
                    result += empty;
                    result += '<option value="">' + bp + loc_video + ' (h264 avc/mp4)</option>';
                    result += videolinks;
                    result += empty;
                    result += '<option value="">' + bp + loc_audio + ' (aac/mp4)</option>';
                    result += audiolinks;
                    if (subtisarr.length > 0) {
                      result += '<option value=""></option>';
                      result += '<option value="">' + bp + loc_subs + ' (vtt/txt)</option>';
                      result += subtilinks;
                    }
                    if ((kind == "concert") && (chapters != "none")) {
                      result += empty;
                      result += '<option value="">' + bp + loc_set + ' (txt)</option>';
                      result += '<option value="cue">' + loc_cue + '</option>';
                      result += '<option value="txt">' + loc_txt + '</option>';
                    }
                    result += empty;
                    result += '<option value="">' + bp + loc_arc + ' (txt)</option>';
                    result += '<option value="arc">' + loc_save + ' </option>';
                    result += '</select></form>';
                    result = result.replaceAll(".m3u8", ".mp4").replaceAll("undefined", "");

                    var script = document.createElement("script");
                    script.innerHTML = `
                            function opennewtab() {
                              var optionvalue = document.jump.dlmenu.options[document.jump.dlmenu.selectedIndex].value;
                              if (optionvalue == "arc") {
                                    var hiddenElement = document.createElement('a');
                                    hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(window.content);
                                    hiddenElement.download = "arte_" + window.filmtitle + ".txt";
                                    hiddenElement.click();
                               } else if ((optionvalue == "cue") || (optionvalue == "txt")) {
                                  var hiddenElement = document.createElement('a');
                                  var format;
                                    if (optionvalue == "cue") { format = encodeURIComponent(window.cue) }
                                    else { format = encodeURIComponent(window.txt) }
                                    hiddenElement.href = 'data:attachment/text,' + format;
                                    hiddenElement.download = window.cuefilename + '.' + optionvalue;
                                    hiddenElement.click();
                                } else if ((document.jump.dlmenu.selectedIndex > 0) && (optionvalue != "") && (optionvalue != "#")) {
                                    window.open(optionvalue, "artedltab");
                                }
                            }
                       `;
                    document.body.appendChild(script);

                   $("arteuserjsdlinner").innerHTML = result;

                   if ((kind == "concert") && (chapters != "none")) { setlist(filmtitle,filmtitleraw,chapters); }
                   archive();

                  } else {
                     $("arteuserjsdlinner").innerHTML = loc_nodl;
                  }

                }

              });
    
  }
  
  function onpage() {
    if ((self.__next_f) && (self.__next_f.length > 0)) {
      for (var i = 0, l = self.__next_f.length; i < l; ++i) {
        var it = self.__next_f[i].toString();
        if (kind == "concert") {
          if (/startOffset/.test(it)) {
            cuescriptid = i;
            chapterformat = "offset";
          }
          if (/chapterId/.test(it)) {
            cuescriptid = i;
            chapterformat = "chapter";
          }
        }
        if (/m3u8/.test(it)) {
          if (/artelive/.test(it)) {
            liveid = i;
            mode = "live";
            parsescripts(i);
          } else if (/Generate/.test(it)) {
            archid = i;
            mode = "archive";
            var thestring = self.__next_f[archid].toString().slice(22, -1).slice(0, -1);
            if (/Generate\//.test(thestring)) {
              var schemaObj = JSON.parse(thestring);
              filmid = "notnull";
              url = schemaObj.apiPlayerConfig.attributes.streams[0].url; // !!!
              title = schemaObj.apiPlayerConfig.attributes.metadata.title;
              if (schemaObj.apiPlayerConfig.attributes.metadata.subtitle != null) {
                subtitle = " - " + schemaObj.apiPlayerConfig.attributes.metadata.subtitle;
              }
              begin = schemaObj.apiPlayerConfig.attributes.rights.begin;
              end = schemaObj.apiPlayerConfig.attributes.rights.end;
              if (schemaObj.apiPlayerConfig.attributes.chapters) {
                chapters = schemaObj.apiPlayerConfig.attributes.chapters;
              }
            } else {
              parsescripts(i);
            }
          }
        }
      }
    } else {
      for (var i = 0, l = $tn("script").length; i < l; ++i) {
        if ($tn("script")[i].innerText.indexOf("Generate/") != -1) {
          jsoncontainer = i;
          break;
        } else if ($tn("script")[i].innerText.indexOf("artelive") != -1) {
          jsoncontainer = i;
          mode = "live"
          break;
        }
      }
      nix = $tn("script")[jsoncontainer].innerText;
      parsescripts(-1);
    }
  }
  
  function parsescripts(nextfid) {
    if (nextfid != -1) {
      nix = self.__next_f[nextfid].toString();
    }
    if (mode == "live") {
      var mynewregex = new RegExp("m3u8.*", "gi");
      url = nix.match("https://artesimulcast\.akamaized\.net.*m3u8")[0];
      url = url.replace(mynewregex, "m3u8")
      if (lang == "de") {
        url = url.replace("artelive_fr", "artelive_de");
      } else {
        url = url.replace("artelive_de", "artelive_fr");
      }
    } else {
      var myregex = /Generate\/.*?\/\//;
      var match = nix.match(myregex);
      var mynewregex = new RegExp("\/.*", "gi")
      filmid = match[0].replace("Generate/", "").replace(mynewregex, "");
      url = "https://manifest-arte.akamaized.net/api/manifest/v1/Generate/" + filmid + "/" + lang + "/XQ+KS+CHEV1/" + id + ".m3u8"; // hardcoded, but doesnt change
    }
    return url;
  }
  
  function live() {
    
      if (lang == "de") {
        livelabel = "Live ";
      } else {
         livelabel = "live ";
      }
     streambutton();
     $("streamurl").onclick = function() { streamurl(); };
  }
  
  function streambutton() {
      var topelementstream = document.createElement("a");
      topelementstream.setAttribute('id', 'arteuserjsstream');
      topelementstream.setAttribute('class', aclass);
      var innerelementstream = document.createElement("span");
      innerelementstream.setAttribute('id', 'streamurl');
      innerelementstream.setAttribute('class', spanclass);
      innerelementstream.setAttribute('style', 'color: #FA481C');
      innerelementstream.innerText = livelabel + loc_stream;
      topelementstream.appendChild(innerelementstream);
      if (!($("arteuserjsstream"))) {
          $cn('ds-1rois2h')[0].insertBefore(topelementstream, null);
      }
  }
  
  function downloadbutton() {
      var topelementdl = document.createElement("a");
      topelementdl.setAttribute('id', 'arteuserjsdl');
      topelementdl.setAttribute('class', aclass);
      var innerelementdl = document.createElement("span");
      innerelementdl.setAttribute('id', 'arteuserjsdlinner');
      innerelementdl.setAttribute('class', 'ds-11ckmbs');
      innerelementdl.innerText = "";
      topelementdl.appendChild(innerelementdl);
      if (mode != "live") {
        if (!($("topelementdl"))) {
            $cn('ds-1rois2h')[0].insertBefore(topelementdl, null);
        }
      }
  }

  function setlist(filmtitle,filmtitleraw,chapters) {
      cue = "REM adjust the fields below to your liking, especially the filename (FILE ...) line\n\n",
      txt = "",
      cuefilename = "",
      cuescript = "",
      schemaObj = "",
      artistcreds = [],
      chapterformat = "chapter"; // hardcoded for now :-/
    if (chapterformat == "chapter") {
      artistcreds[0] = title;
      artistcreds[1] = subtitle.replace(" - ", "");
    } else {
      cuescript = self.__next_f[cuescriptid].toString().slice(2);
      schemaObj = JSON.parse(cuescript);
      if (/ - /.test(schemaObj.name)) {
        artistcreds = schemaObj.name.split(" - ");
      } else {
        artistcreds[0] = schemaObj.name;
        artistcreds[1] = schemaObj.name;
      }
    }
    cuefilename = artistcreds[0] + "-" + artistcreds[1];
    cuefilename = cuefilename.replace(/[^a-z0-9-.]/gi, '_').toLowerCase();
    cue += 'PERFORMER "' + artistcreds[0] + '"' + "\n";
    cue += 'TITLE "' + artistcreds[1] + '"' + "\n";
    cue += 'FILE "' + cuefilename + '.m4a" M4A' + "\n\n  TRACK 01 AUDIO\n";
    var cueperf = '    PERFORMER "' + artistcreds[0] + '"' + "\n";
    cue += cueperf;
    cue += '    TITLE "Intro/Prologue"' + "\n";
    cue += "    INDEX 01 00:00:00\n";
    txt += "00:00 Intro/Prologue\n";
    var setlistlength = 0;
    if (chapterformat == "chapter") {
      setlistlength = chapters.elements.length;
    } else {
      setlistlength = schemaObj.hasPart.length;
    }
    for (var j = 0, k = setlistlength; j < k; ++j) {
      var songtitle = "";
      var timestamp = "";
      if (chapterformat == "chapter") {
        songtitle = chapters.elements[j].title;
        timestamp = chapters.elements[j].startTime;
      } else {
        songtitle = schemaObj.hasPart[j].name;
        timestamp = schemaObj.hasPart[j].startOffset;
      }
      var padm = "";
      if (timestamp < 600) {
        padm = "0";
      }
      var cuetrackid = j + 2;
      var ctidpad = "";
      if (cuetrackid < 10) {
        ctidpad = "0";
      }
      cue += "\n  TRACK " + ctidpad + cuetrackid + " AUDIO \n";
      cue += cueperf;
      cue += "    TITLE " + '"' + songtitle + '"';
      cue += "\n    INDEX 01 " + padm + fmtMSS(timestamp) + ":00\n";
      txt += padm + fmtMSS(timestamp) + " " + songtitle + "\n";
    }
    cue += "\n";
    window.cue = cue;
    window.txt = txt;
    window.cuefilename = cuefilename;
  }

  function archive() {
    
    var datestring = "",
       datedisplay = "";
    if ((begin == "") || (begin == undefined)) {
      
      var dat, monthnum;
      
      if (document.querySelectorAll('[data-testid="tlt-closeable-cnt"]')[1]) {
        datestring = document.querySelectorAll('[data-testid="tlt-closeable-cnt"]')[1].innerText;
        if (lang == "de") {
          dat = datestring.match(/Verfügbar bis zum (.*) um (.*)/)[1].replaceAll(".", "");
        } else if (lang == "fr") {
          dat = datestring.match(/Disponible jusqu\'au (.*) à (.*)/)[1].replaceAll(".", "");
        } else {
          dat = datestring.match(/Available until (.*)/)[1].replaceAll(".", "");
        }
        dat = dat.split(" ");
        monthnum = monthNameToNum(dat[1]);
      } else if (document.querySelectorAll('p.ds-6406tu')[1]) {
        datestring = document.querySelectorAll('p.ds-6406tu')[1].innerText;
        if (lang == "de") {
          dat = datestring.match(/Verfügbar bis zum (.*)/)[1];
        } else if (lang == "fr") {
          dat = datestring.match(/Disponible jusqu\'au (.*)/)[1];
        } else {
          dat = datestring.match(/Available until (.*)/)[1];
        }
        dat = dat.split("/");
        monthnum = dat[1];
      }
      var mpad = "",
        dpad = "";
      if ((monthnum < 10) && (monthnum.indexOf("0") == -1)) {
        mpad = "0";
      }
      if ((dat[0] < 10) && (dat[0].indexOf("0") == -1)) {
        dpad = "0";
      }
      datedisplay = new Date().toISOString().split('T')[0] + " - \n" + dat[2] + "-" + mpad + monthnum + "-" + dpad + dat[0];
    } else {
      datedisplay = begin.split('T')[0] + " - \n" + end.split('T')[0];
    }
    var content = filmtitleraw;
    var imgs, i, mlnk;
    mlnk = "";
    imgs = document.getElementById("dlmenu").getElementsByTagName("option").length;
    for (i = 0, l = imgs; i < l; ++i) {
      var img = document.getElementById("dlmenu").getElementsByTagName("option")[i];
      if ((img.value != undefined) && (img.value != "") && (img.value != "arc") && (img.value != "txt") && (img.value != "cue")) {
        mlnk += '"' + img.value + "#" + img.innerText + '"' + "\n";
      }
    }
    content += "\n\n" + datedisplay + "\n\n" + url + "\n\n" + mlnk + "\n";
    if (window.cue) {
      content += "\n" + window.cue + "\n";
    }
    window.content = content;
    window.filmtitle = filmtitle;
  }

  function streamurl() {
    var test;
    if (mode == "live") {
      test = prompt(livelabel + loc_stream, url);
    } else {
      test = prompt(loc_stream + " (click 'OK' for ffmpeg command)", url);
      if (test !== null) {
        prompt("ffmpeg command ('OK' for ffmpeg AUDIO-ONLY command)", 'ffmpeg -referer "' + location.href + '" -user_agent "' + window.navigator.userAgent + '" -i "' + url + '" -c copy -bsf:a aac_adtstoasc "' + filmtitle + '.mp4"');
        if (test !== null) {
          prompt("ffmpeg AUDIO-ONLY command ('OK' for yt-dlp command)", 'ffmpeg -referer "' + location.href + '" -user_agent "' + window.navigator.userAgent + '" -i "' + url + '" -vn -c:a copy "' + filmtitle + '-audio.m4a"');
          if (test !== null) {
            prompt("yt-dlp command", "yt-dlp '" + url + "'");
          }
        }
      }
    }
  }
  // (more) external functions
  function fmtMSS(s) { // https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
  }
  function monthNameToNum(monthname) { // https://gist.github.com/richard512/2c8e6ad2469033e006f1?permalink_comment_id=2803698#gistcomment-2803698
    var months = ['January', 'February', 'Mach', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (lang == "de") {
      months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    }
    if (lang == "fr") {
      months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    }
    var month = months.indexOf(monthname);
    return month != -1 ? month + 1 : undefined;
  }

    // ...
    var $   = function(_) {return document.getElementById(_);};
    var $cn = function(_) {return document.getElementsByClassName(_);};
    var $qa = function(_) {return document.querySelectorAll(_);};
    var $tn = function(_) {return document.getElementsByTagName(_);};

    var xhr = new XMLHttpRequest(),
    pathpart = window.location.pathname.split("/"),
    lang = pathpart[1],
    id = pathpart[3],
    api = "https://api.arte.tv/api/player/v2/config/",
    download_url = api + lang + "/" + id,
    aclass = "ds-1vjaud3",
    spanclass = "ds-1fjfvx",
    filmid = "",
    cuescriptid = 0,
    liveid = "",
    mode = "",
    kind = "",
    livelabel = "",
    chapterformat = "",
    trailer = "",
    title = "",
    subtitle = "",
    begin = "",
    end = "",
    chapters = "",
    url = "",
    filmtitleraw = "",
    filmtitle = "",
    loc_stream = "stream url",
    loc_video = "video",
    loc_audio = "audio",
    loc_subs = "subtitles",
    loc_set = "setlist",
    loc_cue = ".cue file",
    loc_txt = "plain text",
    loc_dl = "download",
    loc_nodl = "(download unvailable)",
    loc_arc = "archive",
    loc_save = "save all links";
  if (/ARTE Concert/.test(document.title)) {
    kind = "concert";
  }
  if (/\/live/.test(location.pathname)) {
    onpage();
  }
  if (lang == "fr") {
    loc_subs = "sous-titres";
    loc_dl = "téléchargement";
    loc_nodl = "(téléchargement indisponible)";
    loc_save = "enregistrer tous les liens";
  } 
  if (lang == "de") {
    loc_stream = "Stream URL";
    loc_video = "Video";
    loc_audio = "Audio";
    loc_subs = "Untertitel";
    loc_set = "Setliste";
    loc_cue = ".cue-Datei";
    loc_txt = "Textdatei";
    loc_dl = "Download";
    loc_nodl = "(Download nicht verfügbar)";
    loc_arc = "Archiv";
    loc_save = "Alle Links speichern";
  }

  var getJSON = function(url, callback) {
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  };

  var getM3U = function(url, callback) {
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  };

  getJSON(download_url, function(err, data) {
    if (err != null) {
      console.error(err);
      // call dirty regex functions?
    } else {
      url = data.data.attributes.streams[0].url;
      title = data.data.attributes.metadata.title;
      begin = data.data.attributes.rights.begin;
      end = data.data.attributes.rights.end;
      if (data.data.attributes.metadata.subtitle != null) {
        subtitle = " - " + data.data.attributes.metadata.subtitle;
      }
      if (data.data.attributes.chapters) {
        chapters = data.data.attributes.chapters;
        chapterformat = "chapters";
      } else {
        chapters = "none";
      }
    }

  });
  
  setTimeout(
    function () {
      if (url == "") {
        onpage();
      } else {
        main(url);
      }
    },
  
  2500);
 
});