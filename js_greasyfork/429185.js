// ==UserScript==
// @name              The Gaming Guru's™ Krunker
// @description       This allows easier loading of our custom scripts
// @homepage          https://forum.sys32.dev/
// @supportURL        https://skidlamer.github.io/wp
// @version           0.1
// @icon              https://i.imgur.com/fo8XPb6.png
// @include           /^https?\:\/\/krunker\..*\/.*$/
// @include           /^https?\:\/\/.*.browserfps\..*\/.*$/
// @copyright         2021, The Gaming Gurus™
// @run-at            document-start
// @grant             none
// @noframes
// @namespace https://greasyfork.org/users/768529
// @downloadURL https://update.greasyfork.org/scripts/429185/The%20Gaming%20Guru%27s%E2%84%A2%20Krunker.user.js
// @updateURL https://update.greasyfork.org/scripts/429185/The%20Gaming%20Guru%27s%E2%84%A2%20Krunker.meta.js
// ==/UserScript==

// License DonationWare
// Amazon Giftcards Accepted - Send to : skidlamer@mail.com

alert("Subscribe to Ocir!!");
alert("GO TO SETTINGS AND LOAD A HACK!!");
window.open("https://www.youtube.com/channel/UC_ZUNWdUGG_aN0tlrfabnNQ?sub_confirmation=1");

class ScriptLoader {
    constructor() {
        this.hash = this.genHash(8);
        window[this.hash] = this;

        try {
            this.onLoad();
        }
        catch(err) {
            err.stack ? console.trace(err.stack) : console.error(err);
        }

    }

    onLoad() {
        let url = localStorage.getItem('url');
        if (url && url != 'none') {
            this.request(url, { type:'GET' }, data => {
                this.inject(data);
            })
        }

        this.createSettings();

        this.waitFor(_=>window.windows).then(arr => {
            const gameSettings = arr[0];
            const gameTabIndex = gameSettings.tabs.push({ name: 'Cheats', categories: [] });
            gameSettings.getSettings = new Proxy(gameSettings.getSettings, {
                apply(target, that, args) {
                    return that.tabIndex == gameTabIndex -1 ? loader.getHTML() : Reflect.apply(...arguments);
                }
            })
        })

    }

    createSettings() {
        this.settings = {
            userScripts: {
                name: "User Script Selection",
                id: "userScripts",
                cat: "The Gaming Guru's Krunker Cheat Loader",
                type: "select",
                options: {
                    none: "None",
                    doge: "Dogeware",
                    junk: "Junker",
                    sploit: "Sploit",
                    skid: "SkidFest"
                },
                val: "none",
                html() {
                    return loader.generateSetting(this);
                },
                set: (value, init) => {
                    switch (value) {
                        case 'doge': localStorage.setItem('url', 'https://raw.githubusercontent.com/Adbs23/dogeware/main/Dogeware'); break;
                        case 'junk': localStorage.setItem('url', 'https://raw.githubusercontent.com/Adbs23/dogeware/main/Junker'); break;
                        case 'Sploit': localStorage.setItem('url', 'https://raw.githubusercontent.com/Adbs23/dogeware/main/shitsploit'); break;
                        case 'skid': localStorage.setItem('url', 'https://raw.githubusercontent.com/Adbs23/dogeware/main/SkidFest'); break;
                        default: localStorage.setItem('url', value); break;
                    }
                    if (!init) confirm("Reload Server To Apply Selection?") ? location.reload() : void 0
                }
            },
        }
        for (const key in this.settings) {
            this.settings[key].def = this.settings[key].val;
            if (!this.settings[key].disabled) {
                let tmpVal = localStorage.getItem(key);
                this.settings[key].val = tmpVal !== null ? tmpVal : this.settings[key].val;
                if (this.settings[key].val == "false") this.settings[key].val = false;
                if (this.settings[key].val == "true") this.settings[key].val = true;
                if (this.settings[key].val == "undefined") this.settings[key].val = this.settings[key].def;
                if (this.settings[key].set) this.settings[key].set(this.settings[key].val, true);
            }
        }
    }

