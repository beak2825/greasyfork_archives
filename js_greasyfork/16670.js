// ==UserScript==
// @name [Better] [s4s]
// @namespace betters4s
// @version 2016.03.03.1
// @include *://boards.4chan.org/s4s/*
// @grant none
// @description Enhances your [s4s] posting experience with the new formatting options
// @downloadURL https://update.greasyfork.org/scripts/16670/%5BBetter%5D%20%5Bs4s%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/16670/%5BBetter%5D%20%5Bs4s%5D.meta.js
// ==/UserScript==
'use strict';

function convert(parent,lastnode,input,s){
	var bbcode='\\](((?!\\[(\\/?[buis]|flip|zalgo)\\]).|\n)*)\\[\\/'
	
	var body=input
	.replace(/&/g,'&amp;')
	.replace(/<br>/g,'\n')
	.replace(/</g,'&lt;')
	.replace(/>/g,'&gt;')
	.replace(/\[spoiler\]/g,'<s>')
	.replace(/\[\/spoiler\]/g,'</s>')
	.replace(/\[code\]([\s\S]*)\[\/code\]/,function(){ // [code]
		var text=arguments[1]
		.replace(/#/g,'&#x23;')
		.replace(/%/g,'&#x25;')
		.replace(/&lt;/g,'&#x3c;')
		.replace(/&gt;/g,'&#x3e;')
		.replace(/\[/g,'&#x5b;')
		.replace(/\]/g,'&#x5d;')
		.replace(/\^/g,'&#x5e;')
		.replace(/{/g,'&#x7b;')
		.replace(/}/g,'&#x7d;')
		.replace(/<s>/g,'[spoiler]')
		.replace(/<\/s>/g,'[/spoiler]')
		.replace(/<[^>]*>/g,'')
		.trim()
		.replace(/\n/g,'\n</div><div>')
		if(text){
			return '<div class="codetext"><div>'+text+'</div></div>'
		}else{
			return arguments[1]
		}
	})
	.replace(new RegExp('\\[b'+bbcode+'b\\]','g'),'<b>$1</b>') // [b]
	.replace(new RegExp('\\[u'+bbcode+'u\\]','g'),'<u>$1</u>') // [u]
	.replace(new RegExp('\\[i'+bbcode+'i\\]','g'),'<i>$1</i>') // [i]
	.replace(new RegExp('\\[s'+bbcode+'s\\]','g'),'<span class="striketext">$1</span>') // [s]
	.replace(new RegExp('\\[flip'+bbcode+'flip\\]','g'),'<span class="flippedtext">$1</span>') // [flip]
	.replace(/([\w\d])\^([\w\d^]+)/g,function(array){ // super^script
		var array=array.split(/\^/g)
		if(array.length>7){
			array.splice(7,array.length-6)
		}
		var close=''
		for(var i=0;i<array.length-1;i++){
			close+='</sup>'
		}
		return array.join('<sup>')+close
	})
	.replace(/^\*\s+(.*)/gm,'<ul><li>$1</li></ul>') // * list
	.replace(/<\/ul>\n<ul>/g,'')
	.replace(/%<s[^>]*>([^<>]*)<\/s>/g,'%<s class="rainbowspoiler">$1</s>') // %[spoiler]rainbow spoiler[/spoiler]
	.replace(/(^|<\/?s[^>]*>\s*)(\[\s[^<>\n]*\s\])($|<\/?s>)/gm,'$1<span class="bluetext">$2</span>$3') // [ bluetext ]
	.replace(/(^|<\/?s[^>]*>\s*)({\s[^<>\n]*\s})($|<\/?s>)/gm,'$1<span class="purpletext">$2</span>$3') // { purpletext }
	.replace(/(^|<\/?s[^>]*>\s*)([^<>\n]*&lt;3)($|\s*<\/?s>)/gm,'$1<span class="pinktext">$2</span>$3') // pinktext <3
	.replace(/(^|<\/?s[^>]*>\s*)([^<>\n]*&lt;)($|\s*<\/?s>)/gm,'$1<span class="orangetext">$2</span>$3') // orangetext<
	.replace(/(^|<\/?s[^>]*>\s*)([^<>\n]*&gt;)($|\s*<\/?s>)/gm,'$1<span class="yellowtext">$2</span>$3') // yellowtext>
	.replace(/(^|<\/?s[^>]*>\s*)(=[^<>\n]*)($|\s*<\/?s>)/gm,'$1<span class="greentext">$2</span>$3') // =greentext
	.replace(/(^|<\/?s[^>]*>\s*)(#[^<>\n]*)($|\s*<\/?s>)/gm,'$1<span class="cyantext">$2</span>$3') // #cyantext
	.replace(/(^|<\/?s[^>]*>\s*)(\][^<>\n]*)($|\s*<\/?s>)/gm,'$1<span class="blacktext">$2</span>$3') // ]blacktext
	.replace(/(^|<\/?s[^>]*>\s*)(-[^<>\n]*)($|\s*<\/?s>)/gm,'$1<span class="whitetext">$2</span>$3') // -whitetext
	.replace(/(^|<\/?s[^>]*>\s*)(\+[^<>\n]*)($|\s*<\/?s>)/gm,'$1<span class="graytext">$2</span>$3') // +graytext
	.replace(/(^|<\/?s[^>]*>\s*)(_[^<>\n]*_)($|\s*<\/?s>)/gm,'$1<span class="comictext">$2</span>$3') // _comic sans text_
	.replace(/(^|\s|<\/?s[^>]*>\s*)(&gt;[^<>\n]*)(\n?|\s*<\/?s>)/g,function(){ // >greentext
		var original=arguments[arguments.length-1]
		if(/^&gt;&gt;(&gt;\/[\w\d]+\/\d*|\d+)$/.test(arguments[2])){
			return arguments[1]+arguments[2]+arguments[3]
		}else{
			return arguments[1]+'<span class="quote">'+arguments[2]+'</span>'+arguments[3]
		}
	})
	.replace(/(^|\s|<\/?s[^>]*>\s*)(&lt;[^<>\n]*)(\n?|\s*<\/?s>)/gm,'$1<span class="redtext">$2</span>$3') // <redtext
	.replace(/(^|\s|<\/?s[^>]*>)(%[^<>\n]*)(\n?|<\/?s>)/gm,function(){ // %rainbowtext
		var array=[arguments[1],arguments[2],arguments[3]]
		var rainbow=array[1].match(/&lt;|gt;|&amp;|./g)
		for(var i=0;i<rainbow.length;i++){
			rainbow[i]='<span style="color:hsl('+(i*18%360)+',100%,50%)">'+rainbow[i]+'</span>'
		}
		array[1]=rainbow.join('')
		return array.join('')
	})
	.replace(/(^|<\/?s[^>]*>)(\*[^<>\n]*\*)(\n|<\/?s>|$)/gm,function(){ // *randomtext*
		var array=[arguments[1],arguments[2],arguments[3]]
		var rainbow=array[1].match(/&lt;|gt;|&amp;|./g)
		for(var i=0;i<rainbow.length;i++){
			rainbow[i]='<span style="color:hsl('+((Math.random()*20|0)*18)+',100%,50%)">'+rainbow[i]+'</span>'
		}
		array[1]=rainbow.join('')
		return array.join('')
	})
	.replace(new RegExp('\\[zalgo'+bbcode+'zalgo\\]','g'),function(){ // [zalgo]
		var zalgos=['000102030405060708090a0b0c0d0e0f1a10111213143d3e3f424344464a4b4c505152575b636465666768696a6b6c6d6e6f','161718191c1d1e1f2023242526292a2b2c2d2e2f30313233393a3b3c454748494d4e53545556595a','151b21222728343536373840414f585c5d5e5f606162'].map(function(array){
			array=array.match(/../g)
			for(var i in array){
				array[i]=String.fromCharCode(parseInt(3+array[i],16))
			}
			return array.join('')
		})
		var randoms=[8,2,8]
		var txt=arguments[1]
		var newtxt=''
		for(var i in txt){
			newtxt+=txt[i]
			if(/[\w\d]/.test(txt[i])){
				for(var k in randoms){
					var r=Math.random()*randoms[k]
					for(var j=0;j<r;j++){
						newtxt+=zalgos[k][Math.random()*zalgos[k].length|0]
					}
				}
			}
		}
		return newtxt
	})
	.replace(/<\/ul>\n/g,'</ul>')
	
	var emotecount=0
	for(var key in emotelist){
		while(emotecount<50&&totalemotecount<=500&&new RegExp(':'+key+':','i').test(body)){
			body=body.replace(new RegExp(':('+key+'):','i'),'<img src="'+protocol+'//i.imgur.com/'+emotelist[key]+'" alt="$1" title="$1">')
			emotecount++
			totalemotecount++
		}
		if(emotecount>=50||totalemotecount>=500){
			break
		}
	}
	body=body.replace(/\n/g,'<br>').replace(/<s>/g,'<s'+s+'>')
	
	if(!parent){
		return body
	}
	var newspan=document.createElement('span')
	newspan.innerHTML=body
	if(lastnode){
		lastnode.parentNode.insertBefore(newspan,lastnode)
	}else{
		parent.appendChild(newspan)
	}
	return newspan.nextSibling
}

function updateposts(){
	if(!waiting){
		waiting=1
		setTimeout(function(){
			var posts=document.querySelectorAll('.postMessage:not(.betters4s)')
			for(var a=0;a<posts.length;a++){
				posts[a].classList.add('betters4s')
				
				var walk=document.createTreeWalker(posts[a],5,null)
				var newnode
				var allnodes=[]
				while(newnode=walk.nextNode()){
					allnodes.push(newnode)
				}
				var text=''
				var s=''
				var lastnode=0
				for(var i in allnodes){
					var node=allnodes[i]
					if(node.parentNode==posts[a]){
						if(node.nodeType==3){
							text+=node.data
						}else if(node.nodeName=='BR'){
							text+='\n'
						}else if(
							(node.nodeName=='S'||(
								node.nodeName=='SPAN'&&
								node.classList.contains('quote')
							))&&
							!node.getElementsByTagName('a').length
						){
							if(node.nodeName=='S'){
								if(!node.tabIndex){
									s=' tabindex="0"'
								}
								text+='[spoiler]'
							}
							text+=node.innerHTML
							.replace(/<br>/g,'\n')
							.replace(/<.*?>/g,'')
							.replace(/&lt;/g,'<')
							.replace(/&gt;/g,'>')
							.replace(/&amp;/g,'&')
							if(node.nodeName=='S'){
								text+='[/spoiler]'
							}
						}else if(node.nodeName!='WBR'){
							if(text){
								lastnode=convert(posts[a],node,text,s)
								text=''
							}
							continue
						}
						lastnode=node.nextSibling
						node.parentNode.removeChild(node)
					}else{
						if(text){
							lastnode=convert(posts[a],lastnode,text,s)
							text=''
						}
					}
				}
				if(text){
					convert(posts[a],0,text,s)
				}
				
				var postnumber=posts[a].parentNode.querySelector('.postNum.desktop>[title="Reply to this post"]')
				var postnum=postnumber.innerHTML
				var length=postnum.length/2|0
				if(postnum.slice(0,length)==postnum.slice(-length).split('').reverse().join('')){
					postnumber.classList.add('postpalindrome')
				}else if((postnum%100/10|0)==postnum%10){
					var b=postnum.length
					var c=0
					for(;b--;){
						c++
						if(postnum[b]!=postnum[b-1]){
							break
						}
					}
					var dubscolor=dubshigh(postnum,postnumber,c)
					if(postnum%1000==666){
						dubscolor.setAttribute('style','background:#000;color:#a00;text-shadow:0 0 2px #aa0;font-weight:bold')
					}
				}else if((postnum%100)==(postnum/100%100|0)){
					postnumber.classList.add('otherdubs')
					dubshigh(postnum,postnumber,4)
				}else if((postnum%100)==87){
					postnumber.classList.add('otherdubs')
					if((postnum%10000)==1987){
						var c=4
					}else{
						var c=2
					}
					dubshigh(postnum,postnumber,c)
				}else if((postnum%10000)==1337){
					postnumber.classList.add('otherdubs')
					dubshigh(postnum,postnumber,4)
				}
			}
			var texts=document.querySelectorAll('textarea:not(.betters4s)')
			for(var a=0;a<texts.length;a++){
				texts[a].classList.add('betters4s')
				texts[a].addEventListener('keydown',function(event){
					if(event.ctrlKey&&event.key=='q'){
						event.preventDefault()
						preview(event.target)
					}
				})
			}
			waiting=0
		},100)
	}
}

function updatepostsx(){
	var currenttime=+new Date
	var pasttime=replycache
	if(currenttime-100>pasttime){
		setTimeout(function(){
			if(pasttime==replycache){
				updatepostsx()
			}
		},100)
	}else{
		replycache=currenttime
		updateposts()
	}
}
var replycache=0

function dubshigh(postnum,postnumber,c){
	postnum+=''
	postnumber.innerHTML=postnum.slice(0,-c)
	var dubscolor=document.createElement('span')
	dubscolor.classList.add('dubshighlight')
	dubscolor.innerHTML=postnum.slice(-c)
	dubscolor.addEventListener('click',function(event){
		event.target.parentNode.click()
	})
	postnumber.appendChild(dubscolor)
	return dubscolor
}

function preview(textarea){
	var source=convert(0,0,textarea.value).replace(/&gt;&gt;(&gt;\/\w+\/\d*|\d+)/g,'<a>$&</a>')
	var previewcont=document.getElementById('previewcont')
	if(previewcont){
		previewcont.parentNode.removeChild(previewcont)
	}
	previewcont=document.createElement('div')
	previewcont.setAttribute('style','position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);cursor:pointer;z-index:20;display:flex;flex-direction:column;justify-content:center;align-items:center')
	previewcont.id='previewcont'
	previewcont.innerHTML='<div style="color:#800000;background-color:#f0e0d6;border:1px solid #d9bfb7;border-left:0;border-top:0;display:table;font:13px arial;width:500px"><input type="checkbox" style="cursor:pointer"><span style="color:#117743;font-weight:bold">Anonymous</span> --/--/--(---)--:--:-- No.-----<div style="margin:13px 40px">'+source+'</div></div>'
	document.body.appendChild(previewcont)
	previewcont.addEventListener('click',function(){
		document.body.removeChild(previewcont)
	})
}

var emotelist={
    doge:'5XD1CYW.png',
     kek:'lblY5Sn.png',
 checkem:'PwAtIwi.png',
   froge:'j8uUz62.png',
     lel:'1DfcjLb.png',
thinchin:'SwNA28g.png',
   ptree:'rUDbkXw.png',
   btree:'M2kjuLL.png',
  pktree:'GWepwsJ.png',
   rtree:'l5fKXY7.png',
    ruse:'8XBt7yF.png',
     mot:'IfMpxw1.png',
       a:'q8hHbwQ.gif',
       b:'03xYJTU.gif',
       c:'9UxS7ej.gif',
       d:'gJezGs5.gif',
       e:'J9df7FB.gif',
       f:'XgufMCh.gif',
       g:'BDKY6vy.gif',
       h:'JWRrUUO.gif',
       i:'gZLK7Dc.gif',
       j:'BiZ3dqk.gif',
       k:'15DDVOh.gif',
       l:'p0HyNUw.gif',
       m:'JX55XPt.gif',
       n:'XhUUK36.gif',
       o:'04fvVIM.gif',
       p:'TlWblXt.gif',
       q:'aEGHWjg.gif',
       r:'PD6x0Uh.gif',
       s:'wirH3pL.gif',
       t:'hsKlJrv.gif',
       u:'Xpf1VnM.gif',
       v:'g3INSef.gif',
       w:'cF6pbpj.gif',
       x:'UVbdagZ.gif',
       y:'2BJaMA3.gif',
       z:'itOUZ85.gif'
}
var totalemotecount=0
var protocol=location.protocol=='https:'?'https:':'http:'
var waiting=0

updateposts()
document.addEventListener('4chanParsingDone',updateposts)
document.addEventListener('PostsInserted',updatepostsx)

var newstyle=document.createElement('style')
newstyle.innerHTML='\
#previewcont a{color:#000080!important;text-decoration:underline}\
#previewcont li{list-style:disc}\
s{background-color:#000;text-decoration:none;color:transparent}\
s:hover{color:#fff}\
.quote{color:#789922}\
.redtext{color:red}\
.orangetext{color:darkorange}\
.yellowtext{color:#ffd800;text-shadow:0 0 2px #000}\
.greentext{color:#1fb211}\
.cyantext{color:lightseagreen}\
.bluetext{color:blue;font-family:monospace;font-weight:bold}\
.purpletext{color:purple;font-family:monospace;font-weight:bold}\
.pinktext{color:magenta}\
.blacktext{color:black;text-shadow:0 0 2px #fff}\
.whitetext{color:white;text-shadow:0 0 2px #000}\
.graytext{color:gray}\
.comictext{font-family:Comic Sans MS}\
.codetext{display:table;background:#fff;border:1px solid #bbb;color:#000;font-family:monospace;counter-reset:codecounter}\
.codetext div{counter-increment:codecounter;padding-right:4px}\
.codetext div::before{color:#808080;width:2.5em;background:#f0f0f0;display:inline-block;content:counter(codecounter);text-align:right;border-right:1px solid #bbb;padding-right:4px;margin-right:4px}\
s *{opacity:0}\
s:hover *{opacity:1}\
.rainbowspoiler{background:repeating-linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00 200px) fixed!important;color:transparent!important;text-shadow:none}\
.rainbowspoiler:hover,.rainbowspoiler b{text-shadow:0 0 2px #000}\
.striketext{text-decoration:line-through}\
.flippedtext{display:inline-block;transform:rotate(180deg);-webkit-transform:rotate(180deg);padding-bottom:.25em}\
ul{margin:0;padding:0 0 0 1em}\
.postNum [href$="00"]+a,\
.postNum [href$="11"]+a,.postNum [href$="22"]+a,.postNum [href$="33"]+a,\
.postNum [href$="44"]+a,.postNum [href$="55"]+a,.postNum [href$="66"]+a,\
.postNum [href$="77"]+a,.postNum [href$="88"]+a,.postNum [href$="99"]+a\
{background:#ffa500}\
.dubshighlight{color:#000}\
.otherdubs{background:#ff0}\
.postpalindrome{background-color:#ff3232}\
'
document.head.appendChild(newstyle)
