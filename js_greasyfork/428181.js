// ==UserScript==
// @name         微信公众号粉丝查看增强工具
// @namespace    https://greasyfork.org/zh-CN/scripts/428181
// @version      0.1.12
// @description  微信公众号粉丝查看增强工具，可查看用户关注的精确时间（精确到时分秒），可导出用户数据，增加用户所在城市，解除跳转页数限制。
// @author       Wilson
// @match        https://mp.weixin.qq.com/cgi-bin/user_tag?action=get_all_data*
// @icon         https://img.icons8.com/fluent/48/000000/user-male-circle.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/428181/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%B2%89%E4%B8%9D%E6%9F%A5%E7%9C%8B%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/428181/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%B2%89%E4%B8%9D%E6%9F%A5%E7%9C%8B%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //用户数据，记录每次变更的数据
    unsafeWindow.userData = [];
    unsafeWindow.allUserData = [];
    //请求响应时间
    var lastRequestTime = 0,
        lastResponseTime = 0;

    //添加关注信息
    function addFllowInfo(userList) {
        for (let i in userList) {
            //添加关注时间
            let user = userList[i];
            user.user_openid = user.user_openid || user.id;
            user.user_create_time = user.user_create_time || user.create_time;
            let localDate = new Date(user.user_create_time * 1000).toLocaleString();
            //console.log(user.user_create_time, user.user_openid);
            let userName = document.querySelector(".user_info a[data-fakeid=" + user.user_openid + "]");
            //console.log(userName, user.user_openid);
            if (userName) userName.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#9a9a9a;">(' + localDate + '关注)</span>';
        }

        //绑定页面跳转按钮点击事件
        $(".page_go")[0].addEventListener("click", function(e) {
            //如果手动点击则自动跳转目标页
            if (e.isTrusted) {
                autoGoPage();
            }
        });

         //导出按钮
         $(".tool_area .pagination").append('<span><a href="javascript:;" onclick="wx_user_export()" style="margin-top:4px;margin-left:15px;display:inline-block;">导出本页</a></span>');
         let btnstyle = 'background-color: #fff;background-image: linear-gradient(to bottom,#fff 0,#fff 100%);border-color: #e7e7eb;color: #353535;height: 30px; line-height: 30px;padding-left: 10px; padding-right: 10px;width: auto;';
         $(".tool_area .pagination").append('<span style="margin-left:20px;">导出<input id="wx_export_num" type="text" value="'+(unsafeWindow.exportNum||'')+'" style="width:40px;border:1px solid #e7e7eb;height:20px;text-align:center;">页<a id="wx_export_all" href="javascript:;" onclick="wx_user_export_all()" class="btn" style="margin-left:6px;display:inline-block;'+btnstyle+'">导出</a></span>');
    }

    //错误提示
    function errorTips(str, delay) {
        $(".page_tips .inner").html(str);
        $(".page_tips").show();
        setTimeout(function(){
            $(".page_tips").hide();
            $(".page_tips .inner").html("将浏览器更新为QQ浏览器或Chrome浏览器，以获得更好的体验");
        }, delay||3000);
    }

    //监听ajax请求
    //var lastUserUrl = "";
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

            this.addEventListener("readystatechange", function() {

                //console.log(this.readyState, this.status, this);

                if (this.readyState==4 && this.status==200) {
                    //获取用户列表
                    if (url.indexOf("action=get_user_list") !== -1) {
                        let json = JSON.parse(this.response);
                        //console.log(this.readyState, this.status, json);
                        let userList = json.user_list.user_info_list || [];
                        //等待列表渲染完成添加信息
                        setTimeout(function(){
                            addFllowInfo(userList);
                        }, 400);
                        unsafeWindow.userData = userList;
                        //unsafeWindow.wx_user_export_page++;
                        if(unsafeWindow.isExporting) {
                            for(let j in userList) {
                                if(userList[j]) {
                                    unsafeWindow.allUserData.push(userList[j]);
                                }
                            }
                        }
                        //记录响应时间（毫秒）
                        lastResponseTime = new Date().getTime();
                    }

                    //获取用户信息
                    if (url.indexOf("action=get_fans_info") !== -1) {
                        let json = JSON.parse(this.response);
                        //console.log(this.readyState, this.status, json);
                        let userList = json.user_list.user_info_list || [];
                        if(userList.length > 0) {
                            let userInfo = userList[0];
                            setTimeout(function(){
                                $(".rich_buddy.popover").css("border", 0);
                                $(".popover_inner").css("border", "1px solid #C2C2C2").css("width", "355px");
                                if($(".frm_control_group.location").length === 0){
                                    let area = `<div class="frm_control_group location">
                                                <label class="frm_label">地区</label>
                                                <div class="frm_controls">`+userInfo.user_country+` `+userInfo.user_province+` `+userInfo.user_city+`</div>
                                            </div>`;
                                    $(".rich_user_info_inner").append(area);
                                }
                                let localDate = new Date(userInfo.user_create_time * 1000).toLocaleString();
                               $(".tips_global").html(localDate + "关注");
                            }, 200);
                        }
                    }
                }

                /*
                let userUrl = document.location.origin + url;
                if (lastUserUrl != userUrl && url.indexOf("ction=get_user_list") !== -1) {
                    console.log(userUrl);

                    GM_xmlhttpRequest({
                        method: "get",
                        url: userUrl,
                        onload: function(res){
                            if(res.status === 200){
                                console.log('sucess')
                                let json = JSON.parse(res.response);
                                let userList = json.user_list.user_info_list || [];
                                addFllowInfo(userList);
                                unsafeWindow.userData = userList;
                                //unsafeWindow.wx_user_export_page++;
                            }else{
                                console.log('error')
                                console.log(res)
                            }
                        },
                        onerror : function(err){
                            console.log('error')
                            console.log(err)
                        }
                    });

                    //$.getJSON(userUrl, function(data){
                    //console.log(data);
                    //$.each(data.items, function(i,item){
                    // });
                    //});
                    lastUserUrl = userUrl;
                }
                */

            }, false);

            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);

    //导出x页
    unsafeWindow.isExporting = false;
    unsafeWindow.exportNum = '';
    unsafeWindow.isStop = 0;
    unsafeWindow.wx_user_export_all = function() {
        if(unsafeWindow.isExporting) return false;
        unsafeWindow.isExporting = true;
        let total = parseInt($(".page_num label:last").text()-0);
        let currpage = parseInt($(".page_num label:first").text()-0);
        //if(currpage > 1){
        //    errorTips("请先跳转到第1页");
        //    unsafeWindow.isExporting = false;
        //    return false;
        //}
        unsafeWindow.allUserData = unsafeWindow.userData || wx.cgiData.user_list || [];
        //let count = unsafeWindow.allUserData.length;
        //let begin_openid = unsafeWindow.allUserData[count-1].id;
        //let begin_create_time = unsafeWindow.allUserData[count-1].create_time;
        unsafeWindow.exportNum = parseInt($("#wx_export_num").val()-0);
        if(unsafeWindow.exportNum <= 0){
            errorTips("请填写页数");
            unsafeWindow.isExporting = false;
            return false;
        }

        //正在导出中...
        $(".tool_area").append('<div id="wx_export_tips" style="margin-top:10px;"></div>');

        let sleep = function (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        let doGetUsers = async function() {
            let exportedPage = currpage;
            let fromPage = currpage + 1;
            for(let i = fromPage; i<=total; i++){
                //停止
                if(unsafeWindow.isStop == 1) {
                    unsafeWindow.isStop = 0;
                    break;
                }
                //超过页数
                let maxPage = currpage + (unsafeWindow.exportNum - 1);
                if(i > maxPage || i > total) break;

                //记录请求时间（毫秒）
                lastRequestTime = new Date().getTime();

                //console.log('page ' + i, 1111, unsafeWindow.isExporting);
                $("#wx_export_tips").html("正在导出第"+i+"页，剩余"+(maxPage-i)+"页，请勿关闭页面...&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='isStop = 1;'>停止</a>");
                document.querySelector("a.page_next").click();

                /*
                let userUrl = "https://mp.weixin.qq.com/cgi-bin/user_tag?action=get_user_list&groupid=-2&begin_openid="+begin_openid+"&begin_create_time="+begin_create_time+"&limit=20&offset=20&backfoward=1&token=" + wx.data.t + "&lang=zh_CN&f=json&ajax=1&random="+Math.random();
                console.log(2222, userUrl);
                GM_xmlhttpRequest({
                    method: "get",
                    url: userUrl,
                    onload: function(res){
                        if(res.status === 200){
                            console.log('sucess')
                            console.log(333, res);
                            let json = JSON.parse(res.response);
                            let userList = json.user_list.user_info_list || [];
                            console.log(4444, userList);
                            for(let j in userList) {
                                if(userList[j]) {
                                    unsafeWindow.allUserData.push(userList[j]);
                                    begin_openid = userList[j].user_openid;
                                    begin_create_time = userList[j].user_create_time;
                                }
                            }
                        }else{
                            console.log('error')
                            console.log(res)
                        }
                    },
                    onerror : function(err){
                        console.log('error')
                        console.log(err)
                    }
                });
                */
                exportedPage = i;
                await sleep(2000);
                //console.log('request-time', lastResponseTime, lastRequestTime, lastResponseTime - lastRequestTime);
                //如果接口未加载成功延迟2秒重试，最多延迟8秒
                if(lastResponseTime - lastRequestTime > 0) ; else await sleep(2000);
                if(lastResponseTime - lastRequestTime > 0) ; else await sleep(2000);
                if(lastResponseTime - lastRequestTime > 0) ; else await sleep(2000);
            } //for end
            let exportedPageStr = currpage === exportedPage ? "" : "-" + exportedPage;
            wx_user_export(unsafeWindow.allUserData, "微信公众号粉丝第" + currpage + exportedPageStr + "页");
            $("#wx_export_tips").html("");
            unsafeWindow.isExporting = false;
        } //doGetUsers end
        doGetUsers();
    }

    //导出用户数据
    //unsafeWindow.wx_user_export_page = 1;
    unsafeWindow.wx_user_export = function(data, name) {
        //console.log(data,6666);
        let jsonData = data || unsafeWindow.userData;
        //列标题，逗号隔开，每一个逗号就是隔开一个单元格
        let str = `昵称,关注时间,openid,头像图片\n`;
        for (let i in jsonData) {
            let user = jsonData[i];
            user.user_openid = user.user_openid || user.id;
            if (!user.user_openid) continue;
            user.user_create_time = user.user_create_time || user.create_time;
            let localDate = new Date(user.user_create_time * 1000).toLocaleString();
            user.user_name = user.user_name || user.nick_name;
            user.user_head_img = user.user_head_img || "";
            str += `${user.user_name},${localDate},${user.user_openid},${user.user_head_img}\n`;
        }
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        //通过创建a标签实现
        var link = document.createElement("a");
        link.href = uri;
        //对下载的文件命名
        let currpage = parseInt($(".page_num label:first").text()-0);
        let today = new Date().toLocaleDateString().replace(/\//g,'-');
        link.download = (name || "微信公众号粉丝第" + currpage + "页") + "-" + today + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    //http请求
    function httpRequest(url, fn, method, data) {
        method = method || "get";
        data = data || "";
        GM_xmlhttpRequest({
            method: method,
            url: url,
            data: data,
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "referer": "https://mp.weixin.qq.com/cgi-bin/user_tag?action=get_all_data&lang=zh_CN&token="+wx.data.t
            },
            onload: function(res){
                if(res.status === 200){
                    //console.log('sucess',method,url);
                    if(fn) fn(res);
                }else{
                    console.log('error',method,url);
                    console.log(res);
                    if(fn) fn(null);
                }
            },
            onerror : function(err){
                console.log('error',method,url);
                console.log(err);
                if(fn) fn(null);
            }
        });
    }

    //睡眠x毫秒
    let sleep = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    //自动跳转页面
    let autoGoPage = async function() {
        let currpage = parseInt($(".page_num label:first").text()-0);
        let go = parseInt($(".goto_area :text").val()-0);
        if(!go) return;
        setTimeout(function(){$(".JS_TIPS.page_tips").hide();}, 0);

        //前进
        if ((go - currpage) > 25) {
            let max = Math.ceil((go-currpage)/25);
            let begin = currpage+25;
            for(let i=1;i<=max;i++) {
                if(begin >= go) begin = go;
                //console.log(i, begin, go);
                $(".goto_area :text").val(begin);
                await sleep(200);
                $(".page_go")[0].click();
                await sleep(2000);
                begin += 25;
            }
        }
        //后退
        if ((currpage - go) > 25) {
            let max = Math.ceil((currpage-go)/25);
            let begin = currpage-25;
            for(let i=1;i<=max;i++) {
                if(begin <= go) begin = go;
                //console.log(i, begin, go);
                $(".goto_area :text").val(begin);
                await sleep(200);
                $(".page_go")[0].click();
                await sleep(2000);
                begin -= 25;
            }
        }
    }

    //第一页用户数据（从js变量获取）
    window.addEventListener("load", function() {
        if (wx && wx.cgiData && wx.cgiData.user_list) {
            let userList = wx.cgiData.user_list || [];
            addFllowInfo(userList);
            unsafeWindow.userData = userList;

            //绑定页面跳转按钮点击事件
            $(".page_go")[0].addEventListener("click", function(e) {
                //如果手动点击则自动跳转目标页
                if (e.isTrusted) {
                    autoGoPage();
                }
            });

            ////首页获取图片地址

            //获取第一个用户的信息
            let userInfoUrl = "https://mp.weixin.qq.com/cgi-bin/user_tag?action=get_fans_info";
            httpRequest(userInfoUrl, function(res){
                if(res && res.response){
                    let data = JSON.parse(res.response);
                    //console.log(11111,userInfoUrl,data);
                    let userList = data.user_list.user_info_list || [];
                    if(userList.length > 0) {
                        let userInfo = userList[0];
                        setTimeout(function(){
                            wx.cgiData.user_list[0].user_head_img = userInfo.user_head_img;
                        }, 500);
                    }
                }
            }, "post", "token="+wx.data.t+"&lang=zh_CN&f=json&ajax=1&random="+Math.random()+"&user_openid="+wx.cgiData.user_list[0].id);


            //获取用户列表
            let userListUrl = "https://mp.weixin.qq.com/cgi-bin/user_tag?action=get_user_list&groupid=-2&begin_openid="+wx.cgiData.user_list[0].id+"&begin_create_time="+wx.cgiData.user_list[0].create_time+"&limit=20&offset=0&backfoward=1&token=" + wx.data.t + "&lang=zh_CN&f=json&ajax=1&random="+Math.random();
            httpRequest(userListUrl, function(res){
                if(res && res.response){
                    let data = JSON.parse(res.response);
                    //console.log(2222,userListUrl,data);
                    let userList = data.user_list.user_info_list || [];
                    let userMap = {};
                    if(userList.length > 0) {
                         for (let n in userList) {
                             if(userList[n] && userList[n].user_openid) userMap[userList[n].user_openid] = userList[n].user_head_img;
                         }
                    }
                    setTimeout(function(){
                        for (let i in wx.cgiData.user_list) {
                            let item = wx.cgiData.user_list[i];
                            if(userMap[item.id]) item.user_head_img = userMap[item.id];
                            wx.cgiData.user_list[i] = item;
                        }
                    }, 500);
                }
            }, "get");
        }
    });
})();