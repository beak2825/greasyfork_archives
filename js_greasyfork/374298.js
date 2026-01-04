// ==UserScript==
// @name         tipsv2.0redone
// @namespace    http://tampermonkey.net/
// @version      1
// @author       You
// @match        *://gamdom.com/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @description fuckingtips
// @downloadURL https://update.greasyfork.org/scripts/374298/tipsv20redone.user.js
// @updateURL https://update.greasyfork.org/scripts/374298/tipsv20redone.meta.js
// ==/UserScript==
//Оставлять окно активным
Object.defineProperty(document, "hidden", { value : false});

let counter = 0;
let fiftycounter = 0;
let forbiddenwords = ["coins","tip","conti","howly","bot","монет","тип","конти","ховли","бот"];
let usedbefore = [];
let jqueryrandmsg;
let timersleep = 0;	
let sleep;
let timercheck;
let tiptoalt = false;
var TipArraySasha = [];

setTimeout(()=>{
	//заготовочка для запуска
	let Start;
	let TypeChoice;
	//функция для случайного числа
	function randomInteger(min, max) {
	    var rand = min - 0.5 + Math.random() * (max - min + 1);
	    rand = Math.round(rand);
	    return rand;
	}
	//Функция которая срабатывает при изменении DOM 
	var Arrive=function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback)}function i(e){e.arrive=f.bindEvent,r(f,e,"unbindArrive"),e.leave=d.bindEvent,r(d,e,"unbindLeave")}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n)},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n}},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r)},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t}}}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null)}},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding(function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n)});var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o}),i.beforeRemoving(function(e){e.observer.disconnect()}),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n)},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent(function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1})},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1},i.removeEvent(t)},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent(function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1})},this},s=function(){function e(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}function t(e,t){e.forEach(function(e){var n=e.addedNodes,i=e.target,o=[];null!==n&&n.length>0?l.checkChildNodesRecursively(n,t,r,o):"attributes"===e.type&&r(i,t,o)&&o.push({callback:t.callback,elem:i}),l.callCallbacks(o,t)})}function r(e,t){return l.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=o++),-1==t.firedElems.indexOf(e._id))?(t.firedElems.push(e._id),!0):!1}var i={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};f=new a(e,t);var c=f.bindEvent;return f.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t);var o=l.toElementsArray(this);if(t.existing){for(var a=[],s=0;s<o.length;s++)for(var u=o[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:r,elem:u[f]});if(t.onceOnly&&a.length)return r.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a)}c.call(this,e,t,r)},f},u=function(){function e(){var e={childList:!0,subtree:!0};return e}function t(e,t){e.forEach(function(e){var n=e.removedNodes,i=[];null!==n&&n.length>0&&l.checkChildNodesRecursively(n,t,r,i),l.callCallbacks(i,t)})}function r(e,t){return l.matchesSelector(e,t.selector)}var i={};d=new a(e,t);var o=d.bindEvent;return d.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t),o.call(this,e,t,r)},d},f=new s,d=new u;t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var h={};return r(f,h,"unbindAllArrive"),r(d,h,"unbindAllLeave"),h}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);

	$(".chat-input").keyup(function (event) {
	    if(event.which == 96)//down copy
	    {
	        event.preventDefault();
			let timeleft = (timercheck - counter)/20 ;
			console.log("Время до следующей отметки : " + timeleft + " секунд");
	    }
	});
	//Подбор фразы
	function PickPhrase(TextArray,UsedArray,BotType = 3){
		switch(BotType)
		{
			case 1:
				let typeresult = '';
				//for(let pickcounter = 0;pickcounter<randomInteger(1,3);pickcounter++)
				//{
					typeresult += PickfromChat();
				//	typeresult += " ";
				//}
				return typeresult
				break;
			case 2:
				if(randomInteger(0,1)==0)
				{
					let typeresult = '';
					//for(let pickcounter = 0;pickcounter<randomInteger(1,3);pickcounter++)
					//{
						typeresult += PickfromChat();
					//	typeresult += " ";
					//}
					return typeresult;
				}
				else
				{
					let Phrase = TextArray[randomInteger(0,TextArray.length-1)];
					//console.log(TextArray.length + "   " + UsedArray.length);
					//console.log(TextArray + "   " + UsedArray);
					for (let i = UsedArray.length; i >= 0; i--) {
						if(UsedArray.length >= TextArray.length){
							UsedArray.splice(0,UsedArray.length);//Очистка доп. массива при равности их длинн.
							break;
						}
						if(Phrase == UsedArray[i]){
							//console.log("retrying");
							Phrase = TextArray[randomInteger(0,TextArray.length-1)];
							//console.log("Randomed" + Phrase);
							i = UsedArray.length;
						}
					}
					return Phrase;
				}
				break;
			case 3:
				let Phrase = TextArray[randomInteger(0,TextArray.length-1)];
				//console.log(TextArray.length + "   " + UsedArray.length);
				//console.log(TextArray + "   " + UsedArray);
				for (let i = UsedArray.length; i >= 0; i--) {
					if(UsedArray.length >= TextArray.length){
						UsedArray.splice(0,UsedArray.length);//Очистка доп. массива при равности их длинн.
						break;
					}
					if(Phrase == UsedArray[i]){
						//console.log("retrying");
						Phrase = TextArray[randomInteger(0,TextArray.length-1)];
						//console.log("Randomed" + Phrase);
						i = UsedArray.length;
					}
				}
				return Phrase;
				break;
		}
	};

	function PickfromChat(){
		let msglist = $(".messages");
		let max = $(".messages").children().length-1;
		let rndmsg = randomInteger(0,max);
		let rndmsgjq = $($(".messages").children()[rndmsg]);
		let check = true;
		//let words = msgstring.split(' '); 
		//let rndmsgword = words[randomInteger(0,words.length-1)];
		while(rndmsgjq.hasClass("msg-info-message") || rndmsgjq.hasClass("rain-message") || rndmsgjq.hasClass("msg-moderator-message")){
			rndmsg = randomInteger(0,max);
			rndmsgjq = $($(".messages").children()[rndmsg])
		}
		let msgstring = rndmsgjq.children(".msg-body").text();
		while(check === true){
			//console.log("picked" + rndmsgword);
			//rndmsgword = RePick(msgstring,rndmsg,words,rndmsgword);
			//console.log("repicked" + rndmsgword);
			msgstring = RePick(msgstring,rndmsg);
			console.log("unchecked");
			check = Test(msgstring);
		}
		if(usedbefore.length >= 25)
			usedbefore.splice(0,usedbefore.length);
		usedbefore.push(msgstring);
		return msgstring.toLowerCase();
	}

	function Test(rndmsgword){
		let retarded = false;
		if(/\d/.test(rndmsgword) == true){
			retarded = true;
		}
		else if(/[0-9]/.test(rndmsgword) == true){
			retarded = true;
		}
		else if(isURL == true){
			retarded = true;
		}
		else if(CheckWord(rndmsgword) == true){
			retarded = true;
		}
		else if((rndmsgword.includes("_") || rndmsgword.includes("*") || rndmsgword.includes("-") || rndmsgword.includes("#"))){
			retarded = true;
		}
		else if(rndmsgword.length<4){
			retarded = true;
		}
		else if(rndmsgword.length>70){
			retarded = true;
		}
		for(let i = 0;i<forbiddenwords.length;i++)
		{
			if(rndmsgword.includes(forbiddenwords[i]))
			{
				retarded = true;
			}
		}
		for(let i = 0;i<usedbefore.length;i++)
		{
			if(rndmsgword.includes(usedbefore[i]))
			{
				retarded = true;
			}
		}
		console.log("bad word alert");
		return retarded;
	}

	function RePick(_msgstring,_rndmsg){
		let max = $(".messages").children().length-1;
		_rndmsg = randomInteger(0,max);
		//_words = _msgstring.split(' '); 
		//_rndmsgword = _words[randomInteger(0,_words.length-1)];
		let rndmsgjq = $($(".messages").children()[_rndmsg]);
		while(rndmsgjq.hasClass("msg-info-message") || rndmsgjq.hasClass("rain-message") || rndmsgjq.hasClass("msg-moderator-message")){
			_rndmsg = randomInteger(0,max);
			rndmsgjq = $($(".messages").children()[_rndmsg]);
		}
		_msgstring = rndmsgjq.children(".msg-body").text();
		console.log("Repicked:" + _msgstring)
		return _msgstring.toLowerCase();
	}

	function CheckWord(word){
		if(word.length==3 && word.toLowerCase().includes("ть"))
			return true;
		else
			return false;
	}

	function isURL(str) {
	  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
	  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	  '(\\:\\d+)?'+ // port
	  '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
	  '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
	  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	  return pattern.test(str);
	}

	//Окошко выбора режима бота
	function ChooseWindow(){
		let buttondiv=$('<li></li>', {
		    //class: "msg-chat-message",
		});
		buttondiv.append(CreateButton("Только рандом слово",1,buttondiv));
		buttondiv.append(CreateButton("Через раз",2,buttondiv));
		buttondiv.append(CreateButton("Только из файла",3,buttondiv));
		$(".messages").append(buttondiv);
	}
	//Кнопки для окошка
	function CreateButton(Text,Number,buttondiv){
		let styles = {
	      backgroundColor : "black",
	      color: "green",
	      display: "inline-block",
	    };
		let button=$('<button>',{
			text: Text,
		}).css(styles);

		button.on("click",() => {
			TypeChoice = Number;
			buttondiv.css("display","none");
			Start();
		});
		return button;
	}

	$(document).ready(() => {
		
		let TextArr;
		let UsedArr = [];
		let file;
		let TestedIDs = [];
		let reader;
		let alien = false; 
		let twmcounter = 0;
		//var GTGArray = ["Ребят,надо отойти,ща буду","Ща вернусь погодите","Я отойду","Уйду на пару минут","Пойду катать"];
		var SpamArray = [];
		var LevelCheck =  $(".messages li:last-child").find(".user-level").text();
		let SiteId;
		let msgnickname;

		ChooseWindow();

		// $(document).keypress(function(e) {
		//     var keycode = (e.keyCode ? e.keyCode : e.which);
		//     if (keycode == '13') {
		//     	console.log("enter");
		//     	counter = 0;
		//     	fiftycounter = 0;
		//     }
		// });

		Start = function StartBot(){
			if(TypeChoice != 1)
			{
				$(".messages").append($('<input>', {
				    type: 'file',
				    class: "filefinder",
				}));
		    	

				$(".filefinder").change(()=>{
					console.log("Файл выбран");
					file = document.getElementsByClassName('filefinder')[0].files[0];
					reader = new FileReader;
					reader.addEventListener('load', () => {
					    TextArr = reader.result.split(";");
					})
					reader.readAsText(file, 'UTF-8');
					$(".filefinder").remove();
					DoShit();
				});
			}
			else
				DoShit();

			function DoShit(){

				let time = randomInteger(3600,4500);
				timercheck = time;
				let msgtime = randomInteger(240,250);
				var Typer = setInterval(function Typer(){
					//console.log(alien);
					//if(alien == false)
					//{
						counter++;
						//по истечении трех минут если не было Сани в чате,рисуем отметочку.
						if(counter>=time){
							counter = 0;
							fiftycounter = 0;
							time = randomInteger(3600,4500);
							timercheck = time;
							//msgtime = randomInteger(200,299);
							let Choosen = PickPhrase(TextArr,UsedArr,TypeChoice);
					        $(".chat-input").val(Choosen);
						    //document.getElementsByClassName("chatInputSend")[0].click();
							let timeleft = timercheck/20 ;
							console.log("Время до следующей отметки : " + timeleft + " секунд");
						    //console.log(Choosen);
						    UsedArr.push(Choosen);
						}
						else if(fiftycounter>=msgtime){
							counter = 0;
							fiftycounter = 0;
							time = randomInteger(3600,4500);
							msgtime = randomInteger(240,250);
							let Choosen = PickPhrase(TextArr,UsedArr,TypeChoice);
					        $(".chat-input").val(Choosen);
						 //   document.getElementsByClassName("chatInputSend")[0].click();
						    //console.log(Choosen);
						    UsedArr.push(Choosen);
						}
					//}
				},50);
				$(document).arrive(".messages li:last-child", function() {
					// Появление новых сообщений
					//console.log(SpamArray);
					
					//LevelCheck =  $(".messages li:last-child").find(".user-level").text();
				    lastmsg = $(".messages li:last-child");

				     msgnickname = lastmsg.find(".user-name").children("span").text();

				 //      if(tiptoalt===true){
					// 	let reward = 625;
					// 	//lastmsg.children(0).children(0).click();
					// 	let ul = document.getElementsByClassName("msg-chat-message");
					// 	for (let i = 0,len = ul.length; i < len; i++){
					// 		li = ul[i];
					// 		//Get profile image, check if copy button exists
					// 		let profile_image = undefined;
					// 		for (let j = 0; j < li.childNodes.length; j++){
					// 			let child = li.childNodes[j];
					// 			if (child.classList.includes("user")){
					// 				let textname = child.childNodes[2].childNodes[0].innerHTML;
					// 				if(textname.includes("FireWater_GladPwnz")){
					// 					profile_image = child.firstChild;
					// 					break;
					// 				}
					// 			}
					// 		}
					// 		if(i==ul.length-1 && profile_image===undefined)
					// 		{
					// 			break;
					// 		}
					// 		if(profile_image!==undefined)
					// 		{
					//      		tiptoalt = false;
					// 			// Bring up the menu and navigate through
					// 			profile_image.click();
					// 			let menu = (document.getElementsByClassName("user-dropdown"))[0];
					// 			for (let k = 0; k < menu.childNodes.length; k++) {
					// 				let child = menu.childNodes[k];
					// 				if (child.innerHTML.toLowerCase() == "tip") {
					// 					child.click();
					// 				}
					// 			}
					// 			document.getElementById("tipAmount").value = reward;
					// 			(document.getElementsByClassName("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"))[0].click();
					//       		TipArraySasha.push("Передано 625 монет Big Lucker => [" + TipArraySasha.length + "]");
					//       		break;
					// 		}
					// 	}
					// }

				     if(!lastmsg.hasClass("msg-info-message") && lastmsg.hasClass("msg-moderator-message")){
				  		//   	let checks = false;

					     if(msgnickname.includes("Big Lucker"))
					     {
					     	fiftycounter = 0;
					     	counter = 0;
					     }

						// let find = '<span class=\"icon-balanceicon namepromotion\" title=\"This user has activated the Name Promotion\"></span>';
						// let regex = new RegExp(find, "g");

						// msgnickname = msgnickname.replace(regex, "Gamdom.com"); 
					 //    msgnickname = msgnickname.replace(/\s+/g,"%20");


					 //    for(let i = 0;i<=TestedIDs.length-1;i++)
					 //    {
					 //    	if(msgnickname==TestedIDs[i])
					 //    	{
					 //    		checks = true;
					 //    	}
					 //    }

					 //    if(checks === true)
					 //    {
					 //    	console.log("Id is already checked");
					 //    }
					 //    else{
						//    TestedIDs.push(msgnickname);

						//     //let url1 = encodeURIComponent(`https://gamdom.com/user/${msgnickname}.json`);
						//     let url1 = `https://gamdom.com/user/${msgnickname}.json`;

						//     let luldata;

						// 	$.ajax({
						// 	  dataType: "json",
						// 	  url: url1,
						// 	  data: luldata, 	
						// 	  error : function(jqXHR,textStatus,errorThrown){
						// 		let find2 = "Gamdom.com";
						// 		let regex2 = new RegExp(find2, "g");
						// 		let url2 = url1.replace(regex2, "gamdom.com"); 
						// 	  	$.ajax({
						// 		  type : 'GET',
						// 		  dataType: "json",
						// 		  url: url2,
						// 		  data: luldata,
						// 		  success: function (data) {
						// 			SiteId = data.user.id;
						// 	  		Renew(data.user.id);
						// 	  		//CheckForAliens(data.user.id);
						// 			console.log(SiteId);
						// 		},
						// 		});
						// 	  },
						// 	  success: function(data){
						// 	  	SiteId = data.user.id;
						//   		Renew(data.user.id);
						//   		//CheckForAliens(data.user.id);
						// 		console.log(SiteId);
						// 	  }
						// 	});
					 //    }

				     }

				    
					// if(alien === false)
					// {
					// 	let TimeCheck = new Date().getHours();
					// 	if((TimeCheck == 13 || TimeCheck==3)){
					// 		alien = true;
					// 		sleep = 3700;
					// 		let sex = setInterval(function(){
					// 			timersleep++;
					// 			if(timersleep>=sleep)
					// 			{
					// 				alien = false;
					// 				timersleep = 0;
					// 				clearInterval(sex);
					// 			}
					// 		},1000);
					// 	}
					// }

				    // if(!lastmsg.hasClass("msg-info-message")){
					   //  let TextMsg = lastmsg.children(".msg-body");
					   //  let MessageUndText = TextMsg.text().toLowerCase();

					   //  if(SpamArray.length <= 1)
					   //  	SpamArray.push(MessageUndText);
					   //  else{
					   //  	let spam = false;
					   //  	for(let i = 0; i < SpamArray.length; i++)
				    // 		{
				    // 			//console.log("Check: " + MessageUndText + "=" + SpamArray[i] + " " + i)
				    // 			if(MessageUndText != SpamArray[i]
				    // 			{
				    // 				spam = true;
				    // 				break;
				    // 			}
				    // 		}
				    // 		if(spam == false)
				    // 			SpamArray.push(MessageUndText);
				    // 		else if(spam == true){
				    // 			SpamArray.splice(0,SpamArray.length);//Очистка доп. массива при равности их длинн.
				    // 			SpamArray.push(MessageUndText);
				    // 		}
				    // 		if(spam == false && SpamArray.length >= 10){
								// $(".chat-input").val("стоп спам");
								// document.getElementsByClassName("chatInputSend")[0].click();
				    // 		}
					   //  }
				    // }

				    // if(lastmsg.hasClass("msg-admin-message")){
				    // 	if(alien === false)
			    	// 	 {
			    	// 	 	console.log("ALIENS");
			    	// 	 	alien = true;
				    // 		setTimeout(() => {
						  //       $(".chat-input").val(GTGArray[randomInteger(0,GTGArray.length)]);
						  //       document.getElementsByClassName("chatInputSend")[0].click();
				    // 		},5000);
			    	// 	 	var Timer = setInterval(() => {
			    	// 	 		//console.log(alien);
			    	// 	 		twmcounter++;
			    	// 	 		//console.log(twmcounter);
			    	// 	 		if(twmcounter>=1800)//ВКЛЮЧЕНИЕ БОТА ЧЕРЕЗ  20 СЕК НЕ МЕНЯТЬ
			    	// 	 		{
			    	// 	 			alien = false;
			    	// 	 			clearInterval(Timer);
			    	// 	 			twmcounter = 0;
			    	// 	 		}
			    	// 	 	},1000);//ОДИН ТИК - ОДНА СЕКУНДА НЕ МЕНЯТЬ
			    	// 	 }
				    // }
 					

				   //  function CheckForAliens(SiteId)
				   //  {
					  //   if(lastmsg.hasClass("msg-moderator-message"))
					  //   {
							// //console.log("LAST" + SiteId);
					  //   	if(alien === false)
					  //   	{
							//     if((SiteId != 276504 && SiteId != 2534 && SiteId != 62806 && SiteId != 441605 && SiteId != 107254 && SiteId != 0)){					    		 
					  //   		 	console.log("ALIENS");
					  //   		 	alien = true;
						 //    		setTimeout(() => {
							// 	        $(".chat-input").val(GTGArray[randomInteger(0,GTGArray.length)]);
							// 	        //console.log(GTGArray[randomInteger(0,GTGArray.length)]);
							// 	        document.getElementsByClassName("chatInputSend")[0].click();
						 //    		},5000);
					  //   		 	var Timer = setInterval(() => {
					  //   		 		//console.log(alien);
					  //   		 		twmcounter++;
					  //   		 		//console.log(twmcounter);
					  //   		 		if(twmcounter>=1800)//ВКЛЮЧЕНИЕ БОТА ЧЕРЕЗ  20 СЕК НЕ МЕНЯТЬ
					  //   		 		{
					  //   		 			alien = false;
					  //   		 			clearInterval(Timer);
				   //  		 				twmcounter = 0;
					  //   		 		}
					  //   		 	},1000);//ОДИН ТИК - ОДНА СЕКУНДА НЕ МЕНЯТЬ
					  //   		 }
					  //   		 else if((SiteId == 276504 || SiteId == 2534 || SiteId == 62806 || SiteId == 441605 || SiteId == 107254)){
					  //   		 	SiteId = 0;
					  //   		 }
						 //    }
					  //   }
				   //  }

				    if(!lastmsg.hasClass("msg-moderator-message")){
				    	if(lastmsg.hasClass("msg-info-message") || lastmsg.hasClass("rain-message")){
				    		//Исключение серых сообщений и сообщений о дожде
				    	}
				    	else{
				    		fiftycounter++;
				    	}
				    	//console.log(`сообщения : ${fiftycounter} , время : ${counter}`);
				    }	
				});

		    }
	    }
	});

	var TipArray = [];

	var buttondiv=$('<li></li>', {
	    class: "topbar-link",
	});
	var styles = {
		  color: "#b5bab",
	};
	var button=$('<a></a>',{
			text: "Show tips",
			class: "showTips",
	}).css(styles);

	button.on("click",() => {
		for(let i = 0; i<TipArray.length;  i++)
		{
			console.log(TipArray[i]);
			console.log(TipArraySasha[i]);
		}
	});

	buttondiv.append(button);

	$(".privLinks").append(buttondiv);
	$(document).arrive(".success", function() {
		let text = $(".success").text();
		if((text.includes("передал вам") || text.includes("has given you")) && text.includes("2250")){
			let url = "https://hooks.slack.com/services/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";
			let mes = "Conti типнул тебе на тривки =)";
			$.ajax({
			    data: 'payload=' + JSON.stringify({
			        "text": text
			    }),
			    dataType: 'json',
			    processData: false,
			    type: 'POST',
			    url: url
			});
			setTimeout(function(){
				let url = "https://hooks.slack.com/services/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";
				let mes = "Conti типнул тебе на тривки =)";
				$.ajax({
				    data: 'payload=' + JSON.stringify({
				        "text": text
				    }),
				    dataType: 'json',
				    processData: false,
				    type: 'POST',
				    url: url
				});
			},5000);
			//tiptoalt = true;
			//if((!text.includes("muted") && !text.includes("You have given") && !text.includes("Вы передали") && !text.includes("Success!")))
			//{
				setTimeout(()=>{
					$(".success").click();
				},125)
				let d = new Date();
				TipArray.push(text + " в "+ d.getHours() + ":" + d.getMinutes() + "       =>[" + (TipArray.length+1) + "]");
			//}
		}
	});

},5000)