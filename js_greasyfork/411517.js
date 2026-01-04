// ==UserScript==
// @name         MyTips
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  操作成功/失败提示框，样式仿bootstrap
// @author       Wilson
// ==/UserScript==

((w) => {
    document.body.insertAdjacentHTML('beforeend', `
<style>
    #__g_sucess_tips, #__g_error_tips{
        display:none;position:fixed;z-index:88889999;top:20%;left:50%;margin-left:-150px;margin-top:-20px;width:300px;height:40px;padding: 0.75rem 1.25rem;
        padding:0 8px;line-height:40px;height:40px;font-size:16px;text-align:center;border-radius: 0.25rem;border: 1px solid transparent;
    }
    #__g_sucess_tips{background-color:#d4edda;border-color:#c3e6cb;color:#155724;}
    #__g_error_tips{background-color:#f8d7da;border-color:#f5c6cb;color:#721c24;}
</style>
<div id="__g_sucess_tips"></div>
<div id="__g_error_tips"></div>
`);
    var MyTips = {};
    var __id=function(name){return document.getElementById(name)};
    var __show_tips = function(_id, str, delay, pos, area){
        _id=__id(_id)||_id;
        _id.innerHTML=str;
        if(pos && pos.left){
            _id.style.left = pos.left + 'px';
            _id.style.marginLeft="auto";
        }
        if(pos && pos.top){
            _id.style.top = pos.top + 'px';
            _id.style.marginTop="auto";
        }
        if(area && area.width){
            _id.style.width = area.width + 'px';
            if(!pos || !pos.left)_id.style.marginLeft="-"+(area.width/2)+"px";
        }
        if(area && area.height){
            _id.style.height = area.height + 'px';
            _id.style.lineHeight = area.height + 'px';
            if(!pos || !pos.top)_id.style.marginTop="-"+(area.height/2 * 0.1)+"px";
        }
        _id.style.display='block';
        setTimeout(function(){_id.style.display='none';}, delay||3000);
    };
    MyTips.sucessTips = function(str, delay, pos, area){
        return __show_tips("__g_sucess_tips", str, delay, pos, area);
    };
    MyTips.errorTips = function(str, delay, pos, area){
        return __show_tips("__g_error_tips", str, delay, pos, area);
    };
    w.MyTips = MyTips;
})(this);

//使用示例
//MyTips.sucessTips("执行成功");
//MyTips.errorTips("执行失败");
//MyTips.errorTips("执行失败", 30000, {left:10}, {width:500});
