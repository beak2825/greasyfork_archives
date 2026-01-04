// ==UserScript==
// @name        [s4s] interface
// @namespace   s4s4s4s4s4s4s4s4s4s
// @version     3.33
// @author      le fun css man AKA Doctor Worse Than Hitler, kekero
// @email       doctorworsethanhitler@gmail.com
// @description Lets you view the greenposts.
// @match       https://boards.4chan.org/s4s/*
// @match       http://boards.4chan.org/s4s/*
// @connect     funposting.online
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @icon data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZD0iTTAgMEgxNlYxNkgwIiBmaWxsPSIjZGZkIi8+PHBhdGggZD0iTTMgNCA2IDFoNGwzIDN2OGwtMyAzSDZMMyAxMiIgZmlsbD0iZ3JlZW4iLz48cGF0aCBkPSJtNS41IDExLjVoLTJ2LTdoMnYtM2MtMyAwLTUgMi41LTUgNi41IDAgNCAyIDYuNSA1IDYuNXptNSAzYzMgMCA1LTIuNSA1LTYuNSAwLTQtMi02LjUtNS02LjV2M2gydjdoLTJ6bS00LTRoM0wxMCAyLjVINlptMCAzaDN2LTNoLTN6IiBmaWxsPSIjZmZmIiBzdHJva2U9ImdyZWVuIi8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/40138/%5Bs4s%5D%20interface.user.js
// @updateURL https://update.greasyfork.org/scripts/40138/%5Bs4s%5D%20interface.meta.js
// ==/UserScript==
"use strict";


if(query("#s4sinterface-css")){
	throw "Multiple instances of [s4s] interface detected"
}

var interfaceLinkRegex = new RegExp('<a[^>]*>&gt;&gt;\\d*( \\(.*\\))?<\\/a>(<span>)?-\\d*');
var weekdays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
var postForm={}
var lastCommentForm
var updateLinks=new Set()
var cacheCatalogPosts={}
var mode=""
var threadId
var numThreads
var pathName=location.pathname
var threadMatch=pathName.match(/\/thread\/(\d+)/)
if(threadMatch){
	// /board/thread/1
	mode="thread"
	threadId=threadMatch[1]
}else if(/\/catalog$/.test(pathName)){
	// /board/catalog
	mode="catalog"
}else if(/^\/[^\/]+\/\d*$/.test(pathName)){
	// /board/
	mode="index"
}

if(typeof GM=="undefined"){
	window.GM={
		xmlHttpRequest:window.GM_xmlhttpRequest,
        getValue:window.GM_getValue,
        setValue:window.GM_setValue
	}
}

// Request green posts
var serverurl="https://funposting.online/interface/"
if(mode=="thread"){
	getGreenPosts(threadId)
}else if(mode=="catalog"){
	onPageLoad(_=>{
		getGreenPostsCatalog()
	})
}else if(mode=="index") {
  onPageLoad(_=>{
    numThreads = document.getElementsByClassName("thread").length
    // use a mutation observer to update the green posts on the index on infinite scrollio
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        checkForIndexUpdate() // checks for and updates the index on infinite scroll
      });
    });
    observer.observe(document, {childList:true, subtree:true})

		addGreenPostsToIndex()
	})
}

// checks for and updates the index on infinite scroll
function checkForIndexUpdate() {
  if (numThreads != document.getElementsByClassName("thread").length) {
  	numThreads = document.getElementsByClassName("thread").length
    addGreenPostsToIndex()
  }
}

function addGreenPostsToIndex() {
  var threads = document.getElementsByClassName("thread")
  for (var i = 0; i < threads.length; i++) {
    var responses = threads[i].getElementsByClassName("replyContainer")
    var since = 0
    if(responses != null && responses.length > 0) {
    	var since = threads[i].getElementsByClassName("replyContainer")[0].id.substr(2)
    }
    getGreenPosts(threads[i].id.substr(1), since)
  }
}

