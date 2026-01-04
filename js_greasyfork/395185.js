// ==UserScript==
// @name         json-viewer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  解决和原网页jquery版本冲突
// @description  增加判断，当是访问的json接口地址的时候才初始化json格式化插件到页面
// @description  谷歌浏览器直接打开json格式内容的接口地址，可以格式化显示接口返回值，保留key的双引号,支持图片链接预览
// @author       sgd
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.easyicon.net/api/resizeApi.php?id=501159&size=128
// @downloadURL https://update.greasyfork.org/scripts/395185/json-viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/395185/json-viewer.meta.js
// ==/UserScript==


// 解决和原网页jquery版本冲突
var jq = jQuery.noConflict(true);

// jquery.json-viewer 插件 开始
(function(jq){
    function isCollapsable(arg) {
        return arg instanceof Object && Object.keys(arg).length > 0;
    }
    function isUrl(string) {
        var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(string);
    }
    function json2html(json, options) {
        var html = '';
        if (typeof json === 'string') {
            /* Escape tags */
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (isUrl(json)){
                html += '<a href="' + json + '" class="json-string">"' + json + '"</a>';
            }
            else{
                html += '<span class="json-string">"' + json + '"</span>';
            }
        }
        else if (typeof json === 'number') {
            html += '<span class="json-literal">' + json + '</span>';
        }
        else if (typeof json === 'boolean') {
            html += '<span class="json-literal">' + json + '</span>';
        }
        else if (json === null) {
            html += '<span class="json-literal">null</span>';
        }
        else if (json instanceof Array) {
            if (json.length > 0) {
                html += '[<ol class="json-array">';
                for (var i = 0; i < json.length; ++i) {
                    html += '<li>';
                    /* Add toggle button if item is collapsable */
                    if (isCollapsable(json[i])) {
                        html += '<a href class="json-toggle"></a>';
                    }
                    html += json2html(json[i], options);
                    /* Add comma if item is not last */
                    if (i < json.length - 1) {
                        html += ',';
                    }
                    html += '</li>';
                }
                html += '</ol>]';
            }
            else {
                html += '[]';
            }
        }
        else if (typeof json === 'object') {
            var key_count = Object.keys(json).length;
            if (key_count > 0) {
                html += '{<ul class="json-dict">';
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        html += '<li>';
                        var keyRepr = options.withQuotes ?
                            '<span class="json-string">"' + key + '"</span>' : key;
                        /* Add toggle button if item is collapsable */
                        if (isCollapsable(json[key])) {
                            html += '<a href class="json-toggle">' + keyRepr + '</a>';
                        }
                        else {
                            html += keyRepr;
                        }
                        html += ': ' + json2html(json[key], options);
                        /* Add comma if item is not last */
                        if (--key_count > 0){
                            html += ',';
                        }
                        html += '</li>';
                    }
                }
                html += '</ul>}';
            }
            else {
                html += '{}';
            }
        }
        return html;
    }
    jq.fn.jsonViewer = function(json, options) {
        options = options || {};
        return this.each(function() {

            /* Transform to HTML */
            var html = json2html(json, options);
            if (isCollapsable(json)){
                html = '<a href class="json-toggle"></a>' + html;
            }
            /* Insert HTML in target DOM element */
            jq(this).html(html);

            /* Bind click on toggle buttons */
            jq(this).off('click');
            jq(this).on('click', 'a.json-toggle', function() {
                var target = jq(this).toggleClass('collapsed').siblings('ul.json-dict, ol.json-array');
                target.toggle();
                if (target.is(':visible')) {
                    target.siblings('.json-placeholder').remove();
                }
                else {
                    var count = target.children('li').length;
                    var placeholder = count + (count > 1 ? ' items' : ' item');
                    target.after('<a href class="json-placeholder">' + placeholder + '</a>');
                }
                return false;
            });

            /* Simulate click on toggle button when placeholder is clicked */
            jq(this).on('click', 'a.json-placeholder', function() {
                jq(this).siblings('a.json-toggle').click();
                return false;
            });

            if (options.collapsed == true) {
                /* Trigger click to collapse all nodes */
                jq(this).find('a.json-toggle').click();
            }
        });
    };
})(jq);
// jquery.json-viewer 插件 结束

