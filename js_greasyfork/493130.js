// ==UserScript==
// @name			SzaltBlocker
// @version			1.1.1
// @author			Ananas
// @description			Umożliwia ignorowanie na szaltach autoagresywnych
// @license			CC BY-NC 4.0
// @grant       		unsafeWindow
// @grant       		GM.setValue
// @grant       		GM.getValue
// @match			http://www.autoagresywni.pl/szaltroom.php
// @icon			https://cdn-icons-png.freepik.com/512/5509/5509381.png
// @require     		https://code.jquery.com/jquery-3.7.1.min.js
// @run-at			document-end
// @namespace https://greasyfork.org/users/1291479
// @downloadURL https://update.greasyfork.org/scripts/493130/SzaltBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/493130/SzaltBlocker.meta.js
// ==/UserScript==
var $ = window.jQuery;

$(".sb_button").last().after( `<input type="button" style="margin:5px;" class="sb_button" value="Blokowanie" id="szaltBlockerSettingsButton">` );

$("#szaltBlockerSettingsButton").click (szaltBlockerSettingsOpen);

$(document).on("click", "#blockedUserList td", function(e) {
    if ($(this).attr('class') == "szaltBlocker_add") {addBlockedUserToList($("#addBlockedUser").val())}
    if ($(this).attr('class') == "szaltBlocker_rem") {remBlockedUserFromList(this.id)}
});

function remBlockedUserFromList(username) {
    username = username.split('_').slice(1).join('_');
    GM.getValue("SB_blockList").then(function(value) {
        let userList = value ? JSON.parse(value) : [];
        var index = userList.indexOf(username);
        if (index !== -1) {
            userList.splice(index, 1);
            GM.setValue("SB_blockList", JSON.stringify(userList)).then(szaltBlockerSettingsOpen);
        }
    });
}

function addBlockedUserToList(username){
    if (!username) {
		alert("Nazwa użytkownika nie może być pusta!");
		return;
	}

    GM.getValue("SB_blockList").then(function(value) {
        let userList = value ? JSON.parse(value) : [];
        if (userList.includes(username)) {
            alert("Ta nazwa już występuje!");
            return;
        }
        userList.push(username);
        GM.setValue("SB_blockList", JSON.stringify(userList)).then(szaltBlockerSettingsOpen);
    });
}

function szaltBlockerSettingsOpen() {
    if ($("#szaltBlockerSettingsTR").length === 0){
		$(".row2").last().parent().before( `
			<tr id="szaltBlockerSettingsTR">
				<td class="row2">
					<center>
						<span style="margin:5px;">
							<table id="blockedUserList" style="width:100%">
								<tbody>
									<tr>
										<th style="width:70%">Lista blokowanych</th>
										<th>Akcja</th>
									</tr>
									<tr>
										<td><center><input type="text" id="addBlockedUser"></center></td>
										<td class="szaltBlocker_add" id="addBlockedUserButton">Dodaj</td>
									</tr>
								</tbody>
							</table>
						</span>
					</center>
				</td>
			</tr>
		` );
		szaltBlockerSettingsGet();
    } else {
        $("#szaltBlockerSettingsTR").remove();
    }
}

function szaltBlockerSettingsGet() {
    GM.getValue("SB_blockList").then(function(value) {
        let userList = value ? JSON.parse(value) : [];
        var blockedUserList = $('#blockedUserList > tbody > tr:last-child');
        if (userList.length > 0) {
            userList.forEach((element) => blockedUserList.before(`<tr><td>${element}</td><td class="szaltBlocker_rem" id="szaltBlocker_${element}" >Usuń</td></tr>`));
        } else {
            blockedUserList.before('<tr><td colspan=2><center>Nie posiadasz blokowanych :)</center></td></tr>');
        }
    });
}

window.sbExecute = function() {
    GM.getValue("SB_blockList").then(function(value) {
        if (!value) { return; }
        let userList = JSON.parse(value);
        $(".sb_nick1, .sb_nick2").each(function(index) {
            let currUser = $(this).text().replace(/\s\[.*\]/, '');
            if (userList.includes(currUser)) { this.parentElement.remove() }
        });
    })
}

exportFunction(window.sbExecute, unsafeWindow, { defineAs: "sbExecute" });

(function() {
    var originalFunction = unsafeWindow.handleReceivingMessages;
    let dupa = function(data, textStatus, XMLHttpRequest) {
        originalFunction(data, textStatus, XMLHttpRequest);
        unsafeWindow.sbExecute();
    }
  exportFunction(dupa, unsafeWindow, { defineAs: "handleReceivingMessages" });
})();