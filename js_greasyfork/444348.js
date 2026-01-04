// ==UserScript==
// @name         All in One Injector.V1
// @namespace    Mordern
// @version      Mordern.5
// @description  Youtube Downloader, Discord Delete Message Injector, Discord BackGround Injector, Discord Emotes Injector (Use all emotes), AntiVertify Injector
// @author       Mordern
// @license      GNU Public License V3
// @match        https://discordapp.com/library/*
// @match        https://discordapp.com/store/*
// @match        https://discordapp.com/channels/*
// @match        https://discord.com/library/*
// @match        https://discord.com/store/*
// @match        https://discord.com/channels/*
// @icon         https://cdn.discordapp.com/avatars/834842435204284527/8ab16792caaa54dd6ff2a3e9de7a57b0.png?size=4096
// @match        https://discord.com/channels/*
// @match        https://discord.com/channels/*/*
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addElement
// @connect      i.imgur.com
// @run-at document-end
// @match         https://discord.com/*
// @homepageURL   https://github.com/victornpb/deleteDiscordMessages
// @supportURL    https://github.com/victornpb/deleteDiscordMessages/issues// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM.registerMenuCommand
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM.registerMenuCommand
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @match        https://*.youtube.com/*
// @require      https://unpkg.com/vue@2.6.10/dist/vue.js
// @require      https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js
// @require      https://unpkg.com/@ffmpeg/ffmpeg@0.6.1/dist/ffmpeg.min.js
// @require      https://bundle.run/p-queue@6.3.0
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @connect      googlevideo.com
// @compatible   firefox >=52
// @compatible   chrome >=55
// @downloadURL https://update.greasyfork.org/scripts/444348/All%20in%20One%20InjectorV1.user.js
// @updateURL https://update.greasyfork.org/scripts/444348/All%20in%20One%20InjectorV1.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    setTimeout(function(){
        document.querySelector('[aria-label="VERIFICATION"]').remove();
        document.querySelector("#app-mount > div:nth-of-type(2)").children[0].children[1].children[0].style = ""
    }, 15000);
})();




(async window => {
    'use strict';
    let intervalTime = 30 * 1000;
    let urls = [
        'https://i.imgur.com/MMJhM6R.jpeg',
        'https://i.imgur.com/6Y0waqQ.png',
        'https://i.imgur.com/SGbjs36.png',
        'https://i.imgur.com/87njjbP.jpeg',
        'https://i.imgur.com/y5tyz7v.jpeg',
        'https://i.imgur.com/7vEByIE.png',
        'https://i.imgur.com/N8FAHgN.jpeg',
        'https://i.imgur.com/CTAgXGz.jpeg',
        'https://i.imgur.com/ax6pZjY.jpeg',
        'https://i.imgur.com/GQWtuEg.jpeg',
        'https://i.imgur.com/wTYqtSV.jpeg',
        'https://i.imgur.com/tWx7OqJ.jpeg',
        'https://i.imgur.com/EgkJFvo.jpeg',
        'https://i.imgur.com/dHqTbO4.jpeg',
    ];
    let g_elm = null;
    const del = () => {
        if(g_elm) {
            g_elm.remove();
            g_elm = null;
            return true;
        }
        else return false;
    };
    const addInput = async value => {
        if(del()) return;
        g_elm = await GM.addElement(document.body, 'div', {});
        Object.assign(g_elm.style, {
            'position': 'fixed',
            'width': '50vw',
            'height': '30vh',
            'display': 'flex',
            'flex-wrap': 'wrap',
            'justify-content': 'center',
            'align-items': 'center',
            'z-index': Infinity
        });
        const input = await GM.addElement(g_elm, 'textarea', {
            textContent: value
        });
        Object.assign(input.style, {
            'width': '10vw',
            'height': '30vh',
            'font-size': '30px',
            'font-weight': 'bold'
        });
        const btnSave = await GM.addElement(g_elm, 'button', {
            textContent: 'save'
        });
        await GM.addElement(g_elm, 'div', {
            textContent: '　'
        });
        const btnCancel = await GM.addElement(g_elm, 'button', {
            textContent: 'cancel'
        });
        for(const v of [btnSave, btnCancel]) Object.assign(v.style, {
            'color': 'white',
            'backgroundColor': 'red'
        });
        return new Promise((resolve, reject) => {
            btnSave.addEventListener('click', () => del() && resolve(input.value));
            btnCancel.addEventListener('click', () => del() && reject());
        });
    };
    const key1 = 'intervalTime';
    GM.registerMenuCommand('config interval time', async () => {
        const res = await addInput(await GM.getValue(key1, intervalTime));
        if(!res) return;
        const m = res.match(/[0-9]+/);
        if(!m) return;
        const n = Number(m[0]);
        intervalTime = n;
        GM.setValue(key1, n);
    });
    intervalTime = await GM.getValue(key1, intervalTime);
    const key2 = 'URL';
    GM.registerMenuCommand('config URL', async () => {
        const res = await addInput(await GM.getValue(key2, urls.join('\n')));
        if(!res) return;
        const a = findURL(res);
        if(!a.length) return;
        urls = a;
        GM.setValue(key2, a.join('\n'));
    });
    urls = (await GM.getValue(key2, urls.join('\n'))).split('\n');
    const findURL = str => {

    };
    const memo = new Map;
    const get = async url => {
        if(memo.has(url)) return memo.get(url);
        const res = await GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            withCredentials: true,
            responseType: 'arraybuffer',
        });
        const _url = URL.createObjectURL(new Blob([res.response], {type: 'application/octet-binary'}));
        memo.set(url, _url);
        return _url;
    };
    let g_url = await get(urls[0]);
    const wait = resolve => {
        if(document.querySelector('[class^="chatContent"]')) return resolve();
        setTimeout(() => wait(resolve), 500);
    };
    await new Promise(resolve => wait(resolve));
    const setURL = () => {
        Object.assign(document.body.children[0].style, {
            'background-image': 'url("' + g_url + '")',
            'background-attachment': 'fixed',
            'background-position': 'center center',
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'transition-duration': '1.5s'
        });
    };
    setURL();
    const setOther = () => {
        for(const v of document.querySelectorAll('*')) v.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        document.body.children[0].children[3].style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    };
    setOther();
    let _url = location.href,
        _time = 0,
        index = 0;
    const update = async () => {
        const time = performance.now();
        if(time - _time > intervalTime) {
            g_url = await get(urls[(++index) % urls.length]);
            _time = performance.now();
            setURL();
        }
        else {
            const url = location.href;
            if(url !== _url) {
                _url = url;
                setOther();
            }
        }
        requestAnimationFrame(update);
    };
    update();
})(window.unsafeWindow || window);





/**
 * Delete all messages in a Discord channel or DM
 * @param {string} authToken Your authorization token
 * @param {string} authorId Author of the messages you want to delete
 * @param {string} guildId Server were the messages are located
 * @param {string} channelId Channel were the messages are located
 * @param {string} minId Only delete messages after this, leave blank do delete all
 * @param {string} maxId Only delete messages before this, leave blank do delete all
 * @param {string} content Filter messages that contains this text content
 * @param {boolean} hasLink Filter messages that contains link
 * @param {boolean} hasFile Filter messages that contains file
 * @param {boolean} includeNsfw Search in NSFW channels
 * @param {function(string, Array)} extLogger Function for logging
 * @param {function} stopHndl stopHndl used for stopping
 * @author Victornpb <https://www.github.com/victornpb>
 * @see https://github.com/victornpb/deleteDiscordMessages
 */
