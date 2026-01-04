// ==UserScript==
// @name         FunctionHooker.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hook most functions on runtime via the function name
// @author       You
// @match        *://*.*
// @grant        none
// ==/UserScript==

class FunctionHooker {
    constructor() {
        this.hooks = new Map();
        this.originalName = "";
    }
    getOriginal(functionName) {
        return this.hooks.get(functionName);
    }

    hook(targetFunction, hookFunction) {
        const isString = typeof targetFunction == "string";
        // TODO: isString is used to eventually distinct a target function passed as a direct reference
        // to a function from the user passing a function name as a string
        // problem is there is no way to go from a function reference to a proper function name string

        const isFullyQualifiedName = targetFunction.indexOf('.') != -1;
        this.originalName = targetFunction;
        if (isFullyQualifiedName) { this.hookFullyQualified(targetFunction, hookFunction); return; }

        const originalFunction = window[targetFunction];

        if (originalFunction) {
            this.hooks.set(targetFunction, originalFunction);
            window[targetFunction] = hookFunction;
        } else {
            throw new Error(`Function '${targetFunction}' does not exist in the 'window' object.`);
        }
    }

    unhook(functionName) {
        const isFullyQualifiedName = functionName.indexOf('.') != -1;
        if (isFullyQualifiedName) { this.unhookFullyQualified(functionName); return; }
        const originalFunction = this.hooks.get(functionName);

        if (originalFunction) {
            window[functionName] = originalFunction;
            this.hooks.delete(functionName);
        } else {
            throw new Error(`Function '${functionName}' is not hooked.`);
        }
    }

    resolveFullyQualifiedFunctionName(functionName) {
        const functionNames = functionName.split('.');
        let resolvedFunction = window;

        for (const name of functionNames) {
            resolvedFunction = resolvedFunction[name];

            if (!resolvedFunction) {
                throw new Error(`Function '${functionName}' does not exist.`);
            }
        }

        return resolvedFunction;
    }

    hookFullyQualified(functionName, hookFunction) {
        const resolvedFunction = this.resolveFullyQualifiedFunctionName(functionName);
        const originalFunction = resolvedFunction;

        this.hooks.set(functionName, originalFunction);

        const parentObject = functionName
        .split('.')
        .slice(0, -1)
        .reduce((obj, prop) => (obj[prop] ? obj[prop] : obj), window);

        const functionNameLeaf = functionName.split('.').pop();
        if (typeof parentObject[functionNameLeaf] != 'function') { debugger; throw new Error(`Function '${this.originalName}' is not hooked.`); }
        parentObject[functionNameLeaf] = hookFunction;
    }

    unhookFullyQualified(functionName) {
        const resolvedFunction = this.resolveFullyQualifiedFunctionName(functionName);
        const originalFunction = this.hooks.get(functionName);

        if (originalFunction) {
            const parentObject = functionName
            .split('.')
            .slice(0, -1)
            .reduce((obj, prop) => (obj[prop] ? obj[prop] : obj), window);

            const functionNameLeaf = functionName.split('.').pop();
            parentObject[functionNameLeaf] = originalFunction;

            this.hooks.delete(functionName);
        } else {
            throw new Error(`Function '${functionName}' is not hooked.`);
        }
    }
}