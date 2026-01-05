// ==UserScript==
// @name        获取百度网盘分享链接
// @author      林岑影
// @website     http://www.cyxiaowu.com
// @description 百度网盘分享页面,快速获取已经分享的链接地址
// @namespace   
// @icon        http://disk.yun.uc.cn/favicon.ico
// @license     GPL version 3
// @encoding    utf-8
// @date        15/08/2015
// @modified    12/09/2015
// @include     http://pan.baidu.com/share/*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @run-at      document-end
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/11730/%E8%8E%B7%E5%8F%96%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/11730/%E8%8E%B7%E5%8F%96%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

var getbaidushares = function(){
    this.linktype = localStorage.getItem('qs_linktype') || "link"; //输出链接格式:    ubb = ubb代码 | link = 链接 | html = html代码
    this.index = 0;
    this.arrUrl = [];
    this.arrName = [];
    this.setTime = null;
    this.btn = '<a node-type="btn-getshare" data-key="getshare" class="btn share-btn" style="display: inline-block;"><span class="ico"></span><span class="btn-val">获取链接</span></a>';
};
getbaidushares.prototype = {
    init: function(){
        var that = this;
        $('[data-key="unshare"]').after(that.btn);
        $('[data-key="getshare"]').on("click", function(){
            that.arrUrl = [];
            that.arrName = [];
            that.index = 0;
            $('[node-type="list"]').children(".item-active").each(function(){
                dataurl = $(this).find('[node-type="copy-bar"]').text();
                dataname = $(this).find('[node-type="name"]').attr("title");
                that.arrUrl.push(dataurl);
                that.arrName.push(dataname);
            });
            that.dialog();
            that.post();
        });
    },
    post: function(){
        var that = this,
            $return = "";
        $.each(this.arrUrl, function(i, j){
            j = j.replace(/[\s]+/g, " ");
            j = j.replace("复制", "");
            j = j.replace("链接： ", "");
            if (that.linktype == "ubb") {
                j = j.replace(/http:\/\/(.*?) /g, "[url=http://$1]百度网盘下载："+that.arrName[i]+"[/url] ");
            } else if (that.linktype == "html") {
                j = j.replace(/http:\/\/(.*?) /g, "<a href='http://$1'>百度网盘下载："+that.arrName[i]+"</a> ");
            }
            $return = $return + j + "\r\n";
        });
        $("#getshareresult").val($return);
    },
    dialog: function() {
        var that = this,
            html = "",
            w = 576,
            h = 514,
            ww = $(window).width(),
            hh = $(window).height();
        var l = (ww - w) / 2,
            t = (hh - h) / 2;
        html+='<div class="b-panel b-dialog box-shadow4 bdr-rnd-3 add-yun-device-dialog common-dialog" style="display: block; left: '+l+'px; top: '+t+'px;">';
        html+='    <div class="dlg-hd b-rlv"><span class="dlg-cnr dlg-cnr-l"></span>';
        html+='        <a href="javascript:void(0);" title="关闭" id="closeGetShareDailog" class="dlg-cnr dlg-cnr-r"></a>';
        html+='        <h3><em></em>分享结果</h3>';
        html+='    </div>';
        html+='    <div class="dlg-bd global-clearfix __dlgBd" style="visibility: visible;">';
        html+='        <div class="add-yun-device-list">';
        html+='            <textarea style="width:100%; height:400px;" id="getshareresult"></textarea>';
        html+='        </div>';
        html+='    </div>';
        html+='</div>';
        $("body").append(html).find("#closeGetShareDailog").click(function(){
            $(this).parents(".b-dialog").remove();
        });
    }
};
var geturl = new getbaidushares();
geturl.init();