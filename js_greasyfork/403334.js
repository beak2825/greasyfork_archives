// ==UserScript==
// @name         gameCodeMapping Delete button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include *nana-*01.*.com/mgmt/gamecodemapping.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403334/gameCodeMapping%20Delete%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/403334/gameCodeMapping%20Delete%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Your code here...


    var gameCodeMapping =Array.from(document.getElementsByClassName('table table-striped')[0].children[0].children);

    gameCodeMapping.forEach(function(item,index){
        if(index!=0){
            var  gma = '<span class="de btn btn-primary" >Delete</span> ';
            var new_elem = document.createElement('div');
            new_elem.innerHTML = gma;
            gameCodeMapping[index].appendChild(new_elem);
        }

    })


    window.onclick = e => {
        if(e.target.innerHTML === 'Delete')
        {
            document.querySelector('#serviceProviderGameCode').value = e.target.parentElement.parentElement.children[1].innerText
            document.querySelector('#providerGameCode').value = e.target.parentElement.parentElement.children[2].innerText
            document.querySelector('#serviceProvider').value = e.target.parentElement.parentElement.children[3].innerText
            document.querySelector('#sboGameCode').value = e.target.parentElement.parentElement.children[5].innerText
            document.getElementsByName('delete')[0].checked  =true
        }
    }
})();