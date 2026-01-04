// ==UserScript==
// @name         淘宝天猫图片打包下载,详情图合并分割,历史价格,分类排行优惠券
// @namespace    https://www.itwashot.com
// @version      0.5.6
// @description  淘宝主图，详情图，规格图，视频打包下载。【说明】请先将页面下拉到最后，确认所有详情图完全显示后再点击右下侧的按钮，否则会获取不到图片资源，如果有视频，请等到视频加载后再进行操作。
// @author       lelf
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @connect      www.gwdang.com
// @connect      tsr.itwashot.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/materialize/1.0.0-rc.2/js/materialize.min.js
// @require      https://cdn.bootcss.com/jszip/3.2.2/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @require      https://cdn.bootcss.com/jszip-utils/0.1.0/jszip-utils.min.js
// @require      https://code.highcharts.com/highcharts.js
// @resource     lelf-materialcss https://cdn.jsdelivr.net/gh/lelf2005/cdn@master/material.css?v=20200630
// @license      GPL License
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/394713/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%2C%E8%AF%A6%E6%83%85%E5%9B%BE%E5%90%88%E5%B9%B6%E5%88%86%E5%89%B2%2C%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%2C%E5%88%86%E7%B1%BB%E6%8E%92%E8%A1%8C%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/394713/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%2C%E8%AF%A6%E6%83%85%E5%9B%BE%E5%90%88%E5%B9%B6%E5%88%86%E5%89%B2%2C%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%2C%E5%88%86%E7%B1%BB%E6%8E%92%E8%A1%8C%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;
    var materialcss = GM_getResourceText('lelf-materialcss');
    GM_addStyle(materialcss);
    addMenu();
    var zipImgs;
    var zipDetailImgs;
    let splitImgZip

    function addMenu() {
        var sidenav = '<div class="fixed-action-btn">'+
            '<a class="btn-floating btn-large red">'+
            '<div class="lelf-icon-menu"></div>'+
            '</a>'+
            '<ul>'+
            '<li><a id="lelf_tb" class="btn-floating green waves-effect waves-light modal-trigger" href="#lelf_modal2" title="下载图片"><div class="lelf-icon-download"></div></a></li>'+
            '<li><a id="lelf_rank" class="btn-floating green waves-effect waves-light modal-trigger" href="#lelf_modal_rank" title="类目排行"><div class="lelf-icon-rank"></div></a></li>'+
            '<li><a id="lelf_price" class="btn-floating green waves-effect waves-light modal-trigger" href="#lelf_modal_price" title="历史价格"><div class="lelf-icon-chart"></div></a></li>'+
            '</ul>'+
            '</div>';
        $("body").append(sidenav);
        $('.fixed-action-btn').floatingActionButton({
            hoverEnabled: false
        });

        $("#lelf_tb").click(function(){
            getTBPics();
            $('#lelf_modal2').modal();
        });

        $("#lelf_price").click(function(){
            getHistoryPrice();
            $('#lelf_modal_price').modal();
        });
        $("#lelf_rank").click(function(){
            getTopItems();
            $('#lelf_modal_rank').modal();
        });
        
    }

    function getTBPics(){
        zipImgs = [];
        zipDetailImgs = [];
        var imgHtml = '';
        var imgSrc = '';
        var detailImgSrc = '';
        var skuImgSrc = '';
        var detailImgHtml = '';
        var mainVideo = $("video").find("source");
        var isBlobVideo = false;
        var mainVideoHtml = '';
        if(mainVideo.length > 0){
            mainVideoHtml = '<div class="row"><video class="responsive-video" controls><source src="'+mainVideo[0].src+'" type="video/mp4"></video></div>';
            zipImgs.push(mainVideo[0].src);
        }else if($("video").length > 0){
            mainVideoHtml = '<div class="row">这个视频隐藏了真实地址，暂时无法解析。</div>';
        }


        var mainImg = $("#J_UlThumb").find("img");
        for(var i =0; i< mainImg.length;i++){
            imgSrc = mainImg[i].src;
            if(imgSrc.lastIndexOf("webp")>-1){
                imgSrc = imgSrc.substring(0, imgSrc.lastIndexOf('_', imgSrc.lastIndexOf('_') - 1));
            }else{
                imgSrc = imgSrc.substring(0, imgSrc.lastIndexOf("_"));
            }
            zipImgs.push(imgSrc);
            imgHtml += '<div class="col s2"><img class="materialboxed" width="100" src="'+imgSrc+'"></div>';
        }

        var skuImg = $(".tb-sku .tm-img-prop").find("a")
        if(skuImg.length == 0){
            skuImg = $(".tb-skin .tb-img").find("a");
        }

        for(var n =0; n< skuImg.length;n++){
            if(skuImg[n].style.background){
                skuImgSrc = skuImg[n].style.background.split("(")[1].split(")")[0];
                skuImgSrc = skuImgSrc.substring(1,skuImgSrc.lastIndexOf("_"));
                zipImgs.push(skuImgSrc);
                imgHtml += '<div class="col s2"><img class="materialboxed" width="100" src="'+skuImgSrc+'"></div>';
            }
        }

        var detailImg = $("#description > .content").find("img");
        for(var k =0; k< detailImg.length;k++){
            if(detailImg[k].getAttribute("data-ks-lazyload") !== null){
                detailImgSrc = detailImg[k].getAttribute("data-ks-lazyload");
            }else{
                detailImgSrc = detailImg[k].src;
            }

            if(detailImg[k].naturalWidth > 100 ){
                detailImgHtml += '<div class="col s12"><img class="materialboxed" width="100%" src="'+detailImgSrc+'"></div>';
                zipDetailImgs.push(detailImgSrc);
            }
        }
        addTBHtml(mainVideoHtml,imgHtml,detailImgHtml);

        $('.materialboxed').materialbox();
    }
    function addTBHtml(video,imgs,detailImgs){
        var isAdded = $("#lelf_modal2");
        if(isAdded.length > 0){
            isAdded.remove();
        }
        var s = '  <div id="lelf_modal2" class="modal modal-fixed-footer">'+
            '    <div class="modal-content">'+
            '      <h4 class="h4">打包下载工具</h4>'+
            '<div class="row">'+
            '    <div class="col s12">'+
            '      <ul class="tabs">'+
            '        <li class="tab col s2"><a class="active" href="#main_pics">主图</a></li>'+
            '        <li class="tab col s2"><a  href="#detail_pics">详情图</a></li>'+
            '        <li class="tab col s2"><a  href="#detail_pics_splitter">详情图分割</a></li>'+
            '      </ul>'+
            '    </div>'+
            '    <div id="main_pics" class="col s12">'+video+'<div class="row">'+imgs+'</div></div>'+
            '    <div id="detail_pics" class="col s12">'+detailImgs+'</div>'+
              '    <div id="detail_pics_splitter" class="col s12"><div style="display:flex;justify-content:center;margin:10px;align-items:center;"><a class="waves-effect waves-light btn" style="margin-right:10px;" id="mergeImgs">合并</a><label style="margin-right:10px;">分割尺寸(px)</label>'+
              '<input type="number" value="1000" id="splitSize" style="margin-right:10px;"><a class="waves-effect waves-light btn disabled" style="margin-right:10px;" id="splitImg">分割</a><a class="waves-effect waves-light btn disabled" id="downloadSplittedImgs">下载</a></div>'+
            '<div style="display:flex;justify-content:space-between;margin:10px;align-items:start;"><div id="mergePreviewTitle" style="font-size: 16px;">合并图预览</div><div id="splitPreviewTitle" style="font-size: 16px;">分割图预览</div></div>'+
             '<div style="display:flex;justify-content:center;margin:10px;align-items:start;"><div id="mergePreview"></div><div id="splitPreview"></div></div></div><canvas id="mycanvas" style="display:none;"></canvas>'+
            '  </div>'+
            '    </div>'+
            '    <div class="modal-footer">'+
            '       <a href="#!" id="lelf-msg" class="modal-close waves-effect waves-green btn-flat"></a>'+
            '       <a id="lelf_tbpic_download" class="waves-effect waves-light btn">下载</a>'+
            '      <a href="#!" class="modal-close waves-effect waves-green btn-flat">关闭</a>'+
            '    </div>'+
            '  </div>';
        $("body").append(s);
        var instance = M.Tabs.init($('.tabs'), '{}');
        $('.tabs').tabs('updateTabIndicator');

        var itemId = window.location.href.split("id=")[1].split('&')[0];
            if(itemId === null && itemId.toString().length<0){
                itemId="unknown";
            }


        $("#lelf_tbpic_download").click(function(){
            var zip = new JSZip();
            var mainImgs = zip.folder("main");
            var detailImgs = zip.folder("detail");
            var suffix = '';
            var totalAssets = zipImgs.length + zipDetailImgs.length;
            var currentAsset = 0;
            for(var i=0;i<zipImgs.length;i++){
                suffix = zipImgs[i].substring(zipImgs[i].lastIndexOf(".") + 1, zipImgs[i].length);
                mainImgs.file(i.toString()+'.'+suffix, urlToPromise(zipImgs[i]), {binary:true});
                currentAsset++;
                $("#lelf-msg").text("处理中:"+currentAsset+"/"+totalAssets);
            }
            for(var j=0;j<zipDetailImgs.length;j++){
                suffix = zipDetailImgs[j].substring(zipDetailImgs[j].lastIndexOf(".") + 1, zipDetailImgs[j].length);
                detailImgs.file(j.toString()+'.'+suffix, urlToPromise(zipDetailImgs[j]), {binary:true});
                currentAsset++;
                $("#lelf-msg").text("处理中:"+currentAsset+"/"+totalAssets);
            }
            
            zip.generateAsync({type:"blob"})
                .then(function callback(blob) {
                $("#lelf-msg").text("打包中:"+currentAsset+"/"+totalAssets);
                saveAs(blob, itemId+".zip");
                $("#lelf-msg").text("已完成:"+currentAsset+"/"+totalAssets);
            });
        });

        $('#mergeImgs').click(function(){
            let merger = new Merger(document.getElementById('mycanvas'), Image);
            merger.merge(zipDetailImgs, imgPreview);
            document.getElementById("splitImg").classList.remove('disabled');
        });
        $('#splitImg').click(function(){
            splitImages();
            document.getElementById("downloadSplittedImgs").classList.remove('disabled')
        });
        $('#downloadSplittedImgs').click(function(){
            saveAs(splitImgZip, itemId+'_splitImages.zip');
        });
    }
    function getHistoryPrice(){
        var isAdded = $("#lelf_modal_price");
        if(isAdded.length > 0){
            isAdded.remove();
        }
        var s = '  <div id="lelf_modal_price" class="modal modal-fixed-footer">'+
            '    <div class="modal-content">'+
            '      <h4 class="h4">历史价格</h4>'+
            '<div class="row">'+
            '    <div class="col s12">'+
            '        <div id="max_min_price"></div>'+
            '        <div id="chart_price" style="width:100%; height:350px;"></div>'+
            '    </div>'+

            '  </div>'+
            '    </div>'+
            '    <div class="modal-footer">'+
            '      <a href="#!" class="modal-close waves-effect waves-green btn-flat">关闭</a>'+
            '    </div>'+
            '  </div>';
        $("body").append(s);

        var dp_id = window.location.href.split("id=")[1].split('&')[0];
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.gwdang.com/trend/data_www?dp_id='+dp_id+'&show_prom=true&v=2&get_coupon=1&price=',
            onload: response => {
                var rsp = JSON.parse(response.responseText);
                var seriesData = [];
                var maxPrice = [];
                var minPrice = [];
                if(rsp.is_ban == 1){
                    $("#max_min_price").html("请稍后再试");
                }else{
                    var d = rsp.series[0].data;
                    maxPrice = [rsp.series[0].max_stamp*1000,rsp.series[0].max/100];
                    minPrice = [rsp.series[0].min_stamp*1000,rsp.series[0].min/100];
                    $.each(d,function (index,element) {
                        seriesData.push([element.x*1000,element.y/100]);
                    })
                    $("#max_min_price").html("<span style='color:red'>最高:&nbsp;"+maxPrice[1]+"&nbsp;元&nbsp;("+formatDate(maxPrice[0])+")</span>&nbsp;&nbsp;<span style='color:green'>最低:&nbsp;"+minPrice[1]+"&nbsp;元&nbsp;("+formatDate(minPrice[0])+")</span>");

                    ////
                    Highcharts.chart('chart_price', {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            labels: {
                                formatter:function(){
                                    return formatDate(this.value);
                                }
                            }
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        tooltip: {
                            formatter : function (){
                                var s = '<span>'+formatDate(this.x)+':'+this.y+'元</span>';
                                return s;
                            }
                        },
                        legend: {
                            enabled: false
                        },

                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: true
                                },
                                step: 'left'
                            }
                        },

                        credits: {
                            enabled: false
                        },

                        series: [{
                            name: "历史价格",
                            data: seriesData
                        }],

                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 500
                                },
                                chartOptions: {
                                    plotOptions: {
                                        series: {
                                            marker: {
                                                radius: 2.5
                                            }
                                        }
                                    }
                                }
                            }]
                        }
                    }); ////
                }
            }
        });



    }
    function getTopItems(){
        var isAdded = $("#lelf_modal_rank");
        if(isAdded.length > 0){
            return;
        }
        var s = '  <div id="lelf_modal_rank" class="modal modal-fixed-footer">'+
            '    <div class="modal-content">'+
            '      <h5 class="h5 header" id="itemcat">加载中，请稍等</h5>'+
            '<div id="lelf-top-items">'+

            '</div>'+
            '    </div>'+
            '    <div class="modal-footer">'+
            '      <a href="#!" class="modal-close waves-effect waves-green btn-flat">关闭</a>'+
            '    </div>'+
            '  </div>';
        $("body").append(s);

        var dp_id = window.location.href.split("id=")[1].split('&')[0];
        toggleLoader(true);
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://tsr.itwashot.com/api/index?id='+dp_id,
            onload: response => {
                if(isJSON(response.responseText)){
                    var colors = ["lelf-gold","lelf-silver","lelf-orange","lelf-blue"];
                    var item_color = 0;

                    var rsp = JSON.parse(response.responseText);
                    if(rsp.category_id){
                        $("#itemcat").html("当前商品分类销量前20<a href='https://tsr.itwashot.com' target='_blank' style='position: absolute;right:5px;font-size:16px;'>更多排行点这里</a><div style='font-size:20px;margin-top: 10px;'>"+rsp.level_one_category_name+"-"+rsp.category_name+"</div>");
                        var topItems = rsp.top;
                        var htmlItems = '';
                        for(var i=0;i<topItems.length;i++){
                            item_color = i<3?i:3;
                            var strCoupon ='';
                            if(topItems[i].coupon_amount > 0){
                                strCoupon = '<span class="lelf-ribbon4">'+topItems[i].coupon_amount+'元券</span>';
                            }
                            htmlItems = htmlItems + '<div class="row">'+
                                '<div class="col s1">'+

                                '<div class="lelf-badge-container"><div class="lelf-badge '+colors[item_color]+'">'+
                                '<div class="lelf-circle"> <div class="h5 strong" style="margin-top:3px;">'+(i+1)+'</div></div></div>'+

                                '</div>'+
                                '</div>'+
                                '<div class="col s11">'+
                                '<div class="card horizontal">'+
                                '      <div class="card-image">'+
                                '        <img src="'+topItems[i].pic_url+'_200x200.jpg">'+
                                '      </div>'+
                                '      <div class="card-stacked">'+
                                '        <div class="card-content">'+
                                '          <p class="h6">'+topItems[i].title+'</p>'+
                                '          <div style="margin-top:18px;">价格 <span class="h5 red-text"> ￥'+topItems[i].current_price+'</span>'+strCoupon+'</div>'+
                                '        </div>'+
                                '        <div class="card-action">'+
                                '<div class="btn-flat"  style="text-decoration:none;font-size:18px;">30天销售<span class="red-text">'+topItems[i].volume+'</span>件</div>'+
                                '          <a href="'+topItems[i].url+'" target="_blank" class="btn waves-effect waves-light red lighten-2" style="text-decoration:none;font-size:20px;float: right;">查看商品</a>'+
                                '        </div>'+
                                '      </div>'+
                                '    </div>'+
                                '</div>'+
                                '  </div>'
                        }
                        $("#lelf-top-items").html(htmlItems);

                    }
                }else{
                    $("#itemcat").html("服务器错误，请稍后再试");
                }
                toggleLoader(false);
            },
            onerror:err =>{
                toggleLoader(false);
            }
        });

    }

    function toggleLoader(flag){

        if(flag){
            var strHtml='<div class="lelf-loader" id="loader"><div class="lelf-dot"></div><div class="lelf-dot"></div><div class="lelf-dot"></div><div class="lelf-dot"></div><div class="lelf-dot"></div></div>';
            $("#lelf-top-items").append(strHtml);
        }else{
            $("#loader").remove();
        }
    }

    function isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }

            } catch(e) {
                return false;
            }
        }
    }

    function urlToPromise(url) {
        return new Promise(function(resolve, reject) {
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2){month = '0' + month;}
        if (day.length < 2){day = '0' + day;}

        return [year, month, day].join('-');
    }
/////
class Merger {
  constructor(canvas, Image) {

    this.canvas = canvas;
    this.Image = Image;
    this.ctx = this.canvas.getContext("2d");

  }

  async merge(urls, cb) {
    const imgs = await this.loadImages(urls);
    const map = [];
    const gap = 0;
	const scale = 1;


    const maxWidth = imgs.reduce((m, x) => Math.max(m, x.width), 0);
    const maxHeight = imgs.reduce((m, x) => m + x.height + gap, 0);

    this.canvas.width = maxWidth * scale;
    this.canvas.height = maxHeight * scale;

    let y = 0;
    const x = 0;
    for (let i = 0; i < urls.length; i += 1) {
      const url = urls[i];
      let name = "";
      if (typeof File === "function" && url instanceof File) {
        name = url.name.split(".").shift();
      } else {
        name = url
          .split("/")
          .pop()
          .split(".")
          .shift();
      }
      const { width , height } = imgs[i] ;
      this.ctx.drawImage(imgs[i], x, y, width * scale, height  * scale );
      map.push([name, x, y, width, height]);
      y += height * scale + gap;
    }
	cb();

  }

  loadImages(urls) {
    const imgs = [];
    let count = 0;
    const { length } = urls;
    return new Promise((resolve, reject) => {
      for (let i = 0; i < urls.length; i += 1) {
        const img = new this.Image();
		img.setAttribute("crossOrigin",'Anonymous')
        const url = urls[i];
        img.onerror = reject;
        img.onload = () => {
          imgs[i] = img;
          count += 1;
          if (count === length) resolve(imgs);
        };
        if (typeof File === "function" && url instanceof File) {
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            () => {
              img.src = reader.result;
            },
            false
          );

          reader.readAsDataURL(url);
        } else {
          img.src = url;
        }
      }
    });
  }
}

