// ==UserScript==
// @name         Almascript - Unreported Absense Helper
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.8.27.1
// @description  Show homeroom for unreported absenses
// @author       Ryan Meyers
// @author       You
// @match        https://sges.getalma.com/reports/school-attendance?date=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389446/Almascript%20-%20Unreported%20Absense%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/389446/Almascript%20-%20Unreported%20Absense%20Helper.meta.js
// ==/UserScript==



function clearBody(body) {
    body = body.replace(/src=/g,"data-src=");
    body = body.replace(/<link/g, "nolink");
    return body;
}

async function fetchAndUpdate(node) {
  const updateNode = node;
    // https://sges.getalma.com/reports/school-attendance?date=2019-08-27&status=255
    // https://sges.getalma.com/student/5d165b14749ea438fa6dc7ff/attendance?week=2019-W35
    // https://sges.getalma.com/home/get-student-schedule?studentId=5d165b14749ea438fa6dc7ff&date=2019-08-28

  var url=node.href.replace(/student\//g, "home/get-student-schedule?studentId=");
    url = url.replace(/\/attendance.*/g,"&"+document.location.search.replace(/\?/g,"&"));

    if (["PS1","PS2","PK3"].indexOf(updateNode.parentElement.parentElement.children[2].innerText.trim()) <= -1) {
        console.log(updateNode.parentElement.parentElement.children[2].innerText);

        fetch(url)
            .then(function(response) {
            return response.json();
        })
            .then(function(body) {
            body = clearBody(body.Message.html);
            var parser = new DOMParser();
            var doc = parser.parseFromString(body, "text/html");

            var n = nodesFromXpath("//div[@class='class-info']", doc);
            //console.log(n[0]);
            //console.log(node.textContent.trim());
            //var newNode = document.createElement("div");
            //newNode.classList.add("pill");

            //newNode.innerHTML =
            //  '<i class="far fa-times-circle" style="color:#eb6841;"></i>' +
            //  node.textContent.trim();

            updateNode.parentElement.parentElement.children[4].append(n[0]);


        });
    }
}


function nodesFromXpath(xpath, doc=document) {
  // var xpath = "//tr[td[text()='No Record']]/td[2]/a";
  var result = document.evaluate(
    xpath,
    doc,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  var node,
    nodes = [];
  while ((node = result.iterateNext())) {
    nodes.push(node);
  }
  return nodes;

}

async function doIncomplete() {
  for (let node of nodesFromXpath("//tr[td[span[@class='attendance-nottaken']]]/td[2]/a[1]")) {
    await fetchAndUpdate(node);
      //console.log(node);

  }
}

(async function() {
    'use strict';
    var newStyle = document.createElement("style");
  newStyle.innerHTML = `
.pill {
background-color: #fff;
padding: .5em;
border-radius: 5px;
display: inline-block;
cursor: default;
margin-top: 1em;
font-size: 8pt;
}
.pure-button-pdf { color: #eb6841; background: #fff; padding: 0.1em;}
.pdfIcon { margin-left:2px; margin-right:2px;}
.lds-circle { display: inline-block; transform: translateZ(1px); }
.lds-circle { display: inline-block; animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite; }
@keyframes lds-circle {  0%, 100% { animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5); } 0% { transform: rotateY(0deg); } 50% { transform: rotateY(1800deg); animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1); } 100% { transform: rotateY(3600deg); } }

.class-info {
    flex-grow:1;
    padding-right: 0.75em;
}
.class-grade {
    flex: 0 0 50px;
    text-align: center;
    font-size: 1.5em;
    color: #888;
}
.class-grade small {
    display: block;
    font-size: .6em;
}
.class-info > span {
    font-size: .9em;
    color: #888;
    margin-right: 1em;
    white-space: nowrap;
}
.class-name {
    margin: 0 0 0.2em 0;
    font-size: 1em;
}

`;
  document.getElementsByTagName("head")[0].append(newStyle);
    await doIncomplete();
    // Your code here...
})();