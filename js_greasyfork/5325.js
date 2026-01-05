// ==UserScript==
// @name          4chan Gallery
// @version       2.1.30
// @description   Adds board title, catalog, images, download, and style to the top bar.
// @include       http://boards.4chan.org/*
// @include       https://boards.4chan.org/*
// @include       http*://boards.4channel.org/*
// @namespace     https://greasyfork.org/users/3159
// @grant         GM_getValue
// @grant         GM_setValue
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/5325/4chan%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/5325/4chan%20Gallery.meta.js
// ==/UserScript==

var bname = document.getElementsByClassName("boardTitle")[0].innerHTML;
if (bname.indexOf("/ - ") > -1) {
    bname = bname.split("/ - ")[1];
}
var path = document.location.pathname.split("/");

function xc(q, r) {
    a = document.getElementsByClassName("boardList");
    a[0].insertAdjacentHTML(q, r);
    a[1].insertAdjacentHTML(q, r);
    b = document.getElementsByClassName("customBoardList");
    if (b[0]) {
        b[0].insertAdjacentHTML(q, r);
        b[1].insertAdjacentHTML(q, r);
    }
}
xc("afterbegin", '[<a href="//boards.4chan.org/' + path[1] + '">' + bname + "</a>] ");
xc("beforeend", ( path[2] == "catalog" || path[2] == "thread" ) ? "" : '[<a href="//boards.4chan.org/' + path[1] + '/catalog">Catalog</a>] ');

function xi(q) {
    var b = document.getElementById(q);
    return b;
}
var nr = '<span style="float:right">[<a class=low href=javascript:void(0)>Style</a>]&nbsp<span>';
xi("navtopright").insertAdjacentHTML("afterend", nr);
xi("navbotright").insertAdjacentHTML("afterend", nr);

var themes = ['Yotsuba New', 'Yotsuba B New', 'Futaba New', 'Burichan New', 'Tomorrow', 'Photon', 'myn1', 'myn2']; // with custom themes!
var style = document.createElement('style');

//extention buttons css
stylev = "#togglePostFormLink{font-size:1.3em;margin:.7em}#postForm{margin-top:1em;margin-bottom:1em}.ad-cnt{margin:1vh}.center{font-size:0;border:0 !important;height:100% !important}";
//Gallery css
stylev += ".frameImage{display:none !important}.frameX{display:block !important;max-height:calc(100% - 1.5em) !important;max-width:calc(100% - 60px) !important;position:fixed;margin:auto;top:0;bottom:1.5em;left:0;right:0;z-index:10000}";

document.getElementsByTagName('head')[0].appendChild(style);
nws=document.getElementsByClassName('nws').length;

function get() {
    a = nws ? GM_getValue("4cIbackupT") : GM_getValue("4cIbackupT2");
    if (a) return a;
    cur = 0;
    if (nws && document.cookie.match(/nws_style=((\w|\s)*)/)) cur = document.cookie.match(/nws_style=((\w|\s)*)/)[1];
    if (!nws && document.cookie.match(/(^|[^n])ws_style=((\w|\s)*)/)) cur = document.cookie.match(/(^|[^n])ws_style=((\w|\s)*)/)[2];
    if (cur === 0) cur = 'Yotsuba New';
    for (i = 0; i < themes.length; i++) {
        if (themes[i] == cur) {
            return i;
        }
    }
}

function set(a) {
    console.log(themes[a]);
    if (themes[a].split('myn')[1]){
        if (nws) GM_setValue("4cIbackupT", a);
        else GM_setValue("4cIbackupT2", a);
        //custom themes!
        if(themes[a] == "myn1"){
            a=0;
            style.innerHTML = stylev + "body{background:#f4f4f4;background:url('http://i.imgur.com/MrGskEp.png')}div.reply{background-color:#FDFDFD;border-color:#D6D6D6}";
        } else if (themes[a] == "myn2"){
            a=4;
            style.innerHTML = stylev + "body{transition: background 300ms ease-in 200ms;background:url('http://i.imgur.com/xv3RmOQ.png');color:#999}div.reply{background-color:#1b1b1b;border-color:#454546}.reply.highlight{border: 1px solid #5eaf55 !important}";
        }
        //end custom themes!
    } else {
        if (nws) GM_setValue("4cIbackupT", 0);
        else GM_setValue("4cIbackupT2", 0);
        style.innerHTML = stylev;
    }
    if (x){
        if (nws){
            document.cookie = "nws_style="+themes[a];
        } else {
            document.cookie = "ws_style="+themes[a];
        }
        if (path[2] == "catalog") {
            location.reload();
        } else {
            location.href = "javascript:setActiveStyleSheet('" + themes[a] + "')";
        }
    }
}

function cstyle() {
    if (get() > (themes.length - 2)) {
        set(0);
    }
    else {
        set(get() + 1);
    }
}

x=0;
set(get());
x=1;

var low = document.getElementsByClassName("low");
low[0].onclick = cstyle;
low[1].onclick = cstyle;

