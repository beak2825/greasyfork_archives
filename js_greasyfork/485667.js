// ==UserScript==
// @name			Sfera Helper
// @description 	Download Sfera files
// @license         MIT
// @version			1.0.1
// @namespace		Violentmonkey Scripts
// @include			https://www.sferastudios.com/htmlApp/*
// @grant			unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/485667/Sfera%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/485667/Sfera%20Helper.meta.js
// ==/UserScript==

var subCache = Array();
var menuOptionCache = null;

const processMessage = e => {
	const {type, data} = e.detail;

	if (type === 'subs') {
		//console.log(data);
		subCache.push(data);

		if (menuOptionCache != null) {
			menuOptionCache.innerHTML = "Download subs (" + subCache.length + ")";
		}
	}
}

const downloadFile = (data, filename) => {
	let file = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

const msToTime = duration => {
	let milliseconds = Math.floor(duration % 1000),
	seconds = Math.floor((duration / 1000) % 60),
	minutes = Math.floor((duration / (1000 * 60)) % 60),
	hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds + "," + milliseconds;
}

const downloadThis = () => {
	if (subCache.length === 0) {
		alert("No subs loaded!");
		return;
	}

	const fileNameBase = document.querySelector('.app-version-info span:first-child').innerHTML.replace(/([^a-z0-9-_ ]+)/gi, '');

	subCache.forEach(sub => {
		let fileName = fileNameBase + " " + sub.subtitle.langCode + ".srt";
		let lines = [];
		let counter = 1;

		sub.subtitle.rows.forEach(row => {
			if (row.text) {
				let timecodeIn = msToTime(row.startTime);
				let timecodeOut = msToTime(row.endTime);

				lines.push("" + counter);
				lines.push(timecodeIn + " --> " + timecodeOut);
				lines.push((row.verticalAlign === 0 ? "{\\an8}" : "") + row.text.replace(/(?:\r\n|\r|\n)/g, '\r\n'));
				lines.push("");

				counter++;
			}
		});

		downloadFile(lines.join('\r\n'), fileName);
	});
};

const injection = () => {
	// Hijack JSON.parse function
	((parse) => {
		JSON.parse = function (text) {
			const data = parse(text);

			if (data && data.subtitle && data.subtitle.langCode && data.subtitle.rows) {
				window.dispatchEvent(new CustomEvent('sfera_data', {detail: {type: 'subs', data: data}}));
			}
			return data;
		};
	})(JSON.parse);
}

window.addEventListener('sfera_data', processMessage, false);

// Inject script
const sc = document.createElement('script');
sc.innerHTML = '(' + injection.toString() + ')()';
document.head.appendChild(sc);
document.head.removeChild(sc);

// Wait until menu is visible, then add menu option
let interval = setInterval(function() {
	let targetElement = document.querySelector('.app-version-info');
	if (targetElement != null) {
		clearInterval(interval);

		targetElement.innerHTML = targetElement.innerHTML + ' | <a class="download">Download subs</a>';

		let menuOption = targetElement.querySelector('.download');
		menuOption.innerHTML = "Download subs (" + subCache.length + ")";
		menuOption.addEventListener('click', downloadThis);

		menuOptionCache = menuOption;
	}
}, 1000);