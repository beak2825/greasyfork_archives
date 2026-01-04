// ==UserScript==
// @name         微信公众号 图片编辑
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  微信公众号图片编辑器
// @author       You
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/437022/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%20%E5%9B%BE%E7%89%87%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/437022/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%20%E5%9B%BE%E7%89%87%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 要注入的css
    var inject_css = `
<style>
#editImageContainer{
    height:100%;
    width:100%;
    z-index:99999;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:rgba(0,0,0,.3);
    position: absolute;
    display: none;
    justify-content: center;
    align-items: center;
}
#edui1_imagescale{
display: none!important;
}
#editImageContainer #editImageBox{
    display: flex;
    flex-direction: row;
    width: 80%;
   
}
#editImageContainer #editImageBox .canvas{
    width: 888.888888888889px;
    height: 500px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #999;
}
#editImageContainer #editImageBox .canvas #canvas{
    /*position: absolute;*/
    transform: scale(0.499, 0.459);
    /*left: -413px;*/
    /*top: -302px;*/
    z-index: 1;
}

#editImageContainer #editImageBox .canvasAction{
    width: 50%;
    height: 500px;
      background: #999;
}
#editImageContainer #editImageBox .canvasAction textarea{
    height:380px;
    width: 100%;
    padding-top: 5px;
    line-height: 1.8;
    font-size: 30px;
    margin-bottom: 10px;
}
#editImageContainer #editImageBox .canvasAction .canvasActionTool{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    
}
#editImageContainer #editImageBox .canvasAction .canvasActionTool button{
   margin: 0 10px;
}
</style>
`;
    let canvas, ctx, editImgEle, inputText = "", shoImgEditorShow = false;
    let active = {
        waitUtil(ele, cb) {
            if ($(ele).length > 0) {
                cb();
            } else {
                setTimeout(() => {
                    waitUtil(ele, cb);
                }, 100);
            }
        },
        loadImg(src) {
            return new Promise((resolve, reject) => {
                let img = new Image()
                img.onload = () => resolve(img)
                img.onerror = () => reject("加载失败")
                img.setAttribute("crossOrigin", 'Anonymous')
                img.src = src;
            })
        },
        //初始化canvas
        initCanvas() {
            active.loadImg($EDITORUI["edui99"]._anchorEl.src).then(img => {
                editImgEle = img
                let {width, height} = img
                inputText=""
                canvas = document.createElement('canvas');
                canvas.setAttribute('id', 'canvas')
                canvas.width = width;
                canvas.height = height
                ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, width, height);
                $('#editImageContainer').html(`
                  <div id="editImageBox">
                  <div class="canvas"></div>
                  <div class="canvasAction">
                
           <textarea  type="text" id="editImgText" placeholder="请在这里输入标题" ></textarea>
                      <div class="canvasActionTool">
                      <button class="btn btn_input btn_primary editImageAction" data-type="saveImg">保存</button>
                        <button class="editImageAction btn btn_input btn_default" data-type="editImg">取消</button>   
</div>
                      
                     
                  </div>
                  </div>  
                `)

                $('#editImageContainer').find('.canvas').html(canvas)
                setTimeout("$('#editImgText').focus()", 1);
            })

        },
        renderCanvas(refresh = false) {
            if (!ctx) return null;
            (async () => {
                let {width, height} = editImgEle
                console.log(width, height)
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(editImgEle, 0, 0, width, height);
                active.renderText(inputText, '#fddf01', '#000', 80, width / 2, height - 80, '')
            })()
        },

        renderText(text, color, strokecolor, font, left, top, id) {
            ctx.font = `normal ${font}px 微软雅黑`;
            ctx.fillStyle = color;
            ctx.strokeStyle = strokecolor;
            ctx.lineWidth = 10;
            ctx.textAlign = 'center';
            ctx.strokeText(text, left, top);
            ctx.fillText(text, left, top)
        },
        loopCheckEditImgTool() {
            if ($('.edui_mask_edit_img_group').length > 0) {
                if ($('.edit_meta_img_text').length == 0) {
                    $('#edui99_content').css('width', '600px')
                    $('.edui_mask_edit_img_group').css('width', '600px')
                    $('.edui_mask_edit_img_group').append(`
<div style="margin-left: 15px;" data-type="editImg" class="edui-clickable edui_mask_edit_meta edit_meta_img_text editImageAction" >
                    <div class="edui_mask_edit_meta_inner ">
                       <i class="icon_edui_mask_img icon_edui_mask_img_replace"></i>编辑图片文字
                    </div>
                </div>`)
                }
            }
            requestAnimationFrame(active.loopCheckEditImgTool)
        },
        editImg() {
            if (!!$EDITORUI["edui99"] && !!$EDITORUI["edui99"]._anchorEl) {
                $("#editImageContainer").css({
                    display: shoImgEditorShow ? 'none' : 'flex'
                })
                if (!shoImgEditorShow) {
                    if ($('#editImageBox').length == 0) {
                        active.initCanvas()
                    } else {
                        $('#editImageBox').remove()
                        active.initCanvas()
                    }

                    setTimeout(() => {
                        active.renderCanvas()
                    }, 200)
                }
                shoImgEditorShow = !shoImgEditorShow;
            }
        },
        saveImg() {
            const img_data = canvas.toDataURL("image/png");
            $($EDITORUI["edui99"]._anchorEl).attr('src',img_data)
            active.editImg()
        }
    }
    $(document).ready(() => {
        if (top.location == self.location) {
            // 注入变量
            active.waitUtil('body', () => {
                let editImageContainer = document.createElement('div')
                editImageContainer.setAttribute('id', 'editImageContainer')
                $('body').append(editImageContainer);
                $('body').append(inject_css);
                active.loopCheckEditImgTool();
            })
            return;
        }
    });


    $(document).on('click', '.editImageAction', function () {
        var othis = $(this), type = othis.data('type');
        active[type] ? active[type].call(this, othis) : '';
    });
    $(document).on('input', '#editImgText', function () {
        inputText = $(this).val()
        active.renderCanvas()
    })

})();
