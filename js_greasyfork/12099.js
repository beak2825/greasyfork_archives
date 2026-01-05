// ==UserScript==
// @name        百度网盘批量下载
// @author      iamGates
// @website     https://greasyfork.org/zh-CN/scripts/12099-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD
// @reference   https://greasyfork.org/zh-CN/scripts/11689-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB
// @description 为每个勾生成一个下载链接, 不支持文件夹
// @namespace   
// @icon        http://7xii4j.com1.z0.glb.clouddn.com/favicon.ico
// @license     GPL version 3
// @encoding    utf-8
// @date        01/09/2015
// @modified    01/09/2015
// @include     http://pan.baidu.com/*
// @include     http://yun.baidu.com/*
// @exclude     http://yun.baidu.com
// @exclude     http://yun.baidu.com/#*
// @exclude     http://pan.baidu.com/share/manage*
// @exclude     http://pan.baidu.com/disk/recyclebin*
// @exclude     http://yun.baidu.com/pcloud/album/info*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @run-at      document-end
// @version     1.1.0
// @downloadURL https://update.greasyfork.org/scripts/12099/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/12099/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

var getdownloadlink = function(){
    this.timeout = 3000; //请求间隔 (毫秒)，数值设置太小可能会出现问题（触发验证码机制之类）
    this.index = 0;
    this.arrId = [];
    this.arrName = [];
    this.setTime = null;
    this.btn = '<a node-type="btn-getlink" data-key="getlink" class="btn download-btn" style="display: inline-block;"><span class="ico"></span><span class="btn-val">获取文件链接</span></a>';
    this.s = "";
    this.m = 0;
};
getdownloadlink.prototype = {
    init: function(){
        var that = this;
        $('[class="btn download-btn"]').after(that.btn);
        $('[data-key="getlink"]').on("click", function(){
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
            if (window.location.pathname.substring(1,2) === "d"){
                //from baidu START
                if ("function" != typeof yunData.sign2)
                    try {
                        yunData.sign2 = new Function("return " + yunData.sign2)()
                    } catch (r) {}
                if ("function" != typeof yunData.sign2)
                    return void i();
                //from baidu END
                that.s = that.base64Encode(yunData.sign2(yunData.sign3, yunData.sign1));
            } else {
                that.m = 1;
            }
            that.dialog();
            that.post();
        });
    },
    post: function(){
        var that = this,
            index = this.index;
        if (index >= this.arrId.length) {
            return false;
        }
        var id = this.arrId[index],
            name = this.arrName[index],
            text = "";
        if (that.m === 0){
            var o = {
                url: "/api/download",
                method: "GET",
                data: {
                    sign: that.s,
                    timestamp: yunData.timestamp,
                    fidlist : "["+id+"]",
                    type: "dlink",
                    bdstoken: yunData.MYBDSTOKEN,
                    channel: "chunlei",
                    clienttype: "0",
                    web: "1",
                    appid: "250528"
                },
                dataType: "json"
            };
        } else if (that.m === 1) {
            var o = {
                url: "/api/sharedownload?sign=" + yunData.SIGN + "&timestamp=" + yunData.TIMESTAMP +"&bdstoken=" + yunData.MYBDSTOKEN + "&channel=chunlei&clienttype=0&web=1&app_id=250528",
                method: "POST",
                data: {
                    encrypt: "0",
                    extra: '{"sekey":"'+ that.getCookie("BDCLND") + '"}',
                    product: "share",
                    uk: yunData.SHARE_UK,
                    primaryid: yunData.SHARE_ID,
                    fid_list : "["+id+"]"
                },
                dataType: "json"
            };
        }    
        var request = $.ajax(o);
        
        request.done(function(json) {
            if (json.errno === 0) {
                try {
                    text = json.dlink[0].dlink;
                }catch(r){
                    try {
                        text = json.list[0].dlink;
                    } catch(r) {
                        text = name + "：不支持文件夹= =";
                    }
                }
            } else {
                text = name+" 获取链接失败, 错误代码: "+json.errno;
            }
            var old = $("#requestresult").val();
            if (old === "") {
                old = text;
            } else {
                old = old+"\r\n"+text;
            }
            $("#requestresult").val(old);
            that.count();
            that.index++;
            that.setTime = setTimeout(function(){
                that.post();
            }, that.timeout);
        });
    },
    count: function(){
        var ok = parseInt($("#ok").text()) + 1;
        var all = parseInt($("#all").text());
        var no = all - ok;
        $("#ok").text(ok);
        $("#no").text(no);
    },
    dialog: function() {
        var that = this,
            html = "",
            w = 576,
            h = 514,
            ww = $(window).width(),
            hh = $(window).height();
        var l = (ww - w) / 2,
            t = (hh - h) / 2,
            length = this.arrId.length;
        html+='<div class="b-panel b-dialog box-shadow4 bdr-rnd-3 add-yun-device-dialog common-dialog" style="display: block; left: '+l+'px; top: '+t+'px;">';
        html+='    <div class="dlg-hd b-rlv"><span class="dlg-cnr dlg-cnr-l"></span>';
        html+='        <a href="javascript:void(0);" title="关闭" id="closeGetLinkDailog" class="dlg-cnr dlg-cnr-r"></a>';
        html+='        <h3><em></em>获取结果</h3>';
        html+='    </div>';
        html+='    <div class="dlg-bd global-clearfix __dlgBd" style="visibility: visible;">';
        html+='        <div class="add-yun-device-list">';
        html+='            <p style="margin-bottom: 10px;">共 <b id="all">'+length+'</b> 条, 已完成 <b id="ok">0</b> 条, 剩余 <b id="no">'+length+'</b> 条</p>';
        html+='            <textarea style="width:100%; height:400px;" id="requestresult"></textarea>';
        html+='        </div>';
        html+='    </div>';
        html+='</div>';
        $("body").append(html).find("#closeGetLinkDailog").click(function(){
            window.clearTimeout(that.setTime);
            $(this).parents(".b-dialog").remove();
        });
    },
        
    //from baidu START
    base64Encode: function(e) {
        var t, n, i, r, a, o, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (i = e.length,
             n = 0,
             t = ""; i > n; ) {
            if (r = 255 & e.charCodeAt(n++),
                n == i) {
                t += s.charAt(r >> 2),
                    t += s.charAt((3 & r) << 4),
                    t += "==";
                break
            }
            if (a = e.charCodeAt(n++),
                n == i) {
                t += s.charAt(r >> 2),
                    t += s.charAt((3 & r) << 4 | (240 & a) >> 4),
                    t += s.charAt((15 & a) << 2),
                    t += "=";
                break
            }
            o = e.charCodeAt(n++),
                t += s.charAt(r >> 2),
                t += s.charAt((3 & r) << 4 | (240 & a) >> 4),
                t += s.charAt((15 & a) << 2 | (192 & o) >> 6),
                t += s.charAt(63 & o)
        }
        return t
    },
    //from baidu END
    
    //from w3schools START
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return decodeURIComponent(c.substring(name.length,c.length));
        }
        return "";
    }
    //from w3schools END
};
var gdl = new getdownloadlink();
gdl.init();