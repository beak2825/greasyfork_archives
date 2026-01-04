// ==UserScript==
// @name         nDeploy progress
// @version      0.4
// @description  Show deployment progress in nDeploy
// @author       Busung Kim, Sangjin Jeon
// @match        https://ndeploy.linecorp.com/ndeploy/v2/workspaces/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js
// @license      MIT

// @namespace https://greasyfork.org/users/1192532
// @downloadURL https://update.greasyfork.org/scripts/477090/nDeploy%20progress.user.js
// @updateURL https://update.greasyfork.org/scripts/477090/nDeploy%20progress.meta.js
// ==/UserScript==
/* global moment */
class Ringtone {
    constructor(src) {
        this.audio = new Audio();
        this.audio.src = src;
        this.audio.volume = 0.5;
    }

    play() {
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}

class WebNotification {
    constructor(deploymentName, clickURL) {
      this.deploymentName = deploymentName;
      this.clickURL = clickURL;
      this.ringtone = new Ringtone("https://line-objects-dev.com/lads/mail-notifier/yahoo_mail_sequence.mp3");
    }

    async send() {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
            const notification = new Notification("[nDeploy] Deploy is finished", {
                body: this.deploymentName,
                silent: false,
                requireInteraction: true,
                tag: this.deploymentName,
                renotify: false
            });

            notification.onshow = () => {
                this.ringtone.play();
            };

            notification.onclick = () => {
                GM_openInTab(this.clickURL, {active: true})
                notification.close();
            };

            notification.onclose = () => {
                this.ringtone.stop();
            };

            notification.onerror = (event) => {
                console.log(event);
            }
        }
    }
}

(function() {
    'use strict';

    function createProgressBar() {
        const progressBarElem = document.createElement('div');
        progressBarElem.className = 'progress-bar';
        progressBarElem.setAttribute('role', 'progressbar');
        progressBarElem.setAttribute('aria-valuenow', '0');
        progressBarElem.setAttribute('aria-valuemin', '0');
        progressBarElem.setAttribute('aria-valuemax', '100');
        progressBarElem.innerText = '0%';
        progressBarElem.style.width = '0%';
        progressBarElem.style.color = 'white';

        const progressElem = document.createElement('div');
        progressElem.className = 'progress';
        progressElem.style.width = '500px';
        progressElem.appendChild(progressBarElem);

        const titleLineElem = document.getElementsByClassName('title-line')[0];
        titleLineElem.insertBefore(progressElem, titleLineElem.children[1]);
    }

    function createExpectedEndTime() {
        const spanElem = document.createElement('span');
        spanElem.className = 'ng-binding';
        spanElem.setAttribute('id', 'eta');

        const tdElem = document.createElement('td');
        tdElem.appendChild(spanElem);
        tdElem.setAttribute('colspan', '7');

        const thElem = document.createElement('th');
        thElem.className = 'ng-binding';
        thElem.innerText = '예상 종료 시간';
        thElem.style.width = '120px';

        const trElem = document.createElement('tr');
        trElem.insertBefore(thElem, trElem.children[2]);
        trElem.insertBefore(tdElem, trElem.children[3]);

        const tbodyElem = document.getElementsByTagName('tbody')[0];
        tbodyElem.append(trElem);
    }

    function setProgress(progress = 0.0) {
        const elem = document.getElementsByClassName('progress-bar')[0];
        const text = `${(progress * 100).toFixed(1).toLocaleString()}%`;

        elem.innerText = text;
        elem.style.width = text;
    }

    function setExpectedEndTime(timestamp = 0) {
        const etaElem = document.getElementById('eta');
        if (timestamp <= 0) {
            etaElem.innerText = 'TBD';
            return;
        }

        etaElem.innerText = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    }

    async function deployStatus() {
        const api = `https://ndeploy.linecorp.com/ndeploy/api/v1/${window.location.pathname.substring(12)}`;
        const r = await fetch(api);
        const j = await r.json();

        const servers = j.step.flatMap(st => st.serverGroup).filter(sg => sg).flatMap(sg => sg.server);

        return {
            completeRatio: completeRatio(servers),
            expectedEndTs: expectedEndTs(j.start, servers),
            deploymentStatus: j.status,
            deploymentName: j.name,
        };

        function completeRatio(servers = []) {
            const completedServers = servers.filter(s => s.status === 'COMPLETE');
            return completedServers.length / servers.length
        }

        function expectedEndTs(startTs = 0, servers = []) {
            const completedServers = servers.filter(s => s.status === 'COMPLETE');
            if (completedServers.length === 0) {
                return -1;
            }

            const startTimestamps = completedServers.flatMap(s => s.substep).map(st => st.start);
            const endTimestamps = completedServers.flatMap(s => s.substep).map(st => st.end);

            const minStartTs = Math.min(...startTimestamps);
            const maxEndTs = Math.max(...endTimestamps);
            const avgElapsedTimeToCompletePerServer = (maxEndTs - minStartTs) / completedServers.length;

            return maxEndTs + avgElapsedTimeToCompletePerServer * servers.filter(s => s.status !== 'COMPLETE').length;
        }
    }

    class GlobalVariables {
        constructor() {
            this._lastDeploymentStatus = '';
            this._lastDeploymentName = '';
        }

        get lastDeploymentStatus() {
            return this._lastDeploymentStatus;
        }

        get lastDeploymentName() {
            return this._lastDeploymentName;
        }

        setLastDeploymentStatus(deploymentStatus = '') {
            this._lastDeploymentStatus = deploymentStatus;
        }

        setLastDeploymentName(deploymentName = '') {
            this._lastDeploymentName = deploymentName;
        }

        reset() {
            this._lastDeploymentStatus = '';
            this._lastDeploymentName = '';
        }
    }
    const globalVariables = new GlobalVariables();

    setInterval(async () => {
        const onScenarioLogPage = window.location.href.match('https://ndeploy.linecorp.com/ndeploy/v2/workspaces/[0-9]+/scenlogs/[0-9]+');
        if (!onScenarioLogPage) {
            globalVariables.reset();
            return;
        }
        if (globalVariables.lastDeploymentStatus === 'COMPLETE') {
            return;
        }

        const existProgressBar = document.getElementsByClassName('progress-bar').length > 0;
        if (!existProgressBar) {
            createProgressBar();
            createExpectedEndTime();
        }

        const ds = await deployStatus();
        setProgress(ds.completeRatio);
        setExpectedEndTime(ds.expectedEndTs);

        if (globalVariables.lastDeploymentStatus === 'RUNNING' && ds.deploymentStatus === 'COMPLETE') {
            const webNotification = new WebNotification(ds.deploymentName, window.location.href)
            await webNotification.send();
        }
        globalVariables.setLastDeploymentStatus(ds.deploymentStatus);
        globalVariables.setLastDeploymentName(ds.deploymentName);
        //        console.log('ds: ', ds);
    }, 2500);
    // TODO: Stop polling when status is COMPLETE
})();
