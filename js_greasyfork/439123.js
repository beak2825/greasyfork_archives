// ==UserScript==
// @name         Bonk Playlists
// @version      6.0
// @author       Salama
// @description  Adds map playlists to bonk.io
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/439123/Bonk%20Playlists.user.js
// @updateURL https://update.greasyfork.org/scripts/439123/Bonk%20Playlists.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

let injector = (str) => {
	let newStr = str;
window.playlists = {};
window.playlists.edit = false;
window.playlists.autofav = false;
window.playlists.editing = false;
window.playlists.categoryFunc = ()=>{};
window.playlists.mapLoader = ()=>{};
window.playlists.menuFunctions = {};
window.playlists.toolFunctions = {};
window.playlists.setMapsLoaded = ()=>{};
window.playlists.setMapsLoadFinished = ()=>{};
window.playlists.bigClass = {};

let token = null;
window.playlists.merge = {
	enabled: false,
	from: {
		element: null,
		index: null
	},
	to: {
		element: null,
		index: null
	}
};
let dropdownOption = document.createElement('div');
let playlistsButton = document.createElement('div');
let toolbox = document.createElement('div');
//Insert before favs
document.getElementById("maploadtypedropdown").insertBefore(dropdownOption, document.getElementById("maploadtypedropdownoption1"));

// Monitor style changes
const dropdownObserver = new MutationObserver(() => {
	document.getElementById("maploadtypedropdownoptionplaylists").style.display = document.getElementById("maploadtypedropdownoption1").style.display;
	document.getElementById("maploadtypedropdownoptionplaylists").onclick = () => {
		document.getElementById("maploadtypedropdowntitle").innerHTML = "MY PLAYLISTS";
		window.playlists.categoryFunc("blank", true);
		window.playlists.categoryFunc("playlists", true);
		document.getElementById("maploadwindowsearchoptions").style.visibility = "hidden";
		document.getElementById("maploadwindowhotnessslider").style.visibility = "hidden";
		document.getElementById("maploadwindowsearchinput").style.visibility = "hidden";
		document.getElementById("maploadwindowsearchbutton").style.visibility = "hidden";
		document.getElementById("maploadwindowtoolbox").style.display = "flex";
		getPlaylists();
	};
	if(document.getElementById("maploadtypedropdowntitle").innerHTML === "MY PLAYLISTS") {
		document.getElementById("maploadwindowplaylistbackbutton").style.display = "block";
		document.getElementById("maploadwindowtoolbox").style.display = "flex";
		document.getElementById("maploadwindowmapscontainer").style.bottom = "28px";
		document.getElementById("maploadwindowmapscontainer").style.height = "calc(100% - 108px - 23px)";
		document.getElementById("maploadwindowsearchinput").style.visibility = "hidden";
		document.getElementById("maploadwindowsearchbutton").style.visibility = "hidden";
	}
	else {
		// Might conflict with future mods
		document.getElementById("maploadwindowplaylistbackbutton").style.display = "none";
		document.getElementById("maploadwindowtoolbox").style.display = "none";
		document.getElementById("maploadwindowmapscontainer").style.removeProperty("bottom");
		document.getElementById("maploadwindowmapscontainer").style.removeProperty("height");
		document.getElementById("maploadwindowsearchinput").style.removeProperty("visibility");
		document.getElementById("maploadwindowsearchbutton").style.removeProperty("visibility");
		if(window.playlists.edit) {
			document.getElementById("maploadwindowplaylistedit").click();
		}
		if(window.playlists.merge.enabled) {
			document.getElementById("maploadwindowplaylistmerge").click();
		}
	}
	document.getElementById("maploadwindowplaylistbackbutton").onclick = document.getElementById("maploadtypedropdownoptionplaylists").onclick;
	document.getElementById("maploadtypedropdownoptionplaylists").onmouseenter = document.getElementById("maploadtypedropdownoption1").onmouseenter;
	document.getElementById("maploadtypedropdownoptionplaylists").onmouseleave = document.getElementById("maploadtypedropdownoption1").onmouseleave;
	document.getElementById("maploadtypedropdownoptionplaylists").onmousedown = document.getElementById("maploadtypedropdownoption1").onmousedown;

	document.getElementById("maploadwindowplaylistbackbutton").onmouseenter = document.getElementById("maploadtypedropdownoption1").onmouseenter;
	document.getElementById("maploadwindowplaylistbackbutton").onmouseleave = document.getElementById("maploadtypedropdownoption1").onmouseleave;
	document.getElementById("maploadwindowplaylistbackbutton").onmousedown = document.getElementById("maploadtypedropdownoption1").onmousedown;

});

chatObserver = new MutationObserver(e => {
	for(let mutation of e) {
		if(mutation.type == "childList") {
			for(let node of mutation.addedNodes) {
				if(node.textContent === "* Accepted commands are listed above ") {
					let helpmsg = document.createElement("div");
					mutation.target.insertBefore(helpmsg, node.previousSibling);
					helpmsg.outerHTML = '<div><span class="newbonklobby_chat_status" style="color: rgb(181, 48, 48);">/p - commands from playlists mod</span></div>';
				}
			}
		}
	}
});

chatObserver.observe(document.getElementById("newbonklobby_chat_content"), {attributes: false, childList: true, subtree: false});
dropdownObserver.observe(document.getElementById("maploadtypedropdownoption1"), {attributes: true, childList: false, subtree: true});

document.getElementById("maploadwindow").appendChild(playlistsButton);
document.getElementById("maploadwindow").appendChild(toolbox);
toolbox.outerHTML = `<div id="maploadwindowtoolbox" style="width: 100%;height: 23px;bottom: 0;position: absolute;background-color: inherit;z-index: 1;display: none;padding: 5px;">
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistedit" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">EDIT</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistmerge" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">MERGE</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistimport" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">IMPORT</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistexport" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">EXPORT</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistautofav" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">AUTOFAV</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistdeleteall" style="line-height: 23px; height: 23px; width: 125px; margin-right: 5px; display: none;">DELETE ALL</div>
</div>`;

dropdownOption.outerHTML = `<div class="dropdown-option dropdown_classic" id="maploadtypedropdownoptionplaylists" style="display: none;">MY PLAYLISTS</div>`;
playlistsButton.outerHTML = `<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistbackbutton" style="position: absolute; left: 210px; line-height: 23px; height: 23px; width: 75px; top: 57px; display: block;">BACK</div>`;

let dbRequest = indexedDB.open("salamaStorage", 1);
let db;

window.playlists.playlists = [];

window.playlists.savePlaylists = playlists => {
	try {
		let transaction = db.transaction("playlists", "readwrite");
		transaction.objectStore("playlists").put(playlists, 1);
	}
	catch(e) {
		console.log("Couln't save playlists to db: ", e)
	}
}

dbRequest.onsuccess = e => {
	db = e.target.result;
	let transaction = db.transaction("playlists");
	let getRequest = transaction.objectStore("playlists").get(1);
	getRequest.onsuccess = e => {
		window.playlists.playlists = e.target.result;
	}
}

dbRequest.onupgradeneeded = e => {
	db = e.target.result;
	let objectStore = db.createObjectStore("playlists");
	objectStore.put(JSON.parse(localStorage.playlists || "[]"), 1);
	delete localStorage.playlists;
}

window.playlists.setToken = t => {
	token = t;
}

//This is mainly meant to prevent you from accidentally importing the wrong file
const validatePlaylists = playlists => {
	try {
		let newPlaylists = JSON.parse(playlists);
		for(let playlist of newPlaylists) {
			if(!(
				Object.keys(playlist).find(i => !["name","description","image","maps","b1maps"].includes(i)) === undefined &&
				typeof(playlist.name) == "string" &&
				typeof(playlist.description) == "string" &&
				((typeof(playlist.image) == "string" &&
				playlist.image.substr(0, 5) == "data:") ||
				playlist.image == undefined) &&
				playlist.maps.filter(e => {return typeof(e)=="number"}).length == playlist.maps.length
			))
				return false;
		}
		return true;
	}
	catch {
		return false;
	}
}

document.getElementById("maploadwindowplaylistexport").addEventListener("click", () => {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = URL.createObjectURL(new Blob([JSON.stringify(window.playlists.playlists)], {type: "oclet/stream"}));
    a.download = "playlists.txt";
    a.click();
    document.body.removeChild(a);
})

document.getElementById("maploadwindowplaylistimport").addEventListener("click", () => {
    let a = document.createElement("input");
    a.type = 'file';
    document.body.appendChild(a);
    a.onchange = e => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = readerEvent => {
			let newPlaylists = readerEvent.target.result;
			if(validatePlaylists(newPlaylists)) {
				window.playlists.playlists = window.playlists.playlists.concat(JSON.parse(newPlaylists));
				window.playlists.savePlaylists(window.playlists.playlists);
				document.getElementById("maploadwindowplaylistautofav").click();
			}
        }
    };
    a.click();
    document.body.removeChild(a);
})

