// ==UserScript==
// @name        Text Hilite
// @namespace   muroph
// @description Highlights matched text on page
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5287/Text%20Hilite.user.js
// @updateURL https://update.greasyfork.org/scripts/5287/Text%20Hilite.meta.js
// ==/UserScript==

//----CONFIGURATION EXAMPLE
// Each rule must use the following blocks:
//
//AD.push(/<regex1>/i); //regex matching the URL of the page(s) for this rule
//MA.push(/(<regex2>)/i); //regex matching the desired text. round brackets are mandatory
//ST.push('<style>'); //style to use on the matched text
//
// You can use multiple rules

var AD=new Array();var MA=new Array();var ST=new Array();

//----RULES LIST
AD.push(/^https?:\/\/greasyfork\.org.*$/i); //regex to match a site
MA.push(/(script)/i); //regex to find some text
ST.push('color: #fff;background: #f00;font-weight: bold;'); //style applied to text

AD.push(/^https?:\/\/greasyfork\.org.*$/i);
MA.push(/(user)/i);
ST.push('color: #9ff;background: #00f;text-decoration: underline;');

//------------------------
for(ind in AD){
	if(AD[ind].test(window.location.href)==true){
		for(var tx=document.evaluate('//text()[normalize-space(.)!=""]',document,null,6,null),t,i=0;t=tx.snapshotItem(i);i++){
			var before=t.textContent,st,matched=false;
			if(t.parentNode.tagName=='STYLE'||t.parentNode.tagName=='SCRIPT') continue;
			while((st=before.search(MA[ind]))!=-1){
				t.parentNode.insertBefore(document.createTextNode(before.substr(0,st)),t);
				with(t.parentNode.insertBefore(document.createElement('span'),t))
					textContent=RegExp.$1,
					style.cssText=ST[ind];
				matched=true;
				before=before.substr(st+RegExp.$1.length);
				}
			if(matched) t.textContent=before;
			}
		}
	}