// ==UserScript==
// @name         Better OWOT
// @name:ru      Лучше OWOT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This makes OWOT better by adding new stuff to menu like showing and hiding chat, enabling notifications and more!
// @description:ru Это делает OWOT лучше, добавляя в меню новые функции, такие как отображение и скрытие чата, включение уведомлений и многое другое!
// @author       You
// @match        https://ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458175/Better%20OWOT.user.js
// @updateURL https://update.greasyfork.org/scripts/458175/Better%20OWOT.meta.js
// ==/UserScript==
console.log("Warning!\nDo not paste anything here that might get your IP or token!");
(function() {
     'use strict';
	let title = document.title;
	let newMessageCount = 0;
	let isFocused = true;
	let notificationsOn = localStorage ? !localStorage.notificationsOn || localStorage.notificationsOn === "true" : true;

	window.addEventListener("blur", () => isFocused = false);
	window.addEventListener("focus", () => isFocused = true);

	if (window.Notification){
		Notification.requestPermission();
	}

	OWOT.on("chat", (event) => {
		if (!isFocused || !chatOpen){
			newMessageCount++;
			document.title = `(${newMessageCount}) ${title}`;

			if (notificationsOn && window.Notification && !isFocused && Notification.permission === "granted"){
				let notifText;

				if (event.type === "anon") notifText = `[${event.id}]: ${event.message}`;
				else if (event.type === "anon_nick") notifText = `[*${event.id}] ${event.nickname}: ${event.message}`;
				else notifText = `${event.nickname}: ${event.message}`;

				if (event.op) notifText = "(OP) " + notifText;
				else if (event.admin) notifText = "(Admin) " + notifText;
				else if (event.staff) notifText = "(Staff) " + notifText;
				else if (event.realUsername === "gateway") notifText = "(Discord) " + notifText;

				let notif = new Notification(`OWOT Chat (${event.location === "page" ? "World /" + (location.pathname.substr(1) || "main") : "Global"})`, {
					body:notifText,
					icon:"https://ourworldoftext.com/static/favicon.png",
				});

				notif.addEventListener("click", () => {
					window.focus();
					chat_open.click();
					(event.location === "page" ? chat_page_tab : chat_global_tab).click();
					let chatFieldElement = event.location === "page" ? page_chatfield : global_chatfield;
					chatFieldElement.scroll(0, chatFieldElement.scrollHeight);
					notif.close();
				});

				setTimeout(() => notif.close(), 5000);
			}
		}
	});

	function setNotificationsOn(flag){
		notificationsOn = flag;

		if (localStorage){
			localStorage.notificationsOn = flag;
		}
	}

	OWOT.menu.addCheckboxOption("Chat Notifications", () => setNotificationsOn(true), () => setNotificationsOn(false), notificationsOn);

	setInterval(() => {
		if (isFocused && chatOpen && newMessageCount > 0){
			document.title = title;
			newMessageCount = 0;
		}
	}, 100);
var removezoombar = document.getElementById("zoombar");
if (w.menu.show) {
removezoombar.remove();
}
(() => {
    if (Permissions.can_chat(state.userModel, state.worldModel)) return;

    let w_url = `ws${window.location.protocol == "https:" ? "s" : ""}://${
        window.location.host
    }/w${state.worldModel.pathname}/ws/${window.location.search || ""}`;
    let sock = new WebSocket(w_url);

    sock.onopen = () => {
        window.selectedChatTab = 0;
        ws_functions.propUpdate({props: [{type: "chat", value: 0}]});
        w.showChat();
        elm.chat_open.style.backgroundColor = "#990000";
        elm.total_unread.style.color = "#FFFF00";

        sock.onmessage = msg => {
            let data = JSON.parse(msg.data);
            if (data.kind.startsWith("chat")
               || ["channel", "user_count"].includes(data.kind)) {
                ws_functions[data.kind](data);
            }
        };

        sock.send(JSON.stringify({ kind: "chathistory" }));
        w.on("chat", e => {
            w.emit("chatmod", e);
            if (e.hide) return;
            event_on_chat(e);
        });
        
        network.chat = (message, location, nickname, color) => {
            sock.send(JSON.stringify({
                kind: "chat",
                nickname,
                message,
                location,
                color,
            }));
        };
    };
})();
(function(){ OWOT.menu.addCheckboxOption("Render all links", () => {linksRendered = true;renderTiles(true);}, () => {linksRendered = false;renderTiles(true);}, true); })();
OWOT.menu.addCheckboxOption("Show chat", () => w.showChat(), () => w.hideChat())
Permissions.can_paste = function() {return true;};
(function() { clearInterval(writeInterval); writeInterval = setInterval(function() { if(!writeBuffer.length || (write_busy && writeBuffer.length < 50)) return; try { flushWrites(); } catch(e) { console.log(e); } }, 10); })();
})();