document.getElementById("maploadwindowplaylistautofav").addEventListener("click", async () => {
	let popup = document.createElement('div');
	document.getElementById("maploadwindow").appendChild(popup);
	popup.outerHTML = `
	<div id="maploadwindowplaylistautofavpopup" style="width: calc(100% - 200px);background-color: inherit;z-index: 1;position: absolute;left: 100px;top: 50px;height: calc(100% - 100px);filter: brightness(1.1);border-radius: 7px;">
		<div class="windowTopBar_classic" style="height: 40px;border-top-left-radius: 3px;border-top-right-radius: 3px;font-family: futurept_b1;line-height: 40px;color: #f9f9f9;font-size: 28px;text-align: center;">
			Autofav
			<div id="maploadwindowplaylistautofavprogress" style="height: 40px;font-family: monospace;line-height: 40px;color: #f9f9f9;font-size: 15px;text-align: center;right: 10px;position: absolute;top: 0px;"></div>
		</div>
		<div class="newbonklobby_chat_msg_txt" id="maploadwindowplaylistautofavstatus" style="text-align: center;top: 20px;position: relative;">Counting maps...</div>
		<div class="brownButton brownButton_classic buttonShadow" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;bottom: 10px;position: absolute;left: 20px;" id="maploadwindowplaylistautofavcancel">CANCEL</div>
		<div style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;bottom: 10px;position: absolute;right: 20px;" id="maploadwindowplaylistautofavstart" class="brownButton brownButton_classic buttonShadow brownButtonDisabled">START</div>
		<div class="brownButton brownButton_classic buttonShadow" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: none;bottom: 10px;position: absolute;left: 20px;" id="maploadwindowplaylistautofavno">NO</div>
		<div style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: none;bottom: 10px;position: absolute;right: 20px;" class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistautofavyes">YES</div>
	</div>`;
	let error = false;
	document.getElementById("maploadwindowplaylistautofavcancel").addEventListener("click", () => {
		error = "cancelled";
		document.getElementById("maploadwindowplaylistautofavpopup").remove();
		document.getElementById("maploadtypedropdownoptionplaylists").click();
	});
	let maps = [];
	const get = async count => {
		return new Promise(resolve => {
			window.$.post("https://bonk2.io/scripts/map_getfave.php", {
				token: token,
				startingfrom: 32 * count
			}).done(async e => {
				maps = maps.concat(e.maps.map(e => {return e.id}));
				error = (e.r == "success" ? false : e.r);
				if(e.more && !error) await get(count + 1);
				resolve();
			}).fail(e => {
				error = e.statusText;
				resolve();
			});
		});
	}
	await get(0);
	if(error && error != "cancelled") {
		document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nError: ${error}`;
	}
	else if(error != "cancelled") {
		if(window.playlists.playlists.length > 0) {
			maps = [...new Set(window.playlists.playlists.map(e => {return e.maps;}).reduce((a, b) => {return a.concat(b);}).filter(e => {return !maps.includes(e);}))];
		}
		else {
			maps = [];
		}
		document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\n${maps.length} maps to favorite`;
		document.getElementById("maploadwindowplaylistautofavprogress").innerText = `[${'0'.repeat((maps.length+'').length)} / ${maps.length}]`;
		if(maps.length == 0) return;
		let date = new Date();
		if(maps.length > 600) {
			document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nYou will get ratelimited due to the high amount of maps, which means that you will have to continue this after ${((date.getHours() + 1) % 24)}:00. This also means that you can't favorite maps normally before that time.`;
		}
		else if(maps.length > 580) {
			document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nYou might get ratelimited due to the high amount of maps, which means that you will have to continue this after ${((date.getHours() + 1) % 24)}:00. This would also mean that you can't favorite maps normally before that time.`;
		}
		document.getElementById("maploadwindowplaylistautofavstart").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofavstart").addEventListener("click", async () => {
			document.getElementById("maploadwindowplaylistautofavstart").classList.add("brownButtonDisabled");
			window.playlists.autofav = true;
			let count = 0;
			let notFound = [];
			for(let map of maps) {
				if(error) {
					window.playlists.autofav = false;
					return;
				}
				await window.$.post("https://bonk2.io/scripts/map_fave.php", {
					token: token,
					mapid: map,
					action: "f"
				}).done(e => {
					if(e.r === "fail") {
						switch(e.e) {
							case "map_unpublished":
							case "map_not_found":
							case "already_faved":
								notFound.push(map);
								break;
							case "token":
								document.getElementById("maploadwindowplaylistautofavstatus").innerText += "\nError: invalid token";
								break;
							case "ratelimited":
								document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nRatelimited! Please continue after ${((date.getHours() + 1) % 24)}:00.`;
								error = "ratelimited";
								break;
						}
					}
					count++;
					if(!error) document.getElementById("maploadwindowplaylistautofavprogress").innerText = `[${'0'.repeat((maps.length+'').length-(count+'').length)}${count} / ${maps.length}]`;
					
				})
			}
			window.playlists.autofav = false;
			document.getElementById("maploadwindowplaylistautofavcancel").classList.add("brownButtonDisabled");
			if(notFound.length > 0) {
				document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nSome of the playlists contain ${notFound.length} maps in total that have been hidden or deleted. Do you want to remove them?`;
				document.getElementById("maploadwindowplaylistautofavno").style.display = "block";
				document.getElementById("maploadwindowplaylistautofavyes").style.display = "block";
				document.getElementById("maploadwindowplaylistautofavstart").style.display = "none";
				document.getElementById("maploadwindowplaylistautofavcancel").style.display = "none";
				document.getElementById("maploadwindowplaylistautofavno").addEventListener("click", () => {
					document.getElementById("maploadwindowplaylistautofavpopup").remove();
					document.getElementById("maploadtypedropdownoptionplaylists").click();
				});
				document.getElementById("maploadwindowplaylistautofavyes").addEventListener("click", () => {
					for(let list of window.playlists.playlists) {
						list.maps = list.maps.filter(e => {return notFound.indexOf(e) === -1;});
					}
					window.playlists.savePlaylists(window.playlists.playlists);
					document.getElementById("maploadwindowplaylistautofavpopup").remove();
					document.getElementById("maploadtypedropdownoptionplaylists").click();
				});
			}
			else {
				document.getElementById("maploadwindowplaylistautofavyes").innerText = "DONE";
				document.getElementById("maploadwindowplaylistautofavyes").style.display = "block";
				document.getElementById("maploadwindowplaylistautofavyes").addEventListener("click", () => {
					document.getElementById("maploadwindowplaylistautofavpopup").remove();
					document.getElementById("maploadtypedropdownoptionplaylists").click();
				})
			}
		});
	}
});

document.getElementById("maploadwindowplaylistedit").addEventListener("click", e => {
	window.playlists.editing = false;
	window.playlists.edit = !window.playlists.edit;
	if(window.playlists.edit) {
		document.getElementById("maploadwindowplaylistmerge").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistimport").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistexport").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofav").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistdeleteall").style.display = "block";
		document.getElementById("maploadwindowplaylistdeleteall").innerText = "DELETE ALL";
		e.target.style.filter = "brightness(1.75)";
		document.getElementById("maploadtypedropdownoptionplaylists").click();
	}
	else {
		document.getElementById("maploadwindowplaylistedit").style.removeProperty("filter");
		document.getElementById("maploadwindowplaylistmerge").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistimport").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistexport").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofav").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistdeleteall").style.display = "none";
		window.playlists.savePlaylists(window.playlists.playlists);
		if(document.getElementById("maploadtypedropdowntitle").innerHTML === "MY PLAYLISTS") {
			document.getElementById("maploadtypedropdownoptionplaylists").click();
		}
	}
});

