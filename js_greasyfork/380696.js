// ==UserScript==
// @name         BigIdeasMath Homework Tool
// @namespace    http://tampermonkey.net/
// @version      1.18.2
// @description  Get the answers for bigideas math (only works on homework assignments, not tests/practice tests)
// @author       theusaf
// @match        https://*.bigideasmath.com/BIM/student/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380696/BigIdeasMath%20Homework%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/380696/BigIdeasMath%20Homework%20Tool.meta.js
// ==/UserScript==

function detect(){
    if(document.getElementsByClassName("check dark").length == 1){
        window.ansget = document.createElement("textarea");
        ansget.style = "position: absolute; top: 300px; right: 80px; z-index: 10000; color: black"
        document.body.append(ansget);
        setup();
        return;
    }
    setTimeout(detect,1000);
};

function setup(){
	var prevID;
	function replaceItems(l){
	for(let i in l){
	l[i] = String(l[i]);
	l[i] = l[i].replace(/(\\\(x\\\))/img,"x");
	l[i] = l[i].replace(/(\\\(y\\\))/img,"y");
	l[i] = l[i].replace(/(\\frac)/img,"fct");
	l[i] = l[i].replace(/(\\sqrt)/img,"sqrt");
	l[i] = l[i].replace(/(\\ge)/img,"≥");
	l[i] = l[i].replace(/(&lt;)/img,"<");
	l[i] = l[i].replace(/(&gt;)/img,">");
	l[i] = l[i].replace(/(&nbsp;)/img,"");
	l[i] = l[i].replace(/(\\left\()/img,"(");
	l[i] = l[i].replace(/(\\right\))/img,")");
	l[i] = l[i].replace(/(\\le)/img,"≤");
	l[i] = l[i].replace(/(\\ne)/img,"≠");
	l[i] = l[i].replace(/(\\pm)/img,"∓");
	l[i] = l[i].replace(/(\\infty)/img,"∞");
	l[i] = l[i].replace(/(\\times)/img,"*");
	l[i] = l[i].replace(/(<span>)/img,"");
	l[i] = l[i].replace(/(<\/span>)/img,"");
	l[i] = l[i].replace(/(<em>)/img,"");
	l[i] = l[i].replace(/(<\/em>)/img,"");
        l[i] = l[i].replace(/(\\cdot)/img," x ");
        l[i] = l[i].replace(/(\\theta)/img,"θ");
        l[i] = l[i].replace(/(\\pi)/img,"π");

	l[i] = l[i].replace(/\\/img,"");
	l[i] = l[i].replace(/{/img,"(");
	l[i] = l[i].replace(/}/img,")");
	}
	return l;
	}
	function listEdit(item,list){
	var numorstr = item.filter(function(o){
	return typeof(o) == "string" || typeof(o) == "number";
	});
	if(numorstr.length > 0){
	for(let i in numorstr){
	list.push(numorstr[i]);
	}
	}
	var hasvalue = item.filter(function(o){
	return typeof(o.value) == "string" || typeof(o.value) == "number";
	});
	if(hasvalue.length > 0){
	for(let i in hasvalue){
	list.push(hasvalue[i].value);
	}
	}
	var remainingarrays = item.filter(function(o){
	return typeof(o.push) == "function";
	});
	if(remainingarrays.length > 0){
	//recursion.
	for(let i in remainingarrays){
	var a = listEdit(remainingarrays[i],[]);
	for(let e in a){
	list.push(a[e]);
	}
	}
	}
	return list;
	}
	function run(){
	try{
	if(prevID !== LearnosityAssess.getCurrentItem().response_ids[0]){
	var lists = [];
	var newlists = [];
	prevID = LearnosityAssess.getCurrentItem().response_ids[0];
	for(let i in LearnosityAssess.getCurrentItem().response_ids){
	lists.push(LearnosityAssess.getQuestions()[LearnosityAssess.getCurrentItem().response_ids[i]].validation.valid_response.value);
	}
	for(let i in lists){
	var a = listEdit(lists[i],[]);
	for(let e in a){
	newlists.push(a[e]);
	}
	newlists.push("|");
	}
	newlists = replaceItems(newlists);
	ansget.innerText = newlists;
	}
    }catch(e){
	console.error(e);
	clearInterval(runcheat);
	}
	}
  window.runcheat = setInterval(run,500);
}
detect();