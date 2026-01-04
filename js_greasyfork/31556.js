// ==UserScript==
// @name        Flashback TrackIgnore
// @namespace   flashbacktrackignore
// @author      Innesko
// @description Script to ignore and keep track of users, more or less
// @include     *www.flashback.org/*
// @version     0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/31556/Flashback%20TrackIgnore.user.js
// @updateURL https://update.greasyfork.org/scripts/31556/Flashback%20TrackIgnore.meta.js
// ==/UserScript==

// This script helps you to keep track and ignore users on the Flashback forum,
// with a user friendly interface
// There are currently five things you can do:
// 1. Add a note
//    You can add a custom note for a specific user
// 2. Custom color
//    Customize the background color of the username. It's up to you
//    what the colors should mean
// 3. Hide/show the avatar picture
// 4. Hide/show text of user
//    If you want to see that a user has posted,
//    but don't want to read the provocative text
// 5. Hide/show entire posts of user
//    If you want to hide the entire post, the user disappears completely,
//    and only the post counter disclose there has been a post

// Acknowledgements
// Innesko is the main programmer to this script
// Thanks to kinesarsle for original programming and inspiration
// ttsp is helping out where he can
// Thanks to Fnords for fixing a bug and improving the function ttsp wrote in the early original programming


var taggedUsers = loadUserInformation();

injectIgnore();

