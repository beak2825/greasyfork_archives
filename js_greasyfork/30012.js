// ==UserScript==
// @name         聚名网辅助工具
// @namespace    http://bmqy.net/
// @version      1.0.1
// @description  聚名网搜索自动补".com"后缀，输入内容不包含".com,.net,.cn,.com.cn"时，自动补.com后缀；可使用一键检测注册状态按钮；域名列表增加天眼查和估价按钮。
// @author       bmqy
// @match        http://*.juming.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30012/%E8%81%9A%E5%90%8D%E7%BD%91%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/30012/%E8%81%9A%E5%90%8D%E7%BD%91%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
alert('"聚名网辅助工具"已暂停更新，感谢您的使用。\n请前往作者主页安装新版淘米辅助工具，将为你提供更多支持，\n再次感谢您的使用与支持！');
    GM_addStyle(
        '.jmwTools-a{font-family:Microsoft YaHei;font-size:12px;color:blue;font-weight:normal;}'+
        '.jmwTools-a.tianyancha{color:#009bae;}'+
        '.jmwTools-a.gujia{color:#ff5c03;}'+
        '#domainSearchBtns{color:#666;}'
    );

    window.onload = function(){
        addSearchSuffix();
        openChazczt();
        addDomainSearchInfo();
    };

    var $ = $ || window.$;

    // 为搜索框自动补全".com"后缀
    function addSearchSuffix(){
        var SearchInput = document.querySelector('#taodm');
        var Reg = /(.com|.net|.cn|.com.cn)$/;
        SearchInput.addEventListener('blur', function(){
            if(SearchInput.value !== '域名信息综合查询' && !SearchInput.value.match(Reg)){
                SearchInput.value += '.com';
            }
        });
        SearchInput.addEventListener('keydown', function(e){
            if(e.keyCode == 13){
                if(SearchInput.value !== '域名信息综合查询' && !SearchInput.value.match(Reg)){
                    SearchInput.value += '.com';
                }
            }
        });
    }

    // 启用"一键检测注册状态"按钮
    function openChazczt(){
        $('#shuchu').on('DOMNodeInserted', function (){
            var BtnChazczt = document.querySelector('#a_plchazc');
            BtnChazczt.setAttribute('onclick','return pl_chazczt2();');
        });
    }

    // 抢注列表增加“域名辅助信息查询”按钮，可一键查询该域名企业信息、估价信息
    function addDomainSearchInfo(){
        changeShuchuHtml();
        $(document).on('DOMNodeInserted', '#shuchu', function(){
            if($('#domainSearchBtns').size()===0){
                changeShuchuHtml();
            }
        });
        function changeShuchuHtml(){
            var DoMainList = $('#shuchu .balist');
            DoMainList.find('tr').each(function(i,e){
                var AtotalCount = DoMainList.find('tr').size()-1;
                if(i>0 && i<AtotalCount){
                    var DoMainAObj = $(e).find('td:first-child a');
                    var DoMain = DoMainAObj.text();
                    var DoMainName = DoMain.split('.');
                    var AddDomainSearchBtnsWrap = $('<span id="domainSearchBtns"></span');
                    var AddDomainSearchBtnsHtml = '【<a class="jmwTools-a tianyancha" target="_blank" title="来！天眼查一下" href="http://www.tianyancha.com/search?key='+ DoMainName[0] +'">天眼查</a>|<a class="jmwTools-a gujia" target="_blank" title="来！估个价" href="http://www.cxz.com/s.php?site='+ DoMain +'">估价</a>】';
                    AddDomainSearchBtnsWrap.html(AddDomainSearchBtnsHtml);
                    DoMainAObj.parent().append(AddDomainSearchBtnsWrap);
                }
            });
        }
    }
})();
