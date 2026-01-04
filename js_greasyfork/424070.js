// ==UserScript==
// @name         Omegle-bot Advanced 0.8
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  just making money discreetly
// @author       ATYM-CA$H
// @match        https://www.omegle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424070/Omegle-bot%20Advanced%2008.user.js
// @updateURL https://update.greasyfork.org/scripts/424070/Omegle-bot%20Advanced%2008.meta.js
// ==/UserScript==

var ready = () =>{
    if(bot.username[0] == null){
        if(sessionStorage.getItem('snap_username')){
            bot.username[0] = sessionStorage.getItem('snap_username');
            return true; 
        }

        let username = prompt('ATYM CA$H \n Insert your username to continue');
            
            if(username != "" && username != null){
                bot.username[0] = username;
                sessionStorage.setItem('snap_username', bot.username[0]);
                return true;
            }
            return false;
    }
    return true;
}

var bot = {
    username:[null],
    greetings1:['hello ', 'hi ', 'hey '],
    greetings2:['how are you ', 'hru ', 'how are u ', 'how r u '],
    greetings3:['whats up ', 'sup '],
    greetings4:['how you doing ','how u doing ','how u doin ','wyd '],
    greetings5:['where you from ', 'where are you from ', 'where r u from '],
    gender:['female ', 'f '],
    age:[18,19,20,21,22,23],
    social_network:['snapchat ', 'snap ', 'SC '],
    non1:['my '],
    non2:['me '],
    non3:['on '],
    keywords1:['add ', 'check ', 'look ', 'see ', 'got ']
}

let _r = (array) =>{
    let index = Math.floor(Math.random() * array.length);
    return array[index];
}

let _structure = () =>{
    let msg = (content) => array.push(content); 
    let types_struc = ['A','B','C','D'];
    let type_selected = _r(types_struc);
    let array = [];

    if(type_selected == 'A'){
        msg(_r(bot.greetings1))
        msg(_r(bot.gender) + _r(bot.age))
        msg(_r(bot.keywords1) + _r(bot.non1) + _r(bot.social_network) + _r(bot.username))
    }
    if(type_selected == 'B'){
        msg(_r(bot.greetings1) + _r(bot.gender))
        msg(_r(bot.greetings2))
        msg(_r(bot.keywords1)+_r(bot.non1) + _r(bot.social_network) + _r(bot.username) )
    }
    if(type_selected == 'C'){
        msg(_r(bot.greetings4))
        msg(_r(bot.gender) + _r(bot.age))
        msg(_r(bot.keywords1) + _r(bot.non2) + _r(bot.non3) + _r(bot.social_network) + _r(bot.username))
    }
    if(type_selected == 'D'){
        msg(_r(bot.greetings5))
        msg(_r(bot.gender) + _r(bot.age))
        msg(_r(bot.keywords1) + _r(bot.non2) + _r(bot.non3) + _r(bot.social_network) + _r(bot.username))
    }
    return array; 
}

let getMessage = () =>{
    let array = [];
    let white_space = ['','​','​​','​​​', '​​​​', '​​​​​', '​​​​​​'];

    let msg = _structure();

    msg.map((letter)=>{
        let text = '';

        for(let i in letter){
            if(typeof(letter[i]) == 'string')
            text += letter[i] + _r(white_space);
        }
        array.push(text);
    })
    return array;
}

let message;
let i = 0;

var g = (attr,value) =>{
	if(attr=="id")  return document.getElementById(value);
	if(attr=="class") return document.getElementsByClassName(value)[0];
}

var start = () =>{
	if(g("id","textbtn")){
		textbtn.click();
        message = getMessage();
	}
	if(g("class","disconnectbtn").innerText.substr(0,3)=="New"){
        g("class","disconnectbtn").click();
        i = 1;
        message = getMessage();
	}
}

var talk = () =>{
	if(_connected()){
		_send();
	}
}

var _connected = () =>{
    if(!g("class","disabled")) return true;
    return false;
}

var _send = () =>{
    g('class', 'chatmsg').value = message[i];
    g("class","sendbtn").click();
    i++;
}

var exit = () =>{
	if(i > message.length-1){
		if(g("class","disconnectbtn").innerText.substr(0,3) != "New"){
			g("class","disconnectbtn").click();
            g("class","disconnectbtn").click();
            message = getMessage();
            i = 1;
		}
	}
}
if(ready()){
    var main = setInterval(()=>{
        start();
        talk();
        exit();
    },2000)
}