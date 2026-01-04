// ==UserScript==
// @name         AOTY :: Hide Upcoming Album Releases
// @namespace    https://greasyfork.org/en/scripts/380729-aoty-hide-upcoming-album-releases
// @version      2.0
// @description  Click release covers on Upcoming Album Release pages to hide the releases (while pressing modifier keys.) Toggle hidden releases between hidden and shown, highlighted by color. Automatically advance to the next page if the current page is empty.
// @author       newstarshipsmell
// @match        https://www.albumoftheyear.org/upcoming/*
// @icon         data:image/png;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/380729/AOTY%20%3A%3A%20Hide%20Upcoming%20Album%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/380729/AOTY%20%3A%3A%20Hide%20Upcoming%20Album%20Releases.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scriptWait = 500;
    var s = GM_getValue('AOTYHideReleases', {hidden: true, color: '#7f0000', advance: false, keys: {alt: false, ctrl: false, meta: false, shift: true}});
    GM_setValue('AOTYHideReleases', s);
    var hidden = s.hidden;

    function addButtonsSettings() {
        if (!bGbl_ChangeEventListenerInstalled)
        {
            bGbl_ChangeEventListenerInstalled = true;
            document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
        }

        if (document.getElementById('hide_releases_settings_link') === null) {
            var divnav = document.querySelector('div#nav div#content');
            divnav.innerHTML = '<div id="toggle_hidden" class="navBlock"><a href="javascript:void(0);">[' + (hidden ? 'Show' : 'Hide') + ' Hidden]</a></div><div id="hide_releases_settings_link" class="navBlock"><a href="javascript:void(0);">[Open Settings]</a></div>' + divnav.innerHTML;
            var wideLeft = document.querySelector('div.wideLeft');
            wideLeft.innerHTML = formSettings() + wideLeft.innerHTML;

            var toggleLink = document.querySelector('#toggle_hidden a');
            toggleLink.onclick = function() {
                hidden = hidden ? false : true;
                toggleLink.textContent = '[' + (hidden ? 'Show' : 'Hide') + ' Hidden]';
                hideReleases();
            };

            var settingsDiv = document.getElementById('hide_releases_settings');
            var settingsLink = document.querySelector('#hide_releases_settings_link a');
            settingsLink.onclick = function() {
                if (settingsLink.textContent == '[Open Settings]') {
                    settingsLink.textContent = '[Close Settings]';
                    settingsDiv.style.display = '';
                    var hiddenReleases = GM_getValue('AOTYHiddenReleases', {});
                    document.getElementById('hide_hidden').checked = s.hidden === undefined ? true : s.hidden;
                    document.getElementById('auto_advance').checked = s.advance === undefined ? false : s.advance;
                    document.getElementById('alt_key').checked = s.keys.alt === undefined ? true : s.keys.alt;
                    document.getElementById('ctrl_key').checked = s.keys.ctrl === undefined ? true : s.keys.ctrl;
                    document.getElementById('meta_key').checked = s.keys.meta === undefined ? true : s.keys.meta;
                    document.getElementById('shift_key').checked = s.keys.shift === undefined ? true : s.keys.shift;
                    document.getElementById('hidden_color').value = s.color === undefined ? '#7f0000' : s.color;
                    document.getElementById('hidden_releases').value = sortReleases(hiddenReleases);
                } else {
                    settingsLink.textContent = '[Open Settings]';
                    settingsDiv.style.display = 'none';
                }
            };

            var settingsSave = document.getElementById('save_settings');
            settingsSave.onclick = function() {
                s.hidden = document.getElementById('hide_hidden').checked;
                s.advance = document.getElementById('auto_advance').checked;
                s.keys.alt = document.getElementById('alt_key').checked;
                s.keys.ctrl = document.getElementById('ctrl_key').checked;
                s.keys.meta = document.getElementById('meta_key').checked;
                s.keys.shift = document.getElementById('shift_key').checked;
                s.color = document.getElementById('hidden_color').value;
                GM_setValue('AOTYHideReleases', s);

                var hiddenReleases = {};
                var hidden_releases = document.getElementById('hidden_releases').value.split(/\n/);
                for (var i = 0, l = hidden_releases.length; i < l; i++) {
                    if (/^\d+: .+ - .+ \(.+\)$/.test(hidden_releases[i])) {
                        hiddenReleases[hidden_releases[i].split(':')[0]] = hidden_releases[i].split(/^\d+:/)[1];
                    }
                }
                GM_setValue('AOTYHiddenReleases', hiddenReleases);
                settingsLink.textContent = '[Open Settings]';
                settingsDiv.style.display = 'none';
            };
        }

        document.onclick = function(e) {
            var matchingKeys = e.altKey === s.keys.alt && e.ctrlKey === s.keys.ctrl && e.metaKey === s.keys.meta && e.shiftKey === s.keys.shift ? true : false;
            var clickedNoCover = e.target.tagName == 'DIV' && e.target.classList == 'noCover' && e.target.parentNode.parentNode.parentNode.tagName == 'DIV' && e.target.parentNode.parentNode.parentNode.classList.contains('albumBlock') ? true : false;
            var clickedPlaceholder = e.target.tagName == 'I' && e.target.classList == 'fa-light fa-record-vinyl' && e.target.parentNode.parentNode.parentNode.parentNode.tagName == 'DIV' && e.target.parentNode.parentNode.parentNode.parentNode.classList.contains('albumBlock') ? true : false;
            var clickedImageCover = e.target.tagName == 'IMG' && (e.target.classList == ' lazyloading' || e.target.classList == ' lazyloaded') && e.target.parentNode.parentNode.parentNode.tagName == 'DIV' && e.target.parentNode.parentNode.parentNode.classList.contains('albumBlock') ? true : false;
            if (matchingKeys && (clickedNoCover || clickedPlaceholder || clickedImageCover)) {
                e.preventDefault();
                console.log("click conditions satisfied");

                var hiddenReleases = GM_getValue('AOTYHiddenReleases', {});
                var release = e.target.tagName == 'I' ? e.target.parentNode.parentNode.parentNode.parentNode : e.target.parentNode.parentNode.parentNode;
                var releaseID = release.querySelector('div.image > a').href.split('/album/')[1].split('-')[0];

                if (hiddenReleases[releaseID] === undefined) {
                    var artist = release.querySelector('div.artistTitle').textContent;
                    var album = release.querySelector('div.albumTitle').textContent;
                    var relDate = release.querySelector('div.type');
                    relDate = relDate === null ? 'N/A' : relDate.textContent;
                    hiddenReleases[releaseID] = artist + ' - ' + album + ' (' + relDate + ')';
                } else {
                    hiddenReleases[releaseID] = undefined;
                }
                GM_setValue('AOTYHiddenReleases', hiddenReleases);
                hideReleases();
            }
        };

        hideReleases();
    }

    function hideReleases() {
        var hiddenReleases = GM_getValue('AOTYHiddenReleases', {});
        var releases = document.querySelectorAll('div.wideLeft div.albumBlock');
        var releaseID, unhidden = 0;

        for (var i = 0, l = releases.length; i < l; i++) {
            releaseID = releases[i].querySelector('div.image > a').href.split('/album/')[1].split('-')[0];
            if (hiddenReleases[releaseID] === undefined) {
                releases[i].style['background-color'] = '';
                releases[i].style.display = '';
                unhidden++;
            } else {
                releases[i].style['background-color'] = hidden ? '' : s.color;
                releases[i].style.display = hidden ? 'none' : '';
            }
        }

        if (s.advance && ((unhidden == 0 && hidden)) || releases.length == 0) {
            var next = document.querySelector('div.pageSelect.next');
            if (next !== null) next.click();
        }
    }

    function formSettings() {
        var str = '<div id="hide_releases_settings" style="display: none"><span>';
        str += '<input type="checkbox" id="hide_hidden"><label for="hide_hidden">|Hide hidden releases on page load</label>||||';
        str += '<input type="checkbox" id="auto_advance"><label for="auto_advance">|Automatically advance to the next page if empty</label>||||';
        str += '<strong>Modifier keys:</strong>||<input type="checkbox" id="alt_key"><label for="alt_key">|Alt</label>||<input type="checkbox" id="ctrl_key"><label for="ctrl_key">|Ctrl</label>||';
        str += '<input type="checkbox" id="meta_key"><label for="meta_key">|Meta/Win</label>||<input type="checkbox" id="shift_key"><label for="shift_key">|Shift</label><br><br>';
        str += '<input type="color" id="hidden_color" value="#7f0000"><label for="hidden_color">||Hidden Release color</label>';
        str += '<button id="save_settings" style="float: right;">Save Settings</button><br><br>';
        str += '<label for="hidden_releases"><strong>Hidden Releases:</strong></label>||||<button id="sort_by_date">Sort By Date</button><br><br><textarea id="hidden_releases" spellcheck="false" wrap="off" style="color:#7f7f7f; background-color: #000000;" rows="20" cols="64"></textarea>';
        str += '</span><br><br></div>';
        str = str.replace(/\|/g, '\u00A0');
        return str;
    }

    function sortReleases(rel) {
        var relSort = [];

        for (var k in rel) {
            if (!rel.hasOwnProperty(k)) continue;
            relSort.push(k + ': ' + rel[k]);
        }

        relSort.sort(function(a, b){
            var ma = /.+ - .+ \(N\/A\)$/.test(a) ?
                12 : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(a.replace(/.+ \(([A-Z][a-z]{2})( \d+)?\)$/, '$1'));
            var mb = /.+ - .+ \(N\/A\)$/.test(b) ?
                12 : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(b.replace(/.+ \(([A-Z][a-z]{2})( \d+)?\)$/, '$1'));
            if (ma < mb) {return -1;}
            if (ma > mb) {return 1;}

            var da = a.replace(/.+ \([A-Z][a-z]{2}( \d+)?\)$/, '$1');
            var db = b.replace(/.+ \([A-Z][a-z]{2}( \d+)?\)$/, '$1');
            da = da == '' ? 0 : parseInt(da);
            db = db == '' ? 0 : parseInt(db);
            if (da < db) {return -1;}
            if (da > db) {return 1;}

            var aa = a.replace(/\d+: (.+) - .+ \(.+\)/, '$1');
            var ab = b.replace(/\d+: (.+) - .+ \(.+\)/, '$1');
            if (aa < ab) {return -1;}
            if (aa > ab) {return 1;}

            var ia = a.replace(/(\d+): .+/, '$1');
            var ib = b.replace(/(\d+): .+/, '$1');
            if (ia < ib) {return -1;}
            if (ia > ib) {return 1;}

            return 0;
        });

        return relSort.join('\n');
    }

    function HandleDOM_ChangeWithDelay(zEvent) {
        if (typeof zGbl_DOM_ChangeTimer == "number")
        {
            clearTimeout (zGbl_DOM_ChangeTimer);
            zGbl_DOM_ChangeTimer = '';
        }
        zGbl_DOM_ChangeTimer = setTimeout (function() { addButtonsSettings(); }, scriptWait);
    }

    var zGbl_DOM_ChangeTimer = '';
    var bGbl_ChangeEventListenerInstalled = false;

    window.addEventListener ("load", addButtonsSettings, false);
})();