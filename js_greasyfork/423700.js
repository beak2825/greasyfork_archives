// ==UserScript==
// @name        Literotica Downloader
// @description Single page HTML download for Literotica with improved readability
// @namespace   literotica_downloader
// @include     https://tags.literotica.com/*
// @include     https://*.tags.literotica.com/*
// @include     https://www.literotica.com/new/stories*
// @include     https://literotica.com/c/*
// @include     https://**.literotica.com/c/*
// @include		https://www.literotica.com/c/*
// @include		https://www.literotica.com/authors/**/works/stories*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @version     5.10
// @grant           GM_info
// @grant           GM_registerMenuCommand
// @grant           GM.registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_openInTab
// @grant           GM_getValue
// @grant           GM.getValue
// @grant           GM_setValue
// @grant           GM.setValue
// @grant           GM_notification
// @grant           GM.notification
// @author      Improved by a random redditor and @nylonmachete, originally by Patrick Kolodziejczyk and fixed by i23234234
// @downloadURL https://update.greasyfork.org/scripts/423700/Literotica%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/423700/Literotica%20Downloader.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
// Those valuse can be modifyed by the icon GreaseMonkey > User script commands > Toggle ...
let GMsetValue, GMgetValue, GMregisterMenuCommand, GMunregisterMenuCommand, GMnotification, GMopenInTab;
var options= {
	'isNightMode' : true,
	'isNumberChapterInFilename': true,
	'isUsernameInFilename' : true,
	'isDescriptionInFilename' : false,
	'isNoteInFilename' : false,
	'isCategoryInFilename' : false,
    'isBookmark' : false,
    'fontsize': "2.2"
};

// Creating style for a download icon
var downloadTooltip = 'Download as html';
var bookmarkTooltip = 'Check as read';
var bookmarkCheckTooltip = 'Un-check as read';
var iconDonwload = '<i class="bi bi-arrow-down-circle" style="cursor: pointer;cursor: hand;margin-right:5px; font-size:14px"></i>';
var iconBookmark = '<i class="bi bi-bookmark" style="cursor: pointer;cursor: hand;margin-right:5px; font-size:14px"></i>';
var iconBookmarkCheck = '<i class="bi bi-bookmark-check-fill" style="cursor: pointer;cursor: hand;margin-right:5px; font-size:14px"></i>';
var PREFIX_URL_PAGE = 'https://www.literotica.com';
/**
 * Style HTML downloaded
 */
var chapterStyle = '_style="line-height: 1.4em;" ';
var descriptionStyle = ' style="line-height: 1.2em;" ';

/*
 * Constante for Filename
 */
var SEPARATOR = '_';
var PREFIX_NOTE = 'RATING_';
var POSTFIX_NUMER_CHAPTER ='_Part_Series';

/*
 * Constant For logging
 */
var PREFIX_LOG='[Literotica Downloader]';

function calculateBodyStyle(){
    var toReturn = " style=\"";
    if(options.isNightMode){
         toReturn +="background-color:#333333; color: #EEEEEE;";
    }
    toReturn +="font-family: Helvetica,Arial,sans-serif; width: 50%; margin: 0 auto; line-height: 1.5em;";
    toReturn +="font-size:"+options.fontsize+"em; padding: 50px 0 50px 0;";
    toReturn +="\"";
    return toReturn;
}


// Create link elements
const link1 = document.createElement('link');
link1.href = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css';
link1.rel = 'stylesheet';
link1.type = 'text/css';

const link2 = document.createElement('link');
link2.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css';
link2.rel = 'stylesheet';

const styleElement = document.createElement('style');

// Set the type attribute
styleElement.type = 'text/css';

// Set the CSS rules
styleElement.textContent = '.ldText{background-color: lightgray;width: 3em;},.ldChapter,.ldSerie {margin-left: auto;} ._works_wrapper_29o2p_1 ._works_item__series_expanded_parts_29o2p_40{margin-left: 0px !important} .lbIconOnStoryCardComponent {float:left}';

// Append link elements to the head
document.head.appendChild(link1);
document.head.appendChild(link2);
document.head.appendChild(styleElement);

console.log("Literotica Downloader start addEventListener");

