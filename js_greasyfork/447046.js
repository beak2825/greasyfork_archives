// ==UserScript==
// @name         题库数据采集脚本
// @namespace 	 joyber
// @version      1.0.20
// @description  此脚本仅作学习交流使用，请匆用作商业用途，使用此脚本发生的一切后果与开发者本人无关。
// @author       joyber
// @icon         data:image/png;base64,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
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        https://www.xuetian.cn/*
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/447046/%E9%A2%98%E5%BA%93%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/447046/%E9%A2%98%E5%BA%93%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
$(function(){
    console.log('start')
    var questionCount = 0;
    var question = [], urls = [], urlCount = 0, urlIdx = 0;
    var i = 0, timer, $dom, postUrl, postUrl2;

    postUrl = "//tiku.qqvbc.com/api/push/question"; //此地址需要允许跨域POST收接数据
    postUrl2 = "//tiku.qqvbc.com/api/push/urls"; //此地址需要允许跨域POST收接数据

    function getQuestion() {
        $(".look-answer").trigger('click')
        setTimeout(function (){
            $dom.text('当前采集第'+(i+1)+'个问题')
            var item = $("#qbank-body .carousel-question-item").eq(i)
            var childTitle = ''
            if (item.find('.child-block .q-title').length>0) {
                if (item.find('.child-block .q-type').length > 0)
                    childTitle += '<p>'+item.find('.child-block .q-type').text() + '</p>'
                childTitle += item.find('.child-block .q-title').html()
            }

            var options = [], answer = {}, _item = {
                index: i+1,
                type: item.find('.title-block .q-type').text(),
                title: item.find('.title-block .q-title').html() + childTitle,
                level: item.find('[aria-valuenow]').attr('aria-valuenow'),
            };
            item.find(".options-block ul li").each(function () {
                options.push({
                    mark: $(this).find('.mark').text(),
                    content: $(this).find('.content').html(),
                })
            })
            answer.rightAnswer = item.find(".answer-container .right-answer span").text()
            answer.zhishidian = [];
            answer.explain = item.find('.analysis-body').html()
            item.find(".zsd-item ul li").each(function () {
                answer.zhishidian.push({
                    text: $(this).text(),
                    bk: $(this).find('.bk').text()
                })
            })
            _item.options = options
            _item.answer = answer
            question.push(_item)

            $(".next.fr").trigger('click')
            i++;
        }, 300)
    }

    async function postQuestion(d, i) {
        return new Promise((resolve,reject) => {
            $.post(postUrl, d, function (res) {
                resolve(res)
            }, 'json')
        })
    }

    async function doneQuestion() {
        $dom.text('采集完成，正在推送数据到接口')
        console.log('caiji done')
        console.log(question)
        if (!postUrl) return $dom.text('采集完成，无需提交数据')
        let i = 0;
        while (true) {
            //避免数据过长，这里分页发送数据
            let _data = question.splice(0, 50);
            if (_data.length == 0) break;
            var d = {
                title: $(".layout-title .subtitle").text(),
                url: location.href,
                data: _data
            }
            await postQuestion(d).then(res=>{
                i++;
                if (res.status == 0) $dom.text('采集完成，' + res.message + i)
                else $dom.text('采集完成，推送失败：' + res.message + i)
            })
        }

    }

    function startCaiji() {
        i=0
        timer = setInterval(function () {
            if (i >= questionCount) {
                clearInterval(timer)
                doneQuestion()
                return;
            }
            getQuestion()
        }, 500)
    }

    function getSectionUrl(idx) {
        $(".xt-cell.chapter-info_cell.xt-cell_borderless").trigger('click')
        var $target = $(".section-list .section-item")
        $target.eq(idx).trigger('click')
        setTimeout(function () {
            var obj = {
                title: $(".layout-title .subtitle").text(),
                url: location.href,
            }
            urls.push(obj)
            setTimeout(function () {
                $(".sidebar-action-block .action-item:eq(0)").trigger('click')
            }, 100)
        }, 1000)
    }

    function showUrls() {
        var $dom2 = $('<div style="line-height: 30px; background-color: #fff; padding: 20px;"></div>')
        for (let j = 0; j < urls.length; j++) {
            $dom2.append('<div>'+urls[j].url+'</div>')
        }
        $(".qbank-chapter-wrap").before($dom2)
    }

    function getUrlsDone() {
        document.title = '提取地址完成，正在提交数据'
        console.log('get urls done')
        console.log(urls)
        showUrls()
        if (!postUrl2) return (document.title ='提取地址完成，无需推送数据')
        var d = {
            subject: $(".breadcrumb.clearfix li:last").text(),
            class: $(".criteria-block.km-query .query-item.fl.active").text(),
            url: location.href,
            data: urls
        }
        $.post(postUrl2, d , function(res){
            if (res.status == 0) document.title = '提取地址完成，数据已推送'
            else document.title = '提取地址完成，推送失败：' + res.message
        }, 'json')
    }
    if (location.pathname == "/qbank/do/chapter" || location.pathname == "/qbank/do/practice" ) {
        $dom = $('<button type="button" class="el-button btn submit el-button--primary is-round"><span>开始采集</span></button>')
        $dom.click(function () {
            if ($(this).data('loading') == 1) return;
            $(this).data('loading', 1).text('采集中')
            questionCount = $("#qbank-body .carousel-question-item").length
            startCaiji();
        })
        setTimeout(function () {
            $(".layout-title").append($dom)
        }, 1000)
    } else if (/^\/qbank\/T\w+\/chapter$/.test(location.pathname)) {
        $dom = $('<button type="button" class="el-button btn submit el-button--primary is-round"><span>提取章节地址</span></button>')
        $dom.click(function () {
            urls = [], urlCount = 0
            $(".xt-cell.chapter-info_cell.xt-cell_borderless").trigger('click')
            setTimeout(function () {
                urlCount = $(".section-list .section-item").length
                timer = setInterval(function () {
                    if (urls.length >= urlCount) {
                        clearInterval(timer)
                        getUrlsDone()
                        return;
                    }
                    if ($(".section-list .section-item").length == 0) {
                        $(".xt-cell.chapter-info_cell.xt-cell_borderless").trigger('click')
                    }
                    setTimeout(function () {
                        getSectionUrl(urls.length)
                    }, 1000)
                }, 3000)
            }, 1000)
        })
        setTimeout(function () {
            $(".qbank-chapter-wrap").before($dom)
        }, 1000)
    }


})
