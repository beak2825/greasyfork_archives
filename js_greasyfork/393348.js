// ==UserScript==
// @name         vipexam no ip limit
// @namespace    https://github.com/maiersk
// @version      0.2.5
// @description  中科vipexam, umajor, joblib no ip limit
// @author       ABTTEX
// @match        http://www.vipexam.net/*
// @match        https://www.vipexam.net/*
// @match        http://vipexam.net/*
// @match        https://vipexam.net/*
// @match        http://www.vipexam.org/*
// @match        https://www.vipexam.org/*
// @match        http://www.vipexam.cn/*
// @match        https://www.vipexam.cn/*
// @match        http://lib.vipexam.org/*
// @match        https://lib.vipexam.org/*
// @match        http://lib.vipexam.cn/*
// @match        https://lib.vipexam.cn/*
// @match        http://vipexam.org/*
// @match        https://vipexam.org/*
// @match        http://vipexam.cn/*
// @match        https://vipexam.cn/*
// @match        http://www.umajor.org/*
// @match        https://www.umajor.org/*
// @match        http://www.umajor.net/*
// @match        https://www.umajor.net/*
// @match        http://www.joblib.cn/*
// @match        https://www.joblib.cn/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/393348/vipexam%20no%20ip%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/393348/vipexam%20no%20ip%20limit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var _vipexam = null;
    var _umajor = null;

    var _veuser = { code: "", user: { "account": "f46354b31ec64c9c96919e12a9bbd610", "username": "游客（受限）", collegename: "北京大学" } };
    var _umuser = { code: "1", user: { "account": "f46354b31ec64c9c96919e12a9bbd610", "username": "游客（受限）", collegename: "1111" } };

    layui.use(['form', 'layer', 'jquery', 'cookie', 'element'], function () {
        var $ = layui.jquery,
            element = layui.element,
            form = layui.form,
            layer = layui.layer,

        _vipexam = $.cookie("vipexam");
        _umajor = $.cookie("umajor");
        var vipexam_storage = !!_vipexam ? JSON.parse(_vipexam) : _veuser;
        var umajor_storage = _umajor ? JSON.parse(_umajor) : _umuser;
        var _vid = vipexam_storage.user.account;
        var _umid = umajor_storage.user.account;

        //vipexam账号角色id，3是教师账号id，4是普通账号id
        var _role = 3;

        function RequestJson(url, params, callback) {
            var _idx = layer.load(1);
            $.ajax({ type: "post", data: params, url: url, dataType: "json", global: false, success: function (data) { callback && callback(data); }, complete: function () { layer.close(_idx); }, error: function (XMLHttpRequest, textStatus, errorThrown) { layer.close(_idx); } });
        }

        //vipexam登录
        form.on('submit(vipexam_crashlogin)', function (data) {
            _vid = $("#username").val();

            RequestJson("user/login.action", { account: $("#username").val(), password: $("#password").val() }, function (data) {
                if (data.code == "1") {
                    data.user.role = _role
                    $.cookie("vipexam", JSON.stringify(data), { path: '/', expires: 7 });
                    _vipexam = $.cookie("vipexam");
                    document.location = "index.html";
                } else {
                    layer.msg(data.msg, { icon: 2 });
                }
            });
            return false;
        });

        // umajor登录
        form.on('submit(umajor_crashlogin)', function (data) {
            _umid = $("#username").val();

            RequestJson("user/login.action", { account: $("#username").val(), password: $("#password").val() }, function (data) {
                if (data.code == "1") {
                    $.cookie("umajor", JSON.stringify(data), { path: '/', expires: 7 });
                    _umajor = $.cookie("umajor");
                    document.location = "index.html";
                } else {
                    layer.msg(data.msg, { icon: 2 });
                }
            });
            return false;
        });

        // joblib登录
        form.on('submit(joblib_crashlogin)', function (data) {
            _umid = $("#username").val();

            RequestJson("user/login.action", { account: $("#username").val(), password: $("#password").val(), Version: "1" }, function (data) {
                if (data.code == "1") {
                    $.cookie("joblib", JSON.stringify(data), {  path: '/', expires: 7});
                    _vipexam = $.cookie("joblib");
                    window.userName=data.user.account;
                    document.location = "index.html";
                } else {
                    layer.msg(data.msg, { icon: 2 });
                }
            });
            return false;
        });

        //关闭ip问题弹窗
        $(function () {
            setTimeout(function () {
                layer.closeAll();
            }, 350);
        });

        //显示已登录信息
        if (_vid != "f46354b31ec64c9c96919e12a9bbd610" || _umid != "f46354b31ec64c9c96919e12a9bbd610") {
            if (window.location.host.indexOf('vipexam') !== -1) {
                $("#person").text(_vid);
                $("#rtbox").hide();
                $("#rtbox2").show();
            }

            if (window.location.host.indexOf('umajor') !== -1) {
                $("#personid").text(_umid);
                $("#login").hide();
                $("#person").show();
                $("#personid").hover(function () {
                    layer.tips("<a href='personal_center.html' style='color:#fff;'>个人中心</a>", this, { tips: [3, '#666'], time: 3000, area: ['80px', '40px'] });
                }, function () { });
            }

            if (window.location.host.indexOf('joblib') !== -1) {
                $(".jl_logo").prepend("<img src='"+data.collegeLogo+"?v="+_version+"' style='float:left;margin:10px 10px 10px 0;max-width:250px;' alt/>");
                $(".jl_search").removeClass("logo_hide").addClass("logo_show");
            }
        }
    });

    $(document).ready(function () {
        if (window.location.host.indexOf('vipexam') !== -1) {
            var div = $(".layui-form-item-center");
            var vipexam_crashlogin = '<div id="vipexam_crashlogin" lay-submit lay-filter="vipexam_crashlogin" class="layui-btn" >crashlogin</div>';
            div.append(vipexam_crashlogin);
        }

        if (window.location.host.indexOf('umajor') !== -1 && window.location.pathname.indexOf('login') !== -1) {
            var umajor_crashlogin = '<div id="umajor_crashlogin" lay-submit lay-filter="umajor_crashlogin" class="layui-btn" >crashlogin</div>';
            $(".layui-form").append(umajor_crashlogin);
        }
        
        if (window.location.host.indexOf('joblib') !== -1 && window.location.pathname.indexOf('login') !== -1) {
            var joblib_crashlogin = '<div id="joblib_crashlogin" lay-submit lay-filter="joblib_crashlogin" class="layui-btn" >crashlogin</div>';
            $(".layui-form").append(joblib_crashlogin);
        }

    })
})();