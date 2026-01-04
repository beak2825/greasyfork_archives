// ==UserScript==
// @name         NPC Feed Remover
// @version      0.0.2
// @description  Removes the Feed Option from Items so you don't accidentally feed something to a pet you don't intend to feed.
// @author       Rodolfo - Inspired By ben (mushroom), Alexa (plushies), & Dani (MouseKat)
// @match        neopetsclassic.com/itemview*
// @grant        None
// @namespace https://greasyfork.org/users/727556
// @downloadURL https://update.greasyfork.org/scripts/446280/NPC%20Feed%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/446280/NPC%20Feed%20Remover.meta.js
// ==/UserScript==

var currentPage = window.location.href;

//set removeAllFeeds to true if you want to remove every option to feed on every item
//set removeAllFeeds to false is you want to specify the pets to remove the feed option from
var removeAllFeeds = true;

//if the above is set to true skip all the next steps
//otherwise keep going

//exclude or include
//set exclude to true if you want to specify the pets to REMOVE the Feed Option From
//set exclude to false if you want to specify the pets the only pets that will have the Feed Option
var exclude = false;

//set the value to true if you want to exclude the pets

//Put the impacted pets om the list below. Use a comma separated list and for just one pet, put their name down with no commas
var petNames = "Pet1,Pet2,Pet3";
var nameArr = petNames.split(',');
console.log(nameArr);

//declare some reusable variables
var i; //index
var j; //another index
var selection; //the specific selection/option
var selectionComponentsArray; //an array with a break down of the values from the select/option this is usually in the format use|PetName
var optionRemoved; //a var confirming if a selection has been removed or not

(function(){
    "use strict";
    //Grab the Drop Down Options
    var itemDropDownOptions = document.getElementsByName('itemaction')[0];
    console.log(itemDropDownOptions);

    //if user wants to remove all feeds
    if(removeAllFeeds){
       i = 0; //index
        //traverse the drop down list
        while(i < itemDropDownOptions.length){
            var selection = itemDropDownOptions[i].value.toLowerCase();
            var selectionComponentsArray = selection.split("|");
            if (selectionComponentsArray[0] === "feed"){
                console.log("Found Feed at Row " + i);
                itemDropDownOptions.remove(i); //if the option at is removed do not increment i because there will now be something else at index i
            }
            else{
                i++
            }
        }
        return;
    }

    //if the user wants to exclude the mentioned pets
    if(exclude){
        i = 0; //index
        //traverse the drop down list
        while(i < itemDropDownOptions.length){
            optionRemoved = false; //use this to indicate nothing has been removed yet
            //grab the selection and it's components
            selection = itemDropDownOptions[i].value.toLowerCase();
            selectionComponentsArray = selection.split("|");
            //compare the selections to the specified pets
            for(j=0; j < nameArr.length; j++){
                //if components one says feed and the second one is a matched pet name  remove it
                if (selectionComponentsArray[0] === "feed" && selectionComponentsArray[1] === nameArr[j].toLowerCase()){
                    console.log("Found a Match at Row " + i);
                    itemDropDownOptions.remove(i); //if the option at is removed do not increment i because there will now be something else at index i
                    optionRemoved = true;
                    break; //break here because there is no need to check the rest
                }
            }
            if(!optionRemoved) i++; //if there was nothing removed increment i
        }
        return;
    }

    //if the user wants to include only the mentioned pets
    if(!exclude){
        i = 0; //index
        //traverse the drop down list
        while(i < itemDropDownOptions.length){
            optionRemoved = false; //use this to indicate nothing has been removed yet
            var matchFound = false;

            //grab the selection and it's components
            selection = itemDropDownOptions[i].value.toLowerCase();
            selectionComponentsArray = selection.split("|");
            //compare the selections to the specified pets

            for(j=0; j < nameArr.length; j++){
                //if components one says feed and the second one is the pet name do not remove it
                if (selectionComponentsArray[0] === "feed" && selectionComponentsArray[1] === nameArr[j].toLowerCase()){
                    console.log("Found a Match at Row " + i);
                    matchFound = true;
                    break; //break here because there is no need to check the rest
                }
            }
            if(!matchFound && selectionComponentsArray[0] === "feed"){
                itemDropDownOptions.remove(i); //if the option at is removed do not increment i because there will now be something else at index i
                optionRemoved = true;
            }

            if(!optionRemoved) i++; //if there was nothing removed increment i
        }
        return;
    }

})();