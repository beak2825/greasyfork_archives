// ==UserScript==
// @name          KGrabber
// @namespace     thorou
// @version       3.3.2-b107
// @description   extracts links from kissanime.ru and similar sites
// @author        Thorou
// @license       GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL   https://github.com/thorio/KGrabber/
// @match         http*://kissanime.ru/*
// @match         http*://kimcartoon.to/*
// @match         http*://kissasian.sh/*
// @match         http*://kisstvshow.to/*
// @connect       rapidvideo.com
// @connect       googleusercontent.com
// @connect       googlevideo.com
// @connect       fembed.com
// @grant         GM_xmlhttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @run-at        document-end
// @noframes
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/383649/KGrabber.user.js
// @updateURL https://update.greasyfork.org/scripts/383649/KGrabber.meta.js
// ==/UserScript==

// bundled with browserify
(function() {

function outer(modules, cache, entry) {
    var previousRequire = typeof require == "function" && require;

    function newRequire(name, jumped){
        if(!cache[name]) {
            if(!modules[name]) {
                var currentRequire = typeof require == "function" && require;
                if (!jumped && currentRequire) return currentRequire(name, true);
                if (previousRequire) return previousRequire(name, true);
                var err = new Error('Cannot find module \'' + name + '\'');
                err.code = 'MODULE_NOT_FOUND';
                throw err;
            }
            var m = cache[name] = {exports:{}};
            modules[name][0].call(m.exports, function(x){
                var id = modules[name][1][x];
                return newRequire(id ? id : x);
            },m,m.exports,outer,modules,cache,entry);
        }
        return cache[name].exports;
    }
    for(var i=0;i<entry.length;i++) newRequire(entry[i]);
    return newRequire;
}

return outer;

})()({1:[function(require,module,exports){
"use strict";
// src\js\actions\beta.js

const util = require("../util"),
	shared = require("./shared"),
	{ Action, LinkTypes } = require("kgrabber-types");

module.exports = [
	getAction(["beta", "beta5"], LinkTypes.DIRECT),
	getAction(["beta360p"], LinkTypes.HLS),
];

function getAction(servers, resultType) {
	return new Action("decrypt", {
		executeFunc: async (status, setProgress) => {
			await shared.eachEpisode(status.episodes, decrypt, setProgress);
			status.linkType = resultType;
		},
		availableFunc: (action, status) => {
			return shared.availableFunc(status, {
				linkType: LinkTypes.OVELWRAP,
				servers: servers,
			});
		},
		automatic: true,
	});
}

async function decrypt(episode) {
	if (episode.error) {
		return;
	}
	episode.processedLink = await util.kissCrypto.decrypt(episode.functionalLink);
}

},{"../util":55,"./shared":5,"kgrabber-types":37}],2:[function(require,module,exports){
"use strict";
// src\js\actions\generic.js

const shared = require("./shared"),
	config = require("../config"),
	{ Action } = require("kgrabber-types");

module.exports = [
	new Action("reset", {
		executeFunc: async (status, setProgress) => {
			await shared.eachEpisode(status.episodes, reset, setProgress);
			status.linkType = config.sites.current().servers.get(status.serverID).linkType;
			status.hasReset = true;
		},
		availableFunc: (action, status) => {
			for (let episode of status.episodes) {
				if ((episode.error && episode.grabbedLink) || episode.processedLink) {
					return true;
				}
			}
			return false;
		},
	}),
];

async function reset(episode) {
	episode.error = "";
	episode.processedLink = "";
}

},{"../config":6,"./shared":5,"kgrabber-types":37}],3:[function(require,module,exports){
"use strict";
// src\js\actions\index.js

const statusManager = require("../statusManager");

const status = statusManager.get();

let actions = [].concat(
	require("./generic"),
	require("./beta"),
	require("./nova")
);

exports.all = () =>
	actions;

exports.available = () =>
	actions.filter((action) =>
		action.isAvailable(status)
	);

exports.add = (...action) => {
	actions.push(...action);
};

exports.execute = async (action, setSpinnerText) => {
	await action.invoke(status, setSpinnerText);
	if (action.automatic) {
		status.automaticDone = true;
	}
};

},{"../statusManager":41,"./beta":1,"./generic":2,"./nova":4}],4:[function(require,module,exports){
"use strict";
// src\js\actions\nova.js

const ajax = require("../util/ajax"),
	util = require("../util"),
	preferenceManager = require("../config/preferenceManager"),
	shared = require("./shared"),
	{ Action, LinkTypes } = require("kgrabber-types");

const preferences = preferenceManager.get();

module.exports = [
	new Action("get direct links", {
		executeFunc: async (status, setProgress) => {
			await shared.eachEpisode(status.episodes, getDirect, setProgress);
			status.linkType = LinkTypes.DIRECT;
		},
		availableFunc: (action, status) => {
			return shared.availableFunc(status, {
				linkType: LinkTypes.EMBED,
				servers: ["nova", "fe"],
			});
		},
	}),
];

async function getDirect(episode) {
	if (episode.error) return;

	let sources = await getSources(episode);
	if (!sources) return;

	let url = findQuality(episode, sources);
	if (!url) return;

	episode.processedLink = url;
}



async function getSources(episode) {
	let response = await ajax.post(`https://www.fembed.com/api/source/${episode.functionalLink.match(/\/([^/]*?)$/)[1]}`);
	let json;

	try {
		json = JSON.parse(response.response);
	} catch (error) {
		episode.error = "parsing error";
		util.log.err(episode.error, episode, response);
		return null;
	}

	if (!json.success) {
		episode.error = json.data;
		util.log.err(episode.error, episode, response);
		return null;
	}

	return json.data;
}

function findQuality(episode, sources) {
	let parsedQualityPrefs = preferences.general.quality_order.replace(/\s/g, "").split(",");

	for (let quality of parsedQualityPrefs) {
		let source = sources.find((s) => s.label == quality + "p");
		if (source) return source.file;
	}

	let availableQualities = sources.map((s) => s.label).join(", ");
	episode.error = "preferred qualities not found. available: " + availableQualities;
	util.log.err(episode.error, episode, sources);
}

},{"../config/preferenceManager":7,"../util":55,"../util/ajax":54,"./shared":5,"kgrabber-types":37}],5:[function(require,module,exports){
"use strict";
// src\js\actions\shared.js

const util = require("../util");

exports.eachEpisode = (episodes, func, setProgress) => {
	let promises = [];
	let progress = 0;
	for (let episode of episodes) {
		promises.push(
			func(episode).catch((e) => {
				episode.error = "something went wrong; see console for details";
				util.log.err(e);
			}).finally(() => {
				progress++;
				setProgress(`${progress}/${promises.length}`);
			})
		);
	}
	setProgress(`0/${promises.length}`);
	return Promise.all(promises);
};

exports.availableFunc = (status, { linkType, servers }) => {
	if (!servers.includes(status.serverID)) {
		return false;
	}
	if (linkType != status.linkType) {
		return false;
	}
	return true;
};

},{"../util":55}],6:[function(require,module,exports){
"use strict";
// src\js\config\index.js
module.exports = {
	preferenceManager: require("./preferenceManager"),
	sites: require("./sites"),
};

},{"./preferenceManager":7,"./sites":8}],7:[function(require,module,exports){
"use strict";
// src\js\config\preferenceManager.js
const util = require("../util");

const defaultPreferences = {
	general: {
		quality_order: "1080, 720, 480, 360",
	},
	internet_download_manager: {
		idm_path: "C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe",
		download_path: "%~dp0",
		arguments: "/a",
		keep_title_in_episode_name: false,
	},
	compatibility: {
		force_default_grabber: false,
		enable_experimental_grabbers: false,
		disable_automatic_actions: false,
	},
};

let preferences;

exports.get = () => {
	if (preferences === undefined) {
		preferences = load(defaultPreferences);
	}
	return preferences;
};

let save = exports.save = (newPreferences) => {
	util.clear(preferences);
	util.merge(preferences, newPreferences);
	GM_setValue("KG-preferences", JSON.stringify(preferences));
};

exports.reset = () =>
	save({});

function load(defaults) {
	let saved = JSON.parse(GM_getValue("KG-preferences", "{}"));

	for (let i in saved) {
		if (defaults[i] === undefined) { 
			delete saved[i];
		} else {
			for (let j in saved[i]) {
				if (defaults[i][j] === undefined) { 
					delete saved[i][j];
				}
			}
		}
	}
	return util.merge(util.clone(defaults), saved);
}

function getPreferredServers() {
	return JSON.parse(GM_getValue("preferredServers", "{}"));
}

function savePreferredServers(servers) {
	GM_setValue("preferredServers", JSON.stringify(servers));
}

exports.getPreferredServer = (host) =>
	getPreferredServers()[host];

exports.setPreferredServer = (host, server) => {
	let saved = getPreferredServers();
	saved[host] = server;
	savePreferredServers(saved);
};

},{"../util":55}],8:[function(require,module,exports){
"use strict";
// src\js\config\sites\index.js

const { Dictionary } = require("kgrabber-types"),
	page = require("../../ui/page");

const sites = new Dictionary([
	require("./kissanime_ru"),
	require("./kimcartoon"),
	require("./kissasian"),
	require("./kisstvshow"),
]);

exports.current = () =>
	sites.get(page.location.hostname);

exports.add = (...newSites) => {
	sites.add(...newSites);
};

},{"../../ui/page":48,"./kimcartoon":9,"./kissanime_ru":10,"./kissasian":11,"./kisstvshow":12,"kgrabber-types":37}],9:[function(require,module,exports){
"use strict";
// src\js\config\sites\kimcartoon.js
const { Server, Site, Dictionary, LinkTypes } = require("kgrabber-types"),
	uiFix = require("./patches/kimcartoon_UIFix");

let servers = new Dictionary([
	new Server("hx", {
		regex: /src="(\/\/playhydrax.com\/\?v=.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "HX (hydrax)",
		linkType: LinkTypes.EMBED,
	}),

	new Server("fe", {
		regex: /"(https:\/\/www.luxubu.review\/v\/.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "FE (luxubu.review)",
		linkType: LinkTypes.EMBED,
	}),

	new Server("beta", {
		regex: /"(https:\/\/redirector.googlevideo.com\/videoplayback\?.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Beta",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("alpha", {
		regex: /"(https:\/\/redirector.googlevideo.com\/videoplayback\?.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Alpha (googleusercontent.com)",
		linkType: LinkTypes.DIRECT,
	}),
]);

module.exports = new Site("kimcartoon.to", {
	contentPath: "Cartoon",
	noCaptchaServer: "rapid",
	buttonColor: "#ecc835",
	buttonTextColor: "#000",
	servers,
	patches: uiFix,
});

},{"./patches/kimcartoon_UIFix":13,"kgrabber-types":37}],10:[function(require,module,exports){
"use strict";
// src\js\config\sites\kissanime_ru.js
const { Server, Site, Dictionary, LinkTypes } = require("kgrabber-types");

let servers = new Dictionary([
	new Server("hydrax", {
		regex: /"(https:\/\/playhydrax.com\/\?v=.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "HydraX (no captcha)",
		linkType: LinkTypes.EMBED,
		customStep: "modalBegin",
	}),

	new Server("nova", {
		regex: /"(https:\/\/(?:www).(?:feurl.com|novelplanet.me)\/v\/.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Nova",
		linkType: LinkTypes.EMBED,
		customStep: "modalBegin",
	}),

	new Server("beta", {
		regex: /<select id="slcQualix"><option value="([^"]+)" ?(selected)?>/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Beta",
		linkType: LinkTypes.OVELWRAP,
		customStep: "modalBegin",
	}),

	new Server("beta360p", {
		regex: /<select id="slcQualix"><option value="([^"]+)" ?(selected)?>/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Beta360P",
		linkType: LinkTypes.OVELWRAP,
		customStep: "modalBegin",
	}),

	new Server("beta5", {
		regex: /<select id="slcQualix"><option value="([^"]+)" ?(selected)?>/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Beta5",
		linkType: LinkTypes.OVELWRAP,
		customStep: "modalBegin",
	}),

	new Server("mp4upload", {
		regex: /"(https:\/\/www.mp4upload.com\/embed-.*?)"/,
		captureGroup: 1,
		trimQuotes: false,
		name: "Mp4Upload",
		linkType: LinkTypes.EMBED,
		customStep: "modalBegin",
	}),
]);

