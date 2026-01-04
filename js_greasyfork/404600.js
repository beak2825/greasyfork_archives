//My_General_Utils.js

//Takes strings of html elements and appendeds it to the selector
function createElements(elements, selector) {
    log("createElements Enter", true);
    //append element to selector
    $(selector).append(elements);
}

//waits for a jQuery element to exist then runs callback function
//syntax waitForElement(jQuery selector, function onec element exists, timout in milliseconds)
function waitForElement(selector, callback, ms) {
	if(ms == null){
		var ms = 100;
	}
    log("waitForElement Enter", true);
    if ($(selector).length) {
        callback(selector);
    } else {
        setTimeout(function () {
            waitForElement(selector, callback);
        }, ms);
    }
}

//Feed class string for html elemnt, returns array of all matching elements
function arryElements(element) {
    //log("arryElements Enter", true);
    //Create an array of all (...) settings buttons
    var elemCount = $(element).length;
    var elemArr = new Array(elemCount);
    elemArr = $(element).each($).toArray();

    return elemArr;
}

// Returns a promise which resolves after x amount of ms. Allows pausing on a line.
function sleep(ms) {
    // A promise is returned. When used in an async function with the await keyword, will wait the x amount of milliseconds to resolve and then continue
    return new Promise(resolve => setTimeout(resolve, ms));
}