window.addEventListener("load", function() {
    'use strict';
setTimeout(function() {
  const GMinfo = GM_info;
    const handlerInfo = GMinfo.scriptHandler;
    const isGM = Boolean(handlerInfo.toLowerCase() === 'greasemonkey');
  var panelOptionDownloader=  `
<div id="literoticaDownloaderOption" title="Options Literotica Downloader" >
   Please Configure the options :
	<fieldset>
      <legend>Interface: </legend>
			<div>
      	<input type="checkbox" name="isBookmark" id="isBookmark" class="ldCheckbox">
    	  <span>Bookmark (locale storage)</span>
   	</div>
<div>Please refresh the page for thoses options</div>
	</fieldset>
	<fieldset>
      <legend>Reading: </legend>
			<div>
      	<input type="checkbox" name="isNightMode" id="isNightMode" class="ldCheckbox">
    	  <span>Night Mode</span>
   	</div>
	</fieldset>
   <fieldset>
      <legend>Filename: </legend>
      <div>
         <input type="checkbox" name="isNumberChapterInFilename" id="isNumberChapterInFilename" class="ldCheckbox">
         <span>Number of chapters in filename (for series)</span>
      </div>
      <div>
         <input type="checkbox" name="isUsernameInFilename" id="isUsernameInFilename" class="ldCheckbox">
         <span>Username in filename</span>
      </div>
      <div>
         <input type="checkbox" name="isDescriptionInFilename" id="isDescriptionInFilename" class="ldCheckbox">
         <span>Description in filename (Not on series)</span>
      </div>
      <div>
         <input type="checkbox" name="isNoteInFilename" id="isNoteInFilename" class="ldCheckbox">
         <span>Rating in filename (Not on series)</span>
      </div>
      <div>
         <input type="checkbox" name="isCategoryInFilename" id="isCategoryInFilename" class="ldCheckbox">
         <span>Category in filename (Not on series)</span>
      </div>
      <div>
         <span>FontSize (in em  with . for decimal)</span>
         <input type="text" name="fontsize" id="fontsize" class="ldText">
      </div>
   </fieldset>
</div>
`;
  document.body.insertAdjacentHTML('beforeend',panelOptionDownloader);
var ldCheckboxes = document.querySelectorAll('.ldCheckbox');

ldCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', async function() {
        console.log(this.id);
        GMsetValue(this.id, this.checked);
        console.log(PREFIX_LOG+'new value =>' + await GMgetValue(this.id));
        options[this.id] = this.checked;
    });
});
    var ldInputTexts = document.querySelectorAll('.ldText');

ldInputTexts.forEach(function(checkbox) {
    checkbox.addEventListener('change', async function() {
        console.log(this.id);
        GMsetValue(this.id, this.value);
        console.log('new value =>' + await GMgetValue(this.id));
        options[this.id] = this.value;
         console.log(options);
    });
});
  console.log(PREFIX_LOG+"Start init dialog option");
  $( "#literoticaDownloaderOption" ).dialog({ autoOpen: false, width: 450 });
  console.log(PREFIX_LOG+"Snd init dialog option");
if (isGM) {
    GMsetValue = GM.setValue;
    GMgetValue = GM.getValue;
    GMregisterMenuCommand = GM.registerMenuCommand;
    GMunregisterMenuCommand = function() {};
    GMnotification = GM.notification;
    console.log(PREFIX_LOG+"It's GM !");
} else {
    console.log(PREFIX_LOG+"Other than GM...");

    GMsetValue = GM_setValue;
    GMgetValue = GM_getValue;
    GMregisterMenuCommand = GM_registerMenuCommand;
    GMunregisterMenuCommand = GM_unregisterMenuCommand;
}
      initOptions();

// Open dialog when the menu command is clicked
GMregisterMenuCommand("Literotica Downloader Options", function() {
    $( "#literoticaDownloaderOption" ).dialog( "open" );
});

