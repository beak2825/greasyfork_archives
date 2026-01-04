// ==UserScript==
// @name           Get Page Title
// @description    Extract web video title
// @namespace https://greasyfork.org/users/3920
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20251006121143
// @downloadURL https://update.greasyfork.org/scripts/388784/Get%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/388784/Get%20Page%20Title.meta.js
// ==/UserScript==

(function () {
let GetJson = function (url, options = {}) {
  return fetch(url, options)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return data;
  });
};

	copyToClipboard = function(val) {
		let t = document.createElement("textarea");
		document.body.appendChild(t);
		t.value = val;
		t.select();
		document.execCommand('copy');
		document.body.removeChild(t);
	}

	function CreateTable(col, row, color = "") {
		if (color === "")
			color = "white";

		let row_dom = document.createElement('div');
		row_dom.setAttribute('id', row);
		row_dom.setAttribute('style', 'color:' + color + ';font:12px Meiryo;');
		row_dom.setAttribute('onclick', 'copyToClipboard(this.getAttribute("value"));');

		let col_dom = document.getElementById(col);
		if(col_dom === null) {
			col_dom = document.createElement('div');
			col_dom.setAttribute('id', col);
			col_dom.setAttribute('style', 'display:table-cell;padding:0px 10px 0px 10px; vertical-align:middle;');

			let table_dom = document.getElementById('resulttable');
			if(table_dom === null)
				CreateLayout();
			table_dom = document.getElementById('resulttable');
			if(table_dom !== null)
				table_dom.appendChild(col_dom);
		}

		col_dom.appendChild(row_dom);
	}

	function CreateLayout(color) {
		let trends_dom = document.getElementById('extractresult');
		if (trends_dom !== null)
			trends_dom.outerHTML = "";
		trends_dom = document.createElement('div');
		trends_dom.setAttribute('id', 'extractresult');
		let title_dom = document.createElement('strong');
		title_dom.innerHTML = [
			'<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div id="resulttable" style="display: inline-table;">',
			'</div></div>'
		].join(' ');

		trends_dom.appendChild(title_dom);
		trends_dom.style.cssText = [
			'background: rgba(55, 55, 55, 0.5);',
			'color: #fff;',
			'padding: 0px;',
			'position: fixed;',
			'z-index:102400;',
			'width:100%;',
			'font: 12px Meiryo;',
			'vertical-align: middle;',
		].join(' ');
		document.body.style.cssText = 'position: relative; margin-top: 0px';
		document.body.insertBefore(trends_dom, document.body.firstElementChild);
	}

	function SetResult(name, value, col_id, row_id, color = "") {
		let elem = document.getElementById(row_id);
		if (elem === null)
			CreateTable(col_id, row_id, color);

		elem = document.getElementById(row_id);
		if (elem !== null) {
			elem.setAttribute('value', value);
			elem.innerHTML = name;
		}
	}

	function Convert(title) {
		return title.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/%/g, "％").replace(/\</g, "〈").replace(/\>/g, "〉");
	}

  function TverVideo(filename) {
    if (!window.videojs) return;
    for (let src of window.videojs.players[Object.keys(window.videojs.players)[0]].mediainfo.sources) {
      if (/mpegurl/.test(src.type)) {
        //console.log(src);
        SetResult(`Video : ${filename}`, `${src.src}\n${filename}\n`, "right", "video");
        break;
      }
    }
  }
