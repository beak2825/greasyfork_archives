// ==UserScript==
// @name        FootPrints.autofill
// @version     1.1
// @include     https://support.iit.edu/*
// @namespace   https://greasyfork.org/users/932694
// @description autofill
// @downloadURL https://update.greasyfork.org/scripts/447474/FootPrintsautofill.user.js
// @updateURL https://update.greasyfork.org/scripts/447474/FootPrintsautofill.meta.js
// ==/UserScript==

//test push

//test update

var lastname = document.getElementsByName("last_name");


function changelastnamevalue(){

    lastname[0].value = "--"
};

function dolastnamebutton() {
    
    let btn = document.createElement("button");
    btn.innerHTML = "Click Me";
    btn.addEventListener("click", changelastnamevalue)

    var div_parent = lastname[0].parentElement;

    div_parent.appendChild(btn);
};

var intervalID = window.setInterval(
    dolastnamebutton,
    2000
);



(function(){
    dolastnamebutton();
});

