// ==UserScript==
// @name Get Watcher
// @namespace getwatcher
// @version 2016.10.04
// @description Estimates time until the next get on 4chan
// @match http://boards.4chan.org/*
// @match https://boards.4chan.org/*
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @connect a.4cdn.org
// @icon data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTAgMzJIMTIuMkwxMS42IDMwLjMgMTMuMiAyMCA0LjYgMTYuMSAwIDIwLjciIGZpbGw9IiM3NmUiLz48cGF0aCBkPSJNNC42IDE2LjFDNC43IDE1LjcgNS42IDE0LjQgNS44IDExLjUgNS45IDEwLjEgNy4zIDkuMiA3LjggOCA4LjUgNi40IDguNCA0LjYgOC45IDIuOSA5LjIgMS45IDkgLjEgMTAuMSAwIDExLjctLjEgMTIuMyAyLjcgMTIuNSA0LjMgMTIuOCA2LjEgMTEuNiA3LjggMTEuMyA5LjVjLS4zIDEuNSAuMyAxLjkgMS40IDEuNCAyLjMtMS4yIDQuNC0xLjggNi4yLTMuMSAyLjctMS43IDQuOS00LjEgNy44LTUuNSAxLjYtLjggNC4xLTMgNS4xLTEuNSAxLjMgMi4xLTMuMiAzLjgtNC45IDUuNS0xLjcgMS43LTUuNiAzLjYtNS4xIDQuOCAuMyAuNyAxIDEuMyAxLjMgMi4xIC4zIDEgLjEgMi4xIC4zIDMuMSAuMiAxIDEgMS44IC45IDIuOC0uMSAyLjEtMS4yIDQuMy0yLjUgNS45LTEgMS4yLTIuMyAyLjQtMy44IDIuNi0yIC4yLTUuOSAyLjUtNi40IDIuN0MxMC4zIDI2LjkgOC40IDIyLjMgNy44IDIxIDcgMTkuNCA1LjYgMTcuNSA0LjYgMTYuMSIgZmlsbD0iI2NiZSIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/16671/Get%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/16671/Get%20Watcher.meta.js
// ==/UserScript==
//<!doctype html><html><head><meta http-equiv="x-ua-compatible" content="ie=edge"></head><body id="hta"><script>
'use strict';

var version='2016.10.04'

var boards='3 a aco adv an asp b biz c cgl ck cm co d diy e f fa fit g gd gif \
h hc his hm hr i ic int jp k lgbt lit m mlp mu n news o out p po pol qa qst \
r r9k s s4s sci soc sp t tg toy trash trv tv u v vg vip vp vr w wg wsg wsr x y'.split(' ')

function noDubsBoard(board){
	return /^(v|vg|vr)$/.test(board)
}

function fastBoard(board){
	return /^(f)$/.test(board)
}

function boardTitle(board){
	return board=='s4s'?'[s4s]':'/'+board+'/'
}

