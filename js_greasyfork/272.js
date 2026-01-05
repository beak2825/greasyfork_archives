// ==UserScript==
// @name        ニコ生アラート（簡）
// @name:ja     ニコ生アラート (簡)
// @name:en     Nico Live Alert (Kan)
// @description Alerts you to live streams that match your search. Supports these sites:  FC2 Live, SHOWROOM, Stickam JAPAN!, TwitCasting, Twitch, Niconico Live, Himawari Stream, FRESH! (AbemaTV), Whowatch, Periscope (Twitter)
// @description:ja キーワードにヒットしたライブ配信を通知します。次のサイトに対応: FC2ライブ、SHOWROOM、Stickam JAPAN!、ツイキャス、Twitch、ニコニコ生放送、ひまわりストリーム、FRESH! (AbemaTV)、ふわっち、Periscope (Twitter)
// @namespace   http://userscripts.org/users/347021
// @version     5.6.0
// @match       https://*.nicovideo.jp/*
// @match       https://live.fc2.com/*
// @match       https://gae.cavelis.net/*
// @match       https://www.showroom-live.com/*
// @match       https://www.stickam.jp/*
// @match       https://twitcasting.tv/*
// @match       https://www.twitch.tv/*
// @match       *://himast.in/*
// @match       https://freshlive.tv/*
// @match       https://whowatch.tv/*
// @match       https://www.periscope.tv/*
// @match       https://www.youtube.com/*
// @match       https://www.younow.com/*
// @match       https://livestream.com/*
// @require     https://gitcdn.xyz/repo/greasemonkey/gm4-polyfill/a834d46afcc7d6f6297829876423f58bb14a0d97/gm4-polyfill.js
// @require     https://bowercdn.net/c/jsen-0.6.6/dist/jsen.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/favico.js/0.3.10/favico.js
// @require     https://bowercdn.net/c/compare-versions-3.4.0/index.js
// @require     https://greasyfork.org/scripts/17932/code/suppress-prototypejs.js?version=140950
// @require     https://bowercdn.net/c/css-escape-1.5.1/css.escape.js
// @require     https://greasyfork.org/scripts/17895/code/polyfill.js?version=625392
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=230651
// @require     https://greasyfork.org/scripts/17896/code/start-script.js?version=112958
// @license     MPL-2.0
// @contributionURL https://www.amazon.co.jp/registry/wishlist/E7PJ5C3K7AM2
// @compatible  Edge 非推奨 / Deprecated
// @compatible  Firefox
// @compatible  Opera
// @compatible  Chrome
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.deleteValue
// @grant       GM_deleteValue
// @grant       GM.registerMenuCommand
// @grant       GM_registerMenuCommand
// @grant       GM.openInTab
// @grant       GM_openInTab
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @connect     live.fc2.com
// @connect     www.showroom-live.com
// @connect     www.stickam.jp
// @connect     twitcasting.tv
// @connect     api.twitch.tv
// @connect     api.search.nicovideo.jp
// @connect     himast.in
// @connect     freshlive.tv
// @connect     api.whowatch.tv
// @connect     api.periscope.tv
// @connect     www.youtube.com
// @noframes
// @run-at      document-start
// @icon        data:image/vnd.microsoft.icon;base64,AAABAAEAMDAAAAEAIAAuDQAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAwAAAAMAgGAAAAVwL5hwAADPVJREFUaIHNWXl4lNW5/52Zb/aZZCaZLaskk4RAWAIKCAoahKBUYkGsqLXQ9kLpo9el7a1irxYLaa1elVpUtNYqYkvdA2KLgoqsBsEsJCwhC8Ssk22yzExmvu+8/SMzw2QyoSHRen/P8+X55nxn+b3bed9zAnzDcNgtAIB0W7yQYNBunj97ljgpLfWUUWCzACDNGs++aQ5fC7TAQ7+857+pr7eP9n28lyZellwHQP1t8xox5MD2I4cOEhFJREQ3XDvPDWDyt81rxNABK1fd+j2qKC+nl7Y8R+k2czFwwcX+XyEaKSKCgWkOpVuTKcGg26EGrIG+Y4oB2VgGDwdXFxtCKkZmX7NqtTD7R2ubQaRo9AKtAFDd7KRvgsMlIZrGbTrrHXrYiuwGy3cGWuxbjn6uoMoTAiXEWN8eOod5VGuP2QIOuwUXVJitBnJ1QPKE7Ini86+/01WQPVF6A5ilzEwUM5OSJXx5TEBTt/zoQP+UiUCKGQCG2uw/jBiZNefqy+OcNy820oRUc8PGh3VEBL5onomA5JUF+San2w16+AE9AcnTMxLMj9yyxEjzrojrU8GWBQwo41sMavuan91lIF8/qK5GTh3tjEQR/NWX1FLBQpP30V/piQhUsNAkAYkbctLMnUSgRx7UE5CwKjiLw3ZpAsi/LvopcZrm6ir5xA92qMytrTLFdfk+mcSBuHiS3b7KIyxa7AMAysySkDlOvGZCjqSel+fD+++pcOyooJEQI0uM0Zw93+H0O+wWdPa6vy5qF0e6zRyxFSbMuHxCfKskgrb+WUMWrfX88huNnWUlArm6GN/xjorqamVEBE4E3tHOaO+HSnrwfgONs1jeBACH3TxixY45iGta2lDd7CSH3RwQgk6rVOTZ/YEKH/1TCadb8f2yL4UTgkD47BMlW3lrbFnerPi6IwcVrL2N4Y9P6dDulGFcmgS5nBIAgPANR7TDbhnkq5FbYGKsZaZJYd0ep7TeCQDzrzR1EYHWP6QnIDFPCdsrJccF2lWkIi1sexnsvzSrrS847OZQMI8Ulyyqw24BCKhucUZ+sgCYpgAmKAGtUgEDwFT9fiEpJVl+y73/45W98qIcxRXSIiUQvyAv9q/9XrnnwGHFnH60lAQnSYmzsPqOkSe3SxIg3WZGt8sla/P6OQDIgSsJWJqRZC9ITErKjjdbkDpuHKw2G4wmE5RKJQiAKHKcq22jlqazrKG+Bm1OZ+uxU9UnAb7twfvytz226UMvAKRZ42W1re3cYbNEU9Do4LBbkB5hUi2wVAt8mD93Dj326Hr6ZM9H1NXZSf8GnIg4cU4nysro5Re20J233EzJJkOtAlgHQB+uqNFm5qgChMGmAt65dtYMemv738jn84lE5A+QI7/Px/0+Hxf9fhJFkYc/fr+ffD4flyQpKIxERL7y0hJas/JOSjbFNABYMViIMSY1h92CzEQ7AEAH3JRmje95bMOjgzVKxAO4oOoo75zzQe/h44mIjhw6SIvmXUVa4I2ZOeM1QSFGQTqq5Gumj8+kzz75OHQgCTAOFyLUFvE+qC0obPj3oFVEURTv++lailPKjwLQRFPov3Utu1Efyg2zp0/Rxcjw89lTJ1NdbU1QayRJEnEucUmSwkkOESD4O9Av0lRDBAziicINlGyK2acEMgBkTcvOiAtySjHFDKd5C7IC7mLSKbNNWsX2BIP2fG6Wg6qrzoQvODgywxou4i7k8/mIE4/sx8P7BS2xf9+nZNEoacbE8bRkQR5dFm88owN+FuIarV4Kuo3AkHWZxeR6+qf30JyMDHp96ytSGE9ORHznu29TbpaDv1/0Lg+YPlKrg3zc6Wzl+XPn0IqlBSGfDzPIoLZ/frCLMsxxdOsNi3hTY4Pk9XqkkuPH6MYFeaQCNkbyHYJ4vWr/qw88Qvuf2sLz584JELmwkCiKNP/KmSQHKH/uVYMCMdxFwsm99PxzXAmQRavi/3h/ZzQBiIio2+WiudNz+W/uWMWLDx4cJFhnRwfNyMkmo8DmhAswqBYyqOVXjE8ZN+0Hi27CG3v/gbwbFhMAEAAWOHF4PB40NTbAHqtHZ2cHXvrTC3hu8zMoLy8DYwyMMRBRqD8ANNSfh0EtQBAENNTXA0CoD2MsdCA6XnIccUyBxIQkZE8OXVgQAGY0mahg2c3oEWk+AFQ3O4cK0O+TLOPsybpeTx9On69l1y1cCABgYQlbq9VSmiMDflGk9pZWfPTyayjduRsrb7oJG3798ED/iONVzpSp6PGK4Jxj0pSpQ6zOBkiio72DjHoDDFod3O6h5bTNZgcHjEM+BBGrFqbPnZTTW/f6DlqQm8vr6s8R9XrJfbiMPF+e4tzjJSKiXUXvkU2vpteeeIqo083pcCWd21ZE01NTadeunUREJIpiKFg9bjfd85PV9Ot1D4QChYjI39LO3cUnyHuyhoiIKioraE5mJh16+k/83Tf+PmivICL6yco7SQWsDec8qO7uF3kTuH8BGEtr73Uhf0kBizndQF5nO6S2LoA4BLuZOdvbUfPFcSpcXwiZ3QTXybOwGUxMo1JR4bNPY/bVV7OEhEQKupNCocANNy5h1163gAIaZ9ztJc+BLyF19UBqbodCo2bWLAc+ObCP6iorYdUYEJuWgthYIwOAD3YUsU2P/75RRvx+t8j70gOHnpALBYPC3d//w217djqPV5Qzd2+PJBPkAA94qWxAXperC3K5AF5VD/feYsi8foABxphYiN29eGzdQ2hrawsphoiiv3MecDeC3+cDAGza/DzOSn3Y+tetuPu22/HaKy9j48P/y+5e/WNXY4fre21ef4vDbmE1zVGKvWDqnpyZnmBUsP1P/v53RETUd7SCvBXVnPf7OBFRc1MTzZw8kfYUbiL6tITTx8e49FEx3Tb3Gro6M5NWXH89OZ3OQTkhMn8QEfc3Obn7cCl5T5wl7vcPpHgi7na7+YtbnqM7li+jWDk4gN8mxeodAY7DV9DptkG3ApOmZqaLrp5uIqLQ5MFt7603/84npSbzR2/7Af/Lfet4wYyZfMG8Ofzu//ox/6K4ODwnDMkNkWVIKCwGyoqgpOIz//c4xQoI3SE5RlLgOewWpMYbZQCgAZ5c8d2CIcVXkMChgwf4PXet5au+fxt/9plNwYQWXuCFCzDkW5Q5Q+vsKnqPslOSvABSg7xGVZ2a1YpXF141mw7s+zR8R4iqQU6c+3y+qNoO1kdhm1BUS7j7+uiJwg2UbjN364G8S2cctMTgemOF3aA5ufT6fPrzluepvLSUul0uKeBZ0hBXCNv6hnkPf6R+r1cqLy2hJwo30sycCaQH3gaQEO4Vw2HYgAgOMlus+Ly8AslGg7qtq2dxP3B9dmrSonHp6alJSSmw2m1ITE6GzWZHTKwROr2ONBoNFEolEwQBcrkcjMkABpJEEV6PBy5XN2tpakRzUyPO1dWiuqoKpyoqG043NP0tRoa3ujk+jyReHW3XuZgAkYJETKDAwCF+OoDUGBmuADBNqVQ4NGq1AYyBE5FsoFYAAuUAEYFzDoVCUevz+Q67uvucbuAEgP0AqgGIg9YlQnVLGy6GER/q0+1m1DQPnUwLxNqs8e9OnpqbJwjyYOFEIGDgT2jfZ2AMnHM6WXHi9JmG5uUAKiLn+1oP9BdDMEb0wPp7164Zia+Hnu2vbaVko6ESABx2i+JS70PDIYx2YFBLjKG24auvUFZSgl53H2OMEaJblgEgg15P5+rqGBhrCbTzsWh8VHd4kZdbMQr2YmK8ZfW0rInkF0VQgGzEQkwhCHSupZGVVp05kWC1LDrb7Gx02C3DBuhIMCoLRC6o1Gp8P1qyHL+49Ydw9fUOO86g1WFf6VHc9YdCnKpvbAzONRa/H7UFqpudSDBo17h63Mu0asVVOWkZ+vgYIyQuDTtOLpPB6/NReU0Va3P1fKZVCW+3ef3PMMYwWkuM5Rp48tzLc8s2Pv4kTHFx6Bf9JEkSu+iMNHDY0Wt11NPtYr/7zXrs3r1nuRcY8j+zkWLUQQwgw2qzYd78+cHf4X4fGQNBscK/92dkZql27N6TNQYOY7KAanxywpGcKVNyBZVK6vf1y4PqZ4yRTq1mgZyAPq+HiCiQ0QgalZrEfh8rLy2pdbvd19Z3uM7/RwVIt1tQ0+xEkk5jdbk9hzffuy49IzmVunp7mCCXw6iPobv/UMi/qKs7lJNgn7H53l+pJc7h9fXDqDfg2JlKPPLyH2tdItKBgTKeseHLhYthVC7EAtm1oc/TGqsRioqrK++/Y/F3mRBvIfT10LNvbpV1+zynAFzT4ek9UtXSMHP10tsJOh3Edie9uneXTJLLtkHkcNjMMoB4dZQsPyIuoxqFCzuRw2ZR93j6Xp/iyFqWYk2As6sD5TVnKly9vcu7PP5Ttlhdtlqp2jE5PTPTpI9BvbMZVV+dK2ro6F4GgAetOVr8C9DD3qnMZcwMAAAAAElFTkSuQmCC
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/272
// @contributor HADAA
// @contributor tet https://www.nicovideo.jp/user/8386824
// @downloadURL https://update.greasyfork.org/scripts/272/%E3%83%8B%E3%82%B3%E7%94%9F%E3%82%A2%E3%83%A9%E3%83%BC%E3%83%88%EF%BC%88%E7%B0%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/272/%E3%83%8B%E3%82%B3%E7%94%9F%E3%82%A2%E3%83%A9%E3%83%BC%E3%83%88%EF%BC%88%E7%B0%A1%EF%BC%89.meta.js
// ==/UserScript==

/*eslint no-use-before-define: [ error, { variables: false } ] */
'use strict';