document.getElementById("maploadwindowplaylistmerge").addEventListener("click", e => {
	window.playlists.merge.enabled = !window.playlists.merge.enabled;
	if(window.playlists.merge.enabled) {
		window.playlists.edit = false;
		document.getElementById("maploadwindowplaylistedit").style.removeProperty("filter");
		e.target.style.filter = "brightness(1.75)";
		document.getElementById("maploadwindowplaylistedit").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistimport").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistexport").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofav").classList.add("brownButtonDisabled");
	}
	else {
		e.target.style.removeProperty("filter");
		if(window.playlists.merge.from.element !== null) {
			window.playlists.merge.from.element.style.removeProperty("filter");
			window.playlists.merge.from.element.style.visibility = "hidden";
		}
		if(window.playlists.merge.to.element !== null) {
			window.playlists.merge.to.element.style.removeProperty("filter");
			window.playlists.merge.to.element.style.visibility = "hidden";
		}
		window.playlists.merge = {
			enabled: false,
			from: {
				element: null,
				index: null
			},
			to: {
				element: null,
				index: null
			}
		};
		document.getElementById("maploadwindowplaylistedit").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistimport").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistexport").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofav").classList.remove("brownButtonDisabled");
		document.getElementById("maploadtypedropdownoptionplaylists").click();
	}
});

