// ==UserScript==
// @name         ANTelligence
// @namespace    http://tampermonkey.net/
// @version      v2.61
// @description  Make finding potentially troublesome releases easier on ANT
// @author       EnigmaticBacon
// @match        https://anthelion.me/torrents.php
// @match        https://anthelion.me/torrents.php?page=*
// @match        https://anthelion.me/torrents.php?id=*
// @match        https://anthelion.me/torrents.php?action=advanced&advgroupname=*
// @match        https://anthelion.me/reportsv2.php?action=report&id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489363/ANTelligence.user.js
// @updateURL https://update.greasyfork.org/scripts/489363/ANTelligence.meta.js
// ==/UserScript==


// Different Media (WEB-DL + DVD + BluRay)
// Resolutions (SD, 720p, 1080p, 2160p)
// Video Codecs (H264, H265, VC-1) - Note - Xvid/DivX/MPEG are always trumpable by these. AC-3/DTS does NOT co-exist.
// SDR / HDR / DV (Note: DV8 will trump other DV releases of the same source. Releases with both HDR10 and DV trumps releases with only HDR10 or DV)
// Full Disc + Remux + encodes
// Different editions (Extended, Director's, Uncut, Unrated)
// 3D + non-3D
//Scene + P2P
(function() {
    'use strict';
    // Enumeration for ease of management
    const Enumerations = {
        TrumpReasons: Object.freeze({
            none: 0,
            trumpableVideoCodec: 1,
            trumpableContainer: 2,
            trumpableSource: 3,
            trumpableDynamicRange: 4,
            trumpableScene: 5,
            trumpableDuplicate: 6,
            regularDupe: 7,
        }),
        Properties: Object.freeze({
            VideoCodec: 1,
            AudioFormat: 2,
            SourceMedia: 3,
            SceneP2P: 4,
            DynamicRange: 5,
            Resolution: 6,
            ReleaseType: 7,
            Edition: 8,
            Dimensions: 9,
            Container: 10,
        }),
        VideoCodec: Object.freeze({
            h264: 1,
            h265: 2,
            "vc-1": 3,
            mpeg1: 4,
            mpeg2: 4,
            xvid: 4,
            divx: 4,
            trumpable: 4,
            //av1: 4,
        }),
        AudioFormat: Object.freeze({
            mp2: 1,
            mp3: 2,
            aac: 3,
            ac3: 4,
            dts: 5,
            flac: 6,
            pcm: 7,
            "true-hd": 8,
            opus: 9
        }),
        SourceMedia: Object.freeze({
            web: 1,
            dvd: 2,
            "hd-dvd": 3,
            "blu-ray": 4,
            laserdisc: 5, // These cannot co-exist
            hdtv: 6,
            tv: 6,
            vhs: 6,
            unknown: 7,
            trumpable: 6
        }),
        SceneP2P: Object.freeze({
            scene: 1,
            p2p: 2
        }),
        DynamicRange: Object.freeze({
            hdr: 1,
            both: 2,
            sdr: 3,
        }),
        Resolution: Object.freeze({
            sd: 1,
            "720p": 2,
            "1080i": 4,
            "1080p": 3,
            "2160p": 5
        }),
        ReleaseType: Object.freeze({
            encode: 1,
            remux: 2,
            fulldisc: 3
        }),
        Edition: Object.freeze({
            directors: 1,
            extended: 2,
            uncut: 3,
            imax: 4,
            unrated: 5,
            standard: 6
        }),
        Dimensions: Object.freeze({
            "3d": 1,
            "2d": 2
        }),
        Container: Object.freeze({
            mkv: 1,
            "vob ifo": 2,
            m2ts: 2,
            mpg: 3,
            avi: 3,
            mp4: 3,
            trumpable: 3,
            other: 4,
        }),
    };

    function getDifferences(item1, item2) {
        const properties = [
            'sourceMedia',
            'resolution',
            'videoCodec',
            'dynamicRange',
            'releaseType',
            'edition',
            'dimensions',
            'isScene',
            'container',
        ];

        let num_diffs = 0;
        let diffs = [];

        properties.forEach(property => {
            if (item1[property] !== item2[property]) {
                num_diffs += 1;
                diffs.push(Enumerations.Properties[property.charAt(0).toUpperCase() + property.slice(1)]);
            }
        });

        return { num_diffs, diffs };
    }

    function canTrump(item1, item2){
        if (item1.videoCodec != Enumerations.VideoCodec.trumpable && item2.videoCodec == Enumerations.VideoCodec.trumpable){
            return Enumerations.TrumpReasons.trumpableVideoCodec;
        }
        if (item1.container != Enumerations.Container.trumpable && item2.container == Enumerations.Container.trumpable){
            return Enumerations.TrumpReasons.trumpableContainer;
        }
        if (item1.sourceMedia != Enumerations.SourceMedia.trumpable && item2.sourceMedia == Enumerations.SourceMedia.trumpable) {
            return Enumerations.TrumpReasons.trumpableSource;
        }
        if (item1.dynamicRange == Enumerations.DynamicRange.both && item2.dynamicRange == Enumerations.DynamicRange.hdr) {
            return Enumerations.TrumpReasons.trumpableDynamicRange;
        }
        if (item1.sourceMedia == Enumerations.SourceMedia.web && item2.sourceMedia == Enumerations.SourceMedia.web &&
            item1.isScene == Enumerations.SceneP2P.p2p && item2.isScene == Enumerations.SceneP2P.scene)
        {
            return Enumerations.TrumpReasons.trumpableScene;
        }

        return Enumerations.TrumpReasons.none;
    }

    function checkForIssues(rows) {
        const trumpMap = new Map();
        const unknownRows = [];

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].sourceMedia == Enumerations.SourceMedia.unknown){
                unknownRows.push(i);
            }
            for (let j = 0; j < rows.length; j++) {
                if (i == j) continue;
                const { num_diffs, diffs } = getDifferences(rows[i], rows[j]);
                if (num_diffs == 0) { // If there are no differences, the release is identical
                    if (!trumpMap.has(i)){
                        trumpMap.set(i, []);
                    }
                    trumpMap.get(i).push({trumpIndex: j, trumpReason: Enumerations.TrumpReasons.trumpableDuplicate});
                } else if (num_diffs == 1) { // If there's only one difference, check for a trump
                    const trumpReason = canTrump(rows[i], rows[j]);
                    if (trumpReason != Enumerations.TrumpReasons.none)
                    {
                        if (!trumpMap.has(i)) {
                            trumpMap.set(i, []);
                        }
                        trumpMap.get(i).push({trumpIndex: j, trumpReason});
                    }
                }
            }
        }
        return { trumpMap, unknownRows };
    }

    function determineVideoCodec(infoArray){
        const videoCodec = Object.keys(Enumerations.VideoCodec).find(codec => infoArray.includes(codec)) || "unknown";
        return Enumerations.VideoCodec[videoCodec];
    }

    function determineSourceMedia(infoArray){
        const sourceMedia = Object.keys(Enumerations.SourceMedia).find(media => infoArray.includes(media)) || "unknown";
        return Enumerations.SourceMedia[sourceMedia];
    }

    function determineIfScene(infoArray){
        if (infoArray.includes("scene")) {
            return Enumerations.SceneP2P.scene;
        } else {
            return Enumerations.SceneP2P.p2p;
        }
    }

    function determineDynamicRange(infoArray){
        if (infoArray.includes("hdr10") && infoArray.includes("dv")){
            return Enumerations.DynamicRange.both;
        }
        if (infoArray.includes("hdr10") || infoArray.includes("dv")){
            return Enumerations.DynamicRange.hdr;
        } else {
            return Enumerations.DynamicRange.sdr;
        }
    }

    function determineResolution(infoArray) {
        const resolution = Object.keys(Enumerations.Resolution).find(res => infoArray.includes(res)) || "unknown";
        return Enumerations.Resolution[resolution];
    }

    function determineAudioFormat(infoArray) {
        const format = Object.keys(Enumerations.AudioFormat).find(format => infoArray.includes(format)) || "unknown";
        return Enumerations.AudioFormat[format];
    }

    function determineReleaseType(infoArray) {
        if (infoArray.includes("remux")) {
            return Enumerations.ReleaseType.remux;
        } else if (["m2ts", "iso", "vob ifo"].some(str => infoArray.includes(str))) {
            return Enumerations.ReleaseType.fulldisc;
        } else {
            return Enumerations.ReleaseType.encode;
        }
    }

    function determineEdition(infoArray) {
        const edition = Object.keys(Enumerations.Edition).find(ed => infoArray.some(info => info.includes(ed))) || "standard";
        return Enumerations.Edition[edition];
    }

    function determineDimensions(infoArray) {
        if (infoArray.includes("3d")) {
            return Enumerations.Dimensions["3d"];
        } else {
            return Enumerations.Dimensions["2d"];
        }
    }

    function determineContainer(infoArray) {
        const container = Object.keys(Enumerations.Container).find(container => infoArray.some(info => info.includes(container))) || "other";
        return Enumerations.Container[container];
    }

    function trumpReasonToString(reason) {
        if (reason == Enumerations.TrumpReasons.trumpableContainer){
            return "You can trump any AVI & MP4 & MPG containers.";
        }
        if (reason == Enumerations.TrumpReasons.trumpableDynamicRange){
            return "Releases with both HDR10 and DV trumps releases with only HDR10 or DV.";
        }
        if (reason == Enumerations.TrumpReasons.trumpableSource){
            return "TV/VHS rips can be trumped by WEB or disc rips, all other attributes being equal.";
        }
        if (reason == Enumerations.TrumpReasons.trumpableVideoCodec){
            return "Xvid, DivX, and standalone (non-full-disc) MPEG codecs are always trumpable.";
        }
        if (reason == Enumerations.TrumpReasons.trumpableScene){
            return "P2P will trump scene, only for a web-dl, in the event the p2p is of an equal or better quality.";
        }
        if (reason == Enumerations.TrumpReasons.trumpableDuplicate){
            return "This upload is being replaced by a newer upload of the same or higher quality filling the same slot."
        }
        if (reason == Enumerations.TrumpReasons.regularDupe){
            return "This upload was created after another upload of the same or higher quality filling the same slot."
        }
        return "";
    }

    function setBackgroundColor(row, color) {
        row.style.backgroundColor = color;
    }

    function appendQuickReportLink(bracketsSpan, href, text, baseTitle, trumpIndices) {
        const quickReportLink = document.createElement("a");
        quickReportLink.href = href;
        quickReportLink.textContent = text;
        quickReportLink.style.cursor = "pointer";

        // Construct the detailed title message with incremented trump indices
        let detailMsg = "Doing so would create a report for the following releases: ";
        const incrementedIndices = trumpIndices.map(index => index + 1).join(", "); // Increment and join indices
        const fullTitle = `${baseTitle}\n${detailMsg}${incrementedIndices}`;

        quickReportLink.title = fullTitle;

        // Insert the button into the page
        if (bracketsSpan.firstChild) {
            bracketsSpan.insertBefore(document.createTextNode(" | "), bracketsSpan.firstChild); // Separator
            bracketsSpan.insertBefore(quickReportLink, bracketsSpan.firstChild);
            bracketsSpan.insertBefore(document.createTextNode(" "), bracketsSpan.firstChild); // Separator
        } else {
            bracketsSpan.appendChild(quickReportLink);
        }
    }

    function preprocessInterconnectedGroups(trumpMap, allRows, darkColors) {
        let groupColorAssignments = new Map();
        let visited = new Set(); // Track visited indices to avoid reprocessing
        let colorIndex = 0; // Separate counter for color indexing

        // Sort the indices of trumpMap to ensure consistent iteration order
        const sortedIndices = Array.from(trumpMap.keys()).sort((a, b) => a - b);

        sortedIndices.forEach(index => {
            if (visited.has(index)) return; // Skip already processed indices

            let interconnectedGroup = new Set([index]);
            let toProcess = [index];

            // Discover all interconnected indices
            while (toProcess.length > 0) {
                let currentIndex = toProcess.pop();
                visited.add(currentIndex); // Mark as visited

                let currentGroup = trumpMap.get(currentIndex) || [];
                currentGroup.forEach(({trumpIndex}) => {
                    if (!visited.has(trumpIndex)) {
                        interconnectedGroup.add(trumpIndex);
                        // Ensure we only push indices that are also in sortedIndices
                        if (sortedIndices.includes(trumpIndex)) {
                            toProcess.push(trumpIndex);
                        }
                    }
                });
            }

            // Assign a common color to all interconnected indices
            let groupColor = darkColors[colorIndex++ % darkColors.length];
            interconnectedGroup.forEach(idx => {
                groupColorAssignments.set(idx, groupColor);
            });
        });

        return groupColorAssignments;
    }


    function handleDuplicatesAndTrumps(infoArrays, allRows, getTorrentIdFunction) {
        const darkColors = [
            '#560000', // Darker Red
            '#005656', // Darker Cyan
            '#293813', // Darker Olive
            '#29023d', // Darker Purple
            '#522410', // Darker Sienna
            '#000056', // Darker Blue
            '#004D00', // Darker Green
            '#360036', // Darker Magenta
            '#0c2e2e', // Darker Turquoise
            '#695417', // Darker Orange
        ];
        const { trumpMap, unknownRows } = checkForIssues(infoArrays);
        let recoloredRows = new Set();
        // TODO also add each release to one another's groups if interconnected (P.S: Fuck that)
        let groupColorAssignments = preprocessInterconnectedGroups(trumpMap, allRows, darkColors);

        unknownRows.forEach(rowIndex => {
            if (unknownRows.includes(rowIndex) && !recoloredRows.has(rowIndex)) {
                setBackgroundColor(allRows.item(rowIndex), "#000000");
                // Intentionally not setting is as recolored, so it can be overwritten
            }
        });

        allRows.forEach((row, index) => {
            const bracketsSpan = row.querySelector("span.brackets");
            const rpLink = row.querySelector("a.tooltip[href^='reportsv2.php']");
            if (!rpLink) return; // Skip if "RP" link is not found
            const rpHref = rpLink.getAttribute("href");
            const thisWindowUrl = window.location.href.match(/^(.*?)(?=&|$)/)[0];

            // Apply color from preprocessed assignments
            const groupColor = groupColorAssignments.get(index);
            if (groupColor) {
                setBackgroundColor(row, groupColor);
                recoloredRows.add(index);
            }

            // Get all of this release's trumps
            if (trumpMap.has(index)){
                const currentReleaseTorrentId = getTorrentIdFunction(allRows.item(index));
                let trumpGroup = trumpMap.get(index);
                // Sort the trump group by order of the Ids. Hopefully this should sort their age, lower ids mean older releases
                trumpGroup = trumpGroup.map(({trumpIndex, trumpReason}) => {
                    const torrentId = getTorrentIdFunction(allRows.item(trumpIndex));
                    return { torrentId, trumpIndex, trumpReason };
                }).sort((a, b) => a.torrentId - b.torrentId);

                let reportInfo = [];
                let trumpIndices = [];
                trumpGroup.forEach(({trumpIndex, trumpReason}, index) => {
                    trumpIndices.push(trumpIndex);
                    const problematicTorrentId = getTorrentIdFunction(allRows.item(trumpIndex));
                    // If the release being discarded is newer and the releases are duplicates, set as duper instead of trump
                    if ( trumpReason == Enumerations.TrumpReasons.trumpableDuplicate && currentReleaseTorrentId < problematicTorrentId){
                        trumpReason = Enumerations.TrumpReasons.regularDupe;
                    }
                    reportInfo.push({problematicTorrentId, trumpReason});
                });


                const urlSearchParams = new URLSearchParams(thisWindowUrl);
                const queryParams = {};
                for (const [key, value] of urlSearchParams) {
                    queryParams[key] = value;
                }
                let modifiedHref = `${rpHref}&n=${reportInfo.length}&thisWindowUrl=${thisWindowUrl}`;
                if (!queryParams.hasOwnProperty("https://anthelion.me/torrents.php?id")) {
                    const firstRow = allRows[0]; // Get the first row
                    const groupId = firstRow.classList[1].replace('groupid_', ''); // Extract groupId from the second class
                    modifiedHref += `?id=${groupId}`;
                }
                for (let i = 0; i < reportInfo.length; ++i){
                    modifiedHref += `&id${i}=${reportInfo[i].problematicTorrentId}&reason${i}=${reportInfo[i].trumpReason}`
                }
                appendQuickReportLink(bracketsSpan, modifiedHref, "BR", "Pick this as the 'best release' in this color group.", trumpIndices)
            }
        });
    }

    function getRowText(row){
        if (row.querySelector("a[data-toggle-target]")){
            return row.querySelector("a[data-toggle-target]").textContent;
        }
        if (row.querySelector('td > a')){
            return row.querySelector('td > a').textContent;
        }
        return "";
    }

    function encodeToSlug(dataArray, separator = '!') {
        // Serialize the data array into a compact string
        let serialized = dataArray.map(obj =>
            Object.values(obj).join(',')
        ).join('|');

        // Prepend the separator to the serialized string and encode it
        return encodeURIComponent(separator + serialized);
    }

    function decodeFromSlug(slug, separator = '!') {
        // Decode the slug back to the serialized string
        let decoded = decodeURIComponent(slug);

        // Find the position of the separator and discard everything before it
        const separatorIndex = decoded.indexOf(separator);
        if (separatorIndex !== -1) {
            // If the separator is found, discard everything up to and including it
            decoded = decoded.substring(separatorIndex + 1);
        }

        // Deserialize the string back into the original object array
        return decoded.split('|').map(item => {
            let values = item.split(',');
            // Assuming the order of keys is known and consistent
            let keys = ["videoCodec", "sourceMedia", "isScene", "dynamicRange", "resolution", "releaseType", "edition", "dimensions", "container"];
            let obj = {};
            keys.forEach((key, index) => {
                obj[key] = parseInt(values[index], 10);
            });
            return obj;
        });
    }

    function torrentsPageWithIdMain(){
        let infoArrays = [];
        function extractInformation(row, index) {
            const infoText = getRowText(row).toLowerCase();
            const infoArray = infoText.split('/').map(i => i.trim());

            // Extract Release Properties
            const videoCodec = determineVideoCodec(infoArray);
            const sourceMedia = determineSourceMedia(infoArray);
            const isScene = determineIfScene(infoArray);
            const dynamicRange = determineDynamicRange(infoArray);
            const resolution = determineResolution(infoArray);
            const releaseType = determineReleaseType(infoArray);
            const edition = determineEdition(infoArray);
            const dimensions = determineDimensions(infoArray);
            const container = determineContainer(infoArray);
            const rowInfo = {
                videoCodec,
                sourceMedia,
                isScene,
                dynamicRange,
                resolution,
                releaseType,
                edition,
                dimensions,
                container,
            };
            infoArrays.push(rowInfo);
        }

        document.querySelectorAll("tr.torrent_row").forEach(extractInformation);
        const uploadLink = document.querySelector('a[href^="upload.php?groupid="].brackets');
        if ( uploadLink ){
            sessionStorage.setItem('infoArrays', JSON.stringify(encodeToSlug(infoArrays)));
        }

        handleDuplicatesAndTrumps(infoArrays, document.querySelectorAll("tr.torrent_row"), function(element) {
            return parseInt(element.getAttribute('id').match(/\d+/)[0], 10);
        });
    }

    function createReportForm(container, typeOfTrump, trumpingPermalink, trumpedPermalink, comments, hiddenDiv) {
        const reportForm = document.createElement('form');
        reportForm.id = 'reportform'
        reportForm.className = 'create_form';
        reportForm.name = 'report';
        reportForm.action = 'reportsv2.php?action=takereport';
        reportForm.enctype = 'multipart/form-data';
        reportForm.method = 'post';

        // Add a checkbox for skipping report submission
        const skipReportCheckbox = document.createElement('input');
        skipReportCheckbox.type = 'checkbox';
        skipReportCheckbox.name = 'skip_report';
        skipReportCheckbox.id = 'skip_report';
        const skipReportLabel = document.createElement('label');
        skipReportLabel.textContent = ' I do NOT want to submit a report for this release';
        skipReportLabel.htmlFor = 'skip_report';

        const formTitle = document.createElement('strong');
        formTitle.textContent = "Report form for torrent with permalink: ";
        const formTitleLink = document.createElement('a');
        formTitleLink.href = trumpedPermalink;
        formTitleLink.textContent = trumpedPermalink;
        formTitle.appendChild(formTitleLink);

        const div = document.createElement('div');
        div.className = 'box pad';

        // Create the table and its content for the 'Reason' dropdown
        const table = document.createElement('table');
        table.className = 'layout';

        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');

        const tdLabel = document.createElement('td');
        tdLabel.className = 'label';
        tdLabel.textContent = 'Reason:';

        const tdSelect = document.createElement('td');
        const select = document.createElement('select');
        select.id = 'type'; // Set the id for the select element
        select.name = 'type';
        select.className = 'change_report_type';

        const reasons = ["dupe", "banned", "urgent", "trump", "trumpable", "metadata", "other"];
        reasons.forEach(reason => {
            const option = document.createElement('option');
            option.value = reason;
            option.textContent = reason.charAt(0).toUpperCase() + reason.slice(1); // Capitalize the first letter
            select.appendChild(option);
        });

        // Add the skip report checkbox to the form
        div.appendChild(skipReportCheckbox);
        div.appendChild(skipReportLabel);

        // Append everything together for the 'Reason' dropdown
        tdSelect.appendChild(select);
        tr.appendChild(tdLabel);
        tr.appendChild(tdSelect);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        div.appendChild(table);

        // Add additional elements below the table
        const pGuidelines = document.createElement('p');
        pGuidelines.textContent = "Fields that contain lists of values (for example, listing more than one track number) should be separated by a space.";
        div.appendChild(pGuidelines);

        const pStrongGuidelines = document.createElement('p');
        const strongText = document.createElement('strong');
        strongText.textContent = "Following the below report type specific guidelines will help the moderators deal with your report in a timely fashion.";
        pStrongGuidelines.appendChild(strongText);
        div.appendChild(pStrongGuidelines);

        // Create the dynamic form section
        const dynamicFormDiv = document.createElement('div');
        dynamicFormDiv.id = 'dynamic_form';

        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.textContent = "Please specify a link to the original torrent.";
        ul.appendChild(li);
        dynamicFormDiv.appendChild(ul);

        const formTable = document.createElement('table');
        formTable.className = 'layout';
        formTable.setAttribute('cellpadding', '3');
        formTable.setAttribute('cellspacing', '1');
        formTable.setAttribute('border', '0');
        formTable.setAttribute('width', '100%');

        const formTbody = document.createElement('tbody');

        // Permalink row
        const trPermalink = document.createElement('tr');
        const tdPermalinkLabel = document.createElement('td');
        tdPermalinkLabel.className = 'label';
        tdPermalinkLabel.innerHTML = 'Permalink to <strong>other relevant</strong> torrent(s) <strong class="important_text">(Required)</strong>:';
        const tdPermalinkInput = document.createElement('td');
        const inputPermalink = document.createElement('input');
        inputPermalink.id = 'sitelink';
        inputPermalink.type = 'text';
        inputPermalink.name = 'sitelink';
        inputPermalink.size = 50;
        tdPermalinkInput.appendChild(inputPermalink);
        trPermalink.appendChild(tdPermalinkLabel);
        trPermalink.appendChild(tdPermalinkInput);
        formTbody.appendChild(trPermalink);

        // Comments row
        const trComments = document.createElement('tr');
        const tdCommentsLabel = document.createElement('td');
        tdCommentsLabel.className = 'label';
        tdCommentsLabel.innerHTML = 'Comments <strong class="important_text">(Required)</strong>:';
        const tdCommentsTextarea = document.createElement('td');
        const textareaComments = document.createElement('textarea');
        textareaComments.id = 'extra';
        textareaComments.rows = 5;
        textareaComments.cols = 60;
        textareaComments.name = 'extra';
        tdCommentsTextarea.appendChild(textareaComments);
        trComments.appendChild(tdCommentsLabel);
        trComments.appendChild(tdCommentsTextarea);
        formTbody.appendChild(trComments);

        // Append the form table
        formTable.appendChild(formTbody);
        dynamicFormDiv.appendChild(formTable);
        div.appendChild(dynamicFormDiv);

        // Set initial values
        select.value = typeOfTrump;
        inputPermalink.value = trumpingPermalink;
        textareaComments.textContent = comments;

        // Append elements to the report form
        reportForm.appendChild(hiddenDiv);
        reportForm.appendChild(formTitle);
        reportForm.appendChild(div);
        container.appendChild(reportForm);
    }

    function reportsPageMain(){
        // Get the URL search parameters from the current URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        const queryParams = {};
        for (const [key, value] of urlSearchParams) {
            queryParams[key] = value;
        }

        // This was not a quick report
        if (!(queryParams.hasOwnProperty("n") &&
              queryParams.hasOwnProperty("id"))) {
            return;
        }

        const headerDiv = document.querySelector('.header');
        if (headerDiv) {
            const headerText = headerDiv.querySelector('h2');
            if (headerText) {
                headerText.textContent = 'ANTelligence Report Page'
            }
        }
        const tableHeader = document.querySelector('.colhead_dark td[width="80%"] strong');
        if (tableHeader){
            tableHeader.textContent = 'You picked this torrent as the best release of its color group'
        }

        const container = document.querySelector('#content .thin');
        const trumpingPermalink = `${queryParams.thisWindowUrl}&torrentid=${queryParams.id}&torrentid=${queryParams.id}`;
        const originalFormElement = document.querySelector('.create_form');
        const hiddenDiv = originalFormElement.querySelector('div');
        queryParams.n = parseInt(queryParams.n, 10);
        for (let i = 0; i < queryParams.n; ++i) {
            const trumpReason = parseInt(queryParams[`reason${i}`], 10);
            const reasonMessage = trumpReasonToString(trumpReason);
            const typeValue = trumpReason === Enumerations.TrumpReasons.regularDupe ? 'dupe' : 'trump';
            const trumpedPermalink = `${queryParams.thisWindowUrl}&torrentid=${queryParams[`id${i}`]}&torrentid=${queryParams[`id${i}`]}`;
            const clonedHiddenDiv = hiddenDiv.cloneNode(true);
            const torrentIdInput = clonedHiddenDiv.querySelector('input[name="torrentid"]');
            if (torrentIdInput){
                torrentIdInput.value = queryParams[`id${i}`];
            }
            createReportForm(container, typeValue, trumpingPermalink, trumpedPermalink, reasonMessage, clonedHiddenDiv);
        }
        originalFormElement.parentNode.removeChild(originalFormElement);

        // After creating all forms, add a submit all button
        const submitAllButton = document.createElement('button');
        submitAllButton.textContent = 'Submit All Reports';
        submitAllButton.style.marginTop = '20px';
        container.appendChild(submitAllButton);

        // Event listener for the submit all button
        submitAllButton.addEventListener('click', () => {
            const allForms = container.querySelectorAll('.create_form');
            allForms.forEach((form, index) => {
                // Check if the skip report checkbox is checked
                const skipReportCheckbox = form.querySelector('#skip_report');
                if (skipReportCheckbox && skipReportCheckbox.checked) {
                    // Skip this form if the checkbox is checked
                    return;
                }

                const action = form.action;
                const method = form.method;
                const formData = new FormData(form);

                fetch(action, {
                    method: method,
                    body: formData,
                    credentials: 'same-origin'
                }).then(response => {
                    window.location.href = queryParams.thisWindowUrl;
                }).catch(error => {
                    console.error(`Form ${index + 1} submission error: `, error);
                });
            });
        });
    }

    function waitForElements(selectors, callback, delay = 800) {
        let callbackCalled = false; // Flag to track if the callback has been called
        const observer = new MutationObserver((mutations, obs) => {
            const elementsExist = selectors.every(selector => !!document.querySelector(selector));
            if (elementsExist && !callbackCalled) {
                setTimeout(() => {
                    if (!callbackCalled) { // Check the flag again to ensure callback is not already called
                        callback();
                        callbackCalled = true; // Set the flag to prevent future calls
                        obs.disconnect(); // Stop observing
                    }
                }, delay);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function torrentsPageMain(){
        let infoArrays = {};

        function extractInformation(row, index) {
            const infoText = getRowText(row).toLowerCase();
            const infoArray = infoText.split('/').map(i => i.trim());

            // Extract Release Properties
            const videoCodec = determineVideoCodec(infoArray);
            const sourceMedia = determineSourceMedia(infoArray);
            const isScene = determineIfScene(infoArray);
            const dynamicRange = determineDynamicRange(infoArray);
            const resolution = determineResolution(infoArray);
            const releaseType = determineReleaseType(infoArray);
            const edition = determineEdition(infoArray);
            const dimensions = determineDimensions(infoArray);
            const container = determineContainer(infoArray);

            const id = row.className.match(/groupid_(\d+)/)[1]; // Extract the ID from the class name
            if (!infoArrays[id]) {
                infoArrays[id] = []; // Initialize array for the ID if it doesn't exist
            }
            const rowInfo = {
                videoCodec,
                sourceMedia,
                isScene,
                dynamicRange,
                resolution,
                releaseType,
                edition,
                dimensions,
                container,
            };
            infoArrays[id].push(rowInfo);
        }

        const rows = document.querySelectorAll("tr[class^='group_torrent groupid_']");
        rows.forEach(row => {
            const id = row.className.match(/groupid_(\d+)/)[1];
            if (!row.classList.contains('processed')) {
                extractInformation(row);
                row.classList.add('processed');
            }
        });

        for (const [key, values] of Object.entries(infoArrays)) {
            handleDuplicatesAndTrumps(values, document.querySelectorAll(`tr[class^='group_torrent groupid_${key}']`), function(element) {
                const aElement = element.querySelector("a[href^='torrents.php?action=download']");
                if (aElement) {
                    const href = aElement.getAttribute('href');
                    const matches = href.match(/id=(\d+)/);
                    if (matches && matches[1]) {
                        return parseInt(matches[1], 10);
                    }
                }
                return null;
            });
        }
    }

    const observeTbodyExpansion = () => {
        const tbody = document.querySelector("#torrent_table tbody");
        if (!tbody) return;

        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    // Check if the added nodes contain the expanded rows
                    if ([...mutation.addedNodes].some(node => node.tagName === "TR")) {
                        // Rows added, rerun the script
                        torrentsPageMain();
                        break;
                    }
                }
            }
        });

        // Start observing changes within the tbody
        observer.observe(tbody, { childList: true });
    };

    function uploadPageMain(addingFormat) {
        let disableReasons = {
            isDupe: false,
            isBannedGroup: false
        };

        const bannedGroups = [
            "3LTON", "4yEo", "ADE", "AFG", "AniHLS", "AnimeRG", "AniURL", "AROMA", "aXXo", "Brrip", "CHD", "CM8", "CrEwSaDe", "d3g", "DDR", "DNL",
            "DeadFish", "ELiTE", "eSc", "FaNGDiNG0", "FGT", "Flights", "FRDS", "FUM", "HAiKU", "HD2DVD", "HDS", "HDTime", "Hi10", "ION10", "iPlanet",
            "JIVE", "KiNGDOM", "Leffe", "LiGaS", "LOAD", "MeGusta", "MkvCage", "mHD", "mSD", "NhaNc3", "nHD", "NOIVTC", "nSD", "Oj", "Ozlem", "PiRaTeS",
            "PRoDJi", "RAPiDCOWS", "RARBG", "RetroPeeps", "RDN", "REsuRRecTioN", "RMTeam", "SANTi", "SicFoI", "SPASM", "SPDVD", "STUTTERSHIT", "TBS",
            "Telly", "TM", "UPiNSMOKE", "URANiME", "WAF", "xRed", "XS", "YIFY", "YTS", "Zeus", "ZKBL", "ZmN", "ZMNT"
        ];

        function evaluateButtonState() {
            const torrentSubmitButton = document.getElementById('torrentSubmit');
            const shouldDisable = Object.values(disableReasons).some(reason => reason);

            torrentSubmitButton.disabled = shouldDisable;
            torrentSubmitButton.style.backgroundColor = shouldDisable ? '#A9A9A9' : '';
            torrentSubmitButton.style.pointerEvents = shouldDisable ? 'none' : '';
            torrentSubmitButton.classList.toggle('no-hover', shouldDisable);
            torrentSubmitButton.title = shouldDisable ? "Please check the ANTelligence message above to click this button" : "";
        }

        function checkForDupe() {
            const matchesCriteria = infoArrays.some(release => Object.keys(currentSelections).every(property => release[property] == currentSelections[property]));
            disableReasons.isDupe = matchesCriteria;
            manageWarningMessage(matchesCriteria, 'Dupe', "<br>ANTelligence has noticed this upload may fill the same slot as an existing release.<br>Check this box if you think this is an error, or your release would trump the other release:");

            evaluateButtonState();
        }

        function checkForBannedGroup() {
            const releaseGroupInput = document.getElementById('releasegroup');
            const isBanned = bannedGroups.includes(releaseGroupInput.value.trim());

            disableReasons.isBannedGroup = isBanned;
            manageWarningMessage(isBanned, 'BannedGroup', "<br>ANTelligence noticed you're trying to upload a release from a banned group, you won't be able to upload this.");

            evaluateButtonState();
        }

        function manageWarningMessage(condition, idSuffix, message) {
            let warningMessage = document.getElementById(`warningMessage${idSuffix}`);
            const torrentSubmitButton = document.getElementById('torrentSubmit');

            if (condition) {
                if (!warningMessage) {
                    warningMessage = document.createElement('div');
                    warningMessage.id = `warningMessage${idSuffix}`;
                    warningMessage.innerHTML = `<strong style="color: red;">${message}</strong>`;
                    if (idSuffix === 'Dupe') {
                        warningMessage.innerHTML += ' <input type="checkbox" id="overrideWarning">';
                    }
                    warningMessage.style.marginBottom = '10px';
                    torrentSubmitButton.parentNode.insertBefore(warningMessage, torrentSubmitButton.nextSibling);

                    if (idSuffix === 'Dupe') {
                        const checkbox = document.getElementById('overrideWarning');
                        checkbox.addEventListener('change', function() {
                            disableReasons.isDupe = !this.checked;
                            evaluateButtonState();
                        });
                    }
                }
                warningMessage.style.display = '';
            } else if (warningMessage) {
                warningMessage.style.display = 'none';
                if (idSuffix === 'Dupe') {
                    document.getElementById('overrideWarning').checked = false;
                }
            }
        }

        function updateSelections() {
            const isHDR10Checked = document.getElementById('edition5').checked;
            const isDVChecked = document.getElementById('edition6').checked;
            const isRemuxChecked = document.getElementById('edition11').checked;
            const is3DChecked = document.getElementById('edition12').checked;
            const isSceneChecked = document.getElementById('censored').checked;

            const editionIds = ['edition0', 'edition1', 'edition2', 'edition3', 'edition4'];
            currentSelections.edition = Enumerations.Edition.standard;

            for (let id of editionIds) {
                const checkbox = document.getElementById(id);
                if (checkbox && checkbox.checked) {
                    // Update edition based on the first checked box
                    currentSelections.edition = Enumerations.Edition[checkbox.value.toLowerCase()];
                    break; // Stop after finding the first checked edition
                }
            }
            // Update DynamicRange
            if (isHDR10Checked && isDVChecked) {
                currentSelections.dynamicRange = Enumerations.DynamicRange.both;
            } else if (isHDR10Checked || isDVChecked) {
                currentSelections.dynamicRange = Enumerations.DynamicRange.hdr;
            } else {
                currentSelections.dynamicRange = Enumerations.DynamicRange.sdr;
            }

            // Update ReleaseType
            currentSelections.releaseType = isRemuxChecked ? Enumerations.ReleaseType.remux : Enumerations.ReleaseType.encode;

            // Update Dimensions
            currentSelections.dimensions = is3DChecked ? Enumerations.Dimensions["3d"] : Enumerations.Dimensions["2d"];

            // Update isScene based on the "censored" checkbox
            currentSelections.isScene = isSceneChecked ? Enumerations.SceneP2P.scene : Enumerations.SceneP2P.p2p;

            checkForDupe();
        }

        function initializeUploadDupeCheck() {
            // Attach event listeners to update the selections
            document.querySelector('select[name="media"]').addEventListener('change', function() {
                currentSelections.sourceMedia = Enumerations.SourceMedia[this.value.toLowerCase()] || null;
                checkForDupe();
            });

            document.querySelector('select[name="ressel"]').addEventListener('change', function() {
                currentSelections.resolution = Enumerations.Resolution[this.value.toLowerCase()] || null;
                checkForDupe();
            });

            document.querySelector('select[name="codec"]').addEventListener('change', function() {
                currentSelections.videoCodec = Enumerations.VideoCodec[this.value.toLowerCase()] || null;
                checkForDupe();
            });

            // Initialize selections
            document.querySelectorAll('select').forEach(select => {
                let event = new Event('change');
                select.dispatchEvent(event);
            });

            // Attach the event listener to all relevant checkboxes
            document.querySelectorAll('input[type="checkbox"][name="flags[]"]').forEach(checkbox => {
                checkbox.addEventListener('change', updateSelections);
            });
            document.getElementById('censored').addEventListener('change', updateSelections);
        }

        function addCollapsibleListCSS() {
            const style = document.createElement('style');
            style.innerHTML = `
            .collapsible {
                cursor: pointer;
                color: white;
                text-decoration: underline;
            }

            .collapsible-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.2s ease-out;
            }

            .collapsible-list {
                display: flex;
                flex-wrap: wrap;
                list-style-type: none; /* Removes the default list styling */
                padding: 0; /* Removes default padding */
                margin: 0; /* Removes default margin */
            }

            .collapsible-list li {
                flex: 1 0 16%; /* Adjust the number to change how many items per line, 20% for 5 items per line */
                margin-bottom: 5px; /* Adds a little space below each item */
            }

            .collapsible-list li.flex-filler {
                visibility: hidden;
            }

            .fixed-layout-table {
                table-layout: fixed; /* Prevents columns from resizing */
                width: 100%;
            }
            .fixed-layout-table td:first-child {
                width: 17%; /* Set fixed width for the first column */
            }
            `;
            document.head.appendChild(style);
        }

        function createCollapsibleBannedGroupsList() {
            addCollapsibleListCSS();
            // Find the <td> containing the text "Explicitly Banned Groups"
            const cells = Array.from(document.querySelectorAll('td'));
            const targetCell = cells.find(cell => cell.textContent.includes("Explicitly Banned Groups"));
            targetCell.closest('table').classList.add('fixed-layout-table');

            // Ensure the next sibling <td> exists
            if (targetCell && targetCell.nextElementSibling) {
                const bannedGroupsCell = targetCell.nextElementSibling;

                // Clear the existing content of the cell
                bannedGroupsCell.innerHTML = '';

                // Create the clickable text for expanding/collapsing the list
                const collapsible = document.createElement('span');
                collapsible.textContent = 'Click here to see banned groups list';
                collapsible.className = 'collapsible';

                // Create the container for the collapsible content
                const content = document.createElement('div');
                content.className = 'collapsible-content';

                // Populate the container with the list of banned groups
                const list = document.createElement('ul');
                list.className = 'collapsible-list';
                bannedGroups.forEach(group => {
                    const item = document.createElement('li');
                    item.textContent = group;
                    list.appendChild(item);
                });
                // Add invisible flex-fillers to ensure alignment
                const itemsPerRow = 5;
                const fillerCount = itemsPerRow - (bannedGroups.length % itemsPerRow);
                if (fillerCount < itemsPerRow) {
                    for (let i = 0; i < fillerCount; i++) {
                        const fillerItem = document.createElement('li');
                        fillerItem.className = 'flex-filler';
                        fillerItem.textContent = '.';
                        list.appendChild(fillerItem);
                    }
                }

                content.appendChild(list);

                // Add the clickable text and the container to the cell
                bannedGroupsCell.appendChild(collapsible);
                bannedGroupsCell.appendChild(content);
                // Add event listener for toggling the list's visibility
                collapsible.addEventListener('click', () => {
                    const isCollapsed = content.style.maxHeight;
                    content.style.maxHeight = isCollapsed ? null : content.scrollHeight + "px";
                    collapsible.textContent = isCollapsed ? 'Click here to see banned groups list' : 'Click to collapse';
                });
            }
        }

        const infoArrays = decodeFromSlug(JSON.parse(sessionStorage.getItem('infoArrays')));
        let currentSelections = {
            sourceMedia: null,
            resolution: null,
            videoCodec: null,
            dynamicRange: Enumerations.DynamicRange.sdr,
            releaseType: Enumerations.ReleaseType.encode,
            dimensions: Enumerations.Dimensions["2d"],
            isScene: Enumerations.SceneP2P.p2p,
            edition: Enumerations.Edition.standard
        };
        if (addingFormat) {
            initializeUploadDupeCheck();
            updateSelections();
        }
        createCollapsibleBannedGroupsList();

        document.getElementById('releasegroup').addEventListener('input', checkForBannedGroup);
        checkForBannedGroup()
    }

    (function() {
        const thisPage = window.location.pathname.match(/\/(.*)\.php/)[1];
        const searchParams = new URLSearchParams(window.location.search);

        if (thisPage === "torrents" && searchParams.has("id")) {
            torrentsPageWithIdMain();
        } else if (thisPage === "reportsv2") {
            waitForElements(["#type", "#sitelink", "#extra"], reportsPageMain);
        } else if (thisPage === "torrents") {
            torrentsPageMain();
            observeTbodyExpansion();
        } else if (thisPage === "upload"){
            uploadPageMain(searchParams.has("groupid"));
        }
    })();
})();