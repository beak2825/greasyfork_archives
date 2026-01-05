// ==UserScript==
// @name            html-utils
// @name:de         html-utils
// @namespace       dannysaurus.camamba
// @version         0.1
// @license         MIT License
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @require         https://greasyfork.org/scripts/22752-object-utils/code/object-utils.js
// @description     utils for DOM manipulation and fetching info of a webpage
// @description:de  utils for DOM manipulation and fetching info of a webpage
// ==/UserScript==

var LIB = LIB || {};
/**
 * Html Elements
 * @type {{Element, Button, Div, Input, Checkbox, Label, TextArea, Option, Select}}
 */
LIB.htmlUtils = (function() {
    'use strict';
    var objectUtils = LIB.objectUtils;
    var keeper = objectUtils.Keeper();
    /**
     * Adds a HTML child node to a HTML parent node.
     * @param {HtmlElement|Element} parent - The html parent node
     * @param {HtmlElement|Element} child - The html child Element to be connected to the parent node
     * @param {boolean} [asFirstChild] - <code>true</code> to have the child be added as the first child before any other child
     */
    var connectParentChild = function(parent, child, asFirstChild) {
        var elParent = parent instanceof Element ? parent.domElement : parent;
        var elChild = child instanceof Element ? child.domElement : child;
        if (asFirstChild && elParent.hasChildNodes()) {
            elParent.insertBefore(elChild, elParent.firstChild);
        } else {
            elParent.appendChild(elChild);
        }
    };
    /**
     * Removes a HTML child element from a HTML parent node.
     * @param {HTMLElement} parent - The parent node
     * @param {HTMLElement} elChild - The child node to be removed of the parent element
     */
    var disconnectParentChild = function(parent, elChild) {
        var elParent = parent instanceof Element ? parent.domElement : parent;
        elParent.removeChild(elChild);
    };
    /**
     * Removes all HTML children from a parent node.
     * @param {HTMLElement} parent - The HTML parent node
     */
    var removeAllChildren = function(parent) {
        var elParent = parent instanceof Element ? parent.domElement : parent;
        while (elParent.hasChildNodes()) {
            elParent.removeChild(elParent.firstChild);
        }
    };

    /**
     * Sorts options of a html 'select' element from a certain property of the option (e.g. text or value).
     * @param {HTMLElement|Element} select - The Select Element to be sorted
     * @param {string} [property=text] - The Name of the property from wich the option should be compared like <code>value</code> or <code>text</code>.
     * @param {boolean} [isOrderDescending] - <code>true</code> to reverse the sort order.
     */
    var sortSelectBy = function(select, property, isOrderDescending) {
        var elSelect = select instanceof Element ? select.domElement : select;
        var propertyName = property || 'text';
        var sortOptions = [];
        // options to array
        for (var i = 0; i <= select.length - 1; i++) {
            var option = select[i];
            sortOptions.push({
                value:option.value,
                text:option.text,
                selected:option.selected
            });
        }
        // sort array
        sortOptions.sort(function (a, b) {
            if (a[propertyName] < b[propertyName]) { return  isOrderDescending ? 1 : -1; }
            if (a[propertyName] > b[propertyName]) { return isOrderDescending ? -1 : 1; }
            return 0;
        });
        // array to options
        sortOptions.forEach(function (opt, i) {
            select[i].text = opt.text;
            select[i].value = opt.value;
            select[i].selected = opt.selected;
        });
    };

    /**
     * Wrapper for any type of HTML element.
     * @param {string} tagName - The type of element to be created and value of the <code>nodeName</code> attribute
     * @param {string} [id] - The value for the <code>id</code> attribute
     * @param {string} [className] - The value for the <code>class</code> attribute
     * @constructor
     */
    function Element(tagName, id, className) {
        if (!(this instanceof Element)) {
            return new Element(tagName, id, className);
        }
        var domElement = document.createElement(tagName);

        if (typeof id !== 'undefined') {
            domElement.id = id;
        }
        if (typeof className !== 'undefined') {
            domElement.className = className;
        }
        Object.defineProperties(this, {
            domElement: {
                configurable: true, enumerable: true,
                get: function () { return domElement }
            },
            id: {
                configurable: true, enumerable: true,
                get: function() { return domElement.id; },
                set: function(value) { domElement.id = value; }
            },
            className: {
                configurable: true, enumerable: true,
                get: function() { return domElement.className; },
                set: function(value) { domElement.className = value; }
            }
        });
    }
    Element.prototype = {
        constructor: Element,
        /**
         * Adds this HTML element to a parent node HTML element.
         * It will be added as the last child of the node.
         * @param {HTMLElement|Element} elParent - The parent HTML node element
         */
        addAsLastChild : function(elParent) {
            var parent = elParent instanceof Element ? elParent.domElement : elParent;
            connectParentChild(elParent, this.domElement, false);
        },
        /**
         * Adds this HTML element to a parent node HTML element.
         * It will be added as the first child of the node.
         * @param {HTMLElement|Element} elParent - The parent HTML node element
         */
        addAsFirstChild : function(elParent) {
            var parent = elParent instanceof Element ? elParent.domElement : elParent;
            connectParentChild(elParent, this, true);
        },
        /**
         * Adds this HTML element to a parent node HTML element.
         * All children elements will be removed and replaced with this node.
         * @param {HTMLElement|Element} elParent - The parent HTML node element
         */
        addAsOnlyChild : function(elParent) {
            var parent = elParent instanceof Element ? elParent.domElement : elParent;
            removeAllChildren(elParent);
            connectParentChild(elParent, this);
        },
        /**
         * Appends Html node elements to this node as their last children.
         * @param {...HTMLElement|Element|Text} elements - Html elements to be added as children.
         */
        appendChildren : function(elements) {
            for (var i = 0; i <= arguments.length - 1; i++) {
                var child = arguments[i];
                this.domElement.appendChild(child instanceof Element ? child.domElement : child);
            }
        },
        /**
         * Adds Html node Elements to this node as their new children.
         * All current children elements will be removed and replaced with the new children.
         * @param {...HTMLElement} [elements] Html elements to be added as children
         *         No argument will only remove all children.
         */
        setChildren : function(elements) {
            removeAllChildren(this);
            for (var i = 0; i <= arguments.length - 1; i++) {
                connectParentChild(this, arguments[i]);
            }
        }
    };

    /**
     * Wrapper for a 'button' html element.
     * @param {string} [className] - the value for the <code>class</code> attribute
     * @param {function} [callback] - the callback function for the <code>onclick<code> event
     * @param {string} [text] - the content text of the element (text shown on the button)
     * @param {string} [id] - the value for the <code>id</code> attribute
     * @constructor
     */
    function Button(className, callback, text, id) {
        if (!(this instanceof Button)) {
            return new Button(className, callback, text, id);
        }
        Element.call(this, 'BUTTON', id, className);
        if (typeof callback === 'function') {
            this.domElement.addEventListener('click', callback);
        }
        if (typeof text !== 'undefined') {
            this.domElement.appendChild(document.createTextNode(text));
        }
    }
    objectUtils.extend(Button).from(Element);

    /**
     * Wrapper for a 'div' html element.
     * @param {string} [id] - The value for the <code>id</code> attribute
     * @param {string} [className] - The value for the <code>class</code> attribute
     * @constructor
     */
    function Div(id, className) {
        if (!(this instanceof Div)) {
            return new Div(id, className);
        }
        Element.call(this, 'DIV', id, className);
    }
    objectUtils.extend(Div).from(Element);

    /**
     * Wrapper for an 'input' HTML element as a field for text.
     * @param {number|string} [maxLength] - The maximum number of characters
     * @param {string} [text] - The value of the <code>text</code> attribute (content initially shown in the field)
     * @param {string} [className] - The value for the <code>class</code> attribute
     * @param {string} [id] - The value for the <code>id</code> attribute
     * @constructor
     */
    function Input(maxLength, text, className, id) {
        if (!(this instanceof Input)) {
            return new Input(maxLength, text, className, id);
        }
        Element.call(this, 'INPUT', id, className);
        if (typeof maxLength !== 'undefined') {
            this.domElement.maxlength = maxLength;
        }
        if (typeof text !== 'undefined') {
            this.domElement.value = text;
        }
    }
    objectUtils.extend(Input).from(Element);

    /**
     * Creates an 'input' HTML element of type 'checkbox'.
     * @param {function} [callback] - The callback function for the <code>onChange<code> event
     * @param {string} [className] - The value for the <code>class</code> attribute
     * @param {string} [id] - The value for the <code>id</code> attribute
     * @constructor
     */
    function Checkbox (callback, className, id) {
        if (!(this instanceof Checkbox)) {
            return new Checkbox(callback, className, id);
        }
        Element.call(this, 'INPUT', id, className);
        this.domElement.type = 'checkbox';
        if (typeof callback === 'function') {
            this.domElement.addEventListener('change', callback);
        }
    }
    objectUtils.extend(Checkbox).from(Element);

    /**
     * Wrapper for a 'label' html element.
     * @param {string} htmlFor - The value of the <code>for</code> attribute. The id value of another element to bind the label to that element.
     * @param {string} [text] - The content text of the element (text shown on the label)
     * @param {string} [className] - The value for the <code>class</code> attribute
     * @param {string} [id] - The value for the <code>id</code> attribute
     * @constructor
     */
    function Label(htmlFor, text, className, id) {
        if (!(this instanceof Label)) {
            return new Label(htmlFor, text, className, id);
        }
        Element.call(this, 'LABEL', id, className);
        if (typeof text !== 'undefined') {
            this.domElement.appendChild(document.createTextNode(text));
        }
        if (typeof htmlFor !== 'undefined') {
            this.domElement.htmlFor = htmlFor;
        }
    }
    objectUtils.extend(Label).from(Element);

    /**
     * Wrapper for a 'TextArea' html element.
     * @param {number|string} [cols] - The number of columns
     * @param {number|string} [maxLength] The maximum number of characters
     * @param {string} [text] - The value of the <code>text</code> attribute (content initially shown in the field)
     * @param {string} [className] - The value for the <code>class</code> attribute
     * @param {string} [id] - The value of the <code>id</code> attribute
     * @constructor
     */
    function TextArea(cols, maxLength, text, className, id) {
        if (!(this instanceof TextArea)) {
            return new TextArea(cols, maxLength, text, className, id);
        }
        Element.call(this, 'TEXTAREA', id, className);
        if (typeof cols !== 'undefined') {
            this.domElement.cols = cols;
        }
        if (typeof maxLength !== 'undefined') {
            this.domElement.maxlength = maxLength;
        }
        if (typeof text !== 'undefined') {
            this.domElement.value = text;
        }
    }
    objectUtils.extend(TextArea).from(Element);

    /**
     * Wrapper for an 'option' html element which can be added to a 'select' html element.
     * @param text The value of the <code>text</code> attribute shown in the select dropdown
     * @param value THe value of the <code>value</code> attribute
     * @constructor
     */
    function Option(text, value) {
        if (!(this instanceof Option)) {
            return new Option(text, value);
        }
        Element.call(this, 'OPTION');
        this.domElement.text = text;
        this.domElement.value = value;
    }
    objectUtils.extend(Option).from(Element);

    /**
     * Wrapper for a 'Select' html element.
     * @param {string} [id] - The value of the <code>id</code> attribute
     * @param {function} [callback] - callback function triggered by the events <code>OnChange</code>, <code>OnKeyUp</code> and <code>OnFocus</code>
     * @param {string} [className] - The value for the <code>class</code> attribute
     * @constructor
     */
    function Select(className, callback, id) {
        if (!(this instanceof Select)) {
            return new Select(className, id);
        }
        Element.call(this, 'SELECT', id, className);

        var idx = keeper.push({ onChangeCallback : callback });
        Object.defineProperty(this, 'idx', { get: function() { return idx } });
        Select.prototype.setOnChangeKeyUpFocus(callback);
    }
    Select.prototype = {
        constructor: Select,
        addNewOption: function(text, value) {
            var newOption = Option(text, value);
            this.domElement.add(newOption.domElement);
            return newOption;
        },
        sortOptionsByText: function(isOrderDesc) {
            sortSelectBy(this.domElement, 'text', isOrderDesc);
        },
        sortOptionsByValue: function(isOrderDesc) {
            sortSelectBy(this.domElement, 'value', isOrderDesc);
        },
        /**
         * Sets a callback function triggered from the events <code>OnChange</code>, <code>OnKeyUp</code> and <code>OnFocus</code>.
         * Removes any former callback function registered to these events.
         * @param {function} callback
         */
        setOnChangeKeyUpFocus: function(callback) {
            var newCallback = (typeof callback === 'function') ? callback : objectUtils.emptyFunction;

            var formerCallback = keeper.get(this.idx).onChangeCallback;
            this.domElement.removeEventListener("focus", formerCallback);
            this.domElement.removeEventListener("change", formerCallback);
            this.domElement.removeEventListener("keyup", formerCallback);

            keeper.get(this.idx).onChangeCallback = newCallback;
            this.domElement.addEventListener("focus", newCallback);
            this.domElement.addEventListener("change", newCallback);
            this.domElement.addEventListener("keyup", newCallback);
        }
    };
    objectUtils.extend(Select).from(Element);

    /**
     * Parses a param object into a query string and vice verca.
     * @param {Object|string} query - the queryObject object or query string
     * @return {string|Object}
     */
    var parseParams = function(query){
        var result;
        if (typeof query === 'string') {
            result = {};
            var decode = function(s) {
                return decodeURIComponent(s.replace(/\+/g, " "));
            };
            var match, search = /([^&=]+)=?([^&]*)/g;
            while ((match = search.exec(query)) !== null) {
                result[decode(match[1])] = decode(match[2]);
            }
            return result;
        } else {
            result = "";
            Object.keys(query).forEach(function(key, index) {
                if (index >= 1) {
                    result += "&";
                }
                result += key + "=" + query[key];
            });
            return result;
        }
    };

    /**
     * Deals with parameters of a query.
     * @param {string|Object} query - the query search as a string or as parameter object in {key:value} form
     * @constructor
     */
    function Params(query) {
        if (!(this instanceof Params)) {
            return new Params(query);
        }
        var _params = {};
        Object.defineProperties(this, {
            /** The {key:value} parameter object */
            queryObject: {
                get: function() { return _params; },
                enumerable: true, configurable: true
            },
            /** The queryString without leading '?' */
            queryString: {
                get: function () {
                    if (!_params || Object.keys(_params).length === 0) {
                        return "";
                    } else {
                        return parseParams(_params);
                    }
                },
                set: function(val) {
                    if (val) {
                        if (val.charAt(0) === '?') {
                            val = val.substring(1);
                        }
                        _params = parseParams(val);
                    } else {
                        _params = {};
                    }
                },
                enumerable: true, configurable: true
            }
        });
        if (typeof query === 'string') {
            this.queryString = query;
        } else {
            _params = query;
        }
        Object.defineProperty(this, "value", {
            get: function () { return this.queryString; }
        });
    }
    objectUtils.extend(Params).from(objectUtils.Truthy);

    var getPageAsync = function(url, onSuccess, onError) {
        if (typeof onSuccess !== 'function') { onSuccess = objectUtils.emptyFunction;}
        if (typeof onError !== 'function') { onError = objectUtils.emptyFunction;}

        return GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(resp) {
                if (resp.status == 200  ||  resp.status == 304) {
                    resp.html = new DOMParser().parseFromString(resp.responseText, 'text/html');
                    onSuccess(resp);
                } else {
                    onError(resp);
                }
            },
            onerror: onError
        });
    };

    return {
        Element: Element,
        Button: Button,
        Div : Div,
        Input : Input,
        Checkbox : Checkbox,
        Label : Label,
        TextArea : TextArea,
        Option : Option,
        Select : Select,
        Params : Params,
        requestPageAsync : getPageAsync
    };
})();