document.getElementById("maploadwindowplaylistdeleteall").addEventListener("click", e => {
	switch(e.target.innerText) {
		case "DELETE ALL":
			e.target.innerText = "SURE?";
			break;
		case "SURE?":
			e.target.innerText = "100% SURE?";
			break;
		case "100% SURE?":
			e.target.innerText = "FINAL WARNING";
			break;
		case "FINAL WARNING":
			e.target.innerText = "DELETE ALL";
			window.playlists.playlists = [];
			for(let playlist of [...document.getElementsByClassName("maploadwindowplaylistdiv")]) {
				playlist.style.opacity = 0.3;
				playlist.style.pointerEvents = "none";
			}
			break;
	}
})

document.getElementById("newbonklobby_mapbutton").addEventListener("click", () => {
    if(document.getElementById("maploadtypedropdowntitle").innerText === "MY PLAYLISTS") {
        document.getElementById("maploadwindowplaylistbackbutton").style.display = "block";
		document.getElementById("maploadwindowtoolbox").style.display = "flex";
		document.getElementById("maploadwindowmapscontainer").style.bottom = "28px";
		document.getElementById("maploadwindowmapscontainer").style.height = "calc(100% - 108px - 23px)";
    }
    else {
        document.getElementById("maploadwindowplaylistbackbutton").style.display = "none";
		document.getElementById("maploadwindowtoolbox").style.display = "none";
		document.getElementById("maploadwindowmapscontainer").style.removeProperty("bottom");
		document.getElementById("maploadwindowmapscontainer").style.removeProperty("height");
    }
});

