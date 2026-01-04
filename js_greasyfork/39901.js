// ==UserScript==
// @name           Rakuten hlsPlayer
// @description    Insert hlsPlayer in Rakuten TV
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20220508074115
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/39901/Rakuten%20hlsPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/39901/Rakuten%20hlsPlayer.meta.js
// ==/UserScript==


(function () {
	function ShowResult(url, key, color) {
		var trends_dom = document.getElementById('extractresult');
		if (trends_dom === null)
		{
			trends_dom = document.createElement('div');
			trends_dom.setAttribute('id', 'extractresult');
		}
		trends_dom.innerHTML = "";
		var title_dom = document.createElement('strong');
		title_dom.innerHTML = [
			'<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: 5px 0px 0px 0px; vertical-align: middle; border-spacing: 0px"><div style="display: inline-table;">',
			'<div style="display: table-cell; padding: 0px 10px 0px 10px; vertical-align: middle; font: 12px Consolas; font-weight: bold;"><a style="background-color: #ec0000;box-shadow: 0 2px 2px rgba(50,50,50,.4); text-decoration: none; min-width: 156px; box-sizing: border-box; margin: 0; padding: 0 1em; outline: none; display: block; border-radius: 2px; color: ' + color + ';" href="' + key + '">KEY</a></div>',
			'<div style="display: table-cell; padding: inherit; vertical-align: middle; font: 12px Consolas; font-weight: bold;"><a style="background-color: #565656;box-shadow: 0 2px 2px rgba(50,50,50,.4); text-decoration: none; min-width: 156px; box-sizing: border-box; margin: 0; padding: 0 1em; outline: none; display: block; border-radius: 2px; color: ' + color + ';" href="' + url + '">' + url + '</a></div>',
			'</div></div>'
		].join(' ');

		trends_dom.appendChild(title_dom);
		trends_dom.style.cssText = [
			'background: rgba(53, 54, 55, 1);',
			'color: #000;',
			'padding: 0px;',
			'position: fixed;',
			'z-index:10240;',
			'width:100%;',
			'font: 12px Meiryo;',
			'vertical-align: middle;',
		].join(' ');
		document.body.style.cssText = 'position: relative; margin-top: 45px';
		document.body.parentElement.insertBefore(trends_dom, document.body);
	}

	function start()
	{
		if (typeof (hlsPlayer) == 'undefined') {
			var player = document.createElement('script');
			player.src = 'https://tv.rakuten.co.jp/js/player3/hls-player.js';
			document.body.appendChild(player);
			setTimeout(start, 100);
			console.log('load');
			return;
		}
		else
		{
			memberParam.player_type='hls';
			memberParam.device_id=9;
			playerParamMember.player_type="hls";
			playerParamMember.device_id=9;
			eval("playerCreateAndPlay = " + playerCreateAndPlay.toString().replace(/playerType\s*:\s*playerType,/, "playerType: 'hls', mptype: 'pc',"));
			$("[data-play_content_id]").off('click');
			$("[data-play_content_id]").on('click', playerCreateAndPlay);
			console.log('complete');

			var hlsUrl = "";
			var keyUrl = "";
			var error = "";
			$.ajax({
				type: "GET",
				url: "https://api.tv.rakuten.co.jp/content/playinfo.json",
				data: { content_id: contentData.content_id, device_id: 9 },
				async: false,
				cache: false,
				crossDomain: true,
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function (req) {
					req.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
				},
				success: function (playinfo) {
					hlsUrl = playinfo.result.paths[0].path;
				},
				error: function (xhr, status, error) {
					error = "playinfo load error";
				}
			});

			if(hlsUrl !== "")
			{
				var finalPath = "";
				hlsUrl = hlsUrl.replace(/Manifest(\(.+?\))*/, "Manifest(format=m3u8-aapl-v3,encryption=cbc,audio-only=false)");

				$.ajax({
					type: "GET",
					url: hlsUrl,
					async: false,
					success: function (hls) {
						var domain = hlsUrl.replace(/(Manifest\(.+?\))$/, "");
						var realPath = /^(QualityLevels.+?)$/gm.exec(hls);
						finalPath = domain + realPath[1];

						console.log(finalPath);
					},
					error: function (xhr, status, error) {
						error = "master hls load error";
					}
				});

				if (finalPath !== "")
				{
					$.ajax({
						type: "GET",
						url: finalPath,
						async: false,
						success: function (hls) {
							var key = /,URI=\"(.+?)\"/gm.exec(hls);
							keyUrl = key[1];
							console.log(key[1]);
						},
						error: function (xhr, status, error) {
							error = "key find error";
						}
					});
				}
			}

			ShowResult(hlsUrl, keyUrl, "#e5e5e5");
		}
	}
	start();
})();