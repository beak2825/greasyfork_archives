// ==UserScript==
// @name            SA Tweak
// @description     Can change breadcrumbs revert back to old SA style etc
// @author          ROXICODONE
// @namespace       https://greasyfork.org/
// @homepage        https://greasyfork.org/en/scripts/417008-sa-tweak
// @include         http://forums.somethingawful.com/*
// @include         https://forums.somethingawful.com/*
// @version         1.0.0.2
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/417008/SA%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/417008/SA%20Tweak.meta.js
// ==/UserScript==
 
var old_breadcrumbs  = true;
var old_style        = false;
var old_pagenav      = false;
var keep_dropdown    = false;
var tweak_forum_jump = true;
 
(function (document) {
    var i,j,b;
 
    if (old_pagenav)
    {
        var broken = document.querySelector(".standard.bookmarked_threads form .pages,form[name='bookmarks'] .pages.bottom");
        if (broken) broken.parentNode.removeChild(broken);
 
        var pagesel = document.querySelector(".pages select");
        if (pagesel)
        {
            var href = document.querySelector(".pages a").href;
            var qs = href.split("?")[1];
            href = href.split("?")[0] + "?" + buildQueryString(parseQueryString(qs));
 
            var pagecount = pagesel.querySelectorAll("option").length;
            var curpage = parseInt(pagesel.querySelector("option[selected]").value, 10);
            b = document.createElement("b");
 
            var a = document.createElement("a");
            a.className = "pagenumber";
 
            if (curpage > 1)
            {
                a.href = href + "&pagenumber=1";
                a.innerHTML = "« First";
                b.appendChild(a.cloneNode(true));
                b.appendChild(document.createTextNode(" "));
                a.href = href + "&pagenumber=" + (curpage - 1);
                a.innerHTML = "‹ Prev";
                b.appendChild(a.cloneNode(true));
            }
 
            for (i = curpage - 4; i < curpage + 5; i++)
            {
                if (i < 1 || i > pagecount) { continue; }
                b.appendChild(document.createTextNode(" "));
                if (i == curpage)
                {
                    var s = document.createElement("span");
                    s.className = "curpage";
                    s.innerHTML = i;
                    b.appendChild(s);
                    continue;
                }
 
                a.href = href + "&pagenumber=" + i;
                a.innerHTML = i;
                b.appendChild(a.cloneNode(true));
            }
 
            if (curpage < pagecount)
            {
                b.appendChild(document.createTextNode(" "));
                a.href = href + "&pagenumber=" + (curpage + 1);
                a.innerHTML = "Next ›";
                b.appendChild(a.cloneNode(true));
                b.appendChild(document.createTextNode(" "));
                a.href = href + "&pagenumber=" + pagecount;
                a.innerHTML = "Last »";
                b.appendChild(a.cloneNode(true));
            }
 
            if (keep_dropdown)
            {
                b.appendChild(pagesel);
            }
 
            var pagenavs = document.getElementsByClassName("pages");
            for (i = 0; i < pagenavs.length; i++)
            {
                pagenavs[i].innerHTML = "";
                pagenavs[i].appendChild(document.createTextNode("Pages ("+pagecount+"): "));
                pagenavs[i].appendChild(i == pagenavs.length - 1 ? b : b.cloneNode(true));
            }
 
            if (keep_dropdown)
            {
                pagesel = document.querySelectorAll(".pages select");
                pagesel[0].onchange = function () {
                    pagesel[1].value = this.value;
                    var e = document.createEvent("HTMLEvents");
                    e.initEvent('change', true, true);
                    pagesel[1].dispatchEvent(e);
                };
            }
        }
    }
    else
    {
        var pages = document.querySelectorAll(".pages a, .pages span");
        for (i = 0; i < pages.length; i++)
        {
            if (pages[i].innerHTML.match(/«/))
            {
                pages[i].innerHTML = '« First';
            }
 
            if (pages[i].innerHTML.match(/‹/))
            {
                pages[i].innerHTML = '‹ Prev';
            }
 
            if (pages[i].innerHTML.match(/›/))
            {
                pages[i].innerHTML = 'Next ›';
            }
 
            if (pages[i].innerHTML.match(/»/))
            {
                pages[i].innerHTML = 'Last »';
            }
 
            if (pages[i].tagName.toLowerCase() == "span")
            {
                pages[i].style.fontSize = "12px";
                pages[i].style.padding = "2px 0 1px";
                pages[i].style.margin = "4px 2px";
            }
        }
    }
 
    if (old_breadcrumbs)
    {
        var bc = document.querySelectorAll(".breadcrumbs > span.mainbodytextlarge");
        for (i = 0; i < bc.length; i++)
        {
            if (bc[i].childNodes[0].tagName.toLowerCase() == "b")
            {
                bc[i].parentNode.insertBefore(bc[i].childNodes[0], bc[i]);
                bc[i].parentNode.removeChild(bc[i]);
                continue;
            }
            else if (bc[i].childNodes[0].childNodes.length > 1)
            {
                b = document.createElement("b");
 
                var c = bc[i].querySelectorAll(".up span a");
                for (j = 0; j < c.length; j++)
                {
                    b.appendChild(c[j]);
                    b.appendChild(document.createTextNode(" > "));
                }
 
                var bclast = bc[i].querySelector(".bclast");
                if (bclast) b.appendChild(bclast.cloneNode(true));
 
                while (bc[i].childNodes.length > 0)
                {
                    bc[i].removeChild(bc[i].childNodes[0]);
                }
 
                bc[i].appendChild(b);
            }
        }
    }
 
    var forum_jump = document.querySelector(".forum_jump");
    if (tweak_forum_jump && forum_jump)
    {
        forum_jump.style.textAlign = "right";
        var select = forum_jump.querySelector("select[name='forumid']");
        select.style.fontSize = '12px';
        select.querySelector("option[value='26']").innerHTML = '-- FYAD';
        select.querySelector("option[value='188']").innerHTML = '-- Questions, Comments, Suggestions?';
        forum_jump.querySelector("input[type='submit']").style.fontSize = '12px';
    }
 
    if (old_style)
    {
        var head = document.querySelector("head");
 
        var sa_css = "";
        sa_css += ".newthread #content table.standard tr td:first-child, .newreply #content table.standard tr td:first-child, .priv_sendprivmsg #content table.standard tr td:first-child, .editpost #content table.standard tr td:first-child, .threads_editthread #content table.standard tr td:first-child { max-width: 180px; min-width: 180px; width: 180px; }";
        sa_css += "td.star div { width: 16px; height: 16px; cursor: pointer; background: transparent url(http://fi.somethingawful.com/images/stars/bookmark-star-grey.png) no-repeat center center; }";
        sa_css += "td.star.bm0 div, tr.category0 td.star div { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgtJREFUeNqkU01LG1EUPW8+pGRqI0PUxiYqYqWbuvGDblWULqTdSSkFF25CkVbwDygUxIXQdlM37nSjKyW7oq4lsYguaqstKm1tTBwbbQZNJvN8dzJpM2AKxYHDXM4957z7LjOMcw4/20KZp9t9r1zVTPP7kMo5GbKDerBqmUB1OV3ZABHx/NVkLQhU/1eAODESag52nl+oIFBN3L8CZIFhgajAYQ433w0O6dj+yB1QTRz1XM2w6wGjJeos/rKjq/51T68GTVNxZjLs7QPGUSFdrwEaG4BKH0cmk8Py+wxiqwcjBm9/oxSO/7IRX9Mx8LRKNDkSSQ47/3fMZArY+QTUVgM9vSria78dD9BeuEIKT2KSGZubGE8gXA9YF3kcH1seEEc90pCWPH+uwBijoICO6Zl7bY/6ff5K7Hy2Pcu62yLBTJ9he30paiAyROcKr+1McAubpDYqkFzY/5oVpY1fJ5YHxFGPNKR1PVCKJwjCspAI1IUUpE8tyKqFutvOovHjZ15wYgeid3DyIEDaok8pHdPGjXBNtQw9IEZuUrDxIePwD/s0522kZOwJTanHE8CRk2gnZPy2m4aG6Xnio7uRgVCzH+Gw4mg8H13pz+TDWKuNx6My1o1DvJ0V1HdXdyeIF8/yaNMlLE6ZGNss/kyegFO0Vjg5NAxgirvmXF51eebyWU/AdZ5LAQYAvwPuZrGdCy0AAAAASUVORK5CYII=); }";
        sa_css += "td.star.bm1 div, tr.category1 td.star div { background-image: url(http://fi.somethingawful.com/images/stars/bookmark-star-red.png); }";
        sa_css += "td.star.bm2 div, tr.category2 td.star div { background-image: url(http://fi.somethingawful.com/images/stars/bookmark-star-yellow.png); }";
        sa_css += "div.threadrate { margin-top: -2px; padding-left: 0px; color: #fff; line-height: 20px; }";
        sa_css += "div.threadrate ul.rating_buttons { display: inline-block; vertical-align: middle; background: #555 url(http://fi.somethingawful.com/ui/rating-bg.png) no-repeat center center; width: 104px; height: 20px; margin: 0; padding: 1px; }";
        sa_css += "div.threadrate ul.rating_buttons li { cursor: pointer; color: #000; display: inline-block; list-style: none; margin-left: 1px; width: 18px; height: 18px; border: 1px solid #ddd; line-height: 18px; text-align: center; text-shadow: none; }";
        sa_css += "div.threadrate ul.rating_buttons li:hover { background-color: #fff; background-color: rgba(255, 255, 255, 0.2); border-color: #fff; font-weight: bold; }";
        sa_css += "div.threadrate ul.rating_buttons li:first-child { margin-left: 0; } #button_bookmark { cursor: pointer; }";
        sa_css += "#filter .toggle_tags::before { content: '▶ '; } #filter .toggle_tags { cursor: pointer; } #filter .thread_tags { display: none; padding: 4px 1px; }";
        sa_css += "#filter.open .toggle_tags::before { content: '▼ '; } #filter.open .thread_tags { display: block; } .postbuttons { text-align: center; }";
        sa_css += ".bbc-spoiler.reveal, .bbc-spoiler.reveal li, .bbc-spoiler.stay, .bbc-spoiler.stay li { color: white; }";
        sa_css += ".bbc-spoiler img { visibility: hidden; } .bbc-spoiler.reveal img, .bbc-spoiler.stay img { visibility: visible; }";
        sa_css += "#buddylist dl { padding: 4px 10px 14px 10px; margin: 0; line-height: 18px; text-decoration: none; }";
        sa_css += "#buddylist dd { height: 24px; line-height: 24px; margin: 0; padding-left: 20px; }";
        sa_css += "#buddylist dl.offline dd { background: left no-repeat url(http://fi.somethingawful.com/images/off.gif); }";
        sa_css += "#buddylist dl.online dd { background: left no-repeat url(http://fi.somethingawful.com/images/on.gif); }";
        sa_css += "div.standard { width: auto; } div.breadcrumbs a:hover { color: #C60; } #thread td.postbody img { vertical-align: middle; }";
 
        var sa_style = document.createElement("style");
        sa_style.setAttribute("type", "text/css");
        sa_style.innerHTML = sa_css;
        head.appendChild(sa_style);
 
        head.removeChild(document.querySelector("head > link[href*='/css/forums.css']"));
    }
    else
    {
        var mpbars = document.querySelectorAll("#mp_bar");
        if (mpbars && mpbars.length > 0)
        {
            for (i = 0; i < mpbars.length; i++)
            {
                mpbars[i].style.visibility = "visible";
            }
        }
    }
 
    var si = document.querySelectorAll(".bbc-spoiler > img");
    if (si && si.length > 0)
    {
        for (i = 0; i < si.length; i++)
        {
            si[i].onclick = function () {
                this.parentNode.click();
            };
        }
    }
 
    var icons = document.querySelectorAll("td.icon");
    if (icons.length > 0)
    {
        var img, iconid, forumid = parseQueryString(location.href.split("?")[1]).forumid;
        for (i = 0; i < icons.length; i++)
        {
            img = icons[i].querySelector("img");
            iconid = img.src.split("#")[1];
            if (iconid)
            {
                a = document.createElement("a");
                a.href = location.protocol + "//" + location.hostname + location.pathname + "?forumid=" + forumid + "&posticon=" + iconid;
                a.appendChild(img);
                icons[i].appendChild(a);
            }
        }
    }
 
    if (false && location.hash && location.hash != '#')
    {
        var scrollto = document.querySelector(location.hash);
        if (scrollto)
        {
            var images = document.querySelector("#thread img");
            var image_count = images.length;
            for (i = 0; i < image_count; i++)
            {
                images[i].addEventListener("load", function () {
                    --image_count;
                    if (image_count == 0)
                    {
                        scrollto.scrollIntoView();
                    }
                });
            }
        }
    }
})(document);
 
function parseQueryString()
{
    var query = {}, qstr = location.search.substr(1, location.search.length).split("&");
    for (i = 0; i < qstr.length; i++)
    {
        part = qstr[i].split("=");
        query[part[0]] = part[1];
    }
    delete query.pagenumber;
    return query;
}
 
function buildQueryString(query)
{
    var i, qstr = [];
    for (i in query)
    {
        qstr.push(i+"="+query[i]);
    }
    return qstr.join("&");
}