// Dialog setup
var dialog = document.getElementById('literoticaDownloaderOption');
dialog.style.display = 'none'; // Initially hide the dialog

  /*
   * Download Button for Chapter
   */
  
  addDownloadChapterButtonTo(document);
  
  /*
   * Download Button for Series
   */
  addDownloadSeriesButtonTo(document);

  /*
  * Download Button for individual Story
  */
  addDownloadIndividualStoryButtonTo(document);
  
  /*
   * Section download on tags
   */
  document.addEventListener('DOMNodeInserted', function(e) {
    if (e.target!= null && e.target.classList != null && e.target.classList.contains('ai_gJ')) {
        var target = e.target;

        var ai_iGElements = target.querySelectorAll('.ai_iG');
		if(ai_iGElements){
			ai_iGElements.forEach(function(element) {
				element.insertAdjacentHTML('afterbegin', '<span class="ldDownloadTag lbIconOnStoryCardComponent">' + iconDonwload + '</span>');
			});

			target.querySelectorAll('.ldDownloadTag.lbIconOnStoryCardComponent')
				.forEach(function(tag) {
					tag.addEventListener('click', function() {
						getABookForStoryOnStoryCardComponent(tag.parentNode.parentNode);
				});
			});
		}
    }
    });
  /*
   * Section download on category
   */
	console.log(PREFIX_LOG+"init category");
    document.querySelectorAll('.b-slb-item').forEach(function(element) {
		element.insertAdjacentHTML('afterbegin', '<span class="ldChapter lbIconOnStoryCardComponent">' + iconDonwload + '</span>');
    });
	document.querySelectorAll(".ldChapter.lbIconOnStoryCardComponent").forEach(function(tag) {
				tag.addEventListener('click', function(tag) {
					getABookForStoryItemCategory(tag.target.parentNode.parentNode);
            });
		});
  }, 250); // 1000 milliseconds = 1 second
});
function addDownloadSeriesButtonTo(parentElement){
  const titlesSeries = parentElement.querySelectorAll("[class*='_works_item__series_expanded_header_card'] [class*='_works_item__title'] [class*='_item_title']");
  titlesSeries.forEach(element => {
    // Create a new element to prepend
    const newElement = document.createElement('div');
    newElement.textContent = 'Prepended Element'; // Change this to whatever content you want
    var idIcon = Math.floor(Math.random() * 1000);
    // Prepend the new element before the selected element
    element.insertAdjacentHTML('beforebegin', '<span id="' + idIcon + '" class="ldSerie"> ' + iconDonwload + '</span>');
    element.classList.add("lbButtonAdded");
	});

  parentElement.querySelectorAll('.ldSerie').forEach(element => {
    element.addEventListener('click', function() {getABookForSerieDiv(element.parentNode.parentNode)});
  });
}
function addDownloadChapterButtonTo(parentElement){
  const titlesChapter = parentElement.querySelectorAll("[class*='_series_parts__item_'] [class*='_works_item__title'] [class*='item_title']");
  titlesChapter.forEach(element => {
    // Create a new element to prepend
    const newElement = document.createElement('div');
    newElement.textContent = 'Prepended Element'; // Change this to whatever content you want
    var idIcon = Math.floor(Math.random() * 1000);
    // Prepend the new element before the selected element
    element.insertAdjacentHTML('beforebegin', '<span id="' + idIcon + '" class="ldChapter"> ' + iconDonwload + '</span>');
    element.classList.add("lbButtonAdded");
	});

  parentElement.querySelectorAll('.ldChapter').forEach(element => {
    element.addEventListener('click', function() {getABookForStoryDiv(element.parentNode)});
  });
}
function addDownloadIndividualStoryButtonTo(parentElement){
  const titlesChapter = parentElement.querySelectorAll("[class*='_works_item__title'] [class*='item_title']:not(.lbButtonAdded)");
  titlesChapter.forEach(element => {
    // Create a new element to prepend
    const newElement = document.createElement('div');
    newElement.textContent = 'Prepended Element'; // Change this to whatever content you want
    var idIcon = Math.floor(Math.random() * 1000);
    // Prepend the new element before the selected element
    element.insertAdjacentHTML('beforebegin', '<span id="' + idIcon + '" class="ldChapter"> ' + iconDonwload + '</span>');
    element.classList.add("lbButtonAdded");
	});

  parentElement.querySelectorAll('.ldChapter').forEach(element => {
    element.addEventListener('click', function() {getABookForStoryDiv(element.parentNode)});
  });
}

async function initOptions(){
    // Init of all options
	for(const element of  Object.getOwnPropertyNames(options)){
    await initCheckBox(element);
    await initInputText(element);
  }
}
async function initCheckBox(element, index, array) {
    options[element] = await GMgetValue(element,options[element]);
    $("#"+element)[0].checked= options[element];
    
    return true;
}
async function initInputText(element, index, array) {
    options[element] = await GMgetValue(element,options[element]);
    $("#"+element)[0].value= options[element];
  	console.log(PREFIX_LOG+element+"-> "+options[element]);
    return true;
}

