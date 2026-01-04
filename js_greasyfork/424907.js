// ==UserScript==
// @name         getArticle
// @namespace    http://localhost:8080/
// @version      0.16
// @description  getArtical,仅用于测试环境
// @author       feng
// @match        http*://*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/wangeditor@latest/dist/wangEditor.min.js
// @require      https://cdn.jsdelivr.net/npm/@mozilla/readability@0.4.1/Readability.js
// @require      https://greasyfork.org/scripts/39995-pureread/code/PureRead.js?version=770507
// @require      https://greasyfork.org/scripts/39997-puplugin/code/PuPlugin.js?version=770506
// @resource     global_sites http://sr.ksria.cn/website_list_v4.json?data=1.1.2.20200205
// @resource     style_editor http://192.168.0.189:60010/static/style_editor.css?t=14
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424907/getArticle.user.js
// @updateURL https://update.greasyfork.org/scripts/424907/getArticle.meta.js
// ==/UserScript==

//http://192.168.0.94:8000/artical/style_editor.css?t=13
//http://192.168.0.189:60010/static/style_editor.css?t=13

(function() {
    'use strict';
//cccf
//河南
//119
//北京
//河北
//吉林
//上海
//江苏
//weixin
//zzjtl
//efaw

    var dicUrl = "http://47.105.104.28:60020" ;
    var dicUrl0 = "http://192.168.0.189:20104";
    var siteRule = [
        {
            "name"    : "www.cccf.com.cn",
            "url"     : "http*://*.gslb.cccf.com.cn/article/*",
            "title"   : "#page-content .newsTitle",
            "content" : "#page-content #content",
            "include" : "",
            "exclude" : ".clearfix"
        },
        {
            "name"    : "www.gslb.cccf.com.cn",
            "url"     : "http*://*.gslb.cccf.com.cn/article/*",
            "title"   : "#page-content .newsTitle",
            "content" : "#page-content #content",
            "include" : "",
            "exclude" : ".clearfix"
        },{
            "name"    : "ha.119.gov.cn",
            "url"     : "http*://ha.119.gov.cn/*/*.html",
            "title"   : ".main .content h1",
            "content" : ".main .content .body",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.119.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".container .t-container-title h3",
            "content" : ".container .b-container",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "xfj.beijing.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".conn .qs_con_title",
            "content" : ".conn .qs_info",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "he.119.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".maincont .cntheadline h1",
            "content" : ".maincont .heb_content",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "zhuanti.cnjiwang.com",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".cgzzmL h1",
            "content" : ".cgzzmL .content",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "sh.119.gov.cn/",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".container .t-container-title h3",
            "content" : ".container .b-container",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.js119.com",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".detail-content .news-detail .news-detail-title h1",
            "content" : ".detail-content .content",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.ah119.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".zw-word1",
            "content" : ".F4",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "xf.jiangxi.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".ac-comments2 .title2",
            "content" : ".ac-comments2 .text2",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.hbfire.com",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".a-8.STYLE6",
            "content" : ".contents",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.hn119.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : "#show h1",
            "content" : "#show .newscontent",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "gdfire.gd.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".content .zoomtitl",
            "content" : ".content .content_article",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.gx119.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".content_c .conts_text h3",
            "content" : ".content_c .details",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.119hn.com",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".content-1 form h1",
            "content" : ".content-1 .content-txt",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.cqfire.com",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".newsfonth",
            "content" : ".news_text",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "sc.119.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".page_content .content_tit",
            "content" : ".page_content .zw_con .Custom_UnionStyle",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "119.guizhou.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".body_content .title h1",
            "content" : ".body_content .content .view",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.yn119.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".news_detail .tit_b",
            "content" : ".news_detail article.txt",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "sn119.shaanxi.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".n_article .ar_title h1",
            "content" : ".n_article .ar_article",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.gs119.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".article_content .box_atitle h1",
            "content" : ".article_content #articleContnet",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "xj.119.gov.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : "#wenzhang .wztit",
            "content" : "#wenzhang #J_content",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "mp.weixin.qq.com",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".rich_media_title",
            "content" : ".rich_media_content ",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.zzjtl.com",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".newa h2",
            "content" : ".newa .xqnr",
            "include" : "",
            "exclude" : ""
        },{
            "name"    : "www.efaw.cn",
            "url"     : "http*://www.119.gov.cn/article/*.html",
            "title"   : ".video_left .video_left_title",
            "content" : ".video_left .video_left_font",
            "include" : "",
            "exclude" : ""
        }
    ]
    //iframe
    if(self !== top){ return; }
    var pr = new PureRead();
    var global_sites = GM_getResourceText("global_sites");
    if (GM_getValue("simpread_db")) {
        pr.sites = GM_getValue("simpread_db");
    } else {
        pr.Addsites(JSON.parse(global_sites));
        GM_setValue("simpread_db", pr.sites);
    }
    pr.cleanup = true;
    pr.pure = true;
    pr.AddPlugin(puplugin.Plugin());
    pr.Getsites();


    console.log("脚本开始")
    var style_editor = GM_getResourceText("style_editor");
    // 抓取模式   pickSelf 自定义  pickPlugin  插件
    let pickType = ""



    var locations = window.location.hostname;
    console.log(locations);
    let isMysite = siteRule.find(it=> it.name == locations);
    let mySiteObj = {}
    let editor = null
    console.log(isMysite)
    // 加载自定义样式
    GM_addStyle(style_editor);
    //addMystyle();
    getDic();
    if(isMysite){
        pickType = "pickSelf"
        mySiteObj = isMysite
        if($(mySiteObj.title).length == 0 || $(mySiteObj.content).length == 0){
            //不是文章页面
            return;
        }

    }else{
        pickType = "pickPlugin"
    }
    // 不在 iframe 中
    if(self == top){
        createToolbar();
    }

    var dic_typeList = []
    var dic_tagList = []


    //加载分类数据
    function getDic(){
        GM_xmlhttpRequest({
            method: "get",
            url: dicUrl+'/sms/category/categoryList' ,
            data: '',
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(res){
                if(res && res.status && res.response){
                    console.log('分类成功')
                    let response = JSON.parse(res.response)
                    let values = response.value
                    console.log(values)
                    dic_typeList = values
                }else{
                    console.log('分类失败')
                    console.log(res)
                }
            },
            onerror : function(err){
                console.log('error')
                console.log(err)
            }
        });

        GM_xmlhttpRequest({
           method: "get",
           url: dicUrl+'/sms/tag/tagList' ,
           data: '',
           headers:  {
               "Content-Type": "application/x-www-form-urlencoded"
           },
           onload: function(res){
               if(res && res.status && res.response){
                   console.log('标签成功')
                   let response = JSON.parse(res.response)
                   let values = response.value
                   console.log(values)
                   dic_tagList = values
               }else{
                   console.log('标签失败')
                   console.log(res)
               }
           },
           onerror : function(err){
               console.log('error')
               console.log(err)
           }
       });

    }

    // 加载自定义样式
    function addMystyle() {
        let css = "div.w-e-text-container p{font-size:large !important;}";
        document.head.insertAdjacentHTML("beforeend", '<style id = "mystyle" type = "text/css" media = "all" class = "stylus">' + (css) + "</style>")
    };

    function createToolbar(){
         var toolDom = null
        if(pickType == "pickSelf"){
            toolDom = $("<div id='toolWraper' class='toolWraper'><button id='toolBtn' class='toolBtn'>自定义抓取</button></div>");
        }
        else{
            toolDom = $("<div id='toolWraper' class='toolWraper'><button id='toolBtn' class='toolBtn'>插件抓取</button></div>");
        }
        console.log($("body"))
        $("body").append(toolDom);
        $("body").on('click',"#toolBtn",function(){
            if(pickType == "pickPlugin" ){
            }

            beginEdit()
        })
    }
    var editorShow = false;
    var hasCreateEditor = false;
    var articalObj = {};
    function beginEdit(){
        if(hasCreateEditor){
            $("#editorWraper").show();
        }else{

            let typeStr = '<div class="optItem"><span class="form_label">*文章分类:</span><select name="type" id="articalType">'+
                                  '<option value="0">文章分类</option>'+
                                  '<option value="15" label="公司动态"></option>'+
                                  '<option value="9" label="行业动态  "></option>'+
                                  '<option value="8" label="新闻"></option>'+
                                  '<option value="10" label="法律法规"></option>'+
                                  '<option value="11" label="相关知识"></option>'+
                              '</select></div> '
            if(dic_typeList){
                typeStr = '<div class="optItem"><span class="form_label">*文章分类:</span><select name="type" id="articalType">'+
                    '<option value="0">文章分类</option>'
                dic_typeList.forEach((it,ind)=>{
                    typeStr += '<option value="'+it.id+'" label="'+it.name+'"></option>'
                })
                typeStr += '</select></div> '
            }

            let tagStr = '<div class="optItem"><span class="form_label">*文章标签:</span><select name="tag" multiple="multiple" id="tagType">'+
                                  '<option value="0">文章标签(可多选)</option>'+
                                  '<option value="12" label="智慧消防"></option>'+
                                  '<option value="13" label="智慧用电  "></option>'+
                                  '<option value="14" label="智慧环保"></option>'+
                                  '<option value="34" label="法规"></option>'+
                                  '<option value="35" label="知识"></option>'+
                                  '<option value="41" label="动态"></option>'+
                              '</select></div> '
            if(dic_tagList){
                tagStr = '<div class="optItem"><span class="form_label">*文章标签:</span><select name="tag" multiple="multiple" id="tagType">'+
                    '<option value="0">文章标签(可多选)</option>'
                dic_tagList.forEach((it,ind)=>{
                    tagStr += '<option value="'+it.id+'" label="'+it.name+'"></option>'
                })
                tagStr += '</select></div> '
            }

            let recommendedStr = '<div class="optItem"><span class="form_label">是否推荐:</span><select name="recommended" id="recommendedType">'+
                                  '<option value="1" label="是"></option>'+
                                  '<option value="0" label="否"></option>'+
                              '</select></div> '
            let statusStr = '<div class="optItem"><span class="form_label">发布状态:</span><select name="status" id="statusType">'+
                                  '<option value="1" label="发布"></option>'+
                                  '<option value="0" label="存草稿"></option>'+
                              '</select></div> '

            var editorDom = $("<div id='editorWraper' class='editorWraper' style='height:435px;'><div id='editorContent' class='editorContent' style='background:#fff;'></div><div id='editorTool' class='editorTool' style='height:435px;'>"+
                              '<div class="optItem"><span class="form_label">*发布环境:</span><select name="dicUrl" id="dicUrlType">'+
                              '<option value="0" label="test"></option>'+
                              '<option value="1" selected label="prd"></option>'+
                              '</select></div>'+
                              '<div class="optItem"><span class="form_label">*文章标题:</span><textarea placeholder="文章标题" wrap="off"  style="resize: horizontal;width:70%;" type="text" class="optTitle" id="optTitle"></textarea></div>'+
                              typeStr +
                              tagStr+
                              '<div class="optItem"><span class="form_label">文章封面:</span><input placeholder="文章封面(带https或http)(右键复制图片地址--粘贴)" style="resize: horizontal;width:70%;" type="text" class="optcoverImage" id="optCoverImage"></input></div>'+
                              recommendedStr+
                              statusStr+
                              '<div class="optItem"><span class="form_label">文章概要:</span><textarea placeholder="文章概要" wrap="off"  style="resize: horizontal;width:70%;" type="text" class="optDescription" id="optDescription"></textarea></div>'+
                              '<div class="optItem"><span class="form_label">文章关键词:</span><input placeholder="文章关键词（SEO优化）" style="resize: horizontal;width:70%;" type="text" class="optKeywords" id="optKeywords"></input></div>'+
                              '<div class="optItem"><button id="cancleEditBtn" style="margin-right:20px;">取消编辑</button>'+
                              '<button id="sendEditBtn">发送文章</button></div>'+
                              "</div></div>");

            $("body").append(editorDom);

            $("body").on('click',"#cancleEditBtn",function(){
                cancleEdit()
            }).on('click',"#sendEditBtn",function(){
                sendEdit()
            }).on('change',"#articalType",function(e){
                console.log($(e.target).val())
                articalObj.type = $(e.target).val()
            }).on('change',"#tagType",function(e){
                console.log($(e.target).val())
                articalObj.tag = $(e.target).val().join(",")
            }).on('change',"#optCoverImage",function(e){
                console.log($(e.target).val())
                articalObj.coverImage = $(e.target).val()
            }).on('change',"#recommendedType",function(e){
                console.log($(e.target).val())
                articalObj.recommended = $(e.target).val()
            }).on('change',"#statusType",function(e){
                console.log($(e.target).val())
                articalObj.status = $(e.target).val()
            }).on('change',"#optTitle",function(e){
                console.log($(e.target).val())
                articalObj.title = $(e.target).val()
            }).on('change',"#optDescription",function(e){
                console.log($(e.target).val())
                articalObj.description = $(e.target).val()
            }).on('change',"#optKeywords",function(e){
                console.log($(e.target).val())
                articalObj.keywords = $(e.target).val()
            }).on('change',"#dicUrlType",function(e){
                console.log($(e.target).val())
                articalObj.dicUrl = $(e.target).val()
            })

            const E = window.wangEditor
            editor = new E("#editorContent")
            editor.config.height = 393
            editor.create();

            setArtical(editor)
            if(pickType !== "pickSelf"){
                GM_addStyle(style_editor);
            }
            hasCreateEditor = true
        }


        editorShow = true
    }

    // 设置编辑器内容
    function setArtical(editor){
        let titleStr = ""
        let contentStr = ""
        let keyWordsObj = $("meta[name=keywords]")
        let keyWordsStr = ""
        if(keyWordsObj.length){
            keyWordsStr = keyWordsObj.attr("content")
        }
        console.log(keyWordsStr)

        let descriptionObj = $("meta[name=description]")
        let descriptionStr = ""
        if(descriptionObj.length){
            descriptionStr = descriptionObj.attr("content")
        }else{
            descriptionStr = $(mySiteObj.content).text().split("。")[0].replace(/\s+/g, "")
        }
        console.log(descriptionStr)

        if(pickType == "pickSelf"){
            titleStr = $(mySiteObj.title).html().replace(/\s+/g, "").replace(/<.*>.*<\/.*>/gi,"")    // 去空  去掉 HTML标签内的内容（官网）
            contentStr = $(mySiteObj.content).html()
        }else{
            console.log(pr)
            pr.Readability()
            console.log(pr)
            if(!pr.dom){
                alert("该网页不支持内容抓取，如需支持请联系开发者")
            }
            titleStr = document.title;
            contentStr = pr.dom ? pr.dom.innerHTML.replace(/\s+/g, " "): ""

        }

        articalObj = {
            title:titleStr,
            content:contentStr,   //不能 .replace(/\s+/g, "")  会将图片过滤掉
            type:null,               //分类
            tag:null,                //标签
            coverImage:"",         //封面
            recommended:0,        //是否推荐
            status:1,             //发布状态
            //description:$(mySiteObj.content).text().replace(/\s+/g, "").substring(0,30),          //描述
            description: descriptionStr,
            keywords:keyWordsStr,             //关键字
            dicUrl:1,
        }

        editor.txt.html(articalObj.content)
        $("#optTitle").val(titleStr)
        $("#recommendedType").val(0);
        $("#statusType").val(1);
        $("#optDescription").val(descriptionStr)

        $("#dicUrlType").val(1)


        $("#optKeywords").val(keyWordsStr)
        console.log(articalObj)
    }
    //取消编辑
    function cancleEdit(){
        $("#editorWraper").hide();
        //改回默认选项
        $("#recommendedType").val(0);
        $("#statusType").val(1);
        $("#dicUrlType").val(1)

        articalObj = {}
        editorShow = false
    }

    // 发送请求
    function sendEdit(){
        if(articalObj.dicUrl == null ){
            console.log("请选择 发布环境")
            return;
        }
        if(!articalObj.title || articalObj.title == ''){
            console.log("请填写 标题")
            alert("请填写 标题")
            return;
        }
        if(!articalObj.content || articalObj.content == ''){
            console.log("请填写 内容")
            alert("请填写 内容")
            return;
        }
        if(!articalObj.type || articalObj.type == null || articalObj.type == 0 || articalObj.type == ''){
            console.log("请选择文章 分类")
            alert("请选择文章 分类")
            return;
        }
        if(!articalObj.tag || articalObj.tag == null || articalObj.tag == 0 || articalObj.tag == ''){
            console.log("请选择文章 标签")
            alert("请选择文章 标签")
            return;
        }
        if(!articalObj.coverImage || articalObj.coverImage == 'null'){
            articalObj.coverImage = ""
        }
        //if(articalObj.coverImage && articalObj.coverImage.indexOf('http') < 0){
        //    console.log("请填写 完整的封面图（https或http）")
        //    return;
        //}
        if(articalObj.recommended == null ){
            console.log("请选择 是否推荐")
            return;
        }
        if(articalObj.status == null ){
            console.log("请选择 发布状态")
            return;
        }
        //if(!articalObj.description || articalObj.description == ''){
        //    console.log("请填写 描述")
        //    return;
        //}
        //if(!articalObj.keywords || articalObj.keywords == ''){
        //    console.log("请填写 关键字")
        //    return;
        //}
        let textNew = editor.txt.html()
        articalObj.content = textNew;
        console.log(articalObj)
        console.log("发起提交")
        //console.log('title='+articalObj.title+'&content='+articalObj.content+'&categoryId='+articalObj.type+'&tag='+articalObj.tag+'&coverImage='+articalObj.coverImage+'&recommended='+articalObj.recommended+'&status='+articalObj.status+'&description='+articalObj.description+'&keywords='+articalObj.keywords)
        articalObj.categoryId = articalObj.type
        //console.log(articalObj.content)
        articalObj.content  = articalObj.content.replace(/\s+/g, ' ')

          //item.dataValues.imgList = srcArr
        // 图片加前缀
        articalObj.content = articalObj.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
            console.log(capture)
            if(capture.indexOf("data:image")>=0){
                return '<img src="'+capture+'" />'
            }
            //debugger
            if(capture.indexOf("http")<0 && capture.indexOf("https")<0 && capture.indexOf("//")<0){   // 微信公众号    // 开头的域名
                return '<img src="'+location.origin+capture+'" />'
            }else{
                return '<img src="'+capture+'" />'
            }
        })
        //console.log(articalObj.content)
        articalObj.content = encodeURIComponent(articalObj.content)
        //return;
        console.log(JSON.stringify(articalObj))
        let dicUrlStr = ""
        if(articalObj.dicUrl == 1 ){
            dicUrlStr = dicUrl
        }else{
            dicUrlStr = dicUrl0
        }

        GM_xmlhttpRequest({
           method: "post",
           url: dicUrlStr+'/sms/article/articleAdd' ,
           //dataType: "json",
           //data:JSON.stringify(articalObj),
           //contentType: "application/json",
           //data:myData,
            data:'title='+articalObj.title+
            '&content='+articalObj.content+
            '&categoryId='+articalObj.type+
            '&tag='+articalObj.tag+
            '&coverImage='+articalObj.coverImage+
            '&recommended='+articalObj.recommended+
            '&status='+articalObj.status+
            '&description='+articalObj.description+
            '&keywords='+articalObj.keywords,
           headers:  {
               "Content-Type": "application/x-www-form-urlencoded"
           },
           onload: function(res){
               console.log(res)
               if(res && res.status == 200 && res.response){

                   let response = JSON.parse(res.response)
                   if(response.success){
                       console.log('添加成功')
                       alert(response.value?response.value:"添加成功")
                   }else{
                       console.log('添加失败')
                       alert(response.value?response.value:"添加失败")
                   }

               }else{
                   alert('添加失败')
                   if(res.response){
                       let response = JSON.parse(res.response)
                       console.log(res.response)
                   }
                   
               }
           },
           onerror : function(err){
               console.log('error')
               let response = JSON.parse(res.response)

               console.log(response)
           }
       });

    }


})();