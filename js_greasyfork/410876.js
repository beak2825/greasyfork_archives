// ==UserScript==
// @name         b站up屏蔽脚本
// @namespace    upFilter
// @version      1.1.1
// @description  一款屏蔽推送不喜欢的b站up视频的脚本
// @author       TomChenSama
// @include      *://*bilibili.com/*
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/410876/b%E7%AB%99up%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/410876/b%E7%AB%99up%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    //var filterUp = ['敬汉卿','哎哟阿尤','假的校花'];//模板,把名字这样以格式排好,这一行不用改
    var filterUp = [''];//在这里添加即可,格式为上面那行代码所示,名字要不能写错且写全,其它的地方都不用改
    var currentUrl = "";
    function indexUpFilter(){//过滤首页up
        var divClassName = ['video-card-reco','video-card-common ex-card-common','video-card-common','article-card']
        for (var i=0;i<=$('.up').length;i++){
            var upName = strPreHandle($('.up').eq(i).text());//up的名字
            if (filterUp.indexOf(upName)>-1){
                //console.log(upName);
                var allDiv = $('.up').eq(i).parents("div"); //所有的父div
                for (var j=0;j<=allDiv.length;j++){
                    if (divClassName.indexOf($(allDiv).eq(j).attr('class'))>-1){
                        $(allDiv).eq(j).css('display','none');
                        break;
                    }
                }
            }
        }
    }
    function rankFilter(){//过滤排行榜up
        var upIcon = $('i.b-icon.author');
        for (var i=0;i<=upIcon.length;i++){
            var upName = strPreHandle($(upIcon).eq(i).parent().text());
            //console.log(upName);
            if (filterUp.indexOf(upName)>-1){
                $(upIcon).eq(i).parents('li.rank-item').css('display','none');
            }
        }
    }
    function searchFilter(){//搜索过滤up
        if (filterUp.indexOf($('div.info-wrap a.title').eq(0).text())>-1)//去掉搜索栏大头展示
            $('div.info-wrap a.title').eq(0).parents('li.user-item').css('display','none');

        var upNames = $('a.up-name');//所有Up的数组
        for (var i=0;i<=$(upNames).length;i++){
            var upName = $(upNames).eq(i).text();
            if (filterUp.indexOf(upName)>-1){
                $(upNames).eq(i).parents('li.video-item.matrix').css('display','none');
            }
        }
    }

    function strPreHandle(string){//除去多余字符
        return string.trim().replace('/[\r\n]/g','');
    }

    function urlChanged(){
        if (currentUrl != window.location.href){
            indexUpFilter();
            rankFilter();
            searchFilter();
            currentUrl = window.location.href
        }
    }
    $(window).scroll(function(){
        indexUpFilter();
        rankFilter();
        searchFilter();
    });
    setInterval(urlChanged,1000);
})();