// ==UserScript==
// @name         2048
// @namespace    https://greasyfork.org/zh-CN/scripts/442235-2048/code
// @version       1.1.11
// @description  2048论坛预加载视频图片
// @author       sht(QQ1073481777)
// @match        http*://*/*read*
// @match        http*://*/search*
// @match        http*://*/*read*
// @match        http*://*/2048/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @license      MIT

// @大家都想要一个搜索页面的，所以就搞出来了，还有脚本还有BUG，以后再修改吧
// @downloadURL https://update.greasyfork.org/scripts/442235/2048.user.js
// @updateURL https://update.greasyfork.org/scripts/442235/2048.meta.js
// ==/UserScript==
//注入页面的脚本文件

jQuery(function() {

    var ads = ['.promo-container',
               '.nav-container',
               '.movie-banner'
              ];
    jQuery.each(ads,function(i,e){jQuery(e).hide()});


    function jsleft(obj, str) {
        var index = obj.indexOf(str);
        obj = obj.substring(0, index);
        return obj;
    }

    //JS 取右字符函数
    function jsright(obj,str){
        var index = obj.indexOf(str);
        obj = obj.substring(index + 1,obj.length);
        return obj;
    }

    function jsmid(str,b,a){
        var bds=b+'(\\S*)'+a;
        return str.match(bds)[1];
    }

    function bt(){
        jQuery('.f14 a').each(function(){
            var href = jQuery(this).attr("href");
            if(href.indexOf('name=')>0){
                var st=jsright(href, '=');
                href= 'https://down.dataaps.com/down.php/'+st+'.torrent';
                jQuery(this).attr('href',href);
            }
        })
    }
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Text copied to clipboard');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    var ur=window.location.href;
    if(ur.indexOf("read.php")>1){
        setTimeout(bt,1000);
    }

    var pattern,n;
    var patterns=['.subject','th a[href*="tid"]'];
    jQuery.each(patterns,function(i,e){
        var urls = jQuery(e);
        var s_urls = [];
        if (urls.length>0){
            n=i;
        }
    });

    if (n>=0){
        console.log(n);
        var res = '';
        var s_urls=[];
        pattern=patterns[n];
        var urls=jQuery(pattern);

        var defer = jQuery.Deferred();
        var i,p;
        for (i = 0; i < urls.length; i++) {
            console.log(i);
            var url = urls[i].href;
            s_urls.push(url);
        }


        defer.resolve(jQuery("#content_2015195").append(""));
        jQuery.each(s_urls, function(i, e) { //i 是序列，e是数值
            defer = defer.then(function() {
                return jQuery.ajax({
                    url: e,
                    method: 'get',
                    success: function(data) {

                        res = jQuery(data).find('#copytext');
                        if(res.length>0){
                            var magnetLink= res[0].innerHTML;
                            console.log(magnetLink);
                            var appendDom = `<div style="width:800px; padding:10px 0; cursor: pointer" id="${magnetLink}">${magnetLink}</div>`;
                            var dom = document.createElement("div");

                            var newElement = document.createElement("tbody");
                            newElement.innerHTML = appendDom;
                            jQuery(pattern).eq(i).after(newElement);

                            var magnetLinkDom =  document.getElementById(magnetLink);
                            magnetLinkDom.addEventListener("click", () => {
                                copyToClipboard(magnetLink);
                                magnetLinkDom.innerHTML=magnetLink + " 已复制";
                                magnetLinkDom.style.color = "darkred";
                            })
                        }else{
                            res = jQuery(data).find('a[href*="list"]');
                            if(res.length>0){
                                var href= res[0].href;
                                if(href.indexOf('name=')>0){
                                    var st=jsright(href, '=');
                                    href= 'https://down.dataaps.com/down.php/'+st+'.torrent';
                                }
                                var appendDom2 = `<div style="width:800px; padding:10px 0; cursor: pointer" id="${href}">${href}</div>`;
                                var dom2 = document.createElement("div");

                                var newElement2 = document.createElement("tbody");
                                newElement2.innerHTML = appendDom2;
                                jQuery(pattern).eq(i).after(newElement2);

                                var hrefLink =  document.getElementById(href);
                                hrefLink.addEventListener("click", () => {
                                    copyToClipboard(href);
                                    hrefLink.innerHTML=href + " 已复制";
                                    hrefLink.style.color = "darkred";
                                })
                            }
                        }



                        res = jQuery(data).find('img[data-original]');
                        if (res.length>0) {
                            jQuery.each(res,function(item,value){
                                if (item<=2){
                                    var pic=jQuery(value)[0].dataset.original;
                                    jQuery(pattern).eq(i).append('<p><img src="'+pic+'" width= 400 "/>');
                                    jQuery('img[src*="thumb-ing.gif"]').hide();
                                }
                                return;
                            })
                        }

                        res = jQuery(data).find('img[iyl-data="adblo_ck.jpg"]');
                        if (res.length>0) {
                            jQuery(pattern).eq(i).append('<img src="'+res[0].src+'" width=400 />');
                            jQuery('img[src*="thumb-ing.gif"]').hide();
                            return;
                        }

                        res = jQuery(data).find('.f14 img');
                        if (res.length>0) {
                            jQuery(pattern).eq(i).append('<p><img src="'+res[0].src+'" width=400 /><p>');
                            jQuery('img[src*="thumb-ing.gif"]').hide();
                            return;
                        }



                    }
                })
            });
        });
        defer.done(function() {
            jQuery("#预祝2025年新年快乐！！！").append("ajax全部执行完成<br/>")

        });
    }

})