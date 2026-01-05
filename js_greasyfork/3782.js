// ==UserScript==
// @name         GreasyFork Quick fill in reason
// @namespace    http://jixun.org/
// @version      1.0
// @description  Quick fillins.
// @include      https://greasyfork.org/scripts/*/delete
// @include      https://greasyfork.org/scripts/*/undelete
// @copyright    2013+, Jixun.Moe
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/3782/GreasyFork%20Quick%20fill%20in%20reason.user.js
// @updateURL https://update.greasyfork.org/scripts/3782/GreasyFork%20Quick%20fill%20in%20reason.meta.js
// ==/UserScript==

var reason = document.getElementById('reason');
var insertReason = function (text) {
    var startPos = reason.selectionStart,
    	endPos = reason.selectionEnd,
        scrollTop = reason.scrollTop;
    
    reason.value = 
        reason.value.slice (0, startPos) +
        text + reason.value.substring(endPos, reason.value.length);
    reason.focus();
    
    var posFillSpace = text.indexOf ('___');
    if (posFillSpace === -1) {
    	reason.selectionStart = reason.selectionEnd = startPos + text.length;
    } else {
        reason.selectionStart = startPos + posFillSpace;
        reason.selectionEnd   = startPos + posFillSpace + 3;
    }
    reason.scrollTop = scrollTop;
};

var pListReason = document.createElement ('p');
pListReason.className = 'jx_rmReasons';
reason.parentNode.insertBefore (pListReason, reason.nextSibling);

var h3CommonReason = document.createElement ('h3');
h3CommonReason.textContent = 'Common script removal reason:';
pListReason.appendChild (h3CommonReason);

var styleLinkify = document.createElement ('style');
styleLinkify.textContent = '\
.jx_rmReasons{margin: 0 !important; font-size: small}\
.jx_rmReasons>h3{margin: 0 !important}\
.jx_rmReasons > a{cursor: pointer}\
.jx_rmReasons > a:hover{color: black}';
document.head.appendChild (styleLinkify);

(function (reasons) {
    var linkReason;
    for (var i = 0, hasLinebreak = false, hasSeperator = false; i < reasons.length; i++) {
        if (hasLinebreak) {
            pListReason.appendChild (document.createElement ('br'));
        	hasSeperator = hasLinebreak = false;
        }
        
        if (hasSeperator) {
            pListReason.appendChild (document.createTextNode (' '));
        }
        
        if (reasons[i] === 0) {
            hasLinebreak = true;
            hasSeperator = false;
        } else {
            linkReason = document.createElement ('a');
            linkReason.textContent = reasons[i];
            pListReason.appendChild (linkReason);
            hasSeperator = reasons[i + 1] && reasons[i + 1] !== 0;
    	}
    }
    
    pListReason.addEventListener ('click', function (e) {
        if (e.target.tagName !== 'A')
            return ;
        
        insertReason (e.target.textContent);
    }, false);
})([
    'Duplicate of #___', 'Duplicate of an old version as #___', 'Unauthorized copy',
    	0,
    'Not a script. ', 'Spam. ',
    	0,
    'Minified, ', 'Truncated, ', 'Non-Functional, ', 'Ofuscated, ', 'Suspicious, ', 'code.',
    	0,
    'Duplication of another script in this site.', 'See #comment/___ for more information.'
]);