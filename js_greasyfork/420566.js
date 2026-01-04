// ==UserScript==
// @name          知乎换肤，优化 by @傲世盛唐
// @namespace     zhihu_optimize@lhk
// @description   知乎换肤，自定义布局，回答全部展开，去广告以及其他很多细节的优化与调整
// @include       https://www.zhihu.com/*
// @include       https://www.zhihu.com/question/*
// @include       https://www.zhihu.com/people/*
// @match         https://www.zhihu.com/*
// @require       http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @resource      anime1_bg https://z3.ax1x.com/2021/06/20/RFK7xU.jpg
// @resource      anime2_bg https://z3.ax1x.com/2021/06/20/RFMAZd.jpg
// @resource      anime3_bg https://z3.ax1x.com/2021/06/20/RFMVII.jpg
// @resource      scenery1_bg https://z3.ax1x.com/2021/06/20/RFMMQS.jpg
// @resource      scenery2_bg https://z3.ax1x.com/2021/06/20/RFMDeJ.jpg
// @resource      scenery3_bg https://z3.ax1x.com/2021/06/20/RFMcJx.jpg
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_getResourceURL
// @grant         GM_getResourceText
// @version       1.2
// @author        @傲世盛唐
// @icon          https://raw.githubusercontent.com/linhaikun2019/zhihu_optimize-lhk/master/img/bitbug_favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/420566/%E7%9F%A5%E4%B9%8E%E6%8D%A2%E8%82%A4%EF%BC%8C%E4%BC%98%E5%8C%96%20by%20%40%E5%82%B2%E4%B8%96%E7%9B%9B%E5%94%90.user.js
// @updateURL https://update.greasyfork.org/scripts/420566/%E7%9F%A5%E4%B9%8E%E6%8D%A2%E8%82%A4%EF%BC%8C%E4%BC%98%E5%8C%96%20by%20%40%E5%82%B2%E4%B8%96%E7%9B%9B%E5%94%90.meta.js
// ==/UserScript==

