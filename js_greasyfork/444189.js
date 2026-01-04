// ==UserScript==
// @name         yapi获取接口脚本
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  添加可选参数列表、如接口地址为xx/xx/{id},会将接口改为xxx/xx/ + id
// @description4  修复重命名导致的函数冲突
// @description3  解决鼠标事件冲突，避免拖动后直接打开
// @description2  添加可拖拽功能
// @description1  更新缓存为列表，可以设置更多的模板
// @author       wuyuanbo
// @match        http://yapi.dashuf.com/group/20
// @match        http://yapi.dashuf.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashuf.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license     GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444189/yapi%E8%8E%B7%E5%8F%96%E6%8E%A5%E5%8F%A3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444189/yapi%E8%8E%B7%E5%8F%96%E6%8E%A5%E5%8F%A3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
window.onload = function () {
    (function () {
        'use strict';
        const css = `
  .layout {
    position: fixed;
    display: none;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    left: 0;
    top: 0;
  }

  .model {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 5px #ccc;
    box-sizing: border-box;
    z-index: 1;
  }
  .model .title {
    font-size: 20px;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    position: relative;
  }
  .model .title .g-right {
    position: absolute;
    right: 10px;
    top: 25px;
    cursor: pointer;
    display: inline-block;
    width: 20px;
    height: 2px;
    background: #999;
    line-height: 0;
    font-size: 0;
    vertical-align: middle;
    transform: rotate(45deg);
  }
  .model .title .g-right:after {
    content: "/";
    display: block;
    width: 20px;
    height: 2px;
    background: #999;
    transform: rotate(-90deg);
  }
  .model .title .g-right::before {
    content: "";
    position: absolute;
    left: 0px;
    top: -10px;
    width: 20px;
    height: 20px;
  }
  .model .tips {
    font-size: 14px;
    color: #999;
    padding-left: 20px;
  }
  .model ul {
    padding: 20px;
  }
  .model ul li {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    border: 1px solid #ccc;
    border-bottom: 0;
    padding: 0 10px;
  }
  .model ul li span {
    padding: 10px 0;
    flex: 0 0 100px;
    font-size: 14px;
    color: #999;
  }
  .model ul li p {
    width: 100%;
    padding: 10px;
    border-left: 1px solid #ccc;
  }
  .model ul li p textarea {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    height: 100px;
  }
  .model ul .list:last-child {
    border-bottom: 1px solid #ccc;
  }
  .model ul .list:hover {
    background: #eee;
  }
  .model ul .list.active {
    background: #eee;
  }
  .suspension {
    position: fixed;
    right: 10px;
    bottom: 40%;
    width: 60px;
    height: 60px;
    z-index: 999;
    border-radius: 100%;
    font-size: 16px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    box-sizing: border-box;
    padding: 10px;
    text-align: center;
    cursor: move;
  }

  /*# sourceMappingURL=index.css.map */


  `;
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        document.documentElement.appendChild(node);

        let suspension = document.createElement("div");
        suspension.className="suspension fixed";
        suspension.innerHTML = "复制接口";
        document.documentElement.appendChild(suspension);
        // var drag2=function(obj){
        //     obj.bind("mousedown",startDrag);
        // }
        // drag2($(document).find('.suspension'));
        let fixed = $(document).find('.suspension.fixed');
        var key = false;
        var firstTime = 0;
        var lastTime = 0;
        $(document).mousemove(function(e) {
            if (!!this.move) {
                // console.log(e);
                var posix = !document.move_target ? {'x': 0, 'y': 0} : document.move_target.posix,
                    callback = document.call_down || function(event) {
                        $(this.move_target).css({
                            'top': e.pageY - posix.y,
                            'left': e.pageX - posix.x
                        });
                    };
                callback.call(this, e, posix);
            }

        }).mouseup(function(e) {
            lastTime = new Date().getTime();
            if (!!this.move) {
                var callback = document.call_up || function(event){};
                callback.call(this, e);
                $.extend(this, {
                    'move': false,
                    'move_target': null,
                    'call_down': false,
                    'call_up': false
                });
            }
            if ((lastTime - firstTime) < 200) {
                key = true;
            }
        });

        var $box = fixed.mousedown(function(e) {
            var offset = $(this).offset();
            firstTime = new Date().getTime();
            this.posix = {'x': e.pageX - offset.left, 'y': e.pageY - offset.top};
            console.log(this.posix);
            $.extend(document, {'move': true, 'move_target': this});
        })
        //fixed.bind("mousedown", startDrag);
        //fixed.bind("mouseleave", stop);
        //$(document).on('mousedown', '.suspension', function() {
        //console.log($(this));
        //startDrag($(this));
        //    $(this).bind("mousedown", startDrag);
        //})
        $(document).on('click', '.suspension', function() {
            if (!key) {
                return;
            }
            key = false;
            getData.stringList = "";
            // getData.getOne("fn");
            chooseTemplate();
        })
        let templateList = [];
        try {
            if (localStorage.getItem("template")) {
                templateList = JSON.parse(localStorage.getItem("template"))
            }
        }
        catch(err) {
            console.error("此时缓存内储存的是字符串格式，将更新为数组格式");
            localStorage.setItem("template", JSON.stringify([]))
            templateList = [];
        }
        // let templateList = localStorage.getItem("template") ?  : [];

        // 创建model
        $("body").append(`
          <div class="layout">
          <div class="model">
             <div class="title">选择模板 <div class="g-right"></div></div>
             <div class="tips">
               /*<br>
                * @ urlName 路径拼接名称<br>
                * @ url 接口地址<br>
                * @ notes 注释<br>
                * @ method 请求方式<br>
                * 请使用以上参数，否则会报错失效<br>
                */<br>
             </div>
             <div><button class="getTableJSON">获取请求参数</button></div>
             <ul>
               <li class="list" data-type="str"><span>列表：</span><p>{{urlName}}: host + "{{url}}", // {{notes}}注释</p></li>
               <li class="list" data-type="fn"><span>函数：</span><p>
                                  // {{notes}}<br>
                                  export function {{urlName}}(data) {<br>
                  &nbsp;&nbsp;return request({<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;url: host + "{{url}}",<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;method: "{{method}}",<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;{{method.toLowerCase() === "post" ? "data" : "params"}}: data<br>
                  &nbsp;&nbsp;})<br>
                };<br></p></li>
                <li class="list" data-type="useSelf"><span>使用模板</span><p><select class="selectTemplateName">
                    <option>请选择</option>
					${
						templateList?.map(item => {
            return `<option value="${item.templateName}">${item.templateName}</option>`
						}).join("")
                         }
				<select> <button class="useTemplate" disabled="true">使用</button></p></li>
                <li class="list" data-type="self"><span><input placeholder="自定义模板：" type="text" class="templateName" style="width: 100px;"/></span><p><textarea col="10" row="10" id="template">// {{notes}}
  export function {{urlName}}(data) {
    &nbsp;&nbsp;return MyFetch.{{method}}(host + "{{url}}", data)
  };</textarea> <button class="confirmBtn" disabled="true">提交</button><button class="deleteTemplate" disabled="true">删除</button></p></li>
             </ul>
          </div></div>`);
        // 获取url路径id
        function getUrlId(strUrl) {
            strUrl = strUrl.split("/");
            return strUrl[strUrl.length - 1];
        };
        $(document).on('click', '.list', function () {
            $(".list").removeClass("active");
            $(this).addClass("active");
            let type = $(this).attr("data-type");
            $(".confirmBtn").attr("disabled", "true");
            getData.stringList = "";
            if (getUrlId(location.href).indexOf('cat_') === -1) {
                if (type === "str") {
                    getData.getOne();
                } else if (type === "fn") {
                    getData.getOne("fn")
                } else if (type === "self") {
                    $(".confirmBtn").removeAttr("disabled");
                }
            } else {
                if (type === "str") {
                    getData.getJson();
                } else if (type === "fn") {
                    getData.getFn("fn")
                } else if (type === "self") {
                    $(".confirmBtn").removeAttr("disabled");
                }
            }
        });

        $(document).on('click', '.g-right', function () {
            $('.layout').hide();
            $(".layout .list").removeClass("active");
        })
        // 选择模板
        function chooseTemplate() {
            $(".layout").show();
        };
        $(document).on('click', '.confirmBtn', function () {
            let str = $("#template").val();
            let templateName = $(".templateName").val();
            if(str === "") {
                alert("请输入模板");
                return false;
            }
            if (templateName === "") {
                alert("请输入模板名称");
                return;
            }
            if (templateList.some(item => item.templateName === templateName)) {
              templateList[templateList.findIndex(item => item.templateName === item.templateName)].template = str
            } else {
              templateList.push({templateName, template: str});
            }
            localStorage.setItem("template", JSON.stringify(templateList));
            // str = str.replace(/\{\{/g, "'+").replace(/\}\}/g, "+'");
            getData.updateTemplateOption();
            getData.generate(str);
        })

        // 删除按钮
        $(document).on('click', '.deleteTemplate', function() {
            getData.deleteTemplate(templateNameKey);
        });
        let templateNameKey = "";
        $(document).on("change", ".selectTemplateName", function() {
            let name = $(this).val();
            if (name) {
                templateNameKey = name;
                $(".deleteTemplate").removeAttr("disabled");
                $(".useTemplate").removeAttr("disabled");
                let obj = templateList[templateList.findIndex(item => item.templateName === name)];
                $("#template").val(obj.template);
                $(".templateName").val(obj.templateName);
            }
            else {
                $(".deleteTemplate").attr("disabled");
                $(".useTemplate").attr("disabled");
                $("#template").val();
                $(".templateName").val();
            }
        })
        $(document).on('click', '.useTemplate', function() {
            let obj = templateList[templateList.findIndex(item => item.templateName === templateNameKey)];
            getData.generate(obj.template);
        })
        $(document).on('click', '.getTableJSON', function() {
            getData.getRequestParameter()
        })

        let getData = {
            stringList: "",
            shearPlate: function (str) {
                const aux = document.createElement('textarea');
                aux.readOnly = 'readonly';
                aux.style.position = 'absoult';
                aux.style.left = '-9999px';
                aux.value = str;
                // 设置元素内容
                // aux.setAttribute('value', str)
                // 将元素插入页面进行调用
                document.body.appendChild(aux)
                // 复制内容
                aux.select()
                aux.setSelectionRange(0, aux.value.length);
                // 将内容复制到剪贴板
                document.execCommand('copy')
                // 删除创建元素
                document.body.removeChild(aux)
                alert(str + " 已复制到剪切板")
            },
            firstToUpper1: function (str) {
                // return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
                // toLowerCase 会将词组全部转换成小写
                str = str.replace(/\{|\}/g, "");
                return str.trim().replace(str[0], str[0].toUpperCase());
            },
            getData: function (callBack) {
                let data = {
                    id: getUrlId(location.href)
                };
                $.ajax({
                    type: "get",
                    url: "http://yapi.dashuf.com/api/interface/get",
                    data: data,
                    success: function (res) {
                        console.log(res);
                        if (res.errcode === 0) {
                            callBack(res.data);
                        }
                    }
                })
            },
            getTableData: function (callBack) {
                let data = {
                    catid: getUrlId(location.href).split("_")[1],
                    page: 1,
                    limit: 200
                };
                $.ajax({
                    type: "get",
                    url: "http://yapi.dashuf.com/api/interface/list_cat",
                    data: data,
                    success: function (res) {
                        if (res.errcode === 0) {
                            callBack(res.data.list);
                        }
                    }
                })
            },
            generate: function (str) {
                let json = "";
                console.log(str);
                let that = this;
                let variable = str.match(/\{\{(.+?)\}\}/g);
                if (getUrlId(location.href).indexOf('cat_') === -1) {
                    this.getData(data => {
                        data.notes = data.title;
                        data.url = data.path;
                        let split = data.url.split("/");
                        let urlName = split[split.length - 2] + this.firstToUpper1(split[split.length - 1]);
                        data.urlName = urlName;
                        variable.forEach(key => {
                            str = str.replace(key, key.replace(/\{|\}/g, "") === 'method' ? data[key.replace(/\{|\}/g, "")].toLowerCase() : data[key.replace(/\{|\}/g, "")]);
                        })
                        json += str;
                        that.stringList += str;
                        console.log(json);
                        that.shearPlate(this.stringList);
                    })
                } else {
                    this.getTableData(res => {
                        res.forEach(item => {
                            let result = JSON.parse(JSON.stringify(str));
                            item.url = item.path;
                            let split = item.url.split("/");
                            item.urlName = split[split.length - 2] + this.firstToUpper1(split[split.length - 1]);
                            item.notes = item.title;
                            item.method = item.method;
                            console.log(item.method);
                            variable.forEach(key => {
                                result = result.replace(key, key.replace(/\{|\}/g, "") === 'method' ? item[key.replace(/\{|\}/g, "")].toLowerCase() : item[key.replace(/\{|\}/g, "")]);
                            })

                            json += result;
                            that.stringList += result;
                        });
                        console.log(json);
                        that.shearPlate(that.stringList);
                    })
                }

            },
            getJson: function () {
                let json = "";
                // yapi拿到接口地址和拼接注释
                this.getTableData(table => {
                    table.forEach(item => {
                        let url, urlName, notes, method, split;
                        url = item.path;
                        split = url.split("/");
                        urlName = split[split.length - 2] + this.firstToUpper1(split[split.length - 1]);
                        notes = item.title;
                        method = item.method.toLowerCase();
                        json += `${urlName}: host + ${url}, // ${notes}
              `;
                        this.stringList += urlName + ': host + "' + url + '", // ' + notes + '\n'
                    })
                    console.log(json);
                    this.shearPlate(this.stringList);
                });

            },
            getFn: function () {
                let json = "";
                // yapi拿到接口地址和拼接注释
                this.getTableData(table => {
                    table.forEach(item => {
                        let url, urlName, notes, method, split;
                        url = item.path;
                        let urlId = this.getUrlID(url)
                        split = url.split("/");
                        urlName = split[split.length - 2] + (urlId ? urlId : this.firstToUpper1(split[split.length - 1]));
                        notes = item.title;
                        method = item.method.toLowerCase();
                        json += `// ${notes}
                export function ${urlName}(data) {
                  return request({
                    url: host + "${urlId ? url.replace(/\{.*\}/g, "") : url}"${ urlId ? "+" + urlId : "" },
                    method: "${method}",
                    ${urlId ? "" : method.trim().toLowerCase() === "post" ? "data: data" : "params: data"}
                  })
                };
                `
            this.stringList += '// ' + notes + '\r\n' +
                'export function ' + urlName + '(data) {\r' +
                '  return request({\r' +
                '    url: host + "' + url + '",\r' +
                '    method: "' + method + '",\r' +
                (urlId ? "" : '    ' + (method.trim().toLowerCase() === "post" ? 'data' : 'params') + ': data\r') +
                '  })\r' +
                '};\r'
                    })
                    console.log(json);
                    this.shearPlate(this.stringList);
                });

            },
            getOne: function (type = 'li') {
                this.getData(data => {
                    console.log(data);
                    let result = "";
                    let notes = data.title;
                    let method = data.method.toLowerCase();
                    let url = data.path;
                    let urlId = this.getUrlID(url)
                    let split = url.split("/");
                    let urlName = split[split.length - 2] + (urlId ? urlId : this.firstToUpper1(split[split.length - 1]));

                    if (type === "li") {
                        result = `${urlName}: host + '${url}', // ${notes}`;
                        this.stringList = urlName + ': host + "' + (urlId ? url.replace(/\{.*\}/g, "") : url) + '", // ' + notes;
                    } else {
                        result = `// ${notes}
                export function ${urlName}(${ urlId ? urlId : 'data' }) {
                  return request({
                    url: host + "${urlId ? url.replace(/\{.*\}/g, "") : url}"${ urlId ? "+" + urlId : "" },
                    method: "${method}",
                    ${urlId ? "" : method.trim().toLowerCase() === "post" ? "data: data" : "params: data"}
                  })
                };
                `
            this.stringList = '// ' + notes + '\r\n' +
                'export function ' + urlName + '('+ (urlId ? urlId : 'data') +') {\r' +
                '  return request({\r' +
                '    url: host + "' + (urlId ? url.replace(/\{.*\}/g, "") : url) + '"'+ (urlId ? "+" + urlId : "") +',\r' +
                '    method: "' + method + '",\r' +
                (urlId ? "" : '    ' + (method.trim().toLowerCase() === "post" ? 'data' : 'params') + ': data\r') +
                '  })\r' +
                '};\r'
                  }
                  console.log(result);
                  this.shearPlate(this.stringList);
              });


          },
            deleteTemplate: function(name) {
                let index = templateList.findIndex(item => item.templateName === name);
                let con = confirm("是否删除“"+templateList[index].templateName + "”模板？");
                if (con) {
                    templateList.splice(index, 1);
                    console.log(templateList);
                    this.updateTemplateOption();
                    $(".deleteTemplate").attr("disabled");
                    $(".useTemplate").attr("disabled");
                    $("#template").val();
                    $(".templateName").val();
                    localStorage.setItem("template", JSON.stringify(templateList));
                }
            },
            updateTemplateOption() {
                $(".selectTemplateName").html(`<option>请选择</option>${
            templateList.map(item => {
                  return `<option value="${item.templateName}">${item.templateName}</option>`
            }).join("")
                                            }`);
          },
            getRequestParameter() {
                let text = "";
                if (getUrlId(location.href).indexOf("cat_") > -1) {
                  alert("请进入详情页获取接口参数");
                  return;
                }
                this.getData(res => {
                    let properties = "";
                    if (res.method === "GET") {
                        properties = res.req_query
                    }
                    else {
                        properties = JSON.parse(res.req_body_other).properties;
                    }
                    for(let i in properties){
                        let item = properties[i];
                        if (res.method === "GET") {
                            text += '"' + item.name + '": '+ JSON.stringify(this.chooseType(item.type)) +', // ' +  properties[i].desc + '\r\n'
                        }
                        else {
                            text += '"' + i + '": '+ JSON.stringify(this.chooseType(properties[i].type)) +', // ' +  properties[i].description + '\r\n'
                        }
                    };
                    this.shearPlate(text);
                })
            },
            chooseType(type) {
                switch(type) {
                    case 'number':
                        return null;
                    case 'boolean':
                        return false;
                    case 'string':
                        return "";
                    case 'Array':
                        return [];
                    default:
                        return null;
                }
            },
            getUrlID(str) {
              let matchLength = str.match(/\{.*\}/g)
              let id = ""
              if (matchLength) {
                id = matchLength[0].replace(/\{|\}/g, "")
              }

              return id
            }
        }

        // Your code here...
        })();
}