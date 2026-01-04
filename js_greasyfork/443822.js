// ==UserScript==
// @name        Twitching Lurkist
// @description Automatically lurk on Twitch channels you follow
// @author      Xspeed
// @namespace   xspeed.net
// @license     MIT
// @version     14
// @icon        https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @match       *://www.twitch.tv/*
// @grant       GM.getValue
// @grant       GM.setValue
// @run-at      document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/443822/Twitching%20Lurkist.user.js
// @updateURL https://update.greasyfork.org/scripts/443822/Twitching%20Lurkist.meta.js
// ==/UserScript==

const activationPath = '/directory/following/autolurk';
const spacing = '5px';

let intervalJob = -1;
let refreshJob = -1;
let fetchOpts = { init: false };
let streamFrames = [];

const prefs = { autoCinema: true, autoClose: false, autoRefresh: true,
    detectPause: false, frameScale: 0.75, lowLatDisable: true, whitelist: [] };

function log(txt) {
    console.log('[' + GM.info.script.name + '] ' + txt);
}

function clearChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function startCinemaJob(streamFrame) {
    if (!prefs.autoCinema || streamFrame.theatre) return;

    const jobId = setInterval(() => {
        if (!prefs.autoCinema || streamFrame.theatre) {
            clearInterval(jobId);
        }

        const btn = streamFrame.frame.contentDocument?.querySelector('button[aria-label*="Theatre Mode"]');
        if (btn) {
            streamFrame.theatre = true;
            btn.click();
            clearInterval(jobId);
        }
    }, 1000);
}

function onFrameLoaded(e) {
    const obj = streamFrames.find(x => x.frame == e.target);

    ['pushState', 'replaceState'].forEach((changeState) => {
        e.target.contentWindow.history[changeState] = new Proxy(e.target.contentWindow.history[changeState], {
            apply(target, thisArg, argList) {
                const [state, title, url] = argList;

                log(changeState + ' to ' + url);
                startCinemaJob(obj);

                return target.apply(thisArg, argList);
            },
        });
    });
}

function setFrameSize(item) {
    item.frame.style.transform = 'scale(' + prefs.frameScale + ')';

    item.container.style.width = Math.round(1000 * prefs.frameScale) + 'px';
    item.container.style.height = Math.round(480 * prefs.frameScale) + 'px';
}

function setupFrame(url) {
    log('Setting up new frame for ' + url);

    const elem = document.createElement('iframe');
    elem.src = url;
    elem.style.width = '1000px';
    elem.style.height = '480px';
    elem.style.gridColumnStart = '1';
    elem.style.gridRowStart = '1';
    elem.style.transformOrigin = '0 0';
    elem.addEventListener('load', onFrameLoaded);

    const container = document.createElement('div');
    container.style.position = 'static';
    container.style.display = 'grid';
    container.style.placeItems = 'start';

    const result = { container: container, frame: elem, timeout: 0, wait: 0, theatre: false };
    setFrameSize(result);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close stream';
    closeBtn.style.gridColumnStart = '1';
    closeBtn.style.gridRowStart = '1';
    closeBtn.style.zIndex = '666';
    closeBtn.addEventListener('click', function() {
        container.parentElement.removeChild(container);
        streamFrames = streamFrames.filter(x => x.frame != elem);
    });

    container.append(elem);
    container.append(closeBtn);

    // TODO: Restore user set quality after the video player loads
    localStorage.setItem('video-muted', '{"default":false,"carousel":false}');
    localStorage.setItem('video-quality', '{"default":"160p30"}');
    localStorage.setItem('mature', 'true');
    if (prefs.lowLatDisable) localStorage.setItem('lowLatencyModeEnabled', 'false');

    document.body.append(container);

    streamFrames.push(result);
    return result;
}

