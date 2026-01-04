// ==UserScript==
// @name         为 echart 编辑器添加缓存工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://echarts.apache.org/examples/zh/editor.html*
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414739/%E4%B8%BA%20echart%20%E7%BC%96%E8%BE%91%E5%99%A8%E6%B7%BB%E5%8A%A0%E7%BC%93%E5%AD%98%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/414739/%E4%B8%BA%20echart%20%E7%BC%96%E8%BE%91%E5%99%A8%E6%B7%BB%E5%8A%A0%E7%BC%93%E5%AD%98%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var storage = (function(){
        return {
            warning: false,
            list: "_tmp_save_list_",
            map: "_tmp_save_map_",
            current: "",
            saveId: null,
            tmpList: [], // 这里理解为 id
            listMap: {}, // 这里理解为 id 对应的名字，便于使用者看
            get(name,def) {
                let s = localStorage.getItem(name);
                if (s) {
                    return JSON.parse(s);
                } else {
                    return def;
                }
            },
            save(name,val) {
                localStorage.setItem(name,JSON.stringify(val));
            },
            remove(name) {
                localStorage.removeItem(name);
            }
        }
    })();

    var ul = $('#navbar-collapse .navbar-left');

    storage.tmpList = storage.get(storage.list,[]);
    storage.listMap = storage.get(storage.map,{});

    var saveLi = $(`<li id="nav-save"><a href="#">保存</a></li>`);
    var saveAsLi = $(`<li id="nav-save" style="display: none;"><a href="#">另保存</a></li>`);

    function openSaveDialog(newOne) {
        if (storage.saveId) {
            clearTimeout(storage.saveId);
        }
        storage.saveId = setTimeout(function () {
            if (!storage.warning) {
                storage.warning = true;
                alert('代码并不能被长期保存，请自己妥善管理');
            }
            if (!newOne && storage.current) {
                storage.save(storage.current,{code: gb.editor.getValue()});
                return;
            } else {
                let name = "code_" + (new Date().getTime());
                let cname = prompt("名称",name);
                if (cname) {
                    storage.current = name;
                    storage.save(name,{code: gb.editor.getValue()});
                    storage.tmpList.push(name);
                    storage.save(storage.list,storage.tmpList);
                    storage.listMap[name] = cname;
                    storage.save(storage.map,storage.listMap);
                    storage.saveId = null;
                    saveLi.find(`a`).text(`保存[${cname}]`);
                    saveAsLi.css({display: 'block'});
                }
            }
        },500);
    };

    saveLi.on('click',function () {
        openSaveDialog(false);
    });

    saveAsLi.on('click',function () {
        openSaveDialog(true);
    });

    var getLi = $(`<li id="nav-get"><a href="#">恢复</a></li>`);

    var selectDiv = $(`<div class="myPanel" style="overflow-y: scroll;width: 405px;display:none;position: absolute;top: 5px;left: 6px;padding: 5px;;height: calc(100vh - 10px);z-index: 10000;background: #d9edf7;"></div>`);

    var showSelectDiv = function() {
        let createBtns = (id,name) => `<div class="btn-group" role="group" style="padding-top: 3px;">
    <button type="button" class="btn btn-default disabled" style="width: 270px;outline:white;opacity: 1;text-overflow: ellipsis;white-space:nowrap;">${name}</button>
    <button type="button" class="btn btn-default" style="width: 55px;outline: white;" method="import" tar="${id}">导入</button>
    <button type="button" class="btn btn-default" style="width: 55px;outline: white;" method="delete" tar="${id}">删除</button>
</div>`;
        selectDiv.html("");
        let dom = `<div class="btn-group" role="group">
    <button tar="close" type="button" class="btn btn-default" style="width: 390px;outline:white;opacity: 1;text-overflow: ellipsis;white-space:nowrap;">关闭</button>
</div>`;
        storage.tmpList.forEach(item => {
            if (item in storage.listMap) {
                dom += createBtns(item,storage.listMap[item]);
            }
        });
        selectDiv.html(dom);
        selectDiv.find(`button[tar="close"]`).on('click',function () {
            selectDiv.css({display: "none"});
        });
        selectDiv.find(`button[method="import"]`).on('click',function () {
            let item = $(this).attr('tar');
            let code = storage.get(item,{code: ""});
            gb.editor.setValue(code.code);
            storage.current = item;
            saveLi.find(`a`).text(`保存[${storage.listMap[item]}]`);
            saveAsLi.css({display: 'block'});
        });
        selectDiv.find(`button[method="delete"]`).on('click',function () {
            let item = $(this).attr('tar');
            storage.remove(item);
            delete storage.listMap[item];
            storage.save(storage.map,storage.listMap);
            if (storage.tmpList.indexOf(item) !== -1) {
                storage.tmpList.splice(storage.tmpList.indexOf(item),1);
            }
            $(this).parent().remove();
        });
        selectDiv.css({display: 'block'});
    }

    getLi.on('click',function () {
        if (storage.tmpList.length) {
            showSelectDiv();
        } else {
            alert('没有保存记录');
        }
    });

    $('head').append(`<style>.myPanel::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    scrollbar-arrow-color:red;

}
.myPanel::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
    scrollbar-arrow-color:red;
}
.myPanel::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}</style>`)
    $('body').append(selectDiv);
    ul.append(saveLi);
    ul.append(saveAsLi);
    ul.append(getLi);
    // Your code here...
})();