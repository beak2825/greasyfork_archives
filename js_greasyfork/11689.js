// ==UserScript==
// @name        百度网盘分享(版本1)
// @author      林岑影
// @website     http://www.cyxiaowu.com
// @description 百度网盘批量分享, 每个勾勾都生成一个分享链接, 可以自定义访问密码
// @namespace   
// @icon        http://disk.yun.uc.cn/favicon.ico
// @license     GPL version 3
// @encoding    utf-8
// @date        13/08/2015
// @modified    08/12/2015
// @include     http://pan.baidu.com/disk/*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @run-at      document-end
// @version     1.5.1
// @downloadURL https://update.greasyfork.org/scripts/11689/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%28%E7%89%88%E6%9C%AC1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/11689/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%28%E7%89%88%E6%9C%AC1%29.meta.js
// ==/UserScript==

(function(window){
    var baidushares = function(){
        this.pass = localStorage.getItem('qs_psss') || "8888"; //密码
        this.timeout = 10000; //间隔时间 (毫秒)
        this.linktype = localStorage.getItem('qs_linktype') || "link"; //输出链接格式:    ubb = ubb代码 | link = 链接 | html = html代码
        this.index = 0;
        this.arrId = [];
        this.arrName = [];
        this.setTime = null;
        this.setSec = null;
        this.stbtn = '<a node-type="btn-quicksharest" data-key="quicksharest" class="icon-btn-download" style="display: inline-block;"><span class="ico"></span><span class="btn-val">分享设置</span></a>';
        this.btn = '<a node-type="btn-quickshare" data-key="quickshare" class="btn share-btn" style="display: inline-block;"><span class="ico"></span><span class="btn-val">快速分享</span></a>';
    };
    baidushares.prototype = {
        init: function(){
            var that = this;
            $(".module-list-toolbar").find('[data-key="download"]').after(that.btn);
            $(".module-toolbar").find('[node-type="btn-offline-download"]').after(that.stbtn);
            $(".module-toolbar").find('[data-key="quicksharest"]').on("click", function(){
                that.setting();
            });
            $(".module-list-toolbar").find('[data-key="quickshare"]').on("click", function(){
                if (that.setTime) {
                    alert("当前有队列在分享中, 请等待完成后再试!");
                    return false;
                }
                that.arrId = [];
                that.arrName = [];
                that.index = 0;
                var dom = $(".module-list-view").css("display") == "none" ? $(".module-grid-view") : $(".module-list-view");
                dom.find('[node-type="list"]').children(".item-active").each(function(){
                    dataid = $(this).data("id");
                    dataname = $(this).find('[node-type="name"]').attr("title");
                    that.arrId.push(dataid);
                    that.arrName.push(dataname);
                });
                var length = that.arrId.length
                that.dialog();
                that.resetCount(length);
                that.post();
            });
            $("body").on("click", '#qs_setting', function(){
                var qs_pass = $("#qs_pass").val(),
                    qs_linktype = $("#qs_linktype").val();
                var reg = /^([a-zA-Z0-9]{4,4})$/;
                if(!reg.test(qs_pass)){
                    $("#qs_pass").val(that.pass);
                    alert("请输入正确的密码。");
                    return false; 
                } else {
                    localStorage.setItem("qs_psss", qs_pass);
                    localStorage.setItem("qs_linktype", qs_linktype);
                    that.pass = qs_pass;
                    that.linktype = qs_linktype;
                    $(this).parents(".b-dialog").remove();
                }
            });
        },
        post: function(){
            var that = this,
                index = this.index;
            var id = this.arrId[index],
                name = this.arrName[index],
                text = "",
                request = $.ajax({
                    url: "/share/set?channel=chunlei&clienttype=0&web=1&bdstoken=" + yunData.MYBDSTOKEN + "&app_id=25052",
                    method: "POST",
                    data: {
                        fid_list : "["+id+"]",
                        schannel: 4,
                        channel_list: "[]",
                        pwd: that.pass
                    },
                    dataType: "json"
                });
            request.done(function(json) {
                if (json.errno == 0) {
                    if (that.linktype == "ubb") {
                        text = "[url="+json.shorturl+"]百度网盘下载: "+name+"[/url] 提取密码："+that.pass;
                    } else if (that.linktype == "html") {
                        text = "<a href='"+json.shorturl+"'>百度网盘下载: "+name+"</a> 提取密码："+that.pass;
                    } else {
                        text = json.shorturl +" 提取密码："+that.pass;
                    }
                } else {
                    text = name+" 分享失败, 错误代码: "+json.errno;
                }
                var old = $("#shareresult").val();
                if (old=="") {
                    old = text;
                } else {
                    old = old+"\r\n"+text;
                }
                $("#shareresult").val(old);
                that.count();
                that.index++;
                if (that.index >= that.arrId.length) {
                    window.clearTimeout(that.setTime);
                    window.clearInterval(that.setSec);
                    that.setTime = null;
                    that.setSec = null;
                } else {
                    that.setTime = setTimeout(function(){
                        that.post();
                    }, that.timeout);
                    that.setSec = setInterval(function(){
                        var sec = parseInt($("#sec").text());
                        sec--;
                        if (sec>0) {
                            $("#sec").text(sec);
                        } else {
                            window.clearInterval(that.setSec);
                            that.setSec = null;
                            $("#sec").text(parseInt(that.timeout / 1000));
                        }
                    }, 1000);
                }
            });
        },
        resetCount: function(len){
            $("#ok").text("0");
            $("#all").text(len);
            $("#no").text(len);
        },
        count: function(){
            var ok = parseInt($("#ok").text()) + 1;
            var all = parseInt($("#all").text());
            var no = all - ok;
            $("#ok").text(ok);
            $("#no").text(no);
        },
        dialog: function() {
            if ($("#share-box").length > 0) {
                return false;
            }
            var that = this,
                html = "",
                w = 576,
                h = 514,
                ww = $(window).width(),
                hh = $(window).height();
            var l = (ww - w) / 2,
                t = (hh - h) / 2;
            html+='<div id="share-box" class="b-panel b-dialog box-shadow4 bdr-rnd-3 add-yun-device-dialog common-dialog" style="display: block; left: '+l+'px; top: '+t+'px;">';
            html+='    <div class="dlg-hd b-rlv"><span class="dlg-cnr dlg-cnr-l"></span>';
            html+='        <a href="javascript:void(0);" title="关闭" id="closeQuickShareDailog" class="dlg-cnr dlg-cnr-r"></a>';
            html+='        <h3><em></em>分享结果</h3>';
            html+='    </div>';
            html+='    <div class="dlg-bd global-clearfix __dlgBd" style="visibility: visible;">';
            html+='        <div class="add-yun-device-list">';
            html+='            <p style="margin-bottom: 10px;">共 <b id="all">0</b> 条, 已完成 <b id="ok">0</b> 条, 剩余 <b id="no">0</b> 条 <b id="sec">'+ parseInt(that.timeout / 1000) +'</b>s</p>';
            html+='            <textarea style="width:100%; height:400px;" id="shareresult"></textarea>';
            html+='        </div>';
            html+='    </div>';
            html+='</div>';
            $("body").append(html).find("#closeQuickShareDailog").click(function(){
                window.clearTimeout(that.setTime);
                that.setTime = null;
                window.clearInterval(that.setSec);
                that.setSec = null;
                $(this).parents(".b-dialog").remove();
            });
        },
        setting: function() {
            var that = this,
                html = "",
                w = 576,
                h = 218,
                ww = $(window).width(),
                hh = $(window).height();
            var l = (ww - w) / 2,
                t = (hh - h) / 2,
                length = this.arrId.length;
            html+='<div id="setting-box" class="b-panel b-dialog box-shadow4 bdr-rnd-3 add-yun-device-dialog common-dialog" style="display: block; left: '+l+'px; top: '+t+'px;">';
            html+='    <div class="dlg-hd b-rlv"><span class="dlg-cnr dlg-cnr-l"></span>';
            html+='        <a href="javascript:void(0);" title="关闭" id="closeQuickShareSettingDailog" class="dlg-cnr dlg-cnr-r"></a>';
            html+='        <h3><em></em>设置</h3>';
            html+='    </div>';
            html+='    <div class="dlg-bd global-clearfix __dlgBd" style="visibility: visible;">';
            html+='        <div class="add-yun-device-list">';
            html+='            <table border="0" cellpadding="5" cellspacing="0">';
            html+='            <tr><td style="padding:10px;">链接类型: </td><td style="padding:10px;"><select id="qs_linktype"><option value="ubb">ubb代码</option><option value="html">html代码</option><option value="link">链接</option></select></td></tr>';
            html+='            <tr><td style="padding:10px;">分享密码: </td><td style="padding:10px;"><input id="qs_pass" class="input-text" type="text" maxlength="4" pattern="/([a-zA-Z0-9]{4,4})/" value="'+ that.pass +'" required /></td></tr>';
            html+='            <tr><td style="padding:10px;">&nbsp;</td><td style="padding:10px;"><a id="qs_setting" class="sbtn create-public"><b>设置</b></a></td></tr>';
            html+='            </table>';
            html+='        </div>';
            html+='    </div>';
            html+='</div>';
            $("#setting-box").remove();
            $("body").append(html).find("#closeQuickShareSettingDailog").click(function(){
                $(this).parents(".b-dialog").remove();
            });
            $("#qs_linktype").val(that.linktype);
        }
    };
    var bs = new baidushares();
    bs.init();
}(window));