// ==UserScript==
// @name         GitDownload下载整个网页
// @namespace    https://greasyfork.org/zh-CN/scripts/377443-gitdownload%E4%B8%8B%E8%BD%BD%E6%95%B4%E4%B8%AA%E7%BD%91%E9%A1%B5
// @version      0.6
// @description  自动下载页面 try to take over the world!
// @author       Emery Yan
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377443/GitDownload%E4%B8%8B%E8%BD%BD%E6%95%B4%E4%B8%AA%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/377443/GitDownload%E4%B8%8B%E8%BD%BD%E6%95%B4%E4%B8%AA%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function testTag(tagName,attrName){
        // var tagName='script'
        //var attrName = 'src'
        // testTag('script','src')
        // testTag('link','href')
        // testTag('img','src')
        var ss = document.getElementsByTagName(tagName) ;
        var a=''
        for(var i = 0;i< ss.length ;i++){
            a =ss[i]
            if( a.getAttribute(attrName) != a[attrName] ){
                console.log(i ,ss[i] ,a[attrName] ,a.getAttribute(attrName))
            }
        }

    }


    function replaceTag0(doc,tagName,attrName){
        // var tagName='script'
        //var attrName = 'src'
        // testTag('script','src')
        // testTag('link','href')
        // testTag('img','src')
        //var ss = $(tagName);
        var ss = document.getElementsByTagName(tagName) ;
        var a='';
        var doMark={};//标注已经处理过的
        for(var i = 0;i< ss.length ;i++){
            a =ss[i]
            if( a.hasAttribute(attrName) && a.getAttribute(attrName) != a[attrName] ){
                var key = a.getAttribute('src');
                if( doMark.hasOwnProperty(key) ){ //如果已经处理过就不重复了
                    continue;
                }
                //console.log(i ,ss[i] ,a[attrName] )
                doc = doc.replace(a.getAttribute(attrName), a[attrName]);
                doMark[key] = '';
            }
        }
        return doc;
    }

    function replaceTag(doc,tagName,attrName){
        // var tagName='script'
        //var attrName = 'src'
        // testTag('script','src')
        // testTag('link','href')
        // testTag('img','src')
        //var ss = $(tagName);
        var ss = document.getElementsByTagName(tagName) ;
        var a='';
        var doMark={};//标注已经处理过的
        for(var i = 0;i< ss.length ;i++){
            a =ss[i]
            if( a.hasAttribute(attrName) && a.getAttribute(attrName) != a[attrName] ){
                var key = a.getAttribute('src');
                if( doMark.hasOwnProperty(key) ){ //如果已经处理过就不重复了
                    continue
                }
                //console.log(i ,ss[i] ,a[attrName] )
                var reg=new RegExp( a.getAttribute(attrName) ,"g");
                doc = doc.replace(reg, a[attrName]); // 替换多次
                // doc = doc.replace(a.getAttribute(attrName), a[attrName]); // 只替换一次
                doMark[key] = '';
            }
        }
        return doc;
    }

    function protocol_replace_1(s,protocol){
        // 将  '//  替换成 'https://
        // s='dxx="//ss.ww.ss  "//22ss.ww.ss //g.com '
        var regex = new RegExp(/'\/\//, "gi");
        var result = "'" + protocol+'\/\/'
        return s.replace( regex , result);
    }


    function protocol_replace_2(s,protocol){
        // 将  "//  替换成 "https://
        // s='dxx="//ss.ww.ss  "//22ss.ww.ss //g.com '
        var regex = new RegExp(/"\/\//, "gi");
        var result = '"'+ protocol+'\/\/'
        return s.replace( regex , result);
    }


    function relinkDocumentByTag(doc){
        doc = replaceTag(doc,'script','src')
        doc = replaceTag(doc,'link','href')
        doc = replaceTag(doc,'img','src')
        var protocol =window.location.protocol
        doc = protocol_replace_1(doc,protocol)
        doc = protocol_replace_2(doc,protocol)
        return doc;
    }

    function GitDownload(){
        var markup = document.documentElement.innerHTML;
        var baseMarkup = '<base href="'+ window.location.origin +'" />';
        var a =markup.split('</title>');
        markup =a[0]+'</title>'+ baseMarkup + a[1];
        var filename= document.title +'.html';
        filename = filename.replace(/\ /g,"-"); // 替换成空格
        download( filename ,markup);
        console.log('保存完毕',filename);
        console.log('记得插入',baseMarkup);
    }

    function GitDownloadReplace(){
        //var markup = document.documentElement.innerHTML;
        var markup = document.documentElement.outerHTML;
        window.htmlDoc = markup;
        markup = relinkDocumentByTag(markup);
        var baseMarkup = '<base href="'+ window.location.origin +'" />';
        var a =markup.split('</title>');
        markup =a[0]+'</title>'+ baseMarkup + a[1];
        var filename= document.title +'.html';
        filename = filename.replace(/\ /g,"-"); // 替换成空格
        download( filename ,markup);
        console.log('保存完毕',filename);
        console.log('记得插入',baseMarkup);
    }

    console.log('加载网页下载的命令 \n GitDownload()  \n  window.GitDownloadReplace()');
    window.GitDownload = GitDownload;
    window.GitDownloadReplace = GitDownloadReplace;

    // 下载资源的地址
    function getResourceType(resources){
        // 先给出优先级的排序 , css 是指 css 里面的图片
        var resources_type = ["xmlhttprequest", "script", "link", "css", "img"];
        //var resources_type = [];
        //  ["img", "css", "script", "link", "xmlhttprequest"]
        for(var i = 0;i < resources.length;i++){
            var r =resources[i];
            if( resources_type.indexOf( r.initiatorType) < 0 ){
                resources_type.push( r.initiatorType )
            }
            //console.log(i,r.initiatorType ,r.name)
        }
        return resources_type ;
    }

    function getSuffix(a){
        var b = a.split('.');
        if ( b.length <= 0){
            return ''
        }
        var c = b[b.length-1];
        if( c.length >=1 && c.length <= 5){ //如果长度超过5就认为此无意义
            return c
        }
        return ''
    }


    // 给出特定的类型
    function getResourceSpecialType(resources,the_type){
        // 先给出优先级的排序
        //var resources_type = [];
        //  ["img", "css", "script", "link", "xmlhttprequest"]
        var text = ''
        for(var i = 0;i < resources.length;i++){
            var r =resources[i];
            if( the_type != r.initiatorType ){
                continue ;
            }
            var s = getSuffix(r.name);
            console.log(i,r.initiatorType ,r.name,r)
            text += r.initiatorType +','+ s + ','+r.name+'\n'
        }
        return text ;
    }

    function saveResource2CSV(){
        var resources = performance.getEntriesByType("resource");
        var resources_types = getResourceType(resources);
        var textAll = 'type,suffix,url\n'
        for(var i = 0;i< resources_types.length;i++){
            var text = getResourceSpecialType(resources,resources_types[i])
            textAll += text;
        }

        // 到此获得了csv的写法
        var filename= document.title +'-resource.csv';
        filename = filename.replace(/\ /g,"-"); // 替换成空格
        download( filename ,textAll);
        console.log('保存resource完毕',filename);
    }
    console.log('保存resource的命令 \n saveResource2CSV() ');
    window.saveResource2CSV = saveResource2CSV;



    // Your code here...
})();