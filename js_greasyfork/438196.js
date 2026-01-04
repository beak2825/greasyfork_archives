// ==UserScript==
// @name        utilise killer
// @description "utilise" --> "use" (and other "utilise" variants)
// @include     http://*/*
// @include     https://*/*
// @version     2.1
// @license MIT
// @grant       none
// @run-at document-idle
// @namespace https://greasyfork.org/users/730393
// @downloadURL https://update.greasyfork.org/scripts/438196/utilise%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/438196/utilise%20killer.meta.js
// ==/UserScript==

//matches "utilise" variants
var finder=/\butili[sz](?:e|ing)/gi;

function subFunc(s){
    //"utilise"-->"use"
    //preserves capitalisation
    //ASSUMES input is a "utilise" variant
    let res=s.replace(/^([uU])[^szSZ]*[sz](.*)$/,"$1s$2");//lowercase s/z
    if (res!=s){return res;}
    return s.replace(/^([uU])[^szSZ]*[SZ](.*)$/,"$1S$2");//uppercase s/z
}

function substituteText(text){return text.replace(finder, subFunc);}

function doSubstitutions(){
    var textNodes = document.evaluate("//text()", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        //apparently rewriting all the nodes with the same thing breaks some websites(eg:twitter)
        //calculate before/after
        var data=node.data;
        var new_data=substituteText(node.data);
        //replace if needed
        if (data!=new_data){node.data=new_data;}
    }
}

//at idle
doSubstitutions()
//repeat after 1s
setTimeout(doSubstitutions,1000);