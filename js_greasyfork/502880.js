// ==UserScript==
// @name         dA_Sidebar3
// @namespace    phi.pf-control.de/userscripts/dA_Sidebar3
// @version      1.8
// @description  Track /watch count on all sites. See /watch counts in /watch menu and button
// @author       Dediggefedde
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @grant        GM.notification
// @license      MIT; http://opensource.org/licenses/MIT
// @noframes
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/502880/dA_Sidebar3.user.js
// @updateURL https://update.greasyfork.org/scripts/502880/dA_Sidebar3.meta.js
// ==/UserScript==


(function() {
	'use strict';

	//terminology note:
	//  - read/unread according to state on deviantart.
	//  - new/old according to script database

	let settings={
			checkInterval:60, //interval to check/make requests [seconds]
			quickCheck:2, //number of notification pages to check. 0= all
			countRead:true, //shows only unread notifications
			checkOnPageLoad:true, //checks dA whenever a new page is loaded
			hideBar:false, //move bar down when not hovered
			barPosition:0, //0 left, 1 center, 2 right
			theme:0,//0:green, 1:Dark, 2:Light, 3:Auto
			pulseNew:true, //red pulsing animation when entries are new
			dynLoad:true, //check notification pages only until known notifications appear
			showNotif:false, //show system notification on new messages
	};

	let messages=[]; //object {id, ts, cat, msg, unread, scrKnown}
	let lastCheck=0; //timestamp of last check (seconds since 1-1-1970 UTC)
	let lastNotifCnt=0; //number of new messages that the last system notification was displayed for.
	let CatMsgs=new Map(); // temp msg grouped by cat
	let scrKnown=new Set(); //old elements

	let token="expired"; //security token for requests
	let div,cont,setdiv,style; //sidebar, content container, settings dialog
	let pageCheckCounter; //counter for how many notification pages are left to check

	let imgGear = '<svg  xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20.444057 20.232336" > <g transform="translate(-15.480352,-5.6695418)">  <g transform="matrix(0.26458333,0,0,0.26458333,25.702381,15.78571)"  style="fill:#000000">  <path  style="fill:#000000;stroke:#000000;stroke-width:1"  d="m 28.46196,-3.25861 4.23919,-0.48535 0.51123,0.00182 4.92206,1.5536 v 4.37708 l -4.92206,1.5536 -0.51123,0.00182 -4.23919,-0.48535 -1.40476,6.15466 4.02996,1.40204 0.45982,0.22345 3.76053,3.53535 -1.89914,3.94361 -5.1087,-0.73586 -0.4614,-0.22017 -3.60879,-2.2766 -3.93605,4.93565 3.02255,3.01173 0.31732,0.40083 1.8542,4.81687 -3.42214,2.72907 -4.2835,-2.87957 -0.32017,-0.39856 -2.26364,-3.61694 -5.68776,2.73908 1.41649,4.0249 0.11198,0.49883 -0.41938,5.14435 -4.26734,0.97399 -2.6099,-4.45294 -0.11554,-0.49801 -0.47013,-4.2409 h -6.31294 l -0.47013,4.2409 -0.11554,0.49801 -2.6099,4.45294 -4.26734,-0.97399 -0.41938,-5.14435 0.11198,-0.49883 1.41649,-4.0249 -5.68776,-2.73908 -2.26364,3.61694 -0.32017,0.39856 -4.2835,2.87957 -3.42214,-2.72907 1.8542,-4.81687 0.31732,-0.40083 3.02255,-3.01173 -3.93605,-4.93565 -3.60879,2.2766 -0.4614,0.22017 -5.1087,0.73586 -1.89914,-3.94361 3.76053,-3.53535 0.45982,-0.22345 4.02996,-1.40204 -1.40476,-6.15466 -4.23919,0.48535 -0.51123,-0.00182 -4.92206,-1.5536 v -4.37708 l 4.92206,-1.5536 0.51123,-0.00182 4.23919,0.48535 1.40476,-6.15466 -4.02996,-1.40204 -0.45982,-0.22345 -3.76053,-3.53535 1.89914,-3.94361 5.1087,0.73586 0.4614,0.22017 3.60879,2.2766 3.93605,-4.93565 -3.02255,-3.01173 -0.31732,-0.40083 -1.8542,-4.81687 3.42214,-2.72907 4.2835,2.87957 0.32017,0.39856 2.26364,3.61694 5.68776,-2.73908 -1.41649,-4.0249 -0.11198,-0.49883 0.41938,-5.14435 4.26734,-0.97399 2.6099,4.45294 0.11554,0.49801 0.47013,4.2409 h 6.31294 l 0.47013,-4.2409 0.11554,-0.49801 2.6099,-4.45294 4.26734,0.97399 0.41938,5.14435 -0.11198,0.49883 -1.41649,4.0249 5.68776,2.73908 2.26364,-3.61694 0.32017,-0.39856 4.2835,-2.87957 3.42214,2.72907 -1.8542,4.81687 -0.31732,0.40083 -3.02255,3.01173 3.93605,4.93565 3.60879,-2.2766 0.4614,-0.22017 5.1087,-0.73586 1.89914,3.94361 -3.76053,3.53535 -0.45982,0.22345 -4.02996,1.40204 z"  />  <circle  style="fill:#ffffff;stroke:#000000;stroke-width:1"  cx="0"  cy="0"  r="15" />  </g>  </g> </svg>';

	let themeNames=["","darktheme","lighttheme", "auto"];
	let autoTheme="";

	let iconMap=new Map([ //sidebar icon map, order of icons
			["Activity","🔔"],
			["Comments","📣"],
			["Replies","💬"],
			["Mentions","🚀"],
			["Correspondence","📬"],
	]);

	//Assigns categories to messages. Return values must be in iconMap! Return values are displayed as title.
	function assignCat(obj){
			//console.log("dA_Sidebar3:",obj) //uncomment to see message structures in the console
			if(obj.bucket=="bucket.mention")return "Mentions";
			else if(obj.type=="nc.comment")return "Comments";
			else if(obj.type=="nc.replied")return "Replies";
			else if(obj.messageClass.includes("correspondence"))return "Correspondence";
			else return "Activity";
	}

	//checks if a request need to be made or another website already triggered a request
	function makeRequest(){
			let ret=GM.getValue("lastCheck").then((time)=>{ //last request time in [s]
					if(Date.now()/1e3 - time < settings.checkInterval && !settings.checkOnPageLoad){
							GM.getValue("messages").then(msg=>{ //load notification from storage instead of deviantart
									messages=JSON.parse(msg);
									token="";
									return null;
							})
					}else{ //prepare request by loading security token
							return GM.getValue("token");
					}
			}).then(tok=>{ //csrf token. Needs to visit deviantart.com website to refresh
					if(tok==null)return null;
					token=tok;
					return request(); //web request to deviantart
			});
			return ret;
	}

	//requests notification pages from deviantart. Each response has a "cursor" hash to point to the next page
	function request(cursor=0){
			return new Promise(function(resolve, reject) {
					GM.xmlHttpRequest({
							method: "GET",
							url: `https://www.deviantart.com/_puppy/dashared/nc/bucket?bucket=bucket.user_feed_all&cursor=${cursor}&limit=20&csrf_token=${token}`, //puppy API request. limit=20 is maximum.
							headers: { //headers required for response
									"accept": 'application/json, text/plain, */*', //response in JSON format
									"content-type": 'application/json;charset=UTF-8'
							},
							onerror: function(response) {
									console.log("dA_Sidebar3:","error:", response);
									reject(response);
							},
							onload: async function(response) {
									let dat;
									try {
											dat = JSON.parse(response.responseText);
											cont.innerHTML=`Loading...(p${-pageCheckCounter})`; //display progress

											if(dat.status=="error" && dat?.errorDetails?.csrf){ //valid csrf token required
													token="expired"; //set it to invalid to show user error
													GM.setValue("token",token);
													updateHTML(); //display to user
													reject(dat); //cancel request
													return;
											}

											if(settings.dynLoad){ //dynamic loading: stop requesting new pages when a known notification is discovered
													for (const el of dat.messages) {
															if(messages.some(msg=>msg.id==el.messageId)){ //identify by messageId
																	resolve(dat);
																	return;
															}
													}
											}

											if (--pageCheckCounter!=0 && dat.hasMore) { //hasMore is true if another page exists. Unless user-defined max page-request is reached (pageCheckCounter==0)
													request(dat.cursor).then(nret => { //recursive call with next cursor/page
															dat.messages = dat.messages.concat(nret.messages); //callback: merge results
															resolve(dat);
															return;
													});
											} else { //if this is the last/only notification page to check
													resolve(dat);
											}
									} catch (e) {
											reject(e);
									}
							}
					});
			});
	}

	//initial call after storage is loaded (GM.getvalue)
	function init(){
			if(location.href.includes("deviantart.com")){ //fetch token when on deviantart.com and cancel
					let token=document.querySelector("input[name=validate_token]")?.value??token;
					GM.setValue("token",token);

					//fetch theme for auto-theme-mode
					if(document.body.classList.contains("theme-dark"))autoTheme="darktheme";
					else if(document.body.classList.contains("light-green"))autoTheme=""; //default
					else if(document.body.classList.contains("theme-light"))autoTheme="lighttheme";
					else autoTheme="";
					GM.setValue("autoTheme",autoTheme);
					// return;
			}

			injectHTML(); //inject sidebar into page

			if(settings.checkInterval>0 || settings.checkOnPageLoad)timer(); //request update (on pageload or initial)
			else updateHTML(); //update only manually: just display internal storage

			if(settings.checkInterval>0)setInterval(timer,settings.checkInterval*1e3); //request update in intervals
	}

	//generates text messages for notification objects. returns HTML code to be displayed as entry
	//note: contains only observed objects. there might be more, especially for commissions/group admins.
	//      will default to "Action of regarding {type}" and console.log the full object to be reported
	//note: Some objects not always contain the members, hence the object?.member??"" construct
	function convertMsgText(obj){
			try{
					let origNam=`<a class='dA_sb_user' target='_blank' href='https://www.deviantart.com/${obj.originator.username}'>${obj.originator.username}</a>`;
					let devTitl=(titl,url=null)=>`<${url==null?"span":"a target='_blank' href='"+url+"'"} class='dA_sb_title'>${titl}</${url==null?"span":"a"}>`;
					let comLink=(text,url=null)=>`<${url==null?"span":"a target='_blank' href='"+url+"'"} class='dA_sb_com'>${text}</${url==null?"span":"a"}>`;
					switch(obj.type){
							case "nc.fragments_replenish_receipt":
									return `You received ${devTitl(obj.messageData.fragmentsReplenishReceipt?.profit??"")} fragments.`;
							case "nc.fave":
									return `${origNam} added ${devTitl(obj.messageData.fave?.deviation?.title??"?",obj.messageData.fave?.deviation?.url)} to their favourites.`;
							case "nc.private_collect":
									return `${origNam}  added ${devTitl(obj.messageData.privateCollect?.deviation?.title??"?",obj.messageData.privateCollect?.deviation?.url)} to their private collection.`;
							case "nc.comment_liked":
									if(obj.messageData.comment?.comment?.commentable?.dataKey=="profile")return `${origNam} liked your comment their profile.`;
									else if(obj.messageData.comment?.comment?.commentable?.deviation) return `${origNam} liked your ${comLink("comment",obj.messageData.comment?.comment?.commentUrl)} on ${devTitl(obj.messageData.comment?.comment?.commentable?.deviation?.title??"?",obj.messageData.comment?.comment?.commentable?.deviation?.url)}.`;
									else if(obj.messageData.comment?.comment?.commentable?.forum) return `${origNam} liked your ${comLink("forum post",obj.messageData.comment?.comment?.commentUrl)} on ${devTitl(obj.messageData.comment?.comment?.commentable?.forum?.subject??"?","https://www.deviantart.com/forum/"+obj.messageData.comment?.comment?.commentable?.forum?.forumPath+"/"+obj.messageData.comment?.comment?.commentable?.forum?.threadId)}.`;
									else return `${origNam} liked your comment.`;
							case "nc.replied":
									if(obj.messageData.replied?.comment?.commentable?.dataKey=="profile")return `${origNam} replied to your comment on your profile.`;
									else if(obj.messageData.replied?.comment?.commentable?.deviation) return `${origNam} replied to your ${comLink("comment",obj.messageData.replied?.comment?.commentUrl)} on ${devTitl(obj.messageData.replied?.comment?.commentable?.deviation?.title??"?",obj.messageData.replied?.comment?.commentable?.deviation?.url)}.`;
									else if(obj.messageData.replied?.comment?.commentable?.forum) return `${origNam} replied to your ${comLink("forum post",obj.messageData.replied?.comment?.commentUrl)} on ${devTitl(obj.messageData.replied?.comment?.commentable?.forum?.subject??"?","https://www.deviantart.com/forum/"+obj.messageData.replied?.comment?.commentable?.forum?.forumPath+"/"+obj.messageData.replied?.comment?.commentable?.forum?.threadId)}.`;
									else return `${origNam} replied to your comment.`;
							case "nc.badge_given":
									return `${origNam}  gave you a ${devTitl(obj.messageData.badgeGiven?.badge?.title??"")} badge.`;
							case "nc.badge_levelled":
									return `${origNam} levelled up your ${devTitl(obj.messageData.badgeLevelled?.badge?.baseTitle??"")} badge to ${devTitl(obj.messageData.badgeLevelled?.badge?.title??"")}.`;
							case "nc.group_join_request_receipt":
									return `Your group membership in ${origNam} is currently on vote.`;
							case "nc.comment_mentions_deviation":
									return `${origNam} ${comLink("mentioned",obj.messageData.commentMentionsDeviation?.mentioner?.commentUrl)} your deviation ${devTitl(obj.messageData.commentMentionsDeviation?.mentioned?.title??"?",obj.messageData.commentMentionsDeviation?.mentioned?.url)}.`;
							case "nc.comment":
									return `${origNam} ${comLink("commented",obj.messageData.comment?.comment?.commentUrl)} on ${devTitl(obj.messageData.comment?.comment?.commentable?.deviation?.title??"your site",obj.messageData.comment?.comment?.commentable?.deviation?.url)}.`;
							case "nc.collect":
									return `${origNam} added your work ${devTitl(obj.messageData.collect?.deviation?.title??"?",obj.messageData.collect?.deviation?.url)} to their collection.`;
							case "nc.deviation_mentions_deviation":
									return `${origNam} ${comLink("mentioned",obj.messageData.deviationMentionsDeviation?.mentioner?.commentUrl)} your work ${devTitl(obj.messageData.deviationMentionsDeviation?.mentioned?.title??"?",obj.messageData.deviationMentionsDeviation?.mentioned?.url)} to their collection.`;
							case "nc.new_watcher":
									return `${origNam} is now watching you!`;
							case "nc.deviation_submission_offer_artist_receipt":
									return `${origNam} accepted your group submission ${devTitl(obj.messageData.correspondence?.bppModule?.groupDeviation?.deviation?.title??"",obj.messageData.correspondence?.bppModule?.groupDeviation?.deviation?.url)}`;
							case "nc.blog_submission_author_receipt":
									return `${origNam} posted a new blog${devTitl(obj.messageData.correspondence?.bppModule?.groupBlog?.deviation?.title??"?",obj.messageData.correspondence?.bppModule?.groupBlog?.deviation?.url)}!`;
							case "nc.radom_recommendation":
									return `Please welcome the new user ${origNam}!`;
							case "nc.group_created":
									return `Group ${origNam} created!`;
							case "nc.award_badge_given_on_deviation":
									return `${origNam} gave you a ${devTitl(obj.messageData.awardBadgeGivenOnDeviation?.badge?.title)??""} badge for your work ${devTitl(obj.messageData.awardBadgeGivenOnDeviation?.deviation?.title,obj.messageData.awardBadgeGivenOnDeviation?.deviation?.url)??""}.`;
							case "nc.award_badge_given_on_comment":
									return `${origNam} gave you a ${devTitl(obj.messageData.awardBadgeGivenOnComment?.badge?.title)??""} badge for your your ${comLink("comment",obj.messageData.awardBadgeGivenOnComment?.comment?.commentUrl)}!`;
							default:
									if(obj.originator.username){
											return `Action of ${origNam}  regarding ${obj.type}`;
									} else{
											return `Action of regarding ${obj.type}`;
									}
					}
			}catch(ex){
					console.log("dA_Sidebar3 unknown:",ex,obj.type,JSON.stringify(obj));
					return `Action of regarding ${obj.type}`;
			}
	}

	//update request timer
	function timer(){

			// makeRequest: requests {settings.quickCheck} pages or load from storage if last request was within {checkInterval} from another page
			pageCheckCounter=settings.quickCheck;
			makeRequest().then(ret=>{
					if(ret==null){ //invalid csrf or already checked.
							updateHTML(); //update UI
							return;
					}

					lastCheck=Date.now()/1e3;

					if(settings.dynLoad){//dynamic load: remove old notifications with timestamp newer than the oldest message in dynamic loading
							let minTS=ret.messages.reduce(function(a, b) {return (a.ts < b.ts) ? a.ts : b.ts},"9999-08-05T12:29:21.000Z"); //minimum timestamp
							messages=messages.filter(el=>el.ts<minTS);
					}else{ //without dynamic loading: discard old storage
							messages=[];
					}

					ret.messages.forEach(el=>{ //add new notifications to messages-array, identified by messageId
							messages.push({ //messages should not be in both arrays at this point. old present messages at dyn loading will be removed by filter previously
									id:el.messageId,
									ts:el.ts, //timestamp
									cat:assignCat(el), //assign category by notification type
									msg:convertMsgText(el), //generate notification text message
									unread:el.isNew //read/unread from deviantart. old/new terminology in script highlight
							});
					});
					messages=messages.sort((a,b)=>a.ts<b.ts); //sort notifications by timestamp

					//console.log(ret.messages);

					GM.setValue("messages",JSON.stringify(messages)); //update storage
					GM.setValue("lastCheck",lastCheck);

					updateHTML();//refresh UI
			}).catch(ret=>{console.log("dA_Sidebar3:","An error occured:",ret)});
	}

	function strip(html){
			let doc = new DOMParser().parseFromString(html, 'text/html');
			return doc.body.textContent || "";
	}
	//highlight or normalize sidebar, check for notifications being new
	function highlight(reset=false){ //reset = mark all as known

			//restore default
			div.classList.remove("dA_Sidebar3_newBar");
			document.querySelectorAll(".dA_Sidebar3_newEntr").forEach(el=>el.classList.remove("dA_Sidebar3_newEntr"));
			document.querySelectorAll(".dA_sidebar3_entr_hot").forEach(el=>el.classList.remove("dA_sidebar3_entr_hot"));

			if(reset){
					scrKnown=new Set(messages.map(el=>el.id));// all are known, remove unused message ids
					lastNotifCnt=0; //rest system notification counter
					GM.setValue("lastNotifCnt",lastNotifCnt); //update storage
					GM.setValue("messages",JSON.stringify(messages));
					GM.setValue("scrKnown",JSON.stringify([...scrKnown]));
					updateHTML();//update UI
					return;
			}

			let cntNew=0; //counter of new notifications in script

			messages.forEach(val=>{ //count new notification & highlight counter in sidebar
					if(settings.countRead && !val.unread)return; //if set, only highlight on unread messages
					if(scrKnown.has(val.id))return // old news in script storage
							++cntNew;
					document.querySelector("#dA_Sidebar3 span[title='"+val.cat+"']").classList.add("dA_Sidebar3_newEntr");
			});

			if(cntNew>0){ //highlight sidebar and show system notification
					div.classList.add("dA_Sidebar3_newBar")

					if(settings.showNotif){
							GM.getValue("lastNotifCnt",0).then(ret=>{ //show notification only if not shown already for this amount of new notifications
									let detailmsg="\n"+strip(cont.innerHTML)+"\n"+strip(messages[0].msg);

									// console.log(ret,cntNew,lastNotifCnt);
									if(ret<cntNew){
											GM.notification({ title: "dA_Sidebar3",text: cntNew+" new DeviantArt notifications"+detailmsg, url:"https://deviantart.com/notifications" });
									}
									lastNotifCnt=cntNew; //update counter for shown system notifications
									GM.setValue("lastNotifCnt",lastNotifCnt);
							});
					}
			}

	}

	//opens the setting dialog and shows present settings
	function showSettings(){
			setdiv.style.display="block"; //show form

			//settings loaded at pageload

			//load settings
			let form=document.forms.dA_Sidebar3_form;
			form.elements.checkInterval.value=settings.checkInterval;
			form.elements.checkInterval.removeAttribute("readonly");
			if(settings.checkInterval==0){
					form.elements.checkInterval.value=0;
					form.elements.checkInterval.setAttribute("readonly","");
					form.elements.checkIntervalNot.checked=true;
			}

			form.elements.quickCheck.value=settings.quickCheck;
			form.elements.quickCheck.removeAttribute("readonly");
			if(settings.quickCheck==0){
					form.elements.quickCheck.value=0;
					form.elements.quickCheck.setAttribute("readonly","");
					form.elements.quickCheckAll.checked=true;
			}
			form.elements.countNew.checked=settings.countRead;
			form.elements.checkOnPageLoad.checked=settings.checkOnPageLoad;
			form.elements.hideBar.checked=settings.hideBar;
			form.elements.barPosition[settings.barPosition].checked=true;
			form.elements.theme[settings.theme].checked=true;
			form.elements.pulseNew.checked=settings.pulseNew;
			form.elements.dynLoad.checked=settings.dynLoad;
			form.elements.showNotif.checked=settings.showNotif;
	}

	//close setting dialog and save chosen settings
	function saveSettings(){
			setdiv.style.display="none"; //close dialog

			//save chosen settings
			let form=document.forms.dA_Sidebar3_form
			settings.checkInterval = parseInt(form.elements.checkInterval.value);
			if(form.elements.checkIntervalNot.checked)settings.checkInterval=0;
			else if(settings.checkInterval<10)settings.checkInterval=10;

			settings.quickCheck = form.elements.quickCheck.value;
			if(form.elements.quickCheckAll.checked)settings.quickCheck=0;

			settings.countRead = form.elements.countNew.checked;
			settings.checkOnPageLoad = form.elements.checkOnPageLoad.checked;
			settings.hideBar = form.elements.hideBar.checked;
			settings.pulseNew = form.elements.pulseNew.checked;
			settings.dynLoad= form.elements.dynLoad.checked;
			settings.showNotif = form.elements.showNotif.checked;

			document.forms.dA_Sidebar3_form.elements.barPosition.forEach((el,ind)=>{if(el.checked)settings.barPosition=ind});
			document.forms.dA_Sidebar3_form.elements.theme.forEach((el,ind)=>{if(el.checked)settings.theme=ind});


			//store settings in storage
			GM.setValue("settings",JSON.stringify(settings));

			updateHTML();
			insertStyle(); //update view
	}

	//helper: parse as int, even NaN, and return at least minimum
	function cropmin(val,min){
			let intval=parseInt(val);
			if(isNaN(intval)||intval<min)return min;
			return intval;
	}

	function colorTime(){ //assign CSS classes to notification entries depending on their timestamp
			let n=new Date();
			[...document.querySelectorAll("#dA_Sidebar3_popup span.dA_sidebar3_entr_tim")].forEach(el=>{
					let diff=(n-(new Date(el.getAttribute("ts"))))/60e3; //time difference in [minutes]

					if(diff<10)el.classList.add("dA_sb2_10min");
					else if(diff<60)el.classList.add("dA_sb2_1h");
					else if(diff<300)el.classList.add("dA_sb2_5h");
					else if(diff<1440)el.classList.add("dA_sb2_1d");
					else if(diff<7200)el.classList.add("dA_sb2_5d");
			});

	}

	//inject sidebar HTML and event handlers. Calls to insert setting dialog and insert style.
	function injectHTML(){
			div =document.createElement("div"); //main sidebar div
			div.id="dA_Sidebar3";

			cont =document.createElement("div"); //main content div to change via innerHTML=""
			cont.innerHTML=`Loading...`; //initial content while loading storage
			cont.addEventListener("click",()=>{ //click removes highlight
					highlight(true);
			},false)
			div.append(cont);

			let setBut =document.createElement("button"); //setting button
			setBut.innerHTML=imgGear;
			setBut.id="dA_Sidebar3_setButton";
			setBut.addEventListener("click",showSettings,false);
			div.append(setBut);

			let popupdiv=document.createElement("div"); //popup for notification texts
			popupdiv.id="dA_Sidebar3_popup";
			popupdiv.innerHTML="nothing...";
			div.append(popupdiv);
			document.body.append(div);

			//event handlers
			div.addEventListener("mouseleave",()=>{ //hide popup when leaving sidebar
					let els=document.getElementById("dA_Sidebar3_popup");
					els.innerHTML="";
			},false);
			popupdiv.addEventListener("click",(ev)=>{ //click removes highlight
					if(ev.target.tagName!="A")highlight(true);
			},false)
			div.addEventListener("mouseover",(ev)=>{ //show popup with notification texts when hovering over category
					let els=document.getElementById("dA_Sidebar3_popup");
					if(ev.target.title && CatMsgs.has(ev.target.title)){ //load only pre-generated text
							els.innerHTML=CatMsgs.get(ev.target.title); //updated in updateHTML
							els.style.height="auto";
							els.style.bottom=div.clientHeight+"px";
							colorTime(); //color according to timestamp
					}
			},false);

			insertSettingform(); //add setting form
			insertStyle(); //add CSS style
	}

	//insert setting form HTML and event handlers
	function insertSettingform(){

			//HTML for setting form. Initially unset and hidden. Present settings are loaded with showSettings()
			let settmp=`
		<form id='dA_Sidebar3_form'>
		<label for="checkInterval" title='min. 10 s'>
			<span>Update interval [s]</span>
			<input type="text" id="checkInterval" placeholder="min. 10 s" style='width:20%;'/>
								<label for="checkIntervalNot" style='width:24%;'>
				<input type="checkbox" id="checkIntervalNot" placeholder="0 = all"/>
									<span style='margin:0!important;'>Manual</span>
								</label>
		</label>
		<label for="quickCheck" title='Checks the latest 20 Notification per page.'>
			<span>Requested notification pages</span>
			<input type="text" id="quickCheck" placeholder="# of pages" style='width:20%;'/>
								<label for="quickCheckAll" style='width:24%;'>
				<input type="checkbox" id="quickCheckAll" placeholder="0 = all"/>
									<span style='margin:0!important;'>All</span>
								</label>
		</label>
		<label for="dynLoad" title='Only requests notification pages until a known message-ID is found'>
			<span>Dynamic request limits</span>
			<input type="checkbox" id="dynLoad"/>
		</label>
		<label for="countNew" title='0 = all'>
			<span>Show only unread notifications</span>
			<input type="checkbox" id="countNew"/>
		</label>
		<label for="checkOnPageLoad" title='Requests an update whenever a new page is visited'>
			<span>Update on pageload</span>
			<input type="checkbox" id="checkOnPageLoad"/>
		</label>
		<label for="hideBar" title='Hides notification bar except 2px. Hover there to show the bar again. '>
			<span>Hide sidebar</span>
			<input type="checkbox" id="hideBar"/>
		</label>
		<label for="pulseNew" title='Plays a pulse animation when new notifications appear. Click the bar to mark them as read.'>
			<span>Pulse animation on new notification</span>
			<input type="checkbox" id="pulseNew"/>
		</label>
		<label for="showNotif" title='Shows a system notification for new messages, if allowed in your browser settings.'>
				<span>Show system notifications</span>
				<input type="checkbox" id="showNotif"/>
		</label>
		<label title='Alignment of sidebar at the bottom of the window.'>
			<span>SideBar position</span>
			<label for='barPositionL'><input type="radio" id="barPositionL" name='barPosition'/><span>Left</span></label>
			<label for='barPositionC'><input type="radio" id="barPositionC" name='barPosition'/><span>Center</span></label>
			<label for='barPositionR'><input type="radio" id="barPositionR" name='barPosition'/><span>Right</span></label>
		</label>
		<label title='Choose a theme for the sidebar.'>
			<span style='width: 120px;'>Theme</span>
			<label for='themeGreen'><input type="radio" id="themeGreen" name='theme'/><span>Green</span></label>
			<label for='themeLight'><input type="radio" id="themeLight" name='theme'/><span>Dark</span></label>
			<label for='themeDark'><input type="radio" id="themeDark" name='theme'/><span>Light</span></label>
			<label for='themeAuto'><input type="radio" id="themeAuto" name='theme'/><span>Auto (dA)</span></label>
		</label>
		</form>
		<button type="button" id='dA_Sidebar3_saveset'>Save</button>
		<button type="button" id='dA_Sidebar3_cancelset'>Cancel</button>
		`;

			setdiv=document.createElement("div"); //setting form
			setdiv.innerHTML=settmp;
			setdiv.id="dA_Sidebar3_settings";
			document.body.append(setdiv);

			//event handlers
			document.getElementById("checkInterval").addEventListener("focusout",(ev)=>{ev.target.value=cropmin(ev.target.value,10);},false);//minValue checkInterval 10 [s]
			document.getElementById("quickCheck").addEventListener("focusout",(ev)=>{ev.target.value=cropmin(ev.target.value,0);},false);//minValue quickCheck 0 pages

			//save/cancel buttons
			document.getElementById("dA_Sidebar3_saveset").addEventListener("click",saveSettings,false);
			document.getElementById("dA_Sidebar3_cancelset").addEventListener("click",()=>{setdiv.style.display="none";},false);

			//checkmarks Check all pages. enable/disable text input
			document.getElementById("quickCheckAll").addEventListener("click",(ev)=>{
					if(ev.target.checked) document.getElementById("quickCheck").setAttribute("readonly","");
					else {document.getElementById("quickCheck").removeAttribute("readonly");document.getElementById("quickCheck").value=2;}
			},false);
			//checkmarks only manual. enable/disable text input
			document.getElementById("checkIntervalNot").addEventListener("click",(ev)=>{
					if(ev.target.checked) document.getElementById("checkInterval").setAttribute("readonly","");
					else{ document.getElementById("checkInterval").removeAttribute("readonly");document.getElementById("checkInterval").value=60;}
			},false);
	}

	//CSS style, add as <style> in <head> or <body> if website is headless
	function insertStyle(){
			let styleText=`
				/*default style: Greentheme*/
				#dA_Sidebar3 {user-select:none;position: fixed;bottom: 0;min-width:300px;width:auto;max-width: 400px;height: auto;border: 1px solid black;
					${settings.barPosition==1?"left:50%;":settings.barPosition==2?"right:0;":"left: 0;"}
					border-top-right-radius: 5px;font-family: Georgia;font-size: 12pt;line-height: 16pt;color: black;
					background: linear-gradient(#cbf9b9,#7fc458);padding: 3px;padding-right:20px;z-index:7777777;
					box-sizing: content-box;${settings.hideBar?"transform:translateY(100%) translateY(-5px)"+(settings.barPosition==1?" translateX(-50%);":";"):settings.barPosition==1?"transform:translateX(-50%);":""}}
				#dA_Sidebar3:hover{${settings.barPosition==1?"transform:translateX(-50%);":"transform:none;"}}
				#dA_Sidebar3.dA_Sidebar3_newBar{border:1px solid red;${settings.pulseNew?"animation: dA_Sidebar3_pulse 1s ease-out infinite":""};}
				#dA_Sidebar3 span.dA_Sidebar3_newEntr{color:red;}
				#dA_Sidebar3 *{margin:0;padding:0;}
				#dA_Sidebar3 img {vertical-align: middle;height: 1.4em; display: inline-block;}
				#dA_Sidebar3 a {cursor:pointer;color:black;text-decoration:underline;}
				#dA_Sidebar3>div>span {margin: 0 5px;cursor:help;white-space: nowrap;}
				#dA_Sidebar3 button{position: absolute;line-height: 16pt!important;background: none;border: none;cursor: pointer;}
				#dA_Sidebar3 button:hover{filter: invert(10%) sepia(100%) saturate(5000%) hue-rotate(359deg) brightness(150%);}
				#dA_Sidebar3_setButton{top: 1px;right: 1px;width:20px;height:20px;}
				#dA_Sidebar3_closeButton{top: -4px;right: 20px;width: 12px;height: 20px;font-size: 17px;}
				#dA_Sidebar3_setButton svg{vertical-align:top;}
				@keyframes dA_Sidebar3_pulse {
						0%   { box-shadow: 0 0 0 red; }
						50%  { box-shadow: 0 0 17px red; }
						100% { box-shadow: 0 0 0 red; }
				}
				#dA_Sidebar3_settings {display:none;user-select:none;width:450px;position:fixed;z-index:777777;border-radius:15px;border:1px solid black;box-shadow: 2px 2px 2px black;left:50%;top:50%;transform:translate(-50%,-50%);background-color:#90ca90;}
				#dA_Sidebar3_settings * {vertical-align:middle;}
							#dA_Sidebar3_settings input[readonly]{background-color:#ccc;}
				#dA_Sidebar3_settings, #dA_Sidebar3_settings span, #dA_Sidebar3_settings div, #dA_Sidebar3_settings label{font: 12pt Georgia normal normal normal!important;line-height: 16pt!important;color: black!important;padding:0!important;margin:0!important;}
				#dA_Sidebar3_settings form > label > span {width: 210px;  display: inline-block!important;}
				#dA_Sidebar3_settings label{padding: 5px 0!important;cursor:help!important;display:inline-block;}
				#dA_Sidebar3_settings form{display:grid;padding: 10px!important;margin-bottom:40px;}
				#dA_Sidebar3_settings input[type="text"] {background:white;box-shadow: 0px 0px 1px 1px #84a884 inset; appearance: textfield;   opacity: 1;box-sizing: content-box;  width: 180px;  height:20px; font: 12pt georgia normal normal normal !important; padding: 2px; margin: 0;border:1px solid grey;  border-radius: 5px;}
					#dA_Sidebar3_settings input[type='checkbox']{cursor:pointer;  width: 40%;  height: 20px;margin:0; appearance: checkbox;  opacity: 1;}
					#dA_Sidebar3_settings input[type='radio']{cursor:pointer;  width: 15px;  height: 15px;margin:0;vertical-align:middle;  appearance: radio;  opacity: 1;}
					#dA_Sidebar3_settings label span{margin: 0 5px!important;  opacity: 1;}
				#dA_Sidebar3_settings form>label { border-bottom: 1px dashed gray;}
				#dA_Sidebar3_settings button{font:12pt Georgia normal normal normal !important;position:absolute;bottom:10px;transform:translateX(-50%);padding: 5px 20px;box-shadow: 1px 1px;cursor: pointer;  border-radius: 5px;color: black;}
				#dA_Sidebar3_saveset {left:33%;background: linear-gradient(#c7e8a5, #99d01f);}
				#dA_Sidebar3_settings button:hover{  filter: brightness(110%);}
				#dA_Sidebar3_settings button:active{  filter: brightness(90%);box-shadow: 1px 1px inset;}
				#dA_Sidebar3_cancelset {left:66%;background:linear-gradient(#ffe3e3, #fd9c91)}
				#dA_Sidebar3_popup {position:absolute;bottom:30px;height:0;width:100%;left:0;background:linear-gradient(#cbf9b9,#7fc458);overflow:clip;overflow-y:auto;max-height:300px;}
				#dA_Sidebar3_popup>div {margin: 0px;  padding: 5px;  border-bottom: 1px dashed black;position:relative;}
				#dA_Sidebar3_popup .dA_sb_title{color:rgb(234, 52, 47);}
				#dA_Sidebar3_popup .dA_sb_user{color:blue;}
				#dA_Sidebar3_popup .dA_sb_com{color:darkgreen;}
				#dA_Sidebar3_popup .dA_sidebar3_entr_tim{position:absolute;top:-7px;right:0;font-size:7pt;color:black;}
				#dA_Sidebar3_popup .dA_sidebar3_entr_hot{background-color:#ff000044}
				#dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_10min{color:#f00;}
				#dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_1h{color:#d00;}
				#dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_5h{color:#a00;}
				#dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_1d{color:#900;}
				#dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_5d{color:#700;}

				/* dA style dark*/
				#dA_Sidebar3.darktheme {background: linear-gradient(#000,#222);border-radius:1px;color:white;}
				#dA_Sidebar3.darktheme a{color:white;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_setButton{filter:invert();}
				#dA_Sidebar3.darktheme #dA_Sidebar3_setButton:hover{filter: invert(10%) sepia(100%) saturate(5000%) hue-rotate(359deg) brightness(150%);}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup {background:linear-gradient(#000,#111);}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup>div {border-color: white;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sb_title{color:#f77;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sb_user{color:#77f;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sb_com{color:#7f7;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim{color:#fff;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sidebar3_entr_hot{background-color:#600}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_10min{color:#f00;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_1h{color:#f33;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_5h{color:#f77;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_1d{color:#faa;}
				#dA_Sidebar3.darktheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_5d{color:#fcc;}
				#dA_Sidebar3_settings.darktheme {border-radius:1px;border: 1px solid #777;box-shadow: none;background-color:#222;}
				#dA_Sidebar3_settings.darktheme div, #dA_Sidebar3_settings.darktheme label, #dA_Sidebar3_settings.darktheme span {color:#ddd!important;}
				#dA_Sidebar3_settings.darktheme #dA_Sidebar3_saveset{background:linear-gradient(to right, #01f2fc,#01fe93);}
				#dA_Sidebar3_settings.darktheme #dA_Sidebar3_cancelset{background:#f53948;}
				#dA_Sidebar3_settings.darktheme button{border-radius:0;border:none;}


				/* dA style light*/
				#dA_Sidebar3.lighttheme {background: linear-gradient(#fff,#eee);border-radius:1px;color:#000;}
				#dA_Sidebar3.lighttheme a{color:#222;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup {background:linear-gradient(#fff,#eee);}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup>div {border-color: black;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sb_title{color:#a00;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sb_user{color:#00a;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sb_com{color:#0a0;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim{color:#000;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sidebar3_entr_hot{background-color:#fcc}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_10min{color:#f00;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_1h{color:#d00;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_5h{color:#a00;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_1d{color:#900;}
				#dA_Sidebar3.lighttheme #dA_Sidebar3_popup .dA_sidebar3_entr_tim.dA_sb2_5d{color:#700;}
				#dA_Sidebar3_settings.lighttheme {border-radius:1px;border: 1px solid #aaa;box-shadow: none;background-color:#fff;}
				#dA_Sidebar3_settings.lighttheme div, #dA_Sidebar3_settings.lighttheme  label, #dA_Sidebar3_settings.lighttheme  span {color:#333!important;}
				#dA_Sidebar3_settings.lighttheme #dA_Sidebar3_saveset{background:linear-gradient(to right, #01f2fc,#01fe93);}
				#dA_Sidebar3_settings.lighttheme #dA_Sidebar3_cancelset{background:#f53948;}
				#dA_Sidebar3_settings.lighttheme button{border-radius:0;border:none;}
				`;


			if(style==null){
					style=document.createElement('style');
					style.id='dA_Sidebar3_style';
					let head=document.getElementsByTagName('head')[0];
					if(!head)document.body.appendChild(style);
					else document.head.appendChild(style);
			}

			style.innerHTML=styleText;
	}

	//update UI and generate notification text messages for hover
	function updateHTML(){

			let curTheme=themeNames[settings.theme??0];
			if(curTheme=="auto")curTheme=autoTheme;
			div.className=curTheme;
			setdiv.className=curTheme;

			if(token=="expired"){ //csrf token invalid or initial call
					cont.innerHTML="CSRF Expired! Refresh authentification by visiting <a href='https://deviantart.com' target='_blank'>deviantart.com</a>.";
			}else{
					let cats=new Map(); //counter for new messages per category {cat:#new}
					CatMsgs=new Map(); // popup text messages for each category {cat:HTML-list}
					let sum=0; //total amount of notifications

					messages.forEach((val)=>{ //count notifications for each category in {cats}, total in {sum} and generate popup text in {CatMsgs}
							if(settings.countRead && !val.unread)return; //ignore not new if setting is set
							cats.set(val.cat,(cats.get(val.cat)??0)+1); //increment Map element for category
							sum+=1;
							let tim=/(.*?)T(.*?)-.*/.exec(val.ts) //parse timestamp. It's UTC-7.
							let dtim=new Date(`${tim[1]} ${tim[2]} UTC-7`)

							CatMsgs.set(val.cat, //concat all notificiation texts in {val.msg} for each category and add timestamp display <span>
													`${CatMsgs.get(val.cat)??""}
						<div ${!scrKnown.has(val.id)?"class='dA_sidebar3_entr_hot'":""}>${val.msg}
						<span class='dA_sidebar3_entr_tim' ts='${val.ts}'>${dtim.toLocaleString()}
						</span></div>`
												 );
					});
					//display <span> with title, text and notification count for each category in iconMap. returns HTML code
					let mapstr= [...iconMap].reduce((acc,[key,val])=>{
							return `${acc}<span title=${key}>${val??key} ${cats.get(key)??0}</span>`
					},"")
					cont.innerHTML=`New (<a target="_blank" href="https://www.deviantart.com/notifications">${sum}</a>): ${mapstr}`; //content of sidebar. categories preceeded with New(#) with total sum and link to /notifications

					highlight();//check if there are new notifications and highlight
			}
	}

	//initial entry: load storage
	Promise.all([
			GM.getValue("settings",JSON.stringify(settings)),
			GM.getValue("messages",JSON.stringify(messages)),
			GM.getValue("lastCheck",lastCheck),
			GM.getValue("scrKnown","[]"),
			GM.getValue("autoTheme","")
	]).then(res=>{ //only proceed if all is loaded
			let tmp=JSON.parse(res[0]); //settings
			Object.entries(tmp).forEach(([key,val])=>{settings[key]=val;}); //load old settings, keep unset ones

			messages=JSON.parse(res[1]); //internal notification storage

			lastCheck=res[2];//timestamp of last update request
			if(settings.checkOnPageLoad)lastCheck=0; //reset timestemp to load immediately

			scrKnown=new Set(JSON.parse(res[3])); //list of old ids where no notification/highlight is sent for

			autoTheme=res[4];

			init(); //entry function: insert HTML, Css and start timer.
	});

})();