// ==UserScript==
// @name         oms批量点赞
// @namespace    ashama
// @version      0.03
// @description  为了世界和平，为了东亚共荣，为了祖国兴盛，为了公司发达，为了同事和睦，为了钱包丰盈，来吧！尽情点赞吧！
// @author       Ashama
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-idle
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @match        https://oms.hcr.com.cn/oms/resources/oms_mobile/company-list.html
// @match        https://oms.hcr.com.cn/oms/resources/oms_mobile/user-list.html
// @match        http://oms.hcr.com.cn/oms/resources/oms_mobile/company-list.html
// @match        http://oms.hcr.com.cn/oms/resources/oms_mobile/user-list.html
// changelog：
// v0.01   初版发布
// v0.02   巧了，我也喜欢晚上改代码，原来你也是啊。我很好奇，这奇葩的布局你想怎么改呢？
// v0.03   几个点赞人员页面都不一样的啊，开发人员辛苦了~
// @downloadURL https://update.greasyfork.org/scripts/414218/oms%E6%89%B9%E9%87%8F%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/414218/oms%E6%89%B9%E9%87%8F%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

$(function(){
    setTimeout(function() {
        'use strict';
        //点赞默认语
        var types = new Array();
        types[1] = new Array();
        types[2] = new Array();
        types[3] = new Array();
        types[4] = new Array();
        types[5] = new Array();
        types[6] = new Array();
        types[7] = new Array();

        types[1][0] = "能够主动承担责任，发现问题不推诿主动推进解决";
        types[1][50] = "能够主动承担责任，发现问题不推诿主动推进解决";
        types[1][100] = "态度积极乐观，善于从工作中积极发现问题并解决问题";
        types[1][150] = "态度积极乐观，善于从工作中积极发现问题并解决问题";
        types[1][200] = "始终保持高昂的激情，并且在团队、公司需要的时候能够挺身而出，不推脱、不退缩";

        types[2][0] = "快速响应，能够为客户/用户高效、专业地解决问题";
        types[2][50] = "快速响应，能够为客户/用户高效、专业地解决问题";
        types[2][100] = "在自身专业的基础上，能够超越客户/用户的预期完成任务，在质量、细节、服务上给对方良好体验";
        types[2][150] = "在自身专业的基础上，能够超越客户/用户的预期完成任务，在质量、细节、服务上给对方良好体验";
        types[2][200] = "1、能够一直保持高水准的服务，并且一次比一次更优秀，每次都能有进步2、能够沉淀标准，不但自己专业还能带领他人，或为公司提供专业标准的服务流程";

        types[3][0] = "为人坦诚、正直，有话直说、就事论事";
        types[3][50] = "为人坦诚、正直，有话直说、就事论事";
        types[3][100] = "言行一致，严格约束自己、遵守公司的各项规范，拥有契约精神";
        types[3][150] = "言行一致，严格约束自己、遵守公司的各项规范，拥有契约精神";
        types[3][200] = "不在工作中掺杂个人主观色彩，以工作结果为第一，个人利益放在后，公平待人待事，并且始终保持品质";

        types[4][0] = "工作中善于思考、总结和学习进步，在原有的工作基础上优化方法、提升效率";
        types[4][50] = "工作中善于思考、总结和学习进步，在原有的工作基础上优化方法、提升效率";
        types[4][100] = "能够一直保持创新的意识，不断完善、迭代创新点，给客户/用户提供更有创意的产品";
        types[4][150] = "能够一直保持创新的意识，不断完善、迭代创新点，给客户/用户提供更有创意的产品";
        types[4][200] = "通过投入，创新的产品能够为客户提供更好的服务、为公司带来实质性的效益、管理效率或服务流程的提升，对公司产生重大影响";

        types[5][0] = "能够在工作中、生活中积极分享自己的资源，帮助他人成长进步";
        types[5][50] = "能够在工作中、生活中积极分享自己的资源，帮助他人成长进步";
        types[5][100] = "主动与外部部门、机构合作，并且产生实际的结果或交付";
        types[5][150] = "主动与外部部门、机构合作，并且产生实际的结果或交付";
        types[5][200] = "能够与伙伴相互包容、协作，需要的时候积极融入配合，一同为团队、公司创造更大的价值";

        types[6][0] = "从客户/用户的角度出发，满足其需求，为其创造价值";
        types[6][50] = "从客户/用户的角度出发，满足其需求，为其创造价值";
        types[6][100] = "从客户/用户的角度出发，满足其需求，为其创造价值";
        types[6][150] = "能够利用自身的文化，影响他人一同奋斗，起到良好的带头作用";
        types[6][200] = "能够利用自身的文化，影响他人一同奋斗，起到良好的带头作用";

        types[7][0] = "业务贡献：为公司引进重大客户资源、合作资源";
        types[7][50] = "文化贡献：为公司的文化建设起到模范带头作用，并产生良好影响";
        types[7][100] = "人才贡献：为公司引进人才做出贡献";
        types[7][150] = "品牌贡献：1、为公司的品牌形象或在对外宣传中有特殊贡献,2、取得国家、社会荣誉为公司赢得良好声誉";
        types[7][200] = "其他贡献：在公司培训、技术等其他内容上做出贡献";


        //点赞图标
        var scoreBarStr = '';
        scoreBarStr += '<div class="jifen_content_div" style="height:100px;width:1000px;overflow-x: hidden;overflow-y: hidden;transform: scale(0.8);left:100px;top:-50px;">';
        scoreBarStr += '<div class="jf_div_icon color_a" style="left:0;"> <div class="icon_border color"> <i class="iconfont icon-hezuo color"></i> <p class="p color">担当</p> </div> <button class="btn color" uid="1" type="1" value="50">50积分</button> </div>';
        scoreBarStr += '<div class="jf_div_icon color_b" style="left:98px;"> <div class="icon_border color"> <i class="iconfont icon-zhuanyejineng color"></i> <p class="p">专业</p> </div> <button class="btn color" uid="2" type="2" value="50">50积分</button> </div>';
        scoreBarStr += '<div class="jf_div_icon color_c" style="left:200px;"> <div class="icon_border color"> <i class="iconfont icon-rocket color"></i> <p class="p">正直</p> </div> <button class="btn color" uid="3" type="3" value="50">50积分</button> </div>';
        scoreBarStr += '<div class="jf_div_icon color_d" style="left:302px;"> <div class="icon_border color"> <i class="iconfont icon-chuangxin color"></i> <p class="p">创新</p> </div> <button class="btn color" uid="4" type="4" value="50">50积分</button> </div>';
        scoreBarStr += '<div class="jf_div_icon color_e" style="left:404px;"> <div class="icon_border color"> <i class="iconfont icon-fenxiang color"></i> <p class="p ">分享</p> </div> <button class="btn color" uid="5" type="5" value="50">50积分</button> </div>';
        scoreBarStr += '<div class="jf_div_icon color_f" style="left:506px;"> <div class="icon_border color"> <i class="iconfont icon-fendou color"></i> <p class="p">核心</p> </div> <button class="btn color" uid="6" type="6" value="50">50积分</button> </div>';
        scoreBarStr += '<div class="jf_div_icon color_boss" style="left:608px;display: none;"> <div class="icon_border color"> <i class="iconfont icon-gongxian1 color"></i> <p class="p">组织贡献</p> </div> <button class="btn color" mold="1" uid="7" type="50">50积分</button> </div>';
        scoreBarStr += '</div>';

        //点赞css
        $("head").append("<link>");
        var toolbarCss = $("head").children(":last");
        toolbarCss.attr({
            rel: "stylesheet",
            type: "text/css",
            href: "css/giveup.css?v=1"
        });

        //重置列表项
        $("div.mui-content").append('<ul class="mui-table-view mui-table-view-chevron" id="newlist"></ul>');
        $("ul#list > li").clone().appendTo("ul#newlist");
        //隐藏原列表项
        $("ul#list:first").hide();
        //插入点赞图标
        $("ul#newlist > li[type!='1'] > a").height("80px");
        $("ul#newlist > li[type!='1'] > a > div").after(scoreBarStr);

        //绑定机构菜单
        $("ul#newlist > li[type='1']").click(function () {
            var thisLi = $(this);
            var id = thisLi.attr('id');
            var arr = id.split('_');
            var href = '';
            localStorage.setItem("parentId",arr[0]);
            var $state = app.getState();
            var $token = $state.token || [];
            $token = [];
            $token[0]=arr[1];
            $state.token = $token;
            app.setState($state);
            href = 'dept-list1.html';
            mui.openWindow({
                id: href,
                url: href
            });
        });

        //绑定提交评分
        $("button").click(function (){
            mui.showLoading("加载中..","div");
            debugger;
            var btnvalue = this.value;
            var textareaval = types[this.getAttribute("type")][btnvalue];
            var state = this.getAttribute("uid");

            var settings = app.getSettings();
            var senderUser = settings.user;

            var thisLi = $(this).parents("li");
            var id = thisLi.attr('id');
            var type = thisLi.attr('type');
            var arr = id.split('_');

            if(senderUser.userId==arr[0]){
                mui.hideLoading();
                return mui.alert('不能给自己点赞!');
            }
            var getterUser = {
                'getterId': arr[0],
                'getterDepartmentName': arr[1],
                'getterNumber': arr[2],
                'getterDepartmentId': arr[3],
                'getterStatus': arr[4],
                'getterUserLevel': arr[5]
            }
            settings.getterUser = getterUser;
            app.setSettings(settings);
            app.getajaxdata(app.DOMAIN_NAME+"/integral/saveintegraldata.htm",
                            {
                someGreatReason:state,
                senderName: senderUser.userId,
                senderNumber:senderUser.memberId,
                senderDepartmentId:senderUser.accountingDeptId,
                senderDepartmentName:senderUser.accountingDeptName,
                getterName:getterUser.getterId,
                getterNumber:getterUser.getterNumber,
                getterDepartmentId:getterUser.getterDepartmentId,
                getterDepartmentName:getterUser.getterDepartmentName,
                integral:btnvalue,
                state:1,
                remark:textareaval,
                senderUserLevel:senderUser.userLevel,
                getterUserLevel:getterUser.getterUserLevel
            },function(data){
                mui.hideLoading();
                if(!data) return mui.alert('系统错误');
                if(data.code=='1'){
                    mui.alert('点赞成功！');
                }else{
                    mui.alert(data.message);
                }
            });
            mui.hideLoading();
        });

    } ,1000)//隔1秒之后执行
});