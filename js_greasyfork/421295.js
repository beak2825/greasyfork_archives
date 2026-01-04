// ==UserScript==
// @name CloudTraceCustomizer
// @namespace 3DS
// @grant none
// @include *CloudTrace*.txt*
// @include *logfiles*cloudtrace*
// @include *CatLog.sh*LOG*
// @include *CatLog.sh*.log*
// @include *CatLog.sh*.trace*
// @include *CloudTrace*.txt
// @include *CloudTrace*.log
// @include *CatLog.sh*PodBuilder-buildprereqs*
// @include *CatLog.sh*PodBuilder*

// @version 1.0
// @description custo CloudTrace : unite warnings/errors at the top + add anchors + find traces + highlight roles and steps
// @author pne1
// @downloadURL https://update.greasyfork.org/scripts/421295/CloudTraceCustomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/421295/CloudTraceCustomizer.meta.js
// ==/UserScript==

// NB : pour pouvoir charger des fichiers locaux il faut "autoriser l'accès aux URL de fichier" dans les params de l'extention du navigateur

// TODO host script qq part + upgrade URL + test d'upgrade
// TODO mettre les groupes de traces (role, step) dans des div (plutot que style ligne par ligne)
// TODO test avec erreurs dans les roles
//

/***************************************** USER CHOICES **************************************************/
var showWarnings = false;
var showDoublons = false;
var stepColor = '#c3ad85';
var roleColor = '#85c3ad';
/********************************************************************************************************/

var dateStart = new Date();

var oneBoldElem, allBoldElements=[]/*allBoldElements = document.getElementsByTagName('b')*/;
var tempAnchor, anchor = "CloudTraceCustomizer";
var tempIdentifier, currentIdentifier, previousIdentifier;
var oneChild, container = document.createElement("p");
container.style.background='#85c3ad';
container.style.overflow='scroll';
container.innerHTML="<center><h1 style='color:#c3859b'>CloudTraceCustomizer</h1></center><p style='color:black; background:#c3ad85' id='CloudTraceCustomizerTracesLinks'>Links found : <br></p><p style='color:black; background:#c3ad85' id='CloudTraceCustomizerInfos'></p><button id='displayErrors' onClick='document.displayErrors()'>Display Errors</button><button id='displayWarnings' onClick='document.displayWarnings(false)'>Display Warnings</button><button id='displayDoublons' onClick='document.displayDoublons(true)'>Hide Doublons</button><p id='allErrors' /><p id='allWarnings' />";
document.body.insertBefore(container, document.body.firstChild);
var allErrors = document.getElementById('allErrors');
var allWarnings = document.getElementById('allWarnings');
var btnWarnings = document.getElementById('displayWarnings');
var btnErrors = document.getElementById('displayErrors');
var links = document.getElementById('CloudTraceCustomizerTracesLinks');
var firstChild = container.lastChild;
var oneLink, allLinks = document.getElementsByTagName('a');
var linksToTrace = document.createElement("p");
for (var i = 0 ; i < allLinks.length ; i++) {
  oneLink = allLinks[i];
  oneChild = document.createElement("p");
  oneChild.innerHTML = oneLink.outerHTML;
 // if (oneLink.innerText.indexOf("Trace") != -1 || oneLink.innerText.indexOf("TRACE") != -1 || oneLink.innerText.indexOf("temporary link") != -1)
 if (oneLink.innerText != "BOTTOM" && oneLink.innerText != "REFRESH")
    linksToTrace.append(oneChild);
}

function displayTruc(hide,elem,btn){
  if (hide || !elem.style.display) {
    elem.style.display='none';
    btn.innerText=btn.innerText.replace("Hide","Display");
  }
  else {
    elem.style.display='';
    btn.innerText=btn.innerText.replace("Display","Hide");
  }
}
function displayWarnings(hide){
  displayTruc(hide,allWarnings,btnWarnings);
} 
function displayErrors(hide,elem){
  displayTruc(hide,allErrors,btnErrors);
}
document.displayErrors=displayErrors;
document.displayWarnings=displayWarnings;
displayWarnings(true);
displayErrors(true);

