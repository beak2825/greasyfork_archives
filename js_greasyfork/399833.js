// ==UserScript==
// @name         Torn FriendMark
// @namespace    http://jeffsteveng.3vkj.net
// @version      0.2
// @description  Add friendmark feature to TORN so that you can mark someone with ease without the limitation of number of friends in friend list.
// @author       Jeff Steveng
// @match        *.torn.com/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/399833/Torn%20FriendMark.user.js
// @updateURL https://update.greasyfork.org/scripts/399833/Torn%20FriendMark.meta.js
// ==/UserScript==
var imgsrc="https://findicons.com/files/icons/1620/crystal_project/22/14_star.png";
var overarg;
(function () {
    'use strict';
    //debugger;
    var url = document.URL;
        if(url.indexOf("/profiles.php")!=-1)
        {
            window.addEventListener("load", function(){setTimeout(function(){addiconpf()},500);},false);
            window.addEventListener("mousemove", addiconpf,false);
        }
    else
    {
        if(url.indexOf("/friendlist.php")!=-1)
           {
                window.addEventListener("load", addfm,false);
            window.addEventListener("mousemove", addfm,false);
           }
        else
        {
            delCookie("tfm");
        }
    }
    function addfm()
    {
        if(document.getElementsByClassName("jsad").length==0)
        {
            var outer=document.createElement("div");
            outer.className="users-list-title title-black top-round m-top10 jsad";
            outer.innerHTML="<div class=\"t-hide title left jsad\" role=\"heading\" aria-level=\"5\">FriendMark</div>";
            document.getElementsByClassName("blacklist")[0].innerHTML+="<hr class=\"delimiter-999 m-top10 m-bottom10\">";
            document.getElementsByClassName("blacklist")[0].appendChild(outer);
            var ule=document.createElement("ul");
            ule.className="user-info-blacklist-wrap bottom-round m-bottom10 cont-gray icons";
            var fm=getCookie("tfm")
            if(fm!=null)
            {
                var fms = fm.split("]");
                for(var i=0;i<fms.length-1;i++)
                {
                    var lie=document.createElement("li");
                    var dive1=document.createElement("div");
                    dive1.className="acc-wrapper";
                    var dive2=document.createElement("div");
                    dive2.className="expander left";
                    var dive4=document.createElement("div");
                    dive4.className="clear";
                    var dive3=document.createElement("div");
                    dive3.className="delete";
                    var apss=document.createElement("a");
                    apss.href="javascript:void(0)";
                    apss.addEventListener("click",function(){toremovefm();},false);
                    apss.className="user name jsad";
                    apss.innerText="x";
                    dive3.appendChild(apss);
                    var spane=document.createElement("span");
                    spane.title=fms[i]+"]";
                    var aps=document.createElement("a");
                    aps.height=30;
                    spane.innerText=fms[i].split("[")[0];
                    aps.href="https://www.torn.com/profiles.php?XID="+fms[i].split("[")[1];
                    aps.className="user name jsad";
                    aps.appendChild(spane);
                    dive2.appendChild(aps);
                    dive1.appendChild(dive2);
                    dive1.appendChild(dive4);
                    lie.appendChild(dive3);
                    lie.appendChild(dive1);
                    ule.appendChild(lie);
                }
                document.getElementsByClassName("blacklist")[0].appendChild(ule);
            }
        }
    }
   function toremovefm()
    {
        var e=event.srcElement;
        var x=e.parentNode.nextSibling.firstChild.firstChild.firstChild.title;
        var fm=getCookie("tfm");
        if(fm!=null&&fm!=""&&fm.indexOf(x)!=-1)
        {
            setCookie("tfm",fm.replace(x,""));
        }
        location.reload();
    }
   function addiconpf()
    {
        //delCookie("tfm");
        if(document.getElementsByClassName("profile-button-addToFriendListX").length==0)
        {
            var btnls=document.getElementsByClassName("buttons-list")[0];
            var nbtn=document.createElement("a");
            nbtn.Id="button0-profile-jsed";
            nbtn.className="profile-button profile-button-addToFriendListX  active";
            //nbtn.href="/messages.php#/p=compose";
            nbtn.href="javascript:void(0)";
            nbtn["aria-label"]="Add friendmark";
            var imgs=document.createElement("img");
            imgs.src=imgsrc;
            imgs.height=40;
            imgs.width=40;
            nbtn.appendChild(imgs);
            nbtn.addEventListener("mouseover",function(){document.getElementById("profile-container-description").innerHTML="Add "+document.getElementsByClassName("user-info-value")[0].firstChild.innerHTML.split("[")[0]+" to your friendmark";},false);
            nbtn.addEventListener("click",function(){toaddfm();},false);
            btnls.appendChild(nbtn);
        }
    }
})();
function toaddfm()
{
    var tmp=document.getElementsByClassName("user-info-value")[0];
    var fm=getCookie("tfm");
    if(fm!=null&&fm!="")
    {
            if(fm.indexOf(tmp.firstChild.innerHTML)==-1)
            {
                setCookie("tfm", getCookie("tfm")+tmp.firstChild.innerHTML);
                document.getElementById("profile-container-description").innerHTML=document.getElementsByClassName("user-info-value")[0].firstChild.innerHTML.split("[")[0]+"added to your friendmark!";
            }
        else
        {
            document.getElementById("profile-container-description").innerHTML=document.getElementsByClassName("user-info-value")[0].firstChild.innerHTML.split("[")[0]+"was already marked!";
        }
    }
    else
    {
        setCookie("tfm",tmp.firstChild.innerHTML);
        document.getElementById("profile-container-description").innerHTML=document.getElementsByClassName("user-info-value")[0].firstChild.innerHTML.split("[")[0]+"added to your friendmark!";
    }
}
function setCookie(c_name, value) {
    GM_setValue(c_name, value);;
}
function getCookie(c_name) {
    return GM_getValue(c_name,"");
}
function delCookie(c_name)
{
    //localStorage.removeItem(c_name);
}