module.exports = new Site("kissanime.ru", {
	contentPath: "Anime",
	noCaptchaServer: "hydrax",
	buttonColor: "#548602",
	buttonTextColor: "#fff",
	servers,
});

},{"kgrabber-types":37}],11:[function(require,module,exports){
"use strict";
// src\js\config\sites\kissasian.js
const { Server, Site, Dictionary, LinkTypes } = require("kgrabber-types"),
	uiFix = require("./patches/kissasian_UIFix");

let servers = new Dictionary([
	new Server("openload", {
		regex: /"https:\/\/openload.co\/embed\/.*?"/,
		name: "Openload",
		linkType: LinkTypes.EMBED,
	}),

	new Server("beta", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "Beta",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("fe", {
		regex: /"https:\/\/www.gaobook.review\/v\/.*?"/,
		name: "FE (gaobook.review)",
		linkType: LinkTypes.EMBED,
	}),

	new Server("mp", {
		regex: /"https:\/\/www.mp4upload.com\/embed-.*?"/,
		name: "MP (mp4upload.com)",
		linkType: LinkTypes.EMBED,
	}),

	new Server("fb", {
		regex: /"https:\/\/video.xx.fbcdn.net\/v\/.*?"/,
		name: "FB (fbcdn.net)",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("alpha", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "Alpha",
		linkType: LinkTypes.DIRECT,
	}),
]);

module.exports = new Site("kissasian.sh", {
	contentPath: "Drama",
	noCaptchaServer: "rapid",
	buttonColor: "#F5B54B",
	buttonTextColor: "#000",
	servers,
	patches: uiFix,
});

},{"./patches/kissasian_UIFix":14,"kgrabber-types":37}],12:[function(require,module,exports){
"use strict";
// src\js\config\sites\kisstvshow.js
const { Server, Site, Dictionary, LinkTypes } = require("kgrabber-types");

let servers = new Dictionary([
	new Server("openload", {
		regex: /"https:\/\/openload.co\/embed\/.*?"/,
		name: "Openload",
		linkType: LinkTypes.EMBED,
	}),

	new Server("streamango", {
		regex: /"https:\/\/streamango.com\/embed\/.*?"/,
		name: "Streamango",
		linkType: LinkTypes.EMBED,
	}),

	new Server("beta", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "Beta",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("fb", {
		regex: /"https:\/\/video.xx.fbcdn.net\/v\/.*?"/,
		name: "FB (fbcdn.net)",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("gp", {
		regex: /"https:\/\/redirector.googlevideo.com\/videoplayback\?.*?"/,
		name: "GP (googleusercontent.com)",
		linkType: LinkTypes.DIRECT,
	}),

	new Server("fe", {
		regex: /"https:\/\/www.rubicstreaming.com\/v\/.*?"/,
		name: "FE (rubicstreaming.com)",
		linkType: LinkTypes.EMBED,
	}),
]);

module.exports = new Site("kisstvshow.to", {
	contentPath: "Show",
	noCaptchaServer: "rapid",
	buttonColor: "#F5B54B",
	buttonTextColor: "#000",
	servers,
});

},{"kgrabber-types":37}],13:[function(require,module,exports){
"use strict";
// src\js\config\sites\patches\kimcartoon_UIFix.js
exports.linkDisplay = () => {
	let $ld = $("#KG-linkdisplay");
	$("#KG-linkdisplay-title").css({
		"font-size": "20px",
		"color": $("a.bigChar").css("color"),
	});
	fixTitle($ld);
};

exports.preferences = () => {
	let $pf = $("#KG-preferences");
	fixTitle($pf);
};

exports.widget = () => {
	let $opts = $("#KG-opts-widget");
	$opts.insertAfter(`#rightside .clear2:eq(2)`);
	let title = $opts.find(".barTitle").html();
	$opts.before(`<div class="title-list icon">${title}</div><div class="clear2"></div>`);
	$(".icon:eq(1)").css({ "width": "100%", "box-sizing": "border-box" });
	$(".KG-preferences-button").css("margin-top", "5px");
	$opts.find(".barTitle").remove();
	fixTitle($opts);
};

function fixTitle(element) {
	$(".KG-dialog-title").css("font-size", "18px");
	element.find(".arrow-general").remove();
	element.find(".barTitle").removeClass("barTitle")
		.css({
			"height": "20px",
			"padding": "5px",
		});
}

},{}],14:[function(require,module,exports){
"use strict";
// src\js\config\sites\patches\kissasian_UIFix.js
exports.widget = () => {
	$(".KG-preferences-button").css("filter", "invert(0.7)");
};

},{}],15:[function(require,module,exports){
"use strict";
// generated file, provides contents of src\css
module.exports = `
/* src\css\captchaModal.less */
.KG-captchaModal-container {
  background-color: #0005;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 9000;
  overflow: hidden scroll;
}
.KG-captchaModal {
  width: 1000px;
  margin: auto;
  margin-top: 195px;
  margin-bottom: 50px;
}
.KG-captchaModal-description-header {
  width: 100%;
  font-size: 1.7em;
  text-align: center;
}
.KG-captchaModal-description-header span {
  color: #d5f406;
  margin-right: 20px;
}
.KG-captchaModal-description-header span:not(:last-child)::after {
  content: "-";
  margin-left: 20px;
  color: #fff;
}
.KG-captchaModal-image-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.KG-captchaModal-image-container img {
  margin: 30px;
  width: 160px;
  cursor: pointer;
}
.KG-captchaModal-image-container img.active {
  outline: 5px solid #d5f406;
}
#KG-captchaModal-status {
  margin-left: 25px;
}

/* src\css\colors.less */

/* src\css\general.less */
.KG-button {
  background-color: #548602;
  color: #fff;
  border: none;
  padding: 5px 12px;
  font-size: 15px;
  margin: 3px;
  float: left;
  cursor: pointer;
}
.KG-button-container {
  margin-top: 10px;
  height: 34px;
}
.KG-dialog-title {
  width: 80%;
  float: left;
}
.KG-dialog-close {
  float: right;
  cursor: pointer;
  font-size: 16px;
  margin-right: -4px;
  margin-top: 1px;
}
.right {
  float: right;
}
.left {
  float: left;
}

/* src\css\linkDisplay.less */
#KG-linkdisplay-text {
  word-break: break-all;
}
.KG-linkdisplay-row {
  display: flex;
  flex-direction: row;
}
.KG-linkdisplay-row a {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.KG-linkdisplay-episodenumber {
  min-width: 30px;
  text-align: right;
  user-select: none;
  margin-right: 5px;
}
#KG-linkdisplay-export {
  margin-top: 10px;
}
#KG-linkdisplay-export-text {
  width: 100%;
  height: 150px;
  min-height: 40px;
  resize: vertical;
  background-color: #222;
  color: #fff;
  border: none;
}
#KG-linkdisplay-export-dropdown {
  margin: 6px;
  float: left;
  color: #fff;
  background-color: #222;
  cursor: pointer;
}

/* src\css\loader.less */
#KG-loader-text {
  width: 100%;
  text-align: center;
  margin-top: -40px;
  margin-bottom: 40px;
  min-height: 20px;
}
/*
	https://projects.lukehaas.me/css-loaders/
*/
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 0px auto;
  font-size: 5px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #ffffff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/* src\css\pageWidgets.less */
.KG-episodelist-header {
  width: 3%;
  text-align: center !important;
}
.KG-episodelist-number {
  text-align: right;
  padding-right: 4px;
}
.KG-episodelist-button {
  background-color: #548602;
  color: #fff;
  border: none;
  cursor: pointer;
}

/* src\css\preferences.less */
#KG-preferences-container-outer {
  overflow: auto;
}
.KG-preferences-header {
  font-size: 17px;
  letter-spacing: 0px;
  width: 100%;
  margin: 10px 0 5px 0;
}
#KG-preferences-container {
  overflow: auto;
}
#KG-preferences-container div {
  box-sizing: border-box;
  height: 26px;
  width: 50%;
  padding: 0 5px;
  margin: 2px 0;
  float: left;
  line-height: 26px;
  font-size: 14px;
}
#KG-preferences-container div span {
  padding-top: 5px;
}
.KG-preferences-button {
  width: 18px;
  height: 18px;
  margin: 3px;
  float: right;
  border: none;
  background: transparent;
  opacity: 0.7;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsSAAALEgHS3X78AAABBklEQVRIidVWOw6DMAx9dGBttq49GkfgKByBo9AbwA26doOxLK4iOTSkTuLSn/okS2CeX8wjHwoighIhsdCU7bTqWyEN0HI8C7nOWuRFS3fYa0NENRH19IienxmhbtGMiTtchZyGswyS+walwqY0J2HRVqwsCqepAXBRdi5hBnAAMLpnoUVVQnwCcOKYIpySNaIWSbOFOG88nslwVxbllrLt9ui/NsPaeQawTxVrVnIviINzfa5YM4AkrsZXLCq8GASOFehY0BfvIuLDSjOYRXVicY1E1HGMCV7904XWvCAOrm1WmTfvQw7q3XRWdJ3mfPrAkQ59d+xVYS/BfXjoi3V//lcB4AYxBp8XouibewAAAABJRU5ErkJggg==");
  background-size: cover;
  cursor: pointer;
}
.KG-preferences-button:hover {
  opacity: 1;
}
.KG-preferences-input-text {
  width: 150px;
  border: 1px solid #666;
  background: #222;
  padding: 3px;
  margin-left: 5px;
  color: #fff;
}
.KG-preferences-input-checkbox {
  height: 22px;
}

/* src\css\widget.less */
.KG-widget-episode {
  width: 40px;
  border: 1px solid #666;
  color: #fff;
  background-color: #222;
  padding: 3px;
}
#KG-widget-server {
  width: 100%;
  font-size: 14.5px;
  color: #fff;
  background-color: #222;
  cursor: pointer;
}
`;
},{}],16:[function(require,module,exports){
"use strict";
// src\js\exporters\aria2c.js

const { LinkTypes, Exporter } = require("kgrabber-types");

module.exports = new Exporter({
	name: "aria2c file",
	extension: "txt",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

function runExport(status) {
	let listing = $(".listing a").get().reverse();
	let str = "";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += `${episode.functionalLink}\n out=${listing[episode.episodeNumber-1].innerText}.mp4\n`;
		}
	}
	return str;
}

},{"kgrabber-types":37}],17:[function(require,module,exports){
"use strict";
// src\js\exporters\csv.js

const { LinkTypes, Exporter } = require("kgrabber-types"),
	page = require("../ui/page");

module.exports = new Exporter({
	name: "csv",
	extension: "csv",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
}, runExport);

function runExport(status) {
	let listing = page.episodeList();
	let str = "episode, name, url\n";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += `${episode.episodeNumber}, ${listing[episode.episodeNumber-1].innerText}, ${episode.functionalLink}\n`;
		}
	}
	return str;
}

},{"../ui/page":48,"kgrabber-types":37}],18:[function(require,module,exports){
"use strict";
// src\js\exporters\html.js

const { LinkTypes, Exporter } = require("kgrabber-types"),
	page = require("../ui/page");

module.exports = new Exporter({
	name: "html list",
	extension: "html",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

function runExport(status) {
	let listing = page.episodeList();
	let str = "<html>\n	<body>\n";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += `<a href="${episode.functionalLink}" download="${listing[episode.episodeNumber-1].innerText}.mp4">${listing[episode.episodeNumber-1].innerText}</a><br>\n`;
		}
	}
	str += "</body>\n</html>\n";
	return str;
}

},{"../ui/page":48,"kgrabber-types":37}],19:[function(require,module,exports){
"use strict";
// src\js\exporters\idmbat.js

const { LinkTypes, Exporter } = require("kgrabber-types"),
	util = require("../util"),
	preferenceManager = require("../config/preferenceManager");

const preferences = preferenceManager.get();

module.exports = new Exporter({
	name: "IDM bat file",
	extension: "bat",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

function runExport(status) {
	let listing = $(".listing a").get().reverse();
	let title = util.makeBatSafe(status.title);
	let str = getHeader(title);
	for (let episode of status.episodes) {
		if (!episode.error) {
			let epTitle = util.makeBatSafe(listing[episode.episodeNumber - 1].innerText);
			if (!preferences.internet_download_manager.keep_title_in_episode_name &&
				epTitle.slice(0, title.length) === title) {
				epTitle = epTitle.slice(title.length + 1);
			}
			str += `"%idm%" /n /p "%dir%\\%title%" /f "${epTitle}.mp4" /d "${episode.functionalLink}" %args%\n`;
		}
	}
	return str;
}

function getHeader(title) {
	return `::download and double click me!
@echo off
set title=${title}
set idm=${preferences.internet_download_manager.idm_path}
set args=${preferences.internet_download_manager.arguments}
set dir=${preferences.internet_download_manager.download_path}
if not exist "%idm%" echo IDM not found && echo check your IDM path in preferences && pause && goto eof
mkdir "%title%" > nul
start "" "%idm%"
ping localhost -n 2 > nul\n\n`;
}

},{"../config/preferenceManager":7,"../util":55,"kgrabber-types":37}],20:[function(require,module,exports){
"use strict";
// src\js\exporters\index.js

const exporters = [
	require("./list"),
	require("./m3u8"),
	require("./json"),
	require("./html"),
	require("./csv"),
	require("./aria2c"),
	require("./idmbat"),
];

exports.all = () =>
	exporters;

exports.available = (linkType, samePage) =>
	exporters.filter((exporter) =>
		filter(exporter, linkType, samePage)
	);

exports.sorted = (linkType, samePage) =>
	exporters.map((exporter) => {
		return { available: filter(exporter, linkType, samePage), exporter };
	})
	.sort((a, b) => b.available - a.available);

exports.add = (...newExporters) => {
	exporters.push(...newExporters);
};

function filter(exporter, linkType, samePage) {
	if (!exporter.linkTypes.includes(linkType)) {
		return false;
	}
	if (exporter.requireSamePage && !samePage) {
		return false;
	}
	return true;
}

},{"./aria2c":16,"./csv":17,"./html":18,"./idmbat":19,"./json":21,"./list":22,"./m3u8":23}],21:[function(require,module,exports){
"use strict";
// src\js\exporters\json.js

const { LinkTypes, Exporter } = require("kgrabber-types"),
	page = require("../ui/page");

module.exports = new Exporter({
	name: "json",
	extension: "json",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
}, runExport);

function runExport(status) {
	let listing = page.episodeList();
	let json = {
		version: "2.0",
		scriptVersion: GM_info.script.version,
		episodes: [],
		url: status.url,
		title: status.title,
		serverID: status.serverID,
		linkType: status.linkType,
	};
	for (let episode of status.episodes) {
		json.episodes.push({
			grabbedLink: episode.grabbedLink,
			processedLink: episode.processedLink,
			error: episode.error,
			episodeNumber: episode.episodeNumber,
			name: listing[episode.episodeNumber - 1].innerText,
		});
	}
	return JSON.stringify(json);
}

},{"../ui/page":48,"kgrabber-types":37}],22:[function(require,module,exports){
"use strict";
// src\js\exporters\list.js

const { LinkTypes, Exporter } = require("kgrabber-types");

module.exports = new Exporter({
	name: "list",
	extension: "txt",
	requireSamePage: false,
	linkTypes: [LinkTypes.DIRECT, LinkTypes.EMBED],
}, runExport);

function runExport(status) {
	let str = "";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += episode.functionalLink + "\n";
		}
	}
	return str;
}

},{"kgrabber-types":37}],23:[function(require,module,exports){
"use strict";
// src\js\exporters\m3u8.js

const { LinkTypes, Exporter } = require("kgrabber-types"),
	page = require("../ui/page");

module.exports = new Exporter({
	name: "m3u8 playlist",
	extension: "m3u8",
	requireSamePage: true,
	linkTypes: [LinkTypes.DIRECT],
}, runExport);

function runExport(status) {
	let listing = page.episodeList();
	let str = "#EXTM3U\n";
	for (let episode of status.episodes) {
		if (!episode.error) {
			str += `#EXTINF:0,${listing[episode.episodeNumber-1].innerText}\n${episode.functionalLink}\n`;
		}
	}
	return str;
}

},{"../ui/page":48,"kgrabber-types":37}],24:[function(require,module,exports){
"use strict";
// generated file, provides contents of src\html
// src\html\captchaModal.html
exports[`captchaModal`] = `<div class="KG-captchaModal-container container" style="display: none;">
	<div class="KG-captchaModal bigBarContainer">
		<div class="barTitle">
			<div class="KG-dialog-title">
				Captcha <span id="KG-captchaModal-status"></span>
			</div>
		</div>
		<div class="barContent">
			<div class="arrow-general">
				&nbsp;</div>
			<div>
				<div class="KG-captchaModal-description-header">
				</div>
				<div class="KG-captchaModal-image-container">
				</div>
			</div>
		</div>
	</div>
</div>
`;
// src\html\linkDisplay.html
exports[`linkDisplay`] = `<div class="bigBarContainer" id="KG-linkdisplay" style="display: none;">
	<div class="barTitle">
		<div class="KG-dialog-title">
			Extracted Links
		</div>
		<span class="KG-dialog-close">
			&#10060; &nbsp;
		</span>
	</div>
	<div class="barContent">
		<div class="arrow-general">
			&nbsp;</div>
		<div id="KG-linkdisplay-text"></div>
		<div class="KG-button-container" id="KG-action-container">
			<select id="KG-linkdisplay-export-dropdown"></select>
		</div>
		<div id="KG-linkdisplay-export" style="display: none;">
			<textarea id="KG-linkdisplay-export-text" spellcheck="false"></textarea>
			<div class="KG-button-container">
				<a id="KG-linkdisplay-export-download">
					<input type="button" value="Download" class="KG-button right">
				</a>
			</div>
		</div>
	</div>
</div>
`;
// src\html\preferences.html
exports[`preferences`] = `<div class="bigBarContainer" id="KG-preferences" style="display: none;">
	<div class="barTitle">
		<div class="KG-dialog-title">
			Preferences
		</div>
		<span class="KG-dialog-close">
			&#10060; &nbsp;
		</span>
	</div>
	<div class="barContent">
		<div class="arrow-general">
			&nbsp;</div>
		<div id="KG-preferences-container-outer">
		</div>
		<div class="KG-button-container">
			<input type="button" value="Reset to Defaults" class="KG-button left" id="KG-preferences-reset">
			<a class="KG-button left" href="https://github.com/thorio/KGrabber/wiki/Preferences" target="blank">Help</a>
			<input type="button" value="Save" class="KG-button float-right" id="KG-preferences-save">
		</div>
	</div>
</div>
`;
// src\html\widget.html
exports[`widget`] = `<div class="clear2">
</div>
<div class="rightBox" id="KG-opts-widget">
	<div class="barTitle">
		KGrabber
		<button class="KG-preferences-button" title="Settings"></button>
	</div>
	<div class="barContent">
		<div class="arrow-general">
			&nbsp;
		</div>
		<select id="KG-widget-server">
		</select>
		<p>
			from
			<input type="number" id="KG-input-from" class="KG-widget-episode" value=1 min=1> to
			<input type="number" id="KG-input-to" class="KG-widget-episode" min=1>
		</p>
		<div class="KG-button-container">
			<input type="button" class="KG-button" id="KG-input-start" value="Extract Links">
		</div>
	</div>
</div>
`;
},{}],25:[function(require,module,exports){
"use strict";
// src\js\main.js
const config = require("./config"),
	{ log } = require("./util"),
	steps = require("./steps"),
	ui = require("./ui"),
	statusManager = require("./statusManager"),
	page = require("./ui/page"),
	pluginLoader = require("./pluginLoader");

pluginLoader.load();

const status = statusManager.get(),
	site = config.sites.current();

if (site) {
	if (site.onContentPath(page.location.pathname)) {
		ui.injectAll();
		site.applyPatch();
	}

	if (status.func) {
		steps.execute(status.func, status, site);
	}
} else {
	log.err(`'${page.location.hostname}' is not supported`);
}

},{"./config":6,"./pluginLoader":38,"./statusManager":41,"./steps":44,"./ui":46,"./ui/page":48,"./util":55}],26:[function(require,module,exports){
// src\js\node_modules\kgrabber-plugin\PluginContext.js

module.exports = class PluginContext {
	constructor({ addActionsFunc, addSitesFunc, addExportersFunc, addStepsFunc, ui, preferences, statusManager }) {
		this._addActionsFunc = addActionsFunc;
		this._addSitesFunc = addSitesFunc;
		this._addExportersFunc = addExportersFunc;
		this._addStepsFunc = addStepsFunc;
		this.ui = ui;
		this.preferences = preferences;
		this.statusManager = statusManager;
		Object.freeze(this);
	}

	addActions(...actions) {
		this._addActionsFunc(...actions);
	}

	addSites(...sites) {
		this._addSitesFunc(...sites);
	}

	addExporters(...exporters) {
		this._addExportersFunc(...exporters);
	}

	addSteps(steps) {
		this._addStepsFunc(steps);
	}
};

},{}],27:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Action.js

module.exports = class Action {
	constructor(name, { availableFunc, executeFunc, automatic = false }) {
		this.name = name;
		this.automatic = automatic;
		this._executeFunc = executeFunc;
		this._availableFunc = availableFunc;
		Object.freeze(this);
	}

	isAvailable(status) {
		return this._availableFunc(this, status);
	}

	invoke(status, setProgress) {
		return this._executeFunc(status, setProgress);
	}
};

},{}],28:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Captcha.js
module.exports = class Captcha {
	constructor(texts, images) {
		this.texts = texts;
		this.images = images;
		Object.seal(this);
	}
};

},{}],29:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Dictionary.js
module.exports = class Dictionary {
	constructor(objects = []) {
		this._data = {};
		this.add(...objects);
		Object.freeze(this);
	}

	add(...objects) {
		for (let object of objects) {
			if (this._data[object.identifier]) {
				throw new Error(`Duplicate key '${object.identifier}'`);
			}
			this._data[object.identifier] = object;
		}
	}

	remove(key) {
		delete this._data[key];
	}

	get(key) {
		return this._data[key];
	}

	*[Symbol.iterator]() {
		for (let i in this._data) {
			yield this._data[i];
		}
	}
};

},{}],30:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Episode.js

