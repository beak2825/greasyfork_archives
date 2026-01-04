// ==UserScript==
// @name         115美剧天堂&lol电影天堂&3W美剧天堂 by 纯洁的韩总
// @namespace    http://www.51fxiang.com/
// @version      1.0.7
// @description  加入批量复制链接功能，一个一个链接复制太TM蛋碎了。。
// @author       51fixang.com
// @match        *://*.115mj.com/*
// @match        *://*.loldytt.com/*
// @match        *://*.tv3w.com/*
// @require      https://greasyfork.org/scripts/415581-jquery%E5%BA%93/code/jquery%E5%BA%93.js?version=866373
// @require      https://greasyfork.org/scripts/439260-js-copy/code/js-copy.js?version=1013281
// @note         2020-03-30 1.0.0 初版发布
// @note         2020-04-01 1.0.1 加入lol电影天堂功能，并修改部分Bug
// @note         2020-11-6 1.0.2 外链的一个js脚本失效，造成整个脚本运行错误，重新引用了一个
// @note         2021-04-19 1.0.3 115网站改版，脚本变更
// @note         2021-04-19 1.0.4 加入3W美剧天堂
// @note         2021-12-22 1.0.5 115网站改版，脚本变更
// @note         2022-1-28 1.0.6 115添加转换迅雷链接按钮，我遇到了解析不了迅雷链接的下载软件了
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398994/115%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82lol%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%823W%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%20by%20%E7%BA%AF%E6%B4%81%E7%9A%84%E9%9F%A9%E6%80%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/398994/115%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82lol%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%823W%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%20by%20%E7%BA%AF%E6%B4%81%E7%9A%84%E9%9F%A9%E6%80%BB.meta.js
// ==/UserScript==
var obj_51fxiang = {
    addcheckbox: function() {
        $("div[id='jishu']").each(function(i) {
            i = i + 1;

            //添加操作按钮

           var obj = $(this).find("span:contains('全选')");
            //debugger;
            obj.append("<a class='btn btn-primary' id='selectall_" + i + "' href='javascript:void(0);' onclick='' target='_self' hid='dwww_hidden_" + i + "' spanid='dwww_span_" + i + "' name='dwww_" + i + "' sn='" + i + "'>复制所选链接</a>&nbsp;<a class='btn btn-primary' id='selectall1_" + i + "' href='javascript:void(0);' onclick='' target='_self' hid='dwww_hidden_" + i + "' spanid='dwww_span_" + i + "' name='dwww1_" + i + "' sn='" + i + "'>复制所选链接并解析迅雷链接</a><span id='dwww_span_" + i + "' style='color:red;cursor:pointer;'>等待复制</span><input type='hidden' id='dwww_hidden_" + i + "' name='dwww_" + i + "' value='' />");
        });
    },
    selectall: function() {},
    copylink: function() {
        $("a[id^='selectall_']").click(function(i) {
            var dwww_ = "input[name='CopyAddr"+$(this).attr("sn")+"']";
            var links = "";
            var count = 0;
            $(dwww_).each(function() {
                if ($(this).is(":checked")) {
                    links += $(this).val() + "\r\n";
                    count++;
                }
            });
            var spanid = "#" + $(this).attr("spanid");
            var h_id = "#" + $(this).attr("hid");
            $(h_id).val(links);
            if (count < 1) {
                $(spanid).text("请选择后再进行复制");
                return;
            }

            //debugger;
            var clipboard = new ClipboardJS("a[class='"+ $(this).attr("class")+"']", {
                text: function() {
                    return $(h_id).val();
                }
            });
            clipboard.on('success',
            function(e) {
                //alert("复制成功");
                $(spanid).text("共" + count + "项 复制成功");
                e.clearSelection();
            });

            clipboard.on('error',
            function(e) {
                alert("复制失败" + e.action + "|" + e.trigger + "|" + e.text);
            });
            if (links != '') {
                $(spanid).unbind("click").click(function() {
                    obj_51fxiang.dialog(links);
                });
            }
        });


        $("a[id^='selectall1_']").click(function(i) {
            var dwww_ = "input[name='CopyAddr"+$(this).attr("sn")+"']";
            var links = "";
            var count = 0;
            var temp_val="";
            $(dwww_).each(function() {
                if ($(this).is(":checked")) {
                    temp_val=$(this).val();
                    if(temp_val.indexOf("thunder://")>-1)
                    {
                        temp_val=temp_val.replace("thunder://","");
                        temp_val = window.atob(temp_val).replace("AA","");
                        temp_val = temp_val.replace("ZZ","");
                        temp_val = decodeURIComponent(temp_val);
                    }
                    links += temp_val + "\r\n";
                    count++;
                }
            });
            var spanid = "#" + $(this).attr("spanid");
            var h_id = "#" + $(this).attr("hid");
            $(h_id).val(links);
            if (count < 1) {
                $(spanid).text("请选择后再进行复制");
                return;
            }

            //debugger;
            var clipboard = new ClipboardJS("a[class='"+ $(this).attr("class")+"']", {
                text: function() {
                    return $(h_id).val();
                }
            });
            clipboard.on('success',
            function(e) {
                //alert("复制成功");
                $(spanid).text("共" + count + "项 复制成功");
                e.clearSelection();
            });

            clipboard.on('error',
            function(e) {
                alert("复制失败" + e.action + "|" + e.trigger + "|" + e.text);
            });
            if (links != '') {
                $(spanid).unbind("click").click(function() {
                    obj_51fxiang.dialog(links);
                });
            }
        });
    },
    dialog: function(msg) {
        //http://www.hanwq.com/scripts/artdialog/dialog-plus-min.js
        //var d = dialog({
        //    title: '粘贴信息',
        //    content: msg
        //});
        //d.showModal();
        alert(msg);
    },
    copy: function copyToClipboard(txt) {
        if (window.clipboardData) {
            window.clipboardData.clearData();
            clipboardData.setData("Text", txt);
            alert("复制成功！");

        } else if (navigator.userAgent.indexOf("Opera") != -1) {
            window.location = txt;
        } else if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch(e) {
                alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
            }
            var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
            if (!clip) return;
            var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
            if (!trans) return;
            trans.addDataFlavor("text/unicode");
            var str = new Object();
            var len = new Object();
            str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            var copytext = txt;
            str.data = copytext;
            trans.setTransferData("text/unicode", str, copytext.length * 2);
            var clipid = Components.interfaces.nsIClipboard;
            if (!clip) return false;
            clip.setData(trans, null, clipid.kGlobalClipboard);
            alert("复制成功！");
        }
    },
    addcheckbox_loldytt: function() {
        //alert("dddd");
        $(".con4").each(function(i) {
            var index_id = i + 1;
            //添加操作按钮
            $(this).find(".ckall p").append("<a href='javascript:void(0);' id='ckall_" + index_id + "' ck='CopyAddr" + index_id + "'  hid='ckall_hidden_" + index_id + "' spanid='ckall_span_" + index_id + "' target='_self' style='margin-left:10px;' class='ckall_class_" + index_id + "'>复制选中的文件</a> <span id='ckall_span_" + index_id + "' style='color:red;cursor:pointer;'>等待复制</span><input type='hidden' id='ckall_hidden_" + index_id + "' ck='CopyAddr" + index_id + "' value='' /></div>");
        });
    },
    copylink_loldytt: function() {
        $("a[id^='ckall_']").click(function(i) {
            //debugger;
            var dwww_ = $(this).attr("ck");
            var links = "";
            var count = 0;
            $("input[name='" + dwww_ + "']").each(function() {
                if ($(this).is(":checked")) {
                    links += $(this).val() + "\r\n";
                    count++;
                }
            });

            var spanid = "#" + $(this).attr("spanid");
            var h_id = "#" + $(this).attr("hid");
            $(h_id).val(links);
            if (count < 1) {
                $(spanid).text("请选择后再进行复制");
                return;
            }
            var clipboard = new ClipboardJS("." + $(this).attr("class"), {
                text: function() {
                    return $(h_id).val();
                }
            });
            clipboard.on('success',
            function(e) {
                //alert("复制成功");
                $(spanid).text("共" + count + "项 复制成功");
                e.clearSelection();
            });

            clipboard.on('error',
            function(e) {
                alert("复制失败" + e.action + "|" + e.trigger + "|" + e.text);
            });
            if (links != '') {
                $(spanid).unbind("click").click(function() {
                    obj_51fxiang.dialog(links);
                });
            }
        });
    },
    addcheckbox_tv3w: function() {
        //alert("tv3w");
        $(".downtools").each(function(i) {
            i = i + 1;
            var sn_id = $(this).find("input[name='checkall']").attr("id");
            var sn = sn_id.replace("allcheck", "");
            //添加操作按钮
            $(this).prepend("<a href='javascript:void(0);' class='dwww_link_" + sn + "' hid='dwww_hidden_" + sn + "' spanid='dwww_span_" + sn + "' name='dwww_" + sn + "' sn='" + sn + "'  target='_self'>复制所选链接</a><span id='dwww_span_" + sn + "' style='color:red;cursor:pointer;line-height: 28px;vertical-align: text-bottom;padding: 0 15px;'>等待复制</span><input type='hidden' id='dwww_hidden_" + sn + "' name='dwww_" + sn + "' value='' />");
        });
    },
    selectall_tv3w: function() {
        $("input[name='checkall']").attr("onclick", "");
        $("input[name='checkall']").change(function() {
            //debugger;
            var sn_id = $(this).attr("id");
            var sn = sn_id.replace("allcheck", "");
            var dwww_ = "down_url_list_" + sn;

            if ($(this).is(":checked")) {
                $("input[name='" + dwww_ + "']").attr("checked", "checked");
            } else {
                $("input[name='" + dwww_ + "']").removeAttr("checked");
            }
        });
    },
    copylink_tv3w: function() {
        $("a[class^='dwww_link_']").click(function(i) {
            var dwww_ = "down_url_list_" + $(this).attr("sn");
            var links = "";
            var count = 0;
            $("input[name='" + dwww_ + "']").each(function() {
                if ($(this).is(":checked")) {
                    links += $(this).val() + "\r\n";
                    count++;
                }
            });
            var spanid = "#" + $(this).attr("spanid");
            var h_id = "#" + $(this).attr("hid");
            $(h_id).val(links);
            if (count < 1) {
                $(spanid).text("请选择后再进行复制");
                return;
            };
            var clipboard = new ClipboardJS("." + $(this).attr("class"), {
                text: function() {
                    return $(h_id).val();
                }
            });
            clipboard.on('success',
            function(e) {
                if (count > 0) {
                    $(spanid).text("共" + count + "项 复制成功");
                } else {
                    $(spanid).text("请选择后再进行复制");
                }
                e.clearSelection();
            });

            clipboard.on('error',
            function(e) {
                alert("复制失败" + e.action + "|" + e.trigger + "|" + e.text);
            });
            if (links != '') {
                $(spanid).unbind("click").click(function() {
                    obj_51fxiang.dialog(links);
                });
            }
        });
    }
}; (function() {
    var domain = document.domain;
    if (domain.indexOf('115mj') > -1) {
        obj_51fxiang.addcheckbox();
        obj_51fxiang.copylink();
    }

    if (domain.indexOf('loldytt') > -1) {
        obj_51fxiang.addcheckbox_loldytt();
        obj_51fxiang.copylink_loldytt();
    }

    if (domain.indexOf('tv3w') > -1) {
        obj_51fxiang.addcheckbox_tv3w();
        obj_51fxiang.selectall_tv3w();
        obj_51fxiang.copylink_tv3w();
    }
})();