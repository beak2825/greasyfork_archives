// ==UserScript==
// @name         Crack QYS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  test
// @author       You
// @match        http://2.40.8.165:8912/gusu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=8.165
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489807/Crack%20QYS.user.js
// @updateURL https://update.greasyfork.org/scripts/489807/Crack%20QYS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
var change= setInterval(`
//$('.el-message')[0].remove();
document.getElementsByClassName('el-message')[0].style='display:none';
document.getElementsByClassName('el-message')[1].style='display:none'
`,100);
setTimeout(function() {
clearInterval(change); 
$('.content_r')[0].remove();
$('.content_r')[0].setAttribute('style','display: block');
///$('input[name=username]').setAttribute('value','18913573257')
///$('input[name=password]').setAttribute('value','gusu@123')
$('input[name=username]')[0].setAttribute('id','username');

$('input[name=username]')[0].value='18913573257';
//$('input[name=password]')[0].value='gusu@123';
var test = document.getElementById('username');
var myEvent = new Event('input');
test.dispatchEvent(myEvent);
//$('#username')[0].trigger('input')
$('button')[0].click();
///$('form').submit()
},1000)

})();