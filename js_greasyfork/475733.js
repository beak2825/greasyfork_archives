// ==UserScript==
// @name         gitlablog
// @version      1.8
// @description  解析内容并以表格形式展示在弹出框中
// @author       mibo
// @include         *://*gitlab*
// @exclude         *://*commit*
// @grant        GM_getValue
// @grant        GM_setValue
// @license    GPL-3.0-only
// @icon    https://ae01.alicdn.com/kf/Hac1a58055c5047cdb91349e91aa208d5k.jpg
// @namespace 12345git
// @home-url   https://
// @homepageURL  https://



// @downloadURL https://update.greasyfork.org/scripts/475733/gitlablog.user.js
// @updateURL https://update.greasyfork.org/scripts/475733/gitlablog.meta.js
// ==/UserScript==
// 获取当前开关状态，默认为关闭


(function() {
    'use strict';
    var currentURL = window.location.href;

    // 检查URL是否包含"不需要日志的地方"
    var arr = ["commit",'/settings/','/edit','/-/'];
    arr.forEach(num => {
        if (currentURL.indexOf(num) !== -1 && currentURL.indexOf("/-/tree") == -1){
            console.log("URL中包含"+num+"，不执行脚本。主动报错，终止执行");
            xxxxxxxxxxxxxxxxxxxxxxxxxx
        }
        else {
            console.log(num);
            return
        }
    })

    var  jsonData='';


    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = "https://unpkg.com/layui@2.9.7/dist/layui.js";
    document.documentElement.appendChild(script);
    let script1 = document.createElement('link');
    script1.setAttribute('rel', 'stylesheet');
    script1.setAttribute('type', 'text/css');
    script1.href = "https://unpkg.com/layui@2.9.7/dist/css/layui.css";
    document.documentElement.appendChild(script1);

    var isEnabled = GM_getValue('isEnabled', false);

    // 创建一个开关按钮
    var toggleButton = document.createElement('button');
    toggleButton.innerHTML = isEnabled ? '日志已开启' : '日志已关闭';

    // 添加按钮到页面
    document.body.appendChild(toggleButton);
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px'; // 距离底部的距离
    toggleButton.style.right = '20px'; // 距离右边的距离
    toggleButton.style.zIndex = '9999'; // 确保按钮位于页面上其他元素之上

    // 添加按钮的点击事件
    toggleButton.addEventListener('click', function () {
        isEnabled = !isEnabled; // 切换开关状态
        toggleButton.innerHTML = isEnabled ? '日志已开启' : '日志已关闭';
        GM_setValue('isEnabled', isEnabled); // 保存开关状态
    });

    // 如果开关是开启状态，执行你的脚本
    if (isEnabled==false) {
        // 在这里编写你的脚本代码
        // 例如：
        // document.querySelector('body').style.backgroundColor = 'yellow';
        return
    }



    // 替换下面的JSON数据为您提供的数据
    var element = document.getElementById('project_id');
    var elementrepository_ref = document.getElementById('repository_ref').value;

    // 获取元素的原始值
    var originalValue = element.value;

    var protocolAndDomain = window.location.protocol + "//" + window.location.hostname;

    fetch(protocolAndDomain+'/api/v4/projects/'+originalValue+'/repository/commits?ref_name='+elementrepository_ref+'&per_page=150',{ method: 'GET', async: false })
        .then(response => {
        // 检查响应状态码
        if (!response.ok) {
            throw new Error('网络请求错误');
        }
        // 将响应解析为JSON
        return response.json();
    })
        .then(data => {
        // 将JSON数据赋值给jsonData变量

        console.log(data);
        jsonData = data

        function createPopup(jsonData) {
            // 创建表头
            var bf = '<table class="layui-table">  <colgroup>    <col width="70%">    <col width="15%">   <col width="15%">    <col>  </colgroup>';
            var end = '  </tbody></table>';
            var header = '<thead><tr>  <th>日志</th> <th>作者</th> <th>提交时间</th>  </tr></thead>  <tbody>';

            // 创建表格内容

            var rows='';
            for (var i = 0; i < jsonData.length; i++) {
                rows += '<tr>'+'<td><a href="'+jsonData[i].web_url+'" style="color: #1e9fff" >' + jsonData[i].message + '</a></td>' +'<td>' + jsonData[i].author_name + '</td>' +'<td>' + jsonData[i].committed_date.substring(0, 10) + '</td>'+'</tr>';
            };
            var layer = layui.layer;
            var util = layui.util;
            var $ = layui.$;
            layer.open({
                type: 1,
                offset: 'r',
                title:'分支 = '+elementrepository_ref,
                anim: 'slideRight', // 从右往左
                area: ['50%', '100%'],
                shade: 0.1,
                shadeClose: true,
                id: 'ID-demo-layer-direction-l',
                content: bf+header+rows+end,
            });
        }

        // 调用函数创建弹出框
        createPopup(jsonData);

    })
        .catch(error => {
        console.error('发生错误:', error);
    });



})();
