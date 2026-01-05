// ==UserScript==
// @name 4cheddit skin
// @namespace 4cheddit
// @version 2018.11.31
// @include *://*.4chan.org/*
// @include *://*.4channel.org/*
// @exclude *://is.4chan.org/*
// @grant unsafeWindow
// @grant GM_getValue
// @grant GM_setValue
// @description Changes 4chan pages to look like Reddit
// @downloadURL https://update.greasyfork.org/scripts/16672/4cheddit%20skin.user.js
// @updateURL https://update.greasyfork.org/scripts/16672/4cheddit%20skin.meta.js
// ==/UserScript==
'use strict';

//Fallback
if(document.getElementById('redditcss')){
	throw ''
}
if(typeof unsafeWindow=='undefined'){
	window.unsafeWindow=window
	window.GM_getValue=function(key){
		return localStorage['*4cheddit*'+key]
	}
	window.GM_setValue=function(key,val){
		localStorage['*4cheddit*'+key]=val
	}
}

// Create element function
function element(tag,parent,attributes,innerhtml){
	var newtag=document.createElement(tag)
	if(attributes){
		for(var i in attributes){
			newtag.setAttribute(i,attributes[i])
		}
	}
	if(innerhtml){
		newtag.innerHTML=innerhtml
	}
	if(parent){
		parent.appendChild(newtag)
	}
	return newtag
}

//Converts timestamp to relative time
function toreltime(inti,tnow){
	var timd=(tnow-inti)/1000
	var sec=timd%60|0
	timd/=60
	var min=timd%60|0
	timd/=60
	var hrs=timd%24|0
	timd/=24
	var day=timd%30.4375|0
	var week=timd/7|0
	var dayw=day%7|0
	timd/=30.4375
	var mon=timd%12|0
	var yer=Math.floor(timd/12)
	if(!mon&&!yer&&day>6){
		var tout=week+' week'+(week>1?'s ':' ')+(dayw&&week<2?'and '+dayw+' day'+(dayw>1?'s ':' '):'')
	}else{
		var till=[
			yer?yer+' year'+(yer>1?'s ':' '):'',
			mon&&yer<2?mon+' month'+(mon>1?'s ':' '):'',
			day&&mon<2?day+' day'+(day>1?'s ':' '):'',
			hrs&&day<2?hrs+' hour'+(hrs>1?'s ':' '):'',
			min&&hrs<3?min+' minute'+(min>1?'s ':' '):'',
			(sec&&min<10)||!min?sec+' second'+(sec>1?'s ':' '):''
		]
		for(var g=0;g<till.length&&!till[g];g++){}
		var tout=till[g]+(till[g+1]?'and '+till[g+1]:'')
	}
	var newdt=new Date(inti*1)
	return [tout+'ago',newdt.toDateString()+' '+newdt.toLocaleTimeString()]
}

//Update posts
function updateposts(event,timer){
	var cheddit=timer?'':':not(.cheddit)'
	if(event){
		var replies=document.querySelectorAll('#t'+event.detail.threadId+' .postContainer'+cheddit)
	}else{
		var replies=document.querySelectorAll('.thread .postContainer'+cheddit)
	}
	if(replies.length){
		if(timer!=1){
			var xposts=localStorage['4chan X.yourPosts']
			if(xposts){
				xposts=JSON.parse(xposts)
				for(var board in xposts.boards){
					for(var thread in xposts.boards[board]){
						var obj={}
						for(var post in xposts.boards[board][thread]){
							obj['>>'+post]=1
						}
						localStorage['4chan-track-'+board+'-'+thread]=JSON.stringify(obj)
					}
				}
			}
			var postsbyme=[]
			var currentthread='\\d+'
			if(activepage=='thread'){
				var resto=document.getElementsByName('resto')[0]
				if(resto){
					currentthread=resto.value
				}else{
					var match=location.pathname.match(/\/([0-9]+)/)
					if(match){
						currentthread=match[1]
					}
				}
			}
			for(var i in localStorage){
				var match=i.match(new RegExp('^4chan-track-'+currentboard+'-('+currentthread+')$'))
				if(match){
					var thread=JSON.parse(localStorage[i])
					for(var j in thread){
						postsbyme.push(j.substr(2))
					}
				}
			}
		}
		var tnow=new Date
		var utc=0
		if(replies.length>200){
			var end=200
		}else{
			var end=replies.length
		}
		for(var i=0;i<end;i++){
			if(i==200){
				var j=0
			}else{
				var j=i
			}
			var datetime=replies[j].querySelector('.postInfo.desktop .dateTime')
			var relarray=toreltime(datetime.dataset.utc*1000,tnow)
			datetime.classList.add('hasrelative')
			datetime.dataset.relative=relarray[0]
			if(!datetime.title){
				datetime.title=relarray[1]
			}
			if(timer!=1){
				replies[j].classList.add('cheddit')
				//Find bumps
				var dtime=replies[j].getElementsByClassName('dateTime')[0]
				var newutc=dtime.dataset.utc
				if(utc&&(newutc-utc)>=3600){
					replies[j].classList.add('postbump')
				}
				utc=newutc
				if(replies[j].classList.contains('opContainer')){
					var blockquote=replies[j].getElementsByTagName('blockquote')[0]
					if(!blockquote.innerHTML){
						blockquote.style.display='none'
					}
				}
				//Reposted images timestamp
				var filelink=replies[j].querySelector('.fileText>a,.file-info>a')
				if(filelink){
					var match=filelink.innerHTML.match(/^(\d{13})s?\.\w+$/)
					if(match&&match[1]>1042e9&&match[1]<tnow){
						var relarray=toreltime(match[1],new Date)
						filelink.parentNode.dataset.timestamp=relarray[0]+' ('+relarray[1]+')'
						filelink.parentNode.classList.add('filenamestamp')
					}
				}
				// Make spoilers clickable
				var spoilers=replies[j].getElementsByTagName('s')
				for(var k=0;k<spoilers.length;k++){
					spoilers[k].tabIndex=0
				}
				//Mark OP posts
				var nameblock=replies[j].querySelector('.desktop .nameBlock')
				var uid=nameblock.getElementsByClassName('posteruid')[0]
				if(j&&opname&&!replies[j].getElementsByClassName('submitterlink')[0]){
					var postname=nameblock.innerHTML.trim().replace(/<br>/g,'')
					if((uid&&opname==uid.className)||opname==postname){
						var opmark=element('span',0,0,' [<a href="'+location.pathname+'" class="submitterlink">S</a>] ')
						nameblock.parentNode.insertBefore(opmark,nameblock.parentNode.getElementsByClassName('dateTime')[0])
						nameblock.classList.add('submitterlink')
					}
				}
				//Mark my posts
				var postid=replies[j].querySelector('.postNum.desktop>:last-child').innerHTML
				if(j&&postsbyme&&postsbyme.indexOf(postid)+1&&!replies[j].getElementsByClassName('yourlink')[0]){
					var memark=element('span',0,0,' [')
					element('a',memark,{
						class:'pointer yourlink'
					},'U').onclick=function(){
						userlink()
					}
					memark.appendChild(document.createTextNode('] '))
					nameblock.parentNode.insertBefore(memark,nameblock.parentNode.getElementsByClassName('dateTime')[0])
					nameblock.classList.remove('submitterlink')
					nameblock.classList.add('yourlink')
				}
				//Mark capcodes
				var capcode=replies[j].querySelector('.postInfo .capcodeMod,.postInfo .capcodeAdmin')
				if(capcode&&capcode.lastChild.tagName=='IMG'){
					if(capcode.classList.contains('capcodeAdmin')){
						element('span',capcode,0,' [<a class="pointer" style="color:#f01">A</a>]')
					}else{
						element('span',capcode,0,' [<a class="pointer" style="color:#282">M</a>]')
					}
				}
				//Exand files
				if(thesettings.expandfiles){
					var thumblink=replies[j].querySelector('a.fileThumb')
					if(thumblink){
						thumblink.onclick=expandthumb
						expandlist.push(thumblink)
					}
				}
			}
		}
		if(postcount){
			var repliesnumber=document.querySelectorAll('.thread .replyContainer').length
			if(repliesnumber){
				postcount.innerHTML='all '+repliesnumber+' comments'
				postcount.style.marginBottom=''
			}
		}
	}
}