onPageLoad(_=>{
	// Classic post form
	if(mode=="thread"){
		var nameField=query("#postForm input[name=name]")
		if(nameField){
			var commentField=query("#postForm textarea")
			addCommentForm(commentField,1)
			var greenToggle=element(
				["button#toggle",{
					class:"greenToggle",
					title:"[s4s] Interface",
					onclick:event=>{
						event.preventDefault()
						event.stopPropagation()
						showPostFormClassic()
					}
				},"!"]
			).toggle
			var nameParent=nameField.parentNode
			nameParent.classList.add("nameFieldParent")
			insertBefore(greenToggle,nameField)
		}else{
			// Thread is archived
			showPostFormClassic()
		}
		getUpdateLinks()
	}
})


// watch lists
onPageLoad(_=>{
   // native extension watch list
  if(document.getElementById("watchList") !== null) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        updateNativeWatchList();
      });
    });
    observer.observe(document.getElementById("watchList"), {childList:true, subtree:true})
  }
  updateNativeWatchList() // call this once in addition to the observer to make sure it gets ran on page load even if the thread watcher doesn't refresh
  ///todo: 4chan x watch list
})

// updates the native watch list
async function updateNativeWatchList() {
  var watchList = document.getElementById("watchList");
  var watchedThreads = watchList.getElementsByTagName('li');
  if(watchedThreads !== null && watchedThreads.length > 0) {
  	for(var i = 0; i < watchedThreads.length; i++) {
    	var thread = watchedThreads[i].id.split('-')[1]; // format is 'watch-12345-s4s'
      var board = watchedThreads[i].id.split('-')[2];
      
      // it's da [s4s] inderfase not da otherboard indaface
      if(board != 's4s') continue;

      // GM_getValue will store the ['thread' => 'number of last seen posts'] pairs
      var lastSeen = await GM.getValue(thread, false);

      // if we have watched this thread, we check for updates
      if(lastSeen !== false) {
        getCountSince(thread, lastSeen);
      }
      else {
        getNewestPost(thread);
      }
    }
  }

}

// Native extension QR
document.addEventListener("QRNativeDialogCreation",onQRCreated)
if(unsafeWindow.Main){
	onNativeextInit()
}else{
	document.addEventListener("4chanMainInit",onNativeextInit)
}

function onPageLoad(func){
	if(document.readyState=="loading"){
		addEventListener("DOMContentLoaded",func)
	}else{
		func()
	}
}
// firefox will (sometimes) fail to load document.documentElement until the page is loaded
onPageLoad(_=>{
// 4chan-X QR integration
if(document.documentElement.classList.contains("fourchan-x")){
	on4chanXInit()
}else{
	document.addEventListener("4chanXInitFinished",on4chanXInit)
}
document.addEventListener("QRDialogCreation",onQRXCreated)
})

// replaces links like >>1234567-123 in native 4chan posts with an appropriate link back to the interface post.
function replaceInterfaceLinks(post) {
    while(interfaceLinkRegex.test(post.innerHTML)) {
    var link = interfaceLinkRegex.exec(post.innerHTML)[0] //something like <a href="#p6696342" class="quotelink ql-tracked">&gt;&gt;6696342 (You)</a>-6754<br>test pls ignorlol
    var link_afterno = /&gt;\d+/.exec(link)[0].substr(4)
    var link_interfaceno = /-\d+/.exec(link)[0].substr(1)
    var has_span = /<span>/.test(link) // sometimes the end of the link starts with a <span> so lets not forget it later
    var replace = '<a class="quotelink" href="#p'+link_afterno+'-'+link_interfaceno+'">&gt;&gt;'+link_afterno+'-'+link_interfaceno+'</a>'
    if(has_span) replace += '<span>'
  	post.innerHTML = post.innerHTML.replace(interfaceLinkRegex, replace)
  }
}

// gets the number of posts since the newest green post specified by the green post's interface id (the number after the -, e.g. 123456-123 is 123)
function getCountSince(thread, newestGreenPost) {
		GM.xmlHttpRequest({
		method:"get",
		url:serverurl+"watch.php?thread="+thread+"&newestGreenPost="+newestGreenPost,
		onload:response=>{
			if(response.status==200){
				onPageLoad(_=>{
					var count=response.responseText
          if(count > 0) {
						updateWatchListItem(thread,count)
          }
				})
			}
		},
		onerror:response=>{
      return 0;
		}
	})
}

