// ==UserScript==
// @name           Pixiv One-Click Bookmark
// @namespace      https://gist.github.com/E-Badapple
// @description    Add a button under the image to OneClick Bookmark.
// @match          www.pixiv.net/search.php*
// @match          www.pixiv.net/bookmark.php*
// @match          www.pixiv.net/member_illust.php?id=*
// @match          www.pixiv.net/ranking.php*
// @match          www.pixiv.net/*bookmark_new_illust.php*
// @version        1.1.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/26377/Pixiv%20One-Click%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/26377/Pixiv%20One-Click%20Bookmark.meta.js
// ==/UserScript==

function setListener(){
    var url = window.location.href;
    if( ( url.indexOf('bookmark.php\?')>-1 || url.indexOf('member_illust.php')>-1 || url.indexOf('bookmark_new_illust.php')>-1 ) && url.indexOf('bookmark.php\?rest=hide') < 0 ){
        GetallImage();
        var observer = new MutationObserver(function(mutations){
            for (var i = 0; i < mutations.length; ++i) {
                for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                    if( mutations[i].addedNodes[j].getAttribute('class').indexOf('image-item') > -1 && mutations[i].addedNodes[j].getAttribute('class').indexOf('_image-items') < 0 ){
                        GetimageLink( mutations[i].addedNodes[j] );
                    }
                    else{
                        if( mutations[i].addedNodes[j].getAttribute('class').indexOf('_image-items') > -1 ){
                            for( var k=0; k < mutations[i].addedNodes[j].getElementsByClassName('image-item').length; k++ ){
                                GetimageLink( mutations[i].addedNodes[j].getElementsByClassName('image-item')[k] );
                            }
                        }
                    }
                }
            }
        });
        var imageItems = document.querySelector('._image-items').parentNode;
    }
    else if( url.indexOf('ranking.php')>-1 ){
        GetallRank();
        var observer = new MutationObserver(function(mutations){
            for (var i = 0; i < mutations.length; ++i) {
                for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                    if( mutations[i].addedNodes[j].getAttribute('class').indexOf('ranking-item') > -1 && mutations[i].addedNodes[j].getAttribute('class').indexOf('ranking-items') < 0 ){
                        GetrankLink( mutations[i].addedNodes[j] );
                    }
                }
            }
        });
        var imageItems = document.querySelector('.ranking-item').parentNode;
    }
    else if( ( url.indexOf('bookmark.php')>-1 && url.indexOf('bookmark.php\?') < 0 ) || url.indexOf('bookmark.php\?rest=hide' > -1 ) ){
        GetallRecommend();
        var observer = new MutationObserver(function(mutations){
            for (var i = 0; i < mutations.length; ++i) {
                for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                    if( mutations[i].addedNodes[j].getAttribute('class').indexOf('image-item') > -1 && mutations[i].addedNodes[j].getAttribute('class').indexOf('_image-items') < 0 ){
                        GetimageLink( mutations[i].addedNodes[j] );
                    }
                }
            }
        });
        var imageItems = document.querySelector('section._unit');
    }
    else if( url.indexOf('search.php')>-1 ){
        window.setTimeout(GetallSearchImage,1000);
    }

    var options={
        'childList' : true,
        'subtree' : true
    };

    observer.observe(imageItems,options);
}

function setSearchListrner()
{
    var observer = new MutationObserver(function(mutations){
        for (var i = 0; i < mutations.length; ++i) {
            for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                if( mutations[i].addedNodes[j].getAttribute('class').indexOf('_7IVJuWZ') > -1 ){
                    GetsearchLink( mutations[i].addedNodes[j].firstChild );
                }
            }
        }
    });
    var imageItems = document.querySelector('.layout-body');

    var options={
        'childList' : true,
        'subtree' : true
    };

    observer.observe(imageItems,options);
}



var alwaysPrivate = false;
var iii=1;
var listener = function(e){
    e.preventDefault();
    e.target.textContent = "Adding...";
    var id1 = "bookmark_add.php?type=illust&illust_id="+e.target.getAttribute("href").split("=")[1];
    var get = new XMLHttpRequest();
    get.open("GET", id1, true);
    get.onload = function(){
        var id = get.responseText.match(/<input type="hidden" name="id" value="(.*?)">/)[1];
        var tt = get.responseText.match(/<input type="hidden" name="tt" value="(.*?)">/)[1];
        var tagData = get.responseText.match(/<span class="tag c6.*?" data-tag=".*?">/g);
        var tags = (tagData !== null) ? tagData.map(function(x){return x.match(/data-tag="(.*?)">/)[1];}) : [];
        var restrict = (alwaysPrivate || (tags.indexOf("R-18") !== -1)) ? "1" : "0";
        var post = new XMLHttpRequest();
        post.open("POST", "https://www.pixiv.net/bookmark_add.php", true);
        post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        post.onload = function(){
            e.target.style = "background-color:#9e9a93";
            e.target.innerHTML = "BookMarking";
            e.target.removeEventListener("click", listener, false);
        };
        post.send("type=illust&id=" + id + "&tt=" + tt + "&restrict=" + restrict + "&comment=&mode=add&from_sid=&submit=&tag=" + tags.join(" "));
    };
    get.send();
};

