// ==UserScript==
// @name         Admin Permission Grant
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Grant admin permissions on Scratch
// @author       You
// @match        https://scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525179/Admin%20Permission%20Grant.user.js
// @updateURL https://update.greasyfork.org/scripts/525179/Admin%20Permission%20Grant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('#app')._reactRootContainer._internalRoot.current.child.stateNode.props.store.getState().permissions.admin = true;
})();