// L10N
Gettext.setLocalizedTexts({
	/*eslint-disable quote-props, max-len */
	'en': {
		//'（取得不可）': '(No data)',
		'検索ワードにヒットしたライブ配信番組': 'Live streams that match your search words',
		'どのライブ配信サービスか': 'Service from',
		'アイコン': 'Icon',
		'プライベート配信か否か': 'Private program or not',
		'限定公開': 'Limited',
		'経過': 'Elapsed',
		'%d 分': '%dm',
		'%d 時間 %u 分': '%dh%um',
		'配信開始からの経過時間': 'Time elapsed since start of live stream',
		'タイトル': 'Title',
		'番組のタイトル': 'Program title',
		'タグ': 'Tags',
		'カテゴリ・タグ': 'Category and tags',
		'配信者': 'Broadcaster',
		'配信者の名前': 'Broadcaster name',
		'説明文': 'Description',
		'来場': 'Visitors',
		'来場者数': 'Number of visitors',
		'%d 人': '%d',
		'コメ数': 'Comments',
		'%d コメ': '%d',
		'総コメント数': 'Total number of comments',
		'コミュニティ': 'Community',
		'コミュニティ・チャンネル': 'Community or channel',
		'%s 更新': 'Last updated %s', // %sは年月日
		//'メンテナンス中': 'Under maintenance',
		//'サーバーダウン': 'Server is down',
		//'オフライン': 'Offline',
		'検索語句': 'Search words',
		'除外するコミュニティ・チャンネルなどの URL': 'Community or channel URLs to be excluded',
		'保存': 'Save',
		'除外 URL リストの取得先を設定': 'Sets the location of the URL exclusion list',
		'特定の URL から、除外 URL のリストを読み込み、検索時に付加します。': 'Loads exclusion list from designated URL and adds to search.',
		'JSON 形式の URL 文字列の配列のみ有効です。': 'Array of URLs needs to be in JSON format.',
		'また、除外 URL リストの読み込みは、アラートページ読み込み時に1回だけ行われます。': 'Also, this script loads exclusion list only once when the alert page is opened.',
		//'GM.xmlHttpRequest エラー': 'GM.xmlHttpRequest error',
		'指定された URL から、除外 URL リストを読み込めませんでした。\n取得せずに続行します。\n\nエラーメッセージ：\n%s': 'Failure to fetch URL exclusion list from designated URL. Continue without fetching.\n\nError message:\n%s',
		'追加設定ボックスの開閉': 'Toggle extra settings',
		'検索対象のライブ配信サービス': 'Live streaming services for search',
		'サービス名': 'Service name',
		'最後に検索結果の取得に成功にした日時': 'Last successful search result timestamp',
		'直近のエラー': 'Last error',
		'FC2ライブ': 'FC2 Live',
		'CaveTube': 'CaveTube',
		'SHOWROOM': 'SHOWROOM',
		'Stickam JAPAN!': 'Stickam JAPAN!',
		'ツイキャス': 'TwitCasting',
		'Twitch': 'Twitch',
		'ニコニコ生放送': 'Niconico Live',
		'ひまわりストリーム': 'Himawari Stream',
		'FRESH! (AbemaTV)': 'FRESH! (AbemaTV)',
		'ふわっち': 'Whowatch',
		'Periscope (Twitter)': 'Periscope (Twitter)',
		'YouTube ライブ': 'YouTube Live',
		'YouNow': 'YouNow',
		'Livestream': 'Livestream',
		'表示する項目の設定': 'Set which items to display',
		'その他の設定': 'Other Settings',
		'プライベート配信を通知しない': 'Do not notify about private programs',
		'タイトル・キャプション・コミュニティ名が %d 文字を超えたら省略する': 'Truncate to %d characters if title description or community name is longer',
		'言語で絞り込む (言語が取得可能なサービスのみ)': 'Filter by language (only for services that have this function)',
		'アラート音': 'Alert sound',
		'ファイルサイズが大きいため、設定に失敗しました。\n\nエラーメッセージ：\n%s': 'Failure to set because file is too large.\n\nError message:\n%s',
		'使用中のブラウザが対応していないファイル形式です。': 'Your browser cannot play this type of file.',
		'項目名クリックで番組を昇順・降順に並べ替えることができます。': 'If you click on item name, you can sort programs.',
		'項目名をドラッグ&ドロップで列の位置を変更できます。': 'Drag and drop item name to change column position.',
		'ユーザー名やコミュニティ名をテキストエリアにドラッグ&ドロップで除外 URL に指定できます。': 'Drag and drop user or community name to textarea to set URL exclusion filter.',
		'RSSの取得に失敗しました。ページを更新してみてください。\n\nエラーメッセージ：\n%s\n%d 行目': 'Failure to read RSS file. Please refresh this page.\n\nError message:\n%s\non line %d',
		'更新しますか？': 'Do you want to refresh?',
		'指定された URL から NG リストを読み込めませんでした。\n取得せずに続行します。\n\nエラーメッセージ：\n%s': 'Failure to get communities and channels from the specified URL.\nScript will continue without getting them.\n\nError message:\n%s',
		'設定のインポートとエクスポート': 'Import and export settings',
		'JSONファイルからインポートする': 'Import from JSON file',
		'JSON形式でファイルにエクスポート': 'Export to file in JSON format',
		'インポートに失敗しました。\n\nエラーメッセージ：\n%s': 'Import failed.\n\nError message:\n%s',
		'インポートが完了しました。ページを再読み込みします。': 'Import completed. Refreshing this page.',
		'ローカルストレージの容量制限を超えたので、プロパティ %p を無視しました。': 'Because the capacity of local storage was exceeded, %p property is ignored.', // %pはカンマ区切りのプロパティ名
		'値が壊れていたので、プロパティ %p を無視しました。': 'Because the value corrupted, %p property is ignored.', // %pはプロパティ名
		'使用中のブラウザが対応していないファイル形式のため、プロパティ %p を無視しました。': 'Because your browser doesn\'t support this type of file, %p property is ignored.', // %pはプロパティ名
		'アラート音を選択': 'Sets alert sound',
		'設定済みのアラート音を削除': 'Deletes alert sound set in advance',
		' ❰❰%s❱❱ ': ' <<%s>> ', // ツールチップ内における一致箇所のマーク

		'ニコ生アラート (簡)': 'Nico Live alert (Kan)',
	},
	/*eslint-enable quote-props, max-len */
});

// クライアントの言語を設定する
Gettext.setLocale(window.navigator.language);

/**
 * 接続に関する例外。
 */
class ConnectionException extends Error
{
	/**
	 * @param {string} message
	 */
	constructor(message = 'Connection exception occured.')
	{
		super(message);
		this.name = 'ConnectionException';
	}
}

/**
 * 時間切れ。
 */
class TimeoutException extends ConnectionException
{
	/**
	 * @param {string} message
	 */
	constructor(message = 'Connection timed out.')
	{
		super(message);
		this.name = 'TimeoutException';
	}
}

/**
 * HTTPステータスコードが200でない。
 */
class ErrorStatusException extends ConnectionException
{
	/**
	 * @param {number} code - HTTPステータスコード。
	 * @param {string} message
	 */
	constructor(code, message = 'HTTP status-code was %s.'.replace('%s', code))
	{
		super(message);
		this.name = 'ErrorStatusException';

		/**
		 * HTTPステータスコード。
		 * @type {number}
		 */
		this.code = code;
	}
}

/**
 * クライアント側の意図的な切断。
 */
class AbortException extends ConnectionException
{
	/**
	 * @param {string} message
	 */
	constructor(message = 'Request was aborted.')
	{
		super(message);
		this.name = 'AbortException';
	}
}

/**
 * ネットワークエラー。
 */
class NetworkException extends ConnectionException
{
	/**
	 * @param {string} message
	 */
	constructor(message = 'Network error occured.')
	{
		super(message);
		this.name = 'NetworkException';
	}
}

/**
 * HTTPリクエスト。
 * @version 1.0.2
 */
class HTTPRequest
{
	/**
	 * HTTPリクエストに必要な情報。
	 * @typedef {Object} HTTPRequestInit
	 * @see [GM.xmlHttpRequest - GreaseSpot Wiki]{@link https://wiki.greasespot.net/GM.xmlHttpRequest#Arguments}
	 * @see [Fetch Standard （日本語訳）]{@link https://triple-underscore.github.io/Fetch-ja.html#requestinit}
	 * @property {string} method - 「GET」「POST」のいずれか。
	 * @property {string} url
	 * @property {string} responseType - 「document」「json」「text」のいずれか。
	 * @property {Object.<string>} headers
	 * @property {number} [timeout] - ミリ秒。
	 * @property {(string|Object)} [data]
	 * @property {string} mode -
	 *                         {@link XMLHttpRequest} を使用するなら「cors」、{@link GM.xmlHttpRequest} を使用する必要があれば「no-cors」を指定する。
	 */

	/**
	 * @param {HTTPRequestInit} init
	 */
	constructor(init)
	{
		/** @access private */
		this.details = init;
	}

	/**
	 * @access private
	 * @param {Object} client
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @param {string} [responseType]
	 */
	onload(client, resolve, reject, responseType)
	{
		if (client.status === 200) {
			if (client instanceof XMLHttpRequest) {
				if (client.response) {
					resolve(client.response);
				} else {
					reject(new SyntaxError('Parsing HTTP response body was failed.'));
				}
			} else if (client.responseText === '') {
				reject(new SyntaxError('HTTP response body was empty.'));
			} else {
				switch (this.details.responseType) {
					case 'json':
						resolve(JSON.parse(client.responseText));
						break;

					case 'document': {
						let result = /^content-type\s*:\s*(text\/html|text\/xml|application\/xml|\S+\+xml)(?:;|\s|$)/im
							.exec(client.responseHeaders);
						if (result) {
							result = new DOMParser().parseFromString(
								client.responseText,
								result[1] === 'text/html' ? 'text/html' : 'application/xml'
							);

							const parsererror = result.getElementsByTagName('parsererror')[0];
							if (parsererror) {
								reject(new SyntaxError(parsererror.textContent));
							} else {
								if (result.head) {
									result.head.insertAdjacentHTML('beforeend', h`<base href="${client.finalUrl}" />`);
								}
								resolve(result);
							}
						}
						break;
					}
					case 'text':
						resolve(client.responseText);
						break;
				}
			}
		} else {
			console.debug(client.response || client.responseText);
			reject(new ErrorStatusException(client.status));
		}
	}

	/**
	 * @access private
	 * @param {Function} reject
	 */
	ontimeout(reject)
	{
		reject(new TimeoutException());
	}

	/**
	 * @access private
	 * @param {Function} reject
	 */
	onabort(reject)
	{
		reject(new AbortException());
	}

	/**
	 * @access private
	 * @param {Function} reject
	 */
	onerror(reject)
	{
		reject(new NetworkException());
	}

	/**
	 * リクエストを送信します。
	 * @returns {Promise.<string|Object>}
	 */
	send()
	{
		return new Promise((resolve, reject) => {
			if (this.details.mode === 'cors') {
				/**
				 * abort() メソッドを持つオブジェクト。
				 * @type {Object}
				 */
				this.client = new XMLHttpRequest();
				this.client.open(this.details.method, this.details.url);
				this.client.responseType = this.details.responseType;
				this.client.addEventListener('load', event => {
					this.onload(event.target, resolve, reject);
				});
				this.client.addEventListener('timeout', () => {
					this.ontimeout(reject);
				});
				this.client.addEventListener('abort', () => {
					this.onabort(reject);
				});
				this.client.addEventListener('error', () => {
					this.onerror(reject);
				});
				if (this.details.headers) {
					for (const name in this.details.headers) {
						this.client.setRequestHeader(name, this.details.headers[name]);
					}
				}
				if (this.details.timeout) {
					this.client.timeout = this.details.timeout;
				}
				if (this.details.data && typeof this.details.data === 'object') {
					this.client.setRequestHeader('content-type', 'application/json');
					this.client.send(JSON.stringify(this.details.data));
				} else {
					this.client.send(this.details.data);
				}
			} else {
				const details = {};
				for (const key in this.details) {
					details[key] = this.details[key];
				}
				delete details.responseType;
				details.onload = responseObject => {
					this.onload(responseObject, resolve, reject, details.responseType);
				};
				details.ontimeout = () => {
					this.ontimeout(reject);
				};
				details.onabort = () => {
					this.onabort(reject);
				};
				details.onerror = () => {
					this.onerror(reject);
				};
				if (details.data && typeof details.data === 'object') {
					if (!details.headers) {
						details.headers = {};
					}
					details.headers['content-type'] = 'application/json';
					details.data = JSON.stringify(details.data);
				}
				this.client = GM.xmlHttpRequest(details);
			}
		});
	}

	/**
	 * リクエストを取り消します。
	 */
	abort()
	{
		if (this.client) {
			this.client.abort();
		}
	}
}

/**
 * 文字列の正規化などを行うユーティリティークラスです。
 */
class Normalizer
{
	/**
	 * 正規化し、連続する空白文字を半角スペースにします。
	 * @param {string} str
	 * @returns {string}
	 */
	static normalize(str)
	{
		return String(str).normalize('NFKC').replace(/\s+/g, ' ');
	}

	/**
	 * 文字種を統一します。
	 * @param {string} normalizedStr - 正規化済みの文字列。
	 * @returns {string}
	 */
	static unifyCases(normalizedStr)
	{
		return StringProcessor.convertToKatakana(normalizedStr).toLocaleLowerCase();
	}
}

/**
 * 文字列とそこに含まれる文字列に関連する処理を行うユーティリティークラスです。
 */
class WordProcessor
{
	/**
	 * OR検索を行います。
	 * @param {string} str
	 * @param {SearchCriteria[]} words
	 * @returns {?SearchCriteria}
	 */
	static orSearch(str, words)
	{
		let searchCriteria = null;
		for (const word of words) {
			if (this.andSearch(str, word)) {
				searchCriteria = word;
				break;
			}
		}
		return searchCriteria;
	}

	/**
	 * AND検索を行います。
	 * @param {string} str
	 * @param {SearchCriteria} word
	 * @returns {boolean}
	 */
	static andSearch(str, word)
	{
		return this.minusSearch(str, word.minus) && word.plus.every(plus => str.includes(plus));
	}

	/**
	 * マイナス検索を行います。
	 * @param {string} str
	 * @param {string[]} minusWord
	 * @returns {boolean} str に minusWord のどの文字列も含まれていなければ真。
	 */
	static minusSearch(str, minusWord)
	{
		return !minusWord.some(minus => str.includes(minus));
	}

	/**
	 * 検索語句が含まれる位置を取得します。
	 * @param {string} data
	 * @param {(SearchCriteria|SearchCriteria[])} searchCriteria
	 * @returns {(number[])[]} [先頭のオフセット, 末尾のオフセット] の配列。重なる部分は一つにまとめます。
	 */
	static getMatches(data, searchCriteria)
	{
		const words = Array.isArray(searchCriteria)
			? searchCriteria.reduce((words, searchCriteria) => words.concat(searchCriteria.plus), [])
			: searchCriteria.plus;

		const unified = Normalizer.unifyCases(data);
		const offsets = [];
		for (const word of words) {
			const index = unified.indexOf(word);
			if (index !== -1) {
				offsets.push([index, index + word.length]);
			}
		}

		// ソート
		offsets.sort((a, b) => a[0] - b[0]);

		// 位置が重なっていたら一つにまとめる
		for (let i = 0, l = offsets.length; i < l; i++) {
			if (offsets[i + 1] && offsets[i][1] >= offsets[i + 1][0]) {
				// 次の位置のペアが存在し、現在のペアの終了位置が次のペアの開始位置以上であれば
				// 現在のペアの終了位置を次のペアの終了位置に
				offsets[i][1] = offsets[i + 1][1];
				// 次のペアを削除
				offsets.splice(i + 1, 1);
				// 次の次のペアと重なっているかも確認
				i--;
			}
		}

		return offsets;
	}

	/**
	 * 指定された箇所の範囲を作成します。
	 * @param {Text} text
	 * @param {(number[])[]} offsets - 重なる部分が無い [先頭のオフセット, 末尾のオフセット] の配列。
	 * @returns {(Range[]|Text)}
	 */
	static convertOffsetsToRanges(text, offsets)
	{
		return offsets.map(function (offset) {
			const range = new Range();
			range.setStart(text, offset[0]);
			range.setEnd(text, offset[1]);
			return range;
		});
	}

	/**
	 * 指定された部分を括弧で囲みます。
	 * @param {string} data
	 * @param {(number[])[]} offsets - 昇順に並んでいる、重なる部分が無い [先頭のオフセット, 末尾のオフセット] の配列。
	 * @returns {string}
	 */
	static markMatchesAsPlainText(data, offsets)
	{
		return offsets.concat().reverse().reduce(function (data, offset) {
			return data.slice(0, offset[0])
				+ _(' ❰❰%s❱❱ ').replace('%s', data.slice(offset[0], offset[1]))
				+ data.slice(offset[1]);
		}, data);
	}

	/**
	 * 指定された範囲が含まれるようにTextノードを切り出します。
	 * @param {Text} text
	 * @param {(number[])[]} offsets - 昇順に並んでいる、重なる部分が無い [先頭のオフセット, 末尾のオフセット] の配列。
	 * @param {number} maxLength - 表示する最大の符号単位数。切り取ったときにサロゲートペアが壊れるようであれば、1、2文字増やします。
	 * @param {number} beforeLength - 一致箇所より前に表示する符号単位数。切り取ったときにサロゲートペアが壊れるようであれば、1文字増やします。
	 * @returns {string[]} 先頭が切り取られていれば「ellipsis-left」、末尾が切り取られていれば「ellipsis-right」を含む配列。
	 */
	static extractTextNode(text, offsets, maxLength, beforeLength)
	{
		/**
		 * 切り取り範囲。
		 * @type {Range[]}
		 */
		const trimRanges = [];

		/**
		 * 切り取る前の文字列。
		 * @type {number}
		 */
		const data = text.data;

		/**
		 * 切り取る前の文字列の符号単位数。
		 * @type {number}
		 */
		const dataLength = text.length;

		/**
		 * 戻り値。
		 * @type {string[]}
		 */
		const classes = [];

		/**
		 * 表示する部分の終了位置。
		 * @type {number}
		 */
		let viewEndOffset;

		if (offsets.length > 0) {
			// 検索語句が一致する箇所があれば
			/**
			 * 表示する部分の開始位置。
			 * @type {number}
			 */
			let viewStartOffset;

			if (offsets[offsets.length - 1][1] <= maxLength) {
				// 先頭から制限文字数の範囲内にマーク位置がすべて含まれていれば
				viewStartOffset = 0;
				viewEndOffset = maxLength;
			} else {
				viewStartOffset = offsets[0][0] - beforeLength;
				viewEndOffset = viewStartOffset + maxLength;
				if (viewStartOffset < 0) {
					// 表示する部分の開始位置が先頭を超えていれば
					viewStartOffset = 0;
				}
				if (viewEndOffset >= dataLength) {
					// 表示する部分の終了位置が末尾を超えていれば
					// 終了位置を末尾に
					viewEndOffset = dataLength;
					// 開始位置を終了位置から最大文字数分引いた位置に
					viewStartOffset = viewEndOffset - maxLength;
				}
			}

			if (viewStartOffset > 0) {
				// 表示部分の開始位置が先頭より後ろなら
				const charCode = data.charCodeAt(viewStartOffset);
				if (0xDC00 <= charCode && charCode <= 0xDFFF) {
					// 表示部分の先頭文字が下位サロゲートであれば
					viewStartOffset--;
				}
				if (viewStartOffset > 0) {
					const range = new Range();
					range.setStart(text, 0);
					range.setEnd(text, viewStartOffset);
					trimRanges.push(range);
					classes.push('ellipsis-left');
				}
			}
		} else {
			viewEndOffset = maxLength;
		}

		if (viewEndOffset < dataLength) {
			// 表示部分の終了位置が末尾より前なら
			const charCode = data.charCodeAt(viewEndOffset - 1);
			if (0xD800 <= charCode && charCode <= 0xDBFF) {
				// 表示部分の末尾文字が上位サロゲートであれば
				viewEndOffset++;
			}
			if (viewEndOffset < dataLength) {
				const range = new Range();
				range.setStart(text, viewEndOffset);
				range.setEnd(text, dataLength);
				trimRanges.push(range);
				classes.push('ellipsis-right');
			}
		}

		// 切り取る
		for (const range of trimRanges) {
			range.deleteContents();
		}

		return classes;
	}
}



