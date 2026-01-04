// ==UserScript==
// @name         爬取谷歌搜索(不用的时候禁用掉)
// @namespace    qinshaoyou
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.google.com/search*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/411515/%E7%88%AC%E5%8F%96%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%28%E4%B8%8D%E7%94%A8%E7%9A%84%E6%97%B6%E5%80%99%E7%A6%81%E7%94%A8%E6%8E%89%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411515/%E7%88%AC%E5%8F%96%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%28%E4%B8%8D%E7%94%A8%E7%9A%84%E6%97%B6%E5%80%99%E7%A6%81%E7%94%A8%E6%8E%89%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 域名匹配 *://*/*
    // Your code here...

    // 最大收集多少条
    var maxNum = 310;
    let waitingTime=10*1000;

    window.onload = function () {
        var tip = document.createElement('div');
        tip.style.fontWeight = 'bold';
        tip.style.fontSize = 'large';
        tip.style.color = '#ffffff';
        tip.style.textAlign = 'center';
        tip.style.border = '1px dashed #003399';
        tip.style.background = 'rgb(0,0,0,.5)';
        tip.style.textShadow = '0 0 1px #333399';
        tip.style.padding = '18px';
        tip.style.zIndex = '999999999';
        tip.style.position = 'fixed';
        tip.style.top = '62%';
        tip.style.width = '90%';
        tip.style.marginLeft = '5%';
        tip.style.borderRadius = '8px';
        let tip_text = '谷歌搜索网址采集器-[郭土豆牌] ' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' 周' + new Date().getDay() + '<br/>正在运行<br/>';
        tip_text =tip_text+'为了防止触发谷歌人机验证,将会进行一定的延迟访问,请耐心等候';
        document.body.insertBefore(tip, document.getElementsByTagName('div')[0]);
        let task1 = setInterval(function () {
            tip.innerHTML = tip.innerHTML + '.';
        }, 200);

        let task2 = setInterval(function () {
            tip.innerHTML = tip_text + '';
        }, 1000);

        // 下一页按钮
        let nextBtn = document.querySelectorAll('#foot table tbody tr td')[11].getElementsByTagName('a')[0];
        var currentPageIndex = document.querySelectorAll('#foot table tbody tr td');
        for(let i=0;i<currentPageIndex.length;i++){
            if(currentPageIndex[i]&&(currentPageIndex[i].getElementsByTagName('a'))&&currentPageIndex[i].getElementsByTagName('a')[0]){

            }else if(currentPageIndex[i].innerText){
                currentPageIndex=(currentPageIndex[i].innerText);
                break;
            }
        }

        let searchContent = document.querySelectorAll('#search>div>div>div');
        let keyword_1 = document.querySelectorAll('form>div')[1].getElementsByTagName('div')[2].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value;

        // 构建要跳转打开的网址
        var r = 1;
        if (currentPageIndex == 1) {
            r =  confirm("是否确认开始爬取 谷歌搜索数据? 开始请点击[确认],不需要请点击[取消],或者在油猴中关闭脚本");
        }

        if (r == true) {
            loopInsert(0);
        } else {
            setTimeout(function () {
                clearInterval(task2);
                clearInterval(task1);
            }, 500);
            setTimeout(function () { tip.innerText = '若长期不使用,请在油猴中关闭脚本,防止误操作产生垃圾垃圾数据! 本消息10秒后关闭'; }, 1000);
            setTimeout(function () { tip.style.display = 'none'; }, 19000);
        }
        function loopInsert(index) {
            if (index >= searchContent.length) {
                // 下一页
                if (currentPageIndex <= (maxNum / 10) && nextBtn) {
                    nextBtn.click();
                } else {
                    localStorage.setItem('xiaoxiannv_page_index', 0);
                    alert('采集完毕,请前往后台查看数据');
                    setTimeout(function(){
                        tip.style.display = 'none';
                    },1000);
                }
                return;
            }
            let aTag = searchContent[index].getElementsByTagName('div')[0].querySelectorAll('a')[0];
            let contentTag = searchContent[index].getElementsByTagName('div')[7].getElementsByTagName('div')[0];
            let url = aTag.href;
            if (url && aTag.getElementsByTagName('h3')[0] && aTag.getElementsByTagName('h3')[0].innerText
                && contentTag) {
                let domain = url;
                domain = url.split('//')[1];
                domain = domain.split('/')[0];
                let title = aTag.getElementsByTagName('h3')[0].innerText;
                let title_sub = contentTag.innerText;
                let data = {
                    domain: domain,
                    url: url,
                    title_sub: title_sub,
                    title: title,
                    keyword_1: keyword_1,
                };
                insertData(data);
                index = index + 1;
                setTimeout(function(){ loopInsert(index);},waitingTime);
            } else {
                index = index + 1;
                setTimeout(function(){ loopInsert(index);},waitingTime);
            }
        }
        //
    };

    function insertData(data) {
        $.ajax({
            url: 'https://ihogu.com/.web/myapi/public/index.php',
            data: {
                s: 'Tools_GoogleSearch.insertUrl',
                title: data['title'],
                title_sub: data['title_sub'],
                domain: data['domain'],
                url: data['url'],
                keyword_1: data['keyword_1']
            },
            //请求成功
            success: function (result) {
                console.log(result);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e);
            }
        });
    }
})();