function GetallImage(){
    var url;
    var id;
    var imageItem = document.getElementsByClassName("image-item");
    for( var i=0; i<imageItem.length; i++){
        try{
            if( !imageItem[i].getElementsByClassName("bookmark-count __ui-tooltip")[0] ){
                id = imageItem[i].firstChild.getAttribute("href");
                id = id.split('=')[2];
                url = "/member_illust.php?mode=medium&illust_id=" + id;
                CheckBookmark( imageItem[i], url, id );
            }
        }catch(e){}
    }
}

function GetallSearchImage(){
    var url;
    var id;
    var imageItem = document.getElementsByClassName("gmzooM4");
    for( var i=0; i<imageItem.length; i++){
        try{
            if( !imageItem[i].getElementsByClassName("bookmark-count __ui-tooltip")[0] ){
                id = imageItem[i].firstChild.firstChild.getAttribute("href");
                id = id.split('=')[2];
                url = "/member_illust.php?mode=medium&illust_id=" + id;
                CheckBookmark( imageItem[i], url, id );
            }
        }catch(e){}
    }
}

function GetallRank(){
    var imageItem = document.getElementsByClassName("ranking-item");
    var id;
    var url;
    for( var i=0; i<imageItem.length; i++){
        try{
            if( !imageItem[i].getElementsByClassName("bookmark-count __ui-tooltip")[0] ){
                id = imageItem[i].getElementsByClassName("ranking-image-item")[0].getAttribute("id");
                id = id.split("i")[1];
                url = "/member_illust.php?mode=medium&illust_id=" + id;
                CheckBookmark( imageItem[i], url, id );
            }
        }catch(e){}
    }
}

function GetallRecommend(){
    var imageItem = document.getElementById("illust-recommend").getElementsByClassName('image-item');
    var id;
    var url;
    for( var i=0; i<imageItem.length; i++){
        try{
            if( !imageItem[i].getElementsByClassName("bookmark-count __ui-tooltip")[0] ){
                id = imageItem[i].firstChild.getAttribute("href");
                id = id.split('=')[2];
                url = "/member_illust.php?mode=medium&illust_id=" + id;
                CheckBookmark( imageItem[i], url, id );
            }
        }catch(e){}
    }
}

function GetimageLink( imageItem ){
    try{
        if( !imageItem.getElementsByClassName("bookmark-count __ui-tooltip")[0] ){
            var id = imageItem.firstChild.getAttribute("href");
            id = id.split('=')[2];
            var url = "/member_illust.php?mode=medium&illust_id=" + id;
            CheckBookmark( imageItem, url, id );
        }
    }catch(e){}
}

function GetsearchLink( imageItem ){
    try{
        if( !imageItem.getElementsByClassName("bookmark-count __ui-tooltip")[0] ){
            var id = imageItem.firstChild.firstChild.getAttribute("href");
            id = id.split('=')[2];
            var url = "/member_illust.php?mode=medium&illust_id=" + id;
            CheckBookmark( imageItem, url, id );
        }
    }catch(e){}
}

function GetrankLink( imageItem ){
    try{
        if( !imageItem.getElementsByClassName("bookmark-count __ui-tooltip")[0] ){
            var id = imageItem.getElementsByClassName("ranking-image-item")[0].getAttribute("id");
            id = id.split('i')[1];
            var url = "/member_illust.php?mode=medium&illust_id=" + id;;
            CheckBookmark( imageItem, url, id );
        }
    }catch(e){}
}

function CheckBookmark( imageItem, url, id ){
    var xmlhttp;
    var x;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            x=xmlhttp.responseText;
            if( x.indexOf("add-bookmark") > -1 ) addButton(id, imageItem, 0);
            else addButton(id, imageItem, 1);
        }
    };
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}

function addButton(id, imageItem, IfBookMark){
    var url = "/bookmark_detail.php?illust_id="+id;
    var ul = document.createElement("ul");
    var a = document.createElement("a");
    a.setAttribute("class", "bookmark-count __ui-tooltip");
    a.setAttribute("href",url);
    if( IfBookMark === 0 ) {
        a.innerHTML = "Add BookMark";
        a.addEventListener("click",listener,false);
    }
    else{
        a.innerHTML = "BookMarking";
        a.setAttribute("style","background-color:#9e9a93");
    }
    if( !imageItem.getElementsByClassName("bookmark-count __ui-tooltip")[0] ){
        imageItem.appendChild(ul);

        imageItem.appendChild(a);
    }
}

if( window.location.href.indexOf('search.php')>-1 ){
    window.setTimeout(GetallSearchImage,500);
    window.setTimeout(setSearchListrner,1000);
}
else{
    setListener();
}


