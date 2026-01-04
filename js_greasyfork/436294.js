// ==UserScript==
// @name         中国知网CNKI硕博论文PDF下载 修改版
// @version      0.0.3
// @namespace    https://greasyfork.org/users/844706
// @icon         https://www.cnki.net/favicon.ico
// @description  添加知网文献PDF下载按钮，支持搜索列表、详情页，下载论文章节目录，批量下载文献，一键切换CAJ和PDF格式
// @author       笔墨纸砚
// @match        http*://*.cnki.net
// @match        http*://cdmd.cnki.com.cn/Article/CDMD-*
// @match        http*://*/kcms/detail/detail.aspx?*dbcode=*
// @match        http*://*/*/*/kcms/detail/detail.aspx?*dbcode=*
// @match        http*://*/*/*/kcms/detail*
// @match        http*://*/https/*/kcms*
// @match        https://*.cnki.net/*
// @match        http*://*/KCMS/detail/detail.aspx?*dbcode=*
// @match        http*://*/kns*/defaultresult/index*
// @match        http*://*/https/*/kns8/defaultresult/index
// @match        http*://*/KNS8/AdvSearch?*
// @match        http*://*/kns8/AdvSearch?*
// @match        http*://*/kns/brief/*result*
// @match        http*://*/kcms/Detail/DownDetail.aspx*
// @run-at       document-idle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/436294/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91CNKI%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87PDF%E4%B8%8B%E8%BD%BD%20%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/436294/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91CNKI%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87PDF%E4%B8%8B%E8%BD%BD%20%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

//文献详情页面
var $ = unsafeWindow.jQuery;

(function() {
    'use strict';
    function saveFile(name,data) { // 生成目录txt
        const blob = new Blob([data],{type:'text/plain'});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name + ".txt";
        link.click();
        window.URL.revokeObjectURL(link.href);
    }

    function add_cate_dl_btn() { // 添加目录下载按钮
        var other_btns = document.getElementsByClassName('other-btns')[0];
        var li2 = document.createElement('li');
        var a2 = document.createElement('a');
        li2.className = "btn-diy";
        li2.style = "width:auto;height:23px;line-height:22px;background-color:#3f8af0;border-radius:3px;";
        a2.innerHTML = "目录下载";
        a2.className = "a-diy";
        a2.style = "color:#ffffff;padding: 2px 10px;";
        a2.href = "javascript:void(0)";
        li2.appendChild(a2);
        other_btns.appendChild(li2);
    }

    function get_cate(url){
        var content = "";
        $.ajax({ // 从分章下载页获取目录
            url:url,
            type:"get",
            dataType:'html',
            async:false,
            success:function(data){
                var cate_ul = $('.ls-chapters',data)[0];
                var title = cate_ul.getElementsByClassName('txt')
                var page = cate_ul.getElementsByClassName('page')
                $.each(title,function(index,val){
                    content += $(title[index]).text() + ".................................................." + $(page[index]).text() + "\n";
                });
            }
        });
        return content;
    }
        var url = window.location.href;
        if(url.indexOf('detail.aspx') != -1){
            var wx_title = document.getElementsByClassName('wx-tit')[0].innerText;
            if(document.getElementsByClassName('catalog-list').length>0){ // 获取目录
                var catalog_url = document.getElementsByClassName('operate-btn')[0].getElementsByTagName('a')[3].href; // 分章下载链接
                var cate_content = get_cate(catalog_url);
                // console.log(cate_content);
                add_cate_dl_btn(); // 添加目录下载按钮
            }
            $(document).on("click",".a-diy",function(){saveFile(wx_title,cate_content)}); // 下载目录按钮监听
            var dllink = document.getElementsByClassName('operate-btn');
            var dlurl = JSON.parse(localStorage.getItem("fnlist"))["tmpfn_" + url.match(/filename=([^&]*)/)[1]];
            for (var i = 0;i <= dllink.length; i++) { // 添加PDF下载按钮
                var li = document.createElement('li');
                var a1 = document.createElement('a');
                li.className = "btn-dlpdf";
                a1.innerHTML = "<i></i>PDF 下载";
                //a1.href = dlurl.replace('kns','oversea');
                a1.style.backgroundColor="#fb4376";
                li.appendChild(a1);
                dllink[i].appendChild(li);
            }
       };
    if(url.indexOf('DownDetail.aspx') != -1){
        function add_cate_dl_btn() { // 添加目录下载按钮
            var other_btns = document.getElementsByClassName('title')[0];
            var li2 = document.createElement('li');
            var a2 = document.createElement('a');
            li2.className = "btn-diy";
            li2.style = "width:auto;height:23px;line-height:22px;background-color:#3f8af0;border-radius:3px;list-style: none;";
            a2.innerHTML = "目录下载";
            a2.className = "a-diy";
            a2.style = "color:#ffffff;padding: 2px 10px;";
            a2.href = "javascript:void(0)";
            li2.appendChild(a2);
            other_btns.appendChild(li2);
        }
        add_cate_dl_btn();
        var content = "";
        var ul = $('.ls-chapters')[0];
        var title = ul.getElementsByClassName('txt');
        var page = ul.getElementsByClassName('page');
        $.each(title,function(index,val){
            content += $(title[index]).text() + ".................................................." + $(page[index]).text() + "\n";
        });
        var filename = document.getElementsByClassName('title')[0].innerText;
        $(document).on("click",".a-diy",function(){saveFile(filename,content)}); // 下载目录按钮监听
    };
})();