const chatHandler = e => {
	if(e.keyCode === 13) {
		if(e.target.value.length > 0) {
			if(e.target.value[0] === "/") {
				let command = e.target.value.split(" ")[0].substring(1);
				let args = e.target.value.split(" ").slice(1);
				if(command === "fav") {
					console.log("Autofav = " + window.playlists.autofav);
					if(window.playlists.autofav) {
						e.target.value = "";
						window.playlists.menuFunctions.showStatusMessage("* Favoriting maps is disabled while autofav is on", "#b53030");
					}
				}
				else if(command.startsWith("p") && !Number.isNaN(Number(command.substr(1)))) {
					e.target.value = "";
					if(args[0] === "list" && command === "p") {
						window.playlists.menuFunctions.showStatusMessage("Saved playlists", "#b53030");
						for(let i = 0; i < window.playlists.playlists.length; i++) {
							window.playlists.menuFunctions.showStatusMessage("* [" + (i+1) + "] " + window.playlists.playlists[i].name, "#b53030");
						}
						return;
					}
					if(args.length === 0) {
						args[0] = parseInt(command.substr(1));
					}
					if(Number.isNaN(parseInt(args[0]))) {
						// Show help
						window.playlists.menuFunctions.showStatusMessage("* List of playlist commands:", "#b53030", true);
						window.playlists.menuFunctions.showStatusMessage("/p list", "#b53030", true);
						window.playlists.menuFunctions.showStatusMessage("/p [index]", "#b53030", true);
						return;
					}
					
					if(args[0] < 1 || args[0] > window.playlists.playlists.length) {
						if(window.playlists.playlists.length === 0) {
							window.playlists.menuFunctions.showStatusMessage("You don't have any playlists!", "#b53030");
							return;
						}
						window.playlists.menuFunctions.showStatusMessage("Playlist index must be between 1 and " + (window.playlists.playlists.length), "#b53030");
						return;
					}

					let gameSettings = window.playlists.toolFunctions.getGameSettings();
					
					if(!gameSettings.map.m.pub && gameSettings.map.dbv == 2) {
						window.playlists.menuFunctions.showStatusMessage("You can't add a private map to a playlist! If it is a Bonk 1 map, *you* need to select the map from Bonk 1 map list without starting the game. A Bonk 1 map, which is selected from a playlist, cannot be added or removed.", "#b53030");
						return;
					}

					if(gameSettings.map.m.dbv === 2 && gameSettings.map.m.date !== undefined && gameSettings.map.m.date !== null && gameSettings.map.m.date !== "") {
						if(window.playlists.playlists[args[0] - 1].maps.includes(gameSettings.map.m.dbid)) {
							window.playlists.playlists[args[0] - 1].maps.splice(window.playlists.playlists[args[0] - 1].maps.indexOf(gameSettings.map.m.dbid), 1);
							window.playlists.menuFunctions.showStatusMessage("* Map removed from playlist", "#b53030", true);
						}
						else {
							// Hacky way to favorite the map
							e.target.value = "/fav";
							window.playlists.playlists[args[0] - 1].maps.push(gameSettings.map.m.dbid);
							window.playlists.menuFunctions.showStatusMessage("* Map added to playlist", "#b53030", true);
						}
					}
					else {
						if(window.playlists.playlists[args[0] - 1].b1maps.map(e => {return e.id}).includes(gameSettings.map.m.dbid)) {
							window.playlists.playlists[args[0] - 1].b1maps.splice(window.playlists.playlists[args[0] - 1].b1maps.map(e => {return e.id}).indexOf(gameSettings.map.m.dbid), 1);
							window.playlists.menuFunctions.showStatusMessage("* Map removed from playlist", "#b53030", true);
						}
						else {
							let b1map = {
								id: gameSettings.map.m.dbid,
								name: gameSettings.map.m.n,
								authorname: gameSettings.map.m.a,
								leveldata: window.playlists.bigClass.encodeToDatabase(gameSettings.map),
								vu: gameSettings.map.m.vu,
								vd: gameSettings.map.m.vd,
								remixname: gameSettings.map.m.rxn,
								remixauthor: gameSettings.map.m.rxa,
								remixdb: gameSettings.map.m.rxdb,
								remixid: gameSettings.map.m.rxid,
								publisheddate: gameSettings.map.m.date
							}
							if(gameSettings.map.m.date === undefined || gameSettings.map.m.date === null || gameSettings.map.m.date === "" || gameSettings.map.m.vu * 1 != gameSettings.map.m.vu || gameSettings.map.m.vd * 1 != gameSettings.map.m.vd) {
								window.playlists.menuFunctions.showStatusMessage("* Map could not be added to the playlist! To add Bonk 1 maps, *you* need to select the map from Bonk 1 map list without starting the game. A Bonk 1 map, which is selected from a playlist, cannot be added or removed.", "#b53030", true);
							}
							else {
								window.playlists.playlists[args[0] - 1].b1maps.push(b1map);
								window.playlists.menuFunctions.showStatusMessage("* Map added to playlist", "#b53030", true);
							}
						}
					}
					window.playlists.savePlaylists(window.playlists.playlists);
				}
				
			}
		}
	}
}

document.getElementById("newbonklobby_chat_input").addEventListener("keydown", chatHandler, true);
document.getElementById("ingamechatinputtext").addEventListener("keydown", chatHandler, true);

