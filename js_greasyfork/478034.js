// ==UserScript==
// @name         SecondTampermonkey
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Vue3/React网站指定数据获取
// @author       ITXZ1232
// @include      *
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1291ffe943ee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478034/SecondTampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/478034/SecondTampermonkey.meta.js
// ==/UserScript==


var func={
    maomi:{}
};

var tools={
    reactDG(obj,func,dataKey){
        if(obj==null)return;
        for(var _key of dataKey){
            if(!obj.hasOwnProperty("props"))continue;
            if(obj.props.hasOwnProperty(_key)){
                console.log("obj.props",item.props);
                func(item,_key);
            }
        }
        var _children=[];
        if(!Array.isArray(obj.children))
            _children=[obj.children]
        else
            _children=obj.children||[]
        //如果不是数组,就装入数组
        for(var item of _children){
            //console.log("item",item);
            try{
                if(item==null || item==undefined)continue;
                if(!item.hasOwnProperty("props"))continue;
                for(var _key of dataKey){
                    if(item.props.hasOwnProperty(_key)){
                        console.log("item.props",item.props);
                        func(item,_key);
                    }
                }
            }catch{
                debugger;
                console.log("item-error",item);
            }
            tools.reactDG(item.props,func,dataKey);
        }
    },
    vueDG(obj,func,_cName,dataKey,isDebug){
        //如果不是数组,就装入数组
        var data= Array.isArray(obj)?obj:[obj];
        for(var item of data){
            if(typeof item =="object"){

                if(!item.hasOwnProperty("type"))return;
                if(item!=null && item != undefined && isDebug)
                    console.log("item",item);

                var _name1=[...item?.el?.classList||[]].join(".");

                if( _name1.includes(_cName) && isDebug){
                    console.log("11",item);
                }
                for(var _key of dataKey){
                    if((item?.props||{})[_key]!=null){
                        console.log("111",item,data);
                        func(item,_key);
                        return;
                    }
                }
                var childArr= [item.component, item.subTree , item.children];
                for(var _child of childArr){

                    if(_child!=null && _child != undefined && isDebug)
                        console.log("_child",_child);


                    if(_child!=null){
                        var _name=[..._child?.el?.classList||[]].join(".");
                        if( _name.includes(_cName) && isDebug){
                            console.log("22",_child);
                        }
                        for(var _key of dataKey){
                            if((_child?.props||{})[_key]!=null){
                                console.log("222",_child);
                                func(_child,_key);
                                return;
                            }
                         }
                        tools.vueDG(_child,func,_cName,dataKey,isDebug);
                    }
                }

            }

        }
    },
    data:[],
    key:"maomi",
    //显示数据
    setHtml(){
        $("._help_tools_content").html(func[tools.key].getHtml());
        var html=`<h2>共${tools.data.length}条数据</h2> <button  class="_ht_reload">刷新</button> <button  class="_ht_show">展开</button>`;
        $("._help_tools_page").html(html);

        func[tools.key].LoadStyle();
    }
}
func.maomi={
    initFunc(){
        document.querySelectorAll("img[src*='.gif']").forEach(x=> x.parentNode.remove());
    },
    getHtml(){
        var html="";
        for(var item of tools.data){
            html+=`<div class='ht-d-item'>
                       <a href="javascript:void(0);" url="${item.video_url}" target="_blank">${item.title}</a>
                   </div>\r\n`;
        }
        return html;
    },
    config:{
        index:{
            //初始节点选择
            cnKey:'.mw1100',
            //数据中包含什么key才进入自定义函数处理
            dkey:["list","data","post"]
        },
        page:{
            //初始节点选择
            cnKey:'.mt20',
            //数据中包含什么key才进入自定义函数处理
            dkey:["list","data","post"]
        }
    },
    LoadStyle(){
        var _style=document.createElement("style");
        _style.innerHTML=`
.ht-d-item{
    width:25%;
    max-height: 44px;
    overflow: hidden;
    border-bottom:1px solid red;
}
.ht-d-item a{
    color:#000;
    text-decoration: none;
    font-size: 12px;
    padding:6px 5px;
    display: inline-block;
}
    `;
        document.body.append(_style);
    },
    LoadData(){

        var _host=window.location.pathname;
        var key="index";
        if(_host.startsWith("/page/tese"))
            key="page";
        else if(_host.startsWith("/page/vip"))
            key="index";

        var _d=func[tools.key].config[key];

        //初始Dom
        var _dom=document.querySelector(_d.cnKey);
        var _keyArr=Object.keys(_dom).filter(function(x){ return x.includes("__reactFiber")||x.includes("__reactInternalInstance")});

        var keyName="";
        if(_keyArr.length==0)
            alert("无法通过节点查找数据");
        else
            keyName=_keyArr[0];

        var _memoizedProps=_dom[keyName].memoizedProps;
        console.log(_memoizedProps,key,_d);
        var i=1;
        tools.reactDG(_memoizedProps,(data,_key) =>{
            var result=data.props[_key]||[];
            console.log("data",data);
            data.channel="shipin";
            if(Array.isArray(result)){
                for(var item of result){
                    if(!tools.data.includes(item)){
                        item.title="("+i+")"+item.title
                        tools.data.push(item);
                        document.querySelectorAll("._60edd98578")[i-1].querySelector(".to").innerText=item.title;
                        //console.log(item);
                    }
                    i++;
                }
            }else{
                if(!tools.data.includes(result))
                    tools.data.push(result);
            }
            console.log("执行Func",data);
        },_d.dkey)


        tools.setHtml();
    }
}