function TverKey() {
  /**
   * 주어진 시간만큼 현재 시간에서 더한 값을 밀리초 단위의 타임스탬프로 반환합니다.
   * @param {object} options - 더할 시간을 나타내는 객체입니다. 예: { hours: 9 }
   * @returns {number} - 1970-01-01T00:00:00Z부터 경과한 시간을 밀리초로 나타낸 타임스탬프입니다.
   */
  function timeMilliseconds(options = {}) {
    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = options;
    const future = new Date();
    future.setDate(future.getDate() + days);
    future.setHours(future.getHours() + hours);
    future.setMinutes(future.getMinutes() + minutes);
    future.setSeconds(future.getSeconds() + seconds);
    return future.getTime();
  }

  const futureTimestamp = timeMilliseconds({ hours: 9 });
  const date = new Date(futureTimestamp);

  // UTC 기준 월을 가져옵니다 (0 = 1월, 1 = 2월, ...). 1을 더해 1-12 범위로 맞춥니다.
  const month = date.getUTCMonth() + 1;

  // 파이썬의 'or'와 동일한 기능을 하는 논리 연산자 '||'를 사용합니다.
  // month % 6의 결과가 0 (falsy)이면 6을 할당합니다.
  const key_idx = (month % 6) || 6;
  return key_idx;
}

  async function TverVideoDownload(pid, vid) {
    let _STREAKS_API_INFO = await GetJson('https://player.tver.jp/player/streaks_info_v2.json');
    let info = await GetJson(`https://mocho.pp.ua/tver/info.php?pid=${pid}&vid=${vid}&key=${_STREAKS_API_INFO[pid]['api_key'][`key0${TverKey()}`]}`);
    if (undefined === info.sources) return '';
    for (let src of info.sources) {
      if ('1920x1080' == src.resolution) return src.src;
    }
    return '';
/*
    a=document.createElement('a');
    a.href=`ytdlp:tver@_@${filename}@_@null@_@${window.location.href}`;
    a.click();
    a.remove();
*/
  }

	async function TverInfo(json) {
		let filename = "";

		if (json.broadcastDateLabel !== undefined) {
			let date = /((\d+)[^\d]+(\d+)|(\d{4})).+/gm.exec(json.broadcastDateLabel);
			if(date !== null) {
				if(date[4] === undefined) {
					let today = new Date();
					let yyyy = today.getFullYear();
					let mm = (date[2].length > 1 ? "" : "0") + date[2];
					let dd = (date[3].length > 1 ? "" : "0") + date[3];
					filename = yyyy + mm + dd;
				} else {
					filename = date[4];
				}
			}
		}

		if (json.share !== undefined && json.share.text !== undefined && json.share.text.match(/([^\n]+)/)) {
			filename += (filename.length === 0 ? "" : " ") + RegExp.$1;
		}

		let episode = document.querySelectorAll('span[class^="titles_title"]');
		if(json.title !== undefined && json.title !== "")
			filename += " " + json.title;

/*
		let onair = document.querySelectorAll('div[class^="description_metaDetail"]');
		if(onair.length > 0 && onair[0].innerText !== "") {
			onair = onair[0].getElementsByTagName("span");
			if(onair.length > 1 && onair[1].innerText !== "") {
				let date = /((\d+)[^\d]+(\d+)|(\d{4})).+/gm.exec(onair[1].innerText);
				if(date !== null) {
					if(date[4] === undefined) {
						let today = new Date();
						let yyyy = today.getFullYear();
						let mm = (date[2].length > 1 ? "" : "0") + date[2];
						let dd = (date[3].length > 1 ? "" : "0") + date[3];
						filename = yyyy + mm + dd;
					} else {
						filename = date[4];
					}
				}
			}
		}

		let title = document.querySelectorAll('span[class^="titles_seriesTitle"]');
		if(title.length > 0 && title[0].innerText !== "")
			filename += (filename.length === 0 ? "" : " ") + title[0].innerText;

		let episode = document.querySelectorAll('span[class^="titles_title"]');
		if(episode.length > 0 && episode[0].innerText !== "")
			filename += " " + episode[0].innerText;
*/

		filename = Convert(filename);
		let hls = await TverVideoDownload(json.streaks.projectID, json.streaks.videoRefID);
		if ('' !== hls)
			SetResult('HLS copy', `${hls}\n${filename}\n`, "right", "video");
		else
			SetResult('error', '', "right", "video");
		SetResult(filename, filename, "right", "title");
		TverVideo(filename);

		if(json.id !== undefined) {
			let img = `https://statics.tver.jp/images/content/thumbnail/episode/xlarge/${json.id}.jpg`;
			SetResult('<a href="' + img + '" download="' + filename + '"><img src="' + img + '" width="300px"></a>', img, "right", "thum");
		}

		console.log(filename);
	}

	function Tver() {
		let id = document.location.href;
		if (id.match(/([^\/\?$]+)(?:$|\?)/))
			id = RegExp.$1;
		else
			id = "";

		if (id === "") {
			console.log("not detected");
		}

		let xmlhttp = new XMLHttpRequest();
		let url = `https://statics.tver.jp/content/episode/${id}.json`;

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				if (xmlhttp.status == 200) {
					TverInfo(JSON.parse(xmlhttp.responseText));
				} else if (xmlhttp.status == 400) {
					console.log('There was an error 400');
				} else {
					console.log('something else other than 200 was returned');
				}
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	function NicoLive() {
		let onair = $("*[class^='___onair-time___']")[0].getAttribute("datetime").replace(/(\d+)-(\d+)-(\d+).*/g, "$1$2$3");
		let title = document.getElementsByTagName("h1");
		if(title.length == 1)
			title = title[0].innerText;
		else
			title = $("*[class^='___title___']")[0].innerText;
		title = Convert(onair + " " + title);
		SetResult(title, title, "right", "title");
	}

	function NicoArchive() {
		let onair = document.querySelector('time').getAttribute("datetime").replace(/(\d+)-(\d+)-(\d+).*/g, "$1$2$3");
		let title = document.querySelector('.fs_xl.fw_bold').textContent;

		title = Convert(onair + " " + title);
		SetResult(title, title, "right", "title");
	}

	function Main() {
		if(typeof(jQuery) == 'undefined') {
			let jquery = document.createElement('script');
			jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
			document.body.appendChild(jquery);
			setTimeout(Main, 100);
			return;
		}

		let url = document.location.href;
		let extractFunc = null;
		if (/tver.jp/gi.test(url))
			extractFunc = Tver;
		else if (/live2?\.nicovideo\.jp/gi.test(url))
			extractFunc = NicoLive;
		else if (/nicovideo\.jp\/watch/.test(url))
			extractFunc = NicoArchive;

		extractFunc();
	}
	Main();
})();