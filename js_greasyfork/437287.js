// ==UserScript==
// @name         swagger-quick
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  先搜索服务，也可以搜索当前服务下的api路径；复制api路径和小驼峰函数名
// @author       hoyche
// @license      MIT
// @include      /.*\/swagger-ui\.html.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437287/swagger-quick.user.js
// @updateURL https://update.greasyfork.org/scripts/437287/swagger-quick.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        let timer = setInterval(()=>{
            if ($("#select_baseUrl option").length === 0) return;
            clearTimeout(timer);
            // 创建左侧控制台
            const ctrl = $(`<div class="ctrl-wrap" style="position:fixed;left:0;top:100px;z-index:1;background-color: #fff;"><input type="text" placeholder="服务搜索" id="serviceIpt"/><div class="service-lists" style="margin-bottom: 30px;"></div><input type="text" placeholder="当前服务api搜索" id="apiIpt"><div class="api-lists">`);
            $("body").append(ctrl);
            // 获取所有api路径列表
            var observerOptions = {
                childList: true,  // 观察目标子节点的变化，是否有添加或者删除
            }
            var observer = new MutationObserver(getApiOps);
            observer.observe($('#swagger-ui-container')[0], observerOptions);
            // 复制api路径和小驼峰函数名
            $('#swagger-ui-container').on('mouseenter','.operations>.operation',function(e){
                var apiEl = $(`<span style="color: red">复制api路径</span>`);
                var fnEl = $(`<span style="color: red;margin-left: 5px;">复制小驼峰函数名</span>`);
                let text = $('.path',e.currentTarget).text().replace(/[\n\s]/g,'');
                const url = $('#select_baseUrl').val().match(/\.com(\/[^/]+)/)[1] + text;
                apiEl.click(function(){
                    copyContentH5(url)
                })
                fnEl.click(function(){
                    copyContentH5(text.replace(/\/api\//,'').replace(/\/[^/]/g, function(s) {return s.slice(1).toUpperCase()}))
                })
                $('.heading>h3',e.currentTarget).append([apiEl,fnEl]);
            }).on('mouseleave','.operations>.operation',function(e){
                $('.heading>h3>.path',e.currentTarget).nextAll().remove();
            })
            // 服务列表
            let serviceOps = [];
            $("#select_baseUrl option").each(function(){
                serviceOps.push($(this).text());
            })
            // api路径列表
            let apiOps = [];
            // 输入服务过滤
            $("#serviceIpt").keyup(function() {
                let split = this.value.split(/\s+/);
                let res = new Set();
                for (let i = 0; split[i]; i++) {
                    for (let j = 0; serviceOps[j]; j++) {
                        if (~serviceOps[j].search(new RegExp(split[i]),'i')){
                            res.add(serviceOps[j])
                        }
                    }
                }
                $(".service-lists").html(batHtml(res))
            })
            $(".service-lists").on('click','div',function(e){
                let url = $(e.currentTarget).text().match(/\((.+?)\)/)[1];
                $(`#select_baseUrl,#input_baseUrl`).val(url);
                $("#serviceIpt").val("");
                $(".service-lists").html("");
                swaggerUi.headerView.trigger("update-swagger-ui", {
                    url: $("#input_baseUrl").val()
                })
            })
            // 输入api路径过滤
            $("#apiIpt").keyup(function() {
                let split = this.value.split(/\s+/);
                let res = new Set();
                for (let i = 0; split[i]; i++) {
                    for (let j = 0; apiOps[j]; j++) {
                        if (~apiOps[j].search(new RegExp(split[i],'i'))) {
                            res.add(apiOps[j])
                        }
                    }
                }
                $(".api-lists").html(batHtml(res))
            })
            $(".api-lists").on('click','div',function(e){
                let url = $(e.currentTarget).text();
                let el = $(`.heading .path a.toggleOperation:contains('${url}'):first`);
                let elAni = el.closest('.heading');
                $("#apiIpt").val("");
                $(".api-lists").html("");
                el.closest('ul.endpoints').show();
                scrollTo(0,el.offset().top);
                //elAni.animate({backgroundColor: 'red'},function(){
                //    elAni.animate({backgroundColor: 'transparent'})
                //});
                elAni.css({backgroundColor: 'red'});
                setTimeout(function(){
                    elAni.css({backgroundColor: 'transparent'})
                },2000);
            })
            function batHtml(list) {
                let h = ''
                list.forEach(v => {
                    h += `<div>${v}</div>`
                })
                return h
            }
            function getApiOps() {
                let set = new Set()
                $(`.heading .path a.toggleOperation`).each(function() {
                    set.add($(this).text())
                });
                apiOps = [...set];
                // console.log(apiOps)
            }
            //h5复制文本到剪切板
            function copyContentH5(content) {
                var copyDom = document.createElement('div');
                copyDom.innerText=content;
                copyDom.style.position='absolute';
                copyDom.style.top='0px';
                copyDom.style.right='-9999px';
                document.body.appendChild(copyDom);
                //创建选中范围
                var range = document.createRange();
                range.selectNode(copyDom);
                //移除剪切板中内容
                window.getSelection().removeAllRanges();
                //添加新的内容到剪切板
                window.getSelection().addRange(range);
                //复制
                var successful = document.execCommand('copy');
                copyDom.parentNode.removeChild(copyDom);
            }
        },200)
    })

    // Your code here...
})();