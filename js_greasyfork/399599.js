// ==UserScript==
// @name         Torn Profile Previewer 2.0
// @namespace    http://jeffsteveng.3vkj.net
// @version      0.2
// @description  Get a preview of Torn Faction/Company Profile
// @author       Jeff Steveng
// @match        *.torn.com/*
// @grant        Me
// @downloadURL https://update.greasyfork.org/scripts/399599/Torn%20Profile%20Previewer%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/399599/Torn%20Profile%20Previewer%2020.meta.js
// ==/UserScript==
//Torn Profile Previewer
//For every link that leads you away to a faction/company page in TORN,
//this userscript redirects the link to show a preview of the basic profile faction/company without having to leave the current page.
//You can still access the original page by clicking the name of the company/faction on the preview.
//Click somewhere else to close the preview.
//This userscript is api-driven,so input your api key in the apikey varible,with quotes.
//Example:

//var apikey="Hcbpfra6m57LMQCD";

//Api key is used to get the simplified profile.
//Warning:Don't preview too much profile in a short time!
//You could possibly get an temporary ip ban due to api abuse if you use it more than 100 times per minute.
//----------
//This is my first time writing a userscript,so there maybe bugs.
//Report any bug that appears during your use by mailing me in TORN, thank you!
//jeff_steveng
var apikey="";
var overeventer;
var showing=0;
(function () {
    'use strict';
    window.addEventListener("load", adder,false);
    window.addEventListener("mousemove", adder,false);
    function adder()
    {
        var clkrs = document.getElementsByClassName("jspf");
            var ass = document.getElementsByTagName("a");
            for(var i=0;i<ass.length;i++)
            {
                if((ass[i].href.indexOf("joblist.php#/p=corpinfo&userID=")!=-1||ass[i].href.indexOf("factions.php?step=profile&userID=")!=-1)&&ass[i].className!="jscp")
                {
                    ass[i]._rd=ass[i].href;
                    ass[i].href="javascript:void(0)";
                    ass[i].addEventListener("click",function(){getpf();} ,true);
                    ass[i].className+=" jspf";
                }
                if((ass[i].href.indexOf("joblist.php#/p=corpinfo&ID=")!=-1||ass[i].href.indexOf("factions.php?step=profile&ID=")!=-1)&&ass[i].className!="jscp")
                {
                    ass[i]._rd=ass[i].href;
                    ass[i].href="javascript:void(0)";
                    ass[i].addEventListener("click",function(){getpfs();} ,true);
                    ass[i].className+=" jspf";
                }
                if((ass[i].href.indexOf("companies.php")!=-1||ass[i].href=="https://www.torn.com/factions.php")&&ass[i].className!="jscp")
                {
                    ass[i]._rd=ass[i].href;
                    ass[i].href="javascript:void(0)";
                    ass[i].addEventListener("click",function(){getpfss();} ,true);
                    ass[i].className+=" jspf";
                }
            }
            document.getElementsByTagName("body")[0].addEventListener("click",function(){crpf();} ,true);
    }
    function crpf()
    {
        if(showing==1)
        {
            rpf();
        }
    }
    function rpf()
    {
        var x=document.getElementsByClassName("js-tooltip");
        for(var ii=x.length-1;ii>=0;ii--)
            {
                x[ii].parentNode.removeChild(x[ii]);
            }
                    showing=0;

    }
    function holdlong()
    {
    }
function getpf()
    {
        if(showing==0)
        {
        var placeholder=event.srcElement._rd;
       overeventer=event.srcElement;
            if(placeholder.indexOf("joblist.php#/p=corpinfo&userID=")!=-1)
            {
                placeholder = placeholder.replace("https://www.torn.com/joblist.php#/p=corpinfo&userID=", "");
                placeholder = placeholder.replace("#", "");
                var tofulfill="";
                var clkr="";
                clkr+="https://api.torn.com/user/";
                clkr+=placeholder;
                clkr+="?selections=profile&key=";
                clkr+=apikey;
                var companyid=1;
                fetch(clkr).then(
            function (tmp) {
                return(tmp.json());
            }).then(
             function (tmp) {
                 companyid=String(tmp.job.company_id);
                 clkr="";
                clkr+="https://api.torn.com/company/";
                clkr+=companyid;
                clkr+="?selections=profile&key=";;
                clkr+=apikey;
                 fetch(clkr).then(
            function (tmp) {
                return(tmp.json());
            }).then(
             function (tmp) {
                 tofulfill+="<p><b>Company Name : </b><a href=\""+overeventer._rd+"\" style=\"color:blue\" class=\"jscp\"><b>"+tmp.company.name+"</b></a></p>";
                 tofulfill+="<p><b>Director Name : </b>";
                 for(var key in tmp.company.employees){
                     if(key==tmp.company.director)
                     {
                         tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key+"\" style=\"color:blue\" class=\"jscp\"><b>"
                         tofulfill+=tmp.company.employees[key].name+"</b></a></p>";
                     }
                 }
                 tofulfill+="<p><b>Company Type : ";
                 tofulfill+=getcomptype(tmp.company.company_type);
                 tofulfill+="</b></p>";
                 tofulfill+="<p><b>Rating : "+tmp.company.rating+"</b></p>";
                 tofulfill+="<p><b>Capacity : "+String(tmp.company.employees_hired)+"/"+String(tmp.company.employees_capacity)+"</b></p>";
                 tofulfill+="<p><b>History : "+String(tmp.company.days_old)+" days</b></p>";
                 showtools(tofulfill);
             });
             });
            }
            if(placeholder.indexOf("factions.php?step=profile&userID=")!=-1)
            {
                placeholder = placeholder.replace("https://www.torn.com/factions.php?step=profile&userID=", "");
                placeholder = placeholder.replace("#", "");
                tofulfill="";
                clkr="";
                clkr+="https://api.torn.com/user/";
                clkr+=placeholder;
                clkr+="?selections=profile&key=";
                clkr+=apikey;
                var factionid;
                fetch(clkr).then(
            function (tmp) {
                return(tmp.json());
            }).then(
             function (tmp) {
                 factionid=String(tmp.faction.faction_id);
                 clkr="";
                clkr+="https://api.torn.com/faction/";
                clkr+=factionid;
                clkr+="?selections=basic&key=";;
                clkr+=apikey;
                 fetch(clkr).then(
            function (tmp) {
                return(tmp.json());
            }).then(
             function (tmp) {
                 tofulfill+="<p><b>Faction Name : </b><a href=\""+overeventer._rd+"\" style=\"color:blue\" class=\"jscp\"><b>"+tmp.name+"</b></a></p>";
                 tofulfill+="<p><b>Leader: </b>";
                 for(var key in tmp.members){
                     if(key==tmp.leader)
                     {
                         tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key+"\" style=\"color:blue\" class=\"jscp\"><b>"
                         tofulfill+=tmp.members[key].name+"</b></a></p>";
                     }
                 }
                 if(tmp["co-leader"]!="None")
                 {
                     tofulfill+="<p><b>Co-Leader: </b>";
                     for(var key1 in tmp.members){
                         if(key1==tmp["co-leader"])
                         {
                             tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key1+"\" style=\"color:blue\" class=\"jscp\"><b>"
                             tofulfill+=tmp.members[key1].name+"</b></a></p>";
                         }
                     }
                 }
                 var mcc=0;
                 for(var key2 in tmp.members){
                     mcc++;
                 }
                 tofulfill+="<p><b>Members : "+mcc+"</b></p>";
                 tofulfill+="<p><b>Respect : "+tmp.respect+"</b></p>";
                 tofulfill+="<p><b>Age : "+String(tmp.age)+" days</b></p>";
                 tofulfill+="<p><b>Best Chain : "+String(tmp.best_chain)+"</b></p>";
                 showtools(tofulfill);
             });
             });
            }
        }
        else
        {
            rpf();
        }
    }
    function getpfs()
    {
        if(showing==0)
        {
        var placeholder=event.srcElement._rd;
       overeventer=event.srcElement;
            if(placeholder.indexOf("joblist.php#/p=corpinfo&ID=")!=-1)
            {
                placeholder = placeholder.replace("https://www.torn.com/joblist.php#/p=corpinfo&ID=", "");
                placeholder = placeholder.replace("#", "");
                var tofulfill="";
                var clkr="";
                clkr+="https://api.torn.com/company/";
                clkr+=placeholder;
                clkr+="?selections=profile&key=";;
                clkr+=apikey;
                 fetch(clkr).then(
            function (tmp) {
                return(tmp.json());
            }).then(
             function (tmp) {
                 tofulfill+="<p><b>Company Name : </b><a href=\""+overeventer._rd+"\" style=\"color:blue\" class=\"jscp\"><b>"+tmp.company.name+"</b></a></p>";
                 tofulfill+="<p><b>Director Name : </b>";
                 for(var key in tmp.company.employees){
                     if(key==tmp.company.director)
                     {
                         tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key+"\" style=\"color:blue\" class=\"jscp\"><b>"
                         tofulfill+=tmp.company.employees[key].name+"</b></a></p>";
                     }
                 }
                 tofulfill+="<p><b>Company Type : ";
                 tofulfill+=getcomptype(tmp.company.company_type);
                 tofulfill+="</b></p>";
                 tofulfill+="<p><b>Rating : "+tmp.company.rating+"</b></p>";
                 tofulfill+="<p><b>Capacity : "+String(tmp.company.employees_hired)+"/"+String(tmp.company.employees_capacity)+"</b></p>";
                 tofulfill+="<p><b>History : "+String(tmp.company.days_old)+" days</b></p>";
                 showtools(tofulfill);
             });
            }
            if(placeholder.indexOf("factions.php?step=profile&ID=")!=-1)
            {
                placeholder = placeholder.replace("https://www.torn.com/factions.php?step=profile&ID=", "");
                placeholder = placeholder.replace("#", "");
                tofulfill="";
                 clkr="";
                clkr+="https://api.torn.com/faction/";
                clkr+=placeholder;
                clkr+="?selections=basic&key=";;
                clkr+=apikey;
                 fetch(clkr).then(
            function (tmp) {
                return(tmp.json());
            }).then(
             function (tmp) {
                 tofulfill+="<p><b>Faction Name : </b><a href=\""+overeventer._rd+"\" style=\"color:blue\" class=\"jscp\"><b>"+tmp.name+"</b></a></p>";
                 tofulfill+="<p><b>Leader: </b>";
                 for(var key in tmp.members){
                     if(key==tmp.leader)
                     {
                         tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key+"\" style=\"color:blue\" class=\"jscp\"><b>"
                         tofulfill+=tmp.members[key].name+"</b></a></p>";
                     }
                 }
                 if(tmp["co-leader"]!="None")
                 {
                     tofulfill+="<p><b>Co-Leader: </b>";
                     for(var key1 in tmp.members){
                         if(key1==tmp["co-leader"])
                         {
                             tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key1+"\" style=\"color:blue\" class=\"jscp\"><b>"
                             tofulfill+=tmp.members[key1].name+"</b></a></p>";
                         }
                     }
                 }
                 var mcc=0;
                 for(var key2 in tmp.members){
                     mcc++;
                 }
                 tofulfill+="<p><b>Members : "+mcc+"</b></p>";
                 tofulfill+="<p><b>Respect : "+tmp.respect+"</b></p>";
                 tofulfill+="<p><b>Age : "+String(tmp.age)+" days</b></p>";
                 tofulfill+="<p><b>Best Chain : "+String(tmp.best_chain)+"</b></p>";
                 showtools(tofulfill);
             });
            }
        }
        else
        {
            rpf();
        }
    }
    function getpfss()
    {
        if(showing==0)
        {
        var placeholder=event.srcElement._rd;
       overeventer=event.srcElement;
            if(placeholder.indexOf("companies.php")!=-1)
            {
                var tofulfill="";
                var clkr="";
                clkr+="https://api.torn.com/company/";
                clkr+="?selections=profile&key=";;
                clkr+=apikey;
                 fetch(clkr).then(
            function (tmp) {
                return(tmp.json());
            }).then(
             function (tmp) {
                 tofulfill+="<p><b>Company Name : </b><a href=\""+overeventer._rd+"\" style=\"color:blue\" class=\"jscp\"><b>"+tmp.company.name+"</b></a></p>";
                 tofulfill+="<p><b>Director Name : </b>";
                 for(var key in tmp.company.employees){
                     if(key==tmp.company.director)
                     {
                         tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key+"\" style=\"color:blue\" class=\"jscp\"><b>"
                         tofulfill+=tmp.company.employees[key].name+"</b></a></p>";
                     }
                 }
                 tofulfill+="<p><b>Company Type : ";
                 tofulfill+=getcomptype(tmp.company.company_type);
                 tofulfill+="</b></p>";
                 tofulfill+="<p><b>Rating : "+tmp.company.rating+"</b></p>";
                 tofulfill+="<p><b>Capacity : "+String(tmp.company.employees_hired)+"/"+String(tmp.company.employees_capacity)+"</b></p>";
                 tofulfill+="<p><b>History : "+String(tmp.company.days_old)+" days</b></p>";
                 showtools(tofulfill);
             });
            }
            if(placeholder.indexOf("factions.php")!=-1)
            {
                tofulfill="";
                 clkr="";
                clkr+="https://api.torn.com/faction/";
                clkr+="?selections=basic&key=";;
                clkr+=apikey;
                 fetch(clkr).then(
            function (tmp) {
                return(tmp.json());
            }).then(
             function (tmp) {
                 tofulfill+="<p><b>Faction Name : </b><a href=\""+overeventer._rd+"\" style=\"color:blue\" class=\"jscp\"><b>"+tmp.name+"</b></a></p>";
                 tofulfill+="<p><b>Leader: </b>";
                 for(var key in tmp.members){
                     if(key==tmp.leader)
                     {
                         tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key+"\" style=\"color:blue\" class=\"jscp\"><b>"
                         tofulfill+=tmp.members[key].name+"</b></a></p>";
                     }
                 }
                 if(tmp["co-leader"]!="None")
                 {
                     tofulfill+="<p><b>Co-Leader: </b>";
                     for(var key1 in tmp.members){
                         if(key1==tmp["co-leader"])
                         {
                             tofulfill+="<a href=\"https://www.torn.com/profiles.php?XID="+key1+"\" style=\"color:blue\" class=\"jscp\"><b>"
                             tofulfill+=tmp.members[key1].name+"</b></a></p>";
                         }
                     }
                 }
                 var mcc=0;
                 for(var key2 in tmp.members){
                     mcc++;
                 }
                 tofulfill+="<p><b>Members : "+mcc+"</b></p>";
                 tofulfill+="<p><b>Respect : "+tmp.respect+"</b></p>";
                 tofulfill+="<p><b>Age : "+String(tmp.age)+" days</b></p>";
                 tofulfill+="<p><b>Best Chain : "+String(tmp.best_chain)+"</b></p>";
                 showtools(tofulfill);
             });
            }
        }
        else
        {
            rpf();
        }
    }
    function getcomptype(typer)
    {
        var tofulfill="";
        switch(typer)
                        {
                            case 19:
                                tofulfill+="Firework Stand";
                                break;
                            case 20:
                                tofulfill+="Property Broker";
                                break;
                            case 27:
                                tofulfill+="Restaurant";
                                break;
                            case 7:
                                tofulfill+="Game Shop";
                                break;
                            case 32:
                                tofulfill+="Lingerie Store";
                                break;
                            case 21:
                                tofulfill+="Furniture Store";
                                break;
                            case 11:
                                tofulfill+="Cyber Cafe";
                                break;
                            case 26:
                                tofulfill+="Gents Strip Club";
                                break;
                            case 4:
                                tofulfill+="Car Dealership";
                                break;
                            case 39:
                                tofulfill+="Detective Agency";
                                break;
                            case 13:
                                tofulfill+="Theater";
                                break;
                            case 15:
                                tofulfill+="Cruise Line";
                                break;
                            case 38:
                                tofulfill+="Mining Corporation";
                                break;
                                //
                            case 3:
                                tofulfill+="Flower Shop";
                                break;
                            case 1:
                                tofulfill+="Hair Salon";
                                break;
                            case 14:
                                tofulfill+="Sweet Shop";
                                break;
                            case 23:
                                tofulfill+="Music Store";
                                break;
                            case 12:
                                tofulfill+="Grocery Store";
                                break;
                            case 6:
                                tofulfill+="Gun Shop";
                                break;
                            case 33:
                                tofulfill+="Meat Warehouse";
                                break;
                            case 36:
                                tofulfill+="Ladies Strip Club";
                                break;
                            case 35:
                                tofulfill+="Software Corporation";
                                break;
                            case 29:
                                tofulfill+="Fitness Center";
                                break;
                            case 31:
                                tofulfill+="Amusement Park";
                                break;
                            case 37:
                                tofulfill+="Private Security Firm";
                                break;
                            case 16:
                                tofulfill+="Television Network";
                                break;
                            case 8:
                                tofulfill+="Candle Shop";
                                break;
                            case 5:
                                tofulfill+="Clothing Store";
                                break;
                            case 25:
                                tofulfill+="Pub";
                                break;
                            case 10:
                                tofulfill+="Adult Novelties";
                                break;
                            case 9:
                                tofulfill+="Toy Shop";
                                break;
                            case 30:
                                tofulfill+="Mechanic Shop";
                                break;
                            case 2:
                                tofulfill+="Law Firm";
                                break;
                            case 34:
                                tofulfill+="Farm";
                                break;
                            case 24:
                                tofulfill+="Nightclub";
                                break;
                            case 22:
                                tofulfill+="Gas Station";
                                break;
                            case 18:
                                tofulfill+="Zoo";
                                break;
                            case 40:
                                tofulfill+="Logistics Management";
                                break;
                            case 28:
                                tofulfill+="Oil Rig";
                                break;
                            default:
                                tofulfill+="Unknown";
                                break;
                        }
        return tofulfill;
    }
    function showtools(htmls)
    {
                 var para = document.createElement("div");
                 para.role="tootip";
                 para.className="ui-tooltip ui-widget ui-corner-all ui-widget-content white-tooltip";
                 para.className+=" js-tooltip";
                 para.style="top:"+String(getElementViewTop(overeventer.parentNode.parentNode)+overeventer.parentNode.parentNode.clientHeight)+"px; left:"+String(getElementViewLeft(overeventer.parentNode.parentNode))+"px; display:block;";
                 para.innerHTML+=htmls;
                 var bdy=document.getElementsByTagName("body")[0];
                 bdy.appendChild(para);
                 showing=1;
    }
    function getElementViewLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}
　　　　return actualLeft;
　　}

　　function getElementViewTop(element){
　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualTop += current. offsetTop;
　　　　　　current = current.offsetParent;
　　　　}
　　　　return actualTop;
　　}
})();


