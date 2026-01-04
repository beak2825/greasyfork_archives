
// ==UserScript==
// @name         Hoxien
// @namespace    http://tampermonkey.net
// @version      0.2.1
// @description  try to take over the world
// @author       COdER
// @match        https://multiplayerpiano.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        COdER_123-_GUALG=INSIDE
// @downloadURL https://update.greasyfork.org/scripts/451593/Hoxien.user.js
// @updateURL https://update.greasyfork.org/scripts/451593/Hoxien.meta.js
// ==/UserScript==

MPP.client.on("a", function(msg) {
    let cmd = msg.a;
var a;
 var b;
 var input;

if (cmd == "-help") {
    MPP.chat.send("Commands are: -help • -about • -version • -yes • -no • -uwu • -owo • -multiplayerpiano • -dog • -cat • -fox • -bird • -myID.")
}
if (cmd == "-h") {
    MPP.chat.send("Commands are: -help • -about • -version • -yes • -no • -uwu • -owo • -multiplayerpiano • -dog • -cat • -fox • -bird • -myID.")
}
if (cmd == "-about") {
    MPP.chat.send("This bot created at: 13:32 23.11.2021 (Monday). ( Official version ). Made by ♫♪｢ GUALG INSIDE ｣ ȼ๏ď€яʍρρ(юŤყϭ)♫")
}
if (cmd == "-ab") {
    MPP.chat.send("This bot created at: 13:32 23.11.2021 (Monday). ( Official version ). Made by ♫♪｢ GUALG INSIDE ｣ ȼ๏ď€яʍρρ(юŤყϭ)♫")
}
if (cmd == "-version") {
    MPP.chat.send("Bot version: 0.1.1 ( Official ).")
}
if (cmd == "-ver") {
    MPP.chat.send("Bot version: 0.1.1 ( Official ).")
}
if (cmd == "-yes") {
    MPP.chat.send("no")
}
if (cmd == "-no") {
    MPP.chat.send("yes")
}
if (cmd == "-uwu") {
    MPP.chat.send("owo")
}
if (cmd == "-owo") {
    MPP.chat.send("uwu")
}
if (cmd == "-multiplayerpiano") {
    MPP.chat.send("Link ------> https://multiplayerpiano.com/")
}
if (cmd == "-mp") {
    MPP.chat.send("Link ------> https://multiplayerpiano.com/")
}
if (cmd == "-mpp") {
    MPP.chat.send("Link ------> https://multiplayerpiano.com/")
}
if (cmd == "-dog") {
    MPP.chat.send("Link ------> https://images.dog.ceo/breeds/mix/Denver.jpg")
}
if (cmd == "-cat") {
    MPP.chat.send("Link ------> https://purr.objects-us-east-1.dream.io/i/994369_560771617324912_1724365765_n.jpg")
}
if (cmd == "-fox") {
    MPP.chat.send("Link ------> https://randomfox.ca/images/14.jpg")
}
if (cmd == "-myID") {
    MPP.chat.send(msg.p.name + " Your _ID is: " + msg.p.id)
}
if (cmd == "-ID") {
    MPP.chat.send(msg.p.name + " Your _ID is: " + msg.p.id)
}
if (cmd == "-id") {
    MPP.chat.send(msg.p.name + " Your _ID is: " + msg.p.id)
};})