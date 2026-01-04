// ==UserScript==
// @name           AO3 Userscript Data Sync
// @author         Melissa
// @version        0.0.2
// @description    Sync AO3 userscript data between clients via Google Drive API.
// @match          http://archiveofourown.org/*
// @match          https://archiveofourown.org/*
// @grant          none
// @require        http://code.jquery.com/jquery-3.2.1.min.js
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/467341/AO3%20Userscript%20Data%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/467341/AO3%20Userscript%20Data%20Sync.meta.js
// ==/UserScript==

function wrapper(plugin_info) {

    if(typeof window.plugin !== 'function') window.plugin = function() {};

    const debug = false;
    plugin_info.buildName = '0.0.1';
    plugin_info.dateTimeVersion = '2023-05-28-1622';
    plugin_info.pluginId = 'AO3_sync';

    window.plugin.ao3Sync = function() {};

////////////// Default storage - Google Drive ////////////////
    function GoogleDriveStorage(clientId, apiKey, scope, discoveryDoc) {
        this.clientId = clientId;
        this.apiKey = apiKey;
        this.scope = scope;
        this.discoveryDoc = discoveryDoc;

        this.tokenClient;
        this.authorized = false;

    }

    GoogleDriveStorage.prototype.init = function(callback) {
        $.getScript('https://apis.google.com/js/api.js').done(function () {
            gapi.load('client', callback);
        });
    };

    GoogleDriveStorage.prototype.load = function(redirect, callback) {
        debug && console.log('GoogleDriveStorage.prototype.load: ', arguments);
        this.authorized = false;

        var self = this;

        gapi.client.init({
            apiKey: self.apiKey,
            discoveryDocs: [self.discoveryDoc]
        });

        $.getScript('https://accounts.google.com/gsi/client').done(function () {
            self.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: self.clientId,
                scope: self.scope,
                callback: '',
            });
        });

        if(callback) callback(true);
    }

    GoogleDriveStorage.prototype.authorize = function(redirect, callback) {
        debug && console.log('GoogleDriveStorage.prototype.authorize: ', arguments);
        this.authorized = false;

        var self = this;

        function handleAuthResult(authResult) {
            debug && console.log('handleAuthResult()', authResult);
            if(authResult && authResult.access_token) {
                self.authorized = true;
                debug && console.log('handleAuthResult() self.authorized', self.authorized);
            }
            else {
                self.authorized = false;
                var error = (authResult && authResult.error) ? authResult.error : 'not authorized';
                console.log(error);
                if (error === "idpiframe_initialization_failed") {
                    console.log('You need enable 3rd-party cookies in your browser or allow [*.]google.com');
                }
            }

            if(callback) callback(self.authorized);
        }

        self.tokenClient.callback = handleAuthResult;

        debug && console.log('authenticate() gapi.client.getToken()', gapi.client.getToken());
        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            self.tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            self.tokenClient.requestAccessToken({prompt: ''});
        }

        if (gapi.client.getToken()){
            handleAuthResult(gapi.client.getToken());
        }
    };

    GoogleDriveStorage.prototype.signOut = function(callback) {
        var client = gapi.client.getAuthInstance();
        var self = this;
        client.signOut().then(function () {
            client.disconnect();
            self.authorized = false;
            if(callback) callback();
        });
    };

    GoogleDriveStorage.prototype.getFilesList = function(callback) {
        gapi.client.load('drive', 'v3').then(function() {
            gapi.client.drive.files.list({
                spaces: 'appDataFolder',
                fields: 'files(id, name)',
                orderBy: 'modifiedTime desc'
            }).then(function(resp) {
                if(callback) callback(resp.result.files);
            });
        });
    };

    GoogleDriveStorage.prototype.findFile = function(name, callback) {
        this.getFilesList(function(list) {
            var found = null;

            for(var i=0; i<list.length; i++) {
                var file = list[i];
                if(file.name.toLowerCase() === name.toLowerCase()) found = file;
            }

            if(callback) callback(found);
        });
    };

    GoogleDriveStorage.prototype.createFile = function(name, callback) {
        this.findFile(name, function(file) {
            if(file) {
                if(callback) callback(file);
                return;
            }

            gapi.client.load('drive', 'v3').then(function() {
                gapi.client.drive.files.create({
                    resource: {
                        name: name,
                        mimeType: 'text/plain',
                        parents: ['appDataFolder']
                    },
                    fields: 'id,name'
                }).then(function(resp) {
                    if(callback) callback(resp.result);
                });
            });
        });
    };

    GoogleDriveStorage.prototype.readFile = function(id, callback) {
        gapi.client.load('drive', 'v3').then(function() {
            gapi.client.drive.files.get({fileId: id, alt: 'media'}).then(function(resp) {
                if(callback) callback(resp);
            });
        });
    };

    GoogleDriveStorage.prototype.saveFileById = function(id, content, callback) {
        gapi.client.load('drive', 'v3').then(function() {
            gapi.client.request({
                path: '/upload/drive/v3/files/' + id,
                method: 'PATCH',
                params: {uploadType: 'media'},
                body: content
            }).then(function(resp) {
                if(callback) callback(resp);
            });
        });
    };

    GoogleDriveStorage.prototype.saveFileByName = function(name, content, callback) {
        var self = this;

        self.findFile(name, function(file) {
            if(file) {
                self.saveFileById(file.id, content, callback);
            }
            else {
                self.createFile(name, function(file) {
                    self.saveFileById(file.id, content, callback);
                });
            }
        });
    };

    GoogleDriveStorage.prototype.deleteFile = function(id, callback) {
        gapi.client.load('drive', 'v3').then(function() {
            gapi.client.drive.files.delete({fileId: id}).then(function() {
                if(callback) callback();
            });
        });
    };

