// ==UserScript==
// @name         BetterRecruit
// @namespace    coral.donkey
// @version      1.1
// @description  makes recruiting faster
// @author       CoralDonkey
// @match        https://www.torn.com/page.php?sid=UserList*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473440/BetterRecruit.user.js
// @updateURL https://update.greasyfork.org/scripts/473440/BetterRecruit.meta.js
// ==/UserScript==

(function(){

'use strict';

//gets userlist page
const userlist = document.querySelector(".user-info-list-wrap");

//oberves changes to userlist
const observer = new MutationObserver(() => {
    console.log("observed")
    check();
    addbutton();
});
observer.observe(userlist, { childList: true, subtree: true });


//checks for not top npc jobs
function check(){
for (const child of userlist.children) {
//  checks for npc job icon
    const hasicon = child.querySelectorAll("[id*='icon23'], [id*='icon25'], [id*='icon26']");
    if (hasicon.length > 0) {
//     checks if theyre in the top position
       const topjob = child.querySelectorAll("[title*='Brain surgeon'], [title='Principal'], [title*='Federal Judge']");
        if (topjob.length === 0) {
                child.style.display = "none";
}}}};


//adds button to every child
function addbutton() {
//  prevent feedback loop
    observer.disconnect();
    for (const child of userlist.children) {
//      navigated to the icons
        const icontray = child.querySelector("[class='big svg']");
        if (icontray) {
            icontray.style.position = "relative";
//          checks if button already exists
            const hasbutton = icontray.querySelector(".button");
            if (!hasbutton) {
                console.log(hasbutton);
//              button characteristics
                const button = document.createElement("button");
                button.innerText = "Chat";
                button.style.display = "inline-block";
                button.style.position = "absolute";
                button.style.top = "-07%";
                button.style.right = "30%";
                button.className = "button";
                icontray.appendChild(button);

//              on click, open chat
                button.addEventListener("click", function() {
                    openchat(child)});
}}}
    observer.observe(userlist, { childList: true, subtree: true });}

//gets users id and opens chat with them
function openchat(user) {
    const userclass = user.className;
    const idmatch = /user(\d+)/.exec(userclass);
    const id = parseInt(idmatch[1]);
    if (id) {
//      opens chat with user
        chat.r(id);

}}


check();
addbutton();
})()


