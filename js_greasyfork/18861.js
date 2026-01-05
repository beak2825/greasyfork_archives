// ==UserScript==
// @name         Slither.io background changer!
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Slither.io background changer! Choose your colour and background to customize slither.io!
// @author       You
// @match       http://slither.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18861/Slitherio%20background%20changer%21.user.js
// @updateURL https://update.greasyfork.org/scripts/18861/Slitherio%20background%20changer%21.meta.js
// ==/UserScript==

(function() {

if (localStorage.savec) {
        
   document.body.style.backgroundColor = localStorage.getItem("savec");
        }
    if (localStorage.savei) {
        
   ii.src = localStorage.getItem("savei");
        }

bgImage = null;    
var parent = document.getElementById('playh');
var div = document.createElement('div');
var input = document.createElement('input');
    var input2 = document.createElement('input');
var button = document.createElement('span');
    var button2 = document.createElement('span');


input.type = 'color';
   
input.style.margin = '2px';
input.style.background = 'rgba(0, 0, 0, 0) none repeat scroll 0 0';
input.style.border = '0 none';
input.style.color = '#e0e0ff';
input.style.fontSize = '15px';
input.id = 'nice';
input.value = '#161c22';

button.textContent = 'Change colour!';
button.style.cursor = 'pointer';
button.style.color = '#FFF';
button.style.borderRadius = '24px';
button.style.margin = '2px';
button.style.padding = '2px 6px';
button.style.background = 'linear-gradient(180deg, #9DA, #485)';
button.onclick = function() { colour(); };

input2.setAttribute("type", "file");
    input2.setAttribute("accept", "  image/*");
 
input2.style.margin = '2px';
input.style.background = 'rgba(0, 0, 0, 0) none repeat scroll 0 0';
input2.style.border = '0 none';
input2.style.color = '#e0e0ff';
input2.style.fontSize = '15px';
input2.id = 'nicer';

button2.textContent = 'Change background!';
button2.style.cursor = 'pointer';
button2.style.color = '#FFF';
button2.style.borderRadius = '24px';
button2.style.margin = '2px';
button2.style.padding = '2px 6px';
button2.style.background = 'linear-gradient(180deg, #9DA, #485)';
button2.onclick = function() { image(); };   
    
    
    
    
div.appendChild(input);
div.appendChild(button);
    div.appendChild(input2);
div.appendChild(button2);

parent.appendChild(div);


})();

function colour(){
 

theColour = document.getElementById('nice').value;
localStorage.setItem("savec", theColour);
document.body.style.backgroundColor = localStorage.getItem("savec");
}

function image(){
      
        //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           theImage = reader.result;
localStorage.setItem("savei", theImage);
ii.src = localStorage.getItem("savei");
           
      

       };

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
  
    
  

}