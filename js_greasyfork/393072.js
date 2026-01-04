// ==UserScript==
// @name         processon 导出
// @namespace    https://www.yffjglcms.com/
// @version      0.1.20230301
// @description  支持脑图文本导出
// @author       yffjglcms
// @match  *://www.processon.com/*
// @grant        none
// @require      https://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/393072/processon%20%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/393072/processon%20%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

// Your code here...

(function () {
    $($('#outline-ifram')).load(()=>{
        console.log('ifreame done')

        const $if = $($("#outline-ifram")).contents()

        // 导航。两种页面不同的样式
        const $nav = $(".view-header-right")[0] ? $(".view-header-right") : $(window.parent.document).find('.file_head_right')
        // 是否为脑图
        const $mind_designer = $(".mind-designer")
        // 大纲

        // 大纲标题
        const $title = $("#root > div");
        const $content = $if.find("#outline-con")



        // 获取标题
        function getTitle() {
            return $title.html()
        }

        console.log(getTitle())

        addBtn();
        bindExport();

        // 是否为脑图
        function isMindView() {
            return !!($mind_designer[0])
        }

        // 添加导出按钮
        function addBtn() {
            if (isMindView()) {
                if(!$('#exportIt')[0]) // 避免重重创建按钮
                    $nav.prepend(`<button class="po-button button" id="exportIt">导出</button>`)
            } else {
                if(!$('#notSupportExportIt')[0]) // 避免重重创建按钮
                    $nav.prepend(`<button class="po-button button" id="notSupportExportIt" disable>非脑图，不支持导出</button>`)
            }
        }

        // 获取结果
        function getResult(){
          // debugger
           var cld = []
           var els = $content.children(".node-element.wider")
           for (let i = 0; i < els.length; i++) {
               cld.push(getContent(els[i]))
           }
            return {
                title: getTitle(),
                children: cld
            }
        }


        // 获取内容,param->node-element
        function getContent(node) {
            // debugger;
            if(!node) return null;
            var $node = $(node)
            var obj = {};
            var children = [];
            var title = $node.find(".node-self .node-title").html();

            if(title.endsWith('<br>')){
                  title = title.substring(0, title.length-4);
            }

            obj.title = title

            var $children = $node.children(".node-children").children(".node-element")
            if ($children.length > 0) {
                for (let i = 0; i < $children.length; i++) {
                    children.push(getContent($children[i]))
                }
                obj.children = children;
            }

            return obj;

        }

        // 导出
        function exportIt() {
            // 切换为大纲
            $(".item.abstract").click();

            var result = getResult();
            console.log(result)
            exportTxt(result)
        }

        // 绑定事件
        function bindExport(){
            $nav.on("click","#exportIt", exportIt)
        }

        // 导出json文件
        function exportJson(result){
             var blob = new Blob([JSON.stringify(result,"", "\t")], {type: "text/plain;charset=utf-8"});
             saveAs(blob, "mind.json");
        }

        /**导出txt文件 start*/
        var uSpan = "\t"
        var uLine = "\n"
        function getNode(json, span) {
            // debugger
            if (!json) return ""
            var txt = span + json.title + uLine;

            if (json.children) {
                for (let i = 0; i < json.children.length; i++) {
                    txt += getNode(json.children[i], span + uSpan)
                }
            }
            return txt;
        }

        function exportTxt(result){
             var blob = new Blob([getNode(result, "")], {type: "text/plain;charset=utf-8"});
             saveAs(blob, getTitle()+".txt");
        }
         /**导出txt文件 end*/
    })

   
})();