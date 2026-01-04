// ==UserScript==
// @name        tagDuplicator-自动填充
// @namespace   tagDuplicator-自动填充
// @description   Duplicate tags for translated galleries from original galleries
// @include     https://exhentai.org/g/*
// @include     https://e-hentai.org/g/*
// @version     0.0.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/511654/tagDuplicator-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/511654/tagDuplicator-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==
/**
 * Created by atashiyuki on 2017/2/27.
 */

var exclude_namespaces=[
    "language",
    "reclass",
];

var prompt_map={
    "zh-CN":"请输入要导入tag的画廊地址",
    "en-US":"please input the link of the gallery you want to import tags from",
    "default":"please input the link of the gallery you want to import tags from",
};

var confirm_map={
    "zh-CN":"两个画廊看起来并不像同一个作品的说...即使如此仍然想要导入tag吗？",
    "en-US":"the two galleries are not likely to be the same piece, still want to import tags?",
    "default":"the two galleries are not likely to be the same piece, still want to import tags?",
}

var wrong_url_map={
    "zh-CN":"请输入从\"https\"开始的完整的画廊链接",
    "en-US":"please input the complete gallery link, from \"https\"",
    "default":"please input the complete gallery link, from \"https\"",
}

function get_text_in_local_language(map){
    var user_language = navigator.language || navigator.userLanguage;
    var text=map[user_language];
    if(text==undefined)
        text=map.default;
    return text;
}

function get_source_sync(url){
    var req=new XMLHttpRequest();
    req.open('GET',url,false);
    req.send();
    return req.response;
}

function get_source_async(url,call_back){
    var req=new XMLHttpRequest();
    req.open('GET',url,true);
    req.onreadystatechange=function(){
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200)
            call_back(req.response);
    };
    req.send();
}

function check_gallery(current_source, target_source) {
    var regexp="\\<h1 id=\"gd4\"\\>(.+?)\\[(.+?)\\](.+?)\\[.+?\\</h1\\>";
    var result_current=current_source.match(regexp);
    var result_target=target_source.match(regexp);
    var diff=0;

    if(result_current==result_target)
        return false;
    for(let i=1;i<4;++i){
        if((""+result_current[i]).trim()!=(""+result_target[i]).trim())
            diff+=1;
    }

    return diff<=1;
}

function parse_tags(source_text) {
    var ret={};
    var regexp=/(?<=return toggle_tagmenu\(\d+,')(.+?)(?=',.+\))/g;
    var result;
    while(result=regexp.exec(source_text)){
        var namespace_tag=result[1].split(':');
        if(namespace_tag.length==1){
            namespace_tag=["misc",namespace_tag[0]];
        }
        // do not add excluded namespaces
        if(exclude_namespaces.includes(namespace_tag[0]))
            continue;

        if(ret[namespace_tag[0]]==undefined)
            ret[namespace_tag[0]]=[];
        ret[namespace_tag[0]].push(namespace_tag[1]);
    }
    return ret;
}

function fill_tag_field(tags){
    var field=document.getElementById('newtagfield');
    var text="";
    for(let namespace in tags){
        for(let tag of tags[namespace]){
            text+=namespace+':'+tag+',';
        }
    }
    field.value=text;

    if(text.length==0)
        field.placeholder="no tags to add...";
}

function subtract_tags(current_tags, tags_to_add) {
    const blacklist = ["extraneous ads", "full censorship", "mosaic censorship", "scanmark", "rough translation"];
    var ret = {};

    for (let namespace in tags_to_add) {
        // 初始化返回对象中的命名空间
        ret[namespace] = [];

        // 如果当前标签未定义，则直接过滤标签
        if (current_tags[namespace] == undefined) {
            ret[namespace] = tags_to_add[namespace].filter(tag => !blacklist.includes(tag));
            continue;
        }

        // 遍历要添加的标签
        for (let tag of tags_to_add[namespace]) {
            // 检查标签是否在黑名单中
            if (!blacklist.includes(tag)) {
                ret[namespace].push(tag);
                console.log(ret);
            }
        }
    }

    return ret;
}

function make_callbacks(parse,subtract,fill) {
    var current_finished_getting=false;
    var current_source="";
    var target_finished_getting=false;
    var target_source="";

    var action=function() {
        if(current_finished_getting&&target_finished_getting){
            //if(!check_gallery(current_source,target_source)){
               // var confirm_text=get_text_in_local_language(confirm_map);
                //var keep=confirm(confirm_text);
                //if(!keep)
                    //return;
            //}
            var tags_current=parse(current_source);
            var tags_target=parse(target_source);
            var tags_to_add=subtract(tags_current,tags_target);
            fill(tags_to_add);
        }
    }

    return {
        current_callback:function(text) {
            current_finished_getting=true;
            current_source=text;
            action();
        },
        target_callback:function(text) {
            target_finished_getting=true;
            target_source=text;
            action();
        }
    }
}

function start() {
    // 获取当前页面的 URL
    var url = window.location.href;

    // 检查 URL 是否有效
    var urlPattern = /^(https?:\/\/)/;
    if (!urlPattern.test(url)) {
        alert(get_text_in_local_language(wrong_url_map));
        return;
    }

    // 创建回调函数
    var callbacks = make_callbacks(parse_tags, subtract_tags, fill_tag_field);

    // 获取源数据并填充
    get_source_async(url, callbacks.current_callback);
    get_source_async(url, callbacks.target_callback);
}

// 当页面加载完毕时自动调用 start 函数
window.onload = function() {
    start();
};

