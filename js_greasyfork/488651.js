// ==UserScript==
// @name        casenotice
// @match       https://command-center.aws.a2z.org.cn/supportDashboard#/*
// @icon        https://visioguy.github.io/IconSets/aws/icons/aws_cloud.png
// @grant       none
// @version     1.0
// @author      yiling10
// @description This script is for morer convient to check and subscribe through windows notice.
// @namespace https://greasyfork.org/users/1259735
// @downloadURL https://update.greasyfork.org/scripts/488651/casenotice.user.js
// @updateURL https://update.greasyfork.org/scripts/488651/casenotice.meta.js
// ==/UserScript==

(function(){
    var refresh = 30000
    var fetch_content = `let origFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await origFetch(...args);
        if(response.url == "https://cn-north-1.prod.customerapi.mora.support.aws.a2z.org.cn/cases/searchAttributes"){
          response.clone().json().then(data => {
                for (const supportCase of data.supportCases) {
                  let caseId = supportCase.attributes.find(a => a.key === "system.caseId").value;
                  if(caseId in localStorage) continue
                  const subject = supportCase.attributes.find(a => a.key === "system.subject").value;
                  const service = supportCase.attributes.find(a => a.key === "mora.v2.service").value;
                  if(!(caseId in localStorage)){
                    var n = new Notification(service, { "body": subject });
                    //console.log({"caseinfo":"caseinfo",service,subject,caseId})
                    n.onclick = function() {
                        let localcaseid = caseId
                        window.open("https://command-center.aws.a2z.org.cn/case-console#/cases/"+localcaseid)
                        n.close();
                    };
                  if(1 == 0){
                      var xhr = new XMLHttpRequest();
                      xhr.open("POST", "http://52.81.30.102:10685/caseinfo", false);
                      xhr.setRequestHeader("Content-Type", "application/json");
                      xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                          var response = JSON.parse(xhr.responseText);
                          console.log(response);
                        }
                      };
                      xhr.send(JSON.stringify(supportCase));
                    }
                  }
                  localStorage.setItem(caseId,1)
                }
            })
            .catch(err => console.log(err));
        }
        return response;
    }`

    var sfetch = document.createElement('script');
    sfetch.innerHTML = fetch_content;
    sfetch.onload = function () {this.remove();};
    var parent = document.head;
    parent.insertBefore(sfetch, parent.children[0]);
    setInterval(()=>{location.reload();},refresh*1000)
})();