//Update posts with delay
function updatepostsx(){
	var currenttime=+new Date
	var pasttime=replycache[0]
	if(pasttime+1000>=currenttime){
		setTimeout(function(){
			if(pasttime==replycache[0]){
				updatepostsx()
			}
		},pasttime+1000)
	}else{
		replycache[0]=currenttime
		updateposts()
	}
}

//Expand thumbnails
function expandthumb(event,close){
	getSelection().removeAllRanges()
	if(close){
		removeEventListener('keydown',expandkeydown)
		removeEventListener('keyup',expandkeyup)
		removeEventListener('blur',expandkeyup)
		removeEventListener('contextmenu',expandkeyup)
		expandkeyup()
		expanddiv.style.display='none'
		var fromtop=[pageXOffset,pageYOffset]
		expandlist[expandindex].focus()
		if(!event.shiftKey){
			scroll(fromtop[0],fromtop[1])
		}
		expandindex=-1
		expandnextfile()
		expandthis=0
	}else{
		event.preventDefault()
		event.stopPropagation()
		var target=event.target
		for(;target;){
			if(target.tagName=='A'){
				break
			}
			target=target.parentNode
		}
		expanddiv.style.display='block'
		expandindex=expandlist.indexOf(target)
		expandnextfile()
		addEventListener('keydown',expandkeydown)
		addEventListener('keyup',expandkeyup)
		addEventListener('blur',expandkeyup)
		addEventListener('contextmenu',expandkeyup)
	}
}
function expandkeydown(event){
	var nodefault=1
	if(expandmode){
		switch(event.keyCode){
			case 13:{ // Enter
				expandthumb(event,1)
				break
			}
			case 32:{ // Space
				if(event.ctrlKey){
					expanddiv.style.background='none'
					expandthis.style.opacity='.5'
				}else if(expandthis.paused){
					expandthis.play()
				}else{
					expandthis.pause()
				}
				break
			}
			case 37:{ // Left
				var totime=expandthis.currentTime-5
				if(totime<0){
					totime=0
				}
				expandthis.currentTime=totime
				break
			}
			case 39:{ // Right
				var totime=expandthis.currentTime+5
				var maxtime=expandthis.duration
				if(totime>=maxtime){
					if(expandthis.paused){
						totime=maxtime
					}else{
						if(expandthis.loop){
							totime=0
						}else{
							expandthis.pause()
							totime=maxtime
						}
					}
				}
				expandthis.currentTime=totime
				break
			}
			case 38:{ // Up
				expandnextfile(-1)
				break
			}
			case 40:{ // Down
				expandnextfile(1)
				break
			}
			default:{
				nodefault=0
				break
			}
		}
	}else{
		switch(event.keyCode){
			case 13:{ // Enter
				expandthumb(event,1)
				break
			}
			case 32:{ // Space
				expanddiv.style.background='none'
				expandthis.style.opacity='.5'
				break
			}
			case 37:
			case 38:{ // Left, Up
				expandnextfile(-1)
				break
			}
			case 39:
			case 40:{ // Right, Down
				expandnextfile(1)
				break
			}
			default:{
				nodefault=0
				break
			}
		}
	}
	if(nodefault){
		event.preventDefault()
	}
}
function expandkeyup(event){
	if(!event||event.keyCode==32||event.type=='blur'||event.type=='contextmenu'){
		expanddiv.style.background=
		expandthis.style.opacity=''
	}
}
function expandnextfile(dir){
	if(expandthis){
		var opacity=expandthis.style.opacity
		expanddiv.removeChild(expandthis)
	}
	if(expandindex+1){
		if(dir){
			expandindex=(expandindex+dir)%expandlist.length
			if(expandindex<0){
				expandindex=expandlist.length-1
			}
		}
		var url=expandlist[expandindex].href
		if(/\.webm$/.test(url)){
			expandmode=1
			expandthis=element('video',expanddiv,{
				preload:1,
				controls:1
			})
			if(!thesettings.pausevideos){
				expandthis.autoplay=1
			}
			if(!thesettings.noloopvideos){
				expandthis.loop=1
			}
			if(!thesettings.unmuteWebm){
				expandthis.muted='muted'
			}
		}else{
			expandmode=0
			expandthis=element('img',expanddiv)
		}
		expandthis.src=url
		expandthis.style.opacity=opacity
	}
}

