// ==UserScript==
// @name        Castle Cost Calculator
// @description Tells the Amount of Resources Required
// @version 0.1
// @match       https://www.lordswm.com/castle.php*
// @namespace https://greasyfork.org/users/774353
// @downloadURL https://update.greasyfork.org/scripts/427314/Castle%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/427314/Castle%20Cost%20Calculator.meta.js
// ==/UserScript==

const resLength = 7 ; 
const resIndex = {'Gold': 0,'Wood':1,'Ore':2,'Mercury':3,'Sulfur':4,'Crystals':5,'Gems':6} ;

async function main()
{
    var mainOutside = document.querySelector('#castle_main_outside') ; 
    var castleInfo = document.createElement('center') ;
    castleInfo.id = 'castle_info' ;
    var btn = document.createElement('button') ; 
    btn.innerText = 'Calculate' ; 
    btn.onclick = findTotalCostsAndDisplay ;
    var discreteCostDiv = document.createElement('div') ; 
    discreteCostDiv.id = 'discrete_cost'
    castleInfo.appendChild(btn) ; 
    castleInfo.appendChild(discreteCostDiv) ; 
    castleInfo.appendChild(document.createElement('p')) ; 
    mainOutside.parentNode.insertBefore(castleInfo,mainOutside)
    
    var buildings = document.querySelector('#castle_buildings_list2') ;
    
    for(var i = 0 ; i < buildings.childNodes.length ; i++)
    {
        var building = buildings.childNodes[i] ; 
        if(building.nodeType == 3) continue ;  
        var nameDiv = building.querySelector('.castle_build_name') ;
        var checkBox = document.createElement('input') ;
        checkBox.type = 'checkbox' ; 
        checkBox.id = 'mCheckBox' ; 
        checkBox.setAttribute('construct',false) ; 
        nameDiv.appendChild(checkBox) ; 
    }
    
    
}

function findTotalCostsAndDisplay()
{
    var buildings = document.querySelector('#castle_buildings_list2') ;
    var totalCost = 0 ;
    var costArr  = new Array(resLength).fill(0);
    
    for(var i = 0 ; i < buildings.childNodes.length ; i++)
    {
        var building = buildings.childNodes[i] ; 
        if(building.nodeType == 3) continue ;
        var checkBox = building.querySelector('#mCheckBox') ;
        if(!checkBox.checked) continue ; 
        var costLine = building.querySelector('.castle_cost_line') ;
        var costBuilding = findTotalCost(costLine) ;
        var discrete = findDiscreteCosts(costLine) ; 
        costArr = sumArrays(costArr,discrete,costArr.length) ; 
        totalCost += costBuilding ; 
    }
    
    var xx = document.querySelectorAll('.rs') ; 
    console.log(xx) ; 
    var discreteCostDiv = document.querySelector('#discrete_cost') ; 
    discreteCostDiv.innerHTML = '' ; 
    for(var i = 0 ; i < resLength ; i++)
    {
        var img = xx[i].cloneNode() ; 
        discreteCostDiv.appendChild(img) ; 
        discreteCostDiv.appendChild(document.createTextNode((costArr[i].toLocaleString()))) ; 
    }
    var p = document.querySelector('#castle_info').lastChild ;
    p.innerText = 'Total Cost: ' + totalCost.toLocaleString() ; 
}

function sumArrays(a,b,len)
{
    var res = new Array(len).fill(0) ; 
    for(var i = 0 ; i < len ; i++)
    {
        res[i] = Number(a[i]) + Number(b[i]) ; 
    }
    return res ; 
}

function findDiscreteCosts(row)
{
    var costArr = new Array(resLength).fill(0) ;
    for(let i = 1; i < row.childNodes.length ; i++)
    {
        var x = row.childNodes[i] ;
        var quantity = Number(x.textContent.replace(',','')) ;
        var h = resIndex[x.getAttribute('hint')] ; 
        if(h == null) continue ; 
        costArr[h] += Number(quantity) ; 
    }
    return costArr ;
}

function findTotalCost(row)
{
    var totalPrice = 0 ;
    for(let i = 1; i < row.childNodes.length ; i++)
    {
        var x = row.childNodes[i] ;
        var quantity = Number(x.textContent.replace(',','')) ;
        switch(x.getAttribute('hint'))
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
            default:
                quantity *= 0 ; 
                break ; 
        }

        totalPrice += quantity ;
    }
    return totalPrice ;
}

main() ;