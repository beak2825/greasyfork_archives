// ==UserScript==
// @name         FM-Preview
// @namespace    http://weijunji.me
// @version      1.2.1
// @description  try to take over the world!
// @author       You
// @match        http://www.ifumanhua.com/forum.php?mod=forumdisplay&fid=86*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/dexie/3.0.0-alpha.6/dexie.min.js
// @require      https://cdn.bootcss.com/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js
// @downloadURL https://update.greasyfork.org/scripts/377428/FM-Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/377428/FM-Preview.meta.js
// ==/UserScript==

console.log("FM-Preview");

// select
const links = $("a.s.xst");

// Init database
const db = new Dexie("fm_preview");
db.version(1).stores({
    preview: 'tid, read, img'
});
db.preview.put({tid: 0, read: true, like: false, img: []}).catch(function(err){
    console.log(err);
});

// mouse location
let xx = 0;
let yy = 0;

// insert node
const node = $("<div id='fm-preview' style='position: fixed; left: 100px; top: 100px; overflow: hidden; overflow-x: scroll; float: left; white-space: nowrap; width: 50%;'></div>");
$("body").append(node);
GM_addStyle("div#fm-preview::-webkit-scrollbar {display: none;}");

function showImage (imageList) {
    node.empty();
    if(yy > 480){
        yy = yy - 420;
    }else{
        yy = yy + 20;
    }
    node.css("top", yy);
    node.css("left", xx - 100);
    if(imageList.length === 0){
        imageList.push("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png");
        console.info("NO image");
    }
    for (let index in imageList){
        node.append("<img src='" + imageList[index] + "' id='preview-img' style='max-width: 500px; max-height: 400px; margin: 10px;'/>");
    }
}

function getImage (href, tid) {
    fetch(href).then(function (response) {
        return response.text();
    }).then(function(text){
        const ownerDocument = document.implementation.createHTMLDocument('virtual');
        const content = $(text, ownerDocument);
        if(content[0].tagName === "SCRIPT"){
            console.error("BLOCKED");
        }else{
            let list = [];
            content.find("img[id^=aimg]").each(function(){ list.push(this.getAttribute("zoomfile"));});
            db.preview.put({tid: tid, read: false, img: list});
            showImage(list);
        }
    }).catch(err => console.log(err));
};

links.hover(
    function (e) {
        xx = e.originalEvent.x || e.originalEvent.layerX || 0;
        yy = e.originalEvent.y || e.originalEvent.layerY || 0;
        const href = this.href;
        const tid = Number(href.split("&")[1].split("=")[1]);
        db.preview.get(tid, function(res) {
            if(res){
                showImage(res.img);
            }else{
                getImage(href, tid);
            }
        });
    },
    function () {
        node.empty();
    }
);

links.mousewheel(function (e) {
    node.scrollLeft(node.scrollLeft() - e.deltaFactor * e.deltaY);
    return false;
});

links.click(function (){
    const tid = Number(this.href.split("&")[1].split("=")[1]);
    db.preview.update(tid, {read: true});
    console.log(this);
    this.style.color = "red";
    GM_openInTab(this.href);
    return false;
})

links.each(function (index, value){
    const tid = Number(this.href.split("&")[1].split("=")[1]);
    db.preview.get(tid, function(res) {
        if(res && res.read){
            console.log(value);
            value.style.color = "red";
        }
    });
});