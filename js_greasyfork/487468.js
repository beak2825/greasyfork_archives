// ==UserScript==
// @name         Idle Pixel Friend Request
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Alerts when receiving a friend request
// @author       Felipe Dounford
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @match        *://idle-pixel.com/login/play*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487468/Idle%20Pixel%20Friend%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/487468/Idle%20Pixel%20Friend%20Request.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class FriendRequestPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("friendRequest", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onLogin() {
			IdlePixelPlus.plugins.friendRequest.changeaddFriendFunction()
			IdlePixelPlus.plugins.friendRequest.addUI()
        }

		addUI() {
			let FRDiv = document.createElement('div');
			FRDiv.id = "friendRequest"
			FRDiv.style.cssText = "border: 2px solid rgb(0, 0, 77);padding: 10px;z-index: 10;position: absolute;top: 100px;left: 0px;margin-right: auto;margin-left: auto;width: 30%;background-color: rgb(230, 230, 255);border-radius: 10px;text-align: center;display: none;height: auto;right: 0px;"
			FRDiv.innerHTML = `<div class="modal-header">
				<h5 class="modal-title text-secondary">Friend Request</h5>
				<button type="button" class="btn-close" onclick="this.parentNode.parentNode.style.display = 'none'"></button><input type="text" id="friendRequestName" style="display:none;">
			</div>
			<div>
				<center><b><span id="friendRequestFriend">Player</span></b> wants to be your friend.
					<br>
				</center>
			</div>
			<div class="modal-footer">
				<button onclick="this.parentNode.parentNode.style.display = 'none'"><span class="font-pixel hover">Ignore</span></button>
				<button class="background-primary float-end" onclick="IdlePixelPlus.plugins.friendRequest.acceptFR()"><span class="font-pixel hover">Accept Friend Request</span></button>
			</div>`
			document.getElementById('content').appendChild(FRDiv)
		}

		changeaddFriendFunction() {
			//Change Chat Class to call the request function
			Chat.add_friend_modal_submit = function() {
				var value = document.getElementById("modal-add-friend-input").value;
				websocket.send('ADD_FRIEND=' + value);
				IdlePixelPlus.plugins.friendRequest.sendFR(value)
			}
		}

		onCustomMessageReceived(player, content, callbackId) {
            if(content.startsWith("friendRequest")) {
                this.receiveFR(player);
            }
        }
		
		sendFR(username) {
            IdlePixelPlus.sendCustomMessage(username, {
                content: `friendRequest`,
                timout: 300000
            });
        }
		
		receiveFR(username) {
            document.getElementById('friendRequestName').value = username
            document.getElementById('friendRequestFriend').innerText = username
            document.getElementById('friendRequest').style.display = ''
        }
		
		acceptFR() {
            document.getElementById('friendRequest').style.display = 'none'
            let friend = document.getElementById('friendRequestName').value
			websocket.send('ADD_FRIEND=' + friend); 
		}
	}

    const plugin = new FriendRequestPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();