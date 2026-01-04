// ==UserScript==
// @name         uom
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  uom.
// @author       You
// @match        https://uom.caac.gov.cn/
// @include      https://uom.caac.gov.cn/*
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @resource     LayuiCss          https://unpkg.com/layui@2.9.7/dist/css/layui.css
// @require      https://cdn.bootcdn.net/ajax/libs/layui/2.8.4/layui.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/493482/uom.user.js
// @updateURL https://update.greasyfork.org/scripts/493482/uom.meta.js
// ==/UserScript==

(function() {

    if (window.self !== window.top ) {

        // 创建一个观察者对象
        const observer = new MutationObserver(function(mutationsList, observer) {
            // 若`div`内容变化，会进入这里
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('节点内容变了')
                    if( $('.mb8').text() == '无人驾驶航空器飞行活动申请' && $('.el-radio-group input').attr('disabled')=="disabled" ){
                        index()
                    }else if($('.el-form-item__label:eq(0)').text() == "申请日期"){
                        var set$2 = setInterval(function(){
                            if( $('div[data-v-3807274c]:not([data-v-03fd8336]) .el-table__body tr')[0]!=null){
                                stopSet2()
                                $('div[data-v-3807274c]:not([data-v-03fd8336]) .el-table__body tr').each(function(){
                                    if( $(this).find('td:eq(4)').find('span[data-v-298a5496]').text()!=='批准'){
                                        $(this).find('td:eq(4)').addClass('greenCell').removeClass('redCell').find('span[data-v-298a5496]').text('批准')
                                        $(this).find('td:last() button:eq(0)').after('<a href="javascript" class="link-type"><button type="button" class="el-button el-button--text el-button--mini"><!----><i class="el-icon-document"></i><span> 起飞确认 </span></button></a>')
                                    }
                                })
                            }
                        },100);
                        function stopSet2(){ clearInterval(set$2); };
                    }else{
                        $('#MyUomPi').css('display', 'none')
                    }
                }
            }
        });
        var targetNode
        var set$ = setInterval(function(){
            // 选择目标节点
            targetNode = $('.app-main[data-v-3807274c]')[0];
            if($('.el-form-item__label:eq(0)').text() == "申请日期"){

                var set$1 = setInterval(function(){
                    if( $('div[data-v-3807274c]:not([data-v-03fd8336]) .el-table__body tr')[0]!=null){
                        stopSet1()
                        $('div[data-v-3807274c]:not([data-v-03fd8336]) .el-table__body tr').each(function(){
                            if( $(this).find('td:eq(4)').find('span[data-v-298a5496]').text()!=='批准'){
                                $(this).find('td:eq(4)').addClass('greenCell').removeClass('redCell').find('span[data-v-298a5496]').text('批准')
                                $(this).find('td:last() button:eq(0)').after('<a href="javascript:void(0);" class="link-type"><button type="button" class="el-button el-button--text el-button--mini"><!----><i class="el-icon-document"></i><span> 起飞确认 </span></button></a>')
                            }
                        })
                    }
                },100);
                function stopSet1(){ clearInterval(set$1); };


             }
            if( targetNode !=null){
                stopSet()
                //console.log(targetNode )
                // 观察者的配置（观察目标节点的子节点的变化）
                const config = { attributes: false, childList: true, subtree: false };
                // 传入目标节点和观察选项并开始观察
                observer.observe(targetNode, config);
            }

        },100);
        function stopSet(){ clearInterval(set$); };

        function index(){
            // console.log("当前页面位于iframe子页面");
            var message = true ; // 要传递的消息
            window.parent.postMessage(message, "*"); // *表示任意源都能收到消息
            if( $('#MyUomPi')[0]!=null ){
                $('#MyUomPi').css('display', 'block')
            }else{
                GM_addStyle( GM_getResourceText("LayuiCss").toString()
                            .replace(/([^.@-]+{[^}]*}\s*)*/im , '')
                            .replaceAll(/@font-face\s*\{\s*font-family:\s*layui-icon;[^}]*}/img,
                                        "@font-face { "+
                                        "font-family: layui-icon; "+
                                        "src: url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.eot); "+
                                        "src: url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.eot) format('embedded-opentype'),"+
                                        "     url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.woff2) format('woff2'),"+
                                        "     url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.woff) format('woff'),"+
                                        "     url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.ttf) format('truetype'),"+
                                        "     url(https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/font/iconfont.svg) format('svg')}") );
                var active = false;
                var currentX ,currentY ;
                $("body").append(["<div id='MyUomPi' style='width: 30px;height: 30px;color: black;background-color:rgb(149, 228, 246);position: fixed;top:"+ GM_getValue("top",'1px') + ";left: "+ GM_getValue("left", '1px')+"right: "+ GM_getValue("right", 'auto')+";z-index: 1000009999999999999;font-size: 20px;line-height: 30px;text-align: center;cursor: pointer;border-radius: 30px;'>" +
                                  "   <div style='-webkit-user-select: none!important;   -moz-user-select: none!important;  -ms-user-select: none!important; user-select: none!important; width: 30px!important;height: 30px!important;line-height: 30px!important;font-size: 20px !important;font-family: Helvetica!important;'>批</div>"+
                                  "</div>"][0])
                    .append('<div id="NonePi"  style=" display: none;position: fixed;align-items: center; justify-content: center;z-index: 214748364; height: 33%; width: 100%; top: 67%; background: linear-gradient(to top, #919191, #ffffff);text-align: center;">'+
                            '    <div style=" height: 70px; width: 240px;  background-color: #ec9f9f8f;  color: red; border-radius: 4px;font-family: &quot;Times New Roman&quot;, Georgia, serif !important;font-size: 21px;">拖到此处隐藏图标<br>（刷新重置）</div>'+
                            '</div>')

                $('#MyUomPi').on('mousedown', function(e) {
                    active = true;
                    currentX= $(this).css('left')
                    currentY= $(this).css('top')
                    $('body :not(body)').css('user-select','none')
                }).on( 'touchstart',function (x) {
                    active = true;
                    currentX= $(this).css('left')
                    currentY= $(this).css('top')
                    $('body :not(body)').css('user-select','none')
                }).on('mouseup', function() {
                    $('body :not(body)').css('user-select','auto')
                    active = false;
                    if( currentX== $(this).css('left')&& currentY== $(this).css('top') ){
                        MyUomPi()
                    }else{
                        $(this).css('transform', 'scale(1)')
                        // 页面的大小信息
                        var docWidth = document.documentElement.scrollWidth;
                        var docHeight = document.documentElement.scrollHeight
                        // 隐藏块的位置信息
                        var element = $('#NonePi div')[0];
                        var rect = element.getBoundingClientRect();
                        var left = $(this).css('left').replace("px",'')
                        var top = $(this).css('top').replace("px",'')
                        var right;
                        left = parseInt(left);top = parseInt(top);
                        if( (top+15 >= rect.top && top <= rect.bottom )&&( left+15 >= rect.left && left <= rect.right ) ){
                            console.log('隐藏')
                            $(this).css('display', 'none')
                        }
                        $('#NonePi').css('display','none')
                        if( left < docWidth/2 ){
                            left = '1px'; right = "auto"
                        }else{
                            left = 'auto'; right = '1px'
                        }
                        $(this).css('left', left).css('right',right)
                        GM_setValue("top",  top+'px');
                        GM_setValue("left", left);
                        GM_setValue("right",right);
                    }
                }).on( 'touchend touchcancel',function (x) {
                    $('body :not(body)').css('user-select','auto')
                    active = false;
                    if( currentX== $(this).css('left')&& currentY== $(this).css('top') ){
                        MyUomPi()
                    }else{
                        $(this).css('transform', 'scale(1)')
                        // 页面的大小信息
                        var docWidth = document.documentElement.scrollWidth;
                        var docHeight = document.documentElement.scrollHeight
                        // 隐藏块的位置信息
                        var element = $('#NonePi div')[0];
                        var rect = element.getBoundingClientRect();
                        var left = $(this).css('left').replace("px",'')
                        var top = $(this).css('top').replace("px",'')
                        var right;
                        left = parseInt(left);top = parseInt(top);
                        if( (top+15 >= rect.top && top <= rect.bottom )&&( left+15 >= rect.left && left <= rect.right ) ){
                            console.log('隐藏')
                            $(this).css('display', 'none')
                        }
                        $('#NonePi').css('display','none')
                        if( left < docWidth/2 ){
                            left = '1px'; right = "auto"
                        }else{
                            left = 'auto'; right = '1px'
                        }
                        $(this).css('left', left).css('right',right)
                        GM_setValue("top",  top+'px');
                        GM_setValue("left", left);
                        GM_setValue("right",right);
                    }
                }).on( 'mouseleave',function (x) {
                    var docWidth = document.documentElement.scrollWidth;
                    var docHeight = document.documentElement.scrollHeight
                    var left = $(this).css('left').replace("px",'')
                    var top = $(this).css('top').replace("px",'')
                    var right;
                    left = parseInt(left);top = parseInt(top);
                    if( left <10 || left > docWidth-70 || top <10 || top> docHeight-70 ){
                        active = false;
                        $('#NonePi').css('display','none')
                        $(this).css('transform', 'scale(1)')
                        $('#NonePi').css('display','none')
                        if( left < docWidth/2 ){
                            left = '1px'; right = "auto"
                        }else{
                            left = 'auto'; right = '1px'
                        }
                        $(this).css('left', left).css('right',right)
                        GM_setValue("top", top+'px');
                        GM_setValue("left", left);
                        GM_setValue("right",right);
                    }
                })
                $('body').on('mousemove', function(event) {
                    var x = event.pageX, y = event.pageY
                    if (active) {
                        $('#NonePi').css('display','flex')
                        x = x>30 ? x-30 :x;
                        y = y>30 ? y-30 :y
                        $('#MyUomPi').css('transform', 'scale(2)').css('left',x + 'px').css('top' , y + 'px').css('right','auto')
                    }
                })[0].addEventListener( 'touchmove', function(event) {
                    //console.log(event)
                    //var x = event.originalEvent.touches[0].pageX, y = event.originalEvent.touches[0].pageY 用于.on 绑定事件
                    var x = event.touches[0].pageX, y = event.touches[0].pageY
                    //if (Math.abs(distanceX) > 10 || Math.abs(distanceY) > 10) {
                    if (active) {
                        // 阻止页面滚动
                        event.preventDefault();
                        $('#NonePi').css('display','flex')
                        x = x>30 ? x-30 :x;
                        y = y>30 ? y-30 :y
                        $('#MyUomPi').css('transform', 'scale(2)').css('left',x + 'px').css('top' , y + 'px').css('right','auto')
                    }
                    //}
                },{ passive: false } )
                var MakeMenu =function(){
                    var menu = GM_registerMenuCommand( '显示‘批’图标' , function() {
                        $('#MyUomPi').css('display', 'block')
                        GM_unregisterMenuCommand(menu);
                        menu = GM_registerMenuCommand( '隐藏‘批’图标' , function() {
                            $('#MyUomPi').css('display', 'none')
                            GM_unregisterMenuCommand(menu);
                            MakeMenu()
                        })
                    })
                    return menu;
                }
                MakeMenu()
                var MyUomPi = function(){
                    if( $('.mb8').text() == '无人驾驶航空器飞行活动申请' && $('.el-radio-group input').attr('disabled')=="disabled" ){

                        // console.log(  $('.el-input.is-disabled .el-input__inner') )//.removeAttr('disabled').css({'cursor':'text','color': 'black', 'background-color':'white', })
                        GM_addStyle( '#layer_id_1 .layui-form-label  { width: 180px;!important;}')
                        var form =
                            '<div class="layui-form-item" id="ID-laydate-rangeLinked"> '+
                            '  <div > '+
                            '    <label class="layui-form-label">预计开始时间</label> '+
                            '    <div class="layui-input-inline"> '+
                            '      <input type="text" class="layui-input" id="ID-laydate-start-date-1" value="'+$('.ivu-date-picker-rel:eq(0) input').val()+'"  placeholder="'+$('.ivu-date-picker-rel:eq(0) input').val()+'" > '+
                            '    </div> '+
                            '  </div> '+
                            '  <div > '+
                            '    <label class="layui-form-label"> 预计结束时间</label> '+
                            '    <div class="layui-input-inline"> '+
                            '      <input type="text" class="layui-input" id="ID-laydate-end-date-1"  value="'+$('.ivu-date-picker-rel:eq(1) input').val()+'"  placeholder="'+$('.ivu-date-picker-rel:eq(1) input').val()+'"> '+
                            '    </div> '+
                            '  </div> '+
                            '</div> '+
                            '<div class="layui-form-item"> '+
                            '  <div class="layui-inline"> '+
                            '    <label class="layui-form-label">最大飞行高度</label> '+
                            '    <div class="layui-input-inline" style="width: 70px;"> '+
                            '      <input type="number" name="price_min" id="ID-number-1" placeholder="'+$('.el-input.is-disabled .el-input__inner:last()').val()+'" value="'+$('.el-input.is-disabled .el-input__inner:last()').val()+'" autocomplete="off" class="layui-input" min="0" step="1" lay-affix="number"> '+
                            '    </div> '+
                            '    <label class="layui-form-label" style="width: 30px;">米</label> '+
                            '  </div>  '+
                            '</div>  '

                        var conf1 = {
                            formType: 0,
                            id: 'id_1',
                            hideOnClose: true, //关闭隐藏
                            title: "信息修改",
                            shadeClose: true,  //点击遮罩关闭
                            fixed: true,  //层固定，不随页面滚动
                            maxmin: true, //最大小化
                            resize: true, //拉伸
                            move: '.layui-layer-title', // 是否允许拖动
                            moveOut: false, //是否允许拖拽到窗口外
                            offset: '100px',  // 垂直位置
                            btn: ['提交信息','修改其他信息'],
                            area: 'auto',
                            content: "<div id='layer_id_1' >"+form+ "</div>"
                            ,success: function(layero, index){
                                layui.use(function(){
                                    var laydate = layui.laydate;
                                    laydate.render({
                                        elem: '#ID-laydate-rangeLinked',
                                        type: 'datetime',
                                        range: ['#ID-laydate-start-date-1', '#ID-laydate-end-date-1'],
                                        rangeLinked: true, // 开启日期范围选择时的区间联动标注模式 ---  2.8+ 新增
                                        fullPanel: true, // 2.8+
                                        format: 'yyyy-MM-dd HH:mm',
                                        min: 0,
                                        max: 7
                                    });
                                })
                            }
                            ,yes: function(index, layero){
                                var time_start = $('#ID-laydate-start-date-1').val()
                                var time_end = $('#ID-laydate-end-date-1').val()
                                var height = $("#ID-number-1").val()
                                layer.close(index)
                                if($('.form_title[data-v-804ba952]:first()').text().trim()!="飞行申请审批信息"){
                                    $('.form_title[data-v-804ba952]:first()').before('<div data-v-804ba952=""><div data-v-804ba952="" class="el-row"><span data-v-804ba952="" class="form_title">飞行申请审批信息</span></div><div data-v-804ba952="" class="el-divider el-divider--horizontal"><!----></div><div data-v-804ba952="" class="fromDiv"><div data-v-804ba952="" class="el-form-item el-form-item--medium"><label class="el-form-item__label" style="width: 150px;">审批状态</label><div class="el-form-item__content" style="margin-left: 150px;"><div data-v-804ba952="" class="el-select el-select--medium"><!----><div class="el-input el-input--medium is-disabled el-input--suffix"><!----><input type="text" disabled="disabled" readonly="readonly" autocomplete="off" placeholder="请选择状态" class="el-input__inner"><!----><span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-select__caret el-input__icon el-icon-arrow-up"></i><!----><!----><!----><!----><!----></span><!----></span><!----><!----></div><div class="el-select-dropdown el-popper" style="display: none; min-width: 343.837px;"><div class="el-scrollbar" style=""><div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;"><ul class="el-scrollbar__view el-select-dropdown__list"><!----><li data-v-804ba952="" class="el-select-dropdown__item"><span>审批中</span></li><li data-v-804ba952="" class="el-select-dropdown__item"><span>编辑</span></li><li data-v-804ba952="" class="el-select-dropdown__item"><span>不予受理</span></li><li data-v-804ba952="" class="el-select-dropdown__item"><span>批准</span></li><li data-v-804ba952="" class="el-select-dropdown__item selected"><span>不予批准</span></li></ul></div><div class="el-scrollbar__bar is-horizontal"><div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div></div><div class="el-scrollbar__bar is-vertical"><div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div></div></div><!----></div></div><!----></div></div><div data-v-804ba952="" class="el-form-item el-form-item--medium"><label class="el-form-item__label" style="width: 150px;">审批意见</label><div class="el-form-item__content" style="margin-left: 150px;"><div data-v-804ba952="" class="el-textarea el-input--medium is-disabled"><textarea disabled="disabled" autocomplete="off" class="el-textarea__inner" style="min-height: 33.2222px;"></textarea><!----></div><!----></div></div></div></div>')
                                }
                                $('.ivu-date-picker-rel:eq(0) input').val(time_start)
                                $('.ivu-date-picker-rel:eq(1) input').val(time_end)
                                $('.el-input.is-disabled .el-input__inner:last()').val(height)
                                $('.el-input.is-disabled .el-input__inner:eq(0)').val('批准')
                                $('.el-textarea.is-disabled .el-textarea__inner:eq(0)').val('')
                                $('.el-textarea.is-disabled .el-textarea__inner').attr('disabled','disabled').css({'cursor':'not-allowed','color':'#c0c4cc', 'background-color':'#f5f7fa' })
                                layer.msg("待截图")


                                'uom截图（'+time_start+' - '+time_end+'）.png'
                            }
                            ,btn2: function(index, layero, that){
                                $('.el-textarea.is-disabled .el-textarea__inner').removeAttr('disabled').css({'cursor':'text','color': 'black', 'background-color':'white', })
                                layer.close(index)
                                layer.msg("修改完成后使用刚才的菜单进行提交")
                            }
                        }
                        layer.open(conf1)
                        return
                    }else{
                        layer.msg("目前不是飞行申请审批信息页面")
                    }
                }
                }
        }

    }else{
        window.onmessage = function(event){
            var str = event.data
            if (window.self == window.top && (str==true||str=="true") ) {
                var w = document.documentElement.clientWidth
                var rect = $('#app').css('width').replace("px",'')
                //console.log(w,rect)
                //$('#app').css('transform', 'scale('+(w/rect - 0.005) +')').css('height', '2078px').css('overflow', 'auto;').find('.main-body').css('height', '2078px').css('overflow', 'auto;')
                //GM_addStyle( ' body, html, #app {height: 100%;  overflow: auto;}')
            }
        }
    }
})();