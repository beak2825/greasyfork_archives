// ==UserScript==
// @name         Sửa tên, ngày sinh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sửa tên, ngày sinh trạng nguyên tiếng việt!
// @author       Haictt
// @match        https://account.trangnguyen.edu.vn/profile/change_info
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437400/S%E1%BB%ADa%20t%C3%AAn%2C%20ng%C3%A0y%20sinh.user.js
// @updateURL https://update.greasyfork.org/scripts/437400/S%E1%BB%ADa%20t%C3%AAn%2C%20ng%C3%A0y%20sinh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var Name = document.querySelector('input[name="fullname"]')
    var dob = document.querySelector('input[name="dob"]')
    var namebutton = document.createElement('a')
    var dobbutton = document.createElement('a')
    namebutton.href = '#';dobbutton.href = '#'
    namebutton.innerText = 'Sửa Tên';dobbutton.innerText = 'Sửa Ngày Sinh'
    Object.assign(namebutton.style,{
        background:'#00ff0a',
        color:'black',
        width:'32px',
        height:'20px',
        padding:'4px'
    });
    Object.assign(dobbutton.style,{
        background:'#00ff0a',
        color:'black',
        width:'32px',
        height:'20px',
        padding:'4px'
    })
    insertAfter(namebutton,Name)
    insertAfter(dobbutton,dob)
    namebutton.addEventListener('click',()=>{
        Name.removeAttribute('disabled');
    })
    dobbutton.addEventListener('click',()=>{
        dob.removeAttribute('disabled');
    })
})();