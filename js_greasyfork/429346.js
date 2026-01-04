// ==UserScript==
// @name         摹客增强插件
// @namespace    https://greasyfork.org/zh-CN/scripts/429346
// @version      0.1.9
// @description  增强项目导航菜单，设置默认手型工具（按h键可切换）
// @author       Wilson
// @match        https://app.mockplus.cn/app/*/*
// @icon         https://app.mockplus.cn/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429346/%E6%91%B9%E5%AE%A2%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/429346/%E6%91%B9%E5%AE%A2%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //http请求
    function httpRequest(url, fn, method, data, header) {
        method = method || "get";
        data = data || "";
        header = header || {};
        GM_xmlhttpRequest({
            method: method,
            url: url,
            data: data,
            headers: header,
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

    $('#app').on("DOMNodeInserted", function(event){
        if(!event || !event.target || !event.target.className) return;
        let className = event.target.className || "";
        //app-container app-header
        if(className == "app-container" || className == "app-header"){
            httpRequest("https://app.mockplus.cn/api/v1/user/info", function(info){
                if(info && info.response){
                    info = JSON.parse(info.response);
                    if(info.code != 0){
                        console.log('error', info.message,catUrl, info);
                        return;
                    }
                    let defaultIDocTeamID = info.payload.defaultIDocTeamID;
                    let catUrl = "https://app.mockplus.cn/api/v1/app/allAppAndAppSet/"+defaultIDocTeamID+"?needArchivedApp=true&source=all&needAppSet=true&rnd="+Math.random();
                    httpRequest(catUrl, function(res){
                        if(res && res.response){
                            //get menu list
                            let data = JSON.parse(res.response);
                            // console.log(11111,catUrl,data);
                            if(data.code != 0){
                                console.log('error', data.message,catUrl,data);
                                return;
                            }
                            data = data.payload.apps;
                            //按访问时间倒序
                            data.sort(function(x, y) { return new Date(y['accessedAt']).getTime() - new Date(x['accessedAt']).getTime()});
                            //console.log(data, 222);
                            //menu
                            setTimeout(function(){
                                //设置默认手型工具
                                let movehand = document.querySelector(".icon-_artboard_movehand");
                                movehand.click();
                                //绑定h按键
                                document.addEventListener("keypress", function(event){
                                    if (event.keyCode == 104){
                                        movehand.click();
                                    }
                                }, false);

                                //获取项目菜单
                                let appsetUrl = "https://app.mockplus.cn/team/"+defaultIDocTeamID+"/AppSet/";
                                let list = "";
                                for(let i in data){
                                    let item = data[i];
                                    let href = location.href.replace(/\/app\/.+\//i, '/app/'+item._id+'/');
                                    let subarrow = '';
                                    let submenu = '';
                                    if(item.isAppSet) {
                                        href = appsetUrl + item._id;
                                        subarrow = `<i class="dsm-c-icon idoc_iconfont icon-_tag_rightarrow" style="font-size: 16px; width: 16px; height: 16px; color: rgb(150, 151, 152); visibility: visible;float:right;margin-right:5px;"></i>`;

                                        //子菜单
                                        let submenulist='';
                                        let subs = item.children;
                                        //按访问时间倒序
                                        subs.sort(function(x, y) { return new Date(y['accessedAt']).getTime() - new Date(x['accessedAt']).getTime()});
                                        //console.log(subs);
                                        for(let j in subs){
                                            let sub = subs[j];
                                            let subhref = location.href.replace(/\/app\/.+\//i, '/app/'+sub._id+'/');
                                            submenulist += '<li class="menu-sub"><a class="menu-item" href="'+subhref+'" >'+sub.name+'</a></li>';
                                        }
                                        submenu = `
  <div style="position: relative;">
  <div class="submenu-mode-popup" style="display:none;position: absolute;left:220px;top:-40px;">
   <ul class="dsm-c-drop" style="width: 225px;">
   `+submenulist+`
   </ul>
  </div>
  </div>
    `;
                                    }
                                    let id = location.href.replace(/(.+\/app\/)(.+)(\/.+)/i, '$2');
                                    if(id == item._id) continue;
                                    let a = '<li class="menu-parent '+(item.isAppSet?'appsetli':'')+'"><a class="menu-item" isAppSet="'+(item.isAppSet?1:0)+'" appSetID="'+item._id+'" href="'+href+'" >'+item.name+subarrow+'</a></li>';
                                    a += submenu;
                                    list += a;
                                    if(i == 4){
                                        list += '<li class="split-line"></li>';
                                    }
                                }
                                let menu = `
  <div class="menu-mode-popup" style="display:none;">
  <div class="menu-wrapper" style="position: absolute;top:25px;">
   <ul class="dsm-c-drop" style="width: 225px;">
   `+list+`
   </ul>
   </div>
  </div>
    `;
                                //arrow
                                let arrow = `
                <div class="down-arrow" style="position: relative;top: 2px;"><i class="dsm-c-icon idoc_iconfont icon-_tag_downarrow" style="font-size: 16px; width: 16px; height: 16px; visibility: visible;"></i></div>
                `;
                                //show/hide
                                let menuwrap = null;
                                function oMenuWrap(){
                                    menuwrap = menuwrap || $(".app-header .logo > .dsm-c-tooltip .menu-mode-popup");
                                    return menuwrap;
                                }
                                let lia = null;
                                function oLiA(){
                                    lia = lia || $(".app-header .logo > .dsm-c-tooltip .menu-mode-popup li a.menu-item");
                                    return lia;
                                }
                                let menutooltip = $(".app-header .logo > .dsm-c-tooltip");
                                menutooltip.append(arrow).append(menu);
                                $(".app-header .logo > .dsm-c-tooltip .menu-mode-popup .menu-parent").on("mouseenter", function(){
                                    $(".submenu-mode-popup").hide();
                                    $(this).next('div').find(".submenu-mode-popup").show();
                                })
                                menutooltip.click(function(e){
                                    let act = location.href.replace(/(.+\/app\/)(.+)(\/)(.+)$/i, '$4');
                                    oLiA().each(function(){
                                        let me = $(this);
                                        let href = me.attr("href");
                                        href = href.replace(/(.+\/app\/.+\/)(.+)$/i, '$1'+act);
                                        if(me.attr("isAppSet")==1) href = appsetUrl + me.attr("appSetID");
                                        me.attr("href", href);
                                    });
                                    if(oMenuWrap().is(":hidden")) {
                                        oMenuWrap().show();
                                    } else {
                                        oMenuWrap().hide();
                                    }
                                    e.stopPropagation();
                                });
                                $(".app-header .logo > .dsm-c-tooltip .menu-wrapper").on('mouseleave', function(){
                                    oMenuWrap().hide();
                                });
                                $("body").click(function(){
                                    oMenuWrap().hide();
                                });
                            }, 200);
                        }
                    });
                }
            });
        }
    });
})();