module.exports = class Episode {
	constructor(episodeNumber, kissLink) {
		this.grabbedLink = "";
		this.processedLink = "";
		this.displayOverride = "";
		this.kissLink = kissLink;
		this.error = "";
		this.episodeNumber = episodeNumber;
		Object.seal(this);
	}

	get functionalLink() {
		return this.processedLink || this.grabbedLink;
	}

	get displayLink() {
		if (this.error) {
			return `error: ${this.error}`;
		}
		if (this.displayOverride) {
			return `{${this.displayOverride}}`;
		}
		return this.processedLink || this.grabbedLink;
	}
};

},{}],31:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Exporter.js

module.exports = class Exporter {
	constructor({ name, extension, requireSamePage, linkTypes }, func) {
		this.name = name;
		this.extension = extension;
		this.requireSamePage = requireSamePage;
		this.linkTypes = linkTypes;
		this._export = func;
		Object.freeze(this);
	}

	export (status) {
		return this._export(status);
	}
};

},{}],32:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\LinkTypes.js
module.exports = Object.freeze({
	EMBED: "embed",
	DIRECT: "direct",
	OVELWRAP: "ovelwrap",
	HLS: "hls",
});

},{}],33:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Logger.js
module.exports = class Logger {
	constructor(name, { color = "#000", backgroundColor = "#fff" } = {}) {
		this.name = name;
		this.css = `color: ${color}; background-color: ${backgroundColor}; padding: 0 5px; border-radius: 3px;`;
	}

	info(...obj) {
		console.info(`%c${this.name}`, this.css, ...obj);
	}

	log(...obj) {
		console.log(`%c${this.name}`, this.css, ...obj);
	}

	warn(...obj) {
		console.warn(`%c${this.name}`, this.css, ...obj);
	}

	err(...obj) {
		console.error(`%c${this.name}`, this.css, ...obj);
	}

	debug(...obj) {
		console.debug(`%c${this.name}`, this.css, ...obj);
	}
};

},{}],34:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Server.js
module.exports = class Server {
	constructor(identifier, { regex, captureGroup, trimQuotes, name, linkType, customStep, experimentalStep }) {
		this.identifier = identifier;
		this.regex = regex;
		this.captureGroup = captureGroup || 0;
		this.trimQuotes = trimQuotes == undefined ? true : trimQuotes;
		this.name = name;
		this.linkType = linkType;
		this.customStep = customStep;
		this.experimentalStep = experimentalStep;
		Object.freeze(this);
	}

	getEffectiveStep(defaultStep, allowExperimental, allowCustom) {
		return allowExperimental && this.experimentalStep ||
			allowCustom && this.customStep ||
			defaultStep;
	}

	findLink(html) {
		let result = html.match(this.regex);
		if (result) {
			var link = result[this.captureGroup];
			if (this.trimQuotes) {
				link = link.split('"')[1];
			}
			return link;
		} else {
			return undefined;
		}
	}
};

},{}],35:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Site.js

