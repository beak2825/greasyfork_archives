// ==UserScript==
// @name        bgm神回标记
// @namespace    http://tampermonkey.net/
// @description  mark great episodes in bgm
// @author       xdy
// @include    /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)/subject/\d+$
// @include    /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)/index/\d+$
// @version     0.0.1
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/41088/bgm%E7%A5%9E%E5%9B%9E%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/41088/bgm%E7%A5%9E%E5%9B%9E%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

var islogin = !$("div").is(".guest");
if(!islogin)
{
    return;
}

function $a(q) { return document.querySelectorAll(q); }


var isindex = location.pathname.indexOf('index', 0);
var index = GM_getValue("index", 'no');

if(isindex != -1)
{
    indexMark();
    return;
}

var has_ep = document.querySelector('.load-epinfo');
var domain = document.location.protocol +'//'+ document.location.hostname;
var index_url = domain +'/index/'+ index;
var ep_strs=[];
var ep_del_url = [];
var formhash;
if(has_ep && index != 'no'){
    mycss = '.marked_Btn {background-color: #FFFF00;color: #FFF;border: 1px solid #1175a8;} a.marked_Btn:hover {color:#333;border-top:2px solid #00A8FF}';
    GM_addStyle(mycss);
    $.get(index_url, function(res){
        let ep_str = res.match(/item_ep\d+/g);
        if(ep_str==null || ep_str.length == 0)
            return;
        for(let i=0;i<ep_str.length;i++){
            ep_strs.push(ep_str[i].substr(7));
        }
        let del_str = res.match(/id="related_ep.*?class/g);
        //console.log(del_str);
        for(let i=0;i<del_str.length;i++){
            pos0 = del_str[i].indexOf('href=');
            pos1 = del_str[i].indexOf('class');
            //console.log(del_str[i].substring(pos0+6, pos1-2));
            ep_del_url.push(domain+del_str[i].substring(pos0+6, pos1-2));
        }
        hash_str = res.match(/name="formhash" value=".*?"/);
        formhash = hash_str[0].substr(-9,8);
        //console.log(formhash);
        //console.log(ep_strs);
        insert_function(formhash, index_url);
        mark_episode(ep_strs);
    });

}

function indexMark(){
    let tip = $('div.grp_box');
    console.log(tip);
    let t = document.createElement('a');
    t.href = "javascript:void(0);";
    t.className = 'l thickbox';
    //var url = location.pathname;
    let url = location.pathname.split('/');
    curr_index = url[url.length-1];
    //console.log(curr_index, index);
    if(index == 'no' || index != curr_index){
        t.text = ' / 指定目录';
        t.onclick = function(){GM_setValue('index', curr_index);location.reload();};
    }
    else{
        t.text = ' / 取消指定';
        t.onclick = function(){GM_setValue('index', 'no');location.reload();};
    }
    tip.append(t);
}

function insert_function(formhash, url){
    mark_ep_func = 'function mark_ep(args){args = args.split(",");$.post(args[1]+"/add_related",{"add_related":args[0],"cat":3,"formhash":args[2],"submit":"添加章节关联"}, function(res){location.reload()});}';
    del_ep_func = 'function del_ep(url){;$.get(url, function(res){location.reload()});}';
    script = $('<script>'+mark_ep_func+del_ep_func+'</script>');
    $('body').append(script);
}



function mark_episode(marked_ep){
    var eps = $a('.prg_popup');
    for(var i in eps){
        //var l = ep.childNodes.length;
        //console.log(eps[i]);
        var ep_id;
        if(eps[i].id != undefined)
            ep_id = eps[i].id.substr(8);
        else
            continue;
        var l = eps[i].children.length;
        var ep_pos = $.inArray(ep_id, marked_ep);
        var ismarked = $.inArray(ep_id, marked_ep) >= 0;
        if(ismarked){
            var prg = $('#prg_' + ep_id);
            prg.attr("class", "marked_Btn");
        }

        var button;
        if(ismarked)
            button = '<a href="javascript:void(0);" class="1 ep_status" onclick=del_ep("' +ep_del_url[ep_pos]+ '")>撤销标记</a>';
        else
            button = '<a href="javascript:void(0);" class="1 ep_status" onclick=mark_ep("' +ep_id+','+index_url+','+formhash+ '")>标记神回</a>';

        if(l == 2){
            var eptool = document.querySelector('div#prginfo_' + ep_id + ' div.epStatusTool');
            eptool.innerHTML = eptool.innerHTML + button;
        }
        else if(l == 1){
            var tool = '<div class="epStatusTool">'+ button + '</div>';
            var prginfo = document.querySelector('#prginfo_' + ep_id);
            prginfo.innerHTML = tool + prginfo.innerHTML;
        }

    }
}




