// ==UserScript==
// @name         Pleroma Backup
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Go to https://YOUR_INSTANCE/main/friends, F12, type in console `backupPleroma()` (without the quotes), Enter.
// @author       gudzpoz
// @match        https://*/main/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/442817/Pleroma%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/442817/Pleroma%20Backup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function download(url) {
        console.log(url)
    }

    window.backupPleroma = () => {
        var req = indexedDB.open('localforage')
        req.onsuccess = event => {
            var db = event.target.result
            var transaction = db.transaction(['keyvaluepairs'])
            var store = transaction.objectStore('keyvaluepairs')
            var request = store.get('vuex-lz')
            request.onsuccess = event => {
                var token = request.result.oauth.userToken
                fetch('/api/v1/pleroma/backups').then(res => res.json()).then(json => {
                    if (json.length === 0 || (Date.now() - new Date(json[json.length - 1].inserted_at)) / 1000 / 60 / 60 / 24 > 7) {
                        fetch('/api/v1/pleroma/backups', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        }).then(res => res.json()).then(archive => {
                            download(archive[archive.length - 1].url)
                        })
                    } else {
                        download(json[json.length - 1].url)
                    }
                })
            }
        }
    }
})()