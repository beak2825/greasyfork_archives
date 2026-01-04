// ==UserScript==
// @name         Bilibili Search
// @namespace    Die
// @version      0.1
// @description  B站/Bilibili搜索指定年份视频
// @author       Panda13377777777777777777777777777777777777777
// @match        https://search.bilibili.com/all?keyword=*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js


// @downloadURL https://update.greasyfork.org/scripts/420576/Bilibili%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/420576/Bilibili%20Search.meta.js
// ==/UserScript==

/* Set Config Here */

/* Set Config Here */
var nyear = prompt("请输入要指定的年份（格式：2020 可留空）\nTips：年数越前检索越慢，在提示到底前请耐心等待！");
if(nyear == ""){
    return 0;
}
/* consolelog */
console.log('%cBiliBili        %cSearcher','color:#fff;background:#000;font-weight:800;padding:10px;border-radius:5px','color:#000;background:#ff9900;font-weight:800;padding:3px;margin-left:-60px;border-radius:5px')
console.log("2021年1月12日 Public 0.1版本 By Panda1337")
/* Vars:
    nowurl:The URL the user is browsing
    content/items/itemss:Web dom processing
    i:The position of the video element in Items
    p:The page where xhr is getting data
    pagess:Pages of search results
    ol:onloading
*/
var nowurl = window.location.href;
var content=document.getElementById("all-list");
var items=content.getElementsByTagName("ul");
var itemss=items[3].getElementsByTagName("li");
var i=3;
var p=2;
var ol=0;
var addd=0;
/* Get Pages Count */
if(itemss.length == 1){
    while(itemss['length'] <= 1){
        i++;
        itemss=items[i].getElementsByTagName("li");
    }
}
var pages = items[parseInt(i)+1].getElementsByTagName("li");
var pagess = pages[pages.length-2]['outerText'];
ptc("Pages Count :" + pagess);
$(items).eq(i+1).remove();
/* Delete useless videos on the first page */
for (var j=0;j<itemss['length'];j++)
{
    var a = itemss[j]['outerText'];
    var pd = a.indexOf(nyear+"-");
    if(pd==-1){
        itemss[j].remove();
        j=j-1;
        ptc("Video Deleted");
    }
}

/* Load More Videos on the first page */
ptc("Auto Load Next Page's Video");
/* Define function to convert string to dom object */
var ShowPager = {
    createDocumentByString: function (e) {
        if (e) {
            if ("HTML" !== document.documentElement.nodeName) return (new DOMParser).parseFromString(e, "application/xhtml+xml");
            var t;
            try {
                t = (new DOMParser).parseFromString(e, "text/html");
            } catch (e) {
            }
            if (t) return t;
            if (document.implementation.createHTMLDocument) t = document.implementation.createHTMLDocument("ADocument"); else try {
                (t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)),
                    t.documentElement.appendChild(t.createElement("head")), t.documentElement.appendChild(t.createElement("body"));
            } catch (e) {
            }
            if (t) {
                var r = document.createRange();
                r.selectNodeContents(document.body);
                var n = r.createContextualFragment(e);
                t.body.appendChild(n);
                for (var a, o = {
                    TITLE: !0,
                    META: !0,
                    LINK: !0,
                    STYLE: !0,
                    BASE: !0
                }, i = t.body, s = i.childNodes, c = s.length - 1; c >= 0; c--) o[(a = s[c]).nodeName] && i.removeChild(a);
                return t;
            }
        } else console.error("Bs", "Dom processing error!");
    }
}

if(pagess>1){
    getn(p);
}
function getn(page){
    ol = 1;
    GM_xmlhttpRequest({
        method: "GET",
        url: nowurl+"&page=" + page,
        headers:  {
            "referer":"https://www.bilibili.com/",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
            "cookie" : document.cookie
        },
        onload: function(response) {
            addd=0;
            var newpageDom = ShowPager.createDocumentByString(response.responseText);
            var all_list = newpageDom.getElementById("all-list");
            var ni=all_list.getElementsByTagName("ul");
            var nii=ni[2].getElementsByTagName("li");
            for(var k=0;k<nii.length;k++){
                a = nii[k]['outerText'];
                if(a.indexOf(nyear+"-") == -1){
                    ptc("videos has been filtered");
                    continue;

                }
                items[i].appendChild(nii[k]);
                var imgdiv = items[i].lastChild.getElementsByClassName('lazy-img');
                addd++;
                // Get pic
                var s = unescape(response.responseText);
                var d = s.split(":{\"result\":")[1];
                d = d.split(",\"noMore\":")[0];
                var obj = JSON.parse(d);
                var picurl = "https:" + obj[k]['pic'];
                imgdiv[0]['children'][0].src = picurl;
            }

            ok = 1;
            if(items[i].childElementCount <= 999){
                if(p<=pagess){
                    p++;
                    if(addd < 5 && p!=pagess){
                        getn(p);
                    }
                }else{
                    ol = 2;
                }
            }
            ol=0;
        }
    });

    return true;
}


$(window).scroll(function(){

    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if((scrollTop + windowHeight) >= (scrollHeight * 0.45)){
        if(ol==0){
            if(p < pagess){
                getn(p);
            }else{
                alert("到底了！");
            }
            ptc("Load more video!")
        }
    }
});

function ptc(text){
    console.log("%c" + text,"background: rgba(252,234,187,1);background: -moz-linear-gradient(left, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%,rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);background: -webkit-gradient(left top, right top, color-stop(0%, rgba(252,234,187,1)), color-stop(12%, rgba(175,250,77,1)), color-stop(28%, rgba(0,247,49,1)), color-stop(39%, rgba(0,210,247,1)), color-stop(51%, rgba(0,189,247,1)), color-stop(64%, rgba(133,108,217,1)), color-stop(78%, rgba(177,0,247,1)), color-stop(87%, rgba(247,0,189,1)), color-stop(100%, rgba(245,22,52,1)));background: -webkit-linear-gradient(left, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%, rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);background: -o-linear-gradient(left, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%, rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);background: -ms-linear-gradient(left, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%, rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);background: linear-gradient(to right, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%, rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fceabb', endColorstr='#f51634', GradientType=1 );font-size:0.5em")
};