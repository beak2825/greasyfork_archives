// ==UserScript==
// @name        Paidverts Autofiller(by DK)
// @description will fill Paidverts 3 text lines,automate ad view button & auto focus where necessary.
// @namespace   http://userscripts.org:8080/users/670670
// @include     http://paidverts.com/member/*
// @include     http://www.paidverts.com/member/*
// @include     https://www.paidverts.com/member/*
// @include     http://www.paidverts.com/member/paid_ads*
// @version     2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5153/Paidverts%20Autofiller%28by%20DK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/5153/Paidverts%20Autofiller%28by%20DK%29.meta.js
// ==/UserScript==

$("#adcopy_response").focus();

var elementtwo = window.content.document.getElementById("main_content");
                               elementtwo.scrollIntoView(true);

// -----------------auto focused on the main content --------------//

var btton=document.createElement("input");
btton.id="filltext";
btton.type="button";
btton.value="Fill Text";
btton.addEventListener("click", fillall);
btton.addEventListener("click", disb);
btton.setAttribute("style", "font-size:18px;position:center;");
submit_form_loading.appendChild(btton); 

    function fillall()
       {
          $("#copy-1").click();
          $("#copy-2").click();
          $("#copy-3").click();
       }
            function disb()
            {
               document.getElementById('filltext').style.visibility="hidden";
            }
// ------------- button is created ------------// 

var elementone = window.content.document.getElementById("t-1");
                               elementone.scrollIntoView(true);

$("#valid-3").get(0).onload = function() {
    if (this.src==="https://www.paidverts.com/assets/images/icons/positive.png"){
      $("#view_ad").click();
    }
}

// -------------- Ad is viewed ---------------//



