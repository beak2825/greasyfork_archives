// ==UserScript==
// @name         9gag Rank
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Script to show ranks on 9 gag based on days of first registration (idea  of icons are from 9gag user @reannukeeves
// @author       @mrfreeman2019 known as @rehak
// @match        https://9gag.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404106/9gag%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/404106/9gag%20Rank.meta.js
// ==/UserScript==


(function() {

    var days = 0;



     //with PRO
     if (document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[1]){
        var daysP = document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[1].textContent;
         var dLNGP = daysP.length;
         var integP = parseInt(dLNGP, 10);
         if ( integP > 11){
             daysP = daysP.slice(2,-9) + daysP.slice(5,-5);
             days = parseInt(daysP, 10);
       // alert(daysP);
             };
         if ( integP <= 11){
             daysP = daysP.slice(2,-5);
             days = parseInt(daysP, 10);
       // alert(daysP);
              };
    };




    //without PRO
    if (document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[0] && !(document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[1])){
         var daysN = document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[0].textContent;
         var dLNGN = daysN.length;
         var integN = parseInt(dLNGN,10);
         if ( integN > 11){
             daysN = daysN.slice(2,-9) + daysN.slice(5,-5);
             days = parseInt(daysN, 10);
       // alert(daysN);
             };
        if ( integN <= 11){
             daysN = daysN.slice(2,-5);
             days = parseInt(daysN, 10);
        //alert(daysN);
              };
    };

   // alert(days);

    //var daysP = document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[1].textContent;
    //days = days.slice(2, -9) + days.slice(5,-5);
    //var daysNB = parseInt(days, 10);
  //  var daysN = document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[0].textContent;
    //var dLNGN = daysN.lenght;
    //var integN = parseInt(dLNGN, 10);
//alert(daysN);
  //  if ( integN == 10){
   //daysN = daysN.slice(2, -5);
     //    alert(daysN);
    //};
    //if (integN > 10){
      //  daysN = daysN.slice(2,-9) + daysN.slice(5,-5);
       //  alert(daysN);
    //};
    //alert(daysP);

    //document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[0].innerHTML = "General"

     var x = document.getElementsByClassName("profile-header")[0].getElementsByTagName('span')[0];
    var y = document.getElementsByClassName("profile-header")[0];
    var elem = document.createElement("img");
    var newtxt = document.createTextNode(" Default")

    if (days <= 69){
     elem.src = 'https://i.ibb.co/4j9wY9k/lvl1-9gag.png';
     newtxt = document.createTextNode(" Officer Cadet")
     x.appendChild(newtxt);
     x.style["color"] = '#808080';
     y.appendChild(elem);


    }
    if (days >=70 & days <=249){
     elem.src = 'https://i.ibb.co/JQLJMQD/lvl2-9gag.png';
     newtxt = document.createTextNode(" 2ND Lieutenant")
     x.appendChild(newtxt);
     x.style["color"] = '#cbd11b';
     y.appendChild(elem);
}

    if (days >=250 & days <=419){
     elem.src = 'https://i.ibb.co/rGqr2qW/lvl3-9gag.png';
     newtxt = document.createTextNode(" Lieutenant")
     x.appendChild(newtxt);
     x.style["color"] = '#aad11b';
     y.appendChild(elem);
}

     if (days >=420 & days <=634){
     elem.src = 'https://i.ibb.co/y4y2j6P/lvl4-9gag.png';
     newtxt = document.createTextNode(" Captain")
     x.appendChild(newtxt);
     x.style["color"] = '#59ba0f';
     y.appendChild(elem);
}

     if (days >=635 & days <=809){
     elem.src = 'https://i.ibb.co/b7LnkG6/lvl5-9gag.png';
     newtxt = document.createTextNode(" Major")
     x.appendChild(newtxt);
     x.style["color"] = '#0fba92';
     y.appendChild(elem);
}

     if (days >=810 & days <=1000){
     elem.src = 'https://i.ibb.co/P5KGnYX/lvl6-9gag.png';
     newtxt = document.createTextNode(" Lt. Colonel")
     x.appendChild(newtxt);
     x.style["color"] = '#08b9c9';
     y.appendChild(elem);
}

    if (days >=1001 & days <=1500){
     elem.src = 'https://i.ibb.co/Dpmtj3g/lvl7-9gag.png';
     newtxt = document.createTextNode(" Colonel")
     x.appendChild(newtxt);
     x.style["color"] = '#086dcc';
     y.appendChild(elem);
}

     if (days >=1501 & days <=1670){
     elem.src = 'https://i.ibb.co/K9PnbnS/lvl8-9gag.png';
     newtxt = document.createTextNode(" Brigadier")
     x.appendChild(newtxt);
     x.style["color"] = '#0836cc';
     y.appendChild(elem);
}

    if (days >=1671 & days <=2000){
     elem.src = 'https://i.ibb.co/0Z170mx/lvl9-9gag.png';
     newtxt = document.createTextNode(" Major General")
     x.appendChild(newtxt);
     x.style["color"] = '#6008cc';
     y.appendChild(elem);
}

    if (days >=2001 & days <=2700){
     elem.src = 'https://i.ibb.co/K51KJSh/lvl10-9gag.png';
     newtxt = document.createTextNode(" LT. General")
     x.appendChild(newtxt);
     x.style["color"] = '#d65d06';
     y.appendChild(elem);
}

    if (days >=2701 & days <=3000){
     elem.src = 'https://i.ibb.co/Rb76wyR/lvl11-9gag.png';
     newtxt = document.createTextNode(" General")
     x.appendChild(newtxt);
     x.style["color"] = '#ff0000';
     y.appendChild(elem);
}

     if (days >=3001){
     elem.src = 'https://i.ibb.co/cxD0vy3/lvl12-9gag.png';
     newtxt = document.createTextNode(" Field Marchal")
     x.appendChild(newtxt);
     x.style["color"] = '#b01e1e';
     y.appendChild(elem);
}

})()