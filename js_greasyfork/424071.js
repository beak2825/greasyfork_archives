// ==UserScript==
// @name         TWS-bot Advanced 0.8
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  just making money discreetly
// @author       ATYM-CA$H
// @match        https://talkwithstranger.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424071/TWS-bot%20Advanced%2008.user.js
// @updateURL https://update.greasyfork.org/scripts/424071/TWS-bot%20Advanced%2008.meta.js
// ==/UserScript==

var ready = () =>{
    if(bot.username[0] == null){
        if(sessionStorage.getItem('snap_username')){
            bot.username[0] = sessionStorage.getItem('snap_username');
            messages = getMessage();
            return true; 
        }

        let username = prompt('ATYM CA$H \nInsert your username to continue');
            
            if(username != "" && username != null){
                bot.username[0] = username;
                sessionStorage.setItem('snap_username', bot.username[0]);
                messages = getMessage();
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

let messages = null;
let auto_username = 'Someone'
let i = 0;


let start_chat = () =>{
    if($(".usernameInput")[0]){
        let username_input = $(".usernameInput")[0];
        username_input.value = auto_username;

        if(username_input.value == auto_username){
            talk.click();
        }
    }
}

let send_msg = () =>{
    if(messages == null) messages = getMessage();

    if(connected){
        socket.send(messages[i]);
        console.log('Me: '+messages[i]);
        i++;
    }
}

let exit_chat = () =>{
    if(i > messages.length-1){
        window.location.reload();
    }
    if(chatMessageInput.disabled == true && connected == false){
        window.location.reload();
    }
}
if(ready()){
    var loop = setInterval(()=>{
        start_chat();
        send_msg();
        exit_chat();
    },2000)
}