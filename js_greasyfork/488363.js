// ==UserScript==
// @name         CWRU-TDX New Ticket Tools
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A TamperMonkey script to speed up Care Center ticket creations.
// @author       You
// @license      MIT
// @match        https://cwru.teamdynamix.com/TDNext/Apps/127/Tickets/New*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488363/CWRU-TDX%20New%20Ticket%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/488363/CWRU-TDX%20New%20Ticket%20Tools.meta.js
// ==/UserScript==
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKeyItem_GoesOffHoldDate_ForEdit]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
//FormID values.
const CARE_IB_FORM_VAL = {
    "id": "7440",
    "text": "DSS - NEW - CARE Center / Ingenuity Bar",
    "element": [
        {}
    ],
    "disabled": false,
    "locked": false
}
const CHROMEBOOK_LOANER_FORM_VAL = {
    "id": "7465",
    "text": "DSS - NEW - Chromebook Loaner Request",
    "element": [
        {}
    ],
    "disabled": false,
    "locked": false
}
const PRESIDENTIAL_LOANER_FORM_VAL = {
    "id": "7460",
    "text": "DSS - NEW - Presidential Laptop Loaner Request",
    "element": [
        {}
    ],
    "disabled": false,
    "locked": false
}

// Acct/Dept values.
const CWRU_ACCT_DEPT_VAL = {
    "caption": "Case Western Reserve University",
    "subcaption": null,
    "value": "6378"
}