function imgPreview(){
	const preview = document.createElement('img');
	preview.src = document.getElementById("mycanvas").toDataURL();
	preview.style.width = "98%";
    preview.style.border = "1px solid #a2de96";
	document.getElementById("mergePreview").appendChild(preview);
     $('#mergePreviewTitle').html('合并图预览('+document.getElementById("mycanvas").width+'*'+document.getElementById("mycanvas").height+')');
}

async function splitImages () {
    const size = document.getElementById('splitSize').value;
    const toBlob = (d) => new Promise((res) => d.toBlob(res,"image/jpeg", 0.8));

    for (const el of document.querySelectorAll('div.imageRow')){
        el.parentNode.removeChild(el);
    }

    let done = 0;
    let w, h, numTiles;
    const prefix = 'img';
    const zip = new JSZip();
    const startTime = Date.now();
    const section = document.createElement('canvas');
    const ctx = section.getContext('2d');

    let progress = document.getElementById('splitPreviewTitle');
        let img = new Image();
		img.setAttribute("crossOrigin",'Anonymous');
		img.src = document.getElementById("mycanvas").toDataURL();

        await new Promise((res, rej) => {
            img.addEventListener('load', async function () {
				section.width = img.width;
				section.height = size;

                h = Math.ceil(img.height / size);
                numTiles = h;

				const row = document.createElement('div');
                 row.classList.add('imageRow');
                for (let y = 0; y > -h; y--) {


						if(y == -h+1){
							section.height = img.height - size * (h-1);
						};
                        ctx.drawImage(img, 0, y * size);
                        const blob = await toBlob(section);

                        zip.file(`${ prefix }_0_${ -y }.png`, blob);

                        const preview = document.createElement('img');
                        preview.src = URL.createObjectURL(blob);
						preview.style.width = "98%";

                        row.appendChild(preview);

                        ctx.clearRect(0, 0, img.width, size);
                        progress.innerText = `Progress: ${ ++done }/${ numTiles }`;

                    document.getElementById('splitPreview').appendChild(row);
                }
                res();
            });
        });


    progress.innerText = `分割图预览(${ numTiles - 1 }*${size}+${ img.height - (numTiles-1)*size })`;

    splitImgZip = await zip.generateAsync({ type: 'blob' });
}


    // Your code here...
})();