(function() {
    'use strict';
    // 添加样式
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("body{margin-bottom: 200px;}per{margin:20px;}#btn{position: fixed;top: 20px;right: 20px;background-color: transparent;border: 1px solid rgb(218, 220, 224);border-radius: 4px;box-sizing: border-box;color: rgb(26, 115, 232);cursor: pointer;line-height:30px;}#btn:hover{background-color:rgb(210, 227, 252);}   ul.json-dict, ol.json-array {list-style-type: none;margin: 0 0 0 1px;border-left: 1px dotted #ccc;padding-left: 2em;}.json-string {color: #0B7500;}.json-literal {color: #1A01CC;font-weight: bold;}a.json-toggle {position: relative;color: inherit;text-decoration: none;}a.json-toggle:focus {outline: none;}a.json-toggle:before {color: #aaa;content: \"\\25BC\";position: absolute;display: inline-block;width: 1em;left: -1em;}a.json-toggle.collapsed:before {transform: rotate(-90deg);-ms-transform: rotate(-90deg);-webkit-transform: rotate(-90deg);}a.json-placeholder {color: #aaa;padding: 0 1em;text-decoration: none;} a.json-placeholder:hover { text-decoration: underline; }");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    var source =  jq('pre[style="word-wrap: break-word; white-space: pre-wrap;"]');
    // 根据上面这一点没办法确定是需要添加json格式化工具，再加上对内容进行判断是不是json格式的内容

    // 如果是直接打开的json接口地址才需要格式化插件
    if(source.length > 0 && isJSON(source.first().html())){
        console.log("json-viewer 插件初始化成功");
        source = source.first();
        source.attr("id", "json-source")
        source.hide();
        var src = source.html();// 获取到内容
        // 添加一个格式化显示的per元素
        jq("body").append(jq('<per id="json-renderer"></pre>'))
        console.log(src);
        // 将内容用eval函数处理下
        var input = eval('(' + src + ')');
        // 调用格式化方法，参数：是否收缩所有的节点    是否为Key添加双引号
        jq('#json-renderer').jsonViewer(input, {collapsed: false,withQuotes: true});

        // 添加原文、格式化后内容的切换按钮
        jq("body").append('<input type="button" value="View Source" id="btn"/>');
        jq("body").on("click","#btn",function(){
            var v = jq(this).val();
            if(v=='View Source'){
                jq(this).val("Format Content");
                // 查看原文
                jq('#json-renderer').hide();
                jq('#json-source').show();
            }else{
                jq(this).val("View Source");
                // 格式化
                jq('#json-renderer').show();
                jq('#json-source').hide();
            }
        });

        // 所有a标签，看是否是图片，是图片生成预览图
        jq(document).on("mouseenter mouseleave","a.json-string",function(event){
            if(event.type=='mouseenter'){
                // 移入
                var href = jq(this).attr('href');
                if(isImg(href)){
                    jq("body").append('<div style="display:none; position: absolute;width:300px;height:200px;" class="preview"><img style="width:100%;height:100%;" src="'+ href +'" /></div>');
                    var xPos = parseInt(event.pageX) + "px";
                    var yPos = parseInt(event.pageY) + "px";
                    jq(".preview").css("left", xPos);
                    jq(".preview").css("top", yPos);
                    jq(".preview").show();
                }
            }else{
                // 移除
                jq(".preview").remove();
            }

        });
    }

    /*检查是否是图片链接*/
    function isImg(pathImg) {
        var regexp = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?\/([\w#!:.?+=&%@!\-\/])*\.(gif|jpg|jpeg|png|GIF|JPG|PNG)([\w#!:.?+=&%@!\-\/])?/;
        return regexp.test(pathImg);
    }
    /** 检验内容是否是json格式的内容*/
    function isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }

            } catch(e) {
                console.log('error：'+str+'!!!'+e);
                return false;
            }
        }
        console.log('It is not a string!')
    }


})();