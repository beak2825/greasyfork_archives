// ==UserScript==
// @name         Volt Details
// @version      0.1.1
// @description  Adds details to charge station
// @author       Code mostly from WME ClickSaver, modified by LihtsaltMats
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @namespace https://greasyfork.org/users/564132
// @downloadURL https://update.greasyfork.org/scripts/403529/Volt%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/403529/Volt%20Details.meta.js
// ==/UserScript==

/* global W */
/* global $ */

function onAddChargeStationDetailsButtonClick() {
    const insertPlanceName = $('#landmark-edit-general form.attributes-form input.form-control').val('🔌 Volt ').blur().change();

    const addAlternativeNameField = $('a.add.waze-link');
    addAlternativeNameField.click();
    const insertCompanyName = $('form.attributes-form input.alias-name').first().val('Volt').blur().change();
    const insertDescription = $('textarea.form-control').val('1× CCS 50 kW\n1× CHAdeMO 35 kW\n1× Type 2 22 kW').blur().change();
    addAlternativeNameField.click();
    const insertChargingStation = $('form.attributes-form input.alias-name').last().val('laadimisjaam').blur().change();
    const selectLevel3Lock = $('input:radio[name=lockRank]').val(['2']).blur().change();

    const checkCustomerParking = $('#service-checkbox-PARKING_FOR_CUSTOMERS').prop('checked', true).blur().change();
    const addOpeningTime = $('#landmark-edit-more-info > div > form > div.opening-hours.side-panel-section > div > a').click()
    const selectAllTimes = $('#dialog-region > div > div > div.modal-body > div > form > div.days.section > div.toggle > a.select-all').click()
    const selectAllDayRadioButton = $('input:radio[name=allDay]').val(['on']).blur().change();
    const clickAddButton = $('button.waze-btn.waze-btn-blue.waze-btn-smaller').click();

}

function addChargeStationDetailsButton() {
    if (W.selectionManager.getSelectedFeatures()[0].model.type !== 'segment') {
        $('#landmark-edit-general > div.form-group > label').append(
            $('<a>', {
                href: '#',
                style: 'float: right;text-transform: none;' +
                    'font-family: "Helvetica Neue", Helvetica, "Open Sans", sans-serif;color: #26bae8;' +
                    'font-weight: normal;'
            }).text('Add Volt details').click(onAddChargeStationDetailsButtonClick)
        );
    }
}

function init() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                const addedNode = mutation.addedNodes[i];
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    if ($(addedNode).find('label').length) {
                        addChargeStationDetailsButton();
                    }
                }
            }
        });
    });
    try {
        const element = $('#edit-panel');

        if ($(element).length) {
            observer.observe(document.getElementById('edit-panel'), {
                childList: true,
                subtree: true
            });

        } else {
            setTimeout(init, 1000);
        }
    } catch (err) {
        setTimeout(init, 1000);
    }
}

init();