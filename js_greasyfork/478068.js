// ==UserScript==
// @name        Add to wishlist - nookazon.com
// @namespace   Tampermonkey Scripts
// @match       http*://nookazon.com/*
// @grant window.onurlchange
// @grant GM_addElement
// @version     1.0
// @license MIT
// @author      Hijack Hornet
// @description Allow to add multiple items to a whishlist at once. Go to wishlist, enter the items separated by coma in the search bar and click the import button. Format is itemName - variante. Ex: Avery - ungifted,stone,wood,Sasha. If no variante specified, all are added. Works on both PC and mobile (firefox). The sharing of script on nookazon discord is prohibited, so please keep this to yourself.
// @downloadURL https://update.greasyfork.org/scripts/478068/Add%20to%20wishlist%20-%20nookazoncom.user.js
// @updateURL https://update.greasyfork.org/scripts/478068/Add%20to%20wishlist%20-%20nookazoncom.meta.js
// ==/UserScript==

var totalToDo = 9999999
var totalDone = 0
function runWhenReady(readySelector, callback) {
    var numAttempts = 0;
    var tryNow = function() {
        var elem = document.querySelector(readySelector);
        if (elem) {
            callback(elem);
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            } else {
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
}
const regex = /https?:\/\/nookazon\.com\/profile\/([0-9]+)\/wishlist\/?([0-9]*)?/;

if(regex.test(window.location.href)){
    runWhenReady('.wishlist-content .listing-search-input', addButtonOnPage);
}
if (window.onurlchange === null) {
    window.addEventListener('urlchange', (info) => {
        if(regex.test(info.url)){
            runWhenReady('.wishlist-content .listing-search-input', addButtonOnPage);
        }
    });
}

function addButtonOnPage(titleNode){
    var elem = document.querySelector("#wishlistClipboard");
    if(!elem){

        console.log("Adding button for whishlist import")
        console.log(titleNode.parentNode)
        var button = GM_addElement(titleNode.parentNode, 'button', {
            'aria-label': 'Import',
            textContent: 'Import',
            style:'margin-left:10px;',
            id:"wishlistClipboard"
        });
        button.addEventListener (
            "click", importItems, false
        );
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function addToWishlist(profileNumber,wishlistNumber,itemId,diy,itemType,variant,all){
    const addToWishlistUrl = "https://nookazon.com/api/public/listings/create"
    var xhr = new XMLHttpRequest();
    var url = addToWishlistUrl;
    var formData = new FormData();


    if(all){
        formData.append('body', '{"all":true,"diy":'+diy+',"item":"'+itemId.toString()+'","itemMode":null,"itemType":"'+itemType.toString()+'","selling":false,"wishlist":"'+wishlistNumber?.toString()+'","amount":1}');
    }
    else if(!variant){
        formData.append('body', '{"all":false,"diy":'+diy+',"item":"'+itemId.toString()+'","itemMode":null,"itemType":"'+itemType.toString()+'","selling":false,"wishlist":"'+wishlistNumber?.toString()+'","amount":1}');
    }
    else{
        formData.append('body', '{"all":false,"diy":'+diy+',"item":"'+itemId.toString()+'","itemMode":null,"itemType":"'+itemType.toString()+'","selling":false,"wishlist":"'+wishlistNumber?.toString()+'","amount":1,"variant":"'+variant.toString()+'"}');
    }
    fetch(addToWishlistUrl,
          {
        method: 'POST',
        body: formData,
        headers: new Headers({
            "Authorization": "Bearer "+ localStorage.getItem('jwt'),
            "Accept": "*/*",
            "X-Requested-With": "XMLHttpRequest",
            "Accept-Language": localStorage.getItem('defaultLanguage')
        }),

    }
         ).then((response) => {
        updateProgress()
    })
}
function searchReq(itemName,profileNumber,wishlistNumber,delay){
    var splittedName = itemName.split(" - ")
    var searchUrl = "https://nookazon.com/api/public/items?variants=&search="+splittedName[0]+"&user="+profileNumber
    sleep(delay).then(()=>{
        fetch(searchUrl,
              {
            headers: new Headers({
                "Authorization": "Bearer "+ localStorage.getItem('jwt'),
                "Accept": "*/*",
                "X-Requested-With": "XMLHttpRequest",
                "Accept-Language": localStorage.getItem('defaultLanguage')
            }),

        })
            .then((response) => response.json())
            .then((json) => {
            if(json.items && json.items.length >=1){
                var itemId = json.items[0].id
                var diy = json.items[0].diy
                var itemType = json.items[0].type
                var variant = undefined
                if(splittedName.length >1 && json.items[0].variants){
                    for(var j = 0; j<json.items[0].variants.length;j++){
                        if(json.items[0].variants[j].name.toLowerCase() == splittedName[1].toLowerCase()){
                            variant = json.items[0].variants[j].id
                            break;
                        }
                    }

                }
                if(variant == undefined && json.items[0].variants){
                    // Add them all
                    addToWishlist(profileNumber,wishlistNumber,itemId,diy,itemType,variant,true)
                }
                else{
                    //Add the one
                    addToWishlist(profileNumber,wishlistNumber,itemId,diy,itemType,variant,false)
                }

            }
        });
    })
}

function importItems(){
    var res = window.location.href.match(regex);
    var profileNumber = res[1]
    var wishlistNumber = res[2]?res[2]:""


    var elem = document.querySelector('.wishlist-content .listing-search-input');
    var items = elem.value.split(",")
    totalToDo = items.length
    totalDone = 0
    for(var i=0; i<items.length;i++){
        searchReq(items[i],profileNumber,wishlistNumber,i*100);
    }
    var progress = GM_addElement(document.body, 'div', {
            textContent: 'Progression : 0/'+totalToDo,
            style:'margin-left:10px;border-radius:20px;position:absolute;',
            id:"progressImport"
        });
    return;
}
function updateProgress(){
    totalDone++;
    var prog = document.querySelector("#progressImport")
    prog.textContent = 'Progression : '+totalDone+'/'+totalToDo
    if(totalDone == totalToDo){
        //location.reload();
    }
}