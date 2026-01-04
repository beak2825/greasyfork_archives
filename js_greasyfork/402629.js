// ==UserScript==
// @name     Wykopowa wyciągarko-wciągarka #czarnolisto!
// @version  1.0.1
// @include  https://www.wykop.pl/ustawienia/czarne-listy/
// @grant    GM.setValue
// @grant    GM.getValue
// @run-at   document-end
// @namespace https://greasyfork.org/users/410274
// @description Import i eksport czarnych list na wykop.pl
// @downloadURL https://update.greasyfork.org/scripts/402629/Wykopowa%20wyci%C4%85garko-wci%C4%85garka%20czarnolisto%21.user.js
// @updateURL https://update.greasyfork.org/scripts/402629/Wykopowa%20wyci%C4%85garko-wci%C4%85garka%20czarnolisto%21.meta.js
// ==/UserScript==

var listContEl = document.querySelector(".rbl-block .space[data-type=\"users\"]");

var listCurrentArr = czarnoGetCurrentList();

var importFrm = document.createElement("div");
importFrm.className = "space czarno-form";
var importRemainingListText = "";
importFrm.innerHTML = "<h4>Wykopowa wyciągarko-wciągarka #czarnolisto do usług!</h4><h5>Import</h5><p><b>Tu wklej czarnolistę od innego wykopka.</b> Nicki oddzielone przecinkami, mogą być z @wołajkami lub bez.</p><textarea id='czarno_import_box' rows='6'>" + importRemainingListText + "</textarea><br/><button id='czarno_import_submit'>Importuj</button><hr/>";
listContEl.parentNode.insertBefore(importFrm, listContEl.nextSibling);

var exportFrm = document.createElement("div");
exportFrm.className = "space czarno-form";
var exportText = czarnoListToText(listCurrentArr, false);
exportFrm.innerHTML = "<h5>Eksport</h5><p><b>To zawartośc twojej czarnolisty do podzielenia się z innymi!</b> Wrzuć ją na <a href='https://www.wykop.pl/tag/pokazczarnolisto'>#pokazczarnolisto</a> :> </p><textarea id='czarno_export_box' readonly rows='6'>" + exportText + "</textarea>";
var exportTextPrefix = czarnoListToText(listCurrentArr, true);
exportFrm.innerHTML += "<p>Lista z wołajkami:</p><textarea id='czarno_export_box_prefixed' readonly rows='6'>" + exportTextPrefix + "</textarea>";
listContEl.parentNode.insertBefore(exportFrm, importFrm.nextSibling);

var shamelessCredits = document.createElement("div");
shamelessCredits.className = "space czarno-form";
shamelessCredits.innerHTML = "W trosce o Twoje zdrowie psychiczne. <a class='color-1 showProfileSummary' href='https://www.wykop.pl/ludzie/HakerzyUkradliMiNicka/'><b>Samozwańczy Programista Wypoku</b></a>";
listContEl.parentNode.insertBefore(shamelessCredits, exportFrm.nextSibling);


document.getElementById("czarno_import_submit").addEventListener("click", function(){
  czarnoInitImport(); 
});

czarnoDoImport();


function czarnoInitImport(){
  let importUnchecked = czarnoTextToList(document.getElementById("czarno_import_box").value);
  let importList = czarnoFilterDuplicates(importUnchecked, listCurrentArr);
  if(importList.length>0){
    GM.setValue("importTodo", JSON.stringify(importList));
    czarnoDoImport();
  }
}

async function czarnoDoImport(){
  let listString = await GM.getValue("importTodo",false);
  console.log(listString);
  if(listString===false) return;
  let importUnchecked = JSON.parse(listString)
  let importList = czarnoFilterDuplicates(importUnchecked, listCurrentArr);
  if(importList.length>0){
    let importNameCurrent = importList.shift();
    document.getElementById("czarno_import_box").value = czarnoListToText(importList, false); // ??
    czarnoSetVisualState(true, importUnchecked.length - importList.length, importUnchecked.length);
    
    czarnoImportName(importNameCurrent);
  }else{
    GM.setValue("importTodo", false);
  }
}

function czarnoImportName(userName){
  document.querySelector("input[name=\"blacklist[user]\"]").value = userName;
  document.querySelector("form.blackListForm").submit();
}

function czarnoSetVisualState(isImporting, progressCurrent, progressMax){
  if(isImporting){
    document.getElementById("czarno_import_box").disabled=true;
    document.getElementById("czarno_import_submit").disabled=true;
    document.querySelector(".notification-alert span").textContent = "Absorbowanie nowej czarnolisto. Daj mi chwilę. " + progressCurrent + "/" + progressMax;
  }
}

function czarnoGetCurrentList(){
  let usersColl = listContEl.querySelectorAll(".usercard a > span > b");
  let usersList = [];
	for (let userEl of usersColl){
    usersList.push(userEl.textContent);
  }
  return usersList;
}

function czarnoListToText(listArr, addPrefix){
  let namePrefix = addPrefix ? "@" : "";
  let listAtsArr = listArr.map(function(username){ return namePrefix + username;});
  let listText = listAtsArr.join(", ");
  return listText;
}

function czarnoTextToList(listText){
  let listRawArr = listText.split(",");
  let listUnfilteredArr = listRawArr.map(function(userName){
    let userNameTrim = userName.trim();
    let userNameMatch = userNameTrim.match(/^@?([a-zA-Z0-9_\-]{4,35})$/);
    if(userNameMatch!==null){
      return userNameMatch[1];
    }else{
      return null;
    }
  });
  let listArr = listUnfilteredArr.filter(function(userName){
    return null !== userName;
  });
	return listArr;
}

function czarnoFilterDuplicates(listSrc, listRef){
  return listSrc.filter(function(userName){
    return 'undefined' === typeof listRef.find(function(refName){
    	 return userName.localeCompare(refName)===0;
    });
  });
}