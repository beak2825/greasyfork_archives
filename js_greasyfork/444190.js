// ==UserScript==
// @name         yapi获取接口脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修复获取数据错误
// @author       wuyuanbo
// @match        http://yapi.dashuf.com/group/20
// @match        http://yapi.dashuf.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashuf.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license     GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444190/yapi%E8%8E%B7%E5%8F%96%E6%8E%A5%E5%8F%A3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444190/yapi%E8%8E%B7%E5%8F%96%E6%8E%A5%E5%8F%A3%E8%84%9A%E6%9C%AC.meta.js
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
  
  /*# sourceMappingURL=index.css.map */
  
  
  `;
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
    var heads = document.getElementsByTagName("head");
    let header = document.querySelector(".user-toolbar ul");
    let oneFn = document.createElement("li");
    oneFn.className = "toolbar-li";
    // 创建获取单一函数按钮
    oneFn.setAttribute("id", "getOneFn");
    oneFn.innerHTML = "复制接口";
    header.appendChild(oneFn);
    document.getElementById("getOneFn").onclick = function () {
      getData.stringList = "";
      // getData.getOne("fn");
      chooseTemplate();
    }


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
                */<br>
             </div>
  
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
                <li class="list" data-type="self"><span>自定义模板：</span><p><textarea col="10" row="10" id="template">// {{notes}}
  export function {{urlName}}(data) {
    &nbsp;&nbsp;return MyFetch.{{method}}(host + "{{url}}", data)
  };</textarea> <button class="confirmBtn" disabled="true">提交</button></p></li>
             </ul>
          </div></div>`);
    if(localStorage.getItem("template") !== undefined) {
      $("#template").val(localStorage.getItem("template"));
    };
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
      console.log($('#template').val());
      let str = $("#template").val();
      localStorage.setItem("template", str);
      // str = str.replace(/\{\{/g, "'+").replace(/\}\}/g, "+'");
      getData.generate(str);
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
              str = str.replace(key, data[key.replace(/\{|\}/g, "")]);
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
              variable.forEach(key => {
                result = result.replace(key, item[key.replace(/\{|\}/g, "")]);
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
            method = item.method;
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
            split = url.split("/");
            urlName = split[split.length - 2] + this.firstToUpper1(split[split.length - 1]);
            notes = item.title;
            method = item.method;
            json += `// ${notes}
                export function ${urlName}(data) {
                  return request({
                    url: host + "${url}",
                    method: "${method}",
                    ${method.toLowerCase() === "post" ? "data" : "params"}: data
                  })
                };
                `
            this.stringList += '// ' + notes + '\r\n' +
              'export function ' + urlName + '(data) {\r' +
              '  return request({\r' +
              '    url: host + "' + url + '",\r' +
              '    method: "' + method + '",\r' +
              '    ' + (method.toLowerCase() === "post" ? 'data' : 'params') + ': data\r' +
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
          let method = data.method;
          let url = data.path;
          let split = url.split("/");
          let urlName = split[split.length - 2] + this.firstToUpper1(split[split.length - 1]);

          if (type === "li") {
            result = `${urlName}: host + '${url}', // ${notes}`;
            this.stringList = urlName + ': host + "' + url + '", // ' + notes;
          } else {
            result = `// ${notes}
                export function ${urlName}(data) {
                  return request({
                    url: host + "${url}",
                    method: "${method}",
                    ${method.trim().toLowerCase() === "post" ? "data" : "params"}: data
                  })
                };
                `
            this.stringList = '// ' + notes + '\r\n' +
              'export function ' + urlName + '(data) {\r' +
              '  return request({\r' +
              '    url: host + "' + url + '",\r' +
              '    method: "' + method + '",\r' +
              '    ' + (method.trim().toLowerCase() === "post" ? 'data' : 'params') + ': data\r' +
              '  })\r' +
              '};\r'
          }
          console.log(result);
          this.shearPlate(this.stringList);
        });


      }
    }

    // Your code here...
  })();
}