//////////////////////////////////////////////////////////////

    const CLIENT_ID = '609844848444-ll1eov6pb9t6tko3kj5kgpvq4k4mmho8.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyBQK8T23vnd_76pRuxgSp5GV9H3yoAyVMI';
    const SCOPE = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly';
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    var dataStorage = null;
    var ready = false;
    var dataFileExt = 'dtd';

    var options = {};

    function fixDataFileName(name) {
        var parts = name.split('.');
        if(parts.length < 2 || parts.pop() !== dataFileExt) {
            name = name + '.' + dataFileExt;
        }
        return name;
    }

    function setupCSS() {
        var css = '#ao3SyncBox {display: none;position: absolute !important;z-index: 5001;top: 50px;left: 60px;width: 200px;height: 250px;overflow: hidden;background: rgba(8, 48, 78, .9);border: 1px solid #20a8b1;color: #ffce00;padding: 8px;font-size: 13px;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none }#ao3SyncBox #ao3SyncTopBar {height: 15px !important }#ao3SyncBox #ao3SyncTopBar * {height: 14px !important }#ao3SyncBox .handle {width: 89%;text-align: center;color: #fff;line-height: 6px;cursor: move;float: right }#ao3SyncBox #ao3SyncTopBar .btn {display: block;width: 10%;cursor: pointer;color: #20a8b1;font-weight: 700;text-align: center;line-height: 13px;font-size: 18px;border: 1px solid #20a8b1;float: left }#ao3SyncBox #ao3SyncTopBar .btn:hover {color: #ffce00;text-decoration: none }#ao3SyncBox #ao3SyncTitle {font-size: 12px;padding-top: 5px }#ao3SyncBox #ao3SyncList {clear: both;margin-top: 8px;height: 200px;overflow-x: hidden;overflow-y: auto;border-bottom: 1px solid #20a8b1 }#ao3SyncBox #ao3SyncLock {display: none;position: absolute !important;left: 0;top: 26px;width: 100%;height: 100%;text-align: center;background-color: rgba(0, 0, 0, .5) }#ao3SyncBox #ao3SyncLock svg {display: block;margin: auto;margin-top: 80px }#ao3SyncBox #ao3SyncAuth {padding-top: 24px }#ao3SyncBox #ao3SyncAuth a {display: block;color: #ffce00;border: 1px solid #ffce00;padding: 3px 0;margin: 10px auto;width: 80%;text-align: center;background: rgba(8, 48, 78, .9) }.ao3SyncItem {margin-top: 2px;margin-bottom: 2px;padding: 4px;background: rgba(8, 48, 78, .75);cursor: pointer;color: #fff }.ao3SyncItem:hover {background: rgba(4, 24, 39, 1) }#ao3SyncLoadPanel {padding-top: 8px }#ao3SyncLoadPanel label {display: block;float: left;padding-top: 2px;padding-left: 5px }#ao3SyncLoadPanel input {display: block;float: left }#ao3SyncSaveName {width: 100px;height: 18px }#ao3SyncSavePanel {padding-top: 6px;text-align: center }#ao3SyncSavePanel input {color: #fff }#ao3SyncSavePanel button {color: #ffce00;border: 1px solid #ffce00;text-align: center;background: rgba(8, 48, 78, .9) }.ao3SyncDeleteButton {float: left;width: 14px;height: 14px;border: 1px solid #f33;background: #000;color: #f33;text-align: center;font-weight: 700;margin-right: 8px }.ao3SyncDeleteButton:hover {background: #900 }@media only screen and (max-width:600px) {#ao3SyncBox {top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;box-sizing: border-box;border: 0 }#ao3SyncBox #ao3SyncTopBar {display: none }#ao3SyncBox #ao3SyncLock svg {display: block;position: absolute;left: 50%;top: 50%;margin-left: -25px;margin-top: -25px }#ao3SyncBox #ao3SyncList {clear: both;margin-top: 0;left: 0;top: 0;right: 0;bottom: 0;width: 100%;height: 100%;padding: 8px;box-sizing: border-box;overflow-x: hidden;overflow-y: auto;border-bottom: 0;font-size: 22px !important }#ao3SyncBox #ao3SyncLock {top: 0 }.ao3SyncItem {font-size: 22px }.ao3SyncDeleteButton {width: 22px;height: 22px;font-size: 18px;border: 2px solid #f33 }.ao3SyncBoxSaveMode #ao3SyncList {top: 48px !important;height: calc(100% - 48px) !important }#ao3SyncSavePanel {font-size: 22px }#ao3SyncSavePanel input {font-size: 22px;width: 200px;height: 28px }#ao3SyncSavePanel button {font-size: 20px;height: 28px }}';
        $('<style>').prop('type', 'text/css').html(css).appendTo('head');
    }

    function setupUI() {
        var content = '';

        content += '<div id="ao3SyncBox">';
        content += '    <div id="ao3SyncTopBar">';
        content += '        <a id="ao3SyncMin" class="btn" onclick="window.plugin.ao3Sync.hideBox();return false;" title="Minimize">-</a>';
        content += '        <div class="handle"><div id="ao3SyncTitle" class="ui-dialog-title ui-dialog-title-active">Status</div></div>';
        content += '    </div>';
        content += '    <div id="ao3SyncContent">';
        content += '        <div id="ao3SyncLoadPanel"><input type="checkbox" id="ao3SyncAutoClose" onchange="window.plugin.ao3Sync.onAutoCloseChange()"/> <label for="ao3SyncAutoClose">Close after saving or loading</label> </div>';
        content += '        <div id="ao3SyncSavePanel">Name: <input type="text" id="ao3SyncSaveName"/> <button onclick="window.plugin.ao3Sync.saveFile($(\'#ao3SyncSaveName\').val())">Save</button></div>';
        content += '        <div id="ao3SyncList"></div>';
        content += '    </div>';
        content += '    <div id="ao3SyncAuth"><a onclick="window.plugin.ao3Sync.auth();return false;">Authorize</a></div>';
        content += '    <div id="ao3SyncLock"><svg width="50px" height="50px" viewBox="-103 -16 533 533.33333" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="m293.167969 131.632812v-35.382812h5.222656c12.847656.035156 23.332031-10.269531 23.527344-23.113281v-49.988281c-.191407-12.851563-10.671875-23.164063-23.527344-23.148438h-280.449219c-12.855468-.015625-23.335937 10.296875-23.523437 23.148438v49.988281c.195312 12.84375 10.675781 23.148437 23.523437 23.113281h5.226563v35.382812c-.019531 16.757813 7.617187 32.605469 20.734375 43.03125l94.039062 75.183594-92.191406 71.511719c-13.496094 10.398437-21.386719 26.496094-21.332031 43.539063v38.851562h-6.476563c-12.847656-.035156-23.328125 10.269531-23.523437 23.113281v49.988281c.1875 12.851563 10.667969 23.164063 23.523437 23.148438h280.449219c12.855469.015625 23.335937-10.296875 23.527344-23.148438v-49.988281c-.195313-12.84375-10.679688-23.148437-23.527344-23.113281h-3.972656v-38.605469c-.078125-17.210937-8.140625-33.410156-21.824219-43.851562l-94.066406-71.542969 93.921875-75.089844c13.113281-10.425781 20.746093-26.277344 20.71875-43.027344zm-273.75-106.632812h277.5v46.25h-277.5zm277.5 450h-277.5v-46.25h15.34375c.71875 0 1.445312.203125 2.199219.203125.75 0 1.484374-.203125 2.203124-.203125h240.390626c.714843 0 1.449218.203125 2.199218.203125.753906 0 1.484375-.203125 2.199219-.203125h12.964844zm-27.5-109.855469v38.605469h-220v-38.851562c-.019531-9.3125 4.289062-18.105469 11.671875-23.785157l97.140625-75.351562 99.222656 75.425781c7.484375 5.703125 11.90625 14.550781 11.964844 23.957031zm-12.605469-210.007812-98.621094 78.859375-98.65625-78.859375c-7.179687-5.6875-11.367187-14.34375-11.367187-23.503907v-35.382812h220v35.382812c0 9.160157-4.179688 17.8125-11.355469 23.503907zm0 0"/></svg></div>';
        content += '</div>';

        $('body').append(content);

        debug && console.log('append sync buttons...');
        $('#search').append('<a onclick="window.plugin.ao3Sync.showBox(0);return false;">AO3 Data Load</a>');
        $('#search').append('<a onclick="window.plugin.ao3Sync.showBox(1);return false;">AO3 Data Save</a>');
        debug && console.log('Done!');
    }

    function refreshFilesList(mode) {
        showLock();

        $("#ao3SyncList").html("");

        window.plugin.ao3Sync.getFilesList(function(list) {
            var t = list.slice();

            for(var i=0; i<list.length; i++) {
                var file = list[i];
                if(mode === 0) {
                    $("#ao3SyncList").append("<div class='ao3SyncItem' onclick='window.plugin.ao3Sync.loadFile(\"" + file.name + "\", window.plugin.ao3Sync.autoClose)'><b>" + file.name + "</b></div>");
                }

                if(mode === 1) {
                    $("#ao3SyncList").append("<div class='ao3SyncItem' onclick='window.plugin.ao3Sync.saveFile(\"" + file.name + "\", window.plugin.ao3Sync.autoClose)'><div class='ao3SyncDeleteButton' onclick='window.plugin.ao3Sync.deleteFile(\"" + file.name + "\"); event.cancelBubble=true;'>X</div><b>" + file.name + "</b></div>");
                }
            }

            hideLock();
        });
        $("#ao3SyncList").show();
    }

    function showLock() {
        $("#ao3SyncLock").show();
    }

    function hideLock() {
        $("#ao3SyncLock").hide();
    }

    function showBox(mode) {
        if(!window.plugin.ao3Sync.isReady()) return;

        var title = "";

        if(mode === 0) {
            title = "AO3 Data Load";
            $("#ao3SyncLoadPanel").show();
            $("#ao3SyncSavePanel").hide();

            $("#ao3SyncBox").attr('class', 'ao3SyncBoxLoadMode');
        }
        else {
            title = "AO3 Data Save";
            $("#ao3SyncLoadPanel").hide();
            $("#ao3SyncSavePanel").show();

            $("#ao3SyncBox").attr('class', 'ao3SyncBoxSaveMode');
        }

        $('#ao3SyncTopBar').show();
        $("#ao3SyncBox").show();
        $("#ao3SyncTitle").html(title);

        if(dataStorage.authorized) {
            $("#ao3SyncAuth").hide();
            $("#ao3SyncList").hide();
            $("#ao3SyncContent").show();

            refreshFilesList(mode);
        }
        else {
            $("#ao3SyncAuth").show();
            $("#ao3SyncContent").hide();
            $("#ao3SyncList").hide();
        }

        if(window.orientation > 1) $("#ao3SyncLoadPanel").hide();
    }

    function hideBox() {
        $("#ao3SyncBox").hide();
    }

    function saveOptions() {
        localStorage['ao3-sync-options'] = JSON.stringify(options);
    }

    function saveToken() {
        localStorage['ao3-sync-token'] = JSON.stringify(gapi.client.getToken());
    }

    function importData(data){
        if (!(data && typeof data === 'object' && data.constructor === Object)){
            try {
                data = JSON.parse(data);
            } catch (error) {
                console.log(error);
                console.log('Unable to load AO3 data', data);
                return;
            }
        }

        for (const key in data){
            localStorage[key] = data[key];
        }
    }

    function saveBoxPosition() {
        if($('#ao3SyncBox').css('display') === 'none') return;

        options.boxPositionX = parseInt($('#ao3SyncBox').css('left'));
        options.boxPositionY = parseInt($('#ao3SyncBox').css('top'));

        saveOptions();
    }

    function setup() {
        if(!window.plugin.ao3Sync) return;
        debug && console.log('setup: after check for window.plugin.ao3Sync');

        try {options = JSON.parse(localStorage['ao3-sync-options'])}
        catch(e) {}

        setupCSS();
        setupUI();

        $("#ao3SyncAutoClose").prop('checked', !!options.autoClose);
        $("#ao3SyncSaveName").val(options.lastSave || 'default');

        if(options.boxPositionX !== undefined) $('#ao3SyncBox').css('left', options.boxPositionX + 'px');
        if(options.boxPositionY !== undefined) $('#ao3SyncBox').css('top', options.boxPositionY + 'px');

        dataStorage = new GoogleDriveStorage(CLIENT_ID, API_KEY, SCOPE, DISCOVERY_DOC);
        window.plugin.ao3Sync.dataStorage = dataStorage;

        dataStorage.init(function() {
            dataStorage.load(false, function(authorized) {
                ready = true;
            });
        });

        window.plugin.ao3Sync.isReady = function() {
            return !!(window.plugin.ao3Sync && ready);
        };

        window.plugin.ao3Sync.auth = function() {
            dataStorage.authorize(false, function(authorized) {
                ready = true;
                hideBox();
            });
        };

        window.plugin.ao3Sync.getFilesList = function(callback) {
            dataStorage.getFilesList(function(res) {
                var list = [];
                for(var i=0; i<res.length; i++) {
                    var file = res[i];
                    var parts = file.name.split('.');
                    if(parts.pop() === dataFileExt) {
                        list.push({
                            id: file.id,
                            name: parts.join('.')
                        });
                    }
                }
                if(callback) callback(list);
            });
        };

        window.plugin.ao3Sync.saveFile = function(name, callback) {
            if(typeof name !== "string") return;
            name = name.trim();

            if(name === '') {
                alert('Name cannot be empty');
                return;
            }

            var data = localStorage;
            if(!data.kudoshistory_username) {
                alert('AO3 userscript data is empty');
                return;
            }

            data = JSON.stringify(data);

            showLock();

            dataStorage.findFile(fixDataFileName(name), function(file) {
                if(file) {
                    if(!confirm("Override " + name + " save?")) {
                        hideLock();
                        return;
                    }
                }

                $('#ao3SyncSaveName').val(name);

                dataStorage.saveFileByName(fixDataFileName(name), data, function() {
                    if(!window.orientation > 1 && options.autoClose) {
                        hideBox();
                    }
                    else {
                        refreshFilesList(1);
                    }

                    options.lastSave = name;
                    saveOptions();

                    if(callback) callback();
                });
            });
        };

        window.plugin.ao3Sync.loadFile = function(name, callback) {
            showLock();

            dataStorage.findFile(fixDataFileName(name), function(file) {
                if(!file) {
                    alert("File " + name + " not found");
                    hideLock();
                    return;
                }

                dataStorage.readFile(file.id, function(data) {
                    if(data && data.result) {
                        importData(data.result);
                    }
                    else {
                        alert("Error while loading file " + name);
                    }

                    hideLock();

                    if(callback) callback();
                });
            });
        };

        window.plugin.ao3Sync.deleteFile = function(name, callback) {
            if(!confirm("Really delete " + name + " save?")) return;

            showLock();

            dataStorage.findFile(fixDataFileName(name), function(file) {
                if(!file) {
                    alert("File " + name + " not found");
                    return;
                }

                dataStorage.deleteFile(file.id, function() {
                    refreshFilesList(1);
                    if(callback) callback();
                });
            });
        };

        window.plugin.ao3Sync.autoClose = function() {
            if (options.autoClose){
                hideBox();
            }
        }

        window.plugin.ao3Sync.onAutoCloseChange = function() {
            options.autoClose = $("#ao3SyncAutoClose").prop('checked');
            saveOptions();
        };

        window.plugin.ao3Sync.showBox = showBox;
        window.plugin.ao3Sync.hideBox = hideBox;

        setInterval(saveBoxPosition, 1000);
    }

    setup.priority = 'high';

    setup.info = plugin_info; //add the script info data to the function as a property
    if(!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
    if(typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

