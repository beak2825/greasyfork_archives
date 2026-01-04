// ==UserScript==
// @name         人人影视Auto智慧人生
// @namespace    http://www.rrys2019.com/
// @version      4.6
// @description  体验完美人生
// @author       aimei5544
// @match        *://www.rrys2019.com/*
// @match        *://oabt004.com/*
// @match        *://*.cili001.com/*
// @grant        GM_AddStyle
// @note            v0.2重复自动跳转通过if解决和匹配域名解决
// @note            v0.3添加更新缓存按钮在编辑资源页面
// @note            v0.4添加离线地址搜索按钮
// @note            v0.5专为68更新一下版本号
// @note            v0.6修改编辑页面内的选择框图案
// @note            v0.7修复选择框超过两位数错位的情况
// @note            v0.8增加更新缓存图标，随窗口运动一直在右下角方便点击
// @note            v0.9去除 离线Bt站alert提示框 控制台输出
// @note            v1.0微云自动填充 离线搜索当前的剧名 更新缓存后获得反馈右下角变黑
// @note            v1.1修复遨游css样式颜色不显示问题：background换成background-color  遨游真是个垃圾浏览器啊！居然不支持透明的设置还是我的CHrome好用
// @note            v1.2修复空白页面无资源异常
// @note            v1.3添加页面页填充微云链接……幸苦68了！
// @note            v1.4变更[修改][保存][取消]按钮样式去除[删除]按钮
// @note            v2.0修复微云无法自动填充 搜索界面如果只有一个影视资源自动跳转
// @note            v2.1小更新
// @note            v2.2缓存跳转顶部
// @note            v2.3搜索页面跳转优化逻辑…… 添加温馨提示
// @note            v2.4缓存后……修改网页图标 日剧LOT马达字幕组luckydag不需要更新的就不自动添加微云了
// @note            v2.5范特西匹配不需要更新的字幕组
// @note            v2.6百度云匹配不需要更新的字幕组
// @note            v2.7适配垃圾傲游浏览器妈的
// @note            v2.8修改颜色
// @note            v2.9修改字幕组匹配
// @note            v3.0修改episode下拉框样式
// @note            v3.1优化episode输入方式
// @note            v3.2优化各种逻辑问题 不会重复出现各种提示了
// @note            v3.6 更改ico地址
// @note            v3.7 继续更换ico地址……之前那个安全措施太变态了。
// @note            v3.8 更换地址 为 zimuzu.io
// @note            v3.9 它又改变了回去…… zimuzu.tv
// @note            v4.0 修修补补一些细小BUG
// @note            v4.1 增加在地址栏显示剧名，避免空白页的出现忘记该更新什么
// @note            v4.2 增加在地址栏显示中英文剧名
// @note            v4.3 修改磁力链地址
// @note            v4.5 修改地址，由于版面更新，相关css有问题。修复bug！

// @note            v4.6更新域名地址

// @downloadURL https://update.greasyfork.org/scripts/40086/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86Auto%E6%99%BA%E6%85%A7%E4%BA%BA%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/40086/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86Auto%E6%99%BA%E6%85%A7%E4%BA%BA%E7%94%9F.meta.js
// ==/UserScript==