//Automatically show quick reply
function showqr(){
	setTimeout(function(){
		unsafeWindow.QR.realshow=unsafeWindow.QR.show
		unsafeWindow.QR.show=function(){
			this.realshow.apply(this,arguments)
			document.getElementById('qrFile').setAttribute('accept',fileaccept)
			if(currentboard=='s4s'&&thesettings.autofortune){
				document.querySelector('#quickReply [name="email"]').value='fortune'
			}
			document.body.classList.add('qropened')
		}
		unsafeWindow.QR.realclose=unsafeWindow.QR.close
		unsafeWindow.QR.close=function(){
			this.realclose.apply(this,arguments)
			document.body.classList.remove('qropened')
		}
		if(activepage=='thread'){
			if(thesettings.qrautoopen&&!document.getElementsByClassName('closed').length){
				if(!document.getElementsByClassName('open-qr-wrap')[0]){
					QR.init()
				}
				QR.show(document.getElementsByName('resto')[0].value)
			}
			var update=document.querySelectorAll('[data-cmd="update"]')[1]
			if(update){
				update.accessKey='r'
			}
		}
		//Add new options to settings
		if(unsafeWindow.SettingsMenu){
			unsafeWindow.SettingsMenu.options['4cheddit Settings']={
				fullreddit:['Reddit logo and icon','Make everybody think that you\'re actually browsing Reddit',0],
				expandfiles:['Expand files to full screen [<a href="javascript:expandfiles()">Help</a>]','Overrides "Image expansion" option',1],
				pausevideos:['Don\'t autoplay videos','Videos can be played by pressing spacebar',0,1],
				noloopvideos:['Don\'t loop videos','You can temporarily turn on loop in video right click menu',0,1],
				qrautoopen:['Automatically open Quick Reply','Open Quick Reply as soon as the page loads',0],
				autofortune:['Always check your #fortune','Never worry that you\'ll break the first rule',0,1],
				listcatalog:['Catalog links in board list','Boards at the top of the page will always lead you to catalog',0],
				hidenavlinks:['Hide [Return] [Catalog] [Top] buttons','',true]
			}
			if(GM_getValue('wordreplace')){
				unsafeWindow.SettingsMenu.options['4cheddit Settings'].exportwordreplace=[
					'Export replace and highlight patterns: [<a href="javascript:exportreplace()">Export</a>]','It has been moved to a separate userscript',0
				]
			}
		}
		unsafeWindow.expandfiles=function(){
			var menu=element('div',document.body,{
				class:'UIPanel'
			})
			menu.innerHTML='<div class="extPanel reply" style="width:600px;margin-left:-300px"><div class="panelHeader">Expand files to full screen Help\
<span><img alt="Close" title="Close" class="pointer" src="'+unsafeWindow.Main.icons.cross+'"></span></div>\
With this setting on, the images and videos will be opened in the middle of the screen with a darkened background<br><br>\
Hotkeys:<br>\
<b><kbd>\u25C0</kbd>, <kbd>\u25B2</kbd>, <kbd>\u25B6</kbd>, <kbd>\u25BC</kbd> (only <kbd>\u25B2</kbd> and <kbd>\u25BC</kbd> for videos):</b><br>Go to previous/next file in the thread<br><br>\
<b><kbd>\u25C0</kbd>, <kbd>\u25B6</kbd> (videos):</b><br>Seek 5 seconds backwards/forwards<br><br>\
<b><kbd>Space</kbd> (videos):</b><br>Pause video<br><br>\
<b><kbd>Space</kbd> (<kbd>Ctrl</kbd>+<kbd>Space</kbd> for videos):</b><br>Hold the button to make the view transparent, useful when thying to read a post and looking at a picture at the same time<br><br>\
<b><kbd>Enter</kbd>, Click:</b><br>Closes the file<br><br>\
<b><kbd>\u21E7 Shift</kbd>+<kbd>Enter</kbd>, <kbd>\u21E7 Shift</kbd>+Click:</b><br>Close the file and also scroll to the post that it was attached to<br><br></div>'
			menu.onclick=closepanel
		}
		unsafeWindow.exportreplace=function(){
			var replace={
				patterns:[]
			}
			var wr_strings=GM_getValue('wordreplace')
			if(wr_strings){
				wr_strings=JSON.parse(wr_strings)
			}else{
				wr_strings=[]
			}
			for(var i in wr_strings){
				replace.patterns[i]={
					on:wr_strings[i][0],
					pattern:wr_strings[i][1],
					replace:wr_strings[i][2],
					board:wr_strings[i][3],
					mark:wr_strings[i][4]
				}
			}
			replace=JSON.stringify(replace).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
			var menu=element('div',document.body,{
				class:'UIPanel'
			})
			menu.innerHTML='<div class="extPanel reply"><div class="panelHeader">Export replace and highlight patterns\
<span><img alt="Close" title="Close" class="pointer" src="'+unsafeWindow.Main.icons.cross+'"></span></div>\
<textarea style="width:100%;height:100px;box-sizing:border-box" id="replacetxt">'+replace+'</textarea>\
<div style="text-align:center">\
<input type="button" id="replacedl" value="Download"> \
<input type="button" id="replaceclear" value="Clear">\
</div>\
<br></div>'
			menu.onclick=closepanel
			document.getElementById('replacedl').onclick=function(){
				var txt=document.getElementById('replacetxt').value
				txt=btoa(encodeURIComponent(txt).replace(/%([0-9A-F]{2})/g,function(a,b){
					return String.fromCharCode('0x'+b)
				}))
				element('a',0,{
					href:'data:application/json;base64,'+txt,
					download:'wordreplace.json'
				}).click()
			}
			document.getElementById('replaceclear').onclick=function(event){
				if(confirm('Are you sure you want to clear your Replace and highlight patterns? This will remove the option to export them')){
					GM_setValue('wordreplace','')
					var parent=event.target.parentNode.parentNode.parentNode
					parent.parentNode.removeChild(parent)
				}
			}
		}
	},1000)
}
function closepanel(event){
	if(event.target.className=='UIPanel'){
		event.target.parentNode.removeChild(event.target)
	}
	if(event.target.tagName=='IMG'){
		var target=event.target.parentNode.parentNode.parentNode.parentNode
		target.parentNode.removeChild(target)
	}
	if(event.target.classList.contains('closeIcon')){
		var target=event.target.parentNode.parentNode.parentNode
		target.parentNode.removeChild(target)
	}
}

//User link that lists posts made by you
function userlink(board){
	if(board==undefined){
		var menu=element('div',document.body,{
			class:'UIPanel',
			id:'userlink'
		})
		if(activepage=='catalog'){
			var closebutton='<span class="icon closeIcon" title="Close"></span>'
		}else{
			if(unsafeWindow.Main){
				var iconurl=unsafeWindow.Main.icons.cross
			}else{
				var iconurl='//s.4cdn.org/image/buttons/futaba/cross.png'
			}
			var closebutton='<span><img alt="Close" title="Close" class="pointer" src="'+iconurl+'"></span>'
		}
		menu.innerHTML='<div class="extPanel reply" style="width:500px;margin-left:-250px;height:500px;max-height:100%"><div class="panelHeader">Posts made by you\
'+closebutton+'</div>\
<select id="userlinkselect"></select><div id="userlinkposts" style="text-align:center"></div><br><style id="userlinkstyle"></style></div>'
		menu.onclick=closepanel
		var userlinkselect=document.getElementById('userlinkselect')
		var userlinkposts=document.getElementById('userlinkposts')
		document.getElementById('userlinkselect').onchange=function(event){
			userlink(event.target.value)
		}
		var userlinkboards={}
		element('option',userlinkselect,{
			value:''
		},'All')
		for(var i in localStorage){
			var match=i.match(/^4chan-track-(\w+)-(\d+)$/)
			if(match){
				var thread=JSON.parse(localStorage[i])
				for(var j in thread){
					if(!userlinkboards[match[1]]){
						userlinkboards[match[1]]=[]
					}
					userlinkboards[match[1]].push([match[2]*1,j.substr(2)*1])
				}
			}
		}
		Object.keys(userlinkboards).sort().forEach(function(board){
			if(board=='s4s'){
				var boardname='[s4s]'
			}else{
				var boardname='/'+board+'/'
			}
			var option=element('option',userlinkselect,{
				value:board
			},boardname)
			var divparent=element('div',userlinkposts,{
				id:'userlink-'+board
			})
			element('br',divparent)
			element('b',divparent,0,boardname)
			var linkparent=element('ul',divparent)
			userlinkboards[board]=userlinkboards[board].sort(function(a,b){
				return a[1]>b[1]?1:-1
			})
			userlinkboards[board].forEach(function(post){
				if(board==currentboard){
					var text='>>'+post[1]
				}else{
					var text='>>>/'+board+'/'+post[1]
				}
				var li=element('li',linkparent)
				element('a',li,{
					href:'/'+board+'/thread/'+post[0]+'#p'+post[1]
				},text)
			})
		})
		userlinkselect.focus()
		if(userlinkboards[currentboard]){
			userlinkselect.value=currentboard
			userlink(currentboard)
		}
	}else{
		if(board){
			var style='#userlinkposts>:not(#userlink-'+board+'){display:none}'
		}else{
			var style=''
		}
		document.getElementById('userlinkstyle').innerHTML=style
	}
}

