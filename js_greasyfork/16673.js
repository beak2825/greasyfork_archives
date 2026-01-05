// ==UserScript==
// @name Replace and highlight
// @namespace wordreplace
// @version 2015.08.21
// @include *://boards.4chan.org/*
// @grant unsafeWindow
// @grant GM_getValue
// @grant GM_setValue
// @description Your own censor list for 4chan
// @downloadURL https://update.greasyfork.org/scripts/16673/Replace%20and%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/16673/Replace%20and%20highlight.meta.js
// ==/UserScript==
'use strict';

// Create element function
function element(){
	var parent
	var toreturn={}
	for(var i=0;i<arguments.length;i++){
		var current=arguments[i]
		if(current.nodeType){
			parent=current
		}else{
			if(Array.isArray(current)){
				var tagname=current[0].split('#')
				var newtag=document.createElement(tagname[0])
				if(tagname[1]){
					toreturn[tagname[1]]=newtag
				}
				for(var j=1;j<current.length;j++){
					if(current[j].constructor==Object){
						for(var value in current[j]){
							if(value!='style'&&value in newtag){
								newtag[value]=current[j][value]
							}else{
								newtag.setAttribute(value,current[j][value])
							}
						}
					}else{
						var returned=element(newtag,current[j])
						for(var k in returned){
							toreturn[k]=returned[k]
						}
					}
				}
			}else{
				var newtag=document.createTextNode(current)
			}
			if(parent){
				parent.appendChild(newtag)
			}
		}
	}
	return toreturn
}

//Update posts
function updateposts(event){
	if(event){
		var replies=document.querySelectorAll('#t'+event.detail.threadId+' .postContainer:not(.wordreplace)')
	}else{
		var replies=document.querySelectorAll('.thread .postContainer:not(.wordreplace)')
	}
	if(replies.length){
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
			replies[j].classList.add('wordreplace')
			//Remove wbr tags
			if(thesettings.wrremwbr){
				var wbr=replies[j].getElementsByTagName('wbr')
				for(var k=wbr.length;k--;){
					var pre=wbr[k].previousSibling
					var nex=wbr[k].nextSibling
					if(pre&&nex&&pre.nodeType==3&&nex.nodeType==3){
						pre.nodeValue+=nex.nodeValue
						nex.parentNode.removeChild(nex)
					}
					wbr[k].parentNode.removeChild(wbr[k])
				}
			}
			//Replace and highlight
			wordreplacing(replies[j])
		}
	}
}

