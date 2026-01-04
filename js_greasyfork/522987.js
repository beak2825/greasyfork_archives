// ==UserScript==
// @name         热线智能助手-十堰
// @namespace    123
// @version      1.0.2
// @description  十堰个性化
// @author       lucw
// @match        http://10.254.13.73:9001/sy12345/hx/order/hotline/hotLine/index*
// @match        http://10.254.13.90:18081/sy12345/hx/order/hotline/hotLine/index*


// @resource     smartIndexCss  http://218.4.136.124:8300/cns-bmfw-web-sda/css/smartAssistant.css
// @resource     mustache http://218.4.136.124:8300/cns-bmfw-web-sda/js/mustache.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @grant        GM_getResourceText
//// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/522987/%E7%83%AD%E7%BA%BF%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B-%E5%8D%81%E5%A0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/522987/%E7%83%AD%E7%BA%BF%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B-%E5%8D%81%E5%A0%B0.meta.js
// ==/UserScript==
(function (win) {
    "use strict";

    // Your code here...
    console.log("油猴启动~！本地测试版本");

       // ————————————————————————————————————添加 插件的css————————————————————————————————————
        const smartIndexCss = GM_getResourceText("smartIndexCss");
      GM_addStyle(smartIndexCss);
    // 添加 插件 js
      const script = document.createElement('script');
      script.src = GM_getResourceURL("mustache");
      document.body.appendChild(script);

      var style=`@charset "UTF-8";
    //————————————————————————————————————定义参数————————————————————————————————————

    // region 基础方法
    var mini = win.mini,
        $ = win.$,
        epoint = win.epoint,
        SrcBoot = win.SrcBoot,
        document = win.document,
        s_Html = win.s_Html,
        JSON = win.JSON,
        window_url = win.location.href,
        Mustache = window.Mustache,
        website_host = win.location.host;`

       // 创建一个新的元素
    let newStyle1 = document.createElement('style');

    // 设置元素的属性和内容
    newStyle1.innerHTML = style;

    // 将新元素添加到 body 中
    document.body.appendChild(newStyle1);



    // ————————————————————————————————————增加html结构————————————————————————————————————
    var html=`<div class="ew-main">
      <div class="work hidden move-btn" id="moveBtn">
        <!-- 智能图标 -->
        <div class="ico tipbtn grey" id="conditionBtn">
          <span></span>
          <i></i>
        </div>
        <!-- 智能回填按钮 -->
        <div class="btnbox">
          <span class="info">AI智能助手</span>
        </div>
        <!-- 智能回填内容 -->
        <div class="ctbox">
            <div class="tooltipnew" id="tooltipnew">
      </div>
         <div class="cttop">
            <div class="cthead">
             <p class="hd-title">座席智能助手</p>
             <p class="hd-delete"></p>
            </div>
            <div class="hd-mid">
                <ul class="ctnav" id="ctnav">
                 </ul>
                   <!-- by edit xlm -->
                 <i class="seticon"></i>
            </div>
         </div>
         <!-- 转译 十堰暂时注释-->
        <!--    <div class="cttransfer empty" id="cttransfer">
           <ul class="chattalk" id="chattalk">
           </ul>
          </div> -->
          <!-- 要素 -->
         <div class="keypoint empty" id="onSmartCodeRender">
          <button class="refreshremand start">开始推荐</button>
         </div>
         <!-- 设置 by edit xlm -->
         <div class="setbox hidden">
           <div class="setinfo" id="setinfo">
           </div>
           <button class="saveset">应用</button>
        </div>
         <!-- 遮罩层 by edit xlm -->
         <div class="ctmask hidden">
            <p class="ctmasktitle">应用中...</p>
         </div>
          </div>
        </div>

      </div>
       <div class="nicechild" id="nicechild">
    </div>

      <!-- 设置模版 by edit xlm -->
    <script type="text/template" id="setinfo-temp">
          <div class="setitem">
             <div class="setitem-hd">
              <p class="setname">导航栏</p>
               <p class="settip">注：至少保留1个</p>
             </div>
             <div class="setitem-bd">
              <div class="setitem-bd-item">
               <span class="item-name">实时转译</span>
                <i class="itemicon {{#isshowzy}}switch-on {{/isshowzy}} {{^isshowzy}}switch-off{{/isshowzy}}"></i>
              </div>
                 <div class="setitem-bd-item">
               <span class="item-name">要素提取</span>
                <i class="itemicon {{#isshowys}}switch-on {{/isshowys}} {{^isshowys}}switch-off{{/isshowys}}"></i>
              </div>
                  <div class="setitem-bd-item">
               <span class="item-name">知识推荐</span>
                <i class="itemicon {{#isshowzs}}switch-on {{/isshowzs}} {{^isshowzs}}switch-off{{/isshowzs}}"></i>
              </div>
                  <div class="setitem-bd-item">
               <span class="item-name">历史工单</span>
                <i class="itemicon {{#isshowls}}switch-on {{/isshowls}} {{^isshowls}}switch-off{{/isshowls}}"></i>
              </div>
                   <div class="setitem-bd-item">
               <span class="item-name">查重工单</span>
                <i class="itemicon {{#isshowcc}}switch-on {{/isshowcc}} {{^isshowcc}}switch-off{{/isshowcc}}"></i>
              </div>
              </div>
           </div>
               <div class="setitem">
             <div class="setitem-hd">
              <p class="setname">转译和要素显示方式</p>
             </div>
             <div class="setitem-bd">
              <div class="custom-radio">
                <input type="radio" id="option1" value="1" {{#issplit}}  checked {{/issplit}} name="custom-radio">
                <label for="option1">多标签页分开显示</label>
              </div>
            <div class="custom-radio">
               <input type="radio" id="option2" {{^issplit}} value="2" checked {{/issplit}} name="custom-radio">
               <label for="option2">单标签页内同时显示</label>
            </div>
              </div>
           </div>
          <div class="setitem">
             <div class="setitem-hd">
              <p class="setname">要素提取智能推荐</p>
               <p class="settip">注：至少保留1个</p>
             </div>
             <div class="setitem-bd">
                <div class="setitem-bd-item">
               <span class="item-name">标题识别</span>
                <i class="itemicon {{#isshowtitle}}switch-on {{/isshowtitle}} {{^isshowtitle}}switch-off{{/isshowtitle}} "></i>
              </div>
                 <div class="setitem-bd-item">
               <span class="item-name">内容总结</span>
                <i class="itemicon {{#isshowcontent}}switch-on {{/isshowcontent}} {{^isshowcontent}}switch-off{{/isshowcontent}}"></i>
              </div>
                 <div class="setitem-bd-item">
               <span class="item-name">归口推荐</span>
                <i class="itemicon {{#isshowgk}}switch-on {{/isshowgk}} {{^isshowgk}}switch-off{{/isshowgk}}"></i>
              </div>
              <div class="setitem-bd-item">
               <span class="item-name">部门推荐</span>
                <i class="itemicon {{#isshowbm}}switch-on {{/isshowbm}} {{^isshowbm}}switch-off{{/isshowbm}}"></i>
              </div>
              </div>
           </div>
 </script>
      <!-- tab模版 by edit xlm -->
    <script type="text/template" id="ctnav-temp">
     {{^issplit}}
     <li class="ctitem active" data-type="0">转译&要素</li>
     {{/issplit}}
     {{#issplit}}
     {{#isshowzy}}
     <li class="ctitem active" data-type="1">转译</li>
     {{/isshowzy}}
     {{#isshowys}}
     <li class="ctitem"  data-type="2">要素</li>
     {{/isshowys}}
     {{/issplit}}
     {{#isshowzs}}
     <li class="ctitem"  data-type="3">知识</li>
     {{/isshowzs}}
     {{#isshowcc}}
     <li class="ctitem"  data-type="4">查重</li>
      {{/isshowcc}}
      {{#isshowls}}
     <li class="ctitem"  data-type="5">历史</li>
      {{/isshowls}}
     </script>
      <!-- 部门推荐，归口推荐悬浮模版 -->
    <script type="text/template" id="tooltip-temp">
     <p class="nicename">{{fullname}}</p>
      <p class="niceper">推荐率：<span>{{probability}}</span></p>
      {{#isshow}}
      <p class="niceyy {{id}}" data-code="{{code}}" id="{{id}}" data-fullname="{{fullname}}">点击可直接引用</p>
      {{/isshow}}
     </script>
     <!-- 转译模版 -->
    <script type="text/template" id="chattalk-temp">
    {{#.}}
      <li class="chattalkitem {{role}}">
               {{#.}}
               <p class="talktime">{{time}}</p>
               {{/.}}
                <div class="flex">
                   <div class="talkcontent">{{content}}</div>
                </div>
      </li>
    {{/.}}
     </script>
      <!-- 智能回填内容--推荐中模板 -->
    <script type="text/template" id="remanding-temp">
          <div class="ht-form">
          <div class="el-form-box">
             <div class="el-form-top">
               <span class="form-label-name"> 工单标题</span>
               <div class="form-btns">
                <button type="button" class="self-btn ent" id="gdbt-ent">填入</button>
                 <i class="form-split"></i>
                 <button type="button" class="self-btn copy" id="gdbt-copy">复制</button>
               </div>
             </div>
            <div class="form-item-con">
              <input type="text" placeholder="待推荐" class="ew-inp" id="gdbt-content" disabled value="" />
            </div>
          </div>
          <div class="el-form-box">
          <div class="el-form-top">
           <span class="form-label-name"> 诉求内容</span>
            <div class="form-btns">
              <button type="button" class="self-btn ent" id="sqnr-ent">
                填入
              </button>
              <i class="form-split"></i>
              <button type="button" class="self-btn copy" id="sqnr-copy">
                复制
              </button>
             </div>
          </div>
            <div class="form-item-con">
              <textarea
                class="ew-textarea"
                placeholder="待推荐"
                disabled
                id="sqnr-content"
              ></textarea>
            </div>
          </div>
          <div class="el-form-box">
           <div class="el-form-top">
            <span class="form-label-name"> 归口推荐</span>
            </div>
            <div class="form-item-con">
             <input type="text" placeholder="待推荐" class="ew-inp ew-grey" id="gk-content" disabled value="" />
            </div>
          </div>
          <div class="el-form-box">
           <div class="el-form-top">
            <span class="form-label-name"> 部门推荐</span>
            </div>
            <div class="form-item-con">
             <input type="text" placeholder="待推荐" class="ew-inp ew-grey" id="bm-content" disabled value="" />
            </div>
          </div>
           </div>
          <div class="form-botom-btn">
            <button type="button" class="htbtn" id="htbtn">
               智能回填
           </button>
          </div>
    </script>
    <!-- 智能回填内容--模板 -->
    <script type="text/template" id="onSmartCodeRender-temp">
      {{#.}}
         <div class="ht-form">
          <div class="el-form-box">
            <div class="el-form-top">
            <span class="form-label-name">工单标题</span>
              <div class="form-btns">
               <button type="button" class="self-btn ent" id="gdbt-ent">填入</button>
                <i class="form-split"></i>
                <button type="button" class="self-btn copy" id="gdbt-copy">复制</button>
               </div>
             </div>
            <div class="form-item-con">
              <input type="text" placeholder="请输入" class="ew-inp" id="gdbt-content" value="{{title}}" />
            </div>
          </div>
          <div class="el-form-box">
             <div class="el-form-top">
            <span class="form-label-name"> 诉求内容</span>
             <div class="form-btns">
               <button type="button" class="self-btn ent" id="sqnr-ent">
                填入
              </button>
              <i class="form-split"></i>
              <button type="button" class="self-btn copy" id="sqnr-copy">
                复制
              </button>
              </div>
              </div>
            <div class="form-item-con">
              <textarea
                class="ew-textarea"
                placeholder="请输入"
                id="sqnr-content"
              >{{content}}</textarea>

            </div>
          </div>
          <div class="el-form-box">
            <span class="form-label-name"> 归口推荐</span>
            <div class="form-item-con">
              <div class="nice" id="gktj">
                {{#accordtypeList}}
                <div class="item">
                  <span class="info gkclick" data-code="{{AccordtypeCode}}" data-id="gkclick" data-fullname="{{fullname}}" data-probability="{{Probability}}" data-isshow="{{isshow}}">{{newname}}</span>
                </div>
                {{/accordtypeList}}
              </div>
            </div>
          </div>
          <div class="el-form-box">
            <span class="form-label-name"> 部门推荐</span>
            <div class="form-item-con">
              <div class="nice oubm" id="bmtj">
              {{#ouList}}
                <div class="item ">
                  <span class="info bmclick" data-code="{{ouguid}}" data-id="bmclick" data-fullname="{{ouname}}" data-probability="{{Probability}}">{{ouname}}</span>
                </div>
                {{/ouList}}
              </div>
            </div>
          </div>
        </div>
           <div class="form-botom-btn">
            <button type="button" class="htbtn linght" id="smart-ent">
               智能回填
           </button>
          </div>
      {{/.}}
    </script>`;
    // 创建一个新的元素
    let newDiv = document.createElement('div');

    // 设置元素的属性和内容
    newDiv.innerHTML = html;

    // 将新元素添加到 body 中
    document.body.appendChild(newDiv);


    //------------------------------------------------------------------------基础方法-----------------------------------------------------------------------------

 // 去除html标签中的换行符和空格
    function clearHtml (html) {
      return html
        .replace(/(\r\n|\n|\r)/g, '')
        .replace(/[\t ]+</g, '<')
        .replace(/>[\t ]+</g, '><')
        .replace(/>[\t ]+$/g, '>');
    }

     /**
     * Mustache 模板渲染
     * @param {String} tpl 模板，可以是模板字符串，也可以是定义模板的父元素的 id 选择器，即形如 "#tplid"
     * @param {Object} data 模板数据
     * @param {String} target 可选参数。要渲染到的目标对象，可以是目标对象的 jQuery 选择器，也可以是 dom 对象。如果不传该参数，则模板不会自动渲染。
     * @returns {String} 生成的模板字符串
     */
     function render(tpl, data, target) {
        var html = '';
        if (tpl.indexOf('#') === 0) {
            tpl = clearHtml($(tpl).html());
        }
        html = Mustache.render(tpl, data);
        if (target) {
            $(target).html(html);
        }
        return html;
    }


    // ————————————————————————————————————页面js逻辑————————————————————————————————————
    // 参数
    var $btnbox = $(".ew-main").find(".btnbox");
    var $ctbox = $(".ew-main").find(".ctbox");
    var $moveBtn = $("#moveBtn");
    var resizeTimer = null;//点击防抖
    var infolist=0;
    var infotimeout=null;
    var infoout=null;
    var onlyGetOnceMsg=0;//只调用一次大模型数据

    // ————————————————————————————————————初始化判断是否打开了“坐席助手”并且调用接口正确返回了解析数据————————————————————————————————————
  function isOpenSmartHelp(iszy){
    if(1){
        // 十堰个性化
         var str = "";
        //var str="您好，请问有什么可以帮您？喂你好。好请讲我是是我是竹山县擂鼓镇金陵村村民，我叫张飞。竹山县擂鼓镇他们金岭村。好的。黄金的金吗？山岭的岭。哎对对，金岭村。吉林成原来的老地方，青山走，市民，呃CHARLIE张飞。嗯好的，反映下问题。嗯我们这以前是沿河的公道，是我们当地老百姓的出行通道。他现在修活体，把整个的肉鸭到现在车子都没法走。沿河街道是吧？呃沿河通道。通道修路家的事吗？嗯他现在的大型设备把人拉挖机呀，铲车啊压着我的车子都不能走。现在在做什么治理啊？你要河道这里是吧？河道治理。对，一直不给老百姓一个说法。现在我是我车子都不能进来了，现在。现在都还在治理当中，还是说已经施工完毕了？在治理当中，但是老百姓已经走过他的路，现在也没给我说法。今天又在施工了，他们。现在还在治理当中。那一般情况都是治理完毕之后统一恢复这个路面呀。统一回复路边他没给我说法，他也没说给我，他说修补，这是不可能修补的。整个楼面全部毁坏。所以说您现在主要想要给个说法是吧？对就是不管是说呃结束之后进行维修，还是说是嗯怎么样？就是说需要一个明确的答复给到您是吗？哎现在需要一个明确的答复给我。嗯好，明白了，您刚刚说您是姓张，嗯张飞是吗？对对。嗯好，张先生，那您反映的这个情况这边登记了，会帮您反映相关部门进行核实。具体什么情况？承办单位核实清楚之后跟您联系，您这边耐心等待。好好的好的。嗯好的嗯好好再见。嗯好再见。";
         var $robot_list= $("#tab_5").find(".box-content");
            // 2. 提取HTML
         var htmlArray = $.map($robot_list, function(element) {
             return $(element).html();
         });
            // 3、拼接html
        if(htmlArray.length>0){
            str =  htmlArray.join('。');
        }

        //4、去除空格和换行符
        str = str.replace(/\s+/g, '');


        if((status=="话后" || iszy) && str.length>0){
            var data= {
                "text":str,
                "city":"sy"
            };
            var requestData = JSON.stringify(data);

            $.ajax({
                url :"http://218.4.136.124:8300/cns-bmfw-web-sda/rest/gptApi/smarttd/getintegration",
                type: 'POST',
                dataType: 'json',
                contentType: "application/json",
                data: requestData,
                beforeSend: function() {

                },
                success : function(data) {
                    var custom = data.custom;
                    if(!data || !custom){
                            //失败给出提示
                        //添加动态球过度by edit 12/26
                        //当前颜色渐渐隐藏
                        $('.ew-main .work .ico i').animate({
                            opacity: 0.5
                        }, 1000,"swing",function(){
                            $(".tipbtn").addClass("error");
                        $(".tipbtn").removeClass("remandfinsh");
                        $(".btnbox").removeClass("remandfinsh");
                        $(".btnbox").addClass("error");
                        $(".tipbtn").removeClass("tipremading");
                        $(".btnbox>.info").text("推荐失败");
                        $(".keypoint").addClass("error");
                        $(".btnbox").removeClass("part");
                        var str='<button class="refreshremand restart">重新推荐</button>'
                        $(".keypoint").html(str);
                        $('.ew-main .work .ico.error i').animate({
                            opacity: 1
                        }, 1000)
                        })
                        return;
                    }
                    //判断是否有推荐
                    if(!(custom.title==''&& custom.content==''&& custom.accordtypeList.length==0 && custom.ouList.length==0)){
                        //添加动态过度效果---by edit 12/26
                        //判断是什么球变绿色
                        //红-绿
                        $('.ew-main .work .ico i').animate({
                            opacity: 0.5
                        }, 1000,"swing",function(){
                            $(".tipbtn").addClass("remandfinsh");
                            $(".btnbox").addClass("remandfinsh");
                            $(".btnbox").removeClass("part");
                            $(".tipbtn").removeClass("error");
                            $(".btnbox").removeClass("error");
                            $(".tipbtn").removeClass("noremand");
                            $(".btnbox").removeClass("noremand");
                            $(".tipbtn").removeClass("tipremading");
                            $(".btnbox>.info").text("推荐完成");
                            $(".keypoint").removeClass("error");
                            $(".keypoint").removeClass("noremand");
                            $(".keypoint").removeClass("empty");
                            $('.ew-main .work .ico i').animate({
                                opacity: 1
                            }, 1000)

                        })

                        // console.log(custom);
                        //处理归口推荐字段
                        $.each(custom.accordtypeList,function(index,item){
                            var name=item.fullname;
                            if(name.length > 23){
                                item.newname = name.substring(0,6) + "......" + name.substring(name.length-16,name.length);
                            }else{
                                item.newname=name;
                            }
                            // 十堰个性化，归口显示【点击可引用，部门不需要】
                            item.isshow = true;
                        })
                        //渲染表单
                        render("#onSmartCodeRender-temp",custom,"#onSmartCodeRender");
                        setform();
                        setTimeout(function() {
                            if($("#sqnr-content").length>0){
                                autoResizeTextarea($("#sqnr-content"));
                            }
                        }, 2000);
                    }else{
                        $('.ew-main .work .ico i').animate({
                            opacity: 0.5
                        }, 1000,"swing",function(){
                            $(".tipbtn").removeClass("error");
                            $(".btnbox").removeClass("error");
                            $(".btnbox").removeClass("part");
                            $(".tipbtn").removeClass("remandfinsh");
                            $(".btnbox").removeClass("remandfinsh");
                            $(".keypoint").removeClass("error");
                            $(".keypoint").removeClass("remandfinsh");
                            $(".tipbtn").addClass("noremand");
                            $(".btnbox").addClass("noremand");
                            $(".btnbox>.info").text("暂无推荐");
                            $(".tipbtn").removeClass("tipremading");
                            $(".keypoint").addClass("noremand");
                            $(".keypoint").html("");
                            var strbox='<button class="refreshremand">重新推荐</button>'
                            $(".keypoint").html(strbox);
                                $('.ew-main .work .ico i').animate({
                                opacity: 1
                            }, 1000)

                        })
                    }
                },
                complete:function(){
                    if($("#sqnr-content").length>0){
                        autoResizeTextarea($("#sqnr-content"));

                    }
                },
                error: function(xhr, status, error) {
                    //失败给出提示
                    $('.ew-main .work .ico i').animate({
                        opacity: 0.5
                    }, 1000, "swing", function() {
                        $(".tipbtn").addClass("error");
                        $(".tipbtn").removeClass("remandfinsh");
                        $(".btnbox").removeClass("remandfinsh");
                        $(".btnbox").addClass("error");
                        $(".tipbtn").removeClass("tipremading");
                        $(".btnbox>.info").text("推荐失败");
                        $(".keypoint").addClass("error");
                        $(".btnbox").removeClass("part");
                        $(".tipbtn").removeClass("noremand");
                        $(".btnbox").removeClass("noremand");
                        var str = '<button class="refreshremand">重新推荐</button>'
                        $(".keypoint").html(str);
                        $('.ew-main .work .ico.error i').animate({
                            opacity: 1
                        }, 1000)
                    })
                }

            });
            //todo：调用大模型接口
            console.log(str,"todo：wait调用大模型接口");
            //————————————————————操作请放在成功回调里————————————————————
            // 测试用：调用大模型接口返回了resdata;
            //————————————————————操作请放在成功回调里end————————————————————
        }
    }else{
        // 添加交互
        $btnbox.toggleClass("hidden");
        if ($btnbox.hasClass("hidden")) {
            $ctbox.addClass("hidden");
        } else {
            if ($btnbox.hasClass("active")) {
                $ctbox.removeClass("hidden");
            }
        }
    }
}


    //————————————————————————————————————动态获取输入框值————————————————————————————————————
      // 工单标题--容器（必须实时获取）
    function getGdbt(){
        var paragraphs = $('#title');
        return paragraphs;
    }

    // 诉求内容--容器（必须实时获取）
    function getSqnr(){
        var paragraphs = $("#contentText");
        return paragraphs;
    }
    //—————————————————————————————————————动态获取输入框值end————————————————————————————————————

    // 拖拽初始化
    $("#moveBtn").draggable({
        addClasses: false,
        containment: "body",
        drag: function(event, ui) {
            getview();
        }
    });

    // 复制功能
    function copyText(value){
        var val=value||"";
        var $temp = $('<textarea>');
        $("body").append($temp);
        $temp.val(val).select();
        document.execCommand("copy");
        $temp.remove();
    }

    // 页面初始化
    function initPage() {
        // $ctbox.addClass("hidden");
        $moveBtn.removeClass("hidden");

    }

    initPage();

    // 按钮面板打开状态-按钮点击事件
    $("body").on("click", "#conditionBtn", function (event) {

        var $button = $(this);
        // 获取按钮的位置
        var buttonOffset = $button.offset();
        var $conditionbtn=$('.tipbtn');
        //刚开始展开面板
        //设置ai智能推荐要一直能显示。
        if($(".btnbox").hasClass("show")){
            $(".btnbox").removeClass("show");
        }else{
            $(".btnbox").addClass("show");
        }
        //计算面板位置
        getview();
        $(".ctbox").slideToggle();
    });


    //点击推荐完成重新推荐
    var settime="";
    $("body").on("click", ".btnbox.remandfinsh,.refreshremand,.btnbox.error,.btnbox.noremand", function (event) {
        //by edit 12/26
        if($(this).hasClass("refreshremand")){
            $("#tooltipnew").text("正在为您推荐");
             //手动全部推荐，篮球自身闪烁

        }else{
            $("#tooltipnew").text("正在为您重新推荐");
        }
        $("#tooltipnew").addClass("green");
        $("#tooltipnew").css({

            display:'block'
        });
        setTimeout(function() {
            $("#tooltipnew").css("display","none");
        }, 3000);
        //先渲染内容推荐中
        $(".keypoint").removeClass("empty");
        $(".btnbox>.info").text("内容推荐中");
        $(".tipbtn").removeClass("remandfinsh");
        $(".btnbox").removeClass("remandfinsh");
        $(".tipbtn").removeClass("error");
        $(".btnbox").removeClass("error");
        $(".tipbtn").removeClass("noremand");
        $(".btnbox").removeClass("noremand");
        $(".tipbtn").addClass("tipremading");
        $(".keypoint").removeClass("error");
        $(".keypoint").removeClass("noremand");
        $(".keypoint").removeClass("empty");

        render("#remanding-temp","","#onSmartCodeRender");
        if($(this).hasClass("part")){
            setpartRemand();
        }else{
            // if($(this).hasClass("start")){
                 //没有转译的情况
               isOpenSmartHelp(1);
            // }else{
            //  isOpenSmartHelp();
            // }
        }
    })

    var hideTimeout="";
    function gettip(text,event){
       //by edit 12/26
        $("#tooltipnew").text(text);
        $("#tooltipnew").addClass("green");
        $("#tooltipnew").css({

            display: 'block'
        });
        clearTimeout(hideTimeout);
         hideTimeout= setTimeout(function() {
            $("#tooltipnew").css("display", "none");
        }, 3000);
    }



      // 填入事件--工单标题
    $("body").on("click", "#gdbt-ent", function (event) {
        var test_val = $("#gdbt-content").val()||"";
        var paragraphs=getGdbt();
        // 向页面注入值
        if(test_val !=""){
             paragraphs.val(test_val);
        }
         gettip("填入成功",event);
    });

    // 复制事件--工单标题
    $("body").on("click", "#gdbt-copy", function (event) {
        var test_val = $("#gdbt-content").val()||"";
        if(test_val !=""){
            copyText(test_val);
        }
         gettip("复制成功",event);

    });

    // 填入事件--诉求内容
    $("body").on("click", "#sqnr-ent", function (event) {
        var test_val = $("#sqnr-content").val()||"";
        var paragraphs=getSqnr();
        // 向页面注入值
         if(test_val !=""){
        paragraphs.val(test_val);
        }
         gettip("填入成功",event);
    });

    // 复制事件--诉求内容
    $("body").on("click", "#sqnr-copy", function (event) {
        var test_val = $("#sqnr-content").val()||"";
        copyText(test_val);
         gettip("复制成功",event);
    });

    // 填入事件--归口推荐
    $("body").on("click", ".gkclick", function (event) {
        // 获取字段信息
        var $that = $(this),
            code = $that.attr("data-code"),
            fullname = $that.attr("data-fullname");

        console.log(code,fullname);
        if(code){
            // 十堰个性化赋值逻辑
           var array = code.split("|");
           putAllAccord(array);
        }
         gettip("填入成功",event);
    });

    // 填入事件--部门推荐（主办部门） 十堰不推荐
  /*  $("body").on("click", ".bmclick", function () {
        // 获取字段信息
        var $that = $(this),
            code = $that.attr("data-code"),
            fullname = $that.attr("data-fullname");

        console.log(code,fullname);
        // 获取iframe元素
        var iframeBody = document.getElementById('tab-content-01430032').contentWindow;
        if(code){
            iframeBody.mini.get("commonregisterzxzs-1-handleou").setValue(code);
        }
        if(fullname){
            iframeBody.mini.get("commonregisterzxzs-1-handleou").setText(fullname);
        }

    });*/
    // 智能回填事件
    $("body").on("click", "#smart-ent", function () {
        $("#gdbt-ent").trigger("click");
        $("#sqnr-ent").trigger("click");
        $(".gkclick").first().trigger("click");
        //$(".bmclick").trigger("click");
    });

   //轮询循环判断是否转译完成
    var interval = setInterval(function() {
        var opener = window.opener;
        if(opener){
            var status = $(window.opener.document).find('#callStatus').html();
            if(status=="话后"){
                 $(".btnbox>.info").text("内容推荐中");
                $(".tipbtn").addClass("tipremading");
                $(".ctbox").css("display","block");
                $(".btnbox").addClass("show");
                $(".btnbox").removeClass("part");
                $(".keypoint").removeClass("empty");
                $(".tipbtn").removeClass("remandfinsh");
                $(".btnbox").removeClass("remandfinsh");
                $(".tipbtn").removeClass("error");
                $(".btnbox").removeClass("error");
                $(".tipbtn").removeClass("noremand");
                $(".btnbox").removeClass("noremand");
                $(".tipbtn").addClass("tipremading");
                $(".keypoint").removeClass("error");
                $(".keypoint").removeClass("noremand");
                $(".keypoint").removeClass("empty");
                render("#remanding-temp","","#onSmartCodeRender");
                //转译完成重新渲染要素表单
                isOpenSmartHelp(1);
                clearInterval(interval);
            }
       }

    }, 1000); // 每隔1秒轮询一次

    // 监听 textarea 的输入事件，实时调整高度
    $('body').on('input','#sqnr-content', function() {
        autoResizeTextarea($(this));
    });

    // 调整 textarea 高度的函数
    function autoResizeTextarea($textarea) {
        $textarea.css('height', 'auto'); // 重置高度
        $textarea.css('height', $textarea[0].scrollHeight + 'px'); // 设置为内容的高度
    }
    //清空表单
    function clearform() {
        //隐藏智能回填按钮
        $(".btnbox").addClass("hidden");
        $("#onSmartCodeRender").html("");
        $(".tipbtn").removeClass("green");
        $(".tipbtn").removeClass("yellow");
        $(".tipbtn").addClass("grey");
    }
    $('body').on("click",".ctnav>.ctitem",function(){
        //tab切换
        $(this).addClass("active").siblings().removeClass("active");
        $(".seticon").removeClass("active");
        $(".setbox").addClass("hidden");
        var type=$(this).data("type");
        //1、转译2、要素3、知识4、查重5、历史。
        //判断下面内容区域显影
        if(type==1){
            $('#cttransfer').removeClass("hidden");
            $('#onSmartCodeRender').addClass("hidden");
        }else if(type==2){
            $('#cttransfer').addClass("hidden");
            $('#onSmartCodeRender').removeClass("hidden");

        }else if(type==0){
         //知识查重历史区域隐藏
             $('#cttransfer').removeClass("hidden");
            $('#onSmartCodeRender').removeClass("hidden");
        }else if(type==3){
         //转译要素查重历史隐藏
            $('#cttransfer').addClass("hidden");
            $('#onSmartCodeRender').addClass("hidden");
        }else if(type==4){
         //转译要素查重历史隐藏
            $('#cttransfer').addClass("hidden");
            $('#onSmartCodeRender').addClass("hidden");
        }else if(type==5){
         //转译要素查重历史隐藏
            $('#cttransfer').addClass("hidden");
            $('#onSmartCodeRender').addClass("hidden");
        }
        //ToD0后续知识、查重、历史有内容需补充控制显隐
    })
    $('#conditionBtn').hover(
        //一开始鼠标悬浮展示Ai智能推荐图标
        function() {
            // 鼠标进入时执行的代码
            $(".btnbox").css('display', 'flex');
        },
        function() {
            // 鼠标离开时执行的代码
            $(".btnbox").css('display', 'none');
        }
    );

    //点击面板叉号关闭面板
    $("body").on("click",".hd-delete",function(){
        if($(".btnbox").hasClass("show")){
            $(".btnbox").removeClass("show");
        }else{
            $(".btnbox").addClass("show");
        }
        $(".ctbox").slideToggle();
    })
    //设置面板位置
    function getview(){
        var $this=$("#conditionBtn");
        let btnOffset = $this.offset();
        let btnWidth = $this.outerWidth();
        let btnHeight = $this.outerHeight();

        // 获取按钮的位置
        let btnLeft = btnOffset.left;
        let btnTop = btnOffset.top;

        // 根据按钮位置来设置 box 展开方向
        let boxLeft, boxTop;

        // 判断按钮的位置并设置 box 展开方向
        if (btnLeft <= $(win).width() / 2) {
            // 如果按钮在左边，box 向右展开
            boxLeft = 0;
        } else {
            // 如果按钮在右边，box 向左展开
            boxLeft =- $('.ctbox').outerWidth()+100;
        }

        if (btnTop <= $(win).height() / 2) {
            // 如果按钮在上面，box 向下展开
            boxTop = "100%";
        } else {
            // 如果按钮在下面，box 向上展开
            boxTop = - ($('.ctbox').outerHeight() + 10)+"px";
        }

        // 设置 box 的位置并显示
        $('.ctbox').css({
            left: boxLeft + 'px',
            top: boxTop
        });
    }
    //动态设置转译码滚动条
    function setScrool(){
        $('#cttransfer').scrollTop($('#cttransfer')[0].scrollHeight);
    }
    //部门推荐、归口推荐悬浮事件
    // 鼠标悬浮在列表项上时
    $("body").on("mouseenter",".nice>.item>.info", function(event){
        var fullname = $(this).data('fullname');
        var code= $(this).data('code');
        var probability=$(this).data('probability');
        var id=$(this).data('id');
        var isshow=$(this).data('isshow');
        var obj={
            fullname:fullname,
            code:code,
            probability:probability,
            id:id,
            isshow:isshow
        }
        $(this).addClass("hover");
        render("#tooltip-temp",obj,"#nicechild");

        // 获取列表项的位置
        var itemOffset = $(this).offset();
        var buttonWidth = $(this).outerWidth();
        // 设置悬浮框的位置，放在列表项的右侧，距离10px
        $(".nicechild").css({
            left: itemOffset.left + buttonWidth - 100, // 右侧偏移
            top: itemOffset.top + 16 // 与列表项顶部对齐
        }).fadeIn(200);

    })
    var timer;
    // 鼠标移出列表项时，保留 box 显示状态
    $("body").on("mouseleave",".nice>.item>.info", function(event){
        // 等待鼠标离开 box 区域时隐藏 box
        $(this).removeClass("hover");
        // 设定延迟时间，避免抖动
        timer = setTimeout(function() {
            // 如果鼠标没有移入到 #hover-box，才隐藏
            if (!$(".nicechild").hasClass("hover")) {
                hideBoxIfNeeded();
            }
        }, 200);

    });

    // 鼠标进入 box 区域时，不隐藏 box
    $("body").on("mouseenter",".nicechild", function(event){
        // 保持 box 显示
        clearTimeout(timer);
        $(this).addClass("hover");
        $(this).stop(true, true);
    });

    // 鼠标移出 box 区域时，隐藏 box
    $("body").on("mouseleave",".nicechild", function(event){
        $(this).removeClass("hover");
        hideBoxIfNeeded();
    });

    // 检查是否鼠标离开了列表项和 box
    function hideBoxIfNeeded() {
        // 如果鼠标已经离开了列表和 box，隐藏 box
        if (!$(".nicechild").hasClass('hover') && !$(".nice>.item>.info").hasClass("hover")) {
            $(".nicechild").stop(true, true).fadeOut();
        }
    }
    //监听通过过程中标题和内容是否变更
    //需要加判断是否开启通话。开启通话后开启监听
        var intervalId = setInterval(function() {
         var $title= getGdbt();
         var $sqcontent=getSqnr();
          if($title.length>0){
            clearInterval(intervalId);
           if(1){
         $title.on('blur', function() {
          var inputValue = $(this).val();
          if($sqcontent.val()!='' && inputValue!=''){
              //调用接口开始部分推荐
              setpartRemand($sqcontent.val(),inputValue);
          }
         });
      }
          }

        }, 1000);

        var intervalId1 = setInterval(function() {
         var $title= getGdbt();
         var $sqcontent=getSqnr();
          if($sqcontent.length>0){
            clearInterval(intervalId1);
           if(1){
         $sqcontent.on('blur', function() {
          var inputValue = $(this).val();
          if($title.val()!='' && inputValue!=''){
              //调用接口开始部分推荐
            setpartRemand(inputValue,$title.val());
          }
         });
      }
          }

        }, 1000);

       //部分推荐接口
      var settiem;
      function setpartRemand(content,title){
          if(!content||!title){
              var $title= getGdbt();
              var $sqcontent=getSqnr();
              content =$sqcontent.val();
              title = $title.val();
          }
          var requestData ={
              requestTitle :title,
              description : content,
              city:"sy"
          }
           $.ajax({
            url :"http://218.4.136.124:8300/cns-bmfw-web-sda/rest/gptApi/smarttd/getAccordAndOu",
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            beforeSend:function(XMLHttpRequest){
                    return true;
            },
            data:  JSON.stringify(requestData),
            complete:function(){

            },
            success : function(data) {
               $(".ctbox").slideToggle();
               handleData(data);
            }});

      }

    function handleData(returnData){
         //模拟接口返回推荐数据，接口按照下面返回
        var data = returnData.custom;
        if(!data){
            return;
        }
           //处理归口推荐字段
          $.each(data.accordtypeList,function(index,item){
              var name=item.fullname;
              if(name.length > 23){
                  item.newname = name.substring(0,6) + "......" + name.substring(name.length-16,name.length);
              }else{
                  item.newname=name;
              }
              // 十堰个性化，归口显示【点击可引用，部门不需要】
              item.isshow = true;
          })

         //by edit 12/26---添加光影过度蓝色变绿色--调实际接口可以将过度效果放到调接口里，接口调用前和调用成功后
          $('.ew-main .work .ico i').animate({
              opacity: 0.5
          }, 1000,"swing",function(){
           //是否自身高亮
              var $remand=$('.ew-main .work .ico');
              $(".btnbox>.info").text("部分推荐");
              if($remand.hasClass("remandfinsh")){
                  $(".tipbtn").addClass("green_green");
                  settiem = setTimeout(function() {
                     $(".tipbtn").removeClass("green_green");
                      $('.ew-main .work .ico.remandfinsh i').animate({
                          opacity: 1
                      }, 1000,)
                  }, 3000);

              }else{
                  $(".tipbtn").addClass("remandfinsh");
                  $(".btnbox").addClass("remandfinsh");
                  $(".tipbtn").addClass("remandfinsh");
                  $(".btnbox").addClass("part");
                  $('.ew-main .work .ico.remandfinsh i').animate({
                      opacity: 1
                  }, 1000,)
              }

          })

          $(".tipbtn").removeClass("error");
          $(".btnbox").removeClass("error");
          $(".tipbtn").removeClass("noremand");
          $(".btnbox").removeClass("noremand");
          $(".tipbtn").removeClass("tipremading");
          $(".keypoint").removeClass("error");
          $(".keypoint").removeClass("noremand");
          $(".keypoint").removeClass("empty");
          //渲染表单
          render("#onSmartCodeRender-temp",data,"#onSmartCodeRender");

          setform();
           $("#gdbt-content").prop('placeholder', '待推荐');
          $("#sqnr-content").prop('placeholder', '待推荐');
    }

      //————————————————————————————————————处理tab动态渲染————————————————————————————————————


      //初始化tab
      function inittab(){
        var data=GM_getValue("navtab");
          if(!(data!=undefined)){
              //by  edit xlm
          var tabdata={
          issplit:true,//转译和要素是否分开
          isshowzy:false,
          isshowys:true,
          isshowzs:false,
          isshowcc:false,
          isshowls:false,
          isshowtitle:true,
          isshowcontent:true,
          isshowgk:true,
          isshowbm:true,
      }


        //先存储
        GM_setValue('navtab',tabdata );
          }
        data=GM_getValue("navtab");
                  //判断转译和要素是否要分开
       render("#ctnav-temp",data,"#ctnav");
       var $set=$(".seticon");
          // 十堰暂时隐藏
          $set.addClass("hidden")

      /* if( !data.issplit ){
            if(!$set.hasClass("active")){
               $(".cttransfer,.keypoint").removeClass("hidden");
         }
            $(".cttransfer,.keypoint").addClass("import");
           $(".ctbox").css({
               "height":700,
           });
           $(".cttransfer,.keypoint").css("height",350);
           $(".keypoint").css("border-top","5px solid #C4DFF3");

       }else{
          $(".cttransfer,.keypoint").addClass("hidden");
             if(!$set.hasClass("active")){
               $(".cttransfer").removeClass("hidden");
           }
            $(".cttransfer,.keypoint").removeClass("import");
           $(".ctbox").css({
               "height":450,
           });
           $(".cttransfer").css("height","calc(100% - 62px)");
           $(".keypoint").css("height","calc(100% - 52px)");
           $(".keypoint").css("border-top","0");

       }*/
       //要素提取区域4块内容是否隐藏
          setform();


       }
     inittab();
    //设置按钮点击
    $("body").on("click",".seticon",function(){
        $(this).addClass('active');
        //隐藏转译要素等内容
        //Todo后续知识查重历史添加内容需添加隐藏逻辑
        $(".cttransfer,.keypoint").addClass("hidden");
        $(".setbox").removeClass("hidden");
        $(".ctnav .ctitem").removeClass("active");
        //渲染设置页面
         var data=GM_getValue("navtab");
         render("#setinfo-temp",data,"#setinfo");
    }).on("click",".setitem-bd-item .itemicon",function(){
        //switch开关切换
        $(this).toggleClass('switch-on switch-off');

    }).on("click",".saveset",function(){
          //显示遮罩
          $('.ctmask').removeClass("hidden");
          //设置保存
            var data={
                issplit:true,//转译和要素是否分开
                isshowzy:true,//转译
                isshowys:true,//要素
                isshowzs:true,//知识
                isshowcc:true,//查重
                isshowls:true,//历史
                isshowtitle:true,//标题识别
                isshowcontent:true,//内容总结
                isshowgk:true,//归口推荐
                isshowbm:true,//部门推荐
            };
        $('.setitem-bd .setitem-bd-item >.itemicon').each(function(index) {
            if ($(this).hasClass('switch-off')) {
                  switch (index) {
                      case 0:
                       data.isshowzy=false;
                          break;
                       case 1:
                       data.isshowys=false;
                          break;
                        case 2:
                       data.isshowzs=false;
                          break;
                         case 3:
                       data.isshowls=false;
                          break;
                         case 4:
                       data.isshowcc=false;
                          break;
                         case 5:
                       data.isshowtitle=false;
                          break;
                         case 6:
                       data.isshowcontent=false;
                          break;
                         case 7:
                       data.isshowgk=false;
                          break;
                          case 8:
                       data.isshowbm=false;
                          break;

                      default:
                          break;
                  }
            }else{
                 switch (index) {
                      case 0:
                       data.isshowzy=true;
                          break;
                       case 1:
                       data.isshowys=true;
                          break;
                        case 2:
                       data.isshowzs=true;
                          break;
                         case 3:
                       data.isshowls=true;
                          break;
                         case 4:
                       data.isshowcc=true;
                          break;
                         case 5:
                       data.isshowtitle=true;
                          break;
                         case 6:
                       data.isshowcontent=true;
                          break;
                         case 7:
                       data.isshowgk=true;
                          break;
                          case 8:
                       data.isshowbm=true;
                          break;

                      default:
                          break;
                  }
            }
        });
        //转译和要素显示方式

         var selectedValue = $('input[name="custom-radio"]:checked').val();
        if(selectedValue==1){
            data.issplit=true;//转译和要素是否分开

        }else{
            data.issplit=false;//转译和要素是否分开

        }
         GM_setValue('navtab',data );
        //重新渲染tab
        inittab();
        $(".ctnav .ctitem").removeClass("active");
          // 3秒后隐藏遮罩
        setTimeout(function() {
           $('.ctmask').addClass("hidden");
        }, 2000); // 3秒后隐藏

    })

    function setform(){
           //判断偏好设置 by edit xlm
        var setdata=GM_getValue("navtab");
        //要素提取区域4块内容是否隐藏
        if(setdata.isshowtitle){
            $(".ht-form .el-form-box:eq(0)").removeClass("hidden");
        }else{
            $(".ht-form .el-form-box:eq(0)").addClass("hidden");
        }
        if(setdata.isshowcontent){
            $(".ht-form .el-form-box:eq(1)").removeClass("hidden");
            if($("#sqnr-content").length>0){
                autoResizeTextarea($("#sqnr-content"));
            }

        }else{
            $(".ht-form .el-form-box:eq(1)").addClass("hidden");
        }
        if(setdata.isshowgk){
            $(".ht-form .el-form-box:eq(2)").removeClass("hidden");
        }else{
            $(".ht-form .el-form-box:eq(2)").addClass("hidden");
        }
        if(setdata.isshowbm){
            $(".ht-form .el-form-box:eq(3)").removeClass("hidden");
        }else{
            $(".ht-form .el-form-box:eq(3)").addClass("hidden");
        }

    }


    function putAllAccord(arrListv){
    var ids=['businessTypeId','businessTypeChildId','businessTypeGrandsonId','businessTypeFourId'];
    for(var index=0;index<4;index++){
        if(index==0){
            $("#businessTypeId option[selected='selected']").selected=false;
            $("#businessTypeId option[value='"+arrListv[0]+"']").prop("selected", true);
            if(arrListv[0]=="请选择"){
                 $("#businessTypeId option[value='-1']").prop("selected", true);
            }
        }else{
            var seletag = document.getElementById(ids[index]);
            $.ajax({
                type : "post",
                url:"/sy12345/hx/order/hotline/hotLine/ajaxLoadBusinessTypeChildList",
                async:false,
                data:{parentId:arrListv[index-1]},
                success : function(data){
                    seletag.options.length = 1;
                    if(data.success){
                        var sysGroupDataList=data.body.sysGroupDataList;
                        if(sysGroupDataList!=null){
                            for(var i=0;i<sysGroupDataList.length;i++){
                                var item=new Option(sysGroupDataList[i].name,sysGroupDataList[i].id);
                                seletag.options.add(item);
                            }
                            $('#' + ids[index]).change();
                            $("#"+ids[index]+" option[value='"+arrListv[index]+"']").prop("selected", true);
                        }
                    }
                }
            })
        }
    }

    }




})(unsafeWindow);
