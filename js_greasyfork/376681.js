// ==UserScript==
// @name         GitHub Stars
// @namespace    http
// @version      1.0
// @description  Get Total of GitHub stars
// @author       AdemKouki
// @include      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_]{1,25}$/
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/376681/GitHub%20Stars.user.js
// @updateURL https://update.greasyfork.org/scripts/376681/GitHub%20Stars.meta.js
// ==/UserScript==


function AddText(text){
    let el = document.querySelector(".vcard-username");
    let newNode = document.createElement('span');
    // add class
    newNode.classList.add("p-nickname");
    newNode.classList.add("vcard-username");
    newNode.classList.add("d-blockkkkkk");
    // insert new span after username
    el.parentNode.insertBefore(newNode, el.nextSibling);

    newNode.textContent += text + " ⭐";
}

function getInfos(){
  let total_stars = 0;
  let username = window.location.pathname.replace("/", "");

  var jqxhr = $.ajax( 'https://api.github.com/users/'+username+'/repos?per_page=100' )
  .done(function(res) {
    res.forEach(function (sandwich, index) {
            let stargazers_count = sandwich.stargazers_count;
            total_stars += stargazers_count;
       });
      AddText(total_stars);
  })
  .fail(function() {

  });


}

getInfos();
