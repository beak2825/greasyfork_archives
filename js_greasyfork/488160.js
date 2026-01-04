// ==UserScript==
// @name         make-mutation-observer
// @description  Simple wrapper around `MutationObserver` API to watch DOM changes.
// @version      0.1.0
// @namespace    owowed.moe
// @author       owowed <island@owowed.moe>
// @license      LGPL-3.0
// ==/UserScript==

/**
 * @typedef {(info: { records: MutationRecord[], observer: MutationObserver }) => void} MakeMutationObserverCallback
 */

/**
 * @typedef MakeMutationObserverOptionsBasic
 * @prop {HTMLElement} target
 * @prop {MakeMutationObserverCallback} callback
 * @prop {AbortSignal} [abortSignal]
 * @prop {boolean} [once]
 */

/** @typedef {MakeMutationObserverOptionsBasic & MutationObserverInit} MakeMutationObserverOptions */

/**
 * Create a new `MutationObserver` from target and callback.
 * @param {Node} target target node
 * @param {MakeMutationObserverCallback} callback observer callback
 * @param {MakeMutationObserverOptions} options additional observer options
 * @returns {MutationObserver}
 */
function makeMutationObserver(target, callback, options) {
    return makeMutationObserverOptions({ target, ...options }, callback);
}

/**
 * Create a new `MutationObserver` with options and callback.
 * @param {MakeMutationObserverOptions} options 
 * @param {MakeMutationObserverCallback} callback 
 * @returns {MutationObserver}
 */
function makeMutationObserverOptions({ target, abortSignal, once, ...options }, callback) {
   const observer = new MutationObserver(records => {
       abortSignal?.throwIfAborted();
       if (once) observer.disconnect();
       callback({ records, observer });
   });

   observer.observe(target, options);

   abortSignal?.addEventListener("abort", () => {
       observer.disconnect();
   });

   return observer;
}