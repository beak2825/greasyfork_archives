// ==UserScript==
// @name        fictionpress
// @namespace   fictionpress
// @description remove all the style and merge with the list from the TOC page
// @include     https://www.fictionpress.com/s/*/*/*
// @include     http://skythewood.blogspot.sg/p/knights-and-magic-author-amazake-no.html
// @include     http://www.translationnations.com/translations/*/
// @include     http://gravitytales.com/chaotic-sword-god/
// @include     http://raisingthedead.ninja/current-*
// @include     http://www.wuxiaworld.com/*-index/
// @include     http://japtem.com/*-volume-*chapter-*/
// @include     http*://dragomircm.com/wn*/
// @include     http://royalroadl.com/fiction/*
// @include     https://xantandminions.wordpress.com/lv999-villager/
// @include     http://www.sousetsuka.com/p/blog-page*
// @include     http://shiroyukitranslations.com/long-live-summons/
// @include     https://clickyclicktranslation.blogspot.com/p/blog-page.html
// @include     http://gravitytales.com/*/true-martial-world
// @include     http://thesylthorian.com/wn-*/
// @include     http://www.rainbowturtletranslation.com/legendary-moonlight-sculptor-table-of-contents/
// @version     0.8.8.7
// @require     http://code.jquery.com/jquery-latest.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @connect-src *
// @downloadURL https://update.greasyfork.org/scripts/26900/fictionpress.user.js
// @updateURL https://update.greasyfork.org/scripts/26900/fictionpress.meta.js
// ==/UserScript==

oldHistory = JSON.parse(GM_getValue("history","{}"));
button = $("<div style='z-index: 9999;top:0;position: fixed;'><input type='button'  value='kindle extract'><input type='text' id='startChap' value='0'><input type='button' value='trasponi'></div>");
button[0].firstChild.addEventListener('click',getText,true);
button[0].children[2].addEventListener('click',trasposta,true);$("body").append(button);
istart = 0;
if(location.href.indexOf("http://turb0translation.blogspot.dk/") != -1) { istart = 317; }
if (oldHistory[location.href.replace("https://","http://")]) istart = oldHistory[location.href.replace("https://","http://")];
//delete oldHistory[location.href.replace("https://","http://")]; // delete history number
//GM_setValue("history",JSON.stringify(oldHistory));              // ^^^^^^^^^^^^^^^^^^^^^
$("#startChap").val(istart);

class1=""; class2=""; class3=""; class4=""; orderfunction=null;
if (location.href.indexOf("translationnations.com") != -1){ class1=".entry-content a"; class2=".entry-content"; }
else if(location.href.indexOf("gravitytales.com/") != -1) { class1="article a"; class2="article"; class3=".sharedaddy"; }
else if(location.href.indexOf("http://raisingthedead.ninja/") != -1) { class1=".entry-content a"; class2=".post.hentry"; class3=".comments,.post-footer,.entry-meta,.wp-post-navigation,.wpcnt,.entry-content p:last-child"; } //class4="p:has(strong)";
else if(location.href.indexOf("http://www.wuxiaworld.com/") != -1) { class1=".entry-content a"; class2=".entry-header,.entry-content"; class3=".comments,.post-footer"; }
else if(location.href.indexOf("dragomircm.com/wn") != -1) { class1="article a"; class2="article"; class3="#jp-post-flair,.wpcnt,.entry-utility"; }
else if(location.href.indexOf("http://royalroadl.com/fiction") != -1) { class1=".chapters ul a"; class2=".post_body:first,.largetext:first"; class3=".post-content"; }
else if(location.href.indexOf("xantandminions.wordpress.com/lv999-villager/") != -1) { class1=".entry-content a"; class2=".entry-header,.entry-content"; class3="#jp-post-flair"; }
else if(location.href.indexOf("www.sousetsuka.com/p/blog-pa") != -1) { class1=".entry-content a"; class2="div.post.hentry"; class3="#jp-post-flair";  }
else if(location.href.indexOf("shiroyukitranslations.com/long-live-summons/") != -1) { class1="#lcp_instance_1 a"; class2="article"; class3=".sharedaddy";  }
else if(location.href.indexOf("thesylthorian.com") != -1) { class1=".panel-grid a"; class2="article .panel-grid:first"; class3=".fcbk_share";  }
else if(location.href.indexOf("clickyclicktranslation.blogspot.com") != -1) { class1=".entry-content a"; class2=".post.hentry"; class3=".fcbk_share";  }
else if(location.href.indexOf("rainbowturtletranslation.com") != -1) { class1=".entry-content a"; class2="article"; class3=".sharedaddy,.wpcnt";  }