async function detect() {
    if (prefs.detectPause) return;

    let items = await fetch(fetchOpts.url, fetchOpts.opts).then(res => res.json())
        .then(obj => obj[0].data.currentUser.followedLiveUsers.edges.map(x => '/' + x.node.login.toLowerCase()));

    let currentUrls = [];

    streamFrames = streamFrames.filter(x => {
        if (!x.frame.contentDocument) {
            log('Frame ' + x.frame.src + ' invalid');
            x.container.parentElement.removeChild(x.container);
            return false;
        }

        let url = x.frame.contentDocument.location.pathname.toLowerCase();
        if (!currentUrls.includes(url)) {
            x.wait = 0;
            currentUrls.push(url);
        }
        else if (++x.wait > 2) {
            log('Frame ' + x.frame.contentDocument.location.pathname + ' duplicated');
            x.container.parentElement.removeChild(x.container);
            return false;
        }

        let chatLink = x.frame.contentDocument.querySelector('a[tabname="chat"]');
        if (chatLink) {
            x.theatre = false;
            chatLink.click();
            return true;
        }

        let hostLink = x.frame.contentDocument.querySelector('a[data-a-target="hosting-indicator"]');
        if (!hostLink) {
            hostLink = Array.from(x.frame.contentDocument.querySelectorAll('a.tw-link'))
                .find(x => x.innerText.match(/Watch\s+\w+\s+with\s+\d+\s+viewers/));
        }
        if (hostLink) {
            log('Frame ' + url + ' redirecting to ' + hostLink.href);
            x.theatre = false;
            hostLink.click();
            return true;
        }

        let vidElem = x.frame.contentDocument.querySelector('video');
        if (vidElem && !vidElem.paused && !vidElem.ended && vidElem.readyState > 2) {
            x.timeout = 0;
        }
        else if (++x.timeout > 6) {
            log('Frame ' + url + ' timed out');
            x.container.parentElement.removeChild(x.container);
            return false;
        }

        return true;
    });

    if (prefs.autoClose) {
        streamFrames = streamFrames.filter(x => {
            if (!items.includes(x.frame.contentDocument.location.pathname)) {
                log('Frame ' + x.frame.contentDocument.location.pathname + ' auto-closing');
                x.container.parentElement.removeChild(x.container);
                return false;
            }

            return true;
        });
    }

    if (prefs.whitelist.length) items = items.filter(x => prefs.whitelist.includes(x.substr(1)));
    items.filter(x => !currentUrls.includes(x)).forEach(x => setupFrame(x));
}

function setRefresh(value) {
    prefs.autoRefresh = value;

    if (value) {
        refreshJob = setTimeout(() => location.reload(), (4 * 3600000) + (Math.floor(Math.random() * 10000)));
    }
    else if (refreshJob != -1) {
        clearTimeout(refreshJob);
        refreshJob = -1;
    }
}

function setupTab() {
    if (location.pathname.startsWith(activationPath)) {
        if (fetchOpts.url && !fetchOpts.init) {
            log('Preparing layout and update loop');
            fetchOpts.init = true;
            setupControls();
            setInterval(detect, 10000);
            clearInterval(intervalJob);
        }
        return;
    }

    if (!location.pathname.startsWith('/directory/following')) return;
    if (document.querySelector('a[href="' + activationPath + '"]')) return;

    const tabs = document.body.querySelectorAll('li[role=presentation]');
    if (!tabs.length) return;

    log('Setting up Auto-lurk navigation tab');

    const lastTab = tabs[tabs.length - 1];
    const newTab = document.createElement('li');
    newTab.className = lastTab.className;
    newTab.innerHTML = lastTab.innerHTML;

    const link = newTab.querySelector('a');
    link.href = activationPath;
    link.querySelector("[class^='ScTitle']").innerText = 'Auto-lurk';

    lastTab.parentElement.appendChild(newTab);
}

function createWhitelist() {
    const list = document.createElement('ul');
    list.style.marginTop = '3px';
    list.style.marginBottom = '3px';

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.style.width = '130px';

    const okBtn = document.createElement('button');
    okBtn.type = 'submit';
    okBtn.innerText = '+';

    const listLab = document.createElement('label');
    listLab.append('Whitelist: ');
    listLab.append(inp);
    listLab.append(okBtn);

    const updateList = function() {
        clearChildren(list);

        prefs.whitelist.forEach(x => {
            const btn = document.createElement('a');
            btn.href = '#';
            btn.innerText  = 'X';

            btn.addEventListener('click', function(e) {
                e.preventDefault();

                prefs.whitelist.splice(prefs.whitelist.indexOf(x), 1);
                updateList();

                return false;
            });

            const elem = document.createElement('li');
            elem.innerText = x + ' ';
            elem.append(btn);

            list.append(elem);
        });

        GM.setValue('whitelist', prefs.whitelist.join(','));
    };

    const listBox = document.createElement('form');
    listBox.style.marginBottom = '3px';
    listBox.append(list);
    listBox.append(listLab);
    listBox.addEventListener('submit', function(e) {
      e.preventDefault();

      const value = inp.value.trim().toLowerCase();
      if (!value || prefs.whitelist.includes(value)) return;

      prefs.whitelist.push(value);
      prefs.whitelist.sort();

      updateList();
      inp.value = '';
    });

    updateList();

    return listBox;
}

function createToggle(name, text, init, setter) {
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = init;
    toggle.style.marginLeft = 0;
    toggle.style.marginRight = spacing;
    toggle.addEventListener('change', function() {
        setter(this.checked);
        GM.setValue(name, this.checked);
    });

    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.append(toggle);
    label.append(text);

    return label;
}

