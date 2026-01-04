{
 
    'use strict';
    // 如果想回滚版本，提高访问速度，请删除括号下面包裹的代码：【

    if (window.location.href.indexOf("cn.bing.com/search") > -1) {
        //config

        var picArr = new Array
      //var infoArr= new Array
     //   var notice = new Array
        //自行添加图片url，调用方法，输入数字下标即可 如输入：2
      /*
  $.ajax({
            url:"https://greasyfork.org/scripts/454062-bing-beautification-infoarr/code/Bing%20beautification%20infoArr.js",
            dataType:"text",
            type:"GET",
            async:"true",
            traditional:true,//防止深度序列化
            cache:false,
            async:false,
            success:function(data){
                infoArr=data
                infoArr=infoArr.replace(/\s/g,"");
                infoArr=infoArr.replace(/\[/g,"");
                infoArr=infoArr.replace(/\]/g,"");
                infoArr=infoArr.split(";")
                picArr=infoArr[0]
                picArr=picArr.split(",")
                notice=infoArr[2]
                if(infoArr[1]==="true"){
                    console.log(`\u516c\u544a:${notice}`)
                    if(infoArr[3]){
                        alert(`${infoArr[3]}`)
                    }
                }

                console.log("\u5df2\u7ecf\u6536\u5f55\u7684\u56fe\u7247\u6570\u7ec4:")
                console.log(picArr)
            },
            error:function(){alert("Abort!")}
        });
*/
        //调用方法，输入数字下标即可 如输入：2
        
         picArr = [
            //bing每日壁纸 索引号0

            "https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN",//动态每日壁纸
            "https://bing.com/th?id=OHR.NationalDay2022_ZH-CN3861603311_1920x1080.jpg",
            "https://bing.com/th?id=OHR.BridgeofSighs_ZH-CN5414607871_1920x1080.jpg",
            //Wallpaper Abyss壁纸 索引号3
            "https://images4.alphacoders.com/171/171916.jpg",
            "https://images5.alphacoders.com/613/613927.jpg",
            "https://images2.alphacoders.com/606/606275.jpg",
            "https://images2.alphacoders.com/742/742320.png",
            //添加你自己的壁纸...... 索引号7
            "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/8o/wallhaven-8o2dpj.png?w=2560&fmt=webp",
            "https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN"
        ]


        //全局图片
        function fullPicSet() {
            document.querySelector("html").style.background = `url(${$.cookie('picUrl')}) 0% 0% / 100% no-repeat fixed`
    }


        function reset_all() {
            $.cookie('blurDeg', "blur(13px)", { expires: 31 })
            $.cookie('aDeg1', "53", { expires: 31 })
            $.cookie('aDeg2', "7c", { expires: 31 })
            $.cookie('picUrl', "https://bing.com/th?id=OHR.NationalDay2022_ZH-CN3861603311_1920x1080.jpg", { expires: 31 })

        }

        if ($.cookie('blurDeg') === undefined || $.cookie('picUrl') === undefined || $.cookie('aDeg1') === undefined || $.cookie('aDeg1') === undefined) {
            reset_all()
            alert("欢迎，数值设置格式请看控制台！")
        }
        if ($.cookie('blurDeg') === "" || $.cookie('picUrl') === "" || $.cookie('aDeg1') === "" || $.cookie('aDeg2') === "") {
            reset_all()
            alert("欢迎，数值设置格式请看控制台！")
        }
        console.log("模糊度的范围从0到1000(纯数字),例如:15")
        console.log("透明度的范围从00到fc(16进制)，例如:ac")
        console.log("图片url网址链接，你可以自己找，或者挂到GitHub上生成链接")
        console.log("低配机子请设置模糊度为0")




        var searchBox = document.getElementsByClassName("b_searchbox")[0];
        var searchboxForm = document.getElementsByClassName("b_searchboxForm")[0];
        var temp = document.getElementById('b_content');
        var temp2 = document.getElementById('b_results');
        var temp3 = document.getElementById('b_header');
        var b_rrsr = document.getElementsByClassName('b_rrsr');
        var tab1 = document.getElementsByClassName("tab-menu");
        var b_algo = document.getElementsByClassName('b_algo');
        var trans1 = document.getElementsByClassName('b_title');
        var b_context = document.getElementById('b_context');
        var slide = document.getElementsByClassName("slide")
        var length1 = b_context.children.length
        var nws_cwrp = document.getElementsByClassName("nws_cwrp")
        var liChildren = document.getElementById('b-scopeListItem-video')
        var lifontSize = window.getComputedStyle(liChildren).fontSize //获取fontSize 的方法，常规方法获得的是0因为由字体定义而来
        var b_ans = document.getElementsByClassName('b_ans');
        var b_bfb_mainline = document.getElementsByClassName('b_bfb_mainline b_ans')[0]
        var sb_form_q = document.getElementById('sb_form_q')
        var b_header = document.getElementById('b_header')
        var b_scopebar = document.getElementsByClassName("b_scopebar");








        // header背景
        b_context.children[length1 - 1].style.display = "none";
        function header_bg() {
            b_header.children[0].style.background = "linear-gradient(to right, rgb(255, 221, 238), skyblue) 0% 0% / 100% fixed"
            b_header.children[0].children[0].style.background = "linear-gradient(to right, rgb(255, 221, 238), skyblue) 0% 0% / 100% fixed"
            b_header.children[0].children[1].style.background = "linear-gradient(to right, rgb(255, 221, 238), skyblue) 0% 0% / 100% fixed"
        }

        function creatBox() {
            var div = document.createElement("div");

            //为div创建属性class = "test"
            var divattr = document.createAttribute("id");
            divattr.value = "settings";

            //把属性class = "test"添加到div
            div.setAttributeNode(divattr);

            //创建一个值为test的按钮
            var input = document.createElement("input");
            var inputattr = document.createAttribute("type");
            inputattr.value = "button";
            input.setAttributeNode(inputattr);
            var inputattr1 = document.createAttribute("value");
            inputattr1.value = "test";
            input.setAttributeNode(inputattr1);

            //创建一hello,world个文本节点
            var text = document.createTextNode("settings");

            //将按钮和文本节点追加到div
            div.appendChild(input);
            div.appendChild(text);

            //为div添加样式
            var style = document.createAttribute("style");
            div.setAttributeNode(style);
            div.style.backgroundColor = "rgb(255 255 255 / 70%)";
            div.style.borderWidth = "20px";
            div.style.width = "500px";
            div.style.height = "580px";

            //把div追加到body

            b_scopebar[0].appendChild(div)
            document.getElementById("settings").style = `
            backdrop-filter: blur(30px);
            background-color: rgba(255, 255, 255, 0);
            border-color: rgb(0, 0, 0);
            width: 22%;height: 248%;
            position: absolute;
            top: 112%;
            left: 43%;z-index: 9;
            border-radius: 10px;
            animation-name: fadeIn;
    -webkit-animation-duration: 0.6s;
    -webkit-animation-timing-function: cubic-bezier(0, 1.15, 1, 1);
    -webkit-animation-delay: 0s;
    -webkit-animation-iteration-count: 1;
         `
        /*   */

        var css_innerBox = `
            position: absolute;
        top: 0%;
        left: 0%;
        bottom: 0%;
        right: 0%;
        background-color: rgb(144 144 144 / 48%);
        z-index: 9;
        height: 100%;
        width: 100%;
        margin: auto;
        border-radius: 10px;`
        var css_input = `
            width: 80%;
        height: 27px;
        border-radius: 10px;`
        var css_set = `margin: 10px 18px;`

        var css_button = `background:transparent;border-radius: 4px;float:right;`
        var css_move_it = ` translate:50%;float: right;`
        var css_top_move = `width:100%;height:100%`

        document.getElementById("settings").innerHTML = `<div id="settings1">
    <div id="innerBox" style="${css_innerBox}">
        <div class="set" id="first_div" style="${css_set}"><span id="top_move" style="${css_top_move}">模糊度(1~100)图片模式</span> <span id="move_it" style="${css_move_it}">X</span><br><input style="${css_input}"  class="input_set"  type="text"></input></div>
        <div class="set" style="${css_set}">透明度1(00~ff)渐变色模式<br><input  style="${css_input}"  class="input_set"  class="input_set" type="text"></input></div>
        <div class="set" style="${css_set}">透明度2(00~ff)图片模式<br><input  style="${css_input}"  class="input_set"  class="input_set" type="text"></input></div>
        <div class="set" style="${css_set}">图片URL<br><input  style="${css_input}"  class="input_set"  class="input_set" type="text"></input></div> &nbsp
    <button id="confirm_button" style="${css_button}">确认</button>
    </div>
</div>
`
        //插入渲染完成
        var settings = document.getElementById("settings")
        var confirm_button = document.getElementById("confirm_button")
        var input_set = document.getElementsByClassName('input_set')

        settings.style.display = "none"

            confirm_button.addEventListener('click', () => {
                if (input_set[3].value === "" || input_set[2].value === "" || input_set[1].value === "" || input_set[0].value === "") {
                    reset_all();
                    alert("不能为空！数值已重置为默认值");
                }
                else {

                    $.cookie('blurDeg', `blur(${input_set[0].value}px)`, { expires: 31 })
                    $.cookie('aDeg1', `${input_set[1].value}`, { expires: 31 })
                    $.cookie('aDeg2', `${input_set[2].value}`, { expires: 31 })
                    // $.cookie('picUrl',`${input_set[3].value}`,{ expires: 31 })

                    if (/http/g.test(input_set[3].value)) {
                        $.cookie('picUrl', input_set[3].value, { expires: 31 })
                    }
                    else if (/^\d+$/g.test(input_set[3].value)) {
                        $.cookie('picUrl', picArr[`${input_set[3].value}`], { expires: 31 })

                    }

                    else {
                        $.cookie('picUrl', input_set[3].value, { expires: 31 })
                    }
                }
                //

                location.reload();



            })

            document.getElementById("move_it").addEventListener('click', () => {
                document.getElementById("settings").style.display = "none"
            })

        }

        creatBox()

        //移动函数
        function move(demo) {
            //var demo = document.getElementById(`${settings}`)
            var canitmove = false
            var x = 0,
                y = 0
            demo.onmousedown = function (e) {
                event.preventDefault()
                x = e.pageX - demo.offsetLeft
                y = e.pageY - demo.offsetTop
                canitmove = true
                console.log(e.pageX)
            }
            window.onmouseup = function () {
                canitmove = false
            }
            window.onmousemove = function (e) {

                if (canitmove) {
                    demo.style.left = e.pageX - x + 'px'
                    demo.style.top = e.pageY - y + 'px'
                }
            }
        }
        //        document.getElementById('css_top_move').addEventListener('mouseon')


        // 快捷输入与置顶与按键监听
        document.onkeydown = function (e) {
            var keyNum = window.event ? e.keyCode : e.which;
            //  alert(keyNum)
            //    console.log(e)
            if (191 == keyNum && e.ctrlKey) {
                e.preventDefault();
                if (document.getElementById('mfa_srch')) {
                    document.getElementById('mfa_srch').click()
                }
            }
            if (13 == keyNum) {
                if (document.getElementById("settings").style.display == "block") {
                    document.getElementById("confirm_button").click()
                }
            }

        }




        //结果框背景色函数
        function changeBack_All(deg, deg2) {
            changeBack_1(deg, deg2);
            changeBack_2(deg, deg2);
        }

        function changeBack_1(deg, deg2) {

            for (let k = 0; k <= b_ans.length - 1; k++) {
                b_ans[k].style.borderRadius = "10px";
                b_ans[k].style.background = `#ffffff${deg}`
            b_ans[k].style.backdropFilter = `${deg2}`
        }

        }


        function changeBack_2(deg, deg2) {
            for (let i = 0; i <= b_algo.length - 1; i++) {
                b_algo[i].style.borderRadius = "10px";
                b_algo[i].style.background = `#ffffff${deg}`
            b_algo[i].style.caretColor = "transparent";
                b_algo[i].style.backdropFilter = `${deg2}`
            //    b_algo[i].addEventListener("mouseover", b_algo[i].style.boxShadow="0 6px 20px 0 rgb(0 0 0 /30%)")
        }
        }
        function searchStyle() {

            if (b_bfb_mainline) {
                b_bfb_mainline.style.borderRadius = "10px"
            }
            if (b_rrsr[0]) {
                for (let k = 0; k <= b_rrsr.length - 1; k++) {
                    //  b_rrsr[k].style.borderRadius="10px";
                    b_rrsr[0].style.background = "transparent";
                }
            }

            if (tab1.length > 0) {
                for (let i = 0; i <= tab1[0].children[0].children.length - 1; i++) {
                    tab1[0].children[0].children[i].style.backgroundColor = ("transparent");
                }
            }
            for (let i = 0; i <= trans1.length - 1; i++) {
                trans1[i].style.translate = "23px"; //这一句有报错，但是我看不懂
            }


            // searchBox.style.setProperty('width', '480px', 'important');
            searchBox.style.transition = "all 0.5s"

        }

        function move1() {
            searchBox.onmousedown = function () {
                searchBox.style.width = "77vh";
            }
        }
        temp.onmousedown = function () {
            searchBox.style.width = "522px";
        }


        // $.cookie('flag', '0')
        var button_1 = document.createElement("button"); //创建一个按钮
        button_1.textContent = "透明"; //按钮内容
        button_1.style.width = "60px"; //按钮宽度
        button_1.style.height = "30px"; //按钮高度
        button_1.style.align = "center"; //居中
        button_1.style.color = "#444444"; //按钮文字颜色
        button_1.style.border = "none"; //按钮文字颜色
        button_1.style.background = "transparent"; //按钮底色
        button_1.style.fontSize = lifontSize
        button_1.style.padding = "9.3px 0"
        button_1.addEventListener("click", clickButton_1)

        function clickButton_1() {
            searchboxForm.style.background = `#ffffff${$.cookie('aDeg2')}`
            $.cookie('flag', '1')

        }
        if ($.cookie('flag') == 1) {
            searchboxForm.style.background = `#ffffff${$.cookie('aDeg2')}`
        }

        var button_2 = document.createElement("button"); //创建一个按钮
        button_2.textContent = "炫彩"; //按钮内容
        button_2.style.width = "60px"; //按钮宽度
        button_2.style.height = "30px"; //按钮高度
        button_2.style.align = "center"; //居中
        button_2.style.color = "#444444"; //按钮文字颜色
        button_2.style.border = "none"; //按钮文字颜色
        button_2.style.background = "transparent"; //按钮底色
        button_2.style.fontSize = lifontSize
        button_2.style.padding = "9.3px 0"
        button_2.addEventListener("click", clickButton_2)
        function clickButton_2() {
            searchboxForm.style.backgroundImage = "linear-gradient(to right, rgb(255, 221, 238), skyblue)";
            $.cookie('flag', '1')
        }
        if ($.cookie('flag') == 2) {
            searchboxForm.style.backgroundImage = "linear-gradient(to right, rgb(255, 221, 238), skyblue)";
        }

        var button_3 = document.createElement("button"); //创建一个按钮
        button_3.textContent = "换背景"; //按钮内容
        button_3.style.width = "60px"; //按钮宽度
        button_3.style.height = "30px"; //按钮高度
        button_3.style.align = "center"; //居中
        button_3.style.color = "#444444"; //按钮文字颜色
        button_3.style.border = "none"; //按钮文字颜色
        button_3.style.background = "transparent"; //按钮底色
        button_3.style.fontSize = lifontSize
        button_3.style.padding = "9.3px 0"
        button_3.addEventListener("click", clickButton_3)
        button_3.addEventListener("dblclick", dblclickButton_3)

        if ($.cookie('bgFlag') == undefined) {
            $.cookie('bgFlag', '3', { expires: 31 })//如果空则默认渐变色
        }
        function clickButton_3() {//图片背景
            $.cookie('bgFlag', '4', { expires: 31 })
            temp.style.background = `url(${$.cookie('picUrl')}) `
        temp.style.backgroundAttachment = "fixed"
            temp.style.backgroundSize = "100%"
            changeBack_All(`${$.cookie('aDeg2')}`, `${$.cookie('blurDeg')}`)
            //   temp.style.translate=""
        }
        function dblclickButton_3() {//渐变色背景
            $.cookie('bgFlag', '3', { expires: 31 })
            temp.style.backgroundImage = "linear-gradient(to right, #FFDDEE , skyblue)";
            temp.style.backgroundAttachment = "fixed"
            changeBack_All(`${$.cookie('aDeg1')}`, "none")
            // temp.style.translate="0px -2px"
        }
        if ($.cookie('bgFlag') == 4) {//图片背景
            temp.style.background = `url(${$.cookie('picUrl')}) no-repeat`
        temp.style.backgroundAttachment = "fixed"
            temp.style.backgroundSize = "100%"
            changeBack_All(`${$.cookie('aDeg2')}`, `${$.cookie('blurDeg')}`)
            //         temp.style.translate=""

        }
        if ($.cookie('bgFlag') == 3) {//渐变色背景
            temp.style.backgroundImage = "linear-gradient(to right, #FFDDEE , skyblue)";
            temp.style.backgroundAttachment = "fixed"
            changeBack_All(`${$.cookie('aDeg1')}`, "none")
            //   temp.style.translate="0px -2px"
        }
        var button_4 = document.createElement("button"); //创建一个按钮
        button_4.textContent = "⚙"; //按钮内容
        button_4.style.width = "60px"; //按钮宽度
        button_4.style.height = "30px"; //按钮高度
        button_4.style.align = "center"; //居中
        button_4.style.color = "#444444"; //按钮文字颜色
        button_4.style.border = "none"; //按钮文字颜色
        button_4.style.background = "transparent"; //按钮底色
        button_4.style.fontSize = "20px"
        button_4.style.padding = "9.3px 0"
        button_4.addEventListener("click", clickButton_4)
        function clickButton_4() {
            document.getElementById("settings").style.display = "block"
            let regex = /(?<=\().*?(?=\))/g;
            let regex_num = /\d+/g
            let blurIndex = $.cookie('blurDeg')
            blurIndex = blurIndex.match(regex)[0].match(regex_num)[0]
            document.getElementsByClassName('input_set')[0].value = `${blurIndex}`
        document.getElementsByClassName('input_set')[1].value = `${$.cookie('aDeg1')}`
        document.getElementsByClassName('input_set')[2].value = `${$.cookie('aDeg2')}`
        document.getElementsByClassName('input_set')[3].value = `${$.cookie('picUrl')}`

    }
        b_scopebar[0].children[0].appendChild(button_1);
        b_scopebar[0].children[0].appendChild(button_2);
        b_scopebar[0].children[0].appendChild(button_3);
        document.getElementById('id_h').appendChild(button_4);
        //搜索关联盒子长度溢出解决
        function fixOverflow(relatedBox) {
            if (relatedBox) {
                for (let i = 0; i <= relatedBox.children[0].children[1].children.length - 1; i++) {
                    relatedBox.children[0].children[1].children[i].style.width = "45%"
                }

            }
        }
        function fixOverflow2() {
            var brsv3 = document.getElementById('brsv3')
            if (brsv3) {
                for (let i = 0; i <= brsv3.children[1].children.length - 1; i++) {
                    brsv3.children[1].children[i].style.width = "45%"
                }
            }
        }
        function remove_foot() {
            var length_b_canvas = document.getElementsByClassName('b_canvas').length
            if (document.getElementsByClassName('b_canvas')[0]) {
                document.getElementsByClassName('b_canvas')[document.getElementsByClassName('b_canvas').length - 1].style.display = "none"
            }
            if (document.getElementById('b_footer')) {
                document.getElementById('b_footer').style.background = "#000000e8"
                document.getElementById('b_footer').style.translate = "0px 0px"
            }
            if (document.getElementById('mfa_srch')) {
                document.getElementById('mfa_srch').style.backdropFilter = "blur(10px)"
                document.getElementById('mfa_srch').style.background = "transparent"
            }
        }



        function fixotherQues() {


            for (let i = 0; i <= slide.length - 1; i++) {
                slide[i].children[0].style.background = "transparent"
            }
            if (nws_cwrp[0]) {
                nws_cwrp[0].style.background = "transparent"
            }
            if (document.getElementsByClassName("mc_vhvc_th")[0]) {
                document.getElementsByClassName("mc_vhvc_th")[0].children[0].style.background = "transparent"
                document.getElementsByClassName("mc_vhvc_th")[1].children[0].style.background = "transparent"
                //         document.getElementsByClassName("mc_vhvc_th")[2].children[0].style.background="transparent"
            }
            if (document.getElementsByClassName("na_ccw")) {
                for (let i = 0; i <= document.getElementsByClassName("na_ccw").length - 1; i++) {
                    document.getElementsByClassName("na_ccw")[i].style.background = "transparent"
                }
                console.log('渲染完成！')
            }
            else (console.log("渲染部分失败！"))
        }

        ////////////////////
        // js创建@keyframes，ball从定位在(10,10)的位置运动到(100,100) 的位置
        const runkeyframes = `
    @keyframes fadeIn {
        0% {
            opacity: 0;
            /*初始状态 透明度为0*/
        }

        50% {
            opacity: 0;
            /*中间状态 透明度为0*/
        }

        100% {
            opacity: 1;
            /*结尾状态 透明度为1*/
        }
    }
    .pagereco_CB{
        background-color: transparent;
    }
 .pagereco_CBImageCard, .pagereco_CBTextCard{
        background-color: #fff0;
        }
        #tabcontrol_8_156412_navr{
            background-color: transparent;
        }
        #b_header{
            border-bottom: none;
        }

        #dsdsd99mmmjj7760011{
            background:#ffffff${$.cookie('aDeg2')};
            border-radius: 10px;
            margin: 1px 0px;
            width: 472px;
            translate: -21px;
            display: flex;
            flex-direction: column;
        }
/*translate*/
.tta_incell{
    background:transparent;
}
.tta_outcell{
    background:transparent;
}
#tta_output_ta{
    background:transparent;
}

`
    // 创建style标签
    const style = document.createElement('style');
        // 设置style属性
        style.type = 'text/css';
        // 将 keyframes样式写入style内
        style.innerHTML = runkeyframes;
        // 将style样式存放到head标签
        document.getElementsByTagName('body')[0].appendChild(style);
        ////////////////////

        function doIt() {
            fixotherQues();
            fixOverflow();
            fixOverflow2();
            remove_foot();
            move1();
            searchStyle();
            fullPicSet(); //搜索栏背景
        }

        doIt();
        
    }

    if (window.location.href.indexOf("baidu.com") > -1) {
        var picUrl = `https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/8o/wallhaven-8o2dpj.png?w=2560&fmt=webp`
        $.cookie('picUrl', picUrl)
        document.getElementById('wrapper_wrapper').style.background = `url(${$.cookie('picUrl')}) 0% 0% / 100% no-repeat fixed`
    }



}