const getPlaylists = () => {
	window.playlists.setMapsLoaded(false);
	window.playlists.setMapsLoadFinished(false);

	let newPlaylistButton = {
		name: "NEW PLAYLIST",
		description: "Click here to create a new playlist",
		image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="110.417px" width="160.6px"><rect style="fill:0;height:100%;width:30px;x:65.3px;y:0;"/><rect style="fill:0;height:30px;width:110.417px;x:25.091px;y:40.208px;"/></svg>`,
		maps: "new",
		b1maps: "new"
	};

	let playlistCreator = (list = {name: "", description: "", image: ""}, edit = null) => {
		let newPlaylist = document.createElement("div");
		newPlaylist.classList.add("maploadwindowmapdiv");
		newPlaylist.style.height = "200px";
		
		let encodedImage;
		let image = document.createElement("input");
		image.type = 'file';
		image.style.width = "100%";
		image.style.height = "110.417px";
		image.style.borderWidth = "1px";
		image.style.borderStyle = "solid";
		image.onchange = e => {
			let file = e.target.files[0]; 
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = readerEvent => {
				encodedImage = readerEvent.target.result;
			}
		};
	
		let title = document.createElement("input");
		title.classList.add("maploadwindowtext_picks");
		title.classList.add("maploadwindowtextname_picks");
		title.placeholder = "Playlist Name";
		title.value = list.name;
	
		let description = document.createElement("input");
		description.classList.add("maploadwindowtext_picks");
		description.classList.add("maploadwindowtextcomment_picks");
		description.placeholder = "Playlist Description";
		description.style.top = "150px";
		description.style.height = "60px";
		description.style.height = "19px";
		description.value = list.description;

		let cancelButton = document.createElement("div");
		cancelButton.classList.add("brownButton");
		cancelButton.classList.add("brownButton_classic");
		cancelButton.classList.add("buttonShadow");
		cancelButton.style.width = "calc(50% - 12px)";
		cancelButton.style.height = "25px";
		cancelButton.style.bottom = "5px";
		cancelButton.style.position = "absolute";
		cancelButton.innerText = "CANCEL";
		cancelButton.onclick = () => {
			if(edit !== null) {
				edit.style.display = "";
			}
			newPlaylist.remove();
			window.playlists.editing = false;
		};
		
		let saveButton = document.createElement("div");
		saveButton.classList.add("brownButton");
		saveButton.classList.add("brownButton_classic");
		saveButton.classList.add("buttonShadow");
		saveButton.style.width = "calc(50% - 12px)";
		saveButton.style.height = "25px";
		saveButton.style.bottom = "5px";
		saveButton.style.right = "6px";
		saveButton.style.position = "absolute";
		saveButton.innerText = "SAVE";
		saveButton.onclick = () => {
			if(edit === null) {
				window.playlists.playlists.push({
					name: title.value,
					description: description.value,
					image: encodedImage,
					maps: [],
					b1maps: []
				});
			}
			else {
				window.playlists.playlists[window.playlists.playlists.indexOf(list)] = Object.assign(window.playlists.playlists[window.playlists.playlists.indexOf(list)], {name: title.value, description: description.value, image: encodedImage === undefined ? list.image : encodedImage});
			}
			document.getElementById("maploadtypedropdownoptionplaylists").click();
			window.playlists.editing = false;
		};
	
		newPlaylist.appendChild(image);
		newPlaylist.appendChild(title);
		newPlaylist.appendChild(description);
		newPlaylist.appendChild(cancelButton);
		newPlaylist.appendChild(saveButton);
		return newPlaylist;
	}

	window.playlists.setMapsLoaded(true);
	for(let list of window.playlists.playlists.concat([newPlaylistButton])) {
		let playlist = document.createElement("div");
		playlist.classList.add("maploadwindowmapdiv");
		if(list != newPlaylistButton) playlist.classList.add("maploadwindowplaylistdiv");
		playlist.style.height = "200px";
		document.getElementById("maploadwindowmapscontainer").appendChild(playlist);
		
		let image = document.createElement("img");
		if(list.image != undefined) {
			image.src = list.image;
		}
		else {
			let color = [...list.name.substr(0,32)].reduce((a, b) => a + b.charCodeAt(0), 0) % 360;
			image.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="110.417px" width="160.6px"><rect style="fill:hsl(${color},75%,50%);height:100%;width:100%;"/></svg>`;
		}
		
		image.style.width = "160.6px";
		image.style.height = "110.417px";

		let title = document.createElement("span");
		title.classList.add("maploadwindowtext_picks");
		title.classList.add("maploadwindowtextname_picks");
		title.innerText = list.name;

		let description = document.createElement("span");
		description.classList.add("maploadwindowtext_picks");
		description.classList.add("maploadwindowtextcomment_picks");
		description.style.top = "150px";
		description.style.height = "60px";
		description.innerText = list.description;

		if(list.maps !== "new") {
			let deleteButton = document.createElement("div");
			deleteButton.style.visibility = "hidden";
			deleteButton.style.width = "50px";
			deleteButton.style.padding = "3px";
			deleteButton.style.fontSize = "16px";
			deleteButton.classList.add("maploadwindowdeletebutton");
			deleteButton.classList.add("brownButton");
			deleteButton.classList.add("brownButton_classic");
			deleteButton.classList.add("buttonShadow");
			deleteButton.innerText = "DELETE";
			deleteButton.onclick = () => {
				if(deleteButton.innerText === "DELETE") {
					deleteButton.innerText = "SURE?";
					return;
				}
				playlist.style.opacity = 0.3;
				playlist.style.pointerEvents = "none";
				window.playlists.playlists.splice(window.playlists.playlists.indexOf(list), 1);
			}

			let editButton = document.createElement("div");
			editButton.style.visibility = "hidden";
			editButton.style.left = "10px";
			editButton.style.width = "50px";
			editButton.style.padding = "3px";
			editButton.style.fontSize = "16px";
			editButton.classList.add("maploadwindowdeletebutton");
			editButton.classList.add("brownButton");
			editButton.classList.add("brownButton_classic");
			editButton.classList.add("buttonShadow");
			editButton.innerText = "EDIT";
			editButton.onclick = () => {
				playlist.style.display = "none";
				document.getElementById("maploadwindowmapscontainer").insertBefore(playlistCreator(list, playlist), playlist);
				window.playlists.editing = true;
			}

			let leftButton = document.createElement("div");
			leftButton.style.visibility = "hidden";
			leftButton.classList.add("brownButton");
			leftButton.classList.add("brownButton_classic");
			leftButton.classList.add("buttonShadow");
			leftButton.style.width = "26px";
			leftButton.style.height = "26px"
			leftButton.style.bottom = "10px";
			leftButton.style.left = "10px";
			leftButton.style.position = "absolute";
			leftButton.style.zIndex = 1;
			leftButton.innerText = "<";

			let rightButton = document.createElement("div");
			rightButton.style.visibility = "hidden";
			rightButton.classList.add("brownButton");
			rightButton.classList.add("brownButton_classic");
			rightButton.classList.add("buttonShadow");
			rightButton.style.width = "26px";
			rightButton.style.height = "26px"
			rightButton.style.bottom = "10px";
			rightButton.style.right = "10px";
			rightButton.style.position = "absolute";
			rightButton.style.zIndex = 1;
			rightButton.innerText = ">";

			leftButton.onclick = () => {
				let index = window.playlists.playlists.indexOf(list);
				if(index > 0) {
					window.playlists.playlists[index] = window.playlists.playlists.splice(index - 1, 1, window.playlists.playlists[index])[0];
					playlist.remove();
					document.getElementById("maploadwindowmapscontainer").insertBefore(playlist, document.getElementById("maploadwindowmapscontainer").children[index-1]);
					playlist.onmouseleave();
				}
			}

			rightButton.onclick = () => {
				let index = window.playlists.playlists.indexOf(list);
				if(index < window.playlists.playlists.length - 1) {
					window.playlists.playlists[index] = window.playlists.playlists.splice(index + 1, 1, window.playlists.playlists[index])[0];
					playlist.remove();
					document.getElementById("maploadwindowmapscontainer").insertBefore(playlist, document.getElementById("maploadwindowmapscontainer").children[index+1]);
					playlist.onmouseleave();
				}
			}

			let mergeButton = document.createElement("div");
			mergeButton.style.visibility = "hidden";
			mergeButton.classList.add("brownButton");
			mergeButton.classList.add("brownButton_classic");
			mergeButton.classList.add("buttonShadow");
			mergeButton.style.width = "124px";
			mergeButton.style.height = "52px"
			mergeButton.style.top = "23px";
			mergeButton.style.left = "23px";
			mergeButton.style.position = "absolute";
			mergeButton.style.zIndex = 1;
			mergeButton.style.justifyContent = "center";
			mergeButton.style.display = "flex";
			mergeButton.style.alignItems = "center";

			mergeButton.onclick = () => {
				mergeButton.style.filter = "brightness(1.75)";
				if(window.playlists.merge.from.index === null) {
					window.playlists.merge.from = {
						element: mergeButton,
						index: window.playlists.playlists.indexOf(list)
					}
				}
				else if(window.playlists.merge.from.element === mergeButton) {
					mergeButton.style.removeProperty("filter");
					window.playlists.merge.from = {
						element: null,
						index: null
					}
				}
				else {
					if(mergeButton.innerText !== "SURE?") {
						mergeButton.innerText = "SURE?";
						return;
					}
					window.playlists.merge.to = {
						element: mergeButton,
						index: window.playlists.playlists.indexOf(list)
					}
					window.playlists.playlists[window.playlists.merge.to.index].b1maps = [...new Set(
						(window.playlists.playlists[window.playlists.merge.from.index].b1maps.concat(window.playlists.playlists[window.playlists.merge.to.index].b1maps)).map(m => JSON.stringify(m))
					)].map(m => JSON.parse(m));
					window.playlists.playlists[window.playlists.merge.to.index].maps = [...new Set(window.playlists.playlists[window.playlists.merge.from.index].maps.concat(window.playlists.playlists[window.playlists.merge.to.index].maps))];
					window.playlists.playlists.splice(window.playlists.merge.from.index, 1);
					window.playlists.merge.from.element.parentElement.style.opacity = 0.3;
					window.playlists.merge.from.element.parentElement.style.pointerEvents = "none";
					window.playlists.savePlaylists(window.playlists.playlists);

					window.playlists.merge.from.element.style.removeProperty("filter");
					window.playlists.merge.from.element.style.visibility = "hidden";
					window.playlists.merge.to.element.style.removeProperty("filter");
					window.playlists.merge.to.element.style.visibility = "hidden";
					document.getElementById("maploadwindowplaylistmerge").click();
				}
			}

			playlist.onmouseenter = () => {
				if(window.playlists.editing) return;
				if(window.playlists.edit) {
					deleteButton.style.visibility = "inherit";
					editButton.style.visibility = "inherit";
					leftButton.style.visibility = "inherit";
					rightButton.style.visibility = "inherit";
				}
				else if(window.playlists.merge.enabled && window.playlists.merge.from.element !== mergeButton) {
					if(window.playlists.merge.from.index === null) {
						mergeButton.innerText = "MERGE FROM";
					}
					else {
						mergeButton.innerText = "MERGE TO";
						mergeButton.style.removeProperty("filter");
					}
					mergeButton.style.visibility = "inherit";
				}
			}
			playlist.onmouseleave = () => {
				deleteButton.style.visibility = "hidden";
				editButton.style.visibility = "hidden";
				leftButton.style.visibility = "hidden";
				rightButton.style.visibility = "hidden";
				if(window.playlists.merge.from.element !== mergeButton && window.playlists.merge.to.element !== mergeButton)
					mergeButton.style.visibility = "hidden";
			}

			playlist.appendChild(deleteButton);
			playlist.appendChild(editButton);
			playlist.appendChild(leftButton);
			playlist.appendChild(rightButton);
			playlist.appendChild(mergeButton);
		}
		else {
			playlist.id = "maploadwindowplaylistnew";
			playlist.style.display = window.playlists.edit ? "inline-block" : "none";
		}
		playlist.appendChild(image);
		playlist.appendChild(title);
		playlist.appendChild(description);
		playlist.onclick = (e) => {
			if(list.maps !== "new") {
				if(window.playlists.edit || window.playlists.merge.enabled) return;
				while(document.getElementById("maploadwindowmapscontainer").firstChild) {
					document.getElementById("maploadwindowmapscontainer").firstChild.remove();
				}
				document.getElementById("maploadwindowtoolbox").style.display = "none";
				document.getElementById("maploadwindowmapscontainer").style.removeProperty("bottom");
				document.getElementById("maploadwindowmapscontainer").style.removeProperty("height");
				document.getElementById("maploadwindowstatustext").style.visibility = "inherit";
				if((list.maps.length + list.b1maps.length) == 0) {
					document.getElementById("maploadwindowstatustext").textContent = "No Maps";
					return;
				}
				if(e.target.classList.contains("brownButton")) return;
				let foundBonk2Maps = 0;
				let addMaps = (offset = 0) => {
					$.post("https://bonk2.io/scripts/map_getfave.php", {
						token: token,
						startingfrom: offset * 32
					}).done(function (h0i, Y0i) {
						if (arguments[0].r != "success") {
							document.getElementById("maploadwindowstatustext").style.visibility = "inherit";
							document.getElementById("maploadwindowstatustext").textContent = "Fetch error";
						}
						else {
							let filteredMapList = arguments[0];
							filteredMapList.maps = filteredMapList.maps.filter(e => {if(list.maps.includes(e.id)) {return e;}}).sort().slice(0, list.maps.length);
							document.getElementById("maploadwindowstatustext").style.visibility = "hidden";
							if(filteredMapList.maps.length > 0) {
								window.playlists.mapLoader(filteredMapList);
								foundBonk2Maps += filteredMapList.maps.length;
							}
							if(arguments[0].more && foundBonk2Maps < list.maps.length) {
								addMaps(offset + 1);
							}
							else if(list.b1maps.length > 0) {
								window.playlists.mapLoader({r: "success", maps: list.b1maps, more: false}, 0);
								window.playlists.setMapsLoadFinished(true);
							}
							else {
								window.playlists.setMapsLoadFinished(true);
							}
						}
					});
				}
				addMaps();
			}
			else if(list.maps === "new" && !window.playlists.editing) {
				playlist.style.display = "none";
				document.getElementById("maploadwindowmapscontainer").insertBefore(playlistCreator(), playlist);
			}
		}
	}

	document.getElementById("maploadwindowstatustext").style.visibility = "hidden";
}
patchCounter = 0;
const patch = (a, b) => {
	c = newStr;
	newStr = newStr.replace(a, b);
	//console.log(`Patch ${patchCounter++}: ${c === newStr ? 'fail' : 'success'}`);
	return c !== newStr;
}

