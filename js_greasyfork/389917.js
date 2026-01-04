// ==UserScript==
// @name         Nuklear Shitlist
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  To flag all those who did harm to us...
// @author       Jox [1714547]
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/hospitalview.php*
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @connect      nukefamily.org
// @downloadURL https://update.greasyfork.org/scripts/389917/Nuklear%20Shitlist.user.js
// @updateURL https://update.greasyfork.org/scripts/389917/Nuklear%20Shitlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var uid = null;
    var data = null;
    var savedData = null;
    var savedDataWL = null;
    var savedDataF = null;
    var savedDataWLF = null;
    var blackList = null;
    var whiteList = null;
    var blackListF = null;
    var whiteListF = null;
    var TargetID = null;
    var PlayerName = null;
    var update = 1;

    var blPrfileColor = 'rgba(255,0,0,0.3)';
    var wlProfileColor = 'rgba(0,100,0,0.3)';
    var wlcProfileColor = 'rgba(0,100,200,0.3)';
    var blFactionColor = 'rgba(150,70,120,0.5)';
    var wlFactionColor = 'rgba(0,100,0,0.3)';
    var wlcFactionColor = 'rgba(0,100,200,0.3)';

    start();


    function start(){
        try{
            savedData = JSON.parse(localStorage.localBlacklist || '{"blackList" : {}, "timestamp" : 0}');
            savedDataWL = JSON.parse(localStorage.localWhitelist || '{"whiteList" : {}, "timestamp" : 0}');
            savedDataF = JSON.parse(localStorage.localBlacklistF || '{"blackList" : {}, "timestamp" : 0}');
            savedDataWLF = JSON.parse(localStorage.localWhitelistF || '{"whiteList" : {}, "timestamp" : 0}');
            blackList = savedData.blackList;
            whiteList = savedDataWL.whiteList;
            blackListF = savedDataF.blackList;
            whiteListF = savedDataWLF.whiteList;
        }
        catch(error){
            console.error(error);
            alert('error loading saved data, please reload page!');
        }

        try{
            uid = getCookie('uid');
            data = JSON.parse(sessionStorage.getItem('sidebarData' + uid));
            if(data && data.user){
                PlayerName = `${data.user.name} [${uid}]`;
            }
        }
        catch(error){
            console.error(error);
        }

        if(Date.now() - savedData.timestamp > update * 60 * 1000){ //minutes * seconds * miliseconds
            console.log('Update blacklist...');
            updateBlackList();
        }

        if(window.location.href.startsWith('https://www.torn.com/hospitalview.php')){
            watchForPlayerListUpdates();
        }

        if(window.location.href.startsWith('https://www.torn.com/factions.php')){
            applyFilterFaction();
        }

        if(window.location.href.startsWith('https://www.torn.com/profiles.php')){
            setTimeout(checkIsPlayerBlaklisted, 500);
        }
    }

    function updateBlackList(){

        var postData = {Action: "get"};

        GM_xmlhttpRequest ( {
            method:     'POST',
            url:        'https://www.nukefamily.org/dev/shitlist.php',
            headers:    {'Cookie': document.cookie},
            data:       JSON.stringify(postData),
            onload:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                //console.log('GET Respnse', responseDetails.responseText);
                //alert(responseDetails.responseText);
                //updateBlackList();

                try{
                    var bl = JSON.parse(responseDetails.responseText);
                    var dataToSave = {};
                    dataToSave.blackList = bl;
                    dataToSave.timestamp = Date.now();
                    localStorage.localBlacklist = JSON.stringify(dataToSave);
                    console.log('Blacklist updated');
                    blackList = bl;
                    checkIsPlayerBlaklisted();
                }
                catch(error){
                    console.log(error);
                }
            }
        });

        var postDataWL = {Action: "getWhiteList"};

        GM_xmlhttpRequest ( {
            method:     'POST',
            url:        'https://www.nukefamily.org/dev/shitlist.php',
            headers:    {'Cookie': document.cookie},
            data:       JSON.stringify(postDataWL),
            onload:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                //console.log('GET Respnse', responseDetails.responseText);
                //alert(responseDetails.responseText);
                //updateBlackList();

                try{
                    var wl = JSON.parse(responseDetails.responseText);
                    var dataToSave = {};
                    dataToSave.whiteList = wl;
                    dataToSave.timestamp = Date.now();
                    localStorage.localWhitelist = JSON.stringify(dataToSave);
                    console.log('Blacklist updated');
                    whiteList = wl;
                    checkIsPlayerBlaklisted();
                }
                catch(error){
                    console.log(error);
                }
            }
        });


        var postDataF = {Action: "getFaction"};

        GM_xmlhttpRequest ( {
            method:     'POST',
            url:        'https://www.nukefamily.org/dev/shitlist.php',
            headers:    {'Cookie': document.cookie},
            data:       JSON.stringify(postDataF),
            onload:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                //console.log('GET Respnse', responseDetails.responseText);
                //alert(responseDetails.responseText);
                //updateBlackList();

                try{
                    var bl = JSON.parse(responseDetails.responseText);
                    var dataToSave = {};
                    dataToSave.blackList = bl;
                    dataToSave.timestamp = Date.now();
                    localStorage.localBlacklistF = JSON.stringify(dataToSave);
                    console.log('Blacklist updated');
                    blackListF = bl;
                    checkIsPlayerBlaklisted();
                }
                catch(error){
                    console.log(error);
                }
            }
        });



        var postDataWLF = {Action: "getFactionWhiteList"};

        GM_xmlhttpRequest ( {
            method:     'POST',
            url:        'https://www.nukefamily.org/dev/shitlist.php',
            headers:    {'Cookie': document.cookie},
            data:       JSON.stringify(postDataWLF),
            onload:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                //console.log('GET Respnse', responseDetails.responseText);
                //alert(responseDetails.responseText);
                //updateBlackList();

                try{
                    var wl = JSON.parse(responseDetails.responseText);
                    var dataToSave = {};
                    dataToSave.whiteList = wl;
                    dataToSave.timestamp = Date.now();
                    localStorage.localWhitelistF = JSON.stringify(dataToSave);
                    console.log('Blacklist updated');
                    whiteListF = wl;
                    checkIsPlayerBlaklisted();
                }
                catch(error){
                    console.log(error);
                }
            }
        });
    }

    function checkIsPlayerBlaklisted(){

        var emptyBox = document.querySelector('.profile-container .empty-block');

        if(!emptyBox){
            setTimeout(checkIsPlayerBlaklisted, 500);
        }
        else{

            var player = document.querySelector('.basic-information .user-information-section+div>span').innerHTML;
            var id = player.replace(/(.+\[)(\d+)(\])/gm, '$2');
            console.log('checkink is player blacklisted', id);


            const regexFid = /(https:\/\/www\.torn\.com\/factions\.php\?step=profile&ID=)(\d+)(.*)/gm;


            let facLink = document.querySelector(".basic-information .user-information-section+div span a[href^='/factions.php']")
            //var fid = facLink ? facLink.href.replace('https://www.torn.com/factions.php?step=profile&ID=', '') : false;
            let regexFidResult = regexFid.exec(facLink.href);


            var fid = regexFidResult[2] ? regexFidResult[2] : false;

            if(id){ TargetID = id };


            emptyBox.innerHTML = '';

            var a = document.createElement('a');
            a.href="#";
            a.innerHTML = "Add to Nuke's blacklist";
            a.style.margin = '1px 15px 0px';
            //a.style.display = 'block';
            a.onclick = reportToNuke;

            emptyBox.appendChild(a);

            var r = document.createElement('a');
            r.href="#";
            r.innerHTML = "Remove";
            r.style.margin = '1px 15px 0px';
            //r.style.display = 'block';
            r.style.float = 'right';
            r.onclick = unreportToNuke;

            emptyBox.appendChild(r);

            var reviveButton = document.querySelector('.profile-button-revive i');
            var attackButton = document.querySelector('.profile-button-attack i');
            var profileContainer = document.querySelector('.profile-container');

            if(blackList[id] || whiteList[id] || blackListF[fid] || whiteListF[fid]){
                
                var ul = document.createElement('ul');
                ul.style.padding = '3px 10px';
                ul.style.margin = '0 5px';

                if(fid && blackListF[fid]){
                    for(let comment of blackListF[fid]){
                        profileContainer.style.backgroundColor = blFactionColor;

                        let li = document.createElement('li');
                        li.innerHTML = '<span class="bold">' + comment.reporter + ': </span>' + comment.reason

                        ul.appendChild(li);
                    }
                }

                if(fid && whiteListF[fid]){
                    for(let comment of whiteListF[fid]){
                        if(comment.whitelisted && comment.whitelisted == 1){
                            profileContainer.style.backgroundColor = wlFactionColor;
                        }
                        else{
                            profileContainer.style.backgroundColor = wlcFactionColor;
                        }

                        let li = document.createElement('li');
                        li.innerHTML = '<span class="bold">' + comment.reporter + ': </span>' + comment.reason

                        ul.appendChild(li);
                    }
                }

                if(blackList[id]){
                    for(let comment of blackList[id]){
                        profileContainer.style.backgroundColor = blPrfileColor;

                        let li = document.createElement('li');
                        li.innerHTML = '<span class="bold">' + comment.reporter + ': </span>' + comment.reason

                        ul.appendChild(li);
                    }
                }

                if(whiteList[id]){
                    for(let comment of whiteList[id]){
                        if(comment.whitelisted && comment.whitelisted == 1){
                            profileContainer.style.backgroundColor = wlProfileColor;
                        }
                        else{
                            profileContainer.style.backgroundColor = wlcProfileColor;
                        }

                        let li = document.createElement('li');
                        li.innerHTML = '<span class="bold">' + comment.reporter + ': </span>' + comment.reason

                        ul.appendChild(li);
                    }
                }

                emptyBox.style.overflow = 'auto';
                emptyBox.appendChild(ul);
            }
            else{
                profileContainer.style.backgroundColor = null;
            }
        }
    }

    function reportToNuke(){
        var reason = prompt("Reason for adding to Nuke's blacklist");

        if (reason == null || reason == "") {
            alert('Reason must be added');
        } else {

            if(!PlayerName){
                uid = getCookie('uid');
                data = JSON.parse(sessionStorage.getItem('sidebarData' + uid));
                if(data && data.user){
                    PlayerName = `${data.user.name} [${uid}]`;
                }
            }

            if(PlayerName){
                //alert('sending data to Nuke server...');
                var postData = {Action: "add", TargetID: TargetID, ReporterName: PlayerName, Reason: reason};

                GM_xmlhttpRequest ( {
                    method:     'POST',
                    url:        'https://www.nukefamily.org/dev/shitlist.php',
                    headers:    {'Cookie': document.cookie},
                    data:       JSON.stringify(postData),
                    onload:     function (responseDetails) {
                        // DO ALL RESPONSE PROCESSING HERE...
                        //console.log(responseDetails, responseDetails.responseText);
                        alert(responseDetails.responseText);
                        updateBlackList();
                    }
                });
            }
            else{
                alert('Same player data missing, refresh page and try again');
            }
        }
    }

    function unreportToNuke(){
        var confirmation = confirm("Please confirm removeing from balcklist");

        if (confirmation){
            //alert('sending data to Nuke server...');
            var postData = {Action: "remove", TargetID: TargetID};

            GM_xmlhttpRequest ( {
                method:     'POST',
                url:        'https://www.nukefamily.org/dev/shitlist.php',
                headers:    {'Cookie': document.cookie},
                data:       JSON.stringify(postData),
                onload:     function (responseDetails) {
                    // DO ALL RESPONSE PROCESSING HERE...
                    //console.log(responseDetails, responseDetails.responseText);
                    alert(responseDetails.responseText);
                    updateBlackList();
                }
            });
        }
    }

    function applyFilter(){
        let list = document.querySelector('.users-list');
        for(var i=0; i < list.childNodes.length; i++){
            if(list.childNodes[i].childNodes.length > 0){
                //console.log(list.childNodes[i]);
                var id = list.childNodes[i].querySelector('a.user.name').href.replace('https://www.torn.com/profiles.php?XID=', '');
                var fid = list.childNodes[i].querySelector('a.user.faction').href.replace('https://www.torn.com/factions.php?step=profile&ID=', '');

                console.log(id, fid);

                if(blackListF[fid]){
                    list.childNodes[i].style.backgroundColor = blFactionColor;
                    list.childNodes[i].classList.add('nuke-blacklist');
                }

                if(whiteListF[fid]){
                    let lastComment = whiteListF[fid][whiteListF[fid].length - 1]
                    //list.childNodes[i].style.backgroundColor = wlFactionColor;
                    if(lastComment.whitelisted && lastComment.whitelisted == 1){
                        list.childNodes[i].style.backgroundColor = wlFactionColor;
                    }
                    else{
                        list.childNodes[i].style.backgroundColor = wlcFactionColor;
                    }
                    list.childNodes[i].classList.add('nuke-whitelist');
                }

                if(blackList[id]){
                    list.childNodes[i].style.backgroundColor = blPrfileColor;
                    list.childNodes[i].classList.add('nuke-blacklist');
                }

                if(whiteList[id]){
                    //list.childNodes[i].style.backgroundColor = blPrfileColor;
                    let lastComment = whiteList[id][whiteList[id].length - 1]
                    if(lastComment.whitelisted && lastComment.whitelisted == 1){
                        list.childNodes[i].style.backgroundColor = wlProfileColor;
                    }
                    else{
                        list.childNodes[i].style.backgroundColor = wlcProfileColor;
                    }
                    list.childNodes[i].classList.add('nuke-blacklist');
                }
            }
        }
    }

    function applyFilterFaction(){
        let list = document.querySelector('.members-list .table-body');
        if(list){
            for(var i=0; i < list.childNodes.length; i++){
                if(list.childNodes[i].childNodes.length > 0){
                    //console.log(list.childNodes[i]);
                    var id = list.childNodes[i].querySelector('a[href*="profiles"]').href.replace('https://www.torn.com/profiles.php?XID=', '');
                    var fid = list.childNodes[i].querySelector('a[href*="faction"]').href.replace('https://www.torn.com/factions.php?step=profile&ID=', '');

                    if(blackListF[fid]){
                        list.childNodes[i].style.backgroundColor = blFactionColor;
                        list.childNodes[i].classList.add('nuke-blacklist');
                    }

                    if(whiteListF[fid]){
                        let lastComment = whiteListF[fid][whiteListF[fid].length - 1]
                        //list.childNodes[i].style.backgroundColor = wlFactionColor;
                        if(lastComment.whitelisted && lastComment.whitelisted == 1){
                            list.childNodes[i].style.backgroundColor = wlFactionColor;
                        }
                        else{
                            list.childNodes[i].style.backgroundColor = wlcFactionColor;
                        }
                        list.childNodes[i].classList.add('nuke-whitelist');
                    }

                    if(blackList[id]){
                        list.childNodes[i].style.backgroundColor = blPrfileColor;
                        list.childNodes[i].classList.add('nuke-blacklist');
                    }

                    if(whiteList[id]){
                        //list.childNodes[i].style.backgroundColor = blPrfileColor;
                        let lastComment = whiteList[id][whiteList[id].length - 1]
                        if(lastComment.whitelisted && lastComment.whitelisted == 1){
                            list.childNodes[i].style.backgroundColor = wlProfileColor;
                        }
                        else{
                            list.childNodes[i].style.backgroundColor = wlcProfileColor;
                        }
                        list.childNodes[i].classList.add('nuke-blacklist');
                    }

                }
            }
        }
        else{
            setTimeout(applyFilterFaction,100);
        }
    }

    function applyInfo(){
        let list = document.querySelectorAll('.nuke-blacklist .confirm-revive .ajax-action');
        for(var item of list){
            item.innerHTML = 'Player is blacklisted, check profile for more info';
        }
    }

    function isListOfPlayers(node) {
        //console.log('Node',node);

        if(node.childNodes.length >= 5){
        return node.childNodes[5].classList !== undefined &&
            node.childNodes[5].classList.contains('user') &&
            node.childNodes[5].classList.contains('name');
        }
        else{
            return false;
        }
    }

    function watchForPlayerListUpdates() {
        let target = document.querySelector('.userlist-wrapper');
        let doApplyFilter = false;
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doApplyFilter = false;
                let doApplyInfo = false;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    //console.log(mutation.addedNodes.item(i));
                    if (isListOfPlayers(mutation.addedNodes.item(i))) {
                        doApplyFilter = true;
                        //console.log('Have List of players');
                        break;
                    }
                    else{
                        //console.log('Not a List of players');
                        if(mutation.target && mutation.target.nodeType == 1 && mutation.target.classList.contains('confirm-revive')){
                            doApplyInfo = true;
                            break;
                        }
                    }
                }

                if (doApplyFilter) {
                    applyFilter();
                }

                if (doApplyInfo) {
                    applyInfo();
                }
            });
        });
        // configuration of the observer:
        //let config = { childList: true, subtree: true };
        let config = { childList: true, subtree: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

})();