// ==UserScript==
// @name         DiscordPurge - Mass Delete Discord Messages (Updated)
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @description  Adds a button to the Discord browser UI to mass delete messages from Discord channels and direct messages
// @version      0.3.0
// @match        *://*.discord.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      discord.com
// @license      MIT
// @author       TR0LL
// @downloadURL https://update.greasyfork.org/scripts/532295/DiscordPurge%20-%20Mass%20Delete%20Discord%20Messages%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532295/DiscordPurge%20-%20Mass%20Delete%20Discord%20Messages%20%28Updated%29.meta.js
// ==/UserScript==

async function deleteMessages(authToken, authorId, guildId, channelId, minId, maxId, content, hasLink, hasFile, includeNsfw, includePinned, searchDelay, deleteDelay, delayIncrement, delayDecrement, delayDecrementPerMsgs, retryAfterMultiplier, extLogger, stopHndl, onProgress) {
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
    const escapeHTML = html => String(html).replace(/[&<"']/g, m => ({ '&': '&amp;', '<': '&lt;', '"': '&quot;', '\'': '&#039;' })[m]);
    const redact = str => `<span class="priv">${escapeHTML(str)}</span><span class="mask">REDACTED</span>`;
    const queryString = params => params.filter(p => p[1] !== undefined).map(p => p[0] + '=' + encodeURIComponent(p[1])).join('&');
    const ask = async msg => new Promise(resolve => setTimeout(() => resolve(window.confirm(msg)), 10));
    const toSnowflake = (date) => /:/.test(date) ? ((new Date(date).getTime() - 1420070400000) * Math.pow(2, 22)) : date;

    // Use the logger function passed from the UI
    const log = extLogger;
    const printDelayStats = () => log.verb(`Delete delay: ${deleteDelay}ms, Search delay: ${searchDelay}ms`, `Last Ping: ${lastPing}ms, Average Ping: ${avgPing | 0}ms`);

    const adjustDelay = (delta) => {
        deleteDelay += delta;
    };

    async function recurse() {
        let API_SEARCH_URL;
        // NOTE: Using API v6 as specified in the provided Deletecord script
        if (guildId === '@me') {
            API_SEARCH_URL = `https://discord.com/api/v6/channels/${channelId}/messages/`; // DMs
        } else {
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

        if (resp.status === 202) {
            const w = (await resp.json()).retry_after;
            throttledCount++;
            throttledTotalTime += w;
            log.warn(`This channel wasn't indexed, waiting ${w}ms for discord to index it...`);
            await wait(w);
            return await recurse();
        }

        if (!resp.ok) {
            if (resp.status === 429) {
                const w = (await resp.json()).retry_after;
                throttledCount++;
                throttledTotalTime += w;
                log.warn(`Being rate limited by the API for ${w * 1000}ms! Consider increasing search delay...`);
                printDelayStats();
                log.verb(`Cooling down for ${w * retryAfterMultiplier}ms before retrying...`);
                await wait(w * retryAfterMultiplier);
                return await recurse();
            } else {
                return log.error(`Error searching messages, API responded with status ${resp.status}!\n`, await resp.json());
            }
        }

        const data = await resp.json();
        const total = data.total_results;
        if (!grandTotal) grandTotal = total;
        const discoveredMessages = data.messages.map(convo => convo.find(message => message.hit === true)).filter(m => m);
        const messagesToDelete = discoveredMessages.filter(msg => msg.type === 0 || msg.type === 6 || (msg.pinned && includePinned));
        const skippedMessages = discoveredMessages.filter(msg => !messagesToDelete.find(m => m.id === msg.id));

        const end = () => {
            log.success(`Ended at ${new Date().toLocaleString()}! Total time: ${msToHMS(Date.now() - start.getTime())}`);
            printDelayStats();
            log.verb(`Rate Limited: ${throttledCount} times. Total time throttled: ${msToHMS(throttledTotalTime)}.`);
            log.debug(`Deleted ${delCount} messages, ${failCount} failed.\n`);
            onProgress(delCount, grandTotal, true); // Final progress update
        };

        const etr = msToHMS((searchDelay * Math.round(total / 25)) + ((deleteDelay + (avgPing || 0)) * (total - delCount)));
        log.info(`Total messages found: ${data.total_results}`, `(Page: ${data.messages.length}, To delete: ${messagesToDelete.length}, System: ${skippedMessages.length})`, `(Offset: ${offset})`);
        printDelayStats();
        log.verb(`Estimated time remaining: ${etr}`);

        if (messagesToDelete.length > 0) {
            if (++iterations < 1) {
                log.verb(`Waiting for your confirmation...`);
                if (!await ask(`Do you want to delete ~${total} messages?\nEstimated time: ${etr}\n\n---- Preview ----\n` +
                    messagesToDelete.slice(0, 5).map(m => `${m.author.username}#${m.author.discriminator}: ${m.attachments.length ? '[ATTACHMENTS]' : m.content}`).join('\n'))) {
                    log.error('Aborted by you!');
                    return end();
                }
                log.verb(`OK`);
            }

            for (const message of messagesToDelete) {
                if (stopHndl && stopHndl() === false) {
                    log.error('Stopped by you!');
                    return end();
                }

                log.debug(`${((delCount + 1) / grandTotal * 100).toFixed(2)}% (${delCount + 1}/${grandTotal})`,
                    `Deleting ID:${redact(message.id)} <b>${redact(message.author.username + '#' + message.author.discriminator)} <small>(${redact(new Date(message.timestamp).toLocaleString())})</small>:</b> <i>${redact(message.content).replace(/\n/g, ' ')}</i>`,
                    message.attachments.length ? redact(JSON.stringify(message.attachments)) : '');

                onProgress(delCount + 1, grandTotal);

                if (delCount > 0 && delCount % delayDecrementPerMsgs === 0) {
                    log.verb(`Reducing delete delay automatically by ${delayDecrement}ms...`);
                    adjustDelay(delayDecrement);
                }

                let delResp;
                try {
                    const s = Date.now();
                    const API_DELETE_URL = `https://discord.com/api/v6/channels/${message.channel_id}/messages/${message.id}`;
                    delResp = await fetch(API_DELETE_URL, { headers, method: 'DELETE' });
                    lastPing = (Date.now() - s);
                    avgPing = (avgPing * 0.9) + (lastPing * 0.1);

                    if (delResp.ok) {
                        delCount++;
                    } else {
                        failCount++;
                        // Handle non-ok response below
                    }
                    onProgress(delCount, grandTotal);
                } catch (err) {
                    log.error('Delete request threw an error:', err);
                    log.verb('Related object:', redact(JSON.stringify(message)));
                    failCount++;
                    continue; // Continue to next message
                }

                if (!delResp.ok) {
                    if (delResp.status === 429) {
                        const w = (await delResp.json()).retry_after;
                        throttledCount++;
                        throttledTotalTime += w;
                        adjustDelay(delayIncrement);
                        log.warn(`Being rate limited on delete for ${w}ms! Adjusted delete delay to ${deleteDelay}ms.`);
                        printDelayStats();
                        log.verb(`Cooling down for ${w * retryAfterMultiplier}ms before retrying...`);
                        await wait(w * retryAfterMultiplier);
                        // Retry the same message
                        i--;
                        continue;
                    } else {
                        log.error(`Error deleting message, API responded with status ${delResp.status}!`, await delResp.json());
                        log.verb('Related object:', redact(JSON.stringify(message)));
                    }
                }

                await wait(deleteDelay);
            }

            if (skippedMessages.length > 0) {
                offset += skippedMessages.length;
                log.verb(`Skipped ${skippedMessages.length} system messages. Increasing offset to ${offset}.`);
            }

            log.verb(`Searching next messages in ${searchDelay}ms...`);
            await wait(searchDelay);

            if (stopHndl && stopHndl() === false) {
                 log.error('Stopped by you!');
                 return end();
            }

            return await recurse();
        } else {
            if (total - offset > 0) {
                log.warn('API returned an empty page, but there are still messages to process. Continuing...');
                offset += 25; // Increment offset to continue pagination
                await wait(searchDelay);
                return await recurse();
            }
            return end();
        }
    }

    log.success(`\nStarted at ${start.toLocaleString()}`);
    log.debug(`authorId="${redact(authorId)}" guildId="${redact(guildId)}" channelId="${redact(channelId)}" minId="${redact(minId)}" maxId="${redact(maxId)}"`);
    onProgress(0, 1);
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
        #deletecord-btn{position:relative;height:24px;width:auto;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;margin:0 8px;cursor:pointer;color:var(--interactive-normal);}
        #deletecord{position:fixed;top:100px;right:10px;height:400px;width:400px;z-index:99;color:#f2f3f5;background-color:#40444b; box-shadow:var(--elevation-stroke),var(--elevation-high);border-radius:4px;display:flex;flex-direction:column}
        #deletecord a{color:#00aff4}
        #deletecord.redact .priv{display:none!important}
        #deletecord:not(.redact) .mask{display:none!important}
        #deletecord.redact [priv]{-webkit-text-security:disc!important}
        #deletecord button,#deletecord .btn{color:#fff;background:#5865f2;border:0;border-radius:4px;font-size:12px;padding:2px 5px}
        #deletecord button:disabled{background-color: #4f5bda; cursor: not-allowed; opacity: 0.7;}
        #deletecord button#stop:disabled{display:none;}
        #deletecord button#start:disabled{display:block;}
        #deletecord input[type="text"],#deletecord input[type="search"],#deletecord input[type="password"],#deletecord input[type="datetime-local"],#deletecord input[type="number"]{background-color:#202225;color:#dcddde;border-radius:4px;border:1px solid #111214;padding:0 .5em;height:24px;width:110px;margin:1px;font-size:12px}
        #deletecord input#file{display:none}
        #deletecord hr{border-color:rgba(255,255,255,0.06);margin:6px 0}
        #deletecord .header{padding:8px;background-color:#202225;color:#b9bbbe;font-size:12px;font-weight:bold;}
        #deletecord .form{padding:8px;background:#36393f;}
        #deletecord .logarea{overflow:auto;font-size:.75rem;font-family:Consolas,monospace;flex-grow:1;padding:8px;background-color: #2f3136;}
        #deletecord .logarea div{margin-bottom:3px;}
        #deletecord .form-tabs{display:flex;margin-bottom:8px}
        #deletecord .tab{padding:4px 8px;cursor:pointer;border-radius:3px 3px 0 0;margin-right:2px;font-size:11px;background:#202225}
        #deletecord .tab.active{background:#5865f2;color:white}
        #deletecord .tab-content{display:none}
        #deletecord .tab-content.active{display:block}
        #deletecord label{font-size:12px;margin-right:5px;white-space:nowrap; color: #b9bbbe; font-weight:500;}
        #deletecord .form-row{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;align-items:center}
        #deletecord span{font-size:12px; color: #b9bbbe; font-weight:500;}
    `);

    popover = createElm(`
    <div id="deletecord" style="display:none;">
        <div class="header">DiscordPurge</div>
        <div class="form">
            <div class="form-tabs">
                <div class="tab active" data-tab="main">Main</div>
                <div class="tab" data-tab="filters">Filters</div>
                <div class="tab" data-tab="advanced">Advanced</div>
            </div>
            
            <div class="tab-content active" id="tab-main">
                <div class="form-row">
                    <span>Auth Token</span>
                    <input type="password" id="authToken" placeholder="Your authorization token" autofocus style="width: 200px;">
                    <button id="getAuthInfo">Get All</button>
                </div>
                <div class="form-row">
                    <span>Author ID</span>
                    <input id="authorId" type="text" placeholder="Your User ID" priv>
                </div>
                <div class="form-row">
                    <span>Guild ID</span>
                    <input id="guildId" type="text" placeholder="Server ID" priv>
                </div>
                 <div class="form-row">
                    <span>Channel ID(s)</span>
                    <input id="channelId" type="text" placeholder="Channel ID, comma-separated" priv style="width: 180px;">
                </div>
                <div class="form-row">
                    <label><input id="hasLink" type="checkbox">has: link</label>
                    <label><input id="hasFile" type="checkbox">has: file</label>
                    <label><input id="includePinned" type="checkbox">Include Pinned</label>
                </div>
            </div>
            
            <div class="tab-content" id="tab-filters">
                <div class="form-row">
                    <span>After Date</span>
                    <input id="minDate" type="datetime-local" title="After this date" style="width:160px">
                 </div>
                 <div class="form-row">
                    <span>Before Date</span>
                    <input id="maxDate" type="datetime-local" title="Before this date" style="width:160px">
                </div>
                <div class="form-row">
                    <span>Content</span>
                    <input id="content" type="text" placeholder="Messages containing..." priv style="width:200px">
                </div>
                <div class="form-row">
                    <label><input id="includeNsfw" type="checkbox">Search NSFW</label>
                    <label><input id="autoScroll" type="checkbox" checked>Auto-Scroll Log</label>
                    <label><input id="redact" type="checkbox">Redact Info</label>
                </div>
            </div>
            
            <div class="tab-content" id="tab-advanced">
                 <div class="form-row">
                    <span>After Message ID</span>
                    <input id="minId" type="text" placeholder="Snowflake ID" priv>
                </div>
                <div class="form-row">
                    <span>Before Message ID</span>
                    <input id="maxId" type="text" placeholder="Snowflake ID" priv>
                </div>
                <div class="form-row">
                    <span>Delays (ms)</span>
                    <label for="searchDelay">Search:</label>
                    <input id="searchDelay" type="number" value="1500" step="100" style="width:60px">
                    <label for="deleteDelay">Delete:</label>
                    <input id="deleteDelay" type="number" value="1400" step="100" style="width:60px">
                </div>
                <div class="form-row">
                    <span>Import channels:</span>
                    <label for="file" class="btn" style="padding:2px 8px">Import JSON</label>
                    <input id="file" type="file" accept="application/json,.json">
                </div>
            </div>
            
            <hr>
            <div class="form-row">
                <button id="start" style="background:#2d7d46;width:60px;">Start</button>
                <button id="stop" style="background:#d83c3e;width:60px;" disabled>Stop</button>
                <button id="clear" style="width:60px; background: #72767d;">Clear</button>
                <progress id="progress" style="display:none;width:80px"></progress>
                <span class="percent"></span>
            </div>
        </div>
        <pre class="logarea">
            <center style="color: #72767d;">
                <a href="https://greasyfork.org/en/users/1431907-theeeunknown" target="_blank">TheeUnknown Scripts</a>
            </center>
        </pre>
    </div>
    `);

    document.body.appendChild(popover);

    btn = createElm(`<div id="deletecord-btn" tabindex="0" role="button" aria-label="Delete Messages" title="Delete Messages">
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
        } else {
            popover.style.display = 'flex';
            btn.style.color = '#d83c3e';
        }
    };

    function mountBtn() {
        const toolbar = document.querySelector('[class^=toolbar]');
        if (toolbar && !toolbar.querySelector('#deletecord-btn')) {
            toolbar.appendChild(btn);
        }
    }

    const observer = new MutationObserver(() => {
        if (!document.body.contains(btn) || !btn.parentElement) mountBtn();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    mountBtn();

    const $ = s => popover.querySelector(s);
    const logArea = $('pre.logarea');
    const startBtn = $('button#start');
    const stopBtn = $('button#stop');
    const autoScroll = $('#autoScroll');
    const MAX_LOG_ENTRIES = 2000;

    // This logger is passed to the deleteMessages function
    const uiLogger = {
        entries: [],
        add(type, args) {
            if (this.entries.length >= MAX_LOG_ENTRIES) {
                this.entries.shift();
            }
            this.entries.push({ type, args });
            this.display();
        },
        display() {
            logArea.innerHTML = this.entries.map(entry => {
                const style = { debug: 'color:#888;', info: 'color:#00aff4;', verb: 'color:#b9bbbe;', warn: 'color:#faa61a;', error: 'color:#f04747;', success: 'color:#43b581;' }[entry.type];
                const content = Array.from(entry.args).map(o => typeof o === 'object' ? JSON.stringify(o) : o).join('\t');
                return `<div style="${style}">${content}</div>`;
            }).join('') + (this.entries.length === 0 ? `<center style="color: #72767d;"><a href="https://greasyfork.org/en/users/1431907-theeeunknown" target="_blank">TheeUnknown Scripts</a></center>` : '');
            if (autoScroll.checked && logArea.querySelector('div:last-child')) {
                logArea.querySelector('div:last-child').scrollIntoView(false);
            }
        },
        debug() { this.add('debug', arguments); },
        info() { this.add('info', arguments); },
        verb() { this.add('verb', arguments); },
        warn() { this.add('warn', arguments); },
        error() { this.add('error', arguments); },
        success() { this.add('success', arguments); },
        clear() { this.entries = []; this.display(); }
    };

    const updateGuildAndChannel = () => {
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        if (m) {
            if ($('input#guildId')) $('input#guildId').value = m[1];
            if ($('input#channelId')) $('input#channelId').value = m[2];
        }
    };
    let lastUrl = location.href;
    setInterval(() => {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            updateGuildAndChannel();
        }
    }, 1000);

    const tabs = popover.querySelectorAll('.tab');
    const tabContents = popover.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            tabContents.forEach(content => content.classList.remove('active'));
            if ($(`#tab-${tabName}`)) $(`#tab-${tabName}`).classList.add('active');
        });
    });

    $("input#file").addEventListener("change", () => {
        const files = $("input#file").files;
        if (files.length > 0) {
            const file = files[0];
            file.text().then(text => {
                try {
                    const json = JSON.parse(text);
                    const channels = Object.keys(json);
                    $('input#channelId').value = channels.join(",");
                    uiLogger.success(`Imported ${channels.length} channels from JSON.`);
                } catch (err) {
                    uiLogger.error('Failed to parse JSON for channel import:', err.message);
                }
            }).catch(err => uiLogger.error('Failed to read file for channel import:', err.message));
            $("input#file").value = '';
        }
    }, false);

    startBtn.onclick = async () => {
        const authToken = $('input#authToken').value.trim();
        if (!authToken) return uiLogger.error("Authorization Token is required!");
        const channelIds = $('input#channelId').value.trim().split(/\s*,\s*/).filter(id => id);
        if (!$('input#guildId').value.trim()) return uiLogger.error('Guild ID is required!');
        if (channelIds.length === 0) return uiLogger.error('At least one Channel ID is required!');

        const options = {
            authToken: authToken,
            authorId: $('input#authorId').value.trim(),
            guildId: $('input#guildId').value.trim(),
            minId: $('input#minId').value.trim() || $('input#minDate').value.trim(),
            maxId: $('input#maxId').value.trim() || $('input#maxDate').value.trim(),
            content: $('input#content').value.trim(),
            hasLink: $('input#hasLink').checked,
            hasFile: $('input#hasFile').checked,
            includeNsfw: $('input#includeNsfw').checked,
            includePinned: $('input#includePinned').checked,
            searchDelay: parseInt($('input#searchDelay').value.trim()) || 1500,
            deleteDelay: parseInt($('input#deleteDelay').value.trim()) || 1400,
            delayIncrement: 150,
            delayDecrement: -50,
            delayDecrementPerMsgs: 1000,
            retryAfterMultiplier: 3,
        };

        const progress = $('#progress'), progress2 = btn.querySelector('progress'), percent = $('.percent');
        const onProg = (value, max, finished = false) => {
            if (finished) {
                percent.innerHTML = "Done";
                progress.style.display = 'none';
                progress2.style.display = 'none';
                return;
            }
            if (value && max && value > max) max = value;
            progress.setAttribute('max', max);
            progress.value = value;
            progress.style.display = max ? '' : 'none';
            progress2.setAttribute('max', max);
            progress2.value = value;
            progress2.style.display = max ? '' : 'none';
            percent.innerHTML = value && max ? Math.round(value / max * 100) + '%' : '';
        };

        stop = false;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        uiLogger.clear();

        for (let i = 0; i < channelIds.length; i++) {
            if (stop) {
                uiLogger.error('Process stopped by user.');
                break;
            }
            uiLogger.info(`Starting process for channel ${channelIds[i]}...`);
            await deleteMessages(
                options.authToken, options.authorId, options.guildId, channelIds[i],
                options.minId, options.maxId, options.content, options.hasLink, options.hasFile,
                options.includeNsfw, options.includePinned, options.searchDelay, options.deleteDelay,
                options.delayIncrement, options.delayDecrement, options.delayDecrementPerMsgs,
                options.retryAfterMultiplier, uiLogger, () => !stop, onProg
            );
        }

        startBtn.disabled = false;
        stopBtn.disabled = true;
        if (!stop) {
             percent.innerHTML = "Done";
        }
    };

    stopBtn.onclick = () => {
        stop = true;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        $('.percent').innerHTML = "Stopping...";
    };

    $('button#clear').onclick = () => uiLogger.clear();

    $('button#getAuthInfo').onclick = () => {
        try {
            const iframe = document.body.appendChild(document.createElement('iframe'));
            iframe.style.display = 'none';
            const ls = iframe.contentWindow.localStorage;
            const token = ls.getItem('token');
            const userId = ls.getItem('user_id_cache');

            if (token) {
                $('input#authToken').value = token.replace(/^"|"$/g, '');
                uiLogger.success('Token retrieved successfully.');
            } else {
                uiLogger.warn('Discord token not found in local storage.');
            }
            if (userId) {
                $('input#authorId').value = userId.replace(/^"|"$/g, '');
                uiLogger.success('Author ID retrieved successfully.');
            } else {
                uiLogger.warn('Discord user ID not found in local storage.');
            }
            updateGuildAndChannel();
            uiLogger.success('Guild and Channel IDs updated.');
            document.body.removeChild(iframe);
        } catch (err) {
            uiLogger.error('Error getting Discord token/info:', err.message);
        }
    };

    $('#redact').onchange = e => {
        popover.classList.toggle('redact', e.target.checked);
        if (e.target.checked) {
            window.alert('This will attempt to hide personal information, but make sure to double check before sharing screenshots.');
            uiLogger.info("Log redaction enabled.");
        } else {
            uiLogger.info("Log redaation disabled.");
        }
    };

    updateGuildAndChannel();
    uiLogger.info("DiscordPurge UI Initialized.");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}