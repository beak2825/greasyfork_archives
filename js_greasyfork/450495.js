// ==UserScript==
// @name        ZhihuAnaswerChecker-JavaScript
// @namespace   Violentmonkey Scripts
// @match       https://www.zhihu.com/people/*
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       window.open
// @grant       window.focus
// @version     1.4
// @author      老实人不接盘@知乎（主体编写）,尼尼尼@知乎（初版编写）
// @description 2022/8/17 10:00:00
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/450495/ZhihuAnaswerChecker-JavaScript.user.js
// @updateURL https://update.greasyfork.org/scripts/450495/ZhihuAnaswerChecker-JavaScript.meta.js
// ==/UserScript==


// 知乎用户用于检查 “回答” 被屏蔽情况的Javascript脚本。
// 仅限检查“回答”项目，且单次执行只检查当前的单个页面。

// 简要操作说明：
// 1.在浏览器扩展商店中搜索“暴力猴“、”油猴“之类扩展插件，安装并启用。下面以”暴力猴“为例。
// 2.在暴力猴插件中点击”+“号，新建JS脚本，将此脚本内容全部复制粘贴进去并保存。
// 3.进入知乎主页，登录知乎账户。在暴力猴插件控制台中启用上面保存的脚本。刷新页面，会看到页面顶部多出一个绿色”点击执行检查“按钮。
// 4.进入个人主页, 点击”回答“栏。页面加载完成后，点击“点击执行检查”按钮，即可输出当前页回答被屏蔽的情况。
// 5.也可以翻页进入以前的回答页面，检查以往任何一页的被屏蔽情况。但单次执行只能检查当前这一页。

// 建议用途：随手检查最新一页回答中的被屏蔽情况。注意不要过于频繁执行，以免被知乎拒绝请求。

(function() {
    'use strict';

    //全局变量设置
    var baseUrl = "https://www.zhihu.com/people";
    var currentUrl = window.location.href;
    var currentAllLinkList=[];
    var currentBlockedLinkList=[];
    var resultPage='';//检测结果页面文本。

    function c(v){
    	console.log(v);
    }


    //获取当前页面上回答、文章或想法链接链接（class="List-item")
    function getAllLinksOnCurrentPage(){
        var linkList = [];
        var currentPageLinks = document.querySelectorAll("a[data-za-detail-view-element_name=Title]");

        if( currentPageLinks.length != 0){
            //存入数组并计数
            currentPageLinks.forEach(function (listItem) {
                //取出关键信息并存入数组
                let link = listItem.href;
                let title = listItem.innerHTML;
                let infoItem = {title, link};
                linkList.push(infoItem);
            });
        }

        let tmp = getAllLinkList();
        setAllLinkList(tmp.concat(linkList));

        return linkList;

    }

    //对链接进行可访问性检查（非登录状态、不区分“仅自己可见”和“仅自己和关注者可见”）。
    function checkAllLinkList(list){
        if(list.length != 0){
            c(list);
            var fetchCount = 0;
            list.forEach(function (listItem) {
                c('fetching...');
                let link = listItem.link;
                let title = listItem.title;
                fetch(link,{credentials:"omit"})
                    .then((response) => {
                    return response.text();
                }).then((data) => {
                    ++fetchCount;
                    //以网站响应页面中“没有知识存在的荒原”为标志,进行检查。
                    if (data.includes('没有知识存在的荒原')) {
                        currentBlockedLinkList.push(listItem);
                        c('当前被屏蔽结果：'+currentBlockedLinkList);

                    }
                    if(fetchCount === list.length){
                        c(currentBlockedLinkList);

                        let tmp = getBlockedLinkList();
                        setBlockedLinkList(tmp.concat(currentBlockedLinkList));

                        showResult();

                        //清除缓存
                        removeLocalStorage();
                        setAllLinkList([]);
                        setBlockedLinkList([]);
                        setCurrentPageNum(1);
                        setPageCount(1);
                        currentAllLinkList=[];
                        currentBlockedLinkList=[];
                     }
                });

            });
        }

    }

    //展示结果
    function showResult(){
        var allLinkList = [];
        var blockedLinkList = [];
        allLinkList = getAllLinkList();
        blockedLinkList = getBlockedLinkList();

        resultPage = '<!DOCTYPE html><html><body><div>检测完毕。<br>如有创作内容被屏蔽，请与知乎小管家交流，共同学习，共同进步。</div><p><div><b>当前页面总回答数量：'
            + allLinkList.length
            + '， 被屏蔽数量：'
            + blockedLinkList.length
            + '</b></div><p><div><table>';

        if(blockedLinkList.length !== 0) {
            blockedLinkList.forEach(function (listItem) {
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


    function init() {
        checkAllLinkList(getAllLinksOnCurrentPage());

    }

    function main() {
        c("执行main");
        addCheckButton();

    }

    //在页面上添加执行按钮
    function addCheckButton() {
        $('body').append('<div id="CheckLink">点击执行检查</div>')
        $('#CheckLink').css('width', '200px')
        $('#CheckLink').css('position', 'absolute')
        $('#CheckLink').css('top', '70px')
        $('#CheckLink').css('left', '350px')
        $('#CheckLink').css('background-color', '#28a745')
        $('#CheckLink').css('color', 'white')
        $('#CheckLink').css('font-size', 'large')
        $('#CheckLink').css('z-index', 100)
        $('#CheckLink').css('border-radius', '25px')
        $('#CheckLink').css('text-align', 'center')
        $('#CheckLink').click(function () {
            checkAllLinkList(getAllLinksOnCurrentPage());
        });
        //$('#CheckLink').draggable();

    }

    function handleLocalStorage(method, key, value) {
        switch (method) {
            case 'get' : {
                let temp = window.localStorage.getItem(key);
                if (temp) {
                    return temp
                } else {
                    return false
                }
            }
            case 'set' : {
                window.localStorage.setItem(key, value);
                break
            }
            case 'remove': {
                window.localStorage.removeItem(key);
                break
            }
            default : {
                return false
            }
        }
    }


    function removeLocalStorage(){
        handleLocalStorage('remove','currentPageNum');
        handleLocalStorage('remove','pageCount');
        handleLocalStorage('remove','allLinkList');
        handleLocalStorage('remove','blockedLinkList');
    }

    function setCurrentPageNum(v){
        handleLocalStorage('set','currentPageNum',v);
    }

    function setPageCount(v){
        handleLocalStorage('set','pageCount',v);
    }

    function getPageCount(){
        return handleLocalStorage('get','pageCount',0);
    }


    function setAllLinkList(v){
        handleLocalStorage('set','allLinkList',JSON.stringify(v));
    }

    function getAllLinkList(){
        return JSON.parse(handleLocalStorage('get','allLinkList',0));
    }

    function setBlockedLinkList(v){
        handleLocalStorage('set','blockedLinkList',JSON.stringify(v));
    }

    function getBlockedLinkList(){
        return JSON.parse(handleLocalStorage('get','blockedLinkList',0));
    }



    document.onreadystatechange = function(){
        if(document.readyState === "complete"){
            removeLocalStorage();

            setAllLinkList([]);
            setBlockedLinkList([]);
            setCurrentPageNum(1);
            setPageCount(1);
            main();
        }

    }
}



)();