async function deleteMessages(authToken, authorId, guildId, channelId, minId, maxId, content, hasLink, hasFile, includeNsfw, includePinned, searchDelay, deleteDelay, extLogger, stopHndl, onProgress) {
    const start = new Date();
    let delCount = 0;
    let failCount = 0;
    let avgPing;
    let lastPing;
    let grandTotal;
    let throttledCount = 0;
    let throttledTotalTime = 0;
    let offset = 0;
    let iterations = -1;

    const wait = async ms => new Promise(done => setTimeout(done, ms));
    const msToHMS = s => `${s / 3.6e6 | 0}h ${(s % 3.6e6) / 6e4 | 0}m ${(s % 6e4) / 1000 | 0}s`;
    const escapeHTML = html => html.replace(/[&<"']/g, m => ({ '&': '&amp;', '<': '&lt;', '"': '&quot;', '\'': '&#039;' })[m]);
    const redact = str => `<span class="priv">${escapeHTML(str)}</span><span class="mask">REDACTED</span>`;
    const queryString = params => params.filter(p => p[1] !== undefined).map(p => p[0] + '=' + encodeURIComponent(p[1])).join('&');
    const ask = async msg => new Promise(resolve => setTimeout(() => resolve(window.confirm(msg)), 10));
    const printDelayStats = () => log.verb(`Delete delay: ${deleteDelay}ms, Search delay: ${searchDelay}ms`, `Last Ping: ${lastPing}ms, Average Ping: ${avgPing | 0}ms`);
    const toSnowflake = (date) => /:/.test(date) ? ((new Date(date).getTime() - 1420070400000) * Math.pow(2, 22)) : date;

    const log = {
        debug() { extLogger ? extLogger('debug', arguments) : console.debug.apply(console, arguments); },
        info() { extLogger ? extLogger('info', arguments) : console.info.apply(console, arguments); },
        verb() { extLogger ? extLogger('verb', arguments) : console.log.apply(console, arguments); },
        warn() { extLogger ? extLogger('warn', arguments) : console.warn.apply(console, arguments); },
        error() { extLogger ? extLogger('error', arguments) : console.error.apply(console, arguments); },
        success() { extLogger ? extLogger('success', arguments) : console.info.apply(console, arguments); },
    };

    async function recurse() {
        let API_SEARCH_URL;
        if (guildId === '@me') {
            API_SEARCH_URL = `https://discord.com/api/v6/channels/${channelId}/messages/`; // DMs
        }
        else {
            API_SEARCH_URL = `https://discord.com/api/v6/guilds/${guildId}/messages/`; // Server
        }

        const headers = {
            'Authorization': authToken
        };

        let resp;
        try {
            const s = Date.now();
            resp = await fetch(API_SEARCH_URL + 'search?' + queryString([
                ['author_id', authorId || undefined],
                ['channel_id', (guildId !== '@me' ? channelId : undefined) || undefined],
                ['min_id', minId ? toSnowflake(minId) : undefined],
                ['max_id', maxId ? toSnowflake(maxId) : undefined],
                ['sort_by', 'timestamp'],
                ['sort_order', 'desc'],
                ['offset', offset],
                ['has', hasLink ? 'link' : undefined],
                ['has', hasFile ? 'file' : undefined],
                ['content', content || undefined],
                ['include_nsfw', includeNsfw ? true : undefined],
            ]), { headers });
            lastPing = (Date.now() - s);
            avgPing = avgPing > 0 ? (avgPing * 0.9) + (lastPing * 0.1) : lastPing;
        } catch (err) {
            return log.error('Search request threw an error:', err);
        }

        // not indexed yet
        if (resp.status === 202) {
            const w = (await resp.json()).retry_after;
            throttledCount++;
            throttledTotalTime += w;
            log.warn(`This channel wasn't indexed, waiting ${w}ms for discord to index it...`);
            await wait(w);
            return await recurse();
        }

        if (!resp.ok) {
            // searching messages too fast
            if (resp.status === 429) {
                const w = (await resp.json()).retry_after;
                throttledCount++;
                throttledTotalTime += w;
                searchDelay += w; // increase delay
                log.warn(`Being rate limited by the API for ${w}ms! Increasing search delay...`);
                printDelayStats();
                log.verb(`Cooling down for ${w * 2}ms before retrying...`);

                await wait(w * 2);
                return await recurse();
            } else {
                return log.error(`Error searching messages, API responded with status ${resp.status}!\n`, await resp.json());
            }
        }

        const data = await resp.json();
        const total = data.total_results;
        if (!grandTotal) grandTotal = total;
        const discoveredMessages = data.messages.map(convo => convo.find(message => message.hit === true));
        const messagesToDelete = discoveredMessages.filter(msg => {
            return msg.type === 0 || msg.type === 6 || (msg.pinned && includePinned);
        });
        const skippedMessages = discoveredMessages.filter(msg => !messagesToDelete.find(m => m.id === msg.id));

        const end = () => {
            log.success(`Ended at ${new Date().toLocaleString()}! Total time: ${msToHMS(Date.now() - start.getTime())}`);
            printDelayStats();
            log.verb(`Rate Limited: ${throttledCount} times. Total time throttled: ${msToHMS(throttledTotalTime)}.`);
            log.debug(`Deleted ${delCount} messages, ${failCount} failed.\n`);
        }

        const etr = msToHMS((searchDelay * Math.round(total / 25)) + ((deleteDelay + avgPing) * total));
        log.info(`Total messages found: ${data.total_results}`, `(Messages in current page: ${data.messages.length}, To be deleted: ${messagesToDelete.length}, System: ${skippedMessages.length})`, `offset: ${offset}`);
        printDelayStats();
        log.verb(`Estimated time remaining: ${etr}`)


        if (messagesToDelete.length > 0) {

            if (++iterations < 1) {
                log.verb(`Waiting for your confirmation...`);
                if (!await ask(`Do you want to delete ~${total} messages?\nEstimated time: ${etr}\n\n---- Preview ----\n` +
                    messagesToDelete.map(m => `${m.author.username}#${m.author.discriminator}: ${m.attachments.length ? '[ATTACHMENTS]' : m.content}`).join('\n')))
                    return end(log.error('Aborted by you!'));
                log.verb(`OK`);
            }

            for (let i = 0; i < messagesToDelete.length; i++) {
                const message = messagesToDelete[i];
                if (stopHndl && stopHndl() === false) return end(log.error('Stopped by you!'));

                log.debug(`${((delCount + 1) / grandTotal * 100).toFixed(2)}% (${delCount + 1}/${grandTotal})`,
                    `Deleting ID:${redact(message.id)} <b>${redact(message.author.username + '#' + message.author.discriminator)} <small>(${redact(new Date(message.timestamp).toLocaleString())})</small>:</b> <i>${redact(message.content).replace(/\n/g, '↵')}</i>`,
                    message.attachments.length ? redact(JSON.stringify(message.attachments)) : '');
                if (onProgress) onProgress(delCount + 1, grandTotal);

                let resp;
                try {
                    const s = Date.now();
                    const API_DELETE_URL = `https://discord.com/api/v6/channels/${message.channel_id}/messages/${message.id}`;
                    resp = await fetch(API_DELETE_URL, {
                        headers,
                        method: 'DELETE'
                    });
                    lastPing = (Date.now() - s);
                    avgPing = (avgPing * 0.9) + (lastPing * 0.1);
                    delCount++;
                } catch (err) {
                    log.error('Delete request throwed an error:', err);
                    log.verb('Related object:', redact(JSON.stringify(message)));
                    failCount++;
                }

                if (!resp.ok) {
                    // deleting messages too fast
                    if (resp.status === 429) {
                        const w = (await resp.json()).retry_after;
                        throttledCount++;
                        throttledTotalTime += w;
                        deleteDelay = w; // increase delay
                        log.warn(`Being rate limited by the API for ${w}ms! Adjusted delete delay to ${deleteDelay}ms.`);
                        printDelayStats();
                        log.verb(`Cooling down for ${w * 2}ms before retrying...`);
                        await wait(w * 2);
                        i--; // retry
                    } else {
                        log.error(`Error deleting message, API responded with status ${resp.status}!`, await resp.json());
                        log.verb('Related object:', redact(JSON.stringify(message)));
                        failCount++;
                    }
                }

                await wait(deleteDelay);
            }

            if (skippedMessages.length > 0) {
                grandTotal -= skippedMessages.length;
                offset += skippedMessages.length;
                log.verb(`Found ${skippedMessages.length} system messages! Decreasing grandTotal to ${grandTotal} and increasing offset to ${offset}.`);
            }

            log.verb(`Searching next messages in ${searchDelay}ms...`, (offset ? `(offset: ${offset})` : ''));
            await wait(searchDelay);

            if (stopHndl && stopHndl() === false) return end(log.error('Stopped by you!'));

            return await recurse();
        } else {
            if (total - offset > 0) log.warn('Ended because API returned an empty page.');
            return end();
        }
    }

    log.success(`\nStarted at ${start.toLocaleString()}`);
    log.debug(`authorId="${redact(authorId)}" guildId="${redact(guildId)}" channelId="${redact(channelId)}" minId="${redact(minId)}" maxId="${redact(maxId)}" hasLink=${!!hasLink} hasFile=${!!hasFile}`);
    if (onProgress) onProgress(null, 1);
    return await recurse();
}

