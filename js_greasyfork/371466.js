// ==UserScript==
// @name         CG-FULL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://crowdology.com/*
// @match        http://qps.cint.com/survey/question/0
// @match        https://crowdology.com/so-survey/*/
// @match        https://crowdology.com/*/so-survey/*/
// @match        https://crowdology.com*so-survey/*
// @match        https://router.cint.com/CandidateRespondent/*/Matcher
// @match        https://s.cint.com/Survey/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371466/CG-FULL.user.js
// @updateURL https://update.greasyfork.org/scripts/371466/CG-FULL.meta.js
// ==/UserScript==
console.log("I'm here!");
let url = location.href;
switch(true){
	case wildcard(url,['https://s.cint.com/Survey/Complete*','https://crowdology.com*so-survey/*','https://crowdology.com*end-page-*']):
		goToDashboard(1000);
	break;
	case wildcard(url, 'http://qps.cint.com/survey/question/0*'):
		$('a[href="/survey/abort"]')[0].click();
	break;
	case wildcard(url, 'https://crowdology.com*dashboard*'):
		var sr = Array.from(document.querySelectorAll('h6')).filter(function(e){ return e.innerText.indexOf("Sorry, there are no surveys for you at the moment") !== -1;}).length;
	    if(sr){
	        var a = Array.from(document.querySelectorAll('a')).filter(function(e){ return e.innerText.indexOf("Find a Survey") !== -1;});
	        if(a.length){
	            setTimeout((function(ele){
	                ele.click();
	            }).bind(null,a[0]),1000);
	        }
	    }
	break;
	case wildcard(url,'https://router.cint.com/CandidateRespondent*Matcher'):
		setTimeout(function(){
        	SkipQuestion.click();
    	},2000);
	break;

}

function wildcard(str, rule) {
	if(Array.isArray(rule)) return rule.filter( (e)=> wildcard(str,e) ).length>0;
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

function goToDashboard(timeout){
	setTimeout(function(){
        location.href = "https://crowdology.com/dashboard/";
    },timeout);
}