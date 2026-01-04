// ==UserScript==
// @name        keylol表情包插件
// @namespace   http://tampermonkey.net/
// @version     10.17
// @description Keylol论坛的外挂表情包插件
// @require     http://cdn.staticfile.org/jquery/3.1.1/jquery.min.js
// @include     http*://*keylol.com/*
// @author      FoxTaillll
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/426092/keylol%E8%A1%A8%E6%83%85%E5%8C%85%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/426092/keylol%E8%A1%A8%E6%83%85%E5%8C%85%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

"use strict";

/** 一个表情集合的类.初始化方式:
 *  name表示表情集合的名字,是一个字符串;
 *  srcList是图片链接列表;
 *  $Parent是一个$对象,表示该表情集应该显示在什么地方,一般是个div
 *  showDebug是一个布尔值,true的话显示大量debug信息.
 */
class FaceSet{

    /* 构造方法 */
    constructor(name,srcList,$Parent,showDebug){
        // 复制初始数据
        this._name = name;
        this._srcList = srcList.slice(0); // 复制
        this._$Parent = $Parent;
        this._showDebug = showDebug;

        // 生成_$Element对象需要的html字符串
        this._html = this._createHtml();
        // 生成的$对象,一个div,用于显示图片集合,初值为null,第一次调用时才生成
        this._$Element = null;
    }

    /* 显示debug用信息,参数可以多个,像console.log一样使用 */
    debugMsg(){
        if(this._showDebug) {
            console.log(...arguments);
        }
    }

    /* 获取名字 */
    getName(){
        return this._name;
    }

    /* 生成html用 */
    _createHtml(){
        var html = "<div>";
        for(var i = 0;i < this._srcList.length;i++){
            var src = this._srcList[i];
            html += `<img src=${src} style=height:100px></img>`;
        }
        html += "</div>";
        this.debugMsg(html);
        return html;
    }

    /* 在jaParent中显示图像. */
    show(){
        // 若尚未生成,先生成
        if(!this._$Element){
            this._$Element = $(this._html);
            this._$Parent.append(this._$Element);
        }
        // 显示
        this._$Element.css({'display':'block'});
    }

    /* 隐藏 */
    hide(){
        this._$Element.css({'display':'none'});
    }

}

/** setycyas自制的表情插件类.用于在任意textarea上方添加表情插件.初始化方法:
 * $textarea:需要使用插件的textarea,$对象;
 * faceTable:一个{},key为表情分类字符串,value是一个列表,列表内容为图片链接;
 * showDebug:布尔值,设定是否显示debug信息.
 * 构造方法不会加入表情包,必须执行main().
 */
class SetycyasFacePlugin {

    constructor($textarea,faceTable,showDebug,beforeElement) {
        //复制初始变量
        this._$textarea = $textarea;
        this._faceTable = faceTable;
        this._showDebug = showDebug;
        this._beforeElement = beforeElement;

        //设置菜单
        this._$menu = $("<div id=faceMenu></div>");
        this._$menu.css({
            "line-height":"30px",
        });
        if ($textarea.attr("id") == "postmessage") {
            this._$menu.css({
                "width":"600px"
            });
        }
        if (location.href.indexOf('keylol.com') != -1) {
            this._beforeElement.before(this._$menu);
        } else {
            this._$textarea.before(this._$menu);
        }
        //设置显示图片用的div
        this._$faceDiv = $("</div><div id=faceContent style=clear:both></div>");
        this._$faceDiv.css({
            //"border":"1px solid rgb(131,148,150)",
            //"margin-top":"5px",
            //"padding":"10px"
        });
        if ($textarea.attr("id") == "postmessage") {
            this._$faceDiv.css({
                "width":"580px"
            });
        }
        this._$menu.after(this._$faceDiv);
        //FaceSet对象的表,key是FaceSet的name,同时也是this._$menu显示的内容;
        //value则是对应的FaceSet对象
        this._faceSetTable = {};
        //当前显示的表情集合
        this._curFaceSet = null;
    }

    /* 显示debug用信息,参数可以多个,像console.log一样使用 */
    debugMsg(){
        if(this._showDebug) {
            console.log(...arguments);
        }
    }

    //往textarea插入文本
    _insertText(textInsert){
        //用数组选择方法把$对象变成一般document对象,访问其光标选择位置
        var pos = this._$textarea[0].selectionEnd;
        // 原文本
        var oldText = this._$textarea.val();
        // 插入完成后的新文本
        var newText = oldText.substr(0,pos)+textInsert+oldText.substr(pos)
        // 插入
        this._$textarea.val(newText);
    }

