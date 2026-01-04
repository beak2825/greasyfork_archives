// ==UserScript==
// @name         Entity Manager - Convert Name to Mixed Case v2
// @namespace    http://tampermonkey.net/
// @version      2024.01.02.1
// @description  Provides quick function to add mixed case name to the EDUID
// @author       Vance M. Allen
// @match        https://apps2.sde.idaho.gov/EntityManager/Person/View?eduId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483723/Entity%20Manager%20-%20Convert%20Name%20to%20Mixed%20Case%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/483723/Entity%20Manager%20-%20Convert%20Name%20to%20Mixed%20Case%20v2.meta.js
// ==/UserScript==
/* globals $ */

(function() {
    console.warn('Entity Manager - Convert Name to Mixed Case v2 active.');
    $('body').append(`<style>
        #AddPersonNameBtn {
            margin-left: 0.5em;
        }
        button.vma {
            display: block;
            margin-top: 0.1em;
        }
        button.k-button {
            justify-content: initial;
            min-width: 8.5em;
            text-align: left;
        }
    </style>`);

    let addName = async function(originalNames,names,nameType='Alias',evidenceDate='',otis='',deleteId='',srmName,toggle) {
        try {
            let data = await ajaxData(`AddPersonNamePopup?eduId=${eduid}`);
            let form = $(data).find('form').serializeArray();
            let legalName = toggle ? (nameType === 'Alias' ? true : false) : nameType === 'Legal Name';

            if(legalName) {
                let counter = 0;
                let message = '';

                // If we aren't toggling, assume we don't have the date. User can change the date either way.
                if(!toggle) evidenceDate = '';

                while(++counter) {
                    console.log('inside while');
                    let question = $('<div id="vmaPrompt">').kendoPrompt({
                        title: 'Document Date for Legal Name',
                        content: `<div style="color: red;">${message}</div>What is the document date for the legal name documentation?`,
                        buttonLayout: 'normal',
                        value: evidenceDate
                    }).data('kendoPrompt').open();

                    // Date validation
                    let $date = $('.k-dialog:has(#vmaPrompt) input').attr({
                        maxlength: '10',
                        placeholder: 'mm/dd/yyyy',
                        size: '10',
                        style: `display: block;  margin: 0 auto; width: 10em;`
                    }).on('keyup',function(e) {
                        if(e.key === 'Enter') $('button:contains(OK)').click();
                        if(e.key === 'Escape') $('button:contains(Cancel)').click();
                    }).focus().select();

                    let z = await question.result.then(
                        function success(data) {
                            // Data came back from the form; update the supplied evidence date.
                            evidenceDate = data.trim();
                        },
                        function failure(data) {
                            console.log('User cancelled dialog, which will trigger a benign error below.');
                        }
                    );

                    let birthDate = new Date($('#birthdate').text().trim());
                    let dateCheck = new Date(evidenceDate);
                    if(dateCheck.toLocaleDateString() === 'Invalid Date' || !/^\d+\/\d+\/\d+$/.test(evidenceDate)) {
                        message = 'Invalid date, try again.'
                    }
                    else if(dateCheck.getTime() > Date.now()) {
                        message = 'Date cannot be in the future; try again.'
                    }
                    else if(dateCheck.getTime() < birthDate.getTime()) {
                        message = `Date cannot be before person's birthdate of ${birthDate.toLocaleDateString()}; try again.`
                    }
                    else {
                        break;
                    }
                } // end while (validation for dates)
            } // end if legalName

            // Now that any needed manipulation has been done, set up the form.
            for(let x of form) {
                if(x.name === 'GivenNames') x.value = names[1];
                if(x.name === 'FamilyNames') x.value = names[0];
                if(x.name === 'NameType') x.value = legalName ? 'Legal Name' : 'Alias';
                if(x.name === 'EvidenceDate') x.value = evidenceDate;
                if(x.name === 'OtisTicketNumber') x.value = otis;
            }

            await ajaxData('SavePersonName','post',form);

            data = await ajaxData(`GeneralTabContent?eduid=${eduid}`);
            form = $(data).find('[name]').serializeArray();
            if(deleteId) {
                form.push({name:'personInfoNameId',value:deleteId});
            }
            else if(srmName) {
                console.warn('Added name from SRM Submitted Data, so no name to delete. Would normally reload but for debugging purposes, am not.');
                window.location.reload(true);
                return;
            }
            else {
                console.warn(`Unhandled situation - New name was saved successfully, but don't know ID of existing name for deletion.`);
                let id = scanForId(data,originalNames);

                if(id.length) {
                    console.log('ID(s) to delete: ', id);
                    form.push({name:'personInfoNameId',value:id});
                }
                else {
                    console.error('Problem occurred locating ID to delete, so no deletion will occur. Was sent ID: ', id);
                    return;
                }
            }

            await ajaxData('DeletePersonName','post',form);

            console.log('delete successful');
            window.location.reload(true);
        } catch(err) {
            console.error('Failure occurred adding name: ', err);
        };
    };
    let ajaxData = async function(url,method='get',data) {
        return $[method](url,data);
    }; // end ajaxData()
    let button = function(id,label,icon='',classes) {
        if(typeof classes === 'undefined') classes = id;
        return $(`<button class="vma k-button k-button-icontext ${classes}" id="${id}"><span class="k-sprite fa fa-${icon}"></span>${label}</button>`);
    };
    let eduid = new URLSearchParams(window.location.search).get('eduId');
    let fixNames = function(names) {
        // fixNames accepts a name in "Last, First" format, or an array of ['Last','First'].
        // Convert to array if it isn't already one.
        if(typeof names === 'string') names = names.split(' ');

        // Loop through each item of the array and fix it
        names.forEach(function(x,y,z) {
            // Capitalize first letter
            x = x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();

            // Handle some exceptions
            // 1.) Mac and Mc
            x = x.replace(/^(Ma?c)(\w)/g,function(x,a,b) { return `${a}${b.toUpperCase()}`; });
            // 2.) Apostrophes, Hyphenated, or Spaces
            x = x.replace(/(\w)([' -])(\w)/g,function(x,a,b,c) { return `${a}${b}${c.toUpperCase()}`; });
            // 3.) Suffixes
            x = x.replace(/ (I+V?)$/,function(x,a) { return ` ${a.toUpperCase()}`; });

            //console.log('fixNames individual result: ', z[y]);
            z[y] = x;
        });

        //console.log('fixNames almost done: ', names);
        //return names.join(' ').split(', ');
        return names;
    }; // end fixNames()
    let scanForId = function(data,searchNames) {
        console.log('scanForId running...');

        let $data = $(`<div>${data}</div>`);
        let id = [];

        if(!$data.find('h4:contains(Person Names)+hr+div table tbody tr').length) {
            console.error('No rows were found?', $data);
            return;
        }

        // Scan the rows to find the ID
        $data.find('h4:contains(Person Names)+hr+div table tbody tr').each(function() {
            let names = $(this).find('td:nth-of-type(2),td:nth-of-type(3)');
            let familyNames = names[1].innerText;
            let givenNames = names[0].innerText;

            console.debug(`Comparing searchNames[0] (${searchNames[0]}) against familyNames (${familyNames}) and searchNames[1] (${searchNames[1]}) against givenNames (${givenNames})...`);
            if(searchNames[0] === familyNames && searchNames[1] === givenNames) {
                console.debug('Matched!');
                id.push($(this).find('[id^="DeleteName_"]').attr('id').replace('DeleteName_',''));
            }
        });

        if(id.length > 1) {
            console.error('Multiple rows found; unable to be certain which ID should be used so not using any. IDs found:', id);
            return;
        }

        console.log('sending back id: ', id[0], 'full array: ', id);
        return id[0];
    }
    let scanNames = function(data='body',fixed=true) {
        let locatedNames = [];
        $(data).find('h4:contains(Person Names)+hr+div table tbody tr').each(function() {
            let names = $(this).find('td:nth-of-type(2),td:nth-of-type(3)');
            let familyNames = names[1].innerText;
            let givenNames = names[0].innerText;
            locatedNames.push( (fixed ? fixNames([familyNames,givenNames]) : [familyNames,givenNames]).join(', ') );
        });
        return locatedNames;
    };

    let config = { attributes: false, childList: true, subtree: true };
    let personNames = [];
    let tabs = document.getElementById('tabstrip');
    const callback = (mutationList, observer) => {
        for(const mutation of mutationList) {
            if(mutation.target.id === 'tabstrip-1') {
                // Current name(s) cleaned up, in "Last, First" format.
                let currentNames = scanNames();

                // Existing names..............................and SRM Potential Names
                $('h4:contains(Person Names)+hr+div table tbody tr,h4:contains(SRM)+hr+div table tbody tr').each(function() {
                    let $destination,names,familyNames,givenNames,srm = false;

                    if($(this).closest('div').prev('hr').prev('h4:contains(Person Names)').length) {
                        // Existing names
                        $destination = $(this).find('td:first-of-type');
                        names = $(this).find('td:nth-of-type(2),td:nth-of-type(3)');
                        familyNames = names[1].innerText;
                        givenNames = names[0].innerText;
                    }
                    else {
                        // Potential names from SRM
                        srm = true;
                        $destination = $(this).find('td:nth-of-type(4)');
                        names = $(this).find('td:nth-of-type(5)').text().split(', ');
                        familyNames = names[0];
                        givenNames = names[1];
                    }

                    let fixedName = fixNames([familyNames,givenNames]);

                    // Save the names for later use
                    //$(this).data('fixedName',fixedName);
                    $(this).data({
                        fixedName: fixedName,
                        originalName: [familyNames,givenNames]
                    });

                    // Determine if conversion should be offered
                    if(srm) {
                        // SRM names only make sense to offer when different than existing names
                        if(!currentNames.includes(fixedName.join(', '))) {
                            button('vmaAddLegal','Add Legal','plus','vmaAddName vmaLegal').appendTo($destination);
                            button('vmaAddAlias','Add Alias','plus','vmaAddName vmaAlias').appendTo($destination);
                        };
                    }
                    else {
                        // Existing names handling
                        // If existing name does not match fixed name, offer conversion.
                        if(fixedName[0] != familyNames || fixedName[1] != givenNames) {
                            button('vmaConvert','Convert Case','arrow-circle-o-down').appendTo($destination);
                        };

                        // Toggle between Legal Name and Alias - only valid for existing names
                        button('vmaToggle','Toggle Type','refresh').appendTo($destination);
                    }
                });

                break;
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(tabs,config);

    $(document).on('click','.vmaConvert,.vmaToggle,.vmaAddName',function() {
        let $row = $(this).closest('tr');
        let $deleteButton = $row.find('[id^="DeleteName_"]');
        let srmName = $(this).hasClass('vmaAddName');
        let deleteId;
        let names = $row.data('fixedName');
        let originalName = $row.data('originalName');
        let nameType = srmName ? ($(this).hasClass('vmaLegal') ? 'Legal Name' : 'Alias') : $row.find('td:nth-of-type(4)').text().trim();
        let evidenceDate = srmName ? $row.find('td:first-of-type').text().trim().replace(/(\d+)-\d+/,'7/1/$1') : $row.find('td:nth-of-type(5)').text().trim();
        let otis = $row.find('td:last-of-type').text().trim();
        let toggle = $(this).hasClass('vmaToggle');

        // If a delete button is present, set the deleteId.
        if($deleteButton.length) deleteId = $deleteButton.attr('id').replace('DeleteName_','');

        // Add the name
        addName(originalName,names,nameType,evidenceDate,otis,deleteId,srmName,toggle);
    });
})();