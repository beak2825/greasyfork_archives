// ==UserScript==
// @name            BigBlueButton: NotesUserView
// @name:en         BigBlueButton: NotesUserView
// @name:ru         BigBlueButton: NotesUserView
// @namespace       BigBlueButton
// @version         1.1.0.7
// @description     Notes user view for BigBlueButton
// @description:en  Notes user view for BigBlueButton
// @description:ru  Определение пользователя для заметок BigBlueButton
// @author          aexe
// @homepage        https://greasyfork.org/ru/scripts/401303-bigbluebutton-notesuserview
// @homepageURL     https://greasyfork.org/ru/scripts/401303-bigbluebutton-notesuserview
// @website         https://greasyfork.org/ru/scripts/401303-bigbluebutton-notesuserview
// @source          https://greasyfork.org/scripts/401303-bigbluebutton-notesuserview/code/BigBlueButton:%20NotesUserView.user.js
// @supportURL      https://greasyfork.org/ru/forum/post/discussion?script=401303&locale=ru
// @include         http*://*/*html5client*
// @match           http*://*/*html5client*
// @grant           none
// @run-at          document-idle
// @noframes        
// @downloadURL https://update.greasyfork.org/scripts/401303/BigBlueButton%3A%20NotesUserView.user.js
// @updateURL https://update.greasyfork.org/scripts/401303/BigBlueButton%3A%20NotesUserView.meta.js
// ==/UserScript==