func.toutiao={
    initFunc(){
    },
    getHtml(){
        var html="";
        for(var item of tools.data){
            html+=`<div class='ht-d-item'>
                       <img src="${item.picture}" style="height:100%;">
                       <a href="javascript:void(0);" url="${item.video}" target="_blank">${item.title}</a>
                   </div>\r\n`;
        }
        return html;
    },
    LoadStyle(){
        var _style=document.createElement("style");
        _style.innerHTML=`
.ht-d-item{
    width:50%;
    display:flex;
    max-height: 44px;
    overflow: hidden;
    border-bottom:1px solid red;
}
.ht-d-item a{
    color:#000;
    text-decoration: none;
    font-size: 12px;
    padding:6px 5px;
    display: inline-block;
}

    `;
        document.body.append(_style);
    },
    config:{
        index:{
            //节点名称包含什么时会进行调试打印（方便调试）
            cnKey:'homelist',
            //数据中包含什么字段名称，才认为是合格数据在进行自定义函数处理
            dkey:["data","list","post"]
        },
        detail:{
            cnKey:'videoDetails',
            dkey:["post"]
        }
    },
    LoadData(){
        var arr=[];
        var $route=document.querySelector("#app").__vue_app__.config.globalProperties.$route;

        var key="index";
        if($route.path=="/home")
            key="index";
        else if($route.path=="/videoDetails")
            key="detail";

        var _d=func[tools.key].config[key];
        console.log(_d,document.querySelector("#app")._vnode);
        tools.vueDG(document.querySelector("#app")._vnode,(data,_key)=>{
            var result=data.props[_key]||[];
            if(Array.isArray(result)){
                var i=1;
                for(var item of result){
                    if(!tools.data.includes(item)  && item.video!=null){
                        item.title="("+i+")"+item.title
                        tools.data.push(item);
                        console.log(item);
                    }
                    i++;
                }
            }else{
                if(!tools.data.includes(result) && result.video!=null)
                    tools.data.push(result);
            }
            console.log("执行Func",data);
        },_d.cnKey,_d.dkey,false);

        tools.setHtml();
    }
}


func["91|MD"]={
    initFunc(){
    },
    getHtml(){
        var html="";
        for(var item of tools.data){
            html+=`<div class='ht-d-item'>
                       <img src="${item.preview}" style="height:100%;">
                       <a href="javascript:void(0);" url="${item.video_url}" target="_blank">${item.title}</a>
                   </div>\r\n`;
        }
        return html;
    },
    LoadStyle(){
        var _style=document.createElement("style");
        _style.innerHTML=`
.ht-d-item{
    width:100%;
    display:flex;
    max-height: 44px;
    overflow: hidden;
    border-bottom:1px solid red;
}
.ht-d-item a{
    color:#000;
    text-decoration: none;
    font-size: 12px;
    padding:6px 5px;
    display: inline-block;
}

    `;
        document.body.append(_style);
    },
    config:{
        search:{
            //节点名称包含什么时会进行调试打印（方便调试）
            cnKey:"div[class*='listBox_']",
            //数据中包含什么字段名称，才认为是合格数据在进行自定义函数处理
            dkey:["dataList"]
        }
    },
    LoadData(){

        var _host=window.location.pathname;
        var key="search";
        if(_host.startsWith("/index/search"))
            key="search";
        // else if(_host.startsWith("/page/vip"))
        //     key="index";

        var _d=func[tools.key].config[key];

        //初始Dom
        var _dom=document.querySelector(_d.cnKey).parentNode;
        var _keyArr=Object.keys(_dom).filter(function(x){ return x.includes("__reactFiber")||x.includes("__reactInternalInstance")});

        var keyName="";
        if(_keyArr.length==0)
            alert("无法通过节点查找数据");
        else
            keyName=_keyArr[0];

        var _memoizedProps=_dom[keyName].memoizedProps;
        console.log(_memoizedProps,key,_d);
        var i=1;
        tools.reactDG(_memoizedProps,(data,_key) =>{
            var result=data.props[_key]||[];
            console.log("data",data);
            if(Array.isArray(result)){
                for(var item of result){
                    if(item?.is_vip!=null){
                        item.is_vip=0;
                        $($("div[class*='itemCol__']")[i-1]).append(`<span class="source___12omh">第${i}个</span>`)
                    }
                    if(!tools.data.includes(item)  && item.video_url!=null){
                        item.title="("+i+")"+item.title
                        tools.data.push(item);
                        $($("div[class*='itemCol__']")[i-1]).find("span").html(`第${i}个`);
                        $($("div[class*='itemCol__']")[i-1]).css({width:"50%"});

                        //console.log(item);
                    }
                    i++;
                }
            }else{
                if(!tools.data.includes(result))
                    tools.data.push(result);
            }
            console.log("执行Func",data);
        },_d.dkey)

        tools.setHtml();
    }
}