const categoryFunc = newStr.match(/[A-Za-z0-9\$_]{3}\([A-Za-z0-9\$_]{3}\.[A-Za-z0-9\$_]{3}\([0-9]*\),true\)/)[0].substr(0,3);
patch(`function ${categoryFunc}`, `window.playlists.categoryFunc=${categoryFunc};function ${categoryFunc}`);

//Get map loader
let mapLoader = newStr.match(/maploadwindowsearchinput.{0,200}else if\([A-Za-z0-9\$_]{3}\[0\]\[0\]\[[A-Za-z0-9\$_]{3}\[[0-9]+\][[0-9]+\]\] == [A-Za-z0-9\$_]{3}\.[A-Za-z0-9\$_]{3}\([0-9]+\)\)\{[A-Za-z0-9\$_]{3}\([A-Za-z0-9\$_]{3}\[0\]\[0\]\);[A-Za-z0-9\$_]{3}\[[0-9]+\]=[A-Za-z0-9\$_]{3}\[0\]\[0\]\[[A-Za-z0-9\$_]{3}\[[0-9]+\]\[[0-9]+\]\];\}\}\)/g)[0].match(/[A-Za-z0-9\$_]{3}\([A-Za-z0-9\$_]{3}\[0\]\[0\]\);/)[0].slice(0, 3);

