// ==UserScript==
// @name         影视幻灯推荐
// @namespace    https://kaka365.cc/
// @version      0.2
// @description  影视自动幻灯推荐
// @author       batcom
// @match        *://*.youku.com/*
// @match        *://v.qq.com/*
// @icon         https://www.zhihupe.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://www.layuicdn.com/layui-v2.8.15/layui.js
// @require      https://unpkg.com/art-template@4.13.2/lib/template-web.js
// @run-at       document-end

// @resource layui.css https://gitee.com/layui/layui/raw/main/dist/css/layui.css
// @resource layui64.css https://gitee.com/batcom/layui/raw/main/dist/css/layui64.css
// @resource woff2.css https://gitee.com/batcom/layui/raw/main/dist/css/woff2.css

// @connect      www.kaka365.cc
// @connect      kaka365.cc

// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license           GPL License

// @downloadURL https://update.greasyfork.org/scripts/473433/%E5%BD%B1%E8%A7%86%E5%B9%BB%E7%81%AF%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/473433/%E5%BD%B1%E8%A7%86%E5%B9%BB%E7%81%AF%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function Resource()
    {        
    }
    Resource.LoadCss = function(css_href){
        let script = document.createElement('link');
        script.setAttribute('rel', 'stylesheet');
        script.setAttribute('type', 'text/css');
        script.href = css_href;
        $('head').append(script)
    }
    Resource.LoadJs = function(src){
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = src;
        $('head').append(script);
    }
    Resource.LoadExtRes = function(name){
        GM_addStyle(GM_getResourceText(name));
    }
    Resource.LoadExtRes("layui64.css")
    Resource.LoadExtRes("woff2.css")
    GM_addStyle(`
        .oper{
            margin-top: 5px;;
        }
        input[type="text"]{
            margin: 0 5px;
        }
    `)
    const Mwin = unsafeWindow||window;
    let Http = function(base_url){
        this.base_url = base_url
    }
    Http.prototype.get = function(url,data,headers){
        return new Promise((reslove,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: this.base_url+url,
                data:data,
                headers: headers||{"Content-Type": "application/json"},
                // headers: headers||{"Content-Type": "application/x-www-form-urlencoded"},
                onload: function(response) {
                    reslove(response)
                    // alert(response.responseText);
                },
                onerror:function(error){
                    reject(error)
                }
            });
        })
    }
    Http.prototype.post = function(url,data,headers){
        return new Promise((reslove,reject)=>{
            GM_xmlhttpRequest({
                method: "POST",
                url: this.base_url+url,
                responseType:'json',
                data:JSON.stringify(data),
                headers: headers||{"Content-Type": "application/json"},
                // headers: headers||{"Content-Type": "application/x-www-form-urlencoded"},
                onload: function(response) {
                    reslove(response)
                    // alert(response.responseText);
                },
                onerror:function(error){
                    reject(error)
                }
            });
        })
    }
    const kHttp = new Http("https://www.kaka365.cc/");
    
    function fr(element){
        layui.use('form', function(){
            // 重新渲染form
            var form = layui.form;
            form.render(element);
        });
    }
    var laytpl = layui.laytpl;
    
    function Template(){
        let template_str = `
        <script id="kaka-rec" type="text/html">
        <div class="kaka-mlist layui-form" style="margin: 10px 10px;">
            <div class="layui-form-item" style="display:flex;justify-content:flex-end;margin-bottom:0;" >
                <label class="layui-form-label">渠道</label>
                <div class="layui-input-block" style="width:200px;margin:0 10px 0 10px">
                    <select id="channel" name="channel"  lay-search>
                        {{each channels c idx}}
                        <option value="{{c}}">{{c}}</option>
                        {{/each}}
                    </select>
                </div>
            </div>
            <ul id="ul-list">
                {{each list value index}}
                <li style="display: flex;justify-content: space-between;">
                    <input type="checkbox" name="idx" title="" lay-skin="primary">
                    <input type="text" name="title" style="width: 150px;" value="{{value.title}}" placeholder="请输入标题" autocomplete="off"
                        class="layui-input">
                    <input type="text" name="url" style="flex-grow: 1;"   value="{{value.url}}" placeholder="请输入url" autocomplete="off"
                            class="layui-input">
                    <div class="level" style="width: 200px; margin-right:15px">
                        <select id="level" name="level" lay-search>
                        <option value="9">首页</option>
                        <option value="1">影视</option>
                        <option value="2">电视剧</option>
                        <option value="3">综艺</option>
                        <option value="4">动漫</option>
                        </select>
                    </div>
                    <button type="button" id="plus" class="layui-btn layui-btn-primary layui-btn-sm oper plus">
                        <i class="layui-icon">&#xe624;</i>
                    </button>
                    <button type="button"  id="decr" class="layui-btn layui-btn-primary layui-btn-sm oper decr">
                        <i class="layui-icon">&#xe67e;</i>
                    </button>
                    <button type="button" id="rec" class="layui-btn layui-btn-primary layui-btn-sm oper ok">
                        <i class="layui-icon layui-icon-ok"></i>
                    </button>
                </li>
                {{/each}}
            </ul>
        </div>
    </script>
        `
        $('body').append(template_str)
    }

    function Icon(){
        this.caller = null
        this.tpl = `<i class="layui-icon layui-icon-%s"></i>`
    }
    Icon.prototype = {
        "show":function(name){
            const html = this.tpl.replace("%s",name)
            this.caller.html(html)
        },
        "switch":async function(dst,promise){
            this.show('loading-1')
            const res = await promise
            const dst_html = this.tpl.replace("%s",dst)
            this.caller.html(dst_html)
            this.caller.attr('info',res.response.msg)
            return res
        }
    }
    Template.prototype = {
        "init":function(){},
        "getChannels": async function(){
            const channels = await kHttp.post('/ajax/channel_list',{})
            return channels?.response?.data
        },
        "show":async function(tid,data){
            if(data.length==0){
                data = [{"title":"","url":"","level":""}]
            }
            const channels = await this.getChannels()
            const text = template(tid,{list:data,channels:channels})
            fr()
            layer.open({
                type:1,content:text,title:"推荐列表",maxmin: true,id:"rec_list",
                btn: ['反选', '全选', '推荐'],btnAlign: 'c',area:['auto','400px']
                ,yes: function(index, layero){
                    op.reverseAll()
                }
                ,btn2: function(index, layero){
                    op.selectAll()
                    return false
                }
                ,btn3: function(index, layero){
                    op.recAll()
                    return false
                }
            })
        },
    }
    let t = new Template
    let kaka_list = []
    
    let isOpen = false;
    function Operator(){
        $(document).on('click','.plus',function(){
            let li = $(this).parent()
            $('#ul-list').append($(li).clone())
        });
        $(document).on('click', '.decr', function () {
            $(this).parent().remove()
            
        });
        $(document).on('mouseenter', '.ok',function(e){
            if($(this).html()==`<i class="layui-icon layui-icon-about"></i>`){
                layer.tips($(this).attr('info'),$(this))
            }
        })
        $(document).on('click', '.ok', async function () {
            let banner = {}
            $(this).siblings('input').each(function(){
                banner[$(this).attr('name')] = $(this).val()
            })
            const divs = $(this).siblings('div.level')
            banner['level'] = divs.eq(0).find('select').val()
            delete banner.idx
            const icon = new Icon
            icon.caller = $(this)
            icon.switch('about',rec.recommend(banner))

        });
        // alt+w 快捷键显示隐藏界面
        $(document).on('keydown',function(e) {
            const keyname = e.key.toLocaleLowerCase();
            if(e.altKey && keyname==='w') {
                e.preventDefault();
                if(isOpen) {
                    layer.closeAll('page');
                } else {
                    t.show("kaka-rec",kaka_list)
                }
                isOpen = !isOpen;
            }
        });
    }
    
    Operator.prototype = {
        "selectAll":function(){
            $('input[name=idx]').prop('checked', true);
            fr('checkbox')
        },
        "reverseAll":function(){
            $('input[name=idx]').each(function () {
                this.checked = !this.checked;
            });
            fr('checkbox')
            
        },
        "recAll":function(){
            $('input[name="idx"]:checked').each(async function () {
                let banner = {}
                $(this).siblings('input').each(function(){
                    banner[$(this).attr('name')] = $(this).val()
                })
                const divs = $(this).siblings('div.level')
                banner['level'] = divs.eq(0).find('select').val()
                delete banner.idx
                let btn = $(this).siblings(":last")
                const icon = new Icon
                icon.caller = btn
                console.log("btn:"+btn.siblings().eq(2).val())
                const res = await icon.switch('about',rec.recommend(banner))
                console.log(res.response.msg)
                // btn.attr('info',res.response.msg)
            });
        },
    }
    const op = new Operator

    
    
    let Youku = function(url){
        this.url = url
        this.init_json = Mwin.__INITIAL_DATA__
        this.mlist = this.init_json['moduleList']
    }
    
    let QQ = function(url){
        this.url = url
        this.init_json = Mwin.__INITIAL_STATE__
        this.mlist = this.init_json['storeModulesData']['channelsModulesMap']
        // console.log(JSON.stringify(this.init_json))
        console.log(this.mlist)
    }
    function Factory(url){
        if(url.includes('youku.com')){
            return new Youku(url)
        }else if(url.includes('qq.com')){
            return new QQ(url)
        }
    }
    
    Youku.prototype = {
        "getLevel":function(){
            if(this.url.includes("webhome")){
                return 9;
            }else if(this.url.includes("webmovie")){
                return 1;
            }else if(this.url.includes("webtv")){
                return 2;
            }else if(this.url.includes("webzy")){
                return 3;
            }else if(this.url.includes("webcomic")){
                return 4;
            }else{
                return 9;
            }
        },
        "getBanner":function(){
            const mlist = this.mlist
            const level = this.getLevel()
            for (let index = 0; index < mlist.length; index++) {
                const item = mlist[index];
                if(item['type'].includes("BANNER")){
                    return item['focusList'].map((val)=>{
                        if(Object.keys(val).includes('isAd')&&val?.isAd==undefined){
                            return {
                                "title":val["title"],"url":val["img"],"level":level
                            }
                        }
                    });
                }
            }
        },
        "recommend":function(banner){
            return kHttp.post(`/ajax/rec`,{
                'title':banner.title,
                'url':banner.url,
                'level':this.getLevel(),
                'query':$('#channel').val()||'1080zyk',
            })
        }
    }
    QQ.prototype = {
        "getLevel":function(){
            if(this.url.includes("choice")){
                return 9;
            }else if(this.url.includes("movie")){
                return 1;
            }else if(this.url.includes("tv")){
                return 2;
            }else if(this.url.includes("variety")){
                return 3;
            }else if(this.url.includes("cartoon")){
                return 4;
            }else{
                return 9;
            }
        },
        "getBanner":function(){
            const level = this.getLevel()
            const levels = {9:"choice",1:"movie",2:"tv",3:"variety",4:"cartoon"}
            const channel = levels[level]
            const mlist = this.mlist[channel]['cardListData']
            for (let index = 0; index < mlist.length; index++) {
                const item = mlist[index];
                if(item['type'].includes("pc_carousel")){
                    const cards = item['children_list']['list']['cards']
                    return cards.map(function(val){
                        let params = val['params']
                        if(Object.keys(params).includes('cid')&&params?.cid){
                            return {
                                "title":params["title_pc"],"url":params["image_url"],"level":level
                            }
                        }
                    });
                }
            }
        },
        "recommend":function(banner){
            return kHttp.post(`/ajax/rec`,{
                'title':banner.title,
                'url':banner.url,
                'level':this.getLevel(),
                'query':$('#channel').val()||'1080zyk',
            })
        }
    }
    let rec = new Factory(unsafeWindow.location.href)
    
    let banners = rec.getBanner().filter(x => x !== undefined)
    for (let index = 0; index < banners.length; index++) {
        const banner = banners[index];
        kaka_list.push({title:banner.title,url:banner.url,level:banner.level})
        
    }
    t.show("kaka-rec",kaka_list)
    console.log(kaka_list)

    
})();

