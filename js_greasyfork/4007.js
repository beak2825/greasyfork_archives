// ==UserScript==
// @name         WME Map Tiles Update
// @version      2022.03.05.01
// @description  Show the last server update and different times
// @namespace    Sebiseba
// @copyright    Sebiseba 2014-2016
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect      storage.googleapis.com
// @connect      api.timezonedb.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/4007/WME%20Map%20Tiles%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/4007/WME%20Map%20Tiles%20Update.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
/***
Thanks
   Translations :
   Brazilian Portuguese by fsmallmann
   Hebrew by gad_m
***/
// **********************************
// **  DOWNLOAD HELPER BY DUMMYD2  **
// **********************************
/******** AUTO INJECTED PART ***************/
function MTUdownloadHelperInjected() {
    window.MTUDownloadHelper = {
        jobs: [],
        _waitForData: function (id)
        {
            if (this.jobs.length <= id) {
                this.jobs[id].callback({
                    url: null,
                    data: null,
                    callback: this.jobs[id].callback,
                    status: 'error',
                    error: 'Request not found'
                });
            }
            else
            {
                if (this.jobs[id].status == 'success' || this.jobs[id].status == 'error')
                    this.jobs[id].callback(this.jobs[id]);
                else
                {
                    if (this.jobs[id].status == 'downloading' && this.jobs[id].progressCallback) {
                        this.jobs[id].progressCallback(this.jobs[id]);
                    }
                    var _this = this;
                    window.setTimeout(function () {
                        _this._waitForData(id);
                    }, 500);
                }
            }
        },
        add: function (params, callback, progressCallback)
        {
            this.jobs.push({
                params: params,
                data: null,
                callback: callback,
                progressCallback: progressCallback,
                status: 'added',
                progression: 0,
                error: ''
            });
            var id = this.jobs.length - 1;
            var _this = this;
            window.setTimeout(function () {
                _this._waitForData(id);
            }, 500);
        }
    };
}
var MTUdownloadHelperInjectedScript = document.createElement('script');
MTUdownloadHelperInjectedScript.textContent = '' + MTUdownloadHelperInjected.toString() + ' \n' + 'MTUdownloadHelperInjected();';
MTUdownloadHelperInjectedScript.setAttribute('type', 'application/javascript');
document.body.appendChild(MTUdownloadHelperInjectedScript);
/******** SANDBOX PART ***************/
function MTUlookFordownloadHelperJob() {
    for (var i = 0; i < unsafeWindow.MTUDownloadHelper.jobs.length; i++) {
        if (unsafeWindow.MTUDownloadHelper.jobs[i].status == 'added') {
            unsafeWindow.MTUDownloadHelper.jobs[i].status = cloneInto('downloading', unsafeWindow.MTUDownloadHelper.jobs[i]);
            var f = function () {
                var job = i;
                GM_xmlhttpRequest({
                    method: unsafeWindow.MTUDownloadHelper.jobs[job].params.method,
                    headers: unsafeWindow.MTUDownloadHelper.jobs[job].params.headers,
                    data: unsafeWindow.MTUDownloadHelper.jobs[job].params.data,
                    synchronous: false,
                    timeout: 3000,
                    url: unsafeWindow.MTUDownloadHelper.jobs[job].params.url,
                    //job: i,
                    onerror: function (r) {
                        unsafeWindow.MTUDownloadHelper.jobs[job].status = cloneInto('error', unsafeWindow.MTUDownloadHelper.jobs[job]);
                    },
                    ontimeout: function (r) {
                        unsafeWindow.MTUDownloadHelper.jobs[job].status = cloneInto('error', unsafeWindow.MTUDownloadHelper.jobs[job]);
                    },
                    onload: function (r) {
                        unsafeWindow.MTUDownloadHelper.jobs[job].status = cloneInto('success', unsafeWindow.MTUDownloadHelper.jobs[job]);
                        unsafeWindow.MTUDownloadHelper.jobs[job].data = cloneInto(r.responseText, unsafeWindow.MTUDownloadHelper.jobs[job]);
                    },
                    onprogress: function (r) {
                        unsafeWindow.MTUDownloadHelper.jobs[job].progression = cloneInto(r.total == 0 ? 0 : (r.loaded / r.total), unsafeWindow.MTUDownloadHelper.jobs[job]);
                    }
                });
            }();
        }
    }
    window.setTimeout(MTUlookFordownloadHelperJob, 2000);
}
window.setTimeout(MTUlookFordownloadHelperJob);
/*******************/
function run_MTU() {
    var WME_MUpdate_Version = '2022.01.29.03',
        lang, MTUhandle, MTUenv, MTULang, userLang, timermaphours, timerupd, tz, debug = '';
    function getId(node) {
        return document.getElementById(node);
    }
    function getElementsByClassName(classname, node) {
        if (!node) node = document.getElementsByTagName('body') [0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName('*');
        for (var i = 0, j = els.length; i < j; i++)
            if (re.test(els[i].className)) a.push(els[i]);
        return a;
    }
    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    function pad(str) {
        str = str.toString();
        return str.length < 2 ? pad('0' + str, 2)  : str;
    }
    function getSelectedFeatures(){
        if(!W.selectionManager.getSelectedFeatures)
            return W.selectionManager.selectedItems;
        return W.selectionManager.getSelectedFeatures();
    }
    function checkTimestamp(strDate) {
        switch(W.app.getAppRegionCode()) {
            case "usa" : var env='na'; break;
            case "row" : var env='intl'; break;
            case "il" : var env='il'; break;
            default: var env='intl'; break;
        }
        var checklast = JSON.parse(localStorage.getItem('MTUlastupdate'));
        if (Date.parse(checklast[MTUenv]) < strDate) {
            return'<wz-tooltip-source><i class="status-icon status-updated-icon"><wz-tooltip-target></wz-tooltip-target></i></wz-tooltip-source>&nbsp;';
        }
        else {
            return'<wz-tooltip-source><i class="status-icon status-created-icon"><wz-tooltip-target></wz-tooltip-target></i></wz-tooltip-source>&nbsp;';
        }
    }
    function MTUinit() {
        if (typeof (W.app) === 'undefined' ||
            typeof (W.Config.api_base) === 'undefined' ||
            typeof (I18n) === 'undefined' ||
            !getElementsByClassName('WazeControlPermalink') [0]) {
            window.setTimeout(MTUinit, 500);
            return;
        }

        MTUhandle = getElementsByClassName('overlay-buttons-container')[0];
        if (!MTUhandle) {
            setTimeout(MTUinit, 1000);
            return;
        } // Detect Country Server (World/US/Israel)

        MTUenv = W.app.getAppRegionCode();
        if (debug) { console.info('WME Map Tiles Update - Serveur : ' + MTUenv); } //    Then running

        if (!localStorage.getItem('MTUlastupdate') || !IsJsonString(localStorage.getItem('MTUlastupdate'))) {
            localStorage.setItem('MTUlastupdate', '{"usa":"","row":"","il":"","version":""}');
        } // Translation

        MTULang = I18n.locale;
        switch (MTULang) {
            case 'fr':
                userLang = new Array('Heure locale', 'Heure carte', 'Heure UTC');
                break;
            case 'pt-BR':
                userLang = new Array('Hora local', 'Hora mapa', 'Hora UTC');
                break;
            case 'he':
                userLang = new Array('עדכון אחרון', 'בוצע', 'בעיה אחרונה UTC');
                break;
            default:
                userLang = new Array('Home time', 'Map time', 'UTC time');
                break;
        }
        if (debug) { console.info('WME Map Tiles Update - Langue: ' + MTULang); }

        //CSS
        var cssElt = document.createElement('style');
        cssElt.type = 'text/css';
        var css = '.tile-build-status-card .tile-build-status-card-block { margin-top:10px; }';
        css += '.tile-build-status-card .tile-build-status-card-content { padding-right:0; }';
        cssElt.innerHTML = css;
        document.body.appendChild(cssElt);

        W.selectionManager.events.register('selectionchanged', null, Check_MTU);
        getId('tile-build-status').addEventListener("click", (event) => { setTimeout(Improve_wzDialogContainer, 100); });
        Check_mapUpdate();

        // ----------- Check WME Version

        var checklast = JSON.parse(localStorage.getItem('MTUlastupdate'));
        if(checklast.version != W.version) {
            getId('tile-build-status').style.backgroundColor = 'rgba(0, 40, 80, 0.8)';
            checklast.version = W.version;
            localStorage.setItem('MTUlastupdate', JSON.stringify(checklast));
        }
    }
    function Check_mapUpdate() {
        try {
            switch(MTUenv) {
                case "usa" : var env='na'; break;
                case "row" : var env='intl'; break;
                case "il" : var env='il'; break;
                default: var env='intl'; break;
            }
            var params = {
                url: 'https://storage.googleapis.com/waze-tile-build-public/release-history/'+env+'-feed.xml',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'text/plain'
                },
                data: null,
                method: 'GET'
            };
            MTUDownloadHelper.add(params, function (data) {
                if (data.status == 'success') {
                    var parser = new DOMParser();
                    var d = parser.parseFromString(data.data, "text/xml");
                    var modified = d.getElementsByTagName("entry")[0].getElementsByTagName("modified")[0].textContent;
                    var checklast = JSON.parse(localStorage.getItem('MTUlastupdate'));
                    if (checklast[MTUenv] != modified) {
                        getId('tile-build-status').style.backgroundColor = 'rgba(25, 50, 0, 0.8)';
                        checklast[MTUenv] =modified;
                        localStorage.setItem('MTUlastupdate', JSON.stringify(checklast));
                    }
                }
            }, null);
        }
        catch (e) { console.error('MTU Error @ upload data:', e); }
        setTimeout(Check_mapUpdate, 1000 * 60 * 30);
    }
    function Improve_wzDialogContainer() {
        getId('tile-build-status').style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        getId('wz-dialog-container').children[0].children[0].children[0].children[0].innerHTML = I18n.translations[I18n.locale].tile_build_status.card.title + '&nbsp;<b>' + I18n.translations[MTULang].envs[MTUenv]+'</b>';
        getElementsByClassName("tile-build-status-card-content")[0].innerHTML='<i class="fa fa-check-circle" style="color:#118742;font-size:14px;margin:0 8px 8px;"></i><span class="info" style="font-size:14px;">Version WME:</span> '+W.version+'<br>'+I18n.translations[I18n.locale].tile_build_status.card.content;
        if(getId('HoursInfos') == null) {
            var HoursInfos = document.createElement('div');
            HoursInfos.id='HoursInfos';
            HoursInfos.className='tile-build-status-card-block';
            var c='<div class="tile-build-status-card-block__content">';
            c += '<wz-caption><div>'+ userLang[2] +'</div><div id="utchours"><img src="https://editor-assets.waze.com/production/img/loader590b4fefa287db32a8578add9f1289df.gif" style="height:20px;width:20px;" /></div></wz-caption>';
            c += '<wz-caption><div>'+ userLang[0] +'</div><div id="localhours"><img src="https://editor-assets.waze.com/production/img/loader590b4fefa287db32a8578add9f1289df.gif" style="height:20px;width:20px;" /></div></wz-caption>';
            c += '<wz-caption><div>'+ userLang[1] +'<span class="tile-build-status-card-block__date" style="padding:8px;" id="tzname"></span></div><div id="maphours"><img src="https://editor-assets.waze.com/production/img/loader590b4fefa287db32a8578add9f1289df.gif" style="height:20px;width:20px;" /></div></wz-caption></div>';
            HoursInfos.innerHTML=c;
            getElementsByClassName("tile-build-status-card")[0].children[1].insertBefore(HoursInfos, getElementsByClassName("tile-build-status-card")[0].children[1].childNodes[7]);
            gettimezone();
        } else {
            clearTimeout(timermaphours);
        }
    }
    function Check_MTU() {
        try {
            var a = getElementsByClassName('additional-attributes list-unstyled side-panel-section') [0];
            if (typeof (a) === 'undefined') {
                return;
            }
            var so = getSelectedFeatures()[0]; // W.selectionManager.getSelectedFeatures()[0];

            //Dates
            var createdOn = so.model.attributes.createdOn,
                domCreated = I18n.translations[MTULang].edit.created + ' ',
                cd = new Date(createdOn).toString();

            if (typeof(so.model.attributes.updatedOn) != 'undefined') {
                var updatedOn = so.model.attributes.updatedOn,
                    domUpdated = I18n.translations[MTULang].edit.updated + ' ',
                    ud = new Date(updatedOn).toString();
            }

            //Who
            if (!so.model.attributes.residential) {
                if (typeof(so.model.attributes.createdBy) !== 'undefined' && typeof (W.model.users.getObjectById(so.model.attributes.createdBy)) !== 'undefined') {
                    var createdByRank = (W.model.users.getObjectById(so.model.attributes.createdBy).rank+1),
                        createdBy = W.model.users.getObjectById(so.model.attributes.createdBy).userName;
                } else { var createdByRank='', createdBy = so.model.attributes.createdBy; }

                if (typeof(so.model.attributes.updatedBy) !== 'undefined' && typeof (W.model.users.getObjectById(so.model.attributes.updatedBy)) !== undefined && W.model.users.getObjectById(so.model.attributes.updatedBy) !== null) {
                    var updatedByRank = (W.model.users.getObjectById(so.model.attributes.updatedBy).rank+1),
                        updatedBy = W.model.users.getObjectById(so.model.attributes.updatedBy).userName;
                } else { var updatedByRank='', updatedBy = so.model.attributes.updatedBy; }
            }
            else { var createdByRank='', createdBy = "Wazer", updatedByRank='', updatedBy = "Wazer"; }

            //Templates
            if (typeof(updatedOn) != 'undefined') {
                var updateTemplate=checkTimestamp(updatedOn)+domUpdated.replace('%{time}', ud.substring(0, ud.indexOf(' GMT'))).replace('%{user}', colorUser(updatedBy, updatedByRank)); }
            else { updateTemplate=""; }
            var createTemplate=checkTimestamp(createdOn)+domCreated.replace('%{time}', cd.substring(0, cd.indexOf(' GMT'))).replace('%{user}', colorUser(createdBy, createdByRank));

            // Special residentials
            if (so.model.attributes.residential) {
                a.children[0].innerHTML = '<li>'+updateTemplate+'</li><li>'+createTemplate+'</li>'+a.children[0].innerHTML;
            }

            // Special segments
            if (so.model.type === 'segment') {
                /* Nothing to do */
                // Length fix
                var totalLength=0;
                for (var l=0; typeof(getSelectedFeatures()[l]) == "object"; l++) { totalLength = totalLength + getSelectedFeatures()[l].model.attributes.length; }
                getElementsByClassName('length-attribute')[0].innerHTML ='<span class="name">'+ I18n.translations[MTULang].edit.segment.fields.length + ': </span><span class="value">'+ I18n.translations[MTULang].edit.segment.fields.length_value.replace("%{length}", totalLength) +'</span>';
            }

            // Special Big junction
            else if (so.model.type === 'bigJunction') {
                a.children[1].innerHTML=updateTemplate;
                a.children[2].innerHTML=createTemplate;
            }
            else {
                a.children[0].innerHTML=updateTemplate;
                a.children[1].innerHTML=createTemplate;
            }
        }
        catch (e) {
            console.error('MTU Error @ catch data:', e);
        }
    }
    function gettimezone() {
        var a = getElementsByClassName('WazeControlPermalink') [0].innerHTML;
        var b = a.substring(a.indexOf('https')).split('?');
        var c = b[1].split(/"/g);
        var d = c[0].split('&amp;');
        for (var i = 0; d[i]; i++) {
            if (d[i].substring(0, 3) == 'lon') {
                var lon = d[i].substring(4);
            }
            if (d[i].substring(0, 3) == 'lat') {
                var lat = d[i].substring(4);
            }
        }

        try {
            if (debug) { console.log('MTU - url : http://api.timezonedb.com/v2.1/get-time-zone?key=N2X1H5WP404Z&format=json&by=position&lng='+lon+'&lat='+lat); }
            var params = {
                url: 'http://api.timezonedb.com/v2.1/get-time-zone?key=N2X1H5WP404Z&format=json&by=position&lng='+lon+'&lat='+lat+'&time='+ Math.floor(new Date().getTime() / 1000),
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'text/plain'
                },
                data: null,
                method: 'GET'
            };
            MTUDownloadHelper.add(params, function (data) {
                if (data.status == 'success') {
                    var timezone = JSON.parse(data.data);
                    tz = timezone.formatted;
                    if (debug) { console.log('MTU - Loading Time Zone Success: ',timezone); }
                    if(getId('tzname') != null) { getId('tzname').innerHTML = ' '+timezone.countryName+' ('+timezone.zoneName+')'; }
                    maphours();
                }
            }, null);
        }
        catch (e) { console.error('MTU Error @ upload data:', e); }
    }
    function maphours() {
        if(getId('maphours')) {
            var d = new Date();

            // UTC Time
            var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            var ud = new Date(utc);
            var uh = pad(ud.getHours());
            var um = pad(ud.getMinutes());
            var us = pad(ud.getSeconds());
            getId('utchours').innerHTML = uh+ ':' +um+ ':' +us;

            //Local time
            var h = pad(d.getHours());
            var m = pad(d.getMinutes());
            var s = pad(d.getSeconds());
            getId('localhours').innerHTML = h+ ':' +m+ ':' +s;

            //Map time
            var t=tz.split(' ');
            getId('maphours').innerHTML = '<i class="fa fa-lock" style="color:#ccc;font-size:11px;margin-right:5px;"></i> '+t[1];
        }
        timermaphours = setTimeout(maphours, 1000);
    }
    function colorUser(editor, rank) {
        var user;
        if (/^(Ad-Ops-Map|admin|adsteam-jiteanu|avseu|WazeFeed|WazeParking1|waze-maint-bot|Waze3rdParty|Yext_Import)/.test(editor)) {
            user = '<font color="red">' + editor + '(' + rank + ')</font>';
        }
        else if (editor === 'Inactive User' || editor === 'Wazer') {
            user = '<font color="grey">' + editor + '</font>';
        }
        else if (typeof (editor) === 'undefined') {
            user = '<font color="grey">Wazer</font>';
        }
        else {
            user = '<a target="_blank" href="https://www.waze.com/user/editor/' + editor + '">' + editor + '(' + rank + ')</a>';
        }
        return user;
    }
    console.log('WME Map Tiles Update - ' + WME_MUpdate_Version + ' starting');
    window.setTimeout(MTUinit, 5000);
}
var MTUscript = document.createElement('script');
MTUscript.textContent = '' + run_MTU.toString() + ' \n' + 'run_MTU();';
MTUscript.setAttribute('type', 'application/javascript');
document.body.appendChild(MTUscript);