// ==UserScript==
// @name         Robinhood Watchlist Monitor
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds additional columns to robinhood watchlist table
//               to specify price targets and monitor price limits.
//               The price limit cells changes color when stock prices
//               hit entry, price targets and stop loss limits.
// @author       Ramsundar K G <kgram007@gmail.com>
// @match        https://robinhood.com/lists/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/421553/Robinhood%20Watchlist%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/421553/Robinhood%20Watchlist%20Monitor.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var $ = window.jQuery;
    const DEBUG_MODE = false; // Set this flag to enable debugding

    const LIMIT_TYPE = {
        MAX: 'max',
        MIN: 'min'
    };
    const LIMIT_INDICATOR_STYLES = {
        GREEN: 'background-color: green; color: black',
        RED: 'background-color: red; color: black',
        YELLOW: 'background-color: yellow; color: black'
    }
    const LIMITS_CONFIG = [
        {
            tag: 'entry',
            header: 'Entry',
            limitType: LIMIT_TYPE.MAX,
            indicatorStyle: LIMIT_INDICATOR_STYLES.YELLOW
        },
        {
            tag: 'priceTarget1',
            header: 'PT 1',
            limitType: LIMIT_TYPE.MIN,
            indicatorStyle: LIMIT_INDICATOR_STYLES.GREEN
        },
        {
            tag: 'priceTarget2',
            header: 'PT 2',
            limitType: LIMIT_TYPE.MIN,
            indicatorStyle: LIMIT_INDICATOR_STYLES.GREEN
        },
        {
            tag: 'priceTarget3',
            header: 'PT 3',
            limitType: LIMIT_TYPE.MIN,
            indicatorStyle: LIMIT_INDICATOR_STYLES.GREEN
        },
        {
            tag: 'stopLoss',
            header: 'Stop Loss',
            limitType: LIMIT_TYPE.MAX,
            indicatorStyle: LIMIT_INDICATOR_STYLES.RED
        }
    ];

    var stockList = {};


    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
    */
    function waitForKeyElements(
        selectorTxt,
        actionFunction,
        bWaitOnce,
        iframeSelector
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined") {
            targetNodes = $(selectorTxt);
        } else {
            targetNodes = $(iframeSelector).contents()
                .find(selectorTxt);
        }

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they are new. */
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) {
                        btargetsFound = false;
                    } else {
                        jThis.data('alreadyFound', true);
                    }
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                    300
                );
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }


    // Local storage for limit prices so that they persist on refresh
    var storage = {
        setLimitPrice: function (symbol, limitTag, price) {
            let key = symbol + '.' + limitTag;
            localStorage.setItem(key, price);
        },

        getLimitPrice: function (symbol, limitTag) {
            let key = symbol + '.' + limitTag;
            return localStorage.getItem(key);
        }
    }

    class LimitPrice {
        constructor(el, type, indicatorStyle, tag, price = null) {
            this.el = el;
            this.type = type;
            this.tag = tag;
            this.indicatorStyle = indicatorStyle

            this.price = price;
            this.el.html(
                '<input type="limit-price-textbox" placeholder="$0.00" autocomplete="off" type="text" value=""></input>'
            );
            this.elTextbox = $(this.el.find('input'));
            this.elTextbox.attr('tag', this.tag);
            this.elTextbox.val(this.price);
        }

        getPrice() { return this.price; }
        getPriceStr() { return (this.price != null) ? this.price : ''; }

        setPrice(price) {
            this.price = price;
            this.elTextbox.val(price);
        }

        setIndicator() {
            this.elTextbox.attr('style', this.indicatorStyle);
        }

        clearIndicator() {
            this.elTextbox.removeAttr('style');
        }

        update(currentPrice) {
            let priceStr = this.elTextbox.val().toString().replace(/[^0-9\.]+/g, "");
            let price = parseFloat(priceStr);
            this.price = isNaN(price) ? null : price;

            if (this.price != null && currentPrice != null) {
                //DEBUG_MODE && console.log("curr: " + currentPrice + " vs limit: " + this.price);
                if (this.type == LIMIT_TYPE.MAX) {
                    (currentPrice <= this.price)
                        ? this.setIndicator()
                        : this.clearIndicator();
                } else { // (this.type == LIMIT_TYPE.MIN)
                    (currentPrice >= this.price)
                        ? this.setIndicator()
                        : this.clearIndicator();
                }
            } else {
                this.clearIndicator();
            }
        }
    }

    class Stock {
        constructor(elTableRow) {
            this.elTableRow = elTableRow;
            this.elSymbol = $(elTableRow.find('div[role="cell"]')[1]);
            this.elPrice = $(elTableRow.find('div[role="cell"]')[2]);

            this.symbol = this.elSymbol.text().trim();
            this.currentPrice = this.parsePrice();

            // Create limit table cells
            this.limits = [];
            LIMITS_CONFIG.forEach(config => {
                let limitPrice = storage.getLimitPrice(this.symbol, config.tag);
                DEBUG_MODE && console.log("Init: " + this.symbol + "-" + config.tag + ": " + limitPrice);
                this.limits.push(
                    this.initLimitCell(config.limitType, config.indicatorStyle, config.tag, limitPrice)
                );
            });

            this.initListeners();

            // Update once to refresh indicators
            this.update();

            // debug
            debugElement(this.elTableRow, 'green');
        }

        getPrice() { return this.currentPrice; }
        getSymbol() { return this.symbol; }

        getCSV() {
            return this.symbol + ',' + this.limits.map(limit => limit.getPriceStr()).join(",");
        }

        setLimitValues(limitValues) {
            for (let i = 0; i < limitValues.length; i++)
                this.limits[i].setPrice(limitValues[i]);
            this.update();
        }

        parsePrice() {
            let priceStr = this.elPrice.text().trim().replace(/[^0-9\.]+/g, "");
            return parseFloat(priceStr);
        }

        initLimitCell(type, indicatorStyle, tag, price = null) {
            // Use symbol cell as ref
            let cellRef = $(this.elTableRow.find('div[role="cell"]')[1]);
            let cell = $(cellRef.clone());
            let limitPrice = new LimitPrice(cell.find('span'), type, indicatorStyle, tag, price);

            cell.on("click", e => e.preventDefault()); // disable click; otherise redirects to stock page
            this.elTableRow.children().first().append(cell);

            // debug
            debugElement(cell, 'red');

            return limitPrice;
        }

        initListeners() {
            let stock = this;
            this.elTableRow.on('change DOMSubtreeModified', function (event) {
                //console.log("=========")
                //console.log(event)
                //console.log("---------")

                stock.update();
                // If the limit price has changed, then update local stograge
                if ($(event.target).attr('type') === "limit-price-textbox") {
                    let tag = $(event.target).attr('tag');
                    let limitPrice = event.target.value;
                    storage.setLimitPrice(stock.getSymbol(), tag, limitPrice);
                }
            });
        }

        update() {
            this.currentPrice = this.parsePrice();
            //DEBUG_MODE && console.log(this.symbol + ": " + this.currentPrice);

            this.limits.forEach(limit => {
                limit.update(this.currentPrice);
            });
        }
    }

    function highlightDOM(el, color = 'blue') {
        el.css("border", '3px solid ' + color);
    }

    function debugElement(el, color = 'blue') {
        if (DEBUG_MODE) {
            console.log("DEGUB ELEMENT START")
            console.log(el);
            highlightDOM(el, color);
            console.log("DEGUB ELEMENT END")
        }
    }

    function initTableHeader(elTableHeader) {
        // Use symbol cell as ref
        let elCellRef = $(elTableHeader.find('div[role="columnheader"]')[1]);

        LIMITS_CONFIG.forEach(limit => {
            elTableHeader.append(elCellRef.clone().text(limit.header));
        });

        // debug
        debugElement(elTableHeader, 'blue');
        debugElement(elCellRef, 'yellow');
    }

    function addGetLimitsCsvButton(el) {
        el.prepend(
            '<div> ' +
            '  <button id="get-limits-csv" type="button">Get Limits CSV</button>' +
            '</div>'
        );

        let elBtn = $('#get-limits-csv');
        elBtn.attr('style',
            'background-color: Transparent;' +
            ' padding: 0.4em 1.2em;' +
            ' border: 0.125em solid;' +
            ' border-radius: 0.25em;' +
            ' margin: 0 0.3em 0 0.3em;' +
            ' font-weight: 300;' +
            ' color: var(--rh__text-color);' +
            ' cursor: pointer; '
        ),

            elBtn.click(function () {
                let csvStr = "";
                Object.values(stockList).forEach(stock => {
                    csvStr += stock.getCSV() + '\n';
                });
                DEBUG_MODE && console.log("Limits CSV:\n" + csvStr);
                prompt("Watchlist CSV: (Ctrl+C to copy to clipboard)", csvStr);
            });
    }

    function addSetLimitsCsvButton(el) {
        el.prepend(
            '<div> ' +
            '  <button id="set-limits-csv" type="button">Set Limits CSV</button>' +
            '</div>'
        );

        let elBtn = $('#set-limits-csv');
        elBtn.attr('style',
            'background-color: Transparent;' +
            ' padding: 0.4em 1.2em;' +
            ' border: 0.125em solid;' +
            ' border-radius: 0.25em;' +
            ' margin: 0 0.3em 0 0.3em;' +
            ' font-weight: 300;' +
            ' color: var(--rh__text-color);' +
            ' cursor: pointer; '
        ),

            elBtn.click(function () {
                let csvStrList = prompt("Enter Limits CSV:");
                DEBUG_MODE && console.log("Entered Limts CSV: ");
                csvStrList.split('\n').forEach(csvStr => {
                    if (csvStr) {
                        DEBUG_MODE && console.log(csvStr);
                        let csvArray = csvStr.split(',');
                        let symbol = csvArray[0];
                        let limitValues = csvArray.slice(1);
                        if (symbol in stockList)
                            stockList[symbol].setLimitValues(limitValues);
                    }
                });
            });
    }

    /* Start Here! */
    // Hide sidebar to create more space for watchlist table
    waitForKeyElements('.sidebar-content', function (el) {
        el.hide();
    }, true);

    // Expand table width
    waitForKeyElements('.main-container > .row > .col-12', function (el) {
        el.removeClass('col-12');
        el.addClass('col-18');
    }, true);

    // Wait for table header and init with desired metrics
    waitForKeyElements('.main-container div[role="table"] > div[role="rowgroup"]', function (el) {
        let elTableHeader = el.children().first();
        initTableHeader(elTableHeader);
    }, true);

    // Wait for table rows and init stocks
    waitForKeyElements('.main-container a[data-testid^="ListTableRow"]', function (el) {
        let elTableRow = el;

        // init Row
        let stock = new Stock(elTableRow);
        stockList[stock.getSymbol()] = stock;
    }, true);

    waitForKeyElements('.main-container button[data-testid="ListDetailHeaderOverflowMenu"]', function (el) {
        let elTopRight = el.parent().parent();
        addSetLimitsCsvButton(elTopRight);
        addGetLimitsCsvButton(elTopRight);

        debugElement(elTopRight, 'purple');
    }, true);

})();
