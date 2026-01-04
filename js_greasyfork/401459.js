// ==UserScript==
// @name   whut相关网站优化
// @version      0.4.1
// @description  1.进入选课系统不用等待30秒。2.可以查看课程对应的推荐班级。3.评教模块。4.大物实验视频播放页提供下载按钮.5.成绩查询界面
// @namespace TheFirstVoyageOfTheArk
// @author       NoahSuo
// @include http*://218.197.102.183/Course/login.do?msg=*
// @include http*://202.114.50.130/EOT/login.do?msg=*
// @include http*://202.114.50.130/Score/login.do?msg=*
// @include http*://jxpt.whut.edu.cn:81/meol/common/stream/player.jsp?fileId=*
// @require http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/401459/whut%E7%9B%B8%E5%85%B3%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/401459/whut%E7%9B%B8%E5%85%B3%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

$(document).ready(function(){
    //添加样式
    (function(){
    var css = document.createElement('style');
    css.type='text/css';
    css.innerHTML=`.mybutton{background: #2866bd;color: #fff;text-align: center;border: 2px solid #E5E5E5;display: inline-block;cursor:pointer;}`;
    document.getElementsByTagName('head')[0].appendChild(css);})();

    //评教模块
    if(/202.114.50.130\/EOT\/login.do\?msg/g.test(window.location.href)){
        $($("ul.nav").children()[4]).after(`<li id="myuser"><input type="submit" class="mybutton" value="查看状态"></li>`);
        $($("ul.nav").children()[5]).click(
            function(){
                $('tr',$('tbody')[1]).each(function(){
                    let start = $('td',this)[3].textContent;
                    let end = $('td',this)[4].textContent;
                    let state = $('td',this)[5];
                    let current = (new Date()).formatDate("y-MM-dd");
                    if(current>end){
                        if(state.textContent=="未评") state.innerHTML='<div style="background-color:red;">评教时间已过</div>';
                        return;
                    }
                    else if(current>start){
                        if(state.textContent=="未评") state.innerHTML='<div style="background-color:green;">可以评教</div>';
                        return;
                    }
                    else{
                        if(state.textContent=="未评") state.innerHTML='<div>评教未开始</div>';
                        return;
                    }
                })
            }
        )
        $($("ul.nav").children()[5]).after(`<li id="yijianpingjiao"><input type="submit" class="mybutton" value="一键评教"><span id="setting" style="
        background-color: #2866bd;color: white;border: 2px solid #E5E5E9;display: inline-block;line-height: 20px;padding-top: 1px;cursor: pointer;">▼</span></li>`);
            $('body').append(`
            <div id="setting-container" style="position: fixed;top: 3.7vw;right: 8.8vw; ">
                <div id="setting-content" style="display:none;">
                    <div id = "setting-main" style="background: -webkit-gradient(linear,0 0,0 100%,from(#2866bd),to(#F2F2F7));">
                        <fieldset id = "setting-field" style = "display:block;">
                            <legend class="iframe-father"><a class="linkhref" href="https://www.ntaow.com/aboutscript.html" target="_blank">一键评教设置</a></legend>
                            <ul class="setting-main">
                                <li title="选择方式">
                                    <label title="全选A"><input name="sl-method" id="pingjiao-A" type="radio" checked="">全选A</label>
                                    <label title="全选B"><input name="sl-method" id="pingjiao-B" type="radio">全选B</label>
                                    <label title="全选C"><input name="sl-method" id="pingjiao-C" type="radio">全选C</label>
                                    <label title="全选D"><input name="sl-method" id="pingjiao-D" type="radio">全选D</label>
                                    <label title="随机选"><input  name="sl-method" id="pingjiao-R" type="radio">随机选</label>
                                </li>
                            </ul>
                        </fieldset>
                    </div>
                </div>
            </div>
        `)
        let setting = $($("ul.nav").children()[6]).children()[1];
        let pj_action = $($("ul.nav").children()[6]).children()[0];
        $(setting).click(function(){let content = $('#setting-content');
        if(content.css("display")=="none") content.css("display","block");else content.css("display","none")
        });
        $(pj_action).click(function(){let sel = $('input[name="sl-method"]').index($('input[name="sl-method"]:checked'));
            let items = $(".unit",$('.pageFormContent'));
            for (let i = 0; i < 10; i++) {
                if(sel==4) {$(items[i].children[Math.floor(Math.random()*4)]).click();continue;}
                $(items[i].children[sel]).click()
             }
        });
    }
    //选课系统
    if(/218.197.102.183\/Course\/login.do\?msg/g.test(window.location.href)){
        (function(){var e = document.getElementById("MyDiv").children[0];
    e.outerHTML = `<div style="text-align: right; cursor: default; height: 15px;">
    <h1 style="font-size: 20px;"
    onclick="CloseDiv('MyDiv','fade')">关闭</h1></div>`})();

    $($("ul.nav").children()[3]).after(`<li id="myuser"><input type="submit" class="myuserconfig" value="排课班级" style="background: #2866bd;
        color: #fff;text-align: center;border: 2px solid #E5E5E5;display: inline-block;cursor:pointer;"></li>`);
    $($("ul.nav").children()[4]).click(
        function(){
            $("div[title='备注']").first().text("排课班级");
            $('tr[target="suid_obj"]').each(
                function(){
                    let tr = $(this).contents()
                    function commentFilter(){
                        var str = "";
                        tr.filter(function() {
                            if(this.nodeType==8) str = this.data;
                          })
                          return str;
                    }
                    let banji = commentFilter().match(/>(.*)</gs)[0].slice(1,-1);
                    $("td",$(this)).eq(-2).text(banji);
                }
            )
        }
    )
    }

    //物理实验网站
    if(/jxpt.whut.edu.cn:81\/meol\/common\/stream\/player\.jsp\?fil/g.test(window.location.href)){
        $(".header").after(`<div id="myuser" style="float: right;"><input type="submit" class="mybutton" value="下载视频"></div>`)
        $("#myuser").click(function(){window.open($('video').attr('src'));})
    }

    //成绩查询
    if(/202.114.50.130\/Score\/login.do\?msg/g.test(window.location.href)){
    $($("ul.nav").children()[4]).after(`<li id="myuser"><input type="submit" class="myuserconfig" value="自我安慰" style="background: #2866bd;
        color: #fff;text-align: center;border: 2px solid #E5E5E5;display: none;cursor:pointer;"></li>`);
    $(".accordionContent:eq(0)>ul>li:eq(0)>ul:eq(0)>li:eq(0) a").click(
        function(){
            $($(".myuserconfig")[0]).css("display","inline-block");//点亮图标
            $($(".myuserconfig")[0]).val("自我安慰");
        }
    );
    $($('*[href="xskwxfList.do"]')[0]).click(
        function(){
            $($(".myuserconfig")[0]).css("display","inline-block");//点亮图标
            $($(".myuserconfig")[0]).val("计算课外学分总和");
        }
    );
    $($("ul.nav").children()[5]).click(
        function(){
            if($($(".myuserconfig")[0]).val()=="自我安慰"){
                let trs=$("tr",$("tbody")[1]);
                $(trs).each(
                    function(){
                        let tds = $("td",this)
                        if($(tds[3]).text()=="实践课"){
                            console.log($(tds[2]).text());
                            $(tds[6]).text("完美");
                        }
                        else $(tds[6]).text(100);
                        $(tds[8]).text(100);
                        $(tds[9]).text(100);
                        $(tds[13]).text("5.0");
                        }
                )
            }
            else if($($(".myuserconfig")[0]).val()=="计算课外学分总和"){
                let trs=$("tr",$("tbody")[1]);
                let sum=0;
                $(trs).each(
                    function(){
                        sum+=parseFloat($($("td",this)[5]).text());
                        console.log($($("td",this)[5]).text());
                    }
                );
                alert(sum);
            }
        }
    )
    }
});