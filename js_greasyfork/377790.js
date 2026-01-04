// ==UserScript==
// @name         SnapShotOnline.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Javascript API that captures local video images and uploads them to sm.ms or imagebam or nhd.
// @author       You
// @match        *
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==
var $ = window.jQuery;
window.SnapShotOnline = function(input_resource, textarea_img_bbcode, input_upload_snapshot, input_copy_snapshot, span_bar, span_snapshot, select_number, video_resource, canvas_resource){
    var ctx_resource = canvas_resource[0].getContext('2d');
    var thumb_scale;
    var video_length, shot_num, shot_requests = [], counter, update_flag = false;
    var processing = false;
    var image_url, thumb_url;
    var shot_index;
    var downScaleCanvas = function(cv, scale){
        if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
        var sqScale = scale * scale;
        var sw = cv.width;
        var sh = cv.height;
        var tw = Math.floor(sw * scale);
        var th = Math.floor(sh * scale);
        var sx = 0, sy = 0, sIndex = 0;
        var tx = 0, ty = 0, yIndex = 0, tIndex = 0;
        var tX = 0, tY = 0;
        var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0;
        var crossX = false;
        var crossY = false;
        var sBuffer = cv.getContext('2d').
        getImageData(0, 0, sw, sh).data;
        var tBuffer = new Float32Array(3 * tw * th);
        var sR = 0, sG = 0, sB = 0;
        for (sy = 0; sy < sh; sy++) {
            ty = sy * scale;
            tY = 0 | ty;
            yIndex = 3 * tY * tw;
            crossY = (tY != (0 | ty + scale));
            if (crossY) {
                wy = (tY + 1 - ty);
                nwy = (ty + scale - tY - 1);
            }
            for (sx = 0; sx < sw; sx++, sIndex += 4) {
                tx = sx * scale;
                tX = 0 | tx;
                tIndex = yIndex + tX * 3;
                crossX = (tX != (0 | tx + scale));
                if (crossX) {
                    wx = (tX + 1 - tx);
                    nwx = (tx + scale - tX - 1);
                }
                sR = sBuffer[sIndex];
                sG = sBuffer[sIndex + 1];
                sB = sBuffer[sIndex + 2];
                if (!crossX && !crossY) {
                    tBuffer[tIndex] += sR * sqScale;
                    tBuffer[tIndex + 1] += sG * sqScale;
                    tBuffer[tIndex + 2] += sB * sqScale;
                } else if (crossX && !crossY) {
                    w = wx * scale;
                    tBuffer[tIndex] += sR * w;
                    tBuffer[tIndex + 1] += sG * w;
                    tBuffer[tIndex + 2] += sB * w;
                    nw = nwx * scale
                    tBuffer[tIndex + 3] += sR * nw;
                    tBuffer[tIndex + 4] += sG * nw;
                    tBuffer[tIndex + 5] += sB * nw;
                } else if (crossY && !crossX) {
                    w = wy * scale;
                    tBuffer[tIndex] += sR * w;
                    tBuffer[tIndex + 1] += sG * w;
                    tBuffer[tIndex + 2] += sB * w;
                    nw = nwy * scale
                    tBuffer[tIndex + 3 * tw] += sR * nw;
                    tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                    tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                } else {
                    w = wx * wy;
                    tBuffer[tIndex] += sR * w;
                    tBuffer[tIndex + 1] += sG * w;
                    tBuffer[tIndex + 2] += sB * w;
                    nw = nwx * wy;
                    tBuffer[tIndex + 3] += sR * nw;
                    tBuffer[tIndex + 4] += sG * nw;
                    tBuffer[tIndex + 5] += sB * nw;
                    nw = wx * nwy;
                    tBuffer[tIndex + 3 * tw] += sR * nw;
                    tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                    tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                    nw = nwx * nwy;
                    tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                    tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                    tBuffer[tIndex + 3 * tw + 5] += sB * nw;
                }
            }
        }
        var resCV = document.createElement('canvas');
        resCV.width = tw;
        resCV.height = th;
        var resCtx = resCV.getContext('2d');
        var imgRes = resCtx.getImageData(0, 0, tw, th);
        var tByteBuffer = imgRes.data;
        var pxIndex = 0;
        for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
            tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
            tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
            tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
            tByteBuffer[tIndex + 3] = 255;
        }
        resCtx.putImageData(imgRes, 0, 0);
        return resCV;
    }
    var fadeInThenFadeOut = function(span_snapshot, content, time, color){
        span_snapshot.text(content).css('color', color).fadeIn(function(){
            $(this).delay(time).fadeOut(function(){
                span_snapshot.text('');
            });
        });
    }
    var DOMEventInit = function(){
        input_resource.on('change', function(e){
            if(e.target.files.length > 0){
                processAbort();
                input_upload_snapshot.prop('disabled', false);
                input_upload_snapshot.show();
                input_copy_snapshot.prop('disabled', true);
                input_copy_snapshot.hide();
                span_bar.css({
                    'width': '0%',
                    'background-color': '#DCEDEE'
                });
                update_flag = false;
                shot_index = 1;
                counter = 0;
                shot_requests = [];
                image_url = [];
                thumb_url = [];
                video_length = 0;
                thumb_scale = 1;
            }
            else{
                processAbort();
                input_upload_snapshot.prop('disabled', true);
            }
        });
        input_upload_snapshot.on('click', function(e){
            processing = true;
            input_upload_snapshot.prop('disabled', true);
            select_number.prop('disabled', true);
            shot_num = parseInt(select_number.val());
            var file = input_resource[0].files[0];
            video_resource[0].src = URL.createObjectURL(file);
        });
        video_resource.on('durationchange', function(){
            this.pause();
            update_flag = true;
            canvas_resource.attr({
                'width': this.videoWidth,
                'height': this.videoHeight
            });
            var thumb_width = shot_num==1?750:((shot_num - 1)%3>1?250:375);
            thumb_scale = thumb_width/this.videoWidth;
            video_length = this.duration;
            this.currentTime = Math.floor(shot_index*video_length/(shot_num + 1));
        });
        video_resource.on('timeupdate', function(){
            if(update_flag){
                ctx_resource.drawImage(this, 0, 0, canvas_resource[0].width, canvas_resource[0].height);
                canvas_resource[0].toBlob(
                    (function(shot_ind){
                        return function(blob){
                            processOrigin(blob, shot_ind);
                        }
                    })(shot_index)
                );
                downScaleCanvas(canvas_resource[0], thumb_scale).toBlob(
                    (function(shot_ind){
                        return function(blob){
                            processThumb(blob, shot_ind);
                        }
                    })(shot_index)
                );
                ++shot_index;
                if(shot_index > shot_num){
                    video_resource[0].pause();
                }
                else{
                    video_resource[0].currentTime = Math.floor(shot_index*video_length/(shot_num + 1));
                }
            }
        });
        input_copy_snapshot.on('click', function(e){
            e.preventDefault();
            textarea_img_bbcode[0].select();
            try{
                var successful = document.execCommand('copy');
                var msg = successful?{'text': '成功', 'color': '#FFFFFF'}:{'text': '失败', 'color': '#DD8944'};
                fadeInThenFadeOut(span_snapshot, '截图BBCode复制' + msg.text, 500, msg.color);
            }
            catch(error){
                fadeInThenFadeOut(span_snapshot, '无法复制截图BBCode', 500, '#DD8944');
            }
        });
        select_number.prop('disabled', false);
    }
    var imageBanSuccessCallback = function(result, array, shot_index, data){
        var form = data;
        result = JSON.parse(result);
        if(result.success){
            array[shot_index - 1] = result.data.link;
        }
        else{
            console.log('Error: Upload Image');
        }
        checkProcess();
    }
    var smmsSuccessCallback = function(result, array, shot_index, data){
        var form = data;
        if(result.code == 'success'){
            array[shot_index - 1] = result.data.url;
            checkProcess();
        }
        else{
            var file_name = 'TYT.png';
            for(var pair of form.entries()) {
                if(pair[0] == 'smfile'){
                    file_name = pair[1].name;
                    break;
                }
            }
            form.append('image', form.get('smfile'));
            form.append('Name', file_name);
            form.delete('smfile');
            shot_requests.push($.ajax({
                'method': 'POST',
                'url': 'https://api.imageban.ru/v1',
                'data': form,
                'contentType': false,
                'processData': false,
                'headers': {
                    'Authorization': 'TOKEN rtaDTmC0SLXmq9RXtIPg'
                },
                'success': (function(array, shot_ind){
                    return function(result){
                        imageBanSuccessCallback(result, array, shot_ind);
                    }
                })(array, shot_index),
                'error': checkProcess
            }));
        }
    }
    var nhdSuccessCallback = function(result, array, shot_index, data){
        var form = data;
        if(result.match(/parent\.tag_extimage\('[^\)']+'\)/)){
            var bbcode = result.match(/parent\.tag_extimage\('([^\)']+)'\)/)[1];
            form.append('body', bbcode);
            form.delete('file');
            shot_requests.push($.ajax({
                'method': 'POST',
                'url': 'http://www.nexushd.org/preview.php',
                'data': form,
                'contentType': false,
                'processData': false,
                'success': (function(array, shot_ind){
                    return function(result){
                        nhdPreviewCallback(result, array, shot_ind);
                    }
                })(array, shot_index),
                'error': checkProcess
            }));
        }
        else{
            form.append('smfile', form.get('file'));
            form.delete('file');
            shot_requests.push($.ajax({
                'method': 'POST',
                'url': 'https://sm.ms/api/upload',
                'data': form,
                'contentType': false,
                'processData': false,
                'success': (function(array, shot_ind, form_data){
                    return function(result){
                        smmsSuccessCallback(result, array, shot_ind, form_data);
                    }
                })(array, shot_index, form),
                'error': checkProcess
            }));
        }
    }
    var nhdPreviewCallback = function(result, array, shot_index){
        if(result.match(/src="[^"]+"/)){
            array[shot_index - 1] = result.match(/src="\/*([^"]+)"/)[1].replace(/\.thumb\.jpg$/, '');
            checkProcess();
        }
        else{
            console.log('Error: Display Image');
            checkProcess();
        }
    }
    var processOrigin = function(blob, shot_index){
        var form = new FormData();
        form.append(
            'smfile', new File([blob], shot_index + '.png', {
                type: 'image/png',
                lastModified: Date.now()
            })
        );
        shot_requests.push($.ajax({
            'method': 'POST',
            'url': 'https://sm.ms/api/upload',
            'data': form,
            'contentType': false,
            'processData': false,
            'success': (function(array, shot_ind, form_data){
                return function(result){
                    smmsSuccessCallback(result, array, shot_ind, form_data);
                }
            })(image_url, shot_index, form),
            'error': checkProcess
        }));
    }
    var processThumb = function(blob, shot_index){
        var form = new FormData();
        form.append(
            'file', new File([blob], shot_index + '.png', {
                type: 'image/png',
                lastModified: Date.now()
            })
        );
        shot_requests.push($.ajax({
            'method': 'POST',
            'url': 'http://www.nexushd.org/attachment.php',
            'data': form,
            'contentType': false,
            'processData': false,
            'success': (function(array, shot_ind, form_data){
                return function(result){
                    nhdSuccessCallback(result, array, shot_ind, form_data);
                }
            })(thumb_url, shot_index, form),
            'error': checkProcess
        }));
    };
    var processAbort = function(){
        processing = false;
        shot_requests.forEach(function(e){
            try{
                e.abort();
            }
            catch(error){}
        });
        select_number.prop('disabled', false);
    }
    var processDone = function(){
        processing = false;
        var bbcode = '';
        image_url.forEach(function(e, i){
            if(thumb_url[i]){
                bbcode += '[url=' + e + '][img]' + thumb_url[i] + '[/img][/url] ';
            }
        });
        textarea_img_bbcode.val(bbcode);
        input_upload_snapshot.hide();
        input_copy_snapshot.prop('disabled', false);
        input_copy_snapshot.show();
        select_number.prop('disabled', false);
    }
    var checkProcess = function(){
        if(processing){
            ++counter;
            span_bar.css({
                'width': (counter/shot_num/2)*100 + '%'
            });
            if(counter == shot_num*2){
                span_bar.css({
                    'background-color': '#2276BB'
                });
                processDone();
            }
        }
    }
    return {
        init: function(){
            $(document).ready(DOMEventInit);
        }
    }
}