// todo: 4chan X
function updateWatchListItem(thread, count) {
	var item = query('#watch-'+thread+'-s4s > a:nth-child(2)');

  if(item.classList.contains("newGreenPost")) return;
  item.classList.add("newGreenPost");
}

// gets the green id of the newest green post in a thread
function getNewestPost(thread) {
		GM.xmlHttpRequest({
		method:"get",
		url:serverurl+"watch.php?thread="+thread,
		onload:response=>{
			if(response.status==200){
				onPageLoad(_=>{
          GM.setValue(thread, response.responseText);
				})
			}
		},
		onerror:response=>{
		}
	})
}

// Request green posts & add them
function getGreenPosts(thread, since = 0){
	GM.xmlHttpRequest({
		method:"get",
		url:serverurl+"get.php?thread="+thread+((since != 0) ? "since="+since : ""),
		onload:response=>{
			if(response.status==200){
				onPageLoad(_=>{
					var postsObj=JSON.parse(response.responseText)
					var postsCount=Object.keys(postsObj).length
					if(postsCount){
            if(mode == "thread") {
              var oldPosts=queryAll(".greenPostContainer")
              for(var i=0;i<oldPosts.length;i++){
                removeChild(oldPosts[i])
              }
              var currentPost
              for(var i=postsCount;i--;){
                currentPost=addPost(postsObj[i],currentPost)
              }

              // update the watchlist to say "weve seen the post lole"
              GM.setValue(thread,postsObj[0].id)
            }
            else if(mode == "index") {
              for(var i=0; i< postsCount; i++){
                // dont reinsert posts
                if(document.getElementById('p'+postsObj[i].after_no+"-"+postsObj[i].id) === null) {
                	addPost(postsObj[i],document.getElementById(postsObj[i].after_no))
              	}
              }
            }
					}
				})
			}
		},
		onerror:response=>{
		}
	})
}

// takes the JSON from the server and converts to an HTML element
function postJsonToElement(aPost){
  var numberless=aPost.options=="numberless"
	var afterNo=numberless?"XXXXXX":aPost.after_no
	var postId=afterNo+"-"+aPost.id
	var date=new Date(aPost.timestamp*1000)
	var dateString=
		padding(date.getMonth()+1,2)+"/"+
		padding(date.getDate(),2)+"/"+
		(""+date.getFullYear()).slice(-2)+
		"("+weekdays[date.getDay()]+")"+
		padding(date.getHours(),2)+":"+
		padding(date.getMinutes(),2)+":"+
		padding(date.getSeconds(),2)
	var linkReply
	if(!numberless){
		linkReply=[0,
			" ",
			["a",{
				href:"#p"+postId,
				title:"Link to this post"
			},"No."],
			["a",{
				href:"javascript:quote('"+postId+"');",
				onclick:insertQuote,
				title:"Reply to this post"
			},postId]
		]
	}
	var replyHideX=document.documentElement.classList.contains("reply-hide")
	var post=element(
		["div#post",{
			class:"postContainer replyContainer greenPostContainer",
			id:"pc"+aPost.after_no
		},
			(replyHideX?
				["div",{
					id:"sa"+postId
				},
					["a",{
						class:"hide-reply-button"
					},
						["span",{
							class:"fa fa-minus-square-o"
						}]
					]
				]
			:
				["div",{
					class:"sideArrows",
					id:"sa"+postId
				},">>"]
			),
			["div",{
				class:"post reply",
				id:"p"+postId
			},
				["div",{
					class:"postInfoM mobile",
					id:"pim"+postId
				},
					["span",{
						class:"nameBlock"
					},
						["span",{
							class:"name"
						},aPost.username],
						["br"]
					],
					["span",{
						class:"dateTime postNum",
						"data-utc":aPost.timestamp
					},
						dateString,
						linkReply
					]
				],
				["div",{
					class:"postInfo desktop",
					id:"pi"+postId
				},
					["input",{
						type:"checkbox",
						name:"ignore",
						value:"delete"
					}],
					["span",{
						class:"nameBlock"
					},
						["span",{
							class:"name"
						},aPost.username]
					],
					" ",
					["span",{
						class:"dateTime",
						"data-utc":aPost.timestamp
					},dateString],
					(!numberless&&
						["span",{
							class:"postNum desktop",
							onclick:insertQuote,
							title:"Reply to this post"
						},linkReply]
					)
				],
				["blockquote",{
					class:"postMessage",
					id:"m"+postId,
					innerHTML:aPost.text.replace(/\r/g,"")
				}]
			]
		]
	).post
  return post
}

