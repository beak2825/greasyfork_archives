// ==UserScript==
// @name            Perseus Hover Footnotes
// @namespace       https://bifrost.me
// @version         1.1
// @description	    Allows you to hover your mouse over footnotes and see the text immediately.
// @include         https://www.perseus.tufts.edu/hopper/text?*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/17181/Perseus%20Hover%20Footnotes.user.js
// @updateURL https://update.greasyfork.org/scripts/17181/Perseus%20Hover%20Footnotes.meta.js
// ==/UserScript==

(function() {
    // Hide footer junk
	GM_addStyle('.rights_info {display: none;} '
	    + '.footnotes {border-top: 2px solid black;}');

    // Remove internal section numbers that break up the text
    var sectionNumbers = document.getElementsByClassName('english');
    var len = sectionNumbers.length;
    for(let i=0; i < len; i++) {
        let number = sectionNumbers[0];
        number.parentNode.removeChild(number);
    }
    var mainText = document.getElementById('text_main');
    mainText.innerHTML = mainText.innerHTML.replace(/\[\]/g, '');

    // Add footnote hovers
    var sups = document.getElementsByTagName('sup');
    var footnotehtml = [];
    window.footnoteinuse = false;
    for(let i=0; i<sups.length; i++) {
        var sup = sups[i].parentNode;
        if(sup['id']) {
            var notenum = sup.hash.substr(1);
            var footnote = document.getElementById(notenum);
            if(!footnote) continue;

            footnotehtml[i] = footnote.innerHTML;
            sup.childNodes[0].textContent = '[' + (i + 1) + ']';
            sup.setAttribute('footnoteindex', i);
            sup.addEventListener('mouseover',
                function(event) {
                    window.footnoteinuse = false;
                    var footnotepopup = document.getElementById('footnotepopup');
                    if(footnotepopup) footnotepopup.parentNode.removeChild(footnotepopup);
                    var index = parseInt(this.getAttribute('footnoteindex'));

                    var popup = document.createElement('div');
                    popup.innerHTML = footnotehtml[index];

                    popup.id = 'footnotepopup';
                    popup.style.position = 'absolute';
                    popup.style.left = (event.pageX - 50) + 'px';
                    popup.style.top = (event.pageY + 10) + 'px';
                    popup.style.maxWidth = '40%';
                    popup.style.textAlign = 'left';
                    popup.style.backgroundColor = 'paleGoldenRod';
                    popup.style.border = 'thin solid';
                    popup.style.padding = '5px';
                    popup.style.zIndex = '99';
                    popup.style.fontSize = 'x-small';

                    popup.addEventListener('mouseover', function(event){
                        window.footnoteinuse = true;
                    }, true);

                    popup.addEventListener('mouseout',function(event){
                        window.footnoteinuse = false;

                        var footnotepopup = document.getElementById('footnotepopup');
                        window.setTimeout(function(){
                            if(footnotepopup && !window.footnoteinuse && footnotepopup.parentNode) {
                                footnotepopup.parentNode.removeChild(footnotepopup);
                            }
                        }, 150);
                    }, true);

                    document.body.appendChild(popup);
                    var footnotepopup2 = document.getElementById('footnotepopup');
            }, true);


            sup.addEventListener('mouseout',function(event) {
                var footnotepopup = document.getElementById('footnotepopup');
                window.setTimeout(function(){
                    if(footnotepopup && !window.footnoteinuse && footnotepopup.parentNode) {
                        footnotepopup.parentNode.removeChild(footnotepopup);
                    }
                }, 150);
            }, true);
        }
    }
})();