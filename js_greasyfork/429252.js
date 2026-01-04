// ==UserScript==
// @name          Filelist script for Ace Strem Magic Player
// @namespace     XXN
// @description   Filelist script for Ace Strem Magic Player. Beta version
// @include       *
// @copyright     XXN
// @author        XXN
// @version       1.0.0
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant         GM_log
// ==/UserScript==
 


magicplayer.addHandler("filelist", function(features) {
    GM_log("start filelist: features=" + JSON.stringify(features));
    magicplayer.loadPackage("ts-white-screen");
    
    var $ = TorrentStream.jQuery;
        
		var d = document;
		var body = d.body;
		$('a[href^="/download.php?id="]', d).each(function(e) {
			var url = $(this).attr('href');
			$tr = $('<tr class="filelist"><td class="header2" align="right">P2P Online:</td></tr>', d)
			$td = $('<td class="lista" valign="middle"></td>', d);
			var button = magicplayer.renderButton({
					button: {
						style: "text",
						caretPosition: "left",
						caretPadding: 10,
						text: "You will play online the content of the torrent-file in the original quality",
					},
					dataType: 'torrentUrl',
					data: "http://filelist.io"+url,
					downloadTorrent: true
			});
			$(button).addClass('fixed');
			$td.append(button);
			$tr.append($td);
			$(this).parent().parent().parent().parent().after($tr);
		});
});
