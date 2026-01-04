// ==UserScript==
// @name         中华数字书苑图书导出
// @namespace    http://tampermonkey.net/
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.slim.min.js
// @version      0.1
// @description  图书导出
// @author       jy
// @match        http://e.hflib.org.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461936/%E4%B8%AD%E5%8D%8E%E6%95%B0%E5%AD%97%E4%B9%A6%E8%8B%91%E5%9B%BE%E4%B9%A6%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461936/%E4%B8%AD%E5%8D%8E%E6%95%B0%E5%AD%97%E4%B9%A6%E8%8B%91%E5%9B%BE%E4%B9%A6%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $j=jQuery.noConflict(true);
    //console.log(window.location.href)
    if(window.location.href.indexOf('metaid')<=0 ){
        return;
    }
    /*
    let script1 = document.createElement('script');
    script1.setAttribute('type', 'text/javascript');
    script1.src = "https://cdn.bootcdn.net/ajax/libs/pdfmake/0.2.7/pdfmake.min.js";
    document.documentElement.appendChild(script1);
    */
    let script2 = document.createElement('script');
    script2.setAttribute('type', 'text/javascript');
    script2.src = "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js";
    document.documentElement.appendChild(script2);

    //$j('#onlineqc').hide();
    $j(function(){
        var notInit =false
        while(notInit){

            (function ( ) {
                setTimeout(function () {
                    if(pdfMake && pdfMake.createPdf){
                        notInit= false;
                        $j('#onlineqc').show();
                    }
                    console.log('what')
                }, 500);
            })( );
        }


        $j('#onlineqc').html('下载').click(function(){

            if(!jspdf.jsPDF){

                alert('pdf插件初始化有误,刷新重试')
                return;
            }
            var doc= null;

            alert('正在下载，唔好重复点击')
            let totalPage = parseInt($j('#TotalCount').html());
            var imgSrc = $j('#img1').attr('src').replace('page=1','page={page}');
            let srcs = [];
            let urlPrefix = window.location.protocol +'//'+window.location.hostname+window.location.pathname;
            for(let i =1;i<=totalPage;i++){
                srcs.push(urlPrefix+imgSrc.replace('{page}',i));
            }
            //console.log(srcs)
            //console.log(pdfMake)
            //console.log(pdfMake.createPdf)

            var x = new ImageDataURL(srcs);
            x.oncomplete = function() {

                for (var key in this.imgdata) {
                    if (this.imgdata[key] == this.emptyobj){
                        continue;
                    }
                    if(doc==null){
                        doc = new jspdf.jsPDF({

                            unit: 'px',
                            format: [this.width[key], this.height[key]],
                            putOnlyUsedFonts: true,
                        });
                    }

                    doc.addImage(this.imgdata[key], 'JPEG', 0, 0, this.width[key], this.height[key])
                    try{
                        doc.addPage( [this.width[key+1], this.height[key+1]]);
                    }catch(e){}
                }

                doc.save($j('title').html()+'.pdf');


                /*
                var imgs = new Array();
                console.log("complete");
                for (var key in this.imgdata) {
                    if (this.imgdata[key] == this.emptyobj){
                        continue;
                    }
                    imgs.push({
                        image:this.imgdata[key],
                        fit: [this.width[key], this.height[key]]
                        //width:this.width[key],
                        //height:this.height[key]
                    });
                }
                var dd = {
                    content: [

                        imgs,
                    ],
                };

                pdfMake.createPdf(dd).download($j('title').html()+'.pdf');
                */
            }
        })


        //urls必须是字符串或字符串数组
        function ImageDataURL(urls) {
            this.completenum = 0;
            this.totalnum = 0;
            this.imgdata = new Array();
            this.width = [];
            this.height=[];
            this.emptyobj = new Object();
            this.oncomplete = function(){};
            this.getDataURL = function(url, index) {
                var c = document.createElement("canvas");
                var cxt = c.getContext("2d");
                var img = new Image();
                var dataurl;
                var p;
                p = this;
                img.src = url;
                img.onload = function() {
                    var i;
                    var maxwidth = 1200;
                    var scale = 1.0;
                    // console.log('before: '+img.width,img.height,c.width,c.height)
                    if (img.width > maxwidth) {
                        scale = maxwidth / img.width;
                        c.width = maxwidth;
                        c.height = Math.floor(img.height * scale);
                    } else {
                        c.width= img.width;
                        c.height= img.height;
                    }
                    //console.log('after:'+ img.width,img.height,c.width,c.height)
                    cxt.drawImage(img, 0, 0, c.width, c.height);
                    p.imgdata[index] = c.toDataURL('image/jpeg');
                    p.width[index] = img.width
                    p.height[index]= img.height
                    for (i = 0; i < p.totalnum; ++i) {
                        if (p.imgdata[i] == null)
                            break;
                    }
                    if (i == p.totalnum) {
                        p.oncomplete();
                    }
                };
                img.onerror = function() {
                    p.imgdata[index] = p.emptyobj;
                    for (var i = 0; i < p.totalnum; ++i) {
                        if (p.imgdata[i] == null){
                            break;
                        }
                    }
                    if (i == p.totalnum) {
                        p.oncomplete();
                    }
                };
            }
            if (urls instanceof Array) {
                this.totalnum = urls.length;
                let totalnum = this.totalnum
                this.imgdata = new Array(this.totalnum);
                let that = this;
                for (var key in urls) {


                    (function (key,totalnum) {
                        setTimeout(function () {
                            console.log(`正在下载第${key}页/共${totalnum}页`);
                            //$j('#onlineqc').html(`第${key}页/共${totalnum}页`)
                            that.getDataURL(urls[key], key);
                        }, 500);
                    })(key,totalnum);



                }
            } else {
                this.imgdata = new Array(1);
                this.totalnum = 1;
                this.getDataURL(urls, 0);
            }
        }




    })




    // Your code here...
})();