// Add a post to the proper position in the thread
function addPost(aPost,currentPost){
	if(!currentPost){
		currentPost=query(".thread>.postContainer")
	}

	var post=postJsonToElement(aPost)

  if(mode == "thread") {
    // Add the post
    while(currentPost){
      var lastPost=currentPost
      if(!/^pc\d+$/.test(currentPost.id)||currentPost.id.slice(2)<=aPost.after_no){
        currentPost=currentPost.nextSibling
      }else{
        return insertBefore(post,currentPost)
      }
    }
    return insertAfter(post,lastPost)
  }
  else if(mode == "index") {
  	return insertAfter(post,document.getElementById("pc"+aPost.after_no))
  }
}

// Get green post count on catalog
function getGreenPostsCatalog(){
	var threadContainer=query(".is_catalog #threads,.catalog-mode .board")
	if(!threadContainer||!threadContainer.children.length){
		if(mode=="catalog"){
			return setTimeout(getGreenPostsCatalog,500)
		}else{
			var insertListener=event=>{
				document.removeEventListener("PostsInserted",insertListener)
				getGreenPostsCatalog()
			}
			return document.addEventListener("PostsInserted",insertListener)
		}
	}
	var threads=[]
	var catalogThreads=threadContainer.children
	for(var i=0;i<catalogThreads.length;i++){
		var idMatch=catalogThreads[i].id.match(/\d+/)
		if(idMatch){
			threads.push(idMatch[0])
		}
	}
	GM.xmlHttpRequest({
		method:"post",
		headers:{
			"Content-type":"application/x-www-form-urlencoded"
		},
		url:serverurl+"get.php?mode=catalog",
		data:"thread="+threads.join(","),
		onload:response=>{
			if(response.status==200){
				cacheCatalogPosts=JSON.parse(response.responseText)
				showGreenPostsCatalog()
				if(mode=="catalog"){
					new MutationObserver(mutations=>{
						showGreenPostsCatalog()
					}).observe(threadContainer,{childList:1})
				}else{
					document.addEventListener("PostsInserted",showGreenPostsCatalog)
				}
			}
		},
		onerror:response=>{
		}
	})
}

function showGreenPostsCatalog(){
	var countObj=cacheCatalogPosts
	var oldPosts=queryAll(".greenPostCount")
	for(var i=0;i<oldPosts.length;i++){
		removeChild(oldPosts[i].previousSibling)
		removeChild(oldPosts[i])
	}
	var threadMeta
	for(var thread in countObj){
		if(mode=="catalog"){
			threadMeta=document.getElementById("meta-"+thread)
		}else{
			threadMeta=query("#p"+thread+">.catalog-stats>span")
		}
		if(threadMeta){
			addCatalogPosts(countObj[thread],threadMeta)
		}
	}
}

function addCatalogPosts(count,threadMeta){
	if(count){
		var nativeCatalog=0
		if(mode=="catalog"){
			nativeCatalog=1
		}
		var text=document.createTextNode(" / ")
		var postCount=element(
			["span#span",{
				class:"greenPostCount"
			},
				(nativeCatalog&&
					"G: "
				),
				["b",count]
			]
		).span
		var afterNode=threadMeta.childNodes[nativeCatalog]
		insertAfter(text,afterNode)
		insertAfter(postCount,text)
	}
}

