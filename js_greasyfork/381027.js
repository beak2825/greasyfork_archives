// ==UserScript==
// @name         搜索辅助小工具 - 淘宝，京东，百度，必应，谷歌，翻译等
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  在网页右上角增加快捷搜索功能，功能如下：1.如果选择了文本，那么搜索文本，2.如果在百度，bing，谷歌，淘宝，京东，翻译等搜索框下，则搜索搜索框关键字。3.默认当前页面替换，单弹页面请按ctrl/shift/cmd键组合。摒弃了vue，因为和很多网站都存在冲突。 使用原生js代码改写，兼容性更好
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @author       Zszen
// @match        https://*.baidu.com/*
// @match        https://*.bing.com/*
// @exclude      /^https?://(localhost|127\.0\.0\.1|10\.0).*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381027/%E6%90%9C%E7%B4%A2%E8%BE%85%E5%8A%A9%E5%B0%8F%E5%B7%A5%E5%85%B7%20-%20%E6%B7%98%E5%AE%9D%EF%BC%8C%E4%BA%AC%E4%B8%9C%EF%BC%8C%E7%99%BE%E5%BA%A6%EF%BC%8C%E5%BF%85%E5%BA%94%EF%BC%8C%E8%B0%B7%E6%AD%8C%EF%BC%8C%E7%BF%BB%E8%AF%91%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/381027/%E6%90%9C%E7%B4%A2%E8%BE%85%E5%8A%A9%E5%B0%8F%E5%B7%A5%E5%85%B7%20-%20%E6%B7%98%E5%AE%9D%EF%BC%8C%E4%BA%AC%E4%B8%9C%EF%BC%8C%E7%99%BE%E5%BA%A6%EF%BC%8C%E5%BF%85%E5%BA%94%EF%BC%8C%E8%B0%B7%E6%AD%8C%EF%BC%8C%E7%BF%BB%E8%AF%91%E7%AD%89.meta.js
// ==/UserScript==
//https://unpkg.com/vue/dist/vue.js

