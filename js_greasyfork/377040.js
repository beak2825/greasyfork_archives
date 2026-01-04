// ==UserScript==
// @name         Save Favourite Words Jisho
// @version      1.2
// @description  Stores a list of jisho favourite words locally in the Userscript in-memory and lets the user download them in a file
// @author       jarmanso7
// @match        https://jisho.org/word/*
// @match        https://jisho.org/users/*
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM.listValues
// @namespace https://greasyfork.org/users/241544
// @downloadURL https://update.greasyfork.org/scripts/377040/Save%20Favourite%20Words%20Jisho.user.js
// @updateURL https://update.greasyfork.org/scripts/377040/Save%20Favourite%20Words%20Jisho.meta.js
// ==/UserScript==

function AddRemoveWordLink(){
    (async () => {

        /* ------------------------ GENERATE CUSTOM LINK ---------------------*/
        var word = decodeURIComponent(window.location.pathname.split('/')[2]);

        var addRemoveWordLink = document.createElement ('a');
        addRemoveWordLink.setAttribute ('id', 'add-remove-word-custom-link');
        addRemoveWordLink.setAttribute ('class', 'concept_light-status_link');

        let possiblyStoredWord = await GM.getValue(word , 0);

        if(possiblyStoredWord === 0){
            addRemoveWordLink.innerText = 'Add to My Words';
        } else {
            addRemoveWordLink.innerText = 'Remove from My Words';
        }

        //locate the parent node where to put the custom link to add/remove the word
        var parentNode = document.getElementsByClassName("concept_light-status")[0];

        //append the custom link
        parentNode.appendChild(addRemoveWordLink);

        /* ------------------------ ACTIVATE CUSTOM LINK ---------------------*/
        document.getElementById ("add-remove-word-custom-link").addEventListener(
            "click", ButtonClickAction, false
        );

        function ButtonClickAction (zEvent) {
            AddRemoveFavouriteWordEvent(word);
        }
   })();
}

function AddRemoveFavouriteWordEvent(word){
    (async () => {

        let possiblyStoredWord = await GM.getValue(word , 0);

        if (possiblyStoredWord === 0){ //Not stored yet as 0 is the default value

            //store the word
            await GM.setValue(word, word);

            //update custom link text to "remove word"
            document.getElementById ("add-remove-word-custom-link").innerText = 'Remove from My Words';

        } else { //already stored

            //remove the word
            GM.deleteValue(word);

            //update custom link text to "add word"
            document.getElementById ("add-remove-word-custom-link").innerText = 'Add to My Words';
        }

        console.log(await GM.listValues());
    })();
}

function ListWords(){
    (async () => {

        var pageContainer = document.getElementById('page_container');

        var listOfWordsHeader = document.createElement('h3');
		listOfWordsHeader.id = ('my-words-custom-h3');
        listOfWordsHeader.innerText = 'My Words';
        pageContainer.appendChild(listOfWordsHeader);

        pageContainer.appendChild(document.createElement ( 'hr' ));

        let words = await GM.listValues();
        for (let word of words) {
            var domWord = document.createElement( 'a' );
            domWord.setAttribute ('class', 'concept_light-status_link');
            domWord.setAttribute('href', 'https://jisho.org/word/' + word);
            domWord.innerText = word;
            pageContainer.appendChild(domWord);
            pageContainer.appendChild(document.createElement ( 'hr' ));
        }
		
		if (words.length > 0){
			AddDownloadListInAFileLink(words);
		}

    })();
}

function AddDownloadListInAFileLink(words){
	/* ------------------------ GENERATE CUSTOM LINK ---------------------*/

	//locate the brother node where to put the custom link to download the list of words next to
	var brotherNode = document.getElementById('my-words-custom-h3');
	
	//insert the link
	brotherNode.insertAdjacentHTML('afterend', '<a id="add-download-list-file-custom-link" class="concept_light-status_link">Download List</a>');

	/* ------------------------ ACTIVATE CUSTOM LINK ---------------------*/
	document.getElementById ("add-download-list-file-custom-link").addEventListener(
		"click", ButtonClickAction, false
	);

	function ButtonClickAction (zEvent) {
		AddDownloadListInAFileEvent(words);
	}
}

function AddDownloadListInAFileEvent(words){

	//generate comma-separated-values data
	var data='';
	    for (let word of words) {
			data = data + word + ',';
        }
		
	var a = document.createElement('a');
	a.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(data);
	//supported by chrome 14+ and firefox 20+
	a.download = 'JishoMyWords ' + new Date().toLocaleString() + '.csv';
	//needed for firefox
	document.getElementsByTagName('body')[0].appendChild(a);
	//supported by chrome 20+ and firefox 5+
	a.click();
}

//Main function
(function() {
    'use strict';

    var jishoSection = decodeURIComponent(window.location.pathname.split('/')[1]);

    //Determine where the user is within jisho.org
    switch(jishoSection){
        case "word":
           AddRemoveWordLink();
           break;
        case "users":
           ListWords();
           break;
        default: //do nothing
           break;
    }
})();
