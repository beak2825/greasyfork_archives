// ==UserScript==
// @name         Entity Manager - Quality of Life Improvements
// @namespace    http://tampermonkey.net/
// @version      2025.09.09.38
// @description  Enhances various components of Entity Manager to make it easier to use.
// @author       Vance M. Allen, Idaho State Board of Education
// @match        https://apps2.sde.idaho.gov/EntityManager/
// @match        https://apps2.sde.idaho.gov/EntityManager/Person*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484334/Entity%20Manager%20-%20Quality%20of%20Life%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/484334/Entity%20Manager%20-%20Quality%20of%20Life%20Improvements.meta.js
// ==/UserScript==

/* globals $,kendo */
(async function() {
    'use strict';
    //////////////////////////////////////////////////////////////////////
    // Common variables
    //////////////////////////////////////////////////////////////////////
    // Current version
    let _VERSION = '2025.09.09.38';
    // Currently selected Person
    let _eduId = new URLSearchParams(window.location.search).get('eduId');
    // Email address
    let _email = $('li.k-item span.k-link.k-menu-link span.k-menu-link-text:contains(@)').text().trim();
    // IDs of button to click when [ESCAPE]/[ENTER] is pressed, respectively.
    let _formCancelId;
    let _formSubmitId;
    // Repository for retrieved name objects
    let _names = [];
    // Add Person Name Popup Template
    let _template;
    // Verification token
    let _vToken;

    // If user is on a "View" page, pull in the Add Person template.
    if(window.location.pathname === '/EntityManager/Person/View') {
        // Make sure a good EDUID was found to avoid log-bombing Pete's logs.
        if(/^\d{9}$/.test(_eduId)) {
            // Get "Add Person" form to use as base template
            _template = $(await $.get(`AddPersonNamePopup?eduId=${_eduId}`));
        }
        else {
            console.error('Invalid _eduId received: ', _eduId);
        }
    }
    // Redirect to Person Search if sitting on the main landing page (which has no functionality)
    else if(window.location.pathname === '/EntityManager/') {
        window.location.pathname = '/EntityManager/Person';
    }

    //////////////////////////////////////////////////////////////////////
    // Functions
    //////////////////////////////////////////////////////////////////////
    // _buttons() - Apply buttons to the page based on findings of _scanNames().
    // No user parameters. Called by init.
    let _buttons = function() {
        let newButton = function(icon,text) {
            let vmaClass = 'vma'+text.replace(/\s/g,'');
            return `<button class="k-button k-button-icontext k-button-md k-rounded-md k-button-solid k-button-solid-base vmaButton ${vmaClass}">
                <span class="k-sprite fa fa-${icon}"></span>
                <span class="k-button-text">${text}</span>
            </button>`;
        }


        if(_DMVAccess) {
            // DMV access - Place Start Over button above DMV Lookup (beside EduId).
            $('.row:contains(EduId) .col-sm-1:first-of-type').append(newButton('undo','Start Over'));
            $('.row:contains(Name) .col-sm-1:first-of-type').append(newButton('eye','Lookup'));
        }
        else {
            // No DMV access - Place Start Over button above Edit (beside Name).
            $('.row:contains(Name) .col-sm-1:first-of-type').append(newButton('undo','Start Over'));
        }
        $('.row:contains(Last Modified) .col-sm-1:first-of-type').append(newButton('copy','Copy'));

        for(let n of _names) {
            switch(n.source) {
                case 'srm':
                    // If name doesn't already exist, set up buttons to add it.
                    if(!n.nameExists) {
                        n.$j.find('td:nth-of-type(4)').append(
                            newButton('plus','Add Legal'),
                            newButton('plus','Add Alias')
                        );
                    };
                    break;
                case 'personNames':
                    n.$j.find('td:first-of-type').append(
                        n.changes ? newButton('arrow-down','Convert Case') : '',
                        newButton('pencil','Edit'),
                        newButton('refresh','Toggle Type')
                    );
                    break;
                default:
                    throw `- Unhandled name source "${n.source}"; unable to build button.`;
            }
        }
    }; // end _buttons();

    // _colorCodeEnrollments() - Scans grade levels on the Enrollments tab and color codes them.
    let _colorCodeEnrollments = function() {
        let $data = $('#tabstrip-3 table tbody');
        let colors = [
            /* PK */ '#FFCECD', /* KG */ '#FFDACB', /* 01 */ '#FFE6C8', /* 02 */ '#FEF2CD',
            /* 03 */ '#FDFED2', /* 04 */ '#EEFED5', /* 05 */ '#DFFED8', /* 06 */ '#D1FBEB',
            /* 07 */ '#C3F7FD', /* 08 */ '#C5E8FD', /* 09 */ '#C6D9FD', /* 10 */ '#D8D1FD',
            /* 11 */ '#ECD7FD', /* 12 */ '#FFDCFC', /* X1 */ '#FFEEFE'
        ];

        let priorGrade,priorSY;
        $data.find('tr').each(function() {
            let $row = $(this);
            let $grade = $row.find('td:nth-child(4)');
            let $sy = $row.find('td:nth-child(1)');

            let color;
            let grade = $grade.text();
            let repeat = false;
            let sy = $sy.text();

            switch(grade) {
                case 'PK':
                    color = colors[0]; break;
                case 'KG':
                    color = colors[1]; break;
                case 'NG':
                    break;
                default:
                    color = colors[1 + parseInt(grade)]
            }

            if(grade === priorGrade && sy === priorSY) null;
            else if(grade === priorGrade && typeof priorSY !== 'undefined') $sy.css({'font-weight':'bold','color':'red'});

            // Wrap up
            priorGrade = grade;
            priorSY = sy;
            $row.css('background-color',color);
        });
    };

    // _copy() - Quickly copies current person name to clipboard
    // No user parameters.
    let _copy = function() {
        let n = _names[0];
        let text = `${_eduId}: ${n.familyNames}, ${n.givenNames} (DOB ${n.DOB}) ${n.gender==='M'?'M':'Fem'}ale`;
        navigator.clipboard.writeText(text).then(
            function success() {
                let t = $('.vmaCopy')[0].childNodes[3];
                t.textContent = 'Copied!';
                setTimeout(function() { t.textContent = 'Copy'; },3000);
                console.debug('Copied:\n'+text);
            },
            function failure(err) {
                console.error('An error occurred copying the EDUID record to the clipboard.',err);
            }
        );
        return text;
    };

    // _DMVAccess - Global to identify if user has DMV access. Assumed false until proven otherwise.
    let _DMVAccess = false;

    // _dmvLookup() - Looks up the user in the DMV site for a legal name, where possible.
    // No user parameters. Called by (DMV) Lookup button.
    let _dmvLookup = function() {
        if(!_DMVAccess) {
            console.error('User does not have access to DMV tool. Cannot perform action.');
        }
        else if(_getAge(true) < 14.5) {
            $(`<div class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Person Too Young</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>Sorry, DMV Lookup was not processed as Idaho Code requires drivers be at least 14.5 years old to have a permit to drive.</p>
                            <p><span class="bold">Student's Age: </span>${_getAge()}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>`).modal('show')
            return;
        }

        // Show loading screen while processing.
        _loading();

        // Set up blank template for DMV results
        let template = `<div id="qolDMVResults">
            <table class="table table-condensed table-striped">
                <thead>
                    <tr>
                        <th>Name Type</th>
                        <th>Real ID</th>
                        <th>First Name</th>
                        <th>Middle Name</th>
                        <th>Last Name</th>
                        <th>Suffix</th>
                        <th>Gender</th>
                        <th>Birth Date</th>
                        <th class="center">Add</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <div class="right">
                <button id="dmvCancel" class="k-button">Cancel</button>
                <button id="dmvAdd" disabled class="k-button">Add Name</button>
            </div>
        </div>`;

        // Set up placeholder for DMV results, if not already present
        if(!$('#qolDMVResults').length) {
            $('body').append(template);
        }
        else {
            $('#qolDMVResults').replaceWith(template);
        }

        // Prep the kendo window
        $('#qolDMVResults').kendoWindow({
            visible: false,
            resizable: false,
            width: 1000,
            modal: true,
            title: 'DMV Name Results',
            actions: []
        });

        // Declare variables/payload
        (async function() {
            for(let i = 0; i < _names.length; i++) {
                let data;
                let n = _names[i];
                let payload = {
                    searchType: 'DOB',
                    firstName: n.givenNames.split(' ')[0],
                    lastName: n.familyNames,
                    birthDate: _names[0].DOB, // DOB is only on first record
                    licenseNumber: '',
                    ssNumber: ''
                };

                try {
                    data = await $.ajax({
                        url: '/DMVInterface/Search/GetDMVSearchResults',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(payload),
                        timeout: 10000 /* 2025.09.09.37, up to 10s from 5s */
                    });
                }
                catch(e) {
                    console.error('An error occurred performing the DMV lookup: ', e);

                    let title = 'Sorry';
                    let message = e.statusText === 'timeout' ?
                        'The DMV lookup failed due to a timeout error. Please retry your lookup again later.' :
                        'An error occurred performing the DMV lookup. Please retry your lookup again. If this message persists, please see if the console has more information to assist.';
                    _showError(title,message);
                    return;
                }

                let searchedName = _names[i].fixedNames[0] + ', ' + _names[i].fixedNames[1].split(' ')[0];

                if(!data?.success || !data.atLeastOneMatch) {
                    // If there are more names that can be tried, do that.
                    if(i + 1 < _names.length) {
                        console.log(`DMV match not found for "${searchedName}"; we'll continue the search...`);
                        continue;
                    }
                    else {
                        console.log(`DMV match not found for "${searchedName}"; no more names to search.`);
                    }

                    // A failure occurred; turn off the Loading Dialog so that we can display the error correctly.
                    _loading(false);

                    // Rutroh. No more names we can try, so we need to fail.
                    let title = data.success ? 'Sorry' : 'There Was an Error';
                    let message = data.message ?? (data.success ? 'No DMV records were found.' : 'No additional details are available.');
                    _showError(title,message);

                    // Bail out of this function; nothing more can be done.
                    console.error('Failure occurred retrieving DMV results:\n',data);
                    return;
                }
                else if(data.data.length > 1) {
                    console.error('Multiple results returned; this has not been built to accommodate that yet.');
                    return;
                }
                else {
                    // Simplify the data object and limit it to the actual data.
                    console.info(`DMV match found for "${searchedName}"!`);
                    data = data.data[0];
                }

                let results = [];

                let populateResults = (NameType,data) => {
                    let allResults = [];
                    let keys = ['RealId','FirstName','MiddleName','LastName','Suffix','Sex','DateOfBirthString'];

                    if(Array.isArray(data)) {
                        data.forEach(record => {
                            let results = {
                                NameType: NameType
                            };
                            keys.forEach(k => { results[k] = record[k] ?? ''; });
                            allResults.push(results);
                        });
                    }
                    else {
                        allResults.push({
                            NameType: NameType
                        });
                        keys.forEach(k => { allResults[0][k] = data[k] ?? ''; });
                    }

                    return allResults;
                }

                // Load the primary name into the array.
                results.push(...populateResults('Primary',data));

                // Load the AKAs into the array.
                if(data.AKAs.length) results.push(...populateResults('AKA',data.AKAs));

                // Load the credentials into the array.
                if(data.Credentials) results.push(...populateResults('Credential',data.Credentials));

                // Put the results into the view
                results.forEach((r,i) => {
                    // Assume name is eligible to add unless otherwise identified.
                    let eligible = true;
                    let dmvName = {
                        familyNames: r.LastName,
                        givenNames: [r.FirstName,r.MiddleName,r.Suffix].join(' ').replace(/\s+/g,' ').trim()
                    };

                    // Run the DMV names through fixNames to clean them up.
                    let [dmvFixedNames,changes,exceptions] = fixNames([dmvName.familyNames,dmvName.givenNames]);

                    // If name is already on the EDUID, no need to add it.
                    _names.forEach(name => {
                        // 2025.07.23.35 - Only existing Person Names should prevent eligibility;
                        // SRM submissions aren't used for name validations.
                        if(name.source === 'personNames' && name.fixedNames.join(', ') === dmvFixedNames.join(', ')) eligible = false;
                    });

                    // Build the table row with the DMV record information.
                    $('#qolDMVResults tbody').append(`<tr id="dmvRow_${i}">
                        <td>${r.NameType}</td>
                        <td>${r.RealId === '' ? '' : `<input type="checkbox" disabled ${r.RealId ? 'checked' : ''}>`}</td>
                        <td>${r.FirstName}</td>
                        <td>${r.MiddleName}</td>
                        <td>${r.LastName}</td>
                        <td>${r.Suffix}</td>
                        <td>${r.Sex}</td>
                        <td>${r.DateOfBirthString}</td>
                        <td class="center">${eligible ? `<input type="radio" name="qolDMVAddName" value="${i}">` : ''}</td>
                    </tr>`);

                    $(`#dmvRow_${i}`).data('scanNames',{
                        $j: $(`#dmvRow_${i}`),
                        changes: changes,
                        duplicate: false,
                        evidenceDate: r.DateOfBirthString,
                        exceptions: exceptions,
                        familyNames: dmvName.familyNames,
                        fixedNames: dmvFixedNames,
                        givenNames: dmvName.givenNames,
                        nameExists: false,
                        source: 'dmv'
                    });
                });

                // Add listeners before making things visible
                $('#qolDMVResults').on('keyup',e => e.key === 'Escape' ? $('#qolDMVResults').data('kendoWindow').close() : true);
                $('[name="qolDMVAddName"]').on('change',() => $('#dmvAdd').prop('disabled',false));
                $('#dmvAdd').on('click',() => {
                    let data = $(`[name="qolDMVAddName"]:checked`).closest('tr').data('scanNames');
                    _edit(data,{fixed:true,legalName:true});
                });
                $('#dmvCancel').on('click',() => $('#qolDMVResults').data('kendoWindow').close());

                // If no options are eligible for adding, trim off the "Add" column and the Add Name button.
                if(!$('#qolDMVResults [name="qolDMVAddName"]').length) $('#qolDMVResults tr th:last-child,#qolDMVResults tr td:last-child,#dmvAdd').remove();

                // Open up the window
                let kw = $('#qolDMVResults').data('kendoWindow').center().open();

                // Set the focus on the Cancel button.
                setTimeout(() => $('#dmvCancel').focus(),400);

                // Done processing so turn off the loading dialog.
                _loading(false);

                // Nothing further to do as a match was found, so bail.
                return;
            }
        })();
    }; // end _dmvLookup()

    // _edit() - Open the Add Person template with the
    // 2 user parameters.
    // person     - object holding person details
    // config     - object holding configuration details
    // CONFIG OPTIONS:
    // fixed      - should the fixed value be used, or the original? Default is original.
    // legalName  - Boolean when adding, as to whether user is adding legal name or alias. Should be undefined otherwise.
    // toggleType - indicates a toggling operation (between Legal Name and Alias) is requested.
    let _edit = function(person,config={}) {
        // saveName() - Save name to person record. Optionally wipe existing name (only valid when
        // using a function against an existing name).
        // 1 user parameter.
        // deleteId = ID number of person record to delete from EDUID.
        let saveName = async function(deleteId) {
            if(typeof deleteId !== 'string') deleteId = typeof person.id === 'string' ? person.id : '';
            if(typeof deleteId === 'string' && !/^\d*$/.test(deleteId)) throw ` - saveName() received invalid deleteId value "${deleteId}"; unable to proceed.`;

            // Compile what is going to be saved
            let form = $('form').serializeArray();
            
            // Prevent saving changes if no changes were actually made.
            if(
                person.familyNames === $('[name="FamilyNames_input"]').val() &&
                person.givenNames === $('[name="GivenNames_input"]').val() &&
                person.nameType === $('[name="NameType"]:checked').val() &&
                person.evidenceDate === $('[name="EvidenceDate"]').val() &&
                person.otis === $('[name="OtisTicketNumber"]').val()
            ) {
                // No changes to make, so no need to proceed.
                $('#addPersonNamePopupWindow').data('kendoWindow').close();
                return true;
            }

            // Show loading screen while processing
            _loading();

            // Entity Manager is setup to provide blank response on success.
            // If there is a failure, we will have to update the template and show the user.
            try {
                let saveResponse = await $.post('SavePersonName',form)
                if(saveResponse) throw new Error(saveResponse);
                console.info('Saving name was successful.');

                let ids = [];
                if(deleteId) ids.push(deleteId);
                else {
                    let outcome = _scanNames({scan: await $.get(`GeneralTabContent?eduId=${_eduId}`)});
                    for(let item of outcome) {
                        if(
                            item.source === 'personNames' &&
                            item.familyNames === person.familyNames &&
                            item.givenNames === person.givenNames &&
                            item.nameType === person.nameType &&
                            typeof item.id === 'string'
                        ) ids.push(item.id);
                    }

                    // Safety measure to ensure deletion only occurs if single ID found to delete.
                    if(ids.length > 1) throw new Error('Multiple identical names and types were found, so unable to determine which one to delete!');

                    // If nothing needs to be deleted, refresh.
                    if(!ids.length) return window.location.reload(true);
                }

                // Send through deletion.
                let delResponse = await $.post('DeletePersonName',{personInfoNameId:ids[0],__RequestVerificationToken:_vToken})

                // If an error occurs, send it to the console.
                if(delResponse) throw new Error(delResponse);

                // If no error occurs, refresh to show the user the result.
                window.location.reload(true);
            }
            catch(err) {
                _loading(false);
                alert('An error occurred while saving name. Please check browser console log for further details.');
                console.error('Error occurred while saving name.',err);
                return;
            }
        }; // end saveName() subfunction of _edit();

        // showAndTell() - Subfunction to hide/show rows of the editing form based on a condition
        // 2 user parameters
        // $j         - jQuery object to crawl
        // conditions - Deciding factor whether to hide the row (true = hide, false = show)
        let showAndTell = function($j,conditions) {
            if(typeof conditions === 'undefined') throw new Error(`An undefined parameter was sent as conditions to showAndTell()... unable to proceed!`);
            $j.closest('div.row').toggleClass('hide',conditions);
        }; // end showAndTell() subfunction of _edit();

        if(typeof config !== 'object') throw ' - invalid parameter to _edit()';
        if(typeof config.convertCase !== 'boolean') config.convertCase = false;
        if(typeof config.fixed !== 'boolean') config.fixed = false;
        if(typeof config.forceForm !== 'boolean') config.forceForm = true;
        if(typeof config.legalName !== 'boolean') config.legalName = null;
        if(typeof config.toggleType !== 'boolean') config.toggleType = false;

        // These circumstances do not require the form, and can simply process the change.
        if(
            // Converting case and no special exceptions occurred
            (config.convertCase && !person.exceptions) ||
            // Adding or Toggling type to Alias
            config.legalName === false
        ) config.forceForm = false;

        // Set title of form based on process being run
        if(typeof config.title !== 'string') {
            // Default title
            config.title = 'Edit Person Name';

            // Possible overrides
            if(config.convertCase) config.title = 'Convert Case';
            if(config.toggleType) config.title = 'Toggle Name Type';
        }

        // Determine name type to show on the form
        config.nameType = config.legalName === null ? person.nameType : (config.legalName ? 'Legal Name' : 'Alias');
        config.nameType = config.toggleType ? (person.nameType === 'Legal Name' ? 'Alias' : 'Legal Name') : config.nameType;

        // Since we have to use the Add Person form to edit records, we need to fill in the existing details.
        showAndTell(_template.find('#FamilyNames').val( config.fixed ? person.fixedNames[0] : person.familyNames ),config.toggleType);
        showAndTell(_template.find('#GivenNames').val( config.fixed ? person.fixedNames[1] : person.givenNames ),config.toggleType);

        showAndTell(_template.find('[name="NameType"]').each(function() {
            this.checked = this.value === config.nameType;
        }),config.convertCase);
        showAndTell(_template.find('#EvidenceDate').val( person.evidenceDate ),config.convertCase);
        showAndTell(_template.find('#OtisTicketNumber').val( person.otis ),config.convertCase);

        // Prevent combo box popup
        //_template.find('script').each(function() {
        //    $(this).html( $(this).html().replace(/setTimeout/,'// setTimeout') );
        //});
        _template.find('script').last().remove();

        // Allow entry of dates with decimals, dashes, or slashes. Convert everything to slashes.
        _template.find('#EvidenceDate').on('blur change',function() {
            $(this).val( $(this).val().replace(/[.-]/g,'/').trim() );
        });

        // Prevent default form submission to allow user script to give a hand. We override the Save
        // button behavior (this is done here so its function has access to this function's variables)
        _template.find('#EditPersonNameCancelButton').on('click',cancel);

        let $saveButton = _template.find('#EditPersonNameSaveButton').attr('type','button').on('click',saveName);

        let $form = $('#addPersonNamePopupWindow').html(_template).data('kendoWindow');

        if(config.forceForm) {
            // Show edit form to user
            $form.title(config.title).center().open();
            $form.element.on('keyup',_keyHandler);
            setTimeout(() => $('#addPersonNamePopupWindow').find(':input:visible').first().focus(),400);
        }
        else {
            // Proceed to save changes without form
            $saveButton.trigger('click');
        }
    }; // end _edit();

    // _emailLookup() - Retrieve names based on email address
    // 1 user parameter
    // email - Email address
    let _emailLookup = function(email) {
        let un = email.match(/^\w+/);
        if(!un.length) return email;
        switch(un[0]) {
            case 'asigler':
                return 'Amy Sigler';
            case 'hhernandez':
                return 'Hector Hernandez';
            case 'revans':
                return 'Roger Evans';
            case 'tking':
                return 'Todd King';
            case 'vallen':
                return 'Vance M. Allen';
        }
    };

    // _getAge() - Identifies the person's age
    // 1 user parameter
    // decimal - Whether the decimal value of the age (e.g., 21.5) should be returned (default false; returns in the style of "21 years 6 months 3 days")
    let _getAge = function(decimal = false) {
        let $bday = $('#birthdate');
        let bday = $bday.text().trim().match(/^\d+\/\d+\/\d+/)?.[0];
        let today = new Date();

        if(!bday) {
            console.error('Birthdate was not available, so age could not be retrieved.');
            return;
        }

        // Update bday to become date object
        bday = new Date(bday);
        let msg = '';
        let years = today.getFullYear() - bday.getFullYear();
        let months = today.getMonth() - bday.getMonth();
        let days = today.getDate() - bday.getDate();

        if(days < 0) {
            let lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1,0);
            days += lastMonthDate.getDate();
            months--;
        }
        if(months < 0) {
            months += 12;
            years--;
        };

        if(years < 0 || months < 0 || days < 0) {
            console.error('Invalid birthdate received');
            msg += 'Invalid';
        }
        else if(decimal) {
            return years + (months/12);
        }
        else {
            years = years ? (years + ' year' + (years !== 1 ? 's' : '')) : '';
            months = months ? (months + ' month' + (months !== 1 ? 's' : '')) : '';
            days = days ? (days + ' day' + (days !== 1 ? 's' : '')) : '';

            msg += `${years} ${months} ${days}`.replace(/\s+/g,' ').trim();
        }

        return msg;
    } // end _getAge()

    // _highlights() - Set highlights for circumstances that may need attention
    // No user parameters.
    let _highlights = function() {
        // Highlight probable merges.
        $('li[style*="italic"]').css('background','yellow');

        // Scan for unused names
        for(let row of _names) {
            if(row.source !== 'personNames') continue;
            row.$j.find('[id^="Delete"]').after(
                row.duplicate ? `<span class="gold orb" title="This name is listed multiple times in the Person Names section."></span>` : '',
                row.nameExists ? '' : `<span class="red orb" title="This name has not been used in the SRM Submitted Data section."></span>`
            );
        }
    };

    // _keyHandler() - Handle receipt of [ENTER] and [ESCAPE] keys on forms.
    // No user parameters.
    let _keyHandler = function(e) {
        // 5/7/2024 - prevent double saving when button has focus and key press activates this handler
        if(!['Escape','Enter'].includes(e.key)) return;
        e.preventDefault();

        // Simulate click on appropriate button when [ESCAPE] or [ENTER] are pressed.
        if(e.key === 'Escape' && _formCancelId) $(`#${_formCancelId}`).click();
        if(e.key === 'Enter' && _formSubmitId) $(`#${_formSubmitId}`).click();
    };

    let _loading = function(show = true) {
        if(
            // If loading screen already added, bail.
            ($('#vmaLoading').length && show) ||
            // If loading screen already stopped, bail.
            (!$('#vmaLoading').length && !show)
        ) return;

        // Shorthand access to the <body> tag.
        let $body = $('body:first');

        // Check if a modal is up before altering the scrolling.
        if(!$('body.modal-open').length) $body.css('overflow',show ? 'hidden' : 'auto');

        if(show) {
            $('<div id="vmaLoading" class="loadingSpinner"></div><div></div>').appendTo($body);
        }
        else {
            $('#vmaLoading,#vmaLoading+div').remove();
        }
    };

    // _mergePopupFormPrepopulate() - Prepopulate merge form with name and reason
    // No user parameters.
    let _mergePopupFormPrepopulate = function() {
        $('#MergeInitiator').val(_emailLookup(_email));
        $('#MergeReason').val('Duplicate');
    };

    // _prefetch() - Pull in the tab content early for faster user experience
    // No user parameters.
    let _prefetch = function() {
        // Find URLs for the tabs to prefetch
        //let urls = JSON.parse($('.k-tabstrip-wrapper+script').text().match(/"contentUrls":(\[.*?\])/)[1]);
        // 2025.02.28.23 - Update selector for Entity Manager upgrades
        let urls = JSON.parse($('#tabstrip+script').text().match(/"contentUrls":(\[.*?\])/)[1]);
        // No need to prefetch the first tab; it will already be loaded when prefetch() runs.
        urls.shift();
        // Loop through the remaining tabs and prefetch.
        urls.forEach(function(x,y,z) {
            // Kendo uses this <span> to detect if it has already loaded a tab. Since we're prefetching, we need
            // to do that so Kendo won't try to AJAX the tab again. Arrays are zero indexed and we popped the
            // first value, so we need to add 2 to the array position.
            let id = `tabstrip-${y+2}`;
            let $content = $(`#${id}`);
            let $tab = $(`li[aria-controls="${id}"]`).append(`<span id="${id}_status" class="k-loading"></span>`);

            return $.get(x).then(function(html) {
                let $html = $('<div>'+html+'</div>');
                if($(`<div>${html}</div>`).find('h4:contains(Possible Last Name Changed)+hr+div tbody tr').length) {
                    $tab.find('span.k-link').prepend(
                        `<span id="${id}_icon" class="k-sprite fa fa-binoculars" title="A &quot;Possible Last Name Changed&quot; record exists."></span>`
                    );
                }
                $html.find(`h4:contains("Possible Last Name Changed")+hr+div [href*="View?eduId="]`).each(function() {
                    let eduId2 = $(this).attr('href').match(/\d+$/)[0];
                    $(this).after(
                        `<button type="button" class="btn btn-primary" style="margin-left: 5px; padding-top: 0.3em; padding-bottom: 0.3em" onclick="location.href='/EntityManager/PersonMerge?eduId1=${_eduId}&eduId2=${eduId2}';">
                            <span class="fa fa-wrench"></span> Merge Tool
                        </button>`
                    );
                });
                $content.append($html);
                $tab.children('span.k-loading').addClass('k-progress k-complete');
            });
        });
    };

    // _scanNames() - Scans for existing names on this Person record.
    // 1 user parameter
    // options = object containing various configuration settings for _scanNames()
    // AVAILABLE OPTIONS
    // scan - jQuery object to scan. If blank, assumes current document.
    let _scanNames = function(options={}) {
        if(typeof options !== 'object') throw new Error('_scanNames received invalid "options" parameter; unable to proceed.');
        if(typeof options.scan !== 'string') options.scan = '';

        let personRows = 'h4:contains(Person Names)+hr+div tbody tr';
        let srmRows = 'h4:contains(SRM)+hr+div tbody tr';
        let vToken = '[name="__RequestVerificationToken"]';

        // Use the semi-global variable to hold the updated verification token
        _vToken = (options.scan ? $(options.scan).find(vToken) : $(vToken)).val();

        let $personNames = options.scan ? $('<div>'+options.scan+'</div>').find(personRows) : $(personRows);
        let $srmNames = options.scan ? $('<div>'+options.scan+'</div>').find(srmRows) : $(srmRows);
        let results = [];

        $personNames.add($srmNames).each(function() {
            let $this = $(this);
            let familyNames,givenNames,outcome,fixedNames,changes,exceptions;
            let srm = $this.find('td').length === 9;

            // Location of name depends on whether it's an existing name or an SRM name.
            if(srm) [familyNames,givenNames] = getText($this,5).split(', ');
            else {
                familyNames = getText($this,3);
                givenNames = getText($this,2);
            }

            // Retrieve the fixed version of the name and whether changes were detected.
            [fixedNames,changes,exceptions] = fixNames([familyNames,givenNames]);

            // All outcomes need at least these properties.
            outcome = {
                source:       srm ? 'srm' : 'personNames',
                familyNames:  familyNames,
                givenNames:   givenNames,
                fixedNames:   fixedNames,
                evidenceDate: srm ? '7/1/'+getText($this,1).match(/^\d+/)[0] : getText($this,5),
                changes:      changes,
                exceptions:   exceptions,
                $j:           $(this)
            };

            if(srm) {
                // Add "names" class to the 5th cell
                $this.find('td:nth-of-type(5)').addClass('names');
            }
            else {
                // Add "names" class to the 2nd and 3rd cells
                $this.find('td:nth-of-type(2),td:nth-of-type(3)').addClass('names');

                // Existing names have a few extra properties.
                outcome.id = getPersonId($this);
                outcome.nameType = getText($this,4);
                outcome.otis = getText($this,8);

                // Special details for first record
                if(!results.length) {
                    outcome.DOB = $('#birthdate').text().trim().match(/^\d+\/\d+\/\d+/)[0];
                    outcome.gender = $('#gender').text().trim();
                }
            }

            // Send back the discovered data to the row.
            $this.data('scanNames',outcome);

            // Save the result for later scanning.
            results.push(outcome);
        });

        // Now that the scan is complete, look through results to see which ones are already in place.
        // "Person Names" entries see if SRM has reported the name, and "SRM" entries check if "Person Names"
        // has a matching record in use.
        for(let A of results) {
            // Assume not in use and no duplicate until determined otherwise.
            A.duplicate = false;
            A.nameExists = false;

            // Scan through existing results to compare against this SRM result.
            for(let B of results) {
                if(
                    A.familyNames.toLowerCase() === B.familyNames.toLowerCase()
                    && A.givenNames.toLowerCase() === B.givenNames.toLowerCase()
                ) {
                    if(A.source === B.source && A.source === 'personNames' && A.id !== B.id && new Date(A.evidenceDate).toJSON() > new Date(B.evidenceDate).toJSON()) A.duplicate = true;
                    if(A.source !== B.source) A.nameExists = true;
                }
            }
        };

        // Send back the results.
        return results;
    }; // end _scanNames()

    // _showAge() - Looks up the birthdate on the page and shows the person's age
    let _showAge = function() {
        // Add the age to the page.
        $('#birthdate').append(`<span class="age">(${_getAge()})</span>`);
    }; // end _showAge()

    // _showError() - Shows modal error message
    // 2 user parameters
    // title - Title to show above the error message
    // message - The content of the message to show in the modal
    let _showError = function(title,message) {
        // In the event a loading screen is up when the error occurs, clear it off.
        _loading(false);

        // Set up the modal window
        $(`<div id="ErrorModal" class="modal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`).on('hidden.bs.modal',() => {
            // Allow scrolling the body again (for unknown reasons, the modal prevents scrolling even once closed).
            $('body').css('overflow','');
        }).modal('show');
    }; // end _showError()

    // _styles() - Sets up CSS for this user script.
    // No user parameters. Called by init.
    let _styles = function() {
        $('<style id="vmaCSS" type="text/css">').appendTo('body').text(`
            @keyframes loadingBar {
                0%   { width:    0; }
                50%  { width: 100%; }
                100% { width:    0; }
            }
            #AddPersonNameBtn {
                margin-left: 5px;
            }
            .fa-binoculars {
                margin-right: 4px;
            }
            .fa-external-link {
                margin-left: 4px;
            }
            .bold {
                font-weight: bold;
            }
            .col-sm-1 .k-button.vmaButton {
                display: inline-flex;
            }
            .k-button {
                justify-content: initial;
                min-width: 8em;
                text-align: left;
            }
            .k-loading:not(.k-complete) {
                animation: loadingBar 1.5s infinite;
                background: lightgray;
                display: block;
                left: 100%;
                height: 2px;
                position: absolute;
                transform: translate(-100%, 0%);
            }
            span.k-combobox .k-button {
                min-width: auto;
            }
            #tabstrip-1 button {
                width: 9em;
            }
            #tabstrip-1 td.names {
                font-family: monospace;
            }
            .center {
                text-align: center;
            }
            .right {
                text-align: right;
            }
            .red {
                color: red;
            }
            .orb {
                border-radius: 100%;
                display: inline-block;
                margin-left: 5px;
                height: 1em;
                width: 1em;
            }
            .gold.orb {
                background: gold;
                border: thin solid gold;
            }
            .loadingSpinner {
                border: 16px solid #f3f3f3;
                border-left: 16px solid #3498db;
                border-top: 16px solid #3498db;
                border-radius: 50%;
                position: fixed;
                top: 45vh; left: 45vw;
                height: 120px; width: 120px;
                animation: spin 1s linear infinite;
                z-index: 30000;
            }
            .loadingSpinner + div {
                background: color-mix(in srgb, gray, transparent 50%);
                position: fixed;
                top: 0;
                left: 0;
                height: 100%; width: 100%;
                z-index: 20000;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .red.orb {
                background: red;
                border: thin solid red;
            }
            .vmaButton {
                display: block;
            }
            div.row:has(h3) {
                background: white;
                position: sticky;
                top: -1px;
                z-index: 3;
            }
            div.row thead tr {
                background: white;
                position: sticky;
                top: 3.2em;
                z-index: 2;
            }
            div#findResults.row thead tr {
                background: white;
                position: sticky;
                top: 0em;
                z-index: 2;
            }
        `);
    };

    // buttonHandler() - Receives button and passes processing to appropriate function.
    // No user parameter - event handler will call this function.
    let buttonHandler = function(e) {
        let $row = $(e.target).closest('tr');
        let data = $row.data('scanNames');
        let vmaEvent = (e.target.tagName === 'BUTTON' ? e.target : e.target.parentElement).className.split(' ').pop();

        switch(vmaEvent) {
            case 'vmaAddAlias':
            case 'vmaAddLegal':
                _edit(data,{fixed:true,legalName:vmaEvent==='vmaAddLegal'});
                break;
            case 'vmaConvertCase':
                _edit(data,{convertCase:true,fixed:true});
                break;
            case 'vmaCopy':
                _copy();
                break;
            case 'vmaEdit':
                _edit(data,{fixed:true,forceForm:true});
                break;
            case 'vmaLookup':
                _dmvLookup();
                break;
            case 'vmaStartOver':
                window.location.href = './';
                break;
            case 'vmaToggleType':
                _edit(data,{toggleType:true});
                break;
            default:
                throw `- Unhandled "${vmaEvent}" event; unable to determine what to do.`;
        }
    };

    // cancel() - Handling when user cancels form dialog
    // No user parameters.
    let cancel = function() {
        $('#addPersonNamePopupWindow').empty().data('kendoWindow').close();
    };

    // fixNames() - Receives name in [familyNames,givenNames] array and cleans it up.
    // 1 user parameter
    // names - array in [familyNames,givenNames] format.
    let fixNames = function(names) {
        let changes = false;
        let exception = false;
        if(!Array.isArray(names)) throw 'fixNames() requires an array.';
        if(names.length !== 2) throw 'fixNames() requires an array of [familyNames,givenNames].';

        for(let i in names) {
            let parts = [];
            for(let part of names[i].split(' ')) {
                // Check if already mixed case; might have had (manual) special handling - trust it
                // 10/11/2024 - Except if the entire thing is lowercase.
                if(/\w/.test(part.charAt(1)) && part.charAt(1) === part.charAt(1).toLowerCase() && part !== part.toLowerCase()) parts.push(part);
                // In event of special character in 2nd position (e.g., O'Connor), check 3rd position.
                else if(/\W/.test(part.charAt(1)) && /w/.test(part.charAt(2)) && part.charAt(2) === part.charAt(2).toLowerCase()) parts.push(part);
                // Since second character was not lowercase, assuming conversion is appropriate.
                else {
                    // Begin basic fixes
                    // 1.) Initial cap
                    let basicFix = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
                    // 2.) Roman Numeral Suffixes
                    basicFix = basicFix.replace(/^(II+|IV|V|VI+|X|XI+)$/i,function(x,a) { return `${a.toUpperCase()}`; });

                    // Handle exceptions
                    // Set fixedPart to the basicFix to begin with; will later determine if exceptions were made.
                    let fixedPart = basicFix;
                    // 1.) Hyphenation or apostrophes
                    fixedPart = fixedPart.replace(/(\w['-])(\w)/g,function(x,a,b) { return `${a}${b.toUpperCase()}`; });
                    // 2.) M(a)cSomething - requires 4+ characters after M(a)c to work.
                    fixedPart = fixedPart.replace(/^(Ma?c)(\w)(\w{3,})/,function(x,a,b,c) { return `${a}${b.toUpperCase()}${c}`; });
                    // Were exceptions made?
                    if(basicFix !== fixedPart) exception = true;

                    // Now compare suggested fix to existing to see if changes apply
                    if(part !== fixedPart) changes = true;
                    parts.push(fixedPart);
                }
            }
            names[i] = parts.join(' ');
        }

        return [names,changes,exception];
    };

    // getPersonId(td) - Retrieve ID number from specific <td> in row, where available.
    // 1 user parameters.
    // $row - jQuery object of <tr> tag containing desired <td>
    let getPersonId = function($row) {
        // When there is only one name on the page, there won't be an ID.
        // This handling ensures the page doesn't fail in that scenario.
        let id = $row.find(`[id^="DeleteName_"]`).attr('id');
        if(id) return id.replace('DeleteName_','');
    };

    // getText(td) - Retrieve text from specific <td> in row, trim it, then send it back.
    // 2 user parameters.
    // $row - jQuery object of <tr> tag containing desired <td>
    // i - index of the <td> tag
    let getText = function($row,i) {
        return $row.find(`td:nth-of-type(${i})`).text().trim();
    };

    // init() - Initializes this user script
    // No user parameters.
    let init = function() {
        console.warn(`"Entity Manager - Quality of Life Improvements", version v${_VERSION}, activated!`);
        $('.col-sm-12:has(h2)').addClass('col-sm-6').removeClass('col-sm-12').after(
            `<div class="col-sm-6" style="text-align: right;"><h2>Entity Manager QoL Improvements v${_VERSION}</h2></div>`
        );

        // Apply CSS overrides
        _styles();

        // Activate listener for Quick EDUID functionality.
        $('#txtGiven').on('keyup paste',quickEduId);

        // Activate listener for vmaButton functionalities.
        $(document).on('click','.vmaButton',buttonHandler);

        // Activate listener so when a queue is clicked, we prevent further clicks to avoid accidentally losing a merge candidate.
        $('li [href$="PersonMerge"],li [href$="PersonNameQueue"]').on('click',_loading);

        // 2025.07.11.29 - Activate listener for Person top-level menu to act as the Person menu option.
        $('#HeadMenu span.k-menu-link span.k-menu-link-text').filter((i,x) => x.innerText === 'Person').on('click',() => { window.location.href = './' });

        let monitorIds = [];

        // Mutation Observer for the View EDUID page.
        switch(window.location.pathname) {
            case '/EntityManager/Person/View':
                // Except if user is on Mass EDUID Lookup, we should monitor the tabstrip.
                if(window.location.hash !== '#vmaMassEduIdLookup') monitorIds.push('tabstrip');

                // Check that the user has access to DMV
                $.get('/').then(function(opts) {
                    if(opts.match(/DMVInterface/)) _DMVAccess = true;
                });

                // Add age
                _showAge();
                break;
            case '/EntityManager/PersonMerge':
                monitorIds.push('mergePersonPopupWindow');
                $('div.row div.col-xs-12:contains(blocked)').addClass('red').prepend(`<span class="fa fa-warning"></span>`);
                $('[href*="/View?eduId="]').append(`<span class="fa fa-external-link"></span>`);

                // If EDUIDs cannot be merged, retry the operation until one is found that can be processed.
                if([
                    'Deprecated EduIds cannot be merged.',
                    'These EduIds are for the same Person.'
                ].includes($('.row:has(h2) + .row > .col-12').text())) {
                    $(`<div class="modal" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Merge Queue Had Invalid EDUID In Queue</h5>
                                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" disabled>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                            </div>
                            <div class="modal-body">
                                <p>Sorry, the Merge Queue cannot process this EDUID. Another one will be retrieved. Please stand by...</p>
                            </div>
                        </div>
                    </div>`).modal('show');
                    _loading();
                    window.location.href = './PersonMerge';
                    return;
                }
                break;
            default:
                return true;
        }

        // Await Tab 1 loading...
        for(let monitorId of monitorIds) {
            const targetNode = document.getElementById(monitorId);
            // 2024.12.02.21 - Bypass observer when monitorId doesn't exist (avoids console error).
            if(targetNode === null) continue;
            const config = { childList: true, subtree: true };
            const callback = (mutationList,observer) => {
                for(const mutation of mutationList) {
                    switch(mutation.target.id) {
                        case 'tabstrip-1':
                            // Once tab has loaded, scan the names on the page.
                            _prefetch();
                            // Scan names on the page
                            _names = _scanNames();
                            // Call _buttons to place available options based on the findings of _scanNames()
                            _buttons();
                            // Apply highlights
                            _highlights();
                            // Set form cancel/submit IDs for event handler
                            _formCancelId = 'EditPersonNameCancelButton';
                            _formSubmitId = 'EditPersonNameSaveButton';
                            break;
                        case 'tabstrip-3':
                            _colorCodeEnrollments();
                            break;
                        case 'mergePersonPopupWindow':
                            // Prepopulate the form with details
                            _mergePopupFormPrepopulate();
                            // Set form cancel/submit IDs for event handler - commenting out, as merge form seems to have its own handling.
                            //_formCancelId = 'MergePersonCancelButton';
                            //_formSubmitId = 'MergePersonSaveButton';
                            break;
                        //default:
                    } // end switch
                }; // end for(mutation)
            }; // end callback()
            const observer = new MutationObserver(callback);
            observer.observe(targetNode,config);
        } // end for(monitorId)

        return true;
    }; // end init()

    // quickEduId() - Reroute user to the View page when an EDUID is pasted or typed.
    // No user parameters. This is called by event handlers only.
    // 2025.04.07.26 - Now async function to prevent invalid EDUIDs from erroring out the page
    let quickEduId = async function(e) {
        // 9 digit value. Only checking the front, in case user pastes the full EDUID/name/DOB/gender string.
        let pattern = /^\d{9}/;

        // Set value depending on whether user was pasting or typing.
        let value = e.type === 'paste' ?
            e.originalEvent.clipboardData.getData('text').trim() :
            this.value.trim();

        // Prevent accidental activation of redirect by only firing if non-digit key was pressed.
        if(e.type === 'keyup' && !/\d/.test(e.key)) return;

        // If value isn't a 9-digit value (EDUID), bail.
        if(!pattern.test(value)) return false;

        let $table = $(await $.get(`./FindPerson?givenNames=${value}`)).find('table');
        let $a = $table.find('a');

        // Redirect user to requested EDUID.
        if($a.length) window.location.href=`View?eduId=${value.match(/^\d{9}/)[0]}`;
        return true;
    } // end quickEduId()

    //////////////////////////////////////////////////////////////////////
    // Activate functionalities
    //////////////////////////////////////////////////////////////////////
    return init();
})();