// ==UserScript==
// @name         答案获取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  dcloud
// @author       mehaotian
// @match        *://ask.dcloud.net.cn/*
// @grant        none
// @require      https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.js
// @downloadURL https://update.greasyfork.org/scripts/381261/%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/381261/%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==
(function () {
    // 获取添加节点的dom节点的位置
    var $dom = $('.aw-mod-body').find('.aw-replay-box-control .btn-publish-submit');
    var $children = $('<a id="ht-question-hock" href="javascript:;" class="btn btn-large btn-success pull-right btn-publish-submit">获取答案</a>').css({
        background: '#ff5a5f',
        border: '1px #ff5a5f solid'
    })
    $dom.before($children)
    $('.aw-mod-body').on('click', '#ht-question-hock', function () {
        getAjax()
    })
    $(document).on('click','.itemQuestionHock',function(){
        var item = $(this).data('item') ;
        console.log(item)
        var content = $('#advanced_editor').val();
        content += '\n' + item;
        $('#advanced_editor').val(content);
    })

    var $parent = $('#markItUpPreviewFrame').before('<div style="margin-top:20px;border: 1px solid #CCCCCC; padding: 10px;"><h2 class="title">候选答案:</h2><div id="candidateQuestionsHock" class="">点击获取答案</div></div>')

    function getAjax() {
        let title = $('.aw-mod-head h1').text().trim()
        let question = title + ' ' + $('#markdownbody .markdown-body').text().trim()
        // console.log(question)
        var formData = new FormData();
        formData.append('question',question)
        // 发送 POST 请求
        axios({
            method: 'post',
            url: '//ask.dcloud.net.cn/robot/ask/',
            dataType:'json',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData
        }).then((res) => {
            $('#candidateQuestionsHock').html('')
            var data = res.data.data
            if(!data){
                $('#candidateQuestionsHock').html("没有搜索的相关答案")
                return
            }
            for (var i = 0; i < data.length; i++) {
                var $question = '<div class="itemQuestionHock" data-item="'+data[i]+'" style="margin:10px 0;padding:10px;box-shadow: 0 0 4px 1px rgba(0,0,0,0.1)">' + (i + 1) + ': ' + data[i] + '</div>';
                $('#candidateQuestionsHock').append($question)
            }
            // console.log(res)
        })

    }
})();