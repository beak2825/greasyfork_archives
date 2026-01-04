// ==UserScript==
// @name         v2新帖挂件
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  v2右侧挂件，展示最近发表的帖子
// @author       HeyWeGo
// @match         *://*.v2ex.com/*
// @icon         https://www.v2ex.com/static/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448472/v2%E6%96%B0%E5%B8%96%E6%8C%82%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448472/v2%E6%96%B0%E5%B8%96%E6%8C%82%E4%BB%B6.meta.js
// ==/UserScript==

(function() {

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }


    function htmlToElements(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes;
    }

    let div_wrap = htmlToElements('<div class="box" id="sb_v2" style="position:relative;max-height:500px;overflow-x:hidden;overflow-y:scroll"><div id="new_head" class="cell" style="background: var(--box-background-color);top: 0;position: sticky;z-index: 999;margin-bottom:14px;"><span class="fade" >最近发布主题</span><span><a class="fade refresh_new" style="margin-left:9px;color:var(--link-color);cursor:pointer">刷新</a></span></div></div>')
    let list_wrap = div_wrap[0];
    let refresh_new_btn = list_wrap.getElementsByClassName("refresh_new")[0];
    // let auto_refresh = list_wrap.getElementsByClassName("autorefresh")[0];
    var loop;

    let widget_target = document.getElementById("Rightbar").getElementsByClassName("box")[0];
    widget_target.append(list_wrap)

    let from_refresh = false;

    refresh_new_btn.addEventListener("click",function(){
          from_refresh = true;
              console.log("刷新列表")
        let el = document.createElement("div")
            el.id = "loading_frame"
            el.innerHTML = "loading";
            el.style="height:3000px;position: absolute;background: #ffffffd6;width: 100%;vertical-align: middle;z-index: 999;top:47px;padding-top:200px;"
            list_wrap.appendChild(el)

        new_widget();

    })


    function frag_generate(in_titles,in_links){
            let frag = document.createDocumentFragment();
            let element = document.createElement('div');
            element.id = 'new_list'
            for (let index = 1; index < in_titles.length; index++) {
                var nodeText;
                var puretitle = in_titles[index].textContent.replace(/^\[.*?\]/,'');

                nodeText = in_titles[index].textContent.match(/^\[.*?\]/)[0];

                let tr_head = '<div class="cell" style="position:relative"><table cellpadding="0" cellspacing="0" border="0" width="100%"> <tbody><tr><td class="topic_type" width="24" valign="middle" align="center" style="color: var(--color-fade);padding: 0 13px;white-space: nowrap;min-width: 66px;position: absolute;transform: scale(0.8);top: -12px;right: 4px;background: var(--box-background-color);">'
                let tr_head_wrap = tr_head + nodeText + '</td><td width="10"></td><td width="auto" valign="middle"><span class="item_rss_new_topic_title"><a style="text-overflow: -o-ellipsis-lastline;overflow: hidden;text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2;-webkit-box-orient: vertical; " target="_blank" href="';
                let row_string = tr_head_wrap + in_links[index+1].getAttribute('href') + '">' + puretitle +'</a></span></td></tr></tbody></table></div>'
                element.appendChild(htmlToElements(row_string)[0]);
            }
                return frag.appendChild(element);
        }



    function new_widget(){

        GM_xmlhttpRequest({
        url: "https://www.v2ex.com/index.xml",
        method :"GET",
        onload:function(xhr){
            console.log(xhr.responseText);
            var   data = xhr.responseText
            let xmlDoc = new DOMParser().parseFromString(data, "text/xml");
            let titles=xmlDoc.getElementsByTagName('title')
            let links=xmlDoc.getElementsByTagName('link')
            console.log("请求成功")

            let el = document.getElementById("new_list")
            if(!!el === true){
                el.remove();
            }
            list_wrap.append(frag_generate(titles,links));

            if(from_refresh === true){
                document.getElementById("loading_frame").remove();
                 from_refresh = false;
            }
        }

        })

    }

    new_widget()


    })();