'use strict'
$(function () {
    const skinSide =
          '<div class="side" id="skin_side" style="position: fixed;width: 60px;height: 35px;top: 150px;left:0;border-radius: 0px 10px 10px 0;background: rgba(255,246,143,0.8);font-size: 20px;line-height: 30px;padding-left: 10px;font-weight: bold;color: #B22222;box-shadow: 1px 1px 5px #B22222;cursor: pointer;"><span>换肤</span></div>' //定义换肤侧边栏
    const laySide =
          '<div class="side" id="lay_side" style="position: fixed;width: 60px;height: 35px;top: 200px;left:0;border-radius: 0px 10px 10px 0;background: rgba(255,193,193,0.8);font-size: 20px;line-height: 30px;padding-left: 10px;font-weight: bold;color: #9370DB;box-shadow: 1px 1px 5px #9370DB;cursor: pointer;"><span>布局</span></div>' //定义布局侧边栏
    const opSide =
          '<div class="side" id="op_side" style="position: fixed;width: 60px;height: 35px;top: 250px;left:0;border-radius: 0px 10px 10px 0;background: rgba(135,206,235,0.8);font-size: 20px;line-height: 30px;padding-left: 10px;font-weight: bold;color: #228B22;box-shadow: 1px 1px 5px #228B22;cursor: pointer;"><span>优化</span></div>' //定义优化侧边栏
    const aboutSide =
          '<div class="side" id="about_side" style="position: fixed;width: 60px;height: 35px;top: 300px;left:0;border-radius: 0px 10px 10px 0;background: rgba(179,238,58,0.8);font-size: 20px;line-height: 30px;padding-left: 10px;font-weight: bold;color: #00BFFF;box-shadow: 1px 1px 5px #00BFFF;cursor: pointer;"><span>关于</span></div>' //定义关于侧边栏
    const skinBoard =
          '<div class="skin" style="position: fixed;display:none;border: 1px solid #cccccc;width: 300px;height: 200px;z-index: 999;top: 150px;left:-350px;background: rgba(255, 246, 143, 0.8);border-radius: 10px;box-shadow: 1px 1px 5px #b22222;">' //定义换肤主面板
    const layBoard =
          '<div class="lay" style="position: fixed;display:none;border: 1px solid #CCCCCC;width: 300px;height: 200px;z-index: 999;top: 150px;left:-350px;background: rgba(255,193,193,0.8);border-radius: 10px;box-shadow: 1px 1px 5px #9370DB;"></div>' //定义布局主面板
    const opBoard =
          '<div class="op" style="position: fixed;display:none;border: 1px solid #CCCCCC;width: 300px;height: 200px;z-index: 999;top: 150px;left:-350px;background: rgba(135,206,235,0.8);border-radius: 10px;box-shadow: 1px 1px 5px #228B22;"></div>' //定义优化主面板
    const aboutBoard =
          '<div class="about" style="position: fixed;display:none;border: 1px solid #CCCCCC;width: 300px;height: 200px;z-index: 999;top: 150px;left:-350px;background: rgba(179,238,58,0.8);border-radius: 10px;box-shadow: 1px 1px 5px #00BFFF;"></div>' //定义关于主面板
    const skinMain =
          '<div class="skin_main" style="position: relative; width: 100%; height: auto"><span class="skin_cap" style="font-size: 20px;line-height: 28px;margin-left: 120px;color: #B22222;font-weight: bold;">换肤</span><span class="skin_close" title="关闭" style="margin-left: 115px;cursor:pointer;"><svg t="1604735816954" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3392" width="16" height="16"><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="3393" fill="#B22222"></path></svg></span></div>' //定义换肤面板
    const layMain =
          '<div class="lay_main" style="position: relative; width: 100%; height: auto"><span class="lay_cap" style="font-size: 20px;line-height: 28px;margin-left: 120px;color: #9370DB;font-weight: bold;">布局</span><span class="lay_close" title="关闭" style="margin-left: 115px;cursor:pointer;"><svg t="1604735816954" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3392" width="16" height="16"><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="3393" fill="#9370DB"></path></svg></span></div>' //定义布局面板
    const opMain =
          '<div class="op_main" style="position: relative; width: 100%; height: auto"><span class="op_cap" style="font-size: 20px;line-height: 28px;margin-left: 120px;color: #228B22;font-weight: bold;">优化</span><span class="op_close" title="关闭" style="margin-left: 115px;cursor:pointer;"><svg t="1604735816954" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3392" width="16" height="16"><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="3393" fill="#228B22"></path></svg></span></div>' //定义优化面板
    const aboutMain =
          '<div class="about_main" style="position: relative; width: 100%; height: auto"><span class="about_cap" style="font-size: 20px;line-height: 28px;margin-left: 120px;color: #00BFFF;font-weight: bold;">关于</span><span class="about_close" title="关闭" style="margin-left: 115px;cursor:pointer;"><svg t="1604735816954" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3392" width="16" height="16"><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="3393" fill="#00BFFF"></path></svg></span></div>' //定义关于面板
    const skinList =
          '<div class="skin_list" style="width: 240px;height: 150px;margin: 10px auto;margin-top: 5px;border-radius: 10px;background: rgba(255, 246, 143, 0.8);box-shadow: 1px 1px 5px #b22222 inset;"><form name="skin_form" action=""></form><ul style="padding: 5px;margin:0;display: inline-block;float: left;list-style: none;color:#B22222;"></ul></div>' //定义换肤列表
    const layList =
          '<div class="lay_list" style="width: 240px;height: 150px;margin: 10px auto;margin-top: 5px;border-radius: 10px;background: rgba(255,193,193,0.8);box-shadow: 1px 1px 5px #9370DB inset;"><form name="lay_form" action=""></form><ul style="padding: 5px;margin:0;display: inline-block;float: left;list-style: none;color:#9370DB;"></ul></div>' //定义布局列表
    const opList =
          '<div class="op_list" style="width: 240px;height: 150px;margin: 10px auto;margin-top: 5px;border-radius: 10px;background: rgba(135,206,235,0.8);box-shadow: 1px 1px 5px #228B22 inset;"><form name="op_form" action=""></form><ul style="padding: 5px;margin:0;display: inline-block;float: left;list-style: none;color:#228B22;"></ul></div>' //定义优化列表
    const aboutCard =
          '<div class="about_card" style="width: 240px;height: 150px;margin: 10px auto;margin-top: 5px;border-radius: 10px;background: rgba(179,238,58,0.8);box-shadow: 1px 1px 5px #00BFFF inset;"><div style="padding: 5px;margin:0;color:#00BFFF;"></div></div>' //定义关于卡片
    const [skinItem1, skinItem2, skinItem3, skinItem4, skinItem5, skinItem6, skinItem7, skinItem8,
           skinItem9,skinItem10
          ] = [
              '<li style="float: left; padding: 10px 0 0 10px;"><input type="radio" name="skin" id="skin1" value="skin1" style="cursor: pointer;"/><label for="skin1" style="cursor: pointer;">纯色1</label></li>',
              '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="skin" id="skin2" value="skin2" style="cursor: pointer;"/><label for="skin2" style="cursor: pointer;">纯色2</label></li>',
              '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="skin" id="skin3" value="skin3" style="cursor: pointer;"/><label for="skin3" style="cursor: pointer;">纯色3</label></li>',
              '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="skin" id="skin4" value="skin4" style="cursor: pointer;"/><label for="skin4" style="cursor: pointer;">动漫1</label></li>',
              '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="skin" id="skin5" value="skin5" style="cursor: pointer;"/><label for="skin5" style="cursor: pointer;">动漫2</label></li>',
              '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="skin" id="skin6" value="skin6" style="cursor: pointer;"/><label for="skin6" style="cursor: pointer;">动漫3</label></li>',
              '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="skin" id="skin7" value="skin7" style="cursor: pointer;"/><label for="skin7" style="cursor: pointer;">风景1</label></li>',
              '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="skin" id="skin8" value="skin8" style="cursor: pointer;"/><label for="skin8" style="cursor: pointer;">风景2</label></li>',
              '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="skin" id="skin9" value="skin9" style="cursor: pointer;"/><label for="skin9" style="cursor: pointer;">风景3</label></li>',
              '<li style="float: left; padding: 10px 0 0 70px"><input type="radio" name="skin" id="skin_none" value="skin_none" style="cursor: pointer;"/><label for="skin_none" style="cursor: pointer;">默认皮肤</label></li>'
          ] //定义所有皮肤选项
    const [layItem1, layItem2] = [
        '<li style="float: left; padding: 10px 0 0 10px;"><input type="radio" name="lay" id="lay1" value="lay1" style="cursor: pointer;"/><label for="lay1" style="cursor: pointer;">布局1</label></li>',
        '<li style="float: left; padding: 10px 0 0 10px"><input type="radio" name="lay" id="lay2" value="lay2" style="cursor: pointer;"/><label for="lay2" style="cursor: pointer;">布局2</label></li>'
    ] //定义所有布局选项
    const [opItem1, opItem2] = [
        '<li style="float: left; padding: 10px 0 0 10px;"><input type="checkbox" name="op1" id="op1" value="op1" style="cursor: pointer;"/><label for="op1" style="cursor: pointer;">问答页面默认展开</label></li>',
        '<li style="float: left; padding: 10px 0 0 10px"><input type="checkbox" name="op2" id="op2" value="op2" style="cursor: pointer;"/><label for="op2" style="cursor: pointer;">全站去广告</label></li>'
    ] //定义所有优化选项
    const [aboutText1, aboutText2] = [
        '<div class="aboutText1" style="padding: 10px 0 0 10px;"><span>一个优化知乎的小脚本，作者是@傲世盛唐，喜欢的点个赞吧~~<br>使用中有任何问题也请联系我反馈哦！感谢大家支持！</span></div>',
        '<div class="aboutText2" style="padding: 10px 0 0 45px;"><span id="github" title="GitHub" style="cursor:pointer;"><svg t="1604737286063" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4627" width="32" height="32"><path d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667" p-id="4628" fill="#00BFFF"></path></svg></span><span id="qq" title="QQ" style="margin-left:20px;cursor:pointer;"><svg t="1604737542804" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5524" width="32" height="32"><path d="M933.446 643.862c-18.784-108.945-97.673-180.323-97.673-180.323 11.268-98.92-30.056-116.461-30.056-116.461-8.701-306.05-272.335-300.692-277.87-300.546-5.542-0.146-269.211-5.505-277.872 300.548 0 0-41.325 17.54-30.055 116.461 0 0-78.895 71.378-97.676 180.323 0 0-10.034 184.083 90.16 22.544 0 0 22.544 61.344 63.867 116.455 0 0-73.897 25.062-67.621 90.165 0 0-2.518 72.618 157.784 67.625 0 0 112.702-8.757 146.516-56.35h29.795c33.809 47.595 146.514 56.35 146.514 56.35 160.262 4.993 157.781-67.625 157.781-67.625 6.238-65.103-67.62-90.165-67.62-90.165 41.324-55.11 63.862-116.455 63.862-116.455 100.156 161.537 90.164-22.546 90.164-22.546z" fill="#00BFFF" p-id="5525"></path></svg></span><span id="zhihu" title="知乎" style="margin-left:20px;cursor:pointer;"><svg t="1604737650283" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5770" width="32" height="32"><path d="M544.949 561.422s0-71.387-34.779-75.050c-34.779-3.663-142.775 0-142.775 0v-219.654h161.078s-1.83-73.219-32.949-73.219h-261.755l43.93-117.148s-65.897 3.663-89.692 45.761-98.844 252.604-98.844 252.604 25.627 10.983 67.726-20.134c42.101-31.116 56.743-86.033 56.743-86.033l76.879-3.663 1.83 223.316s-133.621-1.83-161.078 0c-27.457 1.83-42.101 75.050-42.101 75.050h203.182s-18.307 124.47-69.557 214.164c-53.085 89.692-151.929 161.078-151.929 161.078s71.387 29.287 140.947-10.983c69.557-42.101 120.811-223.316 120.811-223.316l162.912 203.182s14.643-97.013-1.83-124.47c-18.307-27.457-113.49-137.283-113.49-137.283l-42.101 36.607 29.287-120.811h177.552zM587.050 188.010l-1.83 660.793h65.897l23.795 82.37 115.321-82.37h162.912v-660.793h-366.091zM879.92 775.584h-76.879l-97.013 75.050-21.965-75.050h-20.134v-512.527h215.991v512.527z" fill="#00BFFF" p-id="5771"></path></svg></span></div>'
    ] //定义关于文字
    let skinFlag; //定义皮肤值
    let layFlag; //定义布局值
    let opFlag1; //定义优化值1
    let opFlag2; //定义优化值2
    let skinimg1; //定义皮肤背景图片1
    let skinimg2; //定义皮肤背景图片2
    let skinimg3; //定义皮肤背景图片3
    let skinimg4; //定义皮肤背景图片4
    let skinimg5; //定义皮肤背景图片5
    let skinimg6; //定义皮肤背景图片6

    //所有dom插入操作，生产html结构
    $('body').append(skinSide, laySide, opSide, aboutSide, skinBoard, layBoard, opBoard, aboutBoard);
    $('.skin').append(skinMain).append(skinList);
    $('.lay').append(layMain).append(layList);
    $('.op').append(opMain).append(opList);
    $('.about').append(aboutMain).append(aboutCard);
    $('.skin_list ul').append(skinItem1, skinItem2, skinItem3, skinItem4, skinItem5, skinItem6,
                              skinItem7, skinItem8, skinItem9,skinItem10);
    $('.lay_list ul').append(layItem1, layItem2);
    $('.op_list ul').append(opItem1, opItem2);
    $('.about_card div').append(aboutText1, aboutText2);

    //获取皮肤值设置页面皮肤
    if (location.href.indexOf('zhihu') != -1) {
        let skinvalue = GM_getValue("skinflag")
        switch (skinvalue) {
            case 1:
                $('body').css("background", "#FDF5E6");
                $('#skin1').prop('checked', true);
                break;
            case 2:
                $('body').css("background", "#F0FFFF");
                $('#skin2').prop('checked', true);
                break;
            case 3:
                $('body').css("background", "#F5F5DC");
                $('#skin3').prop('checked', true);
                break;
            case 4:
                skinimg1 = GM_getResourceURL("anime1_bg");
                $('body').css("background", `url( ${skinimg1})`);
                $('#skin4').prop('checked', true);
                break;
            case 5:
                skinimg2 = GM_getResourceURL("anime2_bg");
                $('body').css("background", `url( ${skinimg2})`);
                $('#skin5').prop('checked', true);
                break;
            case 6:
                skinimg3 = GM_getResourceURL("anime3_bg");
                $('body').css("background", `url( ${skinimg3})`);
                $('#skin6').prop('checked', true);
                break;
            case 7:
                skinimg4 = GM_getResourceURL("scenery1_bg");
                $('body').css("background", `url( ${skinimg4})`);
                $('#skin7').prop('checked', true);
                break;
            case 8:
                skinimg5 = GM_getResourceURL("scenery2_bg");
                $('body').css("background", `url( ${skinimg5})`);
                $('#skin8').prop('checked', true);
                break;
            case 9:
                skinimg6 = GM_getResourceURL("scenery3_bg");
                $('body').css("background", `url( ${skinimg6})`);
                $('#skin9').prop('checked', true);
                break;
            case 10:
                $('body').css("background","#f6f6f6" );
                $('#skin_none').prop('checked', true);
                break;
        }

    }

    //获取布局值设置页面布局
    if (location.href.indexOf('zhihu') != -1) {
        let layvalue = GM_getValue("layflag")
        if (layvalue === 1) {
            GM_addStyle(".Topstory-mainColumn {-ms-flex-negative:0;flex-shrink:0;margin-right:10px;margin-bottom:0;width:694px;margin-left:0;} ");
            GM_addStyle(".GlobalSideBar {-webkit-box-flex:1;-ms-flex:1 1;flex:1 1;font-size:14px;position:relative;} ");
            GM_addStyle(".Collections-mainColumn {-ms-flex-negative:0;flex-shrink:0;margin-right:10px;margin-bottom:0;width:694px;margin-left:0;} ");
            GM_addStyle(".Notifications-Main {margin-right:10px;margin-bottom:0;width:694px;margin-left:0;} ");
            GM_addStyle(".Profile-mainColumn {width:694px;margin-left:0;} ");
            GM_addStyle(".Profile-sideColumn {width:296px;color:#646464;position:relative;} ");
            GM_addStyle(".Question-mainColumn {width:694px;padding-bottom:20px;margin-left:0;} ");
            GM_addStyle(".Question-sideColumn {width:296px;position:relative;} ");
            $('#lay1').prop('checked', true);

        }else if(layvalue === 2) {
            GM_addStyle(".Topstory-mainColumn {margin-left:306px;} ");
            GM_addStyle(".GlobalSideBar {position:absolute;width:296px;} ");
            GM_addStyle(".Collections-mainColumn {margin-left:306px;} ");
            GM_addStyle(".Notifications-Main {margin-left:306px;} ");
            GM_addStyle(".Profile-mainColumn {margin-left:306px;} ");
            GM_addStyle(".Profile-sideColumn {position:absolute;width:296px;} ");
            GM_addStyle(".Question-mainColumn {margin-left:306px;}");
            GM_addStyle(".Question-sideColumn {position:absolute;} ");
            $('#lay2').prop('checked', true);


        }

    }

    //获取优化值优化页面
    if (location.href.indexOf('zhihu') != -1) {
        let opvalue1 = GM_getValue("opflag1");
        let opvalue2 = GM_getValue("opflag2");
        console.log(opvalue1,opvalue2)
        if (opvalue1 === 1) {
            if (location.href.indexOf('/question/') != -1) {
                if(document.querySelector(".QuestionMainAction")){
                    document.querySelector(".QuestionMainAction").click();
                }
            }
            $('#op1').prop('checked', true);
            $('#op1').attr('disabled', true);
            $('#op1').next("label").css('color', 'gray');
        }
        if(opvalue2 === 2){
            removeAds();
            window.onscroll = throttle(function () {
                removeAds();
            }, 2000)
            $('#op2').prop('checked', true);
            $('#op2').attr('disabled', true);
            $('#op2').next("label").css('color', 'gray');
        }


    }


    //关于图标链接跳转
    $('.aboutText2 #github').click(function () {
        window.open('https://github.com/linhaikun2019/zhihu_optimize-lhk');
    })
    $('.aboutText2 #qq').click(function () {
        window.open('http://wpa.qq.com/msgrd?v=3&uin=2735982878');
    })
    $('.aboutText2 #zhihu').click(function () {
        window.open('https://www.zhihu.com/people/lin-da-82-29-80');
    })

    //侧边栏悬浮特效
    $('.side').hover(function () {
        $(this).css('box-shadow', '1px 1px 10px');
    }, function () {
        $(this).css('box-shadow', '1px 1px 5px');
    })

    //换肤面板打开特效
    $('#skin_side').click(function () {
        $('.skin').show().animate({
            left: '0'
        }, 'fast');
        $('.side').hide();
    })

    //布局面板打开特效
    $('#lay_side').click(function () {
        $('.lay').show().animate({
            left: '0'
        }, 'fast');
        $('.side').hide();
    })

    //优化面板打开特效
    $('#op_side').click(function () {
        $('.op').show().animate({
            left: '0'
        }, 'fast');
        $('.side').hide();
    })

    //关于面板打开特效
    $('#about_side').click(function () {
        $('.about').show().animate({
            left: '0'
        }, 'fast');
        $('.side').hide();
    })

    //换肤面板关闭特效
    $('.skin_close').click(function () {
        $(this).parents('.skin').animate({
            left: '-350px'
        }, "fast");
        $('.side').show();
    })

    //布局面板关闭特效
    $('.lay_close').click(function () {
        $(this).parents('.lay').animate({
            left: '-350px'
        }, "fast");
        $('.side').show();
    })

    //优化面板关闭特效
    $('.op_close').click(function () {
        $(this).parents('.op').animate({
            left: '-350px'
        }, "fast");
        $('.side').show();
    })

    //关于面板关闭特效
    $('.about_close').click(function () {
        $(this).parents('.about').animate({
            left: '-350px'
        }, "fast");
        $('.side').show();
    })

    //换肤功能
    $("input[type='radio']").click(function () {
        let val = $('input:radio[name="skin"]:checked').val();
        switch (val) {
            case 'skin1':
                $('body').css('background', '#FDF5E6');
                skinFlag = 1;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin2':
                $('body').css('background', '#F0FFFF');
                skinFlag = 2;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin3':
                $('body').css('background', '#F5F5DC');
                skinFlag = 3;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin4':
                skinimg1 = GM_getResourceURL("anime1_bg");
                $('body').css("background", `url( ${skinimg1})`);
                skinFlag = 4;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin5':
                skinimg2 = GM_getResourceURL("anime2_bg");
                $('body').css("background", `url( ${skinimg2})`);
                skinFlag = 5;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin6':
                skinimg3 = GM_getResourceURL("anime3_bg");
                $('body').css("background", `url( ${skinimg3})`);
                skinFlag = 6;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin7':
                skinimg4 = GM_getResourceURL("scenery1_bg");
                $('body').css("background", `url( ${skinimg4})`);
                skinFlag = 7;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin8':
                skinimg5 = GM_getResourceURL("scenery2_bg");
                $('body').css("background", `url( ${skinimg5})`);
                skinFlag = 8;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin9':
                skinimg6 = GM_getResourceURL("scenery3_bg");
                $('body').css("background", `url( ${skinimg6})`);
                skinFlag = 9;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
            case 'skin_none':
                $('body').css("background","#f6f6f6" );
                skinFlag = 10;
                GM_deleteValue("skinflag");
                GM_setValue("skinflag", skinFlag);
                break;
        }
    });

    //换布局功能
    $("input[type='radio']").click(function () {
        let val = $('input:radio[name="lay"]:checked').val();
        if(val === "lay1"){ //布局一
            if (location.href.indexOf('zhihu') != -1) { //首页，收藏，消息，个人主页，问答页
                GM_addStyle(".Topstory-mainColumn {-ms-flex-negative:0;flex-shrink:0;margin-right:10px;margin-bottom:0;width:694px;margin-left:0;} ");
                GM_addStyle(".GlobalSideBar {-webkit-box-flex:1;-ms-flex:1 1;flex:1 1;font-size:14px;position:relative;} ");
                GM_addStyle(".Collections-mainColumn {-ms-flex-negative:0;flex-shrink:0;margin-right:10px;margin-bottom:0;width:694px;margin-left:0;} ");
                GM_addStyle(".Notifications-Main {margin-right:10px;margin-bottom:0;width:694px;margin-left:0;} ");
                GM_addStyle(".Profile-mainColumn {width:694px;margin-left:0;} ");
                GM_addStyle(".Profile-sideColumn {width:296px;color:#646464;position:relative;} ");
                GM_addStyle(".Question-mainColumn {width:694px;padding-bottom:20px;margin-left:0;} ");
                GM_addStyle(".Question-sideColumn {width:296px;position:relative;} ");
            }
            layFlag = 1;
            GM_deleteValue("layflag");
            GM_setValue("layflag", layFlag);
        }else if(val === "lay2"){
            if (location.href.indexOf('zhihu') != -1) { //首页，收藏，消息，个人主页，问答页
                GM_addStyle(".Topstory-mainColumn {margin-left:306px;} ");
                GM_addStyle(".GlobalSideBar {position:absolute;width:296px;} ");
                GM_addStyle(".Collections-mainColumn {margin-left:306px;} ");
                GM_addStyle(".Notifications-Main {margin-left:306px;} ");
                GM_addStyle(".Profile-mainColumn {margin-left:306px;} ");
                GM_addStyle(".Profile-sideColumn {position:absolute;width:296px;} ");
                GM_addStyle(".Question-mainColumn {margin-left:306px;}");
                GM_addStyle(".Question-sideColumn {position:absolute;} ");
            }
            layFlag = 2;
            GM_deleteValue("layflag");
            GM_setValue("layflag", layFlag);
        }
    });

    //优化功能
    $("input[type='checkbox']").each(function () {
        $("input[type='checkbox']").click(function(){
            if($(this).attr("id") == "op1"){ //问答全部展开
                if($(this).prop('checked') === true){
                    if (location.href.indexOf('/question/') != -1) {
                        if(document.querySelector(".QuestionMainAction")){
                            document.querySelector(".QuestionMainAction").click();
                        }
                    }
                    $('#op1').attr('disabled', true);
                    $('#op1').next("label").css('color', 'gray');
                    opFlag1 = 1;
                    GM_setValue("opflag1", opFlag1);
                }
            }else if($(this).attr("id") == "op2"){ //全站去广告
                if($(this).prop('checked') === true){
                    removeAds();
                    window.onscroll = throttle(function () {
                        removeAds();
                    }, 2000)
                    $('#op2').attr('disabled', true);
                    $('#op2').next("label").css('color', 'gray');
                    opFlag2 = 2;
                    GM_setValue("opflag2", opFlag2);
                }
            }
        })

    })

    /*
    以下全站去广告代码借鉴自@coderben2017这位大佬的知乎去广告、视频脚本
    原理是滚动屏幕时一旦生成广告就可以屏蔽，但不确保可以一直有效
    */
    function removeAds() {
        document.querySelectorAll('.Pc-feedAd-container').forEach(function (elem) {
            elem.style.display = 'none'
        })
        document.querySelectorAll('.Pc-card').forEach(function (elem) {
            elem.style.display = 'none'
        })
    }

    function throttle(func, delay) {
        let last;
        return function () {
            const _this = this;
            const _args = arguments;
            const now = +new Date();
            if (last && now < last + delay) {
                clearTimeout(func.tid);
                func.tid = setTimeout(function () {
                    last = now;
                    func.call(_this, [..._args]);
                }, delay);
            } else {
                last = now;
                func.call(_this, [..._args]);
            }
        }
    }


})();