// ==UserScript==
// @name           Exhentai and E-Hentai Cross Links on Gallery Pages
// @version        2.1
// @description    Adds links to the gallery pages to navigate between exhentai and e-hentai
// @include        https://exhentai.org/g/*/*/
// @include        https://e-hentai.org/g/*/*/
// @grant		   none
// @author         Lax
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at         document-end
// @namespace      https://greasyfork.org/users/4989
// @downloadURL https://update.greasyfork.org/scripts/391562/Exhentai%20and%20E-Hentai%20Cross%20Links%20on%20Gallery%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/391562/Exhentai%20and%20E-Hentai%20Cross%20Links%20on%20Gallery%20Pages.meta.js
// ==/UserScript==

//Disabled Currently not working
function linkify(place){
    let a = $(place);
    let c = a.attr('onclick').split("\'");
        a.removeAttr('onclick');
        a.attr('href', c[1]);
    }

function createButtonTo(dest,gif){
    let target = dest.substring(0,2);
    let archiveDownloadButton = document.getElementsByClassName('g2')[0];
    // Create the main button
    let newCrosslinkButton = document.createElement('p');
        $(newCrosslinkButton).attr({'style' : 'padding: 0 0 9px' , 'id' : 'goto'});
        // Place after the archive download button
        $(archiveDownloadButton).after(newCrosslinkButton);

    // Create the icon
    let icon = document.createElement('img');
        icon.setAttribute('src',gif);
        // Add to button        
        $(newCrosslinkButton).append(icon);
        // Add whitespace
        $(icon).after(' ');
        // Create a blank for alignement

    // Get the URL part
    let urlpart = document.URL.substring(10);
    // Create link to be appended to main button
    let c_link = document.createElement('a');
        $(c_link).attr({'id' : 'c_link' , 'href' : `https://${target}${urlpart}` , 'style' : 'font-weight: bold;text-decoration: none;'});
        // Create textnode for the link
        let desc = document.createTextNode(`Go to ${dest}.org`);
        // Append textnode to link
        c_link.appendChild(desc);
        // Add to button
        $(newCrosslinkButton).append(c_link);
    }
    
if(document.URL.indexOf('exhentai.org/g/') >= 0){
    createButtonTo('e-hentai','https://exhentai.org/img/mr.gif');
    }
if(document.URL.indexOf('e-hentai.org/g/') >= 0){
    createButtonTo('exhentai','https://ehgt.org/g/mr.gif');
    }