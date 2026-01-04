// ==UserScript==
// @name     Microsoft Store Direct Download
// @name:it     Download diretto dal Microsoft Store
// @namespace    StephenP
// @version  2.0.4
// @description  Adds direct download links to Microsoft Store when browsing apps.
// @description:it  Aggiunge i link per il download diretto dal Microsoft Store quando si naviga tra le applicazioni.
// @author       StephenP
// @grant    GM.xmlHttpRequest
// @connect	 rg-adguard.net
// @match    https://apps.microsoft.com/*
// @match    https://apps.microsoft.com/*
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/394420/Microsoft%20Store%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/394420/Microsoft%20Store%20Direct%20Download.meta.js
// ==/UserScript==
var dlBtn;
(function(){
  setInterval(checkReload, 1000);
})();
function checkReload(){
   let moreBtn=querySelectorAllShadows(".buy-box-container");
   if((moreBtn.length>0)&&(querySelectorAllShadows("#dlBtn").length==0)){
     /*const origDlBtn=querySelectorAllShadows("sl-button[href^=ms-windows-store]",moreBtn[0]);
     console.log(origDlBtn);*/
     dlBtn = document.createElement("DIV");
     dlBtn.id="dlBtn";
     dlBtn.setAttribute("aria-label","Download from AdGuard Store");
     dlBtn.style.background="#00a686";
     dlBtn.style.font="initial";
     dlBtn.style.textAlign="center";
     dlBtn.style.borderRadius="var(--sl-input-border-radius-large)";
     dlBtn.style.marginTop="0.5em";
     dlBtn.innerText="";
     dlBtn.appendChild(document.createElement("P"));
     dlBtn.firstChild.innerText="\u25bc";
     dlBtn.addEventListener("click",function(){openLink(document.location.href,"url")});
     moreBtn[0].appendChild(dlBtn);
  }
}
function openLink(id,type){
  try{
    dlBtn.firstChild.innerText="...";
    var link="type="+type+"&url="+id+"&ring=RP&lang=it-IT";
    GM.xmlHttpRequest({
      method: "POST",
      url: "https://store.rg-adguard.net/api/GetFiles",
      data: link,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) {
        dlBtn.firstChild.innerText="\u25bc";
        try{
          var oldTable=querySelectorAllShadows("#linkTable");
          oldTable[0].parentNode.removeChild(oldTable[0]);
          var oldMsg=querySelectorAllShadows("#messageFromServer");
          oldMsg[0].parentNode.removeChild(oldMsg[0]);
        }
        catch(err){
          console.log(err);
        }
        try{
           output(response,type);
        }
        catch(err){
          console.log(err);
          if(type==="ProductId"){
            output(err,type);
          }
          else{
            let newId=querySelectorAllShadows("[product-id]")[0].getAttribute("product-id");
            openLink(newId,"ProductId");
          }
        }
      }
    });
  }
  catch(err){
    console.log(err);
    if(type==="ProductId"){
      output(err,type);
    }
    else{
      let newId=querySelectorAllShadows("[product-id]")[0].getAttribute("product-id");
      openLink(newId,"ProductId");
    }
  }
}
function output(response,type){
  var linkTable = document.createElement("div");
  linkTable.innerHTML=response.responseText;
  var justTable=linkTable.getElementsByTagName("TABLE")[0];
  var messageFromServer=linkTable.getElementsByTagName("P")[0];
  messageFromServer.id="messageFromServer";
  messageFromServer.style.fontWeight="bold";
  if(justTable!==undefined){
    if(!document.getElementById("realign")){
    let realign=document.createElement("STYLE");
      realign.id="realign"
      realign.innerText="div.details.two-column{display: initial}}";
      document.getElementsByTagName("HEAD")[0].appendChild(realign);
    }
    justTable.id="linkTable";
    const rows=justTable.getElementsByTagName("TBODY")[0].getElementsByTagName("TR");
    for(let row of rows){
      if(row.firstChild.firstChild){
        if(row.firstChild.firstChild.innerHTML.match(/\.appx$|\.appxbundle$|\.msix$|\.msixbundle$|\.exe$/)){
          row.style.fontWeight="bold";
        }
      }
    }
    let tableStyle=document.createElement("STYLE");
    tableStyle.innerHTML="td:last-child{word-break: break-all}";
    let pNl=querySelectorAllShadows("sl-card");
    if(pNl.length>0){
      const pN=pNl[0].parentNode;
      pN.insertBefore(justTable, pN.querySelector("sl-card"));
      pN.insertBefore(tableStyle, pN.querySelector("sl-card"));
      justTable.style.marginTop="2em";
      messageFromServer.style.color="green";
      pN.insertBefore(messageFromServer, pN.querySelector("sl-card"));
    }

  }
  else if((justTable===undefined)&&(type==="url")){
    let newId=querySelectorAllShadows("[product-id]")[0].getAttribute("product-id");
    openLink(newId,"ProductId");
  }
  else{
    messageFromServer.style.color="red";
    dlBtn.parentNode.parentNode.parentNode.appendChild(messageFromServer);
  }
}


//The following function has been taken from https://stackoverflow.com/questions/38701803/how-to-get-element-in-user-agent-shadow-root-with-javascript
/**
 * Finds all elements in the entire page matching `selector`, even if they are in shadowRoots.
 * Just like `querySelectorAll`, but automatically expand on all child `shadowRoot` elements.
 * @see https://stackoverflow.com/a/71692555/2228771
 */
function querySelectorAllShadows(selector, el = document.body) {
  // recurse on childShadows
  const childShadows = Array.from(el.querySelectorAll('*')).
    map(el => el.shadowRoot).filter(Boolean);

  // console.log('[querySelectorAllShadows]', selector, el, `(${childShadows.length} shadowRoots)`);

  const childResults = childShadows.map(child => querySelectorAllShadows(selector, child));

  // fuse all results into singular, flat array
  const result = Array.from(el.querySelectorAll(selector));
  return result.concat(childResults).flat();
}