// ==UserScript==
// @name            test-utils
// @name:de         test-utils
// @namespace       dannysaurus.camamba
// @version         0.1
// @license         MIT License
// @description     primitive assert-methods for unit-testing
// @description:de  primitive assert-methods for unit-testing
// ==/UserScript==
var LIB = LIB || {};
/**
 * @type {{assertTrue}}
 */
LIB.testUtils = (function() {
    'use strict';
    function messageNotEquals(expected, actual) {
        return "Assertion failed. expected: " + expected + " actual: " + actual
    }
    /**
     * Throws an error if assertion fails
     * @param {boolean} condition - condition to be checked</br><code>true</code> has the assertion succeed </br>false has the assertion fail (and throws an Error)
     * @param {string} [message] - debug-message to display if the assertion fails
     */
    var assertTrue = function(condition, message) {
        message = message || "Assertion failed";
        if (!condition) {
            throw new Error(message);
        }
    };
    /**
     *  Asserts that two values or objects are equal. Throws an Error if assertion fails.
     *  Strict comparison (<code>===</code>) is used to check for equality.
     * @param {*} expected - the expected value or object
     * @param {*} actual - the value or object to check against <code>expected</code>
     */
    var assertEquals = function(expected, actual) {
        var message = messageNotEquals(expected, actual);
        assertTrue(expected === actual, message);
    };
    /**
     *  Asserts that two values or objects are equal. Throws an Error if assertion fails.
     *  Nonstrict comparison with type convertation (<code>==</code>) is used to check for equality.
     * @param {*} expected - the expected value or object
     * @param {*} actual - the value or object to check against <code>expected</code>
     */
    var assertEqualsNonStrict = function(expected, actual) {
        var message = messageNotEquals(expected, actual);
        assertTrue(expected == actual, message);
    };
    return {
        assertTrue: assertTrue,
        assertEquals: assertEquals,
        assertEqualsNonStrict: assertEqualsNonStrict
    };
})();