//---- User interface ----//

let popover;
let btn;
let stop;

function initUI() {

    const insertCss = (css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    }

    const createElm = (html) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.removeChild(temp.firstElementChild);
    }

    insertCss(`
        #undicord-btn{position: relative; height: 24px;width: auto;-webkit-box-flex: 0;-ms-flex: 0 0 auto;flex: 0 0 auto;margin: 0 8px;cursor:pointer; color: var(--interactive-normal);}
        #undiscord{position:fixed;top:100px;right:10px;bottom:10px;width:780px;z-index:99;color:var(--text-normal);background-color:var(--background-secondary);box-shadow:var(--elevation-stroke),var(--elevation-high);border-radius:4px;display:flex;flex-direction:column}
        #undiscord a{color:#00b0f4}
        #undiscord.redact .priv{display:none!important}
        #undiscord:not(.redact) .mask{display:none!important}
        #undiscord.redact [priv]{-webkit-text-security:disc!important}
        #undiscord .toolbar span{margin-right:8px}
        #undiscord button,#undiscord .btn{color:#fff;background:#7289da;border:0;border-radius:4px;font-size:14px}
        #undiscord button:disabled{display:none}
        #undiscord input[type="text"],#undiscord input[type="search"],#undiscord input[type="password"],#undiscord input[type="datetime-local"],#undiscord input[type="number"]{background-color:#202225;color:#b9bbbe;border-radius:4px;border:0;padding:0 .5em;height:24px;width:144px;margin:2px}
        #undiscord input#file{display:none}
        #undiscord hr{border-color:rgba(255,255,255,0.1)}
        #undiscord .header{padding:12px 16px;background-color:var(--background-tertiary);color:var(--text-muted)}
        #undiscord .form{padding:8px;background:var(--background-secondary);box-shadow:0 1px 0 rgba(0,0,0,.2),0 1.5px 0 rgba(0,0,0,.05),0 2px 0 rgba(0,0,0,.05)}
        #undiscord .logarea{overflow:auto;font-size:.75rem;font-family:Consolas,Liberation Mono,Menlo,Courier,monospace;flex-grow:1;padding:10px}
    `);

    popover = createElm(`
    <div id="undiscord" style="display:none;">
        <div class="header">
            Undiscord - Bulk delete messages
        </div>
        <div class="form">
            <div style="display:flex;flex-wrap:wrap;">
                <span>Authorization <a
                        href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/authToken.md" title="Help"
                        target="_blank">?</a> <button id="getToken">get</button><br>
                    <input type="password" id="authToken" placeholder="Auth Token" autofocus>*<br>
                    <span>Author <a href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/authorId.md"
                            title="Help" target="_blank">?</a> <button id="getAuthor">get</button></span>
                    <br><input id="authorId" type="text" placeholder="Author ID" priv></span>
                <span>Guild/Channel <a
                        href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/channelId.md" title="Help"
                        target="_blank">?</a>
                    <button id="getGuildAndChannel">get</button><br>
                    <input id="guildId" type="text" placeholder="Guild ID" priv><br>
                    <input id="channelId" type="text" placeholder="Channel ID" priv><br>
                    <label><input id="includeNsfw" type="checkbox">NSFW Channel</label><br><br>
                    <label for="file" title="Import list of channels from messages/index.json file"> Import: <span
                            class="btn">...</span> <input id="file" type="file" accept="application/json,.json"></label>
                </span><br>
                <span>Range <a href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/messageId.md"
                        title="Help" target="_blank">?</a><br>
                    <input id="minDate" type="datetime-local" title="After" style="width:auto;"><br>
                    <input id="maxDate" type="datetime-local" title="Before" style="width:auto;"><br>
                    <input id="minId" type="text" placeholder="After message with Id" priv><br>
                    <input id="maxId" type="text" placeholder="Before message with Id" priv><br>
                </span>
                <span>Search messages <a
                        href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/filters.md" title="Help"
                        target="_blank">?</a><br>
                    <input id="content" type="text" placeholder="Containing text" priv><br>
                    <label><input id="hasLink" type="checkbox">has: link</label><br>
                    <label><input id="hasFile" type="checkbox">has: file</label><br>
                    <label><input id="includePinned" type="checkbox">Include pinned</label>
                </span><br>
                <span>Search Delay <a
                href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/delay.md" title="Help"
                target="_blank">?</a><br>
                    <input id="searchDelay" type="number" value="100" step="100"><br>
                </span>
                <span>Delete Delay <a
                href="https://github.com/victornpb/deleteDiscordMessages/blob/master/help/delay.md" title="Help"
                target="_blank">?</a><br>
                    <input id="deleteDelay" type="number" value="1000" step="100">
                </span>
            </div>
            <hr>
            <button id="start" style="background:#43b581;width:80px;">Start</button>
            <button id="stop" style="background:#f04747;width:80px;" disabled>Stop</button>
            <button id="clear" style="width:80px;">Clear log</button>
            <label><input id="autoScroll" type="checkbox" checked>Auto scroll</label>
            <label title="Hide sensitive information for taking screenshots"><input id="redact" type="checkbox">Screenshot
                mode</label>
            <progress id="progress" style="display:none;"></progress> <span class="percent"></span>
        </div>
        <pre class="logarea">
            <center>Star this project on <a href="https://github.com/victornpb/deleteDiscordMessages" target="_blank">github.com/victornpb/deleteDiscordMessages</a>!\n\n
                <a href="https://github.com/victornpb/deleteDiscordMessages/issues" target="_blank">Issues or help</a>
            </center>
        </pre>
    </div>
    `);

    document.body.appendChild(popover);

    btn = createElm(`<div id="undicord-btn" tabindex="0" role="button" aria-label="Delete Messages" title="Delete Messages">
    <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
        <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path>
    </svg>
    <br><progress style="display:none; width:24px;"></progress>
</div>`);

    btn.onclick = function togglePopover() {
        if (popover.style.display !== 'none') {
            popover.style.display = 'none';
            btn.style.color = 'var(--interactive-normal)';
        }
        else {
            popover.style.display = '';
            btn.style.color = '#f04747';
        }
    };

    function mountBtn() {
        const toolbar = document.querySelector('[class^=toolbar]');
        if (toolbar) toolbar.appendChild(btn);
    }

    const observer = new MutationObserver(function (_mutationsList, _observer) {
        if (!document.body.contains(btn)) mountBtn(); // re-mount the button to the toolbar
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });

    mountBtn();

    const $ = s => popover.querySelector(s);
    const logArea = $('pre');
    const startBtn = $('button#start');
    const stopBtn = $('button#stop');
    const autoScroll = $('#autoScroll');

    startBtn.onclick = async e => {
        const authToken = $('input#authToken').value.trim();
        const authorId = $('input#authorId').value.trim();
        const guildId = $('input#guildId').value.trim();
        const channelIds = $('input#channelId').value.trim().split(/\s*,\s*/);
        const minId = $('input#minId').value.trim();
        const maxId = $('input#maxId').value.trim();
        const minDate = $('input#minDate').value.trim();
        const maxDate = $('input#maxDate').value.trim();
        const content = $('input#content').value.trim();
        const hasLink = $('input#hasLink').checked;
        const hasFile = $('input#hasFile').checked;
        const includeNsfw = $('input#includeNsfw').checked;
        const includePinned = $('input#includePinned').checked;
        const searchDelay = parseInt($('input#searchDelay').value.trim());
        const deleteDelay = parseInt($('input#deleteDelay').value.trim());
        const progress = $('#progress');
        const progress2 = btn.querySelector('progress');
        const percent = $('.percent');

        const fileSelection = $("input#file");
        fileSelection.addEventListener("change", () => {
            const files = fileSelection.files;
            const channelIdField = $('input#channelId');
            if (files.length > 0) {
                const file = files[0];
                file.text().then(text => {
                    let json = JSON.parse(text);
                    let channels = Object.keys(json);
                    channelIdField.value = channels.join(",");
                });
            }
        }, false);

        const stopHndl = () => !(stop === true);

        const onProg = (value, max) => {
            if (value && max && value > max) max = value;
            progress.setAttribute('max', max);
            progress.value = value;
            progress.style.display = max ? '' : 'none';
            progress2.setAttribute('max', max);
            progress2.value = value;
            progress2.style.display = max ? '' : 'none';
            percent.innerHTML = value && max ? Math.round(value / max * 100) + '%' : '';
        };


        stop = stopBtn.disabled = !(startBtn.disabled = true);
        for (let i = 0; i < channelIds.length; i++) {
            await deleteMessages(authToken, authorId, guildId, channelIds[i], minId || minDate, maxId || maxDate, content, hasLink, hasFile, includeNsfw, includePinned, searchDelay, deleteDelay, logger, stopHndl, onProg);
            stop = stopBtn.disabled = !(startBtn.disabled = false);
        }
    };
    stopBtn.onclick = e => stop = stopBtn.disabled = !(startBtn.disabled = false);
    $('button#clear').onclick = e => { logArea.innerHTML = ''; };
    $('button#getToken').onclick = e => {
        window.dispatchEvent(new Event('beforeunload'));
        const ls = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
        $('input#authToken').value = JSON.parse(localStorage.token);
    };
    $('button#getAuthor').onclick = e => {
        $('input#authorId').value = JSON.parse(localStorage.user_id_cache);
    };
    $('button#getGuildAndChannel').onclick = e => {
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        $('input#guildId').value = m[1];
        $('input#channelId').value = m[2];
    };
    $('#redact').onchange = e => {
        popover.classList.toggle('redact') &&
            window.alert('This will attempt to hide personal information, but make sure to double check before sharing screenshots.');
    };

    const logger = (type = '', args) => {
        const style = { '': '', info: 'color:#ff0000;', verb: 'color:#72767d;', warn: 'color:#faa61a;', error: 'color:#f04747;', success: 'color:#43b581;' }[type];
        logArea.insertAdjacentHTML('beforeend', `<div style="${style}">${Array.from(args).map(o => typeof o === 'object' ? JSON.stringify(o, o instanceof Error && Object.getOwnPropertyNames(o)) : o).join('\t')}</div>`);
        if (autoScroll.checked) logArea.querySelector('div:last-child').scrollIntoView(false);
    };

    // fixLocalStorage
    window.localStorage = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;

}

