// ==UserScript==
// @name New [s4s] fortunes
// @namespace newfortunes
// @version 2015.08.16
// @include *://boards.4chan.org/s4s/*
// @grant none
// @description Brings new fortunes to 4chan [s4s] in the style of "Toppest fof", "Middle tet", "Regular vav"
// @downloadURL https://update.greasyfork.org/scripts/16675/New%20%5Bs4s%5D%20fortunes.user.js
// @updateURL https://update.greasyfork.org/scripts/16675/New%20%5Bs4s%5D%20fortunes.meta.js
// ==/UserScript==
'use strict';
function random(seed) {
	seed=Math.sin(seed)*10000
	return (seed-(seed|0)+1)/2
}
function updateposts(){
	if(!waiting){
		waiting=1
		setTimeout(function(){
			var fortunes=document.querySelectorAll('.fortune:not(.newfortunes)>b')
			for(var i=0;i<fortunes.length;i++){
				var target=fortunes[i].parentNode
				var seed=target.style.color.slice(4).slice(0,-1).split(', ')
				seed=seed[0]*0x10000+seed[1]*0x100+seed[2]
				for(;target;){
					if(target.classList.contains('postMessage')){
						var pid=target.id.slice(1)*1
						seed-=-pid
						break
					}
					target=target.parentNode
				}
				var con=random(seed++)*consonants.length|0
				var vow=random(seed++)*vowels.length|0
				while(consonants[con]==vowels[vow]){
					vow=random(seed++)*vowels.length|0
				}
				var lvl=random(seed++)
				if((pid%100/10|0)==(pid%10)&&!(lvl*10|0)){
					var thelevel='Rare'
					var color=54
					fortunes[i].parentNode.style.textShadow='0 0 4px #000'
				}else{
					lvl=random(seed++)*levels.length|0
					var thelevel=levels[lvl]
					var color=(random(lvl*1000+con*10+vow)*20|0)*18
				}
				var text='Your fortune: '+thelevel+' '+consonants[con]+vowels[vow]+consonants[con]
				fortunes[i].title=fortunes[i].innerHTML
				fortunes[i].innerHTML=text
				fortunes[i].parentNode.style.color='hsl('+color+',100%,50%)'
				fortunes[i].parentNode.classList.add('newfortunes')
			}
			waiting=0
		},100)
	}
}
var levels='Apex,Bottom,Bottommost,Classic,Elevated,High,Higher,Highest,Low,Lower,Lowest,Middle,Normal,Ordinary,Regular,Supreme,Tip top,Top,Toppest,Upper'.split(',')
var consonants='bcdfghjklmnpqrstvwxyz'
var vowels='aeiouy'
var waiting=0
updateposts()
document.addEventListener('4chanParsingDone',updateposts)