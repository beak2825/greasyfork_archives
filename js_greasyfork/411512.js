// ==UserScript==
// @name         GM_createMenu
// @namespace    http://bbs.91wc.net/gm-create-menu.htm
// @version      0.1.10
// @description  油猴菜单库，支持开关菜单，支持批量添加，为您解决批量添加和开关菜单的烦恼
// @author       Wilson
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue 
// @grant        GM_getValue
// ==/UserScript==

var GM_createMenu = {
    list : [], //菜单列表
    ids : {}, //菜单id对象
    storage : false,
    isSwitch:function(item){
        return item && item.on && item.off;
    },
    //存储菜单
    store : function(data){
        GM_setValue("__GM_createMenu_list", data||this.list);
    },
    //获取存储的菜单数据
    getStore : function(key){
        return GM_getValue(key||"__GM_createMenu_list");
    },
    mergeList : function(list, store){
        if(!store || store.length===0) return list;
        //映射数组
        var storeMap = {};
        for(var i in store){
            var itemstore = store[i];
            if(!itemstore || typeof itemstore !== "object") continue;
            var itemstorename = itemstore["name"] || (itemstore["on"]["name"] + itemstore["off"]["name"]);
            storeMap[itemstorename] = itemstore;
        }

        //合并存储数据
        for(var n in list){
            var item = list[n];
            if(!item || typeof item !== "object") continue;
            var itemname = item["name"] || (item["on"]["name"] + item["off"]["name"]);
            var storeitem = storeMap[itemname];
            if(this.isSwitch(storeitem)){
                item.curr = storeitem.curr;
                item.uncurr = storeitem.uncurr;
                item.on.default = storeitem.on.default;
                item.off.default = storeitem.off.default;
                list[n] = item;
            }
        }
        return list;
    },
    //创建菜单,from contains page, menu
    create : function(option, from){
        var _this = this;
        if(_this.list.length===0) return;
        from = from || 'page';
        if(typeof option !== 'undefined' && typeof option.storage !== 'undefined'){
            _this.storage = option.storage;
        }
        //删除旧菜单
        for(var i in _this.ids){
           GM_unregisterMenuCommand(_this.ids[i]);
        }
        //合并存储数据
        var list = _this.list;
        if(_this.storage){
            list = _this.mergeList(list, _this.getStore());
        } else {
            if(GM_setValue) _this.store([]);
        }
        //开始创建
        list.forEach(function(item, i){
            if(!item || typeof item !== "object") return true;
            var currMenu = _this.isSwitch(item) ? item[item.curr] : item;
            _this.ids[currMenu.name] = GM_registerMenuCommand(currMenu.name, function(){
                //调用用户回调函数
                currMenu.callback();

                if(_this.isSwitch(item)){
                    //反转开关
                    item[item.curr].default = false;
                    item[item.uncurr].default = true;
                    var item_curr = item.curr;
                    item.curr=item.uncurr;
                    item.uncurr=item_curr;

                    if(_this.storage){
                        _this.store();
                    }

                    _this.create(option, 'menu');
                }

            }, currMenu.accessKey||null);
            if(item.load && from === 'page') item.load(item.uncurr||null);
        });
    },
    //添加菜单配置
    add:function(conf){
        //兼容数组配置
        if(Object.prototype.toString.call(conf) === "[object Array]"){
            for(var i in conf){
                this.add(conf[i]);
            }
            return this;
        }
        //switch menu
        if(conf.on && conf.off){
            //检查配置
            if((!conf.on.name||!conf.off.name) && typeof conf === 'object'){
                alert("GM_createMenu Item name is need.");
                return this;
            }
            if(!conf.on.callback){
                conf.on.callback = function(){};
            }
            if(!conf.off.callback){
                conf.off.callback = function(){};
            }
            if(conf.off.default){
                conf.curr="off"
                conf.uncurr="on"
                conf.on.default=false;
                conf.off.default=true;
            }
            else if(conf.on.default){
                conf.curr="on"
                conf.uncurr="off";
                conf.on.default=true;
                conf.off.default=false;
            }
            else{
                conf.curr="on"
                conf.uncurr="off";
                conf.on.default=true;
                conf.off.default=false;
            }
        } else {
            //common menu
            //检查配置
            if(!conf.name && typeof conf === 'object'){
                alert("GM_createMenu Item name is need.");
                return this;
            }
        }

        this.list.push(conf);
        return this;
    },
};


//////////////////////////////// 使用示例 //////////////////////////////
/*
GM_createMenu.add({
    on : {
        default : true,
        name : "Open",
        callback : function(){
            alert("I'm Open.");
        }
    },
    off : {
        name : "Close",
        callback : function(){
            alert("I'm Close.");
        }
    }
});
GM_createMenu.add({
    on : {
        name : "Edit",
        accessKey: 'E',
        callback : function(){
            alert("I am editing");
        }
    },
    off : {
        default : true,
        name : "Exit Edit",
        accessKey: 'X',
        callback : function(){
            alert("I'm exit.");
        }
    }
});
GM_createMenu.create();
//*/

/*
GM_createMenu.add([
    {
        load : function(menuStatus){
            if(menuStatus==="on") alert("loaded");
        },
        on : {
            name : "开启",
            callback : function(){
                alert("我开启了");
            }
        },
        off : {
            name : "关闭",
            callback : function(){
                alert("我关闭了");
            }
        }
    },
    {
        on : {
            name : "进入编辑模式",
            accessKey: 'E',
            callback : function(){
                alert("我已进入编辑模式");
            }
        },
        off : {
            name : "退出编辑模式",
            accessKey: 'X',
            callback : function(){
                alert("我已退出编辑模式");
            }
        }
    },
    {
        name : "test1111",
        callback : function(){
            alert("test11111");
        },
        load : function(){
            alert("loaded1111");
        }
    },
    {
        name : "test2222",
        callback : function(){
            alert("test2222");
        }
    }
]);
//GM_createMenu.storage=true;
GM_createMenu.create();
//*/
