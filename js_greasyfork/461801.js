// ==UserScript==
// @name        豆瓣小组黑名单
// @version      1.1.1
// @description  移除豆瓣小组中黑名单用户的发帖和回帖
// @author       cottonty
// @match        https://www.douban.com/group/*
// @match        https://www.douban.com/people/*
// @grant GM_setValue
// @grant GM_getValue
// @connect  www.douban.com

// @namespace https://greasyfork.org/users/305985
// @downloadURL https://update.greasyfork.org/scripts/461801/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/461801/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

var black_list = GM_getValue("blacklist");//GM_getValue('black_list', undefined);



(function() {
    'use strict';
    $('#group-topics .title a, #content .olt .td-subject a, #content .olt .title a').each((i, e) => {
      $(e).attr('target', '_blank');
    })
    var ul = document.getElementsByClassName("global-nav-items")[0].firstElementChild;
    //console.log(ul);
    var li = document.createElement("li");
    li.onclick = function() {
        black_list = new Set();
        get_blacklist() };
    var a = document.createElement('a');
    var linkText = document.createTextNode("刷新黑名单用户");
    a.appendChild(linkText);
    a.title = "刷新黑名单用户";
    a.href = "javascript:void(0);";
    li.appendChild(a);
    ul.appendChild(li);

    var apiURL = "https://www.douban.com/contacts/blacklist";

    var next = "";
    var re = /\?(.*)/i;
    //console.log(black_list);
    if(black_list === undefined){
        black_list = new Set();
        get_blacklist();
    }
    else{
        black_list = new Set(JSON.parse(black_list));
        process_Response(black_list)
    }
    function get_blacklist(){
        var request = new XMLHttpRequest();
        request.open("GET", apiURL+next);
        //console.log('test');
        request.onload = function(){
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200){
                var black_list_doc = new DOMParser().parseFromString(request.response, "text/html");
                var black_list_name = black_list_doc.getElementsByClassName("obss namel")[0].firstElementChild
                while(black_list_name != null)
                {
                    //console.log(black_list_name);
                    black_list.add(black_list_name.firstElementChild.firstElementChild.firstElementChild.href)
                    console.log(black_list);
                    black_list_name = black_list_name.nextElementSibling
                    if(black_list_name.nextElementSibling == null){
                        break;
                    }
                }
                var nextelem = black_list_doc.getElementsByClassName("next")[0];
                //console.log(nextelem)
                if(nextelem){
                    var matches = nextelem.firstElementChild.href.match(re);
                    //console.log(matches);
                    next = matches[0];
                    //console.log(next);
                    get_blacklist();
                }
                else{
                    GM_setValue("blacklist", JSON.stringify(Array.from(black_list)))
                    process_Response(black_list)
                };
            };
        }
        request.send();
    };

    function process_Response(blk){
    	var windowUrl = window.location.href;
        var topicre = /https:\/\/www.douban.com\/group\/topic\/*/;
        var groupre = /https:\/\/www.douban.com\/group\/*/;
        if( windowUrl.match(topicre)){
            //console.log(window.location.href);
            Array.from(document.getElementsByClassName("clearfix comment-item reply-item ")).forEach(
                function(element, index, array) {
                    // do stuff
                    if(element.childNodes[1].childNodes[1] && blk.has(element.childNodes[1].childNodes[1].href)){
                        element.style.display='none';
                    }
                }
            );

            Array.from(document.getElementsByClassName("reply-quote-content")).forEach(
                function(element, index, array) {
                    // do stuff
                    //console.log(element)
                    //console.log(element.childNodes[7].firstElementChild.href)
                    if(element.childNodes[7].firstElementChild && blk.has(element.childNodes[7].firstElementChild.href)){
                        element.style.display='none';
                    }
                }
            );

        }
        else if( windowUrl.match(groupre) ){
            Array.from(document.getElementsByTagName("tr")).forEach(
                function(element, index, array) {
                    if(element.childNodes[3] && element.childNodes[3].firstElementChild && blk.has(element.childNodes[3].firstElementChild.href)){
                        element.style.display = 'none';
                    }

                }
            );
        }
        else{
            const open = XMLHttpRequest.prototype.open;

		    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
		    	console.log(url)
		        if (url == "/j/contact/unban"){
					black_list.delete(windowUrl)
					GM_setValue("blacklist", JSON.stringify(Array.from(black_list)))
				}
				else if(url == "/j/contact/addtoblacklist"){
					black_list.add(windowUrl)
					GM_setValue("blacklist", JSON.stringify(Array.from(black_list)))
				}
		        return open.call(this, method, url, ...rest);
		    };

        }
    };

})();