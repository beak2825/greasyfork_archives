// ==UserScript==
// @name         在网站底部固定显示单词、语录或者任何你想要看到的文本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  默认在所有网站上面添加
// @author       潘志城_Neo
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409819/%E5%9C%A8%E7%BD%91%E7%AB%99%E5%BA%95%E9%83%A8%E5%9B%BA%E5%AE%9A%E6%98%BE%E7%A4%BA%E5%8D%95%E8%AF%8D%E3%80%81%E8%AF%AD%E5%BD%95%E6%88%96%E8%80%85%E4%BB%BB%E4%BD%95%E4%BD%A0%E6%83%B3%E8%A6%81%E7%9C%8B%E5%88%B0%E7%9A%84%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/409819/%E5%9C%A8%E7%BD%91%E7%AB%99%E5%BA%95%E9%83%A8%E5%9B%BA%E5%AE%9A%E6%98%BE%E7%A4%BA%E5%8D%95%E8%AF%8D%E3%80%81%E8%AF%AD%E5%BD%95%E6%88%96%E8%80%85%E4%BB%BB%E4%BD%95%E4%BD%A0%E6%83%B3%E8%A6%81%E7%9C%8B%E5%88%B0%E7%9A%84%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

/*
重要说明：
    1.需要自己修改脚本里面的内容，详看下面的“使用步骤”。
    2.本脚本不会更新，免得大家不小心点了更新，导致自己设置的内容被新脚本覆盖了。
    3.大家自己在电脑里面备份好自己的内容哈。

使用步骤：
    1.搜索【定义要显示的列表】就能定义列表的地方，其中的【Default_Data_List】就是默认使用的列表，
      直接把里面的内容修改为自己想要显示的内容就行。
    2.修改的时候，注意先看看【Default_Data_List】下面的说明。
    3.按照上面说的修改之后就能用了。
    4.如果想要设置一下字体颜色什么的，可以搜索【常用的设置】，找到自己想要设置的内容设置。

快捷键：
    1.显示/隐藏文本：ctrl+shift+s。
    2.显示/隐藏面板：ctrl+shift+a。

鼠标点击事件：(这里指点击文本——单词、语录之类的。)
    1.左键点击：切换下一条文本。
    2.中键点击：复制文本到剪贴板。
    3.右键点击：跳转到查词网站并查词。搜索【要用的词典】修改要用的词典。
*/
(function() {
    'use strict';

    ////常用的设置
    //如果是网站是被镶嵌在【iframe】里面的话，加不加载
    const Show_In_Iframe = false  //加载：true ；不加载：false

    //是否自动切换文本
    const Switch_Data = true  //自动切换：true ; 不自动切换：false

    //如果自动切换文本，那么多少【秒】切换一次
    const Switch_Second = 30

    //文字的颜色(颜色值可以在百度上搜索【在线取色工具】，或者直接用这个：https://www.58pic.com/zhinengpeise/)
    const Data_Color = "#00A1D6"

    //背景的颜色
    const Data_Background_Color = "rgba(255, 255, 255, 1)" //括号里面最后的一个参数是【不透明度】范围是0-1之间(包含0和1) —— 0代表：全透明。1代表：全不透明。

    //字体大小
    const Data_Font_Size = "15px"

    //显示/隐藏快捷操作面板(这个不用设置，用快捷键【ctrl+shift+a】来控制隐藏和显示)
    var show_panel = false

    //显示/隐藏文本(这个不用设置，用快捷键【ctrl+shift+s】来控制隐藏和显示)
    var show_text = true

    //上次一次文本(这个不用设置）
    var Last_Content = ""

    ////快捷面板配色
    //第一组
    const Panel_BackgroundColor_1 = "#44B6F3"
    const Panel_Color_1 = "#fff"
    //第二组
    const Panel_BackgroundColor_2 = "#5EC0F5"
    const Panel_Color_2 = "#fff"


    //定义右键点击时的操作
    var Neo_Rclick_Mode = 1
    /*
    0：普通文本模式，用百度搜索
    1：查词模式，跳转到查词网站查词
    */


    ////以下定义的时候【getData】函数的参数

    //定义要显示的列表(请先看下面的说明)
    var Default_Data_List =[
        "眼鏡 | めがね ①↵[名] 眼镜。（近視・遠視・乱視などの視力を調整したり、強い光線から目を保護したりするために用いる、凹または凸レンズや色ガラスなどを使った器具。）",
        "可愛い | かわいい ③↵[形·惯用语] 讨人喜欢。（いたわしい。） 宝贵的。（愛すべきである。） 小巧玲珑。（小さくて美しい。）",
        "大丈夫 | だいじょうぶ ③↵[形容動詞] 牢固，可靠。 放心，不要紧，没错儿（まちがいがなくて確かなさま）。",
        "instance | 美[ˈɪnstəns] n.	例子; 事例; 实例。"]
    /*
    重要！！！如果是单词而且要用到在词典网站搜索单词的功能的话，就要有分隔符。
    列表的分隔符说明：
        1.列表的每一项内容里面的【"|"】是分割符，查词的时候会取出【"|"】前面的内容来查。
        2.默认分割符是【"|"】,所以如果你的内容也是用【"|"】这个隔开的话，就不用看第3点了。
        3.自定义分隔符说明：
            例如：你的文本格式是这样的：target /ˈtɑːrɡɪt/ n. 目标,
            在查词的时候我们只需要查【target】,而【target】和后面的内容之间有【空格】和【/】
            所以，分隔符的值可以填【" "】或者【"/"】，搜索【设置文本的分割符号】，来设置分割符。

    */

    //设置文本的分割符号，查词的时候要用。
    const separator = "|" //默认是【"|"】,对应的文本格式是： target | /ˈtɑːrɡɪt/ n. 目标


    //【随机】从 data_list 中选择一项来显示
    /*
    data_list：要显示的列表，把【Default_Data_List】改成你想要使用的列表名称
    直接在参数那里设置默认使用的列表，调用的时候不传参数
    */
    function getData(data_list = Default_Data_List ) {
        //保存上一次的文本到【Last_Content】
        Last_Content = document.getElementById('neo_add_data').innerText

        let len = data_list.length;
        let num = Math.floor((Math.random() * len));
        let neo_data = data_list[num];

        return neo_data;
    }


    //查词函数
    /*
    dict_web：要用的词典，默认是"沪江小D"(右键点击文本的时候用的词典，可以改成下面列表中的任意一个词典)
    */
    const Neo_search = function(dict_web = "沪江小D",use_ShowPanel = true){
        //查词网站列表
        let dict_web_list = {
            "欧路":"https://dict.eudic.net/dicts/en/",
            "有道英语":"https://www.youdao.com/w/eng/",
            "有道日语":"https://www.youdao.com/w/jap/",
            "沪江小D":"https://dict.hjenglish.com/jp/jc/"
        }

        //词典的查词链接
        let target_site = dict_web_list[dict_web]
        //要查询的词
        let reg = new RegExp(".+(?=\\"+separator+")","g");
        let temp_text = document.getElementById('neo_add_data').innerText.match(reg)
        //如果找不到匹配，就直接用整句文本
        if(temp_text==null){
            temp_text = document.getElementById('neo_add_data').innerText
        }
        //完整的链接
        let serch_text = target_site+temp_text
        if (use_ShowPanel == true){
            ShowPanel()
        }
        window.open(serch_text)
    }



    //复制到剪贴板
    const neo_copy = function(copy_content){
        $("body").append('<textarea  id="neo_temp"/>')
        $("#neo_temp").val(copy_content)
        $("#neo_temp").select()
        document.execCommand("copy")
        $("#neo_temp").remove()

    }

    //面板的隐藏和显示
    const ShowPanel = function(){
        if(show_panel==true){
            document.getElementById("neo_add_data_panel").style.display="block"
            show_panel = !show_panel
        }else{
            document.getElementById("neo_add_data_panel").style.display="none"
            show_panel = !show_panel

        }
    }

    //面板的隐藏和显示
    const ShowText = function(){
        if(show_text==false){
            document.getElementById("neo_add_data").style.display="block"
            show_text = !show_text
        }else{
            document.getElementById("neo_add_data").style.display="none"
            show_text = !show_text

        }
    }

    //按键操作
    document.onkeyup= function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];

        //显示/隐藏快捷操作面板 ctrl+shift+a
        if (e && e.keyCode == 65 && e.ctrlKey === true && e.shiftKey === true) {
            ShowPanel()
        }

        //显示/隐藏文本 ctrl+shift+s
        if (e && e.keyCode == 83 && e.ctrlKey === true && e.shiftKey === true) {
            ShowText()
        }

    }

    //添加dom
    const add_dom = function(){
        let interval = setInterval(function(){
            if(document.getElementById('neo_add_data') == null){
                ////添加显示语录的dom
                var obj=document.createElement("div");
                obj.value="1";
                obj.id = "neo_add_data"
                document.getElementsByTagName("body")[0].appendChild(obj)
                //document.querySelector('body').prepend(obj)
                //document.getElementsByTagName("body")[0].innerHTML='<div id="ttttttttt" style="position:fixed;bottom:15px;background:#600;width:100vw;color:#009;text-align:center">23123213213231</div>'+document.getElementsByTagName("body")[0].innerHTML

                //设置语录样式
                document.getElementById("neo_add_data").style.position="fixed"
                document.getElementById("neo_add_data").style.bottom="0px"
                document.getElementById("neo_add_data").style.left="0px"
                document.getElementById("neo_add_data").style.width="100vw"
                document.getElementById("neo_add_data").style.color= Data_Color
                //document.getElementById("neo_add_data").style.font-weight="bold"
                document.getElementById("neo_add_data").style.fontSize= Data_Font_Size
                //document.getElementById("neo_add_data").style.height= "22px"
                document.getElementById("neo_add_data").style.background= Data_Background_Color
                document.getElementById("neo_add_data").style.textAlign="center"
                document.getElementById("neo_add_data").style.zIndex=10000

                //设置语录
                document.getElementById('neo_add_data').innerText = getData()

                //$("#neo_add_data").css("text-shadow","#FFF 1px 0 0, #FFF 0 1px 0, #FFF -1px 0 0, #FFF 0 -1px 0") //这一行是四边都添加1像素的投影，相当于是添加了1像素的描边
                //$("#neo_add_data").css("-webkit-text-stroke","1px #fff 0.5") //给文本添加描边

                document.getElementById("neo_add_data").onmouseup = function(e){
                    if(e.button ==2){

                        //右键
                        switch(Neo_Rclick_Mode){
                            case 0:
                                window.open( 'https://www.baidu.com/s?&wd='+document.getElementById('neo_add_data').innerText)
                                break
                            case 1:
                                Neo_search("沪江小D",false)
                                break
                        }

                    }else if(e.button ==0){
                        //左键
                        document.getElementById('neo_add_data').innerText = getData()
                    }else if(e.button ==1){
                        //滚轮
                        neo_copy(document.getElementById('neo_add_data').innerText)
                    }
                }


                ////添加快捷操作面板
                var obj1=document.createElement("div");
                obj1.value="1";
                obj1.id = "neo_add_data_panel"
                //obj1.innerText = "【快捷菜单选项】"
                document.getElementsByTagName("body")[0].appendChild(obj1)
                //document.querySelector('body').prepend(obj1)

                //设置语录样式
                document.getElementById("neo_add_data_panel").style.display="none"
                document.getElementById("neo_add_data_panel").style.position="fixed"
                //document.getElementById("neo_add_data_panel").style.bottom = "20px"
                document.getElementById("neo_add_data_panel").style.bottom = "20px"
                document.getElementById("neo_add_data_panel").style.left="0px"
                document.getElementById("neo_add_data_panel").style.width="100vw"
                //document.getElementById("neo_add_data_panel").style.color= "#1AB37D"
                document.getElementById("neo_add_data_panel").style.color=Panel_Color_2
                //document.getElementById("neo_add_data_panel").style.font-weight="bold"
                document.getElementById("neo_add_data_panel").style.fontSize= Data_Font_Size
                //document.getElementById("neo_add_data_panel").style.background= Data_Background_Color
                document.getElementById("neo_add_data_panel").style.background= Panel_BackgroundColor_2
                document.getElementById("neo_add_data_panel").style.textAlign="center"
                document.getElementById("neo_add_data_panel").style.zIndex=10000






                ////添加快捷面板里面的选项
                var obj01=document.createElement("span");
                obj01.id = "title_text"
                obj01.innerText = "【快捷菜单选项】"
                document.getElementById("neo_add_data_panel").appendChild(obj01)
                //document.getElementById("gap").style.height="20px"
                document.getElementById("title_text").style.display="block"
                document.getElementById("title_text").style.marginLeft = "9px"
                document.getElementById("title_text").style.marginTop = "9px"
                document.getElementById("title_text").style.lineHeight="20px"
                document.getElementById("title_text").style.fontSize="22px"


                var obj0=document.createElement("span");
                obj0.id = "gap"
                obj0.innerText = "-------------------------"
                document.getElementById("neo_add_data_panel").appendChild(obj0)
                //document.getElementById("gap").style.height="20px"
                document.getElementById("gap").style.display="block"
                document.getElementById("gap").style.marginLeft = "9px"
                document.getElementById("gap").style.lineHeight="20px"


                //【英语】用欧路词典查询
                var obj3=document.createElement("div");
                obj3.value="1";
                obj3.id = "neo_add_data_panel_oulu_search"
                obj3.innerText = "【英语】用欧路词典查询"
                obj3.title = "【英语】用欧路词典查询"

                document.getElementById("neo_add_data_panel").appendChild(obj3)
                document.getElementById("neo_add_data_panel_oulu_search").style.cursor="pointer"
                document.getElementById("neo_add_data_panel_oulu_search").style.height="30px"
                document.getElementById("neo_add_data_panel_oulu_search").style.lineHeight="30px"
                //document.getElementById("neo_add_data_panel_oulu_search").style.background= "rgba(235, 235, 255, 0.6)"
                document.getElementById("neo_add_data_panel_oulu_search").style.background= Panel_BackgroundColor_1
                document.getElementById("neo_add_data_panel_oulu_search").style.color= Panel_Color_1



                document.getElementById("neo_add_data_panel_oulu_search").onclick = function(){ Neo_search("欧路") }


                //【英语】用有道词典查询
                var obj2=document.createElement("div");
                obj2.value="1";
                obj2.id = "neo_add_data_panel_youdao_search"
                obj2.innerText = "【英语】用有道词典查询"
                obj2.title = "【英语】用有道词典查询"

                document.getElementById("neo_add_data_panel").appendChild(obj2)
                document.getElementById("neo_add_data_panel_youdao_search").style.cursor="pointer"
                document.getElementById("neo_add_data_panel_youdao_search").style.height="30px"
                document.getElementById("neo_add_data_panel_youdao_search").style.lineHeight="30px"
                //document.getElementById("neo_add_data_panel_youdao_search").style.background= "rgba(235, 255, 235, 0.6)"
                document.getElementById("neo_add_data_panel_youdao_search").style.background= Panel_BackgroundColor_2
                document.getElementById("neo_add_data_panel_youdao_search").style.color= Panel_Color_2

                document.getElementById("neo_add_data_panel_youdao_search").onclick = function(){ Neo_search("有道英语") }


                //【日语】用沪江小D查询
                var obj4=document.createElement("div");
                obj4.value="1";
                obj4.id = "neo_add_data_panel_hujiang_search"
                obj4.innerText = "【日语】用沪江词典查询"
                obj4.title = "【日语】用沪江小D查询"

                document.getElementById("neo_add_data_panel").appendChild(obj4)
                document.getElementById("neo_add_data_panel_hujiang_search").style.cursor="pointer"
                document.getElementById("neo_add_data_panel_hujiang_search").style.height="30px"
                document.getElementById("neo_add_data_panel_hujiang_search").style.lineHeight="30px"
                //document.getElementById("neo_add_data_panel_hujiang_search").style.background= "rgba(235, 235, 255, 0.6)"
                document.getElementById("neo_add_data_panel_hujiang_search").style.background= Panel_BackgroundColor_1
                document.getElementById("neo_add_data_panel_hujiang_search").style.color= Panel_Color_1

                document.getElementById("neo_add_data_panel_hujiang_search").onclick = function(){ Neo_search("沪江小D") }


                //【日语】用有道词典查询
                var obj5=document.createElement("div");
                obj5.value="1";
                obj5.id = "neo_add_data_panel_youdao_riyu_search"
                obj5.innerText = "【日语】用有道词典查询"
                obj5.title = "【日语】用有道词典查询"

                document.getElementById("neo_add_data_panel").appendChild(obj5)
                document.getElementById("neo_add_data_panel_youdao_riyu_search").style.cursor="pointer"
                document.getElementById("neo_add_data_panel_youdao_riyu_search").style.height="30px"
                document.getElementById("neo_add_data_panel_youdao_riyu_search").style.lineHeight="30px"
                //document.getElementById("neo_add_data_panel_youdao_riyu_search").style.background= "rgba(235, 255, 235, 0.6)"
                document.getElementById("neo_add_data_panel_youdao_riyu_search").style.background= Panel_BackgroundColor_2
                document.getElementById("neo_add_data_panel_youdao_riyu_search").style.color= Panel_Color_2

                document.getElementById("neo_add_data_panel_youdao_riyu_search").onclick = function(){ Neo_search("有道日语") }


                //【其他】显示上一次的文本
                var obj6=document.createElement("div");
                obj6.value="1";
                obj6.id = "neo_add_data_panel_show_last_content"
                obj6.innerText = "【其他】显示上次的文本"
                obj6.title = "【其他】显示上次的文本"

                document.getElementById("neo_add_data_panel").appendChild(obj6)
                document.getElementById("neo_add_data_panel_show_last_content").style.cursor="pointer"
                document.getElementById("neo_add_data_panel_show_last_content").style.height="30px"
                document.getElementById("neo_add_data_panel_show_last_content").style.lineHeight="30px"
                //document.getElementById("neo_add_data_panel_show_last_content").style.background= "rgba(235, 235, 255, 0.6)"
                document.getElementById("neo_add_data_panel_show_last_content").style.background= Panel_BackgroundColor_1
                document.getElementById("neo_add_data_panel_show_last_content").style.color= Panel_Color_1

                document.getElementById("neo_add_data_panel_show_last_content").onclick = function(){
                    if(Last_Content !=""){
                        document.getElementById('neo_add_data').innerText = Last_Content
                    }else{
                        document.getElementById("neo_add_data_panel_show_last_content").innerText = "【提示】当前是第一个文本"
                        document.getElementById("neo_add_data_panel_show_last_content").style.color = "#d22"
                        setTimeout(function(){
                            document.getElementById("neo_add_data_panel_show_last_content").innerText ="【其他】显示上次的文本"
                            document.getElementById("neo_add_data_panel_show_last_content").style.color = ""
                            ShowPanel()
                        },1000)

                    }
                }
                //clearInterval(interval)
            }
        },500)

        //【Switch_Second】秒切换一次语录(Switch_Second 在代码开头可以定义)
        setInterval(function(){
            if(Switch_Data == true){
                //设置语录
                document.getElementById('neo_add_data').innerText = getData()
            }
        },Switch_Second*1000)
    }


    //主函数
    const NeoMain = function(){
        add_dom()

    }

    //如果是网站是被镶嵌在iframe里面的话，就不加载
    if (Show_In_Iframe == false){
        if(window.self === window.top){
            NeoMain()
        }
    }else {
        NeoMain()
    }



})();