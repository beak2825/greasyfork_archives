// ==UserScript==
// @name string format
// @namespace http://tampermonkey.net/
// @version 2.0.2
// @description Format a string with '{0}','{1}'...
// @license Apache License 2.0
// @author 捈荼
// ==/UserScript==

// commented by ChatGPT

(function () {
    "use strict";
 
    // Check if the String.prototype.format function is already defined
    if (String.prototype.format == undefined) {
        // Define a new function named string_format_V2_0_2
        let string_format_V2_0_2 = function () {
            // Get the arguments passed to the function
            let args = arguments;
            // Initialize a counter variable
            let cnt = 0;
            // Check if the string contains numbered placeholders ({0}, {1}, etc.)
            // If not, check if the string contains unnumbered placeholders ({})
            return this.match(/{(\d+)}/g) == null && this.match(/{}/g) != null ?
                // If the string contains unnumbered placeholders, replace them with the corresponding arguments
                this.replace(/{}/g, (match) => {
                    // If the corresponding argument is defined, return it; otherwise, return the placeholder
                    return typeof args[cnt] != 'undefined' ? args[cnt++] : match;
                }) :
                // If the string contains numbered placeholders, replace them with the corresponding arguments
                this.replace(/{(\d+)}/g, (match, number) => {
                    // If the argument at the specified index is defined, return it; otherwise, return the placeholder
                    return typeof args[number] != 'undefined' ? args[number] : match;
                });
        };
        // Add the new function as the String.prototype.format function
        String.prototype.format = string_format_V2_0_2;
    } else {
        // If the String.prototype.format function is already defined, check if it is the correct implementation
        if (String.prototype.format.name != 'string_format_V2_0_2') {
            // If the function is not the correct implementation, throw an error
            throw 'String.prototype.format defined.';
        }
    }
})();