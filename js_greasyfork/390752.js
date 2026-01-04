// ==UserScript==
// @name         Comparator
// @namespace    hoehleg.userscripts.private
// @version      0.4
// @description  Configurable Comparator similar to java.util.Comparator in Java 8
// @author       Gerrit Höhle
// @grant        none
// ==/UserScript==

/* jshint esnext: true */
const Comparator = (() => {
    'use strict';

    // internal functions
    const isMissing = obj => obj === null || typeof obj === "undefined";
    const compareValues = (a, b) => (a < b) ? -1 : ((a === b) ? 0 : 1);
    const compareByMissing = (a, b) => isMissing(a) ? (isMissing(b) ? 0 : 1) : (isMissing(b) ? -1 : null);

    /**
     * Basic compare function
     * @param {*} a - Object or value to compare
     * @param {*} b - Object or value to which to compare
     * @param {boolean} [missingFirst=false] - order of "undefined" and "null". true = first, false = last.
     * @returns "-1" for a < b, "0" for a === b or "1" for a > b
     **/
    const compare = (a, b, missingFirst = false) => {
        let result = missingFirst ? compareByMissing(b, a) : compareByMissing(a, b);
        if (result !== null) {
            return result;
        }

        if (typeof a === 'string' || a instanceof String) {
            return a.localeCompare(b);
        }

        if (a instanceof Date) {
            return compareValues(a.valueOf(), b.valueOf());
        }

        return compareValues(a, b);
    };

    /**
     * Creates the compare-function bound to a Comparator.
     * @param {Comparator} cmparator - the Comparator the compare - function should belong to
     * @returns {Function} the compare(a, b) - function
     */
    const createCompareFunction = (comparator) => {
        /**
         * Compare function bound to a comparator.
         * When executed the current setup of the comparator is considered
         * @param {*} a - Object or value to compare
         * @param {*} b - Object or value to which to compare
         **/
        return (a, b) => {
            if (comparator.isAscending) {
                const tmp = a;
                a = b;
                b = tmp;
            }

            let result = comparator.isMissingFirst ? compareByMissing(b, a) : compareByMissing(a, b);

            for (let i = 0; !result && i < comparator.sortByFunctionsAndComparators.length; i++) {
                const accessorFnc = comparator.sortByFunctionsAndComparators[i];

                if (accessorFnc instanceof Comparator) {
                    result = accessorFnc.compare(a, b);
                } else {
                    result = compare(accessorFnc(a), accessorFnc(b), comparator.isMissingFirst);
                }
            }

            return result !== null ? result : compare(a, b, comparator.isMissingFirst);
        };
    };

    // private field accessor
    const _isReverse = Symbol("isReverse");
    const _accessorFunctions = Symbol("accessorFunctions");
    const _isMissingFirst = Symbol("isMissingFirst");
    const _compareFunction = Symbol("compareFunction");

    // export class
    return class Comparator {
        /**
         * @param {Array.<function|Compator>} sortByFunctionsAndComparators - accessor-functions or comparators to evaluate values to sort by
         */
        constructor(...sortByFunctionsAndComparators) {
            this[_accessorFunctions] = sortByFunctionsAndComparators;
            this[_isReverse] = false;
            this[_isMissingFirst] = false;
            this[_compareFunction] = createCompareFunction(this);
        }

        /**
         * @type {Array.<function|Compator>} - accessor-functions and/or comparators to evaluate values to sort by
         **/
        get sortByFunctionsAndComparators() {
            return [...this[_accessorFunctions]];
        }

        get isAscending() {
            return this[_isReverse];
        }

        get isDescending() {
            return !this.isAscending;
        }

        get isMissingFirst() {
            return this[_isMissingFirst];
        }

        get isMissingLast() {
            return !this.isMissingFirst;
        }

        /**
         * @type {Function} - the compare(a, b) - function that returns "-1" for a < b, "0" for a === b or "1" for a > b.
         * the funtion is setup by this Comparator
         **/
        get compareFnc() {
            return this[_compareFunction];
        }

        /**
         * Defines that "undefined" and "null" gets sorted to the begin
         **/
        setMissingFirst() {
            this[_isMissingFirst] = true;
            return this;
        }

        /**
         * Defines that "undefined" and "null" gets sorted to the end
         **/
        setMissingLast() {
            this[_isMissingFirst] = false;
            return this;
        }

        /**
         * Reverses the sort order from ascending to descending and vice versa
         **/
        reverse() {
            this[_isReverse] = !this[_isReverse];
            return this;
        }

        /**
         * Compares an object or value to another considering the setup of this Comparator
         * @param {*} a - Object or value to compare
         * @param {*} b - Object or value to compare by
         * @returns "-1" for a < b, "0" for a === b or "1" for a > b
         **/
        compare(a, b) {
            return this.compareFnc(a, b);
        }
        
        /**
         * Compares an object or value to another one
         * @param {*} a - Object or value to compare
         * @param {*} b - Object or value to compare by
         * @param {boolean} [missingFirst=false] - order of "undefined" and "null". true = first, false = last.
         * @returns "-1" for a < b, "0" for a === b or "1" for a > b
         **/
        static compare(a, b, missingFirst = false) {
            return compare(a, b, missingFirst);
        }
    };
})();