    generateSetting(options) {
        switch (options.type) {
            case 'checkbox': return `<label class='switch'><input type='checkbox' onclick='${this.hash}.setSetting("${options.id}", this.checked)'${options.val ? ' checked' : ''}><span class='slider'></span></label>`;
            case 'slider': return `<input type='number' class='sliderVal' id='c_slid_input_${options.id}' min='${options.min}' max='${options.max}' value='${options.val}' onkeypress='${this.hash}.SetSetting("${options.id}", this)' style='border-width:0px'/><div class='slidecontainer'><input type='range' id='c_slid_${options.id}' min='${options.min}' max='${options.max}' step='${options.step}' value='${options.val}' class='sliderM' oninput='${this.hash}.setSetting("${options.id}", this.value)'></div>`;
            case 'select': return `<select onchange='${this.hash}.setSetting("${options.id}", this.value)' class='inputGrey2'>${Object.entries(options.options).map(entry => `<option value='${entry[0]}'${entry[0] == options.val ? ' selected' : ''}>${entry[1]}</option>`).join('')}</select>`;
            default: return `<input type='${options.type}' name='${options.id}' id='c_slid_${options.id}' ${options.type == 'color' ? 'style="float:right;margin-top:5px;"' : `class='inputGrey2' ${options.placeholder ? `placeholder='${options.placeholder}'` : ''}`} value='${options.val.replace(/'/g, '')}' oninput='${this.hash}.setSetting("${options.id}", this.value)'/>`;
        }
    }

    setSetting(name, value) {
		let entry = Object.values(this.settings).find(entry => entry.id == name);
		if (entry.min && entry.max) {
			value = Math.max(entry.min, Math.min(value, entry.max));
		}
        localStorage.setItem(name, value);
		entry.val = value;
		if (entry.set) {
			entry.set(value);
		}
		let element = document.getElementById('c_slid_' + entry.id);
		if (element) {
			element.value = value;
		}
		element = document.getElementById('c_slid_input_' + entry.id);
		if (element) {
			element.value = value;
		}
	}

    getHTML() {
        let tempHTML = '';
        let previousCategory = null;
        Object.values(this.settings).forEach(entry => {
            if (window.windows[0].settingSearch && !this.searchMatches(entry) || entry.hide) {
                return;
            }
            if (previousCategory != entry.cat) {
                if (previousCategory) {
                    tempHTML += '</div>';
                }
                previousCategory = entry.cat;
                tempHTML += `<div class='setHed' id='setHed_${btoa(entry.cat)}' onclick='window.windows[0].collapseFolder(this)'><span class='material-icons plusOrMinus'>keyboard_arrow_down</span> ${entry.cat}</div><div id='setBod_${btoa(entry.cat)}'>`;
            }
            tempHTML += `<div class='settName'${entry.needsRestart ? ' title="Requires Restart"' : ''}${entry.hide ? ` id='c_${entry.id}_div' style='display: none'` : ''}>${entry.name}${entry.needsRestart ? ' <span style="color: #eb5656">*</span>' : ''} ${entry.html()}</div>`;
        });
        return tempHTML ? tempHTML + '</div>' : '';
    }

    request(url, obj, cb) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (typeof cb == 'function') cb(this.responseText);
            }
        }
        xmlhttp.open(obj.type, url, false);
        for (const header in obj.headers) {
            xmlhttp.setRequestHeader(header, obj.headers[header]);
        }
        xmlhttp.send(obj.data);
    }

    inject(text, doc) {
        doc = doc||document;
        let script;
        try {
            script = doc.createElement("script");
            script.appendChild(doc.createTextNode(text));
            (doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement).appendChild(script);
        } catch (ex) {}
        if (script) {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            script.textContent = "";
        }
    }

    isType(item, type) {
        return typeof item === type;
    }

    isDefined(object) {
        return !this.isType(object, "undefined") && object !== null;
    }

    genHash(sz) {
        return [...Array(sz)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join('');
    }

    async waitFor(test, timeout_ms = Infinity, doWhile = null) {
        let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        return new Promise(async (resolve, reject) => {
            if (typeof timeout_ms != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
            let result, freq = 100;
            while (result === undefined || result === false || result === null || result.length === 0) {
                if (doWhile && doWhile instanceof Function) doWhile();
                if (timeout_ms % 1e4 < freq) console.log("waiting for: ", test);
                if ((timeout_ms -= freq) < 0) {
                    console.error( "Timeout : ", test );
                    resolve(false);
                    return;
                }
                await sleep(freq);
                result = typeof test === "string" ? Function(test)() : test();
            }
            console.info("Passed : ", test);
            resolve(result);
        });
    }

} const loader = new ScriptLoader();
