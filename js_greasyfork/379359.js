// ==UserScript==
// @name CollabVM Autopaste (beta)
// @description Press Ctrl+Shift+V to paste your clipboard into the VM
// @namespace collabvm
// @version 2017.05.09b2
// @match http://computernewb.com/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/379359/CollabVM%20Autopaste%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/379359/CollabVM%20Autopaste%20%28beta%29.meta.js
// ==/UserScript==

/* paste( string <string>, [interval <ms>] )
	Takes "string" value and pastes into VM. Can be called from Dev Console. "interval" value sets initial interval between each character
*/
function paste(string,interval){
	// Prevent function from being called before previous pasting finishes
	if(cfg.pastelock){
		return
	}
	if(cfg.paused&&(""+string)==cfg.string){
		cfg.paused=0
		return next()
	}
	// Reset configuration
	cfg=new defaultconfig({
		string:""+string,
		length:string.length,
		pastelock:1,
		interval:interval||0,
		iterate:iterate(),
		starttime:+new Date
	})
	if(/^\s*{#(\s+\$?\w+|\s)*}/.test(cfg.string)){
		cfg.script=1
		cfg.persistent=1
		parsegoto()
	}
	return next()
}
window.paste=paste
/* defaultconfig( override <1D object> )
	Object constructor that contains default configuration for pasting, object will override and add values to it
*/
function defaultconfig(override){
	this.pastepos=0
	this.goto={}
	this.pastelock=0
	this.shift=0
	this.persistent=0
	this.lastgoto=0
	this.modiflers=0
	this.variables={
		enter:"\n",
		tab:"\t",
		space:" ",
		comma:",",
		get hasturn(){
			return +hasTurn
		},
		get vmip(){
			return serverAddress
		},
		get vmname(){
			return vmName
		},
		get username(){
			return username
		},
		get timestamp(){
			return +new Date-cfg.starttime
		},
		get interval(){
			return cfg.interval
		}
	}
	if(override){
		for(var i in override){
			this[i]=override[i]
		}
	}
}
var cfg=new defaultconfig()
/* parsegoto()
	Allows functions like {goto} and {if} to work
*/
function parsegoto(){
	var regx=/({if\s+[^}]+})|({else})|({endif})|{:(\w+)}/g
	var ifgroup={
		id:0,
		level:0,
		lastid:{}
	}
	var matches
	var getmatches=()=>{
		matches=regx.exec(cfg.string)
		return matches
	}
	while(getmatches()){
		if(matches[1]){ // if
			var thisif=ifgroup.level+" "+ifgroup.id
			ifgroup.lastid[ifgroup.level]=thisif
			addtoobject(cfg.goto,{
				type:"if",
				id:thisif,
				ifpos:regx.lastIndex
			},thisif,regx.lastIndex)
			ifgroup.level++
			ifgroup.id++
		}else if(matches[2]){ // else
			var thisif=ifgroup.lastid[ifgroup.level-1]
			var thisgoto=cfg.goto[thisif]
			if(thisgoto&&!thisgoto.elsepos&&!thisgoto.endifpos){
				addtoobject(cfg.goto,{
					elsepos:regx.lastIndex
				},thisif,regx.lastIndex)
			}
		}else if(matches[3]){ // endif
			var thisif=ifgroup.lastid[ifgroup.level-1]
			var thisgoto=cfg.goto[thisif]
			if(thisgoto&&!thisgoto.endifpos){
				addtoobject(cfg.goto,{
					endifpos:regx.lastIndex
				},thisif,regx.lastIndex)
				ifgroup.level--
			}
		}else if(matches[4]){ // label
			addtoobject(cfg.goto,{
				type:"label",
				labelpos:regx.lastIndex
			},"label "+matches[4],regx.lastIndex)
		}
	}
}
/* addtoobject( toobj <object>, fromobj <1D object>, objname <string>, [...objcopy <string>] )
	Merges objects toobj[objname] with fromobj and optionally copies to objcopy
*/
function addtoobject(toobj,fromobj,objname,...objcopy){
	var names=convert(name,"stack")
	if(!toobj[objname]||toobj[objname].constructor!=Object){
		toobj[objname]={}
	}
	for(var key in fromobj){
		toobj[objname][key]=fromobj[key]
	}
	for(var i in objcopy){
		toobj[objcopy[i]]=toobj[objname]
	}
}
/* next( [delay <bool>] )
	Calls the "iterate" generator function after last "yield". When "delay" is set it will add a key pasting interval
*/
function next(delay){
	if(delay){
		return sleep(cfg.interval,next)
	}else{
		return cfg.iterate.next()
	}
}
/* sleep( time <ms>, func <function> )
	setTimeout with parameters swapped. Will wait for one frame if time is 0
*/
function sleep(time,func){
	if(time>0){
		return setTimeout(a=>func(),time)
	}else{
		return requestAnimationFrame(a=>func())
	}
}
/* iterate()
	Asynchronous function that loops on each pasted character with various delays. This is a generator function: on each "yield" the function pauses and can be resumed with "cfg.iterate.next()"
*/
function* iterate(){
	// Wait until both ctrl and shift get released
	var unpressed=0
	while(!unpressed){
		unpressed=1
		for(var i in pressedkeys){
			if(pressedkeys[i]){
				unpressed=0
				yield sleep(0,next)
				break
			}
		}
	}
	setFocus(1)
	while(cfg.pastepos<cfg.length){
		while(pressedkeys.shift){
			// Pause when holding Shift
			yield sleep(50,next)
		}
		if(!hasTurn&&!cfg.persistent||pressedkeys.ctrl||!cfg.length){
			// Exit on Ctrl press
			yield exit()
		}
		if(cfg.script){
			var scriptvar=parsescript()
			if(scriptvar<0){
				yield
			}else if(scriptvar>0){
				yield next(1)
			}
		}else{
			sendchar(cfg.string[cfg.pastepos])
			cfg.pastepos++
			yield next(1)
		}
	}
	yield exit()
}
/* parsescript()
	Will try to find function blocks and execute them, otherwise print a character to VM
*/
function parsescript(){
	var held={}
	var funcname=""
	var funcargs=""
	var funcargsstring=""
	var functype=""
	var f
	var var0start=0
	var close
	var spaces=0
	var freturn=f=>{
		if(f.halt){
			return -1
		}else if(f.delay){
			return 1
		}else{
			return 0
		}
	}
	var scriptdone=()=>{
		if(cfg.poslock){
			cfg.poslock=0
		}else{
			cfg.pastepos=pos
		}
		return f?freturn(f):0
	}
	for(var pos=cfg.pastepos;pos<cfg.length+1;pos++){
		var thischar=cfg.string.charAt(pos)
		// This large if-else block is suggested to be read from bottom to top
		if(pos>=cfg.length&&!var0start){
			if(spaces){
				return scriptdone()
			}else{
				break
			}
		}else if(spaces){
			if(!(/\s/.test(thischar))){
				return scriptdone()
			}
		}else if(var0start){
			// Get var0, parameter between start and end tags
			if(f.rawclose){
				close=f.rawclose
			}else{
				close="{"+f.close+"}"
			}
			var end=var0start+close.length
			if(thischar==close[0]||end>cfg.length){
				if(end>cfg.length){
					// There was no end tag, use remaining part of string
					var var0=cfg.string.slice(var0start)
					pos=cfg.length
				}else{
					var closetag=cfg.string.slice(pos,pos+close.length)
					if(closetag.toLowerCase()==close){
						// Close tag found
						var var0=cfg.string.slice(var0start,pos)
						pos+=close.length-1
					}
				}
				if(var0||var0===""){
					cfg.pastepos=pos+1
					if(funcargs.length==1&&funcargs[0]===""){
						if(f.run){
							if(var0===""){
								f.run()
							}else{
								f.run(var0)
							}
						}
					}else{
						f.run(var0,...funcargs)
					}
					spaces=1
				}
			}
		}else if(functype){
			if(!funcargs&&/[^\s}]/.test(thischar)){
				// Get function name, symbol by symbol
				funcname+=thischar
			}else if(funcname){
				if(!funcargs){
					funcname=funcname.toLowerCase()
					if(func[funcname]){
						f=func[funcname]
						functype="func"
					}else if(key[funcname]){
						functype="key"
					}else if(/:\w+/.test(funcname)){
						spaces=1
					}else{
						// Function with that name wasn't found
						break
					}
				}
				if(thischar=="}"&&funcargsstring!='"'){
					// Execute function
					// Get arguments with and without quotes
					funcargs=funcargs.trim().match(/"(?:\\"|.)*?"|[^\s]+/g)||[]
					if(functype=="func"){
						cfg.pastepos=pos+1
						if(f.held){
							funcargs.unshift(held)
						}
						if(f.close||f.rawclose){
							var lastarg=funcargs[funcargs.length-1]
							if(lastarg&&lastarg.toLowerCase()=="end"){
								funcargs.splice(funcargs.length-1)
								funcargs.unshift("")
							}else{
								var0start=pos+1
								continue
							}
						}
						if(f.run){
							if(!funcargs.length||funcargs.length==1&&funcargs[0]===""){
								f.run()
							}else{
								f.run(...funcargs)
							}
						}
						spaces=1
					}else if(functype=="key"){
						func.key.run(held,funcname,...funcargs)
						spaces=1
					}
				}else if(funcargs||thischar==" "){
					funcargs+=thischar
					if(thischar==" "&&funcargsstring!='"'){
						funcargsstring=" "
					}
					if(thischar=='"'&&funcargsstring==" "){
						funcargsstring='"'
					}
					if(thischar=='"'&&funcargsstring=='"'){
						funcargsstring=""
					}
				}else{
					// Invalid character in function name
					break
				}
			}else{
				// There is an invalid character right after {
				break
			}
		}else if(thischar=="{"){
			// Function character found
			functype="found"
		}else if(/[+^!#]/.test(thischar)){
			// The function may look like this:
			// +^!#{enter} (shift+ctrl+alt+win+enter)
			if(held[thischar]){
				// A character repeated
				break
			}else{
				held[thischar]=1
			}
		}else if(/\s/.test(thischar)){
			// There was a space after +^!# so it's not a function
			if(Object.keys(held).length){
				break
			}
		}else{
			// Not function
			break
		}
		// Large if-else block ends here
	}
	sendchar(cfg.string[cfg.pastepos])
	cfg.pastepos++
	return 1
}
/* exit()
	When pasting finishes, this function is called to unlock pasting again
*/
function exit(){
	if(cfg.shift){
		sendmessage("key",key.shift,0)
	}
	cfg.pastelock=0
}
/* sendkey( thiskey <keycode> )
	Presses and releases a key on VM
*/
function sendkey(thiskey){
	sendmessage("key",thiskey,1)
	return sendmessage("key",thiskey,0)
}
/* sendmessage ( ...args <string,int> )
	Passes messages to VM with some safety added
*/
function sendmessage(...args){
	var var1=args[0]
	if(tunnel&&tunnel.state==1&&var1!="\x76o\x74e"&&(hasTurn||var1!="key"&&var1!="mouse")){
		try{
			return tunnel.sendMessage(...args)
		}catch(e){}
	}
}
/* sendmouse ( x <int>, y <int>, l <bool>, m <bool>, r <bool>, wu <bool>, wd <bool> )
	Sends mouse position and button state to VM. Buttons ("l", "m", and "r"), as well as scroll wheel ("wu" and "wd") need to be reverted to "false" to stop pressing or scrolling
*/
function sendmouse(...mouse){
	try{
		guac.sendMouseState(new Guacamole.Mouse.State(...mouse))
	}catch(e){}
}
/* sendchar( thischar <char> )
	Presses one character on VM, holding shift when necessary
*/
function sendchar(thischar){
	if(hasTurn&&thischar){
		if(!cfg.modiflers){
			cfg.modiflers=1
			// Release all modifler keys that might had been held on VM
			var releasekeys=[
				key.shift,
				key.rshift,
				key.ctrl,
				key.rctrl,
				key.caps,
				key.alt,
				key.ralt,
				key.win
			]
			releasekeys.forEach(val=>{
				sendmessage("key",val,0)
			})
		}
		var charcode=thischar.charCodeAt(0)
		if(/[~!@#$%^&*()_+{}:"|<>?A-Z]/.test(thischar)){
			if(!cfg.shift){
				sendmessage("key",key.shift,1)
				cfg.shift=1
			}
			return sendkey(charcode)
		}else{
			if(cfg.shift){
				sendmessage("key",key.shift,0)
				cfg.shift=0
			}
			if(thischar=="\n"){
				return sendkey(key.enter)
			}else if(thischar=="\t"){
				return sendkey(key.tab)
			}else{
				return sendkey(charcode)
			}
		}
	}
}
var key={
	back:65288,
	tab:65289,
	enter:65293,
	esc:65307,
	home:65360,
	pgup:65365,
	pgdn:65366,
	end:65367,
	ins:65379,
	f1:65470,
	f2:65471,
	f3:65472,
	f4:65473,
	f5:65474,
	f6:65475,
	f7:65476,
	f8:65477,
	f9:65478,
	f10:65479,
	f11:65480,
	f12:65481,
	del:65535,
	left:65361,
	up:65362,
	right:65363,
	down:65364,
	menu:65383,
	shift:65505,
	rshift:65506,
	ctrl:65507,
	rctrl:65508,
	caps:65509,
	alt:65513,
	ralt:65514,
	win:65515,
	space:32
}
var symbols="0123456789abcdefghijklmnopqrstuvwxyz`-=[];'\,./"
for(var i=0;i<symbols.length;i++){
	key[symbols.charAt(i)]=symbols.charCodeAt(i)
}
/* func
	Singleton object containing all functions supported by scripting
*/
var func={
	"goto":{
		run:function(var1){
			this.delay=0
			var label
			if(isvalidvar(var1)){
				label=getvar(var1)
			}else{
				label=var1
			}
			if(label){
				var pos=cfg.goto["label "+label]
				if(pos){
					cfg.lastgoto=pos.labelpos
					changepos(pos.labelpos)
					if(pos.hits){
						pos.hits++
					}else{
						pos.hits=1
					}
					if(pos.hits>10){
						pos.hits=1
						this.delay=1
						return
					}
				}
			}
		}
	},
	":":{
		rawclose:"\n"
	},
	"::":{
		close:"::"
	},
	"#":{
		run:function(var1){
			if(var1&&var1.toLowerCase()=="persistent"){
				cfg.persistent=1
			}else{
				cfg.persistent=0
			}
		}
	},
	"sleep":{
		halt:1,
		run:function(var1){
			var ms=getvar(var1,"number")
			if(ms<0){
				ms=0
			}
			sleep(ms,next)
		}
	},
	"pause":{
		halt:1,
		run:function(){
			cfg.paused=1
			exit()
		}
	},
	"turn":{
		delay:1,
		run:function(){
			if(!hasTurn){
				sendmessage("turn")
			}
		}
	},
	"sendmessage":{
		run:function(var1){
			sendmessage(...getvar(var1,"stack"))
		}
	},
	"if":{
		run:function(var1,var2,var3){
			var args=arguments
			if(var1=="not"){
				var left=getvar(var2)
				var middle=var1
				var right=0
			}else{
				var left=getvar(var1)
				var middle=var2||""
				var right=getvar(var3)
			}
			if(Array.isArray(left)||isnum(left)&&!isnum(right)){
				// if left is stack or if left is number and right is string
				left=convert(left,"string")
			}
			if(Array.isArray(right)||!isnum(left)&&isnum(right)){
				right=convert(right,"string")
			}
			var output=()=>{
				switch(middle){
					case "":{
						return !!left
					}
					case "=":
					case "==":{
						return left==right
					}
					case "!=":{
						return left!=right
					}
					case "<":{
						return left<right
					}
					case ">":{
						return left>right
					}
					case "<=":{
						return left<=right
					}
					case ">=":{
						return left>=right
					}
					case "not":{
						return !left
					}
				}
			}
			var pos=cfg.goto[cfg.pastepos]
			if(output()){
				if(pos&&pos.type=="if"){
					pos.sameif=cfg.lastgoto
				}
			}else{
				if(pos&&pos.type=="if"&&(pos.elsepos||pos.endifpos)){
					changepos(pos.elsepos||pos.endifpos)
				}else{
					exit()
				}
			}
		}
	},
	"else":{
		run:function(){
			var pos=cfg.goto[cfg.pastepos]
			if(pos&&pos.sameif==cfg.lastgoto){
				if(pos.endifpos){
					changepos(pos.endifpos)
				}else{
					exit()
				}
			}
		}
	},
	"endif":{
	},
	"set":{
		close:"endset",
		run:function(var0,var1,var2){
			setvar(var1,combinevars(var0,var2,1))
		}
	},
	"add":{
		run:function(var1,var2){
			var left=getvar(var1,"number")
			var right=getvar(var2,"number")
			setvar(var1,left+right)
		}
	},
	"sub":{
		run:function(var1,var2){
			var left=getvar(var1,"number")
			var right=getvar(var2,"number")
			setvar(var1,left-right)
		}
	},
	"mul":{
		run:function(var1,var2){
			var left=getvar(var1,"number")
			var right=getvar(var2,"number")
			setvar(var1,left*right)
		}
	},
	"div":{
		run:function(var1,var2){
			var left=getvar(var1,"number")
			var right=getvar(var2,"number")
			setvar(var1,Math.round(left/right))
		}
	},
	"mod":{
		run:function(var1,var2){
			var left=getvar(var1,"number")
			var right=getvar(var2,"number")
			setvar(var1,left%right)
		}
	},
	"abs":{
		run:function(var1,var2){
			var left=getvar(var1,"number")
			setvar(var1,Math.abs(left))
		}
	},
	"math":{
		run:function(var1,...num){
			var operator="+"
			var output=0
			for(var i=0;i<num.length;i++){
				switch(num[i]){
					case "+":case "-":case "*":case "/":
						operator=num[i]
						break
					default:switch(operator){
						case "+":
							output+=getvar(num[i],"number")
							break
						case "-":
							output-=getvar(num[i],"number")
							break
						case "*":
							output*=getvar(num[i],"number")
							break
						case "/":
							output/=getvar(num[i],"number")
							break
					}
				}
			}
			if(!isFinite(output)){
				output=0
			}
			setvar(var1,Math.round(+output))
		}
	},
	"rand":{
		run:function(var1,var2,var3){
			var right=getvar(var2)
			var outputstack=Array.isArray(right)
			if(outputstack){
				var min=0
				var max=right.length-1
				if(max<0){
					return setvar(var1,"")
				}
			}else{
				var min=convert(right,"number")
				var max=getvar(var3,"number")
				if(min>max){
					[min,max]=[max,min]
				}
			}
			var output=Math.floor(Math.random()*(max-min+1))+min
			if(outputstack){
				setvar(var1,right[output])
			}else{
				setvar(var1,output)
			}
		}
	},
	"setchar":{
		run:function(var1,var2){
			var right=getvar(var2,"stack")
			var output=""
			for(var i=0;i<right.length;i++){
				output+=String.fromCodePoint(convert(right[i],"number"))
			}
			setvar(var1,output)
		}
	},
	"getchar":{
		run:function(var1,var2){
			var right=getvar(var2,"string")
			var output=[]
			for(var i=0;i<right.length;i++){
				output.push(right[i].charCodeAt(i))
			}
			setvar(var1,output)
		}
	},
	"indexof":{
		run:function(var1,var2,var3){
			var left=getvar(var1)
			if(isnum(left)){
				left+=""
			}
			var right=getvar(var2,"string")
			var output=left.indexOf(right)
			setvar(var3,output)
		}
	},
	"replace":{
		run:function(var1,var2,var3){
			var left=getvar(var1)
			var outputstack=Array.isArray(left)
			left=convert(left,"stack")
			var search=getvar(var2,"string")
			var replace=getvar(var3,"string")
			for(var i in left){
				left[i]=convert(left[i],"string").split(search).join(replace)
			}
			if(outputstack){
				setvar(var1,left)
			}else{
				setvar(var1,left[0])
			}
		}
	},
	"strlower":{
		run:function(var1){
			var left=getvar(var1,"string")
			setvar(var1,left.toLowerCase())
		}
	},
	"strupper":{
		run:function(var1){
			var left=getvar(var1,"string")
			setvar(var1,left.toUpperCase())
		}
	},
	"trim":{
		run:function(var1){
			var left=getvar(var1)
			if(isnum(left)){
				var1+=""
			}else if(Array.isArray(left)){
				var empty=[]
				var emptystart
				var notempty
				var emptyend
				for(var i in left){
					empty.push(!left[i].trim())
					if(empty[i]){
						if(i==0){
							emptystart=1
						}else if(notempty&&i==left.length-1){
							emptyend=1
						}
					}else{
						notempty=1
					}
				}
				if(notempty){
					if(emptyend){
						for(var i=left.length;i--;){
							if(!empty[i]){
								left.splice(i+1)
								break
							}
						}
					}
					if(emptystart){
						for(var i in left){
							if(!empty[i]){
								left.splice(0,i)
								break
							}
						}
					}
				}else{
					left=[]
				}
				setvar(var1,left)
			}else{
				setvar(var1,left.trim())
			}
		}
	},
	//{slice $string $startpos $endpos}
	"slice":{
		run:function(var1,var2,var3){
			var left=getvar(var1)
			if(isnum(left)){
				var1+=""
			}
			var start=getvar(var2,"number")
			var end
			if(var3){
				end=getvar(var3,"number")
			}
			var output=left.slice(start,end)
			setvar(var1,output)
		}
	},
	"stack":{
		run:function(var1,var2,var3,var4){
			var stack
			var varn1
			var prepare=returned=>{
				return preparevar(var1,"stack",returned)
			}
			var funcs={
			empty:function(){
				cfg.variables[varn1]=[]
			},
			push:function(){
				prepare()
				return cfg.variables[varn1].push(getvar(var3))
			},
			unshift:function(){
				prepare()
				return cfg.variables[varn1].unshift(getvar(var3))
			},
			get:function(){
				var pos=getvar(var3,"number")
				var prepared=prepare(1)
				if(pos>=0&&pos<prepared.length){
					return setvar(var4,prepared[pos])
				}
			},
			set:function(){
				var pos=getvar(var3,"number")
				if(pos>=0){
					prepare()
					cfg.variables[varn1][pos]=getvar(var4)
				}
			},
			remove:function(){
				if(var3>=0&&var3<stack.length){
					prepare()
					return setvar(var4,stack.splice(var3,1))
				}
			},
			shift:function(){
				prepare()
				return setvar(var3,stack.shift())
			},
			pop:function(){
				prepare()
				return setvar(var3,stack.pop())
			},
			length:function(){
				return setvar(var3,prepare(1).length)
			},
			join:function(){
				return setvar(var3,convert(stack,"string",getvar(var4)))
			},
			split:function(){
				return setvar(var1,getvar(var3,"string").split(getvar(var4)))
			}
			}
			if(isvar(var1)){
				varn1=varname(var1)
				stack=cfg.variables[varn1]
				if(var2 in funcs){
					return funcs[var2]()
				}
			}
		}
	},
	"text":{
		close:"endtext",
		halt:1,
		run:function(var0,var1){
			return sendtext(combinevars(var0,var1))
		}
	},
	"username":{
		close:"endusername",
		run:function(var0,var1){
			var user=combinevars(var0,var1)
			user=user.replace(/[^\w\d\s\.-]/g,"").replace(/\s+/," ").trim()
			if(user.length>=3&&user.length<=20){
				return sendmessage("rename",user)
			}
		}
	},
	"chat":{
		close:"endchat",
		run:function(var0,var1){
			var text=combinevars(var0,var1)
			text=text.replace(/\s+/," ").trim().replace(/[^\da-z`~!@#$%^&*()\-_=+[\]{};'\\:"|,.\/<>? ]+/gi,jsesc).slice(0,maxChatMsgLen)
			sendmessage("chat",text)
		}
	},
	"setspeed":{
		run:function(var1){
			var speed=getvar(var1,"number")
			if(speed<0){
				speed=0
			}
			cfg.interval=speed
		}
	},
	"mousemove":{
		delay:1,
		run:function(varx,vary,rel){
			mousecfg()
			var mouse=cfg.mouse.slice()
			var x=varx
			if(isvalidvar(varx)){
				x=getvar(varx)
			}
			var y=vary
			if(isvalidvar(vary)){
				y=getvar(vary)
			}
			x=percentmouse(x,"getWidth")
			y=percentmouse(y,"getHeight")
			if(rel&&rel.toLowerCase()=="rel"){
				mouse[0]+=+x
				mouse[1]+=+y
			}else{
				mouse[0]=+x
				mouse[1]=+y
			}
			try{
				guac.sendMouseState(new Guacamole.Mouse.State(...mouse))
				cfg.mouse=mouse.slice()
			}catch(e){}
		}
	},
	"click":{
		delay:1,
		held:1,
		run:function(held,which,varx,vary,var4="",var5=""){
			var self=this
			this.halt=0
			if(!held.release){
				var hasheld=parseheld(held,1)
				if(hasheld){
					this.halt=1
					held.release=1
					return setTimeout(()=>{
						self.run(held,which,x,y,var4,var5)
					},cfg.interval)
				}
			}
			mousecfg()
			var mouse=cfg.mouse.slice()
			var args=[var4.toLowerCase(),var5.toLowerCase()]
			var rel=0
			var updown=0
			for(var i in args){
				if(args[i]=="rel"){
					rel=1
				}else if(args[i]=="down"||args[i]=="up"){
					if(!updown){
						updown=updown=="up"?-1:1
					}
				}
			}
			var buttons={
				"left":2,
				"l":2,
				"middle":3,
				"m":3,
				"right":4,
				"r":4
			}
			var btn=2
			which=which.toLowerCase()
			if(which in buttons){
				btn=buttons[which]
			}
			mouse[btn]=updown<0?0:1
			var x=varx
			if(isvalidvar(varx)){
				x=getvar(varx)
			}
			var y=vary
			if(isvalidvar(vary)){
				y=getvar(vary)
			}
			x=percentmouse(x,"getWidth")
			y=percentmouse(y,"getHeight")
			if(rel){
				mouse[0]+=+x
				mouse[1]+=+y
			}else{
				mouse[0]=+x
				mouse[1]=+y
			}
			sendmouse(...mouse)
			if(updown<=0){
				mouse[btn]=0
				sendmouse(...mouse)
			}
			cfg.mouse=mouse.slice()
			if(held.release){
				return setTimeout(()=>{
					parseheld(held,0)
					next(1)
				},cfg.interval)
			}
		}
	},
	"key":{
		delay:1,
		held:1,
		run:function(held,var1,var2){
			var self=this
			this.halt=0
			if(!held.release){
				var hasheld=parseheld(held,1)
				if(hasheld){
					this.halt=1
					held.release=1
					return setTimeout(()=>{
						self.run(held,var1,var2)
					},cfg.interval)
				}
			}
			if(isvalidvar(var1)){
				var keyname=getvar(var1)
			}else{
				var keyname=var1
			}
			var keycode
			if(isnum(keyname)){
				keycode=+keyname
			}else if(keyname in key){
				keycode=key[keyname]
			}else if(/^0x[\da-f]$/i.test(keyname)){
				keycode=parseInt(keyname,16)
			}
			if(keycode>=32&&keycode<=16785579){
				if(var2=="down"){
					sendmessage("key",keycode,1)
				}else if(var2=="up"){
					sendmessage("key",keycode,0)
				}else{
					sendkey(keycode)
				}
			}
			if(held.release){
				return setTimeout(()=>{
					parseheld(held,0)
					next(1)
				},cfg.interval)
			}
		}
	},
	"allkeys":{
		run:function(var1){
			var output=[]
			for(var i in key){
				output.push(key[i])
			}
			output=output.sort((a,b)=>a>b?1:-1)
			setvar(var1,output)
		}
	},
	"mousegetpos":{
		run:function(x,y){
			try{
				var display=guac.getDisplay()
				setvar(x,display.cursorX)
				return setvar(y,display.cursorY)
			}catch(e){}
		}
	},
	"screensize":{
		run:function(width,height){
			try{
				var display=guac.getDisplay()
				setvar(width,display.getWidth())
				return setvar(height,display.getHeight())
			}catch(e){}
		}
	},
	"getpixels":{
		run:function(var1,x,y,w,h){
			try{
				if(!cfg.ctx){
					cfg.ctx=guac.getDisplay().getDefaultLayer().getCanvas().getContext("2d")
				}
				var pixels=cfg.ctx.getImageData(x,y,w,h)
				var output=[]
				for(var i=0;i<pixels.length;i+=4){
					var rbg=pixels[i]<<16|pixels[i+1]<<8|pixels[i+2]
					var color=("00000"+(rbg).toString(16)).slice(-6)
					output.push(color)
				}
				return setvar(var1,output)
			}catch(e){}
		}
	},
	"userlist":{
		run:function(var1){
			return setvar(var1,users)
		}
	},
	"userswaiting":{
		run:function(var1){
			try{
				var waitingusers=[]
				for(var user in usersData){
					waitingusers.push([user,usersData[user][1]])
				}
				waitingusers.sort((a,b)=>a[1]>b[1]?1:-1)
				var output=[]
				for(var i in waitingusers){
					if(waitingusers[i][1]){
						output.push(waitingusers[i][0])
					}
				}
				return setvar(var1,output)
			}catch(e){}
		}
	},
	"log":{
		close:"endlog",
		run:function(){
			var logged=[]
			for(var i=1;i<arguments.length;i++){
				logged.push(getvar(arguments[i]))
			}
			if(arguments[0]){
				logged.push(arguments[0])
			}
			return console.log(...logged)
		}
	}
}
function isnum(variable){
	var output=variable*0+1
	return output&&variable!==""
}
function percentmouse(variable,getside){
	var output=variable
	if(/^\d+%$/.test(variable)){
		output=variable.slice(0,variable.length-1)
		try{
			var side=guac.getDisplay()[getside]()
			output=Math.round(output/100*side)
		}catch(e){}
	}
	return +output||0
}
function parseheld(held,updown){
	var output=0
	for(var i in held){
		switch(i){
			case "+":
				sendmessage("key",key.shift,updown)
				break
			case "^":
				sendmessage("key",key.ctrl,updown)
				break
			case "#":
				sendmessage("key",key.win,updown)
				break
			case "!":
				sendmessage("key",key.alt,updown)
				break
		}
		output=1
	}
	return output
}
function mousecfg(){
	if(!cfg.mouse){
		// x,y,left,middle,right,wheelup,wheeldown
		cfg.mouse=[0,0,0,0,0,0,0]
		try{
			var display=guac.getDisplay()
			cfg.mouse[0]=display.cursorX
			cfg.mouse[1]=display.cursorY
		}catch(e){}
	}
}
/* changepos( pos <int> )
	Changes internal string cursor position
*/
function changepos(pos){
	cfg.poslock=1
	cfg.pastepos=pos
}
/* conbinevars( [var0 <string>], [var1 <string,int>], [raw <bool>] )
	
*/
function combinevars(var0,var1,raw){
	if(raw){
		var output=""
		if(var1&&var0){
			output=[getvar(var1,"string"),var0]
		}else if(var1){
			output=getvar(var1)
		}else if(var0){
			if(var0.trim()&&isnum(var0)){
				output=+var0
			}else{
				output=var0
			}
		}
		return output
	}else{
		return getvar(var1,"string")+(var0||"")
	}
}
/* sendtext( text <string>, [i <int>] )
	Sends raw text to VM, will return to "iterate" function when done
*/
function sendtext(text,i=0){
	sendchar(text.charAt(i++))
	if(i<text.length){
		return sleep(cfg.interval,a=>sendtext(text,i))
	}else{
		return next(1)
	}
}
/* getvar( variable <variable,int>, [type <type>] )
	Returns contents of a variable stored in "cfg.variables". Will also convert to a desired type if specified. Default value is empty string
*/
function getvar(variable,type){
	if(type){
		return convert(getvar(variable),type)
	}
	if(!variable&&variable!==0){
		return ""
	}
	if(isvar(variable)){
		var name=varname(variable).split(".")
		var output
		for(var i in name){
			if(i==0){
				if(name[i] in cfg.variables){
					output=cfg.variables[name[i]]
					continue
				}
			}else if(Array.isArray(output)){
				if(name[i] in output){
					output=output[name[i]]
					continue
				}else{
					var keyname=varname(name[i])
					if(keyname in cfg.variables){
						var key=cfg.variables[keyname]
						if(key in output){
							output=output[key]
							continue
						}
					}
				}
			}else if(name[i]=="length"||typeof output.length!="undefined"){
				output=output.length
				continue
			}
			output=""
			break
		}
		if(output===0){
			return 0
		}else{
			return output||""
		}
	}
	if(isnum(variable)){
		return +variable
	}
	var matches=variable.match(/^"(.*)"$/)
	if(matches){
		return matches[1].replace(/\\"/g,'"')
	}
	return ""
}
/* setvar( variable <variable>, content <int,string,array> )
	Stores variable in "cfg.variables"
*/
function setvar(variable,content){
	if(isvar(variable)){
		var name=varname(variable)
		if(name){
			cfg.variables[name]=content
		}
	}
}
/* convert( input <int,string,array>, type <type>, [join <string>] )
	Converts three variable types between each other
*/
function convert(input,type,join){
	if(type=="number"){
		if(Array.isArray(input)){
			var output=0
			for(var i=0;i<input.length;i++){
				output+=convert(input[i],"number")
			}
			return output
		}else if(isnum(input)){
			return +input
		}else{
			var output=parseInt(input)
			if(isnum(output)){
				return +output
			}else{
				return 0
			}
		}
	}else if(type=="string"){
		if(Array.isArray(input)){
			var output=""
			for(var i=0;i<input.length;i++){
				if(join&&i){
					output+=join
				}
				output+=convert(input[i],"string")
			}
			return output
		}else{
			return ""+(input||"")
		}
	}else if(type=="stack"){
		if(Array.isArray(input)){
			return input
		}else if(input===""){
			return []
		}else{
			return [input]
		}
	}
}
/* isvar( variable <variable,int,string> )
	Searches for dollar sign at the beginning of string
*/
function isvar(variable){
	return (""+variable).charAt(0)=="$"
}
function isvalidvar(variable){
	return isnum(variable)||isvar(variable)||/^"(.*)"$/.test(""+variable)
}
/* varname( variable <variable> )
	Returns a string that is searchable in "cfg.variables"
*/
function varname(variable){
	return variable.slice(1).toLowerCase()
}
/* preparevar ( variable <variable>, type <type>, [returned <bool>] )
	Creates or converts a variable so it can be manually referenced with "cfg.variables"
*/
function preparevar(variable,type,returned){
	var name=varname(variable)
	var defaults={
		number:0,
		string:"",
		stack:[]
	}
	if(name in cfg.variables){
		output=convert(cfg.variables[name],type)
	}else{
		output=defaults[type]
	}
	if(returned){
		return output
	}else{
		cfg.variables[name]=output
	}
}
/* jsesc( argument <string> )
	Converts all characters to safe ANSI format for sending through chat
*/
function jsesc(argument){
	var result=""
	for(var i=0;i<argument.length;i++){
		var character=argument.charAt(i)
		var first=argument.charCodeAt(i)
		if(first>=55296&&first<=56319&&argument.length>i+1){
			var second=argument.charCodeAt(i+1)
			if(second>=56320&&second<=57343){
				var hex=((first-55296)*1024+second-56320+65536).toString(16)
				result+="\\u{"+hex+"}"
				i++
				continue
			}
		}
		var hex=character.charCodeAt(0).toString(16)
		var longhand=hex.length>2
		result+="\\"+(longhand?"u":"x")+("0000"+hex).slice(longhand?-4:-2)
	}
	return result
}
var pressedkeys={}
function keylistener(event){
	var keys={
		shift:16,
		ctrl:17,
		alt:18
	}
	for(var i in keys){
		if(event.keyCode==keys[i]){
			pressedkeys[i]=event.type=="keydown"
		}
	}
}
addEventListener("keydown",keylistener)
addEventListener("keyup",keylistener)
addEventListener("blur",()=>{
	pressedkeys={}
})
addEventListener("paste",event=>{
	var cliptext=event.clipboardData.getData("Text")
	if(pressedkeys.shift){
		paste(cliptext)
	}
},true)