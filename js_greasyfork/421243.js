// ==UserScript==
// @name     在線等! 動森揪團工具 增強
// @version  0.14.2
// @description 不用離房就能進行各種操作，包括查看用戶UID，插入表情符號及更多。
// @author   sprocket1201
// @match    https://ac-room.cc/*
// @grant    none
// @namespace https://greasyfork.org/users/734736
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/421243/%E5%9C%A8%E7%B7%9A%E7%AD%89%21%20%E5%8B%95%E6%A3%AE%E6%8F%AA%E5%9C%98%E5%B7%A5%E5%85%B7%20%E5%A2%9E%E5%BC%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/421243/%E5%9C%A8%E7%B7%9A%E7%AD%89%21%20%E5%8B%95%E6%A3%AE%E6%8F%AA%E5%9C%98%E5%B7%A5%E5%85%B7%20%E5%A2%9E%E5%BC%B7.meta.js
// ==/UserScript==
(function() {
	// Your code here...
	let vm = null;

	let loadScript = ({
		src,
		txt
	}) => {
		let script = document.createElement("script");
		if (src) script.src = src;
		if (txt) script.textContent = txt;
		document.body.appendChild(script);
	}
  
  let createRow = (subheader) => {
    let block = document.createElement("div");
    block.classList.add("d-flex", "my-1");
    let subheaderBlock = document.createElement("div");
    subheaderBlock.classList.add("v-subheader", "theme--light", "pa-0", "mr-auto", "flex-shrink-0", "align-center");
		subheaderBlock.textContent = subheader;
    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("d-flex", "align-center", "flex-wrap");
    if(subheader && subheader.length > 0) block.append(subheaderBlock);
    block.append(buttonGroup);
  	return [block, subheaderBlock, buttonGroup];
  };

	let createButton = (textContent, onClick, target, color = "info--text", id, displayType = ["outlined"]) => {
		let b = document.createElement("button");
		if (id) b.setAttribute("id", id);
		b.classList.add("ma-1", "v-btn", ...displayType.map(t => "v-btn--" + t), "v-size--small", "theme--dark", ...color.split(" ").map(c => {
			if (c.startsWith("lighten") || c.startsWith("darken"))
				c = "text--" + c;
			else c = c + "--text";
			return c;
		}));
		let bContent = document.createElement("span");
		bContent.classList.add("v-btn__content")
		bContent.textContent = textContent;
		b.append(bContent);
		if (onClick) b.addEventListener('click', onClick, false);
		if (target) target.appendChild(b);
		return b;
	};
  
  let createIconButton = (icon, obj) => {
    let {onClick, target, color, id, displayType, title} = obj;
    if(!color) color = "info--text";
    if(!displayType) displayType = ["icon", "text", "round"];
    
		let b = document.createElement("button");
		if (id) b.setAttribute("id", id);
    if (title) b.setAttribute("title", title);
		b.classList.add("ma-1", "v-btn", ...displayType.map(t => "v-btn--" + t), "v-size--small", "theme--light", ...color.split(" ").map(c => {
			if (c.startsWith("lighten") || c.startsWith("darken"))
				c = "text--" + c;
			else c = c + "--text";
			return c;
		}));
		let bContent = document.createElement("span");
		bContent.classList.add("v-btn__content");
    let iconEl = document.createElement("i");
    iconEl.classList.add("v-icon", "notranslate", "mdi", "mdi-" + icon, "theme--light");
    iconEl.setAttribute("aria-hidden", "true");
    bContent.append(iconEl);
		b.append(bContent);
		if (onClick) b.addEventListener('click', onClick, false);
		if (target) target.appendChild(b);
		return b;
	};

	let action = {
    postInitializationAction(){
      let vm = __vue__instance__,
          guestVm = __guest__instance__;
      // initialize search uid function
      action.initAutoComplete();
    	document.body.addEventListener('contextmenu', e =>{ // right click show uid
        if(e.target.getAttribute("uid")){
          e.preventDefault();
          prompt(e.target.textContent.replace(/：/g,""),e.target.getAttribute("uid"));
        }
        else if(e.target.matches(".v-dialog .v-data-table tr > td:first-of-type")){
					e.preventDefault();
          let name = e.target.textContent,
              date = e.target.nextSibling.textContent,
              action = e.target.nextSibling.nextSibling.textContent;
              records = __record__instance__.records;
          let record = records.find(r => {
            let dateInRecord = new Date(r.created_at);
            const offset = dateInRecord.getTimezoneOffset();
            dateInRecord = new Date(dateInRecord.getTime() - (offset*60*1000));
            dateInRecord = dateInRecord.toISOString().replace(/T/g," ").slice(5,19);
            let system = action.includes("系統");
            action = action.trim().replace(" (系統)", "");
            if (action == "邀請") action = "邀請中";
            
            return r.name == name && dateInRecord == date && r.content == action && r.system == system});
          if(record)
            prompt(name, record.id);
				}
      });
      // watch guests
      guestVm.$watch("guests", function(to, from) {
				action.handleRecordGuests(to, from);
        action.handleLimitGuests(to, from);
        if(vm.$vuetify.breakpoint.smAndDown){ // make room abstract info
          let roomAbstractInfo = document.getElementById("room-abstract-info");
          roomAbstractInfo.querySelector(".v-subheader span").innerHTML = vm.room.guests + " / " + vm.room.limit;
        }
			}, {
				deep: true,
			});
      
      // merge legacy localStorage keys into preferences
      let pref = JSON.parse(localStorage.getItem("preferences") || "{}");
      if(localStorage.hasOwnProperty("predefined-messages")){
        pref.predefinedMessages = JSON.parse(localStorage.getItem("predefined-messages"));
        localStorage.setItem("preferences", JSON.stringify(pref));
        localStorage.removeItem("predefined-messages");
      }
      action.msgButtonGroupGenerate();
      if(vm.user.id == vm.room.id){
         if(pref.hasOwnProperty("guestsManagement") && pref.guestsManagement.hasOwnProperty(vm.room.id) && pref.guestsManagement[vm.room.id].hasOwnProperty("guestCount")) 
           document.getElementById("limit-guest-count").value = Number(pref.guestsManagement[vm.room.id].guestCount);
      } else {
        document.getElementById("limit-guest-wrapper").setAttribute("style", "display: none;");
        document.getElementById("current-profile").parentElement.parentElement.setAttribute("style", "display: none;");
      }
      
      // inject sticky style
      let style = document.createElement("style");
      style.innerHTML = "@media only screen and (min-width: 600px) {\n  #room .row > .col-sm-6 {\n  position: -webkit-sticky;\n  position: sticky;\n  top: 0;\n  align-self: flex-start;\n  }\n}\n" +
         "input.hide-arrows::-webkit-outer-spin-button,input.hide-arrows::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\ninput.hide-arrows[type=number] {\n  " +
         "-moz-appearance: textfield;\n}\ninput.border-bottom {\n   border-bottom: solid rgba(0,0,0,.42) thin;\n}";
      document.head.append(style);
    },
		initAutoComplete() {
			let div = document.createElement("div");
			div.innerHTML = `<div class="pa-2 d-flex">
				<label class="flex-shrink-0 mr-2">用戶名稱:</label>
				<input name="name_of_user" type="search" class="flex-grow-1 border-bottom">
			</div>
			<div class="pa-2 d-flex">
				<label class="flex-shrink-0 mr-2">用戶 ID:</label>
				<input name="uid" type="search" class="flex-grow-1 border-bottom">
			</div>`;
			document.getElementById("output").previousSibling.prepend(div);
			autocomplete({
				input: document.querySelector("input[name=name_of_user]"),
				showOnFocus: true,
				fetch: function(text, update) {
					text = text.toLowerCase();
					// you can also use AJAX requests instead of preloaded data
					update(action.suggestUser(text));
				},
				onSelect: function(item) {
					document.querySelector("input[name=uid]").value = item.value;
					document.querySelector("input[name=name_of_user]").value = item.label;
				}
			});
		},
		suggestUser(txt) {
			let vm = __chat__instance__,
				guestVm = __guest__instance__,
        records = __record__instance__.records || [],
				list = [vm.pUser, vm.room, ...guestVm.guests, ...vm.chat, ...records].reduce((arr, v) => {
					let id = v.user || v.id;
					if (arr.every(item => item.value != id) && v.name.toLowerCase().includes(txt.toLowerCase())) arr.push({
						label: v.name,
						value: id
					});
					return arr;
				}, []);
			return list;
		},
		getUserInfo() {
			let vm = __chat__instance__,
				getValue = name => document.querySelector("input[name=" + name + "]") ? document.querySelector("input[name=" + name + "]").value : "",
			id = getValue("uid").length > 0 ? getValue("uid") : vm[vm.user.id ? "user" : "pUser"].id,
			name = getValue("name_of_user").length > 0 ? getValue("name_of_user") : vm[vm.user.id ? "user" : "pUser"].name;
			return {
				id,
				name
			};
		},
		firework() {
			let vm = __chat__instance__,
				{
					id,
					name
				} = action.getUserInfo();
			vm.$socket.emit('firework', vm.room.id);
				vm.$socket.emit('message', {
					room: vm.room.id,
					name: name,
					user: id,
					info: 1,
					msg: '施放了煙火'
				});
		},
		youtube() {
			var url = prompt("請輸入 YouTube 影片連結：", "https://www.youtube.com/watch?v=HgETcBBLdTk");
			if (url != null) {
				let vm = __chat__instance__,
					{
						id,
						name
					} = action.getUserInfo();
				vm.$socket.emit('youtube', {
						room: vm.room.id,
						id: action.youtubeParser(url)
					});
					vm.$socket.emit('message', {
						room: vm.room.id,
						name: name,
						user: id,
						info: 1,
						msg: '推播了歌曲！'
					});
			}
		},
		kick() {
      let confirmed = confirm("是否確定要執行這個動作？");
      if(!confirmed) return;
      
			let vm = __vue__instance__,
				{
					id,
					name
				} = action.getUserInfo();
			vm.$socket.emit('guest/leave', {
				id: id,
				room: vm.room.id,
				name: name
			});
		},
		invite() {
      let confirmed = confirm("是否確定要執行這個動作？");
      if(!confirmed) return;
      
			let vm = __chat__instance__,
				{
					id,
					name
				} = action.getUserInfo();
			vm.$socket.emit('guest/join', {
				id: id,
				room: vm.room.id,
				name: name
			});
		},
		roomList() {
			/*document.getElementById("output").innerHTML = "<span>Refreshing</span>";
			fetch("//api.ac-room.cc/list/免費").then(resp => resp.json()).then(j => {
			    document.getElementById("output").innerHTML = action.arrayParser(j.list.filter(e => e), ["guests", "limit", "name", "room"]);
			});*/
			if (document.querySelector("iframe")) {
				if (document.querySelector("iframe").style.display == "none") {
					document.querySelector("iframe").style.display = "";
					document.body.style.marginLeft = "350px";
				} else {
					document.querySelector("iframe").style.display = "none";
					document.body.style.marginLeft = "0";
				}
			} else {
				let iframe = document.createElement("iframe");
				iframe.setAttribute("src", "https://ac-room.cc");
				iframe.style = "position:fixed;width:350px;left:0;top:0;height:100vh;border: 0;";
				document.body.style.marginLeft = "350px";
				document.body.append(iframe);
			}
		},
		async emoji() {
			let vm = __chat__instance__;
      
			let { EmojiButton } = await import("https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button/dist/index.min.js");
      // let zhHantEmojiData = await import('https://cdn.jsdelivr.net/npm/@roderickhsiao/emoji-button-locale-data/dist/zh-Hant.js');
      
      const trigger = this;
      const picker = new EmojiButton({
        // emojiData: zhHantEmojiData,
        theme: 'auto',
      });

      picker.on('emoji', selection => {
        vm.msg += selection.emoji;
        setTimeout(function () {
            vm.$refs.msg.$el.querySelector("input").focus();
          }, 400);
      });

      trigger.addEventListener('click', () => picker.togglePicker(trigger));
      picker.togglePicker(trigger);
      
			this.removeEventListener('click', unsafeWindow.action.emoji, false);
		},
		bypassChatLimit() {
			let vm = __chat__instance__;
			vm.$watch("chat", function(to, from) {
				if (to.length == 25) to.unshift(from ? from[0] : to[0]);
				else if (to.length > 25 && to[0].id != to[1].id) to.unshift(from[0]);
			}, {
				deep: true,
				immediate: true
			});
			if (this) this.remove();
		},
		youtubeParser(e) {
			var t = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
				r = e.match(t);
			return !(!r || 11 != r[7].length) && r[7]
		},
		arrayParser(arr, properties) {
			let txt = arr.filter(e => e).map(e => {
				let converted = properties.map(p => p + ": " + e[p]);
				return converted.join(", ");
			});
			return "<span>" + txt.join("</span><span>") + "</span>";
		},
		recordGuests() {
			let vm = __vue__instance__,
        style = document.getElementById("dulplicate-guests-indicator");
			if (!style){
				style = document.createElement("style");
        style.id = "dulplicate-guests-indicator";
        document.head.append(style);
			}

      let pref = JSON.parse(localStorage.getItem("preferences") || "{}");
      if(!pref.hasOwnProperty("guestsManagement")) pref.guestsManagement = {};
      if(!pref.guestsManagement.hasOwnProperty(vm.room.id)) pref.guestsManagement[vm.room.id] = {duplicateGuestsMessage : "歡迎回來"};
      let msg = pref.guestsManagement[vm.room.id].duplicateGuestsMessage;  
      msg = prompt("請輸入當客人重複進房之自訂訊息：(留空則不會發送)", msg);
      if(!msg) return;
      pref.guestsManagement[vm.room.id].duplicateGuestsMessage = msg;
      localStorage.setItem("preferences", JSON.stringify(pref));
      
 			if (!localStorage.hasOwnProperty("guests_" + vm.room.id))
				localStorage.setItem("guests_" + vm.room.id, JSON.stringify([]));
			
      document.getElementById("record-guests-button").remove();
      action.handleRecordGuests(vm.guests);
      document.getElementById("limit-guest-wrapper").classList.remove("d-none");
		},
    handleRecordGuests(to, from){
      if (!!document.getElementById("record-guests-button")) return;
      let vm = __guest__instance__,
          style = document.getElementById("dulplicate-guests-indicator"),
          guests = JSON.parse(localStorage.getItem("guests_" + vm.room.id)) || [],
          timestamp = (new Date()).toJSON();

      let old_invited = Array.isArray(from) ? from.filter(x=>x.status=="完成邀請") : [],
          new_invited = to.filter(x=>x.status=="完成邀請");
      if (old_invited.length != new_invited.length) {
        let newlyInvited = new_invited.filter(g => old_invited.every(old => old.id != g.id));
        newlyInvited.forEach(n => {if(guests.every(x => n.id != x.id)) guests.push({id: n.id, name: n.name, time: timestamp, invited: true, left: false, warned: false}); });
      }
      if (from && to.length != from.length){
        let guestsLeft = from.filter(g => to.every(old => old.id != g.id));
        guestsLeft.forEach(g => {
          let guestInList = guests.find(x => x.id == g.id);
          guestInList.warned = false;
          guestInList.left = true;
        });
      }

      let warningList = guests.filter(g=> to.some(x=> x.id == g.id && x.status != "完成邀請") && g.left),
          requeueList = guests.filter(g=> to.some(x=> x.id == g.id && x.status != "完成邀請") && !g.left),
          styles = "",
          pref = JSON.parse(localStorage.getItem("preferences") || "{}"),
          msg = pref.guestsManagement[vm.room.id].duplicateGuestsMessage;
      
      if(warningList.length > 0) styles += warningList.map(x => "[uid='" + x.id + "']").join(", ") + "{background: yellow;}";
      if(requeueList.length > 0) styles += requeueList.map(x => "[uid='" + x.id + "']").join(", ") + "{background: papayawhip;}";
      
      style.innerHTML = styles;
      if(msg.length > 0) warningList.forEach(x => {
        let guestInList = guests.find(y=> y.id == x.id)
        if(guestInList && !guestInList.warned){
        	let guestObj = to.find(y=> y.id == x.id);
          setTimeout( ()=>{
        	   action.msgSend("@" + guestObj.name + " " + msg, false);
             guestInList.warned = true;
          }, 2000 + Math.floor(Math.random() * 1000));
        }
      });
      localStorage.setItem("guests_" + vm.room.id, JSON.stringify(guests));
    },
    limitGuests(){
    	let vm = __vue__instance__,
          limitGuestCount = document.getElementById("limit-guest-count"),
          invitedGuestCount = document.getElementById("invited-guest-count");
      if(limitGuestCount.value > 0) {
        invitedGuestCount.classList.remove("d-none");
        invitedGuestCount.nextElementSibling.classList.remove("d-none");
        setTimeout( ()=>{
          let newLimitGuestCount = document.getElementById("limit-guest-count").value;
          if(limitGuestCount.value == newLimitGuestCount) {
            let guests = JSON.parse(localStorage.getItem("guests_" + vm.room.id)) || [],
                invitedCount = guests.filter(x => x.invited).length,
                servedCount = guests.filter(x => x.invited && x.left).length,
                roomLimit = limitGuestCount.value - servedCount;
            if(roomLimit != vm.room.limit && !isNaN(roomLimit)){
               if(roomLimit > 0 && limitGuestCount.value > 0) vm.room.limit = "" + roomLimit;
               else vm.room.close = true;
               vm.updateRoom();
            }
            document.getElementById("invited-guest-count").innerHTML = invitedCount;
          }
        }, 3000);
      }
      let pref = JSON.parse(localStorage.getItem("preferences") || "{}");
      if(!pref.hasOwnProperty("guestsManagement")) pref.guestsManagement = {};
      if(!pref.guestsManagement.hasOwnProperty(vm.room.id)) pref.guestsManagement[vm.room.id] = {duplicateGuestsMessage : "歡迎回來", guestCount: limitGuestCount.value};
      else pref.guestsManagement[vm.room.id].guestCount = limitGuestCount.value;
      localStorage.setItem("preferences", JSON.stringify(pref));
    },
    handleLimitGuests(to, from){
      let vm = __vue__instance__,
          limitGuestCount = document.getElementById("limit-guest-count");
      if(limitGuestCount.value == 0 || !!document.getElementById("record-guests-button")) return;
      let guests = JSON.parse(localStorage.getItem("guests_" + vm.room.id)) || [],
          invitedCount = guests.filter(x => x.invited).length,
          servedCount = guests.filter(x => x.invited && x.left).length,
          roomLimit = limitGuestCount.value - servedCount;
      if(vm.room.limit != roomLimit && !isNaN(roomLimit)){
         if(roomLimit > 0 && limitGuestCount.value > 0) vm.room.limit = "" + roomLimit;
         else vm.room.close = true;
         vm.updateRoom();
      }
      document.getElementById("invited-guest-count").innerHTML = invitedCount;
    },
		clearGuestsList() {
			let vm = __chat__instance__,
        style = document.getElementById("dulplicate-guests-indicator"); 
      if (style) style.innerHTML = "";
      localStorage.removeItem("guests_" + vm.room.id);
      alert("清空已邀請客人列表成功");
		},
		startChatbot() {
			let vm = __vue__instance__;
			vm.$watch("chat", function(to, from) {
				if (window.onReceiveMessage) {
					let newMsg = to[to.length - 1]
					if (newMsg && newMsg.user != vm.room.id) window.onReceiveMessage(newMsg);
				}
			});
			if (this) this.remove();
		},
		chatForward() {
			let vm = __vue__instance__;
			vm.$watch("chat", function(to, from) {
				if (localStorage.getItem("forward_url")) {
					let newMsg = to[to.length - 1]
					if (newMsg && newMsg.user != vm.room.id) {
						let url = localStorage.getItem("forward_url");
						url = url.replace(/{{NAME}}/g, newMsg.name).replace(/{{MSG}}/g, newMsg.msg);
						fetch(url);
					};
				}
			});
			if (this) this.remove();
		},
		profilesAdd() {
			let vm = __vue__instance__,
				obj = JSON.parse(localStorage.getItem("profiles")),
				r = Object.assign({}, vm.room);

			if (!obj) obj = {
				current: 0,
				list: []
			};
			['auto_stamp', 'created_at', 'guests', 'last_action_at', 'like', 'order', 'password', 'style', 'updated_at'].forEach(e => delete r[e]);
			obj.list.push(r);
      obj.current = obj.list.length - 1;

			localStorage.setItem("profiles", JSON.stringify(obj));

			let button = document.querySelector("#current-profile .v-btn__content");
			button.textContent = (1 + obj.current) + "/" + obj.list.length;
      
      let restoreButton = document.getElementById("restore-profile");
      if(!!restoreButton) restoreButton.remove();
		},
    profilesRestore() {
			let vm = __vue__instance__,
				obj = JSON.parse(localStorage.getItem("profiles"));

			Object.assign(vm.room, obj.list[obj.current]);
      vm.clickUpdateRoom();
      let restoreButton = document.getElementById("restore-profile");
      if(!!restoreButton) restoreButton.remove();
		},
		profilesSave() {
			let vm = __vue__instance__,
				obj = JSON.parse(localStorage.getItem("profiles")),
				r = Object.assign(obj.list[obj.current], vm.room);
			['auto_stamp', 'created_at', 'guests', 'last_action_at', 'like', 'order', 'password', 'style', 'updated_at'].forEach(e => delete r[e]);

			localStorage.setItem("profiles", JSON.stringify(obj));
			let button = document.querySelector("#current-profile .v-btn__content");
			button.textContent = (1 + obj.current) + "/" + obj.list.length;
      
      let restoreButton = document.getElementById("restore-profile");
      if(!!restoreButton) restoreButton.remove();
			alert("已成功更新！");
		},
		profilesToggle() {
			let vm = __vue__instance__,
				obj = JSON.parse(localStorage.getItem("profiles"));
			obj.current++;

			if (obj.current >= obj.list.length) obj.current = 0;
			Object.assign(vm.room, obj.list[obj.current]);
			
			let button = document.querySelector("#current-profile .v-btn__content");
			button.textContent = (1 + obj.current) + "/" + obj.list.length;
			localStorage.setItem("profiles", JSON.stringify(obj));
            
      window.action.profilesCountdownUpdate();
      let restoreButton = document.getElementById("restore-profile");
      if(!!restoreButton) restoreButton.remove();
		},
		profilesRemove() {
			let vm = __vue__instance__,
				obj = JSON.parse(localStorage.getItem("profiles"));
			obj.list.splice(obj.current, 1);

			if (obj.current >= obj.list.length) obj.current = 0;
			Object.assign(vm.room, obj.list[obj.current]);
      
			let button = document.querySelector("#current-profile .v-btn__content");
			button.textContent = (1 + obj.current) + "/" + obj.list.length;
			localStorage.setItem("profiles", JSON.stringify(obj));
            
      window.action.profilesCountdownUpdate();
      let restoreButton = document.getElementById("restore-profile");
      if(!!restoreButton) restoreButton.remove();
		},
    profilesCountdownUpdate(){
      let vm = __vue__instance__,
				obj = JSON.parse(localStorage.getItem("profiles")),
          roomTitle = obj.list[obj.current].room;
      
      setTimeout( ()=>{
        let newObj = JSON.parse(localStorage.getItem("profiles")),
            newRoomTitle = newObj.list[newObj.current].room;
        if(roomTitle == newRoomTitle) vm.clickUpdateRoom();
      }, 3000);
    },
    msgStrikethrough(){
      let vm = __chat__instance__;
      if(vm.msg.trim().length == 0) return;
			vm.$socket.emit('message', {
				room: vm.room.id,
				name: vm[vm.user.id ? "user" : "pUser"].name,
				user: vm[vm.user.id ? "user" : "pUser"].id,
				info: 0,
				msg: "~~" + vm.msg + "~~",
			});
      vm.msg = "";
      vm.$refs.msg.$el.querySelector('input').focus();
    },
    msgItalic(){
      let vm = __chat__instance__;
      if(vm.msg.trim().length == 0) return;
			vm.$socket.emit('message', {
				room: vm.room.id,
				name: vm[vm.user.id ? "user" : "pUser"].name,
				user: vm[vm.user.id ? "user" : "pUser"].id,
				info: 0,
				msg: "*" + vm.msg + "*",
			});
      vm.msg = "";
      vm.$refs.msg.$el.querySelector('input').focus();
    },
    msgBold(){
      let vm = __chat__instance__;
      if(vm.msg.trim().length == 0) return;
			vm.$socket.emit('message', {
				room: vm.room.id,
				name: vm[vm.user.id ? "user" : "pUser"].name,
				user: vm[vm.user.id ? "user" : "pUser"].id,
				info: 0,
				msg: "**" + vm.msg + "**",
			});
      vm.msg = "";
      vm.$refs.msg.$el.querySelector('input').focus();
    },
    msgAdd(){
      let msg = prompt("請輸入自訂訊息：", "你好");
      if(msg){
        let pref = JSON.parse(localStorage.getItem("preferences") || "{}");
        if(!pref.hasOwnProperty("predefinedMessages")) pref.predefinedMessages = [];
        let messages = pref.predefinedMessages;
        messages.push(msg);
        localStorage.setItem("preferences", JSON.stringify(pref));
        window.action.msgButtonGroupGenerate();
      }
    },
    msgSend(text, withTag = true){
      let vm = __chat__instance__,
          msgHasTag = withTag && vm.msg.startsWith("@") && vm.msg.endsWith(" ");
      vm.$socket.emit('message', {
				room: vm.room.id,
				name: vm[vm.user.id ? "user" : "pUser"].name,
				user: vm[vm.user.id ? "user" : "pUser"].id,
				info: 0,
				msg: (msgHasTag ? vm.msg : "") + text,
			});
      if(msgHasTag) vm.msg = "";
    },
    msgRemove(){
      let pref = JSON.parse(localStorage.getItem("preferences") || "{}");
      if(!pref.hasOwnProperty("predefinedMessages")) pref.predefinedMessages = [];
      let messages = pref.predefinedMessages;
      if(messages.length == 0) return;
      let hint = messages.map( (msg,i) => msg + "(" + (i+1) + ")" ), index, selection;
    	do{
        selection = window.prompt("請輸入想移除自訂訊息之次序： 【提示：" + hint.join(", ") + "】" , "");
    		index = parseInt(selection, 10);
			}while(selection != null && (isNaN(index) || index > messages.length || index < 1));
      if(index){
        messages.splice( (index - 1), 1);
       	localStorage.setItem("preferences", JSON.stringify(pref));
        window.action.msgButtonGroupGenerate(); 
      }
    },
    msgButtonGroupGenerate(){
      let createButton = (textContent) => {
				let b = document.createElement("button");
        b.classList.add("ma-1", "v-btn", "v-btn--outlined", "v-size--small", "theme--dark", "green--text");
				let bContent = document.createElement("span");
				bContent.classList.add("v-btn__content")
				bContent.textContent = textContent;
				b.append(bContent);
				b.addEventListener('click', ()=> window.action.msgSend(textContent), false);
				return b;
			};
      let buttonGroup = document.getElementById("predefined-message-button-group");
      let pref = JSON.parse(localStorage.getItem("preferences") || "{}");
      if(!pref.hasOwnProperty("predefinedMessages")) pref.predefinedMessages = [];
      let messages = pref.predefinedMessages;
      buttonGroup.innerHTML = "";
      buttonGroup.append( ...messages.map( msg => createButton(msg) ));
    },
    likeIndicator(){
			let vm = __vue__instance__, 
          style = document.getElementById("like-indicator");
			if(!style){
				style = document.createElement("style");
        style.id = "like-indicator";
        document.head.append(style);
			}
			vm.$watch("likes", function(to, from) {
        let i,j, temporary, chunk = 50, 
            styles = "[uid]{text-underline-offset: 0.5px; text-underline-position: from-font; text-decoration-skip-ink: none;}";
				for (i = 0,j = to.length; i < j; i += chunk) {
    			temporary = to.slice(i, i + chunk);
          styles += (i == 0 ? "" : "\n") + temporary.map(x=> "[uid='" + x.user + "']").join(", ") + "{text-decoration: underline lightgreen dotted; text-decoration-thickness: 4px;}";
				}
        style.innerHTML = styles;
			}, {
				deep: false, immediate: true,
			});
      if(this) this.remove();
    },
    makeContainerFluid(){
      let vm = __vue__instance__;
      vm.$el.firstChild.classList.add("container--fluid");
    	if(this) this.remove();
    },
    adjustColumn(column){
      let size = prompt("請輸入元素佔據畫面之多少列：(最大為12，若希望佔據一半的畫面，請輸入6)", "12");
      if(size == null || isNaN(size)) return;

      let vm = __vue__instance__,
          container = vm.$el.firstChild.firstChild,
          index = 0;
      if(column =="notice") index = 0;
      else if(column == "guests") index = 1;
      else if(column == "chat") index = 2;
      
      let el = container.children[index];
      for (let i = el.classList.length - 1; i >= 0; i--) {
    		const className = el.classList[i];
    		if (className.startsWith('col-lg')) {
		        el.classList.remove(className);
		    }
			}
      el.classList.add("col-lg-" + size);
    },
    scrollTo(position){
      if (position == "top")
    		window.scrollTo({ top: 0, behavior: "smooth" });
      else if (position == "bottom")
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    },
	};

	// initialize-plugin
	let createActionCard = () => {
		let card = document.createElement("div"), w = typeof unsafeWindow == "undefined" ? window : unsafeWindow, action = w.action;
		card.classList.add("v-card", "mt-2");
		card.innerHTML = `<div class="v-card__title">進階操作<span class="mr-auto"></span></div>`;
    createIconButton("arrow-collapse-up", {onClick: () =>action.scrollTo("top"), target: card.querySelector(".v-card__title"), title: "回到頁面頂部"});
    createIconButton("arrow-collapse-down", {onClick: () =>action.scrollTo("bottom"), target: document.querySelector("#room .row > .col-12 .v-card__title .push-right"), title: "回到頁面底部"});
		let cardText = document.createElement("div");
		cardText.classList.add("v-card__text");
		card.append(cardText);
		let cardActions = document.createElement("div");
		cardActions.classList.add("v-card__actions");
		cardActions.style = "font-size: .75rem; flex-direction: column; align-items: flex-start;";
		cardActions.setAttribute("id", "output");
		card.append(cardActions);
		document.querySelector("#room .col-sm-6").append(card);

		let el = document.querySelector("#room .col-12:nth-child(3) .v-card");
		el.setAttribute("id", "chat-vue-instance");

		let rowA = createRow("溫柔操作 (只影響自己)");
		createButton("解除訊息量限制", action.bypassChatLimit, rowA[2], "blue-grey");
		createButton("房間列表", action.roomList, rowA[2], "teal");
    createButton("已讚好提示", action.likeIndicator, rowA[2], "light-green");
    cardText.append(rowA[0]);

		//let rowB = createRow("方便房主的操作");
		// createButton("訊息轉發", action.chatForward, rowB[2], "indigo");

    let profiles = JSON.parse(localStorage.getItem("profiles")),
        profileIndicator = profiles ? ((1 + profiles.current) + "/" + profiles.list.length) : ("請新增以便切換"),
        rowB = createRow("房間資訊");
    createIconButton("plus", {onClick: action.profilesAdd, target: rowB[2], color: "purple", title: "把現時房間資訊新增到一個設定檔"});
    createIconButton("content-save", {onClick: action.profilesSave, target: rowB[2], color: "purple darken-1", title: "更新現時的設定檔，並儲存到本地端"});
    createButton(profileIndicator, action.profilesToggle, rowB[2], "purple darken-2", "current-profile", ["text"]);
    createIconButton("backup-restore", {onClick: action.profilesRestore, target: rowB[2], color: "purple accent", id: "restore-profile", title: "從本地端的設定檔回復房間資訊，包括置頂訊息"});
    createIconButton("delete", {onClick: action.profilesRemove, target: rowB[2], color: "purple darken-3", title: "刪除現時的設定檔，並切換到下一個設定檔"});
    cardText.append(rowB[0]);
    
    let rowC = createRow("客人管理");
    // createButton("開始自訂回覆訊息", action.startChatbot, rowC[2], "indigo");
    createButton("重複進房提示", action.recordGuests, rowC[2], "deep-orange darken-4", "record-guests-button");
		createButton("清空", action.clearGuestsList, rowC[2], "deep-orange darken-4");
    let div = document.createElement("div");
    div.id = "limit-guest-wrapper";
    div.classList.add("ma-1", "d-none");
    div.innerHTML = `<span id="invited-guest-count" title="已邀請客人數量">0</span><span class="mx-1">/</span>
		<input id="limit-guest-count" type="number" class="hide-arrows border-bottom" style="width: 30px; text-align: center;" min="0" value="0" title="總接待客人數量">`;
    div.getElementsByTagName("input")[0].addEventListener('change', action.limitGuests, false);
    rowC[2].appendChild(div);
    cardText.append(rowC[0]);

    
    let chat = document.getElementById("chat"), chatArea = document.createElement("div");
    chatArea.classList.add("v-sheet", "mb-2");
    
    let chatAreaRowA = document.createElement("div");
    chatAreaRowA.classList.add("d-flex", "align-center", "flex-wrap", "px-2");
    
    createIconButton("emoticon", {onClick: action.emoji, target: chatAreaRowA, color: "yellow darken-3", title: "顏文字鍵盤"});
    createIconButton("format-strikethrough-variant", {onClick: action.msgStrikethrough, target: chatAreaRowA, color: "grey darken-1", title: "為訊息加上刪除線並送出 (訊息前後新增~~)"});
    createIconButton("format-italic", {onClick: action.msgItalic, target: chatAreaRowA, color: "grey darken-2", title: "為訊息設定為斜體並送出 (訊息前後新增*)"});
    createIconButton("format-bold", {onClick: action.msgBold, target: chatAreaRowA, color: "grey darken-3", title: "為訊息設定為粗體並送出 (訊息前後新增**)"});
    chatArea.append(chatAreaRowA);
    
    if (localStorage.getItem("cheat") == "true") {
      let chatAreaRowB = document.createElement("div");
      chatAreaRowB.classList.add("d-flex", "align-center", "ml-auto");
      let chatAreaRowBSubheader = document.createElement("div"), chatAreaRowBButtons = document.createElement("div");
      chatAreaRowBSubheader.classList.add("v-subheader", "theme--light");
      chatAreaRowBSubheader.textContent = "請慎重使用：";
      chatAreaRowBButtons.classList.add("d-flex", "align-center");
      createIconButton("fire", {onClick: action.firework, target: chatAreaRowBButtons, color: "red darken-3", title: "施放煙火 (無視讚的數量)"});
      createIconButton("music-note", {onClick: action.youtube, target: chatAreaRowBButtons, color: "brown", title: "播放音樂 (在他人的房間亦可用)"});
      createIconButton("account-plus", {onClick: action.invite, target: chatAreaRowBButtons, color: "green darken-3", title: "邀請客人進房"});
      createIconButton("account-minus", {onClick: action.kick, target: chatAreaRowBButtons, color: "red", title: "請離客人"});
      chatAreaRowB.append(chatAreaRowBSubheader, chatAreaRowBButtons);
      chatAreaRowA.append(chatAreaRowB);
    }
    let chatAreaRowC = createRow("自訂訊息");
    createIconButton("plus", {onClick: action.msgAdd, target: chatAreaRowC[2], color: "teal", title: "新增自訂訊息 (輸入訊息然後按確定)"});
    let chatAreaRowCButtons = document.createElement("div");
    chatAreaRowCButtons.classList.add("d-flex", "align-center", "flex-wrap");
    chatAreaRowCButtons.setAttribute("id", "predefined-message-button-group");
    chatAreaRowCButtons.style.maxWidth = "calc(100% - 72px)";
    chatAreaRowC[2].append(chatAreaRowCButtons);

    createIconButton("delete", {onClick: action.msgRemove, target: chatAreaRowC[2], color: "teal", title: "刪除已設定的自訂訊息"});
    chatArea.append(chatAreaRowC[0]);
    
    let chatAreaRowD = createRow("畫面調整");
    createButton("移除最大寬度限制", action.makeContainerFluid, chatAreaRowD[2], "grey darken-2");
		createButton("公告", ()=> action.adjustColumn("notice"), chatAreaRowD[2], "grey darken-2");
    createButton("排隊名單", ()=> action.adjustColumn("guests"), chatAreaRowD[2], "grey darken-2");
    createButton("即時對話", ()=> action.adjustColumn("chat"), chatAreaRowD[2], "grey darken-2");
    chatAreaRowD[0].classList.remove("d-flex");
    chatAreaRowD[0].classList.add("d-none", "d-lg-flex");
    chatArea.append(chatAreaRowD[0]);
    let roomAbstractInfo = document.createElement("div");
    roomAbstractInfo.setAttribute("id", "room-abstract-info");
    roomAbstractInfo.classList.add("d-md-none");
    roomAbstractInfo.innerHTML = `<div class="v-subheader theme--light">客人數量：<span></span></div>`;
    chatArea.append(roomAbstractInfo);
    
    chat.parentNode.insertBefore(chatArea, chat.nextSibling.nextSibling);
	};


	loadScript({
		src: "https://kraaden.github.io/autocomplete/autocomplete.js"
	});
	let stylesheet = document.createElement("link");
	Object.assign(stylesheet, {
		type: "text/css",
		rel: "stylesheet",
		href: "https://kraaden.github.io/autocomplete/autocomplete.css"
	});
	document.head.appendChild(stylesheet);

	let txt = "window.action = {" + Object.values(action).map(fn => fn.toString()).join(",") + "};";
	txt = txt.replace(/__vue__instance__/g, `document.getElementById("room").__vue__`)
		.replace(/__chat__instance__/g, `document.getElementById("chat-vue-instance").__vue__.$parent`)
		.replace(/__guest__instance__/g, `document.querySelector("#room .col-12:nth-child(2) .v-card").__vue__.$parent`)
  	.replace(/__record__instance__/g, `document.querySelector(".v-dialog__container:nth-of-type(3)").__vue__.$parent`)
		.replace(/unsafeWindow/g, `window`);
	loadScript({
		txt: txt
	});

	let button = createButton("開始", () => {
		createActionCard();
		document.getElementById("initialize-plugin-btn").remove();
	}, document.body);
	button.style = "position: fixed; bottom: 16px; right: 16px; background: purple; font-size: 18px;";
	button.classList.remove("v-size--small");
	button.classList.add("v-size--large");
	button.setAttribute("id", "initialize-plugin-btn");

	// try auto create action card, stop trying after 30 seconds
	function waitForElement(elementId, callBack, timeout) {
		let timestamp = new Date();
		timestamp.setTime(timestamp.getTime() + timeout);

		function core(elementId, callBack) {
			let now = new Date();
			if (now - timestamp < 0) {
				setTimeout(function() {
					var element = document.getElementById(elementId);
					if (element) {
						callBack(elementId, element);
					} else {
						core(elementId, callBack);
					}
				}, 500);
			}
		}
		core(elementId, callBack);
	}
	waitForElement("chat", function() {
		createActionCard();
		document.getElementById("initialize-plugin-btn").remove();
    let b = createButton("postInitializationAction", (typeof unsafeWindow == "undefined" ? window : unsafeWindow).action.postInitializationAction, document.body);
    setTimeout( ()=>{ b.click(); b.remove(); }, 500);
	}, 30000);


	// var s = document.createElement("script");
	// s.type = "text/javascript";
	// s.src = "https://cdn.socket.io/3.1.1/socket.io.min.js";
	// document.body.append(s);
	// let socket = io.connect();

	console.log('Plugin installed.');
})();