// Appointment Type Values
const IB_APPT_VAL = {
    "id": "44384",
    "text": "Ingenuity Bar Appointment",
    "element": [
        {}
    ],
    "disabled": false,
    "locked": false
}
const CHECK_IN_APPT_VAL = {
    "id": "44385",
    "text": "CARE Center Check In",
    "element": [
        {}
    ],
    "disabled": false,
    "locked": false
}
//Form Management.
function createMasterBar(){
    let topElem = $('.form-group.gutter-top.required')[0];
    let masterBar = document.createElement('div');
    masterBar.textContent = 'Master Bar';
    let createPanelTitle = document.createElement('div');
    createPanelTitle.textContent = 'Create Ticket Options:';
    masterBar.append(createPanelTitle);
    let createPanel = document.createElement('span');
    // create buttons.
    // Ingenuity Bar
    let ibButton = document.createElement('button');
    ibButton.textContent = 'IB Ticket'
    createPanel.append(ibButton);
    ibButton.addEventListener('click', constructIB);
    // Repair Check In.
    let checkInButton = document.createElement('button');
    checkInButton.textContent = 'Check In'
    createPanel.append(checkInButton);
    checkInButton.addEventListener('click', constructCheckIn);
    // Loaner button (show loanerForm);
    let loanerButton = document.createElement('button');
    loanerButton.textContent = 'Loaner';
    createPanel.append(loanerButton);
    loanerButton.addEventListener('click', (() => {
        $('#loanerFormPanel').show();
    }));
    // Attach panel to master bar.
    masterBar.append(createPanel);
    loanerForm(masterBar,constructLoaner);
    topElem.parentNode.insertBefore(masterBar, topElem);
}
function loanerForm(parent, callback){
    // repairPanel
    // - repairButtonsPanel
    //   - Yes
    //   - No
    //   - if(yes) Ticket Number.
    //   - if(no) Due Date.
    // - loanerType
    //   - Chromebook?
    //   - Windows?
    // - loanerNamePanel
    //   - loanerName
    let loanerPanel = (() => {
        let panel = document.createElement('div');
        panel.innerText = "Loaner Form";
        let repairPanel = (() => {
            let panel = document.createElement('div');
            panel.innerText = "Is this for a repair ticket?  ";
            let checkboxPanel = (() => {
                let panel = document.createElement('span');
                // Convert to checkbox.
                let checkbox = (() => {
                    let input = document.createElement('input');

                    //
                    input.setAttribute('type', 'checkbox');
                    input.id = 'isForRepair';

                    input.addEventListener('change', function() {
                        if(this.checked) {
                            $('#ticketNumberPanel').show();
                            $('#dueDatePanel').hide();
                        } else {
                            $('#ticketNumberPanel').hide();
                            $('#dueDatePanel').show();
                        }
                    });
                    return input;
                })();
                panel.append(checkbox);

                return panel;
            })();
            panel.append(checkboxPanel);

            // Ticket Number Entry Box.
            // Hidden by default
            let ticketNumberPanel = (() => {
                let panel = document.createElement('div');
                panel.id = 'ticketNumberPanel';
                panel.innerText = "Ticket Number: \t";
                //ticket number text box.
                let ticketNumberInput = (() => {
                    let input = document.createElement('input');
                    input.id = 'repairTicketNumber';
                    input.setAttribute('type', 'number');
                    input.placeholder = "Ticket Number";
                    return input;
                })();

                panel.append(ticketNumberInput);

                return panel;
            })();
            ticketNumberPanel.style.display = "none";
            panel.append(ticketNumberPanel);
            $('#ticketNumberPanel').hide();

            // Due Date Days Entry Box.
            let dueDatePanel = (() => {
                let panel = document.createElement('div');
                panel.id = "dueDatePanel";
                panel.innerText = "Due from now: \t";
                // Due Day in Days From Now input.
                let dueDateInput = (() => {
                    let input = document.createElement('input');
                    input.id = 'dueDateFromNow';
                    input.setAttribute('type','number');
                    //input.value = 0;
                    input.placeholder = "Due ____ days from now.";
                    return input;
                })();
                panel.append(dueDateInput);

                return panel;
            })();
            //dueDatePanel.style.display = "none";
            panel.append(dueDatePanel);
            //waitForKeyElements('#dueDatePanel'), (elem => {elem.hide()});
            return panel;
        })();
        panel.append(repairPanel);

        let loanerTypePanel = (() => {
            let panel = document.createElement('div');

            // Loaner Type Radio Panel.
            let radioPanel = (() => {
                let panel = document.createElement('div');
                panel.innerText = 'Loaner Type';
                // Chromebook radio.
                let chromebookRadio = (() => {
                    let radio = document.createElement('input');
                    radio.id = "chromebookRadio";
                    radio.value = 'Chromebook';
                    radio.setAttribute('type','radio');
                    radio.name = "loanerOsType";
                    //radio.setAttribute('required', true);
                    return radio;
                })();
                panel.append(chromebookRadio);
                let cRadioLabel = (() => {
                    let label = document.createElement('label');
                    label.innerText = 'Chromebook';
                    label.htmlFor = 'chromebookRadio';
                    return label;
                })();
                panel.append(cRadioLabel);

                // Windows radio.
                let windowsRadio = (() => {
                    let radio = document.createElement('input');
                    radio.id = "windowsRadio";
                    radio.value = 'Windows';
                    radio.setAttribute('type','radio');
                    radio.name = "loanerOsType";
                    //radio.setAttribute('required', true);
                    return radio;
                })();
                panel.append(windowsRadio);
                let wRadioLabel = (() => {
                    let label = document.createElement('label');
                    label.innerText = 'Presidential';
                    label.htmlFor = 'windowsRadio';
                    return label;
                })();
                panel.append(wRadioLabel);

                return panel;
            })();
            panel.append(radioPanel);

            return panel;
        })();
        panel.append(loanerTypePanel);

        let loanerNamePanel = (() => {
            let panel = document.createElement('div');
            panel.innerText = 'Loaner Name';
            let loanerNameInput = (() => {
                let input = document.createElement('input');
                input.id = 'loanerName';
                input.setAttribute('type','text');
                input.value = "";
                input.placeholder = "Loaner Name";
                return input;
            })();
            panel.append(loanerNameInput);

            return panel;
        })();
        panel.append(loanerNamePanel);

        let submitButton = document.createElement('button');
        submitButton.innerText = "Enter";
        submitButton.addEventListener('click',(() => {
            let isLoanerForRepair = $("#isForRepair").is(':checked');
            let repairTicketNum = $("#repairTicketNumber")[0].value;
            let dueDateFromNow = $("#dueDateFromNow")[0].value;
            let loanerOS = $("#chromebookRadio").is(':checked') ? "Chromebook" : "Windows";
            let loanerName = $("#loanerName")[0].value;
            if(isLoanerForRepair === undefined){
                throw new Error(`isLoanerForRepair undefined.`);
            }
            if(isLoanerForRepair && !repairTicketNum){
                throw new Error(`loaner is for repair, but no ticket num provided.`);
            }
            if(!isLoanerForRepair && !dueDateFromNow){
                throw new Error(`loaner is not for repair, but no due date provided.`);
            }
            if(!$('#chromebookRadio').is(':checked') && !$('#windowsRadio').is(':checked')){
                throw new Error(`Loaner type has not been specified.s`);
            }
            if(!loanerName){
                throw new Error(`Loaner name not provided.`);
            }
            callback(
                {
                    isLoanerForRepair,
                    repairTicketNum,
                    dueDateFromNow,
                    loanerOS,
                    loanerName
                }
            );
        }));
        panel.append(submitButton);

        return panel;
    })();
    loanerPanel.style.display = 'none';
    loanerPanel.id = 'loanerFormPanel';

    parent.append(loanerPanel);
    // input text.
}
function constructIB(){
    // Set form to Care/IB.
    setFormID(0);
    // set dept
    setAcctDept();
    // Set work with me.
    setWorkWithMe();
    // set contact info -> use contact book
    setContactNumber();
    // prefill title "Ingenuity Bar: "
    setTitle("IB: ");
    // Description: "Issue: \n Solution: "
    // Status -> resolved.
    setStatus(0);
    // Appointment type -> Ingenuity Bar Appointment
    setAppointmentType(0);
    // set appt date
    setIBApptDate(new Date());
}
function constructCheckIn(){
    // Set Form to CareCenter/IB
    setFormID(0);
    // set dept
    setAcctDept();
    // set contact info -> use contact book
    setWorkWithMe();
    setContactNumber();
    // Status -> In Process.
    setStatus(1);
    // Appointment Type -> CARE Center Check In
    setAppointmentType(1);
}
function constructLoaner(input){
    /*
    {
                    isLoanerForRepair,
                    repairTicketNum,
                    dueDateFromNow,
                    loanerOS,
                    loanerName
                }
    */
    if(!input.dueDateFromNow){
        input.dueDateFromNow = 0;
    }
    //nextday=new Date(oldDate.getFullYear(),oldDate.getMonth(),oldDate.getDate()+1);

    //console.log(`Due Date: ${today.toLocaleString()} + ${parseInt(input.dueDateFromNow)} = ${dueDate.toLocaleString()}`);
    // Set form to either chromebook loaner or presidential loaner.
    setFormID((input.loanerOS == "Windows") ? 1 : 2);
    // Set dept.
    setAcctDept();
    //console.log(`Setting Due Date as ${dueDate.toLocaleString()}`);
    let dueDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + parseInt(input.dueDateFromNow)
        );
    let offHoldDate = input.dueDateFromNow >= 14 ?
        new Date(
            dueDate.getFullYear(),
            dueDate.getMonth(),
            dueDate.getDate() - 7) :
        new Date(
            dueDate.getFullYear(),
            dueDate.getMonth(),
            dueDate.getDate() - 1)
    console.log(`DueDate: ${dueDate.toLocaleDateString('en-US')}, OffHoldDate: ${offHoldDate.toLocaleString('en-US')}`);
    // Set Title.
    setTitle(
        input.isLoanerForRepair ?
        `Loaner ${input.loanerName} for ${input.repairTicketNum}` :
        `Loaner ${input.loanerName} due on or before ${dueDate.toLocaleDateString('en-US')}`
    );
    // Set loaner due date
    setLoanerDueDate(
        dueDate
    );
    // Set status.
    setStatus(2);
    // set isLoaner for care center repair?
    setIsLoanerForRepair(input.isLoanerForRepair);
    // if is not for repair, set Goes Off Hold.
    // if due longer than a week from now.
    if(input.dueDateFromNow >= 14){
        //off hold a week from due date.
        offHoldDate.setDate(dueDate.getDate() - 7);
    }else{
        //off hold a day from due date.
        offHoldDate.setDate(dueDate.getDate() - 1);
    }
    if(!input.isLoanerForRepair){
        console.log(`Setting OffHold date as ${offHoldDate.toLocaleString()}`);
        setOffHoldDate(offHoldDate);
    }
    // if is for repair, set the ticket number.
    setTicketReference(input.repairTicketNum);
    console.log(`Constructing loaner for with ${JSON.stringify(input)}`);
}