    //初始化菜单与表情table
    _initMenuAndFaces(){
        //再写入菜单需要的html,记录表情集合对象
        var menuHtml = "";
        for(var menuKey in this._faceTable){
            var srcList = this._faceTable[menuKey];
            var objFs = new FaceSet(menuKey,srcList,this._$faceDiv,this._showDebug);
            menuHtml += `<div class=faceSetDiv><a class=faceSet>${menuKey}</a></div>`;
            this._faceSetTable[menuKey] = objFs;
        }
        this._$menu.html(menuHtml);
        $('.faceSet').css({
            "font-size":"12px","margin":"20px","color":"#f2f2f2","cursor":"pointer"
        });
        $('.faceSetDiv').hover(
            function(event){
                if(event.target.className != 'faceSetDiv') return;
                $(event.target).css({"background-color":"rgb(64,166,228)"});
            },
            function(event){
                if(event.target.className != 'faceSetDiv') return;
                $(event.target).css({"background-color":"rgb(64,166,228)"});
            }
        );
        $('.faceSetDiv').css({
            "min-width":"40px","float":"left","background-color":"rgb(64,166,228)"
        });
    }

    /* 绑定所有事件,需要冒泡执行 */
    _addEvents(){
        //添加事件时,需要传入自己,所以要记住自己
        var obj = this;
        //点击菜单,只有点击了'faceSet'class才生效
        var menu = this._$menu[0];
        menu.addEventListener('click',function(e){
            var target = e.target;
            if(target.className != 'faceSet'){
                return;
            }
            //点击的文字
            var faceTag = target.textContent;
            //如果当前没有已显示图像集,显示;
            if(!obj._curFaceSet){
                obj._curFaceSet = obj._faceSetTable[faceTag];
                obj._curFaceSet.show();
            }else{
                //若点击的文字不是当前显示的表情集合,把原来的表情集隐藏,显示点击的;
                //否则隐藏当前表情集合.
                if(obj._curFaceSet.getName() == faceTag){
                    obj._curFaceSet.hide();
                    obj._curFaceSet = null;
                }else{
                    obj._curFaceSet.hide();
                    obj._curFaceSet = obj._faceSetTable[faceTag];
                    obj._curFaceSet.show();
                }
            }
        });
        //点击图片
        var faceDiv = this._$faceDiv[0];
        faceDiv.addEventListener('click',function(e){
            var target = e.target;
            // 点击的不是'img',忽略
            if(target.tagName.toLowerCase() != 'img'){
                return;
            }
            var src = target.src;
            var textInsert = `[img]${src}[/img]`;
            obj._insertText(textInsert);
        });
    }

    main(){
        //生成menu与表情集合的具体内容
        this._initMenuAndFaces();
        //绑定事件
        this._addEvents();
    }

    init(){
        $('.faceSet')[0].click();
        $('.faceSetDiv').css({"display":"none"});
        $('.hasfsl').css({"margin":"0"});
        $('#fastsmiliesdiv').css({"display":"none"});
    }
}

