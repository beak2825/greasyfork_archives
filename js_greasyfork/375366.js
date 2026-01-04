// ==UserScript==
// @name         微信公众号编辑器插件去隐藏广告
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       You
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit*
// @include https://www.135editor.com/*
// @include https://www.365editor.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375366/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8%E6%8F%92%E4%BB%B6%E5%8E%BB%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/375366/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8%E6%8F%92%E4%BB%B6%E5%8E%BB%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

$(function() {
    if(location.host==="mp.weixin.qq.com"){
        setTimeout(function(){
            var toolbar = $('#js_toolbar_1')
            
            var blackClassList = ['xmt-style-block','sougou','KolEditor','yead_editor','_135editor','KolEditor','xmteditor','RankEditor','xmyeditor','elasticScale' ,'vipIco','v5bjq','elasticScale','wx-bdtc']
            var blackAttrList = ['data-tools','powered-by','data-author','label','data-tools-id','data-type','data-id','data-original','donone']
            $('#js_preview').after('<span id="removeAd" class="btn btn_input btn_default  r" style="min-width:50px"><button style="padding:0 5px" type="button">清除</button></span>')
            $('#removeAd').click(function(){
                var dom = $('#ueditor_0').contents().find('*')
                dom.each(function(){
                    let _this = this
                    blackClassList.forEach(function(e){
                        $(_this).removeClass(e)
                    })
                    blackAttrList.forEach(function(e){
                        $(_this).removeAttr(e)
                    })
                    if($(this).attr('label')==='Powered by 135editor.com'){$(this).removeAttr('label')}
                })
            })

            $('#js_submit').hide()
            $('#js_preview').after('<span id="js_submit2" class="btn btn_input btn_primary r" ><button type="button">保存</button></span>')
            $('#js_submit2').click(function(){
                var html = $('#ueditor_0').contents()
                let haveAd = html.find(blackClassList.map(e=>'.'+e).join(',')).length>0 || html.find(blackAttrList.map(e=>'['+e+']').join(',')).length>0 || html.find('[attr="Powered by 135editor.com"]').length>0
                if(haveAd){
                    if(confirm('当前文章存在隐藏广告（建议先清除广告再提交)，是否强制保存')){
                        $('#js_submit').click()
                    }
                }else{
                    $('#js_submit').click()
                }
            })
        },2000)
    }else if(location.host==="www.135editor.com"){
        publishController.open_html_dialog = function(){}
        $('body').on('click','.editor-template-list>li',function(){
            if($(this).hasClass('vip-style')){
                let template = $(this).find('>section').html()
                console.log(template)
                insertHtml(template)
            }

        })
    }else if(location.host ==='www.365editor.com'){
        vm.useAll = function (item) {

            ue.execCommand('inserthtml', item.Content);
        }


        var ue = UE.getEditor('container', {
            initialFrameHeight: (($(window).height() * 1) - 255),
            autoClearinitialContent: false,
        });
        vm.usePart = function usePart(item) {
            var conditions = {};
            conditions.Content = '<section class="KolEditor">' + item.Content + '</section>';
            conditions.template = true;
            conditions.Status = 1;
            layer.closeAll('tips');
            vm.aboutMertial.usePart = true;
            vm.ifend = "tEnd"
            vm.aboutMertial.partContent = conditions;
            Vue.nextTick(function () {
                $(document).off('mouseenter.part').on('mouseenter.part', '.KolEditor:first .KolEditor', function () {
                    $(this).css("position", "relative");
                    $(this).append('<section class="usePart" style="position:absolute;left:-10px;top:-10px;width:calc(100% + 20px);height:calc(100% + 20px);background-color:rgba(0,0,0,0.4);z-index:88;border-radius:4px;"><i class="fa fa-arrow-circle-o-right" data-type="fa-arrow-circle-o-right" style="cursor:pointer;font-size:40px;color:#fff;display:inline-block;position:absolute;left:50%;top:50%;margin-left:-20px;margin-top:-20px;"></i></section>');
                    $(".usePart").click(function (event) {
                        var range = ue.selection.getRange().cloneContents();
                        var _this = $(this).parents(".KolEditor:first");
                        $(this).remove();
                        if (range != null) {
                            secondBrush(_this.clone());
                        } else {
                            ue.execCommand('inserthtml', '<section class="KolEditor">' + _this.html() + '</section>');
                        }
                    })
                })
                $(document).on('mouseleave', '.KolEditor:first .KolEditor', function () {
                    $(this).find(".usePart").remove();
                    layer.closeAll('tips');
                })
            })

        }

        vm.randerMaterial = function (event, type) {
            $(".messageList").addClass("hidden");
            if (vm.aboutMertial.mertialType == 'template' || vm.aboutMertial.mertialType == 'designTemplate' || $(event.currentTarget).find(".paster_container_main_lunbo").length > 0) {
                return false;
            } else if ($(".sidebar").find("li.active").attr("data-type") == "imglist" && $(ue.body).find(".checkSelected").length > 0 && $(ue.body).find(".checkSelected").children()[0].localName == 'img') {
                $(ue.body).find(".checkSelected").children("img").attr("src", $(event.currentTarget).find("img").attr("src"));
                $(ue.body).find(".checkSelected").children("img").attr("_src", $(event.currentTarget).find("img").attr("src"));
                clearselectline();
            } else {
                var range = ue.selection.getRange().cloneContents(); //获得选区【秒刷】
                var _this = $(event.currentTarget).context.nodeName.toLowerCase() == "p" ? $(event.currentTarget).parents(".item").find(".KolEditor:first").clone() : $(event.currentTarget).find(".KolEditor:first").clone();
                if (vm.aboutMertial.mertialType == 'mysign') {
                    //侧边栏在我的签名上，点击为添加签名
                    //头部
                    if ($(ue.body).find(".materialTop").length > 0) {
                        $(ue.body).find(".materialTop").empty().append($(event.currentTarget).find(".materialTop").html());
                    } else {
                        var _node = ue.body.firstChild;
                        $(event.currentTarget).find(".materialTop").clone().insertBefore($(_node));
                    }
                    // 尾部
                    if ($(ue.body).find(".materialBottom").length > 0) {
                        $(ue.body).find(".materialBottom").empty().append($(event.currentTarget).find(".materialBottom").html());
                    } else {
                        $(ue.body).append($(event.currentTarget).find(".materialBottom").clone()[0]);
                    }
                } else {
                    if (range != null) {
                        secondBrush(_this, type);
                    } else {
                        // var _style = $(event.currentTarget).find(".KolEditor:first").attr("style");
                        ue.execCommand('inserthtml', '<section  class="KolEditor">' + _this.html() + '</section>');
                        //  ====== 带序号的素材，点击实现数字自增  ======
                        if ($(event.currentTarget).find(".KolEditor:first").find("p.count").length > 0) {
                            $(event.currentTarget).find(".KolEditor:first").find("p.count").each(function () {
                                var count = Number($(this).html());
                                var _length = $(this).html().length;
                                if (String(count + 1).length < _length) {
                                    var zero = new Array((_length - String(count + 1).length) + 1).join("0");
                                    $(this).html(zero + (count + 1));
                                } else {
                                    $(this).html(count + 1);
                                }
                            })
                        }
                    }
                }
                clearselectline();

            }
        }

    }

});
