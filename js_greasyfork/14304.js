// ==UserScript==
// @name        add_modified_script 
// @include     *rcs-rds.ro*
// @grant       none
// @version     1.0
// @description add modified script
// @namespace https://greasyfork.org/users/10606
// @downloadURL https://update.greasyfork.org/scripts/14304/add_modified_script.user.js
// @updateURL https://update.greasyfork.org/scripts/14304/add_modified_script.meta.js
// ==/UserScript==
    var scriptCode = new Array();   // this is where we are going to build our new script
    
    // here's the build of the new script, one line at a time
    scriptCode.push('        var BANNER_CONFIG_DATA = {"header":"","background":"\/images\/cover_rcs-rds_v2.jpg","url":"\/44","backgroundColor":null};');
    scriptCode.push('        $(function() {');
    scriptCode.push('            if ( BANNER_CONFIG_DATA.url ) {');
    scriptCode.push('                    if ( ( event.target || event.srcElement ) == document.body ) {');
    scriptCode.push('                        window.location = BANNER_CONFIG_DATA.url;');
    scriptCode.push('                    }');
    scriptCode.push('                });');
    scriptCode.push('            }');
    scriptCode.push('        });');
    scriptCode.push('}'                                 );
    
    // now, we put the script in a new script element in the DOM
    var script = document.createElement('script');    // create the script element
    script.innerHTML = scriptCode.join('\n');         // add the script code to it
    scriptCode.length = 0;                            // recover the memory we used to build the script
    
    // this is sort of hard to read, because it's doing 2 things:
    // 1. finds the first <head> tag on the page
    // 2. adds the new script just before the </head> tag
    document.getElementsByTagName('head')[0].appendChild(script); 