function manageEW(allBoldElements) { // 2020 change : cloudtraces W and E are not bold anymore
  for (var i = 0 ; i < allBoldElements.length ; i++) {
    tempAnchor = anchor+i;
    oneBoldElem = allBoldElements[i];
    oneChild = document.createElement("a");
    oneChild.type = oneBoldElem.type;//oneBoldElem.innerText.slice(1,2);
    oneChild.classList.add("CloudTraceCustomizer");
    if (oneChild.type == "W") oneChild.classList.add("warning");
    else if(oneChild.type == "E")   oneChild.classList.add("error");
    else {console.log("Unknown type : "+oneChild.type); oneChild.classList.add("info");}
    oneBoldElem.id = tempAnchor;
    oneChild.href = "#"+tempAnchor;
    tempIdentifier = oneBoldElem.innerText.slice(5,oneBoldElem.innerText.length);
    currentIdentifier = tempIdentifier.slice(0,tempIdentifier.indexOf(']'));
    oneChild.innerHTML = "<pre>" + (previousIdentifier == currentIdentifier ? '' : '<br><br>') + oneBoldElem.innerHTML + "</pre><hr>";
    previousIdentifier = currentIdentifier;
    //container.insertBefore(oneChild, firstChild);
    if (oneChild.type == "W") { 
      oneChild.classList.add("warning"); 
      allWarnings.append(oneChild);
    }
    else if(oneChild.type == "E") {
      oneChild.classList.add("error"); 
      allErrors.append(oneChild);
    }
    else {console.log("Unknown type : "+oneChild.type); oneChild.classList.add("info");}
  }

  var infos = document.getElementById('CloudTraceCustomizerInfos');
  if (allErrors.children.length ||allWarnings.children.length)
    infos.innerText = "Found "+document.getElementsByClassName("warning").length+" [W]"+" and "+document.getElementsByClassName("error").length+ " [E]. Click on a line to go to its original place";
  
  if (!allErrors.children.length) btnErrors.style.display="none";
  else btnErrors.innerText += " ("+allErrors.children.length+")";
  if (!allWarnings.children.length) btnWarnings.style.display="none";
  else btnWarnings.innerText +=  " ("+allWarnings.children.length+")";
}

if (!linksToTrace.children.length) links.style.display='none';
else links.append(linksToTrace);

document.displayDoublons =  function (dontDisplay) {
  var allCloudTraceCustomizer = document.getElementsByClassName('CloudTraceCustomizer');
  var currentElem, currentContent, previousContent;
  var doublonFound=false;
  for (var i = 0 ; i < allCloudTraceCustomizer.length ; i++) {
    currentElem = allCloudTraceCustomizer[i];
    if (!showWarnings && currentElem.className.indexOf('warning') != -1) continue;
    currentContent = currentElem.getElementsByTagName('font')[0].innerText;
    if (!currentContent || previousContent && previousContent.replace(/\s+/g, '') == currentContent.replace(/\s+/g, '')) {
      currentElem.style.display = dontDisplay ? "none" : "";
      doublonFound = true;
    }
    previousContent = currentContent;
  }
  var button = document.getElementById('displayDoublons');
  if (!doublonFound) return button.style.display='none';
  else button.style.display='';
  button.onclick=function(){document.displayDoublons(!dontDisplay);};
  button.innerText=dontDisplay ? "Show Doublons" : "Hide Doublons";
};
if (!showDoublons) document.displayDoublons(true);


/*document.displayWarnings =  function (dontDisplay) {
  showWarnings = !dontDisplay;
  var allWarnings = document.getElementsByClassName('warning');
  for (var i = 0 ; i < allWarnings.length ; i++)
    allWarnings[i].style.display=dontDisplay ? "none" : "";
  var button = document.getElementById('displayWarnings');
  button.onclick=function(){document.displayWarnings(!dontDisplay);};
  button.innerText=dontDisplay ? "Show Warnings" : "Hide Warnings";
  document.displayDoublons(!showDoublons);
};
if (!document.getElementsByClassName('warning').length)
  document.getElementById('displayWarnings').style.display='none';
else if (!showWarnings) document.displayWarnings(true);*/


///////////////////
var getDateFromTrace = function (trace) {
 return new Date(trace.substr(0,23));
};


////////////////////////////////////////
var customTraces = document.createElement('p');
customTraces.id = "customTraces";
var actualTraces = document.getElementsByTagName('pre')[0]; //TODO check if several <pre> and loop
for (var i = 0 ; i < actualTraces.children.length ; i++) // deplace tout ce qui n'est pas du texte (les PodRelocationTable... )
  document.body.append(actualTraces.children[i]);
