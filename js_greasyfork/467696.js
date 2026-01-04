// ==UserScript==
// @name         Ultra HD
// @namespace    https://greasyfork.org/ru/scripts/467696-ultra-hd/feedback
// @version      1.0
// @description  Ultra bot for mpp.
// @author       Koт*добрый*
// @match        https://multiplayerpiano.net/*
// @match        https://mpp.hyye.xyz/*
// @license      ISC
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467696/Ultra%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/467696/Ultra%20HD.meta.js
// ==/UserScript==

const admins = ['e8072c5be175fa47faeb9258', 'c272b0f54ca440c68d7dfaa4', 'f5cfeee5b1cef92798662cae'];
const botname = 'Ultra HD'


MPP.client.on("a", function(msg) {
    var args = msg.a.split(' ');
    var cmd = args[0].toLowerCase();
    var input = msg.a.substring(cmd.length+1).trim();

   if (cmd == '&help') { // help command UwU
       MPP.chat.send('Commands: `help`, `about`, `who`, `room`, `say`.');
       MPP.chat.send('Fun: `cat`, `dog`, `hi`, `bye`, `123`, `abc`, `8ball`.');
       if (admins.indexOf(msg.p._id) != -1) {
         MPP.chat.send('Admin commands: `ban`, `kick`, `chown`, `crownsolo`, `js`.')
       }
   }
   if (cmd == '&about') { // about command OwO
       MPP.chat.send('This bot made by `Koт*добрый*`'); // Meow
   }
   if (cmd == '&who') { // who command
       MPP.chat.send('Your name is: `' + msg.p.name + '` | ID: `' + msg.p.id + '` | Color: `' + msg.p.color + '`');
   }
   if (cmd == '&say') { // msg command
       MPP.chat.send('@' + msg.p.name + ' say msg: `' + input + '`');
   }
   if (cmd == '&room') {
       MPP.chat.send('Room:  `' + MPP.client.channel._id + '`,   Color 1:  `' + MPP.client.channel.settings.color + '`,   Color 2:  `' + MPP.client.channel.settings.color2 + '`.' );
   }
   if (cmd == '&cat') { // cat command
       MPP.chat.send('https://klike.net/uploads/posts/2022-08/1661859117_j-11.jpg'); 
   }
   if (cmd == '&dog') { // dog command
       MPP.chat.send('https://kot-pes.com/wp-content/uploads/2018/07/post_5b3aa89fe11a2.jpeg');
   }
   if (cmd == '&hi') { // hi command
       MPP.chat.send('Hi,   `' + msg.p.name + '` !  :)'); 
   }
   if (cmd == '&bye') { // bye command
       MPP.chat.send('Bye,   `' + msg.p.name + '` !  :(');
   }
   if (cmd == '&123') { // 123 command
       MPP.chat.send('123...'); // 123
   }
   if (cmd == '&abc') { // abc command
       MPP.chat.send('abc...'); // abc
   }
   if (cmd == '&8ball') { // 8 ball command!
    var words = ['Yes', 'No', 'Maybe', 'Try again']; var random = Math.floor(Math.random() * words.length);
    MPP.chat.send(words[random]); 
   }

    /* Admin commands */

 if (admins.indexOf(msg.p._id) != -1) {
   if (cmd === "&ban") { // ban command
     if (!args[1]) return MPP.chat.send('Usage: &ban <id> <ms>.')
     if (!args[2]) return MPP.client.sendArray([{m: 'kickban', ms: 180000, _id: args[1]}]);
	  MPP.client.sendArray([{m: 'kickban', ms: args[2], _id: args[1]}]);
   }
   if (cmd == "&kick") { // kick command
     if (!args[1]) return MPP.chat.send('Usage: &kick <id>.')
	 MPP.client.sendArray([{m: 'kickban', ms: 100, _id: args[1]}]);
   }
   if (cmd == "&chown") { // give crown command
    MPP.client.sendArray([{m: 'chown', id: msg.p.id}])
   }
   if (cmd == "&crownsolo") { // crownsolo command
     MPP.client.sendArray([{m: "chset", set: {crownsolo: !MPP.client.channel.settings.crownsolo}}]);
   }
   if (cmd == "&js") { // eval command
     try {
       MPP.chat.send(`<- ${eval(input)}`)
     } catch(err) {
         MPP.chat.send(err)
     }
   }
     /*
     if (cmd == "&spam") { // spam command
     if (!input) return MPP.chat.send("Usage: &spam <text>.") // need high quotas
     for (let i = 0; i < 32; i++) {
       MPP.chat.send(input)
     }
   }
     */
 }

});
console.log(`${botname} is online!`);