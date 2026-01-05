// ==UserScript==
// @name           Google Voice Favicon Alerts
// @description    Alerts you to the number of unread items in Google Voice.
// @version        1.0.14
// @author         Peter Wooley, Ben999_
// @namespace      http://peterwooley.com
// @match          *://voice.google.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/26872/Google%20Voice%20Favicon%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/26872/Google%20Voice%20Favicon%20Alerts.meta.js
// ==/UserScript==

// Wait for the window to load to try and initialize
window.addEventListener('load', function() {
			window.instance = new GVoiceFaviconAlerts;
}, true);
	
function GVoiceFaviconAlerts() {
	var self = this;
	
	this.construct = function() {
		this.head = document.getElementsByTagName("head")[0];
		this.pixelMaps = {
			icons: {
				'unread':
                    [["rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,255,0,0.00392)","rgba(63,191,63,0.01569)","rgba(0,127,127,0.00784)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(63,127,63,0.01569)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)"],["rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,127,127,0.00784)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(54,163,91,0.05490)","rgba(57,197,92,0.08627)","rgba(0,127,0,0.00784)","rgba(0,0,0,0.00000)","rgba(0,255,0,0.00392)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)"],["rgba(127,127,127,0.00784)","rgba(0,0,0,0.00000)","rgba(51,170,85,0.11765)","rgba(56,185,91,0.61961)","rgba(53,164,79,0.18824)","rgba(0,0,0,0.00000)","rgba(36,145,72,0.02745)","rgba(0,0,0,0.00000)","rgba(52,167,82,0.67059)","rgba(55,179,88,0.95294)","rgba(52,170,84,0.81961)","rgba(52,171,83,0.38431)","rgba(0,0,0,0.00000)","rgba(0,255,0,0.00392)","rgba(0,0,0,0.00392)","rgba(0,0,0,0.00000)"],["rgba(85,170,85,0.01176)","rgba(255,255,255,0.00392)","rgba(52,167,83,0.72941)","rgba(59,190,94,1.00000)","rgba(54,172,86,0.92549)","rgba(48,163,81,0.20784)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(53,170,85,0.76078)","rgba(58,181,90,1.00000)","rgba(53,171,85,1.00000)","rgba(57,184,91,1.00000)","rgba(51,167,82,0.60392)","rgba(85,170,85,0.01176)","rgba(0,255,127,0.00784)","rgba(0,0,0,0.00000)"],["rgba(0,0,0,0.00000)","rgba(34,144,59,0.11765)","rgba(51,168,82,0.98039)","rgba(52,168,83,0.98431)","rgba(53,172,85,1.00000)","rgba(54,173,85,0.92549)","rgba(51,165,85,0.21176)","rgba(0,0,0,0.00000)","rgba(34,142,66,0.74902)","rgba(42,158,75,0.99608)","rgba(52,167,82,0.98039)","rgba(52,168,82,0.97647)","rgba(57,184,91,1.00000)","rgba(51,166,83,0.37255)","rgba(0,0,0,0.00000)","rgba(63,191,63,0.01569)"],["rgba(0,0,0,0.00000)","rgba(20,121,52,0.24706)","rgba(32,144,65,0.98824)","rgba(52,168,83,0.99216)","rgba(52,167,82,0.97647)","rgba(59,190,93,1.00000)","rgba(50,167,81,0.53725)","rgba(0,0,0,0.00000)","rgba(22,126,54,0.75294)","rgba(22,131,56,0.98824)","rgba(31,139,63,0.97647)","rgba(52,167,82,0.98039)","rgba(54,174,86,0.98039)","rgba(52,167,82,0.83529)","rgba(42,212,85,0.02353)","rgba(127,127,127,0.00784)"],["rgba(0,0,0,0.00000)","rgba(26,134,67,0.07451)","rgba(22,124,53,0.95294)","rgba(31,139,63,1.00000)","rgba(52,171,84,0.99608)","rgba(52,171,83,0.77647)","rgba(49,166,78,0.10196)","rgba(0,0,0,0.00000)","rgba(23,128,56,0.79608)","rgba(28,143,63,1.00000)","rgba(22,130,56,1.00000)","rgba(42,159,75,1.00000)","rgba(57,182,90,1.00000)","rgba(52,171,85,1.00000)","rgba(53,170,85,0.09412)","rgba(0,0,0,0.00000)"],["rgba(0,85,85,0.01176)","rgba(0,170,85,0.01176)","rgba(25,129,56,0.79608)","rgba(21,128,55,0.99608)","rgba(38,151,70,0.96471)","rgba(58,174,94,0.13725)","rgba(0,0,0,0.00000)","rgba(127,255,127,0.00784)","rgba(24,127,56,0.49412)","rgba(25,136,59,0.74510)","rgba(22,125,54,0.74902)","rgba(34,142,65,0.74902)","rgba(55,175,86,0.74118)","rgba(51,170,83,0.65882)","rgba(45,165,75,0.06667)","rgba(0,255,0,0.00392)"],["rgba(0,127,63,0.01569)","rgba(0,0,0,0.00000)","rgba(21,123,55,0.38039)","rgba(33,147,67,1.00000)","rgba(51,168,82,0.99216)","rgba(53,172,85,0.78039)","rgba(40,161,80,0.07451)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)"],["rgba(0,1,0,0.00000)","rgba(0,255,127,0.00784)","rgba(42,127,42,0.02353)","rgba(50,166,82,0.81176)","rgba(55,177,88,1.00000)","rgba(55,176,87,1.00000)","rgba(53,172,85,0.79216)","rgba(45,165,75,0.06667)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(49,166,83,0.36078)","rgba(51,164,82,0.23137)","rgba(0,0,0,0.00000)","rgba(42,170,85,0.02353)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)"],["rgba(0,0,0,0.00000)","rgba(127,255,127,0.00784)","rgba(0,0,0,0.00000)","rgba(49,166,83,0.18039)","rgba(53,174,85,0.93333)","rgba(53,170,84,0.99216)","rgba(54,176,87,1.00000)","rgba(52,171,85,0.80000)","rgba(72,218,109,0.05490)","rgba(53,170,85,0.37647)","rgba(56,182,90,1.00000)","rgba(52,172,84,0.94510)","rgba(52,163,81,0.20784)","rgba(0,0,0,0.00000)","rgba(0,255,127,0.00784)","rgba(0,0,0,0.00000)"],["rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,255,127,0.00784)","rgba(0,0,0,0.00000)","rgba(48,163,81,0.20784)","rgba(53,174,85,0.93333)","rgba(54,173,86,1.00000)","rgba(55,175,87,1.00000)","rgba(40,152,72,0.86667)","rgba(50,165,80,0.98824)","rgba(53,171,85,0.98824)","rgba(53,172,85,1.00000)","rgba(54,172,85,0.92549)","rgba(51,170,85,0.21176)","rgba(0,255,0,0.00392)","rgba(0,127,127,0.00784)"],["rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(63,191,63,0.01569)","rgba(0,0,0,0.00000)","rgba(48,163,81,0.20784)","rgba(55,176,86,0.85098)","rgba(40,158,74,1.00000)","rgba(23,132,57,1.00000)","rgba(31,138,63,1.00000)","rgba(51,167,82,0.99216)","rgba(52,167,83,0.97255)","rgba(57,184,90,1.00000)","rgba(52,167,83,0.80000)","rgba(0,0,0,0.00000)","rgba(63,127,63,0.01569)"],["rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(85,170,85,0.01176)","rgba(0,0,0,0.00000)","rgba(34,136,68,0.05882)","rgba(23,132,57,0.50588)","rgba(25,132,57,0.83137)","rgba(23,129,56,1.00000)","rgba(32,144,65,1.00000)","rgba(53,175,86,1.00000)","rgba(54,176,87,0.91373)","rgba(50,167,82,0.37647)","rgba(0,255,0,0.00392)","rgba(85,170,85,0.01176)"],["rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,127,127,0.00784)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,85,85,0.01176)","rgba(24,137,58,0.20392)","rgba(19,123,51,0.25098)","rgba(43,159,75,0.25098)","rgba(60,170,85,0.08235)","rgba(0,0,0,0.00000)","rgba(0,255,0,0.00392)","rgba(0,0,0,0.00000)"],["rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,255,0,0.00392)","rgba(0,127,63,0.01569)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)","rgba(85,170,85,0.01176)","rgba(0,0,0,0.00000)","rgba(0,0,0,0.00000)"]]
            },
			numbers: {
				0: [
					[1,1,1],
					[1,0,1],
					[1,0,1],
					[1,0,1],
					[1,1,1]
				],
				1: [
					[0,1,0],
					[1,1,0],
					[0,1,0],
					[0,1,0],
					[1,1,1]
				],
				2: [
					[1,1,1],
					[0,0,1],
					[1,1,1],
					[1,0,0],
					[1,1,1]
				],
				3: [
					[1,1,1],
					[0,0,1],
					[0,1,1],
					[0,0,1],
					[1,1,1]
				],
				4: [
					[0,0,1],
					[0,1,1],
					[1,0,1],
					[1,1,1],
					[0,0,1]
				],
				5: [
					[1,1,1],
					[1,0,0],
					[1,1,1],
					[0,0,1],
					[1,1,1]
				],
				6: [
					[0,1,1],
					[1,0,0],
					[1,1,1],
					[1,0,1],
					[1,1,1]
				],
				7: [
					[1,1,1],
					[0,0,1],
					[0,0,1],
					[0,1,0],
					[0,1,0]
				],
				8: [
					[1,1,1],
					[1,0,1],
					[1,1,1],
					[1,0,1],
					[1,1,1]
				],
				9: [
					[1,1,1],
					[1,0,1],
					[1,1,1],
					[0,0,1],
					[1,1,0]
				],
				'+': [
					[0,0,0],
					[0,1,0],
					[1,1,1],
					[0,1,0],
					[0,0,0],
				],
				'k': [
					[1,0,1],
					[1,1,0],
					[1,1,0],
					[1,0,1],
					[1,0,1],
				]
			}
		};
		
		this.timer = setInterval(this.poll, 500);
		this.poll();
		
		return true;
	}
	
	this.drawUnreadCount = function(unread) {
		if(!self.textedCanvas) {
			self.textedCanvas = [];
		}
		
		if(!self.textedCanvas[unread]) {
			var iconCanvas = self.getUnreadCanvas();
			var textedCanvas = document.createElement('canvas');
			textedCanvas.height = textedCanvas.width = iconCanvas.width;
			var ctx = textedCanvas.getContext('2d');
			ctx.drawImage(iconCanvas, 0, 0);
			
			ctx.fillStyle = "#fef4ac";
			ctx.strokeStyle = "#dabc5c";
			ctx.strokeWidth = 1;
			
			var count = unread.length;
			
			if(count > 4) {
				unread = "1k+";
				count = unread.length;
			}
			
			var bgHeight = self.pixelMaps.numbers[0].length;
			var bgWidth = 0;
			var padding = count < 4 ? 1 : 0;
			var topMargin = 7;
			
			for(var index = 0; index < count; index++) {
				bgWidth += self.pixelMaps.numbers[unread[index]][0].length;
				if(index < count-1) {
					bgWidth += padding;
				}
			}
			bgWidth = bgWidth > textedCanvas.width-4 ? textedCanvas.width-4 : bgWidth;
			
			ctx.fillRect(textedCanvas.width-bgWidth-4,topMargin,bgWidth+4,bgHeight+4);
			
			var digit;
			var digitsWidth = bgWidth;
			for(index = 0; index < count; index++) {
				digit = unread[index];
				
				if (self.pixelMaps.numbers[digit]) {
					var map = self.pixelMaps.numbers[digit];
					var height = map.length;
					var width = map[0].length;
					
					ctx.fillStyle = "#2c3323";
					
					for (var y = 0; y < height; y++) {
						for (var x = 0; x < width; x++) {
							if(map[y][x]) {
								ctx.fillRect(14- digitsWidth + x, y+topMargin+2, 1, 1);
							}
						}
					}
					
					digitsWidth -= width + padding;
				}
			}	
			
			ctx.strokeRect(textedCanvas.width-bgWidth-3.5,topMargin+.5,bgWidth+3,bgHeight+3);
			
			self.textedCanvas[unread] = textedCanvas;
		}
		
		return self.textedCanvas[unread];
	}
	this.getIcon = function() {
		return self.getUnreadCanvas().toDataURL('image/png');
	}	
	this.getUnreadCanvas = function() {
		if(!self.unreadCanvas) {
			self.unreadCanvas = document.createElement('canvas');
			self.unreadCanvas.height = self.unreadCanvas.width = 16;
			
			var ctx = self.unreadCanvas.getContext('2d');
			
			for (var y = 0; y < self.unreadCanvas.width; y++) {
				for (var x = 0; x < self.unreadCanvas.height; x++) {
					if (self.pixelMaps.icons.unread[y][x]) {
						ctx.fillStyle = self.pixelMaps.icons.unread[y][x];
						ctx.fillRect(x, y, 1, 1);
					}
				}
			}
		}
		
		return self.unreadCanvas;
	}
	this.getUnreadCountMessages = function() {
		var matches = self.getSearchTextMessages().match(/\d+/g); //parse numerics
		//console.log(matches + ' unread messages found');
    return matches ? matches[0] : false;
	}
  this.getUnreadCountCalls = function() {
		var matches = self.getSearchTextCalls().match(/\d+/g); //parse numerics
    //console.log(matches + ' unread calls found');
    return matches ? matches[0] : false;
	}
	this.getUnreadCountVoicemail = function() {
		var matches = self.getSearchTextVoicemail().match(/\d+/g); //parse numerics
		//console.log(matches + ' unread voicemails found');
    return matches ? matches[0] : false;
	}
	this.getUnreadCountArchived = function() {
		var matches = self.getSearchTextArchived().match(/\d+/g); //parse numerics
		//console.log(matches + ' unread archived items found');
    return matches ? matches[0] : false;
	}
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
    //totalUnread = totalUnread / 2;
	//if ((totalUnread < 1) && (totalUnread > 0)) {
	//	totalUnread = 1;
	//}
    //console.log(totalUnread + ' unread items detected');
	return self.drawUnreadCount(totalUnread.toString()).toDataURL('image/png');
	}
    this.getSearchTextCalls = function() {
		var text = "";
		// calls = element 0
		if (document.getElementsByClassName('mdc-list-item__content')[0]) {
			text = top.document.getElementsByClassName('mdc-list-item__content')[0].textContent;
		}
		return text;
	}
	this.getSearchTextMessages = function() {
		var text = "";
		// messages = element 1
		if (document.getElementsByClassName('mdc-list-item__content')[1]) {
			text = top.document.getElementsByClassName('mdc-list-item__content')[1].textContent;
		}
		return text;
	}
    this.getSearchTextVoicemail = function() {
		var text = "";
		// voicemail = element 2
		if (document.getElementsByClassName('mdc-list-item__content')[2]) {
			text = top.document.getElementsByClassName('mdc-list-item__content')[2].textContent;
		}
		return text;
	}
    this.getSearchTextArchived = function() {
		var text = "";
		// archived = element 3
		if (document.getElementsByClassName('mdc-list-item__content')[3]) {
			text = top.document.getElementsByClassName('mdc-list-item__content')[3].textContent;
		}
		return text;
	}
	this.poll = function() {
    if (self.getUnreadCountMessages() || self.getUnreadCountCalls() || self.getUnreadCountVoicemail() || self.getUnreadCountArchived()) {
      self.setIcon(self.getUnreadCountIcon());
		} else {
			self.setIcon(self.getIcon());
		}
	}
	
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
    }, 499);

	}
	
	this.toString = function() { return '[object GVoiceFaviconAlerts]'; }
	
	return this.construct();
}