// ==UserScript==
// @name        Fallen London - Dressing Room
// @namespace   fallenlondon/dressingroom
// @description Script for storing and changing into outfits.
// @author      Travers
// @include     http://*fallenlondon.com/Gap/Load*
// @include     http://fallenlondon.storynexus.com/Gap/Load*
// @version     1.41
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11879/Fallen%20London%20-%20Dressing%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/11879/Fallen%20London%20-%20Dressing%20Room.meta.js
// ==/UserScript==
var DB_NAME = 'Dressing Room for ';
var DB_STORE_NAME = 'outfits';
var DB_VERSION = 1;
var DEBUG = false;
var outfitMode = {add: 1, change: 2, changing: 3}

var db = null;
var onMeTab = false;
var itemsOwned = Object.create(null);
var outfit;
var record;

setUpObservers();

function debugLog(msg)
{
    if (DEBUG)
    {
        console.log('Fallen London - Dressing Room: ', msg);
    }
}
function debugDir(obj)
{
    if (DEBUG)
    {
        console.dir(obj);
    }
}

function setUpObservers()
{
    var target = document.querySelector('#meTab');
    var peeper = new MutationObserver(checkMeOut);
    peeper.observe(target, {attributes: true, childList: false, characterData: false});

    target = document.querySelector('#mainContentLoading');
    peeper = new MutationObserver(checkOutMyLoad);
    peeper.observe(target, {attributes: true, childList: false, characterData: false});
}

function checkMeOut(mutants, observer)
{
    onMeTab = mutants[0].target.getAttribute(mutants[0].attributeName) == 'selected';
    
    if (!db)
    {
        openDatabase();
    }
}

function openDatabase()
{
    var username = document.getElementsByClassName('subscription-username')[0].innerHTML;
    
    if (username.length < 1) 
    { 
        debugLog('openDatabase - username error');
        return;
    }
    
    DB_NAME += username;

    var req = window.indexedDB.open(DB_NAME, {version: DB_VERSION, storage: "persistent"});
    req.onsuccess = function(evt)
    {
        db = this.result;
        db.onerror = function(evt) 
        {
            console.error('Fallen London Dressing Room - DB - error: ', evt.target.errorCode);
        }
        debugLog('openDatabase - completed');
    };
    req.onerror = function(evt)
    {
        console.error('Fallen London Dressing Room - openDatabase - error: ', evt.target.errorCode);
    };
    req.onupgradeneeded = function(evt)
    {
        debugLog('openDatabase - setting up database store');
        var store = evt.currentTarget.result.createObjectStore(DB_STORE_NAME, {keyPath: 'Name'});
    };
}

