// ==UserScript==
// @name        Wanikani Self-Study Plus RC
// @namespace   wkselfstudyplus
// @description Adds an option to add and review your own custom vocabulary
// @include     *.wanikani.com/*
// @include     *.wanikani.com/chat/*
// @exclude	    *.wanikani.com
// @include     *.wanikani.com/dashboard*
// @include     *.wanikani.com/community*
// @version     0.2.1
// @author      shudouken and Ethan
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26874/Wanikani%20Self-Study%20Plus%20RC.user.js
// @updateURL https://update.greasyfork.org/scripts/26874/Wanikani%20Self-Study%20Plus%20RC.meta.js
// ==/UserScript==
/*! wkselfstudy - v0.2.1 - 2017-02-08 */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** Builds a node element with an id and className and other attributes if provided
* @param {string} type - The type of element to create ('div', 'p', etc...)
* @param {object} [options]
* @param {string} options.id - The id of the node
* @param {string} options.className - One or more classes for the element seperated by spaces
* @returns {HTMLElement} The node built as specified
*/
var buildNode = function(type, options){
	var node = document.createElement(type);
	for (var option in options) if (options.hasOwnProperty(option)) {
		if (option === "className" || option === "id"){
			node[option] = options[option];
		}
		else {
			node.setAttribute(option, options[option]);
		}
	}
	return node;
};

