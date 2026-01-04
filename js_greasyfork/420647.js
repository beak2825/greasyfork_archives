// ==UserScript==
// @name         downloadURLCollector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  collect magnet and ed2k from mjf2020.com
// @author       piaochen
// @require    https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @match       http://*.mjf2020.com/*
// @grant        GM_setClipboard
// @run-at      document-end

// @downloadURL https://update.greasyfork.org/scripts/420647/downloadURLCollector.user.js
// @updateURL https://update.greasyfork.org/scripts/420647/downloadURLCollector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //初始化按钮
    function initBtns() {
        let btn_div = document.createElement("div");
        let btn_div_x = 10
        let btn_div_y = window.innerHeight - window.innerHeight * 0.2
        btn_div.setAttribute("style", "position:fixed;width:100px;height:60px;left:" + btn_div_x + "px;top:" + btn_div_y + "px;border:solid 0px #2F74A7;");
        //btn_div.setAttribute("style", "position:fixed;width:100px;height:60px;left:10px;top:10px;border:solid 0px #2F74A7;");

        var magnetBtn = document.createElement("input");
        magnetBtn.setAttribute("type", "button");

        magnetBtn.setAttribute("value", "提取magnet");
        magnetBtn.addEventListener("click", collect_magnet);
        btn_div.appendChild(magnetBtn);

        var ed2kBtn = document.createElement("input");
        ed2kBtn.setAttribute("type", "button");

        ed2kBtn.setAttribute("value", "提取ed2k");
        ed2kBtn.addEventListener("click", collect_ed2k);

        btn_div.appendChild(ed2kBtn);
        document.body.appendChild(btn_div);
    }

    //收集magnet url
    function collect_magnet() {
        collect_link('magnet')

    }

    //收集ed2k url
    function collect_ed2k() {
        collect_link('ed2k')
    }

    //展示收集的列表，并进行相关操作
    function show_list(link_list) {
        //如果没有创建才会创建
        if ($('#div_plus_root').length == 0) {
            let div_width = window.innerWidth * 0.8;
            let div_height = window.innerHeight * 0.8;
            let div_x = (window.innerWidth - div_width) / 2;
            let div_y = (window.innerHeight - div_height) / 2;
            //创建弹出窗口
            let div_plus_root = $('<div style="width:200px;height:300px;border:1px solid blue;position:fixed;overflow:scroll;background-color:rgb(255,255,255);" id="div_plus_root">    <span style="float:right;cursor:pointer" id="close_btn">x</span><div id="div_plus_content" style="clear:both;"></div>    </div>').appendTo('body');
            div_plus_root.css({'width': div_width + 'px', 'height': div_height + 'px'});
            div_plus_root.css({'left': div_x + 'px', 'top': div_y + 'px'});
            console.log(div_width, div_height)
            console.log(div_x, div_y)

            //动态加载内容到div中
            if (link_list.length > 0) {
                for (let t in link_list) {
                    let item_name = link_list[t].name;
                    let item_url = link_list[t].url;
                    $('#div_plus_content').append('<input name="div_plus_ck_item" type="checkbox" value=' + item_url + '><label>' + item_name + '</label><br/>');
                }
                $('#div_plus_content').append('<input type="button" id="select_all_btn" value="全选"><input type="button" id="select_reverse_btn" value="反选"><input type="button" id="select_btn" value="确定">');

            } else {
                $('#div_plus_content').append('没有检测到相对应的链接')
            }

            //关闭  JQuery有关闭功能
            $('#close_btn').click(function () {
                $(this).parent().remove();
                //div_plus_root.remove()
            });

            //全选
            $('#select_all_btn').click(function () {
                $("input:checkbox[name='div_plus_ck_item']").each(function () {
                    $(this).attr('checked', true);
                    this.checked = true;
                });
            });

            //反选
            $('#select_reverse_btn').click(function () {
                $("input:checkbox[name='div_plus_ck_item']").each(function () {
                    //$(this).attr("checked",!$(this).attr("checked")); //jQuery方法取复选框的反向值
                    this.checked = !this.checked; //js方法
                });

            });

            //选择
            $('#select_btn').click(function () {
                let result_list = []
                $("input:checkbox[name='div_plus_ck_item']:checked").each(function () {
                    result_list.push($(this).val());
                });
                console.log(result_list.join('\r\n'));
                //复制到剪切板中
                GM_setClipboard(result_list.join('\r\n'), 'text');
                div_plus_root.remove()
                alert(result_list.length + '条链接已经复制到了剪贴板中');
            });
        }
    }

    function collect_link(link_type) {
        console.log('collect_link')
        console.log(link_type);
        var magnet_list = get_link_list(link_type)
        //console.log(magnet_list);
        //GM_setClipboard(magnet_list.join('\r\n'),'text');
        show_list(magnet_list)
    }

    //根据url类别从document中获取链接
    function get_link_list(link_type) {
        let result_list = [];
        let a_list = document.getElementsByTagName("a");

        for (let i = 0; i < a_list.length; i++) {
            let name = a_list[i].text;
            let href = a_list[i].href;
            if (link_type == 'magnet' && href.match(/^(magnet:\?xt=urn:btih:)[0-9a-fA-F]{40}.*$/) || link_type == 'ed2k' && href.startsWith('ed2k')) {
                //console.log(href);
                if (result_list.indexOf(href) < 0) {
                    result_list.push({'name': name, 'url': href})
                }
            }
        }
        return result_list;
    }

    initBtns()

})();