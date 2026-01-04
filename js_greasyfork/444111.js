// ==UserScript==
// @name         应急管理干部学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  应急管理干部学习，由吴大师编写
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @require     https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @author       吴大师(wxj)
// @match        https://yjgb.sset.org.cn/*
// @downloadURL https://update.greasyfork.org/scripts/444111/%E5%BA%94%E6%80%A5%E7%AE%A1%E7%90%86%E5%B9%B2%E9%83%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/444111/%E5%BA%94%E6%80%A5%E7%AE%A1%E7%90%86%E5%B9%B2%E9%83%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var _open = window.XMLHttpRequest.prototype.open;
    var pUrl;
    var jdata;
    var tflag=0;
    XMLHttpRequest.prototype.open = function() {
        var Targuments=arguments;
        if (Targuments[1].indexOf("api/v1/course-study/course-info/ids?ids=")>0 && tflag==0){
            var Lurl=Targuments[1];
            tflag=1;
            if(Lurl.indexOf("https://")<0){
                Lurl="https://yjgb.sset.org.cn" + Lurl;
            }
            //console.log(20181117200649, Lurl);
            $.ajax({
                url: Lurl,
                dataType: "json",
                success: function (odata) {
                    jdata=odata;
                    // console.log(jdata);
                }
            });
            setInterval(function(){//列表窗口计时器
                if ($.cookie('window')=="0"){
                    for (var t = 0; t < jdata.length ; t++) {
                        if (jdata[t].id == $.cookie('oldstr')){
                            console.log(jdata[t].name);
                            if(t<jdata.length-1){
                                $('#D189courseOnline-'+jdata[t+1].id)[0].click();
                            }
                            break;
                        }
                    }
                }
            },3000)
        }
        if (Targuments[1].indexOf("api/v1/course-study/course-front/info/")>0){//播放窗口计时器
            var oldstr=Targuments[1].substring(Targuments[1].indexOf("/info/")+6,Targuments[1].indexOf("?"));
            $.cookie('window', '1', { path:'/',domain:'sset.org.cn'});
            $.cookie('oldstr', oldstr, { path:'/',domain:'sset.org.cn'});
            setInterval(function(){
                if ($('.btn-ok.btn').length > 0 && $('.alert-shadow')[0].innerHTML.indexOf("display: none;") <= 0){//关闭监测窗口
                    $('.btn-ok.btn')[0].click();
                }
                if ($('.chapter-list-box.required.focus').length > 0 && $('.chapter-list-box.required.focus:eq(0)').attr('data-sectiontype')=="9"){
                    self.opener=null;
                    $.cookie('window', '0', { path:'/',domain:'sset.org.cn'});
                    self.close();
                    //$(location).attr('href', pUrl);
                }
            },1000)
        }
        return _open.apply(this, Targuments)
    }
})();