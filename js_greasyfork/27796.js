// ==UserScript==
// @name         TechAmok Pictures Addon
// @namespace    http://what/
// @description  Use left and right arrow to navigate TechAmok's pictures
// @version      1.0.9
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAQAMAAAAAAAAAAAAAAAAAAAAAAAD////////////8/Py+w8Nwo6NHpaVCpqZPoqKNqanl5ub///////////////8AAAD////////T19c+l5cB1tYA+/sA//8A/v4A//8A8/MRq6umtbX+/v7///////8AAAD///+6wsISra0A/f0A//8A/v4A//8A/v4A//8A//8A//8FyMitubn///////8AAADf4OATqqoA//8A//8A//8A/v4A//8A/v4A//8A//8A//8A//8Wp6fo6Oj///8AAABnn58A+fkA8PAUq6tTpKRup6dwpaVipaUto6MDxsYA+voA//8A9PSEp6f///8AAAAbo6MA/PweaGiTk5OmpqaoqKjX19elpaWhoaGUlpZ4nZ0/oKAFwcEwnp7+/v4AAAAApqYimJhUQC93SyaCcF/z8/OFhYXk5OT////n5+fHxsbr6+rGyckVfX3s7e0AAAAZnp6LnZ1sTDB5RRiBbVz6+vqjo6P+/v719fVkQiWLRAddORm3vLwHpaXQ0tIAAABlm5tuk5Py8vLu7u79/f36+vqLjY2doKDk5OSLf3RsUjs/TUcVr68A5ua+vr4AAADc3d0QkpIkpqZRpKRZpqYupKQBx8cA0NAAvb0FsbEAv78A8vIA//8A4eHDw8MAAAD///+turoIvb0A//8A8/MAysoAvr4A/v4A+voAqKgA3NwA+voA//8Jt7fl5uYAAAD////6+vpgfn4AmZkAsLAAwcEApqYA/v4A+voAj48Aw8MApKQAn59Qhob///8AAAD///9omJgA4uIA//8A//8DpKQGm5sAxMQAzs4AjIwA6OgA//8A/v4Kubm6w8MAAADZ2dkExMQA//8A//8A+vpqnp74+Pjf4ODX2dnP0NAapKQA//8A//8A/v45np4AAADQ0dEBz88A//8A/v4TqKjg4eH////+/v7///////+Zrq4A29sA//8A//8so6MAAAD7+/tPkpIDpaU0m5vEysr+/v7////+/v7////////9/f2IpqYYoaEIoKCftrYAAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAA
// @match        http://www.techamok.com/showpic.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27796/TechAmok%20Pictures%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/27796/TechAmok%20Pictures%20Addon.meta.js
// ==/UserScript==

function doIt(s) {
	var elements = document.getElementsByClassName('posuv');
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].innerText.match(s)) {
        elements[i].click();
        break;
      }
    }
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
        doIt('<<');
    }
    if (e.keyCode == '39') {
        doIt('>>');
    }
}

document.onkeydown = checkKey;