//Expected Versions
// 0 = "DSS - NEW - CARE Center / Ingenuity Bar"
// 1 = "DSS - NEW - Presidential Laptop Loaner Request"
// 2 = "DSS - NEW - Chromebook Loaner Request"
function setFormID(value){
    console.log('Setting Form');
    waitForKeyElements('#s2id_FormID', ((formID) => {
        switch(value){
            case(0): // Care Center / Ingenuity Bar.
                formID.select2('data', CARE_IB_FORM_VAL, true);
                break;
            case(1):
                formID.select2('data', PRESIDENTIAL_LOANER_FORM_VAL, true);
                break;
            case(2):
                formID.select2('data', CHROMEBOOK_LOANER_FORM_VAL, true);
                break;
            default:
                console.error(`Unspecified type`);
                break;
        }
    }));
}
function setAcctDept(){
    waitForKeyElements('#s2id_attribute38', ((acctDeptID) => {
        console.log('Setting acct');
        if(acctDeptID.select2('data') == null){
            // Change the value to CWRU.
            acctDeptID.select2('data', CWRU_ACCT_DEPT_VAL, true);
        }
    }));
}
function setWorkWithMe(){
    waitForKeyElements("#attribute5434Choice8526", ((radioID) => {
        console.log('Setting WorkWith');
        radioID.prop('checked', true);
    }));
}
function setContactNumber(radioID){
    waitForKeyElements("#attribute6067Choice10795", ((radioID) => {
        console.log('SettingContact');
        radioID.prop('checked',true);
    }));
}
// 0 = Ingenuity Bar
// 1 = Loaner (no repair)
// 2 = Loaner (repair)
function setTitle(value){
    console.log(`Setting title`);
    waitForKeyElements('#attribute37', ((titleID) => {
        titleID.val(value);
    }));
}
function setDescription(value){
}
function setLoanerDueDate(value){
    console.log(`Setting loaner due date`);
    waitForKeyElements('#attribute17466', ((datePickerID) => {
        // must be in "MM/DD/YYYY HH:MM AM" format.
        var dateString = `${value.toLocaleDateString('en-US')} 12:00AM`;
        console.log(`Loaner Due Date setting: ${dateString}`);
        datePickerID.val(dateString);
    }));
}
function setIsLoanerForRepair(value){
    let yesCheckbox = '#attribute17467Choice44608';
    let noCheckbox = '#attribute17467Choice44609';
    if(value){
        // check yes.
        waitForKeyElements(yesCheckbox, ((checkbox) => {
            checkbox.prop('checked', false);
            checkbox.click();
        } ));
        waitForKeyElements(noCheckbox, ((checkbox) => {
            checkbox.prop('checked', false);
        }));
        waitForKeyElements('#attribute17467Name', ((hiddenVal) => {
            hiddenVal.val('Yes');
        }));
    }else{
        // check no.
        waitForKeyElements(yesCheckbox, ((checkbox) => {
            checkbox.prop('checked', false);
        } ));
        waitForKeyElements(noCheckbox, ((checkbox) => {
            checkbox.prop('checked', false);
            checkbox.click();
        }));
        waitForKeyElements('#attribute17467Name', ((hiddenVal) => {
            hiddenVal.val('No');
        }));
    }
}
function setOffHoldDate(value){
    console.log(`Setting off hold date: ${value.toLocaleDateString()}`);
    waitForKeyElements('#Item_GoesOffHoldDate_ForEdit', ((datePickerID) => {
        var dateString = `${value.toLocaleDateString('en-US')} 12:00AM`;
        datePickerID.val(dateString);
    }));
}
function setTicketReference(value){
    console.log(`Setting ticket reference`);
    waitForKeyElements('#attribute17468', ((textBoxID) => {
        textBoxID.val(value);
    }));
}
// 0 = resolved.
// 1 = in process.
// 2 = on hold.
function setStatus(value){
    console.log('Setting Status');
    // 1007 = open
    // 1008 = in process
    // 1009 = resolved.
    // 1010 = closed
    // 1011 = cancelled
    // 1012 = on hold
    // 2191 = pending approval
    // 2949 = pending vendor
    // 3932 = pending customer
    // 5101 = customer responded
    // 10425 = scheduled
    waitForKeyElements("#attribute40", ((statusID) => {
        switch(value){
            case(0): // resolved.
                statusID.val(1009);
                break;
            case(1): // in process
                statusID.val(1008);
                break;
            case(2):
                statusID.val(1012);
                break;
            default:
                console.error('Unspecified Type');
                break;
        }
    }));
}
function setAppointmentType(value){
    console.log('Setting Appt Type');
    waitForKeyElements("#s2id_attribute17384", ((apptID) => {
        switch(value){
            case(0):
                apptID.select2('data', IB_APPT_VAL, true);
                break;
            case(1):
                apptID.select2('data', CHECK_IN_APPT_VAL, true);
                break;
            default:
                console.error('Unspecified Type');
                break;
        }
    }));
}
function setIBApptDate(value){
    //$(".ui-datepicker-current.ui-state-default.ui-priority-secondary.ui-corner-all").trigger('click');
    console.log('triggering appt date is now');
    waitForKeyElements("#attribute11228", ((datePickerID) => {
        datePickerID.val(value.toLocaleDateString() + " 12:00 AM");
    }));
}
function setLoanerRepairDependency(value){}


// Create:
// - Check In - Repair
// - Loaner (Chromebook) (Shares fields with other Loaner type)
// - Loaner (Presidential) (Shares fields with other Loaner type)
// - Ingenuity Bar
// Modify
// - Check Out - Repair Pickup.
// - Loaner Return
$(document).ready(function() {
    console.log(`Started Auto-Receptionist`);
    createMasterBar();
});
//waitForKeyElements (".format-select:has(option[value=mp4])", selectFinickyDropdown);