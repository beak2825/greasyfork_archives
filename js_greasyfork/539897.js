// ==UserScript==
// @name         Bandcamp :: Hide Releases and Blacklist Artists on Discover Pages
// @namespace    https://greasyfork.org/en/scripts/539897-bandcamp-hide-releases-and-blacklist-artists-on-discover-pages
// @version      1.0.3
// @description  Click release titles on Discover pages to hide them (while pressing modifier keys), blacklist artists on their pages to hide their releases on Discover pages, and hide merch/t-shirts as well. Toggle hidden releases between hidden and shown, highlighted with colors.
// @author       newstarshipsmell
// @include      https://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIbSURBVFhH7ZY7TsNAEIYTEqWgSQUNwSBxA65ASwsNBSCQ6OEQ9CmhSEJ6zoCASFBChTgAB6Djzf/ZM84aSCTw0mWkT5usPfPvrGcflYlNbJzNdy9CaqIemZpJfbekKF4Nftsb/2wulvQuaRntmtgVW2I7Ajtiw+SKlnQl2jlHmGmnXRUf4s3asnictkkWTQ9S5jSIhZMB039tDk/ipSTPglj3ommSQ1NnJekPwuw3BQ6v1pbF4+wJUw2MTlG1bz8t7gQOMabfY9wofmNBGgXTA4eioz0QODB1YaC/4tmvC+IPlyGjsU5fcrPiQeDwbm0ZXPysRYF3zlOd3PjT6qaV79kfChxiZe9JrAjipzWWWnKSZz9l7ZJ4FKFjGTz7UxHqZAPghxWdV/6xCB1jwEwui3wAaLpw3il4Kda0gydxJIhfc808+/leYQBMU+hYBv98fE4+a66T9AbBAIZTT4HgEGvL9ZmkoIlfb2VtJo7xR51Vtl39PhM4xMyepTwjiJ8uvfTbu6nDs2dzwCFW4Xn2+4L4vrxN2UyHDSNq6MGtwCHmlss2Pm1FV9x43OgUHAw4xMre43CQEb+22A8qPzR1NgVHIw4clUxdGTiyiXXFUZ5uu9kgTPGL6UHbHGJVvhcflxjie42Z4hfTgw3B9eina9Nv4brGtY3rWz1RfakdLR7bXMzwU1VFPmYAeoEpYonEJJ92mNjERlul8gnmuFSVmyqDsQAAAABJRU5ErkJggg==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/539897/Bandcamp%20%3A%3A%20Hide%20Releases%20and%20Blacklist%20Artists%20on%20Discover%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/539897/Bandcamp%20%3A%3A%20Hide%20Releases%20and%20Blacklist%20Artists%20on%20Discover%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scriptWait = 250;
    var logging = false;
    var faviconSelect = 'head link[rel="image_src"][href^="https://f4.bcbits.com/img/"]';
    var bandNameLocationSelect = 'div#rightColumn div#bio-container p#band-name-location';
    var artistNameSelect = 'p#band-name-location span.title';
    if (logging) console.log("[" + GM_info.script.name + "]:\nRunning!");

    var artistBlacklist = GM_getValue('BandcampArtistBlacklist');
    artistBlacklist = artistBlacklist === undefined ? {} : artistBlacklist;
    GM_setValue('BandcampArtistBlacklist', artistBlacklist);

    if (/^https:\/\/bandcamp\.com\/discover.*/.test(location.href)) {
        var hiddenReleases = GM_getValue('BandcampHiddenReleases');
        hiddenReleases = hiddenReleases === undefined ? {} : hiddenReleases;
        GM_setValue('BandcampHiddenReleases', hiddenReleases);

        var settings = GM_getValue('BandcampHideReleasesSettings');
        settings = settings === undefined ? {} : JSON.parse(settings);
        settings.hide = settings.hide === undefined ? true : settings.hide;
        settings.merch = settings.merch === undefined ? true : settings.merch;
        settings.note = settings.note === undefined ? true : settings.note;
        settings.viewmore = settings.viewmore === undefined ? false : settings.viewmore;
        settings.hotkeys = settings.hotkeys === undefined ? {ctrl: false, meta: false, alt: false, shift: true} : settings.hotkeys;
        settings.colors = settings.colors === undefined ? {hide: '#7f7f00', black: '#7f0000', both: '#7f5f00', merch: '#3f007f', text: '#7f7f7f', back: '#000000'} : settings.colors;
        GM_setValue('BandcampHideReleasesSettings', JSON.stringify(settings));

        var header = document.querySelector('div.tag-search-desktop-container');
        var headerNote = document.createElement('span');
        headerNote.innerHTML = settings.note ? formHeaderNote(settings.hotkeys.ctrl, settings.hotkeys.meta, settings.hotkeys.alt, settings.hotkeys.shift) : '\u00A0\u00A0';
        header.appendChild(headerNote);

        var toggleBtn = document.createElement('button');
        toggleBtn.id = 'hide-show';
        toggleBtn.classList.add('g-button', 'sm', 'outline', 'dark-mode', 'follow-button');
        toggleBtn.setAttribute('data-v-922c8136', '');
        toggleBtn.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
        header.appendChild(toggleBtn);

        var settingsBtn = document.createElement('button');
        settingsBtn.id = 'userscript-settings';
        settingsBtn.classList.add('g-button', 'sm', 'outline', 'dark-mode', 'follow-button');
        settingsBtn.setAttribute('data-v-922c8136', '');
        settingsBtn.textContent = 'Open Settings';
        header.appendChild(settingsBtn);

        var settingsDiv = document.createElement('div');
        settingsDiv.innerHTML = formSettings();
        settingsDiv.id = 'userscript_settings';
        settingsDiv.style.display = 'none';
        header.parentNode.appendChild(settingsDiv);
        var saveSettingsBtn = document.getElementById('save_settings');

        var headerFloat = document.querySelector('div.spacer');
        var headerFloatNote = document.createElement('span');
        headerFloatNote.innerHTML = settings.note ? formHeaderNote(settings.hotkeys.ctrl, settings.hotkeys.meta, settings.hotkeys.alt, settings.hotkeys.shift) : '\u00A0\u00A0';
        headerFloat.appendChild(headerFloatNote);

        var toggleFloatBtn = document.createElement('button');
        toggleFloatBtn.id = 'hide-show-float';
        toggleFloatBtn.classList.add('g-button', 'sm', 'outline', 'dark-mode', 'follow-button');
        toggleFloatBtn.setAttribute('data-v-922c8136', '');
        toggleFloatBtn.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide All Releases';
        headerFloat.appendChild(toggleFloatBtn);

        settingsBtn.addEventListener('click', function(){
            settingsDiv.style.display = settingsDiv.style.display == 'none' ? '' : 'none';
            this.textContent = settingsDiv.style.display == 'none' ? 'Open Settings' : 'Close Settings';
            if (this.textContent == 'Close Settings') {
                var currentHide = settings.hide;
                settings = GM_getValue('BandcampHideReleasesSettings');
                settings = settings === undefined ? {} : JSON.parse(settings);
                settings.hide = settings.hide === undefined ? true : settings.hide;
                settings.note = settings.note === undefined ? true : settings.note;
                settings.viewmore = settings.viewmore === undefined ? false : settings.viewmore;
                settings.hotkeys = settings.hotkeys === undefined ? {ctrl: false, meta: false, alt: false, shift: true} : settings.hotkeys;
                settings.colors = settings.colors === undefined ? {hide: '#7f7f00', black: '#7f0000', both: '#7f3f00', merch: '#000000', text: '#7f7f7f', back: '#000000'} : settings.colors;
                document.getElementById('hide_releases').checked = settings.hide;
                document.getElementById('hide_merch').checked = settings.merch;
                document.getElementById('show_note').checked = settings.note;
                document.getElementById('view_more').checked = settings.viewmore;
                document.getElementById('click_ctrl').checked = settings.hotkeys.ctrl;
                document.getElementById('click_meta').checked = settings.hotkeys.meta;
                document.getElementById('click_alt').checked = settings.hotkeys.alt;
                document.getElementById('click_shift').checked = settings.hotkeys.shift;
                document.getElementById('color_hide').value = settings.colors.hide;
                document.getElementById('color_black').value = settings.colors.black;
                document.getElementById('color_both').value = settings.colors.both;
                document.getElementById('color_merch').value = settings.colors.merch;
                var colorText = document.getElementById('color_text');
                colorText.value = settings.colors.text;
                var colorBack = document.getElementById('color_back');
                colorBack.value = settings.colors.back;
                var hiddenText = document.getElementById('hidden_releases');
                hiddenText.value = JSON.stringify(hiddenReleases, null, 4).slice(2, -2).replace(/^\s{4}"(.+?),?$/gm, '$1')/*(/^\s{4}"(.+?)": "(.+?)",?$/gm, '$1:\t$2')*/;
                hiddenText.style['background-color'] = settings.colors.back;
                hiddenText.style.color = settings.colors.text;
                var blacklistText = document.getElementById('blacklisted_artists');
                blacklistText.value = JSON.stringify(artistBlacklist, null, 4).slice(2, -2).replace(/^\s{4}(.+?),?$/gm, '$1')/*(/^\s{4}"(.+?)": "(.+?)",?$/gm, '$1:\t$2')*/;
                blacklistText.style['background-color'] = settings.colors.back;
                blacklistText.style.color = settings.colors.text;
                colorText.addEventListener('change', function(e){
                    hiddenText.style.color = this.value;
                    blacklistText.style.color = this.value;
                });
                colorBack.addEventListener('change', function(e){
                    hiddenText.style['background-color'] = this.value;
                    blacklistText.style['background-color'] = this.value;
                });
                headerNote.innerHTML = settings.note ? formHeaderNote(settings.hotkeys.ctrl, settings.hotkeys.meta, settings.hotkeys.alt, settings.hotkeys.shift) : '\u00A0\u00A0';
                headerFloatNote.innerHTML = settings.note ? formHeaderNote(settings.hotkeys.ctrl, settings.hotkeys.meta, settings.hotkeys.alt, settings.hotkeys.shift) : '\u00A0\u00A0';
                settings.hide = currentHide;
            }
        });

        saveSettingsBtn.addEventListener('click', function(){
            var currentHide = settings.hide;
            settings.hide = document.getElementById('hide_releases').checked;
            settings.merch = document.getElementById('hide_merch').checked;
            settings.note = document.getElementById('show_note').checked;
            settings.viewmore = document.getElementById('view_more').checked;
            settings.hotkeys.ctrl = document.getElementById('click_ctrl').checked;
            settings.hotkeys.meta = document.getElementById('click_meta').checked;
            settings.hotkeys.alt = document.getElementById('click_alt').checked;
            settings.hotkeys.shift = document.getElementById('click_shift').checked;
            settings.colors.hide = document.getElementById('color_hide').value;
            settings.colors.black = document.getElementById('color_black').value;
            settings.colors.both = document.getElementById('color_both').value;
            settings.colors.merch = document.getElementById('color_merch').value;
            settings.colors.text = document.getElementById('color_text').value;
            settings.colors.back = document.getElementById('color_back').value;

            /*
            var parsedHidden = true;
            var parsedHiddenReleases;
            try {
                parsedHiddenReleases = JSON.parse(document.getElementById('hidden_releases').value);
                for (var k in parsedHiddenReleases) {
                    if (!/^[0-9]+$/.test(k) || !/^https:\/\/[^\/]+\/(album|track)\/.+$/.test(parsedHiddenReleases[k])) {
                        parsedHidden = false;
                        break;
                    }
                }
            } catch(e){
                parsedHidden = false;
            }
            if (parsedHidden) {
                hiddenReleases = parsedHiddenReleases;
                GM_setValue('BandcampHiddenReleases', hiddenReleases)
            } else {
                alert('Hidden Releases: Didn't parse correctedly; not saved.');
            }

            var parsedBlacklisted = true;
            var parsedBlacklistedReleases;
            try {
                parsedBlacklistedReleases = JSON.parse(document.getElementById('blacklisted_artists').value);
                for (var k in parsedBlacklistedReleases) {
                    if (!/^https:\/\/[^\/]+$/.test(k) || !/^.+$/.test(parsedBlacklistedReleases[k])) {
                        parsedBlacklisted = false;
                        break;
                    }
                }
            } catch(e){
                parsedBlacklisted = false;
            }
            if (parsedBlacklisted) {
                artistBlacklist = parsedBlacklistedReleases;
                GM_setValue('BandcampArtistBlacklist', artistBlacklist)
            } else {
                alert('Blacklisted Artists: Didn't parse correctedly; not saved.');
            }
            */

            GM_setValue('BandcampHideReleasesSettings', JSON.stringify(settings));

            settingsDiv.style.display = 'none';
            settingsBtn.textContent = 'Open Settings';
            headerNote.innerHTML = settings.note ? formHeaderNote(settings.hotkeys.ctrl, settings.hotkeys.meta, settings.hotkeys.alt, settings.hotkeys.shift) : '\u00A0\u00A0';
            headerFloatNote.innerHTML = settings.note ? formHeaderNote(settings.hotkeys.ctrl, settings.hotkeys.meta, settings.hotkeys.alt, settings.hotkeys.shift) : '\u00A0\u00A0';
            settings.hide = currentHide;
            toggleBtn.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
            toggleFloatBtn.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
            alert('Settings have been saved!');
            hideReleases();
        });

        toggleBtn.addEventListener('click', function(){
            settings.hide = settings.hide ? false : true;
            this.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
            toggleFloatBtn.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
            hideReleases();
        });

        toggleFloatBtn.addEventListener('click', function(){
            settings.hide = settings.hide ? false : true;
            this.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
            toggleBtn.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
            hideReleases();
        });

        GM_addValueChangeListener('BandcampHiddenReleases', function(name, old_value, new_value, remote) {
            if (remote) {
                hiddenReleases = new_value;
                hideReleases();
            }
        });

        GM_addValueChangeListener('BandcampArtistBlacklist', function(name, old_value, new_value, remote) {
            if (remote) {
                artistBlacklist = new_value;
                hideReleases();
            }
        });

        GM_addValueChangeListener('BandcampHideReleasesSettings', function(name, old_value, new_value, remote) {
            if (remote) {
                var currentHide = settings.hide;
                settings = JSON.parse(new_value);
                headerNote.innerHTML = settings.note ? formHeaderNote(settings.hotkeys.ctrl, settings.hotkeys.meta, settings.hotkeys.alt, settings.hotkeys.shift) : '\u00A0\u00A0';
                headerFloatNote.innerHTML = settings.note ? formHeaderNote(settings.hotkeys.ctrl, settings.hotkeys.meta, settings.hotkeys.alt, settings.hotkeys.shift) : '\u00A0\u00A0';
                settings.hide = currentHide;
                toggleBtn.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
                toggleFloatBtn.textContent = settings.hide ? 'Show Hidden Releases' : 'Hide Hidden Releases';
                hideReleases();
            }
        });

        document.addEventListener('click', function(e) {
            if (e.altKey === settings.hotkeys.alt && e.ctrlKey === settings.hotkeys.ctrl && e.shiftKey === settings.hotkeys.shift && e.metaKey === settings.hotkeys.meta &&
                e.target.parentNode.tagName == 'A' && e.target.parentNode.parentNode.parentNode.parentNode.tagName == 'LI' && e.target.parentNode.parentNode.parentNode.parentNode.classList.contains('results-grid-item')) {
                e.preventDefault();
                var releaseURL = e.target.parentNode.href.split('?')[0];
                var releaseID = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-test').split('results-grid-item-')[1];

                hiddenReleases = GM_getValue('BandcampHiddenReleases');
                hiddenReleases[releaseID] = hiddenReleases[releaseID] === undefined ? releaseURL : undefined;

                GM_setValue('BandcampHiddenReleases', hiddenReleases);
                hideReleases();
            }
        });

        var observer = new MutationObserver(resetTimer);
        var timer = setTimeout(action, scriptWait, observer); // wait for the page to stay still for 1 second / scriptWait
        observer.observe(document, {childList: true, subtree: true});

    } else {//not on a bandcamp discover page; check if it's a bandcamp artist/label/release page...
        var favicon = document.querySelector(faviconSelect);
        if (favicon === null) {//check if the favicon for the page is Bandcamp's favicon; if not, return/do nothing
            if (logging) console.log("[" + GM_info.script.name + "]:\nDidn't find Bandcamp favicon. Aborting!");
            return;
        }

        var bandNameLocation = document.querySelector(bandNameLocationSelect);
        if (bandNameLocation === null) {//check that a rightcolumn containing an artist bio with a band name/location exists; if not, return/do nothing
            if (logging) console.log("[" + GM_info.script.name + "]:\nDidn't find Bandcamp Artist name/location. Aborting!");
            return;
        }

        artistBlacklist = GM_getValue('BandcampArtistBlacklist');
        var artistName = document.querySelector(artistNameSelect).textContent.trim();
        var artistURL = 'https://' + location.href.split('/')[2];
        var blacklisted = artistBlacklist[artistURL] === undefined ? false : true;

        var blacklistBtn = document.createElement('button');
        blacklistBtn.id = 'toggle-blacklist';
        blacklistBtn.type = 'button';
        blacklistBtn.classList.add('follow-unfollow', 'compound-button');
        if (blacklisted) blacklistBtn.classList.add('following');
        blacklistBtn.innerHTML = '<div>' + (blacklisted ? 'Whitelist' : 'Blacklist') + '</div>';
        blacklistBtn.title = blacklisted ? 'Click to remove this artist from the Artist Blacklist on the Discover pages.\nAny releases from this artist will be displayed unless individually hidden.'
        : 'Click to add this artist to the Artist Blacklist on the Discover pages.\nAll releases from this artist will be hidden.';

        var followBtn = document.querySelector('button#follow-unfollow');
        followBtn.parentNode.appendChild(document.createElement('br'));
        followBtn.parentNode.appendChild(document.createElement('br'));
        followBtn.parentNode.appendChild(blacklistBtn);

        blacklistBtn.addEventListener('click', function() {
            artistBlacklist = GM_getValue('BandcampArtistBlacklist');
            if (!confirm((blacklisted ? 'Remove' : 'Add') + ' this artist/domain ' + (blacklisted ? 'from' : 'to') + ' the Artist Blacklist?\n\n"' + artistName + '"\n(' + artistURL + ')\n\nAll of this artist\'s releases will be ' + (blacklisted ? 'displayed' : 'hidden') +
                         ' on the Discover pages' + (blacklisted ? ', excepting those releases which have been individually hidden.' : '.'))) {
                return;
            }
            if (blacklisted) {
                blacklisted = false;
                artistBlacklist[artistURL] = undefined;
            } else {
                blacklisted = true;
                artistBlacklist[artistURL] = artistName;
            }

            if (blacklisted) {
                this.classList.add('following');
            } else {
                this.classList.remove('following');
            }

            this.innerHTML = '<div>' + (blacklisted ? 'Whitelist' : 'Blacklist') + '</div>';
            this.title = blacklisted ? 'Click to remove this artist from the Artist Blacklist on the Discover pages.\nAny releases from this artist will be displayed unless individually hidden.'
            : 'Click to add this artist to the Artist Blacklist on the Discover pages.\nAll releases from this artist will be hidden.';

            GM_setValue('BandcampArtistBlacklist', artistBlacklist);
        });

        GM_addValueChangeListener('BandcampArtistBlacklist', function(name, old_value, new_value, remote) {
            if (remote) {
                artistBlacklist = new_value;
                blacklisted = artistBlacklist[artistURL] === undefined ? false : true;

                if (blacklisted) {
                    blacklistBtn.classList.add('following');
                } else {
                    blacklistBtn.classList.remove('following');
                }

                blacklistBtn.innerHTML = '<div>' + (blacklisted ? 'Whitelist' : 'Blacklist') + '</div>';
                blacklistBtn.title = blacklisted ? 'Click to remove this artist from the Artist Blacklist on the Discover pages.\nAny releases from this artist will be displayed unless individually hidden.'
                : 'Click to add this artist to the Artist Blacklist on the Discover pages.\nAll releases from this artist will be hidden.';
            }
        });
    }

    // reset timer every time something changes
    function resetTimer(changes, observer) {
        clearTimeout(timer);
        timer = setTimeout(action, scriptWait, observer);
    }

    function action(observer) {
        observer.disconnect();
        // code for stuff to do when page content updates

        if (logging) console.log("[" + GM_info.script.name + "]:\nTriggered!");
        hideReleases();

        observer.observe(document, {childList: true, subtree: true});
    }

    function hideReleases() {
        hiddenReleases = GM_getValue('BandcampHiddenReleases');
        artistBlacklist = GM_getValue('BandcampArtistBlacklist');

        var releases = document.querySelectorAll('div.results-grid li.results-grid-item.g-text-body-responsive');
        if (logging) console.log("[" + GM_info.script.name + "]:\nreleases.length: " + releases.length);

        var hiddenCnt = 0;
        for (var i = 0, len = releases.length; i < len; i++) {
            var releaseID = releases[i].getAttribute('data-test').split('results-grid-item-')[1];
            var releaseURL = releases[i].querySelector('div.meta > p > a').href.split('?')[0];

            var blacklisted = artistBlacklist['https://' + releaseURL.split('/')[2]] === undefined ? false : true;
            var hidden = hiddenReleases[releaseID] === undefined ? false : true;
            var merch = releaseURL.split('/')[3] == 'merch' && settings.merch ? true : false;

            if (settings.hide) {
                if (blacklisted || hidden || merch) {
                    releases[i].style.display = 'none';
                    hiddenCnt++;
                }
            } else {
                releases[i].style['background-color'] = merch ? settings.colors.merch : (blacklisted ? (hidden ? settings.colors.both : settings.colors.black) : (hidden ? settings.colors.hide : ''));
                releases[i].style.display = '';
            }
        }
        if (hiddenCnt == releases.length && settings.viewmore) {
            document.getElementById('view-more').click();
        }
    }

    function formHeaderNote(ctrl, meta, alt, shift) {
        var note = '\u00A0\u00A0' + (ctrl ? 'Ctrl' + (meta || alt || shift ? '+' : '') : '');
        note += (meta ? 'Meta' + (alt || shift ? '+' : '') : '');
        note += (alt ? 'Alt' + (shift ? '+' : '') : '');
        note += (shift ? 'Shift' : '');
        note += '-Click on <strong><i>Album</i> by <i>Artist</i></strong> to hide/unhide releases\u00A0\u00A0';
        return note;
    }

    function formSettings() {
        var str = '<br><strong>On Page Load:</strong>||||<input type="checkbox" id="hide_releases"><label for="hide_releases">||Hide Hidden Releases</label>||||||||<strong>Merchandise Links:</strong>||||<input type="checkbox" id="hide_merch"><label for="hide_merch">||';
        str += 'Hide Merch Releases</label>||||||||<strong>View more results button:</strong>||||<input type="checkbox" id="view_more"><label for="view_more">||Autoclick on empty page</label><br><br><strong>Header Reminder:</strong>||||<input type="checkbox" id="show_note">';
        str += '<label for="show_note">||Show Modifier Key Reminder</label>||||||||<strong>Click Modifier Keys:</strong>||||<input type="checkbox" id="click_ctrl"><label for="click_ctrl">||CTRL</label>||||<input type="checkbox" id="click_meta"><label for="click_meta">||META</label>||||';
        str += '<input type="checkbox" id="click_alt"><label for="click_alt">||ALT</label>||||<input type="checkbox" id="click_shift"><label for="click_shift">||SHIFT</label>||||<br><br>';

        str += '<strong>Release Highlight Colors:</strong>||||<input type="color" id="color_hide" value="#000000"><label for="color_hide">||Hidden</label>||||<input type="color" id="color_black" value="#000000"><label for="color_black">||Blacklisted</label>||||';
        str += '<input type="color" id="color_both" value="#000000"><label for="color_both">||Both</label>||||<input type="color" id="color_merch" value="#000000"><label for="color_both">||Merch</label><br><br>';
        str += '<strong>Textarea Colors:</strong>||||<input type="color" id="color_text" value="#000000"><label for="color_text">||Text</label>||||<input type="color" id="color_back" value="#000000"><label for="color_back">||Background</label>';

        str += '<button id="save_settings" class="g-button sm outline dark-mode follow-button" data-v-922c8136="" style="float: right;">Save Settings</button>';

        str += '<br><br><span><span><label for="hidden_releases"><strong>Hidden Releases:</strong></label>||||<textarea id="hidden_releases" wrap="off" "style="color:#7f7f7f; background-color: #000000;" rows="20" cols="64" readonly></textarea></span>';
        str += '<span>||||<label for="blacklisted_artists"><strong>Blacklisted Artists:</strong></label>||||<textarea id="blacklisted_artists" wrap="off" style="color:#7f7f7f; background-color: #000000;" rows="20" cols="64" readonly></textarea></span></span>';
        str = str.replace(/\|/g, '\u00A0');
        return str;
    }
})();