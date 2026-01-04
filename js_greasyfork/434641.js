// ==UserScript==
// @name         Tampermonkey 101
// @namespace    http://tampermonkey.net/
// @description  A brief how-to on the basic things I use tampermonkey for. :)
// @version      1
// @description  try to take over the world!
// @author       Chase Davis
// @match        https://login-learn.k12.com/*
// @icon         https://www.google.com/s2/favicons?domain=k12.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434641/Tampermonkey%20101.user.js
// @updateURL https://update.greasyfork.org/scripts/434641/Tampermonkey%20101.meta.js
// ==/UserScript==

(function() {
    'use strict';

/*

INTRODUCTION
1: Userscript tags

Userscript tags are the tags you see at the very top of the script, the things like @name, @version, @match, etc.
These tags tell tampermonkey things about the script. What it is, where you got it, who made it, and what websites it should activate on.


Tag #1: @match

@match tells the script which site(s) to activate on.

Since you never know the EXACT site you'll be visiting, you can use * as a 'wildcard'.
A wildcard means "doesn't matter what's here, as long as the rest matches."
For example, a website could use a different URL based on who's using it.
You don't know the user's URL, so you can use a wildcard to get around it.

EXAMPLE:
https://something.com/user/76938457/home


Use this to @match any user:
@match https://something.com/user/* /home

Anything inside where the * is doesn't matter.
I use this to match any K12 site, no matter the page or user.



Tag #2: @name

This is literally just the name of the script.


Tag #2: @description

This is literally just the description of the script.


Tag #3: @namespace

This tells Tampermonkey where you got this script, and uses it to update the script automatically


Tag #4: @grant

This is where things get interesting. Tampermonkey doesn't keep any values when you refresh the page.
Any variables (referred to as 'vars' from now on) you try to call are reset back to undefined unless you explicitly set them.
@grant allows you to get special permissions. I mostly use it for GM_getValue() and GM_setValue. These two allow me to store data long-term,
no matter which page or how many times it's refreshed, this value is stored. It's a weird way to do things, but it works.

You can do your own research on this, but I find no other purpose for @grant.


Tag #5: @run-at

This tag isn't necessary, but it helps with errors about missing elements.
This tag changes when the script is executed.

@run-at document-start makes the script run immediately, no pause.

@run-at document-end makes the script run after the header has loaded.

@run-at document-idle makes the script run when the document is COMPLETELY done loading and waiting for user input.

That's it for tags :p



2: Website Structure / Getting Elements

Here's the basic backbone of every website:

<html> <- this is the base of the website

    <head>...</head> <- This is the header, it contains all the info about the website. The title, verison, style data (CSS), and much more

    <body>...</body> <- This is where the HTML you interact with lives. This is where most of your work will be done.

</html>

[TIP]: Every element falls under the name document. Using document as a selector will setect the ENTIRE website. Everything.



To grab elements you need to use built in functions. The three main methods are:

document.getElementById('id of said elelemt') <- This will return the element found. If no element was found, returns undefined.
document.getElementsByClassName('class of said elelemt') <- This one is interesting, it returns ALL elements that have this class.
document.getElelemtnByName('name of element') <- I've honestly never used this method.

[TIP]: Capital letters DO MATTER! If your selector returns an error, double check your spelling!



Once you have the element of your choosing, you can manipulate it however you want. Here are a few things you can do with elements using an ID selector:

let element = document.getElementById('changeMe'); <- This sets the var 'element' to the div you wish to modify. In this case, the div's ID is 'changeMe'
[TIP]: ALWAYS use ; at the end of every line!

element.backgroundColor = '#000000'; <- This will change its color to black
element.color = '#ffffff' <- This will change everything INSIDE the element (like text) to white.
element.(width/height) = 100px <- This will change the width or height of the element to n pixels.
                                  You can also use n%, to make it a percentage of the parent div's height/width.
element.background = 'url("picture.png")'; <- This maps your image onto the div, this is how I changed your wallpaper!
element.resize = 'both'; <- This allows the div to be resized by the user. This can break websites in many fun ways.
element.innerHTML += `<div>New HTML!</div>` <- This adds brand-new never before seen HTML inside this div.
                                               This gets real complicated real quick, so it'll be covered later.

You can use the same method using document.getElementsByClassName() but it's a little different.
Notice how the command is getelement-s ByClassName(), meaning multiple elements may have this class.
This is useful when modifying, say, a drop-down list. But there's a catch, you can't directly modify it like previously,
because this command returns a list of elements, not just one.

To choose an element out of the list, you need to use a subscript, like so:

document.getElementsByClassName('changeUs')[0];
This will grab the first element in the list. Using [1] will grab the second element (if it exists) and so on.

If you want to modify all elements at the same time, you'll need to use a for loop. Here's a quick run-down on how they work:

var i; <- make sure i exists, so it won't return "i is not defined"
let divs = document.getElementsByClassName('changeUs'); <- This will grab ALL elements with this class

for (i = 0; i < divs.length; i++;) {
    //execute code here such as:
    divs[i].backgroundColor = '#000000';
} ^ this will iterate over each div one by one and change its background color to black.


Let's break that down a little to understand how it works. For loops use 3 arguments:

i = 0; This tells the loop to set i to 0, no matter what it's at now.

i < divs.length; This tells the loop to keep going as long as i is LESS than the length of the list.
                 This is useful if you don't know how many elememts are in the list, or the list changes every time.

i++; This tells the loop to ADD 1 to i every iteration. You can use i--; to count down as well.


Anything inside the {} will be executed. In this case, the code executed takes the list of divs,
grabs the first/second/third etc element of the list, using [i], and changes its background color.



This is all I have for now, read this as many times as needed, and try some things out for yourself!
Make a new script and try to change elements using JavaScript. If you come across any issues, feel free to DM me. Good luck!

*/



})();