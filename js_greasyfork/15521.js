// ==UserScript==
// @name            Google Block Words
// @version         1.1
// @description     Block words from Google Search
// @author          Drazen Bjelovuk
// @include         *://*.google.tld/*
// @grant           none
// @noframes
// @namespace       https://greasyfork.org/users/11679
// @contributionURL https://goo.gl/dYIygm
// @downloadURL https://update.greasyfork.org/scripts/15521/Google%20Block%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/15521/Google%20Block%20Words.meta.js
// ==/UserScript==

var bwWindow, keywords;

var oldSubmit = document.getElementById('tsf').onsubmit;
document.getElementById('tsf').onsubmit = function() {
	var keywords = JSON.parse(localStorage.getItem('blockedWords'));
	if (keywords) {
		var blockString = ' ';
		for (var i = 0; i < keywords.length; i++)
			blockString += '-"' + keywords[i] + '" ';
		document.getElementById('lst-ib').value += blockString;
	}
	oldSubmit();
};

// Create and add window
bwWindow = document.createElement('div');
bwWindow.id = 'bwWindow';
bwWindow.setAttribute('style', 'display:none; position:fixed; left:50%; top:70px; width:400px; max-height:400px; overflow-y:auto; overflow-x:hidden; margin-left:-200px; text-align:center; background-color:white; z-index:99999; border:solid 1px; padding-bottom:30px');

var innerHTML = '<h2 style="margin-bottom:25px">Blocked Words</h2>';
keywords = JSON.parse(localStorage.getItem('blockedWords'));
if (keywords) {
	for (var i = 0; i < keywords.length; i++)
		innerHTML += '<div style="margin-bottom:5px"><input type="text" style="width:250px; margin-right:10px" value="'+keywords[i]+'" disabled><button class="removeButton" data-index="'+i+'" style="width:65px">Remove</button></div>';
}
innerHTML += '<div><input id="addWord" type="text" style="width:250px; margin-right:10px"><button id="addButton" style="width:65px">Add</button></div>';
bwWindow.innerHTML = innerHTML;
bwWindow.onclick = function(event) { event.stopPropagation(); };
document.body.appendChild(bwWindow);

document.addEventListener('click', function() {
	bwWindow.style.display = 'none';
});

// Create and add buttons for opening window
if (window.location.href.indexOf('search') > -1) {
    if (keywords) {
        var srchBox = document.getElementById('lst-ib');
        var blockedIndex = srchBox.value.indexOf('-"'+keywords[0]);
        if (blockedIndex > -1)
            srchBox.value = srchBox.value.slice(0, blockedIndex - 1);
    }
    
    var keywordBtn = document.createElement('a');
    keywordBtn.className = 'ab_button';
    keywordBtn.textContent = 'Blocked Words';
    keywordBtn.setAttribute('style', 'position:absolute; right:-140px; bottom:0; cursor:pointer; text-decoration:none; padding: 7px 17px;');
    keywordBtn.addEventListener('click', openBWWindow);
    document.getElementById('tsf').appendChild(keywordBtn);
}
else {
    var keywordBtn = document.createElement('input');
    keywordBtn.id = 'homeBWButton';
    keywordBtn.type = 'button';
    keywordBtn.className = 'gbqfba';
    keywordBtn.value = 'Blocked Words';
    
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = "#homeBWButton       { color:#757575 !important; height:36px; font-size:13px; padding:0 16px; border:1px solid #f2f2f2; } " +
                    "#homeBWButton:hover { color:#222 !important; border:1px solid #c6c6c6 } " +
                    "#homeBWButton:focus { border:1px solid #4d90fe };";
    document.head.appendChild(css);
    
    keywordBtn.addEventListener('click', openBWWindow);
    document.getElementsByClassName('jsb')[0].firstChild.appendChild(keywordBtn);
}

// Events
bwWindow.addEventListener('click', function(event) {
    if (event.target.id === 'addButton')
        addBW(event.target);
    else if (event.target.className === 'removeButton')
        removeBW(event.target);
});

bwWindow.addEventListener('keyup', function(event) {
    if (event.keyCode === 13 && event.target.id === 'addWord')
        document.getElementById('addButton').click();
});

function addBW(addButton) {
	var addInput = document.getElementById('addWord');
	if (addInput.value) {
		keywords = JSON.parse(localStorage.getItem('blockedWords'));
		if (keywords)
			keywords.push(addInput.value);
		else
			keywords = [addInput.value];
		localStorage.setItem('blockedWords', JSON.stringify(keywords));
		var newItem = document.createElement('div');
		newItem.style.marginBottom = '5px';
		newItem.innerHTML = '<input type="text" style="width:250px; margin-right:10px" value="'+ addInput.value +'" disabled><button class="removeButton" data-index="'+ (keywords.length - 1) +'" style="width:65px">Remove</button>';
		bwWindow.insertBefore(newItem, addButton.parentNode);
		addInput.value = "";
	}
}

function removeBW(removeButton) {
	keywords = JSON.parse(localStorage.getItem('blockedWords'));
	var currIndex = removeButton.dataset.index;
	keywords.splice(currIndex, 1);
	
	var nextSibling = removeButton.parentNode.nextSibling;
	while (nextSibling) {
		nextSibling.childNodes[1].dataset.index = currIndex;
		nextSibling = nextSibling.nextSibling;
		currIndex++;
	}
	localStorage.setItem('blockedWords', JSON.stringify(keywords));
	removeButton.parentNode.remove();
}

function openBWWindow(event) {
	event.stopPropagation();
	bwWindow.style.display = 'block';
}