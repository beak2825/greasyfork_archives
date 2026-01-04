// ==UserScript==
// @name         Pendoria - FixHazzy
// @description  Overwrites what Hazzy says in realtime with some nice sentences.
// @namespace    http://pendoria.net/
// @version      0.0.2
// @author       Xortrox
// @contributor  Tester: Hazzy
// @match        http://pendoria.net/game
// @match        https://pendoria.net/game
// @match        http://www.pendoria.net/game
// @match        https://www.pendoria.net/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371168/Pendoria%20-%20FixHazzy.user.js
// @updateURL https://update.greasyfork.org/scripts/371168/Pendoria%20-%20FixHazzy.meta.js
// ==/UserScript==

inspirationalQuotes = [
'Xortrox made me the way I am! That\'s why I am soooo happy :D',
'Maria is love Maria is life', 
'Puls3 is a generous guy!', 
'It\'sa me Hazzio!',
'Me Hazzy! Me Happy!', 
'Flowers are pretty tbh, and you look like one my peoples :3!', 
'Hello sunshine! how is your day?', 
'My name is Hazzy, and I and very happy today :3'
];
 
function getChatMessageTimestamp(msg){
    return msg.substr(0, msg.indexOf(' '))
}
function fixhazzy(message, channel, username, id) {
    if (channel === '/main' || channel === 'hazzyfix') {
        // Hazy ID
        if (id === 1774) {
            console.log("IT WAS HAZZY!");
        }
 
        setTimeout(() => {
            let timestamp = getChatMessageTimestamp(message);
            let chatLine = $('li:contains("' + timestamp + '")');
 
            if(!chatLine) {
                return console.log('No chat line found.');
            }
 
            console.log('chatLine:', chatLine);
            let msgText = chatLine[0].innerHTML.substr(chatLine[0].innerHTML.indexOf('</a>: ') + 6)
            //console.log('text:', msgText);
            //console.log('New innerHTML with replaced text:', chatLine[0].innerHTML.replace(msgText, 'Flowers are pretty tbh, and you look like one my peoples :3!'));
            if (id === 1774) {
                let newInner = chatLine[0].innerHTML.replace(msgText, inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)])
                chatLine[0].innerHTML = newInner;
                console.log('chat now:', chatLine[0].innerHTML);
            }
        }, 200);
        console.log('Received main message:', message, '\nusername:', username);
    }
}
socket.on('message', fixhazzy);
socket.io.on('message', fixhazzy);