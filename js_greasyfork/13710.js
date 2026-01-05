// ==UserScript==
// @name         Tumblr Remove Recommended
// @namespace    https://greasyfork.org/ja/users/19495-kakkou
// @version      0.1
// @description  Tumblrのダッシュボードに挿入されるおすすめを消す
// @author       kakkou
// @match        https://www.tumblr.com/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13710/Tumblr%20Remove%20Recommended.user.js
// @updateURL https://update.greasyfork.org/scripts/13710/Tumblr%20Remove%20Recommended.meta.js
// ==/UserScript==

function deleteNode(node) {
    if ( node.nodeName == "LI"　&& node.getAttribute("class") == "post_container" ) {
        var div = node.childNodes[0]; //div
        if ( div.getAttribute("data-is_recommended") ) {
            node.parentNode.removeChild(node);
            return 1;
        }
    }
    return 0;
}

// 最初から読まれてる奴を消す
var elements = document.getElementsByClassName("post_container");
var index = 0;
while(index < elements.length) {
    if ( deleteNode(elements[index]) == 0 ) {
        ++index;
    }
}

// 動的にロードされる奴を消す
document.addEventListener("DOMNodeInserted", function(e){
    deleteNode(e.target);
});