function getABookForStoryItemCategory(cardComponent) {
	console.log(PREFIX_LOG+"In getABookForStoryItemCategory");
    console.log(cardComponent);
	var link = cardComponent.querySelector('h3 a').getAttribute('href');
	var storyId = extractStoryId(link);
	var jsonStory = getJsonStoryByStoryId(extractStoryId(link));
	var title = jsonStory.submission.title;
	var note = jsonStory.submission.rate_all;
	var chapterTitle = jsonStory.submission.title;
	var description = jsonStory.submission.description;
	var category = jsonStory.submission.category_info.pageUrl;
	var author = jsonStory.submission.author.username;
    getABookForStory(storyId, title, note, chapterTitle, description, category, author);
}

function getABookForStoryOnStoryCardComponent(cardComponent) {
    console.log(PREFIX_LOG+"In getABookForStoryOnStoryCardComponent");
    console.log(cardComponent);
    var link = cardComponent.querySelector('.ai_ii').getAttribute('href');
    var storyId = extractStoryId(link);
	var jsonStory = getJsonStoryByStoryId(extractStoryId(link));
	var title = jsonStory.submission.title;
	var note = jsonStory.submission.rate_all;
	var chapterTitle = jsonStory.submission.title;
	var description = jsonStory.submission.description;
	var category = jsonStory.submission.category_info.pageUrl;
	var author = jsonStory.submission.author.username;
    getABookForStory(storyId, title, note, chapterTitle, description, category, author);
}

function openFullViewForDownloadSerie(){
    var moreExist= false;
    document.querySelectorAll("[class*='_show_more']").forEach(element => {
        if(element.innerText.trim().startsWith('View Full')){
            moreExist = true;
            console.log(PREFIX_LOG+"Opening "+element);
            element.click();
        }
    });
    if(moreExist){
        setTimeout(function() {
            openFullViewForDownloadSerie();
        }, 250);
    }
}
function extractSerieId(url) {
    // Split the URL by slashes
    const parts = url.split('/');
    // Get the last part of the array
    const lastPart = parts[parts.length - 1];
    return lastPart;
}
function getSerieLinkFormDiv(serieDiv){
  return serieDiv.querySelectorAll("[class*='_item_title_']")[0].href;
}
function getABookForSerieDiv(serieDiv) {
    console.log(PREFIX_LOG+"Processing series");
    console.log(serieDiv);
  openFullViewForDownloadSerie();
	var link = getSerieLinkFormDiv(serieDiv);
	var serieId = extractSerieId(link);
	var jsonSerie = getJsonSerieBySerieId(serieId).data;
        var title = jsonSerie.title;
        // Get the X Part Series
        var descriptionSeries = ""
  		var author = jsonSerie.user.username;
		var numberChapter = jsonSerie.work_count;
        alert("Starting building file for " + title + " of " + author + " with "+numberChapter+".\nPlease wait...");

        var book = '<html>\n<head>\n<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">\n';
        book += '<title>' + title + '</title>';
        book += '<meta content="' +author+ '" name="author">';
        book += '</head>\n<body ' + calculateBodyStyle() + ' >';

        function addChapter(itemChapter) {
          console.log(PREFIX_LOG+"addChapter"+itemChapter);
		  var storyId = itemChapter.url;
		  var jsonStory = getJsonStoryByStoryId(storyId);
		  var chapterTitle = jsonStory.submission.title;
		  var description = jsonStory.submission.description;
          book += '<h1 class=\'chapter\'' + chapterStyle + '>' + chapterTitle + '</h1>';
          book += '<h2 class=\'chapter\'' + descriptionStyle + '>' + description + '</h2>';
          book += getContentOfStory(storyId);
        }
	console.log(serieDiv.nextElementSibling);
  var allChapter = serieDiv.nextElementSibling.querySelectorAll("[class*='_series_parts__item_'][class*='_works_item_']")
  var lastChapter = allChapter[allChapter.length - 1];
	console.log(lastChapter);
	var linkLastChapter = getChapterLinkFormDiv(lastChapter);
    console.log(PREFIX_LOG+"linkLastChapter => "+linkLastChapter);
	var storyId = extractStoryId(linkLastChapter);
	var jsonStory = getJsonStoryByStoryId(storyId);
  if(jsonStory.submission.series.items != null){
	jsonStory.submission.series.items.forEach(element => {
      console.log(element);
      // Your logic to perform on each element
      addChapter(element);
    });
  }else{
  	console.log(PREFIX_LOG+"Last Chapter doesn't have series informations");
    console.log(PREFIX_LOG+"Falback on previous one");
    console.log(allChapter);
    lastChapter = allChapter[allChapter.length - 2];
	console.log(lastChapter);
	linkLastChapter = getChapterLinkFormDiv(lastChapter);
    console.log(PREFIX_LOG+"linkLastChapter => "+linkLastChapter);
	storyId = extractStoryId(linkLastChapter);
	jsonStory = getJsonStoryByStoryId(storyId);
    jsonStory.submission.series.items.forEach(element => {
      console.log(element);
      // Your logic to perform on each element
      addChapter(element);
      });
  }
        saveTextAsFile(book, buildFilename(title, author, descriptionSeries, null, null, numberChapter));
    }
