// ==UserScript==
// @name        WME Norway - Utils
// @namespace   WazeNOR
// @version     1.0
// @description UTIL functions
// @author      MtsAssen
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license     MIT
// ==/UserScript==

/* global $ */
/* global W */

var Nor = {};

(function () {

    Nor.TabBuilder = class TabBuilder {
        /**
         * Creates a new tab builder and returns it self.
         * @param {string} html 
         */
        constructor(html = "") {
            this.html = html;
            return this;
        }

        /**
         * Creates a new header (h4)
         * @param {string} header The header text
         * @param {string} id The header element id (not required)
         */
        header(header, id = "") {
            this.html += "<h4 style='margin-bottom: 10px;'" + (id == "" ? "" : " id='" + id + "'") + ">" + header + "</h4>";
            return this;
        }

        /**
         * Adds text or custom html to the page.
         * @param {string} text Text or HTML tags to include.
         */
        text(text) {
            this.html += text;
            return this;
        }

        /**
         * Adds a span with bold weight.
         * @param {string} text The bold text
         */
        bold(text) {
            this.html += "<span style='font-weight: bold;'>" + text + "</span>";
            return this;
        }

        /**
         * Adds a 25px break.
         */
        break () {
            this.html += "<br style='line-height: 25px;' />";
            return this;
        }

        /**
         * Adds a form element. Use TabForm builder object to create elements.
         * @param {Nor.TabForm} form 
         */
        form(form) {
            this.html += form.html.join("");
            return this;
        }
    }

    Nor.TabForm = class TabForm {
        /**
         * Creates a new form element.
         * @param {string} html 
         */
        constructor(html = "") {
            if (html == "") {
                html = new Array();
                html.push("<form class='attributes-form side-panel-section'>");
                html.push("</form>");
            }

            this.html = html;
            return this;
        }

        /**
         * Util function to add new elements to the second last array position
         * @private
         * @param {string} html 
         */
        add(html) {
            this.html.splice(this.html.length - 1, 0, html);
            return this;
        }

        /**
         * Create a form group element using the Nor.FormGroup builder.
         * @param {Nor.FormGroup} form 
         */
        formGroup(formGroup) {
            return this.add(formGroup.html.join(""));
        }
    }

    Nor.FormGroup = class FormGroup {
        /**
         * Creates new form group element.
         * @param {string} html 
         */
        constructor(html = "") {
            if (html == "") {
                html = new Array();
                html.push("<div class='form-group'>");
                html.push("</div>");
            }

            this.html = html;
            return this;
        }

        /**
         * Adds an element to the html array at the second last position.
         * @param {string} html 
         */
        add(html) {
            this.html.splice(this.html.length - 1, 0, html);
            return this;
        }

        /**
         * Adds a label to the form group
         * @param {string} text label text
         */
        label(text) {
            return this.add("<label class='control-label' style='margin-bottom: none;'>" + text + "</label>");
        }

        /**
         * Adds a checkbox to the form group
         * @param {string} text checkbox label text
         * @param {string} id checkbox element id
         * @param {boolean} checked checked?
         * @param {boolean} removeTopPadding removes the top padding on the element, used to make labels above look better.
         */
        checkbox(text, id, checked = false, removeTopPadding = false) {
            return this.add("<div class='controls-container'" + (removeTopPadding ? "style='padding-top: 0 !important;'" : "") + "><div class='controls-container' style='padding-top: 2px;'><input type='checkbox' id='" + id + "'" + (checked ? "checked" : "") + "><label for='" + id + "' style='white-space: pre-line;'>" + text + "</label></div></div>");
        }

        /**
         * 
         * @param {string} text button text
         * @param {string} id button element id
         * @param {string} color button color. Available: green, red, blue, gray and white (default)
         */
        button(text, id, color = "white") {
            return this.add("<div class='controls-container'><button type='button' class='waze-btn waze-btn-smaller waze-btn-" + color + "' id='" + id + "'>" + text + "</button></div>");
        }

        /**
         * 
         * @param {string} label the label above the dropdown
         * @param {string} id dropdown element id
         * @param {Array} list list of elements that should be added to dropdown
         * @param {string} displayPropName the property name of the element that is visible
         * @param {string} valuePropName the property name of the element that is the value
         * @param {string} selectedValue the value of the default selected element
         */
        dropdown(label, id, list, displayPropName, valuePropName, selectedValue) {
            this.add('<label class="control-label">' + label + '</label>');
            this.add('<div class="controls"><div><select class="form-control" id="' + id + '">')
            list.forEach(item => {
                this.add('<option value="' + item[valuePropName] + '" ' + (item[valuePropName] == selectedValue ? 'selected=""' : '') + '>' + item[displayPropName] + '</option>')
            });
            this.add('</select></div></div>');
            return this;
        }
    }

    // Util functions
    /**
     * Calls an GET ajax function to a specified URL.
     * 
     * @param url URL to call
     * @param onSuccess Callback function
     */
    Nor.callAjax = function (url, onSuccess) {
        $.ajax({
            type: "GET",
            url: url,
            jsonp: "callback",
            data: {
                alt: "json-in-script"
            },
            dataType: "jsonp",
            success: onSuccess
        });
    }

    /**
     * Parses a google spreadsheet table into a object array.
     * 
     * @param url The spreadsheet URL (list feed)
     * @param result Callback function - returns array list with table rows.
     */
    Nor.parseSpreadsheetTable = function (url, result) {
        // Get JSON formatted data
        Nor.callAjax(url, response => {

            // Create array list to store the lines in the table. Then - loop the response feed.
            var DATA = [];
            for (var i = 0; i < response.feed.entry.length; i++) {

                // Create object to store list item. Then - loop the entry nodes.
                var obj = {}
                for (var key in response.feed.entry[i]) {

                    // If the property node is called something like "gsx$" we know that it's a nested cell value.
                    if (response.feed.entry[i].hasOwnProperty(key) && key.substr(0, 4) === "gsx$") {
                        obj[key.substr(4)] = response.feed.entry[i][key].$t;
                    }
                }
                DATA.push(obj);
            }

            // Callback function
            result(DATA);
        });
    }

    Nor.Overlay = {}

    Nor.Overlay.getUrl = function(providerUrl, quadLetters) {
        var quadDigits = Nor.Overlay.QuadLettersToQuadDigits(quadLetters);
        var xyz = Nor.Overlay.QuadDigitsToTileXYZ(quadDigits);

        var url = providerUrl
        if (!url)
            return;

        url = url.replace("QUADLETTERS", quadLetters);
        url = url.replace("QUADDIGITS", quadDigits);
        url = url.replace("XCORDS", xyz.x);
        url = url.replace("YCORDS", xyz.y);
        url = url.replace("ZCORDS", xyz.z);

        return url
    }

    Nor.Overlay.TileXYZToQuadDigits = function(tileX, tileY, zoom) {
        var quadKey = "";
        for (var i = zoom; i > 0; i--) {
            var digit = '0';
            var mask = 1 << (i - 1);
            if ((tileX & mask) != 0) {
                digit++;
            }
            if ((tileY & mask) != 0) {
                digit++;
                digit++;
            }
            quadKey = quadKey.concat(digit);
        }
        return quadKey;
    }

    Nor.Overlay.QuadDigitsToTileXYZ = function (quadKey) {
        var x, y, z;
        z = quadKey.length;
        for (var i = z; i > 0; i--) {
            var digit = quadKey[z - i];
            var mask = 1 << (i - 1);
            if (digit == '0')
                continue;
            else if (digit == '1')
                x |= mask;
            else if (digit == '2')
                y |= mask;
            else if (digit == '3') {
                x |= mask;
                y |= mask;
            }
        }
        return {
            "x": x,
            "y": y,
            "z": z
        };
    }

    Nor.Overlay.QuadDigitsToQuadLetters = function(quadKey) {
        var quadLetters = "t";
        for (var i = 0; i < quadKey.length; i++) {
            switch (quadKey[i]) {
                case '0':
                    quadLetters += 'q';
                    break;
                case '1':
                    quadLetters += 'r';
                    break;
                case '2':
                    quadLetters += 't';
                    break;
                case '3':
                    quadLetters += 's';
                    break;
            }
        }
        return quadLetters;
    }

    Nor.Overlay.QuadLettersToQuadDigits = function (quadKey) {
        var quadDigits = "";
        for (var i = 1; i < quadKey.length; i++) {
            switch (quadKey[i]) {
                case 'q':
                    quadDigits += '0';
                    break;
                case 'r':
                    quadDigits += '1';
                    break;
                case 't':
                    quadDigits += '2';
                    break;
                case 's':
                    quadDigits += '3';
                    break;
            }
        }
        return quadDigits;
    }

    Nor.Overlay.TileBounds = function (tx, ty, zoom) {
        var p = Math.pow(2, zoom);
        return {
            'x1': tx * 360 / p - 180,
            'y1': 90 - 360 * Math.atan(Math.exp(-(0.5 - ty / p) * 2 * Math.PI)) / Math.PI,
            'x2': (tx + 1) * 360 / p - 180,
            'y2': 90 - 360 * Math.atan(Math.exp(-(0.5 - (ty + 1) / p) * 2 * Math.PI)) / Math.PI
        }
    }

    Nor.Overlay.TileBoundsOffset = function(tx, ty, zoom) {
        var epsilonX = 0.00013;
        var epsilonY = 0.0001;

        var bounds = Nor.Overlay.TileBounds(tx, ty, zoom);
        bounds.x1 -= epsilonX;
        bounds.x2 -= epsilonX;
        bounds.y1 -= epsilonY;
        bounds.y2 -= epsilonY;

        return bounds;
    }

    Nor.Overlay.URLToArray = function(url) {
        var request = {};
        var pairs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return request;
    }

})();