// 知网空间学位论文
// 可能基本没啥用
(function() {
    var url = window.location.href;
    if(url.indexOf('cdmd.cnki.com.cn') != -1){
        var cnki_space_id = url.match(/-([0-9]+).htm/)[1];
        console.log(cnki_space_id);
        var ty_caj = document.getElementById("ty_caj");
        var newe = document.createElement("div");
        var newe_a = document.createElement('a');
        newe.className = "down_button";
        newe.id = "ty_pdf";
        newe_a.innerHTML = "PDF 下载(跳)";
        newe_a.href = "https://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CMFD&dbname=CMFDTEMP&filename=" + cnki_space_id + ".nh";
        newe_a.target = "_blank";
        newe.appendChild(newe_a);
        document.getElementById("down_3").insertBefore(newe,ty_caj);
    }
})();


// 搜索结果页面

(function() {
    function downloadFile(url) {
        window.open(url,'_blank')
    }
    function getlist(){
        var l = localStorage.getItem("FileNameS").split(",");
        var urls = [];
        if (l == ""){
            urls = [];
            au = [];
        }else{
            $.each(l,function(index,val){
                var u = $("input[value='"+ l[index] +"']").parent("td").parent("tr").find(".downloadlink")[0].href;
                urls.push(u);
            });
        }
        au = urls;
    }
    var au = [];
    $(document).ajaxSuccess(function() {
        if (arguments[2].url.indexOf('/Brief/GetGridTableHtml') + 1) {
            $('.downloadlink').attr('href',function(){return this.href+"&dflag=pdfdown";});
            // 传值
            localStorage.removeItem("fnlist");
            var dllink = document.getElementsByClassName('cbItem');
            var simgle_name = {};
            $.each(dllink,function(index){
                var u = $("input[value='"+ dllink[index].value +"']").parent("td").parent("tr").find(".downloadlink")[0].href;
                //console.log(u);
                simgle_name["tmpfn_" + dllink[index].value.split("!")[1]] = u;
                localStorage.setItem("fnlist",JSON.stringify(simgle_name));
            });
            // console.log(localStorage.getItem("fnlist"));
            $(document).on("click","#selectCheckAll1",function(){
                getlist();
            })
            $("tr input[name='CookieName']").click(function(){
                getlist();
            })
            $(".toolbar").after(`<div class="toolbar-col"><ul class="diy-btn" id="">
                <li class="pdfvdownload"><a href="javascript:void(0)" id="dd">批量下载</a></li>
                  <li><div style="width: 58px;">
                        <input type="checkbox" name="switch_dl_type" id="switch_dl_type" checked class="diy-choose-btn" data-toggle="PDF|CAJ">
                        <label for="switch_dl_type" class="choose-label"></label>
                        <span class="choose-text"></span>
                    </div></li>
                </ul></div>`);

        };

        // 格式下载开关
        $(".diy-choose-btn").each(function(){
            var texts = $(this).attr('data-toggle').split('|');
            $(this).siblings('.choose-text').text(this.checked?texts[0]:texts[1]);
            $("#dd").text(this.checked?"批量下载"+texts[0]:"批量下载"+texts[1]);
        });
        $(".diy-choose-btn").off("change");
        $(".diy-choose-btn").on("change", function(){
            var texts = $(this).attr('data-toggle').split('|');
            $(this).siblings('.choose-text').text(this.checked?texts[0]:texts[1]);
            $("#dd").text(this.checked?"批量下载"+texts[0]:"批量下载"+texts[1]);
                if(this.checked){
                    $('.downloadlink').attr('href',function(){return this.href+"&dflag=pdfdown";});
                }else{
                    $('.downloadlink').attr('href',function(){return this.href.replace("&dflag=pdfdown","");});
                }
        });
    });
    $(document).on("click","#dd",function(){
        //console.log(au);
        if(au.length == 0){
            alert("未选择");
            return false;
        }
        for(var i=0;i<au.length;i++){
            downloadFile(au[i]);
        }
    })
    $(document).on("click","[href='javascript:$.filenameClear();']",function(){au = [];}); // 清除全选

    function loadCss(code){ // 加载CSS
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(code));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

 $(".SavePoint").after(`<div class="toolbar-col"><ul class="diy-btn" id="">
                <li class="pdfvdownload"><a href="javascript:void(0)" id="dd">批量下载</a></li>
                  <li><div style="width: 58px;">
                        <input type="checkbox" name="switch_dl_type" id="switch_dl_type" checked class="diy-choose-btn" data-toggle="PDF|CAJ">
                        <label for="switch_dl_type" class="choose-label"></label>
                        <span class="choose-text"></span>
                    </div></li>
                </ul></div>`);
loadCss(`.diy-choose-btn { display: none; }
.choose-label { box-shadow: #b1b1b1 0px 0px 0px 1px; width: 30px; height: 16px; display: inline-block; border-radius: 16px; position: relative; background-color: #bdbdbd; overflow: hidden; margin: 0; margin-top: -3px; cursor: pointer; vertical-align: middle; }
.choose-label:before { content: ''; position: absolute; left: 0; width: 16px; height: 16px; display: inline-block; border-radius: 20px; background-color: #fff; z-index: 20; -webkit-transition: all 0.2s; transition: all 0.2s; }
.diy-choose-btn:checked + label.choose-label:before { left: 14px; }
.diy-choose-btn:checked + label.choose-label { background-color: #009cef; box-shadow: #009cef 0px 0px 0px 1px; }
.choose-text { display: inline-block; line-height: 20px; color: #888; font-size: 12px;}
.diy-btn {float:left;}
.diy-btn li {display:inline-block;line-height:30px;padding:0 6px;border:1px solid #eee;background-color:#fff;}`);

})();
