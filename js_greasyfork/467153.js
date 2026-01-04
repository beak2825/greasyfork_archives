// ==UserScript==
// @name         scifinder2.2
// @namespace    https://origin-scifinder.cas.org
// @version      2.2
// @description  extract hxinfo from scifinder
// @author       zhaomeng
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @resource customCSS https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require      https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467153/scifinder22.user.js
// @updateURL https://update.greasyfork.org/scripts/467153/scifinder22.meta.js
// ==/UserScript==

(function() {
    'use strict';
     /*将以下的js脚本注入浏览器页面,实现页面元素点选,获取页面的css*/
    /* globals jQuery, $, waitForKeyElements */
    var css =GM_getResourceText("customCSS");
    GM_addStyle(css);
     /*创建页面的按钮*/
    var modal = '<div class="modal fade in" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content" style="width:800px;"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">Scifinder数据</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary">提交数据</button></div></div><!-- /.modal-content --> </div><!-- /.modal --></div>'
    $("body").append(modal)
    $('body').append('<div id="draggable" style="position: absolute;cursor: move;;left: 0;top: 250px;width:209px;background-color:white;padding-top:30px;margin:20px;"> <button type="button"  style="background-color:#da4f49;color:white;height: 45px;padding: 6px;" id="kj_selected">查看DOI的文献及物质</button><button type="button" style="background-color:#da4f49;color:white;height: 45px;padding: 6px;" id="kj_selected1">查看Scifinder-n基本信息</button><button type="button" style="background-color:#da4f49;color:white;height: 45px;padding: 6px;" id="kj_selected2">查看Scifinder-n合成路线及文献</button></div></iframe>')

    //获取需要拖动的元素
    var draggableElement = document.getElementById("draggable");

    //记录拖动状态的变量
    var isDragging = false;

    //记录鼠标位置和元素位置的变量
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    //添加鼠标按下事件监听器
    draggableElement.addEventListener("mousedown", dragStart);

    //添加鼠标移动事件监听器
    draggableElement.addEventListener("mousemove", drag);

    //添加鼠标释放事件监听器
    draggableElement.addEventListener("mouseup", dragEnd);

    //添加鼠标离开事件监听器
    draggableElement.addEventListener("mouseleave", dragEnd);

    //鼠标按下时触发
    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === draggableElement) {
            isDragging = true;
        }
    }

    //鼠标移动时触发
    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, draggableElement);
        }
    }

    //鼠标释放时触发
    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }

    //设置元素位置的函数
    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }


    /*获取选中的节点的文本信息*/
    $('#kj_selected').on("click",function(event){
        $("div.modal-body").html('')
        var list=[]
        $('.substanceRN>a:nth-child(1)').each(function(){

         var cas = $(this).text()
         list.push(cas)
        })

        var list1=[]
        $('ol.citation li a:nth-child(1)').each(function(){

            var citiation = $(this).text()
            list1.push(citiation)
        })
        var doi = $('li.breadcrumb:nth-child(1)>span.label').text()
        var item={
           casno:list,
           citiations:list1,
           doi:doi
        }

       console.log(item)
        if(item.casno && item.citiations&& item.doi){
           console.log(item)
           var ff = '<dl><dt>DOI:</dt><dd>'+item.doi+'</dd><dt>CASNO:</dt><dd>'+list.join("<br>")+'</dd><dt>Citiations:</dt><dd>'+list1.join("<br>")+'</dd></dl>'

           $("div.modal-body").html(ff)
           $('#myModal').modal("show")
        }else{
             alert("确认是否为文献页面！")
        }

    })

    /*scifinder-n基本信息*/
    $('#kj_selected1').on("click",function(event){
        $("div.modal-body").html('')
        var list=[]
        $('ul.list-unstyled.list-striped li span').each(function(){
            var name = $(this).text()
            list.push(name)
        })

        var enname = $('.substance-name.ng-star-inserted').text()
        var result_cas = $('span>mark').text().trim()
        var casno = $('title').text()
        var item={
           casno:casno,
           ename: enname,
           result_cas:result_cas,
           enbm:list,
        }

       console.log(item)
        if(item.casno && item.result_cas && item.ename){
           console.log(item)
           var ff = '<dl><dt>搜索CasNo:</dt><dd>'+item.casno+'</dd><dt>英文名:</dt><dd>'+item.ename+'</dd><dt>结果CasNo:</dt><dd>'+item.result_cas+'</dd><dt>别名:</dt><dd>'+list.join("<br>")+'</dd></dl>'

           $("div.modal-body").html(ff)
           $('#myModal').modal("show")

        }else{
            alert("确认是否为基本信息页面！")
        }

    })

    /*合成路线及文献*/
    $('#kj_selected2').on("click",function(event){
        $("div.modal-body").html('')
        $('.dropdown-menu').remove()
        var list=[]
        var casno =$(".toolbar-title span[class]:last-child").text()
        $('sf-reaction-result-page .reaction-result-answers').each(function(index){
            var authors = $("span.authors-text",this).text().trim()
            var title = $('h4>a',this).text().trim()
            var breif=$(".bibliography",this).text().trim()
            var cas_start=[]
            $('.reaction-tile-reactant .rn-no-image.ng-star-inserted',this).each(function(){
                cas_start.push($(this).text().trim())
            })
            $('.reaction-tile-reactant img',this).each(function(){
                var cas = $(this).attr("alt").trim()
                cas_start.push(cas)
            })
            var cas_end=[]
            $('.reaction-tile-product .rn-no-image.ng-star-inserted',this).each(function(){
                cas_end.push($(this).text().trim())
            })
            $('.reaction-tile-product img',this).each(function(){

                var cas = $(this).attr("alt")
                cas_end.push(cas)
            })
            var relate=[]
            $('.summary-steps.ng-star-inserted div.summary-step.ng-star-inserted',this).each(function(){
                $('div.summary-stage.ng-star-inserted',this).each(function(){
                    var step=$(this).text().trim()
                    relate.push(step)
                })

            })
            var rate = $('.yield-value',this).text()
            var item={title:title,authors:authors,breif:breif,cas_start:cas_start,cas_end:cas_end,relate:relate,rate:rate,casno:casno}
            list.push(item)
        })
        if(list.length>0){
            console.log(list)
            var content=''
            for(var j=0;j<list.length;j++){
                var ff = '<dl><dt>'+(j+1)+'.标题:</dt><dd>'+list[j].title+'</dd><dt>作者:</dt><dd>'+list[j].authors+'</dd><dt>简介:</dt><dd>'+list[j].breif+'</dd><dt>合成路线:</dt><dd>'+list[j].cas_start.join("+")+'->'+list[j].cas_end.join("+")+'</dd><dt>产率:</dt><dd>'+list[j].rate+'</dd><dt>实验步骤:</dt><dd>'+list[j].relate.join('<br>').trim()+'</dd></dl><br>'
                content+=ff
            }
            $("div.modal-body").html('<dt>CasNo:</dt><dd>'+list[0].casno+'</dd> <br>'+content)
            $('#myModal').modal("show")
        }else{
            alert("确认是否为合成路线页面！")
        }

    })
    // Your code here...
})();