// ==UserScript==
// @name         release:txt [Bandcamp 2025 Standalone]
// @namespace    http://userscripts-mirror.org/scripts/show/156420
// @version      2024.06.29.07
// @description  Standalone script for extracting release info and tracklist from Bandcamp (2024+ compatible). Outputs formatted text in a textbox at the top.
// @author       nj4442 + original author DMBoxer
// @match        http*://*.bandcamp.com/*
// @license      CC-BY-4.0
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541240/release%3Atxt%20%5BBandcamp%202025%20Standalone%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/541240/release%3Atxt%20%5BBandcamp%202025%20Standalone%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==== CONFIGURATION ====
    // Export header format: ARTIST - TITLE (YEAR) [LABEL]
    var exportHeaderFormat = '%artist% - %title% (%year%) [%label%]';
    var sectionLineSeparator = '_';
    var textWidth = 90;

    // ==== UTILITIES ====
    function tidyline(s) { return s ? s.replace(/[\s\xA0\u200e]+/g, ' ').trim() : ''; }
    function headerline(title, toLength, sepChar) {
        toLength = toLength || textWidth;
        sepChar = sepChar || sectionLineSeparator;
        var filler = new Array(Math.max(0, toLength - (title ? title.length + 1 : 0))).join(sepChar);
        return (title ? title + ' ' : '') + filler;
    }
    function filesystemsafe(s) {
        return s.replace(/[\/\\|]/g, ', ')
                .replace(/:/g, ';')
                .replace(/\?/g, '¿')
                .replace(/"/g, "'")
                .replace(/[\*<>]/g, '_');
    }

    // ==== MODELS ====
    function Track() {
        this.number = '';
        this.artist = '';
        this.title = '';
        this.time = '';
        this.bpm = '';
        this.credits = '';
        this.release = '';
        this.label = '';
    }
    function Section(title, content) {
        this.title = title || '';
        this.content = content || '';
    }
    function Release() {
        this.artist = '';
        this.title = '';
        this.by = '';
        this.label = '';
        this.catalog = '';
        this.released = '';
        this.format = '';
        this.tracks = '';
        this.country = '';
        this.genre = '';
        this.style = '';
        this.duration = '';
        this.tags = '';
        this.bandcamp = '';
        this.tracklist = [];
        this.description = [];
        Object.defineProperty(this, 'year', { enumerable: true, get: function () {
            var rlsYear = (this.released || '').match(/[\d]{4}/);
            return (rlsYear === null) ? '' : rlsYear[0];
        }});
    }

    // ==== PROTOTYPE FORMATTERS ====
    Track.prototype.TXT = function(fieldsSize, skipartist) {
        skipartist = skipartist || false;
        var spaceToTrack = ((this.time === '') ? 0 : fieldsSize.time + 3) + ((this.number === '') ? 0 : fieldsSize.number + 2);
        return ((this.time === '') ? '' : '[' + this.time + '] ')
            + ((this.number === '') ? '' : this.number + '. ')
            + ((skipartist || this.artist === '') ? '' : this.artist + ' - ')
            + ((this.title === '') ? 'unknown' : this.title);
    };

    Release.prototype.TXT_tracklist = function() {
        var trklistTXT = '', trklist = this.tracklist, t, trk = new Track(), trksfieldsize = {time:0, number:0, artist:0, title:0}, k;
        for (t = 0; t < trklist.length; t++) {
            trk = trklist[t];
            trksfieldsize.time = Math.max(trksfieldsize.time, (trk.time||'').length);
            trksfieldsize.number = Math.max(trksfieldsize.number, (trk.number||'').length);
            trksfieldsize.artist = Math.max(trksfieldsize.artist, (trk.artist||'').length);
            trksfieldsize.title = Math.max(trksfieldsize.title, (trk.title||'').length);
        }
        var rlsartist = (this.artist||'').toLowerCase();
        var isSingleArtist = !this.tracklist.some(function(trk) { return (trk.artist||'').toLowerCase() !== rlsartist; });
        for (t = 0; t < trklist.length; t++) {
            trklistTXT += trklist[t].TXT(trksfieldsize, isSingleArtist) + '\n';
        }
        return trklistTXT.trim();
    };

    // Custom top header formatter
    Release.prototype.TXT_header = function() {
        var header = exportHeaderFormat;
        var keys = {
            artist: this.artist || this.by || '',
            title: this.title || '',
            year: this.year || '',
            label: this.label || ''
        };
        Object.keys(keys).forEach(function(key) {
            header = header.replace(new RegExp('%' + key + '%', 'ig'), keys[key].replace(/\s+/g, ' ').trim());
        });
        // Collapse extra spaces
        return filesystemsafe(header).replace(/\s{2,}/g, ' ').trim();
    };

    Release.prototype.TXT_oneliner = function() {
        // No longer needed for top, but keep for reference/legacy
        var line = '%artist% - %title% (by %by%) [%label%] (%year%)', attrib = '', keys = Object.keys(this);
        for (var k = 0; k < keys.length; k++) {
            if (typeof this[keys[k]] === 'string' && this[keys[k]]) {
                attrib = this[keys[k]].replace(/\s+/g, ' ').trim();
                line = line.replace(new RegExp('%' + keys[k] + '%', 'ig'), attrib);
            } else {
                line = line.replace(new RegExp('%' + keys[k] + '%', 'ig'), '');
            }
        }
        line = line.replace(/\(by \)/g, '').replace(/ +\]/g, ']').replace(/\[ +/g, '[')
            .replace(/ +\)/g, ')').replace(/\( +/g, '(')
            .replace(/\[ *\]/g, '').replace(/\( *\)/g, '')
            .replace(/(^ *\- *|\- *\-| *\- *$)/g, '').replace(/ +/g, ' ');
        return filesystemsafe(line);
    };

    Release.prototype.TXT_profile = function() {
        let profile = '';
        const keys = Object.keys(this);
        let keysmaxlenght = 0;
        for (let k = 0; k < keys.length; k++) {
            if (typeof this[keys[k]] === 'string' && keys[k].length > keysmaxlenght) {
                keysmaxlenght = keys[k].length;
            }
        }
        for (let k = 0; k < keys.length; k++) {
            // Only include if value is non-empty and not 'year'
            if (typeof this[keys[k]] === 'string' && keys[k] !== 'year' && this[keys[k]]) {
                // Remove leading/trailing spaces, and collapse multiple spaces
                let value = this[keys[k]].replace(/\s+/g, ' ').trim();
                profile += keys[k].replace(/_/g, ' ').padEnd(keysmaxlenght + 1, ' ') + ': ' + value + '\n';
            }
        }
        return profile.trim();
    };

    Release.prototype.TXT = function() {
        var rlsTXT = '', d = 0;
        rlsTXT = this.TXT_header() + '\n';
        rlsTXT += headerline('') + '\n\n';
        rlsTXT += this.TXT_profile() + '\n';
        if (this.tracklist.length > 0) {
            rlsTXT += '\n' + headerline('Tracklist') + '\n\n';
            rlsTXT += this.TXT_tracklist() + '\n';
        }
        for (d = 0; d < this.description.length; d++) {
            let descContent = this.description[d].content;
            // Clean up extra blank lines
            descContent = descContent.replace(/\n{2,}/g, '\n\n').trim();
            rlsTXT += '\n' + headerline(this.description[d].title) + '\n\n';
            rlsTXT += descContent + '\n';
        }
        rlsTXT += '\n' + headerline('__ generated by release:txt') + '\n';
        return rlsTXT.trim();
    };

    // ==== BANDCAMP EXTRACTION ====
    function get_bandcamp_release(htmldoc) {
        var rls = new Release();

        // Title and Artist
        rls.title = htmldoc.querySelector('#name-section .trackTitle')?.textContent.trim() || '';
        rls.by = htmldoc.querySelector('#name-section h3 a')?.textContent.trim() || '';

        // Label/Publisher
        rls.label = htmldoc.querySelector('#bio-container #band-name-location .title')?.textContent.trim() || '';

        // Release Date (extract only the date, not credits/description)
        var creditsElem = htmldoc.querySelector('#trackInfoInner .tralbum-credits');
        if (creditsElem) {
            let creditsText = creditsElem.textContent.trim();
            // Look for "released Month DD, YYYY"
            let releasedMatch = creditsText.match(/released\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
            if (releasedMatch) {
                rls.released = releasedMatch[1];
            } else {
                // fallback: just look for Month DD, YYYY anywhere
                let fallbackMatch = creditsText.match(/([A-Za-z]+\s+\d{1,2},\s+\d{4})/);
                rls.released = fallbackMatch ? fallbackMatch[1] : '';
            }
        } else {
            rls.released = '';
        }

        // Format
        var formatElem = htmldoc.querySelector('#trackInfoInner .buyItemPackageTitle');
        rls.format = formatElem ? formatElem.textContent.trim() : '';

        // Tags
        var tagsElem = htmldoc.querySelector('.tralbum-tags');
        if (tagsElem) {
            rls.tags = Array.from(tagsElem.querySelectorAll('a.tag')).map(a => a.textContent.trim()).join(', ');
        }

        // Description/About
        var aboutElem = htmldoc.querySelector('#trackInfoInner .tralbum-about');
        var rlsDescriptionSection = new Section();
        rlsDescriptionSection.title = 'Description';
        rlsDescriptionSection.content = '';
        if (aboutElem) rlsDescriptionSection.content += aboutElem.textContent.trim();
        // Add other credits except the release date
        if (creditsElem && creditsElem.textContent.trim()) {
            let creditsText = creditsElem.textContent.trim();
            // Remove the "released Month DD, YYYY" from the start, if present
            let extraCredits = creditsText.replace(/^released\s+[A-Za-z]+\s+\d{1,2},\s+\d{4}[.,;:! ]*/i, '').trim();
            if (extraCredits) {
                rlsDescriptionSection.content += (rlsDescriptionSection.content ? '\n\n' : '') + extraCredits;
            }
        }

        // Label bio and links
        var bandBioElem = htmldoc.querySelector('#bio-container .signed-out-artists-bio-text');
        if (bandBioElem && bandBioElem.textContent.trim()) {
            rlsDescriptionSection.content += '\n\n' + bandBioElem.textContent.trim();
        }
        var bandLinks = htmldoc.querySelectorAll('#bio-container #band-links li a');
        if (bandLinks.length) {
            rlsDescriptionSection.content += '\n\nLinks:\n' + Array.from(bandLinks).map(a => a.href).join('\n');
        }
        // Clean up extra blank lines in description content
        if (rlsDescriptionSection.content)
            rlsDescriptionSection.content = rlsDescriptionSection.content.replace(/\n{2,}/g, '\n\n').trim();
        if (rlsDescriptionSection.content) rls.description.push(rlsDescriptionSection);

        // Tracklist
        var trackRows = htmldoc.querySelectorAll('#track_table tr.track_row_view');
        trackRows.forEach(function(row) {
            var trk = new Track();
            var numElem = row.querySelector('.track_number');
            trk.number = numElem ? numElem.textContent.trim().replace(/\.$/, '') : '';
            var titleElem = row.querySelector('.track-title');
            trk.title = titleElem ? titleElem.textContent.trim() : '';
            var timeElem = row.querySelector('.time.secondaryText');
            trk.time = timeElem ? timeElem.textContent.trim() : '';
            rls.tracklist.push(trk);
        });

        // Bandcamp URL
        rls.bandcamp = htmldoc.URL;

        return rls;
    }

    // ==== UI ====
    function buildUI() {
        var htmldoc = window.top.document;
        // Remove old UI if present
        var old = htmldoc.getElementById('releaseTXT_header');
        if (old) old.remove();

        var UIcontainer = htmldoc.createElement('div');
        UIcontainer.id = 'releaseTXT_header';
        UIcontainer.style.cssText = 'position: fixed; z-index: 9999; top: 0; left: 0; margin-top: 0; height: 28px; width: 100%; background: #222; color: #fff; box-shadow:0 2px 4px #0007;';
        htmldoc.body.insertBefore(UIcontainer, htmldoc.body.firstChild);

        var div = htmldoc.createElement('div');
        div.style.cssText = 'margin:0 auto; height:24px; width:990px;';
        UIcontainer.appendChild(div);

        var gettxt = htmldoc.createElement('input');
        gettxt.type = 'button';
        gettxt.id = 'releaseTXT_button';
        gettxt.value = 'release:txt';
        gettxt.style.cssText = 'margin:2px 1px 2px 10px;padding:0 5px;height:20px;font-family:verdana;font-size:10px;background:#333;color:#fff;border:1px solid #888;border-radius:6px;';
        div.appendChild(gettxt);

        var txtbox = htmldoc.createElement('textarea');
        txtbox.id = 'releaseTXT_txtbox';
        txtbox.value = 'click to get the text version of this release...';
        txtbox.spellcheck = false;
        txtbox.style.cssText = 'margin:2px 1px;padding:2px 1px 1px 5px;min-height:15px;height:15px;width:750px;font-family:monospace;font-size:12px;line-height:15px;vertical-align:top;resize:both;overflow:auto;border:solid 1px #d7d7d7;border-radius:6px;box-shadow:inset 1px 1px 3px 0px #333;color:#000;background:#fff;';
        div.appendChild(txtbox);

        gettxt.addEventListener('click', function () { main(); }, false);
    }

    // ==== MAIN FUNCTION ====
    function main() {
        var htmldoc = window.top.document;
        var txtbox = htmldoc.getElementById('releaseTXT_txtbox');
        txtbox.value = 'page loading...';
        txtbox.style.background='#FFD700';

        try {
            var rls = get_bandcamp_release(htmldoc);
            var outtxt = rls.TXT();
            txtbox.value = outtxt;
            txtbox.style.background='#fff';
        } catch(e) {
            txtbox.value = 'Could not collect the data for this release. Error: ' + e;
            txtbox.style.background='#fdd';
        }
    }

    // ==== INIT ====
    function isBandcampReleasePage() {
        return !!document.querySelector('#name-section .trackTitle');
    }
    if (isBandcampReleasePage()) {
        buildUI();
        // Optionally auto-trigger extraction:
        // setTimeout(main, 1000);
    }
})();