patch(`function ${mapLoader}`, `window.playlists.mapLoader=${mapLoader};function ${mapLoader}`);

//Get token
patch('[1,10000,25000,100000,500000,8000000,5000000000];', '[1,10000,25000,100000,500000,8000000,5000000000];' + "window.playlists.setToken(arguments[0]);");

//Mapload ready variable
let readyVar = newStr.match(/\+ 1000 && [A-Za-z0-9\$_]{3}\[[0-9+]+\]/)[0].split(" ")[3];
patch('[1,10000,25000,100000,500000,8000000,5000000000];', '[1,10000,25000,100000,500000,8000000,5000000000];' + `window.playlists.setMapsLoaded=a=>{${readyVar}=a;};`);

//Mapload finish variable
let finishVar = newStr.match(/false\);\}else \{if\([A-Za-z0-9\$_]{3}\[[0-9]+\]\)\{/)[0].split(/[\(\)]/)[2];
//Inverting the value is important
patch('[1,10000,25000,100000,500000,8000000,5000000000];', '[1,10000,25000,100000,500000,8000000,5000000000];' + `window.playlists.setMapsFinished=a=>{${finishVar}=!a;};`);

//Get some useful functions
let menuRegex = newStr.match(/== 13\){...\(\);}}/)[0];
patch(menuRegex, menuRegex + "window.playlists.menuFunctions = this;");
let toolRegex = newStr.match(/=new [A-Za-z0-9\$_]{1,3}\(this,[A-Za-z0-9\$_]{1,3}\[0\]\[0\],[A-Za-z0-9\$_]{1,3}\[0\]\[1\]\);/);
patch(toolRegex, toolRegex + "window.playlists.toolFunctions = this;");

//Big class
let bigClass = newStr.match(/[A-Z]\[[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[0-9]+\]\]\([A-Za-z0-9\$_]{1,3}\[0\]\[0\]\);[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[0-9]+\]\]\([A-Za-z0-9\$_]{1,3}\[[0-9]+\],{m:/)[0][0];
patch(`function ${bigClass}(){}`, `function ${bigClass}(){};window.playlists.bigClass=${bigClass};`);


	console.log("Bonk Playlists injector run");
	return newStr;
}

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(
`Whoops! Bonk Playlists was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
Bonk Playlists, such as the Bonk Leagues Client. You would have to disable it to use \
Bonk Playlists.`);
		throw error;
	}
});

console.log("Bonk Playlists injector loaded");