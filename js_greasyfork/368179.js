// ==UserScript==
// @name         Jira SQA Utilities
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Shortcuts of frequently used Jira fields
// @author       Frost Ming
// @match        http://jira-brion.asml.com/browse/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/368179/Jira%20SQA%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/368179/Jira%20SQA%20Utilities.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Basic URL of Jira REST API
  const document = unsafeWindow.document;
  const baseURL = "https://jira-brion.asml.com/rest/api/2";
  // Issue key
  var issueKey = (function () {
    var pathParts = document.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  })();

  //get supported transactions of this ticket
  var trans;

  function extract_tran(json) {
    var res = {};
    for (var i in json.transitions) {
      res[json.transitions[i].name] = json.transitions[i].id;
    }
    return res
  }

  function update_trans() {
    $.ajax({
      type: "get",
      url: `${baseURL}/issue/${issueKey}/transitions`,
      async: false,
      success: function (data) {
        trans = extract_tran(data);
      },
    })
  }

  // Fix version
  var fixVersion = document.querySelector('#fixfor-val a') && document.querySelector('#fixfor-val a').innerHTML;
  var isFI = ["Improvement", "New Feature", "Sub-feature", "Sub-improvement"].indexOf(
    document.getElementById('type-val').innerText.trim()) >= 0;
  var needScore = ["Improvement", "New Feature", "Epic", "Sub-feature", "Sub-improvement"].indexOf(
    document.getElementById('type-val').innerText.trim()) >= 0;
  var isEpic = document.getElementById('type-val').innerText.trim() == "Epic"
  var controlAdded = false;
  // create element
  function ce(name) {
    return document.createElement(name);
  }

  // Checks whether the ticket labels contain any of the given labels
  function hasLabel(nodeList) {
    for (var node of document.querySelectorAll('.labels span')) {
      if (nodeList.indexOf(node.innerHTML) >= 0) {
        return true;
      }
    }
    return false;
  };
  // Add CSS style
  function addStyle(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    if (head) {
      var style = ce("style");
      style.type = "text/css";
      style.appendChild(document.createTextNode(css));
      head.appendChild(style);
    }
  }

  // Indicators
  var indicators = {
    hasTestPlan: Boolean(document.getElementById('rowForcustomfield_10732')),
    hasEstimate: Boolean(document.getElementById('timetrackingmodule')),
    casesAdded: hasLabel(['cases_added', 'no_need_cases', 'automated']),
    hasCCC: hasLabel(['qav_ccc', 'no_need_ccc']),
    hasQAOwenr: Boolean(document.getElementById('customfield_10011-val')),
    hasScore: Boolean(document.getElementById('customfield_10250-val')),
    hasEpicLink: Boolean(document.getElementById('customfield_11632-val'))
  };
  // send data to Jira
  function sendData(url, payload, method = "post") {
    fetch(url, {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(resp => {
      if (resp.ok) {
        alert("Success!");
      } else {
        throw "Fail!";
      }
    }).catch(e => {
      alert(e);
    });
  }

  function createEstimateForm() {
    var form = ce("form");
    form.setAttribute("id", "estimateForm");
    var fieldset = ce("fieldset");
    var label = labelFor("estimateInput", "Original Estimate");
    var input = ce("input");
    input.setAttribute("name", "estimateInput");
    input.setAttribute("id", "estimateInput");
    input.setAttribute("required", true);
    input.setAttribute("placeholder", "time format: 1h 20m");
    var submit = ce("input");
    submit.setAttribute("type", "submit");
    fieldset.appendChild(label);
    fieldset.appendChild(input);
    fieldset.appendChild(submit);
    form.appendChild(fieldset);
    form.onsubmit = function () {
      sendData(`${baseURL}/issue/${issueKey}`, {
        update: {
          timetracking: [{
            set: {
              originalEstimate: this.estimateInput.value
            }
          }]
        }
      }, "put");
      return false;
    };
    return form;
  }

  function createTestPlanForm() {
    var form = ce("form");
    form.setAttribute("id", "testPlanForm");
    var fieldset = ce("fieldset");
    var label = labelFor("testPlanInput", "Test Plan");
    var input = ce("input");
    input.setAttribute("name", "testPlanInput");
    input.setAttribute("id", "testPlanInput");
    input.setAttribute("required", true);
    var submit = ce("input");
    submit.setAttribute("type", "submit");
    fieldset.appendChild(label);
    fieldset.appendChild(input);
    fieldset.appendChild(submit);
    form.appendChild(fieldset);
    form.onsubmit = function () {
      sendData(`${baseURL}/issue/${issueKey}`, {
        update: {
          "customfield_10732": [{
            set: this.testPlanInput.value
          }]
        }
      }, "put");
      return false;
    };
    return form;
  }
    
  function createEpicLinkForm() {
    var form = ce("form");
    form.setAttribute("id", "epicLinkForm");
    var fieldset = ce("fieldset");
    var label = labelFor("epicLinkInput", "Epic Link");
    var input = ce("input");
    input.setAttribute("name", "epicLinkInput");
    input.setAttribute("id", "epicLinkInput");
    input.setAttribute("placeholder", "GUI-12345");
    input.setAttribute("required", true);
    var submit = ce("input");
    submit.setAttribute("type", "submit");
    fieldset.appendChild(label);
    fieldset.appendChild(input);
    fieldset.appendChild(submit);
    form.appendChild(fieldset);
    form.onsubmit = function () {
      sendData(`${baseURL}/issue/${issueKey}`, {
        update: {
          "customfield_11632": [{
            set: this.epicLinkInput.value
          }]
        }
      }, "put");
      return false;
    };
    return form;
  }

  function createQAOwnerForm() {
    var form = ce("form");
    form.setAttribute("id", "qaOwnerForm");
    var fieldset = ce("fieldset");
    var label = labelFor("qaOwnerInput", "QA Owner");
    var input = ce("input");
    input.setAttribute("name", "qaOwnerInput");
    input.setAttribute("id", "qaOwnerInput");
    input.setAttribute("required", true);
    input.setAttribute("placeholder", "User shortname such as fming");
    var submit = ce("input");
    submit.setAttribute("type", "submit");
    fieldset.appendChild(label);
    fieldset.appendChild(input);
    fieldset.appendChild(submit);
    form.appendChild(fieldset);
    form.onsubmit = function () {
      sendData(`${baseURL}/issue/${issueKey}`, {
        update: {
          "customfield_10011": [{
            set: {
              name: this.qaOwnerInput.value,
              key: this.qaOwnerInput.value
            }
          }]
        }
      }, "put");
      return false;
    };
    return form;
  }

  function labelFor(id, text) {
    var label = ce("label");
    label.setAttribute("for", id);
    label.innerHTML = text;
    return label;
  }

  function createWorkLogForm() {
    var form = ce("form");
    form.setAttribute("id", "workLogForm");
    var fieldset = ce("fieldset");
    var label = labelFor("workLogInput", "Work Log");
    var input = ce("input");
    input.setAttribute("name", "workLogInput");
    input.setAttribute("id", "workLogInput");
    input.setAttribute("required", true);
    input.setAttribute("placeholder", "time format: 1h 20m");
    var input2 = ce("input");
    input2.setAttribute("name", "logDescInput");
    input2.setAttribute("id", "logDescInput");
    input2.setAttribute("placeholder", "Log Description");
    var submit = ce("input");
    submit.setAttribute("type", "submit");
    fieldset.appendChild(label);
    fieldset.appendChild(input);
    fieldset.appendChild(input2);
    fieldset.appendChild(submit);
    form.appendChild(fieldset);
    form.onsubmit = function () {
      sendData(`${baseURL}/issue/${issueKey}/worklog`, {
        timeSpent: this.workLogInput.value,
        comment: this.logDescInput.value
      });
      return false;
    };
    return form;
  }

  function createAddCaseForm() {
    var form = ce("form");
    form.setAttribute("id", "addCaseForm");
    var fieldset1 = ce("fieldset");
    var label = labelFor("addCaseInput", "Add Case");
    var input = ce("input");
    input.setAttribute("name", "addCaseInput");
    input.setAttribute("id", "addCaseInput");
    fieldset1.appendChild(label);
    fieldset1.appendChild(input);
    var select = ce("select");
    select.setAttribute("name", "labelSelector");
    select.setAttribute("id", "labelSelector");
    var labels = ["no_need_cases", "cases_added", "automated"];
    for (var item of labels) {
      var option = ce("option");
      option.setAttribute("value", item);
      option.innerHTML = item;
      select.appendChild(option);
    }
    var submit = ce("input");
    submit.setAttribute("type", "submit");
    fieldset1.appendChild(select);
    fieldset1.appendChild(submit);
    form.appendChild(fieldset1);
    form.onsubmit = function () {
      var payload = {
          update: {}
        },
        label = this.labelSelector.value,
        casePath = this.addCaseInput.value,
        addLabels = [];
      for (var item of labels) {
        if (item === label && !hasLabel(item)) {
          addLabels.push({
            add: item
          });
        } else if (item !== label && hasLabel(item)) {
          addLabels.push({
            remove: item
          });
        }
      }
      if (addLabels.length) {
        payload.update.labels = addLabels;
      }
      if (casePath) {
        payload.update.comment = [{
          add: {
            body: `<p>[Test Case]</p><p>${casePath}</p>`
          }
        }];
      }
      if (addLabels.length || casePath) {
        sendData(`${baseURL}/issue/${issueKey}`, payload, "put");
      }
      return false;
    }
    return form;
  }

  function createSQAQualityForm() {
    var form = ce("form");
    form.setAttribute("id", "SQAQualityForm");
    var fieldset = ce("fieldset");
    var label = labelFor("SQAQualityInput", "SQA Quality");
    label.setAttribute("style","display:block")
    var input = ce("input");
    input.setAttribute("name", "testPlanInput");
    input.setAttribute("id", "testPlanInput");
    input.setAttribute("required", true);
    input.setAttribute("placeholder", "score=5; Description; No issue left");
    input.setAttribute("style","display:block;width: 100%;margin:2px")
    var submit = ce("input");
    submit.setAttribute("type", "submit");
    fieldset.appendChild(label);
    fieldset.appendChild(input);
    fieldset.appendChild(submit);
    form.appendChild(fieldset);
    form.onsubmit = function () {
      sendData(`${baseURL}/issue/${issueKey}`, {
        update: {
          "customfield_10250": [{
            set: this.testPlanInput.value
          }]
        }
      }, "put");
      return false;
    };
    return form;
  }
  
  function buildSelector() {
    var select = ce("select");
    select.setAttribute("name", "buildSelector");
    select.setAttribute("id", "buildSelector");
    select.className = "build-selector";
    var option = ce("option");
    option.setAttribute("value", "");
    select.appendChild(option);
    option = ce("option");
    option.setAttribute("value", "nightly");
    option.innerHTML = "nightly";
    select.appendChild(option)
    for (var item of ["QA", "RC"]) {
      for (var num = 1; num < 13; num++) {
        option = ce("option");
        option.setAttribute("value", item + num);
        option.innerHTML = item + num;
        select.appendChild(option);
      }
    }
    return select;
  }

  function testedPercentage() {
    var select = ce("select");
    select.setAttribute("name", "percentage");
    select.setAttribute("id", "percentage");
    var option = ce("option");
    option.setAttribute("value", "");
    select.appendChild(option);
    for (var i = 20; i <= 100; i += 20) {
      option = ce("option");
      option.setAttribute("value", i + "%");
      option.innerHTML = i + "%";
      select.appendChild(option);
    }
    return select;
  }

  function createCheckbox(name) {
    var label = ce("label");
    label.className = "checkbox";
    var input = ce("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", name.toLowerCase());
    input.setAttribute("name", name.toLowerCase());
    label.appendChild(input);
    label.append(name);
    return label;
  }

  function ticketStatus() {
    var select = ce("select");
    select.setAttribute("name", "status");
    select.setAttribute("id", "status");
    var empty = ce("option");
    empty.setAttribute("value", "");
    empty.innerHTML = "";
    select.appendChild(empty);
    update_trans();
    for (var v in trans) {
      var option = ce("option");
      option.setAttribute("value", trans[v]);
      option.innerHTML = v;
      select.appendChild(option);
    }
    return select;
  }

  function addExtraControl() {
    if (controlAdded) return;
    controlAdded = true;
    var parent = document.querySelector('#issue-comment-add .form-footer .buttons');
    controlAdded = true;
    parent.appendChild(labelFor("buildSelector", "Build"));
    parent.appendChild(buildSelector());
    parent.appendChild(createCheckbox("Pass"));
    parent.appendChild(createCheckbox("explored"));
    parent.appendChild(labelFor("percentage", "SQA Tested%"));
    parent.appendChild(testedPercentage());
    //parent.appendChild(labelFor("status", "status"));
    //parent.appendChild(ticketStatus());
    return true;
  }

  function addTestControl() {
    $("#footer-comment-button, #comment-issue").click(addExtraControl);
    var form = document.getElementById("issue-comment-add");
    form.onsubmit = function () {
      var labels = [];
      var isPass = this.pass.checked;
      var isRotate = this.explored.checked;
      var build = this.buildSelector.value;
      if (!build) {
        return true;
      }
      if (isRotate) {
        labels.push({
          add: 'explored'
        });
      }
      if (isPass && fixVersion) {
        if (build == "nightly") {
          labels.push({
            add: "qav_nightly"
          });
        } else {
          labels.push({
            add: `QAV${fixVersion}${build}`
          });
        }
      }
      var color = isPass ? "#008000" : "#FF0000";
      var pass = isPass ? "PASS" : "FAIL";
      var commentForm = require("jira/viewissue/comment/comment-form");
      var oldValue = commentForm.getField()[0].value;
      commentForm.getField()[0].value = `<p><strong>GUI Version:&nbsp;</strong>${fixVersion}${build}</p>` +
        "<p><strong>Test Result:&nbsp;</strong>" +
        `<span style="color: ${color};">${pass}</span></p>` +
        oldValue;
      console.log(commentForm.getField()[0].value);
      var payload = {
        update: {}
      };
      if (labels.length > 0) {
        payload.update.labels = labels;
      }
      if (this.percentage.value) {
        payload.update.customfield_10934 = [{
          "set": {
            value: this.percentage.value
          }
        }];
      }
      if (labels.length > 0 || this.percentage.value) {
        sendData(`${baseURL}/issue/${issueKey}`, payload, "put");
      }
      //set in ticket status

      if (this.status.value) {
        sendData(`${baseURL}/issue/${issueKey}/transitions`, {
          transition: {
            id: this.status.value
          }
        }, "post");
      }
    }
  }

  function createDom() {
    addStyle(
      ".jira-sqa-utility {margin-top: 10px;}" +
      ".jira-sqa-utility form fieldset {margin-bottom: 10px; display: block;}" +
      ".jira-sqa-utility label {margin-right: 5px;}" +
      ".jira-sqa-utility input {margin: 0 5px; padding: 5px; border: 1px #333 solid; border-radius: 4px}" +
      ".jira-sqa-utility input[type=submit] {background-color: white; cursor: pointer;}" +
      ".jira-sqa-utility input[type=submit]:hover {background-color: #eee;}" +
      ".jira-sqa-utility input[type!=submit] {min-width: 50%;}" +
      "label {margin: 0px 2px 0px 5px;}" +
      "select {padding: 1px 4px; width: 100px;}"
    );
    var parent = document.getElementById("viewissuesidebar");
    var div = ce("div");
    div.className = "jira-sqa-utility";
    if(!isEpic && !indicators.hasEpicLink){
      div.appendChild(createEpicLinkForm());
    }
    if (needScore && !indicators.hasTestPlan) {
      div.appendChild(createTestPlanForm());
    }
    if (!indicators.hasEstimate) {
      div.appendChild(createEstimateForm());
    }
    if (!indicators.hasQAOwenr) {
      div.appendChild(createQAOwnerForm());
    }
    div.appendChild(createWorkLogForm());
    div.appendChild(createAddCaseForm());
    if (needScore && !indicators.hasScore) {
      div.appendChild(createSQAQualityForm());
    }
    parent.appendChild(div);
    addTestControl();
  }

  createDom();
})();