module.exports = class Site {
	constructor(hostname, { contentPath, noCaptchaServer, buttonColor, buttonTextColor, servers, patches = {} }) {
		this.hostname = hostname;
		this.contentPath = new RegExp(`^/${contentPath}/[^/]+/?$`);
		this.episodePath = new RegExp(`^/${contentPath}/[^/]+/[^/]+/?$`);
		this.noCaptchaServer = noCaptchaServer;
		this.buttonColor = buttonColor;
		this.buttonTextColor = buttonTextColor;
		this.servers = servers;
		this.patches = patches;
		Object.freeze(this);
	}

	get identifier() {
		return this.hostname;
	}

	onContentPath(pathname) {
		return this.contentPath.test(pathname);
	}

	onEpisodePath(pathname) {
		return this.episodePath.test(pathname);
	}

	applyPatch(uiElement = "page") {
		if (this.patches[uiElement]) this.patches[uiElement]();
	}
};

},{}],36:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\Status.js
const Episode = require("kgrabber-types/Episode");

module.exports = class Status {
	constructor() {
		this._reset();
		Object.seal(this);
	}

	_reset() {
		this.episodes = [];
		this.current = 0;
		this.automaticDone = false;
		this.hasReset = false;
		this.func = "";
		this.url = "";
		this.title = "";
		this.serverID = "";
		this.linkType = "";
	}

	initialize({ url, title, serverID, linkType }) {
		this._reset();
		this.url = url;
		this.title = title;
		this.serverID = serverID;
		this.linkType = linkType;
	}

	clear() {
		this._reset();
	}

	serialize() {
		return JSON.stringify(this);
	}

	static deserialize(json) {
		let obj = JSON.parse(json);
		for (let i in obj.episodes) {
			obj.episodes[i] = Object.assign(new Episode(), obj.episodes[i]);
		}
		return Object.assign(new this, obj);
	}
};

},{"kgrabber-types/Episode":30}],37:[function(require,module,exports){
// src\js\node_modules\kgrabber-types\index.js
module.exports = {
	Action: require("./Action"),
	Captcha: require("./Captcha"),
	Dictionary: require("./Dictionary"),
	Episode: require("./Episode"),
	Exporter: require("./Exporter"),
	LinkTypes: require("./LinkTypes"),
	Logger: require("./Logger"),
	Server: require("./Server"),
	Site: require("./Site"),
	Status: require("./Status"),
};

},{"./Action":27,"./Captcha":28,"./Dictionary":29,"./Episode":30,"./Exporter":31,"./LinkTypes":32,"./Logger":33,"./Server":34,"./Site":35,"./Status":36}],38:[function(require,module,exports){
"use strict";
// src\js\pluginLoader.js
const util = require("./util"),
	PluginContext = require("kgrabber-plugin/PluginContext"),
	{ preferenceManager, sites } = require("./config"),
	statusManager = require("./statusManager"),
	actions = require("./actions"),
	exporters = require("./exporters"),
	steps = require("./steps"),
	version = require("./pluginVersion"),
	semverSatisfies = require("semver/functions/satisfies"),
	ui = require("./ui/pluginExposed");

const $ = unsafeWindow.$, 
	applicationName = "KGrabberPlugin",
	allowedPluginsKey = "allowedPlugins",
	preferences = preferenceManager.get();

let allowedPlugins;

exports.load = () => {
	if (!$) {
		util.log.err(`jquery not present on the page, can't load plugins`);
		return;
	}
	loadPlugins();
};

function loadPlugins() {
	getAllowedPlugins();
	let foundPlugins = discoverPlugins();
	if (foundPlugins.length > 0) {
		let context = new PluginContext({
			addActionsFunc: actions.add,
			addSitesFunc: sites.add,
			addExportersFunc: exporters.add,
			addStepsFunc: steps.add,
			ui,
			preferences,
			statusManager,
		});

		for (let plugin of foundPlugins) {
			let expectedVersion = `^${plugin.version}`;
			if (!plugin.version || !semverSatisfies(version, expectedVersion)) {
				util.log.err(`plugin "${plugin.pluginID}" could not be loaded due to version mismatch: expected "${expectedVersion}", got "${version}"`);
				continue;
			}
			if (!allowedPlugins.includes(plugin.pluginID)) {
				if (confirm(`allow plugin '${plugin.pluginID}'?`)) {
					allowPlugin(plugin.pluginID);
				} else {
					continue; 
				}
			}
			loadPlugin(plugin.pluginID, context);
		}
	}
}

function discoverPlugins() {
	let foundPlugins = [];

	$(document).on(`${applicationName}/DiscoverResponse`, (e, { pluginID, version }) => {
		foundPlugins.push({ pluginID, version });
	});
	$(document).trigger(`${applicationName}/DiscoverRequest`);
	return foundPlugins;
}

function loadPlugin(pluginID, context) {
	util.log.debug(`loading plugin '${pluginID}'`);
	$(document).trigger(`${applicationName}/LoadPlugin-${pluginID}`, context);
}

function getAllowedPlugins() {
	try {
		allowedPlugins = JSON.parse(GM_getValue(allowedPluginsKey));
	} catch (e) {
		allowedPlugins = [];
		saveAllowedPlugins();
	}
}

function saveAllowedPlugins() {
	GM_setValue(allowedPluginsKey, JSON.stringify(allowedPlugins));
}

function allowPlugin(pluginID) {
	allowedPlugins.push(pluginID);
	saveAllowedPlugins();
}

},{"./actions":3,"./config":6,"./exporters":20,"./pluginVersion":39,"./statusManager":41,"./steps":44,"./ui/pluginExposed":50,"./util":55,"kgrabber-plugin/PluginContext":26,"semver/functions/satisfies":70}],39:[function(require,module,exports){
"use strict";
// version of ./src/js/node_modules/kgrabber-plugin
module.exports = "1.1.1";
},{}],40:[function(require,module,exports){
"use strict";
// src\js\start.js
const config = require("./config"),
	util = require("./util"),
	steps = require("./steps"),
	page = require("./ui/page"),
	statusManager = require("./statusManager"),
	{ Episode } = require("kgrabber-types");

const preferences = config.preferenceManager.get(),
	status = statusManager.get(),
	defaultStep = "defaultBegin";

module.exports = (start, end, serverID) => {
	let site = config.sites.current();
	let server = site.servers.get(serverID);
	statusManager.initialize({
		title: page.title(),
		serverID,
		linkType: server.linkType,
	});
	status.episodes = getEpisodes(start, end);
	status.func = server.getEffectiveStep(defaultStep, preferences.compatibility.enable_experimental_grabbers, !preferences.compatibility.force_default_grabber);

	statusManager.save();
	steps.execute(status.func, status, site);
	$("html, body").animate({ scrollTop: 0 }, "slow");
};

function getEpisodes(start, end) {
	let episodes = [];
	util.for(page.episodeList(), (i, obj) => {
		episodes.push(new Episode(i + 1, obj.href));
	}, {
		min: start,
		max: end,
	});

	return episodes;
}

},{"./config":6,"./statusManager":41,"./steps":44,"./ui/page":48,"./util":55,"kgrabber-types":37}],41:[function(require,module,exports){
"use strict";
// src\js\statusManager.js
const log = require("./util").log,
	page = require("./ui/page"),
	{ Status } = require("kgrabber-types");

const propName = "KG-status";

let status;

exports.get = () => {
	if (status === undefined) {
		status = load();
	}
	return status;
};

exports.save = () => {
	sessionStorage[propName] = JSON.stringify(status);
};

exports.clear = () => {
	status.clear();
	sessionStorage.removeItem(propName);
};

exports.initialize = ({ title, serverID, linkType } = {}) => {
	return status.initialize({
		url: page.href,
		title,
		serverID,
		linkType,
	});
};

function load() {
	let json = sessionStorage[propName];
	if (json) {
		try {
			return Status.deserialize(json);
		} catch (error) {
			log.err("unable to parse JSON", { error, json });
		}
	}

	return new Status();
}

},{"./ui/page":48,"./util":55,"kgrabber-types":37}],42:[function(require,module,exports){
"use strict";
// src\js\steps\captchaModal.js

const util = require("../util"),
	statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../ui/linkDisplay"),
	captchaModal = require("../ui/captchaModal"),
	{ Captcha } = require("kgrabber-types");

exports.modalBegin = async (status) => {
	linkDisplay.show();
	linkDisplay.showSpinner();
	let progress = 0;
	let func = async (  episode) => {
		let html = await doCaptcha(`${episode.kissLink}&s=${status.serverID}`);
		getLink(html, episode, status.serverID);
		progress++;
		setStatusText(`${progress}/${promises.length}`);
	};
	let promises = [];
	util.for(status.episodes, (i,  episode) => {
		promises.push(func(episode));
	});
	setStatusText(`0/${promises.length}`);
	await Promise.all(promises);
	status.func = "defaultFinished";
	statusManager.save();
	linkDisplay.load();
};

function setStatusText(str) {
	linkDisplay.setSpinnerText(str);
	captchaModal.setStatusText(str);
}

async function doCaptcha(url) {
	while (true) {
		let html = (await util.ajax.get(url)).response;
		let $form = $(html).find("form#formVerify1");
		if ($form.length == 0) {
			return html; 
		}
		let texts = [];
		$form.find("span:lt(2)").each((_i, obj) => texts.push(obj.innerText.replace(/[ \n]*(\w)/, "$1")));
		let images = [];
		$form.find("img").each((i, obj) => images.push(obj.src));
		let answerCap = (await captchaModal.queue(new Captcha(texts, images))).join(",") + ","; 
		let response = (await util.ajax.post("/Special/AreYouHuman2", util.urlEncode({ reUrl: url, answerCap }), { "content-type": "application/x-www-form-urlencoded" })).response;
		if (isCaptchaFail(response)) {
			continue; 
		}
		return response; 
	}
}

function getLink(html, episode, serverID) {
	let link = config.sites.current().servers.get(serverID).findLink(html);
	if (link) {
		episode.grabbedLink = link;
	} else {
		episode.error = "no link found";
	}
}

function isCaptchaFail(html) {
	let lowerCase = html.toLowerCase();
	return lowerCase.includes("wrong answer") || lowerCase.includes("areyouhuman2");
}

},{"../config":6,"../statusManager":41,"../ui/captchaModal":45,"../ui/linkDisplay":47,"../util":55,"kgrabber-types":37}],43:[function(require,module,exports){
"use strict";
// src\js\steps\default.js

const statusManager = require("../statusManager"),
	config = require("../config"),
	linkDisplay = require("../ui/linkDisplay"),
	page = require("../ui/page");

exports.defaultBegin = (status) => {
	status.func = "defaultGetLink";
	statusManager.save();
	page.href = status.episodes[status.current].kissLink + `&s=${status.serverID}`;
};

exports.defaultGetLink = (status) => {
	if (!config.sites.current().onEpisodePath(page.location.pathname)) { 
		return;
	}
	let episode = status.episodes[status.current];
	let link = config.sites.current().servers.get(status.serverID).findLink(document.body.innerHTML);
	if (link) {
		episode.grabbedLink = link;
	} else {
		episode.error = "no link found";
	}

	status.current++;
	if (status.current >= status.episodes.length) {
		status.func = "defaultFinished";
		page.href = status.url;
	} else {
		page.href = status.episodes[status.current].kissLink + `&s=${status.serverID}`;
	}
	statusManager.save();
};

exports.defaultFinished = (status, site) => {
	if (site.onContentPath(page.location.pathname)) {
		linkDisplay.load();
	}
};

},{"../config":6,"../statusManager":41,"../ui/linkDisplay":47,"../ui/page":48}],44:[function(require,module,exports){
"use strict";
// src\js\steps\index.js

const { log } = require("../util");

const steps = Object.assign({},
	require("./default"),
	require("./captchaModal")
);

exports.execute = (stepName, status, site) => {
	if (steps[stepName]) {
		steps[stepName](status, site);
	} else {
		log.err(`tried executing invalid step '${stepName}'`, { steps });
	}
};

exports.add = (newSteps) => {
	Object.assign(steps, newSteps);
};

},{"../util":55,"./captchaModal":42,"./default":43}],45:[function(require,module,exports){
"use strict";
// src\js\ui\captchaModal.js

const util = require("../util"),
	html = require("../html"),
	page = require("./page"),
	{ sites } = require("../config");

let queue = [];
let injected = false;

function inject() {
	$("body").append(html.captchaModal);
	sites.current().applyPatch("captchaModal");
	injected = true;
	if (!$(".KG-captchaModal").length) util.log.err(new Error("captchaModal not injected"));
}

exports.queue = (captcha) => {
	return new Promise((resolve) => {
		queue.push({ captcha, resolve });
		if (queue.length == 1) { 
			show();
			queueNext();
		}
	});
};

function queueNext() {
	let current = queue[0];
	clear();
	load(current.captcha, current.resolve);
}

function queuePop() {
	queue.splice(0, 1);
	if (queue.length == 0) {
		hide();
	} else {
		queueNext();
	}
}

exports.setStatusText = (text) => {
	$("#KG-captchaModal-status").text(text);
};

function show() {
	if (!injected) inject();
	$(".KG-captchaModal-container").fadeIn("fast");
	page.scroll(false);
}

function hide() {
	$(".KG-captchaModal-container").fadeOut("fast");
	page.scroll(true);
}

function clear() {
	$(".KG-captchaModal-description-header").empty();
	$(".KG-captchaModal-image-container").empty();
}

function load(captcha, resolve) {
	for (let text of captcha.texts) {
		$("<span>")
			.text(text)
			.appendTo(".KG-captchaModal-description-header");
	}
	for (let i in captcha.images) {
		$("<img>")
			.attr({
				"src": captcha.images[i],
				"data-index": i,
			})
			.click(
				(e) => {
					toggleImage(e.target, captcha, resolve);
				})
			.appendTo(".KG-captchaModal-image-container");
	}
	applyColors();
}

async function toggleImage(image, captcha, resolve) {
	$(image).toggleClass("active");
	let $activeImages = $(".KG-captchaModal-image-container img.active");
	if ($activeImages.length >= 2) {
		let activeIndices = [];
		$activeImages.each(
			(i, obj) => void activeIndices.push(Number(obj.dataset.index))
		);

		resolve(activeIndices);
		queuePop();
	}
}

function applyColors() {

}

},{"../config":6,"../html":24,"../util":55,"./page":48}],46:[function(require,module,exports){
"use strict";
// src\js\ui\index.js
const widget = require("./widget"),
	pageWidgets = require("./pageWidgets"),
	css = require("../css");

function injectCss() {
	$(document.head).append(`<style>${css}</style>`);
}

exports.injectAll = () => {
	injectCss();
	widget.show();
	pageWidgets.injectEpisodeListWidgets();
};

},{"../css":15,"./pageWidgets":49,"./widget":53}],47:[function(require,module,exports){
"use strict";
// src\js\ui\linkDisplay.js

const shared = require("./shared"),
	exporters = require("../exporters"),
	util = require("../util"),
	html = require("../html"),
	actions = require("../actions"),
	statusManager = require("../statusManager"),
	preferenceManager = require("../config/preferenceManager"),
	page = require("./page"),
	{ sites } = require("../config");

const status = statusManager.get(),
	preferences = preferenceManager.get();
let injected = false;

function inject() {
	$("#leftside").prepend(html.linkDisplay);
	setHandlers();
	sites.current().applyPatch("linkDisplay");
	injected = true;
	if (!$("#KG-linkdisplay").length) util.log.err(new Error("linkDisplay not injected"));
}

let load = exports.load = () => {
	show(true);
	setTitle(`Extracted Links | ${status.title}`);
	loadLinks(status.episodes);
	loadExporters(exporters.sorted(status.linkType, status.url == page.href));
	loadActions(actions.available());

	shared.applyColors();
};

let show = exports.show = (instant) => {
	if (!injected) inject();
	instant ? $("#KG-linkdisplay").show() : $("#KG-linkdisplay").slideDown();
};

let hide = exports.hide = () =>
	$("#KG-linkdisplay").slideUp();

function setTitle(text) {
	$("#KG-linkdisplay .KG-dialog-title").text(text);
}

function loadLinks(episodes) {
	let html = "";
	let padLength = Math.max(2, page.episodeCount().toString().length);
	util.for(episodes, (i,  obj) => {
		let num = obj.episodeNumber.toString().padStart(padLength, "0");
		let number = `<div class="KG-linkdisplay-episodenumber">E${num}:</div>`;
		let link = `<a href="${obj.functionalLink}" target="_blank">${obj.displayLink}</a>`;
		if (obj.error || obj.displayOverride) {
			link = obj.displayLink;
		}
		html += `<div class="KG-linkdisplay-row">${number} ${link}</div>`;
	});
	$("#KG-linkdisplay-text").html(`<div class="KG-linkdisplay-table">${html}</div>`);
}

function loadActions(actions) {
	$("#KG-action-container .KG-button").remove(); 
	for (let i in actions) {
		if (actions[i].automatic && !status.hasReset && !preferences.compatibility.disable_automatic_actions) {
			util.defer(() => { 
				executeAction(actions[i]);
			});
		} else {
			$(`<input type="button" class="KG-button" value="${actions[i].name}">`)
				.click(() => {
					executeAction(actions[i]);
				})
				.appendTo("#KG-action-container");
		}
	}
}

function loadExporters(arr) {
	let $exporters = $("#KG-linkdisplay-export-dropdown");
	$exporters.empty() 
		.off("change")
		.change((e) => {
			runExporter(arr[e.target.value].exporter);
			$(e.target).val(""); 
		})
		.append($("<option>") 
			.attr({
				value: "",
				hidden: true,
			})
			.text("Export as")
		);

	for (let i in arr) { 
		$("<option>")
			.text(arr[i].exporter.name)
			.attr({
				value: i,
				disabled: !arr[i].available,
			})
			.appendTo($exporters);
	}
}

function setHandlers() {
	$("#KG-linkdisplay .KG-dialog-close").click(() => {
		hide();
		statusManager.clear();
	});
}

async function executeAction(action) {
	showSpinner();
	await actions.execute(action, setSpinnerText);
	statusManager.save();
	load();
}

function runExporter(exporter) {
	let data = exporter.export(status);
	setExportText(data);
	setDownloadFile(data, status.title, exporter.extension);
	showExports();
}

let showSpinner = exports.showSpinner = () =>
	$("#KG-linkdisplay-text").html(`<div class="loader">Loading...</div><div id="KG-loader-text"><div>`);

let setSpinnerText = exports.setSpinnerText = (str) =>
	$("#KG-loader-text").text(str);

let setExportText = (text) =>
	$("#KG-linkdisplay-export-text").text(text);

let showExports = () =>
	$("#KG-linkdisplay-export").show();

function setDownloadFile(data, filename, extension) {
	$("#KG-linkdisplay-export-download").attr({
		href: `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`,
		download: `${filename}.${extension}`,
	});
}

},{"../actions":3,"../config":6,"../config/preferenceManager":7,"../exporters":20,"../html":24,"../statusManager":41,"../util":55,"./page":48,"./shared":52}],48:[function(require,module,exports){
"use strict";
// src\js\ui\page.js
const util = require("../util");

exports.episodeCount = () =>
	$(".listing a").length;

exports.title = () =>
	$(".bigBarContainer a.bigChar").text();

exports.noTitle = () =>
	exports.title() == "";

exports.episodeList = () =>
	$(`.listing a`).get()
		.reverse(); 

exports.reload = () =>
	location.reload();

Object.defineProperty(exports, "href", {
	get: () => location.href,
	set: (href) => { location.href = href; },
});

Object.defineProperty(exports, "location", {
	get: () => util.merge({}, location), 
});

exports.scroll = (enable) => {
	$(document.body).css("overflow", enable ? "" : "hidden");
};

},{"../util":55}],49:[function(require,module,exports){
"use strict";
// src\js\ui\pageWidgets.js
const shared = require("./shared"),
	start = require("../start"),
	widget = require("./widget"),
	page = require("./page");

exports.injectEpisodeListWidgets = () => {
	let epCount = page.episodeCount();
	$(".listing tr:eq(0)").prepend(`<th class="KG-episodelist-header">#</th>`);
	$(".listing tr:gt(1)").each((i, obj) => {
		let episode = epCount - i - 1;
		$(`<input type="button" value="grab" class="KG-episodelist-button">&nbsp;`)
			.click(() => {
				start(episode, episode, widget.getServer());
			})
			.prependTo($(obj).children(":eq(0)"));
		$(`<td class="KG-episodelist-number">${episode + 1}</td>`).prependTo(obj);
	});

	shared.applyColors();
};

},{"../start":40,"./page":48,"./shared":52,"./widget":53}],50:[function(require,module,exports){
"use strict";
// src\js\ui\pluginExposed.js
module.exports = {
	captchaModal: require("./captchaModal"),
	linkDisplay: require("./linkDisplay"),
	page: require("./page"),
};

},{"./captchaModal":45,"./linkDisplay":47,"./page":48}],51:[function(require,module,exports){
"use strict";
// src\js\ui\preferences.js
const log = require("../util/log"),
	shared = require("./shared"),
	html = require("../html"),
	page = require("./page"),
	{ sites, preferenceManager } = require("../config");

let injected = false;

exports.show = () => {
	if (!injected) inject();
	$("#KG-preferences").slideDown();
};

let hide = exports.hide = () =>
	$("#KG-preferences").slideUp();

function inject() {
	$("#leftside").prepend(html.preferences);
	setHandlers();
	load(preferenceManager.get());
	sites.current().applyPatch("preferences");
	injected = true;
}

let load = (preferences) => {
	for (let i in preferences) {
		let group = preferences[i];
		let $group = $(`<div id="KG-preferences-container"></div>`);
		for (let j in preferences[i]) {
			let html = "";
			switch (typeof group[j]) {
			case "string":
			case "number":
				html = `<div><span>${j.replace(/_/g, " ")}:</span><input type="${typeof group[j]}" value="${group[j]}" class="KG-preferences-input-text right" id="KG-preference-${i}-${j}"></div>`;
				break;
			case "boolean":
				html = `<div><span>${j.replace(/_/g, " ")}:</span><input type="checkbox" ${group[j] ? "checked" : ""} class="KG-preferences-input-checkbox right" id="KG-preference-${i}-${j}"></div>`;
				break;
			default:
				log.err(`unknown type "${typeof group[j]}" of preferences.${i}.${j}`);
			}
			$group.append(html);
		}
		let headerTitle = i.replace(/_/g, " ").replace(/[a-z]+/g, (s) => s.charAt(0).toUpperCase() + s.slice(1));
		$("#KG-preferences-container-outer").append(`<div class="KG-preferences-header KG-bigChar">${headerTitle}</div>`)
			.append($group);
	}
	shared.applyColors();
};

function setHandlers() {
	$("#KG-preferences .KG-dialog-close").click(() => {
		hide();
	});
	$("#KG-preferences-save").click(() => {
		preferenceManager.save(read());
		hide();
	});
	$("#KG-preferences-reset").click(() => {
		preferenceManager.reset();
		page.reload();
	});
}

function read() {
	let preferences = {};
	$("#KG-preferences-container input").each((i, obj) => {
		let ids = obj.id.slice(14).match(/[^-]+/g);
		let value;
		switch (obj.type) {
		case "checkbox":
			value = obj.checked;
			break;
		default:
			value = obj.value;
			break;
		}
		if (!preferences[ids[0]]) {
			preferences[ids[0]] = {};
		}
		preferences[ids[0]][ids[1]] = value;
	});
	return preferences;
}

},{"../config":6,"../html":24,"../util/log":57,"./page":48,"./shared":52}],52:[function(require,module,exports){
"use strict";
// src\js\ui\shared.js
const config = require("../config");

exports.applyColors = () => {
	let site = config.sites.current();
	$(".KG-episodelist-button, .KG-button")
		.css({ "color": site.buttonTextColor, "background-color": site.buttonColor });
	$(".KG-preferences-header")
		.css({ "color": $(".bigChar").css("color") });
};

},{"../config":6}],53:[function(require,module,exports){
"use strict";
// src\js\ui\widget.js
const shared = require("./shared"),
	html = require("../html"),
	config = require("../config"),
	util = require("../util"),
	log = util.log,
	page = require("./page"),
	start = require("../start"),
	preferencesUI = require("./preferences");

exports.show = () => {
	inject();
	load();
	setServer(config.preferenceManager.getPreferredServer(page.location.hostname));
	let noCaptchaServer = config.sites.current().noCaptchaServer;
	if (noCaptchaServer != null) {
		markAvailableServers(util.last(page.episodeList()), noCaptchaServer);
	}
};

function inject() {
	$(`#rightside .rightBox:eq(0)`).after(html.widget);
	config.sites.current().applyPatch("widget");
}

function load() {
	let epCount = page.episodeCount();

	$("#KG-input-to").val(epCount)
		.attr("max", epCount);
	$("#KG-input-from").attr("max", epCount);
	for (let server of config.sites.current().servers) {
		$(`<option value="${server.identifier}">${server.name}</>`)
			.appendTo("#KG-widget-server");
	}
	setHandlers();
	shared.applyColors();
}

function setHandlers() {
	$("#KG-input-from, #KG-input-to").on("keydown", (e) => {
		if (e.keyCode == 13) {
			$("#KG-input-start").click();
		}
	});
	$("#KG-widget-server").change(() => {
		config.preferenceManager.setPreferredServer(page.location.hostname, getServer());
	});
	$(".KG-preferences-button").click(() => {
		preferencesUI.show();
	});
	$("#KG-input-start").click(() => {
		start(getStartEpisode(), getEndEpisode(), getServer());
	});
}

async function markAvailableServers(url, server) {
	let servers = [];
	let html = await $.get(`${url}&s=${server}`);
	$(html).find("#selectServer").children().each((i, obj) => {
		servers.push(obj.value.match(/s=\w+/g)[0].slice(2, Infinity));
	});
	if (servers.length == 0) {
		log.warn("no servers found");
	}

	$("#KG-widget-server option").each((i, obj) => {
		if (servers.indexOf(obj.value) < 0) {
			$(obj).css("color", "#888");
		}
	});
}

let setServer = (server) =>
	$("#KG-widget-server").val(server);

let getServer = exports.getServer = () =>
	$("#KG-widget-server").val();

let getStartEpisode = () =>
	$('#KG-input-from').val() - 1;

let getEndEpisode = () =>
	$('#KG-input-to').val() - 1;

},{"../config":6,"../html":24,"../start":40,"../util":55,"./page":48,"./preferences":51,"./shared":52}],54:[function(require,module,exports){
"use strict";
// src\js\util\ajax.js

function request(method, url, { data, headers } = {}) {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method,
			url,
			data,
			headers,
			onload: resolve,
			onerror: reject,
		});
	});
}

