// ==UserScript==
// @name         Thingworx Load Monaco Editor
// @namespace    https://github.com/ptc-iot-sharing/MonacoEditorTWX
// @version      0.3
// @description  Loads the monaco editor in the new composer from CDN.
// @author       Petrisor Lacatus
// @match         *://*/Thingworx/Composer/*
// @match         *://*/Thingworx/Builder/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389994/Thingworx%20Load%20Monaco%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/389994/Thingworx%20Load%20Monaco%20Editor.meta.js
// ==/UserScript==

const TWX_MONACO_VERSION = 'latest';

var script = document.createElement("script");
script.src = `https://cdn.jsdelivr.net/npm/@placatus/twx-monaco-editor@${TWX_MONACO_VERSION}/build/ui/MonacoScriptEditor/newComposer.bundle.js`;
script.charset = "UTF-8";
document.getElementsByTagName("head")[0].appendChild(script);