var rolesSummary = document.createElement('p');
rolesSummary.id = "rolesSummary";
var rolesSummaryPostCfg = document.createElement('ul');
rolesSummaryPostCfg.id="rolesSummaryPostCfg";
/*var rolesSummaryDeploy = document.createElement('ul');
rolesSummaryDeploy.id="rolesSummaryDeploy";
var rolesSummaryBuild = document.createElement('ul');
rolesSummaryBuild.id="rolesSummaryBuild";*/
var actualTracesTab = actualTraces.innerText.split('\n');
var oneTrace, oneCustomTrace, roleName, roleNameText, roleLinkToEnd, roleLinkToStart, roleId=0;
var traceInRole = false, traceInStep=false;
var stepName, stepLinkToEnd, stepId=0;
var allRoles = [];
for ( var i = 0 ; i < actualTracesTab.length ; i++ ) {
  oneTrace = actualTracesTab[i];
  oneCustomTrace = document.createElement('pre');
  oneCustomTrace.classList.add("oneCustomTrace");
  oneCustomTrace.innerText = oneTrace;

  if (oneTrace.indexOf('[W]') != -1) {
    oneCustomTrace.type='W';
    allBoldElements.push(oneCustomTrace);
  } else if (oneTrace.indexOf('[E]') != -1) {
    oneCustomTrace.type='E';
    allBoldElements.push(oneCustomTrace);
  }
  
  //////// find roles
  //start role
  isDeployRole = oneTrace.indexOf('>addVMRole:') != -1;
  isBuildRole = oneTrace.indexOf('getXmlScriptPath:') != -1 && oneTrace.indexOf('.xml') != -1 ;
  isPostCfgRole = oneTrace.indexOf('>executePostcfg') != -1;
  if (isDeployRole || isBuildRole || isPostCfgRole) {
    if (traceInRole) oneCustomTrace.id="EndRole"+roleId; // close previous role (if no '<executeXML:'||'<AddVMRole: end' was found) // pas top pour les multiples rôles dans une opération
    if (traceInStep) {
      oneCustomTrace.id="step"+stepId; // close previous step (if no '<executeStep:' was found)
      traceInStep=false;
    } 
    traceInRole = true;
    roleId++;
    roleName = document.createElement('h2');
    if (isDeployRole)
      roleNameText = oneTrace.substr(oneTrace.indexOf('roleName=')+9);
    else if (isBuildRole)
      roleNameText = oneTrace.substr(oneTrace.lastIndexOf('/')+1).slice(0,-4);
    else if (isPostCfgRole)
      roleNameText = oneTrace.substr(oneTrace.lastIndexOf('postcfgName=')+12);
    roleName.innerText = roleNameText;
    roleLinkToEnd = document.createElement("a");
    roleLinkToEnd.innerText = " ↓";
    roleLinkToEnd.href="#EndRole"+roleId;
    roleName.append(roleLinkToEnd);
    roleName.id="StartRole"+roleId;
    oneCustomTrace.prepend(roleName);

    allRoles.push({roleId:roleId,roleNameText:roleNameText,elapsed:0,dateStart:getDateFromTrace(oneTrace),dateEnd:null,isDeployRole:isDeployRole,isBuildRole:isBuildRole,isPostCfgRole:isPostCfgRole});
   /* if (isDeployRole) rolesSummaryDeploy.append(roleLI);
    else if (isBuildRole) rolesSummaryBuild.append(roleLI);
    else if (isPostCfgRole) rolesSummaryPostCfg.append(roleLI);*/
  }
  //in a role
  if (traceInRole) oneCustomTrace.classList.add("traceInRole");
  //end role
  if (traceInRole)
  if (oneTrace.indexOf('<AddVMRole: end') != -1 || oneTrace.indexOf('<executeXML') != -1 || !isBuildRole && oneTrace.indexOf('getXmlScriptPath:') != -1 || oneTrace.indexOf('<ExecutePostConfig: end') != -1) {
    traceInRole = false;
    traceInStep = false;
    oneCustomTrace.id="EndRole"+roleId;
    if (allRoles.length) {
        if (allRoles[allRoles.length -1].dateEnd) console.error("dateEnd is already set ! "+JSON.stringify(allRoles[allRoles.length -1]));
        else allRoles[allRoles.length -1].dateEnd = getDateFromTrace(oneTrace);
        allRoles[allRoles.length -1].elapsed = (allRoles[allRoles.length -1].dateEnd - allRoles[allRoles.length -1].dateStart) / 1;
    }
  }

  //////// find steps
  if (oneTrace.indexOf('executeStep: EXECUTING step #') != -1) {
    if (traceInStep) oneCustomTrace.id="step"+stepId; // close previous step (if no '<executeStep:' was found)
    traceInStep = true;
    stepId++;
    stepName = document.createElement('h3');
    stepName.innerText = oneTrace.substr(oneTrace.indexOf('executeStep')+23,oneTrace.length);
    stepLinkToEnd = document.createElement("a");
    stepLinkToEnd.innerText = " ↓";
    stepLinkToEnd.href="#"+"step"+stepId;
    stepName.append(stepLinkToEnd);
    oneCustomTrace.prepend(stepName);
  }
  if (traceInStep) oneCustomTrace.classList.add("traceInStep");
  if (oneTrace.indexOf('<executeStep:') != -1 || oneTrace.indexOf('<ExecutePostConfig:') != -1) {
    traceInStep = false;
    oneCustomTrace.id="step"+stepId;
  }
  else if (oneTrace.indexOf('run (CloudUtils.java): stdout:') != -1 ) {
    var parts = oneCustomTrace.innerText.split("stdout:");
    oneCustomTrace.innerHTML = parts[0] + '<i>' + parts[1] + '</i>';
  }
  else if (oneTrace.indexOf('run (CloudUtils.java): stderr:') != -1 ) {
    var parts = oneCustomTrace.innerText.split("stderr:");
    oneCustomTrace.innerHTML = parts[0] + '<i><font color="red">' + parts[1] + '</font></i>';
  }
  ////////////////////////////
  if (oneTrace.indexOf('printStackTrace') != -1) {
    oneCustomTrace.classList.add("error");
    container.insertBefore(oneCustomTrace, firstChild);
  }
  

  customTraces.append(oneCustomTrace);
}