function injectIgnore() {
	var tmpDisable = shouldTempDisable();
	
	var wholePost;
	wholePost = document.evaluate(
		"//div[@class='post']",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

	var allUserText, thisUserText;
	allUserText = document.evaluate(
		"//div[@class='post-col post-right']",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

	var allUserAv = document.evaluate(
		"//a[starts-with(@class, 'post-user-avatar')]",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

	var allUsers = document.evaluate(
		"//a[@class='post-user-username dropdown-toggle']",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

	// The main function
	for (var i = 0; i < allUserText.snapshotLength; i++) {

		var thisUser = allUsers.snapshotItem(i);
		var user = taggedUsers[thisUser.innerText];

		var editButton = document.createElement("button");
		editButton.innerHTML = "Editera";
		editButton.onclick = function(userName) {return e => editIgnoreProperties(userName, getAllUserNames());}(thisUser.innerText);
		thisUser.parentNode.parentNode.appendChild(editButton);

		if (user === undefined) continue;

		thisUser.style.backgroundColor = user.color;

		if (user.msg) {
			var infoButton = document.createElement("button");
			infoButton.innerHTML = 'Info';
			thisUser.parentNode.parentNode.appendChild(infoButton);
			infoButton.onclick = function(user) {return e => alert(user.msg);}(user);
		}

		if (tmpDisable) continue;
		
		if (user.hide == "completely") {
			wholePost.snapshotItem(i).style.display = "none";
		} else if (user.hide == "text") {
			thisUserText = allUserText.snapshotItem(i);
			var hideButton = document.createElement("button");
			hideButton.onclick = function(node) {
									return e => toggleVisibility(node, hideButton);
								}(thisUserText, hideButton);
			hideButton.onclick();
			thisUserText.previousElementSibling.appendChild(hideButton);
		}
		
		if (user.hideAvatar) {
			allUserAv.snapshotItem(i).style.display = "none";
		}
	}
}

// Hiding and showing the text
function toggleVisibility(node, hideButton) {
  if (node.style.display == 'inline' || !node.style.display) {
      node.style.display = 'none';
      hideButton.innerHTML = 'Visa text';
  } else {
      node.style.display = '';
      hideButton.innerHTML = 'Dölj text';
  }
}

function getAllUserNames() {
	var userNames = new Array();
	for (var name in taggedUsers) {
		userNames.push(name);
	}
	return userNames;
}

function editIgnoreProperties(userName, userNames) {
    var container = document.createElement("div");
    container.style = "position:fixed; top: 50%; left: 40%; width:35em; height:18em; margin-top: -9em; margin-left: -15em; border: 2px solid #333; background-color: #f3f3f3; padding: 5px";
    document.getElementsByTagName("body")[0].appendChild(container);

    var abortButton = document.createElement("input");
    abortButton.type = "button";
    abortButton.value = "Avbryt";

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Spara";
	
	var tmpDisableButton = document.createElement("input");
	tmpDisableButton.type = "button";
	tmpDisableButton.value = "Inaktivera temporärt";

    var hideCheck = document.createElement("select");
    hideCheck.innerHTML = "<option value=''> - </option><option value='completely'>Dölj fullständigt.</option><option value='text'>Dölj endast texten.</option>";
	hideCheck.style = "width: 100%;";
	
	var hideAvatarCheck = document.createElement("input");
	hideAvatarCheck.type = "checkbox";

    var colorInput = document.createElement("input");
    colorInput.type = "text";

    var msgInput = document.createElement("textarea");
    msgInput.style.width = "100%";
    msgInput.rows = 4;

    var table = document.createElement("table");
    table.style.width = "100%";

	var userNameSelect = document.createElement("select");
	userNameSelect.style = "width: 100%;";
	userNames.forEach(name => {
		if (name === userName) return;
		var option = document.createElement("option");
		option.value = name;
		option.text = name;
		userNameSelect.appendChild(option);
	});
	var op = document.createElement("option");
	op.value = userName;
	op.text = userName;
	userNameSelect.insertBefore(op, userNameSelect.firstChild);
	userNameSelect.value = userName;
    var userNameRow = document.createElement("tr");
    userNameRow.innerHTML = "<td>Användare:</td><td></td>";
	userNameRow.children[1].appendChild(userNameSelect);

    var ignoreRow = document.createElement("tr");
    ignoreRow.innerHTML = "<td>Ignorera:</td><td></td>";
    ignoreRow.children[1].appendChild(hideCheck);

	var ignoreAvatarRow = document.createElement("tr");
	ignoreAvatarRow.innerHTML = "<td>Dölj avatar:</td><td></td>";
	ignoreAvatarRow.children[1].appendChild(hideAvatarCheck);

    var colorRow = document.createElement("tr");
    colorRow.innerHTML = "<td>Färg:</td><td></td>";
    colorRow.children[1].appendChild(colorInput);

    var msgRow = document.createElement("tr");
    msgRow.innerHTML = "<td colspan=2>Meddelande:</td>";

    var msgContainer = document.createElement("tr");
    msgContainer.innerHTML = "<td colspan=2></td>";
    msgContainer.children[0].appendChild(msgInput);

    var buttonRow = document.createElement("tr");
    buttonRow.innerHTML = "<td></td><td align=\"right\"></td>";
	buttonRow.children[0].appendChild(tmpDisableButton);
    buttonRow.children[1].appendChild(abortButton);
    buttonRow.children[1].appendChild(saveButton);

    table.appendChild(userNameRow);
    table.appendChild(ignoreRow);
	table.appendChild(ignoreAvatarRow);
    table.appendChild(colorRow);
    table.appendChild(msgRow);
    table.appendChild(msgContainer);
    table.appendChild(buttonRow);

	tmpDisableButton.onclick = e => {
		setTempDisableTime();
		location.reload();
	};
    abortButton.onclick = e => container.parentNode.removeChild(container);
    saveButton.onclick = e => {
        var user = taggedUsers[userNameSelect.value];
        if (user === undefined) {
            user = {};
            taggedUsers[userNameSelect.value] = user;
        }
        user.hide = hideCheck.value;
		user.hideAvatar = hideAvatarCheck.checked;
        if (colorInput.value === "")
            delete user.color;
        else
            user.color = colorInput.value;

        if (msgInput.value === "")
            delete user.msg;
        else
            user.msg = msgInput.value;

        saveUserInformation();
        location.reload();
    };
	const showUserInfo = e => {
		var user = taggedUsers[userNameSelect.value];
		if (user === undefined) user = {};
		hideCheck.value = user.hide === undefined ? "" : user.hide;
		hideAvatarCheck.checked = user.hideAvatar === undefined ? false : user.hideAvatar;
		msgInput.value = user.msg === undefined ? "" : user.msg;
		colorInput.value = user.color === undefined ? "" : user.color;
	};
	userNameSelect.onchange = showUserInfo;
	showUserInfo();
    container.appendChild(table);
}

function saveUserInformation() {
    for (var userName in taggedUsers) {
        var user = taggedUsers[userName];
        if (isUserInfoEmpty(user)) {
            delete taggedUsers[userName];
        }
    }
    GM_setValue("taggedUsers", JSON.stringify(taggedUsers));
}

function loadUserInformation() {
    var strData = GM_getValue("taggedUsers");
    return strData ? JSON.parse(strData) : {};
}

function shouldTempDisable() {
	var tmpDisableTime = GM_getValue("tempDisableTime");
	tmpDisableTime = tmpDisableTime === undefined ? 0 : tmpDisableTime;
	return ((new Date()).valueOf() - tmpDisableTime) <= 1000*20;
}

function setTempDisableTime() {
	GM_setValue("tempDisableTime", (new Date()).valueOf());
}

function isUserInfoEmpty(user) {
    return (user.msg === undefined || user.msg === "") &&
           (user.color === undefined || user.color === "") &&
		   (user.hide === undefined || user.hide === "") && !user.hideAvatar;
}