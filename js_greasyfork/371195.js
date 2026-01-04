// ==UserScript==
// @name        MTurk Auto-Accept
// @version     0.2.4
// @description Automatically accepts HITs from HIT Scraper on MTurk
// @author      parseHex
// @namespace   https://greasyfork.org/users/8394
// @include     /^https://w(ww|orker).mturk.com/.*hit[-_]?scraper/
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/371195/MTurk%20Auto-Accept.user.js
// @updateURL https://update.greasyfork.org/scripts/371195/MTurk%20Auto-Accept.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const state = {
	    enabled: location.host === 'localhost',
	    targetPayRate: 0.075,
	    blocklist: '',
	    log: [],
	};

	function getMetaData (hit) {
	    const result = {
	        timeEstimate: null,
	        payRateTarget: null,
	        goodPay: null,
	        isReputable: null,
	        requester_id: hit.requester.id,
	        requester_name: hit.requester.name,
	    };
	    // check to see if a time estimate is given in the title or description
	    if (regex.test(hit.title)) {
	        result.timeEstimate = timeEstimate(hit.title);
	    }
	    else if (regex.test(hit.desc)) {
	        result.timeEstimate = timeEstimate(hit.desc);
	    }
	    if (result.timeEstimate !== null) {
	        result.payRateTarget = result.timeEstimate * state.targetPayRate;
	    }
	    if (result.timeEstimate !== null && result.payRateTarget !== null) {
	        result.goodPay = hit.payRaw >= result.payRateTarget;
	    }
	    if (hit.TO) {
	        result.isReputable = isReputable(hit);
	    }
	    return result;
	}
	const regex = /(\d+)[\s-]?(minute|min|hour|hr)/i;
	function timeEstimate(timeStr) {
	    const match = timeStr.match(regex);
	    let timeNum = +match[1];
	    let timeUnit = match[2];
	    timeNum = +timeNum;
	    timeUnit = timeUnit.replace('hour', 'hr');
	    // convert hours to minutes
	    if (timeUnit === 'hr')
	        timeNum = timeNum * 60;
	    return timeNum;
	}
	function isReputable(hit) {
	    // set 0 ratings to infinity
	    // because 0 might mean that nobody has rated them on that attribute
	    // Inifinity isn't less than anything so basically just ignore 0's
	    const ratings = {
	        comm: +hit.TO.attrs.comm || Infinity,
	        fair: +hit.TO.attrs.fair || Infinity,
	        fast: +hit.TO.attrs.fast || Infinity,
	        pay: +hit.TO.attrs.pay,
	    };
	    if (ratings.comm < 2 ||
	        ratings.fair < 3.75 ||
	        ratings.fast < 1 ||
	        ratings.pay < 3.25)
	        return false;
	    return true;
	}

	const controlbuttons = document.getElementById('controlbuttons');
	const mainBtn = document.createElement('button');
	mainBtn.textContent = state.enabled ? 'Stop Auto-Accept' : 'Start Auto-accept';
	mainBtn.addEventListener('click', function () {
	    state.enabled = !state.enabled;
	    mainBtn.textContent = state.enabled ? 'Stop Auto-Accept' : 'Start Auto-accept';
	});
	controlbuttons.appendChild(mainBtn);
	const clearBtn = document.createElement('button');
	clearBtn.textContent = 'Clear AA Blocklist';
	clearBtn.addEventListener('click', function () {
	    state.blocklist = '';
	});
	controlbuttons.appendChild(clearBtn);

	function typeofValue(val) {
	    if (typeof val === 'string' || val instanceof RegExp) {
	        return 'string';
	    }
	    else if (typeof val === 'boolean') {
	        return 'boolean';
	    }
	    else if (typeof val === 'number' || hasNumberProps(val)) {
	        return 'number';
	    }
	    else if (val === null) {
	        // i know null is not a boolean but for the purposes of type comparison it might as well be
	        return 'boolean';
	    }
	    else {
	        // NOTE this will probably cause problems if the val is undefined or something like that
	        throw new Error('Unknown type of value: ' + JSON.stringify(val));
	    }
	}
	function hasNumberProps(val) {
	    return val && (val.hasOwnProperty('GREATER_THAN') ||
	        val.hasOwnProperty('GREATER_THAN_OR_EQUAL') ||
	        val.hasOwnProperty('LESS_THAN') ||
	        val.hasOwnProperty('LESS_THAN_OR_EQUAL'));
	}

	class Config {
	    constructor(config) {
	        this.config = config;
	    }
	    // for logging
	    get result() { return JSON.parse(JSON.stringify(this._result)); }
	    /**
	     * Check whether a hit passes the config.
	     *
	     * NOTE: If you want the result of this metho, get it with `config.result` before calling the method again.
	     * `config.result` is overwritten on each call of `canfig.passes()`.
	     */
	    passes(hit, meta) {
	        // i know this is a weird way of handling the result
	        // i just want this method to return a boolean while still having the result accessible
	        this.matchToConfig(hit, meta);
	        return this._result.pass.length > 0;
	    }
	    matchToConfig(hit, meta) {
	        this.tmpData = Object.assign({}, hit, meta);
	        this._result = {
	            pass: [],
	            fail: [],
	            hit: this.tmpData,
	        };
	        const configKeys = Object.keys(this.config);
	        for (let i = 0; i < configKeys.length; i++) {
	            const configKey = configKeys[i];
	            let configValue = this.config[configKey];
	            if (!Array.isArray(configValue))
	                configValue = [configValue];
	            if (configKey === 'COMBINATIONS') {
	                for (let k = 0; k < this.config.COMBINATIONS.length; k++) {
	                    const tmpConfig = new Config(this.config.COMBINATIONS[k]);
	                    const comboResult = tmpConfig.matchToConfig(hit, meta);
	                    // combo object fails if any of its properties fail
	                    const resultArr = tmpConfig._result.fail.length > 0 ? this._result.fail : this._result.pass;
	                    resultArr.push({
	                        key: configKey,
	                        configValue: this.config.COMBINATIONS[k],
	                        dataValue: null,
	                        comboResult,
	                    });
	                }
	                continue;
	            }
	            const dataValue = this.getDataValue(configKeys[i]);
	            const keyOR = /OR/.test(configKey);
	            const keyAND = /AND/.test(configKey);
	            let compOp = null;
	            if (keyOR)
	                compOp = 'OR';
	            else if (keyAND)
	                compOp = 'AND';
	            const match = this.valuesMatch(dataValue, configValue, compOp);
	            const resultArr = match ? this._result.pass : this._result.fail;
	            resultArr.push({
	                key: configKey,
	                dataValue,
	                configValue,
	            });
	        }
	    }
	    getDataValue(key) {
	        const props = key.replace('AND', 'OR').split('OR');
	        let values = [];
	        for (let i = 0; i < props.length; i++) {
	            let value = this.tmpData[props[i]];
	            values.push(value);
	        }
	        return values;
	    }
	    valuesMatch(dataValue, configValue, compOp) {
	        // check that each dataValue matches at least one configValue
	        let anyFailed = false;
	        let anyPassed = false;
	        for (let i = 0; i < dataValue.length; i++) {
	            for (let k = 0; k < configValue.length; k++) {
	                const type = typeofValue(dataValue[i]);
	                const match = this[`${type}sMatch`](dataValue[i], configValue[k]);
	                if (match) {
	                    anyPassed = true;
	                }
	                else {
	                    anyFailed = true;
	                }
	            }
	        }
	        if (compOp === 'AND' && anyFailed)
	            return false;
	        return anyPassed;
	    }
	    // the below 3 methods don't appear to be but are actually used
	    // (calling with a computed string throws off typescript)
	    // @ts-ignore
	    stringsMatch(dataStr, configStr) {
	        if (configStr instanceof RegExp) {
	            // configStr is a regex, convert and compare
	            const regex = configStr;
	            const matches = regex.test(dataStr);
	            return matches;
	        }
	        else {
	            // both are string; dataStr only needs to contain each word in configStr (case-insensitive)
	            const configWords = configStr.toLowerCase().split(' ');
	            for (let i = 0; i < configWords.length; i++) {
	                if (!dataStr.toLowerCase().includes(configWords[i]))
	                    return false;
	            }
	            return true;
	        }
	    }
	    // @ts-ignore
	    numbersMatch(dataNum, configNum) {
	        const ops = {
	            GREATER_THAN: (a, b) => a > b,
	            GREATER_THAN_OR_EQUAL: (a, b) => a >= b,
	            LESS_THAN: (a, b) => a < b,
	            LESS_THAN_OR_EQUAL: (a, b) => a <= b,
	        };
	        if (typeof configNum === 'number') {
	            return this.equal(dataNum, configNum);
	        }
	        else {
	            // if it's not a number let's just assume that it's a Comp Object
	            const op = Object.keys(configNum)[0];
	            let value;
	            if (Array.isArray(configNum[op])) {
	                value = this.evalMath(configNum[op]);
	            }
	            else {
	                value = configNum[op];
	            }
	            if (value === null)
	                return false;
	            return ops[op](dataNum, value);
	        }
	    }
	    // @ts-ignore
	    booleansMatch(dataBool, configBool) {
	        // kind of pointless but whatever
	        return this.equal(dataBool, configBool);
	    }
	    evalMath(val) {
	        const ops = {
	            '*': (a, b) => a * b,
	            '/': (a, b) => a / b,
	            '+': (a, b) => a + b,
	            '-': (a, b) => a - b,
	        };
	        const [num, op, propName] = val;
	        const propValue = this.tmpData[propName];
	        if ((!num && !op) || propValue === null) {
	            return propValue;
	        }
	        else {
	            return ops[op](num, propValue);
	        }
	    }
	    equal(val1, val2) {
	        return val1 === val2;
	    }
	}

	state.blocklist = GM_getValue('blocklist', '');
	// disable blocklist on localhost
	if (location.host === 'localhost')
	    state.blocklist = '';
	function addToBlocklist(hit) {
	    const blockStr = hash(hit.title + hit.requester.id);
	    state.blocklist += blockStr;
	}
	function inBlocklist(hit) {
	    const blockStr = hash(hit.title + hit.requester.id);
	    return state.blocklist.indexOf(blockStr) > -1;
	}
	function hash(str) {
	    // this is an empty function for now until i decide if i want to do hashes
	    return str + ';';
	}
	window.addEventListener('beforeunload', function () {
	    GM_setValue('blocklist', state.blocklist);
	    // since we're already listening for unload, just save the log here too
	    localStorage.setItem('log', JSON.stringify(state.log));
	});

	const DEBUGGING = location.host === 'localhost' || unsafeWindow.DEBUG;
	const acceptQueue = [];
	function acceptHIT(hit) {
	    acceptQueue.push(hit);
	}
	function loop() {
	    setTimeout(function () {
	        const hit = acceptQueue.pop();
	        if (!hit)
	            return loop();
	        if (DEBUGGING) {
	            console.log('Accept Loop:', hit);
	            return loop();
	        }
	        const msgData = {
	            time: (new Date()).getTime(),
	            command: 'addOnceJob',
	            data: {
	                groupId: hit.groupId,
	                title: makeTitle(convertObj(hit)),
	                requesterName: hit.requester.name,
	                requesterId: hit.requester.id,
	                pay: hit.payRaw,
	                duration: hit.timeStr,
	                hitsAvailable: hit.numHits,
	            },
	        };
	        // send a message to panda crazy to add hit to its queue
	        localStorage.setItem('JR_message_pandacrazy', JSON.stringify(msgData));
	        loop();
	    }, (Math.random() * 800) + 100);
	}
	loop();
	function convertObj(data) {
	    // returns an obj in the format that makeTitle expects
	    const now = new Date();
	    const month = pad(2, now.getMonth() + 1);
	    const day = pad(2, now.getDate());
	    const year = now.getFullYear();
	    const hour = pad(2, now.getHours());
	    const minute = pad(2, now.getMinutes());
	    const dateStr = `${month} ${day}, ${year} ${hour}:${minute}`;
	    const newObj = {
	        title: data.title,
	        pay: data.pay + (/bonus/i.test(data.title) ? '+' : ''),
	        time: data.timeStr,
	        timeMS: data.time * 1000,
	        formattedPostDate: dateStr,
	    };
	    return newObj;
	}
	function makeTitle(hit) {
	    let deleteTime = '';
	    if (hit.time) {
	        const now = new Date();
	        const deleteDate = new Date();
	        deleteDate.setHours(+hit.formattedPostDate.substr(-5, 2));
	        deleteDate.setMinutes(+hit.formattedPostDate.substr(-2, 2));
	        // should delete watcher after 2.25 times the hit's duration since it was posted
	        deleteDate.setMilliseconds(hit.timeMS * 2.25);
	        let day = '';
	        if (deleteDate.getDate() !== now.getDate()) {
	            day = `${deleteDate.getMonth() + 1}/${deleteDate.getDate()}-`;
	        }
	        const hours = pad(2, time24To12(deleteDate.getHours()));
	        const minutes = pad(2, deleteDate.getMinutes());
	        const ampm = amORpm(deleteDate.getHours());
	        deleteTime = `[${day}${hours}:${minutes} ${ampm}] -- `;
	    }
	    let pay = '';
	    if (hit.pay) {
	        pay = hit.pay + ' -- ';
	    }
	    let title = hit.title.trim();
	    // let title = hit.title.substr(0, 35).trim();
	    if (title.length < hit.title.length) {
	        title += '...';
	    }
	    return deleteTime + pay + title;
	}
	function pad(width, n, z = '0') {
	    n = n + '';
	    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	function time24To12(hours) {
	    return ((hours + 11) % 12 + 1);
	}
	function amORpm(hour) {
	    if (hour >= 12)
	        return 'PM';
	    return 'AM';
	}

	// @ts-ignore
	const HS_API = unsafeWindow.HS_API;

	const acceptConfig = {
	    goodPay: true,
	    titleORdesc: [
	        'game bonus',
	        'economic decision',
	        'financial decision',
	        'mturk',
	        'decision experiment',
	    ],
	    requester_name: [
	        'Google',
	        'Galileo',
	        'Dermot Lynott',
	        'Stanford GSB Behavioral Lab',
	        'Sergey Schmidt',
	        'Scalable',
	        'Joe Lo',
	        'Thomas Vogt',
	    ],
	    requester_id: [
	        'A3UZVHOLFVVAXW',
	    ],
	    payRaw: {
	        // allow the pay to be a little bit below the payRateTarget
	        GREATER_THAN_OR_EQUAL: [0.95, '*', 'payRateTarget'],
	    },
	    COMBINATIONS: [
	        {
	            // lower the payRateTarget a little for reputable requesters
	            // (if they have good ratings the timeEstimate might be overestimated)
	            isReputable: true,
	            payRaw: {
	                GREATER_THAN_OR_EQUAL: [0.85, '*', 'payRateTarget'],
	            },
	        },
	        {
	            // requester is reputable, the HIT has bad pay AND the titleORdesc does not mention a bonus
	            titleORdesc: 'bonus',
	            isReputable: true,
	            payRaw: {
	                LESS_THAN_OR_EQUAL: [0.5, '*', 'payRateTarget'],
	            },
	        },
	        {
	            // goodPay can't be determined but requester is reputable
	            goodPay: null,
	            isReputable: true,
	            titleORdesc: 'survey',
	        },
	        {
	            // qual hits
	            titleORdesc: ['qualify', 'screener', 'qualification'],
	            isReputable: true,
	        },
	    ],
	};

	const ignoreConfig = {
	    titleORdesc: [
	        /(wom(a|e)n|females?) only/i,
	        'inquisit',
	        'chrome extension',
	        /writ(e|ing)/i,
	        /user? testing/i,
	        /sign[\s-]up/i,
	        /only for worker/i,
	        /compensation HIT/i,
	        /short answer/i,
	        /phone call/i,
	        'usability',
	        'inquisit',
	        'download',
	        'physic test',
	        'essay',
	        'webcam',
	        'Brightech Litespan Lamp',
	        'take photos of',
	    ],
	    requester_name: [
	        'C-SATS, Inc',
	        'AudioKite',
	        'Melanie Stearns',
	        'Jonathan Pirc',
	        'CAD',
	        'UserLook',
	        "Vito D'Orazio",
	        'Zaijia Liu',
	        'Usability Tester',
	        'Pivotal Perspectives Team',
	        'Darius Frank',
	        'mturk.admin',
	        'Alf B. Kanten',
	        'Cammy Crolic',
	        'UA Research Group',
	        'Roderick Swaab',
	        'Verena Rapp',
	        'UserBob',
	        'Anna Travolta',
	        'Carlos de Matos Fernandes',
	        'Judgment Lab',
	        'Jennifer Whitson',
	        'Florent Girardin',
	    ],
	    masters: true,
	    qualified: false,
	    blocked: true,
	    COMBINATIONS: [],
	};

	const acceptConfig$1 = new Config(acceptConfig);
	const ignoreConfig$1 = new Config(ignoreConfig);
	HS_API.search.listen(function (hits, eventType) {
	    if (!state.enabled)
	        return;
	    const data = [];
	    for (let i = 0; i < hits.length; i++) {
	        const hitData = hits[i];
	        const metaData = getMetaData(hitData);
	        if (inBlocklist(hitData)) {
	            continue;
	        }
	        // add to blocklist on 'update' since that's when hits will have most accurate info
	        // or if TO is disabled there will be no 'update' so add anyway
	        if (eventType === 'update' || HS_API.settings.get('disableTO')) {
	            addToBlocklist(hitData);
	        }
	        data[i] = [hitData, metaData];
	        const accept = acceptConfig$1.passes(hitData, metaData);
	        const ignore = ignoreConfig$1.passes(hitData, metaData);
	        if (accept && !ignore) {
	            acceptHIT(hitData);
	            // some hits will be accepted on 'add' event before being blocked so block those here
	            if (!inBlocklist(hitData)) {
	                addToBlocklist(hitData);
	            }
	        }
	        if (location.host === 'localhost') {
	            if (accept || ignore) {
	                console.groupCollapsed(`%c${hitData.title} (${hitData.pay})`, `color: ${accept && !ignore ? 'green' : 'red'}`);
	                console.log('ignore result:', ignoreConfig$1.result);
	                console.log('accept result:', acceptConfig$1.result);
	            }
	            else if (eventType === 'update' || HS_API.settings.get('disableTO')) {
	                console.groupCollapsed(`${hitData.title} (${hitData.pay})`);
	                console.log(Object.assign({}, hitData, metaData));
	            }
	            console.groupEnd();
	        }
	    }
	});

}());
