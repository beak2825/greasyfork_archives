// ==UserScript==
// @name         IT之家-反恰客脚本
// @namespace    http://tampermonkey.net/
// @version      0.84
// @description  try to take over the world!
// @author       You
// @match        https://quan.ithome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389239/IT%E4%B9%8B%E5%AE%B6-%E5%8F%8D%E6%81%B0%E5%AE%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/389239/IT%E4%B9%8B%E5%AE%B6-%E5%8F%8D%E6%81%B0%E5%AE%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if ($(".postcontent").length > 0 && $(".postcontent").html().indexOf("class=\"appmore\"") > 0) {
        $(".postcontent").html("<p>稍等一下，正在异步获取帖子数据。。。</p>");
        var _id = location.href.substring(location.href.indexOf("/0/") + 3, location.href.indexOf("/0/") + 6) + location.href.substring(location.href.indexOf("/0/") + 7, location.href.indexOf("/0/") + 10);
        $.ajax({
            url: "https://fxxkcar.com/getithomepost.php?id=" + _id,
            dataType: 'jsonp',
            jsonp: "CallBack",
            success: function (data) {
                var _content = data.content;

                _content = replaceimg(_content, data.imgs);
                $(".postcontent").html(_content);
                var _repost = "<div id=\"ReplyList\"class=\"comment\"><div class=\"comm_title\"><div class=\"l\"><a style=\"color: red;\" target=\"_blank\" href=\"https://www.fxxkcar.com/ithome.html\">IT之家自动签到系统</a></div><div class=\"r\"><a class=\"order\">正序显示</a></div></div><ul class=\"comm_list\"id=\"ulcommentlist\"></ul><ul class=\"comm_list\"id=\"ulcommentlistorder\"style=\"display:none\"></ul><ul class=\"comm_list\"id=\"LoadArticleReply\"></ul><script>var replypage=1;$(function(){pagereply(replypage,20,$(\'.order\').text())});</script><input type=\"hidden\"id=\"postid\"value=\"" + _id + "\"/></div><div class=\"more_comm\"><a id=\"pagecomment\" href=\"javascript:pagereply(++replypage,95,$(\'.order\').text());\">查看更多回复 ...</a></div>";
                $("#content").after($(_repost));



                var login = '';

                login += '                  <div class="answer" id="divanswer">';
                login += '     <div class="user_info"></div>';
                login += '     <div class="edit_form">';
                login += '         <input type="hidden" id="parentPostID" value="0" />';
                login += '         <script type="text/plain" id="myEditor" style="width:735px;height:220px;"></script>';
                login += '         <span id="replyMessage" style="color:red"></span>';
                login += '         <a href="javascript:;" class="answer_inpt" id="btnReply">回复</a>';
                login += '     </div>';
                login += ' </div>';
                login += ' <script src="//img.ithome.com/file/js/jquery/popwin.js"><\/script>';
                login += ' <script type="text/javascript" src="/statics/ueditor/ueditor.config.js?r=3"><\/script>';
                login += ' <script type="text/javascript" src="/statics/ueditor/ueditor.all.js?r=3"><\/script>';
                login += ' <script type="text/javascript" src="/statics/ueditor/lang/zh-cn/zh-cn.js?r=3"><\/script>';
                login += ' <link href="https://quan.ithome.com/statics/ueditor/themes/default/css/ueditor.css" type="text/css" rel="stylesheet">';
                login += ' <script src="https://quan.ithome.com/statics/ueditor/third-party/codemirror/codemirror.js" type="text/javascript" defer="defer"></script>';
                login += ' <link rel="stylesheet" type="text/css" href="https://quan.ithome.com/statics/ueditor/third-party/codemirror/codemirror.css">';

                $("#ReplyList").append($(login));

                window.editor = UE.getEditor('myEditor');

                editor.placeholder("<span style=color:#bbb>政治、色情、喷骂、引战、机型喷、水军、广告等违法违规行为将被封号。</span>");
                haodadaimages();
                $(".comm_title").delegate(".order",
                    "click",
                    function (e) {
                        e.preventDefault();
                        if ($(".order").html() == "倒序显示") {
                            $("#ulcommentlist").hide();
                            $("#ulcommentlistorder").fadeIn("slow");
                            $(".order").html("正序显示");
                            if ($("#ulcommentlistorder").html() == "") {
                                var new_item = $("<div/>").load("/quan/GetAjaxData.aspx",
                                    { "postid": $("#postid").val(), "type": "replypage", "page": 1, "order": "order" },
                                    function () {
                                    }).hide();
                                $("#ulcommentlistorder").append(new_item);
                                new_item.fadeIn("slow");
                            }
                        } else {
                            $("#ulcommentlist").fadeIn("slow");
                            $("#ulcommentlistorder").hide();
                            $(".order").html("倒序显示");
                            if ($("#ulcommentlist").html() == "") {
                                var new_item = $("<div/>").load("/quan/GetAjaxData.aspx",
                                    { "postid": $("#postid").val(), "type": "replypage", "page": 1 },
                                    function () {
                                    }).hide();
                                $("#ulcommentlist").append(new_item);
                                new_item.fadeIn("slow");
                            }
                        }


                    })

                $(".comm_list").delegate(".reply_btn",
                    "click",
                    function () {
                        oremarkbtn = $(this);
                        modelreplyComment();
                        addReply();
                        $(".bbsmodal textarea").keydown(function (e) {
                            if ((e.which === 13 || e.which === 10) && e.ctrlKey) {
                                $(".answer_inpt").click()
                            }
                        })
                    });
                $("#btnReply").click(function () { reply() });
                $("#btnModifyReply").click(function () { modifyReply() })
                $(".comm_title .order").click();

            }
        })

    }
    $(function () {

        haodadaimages();


    });

    function haodadaimages() {
        //添加按钮
        var _filebtn = '<label class="ui_button ui_button_primary" id="haodada_lab" for="haodada_file" style="display: block;cursor:pointer;margin-top: 10px;width: 90px;height: 40px;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;background: #d94141;color: #fff;text-align: center;text-decoration: none;line-height: 40px;">上传高清大图</label><input style="display:none;" type="file" id="haodada_file" name="profile_pic" multiple="multiple" accept=".jpg, .jpeg, .png, .gif">';
        if($("#divanswer>.user_info").length>0)$("#divanswer>.user_info").after(_filebtn);
        else if($(".pb_title").length>0)$(".pb_title").after(_filebtn);
        else if($("#postbox .edit_form").length>0)$("#postbox .edit_form").before(_filebtn);
        $(".sub_nav").append('<a style="color: red;" target="_blank" href="https://www.fxxkcar.com/ithome.html">IT之家自动签到系统</a>')
        var editor=typeof(editor)=="undefined"?UE.getEditor('myEditor'):editor;
        $("#haodada_file").change(function () {
            window.haodadafiles = $("#haodada_file")[0].files;
            window.haodadaimagesindex= 0;
            uploadimg();

        });
    }
    function uploadimg(){
        $("#haodada_lab").text("正在上传");
        var formData = new FormData();
        formData.append("smfile", haodadafiles[haodadaimagesindex]);
        var _tempimg;
        $.ajax({
            url: 'https://www.fxxkcar.com/upload.php',
            type: 'POST',
            success: function (data) {
              console.log(data);
              editor.focus();
              editor.execCommand("inserthtml","<p><img src='"+data.trim()+"?ithome.com' _src='"+data.trim()+"?ithome.com'/></p>");
              haodadaimagesindex++;
              if(haodadaimagesindex<haodadafiles.length){
                uploadimg();
              }else{
                $("#haodada_lab").text("上传高清大图");
              }
            },
            error: function (data) {
              alert('图片上传失败 - ' + XMLHttpRequest.status);
              haodadaimagesindex++;
              if(haodadaimagesindex<haodadafiles.length){
                uploadimg();
              }else{
                $("#haodada_lab").text("上传高清大图");
              }
              console.error(XMLHttpRequest + textStatus + errorThrown);
            },

            data: formData,
            cache: false,
            contentType: false,
            processData: false

        });
    }
    function replaceimg(content, imgsArr) {
        var _rexArray = content.match(/(<!--IMG_)(\d|\d\d)-->/g);
        if (_rexArray == null) { return content; }
        for (var _i = 0; _i < _rexArray.length; _i++) {
            content = content.replace(_rexArray[_i], "<img src='" + imgsArr[_i] + "'/><br/>");
        }
        return content;
    }
})();