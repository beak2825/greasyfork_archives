// ==UserScript==
// @name         get-magnet
// @namespace    http://tampermonkey.net/
// @version      0.38.4
// @description  query the web pages all magnet link
// @author       You
// @match        https://fc2club.top/
// @match http://*/*
// @match https://*/*
// @license GPL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc2club.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476575/get-magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/476575/get-magnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.querySelectorAll('a');
    for (var i = 0,
         l = links.length; i < l; i++) {
        links[i].href = links[i].href.replace("https://btsow.quest", "https://btsow.motorcycles")
    }
    if (self != top) {
        return
    }
    var arr = [(parseInt(Math.random() * 64 + 192)).toString(16), (parseInt(Math.random() * 64 + 192)).toString(16), (parseInt(Math.random() * 66 + 33)).toString(16)];
    arr.sort(function() {
        return Math.random() - 0.5
    });
    var bgdiv = "#" + arr[0] + arr[1] + arr[2];
    var oldColor = '0x' + bgdiv.replace(/#/g, '');
    let str = '000000' + (0xFFFFFF - oldColor).toString(16);
    var tgdiv = '#' + str.substring(str.length - 6, str.length);
    var orstr = "<img src='data:image/gif;base64,R0lGODlhEgAQAOeiAFwVF2cWF2QYGYEdHYIeHnsmJ3ctOQpJggtRjC1LgQ5Uj0NHaj9HeQtVlC9Oew1Yl6EzNAddlQ9bnA1cn6w0NAtdoQtfl641NlBQUQtfpQxfpLM2NlJSU7g3N7Y4NxlgoYBISLo4OLs4OZpBVAVpo7s6OlhYWFpaWn9Ocb5BQbxDQoZTU2FhYaxMTKFQUGNjY8JJSWRkZKlRUpVXVgF8wcJLSsFMS2ZmZiR1s6ZVVatUVQN/wwN/xMROTktukIZgYDtzpWpqagCDywGDy0B0lwKDzHlnZq5YWL5UVV5uiZtgYGtucm5ubkl5nnJxcXNzcxWJzlJ8k7phYHZ2dhuLznd3d9BeXcFkZHl5eSKNzXp6ent6ent7eyaQ0H19fY94echoaDiOvX5+fiqU1IGBgYCCg4KCgoODg4SEhHmGmTmWyjCY1oWFhdZuboaGhtlycZCKioyMjJqKio+Pj5KSkoqUm4mWnMKHhpSVl5mUlNyBgNuCgpeXl5mZmZqamp2cnZydoJ6enqCgoKKioqSkpKWkpKampuGXl6urq6ysrLCwsLGxsbW1tba2tre3t7i4uLm5ubu7u76+vr+/vsHBwcXFxcjIyMnKysrKys3Nzc/Pz9fX19nZ2dvb297e3uDg4OHh4ePj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAASABAAAAj+AP8JHCjwSRk7ddBQIshwCZEwWdZ0ocJjARxMDP9FUTNmiJCPNFB42ACCEcEmUD6qxDEihMseKzwJ9FHk4w4SFhwY6OAyRAkkcf4R+pMGSAQEGjIwGFCgZwgrRv754aKIw4cKEzIkIBBAhEsYLb4kEiRoCgYNCiQ0OEBAgNcaKnTIGUSHTYwTD5LgieMEAIQQKWy4OESoTx8yN0wAEthoTh4lFyjI2HNHkaE4WF4E+kdHi6A4iRRtudJGzw+BN4JUEcjCTaJFfiJlAiMlhyWBoM5AQs1HzKBQnya9OVIoo0Avfvo84qTp0gxJxgUuYmLGUCdHbDZFJ4joDJ1KGQMBAgA7'>";
    var nrstr = "<img src='data:image/gif;base64,R0lGODlhEgAQAOekAAlGVghMXQdNYQZecABgegBhe19QECdebVpTRGBVLGNUNFtWPGhWFWtZF21bFFtbW3BdFnRgGDtqdnleIgR5kXZiFntgJHdjFGNjY3hkFHllE3llFGVlZXplIAKBnAKCnUVyfGpqagGGo4hnKwGIpQCJplpydQ6Ikzt7jQCLqW5ubiKDkRGIlQCMqTR/h29vbxCJmnBwcACPqgiOmROLmINuVgCQrHJycmh1eVd7f3ZzcXR0dHt0ZACVrnZ2dgCWrwKWqJFxVI5zS3Z3dwCYsZV0OgqZpZZ4W595MJd4ZX5+fl+GlROeqqN8MqN8M4GBgQCluQaksHSIi4OEhYSEhKiAMqiAM4WFhYeFhIeHhwCvvImJiYqKirCFPrGGQoyMjI2NjbWHSLWGWo6Ojg6ywJeOhJCQkLeKS42Rk5GRkZKTkpOTk72NT4mYmb+OXJeXl6CWkZiYmJmYl8KRVZmZmaSXkp2dnZ6enmWvs0K6xaKhoJ6io0m6xaSkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrLGxsbKysmvHzbOzs7W1tba2tri4uLm5ubq6ury8vL29vb6+vsHBwcTExMbGxsjIyMrKysrKy8zMzM/Q0NXV1dfX19vb29zc3OPj4+Tk5Obm5ujo6O3t7fDw8P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAASABAAAAj+AP8JHChwCJY6cLhUIshQRxAxYeac8dIEAZpMDP8lccPGiscqSEyQECEBEsEjXTyqLIIihUsiIDwJrFHFo5MRFhQcKOEyRQsgav4NClRGyAQGGTQsIDCgZwooOP75ufLoQYcLFTQkKCCgZw8YUg4VKvTkwYYGERwYKBDA5Q8ZNNoIsmMmBgcIPOSs8QGAQgobPVYg+nPnz5cbGPQIdERnz5IPHljwwaOIUBwqL/r8u1zoDSNIU5hoyZNDoIodSgSGSNMokh9Km6IYOYFJIKgtkQTG6LOl0ChRl8jMCJRRIBVAfyZ94qTJhaTiAhftGGMolCQwnaATTJTljaWMAQEAOw=='>";
    var divObj = document.createElement("div");
    divObj.id = "magbtn";
    divObj.style.position = "fixed";
    divObj.style.right = "1%";
    divObj.style.top = "95%";
    divObj.style.width = "20px";
    divObj.style.height = "20px";
    divObj.style.lineHeight = "20px";
    divObj.style.margin = "auto";
    divObj.style.borderRadius = "8px";
    divObj.style.zIndex = "1888";
    divObj.style.boxShadow = "0px 0px 8px 8px " + tgdiv;
    divObj.style.backgroundColor = bgdiv;
    divObj.style.color = tgdiv;
    document.body.appendChild(divObj);
    document.getElementById("magbtn").innerHTML = orstr;
    function getmag() {
        if (self != top) {
            return
        }
        if (document.getElementById("showmagnet")) {
            copy2brd();
            return
        }
        var divObj = document.createElement("div");
        divObj.id = "showmagnet";
        divObj.style.position = "fixed";
        divObj.style.left = "25%";
        divObj.style.top = "75px";
        divObj.style.textAlign = "center";
        divObj.style.width = "50%";
        divObj.style.margin = "auto";
        divObj.style.zIndex = "999";
        divObj.style.background = "#" + ("00000" + (Math.random() * 0x1000000 << 0).toString(16)).substr( - 6);
        divObj.style.display = "block";
        divObj.style.whiteSpace = "nowrap";
        divObj.style.boxShadow = "0px 0px 8px 8px #" + ("00000" + (Math.random() * 0x1000000 << 0).toString(16)).substr( - 6);
        divObj.style.borderRadius = "10px";
        divObj.addEventListener("dblclick",
                                function() {
            this.remove()
        });
        document.body.appendChild(divObj);
        try {
            var links = document.querySelector("body").innerHTML.match(/[0-9a-fA-F]{40}/g);
            links = links.sort();
            var tarstr = "magnet:?xt=urn:btih:" + links[0].toUpperCase() + "<br>";
            var textrows = 1;
            for (var i = 1,
                 l = links.length; i < l; i++) {
                if (links[i].toUpperCase() !== links[i - 1].toUpperCase() && links[i].toUpperCase() !== "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
                    tarstr += "magnet:?xt=urn:btih:" + links[i].toUpperCase() + "<br>";
                    textrows++
                }
            }
            document.getElementById("showmagnet").innerHTML = tarstr;
            textrows++;
            tarstr = "<button class='btn' id='clipbrdbtn'>复制到剪贴板</button ><br><textarea id = 'clipboard'  cols='64' rows='" + textrows + "' >" + document.getElementById("showmagnet").innerText + "</textarea>";
            document.getElementById("magbtn").innerHTML = nrstr
        } catch(e) {
            tarstr = "<button class='btn' id='clipbrdbtn'>点击这里关闭</button ><br><textarea id = 'clipboard'  cols='64' rows='2' >没有找到磁力链</textarea>";
            document.getElementById("magbtn").innerHTML = nrstr
        }
        document.getElementById("showmagnet").innerHTML = tarstr;
        document.getElementById("clipbrdbtn").addEventListener("click",
                                                               function() {
            copy2brd()
        })
    }
    function copy2brd() {
        var text = document.getElementById("clipboard").value;
        if (text !== "没有找到磁力链") {
            if (navigator.clipboard) {
                if (navigator.clipboard.writeText(text)) {
                    document.getElementById("clipboard").value = ""
                }
            } else {
                document.getElementById("clipboard").select();
                document.execCommand("cut", true)
            }
            document.getElementById("showmagnet").remove();
            document.getElementById("magbtn").innerHTML = orstr
        } else {
            document.getElementById("showmagnet").remove();
            document.getElementById("magbtn").innerHTML = orstr
        }
    }
    document.getElementById("magbtn").addEventListener("mousedown",
                                                       function() {
        var Drag = document.getElementById(this.id);
        Drag.onmousedown = function(event) {
            Drag.style.userSelect = "none";
            var ev = event || window.event;
            event.stopPropagation();
            var disX = ev.clientX - Drag.offsetLeft;
            var disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = function(event) {
                var ev = event || window.event;
                Drag.style.left = ev.clientX - disX + "px";
                Drag.style.top = ev.clientY - disY + "px";
                Drag.style.cursor = "move"
            }
        };
        Drag.onmouseup = function() {
            document.onmousemove = null;
            this.style.cursor = "default";
            Drag.style.userSelect = "";
            return false
        }
    });
    document.getElementById("magbtn").addEventListener("click",
                                                       function() {
        getmag()
    });
    document.getElementById("magbtn").addEventListener("mouseover",
                                                       function() {
        document.getElementById("magbtn").style.backgroundColor = tgdiv;
        document.getElementById("magbtn").style.color = bgdiv;
        document.getElementById("magbtn").style.boxShadow = "0px 0px 8px 8px " + bgdiv;
        document.getElementById("magbtn").style.fontWeight = "bold";
        document.getElementById("magbtn").style.cursor = "pointer"
    });
    document.getElementById("magbtn").addEventListener("mouseout",
                                                       function() {
        document.getElementById("magbtn").style.backgroundColor = bgdiv;
        document.getElementById("magbtn").style.color = tgdiv;
        document.getElementById("magbtn").style.boxShadow = "0px 0px 8px 8px " + tgdiv;
        document.getElementById("magbtn").style.fontWeight = ""
    })
})();