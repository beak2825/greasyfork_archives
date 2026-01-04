// ==UserScript==
// @name        ZhihuHotFilter-JavaScript
// @namespace   Violentmonkey Scripts
// @match       https://www.zhihu.com/hot
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       window.open
// @grant       window.focus
// @version     1.0
// @author      尼尼尼@知乎
// @author      备份公众号：尼尼尼不打拳
// @description 2022/10/16 10:00:00
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/453259/ZhihuHotFilter-JavaScript.user.js
// @updateURL https://update.greasyfork.org/scripts/453259/ZhihuHotFilter-JavaScript.meta.js
// ==/UserScript==


// 知乎用户用于过滤热榜中，自己感兴趣话题的Javascript脚本。

// 简要操作说明：
// 1.在浏览器扩展商店中搜索“暴力猴“、”油猴“之类扩展插件，安装并启用。下面以”暴力猴“为例。
// 2.在暴力猴插件中点击”+“号，新建JS脚本，将此脚本内容全部复制粘贴进去并保存。
// 3.登录知乎账户，进入知乎“热榜页”。在暴力猴插件控制台中启用上面保存的脚本。
// 4.刷新页面，会看到页面顶部多出一个绿色”点击过滤话题“的按钮。

// 建议用途：根据关键字过滤知乎热榜中自己感兴趣的话，关键字可自行修改。

(function() {
        'use strict';

        //全局变量设置
        var resultPage='';//检测结果页面文本。
        var resultList = [];

        function c(v){
            console.log(v);
        }

        // 关键词数组设置，可自行修改
        var keyWordList = ['男','女','儿','婚','孕','彩礼','嫁','娶','骚扰','姑','娘','姐','妹','哥','兄','弟','暴','偷拍','妇','夫','妻','父','母','爹','妈','婴','童','教授','奸','亵','嫖','孩','杨笠','张桂梅','卫生巾'];

        //获取热榜上所有提问链接
        function getAllHotLinks(){
            var linkList = [];
            var currentPageLinks = document.querySelectorAll("div[class = 'HotItem-content'] > a");

            if( currentPageLinks.length !== 0){
                //存入数组并计数
                currentPageLinks.forEach(function (listItem) {
                    //取出关键信息并存入数组
                    let link = listItem.href;
                    let title = listItem.title;
                    let infoItem = {title, link};
                    linkList.push(infoItem);
                });
            }
            return linkList;

        }

        // 按关键字过滤话题
        function execHotFilter() {
            let allHotLinks = getAllHotLinks();
            if (allHotLinks.length !== 0) {
                allHotLinks.forEach(
                    function (listItem) {
                        let text = listItem.title;
                        keyWordList.forEach(
                            function (word) {
                                if (text.includes(word)) {
                                    resultList.push(listItem);
                                }
                            }
                        )
                    }
                )
            }

            //数组去重
            let uniqueResultList = [];
            resultList.forEach( item => !uniqueResultList.includes(item) ? uniqueResultList.push(item) : '')

            showResult(uniqueResultList);
            resultList = [];
            uniqueResultList = [];
        }

        //展示结果
        function showResult(uniqueResultList){
            resultPage = '<!DOCTYPE html><html><body><div><b>可能感兴趣的话题：'
                  + '</b></div><p><div><table>';

            if(uniqueResultList.length !== 0) {
                uniqueResultList.forEach(function (listItem) {
                    let cell = '<tr><td>'
                        + listItem.title
                        + '</td><td>'
                        + '<a href="'+listItem.link+'" target=_blank>'
                        + listItem.link
                        + '</a></td></tr>';

                    resultPage += cell;
                });
            }

            resultPage +='</table></div></body></html>';

            //新建浏览器标签，并展示检查结果。
            const newTab = window.open('','_blank');
            newTab.document.write(resultPage);
            newTab.focus();
        }

        function main() {
            c("执行main");
            addFilterButton();
        }

        //在页面上添加执行按钮
        function addFilterButton() {
            $('body').append('<div id="FilterHot">点击过滤话题</div>')
            $('#FilterHot').css('width', '200px')
            $('#FilterHot').css('position', 'absolute')
            $('#FilterHot').css('top', '70px')
            $('#FilterHot').css('left', '350px')
            $('#FilterHot').css('background-color', '#0000ff')
            $('#FilterHot').css('color', 'white')
            $('#FilterHot').css('font-size', 'large')
            $('#FilterHot').css('z-index', 100)
            $('#FilterHot').css('border-radius', '25px')
            $('#FilterHot').css('text-align', 'center')
            $('#FilterHot').click(function () {
                execHotFilter(getAllHotLinks());
            });
            //$('#CheckLink').draggable();

        }

        document.onreadystatechange = function(){
            if(document.readyState === "complete"){
                main();
            }

        }
    }



)();