exports.get = (url, headers) => {
	return request("GET", url, { headers });
};

exports.post = (url, data, headers) => {
	return request("POST", url, { data, headers });
};

exports.head = (url, headers) => {
	return request("HEAD", url, { headers });
};

},{}],55:[function(require,module,exports){
"use strict";
// src\js\util\index.js
exports.log = require("./log");
exports.ajax = require("./ajax");
exports.kissCrypto = require("./kissCrypto");

exports.for = (array, func, { min = 0, max = array.length - 1 } = {}) => {
	for (let i = min; i <= max; i++) {
		func(i, array[i]);
	}
};

exports.makeBatSafe = (str) => {
	return str.replace(/[%^&<>|:\\/?*"]/g, "_");
};

let wait = exports.wait = (time) =>
	new Promise((resolve) => {
		setTimeout(resolve, time);
	});

exports.defer = async (callback = () => {}) => {
	await wait(0);
	callback();
};

exports.clone = (obj) =>
	$.extend(true, {}, obj);

exports.clear = (obj) =>
	Object.keys(obj).forEach(function(key) { delete obj[key]; });

exports.merge = (obj1, obj2) =>
	$.extend(true, obj1, obj2);

exports.last = (arr) =>
	arr[arr.length - 1];

exports.urlEncode = (obj) => {
	let str = "";
	for (let i in obj) {
		str += `${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}&`;
	}
	return str.slice(0, -1); 
};

},{"./ajax":54,"./kissCrypto":56,"./log":57}],56:[function(require,module,exports){
"use strict";
// src\js\util\kissCrypto.js
const log = require("./log");

let scriptsLoaded = false;

function loadScript(name) {
	$(`<script src="${location.origin}/Scripts/${name}.js" />`)
		.appendTo("head");
}

function loadScripts() {
	if (!scriptsLoaded) {
		loadScript("css");
		loadScript("vr");
		log.log("loading scripts");
		scriptsLoaded = true;
	}
}

exports.decrypt = async (encrypted) => {
	loadScripts();
	return unsafeWindow.ovelWrap(encrypted);
};

},{"./log":57}],57:[function(require,module,exports){
"use strict";
// src\js\util\log.js
const { Logger } = require("kgrabber-types");

module.exports = new Logger("KGrabber", {
	color: "#eee",
	backgroundColor: "#456304",
});

},{"kgrabber-types":37}],58:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],59:[function(require,module,exports){
const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }
  constructor (comp, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    const sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>')
    const sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<')
    const sameSemVer = this.semver.version === comp.semver.version
    const differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=')
    const oppositeDirectionsLessThan =
      cmp(this.semver, '<', comp.semver, options) &&
      (this.operator === '>=' || this.operator === '>') &&
        (comp.operator === '<=' || comp.operator === '<')
    const oppositeDirectionsGreaterThan =
      cmp(this.semver, '>', comp.semver, options) &&
      (this.operator === '<=' || this.operator === '<') &&
        (comp.operator === '>=' || comp.operator === '>')

    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
}

module.exports = Comparator

const {re, t} = require('../internal/re')
const cmp = require('../functions/cmp')
const debug = require('../internal/debug')
const SemVer = require('./semver')
const Range = require('./range')

},{"../functions/cmp":62,"../internal/debug":72,"../internal/re":74,"./range":60,"./semver":61}],60:[function(require,module,exports){
// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First, split based on boolean or ||
    this.raw = range
    this.set = range
      .split(/\s*\|\|\s*/)
      // map the range to a 2d array of comparators
      .map(range => this.parseRange(range.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`)
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => {
        return comps.join(' ').trim()
      })
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    const loose = this.options.loose
    range = range.trim()
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range, re[t.COMPARATORTRIM])

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)

    // normalize spaces
    range = range.split(/\s+/).join(' ')

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    const compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    return range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      .map(comp => replaceGTE0(comp, this.options))
      // in loose mode, throw out any that are not valid comparators
      .filter(this.options.loose ? comp => !!comp.match(compRe) : () => true)
      .map(comp => new Comparator(comp, this.options))
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}
module.exports = Range

const Comparator = require('./comparator')
const debug = require('../internal/debug')
const SemVer = require('./semver')
const {
  re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace
} = require('../internal/re')

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((comp) => {
    return replaceTilde(comp, options)
  }).join(' ')

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((comp) => {
    return replaceCaret(comp, options)
  }).join(' ')

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map((comp) => {
    return replaceXRange(comp, options)
  }).join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<')
        pr = '-0'

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp.trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return (`${from} ${to}`).trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

},{"../internal/debug":72,"../internal/re":74,"./comparator":59,"./semver":61}],61:[function(require,module,exports){
const debug = require('../internal/debug')
const { MAX_LENGTH, MAX_SAFE_INTEGER } = require('../internal/constants')
const { re, t } = require('../internal/re')

const { compareIdentifiers } = require('../internal/identifiers')
class SemVer {
  constructor (version, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }
    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier)
        this.inc('pre', identifier)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier)
        }
        this.inc('pre', identifier)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format()
    this.raw = this.version
    return this
  }
}

module.exports = SemVer

},{"../internal/constants":71,"../internal/debug":72,"../internal/identifiers":73,"../internal/re":74}],62:[function(require,module,exports){
const eq = require('./eq')
const neq = require('./neq')
const gt = require('./gt')
const gte = require('./gte')
const lt = require('./lt')
const lte = require('./lte')

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp

},{"./eq":64,"./gt":65,"./gte":66,"./lt":67,"./lte":68,"./neq":69}],63:[function(require,module,exports){
const SemVer = require('../classes/semver')
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare

},{"../classes/semver":61}],64:[function(require,module,exports){
const compare = require('./compare')
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq

},{"./compare":63}],65:[function(require,module,exports){
const compare = require('./compare')
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt

},{"./compare":63}],66:[function(require,module,exports){
const compare = require('./compare')
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte

},{"./compare":63}],67:[function(require,module,exports){
const compare = require('./compare')
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt

},{"./compare":63}],68:[function(require,module,exports){
const compare = require('./compare')
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte

},{"./compare":63}],69:[function(require,module,exports){
const compare = require('./compare')
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq

},{"./compare":63}],70:[function(require,module,exports){
const Range = require('../classes/range')
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies

},{"../classes/range":60}],71:[function(require,module,exports){
// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

module.exports = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH
}

},{}],72:[function(require,module,exports){
(function (process){
const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug

}).call(this,require('_process'))
},{"_process":58}],73:[function(require,module,exports){
const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers
}

},{}],74:[function(require,module,exports){
const { MAX_SAFE_COMPONENT_LENGTH } = require('./constants')
const debug = require('./debug')
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const createToken = (name, value, isGlobal) => {
  const index = R++
  debug(index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*')

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+')

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$')

},{"./constants":71,"./debug":72}]},{},[25]);