urls = [];
$(class1).each(function(){ if (this.href.length > 4 && !/(.*\.jpg$)|(.*\.jpeg$)|(.*\.gif$)|(.*\.bmp$)|(.*imgur\.com.*)|(.*tumblr\.com.*)|(.*\?share.*)|(.*\/#[^\/]*)/.test(this.href)) urls.push(this.href);
                          if (urls.length -1 == istart) $(this).wrap("<mark></mark>"); });
if(location.href.indexOf("shiroyukitranslations.com/long-live-summons/") != -1) urls = urls.reverse();

function trasposta(css){
    $(".entry-content table").each(function() {
        var $this = $(this);
        var newrows = [];
        $this.find("tr").each(function(){
            var i = 0;
            $(this).find("td").each(function(){
                i++;
                if(newrows[i] === undefined) { newrows[i] = $("<tr></tr>"); }
                newrows[i].append($(this));
            });
        });
        $this.find("tr").remove();
        for (j=0;j<newrows.length;j++){ $this.append(newrows[j]); }
    });
    urls = [];
    $(class1).each(function(){ if (this.href.length > 4 && !/(.*\.jpg$)|(.*\.jpeg$)|(.*\.gif$)|(.*\.bmp$)|(.*imgur\.com.*)|(.*tumblr\.com.*)|(\?share)/.test(this.href)) urls.push(this.href);
                              if (urls.length -1 == istart) $(this).wrap("<mark></mark>"); });
}
function getText(){
    istart = $("#startChap").val();
    title = $("head title").html();
    document.head.innerHTML = "<title>"+title+"</title><style>";


    if (location.href.indexOf("fictionpress.com") != -1)  {
        startt = location.pathname.match(/[0-9]+/g);
        startt = parseInt(startt[startt.length-1]);
        startt = istart;
        end = startt+11;

        document.body.innerHTML = "";
        for (i=startt;i<end;i++){
            div2 = $('<div style="page-break-after:always" class="chapter" id="page-'+i+'"></div>\n<mbp:pagebreak/>\n');
            $("body").append(div2);
        }
        ajaxTime2(startt,end);
    }
    else if (location.href.indexOf("skythewood.blogspot.sg") != -1)  {
        urls = [];
        $(".post-body a").each(function(){ if (this.href.indexOf(".htm") != -1) urls.push(this.href); });

        document.body.innerHTML = "";
        for (i=0;i<urls.length;i++){
            div2 = $('<div style="page-break-after:always" id="page-'+i+'"></div>\n<mbp:pagebreak/>\n');
            $("body").append(div2);
        }
        ajaxTime(urls,".post.hentry","",0);
    }
    else if (location.href.indexOf("japtem.com") != -1)  {
        urls = [];
        start = location.pathname.match(/[0-9]+/g);
        start = parseInt(start[start.length-1]);
        for (i=start;i<start+50;i++){
            urls.push(location.href.replace(/[0-9]+\//,i+"\/"));
        }
        console.log(urls);

        document.body.innerHTML = "";
        for (i=0;i<urls.length;i++){
            div2 = $('<div style="page-break-after:always" id="page-'+i+'"></div>\n<mbp:pagebreak/>\n');
            $("body").append(div2);
        }
        ajaxTime(urls,".post.hentry",".fusion-meta-info,.fusion-sharing-box,#disqus_thread","",0);
    }
    else {
        document.body.innerHTML = "";
        console.log(urls);
        for (i=istart;i<urls.length;i++){
            div2 = $('<div style="page-break-after:always" id="page-'+i+'"></div>\n<mbp:pagebreak/>\n');
            $("body").append(div2);
        }
        ajaxTime(urls,class2,class3,class4,istart);
    }
}

function ajaxTime2(startt,end){
    for (i=startt;i<end;i++){
        test= location.href.replace(/(\/[0-9]+\/)[0-9]+\//,"$1"+i+"\/");
        $.ajax({
            url: test,
            indexValue: i,
            urlFrom: location.href.replace("https://","http://"),
            success: function(data) {
                chap = $(data).find("#storytextp")[0].innerHTML;
                $("#page-"+(this.indexValue)).html(chap);
                oldHistory = JSON.parse(GM_getValue("history","{}"));
                if (!oldHistory[this.urlFrom] || oldHistory[this.urlFrom] < this.indexValue +1) oldHistory[this.urlFrom] = this.indexValue+1;
                GM_setValue("history",JSON.stringify(oldHistory));
                console.log(oldHistory);
            }
        });
    }
}


function testfunction(url,i,classCss,remCss,remblabla){
    GM_xmlhttpRequest ( {
        method: 'GET',
        url: url,
        accept: 'text/xml',
        onreadystatechange: function (indexValue,css,css2,css3,urlFrom) {
            return function (response) {
                if (response.readyState != 4)
                    return;
                chap = $(response.responseText).find(css)[0].innerHTML + (css.indexOf(",") != -1 ? $(response.responseText).find(css)[1].innerHTML : "");

                $("#page-"+(indexValue))[0].innerHTML = chap;
                $("#page-"+(indexValue)).find(css2).remove();
                if (css3 != "")
                    $("#page-"+(indexValue)).find(css3).eq(0).prevAll().remove();
                oldHistory = JSON.parse(GM_getValue("history","{}"));
                if (!oldHistory[urlFrom] || oldHistory[urlFrom] < indexValue) oldHistory[urlFrom] = indexValue;
                GM_setValue("history",JSON.stringify(oldHistory));

            }
        }(i,classCss,remCss,remblabla,location.href.replace("https://","http://")),
        error: function (indexValue,css,css2,css3,urlFrom) {
            return function (response) {
                if (response.status == 500){
                    chap = $(response.responseText).find(css)[0].innerHTML + (css.indexOf(",") != -1 ? $(response.responseText).find(css)[1].innerHTML : "");

                    $("#page-"+(indexValue))[0].innerHTML = chap;
                    $("#page-"+(indexValue)).find(css2).remove();
                    if (css3 != "")
                        $("#page-"+(indexValue)).find(css3).eq(0).prevAll().remove();
                    oldHistory = JSON.parse(GM_getValue("history","{}"));
                    if (!oldHistory[urlFrom] || oldHistory[urlFrom] < indexValue) oldHistory[urlFrom] = indexValue;
                    GM_setValue("history",JSON.stringify(oldHistory));

                }
            }
        }(i,classCss,remCss,remblabla,location.href.replace("https://","http://"))
    } );

}


function ajaxTime(urls,classCss,remCss,remblabla,istart){
    i=istart;
    for (i=istart;i<urls.length;i++){
        test= urls[i];
        setTimeout(testfunction,100*(i-istart),test,i,classCss,remCss,remblabla);
    }
}
