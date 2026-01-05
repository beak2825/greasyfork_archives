// ==UserScript==
// @name       SAE Brisbane Auto-login Script
// @namespace  Daniel Jochem
// @version    1.4
// @description  for SAE Brisbane students.
// @match      http://*/*
// @match      https://*/*
// @run-at     document-end
// @downloadURL https://update.greasyfork.org/scripts/11569/SAE%20Brisbane%20Auto-login%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/11569/SAE%20Brisbane%20Auto-login%20Script.meta.js
// ==/UserScript==

//Content Keeper Login
if (document.URL.indexOf("ckbne.saeaustralia.edu.au") > 0) {
    document.forms[0].INPUT_USERNAME_FBA.value = "djochem";
    document.forms[0].INPUT_PASSWORD_FBA.value = "Zackton96";
    document.querySelectorAll("input")[4].click();
};


//Moodle (Campus Online) Login
if (document.URL == "https://moodle-brisbane.axis.navitas.com/") {
    window.location += "login/index.php";
};


//Moodle (Campus Online) Delete Archived Units
if (document.URL == "https://moodle-brisbane.axis.navitas.com/my/") {
    var elem = document.getElementsByClassName("course_title");
    var elemLength = elem.length;

    while (elemLength > 0) {
        for (var i = 0; i < elem.length; i++) {
            if (elem[i].children[0].innerHTML.indexOf("archive") != -1) {
                elem[i].parentNode.parentNode.removeChild(elem[i].parentNode);
            }
        }
        elemLength -= 1;
    }
};


/****************************************/
String.prototype.trimRight = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";

  return this.replace(new RegExp("[" + charlist + "]+$"), "");
};
/****************************************/

//Moodle (Campus Online) Delete Archived Units on Profiles (other people)
if (document.URL.indexOf("view.php") > 0) {
    var modules = document.getElementsByClassName("descriptionbox")[0].children[1].children[9];
    var modulesLength = modules.children.length;
    var moduleAmount = modules.children.length;

    while (modulesLength > 0) {
        for (var i = 0; i < modules.children.length; i++) {
            if (modules.children[i].innerHTML.indexOf("archive") != -1) {
                modules.children[i].parentNode.removeChild(modules.children[i]);
            }
        }
        modulesLength -= 1;
    }
    modules.innerHTML = modules.innerHTML.trimRight(", ");
};

//Moodle (Campus Online) Delete Archived Units on Profiles (my profile)
if (document.URL.indexOf("profile.php") > 0) {
    var modules = document.getElementsByClassName("descriptionbox")[0].children[1].children[1];
    var modulesLength = modules.children.length;
    var moduleAmount = modules.children.length;

    while (modulesLength > 0) {
        for (var i = 0; i < modules.children.length; i++) {
            if (modules.children[i].innerHTML.indexOf("archive") != -1) {
                modules.children[i].parentNode.removeChild(modules.children[i]);
            }
        }
        modulesLength -= 1;
    }
    modules.innerHTML = modules.innerHTML.trimRight(", ");
};

//Axis (Navitas)
if (document.URL.indexOf("login.navigate") > 0) {
    document.querySelectorAll("input")[2].value = "djochem";
    document.querySelectorAll("input")[3].value = "Zackton96";
    document.querySelectorAll('input')[4].click();
};


//SAE Library
if (document.URL.indexOf("saeaustralia.edu.au:2048/login") > 0) {
    document.querySelectorAll("input")[1].value = "1003559";
    document.querySelectorAll("input")[2].value = "2912";
    document.querySelectorAll('input')[3].click();
};