// Classic post form
function showPostFormClassic(hide){
	var formSelector="body>form:not(.greenPostForm)"
	var nameField=query(formSelector+" input[name=name]")
	var optionsField=query(formSelector+" input[name=email]")
	var commentField=query(formSelector+" textarea")
	if(hide){
		if(postForm.classic){
			if(nameField){
				nameField.value=postForm.classic.name.value
				optionsField.value=postForm.classic.options.value
				commentField.value=postForm.classic.comment.value
				lastCommentForm=commentField
			}
			removeChild(postForm.classic.form)
			postForm.classic=0
		}
		return
	}
	if(postForm.classic){
		return
	}
	var username=""
	if(nameField){
		username=nameField.value
	}else{
		var nameMatch=document.cookie.match(/4chan_name=(.*?)(?:;|$)/)
		if(nameMatch){
			username=nameMatch[1]
		}
	}
	postForm.classic=element(
		["form#form",{
			name:"post",
			action:serverurl+"post.php",
			method:"post",
			enctype:"multipart/form-data",
			class:"greenPostForm",
			onsubmit:submitGreenPost
		},
			["input",{
				name:"thread",
				value:threadId,
				type:"hidden"
			}],
			["table",{
				class:"postForm"
			},
				["tbody",
				["tr",
					["td","Name"],
					["td",{
						class:"nameFieldParent"
					},
						(nameField&&
							["button#toggle",{
								class:"greenToggle pressed",
								title:"[s4s] Interface",
								onclick:event=>{
									event.preventDefault()
									event.stopPropagation()
									showPostFormClassic(1)
								}
							},"!"]
						),
						["input#name",{
							type:"text",
							name:"username",
							tabIndex:1,
							placeholder:"Anonymous",
							value:username
						}]
					]
				],
				["tr",
					["td","Options"],
					["td",
						["input#options",{
							type:"text",
							name:"options",
							tabIndex:2,
							value:optionsField?optionsField.value:""
						}],
						["input",{
							type:"submit",
							tabIndex:6,
							value:"Post"
						}]
					]
				],
				["tr",
					["td","Comment"],
					["td",
						["textarea#comment",{
							name:"text",
							tabindex:4,
							cols:48,
							rows:4,
							wrap:"soft",
							value:commentField?commentField.value:""
						}]
					]
				]
				]
			]
		]
	)
	addCommentForm(postForm.classic.comment)
	var originalForm=query("#postForm")
	if(originalForm){
		originalForm=originalForm.parentNode
	}else{
		originalForm=query("body>.closed+*")
		if(!originalForm){
			originalForm=query("#op")
		}
	}
	insertBefore(postForm.classic.form,originalForm)
}

// Native extension initialised
function onNativeextInit(){
	if(mode=="thread"||mode=="index"){
		getUpdateLinks()
		// Native extension quick reply
		unsafeWindow.QR.showInterface=unsafeWindow.QR.show
		var newQRshow=thread=>{
			var event=new CustomEvent("QRNativeDialogCreation",{
				bubbles:true,
				detail:{thread:thread}
			})
			document.dispatchEvent(event)
		}
		if(typeof exportFunction=="function"){
			newQRshow=exportFunction(newQRshow,document.defaultView)
		}
		unsafeWindow.QR.show=newQRshow
	}
}

function onQRCreated(event){
	threadId=event.detail.thread
	try{
		unsafeWindow.QR.showInterface(threadId)
	}catch(e){}
	// Clean up post form if it was initialised before
	var oldToggle=query("#quickReply form:not(.greenPostForm) .greenToggle")
	if(oldToggle){
		removeChild(oldToggle)
	}
	showPostFormQR(1)
	var formSelector="#qrForm"
	var nameField=query(formSelector+" input[name=name]")
	nameField.value=query("#postForm input[name=name]").value
	nameField.tabIndex=0
	var commentField=query(formSelector+" textarea")
	addCommentForm(commentField)
	var toggle=element(
		["button#toggle",{
			type:"button",
			class:"greenToggle",
			title:"[s4s] Interface",
			onclick:event=>{
				event.preventDefault()
				event.stopPropagation()
				showPostFormQR()
			}
		},"!"]
	).toggle
	var nameParent=nameField.parentNode
	nameParent.classList.add("nameFieldParent")
	insertBefore(toggle,nameField)
}

