// ==UserScript==
// @name        PTP Push-to-Client
// @namespace   https://github.com/TMD20
// @license MIT
// @match       https://passthepopcorn.me/torrents.php*
// @version     2.1
// @author
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.xmlHttpRequest
// @grant GM.registerMenuCommand
// @grant GM.notification
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_notification
// @require  https://cdn.jsdelivr.net/gh/greasemonkey/gm4-polyfill@a834d46afcc7d6f6297829876423f58bb14a0d97/gm4-polyfill.js
// @require  https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @description 2/4/2023, 9:37:54 AM
// @downloadURL https://update.greasyfork.org/scripts/459455/PTP%20Push-to-Client.user.js
// @updateURL https://update.greasyfork.org/scripts/459455/PTP%20Push-to-Client.meta.js
// ==/UserScript==

(()=>{

//icon stuff
const FILL_COLOR_SENDDEFAULT="#e02d2d"
const FILL_COLOR_CHOICECLIENT="#e02d2d"
const OVERLAY_LEFTPADDING="0px"
const OVERLAY_LEFTMARGIN="10px"

//other stuff
const program= "PTP Push-to-Client";
const timeout=30000
const AbortError = new DOMException("aborted!", "AbortError");

async function setStyle() {
 const stylesheet = new CSSStyleSheet()
await stylesheet.replace('.client-action-buttons:hover {border: 2px solid red;}')
document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
  }
setStyle()

if(document.URL.match(/torrents.php.*id=/)){
 addIconSingleMoviePage()
}
else{
addIconMovieListPage()
}


function addIconSingleMoviePage(){
  let pageTitle=document.querySelector(".page__title").textContent
  document.querySelectorAll(".group_torrent_header").forEach((e)=>{
let node=createSendIcons(pageTitle,e)
e.querySelector(".basic-movie-list__torrent__action").appendChild(node)
})

}

function addIconMovieListPage(){
document.querySelectorAll(".torrent_table tbody").forEach((e)=>
{
pageTitle=e.querySelector(".basic-movie-list__movie__title").textContent
  Array.from(e.querySelectorAll(".basic-movie-list__torrent-row")).filter((e)=>e.querySelector(".basic-movie-list__torrent-edition")==null).forEach((f)=>{
    let node=createSendIcons(pageTitle,f)
    f.querySelector(".basic-movie-list__torrent__action").appendChild(node)



  })

})}






function createSendIcons(pageTitle,parentNode){
let overlay=document.createElement("div")
overlay.style.paddingLeft=OVERLAY_LEFTPADDING
overlay.style.marginLeft=OVERLAY_LEFTMARGIN
overlay.style.display="inline"
  let node=document.createElement("div")
  node.innerHTML=`<svg viewBox="0 0 23 18" xmlns="http://www.w3.org/2000/svg"><path d="m.5 18 21-9-21-9v7l15 2-15 2v7Z" fill=${FILL_COLOR_SENDDEFAULT} fill-rule="evenodd" class="fill-000000"></path></svg>`
  node=baseIconSettings(pageTitle,node,parentNode)
node.addEventListener("click",async (e)=>{await clientDefaultPush(e)})
 let node2=document.createElement("div")
  node2.innerHTML=`<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg enable-background="new -0.8 -0.3 23 27" height="27px"
  version="1.1" viewBox="-0.8 -0.3 23 27" width="23px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><path clip-rule="evenodd"
  d="M21.9,15c0,0-8.7,9.9-9.5,11c-0.9,1.1-2.3,0.3-2.3,0.3  s-8.8-9.7-9.8-11.4C-0.7,13.3,1.2,13,1.2,13H6V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1v12h4.7C23.1,13,21.9,15,21.9,15z" fill=${FILL_COLOR_CHOICECLIENT}
  fill-rule="evenodd"/></svg>`
  node2=baseIconSettings(pageTitle,node2,parentNode)
node2.addEventListener("click",async (e)=>{await clientSelectionPush(e)})
//Need reference to node2 with link information
overlay.append(node2,node,createSelectionFormNode(node2))
return overlay
}

function baseIconSettings(pageTitle,node,parentNode){
  node.setAttribute("class","sendtoclientptp")
node.setAttribute("downloadurl",parentNode.querySelector("[title=Download]").href)
node.setAttribute("downloadname",`${pageTitle} ${parentNode.querySelector(".torrent-info-link").textContent}`)
node.style.display="inline-block"
  node.style.cursor="pointer"

let svg=node.querySelector("svg")
svg.style.pointerEvents="none"
svg.style.width="20px"
svg.style.height="20px"
svg.style.paddingLeft="5px"
  return node
}

function createSelectionFormNode(e){
    //pop up for clientSelection
let innerBox=document.createElement("div")
innerBox.setAttribute("class","clientSelectionFormBox")

innerBox.style.display="none"
innerBox.style.position="relative"
innerBox.style.zIndex="50"
innerBox.style.left="10px"
let form=document.createElement("form")
form.appendChild((document.createElement("select")))
form.setAttribute("id",`clientSelectionForm_${e.getAttribute("downloadurl")}`)
form.addEventListener("submit",(f)=>{
  f.preventDefault()
  f.stopPropagation()
  console.log(e.target)
  let clientData = JSON.parse(GM_config.getValue("downloadClients", "[]")).
  filter((g) => g.clientID==f.target.elements[0].value)[0]
  clientPushHelper(clientData,e.getAttribute("downloadurl"),e.getAttribute("downloadname"))
  innerBox.style.display="none"
})
innerBox.appendChild(form)

let buttonOverlay=document.createElement("div")
let sendbutton=document.createElement("input")
sendbutton.setAttribute("value","Send Client")
sendbutton.style.display="inline-block"
sendbutton.setAttribute("type","submit")
sendbutton.setAttribute("form",`clientSelectionForm_${e.getAttribute("downloadurl")}`)
sendbutton.setAttribute("class","client-action-buttons")

let closebutton=document.createElement("input")
closebutton.style.display="inline-block"
closebutton.setAttribute("type","button")
closebutton.setAttribute("value","Close")
closebutton.setAttribute("class","client-action-buttons")
closebutton.setAttribute("size","")

closebutton.addEventListener("click",()=>innerBox.style.display="none")
buttonOverlay.append(sendbutton,closebutton)
innerBox.appendChild(buttonOverlay)
let outterBox=document.createElement("div")
outterBox.style.position="absolute"
outterBox.appendChild(innerBox)
outterBox.style.width="1000px"
outterBox.style.display="inline"
return outterBox
}







//config stuff

function initMainConfig() {
  GM_config.init({
    id: "send-to-client",
    title: "PTP Push-to-Client Settings", // Panel Title
    fields: {
      downloadclients: {
        type: "downloadclient",
      },
    },
    types: {
      downloadclient: {
        default: null,
        toNode: downloadClientNode,
        toValue: function () {
          return;
        },
        reset: function () {
          GM_config.setValue("downloadClients", "[]");
        },
      }
    },
  events:{
    open:(menuDoc)=> {
      menuDoc.querySelector("#send-to-client_saveBtn").remove()
      // menuDoc.querySelector("#send-to-client").setAttribute("id","send-to-client2")
      menuDoc.body.setAttribute("class","page__main-content")

      let header=menuDoc.querySelector("#send-to-client_header")
      header.style.fontSize="20px"
      header.style.textAlign="center"

//       // //Fail Safe for Transperent Background
//       menuDoc.firstChild.style.backgroundColor="white"
//       menuDoc.body.style.display="inline-block"
//       menuDoc.body.style.width="95%"




      let input=document.createElement("input")
      input.setAttribute("value","close")
      input.setAttribute("type","button")
      input.addEventListener("click",()=>GM_config.close())
      menuDoc.querySelector(".reset_holder").remove()
      menuDoc.querySelector("#send-to-client_closeBtn").replaceWith(input)


    }




  },
         'css':
    `
    #send-to-client{
    background-color:white;
    color:black;
    }
    #send-to-client input[type=button], #send-to-client select{
    background-color:lightgray;
    color:black;
    }
     #send-to-client input{
    background-color:white;
    color:black;

    }
    `


  }
  )

  GM.registerMenuCommand("PTP Push-to-Client Settings", function () {
      GM_config.open();
  });


}



function verifyConfig() {
  if (
    GM_config.get("searchapi", "null") == "null" ||
    GM_config.get("searchurl", "null") == "null"
  ) {
    return false;
  }

  if (
    GM_config.get("searchapi", "null") == "" ||
    GM_config.get("searchurl", "null") == ""
  ) {
    return false;
  }
  return true;
}

//client Function
function addNewClient(e) {
  e.preventDefault();
  e.stopPropagation();
  saveDownloadClient();
  recreateDownloadClientNode();
}




function onSelectClientType(event) {
  function replaceHelperForm(oldSubmissionForm, newSubmissionForm){
   Array.from(oldSubmissionForm.querySelectorAll("input"))
    .filter((e) => e.value != "" || e.value != null)
    .forEach((oldnode) => {
      let newnode = newSubmissionForm.querySelector(`#${oldnode.getAttribute("id")}`);
      if(newnode==null)
        return
      if(oldnode.name=="clientAuto" ||oldnode.name=="clientDefault"){

        newnode.checked=oldnode.checked
      }
      else{

        newnode.value = oldnode.value || "";

      }


    });
    oldSubmissionForm.parentElement.replaceChild(
      newSubmissionForm.querySelector("form>div"),
      oldSubmissionForm
    );
}
  let wrapper = GM_config.fields["downloadclients"].wrapper;
  let oldSubmissionForm = wrapper.querySelector(
    "#addDownloadClientForm>div"
  );
  let newSubmissionForm=generateClientNode(event.target.value)
  replaceHelperForm(oldSubmissionForm, newSubmissionForm);


}

function generateClientNode(input){
 let newSubmissionForm = document.createElement("div");
  newSubmissionForm.setAttribute("id", "torrent-quicksearch-newclientWrapper");

  switch (input) {
    case "Rtorrent":
      newSubmissionForm.appendChild(
        clientSubmissionGenerator([
          "clientName",
          "clientURL",
          "clientUserName",
          "clientPassword",
          "clientLabel",
          'clientDir',
          "clientAuto",
          "clientDefault"
        ])
      );

      break;

    case "Qbittorrent":
      newSubmissionForm.appendChild(
        clientSubmissionGenerator([
          "clientName",
          "clientURL",
          "clientUserName",
          "clientPassword",
          "clientCategory",
          "clientTags",
          "clientDir",
           "clientAuto",
          "clientDefault"
        ])
      );
    break;
      case "Transmission":
        newSubmissionForm.appendChild(
          clientSubmissionGenerator([
            "clientName",
            "clientURL",
            "clientUserName",
            "clientPassword",
            "clientGroups",
            "clientLabels",
            "clientDir",
             "clientAuto",
              "clientDefault"
          ])

        );
      break;
    default:
      //Default to rtorrent
      clientSubmissionGenerator([
          "clientName",
          "clientURL",
          "clientUserName",
          "clientPassword",
          "clientLabel",
          'clientDir',
          "clientAuto",
          "clientDefault"
        ])
      break

  }
  newSubmissionForm
    .querySelector("#submit-newclient-button")
    .addEventListener("click", addNewClient);
return newSubmissionForm

}

function clientSubmissionGenerator(keys) {
  let options = {
    clientName: ` <label for="Name">Client Name:</label>
                <input type="text" placeholder="Name"  id="clientName" name="clientName">`,
    clientURL: `   <label for="clientURL">Client URL:</label>
              <input type="text" placeholder="URL" id="clientURL" name="clientURL">`,
    clientAPI: `              <label for="clientAPI">Client API:</label>
              <input type="text" placeholder="API" id="clientAPI" name="clientAPI">`,

    clientUserName: ` <label for="clientUserName">Client Username:</label>
              <input type="text" placeholder="Username" id="clientUserName" name="clientUserName">`,
    clientPassword: ` <label for="clientUserPassword">Client Password:</label>
              <input type="password" placeholder="Password" id="clientPassword" name="clientPassword">`,

    clientLabel: ` <label for="clientLabel">Client Label:</label>
              <input type="text" placeholder="Label" id="clientLabel" name="clientLabel">`,
    clientCategory: ` <label for="clientCategory">Client Category:</label>
              <input type="text" placeholder="Category" id="clientCategory" name="clientCategory">`,
    clientTags: ` <label for="clientTags">Client Tags:</label>
              <input type="text" placeholder="Tags" id="clientTags" name="clientTags">`,
      clientLabels: ` <label for="clientLabels">Client Labels:</label>
              <input type="text" placeholder="Labels" id="clientLabels" name="clientLabels">`,
    clientDir: ` <label for="clientDir">Client Directory:</label>
              <input type="text" placeholder="Dir" id="clientDir" name="clientDir">`,
    clientGroups: ` <label for="clientGroups">Client Groups:</label>
              <input type="text" placeholder="Groups" id="clientGroups" name="clientGroups">`,

    clientAuto: `
    Auto Start:
    <label for="Yes">Yes</label>
    <input type="radio" name="clientAuto" value="Yes"/>
    <label for="No">No</label>
    <input type="radio" name="clientAuto" value="No" checked/>
    `,
    clientDefault:
    `
    <label for="clientDefault">Default Client</label>
    <input type="checkbox" class="sendClientDefaultCheckBoxes" name="clientDefault">`
  };
  let frag = new DocumentFragment();
  let h1=document.createElement("h1")
  h1.setAttribute("id","torrent-addclient-form-header")
  h1.textContent="Add New Client"
  frag.appendChild(h1);
  let form=document.createElement("form")
  form.setAttribute("id","addDownloadClientForm")
  frag.append(form);
  let select = document.createElement("select");
  select.innerHTML = `
   <option value="Rtorrent"option>Rtorrent</option>
     <option value="Qbittorrent"option>Qbittorrent</option>
     <option value="Transmission"option>Transmission</option>
  `;
  select.setAttribute("id", "clientType");
  select.setAttribute("name", "clientType");

  select.addEventListener("change", onSelectClientType);
  let innerDiv = document.createElement("div");
  innerDiv.innerHTML = keys.reduce(
    (previous, curr) => previous + `<div>${options[curr]}</div><br>`,
    "<input name=clientID id=clientID type=text style='display:none'></input>"
  );

  let button = document.createElement("input");
  button.setAttribute("value","Add Client")
  button.setAttribute("id", "submit-newclient-button");
  button.setAttribute("type","button")

  frag.querySelector("form").appendChild(select);
  frag.querySelector("form").appendChild(innerDiv);
  frag.querySelector("form").appendChild(button);

  return frag;
}

function saveDownloadClient() {
  let wrapper = GM_config.fields["downloadclients"].wrapper;
  function verify(obj) {
    let keys = Object.keys(obj);
    optional=getOptional(obj["clientType"])
    for (let i in keys) {
      let key = keys[i];
      if (optional.has(key)) {
        continue;
      }
      if (obj[key] ===null || obj[key] === "") {
        GM.notification(
          `Could Not Add Client: ${key} is missing`,
          program
        );
        return false;
      }
    }
    return true;
  }
  if (wrapper) {
    let inputs = Array.from(
      wrapper.querySelectorAll(
        "input[type='text'],input[type='password'],select,input[name='clientAuto']:checked"
      )
    );

    let outdict = {};
    for (let i in inputs) {
      let ele = inputs[i];
      outdict[ele.name]= ele.value;
      if(ele.name=="clientAuto" || ele.name=="clientDefault"){
       continue
      }
      else{
        ele.value=""
      }
    }
    //reset clientAuto
    outdict["clientAuto"] = wrapper.querySelector("input[name='clientAuto']:checked").value
     wrapper.querySelector("input[name='clientAuto'][value='No']").checked=true
      wrapper.querySelector("input[name='clientAuto'][value='Yes']").checked=false

    //clientDefault
    outdict["clientDefault"] =wrapper.querySelector("input[name='clientDefault']").checked==true
     wrapper.querySelector("input[name='clientDefault']").checked=false
      if (!outdict?.clientID){
      outdict["clientID"]=Array(10)
      .fill()
      .map(() =>
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
          Math.random() * 62
        )
      )
      .join("");
    }

    //cant't duplicate ID
    let val = JSON.parse(GM_config.getValue("downloadClients", "[]"));

    val=val.filter((e)=>e.clientID!=outdict["clientID"])
    if (verify(outdict)) {
      if(outdict.clientDefault==true){
      val.forEach((e)=>e.clientDefault=false)
      }
      else if (val.filter((e)=>e.clientDefault==true).length==0){
        outdict.clientDefault=true
      }
      val.push(outdict);
      GM_config.setValue("downloadClients", JSON.stringify(val));
    }
    //reset title
    wrapper.querySelector("#torrent-addclient-form-header").textContent="Add New Client"


  }
}

function getCurrentDownloadClientsNode() {
  let parent = document.createElement("div");
  parent.setAttribute("id", "newclient-forum-Parent");
  let titleNode = document.createElement("h1");
  titleNode.textContent = "Current Clients";
  parent.append(titleNode);
  let clients = JSON.parse(GM_config.getValue("downloadClients", "[]"));
  for (let i in clients) {
    //delete button
    let button = document.createElement("input");
    button.setAttribute("value","Delete Client")
    button.addEventListener("click", deleteClient);
    button.setAttribute("type","button")
    parent.append(button);

    //edit button
    let button2 = document.createElement("input");
    button2.setAttribute("value","Edit Client")
    button2.addEventListener("click", editClient);
    button2.setAttribute("type","button")
    parent.append(button2);

    //dupe
    let button3 = document.createElement("input");
    button3.setAttribute("type","button")
    button3.setAttribute("value","Dupe Client")
    button3.addEventListener("click", duplicateClient);
    parent.append(button3);


    //client info box
    let client = clients[i];
    let keys = Object.keys(client);
    let section = document.createElement("div");
    section.style.border="5px solid"
    section.style.marginBottom="25px"
    section.setAttribute("class","downloadclient-info-box")

    for (let j in keys) {
      let key = keys[j];
      let value = client[key];
      if (key=="clientPassword"){
        value="*".repeat(Math.floor(Math.random() * 5) + 10)
      }
      if (key=="clientDefault"){
        value=(value==true)
      }
      let node = document.createElement("div");
      let keyNode = document.createElement("div");
      keyNode.textContent = `${key}: `;
      keyNode.style.display = "inline";
      keyNode.style.fontWeight = "bold";
      keyNode.style.marginRight = "5px";
      keyNode.style.overflowWrap="break-word"


      let valNode = document.createElement("div");
      valNode.textContent = `${value}`;
      valNode.style.display = "inline";
      valNode.style.overflowWrap="break-word"
      node.append(keyNode);
      node.append(valNode);
      section.append(node);
    }

    parent.append(section);
  }
  return parent;
}

function findDownloadClientNode(e){
  while(e.getAttribute("class")!="downloadclient-info-box"){
    e=e.nextElementSibling
  }
  return e

}
function deleteClient(e) {
  let clientNode = findDownloadClientNode(e.target)
  let clientID = Array.from(clientNode.childNodes).filter((e) =>
    e.textContent.match(/clientID/)
  )[0].childNodes[1].textContent;
  let clients = JSON.parse(GM_config.getValue("downloadClients", "[]"));
  GM_config.setValue(
    "downloadClients",
    JSON.stringify(clients.filter((e) => e.clientID != clientID))
  );
  recreateDownloadClientNode();
}

function duplicateClient(e){
  editClient(e,keepID=false)
}

function editClient(e,keepID=true) {
    function replaceHelperClientData(clientData, newSubmissionForm){
    newSubmissionForm.querySelector(`[name=clientAuto][value=${clientData["clientAuto"]}]`).checked=true
    newSubmissionForm.querySelector("[name=clientDefault]").checked=clientData["clientDefault"]
    let keys = Object.keys(clientData)
    for (let i in keys) {
    let node=newSubmissionForm.querySelector(`[name=${keys[i]}]`)
    if (node==null){
      continue
    }
    else if(keys[i]=="clientDefault"){
      node.checked=clientData[keys[i]]
    }
     else if(keys[i]=="clientAuto"){
      node.checked=node.value==clientData[keys[i]] ? true: false
    }


    node.value=clientData[keys[i]]
    }
    wrapper.querySelector( "#torrent-quicksearch-newclientWrapper").replaceWith(newSubmissionForm)
}
  let wrapper = GM_config.fields["downloadclients"].wrapper;

  if(wrapper){
    let clientNode=findDownloadClientNode(e.target)
    clientMatchID=Array.from(clientNode.childNodes).filter((e) =>
    e.textContent.match(/clientID/))[0].childNodes[1].textContent
    let clientData = JSON.parse(GM_config.getValue("downloadClients", "[]")).filter((e) => e.clientID ==clientMatchID )[0]
    let newSubmissionForm=generateClientNode(clientData.clientType)
    replaceHelperClientData(clientData,newSubmissionForm)

    if(!keepID){
     clientData.clientID=null
      wrapper.querySelector("#torrent-addclient-form-header").textContent=`Adding New Client`
    }
    else{
      wrapper.querySelector("#torrent-addclient-form-header").textContent=`Editing ClientID:${clientData.clientID}`
    }
    wrapper.querySelector("#torrent-addclient-form-header").scrollIntoView()

  }
  }


function recreateDownloadClientNode() {
  let wrapper = GM_config.fields["downloadclients"].wrapper;
  let oldChild = wrapper.querySelector(
    "#newclient-forum-Parent"
  );
  let newChild = getCurrentDownloadClientsNode();
  oldChild.parentElement.replaceChild(newChild, oldChild);
  newChild.lastChild.scrollIntoView()
}



function downloadClientNode(configId) {
  var field = this.settings,
    id = this.id,
    create = this.create,
    retNode = create("div", {
      className: "config_var",
      id: configId + "_" + id + "_var",
      title: field.title || "",
    });
  let currentClients = getCurrentDownloadClientsNode();
  retNode.appendChild(currentClients);
  retNode.appendChild(generateClientNode("Rtorrent"))
  return retNode;
}



function getOptional(clientType){
  switch (clientType) {
    case "Rtorrent":
          return new Set(["clientLabel","undefined","clientUserName","clientPassword","clientDir"]);
    case "Qbittorrent":
      return new Set(["clientCategory","undefined","clientUserName","clientPassword","clientDir","clientTags"]);
    case "Transmission":
      return new Set(["clientCategory","undefined","clientUserName","clientPassword","clientTags"]);
        default:
      return new Set(["undefined"]);
      }
    }

async function clientSelectionPush(e){
  if(!checkDownloadClients()){
    return
  }
  let clientSelectBox= e.target.parentElement.querySelector(".clientSelectionFormBox")
  let selectMenu= clientSelectBox.firstElementChild.firstElementChild
  let clientNodes=JSON.parse(GM_config.getValue("downloadClients", "[]"))
  selectMenu.innerHTML=""
  clientNodes.forEach((e)=>{
    let node=document.createElement("option")
    node.setAttribute("value",e.clientID)
    node.textContent=e.clientName
    selectMenu.appendChild(node)
  })
  clientSelectBox.style.display="inline"


}
 async function clientDefaultPush(e) {
      e.preventDefault();
    e.stopPropagation();
    if(!checkDownloadClients()){
    return
  }
   switch (e.button) {
    case 0:

    let clientData = JSON.parse(
      GM_config.getValue("downloadClients", "[]")
    ).filter(
      (ele) => ele.clientDefault == true
    )[0];
    clientPushHelper(clientData,e.target.getAttribute("downloadurl"),e.target.getAttribute("downloadname"))


      break;
    case 2:
      log.textContent = 'Right button clicked.';
      break;
    default:
      log.textContent = `Unknown button code: ${e.button}`;

 }
}


async function clientPushHelper(clientData,downloadurl,name) {
    switch (clientData.clientType) {
        case "Rtorrent":
         return sendRtorrentClient(clientData,downloadurl,name);
        case "Qbittorrent":
          return (async()=>{
            let sid=await getQbittorrentSID(clientData)
            if (sid){
              await qbittorrentAddTorrents(clientData,downloadurl,name)
            }
            await qbittorrentLogout()


           })();
           case "Transmission":
            return (async()=>{
              let id=await getTranmissionSessionID(clientData)
              if (id){
                await sendTorrentTransmission(clientData,id,downloadurl,name)
              }

             })();


      default:
    }
   }



//stuff for clients
function checkDownloadClients(){
  if(JSON.parse(GM_config.getValue("downloadClients", "[]")).length===0)
    {
       GM.notification(
          `At least one downloadClient must be setup`,
          program
        );
      GM_config.open()
      return false
  }
    return true


}


function getRtorrentMethod(clientData) {
  if(clientData.clientAuto=="No"){
    return "load.normal"
  }
  return "load.start"
}

function xmlEncode(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}



function getRtorrentxml(downloadurl, args, method) {
  return text =
    `
      <methodCall>
    <methodName>${method}</methodName>
    <params>
        <param>
           <value><string></string></value>
            </param>
         <param>
            <value><string>${xmlEncode(downloadurl)}</string></value>
            </param>
            ${args.map((e) => {
              return `<param>
               <value>
                 <string>${e}</string>
               </value>
             </param>`;
            })}
        </params>
    </methodCall>`
    ;
}

function getRtorrentArgs(clientData){
  let args=[]
  let label=clientData.clientLabel
  let directory=clientData.clientDir
  if (label != "" && label != null && label != "none") {
    args.push(`d.custom1.set=${label}`);
  }

  if (directory != "" && directory != null && directory != "none") {
    args.push(`d.directory.set=${directory}`);
  }
  return args




}
async function sendRtorrentClient(clientData,downloadurl,name) {
  let res = await fetch(getRtorrentURL(clientData), {
    data: getRtorrentxml(
      downloadurl,
      getRtorrentArgs(clientData),
      getRtorrentMethod(clientData)
    ),
    method: "post",
    headers: {
      Authorization: `Basic ${btoa(
        `${clientData.clientUserName}:${clientData.clientPassword}`
      )}`,
    },
  });
   if (res.status != 200) {
     GM.notification(res.responseText, program);
     return;
   }
   GM.notification(`Added ${name}\nClient Name: ${clientData.clientName}\nAutostart: ${clientData.clientAuto}\nLabel: ${clientData.clientLabel}\nDir: ${clientData.clientDir}`, program);
}

function getRtorrentURL(clientData) {
  let baseURL = new URL(clientData.clientURL).toString();
  return baseURL
}




async function getQbittorrentSID(clientData){
  let res = await fetch(getQbittorrentLoginURL(clientData), {
    method: "get",
    headers: {
      Origin: clientData.clientURL,
    },
    responseType:"json",
  });
   if (res.status != 200) {
     GM.notification(res.responseText, program);
     return false;
   }
   return true
}

async function qbittorrentLogout(clientData){
  let res = await fetch(getQbittorrentLogoutURL(clientData), {
    method: "get",
    headers: {
      Origin: clientData.clientURL,
    },
  });
   console.log(res.responseText)
}

async function qbittorrentAddTorrents(clientData,downloadurl,name){
  const formData = new FormData();
  formData.append("urls",downloadurl)
  formData.append("savepath",clientData.clientDir)
  formData.append("category",clientData.clientCategory)
  formData.append("paused",clientData.clientAuto=="No")
  formData.append("tags",clientData.clientTags)
  formData.append("root_folder",true)


    let res = await fetch(getQbittorrentAddTorrentsURL(clientData), {
    method: "post",
    headers: {
      Origin: clientData.clientURL,
    },
    data:formData,
  });
  if(res.status!=200){
    GM.notification(`Error adding Torrent \n${res.responseText}\n${res.responseHeaders}`, program)
  }
  GM.notification(`Added Torrent ${name}\nClient Name: ${clientData.clientName}\nAutostart: ${clientData.clientAuto}\nCategory: ${clientData.clientCategory}\nTags: ${clientData.clientTags}\nDir: ${clientData.clientDir}\n\n${res.responseText}`, program)
}

function getQbittorrentLoginURL(clientData) {
  let params = new URLSearchParams();
  params.append("username",clientData.clientUserName);
  params.append("password",clientData.clientPassword);
  let baseURL = new URL("/api/v2/auth/login",clientData.clientURL).toString();
  return `${baseURL}?${params.toString()}`;
}

function getQbittorrentLogoutURL(clientData) {
  let baseURL = new URL("/api/v2/auth/logout",clientData.clientURL).toString();
  return `${baseURL}?${params.toString()}`;
}

function getQbittorrentAddTorrentsURL(clientData) {
  let baseURL = new URL("/api/v2/torrents/add",clientData.clientURL).toString();
  return baseURL
}



async function getTranmissionSessionID(clientData) {
  let res = await fetch(getTransmissionRPCURL(clientData), {
    method: "post",
    headers: {
      Authorization: `Basic ${btoa(
        `${clientData.clientUserName}:${clientData.clientPassword}`
      )}`,
    },
  });
   if (res.status != 200 && res.status!=409) {
     GM.notification(res.responseText, program, searchIcon)
     return;
   }
   return res.responseHeaders.split('\r\n').filter((x)=>x.match("session-id"))[0].replace("x-transmission-session-id: ","")
}

async function sendTorrentTransmission(clientData,id,downloadurl,name) {
  let res = await fetch(getTransmissionRPCURL(clientData), {
    method: "post",
    headers: {
      Authorization: `Basic ${btoa(
        `${clientData.clientUserName}:${clientData.clientPassword}`
      )}`,
      "X-Transmission-Session-Id":id,
      "Content-type":"application/json"
    },
    data:JSON.stringify({
      "arguments": {
        "filename":downloadurl,
        "download-dir":clientData.clientDir,
        "labels":clientData.clientLabels,
        "groups":clientData.clientGroups,
        "paused":clientData.clientAuto=="No"
      },
     "method": "torrent-add"
   })
  });
  if (res.status!=200){
    GM.notification(`Error Adding Torrent\n${res.responseText}`, program, searchIcon)

  }
  GM.notification(`Added Torrent ${name}\nClient Name: ${clientData.clientName}\nAutostart: ${clientData.clientAuto}\nLabel: ${clientData.clientLabel}\nGroups: ${clientData.clientGroups}\nDir: ${clientData.clientDir}\n\n${res.responseText}`, program, searchIcon)

}




//fetch
function fetch(
  url,
  {
    method = "GET",
    data = null,
    headers = {},
  } = {}
) {
  async function normalFetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(AbortError), timeout);
      GM.xmlHttpRequest({
        method: method,
        url: url,
        data: data,
        headers: headers,
        onload: (response) => {
          resolve(response);
        },
        onerror: (response) => {
          reject(response.responseText);
        },
      });
    });
  }

return normalFetch();
}



initMainConfig()

})()
