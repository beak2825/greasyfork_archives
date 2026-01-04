// ==UserScript==
// @name         Spotify - Unlimit Tab Counts
// @description  Spotify - Unlimit Tab Counts.
// @version      0.1
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// 
// @noframes
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// 
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/446645/Spotify%20-%20Unlimit%20Tab%20Counts.user.js
// @updateURL https://update.greasyfork.org/scripts/446645/Spotify%20-%20Unlimit%20Tab%20Counts.meta.js
// ==/UserScript==

const REMOVE_WEB_PLAYER = false;

// チェックとデバイスリスト取得 2種類のフェッチがある
// https://gae2-spclient.spotify.com/track-playback/v1/devices
// https://gae2-spclient.spotify.com/connect-state/v1/devices/hobs_449d52db63039d85604d91e330e779b712a
addAround(unsafeWindow, 'fetch', (proceed, args) => {
	var url = args[0];
	if(!/\/devices/.test(url))
		return proceed(args);

	var key = url.match(/(.+\/devices)/)[0];
	return proceed(args).then(res => {
		// タブ制限に達しているか？
		if(res.status != 200){
			// 正常なレスポンスに変更する
			res = new Response();
			res.json = () => {
				// 保存していた値を返し 正常であることを示す
				return Promise.resolve(GM_getValue(key));
			};

			return res;
		}

		addAround(res, 'json', (proceed, args) => {
			return proceed(args).then(json => {
				// デバイスリストの取得か？
				if(json.devices){
                    if(REMOVE_WEB_PLAYER){
                        // ウェブプレーヤーを削除し デスクトップアプリ再生のみにする
                        let devices = json.devices;
                        for (const id in devices)
                            if(/Web Player/.test(devices[id].name))
                                delete devices[id];
                    }
				} else {
					// タブチェックの場合 正常な結果を保存しておく
					GM_setValue(key, json);
				}

				return json;
			});
		});

		return res;
	});
});

function addAround(target, methodNames, advice){
	methodNames = [].concat(methodNames);

	// ワイルドカードの展開
	for(var i=0 ; i<methodNames.length ; i++){
		if(methodNames[i].indexOf('*')==-1) continue;

		var hint = methodNames.splice(i, 1)[0];
		hint = new RegExp('^' + hint.replace(/\*/g, '.*'));
		for(var prop in target) {
			if(hint.test(prop) && typeof(target[prop]) == 'function')
				methodNames.push(prop);
		}
	}

	methodNames.forEach(function(methodName){
		var method = target[methodName];
		target[methodName] = function() {
			var self = this;
			return advice(
				function(args){
					return method.apply(self, args);
				},
				arguments, self, methodName);
		};
		target[methodName].overwrite = (method.overwrite || 0) + 1;
	});
}