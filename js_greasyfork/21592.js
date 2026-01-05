// ==UserScript==
// @name         Usprawniacz OLX
// @namespace    olx.pl/*
// @version      0.11
// @description  Umozliwia ukrywanie ogloszen na stronie OLX.pl
// @author       Pawel "krejd" Wegrzyn
// @match        http://olx.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21592/Usprawniacz%20OLX.user.js
// @updateURL https://update.greasyfork.org/scripts/21592/Usprawniacz%20OLX.meta.js
// ==/UserScript==


var Initializer = {

    run: function () {

        // Parse all offers visible on the page

        Offers.parseOffersOnCurrentPage();

        // Delete unwanted offers from current page

        OffersDeleter.deleteUnwantedFromMemory();

        OfferDOMNormalizer.normalizePromotedOffers();

        // Includes all DOM elements necessary
        // for Offers handling

        OfferDOMInjector.run();

        // Check if preview mode is active

        Preview.applyOnPreviewModeActive();

        // Bind all events to newly created DOM elements

        Preview.bindEvents();

    }

};
var Offers = {

    _visibleOffers: {},

    parseOffersOnCurrentPage: function () {

        var that = this;

        this._clearOffers();

        var offers = $('.offer');

        offers.each(function (index, offerEl) {

            var offerId = $('table', offerEl).data('id');
            that._visibleOffers[offerId] = offerEl;

        });

    },

    getOffers: function () {

        return this._visibleOffers;

    },

    /**
     * Offers need to be cleared everytime user changes
     * page or filters search. This is done in order to
     * keep memory as clean as possible and to make array
     * iterations smooth.
     *
     * @private
     */
    _clearOffers: function () {

        this._visibleOffers = {};

    }

};
var OffersDeleter = {

    /**
     * Removes element from the DOM and pushes ID reference
     * to Local Storage so script knows which IDs should be
     * removed later.
     *
     * @param id
     * @returns {boolean}
     */
    // hideElementAction: function (id) {
    //
    //     // Check if ID already exists in handler array
    //
    //     if (this._hiddenElements.indexOf(id) === -1) {
    //
    //         // Add element to Local Storage
    //
    //         this._hiddenElements.push(id);
    //         this.updateLocalStorage();
    //
    //     }
    //
    //     // Remove element from the page
    //     //
    //     // var removableElement = document.querySelector('table[data-id="' + id + '"]');
    //     // var removableElementParent = removableElement.parentElement;
    //     //
    //     // removableElementParent.parentElement.removeChild(removableElementParent);
    //
    //     var elementParent = $('table[data-id="' + id + '"]').parent();
    //     elementParent.remove();
    //
    //     return true;
    //
    // },

    deleteUnwantedFromMemory: function () {

        var removedOffersIds = RemovedOffers.getOffersIds();
        var offers = Offers.getOffers();

        for (var offerId in offers) {

            if (removedOffersIds.includes(parseInt(offerId)) === true) {

                // Todo replace with "remove element"
                $(offers[offerId]).remove();

            }

        }

    }
};
var RemovedOffers = {

    _removedIds: null,

    /**
     * This method has to run on start in order to get already
     * hidden IDs from LocalStorage. Otherwise, when called,
     * returns a reference of this._removedIds field.
     *
     * @returns array
     */
    getOffersIds: function () {

        if (this._removedIds === null) {

            var hiddenIdsLSNode = localStorage.getItem('removedIds');

            if (hiddenIdsLSNode === null) {

                this._removedIds = [];
                localStorage.setItem('removedIds', JSON.stringify(this._removedIds));

            } else {

                this._removedIds = JSON.parse(hiddenIdsLSNode);

            }

        }

        return this._removedIds;

    },

    addOfferId: function (id) {

        // Check if ID exists already

        if (this._removedIds.indexOf(id) === -1) {
            this._removedIds.push(id);
        }

    },

    /**
     * Updates Local Storage with contents
     * of _removedIds array.
     */
    save: function () {

        if (this._removedIds !== null) {

            localStorage.setItem('removedIds', JSON.stringify(this._removedIds));

        }

    }
};
var OfferDOMNormalizer = {

    /**
     * Removes yellow background for all promoted
     * offers. Seriously, customers usually don't
     * need to see that garbage :)
     */
    normalizePromotedOffers: function () {

        $('.offer.bg-3').each(function (index, element) {
            $(element).addClass('bg-3-normalized');
        });

    }

};
var OfferDOMInjector = {

    run: function () {

        this.injectActionPanel();
        this.injectPreviewButton();
        this.injectDeleteButton();
        this.bindEvents();

    },

    injectActionPanel: function () {

        var offers = Offers.getOffers();

        // Inject action panel for each offer

        for (var offerId in offers) {

            var $tbody = $('tbody', offers[offerId]);

            $tbody.append('<tr><td class="offer-action-panel" colspan="3"></td></tr>');

        }

    },

    injectDeleteButton: function () {

        var offers = Offers.getOffers();

        for (var offerId in offers) {

            // Append Delete button

            var $actionPanel = $('.offer-action-panel', offers[offerId]);
            var $deleteLink = $('<a></a>');
            $deleteLink.attr('data-id', offerId);
            $deleteLink.addClass('offer-action-delete');
            $deleteLink.text('Usuń ogłoszenie');

            $actionPanel.append($deleteLink);

        }

    },

    injectPreviewButton: function () {

        var offers = Offers.getOffers();

        for (var offerId in offers) {

            // Append Delete button

            var $actionPanel = $('.offer-action-panel', offers[offerId]);
            var $previewLink = $('<a></a>');
            $previewLink.attr('data-id', offerId);
            $previewLink.addClass('offer-action-preview');
            $previewLink.text('Szybki podgląd');

            $actionPanel.append($previewLink);

        }

    },

    bindEvents: function () {

        // Delete

        $('.offers').on('click', '.offer-action-delete', function (event) {

            var offers = Offers.getOffers();
            var offerId = $(this).data('id');

            RemovedOffers.addOfferId(offerId);
            RemovedOffers.save();
            $(offers[offerId]).remove();

        });

    }

};
var Preview = {

    /**
     * ##########################
     * ##########################
     * ############# FIELDS
     * ##########################
     * ##########################
     */

    _previewModeEnabled: false,

    /**
     * ##########################
     * ##########################
     * ############# METHODS
     * ##########################
     * ##########################
     */

    /**
     * Is preview mode enabled
     *
     * @returns {boolean}
     */
    isPreviewModeEnabled: function () {

        return this._previewModeEnabled;

    },

    /**
     * This must be called both from inside Initializer
     * and this.enterPreviewMode method. This is because
     * if user changes page, style needs to re-applied
     * to wrappers.
     */
    applyOnPreviewModeActive: function () {

        if (this.isPreviewModeEnabled() === true) {

            $('.wrapper').addClass('wrapper-left');

        }

    },

    enterPreviewMode: function () {

        this._previewModeEnabled = true;

        this.applyOnPreviewModeActive();

        var iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'previewcard');
        iframe.onload = function () {

            $('iframe#previewcard').contents().find('header').remove();
            $('iframe#previewcard').contents().find('.breadcrumb').remove();
            $('iframe#previewcard').contents().find('footer').remove();
            $('iframe#previewcard').contents().find('.offercontentinner.margintop7').remove();
            $('iframe#previewcard').contents().find('.marginbott10.clr').remove();
            $('iframe#previewcard').contents().find('.fleft.fb_detailpage').remove();

        };

        document.body.appendChild(iframe);

    },

    changeLink: function (link) {

        var iframe = document.getElementById('previewcard');
        iframe.src = link;

    },

    exitPreviewMode: function () {

        $('iframe').remove();
        $('.wrapper').removeClass('wrapper-left');

        this._previewModeEnabled = false;

    },

    loadLinkInPreviewWindow: function (offerLink) {

        // Check if preview mode is enabled

        if (this.isPreviewModeEnabled() === false) {

            this.enterPreviewMode();
            this.changeLink(offerLink);

        } else {

            this.changeLink(offerLink);

        }

    },

    /**
     * ##########################
     * ##########################
     * ############# EVENTS
     * ##########################
     * ##########################
     */

    bindEvents: function () {

        this._bindClickPreviewLink();
        this._bindScrollBehaviour();

    },

    /**
     * Bind Click Preview Link
     *
     * @private
     */
    _bindClickPreviewLink: function () {

        var that = this;

        $('.offers').on('click', '.offer-action-preview', function (event) {

            var offers = Offers.getOffers();
            var offerId = $(this).data('id');

            var $offerUrl = $('a.link', $(offers[offerId]));
            var offerLink = $offerUrl.attr('href');

            that.loadLinkInPreviewWindow(offerLink);

        });

    },

    _bindScrollBehaviour: function () {

        $(document).on({
            mouseenter: function () {

                $('body').addClass('lock-scrolling');

            },
            mouseleave: function () {

                $('body').removeClass('lock-scrolling');

            }
        }, 'iframe#previewcard');

    }

};
(function(){
    var cssText = ["iframe#previewcard {\n","  position: fixed;\n","  z-index: 9999999999999;\n","  top: 0;\n","  right: 0;\n","  width: 940px;\n","  height: 100%;\n","  border-left: 3px solid black;\n","  background: white; }\n","\n",".lock-scrolling {\n","  overflow: hidden; }\n","\n",".bg-3-normalized {\n","  background: transparent !important; }\n","\n",".wrapper-left {\n","  margin: 0 0 0 35px !important; }\n","\n",".offer-action-panel a {\n","  float: left;\n","  display: inline-block;\n","  background: #0098d0;\n","  padding: 5px 7px;\n","  margin: 0px 4px;\n","  color: #ffffff; }\n",""].join("");
    var styleEl = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText;
        } catch(e) {
            styleEl.innerText = cssText;
        }
    }
})();
/**
 * In Frame
 *
 * @returns {boolean}
 * @url http://stackoverflow.com/a/326076
 */
function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
(function () {
    'use strict';

    /**
     * Don't allow this script to run when any of
     * OLX.pl pages is loaded in iframe.
     */
    if (inIframe()) {
        return;
    }

    Initializer.run();

    /**
     * Lock interval to check when URL changes.
     *
     * This is done in order to reapply all core code
     * once user moves from page to page or changes
     * search filters.
     */

    var currentURL = window.location.href;

    setInterval(function () {

        var checkUrl = window.location.href;

        if (currentURL !== checkUrl) {

            Initializer.run();
            currentURL = checkUrl;

        }

    }, 500);

})();