(function aimei5544() {
    'use strict';
    //功能实现为访问资源页面后自动加载编辑页面
    var now_url=document.location.href;
    // 获取当前URL
    var url_=now_url.split("/");
    var url_search=url_[3].split("?");
    var url_yyets=url_[3];//判断元素
    var edit_url="http://www.rrys2019.com/release/resource/app?rid="+url_[4];
    //资源页面跳转编辑页面
    if (url_yyets == "resource"){
        var name= $("div.resource-tit h2").text();//获取h2
        var name_=name.split("《");//分割《
        var name_juming_cn=name_[1].split("》")//分割》
        var name_juming_en=$("div.fl-info ul li strong").html();
        console.log("剧名中文为    ：    "+name_juming_cn[0]);
        //分割取第四个元素ID
        console.log("编辑url ："+edit_url);
        console.log("当前id为："+url_[4]);
        window.location.href=edit_url+"?name_juming_en="+name_juming_en+"?name_juming_cn="+name_juming_cn[0];
    }

    //页面属性分析 ： 编辑页面  搜索界面 离线地址页面

    if(url_[3]=="release"){ //跳转编辑页面添加按钮 更新缓存
        console.log("编辑页面");
        var get_edit_url=document.location.href;
        var edit_=get_edit_url.split("=");
        var edit_url_updata="http://www.rrys2019.com/resource/updateCache?rid="+edit_[1];
        document.getElementsByTagName("table")[3].innerHTML="<td class='update_cache' style='height: 18px;line-height: 1.5;background-color: #2866bd;color: #fff;font-weight: bold;text-align: center;padding: 6px;border-radius: 5px;><a id='update_cache_a'>更新缓存</a></td><td class='yyets_lixian' style='height: 18px;line-height: 1.5;background-color: #2866bd;color: #fff;font-weight: bold;text-align: center;padding: 6px;border-radius: 5px;><a href='http://f.cili001.com/index/index?c=yyets' target='_blank' >离线地址搜索</a></td>";
        //加缓存
        $(".update_cache").click(function(){
            $.ajax({
                url:edit_url_updata+"&sid="+Math.random(),//加随机可以避免被服务器Ban
                type:'GET',
                dataType:'JSON',
                success: function(data){
                    GLOBAL.ShowMsg('成功刷新缓存');
                    //使右下角变黑好区分是否更新过缓存
                    addStyle(".youXiaJiao{position:fixed; _position:absolute; bottom:30px; right:0px; width:150px; height:75px; display:block;}.youXiaJiao a,.youXiaJiao a:link{width:150px;height:195px;display:inline-block; background-color:#000000; outline:none;}.youXiaJiao a:hover{width:150px; height:195px; background-color:#ff0000; outline:none;}");
                    $('title').text('缓存已更新');
                    $('html').scrollTop(0);
                }
            });
            change_ICO();

        });

        //加离线
        $(".resNav").append("<a key='666' class='yyets_lixian'>【离线地址搜索】</a>");
        $(".yyets_lixian").click(function(){
            var a=$("div.h").text();
            var b=a.split("=");
            if(b[1]==null){
                window.open("http://f.cili001.com/index/index?c=yyets");
            }else{
                var c=b[1].split(".");
                var d=c[0].split(" ");
                var name=d[0];
                window.open("http://f.cili001.com/index/index?c=yyets&k="+name);
            }
        });
        //加节点选择框
        addNode();
        $(".btn1:not(#reset)").click(addNode);
        //自动填充微云
        addWeyun();
        $(".btn1").click(addWeyun);
        //修改updata按钮
        Change_updata();
        $(".btn1:not(#reset)").click(Change_updata);
        //提醒范特西是不是需要更新
        nofantasy();
        $(".btn1").click(nofantasy);
        //提醒百度云是不是需要更新
        nobaiduyun();
        $(".btn1").click(nobaiduyun);
        //更改episode下拉框样式
        change_episode();
        //加最新一集是多少的提醒 该功能在 更改episode 中添加了对应的input 按钮
        addTips();
        $(".btn1").click(addTips);
        setTimeout(addTop_updata,1000);
    }else if(url_search[0]=="search"){//搜索页面跳转
        setTimeout(function(){
            var num_class=document.getElementsByClassName("clearfix search-item");
            if(num_class.length==1){
                var href_end=$(".t.f14").children("a").attr("href");
                var rid_1=href_end.split("/");
                window.location.href="http://www.rrys2019.com/release/resource/app?rid="+rid_1[2];

                console.log("长度为"+num_class.length);
                console.log("rid为"+rid_1[2]);

            }else{
                console.log("search长度为："+num_class.length+"项目太多无法跳转");
            }
        },1000);
    }else {
        console.log("当前不会跳转");
        console.log("当前url_yyets为："+url_[3]);
        console.log("当前id为："+url_[4]);
        console.log("编辑url ："+edit_url);
        if(url_[3]=="index"){
            //去除alert
            setTimeout(location.href="javascript:alert=function(s){console.log(s)};void 0",console.log("alert已去除"),1000);
        }
    }

    //    ！！！！！！！！！！！！！各个模块function！！！！！ ！！！！！     //


    function addTop_updata(){
        var DivCheckNodes = document.querySelectorAll("body");
        var perDivNode =DivCheckNodes[0].querySelectorAll("div");
        var NewdivNode = document.createElement("div");//新建div
        NewdivNode.className = "youXiaJiao";
        var aNode=document.createElement("a");
        aNode.href="javascript:;";
        aNode.title="更新缓存";
        NewdivNode.appendChild(aNode);
        DivCheckNodes[0].insertBefore(NewdivNode,perDivNode[0]);
        console.log("加载youXiaJiao成功");
        addStyle(".youXiaJiao{position:fixed; _position:absolute; bottom:30px; right:0px; width:150px; height:75px; display:inline-block;}.youXiaJiao a,.youXiaJiao a:link{width:150px;height:195px;display:inline-block; background-color:#41c12f; outline:none;}.youXiaJiao a:hover{width:150px; height:195px; background-color:#ff0000; outline:none;}");
        $(".youXiaJiao").click(function(){
            $.ajax({
                url:edit_url_updata+"&sid="+Math.random(),//加随机可以避免被服务器Ban
                type:'GET',
                dataType:'JSON',
                success: function(data){
                    GLOBAL.ShowMsg('成功刷新缓存');
                    //使右下角变黑好区分是否更新过缓存
                    addStyle(".youXiaJiao{position:fixed; _position:absolute; bottom:30px; right:0px; width:150px; height:75px; display:block;}.youXiaJiao a,.youXiaJiao a:link{width:150px;height:195px;display:inline-block; background-color:#000000; outline:none;}.youXiaJiao a:hover{width:150px; height:195px; background-color:#ff0000; outline:none;}");
                    $('title').text('缓存已更新');
                    $('html').scrollTop(0);
                }
            });
            change_ICO();

        });
    }

    function addStyle(css) { //添加CSS的代码--copy的
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        console.log("CSS已加载");
        return document.insertBefore(pi, document.documentElement);
    }

    function addNode(){
        //加样式
        addStyle(".order_num span {position: relative;}.order_num strong {vertical-align: top;font-size: 18px;margin-left: 8px;}.order_num input {position: absolute;visibility: hidden;}.order_num label{display: inline-block;width: 20px;height: 20px;border: 1px solid #ff7e00; margin-left: -15px;} .order_num input:checked+label:after {content: ' ';position: absolute;left: 3px;bottom: 16px;width: 18px;height: 2px; border: 3px solid #2866bd;margin-left: -15px;border-top-color: transparent;border-right-color: transparent; -ms-transform: rotate(-60deg); -moz-transform: rotate(-60deg); -webkit-transform: rotate(-60deg); transform: rotate(-45deg);}");
        setTimeout(function(){
            var checkNodes = document.querySelectorAll(".order_num");
            console.log("节点长度"+checkNodes.length);
            for(var i = 0; i < checkNodes.length; i++){
                var insFaNode = document.createElement("span");//新建span
                insFaNode.className="span_me";
                var perNode = checkNodes[i];
                var inputNode = perNode.querySelector("input");
                perNode.insertBefore(insFaNode, inputNode.nextElementSibling);//insertBefore(newItem,existingItem) input前新建插入span
                insFaNode.appendChild(inputNode);//加入Input
                inputNode.id = "check"+i;//加入input-id
                var insLabelNode = document.createElement("label");//新建label
                insLabelNode.setAttribute("for", "check"+i);//加入label-id
                insFaNode.appendChild(insLabelNode);//向Span节点的子节点列表的末尾添加新的label节点
            }
        }, 1000);
    }

    //添加微云链接
    function addWeyun(){
        setTimeout(function(){
            var match_lixian=$("div.h").text();
            var match_riju=match_lixian.match("Chi_Jap");
            var match_yizhizu=match_lixian.match("译制组");
            var match_xiaomada=match_lixian.match("小马达字幕组");
            var match_Luckydag=match_lixian.match("Luckydag");
            var weyun_href_last=$(".download_way").children("a:last").attr("href");//获取微云href 最后一个
            var weyun_href_first=$(".download_way").children("a:last-child").attr("href");//第一个S01E01这样
            if(match_riju=="Chi_Jap"||match_yizhizu=="译制组"||match_xiaomada=="小马达字幕组"||match_Luckydag=="luckydag"){
                addStyle("input[name='115'] {box-shadow: inset 0 0 20px 20px rgb(134, 132, 132)}");
                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = 'https://i.loli.net/2018/06/02/5b11857d45659.png';
                document.getElementsByTagName('head')[0].appendChild(link);
                console.log("当前是日剧页面或微云无需更新页面"+"match字符："+match_riju+match_yizhizu+match_xiaomada+match_Luckydag);
            }else{
                if(weyun_href_last!=null||weyun_href_first!=null){
                    var weiyun_last=weyun_href_last.split("/");
                    var weiyun_first=weyun_href_first.split("/");
                    if(weiyun_last[2]=="share.weiyun.com"||weiyun_last[2]=="url.cn"){
                        console.log("weyun_href_last提取的标识符为"+weiyun_last[2]+"|||当前的链接为："+weyun_href_last+"match字符："+match_riju+match_yizhizu+match_xiaomada+match_Luckydag);
                        $("[wayid='115']").val(weyun_href_last);//赋值添加页
                        $("[wayid='115']").click(function(){window.open(weyun_href_last);});
                        // $("[wayid='115']").before("<a href="+weyun_href_last+" target='_blank'>   【测试一下】-|-   </a>");
                        $(".f3.update").click(function(){
                            $("#app_115").val(weyun_href_last);//赋值修改页
                        });
                    }else if(weiyun_first[2]=="share.weiyun.com"||weiyun_first[2]=="url.cn"){
                        console.log("weyun_href_first提取的标识符为"+weiyun_first[2]+"|||当前的链接为："+weyun_href_first+"match字符："+match_riju+match_yizhizu+match_xiaomada+match_Luckydag);
                        $("[wayid='115']").val(weyun_href_first);//赋值添加页
                        $("[wayid='115']").click(function(){window.open(weyun_href_first);});
                        //$("[wayid='115']").before("<a href="+weyun_href_first+" target='_blank'>   【测试一下】-|-   </a>");
                        $(".f3.update").click(function(){
                            $("#app_115").val(weyun_href_first);//赋值修改页

                        });
                    }else{
                        console.log("Opps~没有微云链接！！！"+"当前match_riju为："+match_riju);
                        console.log("weyun_href_last提取的标识符为"+weiyun_last[2]+"|||当前的链接为："+weyun_href_last+"match字符："+match_riju+match_xiaomada+match_Luckydag);
                        console.log("weyun_href_first提取的标识符为"+weiyun_first[2]+"|||当前的链接为："+weyun_href_first+"match字符："+match_riju+match_xiaomada+match_Luckydag);
                    }
                }else{
                    console.log("当前是空白页面");
                }
            }
        },2000);

    }

    function addTips(){
        setTimeout(function(){
            //加最新一集是多少的提醒
            var epson_new=$("div.h").children("font.f3:last").text();
            var person_=$("span.f_r:last").text();
            var person_last=person_.split(" ");
            console.log("刷新TIPS成功: "+"最新集数："+epson_new+"修改时间："+person_last[0]);
            $("#woaini666").attr("value","最新集数："+epson_new+"修改时间："+person_last[0]);
            // $("select.items:odd").after("<input class='f101' id='woaini666'"+"最新集数："+epson_new+"修改时间："+person_last[0]+" />");
        },1000);
    }
    //no百度云
    function nobaiduyun(){
        setTimeout(function(){
            var match_lixian=$("div.h").children("label").text();
            var match_sangshizhiliao=match_lixian.match("丧尸治疗字幕组");
            var match_xiaomada=match_lixian.match("小马达字幕组");
            var match_Fantopia=match_lixian.match("Fantopia字幕组");
            var match_xuan=match_lixian.match("玄字幕组");
            var match_Classic=match_lixian.match("Classic字幕组");
            var match_aisennao=match_lixian.match("艾森闹字幕组");
            var match_yimiba=match_lixian.match("一米八字幕组");
            var match_Luckydag=match_lixian.match("Luckydag");
            var match_lafeng=match_lixian.match("拉风字幕组");
            var match_lot=match_lixian.match("LOT");
            var match_fenggu=match_lixian.match("风骨字幕组");
            var match_lanxue=match_lixian.match("蓝血字幕组");
            var match_huanyue=match_lixian.match("幻月字幕组");
            var match_qiaomu=match_lixian.match("乔木字幕组");
            var match_da=match_lixian.match("D.A字幕组");
            var match_jihua=match_lixian.match("悸花字幕组");
            var match_yizhizu=match_lixian.match("译制组");
            if(match_yizhizu=="译制组"||match_sangshizhiliao=="丧尸治疗字幕组"||match_xiaomada=="小马达字幕组"||match_Fantopia=="Fantopia字幕组"||match_xuan=="玄字幕组"||match_Classic=="Classic字幕组"||match_aisennao=="艾森闹字幕组"||match_yimiba=="一米八字幕组"||match_Luckydag=="Luckydag"||match_lafeng=="拉风字幕组"||match_lot=="LOT"||match_fenggu=="风骨字幕组"||match_lanxue=="蓝血字幕组"||match_huanyue=="幻月字幕组"||match_qiaomu=="乔木字幕组"||match_da=="D.A字幕组"||match_jihua=="悸花字幕组"){
                addStyle("input[name='102'] {box-shadow: inset 0 0 20px 20px rgb(134, 132, 132)}");
                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = 'https://i.loli.net/2018/06/02/5b1185e65b43b.png';
                document.getElementsByTagName('head')[0].appendChild(link);
                console.log("百度云当前匹配到的为："+match_sangshizhiliao+match_xiaomada+match_Fantopia+match_xuan+match_Classic+match_aisennao+match_yimiba+match_Luckydag+match_lafeng+match_lot+match_fenggu+match_lanxue+match_huanyue+match_qiaomu+match_da+match_jihua+match_yizhizu);
            }else{
                console.log("百度云可以更新");
            }
        },1000);

    }
    //no范特西
    function nofantasy(){
        setTimeout(function(){
            var match_lixian=$("div.h").children("label").text();
            var match_cod=match_lixian.match("cod字幕组");
            var match_sangshizhiliao=match_lixian.match("丧尸治疗字幕组");
            var match_xiaomada=match_lixian.match("小马达字幕组");
            var match_Luckydag=match_lixian.match("Luckydag");
            var match_lafeng=match_lixian.match("拉风字幕组");
            var match_yizhizu=match_lixian.match("译制组");
            var match_fenggu=match_lixian.match("风骨字幕组");
            var match_lanxue=match_lixian.match("蓝血字幕组");
            var match_huanyue=match_lixian.match("幻月字幕组");
            var match_mandi=match_lixian.match("漫迪字幕组");
            var match_union=match_lixian.match("UnIon字幕组");
            var match_dihuan=match_lixian.match("Deefun迪幻字幕组");
            var match_jiemeihua=match_lixian.match("波旁姐妹花字幕组");
            var match_qiaomu=match_lixian.match("乔木字幕组");
            var match_tunan=match_lixian.match("图南字幕组");
            var match_da=match_lixian.match("D.A字幕组");
            var match_jihua=match_lixian.match("悸花字幕组");
            if(match_cod=="cod字幕组"||match_qiaomu=="乔木字幕组"||match_sangshizhiliao=="丧尸治疗字幕组"||match_xiaomada=="小马达字幕组"||match_Luckydag=="Luckydag"||match_lafeng=="拉风字幕组"||match_yizhizu=="译制组"||match_fenggu=="风骨字幕组"||match_lanxue=="蓝血字幕组"||match_huanyue=="幻月字幕组"||match_mandi=="漫迪字幕组"||match_union=="UnIon字幕组"||match_dihuan=="Deefun迪幻字幕组"||match_jiemeihua=="波旁姐妹花字幕组"||match_tunan=="图南字幕组"||match_da=="D.A字幕组"||match_jihua=="悸花字幕组"
              ){
                addStyle("input[name='114'] {box-shadow: inset 0 0 20px 20px rgb(134, 132, 132)}");
                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = 'https://i.loli.net/2018/06/02/5b1185e65b43b.png';
                document.getElementsByTagName('head')[0].appendChild(link);
                console.log("范特西当前匹配到的为："+match_cod+match_sangshizhiliao+match_xiaomada+match_Luckydag+match_lafeng+match_yizhizu+match_fenggu+match_lanxue+match_huanyue+match_mandi+match_union+match_dihuan+match_jiemeihua+match_qiaomu+match_tunan+match_da+match_jihua);
            }else{
                console.log("范特西可以更新");
            }
        },1000);


    }
    //修改图标
    function change_ICO() {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'https://i.loli.net/2018/06/02/5b118618404b6.png';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    //修改episode下拉框的样式
    function change_episode(){
        setTimeout(function() {
            var season_cunzai=$("select[name='season']:not(#m_season)").attr("class");
            console.log(season_cunzai)
            if(season_cunzai!=null){
                $("select[id='m_episode']").attr("name","m_episode");
                var tips_input="<input class='f101' id='woaini666' type='button' value='最新集数???'>"
                $("select[name='episode']").before(tips_input)
                $("select[name='episode']").remove();//删除集数框
                var episode = "当前集数为(自由调节)：<input onmouseover='this.select();' type='number' name='episode' class='items' min='0' max='266' value='1' /> <br>"
                $("select[name='season']:not(#m_season)").after(episode);
                addStyle("input[name='episode'] {color: #f9fd00;box-shadow: inset 0 0 0px 20px rgb(0, 0, 0);");
                $("select[id='m_episode']").attr("name","episode");
                console.log("成功change_episode——————————————")
            }else{
                console.log("电影和单剧不change_episode了再见兄弟")
            }
        },1000);
    }
    //修改[保存][修改][取消]按钮样式
    function Change_updata(){
        setTimeout(function(){
            addStyle(".bubbly-button {  font-family: 'Helvetica', 'Arial', sans-serif;  display: inline-block;  font-size: 1em;  padding: 1em 2em;  -webkit-appearance: none;  appearance: none;  background-color: #ff0081;  color: #fff;  border-radius: 4px;  border: none;  cursor: pointer;  position: relative;  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);}.bubbly-button:focus {  outline: 0;}.bubbly-button:before, .bubbly-button:after {  position: absolute;  content: '';  display: block;  width: 140%;  height: 100%;  left: -20%;  z-index: -1000;  transition: all ease-in-out 0.5s;  background-repeat: no-repeat;}.bubbly-button:before {  display: none;  top: -75%;  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;}.bubbly-button:after {  display: none;  bottom: -75%;  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);  background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;}.bubbly-button:active {  transform: scale(0.9);  background-color: #e60074;  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);}.bubbly-button.animate:before {  display: block;  animation: topBubbles ease-in-out 0.75s forwards;}.bubbly-button.animate:after {  display: block;  animation: bottomBubbles ease-in-out 0.75s forwards;}@keyframes topBubbles {  0% {    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;  }  50% {    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;  }  100% {    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;  }}@keyframes bottomBubbles {  0% {    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;  }  50% {    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;  }  100% {    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;  }}");
            $(".f3.delete").remove();
            $(".f3.update").text("");
            $(".f3.update").append("<button class='bubbly-button'>修改</button>");

            $(".f3.update").click(function(){
                $("#form_save").before("<a class='bubbly-button' id='woaini1'>保存</a>");
                $("#form_cancel").after("<a class='bubbly-button' id='woaini2'>取消</a>");
                $("#form_save").remove();
                $("#form_cancel").remove();


                $("a#woaini2.bubbly-button").click(function() {
                    $("#modify_container").hide();
                });
                $("a#woaini1.bubbly-button").click(function() {
                    var o = {};
                    o.way = [];
                    if (app_resource == 1) {
                        o.format = "APP";
                    }
                    $("#modify_container .items").each(function() {
                        o[$(this).attr("name")] = $.trim($(this).val());
                    });
                    $("#modify_container #m_way").find(".form-data").each(function() {
                        var s = $(this).find(".data-address").attr("name");
                        var p = $.trim($(this).find(".data-address").val()) == $(this).find(".data-address").attr("rel") ? "" : $(this).find(".data-address").val();
                        if (p == "") {
                            return;
                        }
                        var r = $(this).find(".data-passwd");
                        if (r.length > 0) {
                            var q = $(this).find(".data-passwd").val();
                            o.way.push({
                                id: s,
                                address: $.trim(p),
                                passwd: $.trim(q)
                            });
                        } else {
                            o.way.push({
                                id: s,
                                address: $.trim(p)
                            });
                        }
                    });

                    GLOBAL.Loading("show");
                    $.post(GLOBAL.CONST.WWW_URL + "release/resource/update", {
                        item: o,
                        channel: channel,
                        rid: rid
                    }, function(p) {
                        GLOBAL.Loading("hide");
                        if (p.status == 1) {
                            GLOBAL.ShowMsg("资源保存成功");
                            location.reload();

                        } else {
                            GLOBAL.ShowMsg(p.info);
                        }
                    }, "json");
                });
            });
        },1000);
    }

})();