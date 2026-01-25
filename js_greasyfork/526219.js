// ==UserScript==
// @name         Shell Shockers Model Injector: Barclay's
// @namespace    https://github.com/onlypuppy7/BarclaysShellShockers/
// @license      GPL-3.0
// @version      2.1.5
// @author       onlypuppy7
// @description  Import whatever model URLs you need - template and example code
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/BarclaysShellShockers/blob/main/logo.png?raw=true


// @require      https://update.greasyfork.org/scripts/526336/user.js?v=2.1.4
// @downloadURL https://update.greasyfork.org/scripts/526219/Shell%20Shockers%20Model%20Injector%3A%20Barclay%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/526219/Shell%20Shockers%20Model%20Injector%3A%20Barclay%27s.meta.js
// ==/UserScript==

//NOTE: to make sure the Barclay's Library updates with your script, you must update the ?v=[version] parameter in the @require line above
//  -> otherwise userscript managers will not update the library and keep using the cached version
//  -> the actual thing you put is not important, just make sure it is different from the previous version
//  -> this is a limitation of userscript managers, not the library

//this script is a template for using the Barclays library to import models into Shell Shockers
//please refer to the library's documentation for more information

BARCLAYS.modelURLs = [
    //put model urls here. glb format ONLY.
    //please refer to the library's documentation for more information

    //examples:
    // "https://cdn.onlypuppy7.org/hattestWide2.glb", //makes the top hat WIDE
    // "https://cdn.onlypuppy7.org/blendertest7.glb", //replaces castle brick with the blender default cube because why not (screws up lightmap)
    "https://cdn.onlypuppy7.org/eggmodeltest.glb", //replaces the egg with the blender default cube
    // "https://cdn.onlypuppy7.org/classicguns7.glb", //imports the classic guns (cluck9mm, soldier (brokenish), dozengauge, free ranger)
    "https://cdn.onlypuppy7.org/animtest3.glb", //replaces crackshot with legacy crackshot, and replaces the 

    // "/models/full/egg.glb", //replaces the replaced egg with the default egg, useful for reverting changes
];

//as this script has no injection mechanism, we use the library's built in one
BARCLAYS.init();

//just to make it obvious
BARCLAYS.log("Example script started.");

//if at a stage you would like to make more model changes, you can run code like this:
/* //(uncomment to use)
BARCLAYS.replaceModels([
    "https://link.to/your/model.glb",
]);
*/

//if you need to restore the original models, you can run this:
// BARCLAYS.restoreModels();
//note: dont run this over and over again, it will cause performance issues

//uncomment to expose the BARCLAYS object to the console/window
// window.BARCLAYS = BARCLAYS;