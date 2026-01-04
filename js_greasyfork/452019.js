// ==UserScript==
// @name         有趣插件
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  try to take over the world!
// @author       wufake
// @run-at       document-end
// @match        http://*/*
// @include      *
// @icon         https://https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.wp.com%2Foverdope.com%2Fwp-content%2Fuploads%2F2014%2F10%2F20141002050337_11.jpg%3Ffit%3D635%2C400&refer=http%3A%2F%2Fi0.wp.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664199223&t=0a7985bfe8a49e6c60553d9db6e55184
// @grant        unsafeWindow
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.0.js
// @license         GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/452019/%E6%9C%89%E8%B6%A3%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/452019/%E6%9C%89%E8%B6%A3%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==



(function main() {

    var $ = jQuery;
    var quesLibrary = window.localStorage.quesLibrary

    // 插入自定义结构的标签
    $('body').prepend("<div id='box1''><div id='btn'><sapn id='spn1'>小插件</sapn></div> <ul><li> <button id='btn1'>功能一</button></li><li> <button id='btn2'>功能二</button></li><li> <button id='btn3'>本地搜题</button></li><li> <button id='btn4'>更换题库</button></li></ul></div>")

    //设置上列元素相关的样式
    $('#box1').attr('style', 'position: fixed; z-index: 99990000; right: 100px; top: 100px;')
    $('#btn').attr('style', 'width: 40px; height:40px; color:red; background-color: cyan; border-radius: 50%; cursor: pointer; margin-bottom: 5px; text-align: center;')



    $('#box1>ul>li').css({
        'display': 'block'
    })
    //下拉框 按钮
    $('#box1>ul>li>button').css({
        'display': 'none',
        'width': '100px',
        'height': '40px',
        'background-color': 'white',
        'color': 'grey',
        'font-size': '20px',
        'marin-top': '5px',
        'margin-bottom': '5px',
        'cursor': 'pointer'
        //'opacity': '60%'
    })
    $('#btn4').css({
        'border-radius': '0 0 20% 20%'
    })



    // 按钮 下拉效果、拖动效果
    $('#btn').click(function () {

        if ($('#btn').get(0).style.width==='40px') {
            //alert($('#btn').get(0).style.width==='40px')
            //下拉
            $('#btn').css({ //
                'width': '100px',
                'height': '40px',
                'border-radius': '20% 20% 0 0'
            })

            $('#box1>ul>li>button').css({
                'display': 'block'
            })

            event.cancelBubble = true

        }else {
            //恢复
            $('#btn').css({
                'width': '40px',
                'height': '40px',
                'border-radius': '50%'})

            $('#box1>ul>li>button').css({
                'display': 'none'
            })

            event.cancelBubble = true

        }})


    // 拖动效果
    $('#box1').mousedown(function (event) {

        event.cancelBubble = true

        var ol = event.clientX - $('#box1').get(0).offsetLeft,
            ot = event.clientY - $('#box1').get(0).offsetTop,
            // 该参数 用于判断 鼠标是否移动
            param = 0

        $('html').mousemove(function (event) {

            param = 1

            //alert(ol)
            var X = event.clientX ,
                Y = event.clientY

            $('#box1').css({

                'left': X - ol,
                'top': Y - ot
            })
        })
        $('html').mouseup(function () {
            $(this).off('mousemove')
            $(this).off('mouseup')

            //alert(param)
            //判断移动事件 是否发生,
            if (param == 1) {
                if ($('#btn').get(0).style.width =='40px') {
                    $('#btn').css({ //
                        'width': '100px',
                        'height': '40px',
                        'border-radius': '20% 20% 0 0'
                    })

                    $('#box1>ul>li>button').css({
                        'display': 'block'
                    })


                }else {
                    $('#btn').css({
                        'width': '40px',
                        'height': '40px',
                        'border-radius': '50%'})

                    $('#box1>ul>li>button').css({
                        'display': 'none'
                    })



                }
            }
        })
    })



    //定义 几个通用变量，
    var param

    //插件的功能
    //btn1，字符串指令 eval函数
    $('#btn1').click(function () {

        eval(prompt('请输入指令:'))
    })



    //btn2 功能二,百度文库可视区域 转 PDF(默认情况下)
    // 各类文档的 参数
    // 刀客巴巴:                param = $('#pageContainer>*')
    // 豆丁:                    param = $('#contentcontainer>*')， doPrint(豆丁自定义打印函数)
    // 原创力文档:              param = $('.preview-bd>.webpreview-item img')
    // 思维文库网:              param = $('#pageContainer div>img')
    // 百度文库:                param = $('canvas')
    $('#btn2').click(function () {
        // 获取 canvas(画布)标签 元素，它存储 着 可视文档的所有数据
        // 判别式:... || ...  ,只要 第一个是错的 ，就赋值 给第二个。
        // jQuery 的 选择器 $()，也是 js对象
        var canvas_data = $('#original-creader-root *').get(0) || param

        //alert(canvas_data)


        if (canvas_data) { //null的类型 是object ，object的布尔值 是true，不能直接判断；undefind 的布尔值 为 false
            if (canvas_data !== param) {
                canvas_data = $('#original-creader-root *')

            }

            var self = $('#box1')

            // 移除 body标签的 所有元素，便于后面渲染 画布
            //$('body').remove()
            $('body').remove()
            // 在 html 元素的 最前面 重新渲染 画布
            console.log($('html').prepend(canvas_data))
            if(window.location.href.search('baidu') !== -1)
            {
                var w 		= $('html')[0].offsetWidth,
                    h 		= $('html')[0].offsetHeight, //文档的高度。
                    cavs 	= $('canvas'),
                    to_y	= h/cavs.length; // 每次 y方向移动 距离。

                // 渲染后的页面 直接打印pdf，不能获取到全部的 文档，百度通过js 操控 canvas标签，
                // 使得只有当前页面 可打印(其余 看不到的被影藏了),
                // 可以发现 百度 使用的是 id选择器 来操控 canvas标签
                // 这里我们 只要使用 for循环 来改变 canvas 的id 即可 全部打印(不过要模拟 页面滑动 才可获取 全部 文档的数据)。
                // 这里要使用 let 关键字 来声明 变量，因为 for循环 没有 局部作用域概念。
                for(let i=0; i<cavs.length; i++) setTimeout(function(){scroll(0,(i+1)*to_y,(cavs[i].width!=0? cavs[i].id=i:'')); },(i+1)*100);
            }

            console.log($('html').prepend(self))
            main()

            // 快捷键 Ctrl+P 打印
            /*setTimeout(function () {
                // 确定是否打印
                var result = confirm('是否打印?')
                if (result) {
                    print()
                }

            },3000)*/ // 稍微延迟一下

        }

    })




    // 功能三 学习通搜题
    $("button#btn3").click(()=>{
        if(typeof(quesLibrary)!="object"){
            console.log(quesLibrary)
            quesLibrary = quesLibrary.split("\n\n")
        }

        navigator.clipboard.readText().then(text => {

            // 对于大量的序列数据 for 效率远高于 forEach、map方法
            for(var i=0;i<quesLibrary.length;i++){
                if(quesLibrary[i].includes(text)){
                    alert(quesLibrary[i])
                    break
                }
            }
        });
    })

    // 快捷键搜题
    document.addEventListener('copy', (event) => {
        setTimeout(()=>{
            $("button#btn3").click()
        },200)
    });

    // 更换题库
    $("#btn4").click(()=>{

        var isImport = confirm("是否重剪贴板导入题库")
        if(!isImport) return
        navigator.clipboard.readText().then(content => {
            if (content && content.length >2000 ){
                window.localStorage.setItem("quesLibrary",content)
                quesLibrary = content
            }else{
                console.log("导入失败")
            }

        })

    })

})();














