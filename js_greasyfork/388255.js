// ==UserScript==
// @name         Local SoundCloud Downloader
// @namespace    gjwse90gj98we
// @version      1.4
// @description  Download songs from SoundCloud
// @author       https://greasyfork.org/en/users/323851-gjwse90gj98we
// @icon         https://a-v2.sndcdn.com/assets/images/sc-icons/ios.png
// @include      /^https:\/\/soundcloud\.com/.*$/
// @require      https://unpkg.com/file-saver@2.0.2/src/FileSaver.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388255/Local%20SoundCloud%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/388255/Local%20SoundCloud%20Downloader.meta.js
// ==/UserScript==

(function() {
  "use strict";

  var head = document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  var css = '.sc-button-directdl{text-indent:19px}.sc-button-directdl::before{background-size:16px 16px;background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+UmVjdGFuZ2xlIDMxPC90aXRsZT48cGF0aCBkPSJNMyAxMXYyaDEwdi0ySDN6bTAtN2gxMGwtNSA2LTUtNnptMy0ydjJoNFYySDZ6IiBmaWxsPSIjMjIyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=);content:"";display:block;position:absolute;background-repeat:no-repeat;background-position:center center;width:20px;height:20px;top:0;bottom:0;margin:auto 0;left:4px}';
  style.setAttribute('type', 'text/css');
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);

  var currentdate = new Date();
  currentdate.setDate(currentdate.getDate());

  var deadline = new Date( localStorage.getItem( 'id_timestamp' ) );
  
  if (localStorage.getItem("client_id") === null || currentdate >= deadline) {
  fetch('https://raw.githubusercontent.com/ytdl-org/youtube-dl/master/youtube_dl/extractor/soundcloud.py')
    .then(resp => {
      return resp.text();
    })
    .then(data => {
      var reg = /_CLIENT_ID = '([^']+)'/g
      var match = reg.exec(data);
      localStorage.setItem("client_id", match[1]);  
    
  var newdate = new Date();
  newdate.setDate(newdate.getDate() + 3);
    
    localStorage.setItem( 'id_timestamp', newdate );
    
    
     });
  }

  var sc_client_id = localStorage.getItem("client_id");
  
  if (sc_client_id) {
    String.prototype.mapReplace = function(map) {
      var regex = [];
      for (var key in map)
        regex.push(key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
      return this.replace(new RegExp(regex.join("|"), "g"), function(word) {
        return map[word];
      });
    };
  
    var last_sound_title = "1";
  
    setInterval(function() {
      
      var sound_title = document
        .getElementsByClassName("soundTitle__title")[0]
        .children[0].innerText.mapReplace({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          "/": "&#x2F;",
          "`": "&#x60;",
          "=": "&#x3D;",
          '"': "&quot;"
        });

      if (last_sound_title !== sound_title) {
        last_sound_title = sound_title;
        var button_list = document.getElementsByClassName("sc-button-group sc-button-group-medium")[0];
          
               fetch('https://api.soundcloud.com/resolve.json?client_id=' + sc_client_id + '&url=' + location.href)
          .then(i => {
            return i.json();
          })
          .then(data => {
            if (data.hasOwnProperty("stream_url")) {
              fetch(data.stream_url + '?client_id=' + sc_client_id).then(
                audio => {
                  function dlFile() {
                    saveAs(audio.url, data.title + '.mp3');
                  }
 
                  var directdl = '<button type="button" class="sc-button-directdl sc-button sc-button-medium sc-button-responsive" tabindex="0" aria-haspopup="true" role="button" title="Direct download" aria-label="Direct download">Direct download</button>';
                  var directlink = '<a href="' + audio.url + '" target="_blank" title="Direct link" class="soundActions__purchaseLink sc-truncate sc-buylink sc-buylink-responsive sc-buylink-medium sc-buylink-default" style="margin-left:10px">Direct link</a>'

                  button_list.insertAdjacentHTML('beforeend', directdl);
                  button_list.insertAdjacentHTML('beforeend', directlink);

                  document.getElementsByClassName("sc-button-directdl")[0].addEventListener ("click", dlFile, false);
                }
              );
            }
          });

      }
	
      if (document.getElementsByClassName("sound streamContext playing")[0] && !document.getElementsByClassName("sound streamContext playing")[0].querySelector(".sc-button-directdl")) {
        var stuff = document.getElementsByClassName("sound streamContext playing")[0];
		var linksr = stuff.querySelector(".soundTitle__title.sc-link-dark").href;
        console.log(linksr);
        var button_list = stuff.querySelector(".sc-button-group.sc-button-group-small");
          
               fetch('https://api.soundcloud.com/resolve.json?client_id=' + sc_client_id + '&url=' + linksr)
          .then(i => {
            return i.json();
          })
          .then(data => {
            if (data.hasOwnProperty("stream_url")) {
              fetch(data.stream_url + '?client_id=' + sc_client_id).then(
                audio => {
                  function dlFile() {
                    saveAs(audio.url, data.title + '.mp3');
                  }
 
                  var directdl = '<button type="button" class="sc-button-directdl sc-button sc-button-small sc-button-responsive" tabindex="0" aria-haspopup="true" role="button" title="Direct download" aria-label="Direct download">Direct download</button>';
                  var directlink = '<a href="' + audio.url + '" target="_blank" title="Direct link" class="soundActions__purchaseLink sc-truncate sc-buylink sc-buylink-responsive sc-buylink-small sc-buylink-default" style="margin-left:10px">Direct link</a>'

                  button_list.insertAdjacentHTML('beforeend', directdl);
                  button_list.insertAdjacentHTML('beforeend', directlink);

                  var divs = document.getElementsByClassName("sc-button-directdl");
                  var lastChild = divs[divs.length - 1];
                  
                  lastChild.addEventListener ("click", dlFile, false);
                }
              );
            }
          });

      } 
    }, 3 * 1000);
  }
})();