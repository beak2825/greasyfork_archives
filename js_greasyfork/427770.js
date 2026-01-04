// ==UserScript==
// @name        AllDataSheet: straight to PDF
// @name:it     AllDataSheet: dritto al PDF
// @description With this script you will directly go to the PDF version of the datasheet when you click on the PDF icon in the search results.
// @description:it Con questo script andrai direttamente alla versione in PDF della scheda tecnica quando clicchi sull'icona del PDF nei risultati della ricerca.
// @namespace   StephenP
// @match     http://*.alldatasheet.com/*
// @match     https://*.alldatasheet.com/*
// @match     http://*.alldatasheetde.com/*
// @match     https://*.alldatasheetde.com/*
// @match     http://*.alldatasheet.com/*
// @match     https://*.alldatasheet.com/*
// @match     http://*.alldatasheetru.com/*
// @match     https://*.alldatasheetru.com/*
// @match     http://*.alldatasheet.es/*
// @match     https://*.alldatasheet.es/*
// @match     http://*.alldatasheetit.com/*
// @match     https://*.alldatasheetit.com/*
// @match     http://*.alldatasheet.pl/*
// @match     https://*.alldatasheet.pl/*
// @match     http://*.alldatasheetcn.com/*
// @match     https://*.alldatasheetcn.com/*
// @match     http://*.alldatasheet.jp/*
// @match     https://*.alldatasheet.jp/*
// @match     http://*.alldatasheet.co.kr/*
// @match     https://*.alldatasheet.co.kr/*
// @match     http://*.alldatasheetpt.com/*
// @match     https://*.alldatasheetpt.com/*
// @match     http://*.alldatasheet.vn/*
// @match     https://*.alldatasheet.vn/*
// @version     1.2.1
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/427770/AllDataSheet%3A%20straight%20to%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/427770/AllDataSheet%3A%20straight%20to%20PDF.meta.js
// ==/UserScript==
function clickOnMenu(){
  var links=document.getElementsByClassName("main")[0].getElementsByTagName("A");
  for(var link of links){
    if((link.href.includes("//pdf"))&&(link.href.includes("/view/"))){
      link.click();
      break;
    }
  }
}
if((window.location.href.includes("/datasheet-pdf/"))&&(!window.location.href.includes("pdfjs/web/viewer.html?file=/"))){
  if((window.location.href.includes("pdf1.alldatasheet"))||(window.location.href.includes("pdf2.alldatasheet"))){
    document.body.style.opacity="0"; //Not really necessary, but avoids misunderstanding on what the script is doing.
    var frames=document.getElementsByTagName("IFRAME");
    var found=false;
    for(let frame of frames){
      console.log("There are "+frames.length+" frames on the page");
      if(frame.src.includes("/datasheet-pdf/")){
        console.log("A frame with a datasheet pdf has been found: "+frame.src);
        found=true;
        window.location.href=frame.src;
      }
    }
    if(found==false){
      if(document.location.href.split("?file=//").length>1){
        let lnk=document.createElement("a");
        lnk.href="https://"+document.location.href.split("?file=//")[1];
        document.body.appendChild(lnk);
        lnk.click();
      }
      else{
        console.log("No way to extract a datasheet have been found.");
        document.body.style.opacity="100";
        clickOnMenu();
      }
      
    }
  }
  else if(window.location.href.includes("manufacture1.alldatasheet")){
    clickOnMenu();
  }
  else if(window.location.href.includes("www.alldatasheet")){
    clickOnMenu();
  }
}
else if(window.location.href.includes(".jsp")){ 
  var images = document.getElementsByTagName("IMG");
  for(let image of images){
    if(image.src.includes("datasheet.gif")){
      if(image.parentNode.href.includes("www.alldatasheet")){
      	image.parentNode.href=image.parentNode.href.replace("www.alldatasheet","pdf1.alldatasheet").replace("/pdf/","/view/");
      }
      else if(image.parentNode.href.includes("manufacture1.alldatasheet")){
        image.parentNode.href=image.parentNode.href.replace("manufacture1.alldatasheet","pdf2.alldatasheet").replace("/pdf/","/view/");
      }
    }
  }
}
