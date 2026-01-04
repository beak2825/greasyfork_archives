// ==UserScript==
// @name         ScalesImgageForJavHHH
// @namespace    https://4ca.st
// @version      1.3.6
// @description  ScaleInPics
// @author       Nazicp
// @match        https://javhhh.com/*
// @icon         https://javhhh.com/template/javhhh/images/favicon.ico
// @downloadurl  https://gist.githubusercontent.com/nazicp/57443bac407c6ae77bf8b21efc0e6217/raw/b2620ea57e39affd82901015c744b2b8679b3a51/ScalesImgageForJavHHH.js
// @updateurl    https://gist.githubusercontent.com/nazicp/57443bac407c6ae77bf8b21efc0e6217/raw/b2620ea57e39affd82901015c744b2b8679b3a51/ScalesImgageForJavHHH.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426628/ScalesImgageForJavHHH.user.js
// @updateURL https://update.greasyfork.org/scripts/426628/ScalesImgageForJavHHH.meta.js
// ==/UserScript==

$(function(){
    "use strict";
    var modal=`<div id="picmodal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" style="max-width: 1000px;" role="document">
    <div class="modal-content">
        <img id="picmodalImage" src="" style="border-radius:10px 10px 0 0">
       <div class="text-shadow" id="picmodalText" style="padding:10px">
       <h4 id="video-title"></h4>
          <div id="video-info"></div>
          <a href="" id="video-url" target="_blank" class="btn btn-info btn-lg fa fa-link hidden"></a>
       </div>
    </div>
  </div>
</div>`;
    $('body').append(modal);
    $('#picmodal').modal({show:false}).on('show.bs.modal',function(e){
        let container=e.relatedTarget.offsetParent;
        let img=$(container).find('img[data-qazy]');
        let href=container.querySelector('a').href;
        $('#picmodalImage').attr('src',img.attr('src').replace('_400.jpg',''));
        $('#video-title').text(img.attr('title'));
        let urlseg=href.split('/');
        $('#video-url').attr('href',href).text(urlseg[urlseg.length-2]).removeClass('hidden');

    }).on('hidden.bs.modal',function(){
        $('#picmodalImage').attr('src','');
        $('#video-info').empty();
        $('#video-title').empty();
        $('#video-url').empty().removeAttr('href').addClass('hidden');
    }).on('shown.bs.modal',function(){
        var href=$('#video-url').attr('href');
        $.ajax(href,{
            async:true,
            method:'GET',
            beforeSend:function(xhr,text){
                var htmltemp=`<i class="fa fa-spin fa-spinner fa-2x"></i> It might be take a few time for first load...`;
                $('#video-info').html(htmltemp);
            },
            cache:true,
            converters:{"* text": window.String, "text html": true, "application json":window.String},
            dataType:'text',
            success:function(d,status,xhr){
                var headers=xhr.getResponseHeader("content-type");
                if(headers=='application/json; charset=utf-8'){
                    xhr.then(function(){
                        $.get(href,{},function(dd){
                            var info=$(dd).find('.col-12:has(.card-sub)').html();
                            $('#video-info').html(info);
                        },'html');
                    });
                }else{
                    var info=$(d).find('.col-12:has(.card-sub)').html();
                    $('#video-info').html(info);
                }
            },
            error:function(){
                errFunc;
            }
        });
    });

    $('.content-views').html(function(i,n){
        return n + `<a href="javascript:;" data-toggle="modal" data-target="#picmodal" class="fa fa-eye fa-fw"></a>`;
    });
});

