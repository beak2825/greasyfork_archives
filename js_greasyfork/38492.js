// ==UserScript==
// @name     Wanikani Quick Memory Check
// @version  2.6
// @description  Creates four buttons on the level - pages of Wanikani.com that allow you to toggle display of all kanji, kana or meanings and not burned items
// @author     Ilura Menday Less
// @author     based on NHK Furigana Toggle by Michael Schiffer
// @include		 https://www.wanikani.com/level/*
// @include		 https://www.wanikani.com/kanji?*
// @include		 https://www.wanikani.com/vocabulary?*
// @include		 https://www.wanikani.com/radicals?*
// @namespace https://greasyfork.org/users/170903
// @downloadURL https://update.greasyfork.org/scripts/38492/Wanikani%20Quick%20Memory%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/38492/Wanikani%20Quick%20Memory%20Check.meta.js
// ==/UserScript==

window.onload = function() {

 //+++++++  USER - SETTINGS  +++++++ // FEEL FREE TO CHANGE THEM ACCORDING TO YOUR PREFERENCES
	var hideNotBurned = true;       // true = HIDE all radicals, kanji and vocabulary which are not yet burned, at page-load
 									// false = DISPLAY all radicals, kanji and vocabulary (whether they are already burned or not), at page-load
  
  	var btnBar = 'right';			// choose 'left' or 'right' depending on which side you want the buttons to be displayed
  
    var newTab = true; 				// true = when clicked on a kanji or word the details page will be opened in a NEW tab
  									// false = when clicked on a kanji or word the details page will be opened in the SAME tab
  
  
 //+++++++  BUTTON - FUNCTIONALITY  +++++++  
  
 // Get text of notBurned button according to user settings 
  	var btnNotBurnedText; 
    if (hideNotBurned) { 
  		btnNotBurnedText = 'Show not burned items';
	} else {
        btnNotBurnedText = 'Hide not burned items';
    }
 // Creating a new table to hold our buttons
    var tableHtml = "<table id=\"wqmc\"style=\"height: 65px; overflow: hidden; position: fixed ! important; " + btnBar + ": 10pt; bottom: 5%; width: 34px; z-index: 1;\" border=\"0\" cellpadding=\"0\" cellspacing=\"10\"><tbody><tr><td><button id=\"btn-KanjiToggle\">Toggle Kanji</button></td></tr><tr><td><button id=\"btn-KanaToggle\">Toggle Kana</button></td></tr><tr><td><button id=\"btn-MeaningToggle\">Toggle Meaning</button></td></tr><tr><td><button id=\"btn-notBurned\">" + btnNotBurnedText + "</button></td></tr></tbody></table>";
    document.body.innerHTML = document.body.innerHTML + tableHtml;
 // Variables to recognise click on a button
 		var kanjiHidden = false; 		// true if hidden by click on button
  	var kanaHidden = false;			// true if hidden by click on button
 		var meaningHidden = false;	// true if hidden by click on button
  
 // Function to toggle all Kanji
    function toggleKanji() { 
        // Loop through nodelist of kanji
        for (var i in kanji) {
          
          	if (kanjiHidden) {  // show kanji
                kanji[i].style.visibility = '';
            } else { // hide kanji
                kanji[i].style.visibility = 'hidden';
            }   
          
            // at the end of the loop 
            if (i == kanji.length-1) {
               kanjiHidden = !kanjiHidden; // toggle because button was clicked
            }
        }      	
    }
  
 // Function to toggle all Kana
    function toggleKana() {
        // Loop through nodelist of kana
        for (var i in kana) {
          
          	if (kanaHidden) { // show kana
                kana[i].style.visibility = '';
            } else { // hide kana
                kana[i].style.visibility = 'hidden';
            }
          
            // at the end of the loop           
            if (i == kana.length-1) {
                kanaHidden = !kanaHidden;  // toggle because button was clicked
            }            
        }
    }
  
 // Function to toggle all meanings
    function toggleMeaning() {
        // Loop through nodelist of English meaning
        for (var i in meaning) {
            
          	if (meaningHidden) { //show meaning
                meaning[i].style.visibility = '';
            } else { // hide meaning
                meaning[i].style.visibility = 'hidden';
            }
            
            // at the end of the loop   
            if (i == meaning.length-1) {
                meaningHidden = !meaningHidden;  // toggle because button was clicked          
            }
        }
    }
 // Function to toggle display of not burned radicals kanji and vocab
    function toggleNotBurned() {
     	  hideNotBurned = !hideNotBurned; // toggle because button was clicked    

        // Loop through nodelist of English meaning
        for (var i in notburned) {

          	if (hideNotBurned) { //hide all not burned items
                notburned[i].style.display = 'none';
            } else { // show all notburned items
                notburned[i].style.display = '';
            } 
          	
          	// at the end of the loop change text of button
            if (i == notburned.length-1) {
                if (hideNotBurned) {
                    btnNotBurned.innerHTML = 'Show not burned items'; 
                } else {
                    btnNotBurned.innerHTML = 'Hide not burned items';
                }
            }
        }     	   
    }
		
 // Get new buttons
    var btnKanjiToggle = document.getElementById('btn-KanjiToggle');
    var btnKanaToggle = document.getElementById('btn-KanaToggle');
    var btnMeaningToggle = document.getElementById('btn-MeaningToggle');
    var btnNotBurned = document.getElementById('btn-notBurned');
 
 // CSS-Style for the buttons  
    var btnStyle= 'background-color: white; border-color: red; border-width: 4px; margin-bottom: 4px; padding: 5px; font-style: italic;';//#93dd00 lightgray color: white;'; //border-radius: 100%; padding: 5px;';
  	btnKanjiToggle.style = btnStyle;
    btnKanaToggle.style = btnStyle;
    btnMeaningToggle.style = btnStyle;
  	btnNotBurned.style = btnStyle + 'margin-top: 20px; min-height: 7em;';

 // Do this on click btn-Kanji
    btnKanjiToggle.addEventListener('click', function () {
        toggleKanji();
    }, false);
  
 // Do this on click btn-Kana
    btnKanaToggle.addEventListener('click', function () {
        toggleKana();
    }, false);
  
 // Do this on btn-Meaning
    btnMeaningToggle.addEventListener('click', function () {
        toggleMeaning();
    }, false);
  
 // Do this on btn-NotBurned
    btnNotBurned.addEventListener('click', function () {
        toggleNotBurned();
    }, false);
  
 // All kanji are inside of a span with class "character"
    var kanji = document.body.getElementsByClassName('character');
  
 // All kana are inside of a li with lang "ja"
    var kana = document.body.querySelectorAll('a > ul > li[lang="ja"]');
  	if (document.URL.startsWith('https://www.wanikani.com/radicals?')) { // if no kana is displayed, hide toggleKana button
        btnKanaToggle.style = 'display: none;';
    }
  
 // All meanings are preceeded by a li with lang "ja", second child of ul; a = link to kanji or vocab site
    var meaning = document.body.querySelectorAll('a > ul > li:nth-child(2)');
  
 // All radicals kanji and vocabulary that are not burned (class "notburned")
    var notburned;// see under hover functionality elem loop
  
  

 //+++++++  HOVER - FUNCTIONALITY  +++++++
  
 // Change visibility of element (mousetarget = element that triggered mouseover/mouseout, param = '' or 'hidden')
    function toggleVisible (mouseTarget, param) {
      
        if(kanjiHidden) {
          mouseTarget.querySelector('.character').style.visibility = param; // change css style of kanji container
        }
        if(kanaHidden) {
          mouseTarget.querySelector('ul > li[lang="ja"]').style.visibility = param; // change css style of kana container
        }
        if(meaningHidden) {
          mouseTarget.querySelector('ul > li:nth-child(2)').style.visibility = param; // change css style of meaning container
        }
    }
    
 // Select container of kanji,kana and meaning elements
    var elem = document.body.querySelectorAll('.character-item > a');
  	
 // Add hover event to all selected/found elements
  	for (var i in elem) {   
      
        var children = elem[i].childNodes; // all children for one '.character-item > a' - element      
        //loop through all children
        for (var n = 0; n <children.length; n++) {
            children[n].style = 'pointer-events: none;'; //prevent mouseout/mouseover from fireing when entering/leaving a child
        }
      
      	//Change style of vocab items
      	if(elem[i].parentNode.id.startsWith('vocab')) {
           elem[i].querySelector('ul').style = 'pointer-events: none; float: unset; font-size: 1.2em; text-align: unset;margin-left: 1em;';
           elem[i].querySelector('.character').style = 'pointer-events: none; font-size: 3.5em;';
           elem[i].style = 'height:3.3em; padding:1em 2em;';
        }
        
        elem[i].addEventListener('mouseover', function (e) {
            // Dislay hidden kanji/kana/meaning on hover
            toggleVisible(e.target, '');//param1: e.target = html of entered element , param2: value for css visibility attribute  
        }, false);

        elem[i].addEventListener('mouseout', function (e) {
            // Hide kanji/kana/meaning again on mouseout
            toggleVisible(e.target, 'hidden');//param1: e.target = html of entered element , param2: value for css visibility attribute  
        }, false);
      
        //open detail page in new Tab
      	if(newTab) {
        	elem[i].target = '_blank';
        }
      	
      	//+++++++ HIDE NOT BURNED - FUNCTIONALITY  +++++++
      	//hide all not yet burned items
      	if(!(elem[i].parentNode.classList.contains("burned"))) { 
          	elem[i].parentNode.className += " notburned";
            if(hideNotBurned) {
          	    elem[i].parentNode.style = 'display: none';
            }
        }
      
        // at the end of the loop   
        if (i == elem.length-1) {
            notburned = document.body.getElementsByClassName('notburned'); // get all elements that are not burned 
          
            if(notburned.length <1) { // if all items are burned do not display NotBurned button
                btnNotBurned.style = 'display: none;';
            }
        }
      	
    }
};