// ==UserScript==
// @name         YouTube Resume
// @version      0.1
// @description  Save video resume list
// @author       AltPluzF4
// @match        https://*.youtube.com/*
// @namespace https://greasyfork.org/users/563902
// @downloadURL https://update.greasyfork.org/scripts/403486/YouTube%20Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/403486/YouTube%20Resume.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DATA_KEY = 'ytr_resume_data';
    const PLAYER_SELECTOR = '#movie_player';
    const GRID_SELECTOR = '.ytd-browse.grid';
    const ADD_BUTTON_SELECTOR = 'div#buttons ytd-topbar-menu-button-renderer div#button';
    const BUTTON_ID = 'ytr-forget-btn';
    const LINKS_ID = 'ytr-resume-links';
    const KILL_TIME = 30; //How many seconds until the end to ignore resume?

    if (self != top) {
        return; //Only run in main frame
    }

    function dolog(msg) {
        console.log('[YTResume]', msg);
    }

    var player_found = false, state_running = false;
    function checkPage() {
        if (location.pathname == '/watch') {
            loadWatchPage();
        } else if (location.pathname == '/') {
            var forget = document.getElementById(BUTTON_ID);
            if (forget) {
                forget.parentNode.removeChild(forget);
            }
            loadHomePage();
        }
    }
    checkPage();
    document.body.addEventListener('yt-navigate-finish', function(event){
        checkPage();
    });

    function loadWatchPage() {
        dolog('Checking Watch page');
        var player = document.querySelector(PLAYER_SELECTOR);
        console.log('\tPlayer:', player);
        if (!player) {
            player_found = false;
            setTimeout(loadWatchPage, 100);
            return;
        }
        var id = player.getVideoData().video_id;
        var resume = getResumeData(id);
        if (resume && resume.position) {
            dolog('Restoring to ' + resume.position);
            player.seekTo(resume.position);
        }
        addForgetButton();
        if (!player_found) {
            player_found = true;
            player.addEventListener('onStateChange', playerStateChange);
            playerStateChange(player.getPlayerState()); //Ensure it fires once
        }
    }

    function loadHomePage() {
        dolog('Checking Home page');
        var grid = document.querySelector(GRID_SELECTOR);
        console.log('\tGrid:', grid);
        if (!grid) {
            setTimeout(loadHomePage, 100);
            return;
        }
        var resume = localStorage.getItem(DATA_KEY);
        if (!resume) {
            dolog('No resume data');
            return;
        }
        resume = JSON.parse(resume);
        dolog('Add Links');
        var linkdiv = document.getElementById(LINKS_ID);
        if (!linkdiv) {
            linkdiv = document.createElement('div');
            linkdiv.id = LINKS_ID;
            linkdiv.style.color = 'white';
            linkdiv.style.fontSize = '1.5rem';
            linkdiv.style.fontWeight = 'bold';
            linkdiv.style.whiteSpace = 'pre';
            linkdiv.style.marginLeft = '10px';
            linkdiv.style.marginRight = 'auto';
            grid.parentNode.insertBefore(linkdiv, grid);
        }
        linkdiv.style.display = 'none'; //Hidden unless we have something
        linkdiv.innerHTML = '<span>Continue Watching:</span>';
        Object.keys(resume).forEach(function(k){
            var div = document.createElement('div');
            div.dataset.videoId = k;

            var link;
            link = document.createElement('button');
            link.innerText = '[X]';
            link.onclick = function(){
                this.disabled = true;
                forgetResume(k);
            };
            div.append(link);

            var timeStr = (new Date(resume[k].position * 1000)).toISOString().substr(11, 8)
            + ' / ' + (new Date(resume[k].duration * 1000)).toISOString().substr(11, 8);
            var pct = Math.round((resume[k].position / resume[k].duration) * 100);
            div.append('\t[' + timeStr + ' - ' + ('0'+pct).slice(-2) + '%]\t');

            var title = k;
            if (resume[k].title) {
                title = '[' + resume[k].author + '] ' + resume[k].title;
            }
            link = document.createElement('a');
            link.href = '/watch?v='+k;
            link.innerText = title;
            div.append(link);
            linkdiv.append(div);
            linkdiv.style.display = 'block';
        });
    }

    function forgetResume(id) {
        var resume = localStorage.getItem(DATA_KEY);
        if (!resume) {
            return;
        }
        resume = JSON.parse(resume);
        if (!resume) {
            throw 'Invalid Resume JSON';
        }
        if (!resume[id]) {
            return; //Already deleted?
        }
        delete resume[id];
        localStorage.setItem(DATA_KEY, JSON.stringify(resume));
    }

    function getResumeData(id) {
        var resume = localStorage.getItem(DATA_KEY);
        if (!resume) {
            return {};
        }
        resume = JSON.parse(resume);
        if (!resume) {
            throw 'Invalid Resume JSON';
        }
        return resume[id] || {};
    }

    function saveResumeData(id, data) {
        var resume = localStorage.getItem(DATA_KEY);
        if (!resume) {
            resume = '{}'; //First entry?
        }
        resume = JSON.parse(resume);
        if (!resume) {
            throw 'Invalid Resume JSON';
        }
        resume[id] = resume[id] || {}; //Ensure it exists
        var bSave = false;
        for (var k in data) {
            if (resume[id][k] != data[k]) {
                bSave = true;
                resume[id][k] = data[k];
            }
        }
        if (!bSave) {
            return; //Nothing to update, don't risk overwriting other page changes
        }
        localStorage.setItem(DATA_KEY, JSON.stringify(resume));
    }

    function addForgetButton() {
        var player = document.querySelector(PLAYER_SELECTOR);
        var where = document.querySelector(ADD_BUTTON_SELECTOR);
        if (!where) {
            dolog('addForgetButton ' + ADD_BUTTON_SELECTOR + ' not found');
            setTimeout(addForgetButton, 100);
            return;
        }
        var forget = document.getElementById(BUTTON_ID);
        if (!forget) {
            dolog('Forget button not found, adding...');
            forget = document.createElement('button');
            forget.id = BUTTON_ID;
            forget.type = 'button';
            forget.innerText = 'Forget';
            forget.classList.add('yt-icon-button');
            forget.onclick = doForget;
            where.parentNode.insertBefore(forget, where);
        }
        forget.dataset.resumeVideoId = player.getVideoData().video_id;
        if (!state_running) {
            saveState();
        }
    }

    function doForget() {
        forgetResume(this.dataset.resumeVideoId);
        this.parentNode.removeChild(this);
    }

    function saveState() {
        state_running = true;
        var forget = document.getElementById(BUTTON_ID);
        if (!forget) {
            dolog('saveSate - forget button not found - stopping poll');
            state_running = false;
            return;
        }
        var player = document.querySelector(PLAYER_SELECTOR);
        var state = player.getPlayerState();
        if (state != 1 && state != 2) {
            state_running = false;
            return; //Not playing/paused, ignore
        }
        var id = player.getVideoData().video_id;
        var data = {
            position: Math.floor(player.getCurrentTime()),
            duration: Math.floor(player.getDuration()),
            title: player.getVideoData().title,
            author: player.getVideoData().author
        };
        if (data.duration - data.position > KILL_TIME) {
            saveResumeData(id, data);
        } else {
            forgetResume(id); //Less than 10 seconds left, assume we watched it all
        }
        setTimeout(saveState, 5000); //Call again in 5 seconds
    }

    function playerStateChange(state) {
        if (state == 1 && !state_running) {
            saveState();
        }
    }
})();
