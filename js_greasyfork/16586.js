// ==UserScript==
// @name        reply helper :v]]
// @namespace   s4s4s4s4s4s4s4s4s4s
// @include     https://boards.4chan.org/s4s/*
// @include     http://boards.4chan.org/s4s/*
// @version     1.07
// @grant       none
// @author      le fun css man AKA Doctor Worse Than Hitler
// @email       doctorworsethanhitler@gmail.com
// @description Adds a 'help bar' to your quick reply box on [s4s]
// @downloadURL https://update.greasyfork.org/scripts/16586/reply%20helper%20%3Av%5D%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/16586/reply%20helper%20%3Av%5D%5D.meta.js
// ==/UserScript==


//this is the replacement list. the key on the left shows as an option, the text on the right is what's inserted
//edit this to customize everything.
// note: if u edit it and  its stops working, chances are you're not escaping ur quote characters (add 
//       a \ in front of "s and 's if ur not sure what to do). 
//       also, make sure that (unless it's the last entry in the list), there is a "," after the ending quote
//       you can copypasta from 'window.helpList = {' down to '}' into http://esprima.org/demo/validate.html and
//       it will tell you where your syntax errors are
window.helpList = {
  applel:   '\n░░░▞▀▀▚\n░░▞░░░░▚▐ \n░░▀▄▄▄▄▞▚▌▞\n░░░░▞▄▄▄▂█▂▄▄▄▂ \n░░░▞▒▒▒▒▒▒▒▒▒▒▒▚\n░░▞▒▒▒░▒▒▒▒▒▒▒▒▒▚\n░▐▒▒▒░░▒▒▒▒▒▒▒▒▒▒▌\n░▐▒▒░░▒▒▒▒▒▒▒▒▒▒▒▌\n░░▜▒▒░░▒▒▒▒▒▒▒▒▒▞\n░░▐▒▒▒░▒▒▒▒▒▒▒▒▒▌\n░░░▐▒▒▒▒▒▒▒▒▒▒▒▞\n░░░░▜▒▒▒▒▒▒▒▒▒▞\n░░░░░▀▀▀▀▀▀▀▀▀',
  butte:    '\n░░░░░░░░▀▄▄▒▒▒▒▀▄▀▀▀▄░░░░░▒▌▒▀▐\n░░░░░░░░░░░▀▄▒▄██▒▄▀▌▒▒▒▄▀▀▐▀▄▌\n░░░░░░░░░░░░░▐█▀▄▀▒░▐▒▄▀░░░░█\n░░░░░░░░░░░░░▌▄▀▒▒▒░░▌▒▒░░░░░█\n░░░░░░░░░░▄▀▀▒▐▒▒▒▌▌░███▄▄░░░▒▌\n░░░░░░░▄▀▀▒▒▒▄▀▒▌▐▐▒▌▒▒▒▒▀▀█▄▒▐\n░░░░░░█▒▒▒▒░▐▐▐▐▒▌▐▄▀▀██▄▒▒▒▒▀█▄\n░░░░▄▀▐▒▒▒░▒▒▌▌▐▐▒▒▒▒▒▒▒▀▀█▄▒▒▒▒█\n░░░█▄█▌▌▒░░▌▒▐▐▐▐▒▒▒▒▒▒▒▒▒▒▀█▄▒▒▒█\n░░██▀▒▒▐▒░░▌▒▌▀▄▀▒▒▒▒▒▒▒▒▒▒▒▒▀█▄▒▒▌\n░▐█▒▒▒▒▒▀▄░▐▒▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▀█▒▐\n░█▒▒▒▒▒▒▒▀▄░▀▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▒▒▀█▄▌\n░▌▒▒▒▒▒▒▒▄▄▀▄▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▄▀▒▒▒▒██\n░▌▒▒▒▒▒▀▀▒▒▒▒▐▒▀▄▒▄▒▒▒▒▒▒▒▄▀▒▒▒▒▒▒▒█▌\n░▐▒▒▒▒▒▒▒▒▒▒▒▒▀▄▀▀░▀▄▄▄▄▀▀▒▒▒▒▒▒▒▒▒▒█\n░░█▒▒▒▒▒▒▒▒▒▒▒▒▒█░░░▀▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐\n░░░█▒▒▒▒▒▒▒▒▒▒▒▒▒█░░░░█░▒▒▒▒▒▒▒▒▒▒▒▒▒▌\n░░░░█▒▒▒▒▒▒▒▒▒▒▒▒▒█░░░░█░▒▒▒▒▒▒▒▒▒▒▒▒▐',
  doge:     '\n░░░░░░░░░▄░░░░░░░░░░░░░░▄░░░░\n░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌░░░\n░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐░░░\n░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐░░░\n░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌░░░\n░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌░░\n░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐░░\n░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌░\n░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌░\n▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌\n▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐░\n░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌░\n░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐░░\n░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌░░\n░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀░░░\n░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀░░░░░\n░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▀▀░░░░░░░░',
  dubs:     'nice dubs',
  fedora:   '\n░░░░░░░░░▄▄▄▄▄▄░░░░░░░░░░░░░░░\n░░░░░░░▄▀█▀█▄██████████▄▄░░░░░\n░░░░░░▐██████████████████▌░░░░\n░░░░░░███████████████████▌░░░░\n░░░░░▐███████████████████▌░░░░\n░░░░░█████████████████████▄░░░\n░░▄█▐█▄█▀█████████████▀█▄█▐█▄░\n▄██▌██████▄█▄█▄█▄█▄█▄█████▌██▌\n████▄▀▀▀▀████████████▀▀▀▀▄████\n█████████▄▄▄▄▄▄▄▄▄▄▄▄██████▀░░\n░░▀▀████████████████████▀░░░░░',
  gentoo:   '\n░░░░░░░░░░▄▀▒▒▒▒▒▒▒▒▒▒▒▀▀▄▄\n░░░░░░░░▄▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄\n░░░░░░▄▀▒▒▒▒░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒█\n░░░░░█▒▒▒▒░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█\n░░░░█▒▒▄▀▀▀▀▀▄▄▒▒▒▒▒▒▒▒▒▄▄▀▀▀▀▀▀▄\n░░▄▀▒▒▒▄█████▄▒█▒▒▒▒▒▒▒█▒▄█████▄▒█\n░█▒▒▒▒▐██▄████▌▒█▒▒▒▒▒█▒▐██▄████▌▒█\n▀▒▒▒▒▒▒▀█████▀▒▒█▒░▄▒▄█▒▒▀█████▀▒▒▒█\n▒▒▐▒▒▒░░░░▒▒▒▒▒█▒░▒▒▀▒▒█▒▒▒▒▒▒▒▒▒▒▒▒█\n▒▌▒▒▒░░░▒▒▒▒▒▄▀▒░▒▄█▄█▄▒▀▄▒▒▒▒▒▒▒▒▒▒▒\n▒▌▒▒▒▒░▒▒▒▒▒▒▀▄▒▒█▌▌▌▌▌█▄▀▒▒▒▒▒▒▒▒▒▒▒\n▒▐▒▒▒▒▒▒▒▒▒▒▒▒▒▌▒▒▀███▀▒▌▒▒▒▒▒▒▒▒▒▒▒▒\n▀▀▄▒▒▒▒▒▒▒▒▒▒▒▌▒▒▒▒▒▒▒▒▒▐▒▒▒▒▒▒▒▒▒▒▒█\n▀▄▒▀▄▒▒▒▒▒▒▒▒▐▒▒▒▒▒▒▒▒▒▄▄▄▄▒▒▒▒▒▒▄▄▀\n▒▒▀▄▒▀▄▀▀▀▄▀▀▀▀▄▄▄▄▄▄▄▀░░░░▀▀▀▀▀▀\n▒▒▒▒▀▄▐▒▒▒▒▒▒▒▒▒▒▒▒▒▐',
  gosh:     '\n░░░░░▄▀▀▀▀▀▀▀▄\n░░░░█▒▒▒▒▒▒▄▒▒▐\n░░░█▒▀▄▄▄▄▀▐▒▒▒▐\n░▄▀▄█▄░░░▄░▌▒▒▒▐\n▐▒▒▌░░░░░▀▀▐▒▒▒▒▀▄\n▐▒▒▐░▀▌░▄░░▌▒▒▒▒▒▐\n░▀▄▄▌▄▄▀▒▐▄▀▄▄▒▄▄▀\n░░░░░▌░▀▄▀░░░░▀▄\n░░░░▐▄▀▄▌░░░▒░░░▀▄\n░░░▄█░░░░░▒░░░░░░░▀▄\n░░█▀░░░░░░░▒▒▒▄▄▒░░░▀▄\n░▐█▒░░░░░▒▒▒▒▌░░▀▌░░░░▌\n░██▒▒░░░░░░▒▐░░░▐░░░░▌\n▐█▌▀▄░░░▒▒░░░▌░░▌░░░▌\n▐█▌░░▌░░░░░▒▒▀▄▐░░▒▌\n▐█▌░░▐▒░▄▄▄▀▀█▀░▒▒▌\n░█░░░░█▀▒▄▀▀█░░▒▄▀▀▄\n░▀░░░░▌░▀▄░▄█▄▄▀░▒▒▀▄\n░░░░░░▌▒░▒▀▒░░░▒░░░▒█\n░░░░░▐▌▒▒▒▒▒▒▒▒▒▒▒▒▒▐▌\n░░░░▐▌░▒░▒░▒░░▒░▒░░▒░█\n░░░▐▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▌\n░░░█░▒░▒░░▒░░░▒░░▄░▄▒░█\n░░▐▀▄▀▄▀▄▀▄▀▄▀▄▀▀▐▀░▀▀█\n░░▌░░░░░░▄▌░░░░░░▌▀▄▀▄▀\n░▐░░░░░░█░▌░░░░░▐\n░░░░░▄▄░░▄░░░▄▄░█\n░░░░▀▄█░█░█░▀▄▄░█▀▄\n░░░░▄▄▀░░▀░░▀▀░░▀░▀\n░░░░░▄▄░▄▄░░░▄░░▄▄\n░░░░█░█░█░█░█░█░█░█\n░░░░░▀▀░▀░▀░░▀░░▀░▀',
  haha:     'ᕕ⎝ᐛ⎠ᕗ',
  kek:      'kek',
  mario:    '\n░░░░░░▓▓▓▓▓▓▓▓\n░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\n░░░░█████▒▒▒██▒▒\n░░██▒▒█▒▒▒▒▒██▒▒▒▒▒▒\n░░██▒▒███▒▒▒▒▒██▒▒▒▒▒▒\n░░░░██▒▒▒▒▒▒████████\n░░░░░░▒▒▒▒▒▒▒▒▒▒\n░░░░▓▓▓██▓▓▓██▓▓▓▓\n░░▓▓▓▓▓██▓▓▓██▓▓▓▓▓▓\n▓▓▓▓▓▓▓███████▓▓▓▓▓▓▓\n▒▒▒▒▓▓█▒▒███▒▒██▓▓▒▒▒\n▒▒▒▒▒▒██████████▒▒▒▒▒▒\n▒▒▒▒██████████████▒▒▒▒\n░░░░█████░░░██████\n░░▓▓▓▓▓░░░░░░░▓▓▓▓▓▓\n▓▓▓▓▓▓▓░░░░░░░▓▓▓▓▓▓▓',
  nice:     '\n░░░░░░░░░░░░░░░░░░░░░\n░░░░░░░░░░░░░░░░░░░░░▄▄░░░▄\n░░░░░░░░░░▄▄▄▀▀▀▀▀▀▀▄▌██░██▐\n░░░░▄▄░▄▀▀▒▒▒▒▒▒▒▒▒▒▒▒▀▒▀▄██\n░░░▐▐█▀▒▒▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▒▌\n░░░▌███▄██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▐\n░░█▒▒█▀███▌▒▒▒▒▐▒▒▒▒▒▒▒▒▒░▒░░█\n░▐▒▒█▌▐▌▀▀▒░▒░▒▌▌▒░▒░▒▒█▒░░░░░▌\n░▐▒▒▀▒▐█░░░░░░█░▄▀░░░░▐░█▒▒▒▒▒▐\n░▌░░░▒░▒▌▒░▒░▐░▀▐▒▒░▒░▌░░█▒▒▌▒▐▄\n░▌▒░▒░░▐▒▒▒▒▒▌░░░▌▒▐▐▐▄▀▀▀▌▒▌▒▌▌▀\n▐▒▒▒▒▒▒▐▒▌▒▒▐▄▀▀▐▐▒▌▒▌▒▌▒▄▒▌▌▒█▐\n▐▒▒▒▒▒▒▌▒▐▒▒▌▌▒█▄░▀░░░░▀▀▀▀▐▐▐░▌ \n▌▒▒▒▒▒▐▒▒▒▀▄░▀▀░░░░░░░░░░░░▐▒▌\n▀▐▒▄▒▒▌▐▐▒▒▒▌▄░░░░░▀▄▀░░░▄▀▒▌▌\n░░▐░▀▀░▐▒▌▒▒▐▒▀▄▄▄▄▄▄▄▄▀▐▒▒▐░▐\n░░░░░░░░█▐▒▄▀▄▌█▄▄▄▀▀█░░░█▄▀▌\n░░░░░░░░░█▀▀▀░▀▀█▀█▀▀█▀▀▀▀▄\n░░░░░░░░█░░░░░░░░░█▀▄░▀▄░░░▌\n░░░░░░░▐▌░▄░░░░░░░█░░░░░█▄▄█\n░░░░░░░█░░░░░▄░░▄██▀▀█▀█░▀▄█',
  nicepost: '\n███╗░░░██╗██╗░██████╗███████╗░░░░██████╗░░██████╗░███████╗████████╗░░░░░░░░███╗░██╗░\n████╗░░██║██║██╔════╝██╔════╝░░░░██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝░░░░██╗██╔██╗╚██╗\n██╔██╗░██║██║██║░░░░░█████╗░░░░░░██████╔╝██║░░░██║███████╗░░░██║░░░░░░░╚═╝╚═╝╚═╝░██║\n██║╚██╗██║██║██║░░░░░██╔══╝░░░░░░██╔═══╝░██║░░░██║╚════██║░░░██║░░░░░░░██╗░░░░░░░██║\n██║░╚████║██║╚██████╗███████╗░░░░██║░░░░░╚██████╔╝███████║░░░██║░░░░░░░╚═╝░░░░░░██╔╝\n╚═╝░░╚═══╝╚═╝░╚═════╝╚══════╝░░░░╚═╝░░░░░░╚═════╝░╚══════╝░░░╚═╝░░░░░░░░░░░░░░░░╚═╝░',
  problem:  'The problem is, OP, that you probably aren\'t seeing all the posts. If you are just viewing [s4s] through the /s4s/ board, you don\'t see the green posts, the posts with letters in their ids, or anything numberless. Together, those make up about 40-70 percent of [s4s], depending on the day. So conversation will appear disjointed and spastic, because you won\'t be getting the full picture. \n\nI actually just flipped over to the /s4s/ interface to make this post, and it\'s pretty funny how unintelligible [s4s] is like this. ',
  satire:   '[s4s] is basically a giant, ever-changing, absurdist satire of Internet culture. Every post serves as a criticism of the circlejerkery and memery of Internet communities.\n\nWhen you view [s4s] with the eyes of a self-loathing satirist, you will understand it all. ',
  skelitun: '\n░░░░░░░░░░░░▄▐\n░░░░░░▄▄▄░░▄██▄\n░░░░░▐▀█▀▌░░░░▀█▄\n░░░░░▐█▄█▌░░░░░░▀█▄\n░░░░░░▀▄▀░░░▄▄▄▄▄▀▀\n░░░░▄▄▄██▀▀▀▀\n░░░█▀▄▄▄█░▀▀\n░░░▌░▄▄▄▐▌▀▀▀\n▄░▐░░░▄▄░█░▀▀ U HAVE BEEN SPOOKED BY THE\n▀█▌░░░▄░▀█▀░▀.\n░░░░░░░▄▄▐▌▄▄\n░░░░░░░▀███▀█░▄\n░░░░░░▐▌▀▄▀▄▀▐▄SPOOKY SKILENTON\n░░░░░░▐▀░░░░░░▐▌\n░░░░░░█░░░░░░░░█\n░░░░░▐▌░░░░░░░░░█\n░░░░░█░░░░░░░░░░▐▌\n',
  shaggy:   '\n█████▀▀▀▀▀▀▀██████████████ █\n███▀▒▒▒▒▒▒▒▒▒▀▀███████████ █\n██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀█████████ █\n█▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▀███████ █\n█▒▒▒▒▌▄▒▒▐▒▀▄▒▒▒▒▒▒▒██████ █\n▌▒▒▒▐▀░▀▄▄▀░▀▄▄▒▒▒▒▒▐█████ █\n▌▒▒▒▐░▀▀▄░░▀▀▄░▌▒▒▒▒▒▐████ █\n▌▒▒▒▐░▄▄▄░░▄▄▄░▐▒▒▒▒▒▒████ █\n▌▒▒▒▌░░▐░░░░░░░░▌▒▒▒▒▒▐███ █\n▌▒▒▒▌░░▌▄░▄░░░░░▌▒▄▒▒▐████ █\n█▒▒▒▌░░░░░░░░░░░▌▐▐▒▐█████ █\n██▒▐░░░▄▄▄▄░░░░░▐░▌▒██████ █\n███▐░░░▀▀▀▀██░░░▌▀▄███████ █\n████░░░░░░░░░░░░▄█████████ █\n████▄░░░░░░░░░░███████████ █\n█████▄░▌▌░░▌▌▌████████████ █\n███████▄▐▐▐▐░░████████████ █\n████████░░░░░░▐▒▄▒▒▀██████ █\n████████░░░░░░░█▐▒▒▐██████ █\n█████▀▀▒▌░░░░░░░▌▒▒▒▒▒▒▀▀▀ █',
  smile:    '░░▄██▄▄░░░░░░░░░░░░░░░░░░░░▄██▄░░\n░▄█▀▀██▄░░░░░░░░░░░░░░░░░▄██▀▀█▄\n▀▀▀░░░▀▀▀░░░░░░░░░░░░░░░▀▀▀░░░▀▀▀\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n░░░░░░░░░░█████████████░░░░░░░░░░',
  smug:     '\n░░░░░▄███████████████████████▄\n░▄▄▄█████████░░░▀██▀░░▐██████▌\n█████████▀███▌░░░▄░░▄░▐▀▄███▀\n██████████░░▀▀░▄█▀░░▀█▄░░░▌\n████████░▀▀░░░░░░░░░░░░░░░░▌\n███████▌░░░░▄▄▄▀░░░░░░░▄▄▀▄░▌\n███████░░░▄▀░░░░░░░░░░▐██▄░▀▐\n██████▌░▀██▄█░▀░░░░░░░░▄░░░░░▌ \n██████▌░░░░░░░░░░░░░░░░▄▀░░░░▐ \n██▀░▀██░░░░░░░░░░░░░░░░░░░░░░▐ \n█░▄▀▄░█▌░░░░░░░░░░░░░░░░░░░░░▐\n█▌░░▌░▀█░░░░░░░░░░▄▀▀▀▄▄▀░░░░▌\n██▄▄░░░██░░░░░░░░░░░░░░░░░░░▐\n█████████▄░░░░░░░░░░░░░░░░░▐\n██████████▌░░░░░░░░░░░░░░░▐\n███████████▄▀▀▀▄▄▄░░░░░░░▐\n█████▀▀▀▀███▄▄▄▄▄▄███████\n▒▒▄▀▒▒▒▒▒▒▀██▄▒▒▒▒▐██████▌░▄▄▄▄\n▄▀▒▒▒▒▒▒▒▒▒▐██▌▒▒▒▒█████▀██▒▒▒▒▀▄\n▒▒▒▒▒▒▒▒▒▒▒▒▒▀█▒▒▒▒▌▒▒▒▒▒▒▀▄▒▌▌▒▒\n▒▒▒▒▒▒▒▒▒▒▒▒▒▌▀▒▒▒▒▒▒▒▒▒▌▒▒▒▒▐▐▒▒',
  steven:   '\n░░░░░░░░░░░░░▒▒▒▒▒\n░░░░░░░░░░▒▒▒▒▒▒▒▒▒\n░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒\n░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒\n░░░░░▒▒▒▒▒▒▄▀▀▄▀▄▄▄▄▒\n░░░░░▒▒▒▒▒▐░░░░░░░░░▀▄\n░░░░▒▒▒▒▒▒▐░░░░░░░░░░▐\n░░░▒▒▒▒▒▒▒▌░░▄▄▄░░▄▄▄▐\n░░▒▒▒▄▀▀░▌░░░▌▀▐░░▌▀▐▐\n░░▒▒▒▌░░▀░░░░░░░░▀▄░░▐\n░░░▒▒▒▀▄░░░░░░░░░░▐░▐\n░░░▒▒▒▒▐░░░░▌░░░▀░▀░░▌\n░░░░▒▒▒▐░░░▐░░▀▄▄▄▄▀▐         \n░░░░░▄▀▀▄░░░▄░░░░░░▄▌\n░░░▄▀▄▒▒▒▀▄░░▀▄░▄▄▀\n░▄▀▒▒▒▀▄▒▒▒▀▄▄░▄▀▒\n▀▒▒▒▒▒▒▀▄▒▒▒▒▒▀▌▒▒',
  swaglord: '\n░░▃▄▟█████████▄▄\n░▟██████████████▙\n▐████▀░░░░░░█████▙\n▐█▛░░░░░░░░░▜█████▙\n▐▛░░░░░░░░░░░▜█████▖\n▐░░░░░░░░░░░░░░░▜▒▒▛▚▖\n▐░░░░░░░░▗▞▀▀░░░░▒▒▌░▐\n▐░░░░░░░░▞ ▞■ ▏░░░░▒▌▒░▌\n░▚░░░░░░░▒░▔▔░░░░░▒▙░░▌\n░░▌▞▀█▘░░▒░░░░░░░░▒▒▌▞▚\n░░▜░▞■ ▚▍░▒░░░░░░░▒▒▒░░▚\n░░░▚▝▀▀▐░░░▞░░░░░▒▒▒▒░░ ▚▖\n░░░░▚░░░▚▂▞░▂▂░░░░░▒▒▞▀▚░▚\n░░░░░▚░░░░▗▀░░▞░░░░ ▞▘░▞▒▒░\n░░░░░░▜░░░▙▂▃▞░░░░▞▘░▞▒▒░░\n░░░░░░░▚▄▂░░░░░░░▞░░▞▒▒░░\n░░░░░░░▌░░▚░░░░▞▀░░▞▒▒░░\n░░░░░░░░▚░░▚▄▄▞░░░▞▀▚░\n░░░░░░░░░▌░░░░░░░░░▒▞▖\n░░░░░░░░░▌░░░░░░░░░░▒▞\n░░░░░░░░░▌░░░░░░░░░░▞▖\n░░░░░░░░░▌░░░░░░░░░░▞',
  thinchin: '\n░░░░░░░░░░░░▄▄▀▀▀▀▀▀▀▄▄\n░░░░░░░░░▄▀▀▒▒▒▒▒▒▒▒▒▒▒▀▄\n░░░░░░░▄▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄\n░░░░░░▄▒▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▒▐\n░░░░░▐▒░▒▒░░▒▒▒▄▀▐▒▒▒▌▌▒▄▒▒▌\n░░░░░▌▒▒▒▒▒▒░▄▀░░▌░▄▀▐▄▌▌▒▌▐\n░░░░░▌░▄▒▒▒░▀▀▄▄▀▀▀░░░░░░▌▒▐\n░░░░░▌▄░▀▄▐▀▀█▀▀▄▄▄▄▄▄▄▄░▌▒▌\n░░░░░▐░▌░░░▀▄▄▄▄▌░▐░▀█▄▀▐▄▀\n░░░░░░▄▐░░░░░░░▄░░▐▀▄▄▄▄▀░▌\n░░░░░░░█░░░░░░▐▄▄▄▄▌░░░░░▌\n░░░░░░░░█░░░░▄▄▄░░░░░░░░█\n░░░░▄▄▀▄█░░░░░░░▀▀▀░░░░█\n▄▄▀▀▒▒▒▌░▀▄░░░░░░░░░░░█\n▒▒▒▒▒▒▐░░░░▀▀▄░░░░░▄▄▀░▄\n▒▒▒▒▒░▌░░░░░░░▀▀▀▀▀░░▐▒▒▀\n▒▒▒▒▒▒▐░░░░░▒▒▒▒░░▐░░▄▒▒▒▀▀▄\n▒▒▒▒▒▒▒▐░░░░▒▒▒░░░▌░▐▒▒▒▒▒▒▒▀▀▄',
  toplel:   '\n░░░░░░░░░░░░▄▀▀▌\n░░░░░░░▄▀█░░█▄▀\n░░░▄▄▀▐▌░▐▌░█░░░▄▄▀▀▌\n░▀▀█░░█▄▄▀░░▄▄▀▀▌▄█▌▌\n░░░█░░░░░▄▀▀▄▄▐▒▌███▐\n░░░▀░░░▐▀▄█▀▀▒▒▒▌███▐\n░░▄▀▀▌░▐▐██▌▒▄▐▒▌███▐▀▐\n▐▀▄█▌▌░▐▐█████▐▒▌███▄█▐\n▐▐██▌▌░▐▐███▀▒▒▒▌████▀▐\n▐▐██▌▌░▐▐███▒▄▐▒▌█▀▄▄▀▀\n▐▐██▌▌▀▐▐█████▐▒▄▄▀\n▐▐██▌▄█▐▐█▀▀▄▄▀▀\n▐▐████▀▐▄▄▀▀\n▐▐█▀▀▄▀▀\n▐▄▄▀',
  walruse:  '\n░░░░░░░░░░░░░▄▄▄▄▄▄▄▄\n░░░░░░░░░░▄▀▀▒▒▒▒▒▒▒▒▀▀▄\n░░░░░░░░▄▀▒▌▒▒▒▒▒▒▒▒▐▒▒▒▀▄\n░░░░░░░█▒▒▒▒▌▒▒▒▒▒▒▐▒▒▒▒▒▒█\n░░░░░░█▒░▒▒▒▒▌▒▒▒▒▐▒▒▒▒▒▒▒▒█\n░░░░░█▒░▒▒▒▒▒▒▒▒▒░░░░▒▒▒░▌░▒█\n░░░░█▒░▒▄▀█▄░░░░░░░▄▀█▄▒▐░░▒▒█\n░░░▐▒▒░▒▀██▀░░░░░░▒████ ▒░░▒▒▒▒█\n░░░▌▒▒▒▒▒▒▒░▒▒▒▒▒░▒▒▀▀▒░░▒▒▒▒▒▒▌\n░░░▌▒▒▒▒▒░▒▒▒▒▒▒▒▒▒░▒▒▒░▒▒▒▒▒▒░▐\n░░░▐▒▒▒▒▒▒▒▀███▀▒▒▒▒░░▒▒▒▒▒▒▒▒ ▌\n░░░░▌▒▒▒▒▒░░░█░░░▒▒▒▒░░▒▒▒▒▒▒░█\n░▄▀▀▐▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒░▄▀\n▀░░░▄█▒▒▒▒▄▄▀▀▀▄▄▒▒▒▒▒▒▒▒░▄▀\n░░▄▀░▄▀▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▄▀░▀\n░░░░▀░░░▀▀▄▄▒▒▒▒▒▄▄▄▀▐▀▄░▀▄\n░░░░░░░░░░░░▀▀▀▀▀░░░░░▌░▀',
  wew:      '\n░░███░░▄███░░▐██▄░░▄██████▄░░███░░▄███░░▄██▌\n░░███▄░████░░███░▄███▀▀▀███▌░███▌░████▄░███▀\n░░▐██▌▐████▌▐███░████▄████▀░░▐██▌▄████▌▄███\n░░▀████████████░░██████▀▀░░░░░████████████▀\n░░░█████░█████▌░░████▄░░▄▄▄▄░░█████▀▐█████\n░░░▀███▀░▀████░░░░▀████████▀░░▀███▀░░████▀\n░░░░▀▀▀░░░▀▀▀░░░░░░░░▀▀▀▀░░░░░░▀▀▀░░░▀▀▀▀',
  who:      'who are you quoting?',
  wiz:      'wizzle wazzle',
  wow:      '\n░░███░░▄███░░▐██▄░░▄██████▄░░███░░▄███░░▄██▌\n░░███▄░████░░███░▄███▀▀▀███▌░███▌░████▄░███▀\n░░▐██▌▐████▌▐███░████░░░░███░▐██▌▄████▌▄███\n░░▀████████████░░████░░░░███░░████████████▀\n░░░█████░█████▌░░████▄░░▄███░░█████▀▐█████\n░░░▀███▀░▀████░░░░▀████████▀░░▀███▀░░████▀\n░░░░▀▀▀░░░▀▀▀░░░░░░░░▀▀▀▀░░░░░░▀▀▀░░░▀▀▀▀',
  yee:      '\n░░░░░░░░░░░░░▄███▄▄▄░░░░░░\n░░░░░░░░░▄▄▄██▀▀▀▀███▄░░░░\n░░░░░░░▄▀▀░░░░░░░░░░░▀█░░░\n░░░░▄▄▀░░░░░░░░░░░░░░░▀█░░\n░░░█░░░░░▀▄░░▄▀░░░░░░░░█░░\n░░░▐██▄░░▀▄▀▀▄▀░░▄██▀░▐▌░░\n░░░█▀█░▀░░░▀▀░░░▀░█▀░░▐▌░░\n░░░█░░▀▐░░░░░░░░▌▀░░░░░█░░\n░░░█░░░░░░░░░░░░░░░░░░░█░░\n░░░░█░░▀▄░░░░▄▀░░░░░░░░█░░\n░░░░█░░░░░░░░░░░▄▄░░░░█░░░\n░░░░░█▀██▀▀▀▀██▀░░░░░░█░░░\n░░░░░█░░▀████▀░░░░░░░█░░░░\n░░░░░░█░░░░░░░░░░░░▄█░░░░░\n░░░░░░░██░░░░░█▄▄▀▀░█░░░░░\n░░░░░░░░▀▀█▀▀▀▀░░░░░░█░░░░\n░░░░░░░░░█░░░░░░░░░░░░█░░░',
  zoobidey: '\nWhat the zoobidey flip-flop-bop did you just say about me, you flippidy zoob woobity? I\'ll have you know I zooped and flooped to the top of my class in the zobbler wobbler, and I\'ve rop-wop-flopped in numerous shoobidy doobidies on floppity pudding, and I have over 300 shibbidy bops. I am trained in flap-floppities and I\'m the top doober in the entire shibbidy. You are nothing to zoobidy-me but just another zoobidy. I will zoop you the blop out with precision the likes of which has never been seen before on this floobidy Earth, mark my flibbidy flop. You think you can flop away with zoobing that doobie-woobie to me over the Interzoobies? Think again, flap-flopper. As we speak I am zipping my blopping bloop of flobbidies across the boopidy and your floopidy is being flopped right now so you better poopidy for the big zoobidy flop party, son. You\'re jeeber zeebered, son. I can be anywhere, any-flopping-time, and I can zoop and woop you in over seven hundred ways, and that\'s just with my boobidy shoobidies. Not only am I extensively zooped in zip-wop, but I have access to the entire zabber of the Zap Wop Muggity Top and I will zoop it to its full extent to flap your flobbity flob off the face of the zoobie, you zabber wabber. If only you could have known what zopping fury your little "zoopity" comment was about to bring down upon you, maybe you would have zooped up. But you couldn\'t, you didn\'t, and now you\'re paying the price, you flapping babbling shooby-wooper. I will zip zop all over you and you will drown in it. You\'re zooped, son. '
};
//are we using 4chan x?
var usingX = false;
if (document.getElementById('header-bar') != null) {
  usingX = true;
}

