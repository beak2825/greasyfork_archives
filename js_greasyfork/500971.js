// ==UserScript==
// @name Ninite download helper
// @author mihau
// @version 0.5
// @description adds some crucial functionality to Ninite batch download page
// @include http*://www.ninite.com/*
// @include http*://ninite.com/*
// @namespace https://greasyfork.org/users/182150
// @downloadURL https://update.greasyfork.org/scripts/500971/Ninite%20download%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/500971/Ninite%20download%20helper.meta.js
// ==/UserScript==

function buildthedllink() {
  if (location.hostname.indexOf('ninite.com') != -1) {

    function checkAll(field) {
      for (i = 0; i < field.length; i++)
        field[i].checked = true;
    }

    function uncheckAll(field) {
      for (i = 0; i < field.length; i++)
        field[i].checked = false;
    }

    uncheckAll(document.forms[0]);

    var newdiv;
    newdiv = '<div><h1 style="color:#FF0000;size:20px;">with download helper</h2><br /><h3>if you need all programs:<br /><button class="btn btn-primary btn-lg" onclick="checkAll(document.forms[0]);document.forms[0].submit();">download all programs at once</button></h3>';
    newdiv += '<h3>if you need the majority of the programs:<br /><button class="btn btn-primary btn-lg" onclick="checkAll(document.forms[0]);document.getElementsByClassName(\'js-homepage-get-installer\')[0].removeAttribute(\'disabled\')">check all programs but don\'t download them yet</button></h3>';
    newdiv += '<h3>if you only need some programs:<br /><button class="btn btn-primary btn-lg" onclick="uncheckAll(document.forms[0]);">reset and pick your programs individually</button></h3></div>';


    document.getElementsByClassName("col-sm-6")[0].innerHTML = newdiv; // 203

  }
}

window.addEventListener('DOMContentLoaded', buildthedllink, false);