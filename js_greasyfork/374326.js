// ==UserScript==
// @name     Indeed: separate sponsored jobs from search
// @version  1.1
// @grant    none
// @description  Separate sponsored jobs from search making them appear yellow. Useful to distinguish those jobs you've not searched for, but are in the results just because they're sponsored.
// @author       StephenP
// @namespace       StephenP
// @match        http://*.indeed.com/*
// @match        http://www.indeed.co.uk/*
// @match        http://www.indeed.co.in/*
// @match        http://www.indeed.com.pe/*
// @match        http://www.indeed.tld/*
// @match        http://www.indeed.com.sg/*
// @match        http://www.indeed.co.il/*
// @match        http://www.indeed.co.at/*
// @match        http://www.indeed.com.tr/*
// @match        http://www.indeed.com.ua/*
// @match        https://*.indeed.com/*
// @match        https://www.indeed.tld/*
// @match        https://www.indeed.co.uk/*
// @match        https://www.indeed.co.in/*
// @match        https://www.indeed.com.pe/*
// @match        https://www.indeed.com.sg/*
// @match        https://www.indeed.co.il/*
// @match        https://www.indeed.co.at/*
// @match        https://www.indeed.com.tr/*
// @match        https://www.indeed.com.ua/*
// @downloadURL https://update.greasyfork.org/scripts/374326/Indeed%3A%20separate%20sponsored%20jobs%20from%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/374326/Indeed%3A%20separate%20sponsored%20jobs%20from%20search.meta.js
// ==/UserScript==
(function(){
	var site=window.location.href.toString();
  var sponsoredJobs,i;
	if(site.includes("/m/")){
	  sponsoredJobs=document.getElementsByClassName("sponsoredJob");
	  for(i=0;i<sponsoredJobs.length;i++){
			sponsoredJobs[i].style.backgroundColor="#FFFFBB";
	  }
	}
	else{
    try{
      sponsoredJobs=document.getElementsByClassName("sponsoredGray");
      for(i=0;i<sponsoredJobs.length;i++){
      	sponsoredJobs[i].parentNode.parentNode.parentNode.parentNode.style.backgroundColor="#FFFFBB";
      }
    }
    catch(err){
      console.error("Userscript stopper runnig. Error: "+err); 
    }
	}
})();