//create and configure the helpbar
var bar = document.createElement('div');
bar.id = 'qrHelpBar';

//dif settings for 4chan's inline extension and 4chan X
if (!usingX) {
  bar.style.maxWidth = '296px';
} 
else {
  bar.style.maxWidth = '300px';
}

//add the texts specified earlier in window.helpList
for (var key in window.helpList) {
  // create the link
  var option = document.createElement('a');
  option.id = 'replyHelperOption_'+key;
  option.title = window.helpList[key];
  option.innerHTML = key;
  
  // add option to the bar
  bar.innerHTML += '[';
  bar.appendChild(option);
  bar.innerHTML += '] ';
}

// inserts the text into the textbox
function insertText(text) {
  var qrTextbox;
  if(!usingX) {
     qrTextbox = document.querySelector('#qrForm > div:nth-child(3) > textarea:nth-child(1)');
  }
  else {
    qrTextbox = document.querySelector('textarea.field');
  }
  // code for inserting at cursor location from https://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
	//IE support
    if (document.selection) {
        qrTextbox.focus();
        sel = document.selection.createRange();
        sel.text = text;
    }
    //MOZILLA and others
    else if (qrTextbox.selectionStart || qrTextbox.selectionStart == '0') {
        var startPos = qrTextbox.selectionStart;
        var endPos = qrTextbox.selectionEnd;
        qrTextbox.value = qrTextbox.value.substring(0, startPos) + text + qrTextbox.value.substring(endPos, qrTextbox.value.length);
    } else {
        qrTextbox.value += text;
    }
}

