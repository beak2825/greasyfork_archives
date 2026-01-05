// ==UserScript==
// @name Upboats
// @namespace upboats
// @version 2015.08.16
// @include *://boards.4chan.org/*
// @grant GM_xmlhttpRequest
// @description Adds upvote and downvote buttons to 4chan threads
// @downloadURL https://update.greasyfork.org/scripts/16674/Upboats.user.js
// @updateURL https://update.greasyfork.org/scripts/16674/Upboats.meta.js
// ==/UserScript==
'use strict';

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

function giveboats(startfrom,query){
	var posts=[]
	for(var i=startfrom||0;i<query.length;i++){
		if(!query[i].getElementsByClassName('boatcontainer').length){
			var theid=query[i].id.match(/\d+/)[0]
			posts.push(theid)
			var cnt=element('div',0,{
				class:'boatcontainer',
				'data-boat':theid
			})
			element('div',cnt,{
				class:'upboat'
			}).onclick=function(event){
				boat(event,'+')
			}
			element('div',cnt,{
				class:'boatsnum'
			},'\u2022').onclick=function(event){
				boat(event,'*')
			}
			element('div',cnt,{
				class:'downboat'
			}).onclick=function(event){
				boat(event,'-')
			}
			if(query[i].classList.contains('opContainer')){
				var sidearrows=query[i].getElementsByClassName('postMessage')[0]
				sidearrows.parentNode.insertBefore(cnt,sidearrows)
			}else{
				var sidearrows=query[i].getElementsByClassName('sideArrows')[0]
				sidearrows.parentNode.replaceChild(cnt,sidearrows)
			}
		}
	}
	if(posts.length){
		getboats(posts)
	}
}

function boat(event,upordown){
	var postnumber=event.target.parentNode.getAttribute('data-boat')
	GM_xmlhttpRequest({
		method:'get',
		url:'http://kek.grn.cc/boat/?r='+upordown+'&brd='+currentboard+'&tid='+postnumber,
		onload:function(response){
			if(response.status==200){
				var boats=response.responseText.replace(/\n$/,'').split(' ')
				var post=event.target.parentNode
				if(upordown=='*'){
					boats=boats.splice(1)
				}
				boatready(boats,post)
			}
		}
	})
}

function getboats(posts){
	if(posts.length>101){
		posts.splice(1,posts.length-101)
	}
	posts=posts.join(',')
	GM_xmlhttpRequest({
		method:'post',
		headers:{
			'Content-type':'application/x-www-form-urlencoded'
		},
		url:'http://kek.grn.cc/boat/?r=*&brd='+currentboard,
		data:'tid='+posts,
		onload:function(response){
			if(response.status==200){
				var boatarray=response.responseText.replace(/\n$/,'').split('\n')
				for(var i=0;i<boatarray.length;i++){
					if(boatarray[i].length){
						var boats=boatarray[i].split(' ')
						var post=document.querySelector('[data-boat="'+boats[0]+'"]')
						boatready(boats.splice(1),post)
					}
				}
			}
		}
	})
}

function boatready(boats,post){
	var upboat=post.getElementsByClassName('upboat')[0]
	var downboat=post.getElementsByClassName('downboat')[0]
	var number=post.getElementsByClassName('boatsnum')[0]

	if(upboat&&downboat&&number){
		upboat.className='upboat'
		downboat.className='downboat'
		if(boats[0]=='+'){
			upboat.className='upboat highboat'
		}else if(boats[0]=='-'){
			downboat.className='downboat highboat'
		}
		number.innerHTML=boats[1]-boats[2]||'\u2022'
		number.title='Up: '+boats[1]+', Down: '+boats[2]
	}
}

function updateposts(){
	if(!waiting){
		waiting=1
		setTimeout(function(){
			var query=document.querySelectorAll('.replyContainer,.opContainer')
			if(cachr<query.length){
				giveboats(cachr,query)
				cachr=query.length
			}
			waiting=0
		},100)
	}
}

var currentboard=location.pathname.match(/^\/([^\/]+)\//)
if(currentboard){
	currentboard=currentboard[1]
}else{
	currentboard=''
}
var cachr=0
var waiting=0

if(currentboard){
	updateposts()
	document.addEventListener('4chanParsingDone',updateposts)
}

element('style',document.head,0,'\
.boatcontainer{\
	display:inline-block;\
	font-family:verdana;\
	float:left;\
	vertical-align:top;\
	margin-top:5px;\
	width:31px;\
}\
.opContainer .boatcontainer{\
	float:none;\
	margin-top:-20px;\
}\
.boatsnum{\
	width:30px;\
	height:16px;\
	font-size:13px;\
	color:#c6c6c6;\
	font-weight:bold;\
	text-align:center;\
	cursor:default;\
}\
.downboat{\
	background-position:-15px 0;\
}\
.highboat.upboat{\
	background-position:0 -14px;\
}\
.highboat.downboat{\
	background-position:-15px -14px;\
}\
.upboat,.downboat{\
	cursor:pointer;\
	margin:0 auto;\
	width:15px;\
	height:14px;\
	background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAcCAMAAABBJv+bAAAAkFBMVEX///+3t7e9vb2UlP/b29v/s5e0tP+4uLi+vr7/i2C8vLzU1NTOzs7/jGG2trb/k2uamv+np/+urv+hof//rI3/o4H/m3bCwsLc3NzT09P/mXPKysrNzc3/v6f/lW3Y2NjHx8fBwcG7u/+pqf//pob/uqGwsP//rY6bm/+env+Skv/Bwf/AwMDIyMi/v///il5tvt3qAAAAAXRSTlMAQObYZgAAAPtJREFUeF590QeOhTAMRVE79N75vdfp+9/dOAP8PBRpLhIIHWRCoDEmaOm67pIgjgNgN0lWLmgQsmLDh+02PYCemPnT+Op4/ErMZNFc/DU/XSxO6UvDPM/F83DyjYrjzTRZsTaWFBOHSmIOVCiHfT9/GqfZ78K1WCu1vwS/094H3CV7F3GP//8HNC9D/NDNtMiQfd//Rt1He/BzXddn0HUURWvjflVV/lzR703T3GHyX2b+pSzLy0x/RneeOscZr6K6LBuv4o70rk+iQ9eiKK40NDgqPfq+f9DkbxrlTFNe13UeoaPSrW3bGxl/wmRp53nejsBLUWAdQZP+As6xFYUbzgTbAAAAAElFTkSuQmCC")\
}'.replace(/\s+/g,' ').replace(/\/\*((?!\*\/).)*\*\//g,'').replace(/;? ?} ?/g,'}').replace(/ ?([{,;]) ?/g,'$1'))