function getChapterLinkFormDiv(storyDiv){
  return storyDiv.querySelectorAll("[class*='_item_title_']")[0].href;
}

function getABookForStoryDiv(storyDiv){
  console.log(PREFIX_LOG+"Processing getABookForStoryDiv");
  console.log(storyDiv);
  var link = getChapterLinkFormDiv(storyDiv);
  var storyId = extractStoryId(link);
  var jsonStory = getJsonStoryByStoryId(extractStoryId(link));
  var title = jsonStory.submission.title;
  var note = jsonStory.submission.rate_all;
  var chapterTitle = jsonStory.submission.title;
  var description = jsonStory.submission.description;
  var category = jsonStory.submission.category_info.pageUrl;
  var author = jsonStory.submission.author.username;
  getABookForStory(storyId, title, note, chapterTitle, description, category, author);
}

function getABookForStory(storyId, title, note, chapterTitle, description, category, author) {
        var book = '<html>\n<head>\n<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">\n';
        console.log(PREFIX_LOG+'title' + title);
        book += '<title>' + title + '</title>';
        book += '<meta content="' + author + '" name="author">';
        book += '</head>\n<body ' + calculateBodyStyle() + ' >';
      	if(chapterTitle != null){
        	book += '<h1 class=\'chapter\'' + chapterStyle + '>' + chapterTitle + '</h1>';
        }
      	if(description != null){
        	book += '<h2 class=\'chapter\'' + descriptionStyle + '>' + description + '</h2>';
        }
        book += getContentOfStory(storyId);

        saveTextAsFile(book, buildFilename(title, author, description, note, category, null));
  	}

function extractStoryId(url) {
    // Split the URL by slashes
    const parts = url.split('/');
    // Get the last part of the array
    const lastPart = parts[parts.length - 1];
    return lastPart;
}
function getContentOfStoryOfPage(storyId, current_page) {
    var apiURL = "https://literotica.com/api/3/stories/"+storyId+'?params=%7B"contentPage"%3A'+current_page+'%7D';
    var xhr = new XMLHttpRequest();
    var toReturn ="[Page "+current_page+" not Found]";
    xhr.open('GET', apiURL, false); // false makes the request synchronous
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            toReturn = response.pageText;
        } else {
            console.error(PREFIX_LOG+'Request failed with status ' + xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error(PREFIX_LOG+'Request failed');
    };
    xhr.send();
    return toReturn;
}

function getJsonSerieBySerieId(serieId){
        var apiURL = "https://literotica.com/api/3/series/"+serieId;
        console.log(PREFIX_LOG+"Fetching on API -> " + apiURL);
        var toReturn;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiURL, false); // false makes the request synchronous
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                toReturn = JSON.parse(xhr.responseText);
                console.log(toReturn);
            } else {
                console.error(PREFIX_LOG+'Request failed with status ' + xhr.status);
            }
        };
        xhr.onerror = function() {
            console.error(PREFIX_LOG+'Request failed');
        };
        xhr.send();
        return toReturn;
}
function getJsonStoryByStoryId(storyId){
        var apiURL = "https://literotica.com/api/3/stories/"+storyId;
        console.log(PREFIX_LOG+"Fetching on API -> " + apiURL);
        var toReturn;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiURL, false); // false makes the request synchronous
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                toReturn = JSON.parse(xhr.responseText);
                console.log(toReturn);
            } else {
                console.error(PREFIX_LOG+'Request failed with status ' + xhr.status);
            }
        };
        xhr.onerror = function() {
            console.error(PREFIX_LOG+'Request failed');
        };
        xhr.send();
        return toReturn;
}