var initFunc=function(){
    var div=document.createElement("div");
    div.classList.add("_help_tools");
    div.classList.add("_hide");
    document.body.append(div);
    var _style=document.createElement("style");
    _style.innerHTML=`
._help_tools{
    width: 100%;
    height: 435px;
    position: fixed;
    bottom: 0px;
    left: 0;
    background: #fff;
    border-top: 2px solid red;
    border-radius: 5px;
    z-index:1000;

}
._help_tools_header{
    display:flex;
}

._help_tools_header ._ht_active{
    background:#222;
    color:#fff;
    font-weight:bold;
    font-size:16px;
}
._help_tools_header span{
    width: 100%;
    display:block;
    padding:8px 15px;
    color:#666;
    text-align:center;
    background:#eee;
}

._help_tools_page{
    display:flex;
    font-size:11px;
    height: 40px;
}

._help_tools_page button{
    height: 30px;
    margin-top: 11px;
    margin-left:30px;
    color: #000;
}
._help_tools_content{
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    height: 358px;
}
._hide{
    height:0px;
}
._hide ._ht_show{

    position: fixed;
    right: 0px;
    bottom: 50px;
    display: block;

}
._hide ._help_tools_header,._hide ._help_tools_content,_hide ._ht_reload,_hide h2 {
    display:none;
}

    `;
    document.body.append(_style);


    var menuHtml="";
    for(var item in func){
        menuHtml+=`<span class="${item==tools.key?'_ht_active _ht_key_select':'_ht_key_select'}"  key='${item}' >${item}</span>`;
    }
    //debugger;
   $("._help_tools").html(`
                  <div class="_help_tools_header">${menuHtml}</div>
                  <div class="_help_tools_page"></div>
                  <div class="_help_tools_content"></div>`);




    $("._help_tools").on("click","._ht_key_select",function(){
        tools.key=$(this).attr("key");
        $("._ht_key_select").removeClass("_ht_active");
        $(this).addClass("_ht_active");
        console.log("tools.key",tools.key);
        func[tools.key].LoadData();
    })
    $("._help_tools").on("click","._ht_reload",function(){
        func[tools.key].LoadData();
    })

    $("._help_tools").on("click","._ht_show",function(){
        if($("._help_tools").hasClass("_hide")){
            $("._help_tools").removeClass("_hide");
        }else{
            $("._help_tools").addClass("_hide");
        }

    })

    $("._help_tools").on("click",".ht-d-item",function(){
        window.open("mttbrowser://url="+$(this).find("a").attr("url"));
    })


    var html=`<h2>共${tools.data.length}条数据</h2> <button  class="_ht_reload">刷新</button> <button  class="_ht_show">展开</button>`;
    $("._help_tools_page").html(html);

    // setTimeout(()=>{
    //     func[tools.key].LoadData();
    // },1500)

    setInterval(()=>{
        func[tools.key].initFunc();
    },800)
};

(function() {
    'use strict';


    var _a=document.createElement("script");
    _a.id="jq_script";
    _a.src="//code.jquery.com/jquery-2.1.1.min.js?a="+Math.random();
    document.body.append(_a);
    setTimeout(function(){
        initFunc();
    },1000)

    // Your code here...
})();