// ==UserScript==
// @name         arealme-spider
// @version      1.4
// @description  爬取测试题目和答案
// @author       Zero
// @match        *://www.arealme.com/*
// @require     https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @license             End-User License Agreement
// @grant       GM_setClipboard
// @namespace http://www.hechao.fun/
// @downloadURL https://update.greasyfork.org/scripts/465045/arealme-spider.user.js
// @updateURL https://update.greasyfork.org/scripts/465045/arealme-spider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadData(){
        const aaa = $('#splash');
        let test = {
            title: '', // 测试名称
            des: [], // 测试说明
            subtip: [], // 附加说明
            tag: '', // 标签
            data: [] // 题目信息
        };
        const test_q = $('#splash > .hint');
        test.title = test_q.children("h1").html();
        test_q.children("p").each((function(){
            const that = $(this);
            test.des.push(that.html());
        }))

        $('#tips_extra > .subtip').each((function(){
            const that = $(this);
            let t_s = {};
            that.children().each((function(){
                const _this = $(this);
                const n_name = _this.prop('nodeName');
                if(n_name === 'H3'){
                    t_s.t = _this.html();
                }else if(n_name === 'P'){
                    t_s.d = _this.html();
                    test.subtip.push(t_s);
                    t_s = {};
                }
            }))
        }));

        test.tag = $('#splash > .tag-wrap').children().first().text();

        const content = $("#question_details > li");
        let data = [];
        content.each((function(index,item) {
            const that = $(this);
            const question =  that.find(".c_t").html().replace(/S\-R\-A\-/gi, "");
            /**
            const base_url = 'data:image/svg+xml;base64,'+ window.btoa(unescape(encodeURIComponent(question)));
            console.log(base_url)
            const aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = base_url;
            aLink.download = `iq-2021-question-${index}.svg`;
            document.body.appendChild(aLink);
            aLink.click();
            console.log(aLink);
            document.body.removeChild(aLink);
            **/

            let obj = {
                q: {
                    c: question,
                    type: question.indexOf('svg') > -1 ? 0 : question.indexOf('audio') > -1 ? 2 : question.indexOf('<img') > -1 ? 3 : 1,
                    index
                },
                a: []
            }
            that.find(".c_v").each((function() {
                const text = $(this).html().replace(/S\-R\-A\-/gi, "");
                let obj_a = {
                    text,
                    value: $(this).attr("value"),
                }
                obj.a.push(obj_a);
                if(text.indexOf('<img') > -1) obj.q.type = 4;
            }))
            data.push(obj);

        }))
        test.data = data;

        console.log(JSON.stringify(test));

    };

    let download_btn = `
<div
style="
position: fixed;
bottom: 2px;
left: 2px;
z-index: 9999999999999999;
border: 1px solid #eeeeee;
background-color: #ffffff;
width: 260px;
min-height: 40px;
"
>

<button
id="zeroSpider"
style="
font-size: 14px;
padding: 6px 12px;
background-color: #21c6e4;
border: none;
border-radius: 5px;
cursor: pointer;
"
>爬取</button
>
</div>
`;
    $('body').append(download_btn);
    $('#zeroSpider').on('click',downloadData);
})();