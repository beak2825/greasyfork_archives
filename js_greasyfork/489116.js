// ==UserScript==
// @name         修改配置标记
// @namespace    http://tampermonkey.net/
// @version      0.95.3
// @description  仅供内部使用！
// @author       tme
// @match        *.changan.com.cn/configcenter-web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=changan.com.cn
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layui/2.8.18/layui.min.js
// @resource layuicss https://cdnjs.cloudflare.com/ajax/libs/layui/2.8.18/css/layui.min.css

// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-body
// @changelog v0.92 2024-6-14 优化车系配置按钮，点击车系配置时不响应查询。
// @changelog v0.94 2024-6-14 对话框标题显示当前操作主要信息
// @changelog v0.95 2024-12-30 DOMNodeInserted被废弃，使用新方法监听


// @downloadURL https://update.greasyfork.org/scripts/489116/%E4%BF%AE%E6%94%B9%E9%85%8D%E7%BD%AE%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489116/%E4%BF%AE%E6%94%B9%E9%85%8D%E7%BD%AE%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

const css = GM_getResourceText("layuicss");
GM_addStyle(css);

(function() {
    'use strict';

    const BASE_URL = location.origin;

    //if('https://iov.changan.com.cn/configcenter-web/#/mobile-app/func-config' == window.location.href) return;

    function waitForKeyElements2(selectorOrFunction, callback, atleast, maxIntervals, interval) {
        if (typeof atleast === "undefined") {
            atleast = 1;
        }
        if (typeof interval === "undefined") {
            interval = 500;
        }
        if (typeof maxIntervals === "undefined") {
            maxIntervals = 10;
        }
        var targetNodes = (typeof selectorOrFunction === "function")
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);

        var targetsFound = targetNodes && targetNodes.length >= atleast;
        if (!targetsFound && maxIntervals !== 0) {
            maxIntervals -= 1;
            setTimeout(function() {
                waitForKeyElements2(selectorOrFunction, callback, atleast, maxIntervals, interval);
            }, interval);
        } else {
            callback();
        }
    }

    function s0(){
        console.log("正在等待元素出现s0");
        //s5();
        s2();
        s3();
        //s4();
    }
    waitForKeyElements2(".ant-tree-title", s0);
    waitForKeyElements2(".ant-tree-treenode", s5, 3);
    //waitForKeyElements(".ant-tree-title", s0);

    // Your code here...
    const delay = 2 * 1000;

    //***************************layer**********************************
    function uselayer(config){
        const itemId = config.itemId||"1716378155288289281";
        let updatejsondata =
            {
                "parentId": '907437904664461312',
                "itemId": itemId,
                "itemName": "",
                "itemCode": "",
                "conf": {
                    "id": "",
                    "appModuleConfigJson": ""
                },
                "maintainer": "",
                "method": "post"
            };
        layui.use(['form'], function(){
            const layer = layui.layer;
            const form = layui.form;
            const $ = layui.jquery;
            const logindata = localStorage.logindata ? JSON.parse(localStorage.logindata):{};
            layer.open({
                type: 1,
                title:"配置 App JSON 【" + config.itemName + "】",
                skin: 'layui-layer-rim', //加上边框
                area: ['900px', '600px'], //宽高
                content: layerform()
            });
            readLocal();
            layui.$('#readlocal').on('click', function(){
                readLocal();
            });

            layui.$('#appid').on('click', function(){
                // this.href = 'https://iov.changan.com.cn/monitor2/api/carSeries/' + itemId;
                const update = getAppid(itemId);
            });



            // 提交事件
            form.on('submit(updatejson)', function(data){
                var field = data.field; // 获取表单字段值
                // 显示填写结果，仅作演示用
                logindata.token = field.token;
                logindata.cookie = field.cookie;
                localStorage.setItem("logindata", JSON.stringify(logindata));
                // layui.data("logindata", {key:"token", value:field.token});
                // layui.data("logindata", {key:"cookie", value:field.cookie});
                // getAppid("1716378155288289281")
                // 此处可执行 Ajax 等操作
                updatejson(field.json);
                // …
                return false; // 阻止默认 form 跳转
            });


            function ajax1(type, url,successCallback, data){
                const ajaxobj = {
                    type:type||"post",
                    url: url,
                    dataType: "json",
                    header:[{"auth-token": logindata.token},{Cookie: logindata.cookie},
                            {"Access-Control-Allow-Origin":"*"},{'Content-Type':'application/json'}],
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data||""),
                    success: function (res){
                        successCallback(res);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.alert('操作失败！！！' + XMLHttpRequest.status + "|" + XMLHttpRequest.readyState + "|" + textStatus, { icon: 5 });
                    }
                };
                $.ajax(ajaxobj);
            }
            function getAppid(itemId){
                const url = BASE_URL + '/monitor2/api/carSeries/' + itemId;
                const success = (resp) => {
                    if(resp.success){
                        const resdata = resp.data;
                        updatejsondata.itemName = resdata.itemName;
                        updatejsondata.itemCode = resdata.itemCode;
                        updatejsondata.maintainer = resdata.maintainer;
                        updatejsondata.conf.id = resdata.conf.id;
                        form.val("config-filter",{appid:resdata.conf.id});
                        // updatejsondata.conf.appModuleConfigJson = ;
                    } else {
                        form.val("config-filter",{appid:resp.msg});
                    }
                    // return updatejsondata;
                };
                ajax1("get", url, success);
            }

            function updatejson(json){
                const url = BASE_URL + '/monitor2/api/carSeries/update';
                updatejsondata.conf.appModuleConfigJson = json;
                const success = (resp) => {

                    if(resp.success){
                        layer.msg("修改成功");
                    }
                };
                ajax1("post", url, success, updatejsondata);
            }

            function readLocal(){
                // const logindata = layui.data("logindata");
                if(logindata && logindata.token){
                    form.val("config-filter",{token:logindata.token, cookie:logindata.cookie});
                }
                if(config && config.conf){
                    //let json = config&&config.conf && config.conf.appModuleConfigJson;
                    form.val("config-filter",{json:config.conf.appModuleConfigJson});
                }
            }
        });
    }

    function readLocal(layui, form){
        const logindata = layui.data("logindata");

        if(logindata && logindata.token){
            form.val("config-filter",{token:logindata.token, cookie:logindata.cookie});
        }

    }

    function layerform(){
        const content =
              '<div class="layui-layout"> ' +
              '	<form lay-filter="config-filter" class="layui-form" style="margin: 10px 10px 0px 0px;" action="">' +
              '   <div class="layui-form-item">\n' +
              '    <label class="layui-form-label">App ID</label>\n' +
              '    <div class="layui-input-block">\n' +
              '      <input type="text" name="appid" lay-verify="required" autocomplete="off" lay-affix="clear" class="layui-input">\n' +
              '    </div></div>'+
              '   <div class="layui-form-item">\n' +
              '    <label class="layui-form-label">Token</label>\n' +
              '    <div class="layui-input-block">\n' +
              '      <input type="text" name="token" lay-verify="required" autocomplete="off" lay-affix="clear" class="layui-input">\n' +
              '    </div></div>'+
              '   <div class="layui-form-item">\n' +
              '    <label class="layui-form-label">Cookie</label>\n' +
              '    <div class="layui-input-block">\n' +
              '      <input type="text" name="cookie" lay-verify="required" autocomplete="off" lay-affix="clear" class="layui-input">\n' +
              '    </div></div>'+
              '	<div class="layui-form-item layui-form-text">' +
              '		<label class="layui-form-label">App JSON</label>' +
              '		<div class="layui-input-block">' +
              '			<textarea name="json" placeholder="请粘贴JSON配置" style="height: 300px;" class="layui-textarea"></textarea></div></div>' +
              '	<div class="layui-form-item">' +
              '		<div class="layui-input-block">' +
              '			<button id="readlocal" type="button" class="layui-btn">读取Token</button>' +
              '			<a target="_blank" href="' + BASE_URL + '/acenter/#/welcome" class="layui-btn">跳转登录</a>' +
              '			<button type="button" id="appid" class="layui-btn">获取App ID</button>' +
              '			<button type="submit" class="layui-btn" lay-submit lay-filter="updatejson">提交</button>' +
              '			<button type="reset" class="layui-btn layui-btn-primary">重置</button>' +
              ' </div></div></form></div>';

        return content;
    }

    //***************************layer**********************************


    function storeToken(value){
        localStorage.setItem("Authorization", value);
    }


    function layerformlevel(id){
        const content =
              '<div class="layui-layout"> ' +
              '	<form lay-filter="config-level-filter" class="layui-form" style="margin: 10px 10px 0px 0px;" action="">' +
              '   <div class="layui-form-item">\n' +
              '    <label class="layui-form-label">Level ID</label>\n' +
              '    <div class="layui-input-block">\n' +
              '      <input type="text" readonly name="levelid" lay-verify="required" autocomplete="off" value="'+id+'" lay-affix="clear" class="layui-input">\n' +
              '    </div></div>'+
              '   <div class="layui-form-item">\n' +
              '    <label class="layui-form-label">Authorization</label>\n' +
              '    <div class="layui-input-block">\n' +
              '      <input type="text" id="Authorization" name="Authorization" lay-verify="required" autocomplete="off" lay-affix="clear" class="layui-input" onblur="storeToken(this.value)">\n' +
              '    </div></div>'+
              '	<div class="layui-form-item layui-form-text">' +
              '		<label class="layui-form-label">App JSON</label>' +
              '		<div class="layui-input-block">' +
              '			<textarea name="json" lay-verify="required"  placeholder="请粘贴JSON配置" style="height: 300px;" class="layui-textarea"></textarea></div></div>' +
              '	<div class="layui-form-item">' +
              '		<div class="layui-input-block">' +
              '			<button id="readremoteconfig" type="button" class="layui-btn">读取配置列表</button>' +
              '			<button type="submit" class="layui-btn" lay-submit lay-filter="updatejson">提交</button>' +
              '			<button type="reset" class="layui-btn layui-btn-primary">重置</button>' +
              ' </div></div></form></div>';

        return content;
    }

    const UPDATE_ITEM = {level:"LEVEL_ITEM",query:"QUERY_LIST"};
    var UPDATE_ITEM_NAME;
    function openlevellayer(id, updateitemname, currentItemName){
        UPDATE_ITEM_NAME = UPDATE_ITEM[updateitemname];
        layui.use(['form'], function(){
            const layer = layui.layer;
            const form = layui.form;
            const $ = layui.jquery;
            const i = layer.open({
                type: 1,
                title:"配置 Level JSON 【" + currentItemName + "】",
                skin: 'layui-layer-rim', //加上边框
                area: ['900px', '600px'], //宽高
                content: layerformlevel(id)
            });

            form.val("config-level-filter",{Authorization:localStorage.Authorization});

            layui.$('#readremoteconfig').on('click', function(){

                // let levelId = $("#levelid").val();
                getRemoteConfig(id);
            });

            layui.$('#Authorization').on('blur', function(){
                localStorage.setItem("Authorization", this.value);
            });


            // 提交事件
            form.on('submit(updatejson)', function(data){
                const field = data.field; // 获取表单字段值
                // 显示填写结果，仅作演示用
                // layer.alert(JSON.stringify(field), {
                //     title: '当前填写的字段值'
                // });
                // 此处可执行 Ajax 等操作

                //const itemName = UPDATE_ITEM.querydataflag


                if(updateLevelJson(field.json)){
                    layer.msg("批量修改Level配置成功！");
                    layer.close(i);
                }

                return false; // 阻止默认 form 跳转
            });



            function updateLevelJson(json) {
                const url = BASE_URL + "/nebula-apigw/configcenter-nebula/admin/api/appConfig/updateConfigJson";
                let data = {jsonStr:json , itemCode: ""};

                const items = localStorage.getItem(UPDATE_ITEM_NAME);
                if(!items){
                    layer.alert("未获取到数据！");
                    return false;
                }

                var loadIndex = layer.msg('修改中', {
                    icon: 16,
                    shade: 0.01
                });

                let LEVEL_ITEM = JSON.parse(items);

                if(updateitemasync(LEVEL_ITEM)){
                    layer.close(loadIndex);
                    localStorage.removeItem(UPDATE_ITEM_NAME);
                    return true;
                }
                return false;

                // function success(resp) {
                //     layer.msg("Level配置成功！")
                // }


                //return updateitem(UPDATE_ITEM_NAME);



                //*************************************await****************************************//
                function ajax3(type, url, data){
                    return new Promise((resolve,reject)=>{
                        ajax2(type, url, data,(res)=>{
                            resolve(res);
                        });

                    }).then((res)=>{
                        //var data = JSON.parse(res).data
                        console.log(res.msg);
                    });
                }

                async function updateitemasync(LEVEL_ITEM){

                    var length = 0;
                    if(LEVEL_ITEM && (length = LEVEL_ITEM.length) > 0){
                        for(let i = 0; i < length; i++){
                            data.itemCode = LEVEL_ITEM[i].itemCode;
                            console.log("正在发送修改配置await", i, LEVEL_ITEM[i].itemName);
                            await ajax3("post", url, data);
                        }
                    }

                    return true;
                }
                //*************************************await****************************************//



                function updateitem(itemName){
                    const items = localStorage.getItem(itemName);
                    if(!items){
                        layer.alert("未获取到数据！");
                        return false;
                    }

                    var loadIndex = layer.msg('修改中', {
                        icon: 16,
                        shade: 0.01
                    });

                    let LEVEL_ITEM = JSON.parse(items);
                    LEVEL_ITEM && LEVEL_ITEM.forEach(item => {
                        data.itemCode = item.itemCode;
                        console.log("正在发送修改配置：",item.itemName);
                        ajax2("post", url, data);
                        //await post(2000)
                    });
                    layer.close(loadIndex);
                    localStorage.removeItem(itemName);
                    return true;
                }
            }

            function getRemoteConfig(id) {
                const url = BASE_URL + "/nebula-apigw/configcenter-nebula/admin/api/carSeries/getCarSeriesConfByPage?currentPage=1&pageSize=999&levelId=" + id;

                function success(resp) {
                    if(resp.success){
                        const LEVEL_ITEM = [];
                        const data = resp.data;
                        data.list && data.list.forEach(item => {
                            LEVEL_ITEM.push({itemName: item.itemName, itemCode:item.itemCode});
                        })
                        localStorage.setItem("LEVEL_ITEM", JSON.stringify(LEVEL_ITEM));
                        layer.alert("成功读取并保存" + LEVEL_ITEM.length + "条配置");
                    } else {
                        layer.alert(resp.msg);
                    }
                }

                ajax2("get", url, "", success);
            }

            function ajax2(type, url, data, successCallback){
                const ajaxobj = {
                    type:type||"post",
                    url: url,
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Authorization", localStorage.Authorization);
                    },
                    data: JSON.stringify(data||""),
                    success: function (res){
                        successCallback && successCallback(res);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.alert('操作失败！！！' + XMLHttpRequest.status + "|" + XMLHttpRequest.readyState + "|" + textStatus, { icon: 5 });
                    }
                };
                $.ajax(ajaxobj);
            }
        });
    }
    //***************************layer**********************************


    var ALL_CONFIG;// = JSON.parse(localStorage.allConfig||{});
    function getConfig(itemName){
        if(!ALL_CONFIG){
            ALL_CONFIG = JSON.parse(localStorage.allConfig);
        }
        var config = ALL_CONFIG.find(cfg => cfg.itemCode == itemName);
        return config;

    }

    function s5(){
        var upt = '<span class="ant-tree-indent"><button type="button" class="layui-btn layui-btn-xs layui-btn-primary car-series-config">配置</button></span>';
        $(".ant-tree-treenode").each((i,e) =>{
            if(i < 2) return true;
            $(e.lastChild).before(upt);
        });
        $(".car-series-config").click((e)=>{
            let text = e.target.parentElement.nextSibling.title;//SL03 ICA2-X[C385-ICA2]
            text = text.substring(text.indexOf("[") + 1, text.length - 1);
            let config = getConfig(text);
            uselayer(config);
            //if(config && config.conf)
        });
        //         console.log(GM_getValue("allConfig"));
        //         console.log(localStorage.allConfig);
    }
    //点击标题事件
    function s2(switcher){
        $(".ant-tree-title").click(function(){
            timeout(()=>{
                s1();
                tablerefresh();
            });
            //levelclick(this)
        });
        //$(".ant-tree-title").dblclick(uselayer);
    }
    //点击+号事件
    var children;
    var switcher = false;
    function s4(){
        $(".ant-tree-switcher_close").click(function(e){
            //timeout(s2,500)
            switchercounter = 0;

            if(this.className.includes("ant-tree-switcher_close")){
                //监听元素插入并绑定点击事件
            }
            //配置按钮绑定点击事件

        });
    }

    function getchildren(level){
        const title = $(level).next("span").attr("title");
        const itemName = title.substring(title.indexOf("[") + 1, title.length - 1);
        const config = getConfig(itemName);
        return config ? config.children:null;//Array
    }

    function domInserted(selector, callback){
        // 创建一个观察器实例并传入一个回调函数
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                //console.log('一个节点被插入：', e);
                //                 for (var i = 0; i < e.addedNodes.length; i++) {
                //                     console.log('Added node: ', e.addedNodes[i]);
                //                 }
                //                 for (var i1 = 0; i1 < e.removedNodes.length; i1++) {
                //                     console.log('Removed node: ', e.removedNodes[i1]);
                //                 }
                mutation.addedNodes.forEach((e)=>{
                    callback&&callback(e);
                });
            });
        });

        // 配置观察选项:
        var config = { attributes: true, childList: true, subtree: true };

        // 选择需要观察变动的节点
        var targetNode = document.querySelector(selector);//document.getElementsByClassName("ant-tree-list")[0];

        // 传入目标节点和观察选项开始观察
        targetNode && observer.observe(targetNode, config);

        // 之后，你可以停止观察
        // observer.disconnect();
    }

    //点击+号事件
    var switchercounter = 0;
    function s3(flag){
        var callback = function(e){
            if(e.className.includes("ant-tree-treenode-switcher-close")){
                e.onclick = function(){
                    timeout(()=>{
                        s1();
                        tablerefresh();
                    });
                };
            }
        }
        domInserted(".ant-tree-list", callback);
        return false;
        $(".ant-tree-list").bind("DOMNodeInserted", e => {
            const target = e.target;
            //console.log(switchercounter,e.target,e.target.className)
            if(target.innerText.includes("\n配置")){
                e.stopPropagation();
                return false;
            }
            //             if(!switcher){
            //                 e.stopPropagation();
            //                 return false;
            //             }
            //             switcher = false;
            if(target.className.includes("ant-tree-treenode-switcher-close")){
                console.log("ant-tree-list DOMNodeInserted 执行次数：", ++switchercounter, target.innerText, new Date().toLocaleString());
                if(children){
                    //const child = children.filter(cfg => cfg.itemName == target.innerText)
                    //if(child && child.length > 0){
                    //const id = child[0].itemId;
                    const child = children[switchercounter - 1];
                    const id = child.itemId;
                    const append = '<button id="' + id + '" type="button" class="layui-btn layui-btn-xs layui-btn-primary updatelevel">配置</button>';
                    $(target).append(append);
                    //$(target).html(target.innerHTML + append);
                    //target.innerHTML += append;
                    target.lastChild.onclick = function(){
                        openlevellayer(id, "level", child.itemName);
                    };
                    //console.log(target)
                    //}
                }

                target.onclick = function(){
                    timeout(()=>{
                        s1();
                        tablerefresh();
                    });
                };
            }
        });
    }
    function levelclick(dom){
        var leveltree = $(dom).find(".ant-tree-title");
        if(leveltree && leveltree.length > 0)
            leveltree.click(s2);
    }
    //点击查询按钮
    var querycounter = 0;
    function s1(){
        waitForKeyElements2 (
            ".ant-btn-primary",
            function(){
                $(".ant-btn-primary").click(()=>{
                    console.log("查询按钮点击次数：", ++querycounter, new Date().toLocaleString(),"即将执行 tablerefresh ");
                    tablerefresh();
                    updateQueryButton();
                });
            }
        );
    }

    function updateQueryButton(){
        if($(".updatequeryjson").length > 0) return;
        //const btn_cls = document.getElementById("updatequeryjson").parentElement.previousSibling.firstElementChild.lastElementChild.className;
        const btn_cls = document.getElementsByClassName("ant-btn-primary")[0].className;
        const apd = '<div class="ant-space-item" style=""><button type="button" class="' + btn_cls + ' updatequeryjson" id="updatequeryjson"><span>批量配置</span></button></div>';
        //$(".ant-btn-primary").parents(".ant-space").append(apd);
        $("#itemCode").parents(".ant-col").next(".ant-col").find(".ant-space-item").last().after(apd);
        $("#updatequeryjson").click(()=>{
            var itemNames = "";
            var itm = $("#itemName").val();
            if(itm)itemNames += itm;
            itm = $("#itemCode").val();
            if(itm)itemNames += itm;

            openlevellayer("批量修改查询列表数据", "query", itemNames);
        });
    }

    function tablerefresh(){

        var counter = 0;
        setTimeout(function(){
            console.log("tablerefresh 执行次数：", ++counter, new Date().toLocaleString());
            var table = $(".ant-table-tbody");
            if(table && table.length > 0){
                rowsclick();
                domInserted(".ant-table-tbody",(e)=>{clickarow(e);})

//                 table.bind('DOMNodeInserted', function(e) {
//                     //rowsclick()
//                     clickarow(e.target);
//                 });
            }
        },delay);
    }

    function rowsclick(){
        var row = $(".ant-table-tbody > .ant-table-row");
        row.each(function(i,e){
            clickarow(e);
            //             var edit = $(this).find(".ant-space-item");
            //             e.style.background = "white";
            //             edit.click(function(){
            //                 e.style.background = "green";
            //                 //timeout(editclick,500)
            //             })
        });
        //         row.click(function(){
        //             this.style.background = "green";
        //         })
    }

    function clickarow(domm){
        domm.style.background = "white";
        var edit = $(domm).find(".ant-space-item");
        edit.click(function(){
            domm.style.background = "green";
        });

        var nojson = !domm.innerText.includes("✔");
        if(nojson && edit.length > 2){
            edit[2].firstChild.style.color = "gray";
        }

    }

    function editclick(){
        var dialog = $(".ant-modal-content");
        if(dialog && dialog.length > 0){
            var button1 = '<button type="button" id="setdemo" class="ant-btn css-1me4733 ant-btn-primary"><span>设置内销车</span></button>';
            $(".ant-modal-footer").append(button1);
        }

        $("#setdemo").click(function(e){
            alert(100);
        });
    }

    function timeout(f,t){
        const tout = t||delay;
        setTimeout(f,tout);
    }
})();