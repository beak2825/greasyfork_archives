// ==UserScript==
// @name         🤖KITForge
// @namespace    🤖KITForge for dating apps
// @version      4.34
// @description  Semi auto tools for dating app automatization
// @author       007 $-Daddy
// @match        https://*.tinder.com/app/*
// @icon         https://w7.pngwing.com/pngs/739/237/png-transparent-social-media-tinder-computer-icons-social-application-text-logo-desktop-wallpaper-thumbnail.png

// @require      https://code.jquery.com/jquery-1.10.2.js
// @require      https://code.jquery.com/ui/1.10.4/jquery-ui.js
// @require      https://kit.fontawesome.com/a28adfb6ac.js
// @grant        GM_getResourceText
// @grant        GM_addStyle

// @run-at       document-end
// @iconURL      https://cdn-icons-png.flaticon.com/512/3398/3398643.png
// @icon64URL    https://cdn-icons-png.flaticon.com/512/3398/3398643.png
// @icon         https://cdn-icons-png.flaticon.com/512/3398/3398643.png
// @supportURL   https://gist.github.com/josuebin/1aa1fb73de93934aaa3d7bb249b5e537#new_comment_field
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/440294/%F0%9F%A4%96KITForge.user.js
// @updateURL https://update.greasyfork.org/scripts/440294/%F0%9F%A4%96KITForge.meta.js
// ==/UserScript==


