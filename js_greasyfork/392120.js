// ==UserScript==
// @name         InvokeFamily
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  InvokeFamilyAndFamilyMember!
// @author       MegaBOuSs
// @match        https://morocco.blsspainvisa.com/book_appointment.php
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/392120/InvokeFamily.user.js
// @updateURL https://update.greasyfork.org/scripts/392120/InvokeFamily.meta.js
// ==/UserScript==

    setTimeout(function(){$("#memberDiv").show();}, 3000);

    var newDiv = document.createElement("div");
    var familyTextNode= '<div class="row" style="margin-bottom:5px;">'
+'<div class="col-sm-4 lineheightExtra">Cahier de rendez-vous pour</div>'
+'<div class="col-sm-6">'
+'<div class="col-sm-1" style="margin-top:3px;">'
+'<input type="radio" class="app_type marginRight" name="app_type" id="app_type1" value="Individual" onchange="show'+"Div('Individual')"+';" checked="'+'">'
+'</div>'
+'<div class="col-sm-2">'
+'Individuels</div>'
+'<div class="col-sm-1" style="margin-left:10px;margin-top:3px;">'
+'<input type="radio" class="app_type marginRight" name="app_type" id="app_type2" value="Family" onchange="showDiv'+"('Family');"+'> "'
+'</div>'
+'<div class="col-sm-2">'
+'Famille</div>'
+'</div></div>';
var memberTextNode='<div class="row" id="memberDiv" style="display: block;">'
+'<div class="col-sm-4 label">Combien de nominations <span style="color:#F00; float:none">*</span>'+'</div>'
+'<div class="col-sm-6">'
+'<select id="member" name="member" class="form-control-input" autocomplete="off">'
+'<option value="2">2 Members</option>'
+'<option value="3">3 Members</option>'
+'<option value="4">4 Members</option>'
+'<option value="5">5 Members</option>'
+'<option value="6">6 Members</option>'
+'<option value="7">7 Members</option>'
+'<option value="8">8 Members</option>'
+'</select>'
+'</div>'
+'</div>';
document.querySelector('#app_type1').outerHTML=familyTextNode+memberTextNode;
setInterval(function(){if(document.getElementById('app_type2').checked){$("#memberDiv").show();}}, 3000)