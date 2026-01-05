// ==UserScript==
// @name         Synesthesia
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cheating My Own Brain
// @author       You
// @match        http://www.colorhexa.com/ffffb1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23608/Synesthesia.user.js
// @updateURL https://update.greasyfork.org/scripts/23608/Synesthesia.meta.js
// ==/UserScript==

var replaceColorLetters = {
	
	a : '<syn style="color:#d98880">a</syn>',
	A : '<syn style="color:#d98880">A</syn>',
	
  b : '<span style="color:#d7bde2">b</syn>',	
 	B : '<span style="color:#d7bde2">B</syn>',	
	
 	c : '<span style="color:#a9cce3">c</syn>',
 	C : '<span style="color:#a9cce3">C</syn>',
	
 	d : '<span style="color:#a3e4d7">d</syn>',
 	D : '<span style="color:#a3e4d7">D</syn>',
	
	e : '<span style="color:#B3B309">e</syn>',
	E : '<span style="color:#B3B309">E</syn>',
	
 	f : '<span style="color:#f7dc6f">f</syn>',
 	F : '<span style="color:#f7dc6f">F</syn>',
	
 	g : '<span style="color:#f8c471">g</syn>',
 	G : '<span style="color:#f8c471">G</syn>',
	
 	h : '<span style="color:#633974">h</syn>',
 	H : '<span style="color:#633974">H</syn>',
	
	i : '<span style="color:#f49ac2">i</syn>',
	I : '<span style="color:#f49ac2">I</syn>',
	
 	j : '<span style="color:#aec6cf">i</syn>',
 	J : '<span style="color:#aec6cf">J</syn>',
	
 	k : '<span style="color:#ff5158">k</syn>',
 	K : '<span style="color:#ff5158">K</syn>',
	
 	l : '<span style="color:#fbcce7">l</syn>',
 	L : '<span style="color:#fbcce7">L</syn>',
	
 	m : '<span style="color:#90eeb0">m</syn>',
 	M : '<span style="color:#90eeb0">M</syn>',
	
 	n : '<span style="color:#ebc9a4">n</syn>',
 	N : '<span style="color:#ebc9a4">N</syn>',
	
	o : '<span style="color:#B3B309">o</syn>',
	O : '<span style="color:#B3B309">O</syn>',
	
	
 	p : '<span style="color:#e497bb">p</syn>',
 	P : '<span style="color:#e497bb">P</syn>',
	
 	q : '<span style="color:#666666">q</syn>',
 	Q : '<span style="color:#666666">Q</syn>',
	
 	r : '<span style="color:#66cccc">r</syn>',
 	R : '<span style="color:#66cccc">R</syn>',
	
 	s : '<span style="color:#c7b8e4">s</syn>',
 	S : '<span style="color:#c7b8e4">S</syn>',
	
	t : '<span style="color:#d0d3d4">t</syn>',
	T : '<span style="color:#d0d3d4">T</syn>',
	
 	u : '<span style="color:#cbffd3">u</syn>',
 	U : '<span style="color:#cbffd3">U</syn>',
	
 	v : '<span style="color:#7eb8ac">v</syn>',
 	V : '<span style="color:#7eb8ac">V</syn>',
	
 	w : '<span style="color:#ffd700">w</syn>',
 	W : '<span style="color:#ffd700">W</syn>',
	
 	x : '<span style="color:#778899">x</syn>',
 	X : '<span style="color:#778899">X</syn>',
	
 	y : '<span style="color:#0e2f44">y</syn>',
 	Y : '<span style="color:#0e2f44">Y</syn>',
	
 	z : '<span style="color:#ecffb1">z</syn>',
 	Z : '<span style="color:#eccfb1">Z</syn>'
};

		
		
		
//parsing function to find all the nodes
function findTextNodes(startLocation)
{
	//currently parsed textNodes
	var textNodes  = [];
	
	//filterFunction
	var filterFunction = { acceptNode: function(node) {
		if( node.nodeValue.trim() ) 
		{
			return NodeFilter.FILTER_ACCEPT;    
		}
				   
		return NodeFilter.FILTER_SKIP;
	}};
	
	
	var treeWalker = document.createTreeWalker(
							startLocation, 
							NodeFilter.SHOW_TEXT, 
							filterFunction, 
							false
					 );

	while (treeWalker.nextNode())
	{
		
	//	console.log(treeWalker.currentNode.parentNode.tagName);
		//exclude script tags / noscript / style
	    if(treeWalker.currentNode.parentNode.tagName != 'SCRIPT' && 
	       treeWalker.currentNode.parentNode.tagName != 'NOSCRIPT' &&
				 // treeWalker.currentNode.parentNode.tagName != 'A' &&
				 // treeWalker.currentNode.parentNode.tagName != 'OPTION' &&
	       treeWalker.currentNode.parentNode.tagName != 'STYLE' 
				 
				
			){
	      textNodes.push(treeWalker.currentNode);
	    }
	}
	
	return textNodes;
}


function changeColor(textNodes,replaceArr)
{
	//iterate through textNodes
	textNodes.forEach( function(textNode) {
		 var parentNode = textNode.parentNode;
		 var oldText = textNode.nodeValue;
		 var replacementNode = document.createElement('synesthesia');	
		
		 
	//	 var newText = oldText.replace(/a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z/gi, function(matched){
		 // var newText = oldText.replace(/a|e|i|o|t/gi, function(matched){
		var newText = oldText.replace(/a/gi, function(matched){
			 return replaceArr[matched];
		 });	
		 
		 replacementNode.innerHTML = newText;
		 
		 
		 parentNode.insertBefore(replacementNode,textNode);

		 parentNode.removeChild(textNode);
	});
}

setTimeout(function(){
     var parsedTextNodes = findTextNodes(document.body);

     changeColor(parsedTextNodes,replaceColorLetters);
       
            
}, 1000);