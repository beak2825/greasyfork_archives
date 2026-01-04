// ==UserScript==
// @name			IdlePixel Group Chat
// @namespace		luxferre.dev
// @version			2.1.2
// @description		A private group chat panel
// @author			Lux-Ferre
// @license			MIT
// @match			*://idle-pixel.com/login/play*
// @grant			none
// @require			https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require			https://greasyfork.org/scripts/484046/code/IdlePixel%2B%20Custom%20Handling.js?anticache=20240721
// @require		 	https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20240721
// @downloadURL https://update.greasyfork.org/scripts/487960/IdlePixel%20Group%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/487960/IdlePixel%20Group%20Chat.meta.js
// ==/UserScript==
 
(function() {
	'use strict';

	class GroupChatPlugin extends IdlePixelPlusPlugin {
		constructor() {
			super("groupChat", {
				about: {
					name: GM_info.script.name,
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description
				},
			});
			this.groups = {}
			this.activeGroup = undefined
			this.invitations = {}
			this.chats = {}
		}

		saveData(){
			const user = window["var_username"]
			const groupsJSON = JSON.stringify(this.groups)
			localStorage.setItem(`groupChatGroups${user}`, groupsJSON)

			const invitationsJSON = JSON.stringify(this.invitations)
			localStorage.setItem(`groupChatInvitations${user}`, invitationsJSON)
		}

		loadData(){
			const user = window["var_username"]
			const groupData = localStorage.getItem(`groupChatGroups${user}`)
			if (groupData){
				this.groups = JSON.parse(groupData)
			} else {
				this.groups = {}
			}

			const invitationData = localStorage.getItem(`groupChatInvitations${user}`)
			if (invitationData){
				this.invitations = JSON.parse(invitationData)
			} else {
				this.invitations = {}
			}
		}
 
		createPanel(){
			IdlePixelPlus.addPanel("groupchat", "Group Chat Panel", function() {
				return `
<div class="groupChatUIContainer w-100">
    <div id="groupChatInfoModule" class="row groupChatUIModule">
        <div class="col">
            <div class="row">
                <div class="col-4 text-end align-self-center groupChatInfoContainer">
                    <div class="row gx-0">
                        <div id="groupChatGroupNotification" class="col-1 text-center align-self-center groupChatGroupNotificationInactive" onclick="IdlePixelPlus.plugins.groupChat.showInvitationModal()"><span>!</span></div>
                        <div class="col-11 align-self-center"><select id="groupChatGroupSelector" class="w-100"></select></div>
                    </div>
                </div>
                <div class="col-8 d-flex groupChatInfoContainer">
                    <div id="groupChatMembersContainer" class="d-flex align-items-center"><span>Members:</span></div>
                </div>
            </div>
        </div>
    </div>
    <div id="groupChatChatModule" class="row groupChatUIModule">
        <div class="col">
            <div class="row">
                <div id="groupChatChatFormContainer" class="col">
                    <div id="groupChatChatBox" class="overflow-auto"></div>
                    <form onsubmit="event.preventDefault(); IdlePixelPlus.plugins.groupChat.sendGroupChatButton();">
                        <div class="row d-flex flex-fill">
                            <div class="col-11"><input id="groupChatChatIn" class="form-control w-100" type="text" /></div>
                            <div class="col-1"><input id="groupChatChatButton" class="w-100 h-100" type="submit" value="Send" /></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div id="groupChatSettingsModules" class="row groupChatUIModule">
        <div class="col">
            <div class="row">
                <div id="groupChatSettings" class="col d-flex justify-content-around align-self-center"><button id="groupChatCreateGroupButton" class="btn btn-info" type="button" onclick="IdlePixelPlus.plugins.groupChat.createGroupButton()">Create Group</button><button id="groupChatShareRaidButton" class="btn btn-info groupChatInGroupButton" type="button" onclick="IdlePixelPlus.plugins.groupChat.shareRaidButton()">Share Raid</button><button id="groupChatInviteButton" class="btn btn-info groupChatOwnerButton groupChatInGroupButton" type="button" onclick="IdlePixelPlus.plugins.groupChat.inviteButton()">Invite</button><button id="groupChatUninviteButton" class="btn btn-info groupChatOwnerButton groupChatInGroupButton" type="button" onclick="IdlePixelPlus.plugins.groupChat.uninviteButton()">Uninvite</button><button id="groupChatRemovePlayerButton" class="btn btn-info disabled groupChatOwnerButton groupChatInGroupButton" type="button" disabled>Remove</button></div>
            </div>
        </div>
    </div>
</div>
				`
			});
		}

		addStyles(){
			let backgroundColour
			let textColour

			if ("ui-tweaks" in IdlePixelPlus.plugins){
				backgroundColour = IdlePixelPlus.plugins["ui-tweaks"].config["color-chat-area"]
				textColour = IdlePixelPlus.plugins["ui-tweaks"].config["font-color-chat-area"]
			} else {
				backgroundColour = "white"
				textColour = "black"
			}

			$("head").append(`
				<style id="styles-groupchat">
					#groupChatInvitationsModalInner {
					  background-color: ${backgroundColour};
					  color: ${textColour};
					}

					.groupChatUIModule {
					  border: outset 2px;
					}

					.groupChatUIContainer {
					  width: 100%;
					  height: 100%;
					  padding: 5px;
					  margin: 0;
					}

					#groupChatChatBox {
					  width: 100%;
					  height: 70vh;
					  margin-top: 10px;
					}

					#groupChatChatBox {
					  border: inset 1px;
					}

					.groupChatGroupNotificationActive {
					  color: red;
					  border: outset;
					  border-color: red;
					}

					.groupChatGroupNotificationInactive {
					  color: gray;
					  border: outset;
					  border-color: gray;
					}

					.groupChatInfoContainer {
					  border: inset;
					}

					#groupChatSelectGroupDrop {
					  border: solid;
					  border-width: 1px;
					}

					.groupChatMember {
					  margin: 0px 3px;
					  border: 1px groove;
					}

					#groupChatGroupNotification {
					  cursor: pointer;
					}

					.groupChatInvitation {
					  background-color: RGBA(1, 150, 150, 0.5);
					  margin-bottom: 2px;
					}

					.groupChatInvCheck {
					  cursor: pointer;
					}

					.groupChatInvCross {
					  cursor: pointer;
					  margin-right: 5px;
					}

					.groupChatInvData {
					  margin-left: 10px;
					}

					#groupChatModalHeader {
					  padding: calc(var(--bs-modal-padding) - var(--bs-modal-header-gap) * .5);
					  background-color: var(--bs-modal-header-bg);
					  border-bottom: var(--bs-modal-header-border-width) solid var(--bs-modal-header-border-color);
					  border-top-right-radius: var(--bs-modal-inner-border-radius);
					  border-top-left-radius: var(--bs-modal-inner-border-radius);
					}

					#groupChatInvitationsModal .modal-body {
					  overflow-y: auto;
					}
				</style>
			`)
		}
	
		onLogin() {
			Paneller.registerPanel("groupchat", "Group Chat")

			this.loadData()
			this.createPanel()
			this.addStyles()
			this.createNotification()
			this.updatePanelInfo()
			this.createInvModal()
			this.updateInvitationNotification()

			$('#groupChatGroupSelector').on('change', function() {
				IdlePixelPlus.plugins.groupChat.joinGroup(this.value)
			});

			$("#groupChatChatModule").hide()
			$(".groupChatInGroupButton").hide()
		}

		onPanelChanged(panelBefore, panelAfter){
			if (panelAfter==="groupchat"){
				$("#groupChatNotification").hide()
			}
		}
 
		onConfigsChanged() {
			this.updatePanelInfo();
		}

		createInvModal(){
			const modalString = `
				<div id="groupChatInvitationsModal" class="modal fade" role="dialog" tabindex="-1"">
				    <div class="modal-dialog modal-dialog-centered" role="document">
				        <div id="groupChatInvitationsModalInner" class="modal-content">
							<div id="groupChatModalHeader" class="modal-header text-center">
								<h3 class="modal-title w-100"><u>Pending Invitations</u></h3>
							</div>
				            <div class="modal-body">
				                <div id="groupChatInvitationsModalList" class="overflow-auto"></div>
				            </div>
				        </div>
				    </div>
				</div>
			`

			const modalElement = $.parseHTML(modalString)
			$(document.body).append(modalElement)
		}

		addInvitationsToModal(){
			const invitationsModalList = $("#groupChatInvitationsModalList")
			invitationsModalList.empty()

			for (const [groupName, inviter] of Object.entries(this.invitations)){
				const newItemString = `<div class="d-flex justify-content-between rounded-pill groupChatInvitation"><span class="groupChatInvData">${groupName} | ${inviter}</span><div><span data-groupName="${groupName}" class="groupChatInvCheck">✔️</span> | <span data-groupName="${groupName}" class="groupChatInvCross">❌</span></div></div>`
				const newItemElement = $.parseHTML(newItemString)
				invitationsModalList.append(newItemElement)
			}

			$(".groupChatInvCheck").attr("onclick", "IdlePixelPlus.plugins.groupChat.acceptInvitation(this.getAttribute('data-groupName'))")
			$(".groupChatInvCross").attr("onclick", "IdlePixelPlus.plugins.groupChat.rejectInvitation(this.getAttribute('data-groupName'))")
		}

		showInvitationModal(){
			document.body.scrollTop = document.documentElement.scrollTop = 0;

			this.addInvitationsToModal()

			$('#groupChatInvitationsModal').modal('show')
		}
 
		onCustomMessageReceived(player, content, callbackId) {
			const customData = Customs.parseCustom(player, content, callbackId)
			if(customData.plugin==="groupchat") {
				if(customData.command==="chat"){
					this.handleReceivedChat(customData)
				} else if (customData.command==="invite"){
					this.onInviteReceived(customData.player, customData.payload, customData.callbackId)
				} else if (customData.command==="accept"){
					this.onAcceptedInvite(customData.player, customData.payload)
				} else if (customData.command==="reject"){
					this.onRejectedInvite(customData.player, customData.payload)
				} else if (customData.command==="unaccept"){
					this.onUnacceptInvite(customData.player, customData.payload)
				} else if (customData.command==="join"){
					this.addGroup(customData.player, customData.payload)
				}
			}
		}

		handleReceivedChat(data){
			const player = data.player
			const splitData = data.payload.split(";")
			const groupName = splitData[0]
			const givenPassword = splitData[1]
			const message = splitData.slice(2).join(";")

			if(!(groupName in this.groups)){console.log(`Group ${groupName} doesn't exist.`); return}

			const correctPassword = this.groups[groupName].password
			if(givenPassword!==correctPassword){console.log(`Incorrct password given`); return}

			if (!(this.groups[groupName].members.includes(player))){
				this.addPlayerToGroup(player, groupName)
			}

			const newMessageString = `<div class=""><span class="color-green">${Chat._get_time()}</span><span><strong>${player}: </strong></span><span>${sanitize_input(message)}</span></div>`

			if(!(groupName in this.chats)){this.chats[groupName] = []}

			this.chats[groupName].push(newMessageString)

			if(this.activeGroup.name === groupName){
				this.addMessageToChat(newMessageString)
			}
		}
	
		updatePanelInfo(){
			this.updateGroupsList()
		}
	
		createNotification(){
			const notificationString = `
			<div id="groupChatNotification" class="notification hover" onclick="IdlePixelPlus.setPanel('groupchat')">
        		<img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/meteor_radar_detector.png" class="w20" alt="">
        		<span class="font-small color-yellow">Group Chat</span>
    		</div>
			`

			const notificationElement = $.parseHTML(notificationString)
			const notificationBar = $("#notifications-area")

			notificationBar.append(notificationElement)
			$("#groupChatNotification").hide()
		}

		showNotification(){
			if(Globals.currentPanel === "panel-groupchat"){return;}
			
			$("#groupChatNotification").show()
		}

		sendGroupChat(chatMessage){
			if(!this.activeGroup){console.log("No active Group!"); return}
			const password = this.activeGroup.password
			const memberList = this.activeGroup.members
			const groupName = this.activeGroup.name

			memberList.forEach(member => {
				Customs.sendBasicCustom(member, "groupchat", "chat", `${groupName};${password};${chatMessage}`)
			})
		}

		sendGroupChatButton(){
			const chatIn = $("#groupChatChatIn")
			const chatMessage = chatIn.val()
			chatIn.val("")
			
			this.sendGroupChat(chatMessage)
		}

		addMessageToChat(messageText){
			const chatBox = $("#groupChatChatBox")

			const messageElement = $.parseHTML(messageText)
			chatBox.append(messageElement);

			chatBox.scrollTop(chatBox[0].scrollHeight);

			this.showNotification()
		}

		genPass(){
			return Math.random().toString(36).slice(2)
		}

		createGroup(groupName){
			if (groupName in this.groups){
				console.log("Group already exists")
				return
			}

			this.groups[groupName] = {
				name: groupName,
				members: [window["var_username"]],
				invited_members: [],
				password: this.genPass(),
				owner: window["var_username"]
			}

			this.updateGroupsList()
			this.saveData()
		}

		joinGroup(group_name){
			const loadedGroup = this.groups[group_name]
			this.activeGroup = {
				name: group_name,
				members: loadedGroup.members,
				password: loadedGroup.password,
				owner: loadedGroup.owner,
				online_members: new Set(),
			}

			this.updateMembersList()

			$("#groupChatChatModule").show()
			$(".groupChatInGroupButton").show()

			const ownerButtons = $(".groupChatOwnerButton")

			if (this.activeGroup.owner === window["var_username"]){
				ownerButtons.show()
			} else {
				ownerButtons.hide()
			}

			const chatBox = $("#groupChatChatBox")

			chatBox.empty()

			if(!(group_name in this.chats)){return}

			this.chats[group_name].forEach(chatMessage=>{
				this.addMessageToChat(chatMessage)
			})

			chatBox.scrollTop(chatBox[0].scrollHeight);
		}

		addPlayerToGroup(player, group){
			if (this.groups[group].members.includes(player)){return}
			this.groups[group].members.push(player)

			this.updateMembersList()
			this.saveData()
		}

		getGroups(){
			return Object.keys(this.groups)
		}

		updateGroupsList(){
			const groups = this.getGroups()
			const groupSelector = $("#groupChatGroupSelector")
			groupSelector.empty()

			groupSelector.append(`<option disabled selected value=""> -- select a group -- </option>`)

			groups.forEach(groupName=>{
				groupSelector.append(`<option value="${groupName}">${groupName}</option>`)
			})
		}

		updateMembersList(){
			const membersDisplay = $("#groupChatMembersContainer")
			membersDisplay.empty()
			membersDisplay.append(`<span>Members: </span>`)
			this.activeGroup.members.forEach(member=>{
				membersDisplay.append(`<span class="rounded-pill groupChatMember">&nbsp ${member} &nbsp</span>`)
			})
		}

		addPlayertoInvited(player, group){
			this.groups[group].invited_members.push(player)
			this.saveData()
		}

		sendInvitation(player){
			if(!this.activeGroup){return}
			if(this.activeGroup.owner !== window["var_username"]){
				console.log("Only the owner can invite players.")
				return
			}
			if(this.activeGroup.members.length >7){
				console.log("Group too big to invite more players!")
				return
			}

			IdlePixelPlus.sendCustomMessage(player, {
				content: `groupchat:invite:${this.activeGroup.name}`,
				onResponse: function(player, content, callbackId) {
					IdlePixelPlus.plugins.groupChat.addPlayertoInvited(player, content)
					console.log("Player invited!")
					return true;
					},
				onOffline: function(player, content) {
					console.log("Cannot invite offline player!")
					return true;
					},
				timeout: 2000 // callback expires after 2 seconds
			});

		}

		onInviteReceived(player, groupName, callback){
			this.invitations[groupName] = player
			this.updateInvitationNotification()
			IdlePixelPlus.sendCustomMessage(player, {
				content: `${groupName}`,
				callbackId: callback,
				onResponse: function(player, content, callbackId) {return true;},
				onOffline: function(player, content) {return true;},
				timeout: 2000 // callback expires after 2 seconds
			});
			this.saveData()
		}

		acceptInvitation(groupName){
			Customs.sendBasicCustom(this.invitations[groupName], "groupchat", "accept", groupName)
			delete this.invitations[groupName]
			this.addInvitationsToModal()
			this.updateInvitationNotification()
			this.saveData()
		}

		rejectInvitation(groupName){
			Customs.sendBasicCustom(this.invitations[groupName], "groupchat", "reject", `${groupName};Player rejected invitation.`)
			delete this.invitations[groupName]
			this.addInvitationsToModal()
			this.updateInvitationNotification()
			this.saveData()
		}

		onAcceptedInvite(player, groupName){
			if(!(groupName in this.groups)){return}
			if (this.groups[groupName].members.length >= 8){
				console.log("Group too big!")
				Customs.sendBasicCustom(player, "groupchat", "unaccept", "Group has too many members")
				return
			}

			if(!this.groups[groupName].invited_members.includes(player)){console.log("Univited player"); return;}

			this.groups[groupName].invited_members = this.groups[groupName].invited_members.filter(item => item !== player)
			this.addPlayerToGroup(player, groupName)

			let data_string = `${groupName};${this.groups[groupName]["password"]};`

			let membersString = ""
			this.groups[groupName].members.forEach(member=>{
				membersString+=`,${member}`
			})
			membersString = membersString.slice(1)
			data_string += membersString
			Customs.sendBasicCustom(player, "groupchat", "join", data_string)
			this.saveData()
		}

		onRejectedInvite(player, data){
			const splitData = data.split(";")
			const groupName = splitData[0]
			const reason = splitData.slice(1).join(";")
			this.groups[groupName].invited_members = this.groups[groupName].invited_members.filter(item => item !== player)
			console.log(`${player} could not be added to ${groupName} for reason: ${reason}`)
			this.saveData()
		}

		onUnacceptInvite(player, data){
			const splitData = data.split(";")
			const groupName = splitData[0]
			const reason = splitData.slice(1).join(";")
			console.log(`Could not be added to ${groupName} for reason: ${reason}`)
		}

		createGroupButton(){
			const newGroup = prompt("Group Name:")
			this.createGroup(newGroup)
		}

		shareRaidButton(){
			const raidCode = $("#raids-team-panel-uuid").text()
			if (raidCode===""){return}
			this.sendGroupChat(raidCode)
		}

		inviteButton(){
			const newPlayer = prompt("Player Name:")
			this.sendInvitation(newPlayer)
		}

		uninviteButton(){
			const player = prompt("Player Name:")
			const groupName = this.activeGroup.name

			this.groups[groupName].invited_members = this.groups[groupName].invited_members.filter(item => item !== player)
			this.saveData()
		}

		addGroup(player, data){
			const splitData = data.split(";")
			const groupName = splitData[0]
			const password = splitData[1]
			const membersList = splitData[2].split(",")

			if (groupName in this.groups){
				console.log("Group already exists")
				return
			}

			this.groups[groupName] = {
				name: groupName,
				members: membersList,
				invited_members: [],
				password: password,
				owner: player
			}

			this.updateGroupsList()
			this.saveData()
		}

		updateInvitationNotification(){
			const notificationButton = $("#groupChatGroupNotification")
			if (Object.keys(this.invitations).length){
				notificationButton.removeClass("groupChatGroupNotificationInactive")
				notificationButton.addClass("groupChatGroupNotificationActive")
			} else {
				notificationButton.removeClass("groupChatGroupNotificationActive")
				notificationButton.addClass("groupChatGroupNotificationInactive")
			}
		}
	}

	const plugin = new GroupChatPlugin();
	IdlePixelPlus.registerPlugin(plugin);
 
})();