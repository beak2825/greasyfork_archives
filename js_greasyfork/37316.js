// ==UserScript==
// @name         Discogs data export v2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://www.discogs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37316/Discogs%20data%20export%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/37316/Discogs%20data%20export%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.includes("release/")){
       var title = document.getElementsByClassName("profile")[0].innerText;
    var have = document.getElementsByClassName("coll_num")[0].innerText;
    var want = document.getElementsByClassName("want_num")[0].innerText;
    var rating = document.getElementsByClassName("rating_value")[0].innerText;
    if(rating === "--"){rating=0;}
    var ratingCount = document.getElementsByClassName("rating_count")[0].innerText;
    if(ratingCount === "--"){ratingCount=0;}
    var highestSale = document.getElementsByClassName("last")[0].innerText;
    highestSale = highestSale.split("Highest:")[1];
    highestSale = highestSale.substring(2,highestSale.length-1);
    if(highestSale === "--"){highestSale=0;}
    var currentSale = document.getElementsByClassName("section marketplace_box_links")[0].innerText;

    var container2 = document.createElement('div');
		container2.setAttribute('id','info export');
		container2.setAttribute('style','width: 3000px;height: 20px;');

    var artist,release,date,country,genre,style,format,label,cat,size,currSalePrice,currSaleAmount;
    var splitIndex;

    title = title.replace("/\r?\n|\r/g","");

    //get artist
    splitIndex = title.indexOf(" ‎– ");
    if(splitIndex!==-1){
        artist = title.substring(0,splitIndex);
        title = title.substring(splitIndex+4,title.length);
    }

    //get release
    splitIndex = title.indexOf("Label:");
    if(splitIndex!==-1){
        release = title.substring(0,splitIndex-1);
        title = title.substring(splitIndex+7,title.length);
    }

    //get label
    splitIndex = title.indexOf(" ‎– ");
    if(splitIndex!==-1){
        label = title.substring(0,splitIndex);
        title = title.substring(splitIndex+4,title.length);
    }

    //get cat

        //get series if present
    if(title.includes("Series:")){
    splitIndex = title.indexOf("Series:");
    if(splitIndex!==-1){
        cat = title.substring(0,splitIndex-1);
        splitIndex = title.indexOf("Format:");
        title = title.substring(splitIndex+8,title.length);
    }
}
else{
    splitIndex = title.indexOf("Format:");
    if(splitIndex!==-1){
        cat = title.substring(0,splitIndex-1);
        title = title.substring(splitIndex+8,title.length);
    }
}


    //get format
    splitIndex = title.indexOf("Country:");
    if(splitIndex!==-1){
        format = title.substring(0,splitIndex-2);
        title = title.substring(splitIndex+9,title.length);
    }

    //get country
    splitIndex = title.indexOf("Released:");
    if(splitIndex!==-1){
        country = title.substring(0,splitIndex-1);
        title = title.substring(splitIndex+10,title.length);
    }

    //get date
    splitIndex = title.indexOf("Genre:");
    if(splitIndex!==-1){
        date = title.substring(0,splitIndex-1);
        title = title.substring(splitIndex+7,title.length);
    }

    //get genre
    splitIndex = title.indexOf("Style:");
    if(splitIndex!==-1){
        genre = title.substring(0,splitIndex-1);
        title = title.substring(splitIndex+7,title.length);
    }

    //get style
    style = title.substring(0,title.length-1);



    //get currSaleAmount
    splitIndex = currentSale.indexOf("For Sale");
    if(splitIndex!==-1){
        currSaleAmount = currentSale.substring(12,splitIndex-1);
        if(currSaleAmount === "--"){currSaleAmount=0;}
        currentSale = currentSale.substring(splitIndex+15,currentSale.length);
    }

    //get currSalePrice
    splitIndex = currentSale.indexOf("Buy");
    if(splitIndex!==-1){
        currSalePrice = currentSale.substring(0,splitIndex-1);
        if(currSalePrice === "--"){currSalePrice=0;}
    }

    var discogs = window.location.href.split("?")[0];
    var red = "https://redacted.ch/torrents.php?"+window.location.href.split("?")[1];
    var torrentId = red.split("id=")[1];
    var outPut = artist+"|"+release+"|"+label+"|"+cat+"|"+format+"|"+country+"|"+date+"|"+genre+"|"+style+"|"+have+"|"+want+"|"+rating+"|"+ratingCount+"|"+highestSale+"|"+currSaleAmount+"|"+currSalePrice+"|"+discogs+"|"+red;
    outPut = replaceAll(outPut,"undefined","-1");
    outPut = replaceAll(outPut,"--","-1");
    outPut = replaceAll(outPut,"-","-1");
    container2.innerHTML = outPut;
    //var top = document.getElementById("main_wrapper");
    //top.insertBefore(container2,top.childNodes[0]);

    if(window.location.href.includes("?")){
parent.postMessage(outPut,red);
    }



    if(parseInt(highestSale)>=100){
        document.body.style.backgroundColor = "green";
       // document.getElementById("main_wrapper").style.backgroundColor = "red";
        document.getElementById("site_headers_super_wrap").backgroundColor = "red;";
    }

        if(parseInt(want)/parseInt(have)>=10){
        document.body.style.backgroundColor = "red";
       // document.getElementById("main_wrapper").style.backgroundColor = "red";
        document.getElementById("site_headers_super_wrap").backgroundColor = "red;";
    }


    //save for discogs data
    var releaseId=parseInt(window.location.href.split('release/')[1]);
    var t=document.createElement('textareaDiscogs');
     t.setAttribute('id', 'discogsNotes');
  t.setAttribute('style', 'width: 100%;');
  t.rows="4";
    t.value=outPut;
    save(releaseId,t);
    alert("at save");
       }

    
}



)

();

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function save(id, t)
{
  var notes=window.localStorage.discogsNotes;
  if(!notes)
    notes=[];
  else
    notes=JSON.parse(notes);

  var noteExisted=false;
  for(var i=0; i<notes.length; i++)
  {
    if(notes[i].id === id)
    {
      notes[i].comment=t.value;
      noteExisted=true;
      break;
    }
  }
  if(!noteExisted)
  {
    notes.push({id:id, comment:t.value});
  }

  window.localStorage.discogsNotes=JSON.stringify(notes);
  resize('discogsNotes');
}
