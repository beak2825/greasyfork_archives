// ==UserScript==
// @name         Kissanime Anti-Captcha
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically solves captchas on Kissanime.ru
// @author       You
// @match        http://kissanime.ru/Special/AreYouHuman*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/36720/Kissanime%20Anti-Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/36720/Kissanime%20Anti-Captcha.meta.js
// ==/UserScript==

(function() {


	function imgToStr(img) {
		canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		context = canvas.getContext('2d'); //a context is something that will let me actually draw to the canvas, 2d is for images and stuff
		context.drawImage(img, 0, 0, img.width, img.height); //draw the image on the canvas, FOR SOME REASON IF I DONT SPECIFY EXACTLY HOW TALL AND WIDE THEN IT'LL DRAW AN IMAGE THATS TOO BIG OR TOO SMALL
		return canvas.toDataURL("image/png"); //converts img to string which is the png data for the image, to run toDataUrl the img src needs to be not cross origin for whatever reason
	}
	function strToImg(imgStr) {
		var img = document.createElement('img');
		img.src = imgStr;
		return img;
	}

	function wordSpansToStrs(words) {
		trueWords = [];
		for (var i = 0; i < 2; i++) { //get words from spans
			text = words[i].innerText; //get the inner text of the word spans
			texts = text.split(', '); //split the 2 words apart
			trueWords.push(texts);
		}
		return trueWords;
	}

	function setImgOnclicks(images) {
		for (var i = 0; i < images.length; i++) { //set event listener on every image
			images[i].addEventListener('click', imgClicked);
		}
	}
	function imgClicked() { //when a captcha image is clicked
		imgStr = imgToStr(this); //convert the image that called this function to a string
		console.log("Words already on this image: ", GM_getValue(imgStr));
		if (!autoSolves[currentWords]) { //if a person clicked on the captcha image
			console.log("HUMAN CLICK");
			solves.push([imgStr, trueWords[currentWords]]); //add the word/img combo to the solves
			GM_setValue("currentKissanimeSolves", solves); //DO THIS EVERY TIME AN IMAGE IS CLICKED BECAUSE SOMETIMES ONE OF THE 2 WILL BE AUTO SOLVED SO THERE WILL ONLY BE 1 SOLVE, save the solves so that when the next page loads we can check if the solves are good
		}
		console.log("Found Solves: ", solves);
		currentWords++; //go to the next pair of words
		this.hidden = true; //hide this image so it can't be unclicked or reclicked
		words[1].hidden = false; //unhide the 2nd pair of words
		if (autoSolves[currentWords]) { //if the next pair of words are solvable, USING CURRENTWORDS INSTEAD OF JUST OR ELSE WHEN I AUTOCLICK THE 2ND SOLVE IT'LL AUTOCLICK THE 2ND SOLVE REPEADITLY FOREVER, SINCE CURRENTWORDS KEEPS INCREASING EVERY TIME I CLICK AN IMAGE THEN AFTER THE 2ND ONE IT'LL CHECK IF THERES A 3RD ELEMENT IN THE autosolve ARRAY WHICH WILL COME BACK undefined
			autoSolves[currentWords].click(); //click the next image
		}
	}

	function saveSolves() { //fired when captcha page is visited agian
		solved = GM_getValue("currentKissanimeSolves");
		allImgs = GM_getValue("kissanimeAllSolvedImgs");
		if (solved) { //if solved isn't empty
			console.log("Now Saving: ", solved);
			for (s = 0; s < solved.length; s++) { //for every solve
				imgStr = solved[s][0];
				newWords = solved[s][1];
				if (allImgs.indexOf(imgStr) != -1) { //if this img has solves on it
					allWords = GM_getValue(imgStr);
					for (w = 0; w < newWords.length; w++) { //go through the 2 new words
						newWord = newWords[w];
						if (allWords.indexOf(newWord) == -1) { //HAVE TO CHECK IF THE WORD'S ALREADY IN THERE CAUSE IF ONE SOLVE IS "emoticon, beer" AND THE NEXT SOLVE IS "emoticon, drink" THEN IT'LL ADD THE WORD emoticon TO THE IMAGE'S WORDS TWICE!
							allWords.push(newWord); //if its a new word, add it
						}
					}
					GM_setValue(imgStr, allWords);
				} else { //if the captcha does not have any words assosiated with it
					allImgs.push(imgStr);
					GM_setValue("kissanimeAllSolvedImgs", allImgs); //first add the imgStr to the list of all solved images
					GM_setValue(imgStr, newWords); //then create the list of words specifically for the image
				}
			}
		}
	}
	function dumpSolves() { //sets solves to undefined
		solved = GM_getValue("currentKissanimeSolves");
		console.log("Dumping: ", solved);
		GM_setValue("currentKissanimeSolves", false); //reset the current solves, CANT SET THIS TO undefined CAUSE IF I TRY IT SETS IT TO THE STRING "undefined"
	}

	function printAllImgs() {
		allImgs = GM_getValue("kissanimeAllSolvedImgs"); 
		console.log(allImgs);
	}
	function makeDisplayAllSolvesButton() {
		document.body.appendChild(document.createElement('p')); //just for some indentation
		a = document.createElement('a');
		a.innerText = "Click here to display the entire database of solves";
		a.onclick = displayAllSolves;
		a.style = "color:blue; text-decoration:underline;";
		a.id = "databaseOpener";
		document.body.appendChild(a);
	}
	function displayAllSolves() {
		document.body.removeChild(document.getElementById("databaseOpener"));
		allImgs = GM_getValue("kissanimeAllSolvedImgs");
		numOfImgs = allImgs.length;
		for (s = 0; s < numOfImgs; s++) {
			imgStr = allImgs[s];
			var img = strToImg(imgStr);
			document.body.appendChild(img);
			imgWords = GM_getValue(imgStr);
			var p = document.createElement('p');
			innerText = imgWords.join(', '); //jus' like thon but not
			p.innerText = innerText;
			document.body.appendChild(p);
		}
	}
	function displayRecentAutoSolves() {
		latestAutoSolvesBoxDescGen(); //describes the box of auto solves
		console.log("displaying recent auto solves");
		latestAutos = GM_getValue("kissanimeRecentAutoSolves");
		console.log(latestAutos);
		displayBox = document.createElement('div'); //the big box that'll hold everything
		displayBox.style = "border-style: solid; border-color: #000000;"; //give it a border
		numOfAutos = latestAutos.length;
		for (a = 0; a < numOfAutos; a++) { //for all the most recent auto solves
			imgBox = document.createElement('div'); //make a div to put the img and its words in
			imgBox.style = "display:inline-block; margin-top:20px; margin-left:20px; margin-right:20px; margin-bottom:20px"; //so that the next div will go right beside it and theres enough space to look nice
			imgStr = latestAutos[a][0];
			img = strToImg(imgStr); //convert the string to an img
			console.log(img);
			imgBox.appendChild(img); //put the img in the div
			solveWords = latestAutos[a][1];
			for (w = 0; w < solveWords.length; w++) { //for each of the solve words on the image
				p = document.createElement('p'); //make their own element
				p.style = 'text-align: center; margin-top:2px; margin-bottom: 2px;'; //center the paragraph in the div and make sure theres not too much space between words
				p.innerText = solveWords[w]; //put the word in the element
				p.addEventListener('click', removeParagraphSolve); //make it so clicking on the word removes it from solves
				imgBox.appendChild(p); //put the word in the same box as its img
			}
			displayBox.appendChild(imgBox); //put the box in the big box
		}
		document.body.appendChild(displayBox); //add the big box to the DOM
	}
	function removeParagraphSolve() { //function called by a paragraph containing a word that describes an image that's in the same div as the paragraph
		wordBeingRemoved = this.innerText;
		confirmation = confirm("are you sure you'd like to remove " + wordBeingRemoved + " from the image's list of words?");
		if (confirmation) {
			img = this.parentNode.getElementsByTagName('img')[0]; //get the only image in the save div as the text
			imgStr = imgToStr(img);
			allImgWords = GM_getValue(imgStr);
			index = allImgWords.indexOf(wordBeingRemoved);
			if (index != -1) {
				allImgWords.pop(); //take the word out of the list of all assosiated words
				GM_setValue(imgStr, allImgWords);
			} else {
				alert(wordBeingRemoved + " could not be removed because it's not associated with the image. Maybe you already removed it? (to see all the words associated with the image, see the full database below)");
			}
			console.log("all words left on image: ", GM_getValue(imgStr));
		}
	}
	function latestAutoSolvesBoxDescGen() {
		p = document.createElement('p');
		p.innerText = "Below in the black box are the latest automatic solves. If any of the phrases describing the image are incorrect then click on the phrase to remove it from the above image's list of associated phrases.";
		document.body.appendChild(p);
	}

	function deleteFromDatabase(imgStr) { //removes an image and all its solves from the database
		GM_deleteValue(imgStr); //first remove all solve words on the imgStr
		allImgs = GM_getValue("kissanimeAllSolvedImgs"); //then remove the imgStr from the list of all solves
		index = allImgs.indexOf(imgStr);
		allImgs.pop(index);
		GM_setValue("kissanimeAllSolvedImgs", allImgs);
	}
	function removeDuplicateWords() {
		allImgs = GM_getValue("kissanimeAllSolvedImgs");
		len = allImgs.length;
		for (var i = 0; i < len; i++) {
			imgStr = allImgs[i];
			allImgWords = GM_getValue(imgStr);
			newAllImgWords = [];
			numOfWords = allImgWords.length;
			for (w = 0; w < numOfWords; w++) {
				currentWord = allImgWords[w];
				if (allImgWords.indexOf(currentWord) == w) {
					newAllImgWords.push(currentWord);
				}
			}
			GM_setValue(imgStr, newAllImgWords);
		}
	}

	function getImgSolves(images, wordStrs) {
		allImgs = GM_getValue("kissanimeAllSolvedImgs");
		autoSolves = [null, null];
		for (wordPair = 0; wordPair < 2; wordPair++) { //for each pair of words
			for (i = 0; i < images.length; i++) { //for every captcha image
				image = images[i];
				str = imgToStr(image); //convert the image to a string
				if (allImgs.indexOf(str) != -1) { //if there are solves available for the image
					imgWords = GM_getValue(str); //get the solve words
					captchaWords = wordStrs[wordPair]; //the 2 words that must be matched to an image
					pass = true; 
					for (w = 0; w < captchaWords.length; w++) { //for each captcha word (2)
						if (imgWords.indexOf(captchaWords[w]) == -1) { //if this image can't be described by a captcha word, it fails
							pass = false;
						}
					}
					if (pass) { //if the image and captcha words match
						autoSolves[wordPair] = image;
						break; //move on to the next pair of captcha words
					}
				}
			}
		}
		autosWithWords = []; //this is the array im gonna save to use to display the autosolves on the error page
		for (s = 0; s < 2; s++) { //autoSolves will always be 2 long
			if (autoSolves[s]) { //NEED TO MAKE SURE IM NOT TRYING TO CONVERT null TO A STR USING imgToStr
				autosWithWords.push([imgToStr(autoSolves[s]), wordStrs[s]]);
			}
		}
		GM_setValue("kissanimeRecentAutoSolves", autosWithWords); //set this here so I can display the autosolves on the error page
		console.log("Autosolves: ", autoSolves);
		return autoSolves;
	}


	url = window.location.href;

	if (url == "http://kissanime.ru/Special/AreYouHuman2") { //if the recent solves were trash
		dumpSolves(); //just dump the solves
		printAllImgs();
		displayRecentAutoSolves();
		makeDisplayAllSolvesButton();
	}

	else { //if the captcha page is being loaded
		captchaZone = document.getElementsByClassName('barContent')[0]; //class containing the part of the page with the captchas
		words = captchaZone.getElementsByTagName('span'); //contains the spans that contain the words, the only spans in the captchaZone are the descriptive words you have to fufill
		trueWords = wordSpansToStrs(words); //gets the strings from the spans, should contain 2 arrays of 2 strings
		words[1].hidden = true; //REMEMBER THAT WHILE HIDDEN THE INNER TEXT OF A WORD IS COMPLETELY HECKED, hides the 2nd pair of words so that the user clicks on an image matching the first pair
		images = captchaZone.getElementsByTagName('img'); //gets all images in the captchaZone
		currentWords = 0; //keeps track of which pair of words we're on 

		saveSolves(); //save the previous solves (if they were good/existed)
		dumpSolves(); //then dump the solves

		autoSolves = getImgSolves(images, trueWords);
		solves = []; //create new global array to hold the new solves until I can confirm they're both good solves
		setImgOnclicks(images); //set the onclicks
		if (autoSolves[0]) { //if the first captcha can be autoSolved
			autoSolves[0].click();
		}
	}


})();