function addOptionListeners() {
	for (var key in window.helpList) {
  // create the link
    document.getElementById('replyHelperOption_'+key).addEventListener('click',function() { insertText(window.helpList[this.id.split('_')[1]]); });
	}
}

//checks to see if quickreply exists and adds the help bar to it if it does
function addHelpBar() {
  //grab the quickreply box so we can modify it
  var quickreply;
  var qrTextbox;
  // grab it in the inline extension
  if (!usingX) {
    quickreply = document.getElementById('qrForm');
  }
  //grab it in 4chan X
   else {
    quickreply = document.getElementById('qr');
  }
  
  //make sure it exists and the helpbar hasn't already been added
  if (quickreply != null && document.getElementById('qrHelpBar') == null) {
    //add the helpbar before the captcha
    if (!usingX) {
      quickreply.insertBefore(bar, quickreply.childNodes[3]);
    } 
    else {
      quickreply.childNodes[1].insertBefore(bar, quickreply.childNodes[1].childNodes[2]);
    }
    addOptionListeners();
  }
}



// these next few lines set up the mutation observer we will use to determine when quick
// reply is opened
// see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver for reference

//listening on the body because that's what quickreply is appended to
var target = document.body;
//only need to listen to the childlist mutations because that's what quickreply is appended to
var config = {
  childList: true
};

//observer code, just calls the "addHelpBar function"
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    addHelpBar();
  });
});

//start the mutation observer
observer.observe(target, config);