//Add new settings
function updatesettings(){
	setTimeout(function(){
		unsafeWindow.SettingsMenu.options['Replace and highlight']={
			wordreplace:['Replace and highlight words [<a href="javascript:wordreplace()">Edit</a>]','Your own censor list',1],
			wronlyin:['Instead of replacing everything, replace only in:','',1],
			wrbody:['Comment body','',1,1],
			wrsubject:['Subject','',1,1],
			wrfilename:['Filename','',1,1],
			wrposter:['Poster name','',0,1],
			wrtitle:['Page title','',1,1],
			wrremwbr:['Remove all &lt;wbr&gt; tags from the posts','&lt;wbr&gt; tags are inserted every 35 characters in long words, which may prevent some patterns from working',1],
			wrtooltip:['Reveal original line in a tooltip when hovered over','',0]
		}
		unsafeWindow.wordreplace=function(event,action){
			var norefresh=0
			var order={on:1,pattern:0,case:1,replace:0,js:1,caps:1,mark:1,board:0}
			if(!action){
				wr_temp=JSON.parse(JSON.stringify(wr_strings))
				var menu=element(
					document.body,
					['div',{
						class:'UIPanel',
						id:'wr-body',
						onclick:closepanel
					},
						['div',{
							class:'extPanel reply',
							style:'width:600px;margin-left:-300px'
						},
							['div',{
								class:'panelHeader'
							},
								'Replace and highlight words',
								['span',
									['img',{
										alt:'Close',
										title:'Close',
										class:'pointer',
										src:unsafeWindow.Main.icons.cross
									}]
								]
							],
							['table',{
								style:'text-align:center'
							},
								['thead',
									['tr',
										['th'],
										['th','On'],
										['th','Pattern'],
										['th','Case'],
										['th','Replace'],
										['th','JS'],
										['th','Caps'],
										['th','Mark'],
										['th','Board'],
										['th','Del']
									]
								],
								['tbody',{
									id:'wr-list'
								}],
							],
							['div',{
								style:'float:left'
							},
								['input',{
									type:'button',
									value:'Add',
									onclick:function(event){
										wordreplace(event,'add')
									}
								}],
								['input',{
									type:'button',
									value:'Import/Export',
									onclick:function(event){
										wordreplace(event,'port')
									}
								}]
							],
							['div',{
								style:'float:right'
							},
								['input',{
									type:'button',
									value:'Save',
									onclick:function(event){
										wordreplace(event,'save')
									}
								}],
								['input',{
									type:'button',
									value:'Save and close',
									onclick:function(event){
										wordreplace(event,'save')
										document.getElementById('wr-body').click()
									}
								}]
							],
							['table',{
								style:'width:100%'
							},
								['tr',{
									style:'vertical-align:top'
								},
									['td',
										['textarea#input',{
											id:'wr-input',
											paceholder:'Test it here',
											style:'width:280px;height:50px'
										}]
									],
									['td',{
										style:'vertical-align:top;text-align:left'
									},
										['div',{
											id:'wr-output',
											style:'width:294px;word-wrap:break-word;overflow:hidden'
										}]
									]
								]
							]
						],
						['style','\
#wr-body input[type="text"],#wr-body .wr-replace{\
font:13px monospace;\
width:135px;\
}\
#wr-body .wr-board{\
width:60px!important;\
}\
#wr-body textarea.wr-replace{\
height:50px;\
resize:none!important;\
overflow:hidden;\
cursor:text;\
}\
#wr-body [error],#wr-body .js{\
vertical-align:top;\
}\
#wr-body [error]::after{\
content:attr(error);\
display:block;\
position:absolute;\
overflow:hidden;\
left:0;\
text-overflow:ellipsis;\
width:100%;\
white-space:nowrap;\
margin-top:25px;\
height:20px;\
font-size:12px;\
color:#d00\
}\
#wr-body [error] .wr-replace{\
margin-bottom:20px!important;\
}\
#wr-body .js[error]::after{\
margin-top:60px;\
}']
					]
				)
				menu.input.onkeydown=menu.input.onkeyup=menu.input.onchange=menu.input.onclick=function(event){
					wordreplace(event,'type')
				}
			}
			var list=document.getElementById('wr-list')
			var trs=list.getElementsByTagName('tr')
			if(action!='imported'){
				for(var i=0;i<wr_temp.length;i++){
					if(trs[i]){
						for(var j in order){
							var input=trs[i].getElementsByClassName('wr-'+j)[0]
							if(order[j]){
								wr_temp[i][j]=input.checked
							}else{
								wr_temp[i][j]=input.value
							}
						}
					}
				}
			}
			switch(action){
				case 'add':{
					wr_temp.push({on:1,caps:1})
					break
				}
				case 'up':{
					var id=event.target.parentNode.parentNode.id.match(/filter-(\d+)/)[1]*1
					if(id>0){
						var temp=wr_temp[id]
						wr_temp[id]=wr_temp[id-1]
						wr_temp[id-1]=temp
					}else{
						norefresh=1
					}
					break
				}
				case 'del':{
					var id=event.target.parentNode.parentNode.id.match(/filter-(\d+)/)[1]*1
					wr_temp.splice(id,1)
					break
				}
				case 'save':{
					for(var i=wr_temp.length;i--;){
						if(!wr_temp[i].pattern&&!wr_temp[i].replace){
							wr_temp.splice(i,1)
						}
					}
					wr_strings=wr_temp.slice()
					GM_setValue('wordreplace',JSON.stringify(wr_temp))
					norefresh=1
					break
				}
				case 'type':
				case 'imported':{
					var input=document.getElementById('wr-input').value
					input=input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/(&gt;&gt;\d+|&gt;&gt;&gt;\/\w+\/\d*)/g,'<a class="quotelink pointer">$1</a>').replace(/\n/g,'<br>').replace(/\[(\/)?spoiler\]/g,'<$1s>').replace(/^(&gt;[^\n]*)$/gm,'<span style="color:#789922">$1</span>')
					var output=document.getElementById('wr-output')
					output.innerHTML=input
					output.classList.remove('replacedtext')
					wordreplacing(output,1,wr_temp)
					if(action!='imported'&&!event.target.classList.contains('wr-js')){
						norefresh=1
					}
					break
				}
				case 'port':{
					var port=element(
						document.body,
						['div#panel',{
							class:'UIPanel',
							onclick:closepanel
						},
							['div',{
								class:'extPanel reply',
								style:'text-align:center'
							},
								['div',{
									class:'panelHeader'
								},
									'Import/Export patterns',
									['span',
										['img',{
											alt:'Close',
											title:'Close',
											class:'pointer',
											src:unsafeWindow.Main.icons.cross
										}]
									]
								],
								['textarea#txt',{
									style:'width:100%;height:100px;box-sizing:border-box',
									value:JSON.stringify(wr_temp)
								}],
								['div',{
									style:'float:left'
								},
								 	['input',{
										type:'button',
										value:'Save to file',
										onclick:function(){
											var txt=port.txt.value
											txt=btoa(encodeURIComponent(txt).replace(/%([0-9A-F]{2})/g,function(a,b){
												return String.fromCharCode('0x'+b)
											}))
											element(
												['a#link',{
													href:'data:application/json;base64,'+txt,
													download:'wordreplace.json'
												}]
											).link.click()
										}
									}],
									['input',{
										type:'button',
										value:'Load from file',
										onclick:function(){
											port.file.click()
										}
									}],
								],
								['div',{
									style:'float:right'
								},
									['input',{
										type:'button',
										value:'Replace all',
										onclick:function(event){
											var temp
											try{
												temp=fromimport(JSON.parse(port.txt.value))
											}catch(e){
												alert('This is not a valid JSON')
											}
											if(temp){
												wr_temp=temp
												wordreplace(event,'imported',1)
												port.panel.click()
											}
										}
									}],
									['input',{
										type:'button',
										value:'Import and append',
										onclick:function(event){
											var temp
											try{
												temp=fromimport(JSON.parse(port.txt.value))
											}catch(e){
												alert('This is not a valid JSON')
											}
											if(temp){
												wr_temp=wr_temp.concat(temp)
												wordreplace(event,'type',1)
												port.panel.click()
											}
										}
									}]
								],
								['form',
									['input#file',{
										type:'file',
										style:'display:none',								
										onchange:function(event){
											if(event.target.files.length){
												var reader=new FileReader()
												reader.onload=function(read){
													port.txt.value=read.target.result
													event.target.parentNode.reset()
												}
												reader.readAsText(event.target.files[0])
											}
										}
									}]
								]
							]
						]
					)
					norefresh=1
					break
				}
				case 'editjs':{
					var target=event.target
					var editor=element(
						document.body,
						['div',{
							class:'UIPanel',
							id:'wr-body',
							onclick:function(event){
								if(event.target.className=='UIPanel'||event.target.tagName=='IMG'){
									target.value=editor.txt.value
									closepanel(event)
									wordreplace(event,'type')
								}
							}
						},
							['div',{
								class:'extPanel reply',
								style:'width:600px;margin-left:-300px'
							},
								['div',{
									class:'panelHeader'
								},
									'Edit function',
									['span',
										['img',{
											alt:'Close',
											title:'Close',
											class:'pointer',
											src:unsafeWindow.Main.icons.cross
										}]
									]
								],
								['textarea#txt',{
									value:target.value,
									onkeydown:function(event){
										if(event.keyCode==9){ //Tab
											event.preventDefault()
											var input=event.target
											var start=input.selectionStart
											input.value=input.value.slice(0,start)+'\t'+input.value.slice(input.selectionEnd)
											input.setSelectionRange(start+1,start+1)
										}
									},
									style:'width:100%;height:500px;box-sizing:border-box;font:13px monospace'
								}]
							]
						]
					)
					editor.txt.setSelectionRange(0,0)
					norefresh=1
					break
				}
			}
			if(!norefresh){
				list.innerHTML=''
				if(!wr_temp.length){
					wr_temp=[{on:1,caps:1}]
				}
				for(var i in wr_temp){
					var table=element(
						list,
						['tr#tr',{
							id:'filter-'+i
						},
							['td',
								['span',{
									class:'pointer',
									onclick:function(event){
										wordreplace(event,'up')
									}
								},'\u2191']
							]
						]
					)
					for(var j in order){
						var tagname='input'
						var js=j=='replace'&&wr_temp[i].js
						if(js){
							tagname='textarea'
						}
						var td=element(
							table.tr,
							['td',
								[tagname+'#input',{
									class:'wr-'+j,
									onchange:function(event){
										wordreplace(event,'type')
									}
								}]
							]
						)
						if(order[j]){
							td.input.type='checkbox'
							if(j=='on'&&wr_temp[i][j]==undefined){
								td.input.checked=1
							}else{
								td.input.checked=wr_temp[i][j]
							}
						}else{
							if(js){
								table.tr.classList.add('js')
								td.input.readOnly=1
								td.input.onclick=function(event){
									wordreplace(event,'editjs')
								}
							}else{
								td.input.type='text'
							}
							td.input.value=wr_temp[i][j]||''
						}
					}
					element(
						table.tr,
						['td',
							['span',{
								class:'pointer',
								onclick:function(event){
									wordreplace(event,'del')
								}
							},'\xD7']
						]
					)
				}
			}
			for(var i in wr_temp){
				var errors=[]
				try{
					var a=RegExp(wr_temp[i].pattern)
				}catch(e){
					errors.push('Error in regex: '+e.message.replace(/.*:.*: /,''))
				}
				if(wr_temp[i].js){
					try{
						eval('!function(){'+wr_temp[i].replace+'}')
					}catch(e){
						errors.push('Error in function: '+e.message)
					}
				}
				if(errors.length){
					document.getElementById('filter-'+i).setAttribute('error',errors.join(' | '))
				}else{
					document.getElementById('filter-'+i).removeAttribute('error')
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
}
function fromimport(json){
	var order={on:1,pattern:0,case:1,replace:0,js:1,caps:1,mark:1,board:0}
	try{
		if(json.patterns){
			json=json.patterns
		}
		var temp=[]
		for(var i in json){
			temp[i]={}
			for(var j in order){
				if(json[i][j]==undefined){
					if(j=='on'||j=='caps'){
						temp[i][j]=1
					}else{
						if(order[j]){
							temp[i][j]=0
						}else{
							temp[i][j]=''
						}
					}
				}else{
					temp[i][j]=json[i][j]
				}
			}
		}
		return temp
	}catch(e){
		alert('This JSON cannot be imported because it is corrupt')
		console.log(e.message)
	}
}

//Word replace
function wordreplacing(post,main,strings){
	if(!post||!post.classList){
		return
	}
	if(post.classList.contains('replacedtext')){
		return
	}
	post.classList.add('replacedtext')
	if(main){
		var comments=[post]
	}else{
		var props=[]
		if(thesettings.wronlyin){
			if(thesettings.wrbody){
				props.push('blockquote')
			}
			if(thesettings.wrsubject){
				props.push('.subject')
			}
			if(thesettings.wrfilename){
				props.push('.fileText>a')
			}
			if(thesettings.wrposter){
				props.push('.nameBlock')
			}
		}else{
			props=['.nameBlock','.fileText>a','.subject','blockquote']
		}
		if(!props.length){
			return
		}
		var comments=post.querySelectorAll(props.join(','))
	}
	for(var i=0;i<comments.length;i++){
		var textnodes=[]
		var walk=document.createTreeWalker(comments[i],4,null,0)
		var newnode
		while(newnode=walk.nextNode()){
			textnodes.push(newnode)
		}
		for(var j in textnodes){
			var currentnode=textnodes[j]
			var out=teststring(currentnode.nodeValue.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),strings)
			if(out!=null){
				if(thesettings.wrtooltip||/[<>]/.test(out)){
					var newspan=element(
						['span#span',{
							innerHTML:out
						}]
					)
					if(thesettings.wrtooltip){
						newspan.span.title=currentnode.nodeValue
					}
					currentnode.parentNode.insertBefore(newspan.span,currentnode)
					currentnode.parentNode.removeChild(currentnode)
				}else{
					currentnode.nodeValue=out.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&')
				}
			}
		}
	}
}
function teststring(text,replaces){
	if(text.length){
		var oldtext=text
		if(replaces){
			var patterns=replaces
		}else{
			var patterns=wr_strings
		}
		for(var i in patterns){
			try{
				if(
					patterns[i].on&&
					patterns[i].pattern&&(
						!patterns[i].board||
						patterns[i].board.toLowerCase().replace(/[,;]/g,' ').replace(/[^a-z\d\s]/g,'').trim().split(/\s+/).indexOf(currentboard)+1
					)
				){
					var replacewith=patterns[i].replace+''
					if(patterns[i].js){
						replacewith=function(){
							return eval('(function(){'+patterns[i].replace+'}).apply(undefined,arguments)')
						}
					}else if(patterns[i].mark){
						replacewith='<span class="highlighttext">'+(replacewith||'$&')+'</span>'
					}
					if(patterns[i].caps){
						var replacestring=replacewith
						replacewith=function(){
							if(patterns[i].js){
								var returned=replacestring.apply(undefined,arguments)
								var s=[returned,arguments[0]]
							}else{
								var args=arguments
								var s=[replacestring,args[0]]
								s[0]=s[0].replace(/\$&/g,'$$0').replace(/\$(\d+)/g,function(){
									var num=arguments[1]*1
									return args[num]||''
								})
							}
							var al=s[0].length
							var bl=s[1].length
							if(al>bl){
								var l=bl
							}else{
								var l=al
							}
							if(l<2){
								return s[0]
							}
							s=s.map(function(a){
								return [a.slice(0,l-l/2),a.slice(l-l/2,-l/2),a.slice(-l/2)]
							})
							for(var j=0;j<3;j+=2){
								s[0][j]=s[0][j].toLowerCase().split('')
								for(var k=0;k<s[0][j].length;k++){
									var c=s[1][j][k]
									if(c==c.toUpperCase()&&c!=c.toLowerCase()){
										s[0][j][k]=s[0][j][k].toUpperCase()
									}
								}
								s[0][j]=s[0][j].join('')
							}
							if(s[0][1]){
								var u=0
								if(s[1][1]){
									var c=s[1][1]
									if(c==c.toUpperCase()&&c!=c.toLowerCase()){
										u=2
									}
								}else{
									var c=s[1][0][(l/2|0)-1]
									if(c==c.toUpperCase()){
										u++
									}
									var c=s[1][2][0]
									if(c==c.toUpperCase()){
										u++
									}
								}
								if(u==2){
									s[0][1]=s[0][1].toUpperCase()
								}
							}
							return s[0].join('')
						}
					}else if(!patterns[i].js){
						replacewith=replacewith.replace(/\$0/g,'$$&')
					}
					var ig=patterns[i].case?'g':'ig'
					text=text.replace(new RegExp(patterns[i].pattern,ig),replacewith)
				}
			}catch(e){
				if(!replaces){
					wr_strings[i].on=0
				}
				console.error('Error in regex: '+patterns[i].pattern,',',e.message)
			}
		}
		if(oldtext!=text){
			return text
		}else{
			return null
		}
	}else{
		return null
	}
}

if(document.getElementsByTagName('meta').length){
	//Get settings
	var thesettings=localStorage['4chan-settings']
	var thedefault='wordreplace wronlyin wrbody wrsubject wrfilename wrtitle wrremwbr'.split(' ')
	if(thesettings){
		thesettings=JSON.parse(thesettings)
		var changed=0
		for(var i in thedefault){
			if(thesettings[thedefault[i]]==undefined){
				thesettings[thedefault[i]]=true
				changed=1
			}
		}
		if(changed){
			localStorage['4chan-settings']=JSON.stringify(thesettings)
		}
	}else{
		thesettings={}
		var gmsetting=GM_getValue('wordreplace')
		if(gmsetting){
			thesettings.wordreplace=gmsetting=='true'?1:0
		}
	}
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
	//Retrieve pattern list
	var wr_strings=GM_getValue('wordreplace')
	if(wr_strings){
		wr_strings=JSON.parse(wr_strings)
	}else{
		wr_strings=[
			{
				on:1,
				pattern:'newfag',
				case:0,
				replace:'newfig',
				js:0,
				caps:1,
				mark:0,
				board:'s4s'
			},
			{
				on:1,
				pattern:'shitpost',
				case:0,
				replace:'funpost',
				js:0,
				caps:1,
				mark:0,
				board:'s4s'
			}
		]
	}
	var wr_temp
	if(thesettings.wordreplace&&(thesettings.wrtitle||!thesettings.wronlyin)){
		var newtitle=teststring(document.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'))
		if(newtitle!=null){
			document.title=newtitle.replace(/[\r\n]/g,'').replace(/<[^>]*>/g,'').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&')
		}
	}
	if(activepage=='index'||activepage=='thread'){
		if(thesettings.wordreplace){
			updateposts()
			document.addEventListener('4chanParsingDone',updateposts)
		}
		if(unsafeWindow.Main){
			updatesettings()
		}else{
			document.addEventListener('4chanMainInit',updatesettings)
		}
	}
	if(activepage=='catalog'&&thesettings.wordreplace){
		for(var i in unsafeWindow.catalog.threads){
			var props=[]
			if(thesettings.wronlyin){
				if(thesettings.wrbody){
					props.push('teaser')
				}
				if(thesettings.wrsubject){
					props.push('sub')
				}
				if(thesettings.wrfilename){
					props.push('file')
				}
				if(thesettings.wrposter){
					props.push('author')
				}
			}else{
				props=['author','file','sub','teaser']
			}
			props.forEach(function(prop){
				var out=teststring(unsafeWindow.catalog.threads[i][prop])
				if(out!=null){
					unsafeWindow.catalog.threads[i][prop]=out
				}
				if(prop=='author'&&unsafeWindow.catalog.threads[i].lr.author){
					var out=teststring(unsafeWindow.catalog.threads[i].lr.author)
					if(out!=null){
						unsafeWindow.catalog.threads[i].lr.author=out
					}
				}
			})
		}
		document.getElementById('size-ctrl').dispatchEvent(new Event('change'))
	}
}