/**
 * メインの処理を行うユーティリティークラス。
 */
class Alert
{
	/**
	 * ページタイトル、ブラウジングコンテキスト名、ユーザースクリプトのコマンド名に用いる文字列。
	 * @constant {string}
	 */
	static get NAME() {return _('ニコ生アラート (簡)');}

	/**
	 * {@link UserSettings.setLargeString} や URL に用いる文字列。
	 * @constant {string}
	 */
	static get ID() {return 'alert-keyword-347021';}

	/**
	 * ページのFaviconに用いるデータURL。
	 * @constant {string}
	 */
	static get ICON() {return 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvb2//b29v/29vb/9vb2//b29v/29vb/9vb2//b29v/29vb/9vb2//AAAAAAAAAAAAAAAAAAAAAAAAAABvb2//2drc/9na3P///////////42Hsv+Nh7L////////////Z2tz/2drc/29vb/8AAAAAAAAAAAAAAABvb2//qqqq/////////////////42Hsv/EufX/xLn1/42Hsv///////////9na3P+qqqr/b29v/wAAAABvb2//jYey///////EufX///////////+Nh7L//////8S59f+Nh7L////////////EufX/2drc/42Hsv9vb2//b29v/8S59f///////////xUYI////////////42Hsv+Nh7L///////////8VGCP//////9na3P/EufX/b29v/29vb//EufX///////////8VGCP/////////////////////////////////FRgj///////Z2tz/xLn1/29vb/8AAAAAb29v/9na3P//////////////////////////////////////////////////////2drc/29vb/8AAAAAAAAAAAAAAABvb2//b29v/9na3P/////////////////////////////////Z2tz/b29v/29vb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvb2//b29v/9na3P/Z2tz/2drc/9na3P9vb2//b29v/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvb2//APD//w1qdv9vb2//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG9vb/8Nanb/BMbU/w1qdv8Nanb/APD//w1qdv9vb2//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvb2//BMbU/wDw//8ExtT/DWp2/wTG1P8A8P//b29v/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG9vb/8Nanb/b29v/29vb/8Nanb/b29v/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb29v/9na3P+/wMP/b29v/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG9vb///////2drc/29vb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb29v/29vb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AcAAMADAACAAQAAAAAAAAAAAAAAAAAAgAEAAMADAADwDwAA/D8AAPAPAADwDwAA+B8AAPw/AAD8PwAA/n8AAA==';}

	/**
	 * 初期化します。
	 */
	static initialize()
	{
		// 各サービスのインスタンスにイベントリスナーを設定
		for (const service of this.services) {
			service.addEventListener('progress', this.onprogress);
			service.addEventListener('load', this.onload.bind(this));
			service.addEventListener('error', this.onerror);
		}

		// Faviconの設定
		this.favico = new Favico({
			animation: 'none',
			position : 'up',
		});
	}

	/**
	 * @access private
	 * @param {Service#ProgramEvent} event
	 */
	static onprogress(event)
	{
		const program = event.detail;
		if (!program.private || !document.getElementsByName('exclusionMemberOnly')[0].checked) {
			// プライベート配信で無い、またはプライベート配信を拒否していなければ
			const urls = [program.link];
			if (program.author && program.author.url) {
				urls.push(program.author.url);
			}
			if (program.community && program.community.url) {
				urls.push(program.community.url);
			}
			if (urls.every(url => UserSettings.exclusions.indexOf(url) === -1)) {
				// 除外リストに含まれていなければ
				// 一覧に追加
				TableProcessor.insertProgram(program, urls);

				// アラート音を鳴らす
				const alertTone = document.getElementById('alert-tone');
				if (!alertTone.hidden && !alertTone.muted && alertTone.volume > 0) {
					alertTone.play();
				}
			}
		}
	}

	/**
	 * @access private
	 * @param {Service#LoadedEvent} event
	 */
	static onload(event)
	{
		// 配信終了の番組を削除
		TableProcessor.removeOldPrograms(event.detail.service, event.detail.programs, event.detail.searchCriteria);

		// 最終更新日時を設定
		UserSettings.showLatestUpdatedDate(event.target);

		// ヒット数の更新
		this.showHits();
	}

	/**
	 * ヒット数を更新します。
	 */
	static showHits()
	{
		const tBody = document.querySelector('#programs tbody');

		/**
		 * ヒット数。
		 * @type {number}
		 */
		const hits = tBody.rows.length;

		// ページタイトルの修正
		document.title = (hits > 0 ? `(${hits})` : '') + Alert.NAME;

		// Faviconの修正
		this.favico.badge(hits);

		// 行の色分けの調整
		if (hits % 2 === 0) {
			tBody.classList.remove('odd');
		} else {
			tBody.classList.add('odd');
		}
	}

	/**
	 * スクリプトが停止している状態であれば起動し、動作している状態であればOR検索ができないサービスを再読み込みします。
	 * 検索語句が空の場合は、スクリプトを停止します。
	 */
	static restart()
	{
		if (UserSettings.words.length === 0) {
			// 検索語句が空であれば
			this.stop();
		} else if (this.run) {
			// スクリプトが動作している状態であれば
			for (const service of this.services) {
				if (service.disabledOr) {
					service.reset();
				}
			}
		} else {
			// スクリプトが停止している状態であれば
			// 有効なサービスで検索を開始
			/**
			 * スクリプトが動作している状態であれば真。
			 * @access private
			 * @type {boolean}
			 */
			this.run = true;
			const enabledServices = UserSettings.getTargetServices();
			for (const service of this.services) {
				if (enabledServices.indexOf(service.id) !== -1) {
					service.start();
				}
			}
		}
	}

	/**
	 * スクリプトを停止します。
	 */
	static stop()
	{
		if (this.run) {
			// スクリプトが動作している状態であれば、すべてのサービスで検索を停止
			this.run = false;
			for (const service of this.services) {
				service.stop();
			}
		}
	}

	/**
	 * 指定されたサービスを有効化します。
	 * @param {string} id
	 */
	static enableService(id)
	{
		if (this.run) {
			this.services.find(service => service.id === id).start();
		}
	}

	/**
	 * 指定されたサービスを無効化します。
	 * @param {string} id
	 */
	static disableService(id)
	{
		if (this.run) {
			const service = this.services.find(service => service.id === id);
			service.stop();
			TableProcessor.removeProgramsWithService(service);
		}
	}
}

/**
 * AND検索を行う検索語句。
 * @typedef {Object} SearchCriteria
 * @property {string} plus - AND検索を行うキーワード。
 * @property {string} minus - マイナス検索を行うキーワード。
 */

/**
 * 検索語句にヒットする番組が見つかったとき。
 * @event Service#ProgramEvent
 * @type {CustomEvent}
 * @property {string} type - 「progress」を返す。
 * @property {Program} detail - ライブ配信番組。
 */

/**
 * 最後のページを取得し終えたとき。OR検索できないサービスの場合は、一度の検索で複数回送出される。
 * @event Service#LoadedEvent:load
 * @type {CustomEvent}
 * @property {string} type - 「load」を返す。
 * @property {Object} detail
 * @property {Service} detail.service - 対象のサービス。
 * @property {Program[]} detail.programs - 今回の検索でヒットしたライブ配信番組。OR検索できないサービスの場合は、一つの検索条件にヒットした番組のみ。
 * @property {SearchCriteria} [detail.searchCriteria] - OR検索ができないサービスにおいて、対象の検索条件。
 */

/**
 * 配信の取得に必要な情報を返す。
 * @callback getDetails
 * @param {(SearchCriteria|SearchCriteria[])} [words] - OR検索が可能なら配列となる。
 * @return {HTTPRequestInit}
 */

/**
 * 取得した情報から番組を取り出す。
 * @callback parseResponse
 * @param {(Object|string)} response
 * @param {HTTPRequestInit} details
 * @param {SearchCriteria[]} [words]
 * @return {(Programs|Error)} 取得に失敗している場合は例外を返す。
 */

/**
 * 取得した番組の一覧。
 * @typedef {Object} Programs
 * @property {(Object[]|NodeList|HTMLCollection)} programs - サイト独自形式の番組情報の配列。
 * @property {HTTPRequestInit} [next] - 結果が複数ページにわたる場合に、次のページが存在すれば指定。
 */

/**
 * サイト独自形式の番組情報を {@link Program} に変換する関数。
 * @callback convertIntoEntry
 * @property {Object} programs - サイト独自形式の番組情報。
 * @returns {Program}
 */

/**
 * ライブ配信サービス。
 * @augments EventTarget
 */
class Service
{
	/**
	 * タイムアウトミリ秒数。
	 * @constant {number}
	 */
	static get TIMEOUT() {return 10 * DateUtils.SECONDS_TO_MILISECONDS;}

	/**
	 * メンテナンス中など、サーバー側のエラーが発生した場合に再度取得する間隔。ミリ秒。
	 * @constant {number}
	 */
	static get RETRY_DELAY() {return 15 * DateUtils.MINUTES_TO_MILISECONDS;}

	/**
	 * @param {Object} details
	 * @param {string} details.id - サービスを識別するID。
	 * @param {string} details.name - サイト名。
	 * @param {string} details.url - サイトのURL。
	 * @param {string} [details.icon] - サイトアイコンのURL。サイトのURLがホストとスラッシュで終わり、アイコンが /favicon.ico に配置されている場合は省略可。
	 * @param {getDetails} details.getDetails - 番組の取得に必要な情報を返す。
	 * @param {parseResponse} details.parseResponse - 取得した情報から番組を取り出す。
	 * @param {boolean} [details.disabledSearch] - 全件取得が可能な (検索ができない) サービスなら真。
	 * @param {boolean} [details.disabledOr] - OR検索ができないサービスなら真。
	 * @param {boolean} [details.disabledMinus] - マイナス検索ができないサービスなら真。
	 * @param {boolean} [details.disabledLanguageFilter] - 言語の絞り込み検索ができないサービスなら真。
	 * @param {convertIntoEntry} details.convertIntoEntry - 第1引数のサイト独自形式の番組情報を {@link Program} に変換する関数。
	 * @param {number} [details.delay=360000] - 情報を取得する間隔。ミリ秒。OR検索できないサービスの場合、各単語の検索間隔。既定値は6分。
	 * @param {number} [details.pagingDelay=10000] - 結果が複数ページにわたる場合に、次のページを取得するまでの間隔。ミリ秒。既定値は10秒。
	 */
	constructor(details)
	{
		/**
		 * サービスを識別するID。
		 * @type {string}
		 * @readonly
		 */
		this.id = details.id;

		/**
		 * サイト名。
		 * @type {string}
		 * @readonly
		 */
		this.name = details.name;

		/**
		 * サイトのURL。
		 * @type {string}
		 * @readonly
		 */
		this.url = details.url;

		/**
		 * サイトアイコンのURL。
		 * @type {string}
		 * @readonly
		 */
		this.icon = details.icon || details.url + 'favicon.ico';

		/**
		 * OR検索ができないサービスについて、検索語句の0から始まるインデックス。
		 * @type {number}
		 * @access private
		 */
		this.wordIndex = 0;

		/**
		 * 検索対象のサービスなら真。
		 * @type {boolean}
		 * @access private
		 */
		this.enabled = false;

		/**
		 * abort() メソッドを持つオブジェクト。
		 * @type {HTTPRequest}
		 * @access private
		 */
		this.request;

		/**
		 * タイマーID。
		 * @type {number}
		 * @access private
		 */
		this.timer;

		/**
		 * 現在の検索で取得した番組。
		 * @type {Program[]}
		 * @access private
		 */
		this.currentPrograms = [];

		/**
		 * OR検索できないサービスなら真。
		 * @type {boolean}
		 */
		this.disabledOr = details.disabledOr;

		/**
		 * {@link Service#getHitPrograms}で使用する情報。
		 * @access private
		 * @type {Object}
		 */
		this.details = details;

		// EventTargetの疑似継承
		// <https://stackoverflow.com/a/24216547>
		const eventTarget = new DocumentFragment();
		for (const key in this) {
			eventTarget[key] = typeof this[key] === 'function' ? this[key].bind(this) : this[key];
		}
		for (const methodName of ['addEventListener', 'removeEventListener', 'dispatchEvent']) {
			this[methodName] = eventTarget[methodName].bind(eventTarget);
		}
	}

	/**
	 * 検索を開始します。
	 */
	start()
	{
		if (!this.enabled) {
			// 検索が無効であれば
			this.enabled = true;
			this.getHitPrograms();
		}
	}

	/**
	 * 検索を停止します。
	 */
	stop()
	{
		this.enabled = false;
		if (this.request) {
			this.request.abort();
		}
		window.clearTimeout(this.timer);
	}

	/**
	 * 検索語句を読み込み直して最初から検索しなおします。
	 */
	reset()
	{
		if (this.disabledOr) {
			this.wordIndex = 0;
			TableProcessor.removeProgramsWithService(this);
		}
	}

	/**
	 * 情報を取得する間隔の既定値。ミリ秒。
	 * @access private
	 * @constant {number}
	 */
	static get DEFAULT_DELAY() {return 6 * DateUtils.MINUTES_TO_MILISECONDS;}

	/**
	 * 結果が複数ページにわたる場合に、次のページを取得するまでの間隔の既定値。ミリ秒。
	 * @access private
	 * @constant {number}
	 */
	static get DEFAULT_PAGING_DELAY() {return 1 * DateUtils.SECONDS_TO_MILISECONDS;}

	/**
	 * 検索ワードにヒットした番組を繰り返し取得します。
	 * @access private
	 * @param {HTTPRequestInit} [nextSearchInit] - 次のページの取得に必要な情報。
	 * @fires Service#ProgramEvent:progress
	 * @fires Service#LoadedEvent:load
	 */
	getHitPrograms(nextSearchInit)
	{
		if (this.enabled) {
			/**
			 * 現在の検索ワード。接続前と取得完了時の検索ワードの変化を防ぎます。
			 * @type {SearchCriteria[]}
			 */
			const words = UserSettings.words;

			const searchInit = nextSearchInit
				|| this.details.getDetails(this.details.disabledOr ? words[this.wordIndex] : words);
			searchInit.timeout = Service.TIMEOUT;
			this.request = new HTTPRequest(searchInit);

			this.request.send().then(response => {
				const programs = this.details.parseResponse(response, searchInit, words);
				if (programs instanceof Error) {
					return Promise.reject(programs);
				}

				// 番組情報の取得に成功していれば
				for (const program of Array.from(programs.programs)) {
					const entry = this.details.convertIntoEntry(program);
					entry.service = this;
					if (this.details.disabledOr) {
						// OR検索ができないサービスなら
						entry.searchCriteria = words[this.wordIndex];
					}

					// 検索条件に一致する番組か確認
					if (entry.searchCriteria) {
						// OR検索ができないサービス、またはOR検索が可能でヒットした番組に対応する検索条件を取得可能なサービスなら
						if (!WordProcessor.andSearch(entry.getSearchTarget(), entry.searchCriteria)) {
							delete entry.searchCriteria;
						}
					} else {
						// 全件取得が可能なサービス、またはOR検索が可能なサービスなら
						entry.searchCriteria = WordProcessor.orSearch(entry.getSearchTarget(), words);
					}

					if (entry.searchCriteria && !(document.getElementsByName('languageFilter')[0].checked
						&& this.details.disabledLanguageFilter
						&& window.navigator.language.split('-')[0] !== entry.language.split('-')[0])) {
						// 検索条件に一致する番組、かつ言語が一致する番組なら
						entry.service = this;
						this.currentPrograms.push(entry);
						this.dispatchEvent(new CustomEvent('progress', { detail: entry }));
					}
				}

				if (programs.next) {
					// 次のページが存在すれば
					this.timer = window.setTimeout(
						this.getHitPrograms.bind(this),
						this.details.pagingDelay || Service.DEFAULT_PAGING_DELAY,
						programs.next
					);
				} else {
					// 取得完了
					this.dispatchEvent(new CustomEvent('load', { detail: {
						service: this,
						programs: this.currentPrograms,
						searchCriteria: this.details.disabledOr ? words[this.wordIndex] : null,
					}}));
					this.currentPrograms = [];

					if (this.details.disabledOr) {
						// OR検索ができないサービスなら
						this.wordIndex++;
						if (!UserSettings.words[this.wordIndex]) {
							// 次の検索語句が存在しなければ
							this.wordIndex = 0;
						}
					}

					this.timer = window.setTimeout(
						this.getHitPrograms.bind(this),
						this.details.delay || Service.DEFAULT_DELAY
					);
				}
			}).catch(error => {
				// 番組情報の取得に失敗していれば
				if (!(error instanceof AbortException)) {
					// 意図的な停止による例外でなければ
					console.error(error);
					UserSettings.showLatestError(this, error);
					// 一定時間後に最初から検索をやり直す
					this.timer = window.setTimeout(
						this.getHitPrograms.bind(this),
						error instanceof NetworkException
							? this.details.delay || Service.DEFAULT_DELAY
							: Service.RETRY_DELAY
					);
				}
			});
		}
	}
}

/**
 * 配信者、またはコミュニティ。
 * @typedef {Object} Person
 * @property {string} name - 名前。
 * @property {string} [url] - URL。
 */

/**
 * 1つのライブ配信番組。
 */
class Program
{
	/**
	 * @param {string} link - 配信のURL。
	 * @param {string} title - 配信のタイトル。
	 * @param {Object} otherDetails
	 * @param {string} [otherDetails.icon] - コミュニティやチャンネルなどのアイコンのURL。取得できなければユーザーのアイコンのURL。それも取得できなければ配信のアイコンのURL。
	 * @param {boolean} [otherDetails.private] - プライベート配信であれば真。
	 * @param {Date} [otherDetails.published] - 配信開始日時。
	 * @param {Person} [otherDetails.author] - 配信者。
	 * @param {string[]} [otherDetails.categories] - 配信のタグ。カテゴリを含みます。
	 * @param {string} [otherDetails.summary] - 配信の説明文。
	 * @param {number} [otherDetails.visitors] - 累計視聴者数。取得できなければ最高同時視聴者数。それも取得できなければ現在の視聴者数。
	 * @param {number} [otherDetails.comments] - コメントの数。
	 * @param {Person} [otherDetails.community] - コミュニティやチャンネルなど。
	 * @param {string} [otherDetails.language] - 言語。
	 * @param {SearchCriteria} [searchCriteria] - 検索条件。
	 */
	constructor(link, title, otherDetails, searchCriteria)
	{
		this.link = link;
		this.title = Normalizer.normalize(title);
		for (const key in otherDetails) {
			let value = otherDetails[key];
			if (value !== undefined && value !== null) {
				switch (key) {
					case 'categories':
						value = value.map(Normalizer.normalize);
						break;
					case 'summary':
						value = Normalizer.normalize(value);
						break;
					case 'community':
						value.name = Normalizer.normalize(value.name);
						break;
				}
				this[key] = value;
			}
		}
		this.searchCriteria = searchCriteria;

		/**
		 * @type {Service}
		 */
		this.service;
	}

