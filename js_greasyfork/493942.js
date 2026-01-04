// ==UserScript==
// @name         Entity Manager - Mass EDUID Lookup
// @namespace    http://tampermonkey.net/
// @version      2025.10.15.38
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @description  Performs quick lookup of spreadsheet of EDUID corrections against EDUID records.
// @author       Vance M. Allen, Idaho State Board of Education
// @match        https://apps2.sde.idaho.gov/EntityManager/Person*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493942/Entity%20Manager%20-%20Mass%20EDUID%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/493942/Entity%20Manager%20-%20Mass%20EDUID%20Lookup.meta.js
// ==/UserScript==

/* globals $ */
(function main() {
    'use strict';
    let APP = 'Mass EDUID Lookup';
    let COPIEDNAME_REGEX = /^(\d{9}): ([\w.]+([- ][\w.]+)*), (\w[\w.]*([- ]\w[\w.]*)*) \(DOB (\d+\/\d+\/\d+)\) ([MF])(emale|ale)$/;
    let DOB_REGEX = /^(0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])[/-](19|20)\d\d$/;
    let GENDER_REGEX = /^(Male|M|Female|F)$/i;
    let SUFFIX_REGEX = /(^|\b)(SR\.?|JR\.?|SENIOR|JUNIOR|I+[VX]?|[VX]I*|XIV|XVI*|XIX|XX)(\b|$)/gi;
    let VERSION = '2025.10.15.38';
    let TEMPLATE = `<div>
        <div class="row"><div id="meuFlexContainer class="col-sm-12" style="display: flex;">
            <h2 id="meuFlexHeading">${APP}, v${VERSION}</h2>
            <span id="meuFlexActions">
                OTIS: <input type="text" id="txtOTIS" name="OTIS" class="vmaOTIS" value="" size="6" maxlength="6" style="background: #EEE;">
                <button id="btnStartOver" class="hide k-button k-button-iconitext"><span class="k-sprite fa fa-undo"></span>Start Over</button>
                <button class="hide k-button k-button-iconitext vmaRefresh vmaLookup"><span class="k-sprite fa fa-refresh"></span>Refresh</button>
                <button class="hide k-button k-button-iconitext vmaCopy vmaLookup"><span class="k-sprite fa fa-copy"></span>Copy</button>
            </span>
            <span id="meuFlexMessages" class="hidden">Testing 1 2 3</span>
        </div></div>
        <div id="divEduIdLookupContents" class="row">
            <div class="col-sm-1">Paste Template:</div>
            <div class="col-sm-11"><textarea id="txtEduidTemplate"></textarea></div>
        </div>
    </div>`;

    let _styles = {};
    let addMenu = (dest,id,label) => {
        let $newItem = $(`<li class="k-item k-menu-item k-last" role="menuitem"><a id="${id}" class="k-link k-menu-link" href="${dest?dest:'#vmaMassEduIdLookup'}"><span class="k-menu-link-text">${label}</span></a></li>`);
        let $newRootItem = $newItem.clone().attr('id',`root${id}`);

        $('#PersonNameQueue').removeClass('k-last').after($newItem);

        if($('#loggedInAsText').next('li').find('.k-menu-link-text').text().split('@')[0] === 'revans') {
            // Quicker access to "Mass EDUID Lookup" for Roger!
            $('#HeadMenu > li.menu-right').first().before($newRootItem);
        }
        return $(`#${id},#root${id}`);
    }
    let addStyling = function(selector,keys,value) {
        // Prevent reinserting style tag
        if(!$('#vmaStyling').length) $('body').append($('<style id="vmaStyling">'));
        // Initialize object if needed
        if(!_styles[selector]) _styles[selector] = {};
        // Convert single item/value pair into array, if needed.
        if(!Array.isArray(keys)) keys = [keys,value];
        // Parse array and set/update styles
        for(let i = 0; i < keys.length; i = i + 2) {
            _styles[selector][keys[i]] = keys[i+1];
        }
        // Set up CSS with styles
        let css = '';
        for(selector of Object.keys(_styles)) {
            css += selector + ' {\n'
            for(let key of Object.keys(_styles[selector])) {
                css += '\t' + key + ': ' + _styles[selector][key] + ';\n'
            }
            css += '}\n\n';
        }
        $('#vmaStyling').html(css);
    }; // end addStyling()
    let copy = function() {
        let messages = {
            badEduids: ['The following were not found in the EDUID system with the supplied EDUIDs. Please determine the correct EDUID and submit the needed corrections for these.'],
            errors: ['One or more items on the submitted spreadsheet had invalid data for these people. Please review the latest EDUID status below and advise if further changes are needed to these.'],
            merged: ['An existing EDUID was found with the correct information, so your EDUID was merged into it. Please update your system(s) to use this EDUID:'],
            warnings: ['One or more discrepancies between the submitted spreadsheet and the EDUID system exist. The latest EDUID status is below. Please confirm against legal documentation and advise if further changes are needed to these.'],
            updated: ['Updated!']
        };

        $('#tblEduIdLookupData tr').each((i,x) => {
            let $row = $(x);
            let es = $row.data('eduidSystem');
            let rowLookup = selector => $row.find(selector).text();

            // If an invalid EDUID was presented, then we need to display what we were given originally so the user has some idea what row(s) have a problem.
            if(!es?.eduids) {
                es.eduid = rowLookup('.eduid');
                es.fullName = (rowLookup('.last') + ', ' + rowLookup('.first') + ' ' + rowLookup('.middle') + ' ' + rowLookup('.suffix')).replace(/\s+/g,' ').trim();
                es.dob = rowLookup('.dob');
                es.genderFull = rowLookup('.gender') ? (rowLookup('.gender') === 'M' ? 'Male' : 'Female') : '';
            }

            let processed = {};
            let rowStatus = {
                badEduids: $row.find('.eduid.mismatchError').length,
                errors: $row.find('.mismatchError:not(.eduid)').length,
                merged: $row.find('.eduid').text() !== es.eduid,
                warnings: $row.find('.mismatchGeneral:not(.eduid):not(.mismatchCase)').length
            };
            let strToCopy = `${es.eduid}: ${es.fullName} (DOB ${es.dob}) ${es.genderFull}`;

            // Scan through the row statuses and update the appropriate arrays.
            for(let status of Object.keys(rowStatus)) {
                // If this row falls into this status...
                if(rowStatus[status]) {
                    // Yes, so add it to this status and mark it as processed.
                    messages[status].push(strToCopy);
                    processed[strToCopy] = true;
                }
            }

            // If we got this far and it hasn't been processed, then it must've been a successful update.
            if(!processed[strToCopy]) {
                messages.updated.push(strToCopy);
                processed[strToCopy] = 'updated';
            }
        });

        // Prevent use of each array if the only thing in it was the message, and prepare the final message for copying into OTIS.
        let finalMessage = '';
        for(let status of Object.keys(messages)) {
            if(messages[status].slice(1).length) {
                finalMessage += (finalMessage ? '\n\n' : '') + messages[status].join('\n');
            }
        }

        // Copy the text to the clipboard.
        navigator.clipboard.writeText(finalMessage).then(
            function copySuccess() {
                let $copy = $('.vmaCopy');
                let text = (copying=true) => {
                    $copy[0].childNodes[1].textContent = copying ? 'Copied!' : 'Copy';
                    $copy.toggleClass('green',copying);
                };
                text();
                setTimeout(x => { text(false) }, 5000);
                log('Copied:\n--------------------------------------------------------------\n'+finalMessage);
            },
            function copyFailure(err) {
                log('error','An error occurred copying the EDUID record to the clipboard.',err);
            }
        );
    };
    let loading = function(show = true) {
        // If loading screen already added, bail.
        if($('#vmaLoading').length && show) return;

        let $body = $('body:first').css('overflow',show ? 'hidden' : 'auto');
        if(show) {
            $('<div id="vmaLoading" class="loadingSpinner"></div><div></div>').appendTo($body);
        }
        else {
            $('#vmaLoading,#vmaLoading+div').remove();
        }
    }; // end loading()
    let log = function(...a) {
        // Due to strict mode, this is necessary to be able to get at the calling function name.
        let callingFunction;
        try {
            throw new Error();
        }
        catch(e) {
            callingFunction = e.stack.split('at ')[2].split(' ')[0];
            if(callingFunction.indexOf('<anonymous>')>-1) console.debug(e.stack);
        }

        // Determine logType by checking first parameter to see if it's a logType. If not, assume "debug".
        const logType = ['log','info','warn','error','debug'].includes(a[0]) ? a[0] : 'debug';

        // If the first parameter is the logType, take it out of the array of things to log.
        if(a[0] === logType) a.shift();

        // Log to console using the logType including notation for app and version.
        console[logType](`[${APP} v${VERSION} - ${callingFunction}()]`,...a);
    };
    let otisValidation = function(e){
        // Allow 0-9. Anything else, ignore.
        switch(true) {
            case /\d/.test(e.key):
                setTimeout(() => {
                    $('a[id^="lnkEdit_"]').attr('href',(i,x) => {
                        // If OTIS is already in the link, update it. Otherwise, add it to the link.
                        return x.match(/&otis=\d+/) ? x.replace(/&otis=\d+/,`&otis=${$('#txtOTIS').val()}`) : x + '&otis=' + $('#txtOTIS').val()
                    });
                });
                return true;
            default:
                return false;
        };
    }

    log('warn','Initialized');
    //addMenu('','lnkMassEduidLookup',APP).on('click',() => $('.container-fluid').html(TEMPLATE).find('textarea').focus());
    addMenu('','lnkMassEduidLookup',APP).on('click',() => {
        $('#main-content>div:first-of-type').html(TEMPLATE).find('textarea').focus();

        // 2025.02.28.28 - Start Over button, due to menu item being buried in menus now...
        $('#btnStartOver').on('click',() => $('#lnkMassEduidLookup').trigger('click'));
    });
    addStyling('.hidden','display','none !important');
    addStyling('.green','background','lightgreen !important');
    addStyling('.k-button',['justify-content','initial','min-width','6em','text-align','left']);
    addStyling('.mismatchError,.mismatchGeneral.mismatchError',['background','red !important','color','white !important','box-shadow','none !important']);
    addStyling('.mismatchGeneral',['background-color','gold !important','box-shadow','none !important']);
    addStyling('.mismatchCase',['background','yellow !important','box-shadow','none !important']);
    addStyling('.row div h2,.vmaCopy.vmaLookup',['display','inline-block','margin','0.5em','vertical-align','middle']);
    addStyling('.row:has(div h2)',['position','sticky','top','-10px','z-index','1','background','white']);
    addStyling('.row thead tr',['position','sticky','top','3.2em','z-index','1']);
    addStyling('.k-button-action',['display','inline-block','min-width','initial !important','padding','0','width','2em !important']);
    addStyling('.k-button-action a,.k-button-action>span',['display','inline-block','text-align','center','width','2em']);
    //addStyling('.k-button-action .fa-external-link','margin-left','initial');

    // Style header
    //addStyling('#meuFlexContainer','display','flex');
    //addStyling('#meuFlexHeading',[]);
    addStyling('#meuFlexActions','margin','0.5em');
    addStyling('#meuFlexMessages',['background','#ffa','display','inline-flex','flex-grow','1','font-size','150%','padding','0.5em','vertical-align','middle','padding-top','1em','justify-content','center']);

    // If user refreshed the page and the bookmark is in the URL, jump to the Mass EDUID Lookup tab.
    if(window.location.hash === '#vmaMassEduIdLookup') $('#lnkMassEduidLookup').click();

    $(document,'#txtEduidTemplate').on('paste',function(e) {
        // 2025.04.07.30 - To prevent unintended execution, because somehow this function otherwise runs on pastes to txtGiven.
        if(e.target.id !== 'txtEduidTemplate') {
            console.log(e.target.id);
            return;
        }

        let pasteData = e.originalEvent.clipboardData.getData('text/plain');
        $('#divEduIdLookupContents').html(
            `<div class="k-grid">
                <table id="tblEduIdLookup" class="table table-condensed table-striped">
                    <colgroup>
                        <!-- Actions --><col style="width: 8em;">
                        <!-- EduId   --><col/>
                        <!-- First   --><col/>
                        <!-- Middle  --><col/>
                        <!-- Last    --><col/>
                        <!-- Suffix  --><col/>
                        <!-- DOB     --><col/>
                        <!-- Gender  --><col/>
                        <!-- Prior   --><col/>
                        <!-- DocType --><col/>
                        <!-- DocDate --><col/>
                    </colgroup>
                    <thead class="k-grid-header">
                    <tr>
                        <th class="k-header">Actions</th>
                        <th class="k-header">EduId</th>
                        <th class="k-header">First Name(s)</th>
                        <th class="k-header">Middle Name(s)</th>
                        <th class="k-header">Last Name(s)</th>
                        <th class="k-header">Suffix</th>
                        <th class="k-header">DOB</th>
                        <th class="k-header">Gender</th>
                        <th class="k-header">Prior Information</th>
                        <th class="k-header">Document Type</th>
                        <th class="k-header">Doc Issue Date</th>
                    </tr>
                </thead>
                <tbody id="tblEduIdLookupData"></tbody>
            </table>
        </div>`);

        const tabbedData = !(pasteData.indexOf('\t') < 0);
        const rows = pasteData.trimRight().split(/\r?\n/);

        // Parse for header row
        const headerRow = /\b(eduid_?1?|idstuid|idstaffid)\b/i.test(rows[0]);
        let headings = headerRow ? rows[0].split('\t') : ['EduId'];

        // 2025.04.07.32 - Try to detect if SRM headers didn't paste well
        if(headings[0] == 'Violations' && ['idStuId','idStaffId'].includes(headings[1].split(' ')[0])) headings.unshift('');

        if(headerRow) {
            rows.shift();
        }
        else if(
            (rows.length > 1 && !/\b\d{9}\b/.test(rows[1])) ||
            (rows.length && !/\b\d{9}\b/.test(rows[0]))
        ) {
            // Did not locate anything EDUIDish in the data; that's no bueno!
            $('#tblEduIdLookupData').append(`<tr><td colspan="100%"><span class="fa fa-warning" style="color: orangered; margin-right: 2px;"></span>Invalid paste data received. Please try again.</td></tr>`);
            return;
        }

        // Determine column numbering of supplied headers
        let mappings = {
            eduid: null,
            first: null,
            middle: null,
            last: null,
            suffix: null,
            dob: null,
            gender: null,
            prior: null,
            docType: null,
            docDate: null
        };
        let fieldAliases = {
            eduid: ['\\bidstuid\\b','\\bidstaffid\\b'],
            first: null,
            middle: null,
            last: null,
            suffix: null,
            dob: ['birthday','birthdate'],
            gender: ['sex'],
            prior: null,
            docType: ['\\bdocument\\b','documenttype'],
            docDate: ['docissuedate','documentdate']
        };

        // Figure out where in the template the user has given us columns
        for(let m of Object.keys(mappings)) {
            let tmp = headings.filter(x => {
                // 2025.04.07.31 - Fix regression in header identification - SRM sometimes includes "ascending/descending sort" in header name.
                return new RegExp(m + (fieldAliases[m] ? '|' + fieldAliases[m].join('|') : ''),'i').test(
                    x.replace(/(\W|(a|de)scending sort)/g,'')
                )
            })[0];
            mappings[m] = headings.indexOf(tmp);
        }

        console.log('headings: ', headings);
        console.log('mappings: ', mappings);

        // Cycle through the rows and populate the table
        for(const row of rows) {
            // Break out the columns using tab-delimiters, and trim any whitespace found.
            // v2024.11.22.26 - Convert ALT+255 spaces into normal spaces
            const cols = tabbedData ? row.split('\t').map(x => x.replace(/ /g,' ').trim()) : [row.trim()];

            // Do a quick check and make sure valid data exists
            if(!/\b\d{9}\b/.test(cols[mappings.eduid])) {
                // Nothing EDUID-like was found! Move onto the next row.
                continue;
            }
            else if(/^\d{9}$/.test(cols[mappings.eduid])) {
                // Just an EDUID. Nice, no further cleanup needed.
            }
            else if(COPIEDNAME_REGEX.test(cols[mappings.eduid])) {
                // We got a row that matches our default copy template.
                let discardPile = ['',''];
                let fullText = cols[mappings.eduid];

                // Fix the mappings
                [
                    mappings.last,
                    mappings.first,
                    mappings.middle,
                    mappings.suffix,
                    mappings.dob,
                    mappings.gender
                ] = [1,2,3,4,5,6];

                // Fix the columns
                [
                    cols[mappings.eduid],
                    cols[mappings.last],
                    discardPile[0],
                    cols[mappings.first],
                    discardPile[1],
                    cols[mappings.dob],
                    cols[mappings.gender]
                ] = fullText.match(COPIEDNAME_REGEX).slice(1,8);

                // Check if there are middle name(s) and fix the column further if so.
                if(cols[mappings.first].split(' ')[1]) {
                    let temp = cols[mappings.first].split(' ');
                    cols[mappings.middle] = temp.slice(1).join(' ');
                    cols[mappings.first] = temp.slice(0,1)[0];
                }

                // Check if the middle name(s) include a suffix
                if(SUFFIX_REGEX.test(cols[mappings.middle]?.split(' ').slice(-1))) {
                    let temp = cols[mappings.middle].split(' ');
                    cols[mappings.suffix] = temp.slice(-1)[0];
                    cols[mappings.middle] = temp.slice(0,temp.length-1);
                }

                // Notify the user that only an EDUID lookup was able to be provided, and names shown are those in the EDUID system.
                $('#meuFlexMessages').text('Note: Pasted content looks like Mass EDUID Lookup copied content.').removeClass('hidden');
            }
            else if(cols[mappings.eduid].match(/\b\d{9}\b/)) {
                // Try to scan the received data for an EDUID and pull that out.
                cols[mappings.eduid] = cols[mappings.eduid].match(/\b\d{9}\b/)[0];

                // Notify the user that only an EDUID lookup was able to be provided, and names shown are those in the EDUID system.
                $('#meuFlexMessages').text('Note: Parser was only able to use EDUIDs from one or more lines of the pasted content.').removeClass('hidden');
            }
            else {
                throw ['UNHANDLED EXCEPTION FOR EDUID PARSING',cols[mappings.eduid]];
            }

            // Quick access to OTIS ticket and given/family names for the QoL script
            let givenNames = encodeURIComponent(((cols[mappings.first]??'') + ' ' + (cols[mappings.middle]??'') + ' ' + (cols[mappings.suffix]??'')).replace(/\s+/g,' ').trim());
            let familyNames = encodeURIComponent(cols[mappings.last]??'');
            let nameHelper = givenNames && familyNames ? `&gn=${givenNames}&fn=${familyNames}` : '';
            let otis = isNaN($('#txtOTIS').val()?.trim()/1) ? '' : $('#txtOTIS').val().trim();

            // DOB normalization - Drop leading zeros on MM/DD to
            cols[mappings.dob] = cols[mappings.dob]?.replace(/\d+/g,x => /^0\d$/.test(x) ? x.slice(-1) : x);

            // Make gender capitalized, just in case it's not.
            // 2025.07.17.35 - If user provides fully written out gender, use mixed case instead of all caps.
            genderChecks: {
                let gender = cols[mappings.gender];
                cols[mappings.gender] = gender?.charAt(0).toUpperCase() + (gender.length>1 ? gender.slice(1).toLowerCase() : '');
            }

            // Append the data into the table
            // 2024.11.15.25 - Corrected ID to actions cells; should not have reused "actions" as ID. Now has unique IDs and "actions" class.
            $('#tblEduIdLookupData').append(
                `<tr id="row_${cols[mappings.eduid]}">` +
                `<td id="actions_${cols[mappings.eduid]}" class="actions">` +
                `    <input type="checkbox">` +
                `    <button type="button" class="k-button k-button-action">` +
                `        <a id="lnkEdit_${cols[mappings.eduid]}" target="_blank" href="/EntityManager/Person/View?eduId=${cols[mappings.eduid]}${nameHelper}${otis?'&otis='+otis:''}">` +
                `            <span class="fa fa-external-link"></span>` +
                `        </a>` +
                `    </button>` +
                `    <button type="button" class="k-button k-button-action vmaRefreshSingle">` +
                `        <span class="fa fa-refresh" data-eduid="${cols[mappings.eduid]}"></span>` +
                `    </button>` +
                `</td>` +
                Object.keys(mappings).map(m => `<td class="data ${m}">` + (cols[mappings[m]] ?? '') + `</td>`).join() + `</tr>`
            );

            // 2024.11.01.23 - Preserve row's column data in the row
            $(`#row_${cols[mappings.eduid]}`).data('row',cols);
        }

        // Rig up the Copy and Refresh buttons, and then trigger Refresh.
        // 2024.11.01.23 - Making selectors more specific to minimize possible conflict with other scripts
        // 2024.11.15.25 - Correct regression to single line refresh
        $('#meuFlexActions .vmaCopy').on('click',copy);
        $('#meuFlexActions .vmaOTIS').on('keypress',otisValidation);
        $('#meuFlexActions .vmaRefresh').on('click',x => parseTable(mappings)).trigger('click');
        $('.actions .vmaRefreshSingle').on('click',x => parseTable(mappings,x));

        // No longer a need to hide refresh/copy.
        $('h2').closest('div').find('button').removeClass('hide');
    });

    // By the time we're here, the data has been parsed and placed, so now we can get to work.
    let parseTable = function(mappings,single=false) {
        let promises = [];
        let rowSelector = single ? `#tblEduIdLookupData tr#row_${$(single.target).data('eduid')}` : '#tblEduIdLookupData tr';

        // Set up a loading screen while processing.
        loading();

        $(rowSelector).each(function trSearch(i,r) {
            let $row = $(r);
            let row = {};
            $row.find('td.data').each((i,x) => { row[Object.keys(mappings)[i]] = x.innerText; });
            row.givenNames = `${row.first} ${row.middle} ${row.suffix}`.replace(/\s+/g,' ').trim();
            row.familyNames = row.last;
            row.fullName = `${row.familyNames}, ${row.givenNames}`;

            // Safety net to avoid bombing out Entity Manager logs with bad AJAX calls
            if(!/^\d{9}$/.test(row.eduid)) {
                // Clear the loading dialog
                loading(false);

                // Prevent further execution of the function due to bad data.
                log('error','INVALID OR MISSING EDUID RECEIVED',row.eduid,row);
                return;
            }
            else if(['123456789','987654321','113355779','997755331'].includes(row.eduid)) {
                // Fake EDUIDs from the EDUID template. Don't bother looking those up. Get them off the sheet and bail.
                log('warn','Stripping out demonstration data from processing.',row);
                $row.remove();
                return;
            }

            // Add AJAX into promises array
            promises.push(
                $.get(`/EntityManager/Person/View?eduId=${row.eduid}`).then(
                    function promisesPush(html) {
                        // Parse out the retrieved HTML for the needed components
                        let eduidSystem = new function() {
                            let $html = $(html);
                            this.eduids = $html.find('div.row:contains(EduId)').find('.col-sm-2,.col-sm-10').filter((j,x) => {
                                return row.eduid === x.innerText.trim().match(/\d{9}/)?.[0];
                            }).text().match(/\d{9}/g);

                            // If there are no matches in the EDUID system, then bail.
                            if(!this.eduids) {
                                this.eduid = '';
                                return;
                            }

                            // Otherwise, determine if there's an EDUID merge.
                            this.eduid = this.eduids?.[1] ? this.eduids[1] : this.eduids[0];
                            this.names = $html.find('div.row:contains(Name)').find('.col-sm-10').text().trim().split(/\n\s*/);
                            this.last = this.names[1];
                            this.givenNames = this.names[0];
                            this.fullName = this.last + ', ' + this.givenNames;
                            this.dob = $html.find('#birthdate').text().trim().match(/^\d+\/\d+\/\d+/)[0]; // Revised pattern to allow for age from QoL
                            this.gender = $html.find('#gender').text().trim();
                            this.genderFull = this.gender === 'M' ? 'Male' : 'Female';

                            // Special parsing needed for first, middle, and suffix.
                            let givenNames = this.givenNames.split(' ');
                            let numFirstNames = row.first.split(' ').length;

                            this.first = givenNames.slice(0,numFirstNames).join(' ') ?? '';
                            this.middle = givenNames.slice(numFirstNames).join(' ') ?? '';

                            let hasSuffix = !!row.suffix;

                            // I have absolutely no idea why this works, but for some reason, I have to run this check twice for it to work reliably. I've never
                            // seen this before and have no idea why it's necessary. There has to be something stupid I'm missing but I'm over trying to find it.
                            let suffixDetected = SUFFIX_REGEX.test(this.middle.split(' ')?.slice(-1)[0]) || SUFFIX_REGEX.test(this.middle.split(' ')?.slice(-1)[0]);

                            if(suffixDetected) {
                                // 2024.11.01.23 - In a few cases, sometimes middle names look like a Suffix. Check if this is one of those cases.
                                if(this.middle === row.middle) {
                                    this.suffix = '';
                                }
                                else {
                                    let temp = givenNames.slice(numFirstNames);
                                    this.middle = temp;
                                    this.suffix = this.middle.pop() ?? '';
                                    this.middle = this.middle.join(' ') ?? '';
                                }
                            }
                            else {
                                this.suffix = '';
                            }
                        };

                        // Perform comparisons
                        let mismatches = {
                            mismatchGeneral: [],
                            mismatchCase: [],
                            mismatchError: []
                        };

                        // Allow for message overrides if needed.
                        let messageOverride = '';

                        // Comparison - EDUID
                        if(!eduidSystem.eduids) {
                            // If no EDUIDs in the EDUID system, then there's not really anything else we can do here. Bail.
                            mismatches.mismatchError.push('eduid');
                            messageOverride = 'Requested EDUID does not exist in the EDUID system!';
                        }
                        else if(eduidSystem.eduids[1]) {
                            mismatches.mismatchGeneral.push('eduid');

                            // Fix the hyperlink to edit the main EDUID.
                            $row.find(`#lnkEdit_${row.eduid}`).attr('href',(i,x) => x.replace(row.eduid,eduidSystem.eduids[1]));
                        }
                        // If everything is coming from EDUID system, just plug it all into the table.
                        if(!row.last && !row.first) {
                            $row.find('.first').text(eduidSystem.first);
                            $row.find('.middle').text(eduidSystem.middle);
                            $row.find('.last').text(eduidSystem.last);
                            $row.find('.suffix').text(eduidSystem.suffix);
                            $row.find('.dob').text(eduidSystem.dob);
                            $row.find('.gender').text(eduidSystem.gender);
                        }
                        // Remaining comparisons only valid if a good EDUID was sent.
                        else if(eduidSystem.eduids) {
                            // Comparison - Last
                            if(eduidSystem.last !== row.last) mismatches.mismatchGeneral.push('last');
                            if(mismatches.mismatchGeneral.includes('last') && eduidSystem.last.toLowerCase() === row.last.toLowerCase()) mismatches.mismatchCase.push('last');
                            // Comparison - First
                            if(eduidSystem.first !== row.first) mismatches.mismatchGeneral.push('first');
                            if(mismatches.mismatchGeneral.includes('first') && eduidSystem.first.toLowerCase() === row.first.toLowerCase()) mismatches.mismatchCase.push('first');
                            // Comparison - Middle
                            if(eduidSystem.middle !== row.middle) mismatches.mismatchGeneral.push('middle');
                            if(mismatches.mismatchGeneral.includes('middle') && eduidSystem.middle.toLowerCase() === row.middle.toLowerCase()) mismatches.mismatchCase.push('middle');
                            // Comparison - Suffix
                            if(eduidSystem.suffix !== row.suffix) mismatches.mismatchGeneral.push('suffix');
                            if(mismatches.mismatchGeneral.includes('suffix') && eduidSystem.suffix.match(/\w+/i)?.[0] === row.suffix.match(/\w+/i)?.[0]) mismatches.mismatchCase.push('suffix');
                            // Comparison - DOB
                            if(!DOB_REGEX.test(row.dob)) mismatches.mismatchError.push('dob');
                            if(eduidSystem.dob !== row.dob) mismatches.mismatchGeneral.push('dob');
                            // Comparison - Gender
                            // 2025.07.17.35 - User may provide fully written out gender (Male/Female), which doesn't match against M/F... Added .charAt(0) to address that.
                            if(!GENDER_REGEX.test(row.gender)) mismatches.mismatchError.push('gender');
                            if(eduidSystem.gender !== row.gender.charAt(0)) mismatches.mismatchGeneral.push('gender');
                        }

                        // Clean up any existing mismatch formatting and titles, in case of prior validations that have since been fixed.
                        $row.find('.mismatchError,.mismatchGeneral,.mismatchCase').removeClass('mismatchError mismatchGeneral mismatchCase').removeAttr('title');

                        // Preserve the retrieved EDUID system data (in case of Copy)
                        $row.data('eduidSystem',eduidSystem);

                        // 2024.11.22.26 - Copy mismatched name, if only one component (given name or family name)
                        $row.find(`#lnkEdit_${row.eduid}`).on('click',function(e) {
                            let mmg = mismatches.mismatchGeneral;
                            let givenNameMismatches = mmg.includes('first') || mmg.includes('middle') || mmg.includes('suffix');
                            let familyNameMismatches = mmg.includes('last');

                            let copyName = function(name) {
                                // Copy the text to the clipboard.
                                navigator.clipboard.writeText(name).then(
                                    function copySuccess() {
                                        log('Copied:\n--------------------------------------------------------------\n'+name);
                                    },
                                    function copyFailure(err) {
                                        log('error','An error occurred copying the EDUID record to the clipboard.',err);
                                    }
                                );
                            };

                            // Can't copy if both first/middle and last were different.
                            if(givenNameMismatches && familyNameMismatches) {
                                return;
                            }
                            else if(givenNameMismatches) {
                                copyName(`${row.first} ${row.middle} ${row.suffix}`.replace(/\s+/g,' ').trim());
                            }
                            else {
                                copyName(row.last);
                            }
                        });

                        // Finally, set up the view to display mismatches.
                        for(let mmType of Object.keys(mismatches)) {
                            mismatches[mmType].map(field => {
                                $row.find(`.${field}`).addClass(mmType).attr(
                                    'title',
                                    messageOverride ? messageOverride : (
                                        (mismatches.mismatchError.includes(field) ? `Invalid data format for ${field.toUpperCase()}! ` : '') +
                                        (eduidSystem[field] ? `EDUID system has "${eduidSystem[field]}"` : `EDUID system does not have ${field}`)
                                    )
                                );
                            });
                        }
                    },
                    function failure(data) {
                        if(data.status === 500) {
                            $row.addClass('mismatchError').attr(
                                'title','EDUID system did not have this EDUID - unable to perform lookup!'
                            ).data('eduidSystem',{}).find('.eduid').addClass('mismatchError');
                        }
                        else {
                            console.error('UNHANDLED ERROR OCCURRED WITH THE RETRIEVAL: ', data);
                        }
                    }
                ) // end of $.get()
            ); // end of promises.push
        }); // end of table row loop

        $.when.apply($,promises).then(function whenPromisesComplete() {
            // Close loading screen now that all promises are complete.
            loading(false);
        });
        //log('promises: ', promises);
    }; // end parseTable()
})();