initUI();
//END





(async function() {
    'use strict';

    let last_ver = '';

    let v1 = await GM.getValue('version', '1');
    let s1 = v1.split('.');

    function comp_ver (v2) {

        last_ver = v2;

        let s2 = v2.split('.');

        for (let i = 0; i < Math.min(s1.length, s2.length); i += 1) {

            let a = parseInt(s1[i]);
            let b = parseInt(s2[i]);

            if (a !== b) {
                return a < b;
            }
        }

        return s1.length < s2.length;
    }

    let urls = await GM.getValue('urls', {});

    if (comp_ver('1.4.10')) {

        for (let [key, entry] of Object.entries(urls)) {
            urls[key] = [entry];
        }
        await GM.setValue('urls', urls);
    }

    if (comp_ver('1.4.16')) {

        for (let [key, entry] of Object.entries(urls)) {
            if (key.lastIndexOf('.') < key.lastIndexOf('/')) {
                delete urls[key];
            }
        }
        await GM.setValue('urls', urls);
    }

    GM.setValue('version', last_ver);

    function sleep (time) {
        return new Promise((ok) => {setTimeout(ok, time);});
    }

    function createElementFromHTML(htmlString) {
                var div = document.createElement('div');
                div.innerHTML = htmlString.trim();
                return div.firstChild;
            }

    function get_token () {

        let iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        let storage = iframe.contentWindow.localStorage;
        let token = storage.token.replace(/"/g, '');

        iframe.remove();
        return token;
    }

    function send (message) {

        let token = get_token();

        let channel_id = document.location.pathname.split('/').pop();

        let data = {
            "content": message,
            "tts": "false"
        }

        $.ajax({
            type: 'POST',
            url: 'https://discord.com/api/v6/channels/' + channel_id + '/messages',
            data: JSON.stringify(data),
            headers: {
                '%3Aauthority': 'discord.com',
                '%3Amethod': 'POST',
                '%3Apath': '/api/v6/channels/' + channel_id + '/messages',
                '%3Ascheme': 'https',
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
    }

    const probability = 35;

    document.addEventListener('mousedown', function (e) {

        let link = undefined;
        function set_link (img, size) {
            if (img !== null) {
                link = new URL(img.src);

                let title = $('[class*="titleSecondary-"] > strong')[0];
                let server = link.searchParams.get('server');

                if (server === null && title) {
                    server = title.textContent;
                }

                link.search = '?' + (right_click ? '' : `size=${size}`);
                if (server) {
                    link.search += `&server=${server}`;
                }

            }
        }

        let right_click = (e.button === 2);

        if (e.target.classList.value.includes('emojiItem-')
        && (e.target.classList.value.includes('emojiItemDisabled')
            || right_click)) {

            let img = e.target.querySelector('img');
            set_link(img, 48);

        } else
        if (e.target.classList.value.includes('stickerAsset-')
        && (e.target.parentNode.parentNode.classList.value.includes('stickerUnsendable')
            || right_click)) {

            let img = e.target;
            set_link(img, 160);

        } else
        if (e.target.parentNode.id === 'cheatemoji') {
            let img = e.target;
            right_click = right_click || img.srcset;
            set_link(img, 48);
        }

        if (link !== undefined) {

            if (Math.random() * 1000 < probability) {
                add_gayness(); // gayness for all!
            }

            send(link.href);
        }
    });

    urls = await GM.getValue('urls', {});

    let hover_url = '';
    let hover_server = '';

    const button_size = 28;

    let button = createElementFromHTML(`<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="24" height="24"
viewBox="0 0 48 48"
><path d="M 24 4 C 12.972066 4 4 12.972074 4 24 C 4 35.027926 12.972066 44 24 44 C 35.027934 44 44 35.027926 44 24 C 44 12.972074 35.027934 4 24 4 z M 24 7 C 33.406615 7 41 14.593391 41 24 C 41 33.406609 33.406615 41 24 41 C 14.593385 41 7 33.406609 7 24 C 7 14.593391 14.593385 7 24 7 z M 23.976562 13.978516 A 1.50015 1.50015 0 0 0 22.5 15.5 L 22.5 22.5 L 15.5 22.5 A 1.50015 1.50015 0 1 0 15.5 25.5 L 22.5 25.5 L 22.5 32.5 A 1.50015 1.50015 0 1 0 25.5 32.5 L 25.5 25.5 L 32.5 25.5 A 1.50015 1.50015 0 1 0 32.5 22.5 L 25.5 22.5 L 25.5 15.5 A 1.50015 1.50015 0 0 0 23.976562 13.978516 z"></path>
<circle style="pointer-events: visible;" id="svg_circle" cx="24" cy="24" r="29" fill="transparent"></circle></svg>`);

    let svg;
    setTimeout(() => {svg = $('#svg_circle')[0];}, 5);

    button.id = 'plus_svg';
    document.body.append(button);

    button.style['z-index'] = 10000;
    button.style.position = 'absolute';
    button.style.width = button_size + 'px';
    button.style.height = button_size + 'px';
    button.style['border-radius'] = '15px';

    hide_button();

    button.addEventListener('click', async () => {style_button(await toggle_url(hover_url));});

    function style_button (checked) {
        if (checked) {
            button.classList.add('checked');
        } else {
            button.classList.remove('checked');
        }
    }


    async function toggle_url (url) {

        if (!urls[url]) {

            urls[url] = [hover_server, deep];
            add_image(url, [hover_server, deep]);
        } else {

            delete urls[url];
            images[url].remove();
        }

        await GM.setValue('urls', urls);

        return urls[url];
    }

    let hide_timeout;
    let current = true;

    let test_img = document.createElement('img');
    let deep;

    async function hover (e) {

        let {target} = e;
        let parent = target.parentNode;

        //let hide = !button.contains(target);
        let hide = target !== svg;

        if (target.tagName === 'IMG') {

            let emoji = false;
            let url;

            if (parent.tagName === 'A') {

                emoji = true;
                url = new URL(parent.href);

                let server = url.searchParams.get('server');
                target.title = (server !== null ? `from ${server}` : '');
            }

            let temp = target;
            for (let i of [1,2,3]) {
                temp = temp.parentNode;
                if (temp.classList.value.includes('messageContent')) {
                    emoji = true;
                }
            }

            if (!emoji || parent.getAttribute('href') === '') {
                hide_button();
                return;
            }

            deep = undefined;

            test_img.src = url;
            test_img.onerror = () => {
                deep = new URL(target.src)
            };

            await sleep(50);

            test_img.onerror = undefined;

            let preview = url && deep;
            url = url || deep;

            if (url.pathname.slice(-4) === '.svg') {
                hide_button();
                return;
            }

            hover_url = url.origin + url.pathname;

            let chat_rect = $('[class^="chatContent"]')[0].getBoundingClientRect();
            let rect = target.getBoundingClientRect();

            button.style.left = rect.right + 3 + 'px';
            button.style.top = Math.max(rect.top + (48 - button_size)/2, chat_rect.top + 3) + 'px';

            style_button(urls[hover_url]);

            hover_server = url.searchParams.get('server');

            if (urls[hover_url]) {

                let image = images[hover_url];

                if (hover_server) {
                    urls[hover_url][0] = hover_server;
                    let temp = new URL(image.src);
                    temp.search = `?size=48&server=${hover_server}`;
                    image.src = temp.href;
                }

                if (preview) {
                    image.srcset = urls[hover_url][1] = deep.href;
                }

                GM.setValue('urls', urls);
            }

            hide = false;
        }

        /*if (hide !== current) {
            clearTimeout(hide_timeout);
            hide_timeout = setTimeout(() => {button.style.display = hide ? 'none' : 'block';}, 300);
            current = hide;
        }*/

        if (hide) {
            hide_button();
        } else {
            button.style.visibility = button.style.opacity = '';
        }
    }

    function hide_button () {
        button.style.visibility = 'hidden';
        button.style.opacity = '0';
    }

    document.addEventListener('mousemove', hover);
    document.body.addEventListener('wheel', hide_button);
    document.addEventListener('click', (e) => {

        if (!button.contains(e.target)) {
            hide_button();
        }
    });

    let images = {};

    let div = document.createElement('div');
    div.id = 'cheatemoji';
    div.addEventListener('contextmenu', (e) => {e.preventDefault();}, true);

    for (let [url, entry] of Object.entries(urls)) {
        add_image(url, entry);
    }

    function add_image (url, entry) {

        let [server, preview] = entry;

        let img = document.createElement('img');

        let obj = new URL(url);
        obj.search = `?size=48`;
        if (server) {
            obj.search += `&server=${server}`;
        }

        img.src = obj.href;
        if (preview) {
            img.srcset = preview;
        }

        div.append(img);

        images[url] = img;
    }


    let iframe2 = document.createElement('div');

    let fresh = true;

    let max_height = 0;

    setInterval(async () => {

        let list;

        let elem = $('[class*="bodyWrapper-"]')[0];
        if (elem !== undefined && !document.contains(iframe2)) {

            if (Math.random()*1000 < probability && await GM.getValue('active', true)) {

                let width = 400;
                let height = Math.trunc(width * 3/8)*2;

                iframe2 = createElementFromHTML(`<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/DLzxrzFCyOs?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
                elem.appendChild(iframe2);

                iframe2.style.position = 'absolute';
                iframe2.style['z-index'] = 10000;
                iframe2.style.left = 0;
                iframe2.style.top = 0;
                iframe2.style.width = '100%';
                iframe2.style.height = '100%';
                //iframe2.style['border-radius'] = '1000px';

                let div = document.createElement('div');
                elem.appendChild(div);

                div.style.position = 'absolute';
                div.style['z-index'] = 10001;
                div.style.left = 0;
                div.style.top = 0;
                div.style.width = `${width}px`;
                div.style.height = `${height}px`;
            } else {
                iframe2 = document.createElement('div');
                elem.appendChild(iframe2);
            }

        }

        list = elem && elem.querySelector('[class^="listItems"]');
        let list_h = list && elem.querySelector('[class^="listHeight"]');

        if (list && fresh && div.children.length !== 0) {

            list.prepend(div);

            div.style.height = '';

            max_height = div.getBoundingClientRect().height - list_h.getBoundingClientRect().top;
        }

        if (list) {

            let cur_height = div.offsetHeight;
            let new_height = Math.max(max_height + list_h.getBoundingClientRect().top, 0);

            //if (new_height < cur_height || new_height >= cur_height + 40) {
                div.style.height = new_height + 'px';
            //}
        }

        fresh = (elem === undefined);
    }, 300);




    let last = await GM.getValue('last', 0);
    if (!isFinite(last)) {
        last = 0;
    }


    async function add_gayness () {

        if (!await GM.getValue('active', true)) {
            return;
        }

        let time = Date.now();

        if (time - last < 3600 * 1000) {
            return;
        }

        last = time;
        GM.setValue('last', last);

        function createElementFromHTML(htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();
            return div.firstChild;
        }

        //let iframe = createElementFromHTML(`<iframe width="400" height="300" src="https://www.youtube.com/embed/DLzxrzFCyOs?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
        //document.body.appendChild(iframe);

        //iframe.style.position = 'fixed';
        //iframe.style['z-index'] = 10000;
        //iframe.style.left = 0;
        //iframe.style.top = 0;
        //iframe.style.width = '100%';
       // iframe.style.height = '100%';#


        //setTimeout(() => send(text), 1500);
        setTimeout(() => iframe.remove(), 15000);
    }


    let style = document.createElement('style');

    style.textContent =
        `
        .theme-dark {
            --script-color: white;
        }

        .theme-light {
            --script-color: purple;
        }

        ` +
        `.theme-dark [class*="emojiItemDisabled"] {\n`+
        `    filter: drop-shadow(0px 0px 1px white) !important;\n`+
        `}\n`+
        `.theme-light [class*="emojiItemDisabled"] {\n`+
        `    filter: drop-shadow(0px 0px 2px purple) !important;\n`+
        `}\n`+

        `.theme-dark [class*="stickerUnsendable"] {\n`+
        `    filter: drop-shadow(0px 0px 1px white) !important;\n`+
        `}\n`+
        `.theme-light [class*="stickerUnsendable"] {\n`+
        `    filter: drop-shadow(0px 0px 2px purple) !important;\n`+
        `}\n`+

        `[class*="premiumPromo-"], [class*="upsellWrapper-"] {\n`+
        `    display: none !important;\n`+
        `}\n`+

    `#plus_svg {
  transition: 0.3s ease-in-out;
  transition-property: transform, visibility, opacity;
  fill: white;
  cursor: pointer;
  opacity: 0.7;
  pointer-events: none;
  overflow: visible;
     }

  #plus_svg.checked {
  transform: rotate(45deg);
  }

  #plus_svg:hover {
      opacity: 1;
  }

  .theme-light #plus_svg {
  fill: purple;
  }

  #cheatemoji {
      display: flex;
      flex-wrap: wrap-reverse;
      margin-top: 5px;
      padding-bottom: 5px;
      overflow-y: clip;
  }

  #cheatemoji img {
      height: 32px;
      width: 32px;
      object-fit: contain;
      border-radius: 4px;
  }

  #cheatemoji img:hover {
      filter: drop-shadow(0px 0px 2px var(--script-color)) !important;
  }
  `

    ;

    document.head.append(style);

})();









;(function () {
	'use strict'
	const DEBUG = true
	const createLogger = (console, tag) =>
		Object.keys(console)
			.map(k => [k, (...args) => (DEBUG ? console[k](tag + ': ' + args[0], ...args.slice(1)) : void 0)])
			.reduce((acc, [k, fn]) => ((acc[k] = fn), acc), {})
	const logger = createLogger(console, 'YTDL')
	const sleep = ms => new Promise(res => setTimeout(res, ms))

	const LANG_FALLBACK = 'en'
	const LOCALE = {
		en: {
			togglelinks: 'Show/Hide Links',
			stream: 'Stream',
			adaptive: 'Adaptive (No Sound)',
			videoid: 'Video ID: ',
			inbrowser_adaptive_merger: 'Online Adaptive Video & Audio Merger (FFmpeg)',
			dlmp4: 'Download high-resolution mp4 in one click',
			get_video_failed: 'Failed to get video infomation for unknown reason, refresh the page may work.',
			live_stream_disabled_message: 'Local YouTube Downloader is not available for live stream'
		}
	}
	for (const [lang, data] of Object.entries(LOCALE)) {
		if (lang === LANG_FALLBACK) continue
		for (const key of Object.keys(LOCALE[LANG_FALLBACK])) {
			if (!(key in data)) {
				data[key] = LOCALE[LANG_FALLBACK][key]
			}
		}
	}
	const findLang = l => {
		l = l.replace('-Hant', '') // special case for zh-Hant-TW
		// language resolution logic: zh-tw --(if not exists)--> zh --(if not exists)--> LANG_FALLBACK(en)
		l = l.toLowerCase().replace('_', '-')
		if (l in LOCALE) return l
		else if (l.length > 2) return findLang(l.split('-')[0])
		else return LANG_FALLBACK
	}
	const getLangCode = () => {
		const html = document.querySelector('html')
		if (html) {
			return html.lang
		} else {
			return navigator.language
		}
	}
	const $ = (s, x = document) => x.querySelector(s)
	const $el = (tag, opts) => {
		const el = document.createElement(tag)
		Object.assign(el, opts)
		return el
	}
	const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const parseDecsig = data => {
		try {
			if (data.startsWith('var script')) {
				// they inject the script via script tag
				const obj = {}
				const document = {
					createElement: () => obj,
					head: { appendChild: () => {} }
				}
				eval(data)
				data = obj.innerHTML
			}
			const fnnameresult = /=([a-zA-Z0-9\$]+?)\(decodeURIComponent/.exec(data)
			const fnname = fnnameresult[1]
			const _argnamefnbodyresult = new RegExp(escapeRegExp(fnname) + '=function\\((.+?)\\){((.+)=\\2.+?)}').exec(
				data
			)
			const [_, argname, fnbody] = _argnamefnbodyresult
			const helpernameresult = /;(.+?)\..+?\(/.exec(fnbody)
			const helpername = helpernameresult[1]
			const helperresult = new RegExp('var ' + escapeRegExp(helpername) + '={[\\s\\S]+?};').exec(data)
			const helper = helperresult[0]
			logger.log(`parsedecsig result: %s=>{%s\n%s}`, argname, helper, fnbody)
			return new Function([argname], helper + '\n' + fnbody)
		} catch (e) {
			logger.error('parsedecsig error: %o', e)
			logger.info('script content: %s', data)
			logger.info(
				'If you encounter this error, please copy the full "script content" to https://pastebin.com/ for me.'
			)
		}
	}
	const parseQuery = s => [...new URLSearchParams(s).entries()].reduce((acc, [k, v]) => ((acc[k] = v), acc), {})
	const parseResponse = (id, playerResponse, decsig) => {
		logger.log(`video %s playerResponse: %o`, id, playerResponse)
		let stream = []
		if (playerResponse.streamingData.formats) {
			stream = playerResponse.streamingData.formats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
			)
			logger.log(`video %s stream: %o`, id, stream)
			for (const obj of stream) {
				if (obj.s) {
					obj.s = decsig(obj.s)
					obj.url += `&${obj.sp}=${encodeURIComponent(obj.s)}`
				}
			}
		}

		let adaptive = []
		if (playerResponse.streamingData.adaptiveFormats) {
			adaptive = playerResponse.streamingData.adaptiveFormats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
			)
			logger.log(`video %s adaptive: %o`, id, adaptive)
			for (const obj of adaptive) {
				if (obj.s) {
					obj.s = decsig(obj.s)
					obj.url += `&${obj.sp}=${encodeURIComponent(obj.s)}`
				}
			}
		}
		logger.log(`video %s result: %o`, id, { stream, adaptive })
		return { stream, adaptive, details: playerResponse.videoDetails, playerResponse }
	}

	const determineChunksNum = size => {
		const n = Math.ceil(size / (1024 * 1024 * 3)) // 3 MB
		return n
	}
	// video downloader
	const xhrDownloadUint8Array = async ({ url, contentLength }, progressCb) => {
		if (typeof contentLength === 'string') contentLength = parseInt(contentLength)
		progressCb({
			loaded: 0,
			total: contentLength,
			speed: 0
		})
		const chunkSize = Math.floor(contentLength / determineChunksNum(contentLength))
		const getBuffer = (start, end) =>
			new Promise((res, rej) => {
				const xhr = {}
				xhr.responseType = 'arraybuffer'
				xhr.method = 'GET'
				xhr.url = url
				xhr.headers = {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.50',
					Range: `bytes=${start}-${end ? end - 1 : ''}`,
					Accept: '*/*',
					'Accept-Encoding': 'identity',
					'Accept-Language': 'en-us,en;q=0.5',
					Origin: 'https://www.youtube.com',
					Referer: 'https://www.youtube.com/',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site'
				}
				xhr.onload = obj => {
					if (obj.status >= 200 && obj.status < 300) {
						res(obj.response)
					} else {
						rej(obj)
					}
				}
				GM_xmlhttpRequest(xhr)
			})
		const data = new Uint8Array(contentLength)
		let downloaded = 0
		const queue = new pQueue.default({ concurrency: 5 })
		const startTime = Date.now()
		const ps = []
		for (let start = 0; start < contentLength; start += chunkSize) {
			const exceeded = start + chunkSize > contentLength
			const curChunkSize = exceeded ? contentLength - start : chunkSize
			const end = exceeded ? null : start + chunkSize
			const p = queue.add(() =>
				getBuffer(start, end)
					.then(buf => {
						downloaded += curChunkSize
						data.set(new Uint8Array(buf), start)
						const ds = (Date.now() - startTime + 1) / 1000
						progressCb({
							loaded: downloaded,
							total: contentLength,
							speed: downloaded / ds
						})
					})
					.catch(err => {
						queue.clear()
						alert('Download error')
					})
			)
			ps.push(p)
		}
		await Promise.all(ps)
		return data
	}

	const ffWorker = FFmpeg.createWorker({
		logger: DEBUG ? m => logger.log(m.message) : () => {}
	})
	let ffWorkerLoaded = false
	const mergeVideo = async (video, audio) => {
		if (!ffWorkerLoaded) await ffWorker.load()
		await ffWorker.write('video.mp4', video)
		await ffWorker.write('audio.mp4', audio)
		await ffWorker.run('-i video.mp4 -i audio.mp4 -c copy output.mp4', {
			input: ['video.mp4', 'audio.mp4'],
			output: 'output.mp4'
		})
		const { data } = await ffWorker.read('output.mp4')
		await ffWorker.remove('output.mp4')
		return data
	}
	const triggerDownload = (url, filename) => {
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		a.remove()
	}
	const dlModalTemplate = `
<div style="width: 100%; height: 100%;">
	<div v-if="merging" style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; font-size: 24px;">Merging video, please wait...</div>
	<div v-else style="height: 100%; width: 100%; display: flex; flex-direction: column;">
 		<div style="flex: 1; margin: 10px;">
			<p style="font-size: 24px;">Video</p>
			<progress style="width: 100%;" :value="video.progress" min="0" max="100"></progress>
			<div style="display: flex; justify-content: space-between;">
				<span>{{video.speed}} kB/s</span>
				<span>{{video.loaded}}/{{video.total}} MB</span>
			</div>
		</div>
		<div style="flex: 1; margin: 10px;">
			<p style="font-size: 24px;">Audio</p>
			<progress style="width: 100%;" :value="audio.progress" min="0" max="100"></progress>
			<div style="display: flex; justify-content: space-between;">
				<span>{{audio.speed}} kB/s</span>
				<span>{{audio.loaded}}/{{audio.total}} MB</span>
			</div>
		</div>
	</div>
</div>
`
	function openDownloadModel(adaptive, title) {
		const win = open(
			'',
			'Video Download',
			`toolbar=no,height=${screen.height / 2},width=${screen.width / 2},left=${screenLeft},top=${screenTop}`
		)
		const div = win.document.createElement('div')
		win.document.body.appendChild(div)
		win.document.title = `Downloading "${title}"`
		const dlModalApp = new Vue({
			template: dlModalTemplate,
			data() {
				return {
					video: {
						progress: 0,
						total: 0,
						loaded: 0,
						speed: 0
					},
					audio: {
						progress: 0,
						total: 0,
						loaded: 0,
						speed: 0
					},
					merging: false
				}
			},
			methods: {
				async start(adaptive, title) {
					win.onbeforeunload = () => true
					// YouTube's default order is descending by video quality
					const videoObj = adaptive
						.filter(x => x.mimeType.includes('video/mp4') || x.mimeType.includes('video/webm'))
						.map(v => {
							const [_, quality, fps] = /(\d+)p(\d*)/.exec(v.qualityLabel)
							v.qualityNum = parseInt(quality)
							v.fps = fps ? parseInt(fps) : 30
							return v
						})
						.sort((a, b) => {
							if (a.qualityNum === b.qualityNum) return b.fps - a.fps // ex: 30-60=-30, then a will be put before b
							return b.qualityNum - a.qualityNum
						})[0]
					const audioObj = adaptive.find(x => x.mimeType.includes('audio/mp4'))
					const vPromise = xhrDownloadUint8Array(videoObj, e => {
						this.video.progress = (e.loaded / e.total) * 100
						this.video.loaded = (e.loaded / 1024 / 1024).toFixed(2)
						this.video.total = (e.total / 1024 / 1024).toFixed(2)
						this.video.speed = (e.speed / 1024).toFixed(2)
					})
					const aPromise = xhrDownloadUint8Array(audioObj, e => {
						this.audio.progress = (e.loaded / e.total) * 100
						this.audio.loaded = (e.loaded / 1024 / 1024).toFixed(2)
						this.audio.total = (e.total / 1024 / 1024).toFixed(2)
						this.audio.speed = (e.speed / 1024).toFixed(2)
					})
					const [varr, aarr] = await Promise.all([vPromise, aPromise])
					this.merging = true
					win.onunload = () => {
						// trigger download when user close it
						const bvurl = URL.createObjectURL(new Blob([varr]))
						const baurl = URL.createObjectURL(new Blob([aarr]))
						triggerDownload(bvurl, title + '-videoonly.mp4')
						triggerDownload(baurl, title + '-audioonly.mp4')
					}
					const result = await Promise.race([mergeVideo(varr, aarr), sleep(1000 * 25).then(() => null)])
					if (!result) {
						alert('An error has occurred when merging video')
						const bvurl = URL.createObjectURL(new Blob([varr]))
						const baurl = URL.createObjectURL(new Blob([aarr]))
						triggerDownload(bvurl, title + '-videoonly.mp4')
						triggerDownload(baurl, title + '-audioonly.mp4')
						return this.close()
					}
					this.merging = false
					const url = URL.createObjectURL(new Blob([result]))
					triggerDownload(url, title + '.mp4')
					win.onbeforeunload = null
					win.onunload = null
					win.close()
				}
			}
		}).$mount(div)
		dlModalApp.start(adaptive, title)
	}

	const template = `
<div class="box" :class="{'dark':dark}">
  <template v-if="!isLiveStream">
    <div v-if="adaptive.length" class="of-h t-center c-pointer lh-20">
      <a class="fs-14px" @click="dlmp4" v-text="strings.dlmp4"></a>
    </div>
    <div @click="hide=!hide" class="box-toggle div-a t-center fs-14px c-pointer lh-20" v-text="strings.togglelinks"></div>
    <div :class="{'hide':hide}">
      <div class="t-center fs-14px" v-text="strings.videoid+id"></div>
      <div class="d-flex">
        <div class="f-1 of-h">
          <div class="t-center fs-14px" v-text="strings.stream"></div>
          <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in stream" :href="vid.url" :title="vid.type" v-text="formatStreamText(vid)"></a>
        </div>
        <div class="f-1 of-h">
          <div class="t-center fs-14px" v-text="strings.adaptive"></div>
          <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in adaptive" :href="vid.url" :title="vid.type" v-text="formatAdaptiveText(vid)"></a>
        </div>
      </div>
      <div class="of-h t-center">
        <a class="fs-14px" href="https://maple3142.github.io/mergemp4/" target="_blank" v-text="strings.inbrowser_adaptive_merger"></a>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="t-center fs-14px lh-20" v-text="strings.live_stream_disabled_message"></div>
  </template>
</div>
`.slice(1)
	const app = new Vue({
		data() {
			return {
				hide: true,
				id: '',
				isLiveStream: false,
				stream: [],
				adaptive: [],
				details: null,
				dark: false,
				lang: findLang(getLangCode())
			}
		},
		computed: {
			strings() {
				return LOCALE[this.lang.toLowerCase()]
			}
		},
		methods: {
			dlmp4() {
				openDownloadModel(this.adaptive, this.details.title)
			},
			formatStreamText(vid) {
				return [vid.qualityLabel, vid.quality].filter(x => x).join(': ')
			},
			formatAdaptiveText(vid) {
				let str = [vid.qualityLabel, vid.mimeType].filter(x => x).join(': ')
				if (vid.mimeType.includes('audio')) {
					str += ` ${Math.round(vid.bitrate / 1000)}kbps`
				}
				return str
			}
		},
		template
	})
	logger.log(`default language: %s`, app.lang)

	// attach element
	const shadowHost = $el('div')
	const shadow = shadowHost.attachShadow ? shadowHost.attachShadow({ mode: 'closed' }) : shadowHost // no shadow dom
	logger.log('shadowHost: %o', shadowHost)
	const container = $el('div')
	shadow.appendChild(container)
	app.$mount(container)

	if (DEBUG && typeof unsafeWindow !== 'undefined') {
		// expose some functions for debugging
		unsafeWindow.$app = app
		unsafeWindow.parseQuery = parseQuery
		unsafeWindow.parseDecsig = parseDecsig
		unsafeWindow.parseResponse = parseResponse
	}
	const load = async playerResponse => {
		try {
			const basejs =
				(typeof ytplayer !== 'undefined' && 'config' in ytplayer && ytplayer.config.assets
					? 'https://' + location.host + ytplayer.config.assets.js
					: 'web_player_context_config' in ytplayer
					? 'https://' + location.host + ytplayer.web_player_context_config.jsUrl
					: null) || $('script[src$="base.js"]').src
			const decsig = await xf.get(basejs).text(parseDecsig)
			const id = parseQuery(location.search).v
			const data = parseResponse(id, playerResponse, decsig)
			logger.log('video loaded: %s', id)
			app.isLiveStream = data.playerResponse.playabilityStatus.liveStreamability != null
			app.id = id
			app.stream = data.stream
			app.adaptive = data.adaptive
			app.details = data.details

			const actLang = getLangCode()
			if (actLang != null) {
				const lang = findLang(actLang)
				logger.log('youtube ui lang: %s', actLang)
				logger.log('ytdl lang:', lang)
				app.lang = lang
			}
		} catch (err) {
			alert(app.strings.get_video_failed)
			logger.error('load', err)
		}
	}

	// hook fetch response
	const ff = fetch
	unsafeWindow.fetch = (...args) => {
		if (args[0] instanceof Request) {
			return ff(...args).then(resp => {
				if (resp.url.includes('player')) {
					resp.clone().json().then(load)
				}
				return resp
			})
		}
		return ff(...args)
	}

	// attach element
	setInterval(() => {
		const el =
			$('#info-contents') ||
			$('#watch-header') ||
			$('.page-container:not([hidden]) ytm-item-section-renderer>lazy-list')
		if (el && !el.contains(shadowHost)) {
			el.appendChild(shadowHost)
		}
	}, 100)

	// init
	unsafeWindow.addEventListener('load', () => {
		const firstResp = unsafeWindow?.ytplayer?.config?.args?.raw_player_response
		if (firstResp) {
			load(firstResp)
		}
	})

	// listen to dark mode toggle
	const $html = $('html')
	new MutationObserver(() => {
		app.dark = $html.getAttribute('dark') === 'true'
	}).observe($html, { attributes: true })
	app.dark = $html.getAttribute('dark') === 'true'

	const css = `
.hide{
	display: none;
}
.t-center{
	text-align: center;
}
.d-flex{
	display: flex;
}
.f-1{
	flex: 1;
}
.fs-14px{
	font-size: 14px;
}
.of-h{
	overflow: hidden;
}
.box{
  padding-top: .5em;
  padding-bottom: .5em;
	border-bottom: 1px solid var(--yt-border-color);
	font-family: Arial;
}
.box-toggle{
	margin: 3px;
	user-select: none;
	-moz-user-select: -moz-none;
}
.ytdl-link-btn{
	display: block;
	border: 1px solid !important;
	border-radius: 3px;
	text-decoration: none !important;
	outline: 0;
	text-align: center;
	padding: 2px;
	margin: 5px;
	color: black;
}
a, .div-a{
	text-decoration: none;
	color: var(--yt-button-color, inherit);
}
a:hover, .div-a:hover{
	color: var(--yt-spec-call-to-action, blue);
}
.box.dark{
	color: var(--yt-endpoint-color, var(--yt-spec-text-primary));
}
.box.dark .ytdl-link-btn{
	color: var(--yt-endpoint-color, var(--yt-spec-text-primary));
}
.box.dark .ytdl-link-btn:hover{
	color: rgba(200, 200, 255, 0.8);
}
.box.dark .box-toggle:hover{
	color: rgba(200, 200, 255, 0.8);
}
.c-pointer{
	cursor: pointer;
}
.lh-20{
	line-height: 20px;
}
`
	shadow.appendChild($el('style', { textContent: css }))
	const css2 = `
/* https://greasyfork.org/zh-TW/scripts/369400-local-youtube-downloader/discussions/95744 */
#meta-contents,
#info-contents{
	display: contents !important;
}

ytd-watch-metadata.style-scope {
	display: none !important;
}
`
	document.body.appendChild($el('style', { textContent: css2 }))
})()