function checkOutMyLoad(mutants, observer)
{
    if (onMeTab)
    {
        var DR = document.getElementById('dressing-room');
        if (DR == null)
        {
            var target = document.getElementsByClassName('redesign_heading')[0];

            var newA = document.createElement('A');
            newA.className = 'standard_btn label';
            newA.style.position = 'absolute';
            newA.style.right = '1em';
            newA.style.top = '1em';
            newA.innerHTML = 'DRESSING ROOM';
            newA.addEventListener('click', function(){toggleVisibility('dressing-room');});
            target.appendChild(newA);
            
            var newDiv = document.createElement('DIV');
            newDiv.id = 'dressing-room';
            newDiv.style.zIndex = '50';
            newDiv.style.position = 'absolute';
            newDiv.style.right = '1em';
            newDiv.style.padding = '8px 12px';
            newDiv.style.border = '3px solid #736448';
            newDiv.style.color = '#000000';
            newDiv.style.background = '#b8a98c none repeat scroll 0 0';
            newDiv.style.boxShadow = '0 2px 8px #000000';
            newDiv.style.fontSize = '15px';
            newDiv.style.height = 'auto !important';
            newDiv.style.width = 'auto !important';
            newDiv.style.textTransform = 'none';
            newDiv.style.visibility = 'hidden';

            var newP = document.createElement('P');
            var newText = document.createTextNode('What to wear? ');
            newP.style.fontWeight = 'bold';
            newP.appendChild(newText);
            
            newP.appendChild(document.createElement('BR'));

            var newSelect = document.createElement('SELECT');
            newSelect.id = 'outfit-name';
            newSelect.style.fontWeight = 'bold';
            newSelect.style.width = '15em';
            newP.appendChild(newSelect);

            newText = document.createTextNode(' ');
            newP.appendChild(newText);
            
            var newButton = document.createElement('BUTTON');
            newButton.style.backgroundColor = '#ffcc00';
            newText = document.createTextNode('Change');
            newButton.style.fontWeight = 'bold';
            newButton.style.padding = '0px 5px';
            newButton.style.border = '3px solid #ffee00';
            newButton.appendChild(newText);
            newButton.addEventListener('click', function() { manageOutfit(outfitMode.change); });
            newP.appendChild(newButton);
            
            newP.appendChild(document.createTextNode(' '));

            var newButton = document.createElement('BUTTON');
            newButton.style.backgroundColor = '#f440f6';
            newText = document.createTextNode('Forget');
            newButton.style.fontWeight = 'bold';
            newButton.style.padding = '0px 5px';
            newButton.style.border = '3px solid #ff50ff';
            newButton.appendChild(newText);
            newButton.addEventListener('click', deleteOutfit);
            newP.appendChild(newButton);

            newDiv.appendChild(newP);

            newP = document.createElement('P');
            newText = document.createTextNode('What am I wearing? ');
            newP.style.fontWeight = 'bold';
            newP.appendChild(newText);
            
            newP.appendChild(document.createElement('BR'));
            
            var newInput = document.createElement('INPUT');
            newInput.type = 'text';
            newInput.id = 'new-outfit-name';
            newInput.style.fontWeight = 'bold';
            newInput.style.padding = '0px 5px';
            newInput.style.width = '15em';
            newP.appendChild(newInput);

            newText = document.createTextNode(' ');
            newP.appendChild(newText);

            newButton = document.createElement('BUTTON');
            newButton.style.backgroundColor = '#ffcc00';
            newText = document.createTextNode('Remember');
            newButton.style.fontWeight = 'bold';
            newButton.style.padding = '0px 5px';
            newButton.style.border = '3px solid #ffee00';
            newButton.appendChild(newText);
            newButton.addEventListener('click', function() { manageOutfit(outfitMode.add); });
            newP.appendChild(newButton);

            newDiv.appendChild(newP);
            
            target.appendChild(newDiv);
            
            buildOptions();
            
            target = document.getElementsByTagName('body')[0];
            newDiv = document.createElement('DIV');
            newDiv.id = 'dressing-room-changing-dialog';
            newDiv.innerHTML = 'Donning my';
            newDiv.style.zIndex = '100';
            newDiv.style.position = 'absolute';
            newDiv.style.margin = 'auto';
            newDiv.style.top = '0'; 
            newDiv.style.left = '0'; 
            newDiv.style.bottom = '0'; 
            newDiv.style.right = '0';
            newDiv.style.width = '400px';
            newDiv.style.height = '80px';
            newDiv.style.lineHeight ='80px';  
            newDiv.style.textAlign = 'center';
            newDiv.style.verticalAlign = 'middle';
            newDiv.style.padding = '5px 5px';
            newDiv.style.border = '3px solid #736448';
            newDiv.style.color = '#000000';
            newDiv.style.background = '#b8a98c none repeat scroll 0 0';
            newDiv.style.boxShadow = '0 2px 8px #000000';
            newDiv.style.fontSize = '20px';
            newDiv.style.textTransform = 'none';
            newDiv.style.visibility = 'hidden';
            target.appendChild(newDiv); 
        }
    }
}

