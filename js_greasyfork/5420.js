// ==UserScript==
// @name          Mturk Contact Templates
// @description   Store multiple email templates on the Contact Requester page
// @author        Cristo
// @version       1.0
// @include       https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT*
// @grant           GM_getValue
// @grant           GM_setValue
// @copyright     2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/5420/Mturk%20Contact%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/5420/Mturk%20Contact%20Templates.meta.js
// ==/UserScript==
//GM_deleteValue("savedlists");

var pageList = [];
if (GM_getValue('savedlists')){
    for (var pt = 0; pt < GM_getValue('savedlists').length; pt++){
        pageList.push(JSON.parse(GM_getValue('savedlists')[pt]));
    }
}
var rto = document.createElement("table");
rto.setAttribute("id", "rto");
rto.style.marginLeft = "auto";
rto.style.marginRight = "auto";
rto.style.paddingBottom="50px";
document.getElementsByClassName('caption')[1].appendChild(rto);
function tableMake(){
    rto.innerHTML = '';
    for (var rac = 0; rac < 5; rac++){
        var row = document.createElement("tr");
        row.style.textAlign = "left";
        rto.appendChild(row);
        var coll = document.createElement("td");
        coll.style.paddingBottom= "10px";
        row.appendChild(coll);
        var option = document.createElement("span");
        option.setAttribute("place",rac);
        option.setAttribute("class","quickoption");
        option.style.color = "#1170A0";
        option.style.textDecoration = "underline";
        option.style.cursor = "pointer";
        coll.appendChild(option);
        option.addEventListener("click", editOption, false);
        if (!pageList[rac]){
            var obj = new Object();
            obj.LiName = 'Blank';
            obj.LiText = 'Blank';
            pageList.push(obj);
        } 
        option.innerHTML = pageList[rac].LiName;
        
    }
}
function editOption(q){
    var index = q.target.getAttribute('place');
    var topP = document.getElementsByTagName('p')[0];
    var bottomP = document.getElementsByTagName('p')[1];
    topP.innerHTML = "";
    bottomP.innerHTML = "";
    
    var inputTX = document.createElement("input");
    inputTX.setAttribute("id","titlebox");
    inputTX.type = "text";
    inputTX.style.height ="20px";
    inputTX.style.width ="120px";
    inputTX.value = pageList[index].LiName;
    topP.appendChild(inputTX);
    
    var inputBT = document.createElement("input");
    inputBT.type = "button";
    inputBT.value = 'Save';
    inputBT.style.cursor = "pointer";
    inputBT.style.height ="20px";
    inputBT.style.width ="50px";
    inputBT.style.marginLeft ="50px";
    inputBT.addEventListener("click", function(){saveBut(index);}, false); 
    topP.appendChild(inputBT);
    
    var inputTA = document.createElement("textarea");
    inputTA.setAttribute("id","textbox");
    inputTA.cols = "112";
    inputTA.rows = "8";
    inputTA.value = pageList[index].LiText;
    bottomP.appendChild(inputTA);
}
function saveBut(a){
    var tempStore = [];
    if (document.getElementById('titlebox').value.length > 0){
        pageList[a].LiName = document.getElementById('titlebox').value;
    } else {
        pageList[a].LiName = 'Blank';
    }
    pageList[a].LiText = document.getElementById('textbox').value;
    
    for(var tp = 0; tp < pageList.length; tp++){
        tempStore.push(JSON.stringify(pageList[tp]));
    }
    GM_setValue('savedlists',tempStore);
    tableMake();
}
tableMake();