function _init_scirpt($textarea, beforeElement) {
    if ($textarea.length == 0) {
        return;
    }

    //这一句自定义表情包,注意有些图片可能省略了域名
    var faceTable = {
        "神崎兰子":[
            'https://pic.imgdb.cn/item/5edb1191c2a9a83be5dd8ebf.gif',
            'https://pic.imgdb.cn/item/5edb1191c2a9a83be5dd8ec4.gif',
            'https://pic.imgdb.cn/item/5edb1191c2a9a83be5dd8ec8.gif',
            'https://pic.imgdb.cn/item/5edb1191c2a9a83be5dd8ecb.gif',
            'https://pic.imgdb.cn/item/5edb1191c2a9a83be5dd8ece.gif',
            'https://pic.imgdb.cn/item/5edb10aec2a9a83be5db9578.gif',
            'https://pic.imgdb.cn/item/5edb10aec2a9a83be5db957b.gif',
            'https://pic.imgdb.cn/item/5edb10aec2a9a83be5db957f.gif',
            'https://pic.imgdb.cn/item/5edb10aec2a9a83be5db9584.gif',
            'https://pic.imgdb.cn/item/5edb10aec2a9a83be5db958c.gif',
        ],
        "高垣枫":[
            'https://pic.imgdb.cn/item/5edcb6cac2a9a83be5530dad.gif',
            'https://pic.imgdb.cn/item/5edcb6cac2a9a83be5530db3.gif',
            'https://pic.imgdb.cn/item/5edcb6cac2a9a83be5530db7.gif',
            'https://pic.imgdb.cn/item/5edcb6cac2a9a83be5530db9.gif',
            'https://pic.imgdb.cn/item/5edcb6c4c2a9a83be55303e6.gif',
            'https://pic.imgdb.cn/item/5edcb6bac2a9a83be552f2df.gif',
            'https://pic.imgdb.cn/item/5edcb6bac2a9a83be552f2e6.gif',
            'https://pic.imgdb.cn/item/5edcb6bac2a9a83be552f2eb.gif',
            'https://pic.imgdb.cn/item/5edcb6bac2a9a83be552f2ed.gif',
            'https://pic.imgdb.cn/item/5edcb6bac2a9a83be552f2ef.gif',
        ],
        "双叶杏":[
            'https://pic.imgdb.cn/item/5edcb6ddc2a9a83be5532ab4.gif',
            'https://pic.imgdb.cn/item/5edcb6ddc2a9a83be5532ab6.gif',
            'https://pic.imgdb.cn/item/5edcb6ddc2a9a83be5532ab9.gif',
            'https://pic.imgdb.cn/item/5edcb6ddc2a9a83be5532abc.gif',
            'https://pic.imgdb.cn/item/5edcb6ddc2a9a83be5532ac1.gif',
            'https://pic.imgdb.cn/item/5edcb6d6c2a9a83be5531f35.gif',
            'https://pic.imgdb.cn/item/5edcb6d6c2a9a83be5531f3b.gif',
            'https://pic.imgdb.cn/item/5edcb6d6c2a9a83be5531f3f.gif',
            'https://pic.imgdb.cn/item/5edcb6d6c2a9a83be5531f42.gif',
            'https://pic.imgdb.cn/item/5edcb6d6c2a9a83be5531f45.gif'
        ],
        "依田芳乃":[
            'https://pic.imgdb.cn/item/5edd7dc7c2a9a83be5a04797.gif',
            'https://pic.imgdb.cn/item/5edd7dc2c2a9a83be5a04294.gif',
            'https://pic.imgdb.cn/item/5edd7dc2c2a9a83be5a04298.gif',
            'https://pic.imgdb.cn/item/5edd7dc2c2a9a83be5a0429a.gif',
            'https://pic.imgdb.cn/item/5edd7dc2c2a9a83be5a0429d.gif',
            'https://pic.imgdb.cn/item/5edd7dc2c2a9a83be5a042a1.gif'
        ],
        "一之濑志希":[
            'https://pic.imgdb.cn/item/5edd7ddfc2a9a83be5a05f06.gif',
            'https://pic.imgdb.cn/item/5edd7ddfc2a9a83be5a05f19.gif',
            'https://pic.imgdb.cn/item/5edd7ddfc2a9a83be5a05f24.gif',
            'https://pic.imgdb.cn/item/5edd7ddfc2a9a83be5a05f29.gif',
            'https://pic.imgdb.cn/item/5edd7ddfc2a9a83be5a05f2f.gif',
            'https://pic.imgdb.cn/item/5edd7dd8c2a9a83be5a058fb.gif',
            'https://pic.imgdb.cn/item/5edd7dd8c2a9a83be5a058fe.gif',
            'https://pic.imgdb.cn/item/5edd7dd8c2a9a83be5a05900.gif',
            'https://pic.imgdb.cn/item/5edd7dd8c2a9a83be5a05904.gif'
        ],
        "橘爱丽丝":[
            'https://pic.imgdb.cn/item/5edd7df1c2a9a83be5a06ece.gif',
            'https://pic.imgdb.cn/item/5edd7df1c2a9a83be5a06ed1.gif',
            'https://pic.imgdb.cn/item/5edd7df1c2a9a83be5a06ed4.gif',
            'https://pic.imgdb.cn/item/5edd7df1c2a9a83be5a06ed7.gif',
            'https://pic.imgdb.cn/item/5edd7de8c2a9a83be5a0672b.gif',
            'https://pic.imgdb.cn/item/5edd7de8c2a9a83be5a0672e.gif',
            'https://pic.imgdb.cn/item/5edd7de8c2a9a83be5a06730.gif',
            'https://pic.imgdb.cn/item/5edd7de8c2a9a83be5a06733.gif'
        ],
        "鹭泽文香":[
            'https://pic.imgdb.cn/item/5edd7dffc2a9a83be5a07bc7.gif',
            'https://pic.imgdb.cn/item/5edd7dffc2a9a83be5a07bcb.gif',
            'https://pic.imgdb.cn/item/5edd7dffc2a9a83be5a07bcd.gif',
            'https://pic.imgdb.cn/item/5edd7dffc2a9a83be5a07bcf.gif',
            'https://pic.imgdb.cn/item/5edd7dfac2a9a83be5a076fc.gif',
            'https://pic.imgdb.cn/item/5edd7dfac2a9a83be5a076fe.gif',
            'https://pic.imgdb.cn/item/5edd7dfac2a9a83be5a07701.gif',
            'https://pic.imgdb.cn/item/5edd7dfac2a9a83be5a07703.gif',
            'https://pic.imgdb.cn/item/5edd7dfac2a9a83be5a07706.gif'
        ],
        "城崎美嘉":[
            'https://pic.imgdb.cn/item/5edd7e11c2a9a83be5a08afd.gif',
            'https://pic.imgdb.cn/item/5edd7e11c2a9a83be5a08b00.gif',
            'https://pic.imgdb.cn/item/5edd7e11c2a9a83be5a08b03.gif',
            'https://pic.imgdb.cn/item/5edd7e11c2a9a83be5a08b06.gif',
            'https://pic.imgdb.cn/item/5edd7e11c2a9a83be5a08b08.gif',
            'https://pic.imgdb.cn/item/5edd7e0ac2a9a83be5a084e0.gif',
            'https://pic.imgdb.cn/item/5edd7e0ac2a9a83be5a084e6.gif',
            'https://pic.imgdb.cn/item/5edd7e0ac2a9a83be5a084e9.gif',
            'https://pic.imgdb.cn/item/5edd7e0ac2a9a83be5a084eb.gif',
            'https://pic.imgdb.cn/item/5edd7e0ac2a9a83be5a084ef.gif'
        ],
        "城崎莉嘉":[
            'https://pic.imgdb.cn/item/5edd7e28c2a9a83be5a09f12.gif',
            'https://pic.imgdb.cn/item/5edd7e28c2a9a83be5a09f14.gif',
            'https://pic.imgdb.cn/item/5edd7e28c2a9a83be5a09f18.gif',
            'https://pic.imgdb.cn/item/5edd7e28c2a9a83be5a09f1c.gif',
            'https://pic.imgdb.cn/item/5edd7e28c2a9a83be5a09f1f.gif',
            'https://pic.imgdb.cn/item/5edd7e1ec2a9a83be5a09570.gif',
            'https://pic.imgdb.cn/item/5edd7e1ec2a9a83be5a09574.gif',
            'https://pic.imgdb.cn/item/5edd7e1ec2a9a83be5a09576.gif',
            'https://pic.imgdb.cn/item/5edd7e1ec2a9a83be5a09579.gif',
            'https://pic.imgdb.cn/item/5edd7e1ec2a9a83be5a0957d.gif'
        ],
        "星辉子":[
            'https://pic.imgdb.cn/item/5edd9452c2a9a83be5b89652.gif',
            'https://pic.imgdb.cn/item/5edd9452c2a9a83be5b8964e.gif',
            'https://pic.imgdb.cn/item/5edd9452c2a9a83be5b89647.gif',
            'https://pic.imgdb.cn/item/5edd9440c2a9a83be5b880b1.gif',
            'https://pic.imgdb.cn/item/5edd9440c2a9a83be5b880ae.gif',
            'https://pic.imgdb.cn/item/5edd9440c2a9a83be5b880ab.gif',
            'https://pic.imgdb.cn/item/5edd9440c2a9a83be5b880a8.gif',
            'https://pic.imgdb.cn/item/5edd9440c2a9a83be5b880a4.gif'
        ],
        "樱井桃华":[
            'https://pic.imgdb.cn/item/5edd7e53c2a9a83be5a0c56c.gif',
            'https://pic.imgdb.cn/item/5edd7e53c2a9a83be5a0c56e.gif',
            'https://pic.imgdb.cn/item/5edd7e53c2a9a83be5a0c570.gif',
            'https://pic.imgdb.cn/item/5edd7e4cc2a9a83be5a0c098.gif',
            'https://pic.imgdb.cn/item/5edd7e4cc2a9a83be5a0c09a.gif',
            'https://pic.imgdb.cn/item/5edd7e4cc2a9a83be5a0c09d.gif',
            'https://pic.imgdb.cn/item/5edd7e4cc2a9a83be5a0c09f.gif'
        ]
    };

    // 新建表情包插件,运行main()方法
    var showDebug = false;
    var plugin = new SetycyasFacePlugin($textarea,faceTable,showDebug,beforeElement);
    plugin.main();
    plugin.init();
}

var reply_display = false;
var exec_script = false;

/** 执行代码,如无必要,不要修改FaceSet与SetycyasPlugin两个类.
 * 在这里修改执行代码,应该足够对应不同论坛的设定以及自定义表情.
 */
(function(){
    //这一句指定文本框,应对不同论坛请修改这里
    var $textarea = $("form[name=FORM] textarea[name=atc_content]");
    if ($textarea.length == 0) {
        $textarea = $("#fastpostmessage");
    }
    _init_scirpt($textarea, $("#fastpostreturn"));

    var tmpInterval = setInterval(function(){
        if (document.querySelector("#fwin_reply") != null) {
            reply_display = true;
            if (!exec_script) {
                exec_script = true;
                _init_scirpt($("#postmessage"), $("#postmessage").closest("div.tedt"));
            }
        } else {
            reply_display = false;
            if (exec_script) {
                exec_script = false;
                //console.log("close 1");
            }
        }
    }, 1000);
})();