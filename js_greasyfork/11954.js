// ==UserScript==
// @name        Fallen London - Wiki Linking
// @namespace   fallenlondon/wiki
// @description Adds Fallen London Archives wiki links to storylet titles and options.
// @author      Travers
// @include     http://*fallenlondon.com/Gap/Load*
// @include     http://fallenlondon.storynexus.com/Gap/Load*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11954/Fallen%20London%20-%20Wiki%20Linking.user.js
// @updateURL https://update.greasyfork.org/scripts/11954/Fallen%20London%20-%20Wiki%20Linking.meta.js
// ==/UserScript==
setUpObserver();

function setUpObserver()
{
    var target = document.querySelector('#mainContentLoading');
    var peeper = new MutationObserver(linkStorylets);
    peeper.observe(target, {attributes: true, childList: false, characterData: false});
}

function encodeLink(s)
{
    //Example: An Island with Secrets?  --->  An_Island_with_Secrets%3F
    s = s.replace(/ /g,'_');
    s = encodeURIComponent(s);
    return s;
}

function insertLink(elements)
{
    if (elements.length > 0)
    {
        var name = elements[0].innerHTML.trim();  
        elements[0].innerHTML = '<a style="color:black" href="http://fallenlondon.wikia.com/wiki/' + encodeLink(name) + '">' + name+'</a>';  
    }  
}

function linkStorylets()
{
    var storylets = document.getElementsByClassName('storylet_rhs');
    for (var i = 0; i < storylets.length; i++)
    {
        insertLink(storylets[i].getElementsByTagName('H2'));
        insertLink(storylets[i].getElementsByTagName('H5'));
    }   
    
    storylets = document.getElementsByClassName('storylet_flavour_text');
    if (storylets.length > 0)
    {
        insertLink(storylets[0].getElementsByTagName('H3'));
    }    
}