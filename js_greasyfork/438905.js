// ==UserScript==
// @name            MvnRepository Cleanify
// @namespace       MvnRepository_tool
// @version         1.0.0
// @description     Reformats the MvnRepository dependency section
// @author          lesofn
// @match           https://mvnrepository.com/artifact/*/*/*
// @grant           none
// @homepage     https://lesofn.com
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/438905/MvnRepository%20Cleanify.user.js
// @updateURL https://update.greasyfork.org/scripts/438905/MvnRepository%20Cleanify.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const maven = document.getElementById('maven-a');
    maven.value = maven.value.substr(maven.value.indexOf("<dependency>"));

    const ivy = document.getElementById('ivy-a');
    ivy.value = ivy.value.substr(ivy.value.indexOf("<dependency"));

    const sbt = document.getElementById('sbt-a');
    sbt.value = sbt.value.substr(sbt.value.indexOf("libraryDependencies"));

    const gradle1 = document.getElementById('gradle-a');
    gradle1.value = gradle1.value.substr(gradle1.value.indexOf("implementation"));

    const gradle2 = document.getElementById('gradle-short-a');
    gradle2.value = gradle2.value.substr(gradle2.value.indexOf("implementation"));

    const gradle3 = document.getElementById('gradle-short-kotlin-a');
    gradle3.value = gradle3.value.substr(gradle3.value.indexOf("implementation"));

    const grape = document.getElementById('grape-a');
    grape.value = grape.value.substr(grape.value.indexOf("@"));

    const leiningen = document.getElementById('leiningen-a');
    leiningen.value = leiningen.value.substr(leiningen.value.indexOf("["));

    const buildr = document.getElementById('buildr-a');
    buildr.value = buildr.value.substr(buildr.value.indexOf("'"));
})();
