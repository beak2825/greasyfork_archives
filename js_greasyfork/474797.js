// ==UserScript==
// @name 选课网提前查看结果
// @description 提前查看选课结果，免F12
// @version 0.0.1
// @match *://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/electiveWork/showResults.do*
// @grant none
// @noframes
// @run-at document-idle
// @namespace https://greasyfork.org/users/786990
// @downloadURL https://update.greasyfork.org/scripts/474797/%E9%80%89%E8%AF%BE%E7%BD%91%E6%8F%90%E5%89%8D%E6%9F%A5%E7%9C%8B%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/474797/%E9%80%89%E8%AF%BE%E7%BD%91%E6%8F%90%E5%89%8D%E6%9F%A5%E7%9C%8B%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.lug.ustc.edu.cn/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.
  jQ('.datagrid-header th').filter(":contains(IP)").before('<th class="datagrid" style="width:60">真实结果</th>')

  jQ('.datagrid-odd').each( (i,ele)=>{
      let res = jQ(ele).contents().filter(function(){return this.nodeType == 8 && this.nodeValue.includes("td");})[0].nodeValue
      res = res.replace('<!--','')
      res = res.replace('-->','')
      jQ(ele).contents().filter(function(){return this.nodeType == 8 && this.nodeValue.includes("td");}).before(res)
  }
  )
  jQ('.datagrid-even').each( (i,ele)=>{
      let res = jQ(ele).contents().filter(function(){return this.nodeType == 8 && this.nodeValue.includes("td");})[0].nodeValue
      res = res.replace('<!--','')
      res = res.replace('-->','')
      jQ(ele).contents().filter(function(){return this.nodeType == 8 && this.nodeValue.includes("td");}).before(res)
  }
  )
}

// load jQuery and execute the main function
addJQuery(main);