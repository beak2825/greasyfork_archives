// ==UserScript==
// @name FanFiction.net: Update checker
// @description  Checks fanfiction.net works for updates
// @match https://www.fanfiction.net/
// @version      1.0
// @license      MIT
// @namespace Squornshellous Beta
// @downloadURL https://update.greasyfork.org/scripts/479973/FanFictionnet%3A%20Update%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/479973/FanFictionnet%3A%20Update%20checker.meta.js
// ==/UserScript==

var url=window.location.href;
if (url=="https://www.fanfiction.net/#latest") setup();

function setup() {
    window.container=document.querySelector("#content_wrapper_inner");
    if (!container.querySelector("iframe#dataFrame")) {
        container.innerHTML+="<iframe id='dataFrame' style='width:100%; height:90vh; display:none;'></iframe>";
        window.frame=container.querySelector("iframe#dataFrame");
        frame.addEventListener("load",processData);
        window.stories=[];
        window.oldURL="";
    }
    refreshBaseLists();
    checkForStall();
    var checkInterval=setInterval(checkForStall,30000);
}

function refreshBaseLists() {
    window.authors=[];
    window.status=0;
    window.authorIndex=0;

    processData();
}

function processData() {
    var frameDoc=frame.contentDocument;
    if (status==0) {
        status++;
        frame.src="https://www.fanfiction.net/alert/story.php";
    }
    else if (status==1) {
        var list=frameDoc.querySelectorAll("div.table-bordered tr:has(a)");
        list.forEach(row=>{
            var cells=row.querySelectorAll("td");
            addStory({
                title:cells[0].innerText,
                id:parseID(cells[0].querySelector("a").href),
                author:cells[1].innerHTML,
                authorRaw:cells[1].innerText,
                category:cells[2].innerHTML,
                chapters:1,
                updated:cells[3].innerHTML,
                updateSortable:parseDate(cells[3].innerHTML)
            });
        });
        writeStoryTable();

        status++;
        //console.log(stories);
        frame.src="https://www.fanfiction.net/alert/author.php";
    }
    else if (status==2) {
        var list=frameDoc.querySelectorAll("div.table-bordered tr:has(a)");
        list.forEach(row=>{
            var cells=row.querySelectorAll("td");
            var author=({
                author:cells[0].innerHTML,
                authorRaw:cells[0].innerText,
                authorURL:cells[0].querySelector("a").href,
                works:parseInt(cells[1].innerText)
            });
            if (author.works>0) authors.push(author);
        });

        var nextPage=frameDoc.querySelector("#content_wrapper_inner center a:last-child[href*='author.php']");
        if (nextPage) frame.src=nextPage.href;
        else {
            status++;
            authors.sort(function(a,b) {return b.works-a.works});
            frame.src=authors[0].authorURL;
        }
    }
    else if (status==3) {
        var works=frameDoc.querySelectorAll(".mystories");
        works.forEach(work=>{
            var xgray=work.querySelector(".xgray").innerText;
            var updated=parseStringDate(xgray);
            addStory({
                title:work.querySelector("a.stitle").innerText,
                id:parseID(work.querySelector("a.stitle").href),
                author:authors[authorIndex].author,
                authorRaw:authors[authorIndex].authorRaw,
                authorURL:authors[authorIndex].authorURL,
                category:xgray.replace(/ - Rated:.*/,""),
                chapters:parseInt(xgray.replace(/.*Chapters: /,"").replace(/ - .*/,"")),
                updated:updated,
                updateSortable:parseDate(updated)
            });
        });
        writeStoryTable();
        authorIndex++;
        if (authors[authorIndex]) setTimeout(function() {frame.src=authors[authorIndex].authorURL},10000);
        else setTimeout(function() {refreshBaseLists()},10000);
    }
}
function addStory(work) {
    var matchFound=0;
    for (var i=0;i<stories.length;i++) if (stories[i].id==work.id) {
        stories[i]=work;
        matchFound=1;
        break;
    }
    if (matchFound==0) stories.push(work);
}

function writeStoryTable() {
    var tableContainer=document.querySelector(".table-bordered");
    var table=tableContainer.querySelector("table");
    tableContainer.querySelector("div").innerHTML='<img src="/static/ficons/script.png" width="16" height="16" border="0" align="absmiddle"> <b>Fanfiction</b> (last checked: '+(authorIndex+1)+'/'+authors.length+')</div>';
    stories.sort(function(a,b) {return b.updateSortable-a.updateSortable});
    if (stories.length>50) stories.length=50;

    table.innerHTML='<thead style="border-top: 1px solid #dddddd;"><tr><th class="thead" align="left">Updated</th><th class="thead" align="left">Story</th><th class="thead" align="left">Author</th><th class="thead" align="left">Category</th></thead><tbody>';
    stories.forEach(work=>{table.innerHTML+='<tr><td>'+work.updated+'</td><td><a href="/s/'+work.id+'/'+work.chapters+'" target="_new">'+work.title+'</a></td><td><a href="'+work.authorURL+'" target="_new">'+work.authorRaw+'</a></td><td>'+work.category+'</td></tr>'});
    table.innerHTML+="</tbody>";
}

function checkForStall() {
    console.log("hi");
    var iframe=document.querySelector("iframe#dataFrame");
    var newURL=iframe.src;
    console.log(oldURL, newURL);
    if (oldURL==newURL) iframe.src=authors[authorIndex].authorURL;
    else oldURL=newURL;
}

function parseDate(string) {
    string=string.split("-");
    return (string[2]+string[0]+string[1]);
}
function parseStringDate(stringDate) {
    stringDate=stringDate.replace((stringDate.search("Updated")!=-1?/.*Updated: /:/.*Published: /),"").replace(/ - .*/,"");
    if (stringDate.search(" ago")==-1) var date=stringDate;
    else {
        var newDate=new Date();
        if (stringDate.search("m ago")!=-1) newDate.setMinutes(newDate.getMinutes()-parseInt(stringDate.replace("m ago","")));
        else if (stringDate.search("h ago")!=-1) newDate.setHours(newDate.getHours()-parseInt(stringDate.replace("h ago","")));
        var date=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][newDate.getMonth()]+" "+newDate.getDate();
    }

    if (date.search(", ")==-1) date=date+", "+new Date().getFullYear();
    date=date.split(/,* /);
    date[1]="0"+date[1];
    date[0]="0"+["Smarch","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(date[0]);

    return date[0].substring(date[0].length-2)+"-"+date[1].substring(date[1].length-2)+"-"+date[2];
}
function parseID(string) {
    return string.replace("https://www.fanfiction.net/s/","").replace(/\/.*/,"");
}