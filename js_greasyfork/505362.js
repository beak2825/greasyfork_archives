// ==UserScript==
// @name        Porkbun CDS record diff
// @namespace   teiken.dev
// @description Display diff of DNSSEC config and CDS records for Porkbun with buttons to fix diffs.
// @version     1.01
// @match       https://porkbun.com/account/dnssec/*
// @author      2024, Wilfried Teiken
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/505362/Porkbun%20CDS%20record%20diff.user.js
// @updateURL https://update.greasyfork.org/scripts/505362/Porkbun%20CDS%20record%20diff.meta.js
// ==/UserScript==

var domain=window.location.pathname.split("/").pop();
console.log("domain: "+domain);

const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
  if (this.readyState == 4 && this.status == 200) {
    var response = JSON.parse(this.responseText);
    if (response.Status != 0) {
      console.log("Error getting CDS: "+response.Status);
      return;
    }
    if (!response.AD) {
      console.log("CDS was not verified using DNSSEC");
      return;
    }

    // Answer is verified, which means an existing DS was used to sign the CDS and it can be trusted.

    // Extract the CDS entries
    var cds = new Map();
    for (i = 0; i < response.Answer.length; ++i) {
      if (response.Answer[i].type == 59) {
        var record = response.Answer[i].data.split(" ");
        cds.set(record[0], record);
      }
    }

    // Determine which items are already existing
    var existing = new Map();
    var buttons = document.getElementsByTagName("button");
    for (i = 0; i < buttons.length; ++i) {
      if (buttons[i].hasAttributes() && buttons[i].hasAttribute("data-keytag")) {
        existing.set(buttons[i].getAttribute("data-keytag"), buttons[i]);
      }
    }

    // Find the right element to insert the items at.
    var insertPoint;
    var titles = document.getElementsByClassName("lead");
    for (i = 0; i < titles.length; ++i) {
      if (titles[i].textContent == "Create DNSSEC Record") {
        insertPoint = titles[i].parentNode;
      }
    }

    if (insertPoint) {
      // Create an entry for every key found in the CDS set.
      var newSection = document.createElement("div");
      newSection.setAttribute("class", "alert alert-info");
      newSection.setAttribute("style", "word-break: break-word;");

      var newHeader = document.createElement("p");
      newHeader.setAttribute("class", "lead");
      newHeader.appendChild(document.createTextNode("Target DNSSEC Configuration (based on CDS records)"));
      newSection.appendChild(newHeader);

      for (const [key, value] of cds) {
        var newItem = document.createElement("div");
        newItem.appendChild(document.createElement("br"));
        newItem.appendChild(document.createTextNode("keyTag: "+value[0]));
        newItem.appendChild(document.createElement("br"));
        newItem.appendChild(document.createTextNode("alg: "+value[1]));
        newItem.appendChild(document.createElement("br"));
        newItem.appendChild(document.createTextNode("digestType: "+value[2]));
        newItem.appendChild(document.createElement("br"));
        newItem.appendChild(document.createTextNode("digest: "+value[3]));
        newItem.appendChild(document.createElement("br"));
        if (existing.has(key)) {
          newItem.appendChild(document.createTextNode("Status: Already in DS set"));
          newItem.setAttribute("style", "background-color:#D8E2D2; margin:5pt;");
        } else {
          newItem.appendChild(document.createTextNode("Status: Should be added to DS set"));

          newItem.appendChild(document.createElement("br"));
          var newButton = document.createElement("button");
          newButton.textContent = "Add to DS set";
          newButton.setAttribute("class", "btn btn-success");
          newButton.onclick = () => {
            document.getElementById("keyTag").value=value[0];
            document.getElementById("alg").value=value[1];
            document.getElementById("digestType").value=value[2];
            document.getElementById("digest").value=value[3];
            document.getElementById("dnssecCreateButton").click();
          };
          newItem.appendChild(newButton);
          newItem.setAttribute("style", "background-color:#F9A2A2; margin:5pt;");
        }

        newSection.appendChild(newItem);
      }

      // Replicate the sections from the "current configuration" for all keys not in CDS.
      for (const [key, button] of existing) {
        if (!cds.has(key)) {
          var newItem = document.createElement("div");
          var toCopy = button;
          for(i = 0; i < 9; ++i) {
            if (toCopy.previousSibling) {
              toCopy = toCopy.previousSibling;
            }
          }
          while (toCopy != button) {
            newItem.appendChild(toCopy.cloneNode());
            toCopy = toCopy.nextSibling;
          }
          newItem.appendChild(document.createTextNode("Status: Should be removed from DS set"));

          newItem.appendChild(document.createElement("br"));
          var newButton = button.cloneNode();
          newButton.textContent = "DELETE from DS set";
          newItem.appendChild(newButton);
          newItem.setAttribute("style", "background-color:#F9A2A2; margin:5pt;");

          newSection.appendChild(newItem);
        }
      }
      insertPoint.parentNode.insertBefore(newSection, insertPoint);
    }
  }
}
xhttp.open("GET", "https://dns.google/resolve?name="+domain+"&type=CDS", true);
xhttp.send();
