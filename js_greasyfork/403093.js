// ==UserScript==
// @name         TsGitQuickLaunch
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @include        http://git.coreop.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403093/TsGitQuickLaunch.user.js
// @updateURL https://update.greasyfork.org/scripts/403093/TsGitQuickLaunch.meta.js
// ==/UserScript==

(function() {
    'use strict';
var new_elem = document.createElement('li');
    new_elem.class = 'header-more dropdown'
    var btn = '<a data-qa-selector="more_dropdown" data-toggle="dropdown" href="#" aria-expanded="false">\
Quick Launch\
<svg class="caret-down"><use xlink:href="/assets/icons-730bc9dd942fde159bc545aaf03f0f828f24a8a4cf2cf3c95c9d5b3042a98e0d.svg#angle-down"></use></svg>\
</a>\
<div class="dropdown-menu" style="margin-left:20%">\
<ul>\
<li class="d-md-none">\
<a class="dashboard-shortcuts-groups" href="/dashboard/groups">Groups\
</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/talos/pipelines">Talos</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/talos-resource/pipelines">Talos-resource</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/demetercoreapi/-/pipelines">Dc api</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/talosapi/-/pipelines">Talos API</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/persephone/pipelines">Persephone</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/Demetergame/pipelines">Demetergame</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/demetercore/pipelines">Demetercore</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/Ceres/pipelines">Ceres</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/Aquarius/pipelines">Aquarius</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/Nana/pipelines">Nana</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/Luna/pipelines">Luna</a></li>\
<li class=""><a class="dashboard-shortcuts-activity" href="/InJoi/setupdevenviroment">setupdevenviroment</a></li>\
<li class="dropdown">\</li>\
</ul>\
</div>'
    new_elem.innerHTML = btn;
    document.getElementsByClassName('list-unstyled')[0].appendChild(new_elem);
    // Your code here...
})();