function convertTextToHTML(text) {
  	// Replace CRLF with <br> tags
    var htmlText = text.replace(/\r\n/g, "<br>");
    // Replace LF with <br> tags
    htmlText = htmlText.replace(/\n/g, "<br>");
    // Replace CR with <br> tags
    htmlText = htmlText.replace(/\r/g, "<br>");
    return htmlText;
}

// Function parsing all pages to get the storie based
    function getContentOfStory(storyId) {
        console.log(PREFIX_LOG+"Processing  -> " + storyId);
        var apiURL = "https://literotica.com/api/3/stories/"+storyId;
        console.log(PREFIX_LOG+"Fetching on API -> " + apiURL);
        var toReturn;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiURL, false); // false makes the request synchronous
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                toReturn = response.pageText;
                var pageCount = response.meta.pages_count;
              console.log(PREFIX_LOG+"pageCount => "+pageCount);
                if (pageCount > 0) {
                    for (let currentPage = 2; currentPage <= pageCount; currentPage++) {
                        const result = getContentOfStoryOfPage(storyId, currentPage); // Call the given function
                        toReturn += result; // Concatenate the result to toReturn
                    }
                }
            } else {
                console.error(PREFIX_LOG+'Request failed with status ' + xhr.status);
            }
        };
        xhr.onerror = function() {
            console.error(PREFIX_LOG+'Request failed');
        };
        xhr.send();
      toReturn = convertTextToHTML(toReturn);
        return toReturn;
    }
// Function used to return content as a file for the user.
    function saveTextAsFile(textToWrite, fileNameToSaveAs) {
        var textFileAsBlob = new Blob([textToWrite], {
            type: 'text/javascript'
        });
        var downloadLink = document.createElement('a');
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = 'Download File';
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        //downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

function buildFilename(title, author, description, note, category, numberChapter) {
    var toReturn = title;
	if (options.isNumberChapterInFilename) {
        toReturn = toReturn + SEPARATOR + numberChapter + POSTFIX_NUMER_CHAPTER;
    }
    if (options.isUsernameInFilename) {
        toReturn = toReturn + SEPARATOR + author;
    }
    if (options.isDescriptionInFilename) {
        if (description != null && description != "") {
            toReturn = toReturn + SEPARATOR + description.replace(/[^\w\s]/gi, '');
        }
    }
    if (options.isNoteInFilename) {
        if (note != null && note != "") {
            toReturn = toReturn + SEPARATOR + PREFIX_NOTE + note;
        }
    }
    if (options.isCategoryInFilename) {
        if (category != null && category != "") {
            toReturn = toReturn + SEPARATOR + category;
        }
    }
    // Add file extension;
    toReturn = toReturn + '.html';
    return toReturn;
}

function hasNodeClassStartingWith(node, startclass) {
    const classList = node.classList;

    for (let i = 0; i < classList.length; i++) {
        if (classList[i].startsWith(startclass)) {
            return true;
        }
    }

    return false;
}

// Callback function to be called when an element is added to the DOM
function handleElementAdded(mutationsList, observer) {
    for(var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Check if nodes were added
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1 &&
                  	( hasNodeClassStartingWith(node,'_series_parts__item')
                      || hasNodeClassStartingWith(node,'_series_parts__wrapper')
                     	|| hasNodeClassStartingWith(node,'_works_wrapper_')
                      || hasNodeClassStartingWith(node,'_works_item_')
                     
                    )
                 ) {
                	//console.log(PREFIX_LOG+'Element added:', node);
                	addDownloadChapterButtonTo(node);
                	addDownloadSeriesButtonTo(node);
                	addDownloadIndividualStoryButtonTo(node);
                    // Call your function here or do any other necessary action
                }
            });
        }
    }
}

// Create a MutationObserver instance
var observer = new MutationObserver(handleElementAdded);

// Define the options for the observer (in this case, we're observing changes to the child list)
var observerConfig = {
    childList: true,
    subtree: true // This option allows us to observe changes within the entire subtree of the target node
};

// Start observing the target node (in this example, we're observing the entire document)
observer.observe(document, observerConfig);