(async function() {
    'use strict';
// ---------------------------------------------------------- //
//    💯 Messager for Tinder								  //
// ---------------------------------------------------------- //
//🖲️🧠 Vars - Configs
    var botVersion = "4.33";
	var message = '';
	var card = false;
	var is_Match = true;
    var isSwiperRunning = false;
    var btnCliked;
    var swipeRight_count = 0;
    var swipeLeft_count = 0;
    var match_count = 0;
	var max_chats = 20;
	var chat_sent = 0;
    var indexM = 1; // Index for __getMatchChat function
    var task = 'empty';
    var profile = "empty";
    
    var swipeControl_R = 0; // Initialize swipeControl_R outside the function
    var randomLoopCount = Math.floor(Math.random() * 20) + 20;
    var callDelay = Math.floor(Math.random() * 1000) + 500;
        
    // sleep promise
    const sleep = (time) => {
        return new Promise(resolve => setTimeout(resolve, time))
    }

    // class fake events
    class FakeEvent {
        constructor(target=null) { 
            this.isTrusted = true;
            this.target = target; this.defaultPrevented = false; this.isTrusted = true; this.altKey = false;
            this.altitudeAngle = 1.5707963267948966; this.azimuthAngle = 0; this.bubbles = true; this.cancelBubble = false;
            this.cancelable = true; this.composed = true; this.ctrlKey = false; this.currentTarget = null;
            this.defaultPrevented = false; this.detail = 1; this.fromElement = null; this.height = 1;
            this.isPrimary = false; this.metaKey = false; this.pointerId = 1; this.pointerType = "mouse";
            this.pressure = 0; this.relatedTarget = null; this.returnValue = true; this.shiftKey = false;
        }
        preventDefault = () =>{ this.defaultPrevented = true }
    } var fake_event = new FakeEvent(); // fake mouse event

    // 🧠 Make a header ready to use
    class tinderHeaders {

        constructor() { 
            // Vars
            this.apiToken = localStorage.getItem('TinderWeb/APIToken');
            this.deviceId = localStorage.getItem('TinderWeb/uuid');
            this.tinderURL = document.URL.split('/')[2];
            this.isLite = document.URL.split('/')[2].split('.')[0];
            this.data = null;
        }

        get_value_by_key = (database_name, database_version, object_name, key) => {

            return new Promise((resolve, reject) => {
                const request = indexedDB.open(database_name, database_version);
    
                request.onsuccess = (event) => {
                    const database = event.target.result;
                    const transaction = database.transaction([object_name], 'readonly');
                    const objectStore = transaction.objectStore(object_name);
                    const getRequest = objectStore.get(key);
    
                    getRequest.onsuccess = (e) => {
                        const data = e.target.result;
                        resolve(JSON.parse(data));
                    };
    
                    getRequest.onerror = (e) => {
                        reject(e.target.error);
                    };
                };
    
                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        }
    } var headers = new tinderHeaders(); // Initializing headers

    try {
        var h_data = await headers.get_value_by_key("keyval-store", 1, "keyval", "persist::session");
    } catch (error) {}


    // 🧠 Setting up Tinder version
    var tiVersion;
    var appVersion;
    
    let tVersion = async () =>{

        var jsFilePaths = Array.prototype.slice.apply(document.querySelectorAll('script')).filter(s => s.src).map(s => s.src).filter(url => url.includes("main-"));
        var tinderJS = jsFilePaths[0].split('/')[5]

        let jsFileContent = await (await fetch("/static/build/"+tinderJS)).text();
        tiVersion = jsFileContent.match(/appVersion:\s*['"]([^'"]+)['"]/)?.[1];

        appVersion = "10"+tiVersion.split(".")[0]+tiVersion.split(".")[1]+"0"+tiVersion.split(".")[2];

        return tVersion + "," + appVersion;
    }; await tVersion();

    // 🧠 Setting up language headers
    var f_lang = navigator.language
    var lang = f_lang.split('-')[0]

    // 🧠 Setting up User angent data
    var userAgentB = navigator.userAgentData;
    var _brand = userAgentB['brands'][1]['brand'];
    var _version = userAgentB['brands'][1]['version'];
    var _1version = userAgentB['brands'][0]['version'];
    var _1brand = userAgentB['brands'][0]['brand'];
    var _2brand = userAgentB['brands'][2]['brand'];
    var _system = userAgentB['platform'];

    var _platfVersion = "web";

    if (headers.isLite == 'lite') {
        _platfVersion = 'lite';
    }

    var tinderHeaders_GLOBAL = {
        "accept": "application/json",
        "accept-language": lang+","+f_lang,
        "app-session-id": h_data.appSessionId,
        "app-session-time-elapsed": h_data.lastActivityPerfTime,
        "app-version": appVersion,
        "content-type": "application/json",
        "persistent-device-id": headers.deviceId,
        "platform": _platfVersion,
        "sec-ch-ua": "\""+_1brand+"\";v=\""+_1version+"\", \""+_brand+"\";v=\""+_version+"\", \""+_2brand+"\";v=\""+_version+"\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\""+_system+"\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "tinder-version": tiVersion,
        "user-session-id": h_data.userSessionId,
        "user-session-time-elapsed": h_data.userSessionStartPerfTime,
        "x-auth-token": headers.apiToken,
        "x-supported-image-formats": "webp,jpeg"
    }

// ---------------
// 🕹️ MODULES  & 🎴 ANIMATIONS

	// 🕹️ return random phrases -MODULE-
		let getPhrase = () => {
			var phraseLib = [
				'What if I tell you I love everything about you?',
				'I am really into inter-dating',
			];
			var index = Math.floor(Math.random() * phraseLib.length - 1);
			return phraseLib[index];
		}


	// 🕹️ get_ChatId get chat id -MODULE-
		var get_ChatId = () => {
			// 🛠️ get chat id from url
			return window.location.pathname.split('/')[3];
		}


	// 🎴 match/message tap -ANIMATION-
		let event_tap = (tap) => {  // PEMDINNG TO REMOVE ⚠️
			var e_Tap = 'Nope';
			try{
				if (tap == 1){
					e_Tap = document.querySelector("#s1891574131").click();
				}
				if (tap == 2) {
					e_Tap = document.querySelector("#s1725385717").click();
				}
			}catch(e){}
		}


	// 🎴 card -ANIMATION-2
		let event_Card = (animation) => {  // PENDING TO REMOVE ⚠️
			var event_Card = 'Nope';
	        try{
				if (animation == 1)
				{
					event_Card = document.querySelector("#s-662773879 > div > div.App__body.H\\(100\\%\\).Pos\\(r\\).Z\\(0\\) > div > main > div.H\\(100\\%\\) > div > div > div > div.Fx\\(\\$flx1\\).H\\(100\\%\\) > div > div > div.D\\(f\\).W\\(100\\%\\).BdT.Bdtc\\(\\$c-ds-divider-primary\\).Bgc\\(\\$c-ds-background-primary\\).Pos\\(r\\) > div > div:nth-child(1) > button").click();
				}
				if (animation == 2)
				{
					event_Card = document.querySelector("#s-662773879 > div > div.App__body.H\\(100\\%\\).Pos\\(r\\).Z\\(0\\) > div > main > div.H\\(100\\%\\) > div > div > div > div.Fx\\(\\$flx1\\).H\\(100\\%\\) > div > div > div.Pos\\(a\\).D\\(f\\).Animdur\\(\\$normal\\).Animn\\(\\$anim-slide-in-up\\).Bgc\\(\\$c-ds-background-primary\\).W\\(100\\%\\).BdT.Bdc\\(\\$c-ds-divider-primary\\).B\\(52px\\).B\\(72px\\)--ml > div > div > div.D\\(f\\).Fxd\\(r\\).Fxs\\(0\\).Pend\\(20px\\) > div:nth-child(1) > div").click();
				}
				else
				{
					event_Card = document.querySelector("#s-662773879 > div > div.App__body.H\\(100\\%\\).Pos\\(r\\).Z\\(0\\) > div > main > div.H\\(100\\%\\) > div > div > div > div.Fx\\(\\$flx1\\).H\\(100\\%\\) > div > div > div.D\\(f\\).W\\(100\\%\\).BdT.Bdtc\\(\\$c-ds-divider-primary\\).Bgc\\(\\$c-ds-background-primary\\).Pos\\(r\\) > form > button.button.Lts\\(\\$ls-s\\).Z\\(0\\).CenterAlign.Mx\\(a\\).Cur\\(p\\).Tt\\(u\\).Ell.Bdrs\\(100px\\).Px\\(24px\\).Px\\(20px\\)--s.Py\\(0\\).Mih\\(40px\\).Pos\\(r\\).Ov\\(h\\).C\\(\\#fff\\).Bg\\(\\$c-pink\\)\\:h\\:\\:b.Bg\\(\\$c-pink\\)\\:f\\:\\:b.Bg\\(\\$c-pink\\)\\:a\\:\\:b.Trsdu\\(\\$fast\\).Trsp\\(\\$background\\).Bg\\(\\$g-ds-background-brand-gradient\\).button--primary-shadow.StyledButton.Bxsh\\(\\$bxsh-btn\\).Fw\\(\\$semibold\\).focus-button-style.Mb\\(16px\\).As\\(fe\\)").click();
				}
			}catch(e){}
		}


	// 🕹️ send message -MODULE-
	    let __sendMsg = (message) => {
	        try{
	            // .... Just need to update the headers, the body is always ok no need to modify
	            fetch("https://api.gotinder.com/user/matches/"+matchID+"?locale=en", {
                    "headers": tinderHeaders_GLOBAL,
                    "referrer": "https://"+headers.tinderURL+"/",
                  "referrerPolicy": "origin",
	              "body": "{\"\":\"\",\"\":{\"\":[],\"\":0,\"\":{\"\":0},\"\":0,\"\":\"\",\"\":0,\"\":0,\"\":[{\"\":\"\",\"\":\"\",\"\":\"\",\"\":{\"\":\"\",\"\":\"\",\"\":\"\"},\"match_id\":\""+matchID+"\",\"\":\"\",\"\":1,\"\":\"\",\"\":\"\",\"to\":\"\"},{\"\":\"\",\"match_id\":\""+matchID+"\",\"\":\"\",\"\":\"\",\"to\":\"\",\"\":\"\",\"\":\"\",\"\":1},{\"\":\"\",\"match_id\":\""+matchID+"\",\"\":\"\",\"\":\"\\\\\",\"\":\"\",\"\":\"\",\"\":1},{\"\":\"\",\"match_id\":\""+matchID+"\",\"\":\"\",\"\":\"\",\"to\":\"\",\"\":\"\",\"\":\"\",\"\":1},{\"\":\"\",\"match_id\":\""+matchID+"\",\"\":\"\",\"\":\"\",\"to\":\"\",\"\":\"\",\"\":\"\",\"\":1}],\"\":0,\"\":0,\"\":0,\"\":0,\"\":0,\"\":0,\"\":\"\",\"\":{\"\":[{\"\":\"\",\"\":{\"\":{\"\":1,\"\":0,\"\":0.8,\"\":0},\"\":{\"\":0,\"\":0,\"\":0,\"\":0},\"\":0,\"\":0,\"\":[{}]},\"\":\"\",\"\":[{\"url\":\"\",\"\":0,\"\":0},{\"\":\"\",\"\":0,\"\":0},{\"\":\"\",\"\":0,\"\":0},{\"\":\"\",\"\":0,\"\":0}],\"\":\"\",\"\":\"\",\"\":\"\",\"\":0}],\"gender\":0,\"\":0,\"\":\"\",\"\":\"\",\"\":\"\",\"\":0,\"\":\"\",\"\":\"\"},\"\":0,\"\":0,\"\":0,\"\":0,\"\":\""+matchID+"\",\"\":0,\"\":\""+matchID+"\",\"\":0,\"\":0,\"\":{\"\":0,\"\":\"\"}},\"\":\"\",\"message\":\""+message+"\"}",
	              "method": "POST","mode": "cors","credentials": "omit"
	            }).then(data =>{
					// 🗒️ system info
						console.log('📮 Messages sent successfully. 👻💌' + chat_sent);
	            });
	        }catch(e){}
	    }


	// 🕹️ get new chat -MODULE-
		let __getChat = () => {
			// 🕷️ new chat element
				try{
                    statusRealTimeUpdater();
					let get_newMessage2 = document.getElementsByClassName('messageListItem--isNew');
					// 🕷️ check if there's new messages
                        if (get_newMessage2.length == 0 || get_newMessage2.length == 1) {

                            // 🗒️ system info
                            get_newMessage2.length == 0 ? updateStatusBOT("\n\n[⚠️] This feature only works on main page: ") : updateStatusBOT("\n[⚠️] No new Chats found. Try loading more or matching: ");
                                
                        }
						else {
							get_newMessage2[get_newMessage2.length - 1].click();
                            updateStatusBOT("\n[BOT] Talk + spam [SPAM SAFE 🟩]: ");
						}
				}catch(e){console.log(e)}
		}


	// 🕹️ get new chat -MODULE-
        let removeChats = async () => {

            let notAllowed = new bootstrap.Modal('#Notallowed', {
                keyboard: false
            });

            document.getElementById('notAllowedMessage').innerHTML =`
                <p class="pInfoAging">Account restricted. You can't run <span id="" style="color: #ff4458;">Clean Spam</span> while aging this Account</p>
            `;

            if (localStorage.getItem('agingAccount') == 'False') {
                
                let __getChat_readed = async (i) => {
        
                    // 🕷️ new chat element
                        try{
                            statusRealTimeUpdater();
                            let get_newMessage2 = document.querySelectorAll('.messageListItem:not(.messageListItem--isNew');
                            get_newMessage2[i].click();

                                
                            }catch(e){console.log(e)}
                }
                    
        
                document.querySelector("#btnConfirm_agingAccount").click();
        
                let get_newMessage2 = document.getElementsByClassName('messageListItem');
                // Remove chats
                for (let i = 1; i <= get_newMessage2.length - 1; i++) {
                    
                    await __getChat_readed(i);
                    await sleep(2000);
        
                    if (document.querySelector('img[src="/static/build/12e5de5e47e0b63021cb9dbebddd195b.svg"]')) {
                        updateStatusBOT("\n[👻] Snapchat detected: ");
                        await unMatchApi();
                        await sleep(600);
                        i --; 
                    }
                    console.log("Checking chat #"+i);
                    if (get_newMessage2.length == i+1) {
                    
                        // 🗒️ system info
                        play("done_audio");
                        updateStatusBOT("\n[⚠️] Spam clean is completed: ");
                        break;
                            
                    }
                }
                console.log("Checked chats");
            }

            
            if (localStorage.getItem('agingAccount') == 'True') {

                notAllowed.toggle();
                updateStatusBOT("\n ");
                updateStatusBOT("\n[⚠️] Account restricted: ");
                updateStatusBOT("\n[⚠️] You can't run Clean Spam while aging this Account: ");

            }

        }


	// 🕹️ get new match chat -MODULE-
		let __getMatchChat = () => {
                
            // 🕷️ new chat element
            try{
                statusRealTimeUpdater();
					let get_newMessage2 = document.getElementsByClassName('matchListItem');
                    
					// 🕷️ check if there's new messages
                    if (get_newMessage2.length == 0 || get_newMessage2.length == 1) {
                        
                        // 🗒️ system info
                        get_newMessage2.length == 0 ? updateStatusBOT("\n\n[⚠️] This feature only works on main page: ") : updateStatusBOT("\n[⚠️] No new Matches found. Try loading more or matching: ");
                        
                    }
                    else {
                        get_newMessage2[get_newMessage2.length - indexM].click();
                        updateStatusBOT("\n[⚠️] Talk only with this Match [SPAM UNSAFE 🟥]: ");
                    }
                    indexM++;
                    if (indexM >= 4) {
                        indexM = 1
                    }
                    console.log(indexM);
				}catch(e){console.log(e)}
        }


	// 🕹️ save chat id or get chat id -MODULE-
		let save_chatID = (type,key,value = "") => {
			var check = '';
			// 🕷️ if get found the id return true
				if (type == 'get' && sessionStorage.getItem(key) != null) {
					// 🗒️ system info
					console.log('       👁️‍🗨️ Chat id duplicated');
					check = 'duplicated';
				}
			// 🕷️ save chat id
				if (type == 'set' && sessionStorage.getItem(key) == null) {
					// 🗒️ system info
					console.log('       💾 Chat id saved successfully');
					sessionStorage.setItem(key,value);
					check = 'saved';
				}
			return check;
		}


	// 🕹️ generate invisible text -MODULE-
		let b = (num) => {
		    var t = "";
		    var p = "​​​​​​​​​​​​​​​​";

		    for (var i = 0; i < num; i++){
		        t += p.charAt(Math.floor(Math.random() * p.length));
		    }
		    return t;
		}


	// 🕹️ insert random invisible text in a string -MODULE-
		String.prototype.insertSpaces = (n, char) => {
		    var str = this;
		    for(var i = 0; i < n; i++){
		        var randPos = Math.floor(Math.random() * (str.length + 1)); // get random index to insert
		        str = str.substring(0, randPos) + char + str.substring(randPos, str.legnth); // insert the repeated sting
		    }
		    return str;
		}


	// 🕹️ open a fresh match chat
		let open_matchChat = (index = 0) => {
			// if true get the last match chat
				if (index == "last") {
					index = document.getElementsByClassName('matchListItem D(ib) Pos(r) H(120px) H(180px)--m W(100%) Trsdu($normal) Wc($transform) Scale(1.1):h Op(1):h Mx(0)! focus-button-style').length - 1;
				}
			// default
			document.getElementsByClassName('matchListItem D(ib) Pos(r) H(120px) H(180px)--m W(100%) Trsdu($normal) Wc($transform) Scale(1.1):h Op(1):h Mx(0)! focus-button-style')[index].click();
		}


        let waitForElements = (selector, timeout) => {
            return new Promise((resolve) => {
                const observer = new MutationObserver((mutationsList) => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    observer.disconnect(); // Stop observing
                    resolve(elements); // Resolve the promise with the found elements
                }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                setTimeout(() => {
                observer.disconnect(); // Stop observing after the timeout
                resolve([]); // Resolve with an empty array if timeout is reached
                }, timeout);
            });
        }


    // 🕹️ get maches's / chat's total
        let countM_C = async (p) => {
            try {
            const timeout = 2000; // 3 seconds
            if (p === "matches") {
                const matches = await waitForElements('.matchListItem', timeout);
                const matchCount = matches.length - 1;
                return matchCount;
            }
            if (p === "chats") {
                const newChats = await waitForElements('.messageListItem--isNew', timeout);
                const newChatCount = newChats.length;
                return newChatCount;
            }
            } catch (error) {
            console.error('Error:', error);
            }
        }

        var _match = 0;
        var _nChat = 0;

        let  statusRealTimeUpdater = async () => {
            try {
                _match = await countM_C('matches');
                _nChat = await countM_C('chats');

                document.getElementById("_nChat").innerText = _nChat;
                document.getElementById("_nMatch").innerText = _match;
                document.getElementsByClassName("notification")[0].style.display = "inline-block";
                document.getElementsByClassName("notification")[1].style.display = "inline-block";

            } catch (error) {}
        };


	// ---------------
	//🎬 MACRO [A1 MESSAGE TAP] .... Send text to message tap only
		// 🎥 Macro: click message tap, get new chat, send messages
			let _MacroA1 = () => {
				// 🗒️ system info
					console.log('🧩 Running: 🎬 MACRO [A1] ');

				// 🎴 click message tap, get a new chat, send message
					let event1 = () => {
						event_tap(2);

					}

				// 🎴 send message
					let event2 = () => {
						__getChat();
						// add invisible text to message
							message = getPhrase();
							message = message.insertSpaces(5+a(5),'​');

						// 🕷️ if card is true send snapchat card
							if (save_chatID('get',matchID) != 'duplicated') {
								// send messages
									__sendMsg(message);
									// 🗒️ system info
										console.log('     💌 message sent: '+message);
								// 🕷️ if card is true send snapchat card
									if (card == true) {event_Acard();}
									// save chat id
										save_chatID('set',matchID);
										chat_sent++
							}
					}

				// 🎴 click and send snapchat card
					let event_Acard = () => {
						event_Card(1);
						event_Card(2);
						event_Card(3);
					}

				// 💿 Play events
					setTimeout(event1(),time/1.8);
					setTimeout(event2(),time/1.5);
			}


	// ---------------
	//🎬 MACRO [B1 MATCHES TAP] .... Spam Matches tap only
		// 🎥 Macro: click matches tap, get new chat
			let _MacroB1 = () => {
				// 🗒️ system info
					console.log('🧩 Running: 🎬 MACRO [B1]');

				// 🎴 open match tap, get new fresh match chat
					let event1 = () => {
						event_tap(1);
						open_matchChat('last');
					}

				// 🎴 send message
					let event2 = () => {
						// add invisible text to message
							var matchWelcomeH = getPhrase();
							matchWelcomeH = matchWelcomeH.insertSpaces(20+a(10),'​');

						// 🕷️ if card is true send snapchat card
							if (save_chatID('get',matchID+"MATCH") != 'duplicated') {
								// send messages
									__sendMsg(matchWelcomeH);
									// 🗒️ system info
										console.log('     💌 message sent: '+matchWelcomeH);
									/* save chat id
										save_chatID('set',matchID+"MATCH");
										*/ chat_sent++
										            updateStatusBOT('\n💌  message sent: ['+chat_sent+'] '+matchWelcomeH);
							}
					}

				// 💿 Play events
					setTimeout(event1(),time/1.8);
					setTimeout(event2(),time/1.5);
			}

// ---------------
// 🧩 MACROS directory
		// 🛠️ helpers
            let getDate = async () => {
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const seconds = now.getSeconds();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
                const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

                return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
            }

            // 🕹️ Update BOT's ScreenLog
            var bot_status = "";

            let updateStatusBOT = async (status) => {
                let date = await getDate();

                if (status == "\n ") {

                    document.getElementById("screenLog").innerText += status;
                    document.getElementById('screenLog').scrollTop = 9999999;
                } else {

                    document.getElementById("screenLog").innerText += status+" ["+date+"]";
                    document.getElementById('screenLog').scrollTop = 9999999;
                }

            }


			var matchID = get_ChatId();
			// load new Ids
				let helper1 = () => { matchID = get_ChatId();}
			// generate random numbers
				let a = (num) => { return Math.floor(Math.random() * num);}
				var time = 6000+a(3000);

			// 🌚 GLOBAL MACRO - params to run in all macros
				task = setInterval(helper1,500);
				task = setInterval(()=>{
					// 🕷️ if max messages is reached turn off the bot
						if (chat_sent > max_chats ) {
							// 🗒️ system info
								console.log('🌚 Max messages reached: '+max_chats);
								clearInterval(task);
                                stop();
						}
					},time/2);

                    
// 🕹️ start bot
    let start = () =>{
        if (is_Match) {
            //🎬 MACRO [B1]
                task = setInterval(() => { _MacroB1(); },time);
        }
        else {
            //🎬 MACRO [A1]
                task = setInterval(() => { _MacroA1(); },time);
        }
        updateStatusBOT("\n😈 Bot started! Please wait a moment: ");
    }


// 🕹️ Close new matches alert
    let closeTinderAlert = async () => {
        try {
            let propsID = Object.keys(document.getElementsByClassName('bullet')[0])[1];
            eval(`document.querySelector('button[title="Back to Tinder"]').` + propsID + ".onClick(fake_event)");

            if (document.querySelector('button[title="Back to Tinder"]') != null ) {
                console.log("NEW MATCH");
                swipe_counter();
                match_count += 1;
            }
        } catch (error) {}
    }


// 🕹️ check pictures function
    let  checkPictures = async () => {
        let btnLike = document.getElementsByClassName("Bgi($g-ds-background-like):a")[0];
        let btnNope = document.getElementsByClassName("Bgi($g-ds-background-nope):a")[0];
        let propsID = Object.keys(document.getElementsByClassName('bullet')[0])[1];
        // Matches's pictures
        let pictureElements = document.getElementsByClassName('bullet');
        let delayPics = Math.floor(Math.random() * 100) + 150;

        for (let index = 0; index < pictureElements.length && isSwiperRunning; index++) {
            await sleep(delayPics);
            try {
            // check pictures
                eval("pictureElements[index]." + propsID + ".onClick(fake_event)");


            } catch (e) {console.log(e)}
            // ...
            updateStatusBOT(`\n[BOT] checking ${index}/${pictureElements.length} pictures: `);
        }

    }


// 🕹️ swipe function
    let swipe_letf_right = async () => {
        let btnLike = document.getElementsByClassName("Bgi($g-ds-background-like):a")[0];
        let btnNope = document.getElementsByClassName("Bgi($g-ds-background-nope):a")[0];
        let propsID = Object.keys(document.getElementsByClassName('bullet')[0])[1];

    // Generate clickRatio inside the function
        let clickRatio = Math.floor(Math.random() * 2);
        if (clickRatio === 1) {
            swipeControl_R += clickRatio; // Add 1 to swipeControl_R

            if (swipeControl_R < 4 && isSwiperRunning) {
                eval("btnLike." + propsID + ".onClick(fake_event)");

                updateStatusBOT("\n ");
                updateStatusBOT("\n[BOT] Swiped right: ");
                swipeRight_count += 1;


                if (swipeControl_R === 3) {
                    swipeControl_R = 0;
                    //eval("btnNope." + propsID + ".onClick(fake_event)");

                    updateStatusBOT("\n ");
                    updateStatusBOT("\n[BOT] Swipe reseted: ");

                }
            }

        } else {
            swipeControl_R = 0;
            eval("btnNope." + propsID + ".onClick(fake_event)");

            updateStatusBOT("\n ");
            updateStatusBOT("\n[BOT] Swiped left: ");
            swipeLeft_count += 1;
        }
        // CLOSE NEW MATCHES ALERT
        closeTinderAlert();

        swipe_counter();
        match_count = 0;
        swipeRight_count = 0;
        swipeLeft_count = 0;
    }


// 🕹️ run script function
    let runScript = async () => {

        let notAllowed = new bootstrap.Modal('#Notallowed', {
            keyboard: false
        });

        document.getElementById('notAllowedMessage').innerHTML =`
            <p class="pInfoAging">Account restricted. You can't run <span id="" style="color: #ff4458;">Swiper</span> while aging this Account</p>
        `;

        if (!isSwiperRunning && localStorage.getItem('agingAccount') == 'False') {
            isSwiperRunning = true;
            document.querySelector("#swiper").innerHTML = '<span class="icons" style="color:#ff4458"><i class="fa-solid fa-stop"></i></span> Stop Swiper';

            // Call swipe_letf_right()
            for (let i = 0; i < randomLoopCount && isSwiperRunning; i++) {
                await checkPictures();
                await sleep(callDelay);
                statusRealTimeUpdater();
                swipe_letf_right()
            }

            play("done_audio"); // Play audio after the swiping is done 🔉

            updateStatusBOT("\n ");
            updateStatusBOT("\n[🔥] Done, change the GPS: ");
            updateStatusBOT("\n[🔥] And run again if needed: ");


            isSwiperRunning = false;
            document.querySelector("#swiper").innerHTML = '<span class="icons"><i class="fa-solid fa-play"></i></span> Start Swiper';

        }
        else {
            isSwiperRunning = false;
            document.querySelector("#swiper").innerHTML = '<span class="icons"><i class="fa-solid fa-play"></i></span> Start Swiper';
        }
        if (localStorage.getItem('agingAccount') == 'True') {

            notAllowed.toggle();
            updateStatusBOT("\n ");
            updateStatusBOT("\n[⚠️] Account restricted: ");
            updateStatusBOT("\n[⚠️] You can't run Swiper while aging this Account: ");

        }

    }


// 🕹️ Update Likes and Dislike counter
    let swipe_counter = () => {
        try{
            // Get the current value from localStorage
            let currentCount = localStorage.getItem('Like_count');
            let currentCount1 = localStorage.getItem('Deslike_count');
            let currentCount2 = localStorage.getItem('Match_count');

            // Parse the value as an integer (or initialize it to 0 if not set)
            let parsedCount = parseInt(currentCount) || 0;
            let parsedCount1 = parseInt(currentCount1) || 0;
            let parsedCount2 = parseInt(currentCount2) || 0;

            // Add the number to the parsed count
            let updatedCount = parsedCount + swipeRight_count;
            let updatedCount1 = parsedCount1 + swipeLeft_count;
            let updatedCount2 = parsedCount2 + match_count;

            // Store the updated value back in localStorage
            localStorage.setItem('Like_count', updatedCount);
            localStorage.setItem('Deslike_count', updatedCount1);
            localStorage.setItem('Match_count', updatedCount2);

        }catch(e){
            console.log(e);
        }
    }


// 🕹️ Stop bot action
    let stop = () =>{
        chat_sent = 0;
        clearInterval(task);
        updateStatusBOT("\n👺 Bot stoped!: ");
    }


// 🕹️ Update snapchat Card
    let _updateCARD = async (_confirm) => {
        await sleep(200);    

        if (_confirm) {
            
            var snapchat_ID = ''; // Need to add the option to remove cards
            var _method = 'POST'; // Header Method
            snapchat_ID = $('#cardInput').val();
            console.log(snapchat_ID);

            if (snapchat_ID == null || snapchat_ID == '') {
                _method = "DELETE";
            }

            fetch("https://api.gotinder.com/v2/profile/contact-card?locale="+lang+"", {
                "headers": tinderHeaders_GLOBAL,
                "referrer": "https://"+headers.tinderURL+"/",
                "referrerPolicy": "origin",
                "body": "{\"contact_type\":\"snapchat\",\"contact_id\":\""+snapchat_ID+"\"}",
                "method": _method,
                "mode": "cors",
                "credentials": "omit"
            });
            updateStatusBOT("\n ");
            updateStatusBOT("\n[🔥] Snapchat's card updated: ");
            console.log(headers);
        }

    }


// 🕹️ go to the first chats/matches
    let updateBIO = async (_confirm) =>{
        await sleep(200);

        if (_confirm) {
            
            var snapchat_ID = ''; // Need to add the option to remove cards
            snapchat_ID = $('#bioInput').val();
            console.log(snapchat_ID);

            if (snapchat_ID == null) {
                snapchat_ID = "";
            }

            fetch("https://api.gotinder.com/v2/profile?locale="+lang+"", {
                "headers": tinderHeaders_GLOBAL,
                "referrer": "https://"+headers.tinderURL+"/",
                "referrerPolicy": "origin",
                "body": "{\"user\":{\"bio\":\""+snapchat_ID.replace(/\n/g, "\\n")+"\"}}",
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            });
                
            updateStatusBOT("\n ");
            updateStatusBOT("\n[🔥] Bio updated: ");
            console.log(headers);
        }
    }


// 🕹️ press confirmation
  let pressUnMacth = () => {

        const divElements = document.querySelectorAll('div');
        let divWithContent;
        for (const divElement of divElements) {
        if (divElement.textContent === 'Yes, unmatch') {
            divWithContent = divElement;
            break; // Exit the loop after finding the first match
        }
        }
        console.log(divWithContent);

        try{
            divWithContent.click(fake_event);
        }catch(e){console.log(e)}
        updateStatusBOT("\n[BOT] Unmatched successful: ");
    }


// 🕹️ get other id ( shorter version of match Id)
    let getOtherID = (matchID) => {

        matchID.slice(2, 26) // characters to remove
        matchID = matchID.replace(matchID.slice(2, 26), "");

        return matchID;

    }


// 🕹️ get other Name
    let getOtherName = () => {
        return document.getElementsByClassName("Typs(display-3-regular) C($c-ds-text-inactive)")[0].innerText.split(" ")[3]
    }


// 🕹️ getProfileData
    let getProfileData = async () => {
        await sleep(200);

        fetch("https://api.gotinder.com/v2/profile?locale=en&include=account%2Cavailable_descriptors%2Cboost%2Cbouncerbypass%2Ccontact_cards%2Cemail_settings%2Cfeature_access%2Cinstagram%2Clikes%2Cprofile_meter%2Cnotifications%2Cmisc_merchandising%2Cofferings%2Conboarding%2Cpaywalls%2Cplus_control%2Cpurchase%2Creadreceipts%2Cspotify%2Csuper_likes%2Ctinder_u%2Ctravel%2Ctutorials%2Cuser", {
            "headers": tinderHeaders_GLOBAL,
            "referrer": "https://"+headers.tinderURL+"/",
            "referrerPolicy": "origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        }).then(response => response.json()).then(infoData => {
        profile = infoData.data;

        })

    }

// 🕹️ sendCard chats/matches by requests
    let sendCard = async () => {
        await sleep(200);

        let snapCard = "karlhhy";
        let matchID = window.location.href.split("/")[5];

        if (localStorage.getItem('profile_id') != null) {
            fetch("https://api.gotinder.com/user/matches/"+matchID+"?locale=en", {
                "headers": tinderHeaders_GLOBAL,
                "referrer": "https://"+headers.tinderURL+"/",
                "referrerPolicy": "origin",
                "body": "{\"userId\":\""+localStorage.getItem('profile_id')+"\",\"otherId\":\""+getOtherID(matchID)+"\",\"matchId\":\""+matchID+"\",\"sessionId\":null,\"message\":\""+snapCard+"\",\"type\":\"contact_card\",\"contact_type\":\"snapchat\"}",
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            });
        
            updateStatusBOT("\n ");
            updateStatusBOT("\n[📜] Card sent to: "+getOtherName());
        }
        else {
            updateStatusBOT("\n ");
            updateStatusBOT("\n[📜] Error, userID not found in localStore: ");
        }
    }


// 🕹️ sendMessage chats/matches by requests
    let sendMessage = async () => {
        await sleep(200);
        let message = prompt("Write a message");
        let matchID = window.location.href.split("/")[5];

        if (localStorage.getItem('profile_id') != null) {
            fetch("https://api.gotinder.com/user/matches/"+matchID+"?locale=en", {
                "headers": tinderHeaders_GLOBAL,
                "referrer": "https://"+headers.tinderURL+"/",
                "referrerPolicy": "origin",
                "body": "{\"userId\":\""+localStorage.getItem('profile_id')+"\",\"otherId\":\""+getOtherID(matchID)+"\",\"matchId\":\""+matchID+"\",\"sessionId\":null,\"message\":\""+message+"\"}",
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            });
            updateStatusBOT("\n ");
            updateStatusBOT("\n[📜] Message sent: "+getOtherName());
        }
        else {
            updateStatusBOT("\n ");
            updateStatusBOT("\n[📜] Error, userID not found in localStore: ");
        }
    }


// 🕹️ Unmatch chats/matches by requests
    let unMatchApi = async () => {
        await sleep(200);
        let matchID = window.location.href.split("/")[5];

        fetch("https://api.gotinder.com/user/matches/"+matchID+"?locale=en", {
            "headers": tinderHeaders_GLOBAL,
            "referrer": "https://"+headers.tinderURL+"/",
            "referrerPolicy": "origin",
            "body": null,
            "method": "DELETE",
            "mode": "cors",
            "credentials": "omit"
        });

        updateStatusBOT("\n ");
        updateStatusBOT("\n[🔥] Unmached: ");
        document.querySelector('a[href="/app/matches"]').click(fake_event);
    }


// 🕹️ Remove chats/matches
    let unMatch = async () => {

        let notAllowed = new bootstrap.Modal('#Notallowed', {
            keyboard: false
        });

        document.getElementById('notAllowedMessage').innerHTML =`
            <p class="pInfoAging">This feature only works on <span id="" style="color: #ff4458;">Chats</span> and 
                <span id="" style="color: #ff4458;">Matches</span></p>
            <p class="pInfoAging">Please press <span id="" style="color: #ff4458;">Get new Chat/Match </span> and try again</p>
        `;

        try {
            const buttons = document.querySelectorAll('button');
            let buttonWithContent;
            for (const button of buttons) {
                if (button.textContent === 'Unmatch') {
                buttonWithContent = button;
                break; // Exit the loop after finding the first match
                }
            }

            if (!buttonWithContent) {
                notAllowed.toggle();
                updateStatusBOT("\n ");
                updateStatusBOT("\n[⚠️] This feature only works on chat:");
            }

            let propsID = Object.keys(document.getElementsByClassName('bullet')[0])[1];
            eval("buttonWithContent." + propsID + ".onClick(fake_event)");
            setTimeout(() => {
                pressUnMacth();
            }, 500);
        } catch (e) {}
    }


// 🕹️ load chats and matches
    let play = (name) =>{
        
        var audio = document.getElementById(click_audio);

        audio = (name == "done_audio") ? document.getElementById("done_audio") :  document.getElementById("click_audio");
        audio.play();
    }

// 🕹️ delete cookies by name -MODULE-
    let removeRestriction = (param) => {
        if (param == false) {
            localStorage.setItem('agingAccount', 'False');
            document.getElementById('remainTime').innerHTML = "None";
            localStorage.setItem('ACCOUNT_STATUS', 'False');
        }
    }


 // 🕹️ Get current time in seconds
    let currentSeconds = () => {
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime;
    }


 // 🕹️ Format seconds
    let f_seconds = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
        return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
    }


// 🕹️ Create modal -MODULE-
    var createModal = (modalContent, required, display, idModal, _function = () =>{}) => {
        let modal = '';

        if (required == 'required') {

            modal = `
                <div class="modal fade ${idModal}" id="${idModal}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="${idModal}Label" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="bg-darks modal-content">
                            <div class="modal-body">
                                ${modalContent[0]}
                            </div>
                            <div class="modal-footer" style="display:${display}">
                                <button type="button" id="btnCancel_${idModal}" class="buttonsModal" data-bs-dismiss="modal">${modalContent[1]}</button>
                                <button type="button" id="btnConfirm_${idModal}" class="buttonsModal" data-bs-dismiss="modal">${modalContent[2]}</button>
                            </div>
                        </div>
                    </div>
                </div>`;

        } 
        else {        
            modal = `
                <div class="modal fade ${idModal}" id="${idModal}" tabindex="-1" aria-labelledby="${idModal}Label" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="bg-darks modal-content">
                        <div class="modal-body">
                            ${modalContent[0]}
                        </div>
                        <div class="modal-footer" style="display:${display}">
                            <button type="button" id="btnCancel_${idModal}" class="buttonsModal" data-bs-dismiss="modal">${modalContent[1]}</button>
                            <button type="button" id="btnConfirm_${idModal}" class="buttonsModal" data-bs-dismiss="modal">${modalContent[2]}</button>
                        </div>
                        </div>
                    </div>
                </div>`;
        }
        // Get the modal container element
        const modalContainer = document.getElementById('modalContainer');

        // Append the modal HTML to the modal container
        if (modalContainer) {

            $('.'+idModal).remove();
            $('#modalContainer').append(modal);

            $('#btnCancel_'+idModal).click(() => {
                btnCliked = false;
                _function(btnCliked);
            });

            $('#btnConfirm_'+idModal).click(() => {
                btnCliked = true;
                _function(btnCliked);
            });
        }
    }


// 🕹️ Start account Restriction
    let startRestriction = () => {

        let notAllowed = new bootstrap.Modal('#Notallowed', {
            keyboard: false
        });
    
        document.getElementById('notAllowedMessage').innerHTML =`
            <p class="pInfoAging">Aging process already started ⏳ Click <span id="" style="color: #ff4458;">"Account Status"</span> for details</p>
        `;

        if (localStorage.getItem('ACCOUNT_STATUS') == "False") {
            localStorage.setItem('ACCOUNT_STATUS', currentSeconds());

            updateStatusBOT("\n ");
            updateStatusBOT("\n[⏳] You started aging this account: ");
            localStorage.setItem('agingAccount', 'True');
        }
        else{
            notAllowed.toggle();
            updateStatusBOT("\n ");
            updateStatusBOT('\n[⚠️] Aging process already started ⏳ Click "Account Status" for details: ');
        }
    }

// 🕹️ Function to copy text to clipboard
    let copyTextToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    }

// ======================================================================================================================
// HTML BODY
    var eleBody = document.createElement('div');
    eleBody.setAttribute("id", "draggable-1");
    eleBody.style.cssText = '';

    // Title //
    eleBody.innerHTML = `
    <div id="tinderBOT"container class="">
    
        <div class="row ">
            <div class="col-9">
                <p class="toolHead" style="font-weight: bold;"><i class="fa-solid fa-robot"></i> <span style="color:#d44dff"> KIT</span>Forge</p>
            </div>

            <div class="col" id="settingBot">
                <p class="button1 functions" style="font-size: 16px; padding-left: 23px; padding-bottom: 5px !important; padding-top: 20px !important;" data-bs-toggle="modal" data-bs-target="#agingAccount"><span style="margin-right:0px !important;" class="icons"><i class="fa-solid fa-gear"></i></span></p>
            </div>            
        </div>


        <div id="screenLog" style="">[BOT] Loading: ${await getDate()}</div>

        <p id="swiper" class="button1 functions"><span class="icons"><i class="fa-solid fa-play"></i></span> Start Swiper</p>
        
        <p id="unMatch"class="button1 functions"> <span class="icons"><i class="fa-solid fa-user-minus"></i></span> UnMatch</p>
        <p id="unMatch2"class="button1 functions"> <span class="icons"><i class="fa-solid fa-rocket"></i></span> Send Snap</p>
        
        <div class="container button2">
            <div class="row" style="text-align: center !important;">
                <div class="col">
                    <p id="nChat"  class="button2 functions" style=""> <span class="icons"><i class="fa-solid fa-comment-dots"></i></span>Chat <span id="_nChat" class="notification">0</span></p>
                </div>
                <div class="col">
                    <p id="nMatch" class="button2 functions" style=""> <span class="icons"><i class="fa-solid fa-comment-medical"></i></span>Match <span id="_nMatch" class="notification">0</p>
                </div>
            </div>
        </div>
        
    </div>
    `;

    eleBody.innerHTML += '<audio id="click_audio" src="https://assets.mixkit.co/active_storage/sfx/2854/2854-preview.mp3"></audio>';
    eleBody.innerHTML += '<audio id="done_audio" src="https://assets.mixkit.co/active_storage/sfx/217/217-preview.mp3"></audio>';

    document.body.prepend(eleBody);
    
    var eleStyle = document.createElement('style');
    eleStyle.innerHTML =`
        #tinderBOT {
            z-index: 2000;
            border-radius:15px;
            background: #0a060ce6;
            backdrop-filter: blur(20px);
        }

        .bg-darks {
            top: 50px;
            background-color: #111418cf !important;
            margin: 0px;
            color: #9ea4ac !important;
            font-size: 19px;
            backdrop-filter: blur(30px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
            padding: 20px 20px !important;
        }

        .modal-body{
            padding: 20px 20px !important;
        }

        .buttonsModal {
            margin: 0px;
            color: #9ea4ac;
            font-size: 19px;
            padding: 20px 20px;
        }

        .buttonsModal:hover {
            color: #ff4458;
        }

        .modal-footer{
            border-top: #ffffff42 solid 1px !important;
        }

        .g_input::placeholder {
            color: #ffffff42 !important;
        }

        .hInfoAging{
            margin-left: 40px;
            margin-right: 60px;
            font-weight:bold;
        }

        .pInfoAging{
            margin-left: 60px;
            font-size: 18px;
            font-weight: bold;
        }

        .agingAccount{
            top: -40px! important;
        }

        .copyyy:hover{
            color: #ffae44d6 !important;
            cursor: pointer;
        }

        #draggable-1 {
            min-width: 300px;
            max-width: 100px;
            float: left !important;
            left: 27%;
            top: 50px;
            position: fixed !important;
            z-index: 1000;
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        }

        .toolHead {
            color: #f1f2f6;
            margin: 0px;
            padding: 18px;
            background-position: top;
        }

        #screenLog {
            display: block;
            background: #111418;
            height: 164px;
            padding: 36px;
            font-size: 15px;
            color: #b9bfc899;
            overflow-y: scroll;
        }

        .button2 {
            color: #c9d2df;
            font-size: 18px;
            font-weight: bold;
            width: 100%;
            margin-top: 28px;
            padding-bottom: 15px;
        }

        .button1 {
            color: #c9d2df;
            font-size: 18px;
            font-weight: bold;
            width:100%;
            padding-left: 43px;
            padding-top: 23px;
            padding-bottom: 15px;
            transition: background 0.5s ease, border-left 0.5s ease, color 0.5s ease;
        }

        .modal-footer {
            border-top: none !important;
        }
        
        .icons {
            margin-right: 10px;
        }

        .functions:hover {
            cursor: pointer;
            color: #ff4458;
            animation: borderAndColorAnimation 0.5s ease;
        }

        .functions:active {
            border-left-color: #55efc4 !important;
            cursor: pointer;
            animation: borderAndColorAnimation 0.05s ease;
        }

        .noAvailable {
            border-left-color: #3c444f !important;
            background-color: #3c444f2e !important;
            color: #7c8591 !important;
        }

        .notification {
            display: none;
            width: 24px;
            height: 24px;
            background-color: #3c444f;
            color: white;
            text-align: center;
            border-radius: 100%;
            font-size: 11px;
            margin-left: 5px;
            line-height: 25px;
        }

        @keyframes borderAndColorAnimation {
            from {
                border-left-width: 1rem;
            }
            to {
                border-left-width: 1rem;
            }
          }
    `;

    updateStatusBOT("\n[BOT] Toolkit V "+botVersion+": ");
    updateStatusBOT("\n[BOT] Tinder V "+tiVersion+": ");
    updateStatusBOT("\n[⚠️] Loading... restart the page if you don't see ''Tinder BOT Fully loaded'': ");

// 🕹️ Make the tool draggable
    $(() => {
        $( "#draggable-1" ).draggable();
        $( "#droppable-1" ).droppable();
    });

    document.head.prepend(eleStyle);

    $("head").prepend(
        '<link ' + 'href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" ' + 'rel="stylesheet" type="text/css">',
        '<script ' + 'src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" ' + 'type="text/javascript"></script>',
        '<link ' + 'href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" ' + 'rel="stylesheet" type="text/css">'
    );
       

    const functionsElements = document.getElementsByClassName("functions");
    for (const element of functionsElements) {
      element.onclick = play;
    }

    $('#swiper').click(()=>{
        runScript()
    })
    //document.getElementById("swiper").addEventListener("click", runScript);

    document.getElementById("unMatch2").addEventListener("click", sendCard);
    document.getElementById("unMatch").addEventListener("click", unMatchApi);
    document.getElementById("nChat").addEventListener("click", __getChat);
    document.getElementById("nMatch").addEventListener("click", __getMatchChat);


    $('body').append('<div id="modalContainer"></div>');

    // Live real time ageTimeCheker
    var ageTimeCheker = async () => {
        let accountTime_s = localStorage.getItem('ACCOUNT_STATUS'); // WARNING ⚠️ 
        let currentTime_s = currentSeconds();
        let remainingTime = Math.abs(accountTime_s - currentTime_s);
        let restriction_status = localStorage.getItem('agingAccount');
        let Like_count = localStorage.getItem('Like_count');
        let Deslike_count = localStorage.getItem('Deslike_count');
        let Match_count = localStorage.getItem('Match_count');

        if (remainingTime.toString() != 'NaN') {
            document.getElementById('remainTime').innerHTML = f_seconds(remainingTime);
        }

        if (Number(f_seconds(remainingTime).split(" ")[0].split('h')[0]) > 48) {
            document.getElementById('agingStatus__2').innerText = "Completed";
        } else if (restriction_status == "True") {
            document.getElementById('agingStatus__2').innerText = "Aging...";
        } else {
            document.getElementById('agingStatus__2').innerText = "None";
        }

        document.getElementById('email_profile').innerHTML = localStorage.getItem('profile_email');
        document.getElementById('phone_number').innerHTML = localStorage.getItem('profile_phone_number');

        document.getElementById('restriction__2').innerHTML = restriction_status;
        document.getElementById('Like_count').innerHTML = Like_count;
        document.getElementById('Deslike_count').innerHTML = Deslike_count;
        document.getElementById('Match_count').innerHTML = Match_count;
        console.log("Task running...")
    }

    setTimeout(() => {
        if (localStorage.getItem('agingAccount') == null) { 
            localStorage.setItem('agingAccount', 'False');
        }
        if (localStorage.getItem('Like_count') == null) { 
            localStorage.setItem('Like_count',0);
        }
        if (localStorage.getItem('Deslike_count') == null) { 
            localStorage.setItem('Deslike_count',0);
        }
        if (localStorage.getItem('Match_count') == null) { 
            localStorage.setItem('Match_count',0);
        }

    }, 700);

    // Check and run one time some mandatory functions 
    setTimeout(async () => {
        if (localStorage.getItem('ACCOUNT_STATUS') != "False") { // WARNING ⚠️ 
            let notAllowed = new bootstrap.Modal('#agingAccount', {
                keyboard: false
            });
            notAllowed.toggle();
            task = setInterval(()=>{
                ageTimeCheker();
            },400);
        }

        // Store profile information in local storage once
        if (localStorage.getItem('profile_id') == null) 
        { 
            await getProfileData();
            await sleep(1500);

            localStorage.setItem('profile_id', await profile.user._id);
            localStorage.setItem('profile_email', await profile.account.account_email);
            localStorage.setItem('profile_phone_number', ''+await profile.account.account_phone_number+'');
            localStorage.setItem('profile_create_date', await profile.user.create_date);
        }
        const dateString = localStorage.getItem('profile_create_date');

        const date = new Date(dateString);

        const month = date.getMonth() + 1; // Adding 1 because getMonth() returns a zero-based index
        const day = date.getDate();
        const year = date.getFullYear();

        const formattedDate = month + '/' + day + '/' + year;

        updateStatusBOT("\n[BOT] Creation date: "+formattedDate);
        updateStatusBOT("\n[BOT] Tinder BOT Fully loaded: ");

    }, 1000);

    // Aging account modal
        createModal(
            [
                `
                <h1 style="font-size: 21px; padding-bottom: 18px; border-bottom: #ffffff42 solid 1px !important;"><span class="icons"><i class="fa-solid fa-gear"></i></span>SETTING</h1>
                </br>
                <p class="hInfoAging">Healh</p>
                    <p class="pInfoAging">Aged: <span id="remainTime" style="color: #ff4484cf;">None</span></p>
                    <p class="pInfoAging">Aging Status: <span id="agingStatus__2" style="color: #ff4484cf;">None</span></p>
                    <p class="pInfoAging">Restricted: <span id="restriction__2" style="color: #ff4484cf;">None</span></p>

                    <p class="pInfoAging">Email: <span id="email_profile" class="copyyy" style="color: #ff4484cf;">None</span></p>
                    <p class="pInfoAging">Number: <span id="phone_number" class="copyyy" style="color: #ff4484cf;">None</span></p>
                </br>
                <p class="hInfoAging">Swipe</p>
                    <p class="pInfoAging">Like Sent: <span id="Like_count" style="color: #ff4484cf;">0</span></p>
                    <p class="pInfoAging">Deslike Sent: <span id="Deslike_count" style="color: #ff4484cf;">0</span></p>
                    <p class="pInfoAging">Matches: <span id="Match_count" style="color: #ff4484cf;">0</span></p>
                </br>
                <p class="hInfoAging">Tools</p>

                <div class="container">
                    <div class="row">
                        <div class="col">
                            <p type="button" style="color: #ff4484cf;" class="pInfoAging agingAccounts" >Start Aging</p>
                        </div>
                        <div class="col">
                            <p type="button" style="color: #ff4484cf;" class="pInfoAging pInfoAging1 nBio" data-bs-toggle="modal" data-bs-target="#cardUpdate">Update Card</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <p type="button" style="color: #ff4484cf;" class="pInfoAging pInfoAging1 _removeChats" >Clean Spam</p>
                        </div>
                        <div class="col">
                            <p type="button" style="color: #ff4484cf;" class="pInfoAging pInfoAging1 nBio" data-bs-toggle="modal" data-bs-target="#bioUpdate">Update Bio</p>
                        </div>
                    </div>
                </div>

                `,
                '<span style="color:#ff4484cf; font-weight:bold;">Remove Restriction</span>',
                '<span style="font-weight:bold;">Close</span>'
            ], 'required', '', 'agingAccount', removeRestriction
        );
       
        
    // 🕹️ Clean input's value
        $('.agingAccounts').click(()=>{  // WARNING ⚠️ 
            // create a cookie that last 2 days with a value of 2 days in secods
            startRestriction();
        });

    // 🕹️ Remove chats
        $('._removeChats').click(async ()=>{
            removeChats();
        });


    // Updating bio
        createModal(
            [
                `
                <form>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label"> <span class="icons"><i class="fa-solid fa-blog"></i></span>Update Account's Bio:</label>
                        </br>
                        </br>
                        <textarea placeholder="Update account's bio or leave blank to remove it" class="form-control g_input" id="bioInput" style="border: #ffffff42 solid 1px;height: 50px; font-size:17px; padding:10px; color:white; background-color: #47474700"></textarea>
                    </div>
                </form>
                `,
                'Cancel', 
                'Accept'
            ], 'required', '', 'bioUpdate', updateBIO
        );


    // Updating card
        createModal(
            [
                `
                <form>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label"> <span class="icons"><i class="fa-brands fa-snapchat"></i></span>Update Account's snapchat card:</label>
                        </br>
                        </br>
                        <textarea placeholder="Update account's snapchat card" class="form-control g_input" id="cardInput" style="border: #ffffff42 solid 1px;height: 50px; font-size:17px; padding:10px; color:white; background-color: #47474700"></textarea>
                    </div>
                </form>
                `,
                'Cancel', 
                'Accept'
            ], 'required', '', 'cardUpdate', _updateCARD
        );

        // Aging account modal
        createModal(
            [
                `
                <h1> <span class="icons"><i class="fa-solid fa-triangle-exclamation"></i></span> Action not allowed</h1>
                </br>
                <span id="notAllowedMessage">
                </span>
                `,
                '',
                ''
            ], 'Notrequired', 'none', 'Notallowed'
        );


        // Clean input's value
        $('.functions').click(()=>{
            $('.g_input').val('');
        });

        $("#settingBot").click(()=>{

            // Check if task exists and clear it if it does
            clearInterval(task);

            // Set a new interval
            task = setInterval(()=>{
                ageTimeCheker();
            },400);
        })


        // Clean intervals to save memory
        $("#btnConfirm_agingAccount").click(()=>{
            clearInterval(task);
        });

        $("#btnCancel_agingAccount").click(()=>{
            clearInterval(task);
        });

        $(".pInfoAging1 ").click(()=>{
            clearInterval(task);
        });


    // 🕹️ Click event listener for the <p> element
        document.getElementById('email_profile').addEventListener('click', function() {
            const textToCopy = this.textContent || this.innerText;
            copyTextToClipboard(textToCopy);
        });
        document.getElementById('phone_number').addEventListener('click', function() {
            const textToCopy = this.textContent || this.innerText;
            copyTextToClipboard(textToCopy);
        });


})();