(function () {
    'use strict'
    let isDebug = 0
    console.log('===小工具z===');
    setTimeout(initMe,1000);
    function initMe() {
        if(!document.body){
            setTimeout(initMe , 1000);
            return;
        }
        console.log('===init===');
        let infos = [
            {title: '百度搜索', link: "https://www.baidu.com/s?wd="},
            {title: 'Bing搜索', link: 'https://cn.bing.com/search?qs=n&form=QBLHCN&scope=web&sp=-1&q='},
            {title: 'Google搜索', link: 'https://www.google.com/search?q='},
            {title: '百度翻译', link: 'https://fanyi.baidu.com/#en/zh/'},
            {title: 'Google翻译', link: 'https://translate.google.cn/#view=home&op=translate&sl=en&tl=zh-CN&text='},
            {title:  'Bilibili',  link: 'https://search.bilibili.com/all?keyword='},
            {title: 'LookAE', link: 'http://www.lookae.com/?s='},
            {title: '淘宝搜索', link: 'https://s.taobao.com/search?q='},
            {title: '京东搜索', link: 'https://search.jd.com/Search?keyword='},
            {title:  '简书',  link: 'https://www.jianshu.com/search?q='},
            {title:  '知乎',  link: 'https://www.zhihu.com/search?type=content&q='},
            {title:  '维基百科',  link: 'https://zh.wikipedia.org/wiki/'},
            {title:  'github',  link: 'https://github.com/search?q='},
            {title:  'stackoverflow',  link: 'https://stackoverflow.com/search?q='},
            {title:  'segmentfault',  link: 'https://segmentfault.com/search?q='},
            {title:  '百度趋势',  link: 'https://index.baidu.com/v2/main/index.html#/trend/'},
            {title:  'Youtube',  link: 'https://www.youtube.com/results?page=&utm_source=opensearch&search_query='},
            ];
        //   let div = $('<div id="zszen" class="小工具z" style="line-height:17px;overflow:hidden; position:fixed; right:2%; top:6%; z-index:9999;height: 25px; width: 53px;border:2px solid #dfdfdf;background-color:#ffffff"></div>');
        let div = createEl('div','zszen','小工具z',"border-radius:5px;line-height:17px;overflow:hidden;position:fixed;right:2%;top:6%;z-index:9999;height: 25px;width: 53px;border:2px solid #dfdfdf;background-color:#ffffffcc");
        document.body.appendChild(div);
        // //$('body').append(div);
        let title = createEl('h4','title',null,"align:center;text-align:center;line-height:13px;margin-bottom:2px;margin-top:2px;line-height:1;padding-left:0px;padding-top:0px;-webkit-margin-before:.3em;-webkit-margin-after:.3em;-webkit-margin-start: 0px;-webkit-margin-end: 0px;font-weight: bold;");
        div.appendChild(title);
        let font = createEl('font','title',null,"color:#336699;font-size:13");
        title.appendChild(font);
        font.innerHTML = 'TOOLz';

        let items = createEl('div','itemList',null,"line-height:16px;text-align:center;align:center;padding-left:7px;padding-top:0px;color:#68ac10");
        items.hidden = true;
        div.appendChild(items);
        // let intro = $('<label id="tip" style="width:100%"><font style="margin:auto;text-align:center;padding-left:5px;color:#dddddd;font-size:11px;display:inline-block;">自动搜索关键字/选区</font></label>');

        {
            for(let info of infos){
                let btn = createEl('label',null,null,"line-height:14px;width:105px;color:#cccccc;font-weight:100;font-size:13px;",{link:info.link});
                btn.innerHTML = info.title;
                items.appendChild(btn);
                items.appendChild(createEl('br'));
                // $('<label style="width:105px;color:#333333;font-size:13px;line-height:14px;" link="'+info.link+'"><font>'+info.title+'</font></label><br>')
                btn.onmouseover = (evt)=>{
                    evt.currentTarget.style.color = '#333333';
                    evt.currentTarget.style['font-weight'] = '800';
                    document.clipboard = getSelectedText();
                }
                btn.onmouseout = (evt)=>{
                    evt.currentTarget.style.color = '#cccccc';
                    evt.currentTarget.style['font-weight'] = '100';
                }
                btn.onmousedown = (evt)=>{
                    //DLOG(evt.currentTarget.getAttribute('link'));
                    dealLink(evt, evt.currentTarget.getAttribute('link'),window.location.href);
                }
            }
        }

        let intro = createEl('label','tip',null,"width:100%");
        items.appendChild(intro);
        font = createEl('font',null,null,"margin:auto;text-align:center;padding-left:5px;color:#dddddd;font-size:11px;display:inline-block;");
        intro.appendChild(font);
        font.innerHTML = '自动关键字/选区';


        div.onmouseover = ()=>{
            showList()
        }
        div.onmouseout = ()=>{
            hideList();
        }

        hideList();

    }

    function createEl(tagName,id,className,styleString,otherParams){
        let tag = document.createElement(tagName);
        if(id!=null) tag.id = id;
        if(className!=null) tag.className = className;
        if(styleString!=null) strToStyle(tag,styleString);
        if(otherParams!=null) {
            for (const key in otherParams) {
                tag.setAttribute(key, otherParams[key]);
            }
        }
        return tag;
    }

    function strToStyle(el,str){
        // let str = "line-height:17px;overflow:hidden; position:fixed;right:2%;top:6%;z-index:9999;height: 25px; width: 53px;border:2px solid #dfdfdf;background-color:#ffffff";
        let arr = str.split(';');
        let obj = {};
        for (const unit of arr) {
            let arrUnit = unit.split(':');
            obj[arrUnit[0]] = arrUnit[1];
            el.style[arrUnit[0]] = arrUnit[1];
        }
        return obj;
        // var style = document.createElement('style');
        // style.type = 'text/css';
        // style.innerHTML=str;
        // return style;
    }

    function showList(){
        let div = findTag('div','zszen');
        let title=  findTag('h4','title');
        let items=  findTag('div','itemList');
        title.childNodes[0].innerHTML='小工具z';
        // document.getElementById('title').childNodes[0].innerHTML='小工具z'
        // $('h4#title').children().html('小工具z');
        // title.clientHeight+items.clientHeight+50;
        // console.log(items);
        // '215px';
        // $('div#zszen').css({width:'115px',height:'215px'})
        div.getElementsByTagName('font')[0].style['font-size']='16px';
        // $('div#zszen').find('font#title').css({'font-size':16})
        div.getElementsByTagName('div')[0].hidden = false;
        // $('div#zszen').find('div#itemList').show();
        div.style.width = '115px';
        div.style.height = title.clientHeight+items.clientHeight+20+'px';
    }

    function hideList(){
        let div = findTag('div','zszen')
        let title=  findTag('h4','title');
        findTag('h4','title').childNodes[0].innerHTML='TOOLz';
        // document.getElementById('title').childNodes[0].innerHTML='TOOLz'
        // $('h4#title').children().html('TOOLz');
        // $('div#zszen').css({width:'53px',height:'25px'})
        div.getElementsByTagName('font')[0].style['font-size']='13px';
        // $('div#zszen').find('font#title').css({'font-size':13})
        div.getElementsByTagName('div')[0].hidden = true;
        // $('div#zszen').find('div#itemList').hide();
        div.style.width = '53px';
        div.style.height = title.clientHeight+20+'px';
    }

    function dealLink(evt,link,currentLink){
        if(isDebug){
            DLOG(link);
            return;
        }
        var str = currentLink;
        var keyword = "";
        if(str.indexOf("www.baidu.com")!=-1){
            console.log("百度:");
            keyword = findTag('input',null,'s_ipt').value;
        }else if(str.indexOf("fanyi.baidu.com")!=-1){
            keyword = findTag('textarea',null,'textarea').value;
        }else if(str.indexOf("bing.com")!=-1){
            keyword = findTag('input',null,'b_searchbox').value;
        }else if(str.indexOf("www.google.com")!=-1){
            keyword = findTag('input',null,null,{role:null}).value;
        }else if(str.indexOf("translate.google.com")!=-1 || str.indexOf("translate.google.cn")!=-1){
            keyword = findTag('textarea','source',null).value;
        }else if(str.indexOf("taobao.com")!=-1){
            keyword = findTag('input',null,'search-combobox-input').value;
        }else if(str.indexOf("jd.com")!=-1){
            keyword = findTag('input','key').value;
            keyword = encodeUnicode(keyword);
        }else if(str.indexOf("jianshu.com")!=-1){
            keyword = findTag('input',null,'search-input').value;
        }else if(str.indexOf("zhihu.com")!=-1){
            keyword = findTag('input','Popover5-toggle','Input').value;
        }else if(str.indexOf("github.com")!=-1){
            keyword = findTag('input',null,null,{name:'q'}).value
        }else if(str.indexOf("stackoverflow.com")!=-1){
            keyword = findTag('input',null,null,{name:'q'}).value
        }else if(str.indexOf("segmentfault.com")!=-1){
            keyword = findTag('input','searchBox',null).value
        }else if(str.indexOf("wikipedia.org")!=-1){
            var str1 = window.location.href;
            var arr1 = str1.split("/");
            keyword = arr1[arr1.length-1];
        }else{
            console.log("其他");
        }
        if(document.clipboard){
            keyword = getSelectedText();
        }
        //keyword = escape(keyword);
        // console.log(keyword)
        if(evt.shiftKey || evt.ctrlKey || evt.metaKey){
            window.open(link+keyword,"_blank");
        }else{
            window.open(link+keyword,"_self");
        }
    }

    function encodeUnicode(str) {
        var res = [];
        for ( var i=0; i<str.length; i++ ) {
        res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
        }
        return "\\u" + res.join("\\u");
    }
    function decodeUnicode(str) {
        str = str.replace(/\\/g, "%");
        return unescape(str);
    }

    function findTag(tagName,id,className,properties){
        // let pool = [];
        let tags = document.getElementsByTagName(tagName)
        for (const unit of tags) {
            if(id!=null && unit.id!=id){
                continue;
            }
            if(className!=null && unit.className!=className){
                continue;
            }
            if(properties){
                let isPass = true;
                for (const key in properties) {
                    if(!unit.hasAttribute(key)){
                        isPass = false;
                        break;
                    }else if(properties[key] && unit.getAttribute(key)!=properties[key]){
                        isPass = false;
                        break;
                    }
                }
                if(!isPass){
                    continue;
                }
            }
            return unit;
            // pool.push(unit);
        }
        // return pool;
    }

    function getSelectedText() {
      if (window.getSelection) {
        return window.getSelection().toString();
      } else if (document.selection) {
        return document.selection.createRange().text;
      }
      return ''
    }

    function DLOG(...args){
        if(isDebug) {
            args.unshift('>>');
            console.log.apply(this,args);
        }
    }

  })()