function buildOptions()
{
    if (db)
    {
        var store = db.transaction(DB_STORE_NAME).objectStore(DB_STORE_NAME);
        
        var optionsList = [];
        store.openCursor().onsuccess = function(evt)
        {
            var cursor = evt.target.result;
            if (cursor)
            {
                optionsList.push(cursor.value.Name);
                cursor.continue();
            }
            else displayOptions(optionsList);
        }
    }
}

function displayOptions(optionsList)
{
    var ONS = document.getElementById('outfit-name');

    while (ONS.firstChild)
    {
        ONS.removeChild(ONS.firstChild);
    }

    var newOption = document.createElement('OPTION');
    ONS.appendChild(newOption);
        
    optionsList.sort(function(a, b) {
        var nameA=a.toLowerCase(), nameB=b.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0; 
    });
        
    for (var i = 0; i < optionsList.length; i++)
    {
        newOption = document.createElement('OPTION');
        newOption.style.backgroundColor = (i % 2) ? '#cccccc' : '#aaaaaa';
        newOption.innerHTML = optionsList[i];
        ONS.appendChild(newOption);
    }
}

function toggleVisibility(elemID)
{
    var element = document.getElementById(elemID);
    element.style.visibility = element.style.visibility == 'hidden' ? 'visible' : 'hidden';
}

function addOutfit()
{
    if (outfit.Name == '')
    {
        updateOutfit();
        return;
    }
    
    var transaction = db.transaction([DB_STORE_NAME], 'readwrite');
    var store = transaction.objectStore(DB_STORE_NAME);
    var req = store.add(outfit);
    req.onsuccess = function(evt)
    {
        debugLog('addOutfit - added');
    };
    
    buildOptions();
}

function updateOutfit()
{
    outfit.Name = document.getElementById('outfit-name').value;
    
    if (outfit.Name == '')
    {
        return;
    }
    
    var store = db.transaction([DB_STORE_NAME], 'readwrite').objectStore(DB_STORE_NAME);
    
    var req = store.get(outfit.Name);
    req.onsuccess = function(evt)
    {
        record = req.result;
        for (var attrName in outfit) { record[attrName] = outfit[attrName]; }

        var reqUpdate = store.put(record);
        reqUpdate.onsuccess = function(evt)
        {
            debugLog('updateOutfit - updated');
        };
    };
}

function deleteOutfit()
{
    var outfitName = document.getElementById('outfit-name').value;
    
    if (outfitName == '')
    {
        return;
    }
    
    var transaction = db.transaction([DB_STORE_NAME], 'readwrite');
    var store = transaction.objectStore(DB_STORE_NAME);
    var req = store.delete(outfitName);
    req.onsuccess = function(evt)
    {
        debugLog('deleteOutfit - deleted');
    };

    buildOptions();
}

function changeOutfit()
{
    var outfitName = document.getElementById('outfit-name').value;
    
    var transaction = db.transaction([DB_STORE_NAME], 'readonly');
    var store = transaction.objectStore(DB_STORE_NAME);
    var req = store.get(outfitName);
    req.onsuccess = function(evt)
    {
        record = req.result;
        
        debugLog('changeOutfit');
        debugDir(record);
                      
        var slots = ['Hat', 'Clothing', 'Gloves', 'Weapon', 'Boots', 'Companion', 'Affiliation', 'Transportation', 'HomeComfort'];   
        for (var i = 0; i < slots.length; i++)
        {
            var slot = slots[i];
            if (record[slot] != outfit[slot])
            {
                if (record[slot] != '-' && record[slot] in itemsOwned)
                {
                    adoptThing(record[slot], slot);
                }
                else if (outfit[slot] != '-')
                {
                    unadoptThing(outfit[slot], slot);
                    record[slot] = '-';
                } 
            }  
        }         
   
        setTimeout(function(){manageOutfit(outfitMode.changing);}, 1000);
    }
}

