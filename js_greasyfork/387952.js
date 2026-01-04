

// ==UserScript==
// @name         皇帝成长计划H5版MOD
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  一款可以修改皇帝成长计划H5版的脚本插件
// @author       自由
// @match        https://huangdi.3304399.net/dangji/*
// @require      http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/387952/%E7%9A%87%E5%B8%9D%E6%88%90%E9%95%BF%E8%AE%A1%E5%88%92H5%E7%89%88MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/387952/%E7%9A%87%E5%B8%9D%E6%88%90%E9%95%BF%E8%AE%A1%E5%88%92H5%E7%89%88MOD.meta.js
// ==/UserScript==


(function(){
var mypage=0;

    function on_cheat(){

        $('.cheatinput').each(function(){
            if($(this).attr('value')!="")
            {
                if($(this).attr('name')=="shouming")
                {
                    unsafeWindow.GameManager.UserInfoManager.setUserInfo($(this).attr('name'),(Number($(this).attr('value'))*12),0);
                }
                else{
                    unsafeWindow.GameManager.UserInfoManager.setUserInfo($(this).attr('name'),Number($(this).attr('value')),0);

                }

            }


        });
        alert('修改成功');
    };


   function on_danyao(){
       var myset=unsafeWindow.cd_danyao["danyao"];myset.forEach(function(myset){if(myset.id>62){unsafeWindow.GameManager.ItemManager.danYaoMap.push(myset.id)}});
       alert('成功添加丹药^_^');
   };

   function on_tongyi(){
       var myset=unsafeWindow.GameManager.MapManager;
        myset.getAllCity(myset).forEach(function(myset){console.log(myset.guishu=1)});
       alert('国家已经统一^_^');
   };
    function box_switch(){

        if(mypage==0)
        {
            $('#box1').css("display","none");
            $('#box2').css("display","block");
            $('#box3').css("display","none");
            mypage+=1;
        }
        else if(mypage==1){
            $('#box1').css("display","none");
            $('#box2').css("display","none");
            $('#box3').css("display","block");
            mypage+=1;
        }
        else if(mypage==2){
            $('#box1').css("display","block");
            $('#box2').css("display","none");
            $('#box3').css("display","none");
            mypage=0;
        }

    };

    function on_rolecheat(){

        if(($('.roleinput[name="name"]').attr('value')!="")||($('.roleinput[name="type"]').attr('value')!="")){
            var rolename=$('.roleinput[name="name"]').attr('value');
            var roletype=$('.roleinput[name="type"]').attr('value');

        }else{alert('请填写人物姓名和类型ID!');return -1;};
        var check=false;
        var myset=unsafeWindow.GameManager.RoleManager;
        myset.roleTypeDataMap[roletype].forEach(function(myset){
            if(myset.name==rolename){
                check=true;
                $('.roleinput').each(function(){

                    if($(this).attr('value')!="")
                    {
                        if($(this).attr('name')=="shouming")
                        {
                            myset[$(this).attr('name')]=Number($(this).attr('value'))*12;
                        }
                        else if($(this).attr('name')=="typeid"){
                            myset['type']=Number($(this).attr('value'));
                        }
                        else if($(this).attr('name')!="name"){
                            myset[$(this).attr('name')]=Number($(this).attr('value'));
                        }


                    }


                });
                alert('修改成功!');

            };

        });
        if(check==false){alert('没有找到该角色,请检查名称或者类型ID是否正确!');return;};

    };

    function on_citycheat(){

        if($('.cityinput[name="id"]').attr('value')!=""){
            var cityid=$('.cityinput[name="id"]').attr('value')

        }else{alert('请填写城市ID!');return -1;};
        var check=false;
        var myset=unsafeWindow.GameManager.MapManager;
        myset.getAllCity(myset).forEach(function(myset){
            if(myset.id==cityid){
                check=true;
                $('.cityinput').each(function(){

                    if($(this).attr('value')!="")
                    {
                        if(($(this).attr('name')=="nongye")||($(this).attr('name')=="kuangye")||($(this).attr('name')=="chengzhen")||($(this).attr('name')=="shangye"))
                        {
                            myset[$(this).attr('name')][0]=Number($(this).attr('value'));
                            myset[$(this).attr('name')][1]=Number($(this).attr('value'));
                        }
                        else if($(this).attr('name')=="name"){
                            myset[$(this).attr('name')]=$(this).attr('value');
                        }
                        else if($(this).attr('name')!="id"){
                            myset[$(this).attr('name')]=Number($(this).attr('value'));
                        }


                    }


                });
                alert('修改成功!');

            };

        });
        if(check==false){alert('没有找到该城市,请检查城市ID是否正确!');return;};

    };

  

    function on_locktime(){
            var locktimeUI= {
                content: '<font color="#000000">开启锁定时间到清晨？</font>',
                icon: unsafeWindow.GameManager.RoleManager.roleTypeDataMap[4][0].icon,
                name: unsafeWindow.GameManager.RoleManager.roleTypeDataMap[4][0].name,
                btns: [{
                    name: "开启",
					func: function(){
						unsafeWindow.GameManager.UIManager.hideTip();
						unsafeWindow.timer=setInterval(function(){unsafeWindow.GameManager.UserInfoManager.userInfo.time=0},200);

					}
                },{
					name: "关闭",
					func: function(){
						unsafeWindow.GameManager.UIManager.hideTip();
						clearInterval(timer);

					}
				}
				]
            };
unsafeWindow.GameManager.UIManager.showTipsDialog(locktimeUI);

        };


   

    $(document).ready(

    function(){
        for(var i = 1; i < 9999; i++) {
        clearInterval(i);
        }


        $("#loading").before($('<div id="zlip"><a href="javascript:void(0);" style="color:black;text-decoration:none">修改游戏</a></div>'));
        $("#loading").before($('<div id="panel"></div>'));
        $("#panel").append('<div id="box1" class="box" style="display:block;"><br><a class="tab" href="javascript:void(0);" style="padding-left:10px;padding-right:10px;color:black;text-decoration:none;background-color:#96b97d;border-radius:15px;">切换到人物修改</a><br><br></div>');
        $("#panel").append('<div id="box2" class="box" style="display:none;"><br><a class="tab" href="javascript:void(0);" style="padding-left:10px;padding-right:10px;color:black;text-decoration:none;background-color:#96b97d;border-radius:15px;">切换到城市修改</a><br><br></div>');
        $("#panel").append('<div id="box3" class="box" style="display:none;"><br><a class="tab" href="javascript:void(0);" style="padding-left:10px;padding-right:10px;color:black;text-decoration:none;background-color:#96b97d;border-radius:15px;">切换到属性修改</a><br><br></div>');
//box1里的各种元素
        $("#box1").append('<div class="cheatinfo"></div>');
        $("div.cheatinfo").append('<div>文学:<input class="cheatinput" name="wenxue" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>武功:<input class="cheatinput" name="wuli" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>才艺:<input class="cheatinput" name="caiyi" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>道德:<input class="cheatinput" name="daode" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>体能:<input class="cheatinput" name="tineng" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>年龄:<input class="cheatinput" name="age" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>体力:<input class="cheatinput" name="tili" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>健康:<input class="cheatinput" name="jiankang" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>快乐:<input class="cheatinput" name="kuaile" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>皇威:<input class="cheatinput" name="huangwei" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>国库:<input class="cheatinput" name="money" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>寿命:<input class="cheatinput" name="shouming" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>甲胄:<input class="cheatinput" name="jiazhou" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>朴刀:<input class="cheatinput" name="pudao" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>战马:<input class="cheatinput" name="zhanma" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>弓箭:<input class="cheatinput" name="gongjian" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>火炮:<input class="cheatinput" name="huopao" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>长枪:<input class="cheatinput" name="changqiang" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>重甲:<input class="cheatinput" name="zhongjia" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>工匠人数:<input class="cheatinput" name="gongjiang" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>军队人数:<input class="cheatinput" name="jundui" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>训练值:<input class="cheatinput" name="xunlian" value="" type="number" ></div>');
        $("div.cheatinfo").append('<div>国策回合:<input class="cheatinput" name="cardHuiHe" value="" type="number" ></div>');


        $("#box1").append('<br><div class="cheatbtn"></div>');
        $("#box1 div.cheatbtn").append('<br><a href="javascript:void(0);" id="change" style="text-align:center;color:white;padding: 5px 15px;background-color:green;border-radius:15px;text-decoration:none;">修改属性</a>');
        $("#box1 div.cheatbtn").append('<br><br><a href="javascript:void(0);" id="danyao" style="text-align:center;color:white;padding: 5px 15px;background-color:green;border-radius:15px;text-decoration:none;">添加全丹药</a>');
        $("#box1 div.cheatbtn").append('<br><br><a href="javascript:void(0);" id="locktime" style="text-align:center;color:white;padding: 5px 15px;background-color:green;border-radius:15px;text-decoration:none;">锁定时间</a>');
        $("#box1 div.cheatbtn").append('<br><br><a href="javascript:void(0);" id="tongyi" style="text-align:center;color:white;padding: 5px 15px;background-color:green;border-radius:15px;text-decoration:none;">全统一</a>');



//box2里的各种元素
        $("#box2").append('<a>填写人物名称和类型ID以及要修改的属性</a>');
        $("#box2").append('<div class="roleinfo"></div>');
        $("div.roleinfo").append('<div style="color:red;">姓名:<input class="roleinput" name="name" value="" type="text" ></div>');
        $("div.roleinfo").append('<div style="color:red;">类型ID:<input class="roleinput" name="type" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>修改ID:<input class="roleinput" name="typeid" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>年龄:<input class="roleinput" name="age" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>寿命:<input class="roleinput" name="shouming" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>智慧:<input class="roleinput" name="zhili" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>武功:<input class="roleinput" name="wuli" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>道德:<input class="roleinput" name="daode" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>统御:<input class="roleinput" name="tongyu" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>政治:<input class="roleinput" name="zhengzhi" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>魅力:<input class="roleinput" name="meili" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>忠诚:<input class="roleinput" name="zhongcheng" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>野心:<input class="roleinput" name="yexin" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>体质:<input class="roleinput" name="tizhi" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>医术:<input class="roleinput" name="yishu" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>文学:<input class="roleinput" name="wenxue" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>才艺:<input class="roleinput" name="caiyi" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>位份:<input class="roleinput" name="weifen" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>亲密:<input class="roleinput" name="qinmi" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>宠爱:<input class="roleinput" name="chongai" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>经验:<input class="roleinput" name="jingyan" value="" type="number" ></div>');
        $("div.roleinfo").append('<div>怀孕概率(0-100):<input class="roleinput" name="huaiyun_gailv" value="" type="number" ></div>');

        $("#box2").append('<br><div class="cheatbtn"></div>');
        $("#box2 div.cheatbtn").append('<br><a href="javascript:void(0);" id="changerole" style="text-align:center;color:white;padding: 5px 15px;background-color:green;border-radius:15px;text-decoration:none;">修改人物</a>');

//box3里的各种元素
        $("#box3").append('<a>填写城市ID以及要修改的属性</a>');
        $("#box3").append('<div class="cityinfo"></div>');
        $("div.cityinfo").append('<div style="color:red;">城市ID:<input class="cityinput" name="id" value="" type="number" ></div>');
        $("div.cityinfo").append('<div>名称:<input class="cityinput" name="name" value="" type="text" ></div>');
        $("div.cityinfo").append('<div>归属(0-18):<input class="cityinput" name="guishu" value="" type="number" ></div>');
        $("div.cityinfo").append('<div>类型(0-5):<input class="cityinput" name="type" value="" type="number" ></div>');
        $("div.cityinfo").append('<div>民心:<input class="cityinput" name="minxin" value="" type="number" ></div>');
        $("div.cityinfo").append('<div>治安:<input class="cityinput" name="zhian" value="" type="number" ></div>');
        $("div.cityinfo").append('<div>农业:<input class="cityinput" name="nongye" value="" type="number" ></div>');
        $("div.cityinfo").append('<div>矿业:<input class="cityinput" name="kuangye" value="" type="number" ></div>');
        $("div.cityinfo").append('<div>城镇:<input class="cityinput" name="chengzhen" value="" type="number" ></div>');
        $("div.cityinfo").append('<div>商业:<input class="cityinput" name="shangye" value="" type="number" ></div>');
        $("#box3").append('<br><div class="cheatbtn"></div>');
        $("#box3 div.cheatbtn").append('<br><a href="javascript:void(0);" id="changecity" style="text-align:center;color:white;padding: 5px 15px;background-color:green;border-radius:15px;text-decoration:none;">修改城市</a>');



        $('#zlip').css({"padding":"0px","text-align":"center","background-color":"#e5eecc","border":"solid 1px #c3c3c3"});
        $('#panel').css({"min-height":"750px","max-width":"2080px","text-align":"center","background-color":"#e5eecc","border":"solid 1px #c3c3c3","display":"none"});
        $('.box').css({"min-height":"749px","max-width":"2079px","text-align":"center","background-color":"#e5eecc","border":"solid 1px #c3c3c3"});
        $('div.cheatinfo').css({"float":"left","max-width":"2080px"});

        $('#panel div.cheatbtn').css({"float":"right"});

        $('div.cheatinfo div').css({"color":"blue","width": "80px","float":"left"});
        $('div.cheatinfo div input').css({"width": "50px"});

        $('div.roleinfo div').css({"color":"blue","width": "80px","float":"left"});
        $('div.roleinfo div input').css({"width": "50px"});

        $('div.cityinfo div').css({"color":"blue","width": "80px","float":"left"});
        $('div.cityinfo div input').css({"width": "50px"});

        $('div.bingzhonginfo div').css({"color":"blue","width": "80px","float":"left"});
        $('div.bingzhonginfo div input').css({"width": "50px"});


        $("#zlip").click(function(){
            $("#panel").slideToggle();
        });


        $("#box1 a.tab").click(box_switch);
        $("#box2 a.tab").click(box_switch);
        $("#box3 a.tab").click(box_switch);
        $("#box4 a.tab").click(box_switch);

        //主要修改代码
        document.getElementById("change").onclick =on_cheat;
        document.getElementById("changerole").onclick =on_rolecheat;
        document.getElementById("changecity").onclick =on_citycheat;
        document.getElementById("danyao").onclick =on_danyao;
        document.getElementById("tongyi").onclick =on_tongyi;
        document.getElementById("locktime").onclick =on_locktime;



       
    }
    );

})();
