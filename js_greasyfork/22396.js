// ==UserScript==
// @name        Indeed.com hide certain employers
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @description Provides an option on Indeed to select employers that you are uninterested in working for and collapse their openings in search results
// @include     http*://*indeed.tld/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22396/Indeedcom%20hide%20certain%20employers.user.js
// @updateURL https://update.greasyfork.org/scripts/22396/Indeedcom%20hide%20certain%20employers.meta.js
// ==/UserScript==

var employerName, employerRow, indicator, indicatorShow, indicatorEdit;
var employers = document.querySelectorAll(".row [itemprop=name]");
var hiddenEmployers = localStorage.hiddenEmployers ? localStorage.hiddenEmployers : "";
for (var i=0; i<employers.length; i++) {
  var employer = employers[i];
  employerName = employers[i].textContent.trim();
  if (hiddenEmployers.indexOf(employerName) > -1) {
    employerRow = employer.closest(".row");
    employerRow.style.display = "none";
    indicator = document.createElement("div");
    indicator.textContent = "hidden employer";
    indicator.className = "row";
    indicator.style.position = "relative";
    indicator.style.color = "gray";
    indicatorShow = document.createElement("span");
    indicatorShow.textContent = " [show result] ";
    indicatorShow.style.cursor = "pointer";
    indicator.appendChild(indicatorShow);
    indicatorEdit = document.createElement("span");
    indicatorEdit.textContent = " [edit list] ";
    indicatorEdit.style.cursor = "pointer";
    indicator.appendChild(indicatorEdit);
    employerRow.parentNode.insertBefore(indicator,employerRow);
    indicatorShow.addEventListener("click",function() {
      if (this.textContent == " [show result] ") {
        this.parentNode.nextSibling.style.display = "block";
        this.textContent = " [hide result] ";
      } else {
        this.parentNode.nextSibling.style.display = "none";
        this.textContent = " [show result] ";
      }
    });
    indicatorEdit.addEventListener("click",function() {
      var existingList = document.getElementById("gm-hidden-employer-edit");
      if (existingList) {
        existingList.parentNode.removeChild(existingList);
      }
      var editList = document.createElement("div");
      editList.id = "gm-hidden-employer-edit";
      editList.innerHTML = '\
        <div style="position: absolute; top: calc(100% + 15px); padding: 15px; background-color: #fff; box-shadow: 1px 1px 5px #bbb; z-index: 2;"> \
          <div>One per line (text must match exactly)</div> \
          <textarea rows="5" cols="30">' + hiddenEmployers + '</textarea> \
          <div> \
            <input type="button" id="gm-hidden-employer-save" value="Save"/> \
            <input type="button" id="gm-hidden-employer-cancel" value="Cancel"/> \
          </div> \
        </div>';
      this.parentNode.appendChild(editList);
      document.getElementById("gm-hidden-employer-save").addEventListener("click", function() {
        localStorage.hiddenEmployers = editList.getElementsByTagName("textarea")[0].value;
        editList.parentNode.removeChild(editList);
      });
      document.getElementById("gm-hidden-employer-cancel").addEventListener("click", function() {
        editList.parentNode.removeChild(editList);
      });
    });
  }
}

var mores = document.getElementsByClassName("more-link");
for (var j=0; j<mores.length; j++) {
  var more = mores[j];
  var hideLink = document.createElement("span");
  hideLink.className = "sl";
  hideLink.textContent = "hide results from this employer";
  more.parentNode.insertBefore(hideLink, more);
  var hyphen = document.createTextNode(" - ");
  more.parentNode.insertBefore(hyphen, more);
  hideLink.addEventListener("click", function() {
    if (confirm('Hide results from this employer?  You can undo this later.')) {
     employerName = this.closest(".row").querySelector("[itemprop=name]").textContent.trim();
      console.log(employerName);
      var employersRegexp = new RegExp("(^|\\n)" + employerName + "(\\n|$)", "g");
      if (!employersRegexp.test(localStorage.hiddenEmployers)) {
        localStorage.hiddenEmployers += "\n" + employerName;
      }
      this.closest(".row").style.display = "none";
    }
  });
}