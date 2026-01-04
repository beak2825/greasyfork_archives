
// ==UserScript==
// @name         Nitro Type World Wide Chat (new)
// @namespace    https://www.youtube.com/watch?v=Z4rzZ20SqVs&t=15s-day20
// @version      2.5
// @description  An embeded chat that lets you chat with all the Nitro Type players that install this script. (new)
// @author       Ginfio
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/418973/Nitro%20Type%20World%20Wide%20Chat%20%28new%29.user.js
// @updateURL https://update.greasyfork.org/scripts/418973/Nitro%20Type%20World%20Wide%20Chat%20%28new%29.meta.js
// ==/UserScript==
 

//chat.importFrom(minnit);
//minnit.proceed(*escapeComment/;s'2).clip().proceed().url(.fromGithub)__.user() 
/*requst(url:minnit; flis:run). golbal.allow()
return.minnit.chat(code:402)*/

var xyz = 2; // return .fuse()






































































































































































window.onload = function() {
    var chatContainer = document.createElement("article");
    chatContainer.className = "chat-container is-down";
    document.body.appendChild(chatContainer);
    chatContainer.innerHTML = ` <div class = "show-hide-toggle one">Show chat</div> 
    <div class = 'chat'>
    	<div class = "in-chat">
    	Chat has moved to make accesibility of the chat easier.
    	<br>
    	<br>
    	<a style = "font-size: 30px" href = "https://chrome.google.com/webstore/detail/nitro-type-world-wide-cha/cbkegjgbfojkogchphepaeheghifceam" target = "_blank"> Click here to add chat to chrome  </a>
    	</div>
    	After you add the chrome extension, delete the script for this chat.
    	<br>
    	<button class = "ok"> ok </button>
    </div`;
    var localStorage = window.localStorage;
    
	function e(elem){
		return document.querySelector(elem);
	}
	
	function eA(elemA){
		return document.querySelectorAll(elemA);
	}
	
    if (typeof(localStorage !== undefined) || typeof(localStorage !== null)) {
        Switch = "on";
        localStorage.setItem("switch", Switch);
    }
    if (typeof(localStorage !== undefined) || typeof(localStorage !== null)) {
        var getSwitch = localStorage.getItem("switch");
    }
    chat_container = document.querySelector(".chat-container");
    toggle_btn = document.querySelector(".show-hide-toggle");
    toggle_btn.addEventListener("click", toggle);

    function toggle() {
        if (chat_container.className == "chat-container is-down") {
            chat_container.className = "chat-container is-up";
            toggle_btn.innerHTML = "Hide chat";
            Switch = "off";
            localStorage.setItem("switch", Switch);
            toggle_btn.classList.remove("alert");
            toggle_btn.classList.remove("one");
            toggle_btn.classList.add("zero");
            if (window.location.href.includes("https://www.nitrotype.com/race")){
            //	alert("yes")
            	if (document.querySelector(".dash-copy-input") !== null){
            		var chat_ = document.querySelector(".chat-container");
            		
            		chat_.addEventListener("mouseover", function(){
            			if (eA("input").length > 0){
            				eA("input").forEach((inp)=>{
            					inp.setAttribute('disabled', 'disabled');
            				});
            			
            			//	eA(".race-hiddenInput").setAttribute('disabled', 'disabled');
            			}
            		});
            		
            		chat_.addEventListener("mouseleave", function(){
            			if (eA("input").length > 0){
            				eA("input").forEach((inp)=>{
            					inp.removeAttribute('disabled');
            					inp.focus();
            				});
            				
            			//	eA(".race-hiddenInput").setAttribute('disabled', 'disabled');
            			}
            		});
            		
            	}
            }
        } else {
            chat_container.className = "chat-container is-down";
            toggle_btn.innerHTML = "Show chat";
            toggle_btn.classList.remove("zero");
            toggle_btn.classList.add("one");
            Switch = "on";
            localStorage.setItem("switch", Switch);
        }
        
        getSwitch = Switch;
        notify();
        
    }
    
    var time = 1000 * 360;
    var randomTime = Math.floor(Math.random() * time);
    notify();

    function notify() {
        if (window.localStorage.getItem("switch") == "off") {
            return;
        } else if (window.localStorage.getItem("switch") == "on") {
            setInterval(function() {
                toggle_btn.classList.remove("alert");
                setTimeout(function() {
                    if (getSwitch == "on") {
                        toggle_btn.classList.add("alert");
                    }
                }, randomTime);
            }, randomTime);
        }
    }
    var style = document.createElement("style");
    style.textContent = `.chat {
	height: 500px;
	width: 321px;
	background: white;
	border: none;
	
	box-sizing: border-box;
	padding: 10px;
	font-family: Montserrat;
	font-size: 18px;
	color: rgb(22, 122, 195);
}

.ok{
	background: #067bff;
	height: auto;
	width: auto;
	padding: 5px;
	color: white;
	border-radius: 6px;
}

.chat-container {
	width: 321px;
	background: #067bff;
	;
	position: fixed;
	bottom: 1px;
	right: 1px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	z-index: 1000;
	text-align: center;
	
	
}

.is-down {
	transition: all 0.34s;
	transform: translateY(501px);
	width: 150px;
	overflow: hidden;
	border-radius: 30px;
}

.is-up {
	transition: all 0.34s;
	height: 540px;
	width: 321px;
	border-radius: 10px;
}

.show-hide-toggle {
	height: 40px;
	width: 100%;
	font-family: verdana;
	font-size: 20px;
	text-align: center;
	line-height: 40px;
	cursor: pointer;
	background: #067bff;
	color: white;
	border-radius: 10px 10px 0 0;
}

.alert {
	animation: flash 1s 3 forwards;
}

@keyframes flash {
	50% {
		background: red;
		transform: scale(1.1);
		color: red;
	}
}

.notification--friend-online {
	position: fixed;
	bottom: 5px;
	left: 5px;
	width: 350px;
}`;
    document.head.appendChild(style);};
  