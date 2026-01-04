// ==UserScript==
// @name         Element Cost Tracker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Element Price shown on Character Page
// @author       Naturef
// @match        https://www.lordswm.com/pl_info.php?id=*
// @icon         https://www.google.com/s2/favicons?domain=lordswm.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/426873/Element%20Cost%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/426873/Element%20Cost%20Tracker.meta.js
// ==/UserScript==
const totalCostHTML = '<hr>&nbsp;&nbsp;&nbsp;&nbsp;<b>Total Cost</b>: ' + '&nbsp; <img alt="" src="https://dcdn2.lordswm.com/i/r/48/gold.png?v=3.23de65" border="0" width="12" height="12" title="Cost"> &nbsp' ;
const marketURL = window.location.origin + '/auction.php' ;

async function main()
{
    var marketHTML ;
    try
    {
        marketHTML = await request(marketURL) ;
        if(marketHTML.search("During the journey you have access to the") != -1) throw "You are travelling at the moment" ;
    }
    catch(e)
    {
        console.log("Market not accessible at the moment");
        console.log(e);
        return ;
    }

    var resourceRow = $("b:contains(Resources)")[0].parentNode;
    resourceRow.setAttribute('width','35%');
    var el = resourceRow.parentNode.nextSibling.firstChild;
    console.log(el);
    let elements = loadElements() ;

    var children = el.childNodes ;
    var totalCost = 0 ;
    var pel = document.createElement('p') ;
    pel.innerHTML = totalCostHTML + 0 ;
    el.appendChild(pel) ;
    for(let i = 0 ; i < children.length ; i++)
    {
        let row = children[i] ;
        if(row.nodeName != 'B') continue ;
        let resourceName = row.textContent.trim() ;
        if(!elements[resourceName]) continue ;
        let link = getMarketLink(elements,resourceName) ;
        getMarketPrice(link).then(function (price) {
            // console.log(resourceName,row.nextSibling) ;
            var curr = row.nextSibling ;
            let quantity = Number(curr.textContent.replace(',','').match(/\d+/)[0]) ;
            let b = document.createElement('b') ;
            b.setAttribute('style',"font-size:7pt")
            b.innerHTML = '&nbsp; ' + price.toLocaleString() + 'x' + quantity + ' = ' + (price * quantity) ;
            b.innerHTML = '&nbsp; <img alt="" src="https://dcdn2.lordswm.com/i/r/48/gold.png?v=3.23de65" border="0" width="12" height="12" title="Cost">' + b.innerHTML ;

            //Insert after curr
            curr.parentNode.insertBefore(b,curr.nextSibling) ;
            totalCost += (price * quantity) ;
            pel.innerHTML = totalCostHTML + totalCost.toLocaleString() ;
       }) ;
    }


}

$(document).ready(main);

function getMarketLink(elements, name)
{
    return marketURL + '?cat=elements&sort=0&art_type=' + elements[name] ;
}

function loadElements()
{
    return {
    'Abrasive': 'abrasive',
    'Fern flower': 'fern_flower',
    'Ice crystal': 'ice_crystal',
    'Fire crystal': 'fire_crystal',
    'Meteorite shard' : 'meteorit',
    'Tiger`s claw': 'tiger_tusk',
    'Moonstone': 'moon_stone',
    'Toadstool': 'badgrib',
    'Viper venom': 'snake_poison',
    'Windflower': 'wind_flower',
    'Witch bloom': 'witch_flower'
    } ;

}

async function getMarketPrice(link)
{
    var el = document.createElement('html');
    el.innerHTML = await request(link);
    var b = el.querySelector("tr[class='wb']");
    // console.log(artName, " row", b);
    if(!b) return 0 ;
    var price = getPrice(b);
    return price ;
}

function getPrice(row)
{
    var price = Number(row.childNodes[2].textContent.replaceAll(',', '').match(/\d+/)[0]);
    return price;
}


async function request(url)
{
    return new Promise(function(resolve, reject)
                       {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.ontimeout = function () {
            reject('timeout')
        }
        xhr.open('get', url, true)
        xhr.send()
    });
}