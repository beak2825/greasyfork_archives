// ==UserScript==
// @name         Add Register Button To Afeka
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yedion.afeka.ac.il/*
// @match        https://yedionp.afeka.ac.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411486/Add%20Register%20Button%20To%20Afeka.user.js
// @updateURL https://update.greasyfork.org/scripts/411486/Add%20Register%20Button%20To%20Afeka.meta.js
// ==/UserScript==

$(document).ready(function()
                  {
   try{
       if(sessionStorage.getItem("MyInfo") == null)
           sessionStorage.setItem("MyInfo",$("input[value*='מעבר לשנה']").attr("onclick").split("'List_Of_Courses','")[1].split(",-N ")[0]);
   }
   catch(err)
   {
       var checkOne = $(":contains('שם המשתמש באנגלית המשמש אותך גם למערכות האחרות')").length;
       if($(":contains('בוצעה פעולת LOGIN מאוחרת יותר או מעבר בין ימים')").length == 0 && checkOne == 0)
           send_form('MenuCall','-N,-N,-N61,-AH','');
   }

    try{
        $("input[value*='פרטים נוספים'],a:contains('פרטים נוספים')").closest("div").each(function(){
            var div = $(this);
            var childPratim = div.children("input[value*='פרטים נוספים'],a:contains('פרטים נוספים')");
            var tmp = "S_YPratem','";
            if(childPratim.attr("onclick").split(tmp)[1] == null)
                tmp = "YPratem','";
            var info = childPratim.attr("onclick").split(tmp)[1].split("','")[0];
            var buttonToRegister = "<a class='btn-u' onclick=" + '"javascript:SubmitForm(this' + ", '','YReg','";
            if(tmp == "S_YPratem','")
                buttonToRegister += sessionStorage.getItem("MyInfo") + ",";
            buttonToRegister += info + "','')" + '">';
            buttonToRegister += '<span class="fas fa-pencil-alt"></span> רישום לקורס</a>';
            console.log(div.children("a:contains('רישום לקורס')"));
            if(div.children("a:contains('רישום לקורס')").length == 0)
            {
                div.append(buttonToRegister);
            }
        });
    }
    catch(err)
    {
    }
});