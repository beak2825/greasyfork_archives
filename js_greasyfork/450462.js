// ==UserScript==
// @name         palenie wszystkiego
// @version      1.0
// @author       Bancewald
// @match        *.margonem.pl
// @description nie może być puste
// @namespace https://greasyfork.org/users/935016
// @downloadURL https://update.greasyfork.org/scripts/450462/palenie%20wszystkiego.user.js
// @updateURL https://update.greasyfork.org/scripts/450462/palenie%20wszystkiego.meta.js
// ==/UserScript==





function run() {


    //----ADDING WIDGET credit to https://github.com/nerthus-margonem/nerthusaddon
    const defaultPosition = [3, 'bottom-right-additional']

    const addWidgetToDefaultWidgetSet = function() {
        Engine.widgetManager.addKeyToDefaultWidgetSet(
            'ofudka',
            defaultPosition[0],
            defaultPosition[1],
            'ofudka',
            'green',
            useAllOffers
        )
    }

    $('head').append('<style>' +
        '.main-buttons-container .widget-button .icon.ofudka {' +
        'background-image: url("https://bancewald.000webhostapp.com/scripts/ofudka.png");' +
        'background-position: 0;' +
        '}' +
        '</style>'
    )
    const addWidgetButtons = Engine.widgetManager.addWidgetButtons
    Engine.widgetManager.addWidgetButtons = function(additionalBarHide) {
        addWidgetButtons.call(Engine.widgetManager, additionalBarHide)
        addWidgetToDefaultWidgetSet()
        createButtonNI()

        Engine.widgetManager.addWidgetButtons = addWidgetButtons
    }

    if (Engine.interfaceStart) {
        addWidgetToDefaultWidgetSet()
        createButtonNI()
    }

    function createButtonNI() {
        if (Engine.interfaceStart && Object.keys(Engine.widgetManager.getDefaultWidgetSet()).includes('ofudka')) {
            let ofudkaPos = defaultPosition

            const serverStoragePos = Engine.serverStorage.get(Engine.widgetManager.getPathToHotWidgetVersion())
            if (serverStoragePos && serverStoragePos.ofudka) ofudkaPos = serverStoragePos.ofudka

            Engine.widgetManager.createOneWidget('ofudka', { ofudka: ofudkaPos }, true, [])
            Engine.widgetManager.setEnableDraggingButtonsWidget(false)
        } else setTimeout(createButtonNI, 500)
    }

    //----


    function getAvailableOffers() {
        if (!Engine.barter) return []

        let offers = []

        Engine.barter.barterAvailableData.forEach(offer => {
            let offerId = offer.offerId
            let offerTpl = offer.tplId
            let userItems = Engine.items.fetchLocationItems("g")
            userItems.forEach(item => {
                if (item.tpl == offerTpl) {
                    offers.push([offerId, item.id])
                }
            })
        })

        return offers
    }

    function useAllOffers() {
        if (!Engine.barter) {
            message("moze najpierw odpal okno wymiany")
            return
        }

        let availableOffers = getAvailableOffers()

        availableOffers.forEach(offer => {
            _g("barter&id=" + Engine.barter.barterId + "&offerId=" + offer[0] + "&selectedItems=" + offer[1] + "&action=use&usesCount=1&available=0&desiredItem=" + 43490)
        })
    }

    function logKey(e) {
        if (e.which === 219) {
            useAllOffers()
        }
    }

    document.addEventListener('keydown', logKey)
}

run()