(function(oInputWindow, undefined) {
    'use strict';
	
	var oWindow = oInputWindow;
	
	if(oWindow.self != oWindow.top) {
        return false;
    }
	
    if(!((/https?:\/\/[^\/]+\/.*html5client.*/i).test(oWindow.location.href))) {
		//console.error('NotesUserView: Page');
		return false;
	}
	
	oWindow.oBigBlueButtonNotesUserView = {
		'userList':			{},
		'windowList':		[],
		'documentList':		[],
		'padObject':		null,
		'useRandomColor':	true
	};

	function main() {
		if(oWindow.document.readyState != 'complete') {
			//console.error('NotesUserView: InComplete');
			return false;
		}
		
		function UserToCode(szUserID) {
			return("author-" + szUserID.toString().replace(/[^a-y0-9]/g, function (cCurrent) {
				return("." == cCurrent ? "-" : ("z" + cCurrent.charCodeAt(0) + "z"));
			}));
		}

		function CodeToUser(szCode) {
			return(szCode.toString().slice(7).replace(/z([0-9]+)z/g, function (szAll, szCharCode) {
				return String.fromCharCode(parseInt(szCharCode))
			}).replace('-', '.'));
		}
		
		function HumanRandomColor() {
			return('#'
				+ (8 + Math.floor(Math.random() * (240))).toString(16)
				+ (8 + Math.floor(Math.random() * (240))).toString(16)
				+ (8 + Math.floor(Math.random() * (240))).toString(16)
			);
		}
		
		function ExploreDocument() {
			var oFrame = document.querySelector('iframe[title="etherpad"]');
			
			if(
				(oFrame === null)
				|| (oFrame.contentWindow === undefined)
				|| (oFrame.contentWindow === null)
				|| (oFrame.contentWindow.document === undefined)
				|| (oFrame.contentWindow.document === null)
				|| (oFrame.contentWindow.document.body === undefined)
				|| (oFrame.contentWindow.document.body === null)
				|| (oFrame.contentWindow.pad === undefined)
				|| (oFrame.contentWindow.pad === null)
				|| (oFrame.contentWindow.pad.myUserInfo === undefined)
				|| (oFrame.contentWindow.pad.myUserInfo === null)
				|| (oFrame.contentWindow.pad.myUserInfo.userId === undefined)
				|| (oFrame.contentWindow.pad.myUserInfo.userId === null)
			) {
				return false;
			}
			
			oWindow.oBigBlueButtonNotesUserView.windowList[0] = oFrame.contentWindow;
			oWindow.oBigBlueButtonNotesUserView.documentList[0] = oFrame.contentWindow.document;
			oWindow.oBigBlueButtonNotesUserView.padObject = oFrame.contentWindow.pad;
			
			function UpdateUserList() {
				if(
					(oWindow.oBigBlueButtonNotesUserView.padObject === undefined)
					|| (oWindow.oBigBlueButtonNotesUserView.padObject === null)
				) {
					return false;
				}
				
				var aUserList = oWindow.oBigBlueButtonNotesUserView.padObject.userList();
				for(var nI = 0; nI < aUserList.length; nI++) {
					if(
						(aUserList[nI].userId === undefined)
						|| (aUserList[nI].userId === null)
						|| (!aUserList[nI].userId.length)
						|| (aUserList[nI].name === undefined)
						|| (aUserList[nI].name === null)
						|| (!aUserList[nI].name.length)
						|| (aUserList[nI].colorId === undefined)
						|| (aUserList[nI].colorId === null)
						|| (!aUserList[nI].colorId.length)
					) {
						continue;
					}
					oWindow.oBigBlueButtonNotesUserView.userList[aUserList[nI].userId] = {
						'id':			aUserList[nI].userId,
						'format':		UserToCode(aUserList[nI].userId),
						'name':			aUserList[nI].name,
						'color':		aUserList[nI].colorId
					};
				}
			}
			
			function UnloadFunction() {
				//console.error('NotesUserView: Unload');
				//console.error(oWindow.oBigBlueButtonNotesUserView);
				
				oWindow.oBigBlueButtonNotesUserView.windowList = [];
				oWindow.oBigBlueButtonNotesUserView.documentList = [];
				oWindow.oBigBlueButtonNotesUserView.padObject = null;
				
				oWindow.document.querySelectorAll('.tooltip-author').forEach(function(e) {
					e.parentNode.removeChild(e);
				});
				
				if((oWindow.oBigBlueButtonNotesUserView.mainInterval === undefined) || (oWindow.oBigBlueButtonNotesUserView.mainInterval === null)) {
					oWindow.mainInterval = setInterval(oWindow.oBigBlueButtonNotesUserView.ExploreDocument, 1e3);
				}
				//console.error('NotesUserView: Unload: Success');
			}
			
			UpdateUserList();
			
			oFrame.contentWindow.addEventListener('unload', UnloadFunction);
			
			oFrame = oFrame.contentWindow.document.querySelector('iframe[name="ace_outer"]');
			
			if(
				(oFrame === null)
				|| (oFrame.contentWindow === undefined)
				|| (oFrame.contentWindow === null)
				|| (oFrame.contentWindow.document === undefined)
				|| (oFrame.contentWindow.document === null)
				|| (oFrame.contentWindow.document.body === undefined)
				|| (oFrame.contentWindow.document.body === null)
			) {
				return false;
			}
			
			oWindow.oBigBlueButtonNotesUserView.windowList[1] = oFrame.contentWindow;
			oWindow.oBigBlueButtonNotesUserView.documentList[1] = oFrame.contentWindow.document;
			oFrame.contentWindow.addEventListener('unload', UnloadFunction);
			
			oFrame = oFrame.contentWindow.document.querySelector('iframe[name="ace_inner"]');
			
			if(
				(oFrame === null)
				|| (oFrame.contentWindow === undefined)
				|| (oFrame.contentWindow === null)
				|| (oFrame.contentWindow.document === undefined)
				|| (oFrame.contentWindow.document === null)
				|| (oFrame.contentWindow.document.body === undefined)
				|| (oFrame.contentWindow.document.body === null)
			) {
				return false;
			}
			
			//console.error('NotesUserView: Explore');
			
			oWindow.oBigBlueButtonNotesUserView.windowList[2] = oFrame.contentWindow;
			oWindow.oBigBlueButtonNotesUserView.documentList[2] = oFrame.contentWindow.document;
			oFrame.contentWindow.addEventListener('unload', UnloadFunction);
			
			oWindow.oBigBlueButtonNotesUserView.updateInterval = setInterval(function() {
				if(
					(oWindow.oBigBlueButtonNotesUserView === undefined)
					|| (oWindow.oBigBlueButtonNotesUserView === null)
					|| (oWindow.oBigBlueButtonNotesUserView.padObject === undefined)
					|| (oWindow.oBigBlueButtonNotesUserView.padObject === null)
				) {
					return false;
				}
				
				UpdateUserList();
				
				if(
					(oWindow.oBigBlueButtonNotesUserView.documentList === undefined)
					|| (oWindow.oBigBlueButtonNotesUserView.documentList === null)
					|| (oWindow.oBigBlueButtonNotesUserView.documentList[2] === undefined)
					|| (oWindow.oBigBlueButtonNotesUserView.documentList[2] === null)
				) {
					return false;
				}
				
				for(var szUserID in oWindow.oBigBlueButtonNotesUserView.userList) {
					var oStyleObject = oWindow.oBigBlueButtonNotesUserView.documentList[2].querySelector('style[x-author-id="' + szUserID + '"]');
					if(oStyleObject !== null) {
						continue;
					}
					
					oStyleObject = oWindow.oBigBlueButtonNotesUserView.documentList[2].createElement('style');
					oStyleObject.setAttribute('x-author-id', szUserID);
					oStyleObject.setAttribute('x-author-code', oWindow.oBigBlueButtonNotesUserView.userList[szUserID].format);
					
					var szColor = oWindow.oBigBlueButtonNotesUserView.userList[szUserID].color
					if((oWindow.oBigBlueButtonNotesUserView.useRandomColor !== undefined) && (oWindow.oBigBlueButtonNotesUserView.useRandomColor)) {
						szColor = HumanRandomColor();
					}
					
					oStyleObject.innerHTML = '.' + oWindow.oBigBlueButtonNotesUserView.userList[szUserID].format + '{color: ' + szColor + ';}';
					oWindow.oBigBlueButtonNotesUserView.documentList[2].head.appendChild(oStyleObject);
				}
			}, 1e3);
			
			oWindow.oBigBlueButtonNotesUserView.documentList[2].body.addEventListener('mouseover', function(oEvent) {
				var oCurrentObject = oEvent.target;
				function CheckObjectStyle(oObject) {
					switch(oObject.nodeName.toLowerCase()) {
						case 'b':
						case 'i':
						case 's':
						case 'u':
						case 'a':
							return true;
						default:
							return false;
					}
					return false;
				}
				while(CheckObjectStyle(oCurrentObject)) {
					oCurrentObject = oCurrentObject.parentNode;
				}

				if(!oCurrentObject.classList.length) {
					return false;
				}
				
				var szCurrentAuthor = null;
				
				oCurrentObject.classList.forEach(function(szClassName) {
					if((/^author-/).test(szClassName)) {
						szCurrentAuthor = CodeToUser(szClassName);
					}
				})
				if(szCurrentAuthor === null) {
					return false;
				}

				oWindow.document.querySelectorAll('.tooltip-author').forEach(function(e) {
					e.parentNode.removeChild(e);
				});
				
				if(
					(oWindow.oBigBlueButtonNotesUserView.userList[szCurrentAuthor] === undefined)
					|| (oWindow.oBigBlueButtonNotesUserView.userList[szCurrentAuthor] === null)
					|| (oWindow.oBigBlueButtonNotesUserView.userList[szCurrentAuthor].name === undefined)
					|| (oWindow.oBigBlueButtonNotesUserView.userList[szCurrentAuthor].name === null)
				) {
					return false;
				}
				
				var oTooltip = document.createElement('div');
				oTooltip.classList.add('tooltip-author');

				oTooltip.style.border = '#0a600a 3px solid';
				oTooltip.style.borderRadius = '6px';
				oTooltip.style.width = 'auto';
				oTooltip.style.height = '2.35em';
				oTooltip.style.textAlign = 'center';
				oTooltip.style.display = 'block';
				oTooltip.style.padding = '5px';
				oTooltip.style.position = 'fixed';
				oTooltip.style.right = '20px';
				oTooltip.style.top = '20px';
				oTooltip.style.zIndex = '1000';
				oTooltip.style.backgroundColor = '#d0eed0'
				
				oTooltip.innerText = oWindow.oBigBlueButtonNotesUserView.userList[szCurrentAuthor].name;

				oWindow.document.body.appendChild(oTooltip);
			});
			
			oWindow.oBigBlueButtonNotesUserView.documentList[2].body.addEventListener('mouseout', function(t) {
				oWindow.document.querySelectorAll('.tooltip-author').forEach(function(e) {
					e.parentNode.removeChild(e);
				});
			});
			
			clearInterval(oWindow.oBigBlueButtonNotesUserView.mainInterval);
			oWindow.oBigBlueButtonNotesUserView.mainInterval = null;
		}
		
		oWindow.oBigBlueButtonNotesUserView.mainInterval = setInterval((oWindow.oBigBlueButtonNotesUserView.ExploreDocument = ExploreDocument), 1e3);
	};

	if((oWindow.document.body === null) || (oWindow.document.body === undefined) || (oWindow.document.readyState != 'complete')) {
		oWindow.document.addEventListener('readystatechange', main);
	}
	
	main();
})(window);