function showPostFormQR(hide){
	var formSelector="#qrForm"
	var nameField=query(formSelector+" input[name=name]")
	var optionsField=query(formSelector+" input[name=email]")
	var commentField=query(formSelector+" textarea")
	if(hide){
		if(postForm.QR){
			nameField.value=postForm.QR.name.value
			optionsField.value=postForm.QR.options.value
			commentField.value=postForm.QR.comment.value
			lastCommentForm=commentField
			removeChild(postForm.QR.form)
			postForm.QR=0
		}
		return
	}
	var qr=query("#quickReply form:not(.greenPostForm)")
	if(postForm.QR||!qr){
		return
	}
	postForm.QR=element(
		["form#form",{
			name:"post",
			action:serverurl+"post.php",
			method:"post",
			enctype:"multipart/form-data",
			class:"greenPostForm",
			onsubmit:submitGreenPost
		},
			["input",{
				name:"thread",
				value:threadId,
				type:"hidden"
			}],
			["div",{
				class:"nameFieldParent"
			},
				["button",{
					type:"button",
					class:"greenToggle pressed",
					title:"[s4s] Interface",
					onclick:event=>{
						showPostFormQR(1)
					}
				},"!"],
				["input#name",{
					type:"text",
					name:"username",
					class:"field",
					placeholder:"Anonymous",
					value:nameField.value
				}]
			],
			["div",
				["input#options",{
					type:"text",
					name:"options",
					class:"field",
					placeholder:"Options",
					value:optionsField.value
				}]
			],
			["div",
				["textarea#comment",{
					name:"text",
					class:"field",
					cols:48,
					rows:4,
					wrap:"soft",
					placeholder:"Comment",
					value:commentField.value
				}],
			],
			["div",
				["span",{
					class:"greenSubmit",
					onclick:event=>{
						submitGreenPost(event,postForm.QR.form)
					}
				},"Post"]
			]
		]
	)
	addCommentForm(postForm.QR.comment)
	insertBefore(postForm.QR.form,qr)
}

// 4chan-X initialised
function on4chanXInit(){
	if(mode=="index"&&document.documentElement.classList.contains("catalog-mode")){
		getGreenPostsCatalog()
	}
}

// 4chan-X QR
function onQRXCreated(){
	getUpdateLinks()
	var formSelector="#qr form:not(.greenPostForm)"
	var commentField=query(formSelector+" textarea")
	addCommentForm(commentField)
	var toggle=element(
		["button#toggle",{
			type:"button",
			class:"greenToggle",
			title:"[s4s] Interface",
			onclick:event=>{
				event.preventDefault()
				event.stopPropagation()
				showPostFormQRX()
			}
		},"!"]
	).toggle
	var qrPersona=query("#qr .persona")
	insertBefore(toggle,qrPersona.firstChild)
}

function showPostFormQRX(hide){
	var formSelector="#qr form:not(.greenPostForm)"
	var nameField=query(formSelector+" input[name=name]")
	var optionsField=query(formSelector+" input[name=email]")
	var commentField=query(formSelector+" textarea")
	if(hide){
		if(postForm.QRX){
			nameField.value=postForm.QRX.name.value
			optionsField.value=postForm.QRX.options.value
			commentField.value=postForm.QRX.comment.value
			lastCommentForm=commentField
			removeChild(postForm.QRX.form)
			postForm.QRX=0
		}
		return
	}
	var qrx=query(formSelector)
	if(postForm.QRX||!qrx){
		return
	}
	threadId=query("#qr select[data-name=thread]").value
	postForm.QRX=element(
		["form#form",{
			name:"post",
			action:serverurl+"post.php",
			method:"post",
			enctype:"multipart/form-data",
			class:"greenPostForm",
			onsubmit:submitGreenPost
		},
			["input",{
				name:"thread",
				value:threadId,
				type:"hidden"
			}],
			["div",{
				class:"persona"
			},
				["button",{
					type:"button",
					class:"greenToggle pressed",
					title:"[s4s] Interface",
					onclick:event=>{
						showPostFormQRX(1)
					}
				},"!"],
				["input#name",{
					name:"username",
					class:"field",
					placeholder:"Name",
					size:1,
					value:nameField.value
				}],
				["input#options",{
					name:"options",
					class:"field",
					placeholder:"Options",
					size:1,
					value:optionsField.value
				}]
			],
			["textarea#comment",{
				name:"text",
				class:"field",
				placeholder:"Comment",
				value:commentField.value
			}],
			["div",{
				class:"file-n-submit"
			},
				["input",{
					type:"submit",
					value:"Submit"
				}]
			]
		]
	)
	addCommentForm(postForm.QRX.comment)
	insertBefore(postForm.QRX.form,qrx)
}


