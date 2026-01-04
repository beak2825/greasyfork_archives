// ==UserScript==
// @name        Oracle Java download without login
// @namespace   StephenP
// @author      StephenP
// @description Replaces license agreement and subsequent login form with a direct link to download the desired Java (JRE, JDK, etc.) package.
// @version     1
// @icon        data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAADFBMVEUhJC7hEwfEjoj///9njhhOAAAArElEQVQY013NIQ7CQBAF0B+QCO6B4Qg9CIJzoGjgDlQgQBfRI2yTngEQOEggwbQhqaCU+cxsu4YRsy87f2dBqxYR9BD3j2/AO2TuAUkPmR861Itlh1PIJOcesy1zDBW7hBXGisumHz2OFDhFU5Mr2kJFoWj44ZqKEVlWBgCZh9XLoM0VhgqYOj96ZjYFxacULRAZxMUDf3O1XiryCWVvryTWzTcLN2mKLHyh9QO+J8iJoTKABwAAAABJRU5ErkJggg==
// @grant       none
// @match       https://www.oracle.com/java/technologies/*-downloads.html
// @downloadURL https://update.greasyfork.org/scripts/416790/Oracle%20Java%20download%20without%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/416790/Oracle%20Java%20download%20without%20login.meta.js
// ==/UserScript==
const links=document.getElementsByClassName("license-link");
for(var i=0;i<links.length;i++){
  links[i].href=links[i].getAttribute("data-file").replace("/otn/","/otn-pub/");
}