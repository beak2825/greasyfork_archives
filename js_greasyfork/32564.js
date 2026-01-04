// ==UserScript==
// @name           Google Voice Favicon Purple Alerts
// @description    Alerts you to the number of unread items in Google Voice with a purple icon.
// @version        1.1.0
// @date           2017-09-12
// @author         Doc Jones
// @author         Peter Wooley
// @author         Ben999_
// @namespace      com.doktorjones.gvfa.purple
// @include        htt*://voice.google.*
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/32564/Google%20Voice%20Favicon%20Purple%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/32564/Google%20Voice%20Favicon%20Purple%20Alerts.meta.js
// ==/UserScript==

// Wait for the window to load to try and initialize
window.addEventListener('load', function() {
  instance = new GVoiceFaviconAlerts();
}, true);

function GVoiceFaviconAlerts() {
  var self = this;

  this.construct = function() {
    this.head = document.getElementsByTagName("head")[0];
    this.pixelMaps = {
      colors: {
        'stroke': '#cc0000',
        'text':   '#ffffff'
      }
    };

    this.timer = setInterval(this.poll, 500);
    this.poll();

    return true;
  };

  this.drawUnreadCount = function(unread) {
    if(!self.textedCanvas) {
      self.textedCanvas = [];
    }

    if(!self.textedCanvas[unread]) {
      //GM_log("unread: " + unread);
      var iconCanvas = self.getUnreadCanvas();
      var textedCanvas = document.createElement('canvas');
      textedCanvas.height = textedCanvas.width = iconCanvas.width;
      var ctx = textedCanvas.getContext('2d');
      ctx.drawImage(iconCanvas, 0, 0);

      if (unread.length > 4) unread = "1k+";

      var outlineWidth = 3;
      var posX = iconCanvas.width - outlineWidth;
      var posY = iconCanvas.height - outlineWidth;

      ctx.font = '14px sans-serif';
      ctx.fillStyle = self.pixelMaps.colors.text;
      ctx.strokeStyle = self.pixelMaps.colors.stroke;
      ctx.lineWidth = outlineWidth * 2; // stroke is centered on edge of text, so we need double to get outlineWidth px outside the text
      ctx.textAlign = 'right';
      ctx.strokeText(unread, posX, posY);
      ctx.fillText(unread, posX, posY);

      self.textedCanvas[unread] = textedCanvas;
    }

    return self.textedCanvas[unread];
  };

  this.getIcon = function() {
    return self.getUnreadCanvas().toDataURL('image/png');
  };

  this.getUnreadCanvas = function() {
    if(!self.unreadCanvas) {
      self.unreadCanvas = document.createElement('canvas');
      self.unreadCanvas.height = self.unreadCanvas.width = 32;

      var ctx = self.unreadCanvas.getContext('2d');

      var image = new Image();
      image.onload = function() {
        ctx.drawImage(image, 0, 0);
      };
      image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAt1BMVEUAAABmKt1j"+
      "H9tfJtxcGtxAAGBwI/JeH99lJdxbHcpRGr0UBDVrI+1nIOhjIdpmJ8xbJ8FHFZE+EHwAAGZ1Kfv///95KvtyJ/t7LPt0J/tt"+
      "IvtpH/t8L/tvJvtnHft6MPuAMPtfFfxiGvx2J/tyI/tbEfulUfr/7f7+5f25Z/uOOvn/9v720v29b/uFNPv83v3pvv3vwfzb"+
      "q/zbm/zVl/xXEvzEcvupXfttH/tkG/ubQ/mSPPmNOvnBCCLrAAAAFHRSTlMA397e3gj34N7Nw3bu69jPxKicBcMVkZYAAAEp"+
      "SURBVDjLvdLpUoMwFIZhFFtb6y5JmhNIWFqodHHfvf/r8uQMRLbpP33/fg/DYQbvXxpdHjTyfX8y8anjkxGBi10ch8aEc4pj"+
      "gU1KyacEYtzDMBNCLHgbCOGACZitHAT4uDGSwHc0CAwekBF407LeEYgKmBALHizYpBD1Ac54/a0F94kC0QNz6gv3O60VQFTt"+
      "HRAXbJ18aIVC0N4FHN+RaF0L2h2gRMGeU9qtwL0LeMlYnqp3BYgiQSBqAPy6VxR4ZbBZbT/LxS/gdRme8aShYLbE7h3AxZa5"+
      "ltAD+HFit6rBCx7SBgGl84oslRUEglYAJn9cWwAAiz6QEpROk2WiBoG0gSubNsD40HVUhT+tA/x05g3lwPnN8EZJya+8ffHx"+
      "tbe3s5n3p/0AR0g6TMSSjdIAAAAASUVORK5CYII=";
    }

    return self.unreadCanvas;
  };

  this.getUnreadCountMessages = function() {
    matches = self.getSearchTextMessages().match(/\d+/g); //parse numerics
    //console.log(matches + ' unread messages found');
    return matches ? matches[0] : false;
  };

  this.getUnreadCountCalls = function() {
    matches = self.getSearchTextCalls().match(/\d+/g); //parse numerics
    //console.log(matches + ' unread calls found');
    return matches ? matches[0] : false;
  };

  this.getUnreadCountVoicemail = function() {
    matches = self.getSearchTextVoicemail().match(/\d+/g); //parse numerics
    //console.log(matches + ' unread voicemails found');
    return matches ? matches[0] : false;
  };

  this.getUnreadCountArchived = function() {
    matches = self.getSearchTextArchived().match(/\d+/g); //parse numerics
    //console.log(matches + ' unread archived items found');
    return matches ? matches[0] : false;
  };

  this.getUnreadCountIcon = function() {
    var unreadMessages = self.getUnreadCountMessages();
    var unreadCalls = self.getUnreadCountCalls();
    var unreadVoicemail = self.getUnreadCountVoicemail();
    var unreadArchived = self.getUnreadCountArchived();
    var totalUnread = 0;

    if (unreadMessages) {
      totalUnread += parseInt(unreadMessages);
    }
    if (unreadCalls) {
      totalUnread += parseInt(unreadCalls);
    }
    if (unreadVoicemail) {
      totalUnread += parseInt(unreadVoicemail);
    }
    if (unreadArchived) {
      totalUnread += parseInt(unreadArchived);
    }
    // 7/6/17 recent update seems to show twice as many unread in no particular order
    totalUnread = totalUnread / 2;
    if ((totalUnread < 1) && (totalUnread > 0)) {
      totalUnread = 1;
    }
    totalUnread = Math.round(totalUnread);
    //console.log(totalUnread + ' unread items detected');
    return self.drawUnreadCount(totalUnread.toString()).toDataURL('image/png');
  };

  this.getSearchTextMessages = function() {
    var text = "";
    // messages = element 0
    if (document.getElementsByClassName('md-caption HMBDBe-ho7Xm-NnAfwf')[0]) {
      text = top.document.getElementsByClassName('md-caption HMBDBe-ho7Xm-NnAfwf')[0].textContent;
    }
    return text;
  };

  this.getSearchTextCalls = function() {
    var text = "";
    // calls = element 1
    if (document.getElementsByClassName('md-caption HMBDBe-ho7Xm-NnAfwf')[1]) {
      text = top.document.getElementsByClassName('md-caption HMBDBe-ho7Xm-NnAfwf')[1].textContent;
    }
    return text;
  };

  this.getSearchTextVoicemail = function() {
    var text = "";
    // voicemail = element 2
    if (document.getElementsByClassName('md-caption HMBDBe-ho7Xm-NnAfwf')[2]) {
      text = top.document.getElementsByClassName('md-caption HMBDBe-ho7Xm-NnAfwf')[2].textContent;
    }
    return text;
  };

  this.getSearchTextArchived = function() {
    var text = "";
    // archived = element 3
    if (document.getElementsByClassName('md-caption HMBDBe-ho7Xm-NnAfwf')[3]) {
      text = top.document.getElementsByClassName('md-caption HMBDBe-ho7Xm-NnAfwf')[3].textContent;
    }
    return text;
  };

  this.poll = function() {
    if (self.getUnreadCountMessages() || self.getUnreadCountCalls() || self.getUnreadCountVoicemail() || self.getUnreadCountArchived()) {
      self.setIcon(self.getUnreadCountIcon());
    } else {
      self.setIcon(self.getIcon());
    }
  };

  this.setIcon = function(icon) {
    var links = self.head.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++)
    if (links[i].type == "image/x-icon" &&
    (links[i].rel.toLowerCase() == "shortcut icon" || links[i].rel.toLowerCase() == "icon") &&
    links[i].href != icon)
    self.head.removeChild(links[i]);
    else if(links[i].href == icon)
    return;

    var newIcon = document.createElement("link");
    newIcon.type = "image/x-icon";
    newIcon.rel = "shortcut icon";
    newIcon.href = icon;
    self.head.appendChild(newIcon);

    setTimeout(function() {
      var shim = document.createElement('iframe');
      shim.width = shim.height = 0;
      document.body.appendChild(shim);
      shim.src = "icon";
      document.body.removeChild(shim);
    }, 999);

  };

  this.toString = function() { return '[object GVoiceFaviconAlerts]'; };

  return this.construct();
}