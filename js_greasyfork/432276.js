    // ==UserScript==
    // @name         PTP Toggle Filelist
    // @version      0.2
    // @description  Toggle showing the filelist by default on PTP
    // @author       Chameleon
    // @include      http*://*passthepopcorn.me/torrents.php?*id=*
    // @grant        none
// @namespace https://greasyfork.org/users/778136
// @downloadURL https://update.greasyfork.org/scripts/432276/PTP%20Toggle%20Filelist.user.js
// @updateURL https://update.greasyfork.org/scripts/432276/PTP%20Toggle%20Filelist.meta.js
    // ==/UserScript==
     
    (function() {
      'use strict';
     
      document.addEventListener('keydown', function(e)
      {
        e = e || window.event;
        if(e.key=='f')
        {
          if(window.localStorage.showFileList=='false')
          {
            window.localStorage.showFileList='true';
            showFileList();
          }
          else
          {
            window.localStorage.showFileList='false';
            var s=document.getElementById('ignore_hide');
            s.parentNode.removeChild(s);
          }
        }
      });
     
      if(window.localStorage.showFileList=='false')
        return;
      else
      {
        showFileList();
      }
    })();
     
    function showFileList()
    {
      if(document.getElementById('ignore_hide'))
        return;
      var style=document.createElement('style');
      style.id='ignore_hide';
      style.innerHTML='div[id^="files_"] { display:initial !important; }';
      document.head.appendChild(style);
    }