// ==UserScript==
// @name         facebook_ctSeach
// @namespace    https://github.com/rixoye/demo_js
// @version      0.5
// @description  输出ssl的查询结果
// @author       rixoye
// @include      https://developers.facebook.com/tools/ct/search/*
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/453764/facebook_ctSeach.user.js
// @updateURL https://update.greasyfork.org/scripts/453764/facebook_ctSeach.meta.js
// ==/UserScript==


(() => {
    "use strict";
    let domain_set = new Set();
    function getDomain(){
        const elements = document.getElementsByClassName("_4etw")
        if (elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                let raw = elements[i].childNodes[0].innerText;
                let sep = raw.indexOf("\n");
                if (sep != -1) {
                    //有多个子域名
                    while(sep!=-1){
                        domain_set.add(raw.slice(0,sep));
                        raw = raw.slice(sep+1,raw.length);
                        sep = raw.indexOf("\n");
                    }
                    domain_set.add(raw.slice(sep+1,raw.length));
                }else{
                    //只有一个子域名
                    domain_set.add(raw);
                }
            }
        }
    }

    function addResult(){
        let tbArea = document.getElementsByClassName("_3a8w _4-u3")[3];
        let td = document.createElement("td");
        td.className = "_4-ss _4-sv";
        td.id = "domain_table"
        for(let d of domain_set){
            var oLi = document.createElement('li');
            td.appendChild(oLi);
            oLi.innerHTML = d;
        }
        tbArea.insertBefore(td,tbArea.firstChild);
    }

    setTimeout(() => {
        let btnArea = document.getElementsByClassName("_1jbo  _4are")[0];
        let btn = document.createElement("button");
        let VEnable = true;
        btn.id = "addtb";
        btn.textContent = VEnable ? "显示域名列表" : "移除域名列表";
        btn.addEventListener("click", () => {
            VEnable = !VEnable;
            btn.textContent = VEnable ? "显示域名列表" : "移除域名列表";
            if (VEnable) {
                document.getElementById("domain_table").remove();
            } else {
                getDomain();
                addResult();
            }
        });

        btnArea.insertBefore(btn, null);
    }, 3000);

})();