// Track last used comment field for inserting quotes
function addCommentForm(commentField,notLast){
	if(!notLast){
		lastCommentForm=commentField
	}
	commentField.addEventListener("focus",event=>{
		lastCommentForm=event.currentTarget
	})
}

function insertQuote(event){
	var commentField=lastCommentForm
	if(commentField&&document.contains(commentField)){
		event.preventDefault()
		event.stopPropagation()
		var isQRX=commentField.closest("#qr")
		if(isQRX){
			isQRX.hidden=0
		}
		var text=">>"+event.currentTarget.firstChild.data+"\n"
		var caretPos=commentField.selectionStart
		commentField.value=
			commentField.value.slice(0,caretPos)
			+text
			+commentField.value.slice(commentField.selectionEnd)
		var range=caretPos+text.length
		commentField.setSelectionRange(range,range)
		commentField.focus()
	}
}

// Manually update thread with green posts
function getUpdateLinks(){
	var update=queryAll("[data-cmd=update],.updatelink>a")
	for(var i=0;i<update.length;i++){
		if(!updateLinks.has(update[i])){
			update[i].addEventListener("click",event=>{
				getGreenPosts(threadId)
			})
			updateLinks.add(update[i])
		}
	}
}

// Submit a green post
function submitGreenPost(event,form){
	event.preventDefault()
	event.stopPropagation()
	if(!form){
		form=event.currentTarget
	}
	var submit={}
	submit.button=form.querySelector(":scope input[type=submit],:scope .greenSubmit")
	submit.fakeButton=submit.button.classList.contains("greenSubmit")
	if(submit.fakeButton){
		submit.text=submit.button.firstChild.data
		submit.button.firstChild.data="..."
		submit.button.classList.add("greenSubmitDisabled")
	}else{
		submit.text=submit.button.value
		submit.button.value="..."
		submit.button.disabled=1
	}
	var data=[]
	var formData=new FormData(form)
	for(var nameValue of formData){
		data.push(
			nameValue[0]+"="
			+encodeURIComponent(nameValue[1].replace(/\r?\n/g,"\r"))
		)
	}
	data=data.join("&")
	GM.xmlHttpRequest({
		method:"post",
		headers:{
			"Content-type":"application/x-www-form-urlencoded"
		},
		url:serverurl+"post.php",
		data:data,
		onload:response=>{
			if(response.status==200){
				if(/Post Successful/.test(response.responseText)){
					form.getElementsByTagName("textarea")[0].value=""
					if(mode=="thread"){
						getGreenPosts(threadId)
					}else{
						alert("Post successful")
					}
				}else{
					return postSubmitted(submit,response.status,response.responseText)
				}
			}
			postSubmitted(submit,response.status)
		},
		onerror:response=>{
			postSubmitted(submit)
		}
	})
}

function postSubmitted(submit,errorCode,responseText){
	if(submit.fakeButton){
		submit.button.firstChild.data=submit.text
		submit.button.classList.remove("greenSubmitDisabled")
	}else{
		submit.button.value=submit.text
		submit.button.disabled=0
	}
	if(errorCode==200){
		if(responseText){
			alert("Could not submit post ("+responseText+")")
		}
	}else{
		var alertText="Could not connect to the [s4s] interface"
		if(errorCode){
			alertText+=" ("+errorCode+")"
		}
		alert(alertText)
	}
}

//updates native 4chan posts with whatever, atm it's only fixing links
function updatePosts() {
  var posts=document.querySelectorAll('.postMessage:not(.interfaced)');
    for(var i=0;i<posts.length;i++){
    var post = posts[i];
    post.classList.add('interfaced');
    replaceInterfaceLinks(post);
   }
}

// add listenering for when posts are inserted.
document.addEventListener('4chanParsingDone',updatePosts)
document.addEventListener('PostsInserted',updatePosts)

