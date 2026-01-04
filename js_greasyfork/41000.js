// ==UserScript==
// @name OverDrive Transcriber
// @description Transcribes books you read on OverDrive for offline reading
// @namespace Violentmonkey Scripts
// @match *://*.overdrive.com/*
// @match *://*.greasyfork.org/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @run-at document-start
// @version 0.1.3
// @author qsniyg
// @downloadURL https://update.greasyfork.org/scripts/41000/OverDrive%20Transcriber.user.js
// @updateURL https://update.greasyfork.org/scripts/41000/OverDrive%20Transcriber.meta.js
// ==/UserScript==

(function() {
    var content_html_regex = /\.x?html?\?cmpt=/;
    var content_html_match = /^(?:.*\/)?([^/.]*)\.x?html?/;
    
    var default_options = {
        images: {
            name: "Include images",
            default: true
        }
    };
    
    var options = {};
    
    var img_requests = 0;
    
    for (var option in default_options) {
        var value = GM_getValue("SETTINGS:" + option);
        if (value !== undefined)
            options[option] = JSON.parse(value);
        else
            options[option] = default_options[option].default;
    }
    
    function onload(f) {
        if (document.readyState === "interactive" || document.readyState === "complete") {
            f();
        } else {
            document.addEventListener("DOMContentLoaded", f, false);
        }
    }
    
    function makebutton(el, bg) {
        el.style.padding = ".5em 1em";
        el.style.background = bg;
        el.style.color = "white";
        el.style.textDecoration = "none";
        el.style.display = "inline-block";
        el.style.margin = ".3em .5em";
    }
    
    var fullurl = function(url, x) {
        return urljoin(url, x);
    };
    
    function urljoin(a, b) {
        var protocol_split = a.split("://");
        var protocol = protocol_split[0];
        var splitted = protocol_split[1].split("/");
        var domain = splitted[0];
        var start = protocol + "://" + domain;

        if (b.length === 0)
            return a;
        if (b.match(/[a-z]*:\/\//))
            return b;
        if (b.length >= 2 && b.slice(0, 2) === "//")
            return protocol + ":" + b;
        if (b.length >= 1 && b.slice(0, 1) === "/")
            return start + b;
        
        if (a.match(/\/$/))
            return a + b.replace(/^\/*/, "");
        else
            return a.replace(/\/[^/]*$/, "/") + b.replace(/^\/*/, "");
    }

    
    // OverDrive section
    function overdrive() {
        var transcribe_btn;
        var transcribed = false;
        
        function parse(url, content) {
            var html = document.createElement("html");
            html.innerHTML = content;

            var url_match = url.match(content_html_match);
            if (!url_match)
                // shouldn't happen
                return;
            //var book_id = url_match[2];
            var book_id = bData["-odread-buid"];
            var var_id = url_match[1];

            var titleel = html.getElementsByTagName("title")[0];
            if (!titleel)
                return;

            var title = titleel.innerHTML;
            /*console.log(book_id);
            console.log(var_id);
            console.log(title);*/

            GM_setValue("TITLE:" + book_id, title.toString());
            GM_setValue("INFO:" + book_id, JSON.stringify(unsafeWindow.bData));

            var setcontents = function(contents) {
                GM_setValue("CONTENTS:" + book_id + ":" + var_id, contents);
                _contents = contents;
            }

            var scripts = html.getElementsByTagName("script");
            var regex = /^ *parent\.[^;(]*\(.*?['"](.*?)['"]/;
            var set = false;
            var _contents;
            for (var i = 0; i < scripts.length; i++) {
                var matchobj = scripts[i].innerHTML.match(regex);
                if (matchobj) {
                    var text = unsafeWindow.atob(matchobj[1]);
                    setcontents(text);
                    set = true;
                }
            }

            if (!set) {
                if (html.querySelectorAll("body > p").length >= 0) {
                    var body = html.getElementsByTagName("body")[0].cloneNode(true);
                    body.removeAttribute("xmlns");
                    body.removeAttribute("onload");
                    setcontents(body.outerHTML);
                }
            }
            
            if (options.images) {
                var doc = document.implementation.createHTMLDocument("preview");
                var newhtml = doc.createElement("html");
                newhtml.innerHTML = _contents;
                /*var parser = new DOMParser();
                var newhtml = parser.parseFromString(_contents, "text/xml");*/
                var images = newhtml.getElementsByTagName("img");
                for (var i = 0; i < images.length; i++) {
                    console.log(images[i]);
                    img_requests++;
                    
                    (function(src) {
                        var full_url = fullurl(document.location.href, url);
                        var newsrc = fullurl(full_url, src);
                        new GM_xmlhttpRequest({
                            method: 'GET',
                            url: newsrc,
                            overrideMimeType: 'text/plain; charset=x-user-defined',
                            headers: {
                                "Origin": document.location.href.replace(/^([a-z]+:\/\/[^/]*).*?$/, "$1"),
                                "Referer": full_url
                            },
                            onload: function (resp) {
                                if (resp.status !== 200 && resp.status !== 304) {
                                    console.dir(resp);
                                    return;
                                }

                                console.log(src);
                                img_requests--;
                                var retval = "";
                                for (var i = 0; i < resp.responseText.length; i++) {
                                    retval += String.fromCharCode(resp.responseText.charCodeAt(i) & 0xff);
                                }
                                GM_setValue("IMAGE:" + book_id + ":" + src.replace(/.*?:\/\/[^/]*\/*/, ""), retval);

                                if (img_requests === 0 && transcribed) {
                                    transcribe_btn.innerHTML = "Done";
                                }
                            }
                        });
                    })(images[i].getAttribute("src"));
                }
            }
        }

        var original_open = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function(method, url) {
            if (!url)
                return;

            if (url.match(content_html_regex)) {
                this.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        parse(url, this.responseText);
                    }
                });
            }
            original_open.apply(this, arguments);
        };

        function run_iframe(iframe) {
            var ifdocument = iframe.contentDocument || iframe.contentWindow.document;
            parse(iframe.src, ifdocument.documentElement.innerHTML)
        }

        function find_iframes() {
            return;
            var iframes = document.getElementsByTagName("iframe");
            for (var i = 0; i < iframes.length; i++) {
                if (iframes[i].src.match(content_html_regex)) {
                    (function(iframes, i) {
                        iframes[i].onload = function() {
                            run_iframe(iframes[i]);
                        }

                        run_iframe(iframes[i]);
                    })(iframes, i);
                }
            }
        }
        
        function transcribe(el) {
            el.innerHTML = "Transcribing...";
            
            var info = unsafeWindow.bData;
            
            var i = 0;
            function do_request() {
                if (i >= info.spine.length) {
                    console.log("Done text");
                    transcribed = true;
                    
                    if (img_requests === 0) {
                        el.innerHTML = "Done";
                    }
                    return;
                }
                
                var path = info.spine[i].path;
                i++;
                console.log(path);
                if (!path.match(content_html_regex)) {
                    console.log("Skipping: " + path);
                    do_request();
                    return;
                }

                var oReq = new XMLHttpRequest();
                oReq.addEventListener("load", do_request);
                oReq.open("GET", path);
                oReq.send();
            }
            
            do_request();
        }

        function start() {
            new MutationObserver(find_iframes).observe(document.documentElement, {
                attributes: true,
                childList: true
            });
            find_iframes();
            
            if (unsafeWindow.bData) {
                var outer_div = document.createElement("div");
                outer_div.style.width = "100%";

                transcribe_btn = document.createElement("a");
                transcribe_btn.innerHTML = "Transcribe";
                transcribe_btn.onclick = function() {
                    transcribe(transcribe_btn);
                };
                transcribe_btn.href = "javascript:void(0)";
                transcribe_btn.style.zIndex = 999999999;
                transcribe_btn.style.position = "absolute";
                makebutton(transcribe_btn, "#1070a0");

                outer_div.appendChild(transcribe_btn);
                document.body.appendChild(outer_div);
            }
        }

        onload(start);
    }
    
    // GreasyFork section
    function greasyfork() {
        function start() {
            var insert = document.getElementById("overdrive-insert");
            
            if (!insert) {
                var addto = document.querySelector(".script-author-description");
                addto.innerHTML = "<div id='overdrive-insert'></div>" + addto.innerHTML;
            
                insert = document.getElementById("overdrive-insert");
            }
            
            insert.innerHTML = "";
            
            var table = document.createElement("table");
            table.style.border = "1px solid black";
            table.style.background = "white";
            table.style.width = "100%";
            
            var preview_iframe = document.createElement("iframe");
            preview_iframe.style.width = "100%";
            preview_iframe.style.display = "block";
            preview_iframe.style.border = "0";
            var preview_tr = document.createElement("tr");
            preview_tr.style.padding = 0;
            preview_tr.style.margin = 0;
            var preview_td = document.createElement("td");
            preview_td.style.padding = 0;
            preview_td.style.margin = 0;
            preview_td.style.borderBottom = "1px solid black";
            preview_td.style.display = "none";
            preview_td.setAttribute("colspan", 10);
            preview_td.appendChild(preview_iframe);
            preview_tr.appendChild(preview_td);
            table.appendChild(preview_tr);
            
            var keys = GM_listValues();
            if (keys.length === 0) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.innerHTML = "<i>No books yet</>";
                tr.appendChild(td);
                table.appendChild(tr);
            }
            
            for (var i = 0; i < keys.length; i++) {
                if (!keys[i].match(/^TITLE:/)) {
                    continue;
                }
                
                (function(key) {
                    var title = GM_getValue(key);
                    var id = key.replace(/.*:/, "");
                    var info = JSON.parse(GM_getValue("INFO:" + id));

                    var tr = document.createElement("tr");
                    tr.style.border = "1px solid black";

                    var name_td = document.createElement("td");
                    name_td.innerHTML = "<b>" + title + "</b>";
                    
                    var html = '<html><head><title>' + title + '</title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body>';
                    var size = 0;
                    var items = {};
                    var images = {};
                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i].indexOf("CONTENTS:" + id + ":") !== 0 &&
                            keys[i].indexOf("IMAGE:" + id + ":") !== 0) {
                            continue;
                        }

                        var contents = GM_getValue(keys[i]);
                        size += contents.length;
                        
                        if (keys[i].indexOf("IMAGE:") === 0) {
                            images[keys[i].replace(/.*:/, "")] = contents;
                            continue;
                        }
                        
                        var element = document.createElement("html");
                        element.innerHTML = '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head>';
                        element.innerHTML += contents;
                        
                        var text = element.getElementsByTagName("body")[0].innerHTML;

                        //html += text;
                        items[keys[i].replace(/.*:/, "")] = text;
                    }
                    
                    var have = 0;
                    var total = 0;
                    for (var i = 0; i < info.spine.length; i++) {
                        if (!info.spine[i].path.match(content_html_regex))
                            continue;
                        total++;
                        var spinematch = info.spine[i].path.match(content_html_match);
                        if (!spinematch)
                            continue;
                        var spineid = spinematch[1];
                        if (spineid in items) {
                            html += items[spineid];
                            have++;
                        } else {
                            console.log("Missing " + spineid);
                        }
                    }
                    html += "</body></html>";
                    
                    if (Object.keys(images).length > 0) {
                        var doc = document.implementation.createHTMLDocument("preview");
                        var htmlel = doc.createElement("html");
                        htmlel.innerHTML = html;
                        var img_els = htmlel.getElementsByTagName("img");
                        for (var i = 0; i < img_els.length; i++) {
                            var src = img_els[i].getAttribute("src");
                            if (src in images) {
                                var ext = src.replace(/.*\.([a-zA-Z]*).*?$/, "$1").toLowerCase();
                                var mime = "image/" + ext;
                                if (ext === "jpg")
                                    mime = "image/jpeg";
                                img_els[i].setAttribute("src", "data:" + mime + ";base64," + btoa(images[src]));
                            }
                        }
                        html = htmlel.innerHTML;
                    }

                    
                    var link = "data:text/html," + encodeURIComponent(html);
                    name_td.innerHTML += "  (" + have + "/" + total + ")";
                    

                    var preview = document.createElement("a");
                    preview.onclick = function() {
                        preview_iframe.src = link;
                        preview_td.style.display = "table-cell";
                    };
                    preview.href = "javascript:void(0)";
                    preview.innerHTML = "Preview";
                    makebutton(preview, "#105210");
                    
                    var download = document.createElement("a");
                    download.href = link;
                    download.setAttribute("download", title + ".html");
                    download.innerHTML = "Download (" + (html.length / 1024).toFixed(1) + "KB)";
                    makebutton(download, "#1070a0");
                    
                    var del = document.createElement("a");
                    del.href = "javascript:void(0)";
                    del.onclick = function() {
                        if (!confirm("Delete '" + title + "'?"))
                            return;
                        
                        for (var i = 0; i < keys.length; i++) {
                            if (keys[i] === ("TITLE:" + id) ||
                                keys[i] === ("INFO:" + id) ||
                                keys[i].indexOf("CONTENTS:" + id + ":") >= 0 ||
                                keys[i].indexOf("IMAGE:" + id + ":") >= 0) {
                                console.log(keys[i]);
                                GM_deleteValue(keys[i]);
                            }
                        }
                        
                        start();
                    }
                    del.innerHTML = "Delete (" + (size / 1024).toFixed(1) + "KB)";
                    del.style.float = "right";
                    makebutton(del, "#a02010");
                    
                    var actions_td = document.createElement("td");
                    actions_td.appendChild(preview);
                    actions_td.appendChild(download);
                    actions_td.appendChild(del);
                    
                    tr.appendChild(name_td);
                    tr.appendChild(actions_td);
                    
                    table.appendChild(tr);
                })(keys[i]);
            }
            
            var hr_tr = document.createElement("tr");
            var hr_td = document.createElement("td");
            hr_td.setAttribute("colspan", 10);
            hr_td.style.borderBottom = "1px solid black";
            hr_tr.appendChild(hr_td);
            table.appendChild(hr_tr);
            
            for (var option in default_options) {
                (function(option) {
                    var tr = document.createElement("tr");
                    var name_td = document.createElement("td");
                    name_td.innerHTML = default_options[option].name;
                    tr.appendChild(name_td);
                    
                    var value_td = document.createElement("td");
                    var value_input = document.createElement("input");
                    value_input.type = "checkbox";
                    
                    if (options[option])
                        value_input.setAttribute("checked", "");
                    
                    value_input.onclick = function() {
                        var val = false;
                        if (value_input.checked)
                            val = true;
                        GM_setValue("SETTINGS:" + option, JSON.stringify(val));
                    };
                    
                    value_td.appendChild(value_input);
                    tr.appendChild(value_td);
                    table.appendChild(tr);
                })(option);
            }
            
            insert.appendChild(table);
        }
        
        onload(start);
    }
    
    if (document.location.href.match(/:\/\/[^/]*\.overdrive\.com\//))
        overdrive();
    else if (document.location.href.match(/\/41000-overdrive-transcriber(?:\/?[?#].*)?$/))
        greasyfork();
})();