module.exports = buildNode;
},{}],2:[function(require,module,exports){
var buildNode = require('./buildnode.js');


// 'this' context is node to attach to
var attachChildNode = function(childNode){
	var el;
	if ("string" === typeof childNode){ //TextNode
		 el = document.createTextNode(childNode);
	}
	else{
		el = buildNode(childNode.tag, {id: childNode.id, className: childNode.className});
		for (var attr in childNode.other){
			el.setAttribute(attr, childNode.other[attr]);
		}
		if (childNode.childNodes){
			childNode.childNodes.forEach(attachChildNode, el);
		}
		if (childNode.eventListeners){
			for (var listener in childNode.eventListeners){
				el.addEventListener(listener, childNode.eventListeners[listener]);
			}
		}
	}
	this.appendChild(el);
};

// IWindow
// tag, id, className, other, childNodes

/** Takes a JSON object with the structure of the window to create and builds a DIVElement from that
* @param {IWindow} windowStructure
* @param {string} [mainElement = 'div']
* @returns {DIVElement} The specified window.
*/
var buildWindow = function(windowStructure, mainElement) {
	
	var resultWindow = buildNode(mainElement || 'div', {id: windowStructure.id, className: windowStructure.className});
	for (var attr in windowStructure.other){
		resultWindow.setAttribute(attr, windowStructure.other[attr]);
	}
	if (windowStructure.childNodes){
		windowStructure.childNodes.forEach(attachChildNode, resultWindow);
	}
	return resultWindow;
};
module.exports = buildWindow;
},{"./buildnode.js":1}],3:[function(require,module,exports){
var StorageUtil = require('./storageutil.js');
var ObjectUtil = require('./objectutil.js');
var SettingsUtil = require('./settingsutil.js');
var EditWindowFunctions = {
	//get handle for 'select' area
	getEditOptionsElement: function(){
		return document.getElementById("editWindow");
	},
	//get handle for 'status' area
	getEditStatusElement: function(){
		return document.getElementById("editStatus");
	},
	
	/** Resets the levels of all tasks and re-indexes them in storage.
	* @param {Event} evt - Click event (not used)
	*/
	resetLevels: function (evt) {
		var vocList = StorageUtil.getVocList().map(function(vocItem, i){
			vocItem.level = 0;
			console.log("vocList[i].i before: "+vocItem.i);
			vocItem.i=i;
			console.log("vocList[i].i after: "+vocItem.i);
			return vocItem;
		}, this);
		StorageUtil.setVocList(vocList);
    },
	editEditHandler: function (evt) {
		EditWindowFunctions._optionsElement = EditWindowFunctions._optionsElement || EditWindowFunctions.getEditOptionsElement();
        //get the index for the currently selected item
        var index = EditWindowFunctions._optionsElement.selectedIndex;
		var vocabList = StorageUtil.getVocList();
        vocabList = vocabList.reverse();
        EditWindowFunctions._optionsElement.value = JSON.stringify(vocabList[index]);
        EditWindowFunctions._optionsElement.name = index; //using name to save the index
      //  EditWindowFunctions._getEditStatusElement().textContent = 'Loaded item to edit';
    },
    /** Retrieves values from storage to populate 'editItems' menu
	*/
    generateEditOptions: function() {
        var select = document.getElementById('editWindow');
        //clear the editWindow
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
		//retrieve from local storage
		var vocabList = StorageUtil.getVocList();
		
		var options = vocabList.map(function(task){
			//form element to save string
			var opt = document.createElement('option');

			//when is this item up for review
			var due = task.due||task.date + srsObject[task.level].duration;
			
			var review = task.level >= 9 ? "Never" : Date.now() >= due ? "Now" : ObjectUtil.ms2str(due - Date.now());

			var text = task.kanji + " & " +
				task.reading + " & " +
				task.meaning + " (" +
				SettingsUtil.srsObject[task.level].rank +
				" - Review: " +
				review + ") Locked: " +
				task.manualLock;

			opt.value = task.i;
			opt.innerHTML = text;
			return opt;//for future use (sorting data etc)
		}, this);
		options.forEach(function(opt){
			select.appendChild(opt);//export item to option menu
		},this);
    },
	updateEditGUI: function(){
        EditWindowFunctions.generateEditOptions();
        document.getElementById("editItem").value = "";
        document.getElementById("editItem").name = "";
    },
	editDeleteAll: function () {
        var deleteAll = confirm("Are you sure you want to delete all entries?");
        if (deleteAll) {
            //drop local storage
            localStorage.removeItem('User-Vocab');
            EditWindowFunctions.updateEditGUI();
            $("#editStatus").text('All items deleted!');
        }
    },
	editDelete: function () {
        //select options element window
        var select = document.getElementById("editWindow");

        //index of selected item
        var item = select.options[select.selectedIndex].value;

        //fetch JSON strings from storage and convert them into Javascript literals
        var vocabList = StorageUtil.getVocList();

        //starting at selected index, remove 1 entry (the selected index).
        if (item > -1) {
            if (vocabList !== null){
                vocabList.splice(item, 1);
            }
        }

        //yuck
        if (vocabList.length !== 0) {
            StorageUtil.localSet('User-Vocab', vocabList);
        }
        else {
            localStorage.removeItem('User-Vocab');
        }

        EditWindowFunctions.updateEditGUI();

        $("#editStatus").text('Item deleted!');
    }
};

module.exports = EditWindowFunctions;
},{"./objectutil.js":8,"./settingsutil.js":13,"./storageutil.js":14}],4:[function(require,module,exports){
var StorageUtil = require('./storageutil.js');
var SetReviewsUtil = require('./setreviewsutil.js');
var WanikaniDomUtil = require('./wanikanidomutil.js');
module.exports = function(){

	var kanji = document.getElementById("addKanji").value.toLowerCase();
	var reading = document.getElementById("addReading").value.toLowerCase().split(/[,、]+\s*/); //split at , or 、followed by 0 or any number of spaces
	var meaning = document.getElementById("addMeaning").value.toLowerCase().split(/[,、]+\s*/);
	var success = false; //initalise values
	var meanlen = 0;

	var i = meaning.length;
	while (i--){
		meanlen += meaning[i].length;
	}

	//input is invalid: prompt user for valid input
	var item = {};
	if (kanji.length === 0 || meanlen === 0) {
		document.getElementById("addStatus").innerText = "One or more required fields are empty!";
		if (kanji.length === 0) {
			WanikaniDomUtil.addClass(document.getElementById("addKanji"), "error");
		}
		else {
			WanikaniDomUtil.removeClass(document.getElementById("addKanji"), "error");
		}

		if (meanlen === 0) {
			WanikaniDomUtil.addClass(document.getElementById("addMeaning"), "error");
		}
		else {
			WanikaniDomUtil.removeClass(document.getElementById("addMeaning"), "error");
		}
	}
	else {
		console.log("building item: "+kanji);
		item.kanji = kanji;
		item.reading = reading; //optional
		item.meaning = meaning;

		success = true;
		console.log("item is valid");
	}

	//on successful creation of item
	if (success) {
		//clear error layout to required fields
		WanikaniDomUtil.removeClass(document.getElementById("addKanji"), "error");
		WanikaniDomUtil.removeClass(document.getElementById("addMeaning"), "error");

		//if there are already user items, retrieve vocabList
		var vocabList = StorageUtil.getVocList();

		console.log("vocabList retrieved, length: "+vocabList.length);
		//check stored user items for duplicates ****************** to do: option for editing duplicate item with new input
		if(SetReviewsUtil.checkForDuplicates(vocabList,item)) {
			document.getElementById("addStatus").innerText = "Duplicate Item detected!";
			WanikaniDomUtil.removeClass(document.getElementById("addKanji"), "error");
			return;
		}

		SetReviewsUtil.setVocItem(item);

		console.log("clear form");
		document.getElementById("addForm").reset();

		//--------------------------------------------------------------------------------------------------------
		if (item.manualLock === "yes" || item.manualLock === "DB" && lockDB){
			document.getElementById("addStatus").innerHTML = "<i class=\"icon-lock\"></i> Added locked item";
		}
		else {
			document.getElementById("addStatus").innerHTML = "<i class=\"icon-unlock\"></i>Added successfully";
		}
		//--------------------------------------------------------------------------------------------------------
	}
};
},{"./setreviewsutil.js":12,"./storageutil.js":14,"./wanikanidomutil.js":17}],5:[function(require,module,exports){
module.exports = function(){
	// {"level":"17","meaning_explanation":"This word consists of kanji with hiragana attached. Because the hiragana ends with an [ja]う[/ja] sound, you know this word is a verb. The kanji itself means [kanji]flourish[/kanji] or [kanji]prosperity[/kanji], so the verb vocab versions of these would be [vocabulary]to flourish[/vocabulary] or [vocabulary]to prosper[/vocabulary].","reading_explanation":"Since this word consists of a kanji with hiragana attached, you can bet that it will use the kun'yomi reading. You didn't learn that reading with this kanji, so here's a mnemonic to help you: What do you flourish at? You're an amazing [vocabulary]soccer[/vocabulary] ([ja]さか[/ja]) player who flourishes and prospers no matter where you go to play this wonderful (but not as good as baseball) sport.","en":"To Flourish, To Prosper","kana":"さかえる","sentences":[["中国には、覚せい剤の生産で栄えていた村がありました。","There was a village in China flourishing on their production of stimulants. "]],"parts_of_speech_ids":["4","19"],"part_of_speech":"Intransitive Verb, Ichidan Verb","audio":"2e194cbf194371cd478480d6ea67769da623e99a.mp3","meaning_note":null,"reading_note":null,"related":[{"kan":"栄","en":"Prosperity, Flourish","slug":"栄"}]}


	if (typeof $.mockjax === "function"){
		$.mockjax({
			url: /^\/json\/progress\?vWKSS(.+)\[\]=(.+)&vWKSS.+\[\]=(.+)$/,
			urlParams:["WKSSid", "MeaningWrong", "ReadingWrong"],
			response: function(settings) {
				// do any required cleanup
				var id = Number(settings.urlParams.WKSSid);
				var Mw = Number(settings.urlParams.MeaningWrong);
				var Rw = Number(settings.urlParams.ReadingWrong);
				var UserVocab = localGet("User-Vocab")||[];

				console.log("is this your card?", UserVocab[id]);
				if (UserVocab[id].due < Date.now()){//double check that item was due for review
					if (Mw||Rw){
						//drop levels if wrong

						//Adapted from WaniKani's srs to authentically mimic level downs
						var o = (Mw||0)+(Rw||0);
						var t = UserVocab[id].level;
						var r=t>=5?2*Math.round(o/2):1*Math.round(o/2);
						var n=t-r<1?1:t-r;//don't stay on 'started'

						UserVocab[id].level = n;
					}else{
						//increase level if none wrong
						UserVocab[id].level++;
					}
					//Put UserVocab back in storage
					UserVocab[id].date = Date.now();
					UserVocab[id].due = Date.now() + srsintervals[UserVocab[id].level];
					localSet("User-Vocab", UserVocab);
					console.log(UserVocab[id].due +" > "+ Date.now() + " (" + ms2str(UserVocab[id].due - Date.now())+")");

				}else{
					console.log("This item is not due for review yet, discarding results");
				}
				this.responseText = '{"vWKSS'+id.toString()+'":["'+Mw.toString()+'","'+Rw.toString()+'"]}';

			}
		});

		$.mockjax({
			url: /^\/json\/vocabulary\/WKSS(.+)/,
			urlParams:["WKSSid"],
			response: function(settings) {

				// Investigate the `settings` to determine the response...
				var id = settings.urlParams.WKSSid.toString();
				var currentItem = $.jStorage.get("currentItem");
				if (currentItem.id === "WKSS"+id){
					console.log("as expected");
				}
				var related = '[';
				for (i = 0; i < currentItem.components.length; i++){
					related += '{"kan":"'+currentItem.components[i]+'","en":"","slug":"'+currentItem.components[i]+'"}';
					related += (i+1<currentItem.components.length)?',':'';
				}
				related += ']';

				var respText = JSON.stringify({
					level: "U",
					meaning_explanation: "This is user-defined item. Meaning explanations are not supported at this time. [id: "+id+"]",
					reading_explanation: "This is user-defined item. Reading explanations are not supported at this time. [id: "+id+"]",
					en: currentItem.en.join(", "),
					kana: currentItem.kana.join(", "),
					sentences:[],
					parts_of_speech_ids:[],
					part_of_speech:[],
					audio:null,
					meaning_note:null,
					reading_note:null,
					related:JSON.parse(related)
				});
				this.responseText = respText;
			},
			onAfterComplete: function() {
				// do any required cleanup
				$(".user-synonyms").remove();
				// keeping the hooks for Community Mnemonics
				$("#note-meaning, #note-reading").html("");
			}
		});
	}
};
//--------------End Insert Into WK Review Functions--------------


},{}],6:[function(require,module,exports){

var ImportUtil = {
	fileUpload: function(ev){
		var csvHeader = true;        //first row contains stuff like "Kanji/Vocab, Reading, Meaning" etc
		var tsvfile;          //tabs separate fields, commas seperate values? or false for vice versa
		var CSVs = ev.target.files;
		var name =CSVs[0].name;
		var colsplit, vsplit;
		if (name.substr(name.lastIndexOf("."),4)===".csv"){
			tsvfile = false;
			colsplit = ",";
			vsplit = "\t";
		}else{
			tsvfile = true;
			colsplit = "\t";
			vsplit = ",";
		}

		if (debugging) { console.log("tsvfile: "); }
		if (debugging) { console.log("file uploaded: "+CSVs[0].name); }
		var reader = new FileReader();
		reader.readAsText(CSVs[0]);
		reader.onload = function(ev){
			var csvString = ev.target.result;
			var csvRow = csvString.split("\n");
			//default column rows
			var k = 0;
			var r = 1;
			var m = 2;

			var i = csvRow.length;
			//process header, changing k,r,m if necessary
			var JSONimport = [];
			while(i--){
				var row = csvRow[i];
				if ((csvHeader === true && i === 0)||  //  Skip header
					(row === "") // Skip empty rows
				   ){
					if (debugging) { console.log("Skipping row #"+i); }

				}else{
					console.log(row);


					var elem = row.split(colsplit);
					var item = {};
					var c;

					if (elem[k]){
						item.kanji = elem[k].trim();

						if (elem[r]){

							if (elem[r].indexOf(vsplit)>-1){
								// eg 'reading 1[tab]reading 2[tab]reading 3'

								item.reading = elem[r].split(vsplit);
							}else{ //no tabs in string, single value
								item.reading=[elem[r]];
							}

						}else{
							item.reading=[""];
						}

						if (elem[m]){

							if (elem[m].indexOf(vsplit)>-1){
								// eg 'meaning 1[tab]meaning 2[tab]meaning 3'

								item.meaning = elem[m].split("\t");
							}else{ //no tabs in string, single value
								item.meaning=[elem[m]];
							}

							c = item.meaning.length;

							while(c--){
								console.log("item.meaning["+c+"]: "+item.meaning[c]);
							}
						}else{//todo: provide overwrite option on forced meaning
							item.meaning=[""];
						}

						JSONimport.push(item);
					}else{ // corrupt row ('kanji' is mandatory (can be kana-only word), is not present on row, skip
					}
				}
			}
			var JSONstring = JSON.stringify(JSONimport);
			console.log(JSONimport);

			if (JSONstring.length !== 0) {
				try {
					var add = JSON.parse(JSONstring.toLowerCase());
					/*//---------/-------------
				 if (!checkAdd(add)) {
				 $("#importStatus").text("No valid input (duplicates?)!");
				 return;
				 }
				 //----------------------*/

					var a = add.length;
					while(a--){
						StorageUtil.setVocItem(add[a]);
					}

					$("#importStatus").text("Import successful!");

					$("#importForm")[0].reset();
					$("#importArea").text("");

				}
				catch (e) {
					$("#importStatus").text("Parsing Error!");
					console.log(e);
				}

			}
			else {
				$("#importStatus").text("Nothing to import :( Please paste your stuff first");
			}

		};
	}
};

module.exports = ImportUtil;
},{}],7:[function(require,module,exports){
var StorageUtil = require('./storageutil.js');
var ObjectUtil = require('./objectutil.js');
var SettingsUtil = require('./settingsutil.js');
var WanikaniDomUtil = require('./wanikanidomutil.js');
var SetReviewsUtil = require('./setreviewsutil.js');

var submit = true;
var MarkingUtil = {
	/** Updates the srs variables of a task
	* @param {Task} task
	* task.due
	* task.date
	* {Object} task.numWrong
	* {number} task.index
	*/
	updateSRS: function(task) {
        var now = Date.now();
        if (task.due < now){ //double check that the item was really up for review and hasn't found its way into the list from an old session or another tab.
            if(!task.numWrong && task.level < 9) {//all correct (none wrong)
                task.level++;
            }
            else {
                task.numWrong = {};
                //Adapted from WaniKani's srs to authentically mimic level downs
                var totalWrong = (task.numWrong.Meaning||0)+(task.numWrong.Reading||0)+(task.numWrong.Reverse||0);
                var t = task.level;
                var r= (t>=5? 2:1)*Math.round(totalWrong/2);
                var n=t-r<1?1:t-r;

                task.level = n;//don't stay on 'started'
            }
            task.date = now;
            task.levelStartDate = now;
            task.due = now + SettingsUtil.srsObject[task.level].duration;
            console.log("Next review in "+ObjectUtil.ms2str(SettingsUtil.srsObject[task.level].duration));
        }
		return task;
    },
	/** Display the results of the completed review in a popup.
	* @param {Array.<Item>} itemList built from completed reviews
	*/
	showResults: function (itemList) {
	    //TODO sort into apprentice, guru, etc

	    console.log("itemList", itemList);

        document.getElementById("stats-a").innerHTML =  ""; //should do this when closing //--

        itemList.forEach(function (item, i, itemList) {
            console.log("item", item);

            var altText = item.level + (item.numWrong ? (item.numWrong.Meaning ? " Meaning Wrong x" + item.numWrong.Meaning + "\n" : "") + (item.numWrong.Reading ? " Meaning Wrong x" + item.numWrong.Reading + "\n" : "") + (item.numWrong.Reverse ? " Meaning Wrong x" + item.numWrong.Reverse + "\n" : "") : "") +
            (item.numCorrect ? (item.numCorrect.Meaning ? " Meaning Correct x" + item.numCorrect.Meaning + "\n" : "") + (item.numCorrect.Reading ? " Meaning Correct x" + item.numCorrect.Reading + "\n" : "") + (item.numCorrect.Reverse ? " Meaning Correct x" + item.numCorrect.Reverse + "\n" : "") : "");

			document.getElementById("stats-a").innerHTML +=
				"<span class=" +
				(item.numWrong? "\"rev-error\"":"\"rev-correct\"") +
				" title='"+altText+"'>" + item.kanji + "</span>";
        }, this);
    },
	startReview: function() {
        console.log("startReview()");
	    //       var reviewList = StorageUtil.localGet('User-Review') || [];
        var reviewList = SetReviewsUtil.reviewList;
        if (reviewList.length) {

            Array.prototype.forEach.call(document.getElementsByClassName("WKSS"), function (el) { el.style.display = 'none'; });
            document.getElementById("WKSS-selfstudy").style.display = '';

            submit = true;
            reviewActive = true;
            //get the review 'list' from session storage, line up the first item in queue
            MarkingUtil.nextReview(reviewList);
        }
        else {
            console.log("No reviews available.");
        }
    },
    /** Sets up the next task for review
    * @param {Array.<Task>} reviewList - Array of review objects
    */
	nextReview: function(reviewList) {
        //sets up the next item for review
        //uses functions:
        //    wanakana.bind/unbind

        var rnd = Math.floor(Math.random()*reviewList.length);
		console.log("next random number", rnd);
        var task = reviewList[rnd];
		console.log("next item: ", task);
        //StorageUtil.localSet('WKSS-item', item);
        StorageUtil.localSet('WKSS-rnd', rnd);
		
		MarkingUtil.setTask(task);
		
    //    playAudio();
    },
	/** Populate the review window with the given task
	*/
	setTask: function(item){
	    var reviewList = SetReviewsUtil.reviewList;
		document.getElementById("RevNum").innerText = reviewList.length; // is this even used?
		
		document.getElementById('rev-kanji').innerHTML = item.prompt;
        document.getElementById('rev-type').innerHTML = item.type;
        var typeBgColor = 'grey';
        if (item.type.toLowerCase() == 'meaning'){
            typeBgColor = 'blue';
        } else if (item.type.toLowerCase() == 'reading'){
            typeBgColor = 'orange';
        } else if (item.type.toLowerCase() == 'reverse'){
            typeBgColor = 'orange';
        }
        document.getElementById('wkss-type').style.backgroundColor = typeBgColor;
        WanikaniDomUtil.addClass(document.getElementById("rev-solution"), "info");
        document.getElementById('rev-solution').innerHTML = item.solution;
        document.getElementById('rev-index').innerHTML = item.index;

        //initialise the input field
        document.getElementById("rev-input").focus();
		WanikaniDomUtil.removeClass(document.getElementById("rev-input"), "caution");
		WanikaniDomUtil.removeClass(document.getElementById("rev-input"), "error");
        WanikaniDomUtil.removeClass(document.getElementById("rev-input"), "correct");
        document.getElementById("rev-input").value = "";

        //check for alphabet letters and decide to bind or unbind wanakana
        if (item.solution[0].match(/[a-zA-Z]+/i)) {
            wanakana.unbind(document.getElementById('rev-input'));
            document.getElementById("rev-input").setAttribute('placeholder','Your response');
            document.getElementById("rev-input").setAttribute('lang','en');
        }
        else {
            wanakana.bind(document.getElementById('rev-input'));
			document.getElementById("rev-input").setAttribute('placeholder','答え');
			document.getElementById("rev-input").setAttribute('lang','ja');
        }
	},
    /** Evaluates the input against the correct answers with some tolerance.
    * @param {Task} task - The task that forms the current query
    * @returns {Item} The item that the review relates to. 
    */
	markAnswer: function(task) {
        var answer = document.getElementById("rev-input").value.toLowerCase();
        //get the index
        var index = document.getElementById('rev-index').innerHTML.trim();
        //get the question type
        var type  = document.getElementById('rev-type').innerHTML.trim();

        //get the item if it is in the current session
        var item = StorageUtil.getVocList() && StorageUtil.getVocList()[task.index];
        if (item) {
            if (index == task.index) {//-------------
                if (MarkingUtil.inputCorrect()) {
                    console.log(answer + "/" + task.solution[0]);
                    if (!item.numCorrect) {
                        console.log("initialising numCorrect");
                        item.numCorrect = {};
                    }

                    console.log("Correct: " + type);
                    switch (type){
                        case "Meaning":
                            if (!item.numCorrect.Meaning)
                                item.numCorrect.Meaning = 0;

                            item.numCorrect.Meaning++;
                            break;
                    case "Reading":
                        if (!item.numCorrect.Reading)
                            item.numCorrect.Reading = 0;

                        item.numCorrect.Reading++;
                        break;
                    case "Reverse":
                        if (!item.numCorrect.Reverse)
                            item.numCorrect.Reverse = 0;

                        item.numCorrect.Reverse++;
                        break;
                    }

                }
                else {
                    console.log(answer + "!=" + task.solution);
                    if (!item.numWrong) {
                        console.log("initialising numCorrect");
                        item.numWrong = {};
                    }

                    console.log("Wrong: " + type);
                    switch (type) {
                        case "Meaning":
                            if (!item.numWrong.Meaning)
                                item.numWrong.Meaning = 0;
                            item.numWrong.Meaning++;
                            break;
                        case "Reading":
                            if (!item.numWrong.Reading)
                                item.numWrong.Reading = 0;

                            item.numWrong.Reading++;
                            break;
                        case "Reverse":
                            if (!item.numWrong.Reverse)
                                item.numWrong.Reverse = 0;

                            item.numWrong.Reverse++;
                    }
                }
            }
            else {
                console.error("Error: indexes don't match");
            }
            return item;
        }
	},
    localresults: [],
	/**
	* @param {Array.<Task>}
	* @param {string}
	*/
    submitAnswer: function (reviewList, input, localresults) {

        var rnd = StorageUtil.localGet('WKSS-rnd') || 0;

        var task = reviewList[rnd];
        //-- starting implementation of forgiveness protocol
        task.forgive = [];//"ゆるす"]; //placeholder (許す to forgive)

        console.log("submit answer task", task);
        var vocList = StorageUtil.getVocList();
        var item = vocList[task.index];
        console.log("submit answer vocList, item", vocList, item);

		//was the input correct?
		var correct = MarkingUtil.inputCorrect(input);
		
		//was the input forgiven?
		var forgiven = (task.forgive.indexOf(input) !== -1);

		//disable input after submission
		//document.getElementById('rev-input').disabled = true;

		if (correct) {
			//highlight in (default) green
			WanikaniDomUtil.addClass(document.getElementById("rev-input"), "correct");
			//show answer
			WanikaniDomUtil.addClass(document.getElementById("rev-solution"), "info");

			console.log("correct answer");
			if (reviewList !== null){
				var oldlen = reviewList.length;

				//save the result 
				//var results = StorageUtil.localGet("User-Stats")||[];
				//results.push(item);
				localresults.push(item);
				
				
				//--
				//StorageUtil.localSet("User-Stats", results);
				reviewList.splice(rnd, 1);

				//replace shorter (by one) reviewList to session
				if (reviewList.length !== 0) {
					console.info("reviewList.length: "+ reviewList.length);
				    //					StorageUtil.localSet('User-Review', reviewList);
                    SetReviewsUtil.reviewList = reviewList;
				}
				else {
					//reveiw over, delete sessionlist from session
					StorageUtil.localRemove('User-Review');
				}
			}
			else{
				console.error("Error: no review session found");
			}
		}
		else if (forgiven){
			WanikaniDomUtil.addClass(document.getElementById("rev-input"), "caution");
		     console.log(input +" has been forgiven. "+item.type);
			//   return;
		}
		else{
			//highight in red
			WanikaniDomUtil.addClass(document.getElementById("rev-input"), "error");
			//show answer
			WanikaniDomUtil.addClass(document.getElementById("rev-solution"), "info");
			console.log("wrong answer");
		}

		item = MarkingUtil.markAnswer(task);
		console.warn("this should be an item not a task", item);
		//StorageUtil.localSet(item.i, item); // (reviews are stored by revindex, will clash)
		//playAudio();

		//answer submitted, next 'enter' proceeds with script
		submit = false;
		vocList[task.index] = item;
		return vocList;
		//return localresults;
	},
	reviewKeyUpHandler: function (evt) {
		//check if key press was 'enter' (keyCode 13) on the way up
		//and keystate true (answer being submitted)
		//and cursor is focused in reviewfield
	    var reviewList = SetReviewsUtil.reviewList;// StorageUtil.localGet('User-Review')||[];
		//var localresults = [];
		console.log("reviewList (keyuphandler) types", reviewList.map(function(a){return a.type;}));
		// No nulls or undefineds thanks
	    //reviewList = reviewList.filter(function(item) {return item;});
		var localResults;
		if (evt.keyCode == 13){
			if (submit) {
				console.group("Answer being submitted.");
				var input = document.getElementById("rev-input").value.trim();
				//check for input, do nothing if none
				if(input.length === 0){
					console.log("input was empty, abort submission");
					console.groupEnd();
					return;
				}

				
				console.log("input:", input);
				MarkingUtil.localresults = MarkingUtil.submitAnswer(reviewList, input, MarkingUtil.localresults);
				console.groupEnd();
				
			}
			else {
				console.log("keystat = " + submit);

				//there are still more reviews in session?
				if (reviewList.length !== 0) {
					//setTimeout(function () {
						console.groupCollapsed("%cReview session continues...[", "color:#889944");

						//cue up first remaining review
						submit = true;
						MarkingUtil.nextReview(reviewList);

						//         document.getElementById('rev-input').disabled = true;
						WanikaniDomUtil.removeClass(document.getElementById("rev-solution"), "info");
						document.getElementById("WKSS-selfstudy").style.display = '';//.fadeIn('fast');
						console.groupEnd();
						console.log("%c]", "color:#889944");
					//}, 1);
				}
				else {
				    MarkingUtil.endReview(MarkingUtil.localresults);
				}
			}
		}
	},
	endReview: function(resultItems){
	    // no review stored in session, review is over
	    //					setTimeout(function (evt) {
	    console.groupCollapsed("Review session over, Function showing results: [");
	    document.getElementById("WKSS-selfstudy").style.display = 'none';
						
	    StorageUtil.localRemove("User-Review");
						
	    //document.getElementById('rev-input').disabled = false;
	    WanikaniDomUtil.removeClass(document.getElementById("rev-solution"), "info");
	    
	    var itemList = resultItems.map(function (item) {
	        return MarkingUtil.updateSRS(item);
	    }, this);
	    StorageUtil.setVocList(itemList);
	    MarkingUtil.showResults(itemList);

	    document.getElementById("WKSS-resultwindow").style.display = '';
	    console.log("showResults completed");

        //clear session
	    MarkingUtil.localresults = [];
	    reviewActive = false;
	    console.groupEnd();
	    console.log("]");
	  
	},
    /** Takes an array of strings and returns the portions before left brackets '(' but only for strings that have them. It is used to add synonym values to the answer list.
	* @param {Array.<string>} solution - An array of acceptable answers for the Task
	* @returns {Array.<string>} Parts of the solution left of left bracket in strings where it exists
	* @example unbracketSolution(["newspaper", "reading Stick (this text won't get through)"]) // ["reading stick"]
	*/
	unbracketSolution: function(solution){
        var unbracketed = solution.filter(function(ans){
            var openBracket = ans.indexOf("(");
            if (openBracket !== -1){ //string contains a bracket
                return ans.toLowerCase().substr(0, openBracket).trim();
            } 
        }, this);
        return unbracketed;
    },
	/** Compares input to solutions to see if it is correct or close enough.
	*/
	inputCorrect: function(input, solution) {
        input = input || document.getElementById("rev-input").value.toLowerCase().trim();
        solution = solution || document.getElementById('rev-solution').innerHTML.split(/[,、]+\s*/);
        var correctCharCount = 0;
        var returnvalue = false;

        console.log("Input: " + input);

        var append = this.unbracketSolution(solution);
        solution = solution.concat(append);
        var i = solution.length;
        while(i--){

            var threshold = 0;//how many characters can be wrong
            if(document.getElementById('rev-type').innerHTML == "Meaning") {
                threshold = Math.floor(solution[i].length / SettingsUtil.ERROR_ALLOWANCE);
            }

            console.log("Checking " + solution[i] + " with threshold: " + threshold);

            var j;
            var lengthDiff = Math.abs(input.length - solution[i].length);
            if (lengthDiff > threshold){
                returnvalue = returnvalue || false;
                console.log("false at if branch " + input.length + " < " + JSON.stringify(solution[i]));//.length );//- threshold));
            } else { //difference in response length is within threshold
                j = input.length;
                while (j--) {
                    if (input[j] == solution[i][j]) {
                        console.log (input[j] +" == "+ solution[i][j]);
                        correctCharCount++;
                    }
                }
                if (correctCharCount >= solution[i].length - threshold){
                    returnvalue = true;
                }
            }

        }

        console.log("Returning " + returnvalue);
        return returnvalue;
    }
};

module.exports = MarkingUtil;
},{"./objectutil.js":8,"./setreviewsutil.js":12,"./settingsutil.js":13,"./storageutil.js":14,"./wanikanidomutil.js":17}],8:[function(require,module,exports){
var ObjectUtil = {
    /** Validates a task object
	* @param {Task} add - The Task being verified
	* @returns {Boolean} If the provided task has all the necessary properties to be added to the review list.
	*/
	isItemValid: function(add) {
        return (!this.isEmpty(add.kanji) && //kanji property exists
			!this.isEmpty(add.meaning) && //meaning property exists
			!this.isEmpty(add.reading) && //reading property exists
			this.isArray(add.meaning) &&//meaning is an array
			this.isArray(add.reading));//reading is an array
    },
	/** Save to list based on .index property
	* @param {Array.<task>} eList
	* @param {task} eItem
	*/
    saveToSortedList: function(eList,eItem){
        var get = ObjectUtil.findIndex(eList,eItem);
        if (Math.sign(1/get) === -1){
            eList.splice(-get,0,eItem);
        }
		return eList;
    },

	binarySearch: function(values, target, start, end) {
        if (start > end) {
            /* start has higher value than target, end has lower value.
            Item belongs between.
            Need to return 'start' with a flag that it hasn't been found (invert sign) */
            return -(start);
        }
        var middle = Math.floor((start + end) / 2);
        var value = values[middle];
        if (Number(value.index) > Number(target.index)) {
			return ObjectUtil.binarySearch(values, target, start, middle-1);
		}
        if (Number(value.index) < Number(target.index)) {
			return ObjectUtil.binarySearch(values, target, middle+1, end);
		}
        return middle; //found!
    },
	findIndex: function(values, target) {
        return ObjectUtil.binarySearch(values, target, 0, values.length - 1);
	},

   /** Converts number of milliseconds into a readable string
	* @param {number} milliseconds - The number of milliseconds to approximate
	* @returns {string} Readable time frame ('2 months', '3 hours', '1 week' etc).
	*/
	ms2str: function(milliseconds){
        var num; //number of months weeks hours etc
        //more time has elapsed than required for the level
        if(milliseconds <= 0) {
            return "Now" ;
        }
        if(milliseconds > 2628000000) {//About a month
            num = Math.floor(milliseconds/2628000000).toString()+" month";
            if (num !== "1 month"){
                return num+"s";
            }else{
                return num;
            }
        }
        if(milliseconds > 604800000) {//A week
            num = Math.floor(milliseconds/604800000).toString()+" week";
            if (num !== "1 week"){
                return num+"s";
            }else{
                return num;
            }
        }
        if(milliseconds > 86400000) {//A day
            num = Math.floor(milliseconds/86400000).toString()+" day";
            if (num !== "1 day"){
                return num+"s";
            }else{
                return num;
            }
        }
        if(milliseconds > 3600000) {//An hour
            num = Math.floor(milliseconds/3600000).toString()+" hour";
            if (num !== "1 hour"){
                return num+"s";
            }else{
                return num;
            }
        }
        if(milliseconds > 60000) {//A minute
            num = Math.floor(milliseconds/60000).toString()+" minute";
            if (num !== "1 minute"){
                return num+"s";
            }else{
                return num;
            }
        }
        if(milliseconds > 0) {//A second is 1000, but need to return something for less than one too
            num = Math.floor(milliseconds/1000).toString()+" second";
            if (num !== "1 second"){
                return num+"s";
            }else{
                return num;
            }
        }
    },
    /** Gets the Kanji characters in a given string.
	* @param {string} vocabString -
	* @return {Array.<string>} An array of the kanji components in the given string
	*/
    getComponents: function(vocabString){
        return Array.prototype.filter.call(vocabString, function(ch){
            return /^[\u4e00-\u9faf]+$/.test(ch);
        }, this);
    },

	isEmpty: function(value) {
        return (value === void 0 || value === null);
    },
	isArray: function(arg){
		return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === '[object Array]';
	}
};

module.exports = ObjectUtil;
},{}],9:[function(require,module,exports){
var reviewSessionUtil = {
	/** Messing around with vanilla WaniKani review variables
	*/
    joinReviews: function(WKItems){
        console.log("joining reviews");
        $.jStorage.stopListening("reviewQueue", joinReviews);
        var WKreview = $.jStorage.get("reviewQueue")||[];
        var WKcombined = WKreview.concat(WKItems);
        $.jStorage.set("reviewQueue", WKcombined);
    },
	wKSS_to_WK: function(WKSSItem){
        var WKItem = {};
        //    WKItem.aud = "";
        WKItem.en = WKSSItem.meaning.map(function(s) {
			 //trim whitespace and capitalize words
			 return s.trim().replace(/\b\w/g , function(m){
				return m.toUpperCase();
			});
		});
        WKItem.id = "WKSS" + WKSSItem.i;
        WKItem.kana = WKSSItem.reading;
        WKItem.srs = WKSSItem.level+1;//WK starts levels from 1, WKSS starts them from 0
        WKItem.voc = WKSSItem.kanji;
        WKItem.components = WKSSItem.components;

        WKItem.syn = [];
        //Add synonyms of strings without bracketed info to get around checking the full string including brackets
        WKSSItem.meaning.forEach(function(meaning){
            var openBracket = meaning.indexOf("(");
            if (openBracket !== -1 && meaning.indexOf(")") !== -1){
                WKItem.syn.push(meaning.substr(0, openBracket).trim().replace(/\b\w/g , function(m){ return m.toUpperCase();}));
            }
        }, this);

        return WKItem;
    },

	loadTasks: function(userVocab, i, userVocabs){
        var dueNow = (userVocab.locked === "no" && userVocab.level < 9 && Date.now() > userVocab.due);

        if (dueNow){
            if (userVocab.kanji.length * userVocab.meaning[0].length * userVocab.reading[0].length){
                //Sorry, we need all three to add to WK review, no kana only without readings etc.
                console.log("item:" + userVocab.kanji + ", " + userVocab.locked +" === \"no\" && " + userVocab.level + " < 9 && " + Date.now() + " > " + userVocab.due);
                console.log(dueNow);
                return wKSS_to_WK(userVocab);
            }
			else{
                console.log("Item " + userVocab.kanji + " could not be added, it is missing one or more of the essential fields for a WK vocabulary review");
            }
        }
    },
	getWKItems: function(){
		return StorageUtil.getVocList().map(this.loadTasks, this);
    },
	
	shoehornIntoWaniKani: function(){
		//where the magic happens
		if (WKSS_Settings.asWK){
			$.jStorage.listenKeyChange("reviewQueue", function(){this.joinReviews(this.getWKItems());});
		}
	}		
};
},{}],10:[function(require,module,exports){
var Rev_Item = function(prompt, kanji, type, solution, index){
	this.prompt = prompt;
	this.kanji = kanji;
	this.type = type;
	this.solution = solution;
	this.index = index;
};

module.exports = Rev_Item;
},{}],11:[function(require,module,exports){
var ServerUtil = {
	//Make asyncronous call for the API of the currently logged in user, ask for confirmation, don't be creepy :P
	getLoggedInUserAPI: function(callback){
		var xhrk = this.createCORSRequest('get', 'https://www.wanikani.com/account');
		/**
		* @param {Event} evt - evt.type === "readystatechange"
		*/
		xhrk.onreadystatechange = function(evt) {
			if (xhrk.readyState == 4){
				var divElement = document.createElement('div');
				divElement.innerHTML = xhrk.responseText;
				
				var APIfields = Array.prototype.filter.call(divElement.getElementsByTagName("input"), function(elem){
					return elem.getAttribute("placeholder") === "Key has not been generated";
				});
				console.log("APIfields: ", APIfields.toString());
				console.log("APIfields: ", APIfields instanceof HTMLCollection);
				if (APIfields.length){
					var APIkey = APIfields[0].value;
					callback(APIkey);
				}
			}
		};
		try{
			xhrk.send();
		}
		catch (e){
			console.log("An error has occurred: ", e);
			console.error("An error has occurred: ", e);
			
		}
	},
	createCORSRequest: function(method, url){
		var xhr = new XMLHttpRequest();
		try{
			if ("withCredentials" in xhr){
				xhr.open(method, url, true);
			}
			else if (typeof XDomainRequest !== "undefined"){
				xhr = new XDomainRequest();
				xhr.open(method, url);
			}
			else {
				xhr = null;
			}
			return xhr;
		}
		catch (e){
			console.error("Uh oh!: ", e);
			console.log("Uh oh!: ", e);
		}
	}
};

module.exports = ServerUtil;
},{}],12:[function(require,module,exports){
var StorageUtil = require('./storageutil.js');
var ObjectUtil = require('./objectutil.js');
var SettingsUtil = require('./settingsutil.js');

//Constructors
var Rev_Item = require('./revitem.js');

var WKSS_Settings = StorageUtil.localGet('WKSS-settings');

/** Prepare Reviews and put them into storage.
*/
var SetReviewsUtil = {
	reviewActive: false,
	reviewList:[],
	endReviewSession: function () {
		document.getElementById('selfStudyForm').reset();
		this.reviewActive = false;
	},

    /** This is an event handler
    */
	generateReviewList: function(evt) {
		//don't ]interfere with an active session
		
		if (SetReviewsUtil.reviewActive){
			console.log("generateReviewList args", arguments);
			document.getElementById('user-review').innerHTML = "Review in Progress";
			return;
		}

		console.log("generateReviewList()");
		// function generateReviewList() builds a review session and updates the html menu to show number waiting.
		var numReviews = 0;
		var soonest = Infinity;
		var next;

		var reviewList = [];

		//check to see if there is vocab already in offline storage
		if (StorageUtil.getVocList()) {
			var vocabList = StorageUtil.getVocList();
			var now = Date.now();

			//for each vocab in storage, get the amount of time vocab has lived
			vocabList.forEach(function(task, i){
			    var due = task.due; //task.date + SettingsUtil.srsObject[task.level].duration;

				// if item is unlocked and unburned
				if (task.level < 9 &&
					(!task.manualLock ||task.manualLock === "no" || task.manualLock === "n" ||
					 task.manualLock ==="DB" && !WKSS_Settings.lockDB )){
					// if it is past review time
					if(now >= due) {
						// count vocab up for review
						numReviews++;

						// add item-meaning object to reviewList
						// have made this optional for surname lists etc.
						if (task.meaning[0] !== "") {
							//Rev_Item object args: prompt, kanji, type, solution, index
							var revItem = new Rev_Item(task.kanji, task.kanji, "Meaning", task.meaning, i);
							reviewList.push(revItem);
						}

						// reading is optional, if there is a reading for the vocab, add its object.
						if (task.reading[0] !== "") {
							//Rev_Item object args: prompt, kanji, type, solution, index
							var revItem2 = new Rev_Item(task.kanji, task.kanji, "Reading", task.reading, i);
							reviewList.push(revItem2);
						}

						//if there is a meaning and reading, and reverse flag is true, test reading from english
						if (task.reading[0] !== "" && task.meaning[0] !== "" && WKSS_Settings.reverse){
							//Rev_Item object args: prompt, kanji, type, solution, index
							var revItem3 = new Rev_Item(task.meaning.join(", "), task.kanji, "Reverse", task.reading, i);
							reviewList.push(revItem3);
						}

					}
					else{//unlocked/unburned but not time to review yet
						console.log("setting soonest");
						next = due - now;
						soonest = Math.min(soonest, next);
					}
				}//end if item is up for review
			});// end iterate through vocablist
		}// end if localStorage
		if (reviewList.length !== 0){
			//store reviewList in current session
//			StorageUtil.localSet('User-Review', JSON.stringify(reviewList));
			console.log(reviewList);
		}
		else{
			console.log("reviewList is empty: "+JSON.stringify(reviewList));

			StorageUtil.localSet('User-Review', JSON.stringify(reviewList));

			document.getElementById('user-review').innerHTML = soonest < Infinity ? "Next Review in " + ObjectUtil.ms2str(soonest) : "No Reviews Available";
		}
		var strReviews = numReviews.toString();

		/* If you want to do the 42+ thing.
		 if (numReviews > 42) {
		 strReviews = "42+"; //hail the crabigator!
		 }
		//*/

		// return the number of reviews
		console.log(numReviews.toString() +" reviews created");
		if (numReviews > 0){
			var reviewString = (soonest !== void 0)? "<br/>\r\nMore to come in "+ObjectUtil.ms2str(soonest):"";
			document.getElementById('user-review').innerHTML = "Review (" + strReviews + ")" + reviewString;
		}
		SetReviewsUtil.reviewList = reviewList;
	},

	importItemsHandler: function() {
		var impt = document.getElementById("importArea").value;
        if (impt.length !== 0) {
            try {
                var add = JSON.parse(impt.toLowerCase());
                if (setReviewsUtil.checkAdd(add)) {
                    document.getElementById("importStatus").appendChild(document.createTextNode("No valid input (duplicates?)!"));
                    return;
                }

                var newlist;
                var srslist = [];
                if (StorageUtil.getVocList().length) {
                    var vocabList = StorageUtil.getVocList();
                    srslist = StorageUtil.getVocList();
                    newlist = vocabList.concat(add);
                }
                else {
                    newlist = add;


                }
                var i = add.length;
                while(i--){
                    StorageUtil.setVocItem(add[i]);
                }

                $("#importStatus").text("Import successful!");

                $("#importForm")[0].reset();
                $("#importArea").text("");

            }
            catch (e) {
                $("#importStatus").text("Parsing Error!");
                console.log(e);
            }

        }
        else {
            $("#importStatus").text("Nothing to import :( Please paste your stuff first");
        }
    },
	/** Takes a JSON object (parsed from import window) and checks with stored items for any duplicates
	* @returns {boolean} True if each item in 'add' array is valid and at least one of them already exists in storage
	*/
	checkAdd: function(add) {
        var i = add.length;
        if (StorageUtil.getVocList().length) {
            var vocabList = StorageUtil.getVocList();
            while(i--){
                if (ObjectUtil.isItemValid(add[i]) &&
                    setReviewsUtil.checkForDuplicates(vocabList,add[i]))
                    return true;
            }
        }
        return false;
    },
	editSaveHandler: function () {
		//-- be aware
		//deleting one item may cause mismatch if i is property of item in list
		try {
			if ($("#editItem").val().length !== 0) {
				var editItem = document.getElementById("editItem");
                var index = editItem.name;
				var item = JSON.parse(editItem.value.toLowerCase());
                // Make sure that the word 'meaning' is immutable, so it exists to trim
				
				if (item.meaning){
					item.meaning.forEach(function(meaning, m, meanings){
						if (meaning === ""){
							delete meanings[m];
						}
					}, this);
				}
                var fullList = StorageUtil.getVocList().reverse();

                if (ObjectUtil.isItemValid(item) &&//item is valid
                    !(SetReviewsUtil.checkForDuplicates(fullList,item) && //kanji (if changed) is not already in the list
                      fullList[index].kanji !== item.kanji)) {//unless it is the item being edited

                    var srslist = StorageUtil.getVocList().reverse();
                    //get srs components of item(list)
                    fullList[index] = item;//does not have srs stuff, re-add it now

                    fullList[index].date = srslist[index].date;
                    fullList[index].level = srslist[index].level;
                    fullList[index].locked = srslist[index].locked;
                    fullList[index].manualLock = srslist[index].manualLock;

                    fullList = fullList.reverse(); //reset order of array

                    StorageUtil.localSet('User-Vocab', fullList);

                    editWindowInst.generateEditOptions();
                    $("#editStatus").html('Saved changes!');
                    document.getElementById("editItem").value = "";
                    document.getElementById("editItem").name = "";
				}
				else{
                    $("#editStatus").text('Invalid item or duplicate!');
                    alert(ObjectUtil.isItemValid(item).toString() +" && ！("+ SetReviewsUtil.checkForDuplicates(fullList,item).toString()+" && !("+fullList[index].kanji+" !== "+item.kanji+")");
                }
			}
		}
		catch (e) {
			$("#editStatus").text(e);
		}
    },
	/** Checks if an item's kanji is represented in a list
	* @returns {boolean}
	*/
    checkForDuplicates: function(list, item){
		return list.some(function(a){return a.kanji === item.kanji;});
	},
	/** Sets the locks on all Tasks in storage
	*/
    refreshLocks: function (kanjiList) {
        console.groupCollapsed("Checking vocab for recent unlocks");
        //this._kanjiList = kanjiList;
        var vocList = StorageUtil.getVocList().map(function (vocItem) {
			vocItem = this.setLocks(vocItem, kanjiList);
			return vocItem;
		}, this);
		console.groupEnd();
		StorageUtil.setVocList(vocList);
    },
	/** Creates a lookup array for each kanji with its srs level. Used for displaying component levels.
	* @param item
	* @param kanjilist
	* @returns An array of the kanji with SRS values for each kanji component.
	* @example
        eg. 折り紙:
        compSRS = [{"kanji": "折", "srs": "guru"}, {"kanji": "紙", "srs": "apprentice"}]
	*/
	getCompKanji: function(item, kanjiList){
		kanjiList = kanjiList || [];
		var GUPPY_LIMIT = 100;

        var kanjiReady = false; //indicates if the kanjiList has been populated
        var userGuppy = false; //indicates if kanjiList has less than 100 items
        var kanjiObj = {};

        //has the server responded yet
        if (kanjiList.length > 0){
            console.log("kanjiList is > 0");
            kanjiReady = true;
			//is there less than 100 kanji in the response
            if (kanjiList.length < GUPPY_LIMIT){
                console.log("kanjiList is < " + GUPPY_LIMIT);
                userGuppy = true;
            }
            //create lookup object
			kanjiList.forEach(function(kanji){
				kanjiObj[kanji.character] = kanji;
            }, this);
        }

        var components = item.components;
		var compSRS = components.map(function(component){
            var matched = false;

            //if the character in the item exists in the kanjiObj index sourced from server
			if (kanjiObj[component] !== void 0){ //match found
				return {
					kanji: component,
					srs: kanjiObj[component].srs
				};
			}
			else { // character was not in the kanjiObj index
                if (kanjiReady){ //was there a server response?
                    if (userGuppy){ //is the user a guppy (kanji probably matches a turtles response)
                        console.log("matched=false, kanjiList.length: "+kanjiList.length);
                        return {
							kanji: component,
							srs: "noMatchGuppy"
						};
                    }
					else{ //user is a turtle, kanji must not have been added to WK (yet)
                        console.log("matched=false, kanjiList.length: "+kanjiList.length);
                        return {
							kanji: component,
							srs: "noMatchWK"
						};
                    }
                }
				else{
                    // No server response
					return {
						kanji: component,
						srs: "noServerResp"
					};
                }
            }
        }, this);
        return compSRS;
    },

	isKanjiLocked: function(srsitem, kanjiList, locksOn){
		// Enumeration "yes", "no", "DB"
        var locked = "no";
        if (locksOn){
			// "yes":	item will be locked while there is no database connection.
			//			if the server response indicates that it has been unlocked, only then will it be available for review
			
			// Kanji with these levels will be locked
			var lockedSrsLevels = ["apprentice", "noServerResp", "unreached"];
			// Task is unlocked by default, Check locks on each Kanji encountered
            var componentList = this.getCompKanji(srsitem, kanjiList);
            // eg: componentList = getCompKanji("折り紙", kanjiList);
            // componentList = [{"kanji": "折", "srs": "guru"}, {"kanji": "紙", "srs": "apprentice"}]
            componentList.some(function(component){
                //look for locked kanji in list
                if (component.srs == "apprentice" ||
                    component.srs == "noServerResp"||
                    component.srs == "unreached"
                   ){
                    locked = "yes";
                    console.info("component: ", component);
					return true; // Ends 'some' loop, one locked component locks the whole item
                }
				//DB locks get special state
                else if (component.srs == "noMatchWK" ||
					component.srs == "noMatchGuppy"){
                    locked = "DB";
                    //"DB"	: database limitations.
                    // Kanji was not found, either user is Guppy, or WK doesn't have it.
					return false;
                }
			}, this);
        }
        //locked will be either "yes","no", or "DB"
        return locked;
    },
    /** Manages the locked and manualLock properties of srsitem. This is to stop items being locked again after they have been unlocked if any of the kanji used falls below the unlock threshold (eg. if the 勉 in 勉強 falls back to apprentice, we do not want to lock up 勉強 again.)
	* @param {Object} item
	* @param {string} item.locked - (String enumeration) A real time evaluation of the item (is any of the kanji in the word locked?)
	* @param {string} item.manualLock - (String enumeration) Will return 'no' if .locked has ever returned 'no'.
	* @returns {ITask} item
	*/
    setLocks: function(item, kanjiList){
        //once manualLock is "no" it stays "no". Only run this if it is true, "yes" or "DB"
        if (item.manualLock !== false && item.manualLock !== "no" && item.manualLock !== "n"){

            kanjiList = kanjiList||[];

            item.components = ObjectUtil.getComponents(item.kanji);

            item.locked = this.isKanjiLocked(item, kanjiList, SettingsUtil.LOCKS_ENABLED);

            item.manualLock = item.locked !== "no"; //cast manualLock to boolean
        }else{
            item.manualLock = false;
        }

        console.log("setting locks for "+ item.kanji +": locked: "+item.locked+", manualLock: "+ item.manualLock);
		
		//phase out manualLock
		item.achieved = item.manualLock;

        return item;
    },

	/**
	*/
	setVocItem: function(item){
        //Assumption: item comes only with kanji, reading and meaning
        item.level = 0;
        item.date = Date.now();
        item.manualLock = "";
		var kanjiList = StorageUtil.localGet('User-KanjiList');
        item = this.setLocks(item, kanjiList);
		 //0.1.9 adding in 'due' property to make review building simpler
        item.due = item.date + SettingsUtil.srsObject[item.level].duration;

        var vocList = StorageUtil.getVocList();

		var found = vocList.find(function(task){
            return task.kanji === item.kanji;
        }, this);
		
        if (!found) {
            //provide index for faster searches
            console.log(item.kanji +" not found in vocablist, adding now");
            item.i = vocList.length;
			vocList.push(item);

            StorageUtil.localSet('User-Vocab',vocList);
        }
    }
};

module.exports = SetReviewsUtil;
},{"./objectutil.js":8,"./revitem.js":10,"./settingsutil.js":13,"./storageutil.js":14}],13:[function(require,module,exports){
var hrs = 60*60*1000;
var days = 24*hrs;
var weeks = 7*days;

var StorageUtil = require('./storageutil.js');

var SettingsUtil = {
	// Every x letters, one can be wrong.
	ERROR_ALLOWANCE: 4,
	LOCKS_ENABLED: true,
	    //srs 4h, 8h, 24h, 3d (guru), 1w, 2w (master), 1m (enlightened), 4m (burned)
    
	srsObject: [
		{level: 0, rank: "Started",		duration: 0}, 
		{level: 1, rank: "Apprentice",	duration: 4*hrs},
		{level: 2, rank: "Apprentice",	duration: 8*hrs},
		{level: 3, rank: "Apprentice",	duration: 1*days},
		{level: 4, rank: "Apprentice",	duration: 3*days},
		{level: 5, rank: "Guru",		duration: 1*weeks},
		{level: 6, rank: "Guru",		duration: 2*weeks},
		{level: 7, rank: "Master",		duration: 730*hrs},
		{level: 8, rank: "Enlightened",	duration: 2922*hrs},
		{level: 9, rank: "Burned"}
	]
};

module.exports = SettingsUtil;
},{"./storageutil.js":14}],14:[function(require,module,exports){
var standardStyleGet = "font-weight: bold; color: #5599AA";
var italicStyleGet = "font-style: italic; color: #5599AA";
var standardStyleSet = "font-weight: bold; color: #559933";
var italicStyleSet = "font-style: italic; color: #559933";

var StorageUtil = {
	VOCAB_LABEL: "User-Vocab",
	API_LABEL: "Wanikani-API",
	/** Initialise User-Vocab
	*/
	initStorage: function(){
		if (!this.localGet(this.VOCAB_LABEL)){
			this.localSet(this.VOCAB_LABEL, []);
		}
	},
	/** Handle the users API key.
	* @param {string} APIkey - the users API key to set. If given "YOUR_API_HERE", it will return the key in browser storage.
	* @returns {string} the users API key as supplied and stored, or in the case of "YOUR_API_HERE" being passed, the stored key.
	*/
    getSetApi: function(APIkey){
        var storedAPI = this.localGet(this.API_LABEL);
        if (!APIkey || APIkey === "YOUR_API_HERE"){
            if (storedAPI !== null && storedAPI !== "undefined"){
                APIkey = storedAPI;
            }
        }
		else{
            //API has been set in code.
            if (storedAPI !== APIkey){
                StorageUtil.saveUserApi(APIkey);//overwrite with new API
            }
        }
        return APIkey;
    },
	saveUserApi: function(APIkey){
		if (APIkey){
			this.localSet(this.API_LABEL, APIkey);
		}
	},
	/**
	*/
	parseString: function(strObj){
		console.assert("string" === typeof strObj, "non-string passed to parseString", strObj);
        //avoids duplication of code for sesssionGet and localGet
        var obj;
        try {
            obj = JSON.parse(strObj);
            console.log("Variable is of type " + typeof obj);
        }
		catch(e){
			console.error(strObj + " is an ordinary string that cannot be parsed.");
			obj = strObj;
        }
        return obj;
    },
	/**
	*/
	localGet: function(strName){
		var data = localStorage.getItem(strName);
		var result = data && this.parseString(data);
		console.groupCollapsed("%cRetrieving %c"+strName+" %cfrom local storage", standardStyleGet, italicStyleGet, standardStyleGet);
		console.info(typeof result, result);
		console.groupEnd();
		return result;
    },
	localRemove: function(strName){
		if (localStorage.getItem(strName) !== null){
			localStorage.removeItem(strName);
			return true;
		}
		else{
			return false;
		}
	},
	/** Sets strings and objects into browser storage
	* @requires localStorage
	* @requires JSON
	*/
	localSet: function(strName, obj){
		console.groupCollapsed("%cStoring %c"+strName+" %cinto local storage", standardStyleSet, italicStyleSet, standardStyleSet);
		console.info(typeof obj, obj);
		console.groupEnd();

        localStorage.setItem(strName, typeof obj === "string"? obj : JSON.stringify(obj));
    },
	/** Only sets strings and objects into browser storage if they are not already there
	* @requires localStorage
	* @requires JSON
	*/
	localSetFirstTime: function(strName, obj){
		if (!this.localGet(strName)){
			this.localSet(strName, obj);
		}
    },
	/**
	*/
	sessionGet: function(strName){
        var strObj = sessionStorage.getItem(strName);
        return this.parseString(strObj);
    },
	/** Sets strings and objects into browser session storage
	* @requires localStorage
	* @requires JSON
	*/
	sessionSet: function(strName, obj){
        sessionStorage.setItem(strName, typeof obj === "string"? obj : JSON.stringify(obj));
    },
	/** Gets the list of user defined vocabulary items
	*/
	getVocList: function(){
        var vocList = this.localGet(this.VOCAB_LABEL)||[];
        vocList.forEach(function(item, i){
			item.i = i; //set index for item (->out)
        }, this);
        return vocList;
    },
	setVocList: function(vocList){
		this.localSet(this.VOCAB_LABEL, vocList);
	}
};

module.exports = StorageUtil;
},{}],15:[function(require,module,exports){
// shut up JSHint
/* jshint jquery: true, expr: true, indent:2 */
/* global window, wanakana, XDomainRequest */


 
 /** Describes any object that can be reviewed or learned, includes IRadical, IKanji, and IVocabulary
 * @typedef {Object} Task
 * @property {boolean|string} locked - locked
 * @property {boolean|string} manualLock - manualLock
 */

//GM_addStyle shim for compatibility with greasemonkey
var gM_addStyle = function(CssString){
	//get DOM head
	if (document.head) {
		//build style tag
		var style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.textContent = CssString;
		//insert DOM style into head
		document.head.appendChild(style);
	}
};

 
var StorageUtil = require('./storageutil.js');
var SettingsUtil = require('./settingsutil.js');
var ImportUtil = require('./importutil.js');
var WanikaniUtil = require('./wanikaniutil.js');
var MarkingUtil = require('./markingutil.js');
var SetReviewsUtil = require('./setreviewsutil.js');
var ObjectUtil = require('./objectutil.js');
var WanikaniDomUtil = require('./wanikanidomutil.js');
var ServerUtil = require('./serverutil');
var ReviewSessionUtil = require('./reviewsessionutil.js');
var UserClass = require('./userclass.js');

// Make a display window class for all inputs, this is an instance of such.
var EditWindowFunctions = require('./editwindow.js');

var isBeingRunLocally = window.document.location.protocol === "file:";

var main = function(){
    "use strict";
	
    console.log("Browser: ", navigator.userAgent);
    // Get the element to attach the menu to
    var nav = window.document.location.protocol === "https:" ? WanikaniDomUtil.getNavBar() : document.body;

    var mockjax = document.createElement("script");
    mockjax.setAttribute('src', 'https://cdn.jsdelivr.net/jquery.mockjax/1.6.1/jquery.mockjax.js');
    mockjax.setAttribute('type', 'text/javascript');

    var wanakana = document.createElement("script");
    wanakana.setAttribute('src', 'https://rawgit.com/WaniKani/WanaKana/master/lib/wanakana.js');
    wanakana.setAttribute('type', 'text/javascript');
	

    var wanakanaLocal = document.createElement("script");
    wanakanaLocal.setAttribute('src', 'wanakana.js');
    wanakanaLocal.setAttribute('type', 'text/javascript');

    if (typeof jQuery !== "undefined"){
        document.head.insertBefore(mockjax, document.head.firstChild);
    }
    document.head.insertBefore(wanakana, document.head.firstChild);
	
    if (window.document.location.protocol === "file:") {
        document.head.insertBefore(wanakanaLocal, document.head.firstChild);
    }
	
    // TODO make sure selfStudyMenu has been built before adding
    if (nav) {
        nav.appendChild(document.selfStudyMenu);
    }
    else {
        console.warn("No navbar found, self study button was not added.");
    }

	document.body.appendChild(userWindow);
	document.getElementById("WKSS-user").style.display = 'none';
	document.body.appendChild(addAddWindow);
	document.getElementById("WKSS-add").style.display = 'none';
	document.body.appendChild(addEditWindow);
	document.getElementById("WKSS-edit").style.display = 'none';
	document.body.appendChild(exportWindow);
	document.getElementById("WKSS-export").style.display = 'none';
	document.body.appendChild(importWindow);
	document.getElementById("WKSS-import").style.display = 'none';
	document.body.appendChild(resultsWindow);
	document.getElementById("WKSS-resultwindow").style.display = 'none';
	document.body.appendChild(selfStudyWindow);
	document.getElementById("WKSS-selfstudy").style.display = 'none';
	
	addClickEvent(document.getElementById("AutofillUserBtn"), autoFillUser);
	addClickEvent(document.getElementById("AddItemBtn"), handleAddClick);
	addClickEvent(document.getElementById("AddCloseBtn"), function () {
		document.getElementById("WKSS-add").style.display = 'none';
		document.getElementById("addForm").reset();
		document.getElementById("addStatus").innerText = 'Ready to add..';
		WanikaniDomUtil.removeClass(document.getElementById("addKanji"), "error");
		WanikaniDomUtil.removeClass(document.getElementById("addMeaning"), "error");
	});
	addClickEvent(document.getElementById("ResetLevelsBtn"), EditWindowFunctions.resetLevels);
	addClickEvent(document.getElementById("EditEditBtn"), EditWindowFunctions.editEditHandler);
	addClickEvent(document.getElementById("EditSaveBtn"), SetReviewsUtil.editSaveHandler);
	addClickEvent(document.getElementById("EditDeleteBtn"), EditWindowFunctions.editDelete);
	addClickEvent(document.getElementById("EditDeleteAllBtn"), EditWindowFunctions.editDeleteAll);
	addClickEvent(document.getElementById("WKSS-editCloseBtn"), function () {
		document.getElementById("WKSS-edit").style.display = 'none';
		document.getElementById("WKSS-editForm").reset();
		document.getElementById("WKSS-editStatus").innerText = 'Ready to edit...';
	});
	addClickEvent(document.getElementById("ExportItemsBtn"), function () {
		if (StorageUtil.getVocList().length) {
			document.getElementById("WKSS-exportForm").reset();
			var vocabList = StorageUtil.getVocList();
			document.getElementById("exportArea").innerText = JSON.stringify(vocabList);
			document.getElementById("exportStatus").innerText = "Copy this text and share it with others!";
		}
		else {
			document.getElementById("exportStatus").innerText = "Nothing to export yet :(";
		}
	});
	addClickEvent(document.getElementById("ExportSelectAllBtn"), function () {
		if (document.getElementById("exportArea").value.length !== 0) {
			select_all("exportArea");
			document.getElementById("exportStatus").innerText = "Don't forget to CTRL + C!";
		}
	});
	addClickEvent(document.getElementById("ExportCsvBtn"), function () {
		var vocabList = StorageUtil.getVocList();
		var CsvFile = createCSV(vocabList);
		window.open(CsvFile);
	});
	addClickEvent(document.getElementById("WKSS-exportCloseBtn"), function () {
		document.getElementById("export").style.display = 'none';
		document.getElementById("WKSS-exportForm").reset();
		document.getElementById("exportArea").innerText = "";
		document.getElementById("exportStatus").innerText = 'Ready to export..';
	});
	addClickEvent(document.getElementById("ImportCsvBtn"), function () {
	});
	addClickEvent(document.getElementById("ImportWKBtn"), function(){
		WanikaniUtil.getServerResp(APIkey,"vocabulary", WanikaniUtil.onStateChangeHandler);
		console.log("maybe?");
	});
	addClickEvent(document.getElementById("ImportItemsBtn"), SetReviewsUtil.importItemsHandler);
	addClickEvent(document.getElementById("WKSS-importCloseBtn"), function () {
		document.getElementById("import").style.display = 'none';
		document.getElementById("importForm").reset();
		document.getElementById("importArea").innerText = "";
		document.getElementById("importStatus").innerText = 'Ready to import..';
	});
	addClickEvent(document.getElementById("WKSS-SelfstudyCloseBtn"), SetReviewsUtil.endReviewSession);
	addClickEvent(document.getElementById("WrapUpBtn"), function() {
		var sessionList = StorageUtil.localGet('User-Review')||[];
			var statsList = StorageUtil.sessionGet('User-Stats')||[];
		//if an index in sessionList matches one in statsList, don't delete
		var sessionI = sessionList.length;
		var item = StorageUtil.sessionGet('WKSS-item')||[];
		var arr2 = [];
		//for every item in sessionList, look for index in statsList,
		//if not there (-1) delete item from sessionList
		while (sessionI--){
			var index = ObjectUtil.findIndex(statsList,sessionList[sessionI]);
			if ((Math.sign(1/index) !== -1)||(sessionList[sessionI].index == item.index)){

				arr2.push(sessionList[sessionI]);
			}
		}
		console.log(arr2);
		StorageUtil.localSet('User-Review', arr2);
	});
	addClickEvent(document.getElementById("AudioButton"), function () {
		openInNewTab(document.getElementById('rev-audio').innerHTML);
	});
	addClickEvent(document.getElementById("WKSS-ReviewresultsCloseBtn"), function () {
		document.getElementById("WKSS-resultwindow").style.display = 'none';
		document.getElementById("stats-a").innerHTML = "";
	});

	document.getElementById("upload") && document.getElementById("upload").addEventListener('change', ImportUtil.fileUpload, false);
	
	document.getElementById("rev-input").addEventListener('keyup', MarkingUtil.reviewKeyUpHandler);

};

var APIkey = StorageUtil.getSetApi();
console.log("APIkey: ", APIkey);
var userFactory = function(APIkey){
	this.loggedInUser = new UserClass(APIkey);
};
var user = {};
// Calls the function argument (userFactory) with the logged in APIkey as its argument
ServerUtil.getLoggedInUserAPI(userFactory.bind(user));
// Default settings
StorageUtil.localSetFirstTime('WKSS-settings', {
	//Disable vocab locks (unlocked items persist until deleted)
	locksOn: true,
	//Set to false to unlock Kanji is not available on WaniKani (ie. not returned by API)
	lockDB: true,
	//Include English to ひらがな reading reviews
	reverse: true,
	debugging: true,
	//Push user reviews into the main WK review queue
	asWK: true,
	//every x letters, you can make one mistake when entering the meaning
	errorAllowance: 4
});
var WKSS_Settings = StorageUtil.localGet('WKSS-settings');
// Set log function as per settings
var nativeLog = console.log;
console.log = WKSS_Settings.debugging ? function () {
	var args = arguments;
	if (typeof arguments[0] === 'string') {
		args[0] = "WKSS: " + arguments[0];
	}
	else {
		Array.prototype.unshift.call(args, "WKSS: ");
	}
	nativeLog.apply(console, args);
} : function () {
};

/**  JQuery fixes
 */
if (typeof jQuery !== "undefined"){
	$("[placeholder]").focus(function () {
		var input = $(this);
		if (input.val() == input.attr("placeholder")) {
			input.val("''");
			input.removeClass("'placeholder'");
		}
	}).blur(function () {
		var input = $(this);
		if (input.val() == "''" || input.val() == input.attr("placeholder")) {
			input.addClass("placeholder");
			input.val(input.attr("placeholder"));
		}
	}).blur();

	$("[placeholder]").parents("form").submit(function () {
		$(this).find("[placeholder]").each(function () {
			var input = $(this);
			if (input.val() == input.attr("placeholder")) {
				input.val("");
			}
		});
	});
}
 
//track versions & datatypes
StorageUtil.localSet("WKSSdata", {
	v: "0.1.13",
	propertyType: {
		meaning: "array", reading: "array", kanji: "string", i:"number", components: "array", date: "number", due: "number", locked: "string", manualLock: "string"
	},
	propertyDesc: {
		meaning: "list of meanings", reading: "list of readings", kanji: "item prompt", i:"item index", components: "kanji found in word", date: "timestamp of new level", due: "timestamp of item's next review", locked: "indicator of whether components are eligible", manualLock: "latch for 'locked' so failing components don't re-lock the item"
	}
});

// Initialise User-Vocab
StorageUtil.initStorage();

//ReviewSessionUtil.shoehornIntoWaniKani();
var reviewActive;
var showUserWindow = function() {
	Array.prototype.forEach.call(document.getElementsByClassName("WKSS"), function(el){el.style.display = 'none';});
	document.getElementById("WKSS-user").style.display = '';
};

/*
*  Add Item
*/
// event function to open "add window" and close any other window that might be open at the time.
var WKSS_add = function () {
	Array.prototype.forEach.call(document.getElementsByClassName("WKSS"), function(el){el.style.display = 'none';});
	//show the add window
	document.getElementById("WKSS-add").style.display = '';
};

var handleAddClick = require('./handleAddClick.js');

/**  Edit Items
*/
var WKSS_edit = function () {
	EditWindowFunctions.generateEditOptions();
	Array.prototype.forEach.call(document.getElementsByClassName("WKSS"), function(el){el.style.display = 'none';});
	document.getElementById("WKSS-edit").style.display = '';
};
/**  Export
*/
var WKSS_export = function () {
	Array.prototype.forEach.call(document.getElementsByClassName("WKSS"), function(el){el.style.display = 'none';});
	document.getElementById("WKSS-export").style.display = '';
};

/**  Import
*/
var WKSS_import = function () {
	Array.prototype.forEach.call(document.getElementsByClassName("WKSS"), function(el){el.style.display = 'none';});
	document.getElementById("WKSS-import").style.display = '';
};

/**  Review Items
*/
var WKSS_review = function (evt) {
	MarkingUtil.startReview();
};

//declare global values for keyup event
//is an answer being submitted?
//var submit = true;

var buildNode = require('./buildnode.js');
var buildWindow = require('./buildwindow.js');
var windowObjects = require('./windowobjects.js');

var autoFillUser = function(evt){
	console.info(user.loggedInUser);
	document.getElementById("userApi").value = user.loggedInUser._api;
	StorageUtil.saveUserApi(user.loggedInUser._api);
	document.getElementById("WKSS-username").innerText = user.loggedInUser.getUsername();
};

var addClickEvent = function(el, handler, cxt){
	el.addEventListener('click', handler.bind(cxt));
};

var userWindow = buildWindow(windowObjects.user);

var addAddWindow = buildWindow(windowObjects.addVocab);
var addEditWindow = buildWindow(windowObjects.editTask);
var exportWindow = buildWindow(windowObjects.export);

var select_all = function(str) {
	var text_val = document.getElementById(str);
	console.log(text_val);
	text_val.focus();
	text_val.select();
};


var createCSV = function(JSONstring){
	var JSONobject = (typeof JSONstring === 'string') ? JSON.parse(JSONstring) : JSONstring;
	var key;
	var CSVarray = [];
	var header = [];  
	var id = JSONobject.length;
	if (id){//object not empty
		for (key in JSONobject[0]){
			if (JSONobject[0].hasOwnProperty(key)){
				header.push(key);
			}
		}
	}
	CSVarray.push(header.join(','));

	while(id--){
		var line = [];
		var h = header.length;
		while(h--){// only do keys in header, in the header's order. //JSONobject[id]){
			key = header[h];
			if(JSONobject[id][key] !== undefined){
				if (ObjectUtil.isArray(JSONobject[id][key])){
					//parse array here
					line.push(JSONobject[id][key].join("\t"));
				}else{
					line.push(JSONobject[id][key]);
				}
			}
		}line = line.reverse();
		CSVarray.push(line.join(','));
	}
	var CSVstring = CSVarray.join("\r\n");

	return encodeURI("data:text/csv;charset=utf-8," + CSVstring);
};


var importWindow = buildWindow(windowObjects.import);

var playAudio = function() {
	var kanji = document.getElementById('rev-kanji').innerHTML;
	var kana = (document.getElementById('rev-solution').innerHTML.split(/[,、]+\s*/))[0];

	document.getElementById('rev-audio').innerHTML = "";
	document.getElementById('audio-form').action = "";
	//document.getElementById('AudioButton').disabled = true;

	if( !kanji.match(/[a-zA-Z]+/i) && !kana.match(/[a-zA-Z]+/i)) {

		kanji = encodeURIComponent(kanji);
		kana = encodeURIComponent(kana);
		var i;

		var newkanji = "";
		for(i = 1; i < kanji.length; i = i+3) {
			newkanji = newkanji.concat(kanji[i-1]);
			newkanji = newkanji.concat('2');
			newkanji = newkanji.concat('5');
			newkanji = newkanji.concat(kanji[i]);
			newkanji = newkanji.concat(kanji[i+1]);
		}

		var newkana = "";
		for(i = 1; i < kana.length; i = i+3) {
			newkana = newkana.concat(kana[i-1]);
			newkana = newkana.concat('2');
			newkana = newkana.concat('5');
			newkana = newkana.concat(kana[i]);
			newkana = newkana.concat(kana[i+1]);
		}

		var url = "http://www.csse.monash.edu.au/~jwb/audiock.swf?u=kana=" + newkana + "%26kanji=" + newkanji;

		console.log("Audio URL: " + url);

		document.getElementById('AudioButton').disabled = false;

		document.getElementById('rev-audio').innerHTML = url;

	}

};

var selfStudyWindow = buildWindow(windowObjects.review);

//-------
var openInNewTab = function(url) {
	var win=window.open(url, '_blank');
	win.focus();
};




var resultsWindow = buildWindow(windowObjects.results);

/** Error handling
* Can use 'error.stack', not cross-browser (though it should work on Firefox and Chrome)
*/
var logError = function(error) {
	console.log("logError(error)");
	var stackMessage = "";
	if ("stack" in error)
		stackMessage = "\n\tStack: " + error.stack;

	console.log("WKSS: Error: " + error.name + "\n\tMessage: " + error.message + stackMessage);
	console.error("WKSS: Error: " + error.name + "\n\tMessage: " + error.message + stackMessage);
};


/**  Prepares the script
*/
var scriptInit = function(element) {
	//functions:
	//    addUserVocabButton()
	//    logError(err)
	console.log("Initializing Wanikani UserVocab Script!");


	document.anchorElement = element;
	var wkStyleCSS = require('./wkstyle.js');
	gM_addStyle(wkStyleCSS);
	
	// Set up buttons
	try {
		if (typeof localStorage !== "undefined") {
			document.selfStudyMenu = WanikaniDomUtil.getSelfStudyMenu(WKSS_add, WKSS_edit, WKSS_import, WKSS_export, null, WKSS_review, showUserWindow,  SetReviewsUtil.generateReviewList);

			//provide warning to users trying to use the (incomplete) script.
			console.log("this script is still incomplete: \r\nIt is provided as is without warranty express or implied\r\nin the hope that you may find it useful.");
			
			
			if (document.readyState === 'complete'){
				console.info("About to initialise WKSS+");
				main();
			}
			else {
				console.info("Adding event listener to window");
				window.addEventListener("load", main, false);
			}
		}
		else {
			console.log("Wanikani Self-Study: Your browser does not support localStorage.. Sorry :(");
		}
	}
	catch (err) {
		logError(err);
	}
};

console.info(document.readyState);
console.log("adding DOM listener", document.readyState);
// Check for file API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.info("File APIs supported.");
}
else {
	throw 'The File APIs are not fully supported in this browser.';
}

/** Start the script
*/

switch (window.document.location.protocol) {
	case "https:":
	    console.info("WaniKani Self-Study Plus is about to start");
	    // If the user came from another page on WaniKani, they are unlikely to have unlocked any kanji unless that page was the review page

	    var noNewStuff = /^https:\/\/.*\.wanikani\.com\/.*/.test(document.referrer) && !(/https:\/\/.*\.wanikani\.com\/review.*/.test(document.referrer));
        if (noNewStuff){  //Don't waste time if user is browsing site
			console.log("User is unlikely to have new kanji unlocked");
		}
		else{
			WanikaniUtil.getServerResp(APIkey, 'kanji', WanikaniUtil.onStateChangeHandler);
		}
		
		scriptInit();
		break;
	case "http:":
		console.warn("It appears that you are not using https protocol. Attempting to redirect to https now.");
		window.location.href = window.location.href.replace(/^http/, "https");
		break;
	case "file:":
		console.info("Hello local user");
		scriptInit();
		break;
}



},{"./buildnode.js":1,"./buildwindow.js":2,"./editwindow.js":3,"./handleAddClick.js":4,"./importutil.js":6,"./markingutil.js":7,"./objectutil.js":8,"./reviewsessionutil.js":9,"./serverutil":11,"./setreviewsutil.js":12,"./settingsutil.js":13,"./storageutil.js":14,"./userclass.js":16,"./wanikanidomutil.js":17,"./wanikaniutil.js":18,"./windowobjects.js":20,"./wkstyle.js":21}],16:[function(require,module,exports){
var ServerUtil = require('./serverutil.js');
var ObjectUtil = require('./objectutil.js');

var User = function(APIkey){
	this._api = APIkey;
	var xhrk = ServerUtil.createCORSRequest("get", "https://www.wanikani.com/api/user/" + APIkey + "/user-information");
	if (!ObjectUtil.isEmpty(xhrk)){
		xhrk.onreadystatechange = function() {
			if (xhrk.readyState == 4){
				console.info("are there arguments passed to onreadystatechange? ", arguments);
				var resp = JSON.parse(xhrk.responseText);
				for (var key in resp.user_information){
					this[key] = resp.user_information[key];
				}
			}
		}.bind(this);
		xhrk.send();
	}
};

User.prototype = {
	getApi: function() {
		return this._api;
	},
	getUsername: function() {
		return this.username;
	}
};

module.exports = User;
},{"./objectutil.js":8,"./serverutil.js":11}],17:[function(require,module,exports){
/** Deals specifically with the DOM of Wanikani.com, unlike {@link WanikaniUtil} which deals primarily with the API and application side.
*/
var WanikaniDomUtil = {
	buildWindow: require('./buildwindow.js'),
	
	addClass: function(el, className){
	if (el.classList)
		el.classList.add(className);
	else
		el.className += ' ' + className;
	},

	removeClass: function(el, className){
	if (el.classList)
		el.classList.remove(className);
	else
		el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	},
	
	// Generic selector functions
	
	getNavBar: function(){
		return document.getElementsByClassName('nav')[2];
	},
	/** Adds the Button
	*/
    getSelfStudyMenu: function(showAddWindow, showEditWindow, showImportWindow, showExportWindow, showLockWindow, showReviewWindow, showUserWindow, generateReviewList) {
        console.log("addUserVocabButton()");

	
		var dropdownMenu = {
			className: "dropdown custom",
			id: "customDropdown",
			other: {
				"data-dropdown": ""
			},
			childNodes: [{
				tag: 'a',
				className: "dropdown-toggle custom",
				other: {dataToggle: "dropdown"},
				eventListeners: {
					click: generateReviewList
				},
				childNodes: [{
					tag: 'span',
					other: {lang: "ja"},
					childNodes:[String.fromCharCode(33258)+String.fromCharCode(32722)],
				},
				"Self-Study",
				{
					tag: 'i',
					className: "icon-chevron-down",
				}]
			},
			{
				tag: 'ul',
				className: "dropdown-menu",
				id: "WKSS_dropdown",
				childNodes: [{
					tag: 'li',
					className: "nav-header",
					childNodes: ["Customize"]
				},
				{
					tag: 'li',
					childNodes: [{
						tag: 'a',
						id: "click",
						other: {
							style: "cursor: pointer;"
						},
						eventListeners: {
							click: showUserWindow
						},
						childNodes: ["User"]
					}]
				},
				{
					tag: 'li',
					childNodes: [{
						tag: 'a',
						id: "click",
						other: {
							style: "cursor: pointer;"
						},
						eventListeners: {
							click: showAddWindow
						},
						childNodes: ["Add"]
					}]
				},
				{
					tag: 'li',
					childNodes: [{
						tag: 'a',
						other: {
							style: "cursor: pointer;"
						},
						eventListeners: {
							click: showEditWindow
						},
						childNodes: ["Edit"]
					}]
				},
				{
					tag: 'li',
					childNodes: [{
						tag: 'a',
						other: {
							style: "cursor: pointer;"
						},
						eventListeners: {
							click: showExportWindow
						},
						childNodes: ["Export"]
					}]
				},
				{
					tag: 'li',
					childNodes: [{
						tag: 'a',
						other: {
							style: "cursor: pointer;"
						},
						eventListeners: {
							click: showImportWindow
						},
						childNodes: ["Import"]
					}]
				},
				{
					tag: 'li',
					className: "nav-header",
					childNodes: ["Learn"]
				},
				{
					tag: 'li',
					childNodes: [{
						tag: 'a',
						id: "user-review",
						other: {
							style: "cursor: pointer;"
						},
						eventListeners: {
							click: showReviewWindow
						},
						childNodes: ["Please wait..."]
					}]
				}]
					//   <li><a href=\"#\" onclick=\"WKSS_lock();\">Server Settings</a></li>//-->

			}]
		};
		var dropdownListItem = this.buildWindow(dropdownMenu, 'li');
		return dropdownListItem;
    }
};

module.exports = WanikaniDomUtil;
},{"./buildwindow.js":2}],18:[function(require,module,exports){
var ObjectUtil = require('./objectutil.js');
var StorageUtil = require('./storageutil.js');
var ServerUtil = require('./serverutil.js');
var SetReviewsUtil = require('./setreviewsutil.js');
/** Utilities for interaction with the Wanikani API and general website.
*/
var WanikaniUtil = {
	//take out of here soon!
	//Called by reference to xhrk
	onStateChangeHandler: function() {
		if (this.readyState == 4){
			var kanjiList = WanikaniUtil.handleReadyStateFour(this, this.requestedItem);
			console.log("first kanji in list's srs", kanjiList[0].srs);
			if (this.requestedItem === 'kanji'){
				StorageUtil.localSet('User-KanjiList', kanjiList);
				//update locks in localStorage 
				//pass kanjilist into this function
				//(don't shift things through storage unecessarily)
//--
				SetReviewsUtil.refreshLocks(kanjiList);
			}
			else{
				var v = kanjiList.length;
				console.log(v + " items found, attempting to import");
				while (v--){
//--
					SetReviewsUtil.setVocItem(kanjiList[v]);
				}
			}
		}
	},
	hijackRequests: require('./hijackrequests.js'),
	/** Gets the user information using the Wanikani API and stores them directly into browser storage.
	* @param
	* @param {string} [requestedItem = 'kanji'] - The type of request to make to the Wanikani API
	*/
	getServerResp: function(APIkey, requestedItem){
		console.groupCollapsed("%cGetting Response through API using APIkey: %c"+APIkey, "font-weight: bold;", "color: red; font-family:monospace;");
        requestedItem = requestedItem === void 0 ? 'kanji' :requestedItem;
        if (APIkey !== "test"){
            var levels = (requestedItem ==="kanji")? "/1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50":
            "/1,2,3,4,5,6,7,8,9,10"; // Vocab times out if you try to do it all at once. Limited to ten for now.
            var xhrk = ServerUtil.createCORSRequest("get", "https://www.wanikani.com/api/user/" + APIkey + "/" + requestedItem + levels);
            if (!ObjectUtil.isEmpty(xhrk)){
                xhrk.onreadystatechange = function() {
                    if (xhrk.readyState == 4){
                        var serverResponse = this.handleReadyStateFour(xhrk,requestedItem);

                        if (requestedItem === 'kanji'){
							var kanjiList = serverResponse;
                            StorageUtil.localSet('User-KanjiList', kanjiList);
                            console.log("kanjiList from server", kanjiList);
							// Put Kanji into list for checking vocabulary unlocks.
                            SetReviewsUtil.refreshLocks(kanjiList);
                        }
						else if (requestedItem === 'vocabulary'){
							var vocabList = serverResponse;
                            // Put Vocabulary into self study system?
							vocabList.forEach(function(vocab){
                                SetReviewsUtil.setVocItem(vocab);
                            });
                        }
                    }
                }.bind(this);

                xhrk.send();
            }
        }
		else {
            //dummy server response for testing.
            setTimeout(function () {
                var kanjiList = [];
                console.log("creating dummy response");
                var SRS = "apprentice"; //prompt("enter SRS for 子", "guru");
                kanjiList.push({"character": "猫", "srs": "noServerResp"});
                kanjiList.push({"character": "子", "srs": SRS});
                kanjiList.push({"character": "品", "srs": "guru"});
                kanjiList.push({"character": "供", "srs": "guru"});
                kanjiList.push({"character": "本", "srs": "guru"});
                kanjiList.push({"character": "聞", "srs": "apprentice"});
                kanjiList.push({"character": "人", "srs": "enlightened"});
                kanjiList.push({"character": "楽", "srs": "burned"});
                kanjiList.push({"character": "相", "srs": "guru"});
                kanjiList.push({"character": "卒", "srs": "noMatchWK"});
                kanjiList.push({"character": "無", "srs": "noMatchGuppy"});

                console.log("Testing with dummy kanjiList: \n"+JSON.stringify(kanjiList));

                StorageUtil.localSet('User-KanjiList', kanjiList);

                //update locks in localStorage
                StorageUtil.refreshLocks(kanjiList);
            }, 10000);
        }
		console.groupEnd();
    },
	
	handleReadyStateFour: function(xhrk, requestedItem){

        var localkanjiList = [];
        console.log("readystate: "+ xhrk.readyState);
        var resp = StorageUtil.parseString(xhrk.responseText);
        console.log("about to loop through requested information"); 
		if (resp.requested_information && resp.requested_information.length){
			
			localkanjiList = resp.requested_information.map(function(requestedTask){
				if (requestedItem === "kanji"){
					if (requestedTask.user_specific !== null){
						return {
							character: requestedTask.character,
							srs: requestedTask.user_specific.srs,
							reading: requestedTask[requestedTask.important_reading].split(",")[0],
							meaning: requestedTask.meaning.split(",")[0]
						};
					}
					else{
						return {
							character: requestedTask.character,
							srs: "unreached"
						};
					}
				}
				else if(requestedItem === "vocabulary"){
					if (requestedTask.user_specific !== null||true){ //--
						//build vocablist
						return {
							kanji: requestedTask.character,
							reading: requestedTask.kana.split(","),
							meaning: requestedTask.meaning.split(",")
						};
					}
				}
			}, this);
		}
        //return kanjiList
        //  console.log("Server responded with new kanjiList: \n"+JSON.stringify(kanjiList));
        return localkanjiList;
    }

};

module.exports = WanikaniUtil;
},{"./hijackrequests.js":5,"./objectutil.js":8,"./serverutil.js":11,"./setreviewsutil.js":12,"./storageutil.js":14}],19:[function(require,module,exports){
// Window Configs
module.exports = {
	add:{height: "300px", width: "300px"},
	exportImport:{height: "275px", width: "390px"},
	edit:{height: "380px", width: "800px"},
	study:{height: "auto", width: "600px"}, //height : auto
	result:{height: "500px", width: "700px"}
};
},{}],20:[function(require,module,exports){
var windowObjects = {
	user: {
		id: "WKSS-user",
		className: "WKSS",
		childNodes: [{tag: 'form',
			id: "userForm",
			childNodes: [{ tag: 'button',
				id: "UserCloseBtn",
				className: "wkss-close",
				other: {type: "reset"},
				childNodes: [{tag: 'i', 
					className: "icon-remove"
				}]
			},
			{ tag:'h1',
				childNodes: ["User Settings"]
			},
			{ tag: 'input', 
				id: "userApi", 
				other: {type: "text", placeholder: "Enter API Key"}
			},
			{ tag: 'p',
				childNodes:[
					{ tag: 'b',
						childNodes: ["Username: "]
					},
					{ tag: 'span',
						id: "WKSS-username",
					}
				]
			},
			{ tag: 'button',
				id: "AutofillUserBtn",
				other: {type: "button", title: "Use the details of the current login"},
				childNodes: ["Autofill"]
			},
			{ tag: 'button',
				id: "saveUserBtn",
				other: {type: "button"},
				childNodes: ["Save User Details"]
			}]
		}]
	},
	addVocab: {
		id: "WKSS-add",
		className: "WKSS",
		childNodes: [{tag: 'form',
			id: "addForm",
			childNodes: [{ tag: 'button',
				id: "AddCloseBtn",
				className: "wkss-close",
				other: {type: "reset"},
				childNodes: [{tag: 'i', 
					className: "icon-remove"
				}]
			},
			{ tag:'h1',
				childNodes: ["Add a new Item"]
			},
			{ tag: 'input', 
				id: "addKanji", 
				other: {
				    'data-lpignore': true,
				    type: "text", placeholder: "Enter 漢字, ひらがな or カタカナ"
				}
			},
			{ tag: 'input',
				id: "addReading",
				other: {type: "text", title: "Leave empty to add vocabulary like する (to do)", placeholder: "Enter reading"}
			},
			{ tag: 'input',
				id: "addMeaning",
				other: {type: "text", placeholder: "Enter meaning"}
			},
			{ tag: 'p',
				id: "addStatus",
				childNodes: ["Ready to add..."]
			},
			{ tag: 'button',
				id: "AddItemBtn",
				other: {type: "button"},
				childNodes: ["Add new Item"]
			}]
		}]
	},
	editTask: {
		id: "WKSS-edit",
		className: "WKSS",
		childNodes:[{
			tag: 'form',
			id: "WKSS-editForm",
			childNodes:[{
				tag: 'button',
				id: "WKSS-editCloseBtn",
				className: "wkss-close",
				other: {type: "reset"},
				childNodes:[{
					tag: 'i',
					className: "icon-remove"
				}]
			},
			{
				tag: 'h1',
				childNodes:["Edit your Vocab"]
			},
			{
				tag: 'select',
				id: "editWindow",
				other: {size: "8"}
			},
			{
				tag: 'input', 
				other:{
					type: "text",
					name: "",
					size: "40",
					'data-lpignore': true,
					placeholder: "Select vocab, click edit, change and save!"
				},
				id: "editItem"
			},
			{
				tag: 'p', 
				id: "WKSS-editStatus",
				childNodes:["Ready to edit..."]
			},
			{
				tag: 'button',
				id: "EditEditBtn",
				other: {type: "button"},
				childNodes:["Edit"]
			},
			{
				tag: 'button',
				id: "EditSaveBtn",
				other:{type: "button"},
				childNodes:["Save"]
			},{
				tag: 'button',
				id: "EditDeleteBtn",
				other: {type: "button", title: "Delete selected item"},
				childNodes:["Delete"]
			},{
				tag: 'button',
				id: "EditDeleteAllBtn",
				other: {type: "button", title: "本当にやるの？"},
				childNodes:["Delete All"]
			},{
				tag: 'button',
				id: "ResetLevelsBtn",
				other: {type: "button"},
				childNodes:["Reset levels"]
			}]
		}]
	},
	export: {
		id: "WKSS-export",
		className: "WKSS",
		childNodes:[{
			tag: 'form',
			id: "WKSS-exportForm",
			childNodes:[
				{ tag: 'button',
					id: "WKSS-exportCloseBtn",
					className: "wkss-close",
					childNodes:[{
						tag: 'i',
						className: "icon-remove"
					}]
				},
				{
					tag: 'h1',
					childNodes:["Export Items"]
				},
				{
					tag: 'textarea',
					id: "exportArea",
					other: {cols: "50", rows: "18", placeholder: "Export your stuff! Sharing is caring ;)"}
				},
				{
					tag: 'p', 
					id: "exportStatus",
					childNodes:["Ready to export..."]
				},
				{
					tag: 'button',
					id: "ExportItemsBtn",
					other: {type: "button"},
					childNodes:["Export Items"]
				},
				{
					tag: 'button',
					id: "ExportSelectAllBtn",
					other:{type: "button"},
					childNodes:["Select All"]
				},
				{
					tag: 'button',
					id: "ExportCsvBtn",
					other: {type: "button"},
					childNodes:["Export CSV"]
				}
			]
		}]
	},
	import: {
		id: "WKSS-import",
		className: "WKSS",
		childNodes:[{
			tag: 'form',
			id: "WKSS-importForm",
			childNodes:[
				{
					tag: 'button',
					id: "WKSS-importCloseBtn",
					className: "wkss-close",
					childNodes:[{
						tag: 'i',
						className: "icon-remove"
					}]
				},
				{
					tag: 'h1',
					childNodes:["Import Items"]
				},
				{
					tag: 'textarea',
					id: "importArea",
					other: {cols: "50", rows: "18", placeholder: "Paste your stuff and hit the import button! Use with caution!"}
				},
				{
					tag: 'p', 
					id: "importStatus",
					childNodes:["Ready to import..."]
				},
				{
					tag: 'label',
					id: "ImportItemsBtn",
					className: "button",
					other: {type: "button", style: "display:inline;"},
					childNodes:["Import Items"]
				},
				{
					tag: 'label',
					id: "ImportCsvBtn",
					className: "button",
					other: {style:"display:inline; cursor: pointer;"},
					childNodes:["Import CSV",
						{
							tag: 'input',
							id: "upload",
							other: {
								type: "file", accept: ".csv, .tsv",
								style: "height:0px;width:0px;background:red;opacity:0;filter:opacity(1);"
							}
						}
					]
				},
				{
					tag: 'label',
					id: "ImportWKBtn",
					className: "button",
					other: {style: "display:inline;"},
					childNodes:[
						{
							tag:'i',
							className: "icon-download-alt"
						},
						"WK"
					]
				}
			]
		}]
	},
	review: {
		id: "WKSS-selfstudy",
		className: "WKSS",
		childNodes:[{tag: 'form',
			id: "selfStudyForm",
			childNodes: [{ tag: 'button',
				id: "WKSS-SelfstudyCloseBtn",
				className: "wkss-close",
			childNodes:[{
					tag: 'i',
					className: "icon-remove"
				}]
			},
			{ tag: 'h1',
				childNodes:["Review",
					{ tag: 'span',
						id: "RevNum"
					}
				]
			},
			{ tag: 'div',
				id: "wkss-kanji",
				childNodes:[
					{ tag: 'span',
						id: "rev-kanji"
					}
				]
			},
			{ tag: 'div',
				id: "wkss-type",
				childNodes:[
					{ tag: 'span',
						id: "rev-type"
					}
				]
			},
			{ tag: 'div',
				id: "wkss-solution",
				childNodes:[
					{ tag: 'span',
						id: "rev-solution"
					}
				]
			},
			{ tag: 'input',
				id: "rev-input",
				other: {type: "text"},
				eventListeners: {
					keypress: function(evt){
						console.log(evt);
						if (evt.keyCode === 13){
							evt.preventDefault();
						}
					}
				}
			},
			{ tag: 'span',
				id: "rev-index",
				other: { style: "display: block;"}
			},
			{ tag: 'form',
				id: "audio-form",
				childNodes: [
					{ tag: 'label',
						id: "AudioButton",
						className: "button",
						other: {type: "button", style: "display:inline;"},
						childNodes:["Play Audio"]
					},
					{ tag: 'label',
						id: "WrapUpBtn",
						className: "button",
						other: {style:"display:inline; cursor: pointer;"},
						childNodes:["Wrap Up"]
					}
				]
			},
			{ tag: 'div',
				id: "rev-audio",
				other: {style: "display: none;"}
			}]
		}]
	},
	results: {
		id: "WKSS-resultwindow",
		className: "WKSS",
		childNodes: [
			{ tag: 'button',
				id: "WKSS-ReviewresultsCloseBtn",
				className: "wkss-close",
			childNodes:[{
					tag: 'i',
					className: "icon-remove"
				}]
			},
			{ tag: 'h1',
				childNodes:["Review Results"]
			},
			{ tag: 'h2',
				childNodes:["All"]
			},
			{ tag: 'div',
				id: "stats-a"
			}
		]
	}
};

module.exports = windowObjects;
},{}],21:[function(require,module,exports){
/* jshint multistr: true */
// Config for window sizes in pixels
var windowConfig = require('./windowconfig.js');

var StringUtil = {
	
	isUpperCase: function(ch){
		return ch === ch.toUpperCase() && ch !== ch.toLowerCase();
	},

	camelCaseToDashed: function(camelCase){
		var dashedString = "";
		for (var ch in camelCase){
			dashedString += this.isUpperCase(camelCase[ch]) ? "-"+camelCase[ch].toLowerCase() : camelCase[ch];
		}
		return dashedString;
	}
};

var cssObjectToString = function(cssSelector, cssObj){
	var cssString = cssSelector + " {\r\n";
	for (var cssItem in cssObj){
		cssString += StringUtil.camelCaseToDashed(cssItem) + ": " + cssObj[cssItem] + ";\r\n";
	}
	cssString += "}\r\n";
	return cssString;
};

var classWKSS = cssObjectToString('.custom .dropdown-menu', {backgroundColor: "#DBA901 !important"}) +
cssObjectToString('.custom .dropdown-menu:after', {borderBottomColor: "#DBA901 !important"}) +
cssObjectToString('.custom .dropdown-menu:before', {borderBottomColor: "#DBA901 !important"}) +
cssObjectToString('.open .dropdown-toggle.custom', {backgroundColor: "#FFC400 !important"}) +
cssObjectToString('.custom .dropdown-menu a:hover', {backgroundColor: "#A67F00 !important"}) +
cssObjectToString('.custom:hover', {color: "#FFC400 !important"}) +
cssObjectToString('.custom:hover span', {borderColor: "#FFC400 !important"}) +
cssObjectToString('.custom:focus', {color: "#FFC400 !important"}) +
cssObjectToString('.custom:focus span', {borderColor: "#FFC400 !important"}) +
cssObjectToString('.open .custom span', {borderColor: "#FFFFFF !important"}) +
cssObjectToString('.open .custom', {color: "#FFFFFF !important"}) +
cssObjectToString('.WKSS', {
	position: "fixed",
	zIndex: "2",
	top: "125px",
	left: "50%",
	margin: "0px",
	background: "#FFF",
	padding: "5px",
	font: "12px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif",
	color: "#888",
	textShadow: "1px 1px 1px #FFF",
	border: "1px solid #DDD",
	borderRadius: "5px",
	WebkitBorderRadius: "5px",
	MozBorderRadius: "5px",
	boxShadow: "10px 10px 5px #888888"
}) + 
cssObjectToString('.WKSS h1', {//.WKSS h1
	font: "25px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif",
	paddingLeft: "5px",
	display: "block",
	borderBottom: "1px solid #DADADA",
	margin: "0px",
	color: "#888"
}) + 
cssObjectToString('.WKSS h1 > span', {//.WKSS h1 > span
	display: "block",
	fontSize: "11px"
}) +
cssObjectToString('.WKSS label', {//.WKSS label
	display: "block",
	margin: "0px 0px 5px"
}) +
cssObjectToString('.WKSS label>span', {//.WKSS label>span
	float: "left",
	width: "80px",
	textAlign: "right",
	paddingRight: "10px",
	marginTop: "10px",
	color: "#333",
	fontFamily: "\"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif",
	fontWeight: "bold"
}) +
cssObjectToString('.WKSS input[type=\"text\"], .WKSS input[type=\"email\"], .WKSS textarea', {//.WKSS input[type=\"text\"], .WKSS input[type=\"email\"], .WKSS textarea 
	border: "1px solid #CCC",
	color: "#888",
	height: "20px",
	marginBottom: "16px",
	marginRight: "6px",
	marginTop: "2px",
	outline: "0 none",
	padding: "6px 12px",
	width: "80%",
	borderRadius: "4px",
	lineHeight: "normal !important",
	WebkitBorderRadius: "4px",
	MozBorderRadius: "4px",
	font: "normal 14px/14px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif",
	WebkitBoxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
	boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
	MozBoxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)"
}) +
cssObjectToString('.WKSS select', {//.WKSS select
	border: "1px solid \"#CCC\"",
	color: "#888",
	outline: "0 none",
	padding: "6px 12px",
	height: "160px !important",
	width: "95%",
	borderRadius: "4px",
	WebkitBorderRadius: "4px",
	MozBorderRadius: "4px",
	font: "normal 14px/14px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif",
	WebkitBoxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
	boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
	MozBoxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
	background: "#FFF url('down-arrow.png') no-repeat right",
	appearance: "none",
	WebkitAppearance: "none",
	MozAppearance: "none",
	textIndent: "0.01px",
	textOverflow: "''"
}) +
//.WKSS textarea
cssObjectToString('.WKSS textarea', {height: "100px"}) +
cssObjectToString('.WKSS button, .button',{//.WKSS button, .button
	position: "relative",
	background: "#FFF",
	border: "1px solid #CCC",
	padding: "10px 25px 10px 25px",
	color: "#333",
	borderRadius: "4px",
	display: "inline !important"
}) +
cssObjectToString('.WKSS button:disabled', {//.WKSS button:disabled
	background: "#EBEBEB",
	border: "1px solid #CCC",
	padding: "10px 25px 10px 25px",
	color: "#333",
	borderRadius: "4px"
}) +
cssObjectToString('.WKSS .button:hover, button:hover:enabled', {//.WKSS .button:hover, button:hover:enabled
	color: "#333",
	backgroundColor: "#EBEBEB",
	borderColor: "#ADADAD"
}) +
//.WKSS button:hover:disabled
cssObjectToString('.WKSS button:hover:disabled', {cursor: "default"}) +
cssObjectToString('.error', {//.error
	borderColor:"#F00 !important",
	color: "#F00 !important"
}) +
cssObjectToString('.caution', {//.caution
	borderColor: "#F90 !important",
	color: "#F90 !important"
}) +
cssObjectToString('.correct', {//.correct
	borderColor: "#0F0 !important",
	color: "#0F0 !important"
}) +
cssObjectToString('.info', {
	borderColor: "#696969 !important",
	color: "#696969 !important"
}) +
cssObjectToString('.rev-error', {
	textShadow: "none",
	border: "1px solid #F00 !important",
	borderRadius: "10px",
	backgroundColor: "#F00",
	padding: "4px",
	margin: "4px",
	color: "#FFFFFF",
	font: "normal 18px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif"
}) +
cssObjectToString('.rev-correct', {
	textShadow:"none",
	border: "1px",
	solid: "#088A08 !important",
	borderRadius: "10px",
	backgroundColor: "#088A08",
	padding: "4px",
	margin:"4px",
	color: "#FFFFFF",
	font: "normal 18px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif"
}) +
cssObjectToString('#WKSS-add', {
	width: windowConfig.add.width,
	height: windowConfig.add.height,
	marginLeft: -windowConfig.add.width/2
}) +
cssObjectToString('#WKSS-export, #WKSS-import', {
	background: "#fff",
	width: windowConfig.exportImport.width,
	height: windowConfig.exportImport.height,
	marginLeft: -windowConfig.exportImport.width/2
}) +
cssObjectToString('#edit', {
	width: windowConfig.edit.width,
	height: windowConfig.edit.height,
	marginLeft: -windowConfig.edit.width/2
}) +
cssObjectToString('#selfstudy', {
	left: "50%",
	width: windowConfig.study.width,
	height: windowConfig.study.height,
	marginLeft: -windowConfig.study.width/2
}) +
cssObjectToString('#resultwindow', {
	left:"50%",
	width: windowConfig.result.width + "px",
	height: windowConfig.result.height + "px",
	marginLeft: -windowConfig.result.width/2 + "px"
}) +
cssObjectToString('#AudioButton', {
	marginTop: "35px",
	position: "relative",
	display: "inline !important",
	WebkitMarginBefore: "50px"
}) +
cssObjectToString('button.wkss-close', {
	float: "right",
	backgroundColor: "#ff4040",
	color: "#fff",
	padding: "0px",
	height: "27px",
	width: "27px"
}) +
cssObjectToString('#wkss-close', {
	float: "right",
	backgroundColor: "#ff4040",
	color: "#fff",
	padding: "0px",
	height: "27px",
	width: "27px"
}) +
cssObjectToString('#wkss-kanji, #rev-kanji', {
	textAlign: "center !important",
	fontSize: "50px !important",
	backgroundColor: "#9400D3 !important",
	color: "#FFFFFF !important",
	borderRadius: "10px 10px 0px 0px"
}) +
cssObjectToString('#wkss-solution, #rev-solution', {
	textAlign: "center !important",
	fontSize: "30px !important",
	color: "#FFFFFF",
	padding: "2px"
}) +
cssObjectToString('#wkss-type', {
	textAlign: "center !important",
	fontSize: "24px !important",
	backgroundColor: "#696969",
	color: "#FFFFFF !important",
	borderRadius: "0px 0px 10px 10px"
}) +
cssObjectToString('#rev-type', {
	textAlign: "center !important",
	fontSize: "24px !important",
	color: "#FFFFFF !important",
	borderRadius: "0px 0px 10px 10px"
}) +
cssObjectToString('#wkss-input', {
	textAlign: "center !important",
	fontSize: "40px !important",
	height: "80px !important",
	lineHeight: "normal !important"
}) +
cssObjectToString('#rev-input', {
	textAlign: "center !important",
	fontSize: "40px !important",
	height: "60px !important",
	lineHeight: "normal !important"
});
//----
module.exports = classWKSS;
//module.exports = wkstyleCSS;
},{"./windowconfig.js":19}]},{},[15]);