// Gallery
// in 4chan Settings (Images & Media) enable "Image expansion"
// Don't want the Images button? delete everything bellow!

window.addEventListener('load', function () {
    if (path[2] == "thread") {

        xc("beforeend", " [<a class=gl href=javascript:void(0)>Gallery</a>] ");
        s = document.getElementsByClassName("gl");
        for (i = 0; i < s.length; i++) {
            s[i].onclick = trigger;
        }

        function createdwn(a){
            dwn = document.createElement("a");
            dwn.innerText = "[⇩] ";
            dwn.style.opacity = "0";
            dwn.style.cursor = "pointer";
            dwn.onmouseover = function (b) {
                b.target.style.opacity = "1";
            };
            dwn.onmouseout = function (b) {
                b.target.style.opacity = "0";
            };
            dwn.onclick = function () {
                var link, allLinks = [], imgs = document.querySelectorAll(".fileThumb ");
                for (var i = 0; i < imgs.length; i++) {
                    if (imgs[i].getAttribute("href")) {
                        link = imgs[i].getAttribute("href").split("//")[1];
                        allLinks.push("curl -O <a download href='https://" + link + "'>https://" + link + "</a> && ");
                    }
                }
                document.body.innerHTML = 'N=1 && while [[ -d "4curl-$N" ]] ; do N=$(($N+1)) ; done && mkdir -p 4curl-$N && cd 4curl-$N && <br /><br />';
                for (i = 0; i < allLinks.length; i++) {
                    document.body.innerHTML += allLinks[i] + 'echo "' + (i+1) + '/' + allLinks.length + '" && <br />';
                }
                document.body.innerHTML += 'echo "done" <br /><br /> select all and paste into terminal, hit enter, then navigate to folder "4curl-#"';
            };
            a.appendChild(dwn);
        }

        d1=document.getElementsByClassName('boardList');
        if(d1.length){
            createdwn(d1[0]);
            createdwn(d1[1]);
        }
        d2=document.getElementsByClassName('customBoardList');
        if(d2.length){
            createdwn(d2[0]);
            createdwn(d2[1]);
        }
        bonus = [];
        tt = 1;
        titles = [];
        links = [];
        fi = 0;
        frameN = 0;
        cln = 0;
        ai = 0;
        z=0;

        function endalert() {
            ea = document.createElement("div");
            c = ea.style;
            ea.id = "theend";
            for (var d = "0123456789ABCDEF".split(""), a = "#", e = 0; 6 > e; e++) {
                a += d[Math.round(15 * Math.random())];
            }
            c.backgroundColor = a;
            c.cssText += "line-height:50px;width:200px;height:50px;position:fixed;margin:auto;left:0;right:0;top:0;bottom:0;font-size:42px;text-align:center;color:#fff;z-index:10001";
            ea.innerText = "The End";
            document.body.appendChild(ea);
            setTimeout(function () {
                z = document.getElementById("theend");
                z.parentNode.removeChild(z);
            }, 420);
        }

        function change(a) {
            i1 = document.getElementsByClassName('file');
            if (a) {
                for (fi; fi < i1.length; fi++) {
                    console.log(fi + ' ' + i1.length);
                    if (i1[fi].getElementsByClassName('expanded-thumb').length) {
                        cln = i1[fi].getElementsByClassName('expanded-thumb')[0];
                    } else if (i1[fi].getElementsByClassName('expandedWebm').length) {
                        cln = i1[fi].getElementsByClassName('expandedWebm')[0];
                    } else cln = null;
                    if (cln) {
                        console.log('adding');
                        cln.className = "frameImage";
                        cln.onclick = function () {
                            next(1);
                        };
                        cln.onerror = function (y) {
                            //console.log(y.target); //reload images?
                        };
                        document.body.appendChild(cln);
                        //add recent +?
                        links[ai] = i1[fi].parentElement.id;
                        if (i1[fi].parentElement.getElementsByClassName('backlink').length) {
                            bonus[ai] = i1[fi].parentElement.getElementsByClassName('backlink')[0].getElementsByClassName('quotelink');
                        } else bonus[ai] = "";

                        titles[ai] = i1[fi].children[0].children[0].getAttribute("title");
                        if (titles[ai]) {
                            titles[ai] = "[ " + i1[fi].children[0].innerText.split(", ")[1].split(")")[0] + " ][ " + titles[ai] + " ]";
                        } else {
                            t2 = i1[fi].children[0].innerText;
                            titles[ai] = "[ " + t2.split(", ")[1].split(")")[0] + " ][ " + t2.split("File: ")[1].split(" (")[0] + " ]";
                        }
                        ai++;
                    }
                }
            } else {
                frame = document.getElementsByClassName('frameImage');
                if (frame[frameN].tagName == "VIDEO") frame[frameN].pause(); //new new
                frame[frameN].className = "frameImage";
                bg.style.display = "none";
                larw.style.display = "none";
                rarw.style.display = "none";
                li.style.display = "none";
                ri.style.display = "none";
            }
        }

        function i4(a){
            r = document.createElement("a");
            r.style.setProperty ("color", "#bababa", "important"); //add colors?
            r.innerText = z ? " [ " + a.split("p")[1] + " ]" : " +";
            r.onmouseover = function () {
                bb = document.getElementById(a);
                if (document.getElementsByClassName('post reply').length){
                    pColor = window.getComputedStyle(document.getElementsByClassName('post reply')[0]).backgroundColor;
                } else pColor = window.getComputedStyle(document.body).backgroundColor;
                bb.style.backgroundColor = pColor;
                bb.style.cssText += "position:fixed;z-index:10001;left:50%;top:50%;transform:translate(-50%,-50%);margin:0";
            };
            r.onmouseout = function () {
                bb.style.cssText = "";
            };
            r.onclick = function () {
                bb.style.cssText = "";
                bb.scrollIntoView();
                trigger();
            };
            bi.appendChild(r);
            z=0;
        }

        function info(a) {
            bi.innerHTML = "";
            ii.innerText = titles[a];
            i2.innerText = "[ " + (a + 1) + "/" + frame.length + " ]";
            if (bonus[a].length){
                for (i=--bonus[a].length;i>-1;i--){
                    i4(bonus[a][i].href.split(/#(p.*)/)[1]);
                }
            }
            z=1;
            i4(links[a]);
        }
        function next(a) {
            if (!tt) {
                bg.style.display = "block";
                larw.style.display = "block";
                rarw.style.display = "block";
                li.style.display = "block";
                ri.style.display = "block";
                pics = document.getElementsByClassName('fileThumb');
                aa=fi;
                while (aa < pics.length) {
                    pics[aa].children[0].click();
                    aa++;
                }
                change(1);

                frame = document.getElementsByClassName('frameImage');
                console.log('next '+a+'frames'+frame.length+'N'+frameN);
                if (a == 2) {
                    frame[frameN].className += " frameX";
                    if (frame[frameN].tagName == "VIDEO") frame[frameN].play();
                } else if (a == 1) {
                    if (frameN < --frame.length) {
                        frame[frameN].className = "frameImage";
                        if (frame[frameN].tagName == "VIDEO") frame[frameN].pause();
                        frame[++frameN].className += " frameX";
                        if (frame[frameN].tagName == "VIDEO") frame[frameN].play();
                    } else {
                        endalert();
                    }
                } else {
                    if (frameN > 0) {
                        frame[frameN].className = "frameImage";
                        if (frame[frameN].tagName == "VIDEO") frame[frameN].pause();
                        frame[--frameN].className += " frameX";
                        if (frame[frameN].tagName == "VIDEO") frame[frameN].play();
                    }
                }
                info(frameN);
                //start webm, stop previous
            }
        }

        function trigger() {
            tt = tt ? 0 : 1;
            if (tt) {
                change(0);
            } else {
                next(2);
            }
        }

        bg = document.createElement("div");
        bg.style.cssText = "background: rgba(0, 0, 0, .85);position:fixed;top:0;left:0;z-index:9999;width:100%;height:100%;display:none";
        bg.onclick = trigger;
        document.body.appendChild(bg);

        //extra buttons
        larw = document.createElement("div");
        rarw = document.createElement("div");
        var arw = "cursor:pointer;position:fixed;z-index:10000;top:calc(50% - 15px);border-top: 15px solid transparent;border-bottom: 15px solid transparent;display:none;border-";
        larw.style.cssText = arw + "right: 20px solid #bababa;left:5px";
        rarw.style.cssText = arw + "left: 20px solid #bababa;right:5px";
        larw.onclick = function () {
            next(0);
        };
        rarw.onclick = function () {
            next(1);
        };
        document.body.appendChild(larw);
        document.body.appendChild(rarw);
        li = document.createElement("div");
        ri = document.createElement("div");
        bi = document.createElement("span");
        var iv = "position:fixed;bottom:0;z-index:10000;margin:0;display:none;text-decoration:none;";
        li.style.cssText = iv + "left:0";
        ri.style.cssText = iv + "right:0";
        ii = document.createElement("a");
        ii.onclick = function () {
            frame[frameN].className = "frameImage";
            frameN = 0;
            next(2);
        };
        i2 = document.createElement("a");
        i2.onclick = function () {
            frame[frameN].className = "frameImage";
            frameN = --frame.length;
            next(2);
        };
        document.body.appendChild(li);
        ii.style.setProperty ("color", "#bababa", "important");
        li.appendChild(ii);
        document.body.appendChild(ri);
        i2.style.setProperty ("color", "#bababa", "important");
        ri.appendChild(bi);
        ri.appendChild(i2);
        //end buttons

        document.addEventListener("keydown", function (e) {
            switch (e.which) {
                case 37:
                    next(0);
                    break;
                case 39:
                    next(1);
                    break;
            }
        });
    }
});
