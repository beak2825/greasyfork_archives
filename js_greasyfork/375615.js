// ==UserScript==
// @name        BlueCat Address Manager Direct Actions (Block/Net Actions)
// @namespace   *
// @description Add direct buttons for Block and Network Actions in BlueCat Address Manager
// @include     */app*
// @license		MIT
// @version     2
// @grant       none
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/375615/BlueCat%20Address%20Manager%20Direct%20Actions%20%28BlockNet%20Actions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/375615/BlueCat%20Address%20Manager%20Direct%20Actions%20%28BlockNet%20Actions%29.meta.js
// ==/UserScript==


$("#outerTable tr").not(':first').hover(
    function () {
        $(this).find(".newbutton").show();
    },
    function () {
        $(this).find(".newbutton").hide();
    }
);


if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    var subtab;
    if (/ Page: ConfigurationPage /.test(page)) {
        subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        if (/IPv4/.test(subtab.innerHTML.trim())) {
            addButtons();
        }
    } else if (/ Page: IP4BlockPage /.test(page)) {
        subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        if (/Address Space/.test(subtab.innerHTML.trim())) {
            addButtons();
        }
    }
}

function addButtons() {
    var outertable = document.getElementById("outerTable");
    for (var i = 1, row; row = outertable.rows[i]; i++) {
        // ignore header
        // extract Text, because we don't need the rest
        var namecell = row.cells[1];
        var isNet = false;
        var image = namecell.getElementsByTagName('img');
        if (image !== undefined) {
            // odd, shouldn't happen
            if (image[0].src.indexOf("network") > -1) {
                isNet = true;
            }
            // get Block/Network ID from link
            var link = namecell.getElementsByTagName("a")[0].href;
            var rest = "";
            var type = "IP4Network";
            if (isNet) {
                rest = link.split("IP4Network%3A")[1];
            } else {
                rest = link.split("IP4Block%3A")[1];
                type = "IP4Block";
            }
            var net_id = rest.split("%")[0];
            // add links with icons to namecell
            var td = namecell.getElementsByTagName("a")[0].parentNode;
            var tr = td.parentNode;
            // ---- edit
            var w = tr.insertCell(-1);
            w.classList.toggle("newbutton");
            var wIcon = "/images/icons/small/document_edit.gif";
            var editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page="+type+"Page&service=direct&session=T&sp=Spage%3DIP4RangedAddEdit&sp=Svalue%3D"+type+"%3A"+net_id+"%3A43&sp=SformMode%3Dedit";
            w.innerHTML='<td class="newbutton">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+editlink+'"><img title="Edit" src="'+wIcon+'" border="0"></a></td>';
            // ---- resize
            var x = tr.insertCell(-1);
            x.classList.toggle("newbutton");
            var xIcon = "/images/icons/small/element_selection.gif";
            var resizelink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page="+type+"Page&service=direct&session=T&sp=Spage%3DIP4RangedResize&sp=Svalue%3D"+type+"%3A"+net_id+"%3A43";
            x.innerHTML='<td class="newbutton"><a href="'+resizelink+'"><img title="Resize" src="'+xIcon+'" border="0"></a></td>';
            // ---- split
            var y = tr.insertCell(-1);
            y.classList.toggle("newbutton");
            var yIcon = "/images/icons/small/elements2.gif";
            var splitlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page="+type+"Page&service=direct&session=T&sp=Spage%3DIP4RangedSplit&sp=Svalue%3D"+type+"%3A"+net_id+"%3A43";
            y.innerHTML='<td class="newbutton"><a href="'+splitlink+'"><img title="Split" src="'+yIcon+'" border="0"></a></td>';
            // ---- move
            var z = tr.insertCell(-1);
            z.classList.toggle("newbutton");
            var zIcon = "/images/icons/small/element_next.gif";
            var movelink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page="+type+"Page&service=direct&session=T&sp=Spage%3DIP4RangedMove&sp=Svalue%3D"+type+"%3A"+net_id+"%3A43";
            z.innerHTML='<a href="'+movelink+'"><img title="Move" src="'+zIcon+'" border="0"></a>';
            if (isNet) {
                // could be share or assign template, would need to check first if something exists there
            } else {
                // Add create paritions to block only
                var p = tr.insertCell(-1);
                p.classList.toggle("newbutton");
                var pIcon = "/images/icons/small/elements_selection.gif";
                var partlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page="+type+"Page&service=direct&session=T&sp=Spage%3DIP4BlockPartitionPage&sp=Svalue%3D"+type+"%3A"+net_id+"%3A52";
                p.innerHTML='<td class="newbutton"><a href="'+partlink+'"><img title="Create Partitions" src="'+pIcon+'" border="0"></a></td>';
            }
            $(".newbutton").hide();
        }
    }
};