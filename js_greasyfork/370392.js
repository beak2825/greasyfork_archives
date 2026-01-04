// ==UserScript==
// @name         soyoung 静态资源查询
// @version      0.1
// @description  测试本页面使用的所有静态资源是否存在
// @author       lvkunpeng
// @match        http://sdeploy.sy.soyoung.com/diff
// @require      https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @grant        none
// @run-at       document-ready
// @namespace https://greasyfork.org/users/184669
// @downloadURL https://update.greasyfork.org/scripts/370392/soyoung%20%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/370392/soyoung%20%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    var flag = true
    // 添加匹配正则
    var reg = /(\/\/.+)<ins>(\d+)<\/ins>(.css|.js)/g
    // 更改之后的静态资源列表
    var list = []
    // 获取失败的静态资源
    var errList = []
    // 增加控制按钮
    $('.pull-right').append('<button type="button" class="btn btn-outline-primary btn-sm" id="check">校验静态资源</button>')
    // 绑定事件
    $('.pull-right').click(function(){
        //console.log(list.length)
        if(list.length){
            for(var i = 0;i<list.length;i++){
                checkR(list[i])
            }
            if(flag){
                alert("校验通过！")
            }
        }else{
            alert('没有匹配到有变化的静态资源！')
        }
    })
    // 获取gitlab diff 所有变更
    var allDiff = $('div.d2h-change span.hljs,div.d2h-ins span.hljs')
    allDiff.map(function($1,$2){
        var str = $($2).html()
        var result
        while((result = reg.exec(str)) != null){
            var val = result[1]+result[2]+result[3]
            list.push('http:'+val)
        }
        reg.exec($($2).html())
    })

    // 所有方法
    function checkR(url){
        $.ajax({
            type: "GET",
            url:url,
            async:false,
            statusCode: {404: function(){
              errList.push(url)
                var b = errList.distinct();
                if(flag){
                    alert('注意：存在没有打包的静态资源！请在控制台中查看具体的链接')
                    flag = false
                }
                console.log("错误资源列表：")
                console.log(b)
            }}
        });
    }
    Array.prototype.distinct = function (){
        var arr = this,
            i,
            obj = {},
            result = [],
            len = arr.length;
        for(i = 0; i< arr.length; i++){
            if(!obj[arr[i]]){ //如果能查找到，证明数组元素重复了
                obj[arr[i]] = 1;
                result.push(arr[i]);
            }
        }
        return result;
    };
    //console.log(list)
})();