// ==UserScript==
// @name         StuMaSy web插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  StuMaSy WEB - 插件版 【编程猫社区】
// @author       PXstate
// @match        *://*.shequ.codemao.cn/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/462065/StuMaSy%20web%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/462065/StuMaSy%20web%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        var elements = document.getElementsByClassName('c-navigator--dropdown')[0];
        var li = document.createElement('li');
        var classs = document.createAttribute('class')
        classs.value = 'c-navigator--dropdown_item'
        li.setAttributeNode(classs)
        var a = document.createElement('a');
        var target = document.createAttribute('target')
        target.value = '_blank'
        a.setAttributeNode(target)
        var id = document.createAttribute('id')
        id.value = 'stumasy'
        a.setAttributeNode(id)
        var content = document.createTextNode('StuMaSy web');
        a.appendChild(content)
        li.appendChild(a)
        elements.appendChild(li);
        document.getElementById('stumasy').onclick = function(){
            console.clear()
            // 常用函数导入
            function made_html(type,content,data){var ftype = document.createElement(type);var fcontent = document.createTextNode(content);ftype.appendChild(fcontent);for (let d in data){var d_name = document.createAttribute(d);d_name.value = data[d];ftype.setAttributeNode(d_name);}return ftype;};
            function dele_id(id){document.getElementById(id).innerHTML = '';};
            function add_id(id,ys){var f_id = document.getElementById(id);f_id.appendChild(ys);};
            function requests(type,url,headers,data){var xhr = new XMLHttpRequest();xhr.withCredentials = true;xhr.open(type.toUpperCase(),url);xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers){xhr.setRequestHeader(c,headers[c]);}xhr.send(JSON.stringify(data));}
            function studio_comment(gzsid,plid,content){var headers = {};var data = {parent_id: 0, content: content, source: "WORK_SHOP"};var xhr = new XMLHttpRequest();xhr.withCredentials = true;xhr.open('post','https://api.codemao.cn/web/discussions/' + gzsid + '/comments/' + plid + '/reply');xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers){xhr.setRequestHeader(c,headers[c]);}xhr.send(JSON.stringify(data));xhr.onload = function(){};}
            function gz_comment(cif,content,ret,pl,plid,gzsid,nickname){if(cif == pl){studio_comment(gzsid,plid,content);add_or(nickname + ' ' + ret + ' (本次管理成功)');}}
            function stc(gzsid,content){
                var headers = {}
                var data = {content: content, rich_content: content, source: "WORK_SHOP"}
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open('post','https://api.codemao.cn/web/discussions/' + gzsid + '/comment');
                xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers){xhr.setRequestHeader(c,headers[c]);}xhr.send(JSON.stringify(data))
                xhr.onload = function(){}
            }
            function idname(yhid){
                var headers11 = {}
                var data11 = {}
                var xhr11 = new XMLHttpRequest();
                xhr11.withCredentials = true;
                xhr11.open('get','https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=' + yhid);
                xhr11.setRequestHeader('Content-Type','application/json;charset=UTF-8');
                for(let c in headers11){
                    xhr11.setRequestHeader(c,headers11[c]);
                }

                xhr11.onreadystatechange = function(){
                    var res11 = JSON.parse(xhr11.responseText)
                    console.log(res11['nickname'])
                }
                xhr11.send(JSON.stringify(data11))
            }
            function jfphbzj(content,color,size){add_id('jfphbsz',made_html('p',content,{'style':'color:' + color +';font-family: "";font-size: ' + size + 'px;'}))}
            // 清空页面 + LG展示
            dele_id('root')
            let divKz = document.createElement('div');divKz.id = 'kz';document.body.appendChild(divKz);
            add_id('root',made_html('div','',{'id':'dh','style':'position:absolute;width:100%;height: 42px;background-color: rgba(0,0,0,0.03);background-size:100% 100%;filter: drop-shadow(2px 4px 6px black);user-select: none;'}))
            add_id('dh',made_html('img','',{'src':'https://s1.ax1x.com/2023/03/11/ppKDVj1.png','width':'135px','style':'position: absolute;top: 1px;left: 10px;'}))
            add_id('root',made_html('div','',{'style':'width: 98.5%;background-color: rgba(0,0,0,0.04);position: absolute;top: 360px;left: 10px;border-radius: 6px;padding-top: 5px;padding-right: 4px;padding-bottom: 9px;padding-left: 13px;resize:none;filter: drop-shadow(2px 4px 5px grey);','id':'ab'}))
            add_id('root',made_html('div','',{'style':'width: 98.5%;height: 149px;background-color: rgba(0,0,0,0.04);position: absolute;top: 51px;left: 10px;border-radius: 6px;padding-top: 5px;padding-right: 4px;padding-bottom: 9px;padding-left: 13px;resize:none;filter: drop-shadow(2px 4px 5px grey);','id':'sq'}))
            add_id('root',made_html('div','',{'style':'width: 98.5%;height: 135px;background-color: rgba(0,0,0,0.04);position: absolute;top: 213px;left: 10px;border-radius: 6px;padding-top: 5px;padding-right: 4px;padding-bottom: 9px;padding-left: 13px;resize:none;filter: drop-shadow(2px 4px 5px grey);','id':'kuozhan'}))
            add_id('kuozhan',made_html('p','功能市场',{'style':'color: black;font-family: "";font-size: 16px;'}))
            add_id('sq',made_html('p','自动同意申请',{'style':'color: black;font-family: "";font-size: 16px;position: absolute;'}))
            add_id('ab',made_html('p','使用反馈',{'style':'color: black;font-family: "";font-size: 16px;'}))
            add_id('sq',made_html('button','开启',{'style':'color:black;position: absolute;width: 72px;height: 20px;border-radius: 5px;background-color: rgba(0,0,0,0.1);top: 8px;left: 118px;font-size: 12px;','id':'bes'}))
            add_id('kuozhan',made_html('button','积分排行榜',{'style':"border-radius: 8px;height: 29px;padding-top: 1px;padding-bottom: 1px;padding-left: 19px;padding-right: 20px;position: absolute;left: 19px;top: 40px;font-size: 13px;",'id':'jfphb'}))
            // 选项
            add_id('sq',made_html('input','',{'style':'position: absolute;width: 460px;height: 30px;border-radius: 5px;background-color: rgba(0,0,0,0.1);top: 47px;left: 14px;font-size: 14px;padding-left: 10px;','placeholder':'请输入点赞条件','id':'dztj'}))
            add_id('sq',made_html('input','',{'style':'position: absolute;width: 460px;height: 30px;border-radius: 5px;background-color: rgba(0,0,0,0.1);top: 86px;left: 14px;font-size: 14px;padding-left: 10px;','placeholder':'请输入收藏条件','id':'sctj'}))
            add_id('sq',made_html('input','',{'style':'position: absolute;width: 460px;height: 30px;border-radius: 5px;background-color: rgba(0,0,0,0.1);top: 47px;left: 491px;font-size: 14px;padding-left: 10px;','placeholder':'请输入再创作条件','id':'zcztj'}))
            add_id('sq',made_html('input','',{'style':'position: absolute;width: 460px;height: 30px;border-radius: 5px;background-color: rgba(0,0,0,0.1);top: 86px;left: 491px;font-size: 14px;padding-left: 10px;','placeholder':'请输入等级条件','id':'djtj'}))
            function add_or(text){add_id('ab',made_html('p',text,{'style':'color:rgba(0,0,0,0.9);font-family:"腾讯体"'}))}
            add_or('欢迎使用StuMaSy web - 当前版本号：W1.4 GN:HF/QD/SCTG/ZDTYSQ')

            // StuMaSy
            // 自动同意申请开关
            window.sessionStorage.setItem('自动同意申请开关','关')
            document.getElementById('bes').onclick = function(){
                if(window.sessionStorage.getItem('自动同意申请开关') == '关'){
                    window.sessionStorage.setItem('自动同意申请开关','开')
                    document.getElementById('bes').innerHTML='关闭'
                }else{
                    window.sessionStorage.setItem('自动同意申请开关','关')
                    document.getElementById('bes').innerHTML='打开'
                }
            }
            // 积分排行榜
            let jfphbBtn = document.getElementById('jfphb');
            let rootDiv = document.getElementById('root');

            jfphbBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                rootDiv.style.filter = 'blur(20px)';
                add_id('kz',made_html('div','',{'style':'width: 90%;background-color: rgba(255,255,255,0.6);position: absolute;top: 18px;left: 64px;border-radius: 10px;padding: 6px;padding-left: 13px;','id':'jfphbsz'}))
                add_id('jfphbsz',made_html('p','积分排行榜',{'style':'color:black;font-family: "";font-size: 22px;text-align: center;'}))
                var jf = window.localStorage.getItem('积分')
                jf = JSON.parse(jf)
                let ida = Object.keys(jf);
                let jfa = Object.values(jf);
                jfa.sort((a, b) => b - a);
                ida = ida.sort((x, y) => jf[y] - jf[x]);
                for(var no = 0;no<jfa.length;no++){
                    var color = 'rgba(0,0,0,0.4)'
                    var size = '16'
                    var mc = no + 1
                    if(mc == 1){
                        color = 'rgba(0,0,0,0.9)'
                    }else if(mc == 2){
                        color = 'rgba(0,0,0,0.7)'
                    }else if(mc == 3){
                        color = 'rgba(0,0,0,0.5)'
                    }else{
                        size = '15'
                    }
                    jfphbzj('第' + mc + '名 名称:' + ida[no] + ' 积分:' + jfa[no],color,size)
                }
            });

            rootDiv.addEventListener('dblclick', function() {
                rootDiv.style.filter = 'none';
                dele_id('kz')
            });

            var headers1 = {}
            var data1 = {}
            var xhr1 = new XMLHttpRequest();
            xhr1.withCredentials = true;
            xhr1.open('get','https://api.codemao.cn/web/users/details');
            xhr1.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers1){xhr1.setRequestHeader(c,headers1[c]);}xhr1.send(JSON.stringify(data1))
            xhr1.onload = function(){
                var res1 = JSON.parse(xhr1.responseText)
                var p_myid = res1['id']
                add_or('使用者ID : ' + p_myid)
                var headers2 = {}
                var data2 = {}
                var xhr2 = new XMLHttpRequest();
                xhr2.withCredentials = true;
                xhr2.open('get','https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=' + p_myid);
                xhr2.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers2){xhr2.setRequestHeader(c,headers2[c]);}xhr2.send(JSON.stringify(data2))
                xhr2.onload = function(){
                    var res2 = JSON.parse(xhr2.responseText)
                    var p_gzsid = res2['subject_id']
                    add_or('使用工作室信息 ↓')
                    if (p_gzsid != ''){
                        var headers3 = {}
                        var data3 = {}
                        var xhr3 = new XMLHttpRequest();
                        xhr3.withCredentials = true;
                        xhr3.open('get','https://api.codemao.cn/web/shops/' + p_gzsid);
                        xhr3.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers3){xhr1.setRequestHeader(c,headers3[c]);}xhr3.send(JSON.stringify(data3))
                        xhr3.onload = function(){
                            var res3 = JSON.parse(xhr3.responseText)
                            // 工作室第二id   投稿数量
                            var p_drgzsid = res3['shop_id']
                            var p_tgsl = res3['n_works']
                            var p_preview_url = res3['preview_url']
                            var p_gzsname = res3['name']
                            add_or('ID : ' + p_gzsid + ' - 名称 : ' + p_gzsname + ' - 投稿数量 : ' + p_tgsl + ' - Sid : ' + p_drgzsid)
                            var 评论id = window.localStorage.getItem('评论id')
                            if(评论id == null){
                                var 评论id = [0]
                                window.localStorage.setItem('评论id',JSON.stringify(评论id))
                                window.localStorage.setItem('积分',JSON.stringify({}))
                                var date = new Date();
                                window.localStorage.setItem('日期',date.toLocaleDateString())
                                window.localStorage.setItem('当日签到用户',JSON.stringify([0]))
                            }
                            var 评论id = window.localStorage.getItem('评论id')
                            var 积分 = window.localStorage.getItem('积分')
                            var 日期 = window.localStorage.getItem('日期')
                            var 当日签到用户 = window.localStorage.getItem('当日签到用户')
                            评论id = JSON.parse(评论id)
                            积分 = JSON.parse(积分)
                            当日签到用户 = JSON.parse(当日签到用户)
                            add_or('信息提取完毕，开始运行')
                            var headers10 = {}
                            var data10 = {}
                            var xhr10 = new XMLHttpRequest();
                            xhr10.withCredentials = true;
                            xhr10.open('get','https://api.codemao.cn/web/shops/' + p_gzsid + '/users?limit=20&offset=0');
                            xhr10.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers10){xhr10.setRequestHeader(c,headers10[c]);}xhr10.send(JSON.stringify(data10))
                            xhr10.onload = function(){
                                var res10 = JSON.parse(xhr10.responseText)
                                var items = res10['items']
                                var p_glry = []
                                for (var cy of items){
                                    if(cy['position'] == 'LEADER' || cy['position'] == 'DEPUTYLEADER'){
                                        p_glry.push(cy['user_id'])
                                    }
                                }
                                setInterval(function(){
                                    评论id = window.localStorage.getItem('评论id');
                                    积分 = window.localStorage.getItem('积分');
                                    日期 = window.localStorage.getItem('日期');
                                    当日签到用户 = window.localStorage.getItem('当日签到用户');
                                    评论id = JSON.parse(评论id);
                                    积分 = JSON.parse(积分);
                                    当日签到用户 = JSON.parse(当日签到用户);
                                    var date = new Date();
                                    if(日期 == date.toLocaleDateString()){
                                        var date = new Date();
                                        window.localStorage.setItem('当日签到用户',JSON.stringify([0]))
                                    }
                                    评论id = window.localStorage.getItem('评论id');
                                    积分 = window.localStorage.getItem('积分');
                                    日期 = window.localStorage.getItem('日期');
                                    当日签到用户 = window.localStorage.getItem('当日签到用户');
                                    评论id = JSON.parse(评论id);
                                    积分 = JSON.parse(积分);
                                    当日签到用户 = JSON.parse(当日签到用户);

                                    // 基础回复
                                    var headers4 = {}
                                    var data4 = {}
                                    var xhr4 = new XMLHttpRequest();
                                    xhr4.withCredentials = true;
                                    xhr4.open('get','https://api.codemao.cn/web/discussions/' + p_gzsid + '/comments?source=WORK_SHOP&sort=-created_at&limit=5&offset=0');
                                    xhr4.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers4){xhr4.setRequestHeader(c,headers4[c]);}xhr4.send(JSON.stringify(data4))
                                    xhr4.onload = function(){
                                        var res4 = JSON.parse(xhr4.responseText)
                                        res4 = res4['items']
                                        for (var items of res4){
                                            var user = items['user']
                                            var plid = items['id']               //评论ID
                                            var nickname = user['nickname']     //用户名字
                                            var content = items['content']      //评论内容
                                            var yhid = user['id']               //用户ID
                                            if(评论id.includes(plid) == false){
                                                window.sessionStorage.setItem('plid',plid)
                                                window.sessionStorage.setItem('nickname',nickname)
                                                window.sessionStorage.setItem('content',content)
                                                window.sessionStorage.setItem('yhid',yhid)
                                                // cif,content,ret,pl,plid,gzsid,nickname
                                                // 基本指令
                                                gz_comment('全部指令','1/冒泡 2/串门 3/StuMaSy 4/删除投稿为 + 作品id (例如:删除投稿为114514)','询问全部指令',content,plid,p_gzsid,nickname)
                                                gz_comment('串门','欢迎(^-^)','串门',content,plid,p_gzsid,nickname)
                                                gz_comment('冒泡','戳（）','冒泡',content,plid,p_gzsid,nickname)
                                                gz_comment('StuMaSy','StuMaSy是由PXstate制作，有web版和py版','询问StuMaSy简介',content,plid,p_gzsid,nickname)
                                                // 签到指令
                                                if(content == '签到'){
                                                    if(当日签到用户.includes(window.sessionStorage.getItem('yhid')) == false){
                                                        if(积分[yhid] != undefined){
                                                            积分[yhid] = parseInt(积分[yhid]) + 5
                                                            当日签到用户.push(yhid)
                                                        }else{
                                                            积分[yhid] = 5
                                                            当日签到用户.push(yhid)
                                                        }
                                                        studio_comment(p_gzsid,plid,'签到成功 +5分')
                                                        add_or(nickname + ' 成功签到 (本次管理成功)')

                                                    }else{
                                                        studio_comment(p_gzsid,plid,'今天已经签过了哦，明天再来签吧')
                                                    }
                                                }
                                                // 查询积分
                                                if(content == '查询积分'){
                                                    if(积分[yhid] != undefined){
                                                        studio_comment(p_gzsid,plid,'您的积分是 : ' + 积分[yhid])
                                                    }else{
                                                        studio_comment(p_gzsid,plid,'您还没有积分哦~可以回复签到获取积分！')
                                                    }
                                                    add_or(nickname + '查询了积分 (本次管理成功)')
                                                }
                                                // 删除投稿
                                                if(content.slice(0,5) == '删除投稿为'){
                                                    var i = content.slice(5,content.length)
                                                    var headers6 = {}
                                                    var data6 = {}
                                                    var xhr6 = new XMLHttpRequest();
                                                    xhr6.withCredentials = true;
                                                    xhr6.open('get','https://api.codemao.cn/creation-tools/v1/works/' + i);
                                                    xhr6.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers6){xhr6.setRequestHeader(c,headers6[c]);}xhr6.send(JSON.stringify(data6))
                                                    xhr6.onload = function(){
                                                        var res6 = JSON.parse(xhr6.responseText)
                                                        if(res6['user_info']['id'] == window.sessionStorage.getItem('yhid') || p_glry.includes(parseInt(window.sessionStorage.getItem('yhid'))) == true){
                                                            var headers5 = {}
                                                            var data5 = {}
                                                            var xhr5 = new XMLHttpRequest();
                                                            xhr5.withCredentials = true;
                                                            xhr5.open('post','https://api.codemao.cn/web/work_shops/works/remove?id=' + p_drgzsid + '&work_id=' + i);
                                                            xhr5.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers5){xhr5.setRequestHeader(c,headers5[c]);}xhr5.send(JSON.stringify(data5))
                                                            xhr5.onload = function(){
                                                                if(xhr5.status == 200){
                                                                    studio_comment(p_gzsid,window.sessionStorage.getItem('plid'),'已成功删除作品！')
                                                                    add_or(nickname + '删除了投稿 (本次管理成功)')
                                                                }else{
                                                                    studio_comment(p_gzsid,window.sessionStorage.getItem('plid'),'删除作品错误，请重试或联系管理员')
                                                                    add_or(nickname + '删除投稿出错 (本次管理失败)')
                                                                }
                                                            }
                                                        }else{
                                                            studio_comment(p_gzsid,window.sessionStorage.getItem('plid'),'你不是此作品作者！想进小黑屋是吧（（')
                                                            add_or(nickname + '已拦截非作者删除投稿 (本次管理成功)')
                                                        }
                                                    }
                                                }
                                                // 存入本地
                                                评论id.push(plid)
                                                window.localStorage.setItem('评论id',JSON.stringify(评论id))
                                                window.localStorage.setItem('积分',JSON.stringify(积分))
                                                window.localStorage.setItem('当日签到用户',JSON.stringify(当日签到用户))
                                            }
                                        }
                                    }
                                    // 自动同意申请 Z
                                    if(window.sessionStorage.getItem('自动同意申请开关') == '开'){
                                        var headers7 = {}
                                        var data7 = {}
                                        var xhr7 = new XMLHttpRequest();
                                        xhr7.withCredentials = true;
                                        xhr7.open('get','https://api.codemao.cn/web/work_shops/users/unaudited/list?offset=0&limit=40&id=' + p_drgzsid);
                                        xhr7.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers7){xhr7.setRequestHeader(c,headers7[c]);}xhr7.send(JSON.stringify(data7))
                                        xhr7.onload = function(){
                                            var res7 = JSON.parse(xhr7.responseText)
                                            var items = res7['items']
                                            for (var manx of items){
                                                var z_user_id = manx['user_id']
                                                var z_nickname = manx['nickname']

                                                var headers8 = {}
                                                var data8 = {}
                                                var xhr8 = new XMLHttpRequest();
                                                xhr8.withCredentials = true;
                                                xhr8.open('get','https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=' + z_user_id);
                                                xhr8.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers8){xhr8.setRequestHeader(c,headers8[c]);}xhr8.send(JSON.stringify(data8))
                                                xhr8.onload = function(){
                                                    res8 = JSON.parse(xhr8.responseText)
                                                    var lll = res8['view_times']
                                                    var dzl = res8['liked_total']
                                                    var scl = res8['collected_total']
                                                    var zczl = res8['re_created_total']
                                                    var dj = res8['author_level']
                                                    var dztj = document.getElementById('dztj').value
                                                    var sctj = document.getElementById('sctj').value
                                                    var zcztj = document.getElementById('zcztj').value
                                                    var djtj = document.getElementById('djtj').value
                                                    if(dzl >= dztj && scl >= sctj && zczl >= zcztj && dj >= djtj){
                                                        var headers9 = {}
                                                        var data9 = {'id': p_drgzsid, 'user_id': z_user_id, 'status': "ACCEPTED"}
                                                        var xhr9 = new XMLHttpRequest();
                                                        xhr9.withCredentials = true;
                                                        xhr9.open('post','https://api.codemao.cn/web/work_shops/users/audit');
                                                        xhr9.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers9){xhr9.setRequestHeader(c,headers9[c]);}xhr9.send(JSON.stringify(data9))
                                                        xhr9.onload = function(){
                                                            if(xhr9.status == 200){
                                                                add_or(z_nickname + ' 加入了工作室 (本次管理成功)')
                                                                stc(p_gzsid,z_nickname + ' 欢迎加入工作室!(^-^)!')
                                                            }else{
                                                                add_or(z_nickname + ' 已达到门槛，但是同意请求出错，请联系管理员或者手动同意申请 (本次管理失败)')
                                                            }
                                                        }
                                                    }else{
                                                        var headers9 = {}
                                                        var data9 = {'id': p_drgzsid, 'user_id': z_user_id, 'status': "UNACCEPTED"}
                                                        var xhr9 = new XMLHttpRequest();
                                                        xhr9.withCredentials = true;
                                                        xhr9.open('post','https://api.codemao.cn/web/work_shops/users/audit');
                                                        xhr9.setRequestHeader('Content-Type','application/json;charset=UTF-8');for(let c in headers9){xhr9.setRequestHeader(c,headers9[c]);}xhr9.send(JSON.stringify(data9))
                                                        xhr9.onload = function(){
                                                            if(xhr9.status == 200){
                                                                add_or(z_nickname + ' 未达到门槛，已被拒绝申请 (本次管理成功)')
                                                            }else{
                                                                add_or(z_nickname + ' 未达到门槛，但是拒绝请求出错，请联系管理员或者手动拒绝申请 (本次管理失败)')
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },3000)
                            }
                        }
                    }else{
                        add_or('您还没有工作室')
                    }
                }
            }
        }
    },2000)
})();