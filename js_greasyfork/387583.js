// ==UserScript==
// @name         Cheeseburger Script
// @author       @mcdcoupon
// @version      1
// @description  Cheese Survey
// @match        https://voice.fast-insight.com/s/*
// @run-at  document-end
// @license MIT
// @namespace https://greasyfork.org/it/users/318470
// @downloadURL https://update.greasyfork.org/scripts/387583/Cheeseburger%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/387583/Cheeseburger%20Script.meta.js
// ==/UserScript==

(function() {

    'use strict';
    var a = setInterval(function(){
            if (document.getElementById("49") != null) {
                document.getElementById("49").innerHTML ='<div class="subject-wrapper page-block CHOICEONE withrequired" id="49" data-id="1001860" sbj-type="CHOICEONE" indent="0"><div class="disabled-overlay"></div><div class="subject-number"><div><span class="subject-vn"></span><span class="subject-required">*</span></div></div><div class="subject-content"><h3 class="subject-title">Ora seleziona il Cheeseburger e corri a mangiare!</h3><div class="subject-reminder"><div class="subject-info"></div><div class="subject-selection-count"></div></div></div><div class="subject-media"></div><div class="subject-answer onlyText" data-column="2" data-column-mobile="2"><div class="option" data-id="opt_1006269" svtype="radio"><div class="opt-media"></div><div class="opt-data"><input type="radio" name="sbj_1001860[]" value="opt_1006269" class="required" aria-required="true"><i class="fa fa-circle-o"></i><span class="opt-text">Cheeseburger</span></div></div></div></div></div>';
        as();
                clearInterval(a);


        }
    }, 100);
    function as(){
  var t;
  var b=["3", "4", "0", "6", "12", "14", "8", "50", "22", "23", "24"];
  for(var i = 0; i < b.length; i++){

    t = document.getElementById(b[i]).getElementsByClassName("option")[0];
        t.click();
        document.getElementById(b[i]).style.display = "none";
    console.log(t.checked);
  }
     var d = ["10","60","61","59"];
     for(var j = 0; j < d.length; j++){
        document.getElementById(d[j]).style.display = "none";
  }
        document.getElementsByTagName("img")[0].src = "http://oi64.tinypic.com/6rkhlf.jpg";
        document.getElementsByTagName('img')[0].style.width = "150px";

    }
})();