if(document.getElementsByTagName('meta').length){
	//Get settings
	var thesettings=localStorage['4chan-settings']
	if(thesettings){
		thesettings=JSON.parse(thesettings)
		if(thesettings.expandfiles==undefined){
			thesettings.expandfiles=true
			localStorage['4chan-settings']=JSON.stringify(thesettings)
		}
		if(thesettings.hidenavlinks==undefined){
			thesettings.hidenavlinks=true
			localStorage['4chan-settings']=JSON.stringify(thesettings)
		}
	}else{
		thesettings={}
		var fullreddit=GM_getValue('fullreddit')
		if(fullreddit){
			thesettings.fullreddit=fullreddit=='true'?1:0
		}
		thesettings.expandfiles=true
		thesettings.hidenavlinks=true
	}
	var homelinkimg,faviconimg,thecss
	longstrings()
	//Add CSS
	element('style',document.head,{
		id:'redditcss'
	},thecss)
	//Determine current page format, board name, and thread id
	if(document.body.classList.contains('is_index')){
		var activepage='index'
	}else if(document.getElementById('content')){
		var activepage='catalog'
	}else if(location.pathname.indexOf('/thread/')+1){
		var activepage='thread'
	}else{
		var activepage='main'
	}
	var currentboard=''
	var match=document.body.classList[0]
	if(match){
		match=match.match(/^board_(\w+)$/)
		if(match){
			var currentboard=match[1]
		}else if(activepage!='main'){
			match=location.pathname.match(/^\/(\w+)\//)
			if(match){
				var currentboard=match[1]
			}
		}
	}
	// Blue bar
	if(thesettings.listcatalog){
		var catalog='catalog'
	}else{
		var catalog=''
	}
	var bluebar=element('div',0,{
		id:'bluebar'
	})
	document.body.insertBefore(bluebar,document.body.firstChild)
	var boardlist=element('div',0,{
		id:'boardlist'
	})
	//Board list
	var boardarray=[]
	if(location.pathname=='/'){
		//Home page board list
		var boardlinks=document.querySelectorAll('#boards .boxcontent a')
		for(var i=0;i<boardlinks.length;i++){
			boardarray.push(boardlinks[i].href.match(/(\w+)\/$/)[1])
		}
	}else{
		//If this is empty there will be no boards at all
		var boardlinks=document.querySelectorAll('#boardNavDesktop>.boardList>a')
		for(var i=0;i<boardlinks.length;i++){
			boardarray.push(boardlinks[i].innerHTML)
		}
	}
	if(thesettings.customMenu&&thesettings.customMenuList){
		//Use boards from custom menu setting
		var customarray=thesettings.customMenuList.replace(/[^a-z\d]+/gi,' ').trim().split(/\s+/)
		if(customarray.length){
			boardarray.push(null)
			boardarray=boardarray.concat(customarray)
		}
	}
	var boardnodes=[]
	var boardlast=''
	for(var i in boardarray){
		if(boardarray[i]==null){
			boardlast=boardnodes.join(' - ')
			boardnodes=[]
		}else{
			var linkclass=boardarray[i]==currentboard?' class="currentboard"':''
			boardnodes.push('<a href="/'+boardarray[i]+'/'+catalog+'"'+linkclass+'>'+boardarray[i]+'</a>')
		}
	}
	var front=location.pathname=='/'?' class="currentboard"':''
	boardlist.innerHTML='<a href="/"'+front+'>front</a> - <a href="/#recent-threads">all</a> - <a id="randomboardlink">random</a> | '+boardnodes.join(' - ')
	if(boardlast){
		boardlist.appendChild(document.createTextNode(' | '))
		element('a',boardlist,0,'[...]').onclick=function(event){
			event.target.parentNode.removeChild(event.target)
			showallboards.style.display='inline'
		}
		var showallboards=element('span',boardlist,{
			style:'display:none'
		},boardlast)
	}
	document.body.insertBefore(boardlist,bluebar)
	document.getElementById('randomboardlink').addEventListener('click',function(){
		location='/'+boardarray[Math.random()*boardarray.length|0]+'/'+catalog
	})
	//Logo that links to home page
	var homelink=element('a',bluebar,{
		id:'bluebar-logo',
		href:'/'
	})
	element('img',homelink,{
		src:homelinkimg
	})
	if(currentboard){
		element('a',bluebar,{
			id:'bluebar-return',
			href:'/'+currentboard+'/'
		},currentboard)
	}
	if(activepage=='thread'){
		var newcontent='comments'
	}else{
		var newcontent='new'
	}
	if(activepage=='catalog'){
		var newclass='bluebar-inactive'
		var catalogclass='bluebar-active'
		var newhref='/'+currentboard+'/'
	}else{
		var newclass='bluebar-active'
		var catalogclass='bluebar-inactive'
		var newhref=location.pathname
	}
	//Either new or comments tab
	element('a',bluebar,{
		class:newclass,
		href:newhref
	},newcontent)
	//Catalog tab
	if(currentboard){
		element('a',bluebar,{
			class:catalogclass,
			href:'/'+currentboard+'/catalog'
		},'catalog')
	}
	
	if(thesettings.fullreddit){
		//Change favicon
		document.querySelector('[rel="shortcut icon"]').setAttribute('href',faviconimg)
	}
	
	if(activepage!='main'){
		//Paste fortune into traditional post form
		if(thesettings.autofortune&&currentboard=='s4s'){
			var forms=document.getElementsByName('email')
			for(var i=0;i<forms.length;i++){
				forms[i].value='fortune'
			}
		}
		//File form will only accept these media types
		var fileaccept='image/x-png,image/gif,image/jpeg,video/webm,application/pdf,application/vnd.adobe.flash-movie'
		var forms=document.getElementsByName('upfile')
		for(var i=0;i<forms.length;i++){
			forms[i].accept=fileaccept
		}
		//User bar
		var user=element('div',bluebar,{
			id:'bluebar-user'
		})
		var myname=''
		var cookies=document.cookie.split('; ')
		for(var i in cookies){
			var value=cookies[i].split('=')
			if(value[0]=='4chan_name'){
				myname=value[1]
				break
			}
		}
		if(!myname){
			myname='Anonymous'
		}
		element('a',user,0,myname).onclick=function(){
			userlink()
		}
		//Settings link
		var settingslink=document.getElementById('settingsWindowLink')
		if(unsafeWindow.SettingsMenu||settingslink){
			user.appendChild(document.createTextNode(' | '))
			var preferences=element('a',user,0,'preferences')
			if(unsafeWindow.SettingsMenu){
				preferences.onclick=unsafeWindow.SettingsMenu.toggle
			}else{
				preferences.onclick=function(){
					settingslink.click()
				}
			}
		}
	}
	var postcount
	var opname
	var replycache=[0,[]]
	if(activepage=='thread'){
		if(thesettings.hidenavlinks){
			var links=document.querySelectorAll('.navLinksBot>a:nth-of-type(-1n+3)')
			for(var i=links.length;i--;){
				links[i].parentNode.removeChild(links[i])
			}
		}
		var navchilds=document.getElementsByClassName('navLinksBot')[0].childNodes
		for(var i=navchilds.length;i--;){
			if(navchilds[i].nodeType==3){
				navchilds[i].parentNode.removeChild(navchilds[i])
			}
		}
		postcount=element('div',document.querySelector('.post.op'),{
			class:'postcount'
		})
		var repliesnumber=document.querySelectorAll('.thread .replyContainer').length
		if(repliesnumber){
			postcount.innerHTML='all '+repliesnumber+' comments'
		}else{
			postcount.innerHTML='no comments (yet)<div>there doesn\'t seem to be anything here</div>'
			postcount.style.marginBottom='30px'
		}
	}
	if(activepage=='index'||activepage=='thread'){
		var opcontainers=document.querySelectorAll('.opContainer')
		for(var opnum=0;opnum<opcontainers.length;opnum++){
			var postinfo=opcontainers[opnum].querySelector(':scope .postInfo.desktop')
			var newdiv=element('div')
			newdiv.appendChild(postinfo.getElementsByTagName('input')[0])
			var subject=postinfo.getElementsByClassName('subject')[0]
			newdiv.appendChild(postinfo.getElementsByClassName('subject')[0])
			if(!subject.innerHTML){
				var body=opcontainers[opnum].getElementsByTagName('blockquote')[0]
				subject.innerHTML=body.innerHTML.replace(/<br>/g,' ')
				var fortune=subject.getElementsByClassName('fortune')[0]
				if(fortune){
					fortune.parentNode.removeChild(fortune)
				}
				var spoilers=opcontainers[opnum].querySelectorAll(':scope .subject>s')
				for(var i=0;i<spoilers.length;i++){
					spoilers[i].innerHTML=spoilers[i].innerHTML.replace(/<\/?s>/g,'').replace(/&amp;|&[lg]t;|[^\s]/g,'?')
				}
				if(subject.textContent.length>50){
					var text=subject.textContent.slice(0,50).replace(/\W+\w+$/,'')
				}else{
					var text=subject.textContent
				}
				subject.innerHTML=''
				subject.appendChild(document.createTextNode(text))
				if(body.innerHTML==text){
					body.style.display='none'
				}
			}
			var replylink=opcontainers[opnum].getElementsByClassName('replylink')[0]
			var threadurl=replylink?replylink.href:location.pathname
			subject.innerHTML='<a href="'+threadurl+'">'+subject.innerHTML+'</a>'
			postinfo.insertBefore(postinfo.getElementsByClassName('nameBlock')[0],postinfo.firstChild)
			postinfo.insertBefore(document.createTextNode(' by '),postinfo.firstChild)
			postinfo.insertBefore(postinfo.getElementsByClassName('dateTime')[0],postinfo.firstChild)
			postinfo.insertBefore(document.createTextNode('submitted '),postinfo.firstChild)
			var op=opcontainers[opnum].getElementsByClassName('op')[0]
			var optable=element('div',0,{
				id:'optable'
			})
			var file=op.getElementsByClassName('file')[0]
			if(file){
				var filetext=file.querySelector(':scope .fileText,:scope .file-info')
				if(filetext){
					postinfo.insertBefore(filetext,postinfo.firstChild)
				}
				optable.appendChild(file)
			}
			postinfo.insertBefore(newdiv,postinfo.firstChild)
			optable.appendChild(postinfo)
			op.insertBefore(optable,op.firstChild)
		}
	}
	if(activepage=='thread'){
		var nameblock=document.querySelector('.opContainer .nameBlock')
		var uid=nameblock.getElementsByClassName('posteruid')[0]
		if(uid){
			opname=uid.className
		}else{
			var opsname=nameblock.innerHTML.trim().replace(/<br>/g,'')
			var tempopsname=opsname
			if(opsname.indexOf('class="flag')+1){
				var newdiv=element('div',0,0,opsname)
				newdiv.removeChild(newdiv.getElementsByClassName('flag')[0])
				tempopsname=newdiv.innerHTML.trim()
			}
			if(tempopsname!='<span class="name">Anonymous</span>'){
				opname=opsname
			}
		}
	}
	if(activepage=='index'||activepage=='thread'){
		//Expand images
		if(thesettings.expandfiles){
			var expanddiv=element('div',document.body,{
				id:'imgexpand',
				style:'display:none'
			})
			expanddiv.onclick=function(event){
				if(!expandmode||event.target!=expandthis){
					expandthumb(event,1)
				}
			}
			var expandthis
			var expandmode=0
			var expandlist=[]
			var expandindex=-1
		}
		setInterval(function(){
			updateposts(0,1)
		},30000)
		updateposts()
		document.addEventListener('4chanParsingDone',updateposts)
		document.addEventListener('PostsInserted',updatepostsx)
		//Show Quick Reply
		if(unsafeWindow.Main){
			showqr()
		}else{
			document.addEventListener('4chanMainInit',showqr)
		}
		document.addEventListener('4chanSettingsSaved',function(){
			var thesettings=JSON.parse(localStorage['4chan-settings'])
			GM_setValue('fullreddit',thesettings.fullreddit+'')
		})
	}
}

function longstrings(){
if(thesettings.fullreddit){
homelinkimg='data:;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAoCAMAAAACNM4XAAAAhFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvLy+fn58/Pz8AAAAAAADv7+////8PDw8AAAAAAAAAAAB/f38AAAAAAABvb2+Pj4+/v7+vr69PT08fHx/f399fX1/Pz8//on//cz//8+//f0//xK//RQD/uZ//UA//rY//Zy//il8EhIVuAAAAGHRSTlMADx9vv3+v/+8v////n9////9fz4//Tz8+qhQLAAADlUlEQVR4Ab2VbXejLhOHhwcdNKIIGhobk+5Tdv97f//vd5cJ0pC65/iiyfViZX8duGTwEPgM4/SvkAWDp1KiKkVV1rtGPtXLkFdCt9iZrufPFFsHgeeLtYDAUI/1c1ut4jZFIZ7q3Tt4OswXWrZKDqJ6ltJzAF9i/XKYpul1PPZt8Z5Uj/bvVd1LOY8nk5jOOLRzL9kjvVztzAHHzmS81XNnzvKRYnE0u34ynzjXXYePFNvjqX8Npm/fv5Hxx8/vv8KzOT9WzPF4Dp5fl8vldxj8vFz+hOcJjxIeiUVq9O938X9h8P19YAJHx2E7TGuWJ1VJiS0Eg1Xw2uG/l78/aOt/Lv+jZCxgO6ARdZ5IRAHgENGtm9XJrPKyWRw18lNSgMXR7FDAGuVhXTz7LxAXoZ8YtuAVDpDh+27Ne2jhS3dcfCqAsiFz80I9n+qRrpDef4U4nvG6mLk6KE/nvm9qnMm76y18iTh+1atiYEN/vTNP00TPqVF7uKOCCPeQ46t7secfYqDyFTHhZX9+PcV7+lCrgkHCK7QwIDrSa3ynFTczQ6D5h9iG7irNotjRRIlEy+/N+7ZpEJummXE+z2X0plclnQewGHGxQuMV1UYxKzE62quYJnKM2HtvP0/GdNM0vYXPrHYsExMtu3pbqZJ5uAZIkJi8ziGRxDCs75ip12YyiWZqijux0hbovekeFXi9p3wIfLgvF7GNJbzMxP86Y1ubW/HLeFK5WFWxr44iWp/TySlGgY7iljoTkFvEw5iJx9HMVSamqSwOAg5xoA4US89o3QoR90DwLWI5ZeLjzjT+VtxCYI+obkK57HvZsqQ4lbgNYn24FYdxnYlleoMiEo6QgryqvFl92CAWx7DLRD2dED6LB8zJ1vI0log6zdsgZuptHE0CzYteEWvMkNladqs4R/Rjk7xv80FxWG2184kKVlqtb1YvN4gp7hbxAdsKVsR7RIRICngcO6oSiMhiojaJgbt0yHWoXxEzRBSp3jIKBiAqpCr+cSta3CYG2yydVmxdDJpuEkIoLChACpi7ikEuJUxtEtOdNxmiQVR2VczDYtpzbyWtSoEqqsq2GMUew+zKW4WbxPLYmcNMp7zrOzP1+zUxHWr2+2TzzzxPtogxOM91F7xTsJeZOP3Pt3hl+cXeKyScXKrskrgkrv4tVnhHAQlWygoSVkspS8vSX235HghWyaWKiTJUQCXLUCXksCzjYeH/NjtPA1utKpIAAAAASUVORK5CYII='
faviconimg='data:;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEJ0lEQVR4AbWXfyydVxjH3ev2LpdGhExMMg0LwhiSpmYmRFo/E8nEX5amTCSqa9lMLNIskw1LEMGYf/z6YyFjs0mQiagIksWinUldNCLVNKj53bHhfvd90pfcEr3uvD7JJ7znnOd5XrnnPuewUYm79DP6LtXTi/QXV1fXLf5spa/Rc+N1+ie9Sb+nRvqoqKgIQl5eHvh8i54bH9FCak5ZfX09hPLycvA5n54bnTSImuNmMBiMUVFR0Ov1D/jsRM+Fi/ThCXM6eolqqWro6Hv0Dv2W/kpnaRW9SS+rWTCU3qZX6Bu03NHRcSElJQWVlZXo7e3F6OgoxJ6eHpSVlSE5ORn29vaPufYr6qTE3lZyWUV2ZGQkqqqq4O7ubqLPGxsbsb29DUtsbm6iuroaLi4u615eXibJIbkkJz0dzs7Of0mx0tJSxMXFYW1tDdaysLCAsLAwNDc3Q3Ix5wq1OeqxAaJhA9kcGRlBSEgIdnZ2cMgf94BPw4HmL3AMGfuEcw/6ccD6+joCAgJgNBohOSU3PRVf8/NGfz+TmfPxFeCaDaXzRhzyZEoZp7cuw5yWlhYpDslJT41Gp9M93tvbw0vUZr8o8qE78PcmDtne4tilF3M1d2DO4uKiFL9PNfT0aLXah8c2nckEPLoPPF/HMTgmc7LGnPn5eTDdPWo1de3t7TgrNTU1YK4vqdW85enpubW0tARzGhoaMDg4iKPImPR/c+bm5uTr+Ew5sP4XH3AX/zM1NYUDJicnER8fD19fX8TExECU32VM5g4YGxuDh4eHHMcR9EyE8WCZzs3NxfT0NA6Q/TE7Oyu+1KDGx8eRmZkJbmI5hN6hqqCnd21tbU1BQUHIyMhARUUFmpqaIEobTktLg7+/PzQazZ7Sfm2parzt4ODwTIqvrKygr68PtbW1kEtHcXEx6urqMDAwgI2NDbi5uYE95AljPKk68C//ra2tDdHR0bBEYGAgurq6wLBeqgr+sbGxmJiYQFJSEiwh/X95eRmhoaFg7Jv0zCQXFBRA+nliYiIsIefH6uoqsrKywNir9MwkZGdn4+nTp4iIiIAl/Pz8sLu7i9TUVDD2fVVuvfye/yvngo+PD16FiW3Y29sb8gJyh2CsPVWF70pKShAcHPzKu8HMzAxko+bn54Mx31DVMNAf2ZDQ3d2Nk2ArliuZFG+iF6jqpKSnp+MkEhISpPg1ei5cpVV2dnb7Rw8oQdo0+8U215TRcKoqOfLZdnZ2orCwENevX4c5+/v7kF4ht+WOjg6Eh4ebGJNKz4SWXqAGXk5mpP0ODw9jaGgI0u1ycnIg7Ve8ceMG5OYr86K8KON+pwYlh5Zahcbsv1wnWkhb6Q+0nf5EO+jPih3KWLuyppV+Tp2UHHolp9VoqE5JYFCSOVBHJbmzopMy5qCsMSgxOkuF/wPG+KMUMQiaLQAAAABJRU5ErkJggg=='
}else{
homelinkimg='data:;base64,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'
}
thecss='\
/* Hide a lot of stuff */\
#ctrl-top,.boardBanner,body>.center,#delform>.center,#content>.center,hr,#blotter,#boardNavDesktopFoot,.stylechanger,#styleSwitcher,\
.cataloglink,#qf-clear,#content .navLinks,#content #settings>:nth-child(3),#op+.navLinks,.rules,#boardNavDesktop,.ad-plea,\
#qf-ctrl.active::after,#quote-preview .postcount,h1.qr-link-container+#togglePostFormLink{\
	display:none!important;\
}\
#qf-ctrl,#ctrl>#settings>:nth-child(5),#hidden-label,#togglePostForm,#togglePostFormLink,.hasrelative,.navLinksBot{\
	color:transparent!important;\
	font-size:0!important;\
}\
.is_index .board>hr{\
	display:block!important;\
}\
body{\
	font-family:verdana,arial,helvetica,arial unicode ms,symbola,sans-serif!important;\
	background:#fff;\
	min-height:100%;\
	margin:0!important;\
	padding:0;\
	color:#000;\
}\
/* Highlight dubs */\
.postNum [href$="00"]+a,\
.postNum [href$="11"]+a,.postNum [href$="22"]+a,.postNum [href$="33"]+a,\
.postNum [href$="44"]+a,.postNum [href$="55"]+a,.postNum [href$="66"]+a,\
.postNum [href$="77"]+a,.postNum [href$="88"]+a,.postNum [href$="99"]+a{\
	background:#ffa500;\
}\
#content [data-id$="00"],\
#content [data-id$="11"],#content [data-id$="22"],#content [data-id$="33"],\
#content [data-id$="44"],#content [data-id$="55"],#content [data-id$="66"],\
#content [data-id$="77"],#content [data-id$="88"],#content [data-id$="99"]{\
	outline:2px solid #ffa500;\
}\
/* Index page list */\
.pagelist{\
	background:none!important;\
	border:0!important;\
	clear:both;\
	white-space:nowrap;\
}\
.pagelist::before{\
	content:"view more:";\
	color:#808080;\
	font-size:12px;\
	float:left;\
}\
.prev input,.next input,.depagelink{\
	content:"next \\203A";\
	padding:1px 4px;\
	background:#eee;\
	border:1px solid #ddd;\
	border-radius:3px;\
	font-weight:bold;\
	color:#369!important;\
	cursor:pointer;\
	text-transform:lowercase;\
	font-size:12px;\
}\
.prev input:hover,.next input:hover{\
	background:#f0f0f0;\
	border:1px solid #82a6c9;\
}\
.prev input:active,.next input:active{\
	background:#e4e4e4;\
}\
/* Catalog */\
#search-cnt,#qf-cnt{\
	display:block!important;\
}\
#index-search,#search-box,#qf-box{\
	position:absolute;\
	display:block;\
	top:100px;\
	right:0;\
	border:1px solid #808080!important;\
	font-size:18px;\
	width:295px!important;\
	height:23px;\
	padding:2px;\
	background:none;\
	z-index:1;\
	box-sizing:content-box!important;\
}\
#index-search{\
	background:#fff!important;\
}\
#search-cnt::after,#qf-cnt::after{\
	content:"";\
	display:block;\
	position:absolute;\
	top:101px;\
	right:6px;\
	width:295px;\
	height:23px;\
	background:#fff;\
}\
#search-box:focus,#qf-box:focus{\
	background:#fff;\
}\
#content #settings{\
	float:none;\
	text-align:left;\
	margin:50px 0 0 70px;\
}\
#post-preview{\
	background:#fff;\
	color:#000;\
	border-radius:0;\
}\
#post-preview .post-last{\
	color:#888;\
}\
#post-preview .post-author{\
	color:#369;\
}\
#qf-ctrl::after{\
	content:"search 4chan";\
	display:block;\
	position:absolute;\
	top:100px;\
	right:5px;\
	width:301px;\
	height:29px;\
	z-index:2;\
	color:#a9a9a9;\
	font-size:18px;\
	padding:2px;\
	box-sizing:border-box;\
}\
#ctrl>#settings>:nth-child(5)>span{\
	cursor:text;\
}\
#ctrl>#info{\
	float:none;\
}\
#togglePostFormLink>a{\
	text-decoration:none;\
	display:block;\
	width:298px;\
	height:20px;\
	text-align:center;\
	padding:4px 0;\
	border:1px solid #c4dbf1;\
	background:#f0f6fd;\
	background:linear-gradient(to bottom,#fff,#ecf5fe);\
	border-top-right-radius:30px 15px;\
	border-bottom-right-radius:30px 15px;\
	margin:10px auto;\
}\
#togglePostFormLink>a::after{\
	content:"Submit a new text post";\
	font-size:15px;\
	font-family:verdana,arial,helvetica,arial unicode ms,symbola,sans-serif;\
	font-weight:bold;\
	color:#369;\
}\
#togglePostFormLink>a:hover{\
	border-color:#879eb4;\
	background:#a9c5df;\
	background:linear-gradient(to bottom,#ccdff1,#aec9e1 50%,#a5c2dd 51%,#6da1d2);\
}\
#togglePostFormLink>a:hover::after{\
	color:#fff!important;\
}\
/*Name, subject, etc. tabs on index and catalog*/\
.postForm>tbody>tr>td:first-child{\
	border:0!important;\
	color:#000!important;\
	background:none!important;\
	text-align:right;\
	font-size:10px!important;\
}\
/*Comment box on index and catalog*/\
tr[data-type="Comment"] textarea{\
	width:500px;\
	height:100px;\
}\
/*Post block*/\
#postForm{\
	margin-left:20px;\
}\
.post.op .file-info{\
	display:block;\
}\
.navLinks a,.fileText a,.file-info a{\
	color:#000!important;\
	text-decoration:underline;\
}\
.postContainer{\
	clear:both;\
	font-size:13px;\
}\
.post.reply{\
	border-color:transparent!important;\
	background:none!important;\
	min-width:400px;\
}\
blockquote{\
	word-wrap:break-word;\
	padding:5px;\
	font-size:14px;\
	margin:0;\
	min-height:1em;\
}\
.post.reply:target blockquote,.highlight blockquote{\
	background:#ffc!important;\
}\
.name{\
	color:#369!important;\
}\
.postInfo,.postNum a,.file,.postMenuBtn{\
	font-size:10px!important;\
	color:#888!important;\
}\
s:focus,s:focus *{\
	color:#fff;\
	outline:0;\
}\
.opContainer blockquote{\
	background-color:#fafafa;\
	border:1px solid #369;\
	border-radius:7px;\
	padding:7px 10px;\
	margin:5px 0 0 51px;\
	max-width:60em;\
}\
.opContainer .file,.opContainer .fileThumb,.opContainer .fileThumb img{\
	float:none!important;\
	display:inline-block!important;\
}\
/* Make space for quick reply window */\
.qropened .board{\
	margin-right:307px;\
}\
@media (max-width:1000px){\
	.board{\
		margin-right:0!important;\
	}\
}\
/* Quick reply comment height */\
#quickReply textarea{\
	min-height:150px;\
}\
/*Disclaimer at the very bottom*/\
#absbot,div#absbot a:not(:hover),#absbot a:hover{\
	color:#808080!important;\
	font-size:10px;\
}\
/*Top line*/\
.sideArrows{\
	width:15px;\
	height:30px;\
	color:transparent!important;\
	cursor:default;\
	background-position:-71px 0px;\
	margin:10px 6px 0 15px!important;\
}\
.navLinks{\
	clear:both;\
}\
.replyContainer{\
}\
.passNotice{\
	color:#888;\
}\
#header{\
	position:absolute!important;\
	top:-20px!important;\
}\
.thread-stats{\
	position:fixed;\
	top:100px;\
	right:5px;\
}\
.thread-stats>.ts-replies::before{\
	content:"Comments: ";\
}\
.thread-stats>.ts-images::before{\
	content:"Files: ";\
}\
.thread-stats>.ts-ips::before{\
	content:"Posters: ";\
}\
.thread-stats>.ts-page::before{\
	content:"Page ";\
}\
.navLinksBot{\
	margin-left:20px;\
}\
#quote-preview{\
	background:#fff!important;\
	border:1px solid #ccc!important;\
}\
.postbump .postNum::after{\
	content:" BUMP";\
	color:#f00;\
}\
.post:not(#quote-preview) s b{\
	opacity:0\
}\
.post:not(#quote-preview) s:hover b{\
	opacity:1;\
	text-shadow:0 0 3px #fff;\
}\
/* Expand images */\
#imgexpand{\
	position:fixed;\
	top:0;\
	left:0;\
	width:100%;\
	height:100%;\
	background:rgba(0,0,0,.5);\
	cursor:pointer;\
	z-index:2;\
}\
#imgexpand *{\
	position:fixed;\
	top:0;\
	left:0;\
	right:0;\
	bottom:0;\
	max-width:100%;\
	max-height:100%;\
	margin:auto;\
}\
#imgexpand img{\
	background:url(data:image/gif;base64,R0lGODlhEAAQAPABAOfn5////yH5BAAKAAAALAAAAAAQABAAAAIfhG+hq4jM3IFLJhoswNly/XkcBpIiVaInlLJr9FZWAQA7);\
}\
#imgexpand video{\
	background:#000;\
	cursor:default;\
}\
/* Blue bar */\
#bluebar{\
	border-bottom:1px solid #5f99cf;\
	background-color:#cee3f8;\
	margin:0;\
	text-align:left;\
	position:relative;\
}\
#bluebar-logo{\
	display:inline-block;\
	margin:2px 5px 0 0;\
	height:40px;\
}\
#bluebar-return{\
	color:#000;\
	text-decoration:none;\
	font-weight:bold;\
	font-variant:small-caps;\
	font-size:14px;\
	margin-right:7px;\
}\
#bluebar-return:hover{\
	text-decoration:underline;\
}\
.bluebar-active,.bluebar-inactive{\
	font-weight:bold;\
	margin:0 3px 1px 3px;\
	padding:2px 6px 0 6px;\
	font-size:12px;\
	text-decoration:none;\
}\
.bluebar-active,.bluebar-active:hover{\
	color:#ff4500!important;\
	background:#fff;\
	border:1px solid #5f99cf;\
	border-bottom:1px solid #fff;\
}\
.bluebar-inactive,.bluebar-inactive:hover{\
	color:#369!important;\
	background:#eff7ff;\
}\
#bluebar-user{\
	position:absolute;\
	right:0;\
	bottom:0;\
	background-color:#eff7ff;\
	padding:4px;\
	border-top-left-radius:7px;\
	font-size:10px;\
	color:gray;\
	cursor:default;\
}\
#bluebar-user a{\
	cursor:pointer;\
	color:#369;\
}\
#bluebar-user a:hover{\
	color:#369!important;\
	text-decoration:underline;\
}\
#boardlist{\
	background-color:#f0f0f0;\
	white-space:nowrap;\
	text-transform:uppercase;\
	border-bottom:1px solid #808080;\
	height:18px;\
	min-height:18px;\
	line-height:18px;\
	overflow:hidden;\
	cursor:default;\
	margin-top:0;\
	padding-left:5px;\
	color:#808080;\
	font-size:9px;\
	text-align:left;\
	transition:height .5s;\
}\
#boardlist:hover{\
	white-space:normal;\
	height:auto;\
}\
#boardlist a{\
	color:#000;\
	font-size:9px;\
	text-decoration:none;\
	cursor:pointer;\
}\
#boardlist a:hover{\
	text-decoration:underline;\
}\
#boardlist a.currentboard{\
	color:#ff4500;\
	font-weight:bold;\
}\
/*Settings*/\
.fPattern,.fBoards{\
	padding:1px!important;\
	font-size:11px!important;\
}\
#wr-body>div{\
	text-align:center;\
}\
#wr-add{\
	float:left;\
}\
.highlighttext{\
	background:#99f;\
	color:#ff3;\
}\
.postcount{\
	font-size:16px;\
	padding:10px 0 3px 0;\
	margin:10px 10px 0 15px;\
	border-bottom:1px dotted gray;\
	width:calc(100% - 25px);\
	clear:left;\
}\
.postcount div{\
	color:red;\
	font-size:13px;\
	position:absolute;\
	margin:14px 0 0 -10px;\
}\
.opContainer .postInfo.desktop .name{\
	font-weight:normal!important;\
}\
.subject a{\
	color:blue!important;\
	font-size:16px;\
	font-weight:normal;\
}\
.subject a:hover{\
	color:blue!important;\
}\
#optable{\
	display:table-row;\
}\
#optable>*{\
	display:table-cell!important;\
	vertical-align:bottom;\
}\
/* Images */\
.sideArrows,#content .nofile,#content .imgdel,.is_index .fileDeletedRes{\
	background-repeat:no-repeat;\
background-image:url("data:;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAyCAMAAADx7dyJAAAA3lBMVEUAAAC3t7e3t7cAAAAAAAAAAAC8vLy4uLi4uLgAAAAAAAAAAAAAAAAAAAAAAAAAAAC+vr69vb0AAAAAAAAAAAAAAADBwcHAwMAAAAC2tram0fqm0fqm0fqm0foAAACm0fqm0fqm0frKysrKysrOzs7CwsLOzs7T09PHx8fIyMjU1NTU1NTY2NjNzc3Y2Njb29vb29vc3Nzc3Nym0fr/RQD/RQD/RQD/RQD/RQD/RQD/RQCm0fr/RQD/RQD/RQD/RQD/RQD/RQCm0fqm0fr/RQD/RQD/RQD/RQCm0fqm0friiswmAAAASnRSTlMA/wATJhz//wBDMA5NPjkE//80SCEJ//8Y/x9/XwArP/+//wD//wD/////AP//AP8A/wAvKj8aAAo1D+8vVR8FSk9PrzpFJRVvDxwuszYAAANySURBVHgBrdcLV9s2H8fxnyuJVNJfErGszpQh0pZeHnqhF1iALS3sxvb+39AsYh07BBySPJ9wkmPD+WLLWBb4/yqezOHJYzHOxcrqzujpLTwdxKUSGokiY8k4DBntFuPiMUcrbenJlxUTxIAgy8Hqs6IofipWZzVpQFdKEik0ahoagaa613RHKweBS8wFw9HQxNB5vr+///NBVuzu7e0VzWt3tCprIlpWoSEIPYeTyeRFro7GRZGqjXExPAiBNFo1VQDz8aFssTtuFMVovNu8isFs5ZGhIi+pdMvZnpfjnZ2XrxK8GmAUOkFUGhjMHr1+/ezoTYI3D3NUY8By9u27d/87fp/g/cOEx3rZDx8/Hn34lODTvVjNOZeS84q5x2dPjo/fnnxO8HmJ5paIrLW8tFYSSVU/Mvvl5OTky9cEXzOn0XCVJBlrB2SMW/IxoOHYcLaD9rOWRKRc5b3S6Mu/S7n2R4Ds28osJ8WC8ETc4V5CeipZaD4CkK0ahEAVAOaNxkNcpJg+ZLmQ3R+6ZFwCEKQwd3p29ss0O784u7icNubfr8kh+zVlB/7AbAS0z9XfZo3vbfXHVbNxfT7vcsARQ/YiZQduB1UCxqI1S67a7PdZcjpNKtLQpPvZ34duXkGh+VrIXrfZ05xNrAWXQPbHZHI4ONUYYxSyqxT6s81eznpDwohTBWT7KTs0MWrTO7fL69nsrx/T1t9N9SJvSOJYyD4fnsYZoefmZto5vzmfZqVCzz+TycHwQ6fLDuL2zt170OkekWtno8XiM/Kg554HuqaATgi4n+FrLj98hY7tb/UEqtH59/Dw8NtB3/JiKUqHDNqTjIItTeFKrpgYl5Z2zkd0HJfU4FigSaw13yaCBPoCu3u0zlusl00UCQwJxrj1srkbFzvRqoCs9qm6CeEN6183GSW1O4Ki0mFDwZKt0bLGAaVso7LGFpgkGdltitj8XVeGiIzDNnyMhsgorgiJIfKqJm626jIKgKt56anNKp3eefAcm+MGtxTFMgBol7ilAvcOG7MRKWZ8jcQZkydE5wU2RqK3YJDWe51PAqrERvI5Cypde7NWLq/xAeG3uGIABMet6F1/P6Otspmgqre/PZOts7VXd/YT2z7LqatufbT5vxBmiCPbfmyhfO1YlGQ17mYriY05S0QmaiyqCTAKj/YfMfq5TiasXK8AAAAASUVORK5CYII=");\
}\
/*User link on catalog*/\
.UIPanel{\
	line-height:14px;\
	font-size:14px;\
	background-color:rgba(0,0,0,0.25);\
	position:fixed;\
	width:100%;\
	height:100%;\
	z-index:9002;\
	top:0;\
	left:0;\
}\
.UIPanel::after{\
	display:inline-block;\
	height:100%;\
	vertical-align:middle;\
	content:"";\
}\
.UIPanel>div{\
	-moz-box-sizing:border-box;\
	box-sizing:border-box;\
	display:inline-block;\
	height:auto;\
	max-height:100%;\
	position:relative;\
	width:400px;\
	left:50%;\
	margin-left:-200px;\
	overflow:auto;\
	box-shadow:0 0 5px rgba(0,0,0,0.25);\
	vertical-align:middle;\
	padding:2px;\
}\
#userlink ul{\
	-moz-column-width:140px;\
	-webkit-column-width:140px;\
	column-width:140px;\
}\
.nameBlock{\
	color:#369;\
	cursor:pointer;\
}\
.nameBlock:hover{\
	text-decoration:underline;\
}\
.submitterlink,.submitterlink .name{\
	color:#0055df!important;\
}\
.yourlink,.yourlink .name{\
	color:#000!important;\
}\
/*Compatibility with upboats*/\
.opContainer .cnt{\
	float:left;\
	width:50px;\
	margin-top:5px;\
}\
.replyContainer .nmb{\
	width:31px;\
}\
.opContainer .nmb{\
	width:51px;\
}\
.nmb{\
	margin-top:5px;\
}\
.extPanel{\
	background-color:#f0e0d6;\
	border:1px solid #d9bfb7;\
	border-left:none;\
	border-top:none;\
}\
body[style^="margin-top: 20%"]>h1{\
	margin-top:20%;\
}\
.navLinksBot>*{\
	color:#000;\
	font-size:13px;\
}\
.navLinksBot>a,.navLinksBot>label{\
	margin-right:5px;\
}\
.filenamestamp a{\
	text-decoration:none;\
	border-bottom:1px dashed;\
}\
.filenamestamp::after{\
	display:block;\
	position:absolute;\
	content:attr(data-timestamp);\
	color:#444;\
	background:#fff;\
	border:1px solid #767676;\
	font:13px segoe ui;\
	padding:1px 5px 2px 5px;\
	box-shadow:4px 4px 2px -2px rgba(0, 0, 0, 0.5);\
	pointer-events:none;\
	opacity:0;\
	margin:15px 0 0 50px;\
}\
.filenamestamp:hover::after{\
	opacity:1;\
	transition:opacity .2s .5s;\
}\
.hasrelative::after{\
	content:attr(data-relative);\
	font-size:10px;\
	color:#888;\
}\
.threadContainer{\
	border-left:1px dotted #ddf!important;\
}\
#index-mode,#index-sort,#index-size,.is_index .navLinks>.brackets-wrap{\
	float:left!important;\
	margin:50px 0 30px 0;\
}\
.is_index .navLinks>.brackets-wrap:first-child{\
	margin-left:70px;\
}\
.is_index .board{\
	clear:both;\
}\
'.replace(/\s+/g,' ').replace(/\/\*((?!\*\/).)*\*\//g,'').replace(/;? ?} ?/g,'}').replace(/ ?([{,;]) ?/g,'$1')
}
