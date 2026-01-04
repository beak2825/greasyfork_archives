// ==UserScript==
// @name eureka下线
// @namespace Violentmonkey Scripts
// @include http://10.*.*.*:5438/
// @include http://172.*.*.*:5438/
// @include http://192.168.*.*:5438/
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant GM_xmlhttpRequest
// @version 1.0.0
// @description eureka服务地址后增加下线按钮功能
// @downloadURL https://update.greasyfork.org/scripts/435246/eureka%E4%B8%8B%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/435246/eureka%E4%B8%8B%E7%BA%BF.meta.js
// ==/UserScript==

console.log(window.location.href);


//debugger;
    var table = $('.table.table-striped.table-hover')[2];    //获取服务注册表格
    $(table).find('tr').each(function (e) {    //遍历修改表格信息
        var bTag = $(this).find("b").eq(0);
        if (bTag.length == 0) {
            return;
        }
        //服务名
        var serviceName = bTag.text();

        $(this).find("a").each(function(a, tag) {    //遍历修改微服务信息
          //ip地址
          var ipAddr = tag.text;
          var butt = $(" <button >下线</button>");
          //添加onclick事件
          butt.on('click', function () {
            console.log(serviceName+"::"+ipAddr)
            var r=confirm("确定要下线【"+serviceName+"】服务,地址【"+ipAddr+"】？")
            if (r==true){
              var settings = {
                "url": window.location.href+"eureka/apps/"+serviceName+"/"+ipAddr,
                "method": "DELETE",
                "timeout": 0,
              };            
              $.ajax(settings).done(function (response) {
                console.log(response);
                //window.location.reload()
              });
            }
            else{
              console.log("已取消!")
            }

          });
          //ip地址后增加button按钮
          $(tag).after(butt);

        });
    });


