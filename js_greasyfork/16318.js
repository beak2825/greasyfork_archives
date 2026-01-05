// ==UserScript==
// @name        JSON generator templates
// @namespace   https://github.com/healarconr
// @description Save JSON Generator templates in the browser local storage for later use
// @include     http://www.json-generator.com/
// @version     1
// @grant       none
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/16318/JSON%20generator%20templates.user.js
// @updateURL https://update.greasyfork.org/scripts/16318/JSON%20generator%20templates.meta.js
// ==/UserScript==
function jsonGeneratorTemplates() {

  var templates;
  var header;
  var controls;
  var templateControls;
  var templateSelect;
  var saveButton;
  var deleteButton;
  var resetButton;

  function main() {
    templates = getTemplates();
    header = getHeader()
    controls = getControls();
    resetButton = getResetButton();

    templateControls = createTemplateControls();

    header.insertBefore(templateControls, controls);

    handleReset();
  }

  function getTemplates() {
    var templates = localStorage.getItem("templates");

    if (templates == null) {
      templates = new Array();
      setTemplates(templates);
    } else {
      templates = JSON.parse(templates);
    }

    return templates;
  }

  function setTemplates(templates) {
    templates = JSON.stringify(templates);
    localStorage.setItem("templates", templates);
  }

  function getEditor() {
    return document.getElementsByClassName("CodeMirror")[0].CodeMirror;
  }

  function getHeader() {
    return document.getElementsByTagName("header")[0];
  }

  function getControls() {
    return document.getElementsByClassName("controls")[0];
  }

  function getResetButton() {
    return document.getElementById("reset-ui");
  }

  function createTemplateControls() {
    var div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.lineHeight = "31px";
    div.style.marginLeft = "7px";
    div.style.marginTop = "4px";

    templateSelect = createTemplateSelect();
    loadTemplateOptions();

    saveButton = createSaveButton();
    deleteButton = createDeleteButton();

    div.appendChild(templateSelect);
    div.appendChild(saveButton);
    div.appendChild(deleteButton);

    return div;
  }

  function createTemplateSelect() {
    var select = document.createElement("select");
    select.id = "templates";
    select.style.color = "#35383B";
    select.style.width = "100px";
    select.style.height = "27px";
    select.style.verticalAlign = "middle";
    select.addEventListener("change", changeTemplate);
    return select;
  }

  function loadTemplateOptions() {
    while (templateSelect.hasChildNodes()) {
      templateSelect.removeChild(templateSelect.lastChild);
    }

    var option = document.createElement("option");
    option.value = null;
    option.disabled = true;
    option.selected = true;
    option.appendChild(document.createTextNode("Templates"));
    templateSelect.appendChild(option);

    for (i in templates) {
      var template = templates[i];
      var option = document.createElement("option");
      option.value = template.content;
      option.appendChild(document.createTextNode(template.name));
      templateSelect.appendChild(option);
    }
  }

  function changeTemplate() {
    getEditor().setValue(templateSelect.value);
    deleteButton.disabled = false;
  }

  function createSaveButton() {
    var button = createButton();
    button.id = "save"
    button.title = "Saves the current template";
    button.appendChild(document.createTextNode("Save"));
    button.addEventListener("click", saveTemplate);
    return button;
  }

  function createButton() {
    var button = document.createElement("button");
    button.style.color = "#35383B";
    button.style.lineHeight = 1;
    button.style.fontSize = "11px";
    button.style.padding = "5px 15px";
    return button;
  }

  function saveTemplate(e) {
    e.preventDefault();

    var overwrite = false;

    if (templateSelect.selectedIndex != 0) {
      overwrite = confirm("Overwrite?");
    }

    if (overwrite) {
      var index = templateSelect.selectedIndex - 1;
      var template = templates[index];
      template.content = getEditor().getValue();
      templateSelect.options[templateSelect.selectedIndex].value = template.content;
      setTemplates(templates);
    } else {
      var templateName = prompt("Template name", new Date().toLocaleString());

      if (templateName != null) {
        template = {
          "name": templateName,
          "content": getEditor().getValue()
        };

        templates.push(template);
        loadTemplateOptions();
        templateSelect.selectedIndex = templates.length;
        setTemplates(templates);
        deleteButton.disabled = false;
      }
    }
  }

  function createDeleteButton() {
    var button = createButton();
    button.id = "delete"
    button.title = "Deletes the current template";
    button.disabled = true;
    button.appendChild(document.createTextNode("Delete"));
    button.addEventListener("click", deleteTemplate);
    return button;
  }

  function deleteTemplate() {
    if (confirm("Are you sure?")) {
      var index = templateSelect.selectedIndex - 1;
      templates.splice(index, 1);
      setTemplates(templates);
      loadTemplateOptions();
      resetButton.click();
    }
  }

  function handleReset() {
    resetButton.addEventListener("click", reset);
  }

  function reset() {
    templateSelect.children[0].selected = true;
    deleteButton.disabled = true;
  }

  main();
}

jsonGeneratorTemplates();
