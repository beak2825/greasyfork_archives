// ==UserScript==
// @name        rap2 模块分组 - taobao.org
// @namespace   Violentmonkey Scripts
// @match       http://rap2.taobao.org/organization/repository/editor
// @grant       none
// @version     1.1
// @author      -
// @description 2021/3/9上午10:33:34
// @downloadURL https://update.greasyfork.org/scripts/422937/rap2%20%E6%A8%A1%E5%9D%97%E5%88%86%E7%BB%84%20-%20taobaoorg.user.js
// @updateURL https://update.greasyfork.org/scripts/422937/rap2%20%E6%A8%A1%E5%9D%97%E5%88%86%E7%BB%84%20-%20taobaoorg.meta.js
// ==/UserScript==

var execute = true;
setInterval(function(){
    
  if(!execute){
      return; 
  }
  if(!document.querySelector(".ModuleList"))
    return;
  var moduleGroup = {
    
  };

  document.querySelectorAll(".ModuleList li.sortable").forEach(function(e){
      var moduleNameAndGroup = e.innerText.split("-");
      var moduleName = moduleNameAndGroup[0]
      var moduleGroupName = moduleNameAndGroup[1] ? moduleNameAndGroup[1] : "其他";
      moduleGroup[moduleGroupName] = moduleGroup[moduleGroupName] ? moduleGroup[moduleGroupName] : {};
      moduleGroup[moduleGroupName][moduleName] = e;
  });
  var listLi = document.querySelectorAll(".ModuleList li");
  var addModuleBtn = listLi[listLi.length - 1];
  var container = document.getElementsByClassName("ModuleList")[0];
  container.innerHTML = ""

  for(moduleGroupName in moduleGroup){
      var moduleGroupEle = document.createElement("li");
     // newLine.setAttribute("style","width: 100%")
      moduleGroupEle.setAttribute("style","width: auto;display: inline-block;");
      moduleGroupEle.innerHTML = "<b>"+moduleGroupName+"</b>";
      container.append(moduleGroupEle);
      for(moduleName in moduleGroup[moduleGroupName]){
          var module = moduleGroup[moduleGroupName][moduleName];
          module.querySelector("a.name").innerText = moduleName;
          container.append(moduleGroup[moduleGroupName][moduleName])
      }
      var newLineEle = document.createElement("div");
      newLineEle.setAttribute("style","width: 100%;height: 1px;float: left;");
      container.append(newLineEle);
  }
  container.append(addModuleBtn)
  execute = false;
 
  
},100)