manageEW(allBoldElements);

document.body.append(customTraces);
customTraces.style.background='white';
actualTraces.style.display='none';

console.table(allRoles);
var role;
for (var i in allRoles) { // populate "roles found" menu
    role = allRoles[i];
    roleLI = document.createElement('li');
    roleLI.innerHTML = "<a href='#StartRole"+role.roleId+"'>"+role.roleNameText+"</a><span> "+role.elapsed+"ms</span>";
    rolesSummaryPostCfg.append(roleLI);
    if (role.isDeployRole) roleLI.classList.add("rolesSummaryDeploy");
    else if (role.isBuildRole) roleLI.classList.add("rolesSummaryBuild");
    else if (role.isPostCfgRole) roleLI.classList.add("rolesSummaryPostCfg");
}

rolesSummary.append(rolesSummaryPostCfg);
/*rolesSummary.append(rolesSummaryDeploy);
rolesSummary.append(rolesSummaryBuild);*/
var summary = document.createElement('p');
summary.innerHTML = "<a onclick='toggleDisplayRoles()' style='cursor:pointer;'><button id='btnRolist'>Display roles list(<span id='rolesQty'>"+allRoles.length+"</span>)</button></a>";
rolesSummary.style.display = 'none';
summary.append(rolesSummary);
container.append(summary);
var btnRolist = document.getElementById('btnRolist');

toggleDisplayRoles = function () {
  if (rolesSummary.style.display == 'none') {
    rolesSummary.style.display = "inline-block";
    btnRolist.innerText=btnRolist.innerText.replace("Display","Hide");
  }
  else {
    rolesSummary.style.display = 'none';
    btnRolist.innerText=btnRolist.innerText.replace("Hide","Display");
  }
}

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.oneCustomTrace { margin: 0; white-space: pre-wrap; word-break: break-word }';
style.innerHTML+= '#customTraces { }';
style.innerHTML+= '.traceInRole {background: '+roleColor+';}';
style.innerHTML+= '.traceInStep {background: '+stepColor+'; margin-left:0}';
style.innerHTML+= 'h2,h3 {text-align:center; margin:0}';
style.innerHTML+= 'li.rolesSummaryDeploy a {color : blue}';
style.innerHTML+= 'li.rolesSummaryBuild a {color : lightblue}';
style.innerHTML+= 'li.rolesSummaryPostCfg a {color : darkblue}';
document.getElementsByTagName('head')[0].appendChild(style);

var duration = (new Date()) - dateStart;
console.log("duration : "+duration+"ms");

