// ==UserScript==
// @name        BlueCat Address Manager Direct Actions (Server Actions)
// @namespace   *
// @description Add direct buttons for Server Actions in BlueCat Address Manager
// @include     */app*
// @license		MIT
// @version     9
// @grant       none
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/369249/BlueCat%20Address%20Manager%20Direct%20Actions%20%28Server%20Actions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369249/BlueCat%20Address%20Manager%20Direct%20Actions%20%28Server%20Actions%29.meta.js
// ==/UserScript==


$("#outerTable tr").not(':first').hover(
    function () {
        $(this).find(".newbutton").show();
    },
    function () {
        $(this).find(".newbutton").hide();
    }
);


function isNodeList(nodes) {
    var stringRepr = Object.prototype.toString.call(nodes);

    return typeof nodes === 'object' &&
        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
        (typeof nodes.length === 'number') &&
        (nodes.length > 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
}

// give up after 15 tries = 7,5 sec
var k = 0, howManyTimes = 15;
function getServers() {
    var count = k+1;
    console.log(" + looking for widgets "+count+"/"+howManyTimes);
    var servers = document.querySelectorAll("div[id^='gwt-uid']");
    k++;
    if(( k < howManyTimes )&&(isNodeList(servers)==false)){
        setTimeout( getServers, 500 );
    }
    else if ((servers!==undefined)&&(servers.length>0)) {
        //console.log(servers);
        console.log(" => Found Server widgets, adding buttons");
        for (index = 0; index < servers.length; ++index) {
            var namecell = servers[index];
            //console.log(namecell);
            var isCluster = false;
            var image = namecell.getElementsByTagName('img');
            if (image !== undefined) {
                // odd, shouldn't happen
                if (image[0].src.indexOf("cluster") > -1) {
                    isCluster = true;
                    //console.log(cluster);
                }
                var link = namecell.getElementsByTagName("a")[0].href;
                var rest = link.split("SingleServer:")[1];
                var server_id = rest.split(":")[0];
                // add links with icons to namecell
                var td = namecell.getElementsByTagName("a")[0].parentNode;
                var tr = td.parentNode;
                // console.log(" + Adding Buttons")
                // edit button
                var x = tr.insertCell(-1);
                x.classList.toggle("newbutton");
                var editlink = "";
                if (isCluster) {
                    // special Link for clusters (why? no idea -> the other link let's you set the hostname :-D )
                    editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DAddEditXHA&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18&sp=ScontextId%3Ddetails&sp=SformMode%3Dedit";
                }else {
                    editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DAddEditServer&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18&sp=ScontextId%3Ddetails&sp=SformMode%3Dedit";
                }
                // more room between the name and the buttons
                x.innerHTML='<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+editlink+'"><img title="Edit Server Settings" src="/images/icons/small/document_edit.gif" border="0"></a></td>';
                // view logs button
                var y = tr.insertCell(-1);
                y.classList.toggle("newbutton");
                var loglink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DViewLogs&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18"
                y.innerHTML='<td><a href="'+loglink+'"><img title="View Server Logs" src="/images/icons/small/server_view.gif" border="0"></a></td>';
                // service config button
                var z = tr.insertCell(-1);
                z.classList.toggle("newbutton");
                var conflink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DServerServiceConfigure&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18"
                z.innerHTML='<td><a href="'+conflink+'"><img title="Service Configuration"  src="/images/icons/small/server_configuration.gif" border="0"></a></td>';
            }
        }
    } else {
        console.log(" => No Server widgets found, giving up!");
    }
};


if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    if (/ Page: Home /.test(page)) {
        console.log("Found MyIPAM - Special handling because Widgets loading takes a while...");
        var index;
        // loop or something
        getServers();
        $(".newbutton").hide();
    } else if (/ Page: ServerGroupPage /.test(page)) {
        // go through the h
        var outertable = document.getElementById("outerTable");
        var header = new Array();
        var spanheaders = 0;
        for (var i = 0, row; row = outertable.rows[i]; i++) {
            // process header
            if (i === 0) {
                //iterate through rows
                //rows would be accessed using the "row" variable assigned in the for loop
                for (var j = 0, col; col = row.cells[j]; j++) {
                    //iterate through columns
                    //check if the column td has an id to check for
                    if (col.id != null) {
                        // add 1 to spanheaders to get the correct fields later
                        if (col.id.startsWith("spanHeader")) {
                            // found a span header substrace one more for future fields
                            spanheaders = spanheaders + 1;
                            //console.log("spanHeader count now: "+spanheaders);
                            continue;
                        }
                    }
                    // get first element of header-text content
                    var text = col.getElementsByClassName("header-text")[0];
                    if (text !== undefined) {
                        var trimmed = text.innerText.trim();
                        if (text !== undefined) {
                            if (trimmed === "Name") {
                                header.name = j;
                            } else if (trimmed === "Managed") {
                                //console.log("normal cound would be: "+j+" but we need to substrace "+spanheaders+" for the span headers")
                                header.managed = j-spanheaders;
                            } else if (trimmed === "Profile") {
                                //console.log("normal cound would be: "+j+" but we need to substrace "+spanheaders+" for the span headers")
                                header.profile = j-spanheaders;
                            }
                        }
                    }
                }
            } else {
                // get necessary columns by header if
                var namecell = row.cells[header.name];
                // extract Text, because we don't need the rest
                var name = namecell.innerText.trim();
                var managed = row.cells[header.managed].innerText.trim();
                var profile = row.cells[header.profile].innerText.trim();
                var isCluster = false;
                var image = namecell.getElementsByTagName('img');
                if (image !== undefined) {
                    // odd, shouldn't happen
                    if (image[0].src.indexOf("cluster") > -1) {
                        var cluster = 'Found Cluster "'+name+'" as Managed: "'+managed+'" with Profile "'+profile+'"';
                        isCluster = true;
                        //console.log(cluster);
                    } else {
                        var server = 'Found Server "'+name+'" as Managed: "'+managed+'" with Profile "'+profile+'"';
                        // console.log(server);
                    }
                    // only for managed BDDS
                    if (managed === "Yes") {
                        if (profile.startsWith("BlueCat DNS")||profile.startsWith("Adonis")) {
                            // get Server ID from link
                            var link = namecell.getElementsByTagName("a")[0].href;
                            var rest = link.split("SingleServer%3A")[1];
                            var server_id = rest.split("%")[0];
                            // add links with icons to namecell
                            var td = namecell.getElementsByTagName("a")[0].parentNode;
                            var tr = td.parentNode;
                            // console.log(" + Adding Buttons")
                            // edit button
                            var x = tr.insertCell(-1);
                            x.classList.toggle("newbutton");
                            var editlink = "";
                            if (isCluster) {
                                // special Link for clusters (why? no idea -> the other link let's you set the hostname :-D )
                                editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DAddEditXHA&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18&sp=ScontextId%3Ddetails&sp=SformMode%3Dedit";
                            }else {
                                editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DAddEditServer&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18&sp=ScontextId%3Ddetails&sp=SformMode%3Dedit";
                            }
                            // more room between the name and the buttons
                            x.innerHTML='<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+editlink+'"><img title="Edit Server Settings" src="/images/icons/small/document_edit.gif" border="0"></a></td>';
                            // view logs button
                            var y = tr.insertCell(-1);
                            y.classList.toggle("newbutton");
                            var loglink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DViewLogs&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18"
                            y.innerHTML='<td><a href="'+loglink+'"><img title="View Server Logs" src="/images/icons/small/server_view.gif" border="0"></a></td>';
                            // service config button
                            var z = tr.insertCell(-1);
                            z.classList.toggle("newbutton");
                            var conflink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DServerServiceConfigure&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18"
                            z.innerHTML='<td><a href="'+conflink+'"><img title="Service Configuration"  src="/images/icons/small/server_configuration.gif" border="0"></a></td>';
                        } else if (profile.startsWith("Managed Windows Server")||profile.startsWith("BlueCat Address Manager for Windows Server")) {
                            // get Server ID from link
                            var link = namecell.getElementsByTagName("a")[0].href;
                            var rest = link.split("SingleServer%3A")[1];
                            var server_id = rest.split("%")[0];
                            // add links with icons to namecell
                            var td = namecell.getElementsByTagName("a")[0].parentNode;
                            var tr = td.parentNode;
                            // console.log(" + Adding Buttons")
                            // edit button
                            var x = tr.insertCell(-1);
                            x.classList.toggle("newbutton");
                            var editlink = editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DAddEditServer&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18&sp=ScontextId%3Ddetails&sp=SformMode%3Dedit";
                            // more room between the name and the buttons
                            x.innerHTML='<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+editlink+'"><img title="Edit Server Settings" src="/images/icons/small/document_edit.gif" border="0"></a></td>';
                            // view logs button
                            var y = tr.insertCell(-1);
                            y.classList.toggle("newbutton");
                            var loglink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DViewLogs&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18"
                            y.innerHTML='<td><a href="'+loglink+'"><img title="View Server Logs" src="/images/icons/small/server_view.gif" border="0"></a></td>';
                        }
                    }
                }
            }
            //console.log(header);

        }
        $(".newbutton").hide();

    } else if (/ Page: ConfigurationPage /.test(page)) {
        var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        if (/Servers/.test(subtab.innerHTML.trim())) {
            // go through the h
            var outertable = document.getElementById("outerTable");
            var header = new Array();
            var spanheaders = 0;
            for (var i = 0, row; row = outertable.rows[i]; i++) {
                // process header
                if (i === 0) {
                    //iterate through rows
                    //rows would be accessed using the "row" variable assigned in the for loop
                    for (var j = 0, col; col = row.cells[j]; j++) {
                        //iterate through columns
                        //check if the column td has an id to check for
                        if (col.id != null) {
                            // add 1 to spanheaders to get the correct fields later
                            if (col.id.startsWith("spanHeader")) {
                                // found a span header substrace one more for future fields
                                spanheaders = spanheaders + 1;
                                //console.log("spanHeader count now: "+spanheaders);
                                continue;
                            }
                        }
                        // get first element of header-text content
                        var text = col.getElementsByClassName("header-text")[0];
                        if (text !== undefined) {
                            var trimmed = text.innerText.trim();
                            if (text !== undefined) {
                                if (trimmed === "Name") {
                                    header.name = j;
                                } else if (trimmed === "Managed") {
                                    //console.log("normal cound would be: "+j+" but we need to substrace "+spanheaders+" for the span headers")
                                    header.managed = j-spanheaders;
                                } else if (trimmed === "Profile") {
                                    //console.log("normal cound would be: "+j+" but we need to substrace "+spanheaders+" for the span headers")
                                    header.profile = j-spanheaders;
                                }
                            }
                        }
                    }
                } else {
                    // get necessary columns by header if
                    var namecell = row.cells[header.name];
                    // extract Text, because we don't need the rest
                    var name = namecell.innerText.trim();
                    var managed = row.cells[header.managed].innerText.trim();
                    var profile = row.cells[header.profile].innerText.trim();
                    var isCluster = false;
                    var image = namecell.getElementsByTagName('img');
                    if (image !== undefined) {
                        // odd, shouldn't happen
                        if (image[0].src.indexOf("cluster") > -1) {
                            var cluster = 'Found Cluster "'+name+'" as Managed: "'+managed+'" with Profile "'+profile+'"';
                            isCluster = true;
                            //console.log(cluster);
                        } else {
                            var server = 'Found Server "'+name+'" as Managed: "'+managed+'" with Profile "'+profile+'"';
                            // console.log(server);
                        }
                        // only for managed BDDS
                        if (managed === "Yes") {
                            if (profile.startsWith("BlueCat DNS")||profile.startsWith("Adonis")) {
                                // get Server ID from link
                                var link = namecell.getElementsByTagName("a")[0].href;
                                var rest = link.split("SingleServer%3A")[1];
                                var server_id = rest.split("%")[0];
                                // add links with icons to namecell
                                var td = namecell.getElementsByTagName("a")[0].parentNode;
                                var tr = td.parentNode;
                                // console.log(" + Adding Buttons")
                                // edit button
                                var x = tr.insertCell(-1);
                                x.classList.toggle("newbutton");
                                var editlink = "";
                                if (isCluster) {
                                    // special Link for clusters (why? no idea -> the other link let's you set the hostname :-D )
                                    editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DAddEditXHA&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18&sp=ScontextId%3Ddetails&sp=SformMode%3Dedit";
                                }else {
                                    editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DAddEditServer&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18&sp=ScontextId%3Ddetails&sp=SformMode%3Dedit";
                                }
                                // more room between the name and the buttons
                                x.innerHTML='<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+editlink+'"><img title="Edit Server Settings" src="/images/icons/small/document_edit.gif" border="0"></a></td>';
                                // view logs button
                                var y = tr.insertCell(-1);
                                y.classList.toggle("newbutton");
                                var loglink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DViewLogs&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18"
                                y.innerHTML='<td><a href="'+loglink+'"><img title="View Server Logs" src="/images/icons/small/server_view.gif" border="0"></a></td>';
                                // service config button
                                var z = tr.insertCell(-1);
                                z.classList.toggle("newbutton");
                                var conflink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DServerServiceConfigure&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18"
                                z.innerHTML='<td><a href="'+conflink+'"><img title="Service Configuration"  src="/images/icons/small/server_configuration.gif" border="0"></a></td>';
                            } else if (profile.startsWith("Managed Windows Server")||profile.startsWith("BlueCat Address Manager for Windows Server")) {
                                // get Server ID from link
                                var link = namecell.getElementsByTagName("a")[0].href;
                                var rest = link.split("SingleServer%3A")[1];
                                var server_id = rest.split("%")[0];
                                // add links with icons to namecell
                                var td = namecell.getElementsByTagName("a")[0].parentNode;
                                var tr = td.parentNode;
                                // console.log(" + Adding Buttons")
                                // edit button
                                var x = tr.insertCell(-1);
                                x.classList.toggle("newbutton");
                                var editlink = editlink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DAddEditServer&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18&sp=ScontextId%3Ddetails&sp=SformMode%3Dedit";
                                // more room between the name and the buttons
                                x.innerHTML='<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+editlink+'"><img title="Edit Server Settings" src="/images/icons/small/document_edit.gif" border="0"></a></td>';
                                // view logs button
                                var y = tr.insertCell(-1);
                                y.classList.toggle("newbutton");
                                var loglink = "/app?component=%24TabbedEntityContainer.%24PagePanel.pageMenu.direct&page=ServerPage&service=direct&session=T&sp=Spage%3DViewLogs&sp=Svalue%3DSingleServer%3A"+server_id+"%3A18"
                                y.innerHTML='<td><a href="'+loglink+'"><img title="View Server Logs" src="/images/icons/small/server_view.gif" border="0"></a></td>';
                            }
                        }
                    }
                }
                //console.log(header);
            }
            $(".newbutton").hide();
        }
    }
}