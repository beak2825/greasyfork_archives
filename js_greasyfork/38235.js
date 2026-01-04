// ==UserScript==
// @name         free-ss
// @version      0.1.11
// @homepage     http://xieshang.ren/2018/03/01/Tampermonkey_free_ss_plus/
// @description  服务器最新地址：www.free-ss.ooo
// @author       XSC
// @include      http://*free-ss.*/
// @include      https://*free-ss.*/
// @match        https://*free-ss.*/
// @match        http://*free-ss.*/

// @require      https://cdn.jsdelivr.net/npm/js-base64@2.4.3/base64.min.js
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_setClipboard
// @run-at       document-end
// @home-url     https://www.xieshang.ren
// @namespace    https://greasyfork.org/users/163852
// @downloadURL https://update.greasyfork.org/scripts/38235/free-ss.user.js
// @updateURL https://update.greasyfork.org/scripts/38235/free-ss.meta.js
// ==/UserScript==

// @0.1.11  2019-3-28  修复因未引入jquery在新页面无法出现的BUG
// @0.1.10  2019-1-18  今天突然出现只刷出一个表格，并且是错误的情况，对此做了优化
// @0.1.9   2019-1-3   修改窗口从左下角弹出，窗口遮挡太讨厌
// @0.1.8   2019-1-3   增加对最新网址的支持 www.free-ss.tw
// @0.1.7   2018-5-11  修复对稳定性增加干扰的过滤
// @0.1.6   2018-4-8   选择界面增加失效报警
// @0.1.5   2018-4-8   闲来无事增加当只有一个有效时，自动进入国家和密码的选择
// @0.1.4   2018-4-3   去除不稳定的服务器信息
// @0.1.3   2018-3-28  修改判断长度
// @0.1.2   2018-3-28  修复作者改了IP地址名称
// @0.1.1   2018-3-28  尝试修复Userscript+不显示脚本问题
// @0.1.0   2018-3-26  增加对www的支持，chrome选择服务器时有侧边条，增大排版面积，增加反馈按钮，加快修复的速度
// @0.0.9   2018-3-19  少加了等号导致数据判断错误。。。最后改了下点点东西，就没测试了。。。果然不能偷懒。。。
// @0.0.8   2018-3-19  老师又淘气滴把加密和密码调了个gè，咱继续躲猫猫~~~
// @0.0.7   2018-3-13  去除错误的取消按键事件
// @0.0.6   2018-3-13  老师又更新了代码，表格也开始躲猫猫了，那么亲们，别偷懒了，自己选吧(┬＿┬)
// @0.0.5   2018-3-8   更换界面，使用[国家][加密方式]双条件的方式进行复制，下一版本增加全选功能，先回家吃饭了:-)
// @0.0.4   2018-3-6   增加一条明文，用于判断脚本是否失效
// @0.0.3   2018-2-28  修复失效
// @0.0.2   2018-2-24  修改表格判断方式
// @0.0.1   2018-2-7   初始版本
(function() {
    var $ = unsafeWindow.jQuery;
    var ss_urls = new Array(0);
    var ss_num=0;
    var ss_txt='';
    var ss_check='';
    var ss_content='';
    var data_table=new Array(0);
    var countrylist=new Array(0);
    var encryptlist=new Array(0);
    var ss_selecttxt='';
    var ss_setconfigtxt='';
    var goodtab = new Array(0);
    var tabchoicetxt = '';
	var tabsequence=new Array(0);
	var tabsequence_ip=0;
	var tabsequence_port=0;
	var tabsequence_pass=0;
	var tabsequence_method=0;
	var tabsequence_clock=0;
	var tabsequence_globe=0;

    // Your code here...
    function print(str) {
        console.log(str);
    }

    function loadconfig() {

    }

    function saveconfig() {
        GM_setValue("EC_aes_cfb", document.querySelector("#ecset_cfb").checked);
    }

    function genCheckBox(id, name, value, showText, parentIndex, isCheck) {
        var check1 = '';
        if (!isCheck) {
            check1 = "<input type='checkbox' parentIndex=" + parentIndex + " name=".concat(name).concat(" value=").concat(value).concat(" alt=").concat(showText).concat(" /><span>").concat(showText).concat("</span>");
            return check1;
        } else {
            check1 = "<input type='checkbox' parentIndex=" + parentIndex + " name=".concat(name).concat(" checked='checked' value=").concat(value).concat(" alt=").concat(showText).concat(" /><span>").concat(showText).concat("</span>");
            return check1;
        }
    }

    function genradioBox(id, parentIndex, value, showText, name, isCheck) {
        var check1 = '';
        if (!isCheck) {
            check1 = "<input type='radio' parentIndex=" + parentIndex + " name=".concat(name).concat(" value=").concat(value).concat(" alt=").concat(showText).concat(" id=").concat(id).concat(" /><span>").concat(showText).concat("</span>");
            return check1;
        } else {
            check1 = "<input type='radio' parentIndex=" + parentIndex + " name=".concat(name).concat(" checked='checked' value=").concat(value).concat(" alt=").concat(showText).concat(" /><span>").concat(showText).concat("</span>");
            return check1;
        }
    }

    function layer_setconfig(){
        var i = 0;
        ss_setconfigtxt = "";
        ss_setconfigtxt += "请勾选上自动勾起的协议类型<br></br>";
        ss_setconfigtxt += "<form name='countryform'>";
        ss_setconfigtxt += "<fieldset><legend>加密</legend>";
        ss_setconfigtxt += genCheckBox(i, "ecset_cfb", i, "cfb", i, true);
        ss_setconfigtxt += "&nbsp;&nbsp;&nbsp;&nbsp;";
        i++;
        ss_setconfigtxt += genCheckBox(i, "ecset_ctr", i, "ctr", i, true);
        ss_setconfigtxt += "&nbsp;&nbsp;&nbsp;&nbsp;";
        i++;
        ss_setconfigtxt += genCheckBox(i, "ecset_gcm", i, "gcm", i, true);
        ss_setconfigtxt += "&nbsp;&nbsp;&nbsp;&nbsp;";
        i++;
        ss_setconfigtxt += genCheckBox(i, "ecset_rc4_md5", i, "rc4-md5", i, true);
        ss_setconfigtxt += "&nbsp;&nbsp;&nbsp;&nbsp;";
        i++;
        ss_setconfigtxt += genCheckBox(i, "ecset_salsa20", i, "salsa20", i, true);
        ss_setconfigtxt += "&nbsp;&nbsp;&nbsp;&nbsp;";
        i++;
        ss_setconfigtxt += genCheckBox(i, "ecset_chacha20", i, "chacha20", i, true);
        ss_setconfigtxt += "&nbsp;&nbsp;&nbsp;&nbsp;";
        i++;
        ss_setconfigtxt += "</fieldset>";
    }

    //配置按钮事件
    function show_setconfig(){
        layer_setconfig();
        layer.open({
            closeBtn: 0,
            title:'配置参数',
            area:['250px','250px'],
            btn:['保存','取消'],
            btn1:function(){
                saveconfig();
            },
            btn2:function(){
                mainlayer();
            },
            content: "需要自动选择的协议："
        });
    }

    function check_box() {
        var i;

        ss_content += "<fieldset><legend>国家</legend>";

        //建立国家列表
        ss_content += "<form name='countryform'>";
        for(i = 0; i < countrylist.length; i++)
        {
            ss_content += genCheckBox(i, "ct_"+i, i, countrylist[i], 0, true);
            ss_content += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        ss_content += "</fieldset>";

        ss_content += "<fieldset><legend>加密</legend>";
        //建立加密列表
        for(i = 0; i < encryptlist.length; i++)
        {
            if(encryptlist[i].indexOf('gcm') > -1 || encryptlist[i].indexOf('ctr') > -1)
            {
                ss_content += genCheckBox(i, "ec_"+i, i, encryptlist[i], 0, false);
            }else{
                ss_content += genCheckBox(i, "ec_"+i, i, encryptlist[i], 0, true);
            }
            ss_content += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        ss_content += "</fieldset>";
        print(ss_content);
    }



    function gettab(tabmax){
        var j;
		var i;
        var tab = document.getElementsByTagName("table");
		var s3=document.createElement("table");


        print('获取表格数据:' + tabmax);

        var tabindex ,tabmaxnum = 0, test = 0;

        print('表格' + tabmax + '最长');
        s3 = tab[tabmax]; //获取第一个表格
        ss_num = s3.rows.length;
        print('表格行数:' + ss_num);

        data_table = new Array(0);
        countrylist = new Array(0);
        encryptlist = new Array(0);

		//检测表格顺序并记录顺序：IP,PORT,PASS,METHOD,GLOBE(COUNTRY)
		for(i = 0; i < 8; i++)
		{
			print(s3.rows[0].cells[i].innerHTML.toString().toUpperCase());

			//IP
			if(s3.rows[0].cells[i].innerHTML.toString().toUpperCase().indexOf("IP") > -1 || s3.rows[0].cells[i].innerHTML.toString().toUpperCase().indexOf("ADDR") > -1 )
			{
				tabsequence_ip = i;
			}
			//PORT
			if(s3.rows[0].cells[i].innerHTML.toString().toUpperCase().indexOf("PORT") > -1)
			{
				tabsequence_port = i;
			}
			//PASS
			if(s3.rows[0].cells[i].innerHTML.toString().toUpperCase().indexOf("PASS") > -1)
			{
				tabsequence_pass = i;
			}
			//METHOD
			if(s3.rows[0].cells[i].innerHTML.toString().toUpperCase().indexOf("METHOD") > -1)
			{
				tabsequence_method = i;
			}
			//GLOBE
			if(s3.rows[0].cells[i].innerHTML.toString().toUpperCase().indexOf("GLOBE") > -1)
			{
				tabsequence_globe = i;
			}
			//CLOCK
			if(s3.rows[0].cells[i].innerHTML.toString().toUpperCase().indexOf("CLOCK") > -1)
			{
				tabsequence_clock = i;
			}
		}

		print("IP:"+tabsequence_ip);
		print("PORT:"+tabsequence_port);
		print("PASS:"+tabsequence_pass);
		print("METHOD:"+tabsequence_method);
		print("GLOBE:"+tabsequence_globe);
		print("CLOCK:"+tabsequence_clock);

		var good = 0;
        for(i = 0; i < s3.rows.length - 1; i++){
			//筛选可用性，不是10/10/10丢弃
            var checkt = s3.rows[i + 1].cells[0].innerHTML.toString().split('/');
            var goodnum = 0;
            for(j = 0; j < checkt.length; j++)
            {
                var tint = parseInt(checkt[j]);
                if(tint <= 10 && tint > 8)
                {
                    goodnum ++;
                }
            }
			if(goodnum < 3)
			{
				print("【丢弃】稳定性不足:"+s3.rows[i + 1].cells[1].innerHTML.toString());
				continue;
            }
			data_table[good] = new Array(0);
            for(j = 0; j < s3.rows[i + 1].cells.length - 1; j++){
                data_table[good].push(s3.rows[i + 1].cells[j].innerHTML.toString());
            }

            //获取国家列表
            if(countrylist.length == 0)
            {
                countrylist.push(data_table[good][tabsequence_globe]);
            }else{
                for(j = 0; j < countrylist.length; j++)
                {
                    if(countrylist[j] == data_table[good][tabsequence_globe])
                    {
                        break;
                    }
                }
                if(j == countrylist.length)
                {
                    countrylist.push(data_table[good][tabsequence_globe]);
                    print('c'+countrylist.length);
                }
            }
            //加密方式
            if(encryptlist.length == 0)
            {
                encryptlist.push(data_table[good][tabsequence_method]);
            }else{
                for(j = 0; j < encryptlist.length; j++)
                {
                    if(encryptlist[j] == data_table[good][tabsequence_method])
                        break;
                }
                if(j == encryptlist.length)
                {
                    encryptlist.push(data_table[good][tabsequence_method]);
                    print('e'+encryptlist.length);
                }
            }
			good++;
        }

        print("服务器数量:"+data_table.length);
    }

    function makecopyalldata() {
        var i, j;
        ss_selecttxt = '';

        for(i = 0; i < data_table.length; i++)
        {
            var url1 = data_table[i][tabsequence_method]+':'+data_table[i][tabsequence_pass]+'@'+data_table[i][tabsequence_ip]+':'+data_table[i][tabsequence_port];
            var url2 = 'ss://'+Base64.encodeURI(url1)+'#'+data_table[i][tabsequence_globe]+'('+data_table[i][tabsequence_clock]+')';
            print(url2);
            ss_selecttxt += url2 + '\r\n';
        }

    }

    function makecopydata() {
        var i, j;
        ss_selecttxt = '';
        var data = new Array(0);
        var unsel_country = new Array(0);
        var unsel_country_num = 0;
        var unsel_encrypt = new Array(0);
        var unsel_encrypt_num = 0;
        var max = 0;


        //筛选国家
        print("没有选择的国家有");
        for(i = 0; i < countrylist.length; i++)
        {
            if($("input[name='ct_"+i+"']").is(':checked') == false)
            {
                unsel_country.push($("input[name='ct_"+i+"']").attr('alt'));
                unsel_country_num++;
                print(unsel_country[unsel_country.length - 1]);
            }
        }
        //筛选加密
        print("没有选择的加密有");
        for(i = 0; i < encryptlist.length; i++)
        {
            if($("input[name='ec_"+i+"']").is(':checked') == false)
            {
                unsel_encrypt.push($("input[name='ec_"+i+"']").attr('alt'));
                unsel_encrypt_num++;
                print(unsel_encrypt[unsel_encrypt.length - 1]);
            }
        }

        if(unsel_country_num > unsel_encrypt_num)
        {
            max = unsel_country_num;
        }else{
            max = unsel_encrypt_num;
        }
        print("开始筛选服务器:"+data_table.length);
        ss_selecttxt = '';
        for(i = 0; i < data_table.length; i++)
        {
            var need = 1;
            print(data_table[i][tabsequence_ip] + "  " + data_table[i][tabsequence_port] + "  " + data_table[i][tabsequence_pass] + "  ");
            for(j = 0; j < max && need; j++)
            {
                if(j < unsel_country_num)
                {
                    print("[国家]"+unsel_country[j]);
                    //if(data_table[i][6] == unsel_country[j])
                    if(data_table[i][tabsequence_globe] == unsel_country[j])
                    {
                        need = 0;
                        print("丢弃[国家]"+data_table[i][tabsequence_ip]);
                        continue;
                    }
                }
                if(j < unsel_encrypt_num)
                {
                    print("[加密]"+unsel_encrypt[j]);
                    //if(data_table[i][4] == unsel_encrypt[j])
                    if(data_table[i][tabsequence_method] == unsel_encrypt[j])
                    {
                        need = 0;
                        print("丢弃[加密]"+data_table[i][tabsequence_ip]);
                        continue;
                    }
                }
            }
            if(need)
            {
                var url1 = data_table[i][tabsequence_method]+':'+data_table[i][tabsequence_pass]+'@'+data_table[i][tabsequence_ip]+':'+data_table[i][tabsequence_port];
                var url2 = 'ss://'+Base64.encodeURI(url1)+'#'+data_table[i][tabsequence_globe]+'('+data_table[i][tabsequence_clock]+')';
				print(url2);
                ss_selecttxt += url2 + '\r\n';
            }
        }
    }

    function choicetab() {
        var j;
        var tab = document.getElementsByTagName("table");

        var tabindex ,tabmax = 0, tabmaxnum = 0, goodtablen = 0;

        tabchoicetxt = "<font color=\"red\">若出现只有一条，请确认是否与第一个相同，若不同，请刷新页面</font><br/>";
        tabchoicetxt += "<fieldset><legend>请选择正确的一条</legend><form name='tabchoiceform'>";
        for(tabindex = 0; tabindex < tab.length; tabindex++)
        {
            print('表格' + tabindex + '长' + tab[tabindex].rows.length);
            if(tab[tabindex].rows.length > 5)
            {
                goodtab[goodtablen] = new Array(0);
                goodtab[goodtablen].push(tabindex);
                goodtab[goodtablen].push(tab[tabindex].rows[1].cells[1].innerHTML.toString()+'&nbsp;&nbsp;'+tab[tabindex].rows[1].cells[2].innerHTML.toString()+'&nbsp;&nbsp;'+tab[tabindex].rows[1].cells[3].innerHTML.toString()+'&nbsp;&nbsp;'+tab[tabindex].rows[1].cells[4].innerHTML.toString());
                print(goodtab[goodtablen][0]);
                print(goodtab[goodtablen][1]);
                tabchoicetxt += genradioBox(goodtab[goodtablen][0], "tab_"+goodtab[goodtablen][0], goodtab[goodtablen][0], goodtab[goodtablen][1], "tab_group", false) + "<br/>";
                goodtab.push();
                goodtablen++;
            }
        }
        tabchoicetxt += "</fieldset>";
        print(tabchoicetxt);
    }

    function mainlayer() {
        layer.open({
            type: 0,
            fixed: false, //不固定
            title:'服务器('+ss_num+'条) ',
            area:['800px','300px'],

            btn:['复制全部','复制','失效'],
			btn1:function(index, layero){
                makecopyalldata();
                var txt = ss_selecttxt;
                GM_setClipboard(txt);
                layer.msg('已复制到剪切板');
            },
			btn2:function(index, layero){
                makecopydata();
                var txt = ss_selecttxt;
                GM_setClipboard(txt);
                layer.msg('已复制到剪切板');
            },
			btn3:function(index, layero){
                window.open("http://xieshang.ren/2018/03/01/Tampermonkey_free_ss_plus/");
                return false;
			},
            content: ss_content
        });
    }

    function getselecttab(){
        var choiceindex;
        var i;

        print("待选择表数："+goodtab.length);
        print("待选择表数："+goodtab.length);
        for(i = 0; i < goodtab.length; i++)
        {
            print("判断表：" + "input[parentIndex='tab_"+goodtab[i][0]+"']");
            if($("input[parentIndex='tab_"+goodtab[i][0]+"']").is(':checked') == true)
            {
                choiceindex = goodtab[i][0];
            }
        }
        print("选择表格：" + choiceindex);
        gettab(choiceindex);
        check_box();
        mainlayer();
    }


    FREESS_NET = {
        askcheck: function () {
//			if(goodtab.length == 1)
//			{
//				print("只有一个表格，自动选择");
//				gettab(goodtab[0][0]);
//				check_box();
//				mainlayer();
//			}else{
				layer.open({
					type: 0,
					title:'请选择与页面相同的那条',
					area:['500px','240px'],
					btn:['确认','失效','关闭'],
					btnAlign: 'c',
                    offset: 'lb', //左下角弹出
					moveType: 1,
					fixed: false, //不固定
					yes:function(){
						getselecttab();
					},
					success: function(layero){
			  var btn = layero.find('.layui-layer-btn');
			  btn.find('.layui-layer-btn1').attr({
				href: 'http://xieshang.ren/2018/03/01/Tampermonkey_free_ss_plus/',
				target: '_blank'
			  });},
					content: tabchoicetxt
				});
//			}
        },

        run:function(){
            //this.geturls();
            choicetab();
            this.askcheck();
        },
    };

    $(document).ready(function() {
        // 等待3s，数据加载后执行
        setTimeout(function(){
            FREESS_NET.run();
        },2000);
    });


})();
