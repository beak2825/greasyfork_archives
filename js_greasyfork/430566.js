// ==UserScript==
// @name     Tinder catfishing prevention tool
// @description This script has two functions: you can download the current picture of the shown profile to search it on the web using tools like Google Images reverse search, or you can directly check it for duplicates on TinEye. The purpose of this script is to help preventing catfishing. The script works both on desktop and mobile view.
// @description:it Questo script ha due funzioni: puoi scaricare l'immagine corrente del profilo mostrato per cercarla sul web usando strumenti come la ricerca inversa di Google Immagini, o puoi direttamente cercare se ha dei duplicati tramite TinEye. Lo scopo di questo script è prevenire le truffe da parte di profili falsi. Lo script funziona sia con la visualizzazione desktop che mobile.
// @namespace StephenP
// @author       StephenP
// @icon  data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAM1BMVEVlAAAAAAAvCwxWFh51IiqoM0DFRkj+NnTaR1b+QG7/RGv+TGn3UGT+VWP+Yl3/a1n/clVaiyVKAAAAAXRSTlMAQObYZgAAAOxJREFUOMuF01mSwyAMBFB2MKvvf9oRILElGfojAfWDclUcxs5Ydom19grsFfxL7E3Ym7AXYZ8fgPYPBNF+7pk9ZhV1f/Y0mnP49phTtI2f/SCzh1HYAsQv4KNvxBP40qLw1Mc+ihjaBQROSU1dSsl15KTUoYGghAaQopGc6/qhqnFaCddAVLIejYqPSJNSDJprBBwucJIvEX3SbwgOjkjB99SJ6oBFM1tl5k3UM3hwLbDOOeNampgGSDkaSMbUtYPp+DEBYAqE1gtgS70QdoJSNrG9kaN/XxLn29zA29LA5/teVlC+/ydeBOvsD9lMFRaj6m/rAAAAAElFTkSuQmCC
// @version  1.0.1.1
// @match https://tinder.com/*
// @match https://tinder.com/
// @connect tineye.com
// @grant        GM.xmlHttpRequest
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/430566/Tinder%20catfishing%20prevention%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/430566/Tinder%20catfishing%20prevention%20tool.meta.js
// ==/UserScript==
var loc;
var interval_1;
const tineyeIcon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 12.7 12.7" fill="#838485"><path d="M10.693 1.47a.79.79 0 0 0-.792.792.79.79 0 0 0 .768.791c.091.449.132 1.095.153 1.595-.711-.554-1.634-.84-2.602-.954-.062-.107-.299-.488-.564-.569-.307-.094-3 .189-3 .189-.425.253-.683.56-.847.831l-.334.114c-.95.355-1.481 1.074-1.78 1.723-.063-.446-.154-1.173-.136-1.558.235-.131.381-.38.381-.649 0-.411-.333-.744-.744-.744s-.744.333-.744.744c0 .352.247.656.591.728l.283 2.78s-.283.473-.212.851c.063.336.443.531.532.573a2.58 2.58 0 0 0 .531.726c.803.78 2.457 1.087 4.063 1.04s4.299-1.489 4.748-1.725 2.244-.496.661-3.165a3.29 3.29 0 0 0-.342-.472c-.139-.699-.169-1.873-.175-2.19a.79.79 0 0 0 .119-1.217.79.79 0 0 0-.56-.232zM7.766 3.664c.269-.021.481.074.481.074s-1.027.26-1.027 1.028l-3.647.542-.027-.507 3.402-.52c.224-.461.549-.596.818-.617zm-.652 1.596l2.135.07.152.011-.033.148s-.062.295-.1.662-.042.808.049 1.06c.192.533.834 1.076.834 1.076l.162.133-.191.089s-1.871.879-3.08 1.096c-.807.145-1.725.157-2.498.103a9.36 9.36 0 0 1-1.02-.123c-.284-.052-.495-.107-.633-.183-.258-.143-.483-.448-.658-.787s-.297-.708-.283-1.012c.025-.556.262-1.121.613-1.418l.013-.012.016-.008c1.516-.698 3.347-.908 4.521-.908zm0 .264c-1.135 0-2.928.213-4.385.877-.261.226-.494.736-.516 1.216-.01.216.093.568.254.879s.385.585.552.678c.075.042.28.104.551.154s.614.093.992.119c.756.053 1.657.039 2.432-.1 1.074-.192 2.681-.94 2.859-1.022-.146-.124-.586-.466-.787-1.023-.122-.338-.102-.795-.063-1.178.03-.296.063-.437.082-.535l-1.973-.066zm-.171.429c.563 0 1.097.511 1.271 1.217.096.389.069.792-.074 1.119s-.391.552-.689.625-.622-.011-.901-.234-.489-.568-.585-.957-.069-.792.074-1.119.391-.552.689-.625c.07-.017.142-.026.214-.026zm-3.047.378c.563 0 1.097.512 1.27 1.217.199.811-.142 1.592-.763 1.745-.298.073-.622-.011-.901-.235s-.489-.568-.584-.958-.069-.792.074-1.119.391-.552.689-.625c.07-.017.142-.025.214-.025z"/><g transform="matrix(.986002 -.166734 .166734 .986002 .003 -.396)"><ellipse cx="2.348" cy="8.926" rx=".354" ry=".543"/><ellipse cx="5.45" cy="9.14" rx=".354" ry=".543"/></g></svg>';
const newtabIcon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 12.7 12.7" fill="#838485"><path d="M3.803.371c-.126 0-.247.05-.336.139s-.139.21-.139.336v2.507H.955c-.126 0-.247.05-.336.139s-.139.21-.139.336v8.051c0 .126.05.247.139.336s.21.139.336.139h8.051c.126 0 .247-.05.336-.139s.139-.21.139-.336V9.371h2.373c.262 0 .474-.212.474-.474V.846c0-.126-.05-.247-.139-.336s-.21-.139-.336-.139h-8.05zm.474.949h7.102v7.101H4.277V1.32zM1.43 4.303h1.898v4.594c0 .126.05.247.139.336s.21.139.336.139h4.728v2.033H1.43V4.303zm8.843-2.102H7.678c-.219 0-.396.178-.396.396 0 .105.041.207.116.281a.4.4 0 0 0 .281.117h1.64L5.435 6.877c-.075.074-.117.176-.117.281s.042.207.117.281a.41.41 0 0 0 .296.117.45.45 0 0 0 .081-.011l.026-.007.025-.009a.39.39 0 0 0 .134-.089l3.881-3.882v1.64c0 .219.177.397.396.397.106 0 .207-.041.282-.116s.117-.176.117-.281v-2.6c0-.145-.079-.278-.206-.347l-.024-.012-.023-.01-.028-.01-.025-.007-.027-.005c-.022-.004-.044-.005-.066-.005z"/></svg>';
const tineyeIconMobile='<svg class="Sq(52px)" width="24px" height="24px" aria-hidden="true" focusable="false" role="presentation" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="linearGradient877" x1="3.1" x2="16.8" y1="17.3" y2="2.8" gradientUnits="userSpaceOnUse"><stop stop-color="#2082c6" offset="0"/><stop stop-color="#a3a6ea" offset="1"/></linearGradient></defs><style>@keyframes rotation {from{transform: rotate(0deg);}to{transform: rotate(359deg);}}</style><g transform="translate(2 2)"><circle cx="10" cy="10" r="10" fill="url(#linearGradient877)"/><g transform="matrix(1.0631 0 0 1.0631 3.0073 2.8805)" fill="#fff"><path transform="scale(.26458)" d="m40.402 7.0527a2.9911 2.9911 0 0 0-2.9922 2.9922 2.9911 2.9911 0 0 0 2.9043 2.9883c0.34351 1.6982 0.49902 4.1396 0.58008 6.0273-2.6879-2.0947-6.1739-3.1765-9.834-3.6055-0.23541-0.40348-1.1294-1.8436-2.1328-2.1523-1.1607-0.35714-11.338 0.71484-11.338 0.71484-1.6059 0.95587-2.5826 2.1166-3.2012 3.1406-0.44614 0.14189-0.87106 0.285-1.2637 0.43164-3.5889 1.3404-5.5993 4.0604-6.7266 6.5117-0.23741-1.6853-0.5833-4.4319-0.51562-5.8887a2.8125 2.8125 0 0 0 1.4395-2.4531 2.8125 2.8125 0 0 0-2.8125-2.8125 2.8125 2.8125 0 0 0-2.8125 2.8125 2.8125 2.8125 0 0 0 2.2344 2.752l1.0684 10.506s-1.0706 1.7863-0.80273 3.2148c0.2379 1.2688 1.676 2.0084 2.0098 2.166 0.44444 0.90448 1.0632 1.8274 2.0078 2.7441 3.0357 2.9464 9.286 4.1083 15.357 3.9297 6.0714-0.17857 16.249-5.6267 17.945-6.5195 1.6964-0.89286 8.4821-1.8736 2.5-11.963-0.38351-0.64681-0.81841-1.2377-1.291-1.7852-0.52537-2.6418-0.63773-7.0795-0.66016-8.2754a2.9911 2.9911 0 0 0 1.3262-2.4844 2.9911 2.9911 0 0 0-2.9902-2.9922zm-11.061 8.293c1.0156-0.07813 1.8184 0.2793 1.8184 0.2793s-3.8828 0.98298-3.8828 3.8848l-13.783 2.0488-0.10156-1.916 12.857-1.9648c0.84822-1.7411 2.0762-2.2539 3.0918-2.332zm-2.4648 6.0332c4.3954 0 8.0684 0.26562 8.0684 0.26562l0.57617 0.04297-0.125 0.56055s-0.23492 1.1164-0.37695 2.5039-0.15755 3.0548 0.18555 4.0078c0.72473 2.0131 3.1504 4.0684 3.1504 4.0684l0.61328 0.50195-0.72266 0.33789s-7.0699 3.3236-11.643 4.1426c-3.0518 0.54659-6.5183 0.59377-9.4414 0.39062-1.4615-0.10158-2.782-0.26795-3.8535-0.46484-1.0715-0.1969-1.8703-0.40428-2.3906-0.69336-0.97607-0.54226-1.8244-1.6934-2.4883-2.9746-0.66388-1.2812-1.1224-2.6776-1.0703-3.8242 0.095434-2.0995 0.99181-4.2369 2.3184-5.3594l0.050781-0.04492 0.060547-0.0293c5.7299-2.6376 12.652-3.4316 17.088-3.4316zm0 0.99609c-4.2902 0-11.068 0.80623-16.572 3.3145-0.98531 0.85277-1.8667 2.7831-1.9492 4.5977-0.037169 0.81771 0.35249 2.1481 0.96094 3.3223 0.60844 1.1742 1.4568 2.2119 2.0879 2.5625 0.28324 0.15736 1.0581 0.39388 2.082 0.58203 1.0239 0.18815 2.3209 0.35185 3.75 0.45117 2.8582 0.19864 6.261 0.14789 9.1914-0.37695 4.0578-0.72677 10.134-3.5524 10.807-3.8613-0.55041-0.46846-2.2165-1.7614-2.9746-3.8672-0.46048-1.2791-0.38448-3.0039-0.23633-4.4512 0.11468-1.1203 0.23671-1.6514 0.31055-2.0234-0.4457-0.03124-3.3959-0.25-7.457-0.25zm-0.64453 1.6211a5.7143 4.375 76.19 0 1 4.8027 4.6016 5.7143 4.375 76.19 0 1-2.8848 6.5938 5.7143 4.375 76.19 0 1-5.6133-4.5039 5.7143 4.375 76.19 0 1 2.8848-6.5938 5.7143 4.375 76.19 0 1 0.81055-0.09766zm-11.518 1.4297a5.7143 4.375 76.19 0 1 4.8008 4.6016 5.7143 4.375 76.19 0 1-2.8828 6.5938 5.7143 4.375 76.19 0 1-5.6133-4.5059 5.7143 4.375 76.19 0 1 2.8848-6.5938 5.7143 4.375 76.19 0 1 0.81055-0.0957z" color="#000000"/><ellipse transform="rotate(-9.598)" cx="2.3479" cy="8.9264" rx=".35435" ry=".54334" color="#000000"/><ellipse transform="rotate(-9.598)" cx="5.4505" cy="9.1396" rx=".35435" ry=".54334" color="#000000"/></g></g></svg>';
const newtabIconMobile='<svg class="Sq(52px)" width="24px" height="24px" aria-hidden="true" focusable="false" role="presentation" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="linearGradient878" x1="3.1" x2="16.8" y1="17.3" y2="2.8" gradientUnits="userSpaceOnUse"><stop stop-color="#1ac34e" offset="0"/><stop stop-color="#75f4be" offset="1"/></linearGradient></defs><g transform="translate(2 2)"><circle cx="10" cy="10" r="10" fill="url(#linearGradient878)"/><g transform="matrix(.73767 0 0 .73767 5.3774 5.4107)" fill="#fff" shape-rendering="auto"><path transform="scale(.26458)" d="m14.373 1.4023a1.7939 1.7939 0 0 0-1.7949 1.7949v9.4766h-8.9688a1.7939 1.7939 0 0 0-1.793 1.7949v30.428a1.7939 1.7939 0 0 0 1.793 1.7949h30.428a1.7939 1.7939 0 0 0 1.7949-1.7949v-9.4785h8.9688a1.7939 1.7939 0 0 0 1.793-1.793v-30.428a1.7939 1.7939 0 0 0-1.793-1.7949zm1.793 3.5879h26.842v26.84h-26.842zm-10.762 11.271h7.1738v17.363a1.7939 1.7939 0 0 0 1.7949 1.793h17.871v7.6855h-26.84z"/><path transform="scale(.26458)" d="m38.828 8.3184a1.5002 1.5002 0 0 0-0.03711 0.00195h-9.7734a1.5 1.5 0 0 0-1.498 1.498 1.5 1.5 0 0 0 1.498 1.5059h6.1992l-14.674 14.668a1.5 1.5 0 0 0 0 2.125 1.5 1.5 0 0 0 1.1191 0.44141 1.5 1.5 0 0 0 0.30469-0.04297 1.5 1.5 0 0 0 0.09961-0.02734 1.5 1.5 0 0 0 0.0957-0.03516 1.5 1.5 0 0 0 0.50781-0.33594l14.668-14.674v6.1992a1.5 1.5 0 0 0 1.498 1.5 1.5 1.5 0 0 0 1.5059-1.5v-9.8242a1.5002 1.5002 0 0 0-0.7793-1.3125 1.5002 1.5002 0 0 0-0.0918-0.046875 1.5002 1.5002 0 0 0-0.08789-0.037109 1.5002 1.5002 0 0 0-0.0078-0.00391 1.5002 1.5002 0 0 0-0.0059-0.00195 1.5002 1.5002 0 0 0-0.0918-0.03125 1.5002 1.5002 0 0 0-0.0957-0.027344 1.5002 1.5002 0 0 0-0.0039 0 1.5002 1.5002 0 0 0-0.0039 0 1.5002 1.5002 0 0 0-0.0957-0.019531 1.5002 1.5002 0 0 0-0.25-0.019531z"/></g></g></svg>';
var tineyeString;
var newtabString;
const jsonLocalization=JSON.parse('{ "en": { "noDuplicates": "TinEye could not find any duplicate for this picture.", "openFirstResultA": "TinEye found this picture ", "openFirstResultB": " times on the web. Check the console for the urls of the first matches, or click OK to open the first result (", "noResponse": "Could not get a response from TinEye", "xhrStatus": "TinEye query result: ", "match": "Match: ", "searchOnTineye": "SEARCH PHOTO ON TINEYE", "openInNewTab": "OPEN PHOTO IN NEW TAB" }, "it": { "noDuplicates": "TinEye non ha trovato nessun duplicato per questa immagine.", "openFirstResultA": "TinEye ha trovato questa immagine ", "openFirstResultB": " volte sul web. Controlla nella console gli url dei primi risultati, o clicca OK per aprire il primo risultato (", "noResponse": "Non è stato possibile ottenere una risposta da TinEye", "xhrStatus": "Risultato della richiesta a TinEye: ", "match": "Corrispondenza: ", "searchOnTineye": "CERCA FOTO SU TINEYE", "openInNewTab": "APRI FOTO IN NUOVA SCHEDA" } }');
var l;    
(function(){
  let lang=getLang();
  if(lang.startsWith("it")){
    l=jsonLocalization.it;    
  }
  else{
    l=jsonLocalization.en;
  }
  tineyeString=l.searchOnTineye;
	newtabString=l.openInNewTab;
  setInterval(startCheck,1000);
})();
function startCheck(){
 if(document.location!=loc){
  clearInterval(interval_1);
 	interval_1=setInterval(check,500);
  loc=document.location.toString();
 }
}
function check(){
  if((document.getElementsByTagName("BUTTON").length>0)&&(!document.getElementById("teBtn"))){
    if((document.location.href.includes("/recs"))||(document.location.href.includes("/matches"))||((document.location.href.includes("/messages"))&&(document.location.href.includes("/profile")))){
      if(document.getElementsByClassName("recsCardboard__cardsContainer").length>0){//if the page is showing a cardboard (desktop)
        clearInterval(interval_1);
        let page=document.getElementsByTagName("main")[0];
        let block=document.createElement("DIV");
        block.style.position="absolute";
        block.style.right="10px";
        block.style.top="0";
        block.style.display="flex";
        page.appendChild(block);
        let dlTip=document.createElement("DIV");
        dlTip.style.color="#838485";
        dlTip.style.padding="10px";
        dlTip.style.fontFamily="ProximaNova,sans-serif";
        dlTip.style.fontWeight="800";
        dlTip.style.fontSize="1.2rem";
        dlTip.style.cursor="pointer";
        dlTip.style.marginBottom="5px";
        dlTip.style.textAlign="center";
        dlTip.innerHTML=newtabIcon;
        let teTip=dlTip.cloneNode(false);
        teTip.innerHTML=tineyeIcon;
        teTip.id="teBtn";
        block.appendChild(dlTip);
        block.appendChild(teTip);
        dlTip.addEventListener('click',function(){getImage("dl","i")},false);
        teTip.addEventListener('click',function(){getImage("te","i")},false);
      }
      else if(document.getElementsByClassName("chatProfile").length>0){
        clearInterval(interval_1);
        let downBtn=document.getElementsByClassName("profileCard__card")[0].getElementsByTagName("A")[0];
        if(downBtn.href.includes("/app/messages/")){
          dlTip=downBtn.cloneNode(false);
          dlTip.innerHTML=newtabIconMobile;
          dlTip.style.right="130px";
          dlTip.removeAttribute("href");
          dlTip.style.cursor="pointer";
          teTip=downBtn.cloneNode(false);
          teTip.innerHTML=tineyeIconMobile;
          teTip.style.right="70px";
          teTip.removeAttribute("href");
          teTip.style.cursor="pointer";
          teTip.id="teBtn";
          downBtn.parentNode.insertBefore(dlTip, downBtn.nextSibling);
          downBtn.parentNode.insertBefore(teTip, dlTip.nextSibling);
          dlTip.addEventListener('click',function(){getImage("dl","iM")},false);
          teTip.addEventListener('click',function(){getImage("te","iM")},false);
        }
      }
    }
    else if((document.location.href.includes("/messages"))&&(!document.location.href.includes("/profile"))){
      if(document.getElementsByClassName('chatProfile').length>0){
        clearInterval(interval_1);
        let profTab=document.getElementsByClassName('chatProfile')[0];
        let ops=profTab.lastElementChild.cloneNode(true);
        let btns=ops.getElementsByTagName("BUTTON");
        btns[0].innerHTML=newtabString;
        btns[1].innerHTML=tineyeString;
        btns[1].id="teBtn";
        btns[0].addEventListener("click",function(){getImage("dl","t")},false);
        btns[1].addEventListener("click",function(){getImage("te","t")},false);
        profTab.appendChild(ops);
        
      }
    }
  }
}
function getImage(mode,iconMode){
  try{
    var cardboards=document.getElementsByClassName("keen-slider");
    for(let c of cardboards){
      if(c.parentNode.parentNode.getAttribute("aria-hidden")!="true"){
        let photoTabs=c.getElementsByClassName("keen-slider__slide");
        for(let p of photoTabs){
          if(p.getAttribute("aria-hidden")=="false"){
            let link;
            link=p.children[0].style.backgroundImage;
            if(!link.includes("http")){
              link=p.children[0].children[0].style.backgroundImage;
            }
            link=link.substring(5,link.length-2);
            console.log(link);
            //uncomment the line below to test the json viewer
            //link='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/1200px-President_Barack_Obama.jpg';
            if(link.includes("http")){//if the extraction of the link was successful
              if(mode=="dl"){//download picture
                window.open(link);
              }
              else{//search on tineye
                var teTip=document.getElementById("teBtn");
                if(iconMode=="iM"){
                  teTip.style.animation="rotation 2s linear infinite";
                }
                else{
                	teTip.innerHTML="...";
                }
                GM.xmlHttpRequest({
                  method: "POST",
                  url: "https://tineye.com/result_json/",
                  headers: {"Content-Type": "multipart/form-data; boundary=---------------------------0",
                            "Origin": "https://tineye.com",
                            "Referer": "https://tineye.com/search"},
                  data: '-----------------------------0\nContent-Disposition: form-data; name=\"url\"\n\n'+link+'\n-----------------------------0--',
                  onload: function(response) {
                    if(iconMode=="i"){
                      teTip.innerHTML=tineyeIcon;
                    }
                    else if(iconMode=="iM"){
                      teTip.style.animation="none";
                    }
                    else{
                      teTip.innerHTML=tineyeString;
                    }
                    let rsp=JSON.parse(response.responseText);
                    if(rsp.num_matches>0){
                      try{
                        let firstUrl=rsp.matches[0].domains[0].backlinks[0].backlink;
                        if(confirm(l.openFirstResultA+rsp.num_matches+l.openFirstResultB+firstUrl+").")){
                          window.open(firstUrl);
                        } 
                      }
                      catch(e){//just in case the first Url can't be extracted
                        console.log(e);
                        alert(l.openFirstResultA+rsp.num_matches+l.openFirstResultB+"---"+").")
                      }
                      createJsonViewer(rsp);
                    }
                    else{
                      alert(l.noDuplicates);
                    }
                  },
                  onerror: function(response) {
                    console.log(l.xhrStatus+response.status);
                    console.log(response);
                    if(iconMode=="i"){
                      teTip.innerHTML=tineyeIcon;
                    }
                    else if(iconMode=="iM"){
                      teTip.style.animation="none";
                    }
                    else{
                      teTip.innerHTML=tineyeString;
                    }
                    console.log(l.noResponse);    
                  }
                }); 
              }
            }
            break;
          }
        }
        break;
      }
    }
  }
  catch(e){
    console.log(e);
  }
}
function createJsonViewer(rsp){//stub, it now shows the matches in the console
  for(let match of rsp.matches){
    console.log(l.match);
   	for(let bl of match.domains[0].backlinks){
      console.log(bl);
    }
  }
}
function getLang() {
  if (navigator.languages != undefined) 
    return navigator.languages[0]; 
  return navigator.language;
}