// ==UserScript==
// @name         Bypass FileCrypt
// @name:it   Bypassa FileCrypt
// @namespace    StephenP
// @version      1.4.0.6
// @description  Bypass FileCrypt and get the original link!
// @description:it Bypassa Filecrypt e ottieni il collegamento originale!
// @author       StephenP
// @grant        GM.xmlHttpRequest
// @match        http://filecrypt.cc/*
// @match        http://www.filecrypt.cc/*
// @match        http://filecrypt.co/*
// @match        http://www.filecrypt.co/*
// @match        https://filecrypt.cc/*
// @match        https://www.filecrypt.cc/*
// @match        https://filecrypt.co/*
// @match        https://www.filecrypt.co/*
// @run-at       document-end
// @connect      dcrypt.it
// @connect      self
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/403170/Bypass%20FileCrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/403170/Bypass%20FileCrypt.meta.js
// ==/UserScript==
(function () {
  var usenetAd=document.getElementsByTagName('A');//come on, why should anyone pay for access to pirated content?
  for(var i=0;i<usenetAd.length;i++){
    if(usenetAd[i].href.includes('/pink/')){
      usenetAd[i].parentNode.remove();
      i=usenetAd.length;
    }
  }
  if(document.location.href.includes("/Link/")){
    getSingleLink();
  }
  else if(document.location.href.includes("/Container/")){
    let art=document.getElementsByClassName("download")[0].parentNode.parentNode.parentNode.parentNode;
    let load=document.createElement("DIV");
    load.id="dcryptLoadMsg";
    load.style.marginBottom="2em";
    load.textContent="Loading decrypted links list from dcrypt.it...";
    art.parentNode.insertBefore(load,art);
    getCNL();
  }
})();
function getSingleLink(){
  if(document.body.getElementsByTagName("SCRIPT").length==0){
    window.stop();
    if(body.children.length>0){
      const a=document.body.innerHTML.lastIndexOf("http");
    	top.location.href=document.body.innerHTML.substring(a,document.body.innerHTML.indexOf('id=',a)+43).replace('&amp;', '&');
    }
    else{
      GM.xmlHttpRequest({
        method: "GET",
        url: document.location.href,
        onload: function(response) {
          const a=response.responseText.lastIndexOf("http");
          top.location.href=response.responseText.substring(a,response.responseText.indexOf('id=',a)+43);
        }
      });
    }
  }
}
function getCNL(){
  //var dlcButton=document.getElementsByClassName("dlcdownload");
  //Temporarily disabled as I don't have access to a pc right now to fix the issue with CnL button.
  var dlcButton=[];
  if(dlcButton.length>0){
    var inputs=document.getElementsByTagName('INPUT');
    var dlcId;
    /*for(var i=0;i<inputs.length;i++){
      if(inputs[i].getAttribute('name')=='hidden_cnl_id'){
        dlcId=inputs[i].getAttribute('value');
        i=inputs.length;
      }
    }*/ //left for reference
    dlcId=document.getElementsByClassName("dlcdownload")[0].attributes["onclick"].nodeValue.split('\'')[1];
    //console.log('dlcId='+dlcId);
    GM.xmlHttpRequest({
      method: "GET",
      url: "https://"+document.location.hostname+"/DLC/"+dlcId+".dlc",
      onload: function(response) {
				dcrypt(response.responseText);
      },
      onerror: function(response) {
        xhrLinkExtract();
      }
    });
  }
  else{
    try{
      xhrLinkExtract();
    }
    catch(e){
      console.log("Error decrypting the links locally: ");
      console.log(e);
      document.getElementById("dcryptLoadMsg").textContent="No DLC file is available for bulk download. You'll have to click on the download buttons to retrieve the links. This operation isn't currently automated by Bypass FileCrypt script.";
      document.getElementById("dcryptLoadMsg").style.color="red";
    }
  }
}
function dcrypt(content){
  //console.log(content);
  GM.xmlHttpRequest({
    method: "POST",
    url: "http://dcrypt.it/decrypt/paste",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: "content="+encodeURIComponent(content),
    onload: function(response) {
      //console.log(response);
      var obj=JSON.parse(response.response);
      //console.log(obj);
      var finalLinksDiv=document.createElement("DIV");
      finalLinksDiv.style.backgroundColor=bgColor();
      finalLinksDiv.style.borderRadius="10px";
      finalLinksDiv.style.padding="1em";
      finalLinksDiv.style.marginTop="1em";
      finalLinksDiv.style.color=textColor();
      finalLinksDiv.style.zIndex="10";
			finalLinksDiv.style.position="relative";
			finalLinksDiv.style.marginBottom="1em";
      let a=document.createElement("SPAN");
      a.textContent="Decrypted links:";
      finalLinksDiv.appendChild(a);
      finalLinksDiv.appendChild(document.createElement("BR"));
      finalLinksDiv.appendChild(document.createElement("BR"));
      if(obj.success.links.length>0){
        try{
          for (var link of obj.success.links) {
            console.log("Decrypted using dcrypt.it: "+link);
            let b=document.createElement("SPAN");
            b.textContent=link;
            b.addEventListener("click",function(){window.open(link)});
            b.addEventListener("contextmenu",copyLink)
            b.style.color=textColor();
            b.style.cursor="pointer";
            finalLinksDiv.appendChild(b);
            finalLinksDiv.appendChild(document.createElement("BR"));
          }
          console.log(finalLinksDiv);
          document.getElementById("dcryptLoadMsg").replaceWith(finalLinksDiv);
        }
        catch(e){
          console.log(e);
          xhrLinkExtract();
        }
        /*What was this code doing? I can't remember, but it seems it's not needed anymore
        const config = { attributes: true, childList: false, subtree: false };
        const callback = function(mutationList, observer) {
            for (const mutation of mutationList) {
                console.log(mutation);
                mutation.target.removeAttribute(mutation.attributeName);

            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(finalLinksDiv, config);
        */
      }
      else{
        xhrLinkExtract();
      }
    },
    onerror: function(response) {
      xhrLinkExtract();
    }
  });
}
function xhrLinkExtract(){
  var finalLinksDiv=document.createElement("DIV");
  finalLinksDiv.style.backgroundColor=bgColor();
  finalLinksDiv.style.borderRadius="10px";
  finalLinksDiv.style.padding="1em";
  finalLinksDiv.style.marginTop="1em";
  finalLinksDiv.style.color=textColor();
  finalLinksDiv.style.zIndex="10";
  finalLinksDiv.style.position="relative";
  finalLinksDiv.style.marginBottom="1em";
  let a=document.createElement("SPAN");
  a.textContent="Decrypted links:";
  finalLinksDiv.appendChild(a);
  finalLinksDiv.appendChild(document.createElement("BR"));
  finalLinksDiv.appendChild(document.createElement("BR"));
  var encLinks=document.querySelectorAll("[onclick^=openLink]");//get all the encrypted links
  for(let l of encLinks){
    let passA=l.getAttribute("onclick");
    let passB=passA.split("'");
    let passC=l.getAttribute(passB[1]);
    let link="http://"+document.location.hostname+"/Link/"+passC+".html"
    GM.xmlHttpRequest({
      method: "GET",
      url: link,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) {
        let scripts=response.responseXML.getElementsByTagName("SCRIPT")
        for(let s of scripts){
          if(s.innerHTML.includes("top.location.href=")){
            getFinalLink(s.innerHTML.split("'")[1],finalLinksDiv);
            continue
          }
        }
      }
    });
  }
  document.getElementById("dcryptLoadMsg").replaceWith(finalLinksDiv);
}
function getFinalLink(encLink,finalLinksDiv){
  let req=GM.xmlHttpRequest({
    method: "OPTIONS",
    url: encLink,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onreadystatechange: function(response) {
      req.abort();
      console.log(response)
      console.log("Decrypted locally: "+response.finalUrl);
      let b=document.createElement("SPAN");
      b.textContent=response.finalUrl;
      b.addEventListener("click",function(){window.open(response.finalUrl)});
      b.addEventListener("contextmenu",copyLink)
      b.style.color=textColor();
      b.style.cursor="pointer";
      finalLinksDiv.appendChild(b);
      finalLinksDiv.appendChild(document.createElement("BR"));
    }
  });
}
function bgColor(){
  var color="white";
  const colorTag=document.head.querySelector("meta[name=\"theme-color\"]");
  if(colorTag){
    color="#0b0d15";
  }
  return color
}
function textColor(){
  var color="black";
  const colorTag=document.head.querySelector("meta[name=\"theme-color\"]");
  if(colorTag){
    color="white";
  }
  return color
}
function copyLink(e){
  e.preventDefault();
  e.stopPropagation();
  navigator.clipboard.writeText(e.target.innerText);
  alert("Link copied: "+e.target.innerText);
}