if(document.body.id=='hta'){
	var zoom=screen.deviceXDPI/96
	resizeTo(700*zoom,420*zoom)
	var info=document.body.firstChild
	document.body.removeChild(info)
	var hta=1
	var boardName='s4s'
	var protocol='http:'
	document.title='Get Watcher'
	oncontextmenu=function(event){
		event.preventDefault()
	}
	window.GM_xmlhttpRequest=function(opts){
		var xhr=new XMLHttpRequest()
		xhr.onload=function(){
			opts.onload({
				responseText:xhr.responseText,
				status:xhr.status,
				responseHeaders:xhr.getAllResponseHeaders()
			})
		}
		xhr.onerror=function(){
			opts.onerror()
		}
		xhr.open(opts.method,opts.url)
		for(var i in opts.headers){
			xhr.setRequestHeader(i,opts.headers[i])
		}
		xhr.send()
	}
}else{
	var zoom=1
	var hta=0
	var lp=location.pathname
	var boardName='s4s'
	var lpmatch=lp.match(/\/([^\/]+)\//)
	if(lpmatch&&(boards.indexOf(lpmatch[1])+1)){
		var boardName=lpmatch[1]
	}
	var protocol=location.protocol
}

var website='greasyfork.org'
var userjsurl=protocol+'//greasyfork.org/scripts/16671-get-watcher/code/Get%20Watcher.user.js'
var metajsurl=protocol+'//greasyfork.org/scripts/16671-get-watcher/code/Get%20Watcher.meta.js'

var verage=toRelativeTime((new Date().getTime()-new Date(version.replace(/\./g,'/')).getTime())/1000,0,1)
var delayValue=[1,5,30]

var localElements={}

var includedCss='#getWatcherBody{background:#fff;z-index:2;color:#000;font:14px sans-serif;margin:0;cursor:default;text-align:left}\
input[type="text"],input[type="number"]{font-size:14px}\
#windowTitle{height:25px;background:#bbb;padding:5px 0 0 5px;color:#555;cursor:default;box-sizing:border-box}\
#windowClose{background:#d77;width:19px;height:19px;position:absolute;top:3px;right:3px}\
#getWatcherBody a{font-weight:bold;color:#00f;text-decoration:none}\
#getWatcherBody a:hover{text-decoration:underline}\
.board-menu{position:absolute;background:#fff;border:1px solid #7f9db9;z-index:2}\
.board-menu div{float:left;width:40px;padding:1px 3px;white-space:nowrap;overflow:hidden}\
#tab1-board-menu div:hover,#tab3-board-menu div:hover,.board-menu .selected{background:#39f;color:#fff}\
.board-menu br{clear:left}\
#board-menu-bg{position:absolute;top:0;bottom:0;left:0;right:0}\
.board-menu .tab2-long-option{width:132px;text-align:center}\
.board-menu input{width:46px;height:100%;box-sizing:border-box;margin:0!important;padding:0 1px!important}\
#getWatcherBody label{display:block;margin:15px 0}\
#getWatcherBody .left-side{float:left;background:#eee;border-right:1px solid #999;padding:20px;width:140px;height:100%}\
#getWatcherBody .left-side input[type="checkbox"],.left-side input[type="text"],.left-side input[type="number"],.left-side select{margin:0 7px}\
#getWatcherBody .center{text-align:center}\
#tab1,#tab2,#tab3,#tab4,#tab5{overflow:hidden;box-sizing:border-box}\
#tab1-delay,#tab2-delay,#tab3-delay{width:50px}\
#tab1-digits,#tab1-custompost,#tab2-board,#tab2-digits,#tab3-custompost{width:90%;box-sizing:border-box}\
.tab1-customshown{margin-bottom:0!important}\
#tab1-customlabel{margin-top:0!important}\
#tab1 input[type="button"],#tab2 input[type="button"],#tab3 input[type="button"]{width:120px;height:30px;font-size:14px}\
#tabs{white-space:nowrap}\
#tabs>div{display:inline-block;width:25%;text-align:center;border-bottom:1px solid #999;height:50px;line-height:50px;background:#eee;box-sizing:border-box}\
#tabs>div:hover{background:#ddd}\
#tabs>.tab-selected{background:#ccc!important}\
#tab1-content,#tab3-content,#tab4{padding:10px}\
#tab1-content,#tab2-content,#tab3-content,#tab4{overflow:auto;height:100%;box-sizing:border-box}\
#tab1-highlighted,#tab3-highlighted{width:100%;background:#eee;border-bottom:1px solid #999;text-align:center;padding:15px;font-size:20px}\
#tab1-board,#tab3-board{width:70px}\
.board-title{font-size:30px;padding-bottom:10px}\
#tab2-content table{border-collapse:collapse;width:100%}\
#tab2-content th,#tab2-content tr:hover{background:#ddd!important}\
#tab2-content td,#tab2-content th{padding:3px;cursor:pointer}\
#tab2-content td:first-child{text-align:center}\
#tab2-content td:nth-child(2),#tab2-content td:nth-child(3){text-align:right}\
#tab2-content th.sortup,#tab2-content th.sortdown{background:#ddd}\
#tab2-content th.sortup::after{content:\'\u25BC\';color:#aaa}\
#tab2-content th.sortdown::after{content:\'\u25B2\';color:#aaa}\
#tab2-content tr:nth-child(2n+1){background:#f5f5f5}\
#tab3-progress{position:absolute;bottom:0;height:10px}\
#tab5{padding-top:80px}\
#tab5-save,#tab5-load{width:60%;height:60px;display:block;margin:0 auto 50px auto;font-size:25px}\
#saveload-input{display:none;width:1px;height:1px;background:none;border:0}'
var windowTitle=[]
if(hta){
	includedCss+='html,#getWatcherBody{height:100%}\
body{margin:0;width:'+100/zoom+'%;height:'+100/zoom+'%}\
body,.board-menu{zoom:'+zoom+'}\
input[type="button"]{border:1px solid #adadad;background:#e1e1e1}\
input[type="button"]:hover{border-color:#0078d7;background:#e5f1fb}\
input[type="button"]:active{border-color:#005499;background:#cce4f7}\
input[type="text"]{border:1px solid #abadb3;font-size:inherit;margin:2px 0;padding:2px}\
input[type="text"]:focus{border-color:#55a2d8}\
select{font-size:14px;border:1px solid #abadb3}\
#tab1,#tab2,#tab3,#tab4,#tab5{height:calc(100% - 50px);box-sizing:border-box}\
#tab3-progress{width:calc(100% - 181px * '+zoom+');border:0;background:#fff;right:0}'
}else{
	includedCss+='#getWatcherBody{position:fixed;border:1px solid #333;width:700px;height:400px}\
#tab3-progress{width:calc(100% - 194px);right:13px}\
#windowResize{position:absolute;bottom:0;right:0;background:url(data:image/gif;base64,R0lGODlhCwALAPMIAJaWlq2srLm5ucXFxdHR0d3d3ejn5/Hx8f///wAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAUAAAkALAAAAAALAAsAAAQhMMkpkRmUHhLyLALgjdWVWNi0dSsFii85oaeJtjgX72EEADs=) no-repeat;cursor:se-resize;width:13px;height:13px}\
#tab1,#tab2,#tab3,#tab4,#tab5{height:calc(100% - 75px)}\
#getWatcherBody .tab-selected{font-weight:normal!important}'
	windowTitle=[
		['div',{
			id:'windowTitle',
			onmousedown:function(){
				move=1
				moveHandler(event)
			}
		},'Get Watcher'],
		['div',{
			id:'windowClose',
			onclick:function(){
				getWatcherBody.style.display='none'
			}
		}],
		['div',{
			id:'windowResize',
			onmousedown:function(){
				resize=1
				moveHandler(event)
			}
		}]
	]
}

element(
	document.body,
	['div',{
		id:'getWatcherBody',
		style:'display:none'
	},
		windowTitle[0],
		windowTitle[1],
		windowTitle[2],
		['div',{
			id:'board-menu-bg',
			style:'display:none',
			onmousedown:function(){
				id('board-menu-bg').style.display=
				id('tab1-board-menu').style.display=
				id('tab2-board-menu').style.display=
				id('tab3-board-menu').style.display='none'
			}
		}],
		['div',{
			id:'tabs'
		},
			['div',{
				id:'tab1-button',
				class:'tab-selected',
				onclick:function(){
					changeTab(1)
				}
			},'One board'],
			['div',{
				id:'tab2-button',
				onclick:function(){
					changeTab(2)
				}
			},'Multiple boards'],
			['div',{
				id:'tab3-button',
				onclick:function(){
					changeTab(3)
				}
			},'Loop'],
			['div',{
				id:'tab4-button',
				onclick:function(){
					changeTab(4)
				}
			},'Help'],
			['div',{
				id:'tab5-button',
				style:'display:none'
			}]
		],
		['div',{
			id:'tab1'
		},
			['div',{
				class:'left-side'
			},
				['label',{
					style:'display:inline'
				},
					'Board:',
					['select',{
						id:'tab1-board',
						onmousedown:function(){
							showChooseBoard(1)
						}
					},
						['option',{
							value:boardName
						},boardTitle(boardName)]
					]
				],
				['div',{
					id:'tab1-board-menu',
					class:'board-menu',
					style:'display:none'
				}],
				['label',{
						id:'tab1-digitslabel'
					},
					['select',{
						id:'tab1-digits'
					},
						['option',{
							value:2
						},'Dubs (2)'],
						['option',{
							value:3
						},'Trips (3)'],
						['option',{
							value:4
						},'Quads (4)'],
						['option',{
							value:5,
							selected:1
						},'Quints (5)'],
						['option',{
							value:6
						},'Sexts (6)'],
						['option',{
							value:7
						},'Septs (7)'],
						['option',{
							value:8
						},'Octs (8)'],
						['option',{
							value:9
						},'Nons (9)'],
						['option',{
							value:0
						},'Custom post']
					]
				],
				['label',{
					id:'tab1-customlabel',
						style:'display:none'
				},
					['input',{
						id:'tab1-custompost',
						type:'text',
						maxlength:15,
						onkeydown:changeCustom,
						onkeyup:changeCustom
					}]
				],
				['label',{
					class:'tab1-notcustom',
				},
					['input',{
						id:'tab1-clear',
						type:'checkbox'
					}],
					'Clear'
				],
				['label',{
					class:'tab1-notcustom',
				},
					['input',{
						id:'tab1-palindrome',
						type:'checkbox'
					}],
					'Palindrome'
				],
				['label',
					'Delay:',
					['input',{
						id:'tab1-delay',
						type:'text',
						value:delayValue[0],
						min:1,
						max:99,
						maxlength:2
					}]
				],
				['label',
					['input',{
						id:'tab1-fast',
						type:'checkbox'
					}],
					'Fast check'
				],
				['label',{
					class:'center'
				},
					['input',{
						id:'tab1-check',
						type:'button',
						value:'Check',
						onclick:oneBoard
					}]
				],
				['label',{
					class:'center'
				},
					['input',{
						type:'button',
						value:'Save/Load',
						onclick:function(){
							saveLoadTab(1)
						}
					}]
				]
			],
			['div',{
				id:'tab1-highlighted',
				style:'display:none'
			}],
			['div',{
				id:'tab1-content'
			}]
		],
		['div',{
			id:'tab2',
			style:'display:none'
		},
			['div',{
				class:'left-side'
			},
				['label',{
					style:'display:inline'
				},
					['select',{
						id:'tab2-board',
						onmousedown:function(){
							showChooseBoard(2)
						}
					},
						['option','Boards...']
					]
				],
				['div',{
					id:'tab2-board-menu',
					class:'board-menu',
					style:'display:none'
				}],
				['label',
					['select',{
						id:'tab2-digits'
					},
						['option',{
							value:2
						},'Dubs (2)'],
						['option',{
							value:3
						},'Trips (3)'],
						['option',{
							value:4
						},'Quads (4)'],
						['option',{
							value:5,
							selected:1
						},'Quints (5)'],
						['option',{
							value:6
						},'Sexts (6)'],
						['option',{
							value:7
						},'Septs (7)'],
						['option',{
							value:8
						},'Octs (8)'],
						['option',{
							value:9
						},'Nons (9)']
					]
				],
				['label',
					['input',{
						id:'tab2-clear',
						type:'checkbox'
					}],
					'Clear'
				],
				['label',
					['input',{
						id:'tab2-palindrome',
						type:'checkbox'
					}],
					'Palindrome'
				],
				['label',
					'Delay:',
					['input',{
						id:'tab2-delay',
						type:'text',
						value:delayValue[1],
						min:1,
						max:99,
						maxlength:2
					}]
				],
				['label',
					['input',{
						id:'tab2-fast',
						type:'checkbox',
						checked:1
					}],
					'Fast check'
				],
				['label',{
					class:'center'
				},
					['input',{
						id:'tab2-check',
						type:'button',
						value:'Check',
						onclick:multipleBoards
					}]
				],
				['label',{
					class:'center'
				},
					['input',{
						type:'button',
						value:'Save/Load',
						onclick:function(){
							saveLoadTab(2)
						}
					}]
				]
			],
			['div',{
				id:'tab2-content'
			}]
		],
		['div',{
			id:'tab3',
			style:'display:none'
		},
			['div',{
				class:'left-side'
			},
				['label',{
					style:'display:inline'
				},
					'Board:',
					['select',{
						id:'tab3-board',
						onmousedown:function(){
							showChooseBoard(3)
						}
					},
						['option',{
							value:boardName
						},boardTitle(boardName)]
					]
				],
				['div',{
					id:'tab3-board-menu',
					class:'board-menu',
					style:'display:none'
				}],
				['label',
					'Post number:',
					['input',{
						id:'tab3-custompost',
						type:'text',
						maxlength:15,
						onkeydown:changeCustom,
						onkeyup:changeCustom
					}]
				],
				['label',
					'Delay:',
					['input',{
						type:'text',
						value:delayValue[2],
						min:1,
						max:99,
						maxlength:2,
						id:'tab3-delay'
					}]
				],
				['label',{
					class:'center'
				},
					['input',{
						id:'tab3-check',
						type:'button',
						value:'Check',
						onclick:loopBoard
					}]
				]
			],
			['div',{
				id:'tab3-highlighted',
				style:'display:none'
			}],
			['div',{
				id:'tab3-content'
			}],
			['progress',{
				value:0,
				id:'tab3-progress'
			}]
		],
		['div',{
			id:'tab4',
			style:'display:none'
		},
			['div',{
				class:'center'
			},
				['h3',
					'Get Watcher'
				],
				'(',
				['a',{
					onclick:updateScript,
					style:'color:#00f;cursor:pointer'
				},'Version '+version],
				', '+verage+' ago)',
				['br'],
				['br']
			],
			'Get Watcher uses 4chan API to predict the time until the next get. You can choose between three options: One board, Multiple boards, and Loop. Get Watcher is open source and is released under public domain.',
			['br'],
			['br'],
			['b','One board'],
			': Get stats from only one board, like time until next get, posts per second, etc.',
			['br'],
			['br'],
			['b','Multiple boards'],
			': It lists every board\'s stats in a table that you can sort. The table\'s contents are: the board, next get, time until that next get, and how many posts are left until it. To sort the list, click on one of the headers.',
			['br'],
			['br'],
			['b','Loop'],
			': Constantly checks the first page for latest post and posts per second value until stopped.',
			['br'],
			['br'],
			['b','Board'],
			': The board you want to get stats from.',
			['br'],
			['br'],
			['b','Digits dropdown'],
			': Recurring digits at the end of a post number.',
			['br'],
			'Example: 123444 has three recurring numbers at the end, 133333 has five.',
			['br'],
			['br'],
			['b','Clear'],
			': Last digits to be always zero, locked on for boards that don\'t have dubs (/b/, /v/, /vg/, /vr/).',
			['br'],
			'Example: 130000.',
			['br'],
			['br'],
			['b','Palindrome'],
			': Post IDs that read the same forwards and backwards.',
			['br'],
			'Example: 123321, 4132314.',
			['br'],
			['br'],
			['b','Delay'],
			': How much delay in seconds there should be between calls to 4chan API, the documentation suggests no less than 10 seconds. With each call Get Watcher downloads about 25-30KB of JSON data.',
			['br'],
			['br'],
			['b','Fast check'],
			': Instead of making two calls for both the first post and for an old post from page 10, it makes only one. Has different results, recommended on for multiple boards.'
		],
		['div',{
			id:'tab5',
			style:'display:none'
		},
			['input',{
				type:'button',
				id:'tab5-save',
				value:'Save',
				onclick:saveToFile
			}],
			['input',{
				id:'tab5-load',
				type:'button',
				value:'Load',
				onclick:function(){
					id('saveload-input').style.display='block'
					id('saveload-input').click()
					id('saveload-input').style.display='none'
				}
			}],
			['form',{
				id:'saveload-form'
			},
				['input',{
					id:'saveload-input',
					type:'file',
					onchange:loadFromFile
				}]
			]
		],
		['style',includedCss]
	]
)

var initializeCompleted=0
if(hta){
	initialize()
}else{
	element(
		document.body,
		['input',{
			id:'open-get-watcher',
			type:'button',
			value:'Open Get Watcher',
			style:'position:absolute;top:100px;left:10px',
			onclick:initialize
		}]
	)
}

var oneBoardCache={}
var multipleBoardsCache={}
var loopCache={}
var sortCache=[2,0]
var saveloadFromTab=1
var multipleCurrentBoards=[]
var currentBoards=[]
var boardIndex=0
var move=0
var resize=0
var tab2BoardOptions
var oneBoardTimer
var multipleBoardsTimer
var loopBoardTimer
var mouseXlast=null
var mouseYlast=null

var getWatcherBody

function initialize(){
	getWatcherBody=id('getWatcherBody')
	if(!hta){
		getWatcherBody.style.top='100px'
		getWatcherBody.style.left='100px'
	}
	getWatcherBody.style.display='block'
	if(!initializeCompleted){
		initializeCompleted=1
		
		for(var i=1;i<4;i++){
			changeTab(i)
			id('tab'+i+'-board-menu').style.top=(id('tab'+i+'-board').offsetTop+id('tab'+i+'-board').offsetHeight-1)*zoom+'px'
			id('tab'+i+'-board-menu').style.left=id('tab'+i+'-board').offsetLeft*zoom+'px'
		}
		changeTab(1)
		
		var tab1Elements=document.querySelectorAll('#tab1 [id^="tab1-"]')
		for(var i=0;i<tab1Elements.length;i++){
			tab1Elements[i].onchange=tab1Changed
		}
		var tab2Elements=document.querySelectorAll('#tab2 [id^="tab2-"]')
		for(var i=0;i<tab2Elements.length;i++){
			tab2Elements[i].onchange=tab2Changed
		}
		
		id('tab1-custompost').addEventListener('focus',focusCustom)
		id('tab3-custompost').addEventListener('focus',focusCustom)
		id('tab1-custompost').addEventListener('blur',changeCustom)
		id('tab3-custompost').addEventListener('blur',changeCustom)
		
		var boardList=[]
		for(var i=0;i<boards.length;i++){
			if(i&&i%6==0){
				boardList.push(['br'])
			}
			boardList.push(
				['div',{
					board:boards[i]
				},boardTitle(boards[i])]
			)
		}
		element(
			id('tab1-board-menu'),
			boardList,
			i%6==0?['br']:null,
			['div',{
				onclick:plusBoard
			},'+'],
			id('tab3-board-menu'),
			boardList,
			i%6==0?['br']:null,
			['div',{
				onclick:plusBoard
			},'+'],
			id('tab2-board-menu'),
			boardList,
			['br'],
			['div',{
				class:'tab2-long-option',
				onclick:function(){
					tab2SelectAllBoards()
				}
			},'Select all'],
			['div',{
				class:'tab2-long-option',
				onclick:function(){
					tab2SelectAllBoards(1)
				}
			},'Unselect all']
		)
		
		var tab1BoardOptions=document.querySelectorAll('#tab1-board-menu div')
		tab2BoardOptions=document.querySelectorAll('#tab2-board-menu div:not(.tab2-long-option)')
		var tab3BoardOptions=document.querySelectorAll('#tab3-board-menu div')
		for(var i=0;i<tab2BoardOptions.length;i++){
			if(tab1BoardOptions[i].getAttribute('board')==boardName){
				tab1BoardOptions[i].classList.add('selected')
				tab3BoardOptions[i].classList.add('selected')
			}
			tab2BoardOptions[i].classList.add('selected')
			tab1BoardOptions[i].onclick=tab1or3ChooseBoard
			tab2BoardOptions[i].onclick=tab2ChooseBoard
			tab3BoardOptions[i].onclick=tab1or3ChooseBoard
		}
		
		id('tab1-digits').addEventListener('change',function(event){
			if(event.currentTarget.value*1){
				id('tab1-customlabel').style.display='none'
				id('tab1-digitslabel').classList.remove('tab1-customshown')
			}else{
				id('tab1-customlabel').style.display='block'
				id('tab1-digitslabel').classList.add('tab1-customshown')
			}
			var notcustom=document.getElementsByClassName('tab1-notcustom')
			for(var i=0;i<notcustom.length;i++){
				notcustom[i].style.display=event.currentTarget.value*1?'block':'none'
			}
		})
		
		for(var i=1;i<4;i++){
			id('tab'+i+'-delay').addEventListener('change',changeDelay)
			id('tab'+i+'-delay').addEventListener('blur',changeDelay)
			id('tab'+i+'-delay').onkeydown=changeDelay
			id('tab'+i+'-delay').onkeyup=changeDelay
		}
		
		if(!hta){
			addEventListener('mousemove',moveHandler)
			addEventListener('mouseup',function(){
				move=0
				resize=0
				mouseXlast=null
				mouseYlast=null
			})
		}
	}
}

function id(a){
	return localElements[a]
}

function toRelativeTime(difference,originaldate,mode){
	var timd=Math.abs(difference)
	if(mode>1&&timd<10){
		var sec=(timd%60*10|0)/10
	}else{
		var sec=timd%60|0
	}
	timd/=60
	var min=timd%60|0
	timd/=60
	var hrs=timd%24|0
	timd/=24
	var day=timd%30.4375|0
	timd/=30.4375
	var mon=timd%12|0
	var yer=Math.floor(timd/12)
	if(mode==1){
		var till=[
		yer?yer+' year'+(yer>1?'s ':' '):'',
		mon&&yer<2?mon+' month'+(mon>1?'s ':' '):'',
		(day&&mon<2)||!mon?day+' day'+(day==1?'':'s'):''
		]
	}else if(mode==3){
		var till=[
			yer?formatNumber(yer)+'y':'',
			mon&&yer<2?mon+'mo':'',
			day&&mon<2?day+'d':'',
			hrs&&day<2?hrs+'h':'',
			min&&hrs<3?min+'m':'',
			(sec&&min<10)||!min?sec+'s':''
		]
	}else{
		var till=[
			yer?formatNumber(yer)+'\xA0year'+(yer>1?'s ':' '):'',
			mon&&yer<2?mon+'\xA0month'+(mon>1?'s ':' '):'',
			day&&mon<2?day+'\xA0day'+(day>1?'s ':' '):'',
			hrs&&day<2?hrs+'\xA0hour'+(hrs>1?'s ':' '):'',
			min&&hrs<3?min+'\xA0minute'+(min>1?'s ':' '):'',
			(sec&&min<10)||!min?sec+'\xA0second'+(sec==1?'':'s'):''
		]
	}
	for(var g=0;g<till.length&&!till[g];g++){}
	if(mode==3){
		var tout=till[g]+(till[g+1]||'')
	}else{
		var tout=(till[g]+(till[g+1]?'and '+till[g+1]:'')).trim()
	}
	if(originaldate){
		var newdt=new Date((originaldate*1+difference*1)*1000)
		if(newdt*1){
			try{
				var parseddate=newdt.toLocaleTimeString()+' ('+newdt.toDateString()+')'
			}catch(e){
				var parseddate=newdt
			}
		}else{
			var parseddate='Year\xA0'+formatNumber(new Date(originaldate*1000).getFullYear()+yer)
		}
		return [tout,parseddate]
	}else{
		return tout
	}
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
									if(value=='id'){
										localElements[current[j][value]]=lasttag
									}
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

function formatNumber(num){
	num=num+''
	while(/\d{4}/.test(num)){
		num=num.replace(/\d+(?=\d{3})/,'$&\u202F')
	}
	return num
}

function changeTab(tabN){
	var tabselected=document.getElementsByClassName('tab-selected')[0]
	if(tabselected){
		tabselected.classList.remove('tab-selected')
	}
	var tabs=id('tabs').childNodes
	for(var i=0;i<tabs.length;i++){
		id('tab'+(i+1)).style.display='none'
	}
	tabs[tabN-1].classList.add('tab-selected')
	id('tab'+tabN).style.display='block'
}

function tab2SelectAllBoards(unselect){
	for(var i=0;i<tab2BoardOptions.length;i++){
		if(unselect){
			tab2BoardOptions[i].className=''
		}else{
			tab2BoardOptions[i].className='selected'
		}
	}
}

function showChooseBoard(tabNumber){
	var boardMenu=id('tab'+tabNumber+'-board-menu')
	id('board-menu-bg').style.display=boardMenu.style.display='block'
	
	setTimeout(function(){
		id('tab'+tabNumber+'-board').blur()
	},10)
}

function tab1or3ChooseBoard(event,target){
	if(!target){
		target=event.currentTarget
	}
	var boardSelect=target.parentNode.parentNode
	var boardMenu=boardSelect.getElementsByClassName('board-menu')[0]
	var optionElement=boardSelect.getElementsByTagName('option')[0]
	var selected=boardMenu.getElementsByClassName('selected')[0]
	if(selected){
		selected.classList.remove('selected')
	}
	boardMenu.style.display=id('board-menu-bg').style.display='none'
	target.classList.add('selected')
	optionElement.value=target.getAttribute('board')
	optionElement.innerHTML=target.innerHTML
}

function tab2ChooseBoard(event){
	var sourceElement=event.currentTarget
	if(sourceElement.className){
		sourceElement.className=''
	}else{
		sourceElement.className='selected'
	}
}

function oneBoard(){
	var checkButton=id('tab1-check')
	if(checkButton.value=='Check'){
		var currentBoard=id('tab1-board').value
		oneBoardCache={
			currentBoard:currentBoard
		}
		getLastPost(currentBoard,oneBoard2)
	}else{
		clearTimeout(oneBoardTimer)
		checkButton.value='Check'
	}
}

function oneBoard2(lastStats){
	var checkButton=id('tab1-check')
	var currentBoard=oneBoardCache.currentBoard
	if(lastStats.post){
		oneBoardCache={
			currentBoard:currentBoard,
			lastStats:lastStats
		}
		if(!id('tab1-fast').checked&&!fastBoard(currentBoard)){
			checkButton.value='Stop'
			oneBoardTimer=setTimeout(function(){
				getOldPost(currentBoard,0,oneBoard3)
			},delayValue[0]*1000)
		}
	}else{
		oneBoardCache={}
	}
	tab1Changed()
}

function oneBoard3(oldStats){
	if(oldStats.post){
		oneBoardCache.oldStats=oldStats
		tab1Changed()
	}
	id('tab1-check').value='Check'
}

function multipleBoards(){
	var checkButton=id('tab2-check')
	if(checkButton.value=='Check'){
		currentBoards=id('tab2-board-menu').getElementsByClassName('selected')
		if(currentBoards.length){
			checkButton.value='Stop'
			multipleBoardsCache={}
			boardIndex=0
			multipleCurrentBoards=[]
			for(var i=0;i<currentBoards.length;i++){
				multipleCurrentBoards[i]=currentBoards[i].getAttribute('board')
			}
			multipleBoardsLoop()
		}
	}else{
		clearTimeout(multipleBoardsTimer)
		checkButton.value='Check'
	}
}

function loopBoard(){
	var checkButton=id('tab3-check')
	if(checkButton.value=='Check'){
		checkButton.value='Stop'
		var currentBoard=id('tab3-board').value
		loopBoardLoop(currentBoard)
	}else{
		clearTimeout(loopBoardTimer)
		id('tab3-progress').value=0
		checkButton.value='Check'
	}
}

function tab1Changed(){
	id('tab1-highlighted').innerHTML=id('tab1-content').innerHTML=''
	var lastStats=oneBoardCache.lastStats
	if(lastStats){
		id('tab1-custompost').placeholder=lastStats.post
		if(oneBoardCache.oldStats){
			var oldStats=oneBoardCache.oldStats
		}else{
			var oldStats=getOldPost(0,lastStats.cache)
			oneBoardCache.oldStats=oldStats
			delete oneBoardCache.lastStats.cache
		}
		var postsInbetween=lastStats.post-oldStats.post
		var timeInbetween=lastStats.time-oldStats.time
		var postsPerSecond=postsInbetween/timeInbetween
		
		var currentBoard=oneBoardCache.currentBoard
		var noDubs=noDubsBoard(currentBoard)
		var getDigits=id('tab1-digits').value*1
		var customPost=id('tab1-custompost').value
		if(!getDigits){
			if(/[-+]/.test(customPost[0])){
				customPost-=-lastStats.post
			}
			if(customPost>0&&customPost<1e15){
				getStats={next:Math.floor(customPost)}
			}else{
				getStats={next:lastStats.post}
			}
		}else{
			var getClear=id('tab1-clear').checked
			var getPalindrome=id('tab1-palindrome').checked
			var getStats=getNextGet(lastStats.post,getDigits,getClear,noDubs,getPalindrome)
		}
		var lastGetAgo=lastStats.post-getStats.last
		var postsUntilGet=getStats.next-lastStats.post
		var relativeTime=toRelativeTime(postsUntilGet/postsPerSecond,lastStats.time)
		var lastDate=new Date(lastStats.time*1000)
		var postPast=postsUntilGet<0
		if(noDubs){
			postsPerSecond*=0.901
			// You can get this number by filling an array with numbers from 0 to 999, not including the numbers that have repeating digits at the end. The resulting array should have 901 numbers, just divide that by 1000
		}
		postsPerSecond=toRelativeTime(1/postsPerSecond,0,2)
		element(
			id('tab1-highlighted'),[{
				style:'display:block'
			}],
				['div',{
					class:'board-title'
				},boardTitle(currentBoard)],
				['b',relativeTime[0]],
				' '+(postPast?'after':'until')+' the ',
				['b',formatNumber(getStats.next)],
				' get',
			id('tab1-content'),
				'Posts ',
				(postPast?['b','since']:'left'),
				': ',
				['b',formatNumber(Math.abs(postsUntilGet))],
				['br'],
				'Board speed: 1 post per ',
				['b',postsPerSecond],
				['br'],
				'Estimated date: ',
				relativeTime[1],
				['br'],
				['br'],
				'Current post: ',
				['a',{
					href:protocol+'://sys.4chan.org/'+currentBoard+'/imgboard.php?res='+lastStats.post
				},formatNumber(lastStats.post)],
				' ('+lastDate.toLocaleTimeString()+', '+lastDate.toDateString()+')'
		)
		if(getStats.last&&getDigits){
			element(
				id('tab1-content'),
					['br'],
					'Last get (',
					['a',{
						href:protocol+'//sys.4chan.org/'+currentBoard+'/imgboard.php?res='+getStats.last
					},getStats.last],
					') happened ',
					['b',lastGetAgo],
					' post'+(lastGetAgo==1?'':'s')+' ago'
			)
		}
	}else{
		id('tab1-highlighted').style.display='none'
	}
}

function multipleBoardsLoop(){
	var currentBoard=multipleCurrentBoards[boardIndex]
	getLastPost(currentBoard,multipleBoardsLoop2)
}
function multipleBoardsLoop2(lastStats){
	var currentBoard=multipleCurrentBoards[boardIndex]
	if(lastStats.post){
		multipleBoardsCache[currentBoard]={
			lastStats:lastStats
		}
		tab2Changed()
	}
	
	if(id('tab2-fast').checked||fastBoard(currentBoard)||!lastStats.post){
		boardIndex++
		if(boardIndex<currentBoards.length){
			multipleBoardsTimer=setTimeout(function(){
				multipleBoardsLoop(currentBoards,boardIndex)
			},delayValue[1]*1000)
		}else{
			id('tab2-check').value='Check'
		}
	}else{
		multipleBoardsTimer=setTimeout(function(){
			getOldPost(currentBoard,0,multipleBoardsLoop3)
		},delayValue[1]*1000)
	}
}
function multipleBoardsLoop3(oldStats){
	var currentBoard=multipleCurrentBoards[boardIndex]
	if(oldStats.post){
		multipleBoardsCache[new String(currentBoard)].oldStats=oldStats
		tab2Changed()
	}
	boardIndex++
	if(boardIndex<currentBoards.length){
		multipleBoardsTimer=setTimeout(function(){
			multipleBoardsLoop()
		},delayValue[1]*1000)
	}else{
		id('tab2-check').value='Check'
	}
}

function tab2Changed(){
	if(Object.keys(multipleBoardsCache).length){
		var getDigits=id('tab2-digits').value
		var getClear=id('tab2-clear').checked
		var getPalindrome=id('tab2-palindrome').checked
		
		var sortWhich=sortCache[0]
		var sortBackwards=sortCache[1]
		
		var rows=['Board','Next get','Happens in','Posts left','Board speed']
		
		var sorttablerow=['tr']
		for(var i in rows){
			var newth=['th',{
				id:'sortTableRow'+i,
				class:sortWhich==i?sortBackwards?'sortup':'sortdown':''
			},rows[i]]
			if(i!=1){
				newth[1].onclick=sortTableRow
			}
			sorttablerow.push(newth)
		}
		
		var multipleBoardsStats=[]
		
		for(var currentBoard in multipleBoardsCache){
			var boardCache=multipleBoardsCache[currentBoard]
			var noDubs=noDubsBoard(currentBoard)
			var lastStats=boardCache.lastStats
			
			if(boardCache.oldStats){
				var oldStats=boardCache.oldStats
			}else{
				var oldStats=getOldPost(0,lastStats.cache)
				boardCache.oldStats=oldStats
				delete lastStats.cache
			}
			var postsInbetween=lastStats.post-oldStats.post
			var timeInbetween=lastStats.time-oldStats.time
			var postsPerSecond=postsInbetween/timeInbetween
			
			var getStats=getNextGet(lastStats.post,getDigits,getClear,noDubs,getPalindrome)
			var postsUntilGet=getStats.next-lastStats.post
			var relativeTimestamp=postsUntilGet/postsPerSecond
			
			if(noDubs){
				postsPerSecond*=0.901
			}
			
			multipleBoardsStats.push([
				currentBoard,
				getStats.next,
				relativeTimestamp,
				postsUntilGet,
				1/postsPerSecond
			])
		}
		
		if(sortBackwards){
			var sortedStats=multipleBoardsStats.sort(function(a,b){
				return a[sortWhich]<b[sortWhich]?1:-1
			})
		}else{
			var sortedStats=multipleBoardsStats.sort(function(a,b){
				return a[sortWhich]>b[sortWhich]?1:-1
			})
		}
		
		var statstable=[]
		for(var i in sortedStats){
			statstable.push(
				['tr',{
					id:'table-board-'+sortedStats[i][0],
					onclick:multipleToSingle
				},
					['td',boardTitle(sortedStats[i][0])],
					['td',formatNumber(sortedStats[i][1])],
					['td','(in '+toRelativeTime(sortedStats[i][2])+','],
					['td',formatNumber(sortedStats[i][3])+' post'+(sortedStats[i][3]==1?'':'s')+')'],
					['td','1 post/\u200B'+toRelativeTime(sortedStats[i][4],0,3)]
				]
			)
		}
		
		var tab2Content=id('tab2-content')
		tab2Content.innerHTML=''
		element(
			tab2Content,
			['table',
				sorttablerow,
				statstable
			]
		)
	}
}

function sortTableRow(event){
	var sortWhich=event.currentTarget.id.replace('sortTableRow','')*1
	if(sortWhich==sortCache[0]&&!sortCache[1]){
		sortCache=[sortWhich,1]
	}else{
		sortCache=[sortWhich,0]
	}
	tab2Changed()
}

function multipleToSingle(event){
	var target=event.currentTarget
	for(;target;){
		if(target.id){
			var currentBoard=target.id.replace('table-board-','')
			break
		}
		target=target.parentNode
	}
	oneBoardCache=multipleBoardsCache[currentBoard]
	oneBoardCache.currentBoard=currentBoard
	tab1Changed()
	changeTab(1)
}

function loopBoardLoop(){
	var currentBoard=id('tab3-board').value
	var lastCall=''
	if(loopCache.currentBoard==currentBoard){
		lastCall=loopCache.lastCall
	}
	loopCache={
		currentBoard:currentBoard
	}
	getLastPost(currentBoard,loopBoardLoop2,lastCall)
}

function loopBoardLoop2(lastStats){
	id('tab3-progress').value=0
	if(lastStats){
		loopCache={
			currentBoard:loopCache.currentBoard,
			lastCall:lastStats.lastCall,
			lastStats:lastStats
		}
	}
	tab3Changed()
	loopBoardTimer=setInterval(function(){
		var progress=id('tab3-progress')
		var maxProgress=delayValue[2]
		progress.setAttribute('max',maxProgress)
		var progressValue=progress.value
		if(progressValue>=maxProgress){
			clearTimeout(loopBoardTimer)
			loopBoardLoop()
		}else{
			progress.value+=1
		}
	},1000)
}

function tab3Changed(){
	id('tab3-highlighted').innerHTML=id('tab3-content').innerHTML=''
	var lastStats=loopCache.lastStats
	if(lastStats){
		id('tab3-custompost').placeholder=lastStats.post
		var oldStats=getOldPost(0,lastStats.cache)
		var postsInbetween=lastStats.post-oldStats.post
		var timeInbetween=lastStats.time-oldStats.time
		var lastDate=new Date(lastStats.time*1000)
		var postsPerSecond=postsInbetween/timeInbetween
		var customPost=Math.floor(id('tab3-custompost').value)
		if(customPost==lastStats.post){
			customPost=0
		}
		if(customPost>0){
			var postsUntilGet=customPost-lastStats.post
			var relativeTime=toRelativeTime(postsUntilGet/postsPerSecond,lastStats.time)
			var postPast=postsUntilGet<0
		}
		if(noDubsBoard(loopCache.currentBoard)){
			postsPerSecond*=0.901
		}
		postsPerSecond=toRelativeTime(1/postsPerSecond,0,2)
		element(
			id('tab3-highlighted'),[{
				style:'display:block'
			}],
				['div',{
					class:'board-title'
				},boardTitle(loopCache.currentBoard)],
				'Current post: ',
				['a',{
					href:protocol+'://sys.4chan.org/'+loopCache.currentBoard+'/imgboard.php?res='+lastStats.post,
					style:'font-weight:bold'
				},formatNumber(lastStats.post)],
				['br'],
				'Board speed: 1 post per ',
				['b',postsPerSecond]
		)
		if(customPost>0){
			element(
				id('tab3-content'),
					['b',relativeTime[0]],
					' '+(postPast?'after':'until')+' the ',
					['b',formatNumber(customPost)],
					' get',
					['br'],
					'Posts ',
					(postPast?['b',{
						style:'color:red'
					},'since']:'left'),
					': ',
					['b',formatNumber(Math.abs(postsUntilGet))],
					['br'],
					'Estimated date: ',
					relativeTime[1],
					['br'],
					['br']
			)
		}
		element(
			id('tab3-content'),
				'Current post date: '+lastDate.toLocaleTimeString()+', '+lastDate.toDateString()
		)
	}else{
		id('tab3-highlighted').style.display='none'
	}
}

function requestPage(currentBoard,page,realNextStep,nextStep,lastCall){
	var jsonobj
	GM_xmlhttpRequest({
		method:'get',
		url:protocol+'//a.4cdn.org/'+currentBoard+'/'+page+'.json',
		headers:{'If-Modified-Since':lastCall},
		onload:function(response){
			if(lastCall){
				var headers=response.responseHeaders.split('\n')
				for(var i in headers){
					var header=headers[i].split(': ')
					if(header[0]=='Last-Modified'){
						lastCall=header[1]
						break
					}
				}
			}
			if(response.status==200){
				jsonobj=JSON.parse(response.responseText)
			}else if(response.status==304){
				nextStep()
				return
			}else{
				connectionError('4chan',response.status,protocol+'//a.4cdn.org/'+currentBoard+'/'+page+'.json')
			}
			realNextStep(jsonobj,nextStep,lastCall)
		},
		onerror:function(){
			connectionError('4chan',0,protocol+'//a.4cdn.org/'+currentBoard+'/'+page+'.json')
			realNextStep(jsonobj,nextStep)
		},
		onabort:function(){
			for(var i=1;i<4;i++){
				id('tab'+i+'-check').value='Check'
			}
		}
	})
}

function getLastPost(currentBoard,nextStep,lastCall){
	requestPage(currentBoard,1,getLastPost2,nextStep,lastCall)
}

function getLastPost2(jsonobj,nextStep,lastCall){
	if(!jsonobj){
		nextStep({
			post:0,
			time:0,
			cache:[[0],[0]]
		})
		return
	}
	var postNumbers=[]
	var postTimes=[]
	var allsticky=jsonobj.threads[jsonobj.threads.length-1].posts[0].sticky
	for(var i=0;i<jsonobj.threads.length;i++){
		if(!jsonobj.threads[i].posts[0].sticky||allsticky){
			for(var j=0;j<jsonobj.threads[i].posts.length;j++){
				postNumbers.push(jsonobj.threads[i].posts[j].no)
				postTimes.push(jsonobj.threads[i].posts[j].time)
			}
		}
	}
	var result={
		post:Math.max.apply(Math,postNumbers),
		time:Math.max.apply(Math,postTimes),
		cache:[postNumbers,postTimes]
	}
	if(lastCall){
		result.lastCall=lastCall
	}
	nextStep(result)
}

function getOldPost(currentBoard,cache,nextStep){
	if(cache){
		var postNumbers=cache[0]
		var postTimes=cache[1]
		return {
			post:Math.min.apply(Math,postNumbers),
			time:Math.min.apply(Math,postTimes)
		}
	}else{
		requestPage(currentBoard,10,getOldPost2,nextStep)
	}
}

function getOldPost2(jsonobj,nextStep){
	if(!jsonobj){
		nextStep({
			post:0,
			time:0
		})
	}
	var postNumbers=[]
	var postTimes=[]
	for(var i=0;i<jsonobj.threads.length;i++){
		for(var j=0;j<jsonobj.threads[i].posts.length;j++){
			postNumbers.push(jsonobj.threads[i].posts[j].no)
			postTimes.push(jsonobj.threads[i].posts[j].time)
		}
	}
	nextStep({
		post:Math.min.apply(Math,postNumbers),
		time:Math.min.apply(Math,postTimes)
	})
}

function getNextGet(lastPost,getDigits,getClear,noDubs,getPalindrome){
	if(getPalindrome)
		return {
			next:nextPalindrome(lastPost,0,noDubs),
			last:nextPalindrome(lastPost,1,noDubs)
		}
	var getClear=noDubs||getClear
	if(noDubs&&getDigits<3)
		getDigits=3
	var tpow=Math.pow(10,getDigits)
	var allones=tpow/(getClear?1:9)|0
	if(allones>lastPost)
		return {
			next:allones,
			last:0
		}
	var unchanged=(lastPost/tpow|0)*tpow
	if(getClear)
		return {
			next:unchanged+tpow,
			last:unchanged
		}
	var array=[]
	for(var i=getDigits-1;i>=0&&lastPost;i--){
		array[i]=lastPost%10
		lastPost=lastPost/10|0
	}
	var repdigit=array[0]
	for(i=0;i<getDigits;i++){
		if(array[0]<array[i])
			repdigit=(repdigit+1)%10
		if(array[0]!=array[i])
			break
	}
	if(i==getDigits&&array[0]==array[i-1]){
		repdigit=(repdigit+1)%10
		if(array[0]==9){
			unchanged=unchanged+tpow
			allones=1
		}
	}
	var alldigits=unchanged+((1/9-1e-16)*repdigit*tpow|0)
	return {
		next:alldigits,
		last:alldigits-allones
	}
}

function nextPalindrome(lastPost,prev,noDubs){
	if(noDubs&&lastPost<101&&lastPost>8)
		return prev?9:101
	lastPost++
	var midf=(Math.log(lastPost)/Math.LN10+1|0)/2
	var mid=Math.ceil(midf)
	var nomid=mid==midf?0:1
	var midp=Math.pow(10,mid-nomid)
	var leftnum=lastPost/midp|0
	var mulprev=prev?-1:1
	for(;;){
		var nextPalin=leftnum*midp
		for(var i=nomid;i<mid;i++)
			nextPalin+=((leftnum/Math.pow(10,i)|0)%10)*Math.pow(10,mid-i-1)
		if(!prev&&leftnum>midp*(nomid?10:1))
			return midp*midp*(nomid?10:1)+1
		else if(!(nextPalin%10))
			return nextPalindrome(lastPost+mulprev-1,prev,noDubs)
		else if(noDubs&&(nextPalin%10)==(nextPalin/10%10|0))
			leftnum=((leftnum/(midp/(nomid?10:100))|0)+(mulprev+1)/2)*(midp/(nomid?10:100))-prev
		else if(nextPalin*mulprev<lastPost*mulprev+prev)
			leftnum+=mulprev
		else
			break
	}
	return nextPalin
}

function saveLoadTab(tabnum){
	saveloadFromTab=tabnum
	changeTab(5)
}

function saveToFile(overwrite){
	if(saveloadFromTab==1){
		var fileName='oneboard.json'
		var fileContents=oneBoardCache
	}else{
		var fileName='multipleboards.json'
		var fileContents=multipleBoardsCache
	}
	if(hta){
		var fileSystem=new ActiveXObject('Scripting.FileSystemObject')
		if(fileSystem.FileExists(fileName)){
			if(overwrite==1){
				var openedFile=fileSystem.OpenTextFile(fileName,2,0)
			}else{
				if(confirm(fileName+' exists in the current directory. Overwrite it?')){
					saveToFile(1)
				}
				return
			}
		}else{
			var openedFile=fileSystem.CreateTextFile(fileName)
		}
		openedFile.WriteLine(JSON.stringify(fileContents))
		openedFile.Close()
		if(!overwrite){
			alert('Saved as '+fileName)
		}
	}else{
		var saveLink=document.createElement('a')
		saveLink.innerHTML='link'
		saveLink.href='data:application/json;base64,'+btoa(JSON.stringify(fileContents))
		saveLink.setAttribute('download',fileName)
		saveLink.setAttribute('target','_blank')
		document.body.appendChild(saveLink)
		saveLink.click()
		document.body.removeChild(saveLink)
	}
}

function loadFromFile(){
	if(window.multipleBoardsTimer){
		clearTimeout(multipleBoardsTimer)
	}
	if(window.oneBoardTimer){
		clearTimeout(oneBoardTimer)
	}
	id('tab1-check').value=id('tab2-check').value='Check'
	
	var filesInput=id('saveload-input')
	if(filesInput.files.length){
		var openedFile=filesInput.files[0]
		var reader=new FileReader()
		reader.onload=function(event){
			fileContents=event.currentTarget.result
			id('saveload-form').reset()
			try{
				var fileContents=JSON.parse(fileContents)
			}catch(e){
				alert('This is not a JSON file!')
				return
			}
			if(fileContents.currentBoard&&fileContents.lastStats){
				oneBoardCache=fileContents
				tab1Changed()
				changeTab(1)
			}else{
				var error=1
				for(var i in fileContents){
					if(fileContents[i].lastStats){
						error=0
						multipleBoardsCache=fileContents
						tab2Changed()
						changeTab(2)
					}else{
						alert('The JSON file is corrupt!')
					}
					break
				}
				if(error){
					alert('The JSON file is empty!')
				}
			}
		}
	}
	reader.readAsText(filesInput.files[0])
}

function focusCustom(event){
	var target=event.currentTarget
	if(target.value==''){
		target.value=target.placeholder
		target.setSelectionRange(target.value.length,target.value.length)
	}
}

function changeCustom(event){
	var tabNumber=event.currentTarget.id.match(/tab(\d)-custompost/)[1]
	changeNumber(event,tabNumber==1?1-1e15:1,1e15-1,tabNumber==1)
	if(tabNumber==1){
		tab1Changed()
	}else{
		tab3Changed()
	}
}

function changeDelay(event){
	var tabNumber=event.currentTarget.id.match(/tab(\d)-delay/)[1]
	changeNumber(event,1,99)
	if(event.type=='blur'||event.keyCode==38||event.keyCode==40){
		delayValue[tabNumber-1]=event.currentTarget.value
	}
}

function changeNumber(event,min,max,mp){
	var pressed=event.keyCode
	var target=event.currentTarget
	var result=target.value
	var oldValue=result
	var cursorPos=target.selectionStart
	if(event.type=='keydown'){
		if(!event.shiftKey&&(
			pressed>36&&pressed<41||//Arrow keys
			pressed>41&&pressed<59||//Number row
			pressed>95&&pressed<106//Numpad digits
		)){
			if(pressed==38||pressed==40){
				event.preventDefault()
				var plus=''
				if(mp&&result==''||/[-+]/.test(result)){
					var plus='+'
				}
				result=(result*1+(pressed==38?1:-1))+''
				if(plus&&result[0]!='-'){
					result=plus+result
				}
			}
		}else if(mp&&(
			pressed==107||//Numpad plus
			pressed==109||//Numpad minus
			event.shiftKey&&pressed==187||//Equals
			pressed==189//Minus
		)){
			event.preventDefault()
			result=(pressed==109||pressed==189?'-':'+')+result.replace(/[-+]/,'')
		}else if(
			event.ctrlKey||
			event.altKey||
			pressed==8||//Backspace
			pressed==9||//Tab
			pressed==27||//Esc
			pressed>32&&pressed<37||//Home, End, Page Up/Down
			event.shiftKey&&pressed>36&&pressed<41||//Arrow keys
			pressed==46||//Delete
			pressed>111&&pressed<124//F1-F12 keys
		){}else{
			event.preventDefault()
		}
		if(!/^[-+]$/.test(result)&&(
			!(result*0+1)||
			result<min||
			result>max||
			target.maxLength!=-1&&(result+'').length>target.maxLength
		)){
			result=target.value
		}
	}
	if(result){
		result=result[0].replace(mp?/[^+-\d]/:/\D/,'')+result.slice(1).replace(/\D+/g,'')
	}
	if(event.type=='blur'&&result==target.placeholder){
		target.value=''
	}else if(oldValue!=result){
		target.value=result
		if(pressed==38||pressed==40){
			target.setSelectionRange(cursorPos,cursorPos)
		}
	}
}

function plusBoard(event){
	var input=element(['input#input',{
		type:'text',
		value:event.currentTarget.innerHTML=='+'?'':event.currentTarget.innerHTML.slice(1,-1),
		onblur:selectPlusBoard,
		onkeydown:selectPlusBoard
	}]).input
	event.currentTarget.parentNode.replaceChild(input,event.currentTarget)
	input.setSelectionRange(input.value.length,input.value.length)
}

function selectPlusBoard(event){
	if(event.type=='keydown'){
		if(event.keyCode==13){
			event.currentTarget.blur()
		}
		return
	}
	var value=event.currentTarget.value.replace(/^\/+|\/+$/g,'')
	var div=element(['div#div',{
		onclick:plusBoard,
		board:value
	},value?'/'+value+'/':'+']).div
	event.currentTarget.parentNode.replaceChild(div,event.currentTarget)
	if(value){
		tab1or3ChooseBoard(0,div)
	}else{
		if(!div.parentNode.getElementsByClassName('selected')[0]){
			tab1or3ChooseBoard(0,div.parentNode.querySelector('[board="'+boardName+'"]'))
		}
	}
}

function moveHandler(event){
	if(move||resize){
		event.preventDefault()
		getSelection().removeAllRanges()
		var startX=event.clientX*1
		var startY=event.clientY*1
		if(mouseXlast!=null){
			if(move){
				var boxLeft=getWatcherBody.offsetLeft-(mouseXlast-startX)
				var xmax=document.body.clientWidth-getWatcherBody.offsetWidth
				var nox=0
				if(boxLeft<0){
					boxLeft=0
					nox=1
				}
				if(boxLeft>xmax){
					boxLeft=xmax
					nox=1
				}
				if(!nox){
					mouseXlast=startX
				}
				var boxTop=getWatcherBody.offsetTop-(mouseYlast-startY)
				var ymax=document.body.clientHeight-getWatcherBody.offsetHeight
				var noy=0
				if(boxTop<0){
					boxTop=0
					noy=1
				}
				if(boxTop>ymax){
					boxTop=ymax
					noy=1
				}
				if(!noy){
					mouseYlast=startY
				}
				getWatcherBody.style.left=boxLeft+'px'
				getWatcherBody.style.top=boxTop+'px'
			}else{
				var width=getWatcherBody.style.width.slice(0,-2)
				var height=getWatcherBody.style.height.slice(0,-2)
				var boxWidth=width-(mouseXlast-startX)
				if(boxWidth>700){
					mouseXlast=startX
				}else{
					boxWidth=700
				}
				var boxHeight=height-(mouseYlast-startY)
				if(boxHeight>400){
					mouseYlast=startY
				}else{
					boxHeight=400
				}
				getWatcherBody.style.width=boxWidth+'px'
				getWatcherBody.style.height=boxHeight+'px'
			}
		}else{
			mouseXlast=startX
			mouseYlast=startY
		}
	}
}

function updateScript(){
	GM_xmlhttpRequest({
		method:'get',
		url:metajsurl,
		onload:function(response){
			if(response.status==200){
				var newversion=response.responseText.match(/@version\s+([^\r\n]+)\s*\n/)[1]
				if(version!=newversion){
					var versionTime=new Date(version.replace(/\./g,'/')).getTime()
					var newVersionTime=new Date(newversion.replace(/\./g,'/')).getTime()
					if(newVersionTime>versionTime){
						var downloadconfirm=confirm('New version ('+newversion+') is available! Download it now?')
						if(downloadconfirm){
							if(hta){
								updateHta()
							}else{
								GM_openInTab(userjsurl)
							}
						}
					}else{
						alert('You\'re using the latest version')
					}
				}else{
					alert('You\'re using the latest version')
				}
			}else{
				connectionError(website,response.status,metajsurl)
			}
		},
		onerror:function(){
			connectionError(website,0,metajsurl)
		}
	})
}

function updateHta(){
	GM_xmlhttpRequest({
		method:'get',
		url:userjsurl,
		onload:function(response){
			if(response.status==200){
				var htafile=response.responseText
				if(htafile.length){
					var fileSystem=new ActiveXObject('Scripting.FileSystemObject')
					var fileName=unescape(location.href.match(/\/([^\/]+)$/)[1])
					if(fileName){
						if(fileSystem.FileExists(fileName)){
							var openedFile=fileSystem.OpenTextFile(fileName,2,0)
						}else{
							var openedFile=fileSystem.CreateTextFile(fileName)
						}
						openedFile.WriteLine(htafile)
						openedFile.Close()
						location.reload()
					}
				}
			}else{
				connectionError(website,response.status,userjsurl)
			}
		},
		onerror:function(){
			connectionError(website,0,userjsurl)
		}
	})
}

function connectionError(title,status,url){
	if(status){
		var statusParsed='HTTP '+status
	}else{
		var statusParsed='Connection error'
	}
	alert('Couldn\'t connect to '+title+(status==404?'':', it might be offline at the moment')+' ('+statusParsed+')\n\nURL: '+url)
}
//</script></body></html>