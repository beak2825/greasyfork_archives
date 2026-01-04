// ==UserScript==
// @name        LWM Art Shop Price
// @description Shows total price of a shop art
// @include    https://www.lordswm.com/art_info.php?id=*
// @version 0.0.1.20210613083056
// @namespace https://greasyfork.org/users/774353
// @downloadURL https://update.greasyfork.org/scripts/427887/LWM%20Art%20Shop%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/427887/LWM%20Art%20Shop%20Price.meta.js
// ==/UserScript==

var goldImg = '<img alt="" src="https://dcdn2.lordswm.com/i/r/48/gold.png?v=3.23de65" border="0" width="24" height="24" title="Cost">&nbsp' ;
function main()
{
    let artCost = document.querySelector('.s_art_inside').firstChild.nextSibling.querySelectorAll('td');
    console.log(artCost) ;
    if(!artCost) return ; 
    let totalPrice = 0 ; 
    
    for(let i = 0 ; i < artCost.length ; i += 2)
    {
        let x = artCost[i] ;
        let quantity = Number(artCost[i+1].textContent.replace(',','')) ; 
        switch(x.firstChild.getAttribute('title'))
        {
            case 'Gold':
                break ;
            case 'Ore':
            case 'Wood':
                quantity *= 180 ;
                break ;
            case 'Gems':
            case 'Sulfur':
            case 'Mercury':
            case 'Crystals':
                quantity *= 360 ;
                break ;
        }
        
        totalPrice += quantity ; 
    }
    
    var lastChild = artCost[artCost.length - 1] ; 
    console.log(lastChild) ; 
    
    var div = document.createElement('td');
    div.innerHTML = '&nbsp&nbsp=&nbsp&nbsp' + goldImg ;
    lastChild.parentNode.appendChild(div) ; 
    
    div = document.createElement('td') ; 
    div.innerHTML = totalPrice ; 
    lastChild.parentNode.appendChild(div) ; 
}

main() ; 


function findTotalCost(row)
{
    var totalPrice = 0 ;
    for(let i = 1; i < row.childNodes.length ; i++)
    {
        var x = row.childNodes[i] ;
        var quantity = Number(row.childNodes[i].textContent.replace(',','')) ;
        switch(x.childNodes[0].getAttribute('hint'))
        {
            case 'Gold':
                break ;
            case 'Ore':
            case 'Wood':
                quantity *= 180 ;
                break ;
            case 'Gems':
            case 'Sulfur':
            case 'Mercury':
            case 'Crystals':
                quantity *= 360 ;
                break ;
        }

        totalPrice += quantity ;
    }
    return totalPrice ;
}