function createScaleRange() {
    const span = document.createElement('span');
    span.innerText = (prefs.frameScale * 100) + '%';

    const range = document.createElement('input');
    range.type = 'range';
    range.min = '0.1';
    range.step = '0.05';
    range.max = '1';
    range.value = prefs.frameScale;
    range.style.width = '90px';
    range.style.marginLeft = spacing;
    range.style.marginRight = spacing;
    range.addEventListener('input', function() {
        span.innerText = Math.round(this.value * 100) + '%';
    });
    range.addEventListener('change', function() {
        prefs.frameScale = this.value;
        GM.setValue('frameScale', this.value);
        span.innerText = Math.round(this.value * 100) + '%';

        streamFrames.forEach(x => setFrameSize(x));
    });

    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.append('Frame scale');
    label.append(range);
    label.append(span);

    return label;
}

async function setupControls() {
    prefs.autoClose = await GM.getValue('autoClose', false);
    prefs.autoCinema = await GM.getValue('autoCinema', true);
    prefs.lowLatDisable = await GM.getValue('lowLatDisable', true);
    prefs.whitelist = (await GM.getValue('whitelist', '')).split(',').map(x => x.trim()).filter(x => x);
    prefs.frameScale = await GM.getValue('frameScale', 0.75);

    setRefresh(await GM.getValue('autoRefresh', true));

    const listBox = createWhitelist();

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close all streams';
    closeBtn.style.marginTop = spacing;
    closeBtn.addEventListener('click', function() {
        streamFrames.forEach(x => x.container.parentElement.removeChild(x.container));
        streamFrames.length = 0;
    });

    const autoTgl = createToggle('autoClose', 'Auto-close raids and hosts', prefs.autoClose, x => prefs.autoClose = x);
    const cinemaTgl = createToggle('autoCinema', 'Auto enable theatre mode', prefs.autoCinema, x => prefs.autoCinema = x);
    const refreshTgl = createToggle('autoRefresh', 'Refresh page every 4 hours', prefs.autoRefresh, x => setRefresh(x));
    const bufferTgl = createToggle('lowLatDisable', 'Disable low latency mode', prefs.lowLatDisable, x => prefs.lowLatDisable = x);
    const pauseTgl = createToggle('detectPause', 'Pause streams detection', prefs.detectPause, x => prefs.detectPause = x);
    const scaleRng = createScaleRange();

    const panel = document.createElement('div');
    panel.style.padding = spacing;
    panel.style.backgroundColor = 'gray';
    panel.style.position = 'fixed';
    panel.style.zIndex = '1';
    panel.style.right = '0px';
    panel.style.bottom = '0px';
    panel.style.transition = 'right 0.2s ease-in-out';
    panel.append(listBox);
    panel.append(autoTgl);
    panel.append(cinemaTgl);
    panel.append(refreshTgl);
    panel.append(bufferTgl);
    panel.append(pauseTgl);
    panel.append(scaleRng);
    panel.append(closeBtn);

    const panelBtn = document.createElement('button');
    panelBtn.innerText = 'Settings panel';
    panelBtn.style.margin = spacing;
    panelBtn.style.position = 'fixed';
    panelBtn.style.zIndex = '2';
    panelBtn.style.right = '0px';
    panelBtn.style.bottom = '0px';
    panelBtn.addEventListener('click', function() {
        panel.style.right = panel.style.right == '0px' ? ('-' + (panel.offsetWidth + 1) + 'px') : '0px';
    });
    setTimeout(() => panelBtn.click(), 500);

    document.documentElement.style.backgroundColor = 'black';
    document.body.style.backgroundColor = 'black';
    clearChildren(document.body);
    clearChildren(document.head);
    document.body.append(panel);
    document.body.append(panelBtn);
}

log('Script loaded on path ' + location.pathname);

if (location.pathname.startsWith(activationPath)) {
    unsafeWindow.fetch = new Proxy(unsafeWindow.fetch, {
        apply(target, thisArg, argList) {
            const [url, opts] = argList;

            if (url.includes('gql.twitch.tv') && opts.body.includes('FollowingLive_CurrentUser') && opts._meta != GM.info.script.name) {
                log('Intercepted live list request');

                const opBody = JSON.parse(opts.body).find(x => x.operationName == 'FollowingLive_CurrentUser');

                fetchOpts.url = url;
                fetchOpts.opts = { _meta: GM.info.script.name, headers: opts.headers, method: opts.method, body: JSON.stringify([{
                    operationName: opBody.operationName,
                    variables: { limit: 50, includeIsDJ: false },
                    extensions: opBody.extensions }]) };
            }

            return target.apply(thisArg, argList);
        }
    });
}

intervalJob = setInterval(setupTab, 1250);