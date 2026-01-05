// ==UserScript==
// @name New Collab VM
// @description Adds new features to Collab VM chat
// @namespace collabvm
// @version 2016.04.17
// @match http://computernewb.com/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/18634/New%20Collab%20VM.user.js
// @updateURL https://update.greasyfork.org/scripts/18634/New%20Collab%20VM.meta.js
// ==/UserScript==
'use strict';

var ignoredusers={'chocolatebot':1,'ha3orx':1,'eeveevulpix':1,'inspector gadget bot':1,'grok gimme cock':1,'fuck you 1337':1}
var hideusers=/^(666|afk|c3po)$/i
var guests=/^guest\d+$/i


var chatbox=document.getElementById('chat-box')
var onlineusers=document.getElementById('online-users')
var chatpanel=document.getElementById('chat-panel')
var chatinput=document.getElementById('chat-input')

if(chatbox&&onlineusers&&chatpanel){

var initial=1
var changedusers=[]
var sentmessages=[]
var sentindex=-1
var lastli
var lastdiv
var ignoredialog=element(
	document.body,
	['div#ignoredialog',{
		class:'ignoredialog',
		tabIndex:-1
	},
		['div',{
			onclick:function(event){
				ignoredialog.blur()
				var name=event.currentTarget.parentNode.dataset.name.toLowerCase()
				var add
				if(ignoredusers[name]){
					ignoredusers[name]=0
				}else{
					ignoredusers[name]=1
					add=1
				}
				var usernames=document.querySelectorAll('#chat-box .username')
				for(var i=0;i<usernames.length;i++){
					if(usernames[i].firstChild.nodeValue.toLowerCase()==name){
						usernames[i].parentNode.parentNode.style.display=add?'none':''
					}
				}
			}
		},'Ignore user']
	]
).ignoredialog

// Detect changes in user list
new MutationObserver(function(mutations){
	mutations.forEach(function(mutation){
		for(var i=0;i<mutation.addedNodes.length;i++){
			var thisnode=mutation.addedNodes[i]
			var name=thisnode.firstChild.nodeValue
			if(hideusers.test(name)){
				thisnode.style.display='none'
			}else if(!guests.test(name)){
				changedusers.push([1,name])
				thisnode.style.color='hsl('+(random(strtonum(name))*20|0)*18+',50%,50%)'
			}
			thisnode.addEventListener('contextmenu',function(event){
				event.preventDefault()
				ignoredialog.style.left=(document.body.scrollLeft+event.clientX+5)+'px'
				ignoredialog.style.top=(document.body.scrollTop+event.clientY+5)+'px'
				ignoredialog.dataset.name=name
				if(ignoredusers[name.toLowerCase()]){
					ignoredialog.classList.add('ignored')
				}else{
					ignoredialog.classList.remove('ignored')
				}
				ignoredialog.focus()
			})
		}
		for(var i=0;i<mutation.removedNodes.length;i++){
			var name=mutation.removedNodes[i].firstChild.nodeValue
			if(!hideusers.test(name)&&!guests.test(name)){
				changedusers.push([-1,name])
			}
		}
	})
}).observe(onlineusers,{childList:1})

// Detect changes in chat
new MutationObserver(function(mutations){
	var date=new Date()
	mutations.forEach(function(mutation){
		for(var i=0;i<mutation.addedNodes.length;i++){
			var thisnode=mutation.addedNodes[i]
			var username=thisnode.getElementsByClassName('username')[0]
			if(!initial){
				var minute=date.getMinutes()
				if(minute<10){
					minute='0'+minute
				}
				thisnode.firstChild.dataset.time=date.getHours()+':'+minute
			}
			if(username){
				var user=username.firstChild.nodeValue
				var ignored
				if(ignoredusers[user.toLowerCase()]){
					thisnode.style.display='none'
				}else{
					changedusers=[]
					lastli=lastdiv=null
				}
				if(!guests.test(user)){
					username.style.color='hsl('+(random(strtonum(user))*20|0)*18+',50%,50%)'
				}
				var textnode=thisnode.firstChild.lastChild
				var text=textnode.nodeValue
				textnode.nodeValue=text=text.replace(/(\\x[\da-f]{2}|\\u[\da-f]{4}|\\u{1[\da-f]{4}})+/g,function(){
					return eval('"'+arguments[0]+'"')
				})
				if(text[0]=='>'){
					var textnode=element(
						['span#textnode',{
							class:'quote'
						},text]
					).textnode
					thisnode.firstChild.replaceChild(textnode,thisnode.firstChild.lastChild)
					textnode=textnode.firstChild
				}
				var pos=[]
				var found
				var nameregex=new RegExp(window.username,'ig')
				while((found=nameregex.exec(text))!=null){
					pos.push([found.index,found[0].length])
				}
				var urlregex=/(^|\b)(https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#\-()]*[\w@?^=%&/~+#\-()])?|(i\.)?imgur\.com\/[\w\-.?#]+)/ig
				while((found=urlregex.exec(text))!=null){
					pos.push([found.index,found[0].length])
				}
				pos.sort(function(a,b){
					return a<b?1:-1
				})
				for(var i in pos){
					var rightpart=text.slice(pos[i][0]+pos[i][1])
					var highlighttext=text.slice(pos[i][0],pos[i][0]+pos[i][1])
					text=text.slice(0,pos[i][0])
					textnode.nodeValue=text
					if(nameregex.test(highlighttext)){
						var highlight=element(
							['b#highlight',{
								class:'mentioned'
							},highlighttext]
						).highlight
					}else{
						var highlight=element(
							['a#highlight',{
								href:highlighttext,
								target:'_blank',
								rel:'noreferrer'
							},highlighttext]
						).highlight
					}
					insertAfter(highlight,textnode)
					insertAfter(document.createTextNode(rightpart),highlight)
				}
			}
		}
	})
	chatpanel.scrollTop=chatpanel.scrollHeight-chatpanel.offsetHeight
	initial=0
}).observe(chatbox,{childList:1})

// Notify when a user joins or leaves in chat
setInterval(function(){
	if(initial){
		if(changedusers.length){
			initial=0
			changedusers=[]
		}
	}else{
		var actualchanges={}
		for(var i in changedusers){
			actualchanges[changedusers[i][1]]=(actualchanges[changedusers[i][1]]||0)+changedusers[i][0]
		}
		var joined=[]
		var left=[]
		for(var i in actualchanges){
			if(!ignoredusers[i.toLowerCase()]){
				if(actualchanges[i]>0){
					joined.push(i)
				}else if(actualchanges[i]<0){
					left.push(i)
				}
			}
		}
		var message=[]
		if(left.length){
			message.push(left.join(', ')+' left')
		}
		if(joined.length){
			message.push(joined.join(', ')+' joined')
		}
		message=message.join('. ')
		if(message){
			if(lastdiv){
				lastdiv.firstChild.nodeValue=message
			}else{
				chatmessage(message)
			}
		}else if(lastdiv){
			chatbox.removeChild(lastli)
			lastli=lastdiv=null
		}
	}
},1000)

// Chat box extensions
chatinput.maxLength=maxChatMsgLen
chatinput.onkeydown=function(event){
	if(event.keyCode==13){ // Enter
		event.preventDefault()
		var text=event.currentTarget.value
		sentmessages.unshift(text)
		sentindex=-1
		event.currentTarget.value=text.replace(/[^\da-z`~!@#$%^&*()\-_=+[\]{};'\\:"|,.\/<>? ]+/gi,jsesc).slice(0,maxChatMsgLen)
		document.getElementById('chat-send-btn').click()
	}else if(event.keyCode==38){ // Up
		event.preventDefault()
		sentindex++
		if(sentindex>=sentmessages.length){
			sentindex=sentmessages.length-1
		}
		if(sentindex>-1){
			event.currentTarget.value=sentmessages[sentindex]
			event.currentTarget.selectionStart=event.currentTarget.selectionEnd=event.currentTarget.value.length
		}
	}else if(event.keyCode==40){ // Down
		event.preventDefault()
		sentindex--
		if(sentindex<0){
			sentindex=-1
			event.currentTarget.value=''
		}else{
			event.currentTarget.value=sentmessages[sentindex]
			event.currentTarget.selectionStart=event.currentTarget.selectionEnd=event.currentTarget.value.length
		}
	}
}

function blurchat(){
	var canvas=document.querySelector('#display>div>div>div')
	if(canvas&&!canvas.onmousedown){
		canvas.onmousedown=function(){
			document.getElementById('chat-input').blur()
		}
	}
}
blurchat()
setInterval(blurchat,500)

} // if(chatbox&&onlineusers&&chatpanel)

element(
	document.head,
	['style',`
.quote{
	color:#789922;
}
.mentioned{
	background:#dedede;
}
[data-time]::before{
	content:attr(data-time);
	font-size:12px;
	padding-right:3px;
}
.ignoredialog{
	position:absolute;
	background:#eee;
	cursor:default;
	z-index:1;
	outline:none;
}
.ignoredialog:not(:focus){
	top:-999px!important
}
.ignoredialog>div{
	min-width:150px;
	overflow:hidden;
	display:flex;
	justify-content:center;
	flex-direction:column;
	padding:5px;
	padding:5px 5px 5px calc(1em + 5px);
}
.ignoredialog>div:hover{
	background:#e6e6e6;
}
.ignoredialog.ignored>div::before {
	content:'\\2713';
	position:absolute;
	margin-left:-1em;
}
#display :not(:first-child){
	pointer-events:none;
}
`]
)

function chatmessage(text){
	lastli=document.createElement('li')
	lastdiv=document.createElement('div')
	lastdiv.appendChild(document.createTextNode(text))
	lastli.appendChild(lastdiv)
	chatbox.appendChild(lastli)
}
function strtonum(str){
	return parseInt(str.replace(/[^\da-z]/gi,''),36)
}
function random(seed){
	seed=Math.sin(seed)*10000
	return (seed-(seed|0)+1)/2
}
function element(){
	var parent
	var lasttag
	var createdtag
	var toreturn={}
	for(var i=0;i<arguments.length;i++){
		var current=arguments[i]
		if(current){
			if(current.nodeType){
				parent=lasttag=current
			}else if(Array.isArray(current)){
				for(var j=0;j<current.length;j++){
					if(current[j]){
						if(!j&&typeof current[j]=='string'){
							var tagname=current[0].split('#')
							lasttag=createdtag=document.createElement(tagname[0])
							if(tagname[1]){
								toreturn[tagname[1]]=createdtag
							}
						}else if(current[j].constructor==Object){
							if(lasttag){
								for(var value in current[j]){
									if(value!='style'&&value in lasttag){
										lasttag[value]=current[j][value]
									}else{
										lasttag.setAttribute(value,current[j][value])
									}
								}
							}
						}else{
							var returned=element(lasttag,current[j])
							for(var k in returned){
								toreturn[k]=returned[k]
							}
						}
					}
				}
			}else if(current){
				createdtag=document.createTextNode(current)
			}
			if(parent&&createdtag){
				parent.appendChild(createdtag)
			}
			createdtag=0
		}
	}
	return toreturn
}
function insertAfter(append,target){
	var parent=target.parentNode
	var next=target.nextSibling
	if(next){
		parent.insertBefore(append,next)
	}else{
		parent.appendChild(append)
	}
}
function jsesc(argument){
	var result=''
	for(var i=0;i<argument.length;i++){
		var character=argument.charAt(i)
		var first=argument.charCodeAt(i)
		if(first>=55296&&first<=56319&&argument.length>i+1){
			var second=argument.charCodeAt(i+1)
			if(second>=56320&&second<=57343){
				var hex=((first-55296)*1024+second-56320+65536).toString(16)
				result+='\\u{'+hex+'}'
				i++
				continue
			}
		}
		var hex=character.charCodeAt(0).toString(16)
		var longhand=hex.length>2
		result+='\\'+(longhand?'u':'x')+('0000'+hex).slice(longhand?-4:-2)
	}
	return result
}