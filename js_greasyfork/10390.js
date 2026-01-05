// ==UserScript==
// @name         MtG CUSTD League selector
// @namespace    http://com.aacid/
// @version      1.0
// @description  preselects all sets legal in our own League (only commons and uncommons, from standard legal sets) on magiccards.info advances search form
// @author       aacid
// @match        https://magiccards.info/search.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10390/MtG%20CUSTD%20League%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/10390/MtG%20CUSTD%20League%20selector.meta.js
// ==/UserScript==

var select = document.getElementById('edition');

var newButton = document.createElement('button');
select.parentNode.insertBefore(newButton, select.previousElementSibling);
newButton.textContent = 'CU League';
newButton.style.backgroundColor = 'yellow';
newButton.onclick = function(event)
{
    document.getElementById('uncommon').checked = true;
    document.getElementById('common').checked = true;
    document.getElementsByName('s')[0].value = 'cmc';
    var optionsToSelect = ['Kaladesh', 'Aether Revolt', 'Amonkhet', 'Hour of Devastation', 'Ixalan'];
    
    for ( var i = 0, l = select.options.length, o; i < l; i++ )
    {
        o = select.options[i];
        if ( optionsToSelect.indexOf( o.text ) != -1 )
        {
            o.selected = true;
        }
    }
    return false;
};
