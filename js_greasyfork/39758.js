// ==UserScript==
// @name         Roblox User:Pass
// @namespace    http://iomods.weebly.com/
// @version      0.1
// @description  Roblox Login Using user:pass Format. Sadly, only works on roblox.com/login, not other login places.
// @author       SnowLord7
// @match        https://www.roblox.com/newlogin
// @match        https://www.roblox.com/login
// @match        *://www.roblox.com/login
// @downloadURL https://update.greasyfork.org/scripts/39758/Roblox%20User%3APass.user.js
// @updateURL https://update.greasyfork.org/scripts/39758/Roblox%20User%3APass.meta.js
// ==/UserScript==

function userPassFormat() {
	var userPass = document.getElementById("userPassInput").value;
	var colonNum = userPass.indexOf(":");
	var input = userPass;
	var user = userPass.slice(0, colonNum);
	var pass = userPass.slice(colonNum + 1);
	try {
		document.getElementById("Username").value = user;
		document.getElementById("Password").value = pass;
        document.getElementsByClassName("btn-medium btn-neutral")[0].click();
    } catch(e) {
		return [input, user, pass];
    }
}

var customHTML = '';
customHTML += '<tr id="userPass"><td class="label"><label class="form-label">User:Pass</label></td><td class="input-box"><input class="text-box text-box-medium valid" id="userPassInput" value="Jimmy:noob123" placeholder="admin:pass" type="text"><input id="userPassButton" class="input-box" type="button" value="Log In"></input></td></tr>';
document.getElementById("username").parentNode.innerHTML = document.getElementById("username").parentNode.innerHTML + customHTML;
document.getElementById("userPassButton").addEventListener("click", userPassFormat, false);

//customHTML += '<p>Format <u>user:pass</u> <input id="userPassInput" value="" placeholder="admin:pass"></input> <button id="userPassButton">Log In</button></p>';
//<tr id="userPass"><td class="label"><label class="form-label">User:Pass</label></td><td class="input-box"><input class="text-box text-box-medium valid" id="userPassInput" value="" placeholder="admin:pass" type="text"><button id="userPassButton">Log In</button></td></tr>
//document.getElementById("id").innerHTML = customHTML;