	/**
	 * 検索対象を取得します。
	 * @returns {string} 文字種を統一した文字列。
	 */
	getSearchTarget()
	{
		let target = [this.title];
		if (this.categories) {
			target = target.concat(this.categories);
		}
		if (this.summary) {
			target.push(this.summary);
		}
		if (this.community) {
			target.push(this.community.name);
		}
		return Normalizer.unifyCases(target.join(' '));
	}
}

/**
 * ライブ配信番組を表示する表に関する処理を行うユーティリティークラス。
 */
const TableProcessor = {
	/**
	 * 経過時間を更新する間隔。ミリ秒数。
	 * @type {number}
	 */
	DURATION_UPDATING_INTERVAL: 20 * DateUtils.SECONDS_TO_MILISECONDS,

	/**
	 * 現在時刻から指定した時刻を引いた差を返します。
	 * @param {Date} value
	 * @returns {Object.<string>} dateTimeプロパティに ISO 8601 形式の文字列 (負になる場合は「PT0S」)、textプロパティに「○時間○分」のような形式の文字列。
	 */
	getDuration: function (value) {
		const milliseconds = Date.now() - value.getTime();
		let minutes = Math.round(milliseconds / DateUtils.MINUTES_TO_MILISECONDS);
		const sign = minutes >= 0 ? 1 : -1;
		minutes = Math.abs(minutes);
		const hours = Math.floor(minutes / 60);
		minutes = minutes % 60;
		return {
			dateTime: `PT${sign === -1 ? 0 : milliseconds / DateUtils.SECONDS_TO_MILISECONDS}S`,
			text: hours
				? _('%d 時間 %u 分').replace('%d', sign * hours).replace('%u', minutes)
				: _('%d 分').replace('%d', sign * minutes),
		};
	},

	/**
	 * 経過時間の更新を開始します。
	 */
	startUpdatingDurations: function () {
		for (const duration of document.querySelectorAll(
			'[itemtype="http://schema.org/VideoObject"] [itemprop="duration"]:not([hidden])'
		)) {
			const serialized = this.getDuration(new Date(duration.dataset.start));
			duration.dateTime = serialized.dateTime;
			duration.textContent = serialized.text;
		}
		window.setTimeout(this.startUpdatingDurations.bind(this), this.DURATION_UPDATING_INTERVAL);
	},

	/**
	 * プライベート番組を表から取り除きます。
	 */
	removePrivatePrograms: function () {
		for (const requiresSubscription of document.querySelectorAll(
			'[itemtype="http://schema.org/VideoObject"] [itemprop="requiresSubscription"][value="true"]'
		)) {
			requiresSubscription.closest('[itemscope]').remove();
		}
		Alert.showHits();
	},

	/**
	 * 指定されたサービスの番組を表から取り除きます。
	 * @param {Service} service
	 */
	removeProgramsWithService: function (service) {
		for (const row of this.getProgramsWithService(service)) {
			row.remove();
		}
		Alert.showHits();
	},

	/**
	 * 指定されたサービスの番組を取得します。
	 * @param {Service} service
	 * @param {SearchCriteria} [searchCriteria] - OR検索ができないサービスにおいて、対象の検索条件。
	 * @returns {HTMLRowElement[]}
	 */
	getProgramsWithService: function (service, searchCriteria) {
		return Array.from(document.querySelectorAll(
			'[itemtype="http://schema.org/VideoObject"]'
				+ ' [itemprop="provider"]'
					+ (searchCriteria ? `[data-search-criteria="${CSS.escape(JSON.stringify(searchCriteria))}"]` : '')
				+ ` [itemprop="url"][href="${service.url}"]`
		)).map(providerURL => providerURL.closest('[itemtype="http://schema.org/VideoObject"]'));
	},

	/**
	 * 除外対象の番組を表から取り除きます。
	 */
	removeExclusions: function () {
		for (const urlProperty of document.querySelectorAll(
			'[itemtype="http://schema.org/VideoObject"] [itemprop="url"],'
				+ '[itemtype="http://schema.org/VideoObject"] [itemprop="workLocation"]'
		)) {
			if (UserSettings.exclusions.indexOf(urlProperty.href) !== -1) {
				const row = urlProperty.closest('[itemtype="http://schema.org/VideoObject"]');
				if (row.parentElement) {
					row.remove();
				}
			}
		}
		Alert.showHits();
	},

	/**
	 * 以前に取得した番組を表から取り除きます。
	 * @param {Service} service - 対象のサービス。
	 * @param {Program[]} currentPrograms - 今回取得した番組。
	 * @param {SearchCriteria} [searchCriteria] - OR検索ができないサービスにおいて、対象の検索条件。
	 */
	removeOldPrograms: function (service, currentPrograms, searchCriteria) {
		const urls = currentPrograms.map(program => program.link);
		for (const row of this.getProgramsWithService(service, searchCriteria)) {
			if (urls.indexOf(row.querySelector('td > [itemprop="url"]').href) === -1) {
				row.remove();
			}
		}
	},

	/**
	 * 指定された番組を表に追加します。
	 * @param {Program} program
	 * @param {string[]} urls - 番組、ユーザー、コミュニティのURL。
	 */
	insertProgram: function (program, urls) {
		const table = document.getElementById('programs');
		const anchor = table.querySelector(urls.map(url => `[href="${CSS.escape(program.link)}"]`).join(','));
		let previousRow;
		if (anchor) {
			// すでに同じ番組、または同じユーザーの番組、同じコミュニティの番組が追加されていれば
			previousRow = anchor.closest('[itemtype="http://schema.org/VideoObject"]');
		}

		const row = this.convertProgramToRow(program, previousRow);
		const tBody = table.tBodies[0];
		tBody.insertBefore(row, tBody.rows[this.getInsertPosition(table, row)]);
	},

	/**
	 * 指定された番組を表すtr要素を返します。
	 * @param {Program} program
	 * @param {HTMLTableRowElement} [previousRow] - 指定されていれば、その行を更新します。
	 * @returns {HTMLTableRowElement}
	 */
	convertProgramToRow: function (program, previousRow) {
		const row
			= previousRow || document.querySelector('#programs template').content.firstElementChild.cloneNode(true);

		// サービス
		if (!previousRow) {
			const provider = row.querySelector('[itemprop="provider"]');
			provider.querySelector('[itemprop="name"]').value = program.service.name;
			provider.querySelector('[itemprop="url"]').href = program.service.url;
			const logo = provider.querySelector('[itemprop="logo"]');
			logo.src = program.service.icon;
			logo.alt = program.service.name;
			logo.title = program.service.name;
			if (program.service.disabledOr) {
				provider.dataset.searchCriteria = JSON.stringify(program.searchCriteria);
			}
		}

		// アイコン
		const image = row.querySelector('[itemprop="image"]');
		if (program.icon) {
			if (!previousRow || program.icon !== image.src) {
				image.src = program.icon;
				image.hidden = false;
			}
		} else {
			image.hidden = true;
		}

		// コミュ限
		const requiresSubscription = row.querySelector('[itemprop="requiresSubscription"]');
		if (program.private) {
			if (!previousRow || requiresSubscription.value === 'false') {
				requiresSubscription.value = 'true';
				requiresSubscription.textContent = _('限定公開');
			}
		} else {
			if (previousRow && requiresSubscription.value === 'true') {
				requiresSubscription.value = 'false';
				requiresSubscription.textContent = '';
			}
		}

		// 経過時間
		const duration = row.querySelector('[itemprop="duration"]');
		if (program.published) {
			if (!previousRow || program.published.toISOString() !== duration.dataset.start) {
				const serialized = this.getDuration(program.published);
				duration.dateTime = serialized.dateTime;
				duration.textContent = serialized.text;
				duration.dataset.start = program.published.toISOString();
				duration.hidden = false;
			}
		}

		// タイトル
		const name = row.querySelector('td:not([itemprop="provider"]) > [itemprop="name"]');
		if (!previousRow || program.title !== name.value) {
			name.value = program.title;
			this.setMarkedText(name.firstElementChild, program.title, program.searchCriteria || UserSettings.words);
		}

		// タグ
		const keywords = row.querySelector('[itemprop="keywords"]');
		const tags = program.categories ? program.categories.join(',') : '';
		if (tags !== keywords.value) {
			keywords.value = tags;
			this.setMarkedText(
				keywords,
				program.categories ? program.categories.join(' ') : '',
				program.searchCriteria || UserSettings.words
			);
		}

		// 配信者
		const author = row.querySelector('[itemprop="author"]');
		if (program.author) {
			const name = author.querySelector('[itemprop="name"]');
			const workLocation = author.querySelector('[itemprop="workLocation"]');
			if (!previousRow || program.author.name !== name.value
				|| program.author.url && program.author.url !== workLocation.href) {
				name.value = program.author.name;
				this.setMarkedText(workLocation, program.author.name);
				if (program.author.url) {
					workLocation.href = program.author.url;
				}
			}
		}

		// 説明文
		const description = row.querySelector('[itemprop="description"]');
		if (program.summary && !(previousRow && program.summary === description.value)) {
			description.value = program.summary;
			this.setMarkedText(description, program.summary, program.searchCriteria || UserSettings.words);
		}

		// 累計来場者数
		const userInteractionCount = row.querySelector('[itemprop="userInteractionCount"]');
		if (typeof program.visitors === 'number') {
			userInteractionCount.value = program.visitors;
			userInteractionCount.textContent = _('%d 人').replace('%d', program.visitors);
		}

		// コメント数
		const commentCount = row.querySelector('[itemprop="commentCount"]');
		if (typeof program.comments === 'number') {
			commentCount.value = program.comments;
			commentCount.textContent = _('%d コメ').replace('%d', program.comments);
		}

		// コミュニティ
		const productionCompany = row.querySelector('[itemprop="productionCompany"]');
		if (program.community) {
			productionCompany.querySelector('[itemprop="name"]').value = program.community.name;
			const url = productionCompany.querySelector('[itemprop="url"]');
			this.setMarkedText(url, program.community.name, program.searchCriteria || UserSettings.words);
			if (program.community.url) {
				url.href = program.community.url;
			}
		}

		// リンク
		for (const url of row.querySelectorAll(
			'td > [itemprop="url"], td:not([itemscope]) > [itemprop="name"] > [itemprop="url"]'
		)) {
			url.href = program.link;
		}

		return row;
	},

	/**
	 * 検索対象だった文字列を記入します。
	 * @param {HTMLElement} target
	 * @param {string} str
	 * @param {(SearchCriteria|SearchCriteria[])} [searchCriteria] - 検索対象の項目でない (文字数制限のみを行う) 場合は省略。
	 */
	setMarkedText: function (target, str, searchCriteria) {
		/**
		 * 昇順に並んでいる、重なる部分が無い [先頭のオフセット, 末尾のオフセット] の配列。
		 * @type {(number[])[]}
		 */
		const offsets = searchCriteria ? WordProcessor.getMatches(str, searchCriteria) : [];

		/**
		 * 挿入するTextノード。
		 * @type {Text}
		 */
		const text = new Text(str);

		/**
		 * mark要素に内包する範囲。
		 * @type {Range[]}
		 */
		const ranges = WordProcessor.convertOffsetsToRanges(text, offsets);

		if (str.length > UserSettings.MAX_VISIBLE_CHARACTERS
			&& document.getElementsByName('ellipsisTooLongRSSData')[0].checked) {
			// 文字数が制限を超えており、表示文字数の制限が有効なら
			target.classList.add(...WordProcessor.extractTextNode(
				text,
				offsets,
				UserSettings.MAX_VISIBLE_CHARACTERS,
				UserSettings.MAX_BEFORE_CHARACTERS)
			);
			const title = WordProcessor.markMatchesAsPlainText(str, offsets);
			if (/\(Windows .+ Chrome\/(?!.+Edge\/)/.test(navigator.userAgent)) {
				// Windows 版の Opera、Google Chrome におけるフリーズの回避
				target.dataset.title = title;
			} else {
				target.title = title;
			}
		} else {
			delete target.dataset.title;
			target.removeAttribute('title');
		}

		while (target.hasChildNodes()) {
			target.firstChild.remove();
		}
		target.append(text);
		for (const range of ranges) {
			range.surroundContents(document.createElement('mark'));
		}
	},

	/**
	 * 指定された列をキーに行を並べ替えます。
	 * @param {HTMLTableHeaderCellElement} th
	 */
	sort: function (th) {
		const table = th.closest('table');

		/**
		 * すでに並び替えられている列。
		 * @type {HTMLTableHeaderCellElement}
		 */
		const sortedTH = th.parentElement.querySelector('[data-sorted]');

		// 行リストを配列化
		const tBody = table.tBodies[0];
		const rows = Array.from(tBody.rows);

		if (sortedTH === th) {
			// 選択された列が、すでに並べ替えられている列なら
			// data-sorted属性の設定
			sortedTH.dataset.sorted = sortedTH.dataset.sorted === 'asc' ? 'desc' : 'asc';
			// 並び順を反転
			rows.reverse();
		} else {
			// 他の列のsorted属性を削除
			sortedTH.removeAttribute('data-sorted');

			// sorted属性の設定
			th.dataset.sorted = 'asc';

			// 昇順に並び替え
			rows.sort((a, b) => this.compareRows(th, a, b));
		}

		// 画面に反映
		tBody.removeAttribute('aria-live');
		tBody.append(...rows);
		window.setTimeout(function () {
			tBody.setAttribute('aria-live', 'polite');
		}, 0);

		// 並び順を保存
		GM.setValue('order', JSON.stringify({name: th.id, order: th.dataset.sorted}));
	},

	/**
	 * 行の挿入位置を取得します。
	 * @param {HTMLTableElement} table
	 * @param {HTMLTableRowElement} row
	 * @returns {number} 0から始まるインデックス。
	 */
	getInsertPosition: function (table, row) {
		const insertingColumn = table.querySelector('[data-sorted]');
		const reversed = insertingColumn.dataset.sorted === 'desc';
		const rows = table.tBodies[0].rows;
		let insertPosition = rows.length;
		for (const comparisonRow of Array.from(rows)) {
			const result = this.compareRows(insertingColumn, comparisonRow, row);
			if (reversed ? result < 0 : 0 < result) {
				insertPosition = comparisonRow.sectionRowIndex;
				break;
			}
		}
		return insertPosition;
	},

	/**
	 * {@link Array#sort}の比較関数内で用いる、行と行を比較する関数
	 * @param {HTMLTableHeaderCellElement} th - キーとなるセル。
	 * @param {HTMLTableRowElement} a
	 * @param {HTMLTableRowElement} b
	 * @returns {number} a < b なら -1、a > b なら 1 を返す
	 */
	compareRows: function (th, a, b) {
		return this.getCellValue(th, a) < this.getCellValue(th, b) ? -1 : 1;
	},

	/**
	 * セルの値を取得します。
	 * @param {HTMLTableHeaderCellElement} th - キーとなるセル。
	 * @param {HTMLTableRowElement} row
	 * @returns {string}
	 */
	getCellValue: function (th, row) {
		let value;
		const cell = row.cells[th.cellIndex];
		const child = cell.firstElementChild;
		switch (child && child.localName) {
			case 'data':
				value = child.value;
				if (/^[0-9]+$/.test(value)) {
					value = Number.parseInt(value);
				}
				break;
			case 'time':
				value = DateUtils.parseDurationString(child.dateTime);
				break;
			default:
				value = cell.textContent;
		}
		return value;
	},

	/**
	 * ステータス行を除くすべての行を取得します。
	 * @param {HTMLTableElement} table
	 * @returns {HTMLTableRowElement[]}
	 * @access private
	 */
	getRows: function (table) {
		const rows = Array.from(table.querySelectorAll(':not(tfoot) > tr'));
		rows.push(table.getElementsByTagName('template')[0].content.firstElementChild);
		return rows;
	},

	/**
	 * 列 th を列 refTH の前に移動します。
	 * @param {HTMLTableHeaderCellElement} th
	 * @param {?(HTMLTableHeaderCellElement|number)} refTH - null の場合、末尾に移動します。
	 */
	moveColumn: function (th, refTH) {
		const targetIndex = th.cellIndex;
		const refIndex = typeof refTH === 'number' ? refTH : (refTH ? refTH.cellIndex : -1);
		for (const tr of this.getRows(th.closest('table'))) {
			tr.insertBefore(tr.cells[targetIndex], tr.cells[refIndex]);
		}

		// 表示する列の設定項目の並び替え
		const ul = document.getElementById('visible-columns');
		ul.insertBefore(ul.querySelector(`[value="${th.id}"]`).closest('li'), ul.children[refIndex]);
	},

	/**
	 * 列 th を隠します。
	 * @param {HTMLTableHeaderCellElement} th
	 */
	hideColumn: function (th) {
		if (th.getAttribute('aria-hidden') !== 'true') {
			const targetIndex = th.cellIndex;
			for (const tr of this.getRows(th.closest('table'))) {
				tr.cells[targetIndex].setAttribute('aria-hidden', 'true');
			}
		}
	},

	/**
	 * 列 th を表示します。
	 * @param {HTMLTableHeaderCellElement} th
	 */
	showColumn: function (th) {
		if (th.getAttribute('aria-hidden') === 'true') {
			const targetIndex = th.cellIndex;
			for (const tr of this.getRows(th.closest('table'))) {
				tr.cells[targetIndex].removeAttribute('aria-hidden');
			}
		}
	},

	/**
	 * 列の順番を取得します。
	 * @returns {string[]}
	 */
	getColumnPositions: function () {
		return Array.from(document.querySelectorAll('#programs th')).map(function (th) {
			return th.id;
		});
	},

	/**
	 * 列の移動先を示すクラス名を削除します。
	 */
	removeOldClassName: function () {
		const oldRef = document.querySelector('.inserting-before, .inserting-after');
		if (oldRef) {
			oldRef.classList.remove('inserting-before', 'inserting-after');
		}
	},

	/**
	 * 列の順番を反映します。
	 * @param {?string} version
	 * @param {string[]} columnPositions - 指定されなかった列は末尾に並びます。
	 * @returns {Promise.<void>}
	 */
	reflectColumnPositions: async function (version, columnPositions) {
		if (!version) {
			// 5.0.0 より前のバージョンの設定であれば
			columnPositions.unshift('service');
			await GM.setValue('columns-position', JSON.stringify(columnPositions));
		}

		const tBody = document.querySelector('#programs tbody');
		tBody.removeAttribute('aria-live');
		let i = 0;
		for (const column of columnPositions) {
			this.moveColumn(document.getElementById(column), i);
			i++;
		}
		window.setTimeout(function () {
			tBody.setAttribute('aria-live', 'polite');
		}, 0);
	},
};

/**
 * ユーザー設定値、およびその変更に関するメソッド、プロパティ。
 */
const UserSettings = {
	/**
	 * 省略設定が有効の時に、一項目で表示する最大の符号単位数。
	 * @constant {number}
	 */
	MAX_VISIBLE_CHARACTERS: 60,

	/**
	 * 表示を省略した際に、ヒットした文字列より前に表示する最大の符号単位数。
	 * @constant {number}
	 */
	MAX_BEFORE_CHARACTERS: 3,

	/**
	 * 検索条件。
	 * @type {SearchCriteria[]}
	 */
	words: [],

	/**
	 * 検索から除外するユーザー、コミュニティ、チャンネルのURL。exclusionsFromExternalを含む。
	 * @type {string[]}
	 */
	exclusions: [],

	/**
	 * ユーザー設定値 NGsURI から取得した検索から除外するユーザー、コミュニティ、チャンネルのURL。
	 * @type {string[]}
	 */
	exclusionsFromExternal: [],

	/**
	 * ユーザー設定値をJSONファイルにエクスポートします。
	 */
	export: async function () {
		const exportedValues = {};
		for (const key in UserSettings.schema.properties) {
			const property = UserSettings.schema.properties[key];
			let value;
			switch (property.type) {
				case 'string':
				case 'integer':
				case 'boolean':
					value = key === 'audioData' ? await UserSettings.getLargeValue(key) : await GM.getValue(key);
					break;
				case 'number':
					value = await GM.getValue(key);
					if (value !== undefined && value !== null) {
						value = Number.parseFloat(value);
					}
					break;
				case 'array':
				case 'object':
					value = await GM.getValue(key);
					if (value !== undefined && value !== null) {
						value = JSON.parse(value);
					}
					break;
			}
			if (value !== undefined && value !== null) {
				exportedValues[key] = value;
			}
		}

		document.body.insertAdjacentHTML(
			'beforeend',
			h`<a href="${window.URL.createFor(
				new Blob([JSON.stringify(exportedValues, null, '\t')],{ type: 'application/json' })
			)}" download="${Alert.ID + '.json'}" hidden=""></a>`
		);
		const anchor = document.body.lastElementChild;
		anchor.click();
		anchor.remove();
	},

	/**
	 * ファイルのインポート用に生成したinput要素を取り除くまでのミリ秒数。
	 * @constant {number}
	 */
	MAX_LIFETIME: 10 * DateUtils.MINUTES_TO_MILISECONDS,

	/**
	 * ユーザー設定値をJSONファイルからインポートします。
	 */
	import: function () {
		document.body.insertAdjacentHTML(
			'beforeend',
			h`<input type="file" accept=".json,application/json" hidden="" />`
		);
		const input = document.body.lastElementChild;

		input.addEventListener('change', function parse(event) {
			event.target.removeEventListener(event.type, parse);
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.addEventListener('load', async function (event) {
					let result;
					try {
						result = JSON.parse(event.target.result);
					} catch (error) {
						window.alert(_('インポートに失敗しました。\n\nエラーメッセージ：\n%s').replace('%s', error));
					}

					if (result !== undefined) {
						if (Object.prototype.toString.call(result) === '[object Object]') {
							for (const key in result) {
								if (result[key] === null) {
									delete result[key];
								}
							}
						}
						const validate = jsen(UserSettings.schema, { greedy: true });
						if (validate(result)) {
							// 検索語句
							document.getElementById('searching-words').value
								= result.words ? result.words.join('\n') + '\n' : '';
							document.getElementsByName('save-searching-words')[0].click();

							// 除外リスト
							document.getElementById('ng-communities').value
								= result.NGs ? result.NGs.join('\n') + '\n' : '';
							document.getElementsByName('save-ng-communities')[0].click();

							// 外部の除外リストURL
							if (result.NGsURI) {
								await GM.setValue('NGsURI', result.NGsURI);
							} else {
								await GM.deleteValue('NGsURI');
							}

							// 行のソート
							if (!result.order) {
								result.order = UserSettings.schema.properties.order.default;
							}
							let sortedTH = document.querySelector('#programs [data-sorted]');
							if (result.order.name !== sortedTH.id) {
								sortedTH = document.getElementById(result.order.name);
								sortedTH.click();
							}
							if (result.order.order !== sortedTH.dataset.sorted) {
								sortedTH.click();
							}

							// 列の位置
							if (result['columns-position']) {
								await GM.setValue('columns-position', JSON.stringify(result['columns-position']));
								await TableProcessor.reflectColumnPositions(result.version, result['columns-position']);
							} else {
								await GM.deleteValue('columns-position');
								await TableProcessor.reflectColumnPositions(
									GM.info.script.version,
									UserSettings.schema.properties['columns-position'].default
								);
							}

							// 表示される列
							await UserSettings.showColumns(result.version, result['visible-columns']
								? result['visible-columns']
								: UserSettings.schema.properties['visible-columns'].default);

							// 検索対象のサービス
							UserSettings.enableServices(result.version, result['target-services'] || serviceIds);

							// プライベート配信・長い文字列の省略・言語
							for (const key of ['exclusionMemberOnly', 'ellipsisTooLongRSSData', 'languageFilter']) {
								const input = document.getElementsByName(key)[0];
								if (input.checked
									!== (key in result ? result[key] : UserSettings.schema.properties[key].default)) {
									input.click();
								}
							}

							// ミュート
							const alertTone = document.getElementById('alert-tone');
							if (result.audioMuted) {
								alertTone.muted = true;
							}

							// 音量
							if ('audioVolume' in result) {
								alertTone.volume = result.audioVolume;
							}

							// 音声ファイル
							const deleteSound = document.getElementsByName('delete-sound')[0];
							if (!deleteSound.hidden) {
								deleteSound.click();
							}
							if (result.audioData) {
								const audio = new Audio(result.audioData);
								audio.addEventListener('loadeddata', function () {
									if (audio.error) {
										// ブラウザが再生できないデータなら
										window.alert(
											_('使用中のブラウザが対応していないファイル形式のため、プロパティ %p を無視しました。').replace('%p', 'audioData')
										);
									} else {
										UserSettings.setAudioData(result.audioData);
									}
								});
								audio.addEventListener('error', function () {
									// ブラウザが再生できないデータなら
									window.alert(
										_('使用中のブラウザが対応していないファイル形式のため、プロパティ %p を無視しました。').replace('%p', 'audioData')
									);
								});
							}
						} else {
							window.alert(
								_('インポートに失敗しました。\n\nエラーメッセージ：\n%s')
									.replace('%s', JSON.stringify(validate.errors, null, '\t'))
							);
						}
					}
				});
				reader.readAsText(file);
			}
			input.remove();
		});
		input.click();

		window.setTimeout(function () {
			if (input.parentNode) {
				input.remove();
			}
		}, this.MAX_LIFETIME);
	},

	/**
	 * 音声ファイルを設定します。
	 * @param {string} audioData - data URL。
	 * @returns {Promise.<void>}
	 */
	setAudioData: async function (audioData) {
		try {
			await UserSettings.setLargeValue('audioData', audioData);
			const alertTone = document.getElementById('alert-tone');
			alertTone.src = audioData;
			alertTone.hidden = false;
			document.getElementsByName('delete-sound')[0].hidden = false;
		} catch (error) {
			if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
				window.alert(_('ファイルサイズが大きいため、設定に失敗しました。\n\nエラーメッセージ：\n%s').replace('%s', error));
			} else {
				throw error;
			}
		}
	},

