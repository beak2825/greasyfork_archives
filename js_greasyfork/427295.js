// ==UserScript==
// @name        PTP Trump Helper 0.00051
// @author      Blackstrap+Me
// @description Assist with trumping torrents
// @namespace   PTPTrumpHelperBlep
// @include     https://passthepopcorn.me/torrents.php?action=delete&torrentid=*
// @include     https://passthepopcorn.me/reportsv2.php?view=report&id=*
// @include     https://passthepopcorn.me/reportsv2.php?view=type&id=*
// @include     https://passthepopcorn.me/reportsv2.php?page=*
// @include     https://passthepopcorn.me/reportsv2.php
// @version     0.53 (Beta)
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/427295/PTP%20Trump%20Helper%20000051.user.js
// @updateURL https://update.greasyfork.org/scripts/427295/PTP%20Trump%20Helper%20000051.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const onReportsPage = document.URL.indexOf("reportsv2") > -1;
  const allReportsOnPage = onReportsPage
    ? Array.from(document.querySelectorAll("#all_reports")[0].children)
    : Array.from(document.querySelectorAll("#all_reports")[0].children).slice(1);

  allReportsOnPage.forEach(report => {
    const self = document.getElementById(report.id);
    const reportIdNum = onReportsPage ? report.id.split("t")[1] : "0";

    if (self.nodeName.toLowerCase() === "div") {
      const logMessageField = onReportsPage
        ? self.querySelector("input[name='log_message']")
        : self.querySelector("#log_message0");
      const trumpInitSelected = self.querySelector(
        `#resolve_type${reportIdNum} > option:nth-child(${onReportsPage ? 11 : 6})`
      ).selected;
      const resolveRow = self.querySelector(`#options${reportIdNum}`);
      const tBody = self.querySelector("tbody");
      const selectResolveType = self.querySelector(`#resolve_type${reportIdNum}`);

      if (!onReportsPage || !trumpInitSelected) {
        const tr = document.createElement("tr");
        const labelTd = document.createElement("td");
        const textAreaTd = document.createElement("td");
        const plInput = document.createElement("input");

        labelTd.className = "label";
        labelTd.title = "Enter PL of torrent that will trump.";
        labelTd.innerHTML = "<strong>Other Torrent:</strong>";
        labelTd.style.textAlign = "right";

        textAreaTd.colSpan = "3";

        plInput.size = "70";
        plInput.name = "torrent_permalink";
        plInput.dataset.lastVal = "";
        plInput.addEventListener("input", handlePlInputChange.bind(plInput, logMessageField));

        tr.style.display = trumpInitSelected ? "table-row" : "none";
        tr.id = "trumpTorrentRow";
        tr.appendChild(labelTd);
        tr.appendChild(textAreaTd);
        textAreaTd.appendChild(plInput);

        tBody.insertBefore(tr, tBody.childNodes[1]);
      }

      selectResolveType.addEventListener("change", showOrHide.bind(this, self, reportIdNum));

      const resolveContainerDiv = document.createElement("div");

      resolveContainerDiv.style.display = trumpInitSelected ? "grid" : "none";
      resolveContainerDiv.style.width = "500px";
      resolveContainerDiv.style.gridTemplateColumns = 'auto auto auto';
      resolveContainerDiv.style.marginBottom = "10px";
      resolveContainerDiv.style.marginTop = "10px";
      resolveContainerDiv.id = "resolveContainer";

      resolveRow.insertBefore(resolveContainerDiv, resolveRow.childNodes[4]);

      const trumpReasons = [
        "Active",
        "Proper Resolution",
        "Non-transcoded audio",
        "Superior Quality",
        "Proper Framerate",
        "No Redundant Audio",
        "Superior Source",
        "Proper Format",
        "Non-Bloated Audio",
        "Original Aspect Ratio",
        "Proper Cropping",
        "Non-Custom Disc",
        "English Subtitles",
	    	"Proper Aspect Ratio",
	    	"Repack",
	    	"Includes Chapters",
	    	"Proper Audio",
        "Constant Framerate",
        "Includes Commentary",
        "English PGS subtitles",
        "No Hardcoded Subtitles"
      ];

      if (self.querySelector("#Active_trump") === null) {
        for (let i = 0; i < trumpReasons.length; i++) {
          const input = document.createElement("input");
          const label = document.createElement("label");
          const childSpan = document.createElement("span");

          label.className = "trumpLabel";
          childSpan.className = "trumpSpan";
          
          label.innerHTML = ` ${trumpReasons[i]} `;

          label.id = `${trumpReasons[i]}_trump`;
          label.title = `Trump torrent for ${trumpReasons[i]}`;
          label.style.paddingRight = "5px";
          label.style.cursor = "pointer";

          input.type = "checkbox";
          input.name = `${trumpReasons[i]}_trump_input`;
          input.id = `${trumpReasons[i]}_trump_checkbox`;
          input.value = trumpReasons[i];
          input.checked = false;

          childSpan.addEventListener("click", handleCheckboxClick.bind(input, logMessageField));

          childSpan.appendChild(input);
          resolveContainerDiv.appendChild(childSpan);

          input.after(label);
        }
      }

      if (onReportsPage && resolveContainerDiv.nextSibling.nodeType === 3) {
        resolveContainerDiv.nextSibling.remove();
      }
    }
  });

  function showOrHide(self, reportIdNum) {
    let trumpSelected = document.querySelector(
      `#resolve_type${reportIdNum} > option:nth-child(${onReportsPage ? 11 : 6})`
    ).selected;
    let containerDiv = self.querySelector("#resolveContainer");
    let trumpTorrentRow = self.querySelector("#trumpTorrentRow");

    containerDiv.style.display = trumpSelected ? "grid" : "none";

    if (onReportsPage && containerDiv.nextSibling.nodeType === 3) {
      containerDiv.nextSibling.remove();
    }

    if (trumpTorrentRow) {
      trumpTorrentRow.style.display = trumpSelected ? "table-row" : "none";
    }
  }

  function handlePlInputChange(logMessageField) {
    if (this.value === "") {
      logMessageField.value = logMessageField.value.replace(/-.*|http.*/, "");
    } else if (logMessageField.value === "" || logMessageField.value === " ") {
      logMessageField.value = ` - ${this.value}`;
    } else if (
      this.dataset.lastVal.length !== this.value.length
    ) {
      logMessageField.value = logMessageField.value.replace(
        /, $|,  $| $| -.*|-.*|http.*/,
        ` - ${this.value}`
      );
    }

    this.dataset.lastVal = this.value;
  }


  function handleCheckboxClick(logMessageField) {
    if (event.target.className === 'trumpLabel') { this.checked = this.checked === false ? true : false };

    if (this.checked && logMessageField.value.charAt(0) === "h") {
      logMessageField.value = logMessageField.value.replace(/^/, `${this.value} - `);
    } else if (this.checked && logMessageField.value.charAt(1) === "-") {
      logMessageField.value = logMessageField.value.replace(/^/, `${this.value}`);
    } else if (this.checked) {
      logMessageField.value = logMessageField.value.replace(/^/, `${this.value}, `);
    } else {
      logMessageField.value = logMessageField.value.replace(
        new RegExp(this.value + ", " + "|" + (this.value + " ")),
        ""
      );
    }

    logMessageField.value = logMessageField.value.replace(/, - |,  - |-  /, " - ");
  }
})();