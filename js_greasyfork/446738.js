// ==UserScript==
// @name         lwsxtxtAllInOne
// @namespace    http://tampermonkey.net/
// @version      0.0.60
// @license MIT
// @description  auto clicker for lwsxtxt bookmark button
// @author       David NewKamille
// @match        https://www.lwxstxt.com/*
// @match        http://www.lwxstxt.com/*
// @match        https://www.lwxstxt.org/*
// @match        http://www.lwxstxt.org/*
// @match        http://www.lwxstxt.net/*
// @match        https://www.lwxstxt.net/*
// @match        https://*.yingsx.com/*
// @match        http://*.yingsx.com/*

// @match       https://f2layer.neocities.org/*

// @match       http://p8001.f2layer.link:8001/*

// @downloadURL https://update.greasyfork.org/scripts/446738/lwsxtxtAllInOne.user.js
// @updateURL https://update.greasyfork.org/scripts/446738/lwsxtxtAllInOne.meta.js
// ==/UserScript==

// https://neocities.org/dashboard

;
(function () {

    'use strict';
    if (window.top != window.self) {
        return;
    }
    // @version      0.0.50

    'use strict'

    // Create a new same-origin iframe.
    // You'll probably want to add some styling for hiding it, and eventualy remove
    // it from the DOM later on.
    var iframe = document.createElement("iframe");

    iframe.id = "tmpFrame"
    iframe.style.height = 0
    iframe.style.width = 0

    document.body.appendChild(iframe);
    // The new iframe will create its own "clean" window object, so you can grab
    // the function you're interested in from there.
    const console = iframe.contentWindow.console;

    // save system alert function
    var oldAlert = iframe.contentWindow.alert;

    function alert(params) {
        console.log("alert:", params);
    }

    var date = new Date().getTime();

    var addressText = window.location.pathname + window.location.search + window.location.hash

    console.log("lwsxtxt, addressText: ", addressText);

    // save system alert function
    var oldAlert = alert;

    function alert(params) {
        console.log("hook alert");
    }

    var toRemoveList = ["center_", "top_", "str", "footer", "dl_", "apps"]

    //
    var clearDeep = 0
    function clearChildNodes(childNodes) {
        clearDeep = clearDeep + 1
        // console.log("clearChildNodes ...");
        if (childNodes == undefined || childNodes == null || childNodes == "") {
            childNodes = document.body.childNodes
        }
        // console.dir(childNodes)
        // debugger
        for (let index = 0; index < childNodes.length; index++) {
            const childNode = childNodes[index];
            var removed = false
            // if (childNode.className == "zj") {
            //     debugger
            // }
            if (childNode.id != undefined && childNode.id != "") {
                var txtId = childNode.id + ""
                // console.log(txtId)
                // console.dir(childNode)
                // remove top ad
                if (isRemovingPrefix(txtId)) { // start by top_
                    console.log("removed:", txtId, clearDeep)
                    childNode.remove()
                    removed = true
                }
            }
            if (removed == false && childNode.childNodes.length > 0) {
                clearChildNodes(childNode.childNodes)
            }
        }
        clearDeep = clearDeep - 1
    }

    // return all matched node
    function textMatch(childNodes, exactMatch, text) {
        var matchArr = [];
        matchArr.TextIn = text;
        for (let index = 0; index < childNodes.length; index++) {
            const childNode = childNodes[index];
            if (childNode.innerText == undefined) {
                continue;
            }
            if (exactMatch) {
                if (childNode.innerText.trim(" ") === text) {
                    matchArr.push(childNode);
                }
            } else if (childNode.innerText.indexOf(text) >= 0) {
                matchArr.push(childNode);
            }
            var childArr = textMatch(childNode.childNodes, exactMatch, text);
            for (let index = 0; index < childArr.length; index++) {
                const childNode = childArr[index];
                matchArr.push(childNode);
            }
        }
        return matchArr;
    }

    //
    // match classes and return elements
    function classesMatch(classArray, exactMatch, matchAll) {
        var matchElement = [];
        matchElement.byClass = new Map();
        matchElement.allMatched = false;

        if (classArray[0] == undefined) {
            return matchElement;
        }
        if (exactMatch !== true) {
            exactMatch = false;
        }
        if (matchAll !== true) {
            matchAll = false;
        }

        for (let index = 0; index < classArray.length; index++) {
            const oneClass = classArray[index];
            if (matchElement.byClass.has(oneClass) == false) {
                matchElement.byClass.set(oneClass, []);
            }
            var elements = document.getElementsByClassName(oneClass);
            if (elements[0] == undefined) {
                // console.log("elements not found for", oneClass);
                continue;
            }
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (exactMatch) {
                    if (element.className === oneClass) {
                        matchElement.push(element);
                        matchElement.byClass.get(oneClass).push(element);
                        // console.log("elements exactly match for", oneClass, element);
                        // console.dir(matchElement);
                        if (matchAll == false) {
                            return matchElement;
                        }
                    } else {
                        // console.log("elements not exactly match for", oneClass, element);
                    }
                } else {
                    matchElement.push(element);
                    matchElement.byClass.get(oneClass).push(element);
                    // console.log("elements match for", oneClass, element);
                    // console.dir(matchElement);
                    if (matchAll == false) {
                        return matchElement;
                    }
                }
            }
        }
        matchElement.allMatched = true;
        for (let index = 0; index < classArray.length; index++) {
            const oneClass = classArray[index];
            if (matchElement.byClass.get(oneClass).length == 0) {
                matchElement.allMatched = false;
                // console.log("element not found for", oneClass);
            }
        }
        return matchElement;
    }

    // author: meizz
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
    // var date = new Date().Format("yyyy-MM-dd-hh-mm-ss"); // format needs lib.js
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //⽉份
            "d+": this.getDate(), //⽇
            "h+": this.getHours(), //⼩时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
        return fmt;
    }

    function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }

    //
    function isMobile() {
        /* Storing user's device details in a variable*/
        let details = navigator.userAgent;

        /* Creating a regular expression
        containing some mobile devices keywords
        to search it in details string*/
        let regexp = /android|iphone|kindle|ipad/i;

        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);

        if (isMobileDevice) {
            // console.log("<h3>Its a Mobile Device !</h3>");
            return true;
        } else {
            // console.log("<h3>Its a Desktop !</h3>");
            return false;
        }
    }

    //
    function elementInViewport(el) {
        if (el == undefined) return false;

        var bounding = el.getBoundingClientRect();

        if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth ||
            document.documentElement.clientWidth) && bounding.bottom <= (window.innerHeight ||
                document.documentElement.clientHeight)) {

            // console.log('Element is in the viewport!', el);
            return true;
        } else {
            // console.log('Element is NOT in the viewport!', el);
        }
        return false;
    }

    //
    // exactMatch will effect text compare
    function getElementsByClassesAndContent(classArray, exactMatch, matchAll, text) {
        return textMatch(classesMatch(classArray, exactMatch, matchAll), exactMatch, text);
    }
    ///////

    var bookMarkBarDiv = document.createElement("div");
    bookMarkBarDiv.setAttribute("style", "background-color: #eeeeed;color:#1ABC9C;font-size:16px;position:relative;text-align: center;");
    bookMarkBarDiv.setAttribute("id", "hintDiv");
    bookMarkBarDiv.innerHTML = "<span id='leftReset' style='background-color:#77dce4;font-size:16px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style='background-color: #eeeeed;'>&nbsp;&nbsp;&nbsp;&nbsp;</span><span id='hintText'>00/00/0000, 00:00:00</span><span style='background-color: #eeeeed;'>&nbsp;&nbsp;&nbsp;&nbsp;</span><span id='rightReset' style='background-color:#7bd198;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";

    function delBookHref(params) {

        // console.log("scrolling", window.pageYOffset + 'px');
        var elArr = getElementsByClassesAndContent(["nowrap"], true, true, "删除");
        // console.log("删除:");
        // console.dir(elArr);
        // innerText: "删除"
        // debugger;
        var count = 0;
        for (let index = 0; index < elArr.length; index++) {
            // console.log("删除:", index);
            // console.dir(elArr[index]);
            // console.dir(elArr[index].href);
            if (elArr[index].href == undefined) {
                continue;
            }
            if (elArr[index].done == "true") {
                continue;
            }
            if (elArr[index].innerText == "删除") {
                // innerHTML: "\n                <a href=\"javascript:if(confirm('确实要将本书移出书架么？')) document.location='/delbookcase/106431.php';\" target=\"_blank\">删除</a>\n 
                var text = elArr[index].href.split("/"); //decodeURIComponent(elArr[index].href).split("(")[1].split(")")[0];
                text = text[text.length - 1];
                text = replaceAll(text, "'", "");
                text = replaceAll(text, ",", "");
                text = replaceAll(text, ";", "");
                count++;
                if (count < 10) {
                    count = "0" + count
                }
                console.log("set del mark done:", count, text);

                elArr[index].href = "/delbookcase/" + text;
                elArr[index].target = "_top";
                elArr[index].done = "true";
            }
        }

    }

    var previewIframe = document.createElement("IFRAME");
    previewIframe.setAttribute("style", "width: 500px;height: 800px;");

    var previewDiv = document.createElement("div");
    previewDiv.setAttribute("style", "width: 510px;background-color: #eeeeed;color:#1ABC9C;font-size:16px;position:absolute;text-align: center;");
    previewDiv.setAttribute("id", "previewDiv");
    previewDiv.style.display = "none";
    previewDiv.appendChild(previewIframe);
    function previewBooks(params) {

        var elArr = document.getElementsByTagName("a");

        // console.log("href:");
        // console.dir(elArr);

        var count = 0;
        for (let index = 0; index < elArr.length; index++) {
            // console.log("href:", index);
            // console.dir(elArr[index]);
            // console.dir(elArr[index].href);
            if (elArr[index].href == undefined) {
                continue;
            }
            if (typeof elArr[index].href.indexOf !== "function") {
                console.log("elArr[index].href, indexOf not a function:", elArr[index].href.indexOf);
                console.dir(elArr[index].href.indexOf);
                console.dir(elArr[index].href);
                console.dir(elArr[index]);
                continue
            }
            // console.log(window.location.hostname, elArr[index].href);
            // console.dir(elArr[index].href.indexOf(window.location.hostname));
            // console.dir(elArr[index].href.indexOf(".html"));
            // console.log(elArr[index].href.length - elArr[index].href.indexOf(".html"))

            if (elArr[index].href.indexOf("/list/") > 0 || elArr[index].href.indexOf("/book/") > 0) {
                continue
            }

            if (elArr[index].done == "true") {
                continue;
            }
            if (elArr[index].href.indexOf(window.location.hostname) > 0 && (elArr[index].href.length - elArr[index].href.indexOf(".html") == 5)) {
                elArr[index].done = true;

                console.log("hover, href:", index);
                console.dir(elArr[index]);
                console.dir(elArr[index].href);
                elArr[index].onmouseover = function (e) {
                    //Hovering
                    console.log("Hovering, href:", this.href);
                    console.dir(this)

                    previewDiv.firstChild.remove();

                    previewDiv.style.display = "flex";

                    //set left and top of div based on mouse position
                    // previewDiv.style.left = e.clientX + 10 + "px";
                    previewDiv.style.left = "10px";
                    previewDiv.style.top = e.clientY + 50 + "px";

                    previewDiv.style.height = (document.documentElement.clientHeight - e.clientY - 50) + "px";

                    previewIframe.setAttribute("src", this.href);

                    previewDiv.appendChild(previewIframe);

                    console.dir(e)
                    console.dir(document.documentElement)
                    console.dir(document.documentElement.clientHeight)
                    console.dir(e.clientY)

                    console.dir(previewIframe)
                    console.dir(previewDiv)
                }
                elArr[index].onmouseleave = function (ev) {
                    //Leave hovering
                    console.log("Leave hovering, href:", this.href);
                    previewDiv.style.display = "none";
                }
            }
        }
    }

    async function doCheck(url, el) {
        let response = await fetch(url);
        let data = await response.text();
        data = data + "<!-- checked -->";
        if (data.indexOf("正在手打中") > 0) {
            el.innerText = el.innerText + "[P]"
        } else {
            el.innerText = el.innerText + "[D]"
        }
        // console.log(data);
        // console.dir(el);
    }

    function checkBooks(params) {

        var elArr = document.getElementsByTagName("a");

        // console.log("href:");
        // console.dir(elArr);

        var count = 0;
        for (let index = 0; index < elArr.length; index++) {
            // console.log("href:", index);
            // console.dir(elArr[index]);
            // console.dir(elArr[index].href);
            if (elArr[index].href == undefined) {
                continue;
            }
            if (typeof elArr[index].href.indexOf !== "function") {
                console.log("elArr[index].href, indexOf not a function:", elArr[index].href.indexOf);
                console.dir(elArr[index].href.indexOf);
                console.dir(elArr[index].href);
                console.dir(elArr[index]);
                continue
            }
            // console.log(window.location.hostname, elArr[index].href);
            // console.dir(elArr[index].href.indexOf(window.location.hostname));
            // console.dir(elArr[index].href.indexOf(".html"));
            // console.log(elArr[index].href.length - elArr[index].href.indexOf(".html"))

            if (elArr[index].href.indexOf("/list/") > 0 || elArr[index].href.indexOf("/book/") > 0) {
                continue
            }

            if (elArr[index].done == "true") {
                continue;
            }
            if (elArr[index].href.indexOf(window.location.hostname) > 0 && (elArr[index].href.length - elArr[index].href.indexOf(".html") == 5)) {
                elArr[index].done = true;

                console.log("check, href:", index);
                console.dir(elArr[index]);
                console.dir(elArr[index].href);

                doCheck(elArr[index].href, elArr[index])

            }
        }
    }


    /*
      Displays a notification with the current time. Requires "notifications"
      permission in the manifest file (or calling
      "Notification.requestPermission" beforehand).
    */
    function show(msg, timeout) {
        var time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
        var hour = time[1] % 12 || 12; // The prettyprinted hour.
        var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.

        if (timeout == "") {
            timeout = 2000;
        }
        var notificationHandle = new Notification(
            hour + time[2] + ' ' + period, {
            icon: 'assets/icon-large.png',
            body: msg,
            tag: "bgNotify"
        }
        );

        // hide notification after timeout ms
        setTimeout(notificationHandle.close.bind(notificationHandle), timeout);

    }

    function handleStateChange(e) {
        if (this.readyState == 4 && this.status == 200) {
            console.log(targetUrl + " requested", 2000);
        } else if (this.status != 0 && this.status != 200) {
            var msg = "XMLHttpRequest " + targetUrl + " failed: readyState=" + this.readyState + ", this.status=" + this.status;
            console.log(msg);
            show(msg, 5000);
        }
    }

    var bookmarkDone = false;
    function pageMangle(params) {
        if (addressText.indexOf("/bookcase.php") > 0 || addressText.indexOf("/user.php") > 0) {
            return
        }

        // console.log("scrolling", window.pageYOffset + 'px');
        var elArr = classesMatch(["btn btn-info"], true, true);
        for (let index = 0; index < elArr.length; index++) {
            // console.log("elArr[index].innerText:", elArr[index].innerText)
            // console.log("elArr[index].href.indexOf.html:", elArr[index].href.indexOf(".html"))
            if (elArr[index].innerText == "下一篇" && elArr[index].href.indexOf(".html") >= 0) {
                console.log("loading next page:", elArr[index].href)
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = handleStateChange;
                xhr.open("GET", elArr[index].href, true);
                xhr.send();
                break;
            }
        }
        // console.log("buttons:");
        // console.dir(elArr);
        // innerText: "加入书签"
        for (let index = 0; index < elArr.length; index++) {
            if (elArr[index].innerText == "加入书签" && bookmarkDone == false) {
                var text = decodeURIComponent(elArr[index].href).split("(")[1].split(")")[0];
                text = replaceAll(text, "'", "");
                text = replaceAll(text, ",", "-");
                console.log("book mark ok:", text);
                elArr[index].click();

                bookmarkDone = true;
                //
                // col-md-12
                // pager
                var pager = classesMatch(["pager"], true, true);
                if (pager.length > 0) {
                    var pNode = pager[0].parentNode; // nav
                    var tl = document.getElementById("hintDiv");
                    // debugger;
                    if (tl == undefined || tl == null) {
                        // console.log("hintDiv: not present");
                    } else {
                        // console.log("hintDiv: removed", tl);
                        tl.remove();
                    }
                    pNode.appendChild(bookMarkBarDiv);
                    document.getElementById("hintText").innerText = text;
                } else {
                    console.log("error: pager not found");
                }

                // panel-heading
                var headBars = classesMatch(["panel-heading"], true, true);

                for (let index = 0; index < headBars.length; index++) {
                    const element = headBars[index];
                    if (index == 0) {
                        element.innerText = text;
                    } else {
                        element.remove();
                    }
                }

                //
                classesMatch(["panel-body panel-recommand", "navbar navbar-default navbar-fixed-top"], true, true).forEach(element => {
                    element.remove();
                });

                break;
            }
        }
    }
    var documentReady = false;
    var clearIntervalID = -1
    function readyGo(txt) {
        console.log("readyGo:", txt)
        if (firstLoad) {
            firstLoad = false;
        } else {
            return;
        }

        // setup scroll listener
        window.addEventListener('scroll', function () {
            // console.log("scrolling ...")
            pageMangle()
        });

        // replace "删除"

        if (addressText.indexOf("/bookcase.php") > 0) {
            delBookHref();
            // previewBooks();
            // // put at first
            // document.body.insertBefore(previewDiv, document.body.firstChild);
            // 正在手打中
            checkBooks();
        } else {
            //
            classesMatch(["panel-body panel-recommand", "navbar navbar-default navbar-fixed-top"], true, true).forEach(element => {
                element.remove();
            });
        }

        clearChildNodes()

        if (clearIntervalID !== -1) {
            clearIntervalID(clearIntervalID)
        }
        clearIntervalID = setInterval(() => {
            clearChildNodes();
        }, 100);
    }

    // https://wenku.baidu.com/view/1f5337cb132de2bd960590c69ec3d5bbfd0adadc.html
    window.addEventListener('load', function (event) {
        // 根据上面制定的结构来解析iframe内部发回来的数据
        // console.log("event, windows loaded: ");
        // console.dir(event);
        documentReady = true;
        readyGo("lwsxtxt, event");
    });

    // libs

    function isRemovingPrefix(param) {
        for (let index = 0; index < toRemoveList.length; index++) {
            const txtId = param + "";
            if (txtId.indexOf(toRemoveList[index]) == 0) { // start by top_
                return true
            }
        }
        return false
    }

    //
    var firstLoad = true;

    readyGo("lwsxtxt, script");

})();