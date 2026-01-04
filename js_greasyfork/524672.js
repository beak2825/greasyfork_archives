// ==UserScript==
// @name         Colored Logging
// @version      2025-01-23
// @description  allows you to use predefined logging methods which add some color variety
// @author       JavedPension
// ==/UserScript==


const log = new class {
    static logColor = "lightgreen";
    static warnColor = "yellow";
    static errorColor = "red";
    
    add(message) {
        console.log(`[%c*%c] ${message}`, `color: ${this.constructor.logColor};`, "color: inherit;");
    }
    
    warn(message) {
        console.log(`[%c?%c] ${message}`, `color: ${this.constructor.warnColor};`, "color: inherit;");
    }
    
    error(message) {
        console.log(`[%c!%c] ${message}`, `color: ${this.constructor.errorColor};`, "color: inherit;");
    }
}();