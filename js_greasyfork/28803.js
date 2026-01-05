// ==UserScript==
// @name        The West - Block Announcement
// @namespace   The West
// @author 		westernblumi
// @description Blocks the "invite a friend" announcement
// @include https://*.the-west.*/game.php*
// @version	1.02
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/28803/The%20West%20-%20Block%20Announcement.user.js
// @updateURL https://update.greasyfork.org/scripts/28803/The%20West%20-%20Block%20Announcement.meta.js
// ==/UserScript==
// Test User: Waddl, Kara B. Nemsi, stayawayknight
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
}) (function () {
	announcementBlock = {
		version: '1.02',
		name: 'The West - Block Announcement',
        website: 'https://greasyfork.org/de/scripts/28803-the-west-block-announcement',
        updateUrl: 'https://raw.githack.com/westernblumi/thewest/master/skriptUpdater.js',
	};
    announcementBlock.Skript = {
        init: function () {
			ServerInfoWindow.backup_open = ServerInfoWindow.open;
			ServerInfoWindow.open = function (tab) {
				if (undefined === tab){
					ServerInfoWindow.backup_open.call(this,tab);
				} else {
					for (var i = Game.interstitialData.length - 1; i >= 0; i--) {
						if (Game.interstitialData[i].content_id == 1239) {
							Game.interstitialData.splice(i, 1);
							console.log('announcements blocked');
						}
					}
					if (Game.interstitialData.length > 0) {
						ServerInfoWindow.backup_open.call(this,tab);
					}
				}
			};
			
        },
		
    };
	
	announcementBlock.Updater = function () {
      $.getScript(announcementBlock.updateUrl, function () {
        if (scriptUpdate.announcementBlock > announcementBlock.version) {
          var updateMessage = new west.gui.Dialog('Update', '<span>A new version of the script ' + announcementBlock.name + ' is available<br><br><b>Version: ' + scriptUpdate.announcementBlock + '</b><br>' + scriptUpdate.announcementBlockNew + '</span>', west.gui.Dialog.SYS_WARNING).addButton('Update', function () {
            updateMessage.hide();
            location.href = announcementBlock.website + '/code.user.js';
          }).addButton('cancel').show();
        }
      });
    };
    setTimeout(announcementBlock.Updater, 4000);
	
    announcementBlock.Skript.init();
});