	/**
	 * 検索語句文字列を {@link SearchCriteria} に変換します。
	 * @param {string[]} words - 正規化済みの文字列。
	 * @returns {SearchCriteria[]}
	 */
	parseWords: function (words) {
		return words.map(function (word) {
			const searchCriteria = {
				plus: [],
				minus: [],
			};
			for (const value of Normalizer.unifyCases(word).split(' ')) {
				if (value.startsWith('-')) {
					searchCriteria.minus.push(value.slice(1));
				} else {
					searchCriteria.plus.push(value);
				}
			}
			return searchCriteria;
		});
	},

	/**
	 * バージョン5.0.0より前の除外IDをURLにします。
	 * @param {string[]} exclusions
	 * @returns {string[]}
	 */
	parseExclusions: function (exclusions) {
		return exclusions.map(this.parseExclusion).filter(url => url);
	},

	/**
	 * バージョン5.0.0より前の除外IDをURLにします。
	 * @param {string} exclusion
	 * @returns {?string}
	 */
	parseExclusion: function (exclusion) {
		let url = null;
		if (exclusion.startsWith('http')) {
			url = exclusion;
		} else {
			const result = /(?:co|ch)[1-9][0-9]*/.exec(exclusion);
			if (result) {
				url = 'http://com.nicovideo.jp/community/' + result[0];
			}
		}
		return url;
	},

	/**
	 * 検索対象のサービスを取得します。
	 * @returns {string[]}
	 */
	getTargetServices: function () {
		return Array.from(document.querySelectorAll('[name="target-services"]:checked'))
			.map(checkbox => checkbox.value);
	},

	/**
	 * 表示中の列を取得します。
	 * @returns {string[]}
	 */
	getShownColumns: function () {
		return Array.from(document.querySelectorAll('[name="visible-columns"]:checked'))
			.map(checkbox => checkbox.value);
	},

	/**
	 * 指定されたサービスを有効化し、それ以外を無効化します。
	 * @param {?string} version
	 * @param {string[]} services
	 */
	enableServices: function (version, services) {
		if (compareVersions(version, '5.3.0') === -1) {
			// version < 5.3.0
			services.push('fresh', 'whowatch', 'periscope');
		}

		for (const service of document.getElementsByName('target-services')) {
			if ((services.indexOf(service.value) !== -1) !== service.checked) {
				service.click();
			}
		}
	},

	/**
	 * 最後に検索結果の取得に成功にした日時を表示します。
	 * @param {Service} service
	 */
	showLatestUpdatedDate: function (service) {
		const date = new Date();
		const html = h`
			<time datetime="${date.toISOString()}">
				${date.toLocaleString()}
			</time>
		`;
		document.querySelector(`[name="target-services"][value="${service.id}"]`).closest('tr').cells[1]
			.innerHTML = html;
		document.querySelector('#programs tfoot tr:nth-of-type(1) td').innerHTML = h(_('%s 更新')).replace('%s', html);
	},

	/**
	 * 直近の例外を表示します。
	 * @param {Service} service
	 * @param {Error} error
	 */
	showLatestError: function (service, error) {
		let message = error.toString();
		if ('lineNumber' in error) {
			message += ` (${error.lineNumber}:${error.columnNumber})`;
		}
		const html = h`<pre>${message}</pre>`;
		document.querySelector(`[name="target-services"][value="${service.id}"]`).closest('tr').cells[2]
			.innerHTML = html;
		document.querySelector('#programs tfoot tr:nth-of-type(2) td').innerHTML = html;
	},

	/**
	 * 指定された列を表示し、それ以外を非表示にします。
	 * @param {?string} version
	 * @param {string[]} columns
	 * @returns {Promise.<void>}
	 */
	showColumns: async function (version, columns) {
		if (!version) {
			// 5.0.0 より前のバージョンの設定であれば
			columns.unshift('service');
			if (columns.indexOf('category') === -1) {
				columns.push('category');
			}
			await GM.setValue('visible-columns', JSON.stringify(columns));
		}

		for (const column of document.getElementsByName('visible-columns')) {
			if ((columns.indexOf(column.value) !== -1) !== column.checked) {
				column.click();
			}
		}
	},

	/**
	 * Firefox 23 からの仕様変更 (Bug 836263) により、UserScriptLoader.uc.js において {@link GM_setValue} で1MiB以上の
	 * データを保存できなくなったため、容量制限を超過したデータはローカルストレージに保存します。
	 * @param {string} name
	 * @param {(string|number|boolean)} value
	 * @returns {Promise.<(string|number|boolean)>}
	 * @see [GM_setValue size exception(1 * 1024 * 1024) · Issue #1 · Constellation/ldrfullfeed · GitHub]{@link https://github.com/Constellation/ldrfullfeed/issues/1}
	 */
	setLargeValue: async function (name, value) {
		await GM.setValue(name, value);
		if (await GM.getValue(name) !== value) {
			// 値が正しく設定されていなければ
			const item = this.getValuesFromLocalStorage();
			item[name] = value;
			window.localStorage.setItem(Alert.ID, JSON.stringify(item));
			await GM.deleteValue(name);
		}
		return value;
	},

	/**
	 * {@link UserSettings.setLargeValue} で保存したデータを取得します。
	 * @param {type} name
	 * @param {*} defaultValue
	 * @returns {Promise}
	 */
	getLargeValue: async function (name, defaultValue) {
		let value = await GM.getValue(name);
		if (value === undefined || value === null) {
			const item = this.getValuesFromLocalStorage();
			value = item[name];
		}
		return value === undefined ? defaultValue : value;
	},

	/**
	 * {@link UserSettings.setLargeValue} で保存したデータを削除します。
	 * @param {string} name
	 */
	deleteLargeValue: function (name) {
		GM.deleteValue(name);
		const item = this.getValuesFromLocalStorage();
		delete item[name];
		window.localStorage.setItem(Alert.ID, JSON.stringify(item));
	},

