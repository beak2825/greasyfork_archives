// ==UserScript==
// @name         "哈工大本科教学服务与管理系统"自动评教
// @namespace    1119230564@qq.com
// @version      1.0.0
// @description  仅适用于"哈工大本科教学服务与管理平台（jwts.hit.edu.cn）"学生评教，仅供编程爱好者学习使用，不得用于不正当目的；若校外使用，优先使用ipvn，不保证vpn一定能用
// @author       风味咸牛奶
// @match        https://vpn.hit.edu.cn/,DanaInfo=jwts.hit.edu.cn+main
// @match        http://jwts-hit-edu-cn.ivpn.hit.edu.cn:1080/main
// @match        http://jwts-hit-edu-cn.ivpn.hit.edu.cn:1080/loginLdap
// @match        https://vpn.hit.edu.cn/,DanaInfo=jwts.hit.edu.cn+loginLdap
// @match        http://jwts-hit-edu-cn.ivpn.hit.edu.cn:1080/xspjgd/*
// @match        https://vpn.hit.edu.cn/xspjgd/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/405328/%22%E5%93%88%E5%B7%A5%E5%A4%A7%E6%9C%AC%E7%A7%91%E6%95%99%E5%AD%A6%E6%9C%8D%E5%8A%A1%E4%B8%8E%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%22%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/405328/%22%E5%93%88%E5%B7%A5%E5%A4%A7%E6%9C%AC%E7%A7%91%E6%95%99%E5%AD%A6%E6%9C%8D%E5%8A%A1%E4%B8%8E%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%22%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

const yxzc = ["挺好的", "很不错", "棒", "很好", "很认真", "收获很大", "挺用心的", "好", "教得好"];//优秀之处及你的收获
const bzzc = "无";

//生成指定范围内的随机整数
var randomRange = function (min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
};

var returnCase = function (href)
{
    if(href.search("toUpdatePkpx")>0) return 1;         //评课评教材
    else if(href.search("toUpdateXspjFx")>0||href.search("/Fxpj")>0) return 2;  //评价教与学状态
    else if(href.search("toUpdateFxpj_sy")>0) return 3; //评价实验课
    else if(href.search("toUpdateZhpj")>0) return 4;    //综合评价教师
    else return 0;
};

jwtsAutoComplete = function ()
{
    var body_html = document.body.innerHTML;

    switch(returnCase(window.location.href))
    {
        case 1: //评课评教材
        case 2: //评课评教材
        case 3: //评价教与学状态
        {
            //1. 自动给下拉菜单打分

            //获取特定id字符串
            var my_id_table = body_html.match(/(?!id=")selid_[a-zA-Z0-9-_]+?(?=")/g);
            if(my_id_table.length===0)
            {
                alert("出错，id表检测不出来，请反馈给up主");
                return;
            }
            var selectId;

            //改变id对应元素的选项内容：默认选择第3个选项，一般评价比较中性一些
            for(var i = 0; i < my_id_table.length; i++)
            {
                selectId = document.getElementById(my_id_table[i]);
                selectId.options.selectedIndex = 2;//取值为0到5
            }

            //为了防止被检测出来，随机打乱几个选项内容
            var rand_num;
            if(my_id_table.length<33)
            {
                rand_num = randomRange(1, Math.floor(my_id_table.length/2)+2);
            }
            else
            {
                rand_num = randomRange(11, my_id_table.length-10);
            }

            for(var j = 0; j < rand_num; j++)
            {
                selectId = document.getElementById(my_id_table[randomRange(0, my_id_table.length)]);
                selectId.options.selectedIndex = 1;
            }

            //2. 自动填写文本框：优秀之处与不足之处
            var rand_value = yxzc[randomRange(0, yxzc.length)];
            for(var k = 0; ; k++)
            {
                var yxzc_value = document.getElementsByName("listXspj[" + k + "].yxzc");
                var bzzc_value = document.getElementsByName("listXspj[" + k + "].bzzc");
                if(yxzc_value.length === 1)
                {
                    yxzc_value[0].value = rand_value;
                    bzzc_value[0].value = bzzc;
                }
                else
                {
                    break;
                }
            }
            break;
        }
        case 4: //综合评价教师
        {
            //3. 自动给单选框打分：最优个数默认0个，优个数默认1个，其余都是良
            var my_name_set = new Set(body_html.match(/tabmapzb\['\d+?'\]/g));  //选出所有name形如tabmapzb\['\d+?'\]的
            var my_name_array = Array.from(my_name_set)

            var best_num;   //随机生成最优个数
            var better_num; //随机生成优个数
            if(my_name_array.length<3)
            {
                best_num = 0;
                better_num = 1;
            }
            else if(my_name_array.length<5)
            {
                best_num = 1;
                better_num = 1;
            }
            else
            {
                best_num = randomRange(1, 3);   //随机生成最优个数，最优个数在1~2之间
                better_num = randomRange(1, 4); //随机生成优个数，优个数在1~3之间
            }

            for(var p = 0; p < my_name_array.length; p++)
            {
                var my_radio = document.getElementsByName(my_name_array[p])
                if(p < best_num)
                {
                    my_radio[0].checked = true;
                }
                else if (p < best_num + better_num)
                {
                    my_radio[1].checked = true;
                }
                else
                {
                    my_radio[2].checked = true;
                }
            }
            break;
        }
    }
};

