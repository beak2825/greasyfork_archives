// ==UserScript==
// @name         Torn Notes
// @namespace    http://jeffsteveng.3vkj.net
// @version      0.1
// @description  Add notebook feature to TORN so that you take down notes without being a donator.
// @author       Jeff Steveng
// @match        *.torn.com/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/400093/Torn%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/400093/Torn%20Notes.meta.js
// ==/UserScript==

var overarg;
var isshown=0;
(function () {
    'use strict';
    //debugger;
            window.addEventListener("load", function(){setTimeout(function(){addx()},300);},false);
            window.addEventListener("mousemove", addx,false);
    function addx()
    {
        if(document.getElementsByClassName("jsadx").length==0)
        {
            var ule=document.getElementsByClassName("menu-items")[0];
            var lie=document.createElement("li");
            var alie=document.createElement("a");
            alie.href="javascript:void(0)";
            alie.className="jsadx";
            alie.addEventListener("click", shnote,false);
            alie.innerText="N";
            lie.appendChild(alie);
            ule.appendChild(lie);
        }
    }
    function shnote()
    {
        var mt=document.getElementById("mainContainer");
        if(isshown==0)
        {
            var ta=document.createElement("textarea");
            ta.id="tnotes";
            var svd=getCookie("tnotes");
            if(svd!=null)
            {
                ta.innerText=svd;
            }
            else
            {
                setCookie("tnotes","");
                ta.innerText=svd;
            }
            var wid=getCookie("tnoteswid");
             var het=getCookie("tnoteshet");
            if(wid!=""&&het!="")
            {
                ta.style="width: "+wid+"; height: "+het+";";
            }
            else
            {
                ta.style="width: 200px; height: 150px;";
            }
            ta.addEventListener('input',function () {
            setCookie("tnotes",document.getElementById('tnotes').value);
            setCookie("tnoteswid",document.getElementById('tnotes').style.width);
            setCookie("tnoteshet",document.getElementById('tnotes').style.height);
        });

        ta.addEventListener('propertychange',function () {
            setCookie("tnotes",document.getElementById('tnotes').value);
            setCookie("tnoteswid",document.getElementById('tnotes').style.width);
            setCookie("tnoteshet",document.getElementById('tnotes').style.height);
        });
            mt.insertBefore(ta,mt.firstChild);
            isshown=1;
            window.addEventListener("beforeunload",function(){
            setCookie("tnoteswid",document.getElementById('tnotes').style.width);
            setCookie("tnoteshet",document.getElementById('tnotes').style.height);
            });
        }
        else
        {
            isshown=0;
                        setCookie("tnoteswid",document.getElementById('tnotes').style.width);
            setCookie("tnoteshet",document.getElementById('tnotes').style.height);
            mt.removeChild(document.getElementById('tnotes'));
        }
    }
})();
    function setCookie(c_name, value) {
        GM_setValue(c_name, value);
    }
    function getCookie(c_name) {
        return GM_getValue(c_name,"");
    }

