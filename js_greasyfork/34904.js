// ==UserScript==
// @name         GGn Internal Forum Post Helper
// @namespace    https://gazellegames.net/
// @version      0.4
// @description  Helps fill template on for GGn Internal Release forum post
// @author       ZeDoCaixao
// @match        https://gazellegames.net/forums.php?action=new&forumid=58
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/34904/GGn%20Internal%20Forum%20Post%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/34904/GGn%20Internal%20Forum%20Post%20Helper.meta.js
// ==/UserScript==

function doit() { 
  var link = $("#internallink").val();

  var req = new XMLHttpRequest();

  req.open('GET', link, true);
  req.responseType = "document";

  req.onload = function () {
      var resp = req.response;
      var image_src = resp.querySelector(".box_albumart img").getAttribute("src");
      var group_id = resp.querySelector("body").getAttribute("class").split("_")[1].split(" ")[0];
      var title = resp.title.replace(/ :: GazelleGames.net$/, "");
      var xx = title.split(" - ", 2);
      var [platform, game] = title.split(" - ", 2);
      $("#title").val(game + " (" + platform + ")");
      $("#posttext").val("[align=center]\n[img="+image_src+"]\n[torrent]"+group_id+"[/torrent]");
  };
  req.send(null);
}

$("<tr/>", {"id": "internallinkhelperout"}).prependTo("#newthreadform tbody");
$("<td/>", {"id": "intenallinkhelper1"}).prependTo("#internallinkhelperout");
$("<td/>", {"id": "intenallinkhelper2"}).prependTo("#internallinkhelperout");
$("<input/>", {
    "id": "internallink",
    "class": "internalLink",
    "style": "width: 98%",
    "placeholder": "Insert group link here and click 'Fill' to fill Internal Release description"
}).prependTo("#intenallinkhelper1");
$("<input/>", {
    "type": "button",
    "id": "internallinkbutton",
    "class": "internalLinkbutton",
    "value": "Fill",
    click: doit
}).prependTo("#intenallinkhelper2");