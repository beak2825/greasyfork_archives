// ==UserScript==
// @name         CodehsHack
// @namespace    https://greasyfork.org/users/783447
// @version      2.0
// @description  Auto get HTML/styles for codeHS assignments
// @author       You
// @match        https://codehs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codehs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456907/CodehsHack.user.js
// @updateURL https://update.greasyfork.org/scripts/456907/CodehsHack.meta.js
// ==/UserScript==

(function() {

function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}

if(window.location.pathname.substring(0, 9) == "/student/") {
var itemID = document.getElementsByClassName('banner alert-warning center')[0].children[1].getAttribute('data-item-id')

window.open("https://codehs.com/editor/"+itemID+"/solution/index.html");
window.open("https://codehs.com/editor/"+itemID+"/solution/style.css");
//window.open("https://codehs.com/editor/"+itemID+"/solution/jobinfo.html");
}
else if(window.location.pathname.substring(0, 8) == "/editor/") {




setInterval(function(){
        if (document.getElementsByTagName('html')[0].innerHTML.indexOf('<!--') !== -1) {
            var scriptStart = document.getElementsByTagName('html')[0].innerHTML.indexOf('<noscript>');
            var scriptEnd = document.getElementsByTagName('html')[0].innerHTML.indexOf('</script>');
            var subScript = document.getElementsByTagName('html')[0].innerHTML.slice(scriptStart, scriptEnd+9);
            document.getElementsByTagName('html')[0].innerHTML = document.getElementsByTagName('html')[0].innerHTML.replace(subScript, '')

            var titleStart = document.getElementsByTagName('html')[0].innerHTML.indexOf('&lt;');
            var titleEnd = document.getElementsByTagName('html')[0].innerHTML.indexOf('&gt;');
            var titleSlice = document.getElementsByTagName('html')[0].innerHTML.slice(titleStart, titleEnd+4);
            document.getElementsByTagName('html')[0].innerHTML = document.getElementsByTagName('html')[0].innerHTML.replace(titleSlice, '')


            var badStart = document.getElementsByTagName('html')[0].innerHTML.indexOf('<!--');
            var badEnd = document.getElementsByTagName('html')[0].innerHTML.indexOf('-->');
            var badSub = document.getElementsByTagName('html')[0].innerHTML.slice(badStart, badEnd+3);
            var newHTML = document.getElementsByTagName('html')[0].innerHTML.replace(badSub, '');
            document.getElementsByTagName('html')[0].innerHTML = newHTML

            badStart = newHTML.indexOf('<!--', '-->')
            badEnd = newHTML.indexOf('-->');
            badSub = newHTML.slice(badStart, badEnd+3);

            if (document.getElementsByTagName('html')[0].innerHTML.indexOf('<!--') == -1) {
                console.log(newHTML)
                document.getElementsByTagName('body')[0].style.color = 'white'
                document.getElementsByTagName('body')[0].style.backgroundImage = "url('https://wallpaperaccess.com/full/1129018.jpg')"
                document.getElementsByTagName('body')[0].textContent = ''

                const newButton = document.createElement('button')
                newButton.innerHTML = 'Copy'
                newButton.style.display = "grid"
                newButton.style.border = "none"
                newButton.style.padding = "7px"
                newButton.style.width = "100px"
                newButton.style.backgroundColor = '#0e95cf'
                document.getElementsByTagName('body')[0].appendChild(newButton)
                newButton.addEventListener('click', function handleClick(event) {
                    copyStringToClipboard(newHTML)
                    window.close()
                });

            }
        }
}, 1);
}
})();