var addBtnAutoComplete = function ()
{
    var auto_btn_html;
    var ul_tag;
    var width;

    switch(returnCase(window.location.href))
    {
        case 1: //评课评教材
        case 2: //评课评教材
        case 3: //评价教与学状态
        {
            if(returnCase(window.location.href)===1) width="380px";         //评课评教材
            else if(returnCase(window.location.href)===2) width = "460px";  //评课评教材
            else width = "380px";                                               //评价教与学状态

            $("#queryform > table > tbody > tr > td:nth-child(2)").css("width", width);//调整宽度，美观一些

            auto_btn_html = '<div class="addlist_button1 ml15">';
            auto_btn_html += '<a onclick="jwtsAutoComplete()">';
            auto_btn_html += '<span>自动填写</span></a></div>';

            ul_tag = $("#queryform > table > tbody > tr > td:nth-child(2) > div:nth-child(3)");
            if(ul_tag)
            {
                ul_tag.before(auto_btn_html);
            }
            break;
        }
        case 4: //综合评价教师
        {
            auto_btn_html = '<div class="ico_button">';
            auto_btn_html += '<a onclick="jwtsAutoComplete()">';
            auto_btn_html += '<b class="btn_ico4 btn_img">';
            auto_btn_html += '</b><span>自动填写</span></a></div>';

            ul_tag = $("body > div.Contentbox > div > div.butsea > div:nth-child(1)");
            if(ul_tag)
            {
                ul_tag.before(auto_btn_html);
            }
            break;
        }
        default:
        {
            break;
        }
    }
};

//添加按键，按键点击后指向评教系统页面
var addBtnTurnToPJXT = function ()
{
    var auto_btn_html;
    switch(window.location.host)
    {
        case "jwts-hit-edu-cn.ivpn.hit.edu.cn:1080":
        {
            auto_btn_html = '<a href="/xspjgd/toPjStart"><button style="position:fixed;right:450px;top:20px;z-index:10000">自动评教</button></a>'
            break;
        }
        case "vpn.hit.edu.cn":
        {
            auto_btn_html = '<a href="/,DanaInfo=jwts.hit.edu.cn+xspjgd/toPjStart"><button style="position:fixed;right:450px;top:20px;z-index:10000">自动评教</button></a>'
            break;
        }
    }

    var auto_btn = document.querySelector("#north");
    auto_btn.innerHTML = auto_btn.innerHTML + auto_btn_html;
};

// Run from this
(function()
{
    switch(window.location.href)
    {
        case 'https://vpn.hit.edu.cn/,DanaInfo=jwts.hit.edu.cn+main':
        case 'http://jwts-hit-edu-cn.ivpn.hit.edu.cn:1080/main':
        case 'http://jwts-hit-edu-cn.ivpn.hit.edu.cn:1080/loginLdap':
        case 'https://vpn.hit.edu.cn/,DanaInfo=jwts.hit.edu.cn+loginLdap':
        {
            addBtnTurnToPJXT();
            break;
        }
        default:
        {
            window.onload = addBtnAutoComplete;
            break;
        }
    }
})();