function changingOutfit()
{
    var slots = ['Hat', 'Clothing', 'Gloves', 'Weapon', 'Boots', 'Companion', 'Affiliation', 'Transportation', 'HomeComfort'];  
    for (var i = 0; i < slots.length; i++)
    {
        var slot = slots[i];
        if (record[slot] != outfit[slot])
        {
            setTimeout(function(){manageOutfit(outfitMode.changing);}, 1500);
            debugLog(slot + ' : ' + record[slot] + ' != ' + outfit[slot]);
            return;
        }
    }

    toggleVisibility('dressing-room-changing-dialog');
}

function waitForElement(selector, time, mode) 
{
    if(document.querySelector(selector) != null) 
    {
        manageOutfit2(mode, selector);        
    }
    else 
    {
        setTimeout(function() {waitForElement(selector, time, mode);}, time);
    }
}

function manageOutfit(mode)
{
    if (mode == outfitMode.change)
    {
        var dlg = document.getElementById('dressing-room-changing-dialog');
        var outfitName = document.getElementById('outfit-name').value;
        dlg.innerHTML = 'Donning <strong>' + outfitName + '</strong>';
        toggleVisibility('dressing-room-changing-dialog');
    }
    
    var expandedPage = document.getElementById('InvCat-Affiliation');

    outfit = getCurrentItems(expandedPage);
    
    outfit.Name = document.getElementById('new-outfit-name').value;
    document.getElementById('new-outfit-name').value = '';
    
    swapYouFrames();
    
    if (expandedPage)
    {           
        waitForElement('#InvCat-Hat', 1000, mode);
    }
    else 
    {
        waitForElement('#InvCat-Affiliation', 1000, mode);
    }       
}

function manageOutfit2(mode, selector)
{   
    var expandedPage = selector == '#InvCat-Affiliation' ? true : false;
    var outfit2 = getCurrentItems(expandedPage);

    for (var attrName in outfit2) { outfit[attrName] = outfit2[attrName]; } 
            
    swapYouFrames();  
    
    if (mode == outfitMode.add)
    {
        addOutfit();
    }
    else if (mode == outfitMode.change)
    {
        changeOutfit();
    }
    else if (mode == outfitMode.changing)
    {
        changingOutfit();
    }
}

function getCurrentItems(expandedPage)
{
    if (expandedPage)
    {
        return {
            Affiliation: getItemNum('Affiliation'),
            Transportation: getItemNum('Transportation'),
            HomeComfort: getItemNum('HomeComfort')
        };
    }

    return {
        Hat: getItemNum('Hat'),
        Clothing: getItemNum('Clothing'),
        Gloves: getItemNum('Gloves'),
        Weapon: getItemNum('Weapon'),
        Boots: getItemNum('Boots'),
        Companion: getItemNum('Companion')
    };   
}

function getItemNum(category)
{
    var inventoryDiv = document.getElementById('InvCat-' + category);
    targetItemNum = '-';
    
    if (inventoryDiv)
    {
        var aList = inventoryDiv.getElementsByTagName('A');
        for (var j = 0; j < aList.length; j++)
        {
            if (aList[j].hasAttribute('onclick'))
            {
                var onClickEventString = aList[j].getAttribute('onclick');
                if (onClickEventString.startsWith('unadoptThing') || onClickEventString.startsWith('adoptThing'))
                {
                    var num = onClickEventString.slice(onClickEventString.indexOf('(') + 1, onClickEventString.indexOf(','));
                    if (!isNaN(Number(num)))
                    {
                        itemsOwned[num] = true;
                        if (onClickEventString.startsWith('unadoptThing'))
                        {
                            targetItemNum = num;
                        }
                    }
                    else
                    {
                        debugLog('Fallen London - Dressing Room: getItemNum - result was not a number: ' + num);
                    }
                }
            }
        }
    }
    return targetItemNum;
}
