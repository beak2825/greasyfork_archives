// ==UserScript==
// @name         辅助网盘自动输入密码
// @namespace    https://www.byxiaoxie.com/
// @version      0.7
// @description  辅助网盘自动输入密码 默认密码:6666
// @author       ByXiaoXie
// @match        *.cccpan.com/*
// @match        *.ys168.com/*
// @match        *.uepan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392698/%E8%BE%85%E5%8A%A9%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/392698/%E8%BE%85%E5%8A%A9%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

setTimeout(autopass,500)
setTimeout(fuck_play,100)

function autopass() {
	try{
		var kf_pass = document.getElementById('la_lxqq').innerHTML
		var pass = kf_pass.substring(5,11)

		if(pass.substring(0,4) == "6666"){
			document.getElementById('teqtbz').value='6666'
			autofrom()
		}
		else if(pass.substring(0,4) == "8888"){
			document.getElementById('teqtbz').value='8888'
			autofrom()
		}
		else if(pass.substring(0,4) == "0888"){
			document.getElementById('teqtbz').value='8888'
			autofrom()
		}
		else if(pass.substring(0,4) == "5210"){
			document.getElementById('teqtbz').value='5210'
			autofrom()
		}
		else if(pass.substring(0,5) == "12345"){
			document.getElementById('teqtbz').value='12345'
			autofrom()
		}
		else if(pass.substring(0,6) == "521521"){
			document.getElementById('teqtbz').value='521'
			autofrom()
		}
        else if(pass.substring(0,6) == "8341"){
			document.getElementById('teqtbz').value='8341'
			autofrom()
		}
		else{
			document.getElementById('teqtbz').value='6666'
		}
	}
	catch(exception){
		console.log("Error:Not Password")
	}
}

function autofrom() {
	var yzm = document.getElementById('yzm_tr').style.display
	var yzm_2 = document.getElementById('ljtp').innerHTML
	var button_ok = document.getElementById('b_dl')
	if(yzm == "none"){
		button_ok.click()
	}else if(yzm_2 == ""){
		button_ok.click()
	}
}

function fuck_play(){
    play_stop()
    play_stop_2()
    play_stop_3()
	var fuck_1 = setInterval(play_stop,1000)
	var fuck_2 = setInterval(play_stop_2,1000)
	var fuck_3 = setInterval(play_stop_3,1000)
}

function play_stop(){
	try{
		var play = document.getElementById('Hm_Music_P')
		var play_text = play.value
		if(play_text == "音乐暂停"){
			play.click()
			console.log("Play Stop")
		}else{
			console.log("Not Play")
		}
	}
	catch(exception){
		console.log("Error:Play Stop")
	}
}

function play_stop_2(){
	try{
		var play = document.getElementById('music-button')
		var play_text = play.value
		if(play_text == "停止音乐"){
			play.click()
			console.log("Play Stop")
		}else{
			console.log("Not Play")
		}
	}
	catch(exception){
		console.log("Error:Play Stop")
	}
}

function play_stop_3(){
	try{
		var play = document.getElementById('onButton')
		var play_text = play.value
		if(play_text == "音乐暂停"){
			play.click()
			console.log("Play Stop")
		}else{
			console.log("Not Play")
		}
	}
	catch(exception){
		console.log("Error:Play Stop")
	}
}