// Stylesheet
onPageLoad(_=>{

var stylesheet=`
.greenPostForm+form .postForm>tbody>tr:not(.rules),
#quickReply .greenPostForm+form,
#qr .greenPostForm+form,
#qr:not(.reply-to-thread) .greenToggle:not(.pressed){
	display:none!important;
}
.greenPostForm .file-n-submit{
	display:flex;
	align-items:stretch;
	justify-content:flex-end;
	height:25px;
	margin-top:1px;
}
.greenPostForm .file-n-submit input{
	width:25%;
	background:linear-gradient(to bottom,#f8f8f8,#dcdcdc) no-repeat;
	border:1px solid #bbb;
	border-radius:2px;
	height:100%;
}
.greenPostContainer .post.reply{
	background-color:#dfd!important;
	border:2px solid #008000!important;
}
.greenPostContainer .postMessage{
	color:#000!important;
}
.greenToggle{
	font-family:monospace;
	font-size:16px;
	line-height:17px;
	background:#ceb!important;
	width:24px;
	padding:0;
	border:1px solid #bbb;
}
.greenPostForm input:not([type=submit]),
.greenPostForm textarea{
	background-color:#dfd;
	color:#000;
}
.greenToggle.pressed{
	background:#6d6!important;
	font-weight:bold;
	color:#fff;
}
.postForm .greenToggle+input{
	width:220px!important;
}
.postForm .nameFieldParent,
#quickReply .nameFieldParent{
	display:flex;
	flex-direction:row;
}
.postForm textarea{
	width:292px;
}
#quickReply .greenToggle{
	width:23px;
	height:23px;
}
#quickReply .greenToggle+input{
	width:273px!important;
}
.greenSubmit{
	display:inline-block;
	width:75px;
	float:right;
	padding:1px 6px;
	text-align:center;
	border:1px solid #adadad;
	background-color:#e1e1e1;
	box-sizing:border-box;
	user-select:none;
	font:400 13.3333px Arial,sans-serif;
	font:-moz-button;
	color:#000;
	cursor:default;
}
.greenSubmit:hover{
	border-color:#0078d7;
	background-color:#e5f1fb;
}
.greenSubmit:active{
	border-color:#005499;
	background-color:#cce4f7;
}
.greenSubmitDisabled{
	color:#808080;
	pointer-events:none;
}
.greenPostCount{
	color:#060;
}
.greenPostContainer .hide-reply-button{
	opacity:0!important;
	pointer-events:none;
}
a.newGreenPost:not(:hover) {
	color: green !important;
}
.greenPostForm {
  display: table;
  margin: auto;
}
@media only screen and (max-width:480px){
	.postForm .greenToggle+input{
		width:196px!important;
	}
	.postForm input[type="submit"]{
		width:60px;
		padding:2px 4px 3px;
		margin:0;
	}
	.postForm:not(.hideMobile){
		margin-top:20px;
	}
}
`.replace(/\n\s*/g,"")
element(
	document.head||document.documentElement,
	["style",{
		id:"s4sinterface-css"
	},stylesheet]
)
})

function padding(string,num){
	return (""+string).padStart(num,0)
}

function query(selector){
	return document.querySelector(selector)
}

function queryAll(selector){
	return document.querySelectorAll(selector)
}

function insertBefore(newElement,targetElement){
	return targetElement.parentNode.insertBefore(newElement,targetElement)
}

function insertAfter(newElement,targetElement){
	var nextSibling=targetElement.nextSibling
	if(nextSibling){
		return insertBefore(newElement,nextSibling)
	}else{
		return targetElement.parentNode.appendChild(newElement)
	}
}

function removeChild(targetElement){
	return targetElement.parentNode.removeChild(targetElement)
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
						if(!j&&typeof current[j]=="string"){
							var tagname=current[0].split("#")
							lasttag=createdtag=document.createElement(tagname[0])
							if(tagname[1]){
								toreturn[tagname[1]]=createdtag
							}
						}else if(current[j].constructor==Object){
							if(lasttag){
								for(var value in current[j]){
									if(value!="style"&&value in lasttag){
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
