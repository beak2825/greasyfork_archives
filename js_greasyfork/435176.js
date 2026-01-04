// ==UserScript==
// @name         Barking Details
// @version      0.0.5
// @description  Barking parking lot and car wash details
// @author       LihtsaltMats
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @namespace	 https://greasyfork.org/users/564132
// @downloadURL https://update.greasyfork.org/scripts/435176/Barking%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/435176/Barking%20Details.meta.js
// ==/UserScript==

/* global W */
/* global $ */

(function () {

    function log(m) {
        console.log('%cBarking:%c ' + m, 'color: darkcyan; font-weight: bold', 'color: dimgray; font-weight: normal');
    }

    function wait() {
        if (!W || !W.map || !W.model) {
            setTimeout(wait, 1000);
            log('Waiting Waze...');
            return;
        }
        log('Ready...');
        init();
    }

    const parkingLotAttributes = {
        costType: 'LOW',
        lotType: ['STREET_LEVEL'],
        parkingType: 'PUBLIC',
        paymentType: ['PARKING_APP']
    };


    function getSelectedVenue() {
        const features = sm.getSelectedFeatures();
        return features.length === 1 && features[0].model.type === 'venue'
            ? features[0].model : undefined;
    }

    function initParkingLot() {
        const button = $("<button class='pull-right'>Lisa Parkla Info</button>");

        button.click(function () {
            addParkingLotDetails();
        });
        const tabElement = $('#venue-edit-general > div.form-group > label');
        tabElement.append(button);
    }

    function addParkingLotDetails() {
        let UpdateObject = require("Waze/Action/UpdateObject");
        W.model.actionManager.add(new UpdateObject(venue, {name: 'Barking '}));
        W.model.actionManager.add(new UpdateObject(venue, {description: 'Parkimiseks kasuta Barking äppi'}));
        W.model.actionManager.add(new UpdateObject(venue, {categoryAttributes: {PARKING_LOT: parkingLotAttributes}}));
        W.model.actionManager.add(new UpdateObject(venue, {brand: 'Barking'}));
        W.model.actionManager.add(new UpdateObject(venue, {lockRank: 1}));
        sharedDetails();
    }

    function initCarWash() {
        const button = $("<button class='pull-right'>Lisa Pesula Info</button>");

        button.click(function () {
            addCarWashDetails();
        });
        const tabElement = $('#venue-edit-general > div.form-group > label');
        tabElement.append(button);
    }


    function addCarWashDetails() {
        let UpdateObject = require("Waze/Action/UpdateObject");
        const categories = ['CAR_WASH'];
        W.model.actionManager.add(new UpdateObject(venue, {name: ' [B]'}));
        W.model.actionManager.add(new UpdateObject(venue, {categories}));
        W.model.actionManager.add(new UpdateObject(venue, {description: 'Pesu alustamiseks võimalik kasutada ka Barking äppi'}));
        W.model.actionManager.add(new UpdateObject(venue, {lockRank: 0}));
        sharedDetails();
    }

    function sharedDetails() {
        let UpdateObject = require("Waze/Action/UpdateObject");
        let OpeningHour = require('Waze/Model/Objects/OpeningHour');
        const aliases = ['Barking'];

        W.model.actionManager.add(new UpdateObject(venue, {aliases}));
        W.model.actionManager.add(new UpdateObject(venue, {
            openingHours: [new OpeningHour({
                days: [1, 2, 3, 4, 5, 6, 0],
                fromHour: '00:00',
                toHour: '00:00'
            })]
        }));
        W.model.actionManager.add(new UpdateObject(venue, {phone: '+37258114001'}));
        W.model.actionManager.add(new UpdateObject(venue, {url: 'barking.ee'}));
    }

    let sm = null;
    let venue;

    function init() {
        sm = W.selectionManager;
        sm.events.register('selectionchanged', null, onSelect);
    }

    function onSelect() {
        if (sm.getSelectedFeatures()[0]?.model?.type !== 'venue') {
            return;
        }
        venue = getSelectedVenue();
        if (sm.getSelectedFeatures()[0].model.attributes.categories[0] === 'PARKING_LOT') {
            initParkingLot();
        } else {
            initCarWash();
        }
    }

    wait();
})();