// ==UserScript== 
// @name          Unsolved tab on PSE
// @version	  0.1
// @author	  Lord of dark (http://stackexchange.com/users/5950528/lord-of-dark)
// @description   Add "Unsolved" tab on Puzzling Stack Exchange
// @include       http://puzzling.stackexchange.com/*
// @require 	  http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant         GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/49190
// @downloadURL https://update.greasyfork.org/scripts/20599/Unsolved%20tab%20on%20PSE.user.js
// @updateURL https://update.greasyfork.org/scripts/20599/Unsolved%20tab%20on%20PSE.meta.js
// ==/UserScript==


var unanswered = document.querySelectorAll('[id="nav-unanswered"]')[0];
var tabs = unanswered.parentNode.parentNode;
var unsolved = unanswered.cloneNode(true);
unsolved.id="nav-unsolved";
unsolved.innerHTML="Unsolved";
unsolved.setAttribute("href","/unsolved");
var li_unsolved = document.createElement('li');
li_unsolved.appendChild(unsolved);
tabs.appendChild(li_unsolved);

var unsolved_url="puzzling.stackexchange.com/unsolved"
if(content.document.location.href.indexOf(unsolved_url) > -1){
	// Update page title :
	document.title = "Unsolved Questions - Puzzling Stack Exchange";
	
	// Add focus on unsolved tab, remove from other tabs
	tabs_youarehere = tabs.querySelectorAll('[class="youarehere"]')
	for (var i = 0; i < tabs_youarehere.length; i++) { tabs_youarehere[i].removeAttribute("class");};
	unsolved.parentNode.setAttribute("class","youarehere");
	
	//remove every thing in the blank part :
	var center_html = document.getElementById("content");
	center_html.innerHTML="";
	
	// Check the type of reasearch type :
	var researchType = findResearchType();
	
	// Check the page
	var page= findPage();
	
	// Call the unanswered and copy it
	GM_xmlhttpRequest({
  	method: "GET",
 	  url: "http://puzzling.stackexchange.com/unanswered",
	  onload: function(response) {
		    // Add all the content from UNANSWERED
			var tempDiv = document.createElement('html');
			tempDiv.innerHTML = response.responseText;
			var all_div = tempDiv.getElementsByTagName("div");
			for (var i=0;i<all_div.length;i++){
				if (all_div[i].getAttribute('id')=="content"){
					var content = all_div[i].innerHTML;
					center_html.innerHTML=content;
				}
			}		
			 updateBodyContext(researchType);
			 //http://puzzling.stackexchange.com/search?page=1&q=hasaccepted%3Afalse+closed%3Afalse+duplicate%3Afalse+locked%3Afalse+hasnotice%3Afalse+answers%3A0
			 var urlSearch;
			 switch(researchType) {
				case "noanswers":
					urlSearch="http://puzzling.stackexchange.com/search?page="+page+"&q=hasaccepted%3Afalse+closed%3Afalse+duplicate%3Afalse+locked%3Afalse+hasnotice%3Afalse+answers%3A0"
				break;
				default:
					urlSearch="http://puzzling.stackexchange.com/search?page="+page+"&tab="+researchType+"&q=hasaccepted%3afalse%20closed%3afalse%20duplicate%3afalse%20locked%3afalse"
			} 
					
				
			GM_xmlhttpRequest({
				method: "GET",
				url: urlSearch,
				
				onload: function(response) {

				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = response.responseText.replace(/<script(.|\s)*?\/script>/g, '');
				
				var nb_questions = tempDiv.getElementsByTagName("h2")[0].firstChild;
				document.getElementsByClassName("summarycount al")[0].innerHTML=nb_questions.nodeValue
				
				var questionsText = tempDiv.getElementsByClassName("search-results js-search-results")[0];
				var questions_area = document.getElementById("questions");
				questions_area.innerHTML= questionsText.innerHTML

				document.getElementsByClassName("mod-flair").remove();
				
				var all_answer_links = document.querySelectorAll('[data-searchsession]');
				for (var i = 0; i < all_answer_links.length; i++) {
				all_answer_links[i].removeAttribute("data-searchsession");
				all_answer_links[i].setAttribute("class","question-hyperlink");
				all_answer_links[i].innerHTML= all_answer_links[i].innerHTML.replace("Q: ","");
				var wrapper = document.createElement('h3');
				all_answer_links[i].parentNode.appendChild(wrapper);
				wrapper.appendChild(all_answer_links[i])
				}

				var alluserid=""
				
				var all_from = document.querySelectorAll('[class="started fr"]');
				for (var i = 0; i < all_from.length; i++) {
					var relative_time = all_from[i].getElementsByTagName('span')[0];
					var a_childs= all_from[i].getElementsByTagName('a');
					var user;//= '<a href="/users/0/user">user</a>'
					if (a_childs.length>0){
						user= a_childs[0];
					} else { // if there is no <a> then the user has been deleted
						user = document.createElement('a');
						user.setAttribute("href","/users/0/user");
						user.innerHTML='deleted user'
					}
					all_from[i].innerHTML= all_from[i].innerHTML.replace("asked","");
					all_from[i].innerHTML= all_from[i].innerHTML.replace("by","");
					var userName = user.cloneNode(true);
					var userid = userName.getAttribute("href").replace("/users/","").replace(/\/.*/gi,"");
					alluserid=alluserid+userid+";";
					user.innerHTML='<div class="gravatar-wrapper-32"><img src="http://i.stack.imgur.com/Fe45R.png" alt="" height="32" width="32"></div>';
					var gravatarDiv = document.createElement('div');
					gravatarDiv.setAttribute("class","user-gravatar32");
					gravatarDiv.appendChild(user);
					all_from[i].innerHTML="";
					all_from[i].appendChild(relative_time);
					all_from[i].appendChild(gravatarDiv);
					
					var detailsDiv = document.createElement('div');
					detailsDiv.setAttribute("class","user-details");
					all_from[i].appendChild(detailsDiv);
					detailsDiv.appendChild(userName);
				}
				alluserid = alluserid.replace(/;$/,"");

				
				var all_dates = document.querySelectorAll('[class="relativetime"]');
				for (var i = 0; i < all_dates.length; i++) {
					var infoDiv = document.createElement('div');
					infoDiv.setAttribute("class","user-info");
					all_dates[i].parentNode.appendChild(infoDiv);
					var timeDiv = document.createElement('div');
					timeDiv.innerHTML="asked ";
					timeDiv.setAttribute("class","user-action-time");
					timeDiv.appendChild(all_dates[i]);
					infoDiv.appendChild(timeDiv);
					infoDiv.appendChild(infoDiv.parentNode.getElementsByClassName("user-gravatar32")[0]);
					infoDiv.appendChild(infoDiv.parentNode.getElementsByClassName("user-details")[0]);

					//add flair
					var flairDiv = document.createElement('div');
					flairDiv.setAttribute("class","-flair");
					infoDiv.getElementsByClassName("user-details")[0].appendChild(flairDiv);
					flairDiv.innerHTML='<span class="reputation-score" title="reputation score " dir="ltr">???</span>';
				}

				createPageNav(page,researchType)
				updateUserProfil(alluserid);

				
			  }
			});
			
	  }
	});
	
	// Actions before requesting the questions, applied to context.
	function updateBodyContext(researchType) {
		// update the title
		var title_body = document.getElementById("h-unanswered-questions");
		title_body.innerHTML="Unsolved Questions";
		
		// setcontent to empty
		var questionsDiv = document.getElementById("questions");
		questionsDiv.innerHTML="";
		
		// set question count to 0$
		var counter = document.getElementsByClassName('summarycount al')[0];
		counter.innerHTML="?";
		counter.parentNode.getElementsByTagName("span")[0].innerHTML='questions with no accepted answers';

		// remove page navigation :
		document.getElementsByClassName('pager fl').remove()
		
		// Change tab links
		var tabs_link = document.getElementById("tabs");
		var links = tabs_link.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++) {
			links[i].setAttribute("href",links[i].getAttribute("href").replace("unanswered","unsolved"));
			if (links[i].getAttribute("href").indexOf(researchType)>-1){
				links[i].setAttribute("class","youarehere");
			} else {
				links[i].removeAttribute("class");
			}
			if (links[i].getAttribute("href")=="/unsolved/tagged?tab=mytags"){
				links[i].innerHTML="";
			}
		}
			
			
	}
	
	function findPage() {
		var ind1=document.location.href.indexOf("page=");
		if (ind1 <1){
			return "1"
		}
		else{
			var ind2=document.location.href.indexOf("&",ind1+1);
			if (ind2>4){
				return document.location.href.substring(ind1+5,ind2);
			} else {
				return document.location.href.substring(ind1+5);
			}
		}
		return "1"
	}
	
	function findResearchType() {
		var ind1=document.location.href.indexOf("tab=");
		if (ind1 <1){
			return "newest"
		}
		else{
			var ind2=document.location.href.indexOf("&",ind1+1);
			if (ind2>4){
				return document.location.href.substring(ind1+4,ind2);
			} else {
				return document.location.href.substring(ind1+4);
			}
		}
		return "newest"
	}
	
	// Define HTTP client to get the JSON
	function httpGetAsync(theUrl, callback)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				callback(xmlHttp.responseText);
		}
		xmlHttp.open("GET", theUrl, true); // true for asynchronous 
		xmlHttp.send(null);
	}
	
	
	// This function update the profil (gravatar / reputation / badges)
	// Use API to get this data -> API without login limited at 300 request/day
	function updateUserProfil(alluserid){
		//var jsonUrl ='https://api.stackexchange.com/2.2/users/'+alluserid+'?page=1&pagesize=50&order=desc&sort=reputation&site=puzzling&filter=!LnNkvq0X3NNP1zDzft3_WF';
		var jsonUrl ='https://api.stackexchange.com/2.2/users/'+alluserid+'?page=1&pagesize=50&order=desc&sort=reputation&site=puzzling&filter=!LnO)*RBcCzpAXUnHZRkHoo'
		httpGetAsync(jsonUrl, function(response) {
			var userJson = JSON.parse(response);
			var items = userJson.items;
			function jsonHasId(id){
				for(var i = 0; i < items.length; i++){
						if (items[i].user_id==id){
							return true;
						}
				}
				return false;
			}
			
			function getImgUrl(id){
				for(var i = 0; i < items.length; i++){
						if (items[i].user_id==id){
							return items[i].profile_image;
						}
				}
				return "";
			};
			
			function getRepBadges(id){
				for(var i = 0; i < items.length; i++){
						if (items[i].user_id==id){
						return [items[i].reputation,items[i].badge_counts.gold,items[i].badge_counts.silver,items[i].badge_counts.bronze,items[i].user_type=="moderator"];
						}
				}
				return [1,0,0,0];
			};
			
			// Loop on the users to update their profil pictures
			var all_gravatars = document.querySelectorAll('[class="user-gravatar32"]');
			for (var i = 0; i < all_gravatars.length; i++) {
				var userName=all_gravatars[i].getElementsByTagName('a')[0].getAttribute("href").replace("/users/","").replace(/\/.*/gi,"");
				if(jsonHasId(userName)){
					all_gravatars[i].getElementsByTagName('img')[0].setAttribute("src",getImgUrl(userName));
					var flair=all_gravatars[i].nextSibling.lastChild;
					var repBadges =  getRepBadges(userName);
					flair.innerHTML='<span class="reputation-score" title="reputation score " dir="ltr">'+repBadges[0]+'</span>';
					if (repBadges[1]>0) {
						flair.innerHTML+='<span title="'+repBadges[1]+' gold badges"><span class="badge1"></span><span class="badgecount">'+repBadges[1]+'</span></span>';
					}
					if (repBadges[2]>0) {
						flair.innerHTML+='<span title="'+repBadges[2]+' silver badges"><span class="badge2"></span><span class="badgecount">'+repBadges[2]+'</span></span>';
					}
					flair.innerHTML+='<span title="'+repBadges[3]+' bronze badges"><span class="badge3"></span><span class="badgecount">'+repBadges[3]+'</span></span>';
					// Add moderator Diamonds
					if (repBadges[4]){
						var mod = document.createElement('span');
						mod.setAttribute('class','mod-flair');
						mod.setAttribute('title',"moderator");
						mod.innerHTML="♦";
						flair.parentNode.insertBefore(mod,flair);
					}
				}
			}
		});
	}
	
	// Create the footer to navigate in other pages
	function createPageNav(page,researchType) {
		var maxPages = Math.ceil(document.getElementsByClassName('summarycount al')[0].innerHTML /50);
		var pagerfl = document.createElement('div');
		pagerfl.setAttribute('class','pager fl');
		pagerfl.innerHTML="";
		if (page > 1) { // add prev button
			pagerfl.appendChild(addPage(page-1, researchType, "prev"));
		}
		if (page > 3) {
			pagerfl.appendChild(addPage(1, researchType, "1"));
		}
		if (page > 4) {
			pagerfl.innerHTML+='<span class="page-numbers dots">…</span>';
		}
		if (page > 2) {
			pagerfl.appendChild(addPage(page-2, researchType, page-2));
		}
		if (page > 1) {
			pagerfl.appendChild(addPage(page-1, researchType, page-1));
		}
		pagerfl.innerHTML+='<span class="page-numbers current">'+page+'</span>' // add current page number

		if (page < maxPages){
			pagerfl.appendChild(addPage(page-(-1), researchType, page-(-1)));
		}
		if (page < maxPages-1){
			pagerfl.appendChild(addPage(page-(-2), researchType, page-(-2)));
		}
		if (page < maxPages-3){
			pagerfl.innerHTML+='<span class="page-numbers dots">…</span>';
		}
		if (page < maxPages-2){
			pagerfl.appendChild(addPage(maxPages, researchType, maxPages));
		}

		if (page < maxPages){
			pagerfl.appendChild(addPage(page+1, researchType, "next"));
		}
		// add next button
		var pageplus1 = page+1
		
		document.getElementById('mainbar').appendChild(pagerfl);
	}
	
	// function to create a page number span
	function addPage(page, researchType, name){
		var a_page= document.createElement('a');
		a_page.setAttribute("href","/unsolved?page="+page+"&tab="+researchType);
		a_page.setAttribute("title","go to page "+page);
		var span_page= document.createElement('span');
		span_page.setAttribute("class","page-numbers "+page);
		span_page.innerHTML=name;
		a_page.appendChild(span_page);
		a_page.innerHTML+=" ";
		return a_page;
	}

	// Remove node list
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    		for(var i = this.length - 1; i >= 0; i--) {
        	if(this[i] && this[i].parentElement) {
          		this[i].parentElement.removeChild(this[i]);
        	}
    }
}
	
}
