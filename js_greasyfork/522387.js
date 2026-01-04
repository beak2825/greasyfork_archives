// ==UserScript==
// @name           Includes : XPath
// @description    xpath Function
// @author         You
// @version        1.0
// @language       en
// @include        nowhere
// @namespace https://greasyfork.org/users/1385333
// @downloadURL https://update.greasyfork.org/scripts/522387/Includes%20%3A%20XPath.user.js
// @updateURL https://update.greasyfork.org/scripts/522387/Includes%20%3A%20XPath.meta.js
// ==/UserScript==

/**************************************************************************

    Author 's NOTE

    Original http://lowreal.net/blog/2007/11/17/1

***************************************************************************

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

**************************************************************************/

const XPath = Xpath = xpath = (...args) => {
    let [expression, context, type] = args;  // Destructuring arguments

    if (typeof context === "function") {
        type = context;
        context = null;
    }

    if (!context) context = document.documentElement || document;
    const documentInstance = context.ownerDocument || context;

    const evaluator = documentInstance.createExpression(expression, (prefix) => {
        const ns = documentInstance.createNSResolver(context).lookupNamespaceURI(prefix);
        if (ns) return ns;

        switch (context.contentType) {
            case "text/xhtml":
            case "application/xhtml+xml":
                return "http://www.w3.org/1999/xhtml";
            default:
                return "";
        }
    });

    switch (type) {
        case String:
            return evaluator.evaluate(context, XPathResult.STRING_TYPE, null).stringValue;
        case Number:
            return evaluator.evaluate(context, XPathResult.NUMBER_TYPE, null).numberValue;
        case Boolean:
            return evaluator.evaluate(context, XPathResult.BOOLEAN_TYPE, null).booleanValue;
        case Array: {
            const result = evaluator.evaluate(context, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const resultArray = [];
            for (let i = 0; i < result.snapshotLength; i++) {
                resultArray.push(result.snapshotItem(i));
            }
            return resultArray;
        }
        case undefined: {
            const result = evaluator.evaluate(context, XPathResult.ANY_TYPE, null);
            switch (result.resultType) {
                case XPathResult.STRING_TYPE:
                    return result.stringValue;
                case XPathResult.NUMBER_TYPE:
                    return result.numberValue;
                case XPathResult.BOOLEAN_TYPE:
                    return result.booleanValue;
                case XPathResult.UNORDERED_NODE_ITERATOR_TYPE: {
                    const nodes = [];
                    let node;
                    while ((node = result.iterateNext())) {
                        nodes.push(node);
                    }
                    return nodes;
                }
                default:
                    return null;
            }
        }
        default:
            throw new TypeError("xpath: specified type is not a valid type.");
    }
};