	/**
	 * {@link UserSettings.setLargeValue} {@link UserSettings.getLargeValue} {@link UserSettings.deleteLargeValue}
	 * から利用される、すべての設定値を取得する関数。
	 * @returns {Object.<(string|number|boolean)>}
	 * @acsess private
	 */
	getValuesFromLocalStorage: function () {
		let item = window.localStorage.getItem(Alert.ID);
		if (item) {
			try {
				item = JSON.parse(item);
			} catch (e) {
				item = {};
			}
		} else {
			item = {};
		}
		return item;
	},
};







async function main()
{
	/**
	 * ライブストリーﾐング配信サービスのリスト。
	 * @type {Service[]}
	 */
	Alert.services = [new Service({
		id: 'fc2-live',
		name: _('FC2ライブ'),
		url: 'http://live.fc2.com/',
		disabledSearch: true,
		disabledLanguageFilter: true,
		getDetails: function () {
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'https://live.fc2.com/contents/allchannellist.php',
				responseType: 'json',
			};
		},
		parseResponse: function (response) {
			return { programs: response.channel.filter(function (program) {
				return program.type !== 2 && program.login !== 2 && program.pay === 0;
			}) };
		},
		convertIntoEntry: function (program) {
			const url = 'http://live.fc2.com/' + program.id;
			return new Program(url, program.title, {
				icon: program.image,
				published: new Date(program.start.replace(' ', 'T') + '+09:00'),
				categories: program.category === 0
					? null
					: [['雑談', 'ゲーム', '作業', '動画', 'その他', null, '公式'][program.category - 1]],
				author: {
					name: program.name,
					url: url,
				},
				visitors: Number.parseInt(program.total),
				language: program.lang,
			});
		},
	}), new Service({
		id: 'showroom',
		name: _('SHOWROOM'),
		url: 'https://www.showroom-live.com/',
		disabledSearch: true,
		getDetails: function () {
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'https://www.showroom-live.com/onlive',
				responseType: 'document',
			};
		},
		parseResponse: function (response) {
			return { programs: response.getElementsByClassName('onlive-list-li') };
		},
		convertIntoEntry: function (program) {
			return new Program(
				program.getElementsByClassName('overview-link')[0].href,
				program.getElementsByClassName('tx-title')[0].textContent,
				{
					icon: program.getElementsByClassName('img-main')[0].dataset.src,
					published: DateUtils.parseJSTString(program.getElementsByClassName('time')[0].textContent),
					visitors: Number.parseInt(program.getElementsByClassName('view')[0].textContent),
				}
			);
		},
	}), new Service({
		id: 'stickam-japan',
		name: _('Stickam JAPAN!'),
		url: 'https://www.stickam.jp/',
		disabledSearch: true,
		getDetails: function () {
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'https://www.stickam.jp/explore/session?page=1',
				responseType: 'document',
			};
		},
		parseResponse: function (response, details) {
			const programs = {
				programs: Array.from(response.getElementsByClassName('col-md-3 col-sm-3'))
					.filter(program => !program.querySelector('#ad-name')),
			};
			const nextPage = response.querySelector('.pagination > li:last-of-type:not(.disabled) a');
			if (nextPage) {
				details.url = nextPage.href;
				programs.next = details;
			}
			return programs;
		},
		convertIntoEntry: function (program) {
			const userNameLink = program.getElementsByTagName('a')[0];
			return new Program(userNameLink.href, userNameLink.text, {
				icon: program.getElementsByClassName('embed-responsive-item')[0],
				private: Boolean(program.getElementsByClassName('status')[0]),
				published: DateUtils.parseJSTString(
					program.getElementsByClassName('post-info')[0].textContent.replace('～', '')
				),
				author: {
					name: userNameLink.text,
					url: userNameLink.href.replace('stickon#webcam', ''),
				},
				summary: program.getElementsByTagName('p')[0].textContent,
			});
		},
	}), new Service({
		id: 'twitcasting',
		name: _('ツイキャス'),
		url: 'https://twitcasting.tv/',
		disabledOr: true,
		disabledMinus: true,
		disabledLanguageFilter: true,
		getDetails: function (searchCriteria) {
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'https://twitcasting.tv/search/text/' + encodeURIComponent(searchCriteria.plus.join(' ')),
				responseType: 'document',
			};
		},
		parseResponse: function (response) {
			return { programs: response.querySelectorAll('#content > div:first-of-type td') };
		},
		convertIntoEntry: function (program) {
			const url = program.querySelector('.searcheduser a').href;
			const titleAndComments = /(.*?)(?: \((0|[1-9][0-9]*)\))?$/.exec(program.querySelector('.title a').text);
			const countryflag = program.getElementsByClassName('countryflag')[0];
			let language;
			switch (countryflag && countryflag.src) {
				case 'https://twitcasting.tv/img/c/us.gif':
					language = 'en';
					break;
				case 'https://twitcasting.tv/img/c/br.gif':
					language = 'pt';
					break;
				case 'https://twitcasting.tv/img/c/mx.gif':
					language = 'es';
					break;
				case 'https://twitcasting.tv/img/c/jp.gif':
					language = 'ja';
					break;
				default:
					language = 'und';
			}
			return new Program(url, titleAndComments[1], {
				icon: program.getElementsByClassName('icon32')[0].src,
				author: {
					name: program.getElementsByClassName('fullname')[0].textContent,
					url: url,
				},
				categories: Array.from(program.getElementsByClassName('tag'), function (anchor) {
					return anchor.text;
				}),
				summary: program.getElementsByClassName('userdesc')[0].textContent.trim(),
				comments: titleAndComments[2] ? Number.parseInt(titleAndComments[2]) : null,
				language: language,
			});
		},
	}), new Service({
		id: 'twitch',
		name: _('Twitch'),
		url: 'https://www.twitch.tv/',
		/**
		 * 検索結果の最大件数。
		 * @constant {number}
		 */
		MAX_RESULT_LENGTH: 100,
		/**
		 * 本スクリプトのクライアントID。
		 * @constant {string}
		 */
		CLIENT_ID: '240onlpbs6y5fwt92jj26i8bb4inszw',
		disabledOr: true,
		disabledMinus: true,
		disabledLanguageFilter: true,
		getDetails: function (searchCriteria) {
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'https://api.twitch.tv/kraken/search/streams?' + new URLSearchParams(
					{client_id: this.CLIENT_ID, limit: this.MAX_RESULT_LENGTH, q: searchCriteria.plus.join(' ')}
				),
				responseType: 'json',
			};
		},
		parseResponse: function (response) {
			return { programs: response.streams };
		},
		convertIntoEntry: function (program) {
			return new Program(program.channel.url, program.channel.status || 'Untitled Broadcast', {
				icon: program.channel.logo || program.channel.profile_banner,
				published: new Date(program.created_at),
				author: {
					name: program.channel.display_name,
					url: program.channel.url + '/profile',
				},
				categories: program.channel.game ? [program.channel.game] : null,
				visitors: program.viewers,
				language: program.channel.language,
			});
		},
	}), new Service({
		/**
		 * 検索結果の最大件数。
		 * @constant {number}
		 */
		MAX_RESULT_LENGTH: 100,
		id: 'niconico-live',
		name: _('ニコニコ生放送'),
		url: 'http://live.nicovideo.jp/',
		icon: 'http://nl.simg.jp/public/inc/assets/zero/img/base/favicon.ico',
		getDetails: function (words) {
			return {
				mode: 'no-cors',
				method: 'GET',
				responseType: 'json',
				url: 'http://api.search.nicovideo.jp/api/v2/live/contents/search?' + new URLSearchParams({
					q: words.map(searchCriteria => searchCriteria.plus[0]).join(' OR '),
					targets: ['title', 'tags', 'description'].join(),
					fields: [
						'contentId',        // ID
						'title',            // タイトル
						'memberOnly',       // プライベート
						'startTime',        // 開始時刻
						'communityIcon',    // コミュニティアイコン
						'tags',             // タグ
						'description',      // 詳細
						'communityId',      // コミュニティID
						'channelId',
						'viewCounter',
						'commentCounter',
					].join(),
					'filters[liveStatus][0]': 'onair',
					_sort: 'startTime',
					_limit: this.MAX_RESULT_LENGTH,
					_context: 'ニコ生アラート（簡）',
				}),
			};
		},
		parseResponse: function (response, details) {
			return { programs: response.data };
		},
		convertIntoEntry: function (program) {
			const otherDetails = {
				icon: program.communityIcon,
				private: Boolean(program.memberOnly),
				published: new Date(program.startTime),
				// <br /> タグを半角スペースに置き換え、他のタグは取り除く
				summary: program.description.replace(/<br( )\/>|<font[^>]+>|<\/?(?:font|b|i|s|u)>/g, '$1'),
				categories: program.tags && program.tags.split(' '),
				visitors: program.viewCounter,
				comments: program.commentCounter,
			};

			if (otherDetails.summary.includes('&')) {
				// 文字参照が含まれていれば
				otherDetails.summary
					= new DOMParser().parseFromString(otherDetails.summary, 'text/html').body.textContent;
			}

			if (program.communityId || program.channelId) {
				otherDetails.community = {
					name: program.communityId ? 'co' + program.communityId : 'ch' + program.channelId,
				};
				otherDetails.community.url = 'http://com.nicovideo.jp/community/' + otherDetails.community.name;
			}

			return new Program('http://live.nicovideo.jp/watch/' + program.contentId, program.title, otherDetails);
		},
		delay: 1 * DateUtils.MINUTES_TO_MILISECONDS,
	}), new Service({
		id: 'himawari-stream',
		name: _('ひまわりストリーム'),
		url: 'http://himast.in/',
		disabledSearch: true,
		getDetails: function () {
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'http://himast.in/?mode=program&cat=search&sort=st_start_date&st_status=1&rss=1',
				responseType: 'document',
			};
		},
		parseResponse: function (response) {
			return { programs: response.getElementsByTagName('item') };
		},
		convertIntoEntry: function (program) {
			const details = [];
			const description = new DOMParser().parseFromString(
				program.getElementsByTagName('description')[0].textContent,
				'text/html'
			);
			let summary;
			for (const node of description.getElementsByClassName('riRssContributor')[0].childNodes) {
				if (node.nodeType === Node.TEXT_NODE) {
					details.push([node.data.replace(/^\s+|:|：/g, '')]);
				} else if (node.localName === 'b') {
					details[details.length - 1][1] = node.textContent;
				} else {
					summary = node.nextSibling.data;
					break;
				}
			}

			return new Program(
				program.getElementsByTagName('link')[0].textContent,
				program.getElementsByTagName('title')[0].textContent,
				{
					icon: description.getElementsByTagName('img')[0].src,
					published: new Date(program.getElementsByTagName('pubDate')[0].textContent),
					author: {
						name: details.find(function (detail) {
							return detail[0] === '配信者';
						})[1],
					},
					summary: summary,
					visitors: Number.parseInt(details.find(function (detail) {
						return detail[0] === '延べ入場者数';
					})[1]),
					comments: Number.parseInt(details.find(function (detail) {
						return detail[0] === 'コメント数';
					})[1]),
				}
			);
		},
	}), new Service({
		id: 'fresh',
		name: _('FRESH! (AbemaTV)'),
		url: 'https://freshlive.tv/',
		icon: 'https://freshlive.tv/assets/1482283729/favicon.ico',
		/**
		 * 検索結果の最大件数。
		 * @constant {number}
		 */
		MAX_RESULT_LENGTH: 1000,
		disabledOr: true,
		disabledMinus: true,
		getDetails: function (searchCriteria) {
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'https://freshlive.tv/proxy/Searches;type=onairs'
					+ `;count=${this.MAX_RESULT_LENGTH};q=${encodeURIComponent(searchCriteria.plus.join(' '))}`,
				responseType: 'json',
			};
		},
		parseResponse: function (response) {
			return { programs: response.data.filter(program => program.paymentStatus === 'free') };
		},
		convertIntoEntry: function (program) {
			return new Program(program.permalink, program.title, {
				icon: program.channel.imageUrl,
				published: new Date(program.startAt),
				author: {
					name: program.channel.user.displayName,
				},
				categories: program.tags,
				summary: program.description,
				visitors: program.viewCount,
				comments: program.commentCount,
				community: {
					name: program.channel.title,
					url: program.channel.permalink,
				},
			});
		},
		delay: 1 * DateUtils.MINUTES_TO_MILISECONDS,
	}), new Service({
		id: 'whowatch',
		name: _('ふわっち'),
		url: 'https://whowatch.tv/',
		icon: 'https://whowatch.tv/image/favicon.ico',
		disabledSearch: true,
		getDetails: function () {
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'https://api.whowatch.tv/lives?category_id=0&list_type=new',
				responseType: 'json',
			};
		},
		parseResponse: function (response) {
			return { programs: response[0].new };
		},
		convertIntoEntry: function (program) {
			return new Program('https://whowatch.tv/viewer/' + program.id, program.title, {
				icon: program.user.icon_url,
				published: new Date(program.started_at),
				author: {
					name: program.user.name,
					url: 'https://whowatch.tv/profile/' + program.user.user_path,
				},
				visitors: program.total_view_count,
			});
		},
	}), new Service({
		id: 'periscope',
		name: _('Periscope (Twitter)'),
		url: 'https://www.periscope.tv/',
		disabledOr: true,
		disabledMinus: true,
		disabledLanguageFilter: true,
		getDetails: function (searchCriteria) {
			return {
				mode: 'no-cors',
				method: 'POST',
				url: 'https://api.periscope.tv/api/v2/broadcastSearchPublic',
				responseType: 'json',
				data: {search: searchCriteria.plus.join(' '), include_replay: false},
			};
		},
		parseResponse: function (response) {
			return { programs: response };
		},
		convertIntoEntry: function (program) {
			return new Program(`https://www.periscope.tv/${program.username}/${program.id}`, program.status, {
				icon: program.profile_image_url,
				published: new Date(program.start),
				author: {
					name: program.user_display_name,
					url: program.twitter_username && 'https://twitter.com/' + program.twitter_username,
				},
				categories: program.tags,
				visitors: program.n_total_watching,
				language: program.language,
			});
		},
		delay: 1 * DateUtils.MINUTES_TO_MILISECONDS,
	}), new Service({
		id: 'youtube-live',
		name: _('YouTube ライブ'),
		url: 'https://www.youtube.com/live',
		icon: 'https://i.ytimg.com/i/4R8DWoMoI7CAwX8_LjQHig/mq1.jpg',
		disabledOr: true,
		getDetails: function (word) {
			let query = word.plus.join(' ');
			if (word.minus.length > 0) {
				query += ' -' + word.minus.join(' -');
			}
			return {
				mode: 'no-cors',
				method: 'GET',
				url: 'https://www.youtube.com/results?'
					+ new URLSearchParams({filters: 'live', search_sort: 'video_date_uploaded', search_query: query}),
				responseType: 'document',
			};
		},
		parseResponse: function (response) {
			return { programs: response.getElementsByClassName('yt-lockup-dismissable') };
		},
		convertIntoEntry: function (program) {
			const anchor = program.querySelector('.yt-lockup-title a');
			const userAnchor = program.querySelector('.yt-lockup-byline a');
			const description = program.getElementsByClassName('yt-lockup-description')[0];
			const metaInfo = document.getElementsByClassName('yt-lockup-meta-info')[0];
			return new Program(anchor.href, anchor.title, {
				icon: program.querySelector('.yt-thumb img').src,
				author: {
					name: userAnchor.text,
					url: userAnchor.href,
				},
				summary: description ? description.textContent : null,
				visitors: metaInfo ? Number.parseInt(/[0-9]+/.exec(metaInfo)[0]) : null,
			});
		},
	}), new Service({
		/**
		 * 検索結果の最大件数。
		 * @constant {number}
		 */
		MAX_RESULT_LENGTH: 100,
		id: 'younow',
		name: _('YouNow'),
		url: 'https://www.younow.com/',
		disabledMinus: true,
		getDetails: function (words) {
			return {
				mode: 'cors',
				method: 'POST',
				url: 'https://qz0xcgubgq.algolia.io/1/indexes/*/queries',
				responseType: 'json',
				headers: {
					'X-Algolia-Application-Id': 'QZ0XCGUBGQ',
					'X-Algolia-API-Key': '7f270d4586d986ef69fb5bab5ecd7f741b5cb3f7042881112ed46c97b5e8404a',
					'X-Algolia-TagFilters': '(public)',
				},
				data: { requests: words.map(searchCriteria => ({
					indexName: 'people_search_live',
					params: new URLSearchParams(
						{hitsPerPage: this.MAX_RESULT_LENGTH, advancedSyntax: 1, query: searchCriteria.plus.join(' ')}
					).toString(),
				})) },
			};
		},
		parseResponse: function (response, details, words) {
			return { programs: Array.prototype.concat.apply([], response.results.map(function (result, index) {
				const programs = [];
				const searchCriteria = words[index];
				for (const program of result.hits) {
					if (program.tag === '') {
						break;
					}
					program.searchCriteria = searchCriteria;
					programs.push(program);
				}
				return programs;
			})) };
		},
		convertIntoEntry: function (program) {
			const url = 'https://www.younow.com/' + program.profile;

			return new Program(url, '#' + program.tag, {
				icon: 'https://cdn2.younow.com/php/api/channel/getImage/channelId=' + program.objectID,
				author: {
					name: program.firstName + ' ' + program.lastName,
					url: url,
				},
				categories: [program.tag],
				summary: program.description,
			}, program.searchCriteria);
		},
	}), new Service({
		id: 'livestream',
		name: _('Livestream'),
		url: 'https://livestream.com/watch/',
		icon: 'https://cdn.livestream.com/website/b0c04ce/assets/favicon.ico',
		/**
		 * 検索結果の最大件数。
		 * @constant {number}
		 */
		MAX_RESULT_LENGTH: 1000,
		getDetails: function (words) {
			return {
				mode: 'cors',
				method: 'POST',
				url: 'https://7kjecl120u-1.algolia.io/1/indexes/*/queries',
				responseType: 'json',
				data: {
					apiKey: '98f12273997c31eab6cfbfbe64f99d92',
					appID: '7KJECL120U',
					requests: words.map(searchCriteria => {
						let query = searchCriteria.plus.join(' ');
						if (searchCriteria.minus.length > 0) {
							query += ' -' + searchCriteria.minus.join(' -');
						}
						return {
							indexName: 'events',
							params: new URLSearchParams({
								hitsPerPage: this.MAX_RESULT_LENGTH,
								advancedSyntax: 1,
								facets: '*',
								facetFilters: '["is_live:1"]',
								query: query,
							}).toString(),
						};
					}),
				},
			};
		},
		parseResponse: function (response, details, words) {
			return { programs: Array.prototype.concat.apply([], response.results.map(function (result, index) {
				const searchCriteria = words[index];
				for (const program of result.hits) {
					program.searchCriteria = searchCriteria;
				}
				return result.hits;
			})) };
		},
		convertIntoEntry: function (program) {
			const tags = [];
			if (program.category_name !== 'No category') {
				tags.push(program.category_name);
			}
			if (program.subcategory_name) {
				tags.push(program.subcategory_name);
			}
			if (program.tags) {
				tags.concat(program.tags.split(','));
			}

			return new Program('https://livestream.com' + program.path, program.full_name, {
				icon: program.owner_logo ? program.owner_logo.thumbnail.url : null,
				private: Boolean(program.is_password_protected),
				published: new Date(program.start_time),
				author: {
					name: program.owner_account_full_name,
					url: 'https://livestream.com/accounts/' + program.owner_account_id,
				},
				categories: tags.length > 0 ? tags : null,
				visitors: program.concurrent_viewers_count,
				comments: program.live_video_post_comments_count,
			}, program.searchCriteria);
		},
	})];

	// ページタイトル
	document.title = Alert.NAME;

	// Favicon
	const icon = document.querySelector('[rel="icon"]');
	icon.href = Alert.ICON;
	document.head.append(icon);

	// 元のページ内容を削除
	document.getElementsByTagName('main')[0].remove();

	// ヘッダを修正
	for (const select of document.querySelectorAll('[href^="javascript:"]')) {
		select.target = '_self';
	}

	// リンク先を新しいタブで開く、スタイルの設定
	document.head.insertAdjacentHTML('beforeend', h`
		<base target="_blank" />

		<style>
			[aria-hidden="true"] {
				display: none;
			}

			main#${Alert.ID} {
				text-align: center;
				width: unset;
				margin: 1em;
			}
			main a:link {
				color: mediumblue;
			}
			main a:visited {
				color: midnightblue;
			}

			#page_header {
				display: none;
			}

			/*====================================
				表
			 */
			#programs {
				width: 100%;
			}
			#programs caption {
				display: none;
			}
			main tr {
				background: silver;
				border-width: 1px;
				border-style: solid none;
			}
			main thead th {
				white-space: nowrap;
			}

			#programs tbody {
				text-align: left;
				border-top: solid;
				border-bottom: solid;
			}

			/*------------------------------------
				ボタンの左右のマージン
			 */
			main button {
				margin-left: 0.2em;
				margin-right: 0.2em;
			}

			/*------------------------------------
				セル内容の右寄せ・改行禁止
			 */
			#programs [role="timer"],
			#programs [aria-live="off"] {
				text-align: right;
				white-space: nowrap;
			}

			/*------------------------------------
				行の背景色
			 */
			#programs tbody tr:nth-of-type(2n-1),
			#user-setting-options tbody tr:nth-of-type(2n-1),
			#programs tbody:not(.odd) + tfoot tr {
				background: white;
			}
			main tr td,
			main tr th {
				padding: 3px;
			}

			/*------------------------------------
				リンクでない文字列
			 */
			a:not(:link) {
				color: unset;
				text-decoration: unset;
			}

			/*------------------------------------
				番組のアイコン
			 */
			[itemtype="http://schema.org/VideoObject"] [itemprop="image"] {
				width: 64px;
			}

			/*------------------------------------
				取得失敗 / 空文字列 / 空白文字
			 */
			#programs .illegal {
				font-style: oblique;
			}

			/*------------------------------------
				項目の移動
			 */
			.inserting-before {
				border-left: solid lightskyblue thick;
			}
			.inserting-after {
				border-right: solid lightskyblue thick;
			}
			#main-settings {
				-moz-column-count: 2;       /* Firefox */
				column-count: 2;
			}
			#main-settings textarea {
				width: 100%;
				height: 20em;
			}

			/*------------------------------------
				検索語句の強調表示
			 */
			main mark {
				color: inherit;
				background: khaki;
			}

			/*------------------------------------
				省略記号の表示
			 */
			.ellipsis-left::before,
			.ellipsis-right::after {
				content: "…";
				color: dimgray;
			}
			.ellipsis-left::before {
				margin-right: 0.2em;
			}
			.ellipsis-right::after {
				margin-left: 0.2em;
			}
			.ellipsis-left::before {
				margin-right: 0.2em;
			}
			.ellipsis-right::after {
				margin-left: 0.2em;
			}

			/*------------------------------------
				Windows 版の Opera、Google Chrome における全文の表示
			 */
			main td {
				position: relative;
			}
			[data-title]:hover::after {
				content: attr(data-title);
				position: absolute;
				top: calc(100% + 0.2em);
				left: 1em;
				border: 1px solid dimgray;
				background: khaki;
				padding: 0.5em;
				opacity: 0.9;
				border-radius: 0.7em;
				z-index: 1;
			}

			/*------------------------------------
				ステータス
			 */
			#programs tfoot tr:first-of-type {
				border-bottom: none;
			}
			#programs tfoot tr:last-of-type {
				border-top: none;
			}

			/*------------------------------------
				ライブ配信サービス一覧
			 */
			#user-setting-options tr {
				background: whitesmoke;
			}
			#user-setting-options thead th {
				padding-right: 1em;
			}

			/*====================================
				追加設定ボックス
			 */
			#user-setting-options {
				display: flex;
				width: 100%;
				flex-direction: column;
				align-items: center;
			}
			#user-setting-options dt {
				margin-top: 2em;
				font-weight: bold;
			}
			#user-setting-options dd > * {
				text-align: left;
			}
			#user-setting-options > :last-of-type li {
				list-style: disc;
			}

			/*------------------------------------
				▲▼
			 */
			[aria-controls="user-setting-options"]::before {
				content: "▼";
				color: darkslategray;
				margin-right: 0.5em;
			}
			[aria-controls="user-setting-options"][aria-expanded="true"]::before {
				content: "▲";
			}
			#user-setting-options[aria-hidden="true"] {
				display: none;
			}

			/*====================================
				ライブ配信サービスのアイコン
			 */
			[itemtype="http://schema.org/Organization"] [itemprop="logo"],
			[itemtype="http://schema.org/BroadcastService"] [itemprop="image"] {
				width: 16px;
			}
		</style>
	`);

	// 挿入
	document.getElementById('page_header').insertAdjacentHTML('afterend', h`<main id="${Alert.ID}">
		<table id="programs">
			<caption>${_('検索ワードにヒットしたライブ配信番組')}</caption>
			<thead>
				<tr dropzone="move">
					<th id="service" title="${_('どのライブ配信サービスか')}" draggable="true">
					</th>
					<th id="thumbnail" title="${_('アイコン')}" draggable="true">
					</th>
					<th id="member_only" title="${_('プライベート配信か否か')}" draggable="true">
					</th>
					<th id="pubDate" title="${_('配信開始からの経過時間')}" data-sorted="asc" draggable="true">
						${_('経過')}
					</th>
					<th id="title" title="${_('番組のタイトル')}" draggable="true">
						${_('タイトル')}
					</th>
					<th id="category" title="${_('カテゴリ・タグ')}" draggable="true">
						${_('タグ')}
					</th>
					<th id="owner_name" title="${_('配信者の名前')}" draggable="true">
						${_('配信者')}
					</th>
					<th id="description" title="${_('説明文')}" draggable="true">
						${_('説明文')}
					</th>
					<th id="view" title="${_('来場者数')}" draggable="true">
						${_('来場')}
					</th>
					<th id="num_res" title="${_('総コメント数')}" draggable="true">
						${_('コメ数')}
					</th>
					<th id="community_name" title="${_('コミュニティ・チャンネル')}" draggable="true">
						${_('コミュニティ')}
					</th>
				</tr>
			</thead>
			<tbody aria-live="polite" aria-relevant="additions">
				<template>
					<tr itemscope="" itemtype="http://schema.org/VideoObject">
						<td itemprop="provider" itemscope="" itemtype="http://schema.org/Organization">
							<data itemprop="name" value="">
								<a itemprop="url">
									<img itemprop="logo" src="dummy" />
								</a>
							</data>
						</td>
						<td>
							<a itemprop="url"><img itemprop="image" src="dummy" hidden="" /></a>
						</td>
						<td>
							<data itemprop="requiresSubscription" value="false"></data>
						</td>
						<td role="timer">
							<time itemprop="duration" datetime="P365D" hidden=""></time>
						</td>
						<td>
							<data itemprop="name" value="">
								<a itemprop="url"></a>
							</data>
						</td>
						<td>
							<data itemprop="keywords" value="">
							</data>
						</td>
						<td itemprop="author" itemscope="" itemtype="http://schema.org/Person">
							<data itemprop="name" value="">
								<a itemprop="workLocation"></a>
							</data>
						</td>
						<td>
							<data itemprop="description" value="">
							</data>
						</td>
						<td aria-live="off" itemprop="interactionStatistic" itemscope=""
							itemtype="http://schema.org/InteractionCounter">
							<data itemprop="userInteractionCount" value="-1">
							</data>
						</td>
						<td aria-live="off">
							<data itemprop="commentCount" value="-1"></data>
						</td>
						<td itemprop="productionCompany" itemscope="" itemtype="http://schema.org/PerformingGroup">
							<data itemprop="name" value="">
								<a itemprop="url"></a>
							</data>
						</td>
					</tr>
				</template>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="11" role="status"></td>
				</tr>
				<tr>
					<td colspan="11" role="status"></td>
				</tr>
			</tfoot>
		</table>
	</main>`);

	/**
	 * 番組を表示する表。
	 * @type {HTMLTableElement}
	 */
	const table = document.getElementById('programs');

	document.head.insertAdjacentHTML('beforeend', `<style>
		/*====================================
			列ごとの並べ替え
		 */
		#programs thead th:hover,
		#programs thead th:focus {
			cursor: pointer;
			background: gainsboro;
		}

		/*------------------------------------
			▲▼
		 */
		[data-sorted]::before {
			content: "▲";
			color: darkslategray;
			margin-right: 0.5em;
		}
		[data-sorted="desc"]::before {
			content: "▼";
		}
	</style>`);

	for (const th of Array.from(table.getElementsByTagName('th'))) {
		th.setAttribute('role', 'button');
		th.tabIndex = 0;
	}

	table.tHead.addEventListener('keydown', function (event) {
		if (event.key === ' ') {
			event.preventDefault();
		}
	});

	table.tHead.addEventListener('keyup', function (event) {
		if (event.key === 'Enter' || event.key === ' ') {
			TableProcessor.sort(event.target);
			event.target.blur();
		}
	});

	/**
	 * アプリケーション全体を内包する main 要素。
	 * @type {HTMLElement}
	 */
	const main = document.getElementById(Alert.ID);

	main.insertAdjacentHTML('beforeend', h`
		<dl id="main-settings">
			<dt>
				${_('検索語句')}
				<button name="save-searching-words" aria-controls="searching-words">${_('保存')}</button>
			</dt>
			<dd>
				<textarea name="searching-words" id="searching-words"></textarea>
			</dd>
			<dt>
				${_('除外するコミュニティ・チャンネルなどの URL')}
				<button name="save-ng-communities" aria-controls="ng-communities">${_('保存')}</button>
				<button name="sets-blacklist-uri">${_('除外 URL リストの取得先を設定')}</button></dt>
			<dd>
				<textarea name="ng-communities" id="ng-communities"></textarea>
			</dd>
		</dl>

		<audio id="alert-tone" controls="" preload="auto" hidden=""></audio>

		<button type="button" aria-expanded="false" aria-controls="user-setting-options">
			${_('追加設定ボックスの開閉')}
		</button>
		<dl id="user-setting-options" aria-hidden="true">
			<dt>${_('検索対象のライブ配信サービス')}</dt>
			<dd>
				<table>
					<thead>
						<tr>
							<th>${_('サービス名')}</th>
							<th>${_('最後に検索結果の取得に成功にした日時')}</th>
							<th>${_('直近のエラー')}</th>
						</tr>
					</thead>
					<tbody>` + Alert.services.map(function (service) {
						return h`<tr itemscope="" itemtype="http://schema.org/BroadcastService">
							<td>
								<label itemprop="name">
									<input name="target-services" value="${service.id}" type="checkbox">
									<img itemprop="image" src="${service.icon}" alt="" />
									${service.name}
								</label>
							</td>
							<td role="status">
							</td>
							<td role="status">
							</td>
						</tr>`;
					}).join('') + h`</tbody>
				</table>
			</dd>

			<dt>${_('表示する項目の設定')}</dt>
			<dd>
				<ul id="visible-columns">` + Array.from(main.getElementsByTagName('th')).map(function (th) {
					return h`<li>
						<label>
							<input name="visible-columns" value="${th.id}" aria-controls="${th.id}" type="checkbox"
								checked="">
							${_(th.title)}
						</label>
					</li>`;
				}).join('') + h`</ul>
			</dd>

			<dt>${_('その他の設定')}</dt>
			<dd>
				<ul>
					<li>
						<label>
							<input name="exclusionMemberOnly" type="checkbox">
							${_('プライベート配信を通知しない')}
						</label>
					</li>
					<li>
						<label>
							<input name="ellipsisTooLongRSSData" type="checkbox" checked="">
							${_('タイトル・キャプション・コミュニティ名が %d 文字を超えたら省略する')
								.replace('%d', UserSettings.MAX_VISIBLE_CHARACTERS)}
						</label>
					</li>
					<li>
						<label>
							<input name="languageFilter" type="checkbox" checked="">
							${_('言語で絞り込む (言語が取得可能なサービスのみ)')}
						</label>
					</li>
				</ul>
			</dd>

			<dt>${_('アラート音')}</dt>
			<dd>
				<button name="select-sound" type="button" aria-controls="alert-tone">${_('アラート音を選択')}</button>
				<button name="delete-sound" type="button" aria-controls="alert-tone" hidden="">
					${_('設定済みのアラート音を削除')}
				</button>
				<input hidden="" type="file" accept="audio/*" />
			</dd>

			<dt>${_('設定のインポートとエクスポート')}</dt>
			<dd>
				<button name="import" type="button">${_('JSONファイルからインポートする')}</button>
				<button name="export" type="button">${_('JSON形式でファイルにエクスポート')}</button>
			</dd>

			<dt></dt>
			<dd>
				<ul>
					<li>${_('項目名クリックで番組を昇順・降順に並べ替えることができます。')}</li>
					<li>${_('項目名をドラッグ&ドロップで列の位置を変更できます。')}</li>
					<li>${_('ユーザー名やコミュニティ名をテキストエリアにドラッグ&ドロップで除外 URL に指定できます。')}</li>
				</ul>
			</dd>
		</dl>
	`);

	/**
	 * 列IDのリスト。
	 * @type {string[]}
	 */
	const columnNames = Array.from(table.querySelectorAll('thead th')).map(th => th.id);

	/**
	 * 配信サービスのIDのリスト。
	 * @type {string[]}
	 */
	const serviceIds = Alert.services.map(service => service.id);

	/**
	 * ユーザー設定をインポートする際に利用するJSONスキーマ。
	 * @type {Object}
	 */
	UserSettings.schema = {
		type: 'object',
		properties: {
			version: {
				type: 'string',
			},
			words: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			NGs: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			NGsURI: {
				type: 'string',
			},
			order: {
				type: 'object',
				required: ['name', 'order'],
				properties: {
					name: {
						type: 'string',
						enum: columnNames,
					},
					order: {
						type: 'string',
						enum: ['asc', 'desc'],
					},
				},
				default: function () {
					const sortedTH = document.querySelector('#programs [data-sorted]');
					return {
						name: sortedTH.id,
						order: sortedTH.dataset.sorted,
					};
				}(),
			},
			'columns-position': {
				type: 'array',
				uniqueItems: true,
				items: {
					type: 'string',
					enum: columnNames,
				},
				default: columnNames,
			},
			'visible-columns': {
				type: 'array',
				uniqueItems: true,
				items: {
					type: 'string',
					enum: columnNames,
				},
				default: [
					'service', 'member_only', 'pubDate', 'title', 'category', 'owner_name', 'description',
					'view', 'num_res', 'community_name',
				],
			},
			'target-services': {
				type: 'array',
				uniqueItems: true,
				items: {
					type: 'string',
					enum: serviceIds.concat(['koebu-live', 'ustream', 'livetube']),
				},
				default: serviceIds.filter(
					serviceId => !['youtube-live', 'younow', 'livestream'].includes(serviceId)
				),
			},
			exclusionMemberOnly: {
				type: 'boolean',
				default: document.getElementsByName('exclusionMemberOnly')[0].checked,
			},
			ellipsisTooLongRSSData: {
				type: 'boolean',
				default: document.getElementsByName('ellipsisTooLongRSSData')[0].checked,
			},
			languageFilter: {
				type: 'boolean',
				default: document.getElementsByName('languageFilter')[0].checked,
			},
			audioMuted: {
				type: 'boolean',
				default: false,
			},
			audioVolume: {
				type: 'number',
				minimum: 0,
				maximum: 1,
				default: 1.0,
			},
			audioData: {
				type: 'string',
				pattern: '^data:(audio/[-_.0-9A-Za-z]+|video/ogg);base64,',
			},
		},
	};

	/**
	 * 設定保存時のバージョン番号。
	 * @type {?string}
	 */
	const version = await GM.getValue('version');

	// 検索語句
	let words = await GM.getValue('words');
	if (words) {
		words = JSON.parse(words);
		UserSettings.words = UserSettings.parseWords(words);
		document.getElementById('searching-words').value = words.join('\n') + '\n';
	}

	// 除外リスト
	let NGs = await GM.getValue('NGs');
	if (NGs) {
		NGs = JSON.parse(NGs);
		UserSettings.exclusions = UserSettings.parseExclusions(NGs);
		if (!version) {
			// 5.0.0 より前のバージョンの設定であれば
			await GM.setValue('NGs', JSON.stringify(UserSettings.exclusions));
		}
		document.getElementById('ng-communities').value = UserSettings.exclusions.join('\n') + '\n';
	}

	// 検索対象のサービス
	const targetServicesJSON = await GM.getValue('target-services');
	if (targetServicesJSON) {
		UserSettings.enableServices(version, JSON.parse(targetServicesJSON));
	} else {
		UserSettings.enableServices(GM.info.script.version, UserSettings.schema.properties['target-services'].default);
	}

	// プライベート配信・長い文字列の省略・言語
	for (const key of ['exclusionMemberOnly', 'ellipsisTooLongRSSData', 'languageFilter']) {
		const input = document.getElementsByName(key)[0];
		const savedValue = await GM.getValue(key);
		if (savedValue !== undefined && savedValue !== null) {
			input.checked = savedValue;
		}
	}

	/**
	 * アラート音を鳴らすための要素。
	 * @type {HTMLAudioElement}
	 */
	const alertTone = document.getElementById('alert-tone');

	// 音声ファイル
	const audioData = await UserSettings.getLargeValue('audioData');
	if (audioData) {
		alertTone.src = audioData;
		alertTone.hidden = false;
		document.getElementsByName('delete-sound')[0].hidden = false;
	}

	// ミュート
	if (await GM.getValue('audioMuted')) {
		alertTone.muted = true;
	}

	// 音量
	const audioVolume = await GM.getValue('audioVolume');
	if (audioVolume !== undefined && audioVolume !== null) {
		alertTone.volume = audioVolume;
	}

	// volumechangeイベント
	alertTone.addEventListener('volumechange', function (event) {
		if (event.target.muted) {
			GM.setValue('audioMuted', true);
		} else {
			GM.deleteValue('audioMuted');
		}

		if (event.target.volume === UserSettings.schema.properties.audioVolume.default) {
			GM.deleteValue('audioVolume');
		} else {
			GM.setValue('audioVolume', event.target.volume.toString());
		}
	});

	// clickイベント
	main.addEventListener('click', async function (event) {
		const target = event.target;
		const name = target.name;
		if (target.localName === 'button') {
			if (name === 'sets-blacklist-uri') {
				// 特定の URL から NG リストを読み込んで、検索時に付加
				const newURL = window.prompt(_('特定の URL から、除外 URL のリストを読み込み、検索時に付加します。') + '\n'
					+ _('JSON 形式の URL 文字列の配列のみ有効です。') + '\n'
					+ _('また、除外 URL リストの読み込みは、アラートページ読み込み時に1回だけ行われます。'), await GM.getValue('NGsURI', ''));
				if (newURL !== null) {
					GM.setValue('NGsURI', newURL);
				}
			} else if (name === 'import') {
				// インポート
				UserSettings.import();
			} else if (name === 'export') {
				// エクスポート
				UserSettings.export();
			} else if (name === 'select-sound') {
				// アラート音の選択
				document.querySelector('[accept="audio/*"]').click();
			} else if (name === 'delete-sound') {
				// 設定済みのアラート音の削除
				target.hidden = true;
				document.getElementById('alert-tone').hidden = true;
				document.querySelector('[accept="audio/*"]').src = '';
				UserSettings.deleteLargeValue('audioData');
			} else if (target.getAttribute('aria-controls') === 'user-setting-options') {
				// 追加設定ボックスの開閉
				const previousOpened = target.getAttribute('aria-expanded') === 'true';
				target.setAttribute('aria-expanded', previousOpened ? 'false' : 'true');
				document.getElementById('user-setting-options')
					.setAttribute('aria-hidden', previousOpened ? 'true' : 'false');
				target.scrollIntoView(!previousOpened);
				if (!previousOpened && !document.body.classList.contains('nofix')) {
					window.scrollBy(0, -document.getElementById('siteHeader').clientHeight);
				}
			} else if (name === 'save-searching-words' || name === 'save-ng-communities') {
				// 検索語句、検索から除外するユーザー・コミュニティ・チャンネルの保存
				// 二重クリックを防止
				target.disabled = true;

				/**
				 * 対応するテキストエリア。
				 * @type {string}
				 */
				const textarea = document.getElementById(target.getAttribute('aria-controls'));

				/**
				 * 前後の空白を削除したテキストエリアの値。
				 * @type {string}
				 */
				const trimedValue = textarea.value.trim();

				/**
				 * 正規化後、空行を含めずに改行で分割し、重複を削除した値。
				 * @type {string[]}
				 */
				const values = trimedValue === ''
					? []
					: Array.from(new Set(trimedValue.split(/\s*\n\s*/).map(Normalizer.normalize)));

				/**
				 * 検索語句の保存なら真。
				 * @type {boolean}
				 */
				const seavingWords = name === 'save-searching-words';

				/**
				 * {@link GM.setValue} に保存する値。
				 * @type {string[]}
				 */
				let savedValues;

				// 解析、キャッシュ、保存
				if (values.length > 0) {
					if (seavingWords) {
						// 検索語句
						savedValues = values;
						UserSettings.words = UserSettings.parseWords(values);
					} else {
						// 検索から除外するユーザー・コミュニティ・チャンネル
						savedValues = UserSettings.parseExclusions(values);
						UserSettings.exclusions = savedValues.concat(UserSettings.exclusionsFromExternal);
						// すでに表示している番組を非表示に
						TableProcessor.removeExclusions();
					}
				} else {
					savedValues = [];
				}

				/**
				 * テキストエリアに出力しなおす、正規化後の入力値。末尾に空行を含みます。
				 * @type {string}
				 */
				let outputValue;

				// 保存
				const gmValueName = seavingWords ? 'words' : 'NGs';
				if (savedValues.length > 0) {
					await GM.setValue(gmValueName, JSON.stringify(savedValues));
					outputValue = savedValues.join('\n') + '\n';
				} else {
					await GM.deleteValue(gmValueName);
					outputValue = '';
				}

				// テキストエリアに正規化後の文字列を出力
				if (textarea.value !== outputValue) {
					textarea.value = outputValue;
				}

				if (seavingWords) {
					Alert.restart();
				}

				// クリック禁止を解除
				target.disabled = false;
			}
		} else if (target.localName === 'th') {
			// 列ごとの並び替え
			TableProcessor.sort(target);
			event.target.blur();
		}
	});

	// changeイベント
	document.getElementById('user-setting-options').addEventListener('change', function (event) {
		const input = event.target;

		switch (input.name) {
			case 'visible-columns': {
				// 表示する項目の選択
				const th = document.getElementById(input.value);
				if (input.checked) {
					TableProcessor.showColumn(th);
				} else {
					TableProcessor.hideColumn(th);
				}
				GM.setValue('visible-columns', JSON.stringify(UserSettings.getShownColumns()));
				break;
			}

			case 'target-services':
				// 検索対象のサービスの選択
				if (input.checked) {
					Alert.enableService(input.value);
				} else {
					Alert.disableService(input.value);
				}
				GM.setValue('target-services', JSON.stringify(UserSettings.getTargetServices()));
				break;

			case 'exclusionMemberOnly':
				// プライベート配信の非表示
				if (input.checked) {
					TableProcessor.removePrivatePrograms();
					GM.setValue('exclusionMemberOnly', true);
				} else {
					GM.deleteValue('exclusionMemberOnly');
				}
				break;

			case 'ellipsisTooLongRSSData':
				// 文字数制限を超えている場合に省略
				if (input.checked) {
					GM.deleteValue('ellipsisTooLongRSSData');
				} else {
					GM.setValue('ellipsisTooLongRSSData', false);
				}
				break;

			case 'languageFilter':
				// 言語で絞り込み
				if (input.checked) {
					GM.deleteValue('languageFilter');
				} else {
					GM.setValue('languageFilter', false);
				}
				break;

			default:
				if (input.accept === 'audio/*') {
					// 音楽ファイルが選択された時
					const file = input.files[0];
					if (file) {
						const alertTone = document.getElementById('alert-tone');
						if (alertTone.canPlayType(file.type)) {
							const alertReader = new FileReader();
							alertReader.addEventListener('load', function (event) {
								UserSettings.setAudioData(event.target.result);
							});
							alertReader.readAsDataURL(file);
						} else {
							window.alert(_('使用中のブラウザが対応していないファイル形式です。'));
						}
					}
				}
		}
	});

	// ダブルクリックした検索語句・除外URLを新しいタブで開く
	document.getElementById('main-settings').addEventListener('dblclick', function (event) {
		const textarea = event.target;
		if (textarea.localName === 'textarea') {
			/**
			 * ダブルクリックされた位置。
			 * @type {number}
			 */
			const clickedPosition = textarea.selectionStart;

			// ダブルクリックされた行を取得
			const words = textarea.value;
			let beginSlice = words.lastIndexOf(
				'\n',
				words.slice(clickedPosition, clickedPosition + 1) === '\n' ? clickedPosition - 1 : clickedPosition
			);
			if (beginSlice === -1) {
				beginSlice = 0;
			}
			const endSlice = words.indexOf('\n', clickedPosition);
			const word = words.slice(beginSlice === -1 ? 0 : beginSlice, endSlice === -1 ? undefined : endSlice).trim();

			if (word) {
				const url = textarea.name === 'searching-words'
					? 'http://live.nicovideo.jp/search/' + encodeURIComponent(word)
					: UserSettings.parseExclusion(word);
				if (url) {
					window.open(url);
				}
			}
		}
	});

	/**
	 * 現在のドラッグイベント。
	 * @type {DragEvent}
	 */
	let draggingEvent;

	// 列の位置
	table.addEventListener('dragstart', function (event) {
		draggingEvent = event;
		if (event.target.localName === 'th' && document.querySelector('#programs thead tr').contains(event.target)) {
			event.dataTransfer.setData('Text', '');
			// 他のスクリプトを抑制
			event.stopPropagation();
		}
	});

	const headRow = document.querySelector('#programs thead tr');
	headRow.addEventListener('drag', function (event) {
		if (event.target.localName === 'th') {
			// 他のスクリプトを抑制
			event.stopPropagation();
		}
	});

	headRow.addEventListener('dragover', function (event) {
		if (draggingEvent.target.localName === 'th' && event.currentTarget.contains(draggingEvent.target)) {
			event.preventDefault();
			// 項目の移動先
			const className = event.pageX < event.target.offsetLeft + event.target.offsetWidth / 2
				? 'inserting-before'
				: 'inserting-after';
			if (!event.target.classList.contains(className)) {
				TableProcessor.removeOldClassName();
				event.target.classList.add(className);
			}
		}
	});

	headRow.addEventListener('dragleave', function (event) {
		if (draggingEvent.target.localName === 'th' && event.currentTarget.contains(draggingEvent.target)) {
			TableProcessor.removeOldClassName();
		}
	});

	main.addEventListener('drop', async function (event) {
		const row = event.currentTarget.querySelector('thead tr');
		if (draggingEvent.target.localName === 'th' && row.contains(draggingEvent.target)
			&& event.target.localName === 'th' && row.contains(event.target)) {
			// 項目を移動
			const refIndex = event.target.cellIndex + (event.target.classList.contains('inserting-before') ? 0 : 1);
			if (draggingEvent.target.cellIndex !== refIndex) {
				// 変更があれば
				TableProcessor.moveColumn(draggingEvent.target, refIndex);

				// 設定を保存
				await GM.setValue('columns-position', JSON.stringify(TableProcessor.getColumnPositions()));
			}

			event.target.classList.remove('inserting-before');
			event.target.classList.remove('inserting-after');
		} else if (event.target.name === 'ng-communities') {
			// NG コミュニティを追加
			event.preventDefault();

			// 他のスクリプトを阻害しないよう dragend イベントを発生させておく
			const init = {};
			for (const key in draggingEvent) {
				init[key] = draggingEvent[key];
			}
			draggingEvent.target.dispatchEvent(new DragEvent('dragend', init));

			event.target.value += '\n' + event.dataTransfer.getData('Text');
			document.getElementsByName('save-ng-communities')[0].click();
		}
	});

	// 列の位置
	const columnPositions = await GM.getValue('columns-position');
	if (columnPositions) {
		await TableProcessor.reflectColumnPositions(version, JSON.parse(columnPositions));
	}

	// 並び順
	let order = await GM.getValue('order');
	if (order) {
		order = JSON.parse(order);
		if (order.name !== UserSettings.schema.properties.order.default.name
			|| order.order !== UserSettings.schema.properties.order.default.order) {
			TableProcessor.sort(document.getElementById(order.name));
		} else {
			await GM.deleteValue('order');
		}
	}

	// 表示される列
	const visibleColumnsJSON = await GM.getValue('visible-columns');
	await UserSettings.showColumns(version, visibleColumnsJSON
		? JSON.parse(visibleColumnsJSON)
		: UserSettings.schema.properties['visible-columns'].default);

	// 現在のバージョン番号を保存
	await GM.setValue('version', GM.info.script.version);

	// 外部からの除外リスト取得
	const NGsURI = await GM.getValue('NGsURI');
	let preprocessing;
	if (NGsURI) {
		preprocessing = new HTTPRequest({
			method: 'GET',
			url: NGsURI,
			responseType: 'json',
			timeout: 30 * DateUtils.SECONDS_TO_MILISECONDS,
			mode: 'no-cors',
		}).send().then(function (response) {
			UserSettings.exclusionsFromExternal = UserSettings.parseExclusions(response);
			UserSettings.exclusions = UserSettings.exclusions.concat(UserSettings.exclusionsFromExternal);
		}).catch(function (error) {
			window.alert(_('指定された URL から、除外 URL リストを読み込めませんでした。\n取得せずに続行します。\n\nエラーメッセージ：\n%s').replace('%s', error));
		}).then();
	} else {
		preprocessing = Promise.resolve();
	}

	// 検索開始
	preprocessing.then(function () {
		Alert.initialize();
		Alert.restart();

		// 経過時間の定期的な更新
		TableProcessor.startUpdatingDurations();
	});
}

/**
 * アラートページのURL。
 * @type {string}
 */
const alertPageURL = 'https://live.nicovideo.jp/ranking?' + Alert.ID;

/**
 * v5.3.3までのアラートページのURL。
 * @type {string}
 */
const oldAlertPageURL = 'http://live.nicovideo.jp/alert/?' + Alert.ID;

if (location.href === oldAlertPageURL) {
	location.replace(alertPageURL);
} else if (location.href !== alertPageURL && location.href !== alertPageURL.replace('http://', 'https://')) {
	GM.registerMenuCommand(Alert.NAME, function () {
		GM.openInTab(alertPageURL);
	});
} else {
	startScript(
		main,
		parent => parent.localName === 'body',
		target => target.id === 'utility_link',
		() => document.getElementById('utility_link')
	);
}
