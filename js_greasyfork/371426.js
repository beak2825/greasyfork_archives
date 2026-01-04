// ==UserScript==
// @name         weibo following backup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  backup weibo following list.
// @author       Raven1996
// @match        *://weibo.com/*
// @match        *://www.weibo.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371426/weibo%20following%20backup.user.js
// @updateURL https://update.greasyfork.org/scripts/371426/weibo%20following%20backup.meta.js
// ==/UserScript==

(function() {
    window.addEventListener("load", function(){
        setTimeout(setUI, 0);
    });

    function setUI() {
        var setting = document.getElementsByClassName("gn_topmenulist_set")[0].children[0];
        var li = document.createElement('li');
        var button = document.createElement('a');
        button.innerText = "备份关注";
        button.onclick = getFollowStart;
        li.append(button);
        setting.insertBefore(li, setting.children[8]);
    }

    function getFollowStart() {
        var urlBase = /[\w:\/.]+weibo.com\/p\/\d+/.exec(document.URL)
        || /[\w:\/.]+weibo.com\/[\w\d]+/.exec(document.URL);
        if (urlBase == null) return;
        urlBase = urlBase[0] + "/";
        var canceled = false;
        var numPage = 1, allPage = 0;
        var back = document.createElement('div');
        document.body.appendChild(back);
        back.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:black; opacity:0.3; z-index:9999;"
        var layer = document.createElement('div');
        layer.className = "W_layer";
        layer.style.cssText = "width:240px; top:50%; left:50%; position:fixed; transform:translate(-50%, -50%);"
        layer.innerHTML = "<div class=\"content\" style=\"padding:16px; box-sizing:border-box;\">"
            + "<span class=\"txt\" style=\"display:inline-block; width:146px;\">获取关注中...</span>"
            + "<a class=\"W_btn_a\" href=\"javascript:void(0);\">取消</a></div>";
        layer.getElementsByTagName("a")[0].onclick = cancelThis;
        document.body.appendChild(layer);
        var followingList = "<html>\n<head><meta charset=\"UTF-8\"><title>Following List</title></head>\n<body>\n";
        GM_xmlhttpRequest({
            method: "GET",
            url: urlBase + "myfollow?t=1&cfs=&Pl_Official_RelationMyfollow__92_page=" + numPage,
            onload: function(response) {
                if (canceled) return;
                var pageHTML = getFollowHTML(response.responseText);
                if (pageHTML.getElementsByClassName("W_pages").length == 0) {
                    cancelThis();
                    return;
                }
                var children = pageHTML.getElementsByClassName("W_pages")[0].children;
                allPage = parseInt(children[children.length - 2].innerText);
                if (numPage <= allPage) {
                    followingList += getFollowing(pageHTML);
                    layer.getElementsByTagName("span")[0].innerText = "获取关注中...("+ Math.round(100.0*numPage/allPage) +"%)";
                    if (numPage < allPage) {
                        numPage++;
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: urlBase + "myfollow?t=1&cfs=&Pl_Official_RelationMyfollow__92_page=" + numPage,
                            onload: nextPageFunction
                        });
                    }
                }
            }
        })

        function cancelThis() {
            canceled = true;
            document.body.removeChild(back);
            document.body.removeChild(layer);
            return false;
        }

        function nextPageFunction(response) {
            if (canceled) return;
            var pageHTML = getFollowHTML(response.responseText);
            followingList += getFollowing(pageHTML);
            layer.getElementsByTagName("span")[0].innerText = "获取关注中...("+ Math.round(100.0*numPage/allPage) +"%)";
            if (numPage < allPage){
                numPage++;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: urlBase + "myfollow?t=1&cfs=&Pl_Official_RelationMyfollow__92_page=" + numPage,
                    onload: nextPageFunction
                });
            }
            else if (numPage == allPage) {
                followingList += "</body>\n</html>";
                var blob = new Blob([followingList], {type: "text/plain"});
                var link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = 'Following List.html'
                link.click();
                cancelThis();
            }
        }
    }

    function getFollowing(pageHTML) {
        var list = "";
        var menbers = pageHTML.getElementsByClassName('member_li');
        for (var index = 0; index < menbers.length; index++) {
            var text = menbers[index].getAttribute("action-data");
            text = text.split("&")
            var name, uid;
            for(var i = 0; i < text.length; i++) {
                var attr = text[i].substr(0, text[i].indexOf("="));
                if (attr == "uid") {
                    uid = text[i].substr(text[i].indexOf("=") + 1);
                }
                else if (attr == "screen_name") {
                    name = text[i].substr(text[i].indexOf("=") + 1);
                }
            }
            var userLink = "https://weibo.com/" + uid;
            list += "<p>"+ name + " <a href=\"" + userLink + "\" target=\"_blank\">" + userLink +"</a></p>\n";
        }
        return list;
    }

    function getFollowHTML(originText) {
        var pageHTML = new DOMParser().parseFromString(originText, "text/html");
        var scripts = pageHTML.getElementsByTagName('script');
        var text;
        for (var index = 0; index < scripts.length; index++) {
            text = scripts[index].innerText;
            if (text.slice(27, 35) == "myFollow"){
                break;
            }
        }
        text = text.slice(text.indexOf("\"html\"") + 8, -3);
        text = text.replace(/\\r\\n/g, "\n");
        text = text.replace(/\\t/g, "\t");
        text = text.replace(/\\([\/\\"'])/g, "$1");
        return new DOMParser().parseFromString(text, "text/html");
    }
})();