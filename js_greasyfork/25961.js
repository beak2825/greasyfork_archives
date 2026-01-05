// ==UserScript==
// @name         trello Card to Excel
// @namespace    http://www.hi-j.com/
// @version      0.1.3
// @description  trello Card to Excel suppert custom fields
// @author       will
// @match        http*://*trello.com/b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25961/trello%20Card%20to%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/25961/trello%20Card%20to%20Excel.meta.js
// ==/UserScript==

(function() {
    function Map(){
        this.container = new Object();
    }
    Map.prototype.put = function(key, value){
        this.container[key] = value;
    };
    Map.prototype.get = function(key){
        return this.container[key];
    };
    var tableToExcel = (function() {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="font-size:15px;" border="1">{table}</table></body></html>',
            base64 = function(s) {
                return window.btoa(unescape(encodeURIComponent(s)));
            },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g,
                                 function(m, p) {
                    return c[p];
                });
            };
        return function(table, name) {
            if (!table.nodeType) table = document.getElementById(table);
            var ctx = {
                worksheet: name || 'Worksheet',
                table: table.innerHTML
            };
            window.location.href = uri + base64(format(template, ctx));
        };
    })();
    var getPluginDataById = function(pluginData){
        var obj = null;
        if(pluginData.length > 0){
            //onsole.log(pluginData.length);
            $.each(pluginData,function(){
                if(this.idPlugin == '56d5e249a98895a9797bebb9'){  //判断是自定义字段的插件ID
                    //onsole.log(this.value);
                    eval('obj = '+this.value+';');
                    return obj;
                }
            });
        }
        return obj;
    };
    var getPluginFields = function(data){
        var pluginFields = new Array();
        var tmp = getPluginDataById(data.pluginData);
        if(tmp){
            var fields = tmp.fields;
            $.each(fields,function(){
                pluginFields.push(this);
            });
        }
        return pluginFields;
    };
    //  获取{id,value}  id == key , return value;
    var getPlauginVal = function(data,key){
        var ret = null;
        $.each(data,function(){
            if(this.id == key){
                ret = this.value;
                return ret;
            }
        });
        return ret;
    };
    var getListMap = function(data){
        var map = new Map();
        $.each(data.lists,function(){
            map.put(this.id,this.name);
            //onsole.log(this.id+":"+this.name);
        });
        return map;
    };
    var getMembersMap = function(data){
        var map = new Map();
        $.each(data.members,function(){
            map.put(this.id,this);
        });
        return map;
    };
    var init = function(){
        var test = $('<a class="board-header-btn board-header-btn-org-name board-header-btn-without-icon"><span class="board-header-btn-text" id="tableToExcel">导出Excel</span></a>');
        test.click(function(){
            $.getJSON(window.location.href+".json", function(data) {
                var members = getMembersMap(data);
                var pluginFields = getPluginFields(data);
                var table = document.createElement("table");
                // 标题开始
                tr = document.createElement("tr");  //tr start
                var tds = ['标题','状态','标签','成员','过期'];
                $.each(pluginFields,function(){
                    tds.push(this.n);
                });
                $.each(tds,function(){
                    td = document.createElement("td");
                    td.style.backgroundColor = "red";
                    td.innerHTML = this;
                    tr.append(td);
                });
                table.append(tr); // tr end
                // 内容开始
                var listMap = getListMap(data);
                var tr,td,pluginData;
                $.each(data.cards,function(){
                    if(this.name.indexOf('#') == -1){
                        tr = document.createElement("tr"); // tr start
                        // 标题
                        td = document.createElement("td");
                        td.innerHTML = this.name;
                        tr.append(td);
                        // 状态
                        td = document.createElement("td");
                        td.innerHTML = listMap.get(this.idList);
                        tr.append(td);
                        // 标签
                        td = document.createElement("td");
                        var str = "";
                        if(this.labels.length > 0){
                            $.each(this.labels,function(){
                                str += this.name+",";
                            });
                            if(str.length > 0){
                                str = str.substring(0,str.length-1);
                            }
                        }
                        td.innerHTML = str;
                        tr.append(td);
                        // 成员
                        td = document.createElement("td");
                        str = "";
                        if(this.idMembers.length > 0){
                            $.each(this.idMembers,function(){
                                str += members.get(this).fullName+",";
                            });
                            if(str.length > 0){
                                str = str.substring(0,str.length-1);
                            }
                        }
                        td.innerHTML = str;
                        tr.append(td);
                        // 过期
                        td = document.createElement("td");
                        td.innerHTML = this.due;
                        tr.append(td);
                        // 插件
                        if(this.pluginData.length > 0){  // 判断没有插件的
                            var pluginData = getPluginDataById(this.pluginData).fields;
                            $.each(pluginFields,function(){
                                td = document.createElement("td");
                                if(this.t == '0'){
                                    td.innerHTML = pluginData[this.id] || '';
                                }else if(this.t == '4'){
                                    td.innerHTML = getPlauginVal(this.o,pluginData[this.id]) || '';
                                }else if(this.t == '3'){
                                    td.innerHTML = pluginData[this.id] || '';
                                }else{
                                    console.log(this.t +"--"+ pluginData[this.id]);
                                    // todo
                                }
                                tr.append(td);
                            });
                        }
                        table.append(tr); // tr end
                    }
                });
                //onsole.log(table.innerHTML);
                tableToExcel(table);
            });
        });
        $('div.board-header').append(test);
    };
    setInterval(function(){
        if(!$('#tableToExcel').html()){
            init();
        }
    },1000);
})();