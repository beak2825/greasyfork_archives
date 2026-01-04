// ==UserScript==
// @name         图片在线压缩
// @namespace    ༺黑白༻
// @version      1.6
// @description  select img to zip!
// @author       Paul
// @match        *://www.baidu.com/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/layer.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375340/%E5%9B%BE%E7%89%87%E5%9C%A8%E7%BA%BF%E5%8E%8B%E7%BC%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/375340/%E5%9B%BE%E7%89%87%E5%9C%A8%E7%BA%BF%E5%8E%8B%E7%BC%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    ({
        reader: null,
        loadImg: null,
        canvas: null,
        context: null,
        $body: null,
        itemTotalCount:0,
        createCss: function () {
            $(document.head).append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/skin/layer.css"/>');
            GM_addStyle('.zipcontainer{ position:fixed;width:60px;height:35px;line-height:35px;right: 0;font-size: 12px;top: 50%;transform: translateY(-50%);z-index: 1;cursor: pointer;border-radius: .4em;overflow: hidden;background-color: #38f;color:#fff; }\
             .zipcontainer .zipbtn{ display:block; text-align:center;width:100%;height:100%; }\
             .zipcontainer .zipfile{display:block; position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;z-index:-1; }\
             .maxImg{ max-height:100%;max-width:100%; }\
             .cfg_progress{ width:550px;display:block;height: 30px;line-height: 30px;margin-bottom:10px; }\
             .cfg_progress .cfg_progress_label{ width:70px;display:inline-block;float: left; }\
             .cfg_progress .cfg_progress_bar{ width:450px;display:inline-block;margin-left:15px;height: 30px; }\
             .cfg_progress .cfg_progress_bar span{ background-color:#C1E1FC;width:0;height:100%;display:block;text-align:center;}\
             .cfg_imgs{ width:550px;height:300px;overflow-y:auto;margin-top:5px; }\
             .cfg_imgs .img_item{ float:left;width:115px;margin:3px 3px;border:1px solid #ccc;background-color:#dbdbdb; }\
             .cfg_imgs .img_item:nth-child(4n-3){margin-left:7px;}\
             .cfg_imgs .img_item:nth-child(4n){margin-right:7px;}\
             .cfg_imgs .img_item .img{ height:135px;width:115px;vertical-align: middle;display:table-cell; }\
             .cfg_imgs .img_item .img img{max-height:100%;max-width:100%;margin:0 auto;display:block;}\
             .cfg_imgs .img_item .text{ text-align:center;display:block;line-height:25px;background-color:#fff; }');
            return this;
        },
        createBtn: function () {
            var htmlStr = '<div class="zipcontainer"><span class="zipbtn">图片压缩</span><input accept="image/*" type="file" multiple class="zipfile" /></div>';
            this.$container = $(htmlStr).appendTo(this.$body);
            return this;
        },
        createProcessWin: function () {   
            layer.open({
                type: 1,
                area:['610px','auto'],
                title: '脚本定制可联系：1292956082@qq.com',
                content: '<div style="margin: 20px;font-size:13px;">\
                            <div class="cfg_progress">\
                                <div class="cfg_progress_label">压缩进度:</div>\
                                <div class="cfg_progress_bar"><span id="itemCount">0%</span></div>\
                            </div>\
                            <div class="cfg_imgs" id="zipImgs"></div>\
                          </div>\
                         ',
                shade: false,
                success: function (layero, index) {
                    this.$itemCount = layero.find('#itemCount');
                    this.$zipImgs = layero.find('#zipImgs');
                    this.$body.off('item_progress').on('item_progress', function (e, cur, total,imgSrc,originSize,afterZipSize) {
                        var progress = Math.round(cur / total * 100);
                        progress = progress + '%';
                        this.$itemCount.css('width', progress).html(progress);
                        this.$zipImgs.append('<div class="img_item"><div class="img"><img src="' + imgSrc + '"  /></div><span class="text">'+this.computeSize(originSize)+' -> '+this.computeSize(afterZipSize)+'</span><a class="text" href="' + imgSrc +'" download="img" >下载</a></div>');
                    }.bind(this));
                }.bind(this),
                end: function () {
                    this.$container.show();   
                }.bind(this)
            })
        },
        computeSize:function(size){
            var prefix='B',cSize=size;
            if(size>1024){
                prefix='KB';
                cSize = Math.ceil(size/1024);
                if(size>1024*1024){
                    prefix='MB'; 
                    cSize = Math.ceil(size/(1024*1024));
                }
            }
            return cSize+prefix;
        },
        initEvent: function () {
            this.$container.children('span:first').on('click', function (e) { var $this = $(this); $this.next().click(); }).end().children('input:first').on('change', this.onChange.bind(this));
            return this;
        }, 
        onReadFile: function (e) {
            this.loadImg.src = e.target.result;
        },
        onImgLoad: function (dfd,originSize,e) {
            // 图片原始尺寸
            var originWidth = this.loadImg.width;
            var originHeight = this.loadImg.height;
            // 最大尺寸限制，可通过国设置宽高来实现图片压缩程度
            var maxWidth = 800,
                maxHeight = 800;
            // 目标尺寸
            var targetWidth = originWidth,
                targetHeight = originHeight;
            // 图片尺寸超过400x400的限制
            //if (originWidth > maxWidth || originHeight > maxHeight) {
            //    if (originWidth / originHeight > maxWidth / maxHeight) {
            //        // 更宽，按照宽度限定尺寸
            //        targetWidth = maxWidth;
            //        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            //    } else {
            //        targetHeight = maxHeight;
            //        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            //    }
            //}
            // canvas对图片进行缩放
            this.canvas.width = targetWidth;
            this.canvas.height = targetHeight;
            // 清除画布
            this.context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            this.context.drawImage(this.loadImg, 0, 0, targetWidth, targetHeight);
            /*第一个参数是创建的img对象；第二个参数是左上角坐标，后面两个是画布区域宽高*/
            //压缩后的图片base64 url
            /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/jpeg';
             * qualityArgument表示导出的图片质量，只要导出为jpg和webp格式的时候此参数才有效果，默认值是0.92*/
            /* this.canvas.toBlob(function(){
              console.log(arguments);
            },'image/jpeg',0.80);
            var newUrl = this.canvas.toDataURL('image/jpeg', 0.80);//base64 格式
            //console.log(canvas.toDataURL('image/jpeg', 0.92));
            dfd.resolve(newUrl); */
            var quality=0.75,formart='image/jpeg';
            this.canvas.toBlob(function(blob){
                dfd.resolve(this.canvas.toDataURL(formart, quality),originSize,blob.size);
            }.bind(this),formart,quality);
        },
        onChange: function (e) {
            var i,file,len,filesArray=[],
                files = e.target.files;
            len = files.length;
            if (len <= 0) {
                layer.msg("请选择要压缩的图片！");
            } else {
                for (i = 0; i < len; i++) {
                    file = files[i];
                    if (file.type.indexOf("image") == 0) {
                        filesArray.push(file);
                    } 
                }  
            }
            this.itemTotalCount = filesArray.length;
            if (this.itemTotalCount > 0) {
                this.$container.hide();
                this.createProcessWin();
                setTimeout(this.doFilesQueue.bind(this, filesArray,0), 100);
            }
            e.target.value='';
        },
        doLoad: function (file) {
            var dfd = $.Deferred();
            this.loadImg.onload = this.onImgLoad.bind(this, dfd,file.size);
            this.reader.onload = this.onReadFile.bind(this);
            this.reader.readAsDataURL(file);
            return dfd.promise();
        },
        doFilesQueue: function (filesArray,itemExecCount) {
            if (filesArray.length > 0) {  
                itemExecCount++;
                this.doLoad(filesArray.shift()).done(this.doProcess.bind(this, filesArray, itemExecCount));
            } 
        },
        doProcess: function (filesArray, itemExecCount,imgSrc,originSize,afterZipSize) {
            this.$body.trigger('item_progress', [itemExecCount, this.itemTotalCount, imgSrc,originSize,afterZipSize]);
            setTimeout(this.doFilesQueue.bind(this, filesArray, itemExecCount), 100);
        },
        run: function () {
            this.$body = $('body');
            this.reader = new FileReader();
            this.loadImg = new Image();
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.createCss()
                .createBtn()
                .initEvent();
        }
    }).run();
})();