// ==UserScript==
// @name                       DL ASMR search
// @name:zh-CN          DL ASMR 搜索
// @namespace            Meamomo
// @version                    0.2
// @description             Self-use DL ASMR explorer
// @description:zh-CN   自用DL ASMR探索器，官网辅助显示是否已有分享源。
// @author                     Meamomo
// @match                      *://www.dlsite.com/*
// @match                      *://dlsite.com/*
// @icon                         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require                    https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require                    https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.min.js
// @grant                       GM_log
// @downloadURL https://update.greasyfork.org/scripts/467159/DL%20ASMR%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/467159/DL%20ASMR%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //alert('欢迎');
    // https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
    //------------------------
    var asmrs = document.querySelectorAll("li.search_result_img_box_inner")
    console.log('当前页面的全部asmr作品：',asmrs[0])
    // 作品标题-声优
    // .work_img_main  .search_img work_thumb  .work_thumb_inner  img  -alt
    //var asmr_title = asmrs[0].querySelector(".work_thumb_inner img").alt
    //console.log('作品名字和声优@',asmr_title)
    // 作品标题
    // .work_img_main  .work_name  .multiline_truncate   a -title or innerText
    //var asmr_work_name = asmrs[0].querySelector('.multiline_truncate a').title
    //console.log('作品名字@',asmr_work_name)
    // 声优
    // .work_img_main  .maker_name  a -innerText
    //var asmr_maker_name = asmrs[0].querySelector('.maker_name a').innerText
    //console.log('声优@',asmr_maker_name)
    // 类型
    // .work_img_main  .work_genre  .icon_GEN -title or -innerText
    //var asmr_genre = asmrs[0].querySelector('.icon_GEN').title
    //console.log('作品类型@',asmr_genre)
    //-------------------------
    // 全部作品
    var asmrs_Obj = []
    // 每页的作品数量 30、50、100
    var asmrs_sum = asmrs.length   // 获取的当前页面的作品数量
    //console.log(asmrs_sum)
    // 单个作品 work main .work_btn_box
    for(let i = 0; i <= asmrs.length-1; i++) {
        let asmr_work = asmrs[i].querySelector('div.work_btn_box div')
        console.log(asmrs.length)
        // 获取 RJ 号
        let rj = asmr_work.getAttribute('data-product_id')
        let rj_number = rj.replace('RJ', '') // 将 "RJ" 替换成空字符串
        // 获取 作品名字
        let asmr_work_name_t = asmr_work.getAttribute('data-work_name')
        // 追加到数组对象中
        asmrs_Obj.push({
            rj:rj,
            rj_number:rj_number,
            asmr_work_name_t:asmr_work_name_t
        })
        //console.log('CJ@',rj,asmr_work_rj_number,'作品名字@',asmr_work_name_t)
    }
    // 查询作品
    for(let i = 0; i <= asmrs_sum-1; i++){
        searchASMR(asmrs_Obj[i].rj,i)
        //console.log(asmrs_Obj[i].rj)
    }
    // 方法：查询并在页面中标记有没有
    function searchASMR(rj,index){
        let rj_number = rj.replace('RJ','') // 将 "RJ" 替换成空字符串
        console.log('当前rj号：',rj,'——当前rj数字：',rj_number)
        var url = `https://api.asmr.one/api/workInfo/${rj_number}`;
        var proxyUrl = 'http://localhost:3000/proxy?url=' + encodeURIComponent(url);  //代理服务器url与参数
        // 请求代理服务器
        axios.get(proxyUrl)
            .then(function(response) {
                if(response.data.error) return console.log('错误@@@@@@@@@@@@@@@@@',response.data.error)
                console.log(response.data);
                // 创建节点
                var newEle = document.createElement('button'); //创建元素
                newEle.innerText = '【可以白嫖，点我前往】'
                // 为按钮元素添加点击事件处理函数
                newEle.addEventListener('click', function() {
                    let url = `https://asmr-100.com/work/${rj}`
                    window.open(url , '_blank')
                });
                //var dd = document.querySelector('dd.work_category_free_sample') // 选择要插入的地方
                //var dd = document.querySelector('dd.work_dl')
                var dd = document.querySelectorAll('dd.work_dl')
                //dd.appendChild(newEle) //添加节点到目标位置
                dd[index].appendChild(newEle)   // index 是 函数传进来的，依次从第一个作品开始递增，到最后一个停止
            })
            .catch(function(error) {
                //console.log('查询失败');
            });
    }
    //searchASMR('RJ01043187')
})();

/*
// api_server
const express = require('express')   // 导入 express 模块
const axios = require('axios')
const app = express()                // 创建 express 服务器实例
// 设置跨域资源共享（CORS）策略
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// 监听
app.get('/proxy', async (req, res) => {
    console.log('代理服务器被请求了')
    try {
        const url = req.query.url; // 获取请求参数中的 URL
        const response = await axios.get(url); // 向目标网站发送请求
        res.send(response.data); // 将目标网站的响应返回给油猴脚本
    } catch (error) {
        res.send(error.response.data); // 错误
    }
});
app.listen(3000, () => {
    console.log('dlsite_server server runing at http://127.0.0.1:3000/proxy')
})
*/